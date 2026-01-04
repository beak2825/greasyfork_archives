// ==UserScript==
// @name         Auto FI Warden/Paragon for self
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Auto FI
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
// @downloadURL https://update.greasyfork.org/scripts/424866/Auto%20FI%20WardenParagon%20for%20self.user.js
// @updateURL https://update.greasyfork.org/scripts/424866/Auto%20FI%20WardenParagon%20for%20self.meta.js
// ==/UserScript==

console.log('Auto FI Warden/Paragon/Pirates enabled');

//SETTINGS

//ISLANDS
//Physical (CMB), Tactical (Tact 1), Hydro (SOS), Shadow (CTT), Arcane (A1), Draconic (DSC), Law (EPCT), Forgotten (F1)
var islandHAITrap = [1126,3088,1515,2394,3082,2842,2621,3084];
var islandLAITrap = [1126,3088,1515,2394,3082,2842,2621,3084];
//PB = 2904 | SSDC = 3023
var islandBase = [2904,2904,2904,2904,2904,2904,2904,2904];
// UAC = 1822 | Forgotten = 426 | RC = 1692 | RULC = 1650
var islandHAICharm = [1692,1692,1692,1692,1650,1650,1692,1650];
var islandLAICharm = [1692,1822,1692,1692,1692,1692,1822,1692];
// CC = 3089
var islandBait = 3089;

//PARAGONS
var paragonTrap = [1126,3088,1515,2394,3082,2842,2621,3084];
var paragonCharm = 851; //UPC = 545 | UAC = 1822 | RGGSTRA - 851
var paragonBase = 3023; //PB = 2904 | SSDB = 3023
var paragonBait = 1967; //ESB

//WARDENS
var wardenTrap = 3088; //SBT
var wardenBase = 3023;
var wardenCharm = 1920; //UPC = 545 || ULPC 1920
var wardenBait = 1967; //ESB

//PIRATES
var pirateTrap = 3152; //SS SCOUNDRAL
var pirateBase = 2904;
var pirateCharm = 1920; //RULC
var pirateBait = 3090; //SKY PIRATE SWISS

//SETTINGS END

(function() {
    const interval = setInterval(function() {
        if (user.environment_name != "Floating Islands") {
            return;
        }
        else {
            //Insert fucntions here
            getStats();
            setTimeout(function(){
                autoFI();
            }, 1000)
        }
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

var currentBait = '';
var currentCharm = '';
var currentTrap = '';
var currentBase = '';
var islandPowerType = '';
let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
var powerType = ["phscl", "tctcl", "hdr", "shdw", "arcn", "drcnc", "law", "frgttn"];

//Updates current user status
function getStats() {
    currentBait = user.bait_item_id;
    currentCharm = user.trinket_item_id;
    currentTrap = user.weapon_item_id;
    currentBase = user.base_item_id;
    islandPowerType = user.quests.QuestFloatingIslands.hunting_site_atts.island_power_type;
};

function autoFI() {
    //Checks if user is at launch pad
    if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name != "Launch Pad") {
        //Checks if user is at HAI or LAI
        if (document.getElementsByClassName("floatingIslandsHUD-islandTitle")[0].innerText.includes("Island") == true) {
            //Checks if user is at warden
            if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true) {
                setTrap(wardenTrap);
                setBait(wardenBait);
                setBase(wardenBase);
                setCharm(wardenCharm);
            }
            //If user is not at warden
            else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter != true) {
                //If pirate cheese > 0 and double pirates are activated
                if (findDuplicates(user.enviroment_atts.hunting_site_atts.activated_island_mod_types) == "sky_pirates" && parseInt(document.getElementsByClassName("floatingIslandsHUD-bait-quantity quantity")[1].innerText) > 0) {
                    setTrap(pirateTrap);
                    setBait(pirateBait);
                    setBase(pirateBase);
                    setCharm(pirateCharm);
                }
                //If pirate cheese = 0
                else {
                    var a = powerType.indexOf(islandPowerType);
                    setTrap(islandLAITrap[a]);
                    setBase(islandBase[a]);
                    setCharm(islandLAICharm[a]);
                    setBait(islandBait);
                }
            }
        }
        else if (document.getElementsByClassName("floatingIslandsHUD-islandTitle")[0].innerText.includes("Island") == false) {
            var b = powerType.indexOf(islandPowerType);
            //Checks if user is at paragon
            if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true) {
                setTrap(paragonTrap[b]);
                setBase(paragonBase)
                setBait(paragonBait);
                setCharm(paragonCharm);
            }
            else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter != true) {
                setTrap(islandHAITrap[b]);
                setCharm(islandHAICharm[b]);
                setBase(islandBase[b]);
                setBait(islandBait);
            }
        }
    }
    //Board Reroll Control
    else if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name == "Launch Pad") {
        //HAI Reroll
        if (user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught == 4) {
            //insert reroll logic for pirate pirate cache here
            return;
        }
        else if (user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught < 4) {
            //If pirate cheese >0
            if (parseInt(document.getElementsByClassName("floatingIslandsHUD-bait-quantity quantity")[1].innerText) != 0) {
                //insert reroll logic for double pirate
                return;
            }
            //If pirate cheese = 0
            else if (parseInt(document.getElementsByClassName("floatingIslandsHUD-bait-quantity quantity")[1].innerText) == 0) {
                //insert reroll logic for shrine first 
                return;
            }
        }
    }
}

//Trap Control

//Sets cheese
function setBait(baitID) {
    if (currentBait != baitID) {
        hg.utils.TrapControl.setBait(baitID).go();
    }
};

//Sets Charm
function setCharm(charmID) {
    if (currentCharm != charmID) {
        hg.utils.TrapControl.setTrinket(charmID).go();
    }
};

//Sets Trap
function setTrap(trapID) {
    if (currentTrap != trapID) {
        hg.utils.TrapControl.setWeapon(trapID).go();
    }
};

//Sets Base
function setBase(baseID) {
    if (currentBase != baseID) {
        hg.utils.TrapControl.setBase(baseID).go();
    }
}
