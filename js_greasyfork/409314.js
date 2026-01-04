// ==UserScript==
// @name         Flight Rising - Auction House Improvements (Seller)
// @author       https://greasyfork.org/en/users/547396
// @description  Adds search link to selected items on auction house. Includes settings to default duration, currency, price by (stack, unit), and what to sort by on auction house
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/auction-house/sell/realm/*
// @grant        none
// @version      0.13
// @downloadURL https://update.greasyfork.org/scripts/409314/Flight%20Rising%20-%20Auction%20House%20Improvements%20%28Seller%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409314/Flight%20Rising%20-%20Auction%20House%20Improvements%20%28Seller%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change the settings based on personal preference
    var ahiSettings = {
        duration: 7, // Default Duration ( 7, 3, or 1 ) days
        priceStack: true, // Default Price Stack (true) or Unit (false)
        priceGems: true, // Default Currency Gems (true) or Treasure (false)
        sortUnit: false // Default Auction House Sorted by Unit (true) or Price (false)
    };

    let clickPanel = document.getElementById('ah-sell-left'),
        sellItem = document.getElementById('ah-sell-itemname'),
        items = document.querySelectorAll('ah-sell-item'),
        sURL = window.location.href,
        bURL = sURL.replace('sell', 'buy');

    function init() {
        createButton( sellItem.innerText );
        selectGemsDays();
    }

    clickPanel.addEventListener('click', function ( e ) {
        const itemContainer = e.target.closest('.ah-sell-item');
        if (!itemContainer) return;

        const itemName = itemContainer.dataset.name;

        createButton( itemName );
        selectGemsDays();
    });

    function createButton( item ) {
        let ahButton = document.createElement('a'),
            searchSettings = '&perpage=50';

        if (ahiSettings.sortUnit) {
           searchSettings += '&sort=unit_cost_asc';
        }

        ahButton.href = bURL + '?itemname=' + item + searchSettings;
        ahButton.target = '_blank';
        ahButton.innerText = 'Auction House →';

        // Styles
        ahButton.classList.add('redbutton');
        ahButton.classList.add('anybutton');
        ahButton.style.display = 'block';
        ahButton.style.margin = '10px auto';
        ahButton.style.padding = '5px 8px';
        ahButton.style.fontSize = '10px';
        ahButton.style.width = '100px';

        if ( sURL.toString().indexOf('dragons') <= -1 ){
            sellItem.appendChild(ahButton);
        }
    }

    // Automatically select seller options based on ahiSettings (above)
    function selectGemsDays() {
        let gems = document.getElementById('ah-sell-currency-gems'),
            days = document.getElementById('ah-sell-duration'),
            priceBy = document.getElementById('ah-sell-pricetype-unit');

        if (ahiSettings.priceGems) {
            gems.checked = true;
        }

        if (ahiSettings.duration == 3) {
            days.options.selectedIndex = 1;
        }

        if (ahiSettings.duration == 7) {
            days.options.selectedIndex = 2;
        }

        if (!ahiSettings.priceStack) {
            priceBy.checked = true;
        }
    }

    init();

})();