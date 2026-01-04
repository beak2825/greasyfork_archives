// ==UserScript==
// @name         Remove Old Reddit Notifications Badge
// @version      0.2
// @description  Removes the ugly new notifications badge from old reddit.
// @run-at document-start
// @match        https://old.reddit.com/*
// @license      MIT
// @grant        none
// @namespace    RORNB
// @downloadURL https://update.greasyfork.org/scripts/532497/Remove%20Old%20Reddit%20Notifications%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/532497/Remove%20Old%20Reddit%20Notifications%20Badge.meta.js
// ==/UserScript==

function cLog(text, subtext = "") {
    console.log(`[Remove Old Reddit Notifications Badge] ${text} ${subtext}`);
}

(function() {
    'use strict';
	cLog("Starting up...");
	// Fetch the header which contains notifications badge and other badges
	const header = document.querySelector('#header-bottom-right');
	const removeBadge = ((changes, observer) => {
		const badge = header.querySelector('#notifications');
		if (badge) {
			cLog("Found notifications badge. Removing...");
			badge.previousSibling.remove();
			badge.remove();
		}
		const count = header.querySelector('a.badge-count');
		if (count) {
			cLog("Found notifications count. Removing...");
			count.remove();
			// Disconnect the observer
			cLog("Shutting down...");
			observer.disconnect();
		}
	});

	(new MutationObserver(removeBadge)).observe(header, {childList: true, subtree: true});
})();
