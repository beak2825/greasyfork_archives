// ==UserScript==
// @name         Price per TB Calculator & Sorter
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt// @version      1.0
// @description  Calculates price per TB, sorts products by value, and applies a color gradient.
// @author       aayushdutt
// @match        https://www.primeabgb.com/*
// @grant        none
// @license      MIT
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/547154/Price%20per%20TB%20Calculator%20%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/547154/Price%20per%20TB%20Calculator%20%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // Adjust these values to tweak the color gradient logic.
    const CONFIG = {
        currencySymbol: '₹',
        medianPrice: 2500, // The price point considered "average" (yellow).
        gradientRange: 2000  // The range around the median for the full gradient.
    };

    /**
     * Calculates a darker, high-contrast color based on the price per TB.
     * @param {number} price - The price per terabyte.
     * @returns {string} An RGB color string (e.g., 'rgb(200, 0, 0)').
     */
    function getColorForPrice(price) {
        const normalized = (price - CONFIG.medianPrice) / CONFIG.gradientRange;
        const clamped = Math.max(-1, Math.min(1, normalized));

        let r, g;
        if (clamped < 0) { // Gradient from Dark Green to Dark Yellow
            r = 200 * (1 + clamped);
            g = 150;
        } else { // Gradient from Dark Yellow to Dark Red
            r = 200;
            g = 150 * (1 - clamped);
        }
        return `rgb(${Math.round(r)}, ${Math.round(g)}, 0)`;
    }

    /**
     * Parses a product element to extract its title, price, and storage capacity.
     * @param {HTMLElement} productEl - The product's container element.
     * @returns {object|null} An object with product data or null if essential data is missing.
     */
    function parseProductData(productEl) {
        const titleElement = productEl.querySelector('.product-title a');
        const priceElement = productEl.querySelector('.price ins .woocommerce-Price-amount.amount bdi');

        if (!titleElement || !priceElement) return null;

        const title = titleElement.innerText;
        const tbMatch = title.match(/(\d+)\s*TB/i);

        if (!tbMatch) return null;

        const terabytes = parseInt(tbMatch[1], 10);
        const priceText = priceElement.innerText.replace(new RegExp(`[${CONFIG.currencySymbol},]`, 'g'), '');
        const price = parseFloat(priceText);

        if (isNaN(price) || isNaN(terabytes) || terabytes <= 0) return null;

        const pricePerTb = price / terabytes;
        return { element: productEl, pricePerTb };
    }

    /**
     * Creates and injects the price-per-TB element into the DOM.
     * @param {object} productData - The object returned from parseProductData.
     */
    function injectPriceDisplay(productData) {
        if (!productData) return;

        // Remove old element if the script is re-run
        const oldDisplay = productData.element.querySelector('.price-per-tb');
        if (oldDisplay) oldDisplay.remove();

        const displayEl = document.createElement('div');
        displayEl.className = 'price-per-tb';
        displayEl.innerText = `${CONFIG.currencySymbol}${productData.pricePerTb.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / TB`;

        // Apply styles
        displayEl.style.fontSize = '14px';
        displayEl.style.fontWeight = 'bold';
        displayEl.style.color = getColorForPrice(productData.pricePerTb);
        displayEl.style.marginTop = '5px';

        const priceContainer = productData.element.querySelector('.product-price');
        if (priceContainer) {
            priceContainer.appendChild(displayEl);
        }
    }

    /**
     * Main function to orchestrate the script's execution.
     */
    function main() {
        const productContainer = document.querySelector('.products.products-wrap');
        if (!productContainer) {
            console.error("PricePerTB Script: Product container not found.");
            return;
        }

        const products = Array.from(productContainer.querySelectorAll('.product.type-product'));

        const productsData = products.map(parseProductData).filter(Boolean);

        // Inject the price display for each valid product.
        productsData.forEach(injectPriceDisplay);

        // Sort the products based on price per TB (lowest to highest).
        productsData.sort((a, b) => a.pricePerTb - b.pricePerTb);

        // Re-append the sorted elements into the container.
        productsData.forEach(item => {
            productContainer.appendChild(item.element);
        });
    }

    // Run the script.
    main();

})();
