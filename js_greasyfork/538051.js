// ==UserScript==
// @name         LittleBiggy USD to GBP Converter (Targeted)
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  Convert $ prices inside span.price.USD to £ on LittleBiggy.net
// @match        https://littlebiggy.net/wall/items?shipsTo=GB
// @grant        GM_xmlhttpRequest
// @connect      api.exchangerate.host
// @downloadURL https://update.greasyfork.org/scripts/538051/LittleBiggy%20USD%20to%20GBP%20Converter%20%28Targeted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538051/LittleBiggy%20USD%20to%20GBP%20Converter%20%28Targeted%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let exchangeRate = 0.78; // fallback rate

    function fetchExchangeRate() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.exchangerate.host/latest?base=USD&symbols=GBP",
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.rates && data.rates.GBP) {
                            exchangeRate = data.rates.GBP;
                            console.log("[USD->GBP] Exchange rate fetched:", exchangeRate);
                        }
                    } catch (e) {
                        console.warn("Exchange rate fetch failed, using fallback:", e);
                    }
                    resolve();
                },
                onerror: () => {
                    console.warn("Exchange rate request failed, using fallback");
                    resolve();
                }
            });
        });
    }

    function convertPrices() {
        const priceElements = document.querySelectorAll('span.price.USD');

        priceElements.forEach(span => {
            // Avoid converting twice
            if (span.classList.contains('converted-to-GBP')) return;

            // Extract the numeric value from the span (excluding the nested $ symbol span)
            let rawText = span.textContent.trim(); // e.g. "$30.00"
            // Remove any whitespace, get numeric part (skip currency symbol)
            let numberMatch = rawText.match(/[\d,.]+/);
            if (!numberMatch) return;

            const usdAmount = parseFloat(numberMatch[0].replace(/,/g, ''));
            if (isNaN(usdAmount)) return;

            const gbpAmount = (usdAmount * exchangeRate).toFixed(2);

            // Replace content: £xx.xx (original $xx.xx)
            span.innerHTML = `£${gbpAmount} <span style="opacity:0.6; font-size:0.9em;">($${usdAmount.toFixed(2)})</span>`;

            // Mark as converted so we don't run twice
            span.classList.add('converted-to-GBP');

            // Optional: swap class from USD to GBP to keep semantics clean
            span.classList.remove('USD');
            span.classList.add('GBP');
        });
    }

    async function start() {
        await fetchExchangeRate();
        convertPrices();

        // If new prices load dynamically, run again every 1.5s
        setInterval(convertPrices, 1500);
    }

    start();

})();
