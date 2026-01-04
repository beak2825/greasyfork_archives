// ==UserScript==
// @name		Melvor Idle - Notifications
// @namespace	http://tampermonkey.net/
// @version		0.4.2
// @description	Notifies you when your hitpoints go below 40%, your loot container is full or a wave in golbin raid is finished.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/436210/Melvor%20Idle%20-%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/436210/Melvor%20Idle%20-%20Notifications.meta.js
// ==/UserScript==

function script() {
	let notificationSound = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3");
    notificationSound.volume = 0;
	
	let previousDrops = combatManager.loot.drops.length;
	let maxDrops = combatManager.loot.maxLoot;

	let previousHealth = player.hitpointsPercent;
	let healthThreshold = 0.4;
	
	let previousWave = raidManager.wave;

	function notifyLootContainerFull() {
		let drops = combatManager.loot.drops.length;
		
		if (drops == maxDrops && drops != previousDrops) {
			notificationSound.play();
		}
		
		previousDrops = drops;
	}

	function notifyLowHealth(){
		let currentHealth = player.hitpointsPercent
		if (currentHealth < 100 * healthThreshold && currentHealth != previousHealth) {
			notificationSound.play();
		}
		
		previousHealth = player.hitpointsPercent;
	}

    function notifyWaveFinished() {
		if ((raidManager.state == RaidState.SelectingCategory || raidManager.state == RaidState.SelectingItem || raidManager.state == RaidState.SelectingModifiersWave) && raidManager.wave != previousWave) {
			notificationSound.play();
		}
		
		previousWave = raidManager.wave;
    }
	
	function injectVolumeSlider(){
		if (!document.getElementById("volume")) {
			let htmlVolumeSlider = `
				<div class="block block-rounded-double bg-combat-inner-dark text-center p-3">
					<div class="row no-gutters">
						<div class="col-12">
							<h5 class="font-w700 text-combat-smoke m-1 mb-2">Notification Volume</h5>
						</div>
					</div>
					<div class="row gutters-tiny">
						<div class="col-12">
							<input type="range" class="m-1" id="volume" min="0" max="100" style="width: 80%;">
						</div>
					</div>
				</div>
			`;
			
			var template = document.createElement('template');
			template.innerHTML = htmlVolumeSlider.trim();
			
			let combatDivs = document.querySelector("#combat-fight-container-player > div > div > div:nth-child(3) > div");
			combatDivs.appendChild(template.content.firstChild);

			let volumeElement = document.getElementById("volume")
			volumeElement.value = notificationSound.volume;
			
			volumeElement.addEventListener("change", function() {
				notificationSound.volume = volumeElement.value / 100;
			}, false);
		}
	}

	let intervalLoot = setInterval(notifyLootContainerFull, 100);
	let intervalHealth = setInterval(notifyLowHealth, 100);
	let intervalWaveFinished = setInterval(notifyWaveFinished, 100);
	let intervalVolumeSlider = setInterval(injectVolumeSlider, 100);
}

function loadScript() {
    if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
        clearInterval(scriptLoader);
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
        document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
    }
}

const scriptLoader = setInterval(loadScript, 200);