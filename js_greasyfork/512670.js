// ==UserScript==
// @name         Sum Numbers with $ Sign in Selected Text (Mobile)
// @namespace    http://tampermonkey.net/
// @version      1
// @author       Heart [3034011]
// @description  Store and sum all numbers with a $ sign in the selected text from different selections on a specific site. Adds formatted result with commas and in K, M, B format.
// @author       Heart [3034011]
// @match        https://arsonwarehouse.com/prices/heart
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512670/Sum%20Numbers%20with%20%24%20Sign%20in%20Selected%20Text%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512670/Sum%20Numbers%20with%20%24%20Sign%20in%20Selected%20Text%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedTexts = []; // Array to store selected texts
    const COPYRIGHT_MESSAGE = "<br><br><br>Created By Heart [3034011]"; // Copyright text with line break

    // Function to create and style the buttons
    function createButtons() {
        // Button to store selected text
        let storeButton = document.createElement('button');
        storeButton.textContent = 'Add to Sum';
        storeButton.style.position = 'fixed';
        storeButton.style.bottom = '60px';
        storeButton.style.right = '10px';
        storeButton.style.zIndex = 1000;
        storeButton.style.backgroundColor = '#28a745';
        storeButton.style.color = 'white';
        storeButton.style.border = 'none';
        storeButton.style.padding = '10px 20px';
        storeButton.style.borderRadius = '5px';
        storeButton.style.fontSize = '16px';
        storeButton.style.cursor = 'pointer';
        document.body.appendChild(storeButton);

        // Button to sum stored numbers
        let sumButton = document.createElement('button');
        sumButton.textContent = 'Calculate Total';
        sumButton.style.position = 'fixed';
        sumButton.style.bottom = '10px';
        sumButton.style.right = '10px';
        sumButton.style.zIndex = 1000;
        sumButton.style.backgroundColor = '#007BFF';
        sumButton.style.color = 'white';
        sumButton.style.border = 'none';
        sumButton.style.padding = '10px 20px';
        sumButton.style.borderRadius = '5px';
        sumButton.style.fontSize = '16px';
        sumButton.style.cursor = 'pointer';
        document.body.appendChild(sumButton);

        // Add click event listener to the store button
        storeButton.addEventListener('click', storeSelectedText);

        // Add click event listener to the sum button
        sumButton.addEventListener('click', sumStoredNumbers);
    }

    // Function to store selected text
    function storeSelectedText() {
        let selectedText = window.getSelection().toString();
        if (selectedText.trim() === "") {
            showCustomAlert("No text selected.");
            return;
        }
        selectedTexts.push(selectedText);
        showCustomAlert("Selected text stored!");
    }

    // Function to sum numbers with $ sign in the stored texts
    function sumStoredNumbers() {
        // Combine all stored selections into one string
        let combinedText = selectedTexts.join(' ');

        // Regular expression to match numbers with $ sign
        let numbers = combinedText.match(/\$\d+(,\d{3})*(\.\d+)?/g);

        // If there are no numbers, alert and return
        if (!numbers) {
            showCustomAlert("No numbers with $ sign found in the stored selections.");
            return;
        }

        // Sum the numbers
        let sum = numbers.reduce((total, num) => {
            // Remove $ sign and commas
            num = num.replace(/^\$/, '').replace(/,/g, '');
            return total + parseFloat(num);
        }, 0);

        // Format the result with commas
        let formattedSum = sum.toLocaleString();

        // Convert sum to K, M, B format
        let formattedShortSum = formatToShortNumber(sum);

        // Custom result message with copyright protection
        showCustomAlert("Total calculated sum: $" + formattedSum + " (" + formattedShortSum + ")");

        // Clear the stored texts after summing
        selectedTexts = [];
    }

    // Function to format the number into K, M, B format
    function formatToShortNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(2) + "B"; // Billions
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(2) + "M"; // Millions
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(2) + "K"; // Thousands
        } else {
            return num.toFixed(2); // Less than 1K, no formatting needed
        }
    }

    // Function to show a custom alert
    function showCustomAlert(message) {
        // Remove any existing modal if present
        let existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create the modal container
        let modal = document.createElement('div');
        modal.classList.add('custom-modal');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1001';

        // Create the modal content box
        let modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        modalContent.style.maxWidth = '500px';
        modalContent.style.textAlign = 'center';
        modalContent.style.fontFamily = 'Arial, sans-serif';

        // Create the title
        let modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Notification';
        modalTitle.style.marginTop = '0';
        modalTitle.style.color = '#007BFF';

        // Create the message text
        let modalMessage = document.createElement('p');
        modalMessage.innerHTML = message + COPYRIGHT_MESSAGE; // Use innerHTML to allow line breaks
        modalMessage.style.fontSize = '16px';
        modalMessage.style.color = '#333';

        // Create the close button
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = '#007BFF';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px 20px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '20px';

        // Add event listener to close the modal
        closeButton.addEventListener('click', function() {
            modal.remove();
        });

        // Append elements to modal content
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(closeButton);

        // Append the modal content to the modal container
        modal.appendChild(modalContent);

        // Append the modal to the body
        document.body.appendChild(modal);
    }

    // Check if the current URL matches the specified one and create the buttons if it does
    if (window.location.href === 'https://arsonwarehouse.com/prices/heart') {
        createButtons();
    }
})();
