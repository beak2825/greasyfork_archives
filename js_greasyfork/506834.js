// ==UserScript==
// @name         Scalable Capital Spread Calculator
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Calculate and display the spread on de.scalable.capital
// @author       Your Name
// @match        https://de.scalable.capital/broker/security?isin=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506834/Scalable%20Capital%20Spread%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/506834/Scalable%20Capital%20Spread%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fetchPriceElements() {
        const wholeNumberElement = document.querySelector('[data-testid="formatted-number"]');
        const decimalElement = document.querySelector('[data-testid="decimal"]');
        return { wholeNumberElement, decimalElement };
    }

    function fetchBuySellButtons() {
        const buttons = document.querySelectorAll('button');
        let kaufenButton = null;
        let verkaufenButton = null;

        buttons.forEach(button => {
            if (button.textContent.includes('Kaufen')) {
                kaufenButton = button;
            } else if (button.textContent.includes('Verkaufen')) {
                verkaufenButton = button;
            }
        });

        return { kaufenButton, verkaufenButton };
    }

    function calculateSpread() {
        const { wholeNumberElement, decimalElement } = fetchPriceElements();

        if (!wholeNumberElement || !decimalElement) {
            console.error('Could not find the current stock price elements.');
            return;
        }

        const currentPrice = parseFloat(wholeNumberElement.textContent + '.' + decimalElement.textContent);

        const { kaufenButton, verkaufenButton } = fetchBuySellButtons();

        if (!kaufenButton || !verkaufenButton) {
            console.error('Could not find the buy/sell buttons.');
            return;
        }

        const kaufenValue = parseFloat(kaufenButton.querySelector('span:nth-child(2)').innerText.replace(',', '.'));
        const verkaufenValue = parseFloat(verkaufenButton.querySelector('span:nth-child(2)').innerText.replace(',', '.'));

        // Calculate the spread
        const sellSpread = ((verkaufenValue - currentPrice) / currentPrice) * 100;
        const buySpread = ((kaufenValue - currentPrice) / currentPrice) * 100;

        console.log(`Spread:  ${sellSpread.toFixed(2)}%  |  ${buySpread.toFixed(2)}%`);

        // Add the spread to the button elements
        addSpreadToButton(verkaufenButton, sellSpread);
        addSpreadToButton(kaufenButton, buySpread);
    }

    function addSpreadToButton(buttonElement, spread) {
        // Check if the spread span already exists
        let spreadSpan = buttonElement.querySelector('.spread-span');
        if (spreadSpan) {
            spreadSpan.textContent = `spread: ${spread.toFixed(2)}%`;
        } else {
            // Create a new span for the spread
            spreadSpan = document.createElement('span');
            spreadSpan.classList.add('spread-span');
            spreadSpan.style.display = 'block';
            spreadSpan.style.fontSize = '0.8em';
            spreadSpan.style.color = 'black';
            spreadSpan.textContent = `spread: ${spread.toFixed(2)}%`;

            // Insert the span after the button element
            buttonElement.appendChild(spreadSpan);
        }
    }

    // Set an interval to calculate the spread every second
    setInterval(calculateSpread, 1000);
})();