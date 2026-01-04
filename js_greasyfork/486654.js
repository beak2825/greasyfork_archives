// ==UserScript==
// @name         Round Amazon prices
// @namespace    http://tampermonkey.net/
// @version      2024-02-05
// @description  Round Amazon prices on product and search pages.
// @author       golvok
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486654/Round%20Amazon%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/486654/Round%20Amazon%20prices.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // console.log("Amazon price rounder - run");

    var my_round = function(x) { return Math.round(x * 100 / 20) / 100 * 20; };

    var do_list_page = function() {
        var elems = document.getElementsByClassName("a-price-fraction");
        for (var i=0;i<elems.length; i++) {
            var centsElem = elems[i];
            var wholeElem = centsElem.parentNode.getElementsByClassName("a-price-whole")[0].firstChild;
            var price = Number(wholeElem.textContent + '.' + centsElem.innerText);
            var new_price = my_round(price).toFixed(2);
            wholeElem.textContent = new_price.slice(0,-3);
            centsElem.textContent = new_price.slice(-2);
            // centsElem.style["font-size"] = "28px"
            // centsElem.style.top = 0
        }
    };

    var do_product_page = function() {
        var elems = document.getElementsByClassName("apexPriceToPay")
        for (var i=0; i < elems.length; i++) {
            var elem = elems[i].children[1];
            var price = Number(elem.innerText.slice(1));
            elem.innerText = "$" + my_round(price).toFixed(2);
        }
    };

    do_product_page(); // only need to run this once
    do_list_page();
    setInterval(function() { // in case of lazy loading, and when changing result pages
        do_list_page();
    }, 2000);
})();