// ==UserScript==
// @name         Torn Bazaar Max
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically input max value to buy items in Torn Bazaars
// @author       Ballig
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471984/Torn%20Bazaar%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/471984/Torn%20Bazaar%20Max.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        let root = document.getElementById('bazaarRoot');
        if (root)
        {
            const config = { attributes: true, childList: true, subtree: true };
            const mutationCallback = function (records, observer) {
                for (const record of records) {
                    for (const addedNode of record.addedNodes) {
                        if (addedNode.textContent === "fill max")
                        {
                            let cost = 0;
                            let amount = 0;
                            let money = 0;

                            let parent = addedNode.parentNode.parentNode.parentNode;

                            let info_money = document.getElementById('user-money');
                            let info_price = parent.querySelector('span[class^="price"]');
                            let info_amount = parent.querySelector('span[class^="amount"][class*="infoLine"]');

                            if (info_money)
                            {
                                money = info_money.dataset.money;
                            }
                            if (info_price)
                            {
                                cost = parseInt(info_price.textContent.replace(/[,$]/g, ""));
                            }
                            if (info_amount)
                            {
                                let amtTest = parseInt(info_amount.textContent.replace(" in stock)", "").replace("(", ""));
                                if (!isNaN(amtTest))
                                {
                                    amount = amtTest;
                                }
                            }
                            if (cost > 0 && amount > 0)
                            {
                                let input = parent.querySelector('input[class^="numberInput"]');

                                if (input)
                                {
                                    if (Math.floor(money / cost) < amount) amount = Math.floor(money / cost);
                                    input.value = amount;
                                }
                            }
                        }
                    }
                }
            };
            const observer = new MutationObserver(mutationCallback);
            observer.observe(root, config);
        }
    }, false);
})();