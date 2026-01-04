// ==UserScript==
// @name         Elethor Item Trawler
// @namespace    http://tampermonkey.net/
// @version      1.8
// @author       Eugene
// @description  Change item URLs on Elethor.com with auto-increment feature and auto copy functionality
// @match        https://elethor.com/game/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/518684/Elethor%20Item%20Trawler.user.js
// @updateURL https://update.greasyfork.org/scripts/518684/Elethor%20Item%20Trawler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the item number from localStorage or initialize it
    let itemNumber = parseInt(localStorage.getItem('itemNumber')) || 1;
    let autoIncrementInterval;
    let autoIncrementDuration = parseInt(localStorage.getItem('autoIncrementDuration')) || 1000; // Default duration in milliseconds
    let isAutoIncrementActive = JSON.parse(localStorage.getItem('isAutoIncrementActive')) || false; // Auto-increment state
    let isAutoCopyActive = JSON.parse(localStorage.getItem('isAutoCopyActive')) || false; // Auto-copy state

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.backgroundColor = '#f9f9f9';
    buttonContainer.style.border = '1px solid #ccc';
    buttonContainer.style.borderRadius = '5px';
    buttonContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    buttonContainer.style.display = 'none'; // Initially hidden

    // Create buttons and inputs
    const incrementButton = createButton('+', '#4CAF50', incrementItem);
    const resetButton = createButton('🔄', '#f44336', resetItem);
    const numberInput = createNumberInput(itemNumber);
    const loadButton = createButton('➡️', '#2196F3', loadItem);
    const durationInput = createNumberInput(autoIncrementDuration, '80px');
    const autoIncrementButton = createButton(isAutoIncrementActive ? 'Stop Auto Increment' : 'Auto Increment', '#FF9800', toggleAutoIncrement);

    // Create the auto copy button
    const autoCopyButton = createButton(isAutoCopyActive ? 'Stop Auto Copy' : 'Auto Copy', '#FF9800', toggleAutoCopy);

    // Create the copy button
    const copyButton = createButton('Copy Text', '#2196F3', copyTextToClipboard);

    // Function to create a button
    function createButton(text, color, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.padding = '10px';
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '20px'; // Increase font size for better visibility
        button.addEventListener('click', onClick);
        return button;
    }

    // Function to create a number input
    function createNumberInput(initialValue, width = '60px') {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = initialValue; // Set the initial value
        input.style.width = width;
        input.style.marginRight = '5px';
        input.style.padding = '5px';
        input.style.fontSize = '16px';
        return input;
    }

    // Function to update the URL
    function updateUrl() {
        const newUrl = `https://elethor.com/game/inventory/item/${itemNumber}`;
        window.location.href = newUrl;
    }

    // Increment button click event
    function incrementItem() {
        itemNumber++; // Increment the number
        localStorage.setItem('itemNumber', itemNumber); // Store the updated number in localStorage
        numberInput.value = itemNumber; // Update input field
        updateUrl(); // Change the URL
    }

    // Reset button click event
    function resetItem() {
        itemNumber = 1; // Reset the number to 1
        localStorage.setItem('itemNumber', itemNumber); // Store the reset number in localStorage
        numberInput.value = itemNumber; // Update input field
        updateUrl(); // Change the URL
    }

    // Load button click event
    function loadItem() {
        const inputValue = parseInt(numberInput.value);
        if (!isNaN(inputValue) && inputValue > 0) {
            itemNumber = inputValue; // Set item number to the input value
            localStorage.setItem('itemNumber', itemNumber); // Store the updated number in localStorage
            updateUrl(); // Change the URL
        }
    }

    // Auto-increment button click event
    function toggleAutoIncrement() {
        if (autoIncrementInterval) {
            clearInterval(autoIncrementInterval); // Stop auto-increment if already running
            autoIncrementInterval = null; // Reset interval
            isAutoIncrementActive = false; // Update state
            autoIncrementButton.innerHTML = 'Auto Increment'; // Reset button text
        } else {
            autoIncrementDuration = parseInt(durationInput.value) || 1000; // Get duration from input
            if (autoIncrementDuration <= 0) {
                alert('Please enter a positive duration for auto-increment.');
                return;
            }
            autoIncrementInterval = setInterval(() => {
                itemNumber++; // Increment the number
                localStorage.setItem('itemNumber', itemNumber); // Store the updated number in localStorage
                numberInput.value = itemNumber; // Update input field
                updateUrl(); // Change the URL
            }, autoIncrementDuration);
            isAutoIncrementActive = true; // Update state
            autoIncrementButton.innerHTML = 'Stop Auto Increment'; // Change button text
        }
        localStorage.setItem('isAutoIncrementActive', JSON.stringify(isAutoIncrementActive)); // Save state
    }

    // Auto-copy button click event
    function toggleAutoCopy() {
        isAutoCopyActive = !isAutoCopyActive; // Toggle the state
        localStorage.setItem('isAutoCopyActive', JSON.stringify(isAutoCopyActive)); // Save state
        autoCopyButton.innerHTML = isAutoCopyActive ? 'Stop Auto Copy' : 'Auto Copy'; // Update button text

        if (isAutoCopyActive) {
            // Set up a listener for URL changes
            const originalUrl = window.location.href;
            const observer = new MutationObserver(() => {
                if (window.location.href !== originalUrl) {
                    copyOnscreenText(); // Copy text when URL changes
                    originalUrl = window.location.href; // Update the original URL
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Function to copy onscreen text to localStorage
    function copyOnscreenText() {
        const onscreenText = document.body.innerText; // Get all onscreen text
        localStorage.setItem('onscreenText', onscreenText); // Store it in localStorage
    }

    // Copy text to clipboard
    function copyTextToClipboard() {
        const onscreenText = localStorage.getItem('onscreenText') || ''; // Retrieve text from localStorage
        navigator.clipboard.writeText(onscreenText).then(() => {
            alert('Text copied to clipboard!'); // Notify user
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Append elements to the container
    buttonContainer.appendChild(incrementButton);
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(numberInput);
    buttonContainer.appendChild(loadButton);
    buttonContainer.appendChild(durationInput);
    buttonContainer.appendChild(autoIncrementButton);
    buttonContainer.appendChild(autoCopyButton);
    buttonContainer.appendChild(copyButton);

    // Append the container to the body
    document.body.appendChild(buttonContainer);

    // Function to position the button container
    function positionButtonContainer() {
        const targetElement = document.querySelector('.navbar-item.game-title.is-skewed');
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            buttonContainer.style.left = `${rect.left - 50}px`;
            buttonContainer.style.top = `${rect.top}px`;
            buttonContainer.style.display = 'block'; // Show the button container
        } else {
            // Fallback positioning logic if the target element is not found
            buttonContainer.style.left = '10px'; // Default left position
            buttonContainer.style.top = 'calc(100vh - 500px)'; // 500px above the bottom of the viewport
            buttonContainer.style.display = 'block'; // Show the button container
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        const targetElement = document.querySelector('.navbar-item.game-title.is-skewed');
        if (targetElement) {
            positionButtonContainer(); // Position the button container
            observer.disconnect(); // Stop observing once the element is found
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial positioning attempt
    positionButtonContainer(); // Attempt to position the button container on script load

    // Make the button container draggable
    let isDragging = false;
    let offsetX, offsetY;

    buttonContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - buttonContainer.getBoundingClientRect().left;
        offsetY = e.clientY - buttonContainer.getBoundingClientRect().top;
        document.body.style.cursor = 'move'; // Change cursor to indicate dragging
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            buttonContainer.style.left = `${e.clientX - offsetX}px`;
            buttonContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default'; // Reset cursor when not dragging
        // Save the position in localStorage
        localStorage.setItem('buttonContainerPosition', JSON.stringify({
            left: buttonContainer.style.left,
            top: buttonContainer.style.top
        }));
    });

    // Load saved position from localStorage
    const savedPosition = JSON.parse(localStorage.getItem('buttonContainerPosition'));
    if (savedPosition) {
        buttonContainer.style.left = savedPosition.left;
        buttonContainer.style.top = savedPosition.top;
    }

    // Restore auto-increment and auto-copy states on load
    if (isAutoIncrementActive) {
        autoIncrementButton.click(); // Start auto-increment if it was active
    }
    if (isAutoCopyActive) {
        autoCopyButton.click(); // Start auto-copy if it was active
    }
})();