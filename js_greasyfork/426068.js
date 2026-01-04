// ==UserScript==
// @name         Flight Rising - Detect Underpriced Auctions
// @namespace    https://greasyfork.org/users/547396
// @version      0.3
// @description  Detects and highlights Auction House listings where the price is set at or below the autosell cost. If underpriced listings are found, automatically scrolls down to the first one.
// @author       Jicky
// @match        https://www1.flightrising.com/auction-house/buy/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426068/Flight%20Rising%20-%20Detect%20Underpriced%20Auctions.user.js
// @updateURL https://update.greasyfork.org/scripts/426068/Flight%20Rising%20-%20Detect%20Underpriced%20Auctions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User-editable values:
    var treasurePerGem = 1500.0;
    var priceOffset = 0;
    var flagColor = 'Gold';

    // FLAGGING
    // ------

    function detectUnderpriced() {
        var underpriced = [];
        var sellValues = parseItemSellValues();
        var listingDivs = document.querySelectorAll('div.ah-listing-row');
        for (const div of listingDivs) {
            let itmId = parseInt(div.getAttribute('data-listing-itemid'));
            let price = parseFloat(div.querySelector('div.ah-listing-sellprice div strong').textContent);
            if (div.querySelector('img.ah-listing-currency-icon').getAttribute('src').includes('gems')) {
                price = (price * treasurePerGem);
            }

            if ((price-priceOffset) <= sellValues[itmId]) {
                flagListing(div)
                underpriced.push(div);
            }
        }
        console.log(`Underpriced listings found: ${underpriced.length}`);
        if (underpriced.length > 0) { underpriced[0].scrollIntoView(); }
        return underpriced;
    }

    function flagListing(div) {
        div.style.backgroundColor = flagColor;
    }

    // PARSING
    // ------

    function parseItemSellValues() {
        var itemSellValues = [];
        var tooltips = document.querySelectorAll('div.itemtip');
        for (const tooltip of tooltips) {
            let id=parseInt(tooltip.getAttribute('id').split("-")[1]);
            let val=parseInt(tooltip.querySelector('div.sellval').textContent);
            itemSellValues[id] = val;
        }
        return itemSellValues;
    }

    detectUnderpriced();

})();