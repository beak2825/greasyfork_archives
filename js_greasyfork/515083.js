// ==UserScript==
// @name         TORN: Quick Market
// @namespace    dekleinekobini.private.quick-market
// @version      1.0.0
// @author       DeKleineKobini [2114440]
// @description  Quick buy market items.
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515083/TORN%3A%20Quick%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/515083/TORN%3A%20Quick%20Market.meta.js
// ==/UserScript==

(() => {
    'use strict';

    GM_addStyle(`
        [class*='confirmButtons___'] {
            flex-direction: row-reverse;
            flex-grow: 1;
        }

        [class*='confirmButton___']:first-child {
            flex-grow: 1;
        }
    `);
})();