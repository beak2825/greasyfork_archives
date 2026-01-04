// ==UserScript==
// @name         AutoCurrency Converter
// @namespace    http://tampermonkey.net/
// @version      2025-06-20
// @description  Real-time INR to USD price converter for Amazon.in using static rate (0.0125 USD per INR)
// @author       Prince Vaviya
// @match        https://www.amazon.in/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540178/AutoCurrency%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/540178/AutoCurrency%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetCurrency = 'USD';
    const currencySymbol = '$';
    const exchangeRate = 0.0125; // 1 INR = 0.0125 USD (static)

    function convertPrices() {
        const priceRegex = /₹\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
        const elements = document.querySelectorAll('span, div, a, p');

        elements.forEach(el => {
            if (el.children.length === 0 && priceRegex.test(el.textContent)) {
                try {
                    el.innerHTML = el.innerHTML.replace(priceRegex, (match, p1) => {
                        const inr = parseFloat(p1.replace(/,/g, ''));
                        const usd = (inr * exchangeRate).toFixed(2);
                        return `${match} <span style="color:green">(${currencySymbol}${usd})</span>`;
                    });
                } catch (err) {
                    console.error('Error converting price:', err);
                }
            }
        });
    }

    // Delay execution to wait for dynamic content
    window.addEventListener('load', () => {
        setTimeout(convertPrices, 1000);
    });

})();
