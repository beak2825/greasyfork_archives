// ==UserScript==
// @name         Auto FI 2.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto FI V2
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
// @downloadURL https://update.greasyfork.org/scripts/432945/Auto%20FI%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/432945/Auto%20FI%2020.meta.js
// ==/UserScript==

console.log("Auto FI 2.0 Loaded")

//SETTINGS

//LOW-ALTITUDE ISLANDS
var autoLai = true //Set to false if you want to manually control LAIs
var laiTrap = {"Physical":1126, "Tactical":3087, "Hydro":3257, "Shadow":2394, "Arcane":3081, "Draconic":2842, "Law":3085, "Forgotten":3083}
//UAC = 1822 | RULC = 1650 | RC = 1692
var laiCharm = {"Physical":1822, "Tactical":1822, "Hydro":1822, "Shadow":1822, "Arcane":1822, "Draconic":1822, "Law":1822, "Forgotten":1822}
//PB = 2904 | SSDB = 3023
var laiBase = 2904
var laiBait = 3089 //CCC = 3089 | ERCC = 3274

//HIGH-ALTITUDE ISLANDS
var autoHai = true //Set to false if you want to manually control HAIs
var haiTrap = {"Physical":1126, "Tactical":3087, "Hydro":3257, "Shadow":2394, "Arcane":3081, "Draconic":2842, "Law":3085, "Forgotten":3083}
//UAC = 1822
var haiCharm = {"Physical":1822, "Tactical":1822, "Hydro":1822, "Shadow":1822, "Arcane":1822, "Draconic":1822, "Law":1822, "Forgotten":1822}
//PB = 2904 | SSDB = 3023
var haiBase = 2904

//PALACE ISLANDS
var autoPalace = true //Set to false if you want to manually control palace
var palTrap = {"Physical":1126, "Tactical":3087, "Hydro":3257, "Shadow":2394, "Arcane":3081, "Draconic":2842, "Law":3085, "Forgotten":3083}
//UAC = 1822
var palCharm = {"Physical":1822, "Tactical":1822, "Hydro":1822, "Shadow":1822, "Arcane":1822, "Draconic":1822, "Law":1822, "Forgotten":1822}
//PB = 2904 | SSDB = 3023
var palBase = 2904
var palBait = 3274 //CCC = 3089 | ERCC = 3274

//LAUNCHPAD
var autoLP = false //Set to false if you want to manually control launchpad
var lpTrap = 3087;
var lpBase = 2904;
var lpCharm = 1822;
var lpBait = 1967; //ESB

//WARDENS
var autoWarden = true //Set to false if you don't want your setup to be changed for wardens
var wardenTrap = 3087; //SBT
var wardenBase = 2904;
var wardenCharm = 2121; //UPC = 545
var wardenBait = 1967; //ESB

//PARAGONS
var autoPara = true //Set to false if you don't want your setup to be changed for paragons
var paragonTrap = {"Physical":1126, "Tactical":3087, "Hydro":3257, "Shadow":2394, "Arcane":3081, "Draconic":2842, "Law":3085, "Forgotten":3083}
var paragonCharm = 2121; //UPC = 545 | UAC = 1822
var paragonBase = 2904; //PB = 2904 | SSDB = 3023
var paragonBait = 3274; //ERCC

//PIRATES
var haiPirates = false //Set to true if you want to hunt tier 2 pirates in HAI as well
var pirateTrap = 3087; //SBT
var pirateBase = 2904;
var pirateCharm = 1650; //RULC
var pirateBait = 3090; //SKY PIRATE SWISS

//EMPRESS
var autoEE = true; //Set to false if you don't want your setup to be changed for empress
var empressTrap = 3087;
var empressBase = 2904;
var empressCharm = 1650;
var empressBait = 3274;

//END OF SETTINGS

(function() {
    const interval = setInterval(function() {
        if (user.environment_name != "Floating Islands") {
            return;
        }
        else {
            //Insert fucntions here
            getStats();
            setTimeout(function(){
                autoF();
            }, 1000)
        }
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

const powerTypes = {"phscl":"Physical", "tctcl":"Tactical", "hdr":"Hydro", "shdw":"Shadow", "arcn":"Arcane", "drcnc":"Draconic", "law":"Law", "frgttn":"Forgotten"}
//Trap,Base,Charm,Bait
var setup = []
//LAI/HAI/PAL/LP,PowerType,Pirates
var currentIsland = ["","",false]
let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

function getStats() {
    setup.push(parseInt(user.weapon_item_id), parseInt(user.base_item_id), parseInt(user.trinket_item_id), user.bait_item_id)
    if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name.includes("Island")) {
        currentIsland[0] = "LAI"
    }
    else if (user.quests.QuestFloatingIslands.is_at_sky_palace == true) {
        currentIsland[0] = "PAL"
    }
    else if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name == "Launch Pad") {
        currentIsland[0] = "LP"
    }
    else {
        currentIsland[0] = "HAI"
    }
    currentIsland[1] = powerTypes[user.quests.QuestFloatingIslands.hunting_site_atts.island_power_type]
    if (findDuplicates(user.quests.QuestFloatingIslands.hunting_site_atts.activated_island_mod_types) == "sky_pirates") {
        currentIsland[2] = "Pirates"
    }
    else {
        currentIsland[2] = false
    }
}

function autoF() {
    if (currentIsland[0] == "LP" && autoLP == true) {
        setupC(lpTrap,lpBase,lpCharm,lpBait)
    }
    else if (currentIsland[0] == "LAI" && autoLai == true) {
        if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true && autoWarden == true) {
            setupC(wardenTrap,wardenBase,wardenCharm,wardenBait)
            return
        }
        if (currentIsland[2] == "Pirates") {
            setupC(pirateTrap,pirateBase,pirateCharm,pirateBait)
            return
        }
        setupC(laiTrap[currentIsland[1]],laiBase,laiCharm[currentIsland[1]],laiBait)
    }
    else if (currentIsland[0] == "HAI" && autoHai == true) {
        if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true && autoPara == true) {
            setupC(paragonTrap[currentIsland[1]],paragonBase,paragonCharm,paragonBait)
            return
        }
        if (currentIsland[2] == "Pirates" && haiPirates == true) {
            setupC(pirateTrap,pirateBase,pirateCharm,pirateBait)
            return
        }
        setupC(haiTrap[currentIsland[1]],haiBase,haiCharm[currentIsland[1]],haiBait)
    }
    else if (currentIsland[0] == "PAL" && autoPalace == true) {
        if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true && autoEE == true) {
            setupC(empressTrap,empressBase,empressCharm,empressBait)
            return
        }
        setupC(palTrap[currentIsland[1]],palBase,palCharm[currentIsland[1]],palBait)
    }
}
//Trap Control

function setupC(trap,base,charm,cheese) {
    if (setup[0] != trap) {
        hg.utils.TrapControl.setWeapon(trap).go()
    }
    if (setup[1] != base) {
        hg.utils.TrapControl.setBase(base).go()
    }
    if (setup[2] != charm) {
        hg.utils.TrapControl.setTrinket(charm).go()
    }
    if (setup[3] != cheese) {
        hg.utils.TrapControl.setBait(cheese).go()
    }
}
