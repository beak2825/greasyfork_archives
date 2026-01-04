// ==UserScript==
// @name         APAttack
// @namespace    cartelempire.online
// @version      2025-02-02.1
// @description  AP Attack script, specifically made for AP
// @author       GELIN - 3779
// @match        https://cartelempire.online/Connections?*
// @match        https://cartelempire.online/cartel*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @license      Mozilla Public License 2.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525679/APAttack.user.js
// @updateURL https://update.greasyfork.org/scripts/525679/APAttack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Script initialized');

    // Single MutationObserver instance
    const observer = new MutationObserver((mutations) => {
        let addedNodes = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                addedNodes = true;
                break;
            }
        }

        if (addedNodes) {
            console.log('🔄 New elements detected, updating buttons...');
            updateButtons();
        }
    });

    // Function to update buttons in both rows and align-middle sections
    function updateButtons() {
        observer.disconnect(); // Temporarily stop observing to prevent unnecessary triggers

        let buttonsAdded = false;

        buttonsAdded |= addButtons(document.querySelectorAll('.row.py-3.py-xl-2.g-2'));   // Rows
        buttonsAdded |= addButtons(document.querySelectorAll('.align-middle a[href*="/user/"]'), true);  // Align-middle elements

        if (buttonsAdded) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Function to add buttons (Attack & Hospitalize)
    function addButtons(elements, isAlignMiddle = false) {
        if (!elements.length) return false;

        let buttonsAdded = false;

        elements.forEach((el) => {
            const parent = isAlignMiddle ? el.closest('.align-middle') : el;
            if (!parent || parent.dataset.processed) return;

            const userId = extractUserId(parent);
            if (!userId) return;

            console.log(`🆕 Adding buttons for User ID: ${userId}`);

            // Ensure buttons exist
            if (!parent.querySelector('.attack-button')) {
                parent.appendChild(createButton('Attack', '#dc3545', 'attack-button', userId, 'AttackPlayer'));
                buttonsAdded = true;
            }
            if (!parent.querySelector('.hospitalize-button')) {
                parent.appendChild(createButton('Hospitalize', '#28a745', 'hospitalize-button', userId, 'Hospitalise'));
                buttonsAdded = true;
            }

            parent.dataset.processed = "true"; // Mark as processed
        });

        return buttonsAdded;
    }

    // Extract user ID from the element (checks for anchor tag inside)
    function extractUserId(element) {
        const userLink = element.querySelector('a[href*="/user/"]');
        if (!userLink) return null;

        const match = userLink.getAttribute('href').match(/\/user\/(\d+)/);
        return match ? match[1] : null;
    }

    // Function to create a button
    function createButton(text, color, className, userId, action) {
        const button = document.createElement('button');
        button.classList.add('header-button', className);
        button.textContent = text;
        button.style.cssText = `
            margin-left: 10px;
            padding: 5px 10px;
            background-color: ${color};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        button.dataset.userId = userId;
        button.dataset.action = action;
        return button;
    }

    // Event delegation for buttons (avoids individual listeners)
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.attack-button, .hospitalize-button');
        if (!button) return;

        const userId = button.dataset.userId;
        const action = button.dataset.action;

        if (userId && action) {
            console.log(`🚀 ${button.textContent} user ID: ${userId}`);
            createAndSubmitForm(`/User/${action}/${userId}`, button.textContent);
        }
    });

    // Create and submit a form dynamically
    function createAndSubmitForm(actionUrl, buttonText) {
        const form = document.createElement('form');
        form.classList.add('modalDismissBtn', 'w-100');
        form.action = actionUrl;
        form.method = 'POST';

        const submitButton = document.createElement('button');
        submitButton.classList.add('btn', 'btn-success', 'w-100');
        submitButton.type = 'submit';
        submitButton.textContent = buttonText;
        form.appendChild(submitButton);

        document.body.appendChild(form);
        console.log(`📨 Form submitted to: ${actionUrl}`);
        form.submit();
    }

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial execution on page load
    document.addEventListener('DOMContentLoaded', updateButtons);

})();