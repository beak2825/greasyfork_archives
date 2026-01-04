// ==UserScript==
// @name        SM_VM_FINAL
// @namespace   Violentmonkey Scripts
// @match       https://sma.sefapps.in/Citizen/MonitoringVehicle*
// @grant       none
// @author      BRUTAL RAVNYX
// @icon         https://i.postimg.cc/vH03MKxm/RAVNYX-1024-X1024-removebg-preview-1.png
// @version     1.5
// @description Automates repetitive tasks on the SMA site, ensuring accuracy and handling missing pop-ups.
// @downloadURL https://update.greasyfork.org/scripts/534704/SM_VM_FINAL.user.js
// @updateURL https://update.greasyfork.org/scripts/534704/SM_VM_FINAL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentNumber = 1781031; // Starting 7-digit number palus 1603700    kadegaon 5828229    islampur 5714930

    // Save the current number to localStorage to persist across refreshes
    function saveCurrentNumber() {
        localStorage.setItem('currentNumber', currentNumber);
        console.log(`Saved current number: ${currentNumber}`);
    }

    // Load the current number from localStorage
    function loadCurrentNumber() {
        const savedNumber = localStorage.getItem('currentNumber');
        if (savedNumber) {
            currentNumber = parseInt(savedNumber, 10);
            console.log(`Loaded current number: ${currentNumber}`);
        } else {
            console.log('No saved number found, starting fresh.');
        }
    }

    async function waitForElement(selector, timeout = 3000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before checking again
        }
        return null;
    }

    async function automateEntry() {
        // Step 1: Enter the 7-digit number
        const numberInput = await waitForElement('#searchName1', 1500);
        if (numberInput) {
            numberInput.value = currentNumber;
            console.log(`Entered number: ${currentNumber}`);
            currentNumber++;
            saveCurrentNumber();
        } else {
            console.error('Number input field not found!');
            return;
        }

        // Step 2: Click the Search button
        const searchButton = await waitForElement('#btnSearchDetails', 2000);
        if (searchButton) {
            searchButton.click();
            console.log('Search button clicked!');
        } else {
            console.error('Search button not found!');
            return;
        }

        // Wait for the first popup or refresh if it doesn't appear
        const viewButton = await waitForElement('.btn-outline-success', 1000);
        if (viewButton) {
            viewButton.click();
            console.log('View button clicked!');
        } else {
            console.log('No pop-up appeared, refreshing and moving to the next number...');
            location.reload();
            return;
        }

        // Step 3: Wait for the second popup and select the third option
        const thirdOption = await waitForElement('input[value="Do Not Segregate"]', 3000);
        if (thirdOption) {
            thirdOption.checked = true;
            console.log('Third option selected: Do Not Segregate');
        } else {
            console.error('Third option not found or not selectable! Refreshing...');
            location.reload();
            return;
        }

        // Step 4: Click the Save button
        const saveButton = await waitForElement('#submitButton', 2000);
        if (saveButton) {
            saveButton.click();
            console.log('Save button clicked!');
        } else {
            console.error('Save button not found! Refreshing...');
            location.reload();
            return;
        }

        // Step 5: Close both pop-ups
        const closeButtons = document.querySelectorAll('#exitbtn');
        if (closeButtons.length > 0) {
            closeButtons.forEach((btn) => {
                btn.click();
                console.log('Popup closed!');
            });
        } else {
            console.error('Close buttons not found!');
        }

        // Wait for the page to reload fully before starting the next entry
        setTimeout(() => {
            const pageLoadedElement = document.querySelector('#searchName1');
            if (pageLoadedElement) {
                console.log('Page fully loaded, starting next entry...');
                automateEntry();
            } else {
                console.error('Page did not load correctly, refreshing...');
                location.reload();
            }
        }, 1000);
    }

    // Load the current number on page load
    window.addEventListener('load', () => {
        loadCurrentNumber();
        automateEntry();
    });
})();