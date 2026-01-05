// ==UserScript==
// @name        GitHub Title Notification
// @version     1.0.7
// @description A userscript that changes the document title if there are unread messages
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @match       https://github.com/*
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @supportURL  https://github.com/Mottie/GitHub-userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/18253/GitHub%20Title%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/18253/GitHub%20Title%20Notification.meta.js
// ==/UserScript==

(() => {
	"use strict";

	let timer,
		// indicator added to document title (it will be wrapped in parentheses)
		indicator = GM_getValue("indicator", "♥"),
		// check every 30 seconds
		interval = GM_getValue("interval", 30);

	function check() {
		let title = document.title,
			mail = document.querySelector(".mail-status"),
			hasUnread = mail ? !mail.hidden : false;
		//
		if (!/^\(\d+\)/.test(title)) {
			title = title.replace(/^(\([^)]+\)\s)*/g, "");
		}
		document.title = hasUnread ? "(" + indicator + ") " + title : title;
	}

	function setTimer() {
		clearInterval(timer);
		if (document.querySelector(".mail-status")) {
			timer = setInterval(() => {
				check();
			}, interval * 1000);
			check();
		}
	}

	// Add GM options
	GM_registerMenuCommand("Set GitHub Title Notification Indicator", () => {
		const val = prompt("Indicator Value (it will be wrapped in parentheses)?", indicator);
		if (val !== null) {
			GM_setValue("indicator", val);
			check();
		}
	});
	GM_registerMenuCommand("Set GitHub Title Notification Interval", () => {
		const val = prompt("Interval Value (in seconds)?", interval);
		if (val !== null) {
			GM_setValue("interval", val);
			setTimer();
		}
	});

	setTimer();

})();
