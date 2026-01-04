// ==UserScript==
// @name         Flight Rising - Auction House - Insert Cancel Buttons For Own Listings
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/auction-house/buy/*
// @grant        none
// @version      1.0
// @author       Jicky
// @description  Allows users to cancel their auctions from Search/Buy without needing to pick through "Current Listings".
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/439437/Flight%20Rising%20-%20Auction%20House%20-%20Insert%20Cancel%20Buttons%20For%20Own%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/439437/Flight%20Rising%20-%20Auction%20House%20-%20Insert%20Cancel%20Buttons%20For%20Own%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertAuctionCancelButtons() {
        $('.ah-listing-row').each(function() {
            let buyButton = $(this).find('.ah-listing-buy-button');
            if (buyButton.attr('style').includes('hidden')) {
                $(buyButton).replaceWith(`<div class="ah-listing-cancel-button" data-listing-id="${$(this).attr('data-listing-id')}"></div>`);
            }
        });
    }

    insertAuctionCancelButtons();

})();