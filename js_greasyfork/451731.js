// ==UserScript==
// @name         Brift Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
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
// @downloadURL https://update.greasyfork.org/scripts/451731/Brift%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/451731/Brift%20Assistant.meta.js
// ==/UserScript==

const interval = setInterval(() => {
    if (user.environment_name == "Burroughs Rift") {
        mist()
    }
}, 15000);


function mist() {
    //Disable Mist
    if (user.quests.QuestRiftBurroughs.is_misting && user.quests.QuestRiftBurroughs.mist_released > 4) {
        hg.views.HeadsUpDisplayRiftBurroughsView.toggleMist()
    }
    else if (!user.quests.QuestRiftBurroughs.is_misting && user.quests.QuestRiftBurroughs.mist_released < 3) {
        hg.views.HeadsUpDisplayRiftBurroughsView.toggleMist()
    }
}