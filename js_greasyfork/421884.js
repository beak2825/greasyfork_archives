// ==UserScript==
// @name         Reddit - Waste Time Reminder
// @description  Simply shows a popup asking you if you want to keep wasting time on reddit every 10 minutes.
// @namespace    https://azzurite.tv/
// @version      1.0
// @description  Reminds me to use less time on reddit
// @author       Azzurite
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421884/Reddit%20-%20Waste%20Time%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/421884/Reddit%20-%20Waste%20Time%20Reminder.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if (window.self !== window.top) {
		return;
	}

	const STARTED_BROWSING = `Azzu.startedBrowsing`;
	const MAX_BROWSING_TIME_MS = 10 * 60 * 1000;

	function getCurBrowseTime() {
		if (!localStorage.getItem(STARTED_BROWSING)) {
			localStorage.setItem(STARTED_BROWSING, Date.now());
		}

		return Date.now() - localStorage.getItem(STARTED_BROWSING);
	}

	function resetBrowseTime() {
		localStorage.setItem(STARTED_BROWSING, Date.now());
	}

	function keepBrowsingPrompt() {
		const wasteTime = confirm(`Do you want to waste more time browsing reddit?`);
		if (wasteTime) {
			resetBrowseTime();
		} else {
			close();
		}
	}

	function checkBrowseTime() {
		if (getCurBrowseTime() > MAX_BROWSING_TIME_MS) {
			keepBrowsingPrompt()
		}
		setTimeout(checkBrowseTime, 1000);
	}

	checkBrowseTime();
})();
