// ==UserScript==
// @name         Remove Prime Video Watch History
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a floating interface to remove all or a specified number of items from your Prime Video watch history.
// @author       whmcfg
// @match        https://www.primevideo.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523790/Remove%20Prime%20Video%20Watch%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/523790/Remove%20Prime%20Video%20Watch%20History.meta.js
// ==/UserScript==

// Immediately Invoked Function Expression (IIFE) to create an isolated scope for the script
(function() {
    'use strict';

    // Function to create the user interface (UI) for the remove history feature
    function createUI() {
        // Check if the UI is already created, if so, prevent creating it again
        if (document.querySelector('#removeHistoryContainer')) return;

        // Create a container to hold the UI elements
        const container = document.createElement('div');
        container.id = 'removeHistoryContainer';
        // Apply some styles to position the UI container on the screen
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#f9f9f9';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        container.style.zIndex = '1000';
        container.style.width = '260px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.textAlign = 'center';

        // Title of the UI section
        const title = document.createElement('h3');
        title.innerText = 'Remove History';
        title.style.marginBottom = '10px';
        title.style.fontSize = '16px';
        container.appendChild(title);

        // Row for selecting removal method (complete or partial)
        const methodRow = document.createElement('div');
        methodRow.style.marginBottom = '10px';
        container.appendChild(methodRow);

        // Radio button for "Complete" removal option
        const completeOption = document.createElement('input');
        completeOption.type = 'radio';
        completeOption.name = 'removeOption';
        completeOption.value = 'complete';
        completeOption.checked = true; // Default to complete removal
        completeOption.style.marginRight = '5px';
        methodRow.appendChild(completeOption);
        methodRow.appendChild(document.createTextNode('Complete'));

        // Radio button for "Partial" removal option
        const partialOption = document.createElement('input');
        partialOption.type = 'radio';
        partialOption.name = 'removeOption';
        partialOption.value = 'partial';
        partialOption.style.marginLeft = '20px';
        partialOption.style.marginRight = '5px';
        methodRow.appendChild(partialOption);
        methodRow.appendChild(document.createTextNode('Partial'));
        // When partial option is clicked, focus the input field
        partialOption.addEventListener('click', () => {
            partialInput.focus();
        });

        // Row for partial input (how many items to remove)
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.justifyContent = 'center';
        inputRow.style.alignItems = 'center';
        inputRow.style.marginBottom = '10px';
        inputRow.style.marginLeft = '5px';
        inputRow.style.marginRight = '5px';
        container.appendChild(inputRow);

        // Label for the partial input field
        const partialInputLabel = document.createElement('label');
        partialInputLabel.innerText = 'Last ';
        partialInputLabel.style.fontWeight = 'normal';
        inputRow.appendChild(partialInputLabel);

        // Input field to specify the number of items to remove for partial removal
        const partialInput = document.createElement('input');
        partialInput.type = 'number';
        partialInput.min = '1';
        partialInput.value = '';
        partialInput.style.width = '45px';
        partialInput.style.height = '25px';
        partialInput.style.textAlign = 'center';
        partialInput.style.fontSize = '14px';
        partialInput.style.padding = '2px';
        partialInput.style.marginLeft = '3px';
        partialInput.style.marginRight = '3px';
        partialInput.addEventListener('focus', () => {
            partialOption.checked = true;
        });
        inputRow.appendChild(partialInput);

        // Text node to show "item(s)" after the input
        const itemText = document.createTextNode(' item(s)');
        inputRow.appendChild(itemText);

        // Row for the action button
        const buttonRow = document.createElement('div');
        container.appendChild(buttonRow);

        // Start button to trigger the removal process
        const startButton = document.createElement('button');
        startButton.innerText = 'Start';
        startButton.style.marginTop = '10px';
        startButton.style.padding = '10px 20px';
        startButton.style.backgroundColor = '#007BFF';
        startButton.style.color = '#fff';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        buttonRow.appendChild(startButton);

        // Append the container to the body of the document
        document.body.appendChild(container);

        // Event listener for the start button
        startButton.addEventListener('click', function () {
            startButton.disabled = true; // Disable the button during processing
            startButton.innerText = 'Processing...'; // Change button text to indicate processing

            const isComplete = completeOption.checked; // Determine if complete or partial removal is selected
            const numberOfItems = parseInt(partialInput.value, 0); // Get the number of items for partial removal
            removeAllWatchHistory(isComplete, numberOfItems, startButton); // Call the function to start the removal process
        });
    }

    // Function to remove watch history items
    function removeAllWatchHistory(complete, numberOfItems, startButton) {
        let lastHeight = 0; // Track the last height of the page for scrolling

        // Recursive function to click on the remove buttons and scroll down
        function clickAndScroll() {
            // Select all remove buttons on the page
            const removeButtons = document.querySelectorAll('button.SPqQmU._3RF4FN._1D7HW3._2G6lpB.pU0yt1');
            // Select the items to remove based on the method selected (complete or partial)
            const itemsToRemove = complete ? removeButtons : Array.from(removeButtons).slice(0, numberOfItems);

            // If there are no items to remove, or if partial removal is selected and there aren't enough items, scroll and retry
            if (itemsToRemove.length === 0 || (!complete && itemsToRemove.length < numberOfItems)) {
                window.scrollBy(0, document.body.scrollHeight); // Scroll down the page
                let newHeight = document.body.scrollHeight; // Get the new height of the page
                if (newHeight > lastHeight) {
                    lastHeight = newHeight;
                    setTimeout(clickAndScroll, 2000); // Retry after 2 seconds
                } else {
                    resetButton(startButton, 'Done!'); // If all items are removed, reset the button
                }
                return;
            }

            // Click each remove button to remove the item from history
            itemsToRemove.forEach((button, index) => {
                setTimeout(() => {
                    button.click(); // Click the button to remove the item
                    console.log(`Removed item ${index + 1} of ${itemsToRemove.length}`); // Log the action
                }, index * 100); // Stagger the clicks slightly
            });

            // Scroll down and repeat if necessary
            setTimeout(() => {
                if (complete || (numberOfItems > itemsToRemove.length)) {
                    window.scrollBy(0, document.body.scrollHeight);
                    let newHeight = document.body.scrollHeight;
                    if (newHeight > lastHeight) {
                        lastHeight = newHeight;
                        setTimeout(clickAndScroll, 2000); // Retry after 2 seconds
                    } else {
                        resetButton(startButton, 'Done!'); // If all items are removed, reset the button
                    }
                } else {
                    resetButton(startButton, 'Done!'); // Reset the button when done
                }
            }, itemsToRemove.length * 100 + 500);
        }

        clickAndScroll(); // Start the process
    }

    // Function to reset the button text after the removal is complete
    function resetButton(button, text) {
        button.disabled = false; // Enable the button
        button.innerText = text; // Change the button text to indicate completion
        setTimeout(() => {
            button.innerText = 'Start'; // Reset the button text after 2 seconds
        }, 2000);
    }

    // Function to check if the current page is the history page
    function checkForHistoryPage() {
        const urlIncludesHistory = window.location.href.includes('history'); // Check if the URL contains 'history'
        if (urlIncludesHistory) {
            createUI(); // Create the UI if on the history page
        } else {
            const container = document.querySelector('#removeHistoryContainer');
            if (container) {
                container.remove(); // Remove the UI if not on the history page
            }
        }
    }

    checkForHistoryPage(); // Initial check for the history page

    // Create an observer to detect URL changes (in case the user navigates to the history page)
    const urlObserver = new MutationObserver(checkForHistoryPage);
    urlObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
})();
