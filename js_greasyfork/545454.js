// ==UserScript==
// @name         FlatMMO Market Search + Filters
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds search bar and filters to FlatMMO market page
// @author       Carlos
// @license      MIT
// @match        https://flatmmo.com/market/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545454/FlatMMO%20Market%20Search%20%2B%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/545454/FlatMMO%20Market%20Search%20%2B%20Filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchFilters() {
        const table = document.getElementById('postingsTable');
        if (!table) return false; // Table not found yet

        // Prevent adding filters multiple times
        if (document.getElementById('market-search-container')) return true;

        // Create container for controls
        const container = document.createElement('div');
        container.id = 'market-search-container';  // Mark container so we don't add twice
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'center';
        container.style.gap = '10px';
        container.style.margin = '15px 0';

        // Search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search items or usernames...';
        searchInput.style.padding = '10px';
        searchInput.style.fontSize = '16px';
        searchInput.style.borderRadius = '5pt';
        searchInput.style.border = '1px solid black';
        searchInput.style.minWidth = '250px';
        container.appendChild(searchInput);

        // Buying/Selling filter dropdown
        const typeFilter = document.createElement('select');
        typeFilter.style.padding = '10px';
        typeFilter.style.fontSize = '16px';
        typeFilter.style.borderRadius = '5pt';
        typeFilter.style.border = '1px solid black';
        typeFilter.innerHTML = `
            <option value="all">All Types</option>
            <option value="BUYING">Buying</option>
            <option value="SELLING">Selling</option>
        `;
        container.appendChild(typeFilter);

        // Online status filter dropdown
        const onlineFilter = document.createElement('select');
        onlineFilter.style.padding = '10px';
        onlineFilter.style.fontSize = '16px';
        onlineFilter.style.borderRadius = '5pt';
        onlineFilter.style.border = '1px solid black';
        onlineFilter.innerHTML = `
            <option value="all">All Online Status</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
        `;
        container.appendChild(onlineFilter);

        // Min price input
        const priceMin = document.createElement('input');
        priceMin.type = 'number';
        priceMin.min = 0;
        priceMin.placeholder = 'Min price';
        priceMin.style.padding = '10px';
        priceMin.style.fontSize = '16px';
        priceMin.style.borderRadius = '5pt';
        priceMin.style.border = '1px solid black';
        priceMin.style.width = '100px';
        container.appendChild(priceMin);

        // Max price input
        const priceMax = document.createElement('input');
        priceMax.type = 'number';
        priceMax.min = 0;
        priceMax.placeholder = 'Max price';
        priceMax.style.padding = '10px';
        priceMax.style.fontSize = '16px';
        priceMax.style.borderRadius = '5pt';
        priceMax.style.border = '1px solid black';
        priceMax.style.width = '100px';
        container.appendChild(priceMax);

        // Insert controls above table
        table.parentNode.insertBefore(container, table);

        // Filtering logic
        function filterRows() {
            const searchText = searchInput.value.toLowerCase();
            const typeValue = typeFilter.value;
            const onlineValue = onlineFilter.value;
            const minPrice = priceMin.value ? parseFloat(priceMin.value) : null;
            const maxPrice = priceMax.value ? parseFloat(priceMax.value) : null;

            for (const row of table.tBodies[0].rows) {
                const username = row.cells[0].textContent.toLowerCase();
                const onlineStatus = row.cells[1].textContent.includes('✓') ? 'online' : 'offline';
                const type = row.cells[4].textContent.toUpperCase();
                let priceText = row.cells[6].textContent.trim();
                let priceNum = parseFloat(priceText.match(/[\d,.]+/));
                if (isNaN(priceNum)) priceNum = 0;
                const itemName = row.cells[3].getAttribute('title').toLowerCase();

                const matchesSearch = username.includes(searchText) || itemName.includes(searchText);
                const matchesType = (typeValue === 'all') || (type === typeValue);
                const matchesOnline = (onlineValue === 'all') || (onlineValue === onlineStatus);
                const matchesMin = (minPrice === null) || (priceNum >= minPrice);
                const matchesMax = (maxPrice === null) || (priceNum <= maxPrice);

                if (matchesSearch && matchesType && matchesOnline && matchesMin && matchesMax) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }

        // Add listeners
        searchInput.addEventListener('input', filterRows);
        typeFilter.addEventListener('change', filterRows);
        onlineFilter.addEventListener('change', filterRows);
        priceMin.addEventListener('input', filterRows);
        priceMax.addEventListener('input', filterRows);

        // Run initially
        filterRows();

        return true; // Filters added successfully
    }

    // Wait for the table to exist, check every 500ms
    function waitForTable() {
        if (!addSearchFilters()) {
            setTimeout(waitForTable, 500);
        }
    }

    waitForTable();

})();
