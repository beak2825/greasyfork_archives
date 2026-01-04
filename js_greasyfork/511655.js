// ==UserScript==
// @name         Ready to Ship Quantity in Smart Doll Store
// @namespace    https://smartdoll.nexus/solarmarine/
// @version      1.4.4
// @description  Displays inventory quantity on individual product pages in Smart Doll Store.
// @author       Vega Starlight vel Piotr Hałaczkiewicz
// @match        https://shop.smartdoll.jp/*/products/*
// @match        https://shop.smartdoll.jp/products/*
// @grant        none
// @license      MIT License Copyright (c) 2024 Piotr Hałaczkiewicz
// @downloadURL https://update.greasyfork.org/scripts/511655/Ready%20to%20Ship%20Quantity%20in%20Smart%20Doll%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/511655/Ready%20to%20Ship%20Quantity%20in%20Smart%20Doll%20Store.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL and append ".json" to form the URL of the JSON file
    var url = window.location.href;
    var jsonUrl = (url.includes("?") ? url.split("?")[0] : url) + ".json";

    function formatInfo(inventoryQuantity, id) {
        return ` (Ready to ship: ${inventoryQuantity}) `
        //return ` (In stock: ${id} ${inventoryQuantity}) `
    }

    // Function to create and add a span element with the id and inventory quantity
    function addInventoryInfo(targetDiv, id, inventoryQuantity) {
        // Create a new span element
        var spanElement = document.createElement('span');
        // Set the text content with inventory quantity
        spanElement.textContent = formatInfo(inventoryQuantity, id);
        // Add the span element to the target div
        targetDiv.appendChild(spanElement);
    }

    function getInventoryQuantity(data, variantId) {
        var variant;
        if (variant = data.variants.find(v => v.id == variantId)) {
            return Math.max(variant.inventory_quantity, 0);
        } else {
            return 0;
        }
    }

    // Fetch the JSON file from the constructed URL
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {

        // Find all divs with the class "variant-selector"
        var variantDivs = document.querySelectorAll('div.variant-selector');

        // Iterate through each "variant-selector" div
        variantDivs.forEach(function(variantDiv) {
            // Try to find <li> elements first
            var listItems = variantDiv.querySelectorAll('li');

            if (listItems.length > 0) {
                // Iterate through each <li> element
                listItems.forEach(function(listItem) {
                    // Find the <input> element inside the <li>
                    var inputElement = listItem.querySelector('input');

                    // Check if input exists
                    if (inputElement) {
                        var variantId = inputElement.value;
                        var inventoryQuantity = getInventoryQuantity(data.product, variantId);
                        var labelElement = listItem.querySelector('label');

                        if (labelElement) {
                            var spanElements = labelElement.querySelector('span');
                            var spanElement = document.createElement('span');
                            spanElement.textContent = formatInfo(inventoryQuantity, variantId);
                            labelElement.insertBefore(spanElement, spanElements[0]);
                        }

                    }
                });
            } else {
                // If no listItems are found, try to find <option> elements
                var optionItems = variantDiv.querySelectorAll('option');
                // Find the div with class "product__buy"
                var buyDiv = document.querySelector('div.product__buy');
                // Iterate through each <option> element
                optionItems.forEach(function(optionItem) {
                    var variantId = optionItem.value;
                    var inventoryQuantity = getInventoryQuantity(data.product, variantId);
                    // Append the inventory info to the product__buy div
                    if (buyDiv && inventoryQuantity > 0) addInventoryInfo(buyDiv, variantId, inventoryQuantity);

                });
            }
        });

        // Find all divs with the class "variant-grid-item"
        var variantGridItems = document.querySelectorAll('div.variant-grid-item');

        // Iterate through each variant-grid-item div
        variantGridItems.forEach(function(gridItem) {
            var variantId = gridItem.getAttribute('data-product-variant');
            // Check if variantId exists
            if (variantId) {
                var inventoryQuantity = getInventoryQuantity(data.product, variantId);
                // Append the inventory info to the gridItem div
                if (inventoryQuantity > 0) addInventoryInfo(gridItem, variantId, inventoryQuantity);

            }
        });
    })
        .catch(error => console.error('Error fetching or processing JSON file:', error));
})();
