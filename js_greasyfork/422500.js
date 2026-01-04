// ==UserScript==
// @name         American Bestbuy Autocart
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto add to cart
// @author       AxizY
// @match        https://www.bestbuy.com/site/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422500/American%20Bestbuy%20Autocart.user.js
// @updateURL https://update.greasyfork.org/scripts/422500/American%20Bestbuy%20Autocart.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementsByClassName("fulfillment-add-to-cart-button")[0].innerText == "Add to Cart")
    {
        document.getElementsByClassName("fulfillment-add-to-cart-button")[0].children[0].children[0].children[0].click()
        } else {
            location.reload();
        }
})();