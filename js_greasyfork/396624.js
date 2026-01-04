// ==UserScript==
// @name          Twitch Channel Points Collector
// @version       1.1
// @description   It claims the bonus channel points. Checks every 5 seconds.
// @author        MrMike
// @namespace     MrMike/Twitch
// @match         https://*.twitch.tv/*
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/396624/Twitch%20Channel%20Points%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/396624/Twitch%20Channel%20Points%20Collector.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function executeCode(f) {
		var script = document.createElement("script");
		script.id = "injectedScript";
		script.appendChild(document.createTextNode(`(${f.toString()})()`));
		(document.body || document.head || document.documentElement).appendChild(script);
	}

	executeCode(() => {
		function claimBonus() {
			let cbi = document.getElementsByClassName("claimable-bonus__icon");
			if (cbi.length > 0) {
				setTimeout(() => {
					cbi[0].click();
				}, 250);
			}
		}
		setInterval(claimBonus, 5000);
	});
})();