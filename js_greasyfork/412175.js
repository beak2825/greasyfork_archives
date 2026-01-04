// ==UserScript==
// @name         Flight Rising - Jicky's Auction House Improvements (Seller)
// @author       Jicky
// @description  Adds auction house link for selected items, sets currency to gems, duration to 7 days. Original version by necramancy.
// @namespace    https://greasyfork.org/users/547396
// @source       https://greasyfork.org/en/scripts/409314-flight-rising-auction-house-improvements-seller/
// @match        https://*.flightrising.com/auction-house/sell/*
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/412175/Flight%20Rising%20-%20Jicky%27s%20Auction%20House%20Improvements%20%28Seller%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412175/Flight%20Rising%20-%20Jicky%27s%20Auction%20House%20Improvements%20%28Seller%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Edit this value to change treasure-to-gem conversions.
    var treasurePerGem = 1000.0;

    function setItemListingInfo(e) {
        var itemName = e.path[1].dataset.name;
        var itemId = e.path[1].dataset.itemid;
        var pageUrl = window.location.href;

        // // Adds button to search AH for item (unless it's a dragon)
        // if (!document.querySelector('.ah-sell-dragon-row')) {
        if ( pageUrl.toString().indexOf('dragons') <= -1 ){
            createButton(itemName);
        }

        // You can comment these lines out with '//' as needed
        setDuration(7);     // Sets duration to 7 days
        setCurrencyGems();  // Sets currency to gems
        setPriceTypeUnit(); // Sets price type to unit
        setStackSizeMax();  // Sets stack size to max (sells the whole stack)

        // Sets item unit cost to item's autosell value times 1.07 plus 1
        // (or whatever numbers you put after the comma).
        suggestMinCosts(itemId, 1.07, 1);
    }
    
    var inventoryPanel = document.getElementById('ah-sell-left');
    inventoryPanel.addEventListener('click', function (e) {
        setItemListingInfo(e);
    });

    // Creates AH search button for the item
    function createButton(itemName) {
        var searchButton = document.createElement('a');
        var searchUrl = window.location.href.replace('sell', 'buy') + '?itemname=' + itemName + '&treasure_min=0&perpage=50&sort=unit_cost_asc&nocollapse=1&collapse=1';

        searchButton.href = searchUrl;
        searchButton.target = '_blank';
        searchButton.innerText = 'Search AH →';

        // Style search button nicely
        searchButton.classList.add('redbutton');
        searchButton.classList.add('anybutton');
        searchButton.style.display = 'block';
        searchButton.style.margin = '10px auto';
        searchButton.style.padding = '5px 8px';
        searchButton.style.fontSize = '10px';
        searchButton.style.width = '100px';

        document.getElementById('ah-sell-itemname').appendChild(searchButton);
    }



    // DURATION / CURRENCY SETTING
    // --------------------

    // Sets listing duration to 7 days
    function setDuration(days=7) {
        document.getElementById('ah-sell-duration').value = days;
    }

    // Sets listing currency to gems
    function setCurrencyGems() {
        document.getElementById('ah-sell-currency-gems').checked = true;
    }
    // Sets listing currency to treasure
    function setCurrencyTreasure() {
        document.getElementById('ah-sell-currency-treasure').checked = true;
    }

    // Sets listing pricing type to unit
    function setPriceTypeUnit() {
        document.getElementById('ah-sell-pricetype-unit').checked = true;
        document.getElementById('ah-sell-treasure-unit').disabled = false;
        document.getElementById('ah-sell-gems-unit').disabled = false;
    }
    function setPriceTypeStack() {
        document.getElementById('ah-sell-pricetype-stack').checked = true;
        document.getElementById('ah-sell-treasure').disabled = false;
        document.getElementById('ah-sell-gems').disabled = false;
    }

    // Sets listing stack size to maximum (sells the whole stack)
    function setStackSizeMax() {
        var quantity = document.getElementById('ah-sell-quantity');
        quantity.options.selectedIndex = (quantity.options.length-1);
    }



    // COST SETTING
    // --------------------

    function setCosts(treasUnitCost=0.0, quantity=1) {
        setCostsTreasure(treasUnitCost, quantity);
        var gemsUnitCost = treasUnitCost / treasurePerGem;
        setCostsGems(gemsUnitCost, quantity);
    }
    function setCostsTreasure(unitCost=0.0, quantity=1) {
        document.getElementById('ah-sell-treasure-unit').value = Math.ceil(unitCost);
        document.getElementById('ah-sell-treasure').value = Math.ceil(unitCost * quantity);
    }
    function setCostsGems(unitCost=0.0, quantity=1) {
        document.getElementById('ah-sell-gems-unit').value = Math.ceil(unitCost);
        document.getElementById('ah-sell-gems').value = Math.ceil(unitCost * quantity);
    }

    function setUnitCostTreasure(val='0') {
        setPriceTypeUnit();
        var priceField = document.getElementById('ah-sell-treasure-unit');
        priceField.disabled = false;
        priceField.value = val;
    }
    function setUnitCostGems(val='0') {
        setPriceTypeUnit();
        var priceField = document.getElementById('ah-sell-gems-unit');
        priceField.disabled = false;
        priceField.value = val;
    }
    function setStackCostTreasure(val='0') {
        var priceField = document.getElementById('ah-sell-treasure');
        priceField.disabled = false;
        priceField.value = val;
    }
    function setStackCostGems(val='0') {
        var priceField = document.getElementById('ah-sell-gems');
        priceField.disabled = false;
        priceField.value = val;
    }



    // ITEM TOOLTIP PARSING
    // --------------------

    function parseItemSellVal(itemId) {
        var sellVal=document.querySelector(`div#tooltip-${itemId} div.sellval`)
        if (sellVal == null) {
            return 0;
        } else {
            return parseInt(sellVal.textContent.trim());
        }
    }
    function parseCurrentItemQuantity() {
        return parseInt(document.getElementById('ah-sell-quantity').value);
    }
    function suggestMinCosts(itemId, multiplier=1.07, increment=1) {
        var sellVal = parseItemSellVal(itemId);
        if (!isNaN(sellVal)) {
            var quantity = parseCurrentItemQuantity();
            sellVal = sellVal * multiplier;
            sellVal = sellVal + increment;
            setCosts(sellVal, quantity);
        }
    }

})();