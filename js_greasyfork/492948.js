// ==UserScript==
// @name         Black Market Free Builds and Dealers Script
// @namespace    http://tampermonkey.net/
// @version      2024-04-19
// @description  Free builds and dealers for the game Blackmarket. Please note: This only works for the provided url. I couldn't be bothered to add more of them
// @author       AcidAmoeba89669
// @match        https://totominc.github.io/archive/blackmarket/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492948/Black%20Market%20Free%20Builds%20and%20Dealers%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/492948/Black%20Market%20Free%20Builds%20and%20Dealers%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the Dealer price to 0
    var originalGetDealerPrice = getDealerPrice;
    getDealerPrice = function(index, jsType) {
        return 0;
    };

    // Override the Dealer.buy function to not subtract money
    var originalDealerBuy = Dealer.buy;
    Dealer.buy = function(index, jsType) {
        if (jsType == 0) {
            weedDealersOwned[index]++;
        }
        if (jsType == 1) {
            methDealersOwned[index]++;
        }
        if (jsType == 2) {
            cocaineDealersOwned[index]++;
        }
        Dealer.check();
    };

    // Call the original init function to initialize the dealers
    Dealer.init();

})();

(function() {
    // Override the Build.buy function to make buildings free and increase output
    Build.buy = function(index, jsType) {
        // Set the cost to 0
        if (jsType == 0) {
            weedBuildsOwned[index]++;
        }
        if (jsType == 1) {
            methBuildsOwned[index]++;
        }
        if (jsType == 2) {
            cocaineBuildsOwned[index]++;
        }
        Build.check();
    };

    // Override the getBuildPrice function to return 0
    function getBuildPrice(index, jsType) {
        return 0;
    }

    // Override the getDrugProduction function to increase output
    function getDrugProduction(index, jsType) {
        var production = 1000000000000000000; // Increase this value to increase the output
        return production;
    }

    // Add a function to modify the existing builds
    function modifyBuilds() {
        for (var i = 0; i < weedBuilds.length; i++) {
            weedBuilds[i].price = 0;
            weedBuilds[i].reward = getDrugProduction(i, 0);
        }
        for (var i = 0; i < methBuilds.length; i++) {
            methBuilds[i].price = 0;
            methBuilds[i].reward = getDrugProduction(i, 1);
        }
        for (var i = 0; i < cocaineBuilds.length; i++) {
            cocaineBuilds[i].price = 0;
            cocaineBuilds[i].reward = getDrugProduction(i, 2);
        }
    }

    // Call the modifyBuilds function to apply the modifications
    modifyBuilds();
})();