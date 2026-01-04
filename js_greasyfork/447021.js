// ==UserScript==
// @name         FI Reroller (Jetstream)
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
// @downloadURL https://update.greasyfork.org/scripts/447021/FI%20Reroller%20%28Jetstream%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447021/FI%20Reroller%20%28Jetstream%29.meta.js
// ==/UserScript==

/*SETTINGS
Order power type preference best -> worst, follow the spelling properly or everything will break
"phscl", "tctcl", "hdr", "shdw", "arcn", "drcnc", "law", "frgttn" */

// LAI Settings
var LAITypes = ["tctcl","arcn","hdr","phscl","shdw","drcnc","frgttn","law"]
var LAIallowedTypes = [true,true,true,true,true,false,false,false]
//Change this setting to match above, true for power types you are willing to enter, false for otherwise
//HAI Settings
var HAITypes = ["tctcl","arcn","hdr","phscl","shdw","drcnc","frgttn","law"]
var HAIAllowedTypes = [true,true,true,true,true,false,false,false]


/*TRAP SETUP
For powertype-specific options, follow the order you specified in "powertypes" above
@per on discord if you need IDs for specific traps/charms */

//Trap Library, add only if the items you have are not listed here yet
var trap = {
    'CSOS': 3257,
    'A2': 3081,
    'T2': 3087,
    'PG': 2732,
    'L2': 3085,
    'DSC': 2842,
    'CTT': 2394,
    'CF2': 3421,
    'EPCT': 2621,
    'SST': 2844,
    'CMB': 1126,
}

var charm = {
    'RULPC': 2121,
    'RC': 1692,
    'ULC': 473,
    'UAC': 1822,
    'RULC': 1650,
    'RUPC': 1822,
    'Unstable': 1478
}

var base = {
    'PB': 2904,
    'SSDB': 3023,
    'AERB': 3080
}

var bait = {
    'CC': 3089,
    'ERCC': 3274,
    'ESB': 1967,
}

var dict = {
    "arcn": 0,
    "frgttn": 4,
    "hdr": 8,
    "shdw": 12,
    "drcnc": 12,
    "law": 13,
    "phscl": 14,
    "tctcl": 15,
}

var LAItrap = ['T2','A2','CSOS','PG','CTT','DSC','CF2','L2'] // 'T2' | 'A2' | 'CF2' | 'PG' | 'CMB' | 'L2' | 'DSC' | 'SST' | 'CSOS' | 'CTT' | 'EPCT'
var LAIcharm = ['RC','ULC','ULC','ULC','ULC','ULC','ULC','ULC'] // 'UAC' | 'RC' | 'RULC' | 'RULPC' | 'Unstable' | 'RUPC'
var LAIbase = ['PB','PB','PB','PB','PB','PB','PB','PB'] // 'PB' | 'SSDB' | 'AERB'
var LAIbait = ['CC','CC','CC','CC','CC','CC','CC','CC'] // 'CC' | 'ERCC' | 'ESB' |

var HAItrap = ['T2','A2','CSOS','PG','CTT','DSC','CF2','L2'] 
var HAIcharm = ['RULC','RULC','RULC','RULC','RULC','RULC','RULC','RULC'] 
var HAIbase = ['PB','PB','PB','PB','PB','PB','PB','PB'] 
var HAIbait = ['CC','CC','CC','CC','CC','CC','CC','CC'] 

var PARAtrap = ['T2','A2','CSOS','SST','CTT','DSC','CF2','L2'] 
var PARAcharm = ['RULPC','RULPC','RULPC','RULPC','RULPC','RULPC','RULPC','RULPC'] 
var PARAbase = ['SSDB','SSDB','SSDB','SSDB','SSDB','SSDB','SSDB','SSDB']
var PARAbait = ['ERCC','ERCC','ERCC','ERCC','ERCC','ERCC','ERCC','ERCC']

var WARDtrap = 'T2'
var WARDcharm = 'RULPC'
var WARDbase = 'PB'
var WARDbait = 'ESB'

//Launchpad, not required to hunt here, just in transition while script is rolling for new island
var LPtrap = 'CSOS'
var LPcharm = 'UAC'
var LPbase = 'PB'
var LPbait = 'CC'

//Set to true if you are not at high jetstream yet, or if you want to continue winding for all islands after high jetstream, null otherwise
var JSWind = true //true or null only, dont put false
/*END OF SETTINGS, DO NOT CHANGE ANYTHING BELOW THIS LINE
--------------------------------------------------------------------------------------------------------------*/



console.log('FI Reroller Enabled')
//Check if at FI and at launchpad
const interval = setInterval(() => {
    if (user.environment_name == "Floating Islands") {
        if (user.quests.QuestFloatingIslands.hunting_site_atts.island_type == "launch_pad_island") {
            setupChange(LPtrap,LPbase,LPcharm,LPbait)
            //Reroll Trigger
            if (document.getElementsByClassName("floatingIslandsAdventureBoardSkyMap-islandModContainer spinIn")[0] == undefined) {
                console.log("Opening Sky Map")
                document.getElementsByClassName("floatingIslandsHUD-skyMapButton")[0].click()
                setTimeout(() => {
                    chkbd()
                }, 2500)
            }
        }
        //Island Evaluation Trigger
        else {
            islandEval()
        }
    }

}, 10000);

