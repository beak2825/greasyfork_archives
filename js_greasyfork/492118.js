// ==UserScript==
// @name         Krisp Message Deletion Helper Limited Runs
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Automate deletion of messages in Krisp with a limited number of attempts
// @author       Isaiah
// @match        https://app.krisp.ai/meeting-notes?page=24 <<< Change to the URL Page 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492118/Krisp%20Message%20Deletion%20Helper%20Limited%20Runs.user.js
// @updateURL https://update.greasyfork.org/scripts/492118/Krisp%20Message%20Deletion%20Helper%20Limited%20Runs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector for the primary delete button identified by its data-test-id attribute
    const selector = '[data-test-id="DeleteBtn"]';
    // Counter for attempts to find and click the primary delete button
    let primaryDeleteAttempts = 0;
    // Maximum number of attempts to find and click the primary delete button
    const maxPrimaryDeleteAttempts = 20;
    // Counter for the total number of deletion cycles initiated
    let totalDeletionAttempts = 0;
    // Maximum total number of deletion cycles to attempt <<< Change the amount, default is 1
    const maxTotalDeletionAttempts = 1;

    // Function to check if an element is visible on the page
    function isVisible(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }

    // Function to find and click the primary delete button
    function findAndClickDeleteButton() {
        // Stop if the maximum total deletion attempts have been reached
        if (totalDeletionAttempts >= maxTotalDeletionAttempts) {
            console.log('Reached the max total deletion attempts. Stopping.');
            return;
        }
        
        // Try to find the primary delete button using the selector
        const button = document.querySelector(selector);
        // Check if the button is found and visible
        if (button && isVisible(button)) {
            // Create and dispatch a click event to simulate a user click
            const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            button.dispatchEvent(clickEvent);
            console.log('Clicked the primary delete button.');

            // Wait for the confirmation modal to appear and then try to click the confirm delete button
            setTimeout(tryClickConfirmDeleteButton, 1000);
            // Increment the total deletion attempts after a successful click
            totalDeletionAttempts++;
        } else if (primaryDeleteAttempts < maxPrimaryDeleteAttempts) {
            // If the button is not found or not visible, retry after a short delay
            console.log('Primary delete button not found or not visible yet, retrying...');
            setTimeout(findAndClickDeleteButton, 1000);
            primaryDeleteAttempts++;
        } else {
            // If the maximum number of attempts to find and click the primary button is reached, stop retrying
            console.log('Max attempts reached for the primary delete button. Stopping.');
        }
    }

    // Function to find and click the confirmation delete button by its text content
    function tryClickConfirmDeleteButton() {
        // Find all buttons and filter for the one with text content "Delete"
        const buttons = document.querySelectorAll('button');
        const deleteButton = Array.from(buttons).find(btn => btn.textContent.trim() === "Delete");
        if (deleteButton) {
            // If the confirmation delete button is found, click it
            console.log('Confirmation delete button found, attempting to click...');
            deleteButton.click();

            // Schedule the next deletion attempt after a delay, ensuring the current process completes
            setTimeout(findAndClickDeleteButton, 2000);
        } else {
            // If the confirmation delete button is not found, log a message
            console.log('Confirmation delete button not found.');
        }
    }

    // Start the deletion process
    findAndClickDeleteButton();
})();
