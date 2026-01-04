// ==UserScript==
// @name         Buy & Sell Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Insert a convenient Buy button and Sell button on item menus
// @author       McPeyen
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538920/Buy%20%20Sell%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/538920/Buy%20%20Sell%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonsInsertedForCurrentSubmenu = false;

    function findButtonByTextAndClass(text, partialClass, container = document) {
        const buttons = container.querySelectorAll(`.${partialClass}`);
        for (const button of buttons) {
            if (button.textContent.trim() === text) {
                return button;
            }
        }
        return null;
    }

    // Function to handle the click actions for Sell/Buy
    function handleButtonClick(buttonType) {
        const viewMarketplaceButton = findButtonByTextAndClass('View Marketplace', 'Button_fullWidth__17pVU');
        if (viewMarketplaceButton) {
            console.log('[Custom Buttons] Clicking View Marketplace button');
            viewMarketplaceButton.click();

            setTimeout(() => {
                let targetButtonText;
                let targetButtonClass;

                if (buttonType === 'Sell') {
                    targetButtonText = '+ New Sell Listing';
                    targetButtonClass = 'Button_sell__3FNpM';
                } else if (buttonType === 'Buy') {
                    targetButtonText = '+ New Buy Listing';
                    targetButtonClass = 'Button_buy__3s24l';
                }

                const newListingButton = findButtonByTextAndClass(targetButtonText, targetButtonClass);

                if (newListingButton) {
                    console.log(`[Custom Buttons] Clicking ${targetButtonText} button`);
                    newListingButton.click();
                } else {                    
                }
            }, 400); // Increased delay slightly
        } else {            
        }
    }

    function insertCustomButtons() {
        if (buttonsInsertedForCurrentSubmenu) {
            // console.log('[Custom Buttons] Buttons already inserted for current submenu, skipping.');
            return;
        }

        const amountInputContainer = document.querySelector('.Item_amountInputContainer__1RT17');
        const viewMarketplaceButton = findButtonByTextAndClass('View Marketplace', 'Button_fullWidth__17pVU');

        if (!amountInputContainer || !viewMarketplaceButton) {
            // console.log('[Custom Buttons] Required elements for insertion not found yet.');
            return;
        }

        const buttonParent = viewMarketplaceButton.parentElement; // Assumes 'View Marketplace' is in a suitable parent

        if (!buttonParent) {
            console.error('[Custom Buttons] Could not find parent element for button insertion.');
            return;
        }

        console.log('[Custom Buttons] Attempting to insert custom buttons...');

        const buttonsToInsert = [
            { text: 'New Sell Listing', action: () => handleButtonClick('Sell'), className: '' },
            { text: 'New Buy Listing', action: () => handleButtonClick('Buy'), className: '' }
        ];

        let lastSibling = viewMarketplaceButton; // Start inserting after View Marketplace

        buttonsToInsert.forEach(btnConfig => {
            const existingButton = findButtonByTextAndClass(btnConfig.text, 'Button_fullWidth__17pVU', buttonParent);

            if (!existingButton) {
                const newButton = document.createElement('button');
                newButton.className = `Button_button__1Fe9z Button_fullWidth__17pVU ${btnConfig.className}`;
                newButton.textContent = btnConfig.text;

                lastSibling.insertAdjacentElement('afterend', newButton);
                newButton.addEventListener('click', btnConfig.action);

                lastSibling = newButton;
            } else {
                lastSibling = existingButton; // Ensure correct placement for next button if it exists
            }
        });

        buttonsInsertedForCurrentSubmenu = true;
        console.log('[Custom Buttons] Buttons insertion attempt completed. Set buttonsInsertedForCurrentSubmenu to true.');
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        let submenuAppeared = false;
        let submenuDisappeared = false;

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && (node.matches('.Item_amountInputContainer__1RT17') || node.querySelector('.Item_amountInputContainer__1RT17'))) {
                        submenuAppeared = true;
                    }
                });

                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && (node.matches('.Item_amountInputContainer__1RT17') || node.querySelector('.Item_amountInputContainer__1RT17'))) {
                        submenuDisappeared = true;
                    }
                });
            }
        }

        if (submenuAppeared) {
            setTimeout(() => {
                insertCustomButtons();
            }, 50); // Small delay
        } else if (submenuDisappeared) {
            buttonsInsertedForCurrentSubmenu = false;
        }
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    insertCustomButtons();
})();