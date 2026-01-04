// ==UserScript==
// @name         Melvor Slayer Task Notification
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Gives you a notification on Completion of Slayer Task
// @author       Breindahl#2660
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404853/Melvor%20Slayer%20Task%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/404853/Melvor%20Slayer%20Task%20Notification.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Made for version 0.17

(function () {
	function injectScript(main) {
		var script = document.createElement('script');
		script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
		document.body.appendChild(script).parentNode.removeChild(script);
	}

	function script() {
		// Loading script
		console.log('Melvor Slayer Task Notification Loaded');

		function updateSlayerTaskOverwrite(qty) {
			if (qty > 0) {
				slayerTask[0].count -= qty;
				if (slayerTask[0].count < 1) {
					previousSlayerTask = slayerTask[0].monsterID;
					slayerTask = [];
					notifyPlayer(CONSTANTS.skill.Slayer, "You have completed your Slayer task.", "success");
					// Notification sound added
					let ding = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3");
					ding.volume=0.1;
					ding.play();
					// End of modification
					if (autoSlayerTask) getSlayerTask();
				}
			}
			if (!slayerTask.length) {
				$("#combat-player-slayer-task").html('<button type="button" class="btn btn-sm btn-success" onclick="getSlayerTask();">New Task</button>');
			} else {
				$('[data-toggle="tooltip"]').tooltip("hide");
				let a = findEnemyArea(slayerTask[0].monsterID);
				let cost = getSlayerCost();
				$("#combat-player-slayer-task").html(
					'<img class="skill-icon-xs m-0 mr-2 js-tooltip-enabled" src="' +
						MONSTERS[slayerTask[0].monsterID].media +
						'" data-toggle="tooltip" data-html="true" data-placement="bottom" title data-original-title="<small>Found in:</small><br><span class=\'text-warning\'>' +
						a +
						'</span>"><a class="combat-action" href="#" onClick="jumpToEnemy(' +
						slayerTask[0].monsterID +
						'); return false;">' +
						numberWithCommas(slayerTask[0].count) +
						" x " +
						MONSTERS[slayerTask[0].monsterID].name +
						"</a>"
				);
				$("#combat-player-slayer-new-btn").html('<a class="pointer-enabled combat-action" id="slayer-task-refresh" href="#" onclick="newSlayerTask(); return false;"><small>New Task</small></a>');
			}
		}

		window.updateSlayerTask = function(...args) {
			updateSlayerTaskOverwrite(...args);
		};
	}
	
	function loadScript() {
		if ((window.isLoaded && !window.currentlyCatchingUp) || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) { // Only load script after game has opened
			clearInterval(scriptLoader);
			injectScript(script);
		}
	}

	const scriptLoader = setInterval(loadScript, 200);
})();