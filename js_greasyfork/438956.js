// ==UserScript==
// @name         WWR Assistant
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  WWR Asst
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
// @downloadURL https://update.greasyfork.org/scripts/438956/WWR%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/438956/WWR%20Assistant.meta.js
// ==/UserScript==
 
console.log('WWR Assistant Enabled')
const interval = setInterval(function() {
    if (user.environment_name == 'Whisker Woods Rift') {
        getStats()
        micro()
    }
  }, 5000);
 
var clearing = ""
var tree = ""
var lagoon = ""
var lst = [0,0,0]
 
function getStats() {
    clearing = user.quests.QuestRiftWhiskerWoods.zones.clearing.level
    tree = user.quests.QuestRiftWhiskerWoods.zones.tree.level
    lagoon = user.quests.QuestRiftWhiskerWoods.zones.lagoon.level
    lst = [clearing,tree,lagoon]
    console.log(lst)
}
 
function micro() {
    //Disarm bait if taunting less than 5
    if (user.trinket_item_id == 1647 && user.trinket_quantity <= 5) {
        hg.utils.TrapControl.disarmBait().go()
        return
    }
    //All factions 50
    if (clearing == 50 && tree == 50 && lagoon == 50) {
        setupChange(3025,2904,1647,1646)
    }
    //One or more faction at 50
    else if (clearing == 50 || tree == 50 || lagoon == 50) {
        setupChange(3239,2904,1647,1426)
    }
    //Building invidual habitats
    else if (clearing < 50) {
        setupChange(3239,2904,1648,1426)
    }
    else if (tree < 50) {
        setupChange(3239,2904,1649,1426)
    }
    else if (lagoon < 50) {
        setupChange(3239,2904,1652,1426)
    }
}
 
function setupChange(trap,base,charm,cheese) {
    if (parseInt(user.weapon_item_id) != trap) {
        hg.utils.TrapControl.setWeapon(trap).go()
    }
    if (parseInt(user.base_item_id) != base) {
        hg.utils.TrapControl.setBase(base).go()
    }
    if (parseInt(user.trinket_item_id) != charm) {
        hg.utils.TrapControl.setTrinket(charm).go()
    }
    if (user.bait_item_id != cheese) {
        hg.utils.TrapControl.setBait(cheese).go()
    }
}