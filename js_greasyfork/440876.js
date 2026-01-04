// ==UserScript==
// @name         SB Factory Assistant
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
// @downloadURL https://update.greasyfork.org/scripts/440876/SB%20Factory%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/440876/SB%20Factory%20Assistant.meta.js
// ==/UserScript==
 
console.log('SB Fact Auto Claim')
const interval = setInterval(function() {
    if (user.environment_name == 'SUPER|brie+ Factory') {
        micro()
    }
  }, 15000);

function micro() {
    if (user.quests.QuestSuperBrieFactory.factory_atts.can_claim == true) {
        hg.views.HeadsUpDisplaySuperBrieFactoryView.claimReward()
    }
}