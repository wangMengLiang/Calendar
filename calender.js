			
			var miller_calender_html = '<div id="calender">' +
											'<div id="calender-header">' +
												'<div id="month-view">' +
													'<img id="left-arrow" class="arrow-style" src="https://test.yusi.tv/web_images/qinhangmobile/mycourse/date_left.png" onclick="beforeMonth()" />' +
													'<div style="margin: 0 15px;">2018年7月</div>' +
													'<img id="right-arrow" class="arrow-style" src="https://test.yusi.tv/web_images/qinhangmobile/mycourse/date_right.png" onclick="nextMonth()" />' +
												'</div>' +
												'<div id="week-view"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>' +
											'</div>' +
											'<div id="date-view">' +
												'<div class="date-row" hidden="hidden">' +
													'<div class="date-item" hidden="hidden"><div>30</div></div>' +
												'</div></div></div>'; 

			$("#miller-calender").html(miller_calender_html);
			
			var cur_month = new Date().getMonth() + 1;
			var cur_year = new Date().getFullYear();
			function beforeMonth(){
				cur_month -= 1;
				if (cur_month < 1) {
					cur_month = 12;
					cur_year -= 1;
				}
				setDate();
			}
			function nextMonth(){
				cur_month += 1;
				if (cur_month > 12) {
					cur_month = 1;
					cur_year += 1;
				}
				
				setDate();
			}
			$(".date-row[hidden='hidden']").hide();
			$(".date-row[hidden='hidden']").children().hide();
			var has_class_list = [];
			function setDate(datelist = []) {
				if (datelist.length > 0) has_class_list = datelist;
				
				$(".date-row[hidden!='hidden']").remove();
				$("#month-view div").text(cur_year+'年'+cur_month+'月');

				var $date_row = $(".date-row");
				var $date_item = $(".date-item");
				var monthDate = getMonthDate(cur_month);

				for(var i = 0; i < monthDate.length; i++) {
					var $clone_row = $date_row.clone();
					$clone_row.removeAttr('hidden');
					$clone_row.show();
					$("#date-view").append($clone_row);
					
					for(var j = 0; j < 7; j++){
						var $clone_item = $date_item.clone();
						$clone_item.removeAttr('hidden');
						$clone_item.show();
						$clone_item.children().text(monthDate[i][j].day);

						var date_now = new Date();
						var vs_date = new Date(monthDate[i][j].date.replace(/-/g, '/'));
						//当天
						if (date_now.getDate() == monthDate[i][j].day && 
							vs_date.getMonth() == date_now.getMonth() && 
							vs_date.getFullYear() == date_now.getFullYear()) {
							$clone_item.addClass("cur-day");
						}
	
						//有课
						$.each(has_class_list, function(index, obj) {
							var t_date = new Date(obj.replace(/-/g, '/'));
							if (t_date.getDate() == monthDate[i][j].day && 
								t_date.getMonth() == vs_date.getMonth() && 
								t_date.getFullYear() == vs_date.getFullYear()) {
									
								$clone_item.append("<span class='hasClass'>&bull;</span>");
							}
						});

						$clone_row.append($clone_item);
					}
				}
			}
			
			function getMonthDate(month){
				var month_date = getMonthDay(month);
				//拼接第一周  
				if (month_date[0].length < 7) {
					var before_monthDate = getMonthDay(month-1);
					month_date[0] = before_monthDate[before_monthDate.length-1].concat(month_date[0]);
				}
				//最后一周
				if (month_date[month_date.length-1].length < 7) {
					var next_monthDate = getMonthDay(month+1);
					month_date[month_date.length-1] = month_date[month_date.length-1].concat(next_monthDate[0]);
				}
				cur_month = month;
				return month_date;
			}
			
			
			function getMonthDay(month) {
				var fullYear = cur_year;
				if (month > 12) {
					month = 1;
					fullYear += 1;
				}
				if (month < 1) {
					month = 12;
					fullYear -= 1;
				}
				
				let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
				
				var month_date = [];
				var week_date = [];
				for(var i = 1; i <= lastDayOfMonth; i++) {
					var dateStr = fullYear + '-' + month + '-' + i;
					var ios_dataStr = dateStr.replace(/-/g, '/');
					
					var t_date = new Date(ios_dataStr);
					var week_num = t_date.getDay();
					
					//逢周日 将每周数据添加   并初始化 及特殊情况处理
					if ((week_num == 0 && i != 1) || i == lastDayOfMonth) {
						month_date.push(week_date);
						if (i != lastDayOfMonth) {
							week_date = [];
						}
						if (i == lastDayOfMonth && week_date.length == 7) {
							week_date = [];
							month_date.push(week_date);
						}
					}
					week_date.push({day: i, date: dateStr});
				};
				return month_date;
			}