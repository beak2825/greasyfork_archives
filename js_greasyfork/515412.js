// ==UserScript==
// @name         BTC से INR में परिवर्तक
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  वास्तविक समय में BTC बैलेंस को INR में परिवर्तित करता है
// @author       आपका नाम
// @match        https://freebitco.in/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515412/BTC%20%E0%A4%B8%E0%A5%87%20INR%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%95.user.js
// @updateURL https://update.greasyfork.org/scripts/515412/BTC%20%E0%A4%B8%E0%A5%87%20INR%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INR में BTC की मूल्यांकन दर प्राप्त करने के लिए फ़ंक्शन
    async function fetchBtcToInr() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr');
            const data = await response.json();
            return data.bitcoin.inr;
        } catch (error) {
            console.error('BTC मूल्य प्राप्त करने में त्रुटि:', error);
            return null;
        }
    }

    // INR में बैलेंस अपडेट करने के लिए फ़ंक्शन
    async function updateBalanceInInr() {
        const balanceElement = document.getElementById('balance');
        if (!balanceElement) return;

        const btcBalance = parseFloat(balanceElement.innerText);
        const btcToInr = await fetchBtcToInr();

        if (btcToInr !== null) {
            const inrBalance = (btcBalance * btcToInr).toFixed(2);
            let inrDisplay = document.getElementById('inrBalance');

            // यदि INR बैलेंस प्रदर्शित करने के लिए तत्व मौजूद नहीं है, तो उसे बनाएँ
            if (!inrDisplay) {
                inrDisplay = document.createElement('span');
                inrDisplay.id = 'inrBalance';
                inrDisplay.style.marginLeft = '10px';
                balanceElement.parentNode.insertBefore(inrDisplay, balanceElement.nextSibling);
            }

            inrDisplay.innerText = ` (₹ ${inrBalance})`;
        }
    }

    // हर 30 सेकंड में बैलेंस अपडेट करें
    setInterval(updateBalanceInInr, 30000);

    // पृष्ठ लोड होने पर तुरंत फ़ंक्शन कॉल करें
    updateBalanceInInr();
})();
