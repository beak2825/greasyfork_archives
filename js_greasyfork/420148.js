// ==UserScript==
// @name         Auto FI Warden/Paragon TSENRAE
// @namespace    http://tampermonkey.net/
// @version      1.0.6.9
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
// @downloadURL https://update.greasyfork.org/scripts/420148/Auto%20FI%20WardenParagon%20TSENRAE.user.js
// @updateURL https://update.greasyfork.org/scripts/420148/Auto%20FI%20WardenParagon%20TSENRAE.meta.js
// ==/UserScript==

console.log('Auto FI Warden/Paragon/Pirates Debug enabled');

//SETTINGS

//ISLANDS
//Physical (CMB), Tactical (CSW), Hydro (SOS), Shadow (CTT), Arcane (GGAT), Draconic (DSC), Law (EPCT), Forgotten (ILT)
var islandHAITrap = [1126,1833,1515,2394,2732,2842,2621,1918];
var islandLAITrap = [1126,1833,1515,2394,2732,2842,2621,1918];
//PB = 2904 | SSDC = 3023
var islandBase = [2904,2904,2904,2904,2904,2904,2904,2904];
// UAC=1822|RC=1692|ULC = 473|FULC=1288|RULC=1650|UPC=545|FUPC=2819|RUPC=1651|FULPC=2524|Forgotten = 426
var islandHAICharm = [1288,1288,1288,1288,1288,1288,1288,2524];
var islandLAICharm = [1692,1822,1692,1692,1822,1822,1692,1692];
// CC = 3089
var islandBait = 3089;

//PARAGONS
var paragonTrap = [2844,1833,2843,2394,2732,2842,2621,1918]
var paragonCharm = 1651; //RUPC=1651|
var paragonBase = 2904; //PB = 2904 | SSDB = 3023
var paragonBait = 1967; //ESB

//WARDENS
var wardenTrap = 2844; //SSST
var wardenBase = 2904;
var wardenCharm = 1651; //RUPC=1651|
var wardenBait = 1967; //ESB

//PIRATES
var pirateTrap = 3152; //S.S.=3152|
var pirateBase = 2904;
var pirateCharm = 1288; //FULC
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
islandPowerType = '';
let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
powerType = ["phscl", "tctcl", "hdr", "shdw", "arcn", "drcnc", "law", "frgttn"];
islandType = '';

//Updates current user status
function getStats() {
    currentBait = user.bait_item_id;
    currentCharm = user.trinket_item_id;
    currentTrap = user.weapon_item_id;
    currentBase = user.base_item_id;
    islandPowerType = user.quests.QuestFloatingIslands.hunting_site_atts.island_power_type;
    islandType = user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude;
};

function autoFI() {
    //Checks if user is at launch pad
    if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name != "Launch Pad") {
        //Checks if user is at HAI or LAI
        if (islandType != true) {
            //Checks if user is at warden
            if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true) {
                setTrap(wardenTrap);
                setBait(wardenBait);
                setBase(wardenBase);
                setCharm(wardenCharm);
                console.log("jerrytf");
            }
            //If user is not at warden
            else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter != true) {
                //If pirate cheese > 0 and double pirates are activated
                if (findDuplicates(user.enviroment_atts.hunting_site_atts.activated_island_mod_types) == "sky_pirates" && parseInt(document.getElementsByClassName("floatingIslandsHUD-bait-quantity quantity")[1].innerText) > 0) {
                    setTrap(pirateTrap);
                    setBait(pirateBait);
                    setBase(pirateBase);
                    setCharm(pirateCharm);
                    console.log("kekw");
                }
                //If pirate cheese = 0
                else if (parseInt(document.getElementsByClassName("floatingIslandsHUD-bait-quantity quantity")[1].innerText) == 0) {
                    var a = powerType.indexOf(islandPowerType);
                    setTrap(islandLAITrap[a]);
                    setBase(islandBase[a]);
                    setCharm(islandLAICharm[a]);
                    setBait(islandBait);
                    console.log("poppo");
                }
                else {
                    return;
                }
            }
        }
        else if (islandType == true) {
            var b = powerType.indexOf(islandPowerType);
            //Checks if user is at paragon
            if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true) {
                setTrap(paragonTrap[b]);
                setBase(paragonBase)
                setBait(paragonBait);
                setCharm(paragonCharm);
                console.log("dogekek");
            }
            else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter != true) {
                setTrap(islandHAITrap[b]);
                setCharm(islandHAICharm[b]);
                setBase(islandBase[b]);
                setBait(islandBait);
                console.log("christ");
            }
        }
        //Bottled Wind Control
        if (currentBait == pirateBait) {
            toggleWind(null);
        }
        else if (user.enviroment_atts.hunting_site_atts.island_progress < 36) {
            toggleWind(true);
        }
        else if (user.enviroment_atts.hunting_site_atts.island_progress >= 36) {
            toggleWind(null);
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

function toggleWind(state) {
    if (user.quests.QuestFloatingIslands.hunting_site_atts.is_fuel_enabled != state) {
        hg.views.HeadsUpDisplayFloatingIslandsView.toggleFuel();
    }
}