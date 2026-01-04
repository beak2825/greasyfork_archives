// ==UserScript==
// @name         Auto Refresh Interface for Hotsauce
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Auto refresh for HotSOS
// @author       PC
// @match        https://na4.m-tech.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534302/Auto%20Refresh%20Interface%20for%20Hotsauce.user.js
// @updateURL https://update.greasyfork.org/scripts/534302/Auto%20Refresh%20Interface%20for%20Hotsauce.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Simplified CSS
    GM_addStyle(`
        #auto-refresh-container {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 8px 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 150px;
            max-width: 200px;
            user-select: none;
            font-size: 12px;
        }
        #auto-refresh-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
            padding-bottom: 6px;
            border-bottom: 1px solid #eee;
        }
        #auto-refresh-title {
            font-weight: bold;
            color: #444;
        }
        #auto-refresh-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #auto-refresh-collapse {
            cursor: pointer;
            font-size: 14px;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        #auto-refresh-body {
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        #auto-refresh-presets {
            padding-bottom: 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        .auto-refresh-preset {
            display: inline-block;
            background-color: #e9e9e9;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            margin: 3px;
            cursor: pointer;
            font-size: 11px;
        }
        .auto-refresh-preset:hover {
            background-color: #d9d9d9;
        }
        .auto-refresh-preset.active {
            background-color: #4a89dc;
            color: white;
        }
        .auto-refresh-disabled .auto-refresh-preset {
            opacity: 0.5;
            cursor: default;
        }
        #auto-refresh-status {
            margin-top: 6px;
            font-size: 11px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-top: 2px;
        }
        #auto-refresh-status.warning { color: #f44336; }
        #auto-refresh-status.info { color: #9e9e9e; }
        #auto-refresh-status.success { color: #4caf50; }
        #auto-refresh-edit-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #auto-refresh-edit-panel {
            background-color: white;
            border-radius: 6px;
            padding: 16px;
            width: 250px;
        }
        .auto-refresh-form-label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
            font-size: 12px;
        }
        .auto-refresh-form-input {
            width: 100%;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
        }
        .auto-refresh-form-buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
        .auto-refresh-form-button {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            margin-left: 8px;
            cursor: pointer;
            font-size: 12px;
        }
        .auto-refresh-form-button.cancel { background-color: #f5f5f5; }
        .auto-refresh-form-button.save {
            background-color: #4a89dc;
            color: white;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 32px;
            height: 16px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .3s;
            border-radius: 16px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #4a89dc;
        }
        input:checked + .slider:before {
            transform: translateX(16px);
        }
        /* Feature toggle style */
        .feature-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        .feature-label {
            font-size: 11px;
            color: #444;
        }
        /* User Tip styles */
        #auto-refresh-tip {
            font-size: 10px;
            color: #666;
            margin-top: 4px;
            margin-bottom: 8px;
            line-height: 1.2;
            border-radius: 3px;
            overflow: hidden;
        }
        #auto-refresh-tip-header {
            display: flex;
            background-color: #e0e0e0;
            padding: 4px 6px;
            font-weight: bold;
            border-left: 2px solid #4a89dc;
            cursor: pointer;
        }
        #auto-refresh-tip-content {
            padding: 0;
            background-color: #f0f0f0;
            font-style: italic;
            border-left: 2px solid #4a89dc;
            max-height: 0;
            transition: all 0.3s ease;
            overflow: hidden;
            opacity: 0;
        }
        #auto-refresh-tip-content.expanded {
            padding: 6px;
            max-height: 50px;
            opacity: 1;
        }
    `);

    // Default presets
    const DEFAULT_PRESETS = [
        { name: '15s', seconds: 15 },
        { name: '30s', seconds: 30 },
        { name: '1min', seconds: 60 },
        { name: '5min', seconds: 300 }
    ];

    // Time-based schedule with direct second values
    const TIME_SCHEDULE = [
        { start: [8, 0], end: [11, 0], seconds: 15, name: '15s' },
        { start: [11, 0], end: [13, 0], seconds: 30, name: '30s' },
        { start: [13, 0], end: [17, 0], seconds: 60, name: '1min' },
        { start: [17, 0], end: [20, 0], seconds: 30, name: '30s' },
        { start: [20, 0], end: [1, 0], seconds: 60, name: '1min' },
        { start: [1, 0], end: [8, 0], seconds: 300, name: '5min' }
    ];

    // Predefined time options for dropdown
    const TIME_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 120, 180, 240, 300, 360, 420, 480, 540];

    // Simplified state management
    let state = {
        enabled: true,
        collapsed: false,
        activePreset: null,
        userSelectedPreset: null, // Track user's manually selected preset
        presets: GM_getValue('autoRefreshPresets', DEFAULT_PRESETS),
        position: GM_getValue('autoRefreshPosition', { x: 20, y: 20 }),
        refreshTimer: null,
        lastRefreshTime: null,
        editingPreset: null,
        onServiceOrdersPage: false,
        initialized: false,
        observerDebounce: false,
        refreshButtonObserved: false,
        isDragging: false,
        tipExpanded: false,
        pendingRefresh: false, // Flag to prevent duplicate refreshes

        // Feature flags
        useTimeBasedPresets: GM_getValue('autoRefreshUseTimeBasedPresets', true),
        jitterEnabled: true, // Always enabled but hidden from user

        // Time-based preset tracking
        currentTimePreset: null,
        timeCheckInterval: null,
        lastPresetChangeTime: null // Track when preset was last changed
    };

    // Check if we're on the service orders page
    function checkIfOnServiceOrdersPage() {
        try {
            // Check if URL matches the service orders page pattern
            const isServiceOrdersURL = window.location.href.includes('/service-optimization/operations/service-orders');
            const refreshButton = findRefreshButton();

            // Only consider it a service orders page if both conditions are met
            state.onServiceOrdersPage = isServiceOrdersURL && !!refreshButton;

            // Update UI visibility based on page type
            const container = document.getElementById('auto-refresh-container');
            if (container) {
                container.style.display = state.onServiceOrdersPage ? 'block' : 'none';
            }

            if (state.onServiceOrdersPage && !state.refreshButtonObserved && refreshButton) {
                observeRefreshButton(refreshButton);
            }

            return state.onServiceOrdersPage;
        } catch (error) {
            console.error('Error checking page type:', error);
            return false;
        }
    }

    // Observe the refresh button for manual clicks
    function observeRefreshButton(button) {
        if (!button || state.refreshButtonObserved) return;

        button.addEventListener('click', function() {
            if (state.enabled) {
                // Update last refresh time
                state.lastRefreshTime = new Date();

                // Clear any pending refresh
                clearAutoRefresh();

                // Don't immediately refresh again, just schedule next refresh
                scheduleNextRefresh(state.activePreset);

                // Update status with improved format
                updateStatusWithRefreshInfo();
            }
        });

        state.refreshButtonObserved = true;
    }

    // Find refresh button - optimized selector search
    function findRefreshButton() {
        try {
            // Try specific selectors first for better performance
            const selectors = [
                'button[soe-data-cy="refresh"]',
                'button[mat-icon-button] soe-icon[icon="refresh-dot"]',
                'button[mat-icon-button] soe-icon[icon="refresh"]',
                'button[aria-label="refresh"]'
            ];

            for (const selector of selectors) {
                const button = document.querySelector(selector);
                if (button) return button;
            }

            // Fallback to broader search
            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                if (button.innerHTML.toLowerCase().includes('refresh') ||
                    button.innerHTML.toLowerCase().includes('refresh-dot')) {
                    return button;
                }
            }
            return null;
        } catch (error) {
            console.error('Error finding refresh button:', error);
            return null;
        }
    }

    // Format time as HH:MM:SS
    function formatTime(date) {
        if (!date) return 'Never';
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    }

    // Update status message with improved format
    function updateStatusWithRefreshInfo() {
        if (!state.enabled) {
            updateStatus('info', 'Auto refresh is off');
            return;
        }

        if (!state.activePreset) {
            updateStatus('info', 'Select a refresh interval');
            return;
        }

        const lastTime = state.lastRefreshTime ? `${formatTime(state.lastRefreshTime)}` : '';
        updateStatus('success', `Last checked : ${lastTime}`);
    }

    // Update status message
    function updateStatus(type, message) {
        const statusEl = document.getElementById('auto-refresh-status');
        if (statusEl) {
            statusEl.className = type || '';
            statusEl.textContent = message || '';
        }
    }

    // Get jittered interval based on base seconds
    function getJitteredInterval(baseSeconds) {
        // Calculate jitter based on the base time
        if (baseSeconds <= 15) {
            // For minimum time (15s), only add positive jitter (up to +25%)
            return baseSeconds + (baseSeconds * 0.25 * Math.random());
        } else if (baseSeconds >= 540) { // 9 minutes in seconds
            // For maximum time (9min), only subtract jitter (up to -25%)
            return baseSeconds - (baseSeconds * 0.25 * Math.random());
        } else {
            // For all other values, add random jitter between -25% and +25%
            return baseSeconds * (1 + (Math.random() * 0.5 - 0.25));
        }
    }

    // Get the appropriate time-based interval in seconds
    function getTimeBasedInterval() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Convert current time to decimal hours for easier comparison
        const currentTimeDecimal = currentHour + (currentMinute / 60);

        // Find the matching time range
        for (const timeSlot of TIME_SCHEDULE) {
            const [startHour, startMinute] = timeSlot.start;
            const [endHour, endMinute] = timeSlot.end;

            // Convert to decimal hours
            let startTimeDecimal = startHour + (startMinute / 60);
            let endTimeDecimal = endHour + (endMinute / 60);

            // Handle overnight ranges (e.g., 20:00 - 1:00)
            if (endTimeDecimal < startTimeDecimal) {
                if (currentTimeDecimal >= startTimeDecimal || currentTimeDecimal < endTimeDecimal) {
                    return timeSlot;
                }
            } else {
                if (currentTimeDecimal >= startTimeDecimal && currentTimeDecimal < endTimeDecimal) {
                    return timeSlot;
                }
            }
        }

        // Default to 30s if no match found (shouldn't happen with a complete schedule)
        return { seconds: 30, name: '30s' };
    }

    // Get time-based preset
    function getTimeBasedPreset() {
        const timeSlot = getTimeBasedInterval();

        // Look for a matching preset first
        const matchingPreset = state.presets.find(p => p.seconds === timeSlot.seconds);

        if (matchingPreset) {
            return matchingPreset;
        } else {
            // Return a virtual preset if no matching preset exists
            return {
                name: timeSlot.name,
                seconds: timeSlot.seconds,
                isVirtual: true  // Mark as virtual preset
            };
        }
    }

    // Start time check interval
    function startTimeCheck() {
        if (state.timeCheckInterval) {
            clearInterval(state.timeCheckInterval);
        }

        // Immediately update current time preset
        updateCurrentTimePreset();

        // Check periodically for time-based interval changes
        state.timeCheckInterval = setInterval(() => {
            // Only check and apply if time-based presets are enabled
            if (state.useTimeBasedPresets) {
                const previousTimePreset = state.currentTimePreset;
                updateCurrentTimePreset();

                // Apply the new preset if we've changed time slots
                if (previousTimePreset && state.currentTimePreset &&
                    previousTimePreset.seconds !== state.currentTimePreset.seconds) {
                    applyCurrentTimePreset();
                }
            }
        }, 300000); // Check every 5 minutes
    }

    // Update the current time-based preset
    function updateCurrentTimePreset() {
        state.currentTimePreset = getTimeBasedPreset();
    }

    // Apply the current time-based preset
    function applyCurrentTimePreset() {
        if (!state.currentTimePreset || !state.onServiceOrdersPage) {
            return;
        }

        // Record when preset was changed
        state.lastPresetChangeTime = new Date();

        // Completely clear any existing refresh
        clearAutoRefresh();

        // Set the active preset to the current time preset
        state.activePreset = state.currentTimePreset;

        // Start auto refresh with this preset if enabled
        if (state.enabled) {
            // Don't trigger immediate refresh if we recently refreshed
            const shouldTriggerNow = !state.lastRefreshTime ||
                (new Date() - state.lastRefreshTime > 10000); // 10 seconds threshold

            startAutoRefresh(state.activePreset, !shouldTriggerNow);
        } else {
            // Just update the UI to highlight the correct preset
            updateActivePreset();
        }
    }

    // Trigger refresh click
    function triggerRefresh() {
        // Prevent double refresh by checking the pendingRefresh flag
        if (state.pendingRefresh) {
            return false;
        }

        state.pendingRefresh = true;

        const refreshButton = findRefreshButton();
        if (refreshButton) {
            refreshButton.click();
            state.lastRefreshTime = new Date();

            // Update status with improved format
            updateStatusWithRefreshInfo();

            // Reset pending flag after a short delay
            setTimeout(() => {
                state.pendingRefresh = false;
            }, 1000);

            return true;
        } else {
            updateStatus('warning', 'Refresh button not found');
            state.pendingRefresh = false;
            return false;
        }
    }

    // Schedule next refresh - separated from startAutoRefresh for cleaner code
    function scheduleNextRefresh(preset) {
        if (!preset || !state.enabled || !state.onServiceOrdersPage) {
            return;
        }

        // Clear any existing timer first
        clearAutoRefresh();

        // Calculate jittered interval
        const jitteredSeconds = getJitteredInterval(preset.seconds);
        const intervalMs = Math.round(jitteredSeconds * 1000);

        // Set timer for next refresh
        state.refreshTimer = setTimeout(() => {
            if (state.enabled && state.onServiceOrdersPage) {
                triggerRefresh();
                // Schedule the next refresh
                scheduleNextRefresh(preset);
            }
        }, intervalMs);
    }

    // Start auto refresh with given preset
    function startAutoRefresh(preset, skipInitialRefresh = false) {
        // Don't start if disabled
        if (!state.enabled) return;

        // Clear existing timer first to prevent multiple refreshes
        clearAutoRefresh();

        // Set active preset
        state.activePreset = preset;

        // Update UI to reflect the current active preset
        updateActivePreset();

        // Only start timer if enabled and on service orders page
        if (state.enabled && state.onServiceOrdersPage) {
            // Trigger a refresh immediately when setting a new preset, unless skipInitialRefresh is true
            if (!skipInitialRefresh) {
                triggerRefresh();
            }

            // Schedule the next refresh
            scheduleNextRefresh(preset);
        }

        // Save state
        saveState();
    }

    // Clear auto refresh timer
    function clearAutoRefresh() {
        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
            state.refreshTimer = null;
        }
    }

    // Update active preset highlighting
    function updateActivePreset() {
        // Remove active class from all presets
        document.querySelectorAll('.auto-refresh-preset').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to current preset if it's one of the displayed presets
        if (state.activePreset) {
            const activeBtn = document.querySelector(`.auto-refresh-preset[data-seconds="${state.activePreset.seconds}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
    }

    // Toggle auto refresh enabled state
    function toggleEnabled() {
        state.enabled = !state.enabled;

        // Update UI
        const container = document.getElementById('auto-refresh-container');
        if (container) {
            if (state.enabled) {
                container.classList.remove('auto-refresh-disabled');
                if (state.activePreset && state.onServiceOrdersPage) {
                    startAutoRefresh(state.activePreset);
                }
            } else {
                container.classList.add('auto-refresh-disabled');
                clearAutoRefresh();
                // When disabled, immediately update status to "off" message
                updateStatus('info', 'Auto refresh is off');
            }
        }

        // Update page status
        updatePageStatus();

        // Save state
        saveState();
    }

    // Toggle time-based presets feature
    function toggleTimeBasedPresets() {
        state.useTimeBasedPresets = !state.useTimeBasedPresets;

        // Update UI
        updateTimeBasedToggle();

        // Always trigger refresh immediately when toggle is changed
        // This will update the "Last checked" time
        if (state.onServiceOrdersPage && state.enabled) {
            triggerRefresh();
        }

        if (state.useTimeBasedPresets) {
            // When turning ON time-based presets, switch to time-based preset immediately
            updateCurrentTimePreset();

            // Remember current user preset before switching
            if (state.activePreset) {
                state.userSelectedPreset = {...state.activePreset};
            }

            // Apply the time-based preset (without triggering another refresh)
            clearAutoRefresh();
            state.activePreset = state.currentTimePreset;

            // Start auto refresh with this preset if enabled
            if (state.enabled && state.onServiceOrdersPage) {
                scheduleNextRefresh(state.activePreset);
            }

            // Make sure the time-based preset button is visually active
            document.querySelectorAll('.auto-refresh-preset').forEach(btn => {
                btn.classList.remove('active');

                // Add active class to the current time preset
                if (state.activePreset && btn.dataset.seconds == state.activePreset.seconds) {
                    btn.classList.add('active');
                }
            });
        } else {
            // When turning OFF time-based presets, switch back to user's manually selected preset
            if (state.userSelectedPreset) {
                clearAutoRefresh();
                state.activePreset = state.userSelectedPreset;

                // If enabled, schedule next refresh with the user's preset
                if (state.enabled && state.onServiceOrdersPage) {
                    scheduleNextRefresh(state.activePreset);
                } else {
                    // Just update UI if not enabled
                    updateActivePreset();
                }
            }
        }

        // Update status after changes
        updateStatusWithRefreshInfo();

        // Save state
        saveState();
    }

    // Update time-based toggle state in UI
    function updateTimeBasedToggle() {
        const timeToggle = document.getElementById('time-based-toggle');
        if (timeToggle) {
            timeToggle.checked = state.useTimeBasedPresets;
        }
    }

    // Toggle tip expanded/collapsed state
    function toggleTip() {
        state.tipExpanded = !state.tipExpanded;

        const tipContent = document.getElementById('auto-refresh-tip-content');
        if (!tipContent) return;

        if (state.tipExpanded) {
            tipContent.classList.add('expanded');
        } else {
            tipContent.classList.remove('expanded');
        }

        // Save state
        saveState();
    }

    // Toggle collapsed state
    function toggleCollapsed() {
        state.collapsed = !state.collapsed;

        // Update UI
        const body = document.getElementById('auto-refresh-body');
        const collapseBtn = document.getElementById('auto-refresh-collapse');

        if (body && collapseBtn) {
            if (state.collapsed) {
                body.style.maxHeight = '0';
                collapseBtn.textContent = '+';
            } else {
                body.style.maxHeight = '500px';
                collapseBtn.textContent = '-';
            }
        }

        // Save state
        saveState();
    }

    // Save state to GM storage
    function saveState() {
        try {
            GM_setValue('autoRefreshPresets', state.presets);
            GM_setValue('autoRefreshPosition', state.position);
            GM_setValue('autoRefreshEnabled', state.enabled);
            GM_setValue('autoRefreshCollapsed', state.collapsed);
            GM_setValue('autoRefreshActivePreset', state.activePreset);
            GM_setValue('autoRefreshUseTimeBasedPresets', state.useTimeBasedPresets);
            GM_setValue('autoRefreshTipExpanded', state.tipExpanded);
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    // Load state from GM storage
    function loadState() {
        try {
            state.presets = GM_getValue('autoRefreshPresets', DEFAULT_PRESETS);
            state.position = GM_getValue('autoRefreshPosition', { x: 20, y: 20 });
            state.enabled = GM_getValue('autoRefreshEnabled', true);
            state.collapsed = GM_getValue('autoRefreshCollapsed', false);
            state.tipExpanded = GM_getValue('autoRefreshTipExpanded', false);

            // Always default to time-based presets on page reload/relogin
            state.useTimeBasedPresets = true;

            // Store this value to preserve user's manual toggle for time-based presets
            // during the current session, but not across reloads
            const savedTimeBasedSetting = GM_getValue('autoRefreshUseTimeBasedPresets', true);
            GM_setValue('autoRefreshUseTimeBasedPresets', true);

            // Get the current time-based preset
            updateCurrentTimePreset();

            // Always use time-based preset on reload, regardless of previous setting
            state.activePreset = state.currentTimePreset;

            // If we've loaded an active preset and we're enabled, set the lastRefreshTime
            // to avoid the "Select a refresh interval" message flash on load
            if (state.activePreset && state.enabled) {
                state.lastRefreshTime = new Date();
            }
        } catch (error) {
            console.error('Error loading state:', error);
            // Fallback to defaults
            state.presets = DEFAULT_PRESETS;
            state.position = { x: 20, y: 20 };
            state.enabled = true;
            state.collapsed = false;
            state.useTimeBasedPresets = true;
            state.tipExpanded = false;
            updateCurrentTimePreset();
            state.activePreset = state.currentTimePreset;

            // Prevent "Select a refresh interval" message
            state.lastRefreshTime = new Date();
        }
    }

    // Format preset name based on seconds
    function formatPresetName(seconds) {
        return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}min`;
    }

    // Show preset edit panel
    function showEditPanel(preset) {
        state.editingPreset = preset;

        // Create overlay and panel
        const overlay = document.createElement('div');
        overlay.id = 'auto-refresh-edit-overlay';

        const panel = document.createElement('div');
        panel.id = 'auto-refresh-edit-panel';

        // Create options HTML - with predefined array
        const optionsHTML = TIME_OPTIONS.map(value => {
            const selected = value === preset.seconds ? 'selected' : '';
            const label = value < 60 ? `${value}s` : `${Math.floor(value/60)}min`;
            return `<option value="${value}" ${selected}>${label}</option>`;
        }).join('');

        panel.innerHTML = `
            <h3 style="font-size: 14px; margin-top: 0;">Edit Preset</h3>
            <div class="auto-refresh-form-group">
                <label class="auto-refresh-form-label">Select Interval:</label>
                <select id="edit-preset-seconds" class="auto-refresh-form-input" style="appearance: auto; background-color: white;">
                    ${optionsHTML}
                </select>
                <div id="edit-preset-error" style="color: #f44336; font-size: 11px; margin: 8px 0; display: none;"></div>
            </div>
            <div class="auto-refresh-form-buttons">
                <button class="auto-refresh-form-button cancel">Cancel</button>
                <button class="auto-refresh-form-button save">Save</button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Add event listeners
        overlay.querySelector('.cancel').addEventListener('click', hideEditPanel);
        overlay.querySelector('.save').addEventListener('click', saveEditedPreset);

        // Handle pressing Enter key
        const selectInput = document.getElementById('edit-preset-seconds');
        selectInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEditedPreset();
            }
        });

        // Focus the select field
        selectInput.focus();
    }

    // Save edited preset with duplicate check
    function saveEditedPreset() {
        const secondsInput = document.getElementById('edit-preset-seconds');
        const errorElement = document.getElementById('edit-preset-error');

        if (!secondsInput) return;

        const seconds = parseInt(secondsInput.value, 10);
        if (isNaN(seconds)) return;

        // Check for duplicate
        const duplicatePreset = state.presets.find(p =>
            p.seconds === seconds &&
            !(p.name === state.editingPreset.name && p.seconds === state.editingPreset.seconds)
        );

        if (duplicatePreset) {
            if (errorElement) {
                errorElement.textContent = `Preset "${duplicatePreset.name}" already uses this interval.`;
                errorElement.style.display = 'block';
            }
            return;
        }

        // Format name and update preset
        const name = formatPresetName(seconds);
        const presetIndex = state.presets.findIndex(p =>
            p.name === state.editingPreset.name && p.seconds === state.editingPreset.seconds
        );

        if (presetIndex >= 0) {
            state.presets[presetIndex] = { name, seconds };

            // If editing active preset, update it
            if (state.activePreset &&
                state.activePreset.name === state.editingPreset.name &&
                state.activePreset.seconds === state.editingPreset.seconds) {
                state.activePreset = { name, seconds };
                if (state.enabled && state.onServiceOrdersPage) {
                    startAutoRefresh(state.activePreset);
                }
            }

            // Update UI and save
            createOrUpdateUI();
            saveState();
        }

        hideEditPanel();
    }

    // Hide preset edit panel
    function hideEditPanel() {
        const overlay = document.getElementById('auto-refresh-edit-overlay');
        if (overlay) overlay.remove();
        state.editingPreset = null;
    }

    // Make element draggable - simplified for both mouse and touch
    function makeDraggable(element, handleElement) {
        let startX, startY, initialX, initialY;
        let isDragging = false;

        const onStart = (e) => {
            // Don't initiate drag if it's a button or control
            if (e.target.id === 'auto-refresh-collapse' ||
                e.target.id === 'auto-refresh-toggle' ||
                e.target.id === 'time-based-toggle' ||
                e.target.closest('button') ||
                e.target.closest('.switch')) {
                return;
            }

            isDragging = true;
            state.isDragging = true;

            // Get starting positions
            if (e.type === 'mousedown') {
                startX = e.clientX;
                startY = e.clientY;
            } else if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }

            initialX = element.offsetLeft;
            initialY = element.offsetTop;

            // Add event listeners
            if (e.type === 'mousedown') {
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onEnd);
            } else if (e.type === 'touchstart') {
                document.addEventListener('touchmove', onMove, { passive: false });
                document.addEventListener('touchend', onEnd);
            }

            // Prevent default for handle
            if (e.target === handleElement || handleElement.contains(e.target)) {
                if (e.preventDefault) e.preventDefault();
            }
        };

        const onMove = (e) => {
            if (!isDragging) return;

            // Calculate new position
            let clientX, clientY;
            if (e.type === 'mousemove') {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
                e.preventDefault(); // Prevent scrolling when dragging
            }

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const newLeft = initialX + deltaX;
            const newTop = initialY + deltaY;

            // Keep within viewport
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            element.style.top = `${Math.min(Math.max(0, newTop), maxTop)}px`;
            element.style.left = `${Math.min(Math.max(0, newLeft), maxLeft)}px`;
        };

        const onEnd = () => {
            isDragging = false;

            // Small delay to prevent accidental clicks
            setTimeout(() => { state.isDragging = false; }, 50);

            // Remove event listeners
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);

            // Save position
            state.position = {
                x: parseInt(element.style.left, 10) || 20,
                y: parseInt(element.style.top, 10) || 20
            };
            saveState();
        };

        handleElement.addEventListener('mousedown', onStart);
        handleElement.addEventListener('touchstart', onStart, { passive: true });
    }

    // Update page status based on current state
    function updatePageStatus() {
        if (!state.onServiceOrdersPage) {
            updateStatus('warning', 'Please navigate to Service Orders');
        } else if (!state.enabled) {
            // When disabled, always show "off" message regardless of last refresh time
            updateStatus('info', 'Auto refresh is off');
        } else if (state.activePreset) {
            // Show improved status message with interval and last time
            updateStatusWithRefreshInfo();
        } else {
            updateStatus('info', 'Select a refresh interval');
        }
    }

    // Create or update UI
    function createOrUpdateUI() {
        // Check if UI already exists
        let container = document.getElementById('auto-refresh-container');

        if (!container) {
            // Create new container
            container = document.createElement('div');
            container.id = 'auto-refresh-container';
            document.body.appendChild(container);

            // Set position
            container.style.left = `${state.position.x}px`;
            container.style.top = `${state.position.y}px`;

            // Create UI structure
            container.innerHTML = `
                <div id="auto-refresh-header">
                    <span id="auto-refresh-title">Auto Refresh</span>
                    <div id="auto-refresh-controls">
                        <label class="switch">
                            <input type="checkbox" id="auto-refresh-toggle" ${state.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                        <span id="auto-refresh-collapse">${state.collapsed ? '+' : '-'}</span>
                    </div>
                </div>
                <div id="auto-refresh-body" style="max-height: ${state.collapsed ? '0' : '500px'};">
                    <div class="feature-toggle">
                        <span class="feature-label">Use time-based presets</span>
                        <label class="switch">
                            <input type="checkbox" id="time-based-toggle" ${state.useTimeBasedPresets ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div id="auto-refresh-tip">
                        <div id="auto-refresh-tip-header">
                            <span>User Tip</span>
                        </div>
                        <div id="auto-refresh-tip-content" class="${state.tipExpanded ? 'expanded' : ''}">
                            Busy? Go fast. Slow? Take it easy
                        </div>
                    </div>
                    <div id="auto-refresh-presets"></div>
                    <div id="auto-refresh-status" class="info">Initializing...</div>
                </div>
            `;

            // Add toggle event listeners
            document.getElementById('auto-refresh-toggle').addEventListener('change', toggleEnabled);
            document.getElementById('time-based-toggle').addEventListener('change', toggleTimeBasedPresets);

            // Add collapse event listener
            const domCollapseBtn = document.getElementById('auto-refresh-collapse');
            if (domCollapseBtn) {
                domCollapseBtn.onclick = function(e) {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    toggleCollapsed();
                    return false;
                };
            }

            // Add tip toggle functionality
            const tipHeader = document.getElementById('auto-refresh-tip-header');
            if (tipHeader) {
                tipHeader.addEventListener('click', function(e) {
                    toggleTip();
                    e.stopPropagation();
                });
            }

            // Make draggable
            makeDraggable(container, document.getElementById('auto-refresh-header'));

            // Set disabled class if needed
            if (!state.enabled) {
                container.classList.add('auto-refresh-disabled');
            }
        }

        // Update presets
        const presetsContainer = document.getElementById('auto-refresh-presets');
        if (presetsContainer) {
            presetsContainer.innerHTML = '';

            state.presets.forEach(preset => {
                const presetBtn = document.createElement('button');
                presetBtn.className = 'auto-refresh-preset';
                presetBtn.textContent = preset.name;
                presetBtn.dataset.seconds = preset.seconds;

                // Set active class if needed
                if (state.activePreset &&
                    state.activePreset.seconds === preset.seconds) {
                    presetBtn.classList.add('active');
                }

    // Normal click event
                presetBtn.addEventListener('click', () => {
                    if (!state.isDragging && state.enabled) {
                        // When user selects a preset manually, disable time-based presets
                        state.useTimeBasedPresets = false;
                        updateTimeBasedToggle();

                        // Save this as the user's manual preset
                        state.userSelectedPreset = {...preset};

                        // Set this preset as active
                        startAutoRefresh(preset);

                        // Ensure this preset gets highlighted (not just in startAutoRefresh)
                        document.querySelectorAll('.auto-refresh-preset').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        presetBtn.classList.add('active');
                    }
                });

                // Right-click for edit
                presetBtn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    showEditPanel(preset);
                });

                // Long press for mobile
                let longPressTimer;
                let longPressStarted = false;
                let longPressFired = false; // New flag to track when long press action has fired

                presetBtn.addEventListener('touchstart', () => {
                    longPressStarted = true;
                    longPressFired = false;
                    longPressTimer = setTimeout(() => {
                        if (longPressStarted) {
                            longPressFired = true; // Set flag when edit panel is shown
                            showEditPanel(preset);
                        }
                    }, 800);
                });

                presetBtn.addEventListener('touchmove', () => {
                    longPressStarted = false;
                    clearTimeout(longPressTimer);
                });

                presetBtn.addEventListener('touchend', () => {
                    // Only activate preset if it wasn't a long press
                    if (!state.isDragging && longPressStarted && !longPressFired && state.enabled) {
                        // Normal tap behavior - activate the preset
                        state.useTimeBasedPresets = false;
                        updateTimeBasedToggle();

                        // Save this as the user's manual preset
                        state.userSelectedPreset = {...preset};

                        startAutoRefresh(preset);

                        // Ensure this preset gets highlighted
                        document.querySelectorAll('.auto-refresh-preset').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        presetBtn.classList.add('active');
                    }
                    longPressStarted = false;
                    clearTimeout(longPressTimer);
                });

                presetsContainer.appendChild(presetBtn);
            });
        }

        // Update status
        updatePageStatus();
    }

    // Check page and update UI accordingly
    function checkPageAndUpdateUI() {
        const wasOnServiceOrdersPage = state.onServiceOrdersPage;
        state.onServiceOrdersPage = checkIfOnServiceOrdersPage();

        // Reset button observed state if needed
        if (!state.onServiceOrdersPage) {
            state.refreshButtonObserved = false;
        }

        // Update status
        updatePageStatus();

        // Handle page transitions
        if (!wasOnServiceOrdersPage && state.onServiceOrdersPage) {
            // Just arrived at service orders page
            if (state.enabled) {
                triggerRefresh();
                if (state.activePreset) {
                    startAutoRefresh(state.activePreset);
                }
            }
        } else if (wasOnServiceOrdersPage && !state.onServiceOrdersPage) {
            // Just left service orders page
            clearAutoRefresh();
        }
    }

    // Setup observer for page changes
    function setupObserver() {
        const observer = new MutationObserver(() => {
            // Debounce to prevent excessive checks
            if (!state.observerDebounce) {
                state.observerDebounce = true;
                setTimeout(() => {
                    checkPageAndUpdateUI();
                    state.observerDebounce = false;
                }, 1000);
            }
        });

        // Observe body changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script
    function init() {
        // Load saved state
        loadState();

        // Create UI
        createOrUpdateUI();

        // Make sure the correct toggle state is shown
        updateTimeBasedToggle();

        // Setup observer
        setupObserver();

        // Start time check for time-based presets
        startTimeCheck();

        // Check current page
        checkPageAndUpdateUI();

        // Start auto refresh if applicable
        if (state.activePreset && state.onServiceOrdersPage && state.enabled) {
            startAutoRefresh(state.activePreset);
        }

        // Ensure the correct preset is highlighted
        updateActivePreset();

        state.initialized = true;
    }

    // Handle global errors
    window.addEventListener('error', function(event) {
        if (event.filename && event.filename.includes('Auto Refresh Tool')) {
            //console.log('Auto Refresh Tool error:', error);
            event.preventDefault();
            return true;
        }
        return false;
    }, true);

    // Initialize with retry mechanism
    let initAttempts = 0;
    const maxInitAttempts = 3;

    function attemptInit() {
        if (initAttempts >= maxInitAttempts) {
            console.error('Failed to initialize Auto Refresh Tool after multiple attempts');
            return;
        }

        if (!state.initialized) {
            initAttempts++;
            init();

            // Schedule another attempt if needed
            if (!state.initialized) {
                setTimeout(attemptInit, 2000);
            }
        }
    }

    // Start initialization with delay
    setTimeout(attemptInit, 1000);

    // Backup initialization
    setTimeout(() => {
        if (!document.getElementById('auto-refresh-container')) {
            createOrUpdateUI();
            checkPageAndUpdateUI();
        }
    }, 5000);
})();