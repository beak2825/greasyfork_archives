// ==UserScript==
// @name         Flight Rising - Add Commas To Page-Header Currency Counters
// @namespace    https://greasyfork.org/users/547396
// @version      0.3
// @description  Add commas to page-header currency counters to make them more readable. (9999999 => 9,999,999)
// @author       Jicky
// @match        https://*.flightrising.com
// @match        https://*.flightrising.com/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428475/Flight%20Rising%20-%20Add%20Commas%20To%20Page-Header%20Currency%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/428475/Flight%20Rising%20-%20Add%20Commas%20To%20Page-Header%20Currency%20Counters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function reformatIntegerNode(node) {
        if (!node) { return false; }
        var str = node.textContent.trim();
        if (str.includes(',')) { return false; } // skip if already done
        var num = parseInt(str);
        if (isNaN(num) || num<1000 ) { return false; }
        node.innerHTML = Number(num).toLocaleString();
        return num;
    }
    function reformatTreasure() {
        // NOTE: Uses '#loginbar-{CURRENCY}' on most pages, but
        //       '#user_{CURRENCY}' when viewing other users' lairs.
        var selectors = ['span#loginbar-treasure', 'span#user_treasure'];
        var node = document.querySelector(selectors);
        return reformatIntegerNode(node);
    }
    function reformatGems() {
        var selectors = ['span#loginbar-gems', 'span#user_gems'];
        var node = document.querySelector(selectors);
        return reformatIntegerNode(node);
    }

    reformatTreasure();
    reformatGems();

})();