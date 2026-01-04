// ==UserScript==
// @name         Filter Items by Price on Dead Frontier
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Filter items on the Dead Frontier market page by user-defined price range and category
// @author       Diabetus
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521516/Filter%20Items%20by%20Price%20on%20Dead%20Frontier.user.js
// @updateURL https://update.greasyfork.org/scripts/521516/Filter%20Items%20by%20Price%20on%20Dead%20Frontier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to validate price input
    function validatePriceInput(price) {
        const priceRegex = /^\$\d{1,3}(,\d{3})*$/; // Matches $ and commas in the correct format
        return priceRegex.test(price);
    }

    // Function to parse price string into a number
    function parsePrice(priceString) {
        return parseInt(priceString.replace(/[^0-9]/g, ''), 10);
    }

    // Function to filter items by price range
    function filterByPriceRange(minPrice, maxPrice) {
        const items = document.querySelectorAll('.fakeItem');

        items.forEach(item => {
            const salePriceElement = item.querySelector('.salePrice');

            if (salePriceElement) {
                const priceText = salePriceElement.textContent.trim();

                if (validatePriceInput(priceText)) {
                    const price = parsePrice(priceText);

                    if (price < minPrice || price > maxPrice) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = '';
                    }
                }
            }
        });
    }

    // Function to filter items by food type
    function filterByFoodType(type) {
        const items = document.querySelectorAll('.fakeItem');

        items.forEach(item => {
            const itemType = item.getAttribute('data-type');

            if (itemType) {
                if (type === 'cooked' && !itemType.includes('_cooked')) {
                    item.style.display = 'none';
                } else if (type === 'uncooked' && itemType.includes('_cooked')) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
            }
        });
    }

    // Function to reset visibility for all food items
    function resetAllFoodItems() {
        const items = document.querySelectorAll('.fakeItem');

        items.forEach(item => {
            const itemType = item.getAttribute('data-type');

            if (itemType && itemType.includes('food')) {
                item.style.display = '';
            }
        });
    }

 // Function to filter items by affordability
    function filterByAffordability() {
        const cashElement = document.querySelector('.heldCash');
        const heldCash = parsePrice(cashElement.getAttribute('data-cash'));

        const items = document.querySelectorAll('.fakeItem');
        items.forEach(item => {
            const salePriceElement = item.querySelector('.salePrice');

            if (salePriceElement) {
                const priceText = salePriceElement.textContent.trim();
                const price = validatePriceInput(priceText) ? parsePrice(priceText) : Infinity;

                if (price > heldCash) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
            }
        });
    }

    // Function to toggle food options visibility based on category
    function toggleFoodOptionsVisibility() {
        const foodOptions = document.querySelectorAll('[name="foodType"], label[for="cookedFood"], label[for="uncookedFood"], label[for="bothFood"]');
        const currentCategory = document.querySelector('#categoryChoice')?.getAttribute('data-catname');

        if (currentCategory === 'food') {
            foodOptions.forEach(option => {
                option.style.display = '';
            });
        } else {
            foodOptions.forEach(option => {
                option.style.display = 'none';
            });
        }
    }

 // Function to create and display the UI
    function createFilterUI() {
        const uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '10px';
        uiContainer.style.right = '10px';
        uiContainer.style.backgroundColor = 'grey';
        uiContainer.style.border = '1px solid #ccc';
        uiContainer.style.padding = '10px';
        uiContainer.style.zIndex = '9999';

        uiContainer.innerHTML = `
            <label for="minPrice" style="color: red;">Min Price:</label>
            <input id="minPrice" type="text" placeholder="$0">
            <br>
            <label for="maxPrice" style="color: red;">Max Price:</label>
            <input id="maxPrice" type="text" placeholder="$1,000,000">
            <br>
            <input type="checkbox" id="hideUnaffordable" name="hideUnaffordable"> <label for="hideUnaffordable" style="color: red;">Hide Items You Can't Afford</label>
            <button id="applyFilter">Apply Filter</button>
            <p id="errorMessage" style="color: red; display: none;">Invalid price format. Use "$1,000" format.</p>
            <br>
            <label name="foodType" style="color: red;">Food Type:</label><br>
            <input type="radio" id="cookedFood" name="foodType" value="cooked"> <label for="cookedFood">Cooked Food</label><br>
            <input type="radio" id="uncookedFood" name="foodType" value="uncooked"> <label for="uncookedFood">Uncooked Food</label><br>
            <input type="radio" id="bothFood" name="foodType" value="both" checked> <label for="bothFood">Both</label><br>
        `;

        document.body.appendChild(uiContainer);

        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        const applyFilterButton = document.getElementById('applyFilter');
        const errorMessage = document.getElementById('errorMessage');
        const cookedFoodRadio = document.getElementById('cookedFood');
        const uncookedFoodRadio = document.getElementById('uncookedFood');
        const bothFoodRadio = document.getElementById('bothFood');
        const hideUnaffordableCheckbox = document.getElementById('hideUnaffordable');

        // Automatically filter food type when radio buttons are clicked
        cookedFoodRadio.addEventListener('change', () => {
            if (cookedFoodRadio.checked) filterByFoodType('cooked');
        });

        uncookedFoodRadio.addEventListener('change', () => {
            if (uncookedFoodRadio.checked) filterByFoodType('uncooked');
        });

        bothFoodRadio.addEventListener('change', () => {
            if (bothFoodRadio.checked) resetAllFoodItems();
        });


        applyFilterButton.addEventListener('click', () => {
            const minPriceText = minPriceInput.value.trim();
            const maxPriceText = maxPriceInput.value.trim();

            if ((minPriceText && validatePriceInput(minPriceText)) || (maxPriceText && validatePriceInput(maxPriceText)) || hideUnaffordableCheckbox.checked) {
                errorMessage.style.display = 'none';

                const minPrice = minPriceText && validatePriceInput(minPriceText) ? parsePrice(minPriceText) : 0;
                const maxPrice = maxPriceText && validatePriceInput(maxPriceText) ? parsePrice(maxPriceText) : Infinity;

                filterByPriceRange(minPrice, maxPrice);

            } else {
                errorMessage.style.display = 'block';
            }
        });

        hideUnaffordableCheckbox.addEventListener('change', () => {
            if (hideUnaffordableCheckbox.checked) {
                filterByAffordability();
            } else {
                filterByPriceRange(0, Infinity); // Reset to show all items within the current range
            }
        });

        // Toggle food options visibility based on category
        toggleFoodOptionsVisibility();

        // Observe category changes
        const observer = new MutationObserver(toggleFoodOptionsVisibility);
        observer.observe(document.querySelector('#categoryChoice'), { attributes: true });
    }

    // Initialize the script
    window.addEventListener('load', () => {
        createFilterUI();
    });
})();