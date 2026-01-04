// ==UserScript==
// @name         OSMCha Reversion List Helper (Space After ID Fix)
// @namespace    https://osmcha.org/
// @version      2.1
// @description  Adds a '+' icon to add/remove changesets from a reversion list and ensures space after each ID
// @match        https://osmcha.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509107/OSMCha%20Reversion%20List%20Helper%20%28Space%20After%20ID%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509107/OSMCha%20Reversion%20List%20Helper%20%28Space%20After%20ID%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let modal = null; // Keep track of the modal

    // Function to show a temporary notification
    function showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);

        // Automatically remove the notification after the specified duration
        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    // Function to toggle the symbol for a specific changeset
    function toggleIcon(changesetIdElem, isAdded) {
        let icon = changesetIdElem.querySelector('.toggle-revert-list');
        
        if (!icon) {
            // Create a new icon if it doesn't exist
            icon = document.createElement('span');
            icon.className = 'toggle-revert-list';
            icon.style.cursor = 'pointer';
            icon.style.marginLeft = '10px';
            changesetIdElem.appendChild(icon);
        }
        
        // Update icon based on whether it's added to the list
        icon.textContent = isAdded ? '➖' : '➕';

        // Update the click handler based on the current state (add or remove)
        icon.onclick = () => {
            if (isAdded) {
                removeFromRevertList(changesetIdElem.dataset.changesetId);
                toggleIcon(changesetIdElem, false); // Toggle to "+"
            } else {
                addToRevertList(changesetIdElem.dataset.changesetId);
                toggleIcon(changesetIdElem, true); // Toggle to "-"
            }
        };
    }

    // Function to add or update icons next to changesets
    function updateIcons() {
        const changesetElements = document.querySelectorAll("#root > div.grid > div.col.col--3-mxl.col--4-ml.bg-gray--faint.border-r.border--gray-light.border--1 > div > ul > div > div");

        // Retrieve the current revert list
        const revertList = JSON.parse(localStorage.getItem('revertList')) || [];

        changesetElements.forEach(elem => {
            // Get the changeset ID element
            const changesetIdElem = elem.querySelector("div > div > span > span:nth-child(1) > a > span");
            const changesetId = changesetIdElem ? changesetIdElem.textContent.trim() : null;

            if (!changesetId) return; // Skip if changeset ID is not found

            // Store the changeset ID as a data attribute for reference
            changesetIdElem.parentNode.dataset.changesetId = changesetId;

            // Determine if the changeset is already in the list
            const isAdded = revertList.includes(changesetId);

            // Add or update the '+'/'−' icon
            toggleIcon(changesetIdElem.parentNode, isAdded);
        });
    }

    // Function to add a changeset ID to localStorage
    function addToRevertList(changesetId) {
        let revertList = JSON.parse(localStorage.getItem('revertList')) || [];
        if (!revertList.includes(changesetId)) {
            revertList.push(changesetId);
            localStorage.setItem('revertList', JSON.stringify(revertList));
        }
    }

    // Function to remove a changeset ID from localStorage
    function removeFromRevertList(changesetId) {
        let revertList = JSON.parse(localStorage.getItem('revertList')) || [];
        revertList = revertList.filter(id => id !== changesetId);
        localStorage.setItem('revertList', JSON.stringify(revertList));
    }

    // Function to clear the revert list
    function clearRevertList() {
        localStorage.removeItem('revertList');
        updateIcons(); // Update icons after clearing the list
    }

    // Function to copy the revert list to clipboard
    function copyRevertListToClipboard() {
        const revertList = JSON.parse(localStorage.getItem('revertList')) || [];
        const listText = revertList.map(id => `${id} `).join('\n'); // Ensure a space after each ID and newline
        const textarea = document.createElement('textarea');
        textarea.value = listText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Revert list copied to clipboard'); // Show notification without confirmation
    }

    // Function to display or close the revert list in a modal
    function toggleRevertList() {
        if (modal) {
            // If the modal exists, remove it (close the modal)
            document.body.removeChild(modal);
            modal = null; // Set the modal to null so it can be opened again later
        } else {
            // Create the modal if it doesn't exist
            modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.padding = '20px';
            modal.style.backgroundColor = '#fff';
            modal.style.border = '1px solid #ccc';
            modal.style.zIndex = '10000';
            modal.style.width = '400px';

            let revertList = JSON.parse(localStorage.getItem('revertList')) || [];

            // Text area for displaying the list
            const textarea = document.createElement('textarea');
            textarea.value = revertList.map(id => `${id} `).join('\n'); // Add a space after each ID and newline
            textarea.rows = 10;
            textarea.cols = 50;
            textarea.style.width = '100%';
            textarea.style.height = '150px';

            // Copy button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Contents';
            copyButton.style.marginTop = '10px';
            copyButton.style.marginRight = '10px';
            copyButton.addEventListener('click', copyRevertListToClipboard);

            // Clear list button
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear List';
            clearButton.style.marginTop = '10px';
            clearButton.style.marginRight = '10px';
            clearButton.addEventListener('click', () => {
                clearRevertList();
                textarea.value = ''; // Clear textarea after clearing the list
            });

            // Close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.marginTop = '10px';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
                modal = null; // Set modal to null when manually closed
            });

            modal.appendChild(textarea);
            modal.appendChild(copyButton);
            modal.appendChild(clearButton);
            modal.appendChild(closeButton);
            document.body.appendChild(modal);
        }
    }

    // Add a button to view the revert list in the header
    function addViewListButton() {
        const header = document.querySelector("#root > div.grid > div.col.col--9-mxl.col--8-ml.col--12-mm > span > nav");
        if (header && !document.querySelector('#view-revert-list')) {
            const viewListBtn = document.createElement('button');
            viewListBtn.id = 'view-revert-list';
            viewListBtn.textContent = 'View Revert List';
            viewListBtn.style.marginLeft = '10px';

            viewListBtn.addEventListener('click', toggleRevertList);

            header.appendChild(viewListBtn);
        }
    }

    // Initial execution
    function init() {
        updateIcons(); // Initial load of icons
        addViewListButton(); // Add the view list button

        // Observe DOM changes with a debounced function
        const observer = new MutationObserver(updateIcons);
        const changesetContainer = document.querySelector("#root > div.grid > div.col.col--3-mxl.col--4-ml.bg-gray--faint.border-r.border--gray-light.border--1 > div > ul");

        if (changesetContainer) {
            observer.observe(changesetContainer, { childList: true, subtree: true });
        }
    }

    // Keep track of navigation changes and apply icon updates
    const navigationObserver = new MutationObserver(() => {
        updateIcons();
    });

    navigationObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Run the script
    init();

})();
