// ==UserScript==
// @name         Auto BWrift lul
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  botting lul
// @author       You
// @match        https://longtail-new.mousehuntgame.com/
// @grant		GM_info
// @run-at		document-end
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant		unsafeWindow
// @grant		GM_info
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/404396/Auto%20BWrift%20lul.user.js
// @updateURL https://update.greasyfork.org/scripts/404396/Auto%20BWrift%20lul.meta.js
// ==/UserScript==

// ng : GB
//hg.views.HeadsUpDisplayRiftBristleWoodsView.enterPortal
// gb - guard_chamber
//
//chamber status: acolyte_chamber entrance_chamber basic_chamber silence_chamber guard_chamber icy_chamber icebreak_chamber treasury_chamber //lucky_chamber no_debuff open closed obelisk_full
//

//
//chamber status: acolyte_chamber entrance_chamber basic_chamber silence_chamber potion_chamber magic_chamber timewarp_chamber guard_chamber icy_chamber ingress_chamber stalker_chamber icebreak_chamber treasury_chamber //lucky_chamber no_debuff open closed obelisk_full
//

var i_have_infinite_scrambles = true; // if this is on, you scramble until you get guard barrack :).
var be_annoying = true;
var ignore_debuffs = false;
var test_mode = false; // if true, no loop.
var i_am_poor = true;
var choose_portal = true;
var log_stuff = true;

function scramblePortals(){
	hg.views.HeadsUpDisplayRiftBristleWoodsView.scramblePortals()
}

function setupChange(){ // note: might miss some cases, do report.
    // change this according to what traps/base/charms u have.
    // enerchi charm - 2081, srvc - 1841, rvc - 2565 cherry - 1648
    // aeib - 2120, eib - 205.9, prestige - 2904
    let loot_charm = 1841;
    let other_charm = 1648;
    let loot_base = 2904;
    let other_base = 2904;
    let group1 = ["Lucky Tower", "Hidden Treasury"] // qq on , msc, eib, enerchi
    let group2 = ["Runic Laboratory"] // qq off, prestige, rvc
    let group3 = ["Pursuer Mousoleum", "Security Chamber", "Furnace Room", "Frozen Alcove", "Ingress Chamber"] // qq on, msc. prestige, rvc
    let group4 = ["Gearworks", "Ancient Lab"] // qq off, msc. prestige, rvc
    let pocket_watch = (document.getElementsByClassName('riftBristleWoodsHUD-portalEquipment lootBooster mousehuntTooltipParent')[0].getAttribute('class').indexOf('selected') > -1)
    let cur_location = user.quests.QuestRiftBristleWoods.chamber_name;
    if (group1.includes(cur_location)){ // qq on , msc, eib, enerchi
        if(log_stuff) console.log("arming setup for group1");
        if (pocket_watch == false) toggleQQ()
        if(user.bait_name != "Magical String Cheese") hg.utils.TrapControl.setBait('magical_string_cheese').go();
        if(user.trinket_item_id != other_charm) hg.utils.TrapControl.setTrinket(other_charm).go()
        if(user.base_item_id != other_base) hg.utils.TrapControl.setBase(other_base).go()
    }
    else if (group2.includes(cur_location)){ // qq off, prestige, rvc
        if(log_stuff) console.log("arming setup for group2");
        if (pocket_watch == true) toggleQQ()
        if(user.bait_name != "Runic String Cheese") hg.utils.TrapControl.setBait('runic_string_cheese').go();
        if(user.trinket_item_id != loot_charm) hg.utils.TrapControl.setTrinket(loot_charm).go()
        if(user.base_item_id != loot_base) hg.utils.TrapControl.setBase(loot_base).go()
    }
    else if (group3.includes(cur_location)){  // qq on, msc. prestige, rvc
        if(log_stuff) console.log("arming setup for group3");
        if (pocket_watch == false) toggleQQ()
        if(user.bait_name != "Magical String Cheese") hg.utils.TrapControl.setBait('magical_string_cheese').go();
        if(user.trinket_item_id != loot_charm) hg.utils.TrapControl.setTrinket(loot_charm).go()
        if(user.base_item_id != loot_base) hg.utils.TrapControl.setBase(loot_base).go()
    }
    else if (group4.includes(cur_location)){  // qq off, msc. prestige, rvc
        if(log_stuff) console.log("arming setup for group4");
        if (pocket_watch == true) toggleQQ()
        if (user.quests.QuestRiftBristleWoods.cleaver_status == "available") hg.utils.TrapControl.setBait('runic_string_cheese').go();
        else {if(user.bait_name != "Magical String Cheese") hg.utils.TrapControl.setBait('magical_string_cheese').go();}
        if(user.trinket_item_id != loot_charm) hg.utils.TrapControl.setTrinket(loot_charm).go()
        if(user.base_item_id != loot_base) hg.utils.TrapControl.setBase(loot_base).go()
    }
    else if (cur_location == "Guard Barracks") {
        if(log_stuff) console.log("arming setup for Guard Barracks");
        var alertLvl = parseInt(user.quests.QuestRiftBristleWoods.minigame.guard_chamber.status.split("_")[1]);
        if (pocket_watch == false) toggleQQ();
        if (alertLvl <= 1){
            if(user.bait_name != "Magical String Cheese") hg.utils.TrapControl.setBait('magical_string_cheese').go();
        }
        else {if(user.bait_name != "Runic String Cheese") hg.utils.TrapControl.setBait('runic_string_cheese').go();}
        if(user.trinket_item_id != loot_charm) hg.utils.TrapControl.setTrinket(loot_charm).go()
        if(user.base_item_id != loot_base) hg.utils.TrapControl.setBase(loot_base).go()
    }
    else if (cur_location == "Timewarp") {
        if(log_stuff) console.log("arming setup for Timewarp Chamber");
        if(user.bait_name != "Runic String Cheese") hg.utils.TrapControl.setBait('runic_string_cheese').go();
        if(user.trinket_item_id != other_charm && user.quests.QuestRiftBristleWoods.items.rift_hourglass_sand_stat_item.quantity <= 35) hg.utils.TrapControl.setTrinket(other_charm).go()
        else hg.utils.TrapControl.setTrinket(loot_charm).go()
        if(user.base_item_id != other_base) hg.utils.TrapControl.setBase(other_base).go()
    }
    else if (cur_location == "Acolyte") {
        if(log_stuff) console.log("arming setup for Acolyte Chamber");
        if(user.bait_name != "Runic String Cheese") hg.utils.TrapControl.setBait('runic_string_cheese').go();
        if(user.trinket_item_id != loot_charm) hg.utils.TrapControl.setTrinket(loot_charm).go()
        if(user.base_item_id != loot_base) hg.utils.TrapControl.setBase(loot_base).go()
        var strStatus = null;
        if(user.quests.QuestRiftBristleWoods.minigame.acolyte_chamber.obelisk_charge < 100){
			strStatus = 'ACOLYTE_CHARGING';
		}
		else if(user.quests.QuestRiftBristleWoods.minigame.acolyte_chamber.acolyte_sand > 0){
			strStatus = 'ACOLYTE_DRAINING';
		}
		else{
			strStatus = 'ACOLYTE_DRAINED';
		}
        console.log(strStatus);
        if (strStatus == 'ACOLYTE_CHARGING' && pocket_watch == false) {console.log(strStatus + pocket_watch);
            toggleQQ(); console.log(1);}
        if (strStatus == 'ACOLYTE_DRAINING' && pocket_watch == true) {toggleQQ();}
        if (strStatus == 'ACOLYTE_DRAINED' && pocket_watch == false) {toggleQQ(); console.log(2);}
    return;
    }
}

