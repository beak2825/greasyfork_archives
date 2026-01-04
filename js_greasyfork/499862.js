// ==UserScript==
// @name         eBay Orders Manager
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Ensure barcode is scanned before purchasing shipping label and hide certain buttons
// @match        *://www.ebay.com/sh/ord*
// @grant        none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/499862/eBay%20Orders%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/499862/eBay%20Orders%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a floating barcode input field
    function createBarcodeInput(id) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Scan barcode...';
        input.id = id;
        input.autocomplete = 'off'; // Disable autocomplete
        input.style.position = 'fixed';
        input.style.top = '20%'; // Lowered further down the page
        input.style.right = '10px';
        input.style.zIndex = '1000';
        input.style.width = '300px';
        input.style.fontSize = '1.5em';
        input.style.padding = '5px';
        input.style.border = '2px solid #ccc';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = '#fff'; // Make it opaque
        input.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'; // Add a slight shadow for better visibility
        input.addEventListener('paste', (event) => {
            event.preventDefault(); // Prevent pasting
            alert('Pasting is not allowed. Please scan the barcode.');
        });
        return input;
    }

    // Function to handle barcode input with a delay
    function handleBarcodeInput(barcodeInput) {
        let inputTimeout;
        barcodeInput.addEventListener('input', () => {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                const barcodeValue = barcodeInput.value.trim();
                if (barcodeValue.length >= 5) { // assuming SKU prefix has a minimum length of 5 characters
                    checkBarcode(barcodeValue);
                }
            }, 300); // delay to handle rapid input
        });
    }

    // Function to check barcode against SKU prefix and trigger the purchase link if correct
    function checkBarcode(barcodeValue) {
        const orderRows = document.querySelectorAll('tr.order-info');
        let matchFound = false;
        orderRows.forEach(row => {
            const orderId = row.getAttribute('id').split('__')[0].replace('orderid_', '');
            const skuElement = row.nextElementSibling.querySelector('.item-custom-sku .sh-bold');
            const sku = skuElement ? skuElement.textContent.trim() : '';

            if (sku.includes('-')) {
                const skuPrefix = sku.split('-')[0] + '-';
                if (barcodeValue === skuPrefix) {
                    const purchaseLink = row.querySelector('.default-action.fake-link');
                    if (purchaseLink) {
                        matchFound = true;
                        window.location.href = purchaseLink.href;
                    }
                }
            } else {
                const purchaseLink = row.querySelector('.default-action.fake-link');
                if (purchaseLink) {
                    purchaseLink.style.display = 'block';
                }
            }
        });

        if (!matchFound && barcodeValue.includes('-')) {
            alert('No matching item found for the scanned barcode. Please check the barcode and try again.');
        }
    }

    // Function to hide the "Purchase Shipping Label" buttons if SKU contains a dash
    function setupOrderRows() {
        const orderRows = document.querySelectorAll('tr.order-info');
        orderRows.forEach(row => {
            const orderId = row.getAttribute('id').split('__')[0].replace('orderid_', '');
            const purchaseLink = row.querySelector('.default-action.fake-link');
            const skuElement = row.nextElementSibling.querySelector('.item-custom-sku .sh-bold');
            const sku = skuElement ? skuElement.textContent.trim() : '';

            if (sku.includes('-')) {
                purchaseLink.id = `purchase-shipping-label-link-${orderId}`;
                purchaseLink.style.display = 'none';
            }
        });
    }

    // Function to hide the "Shipping" drop-down button
    function hideShippingDropdown() {
        const shippingButton = document.querySelector('.bulk-shipping .fake-menu-button__button');
        if (shippingButton) {
            shippingButton.style.display = 'none';
        }
    }

    // Function to reinitialize the script
    function reinitializeScript() {
        setupOrderRows();
        hideShippingDropdown();

        // Set focus to the global barcode input field
        const globalBarcodeInput = document.getElementById('global-barcode-input');
        if (globalBarcodeInput) {
            globalBarcodeInput.focus();
        }
    }

    // Main function to initialize the script
    function init() {
        const navBar = document.querySelector('.shui-top-nav');
        if (navBar) {
            const globalBarcodeInput = createBarcodeInput('global-barcode-input');
            document.body.appendChild(globalBarcodeInput);
            handleBarcodeInput(globalBarcodeInput);

            // Set focus to the global barcode input after the page loads
            globalBarcodeInput.focus();
        }
        reinitializeScript();
    }

    // Observe URL changes to reinitialize the script
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            reinitializeScript();
        }
    }).observe(document, { subtree: true, childList: true });

    // Wait for the page to load fully before initializing
    window.addEventListener('load', init);

})();
