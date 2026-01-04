// ==UserScript==
// @name         Schoolbook Tools
// @description  Mess around with schoolbook.ge
// @icon         https://eservices.schoolbook.ge/Images/sb-logo-blue.png
// @author       Naviamold
// @license      MIT
// @version      2.6
// @namespace    https://github.com/naviamold1
// @homepage     https://greasyfork.org/en/scripts/459858-schoolbook-tools
// @match        *://*.schoolbook.ge/*
// @exclude      *://schoolbook.ge/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/459858/Schoolbook%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/459858/Schoolbook%20Tools.meta.js
// ==/UserScript==
(function () {
	'use strict';
	// do not change anything here if you don't know what you are doing!
	const settings = {
		// @ts-ignore
		changeGrade: GM_getValue('changeGrade'),
		// @ts-ignore
		changeAttendance: GM_getValue('changeAttendance'),
		// @ts-ignore
		liveGradeUpdate: GM_getValue('liveGradeUpdate'),
		// @ts-ignore
		gradeViewer: GM_getValue('gradeViewer'),
		// @ts-ignore
		hideComments: GM_getValue('hideComments'),
		// @ts-ignore
		attendanceViewer: GM_getValue('attendanceViewer')
	};
	// Add a button to open the settings dialog
	$('#pageBody')
		?.prepend(`<button data-open-modal id="openSettingsButton">Open Settings</button>

      <dialog data-modal id="schoolbook_tools_settings_dialog">
        <h2>Script Settings</h2>
        <label for="changeGrade">(CLIENT SIDE) Change Grade:</label>
        <input type="text" id="changeGrade" value="${
					settings.changeGrade ?? ''
				}">
        <br>
        <label for="changeAttendance">(CLIENT SIDE) Change Attendance:</label>
        <input type="text" id="changeAttendance" value="${
					settings.changeAttendance ?? ''
				}">
        <br>
        <label for="liveGradeUpdate">Live Grade Update:</label>
        <input type="checkbox" id="liveGradeUpdate" ${
					settings.liveGradeUpdate ? 'checked' : ''
				}>
        <br>
        <label for="gradeViewer">Grade Viewer:</label>
        <input type="checkbox" id="gradeViewer" ${
					settings.gradeViewer ? 'checked' : ''
				}>
        <br>
        <label for="attendanceViewer">Attendance Viewer:</label>
        <input type="checkbox" id="attendanceViewer" ${
					settings.attendanceViewer ? 'checked' : ''
				}>
        <br>
        <label for="hideComments">(CLIENT SIDE) Hide Comments:</label>
        <input type="checkbox" id="hideComments" ${
					settings.hideComments ? 'checked' : ''
				}>
        <br>
        <a href='https://github.com/Naviamold1/schoolbook-filterlist'>Block Ads</a>
        <br>
        <br>
        <button data-close-modal id="saveSettingsButton">Save Settings</button>
        <button data-close-modal id="cancelSettingsButton">Cancel</button>
      </dialog>`);
	const sanitizeInput = (query) => {
		const inp = document.querySelector(query);
		if (inp && inp.value.trim() !== '') {
			return inp.value.trim();
		}
		return '';
	};
	const dialog = document.querySelector('#schoolbook_tools_settings_dialog');
	document
		.querySelector('#openSettingsButton')
		.addEventListener('click', () => dialog.showModal());
	document
		.querySelector('#cancelSettingsButton')
		.addEventListener('click', () => dialog.close());
	document
		.querySelector('#saveSettingsButton')
		.addEventListener('click', () => {
			// @ts-ignore
			GM_setValue('changeGrade', sanitizeInput('#changeGrade'));
			// @ts-ignore
			GM_setValue('changeAttendance', sanitizeInput('#changeAttendance'));
			// @ts-ignore
			GM_setValue(
				'liveGradeUpdate',
				document.querySelector('#liveGradeUpdate').checked
			);
			// @ts-ignore
			GM_setValue(
				'gradeViewer',
				document.querySelector('#gradeViewer').checked
			);
			// @ts-ignore
			GM_setValue(
				'attendanceViewer',
				document.querySelector('#attendanceViewer').checked
			);
			// @ts-ignore
			GM_setValue(
				'hideComments',
				document.querySelector('#hideComments').checked
			);
			document.querySelector('#schoolbook_tools_settings_dialog').close();
			window.location.reload();
		});
	const totalAvgGradePath = '#saertosashualo > span, .otherRow > span';
	const totalAvgAttendPath = '.sec span';
	// Better Timetable
	const colors = ['#BE2727', '#F5FF2D', '#15D13D', ''];
	const textColors = ['#E0E6E1', '#1C0316', '#1C0316', ''];
	const currentTime = new Date().getTime();
	const endTime = currentTime + 10 * 1000;
	let checkExist = setInterval(() => {
		if (
			document.querySelectorAll(
				'#daysList > div > div.owl-stage-outer > div > div > div > a > ol'
			).length >= 5
		) {
			clearInterval(checkExist);
			const subjects = document.querySelectorAll(
				'#daysList > div > div.owl-stage-outer > div > div > div > a > ol > li'
			);
			subjects.forEach((elem) => {
				let currentColorIndex = 0;
				elem.addEventListener('click', () => {
					const currentColor = colors[currentColorIndex];
					const currentTextColor = textColors[currentColorIndex];
					elem.style.backgroundColor = currentColor;
					elem.style.color = currentTextColor;
					currentColorIndex = (currentColorIndex + 1) % colors.length;
					let subj_name = elem.innerText;
					document
						.querySelectorAll(
							'#subs > div.owl-carousel.subjects.owl-loaded.owl-drag > div.owl-stage-outer > div > div > div > span'
						)
						.forEach((e) => {
							if (
								subj_name.replace(/ \d\d:\d\d/gm, '').replace(' ', '') ==
								e.innerText.replace(' ', '')
							) {
								let elem = e.parentNode;
								if (!elem) return;
								elem.style.backgroundColor = currentColor;
								elem.style.color = currentTextColor;
								$(elem.parentNode).insertBefore(
									document.querySelector(
										'#subs > div.owl-carousel.subjects.owl-loaded.owl-drag > div.owl-stage-outer > div > div:nth-child(1)'
									)
								);
							}
						});
				});
			});
		} else if (endTime < new Date().getTime()) {
			clearInterval(checkExist);
			console.log('not found in specified time.');
			return;
		} else {
			console.log('waiting for element to be present…');
		}
	}, 100);
	// Logic Functions
	function newGrade(grade) {
		let grades = document.querySelectorAll(`.avg_value, ${totalAvgGradePath}`);
		grades.forEach((val) => (val.textContent = grade));
	}
	function newAttendance(attendance) {
		let attendances = document.querySelectorAll(`.prc, ${totalAvgAttendPath}`);
		attendances.forEach((val) => (val.textContent = attendance));
	}
	function removeComments() {
		let comments = document.querySelectorAll(
			'.notificationsList, .notificationsListalter, .homeworkContent'
		);
		comments.forEach((mes) => (mes.style.display = 'none'));
	}
	function getAvg(query) {
		let numbers = [];
		query.forEach((el) => {
			let text = el.textContent;
			if (text) {
				let number = parseInt(text.replace(/\D/g, ''), 10);
				if (!isNaN(number)) {
					numbers.push(number);
				}
			}
		});
		const sum = numbers.reduce((acc, val) => acc + val, 0);
		const avg = numbers.length > 0 ? sum / numbers.length : 0;
		return Math.round(avg * 100) / 100;
	}
	function waitUntilAvgPresent(selector, elem, close = false) {
		const currentTime = new Date().getTime();
		const endTime = currentTime + 5 * 1000;
		let checkExist = setInterval(() => {
			if (document.querySelectorAll(selector).length) {
				clearInterval(checkExist);
				const avg = getAvg(document.querySelectorAll(selector));
				elem.textContent = avg.toString();
				// @ts-ignore
				close && closeGradeDialog();
			} else if (endTime < new Date().getTime()) {
				clearInterval(checkExist);
				console.log('not found in specified time.');
				return;
			} else {
				console.log('waiting for element to be present…');
			}
		}, 100);
	}
	function liveUpdate() {
		let totalGrade = document.querySelector('#saertosashualo span');
		totalGrade && totalGrade.click();
		waitUntilAvgPresent(
			'#cnt > div.div_container_grades > table > tbody > tr > td:nth-child(4)',
			totalGrade,
			true
		);
	}
	let ftSpan = document.createElement('span');
	document.querySelector('#ft')?.appendChild(ftSpan);
	function gradeSpier() {
		$('#pageBody')?.prepend(`
        <form id="gmSomeID">
          <input type="search" placeholder="Grade Viewer - User" list="datalistOptions" id="gminput">
          <button id="gmview">View</button>
          <datalist id='datalistOptions'>
        </form>
        `);
		document.querySelector('#gmview').addEventListener('click', (e) => {
			e.preventDefault();
			let val = document.querySelector('#gminput').value;
			if (val) {
				// @ts-ignore
				gradeclick(val, -1);
				waitUntilAvgPresent(
					'#cnt > div.div_container_grades > table > tbody > tr > td:nth-child(4)',
					ftSpan
				);
			}
		});
	}
	function attendanceSpier() {
		$('#pageBody')?.prepend(`
        <form id="gmSomeID2">
          <input type="search" placeholder="Attendance Viewer - User" list='datalistOptions' id="gminput2">
          <input type="search" placeholder="Subject ID" list='datalistOptionsAttend' id="gminput3">
          <button id="gmview2">View</button>
          <datalist id='datalistOptionsAttend'>
        </form>
        `);
		document.querySelector('#gmview2').addEventListener('click', (e) => {
			e.preventDefault();
			let val = document.querySelector('#gminput2').value;
			let val2 = document.querySelector('#gminput3').value;
			// @ts-ignore
			val && val2 && attendanceclick(val, val2);
		});
	}
	const currentPage = window.location.pathname;
	if (
		currentPage === '/Parent/Index' ||
		currentPage === '/Parent/AllSubjects'
	) {
		if (settings.changeGrade) {
			newGrade(settings.changeGrade);
		}
		if (settings.changeAttendance) {
			newAttendance(settings.changeAttendance);
		}
		if (settings.liveGradeUpdate) {
			liveUpdate();
		}
		if (settings.attendanceViewer || settings.gradeViewer) {
			const main = async () => {
				try {
					const options = {
						method: 'POST',
						headers: {
							accept: 'application/json, text/javascript, */*; q=0.01',
							'content-type': 'application/json'
						},
						body: '{"pageSize":1000,"filter":"","initValue":null}'
					};
					const req = await fetch(
						'https://eservices.schoolbook.ge/SchoolBook/SchoolPersonsList',
						options
					);
					const res = await req.json();
					res['mas'].forEach((val) => {
						$('#datalistOptions')?.append(
							`<option value="${val.value}" label="${val.text}">`
						);
					});
					document
						.querySelectorAll(
							'#tablestatistic > div.owl-carousel.tablestat.owl-loaded.owl-drag > div.owl-stage-outer > div > div:not(.cloned) > div > div'
						)
						.forEach((val) => {
							$('#datalistOptionsAttend')?.append(
								`<option value="${val.id.replace('sagani_', '')}" label="${
									val.querySelector('.subject_name').innerText
								}">`
							);
						});
				} catch (error) {
					console.error(error);
				}
			};
			main();
			if (settings.gradeViewer) {
				gradeSpier();
			}
			if (settings.attendanceViewer) {
				attendanceSpier();
			}
		}
	}
	if (currentPage === '/Parent/Messages' && settings.hideComments) {
		removeComments();
	}
})();
