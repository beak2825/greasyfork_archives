// ==UserScript==
// @name         Simple Geyser Control
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Changes setup once eruption is complete
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
// @downloadURL https://update.greasyfork.org/scripts/416155/Simple%20Geyser%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/416155/Simple%20Geyser%20Control.meta.js
// ==/UserScript==

console.log('Simple Geyser Control Enabled');

(function() {
    const interval = setInterval(function() {
        //Checks if player is in QG
        if (user.environment_name != "Queso Geyser") {
            return;
        }
        else {
            //Insert functions to be executed here
            setupChange();
        }
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

function setupChange() {
    if (user.quests.QuestQuesoGeyser.state == 'claim' || user.quests.QuestQuesoGeyser.state == 'collecting') {
        if (user.bait_item_id != 2625 || user.trinket_item_id != 1290) {
            hg.utils.TrapControl.setbait(2625).go();
            hg.utils.TrapControl.setTrinket(1290).go();
        }
        else {
            return;
        }
    }
}