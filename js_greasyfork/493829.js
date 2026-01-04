// ==UserScript==
// @name          Logger
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   Create Logs
// @match         *://www.coingecko.com/en/coins/ethereum
// @grant         none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493829/Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/493829/Logger.meta.js
// ==/UserScript==

(function() {
    const ethPriceElement = document.querySelector('span[data-converter-target="price"]');
    if (ethPriceElement) {
        console.log(`Ethereum (ETH) Price: ${ethPriceElement.innerText}`);
    } else {
        console.error("Ethereum price not found.");
    }
})();