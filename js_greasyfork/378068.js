// ==UserScript==
// @name         Twitch Stop Autoplay
// @namespace    https://github.com/kittenparry/
// @version      0.9
// @description  Tries to stop autoplay on Twitch home page.
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       kittenparry
// @match        *://www.twitch.tv
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/378068/Twitch%20Stop%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/378068/Twitch%20Stop%20Autoplay.meta.js
// ==/UserScript==

$(document).ready(() => {
	console.log('LOG: Loading page.');
	var start_trying = setTimeout(() => {
		var doc = document.querySelector('button[class="player-button qa-pause-play-button"]');
		if (doc) {
			doc.click();
			console.log('LOG: Stopped auto-play.');
		}
	}, 3000);
});
// 3000 might not be enough on some computers
// needs testing and catching these problems
