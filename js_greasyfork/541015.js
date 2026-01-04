// ==UserScript==
// @name        Refresh Youtube, Experiencing Interruptions
// @namespace   Youtube
// @match       *://www.youtube.com/*
// @grant       none
// @version     0.0.1
// @author      --
// @description --
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541015/Refresh%20Youtube%2C%20Experiencing%20Interruptions.user.js
// @updateURL https://update.greasyfork.org/scripts/541015/Refresh%20Youtube%2C%20Experiencing%20Interruptions.meta.js
// ==/UserScript==


(function() {
	'use strict';

	function main() {
		const check = setInterval(function() {
			// Check for elements
			const popup_containers = document.getElementsByTagName("ytd-popup-container");
			console.debug(popup_containers);
			const outer_div = popup_containers[0].querySelector("yt-notification-action-renderer > tp-yt-paper-toast > div#text-container");
			console.debug(outer_div);
			if (outer_div !== null) {
				const is_visible = outer_div.checkVisibility({contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true});
				if (is_visible) {
					clearInterval(check);
					window.location.reload();
				}
			}
		}, 100);
	};
	main();
})();
