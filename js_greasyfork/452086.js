// ==UserScript==
// @name         SC Assistant
// @namespace    http://tampermonkey.net/
// @version      1.3
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
// @downloadURL https://update.greasyfork.org/scripts/452086/SC%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/452086/SC%20Assistant.meta.js
// ==/UserScript==

var trap = {
    'CSOS': 3257, //Chrome Shark
    'SOS': 1515, //School of Sharks
    'QFT': 2843, //Queso Fount
    'SBT': 3087, //Slumbering Boulder
    'SST': 3088, //Sleeping Stone
    'GGT': 2845, //Gouging Geyserite
    'CSW': 1833, //Chrome Sphynx Wrath
    'CTOT': 3421, //Chrome Thought Obliterator
    'TOT': 3083, //Thought Obliterator
    'TMT': 3084, //Thought Manipulator
    'ILT': 1918, //Infinite Labyrinth
}
 
var charm = {
    'RULPC': 2121, //Rift Ultimate Lucky Power
    'RUPC': 1651, //Rift Ultimate Power
    'RULC': 1650, //Rift Ultimate Luck
    'FULPC': 2524, //Festive Ultimate Lucky Power
    'UPC': 545, //Ultimate Power
    'FUPC': 1289, //Festive Ultimate Power
    'ULPC': 1920, //Ultimate Lucky Power
    'RC': 1692, //Rainbow
    'UAC': 1822, //Ultimate Ancient
    'BK': 1815, //Baitkeep
    'GILDED': 2174, //Gilded
    'ANC': 928, //Ancient
    'UACT': 1823, //Ultimate Attraction
    'UPAC': 2992, //Ultimate Party
    'GAC': 1836, //Golden Anchor
    'WJC': 1517, //Water Jet
    'SWJC': 1838, //Smart Water Jet
    'TTC': 1844, //Treasure Trawling
    'SAC': 1839, //Spiked Anchor
    'EAC': 423, //Empowered Anchor
}
 
var base = {
    'PB': 2904, //Prestige Base
    'SSDB': 3023, //Signature Series Denture Base
}
 
var bait = {
    'WC': 120, //White Cheddar (lmao finally got use)
    'GOUDA': 98, //狗大
    'SB': 114, //shabi
    'ESB': 1967, //empowered shabi
    'GRUB': 3460, //PP grubben 
    'CLAM': 3457, //PP clamembert 
    'SCLAM': 3462, //PP stormy clamembert
    '1D': 3459, //1st draft
    '2D': 3461, //2nd draft
    'FD': 3458, //Final draft
    'MSC': 1426, //Magical String
}

var upcomingZones = []
var zoneLength = 0
var distToSC = 1000
var boostMode = true

const interval = setInterval(() => {
    if (user.environment_name == "Sunken City") {
        getVar()
        setTimeout(() => {
            micro()
        }, 3000);
    }
}, 15000);

function getVar() {
    zoneLength = user.quests.QuestSunkenCity.zones.length
    upcomingZones = user.quests.QuestSunkenCity.zones
    for (let i = 0; i < zoneLength; i++) {
        if (i> 1) {
            if (upcomingZones[i].name == 'Deep Oxygen Stream' || upcomingZones[i].name == 'Lair of the Ancients') {
                if (upcomingZones[i].left < 380) {
                    boostMode = false
                }
                break
            }
        }
    }
}

function micro() {
    if (user.quests.QuestSunkenCity.zone_name == 'Deep Oxygen Stream') {
        disarmBait()
    }
    else if (user.quests.QuestSunkenCity.zone_name == 'Lair of the Ancients') {
        disarmBait()
    }
    else if (boostMode) { //SETUP TO USE WHEN JETTING, WJC = WATER JET | SWJC = SMART WATER JET
        setupChange(['CSOS','PB','WJC','SB'])
    }
    else if (!boostMode) { //SETUP TO USE WHEN DESIRED ZONES ARE TOO CLOSE TO JET
        if (user.quests.QuestSunkenCity.zones[2].left < 98) { //DISTANCE TO DESIRED ZONE <30M ARM EMPOWERED ANCHOR
            setupChange(['CSOS','PB','EAC','SB'])
        }
        else {
            setupChange(['CSOS','PB','GILDED','SB']) //DISTANCE TO DESIRED ZONE BETWEEN 30 AND 500M, ARM GILDED CHARM
        }
    }
}

//MISC Functions
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

function disarm() {
    if (user.bait_item_id != 0) {
        hg.utils.TrapControl.disarmBait().go()
    }
}