function toggleQQ() {
    if (user.quests.QuestRiftBristleWoods.chamber_status == "open" && user.quests.QuestRiftBristleWoods.chamber_name != "Acolyte") return;
    if(user.quests.QuestRiftBristleWoods.items.rift_quantum_quartz_stat_item.quantity == 0) {if(log_stuff) console.log("u have no qq, sadkek"); return;}
    else {hg.views.HeadsUpDisplayRiftBristleWoodsView.toggleLootBoost();
             console.log("toggleqq called");}
}


function choosePortal(){
    if (user.environment_name != "Bristle Woods Rift") return;
    setupChange();
    console.log('boom');
    var i_have_no_scrambles = (user.quests.QuestRiftBristleWoods.items.rift_scramble_portals_stat_item.quantity == 0) ? true: false;
    if (i_have_no_scrambles && be_annoying) {console.log("oh you poor thing, u have no scramblers")};
    if (user.quests.QuestRiftBristleWoods.chamber_status == "closed") {
        if(log_stuff)console.log("portals are currently closed, currently in: " + user.quests.QuestRiftBristleWoods.chamber_name );
        window.setTimeout(function () {
						choosePortal();
					}, 30000); return;
    }
	// ng : GB, guard_chamber
    let debuff_rooms = ["Pursuer Mousoleum", "Security Chamber", "Furnace Room"];
    let money_rooms = ["Lucky Tower", "Hidden Treasury"];
    let acolyte_room = ["Acolyte Chamber"]
    // portal_dict apparently useless :/

	var portal_dict = {"Pursuer Mousoleum": "stalker_chamber",
                       "Security Chamber": "silence_chamber",
                       "Furnace Room": "icebreak_chamber",
                       "Guard Barrack" : "guard_chamber",
                       "Frozen Alcove" : "icy_room",
                       "Ingress Chamber": "ingress_chamber",
                       "Timewarp Chamber": "timewarp_chamber",
                       "Gearworks": "basic_chamber",
                       "Runic Laboratory": "magic_chamber",
                       "Ancient Laboratory": "potion_chamber",
                       "Enter Tower": "entrance_chamber",
                      }
    var min_sand_gb_fa = 31
    var min_sand_gb_nofa = 36
    var sufficient_sand = false;
	var portals = user.quests.QuestRiftBristleWoods.portals;
	var foundPortal = false;
	var foundPortalType = null;
	var gb_done = (user.quests.QuestRiftBristleWoods.status_effects.ng == "default") ? false : true;
    var fa_done = (user.quests.QuestRiftBristleWoods.status_effects.ac == "default") ? false : true;
    // works
    var priority = [];
    var item = null;
	var foundPortalIndex = null;
    var x = null;
    var no_go = null;
    var classPortalContainer = document.getElementsByClassName('riftBristleWoodsHUD-portalContainer');
	// if we do not have gb buff, we have only this priority.
    if (i_have_infinite_scrambles && !gb_done) priority = ["Guard Barracks"];
    if (gb_done && !fa_done){
        priority = ["Frozen Alcove", "Timewarp Chamber"];
        sufficient_sand = (user.quests.QuestRiftBristleWoods.items.rift_hourglass_sand_stat_item.quantity >= min_sand_gb_nofa) ? true : false;
    }
    if (gb_done && fa_done){
        priority = ["Timewarp Chamber"];
        sufficient_sand = (user.quests.QuestRiftBristleWoods.items.rift_hourglass_sand_stat_item.quantity >= min_sand_gb_fa) ? true : false;
    }
    console.log(sufficient_sand);
    if (i_have_no_scrambles) priority = ["Guard Barracks", "Frozen Alcove", "Ingress Chamber", "Timewarp Chamber", "Gearworks", "Lucky Tower", "Hidden Treasury","Ancient Lab", "Runic Laboratory"];
    if (!ignore_debuffs) priority = debuff_rooms.concat(priority);
    if (i_am_poor) priority = money_rooms.concat(priority);
    if (sufficient_sand) priority = acolyte_room.concat(priority);
    if (user.quests.QuestRiftBristleWoods.items.runic_string_cheese.quantity == 0) {
        // choose_portal = false;
        // hg.utils.TrapControl.setBait('brie_string_cheese').go();
        no_go = ["Timewarp Chamber", "Frozen Alcove", "Guard Barracks", "Ingress Chamber"];
        for (x of no_go){
            removeA(priority, x);
        }
    }
    if (user.quests.QuestRiftBristleWoods.items.ancient_string_cheese.quantity == 0) {
        no_go = ["Runic Laboratory"];
        for (x of no_go){
            removeA(priority, x);
        }
    }
    if (sufficient_sand && i_have_infinite_scrambles) {
        no_go = ["Timewarp Chamber"];
        for (x of no_go){
            removeA(priority, x);
        }
    }
	for (item of priority){
		if (foundPortal) break;
		for (x in portals) {
			if (portals[x].name == item){
				foundPortal = true;
				foundPortalType = item;
				foundPortalIndex = x;
			}
            if (portals[x].name == "Enter Tower"){
                foundPortal = true;
                foundPortalType = "entrace_chamber";
                foundPortalIndex = x;
                }
		}
	}
	if (!foundPortal) {
        if (i_have_no_scrambles){
            console.log(priority)
            if(log_stuff) console.log("fake scrambling lmao called.");
        }
        else{
            hg.views.HeadsUpDisplayRiftBristleWoodsView.scramblePortals()
        }
    }
	if(log_stuff) console.log("Found Portal: " + foundPortal + " " + foundPortalType);

	if (foundPortal) {
        if(log_stuff) console.log("Priority: " + priority);
        console.log(portals);
        if(log_stuff) console.log("attempting to enter " + foundPortalType);
        if (choose_portal) fireEvent(classPortalContainer[0].children[foundPortalIndex], 'click');
        window.setTimeout(function () {
            if(choose_portal) fireEvent(document.getElementsByClassName('mousehuntActionButton small')[1], 'click');
        }, 1000);
    }
	if (test_mode) return;
    var strStatus = null;
    window.setTimeout(function () {
						choosePortal();
					}, 5000);
}

function fireEvent(element, event) {
    let debug = false;
    // thanks autobot.
    if (debug) {
        if (debug) if(log_stuff) console.log("RUN %cfireEvent() ON:", "color: #bada55");
        if(log_stuff) console.log(event);
        if(log_stuff) console.log(element);
    }

    var evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();

        try {
            return element.fireEvent('on' + event, evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    } else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable

        try {
            return !element.dispatchEvent(evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    }
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
choosePortal()