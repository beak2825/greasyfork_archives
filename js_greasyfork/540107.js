// ==UserScript==
// @name         Searchable MUI Select
// @namespace    http://tampermonkey.net/
// @version      0.3 // Further updated version
// @description  Adds a search input to Material-UI Select dropdowns for filtering options.
// @author       Gemini
// @match        https://expert-portal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540107/Searchable%20MUI%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/540107/Searchable%20MUI%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Searchable MUI Select script loaded and initializing...');

    /**
     * Finds the closest parent element matching a selector.
     * @param {HTMLElement} element - The starting element.
     * @param {string} selector - The CSS selector to match.
     * @returns {HTMLElement|null} The matching parent element or null.
     */
    function findClosestParent(element, selector) {
        let currentElement = element;
        while (currentElement && currentElement !== document.body && currentElement.parentElement) {
            if (currentElement.matches(selector)) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }

    /**
     * Handles the filtering of menu items based on input.
     * @param {Event} event - The input event from the search field.
     */
    function filterMenuItems(event) {
        const searchText = event.target.value.toLowerCase();
        const listbox = findClosestParent(event.target, '[role="listbox"]');

        if (listbox) {
            const menuItems = listbox.querySelectorAll('[role="option"]');
            console.log(`Filtering ${menuItems.length} menu items for "${searchText}"...`);
            menuItems.forEach(item => {
                const itemText = item.textContent ? item.textContent.toLowerCase() : '';
                if (itemText.includes(searchText)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        } else {
            console.warn('FilterMenuItems: Could not find listbox parent for search input.');
        }
    }

    /**
     * Injects a search input into the MUI Select dropdown when it opens.
     * This function is called when a mutation observer detects a new Popper/Menu opening.
     * @param {HTMLElement} popperElement - The main Popper element containing the menu.
     */
    function injectSearchInput(popperElement) {
        if (popperElement.querySelector('.mui-select-search-input')) {
            console.log('Search input already injected into this popper. Skipping.');
            return;
        }

        const listbox = popperElement.querySelector('[role="listbox"]');
        if (!listbox) {
            console.warn('InjectSearchInput: No [role="listbox"] found within the detected popper element. Cannot inject search.');
            return;
        }

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search options...';
        searchInput.className = 'mui-select-search-input';

        searchInput.style.width = 'calc(100% - 20px)';
        searchInput.style.padding = '8px 10px';
        searchInput.style.margin = '10px 10px 0 10px';
        searchInput.style.border = '1px solid #ccc';
        searchInput.style.borderRadius = '4px';
        searchInput.style.boxSizing = 'border-box';
        searchInput.style.fontSize = '14px';
        searchInput.style.backgroundColor = 'white';
        searchInput.style.color = '#333';
        searchInput.style.outline = 'none';
        searchInput.style.fontFamily = 'Inter, sans-serif';
        searchInput.style.zIndex = '1000';

        searchInput.addEventListener('input', filterMenuItems);
        searchInput.addEventListener('keydown', (e) => { e.stopPropagation(); });
        searchInput.addEventListener('keypress', (e) => { e.stopPropagation(); });
        searchInput.addEventListener('keyup', (e) => { e.stopPropagation(); });

        listbox.prepend(searchInput);
        console.log('Search input successfully injected.');

        setTimeout(() => {
            searchInput.focus();
            console.log('Search input focused.');
        }, 100);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // Check if the added node itself is the MuiPopover-root or MuiPaper-root
                        // or if it contains such a container with a listbox inside.
                        let popperCandidate = null;
                        if (node.classList.contains('MuiPopover-root') || node.classList.contains('MuiPaper-root')) {
                            popperCandidate = node;
                        } else {
                            // If the added node is not the direct container, check its descendants
                            // for a potential popover/paper root that might contain a listbox.
                            popperCandidate = node.querySelector('.MuiPopover-root, .MuiPaper-root');
                        }

                        if (popperCandidate) {
                            const listbox = popperCandidate.querySelector('[role="listbox"]');
                            if (listbox) {
                                console.log('MUI Select Popper/Menu container detected:', popperCandidate);
                                injectSearchInput(popperCandidate);
                            } else {
                                // console.log('MUI container detected, but no listbox inside. Not a Select menu.', popperCandidate); // Verbose, keep commented
                            }
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', (event) => {
        const target = event.target;
        const selectTrigger = findClosestParent(target, '.MuiInputBase-root.MuiSelect-root, [role="button"][aria-haspopup="listbox"]');

        if (selectTrigger) {
            console.log('MUI Select trigger clicked:', selectTrigger);
        }
    });

    console.log('Tampermonkey script initialized: Waiting for MUI Select dropdowns to open.');

})();
