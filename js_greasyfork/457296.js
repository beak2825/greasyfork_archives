// ==UserScript==
// @name         Steam Inventory Helper - Addon
// @namespace    http://tampermonkey.net/
// @version      0.1.0.1
// @description  Auto remove overpriced items
// @author       0x01x02x03
// @match        https://steamcommunity.com/market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457296/Steam%20Inventory%20Helper%20-%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/457296/Steam%20Inventory%20Helper%20-%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function areOverpricedItems() {
        console.log("Checking if there are overpriced items");
        let areItemForSell = document.body.querySelector('#my_market_selllistings_number').textContent;
        let overpriceds = document.body.querySelector('#tabContentsMyActiveMarketListingsTable > div:nth-child(4) > div > div:nth-child(3) > a.item_market_action_button.item_market_action_button_green > span.item_market_action_button_contents');
        let removeOverpriceds = document.body.querySelector('#tabContentsMyActiveMarketListingsTable > div:nth-child(4) > div > div:nth-child(3) > a.btnControl > span');
        if(areItemForSell > 0){
            if (overpriceds != null) {
                overpriceds.click();
                removeOverpriceds.click();
            }
            setTimeout(areOverpricedItems, 5000);
        }
    }

    setTimeout(areOverpricedItems, 5000);

})();