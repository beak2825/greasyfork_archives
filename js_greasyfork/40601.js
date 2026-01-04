// ==UserScript==
// @name         Shaniqua - Big Ol' Butts in your Projects
// @namespace    salembeats
// @version      1.3
// @description  Latest update: Updates for Qualtrics.
// @author       Cuyler Stuwe (salembeats)
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/40601/Shaniqua%20-%20Big%20Ol%27%20Butts%20in%20your%20Projects.user.js
// @updateURL https://update.greasyfork.org/scripts/40601/Shaniqua%20-%20Big%20Ol%27%20Butts%20in%20your%20Projects.meta.js
// ==/UserScript==

if( (!document.referrer.includes("worker.mturk.com/projects/")) && (!window.location.href.includes("qualtrics")) ) {return;}

let css = `
<style id='touchyButtCSS'>

input[type='radio'],
input[type='checkbox'],
button,
a.btn,
.q-radio {
  transform: scale(3.5) !important;
  transform-origin: 0% 50% !important;
  margin: 2rem !important;
  transition: all 0.1s ease-out !important;
}

input[type='radio']:checked,
input[type='checkbox']:checked,
.q-checked {
  transform: scale(3.5) rotate(45deg) !important;
  outline: 1px solid red !important;
  outline-offset: 2px !important;
}

</style>
`;

let topBar = `
<div style='width: 100%;'>
<label>
Call Shaniqua?&nbsp;
<input type='checkbox' name='touchyBigButt' id='touchyBigButt'>
</label>
</div>
`;

function updateButt(e) {
	if(e.target.checked) {
		insertStyles();
	}
	else {
		removeStyles();
	}
	GM_setValue("shaniquaIsInTown", e.target.checked);
}

function injectEvents() {
	document.getElementById("touchyBigButt").addEventListener("change", updateButt);
}

function insertTopBar() {
	document.body.insertAdjacentHTML("afterbegin", topBar);
}

function insertStyles() {
	document.body.insertAdjacentHTML("beforeend", css);
}

function removeStyles() {
	(document.getElementById("touchyButtCSS") || { remove: ()=>{} }).remove();
}

function loadLastSetting() {
	if(GM_getValue("shaniquaIsInTown")) {
		document.getElementById("touchyBigButt").click();
	}
}

insertTopBar();
injectEvents();
loadLastSetting();