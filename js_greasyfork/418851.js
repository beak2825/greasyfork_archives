// ==UserScript==
// @name         Auto Golem
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418851/Auto%20Golem.user.js
// @updateURL https://update.greasyfork.org/scripts/418851/Auto%20Golem.meta.js
// ==/UserScript==

(function() {
    const interval = setInterval(function() {
        check()
    }, 5000);
})();

function check() {
    console.log("golem number" + 0+ "can claim" + user.quests.QuestWinterHunt2020.golems[0].can_claim);
    console.log("golem number" + 0+ "can_build" + user.quests.QuestWinterHunt2020.golems[0].can_build);
    if (user.quests.QuestWinterHunt2020.golems[0].can_claim){
        claimGolem(0,null);
        if(am_i_rich_enough_to_build_golem() == true){
            setTimeout(function() { sendGolem(0,null);; }, 1000);
        }
    }
    if(user.quests.QuestWinterHunt2020.golems[0].can_build && am_i_rich_enough_to_build_golem()){
        setTimeout(function() { sendGolem(0,null);; }, 1000);
    }
    console.log("golem number" + 1+ "can claim" + user.quests.QuestWinterHunt2020.golems[1].can_claim);
    console.log("golem number" + 1+ "can_build" + user.quests.QuestWinterHunt2020.golems[1].can_build);
    if (user.quests.QuestWinterHunt2020.golems[1].can_claim){
        claimGolem(1,null);
        if(am_i_rich_enough_to_build_golem() == true){
            setTimeout(function() { sendGolem(1,null);; }, 1000);
        }
    }
    if(user.quests.QuestWinterHunt2020.golems[1].can_build && am_i_rich_enough_to_build_golem()){
        setTimeout(function() { sendGolem(1,null);; }, 1000);
    }
    console.log("golem number" + 2+ "can claim" + user.quests.QuestWinterHunt2020.golems[2].can_claim);
    console.log("golem number" + 2+ "can_build" + user.quests.QuestWinterHunt2020.golems[2].can_build);
    if (user.quests.QuestWinterHunt2020.golems[2].can_claim){
        claimGolem(2,null);
        if(am_i_rich_enough_to_build_golem() == true){
            setTimeout(function() { sendGolem(2,null);; }, 1000);
        }
    }
    if(user.quests.QuestWinterHunt2020.golems[2].can_build && am_i_rich_enough_to_build_golem()){
        setTimeout(function() { sendGolem(2,null);; }, 1000);
    }
}


function am_i_rich_enough_to_build_golem(){
    if (user.quests.QuestWinterHunt2020.items.golem_part_head_stat_item.quantity>= 1 && user.quests.QuestWinterHunt2020.items.golem_part_limb_stat_item.quantity>=4 && user.quests.QuestWinterHunt2020.items.golem_part_torso_stat_item.quantity >= 1) return true;
    return false;
}


function claimGolem(slot,callback) {
    $.post(
        "https://www.mousehuntgame.com/managers/ajax/events/winter_hunt.php",
        {
            sn: 'Hitgrab',
            hg_is_ajax: 1,
            action: 'claim_reward',
            slot: slot,
            last_read_journal_entry_id: lastReadJournalEntryId,
            uh: user.unique_hash,
        },
        null,
        "json"
    ).done(callback);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



function sendGolem(slot,callback) {
    if (am_i_rich_enough_to_build_golem() == false) return;
    $.post(
        "https://www.mousehuntgame.com/managers/ajax/events/winter_hunt.php",
        {
            sn: 'Hitgrab',
            hg_is_ajax: 1,
            action: 'build_golem',
            slot: slot,
            has_hat : 0,
            environment: 'rift_whisker_woods',
            head: getRandomInt(12),
            arms: getRandomInt(11),
            legs: getRandomInt(3),
            torso: getRandomInt(11),
            last_read_journal_entry_id: lastReadJournalEntryId,
            uh: user.unique_hash,
        },
        null,
        "json"
    ).done(null);
    window.setTimeout(function () {
        location.reload()
    }, 2000);
}