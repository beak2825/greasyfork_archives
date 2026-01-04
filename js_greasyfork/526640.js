// ==UserScript==
// @name        Instagram Reels Improver
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/reel/*
// @grant       none
// @version     1.0
// @author      arsinclair
// @description This script removes the max-width of the div containing the video, so it can be viewed in full size. It also removes the related Reels below the video. Finally, it will turn the video sound on by default.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526640/Instagram%20Reels%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/526640/Instagram%20Reels%20Improver.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const div = document.querySelector('div[style="max-width: 673px;"]');
	if (div) {
		div.style.maxWidth = 'none';
	}

	const nextDiv = div.nextElementSibling;
	if (nextDiv) {
		const nextNextDiv = nextDiv.nextElementSibling;
		nextDiv.remove();
		if (nextNextDiv) {
			nextNextDiv.remove();
		}
	}

	const button = document.querySelector('button[aria-label="Toggle audio"]');
	if (button) {
		const svg = button.querySelector('svg[aria-label="Audio is muted"]');
		if (svg) {
			button.click();
		}
	}
})();