function chkbd() {
    console.log("Checking Board")
    var islandAttr = [0,0,0,0,0,0,0,0]
    //LAI Island
    if (user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught != 4) {
        for (var i = 0; i < 8; i++) {
            islandAttr[i] = document.getElementsByClassName("floatingIslandsAdventureBoardSkyMap-islandMod mousehuntTooltipParent")[dict[LAITypes[i]]].firstChild.dataset.type
        }
        for (var j = 0; j < 8; j++) {
            if (islandAttr[j].includes("shrine") && LAIallowedTypes[j]) {
                console.log(LAITypes[j] + " island found")
                enterisland(LAITypes[j])
                return;
            }
        }
    }
    //HAI Island
    if (user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught == 4) {
        for (var k = 0; k < 8; k++) {
            islandAttr[k] = document.getElementsByClassName("floatingIslandsAdventureBoardSkyMap-islandMod mousehuntTooltipParent")[dict[HAITypes[k]]].firstChild.dataset.type
        }
        for (var l = 0; l < 8; l++) {
            if (islandAttr[l].includes("paragon") && HAIAllowedTypes[l]) {
                console.log(HAITypes[l] + " island found")
                enterisland(HAITypes[l])
                return;
            }
        }
    }
    rollbd()
}

function rollbd() {
    document.getElementsByClassName("floatingIslandsAdventureBoardSkyMap-rerollButton")[0].click()
    setTimeout(()=> {
        chkbd()
    }, 2500)
}

function enterisland(pwrtype) {
    //"tctcl", "hdr", "arcn", "phscl", "law", "drcnc", "shdw", "frgttn"
    var pDict = {
        "arcn": "floatingIslandsHUD-powerType arcane",
        "frgttn": "floatingIslandsHUD-powerType forgotten",
        "hdr": "floatingIslandsHUD-powerType hydro",
        "shdw": "floatingIslandsHUD-powerType shadow",
        "drcnc": "floatingIslandsHUD-powerType draconic",
        "law": "floatingIslandsHUD-powerType law",
        "phscl": "floatingIslandsHUD-powerType physical",
        "tctcl": "floatingIslandsHUD-powerType tactical"
    }
    setTimeout(()=> {
        document.getElementsByClassName(pDict[pwrtype])[0].click()
        console.log(pwrtype + " island selected")
        setTimeout(()=>{
            document.getElementsByClassName("floatingIslandsAdventureBoard-launchButton")[0].click()
            console.log(pwrtype + " island entered")
        },1000)
    },1000)
}

function islandEval() {
    //If user has caught warden/para
    if (user.quests.QuestFloatingIslands.hunting_site_atts.has_defeated_enemy == true) {
        document.getElementsByClassName("floatingIslandsHUD-retreatButton")[0].click()
        setTimeout(()=> {
            hg.views.HeadsUpDisplayFloatingIslandsView.retreat(true)
        }, 2000)
    }
    //LAI
    else if (document.getElementsByClassName("floatingIslandsHUD-islandTitle")[0].innerHTML.includes("Island") == true) {
        //Before warden
        var lpt = LAITypes.indexOf(user.quests.QuestFloatingIslands.hunting_site_atts.island_power_type)
        if (user.quests.QuestFloatingIslands.hunting_site_atts.enemy_encounter_hunts_remaining > 0) {
            toggleWind(JSWind)
            setupChange(LAItrap[lpt],LAIbase[lpt],LAIcharm[lpt],LAIbait[lpt])
        }
        //Encounter warden
        else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true) {
            toggleWind(null)
            setupChange(WARDtrap,WARDbase,WARDcharm,WARDbait)
        }
    }
    //HAI
    else if (document.getElementsByClassName("floatingIslandsHUD-islandTitle")[0].innerHTML.includes("Island") != true) {
        //Before warden
        var hpt = HAITypes.indexOf(user.quests.QuestFloatingIslands.hunting_site_atts.island_power_type)
        if (user.quests.QuestFloatingIslands.hunting_site_atts.enemy_encounter_hunts_remaining > 0) {
            toggleWind(JSWind)
            setupChange(HAItrap[hpt],HAIbase[hpt],HAIcharm[hpt],HAIbait[hpt])
        }
        //Encounter paragon
        else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter == true) {
            toggleWind(null)
            setupChange(PARAtrap[hpt],PARAbase[hpt],PARAcharm[hpt],PARAbait[hpt])
        }
    }
}
function setupChange(wep,bas,char,che) {
    if (parseInt(user.weapon_item_id) != trap[wep]) {
        console.log("Trap updated -> " + wep)
        hg.utils.TrapControl.setWeapon(trap[wep]).go()
    }
    setTimeout(() => {
        if (parseInt(user.base_item_id) != base[bas]) {
            console.log("Base updated -> " + bas)
            hg.utils.TrapControl.setBase(base[bas]).go()
        }
    }, 500)
    setTimeout(() => {
        if (parseInt(user.trinket_item_id) != charm[char]) {
            console.log("Charm updated -> " + char)
            hg.utils.TrapControl.setTrinket(charm[char]).go()
        }
    }, 1000)
    setTimeout(() => {
        if (user.bait_item_id != bait[che]) {
            console.log("Bait updated -> " + che)
            hg.utils.TrapControl.setBait(bait[che]).go()
        }
    }, 1500)
}

function toggleWind(state) {
    if (user.quests.QuestFloatingIslands.hunting_site_atts.is_fuel_enabled != state) {
        console.log("Wind state updated")
        hg.views.HeadsUpDisplayFloatingIslandsView.toggleFuel();
    }
}
