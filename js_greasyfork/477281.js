// ==UserScript==
// @name         Neopets Auction House - Comma-Formatted Numbers
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @description  Updates the Neopets auction pages to format the bid and asking numbers with commas
// @author       Morde
// @match        https://www.neopets.com/auctions.phtml*
// @match        https://www.neopets.com/genie.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477281/Neopets%20Auction%20House%20-%20Comma-Formatted%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/477281/Neopets%20Auction%20House%20-%20Comma-Formatted%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rows = $('table:has(> tbody > tr > td[bgcolor="#dddd77"]) tr')

    $(rows).find('td b').each((i, ele) => {
        ele.innerText = ele.innerText.split(' ').map(x => {
            const num = Number(x);
            return Number.isFinite(num) ? num.toLocaleString() : x;
        }).join(' ');
    });
})();