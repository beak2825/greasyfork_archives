// ==UserScript==
// @name         Set Bopimo Coins to custom amount.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sets the displayed coin count on Bopimo to a custom amount.
// @author       Teemsploit
// @match        *://*.bopimo.com/*
// @grant        none
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/524089/Set%20Bopimo%20Coins%20to%20custom%20amount.user.js
// @updateURL https://update.greasyfork.org/scripts/524089/Set%20Bopimo%20Coins%20to%20custom%20amount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCoins() {
        const coinElements = document.querySelectorAll('.flex-align-middle.v-popper--has-tooltip');

        coinElements.forEach(element => {
            const coinIcon = element.querySelector('.b-coin');
            const coinText = element.querySelector('div:nth-child(2)');

            if (coinIcon && coinText) {
                coinText.textContent = '24.3k';
            }
        });
    }

    setCoins();

    const observer = new MutationObserver(setCoins);
    observer.observe(document.body, { childList: true, subtree: true });
})();
