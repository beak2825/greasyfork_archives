// ==UserScript==
// @name         Melvor Farming Notifier
// @version      0.8
// @description  Plays a ding noise when a crop is ready
// @author       Asthereon
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/398618/Melvor%20Farming%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/398618/Melvor%20Farming%20Notifier.meta.js
// ==/UserScript==

let lastDing = -1;

function ding() {
	new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3").play();
}

function notify(msg) {
	One.helpers('notify', {
		type: 'dark',
		from: 'bottom',
		align: 'center',
		message: msg
	});
}

function checkForNewGrowth() {
	for (let i = 0; i < newFarmingAreas.length; i++) {
		for (let j = 0; j < newFarmingAreas[i].patches.length; j++) {
			if (newFarmingAreas[i].patches[j].hasGrown) {
				if ((Date.now() - lastDing) >= 60000) {
					lastDing = Date.now();
					notify("Some of your crops are grown");
					ding();
				}
			}
		}
	}
}

function checkForGemGloves() {
	if (glovesTracker[4].remainingActions < 500) {
		notify("Gem glove charges are getting low");
		ding();
	}
}

setInterval(function() {
	checkForNewGrowth();
	checkForGemGloves();
},10000);