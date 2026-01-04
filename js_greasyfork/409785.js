// ==UserScript==
// @name         Hypixel Reward Skip
// @namespace    https://google.com/
// @version      1.0
// @description  Automatically skips the Hypixel Daily Reward video for ranked members.
// @author       SurprisedKetchup
// @match        https://rewards.hypixel.net/claim-reward/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409785/Hypixel%20Reward%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/409785/Hypixel%20Reward%20Skip.meta.js
// ==/UserScript==

window.setInterval(function(){
    $(".index__skipButton___3ihHt").click();
}, 100);