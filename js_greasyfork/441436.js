// ==UserScript==
// @name        Tab viewing timer 
// @description Timer for when a tab being focused in HH:MM format. Reset after 24 hours.
// @version     1.0
// @author      Jenie
// @namespace   FFW Scripts
// @include     *
// @grant       none
// @noframes
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441436/Tab%20viewing%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/441436/Tab%20viewing%20timer.meta.js
// ==/UserScript==

document.body.insertAdjacentHTML(
	'beforeend',
	`<div id="timer" title="${new Date()}" style="position:fixed;bottom:0;right:0;color:#fff;background-color:#000;padding:10px;z-index:1000000;cursor:pointer;border-radius:2px;margin:10px;"><span>00:00</span></div>`
);

const timerSpan = document.querySelector('div#timer > span');
let focused = !0;
let seconds = 0;
window.setInterval(() => {
	if (!focused) return;
	seconds++;
	timerSpan.textContent = new Date(seconds * 1000).toISOString().substr(11, 5);
}, 1000);

const timerDiv = document.querySelector('div#timer');
timerDiv.addEventListener('click', () => {
	focused = !focused;
	timerDiv.style.color = focused ? '#fff' : 'red';
});

window.addEventListener('blur', () => {
	focused = !1;
	timerDiv.style.color = 'red';
});
window.addEventListener('focus', () => {
	focused = !0;
	timerDiv.style.color = '#fff';
});