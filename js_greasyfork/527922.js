// ==UserScript==
// @name         Enhanced Auto Refresh Interface for Hotsauce
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Add auto-refresh toggle for Amadeus Service Orders page with improved persistence, touch support, and enhanced refresh detection
// @match        https://na4.m-tech.com/service-optimization/operations/service-orders/PendingOrders
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527922/Enhanced%20Auto%20Refresh%20Interface%20for%20Hotsauce.user.js
// @updateURL https://update.greasyfork.org/scripts/527922/Enhanced%20Auto%20Refresh%20Interface%20for%20Hotsauce.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    let refreshInterval;
    let currentIntervalValue;
    let isEnabled = false;
    let statusText;
    let toggleCircle;
    let toggleContainer = null;
    let toggle;
    let lastRefreshAttempt = 0;
    let isDragging = false;
    let xOffset = 0;
    let yOffset = 0;
    let initialX, initialY;
    const MIN_REFRESH_INTERVAL = 1000; // 1 second minimum between refreshes

    // Settings management
    const Settings = {
        load() {
            const defaultSettings = {
                interval: 30,
                position: { x: 0, y: 0 },
                lastUsedPreset: '30s'
            };
            try {
                return { ...defaultSettings, ...JSON.parse(localStorage.getItem('autoRefreshSettings') || '{}') };
            } catch (e) {
                console.log('Error loading settings, using defaults');
                return defaultSettings;
            }
        },
        save(settings) {
            localStorage.setItem('autoRefreshSettings', JSON.stringify(settings));
        }
    };

    // Preset configurations
    const PRESETS = [
        { label: '15s', value: 15 },
        { label: '30s', value: 30 },
        { label: '1m', value: 60 },
        { label: '5m', value: 300 }
    ];

    // Enhanced page ready check
    function checkPageReady() {
        const refreshButton = findRefreshButton();
        const isLoading = document.querySelector('.loading-screen, .spinner, .mat-progress-spinner');

        if (isLoading) {
            console.log('Loading screen detected, waiting...');
            setTimeout(() => findAndClickRefreshButton(), 500);
            return false;
        }

        return refreshButton !== null;
    }

    function findRefreshButton() {
        const selectors = [
            'button.mat-icon-button.mat-accent:has(soe-icon[icon="refresh-dot"])',
            'button.mat-icon-button.mat-accent:has(soe-icon[icon="refresh"])',
            'button.mat-icon-button:has(soe-icon[icon="refresh"])',
            'button.mat-icon-button:has(soe-icon[icon="refresh-dot"])',
            'button[soe-data-cy="refresh"]'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button) return button;
        }

        // Fallback to searching for any button with refresh-related attributes
        const allButtons = document.querySelectorAll('button');
        return Array.from(allButtons).find(button => {
            const buttonText = button.textContent.toLowerCase();
            const hasRefreshIcon = button.querySelector('soe-icon[icon*="refresh"]');
            const hasRefreshClass = button.className.toLowerCase().includes('refresh');
            return hasRefreshIcon || hasRefreshClass || buttonText.includes('refresh');
        });
    }

    function updateStatus(state = 'normal') {
        if (!statusText) return;
        const now = new Date().toLocaleTimeString();
        const stateColors = {
            success: '#059669',
            error: '#DC2626',
            normal: '#666'
        };

        statusText.textContent = `Last check: ${now}`;
        statusText.style.color = isEnabled ? stateColors[state] : stateColors.normal;

        if (state === 'error') {
            setTimeout(() => {
                if (isEnabled) updateStatus('normal');
            }, 3000);
        }
    }

    function findAndClickRefreshButton(force = false) {
        const now = Date.now();
        if (!force && now - lastRefreshAttempt < MIN_REFRESH_INTERVAL) {
            console.log('Skipping refresh - too soon since last attempt');
            return false;
        }

        const refreshButton = findRefreshButton();
        if (refreshButton) {
            console.log('Refresh button found and clicked');
            refreshButton.click();
            updateStatus('success');
            lastRefreshAttempt = now;
            return true;
        }

        if (force) {
            console.log('Forced refresh attempt');
            setTimeout(() => findAndClickRefreshButton(true), 500);
        }

        console.log('Refresh button not found');
        updateStatus('error');
        return false;
    }

    function setupRefreshButtonListener() {
        const refreshButton = findRefreshButton();
        if (refreshButton && !refreshButton.dataset.listenerAdded) {
            refreshButton.addEventListener('click', () => {
                updateStatus();
                if (isEnabled && refreshInterval) {
                    clearInterval(refreshInterval);
                    refreshInterval = setInterval(findAndClickRefreshButton, currentIntervalValue * 1000);
                }
            });
            refreshButton.dataset.listenerAdded = 'true';
        }
    }

    function updateInterval(newInterval, intervalInput) {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }

        intervalInput.value = newInterval.toString();
        currentIntervalValue = newInterval;

        if (isEnabled) {
            findAndClickRefreshButton();
            refreshInterval = setInterval(findAndClickRefreshButton, newInterval * 1000);
            console.log('Interval updated to', newInterval, 'seconds');
        }

        const settings = Settings.load();
        settings.interval = newInterval;
        Settings.save(settings);
    }

    function updatePresetButtonStyles(presetContainer, currentValue) {
        const numericValue = parseInt(currentValue);
        presetContainer.querySelectorAll('button').forEach(button => {
            const preset = PRESETS.find(p => p.label === button.textContent);
            const isMatch = preset && preset.value === numericValue;
            button.style.background = isMatch ? '#0066cc' : '#f0f0f0';
            button.style.color = isMatch ? 'white' : '#333';
        });
    }

    function handleIntervalUpdate(newInterval, intervalInput, presetContainer) {
        isEnabled = true;
        toggle.style.backgroundColor = '#0066cc';
        toggleCircle.style.transform = 'translateX(14px)';
        updateInterval(newInterval, intervalInput);
        updatePresetButtonStyles(presetContainer, newInterval);
    }

    // Simple function to ensure the container is always in view
    function checkContainerVisibility() {
        if (!toggleContainer || isDragging) return;

        const rect = toggleContainer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Check if container is completely out of view
        if (rect.left > viewportWidth || rect.right < 0 || rect.top > viewportHeight || rect.bottom < 0) {
            console.log('Container off screen, resetting position');
            xOffset = 20;
            yOffset = 20;
            toggleContainer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

            // Save the new position
            const settings = Settings.load();
            settings.position = { x: xOffset, y: yOffset };
            Settings.save(settings);
        }
    }

    function createUI() {
        // Load settings
        const settings = Settings.load();
        currentIntervalValue = settings.interval;

        // Load saved position
        if (settings.position) {
            xOffset = settings.position.x;
            yOffset = settings.position.y;
        }

        // Create main container
        toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            position: fixed;
            top: 140px;
            right: 100px;
            z-index: 10000;
            background: white;
            padding: 10px 14px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            min-width: 150px;
            width: 180px;
            touch-action: none;
        `;

        // Apply saved transform immediately
        toggleContainer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

        // Create header
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #eee;
            cursor: move;
            touch-action: none;
        `;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'Auto Refresh';
        titleSpan.style.cssText = 'font-weight: bold; cursor: move;';

        const minimizeButton = document.createElement('button');
        minimizeButton.innerHTML = '−';
        minimizeButton.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            color: #666;
            font-size: 14px;
            touch-action: manipulation;
        `;

        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

        // Create preset buttons
        const presetContainer = document.createElement('div');
        presetContainer.style.cssText = 'display: flex; gap: 4px; margin-bottom: 6px;';

        PRESETS.forEach(preset => {
            const button = document.createElement('button');
            button.textContent = preset.label;
            button.style.cssText = `
                padding: 4px 8px;
                background: #f0f0f0;
                color: #333;
                border: none;
                border-radius: 3px;
                font-size: 10px;
                cursor: pointer;
                flex: 1;
                touch-action: manipulation;
            `;
            presetContainer.appendChild(button);

            const handlePresetClick = (e) => {
                e.preventDefault();
                const newInterval = preset.value;
                handleIntervalUpdate(newInterval, intervalInput, presetContainer);

                // Update settings
                const currentSettings = Settings.load();
                currentSettings.interval = newInterval;
                currentSettings.lastUsedPreset = preset.label;
                Settings.save(currentSettings);
            };

            button.addEventListener('click', handlePresetClick);
            button.addEventListener('touchend', handlePresetClick);
        });

        // Create interval input section
        const intervalContainer = document.createElement('div');
        intervalContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = 'Interval (sec):';
        intervalLabel.style.cssText = 'font-size: 11px; color: #333;';

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.min = '5';
        intervalInput.max = '3600';
        intervalInput.value = settings.interval.toString();
        intervalInput.style.cssText = `
            width: 45px;
            padding: 2px 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 11px;
            touch-action: manipulation;
        `;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 2px; margin-left: 2px;';

        const setIntervalButton = document.createElement('button');
        setIntervalButton.textContent = 'Set';
        setIntervalButton.style.cssText = `
            padding: 4px 8px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 3px;
            font-size: 10px;
            cursor: pointer;
            touch-action: manipulation;
        `;

        const resetDefaultButton = document.createElement('button');
        resetDefaultButton.textContent = 'Def';
        resetDefaultButton.style.cssText = `
            padding: 4px 8px;
            background: #666;
            color: white;
            border: none;
            border-radius: 3px;
            font-size: 10px;
            cursor: pointer;
            touch-action: manipulation;
        `;

        // Create toggle switch
        const toggleSwitch = document.createElement('div');
        toggleSwitch.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        toggle = document.createElement('div');
        toggle.style.cssText = `
            width: 32px;
            height: 18px;
            background: #ccc;
            border-radius: 9px;
            position: relative;
            transition: background-color 0.2s;
            cursor: pointer;
            touch-action: manipulation;
        `;

        toggleCircle = document.createElement('div');
        toggleCircle.style.cssText = `
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: transform 0.2s;
        `;

        const toggleLabel = document.createElement('span');
        toggleLabel.textContent = 'Enable Auto-refresh';
        toggleLabel.style.cssText = 'color: #333; font-size: 11px;';

        // Create status text
        statusText = document.createElement('div');
        statusText.style.cssText = 'font-size: 10px; color: #666;';

        // Assemble UI
        toggle.appendChild(toggleCircle);
        toggleSwitch.appendChild(toggle);
        toggleSwitch.appendChild(toggleLabel);

        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(minimizeButton);

        intervalContainer.appendChild(intervalLabel);
        intervalContainer.appendChild(intervalInput);
        buttonContainer.appendChild(setIntervalButton);
        buttonContainer.appendChild(resetDefaultButton);
        intervalContainer.appendChild(buttonContainer);

        contentDiv.appendChild(presetContainer);
        contentDiv.appendChild(intervalContainer);
        contentDiv.appendChild(toggleSwitch);
        contentDiv.appendChild(statusText);

        toggleContainer.appendChild(headerDiv);
        toggleContainer.appendChild(contentDiv);
        document.body.appendChild(toggleContainer);

        // Setup dragging functionality - using the reliable code 1 approach
        function dragStart(e) {
            if (e.target === minimizeButton) return;

            // Get exact current position for smooth dragging
            const transform = toggleContainer.style.transform;
            const match = transform.match(/translate\((-?\d+)px, *(-?\d+)px\)/);
            if (match) {
                xOffset = parseInt(match[1]);
                yOffset = parseInt(match[2]);
            }

            const event = e.type === 'touchstart' ? e.touches[0] : e;
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;

            if (e.target === headerDiv || e.target === titleSpan || e.target === toggleContainer) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                const event = e.type === 'touchmove' ? e.touches[0] : e;
                xOffset = event.clientX - initialX;
                yOffset = event.clientY - initialY;
                toggleContainer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            }
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;

                // Save position
                const settings = Settings.load();
                settings.position = { x: xOffset, y: yOffset };
                Settings.save(settings);
            }
        }

        // Add drag events
        toggleContainer.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        toggleContainer.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        // Minimize/Maximize functionality
        let isMinimized = false;
        minimizeButton.addEventListener('click', () => {
            isMinimized = !isMinimized;
            contentDiv.style.display = isMinimized ? 'none' : 'flex';
            minimizeButton.innerHTML = isMinimized ? '+' : '−';
            toggleContainer.style.padding = isMinimized ? '10px 14px 2px' : '10px 14px';
        });

        // Set interval button handlers
        setIntervalButton.addEventListener('click', (e) => {
            e.preventDefault();
            const newInterval = Math.max(5, Math.min(3600, parseInt(intervalInput.value) || 30));
            handleIntervalUpdate(newInterval, intervalInput, presetContainer);
        });

        resetDefaultButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleIntervalUpdate(30, intervalInput, presetContainer);
        });

        // Toggle switch functionality
        toggle.addEventListener('click', function() {
            isEnabled = !isEnabled;
            if (isEnabled) {
                toggle.style.backgroundColor = '#0066cc';
                toggleCircle.style.transform = 'translateX(14px)';
                const currentValue = parseInt(intervalInput.value) || 30;
                updateInterval(currentValue, intervalInput);
                updatePresetButtonStyles(presetContainer, currentValue);
            } else {
                toggle.style.backgroundColor = '#ccc';
                toggleCircle.style.transform = 'translateX(0)';
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                    refreshInterval = null;
                }
                statusText.style.color = '#666';
            }
        });

        // Set up mutation observer for dynamic refresh button
        const observer = new MutationObserver(() => {
            setupRefreshButtonListener();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        // Initial setup
        setupRefreshButtonListener();
        updateStatus();

        // Set initial interval from settings and update presets
        intervalInput.value = settings.interval.toString();
        updatePresetButtonStyles(presetContainer, settings.interval);
    }

    // Initialization function - create UI immediately without waiting for page to be ready
    function initScript() {
        console.log('Starting initialization...');

        // Create UI immediately
        createUI();

        // Force position check after a short delay
        setTimeout(checkContainerVisibility, 500);

        // Set up observers and listeners
        const observer = new MutationObserver((mutations) => {
            const loadingScreenChange = mutations.some(mutation =>
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && (
                        node.classList?.contains('loading-screen') ||
                        node.classList?.contains('spinner') ||
                        node.classList?.contains('mat-progress-spinner')
                    )
                )
            );

            if (loadingScreenChange) {
                console.log('Loading screen change detected');
                setTimeout(() => findAndClickRefreshButton(true), 500);
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Add event listener for window resize
        window.addEventListener('resize', function() {
            if (!isDragging) {
                checkContainerVisibility();
            }
        });

        // Also check visibility after orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                checkContainerVisibility();
            }, 300);
        });

        // Initialize refresh functionality if page is ready
        if (checkPageReady()) {
            setupRefreshButtonListener();
            console.log('Page ready, refresh functionality initialized');
        } else {
            console.log('Page not ready, will initialize refresh functionality when ready');
            // Set up periodic check for refresh button
            const readyCheckInterval = setInterval(() => {
                if (checkPageReady()) {
                    setupRefreshButtonListener();
                    console.log('Page now ready, refresh functionality initialized');
                    clearInterval(readyCheckInterval);
                }
            }, 1000);
        }
    }

    // Start the script when the window loads
    window.addEventListener('load', function() {
        console.log('Window loaded, running script...');
        initScript();
    });
})();