// ==UserScript==
// @name         Enhanced Roblox Display Modifier by OB
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Modifies Robux display and item details on Roblox pages by OB
// @match        https://*.roblox.com/*
// @license MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/511308/Enhanced%20Roblox%20Display%20Modifier%20by%20OB.user.js
// @updateURL https://update.greasyfork.org/scripts/511308/Enhanced%20Roblox%20Display%20Modifier%20by%20OB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        desiredRobuxAmount: 100000,
        itemsToModify: [
            {
                originalName: "ITEM NAME",
                newName: "Sparkle Time Fedora",
                newImageUrl: "https://tr.rbxcdn.com/0c54305eb2775385ee670cb16f28e1f0/150/150/Hat/Webp",
                hasRestrictionIcon: true
            },
            {
                originalName: "ITEM NAME",
                newName: "Blackvalk",
                newImageUrl: "https://tr.rbxcdn.com/8d250084fe0bfe56b7ef82ead80fc079/150/150/Hat/Webp",
                hasRestrictionIcon: true
            },
            {
                originalName: "ITEM NAME",
                newName: "Teal Sparkle Time Fedora",
                newImageUrl: "https://tr.rbxcdn.com/401b49b8a1c3ca0956b3a137f9f2d17d/150/150/Hat/Webp",
                hasRestrictionIcon: true
            }
        ]
    };

    // Function to format the Robux amount with K for thousands (no decimal)
    function formatRobuxAmountK(amount) {
        return amount >= 1000 ? Math.floor(amount / 1000) + 'K' : amount.toString();
    }

    // Function to format the Robux amount with commas
    function formatRobuxAmountCommas(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to edit the Robux display in the navigation bar
    function editNavRobuxDisplay() {
        const robuxAmountElement = document.getElementById('nav-robux-amount');
        const formattedAmount = formatRobuxAmountK(config.desiredRobuxAmount);
        if (robuxAmountElement && robuxAmountElement.textContent !== formattedAmount) {
            robuxAmountElement.textContent = formattedAmount;
        }
    }

    // Function to edit the Robux display in the balance area
    function editBalanceRobuxDisplay() {
        const balanceElements = document.querySelectorAll('span:has(.icon-robux-16x16)');
        balanceElements.forEach(element => {
            const robuxElement = element.querySelector('.icon-robux-16x16');
            if (robuxElement && robuxElement.nextSibling) {
                const formattedAmount = formatRobuxAmountCommas(config.desiredRobuxAmount);
                robuxElement.nextSibling.textContent = formattedAmount;
            }
        });
    }

    // Function to modify item details
    function modifyItemDetails() {
        const itemCards = document.querySelectorAll('.item-card');

        itemCards.forEach(card => {
            const itemNameElement = card.querySelector('.item-card-name');
            const itemImageElement = card.querySelector('.item-card-thumb-container img');

            if (itemNameElement && itemImageElement) {
                const itemName = itemNameElement.textContent.trim();
                const originalItem = config.itemsToModify.find(item => item.originalName.toLowerCase() === itemName.toLowerCase());

                if (originalItem) {
                    // Update the item name
                    itemNameElement.textContent = originalItem.newName;
                    itemNameElement.title = originalItem.newName;

                    // Update the item image
                    itemImageElement.src = originalItem.newImageUrl;
                    itemImageElement.setAttribute('ng-src', originalItem.newImageUrl); // For AngularJS bindings

                    // Check for restriction icon
                    const restrictionIconContainer = card.querySelector('.item-card-thumb-container');

                    // Create the restriction icon
                    if (originalItem.hasRestrictionIcon) {
                        const iconSpan = document.createElement('span');
                        iconSpan.className = 'restriction-icon icon-limited-unique-label';
                        iconSpan.setAttribute('ng-show', 'item.itemRestrictionIcon');
                        iconSpan.setAttribute('ng-class', 'item.itemRestrictionIcon');

                        // Remove existing icons to avoid duplicates
                        const existingIcon = restrictionIconContainer.querySelector('.restriction-icon');
                        if (existingIcon) {
                            existingIcon.remove();
                        }

                        // Append the new icon
                        restrictionIconContainer.appendChild(iconSpan);
                    }
                }
            }
        });
    }

    // Function to continuously check and update all displays
    function updateAllDisplays() {
        editNavRobuxDisplay();
        editBalanceRobuxDisplay();
        modifyItemDetails();
        requestAnimationFrame(updateAllDisplays);
    }

    // Start observing DOM changes
    const observer = new MutationObserver(() => {
        editNavRobuxDisplay();
        editBalanceRobuxDisplay();
        modifyItemDetails();
    });

    // Function to start everything
    function init() {
        updateAllDisplays();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run init as soon as the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
