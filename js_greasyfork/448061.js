// ==UserScript==
// @name         VRift Assistant
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  :okayge:
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
// @downloadURL https://update.greasyfork.org/scripts/448061/VRift%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/448061/VRift%20Assistant.meta.js
// ==/UserScript==
 
console.log('VRift Assistant Enabled')

const cfNormalFloor = false
const cfUUFloor = true

//Trap Setups ['Trap','Base','Charm','Bait']
//Shade Setup
var shadeSetup = ['CCDT','SSDB','RULPC','GSC']
//TE Setup
var teSetup = ['CCDT','SSDB','EMB','GSC']
//Non-UU Setup
var nonuuSetup = ['CCDT','PB','RUPC','GSC']
//UU Setup
var uuSetup = ['CCDT','PB','RUPC','GSC']
//Outside Setup
var outsideSetup = ['CCDT','AEIB','SCHI','BSC']

var trap = {
    'CCDT': 3025
}
 
var charm = {
    'UC': 1075,
    'RULPC': 2121,
    'RUPC': 1651,
    'TSC': 2348,
    'RULC': 1650,
    'EMB': 2631,
    'FULPC': 2524,
    'UPC': 545,
    'FUPC': 1289,
    'ULPC': 1920,
    'SCHI': 2398
}
 
var base = {
    'PB': 2904,
    'SSDB': 3023,
    'AEIB': 2120
}
 
var bait = {
    'GSC': 2906,
    'BSC': 1424
}

const interval = setInterval(function() {
    if (user.environment_name == 'Valour Rift') {
        vrift()
    }
}, 15000);

function vrift() {
    var CFstate = user.quests.QuestRiftValour.is_fuel_enabled
    //In tower
    if (user.quests.QuestRiftValour.state == 'tower') {
        //If non-UU
        if (user.quests.QuestRiftValour.is_eclipse_mode == null) {
            //At Shade
            if (isInteger(user.quests.QuestRiftValour.floor/8)) {
                cftoggle(true)
                setupChange(shadeSetup)
            }
            //Normal floors
            else {
                cftoggle(cfNormalFloor)
                setupChange(nonuuSetup)
            }
        }
        //UU
        else {
            //At TE
            if (isInteger(user.quests.QuestRiftValour.floor/8)) {
                cftoggle(true)
                setupChange(teSetup)
            }
            //UU Floors
            else {
                cftoggle(cfUUFloor)
                setupChange(uuSetup)
            }
        }
    }
    //Outside of tower
    else {
        setupChange(outsideSetup)
    }
}

function setupChange(trapSetup) {
    var a = trapSetup[0]
    var b = trapSetup[1]
    var c = trapSetup[2]
    var d = trapSetup[3]
    if (parseInt(user.weapon_item_id) != trap[a]) {
        console.log("Trap updated -> " + a)
        hg.utils.TrapControl.setWeapon(trap[a]).go()
    }
    setTimeout(() => {
        if (parseInt(user.base_item_id) != base[b]) {
            console.log("Base updated -> " + b)
            hg.utils.TrapControl.setBase(base[b]).go()
        }
    }, 500)
    setTimeout(() => {
        if (parseInt(user.trinket_item_id) != charm[c]) {
            console.log("Charm updated -> " + c)
            hg.utils.TrapControl.setTrinket(charm[c]).go()
        }
    }, 1000)
    setTimeout(() => {
        if (user.bait_item_id != bait[d]) {
            console.log("Bait updated -> " + d)
            hg.utils.TrapControl.setBait(bait[d]).go()
        }
    }, 1500)
}

function cftoggle(state) {
    if (user.quests.QuestRiftValour.is_fuel_enabled != state) {
        console.log("CF toggled to " + state)
        hg.views.HeadsUpDisplayRiftValourView.toggleFuel()
    }
}