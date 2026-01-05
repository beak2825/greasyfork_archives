// ==UserScript==
// @name         Y3 Coin Harvester
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate get coin from Y3 precisely.
// @author       You
// @match        http://yanyeeyao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24253/Y3%20Coin%20Harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/24253/Y3%20Coin%20Harvester.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var getCoinAt = '';
    var harvestTimer = undefined;
    // Load auth first
    $.getJSON('/ajax/auth', function(data) {
        getCoinAt = moment(data.user_meta.next_get_coins_at, "YYYYMMDDHHmmss");
    });

    setTimeout(function() {
        var secondDiff = moment().diff(getCoinAt, 'seconds');
        var secondLeft = 0;

        // Set time to get coins.
        if (secondDiff >= 0) {
            secondLeft = 3600 - secondDiff % 3600;
        }
        else {
            secondLeft = Math.abs(secondDiff);
        }

        // Delay around 20 seconds for different time between client / server.
        secondLeft += 20;

        console.log('Waiting ' +  secondLeft + ' seconds to harvest.');

        harvestTimer = setTimeout(function() {
            $.getJSON('/ajax/auth/getCoins', function(data) {
                document.location.reload(); // Reload to avoid mess the game.
            });
        }, secondLeft * 1000);
    }, 3000);
})();