// ==UserScript==
// @name         CRM - grupowe przenoszenie działań
// @namespace    https://greasyfork.org
// @version      0.15
// @description  Dodaje do CRM-a możliwość zaznaczenia wielu działań, co umożliwia przenoszenie ich grupowo. Możliwość nadania koloru zadania poprzez dopisanie do nazwy na końcu odpowiedniego tekstu.
// @author       Dawid Marzec
// @match        *grupa.tmsys.pl/crm/index.php?module=Calendar&view=Calendar*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/462181/CRM%20-%20grupowe%20przenoszenie%20dzia%C5%82a%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/462181/CRM%20-%20grupowe%20przenoszenie%20dzia%C5%82a%C5%84.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const topNavBar = document.querySelector("#appnav .nav");

	//topNavBar.insertAdjacentHTML("afterbegin", `<li><button type="button" class="btn btn-default module-buttons cursorPointer" onclick="showCheckboxes();">Pokaż checkboxy</button></li>`);
	topNavBar.insertAdjacentHTML("afterbegin", `<li style="margin-top:10px;">O ile dni przenieść: </li>
	<li><input type="number" id="numberOfDays" value="1" style="width:50px; margin:8px 2px;"></li>
	<li style="border-right: 1px solid #EF5E29;"><button type="button" title="Przenosi tylko działania!" class="btn btn-default module-buttons cursorPointer" onclick="moveTasks();">Przenieś działania</button></li>
	<li><div class="input-group date" data-provide="datepicker" style="width:190px; min-width:100px; margin:5px 2px;">
      <input type="text" placeholder="Szanse - docelowa data" class="inputElement dateField form-control datepicker" data-date-format="dd-mm-yyyy" data-fieldtype="date" data-rule-required="true" data-rule-date="true" language="pl"><span class="input-group-addon"><i class="fa fa-calendar "></i></span>
    </div></li>
	<li style="border-right: 1px solid #EF5E29;"><button type="button" title="Przenosi tylko szanse!" class="btn btn-default module-buttons cursorPointer" onclick="moveOpps();">Przenieś szanse</button></li>
	`);

	$('.input-group.date').datepicker({
    format: "dd-mm-yyyy",
    todayBtn: "linked",
    clearBtn: true,
    language: "pl",
    autoclose: true,
    todayHighlight: true
	});

	const refreshBar = document.getElementById("messageBar");
	const monthButton = document.getElementsByClassName("fc-month-button");
	const agendaButton = document.getElementsByClassName("fc-vtAgendaList-button");
	const observer = new MutationObserver(mutationList => {
		if (refreshBar.classList.contains('hide') && monthButton[0].classList.contains('fc-state-active')) {
			showCheckboxes();
            calendarChangeColors();
		} else if (refreshBar.classList.contains('hide') && agendaButton[0].classList.contains('fc-state-active')) {
            agendaChangeColors();
		}
	});
	observer.observe(refreshBar, { attributes: true });
	observer.observe(monthButton[0], { attributes: true });

    const fcViewElement = document.getElementsByClassName("fc-view");
    const fcViewObserver = new MutationObserver(mutationList => {
		if (refreshBar.classList.contains('hide') && monthButton[0].classList.contains('fc-state-active')) {
            if (fcViewElement[0].getElementsByClassName("fc-more-popover").length > 0) {
                popoverAddCheckboxes();
                popoverChangeColors();
            }
		}
	});

    fcViewObserver.observe(fcViewElement[0], { childList: true });

	const script = `
		function showCheckboxes() {
			let isAdded = document.getElementById("isAdded");
			if (isAdded) return;

			const calenderTasks = document.getElementsByClassName("fc-event-container");
			for (let i = 0; i < calenderTasks.length; i++) {
				calenderTasks[i].insertAdjacentHTML("beforeend",'<input type="checkbox" name="selectTask" style="position:absolute;">');
				let tableElement = calenderTasks[i].parentElement.parentElement;
				if (tableElement.firstElementChild == calenderTasks[i].parentElement) {
					calenderTasks[i].insertAdjacentHTML("beforeend", '<button type="button" class="check-all btn btn-default module-buttons cursorPointer" title="Zaznacza wszystkie działania, nawet te poza listą" style="left: calc(100% / 7 * '+ (calenderTasks[i].cellIndex + 1) +' - 100px);" onclick="selectAllTasks(this);">Zaznacz wsz.</button>');
				}
			}
			let content = document.getElementsByClassName("fc-content-skeleton");
			let tbody = content[0].querySelector('tbody');
			tbody.insertAdjacentHTML("beforeend", "<div id='isAdded'></div>");
		}

		function selectAllTasks(button) {
			let buttonColumnIndex = button.closest('td').cellIndex;
			let tbody = button.closest('tbody');
			let rows = tbody.children;
			let numberToSubtract = 0;
			let correctColumnIndex = buttonColumnIndex;

			for (let j = 0; j < rows.length; j++) {
				correctColumnIndex -= numberToSubtract;
				numberToSubtract = 0;
				let allColumns = rows[j].children;
				let columns = [];
				for (let i = 0; i < allColumns.length; ++i) {
					if (!allColumns[i].classList.contains("fc-more-cell")) {
						columns.push(allColumns[i]);
					}
				}
				if (columns.length > 0) {
					if (columns[correctColumnIndex].querySelector('input')) {
						columns[correctColumnIndex].querySelector('input').checked = true;
					}

					for (let i = 0; i <= correctColumnIndex; i++) {
						if (columns[i].hasAttribute('rowspan')) {
							if (i === correctColumnIndex)
								return;
							else
								numberToSubtract++;
						}
					}
				}
			}
		}

		async function moveTasks() {
			document.getElementById("messageBar").classList.remove("hide");
			let checkedBoxes = document.querySelectorAll('input[name=selectTask]:checked');
			let requests = [];
			let numberOfDays = document.getElementById("numberOfDays").value;
			let secondsToMove = parseInt(numberOfDays)*86400;
			for (let i = 0; i<checkedBoxes.length; ++i) {
				let task = checkedBoxes[i].parentElement.getElementsByClassName("fc-day-grid-event");
				let taskHref = task[0].getAttribute("href");
				if (taskHref.indexOf("Calendar") > -1) {
					const urlParams = new URLSearchParams(taskHref);
					let taskID = urlParams.get("record");
					requests.push(
						fetch("https://grupa.tmsys.pl/crm/index.php", {
							"headers": {
								"accept": "*/*",
								"accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
								"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
								"sec-fetch-dest": "empty",
								"sec-fetch-mode": "cors",
								"sec-fetch-site": "same-origin",
								"x-requested-with": "XMLHttpRequest",
								"Referer": "https://grupa.tmsys.pl/crm/index.php?module=Calendar&view=Calendar",
								"Referrer-Policy": "strict-origin-when-cross-origin"
							},
							"body": "__vtrftk="+csrfMagicToken+"&module=Calendar&action=DragDropAjax&mode=updateDeltaOnDrop&id="+taskID+"&activitytype=Call&secondsDelta="+secondsToMove+"&view=month&userid=1",
							"method": "POST"
						})
					);
				}
			}
			await Promise.all(requests);
			location.reload();
		}

		async function moveOpps() {
			let checkedBoxes = document.querySelectorAll('input[name=selectTask]:checked');
			let requests = [];
			let targetDateInput = document.querySelector('.datepicker');
			let targetDate = targetDateInput.value;
			if (!targetDate) {
				alert("Wprowadź najpierw docelową datę w polu obok przycisku!");
				return;
			}
			document.getElementById("messageBar").classList.remove("hide");
			for (let i = 0; i<checkedBoxes.length; ++i) {
				let task = checkedBoxes[i].parentElement.getElementsByClassName("fc-day-grid-event");
				let taskHref = task[0].getAttribute("href");
				if (taskHref.indexOf("Potentials") > -1) {
					const urlParams = new URLSearchParams(taskHref);
					let taskID = urlParams.get("record");
					requests.push(
						fetch("https://grupa.tmsys.pl/crm/index.php", {
							"headers": {
								"accept": "*/*",
								"accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
								"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
								"sec-fetch-dest": "empty",
								"sec-fetch-mode": "cors",
								"sec-fetch-site": "same-origin",
								"x-requested-with": "XMLHttpRequest",
								"Referer": "https://grupa.tmsys.pl/crm/index.php?module=Potentials&view=Detail&record="+taskID+"&mode=showDetailViewByMode&requestMode=full&tab_label=Szansa%20sprzeda%C5%BCy%20Szczeg%C3%B3%C5%82y&app=SALES",
								"Referrer-Policy": "strict-origin-when-cross-origin"
							},
							"body": "__vtrftk="+csrfMagicToken+"&value="+targetDate+"&field=closingdate&record="+taskID+"&module=Potentials&action=SaveAjax",
							"method": "POST"
						})
					);
				}
			}
			await Promise.all(requests);
			location.reload();
		}

		let colors = {
			"p.": "#007100",
			"s.": "#AFAF00",
			"k.": "#800086",
			"d.": "#9F0000",
			"m.": "#D35800"
		}

        function calendarChangeColors() {
			let alreadyChanged = document.getElementById("alreadyChanged");
			if (alreadyChanged) return;

			const calenderTasksBars = document.getElementsByClassName("fc-day-grid-event");
			changeColors(calenderTasksBars);
			let content = document.getElementsByClassName("fc-content-skeleton");
			let tbody = content[0].querySelector('tbody');
			tbody.insertAdjacentHTML("beforeend", "<div id='alreadyChanged'></div>");
		}

		function popoverAddCheckboxes() {
			let alreadyAddedPopover = document.getElementById("alreadyAddedPopover");
			if (alreadyAddedPopover) return;

			let checkedBoxes = document.querySelectorAll('input[name=selectTask]:checked');
			var baseTaskType;
			var baseTaskRecord;
			if (checkedBoxes) {
				baseTaskType = new Array(checkedBoxes.length);
				baseTaskRecord = new Array(checkedBoxes.length);
				for (let i = 0; i < checkedBoxes.length; ++i) {
					let task = checkedBoxes[i].parentElement.getElementsByClassName("fc-day-grid-event");
					let taskHref = task[0].getAttribute("href");
					if (taskHref.indexOf("Calendar") > -1) {
						baseTaskType[i] = "Calendar";
					} else if (taskHref.indexOf("Potentials") > -1) {
						baseTaskType[i] = "Potentials";
					} else
						baseTaskType[i] = "none";
					if (baseTaskType[i] == "Calendar" || baseTaskType[i] == "Potentials") {
						const urlParams = new URLSearchParams(taskHref);
						baseTaskRecord[i] = urlParams.get("record");
					} else
						baseTaskRecord[i] = "0";
				}
			}

			let popoverElement = document.querySelector('.fc-more-popover');
			const calenderTasksBars = popoverElement.getElementsByClassName("fc-day-grid-event");
			let taskType = "none";
			for (let i = 0; i < calenderTasksBars.length; i++) {
				let taskHref = calenderTasksBars[i].getAttribute("href");
				if (taskHref.indexOf("Calendar") > -1) {
					taskType = "Calendar";
				} else if (taskHref.indexOf("Potentials") > -1) {
					taskType = "Potentials";
				} else
					taskType = "none";

				let isChecked = false;
				if (taskType != "none") {
					const urlParams = new URLSearchParams(taskHref);
					let taskRecord = urlParams.get("record");
					for (let i = 0; i < checkedBoxes.length; ++i) {
						if (taskType == baseTaskType[i] && taskRecord == baseTaskRecord[i]) {
							isChecked = true;
							break;
						}
					}
				}
				if (isChecked)
					calenderTasksBars[i].insertAdjacentHTML("afterend",'<input type="checkbox" name="selectTaskPopover" onclick="popoverTaskSelected(this)" style="position:relative; margin:0px;" checked>');
				else
					calenderTasksBars[i].insertAdjacentHTML("afterend",'<input type="checkbox" name="selectTaskPopover" onclick="popoverTaskSelected(this)" style="position:relative; margin:0px;">');
			}
			popoverElement.insertAdjacentHTML("beforeend", "<div id='alreadyAddedPopover'></div>");
		}

		function popoverTaskSelected(clickedCheckbox) {
			let clickedTask = clickedCheckbox.previousElementSibling;
			let clickedTaskHref = clickedTask.getAttribute("href");
			let clickedTaskType = "none";
			if (clickedTaskHref.indexOf("Calendar") > -1) {
				clickedTaskType = "Calendar";
			} else if (clickedTaskHref.indexOf("Potentials") > -1) {
				clickedTaskType = "Potentials";
			} else
				clickedTaskType = "none";
			if (clickedTaskType != "none") {
				const clickedUrlParams = new URLSearchParams(clickedTaskHref);
				let clickedTaskRecord = clickedUrlParams.get("record");

				let calenderTasks = document.querySelector('.fc-body').getElementsByClassName("fc-day-grid-event");
				let taskType = "none";
				for (let i = 0; i < calenderTasks.length; i++) {
					let taskHref = calenderTasks[i].getAttribute("href");
					if (taskHref.indexOf("Calendar") > -1) {
						taskType = "Calendar";
					} else if (taskHref.indexOf("Potentials") > -1) {
						taskType = "Potentials";
					} else
						taskType = "none";

					if (taskType != "none") {
						const urlParams = new URLSearchParams(taskHref);
						let taskRecord = urlParams.get("record");
						if (taskType == clickedTaskType && taskRecord == clickedTaskRecord) {
							let checkBox = calenderTasks[i].nextElementSibling;
							checkBox.checked = clickedCheckbox.checked;
							break;
						}
					}
				}
			}
		}

		function popoverChangeColors() {
			let alreadyChangedPopover = document.getElementById("alreadyChangedPopover");
			if (alreadyChangedPopover) return;

			let popoverElement = document.querySelector('.fc-more-popover');
			const calenderTasksBars = popoverElement.getElementsByClassName("fc-day-grid-event");
			changeColors(calenderTasksBars);
			popoverElement.insertAdjacentHTML("beforeend", "<div id='alreadyChangedPopover'></div>");
		}

		function changeColors(calenderTasksBars) {
			for (let i = 0; i<calenderTasksBars.length; ++i){
				let taskHref = calenderTasksBars[i].getAttribute("href");
				if (taskHref.indexOf("Calendar") > -1) {
					let task = calenderTasksBars[i].querySelector('.fc-title');
					let taskText = task.textContent;
					taskText = taskText.substr(0, taskText.length - 14);
					task.textContent = taskText;
					let textLength = taskText.length;

					let newColor = colors[taskText.substr(textLength - 2, 2)];
					if (newColor !== undefined) {
						calenderTasksBars[i].style.backgroundColor = newColor;
						calenderTasksBars[i].style.borderColor = newColor;
					}
				}
			}
		}

		function agendaChangeColors() {
			const taskWrappers = document.getElementsByClassName("agenda-event-wrapper");
			for (let i = 0; i<taskWrappers.length; ++i){
				let task = taskWrappers[i].querySelector('.agenda-event-title');
				let taskTitle = task.querySelector("span").textContent;
				let titleLength = taskTitle.length;
				let newColor = colors[taskTitle.substr(titleLength - 2, 2)];
				if (newColor !== undefined) {
					taskWrappers[i].style.backgroundColor = newColor;
					taskWrappers[i].style.color = "white";
				}
			}
		}
	`;

	const scriptElement = document.createElement("script");
	scriptElement.type = "text/javascript";
	scriptElement.innerHTML = script;
	document.head.appendChild(scriptElement);

	const css = `
		.fc-day-grid-event {
			float: left;
			width: calc(100% - 24px);
			min-width: 0px;
		}
		.check-all {
			float: right;
			position: absolute;
			z-index: 10;
			top: 0px;
			margin: 2px 0px 0px 0px !important;
			padding: 0px 2px !important;
			height: 1.6em !important;
		}
		.module-action-content .col-lg-5, .module-action-content .col-md-5, .module-action-content .col-lg-7, .module-action-content .col-md-7 {
			width: auto;
		}
	`;

	document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

})();