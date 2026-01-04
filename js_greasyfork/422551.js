// ==UserScript==
// @name         Auto Claim
// @namespace    http://tampermonkey.net/
// @version      0.1
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
// @downloadURL https://update.greasyfork.org/scripts/422551/Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/422551/Auto%20Claim.meta.js
// ==/UserScript==

(function() {
    const interval = setInterval(function() {
        check()
    }, 2000);
})();
function check() {
    if (user.quests.QuestSuperBrieFactory.factory_atts.current_progress == 2000){
        hg.views.HeadsUpDisplaySuperBrieFactoryView.claimReward()
    }
}
