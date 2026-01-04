// ==UserScript==
// @name          ClickDown
// @namespace     Violentmonkey Scripts
// @match         https://app.clickup.com/*
// @version       0.2.1
// @author        MS
// @description   Disable Ctrl+Shift+Left & Ctrl+Shift+Right
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/461434/ClickDown.user.js
// @updateURL https://update.greasyfork.org/scripts/461434/ClickDown.meta.js
// ==/UserScript==

const CSS_CLASS_NAME = 'ql-editor';

function cd_add_box() {
	const new_box = document.createElement('div');
	new_box.classList.add(CSS_CLASS_NAME);
	new_box.textContent = Math.random();
	new_box.setAttribute('contenteditable', 'true');
	document.body.appendChild(new_box);
}

function cd_focus(ev) {
	// console.log(ev.target, document.activeElement);

	if (ev.target.classList?.contains(CSS_CLASS_NAME)) {
		// console.log(ev.target.classList);
		ev.target.addEventListener('keydown', cd_gtfo);
	}
}

function cd_gtfo(ev) {
	if (ev.ctrlKey && ev.shiftKey && (ev.keyCode == 37 || ev.keyCode == 39)) {
		console.log('CD: ', Math.random());
		// ev.stopPropagation();
		// ev.preventDefault();
		// ev.cancelBubble = true;
		ev.stopImmediatePropagation();
		try {
			ev.keyCode = 0;
		}
		catch (ev) {}

		return false;
	}
	return true;
}

function attach_events() {
	window.addEventListener('focus', cd_focus, true);
}
attach_events();