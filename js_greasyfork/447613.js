// ==UserScript==
// @name         LG Complex Assistant
// @namespace    http://tampermonkey.net/
// @version      1.2
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
// @downloadURL https://update.greasyfork.org/scripts/447613/LG%20Complex%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/447613/LG%20Complex%20Assistant.meta.js
// ==/UserScript==
 
console.log('LG Complex Assistant Enabled')

var trap = {
    'CSOS': 3257,
    'A2': 3081,
    'CTT': 2394
}
 
var charm = {
    'RC': 1692,
    'RDS': 1132,
    'YDS': 1135,
    'SS': 1134,
    'GS': 1015,
    'BRA': 1011,
    'SHI': 1019,
    'CLA': 1012
}
 
var base = {
    'PB': 2904,
    'LB': 2094
}
 
var bait = {
    'LUN': 1010,
    'GRA': 1009,
    'DUS': 1008
}

const interval = setInterval(function() {
    if (user.environment_name == 'Sand Crypts') {
        sc()
    }
    else if (user.environment_name == 'Cursed City') {
        cc()
    }
    else if (user.environment_name == 'Twisted Garden') {
        tg()
    }
  }, 15000);
 
function sc() {
    if (user.quests.QuestSandDunes.minigame.salt_charms_used < 8) {
        setupChange('CTT','PB','SS','GRA')
    }
    else {
        setupChange('CTT','LB','GS','GRA')
    }
}

function cc() {
    //Cursed
    if (user.quests.QuestLostCity.minigame.is_cursed == true) {
        //Fear
        if (user.quests.QuestLostCity.minigame.curses[0].active == true) {
            setupChange('A2','PB','BRA','GRA')
        }
        //Darkness
        else if (user.quests.QuestLostCity.minigame.curses[1].active == true) {
            setupChange('A2','PB','SHI','GRA')
        }
        //Mis
        else if(user.quests.QuestLostCity.minigame.curses[2].active == true) {
            setupChange('A2','PB','CLA','GRA')
        }
    }
    //Not Cursed
    else {
        setupChange('A2','LB','RC','GRA')
    }

}

function tg() {
    //Poured
    if (user.quests.QuestLivingGarden.minigame.vials_state == 'dumped') {
        setupChange('CSOS','PB','RC','LUN')
    }
    //Not poured
    else {
        //Fill Red
        if (user.quests.QuestLivingGarden.minigame.red_drops < 10) {
            setupChange('CSOS','PB','RDS','DUS')
        }
        //Fill Yellow
        else if (user.quests.QuestLivingGarden.minigame.yellow_drops < 10) {
            setupChange('CSOS','PB','YDS','DUS')
        }
        //Pour
        else {
            app.views.HeadsUpDisplayView.hud.livingGardenConfirmPour()
            setTimeout(()=> {
                document.getElementsByClassName("confirm button")[0].click()
            },1000)
            setTimeout(()=> {
                tg()
            },2000)
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