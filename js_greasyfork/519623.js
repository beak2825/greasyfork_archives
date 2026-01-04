// ==UserScript==
// @name         工时统计
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  工时统计1
// @author       Cme
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @match        https://dffl-hr.dongfangfuli.com/DFFL/Home/Homeess.aspx?&fromSSO=1
// @match        https://dffl-hr.dongfangfuli.com/DFFL/FormEx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dongfangfuli.com
// @grant        GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_addElement
// @grant       GM_addStyle
// @connect      *
// @connect      timor.tech
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519623/%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/519623/%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let style = `
	.i-layout{
		height: 100vh;
	}
	.nm-content {
		display:flex;
		flex-direction: column
	}
	.nm-item {
		display:flex;
		justify-content: space-between;
		padding: 0 25%;
	}
	.nm-item-title {
		width:40%;
		text-align: left;
	}
	`
	GM_addStyle(style);

	let holidays = []; // 放假时间
	let addWorkday = []; // 调休加班日期，牛马们需要上班的
	let sum = 0;
	let fifthColumnValues = [];
	let menus

    function formatDateTime(date = new Date()) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours()
        const minutes = date.getMinutes()
        // 补0操作
        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        // 返回格式化后的日期字符串
        return {
            year,
            month: formattedMonth,
            day: formattedDay,
            hours: formattedHours,
            minutes: formattedMinutes,
            dateStr: `${year}-${formattedMonth}-${formattedDay}`
        };
    }

	// 获取全年和节假日有关的日期，包括放假时间和调休时间
	function getHolidaysByYear(year, callback) {
		GM_xmlhttpRequest({
			method: "GET",
			url: `https://timor.tech/api/holiday/year/${year}`,
			onload: function(response) {
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
			// 是否属于调休日期
			return addWorkday.includes(dataStr);
		} else {
			// 是否属于法定节假日期
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

	function chunkArray(array, chunkSize) {
		const chunks = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize));
		}
		return chunks;
	}

	function requestData(data, callback) {
		GM_xmlhttpRequest({
			method: "POST",
			url: `https://dffl-hr.dongfangfuli.com/DFFL/Tools/Others/AjaxJSONProcess.aspx`,
			headers: {
				'Content-Type': 'text/html',
				'x-requested-with': 'XMLHttpRequest',
				'kytk': $x.top()._KYTK
			},
			data,
			onload: function(response) {
				callback(response.response)
			}
		});
	}

	function formatCurrentTimeWithTimeZone(date, timeZone = '+08:00') {
		let now = date ? new Date(date) : new Date();
		let totalMilliseconds = now.getTime();
		let offsetInMinutes = -now.getTimezoneOffset();
		let offsetInHours = Math.floor(offsetInMinutes / 60);
		offsetInMinutes = offsetInMinutes % 60;
		let sign = offsetInHours >= 0 ? '+' : '-';
		let offsetString =
			`${sign}${String(offsetInHours).padStart(2, '0')}:${String(offsetInMinutes).padStart(2, '0')}`;
		let dateWithTimeZone = new Date(totalMilliseconds + (offsetInMinutes * 60 * 1000));
		let isoString = dateWithTimeZone.toISOString().replace('Z', '');
		return `${isoString}${offsetString}`;
	}
	// 获取最近一个月的
	function getNearMonth(callback) {
		const sid = menus.find(item => item.title == '考勤明细').sid
		requestData(
			`{"IsPop":0,"FuncName":"fm.WindowProcess.GetTableContext"}{:ky->w{"Path":"1.1001.1381:100","Parameters":{"TERM":"${formatCurrentTimeWithTimeZone()}"},"Data":{"A3":{"Data":{},"Parameters":{},"Selects":[],"FilterInf":[],"Search":"","Filter":"","Sorts":[],"AllowChoice":true,"PKey":""}},"Width":1254,"Height":883,"Url":"https://dffl-hr.dongfangfuli.com/DFFL/Window/Window.aspx?wind=210041&path=1.1001.1381:100&sid=${sid}","Init":true,"CurrentForm":"A3","ParamHtml":"","WinType":"205","Popup":true}`,
			(str) => {
				let throws = [];
				const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
				let thMatch;
				while ((thMatch = thRegex.exec(str)) !== null) {
					thMatch[1] && thMatch[1].indexOf('img') < 0 && thMatch[1].indexOf('tr') < 0 &&
						thMatch[1].indexOf('异常') < 0 && throws.push(thMatch[1]);
				}
				let rows = [];
				const trRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
				let trMatch;
				while ((trMatch = trRegex.exec(str)) !== null) {
					trMatch[1].indexOf('img') < 0 && rows.push(trMatch[1]);
				}
				let result = []
				result = chunkArray(rows, throws.length).map((item, index) => {
					return {
						date: item[0],
						start: item[5],
						end: item[6]
					}
				})
				callback(result)
			})
	}
	// 获取历史月份的
	function getHistoryMonth(start, end, callback) {
		const sid = menus.find(item => item.title == '考勤明细').sid
		requestData(
			`{"FuncName":"fm.WindowProcess.GetUpdateFramework"}{:ky->w{"Path":"1.1001.1381:100","Parameters":{"TERM":"${formatCurrentTimeWithTimeZone()}"},"Data":{"A3":{"Data":{},"Parameters":{},"Selects":[]},"A4":{"Data":{},"Parameters":{"TERM":"${start}","ENDDATE":"${end}","_PARAMPOPED":1},"Selects":[],"FMKey":"A4","PKey":""}},"Width":1254,"Height":883,"Url":"https://dffl-hr.dongfangfuli.com/DFFL/Window/Window.aspx?wind=210041&path=1.1001.1381:100&sid=${sid}","Init":true,"CurrentForm":"A4","ParamHtml":"","WinType":"205","Popup":true}`,
			(str) => {
				let throws = [];
				const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
				let thMatch;
				while ((thMatch = thRegex.exec(str)) !== null) {
					thMatch[1] && thMatch[1].indexOf('img') < 0 && thMatch[1].indexOf('tr') < 0 && thMatch[1]
						.indexOf('异常') < 0 && throws.push(thMatch[1]);
				}
				let rows = [];
				let dates = []
				const trRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
				let trMatch;
				let findNo = false
				while ((trMatch = trRegex.exec(str)) !== null) {
					if (trMatch[1].indexOf('img') < 0) {
						if (trMatch[1].indexOf('SH-') > -1) findNo = true
						findNo ? rows.push(trMatch[1]) : dates.push(trMatch[1])
					}
				}
				let result = []
				result = chunkArray(rows, throws.length - 1).map((item, index) => {
					return {
						date: dates[index],
						start: item[4],
						end: item[5]
					}
				})
				callback(result)
			})
	}

	function auto() {
		getHolidaysByYear(new Date().getFullYear(), function() {
			sum = 0;
			fifthColumnValues = [];
			getNearMonth((result) => {
				let mainDate = new Date()
				if (new Date().getDate() < 5) {
					mainDate = new Date(new Date().setDate(new Date().getDate() -
						4))
				}
				result = result.filter(item => {
					const {
						date: e,
						start: o,
						end: t
					} = item
					return new Date(e).getMonth() == mainDate.getMonth()
				})
                let resultTable = [];
				result.map(item => {
					const {
						date: e,
						start: o,
						end: t
					} = item
					if (o !== "" && t !== "") {
						if (isWorkDay(e)) {
							var adjustedStartTime = adjustStartTime(o);
							var workHours = ((new Date(t) - adjustedStartTime) /
									36e5)
								.toFixed(2);
							var netWorkHours = (parseFloat(workHours) - 1)
								.toFixed(2);
                            var {dateStr: startDate, hours: startHours, minutes: startMin} = formatDateTime(adjustedStartTime);
                            var {dateStr: endDate, hours: endHours, minutes: endMin} = formatDateTime(new Date(t))
                            resultTable.push({
                                日期: e,
                                上班打卡: `${startDate} ${startHours}:${startMin}`,
                                下班打卡: `${endDate} ${endHours}:${endMin}`,
                                工时: `${workHours}小时`
                            })
							fifthColumnValues.push(netWorkHours);
							sum += parseFloat(netWorkHours);
						}
					}
				})
                console.table(resultTable)
				renderResult(`${result[0].date}——${result[result.length - 1].date}`)
			})
		})
	}

	function renderResult(title = '') {
		$x.top().KYInfo(
			`总天数：\t${fifthColumnValues.length}\n总工时：\t${sum.toFixed(2)}\n平均数：\t${(sum / fifthColumnValues.length).toFixed(2)}`,
			title, () => {}, {
				a: 1
			})
		console.log("%c统计日期：" + title,
			"color: red; font-size: 30px;");
		console.log("%c----总天数----" + fifthColumnValues.length,
			"color: red; font-size: 30px;");
		console.log("%c----总小时----" + sum.toFixed(2),
			"color: green ; font-size: 30px;");
		console.log("%c----平均数----" + (sum / fifthColumnValues.length).toFixed(
				2),
			"color: blue; font-size: 30px;");
	}

	function getMenus(callback) {
		GM_xmlhttpRequest({
			method: "POST",
			url: `https://dffl-hr.dongfangfuli.com/DFFL/Tools/Others/AjaxJSONProcess.aspx`,
			headers: {
				'Content-Type': 'text/html',
				'x-requested-with': 'XMLHttpRequest',
				'Kytk': $x.top()._KYTK,
			},
			data: JSON.stringify({
				FuncName: "fm.HomeProcess.HomeHRService",
				agentid: "-1",
				bandop: 1,
				hrid: "1",
				lgid: "2052",
				opcmd: "MNULST",
				optitle: "",
				ruid: "0",
				sid: ""
			}),
			onload: function(response) {
				const htmlStr = JSON.parse(response.response).data.fmenus
				const sidRegex = /sid='([^']*)'/g;
				let sidMatch;
				const sidList = [];
				while ((sidMatch = sidRegex.exec(htmlStr)) !== null) {
					sidList.push(sidMatch[1]);
				}

				const aTextRegex = /<a\s+class='mnutitle'>([^<]*)<\/a>/g;
				let aTextMatch;
				const aTextList = [];
				while ((aTextMatch = aTextRegex.exec(htmlStr)) !== null) {
					aTextList.push(aTextMatch[1]);
				}

				menus = aTextList.map((item, index) => ({
					title: item,
					sid: sidList[index]
				}))
				callback()
			}
		});

	}

	function getNearDate() {
		if (new Date().getDate() < 5) {
			const nearInfo = new Date(new Date().setDate(new Date().getDate() - 5))
			return {
				nearYear: nearInfo.getFullYear(),
				nearMonth: nearInfo.getMonth()
			}
		} else {
			return {
				nearYear: new Date().getFullYear(),
				nearMonth: new Date().getMonth() + 1
			}
		}
	}

	setTimeout(() => {
		getMenus(() => {
			const url = new URL($x.top().location.href);
			const searchParams = new URLSearchParams(url.search);
			const queryYear = searchParams.get("year") || new Date().getFullYear()
			const queryMonth = searchParams.get("month") || new Date().getMonth() + 1
			const {
				nearYear,
				nearMonth
			} = getNearDate()
			if (queryMonth) {
				if (queryMonth < nearMonth || queryYear < nearYear) {
					getHolidaysByYear(queryYear, function() {
						sum = 0;
						fifthColumnValues = [];
						getHistoryMonth(formatCurrentTimeWithTimeZone(
								`${queryYear}-${queryMonth}-01`),
							formatCurrentTimeWithTimeZone(
								`${queryYear}-${queryMonth}-${new Date(queryYear, queryMonth, 0).getDate()}`
							), (result) => {
                                let resultTable = [];
								result.map(item => {
									const {
										date: e,
										start: o,
										end: t
									} = item
									if (o !== "" && t !== "") {
										if (isWorkDay(e)) {
											var adjustedStartTime =
												adjustStartTime(o);
											var workHours = ((new Date(t) -
														adjustedStartTime) /
													36e5)
												.toFixed(2);
											var netWorkHours = (parseFloat(
													workHours) - 1)
												.toFixed(2);
                                            var {dateStr: startDate, hours: startHours, minutes: startMin} = formatDateTime(adjustedStartTime);
                                            var {dateStr: endDate, hours: endHours, minutes: endMin} = formatDateTime(new Date(t))
                                            resultTable.push({
                                                日期: e,
                                                上班打卡: `${startDate} ${startHours}:${startMin}`,
                                                下班打卡: `${endDate} ${endHours}:${endMin}`,
                                                工时: `${workHours}小时`
                                            })
											fifthColumnValues.push(
												netWorkHours);
											sum += parseFloat(netWorkHours);
										}
									}
								})
                                console.table(resultTable)
								renderResult(
									`${result[0].date}——${result[result.length - 1].date}`
								)
							})
					})
				} else {
					auto()
				}
			} else {
				auto()
			}

		})
	}, 800)
})();