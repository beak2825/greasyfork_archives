// ==UserScript==
// @name         Always show Torn market prices
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Instead of the buttons
// @author       Terekhov
// @match        https://www.torn.com/imarket.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481807/Always%20show%20Torn%20market%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/481807/Always%20show%20Torn%20market%20prices.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setPrices();
    $(window).on('hashchange', setPrices);

    function setPrices() {
        let intervalId = setInterval(showPrices, 650);
        let count = 0;

        function showPrices() {
            let searchNames = $('span.searchname');
            let minPrices = $('span.minprice');

            if (searchNames.length > 0 && minPrices.length > 0) {
                searchNames.each(function() { $(this).removeAttr('style').css('display', 'none'); })
                minPrices.each(function() { $(this).removeAttr('style').css('display', 'inline-block'); })
                clearInterval(intervalId);
            }
        }
   }
})();