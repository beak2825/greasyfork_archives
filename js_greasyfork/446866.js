// ==UserScript==
// @name            WorkTime in Pagetitle - Clockout
// @name:de         Arbeitszeit im Seitentitel - Clockout
// @namespace       https://greasyfork.org/users/928242
// @version         1.1
// @description     Adding your current work time to page titel. No need to switch tab anymore to see your work time.
// @description:de  Zeigt die Arbeitszeit im Seitentitel an. Kein lästiges Tab wechseln mehr um die Arbeitszeit zu sehen.
// @author          Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match           https://www.clockout.me/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=clockout.me
// @grant           none
// @run-at          document-end
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/446866/WorkTime%20in%20Pagetitle%20-%20Clockout.user.js
// @updateURL https://update.greasyfork.org/scripts/446866/WorkTime%20in%20Pagetitle%20-%20Clockout.meta.js
// ==/UserScript==

// Identifier for Page Title if current running time is work or break time
const workTimeIdentifier = "▶"
const breakTimeIdentifier = "⏸"
const stopTimeIdentifier = "⏹️"


/** Only change below if you know what you do **/

const observerConfig = {attributes: true, childList: true, characterData: true, subtree: true}

let workTime = document.querySelector(".timelogbar__time").firstChild
const workTimeObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		clearInterval(waitForElement)
		workTime = mutation.target.textContent
		window.document.title = `${workTimeIdentifier} ${workTime} - Clockout`;
		//console.log(workTimeIdentifier, workTime)
		isStopped : isStopped = false
	});
});

let breakTime = document.querySelector(".timelogbar__time__break")
const breakTimeObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		clearInterval(waitForElement)
		breakTime = mutation.target.textContent.split(" ")[1]
		window.document.title = `${breakTimeIdentifier} ${breakTime} - Clockout`;
		//console.log(breakTimeIdentifier, breakTime)
		isStopped : isStopped = false
	});
});

const waitForElement = setInterval( () => {
	workTime = document.querySelector(".timelogbar__time").firstChild
	workTimeObserver.observe(workTime, observerConfig)

	breakTime = document.querySelector(".timelogbar__time__break")
	breakTimeObserver.observe(breakTime, observerConfig)

	console.log("Waiting for Time changes..")
}, 3000)


let isStopped = false
const stopTimeInterval = setInterval(checkStoppedTime, 5000)

function checkStoppedTime() {
	if (isStopped) return;
	const lastTime = document.querySelector(".timelogbar__time").firstChild.innerText

	setTimeout( () => {
		const currTime = document.querySelector(".timelogbar__time").firstChild.innerText

		if (lastTime != currTime) {
			//console.log("Time is running..")
			isStopped = false
		} else {
			console.log("Time is stopped.")
			window.document.title = `${stopTimeIdentifier} ${workTime} - Clockout`;
			isStopped = true
		}
	}, 1000)
}