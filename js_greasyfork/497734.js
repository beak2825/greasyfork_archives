// ==UserScript==
// @name         Slack auto-open link in browser
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Automatically clicks the "open this link in your browser" 
//				link in Slack/archives webpages
// @author      AdrianSkar
// @match        *://*.slack.com/archives/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497734/Slack%20auto-open%20link%20in%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/497734/Slack%20auto-open%20link%20in%20browser.meta.js
// ==/UserScript==

(function () {
	'use strict';
	function clickLink() {
		const links = document.querySelectorAll('a');
		// Find target link by its text content
		for (let link of links) {
			if (link.textContent.includes("open this link in your browser")) {
				link.click();
				console.log('Auto-clicked link:', link.href);
				break; // Stop after clicking the first matching link
			}
		}
	}
	window.onload = function () {
		setTimeout(clickLink, 100); // Delay execution by Xms
	};
	// Optionally, if content might load dynamically even after window.onload,
	// you can set an interval to attempt clicking periodically
	// setInterval(clickLink, 5000); // Attempt to click every 5 seconds
})();