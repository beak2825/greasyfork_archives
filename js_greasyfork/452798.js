// ==UserScript==
// @name         Bandcamp - Handle Media Key
// @description  Bandcamp - Handle Media Key.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @run-at       document-end
//
// @match        https://*.bandcamp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bandcamp.com
// @downloadURL https://update.greasyfork.org/scripts/452798/Bandcamp%20-%20Handle%20Media%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/452798/Bandcamp%20-%20Handle%20Media%20Key.meta.js
// ==/UserScript==

navigator.mediaSession.setActionHandler('previoustrack', () => click('.prevbutton'));
navigator.mediaSession.setActionHandler('nexttrack', () => click('.nextbutton'));

function click(selector) {
	var event = document.createEvent('MouseEvents');
	event.initEvent('click', false, true);

	document.querySelector(selector).dispatchEvent(event);
}