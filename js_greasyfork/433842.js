// ==UserScript==
// @name         Coins availablity
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Shows product number left in stock on website https://coins.bank.gov.ua/
// @author       viacheslav.gudyrenko@gmail.com
// @match        https://coins.bank.gov.ua/product/*
// @supportURL   https://github.com/gudyrenko/tampermonkey_scripts
// @icon         https://www.google.com/s2/favicons?domain=gov.ua
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433842/Coins%20availablity.user.js
// @updateURL https://update.greasyfork.org/scripts/433842/Coins%20availablity.meta.js
// ==/UserScript==

(function() {
    var el = document.getElementsByName("add-to-cart")[0];
    var maxElement = document.getElementsByTagName("input")[4].getAttribute("max");
    el.innerHTML += " (" + maxElement + ")";
})();
