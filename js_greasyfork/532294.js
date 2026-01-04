// ==UserScript==
// @name         MCS Enhanced Quick Row Search
// @namespace    http://telkomsat.co.id/
// @version      2.2.0
// @description  Advanced search tool for MCS activation tables with keyboard shortcuts and direct actions
// @author       Abedul
// @match        https://fabulous.telkomsat.co.id/fulfillment/aktivasi_sd/update/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532294/MCS%20Enhanced%20Quick%20Row%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/532294/MCS%20Enhanced%20Quick%20Row%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config & Constants
    const STORAGE_KEY = {
        POSITION: 'mcs_search_position',
        MINIMIZED: 'mcs_search_minimized',
        SEARCH_TYPE: 'mcs_search_type',
        NEW_TAB: 'mcs_open_new_tab',
        POSITION_LOCKED: 'mcs_position_locked'
    };

    const SEARCH_TYPES = {
        SID: 'sid',
        MCS_ID: 'mcs-id'
    };

    // Only run if this is an MCS product page
    function isMCSProductPage() {
        const productLabels = document.querySelectorAll('p.label');
        for (const label of productLabels) {
            if (label.textContent.trim() === 'Produk') {
                const parentRow = label.closest('tr');
                if (parentRow) {
                    const valueElem = parentRow.querySelector('p.detail-value');
                    if (valueElem) {
                        return valueElem.textContent.trim() === 'Mobile Connectivity Service (MCS)';
                    }
                }
                break;
            }
        }
        return false;
    }

    // Helper to get current user name from the page
    function getUserName() {
        const userNameElement = document.querySelector('p.name-user');
        if (userNameElement) {
            return userNameElement.textContent.trim();
        }
        return 'Unknown User';
    }

    // Add custom styles
    function addCustomStyles() {
        const css = `
            @keyframes pulse-highlight {
                0% { background-color: #ffeb3b; }
                50% { background-color: #fff9c4; }
                100% { background-color: #ffeb3b; }
            }

            .mcs-search-found-row {
                animation: pulse-highlight 2s infinite;
            }

            .mcs-search-widget {
                transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }

            .mcs-search-minimized {
                width: 50px !important;
                height: 50px !important;
                overflow: hidden;
                border-radius: 25px;
                padding: 0 !important;
            }

            .mcs-search-minimized .mcs-search-header {
                height: 50px;
                margin: 0 !important;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 25px;
                background-color: #4CAF50 !important;
            }

            .mcs-search-minimized .mcs-toggle-btn {
                color: white !important;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px !important;
                margin: 0;
            }

            .mcs-search-container > * {
                transition: opacity 0.2s ease-in-out;
            }

            .mcs-search-minimized .mcs-hide-when-minimized {
                opacity: 0;
                pointer-events: none;
            }

            .mcs-toggle-btn {
                transition: transform 0.3s ease;
            }

            .mcs-tooltip {
                position: relative;
            }

            .mcs-tooltip:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10;
            }

            /* Radio pill buttons */
            .mcs-radio-pill-container {
                display: flex;
                gap: 5px;
                margin-bottom: 8px;
                width: 100%;
            }

            .mcs-radio-pill {
                flex: 1;
                display: inline-block;
                padding: 6px 8px;
                background-color: #f0f0f0;
                border-radius: 15px;
                cursor: pointer;
                user-select: none;
                text-align: center;
                font-size: 13px;
                transition: all 0.2s ease;
                border: 1px solid #ddd;
            }

            .mcs-radio-pill:hover {
                background-color: #e0e0e0;
            }

            .mcs-radio-pill input[type="radio"] {
                display: none;
            }

            .mcs-radio-pill-active {
                background-color: #2196F3;
                color: white;
                border-color: #1976D2;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }

            /* Settings toggle */
            .mcs-settings-container {
                margin-top: 5px;
                padding-top: 5px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 5px;
            }

            .mcs-toggle-switch {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
                margin-right: 8px;
            }

            .mcs-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .mcs-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .3s;
                border-radius: 20px;
            }

            .mcs-toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .mcs-toggle-slider {
                background-color: #2196F3;
            }

            input:checked + .mcs-toggle-slider:before {
                transform: translateX(16px);
            }

            .mcs-toggle-label {
                font-size: 12px;
                user-select: none;
            }

            /* Search input with clear button */
            .mcs-search-input-wrapper {
                position: relative;
                flex: 1;
                margin-right: 5px;
            }

            .mcs-clear-button {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                color: #999;
                cursor: pointer;
                background: none;
                border: none;
                padding: 0;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }

            .mcs-clear-button:hover {
                opacity: 1;
            }

            .mcs-clear-button:active {
                opacity: 0.9;
            }

            .mcs-search-input {
                width: 100%;
                padding: 8px 28px 8px 8px;
                border: 1px solid #ccc;
                border-radius: 3px;
                outline: none;
            }

            /* Position lock */
            .mcs-header-actions {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .mcs-lock-button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                font-size: 14px;
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
            }

            .mcs-locked {
                color: #ff9800;
            }

            .mcs-lock-icon {
                width: 14px;
                height: 14px;
                display: inline-block;
            }
        `;

        // Add styles
        GM_addStyle(css);
    }

    // Save position to localStorage
    function savePosition(left, top) {
        localStorage.setItem(STORAGE_KEY.POSITION, JSON.stringify({left, top}));
    }

    // Load position from localStorage
    function loadPosition() {
        const savedPos = localStorage.getItem(STORAGE_KEY.POSITION);
        if (savedPos) {
            try {
                return JSON.parse(savedPos);
            } catch (e) {
                console.error("Error parsing saved position", e);
                return null;
            }
        }
        return null;
    }

    // Save minimized state
    function saveMinimizedState(isMinimized) {
        localStorage.setItem(STORAGE_KEY.MINIMIZED, isMinimized ? '1' : '0');
    }

    // Load minimized state
    function loadMinimizedState() {
        return localStorage.getItem(STORAGE_KEY.MINIMIZED) === '1';
    }

    // Save position lock state
    function savePositionLockState(isLocked) {
        localStorage.setItem(STORAGE_KEY.POSITION_LOCKED, isLocked ? '1' : '0');
    }

    // Load position lock state
    function loadPositionLockState() {
        return localStorage.getItem(STORAGE_KEY.POSITION_LOCKED) === '1';
    }

    // Save search type preference
    function saveSearchType(type) {
        localStorage.setItem(STORAGE_KEY.SEARCH_TYPE, type);
    }

    // Load search type preference
    function loadSearchType() {
        return localStorage.getItem(STORAGE_KEY.SEARCH_TYPE) || SEARCH_TYPES.SID;
    }

    // Save new tab preference
    function saveNewTabPreference(useNewTab) {
        localStorage.setItem(STORAGE_KEY.NEW_TAB, useNewTab ? '1' : '0');
    }

    // Load new tab preference
    function loadNewTabPreference() {
        // Default to true if not set (open in new tab by default)
        const savedPref = localStorage.getItem(STORAGE_KEY.NEW_TAB);
        return savedPref === null ? true : savedPref === '1';
    }

    // Wait for page to fully load
    window.addEventListener('load', function() {
        if (!isMCSProductPage()) {
            console.log("Not an MCS product page - search tool not loaded");
            return;
        }

        console.log("MCS product page detected - initializing enhanced quick search");

        // Add custom styles
        addCustomStyles();

        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'mcs-search-widget mcs-search-container';
        searchContainer.style.position = 'fixed';
        searchContainer.style.top = '100px';
        searchContainer.style.right = '20px';
        searchContainer.style.zIndex = '9999';
        searchContainer.style.background = '#fff';
        searchContainer.style.padding = '10px';
        searchContainer.style.borderRadius = '5px';
        searchContainer.style.width = '320px';

        // Load saved position if available
        const savedPos = loadPosition();
        if (savedPos) {
            searchContainer.style.top = `${savedPos.top}px`;
            searchContainer.style.left = `${savedPos.left}px`;
            searchContainer.style.right = 'auto';
        }

        // Create search header with draggable capability and minimize button
        const searchHeader = document.createElement('div');
        searchHeader.className = 'mcs-search-header';
        searchHeader.style.padding = '5px';
        searchHeader.style.marginBottom = '10px';
        searchHeader.style.background = '#f0f0f0';
        searchHeader.style.borderRadius = '4px';
        searchHeader.style.cursor = 'move';
        searchHeader.style.display = 'flex';
        searchHeader.style.justifyContent = 'space-between';
        searchHeader.style.alignItems = 'center';

        const headerTitle = document.createElement('span');
        headerTitle.textContent = 'MCS Search';
        headerTitle.style.fontWeight = 'bold';

        const headerActions = document.createElement('div');
        headerActions.className = 'mcs-header-actions';

        // Position lock button
        const lockBtn = document.createElement('button');
        lockBtn.className = 'mcs-lock-button mcs-tooltip';
        lockBtn.setAttribute('data-tooltip', 'Lock position');
        lockBtn.innerHTML = '🔓';

        // Initialize lock state
        const isPositionLocked = loadPositionLockState();
        if (isPositionLocked) {
            lockBtn.innerHTML = '🔒';
            lockBtn.classList.add('mcs-locked');
            lockBtn.setAttribute('data-tooltip', 'Unlock position');
        }

        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'mcs-toggle-btn';
        minimizeBtn.innerHTML = '&minus;'; // Minus sign
        minimizeBtn.style.background = 'none';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.fontSize = '16px';
        minimizeBtn.style.padding = '0';
        minimizeBtn.style.width = '24px';
        minimizeBtn.style.height = '24px';
        minimizeBtn.style.display = 'flex';
        minimizeBtn.style.alignItems = 'center';
        minimizeBtn.style.justifyContent = 'center';
        minimizeBtn.setAttribute('data-tooltip', 'Minimize');
        minimizeBtn.className = 'mcs-tooltip mcs-toggle-btn';

        headerActions.appendChild(lockBtn);
        headerActions.appendChild(minimizeBtn);
        searchHeader.appendChild(headerTitle);
        searchHeader.appendChild(headerActions);

        // Create search type radio buttons (pills)
        const radioPillContainer = document.createElement('div');
        radioPillContainer.className = 'mcs-radio-pill-container mcs-hide-when-minimized';

        // Load saved search type
        const savedSearchType = loadSearchType();

        // SID radio pill
        const sidPill = document.createElement('label');
        sidPill.className = 'mcs-radio-pill' + (savedSearchType === SEARCH_TYPES.SID ? ' mcs-radio-pill-active' : '');
        sidPill.setAttribute('for', 'mcs-search-type-sid');

        const sidRadio = document.createElement('input');
        sidRadio.type = 'radio';
        sidRadio.id = 'mcs-search-type-sid';
        sidRadio.name = 'mcs-search-type';
        sidRadio.value = SEARCH_TYPES.SID;
        sidRadio.checked = savedSearchType === SEARCH_TYPES.SID;

        const sidLabel = document.createElement('span');
        sidLabel.textContent = 'Search by SID';

        sidPill.appendChild(sidRadio);
        sidPill.appendChild(sidLabel);

        // MCS-ID radio pill
        const mcsIdPill = document.createElement('label');
        mcsIdPill.className = 'mcs-radio-pill' + (savedSearchType === SEARCH_TYPES.MCS_ID ? ' mcs-radio-pill-active' : '');
        mcsIdPill.setAttribute('for', 'mcs-search-type-mcsid');

        const mcsIdRadio = document.createElement('input');
        mcsIdRadio.type = 'radio';
        mcsIdRadio.id = 'mcs-search-type-mcsid';
        mcsIdRadio.name = 'mcs-search-type';
        mcsIdRadio.value = SEARCH_TYPES.MCS_ID;
        mcsIdRadio.checked = savedSearchType === SEARCH_TYPES.MCS_ID;

        const mcsIdLabel = document.createElement('span');
        mcsIdLabel.textContent = 'Search by MCS-ID';

        mcsIdPill.appendChild(mcsIdRadio);
        mcsIdPill.appendChild(mcsIdLabel);

        radioPillContainer.appendChild(sidPill);
        radioPillContainer.appendChild(mcsIdPill);

        // Create search input with clear button
        const searchInputContainer = document.createElement('div');
        searchInputContainer.className = 'mcs-hide-when-minimized';
        searchInputContainer.style.display = 'flex';
        searchInputContainer.style.marginBottom = '8px';

        const searchInputWrapper = document.createElement('div');
        searchInputWrapper.className = 'mcs-search-input-wrapper';

        const searchInput = document.createElement('input');
        searchInput.className = 'mcs-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = savedSearchType === SEARCH_TYPES.SID ? 'Enter SID to search...' : 'Enter MCS-ID to search...';

        const clearButton = document.createElement('button');
        clearButton.className = 'mcs-clear-button';
        clearButton.innerHTML = '✕';
        clearButton.setAttribute('data-tooltip', 'Clear');
        clearButton.type = 'button';

        searchInputWrapper.appendChild(searchInput);
        searchInputWrapper.appendChild(clearButton);

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.style.padding = '5px 10px';
        searchButton.style.backgroundColor = '#4CAF50';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '3px';
        searchButton.style.cursor = 'pointer';

        searchInputContainer.appendChild(searchInputWrapper);
        searchInputContainer.appendChild(searchButton);

        // Create action buttons (initially disabled)
        const actionRow = document.createElement('div');
        actionRow.className = 'mcs-hide-when-minimized';
        actionRow.style.display = 'flex';
        actionRow.style.gap = '8px';
        actionRow.style.marginBottom = '8px';

        const ubahButton = document.createElement('button');
        ubahButton.textContent = 'Ubah';
        ubahButton.style.flex = '1';
        ubahButton.style.padding = '8px';
        ubahButton.style.backgroundColor = '#2196F3';
        ubahButton.style.color = 'white';
        ubahButton.style.border = 'none';
        ubahButton.style.borderRadius = '3px';
        ubahButton.style.cursor = 'pointer';
        ubahButton.disabled = true;
        ubahButton.style.opacity = '0.6';

        const uploadButton = document.createElement('button');
        uploadButton.textContent = 'Upload BAA';
        uploadButton.style.flex = '1';
        uploadButton.style.padding = '8px';
        uploadButton.style.backgroundColor = '#FF9800';
        uploadButton.style.color = 'white';
        uploadButton.style.border = 'none';
        uploadButton.style.borderRadius = '3px';
        uploadButton.style.cursor = 'pointer';
        uploadButton.disabled = true;
        uploadButton.style.opacity = '0.6';

        actionRow.appendChild(ubahButton);
        actionRow.appendChild(uploadButton);

        // Create status message area
        const statusDiv = document.createElement('div');
        statusDiv.className = 'mcs-hide-when-minimized';
        statusDiv.style.marginTop = '8px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.color = '#666';
        statusDiv.textContent = 'Ready to search';

        // Create "Open in new tab" toggle
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'mcs-settings-container mcs-hide-when-minimized';

        // Create toggle switch
        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'mcs-toggle-switch';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = loadNewTabPreference(); // Default to true

        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'mcs-toggle-slider';

        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(toggleSlider);

        // Create toggle label
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'mcs-toggle-label';
        toggleLabel.textContent = 'Open links in new tab';

        settingsContainer.appendChild(toggleSwitch);
        settingsContainer.appendChild(toggleLabel);

        // Add event listener for toggle change
        toggleInput.addEventListener('change', function() {
            saveNewTabPreference(this.checked);
        });

        // Add user info with current user name extracted from page
        const userName = getUserName();
        const creditDiv = document.createElement('div');
        creditDiv.className = 'mcs-hide-when-minimized';
        creditDiv.style.marginTop = '5px';
        creditDiv.style.fontSize = '10px';
        creditDiv.style.color = '#999';
        creditDiv.style.textAlign = 'right';
        creditDiv.textContent = `User: ${userName}`;

        // Create keyboard shortcut info
        const shortcutInfo = document.createElement('div');
        shortcutInfo.className = 'mcs-hide-when-minimized';
        shortcutInfo.style.marginTop = '5px';
        shortcutInfo.style.fontSize = '10px';
        shortcutInfo.style.color = '#666';
        shortcutInfo.style.borderTop = '1px solid #f0f0f0';
        shortcutInfo.style.paddingTop = '5px';
        shortcutInfo.innerHTML = '<b>Shortcuts:</b> Ctrl+Shift+F to focus, Ctrl+Enter to search, Up/Down arrows to navigate results';

        // Assemble the components
        searchContainer.appendChild(searchHeader);
        searchContainer.appendChild(radioPillContainer);
        searchContainer.appendChild(searchInputContainer);
        searchContainer.appendChild(actionRow);
        searchContainer.appendChild(statusDiv);
        searchContainer.appendChild(settingsContainer);
        searchContainer.appendChild(creditDiv);
        searchContainer.appendChild(shortcutInfo);
        document.body.appendChild(searchContainer);

        // Make the widget draggable only when not locked
        if (!isPositionLocked) {
            makeDraggable(searchContainer, searchHeader);
        }

        // Handle position lock button click
        lockBtn.addEventListener('click', function() {
            const isCurrentlyLocked = this.classList.contains('mcs-locked');

            if (isCurrentlyLocked) {
                // Unlock
                this.innerHTML = '🔓';
                this.classList.remove('mcs-locked');
                this.setAttribute('data-tooltip', 'Lock position');
                makeDraggable(searchContainer, searchHeader);
                savePositionLockState(false);
            } else {
                // Lock
                this.innerHTML = '🔒';
                this.classList.add('mcs-locked');
                this.setAttribute('data-tooltip', 'Unlock position');
                searchHeader.onmousedown = null; // Remove drag handler
                savePositionLockState(true);
            }
        });

        // Set up minimize/maximize functionality
        minimizeBtn.addEventListener('click', () => {
            const isCurrentlyMinimized = searchContainer.classList.contains('mcs-search-minimized');
            if (isCurrentlyMinimized) {
                // Maximize
                searchContainer.classList.remove('mcs-search-minimized');
                minimizeBtn.innerHTML = '&minus;'; // Minus sign
                minimizeBtn.setAttribute('data-tooltip', 'Minimize');
                saveMinimizedState(false);
            } else {
                // Minimize
                searchContainer.classList.add('mcs-search-minimized');
                minimizeBtn.innerHTML = '&#x2b;'; // Plus sign
                minimizeBtn.setAttribute('data-tooltip', 'Expand');
                saveMinimizedState(true);
            }
        });

        // Initialize minimize state from localStorage
        if (loadMinimizedState()) {
            searchContainer.classList.add('mcs-search-minimized');
            minimizeBtn.innerHTML = '&#x2b;'; // Plus sign
            minimizeBtn.setAttribute('data-tooltip', 'Expand');
        }

        // Set up clear button functionality
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
        });

        // Set up radio pill change handlers
        sidRadio.addEventListener('change', function() {
            if (this.checked) {
                sidPill.classList.add('mcs-radio-pill-active');
                mcsIdPill.classList.remove('mcs-radio-pill-active');
                saveSearchType(SEARCH_TYPES.SID);
                searchInput.placeholder = 'Enter SID to search...';
            }
        });

        mcsIdRadio.addEventListener('change', function() {
            if (this.checked) {
                mcsIdPill.classList.add('mcs-radio-pill-active');
                sidPill.classList.remove('mcs-radio-pill-active');
                saveSearchType(SEARCH_TYPES.MCS_ID);
                searchInput.placeholder = 'Enter MCS-ID to search...';
            }
        });

        // Search functionality
        let foundRowData = null;
        let lastHighlightedRows = [];
        let matchingRows = [];
        let currentMatchIndex = 0;
        let totalMatches = 0;

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+F to focus search input
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault(); // Prevent browser's find function

                // If minimized, maximize first
                if (searchContainer.classList.contains('mcs-search-minimized')) {
                    searchContainer.classList.remove('mcs-search-minimized');
                    minimizeBtn.innerHTML = '&minus;'; // Minus sign
                    minimizeBtn.setAttribute('data-tooltip', 'Minimize');
                    saveMinimizedState(false);
                }

                searchInput.focus();
            }

            // Ctrl+Enter to search when input is focused
            if (e.ctrlKey && e.key === 'Enter' && document.activeElement === searchInput) {
                performSearch();
            }

            // Up/Down arrows to navigate between results
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && totalMatches > 1 && matchingRows.length > 0) {
                e.preventDefault(); // Prevent page scrolling

                if (e.key === 'ArrowUp') {
                    // Move to previous match
                    if (currentMatchIndex > 0) {
                        navigateToMatch(currentMatchIndex - 1);
                    }
                } else {
                    // Move to next match
                    if (currentMatchIndex < totalMatches - 1) {
                        navigateToMatch(currentMatchIndex + 1);
                    }
                }
            }
        });

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Function to find Ubah link in a cell (supports both old dropdown and new button structure)
        function findUbahLink(actionCell) {
            // Try the new direct button format first
            let ubahLink = actionCell.querySelector('a.mcs-action-btn.mcs-ubah-btn');

            // If not found, try the old dropdown format
            if (!ubahLink) {
                ubahLink = actionCell.querySelector('a.dropdown-item[href*="/aktivasi_no/ubah_nota/"]');
            }

            return ubahLink ? ubahLink.getAttribute('href') : null;
        }

        // Function to find Upload BAA button in a cell (supports both formats)
        function findUploadButton(actionCell) {
            // Try the new direct button format first
            let uploadBtn = actionCell.querySelector('button.mcs-action-btn.upload_baa');

            // If not found, try the old dropdown format
            if (!uploadBtn) {
                uploadBtn = actionCell.querySelector('button.upload_baa');
            }

            if (uploadBtn) {
                return {
                    dataId: uploadBtn.getAttribute('data-id'),
                    dataTglOnline: uploadBtn.getAttribute('data-tgl_online') || '',
                    dataTarget: uploadBtn.getAttribute('data-target'),
                    dataToggle: uploadBtn.getAttribute('data-toggle')
                };
            }

            return null;
        }

        function performSearch() {
            const searchTerm = searchInput.value.trim();
            const searchType = sidRadio.checked ? SEARCH_TYPES.SID : SEARCH_TYPES.MCS_ID;

            if (!searchTerm) {
                statusDiv.textContent = 'Please enter a search term';
                statusDiv.style.color = '#ff3333';
                return;
            }

            statusDiv.textContent = 'Searching...';
            statusDiv.style.color = '#666';

            // Reset previous search
            ubahButton.disabled = true;
            ubahButton.style.opacity = '0.6';
            uploadButton.disabled = true;
            uploadButton.style.opacity = '0.6';
            foundRowData = null;

            // Remove previous highlights
            for (const row of lastHighlightedRows) {
                row.style.backgroundColor = '';
                row.classList.remove('mcs-search-found-row');
            }
            lastHighlightedRows = [];
            matchingRows = [];

            // Get all rows from the table
            const tableRows = document.querySelectorAll('#table-nota tbody tr');

            for (const row of tableRows) {
                let cellToSearch;

                if (searchType === SEARCH_TYPES.SID) {
                    cellToSearch = row.querySelector('td:first-child'); // First column for SID
                } else {
                    cellToSearch = row.querySelector('td:nth-child(2)'); // Second column for MCS-ID
                }

                if (!cellToSearch) continue;

                const cellText = cellToSearch.textContent || '';

                // Search for term in the text content
                if (cellText.toLowerCase().includes(searchTerm.toLowerCase())) {
                    const actionCell = row.querySelector('td:last-child');
                    if (!actionCell) continue;

                    // Extract Ubah link and Upload BAA button data using the new helper functions
                    const ubahUrl = findUbahLink(actionCell);
                    const uploadData = findUploadButton(actionCell);

                    if (ubahUrl || (uploadData && uploadData.dataId)) {
                        matchingRows.push({
                            row,
                            rowData: {
                                ubahUrl,
                                ...(uploadData ? {
                                    dataId: uploadData.dataId,
                                    dataTglOnline: uploadData.dataTglOnline,
                                    dataTarget: uploadData.dataTarget,
                                    dataToggle: uploadData.dataToggle
                                } : {})
                            }
                        });
                    }
                }
            }

            // Process search results
            totalMatches = matchingRows.length;

            if (totalMatches > 0) {
                // Update currentMatchIndex
                currentMatchIndex = 0;

                // Store all highlighted rows for later cleanup
                for (const match of matchingRows) {
                    lastHighlightedRows.push(match.row);
                }

                // Highlight all matching rows with a subtle background
                for (const match of matchingRows) {
                    match.row.style.backgroundColor = '#f8f9fa';
                }

                // Highlight the current match with animation and scroll to it
                const currentMatch = matchingRows[currentMatchIndex];
                foundRowData = currentMatch.rowData;

                currentMatch.row.style.backgroundColor = '#FFFDE7';
                currentMatch.row.classList.add('mcs-search-found-row');

                setTimeout(() => {
                    currentMatch.row.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);

                // Enable buttons if data is available
                if (foundRowData.ubahUrl) {
                    ubahButton.disabled = false;
                    ubahButton.style.opacity = '1';
                }

                if (foundRowData.dataId) {
                    uploadButton.disabled = false;
                    uploadButton.style.opacity = '1';
                }

                // Update status with match count
                if (totalMatches === 1) {
                    statusDiv.textContent = `Found 1 match`;
                } else {
                    statusDiv.textContent = `Found ${totalMatches} matches - showing match 1/${totalMatches}`;

                    // Add navigation buttons for multiple matches
                    const navButtons = document.createElement('div');
                    navButtons.style.marginTop = '5px';
                    navButtons.style.display = 'flex';
                    navButtons.style.justifyContent = 'space-between';

                    const prevBtn = document.createElement('button');
                    prevBtn.textContent = '↑ Sebelumnya';
                    prevBtn.style.fontSize = '12px';
                    prevBtn.style.padding = '3px 8px';
                    prevBtn.style.backgroundColor = '#f0f0f0';
                    prevBtn.style.border = 'none';
                    prevBtn.style.borderRadius = '3px';
                    prevBtn.style.cursor = 'pointer';
                    prevBtn.disabled = true;

                    const nextBtn = document.createElement('button');
                    nextBtn.textContent = 'Berikutnya ↓';
                    nextBtn.style.fontSize = '12px';
                    nextBtn.style.padding = '3px 8px';
                    nextBtn.style.backgroundColor = '#f0f0f0';
                    nextBtn.style.border = 'none';
                    nextBtn.style.borderRadius = '3px';
                    nextBtn.style.cursor = 'pointer';

                    navButtons.appendChild(prevBtn);
                    navButtons.appendChild(nextBtn);

                    // Replace any existing nav buttons
                    const existingNavButtons = statusDiv.querySelector('div');
                    if (existingNavButtons) {
                        statusDiv.removeChild(existingNavButtons);
                    }

                    statusDiv.appendChild(navButtons);

                    // Navigation button handlers
                    prevBtn.addEventListener('click', () => {
                        if (currentMatchIndex > 0) {
                            navigateToMatch(currentMatchIndex - 1);
                            if (currentMatchIndex === 0) {
                                prevBtn.disabled = true;
                            }
                            nextBtn.disabled = false;
                        }
                    });

                    nextBtn.addEventListener('click', () => {
                        if (currentMatchIndex < totalMatches - 1) {
                            navigateToMatch(currentMatchIndex + 1);
                            if (currentMatchIndex === totalMatches - 1) {
                                nextBtn.disabled = true;
                            }
                            prevBtn.disabled = false;
                        }
                    });
                }

                statusDiv.style.color = '#4CAF50';
            } else {
                statusDiv.textContent = 'No matching rows found';
                statusDiv.style.color = '#ff3333';
            }
        }

        function navigateToMatch(newIndex) {
            if (newIndex < 0 || newIndex >= matchingRows.length) return;

            // Remove highlight from current match
            matchingRows[currentMatchIndex].row.classList.remove('mcs-search-found-row');
            matchingRows[currentMatchIndex].row.style.backgroundColor = '#f8f9fa';

            // Update index
            currentMatchIndex = newIndex;

            // Highlight new current match
            const currentMatch = matchingRows[currentMatchIndex];
            currentMatch.row.style.backgroundColor = '#FFFDE7';
            currentMatch.row.classList.add('mcs-search-found-row');
            foundRowData = currentMatch.rowData;

            // Update buttons based on available actions
            ubahButton.disabled = !foundRowData.ubahUrl;
            ubahButton.style.opacity = foundRowData.ubahUrl ? '1' : '0.6';

            uploadButton.disabled = !foundRowData.dataId;
            uploadButton.style.opacity = foundRowData.dataId ? '1' : '0.6';

            // Scroll to match
            setTimeout(() => {
                currentMatch.row.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);

            // Update status text if it contains match info
            if (statusDiv.childNodes[0] && statusDiv.childNodes[0].nodeValue && statusDiv.childNodes[0].nodeValue.includes('showing match')) {
                statusDiv.childNodes[0].nodeValue = `Found ${totalMatches} matches - showing match ${currentMatchIndex + 1}/${totalMatches}`;
            }
        }

        // Action button handlers
        ubahButton.addEventListener('click', function() {
            if (foundRowData && foundRowData.ubahUrl) {
                // Check if we should open in new tab
                const openInNewTab = toggleInput.checked;

                if (openInNewTab) {
                    // Open in new tab
                    window.open(foundRowData.ubahUrl, '_blank');
                } else {
                    // Open in same tab
                    window.location.href = foundRowData.ubahUrl;
                }
            } else {
                statusDiv.textContent = 'Error: No URL available for this action';
                statusDiv.style.color = '#ff3333';
            }
        });

        uploadButton.addEventListener('click', function() {
            if (foundRowData && foundRowData.dataId) {
                try {
                    // Get the modal element
                    const modalElement = document.querySelector(foundRowData.dataTarget);
                    if (modalElement) {
                        // Set the data in the form
                        const idField = modalElement.querySelector('#wn_id');
                        if (idField) {
                            idField.value = foundRowData.dataId;
                        }

                        // Show the modal
                        $(foundRowData.dataTarget).modal('show');
                    } else {
                        throw new Error('Modal element not found');
                    }
                } catch (error) {
                    statusDiv.textContent = `Error opening modal: ${error.message}`;
                    statusDiv.style.color = '#ff3333';
                    console.error('Error showing modal:', error);
                }
            } else {
                statusDiv.textContent = 'Error: No data available for this action';
                statusDiv.style.color = '#ff3333';
            }
        });

        // Add timestamp and user information to console log
        console.log(`MCS Quick Search loaded at: 2025-04-10 04:12:38`);
        console.log(`Current user: opqdul`);
    });

    // Function to make an element draggable
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;

            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Set the element's new position
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = "auto"; // Override any right positioning

            // Save position to localStorage
            savePosition(newLeft, newTop);
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();