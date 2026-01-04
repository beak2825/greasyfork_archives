// ==UserScript==
// @name         YouTube shorts redirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Fuim
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @description YouTube shorts redirect / YouTube shorts redirect
// @downloadURL https://update.greasyfork.org/scripts/529891/YouTube%20shorts%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/529891/YouTube%20shorts%20redirect.meta.js
// ==/UserScript==

(function () {
	'use strict';
	function redirect() {
		if (location.pathname.startsWith("/shorts")) {
			// 0     1       2
			//   /shorts/abcde123456
			const videoId = location.pathname.split("/")[2];
			const newUrl = "https://www.youtube.com/watch?v=" + videoId;
			window.location.replace(newUrl);
		}
	}

	// Run it normally once in case a youtube shorts url was opened directly
	redirect();

	// Use this event so it'll work when navigating inside of youtube.
	// Otherwise, people have to refresh the page for it to work.
	// Some other events that might work? yt-page-data-updated, yt-page-type-changed, yt-navigate-finish
	document.addEventListener("yt-navigate-start", redirect);

})();