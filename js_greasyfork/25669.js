// ==UserScript==
// @name         Steam Community Auto-Confirming
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://steamcommunity.com/tradeoffer/*
// @exclude      https://steamcommunity.com/tradeoffer/new/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25669/Steam%20Community%20Auto-Confirming.user.js
// @updateURL https://update.greasyfork.org/scripts/25669/Steam%20Community%20Auto-Confirming.meta.js
// ==/UserScript==

if (window.location.href.indexOf("https://steamcommunity.com/tradeoffer/null") > -1) {
    window.close();
} else if (document.title == "Steam Community :: Error") {
    setTimeout( function() {
        location.reload(true);
    }, 2000);
}

function TradeConfirm() {
   setTimeout( function() {
       ToggleReady(true);
       document.getElementsByClassName('btn_green_white_innerfade')[0].click();
       CTradeOfferStateManager.ConfirmTradeOffer();
       setTimeout( function() {
           window.close();
       }, 3000);
   }, 4500);
}

TradeConfirm();