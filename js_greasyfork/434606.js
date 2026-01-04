// ==UserScript==
// @name        Melvor Auto Slayer
// @namespace   http://tampermonkey.net/
// @version     0.8.0-0.22.1
// @description Automatically jumps to new task when the current one is completed
// @author      WhackyGirl
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @exclude     https://*.melvoridle.com/index.php
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434606/Melvor%20Auto%20Slayer.user.js
// @updateURL https://update.greasyfork.org/scripts/434606/Melvor%20Auto%20Slayer.meta.js
// ==/UserScript==

window.isAutoSlayerEnabled = false;

function getAutoSlayerButtonText() {
	return "Turn Auto Slayer " + (window.isAutoSlayerEnabled ? "off" : "on");
}

function injectDomElements(argument) {
	$("#combat-slayer-task-container").find("#combat-slayer-task-jump").after("<button role='button' class='btn btn-sm btn-success mt-2' id='combat-slayer-task-auto'>" + getAutoSlayerButtonText() + "</button>");

	$( "#combat-slayer-task-auto" ).click(function() {
		window.isAutoSlayerEnabled = !window.isAutoSlayerEnabled;
		$("#combat-slayer-task-auto").html(getAutoSlayerButtonText());
		$("#combat-slayer-task-auto").toggleClass("btn-success");
		$("#combat-slayer-task-auto").toggleClass("btn-warning");
	});
}

function loadScript() {
    if (confirmedLoaded) {
        // Only load script after game has opened
        clearInterval(scriptLoader);
        injectDomElements();
    }
}

const scriptLoader = setInterval(loadScript, 200);

var autoslayer = setInterval(() => {
	if(window.isAutoSlayerEnabled) {
		if(combatManager.slayerTask.monster.name !== MONSTERS[combatManager.selectedMonster].name) {
	    	combatManager.slayerTask.jumpButton.click();
		}
	}
}, 600);