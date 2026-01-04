// ==UserScript==
// @name         Pump.Fun Draggable Sell Bar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a draggable sell bar to pump.fun that auto-sells when the meme coin price reaches the bar's level
// @author       Grok (xAI)
// @match        https://www.pump.fun/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536920/PumpFun%20Draggable%20Sell%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/536920/PumpFun%20Draggable%20Sell%20Bar.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 xAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Configuration: Update these selectors based on pump.fun's DOM
    const priceSelector = '.price'; // Selector for the current price element
    const sellButtonSelector = '.sell-button'; // Selector for the sell button
    const chartSelector = '.chart-container'; // Selector for the chart container
    const maxPrice = 100; // Maximum price shown on the chart (adjust as needed)
    const minPrice = 0; // Minimum price shown on the chart (adjust as needed)

    // Create the draggable sell bar
    const sellBar = document.createElement('div');
    sellBar.style.position = 'absolute';
    sellBar.style.background = 'red';
    sellBar.style.color = 'white';
    sellBar.style.padding = '5px';
    sellBar.style.cursor = 'move';
    sellBar.style.zIndex = '1000';
    sellBar.style.width = '200px';
    sellBar.style.height = '20px';
    sellBar.style.userSelect = 'none';
    sellBar.style.display = 'flex';
    sellBar.style.alignItems = 'center';
    sellBar.style.justifyContent = 'center';
    sellBar.textContent = 'Sell: $0.00';
    document.body.appendChild(sellBar);

    // Draggable functionality
    let isDragging = false;
    let currentY = 0;

    sellBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentY = e.clientY - sellBar.offsetTop;
        e.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const chart = document.querySelector(chartSelector);
            if (!chart) {
                console.error('Chart container not found. Check chartSelector.');
                return;
            }
            const chartRect = chart.getBoundingClientRect();
            let newTop = e.clientY - currentY;
            // Constrain bar to chart area
            newTop = Math.max(chartRect.top, Math.min(chartRect.bottom - sellBar.offsetHeight, newTop));
            sellBar.style.top = newTop + 'px';
            // Calculate target price based on position (linear mapping)
            const chartHeight = chartRect.height;
            const relativeY = (chartRect.bottom - newTop) / chartHeight;
            const targetPrice = minPrice + (maxPrice - minPrice) * relativeY;
            sellBar.dataset.targetPrice = targetPrice.toFixed(2);
            sellBar.textContent = `Sell: $${targetPrice.toFixed(2)}`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Function to get current price from the page
    function getCurrentPrice() {
        const priceElement = document.querySelector(priceSelector);
        if (priceElement) {
            const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceText);
            return isNaN(price) ? 0 : price;
        }
        console.warn('Price element not found. Check priceSelector.');
        return 0;
    }

    // Function to trigger sell action
    function triggerSell() {
        const sellButton = document.querySelector(sellButtonSelector);
        if (sellButton) {
            sellButton.click();
            console.log('Sell button clicked at price:', getCurrentPrice());
        } else {
            console.error('Sell button not found. Check sellButtonSelector.');
        }
    }

    // Monitor price and trigger sell if target is reached
    function monitorPrice() {
        const currentPrice = getCurrentPrice();
        const targetPrice = parseFloat(sellBar.dataset.targetPrice) || 0;
        if (currentPrice >= targetPrice && targetPrice > 0) {
            triggerSell();
        }
    }

    // Initialize bar position
    const chart = document.querySelector(chartSelector);
    if (chart) {
        const chartRect = chart.getBoundingClientRect();
        sellBar.style.left = chartRect.left + 'px';
        sellBar.style.top = (chartRect.top + chartRect.height / 2) + 'px';
        sellBar.dataset.targetPrice = '0.00';
    } else {
        console.error('Chart container not found. Falling back to default position.');
        sellBar.style.left = '50px';
        sellBar.style.top = '50px';
    }

    // Poll for price updates (consider MutationObserver for dynamic sites)
    setInterval(monitorPrice, 1000); // Check every second

    // Optional: Add MutationObserver for dynamic price updates
    const priceElement = document.querySelector(priceSelector);
    if (priceElement) {
        const observer = new MutationObserver(monitorPrice);
        observer.observe(priceElement, { childList: true, subtree: true, characterData: true });
    }
})();