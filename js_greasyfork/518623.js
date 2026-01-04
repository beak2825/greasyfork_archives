// ==UserScript==
// @name         Torn Market Seller Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks specific sellers in the Torn item market
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518623/Torn%20Market%20Seller%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/518623/Torn%20Market%20Seller%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    //Insert the userID of all users you want to block into the brackets below, comma separated. IE: [1234, 4321, 1423]
    const blockedIDs = [];

    function blockRow(row) {
        row.style.cssText = `
            opacity: 0.4;
            pointer-events: none;
            background-color: #444 !important;
            filter: grayscale(100%);
        `;
        row.querySelectorAll('button, input').forEach(el => el.disabled = true);
    }

    function checkRows() {
        document.querySelectorAll('.sellerRow___AI0m6').forEach(row => {
            const profileLink = row.querySelector('a[href*="profiles.php?XID="]');
            if (profileLink && blockedIDs.includes(parseInt(profileLink.href.match(/XID=(\d+)/)[1]))) {
                blockRow(row);
            }
        });
    }

    new MutationObserver(checkRows).observe(document, {
        childList: true,
        subtree: true
    });

    checkRows();
})();