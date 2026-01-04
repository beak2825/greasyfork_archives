// ==UserScript==
// @name         Retry Last Roulette Bet
// @namespace    http://tampermonkey.net/
// @version      1.1.01
// @description  Retry the most recent roulette bet without waiting for animations on Torn.
// @author       Kabamgamer
// @match        https://www.torn.com/page.php?sid=roulette
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542538/Retry%20Last%20Roulette%20Bet.user.js
// @updateURL https://update.greasyfork.org/scripts/542538/Retry%20Last%20Roulette%20Bet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleTag = document.createElement('style');
    styleTag.textContent = `
#kabamRetry {
    background: linear-gradient(45deg, #4caf50, #388e3c);
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    margin-bottom: 10px;
}
#kabamRetry[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}
    `;
    document.head.appendChild(styleTag);

    // Utility to format currency (shocking that Torn still does this manually)
    function toNumberFormat(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function displayInfo(msg, color) {
        const infoSpot = document.getElementById('infoSpot');
        const infoText = document.getElementById('infoSpotText');

        if (!infoSpot || !infoText) return;

        infoText.textContent = msg;
        infoSpot.classList.remove('red', 'green');

        if (color) {
            infoSpot.classList.add(color);
        }
    }

    function onSuccessResponse(response) {
        const title = response.won ? `You won \$${response.won}!` : 'You lost...';
        const message = ' The ball landed on ' + response.number;
        displayInfo(title + message, response.won ? 'green' : 'red');

        document.getElementById('st_money_val').textContent = '$' + toNumberFormat(response.totalAmount);
        document.getElementById('st_tokens_val').textContent = response.tokens;
    }

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        setTimeout(() => waitForElement(selector, callback), 300);
    }

    let lastBetOptions = null;
    const originalGetAction = window.getAction;

    // Patch getAction immediately so it works on first click
    window.getAction = function(options) {
        if (options?.data?.sid === 'rouletteData' && options?.data?.step === 'processStakes') {
            lastBetOptions = jQuery.extend({}, options);
            lastBetOptions.success = onSuccessResponse;
            const retryBtn = document.getElementById('kabamRetry');
            if (retryBtn) retryBtn.removeAttribute('disabled');
        }
        return originalGetAction(...arguments);
    };

    // Create the button element ahead of time
    const retryButton = document.createElement('button');
    retryButton.id = 'kabamRetry';
    retryButton.textContent = 'Retry Last Bet';
    retryButton.disabled = true;

    retryButton.addEventListener('click', () => {
        if (lastBetOptions) {
            originalGetAction(lastBetOptions);
        }
    });

    // Wait for rouletteContainer to exist, then inject the button
    waitForElement('#rouletteContainer', (container) => {
        container.parentNode.insertBefore(retryButton, container);
    });
})();