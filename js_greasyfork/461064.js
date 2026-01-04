// ==UserScript==
// @name         Svajksta free
// @namespace    https://greasyfork.org/ru/users/901750-gooseob
// @version      1.1.1
// @description  Allows text selecting on svajksta
// @author       GooseOb
// @license      MIT
// @match        https://svajksta.by/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=svajksta.by
// @downloadURL https://update.greasyfork.org/scripts/461064/Svajksta%20free.user.js
// @updateURL https://update.greasyfork.org/scripts/461064/Svajksta%20free.meta.js
// ==/UserScript==

(function() {
	const {body, documentElement} = document;

	for (const style of [
		'-webkit-touch-callout',
		'-webkit-user-select',
		'-khtml-user-select',
		'-moz-user-select',
		'user-select',
		'-webkit-tap-highlight-color'
	]) documentElement.style[style] = 'unset';

	setTimeout(() => {
		body.style.cursor = 'auto';
	}, 100);

	const listener = e => {e.stopPropagation()};
	const options = {capture: true};
	for (const eventType of [
		'selectstart',
		'contextmenu',
		'click',
		'mousedown'
	]) body.addEventListener(eventType, listener, options);
})();