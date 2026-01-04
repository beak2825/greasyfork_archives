// ==UserScript==
// @name         Claude Interface Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  It tries to Enhanced Claude Interface 
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524454/Claude%20Interface%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/524454/Claude%20Interface%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDeleteButton() {
        // Check if button already exists
        if (document.getElementById('custom-delete-btn')) return;

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.id = 'custom-delete-btn';
        deleteBtn.textContent = 'DELETE';
        deleteBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 100px;
            background-color: #ff0000;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            z-index: 999999;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        // Click event with updated selectors
        deleteBtn.addEventListener('click', function() {
            // Find and click the new chat button to start fresh
            const newChatButton = document.querySelector('a[href="/new"]');
            if (newChatButton) {
                newChatButton.click();
            }

            // Alternative approach: clear the main content area
            const mainContent = document.querySelector('main');
            if (mainContent) {
                const conversationArea = mainContent.querySelector('.mx-auto.w-full.max-w-2xl');
                if (conversationArea) {
                    conversationArea.innerHTML = '';
                }
            }

            // Attempt to clear input area
            const inputArea = document.querySelector('.flex.flex-col.bg-bg-000');
            if (inputArea) {
                inputArea.innerHTML = '';
            }

            // Force refresh the page
            window.location.href = 'https://claude.ai/new';
        });

        // Add button to page
        document.body.appendChild(deleteBtn);
    }

    // Wait for page to load
    window.addEventListener('load', function() {
        // Initial attempt
        addDeleteButton();

        // Retry a few times to ensure button is added
        let attempts = 0;
        const maxAttempts = 5;
        const interval = setInterval(function() {
            if (!document.getElementById('custom-delete-btn') && attempts < maxAttempts) {
                addDeleteButton();
                attempts++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    });
})();
