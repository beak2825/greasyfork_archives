// ==UserScript==
// @name         TF Games Search Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines collapsible subcategories with a Save Search Config button and adds table sorter buttons (by likes, last update, name, author).
// @match        https://tfgames.site/*
// @grant        none
// @run-at       document-end
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/527256/TF%20Games%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/527256/TF%20Games%20Search%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Collapsible Subcategories & Save Search Config ---

    function makeHeadersCollapsible() {
        const headers = document.querySelectorAll('.searchheader');
        headers.forEach(header => {
            // Indicate clickable
            header.style.cursor = 'pointer';

            // Create an icon element for toggle state (▼ for expanded, ► for collapsed)
            const icon = document.createElement('span');
            icon.innerHTML = '&#x25BC;'; // ▼ initially (expanded)
            icon.style.marginRight = '5px';
            icon.style.userSelect = 'none';
            // Insert the icon at the beginning of the header
            header.insertBefore(icon, header.firstChild);

            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                if (!content) return;
                if (content.style.display === 'none') {
                    // Expand
                    content.style.display = '';
                    icon.innerHTML = '&#x25BC;'; // ▼
                } else {
                    // Collapse
                    content.style.display = 'none';
                    icon.innerHTML = '&#x25B6;'; // ►
                }
            });
        });
    }

    function saveSearchConfig() {
        const config = {};
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            // Create a key using the checkbox's name and value
            const key = cb.name + '::' + cb.value;
            config[key] = cb.checked;
        });
        localStorage.setItem('savedSearchConfig', JSON.stringify(config));
        alert('Search configuration saved!');
    }

    function loadSearchConfig() {
        const configJson = localStorage.getItem('savedSearchConfig');
        if (!configJson) return;
        let config;
        try {
            config = JSON.parse(configJson);
        } catch(e) {
            console.error('Failed to parse search config:', e);
            return;
        }
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const key = cb.name + '::' + cb.value;
            if (config.hasOwnProperty(key)) {
                cb.checked = config[key];
            }
        });
    }

    // The button is appended to the container with id "includexcludeother"
    function addSaveButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Save Search Config';
        // Minimal styling: block-level with modest margin and padding.
        btn.style.display = 'block';
        btn.style.margin = '10px auto';
        btn.style.padding = '3px 6px';
        // Append the button to the main panel if it exists.
        const panel = document.getElementById('includexcludeother');
        if (panel) {
            panel.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
        btn.addEventListener('click', saveSearchConfig);
    }

    function initCollapsibleAndConfig() {
        makeHeadersCollapsible();
        loadSearchConfig();
        addSaveButton();
    }


    // --- TF Games Site Table Sorter ---

    // Inject CSS for the sort buttons and arrow indicators.
    const style = document.createElement("style");
    style.innerHTML = `
        .sort-button {
            cursor: pointer;
            padding: 5px 10px;
            font-size: 14px;
            border: 1px solid #ccc;
            background: #f9f9f9;
        }
        .sort-button[data-sort-order="asc"]::after {
            content: " \\2193";  /* Down arrow for ascending */
        }
        .sort-button[data-sort-order="desc"]::after {
            content: " \\2191";  /* Up arrow for descending */
        }
    `;
    document.head.appendChild(style);

    function initTableSorter() {
        // Look for the searchdetails element.
        const searchDetails = document.querySelector('.searchdetails');
        if (!searchDetails) return;

        // Create a container for the buttons.
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.marginTop = '10px';

        // Helper: Creates a button with a default sort order.
        function createButton(text, defaultOrder, onClick) {
            const btn = document.createElement('button');
            btn.classList.add('sort-button');
            btn.textContent = text;
            // Store the default order and current sort order in the dataset.
            btn.dataset.defaultOrder = defaultOrder;
            btn.dataset.sortOrder = defaultOrder;
            btn.addEventListener('click', onClick);
            return btn;
        }

        // Generic sorting function.
        function sortRows(getValue, compareFn, reverse = false) {
            const tbody = document.querySelector('tbody');
            if (!tbody) return;
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.sort((a, b) => {
                const aVal = getValue(a);
                const bVal = getValue(b);
                const cmp = compareFn(aVal, bVal);
                return reverse ? -cmp : cmp;
            });
            // Append sorted rows back into the tbody.
            rows.forEach(row => tbody.appendChild(row));
        }

        // Helper to handle toggling sort order for a button and performing the sort.
        function handleSort(button, getValue, defaultOrder, compareFn) {
            // Reset all other buttons to their default state.
            document.querySelectorAll('.sort-button').forEach(btn => {
                if (btn !== button) {
                    btn.dataset.sortOrder = btn.dataset.defaultOrder;
                }
            });

            // Toggle the clicked button.
            const currentOrder = button.dataset.sortOrder;
            const newOrder = currentOrder === defaultOrder
                ? (defaultOrder === "asc" ? "desc" : "asc")
                : defaultOrder;
            button.dataset.sortOrder = newOrder;

            // Determine if we need to reverse the natural sort order.
            let reverse = false;
            if (defaultOrder === "asc" && newOrder === "desc") {
                reverse = true;
            } else if (defaultOrder === "desc" && newOrder === "asc") {
                reverse = true;
            }
            sortRows(getValue, compareFn, reverse);
        }

        // Sorting functions for each criteria.

        // Sort by Likes (assumes likes are in the 5th cell, index 4). Default is descending.
        function sortByLikes(button) {
            handleSort(button,
                row => parseInt(row.children[4].innerText, 10) || 0,
                "desc",
                (a, b) => a - b
            );
        }

        // Sort by Last Update (assumes last update is in the 3rd cell, index 2). Default is descending.
        function sortByLastUpdate(button) {
            handleSort(button,
                row => {
                    const time = Date.parse(row.children[2].innerText.trim());
                    return isNaN(time) ? 0 : time;
                },
                "desc",
                (a, b) => a - b
            );
        }

        // Sort by Name (assumes game name is in the 1st cell, index 0). Default is ascending.
        function sortByName(button) {
            handleSort(button,
                row => row.children[0].innerText.trim().toLowerCase(),
                "asc",
                (a, b) => a.localeCompare(b)
            );
        }

        // Sort by Author (assumes author is in the 2nd cell, index 1). Default is ascending.
        function sortByAuthor(button) {
            handleSort(button,
                row => row.children[1].innerText.trim().toLowerCase(),
                "asc",
                (a, b) => a.localeCompare(b)
            );
        }

        // Create the buttons with appropriate default orders.
        const btnLikes = createButton('Sort by Likes', 'desc', function() { sortByLikes(this); });
        const btnLastUpdate = createButton('Sort by Last Update', 'desc', function() { sortByLastUpdate(this); });
        const btnName = createButton('Sort by Name', 'desc', function() { sortByName(this); });
        const btnAuthor = createButton('Sort by Author', 'desc', function() { sortByAuthor(this); });

        // Append buttons to the container.
        container.appendChild(btnLikes);
        container.appendChild(btnLastUpdate);
        container.appendChild(btnName);
        container.appendChild(btnAuthor);

        // Insert the container right after the searchdetails element.
        searchDetails.parentNode.insertBefore(container, searchDetails.nextSibling);
    }

    // --- Initialization ---
    function init() {
        initCollapsibleAndConfig();
        initTableSorter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
