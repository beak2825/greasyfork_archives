// ==UserScript==
// @name         DH3 Market Max Button Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix the market max button in the buy dialog
// @author       Lasse Brustad
// @match        https://dh3.diamondhunt.co/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411606/DH3%20Market%20Max%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/411606/DH3%20Market%20Max%20Button%20Fix.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';

    window.clicksMaxMarketButton = () => {
        const max = parseInt(document.getElementById("dialogue-market-buy-hidden-amount").value),
              price = parseInt(document.getElementById("dialogue-market-buy-hidden-price").value);

        document.getElementById("dialogue-market-buy-input").value = Math.min(max, Math.floor(window.getItem('coins') / price));
        window.onKeyUpBuyPlayerMarket();
    }
})();