// ==UserScript==
// @name         Pet Trade Price Calculator
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Calculate total trade price from pet trade listings for both VIEW and EDIT pages
// @author       Your Name
// @match        https://www.chickensmoothie.com/trades/viewtrade.php*
// @match        https://www.chickensmoothie.com/trades/edittrade.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520156/Pet%20Trade%20Price%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/520156/Pet%20Trade%20Price%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for displaying gems (true or false)
    const displayGems = true;

    // Function to parse prices like "3 for 1C$", "2C$", "45C$ | 180g", "2kg", or "3 for 1C$ | 5g"
    function parsePriceFromName(text) {
        let cPrice = 0, gPrice = 0;

        // Match patterns like "3 for 1C$ | 5g" and divide both C$ and gem prices
        let multiCAndGMatch = text.match(/(\d+)\s*for\s*(\d+(?:\.\d+)?)\s*C\$\s*\|\s*(\d+(?:\.\d+)?)\s*g/i);
        if (multiCAndGMatch) {
            const count = parseInt(multiCAndGMatch[1], 10);
            const totalCPrice = parseFloat(multiCAndGMatch[2]);
            const totalGPrice = parseFloat(multiCAndGMatch[3]);
            cPrice = totalCPrice / count;
            gPrice = totalGPrice / count;
        }

        // Match patterns like "3 for 1C$" and divide the price
        let multiCMatch = text.match(/(\d+)\s*for\s*(\d+(?:\.\d+)?)\s*C\$/i);
        if (multiCMatch && !multiCAndGMatch) {
            const count = parseInt(multiCMatch[1], 10);
            const totalCost = parseFloat(multiCMatch[2]);
            cPrice = totalCost / count;
        }

        // Match standalone C$ prices (e.g., "45C$")
        let cMatch = text.match(/(\d+(?:\.\d+)?)\s*C\$/i);
        if (cMatch && !multiCAndGMatch && !multiCMatch) {
            cPrice = parseFloat(cMatch[1]);
        }

        // Match standalone gem prices (e.g., "180g")
        let gMatch = text.match(/\|?\s*(\d+(?:\.\d+)?)\s*g/i);
        if (gMatch && !multiCAndGMatch) {
            gPrice += parseFloat(gMatch[1]);
        }

        // Match kg prices (e.g., "2kg" = 2000g)
        let kgMatch = text.match(/(\d+(?:\.\d+)?)\s*kg/i);
        if (kgMatch) {
            gPrice += parseFloat(kgMatch[1]) * 1000; // Convert kg to g
        }

        return { cPrice, gPrice };
    }

    // Function to calculate total price for VIEW TRADE page
    function calculateTotalForViewTrade() {
        const tradeThingsContainers = document.querySelectorAll('.trade-things');

        tradeThingsContainers.forEach(tradeThings => {
            const petItems = tradeThings.querySelectorAll('li.pet');
            let totalCPrice = 0;
            let totalGPrice = 0;

            petItems.forEach(petItem => {
                // Find the price text within the correct part of the pet item
                const textNodes = Array.from(petItem.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                const priceText = textNodes.map(node => node.textContent.trim()).find(text => text.match(/\d+C\$/i) || text.match(/\d+\s*for\s*\d+C\$/i) || text.match(/\d+(?:\.\d+)?\s*g/i) || text.match(/\d+\s*kg/i));

                if (priceText) {
                    const { cPrice, gPrice } = parsePriceFromName(priceText);
                    totalCPrice += cPrice;
                    totalGPrice += gPrice;
                }
            });

            // Append total price to the trade-things div
            let totalDiv = tradeThings.querySelector('.total-price');
            if (!totalDiv) {
                totalDiv = document.createElement('div');
                totalDiv.className = 'total-price';
                tradeThings.appendChild(totalDiv);
            }

            let totalPriceHTML = `<b>Total Price:</b> ${totalCPrice.toFixed(2)}C$`;
            if (totalGPrice > 0) {
                // Remove ".00" from the gem price if it's a whole number
                totalPriceHTML += ` | ${totalGPrice % 1 === 0 ? totalGPrice : totalGPrice.toFixed(2)}g`;
            }

            totalDiv.innerHTML = totalPriceHTML;
        });
    }

    // Function to calculate total price for EDIT TRADE page
    function calculateTotalForEditTrade() {
        const petSections = document.querySelectorAll('.petsection');

        petSections.forEach(petSection => {
            const petItems = petSection.querySelectorAll('.petbox .pet');
            let totalCPrice = 0;
            let totalGPrice = 0;

            petItems.forEach(petItem => {
                const nameParagraph = petItem.querySelector('p');
                if (nameParagraph) {
                    const text = nameParagraph.textContent.trim();
                    const { cPrice, gPrice } = parsePriceFromName(text);
                    totalCPrice += cPrice;
                    totalGPrice += gPrice;
                }
            });

            let totalValueDiv = petSection.querySelector('.total-value');
            if (totalValueDiv) {
                let totalPriceDiv = petSection.querySelector('.total-price');
                if (!totalPriceDiv) {
                    totalPriceDiv = document.createElement('div');
                    totalPriceDiv.className = 'total-price';
                }

                // Generate new total price HTML
                let totalPriceHTML = `<b>Total Price:</b> ${totalCPrice.toFixed(2)}C$`;
                if (displayGems && totalGPrice > 0) {
                    // Remove ".00" from the gem price if it's a whole number
                    totalPriceHTML += ` | ${totalGPrice % 1 === 0 ? totalGPrice : totalGPrice.toFixed(2)}g`;
                }

                // Check if the price has changed before updating
                if (totalPriceDiv.innerHTML !== totalPriceHTML) {
                    totalPriceDiv.innerHTML = totalPriceHTML;
                    totalValueDiv.parentNode.insertBefore(totalPriceDiv, totalValueDiv);
                }
            }
        });
    }

    // Observe changes dynamically with throttling for EDIT TRADE page
    function observeMutationsForEditTrade() {
        const throttleTimeout = 200; // Limit updates to once every 200ms
        let isThrottled = false;

        const observer = new MutationObserver(() => {
            if (isThrottled) return;
            isThrottled = true;

            setTimeout(() => {
                if (window.location.href.includes('edittrade.php')) {
                    calculateTotalForEditTrade();
                }
                isThrottled = false;
            }, throttleTimeout);
        });

        const targetNodes = document.querySelectorAll('.petsection');
        targetNodes.forEach(node => {
            observer.observe(node, { childList: true, subtree: true });
        });
    }

    // Check which page we are on and run the corresponding function
    window.addEventListener('load', () => {
        if (window.location.href.includes('viewtrade.php')) {
            calculateTotalForViewTrade();
        } else if (window.location.href.includes('edittrade.php')) {
            calculateTotalForEditTrade();
            observeMutationsForEditTrade();
        }
    });
})();

