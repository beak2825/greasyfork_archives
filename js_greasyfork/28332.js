// ==UserScript==
// @name		DH2 0% Gameplay QoL
// @namespace	
// @version		0.1.0
// @description	Literally zero gameplay
// @author		neeko
// @match		http://*.diamondhunt.co/game.php
// @match		https://*.diamondhunt.co/game.php
// @run-at document-idle
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/28332/DH2%200%25%20Gameplay%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/28332/DH2%200%25%20Gameplay%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

const SECONDS = 0x3E8;
const MINUTES = 0x3c * SECONDS;
const HOURS = 0x3c * MINUTES;

var SEEDS = ['redMushroomSeeds', 'redMushroomSeeds', 'redMushroomSeeds', 'redMushroomSeeds']; //dottedGreenLeafSeeds
var FIGHT_DESTINATION = 'volcano'; // 'forests', 'fields', 'caves'
var VESSEL = 'rowBoat'; // 'rowBoat', 'canoe'
var BREWS = ['stardustPotion', 'essencePotion', 'superEssencePotion', 'treePotion', 'seedPotion', 'oilPotion', 'smeltingPotion', 'barPotion', 'superStardustPotion']; 
var SMELT_TYPE = 'glass'; // 'glass', 'bronzeBar', 'ironBar', 'silverBar', 'goldBar', 'ancientBar'
var SMELT_AMOUNT = 150;
var SMELT_TIMER = 150 * SECONDS;

setTimeout(function() { $init(); }, 5000);

function $update() {
	if(webSocket.readyState > 1)
		location.reload();
}

function $vessel(vessel) {
    var cmd = ('BOAT=');
    sendBytes(cmd + vessel);
    console.log('sending', vessel);
}

function $drink(potion) {
	var cmd = 'DRINK=';
	sendBytes(cmd + potion);
	console.log('drinking', potion);
}

function $harvest(patchId) {
    var cmd = 'HARVEST=';
    sendBytes(cmd + patchId);
    console.log('harvesting', patchId);
}

function $plant(seed, patchId) {
	var cmd = 'PLANT=';
	sendBytes(cmd + seed + '~' + patchId);
	console.log('planting', seed, 'in patch:', patchId);
}

function $chop(patch) {
	var cmd = 'CHOP_TREE=';
	sendBytes(cmd + patch);
	console.log('chopping', patch);
}

function $fight(location) {
	var cmd = 'FIGHT=';
	sendBytes(cmd + location);
	console.log('fighting at', location);
}

function $brew(potion, amount) {
    var cmd = "BREW=";
    sendBytes(cmd + potion + "~" + amount);
    console.log('brewing', amount, potion);
}

function $smelt(bar, amount) {
    var cmd = 'SMELT=';
    sendBytes(cmd + bar + '~' + amount);
    console.log('smelting', bar, amount);
}

function $init() {
    if(smeltingPerc == "0")
        $smelt(SMELT_TYPE, SMELT_AMOUNT);
}

setInterval(function() {
    // FARMING
	for(var i = 0; i < SEEDS.length; i++) {
        if(window["farming-patch-text-" + (i + 1)].innerHTML == "Click to harvest") {
            $harvest(i + 1);
        }
		if(window["farmingPatchTimer" + (i + 1)] > getGrowTime(SEEDS[i]) || window["farmingPatchTimer" + (i + 1)] == "0") { // || window["farmingPatchTimer" + (i + 1)] == "0"
			if(window[SEEDS[i]] > 1) {
				$plant(SEEDS[i], i + 1);
                $harvest(i + 1);
			}
		}
	}
    // COMBAT
    if(window["fight-cooldown"].innerHTML == "Ready" && combatGlobalCooldown == "0") {
        if(energy >= 1000) {
            $fight(FIGHT_DESTINATION);
        } else if (energy < 1000 & energy >= 50) {
            $fight('fields');
        }
    }

    // DRINKING
    for(var j = 0; j < BREWS.length; j++) {
        if(window[BREWS[j] + "Timer"] == "0") {
            if(window[BREWS[j]] > 0) {
                $drink(BREWS[j]);
            }
        }
    }
    // FISHING
    if(window[VESSEL + "Timer"] == "0") {
        $vessel(VESSEL);
    }
    // WOODCUTTING
    for(var tree = 1; tree < 7; tree++) {
        if(window["wc-div-tree-lbl-" + tree].innerHTML == "(ready)") {
            if(window["treeUnlocked" + tree]) {
                $chop(tree);
            }
        }
    }
    // BREWING
    if(dottedGreenLeaf > 0 && vialOfWater > 0 && redMushroom >= 25) {
       var reds = Math.floor(redMushroom / 25);
        $brew('stardustPotion', reds >= dottedGreenLeaf ? dottedGreenLeaf : reds);
    }
}, 5000);

setInterval(function() {
	$update();
}, 5 * MINUTES);

setInterval(function()	{
    if(smeltingPerc == "0")
        $smelt(SMELT_TYPE, SMELT_AMOUNT);
}, SMELT_TIMER);

})();