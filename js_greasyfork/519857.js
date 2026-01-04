// ==UserScript==
// @name         随记
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  随手记
// @author       Cme
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @match		 */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dongfangfuli.com
// @grant       GM_notification
// @grant       GM_addElement
// @grant       GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519857/%E9%9A%8F%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/519857/%E9%9A%8F%E8%AE%B0.meta.js
// ==/UserScript==

/**
 *
 *
[
	{
		date: 2024-12-04
		note: [
			{
				time: 9,
				content:'',
				ignore: false
			}
		]
	}
]
 *
 *
 *
 */

(function() {
	'use strict';
	let style = `
	.full {
		color: #247DFF;
		white-space: break-spaces;
		align-items: baseline;
		font-size: 10px;
		cursor: pointer;
	}
	.empty {
		color:red;
		white-space: break-spaces;
		align-items: baseline;
		font-size: 10px;
		cursor: pointer;
	}
	`
	GM_addStyle(style);
	GM_addElement('script', {
		src: 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js',
		type: 'text/javascript'
	});

	function readFromFile() {
		GM_xmlhttpRequest({
			method: "GET",
			url: `http://localhost:3210/`,
			onload: function(response) {
				console.log(response.response)
			},
			onerror: function(err) {
				console.log(err)
			}
		});
	}

	function saveToFile() {
		GM_xmlhttpRequest({
			method: "POST",
			data: GM_getValue('SJ') || '[]',
			url: `http://localhost:3210/`,
			onload: function(response) {
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Your work log has been saved to a local file.',
					showConfirmButton: false,
					timer: 2000
				})
			},
			onerror: function(err) {
				console.log(err)
				Swal.fire({
					position: 'top-end',
					icon: 'error',
					title: '保存失败，检查服务',
					showConfirmButton: false,
					timer: 2000
				})
			}
		});
	}

	function formatDateTime(date = new Date()) {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours()
		// 补0操作
		const formattedMonth = month < 10 ? '0' + month : month;
		const formattedDay = day < 10 ? '0' + day : day;
		// 返回格式化后的日期字符串
		return {
			year,
			month: formattedMonth,
			day: formattedDay,
			hours,
			dateStr: `${year}-${formattedMonth}-${formattedDay}`
		};
	}
	// 初始化生成当前的笔记单
	function generateDailyNotes() {
		const {
			dateStr
		} = formatDateTime(); // 格式化日期为YYYY-MM-DD
		const notes = []; // 初始化笔记数组
		for (let hour = 9; hour <= 22; hour++) {
			if (hour === 12) continue;
			notes.push({
				time: hour,
				content: '',
				ignore: false
			});
		}
		const dailyNotes = {
			date: dateStr,
			note: notes
		};
		return dailyNotes;
	}
	// 检查指定时间的笔记是否填写
	function checkNoteFill(dailyNotes, hour) {
		const note = dailyNotes.note.find(n => n.time === hour && !n.content.trim() && n.ignore === false);
		return note;
	}

	function saveNote(fullDayNoteObj) {
		let history = JSON.parse(GM_getValue('SJ') || '[]');
		if (history.length) {
			if (!history.find(item => item.date == fullDayNoteObj.date)) history.push(fullDayNoteObj)
			else {
				history = history.map(item => {
					if (item.date == fullDayNoteObj.date) item = fullDayNoteObj
					return item
				})
			}
		} else {
			history = [fullDayNoteObj]
		}
		GM_setValue('SJ', JSON.stringify(history))
	}

	function autoHide(fullDayNoteObj, needFillNote) {
		setTimeout(() => {
			let history = JSON.parse(GM_getValue('SJ') || '[]');
			let needFillNote = checkNoteFill(history.find(item => item.date == fullDayNoteObj.date),
				new Date().getHours())
			if (needFillNote) autoHide(fullDayNoteObj)
			else Swal.close()
		}, 10 * 1000)
	}

	function toFill(fullDayNoteObj) {
		let needFillNote = checkNoteFill(fullDayNoteObj, new Date().getHours())
		if (needFillNote) {
			Swal.fire({
				position: 'top-end',
				title: `${needFillNote.time}`,
				input: 'textarea',
				inputAttributes: {
					autocapitalize: 'off'
				},
				showCancelButton: true,
				confirmButtonText: '保存',
				cancelButtonText: '忽略不填写',
				showLoaderOnConfirm: true,
			}).then(({
				isConfirmed,
				isDismissed,
				dismiss,
				value
			}) => {
				if (isConfirmed && value.trim()) {
					needFillNote.content = value.trim()
					for (let i of fullDayNoteObj.note) {
						if (i.time == needFillNote.time) i = needFillNote
					}
					saveNote(fullDayNoteObj)
				} else if (isDismissed && dismiss == 'cancel') {
					needFillNote.ignore = true
					for (let i of fullDayNoteObj.note) {
						if (i.time == needFillNote.time) i = needFillNote
					}
					saveNote(fullDayNoteObj)
				}
			})
			autoHide(fullDayNoteObj, needFillNote)
		}
	}

	function start() {
		let history = JSON.parse(GM_getValue('SJ') || '[]');
		const {
			dateStr
		} = formatDateTime(); // 格式化日期为YYYY-MM-DD
		let target = history.find(item => item.date == dateStr) || generateDailyNotes();
		toFill(target)
	}

	const minutes = new Date().getMinutes()
	if (minutes >= 40) start()
	else {
		setTimeout(() => {
			start()
		}, (40 - minutes) * 60 * 1000)
	}

	function modify(item) {
		const {
			title,
			start,
			end
		} = item;
		const DATE = new Date(start);
		const {
			dateStr
		} = formatDateTime(DATE);
		const hours = DATE.getHours()
		Swal.fire({
			position: 'top-end',
			title: `${dateStr}-${hours}`,
			input: 'textarea',
			inputValue: title == '暂无,点击补充' ? '' : title,
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: '保存',
			cancelButtonText: '返回',
			showLoaderOnConfirm: true,
		}).then(({
			isConfirmed,
			isDismissed,
			dismiss,
			value
		}) => {
			if (isConfirmed) {
				const history = JSON.parse(GM_getValue('SJ') || '[]');
				history.forEach(item => {
					if (item.date == dateStr) {
						item.note.forEach(items => {
							if (parseInt(items.time) == parseInt(hours)) {
								items.content = value
							}
						})
					}
				})
				GM_setValue('SJ', JSON.stringify(history))
				renderTable()
			} else if (isDismissed && dismiss == 'cancel') {
				renderTable()
			}
		})
	}

	function consoleTable() {
		const history = JSON.parse(GM_getValue('SJ') || '[]');
		const table = [];
		history.forEach(item => {
			item.note.forEach(items => {
				table.push({
					date: item.date,
					time: items.time,
					content: items.content,
					ignore: items.ignore
				})
			})
		})
		console.table(table)
		console.info(history)
	}

	function renderTable() {
		const history = JSON.parse(GM_getValue('SJ') || '[]')
		if (history.length) {
			let events = []
			const {
				hours,
				dateStr
			} = formatDateTime()
			history.forEach(item => {
				let date = item.date;
				let temp = date.split("-")
				if (parseInt(temp[2]) < 10) {
					temp[2] = "0" + parseInt(temp[2]);
					date = temp.join("-")
				}
				item.note.forEach(items => {
					(dateStr != date || (dateStr == date && items.time <= hours)) && events.push({
						title: items.content || '暂无,点击补充',
						start: `${date}T${items.time}:00:00`,
						end: `${date}T${items.time}:59:59`,
						className: items.content ? 'full' : 'empty',
						editable: true
					})
				})
			})
			Swal.fire({
				html: '<div id="calendar" style="width:800px;height:500px;margin: auto;"></div>',
				width: 1000,
				height: 700,
				showCloseButton: false,
				showConfirmButton: false,
				showCancelButton: false,
				focusConfirm: false,
			})
			setTimeout(() => {
				var calendarEl = document.getElementById('calendar');

				var calendar = new FullCalendar.Calendar(calendarEl, {
					initialView: 'timeGridWeek',
					initialDate: dateStr,
					headerToolbar: {
						left: 'prev,next today',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek'
					},
					// id：事件的唯一标识符，用于识别事件。
					// title：事件的名称，必选属性。
					// allDay：布尔值，表示事件是否为全天事件。
					// start：事件开始的日期/时间，必选属性。可以是ISO8601字符串或UNIX时间戳。
					// end：事件结束的日期/时间，可选属性。可以是ISO8601字符串或UNIX时间戳。
					// url：事件的链接地址，点击事件时会跳转到该URL。
					// className：一个CSS类名或一组类名，附加到事件的DOM元素上。
					// editable：布尔值，表示事件是否可编辑（可移动、改变大小等）。
					// startEditable：布尔值，覆盖全局的eventStartEditable选项，针对单个事件。
					// durationEditable：布尔值，覆盖全局的eventDurationEditable选项，针对单个事件。
					// resourceEditable：布尔值，覆盖全局的eventResourceEditable选项，针对单个事件。
					// rendering：控制事件的渲染方式，如背景色等，可以是"background"或"inverse-background"。
					// overlap：布尔值，覆盖全局的eventOverlap选项，如果设置为false，则阻止此事件与其他事件重叠。
					// constraint：可以是事件id、"businessHours"或对象，覆盖全局的eventConstraint选项，针对单个事件。
					// source：指向事件的事件源对象。
					// color：设置事件的背景色和边框色。
					// backgroundColor：设置事件的背景色。
					// borderColor：设置事件的边框色。
					// textColor：设置事件的文本色
					events: events,
					eventClick: function(info) {
						// 弹出编辑表单
						modify(info.event)
					},
					eventChange: function(info) {
						// info对象包含了事件的相关信息，包括变动前后的数据
						console.log('Event Changed', info);
						// 获取事件的新数据
						var newEventData = {
							title: info.event.title,
							start: info.event.start,
							end: info.event.end,
							// ...其他需要的字段
						};
						// 这里可以发送请求到后端更新事件数据
					}
				});
				calendar.render();
			}, 500)
		} else {
			alert('暂无数据')
		}
	}
	GM_registerMenuCommand("console.table", function() {
		consoleTable()
	});
	GM_registerMenuCommand("打开日历模式", function() {
		renderTable()
	});
	// GM_registerMenuCommand("读取备份数据到控制台", function() {
	// 	readFromFile()
	// });
	GM_registerMenuCommand("备份", function() {
		saveToFile()
	});
	document.addEventListener('keydown', function(event) {

		// Ctrl + Shift + l ( console表格输出 )
		if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
			consoleTable()
		}
		// Ctrl + Shift + t ( 日历模式 )
		if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 't') {
			renderTable()
		}

		// Ctrl + Shift + o ( 读本地文件 )
		if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'o') {
			readFromFile()
		}

		// Ctrl + Shift + e ( 将缓存数据写到本地文件 )
		if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'e') {
			saveToFile()
		}
	})
})();