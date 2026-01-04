// ==UserScript==
// @name         Auto FRIFT B9-B10
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Auto FR
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
// @downloadURL https://update.greasyfork.org/scripts/433776/Auto%20FRIFT%20B9-B10.user.js
// @updateURL https://update.greasyfork.org/scripts/433776/Auto%20FRIFT%20B9-B10.meta.js
// ==/UserScript==

console.log('Auto FRift Enabled')
const interval = setInterval(function() {
    if (user.environment_name == "Furoma Rift") {
        getStats()
        enterLeavePagoda()
    }
  }, 30000);

var droidEnergy = ""
var droidCharge = ""

function getStats() {
    droidEnergy = user.quests.QuestRiftFuroma.droid.remaining_energy
    droidCharge = user.quests.QuestRiftFuroma.droid.charge_level
}

function enterLeavePagoda() {
    //When droid is outside of pagoda
    if (droidEnergy == "---") {
        app.views.HeadsUpDisplayView.hud.riftFuromaEnterPagoda("charge_level_ten");
        console.log('Entered the pagoda at Batt 10');
    }
    //Batt 10
    else if (droidCharge == 'charge_level_ten') {
        setupChange(3025,2904,1819,2100)
    }
    //Batt 9
    //else if (droidCharge == 'charge_level_nine') {
    //    setupChange(3025,2904,2399,2101)
    //}
    //Leave pagoda
    else if (droidCharge == 'charge_level_nine') {
        app.views.HeadsUpDisplayView.hud.riftFuromaLeavePagoda();
        console.log('Left the pagoda at Batt 9');
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