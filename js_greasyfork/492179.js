// ==UserScript==
// @name         test task
// @namespace    http://tampermonkey.net/
// @version      2024-04-10 v2
// @description  console ethereum price
// @author       h.alekseeey
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492179/test%20task.user.js
// @updateURL https://update.greasyfork.org/scripts/492179/test%20task.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    console.log(`Hello on page ${currentUrl}`)

    if (currentUrl === 'https://www.coingecko.com/en/coins/ethereum') {
        const element = document.querySelector('span[data-converter-target="price"][data-coin-id="279"]');
        if (element) {
            console.log(`Ethereum price: ${element.innerText}`)
        }
    }
})();