// ==UserScript==
// @name         Selectable
// @namespace    https://greasyfork.org/en/users/703184-floriegl
// @version      1.0
// @description  Allows you to copy all the texts! Inspired by Chrome extension https://chrome.google.com/webstore/detail/selectable-for-fanfiction/jcidlhgdoojamkbpmhbpgldmajnobefd/related
// @author       floriegl
// @match        http://*/*
// @match        https://*/*
// @license MIT
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439533/Selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/439533/Selectable.meta.js
// ==/UserScript==

(function() {
    'use strict';

	function setUserSelect() {
		document.querySelectorAll('*').forEach(function(ele) {
			const compStyle = window.getComputedStyle(ele, null);
			if(compStyle.webkitUserSelect == 'none' || compStyle.userSelect == 'none') {
				ele.style.setProperty('user-select', 'auto', 'important');
			}
		});
	}
	window.setTimeout(setUserSelect, 1000);
})();