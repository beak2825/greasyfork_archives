// ==UserScript==
// @name         TCGPlayer Cart Buttons - Remove Duplicates, Save Expensive or Non-Direct For Later, and More!
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  Adds buttons to augment the tcgplayer shopping cart experience.
// @author       ganondorc
// @match        https://www.tcgplayer.com/cart*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494261/TCGPlayer%20Cart%20Buttons%20-%20Remove%20Duplicates%2C%20Save%20Expensive%20or%20Non-Direct%20For%20Later%2C%20and%20More%21.user.js
// @updateURL https://update.greasyfork.org/scripts/494261/TCGPlayer%20Cart%20Buttons%20-%20Remove%20Duplicates%2C%20Save%20Expensive%20or%20Non-Direct%20For%20Later%2C%20and%20More%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default values
    const defaultMinCards = 5;
    const defaultMaxPrice = 3;

    function createButtonRow(buttonText, onClickHandler, testid) {
        const row = document.createElement('div');
        row.className = 'button-row';
        row.style.paddingBottom = '5px';
        row.style.paddingTop = '5px';

        const button = document.createElement('button');
        button.className = 'tcg-button tcg-button--md tcg-standard-button tcg-standard-button--priority is-full-width checkout-btn';
        button.type = 'button';
        button.dataset.testid = testid;

        const buttonContent = document.createElement('span');
        buttonContent.className = 'tcg-standard-button__content';
        const spanText = document.createElement('span');
        spanText.textContent = buttonText;
        buttonContent.appendChild(spanText);
        button.appendChild(buttonContent);

        button.addEventListener('click', onClickHandler);
        row.appendChild(button);

        return row;
    }

    function injectButtons() {
        const cartSummary = document.querySelector('section.cart-summary');
        const savedForLaterActions = document.querySelector('section.saved-for-later-actions');
        if (!cartSummary && !savedForLaterActions) {
            console.warn('Relevant sections not found.');
            return;
        }

        // Inject into cart summary section
        if (cartSummary) {
            const checkOutButton = cartSummary.querySelector('.checkout-btn');
            if (!checkOutButton) {
                console.warn('Checkout button not found.');
                return;
            }

            // Create the button container
            let buttonContainer = cartSummary.querySelector('.button-container');
            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';
                cartSummary.insertBefore(buttonContainer, checkOutButton);
            }

            // Input for "save non-direct packages"
            if (!buttonContainer.querySelector('input[data-testid="inputMinCards"]')) {
                const inputRow = document.createElement('div');
                inputRow.className = 'button-row';
                inputRow.style.display = 'flex';
                inputRow.style.justifyContent = 'center';
                inputRow.style.flexDirection = 'column';

                const label = document.createElement('label');
                label.textContent = 'Min Cards';
                label.style.marginBottom = '5px';
                label.style.textAlign = 'center';

                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = 'Min Cards';
                input.min = '0';
                input.value = defaultMinCards;
                input.className = 'min-cards-input';
                input.style.height = '30px';
                input.dataset.testid = 'inputMinCards';

                inputRow.appendChild(label);
                inputRow.appendChild(input);
                buttonContainer.appendChild(inputRow);
            }

            // Save non-direct packages button
            if (!buttonContainer.querySelector('button[data-testid="btnSaveNonDirectPackages"]')) {
                const savePackagesButtonRow = createButtonRow(
                    'Save Non-Direct Packages',
                    () => {
                        const input = buttonContainer.querySelector('input[data-testid="inputMinCards"]');
                        const minCards = parseInt(input.value);
                        saveNonDirectPackages(minCards);
                    },
                    'btnSaveNonDirectPackages'
                );
                buttonContainer.appendChild(savePackagesButtonRow);
            }

            if (!buttonContainer.querySelector('button[data-testid="btnSaveExpensiveItems"]')) {
                // Create the input field row
                const inputRow = document.createElement('div');
                inputRow.className = 'button-row';
                inputRow.style.display = 'flex';
                inputRow.style.justifyContent = 'center';
                inputRow.style.flexDirection = 'column';

                const label = document.createElement('label');
                label.textContent = 'Max Price';
                label.style.marginBottom = '5px';
                label.style.textAlign = 'center';

                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = 'Max Price';
                input.step = '0.01';
                input.min = '0';
                input.value = defaultMaxPrice;
                input.className = 'max-price-input';
                input.style.height = '30px';

                inputRow.appendChild(label);
                inputRow.appendChild(input);
                buttonContainer.appendChild(inputRow);

                const saveExpensiveButtonRow = createButtonRow(
                    'Save Items Over Price',
                    () => {
                        const maxPrice = parseFloat(input.value);
                        if (isNaN(maxPrice)) {
                            window.alert('Please enter a valid maximum price.');
                        } else {
                            saveExpensiveItems(maxPrice);
                        }
                    },
                    'btnSaveExpensiveItems'
                );
                buttonContainer.appendChild(saveExpensiveButtonRow);
            }

            if (!buttonContainer.querySelector('button[data-testid="btnRemoveDuplicateCards"]')) {
                const removeDuplicatesButtonRow = createButtonRow(
                    'Remove Duplicate Cards',
                    removeDuplicateCards,
                    'btnRemoveDuplicateCards'
                );
                buttonContainer.appendChild(removeDuplicatesButtonRow);
            }
        }

        // Inject into saved for later actions section
        if (savedForLaterActions) {
            if (!savedForLaterActions.querySelector('button[data-testid="btnActuallyAddAllToCart"]')) {
                const actuallyAddAllButtonRow = createButtonRow(
                    'Actually Add All To Cart',
                    actuallyAddAllToCart,
                    'btnActuallyAddAllToCart'
                );
                savedForLaterActions.appendChild(actuallyAddAllButtonRow);
            }
        }
    }

    function isDirectPackage(packageElement) {
        return !packageElement.classList.contains('non-direct-package');
    }

    function saveItemsForPackage(packageElement) {
        const allItemsActions = packageElement.querySelector('.all-items-actions');
        if (allItemsActions) {
            const buttons = allItemsActions.querySelectorAll('button');
            const saveButton = Array.from(buttons).find(button =>
                button.textContent.includes("Save items")
            );

            if (saveButton) {
                console.log('Clicking Save items button for package:', packageElement);
                saveButton.click();
            } else {
                console.warn('Save items button not found for package:', packageElement);
            }
        } else {
            console.warn('all-items-actions div not found for package:', packageElement);
        }
    }

    function saveNonDirectPackages(minCards = defaultMinCards) {
        const packages = document.querySelectorAll('section.tab-content.non-direct-package');
        let savedPackagesCount = 0;
        packages.forEach(packageElement => {
            const items = packageElement.querySelectorAll('.package-item');

            // Only save packages with at least the specified minimum number of items
            if (!isDirectPackage(packageElement) && items.length < minCards) {
                saveItemsForPackage(packageElement);
                savedPackagesCount++;
            }
        });
        window.alert(`Saved items for ${savedPackagesCount} non-direct package(s) with under ${minCards} cards.`);
    }

    function saveExpensiveItems(maxPrice = defaultMaxPrice) {
        const stackedSections = document.querySelectorAll('section.stacked-content');
        let savedItemsCount = 0;
        stackedSections.forEach(sectionElement => {
            const items = sectionElement.querySelectorAll('.package-item');

            items.forEach(item => {
                const priceElement = item.querySelector('.price');
                if (priceElement) {
                    const priceText = priceElement.textContent.trim().replace('$', '');
                    const price = parseFloat(priceText);

                    if (price > maxPrice) {
                        const saveButton = item.querySelector('button.save-for-later');
                        if (saveButton) {
                            saveButton.click();
                            savedItemsCount++;
                        } else {
                            console.warn('Save for later button not found for item:', item);
                        }
                    }
                } else {
                    console.warn('Price element not found for item:', item);
                }
            });
        });
        window.alert(`Saved ${savedItemsCount} item(s) over $${maxPrice}.`);
    }

    function removeDuplicateCards() {
        const stackedSections = document.querySelectorAll('section.stacked-content');
        const itemMap = new Map();
        let removedItemsCount = 0;

        stackedSections.forEach(sectionElement => {
            const items = sectionElement.querySelectorAll('.package-item');

            items.forEach(item => {
                const nameElement = item.querySelector('[data-testid="productName"]');
                const priceElement = item.querySelector('.price');
                if (!nameElement || !priceElement) {
                    console.warn('Name or price element not found for item:', item);
                    return;
                }

                const name = nameElement.textContent.trim();
                const price = parseFloat(priceElement.textContent.trim().replace('$', ''));

                if (!itemMap.has(name)) {
                    itemMap.set(name, [{ item, price }]);
                } else {
                    itemMap.get(name).push({ item, price });
                }
            });
        });

        itemMap.forEach(itemArray => {
            itemArray.sort((a, b) => a.price - b.price);
            const selectedItem = itemArray[0];

            itemArray.forEach(({ item, price }, index) => {
                if (index > 0) {
                    const removeButton = item.querySelector('button.remove');
                    if (removeButton) {
                        removeButton.click();
                        removedItemsCount++;
                    }
                } else {
                    const quantitySelect = item.querySelector('select[aria-label*="cart quantity"]');
                    if (quantitySelect.value != '1') {
                        console.warn("found a greater than 1 quantity: ", quantitySelect.value);
                        // quantitySelect.value = "1";
                        // simulateMouseClick(quantitySelect);
                        // const event = new Event('change', { bubbles: true });
                        // quantitySelect.dispatchEvent(event);
                    }
                }
            });
        });

        window.alert(`Removed ${removedItemsCount} duplicate card(s).`);
    }

    function simulateMouseClick(targetNode) {
        function triggerMouseEvent(targetNode, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            targetNode.dispatchEvent(clickEvent);
        }
        ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
            triggerMouseEvent(targetNode, eventType);
        });
    }

    function actuallyAddAllToCart() {
        const savedItems = document.querySelectorAll('section.saved-item');
        let addedItemsCount = 0;

        savedItems.forEach(item => {
            const addToCartButton = item.querySelector('button[data-testid="saveForLaterAddToCart"]');

            if (addToCartButton) {
                addToCartButton.click();
                addedItemsCount++;
            } else {
                console.warn('Add to Cart button not found for saved item:', item);
            }
        });

        window.alert(`Added ${addedItemsCount} item(s) to the cart.`);
    }

    function setupObserver() {
        const observer = new MutationObserver(() => {
            injectButtons();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setupObserver();
        injectButtons(); // Initial injection
    });
})();

