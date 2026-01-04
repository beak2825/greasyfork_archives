// ==UserScript==
// @name         Mousehunt Sky Warden Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Floting Islands Priority Calculator
// @grant        GM_addStyle
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/411598/Mousehunt%20Sky%20Warden%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/411598/Mousehunt%20Sky%20Warden%20Tracker.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const interval = setInterval(function() {
        check()
    }, 2000);
})();

function check(){
    if (user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude == true || user.environment_name != "Floating Islands") return;
    else $('div.floatingIslandsHUD-islandTitle').html(user.enviroment_atts.hunting_site_atts.island_name+ " ("+ user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught+")")
}