// ==UserScript==
// @name		Test for TP PC
// @namespace	
// @version		0.1.1
// @description	Auto Gameplay
// @author		xLucifer
// @match		*.tppcrpg.net/*.php
// @run-at document-idle/
// @require      http://code.jquery.com/jquery-3.1.1.min.js
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/33071/Test%20for%20TP%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/33071/Test%20for%20TP%20PC.meta.js
// ==/UserScript==

if (document.getElementById("LoginID") !== null) {
	document.getElementById("LoginID").value = "xLucifer";
	document.getElementById("NewPass").value = "fishfood180";
	$("#loginSubmitButton").click();
}

(function() {
    'use strict';

const SECONDS = 0x3E8;
const MINUTES = 0x3c * SECONDS;
const HOURS = 0x3c * MINUTES;

var SEEDS = ['redMushroomSeeds', 'dottedGreenLeafSeeds', 'blewitMushroomSeeds', 'snapegrassSeeds']; //Order of Seeds
var seedplanted = ['redMushroomSeeds', 'redMushroomSeeds', 'redMushroomSeeds', 'redMushroomSeeds']; //Temp Seeds
var FIGHT_DESTINATION = 'forests'; // 'forests', 'fields', 'caves'
var VESSEL = 'rowBoat'; // 'rowBoat', 'canoe'
var BREWS = ['stardustPotion'];
var SMELT_TYPE = 'goldBar'; // 'glass', 'bronzeBar', 'ironBar', 'silverBar', 'goldBar', 'ancientBar'
var SMELT_AMOUNT = 10;
if (window.boundBronzeFurnace == 1) {
	SMELT_AMOUNT = 30;
}
if (window.boundIronFurnace == 1) {
	SMELT_AMOUNT = 75;
}
if (window.boundSilverFurnace == 1) {
	SMELT_AMOUNT = 150;
}
if (window.boundGoldFurnace == 1) {
	SMELT_AMOUNT = 300;
}

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

setInterval(function() {

    // FARMING
	for(var i = 0; i < 4; i++) {
        if(window["farming-patch-text-" + (i + 1)].innerHTML == "Click to harvest") {
            $harvest(i + 1);
        }
		if(window["farmingPatchTimer" + (i + 1)] > getGrowTime(seedplanted[i]) || window["farmingPatchTimer" + (i + 1)] == "0") {
			for(var jk = 0; jk < SEEDS.length; jk++) {
				if(window[SEEDS[jk]] >= 1) {
					$plant(SEEDS[jk], i + 1);
					seedplanted[i] = SEEDS[jk];
					$harvest(i + 1);
					break ;
				}
			}
		}
	}
    // COMBAT
    if(window["fight-cooldown"].innerHTML == "Ready" && combatGlobalCooldown == "0") {
        if(energy >= 1000) {
            $fight(FIGHT_DESTINATION);
        } else if (energy < 1000 & energy >= 100) {
            $fight('forests');
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
    // SMELTING
    if(smeltingPerc == "0") {
        $smelt(SMELT_TYPE, SMELT_AMOUNT);
	}
}, 5000);

setInterval(function() {
	$update();
}, 5 * MINUTES);

})();