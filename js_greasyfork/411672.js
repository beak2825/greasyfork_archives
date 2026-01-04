// ==UserScript==
// @name         Auto Fart 
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  botting lul
// @author       ardens
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
// @downloadURL https://update.greasyfork.org/scripts/411672/Auto%20Fart.user.js
// @updateURL https://update.greasyfork.org/scripts/411672/Auto%20Fart.meta.js
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
    // fire on in island
    else if ((!user.quests.QuestFloatingIslands.hunting_site_atts.is_fuel_enabled && user.quests.QuestFloatingIslands.hunting_site_atts.island_name != "Launch Pad"
             && user.enviroment_atts.hunting_site_atts.island_progress < 40)
        && ((user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude && (pirate_count+key_count <=2))
            ||(user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude == null && pirate_count < 2) ||
            (user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude == null && pirate_count == null))){
        hg.views.HeadsUpDisplayFloatingIslandsView.toggleFuel()
    }
    // fire off after trove
    else if (user.quests.QuestFloatingIslands.hunting_site_atts.island_name == "Launch Pad"
             || user.enviroment_atts.hunting_site_atts.island_progress >= 40
             || (user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude && (pirate_count+key_count ==3))
             || (user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude == null && pirate_count == 2)) {
        if (user.quests.QuestFloatingIslands.hunting_site_atts.is_fuel_enabled) hg.views.HeadsUpDisplayFloatingIslandsView.toggleFuel()
    }
    window.setTimeout(function(){
        check();
    }, 7500);
}
