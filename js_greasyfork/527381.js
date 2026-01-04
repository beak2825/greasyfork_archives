// ==UserScript==
// @name         ShopGoodwill Auto Shipping Estimate with Price Update
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically clicks the "Estimate Shipping" button, enters a zip code, clicks "Get Estimate," adds the shipping cost as a new line under the item price, and focuses back on the "Item Description" tab.
// @author       Your Name
// @match        https://shopgoodwill.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527381/ShopGoodwill%20Auto%20Shipping%20Estimate%20with%20Price%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/527381/ShopGoodwill%20Auto%20Shipping%20Estimate%20with%20Price%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Shipping Estimate Script Started');

    let lastUrl = location.href; // Store the initial URL

    function checkUrlChange() {
        if (location.href !== lastUrl) {
            console.log('URL changed:', location.href);
            lastUrl = location.href;
            handlePageChange();
        }
    }

    setInterval(checkUrlChange, 1000); // Check for URL changes every second

    function handlePageChange() {
        if (location.pathname.startsWith("/item/")) {
            console.log('Detected an item page, running shipping estimate script');
            startShippingEstimate();
        }
    }

    // Function to wait for the DOM to load completely
    function waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // Function to wait for a specific element to appear in the DOM
    function waitForElement(selector) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect(); // Stop observing
                    resolve(element);
                }
            });

            // Start observing the document body for added nodes
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Function to click the "Estimate Shipping" button
    async function clickEstimateShipping() {
        const estimateShippingButton = await waitForElement('button.btn:nth-child(6)');
        if (estimateShippingButton) {
            estimateShippingButton.click();
            console.log('Clicked "Estimate Shipping" button.');
            waitForShippingCalculator();
        } else {
            console.log('Estimate Shipping button not found.');
        }
    }

    // Function to wait for the shipping calculator to appear in the DOM
    function waitForShippingCalculator() {
        const observer = new MutationObserver((mutations, obs) => {
            const zipCodeInput = document.querySelector('input.form-control[placeholder="Zip/Postal Code"]');
            if (zipCodeInput) {
                obs.disconnect(); // Stop observing
                console.log('Shipping calculator appeared.');
                enterZipCode(zipCodeInput);
            }
        });

        // Start observing the document body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to enter the zip code
    function enterZipCode(zipCodeInput) {
        zipCodeInput.value = '45249';

        // Dispatch necessary events to simulate user input
        zipCodeInput.dispatchEvent(new Event('input', { bubbles: true }));
        zipCodeInput.dispatchEvent(new Event('change', { bubbles: true }));
        zipCodeInput.dispatchEvent(new Event('blur', { bubbles: true }));

        console.log('Entered zip code.');

        // Click the "Get Estimate" button
        const getEstimateButton = document.querySelector('button.btn:nth-child(6)');
        if (getEstimateButton) {
            getEstimateButton.click();
            console.log('Clicked "Get Estimate" button.');
            waitForShippingDetails();
        } else {
            console.log('Get Estimate button not found.');
        }
    }

    // Function to wait for the shipping details card to appear
    function waitForShippingDetails() {
        const observer = new MutationObserver((mutations, obs) => {
            const shippingDetailsCard = document.querySelector('div.checkout-card:nth-child(1)');
            if (shippingDetailsCard) {
                obs.disconnect(); // Stop observing
                console.log('Shipping details card appeared.');
                extractAndUpdatePrice(shippingDetailsCard);
            }
        });

        // Start observing the document body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to extract the shipping price and add it as a new line under the item price
    function extractAndUpdatePrice(shippingDetailsCard) {
        const shippingText = shippingDetailsCard.textContent;
        const totalShippingMatch = shippingText.match(/Total Shipping and Handling: (\$\d+\.\d+)/);

        if (totalShippingMatch) {
            const totalShipping = totalShippingMatch[1]; // e.g., "$24.20"
            console.log(`Total Shipping and Handling: ${totalShipping}`);

            // Locate the item price container
            const itemPriceContainer = document.querySelector('.mb-2 > div:nth-child(2)');
            if (itemPriceContainer) {
                // Create a new <h3> element for the shipping price
                const shippingPriceElement = document.createElement('h3');
                shippingPriceElement.textContent = `+${totalShipping} S+H`;
                shippingPriceElement.style.marginTop = '0'; // Remove extra spacing
                shippingPriceElement.style.fontSize = '1.25rem'; // Adjust font size if needed
                shippingPriceElement.style.color = 'red'; // Make the text red

                // Append the new <h3> element under the item price
                itemPriceContainer.appendChild(shippingPriceElement);
                console.log('Added shipping price as a new line under the item price.');

                // Focus back on the "Item Description" tab
                focusOnItemDescriptionTab();
            } else {
                console.log('Item price container not found.');
            }
        } else {
            console.log('Total Shipping and Handling price not found.');
        }
    }

    // Function to focus back on the "Item Description" tab
    function focusOnItemDescriptionTab() {
        const itemDescriptionTab = document.querySelector('#p-tabpanel-1-label');
        if (itemDescriptionTab) {
            itemDescriptionTab.click();
            console.log('Focused back on the "Item Description" tab.');
        } else {
            console.log('Item Description tab not found.');
        }
    }

    // Function to start the shipping estimate process
    async function startShippingEstimate() {
        await waitForDOM(); // Wait for the DOM to load completely
        clickEstimateShipping(); // Click the "Estimate Shipping" button
    }

    handlePageChange(); // Run once at the start

})();
