// ==UserScript==
// @name         Item Market Price Shower
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays item prices without needing to hover!
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/imarket.php*
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/507711/Item%20Market%20Price%20Shower.user.js
// @updateURL https://update.greasyfork.org/scripts/507711/Item%20Market%20Price%20Shower.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function formatItemPrices() {
        let items = document.querySelectorAll("li[data-item]");
        items.forEach((item) => {
            let itemName = item.querySelector('.searchname');
            let priceElement = item.querySelector('.minprice');
            if (priceElement && itemName) {
                let priceText = priceElement.childNodes[0].nodeValue.trim();
                if (!itemName.querySelector('.formatted-price')) {
                    itemName.innerHTML += ` - <strong class="formatted-price" style="color: green;">Price: ${priceText}</strong>`;
                }
                priceElement.remove();
            }
        });
    }
    const observer = new MutationObserver(() => {
        formatItemPrices();
    });
    const targetNode = document.body;
    observer.observe(targetNode, { childList: true, subtree: true });
    formatItemPrices();
})();
