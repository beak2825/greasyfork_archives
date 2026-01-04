// ==UserScript==
// @name         Retreat lul
// @namespace    http://tampermonkey.net/
// @version      1.5
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
// @downloadURL https://update.greasyfork.org/scripts/411571/Retreat%20lul.user.js
// @updateURL https://update.greasyfork.org/scripts/411571/Retreat%20lul.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    // your code here
    check();
}, false);
function check(){
    arr = user.quests.QuestFloatingIslands.hunting_site_atts.activated_island_mod_types
    const map = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    var pirate_count = map.get("sky_pirates")
    var key_count = map.get('loot_cache')
    if (user.environment_name != "Floating Islands") return;
    if (user.quests.QuestFloatingIslands.hunting_site_atts.is_high_tier_island == true) return;
    else if (user.quests.QuestFloatingIslands.hunting_site_atts.has_defeated_enemy == true &&
             user.quests.QuestFloatingIslands.hunting_site_atts.is_high_tier_island == null &&
             user.quests.QuestFloatingIslands.hunting_site_atts.island_progress == 40 && pirate_count < 2){
        hg.views.HeadsUpDisplayFloatingIslandsView.retreat();
    }
    // open board
    if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name == "Launch Pad"
        && user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught != 4) {
        window.setTimeout(function () {
            hg.views.FloatingIslandsAdventureBoardView.show()
        }, 5000);
        window.setTimeout(function () {
            location.reload()
        }, 10000);
    }
    window.setTimeout(function(){
        check();
    }, 20000);
}