// ==UserScript==
// @name         Percentage calculator for emploi-public
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Correctly calculates and displays percentage and remaining count overlay (2 lines)
// @author       You
// @match        https://backoffice.emploi-public.ma/gestionnaire/concours/candidature-concours/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478397/Percentage%20calculator%20for%20emploi-public.user.js
// @updateURL https://update.greasyfork.org/scripts/478397/Percentage%20calculator%20for%20emploi-public.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getText(selector) {
        const el = document.querySelector(selector);
        if (!el) return null;
        return el.innerText.trim();
    }

    // Extract only digits from string, fallback to null if none found
    function extractNumber(text) {
        if (!text) return null;
        const match = text.match(/\d+/g);
        if (!match) return null;
        // sum all numbers if multiple found, or parse first number only
        return match.reduce((acc, val) => acc + Number(val), 0);
    }

    // Selectors for total, approved, denied
    const selectors = {
        total: '#wrapper > div.content-page > div.content > div > div > div > div > div.card-body > div:nth-child(4) > div:nth-child(1) > div > div.card-body > p',
        approved: '#wrapper > div.content-page > div.content > div > div > div > div > div.card-body > div:nth-child(4) > div:nth-child(2) > div > div > p',
        denied: '#wrapper > div.content-page > div.content > div > div > div > div > div.card-body > div:nth-child(4) > div:nth-child(3) > div > div > p',
    };

    function extractValues() {
        const totalText = getText(selectors.total);
        const approvedText = getText(selectors.approved);
        const deniedText = getText(selectors.denied);

        const total = extractNumber(totalText);
        const approved = extractNumber(approvedText);
        const denied = extractNumber(deniedText);

        console.log('Raw extracted:', { totalText, approvedText, deniedText });
        console.log('Parsed numbers:', { total, approved, denied });

        return { total, approved, denied };
    }

    function calculatePercentage(total, approved, denied) {
        if (!total || total === 0) return null;
        const processed = approved + denied;
        return ((processed / total) * 100).toFixed(2);
    }

    function calculateRemaining(total, approved, denied) {
        if (!total) return null;
        const processed = approved + denied;
        const remaining = total - processed;
        return remaining >= 0 ? remaining : 0;
    }

    function showOverlay(percentage, remaining) {
        // Remove old overlay if exists
        const old = document.getElementById('myUniqueOverlay999');
        if (old) old.remove();

        const container = document.createElement('div');
        container.id = 'myUniqueOverlay999';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '250px';
        container.style.backgroundColor = 'rgba(0,0,0,0.75)';
        container.style.color = 'white';
        container.style.padding = '12px 20px';
        container.style.borderRadius = '10px';
        container.style.fontSize = '18px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.zIndex = 9999;
        container.style.boxShadow = '0 0 8px rgba(0,0,0,0.5)';
        container.style.pointerEvents = 'none';
        container.style.textAlign = 'center';
        container.style.lineHeight = '1.4';

        const percentDiv = document.createElement('div');
        percentDiv.textContent = `${percentage}% :Done `;

        const remainingDiv = document.createElement('div');
        remainingDiv.textContent = `${remaining} :Remaining`;

        container.appendChild(percentDiv);
        container.appendChild(remainingDiv);

        document.body.appendChild(container);
    }

    const interval = setInterval(() => {
        const { total, approved, denied } = extractValues();

        if (total !== null && approved !== null && denied !== null) {
            const percent = calculatePercentage(total, approved, denied);
            const remaining = calculateRemaining(total, approved, denied);

            if (percent !== null && remaining !== null) {
                console.log(`Overlay: ${percent}% done — ${remaining} remaining`);
                showOverlay(percent, remaining);
                clearInterval(interval);
            }
        } else {
            console.log('Waiting for data...');
        }
    }, 500);

})();
