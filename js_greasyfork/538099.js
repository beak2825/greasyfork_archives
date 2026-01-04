// ==UserScript==
// @name         FRPG Mailbox Condenser
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @author       CoreDialer
// @match        https://farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @description  Condense duplicate items in FRPG mailbox log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538099/FRPG%20Mailbox%20Condenser.user.js
// @updateURL https://update.greasyfork.org/scripts/538099/FRPG%20Mailbox%20Condenser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State tracking
    let isCondensed = false;
    let originalItems = [];

    // Check if we're on the mastery page by monitoring URL changes and DOM
    function checkForMailboxPage() {
        // Check if URL contains mastery.php or if mastery elements are present
        const isMasteryPage = window.location.href.includes('mailboxlog.php') ||
                             document.querySelector('.page[data-name="mailboxlog"]') !== null;

        // Only show button on mastery page
        if (isMasteryPage) {
            if (!document.getElementById('condense-mailbox-btn')) {
                addCondenseButton();
            }
        } else {
            // Remove button if not on mastery page and reset state
            const existingButton = document.getElementById('condense-mailbox-btn');
            if (existingButton) {
                existingButton.remove();
            }
            // Reset state when leaving page
            isCondensed = false;
            originalItems = [];
        }
    }

    function addCondenseButton() {
        const mailboxContainer = document.querySelector('.list-block-search');

        if (!mailboxContainer || document.getElementById('condense-mailbox-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'condense-mailbox-btn';
        updateButtonText(button);
        button.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            margin: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        button.addEventListener('click', toggleMailboxCondensation);
        button.addEventListener('mouseover', () => {
            button.style.background = '#1976D2';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = '#2196F3';
        });

        mailboxContainer.insertBefore(button, mailboxContainer.firstChild);
    }

    function updateButtonText(button) {
        button.textContent = isCondensed ? 'Expand Mailbox' : 'Condense Mailbox';
    }

    function toggleMailboxCondensation() {
        const button = document.getElementById('condense-mailbox-btn');

        if (isCondensed) {
            uncondenseMailbox();
        } else {
            condenseMailbox();
        }

        updateButtonText(button);
    }

    function condenseMailbox() {
        const mailboxList = document.querySelector('.list-block-search > ul');
        if (!mailboxList) return;

        const items = Array.from(mailboxList.querySelectorAll('li'));
        if (items.length === 0) return;

        // Store original items for uncondensing
        originalItems = items.map(item => item.cloneNode(true));

        let condensedGroups = [];
        let currentGroup = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemData = extractItemData(item);

            if (!itemData) {
                // If we can't parse this item, finalize current group and start fresh
                if (currentGroup.length > 0) {
                    condensedGroups.push([...currentGroup]);
                    currentGroup = [];
                }
                condensedGroups.push([item]);
                continue;
            }

            // Check if this item can be grouped with the current group
            if (currentGroup.length === 0) {
                // Start a new group
                currentGroup = [{ element: item, data: itemData }];
            } else {
                const lastItemData = currentGroup[currentGroup.length - 1].data;

                if (canGroup(lastItemData, itemData)) {
                    // Add to current group
                    currentGroup.push({ element: item, data: itemData });
                } else {
                    // Finalize current group and start new one
                    condensedGroups.push([...currentGroup]);
                    currentGroup = [{ element: item, data: itemData }];
                }
            }
        }

        // Don't forget the last group
        if (currentGroup.length > 0) {
            condensedGroups.push(currentGroup);
        }

        // Now process the groups and condense where applicable
        processGroups(condensedGroups, mailboxList);
        isCondensed = true;
    }

    function uncondenseMailbox() {
        const mailboxList = document.querySelector('.list-block-search > ul');
        if (!mailboxList || originalItems.length === 0) return;

        // Clear the mailbox
        mailboxList.innerHTML = '';

        // Restore original items
        originalItems.forEach(item => {
            mailboxList.appendChild(item.cloneNode(true));
        });

        isCondensed = false;
    }

    function extractItemData(item) {
        try {
            const titleElement = item.querySelector('.item-title');
            const afterElement = item.querySelector('.item-after');

            if (!titleElement || !afterElement) return null;

            const titleText = titleElement.textContent.trim();
            const afterText = afterElement.textContent.trim();

            // Extract sender and recipient from title (format: "Sender to Recipient")
            const titleMatch = titleText.match(/^(.+?)\s+to\s+(.+?)(?:\s|$)/);
            if (!titleMatch) return null;

            const sender = titleMatch[1].trim();
            const recipient = titleMatch[2].trim();

            // Extract item info from after element
            const itemMatch = afterText.match(/(.+?)\s+x(\d+)$/);
            if (!itemMatch) return null;

            const itemName = itemMatch[1].trim();
            const quantity = parseInt(itemMatch[2]);

            // Extract timestamp
            const timeMatch = titleText.match(/(\w{3}\s+\d+,\s+\d{2}:\d{2}:\d{2}\s+\w{2})/);
            const timestamp = timeMatch ? timeMatch[1] : '';

            return {
                sender,
                recipient,
                itemName,
                quantity,
                timestamp
            };
        } catch (e) {
            console.error('Error extracting item data:', e);
            return null;
        }
    }

    function canGroup(item1, item2) {
        return item1.sender === item2.sender &&
               item1.recipient === item2.recipient &&
               item1.itemName === item2.itemName;
    }

    function processGroups(groups, mailboxList) {
        // Clear the mailbox
        mailboxList.innerHTML = '';

        groups.forEach(group => {
            if (group.length === 1) {
                // Single item, just add it back
                const item = group[0].element || group[0];
                mailboxList.appendChild(item);
            } else if (group.length > 1 && group[0].data) {
                // Multiple items that can be condensed
                const condensedItem = createCondensedItem(group);
                mailboxList.appendChild(condensedItem);
            } else {
                // Fallback: add all items individually
                group.forEach(item => {
                    const element = item.element || item;
                    mailboxList.appendChild(element);
                });
            }
        });
    }

    function createCondensedItem(group) {
        const firstItem = group[0];
        const totalQuantity = group.reduce((sum, item) => sum + item.data.quantity, 0);

        // Clone the first item as template
        const condensedLi = firstItem.element.cloneNode(true);

        // Add highlight styling for condensed items
        condensedLi.style.cssText = `
            background: linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%);
            border-left: 3px solid rgba(33, 150, 243, 0.3);
            transition: all 0.2s ease;
        `;

        // Enhanced hover effect
        condensedLi.addEventListener('mouseenter', () => {
            condensedLi.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(33, 150, 243, 0.06) 100%)';
            condensedLi.style.borderLeftColor = 'rgba(33, 150, 243, 0.5)';
        });

        condensedLi.addEventListener('mouseleave', () => {
            condensedLi.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%)';
            condensedLi.style.borderLeftColor = 'rgba(33, 150, 243, 0.3)';
        });

        // Update the quantity in the condensed item
        const afterElement = condensedLi.querySelector('.item-after');
        if (afterElement) {
            const afterText = afterElement.innerHTML;
            const updatedAfterText = afterText.replace(/x\d+/, `x${totalQuantity}`);
            afterElement.innerHTML = updatedAfterText;
        }

        // Add a visual indicator that this is condensed
        const titleElement = condensedLi.querySelector('.item-title');
        if (titleElement && group.length > 1) {
            const span = titleElement.querySelector('span');
            if (span) {
                span.innerHTML += ` <span style="color: #2196F3; font-size: 10px; font-weight: bold;">(${group.length} messages)</span>`;
            }
        }

        // Add hover tooltip showing breakdown
        condensedLi.title = `Condensed from ${group.length} messages:\n` +
                           group.map(item => `${item.data.timestamp}: ${item.data.itemName} x${item.data.quantity}`).join('\n');

        return condensedLi;
    }
    // Run initial check
    checkForMailboxPage();

    // Set up observers to detect URL changes and DOM changes
    // For SPA (Single Page Application) navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Reset state when URL changes
            isCondensed = false;
            originalItems = [];
            checkForMailboxPage();
        }
    }).observe(document, {subtree: true, childList: true});

    // Check periodically as fallback
    setInterval(checkForMailboxPage, 2000);
})();