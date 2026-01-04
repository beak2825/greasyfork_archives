// ==UserScript==
// @name           Ironwood RPG - Market Quick Search
// @namespace      http://tampermonkey.net/
// @version        1.5
// @description    Adds a button to quickly search for market items you've clicked on
// @author         idk
// @match          https://ironwoodrpg.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @require        https://code.jquery.com/jquery-3.6.4.min.js
// @grant          none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527961/Ironwood%20RPG%20-%20Market%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/527961/Ironwood%20RPG%20-%20Market%20Quick%20Search.meta.js
// ==/UserScript==

(function($) {
    'use strict';

       // Options
        // Should we automatically set a sort? Use "None", "Date", or "Price"
        let overrideSort = "Price";
        // Change button colors if you want
        let searchButtonColor = "#263849"
        let cutButtonColor = "#c9b72d"
        let matchButtonColor = "#c9b72d"
        // End options


        let isButtonsInserted = false;
        let currentItemListingType = "";
        let currentItemName = "";
        let currentItemMarketValue = 0;
        let marketValueText = "";
        let valueMatch = "";
        let currentPrice = 0;
        let newPrice = 0;

        let editButton = "";

        // Function to insert the button
        function insertQuickSearchButton() {
            if (!isButtonsInserted) {
                let buyTab = $('market-listings-component .tab.left');
                let orderTab = $('market-listings-component .tab.middle');
                let sortButton = $(`market-listings-component .sort .container button:contains("${overrideSort}")`);
                const targetElement = $('market-listings-component .preview .actions');
                editButton = $('market-listings-component button:contains("Edit")');

                if (targetElement.length > 0) {
                    const quickSearchButton = $(`
                        <button type="button" class="action qs" style="
                            margin-top: 10px;
                            background: ${searchButtonColor};
                            width: 100%;
                            box-shadow: 0 6px 12px -6px #0006;
                            border-radius: 4px;
                            text-align: center;
                            height: 40px;
                            font-weight: 600;
                            letter-spacing: .25px;
                            align-items: center;
                            justify-content: center;
                        ">Quick Search</button>
                    `);
                    const updatePriceButton = $(`
                        <button type="button" class="action up" style="
                            background: ${cutButtonColor};
                            width: 50%;
                            box-shadow: 0 6px 12px -6px #0006;
                            border-radius: 4px;
                            text-align: center;
                            height: 35px;
                            font-weight: 600;
                            letter-spacing: 0;
                            align-items: center;
                            justify-content: center;
                            font-size:14px;
                        ">Cut</button>
                    `);
                    const matchPriceButton = $(`
                        <button type="button" class="action up" style="
                            background: ${matchButtonColor};
                            width: 50%;
                            box-shadow: 0 6px 12px -6px #0006;
                            border-radius: 4px;
                            text-align: center;
                            height: 35px;
                            font-weight: 600;
                            letter-spacing: 0;
                            align-items: center;
                            justify-content: center;
                            font-size:14px;
                        ">Match</button>
                    `);

                    // Add click event to the Quick Search button
                    quickSearchButton.click(function() {
                        updateNameVariable();
                        if (currentItemListingType === "Order") {
                            orderTab.click();
                        } else if (currentItemListingType === "Buy") {
                            buyTab.click();
                        }

                        if (overrideSort !== "None") { sortButton.click(); }

                        const searchInput = $('.search input:first');
                        searchInput.val("^"+currentItemName);

                        // Optional: focus the input field
                        // searchInput.focus();

                        // Trigger the "input" event - using native JavaScript for better compatibility
                        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                        searchInput[0].dispatchEvent(inputEvent);
                    });

                    // Add click event to the Update Price button (currently empty)
                    updatePriceButton.click(function() {
                        updateNameVariable();
                        updateMarketValue();
                        if (currentItemListingType === "Order") {
                            newPrice = currentItemMarketValue + 1;
                        } else if (currentItemListingType === "Buy") {
                            newPrice = currentItemMarketValue - 1;
                        }
                        editPrice();
                        console.log("Update Price button clicked. Market Value:", currentItemMarketValue);
                        console.log("Update Price button clicked. Current Price:", currentPrice);

                    });

                    // Add click event to the Update Price button (currently empty)
                    matchPriceButton.click(function() {
                        updateNameVariable();
                        updateMarketValue();
                        newPrice = currentItemMarketValue;
                        editPrice();
                        console.log("Update Price button clicked. Market Value:", currentItemMarketValue);
                        console.log("Update Price button clicked. Current Price:", currentPrice);
                    });

                    targetElement.append(quickSearchButton);
                    editButton.after(updatePriceButton);
                    editButton.after(matchPriceButton);

                    isButtonsInserted = true;
                }
            }
        }

        function updateMarketValue() {
            let marketValueElement = "";
            if (currentItemListingType === "Order") {
                marketValueElement = $('market-listings-component .preview .row span:contains("Market Highest")').parent();
                marketValueText = marketValueElement.text().replace(/,/g, '');
                valueMatch = marketValueText.match(/Market Highest\s*(\d+)/);

            } else if (currentItemListingType === "Buy") {
                marketValueElement = $('market-listings-component .preview .row span:contains("Market Lowest")').parent();
                marketValueText = marketValueElement.text().replace(/,/g, '');
                valueMatch = marketValueText.match(/Market Lowest\s*(\d+)/);
            }
            let currentPriceElement = $('market-listings-component .preview .row span:contains("Each")').parent();
            const currentPriceText = currentPriceElement.text().replace(/,/g, '');
            const priceMatch = currentPriceText.match(/Each\s*(\d+)/);

            if (valueMatch && valueMatch[1]) {
                currentItemMarketValue = parseInt(valueMatch[1], 10);
            }
            if (priceMatch && priceMatch[1]) {
                currentPrice = parseInt(priceMatch[1], 10);
            }
        }

        function editPrice() {
            if (newPrice !== undefined) {
                editButton.click(); // Click the "Edit" button

                // Wait for the input field to be visible and focused (adjust timeout as needed)
                setTimeout(() => {
                    const priceInput = $(':focus'); // Get the focused element (should be the price input)

                    if (priceInput.is('input')) {
                        priceInput.val(newPrice); // Set the new price

                        // Trigger "input", "change", and "keyup" events for compatibility
                        priceInput.trigger('input');
                        priceInput.trigger('change');
                        priceInput.trigger('keyup'); // Trigger keyup event

                        // Trigger the "input" event - using native JavaScript for better compatibility
                        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                        priceInput[0].dispatchEvent(inputEvent);

                        // Find and click the submit button
                        const submitButton = $('button[type="submit"]:visible');
                        if (submitButton.length > 0) {
                            submitButton.click();
                        } else {
                            console.error("Submit button not found.");
                        }
                    } else {
                        console.error("Price input field not found or not focused.");
                    }
                }, 100); // 500ms timeout (adjust as needed)
            }
        }

        // Update the item name and determine the current listing type
        function updateNameVariable() {
            const nameElement = $('market-listings-component .preview .header .name');
            if (nameElement.length > 0) {
                const newName = nameElement.text().trim();
                if (newName !== currentItemName) {
                    currentItemName = newName;
                }

                // Check for the "Order" tag
                const orderTag = $('market-listings-component .preview .header .tag:contains("Order")');
                if (orderTag.length > 0) {
                    currentItemListingType = "Order";
                } else {
                    currentItemListingType = "Buy";
                }
            }
        };

        const observer = new MutationObserver(function(mutations) {
            insertQuickSearchButton();
            updateNameVariable();
            // Reset isButtonsInserted to false if the target element is removed.
            if ($('market-listings-component .preview .actions .qs').length === 0) {
                isButtonsInserted = false;
                // Force a check to see if the button should be inserted NOW
                insertQuickSearchButton();
            }
        });
        const config = {
            subtree: true,
            childList: true
        };

        observer.observe(document.body, config);
})(jQuery);