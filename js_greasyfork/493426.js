// ==UserScript==
// @name         My Test Task: Ethereum ETH Price Rate Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts Ethereum ETH price rate and displays it in the console
// @author       Boris Becker
// @match        https://www.coingecko.com/en/coins/ethereum
// @match        https://greasyfork.org/en
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/493426/My%20Test%20Task%3A%20Ethereum%20ETH%20Price%20Rate%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/493426/My%20Test%20Task%3A%20Ethereum%20ETH%20Price%20Rate%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract and display ETH price rate
    function extractETHPriceRate(html) {
        // Find the element containing the ETH price rate
        var ethPriceElement = html.querySelector('div.tw-font-bold > span');

        // Check if the element is found
        if (ethPriceElement) {
            var ethPriceRate = ethPriceElement.textContent.trim();
            console.log('Ethereum ETH Price Rate: ', ethPriceRate);
        } else {
            console.error('Failed to find Ethereum ETH Price Rate element');
        }
    }

    function interactWithWebsite() {

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.coingecko.com/en/coins/ethereum/",
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                var res = response.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(res, 'text/html');
                extractETHPriceRate(doc);
            }
        });

    }

    // Wait for the page to load completely before extracting the ETH price rate
    window.addEventListener('load', interactWithWebsite);
})();
