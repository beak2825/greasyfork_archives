// ==UserScript==
// @name         Bind Delete Key to Delete in Rabbit Hole with multiple selection support
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.1
// @description  Binds the Delete key to trigger delete in rabbit hole journal backend. Multiple selection is made with ctrl key.
// @author       Rekt
// @match        *://hole.rabbit.tech/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511615/Bind%20Delete%20Key%20to%20Delete%20in%20Rabbit%20Hole%20with%20multiple%20selection%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/511615/Bind%20Delete%20Key%20to%20Delete%20in%20Rabbit%20Hole%20with%20multiple%20selection%20support.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let selectedItems = new Set();
    let accessToken = null;

    // Hook into fetch to capture access token
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        if (args[1] && args[1].body) {
            try {
                const body = JSON.parse(args[1].body);
                if (body.accessToken) {
                    accessToken = body.accessToken;
                }
            } catch (error) {
                console.error("Error parsing request body:", error);
            }
        }
        return response;
    };

    // Function to delete entries using HTTP deletion and remove placeholders
    async function deleteEntries(entryIds) {
        if (!accessToken) {
            console.error('Access token not available');
            return;
        }

        for (let entryId of entryIds) {
            try {
                const payload = { accessToken, entryId, deleteEntry: true };

                const response = await fetch('/apis/updateJournalEntry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Remove placeholder from the page
                const element = document.querySelector(`[data-entry-id="${entryId}"]`);
                if (element) {
                    element.remove();
                }
            } catch (error) {
                console.error(`Error deleting entry ${entryId}:`, error);
            }
        }
    }

    // Function to handle the delete key
    function handleDeleteKey(event) {
        // Prevent deletion if the user is focused on a contenteditable element
        const focusedElement = document.activeElement;
        if (focusedElement.hasAttribute('contenteditable')) {
            return;
        }

        // If delete key is pressed and there are selected items, delete them
        if (event.key === 'Delete') {
            const entryIds = Array.from(selectedItems);
            if (entryIds.length > 0) {
                deleteEntries(entryIds);
                selectedItems.clear();
            } else {
                // Delete single selected item without Ctrl
                const target = document.querySelector('li[data-entry-id].selected');
                if (target) {
                    const entryId = target.getAttribute('data-entry-id');
                    deleteEntries([entryId]);
                    target.classList.remove('selected');
                }
            }
            event.preventDefault(); // Prevent default behavior if necessary
        }
    }

    // Function to handle selection with Ctrl key
    function handleSelection(event) {
        // Check if the clicked element is a list item with a data-entry-id
        const target = event.target.closest('li[data-entry-id]');
        if (!target) return;

        const entryId = target.getAttribute('data-entry-id');

        // If Ctrl is pressed, allow multiple selection and toggle current selection state
        if (event.ctrlKey) {
            if (selectedItems.has(entryId)) {
                selectedItems.delete(entryId);
                target.classList.remove('selected');
            } else {
                selectedItems.add(entryId);
                target.classList.add('selected');
            }
        } else { 
            // Single selection without Ctrl, clear previous selections and select current item
            selectedItems.forEach(id => {
                const element = document.querySelector(`[data-entry-id="${id}"]`);
                if (element) element.classList.remove('selected');
            });
            selectedItems.clear();
            selectedItems.add(entryId);

            // Do not apply styling for single selection
        }

        // Apply styling only for multiple selections
        selectedItems.forEach(id => {
            const element = document.querySelector(`[data-entry-id="${id}"]`);
            if (element && selectedItems.size > 1) element.classList.add('selected');
        });
    }

    // Add event listeners
    document.addEventListener('keydown', handleDeleteKey);
    document.addEventListener('click', handleSelection);

    // Add CSS for the selected class to highlight the selected items
    const style = document.createElement('style');
    style.innerHTML = `
        .selected {
            background-color: yellow;
        }
    `;
    document.head.appendChild(style);

})();