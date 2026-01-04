// ==UserScript==
// @name        [Torn] Chain Monitor
// @namespace   dev.vassilios.torn
// @version     1.0.1
// @license     GNU GPLv3
// @description Displays the current chain as a floating window with timing alerts. Mobile-friendly.
// @author      Vassilios [2276659]
// @match       https://www.torn.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/535002/%5BTorn%5D%20Chain%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/535002/%5BTorn%5D%20Chain%20Monitor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Configuration constants
     */
    const CONFIG = {
        // API settings
        API: {
            BASE_URL: 'https://api.torn.com/v2',
            ENDPOINTS: {
                USER: '/user',
                FACTION: '/faction'
            },
            SELECTIONS: {
                BARS: 'bars',
                CHAIN: 'chain'
            },
            CACHE_MAX_AGE_MS: 5 * 60 * 1000 // 5 minutes
        },

        // UI settings
        UI: {
            WINDOWS: {
                CHAIN: {
                    DEFAULT_WIDTH: '250px',
                    DEFAULT_POSITION: {
                        TOP: '150px',
                        LEFT: '150px'
                    }
                },
                LOGIN: {
                    DEFAULT_POSITION: {
                        TOP: '100px',
                        LEFT: '100px'
                    }
                }
            },
            COLORS: {
                BACKGROUND: '#1a1a1a',
                HEADER: '#2a2a2a',
                BORDER: '#333',
                TEXT: '#ccc',
                HEADER_TEXT: '#fff',
                ERROR: '#ff5555',
                BUTTON: '#4a90e2',
                PROGRESS_BAR: '#4a90e2',
                PROGRESS_BG: '#333',
                INACTIVE: '#777777',
                FLASH: {
                    BASE: 'rgba(255, 165, 0, 0)',
                    NORMAL: 'rgba(255, 165, 0, 0.3)',
                    HIGH: 'rgba(255, 165, 0, 0.6)'
                }
            },
            FONT: {
                FAMILY: 'Arial, sans-serif',
                SIZE: {
                    NORMAL: '14px',
                    SMALL: '12px'
                }
            },
            Z_INDEX: {
                WINDOW: 1000,
                FLASH: 9999
            }
        },

        // Timer settings
        TIMER: {
            MAX_REFERENCE_SECONDS: 300, // 5 minutes as reference for color gradient
            ALERT_THRESHOLDS: {
                MINUTES: [1, 0],
                SECONDS: [50, 40, 30, 20, 10]
            },
            FLASH_DURATION_MS: 300,
            REFRESH_INTERVAL_MS: 60000 // 1 minute
        },

        // Storage keys
        STORAGE: {
            API_KEY: 'chainMonitorAPIKey',
            WINDOW_OPEN: 'chainWindowOpen',
            WINDOW_TOP: 'chainWindowTop',
            WINDOW_LEFT: 'chainWindowLeft',
            LAST_DATA: 'chainMonitorLastData',
            LAST_UPDATE: 'chainMonitorLastUpdate'
        },

        // DOM selectors
        SELECTORS: {
            SETTINGS_MENU: 'ul.settings-menu',
            NEWSTICKER: 'li.setting.newsticker',
            CHAIN_MONITOR_LINK: 'li.link a span.link-text[data-chain-monitor="true"]',
            CHAIN_BAR: '[class*="chain-bar"]',
            BAR_VALUE: '[class*="bar-value"]'
        }
    };

    /**
     * Utility functions for local storage operations
     */
    const StorageUtil = {
        /**
         * Get a value from localStorage with optional parsing
         * @param {string} key - The localStorage key
         * @param {boolean} parseJson - Whether to parse the value as JSON
         * @param {*} defaultValue - Default value if key doesn't exist
         * @returns {*} The stored value or default
         */
        get(key, parseJson = false, defaultValue = null) {
            const value = localStorage.getItem(key);
            if (value === null) return defaultValue;
            return parseJson ? JSON.parse(value) : value;
        },

        /**
         * Store a value in localStorage with optional stringifying
         * @param {string} key - The localStorage key
         * @param {*} value - The value to store
         * @param {boolean} stringify - Whether to stringify the value
         */
        set(key, value, stringify = false) {
            localStorage.setItem(key, stringify ? JSON.stringify(value) : value);
        },

        /**
         * Remove a value from localStorage
         * @param {string} key - The localStorage key
         */
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    /**
     * Utility functions for DOM operations
     */
    const DOMUtil = {
        /**
         * Create an HTML element with attributes and styles
         * @param {string} tag - The HTML tag name
         * @param {Object} options - Element configuration options
         * @param {string} [options.id] - Element ID
         * @param {string|Array} [options.className] - Element class name(s)
         * @param {Object} [options.styles] - CSS styles to apply
         * @param {Object} [options.attributes] - HTML attributes to set
         * @param {string} [options.text] - Text content
         * @param {string} [options.html] - HTML content
         * @param {Function} [options.onClick] - Click event handler
         * @param {Array} [options.children] - Child elements to append
         * @returns {HTMLElement} The created element
         */
        createElement(tag, options = {}) {
            const element = document.createElement(tag);

            if (options.id) element.id = options.id;

            if (options.className) {
                const classes = Array.isArray(options.className) ? options.className : [options.className];
                element.classList.add(...classes);
            }

            if (options.styles) {
                Object.assign(element.style, options.styles);
            }

            if (options.attributes) {
                for (const [key, value] of Object.entries(options.attributes)) {
                    element.setAttribute(key, value);
                }
            }

            if (options.text) element.textContent = options.text;
            if (options.html) element.innerHTML = options.html;

            if (options.onClick) {
                element.addEventListener('click', options.onClick);
            }

            if (options.children) {
                options.children.forEach(child => element.appendChild(child));
            }

            return element;
        },

        /**
     * Format time in seconds to MM:SS format - modified for accuracy
     * @param {number} totalSeconds - Time in seconds
     * @returns {string} Formatted time string
     */
        formatTime(totalSeconds) {
            if (totalSeconds <= 0) return '00:00';
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },

        /**
         * Calculate color based on remaining time
         * @param {number} totalSeconds - Remaining time in seconds
         * @returns {string} RGB color string
         */
        calculateTimerColor(totalSeconds) {
            if (totalSeconds <= 0) return CONFIG.UI.COLORS.INACTIVE;

            // Calculate color gradient from green to red
            const maxTime = CONFIG.TIMER.MAX_REFERENCE_SECONDS;
            const ratio = Math.min(totalSeconds / maxTime, 1); // Cap at 1

            let r, g;
            if (ratio > 0.5) {
                r = Math.floor(255 * (1 - (ratio - 0.5) * 2));
                g = 255;
            } else {
                r = 255;
                g = Math.floor(255 * ratio * 2);
            }

            return `rgb(${r}, ${g}, 0)`;
        },

        /**
         * Make an element draggable
         * @param {HTMLElement} element - The element to make draggable
         * @param {HTMLElement} handle - The element to use as a drag handle
         * @param {Function} onPositionChange - Callback when position changes
         */
        makeDraggable(element, handle, onPositionChange) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            // Mouse events
            handle.onmousedown = dragStart;

            // Touch events for mobile
            handle.ontouchstart = touchStart;

            function dragStart(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = dragEnd;
                document.onmousemove = drag;
            }

            function touchStart(e) {
                e.preventDefault();
                const touch = e.touches[0];
                pos3 = touch.clientX;
                pos4 = touch.clientY;
                document.ontouchend = touchEnd;
                document.ontouchmove = touchDrag;
            }

            function drag(e) {
                e.preventDefault();
                updatePosition(e.clientX, e.clientY);
            }

            function touchDrag(e) {
                e.preventDefault();
                const touch = e.touches[0];
                updatePosition(touch.clientX, touch.clientY);
            }

            function updatePosition(clientX, clientY) {
                pos1 = pos3 - clientX;
                pos2 = pos4 - clientY;
                pos3 = clientX;
                pos4 = clientY;

                // Update element position
                element.style.top = (element.offsetTop - pos2) + 'px';
                element.style.left = (element.offsetLeft - pos1) + 'px';

                // Call callback function if provided
                if (onPositionChange) {
                    onPositionChange(element.style.top, element.style.left);
                }
            }

            function dragEnd() {
                document.onmouseup = null;
                document.onmousemove = null;
            }

            function touchEnd() {
                document.ontouchend = null;
                document.ontouchmove = null;
            }
        }
    };

    /**
     * API client for Torn API interactions
     */
    class TornAPIClient {
        /**
         * Create a new API client
         * @param {string} apiKey - The Torn API key
         */
        constructor(apiKey) {
            this.apiKey = apiKey;
        }

        /**
         * Make an API request
         * @param {string} endpoint - API endpoint
         * @param {Object} params - Request parameters
         * @returns {Promise<Object>} API response
         * @private
         */
        async _apiRequest(endpoint, params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const url = `${CONFIG.API.BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `ApiKey ${this.apiKey}`
                    }
                });

                const data = await response.json();

                if (data.error) {
                    return { success: false, message: data.error.error };
                }

                return { success: true, data };
            } catch (error) {
                return { success: false, message: `API error: ${error.message}` };
            }
        }

        /**
         * Validate the API key
         * @returns {Promise<Object>} Validation result
         */
        async validateApiKey() {
            const result = await this._apiRequest(
                CONFIG.API.ENDPOINTS.USER,
                { selections: CONFIG.API.SELECTIONS.BARS }
            );

            return {
                isValid: result.success,
                message: result.success ? 'API Key validated successfully!' : result.message
            };
        }

        /**
     * Fetch chain data
     * @returns {Promise<Object>} Chain data
     */
        async fetchChainData() {
            const result = await this._apiRequest(
                CONFIG.API.ENDPOINTS.FACTION,
                { selections: CONFIG.API.SELECTIONS.CHAIN }
            );

            if (!result.success) {
                return result;
            }

            // Process chain data
            const chain = result.data.chain || { current: 0, max: 10, timeout: 0, start: 0, end: 0 };
            const { current, max, timeout, start, end } = chain;

            // Calculate remaining time
            const currentTime = Math.floor(Date.now() / 1000);

            // Use Math.floor instead of Math.ceil for more accurate timing
            let remainingSeconds = end > currentTime ? Math.floor(end - currentTime) : 0;

            return {
                success: true,
                chainText: `Chain: ${current}/${max}`,
                timeString: DOMUtil.formatTime(remainingSeconds),
                current,
                max,
                timeout,
                start,
                end,
                remainingSeconds
            };
        }
    }

    /**
     * Chain data manager
     */
    class ChainDataManager {
        /**
         * Create a new chain data manager
         * @param {Function} onDataUpdate - Callback when data is updated
         */
        constructor(onDataUpdate) {
            this.apiClient = null;
            this.lastChainData = StorageUtil.get(CONFIG.STORAGE.LAST_DATA, true, null);
            this.lastUpdateTime = parseInt(StorageUtil.get(CONFIG.STORAGE.LAST_UPDATE, false, '0'));
            this.onDataUpdate = onDataUpdate;
            this.refreshTimer = null;
        }

        /**
         * Initialize with API key
         * @param {string} apiKey - The Torn API key
         */
        init(apiKey) {
            this.apiClient = new TornAPIClient(apiKey);
        }

        /**
         * Check if we need to refresh data
         * @param {string|null} currentBarValue - Current chain bar value from UI
         * @returns {boolean} Whether refresh is needed
         */
        needsRefresh(currentBarValue) {
            // If no cached data, refresh is needed
            if (!this.lastChainData || !this.lastChainData.success) {
                return true;
            }

            // Check cache age
            const now = Date.now();
            const maxCacheAge = CONFIG.API.CACHE_MAX_AGE_MS;
            if (now - this.lastUpdateTime >= maxCacheAge) {
                return true;
            }

            // If we have current bar value, compare with cached data
            if (currentBarValue) {
                const barValueMatch = currentBarValue.match(/(\d+)\/(\d+)/);

                if (barValueMatch && this.lastChainData.current !== undefined) {
                    const barCurrent = parseInt(barValueMatch[1]);
                    return barCurrent !== this.lastChainData.current;
                }
            }

            return false;
        }

        /**
         * Update chain data
         * @param {string|null} currentBarValue - Current chain bar value from UI
         * @returns {Promise<Object>} Updated chain data
         */
        async updateData(currentBarValue) {
            // Check if refresh is needed
            if (!this.needsRefresh(currentBarValue)) {
                // Use cached data but update time-related fields
                if (this.lastChainData && this.lastChainData.end) {
                    const currentTime = Math.floor(Date.now() / 1000);
                    let remainingSeconds = 0;

                    if (this.lastChainData.end > currentTime) {
                        remainingSeconds = this.lastChainData.end - currentTime;
                    }

                    this.lastChainData.timeString = DOMUtil.formatTime(remainingSeconds);
                    this.lastChainData.remainingSeconds = remainingSeconds;
                }

                return this.lastChainData;
            }

            // Fetch fresh data
            if (!this.apiClient) {
                return { success: false, message: 'API client not initialized' };
            }

            const chainData = await this.apiClient.fetchChainData();

            if (chainData.success) {
                // Update cache
                this.lastChainData = chainData;
                this.lastUpdateTime = Date.now();

                // Save to localStorage
                StorageUtil.set(CONFIG.STORAGE.LAST_DATA, chainData, true);
                StorageUtil.set(CONFIG.STORAGE.LAST_UPDATE, this.lastUpdateTime);

                // Notify listeners
                if (this.onDataUpdate) {
                    this.onDataUpdate(chainData);
                }
            }

            return chainData;
        }

        /**
         * Force data refresh
         * @returns {Promise<Object>} Updated chain data
         */
        async forceRefresh() {
            // Reset last update time to force refresh
            this.lastUpdateTime = 0;
            return await this.updateData(null);
        }

        /**
         * Start periodic refresh timer
         * @param {number} interval - Refresh interval in ms
         */
        startRefreshTimer(interval = CONFIG.TIMER.REFRESH_INTERVAL_MS) {
            this.stopRefreshTimer();

            this.refreshTimer = setInterval(() => {
                this.updateData(null);
            }, interval);
        }

        /**
         * Stop periodic refresh timer
         */
        stopRefreshTimer() {
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
        }

        /**
         * Update chain data with simulated time
         * @param {number} seconds - Simulated remaining seconds
         * @returns {Object} Updated chain data
         */
        simulateTime(seconds) {
            if (!this.lastChainData || !this.lastChainData.success) {
                return { success: false, message: 'No chain data available to simulate' };
            }

            // Update with simulated time
            const newEndTime = Math.floor(Date.now() / 1000) + seconds;
            this.lastChainData.end = newEndTime;
            this.lastChainData.remainingSeconds = seconds;
            this.lastChainData.timeString = DOMUtil.formatTime(seconds);

            // Save to localStorage
            StorageUtil.set(CONFIG.STORAGE.LAST_DATA, this.lastChainData, true);

            // Notify listeners
            if (this.onDataUpdate) {
                this.onDataUpdate(this.lastChainData);
            }

            return this.lastChainData;
        }
    }

    /**
     * Chain bar observer for monitoring UI changes
     */
    class ChainBarObserver {
        /**
         * Create a new chain bar observer
         * @param {Function} onChange - Callback when chain value changes
         */
        constructor(onChange) {
            this.observer = null;
            this.lastChainValue = null;
            this.onChange = onChange;
            this.observeTimeout = null;
        }

        /**
         * Start observing chain bar changes
         */
        start() {
            this.stop();
            this.observeChainBar();
        }

        /**
         * Stop observing chain bar changes
         */
        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            if (this.observeTimeout) {
                clearTimeout(this.observeTimeout);
                this.observeTimeout = null;
            }
        }

        /**
         * Find chain bar element in DOM
         * @returns {Object|null} Chain bar elements or null
         */
        findChainBarElements() {
            // Find chain bar element
            const chainBarElements = Array.from(document.querySelectorAll(CONFIG.SELECTORS.CHAIN_BAR));
            const chainBar = chainBarElements.find(el =>
                Array.from(el.classList).some(cls => cls.startsWith('chain-bar')));

            if (!chainBar) return null;

            // Find bar value element
            const barValueElements = Array.from(chainBar.querySelectorAll(CONFIG.SELECTORS.BAR_VALUE));
            const barValue = barValueElements.find(el =>
                Array.from(el.classList).some(cls => cls.startsWith('bar-value')));

            if (!barValue) return null;

            return { chainBar, barValue };
        }

        /**
         * Find chain bar and set up observation
         */
        observeChainBar() {
            const elements = this.findChainBarElements();

            // If chain bar not found, retry later
            if (!elements) {
                this.observeTimeout = setTimeout(() => this.observeChainBar(), 2000);
                return;
            }

            const { barValue } = elements;
            this.lastChainValue = barValue.textContent;

            // Set up mutation observer
            this.observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const newValue = barValue.textContent;
                        if (newValue !== this.lastChainValue) {
                            this.lastChainValue = newValue;

                            // Call change handler with debounce
                            if (this.observeTimeout) {
                                clearTimeout(this.observeTimeout);
                            }

                            this.observeTimeout = setTimeout(() => {
                                if (this.onChange) {
                                    this.onChange(newValue);
                                }
                                this.observeTimeout = null;
                            }, 500);

                            break;
                        }
                    }
                }
            });

            // Start observing
            this.observer.observe(barValue, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        /**
         * Get current chain bar value if available
         * @returns {string|null} Current chain bar value
         */
        getCurrentValue() {
            const elements = this.findChainBarElements();
            return elements ? elements.barValue.textContent : null;
        }
    }

    /**
     * Alert system for chain timer notifications
     */
    class AlertSystem {
        /**
         * Create a new alert system
         */
        constructor() {
            this.flashOverlay = null;
        }

        /**
 * Flash the screen as an alert with a single slow pulse
 * @param {string} intensity - Alert intensity ('normal', 'high', or 'critical')
 */
        flashScreen(intensity = 'normal') {
            // Create flash overlay if it doesn't exist
            if (!this.flashOverlay) {
                this.flashOverlay = DOMUtil.createElement('div', {
                    id: 'chain-monitor-flash',
                    styles: {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                        pointerEvents: 'none',
                        zIndex: CONFIG.UI.Z_INDEX.FLASH
                    }
                });
                document.body.appendChild(this.flashOverlay);
            }

            // Configure colors based on intensity
            let baseColor, flashOpacity;

            switch (intensity) {
                case 'critical':
                    baseColor = 'rgba(255, 40, 40, 0.6)'; // Red
                    flashOpacity = 0.2;
                    break;
                case 'high':
                    baseColor = 'rgba(255, 165, 0, 0.6)'; // Bright orange
                    flashOpacity = 0.15;
                    break;
                default: // normal
                    baseColor = 'rgba(255, 165, 0, 0.4)'; // Orange
                    flashOpacity = 0.1;
            }

            // Define the keyframes for a simple fade-in/fade-out animation
            const pulseAnimation = `
        @keyframes simpleChainPulse {
            0% { background-color: transparent; }
            50% { background-color: ${baseColor.replace(/[\d.]+\)$/, `${flashOpacity})`)}}
            100% { background-color: transparent; }
        }
    `;

            // Add or update the style element
            let styleElement = document.getElementById('chain-monitor-animations');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'chain-monitor-animations';
                document.head.appendChild(styleElement);
            }
            styleElement.textContent = pulseAnimation;

            // Apply the animation - one slow pulse
            this.flashOverlay.style.animation = `simpleChainPulse ${CONFIG.TIMER.FLASH_DURATION_MS / 1000}s ease-in-out 0s 1`;

            // Clear the animation when it's done
            setTimeout(() => {
                if (this.flashOverlay) {
                    this.flashOverlay.style.animation = 'none';
                    this.flashOverlay.style.backgroundColor = 'transparent';
                }
            }, CONFIG.TIMER.FLASH_DURATION_MS);
        }

        /**
         * Check if an alert should be triggered for the given time
         * @param {number} minutes - Minutes remaining
         * @param {number} seconds - Seconds remaining
         */
        checkTimeThresholds(minutes, seconds) {
            const thresholds = CONFIG.TIMER.ALERT_THRESHOLDS;

            // Alert at specific minute marks with 0 seconds
            if (seconds === 0 && thresholds.MINUTES.includes(minutes)) {
                this.flashScreen('normal');
                return;
            }

            // Only check second thresholds when at 0 minutes
            if (minutes === 0) {
                if (seconds === 59 || seconds === 50 || seconds === 40) {
                    this.flashScreen('high');
                } else if ([30, 20, 10].includes(seconds)) {
                    this.flashScreen('critical');
                }
            }
        }
    }

    /**
 * Timer controller for managing countdown timers - FIXED VERSION
 */
    class TimerController {
        /**
         * Create a new timer controller
         * @param {Function} onUpdate - Callback when timer updates
         * @param {Function} onComplete - Callback when timer completes
         */
        constructor(onUpdate, onComplete) {
            this.timerInterval = null;
            this.endTime = null;
            this.onUpdate = onUpdate;
            this.onComplete = onComplete;
            this.alertSystem = new AlertSystem();
            this.adjustmentFactor = 0; // Added adjustment factor to sync with server time
        }

        /**
         * Start the timer
         * @param {number} endTimeSeconds - End time in seconds (Unix timestamp) or duration in seconds
         * @param {boolean} isDuration - Whether endTimeSeconds is a duration
         */
        start(endTimeSeconds, isDuration = false) {
            this.stop();

            // Convert duration to end time if needed
            if (isDuration) {
                this.endTime = (Date.now() / 1000) + endTimeSeconds;
            } else {
                this.endTime = endTimeSeconds;

                // Calculate the adjustment factor based on current time difference
                // This helps synchronize with the server time
                const currentTime = Date.now() / 1000;
                const initialDifference = this.endTime - currentTime;

                // Only apply small adjustments to avoid major disruptions
                if (initialDifference > 0 && initialDifference < 300) {
                    // Adjust by 1 second to account for network delay and processing time
                    this.adjustmentFactor = 1;
                }
            }

            // Update immediately
            this.updateTimer();

            // Use requestAnimationFrame for more accurate timing
            const updateWithRAF = () => {
                this.updateTimer();
                if (this.timerInterval) {
                    requestAnimationFrame(updateWithRAF);
                }
            };

            // Start the animation frame loop
            this.timerInterval = true;
            requestAnimationFrame(updateWithRAF);
        }

        /**
         * Stop the timer
         */
        stop() {
            this.timerInterval = null;
        }

        /**
         * Update the timer
         */
        updateTimer() {
            if (!this.endTime) return;

            const currentTime = Date.now() / 1000;

            // Apply the adjustment factor to make timer match website more closely
            const adjustedEndTime = this.endTime - this.adjustmentFactor;

            // Use Math.floor instead of Math.ceil for more accurate timing
            // This prevents the extra second that was being added
            const remainingSeconds = Math.max(0, Math.floor(adjustedEndTime - currentTime));

            if (remainingSeconds <= 0) {
                // Timer completed
                if (this.onComplete) {
                    this.onComplete();
                }
                this.stop();
                return;
            }

            // Calculate minutes and seconds
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;

            // Check if we need to trigger alerts
            this.alertSystem.checkTimeThresholds(minutes, seconds);

            // Update display
            if (this.onUpdate) {
                this.onUpdate(remainingSeconds, minutes, seconds);
            }
        }

        /**
         * Simulate a specific time
         * @param {number} seconds - Seconds to simulate
         */
        simulateTime(seconds) {
            this.endTime = (Date.now() / 1000) + seconds;
            this.adjustmentFactor = 0; // Reset adjustment factor for simulations
            this.updateTimer();
            return seconds;
        }
    }

    /**
     * UI component base class
     */
    class UIComponent {
        /**
         * Create a new UI component
         */
        constructor() {
            this.element = null;
        }

        /**
         * Render the component
         * @returns {HTMLElement} The rendered element
         */
        render() {
            return this.element;
        }

        /**
         * Remove the component from DOM
         */
        remove() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    /**
     * Window component for floating windows
     */
    class WindowComponent extends UIComponent {
        /**
         * Create a new window component
         * @param {string} title - Window title
         * @param {Object} options - Window options
         */
        constructor(title, options = {}) {
            super();
            this.title = title;
            this.options = options;
            this.position = options.position || {};
            this.onClose = options.onClose || null;
            this.draggable = options.draggable !== false;
            this.element = this.createWindow();
        }

        /**
         * Create the window element
         * @returns {HTMLElement} The window element
         */
        createWindow() {
            // Position from options or defaults
            const top = this.position.top || '100px';
            const left = this.position.left || '100px';
            const width = this.options.width || '250px';

            // Create the window container
            const window = DOMUtil.createElement('div', {
                className: this.options.className || 'chain-monitor-window',
                styles: {
                    position: 'fixed',
                    top,
                    left,
                    width,
                    background: CONFIG.UI.COLORS.BACKGROUND,
                    border: `1px solid ${CONFIG.UI.COLORS.BORDER}`,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    zIndex: CONFIG.UI.Z_INDEX.WINDOW,
                    cursor: 'move',
                    padding: '5px',
                    fontFamily: CONFIG.UI.FONT.FAMILY,
                    color: CONFIG.UI.COLORS.TEXT
                }
            });

            // Create header
            const header = this.createHeader();
            window.appendChild(header);

            // Make window draggable if enabled
            if (this.draggable) {
                DOMUtil.makeDraggable(window, header, (top, left) => {
                    // Save position when dragged
                    if (this.options.onPositionChange) {
                        this.options.onPositionChange(top, left);
                    }
                });
            }

            // Create content container
            const content = DOMUtil.createElement('div', {
                styles: {
                    padding: '10px'
                }
            });

            // Add content
            if (this.options.content) {
                content.appendChild(this.options.content);
            }

            window.appendChild(content);
            return window;
        }

        /**
         * Create the window header
         * @returns {HTMLElement} The header element
         */
        createHeader() {
            const header = DOMUtil.createElement('div', {
                styles: {
                    background: CONFIG.UI.COLORS.HEADER,
                    padding: '5px',
                    fontWeight: 'bold',
                    userSelect: 'none',
                    color: CONFIG.UI.COLORS.HEADER_TEXT,
                    borderBottom: `1px solid ${CONFIG.UI.COLORS.BORDER}`,
                    position: 'relative'
                }
            });

            // Add title
            const title = DOMUtil.createElement('span', {
                text: this.title
            });
            header.appendChild(title);

            // Add close button
            const closeButton = DOMUtil.createElement('span', {
                text: '×',
                styles: {
                    position: 'absolute',
                    right: '5px',
                    top: '5px',
                    color: CONFIG.UI.COLORS.TEXT,
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '0 5px'
                },
                onClick: (e) => {
                    e.stopPropagation();
                    this.remove();
                    if (this.onClose) this.onClose();
                }
            });
            header.appendChild(closeButton);

            return header;
        }

        /**
         * Set the content of the window
         * @param {HTMLElement} content - The content element
         */
        setContent(content) {
            const contentContainer = this.element.querySelector('div:nth-child(2)');
            if (contentContainer) {
                // Clear existing content
                contentContainer.innerHTML = '';
                contentContainer.appendChild(content);
            }
        }

        /**
         * Update window position
         * @param {string} top - Top position
         * @param {string} left - Left position
         */
        updatePosition(top, left) {
            this.element.style.top = top;
            this.element.style.left = left;
            this.position = { top, left };
        }
    }

    /**
     * Chain window component
     */
    class ChainWindowComponent extends WindowComponent {
        /**
         * Create a new chain window
         * @param {Object} options - Window options
         */
        constructor(options = {}) {
            const defaultOptions = {
                width: CONFIG.UI.WINDOWS.CHAIN.DEFAULT_WIDTH,
                position: {
                    top: options.position?.top || CONFIG.UI.WINDOWS.CHAIN.DEFAULT_POSITION.TOP,
                    left: options.position?.left || CONFIG.UI.WINDOWS.CHAIN.DEFAULT_POSITION.LEFT
                }
            };

            super('Chain Monitor', { ...defaultOptions, ...options });

            this.chainDisplay = null;
            this.timeDisplay = null;
            this.progressFill = null;
            this.timerController = null;

            // Create content with chain info components
            const content = this.createChainContent();
            this.setContent(content);

            // Initialize timer controller
            this.timerController = new TimerController(
                this.updateTimerDisplay.bind(this),
                this.handleTimerComplete.bind(this)
            );
        }

        /**
         * Create the chain window content
         * @returns {HTMLElement} Content element
         */
        createChainContent() {
            const content = document.createDocumentFragment();

            // Create table-like layout for chain info
            const displayTable = DOMUtil.createElement('table', {
                styles: {
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '10px'
                }
            });

            const row = displayTable.insertRow();

            // Chain display cell (left)
            const chainCell = row.insertCell();
            Object.assign(chainCell.style, {
                textAlign: 'left',
                width: '65%',
                padding: '0'
            });

            this.chainDisplay = DOMUtil.createElement('span', {
                id: 'chain-display',
                styles: {
                    color: CONFIG.UI.COLORS.TEXT,
                    fontSize: CONFIG.UI.FONT.SIZE.NORMAL
                },
                text: 'Fetching chain data...'
            });
            chainCell.appendChild(this.chainDisplay);

            // Timer display cell (right)
            const timeCell = row.insertCell();
            Object.assign(timeCell.style, {
                textAlign: 'right',
                width: '35%',
                padding: '0'
            });

            this.timeDisplay = DOMUtil.createElement('span', {
                id: 'time-display',
                styles: {
                    color: CONFIG.UI.COLORS.TEXT,
                    fontSize: CONFIG.UI.FONT.SIZE.NORMAL
                },
                text: '00:00'
            });
            timeCell.appendChild(this.timeDisplay);

            content.appendChild(displayTable);

            // Create progress bar
            const progressContainer = DOMUtil.createElement('div', {
                styles: {
                    width: '100%',
                    height: '10px',
                    background: CONFIG.UI.COLORS.PROGRESS_BG,
                    marginTop: '5px',
                    border: '1px solid #444',
                    position: 'relative',
                    overflow: 'hidden'
                }
            });

            this.progressFill = DOMUtil.createElement('div', {
                id: 'progress-fill',
                styles: {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '0%',
                    height: '100%',
                    background: CONFIG.UI.COLORS.PROGRESS_BAR,
                    transition: 'width 0.3s ease'
                }
            });
            progressContainer.appendChild(this.progressFill);

            content.appendChild(progressContainer);
            return content;
        }

        /**
         * Update the chain data display
         * @param {Object} chainData - Chain data to display
         */
        updateChainData(chainData) {
            if (!chainData || !chainData.success) {
                this.chainDisplay.textContent = 'Error fetching chain';
                return;
            }

            // Update chain count
            this.chainDisplay.textContent = chainData.chainText;

            // Update progress bar
            const [_, current, max] = chainData.chainText.match(/Chain: (\d+)\/(\d+)/) || [null, 0, 10];
            const percentage = (parseInt(current) / parseInt(max)) * 100;
            this.progressFill.style.width = `${percentage}%`;

            // Update timer
            if (chainData.end) {
                if (chainData.timeString === '00:00') {
                    this.timeDisplay.textContent = 'Inactive';
                    this.timeDisplay.style.color = CONFIG.UI.COLORS.INACTIVE;
                    this.timerController.stop();
                } else {
                    this.timerController.start(chainData.end, false);
                }
            }
        }

        /**
         * Update the timer display
         * @param {number} totalSeconds - Total seconds remaining
         */
        updateTimerDisplay(totalSeconds) {
            if (totalSeconds <= 0) {
                this.timeDisplay.textContent = 'Inactive';
                this.timeDisplay.style.color = CONFIG.UI.COLORS.INACTIVE;
                return;
            }

            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            this.timeDisplay.textContent = DOMUtil.formatTime(totalSeconds);

            // Set color based on remaining time
            this.timeDisplay.style.color = DOMUtil.calculateTimerColor(totalSeconds);
        }

        /**
         * Handle timer completion
         */
        handleTimerComplete() {
            this.timeDisplay.textContent = 'Inactive';
            this.timeDisplay.style.color = CONFIG.UI.COLORS.INACTIVE;
        }

        /**
         * Simulate a specific time for testing
         * @param {number} seconds - Seconds to simulate
         */
        simulateTime(seconds) {
            return this.timerController.simulateTime(seconds);
        }
    }

    /**
     * Login window component
     */
    class LoginWindowComponent extends WindowComponent {
        /**
         * Create a new login window
         * @param {Object} options - Window options
         */
        constructor(options = {}) {
            const defaultOptions = {
                position: {
                    top: CONFIG.UI.WINDOWS.LOGIN.DEFAULT_POSITION.TOP,
                    left: CONFIG.UI.WINDOWS.LOGIN.DEFAULT_POSITION.LEFT
                },
                className: 'chain-monitor-login'
            };

            super('Chain Monitor Login', { ...defaultOptions, ...options });

            this.errorMessage = null;
            this.onValidateKey = options.onValidateKey || null;

            // Create login form
            const form = this.createLoginForm();
            this.setContent(form);
        }

        /**
         * Create the login form
         * @returns {HTMLElement} Form element
         */
        createLoginForm() {
            const form = DOMUtil.createElement('div');

            // API Key input
            const input = DOMUtil.createElement('input', {
                attributes: {
                    type: 'text',
                    placeholder: 'Enter API Key'
                },
                styles: {
                    width: '100%',
                    padding: '5px',
                    marginBottom: '5px',
                    boxSizing: 'border-box',
                    background: CONFIG.UI.COLORS.HEADER,
                    border: `1px solid #444`,
                    color: CONFIG.UI.COLORS.TEXT
                }
            });

            // Error message display
            this.errorMessage = DOMUtil.createElement('div', {
                styles: {
                    color: CONFIG.UI.COLORS.ERROR,
                    fontSize: CONFIG.UI.FONT.SIZE.SMALL,
                    marginBottom: '5px',
                    minHeight: '16px'
                },
                text: ''
            });

            // Submit button
            const submitButton = DOMUtil.createElement('button', {
                text: 'Submit',
                styles: {
                    background: CONFIG.UI.COLORS.BUTTON,
                    color: CONFIG.UI.COLORS.HEADER_TEXT,
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    width: '100%',
                    marginBottom: '5px'
                },
                onClick: () => this.handleSubmit(input.value)
            });

            // Handle Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmit(input.value);
                }
            });

            form.appendChild(input);
            form.appendChild(this.errorMessage);
            form.appendChild(submitButton);

            return form;
        }

        /**
         * Handle form submission
         * @param {string} apiKey - The entered API key
         */
        async handleSubmit(apiKey) {
            const key = apiKey.trim();
            if (!key) {
                this.errorMessage.textContent = 'Please enter a valid API Key.';
                return;
            }

            this.errorMessage.textContent = 'Validating...';

            if (this.onValidateKey) {
                const result = await this.onValidateKey(key);
                if (!result.isValid) {
                    this.errorMessage.textContent = result.message;
                }
            }
        }

        /**
         * Show an error message
         * @param {string} message - Error message to display
         */
        showError(message) {
            this.errorMessage.textContent = message;
        }
    }

    /**
     * Settings menu integration
     */
    class SettingsMenuIntegration {
        /**
         * Create a new settings menu integration
         * @param {Function} onClick - Callback when menu item is clicked
         */
        constructor(onClick) {
            this.settingsMenu = null;
            this.menuItem = null;
            this.linkElement = null;
            this.onClick = onClick;
            this.waitingForMenu = false;
            this.observer = null;
            this.checkInterval = null;
        }

        /**
         * Initialize the settings menu integration
         */
        init() {
            this.waitForSettingsMenu();
        }

        /**
         * Wait for the settings menu to be available in DOM
         */
        waitForSettingsMenu() {
            // Check if menu already exists
            this.settingsMenu = document.querySelector(CONFIG.SELECTORS.SETTINGS_MENU);
            if (this.settingsMenu) {
                this.addChainMonitorLink();
                return;
            }

            // Set waiting flag and start observing
            if (this.waitingForMenu) return;
            this.waitingForMenu = true;

            // Use MutationObserver to detect menu
            this.observer = new MutationObserver((mutations, obs) => {
                this.settingsMenu = document.querySelector(CONFIG.SELECTORS.SETTINGS_MENU);
                if (this.settingsMenu) {
                    const existingLink = this.settingsMenu.querySelector(CONFIG.SELECTORS.CHAIN_MONITOR_LINK);
                    if (!existingLink) {
                        this.addChainMonitorLink();
                    }
                    obs.disconnect();
                    this.waitingForMenu = false;
                    this.observer = null;
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Aggressive checking for mobile environments
            this.checkInterval = setInterval(() => {
                if (this.waitingForMenu) {
                    this.settingsMenu = document.querySelector(CONFIG.SELECTORS.SETTINGS_MENU);
                    if (this.settingsMenu) {
                        const existingLink = this.settingsMenu.querySelector(CONFIG.SELECTORS.CHAIN_MONITOR_LINK);
                        if (!existingLink) {
                            this.addChainMonitorLink();
                        }
                        this.waitingForMenu = false;
                        clearInterval(this.checkInterval);
                        this.checkInterval = null;
                    }
                } else {
                    clearInterval(this.checkInterval);
                    this.checkInterval = null;
                }
            }, 500);

            // Clean up after timeout period
            setTimeout(() => {
                if (this.checkInterval) {
                    clearInterval(this.checkInterval);
                    this.checkInterval = null;
                }
            }, 10000);
        }

        /**
         * Add Chain Monitor link to settings menu
         */
        addChainMonitorLink() {
            if (!this.settingsMenu) return;

            const newsTickerItem = this.settingsMenu.querySelector(CONFIG.SELECTORS.NEWSTICKER);
            if (!newsTickerItem) return;

            // Check if we've already added the link
            const existingLink = this.settingsMenu.querySelector(CONFIG.SELECTORS.CHAIN_MONITOR_LINK);
            if (existingLink) {
                // Link already exists, store reference to parent
                this.linkElement = existingLink.closest('a');
                return;
            }

            // Create menu item
            this.menuItem = DOMUtil.createElement('li', {
                className: 'link'
            });

            // Create link element
            const link = DOMUtil.createElement('a', {
                attributes: {
                    href: '#'
                },
                onClick: (e) => {
                    e.preventDefault();
                    if (this.onClick) this.onClick();
                }
            });
            this.linkElement = link;

            // Create icon
            const iconWrapper = DOMUtil.createElement('div', {
                className: 'icon-wrapper',
                html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="27" fill="#fff"><path d="M17,7h-3c-0.55,0-1,0.45-1,1s0.45,1,1,1h3c1.65,0,3,1.35,3,3s-1.35,3-3,3h-3c-0.55,0-1,0.45-1,1c0,0.55,0.45,1,1,1h3c2.76,0,5-2.24,5-5S19.76,7,17,7z M8,12c0-0.55,0.45-1,1-1h6c0.55,0,1,0.45,1,1s-0.45,1-1,1H9C8.45,13,8,12.55,8,12z M10,15H7c-1.65,0-3-1.35-3-3s1.35-3,3-3h3c0.55,0,1-0.45,1-1S10.55,7,10,7H7c-2.76,0-5,2.24-5,5s2.24,5,5,5h3c0.55,0,1-0.45,1-1C11,15.45,10.55,15,10,15z"/></svg>'
            });

            // Create text
            const linkText = DOMUtil.createElement('span', {
                className: 'link-text',
                text: 'Chain Monitor',
                attributes: {
                    'data-chain-monitor': 'true'
                }
            });

            link.appendChild(iconWrapper);
            link.appendChild(linkText);
            this.menuItem.appendChild(link);

            // Add to menu
            newsTickerItem.insertAdjacentElement('afterend', this.menuItem);

            // Add global styles
            this.addGlobalStyles();
        }

        /**
         * Add global styles for menu integration
         */
        addGlobalStyles() {
            const style = DOMUtil.createElement('style', {
                text: `
                    .chain-monitor-window {
                        transition: opacity 0.3s ease;
                    }
                    .settings-menu .link a.active {
                        background-color: ${CONFIG.UI.COLORS.BUTTON} !important;
                        color: ${CONFIG.UI.COLORS.HEADER_TEXT} !important;
                    }
                    .settings-menu .link a.active svg {
                        filter: brightness(1.2);
                    }
                `
            });
            document.head.appendChild(style);
        }

        /**
         * Set the active state of the menu item
         * @param {boolean} isActive - Whether the item should be active
         */
        setActive(isActive) {
            if (this.linkElement) {
                if (isActive) {
                    this.linkElement.classList.add('active');
                } else {
                    this.linkElement.classList.remove('active');
                }
            }
        }
    }

    /**
     * Main Chain Monitor Controller
     */
    class ChainMonitorController {
        /**
         * Create a new chain monitor controller
         */
        constructor() {
            this.settingsMenu = new SettingsMenuIntegration(this.handleMenuClick.bind(this));
            this.chainWindow = null;
            this.loginWindow = null;
            this.chainDataManager = new ChainDataManager(this.handleDataUpdate.bind(this));
            this.chainBarObserver = new ChainBarObserver(this.handleChainBarChange.bind(this));
            this.isWindowOpen = StorageUtil.get(CONFIG.STORAGE.WINDOW_OPEN) === 'true';
        }

        /**
         * Initialize the chain monitor
         */
        init() {
            // Initialize settings menu integration
            this.settingsMenu.init();

            // Initialize chain bar observer
            this.chainBarObserver.start();

            // Open chain window if it was previously open
            if (this.isWindowOpen) {
                const apiKey = StorageUtil.get(CONFIG.STORAGE.API_KEY);
                if (apiKey) {
                    this.openChainWindow(apiKey);
                }
            }
        }

        /**
         * Close all open windows
         */
        closeAllWindows() {
            if (this.chainWindow) {
                this.chainWindow.remove();
                this.chainWindow = null;
            }

            if (this.loginWindow) {
                this.loginWindow.remove();
                this.loginWindow = null;
            }

            this.isWindowOpen = false;
            StorageUtil.set(CONFIG.STORAGE.WINDOW_OPEN, 'false');
            this.settingsMenu.setActive(false);
            this.chainDataManager.stopRefreshTimer();
        }

        /**
         * Handle menu click
         */
        async handleMenuClick() {
            if (this.chainWindow || this.loginWindow) {
                // Close all windows if any are open
                this.closeAllWindows();
                return;
            }

            // Open window with API key or show login
            const apiKey = StorageUtil.get(CONFIG.STORAGE.API_KEY);
            if (apiKey) {
                await this.openChainWindow(apiKey);
            } else {
                this.showLoginWindow();
            }
        }

        /**
         * Open the chain window
         * @param {string} apiKey - API key to use
         */
        async openChainWindow(apiKey) {
            // Close any open windows first
            this.closeAllWindows();

            // Initialize API client
            this.chainDataManager.init(apiKey);

            // Get saved position
            const savedPosition = {
                top: StorageUtil.get(CONFIG.STORAGE.WINDOW_TOP) || CONFIG.UI.WINDOWS.CHAIN.DEFAULT_POSITION.TOP,
                left: StorageUtil.get(CONFIG.STORAGE.WINDOW_LEFT) || CONFIG.UI.WINDOWS.CHAIN.DEFAULT_POSITION.LEFT
            };

            // Create window
            this.chainWindow = new ChainWindowComponent({
                position: savedPosition,
                onClose: () => this.closeChainWindow(),
                onPositionChange: (top, left) => {
                    StorageUtil.set(CONFIG.STORAGE.WINDOW_TOP, top);
                    StorageUtil.set(CONFIG.STORAGE.WINDOW_LEFT, left);
                }
            });

            // Add to document
            document.body.appendChild(this.chainWindow.render());

            // Set window state
            this.isWindowOpen = true;
            StorageUtil.set(CONFIG.STORAGE.WINDOW_OPEN, 'true');

            // Update menu
            this.settingsMenu.setActive(true);

            // Fetch initial data
            await this.updateChainData();

            // Start refresh timer
            this.chainDataManager.startRefreshTimer();
        }

        /**
         * Close the chain window
         */
        closeChainWindow() {
            // Remove window
            if (this.chainWindow) {
                this.chainWindow.remove();
                this.chainWindow = null;
            }

            // Update state
            this.isWindowOpen = false;
            StorageUtil.set(CONFIG.STORAGE.WINDOW_OPEN, 'false');

            // Update menu
            this.settingsMenu.setActive(false);

            // Stop refresh timer
            this.chainDataManager.stopRefreshTimer();
        }

        /**
         * Show the login window
         */
        showLoginWindow() {
            // Close any open windows first
            this.closeAllWindows();

            // Create new login window
            this.loginWindow = new LoginWindowComponent({
                onValidateKey: async (apiKey) => {
                    const client = new TornAPIClient(apiKey);
                    const result = await client.validateApiKey();

                    if (result.isValid) {
                        // Save API key
                        StorageUtil.set(CONFIG.STORAGE.API_KEY, apiKey);

                        // Close login window
                        this.loginWindow.remove();
                        this.loginWindow = null;

                        // Open chain window
                        await this.openChainWindow(apiKey);
                    }

                    return result;
                },
                onClose: () => {
                    this.loginWindow = null;
                    this.settingsMenu.setActive(false);
                }
            });

            // Add to document
            document.body.appendChild(this.loginWindow.render());

            // Update menu
            this.settingsMenu.setActive(true);
        }

        /**
         * Update chain data
         */
        async updateChainData() {
            if (!this.chainWindow || !this.isWindowOpen) return;

            // Get current chain bar value if available
            const currentBarValue = this.chainBarObserver.getCurrentValue();

            // Update data
            const chainData = await this.chainDataManager.updateData(currentBarValue);

            // Update window display
            if (this.chainWindow) {
                this.chainWindow.updateChainData(chainData);
            }

            return chainData;
        }

        /**
         * Handle chain data update
         * @param {Object} chainData - Updated chain data
         */
        handleDataUpdate(chainData) {
            if (this.chainWindow && this.isWindowOpen) {
                this.chainWindow.updateChainData(chainData);
            }
        }

        /**
         * Handle chain bar change
         * @param {string} newValue - New chain bar value
         */
        handleChainBarChange(newValue) {
            // Force refresh when bar value changes
            if (this.isWindowOpen) {
                this.updateChainData();
            }
        }

        /**
         * Simulate timer for testing
         * @param {number} seconds - Seconds to simulate
         * @returns {string|boolean} Result message or false if failed
         */
        simulateTime(seconds) {
            if (!this.chainWindow || !this.isWindowOpen) {
                return false;
            }

            // Update the display with simulated time
            this.chainWindow.simulateTime(seconds);

            // Update the chain data with simulation
            this.chainDataManager.simulateTime(seconds);

            return `Simulated timer set to ${seconds} seconds`;
        }
    }

    // Add the simulateTime function to the window object for console access
    window.simulateChainTime = (seconds) => {
        if (typeof chainMonitorController !== 'undefined') {
            return chainMonitorController.simulateTime(seconds);
        } else {
            console.log('Chain monitor not initialized');
            return false;
        }
    };

    // Initialize the controller
    const chainMonitorController = new ChainMonitorController();
    chainMonitorController.init();

})();
