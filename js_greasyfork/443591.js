// ==UserScript==
// @name        [Liveuamap] Enchantments
// @namespace   HKR
// @match       *://*liveuamap.com/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Remove adverts from feed and more...
// @run-at      document-start
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443591/%5BLiveuamap%5D%20Enchantments.user.js
// @updateURL https://update.greasyfork.org/scripts/443591/%5BLiveuamap%5D%20Enchantments.meta.js
// ==/UserScript==

(() => {
    GM_addStyle(`
        /* hide adverts from feed */
        .passby {
            display: none !important; 
        }
        /* hide app advert from bottom of the feed */
        .phones {
            display: none !important;
        }
    `);
})();