// ==UserScript==
// @name         FUT20 Autobuyer
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  Guaranteed money making bot!
// @author       Amr
// @match        https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404274/FUT20%20Autobuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/404274/FUT20%20Autobuyer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.getMaxSearchBid = function(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
    };

    window.searchCount = 0;
    window.searchFailed = 0;
    window.purchaseCount = 0;

    window.initStatisics = function() {
        window.futStatistics = {
            soldItems: '-',
            unsoldItems: '-',
            activeTransfers: '-',
            availableItems: '-',
            coins: '-',
        };

        window.timers = {
            search: window.createTimeout(0, 0),
            coins: window.createTimeout(0, 0),
            transferList: window.createTimeout(0, 0),
        };
    };
    
})();