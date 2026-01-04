// ==UserScript==
// @name         Update stock prices
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get price list
// @author       Jox [1714547]
// @match        https://www.torn.com/stockexchange.php*
// @grant        GM_xmlhttpRequest
// @connect      nukefamily.org
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413567/Update%20stock%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/413567/Update%20stock%20prices.meta.js
// ==/UserScript==

(function() {
    'use strict';

        GM_xmlhttpRequest ( {
            method:     'GET',
            url:        'https://www.nukefamily.org/dev/stockPriceList.json',
            onload:     function (responseDetails) {
                let prices = JSON.parse(responseDetails.responseText);
                localStorage.stockPriceList = JSON.stringify(prices);
            }
        });
})();