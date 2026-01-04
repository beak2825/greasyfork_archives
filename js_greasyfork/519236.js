// ==UserScript==
// @name         牛马笔记
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  工时统计
// @author       Cme
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @match        https://dffl-hr.dongfangfuli.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dongfangfuli.com
// @grant        GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_addElement
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519236/%E7%89%9B%E9%A9%AC%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/519236/%E7%89%9B%E9%A9%AC%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let holidays = []; // 放假时间
	let addWorkday = []; // 调休加班日期，需要上班的
	let sum = 0;
	let fifthColumnValues = [];

	// 获取全年和节假日有关的日期，包括放假时间和调休时间
	function getHolidaysByYear(year, callback) {
		GM_xmlhttpRequest({
			method: "GET",
			url: `https://timor.tech/api/holiday/year/${year}`,
			onload: function(response) {
				let holidays = []; // 放假时间
				let addWorkday = []; // 调休加班日期，需要上班的
				const holiday = JSON.parse(response.response).holiday;
				for (let day in holiday) {
					if (holiday[day].holiday) {
						holidays.push(holiday[day].date)
					} else {
						addWorkday.push(holiday[day].date)
					}
				}
				callback?.()
			}
		});
	}

	function isWeekend(date) {
		var day = date.getDay();
		return day === 0 || day === 6;
	}

	function isWorkDay(dataStr) {
		if (isWeekend(new Date(dataStr))) {
			// 判断是否属于调休日期
			return addWorkday.includes(dataStr);
		} else {
			// 判断是否属于法定节假日期
			return !holidays.includes(dataStr)
		}
	}

	function adjustStartTime(startTime) {
		var startTimeDate = new Date(startTime);
		var nineAM = new Date(startTimeDate.getFullYear(), startTimeDate.getMonth(), startTimeDate.getDate(), 9, 0,
			0);
		if (startTimeDate < nineAM) {
			return nineAM;
		}
		return startTimeDate;
	}
	// 监听键盘事件
	document.addEventListener('keydown', function(event) {
		// 判断是否按下了 Shift 和 Ctrl 键
		if (event.ctrlKey && event.key.toLowerCase() === 'm') {
			sum = 0;
			fifthColumnValues = [];
			getHolidaysByYear(new Date().getFullYear(), function() {
				$("#wincontainer #KFrame").contents().find("#G_A3 tr").map((index, item) => {
					var e = item.children[0].innerText,
						o = item.children[5].innerText,
						t = item.children[6].innerText;
					if (o !== "" && t !== "") {
						if (isWorkDay(e)) {
							var adjustedStartTime = adjustStartTime(o);
							var workHours = ((new Date(t) - adjustedStartTime) / 36e5)
								.toFixed(2);
							var netWorkHours = (parseFloat(workHours) - 1).toFixed(2);

							fifthColumnValues.push(netWorkHours);
							sum += parseFloat(netWorkHours);
						}
					}
				})
				Swal.fire({
					title: `牛马笔记`,
					html: `
		<div style="display:flex;flex-direction: column">
			<div style="display:flex;justify-content: space-around;"><div>耕地天数:</div><div>${fifthColumnValues.length}</div></div>
			<div style="display:flex;justify-content: space-around;"><div>耕地时长:</div><div>${sum.toFixed(2)}</div></div>
			<div style="display:flex;justify-content: space-around;"><div>平均数:</div><div>${(sum / fifthColumnValues.length).toFixed(2)}</div></div>
		</div>
		`,
					showDenyButton: true,
					denyButtonText: `继续犁地`,
					confirmButtonText: '歇会儿再干'
				}).then((result) => {
					if (result.isDenied) {
						alert('好样的～')
					}
					if (result.isConfirmed) {
						alert('歇什么歇，继续干！')
					}
				});
				console.log("%c----总天数----" + fifthColumnValues.length,
					"color: red; font-size: 30px;");
				console.log("%c----总小时----" + sum.toFixed(2), "color: green ; font-size: 30px;");
				console.log("%c----平均数----" + (sum / fifthColumnValues.length).toFixed(2),
					"color: blue; font-size: 30px;");
			})
		}
	});

})();