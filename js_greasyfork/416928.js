// ==UserScript==
// @name         Auto Seasonal Garden
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto SG
// @author       You
// @match        https://longtail-new.mousehuntgame.com/
// @grant        GM_info
// @run-at        document-end
// @include        http://mousehuntgame.com/*
// @include        https://mousehuntgame.com/*
// @include        http://www.mousehuntgame.com/*
// @include        https://www.mousehuntgame.com/*
// @include        http://apps.facebook.com/mousehunt/*
// @include        https://apps.facebook.com/mousehunt/*
// @include        http://hi5.com/friend/games/MouseHunt*
// @include        http://mousehunt.hi5.hitgrab.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/416928/Auto%20Seasonal%20Garden.user.js
// @updateURL https://update.greasyfork.org/scripts/416928/Auto%20Seasonal%20Garden.meta.js
// ==/UserScript==

console.log('Auto SG Enabled');

(function() {
    const interval = setInterval(function() {
        //Insert functions here
        if (user.environment_name != "Seasonal Garden") {
            return;
        }
        else {
            getStats();
            seasonCheck();
        }
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

//SETTINGS

gardenBait = 98; //GOUDA
gardenCharm = 0; //Set to 0 for no charm
gardenBase = 1233; //Eerier
bestHydro = 39; //ASG
bestShadow = 44; //COT
bestTactical = 55; //HVMT
bestPhysical = 530; //ERB

//SETTINGS END

var currentBait = '';
var currentTrap = '';
var currentBase = '';
var currentCharm = '';

function getStats() {
    currentBait = user.bait_item_id;
    currentTrap = user.weapon_item_id;
    currentBase = user.base_item_id;
    currentCharm = user.trinket_item_id;
    currentSeason = document.getElementsByClassName("seasonalGardenHeaderValue")[0].innerText;
}

function seasonCheck() {
    setBait(gardenBait);
    setBase(gardenBase);
    setCharm(gardenCharm);
    if (currentSeason == "FALL") {
        setTrap(bestShadow);
    }
    else if (currentSeason == "WINTER") {
        setTrap(bestHydro);
    }
    else if (currentSeason == "SUMMER") {
        setTrap(bestTactical);
    }
    else if (currentSeason == "SPRING") {
        setTrap(bestPhysical);
    }
}

//Trap Control
function setTrap(trapID) {
    if (currentTrap != trapID) {
        hg.utils.TrapControl.setWeapon(trapID).go();
        console.log("Trap " + trapID + " armed!");
    };
};

function setBait(baitID) {
    if (currentBait != baitID) {
        hg.utils.TrapControl.setBait(baitID).go();
        console.log("Bait " + baitID + " armed!");
    };
};

function setCharm(charmID) {
    if (gardenCharm == 0) {
        if (currentCharm != null) {
            hg.utils.TrapControl.disarmTrinket().go();
            console.log("Charm disarmed!");
        }
        else {
            return;
        }
    }
    else if (currentCharm != charmID) {
        hg.utils.TrapControl.setTrinket(charmID).go();
        console.log("Charm " + charmID + " armed!");
    };
};

function setBase(baseID) {
    if (currentBase != baseID) {
        hg.utils.TrapControl.setBase(baseID).go();
        console.log("Base " + baseID + " armed!");
    };
};