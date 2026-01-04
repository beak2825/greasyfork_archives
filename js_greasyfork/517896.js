// ==UserScript==
// @name         Price Update with VAT and Period (Livewire Support)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Updates the price display with VAT based on selected period and supports Livewire updates
// @author       baluzs
// @match        https://atw.hu/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517896/Price%20Update%20with%20VAT%20and%20Period%20%28Livewire%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517896/Price%20Update%20with%20VAT%20and%20Period%20%28Livewire%20Support%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VAT_RATE = 0.27; // VAT rate
    let debounceTimer;

    function updatePrices() {
        const selectedPeriod = document.querySelector('input[name="package_period"]:checked')?.value || 1;
        console.log("Selected period: " + selectedPeriod);

        const priceBoxes = document.querySelectorAll('.price-box');
        if (priceBoxes.length === 0) {
            console.log('No price boxes found.');
            return;
        }

        priceBoxes.forEach((priceBox) => {
            const priceElement = priceBox.querySelector('.text-3xl');
            const detailsElement = priceBox.querySelector('div:not(.text-3xl)');

            if (priceElement && detailsElement) {
                const originalPriceText = priceElement.textContent.trim().replace(/\s+/g, '').replace(/[^\d]/g, '');
                const originalPrice = parseInt(originalPriceText, 10);

                if (!isNaN(originalPrice) && originalPrice > 0) {
                    let adjustedPrice = originalPrice;
                    if (selectedPeriod == 3) {
                        adjustedPrice = Math.round(originalPrice * 3);
                    } else if (selectedPeriod == 12) {
                        adjustedPrice = Math.round(originalPrice * 12);
                    }

                    const priceWithVAT = Math.round(adjustedPrice * (1 + VAT_RATE));
                    priceElement.textContent = `${priceWithVAT} Ft`;
                    detailsElement.textContent = `${adjustedPrice} Ft + ÁFA / ${selectedPeriod} hónap`;
                }
            }
        });
    }

    function attachPeriodChangeListeners() {
        const radioButtons = document.querySelectorAll('input[name="package_period"]');
        radioButtons.forEach((radioButton) => {
            radioButton.removeEventListener('change', updatePrices);
            radioButton.addEventListener('change', updatePrices);
        });
    }

    function observeDynamicChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            // Only proceed if the mutation involves price or period changes
            if (mutationsList.some((mutation) =>
                Array.from(mutation.addedNodes).some(node =>
                    node.querySelector?.('.price-box') || node.querySelector?.('input[name="package_period"]')
                )
            )) {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    console.log("DOM changed, updating prices and listeners...");
                    attachPeriodChangeListeners();
                    updatePrices();
                }, 500); // Adjust debounce delay as needed
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function livewireListener() {
        Livewire.on('modalUpdated', () => {
            console.log("Livewire modal updated");
            updatePrices();
            attachPeriodChangeListeners();
        });

        Livewire.hook('message.processed', () => {
            console.log("Livewire message processed");
            updatePrices();
            attachPeriodChangeListeners();
        });
    }

    window.addEventListener('load', () => {
        console.log("Page loaded");
        updatePrices();
        attachPeriodChangeListeners();
        livewireListener();
        observeDynamicChanges(); // Observe changes in DOM
    });

    setTimeout(() => {
        console.log("Backup price update");
        updatePrices();
        attachPeriodChangeListeners();
    }, 2000);

})();