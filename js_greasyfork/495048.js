// ==UserScript==
// @name Delete Thread
// @namespace http://tampermonkey.net/
// @version 0.1.3
// @description Delete thread on Perplexity by pressing the Delete key and confirming with Enter
// @author JJJ
// @match https://www.perplexity.ai/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495048/Delete%20Thread.user.js
// @updateURL https://update.greasyfork.org/scripts/495048/Delete%20Thread.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Listen for keydown events
    document.addEventListener('keydown', function (event) {
        // If the Delete key is pressed, open the menu and trigger the delete thread action
        if (event.key === 'Delete') {
            openMenuAndDeleteThread();
        }
        // If the Enter key is pressed, confirm the deletion
        else if (event.key === 'Enter') {
            confirmDeletion();
        }
        // If the ESC key is pressed, cancel the deletion
        else if (event.key === 'Escape') {
            cancelDeletion();
        }
    });

    // Function to open the menu and trigger the delete thread action
    function openMenuAndDeleteThread() {
        var ellipsisButton = document.querySelector('[data-testid="thread-dropdown-menu"]');
        if (ellipsisButton) {
            ellipsisButton.click();
            setTimeout(deleteThread, 10); // Wait for a short time before triggering the delete thread action
        } else {
            console.log('Dropdown menu button not found');
        }
    }

    // Function to trigger the delete thread action
    function deleteThread() {
        var deleteButton = document.querySelector('[data-testid="thread-delete"]');
        if (deleteButton) {
            deleteButton.click();
            console.log('Thread deletion triggered');
        } else {
            var deleteButtonText = Array.from(document.querySelectorAll('span')).find(button => button.textContent === 'Delete');
            if (deleteButtonText) {
                deleteButtonText.click();
                console.log('Thread deletion triggered via text content');
            } else {
                console.log('Delete button not found');
            }
        }
    }

    // Function to confirm the deletion
    function confirmDeletion() {
        // Prefer new data-testid selector
        var confirmButton = document.querySelector('[data-testid="thread-delete-confirm"]');
        if (!confirmButton) {
            // Fallback to old class-based selector
            confirmButton = document.querySelector('.bg-superAlt.text-white');
        }
        if (confirmButton) {
            confirmButton.click();
            console.log('Confirm triggered');
        } else {
            console.log('Confirm button not found');
        }
    }

    // Function to cancel the deletion
    function cancelDeletion() {
        // Prefer new data-testid selector
        var nevermindButton = document.querySelector('[data-testid="thread-delete-nevermind"]');
        if (!nevermindButton) {
            // Fallback to button with text content
            nevermindButton = Array.from(document.querySelectorAll('button')).find(
                button => button.textContent.trim() === 'Nevermind'
            );
        }
        if (!nevermindButton) {
            // Fallback to close button with data-testid
            nevermindButton = document.querySelector('[data-testid="close-modal"]');
        }
        if (!nevermindButton) {
            // Fallback to previous class-based selector as last resort
            nevermindButton = document.querySelector('button.bg-offsetPlus.dark\\:bg-offsetPlusDark.text-textMain.dark\\:text-textMainDark');
        }
        if (nevermindButton) {
            nevermindButton.click();
            console.log('Deletion canceled successfully');
        } else {
            console.log('Cancel button not found');
        }
    }
})();