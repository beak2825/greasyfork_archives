// ==UserScript==
// @name         AliExpress Store Price Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to filter and remove items above a certain price on AliExpress store pages.
// @author       Hegy
// @match        *://*.aliexpress.com/store/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544926/AliExpress%20Store%20Price%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/544926/AliExpress%20Store%20Price%20Filter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'ali_max_val_float';
    // Load the saved value, defaulting to 1.00 if nothing is stored.
    let currentMaxVal = GM_getValue(STORAGE_KEY, 1.00);

    /**
     * Finds and parses the price from a product's main div.
     * @param {HTMLElement} productDiv - The container div for a single product.
     * @returns {number|null} The price as a float, or null if not found.
     */
    function getPriceFromProduct(productDiv) {
        const priceContainer = Array.from(productDiv.querySelectorAll('div')).find(div =>
            div.querySelector('span')?.textContent.includes('US $') &&
            div.style.flexDirection === 'row'
        );

        if (!priceContainer) return null;

        const priceSpans = priceContainer.querySelectorAll('span');
        let priceString = '';
        let priceFound = false;

        for (const span of priceSpans) {
            if (span.style.fontSize === '24px') {
                priceFound = true;
                priceString += span.textContent;
                continue;
            }
            if (priceFound) {
                const text = span.textContent.trim();
                if (text && !/^[0-9.]+$/.test(text)) break;
                priceString += text;
            }
        }

        return priceString ? parseFloat(priceString) : null;
    }

    /**
     * Main function to filter products. Iterates through items and removes those above currentMaxVal.
     */
    function filterProductsByPrice() {
        console.log(`Filtering products with price > ${currentMaxVal.toFixed(2)}`);

        const productGrid = document.querySelector('#right > div > div:nth-child(3)');
        if (!productGrid) {
            console.error('Product container not found. The page structure may have changed.');
            return;
        }

        const productDivs = productGrid.querySelectorAll(':scope > div');
        let removedCount = 0;

        productDivs.forEach(div => {
            const price = getPriceFromProduct(div);
            if (price !== null && price > currentMaxVal) {
                div.remove();
                removedCount++;
            }
        });

        console.log(`Finished filtering. Removed ${removedCount} items.`);
        // alert(`Filtering complete. Removed ${removedCount} items priced above $${currentMaxVal.toFixed(2)}.`);
    }

    /**
     * Updates the price display in the control panel.
     */
    function updateDisplay() {
        const valueStr = currentMaxVal.toFixed(2);
        const [dollars, cents] = valueStr.split('.');

        document.getElementById('dollars-display').textContent = dollars;
        document.getElementById('cents-display').textContent = cents;
    }

    /**
     * Modifies the currentMaxVal and updates the UI and storage.
     * @param {number} amount - The amount to add (can be negative).
     */
    function adjustValue(amount) {
        // Use parseFloat and toFixed to avoid floating point inaccuracies
        let newValue = parseFloat((currentMaxVal + amount).toFixed(2));
        if (newValue < 0) {
            newValue = 0;
        }
        currentMaxVal = newValue;
        GM_setValue(STORAGE_KEY, currentMaxVal);
        updateDisplay();
    }

    /**
     * Creates and injects the floating control panel onto the page.
     */
    function createControlPanel() {
        const panelContainer = document.createElement('div');
        Object.assign(panelContainer.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(240, 240, 240, 0.95)',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif'
        });

        // --- Create UI Elements ---
        const plusRow = document.createElement('div');
        const displayRow = document.createElement('div');
        const minusRow = document.createElement('div');
        const filterButton = document.createElement('button');

        // Styles for rows
        [plusRow, displayRow, minusRow].forEach(row => {
            Object.assign(row.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', width: '120px' });
        });
        displayRow.style.margin = '5px 0';

        // Display elements
        const dollarsDisplay = document.createElement('span');
        dollarsDisplay.id = 'dollars-display';
        const centsDisplay = document.createElement('span');
        centsDisplay.id = 'cents-display';
        const decimalSeparator = document.createElement('span');
        decimalSeparator.textContent = '.';
        [dollarsDisplay, centsDisplay].forEach(el => {
            Object.assign(el.style, {
                display: 'inline-block',
                padding: '5px',
                minWidth: '30px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                textAlign: 'center',
                fontSize: '18px',
                fontFamily: 'monospace'
            });
        });

        // Create buttons
        const createButton = (text, increment) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.addEventListener('click', () => adjustValue(increment));
            Object.assign(btn.style, { width: '35px', height: '30px', cursor: 'pointer', fontSize: '16px' });
            return btn;
        };

        // Assemble rows
        plusRow.append(createButton('+', 1.00), createButton('+', 0.10), createButton('+', 0.01));
        displayRow.append(dollarsDisplay, decimalSeparator, centsDisplay);
        minusRow.append(createButton('-', -1.00), createButton('-', -0.10), createButton('-', -0.01));

        // Filter button
        filterButton.textContent = 'Filter';
        Object.assign(filterButton.style, {
            width: '100%',
            padding: '10px 15px',
            marginTop: '5px',
            backgroundColor: '#fd384f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
        });
        filterButton.addEventListener('click', filterProductsByPrice);

        // Assemble the final panel
        panelContainer.append(plusRow, displayRow, minusRow, filterButton);
        document.body.appendChild(panelContainer);

        // Initial display update
        updateDisplay();
    }

    // Wait for the page to fully load before adding the control panel.
    window.addEventListener('load', createControlPanel);

})();