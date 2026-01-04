// ==UserScript==
// @name         8chan Catalog Filter
// @version      1.8
// @description  Filter catalog threads using regex patterns with per-filter board settings, bumplock hide option, and glow effect for prioritized threads
// @match        *://8chan.moe/*/catalog.*
// @match        *://8chan.se/*/catalog.*
// @grant        none
// @license MIT
// @namespace   https://greasyfork.org/users/1459581
// @downloadURL https://update.greasyfork.org/scripts/533580/8chan%20Catalog%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/533580/8chan%20Catalog%20Filter.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Cache DOM elements to avoid repeated queries
    let catalogDiv, cachedCells;

    // Initial configuration - can be modified by the user through the dashboard
    let config = {
        filters: [
            {
                pattern: /Arknights|AKG/i, // Example regex pattern
                board: 'gacha',           // Board for this filter (optional)
                action: 'setTop'          // 'setTop' or 'remove'
            }
            // More filters can be added by the user
        ],
        hideBumplocked: true,  // Default to hide bumplocked threads
        glowColor: '#57c457',  // Default glow color for setTop threads
        glowIntensity: 5       // Default glow intensity (0-20)
    };

    // Load saved configuration from localStorage if available
    function loadConfig() {
        const savedConfig = localStorage.getItem('8chanCatalogFilterConfig');
        if (savedConfig) {
            try {
                const parsedConfig = JSON.parse(savedConfig);
                // Convert string patterns back to RegExp objects
                parsedConfig.filters = parsedConfig.filters.map(filter => ({
                    pattern: new RegExp(filter.patternText, filter.flags),
                    patternText: filter.patternText, // Store the raw text pattern
                    board: filter.board || '',       // Board setting for this filter
                    action: filter.action
                }));

                // Handle bumplocked setting if it exists
                if (parsedConfig.hideBumplocked !== undefined) {
                    config.hideBumplocked = parsedConfig.hideBumplocked;
                }

                // Handle glow settings if they exist
                if (parsedConfig.glowColor !== undefined) {
                    config.glowColor = parsedConfig.glowColor;
                }

                if (parsedConfig.glowIntensity !== undefined) {
                    config.glowIntensity = parsedConfig.glowIntensity;
                }

                config = parsedConfig;
            } catch (e) {
                console.error('Failed to load saved filters:', e);
            }
        }
    }

    // Save configuration to localStorage
    function saveConfig() {
        // Convert RegExp objects to a serializable format
        const serializedConfig = {
            filters: config.filters.map(filter => ({
                patternText: filter.patternText || filter.pattern.source,
                flags: filter.pattern.flags,
                board: filter.board || '',
                action: filter.action
            })),
            hideBumplocked: config.hideBumplocked,
            glowColor: config.glowColor,
            glowIntensity: config.glowIntensity
        };
        localStorage.setItem('8chanCatalogFilterConfig', JSON.stringify(serializedConfig));
    }

    // Get current board from URL
    function getCurrentBoard() {
        const match = window.location.pathname.match(/\/([^\/]+)\/catalog/);
        return match ? match[1] : '';
    }

    // Check if a filter should apply on the current board
    function shouldApplyFilter(filter) {
        const currentBoard = getCurrentBoard();
        // If filter has no board specified or matches current board, apply it
        return !filter.board || filter.board === '' || filter.board === currentBoard;
    }

    // Create and inject the filter dashboard
    function createDashboard() {
        const toolsDiv = document.getElementById('divTools');
        if (!toolsDiv) return;

        // Create container for the filter dashboard
        const dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'filterDashboard';
        dashboardContainer.style.marginBottom = '10px';

        // Create the dashboard controls
        const dashboardControls = document.createElement('div');
        dashboardControls.className = 'catalogLabel';
        dashboardControls.innerHTML = `
            <span style="font-weight: bold;">Filters:</span>
            <button id="showFilterManager" class="catalogLabel" style="margin-left: 5px;">Manage Filters</button>
            <button id="applyFilters" class="catalogLabel" style="margin-left: 5px;">Apply Filters</button>
            <label style="margin-left: 5px; display: inline-flex; align-items: center;">
                <input type="checkbox" id="hideBumplockedCheck" ${config.hideBumplocked ? 'checked' : ''}>
                <span style="margin-left: 3px;">Hide Bumplocked</span>
            </label>
            <span id="activeFiltersCount" style="margin-left: 5px;">(${config.filters.length} active)</span>
            <span id="currentBoardInfo" style="margin-left: 5px;">Current board: ${getCurrentBoard() || 'unknown'}</span>
        `;

        // Create the filter manager panel (initially hidden)
        const filterManager = document.createElement('div');
        filterManager.id = 'filterManagerPanel';
        filterManager.style.display = 'none';
        filterManager.style.border = '1px solid #ccc';
        filterManager.style.padding = '10px';
        filterManager.style.marginTop = '5px';

        updateFilterManagerContent(filterManager);

        // Add everything to the dashboard container
        dashboardContainer.appendChild(dashboardControls);
        dashboardContainer.appendChild(filterManager);

        // Insert dashboard before the search box
        const searchDiv = toolsDiv.querySelector('div[style="float: right; margin-top: 6px;"]');
        if (searchDiv) {
            toolsDiv.insertBefore(dashboardContainer, searchDiv);
        } else {
            toolsDiv.appendChild(dashboardContainer);
        }

        // Add event listeners
        document.getElementById('showFilterManager').addEventListener('click', function() {
            const panel = document.getElementById('filterManagerPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('applyFilters').addEventListener('click', function() {
            // Debounce the click to prevent multiple rapid clicks
            if (this.disabled) return;
            this.disabled = true;

            // Visual feedback
            const originalText = this.textContent;
            this.textContent = "Applying...";

            // Use requestAnimationFrame to avoid blocking the UI
            requestAnimationFrame(() => {
                processCatalog();
                this.textContent = originalText;
                this.disabled = false;
            });
        });

        document.getElementById('hideBumplockedCheck').addEventListener('change', function() {
            config.hideBumplocked = this.checked;
            saveConfig();
            processCatalog();
        });
    }

    function updateFilterManagerContent(filterManager) {
        let content = `
            <div style="margin-bottom: 10px;">
                <h4 style="margin: 0 0 5px 0;">Current Filters</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 2px 5px;">Pattern</th>
                            <th style="text-align: left; padding: 2px 5px;">Board</th>
                            <th style="text-align: left; padding: 2px 5px;">Action</th>
                            <th style="text-align: center; padding: 2px 5px;">Remove</th>
                        </tr>
                    </thead>
                    <tbody id="filtersTableBody">
        `;

        config.filters.forEach((filter, index) => {
            content += `
                <tr>
                    <td style="padding: 2px 5px;">${filter.patternText || filter.pattern.source}</td>
                    <td style="padding: 2px 5px;">${filter.board || 'All boards'}</td>
                    <td style="padding: 2px 5px;">${filter.action}</td>
                    <td style="text-align: center; padding: 2px 5px;">
                        <button class="removeFilterBtn" data-index="${index}" style="cursor: pointer;">X</button>
                    </td>
                </tr>
            `;
        });

        content += `
                    </tbody>
                </table>
            </div>
            <div style="margin-bottom: 10px;">
                <h4 style="margin: 0 0 5px 0;">Add New Filter</h4>
                <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 5px;">
                    <input type="text" id="newFilterPattern" placeholder="Regex pattern (e.g. anime|manga)" style="flex-grow: 1;">
                    <label style="white-space: nowrap;">
                        <input type="checkbox" id="caseInsensitive" checked> Case insensitive
                    </label>
                </div>
                <div style="display: flex; gap: 5px; align-items: center;">
                    <input type="text" id="newFilterBoard" placeholder="Board name (empty for all boards)" style="flex-grow: 1;">
                    <select id="newFilterAction">
                        <option value="setTop">Move to Top</option>
                        <option value="remove">Hide</option>
                    </select>
                    <button id="addNewFilter" style="cursor: pointer;">Add</button>
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <h4 style="margin: 0 0 5px 0;">Glow Effect Settings</h4>
                <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 5px;">
                    <label style="white-space: nowrap;">
                        Glow Color:
                        <input type="color" id="glowColorPicker" value="${config.glowColor}" style="vertical-align: middle;">
                    </label>
                    <label style="white-space: nowrap; margin-left: 10px;">
                        Intensity:
                        <input type="range" id="glowIntensitySlider" min="0" max="20" value="${config.glowIntensity}" style="vertical-align: middle;">
                        <span id="glowIntensityValue">${config.glowIntensity}</span>
                    </label>
                    <button id="saveGlowSettings" style="margin-left: auto; cursor: pointer;">Save</button>
                </div>
                <div id="glowPreview" style="margin-top: 5px; padding: 10px; text-align: center; border: 1px solid #ccc; box-shadow: 0 0 ${config.glowIntensity}px ${config.glowIntensity/2}px ${config.glowColor};">
                    Preview: Thread with Glow Effect
                </div>
            </div>
        `;

        filterManager.innerHTML = content;

        // Add event listeners after updating content
        setTimeout(() => {
            // Use event delegation for remove buttons
            const filtersTable = document.getElementById('filtersTableBody');
            if (filtersTable) {
                filtersTable.addEventListener('click', (event) => {
                    if (event.target.classList.contains('removeFilterBtn')) {
                        const index = parseInt(event.target.dataset.index);
                        config.filters.splice(index, 1);
                        saveConfig();
                        updateFilterManagerContent(filterManager);
                        updateActiveFiltersCount();
                    }
                });
            }

            // Add new filter button
            document.getElementById('addNewFilter').addEventListener('click', function() {
                const patternInput = document.getElementById('newFilterPattern');
                const boardInput = document.getElementById('newFilterBoard');
                const caseInsensitive = document.getElementById('caseInsensitive').checked;
                const actionSelect = document.getElementById('newFilterAction');

                if (patternInput.value.trim()) {
                    try {
                        const patternText = patternInput.value.trim();
                        const flags = caseInsensitive ? 'i' : '';
                        const boardValue = boardInput.value.trim();

                        const newFilter = {
                            pattern: new RegExp(patternText, flags),
                            patternText: patternText, // Store the raw text
                            board: boardValue,       // Board specific to this filter
                            action: actionSelect.value
                        };

                        config.filters.push(newFilter);
                        saveConfig();
                        updateFilterManagerContent(filterManager);
                        updateActiveFiltersCount();
                        patternInput.value = '';
                        boardInput.value = '';
                    } catch (e) {
                        alert('Invalid regex pattern: ' + e.message);
                    }
                }
            });

            // Glow settings event listeners
            const glowColorPicker = document.getElementById('glowColorPicker');
            const glowIntensitySlider = document.getElementById('glowIntensitySlider');
            const glowIntensityValue = document.getElementById('glowIntensityValue');
            const glowPreview = document.getElementById('glowPreview');

            // Live preview for glow settings
            function updateGlowPreview() {
                const color = glowColorPicker.value;
                const intensity = parseInt(glowIntensitySlider.value);
                glowIntensityValue.textContent = intensity;

                glowPreview.style.boxShadow = `0 0 ${intensity}px ${intensity/2}px ${color}`;
            }

            glowColorPicker.addEventListener('input', updateGlowPreview);
            glowIntensitySlider.addEventListener('input', updateGlowPreview);

            // Save glow settings
            document.getElementById('saveGlowSettings').addEventListener('click', function() {
                config.glowColor = glowColorPicker.value;
                config.glowIntensity = parseInt(glowIntensitySlider.value);
                saveConfig();
                processCatalog(); // Re-apply filters with new glow settings
                alert('Glow settings saved!');
            });
        }, 0);
    }

    function updateActiveFiltersCount() {
        const countElement = document.getElementById('activeFiltersCount');
        if (countElement) {
            // Count only filters applicable to the current board
            const currentBoard = getCurrentBoard();
            const applicableFilters = config.filters.filter(filter =>
                !filter.board || filter.board === '' || filter.board === currentBoard
            );
            countElement.textContent = `(${applicableFilters.length} active on this board)`;
        }
    }

    // Optimized processCatalog function to reduce DOM operations
    function processCatalog() {
        catalogDiv = catalogDiv || document.getElementById('divThreads');
        if (!catalogDiv) return;

        // Cache cells if not already done to avoid repetitive querySelectorAll
        if (!cachedCells || cachedCells.length === 0) {
            cachedCells = Array.from(catalogDiv.querySelectorAll('.catalogCell'));
        }

        // Cache applicable filters for current board
        const currentBoard = getCurrentBoard();
        const applicableFilters = config.filters.filter(filter =>
            !filter.board || filter.board === '' || filter.board === currentBoard
        );

        // Prepare css updates in memory instead of directly manipulating the DOM
        const updates = new Map();

        // Process all cells in a single pass
        cachedCells.forEach(cell => {
            // Initialize update object if needed
            if (!updates.has(cell)) {
                updates.set(cell, {
                    display: '',
                    order: '0',
                    glow: false
                });
            }

            // Check for bumplocked threads first if option is enabled
            if (config.hideBumplocked) {
                const bumpLockIndicator = cell.querySelector('.bumpLockIndicator');
                if (bumpLockIndicator) {
                    updates.get(cell).display = 'none';
                    return; // Skip further processing for this cell
                }
            }

            // Cache the thread text to avoid repeated DOM access
            const subject = cell.querySelector('.labelSubject')?.textContent || '';
            const message = cell.querySelector('.divMessage')?.textContent || '';
            const text = `${subject} ${message}`;

            // Apply all applicable filters
            for (const filter of applicableFilters) {
                if (filter.pattern.test(text)) {
                    if (filter.action === 'remove') {
                        updates.get(cell).display = 'none';
                        break; // No need to check other filters
                    } else if (filter.action === 'setTop') {
                        updates.get(cell).order = '-1';
                        updates.get(cell).glow = true; // Mark for glow effect
                    }
                }
            }
        });

        // Apply all updates in a single batch
        updates.forEach((update, cell) => {
            cell.style.display = update.display;
            cell.style.order = update.order;

            // Apply or remove glow effect
            if (update.glow) {
                const intensity = config.glowIntensity;
                cell.style.boxShadow = `0 0 ${intensity}px ${intensity/2}px ${config.glowColor}`;
                cell.style.zIndex = '1'; // Make sure glowing cells appear above others
                cell.style.position = 'relative'; // Needed for z-index to work
            } else {
                cell.style.boxShadow = '';
                cell.style.zIndex = '';
                cell.style.position = '';
            }
        });

        // Make sure flex container is properly set for ordering to work
        if (!catalogDiv.style.display.includes('flex')) {
            catalogDiv.style.display = 'flex';
            catalogDiv.style.flexWrap = 'wrap';
        }
    }

    // Initialize the script
    function init() {
        loadConfig();

        // Add required CSS for flex ordering
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            #divThreads {
                display: flex !important;
                flex-wrap: wrap !important;
            }
            .catalogCell {
                order: 0; /* Default order */
                transition: box-shadow 0.3s ease; /* Smooth transition for glow effect */
            }
        `;
        document.head.appendChild(styleEl);

        createDashboard();

        // Initial catalog processing with slight delay to ensure page is ready
        setTimeout(() => {
            catalogDiv = document.getElementById('divThreads');
            cachedCells = Array.from(catalogDiv.querySelectorAll('.catalogCell'));
            processCatalog();
            updateActiveFiltersCount();
        }, 100);

        // Use a more efficient mutation observer with throttling
        let pendingUpdate = false;
        const observer = new MutationObserver(() => {
            if (!pendingUpdate) {
                pendingUpdate = true;
                requestAnimationFrame(() => {
                    // Reset cache when DOM changes
                    cachedCells = catalogDiv ? Array.from(catalogDiv.querySelectorAll('.catalogCell')) : [];
                    processCatalog();
                    pendingUpdate = false;
                });
            }
        });

        const threadsDiv = document.getElementById('divThreads');
        if (threadsDiv) {
            observer.observe(threadsDiv, { childList: true, subtree: false });
        }
    }

    // Wait for page to load completely
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();