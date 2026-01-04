// ==UserScript==
// @name         GitHub Location Filter
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Makes GitHub job listing tables user-friendly by adding location-based filtering with customizable city dropdown - Perfect for browsing careers pages
// @author       sacrosaunt
// @match        https://github.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/547666/GitHub%20Location%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/547666/GitHub%20Location%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default target cities
    let targetCities = ['remote'];
    
    // Track filtered state
    let isFiltered = false;
    let originalRows = new Map();

    // Drag state variables
    let isDragging = false;
    let dragStarted = false;
    let dragOffset = { x: 0, y: 0 };
    let currentPosition = { x: 0, y: 0 };
    let ensureBoundsTimeoutId = null;
    let dragRectWidth = null;
    let dragRectHeight = null;

    // Storage functions
    function loadCitiesFromStorage() {
        try {
            const storedCities = GM_getValue('locationFilterCities', null);
            if (storedCities) {
                const cities = JSON.parse(storedCities);
                if (Array.isArray(cities) && cities.length > 0) {
                    targetCities = cities;
                }
            }
        } catch (error) {
            console.warn('Failed to load cities from storage:', error);
        }
    }

    function saveCitiesToStorage() {
        try {
            GM_setValue('locationFilterCities', JSON.stringify(targetCities));
        } catch (error) {
            console.warn('Failed to save cities to storage:', error);
        }
    }

    function loadFilterStateFromStorage() {
        try {
            const storedState = GM_getValue('locationFilterEnabled', false);
            return storedState;
        } catch (error) {
            console.warn('Failed to load filter state from storage:', error);
            return false;
        }
    }

    function saveFilterStateToStorage(enabled) {
        try {
            GM_setValue('locationFilterEnabled', enabled);
        } catch (error) {
            console.warn('Failed to save filter state to storage:', error);
        }
    }

    // Create and inject the dropdown interface
    function createDropdownInterface() {
        // Remove existing interface if present
        const existingInterface = document.getElementById('location-filter-interface');
        if (existingInterface) {
            existingInterface.remove();
        }

        // Create main container
        const container = document.createElement('div');
        container.id = 'location-filter-interface';
        container.innerHTML = `
            <div class="filter-header" id="filter-header">
                <span class="filter-title">Location Filter</span>
                <div class="header-controls">
                    <button class="toggle-filter-btn" id="toggle-filter-btn">OFF</button>
                </div>
            </div>
            <div class="filter-content collapsed" id="filter-content">
                <div class="city-input-section">
                    <label for="city-input">Add City:</label>
                    <div class="input-group">
                        <input type="text" id="city-input" placeholder="Enter city name" />
                        <button id="add-city-btn">Add</button>
                    </div>
                </div>
                <div class="cities-section">
                    <label>Selected Cities:</label>
                    <div class="cities-list" id="cities-list"></div>
                </div>
            </div>
        `;

        // Add styles with dark mode support
        const styles = `
            #location-filter-interface {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 240px;
                background: #1976d2;
                border: 2px solid #1976d2;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                transition: none;
                overflow: hidden;
                scroll-behavior: auto;
                transform-origin: right top;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            #location-filter-interface.dragging {
                transition: none;
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }

            #location-filter-interface.repositioning {
                transition: left 0.3s ease, top 0.3s ease;
            }

            /* Ensure dragging always disables transitions, even if repositioning is active */
            #location-filter-interface.repositioning.dragging {
                transition: none;
            }

            #location-filter-interface:not(.collapsed) {
                width: 240px;
            }

            #location-filter-interface.active {
                background: #4caf50;
                border-color: #4caf50;
            }

            .filter-header {
                background: #1976d2;
                color: white;
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                transition: background-color 0.3s ease;
                gap: 4px;
                margin: -2px -2px 0 -2px;
                border-radius: 8px 8px 0 0;
                position: relative;
            }

            .filter-header:active {
                cursor: grabbing;
            }

            .filter-header.dragging {
                cursor: grabbing;
                background: #1565c0;
            }

            .filter-header.active {
                background: #4caf50;
            }

            .filter-title {
                font-weight: bold;
                font-size: 13px;
            }

            .header-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .toggle-filter-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                cursor: pointer;
                font-size: 11px;
                padding: 3px 8px;
                border-radius: 12px;
                font-weight: 500;
                transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
                min-width: 35px;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .toggle-filter-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .toggle-filter-btn.active {
                background: rgba(255,255,255,0.9);
                color: #4caf50;
            }

            .filter-content {
                padding: 0 15px;
                background: white;
                border-radius: 0 0 6px 6px;
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: max-height 0.3s ease, opacity 0.2s ease, padding 0.3s ease;
            }

            .filter-content:not(.collapsed) {
                padding: 15px;
                max-height: 1000px; /* sufficient for content */
                opacity: 1;
            }

            .city-input-section {
                margin-bottom: 15px;
            }

            .city-input-section label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #333;
            }

            .input-group {
                display: flex;
                gap: 5px;
                width: 100%;
            }

            #city-input {
                flex: 1 1 auto;
                width: auto;
                min-width: 0;
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                background: white;
                color: #333;
            }

            #add-city-btn {
                background: #4caf50;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                white-space: nowrap;
            }

            #add-city-btn:hover {
                background: #45a049;
            }

            .cities-section {
                margin-bottom: 15px;
            }

            .cities-section label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }

            .cities-list {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                min-height: 30px;
                padding: 8px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #f9f9f9;
            }

            .city-tag {
                background: #e3f2fd;
                color: #1976d2;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .city-remove {
                background: none;
                border: none;
                color: #1976d2;
                cursor: pointer;
                font-size: 14px;
                padding: 0;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .city-remove:hover {
                background: #1976d2;
                color: white;
            }

            .cities-list:empty::after {
                content: "No cities added";
                color: #999;
                font-style: italic;
                font-size: 12px;
            }

            /* Responsive width adjustments */
            @media (max-width: 768px) {
                #location-filter-interface {
                    width: 220px;
                }
                #location-filter-interface:not(.collapsed) {
                    width: 220px;
                }
                #city-input {
                    flex: 1 1 auto;
                    width: auto;
                    min-width: 0;
                }
            }

            @media (max-width: 480px) {
                #location-filter-interface {
                    width: 200px;
                }
                #location-filter-interface:not(.collapsed) {
                    width: 200px;
                }
                #city-input {
                    flex: 1 1 auto;
                    width: auto;
                    min-width: 0;
                }
            }

            /* Dark mode styles */
            @media (prefers-color-scheme: dark) {
                #location-filter-interface {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                }

                .filter-content {
                    background: #2d2d2d;
                    color: #e0e0e0;
                }

                .city-input-section label,
                .cities-section label {
                    color: #e0e0e0;
                }

                #city-input {
                    background: #404040;
                    border: 1px solid #555;
                    color: #e0e0e0;
                }

                #city-input::placeholder {
                    color: #999;
                }

                #city-input:focus {
                    outline: none;
                    border-color: #1976d2;
                    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
                }

                .cities-list {
                    background: #404040;
                    border: 1px solid #555;
                }

                .city-tag {
                    background: #1e3a5f;
                    color: #64b5f6;
                }

                .city-remove {
                    color: #64b5f6;
                }

                .city-remove:hover {
                    background: #64b5f6;
                    color: #1e3a5f;
                }

                .cities-list:empty::after {
                    color: #888;
                }
            }
        `;

        // Inject styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Add to page
        document.body.appendChild(container);

        // Set up event listeners
        setupEventListeners();
        
        // Initialize cities display
        updateCitiesDisplay();
        
        // Start in collapsed state
        container.classList.add('collapsed');
    }

    // Drag functionality
    function constrainPosition(x, y, forceCurrentWidth = false) {
        const container = document.getElementById('location-filter-interface');
        if (!container) return { x, y };
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get current dimensions, accounting for expanded/collapsed state
        let width, height;
        if (forceCurrentWidth) {
            if (dragRectWidth !== null && dragRectHeight !== null) {
                width = dragRectWidth;
                height = dragRectHeight;
            } else {
                const rect = container.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
            }
        } else {
            // Use fixed width by viewport to keep width constant across states
            if (viewportWidth <= 480) {
                width = 200;
            } else if (viewportWidth <= 768) {
                width = 220;
            } else {
                width = 240;
            }
            
            const rect = container.getBoundingClientRect();
            height = rect.height;
        }
        
        // Constrain to 15px from edges
        const minX = 15;
        const maxX = viewportWidth - width - 15;
        const minY = 15;
        const maxY = viewportHeight - height - 15;
        
        return {
            x: Math.max(minX, Math.min(maxX, x)),
            y: Math.max(minY, Math.min(maxY, y))
        };
    }

    function updatePosition(x, y, animate = false) {
        const container = document.getElementById('location-filter-interface');
        if (!container) return;
        
        const constrained = constrainPosition(x, y);
        currentPosition.x = constrained.x;
        currentPosition.y = constrained.y;
        
        // Add animation class if needed
        if (animate) {
            container.classList.add('repositioning');
            // Remove animation class after transition
            setTimeout(() => {
                container.classList.remove('repositioning');
            }, 400);
        }
        
        // Use left positioning for manual dragging
        container.style.left = constrained.x + 'px';
        container.style.top = constrained.y + 'px';
        container.style.right = 'auto'; // Remove right positioning
    }

    function animatedRepositionToConstraints(x, y) {
        if (isDragging) {
            updatePosition(x, y, false);
            return;
        }
        updatePosition(x, y, true);
    }

    function setInitialPosition() {
        const container = document.getElementById('location-filter-interface');
        if (!container) return;
        
        // Calculate initial position for right-aligned interface
        const viewportWidth = window.innerWidth;
        const rect = container.getBoundingClientRect();
        
        // Find the GitHub header
        const header = document.querySelector('.AppHeader');
        let topOffset = 120; // Default fallback
        
        if (header) {
            topOffset = header.offsetHeight + 20; // 20px padding below header
        }
        
        // Position in top-right corner with responsive margins
        let rightMargin = 20;
        if (viewportWidth <= 768) {
            rightMargin = 15;
        }
        if (viewportWidth <= 480) {
            rightMargin = 10;
        }
        
        // Keep using CSS right positioning for initial state
        container.style.right = rightMargin + 'px';
        container.style.top = Math.max(topOffset, 15) + 'px';
        container.style.left = 'auto';
        
        // Don't set currentPosition yet - let it remain 0,0 for initial state
    }

    function setupDragFunctionality() {
        const header = document.getElementById('filter-header');
        const container = document.getElementById('location-filter-interface');
        
        if (!header || !container) return;
        
        header.addEventListener('mousedown', (e) => {
            // Only start drag on left mouse button
            if (e.button !== 0) return;
            
            // Don't drag if clicking on the toggle button
            if (e.target.id === 'toggle-filter-btn' || e.target.closest('.toggle-filter-btn')) {
                return;
            }
            
            isDragging = true;
            dragStarted = false;
            
            const rect = container.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            dragRectWidth = rect.width;
            dragRectHeight = rect.height;
            
            // Set initial position if not already set
            if (currentPosition.x === 0 && currentPosition.y === 0) {
                currentPosition.x = rect.left;
                currentPosition.y = rect.top;
            }
            
            header.classList.add('dragging');
            container.classList.add('dragging');
            container.classList.remove('repositioning');

            if (ensureBoundsTimeoutId) {
                clearTimeout(ensureBoundsTimeoutId);
                ensureBoundsTimeoutId = null;
            }
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            dragStarted = true;
            
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Use current width during drag to ensure proper constraints
            const constrained = constrainPosition(newX, newY, true);
            currentPosition.x = constrained.x;
            currentPosition.y = constrained.y;
            
            const container = document.getElementById('location-filter-interface');
            if (container) {
                container.style.left = constrained.x + 'px';
                container.style.top = constrained.y + 'px';
                container.style.right = 'auto';
            }
            
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            header.classList.remove('dragging');
            container.classList.remove('dragging');
            dragRectWidth = null;
            dragRectHeight = null;
            
            // Prevent click event if we actually dragged
            if (dragStarted) {
                setTimeout(() => {
                    dragStarted = false;
                }, 10);
            }
        });
        
        // Handle window resize to reposition if needed (throttled)
        window.addEventListener('resize', throttle(() => {
            if (isDragging) return;
            if (currentPosition.x !== 0 || currentPosition.y !== 0) {
                animatedRepositionToConstraints(currentPosition.x, currentPosition.y);
            } else {
                // If no manual position set, reposition automatically
                adjustFilterPosition();
            }
        }, 100));
    }

    function setupEventListeners() {
        // Toggle dropdown by clicking header
        const header = document.getElementById('filter-header');
        const content = document.getElementById('filter-content');
        const container = document.getElementById('location-filter-interface');
        
        // Setup drag functionality
        setupDragFunctionality();
        
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking the toggle filter button or if we just finished dragging
            if (e.target.id === 'toggle-filter-btn' || dragStarted) {
                return;
            }
            
            content.classList.toggle('collapsed');
            container.classList.toggle('collapsed', content.classList.contains('collapsed'));
            
            // Ensure interface stays within bounds after expansion/collapse
            if (ensureBoundsTimeoutId) {
                clearTimeout(ensureBoundsTimeoutId);
            }
            ensureBoundsTimeoutId = setTimeout(() => {
                ensureBoundsTimeoutId = null;
                ensureWithinBounds();
            }, 0); // Run on next tick so layout updates are applied, no extra delay
        });

        // After expand/collapse animation completes, re-ensure bounds in case height changed further
        content.addEventListener('transitionend', (e) => {
            if (e.target !== content) return;
            if (e.propertyName === 'max-height' || e.propertyName === 'opacity' || e.propertyName === 'padding') {
                ensureWithinBounds();
            }
        });

        // Toggle filter on/off
        const toggleFilterBtn = document.getElementById('toggle-filter-btn');
        toggleFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isFiltered) {
                clearFilter();
            } else {
                applyFilter(true); // Show alert if no cities when manually toggling on
            }
        });

        // Add city
        const addBtn = document.getElementById('add-city-btn');
        const cityInput = document.getElementById('city-input');
        
        addBtn.addEventListener('click', addCity);
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCity();
            }
        });
    }

    function addCity() {
        const cityInput = document.getElementById('city-input');
        const cityName = cityInput.value.trim().toLowerCase();
        
        if (cityName && !targetCities.includes(cityName)) {
            targetCities.push(cityName);
            cityInput.value = '';
            saveCitiesToStorage();
            updateCitiesDisplay();
            
            // Automatically apply filter if there are tables on the page
            const tables = document.querySelectorAll('table');
            if (tables.length > 0) {
                applyFilter();
            }
        }
    }

    function removeCity(cityName) {
        targetCities = targetCities.filter(city => city !== cityName);
        saveCitiesToStorage();
        updateCitiesDisplay();
        
        // If filter is active, reapply it
        if (isFiltered) {
            applyFilter();
        }
    }

    function updateCitiesDisplay() {
        const citiesList = document.getElementById('cities-list');
        citiesList.innerHTML = '';
        
        targetCities.forEach(city => {
            const cityTag = document.createElement('div');
            cityTag.className = 'city-tag';
            cityTag.innerHTML = `
                ${city}
                <button class="city-remove" title="Remove city">×</button>
            `;
            
            // Add event listener to the remove button
            const removeBtn = cityTag.querySelector('.city-remove');
            removeBtn.addEventListener('click', () => removeCity(city));
            
            citiesList.appendChild(cityTag);
        });
    }

    function findLocationColumnIndex(table) {
        const headerRow = table.querySelector('thead tr, tr:first-child');
        if (!headerRow) return -1;

        const headers = headerRow.querySelectorAll('th, td');
        for (let i = 0; i < headers.length; i++) {
            const headerText = headers[i].textContent.toLowerCase().trim();
            if (headerText.includes('location') || headerText.includes('city') || headerText.includes('office')) {
                return i;
            }
        }
        return -1;
    }

    function containsTargetCity(locationCell) {
        // Get all text content including from details/summary elements
        let text = '';
        
        // If it's a DOM element, extract all text including hidden content
        if (locationCell && locationCell.textContent !== undefined) {
            text = locationCell.textContent;
        } else {
            // Fallback for string input
            text = locationCell || '';
        }
        
        // Clean up the text - remove extra whitespace and normalize
        const textLower = text.toLowerCase().replace(/\s+/g, ' ').trim();
        
        return targetCities.some(city => {
            const cityLower = city.toLowerCase().trim();
            
            // Try multiple matching strategies
            // 1. Exact word boundary match
            const wordBoundaryRegex = new RegExp(`\\b${cityLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (wordBoundaryRegex.test(textLower)) {
                return true;
            }
            
            // 2. Simple substring match (for cases where word boundaries might not work)
            if (textLower.includes(cityLower)) {
                return true;
            }
            
            // 3. Match with common separators (comma, space, etc.)
            const separatorRegex = new RegExp(`(^|[,\\s])${cityLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([,\\s]|$)`, 'i');
            if (separatorRegex.test(textLower)) {
                return true;
            }
            
            return false;
        });
    }

    function filterTable(table) {
        const locationColumnIndex = findLocationColumnIndex(table);
        if (locationColumnIndex === -1) return;

        const tbody = table.querySelector('tbody');
        const rows = tbody ? tbody.querySelectorAll('tr') : table.querySelectorAll('tr:not(:first-child)');
        
        // Store original rows if not already stored
        if (!originalRows.has(table)) {
            originalRows.set(table, Array.from(rows).map(row => ({
                element: row,
                display: row.style.display
            })));
        }

        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            if (cells.length > locationColumnIndex) {
                const locationCell = cells[locationColumnIndex];
                
                if (!containsTargetCity(locationCell)) {
                    row.style.display = 'none';
                    row.classList.add('location-filtered');
                } else {
                    row.style.display = '';
                    row.classList.remove('location-filtered');
                }
            }
        });
    }

    function restoreTable(table) {
        const storedRows = originalRows.get(table);
        if (!storedRows) return;

        storedRows.forEach(rowData => {
            rowData.element.style.display = rowData.display;
            rowData.element.classList.remove('location-filtered');
        });
    }

    function applyFilter(showAlertIfNoCities = false) {
        if (targetCities.length === 0) {
            if (showAlertIfNoCities) {
                alert('Please add at least one city to filter by.');
            }
            clearFilter();
            return;
        }

        const tables = document.querySelectorAll('table');
        tables.forEach(table => filterTable(table));
        
        isFiltered = true;
        saveFilterStateToStorage(true);
        updateFilterStatus();
    }

    function clearFilter() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => restoreTable(table));
        
        isFiltered = false;
        saveFilterStateToStorage(false);
        updateFilterStatus();
    }

    function updateFilterStatus() {
        const header = document.getElementById('filter-header');
        const toggleBtn = document.getElementById('toggle-filter-btn');
        const container = document.getElementById('location-filter-interface');
        
        if (isFiltered) {
            header.classList.add('active');
            toggleBtn.classList.add('active');
            container.classList.add('active');
            toggleBtn.textContent = 'ON';
        } else {
            header.classList.remove('active');
            toggleBtn.classList.remove('active');
            container.classList.remove('active');
            toggleBtn.textContent = 'OFF';
        }
    }

    function applyFilterToNewTables() {
        if (isFiltered) {
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                if (!originalRows.has(table)) {
                    filterTable(table);
                }
            });
        }
    }

    // Observer for dynamically added tables
    const observer = new MutationObserver((mutations) => {
        let hasNewTables = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'TABLE' || node.querySelector('table')) {
                        hasNewTables = true;
                    }
                }
            });
        });
        
        if (hasNewTables) {
            // Check if interface should be shown when new tables are added
            const existingInterface = document.getElementById('location-filter-interface');
            if (!existingInterface && hasLocationColumns()) {
                // Location columns found and no interface exists, create it
                loadCitiesFromStorage();
                const savedFilterState = loadFilterStateFromStorage();
                createDropdownInterface();
                
                if (savedFilterState && targetCities.length > 0) {
                    setTimeout(() => {
                        isFiltered = savedFilterState;
                        if (isFiltered) {
                            const tables = document.querySelectorAll('table');
                            tables.forEach(table => filterTable(table));
                        }
                        updateFilterStatus();
                    }, 100);
                }
            }
            
            applyFilterToNewTables();
        }
    });


    // Check if any tables have location columns
    function hasLocationColumns() {
        const tables = document.querySelectorAll('table');
        for (let table of tables) {
            if (findLocationColumnIndex(table) !== -1) {
                return true;
            }
        }
        return false;
    }

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Function to adjust filter position based on header height and responsiveness
    function adjustFilterPosition() {
        const filterInterface = document.getElementById('location-filter-interface');
        if (!filterInterface) return;
        
        // If the element has been manually positioned by dragging, reapply constraints
        if (currentPosition.x !== 0 || currentPosition.y !== 0) {
            updatePosition(currentPosition.x, currentPosition.y);
            return;
        }
        
        // For initial positioning, use CSS right positioning
        setInitialPosition();
    }

    // Function to ensure interface stays within bounds when expanding/collapsing
    function ensureWithinBounds() {
        const filterInterface = document.getElementById('location-filter-interface');
        if (!filterInterface) return;
        if (isDragging) return;
        
        // If already manually positioned (dragged), reapply constraints with current state and animation
        if (currentPosition.x !== 0 || currentPosition.y !== 0) {
            animatedRepositionToConstraints(currentPosition.x, currentPosition.y);
            return;
        }
        
        // For right-positioned interface, check if it goes off screen when expanded
        const rect = filterInterface.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let targetX = rect.left;
        let targetY = rect.top;
        let needsReposition = false;
        
        // Horizontal bounds
        if (rect.left < 15) {
            targetX = 15;
            needsReposition = true;
        } else if (rect.right > viewportWidth - 15) {
            targetX = viewportWidth - rect.width - 15;
            needsReposition = true;
        }
        
        // Vertical bounds
        if (rect.top < 15) {
            targetY = 15;
            needsReposition = true;
        } else if (rect.bottom > viewportHeight - 15) {
            targetY = Math.max(15, viewportHeight - rect.height - 15);
            needsReposition = true;
        }
        
        if (needsReposition) {
            // Convert to left/top baseline at current visual position to allow smooth transition
            filterInterface.style.left = rect.left + 'px';
            filterInterface.style.top = rect.top + 'px';
            filterInterface.style.right = 'auto';
            
            animatedRepositionToConstraints(targetX, targetY);
        }
    }

    // Initialize when DOM is ready
    function initialize() {
        // Check if there are any tables with location columns
        if (!hasLocationColumns()) {
            // No location columns found, don't display the interface
            return;
        }
        
        // Load cities from storage first
        loadCitiesFromStorage();
        
        // Load filter state from storage
        const savedFilterState = loadFilterStateFromStorage();
        
        createDropdownInterface();
        
        // Set initial position after creating interface
        setTimeout(setInitialPosition, 100);
        
        // Restore filter state if it was previously enabled
        if (savedFilterState && targetCities.length > 0) {
            // Wait a bit for tables to load, then apply filter
            setTimeout(() => {
                isFiltered = savedFilterState;
                if (isFiltered) {
                    const tables = document.querySelectorAll('table');
                    tables.forEach(table => filterTable(table));
                }
                updateFilterStatus();
            }, 100);
        }
        
        // Start observing for new tables
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Listen for window resize to adjust position (throttled)
        window.addEventListener('resize', throttle(() => {
            if (isDragging) return;
            if (currentPosition.x !== 0 || currentPosition.y !== 0) {
                animatedRepositionToConstraints(currentPosition.x, currentPosition.y);
            } else {
                adjustFilterPosition();
            }
        }, 100));
        
        // Listen for scroll to ensure filter stays visible (throttled)
        window.addEventListener('scroll', throttle(adjustFilterPosition, 100));
        
        // Listen for navigation changes (GitHub uses pjax)
        document.addEventListener('pjax:end', adjustFilterPosition);
        
        // Also adjust position periodically to catch any dynamic changes
        setInterval(adjustFilterPosition, 2000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
