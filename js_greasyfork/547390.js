// ==UserScript==
// @name         Youtube Fixed Quality
// @namespace    https://gitlab.com/Dwyriel
// @version      1.0.1
// @description  A dumb script that sets the player to the desired resolution, or the highest possible if it doesn't exist
// @author       Dwyriel
// @license      MIT
// @match        *://*.youtube.com/*
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547390/Youtube%20Fixed%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/547390/Youtube%20Fixed%20Quality.meta.js
// ==/UserScript==

(function () {
    'use strict';
	const desiredQuality = "1080"; //edit this line

	setInterval(() => {
		let player = document.getElementById("movie_player");
		if (player.getPlaybackQuality().includes(desiredQuality))
			return;
		let qualities = player.getAvailableQualityLevels();
		for(let quality of qualities) {
			if (quality.includes(desiredQuality)) {
				player.setPlaybackQualityRange(quality);
				return;
			}
		}
		player.setPlaybackQualityRange(qualities[0]);
	}, 1500);
})();
