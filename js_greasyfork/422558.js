// ==UserScript==
// @name         Market Watch chrome tab tickers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stop me from switching tabs all the time by showing the ticker values in the window title.
// @author       LlamaFarmer
// @match        https://www.marketwatch.com/investing/stock/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422558/Market%20Watch%20chrome%20tab%20tickers.user.js
// @updateURL https://update.greasyfork.org/scripts/422558/Market%20Watch%20chrome%20tab%20tickers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ticker = document.title.split(' ')[0]
    function showMeTheMoves() {
        var price = $('h3.intraday__price').text().replace(/( |\n)/g,'');
        document.title = ticker + ": " + price;
    }
    var ticktock = window.setInterval(showMeTheMoves, 5000);

    // Your code here...
})();