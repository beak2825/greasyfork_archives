// ==UserScript==
// @name         Chain called hit alert
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Helps you from unknownly claiming a faction hit
// @author       Sil3ntOne [2008029]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411906/Chain%20called%20hit%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/411906/Chain%20called%20hit%20alert.meta.js
// ==/UserScript==

(function(d) {
    'use strict';

    var currentCount = parseInt(d.querySelector('#barChain [class*="bar-value"]').innerText.split('/')[0]);
    console.log(currentCount);

    var limits = [250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

    for(var limit of limits) {
        var diff = limit - currentCount;
        console.log(diff);
        if(diff <= 10 && diff > 0) {
            if(localStorage.factionChainHitCallMsgAck != limit) {
                var resp = confirm("The " + limit + "th hit might have been called by someone.\nPlease check your faction chat to confirm.\n\nPlease confirm that you have read & acknowleged this message.");
                if(resp) {
                    localStorage.factionChainHitCallMsgAck = limit;
                }
            }
        }
    }

    if(typeof localStorage.factionChainHitCallMsgAck != "undefined") {
        if(currentCount >= localStorage.factionChainHitCallMsgAck) {
            // Reset the ack after the limit has been crossed.
            delete localStorage.factionChainHitCallMsgAck;
        }
    }
})(document);