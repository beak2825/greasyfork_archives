// ==UserScript==
// @name            Auto Expand Subtasks - Asana
// @name:de         Unteraufgaben Automatisch anzeigen - Asana
// @namespace       https://greasyfork.org/users/928242
// @version         0.1
// @description     Auto Expand sub-tasks of selected Task and collapse other Tasks.
// @description:de  Klappt automatisch die Unteraufgaben der ausgewählten Aufgabe aus und schließt die anderen.
// @author          Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match           https://app.asana.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=asana.com
// @grant           none
// @run-at          document-ready
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/447310/Auto%20Expand%20Subtasks%20-%20Asana.user.js
// @updateURL https://update.greasyfork.org/scripts/447310/Auto%20Expand%20Subtasks%20-%20Asana.meta.js
// ==/UserScript==

console.log("Started [Auto Expand Subtasks - Asana]")

let checkReadyState = setInterval( () => {
	if (document.readyState === 'complete') addAutoExpand()
}, 1000)

function collapseTasks() {
	const subTaskButtons = document.querySelectorAll(".ProjectSpreadsheetGridRow-subtaskToggleButton")

	for (let el = 0; el < subTaskButtons.length; el++) {
		const item = subTaskButtons[el]
		const isExpanded = item.childNodes[0].classList.contains("DownTriangleIcon")

		if(isExpanded) item.click()
	}
}

function addAutoExpand() {
	clearInterval(checkReadyState)

	const taskItems = document.querySelectorAll(".SpreadsheetRow-stickyCell")

	for (let el = 0; el < taskItems.length; el++) {
		const item = taskItems[el]
		item.addEventListener("click", () => {
			collapseTasks()

			const toggleButton = item.querySelector(".ProjectSpreadsheetGridRow-subtaskToggleButton")
			toggleButton.click()
		})
	}
}