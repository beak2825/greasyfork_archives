// ==UserScript==
// @name         Reddit-Stream Auto-Refresh-Faster
// @namespace    nick2bad4u
// @description  Auto-Refreshes your Reddit-Stream.com page every 30 seconds. Modify the script and change to any time you want.
// @author       Nick2bad4u
// @match        https://reddit-stream.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit-stream.com
// @version      2.3
// @grant        none
// @homepage     https://github.com/Nick2bad4u/UserStyles
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @license CC-BY-SA-3.0; http://creativecommons.org/licenses/by-sa/3.0/
// @license MIT
// @tag          reddit
// @downloadURL https://update.greasyfork.org/scripts/514689/Reddit-Stream%20Auto-Refresh-Faster.user.js
// @updateURL https://update.greasyfork.org/scripts/514689/Reddit-Stream%20Auto-Refresh-Faster.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// Refresh Interval in milliseconds
	const REFRESH_INTERVAL = 10 * 1000;
	// Reload page after REFRESH_INTERVAL
	setTimeout(function () {
		location.reload(); // Reload the page
	}, REFRESH_INTERVAL); // 10 seconds
})();
