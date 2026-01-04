// ==UserScript==
// @name         btc-trade.com.ua helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://btc-trade.com.ua/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421433/btc-tradecomua%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421433/btc-tradecomua%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//    setTimeout(function() {
        for (let el of document.querySelectorAll('.refresh_button')) el.style.display = '';
        console.log('visibility=');
//    }, random(2000, 5000));

//    function random(min, max) {
//        return min + (max - min) * Math.random();
//    }
})();