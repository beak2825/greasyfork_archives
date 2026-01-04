// ==UserScript==
// @name         WME Relock
// @version      2025.08.23.001
// @description  Fork of the original WME LevelReset script by Broos Gert '2015. The script is for making re-locking segments and POI to their appropriate lock level easy & quick. Supports all road types, venues and custom locking rules for a specific countries and cities.
// @author       madnut, Copilot
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @namespace    https://greasyfork.org/uk/users/160654-waze-ukraine
// @connect      google.com
// @connect      script.googleusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA+VBMVEX///93PgHX19fTgQfFZgLLcwTrxYDDgA3nqBj5+fmwr6+Yl5f8/PzExMTl5eX114vv7+/e3t68vLzOzs6saRKARQSLTgeioqK2tbX72XfU1NT515fxz4b54b3RmySYWAv31aTpwIHgrn9/f3/75qPZsEvuuC/utx3psVP13KizbhXuuVj745bfoEzzwzDxwDXTjknpxqDPfhzWih7PhUaObErowqDJchrmqCfprRjbmUvblCLZjAv71WnhnyTfmA7hrmbjsm7qxpPv06vYljj305776MvLkD3XkjFwcHCMi4v6zk/6z1P2wVDYqzr3y3j2xWnrrl761X3u0VhGAAABv0lEQVQ4jZWTXXuaMBiGY7bZQUhIoBaKsIK0KkVqtd+2tJ2gnVJs9f//mAW78uHYwe6TXE+em/flJAD8D0RVdF3HTKqvGcaMAiAQVYd1vaEASikhhFKA1ZoeA8Iwct2lCAnAxl/zdcAMbeGipbtwMQM62xFEFUJtoWEIsbh0CVTF3QGqqrjax2cq4kkkFQFjTJD2eYeXBoa4uoEoBOU/RhBUWHWHJukUCZ9JQFCnWkVAQJRQniREyvGPANA/YzazRhBKwjSOg+DZmdoRZ+r8XAfxr5eo1AfzuW1HljXfYkX2zJ5b8TQXXtbWzPff38x2hvn27qf+zFrHubC39tppGoabjczZHIZpmra9/jgXTn2vnSTJaxgecsLwNRkmsueflgV5eLZarU4y+Lk6G9YIg8HxB4PBYEfY3woZQ0529rjQ3y+Evid3ez9K9LpmWTjqe2b3Ti5xlwlHhRDYzdvvFW5NOyiEAy48Pu2VeHps2sFBIUwi5/6hWeLh3okmhdCajJyLLxUunNGktS0lgdLW+agz/lZh3Bmdt6ggZS/NUBqX152brxVuOteXDZVRafsUrxq1XGHIBb6CwHoY4Tt+A1eiQ8S/AAv7AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/457554/WME%20Relock.user.js
// @updateURL https://update.greasyfork.org/scripts/457554/WME%20Relock.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
// eslint-disable-next-line no-redeclare
/* global getWmeSdk */
// eslint-disable-next-line no-redeclare
/* global W */

(function () {
    'use strict';

    const ID_KEYS = {
        MSG_HIDE: 'Relock_msgHide',
        ALL_SEGMENTS: 'Relock_allSegments',
        RESPECT_ROUTING: 'Relock_respectRouting',
        INFO_BOX: 'Relock_infoBox',
        ELM_PREFIX: 'Relock_',
        CHECKBOX_SUFFIX: '_checkbox',
        VALUE_SUFFIX: '_value',
        ROAD_TYPE_CONTAINER_SUFFIX: '_roadTypeContainer'
    };

    const SCRIPT_ID = GM_info.script.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const SCRIPT_VERSION = GM_info.script.version;
    const SCRIPT_LOG_PREFIX = 'Relock:';
    const FIX_LIMIT_COUNT = 150;
    const POI_ID = "90000"; // Fake ID for POI to not conflict with real street IDs
    const POI_NAME = "POI";

    let wmeSDK;
    let userLevel; // Cache user level to avoid repeated SDK calls
    const minimumUserLevelForHigherLocks = 4;

    // Global cached elements object for performance optimization
    const cachedElements = {
        relockAllbutton: null,
        lockColorElement: null,
        checkboxElements: {}, // Cache for road type checkboxes
        respectRoutingElement: null, // Cache for respect routing checkbox
        scanCounterElement: null, // Cache for scan counter element
        infoBox: null, // Cache for info box element
        alertContainer: null, // Cache for alert container
        relockContainer: null, // Cache for main relock container
        roadTypeContainers: {}, // Cache for road type value containers
        allSegmentsCheckbox: null, // Cache for all segments checkbox
        toggleAllCheckboxesIcon: null // Cache for toggle all checkboxes icon
    };

    const REQUEST_TIMEOUT = 20000; // in ms
    const RULES_HASH = "AKfycbyBy5e4J1u3RbRK4cNWbUJ-sDL2aLDUIMH1glbf6xOEEMO0Z4wl2wTKIRw0HP5KDbwR6A";

    // Default lock levels
    const DEFAULT_STREET_LOCKS = {
        STREET: 1,
        PRIMARY_STREET: 1,
        MINOR_HIGHWAY: 2,
        MAJOR_HIGHWAY: 3,
        RAMP: 4,
        FREEWAY: 4,
        POI: 1,
        RAILROAD: 1,
        PRIVATE_ROAD: 1,
        PARKING_LOT_ROAD: 1,
        OFF_ROAD: 1,
        ALLEY: 1,
        PEDESTRIAN_BOARDWALK: 1,
        WALKING_TRAIL: 1,
        STAIRWAY: 1,
        WALKWAY: 1,
        FERRY: 1,
        RUNWAY_TAXIWAY: 1
    };

    const ErrorHandler = {
        SEVERITY: {
            CRITICAL: 'critical',    // Fatal errors that prevent script from working
            ERROR: 'error',          // Errors that affect functionality but allow continuation
            WARNING: 'warning',      // Warnings about potential issues
            INFO: 'info'            // Informational messages
        },

        /**
         * Central error logging and handling function
         * @param {Error|string} error - Error object or message
         * @param {string} context - Context where error occurred (function name, operation)
         * @param {string} severity - Error severity level
         * @param {Object} additionalInfo - Additional context information
         */
        handle(error, context = 'Unknown', severity = this.SEVERITY.ERROR, additionalInfo = {}) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            const fullMessage = `${SCRIPT_LOG_PREFIX} [${context}] ${errorMsg}`;

            switch (severity) {
                case this.SEVERITY.CRITICAL:
                    console.error(fullMessage, error instanceof Error ? error.stack : '', additionalInfo);
                    break;
                case this.SEVERITY.ERROR:
                    console.error(fullMessage, error instanceof Error ? error.stack : '', additionalInfo);
                    break;
                case this.SEVERITY.WARNING:
                    console.warn(fullMessage, error instanceof Error ? error.stack : '', additionalInfo);
                    break;
                case this.SEVERITY.INFO:
                    console.log(fullMessage, additionalInfo);
                    break;
                default:
                    console.error(fullMessage, error instanceof Error ? error.stack : '', additionalInfo);
            }


            if (severity === this.SEVERITY.CRITICAL) {
                const userMessage = `${SCRIPT_LOG_PREFIX} Critical Error in ${context}\n${errorMsg}\n\nScript may not function properly.`;
                // eslint-disable-next-line no-alert
                alert(userMessage);
            }


            return false;
        },

        /**
         * Wrap async functions with error handling
         * @param {Function} asyncFn - Async function to wrap
         * @param {string} context - Context for error reporting
         * @param {string} severity - Default severity level
         * @returns {Function} - Wrapped function with error handling
         */
        wrapAsync(asyncFn, context, severity = this.SEVERITY.ERROR) {
            return async (...args) => {
                try {
                    return await asyncFn(...args);
                } catch (error) {
                    this.handle(error, context, severity);
                    return null;
                }
            };
        },

        /**
         * Create a try/catch wrapper for synchronous functions
         * @param {Function} fn - Function to wrap
         * @param {string} context - Context for error reporting
         * @param {string} severity - Default severity level
         * @param {*} defaultReturn - Default return value on error
         * @returns {Function} - Wrapped function with error handling
         */
        wrapSync(fn, context, severity = this.SEVERITY.ERROR, defaultReturn = false) {
            return (...args) => {
                try {
                    return fn(...args);
                } catch (error) {
                    this.handle(error, context, severity);
                    return defaultReturn;
                }
            };
        }
    };

    /**
    * Async delay utility function
    * @param {number} ms - Milliseconds to wait
    * @returns {Promise<void>}
    */
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Animate element visibility with smooth transitions
     * Replaces jQuery's show/hide animations with native CSS transitions
     * @param {HTMLElement|string} element - Element or element ID to animate
     * @param {boolean} show - true to show, false to hide
     * @param {string} speed - 'fast' (150ms), 'slow' (600ms), or 'normal' (300ms)
     * @param {string} displayType - CSS display value when showing ('block', 'inline-block', 'table-row', etc.)
     * @example
     * animateElement('alertBox', true, 'fast');  // Show element quickly
     * animateElement(myElement, false, 'slow');  // Hide element slowly
     * animateElement(row, true, 'normal', 'table-row');  // Show table row
     */
    function animateElement(element, show, speed = 'normal', displayType = 'block') {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (!el) return;
        const durations = {
            'fast': 150,
            'normal': 300,
            'slow': 600
        };
        const duration = durations[speed] || durations.normal;

        el.style.transition = `opacity ${duration}ms ease-in-out`;

        if (show) {
            el.style.display = displayType;
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.opacity = '1';
            }, 10);
        } else {
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.display = 'none';
                el.style.opacity = '1';
            }, duration);
        }
    }

    /**
     * Centralized progress manager for all operations (scanning, relocking)
     * Fully self-contained with complete ownership of progress elements
     * Manages both spinner and progress bar with optimized performance
     */
    const ProgressManager = {
        containerWidth: null,
        spinnerElement: null,
        percentageLoaderElement: null,
        scanCounterElement: null,
        
        /**
         * Internal method to show/hide progress elements
         * Handles both spinner and progress bar with percentage-based width
         * @param {boolean} show - true for spinning icon (in progress), false for completion icon
         * @param {number|null} progressPercent - Width for percentage loader as percentage (0-100)
         */
        _toggleElements(show = false, progressPercent = null) {
            if (this.spinnerElement) {
                this.spinnerElement.style.display = 'inline-block';
                if (show) {
                    // Show spinning icon (operation in progress)
                    this.spinnerElement.className = 'fa fa-spinner fa-spin rl-spinner';
                } else {
                    // Show completion icon (operation complete)
                    this.spinnerElement.className = 'fa fa-check-circle rl-spinner-complete';
                }
            }
            if (this.percentageLoaderElement) {
                if (show) {
                    // Show progress bar only during active operations
                    this.percentageLoaderElement.style.display = 'block';
                    if (progressPercent !== null) {
                        this.percentageLoaderElement.style.width = Math.max(progressPercent, 1) + '%';
                    }
                } else {
                    // Hide progress bar when complete
                    this.percentageLoaderElement.style.display = 'none';
                }
            }
        },
        
        /**
         * Initialize progress manager - fully self-contained initialization
         * Creates and caches all required DOM elements and container width
         * @param {HTMLElement} relockContent - The main content container to append progress elements to
         */
        init(relockContent = null) {
            // Cache container width for performance
            const container = document.getElementById('sidepanel-relockTab') || relockContent;
            this.containerWidth = container ? container.offsetWidth : 300;
            
            // Find the button-progress container for progress bar only
            const buttonProgressContainer = relockContent ? relockContent.querySelector('.rl-button-progress-container') : null;
            
            // Create a wrapper for progress elements (progress bar only)
            let progressWrapper = buttonProgressContainer ? buttonProgressContainer.querySelector('.rl-progress-elements') : null;
            if (!progressWrapper && buttonProgressContainer) {
                progressWrapper = document.createElement('div');
                progressWrapper.className = 'rl-progress-elements';
                buttonProgressContainer.appendChild(progressWrapper);
            }
            
            // Find the scan counter container for spinner placement
            const scanCounterContainer = relockContent ? relockContent.querySelector('.rl-scan-counter-container') : null;
            
            // Create spinner element if not already done - place it in scan counter container
            if (!this.spinnerElement) {
                this.spinnerElement = document.createElement('div');
                this.spinnerElement.className = 'fa fa-check-circle rl-spinner-complete'; // Start with completion icon
                
                // Insert spinner before the scan counter label if container available
                if (scanCounterContainer) {
                    // Insert as first child (before scan counter label)
                    scanCounterContainer.insertBefore(this.spinnerElement, scanCounterContainer.firstChild);
                } else if (relockContent) {
                    relockContent.appendChild(this.spinnerElement);
                }
            }
            
            // Create progress bar element if not already done - place it in progress wrapper
            if (!this.percentageLoaderElement) {
                this.percentageLoaderElement = document.createElement('div');
                this.percentageLoaderElement.className = 'rl-progress-bar';
                
                // Append to progress wrapper if available
                if (progressWrapper) {
                    progressWrapper.appendChild(this.percentageLoaderElement);
                } else if (relockContent) {
                    relockContent.appendChild(this.percentageLoaderElement);
                }
            }
            
            console.debug(`${SCRIPT_LOG_PREFIX} ProgressManager initialized with container width:`, this.containerWidth);
        },
        
        /**
         * Start progress tracking for any operation
         * @param {string} operationType - 'scan' or 'relock' for logging
         */
        start(operationType = 'operation') {
            if (!this.containerWidth || !this.spinnerElement || !this.percentageLoaderElement) {
                this.init();
            }
            this._toggleElements(true, 1); // Show spinning icon with minimal progress width (1%)
            
            // Reset and show scan counter for scanning operations
            if (operationType === 'scan') {
                this.updateScanCounter(0);
            }
            
            console.debug(`${SCRIPT_LOG_PREFIX} Started ${operationType} with progress tracking`);
        },
        
        /**
         * Update progress bar based on current/total items
         * @param {number} current - Current item count
         * @param {number} total - Total item count
         * @param {number} throttle - Update every N items for performance (default: 5)
         */
        update(current, total, throttle = 5) {
            // Throttle updates for performance - only update every N items
            if (current % throttle !== 0 && current !== total) return;
            
            if (total <= 0) return;
            
            const progress = Math.min((current / total) * 100, 100);
            
            // Update scan counter
            this.updateScanCounter(current);
            
            //console.debug(`${SCRIPT_LOG_PREFIX} Progress update: ${current}/${total} (${progress.toFixed(1)}%)`);
            this._toggleElements(true, progress); // Show spinning icon with current progress
        },
        
        /**
         * Update scan counter display
         * @param {number} count - Number of elements scanned
         */
        updateScanCounter(count) {
            if (this.scanCounterElement) {
                this.scanCounterElement.textContent = `Elements scanned: ${count}`;
            }
        },
        
        /**
         * Complete progress tracking and show completion icon
         */
        complete() {
            // Show completion icon (progress bar gets hidden automatically)
            this._toggleElements(false);
        },
        
        /**
         * Reset progress manager state (useful for cleanup)
         */
        reset() {
            this.containerWidth = null;
            this.spinnerElement = null;
            this.percentageLoaderElement = null;
            this.scanCounterElement = null;
        }
    };

    function Relock_bootstrap() {

        const initializeSDK = async () => {
            try {
                wmeSDK = getWmeSdk({
                    scriptId: SCRIPT_ID,
                    scriptName: GM_info.script.name
                });

                const requiredComponents = [
                    'DataModel',
                    'Events',
                    'State',
                    'Map'
                ];

                for (const component of requiredComponents) {
                    if (!wmeSDK[component]) {
                        throw new Error(`Required SDK component ${component} not available`);
                    }
                }

                // Wait for WME to be fully ready
                await wmeSDK.Events.once({ eventName: "wme-ready" });

                if (!wmeSDK.State.isLoggedIn()) {
                    throw new Error('User not logged in');
                }

                // Cache user level for efficient access during scanning
                const userInfo = wmeSDK.State.getUserInfo();
                if (!userInfo) {
                    throw new Error('Unable to get user info');
                }
                userLevel = userInfo.rank + 1;
                console.debug(`${SCRIPT_LOG_PREFIX} Cached user level:`, userLevel);

                await wmeSDK.Events.once({ eventName: "wme-map-data-loaded" });
                await Relock_init();

            } catch (error) {
                ErrorHandler.handle(error, 'SDK Initialization', ErrorHandler.SEVERITY.CRITICAL);
            }
        };

        const waitForSDK = async () => {
            try {
                if (unsafeWindow.SDK_INITIALIZED) {
                    await unsafeWindow.SDK_INITIALIZED;
                    await initializeSDK();
                } else {

                    await delay(500);
                    waitForSDK();
                }
            } catch (err) {
                ErrorHandler.handle(err, 'SDK Promise', ErrorHandler.SEVERITY.CRITICAL);
            }
        };


        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForSDK);
        } else {
            waitForSDK();
        }
    }

    async function Relock_init() {
        try {
            if (!wmeSDK) {
                throw new Error('SDK not initialized');
            }

            const rlStyle = [
                '.tg { border-collapse: collapse; border-spacing: 0; margin: 0px auto; }',
                '.tg td { border-color: black; border-style: solid; border-width: 1px; overflow: hidden; padding: 2px 2px; word-break: normal; }',
                '.tg .tg-value { text-align: center; vertical-align: top }',
                '.tg .tg-header { background-color: #ecf4ff; border-color: #000000; font-weight: bold; text-align: center; vertical-align: top }',
                '.tg .tg-type { text-align: left; vertical-align: top; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
                '.tg-row:hover { background-color: #f5f5f5; }',
                '.tg-row.active { background-color: #e8f0fe; }',
                '.rl-spinner { opacity: 0.8; width: 16px; height: 16px; vertical-align: text-top; display: none; font-size: 14px; }',
                '.rl-spinner-complete { opacity: 0.8; width: 16px; height: 16px; vertical-align: text-top; font-size: 14px; color: green; }',
                '.rl-scan-counter-container { display: flex; align-items: center; color: #666; margin-bottom: 5px; margin-right: 5px; gap: 3px; }',
                '.fa-spin { animation: fa-spin 0.5s infinite linear; }',
                '@keyframes fa-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }',
                '.rl-progress-bar { transition: width 0.3s ease-in-out; width: 1%; height: 10px; background-color: green; margin-top: 0; border: 1px solid #333333; display: none; }',
                '.rl-flex-row { display: flex; align-items: center; margin-bottom: 0; padding: 0; }',
                '.rl-flex-row > div { flex: 1 1 auto; }',
                '.rl-flex-row input[type="checkbox"] { margin-right: 6px; vertical-align: middle; }',
                '.rl-flex-row label { margin-bottom: 0; font-weight: normal; max-width: 230px; text-overflow: ellipsis; white-space: nowrap; display: inline-block; overflow: hidden; vertical-align: middle; }',
                '.rl-flex-row .rl-flex-right { flex: 0 0 auto; display: flex; align-items: center; gap: 4px; }',
                '.rl-flex-row .rl-flex-counter { font-size: 100%; font-weight: bold; }',
                '.rl-label { font-size: 95%; margin-left: 5px; vertical-align: middle; }',
                '.rl-container { margin-right: 5px; margin-bottom: 5px; }',
                '.rl-info-box { font-size: 85%; padding: 15px; border: 1px solid red; border-radius: 5px; position: relative; margin-right: 5px; }',
                '.rl-alert-box { border: 1px solid #EBCCD1; background-color: #F2DEDE; color: #AC4947; font-weight: bold; font-size: 90%; border-radius: 5px; padding: 10px; margin: 5px 5px; display: none; }',
                '.rl-close-btn { cursor: pointer; width: 16px; height: 16px; position: absolute; right: 3px; top: 3px; }',
                '.rl-lock-icon { cursor: pointer; color: red; }',
                '.rl-rules-table { font-size: 12px; }',
                '.rl-lock-status-ok { color: green; }',
                '.rl-lock-status-error { color: red; }',
                '.rl-button-progress-container { display: flex; align-items: center; gap: 10px; margin: 10px 5px 10px 0; }',
                '.rl-progress-elements { display: flex; align-items: center; gap: 5px; flex: 1; }',
                '.rl-scan-counter { color: #666; margin-bottom: 5px; }',
                '.rl-info-paragraph-first { margin-bottom: 10px; }',
                '.rl-info-paragraph-last { margin-bottom: 0; }',
                '.rl-hide-button { cursor: pointer; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px; margin-left: auto; margin-bottom: 8px; }',
                '.rl-hide-button:hover { color: #333; }',
                '.rl-version-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; margin-right: 5px; }',
                '.rl-toggle-all-container { display: flex; align-items: center; margin-bottom: 8px; margin-right: 5px; padding: 5px 0; border-bottom: 1px solid #ddd; gap: 8px; }',
                '.rl-toggle-all-icon { cursor: pointer; font-size: 16px; color: #666; transition: color 0.2s ease; }',
                '.rl-toggle-all-icon:hover { color: #333; }',
                '.rl-toggle-all-icon.all-checked { color: #4CAF50; }',
                '.rl-toggle-all-icon.some-checked { color: #FF9800; }',
                '.rl-section-title { font-size: 85%; font-weight: bold; }',
                '.rl-title-version-container { display: flex; flex-direction: column; margin-bottom: 5px; margin-right: 5px; padding: 8px 12px; border-radius: 6px; position: relative; overflow: hidden; }',
                '.rl-title-version-container::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0, 87, 183, 0.15) 0%, rgba(0, 87, 183, 0.7) 50%, rgba(255, 215, 0, 0.7) 50%, rgba(255, 215, 0, 0.15) 100%); z-index: -1; }',
                '.rl-title-version-container .rl-title-content { display: flex; align-items: center; margin-bottom: 4px; }',
                '.rl-title-version-container .rl-version-content { display: flex; align-items: center; justify-content: space-between; gap: 8px; }',
            ];

            try {
                GM_addStyle(rlStyle.join('\n'));
            } catch (styleError) {
                ErrorHandler.handle(styleError, 'Style Injection', ErrorHandler.SEVERITY.WARNING);

                const style = document.createElement('style');
                style.textContent = rlStyle.join('\n');
                document.head.appendChild(style);
            }
        } catch (error) {
            ErrorHandler.handle(error, 'Main Initialization', ErrorHandler.SEVERITY.CRITICAL);
            return;
        }

        // Get road types dynamically from SDK instead of hardcoded mapping
        let roadTypeConfig = {};
        let rulesDB = {};
        const relockObject = {};

        // Scan throttling variables
        let scanTimeout;
        const SCAN_DEBOUNCE_DELAY = 300; // 300ms delay after map movement stops

        // Current map extent for scan session
        let currentMapExtent = null;

        /**
         * Initialize road types from SDK
         * @returns {Object} Road types object with structure: {id: {typeName, scan, sdkType}}
         */
        function initializeRoadTypes() {
            return ErrorHandler.wrapSync(() => {
                const roadTypes = wmeSDK.DataModel.Segments.getRoadTypes();
                const streetTypesMap = {};

                // Add all road types from SDK
                roadTypes.forEach(roadType => {
                    streetTypesMap[roadType.id] = {
                        typeName: roadType.localizedName,
                        scan: true,
                        sdkType: roadType.name
                    };
                });

                // Add special type for POIs (not in SDK road types)
                streetTypesMap[POI_ID] = {
                    typeName: POI_NAME,
                    scan: true,
                    sdkType: POI_NAME
                };

                console.log(`${SCRIPT_LOG_PREFIX} Initialized`, Object.keys(streetTypesMap).length, 'road types from SDK');
                return streetTypesMap;
            }, 'Road Types Initialization', ErrorHandler.SEVERITY.CRITICAL)(); // Critical error if this fails
        }

        /**
         * Get typeName by sdkType from roadTypeConfig
         * @param {string} sdkType - The SDK type to look up
         * @returns {string} The typeName if found, empty string otherwise
         */
        function getTypeNameBySdkType(sdkType) {
            return ErrorHandler.wrapSync(() => {
                const roadType = Object.values(roadTypeConfig).find(rt => rt.sdkType === sdkType);
                return roadType ? roadType.typeName : "";
            }, 'Type Name Lookup', ErrorHandler.SEVERITY.WARNING)();
        }

        function onScreen(obj) {
            if (!obj || !obj.geometry) return false;

            return ErrorHandler.wrapSync(() => {
                // Use current map extent set at scan start for performance
                if (!currentMapExtent) return false;
                
                const [left, bottom, right, top] = currentMapExtent;
                const geometry = obj.geometry;
                
                if (geometry.type === 'Point') {
                    const [lon, lat] = geometry.coordinates;
                    return lon >= left && lon <= right && lat >= bottom && lat <= top;
                } else if (geometry.type === 'LineString') {
                    return geometry.coordinates.some(([lon, lat]) => 
                        lon >= left && lon <= right && lat >= bottom && lat <= top
                    );
                } else if (geometry.type === 'Polygon') {
                    // Check exterior ring (first array) and interior rings (if any)
                    return geometry.coordinates.some(ring => 
                        ring.some(([lon, lat]) => 
                            lon >= left && lon <= right && lat >= bottom && lat <= top
                        )
                    );
                }
                return true;
            }, 'Viewport Visibility Check', ErrorHandler.SEVERITY.WARNING)();
        }

        function isVenueEditable(venue) {
            if (!venue || !venue.id) return false;

            return ErrorHandler.wrapSync(() => {
                // Check if venue has pending update requests
                if (venue.venueUpdateRequests && venue.venueUpdateRequests.length > 0) {
                    return false;
                }
                
                return !venue.isAdLocked && wmeSDK.DataModel.Venues.hasPermissions({
                    permission: "EDIT_GEOMETRY",
                    venueId: venue.id
                });
            }, 'Venue Editability Check', ErrorHandler.SEVERITY.WARNING)();
        }

        function isSegmentEditable(segment) {
            if (!segment || !segment.id) return false;

            return ErrorHandler.wrapSync(() => {
                return !segment.hasClosures && wmeSDK.DataModel.Segments.hasPermissions({
                    permission: "EDIT_PROPERTIES",
                    segmentId: segment.id
                });
            }, 'Segment Editability Check', ErrorHandler.SEVERITY.WARNING)();
        }

        async function updateSegmentLock(segment, newLockRank) {
            if (!segment || !segment.id) return false;

            try {
                if (!wmeSDK.DataModel.Segments.hasPermissions({
                    permission: "EDIT_PROPERTIES",
                    segmentId: segment.id
                })) {
                    ErrorHandler.handle(`No permission to edit segment: ${segment.id}`, 'Segment Permission Check', ErrorHandler.SEVERITY.WARNING);
                    return false;
                }
                await wmeSDK.DataModel.Segments.updateSegment({
                    segmentId: segment.id,
                    lockRank: newLockRank
                });

                return true;
            } catch (err) {
                ErrorHandler.handle(err, 'Segment Lock Update', ErrorHandler.SEVERITY.ERROR);
                return false;
            }
        }

        async function updateVenueLock(venue, newLockRank) {
            if (!venue || !venue.id) return false;

            try {
                if (!wmeSDK.DataModel.Venues.hasPermissions({
                    permission: "EDIT_GEOMETRY",
                    venueId: venue.id
                })) {
                    ErrorHandler.handle(`No permission to edit venue: ${venue.id}`, 'Venue Permission Check', ErrorHandler.SEVERITY.WARNING);
                    return false;
                }
                await wmeSDK.DataModel.Venues.updateVenue({
                    venueId: venue.id,
                    lockRank: newLockRank
                });

                return true;
            } catch (err) {
                ErrorHandler.handle(err, 'Venue Lock Update', ErrorHandler.SEVERITY.ERROR);
                return false;
            }
        }

        function getRoadType(segment) {
            if (!segment || !segment.roadType) return null;

            return ErrorHandler.wrapSync(() => {
                if (localStorage.getItem(ID_KEYS.RESPECT_ROUTING) === 'true' && segment.routingRoadType) {
                    const routingType = roadTypeConfig[segment.routingRoadType];
                    if (routingType) return routingType.sdkType;
                }
                const roadType = roadTypeConfig[segment.roadType];
                return roadType ? roadType.sdkType : null;
            }, 'Road Type Determination', ErrorHandler.SEVERITY.WARNING)();
        }

        /**
         * Determines if an object (segment or venue) needs lock level adjustment
         * @param {Object} obj - The segment or venue object
         * @param {number} targetLockLevel - The desired lock level
         * @returns {boolean} True if the object needs relocking
         */
        function needsLockAdjustment(obj, targetLockLevel) {
            if (!obj || typeof obj.lockRank !== 'number' || typeof targetLockLevel !== 'number') {
                return false;
            }

            return ErrorHandler.wrapSync(() => {
                // Use cached element instead of repeated getElementById
                if (!cachedElements.allSegmentsCheckbox) {
                    cachedElements.allSegmentsCheckbox = document.getElementById(ID_KEYS.ALL_SEGMENTS);
                }
                const includeAllSegments = cachedElements.allSegmentsCheckbox;
                const allSegmentsInclude = includeAllSegments && includeAllSegments.checked && userLevel > minimumUserLevelForHigherLocks;

                // Check if user has permission to modify this lock level
                if (userLevel <= targetLockLevel) {
                    return false;
                }

                // Object needs adjustment if lock is too low OR (if enabled) too high
                return (obj.lockRank < targetLockLevel) ||
                    (obj.lockRank > targetLockLevel && allSegmentsInclude);
            }, 'Lock Adjustment Check', ErrorHandler.SEVERITY.WARNING)();
        }

        function displayHtmlPage(res) {
            if (res.responseText.match(/Authorization needed/) || res.responseText.match(/ServiceLogin/)) {
                ErrorHandler.handle(
                    "Authorization is required for using this script. This is one time action.\nNow you will be redirected to the authorization page, where you'll need to approve request.\nAfter confirmation, please close the page and reload WME.",
                    'Authorization Required',
                    ErrorHandler.SEVERITY.INFO,
                    true
                );
            }
            const w = window.open();
            w.document.open();
            w.document.write(res.responseText);
            w.document.close();
            w.location = res.finalUrl;
        }

        async function sendHTTPRequest(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    method: 'GET',
                    timeout: REQUEST_TIMEOUT,
                    onload: function (res) {
                        resolve(res);
                    },
                    onreadystatechange: function (_res) {
                    },
                    ontimeout: function (_res) {
                        const error = new Error('Request timeout');
                        ErrorHandler.handle(error, 'HTTP Request', ErrorHandler.SEVERITY.CRITICAL);
                        reject(error);
                    },
                    onerror: function (_res) {
                        const error = new Error('Request error');
                        ErrorHandler.handle(error, 'HTTP Request', ErrorHandler.SEVERITY.CRITICAL);
                        reject(error);
                    }
                });
            });
        }

        function validateHTTPResponse(res) {
            let result = false;
            let displayError = true;
            if (res) {
                switch (res.status) {
                    case 200:
                        displayError = false;
                        if (res.responseHeaders.match(/content-type:\s*application\/json/i)) {
                            result = true;
                        } else if (res.responseHeaders.match(/content-type:\s*text\/html/i)) {
                            displayHtmlPage(res);
                        }
                        break;
                    default:
                        displayError = false;
                        ErrorHandler.handle(`Unsupported status code: ${res.status}`, 'HTTP Response Validation', ErrorHandler.SEVERITY.CRITICAL, {
                            headers: res.responseHeaders,
                            response: res.responseText
                        });
                        break;
                }
            } else {
                displayError = false;
                ErrorHandler.handle('Response is empty', 'HTTP Response Validation', ErrorHandler.SEVERITY.CRITICAL);
            }

            if (displayError) {
                ErrorHandler.handle('Error processing request', 'HTTP Response Validation', ErrorHandler.SEVERITY.CRITICAL, {
                    response: res.responseText
                });
            }
            return result;
        }

        async function getAllLockRules() {
            try {
                const url = `https://script.google.com/macros/s/${RULES_HASH}/exec?func=getAllLockRulesV2`;
                const response = await sendHTTPRequest(url);

                if (!validateHTTPResponse(response)) {
                    throw new Error('Invalid response received');
                }

                const data = JSON.parse(response.responseText);
                if (data.result !== "success") {
                    throw new Error('Failed to get locking rules: ' + (data.error || 'Unknown error'));
                }
                await initUI(data.rules);

            } catch (err) {
                ErrorHandler.handle(err, 'Lock Rules Fetching', ErrorHandler.SEVERITY.CRITICAL);
            }
        }

        const scanArea = ErrorHandler.wrapAsync(async (showLoader = true) => {
            try {
                // Get current map extent once at scan start
                currentMapExtent = wmeSDK.Map.getMapExtent();
                
                let topCountry = wmeSDK.DataModel.Countries.getTopCountry();
                if (!topCountry || !topCountry.abbr) {
                    // FIXME: there is a strange behavior (bug?) when retrieving the top country -
                    // sometimes DataModel.Countries returns an empty object and so getTopCountry() returns null
                    // as a temporary workaround, we will go old way and use global W object to get the countries.
                    const countries = W?.model?.countries?.getObjectArray();
                    if (countries?.[0]?.attributes) {
                        topCountry = countries[0].attributes;
                    } else {
                        ErrorHandler.handle('Top country not found or invalid', 'Country Retrieval', ErrorHandler.SEVERITY.ERROR);
                        return;
                    }
                }

                // Start progress tracking for scanning
                if (showLoader) {
                    ProgressManager.start('scan');
                }

                hideInactiveCities();
                // Clear all relock arrays for fresh scan
                Object.keys(relockObject).forEach(key => {
                    relockObject[key].length = 0;
                });

                let foundBadlocks = false;
                const respectRoutingRoadType = cachedElements.respectRoutingElement && cachedElements.respectRoutingElement.checked;
                let count = 0;
                const ABBR = rulesDB[topCountry.abbr] ? rulesDB[topCountry.abbr][0].Locks : DEFAULT_STREET_LOCKS;
                console.debug(`${SCRIPT_LOG_PREFIX} Rules to be used`, ABBR);

                const segments = wmeSDK.DataModel.Segments.getAll();
                const venues = wmeSDK.DataModel.Venues.getAll();
                
                // Pre-filter on-screen segments and venues for accurate progress tracking
                const onScreenSegments = segments.filter(segment => onScreen(segment));
                const onScreenVenues = venues.filter(venue => onScreen(venue));
                
                // Calculate total items for progress tracking (limited by scan limit)
                const totalOnScreenItems = onScreenSegments.length + onScreenVenues.length;
                let processedItems = 0;
                
                for (const segment of onScreenSegments) {
                    try {
                        if (count >= FIX_LIMIT_COUNT) break;

                        processedItems++;
                        if (showLoader) {
                            ProgressManager.update(processedItems, totalOnScreenItems, 10); // Update every 10 items
                        }

                        const roadType = getRoadType(segment);
                        if (!roadType) continue;

                        if (!isSegmentEditable(segment)) continue;

                        const effectiveRoadType = respectRoutingRoadType && segment.routingRoadType
                            ? segment.routingRoadType
                            : segment.roadType;

                        const curStreet = roadTypeConfig[effectiveRoadType];
                        if (!curStreet || !curStreet.scan) continue;

                        let cityID = null;
                        try {
                            if (segment.primaryStreetId) {
                                const street = wmeSDK.DataModel.Streets.getById({ streetId: segment.primaryStreetId });
                                cityID = street ? street.cityId : null;
                            }
                        } catch {
                            console.warn(`${SCRIPT_LOG_PREFIX} Could not get street info for segment:`, segment.id);
                        }

                        const cityRules = cityID && rulesDB[topCountry.abbr] && rulesDB[topCountry.abbr][cityID];
                        const stLocks = cityRules ? cityRules.Locks : ABBR;
                        const desiredLockLevel = stLocks[curStreet.sdkType] - 1;

                        // Check if segment needs lock adjustment using centralized logic
                        if (needsLockAdjustment(segment, desiredLockLevel)) {
                            if (!relockObject[curStreet.sdkType]) {
                                relockObject[curStreet.sdkType] = [];
                            }
                            relockObject[curStreet.sdkType].push({
                                object: segment,
                                lockRank: desiredLockLevel
                            });
                            foundBadlocks = true;
                            count++; // increment only if a bad lock is found
                        }
                    } catch (segmentError) {
                        console.error(`${SCRIPT_LOG_PREFIX} Error processing segment:`, segmentError);
                        continue;
                    }
                }

                if (roadTypeConfig[POI_ID] && roadTypeConfig[POI_ID].scan) {
                    onScreenVenues.forEach(venue => {
                        if (!isVenueEditable(venue)) return;
                        if (count >= FIX_LIMIT_COUNT) return;

                        processedItems++;
                        if (showLoader) {
                            ProgressManager.update(processedItems, totalOnScreenItems, 10); // Update every 10 items
                        }

                        const address = wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id });
                        const cityID = address && address.street ? address.street.cityId : null;

                        let desiredLockLevel = (cityID && rulesDB[topCountry.abbr] && rulesDB[topCountry.abbr][cityID])
                            ? rulesDB[topCountry.abbr][cityID].Locks[POI_NAME]
                            : ABBR[POI_NAME];
                        desiredLockLevel--;

                        // Check if venue needs lock adjustment using centralized logic
                        if (needsLockAdjustment(venue, desiredLockLevel)) {
                            if (!relockObject[POI_NAME]) {
                                relockObject[POI_NAME] = [];
                            }
                            relockObject[POI_NAME].push({
                                object: venue,
                                lockRank: desiredLockLevel
                            });
                            foundBadlocks = true;
                            count++; // increment only if a bad lock is found
                        }
                    });
                }

                Object.entries(relockObject).forEach(([key, value]) => {
                    const idPrefix = ID_KEYS.ELM_PREFIX + key + ID_KEYS.ROAD_TYPE_CONTAINER_SUFFIX;
                    
                    // Use cached container instead of repeated getElementById
                    if (!cachedElements.roadTypeContainers[key]) {
                        cachedElements.roadTypeContainers[key] = document.getElementById(idPrefix);
                    }
                    const rightParentElement = cachedElements.roadTypeContainers[key];
                    if (!rightParentElement) return;

                    // Find existing elements or create them if they don't exist
                    let lockIconElement = rightParentElement.querySelector('.fa.fa-lock');
                    let counterElement = rightParentElement.querySelector('.rl-flex-counter');

                    if (!counterElement) {
                        counterElement = document.createElement('div');
                        counterElement.className = 'rl-flex-counter';
                        rightParentElement.appendChild(counterElement);
                    }

                    if (value.length !== 0) {
                        counterElement.textContent = value.length;

                        if (!lockIconElement) {
                            lockIconElement = document.createElement('div');
                            lockIconElement.className = 'fa fa-lock rl-lock-icon';
                            lockIconElement.onclick = (function(roadTypeKey) {
                                return function() {
                                    relock(relockObject, roadTypeKey);
                                };
                            })(key);
                            rightParentElement.insertBefore(lockIconElement, counterElement);
                        }
                    } else {
                        counterElement.textContent = '-';
                        if (lockIconElement) {
                            lockIconElement.remove();
                        }
                    }
                });

                // Update relock button state
                if (foundBadlocks) {
                    cachedElements.relockAllbutton.removeAttribute('disabled');
                    updateLockStatusIcon(true);
                } else {
                    cachedElements.relockAllbutton.setAttribute('disabled', true);
                    updateLockStatusIcon(false);
                }

                // Complete progress tracking for scanning
                if (showLoader) {
                    ProgressManager.complete();
                }
            } catch (error) {
                ErrorHandler.handle(error, 'Area Scanning', ErrorHandler.SEVERITY.WARNING);
                // Complete progress tracking if an error occurs during scanning
                if (showLoader) {
                    ProgressManager.complete();
                }
            }
        }, 'Area Scanning', ErrorHandler.SEVERITY.WARNING);

        /**
         * Debounced scan function - only scans after map movement has settled
         * Prevents excessive scanning during rapid map movements by waiting for
         * a pause in map events before executing the scan.
         * @returns {void}
         */
        const debouncedScan = () => {
            clearTimeout(scanTimeout);
            scanTimeout = setTimeout(() => {
                scanArea();
            }, SCAN_DEBOUNCE_DELAY);
        };

        /**
         * Update lock status icon with appropriate CSS class
         * Uses cached DOM element for better performance
         * @param {boolean} hasErrors - Whether there are lock errors
         */
        function updateLockStatusIcon(hasErrors) {
            if (!cachedElements.lockColorElement) return;

            cachedElements.lockColorElement.className = hasErrors
                ? 'fa fa-lock rl-lock-status-error'
                : 'fa fa-lock rl-lock-status-ok';
        }

        async function initUI(rules) {
            rulesDB = rules;

            roadTypeConfig = initializeRoadTypes();
            const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();
            const relockContent = document.createElement('div');
            const relockTitle = document.createElement('wz-overline');
            const rulesSubTitle = document.createElement('wz-h7');
            const relockAllbutton = document.createElement('wz-button');
            const infoBox = document.createElement('p');
            const versionTitle = document.createElement('wz-label');
            const resultsCntr = document.createElement('div');
            const rulesCntr = document.createElement('div');
            const alertCntr = document.createElement('div');
            const infoToggleButton = document.createElement('div');
            const inputDiv1 = document.createElement('div');
            const inputDiv2 = document.createElement('div');
            const includeAllSegments = document.createElement('input');
            const includeAllSegmentsLabel = document.createElement('label');
            const respectRouting = document.createElement('input');
            const respectRoutingLabel = document.createElement('label');
            const relockTabLabel = document.createTextNode('Re-lock Segments & POI');
            const lockStatusIcon = document.createElement('span');
            const scanCounterLabel = document.createElement('div');
            // Removed unnecessary IDs - these elements are referenced directly
            lockStatusIcon.className = 'fa fa-lock rl-lock-status-ok';

            tabLabel.textContent = "Re-";
            tabLabel.appendChild(lockStatusIcon);
            relockTitle.appendChild(relockTabLabel);
            
            // Create description content using proper paragraph elements
            const paragraph1 = document.createElement('p');
            paragraph1.textContent = 'Your on-screen area is automatically scanned when you load or pan around. Pressing the lock behind each type will relock only those results, or you can choose to relock all.';
            paragraph1.className = 'rl-info-paragraph-first';
            
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = 'You can only relock segments lower or equal to your current editor level. Segments locked higher than normal are left alone.';
            paragraph2.className = 'rl-info-paragraph-last';
            
            infoBox.appendChild(paragraph1);
            infoBox.appendChild(paragraph2);
            
            infoBox.className = 'rl-info-box';
            // Use consistent ID naming pattern from ID_KEYS
            infoBox.id = ID_KEYS.INFO_BOX;
            infoToggleButton.className = 'fa fa-question-circle rl-hide-button';
            infoToggleButton.title = 'How it works?';
            infoToggleButton.onclick = () => {
                // Use cached element instead of repeated getElementById
                if (!cachedElements.infoBox) {
                    cachedElements.infoBox = document.getElementById(ID_KEYS.INFO_BOX);
                }
                const infoBoxElement = cachedElements.infoBox;
                const isHidden = infoBoxElement.style.display === 'none';
                
                if (isHidden) {
                    animateElement(infoBoxElement, true, 'fast');
                    localStorage.setItem(ID_KEYS.MSG_HIDE, '0');
                } else {
                    animateElement(infoBoxElement, false, 'fast');
                    localStorage.setItem(ID_KEYS.MSG_HIDE, '1');
                }
            };

            rulesSubTitle.textContent = 'Active rules';
            versionTitle.textContent = 'Version ' + SCRIPT_VERSION;
            
            // Configure scan counter - removed unnecessary ID since element is referenced directly
            scanCounterLabel.textContent = 'Elements scanned: 0';
            scanCounterLabel.className = 'message';
            
            // Create container for scan counter with spinner
            const scanCounterContainer = document.createElement('div');
            scanCounterContainer.className = 'rl-scan-counter-container';
            scanCounterContainer.appendChild(scanCounterLabel);
            
            // Cache the scan counter element for ProgressManager
            cachedElements.scanCounterElement = scanCounterLabel;
            ProgressManager.scanCounterElement = scanCounterLabel;

            relockAllbutton.color = 'primary';
            relockAllbutton.textContent = 'Relock All';
            relockAllbutton.size = 'md';
            // Removed unnecessary ID - button is referenced directly through cached variable
            relockAllbutton.onclick = () => {
                relockAll();
            };
            cachedElements.relockAllbutton = relockAllbutton;
            cachedElements.lockColorElement = lockStatusIcon;

            includeAllSegments.type = 'checkbox';
            includeAllSegments.name = "name";
            includeAllSegments.value = "value";
            includeAllSegments.checked = (localStorage.getItem(ID_KEYS.ALL_SEGMENTS) == 'true');
            includeAllSegments.id = ID_KEYS.ALL_SEGMENTS;
            includeAllSegments.onclick = () => {
                localStorage.setItem(ID_KEYS.ALL_SEGMENTS, includeAllSegments.checked.toString());
                scanArea(); // No parameters needed
                relockShowAlert();
            };
            includeAllSegmentsLabel.htmlFor = ID_KEYS.ALL_SEGMENTS;
            includeAllSegmentsLabel.textContent = 'Also relock higher locked objects';
            includeAllSegmentsLabel.className = 'rl-label';

            // Respect routing road type
            respectRouting.type = 'checkbox';
            respectRouting.name = "name";
            respectRouting.value = "value";
            respectRouting.checked = (localStorage.getItem(ID_KEYS.RESPECT_ROUTING) == 'true');
            respectRouting.id = ID_KEYS.RESPECT_ROUTING;
            // Cache the element for performance optimization
            cachedElements.respectRoutingElement = respectRouting;
            respectRouting.onclick = () => {
                localStorage.setItem(ID_KEYS.RESPECT_ROUTING, respectRouting.checked.toString());
                scanArea(); // No parameters needed
            };
            respectRoutingLabel.htmlFor = ID_KEYS.RESPECT_ROUTING;
            respectRoutingLabel.textContent = 'Respect routing road type';
            respectRoutingLabel.className = 'rl-label';

            resultsCntr.className = 'rl-container';
            
            // Create toggle all checkboxes container and icon
            const toggleAllContainer = document.createElement('div');
            toggleAllContainer.className = 'rl-toggle-all-container';
            
            const toggleAllIcon = document.createElement('i');
            toggleAllIcon.className = 'fa fa-check-square rl-toggle-all-icon';
            toggleAllIcon.title = 'Toggle all road type checkboxes';
            
            const sectionTitle = document.createElement('span');
            sectionTitle.textContent = 'Bad locks found (limited to ' + FIX_LIMIT_COUNT + ' per pass):';
            sectionTitle.className = 'rl-section-title';

            // Cache the toggle icon for performance
            cachedElements.toggleAllCheckboxesIcon = toggleAllIcon;
            
            /**
             * Updates the toggle icon appearance based on checkbox states
             */
            function updateToggleIconState() {
                const checkboxes = Object.values(cachedElements.checkboxElements);
                const checkedCount = checkboxes.filter(cb => cb && cb.checked).length;
                const totalCount = checkboxes.length;
                
                if (checkedCount === 0) {
                    toggleAllIcon.className = 'fa fa-square-o rl-toggle-all-icon';
                    toggleAllIcon.title = 'Select all road types';
                } else if (checkedCount === totalCount) {
                    toggleAllIcon.className = 'fa fa-check-square rl-toggle-all-icon all-checked';
                    toggleAllIcon.title = 'Unselect all road types';
                } else {
                    toggleAllIcon.className = 'fa fa-minus-square rl-toggle-all-icon some-checked';
                    toggleAllIcon.title = 'Select all road types';
                }
            }
            
            /**
             * Toggles all road type checkboxes
             */
            function toggleAllCheckboxes() {
                return ErrorHandler.wrapSync(() => {
                    const checkboxes = Object.values(cachedElements.checkboxElements);
                    const checkedCount = checkboxes.filter(cb => cb && cb.checked).length;
                    const shouldCheck = checkedCount === 0;
                    
                    // Toggle all checkboxes
                    Object.entries(cachedElements.checkboxElements).forEach(([sdkType, checkbox]) => {
                        if (checkbox) {
                            checkbox.checked = shouldCheck;
                            
                            // Update localStorage and roadTypeConfig
                            const idPrefix = ID_KEYS.ELM_PREFIX + sdkType;
                            const storageKey = idPrefix + ID_KEYS.CHECKBOX_SUFFIX;
                            localStorage.setItem(storageKey, shouldCheck.toString());
                            
                            // Update scan property in roadTypeConfig
                            const roadTypeEntry = Object.values(roadTypeConfig).find(rt => rt.sdkType === sdkType);
                            if (roadTypeEntry) {
                                roadTypeEntry.scan = shouldCheck;
                            }
                        }
                    });
                    
                    // Update toggle icon state
                    updateToggleIconState();
                    
                    // Trigger rescan
                    scanArea();
                }, 'Toggle All Checkboxes', ErrorHandler.SEVERITY.WARNING)();
            }
            
            toggleAllIcon.onclick = toggleAllCheckboxes;
            toggleAllContainer.appendChild(toggleAllIcon);
            toggleAllContainer.appendChild(sectionTitle);
            resultsCntr.appendChild(toggleAllContainer);
            
            Object.entries(roadTypeConfig).forEach(([key, value]) => {
                const rowContainer = document.createElement('div');
                rowContainer.className = 'rl-flex-row';

                const leftKeyContainer = document.createElement('div');
                const checkboxElement = document.createElement('input');
                const labelElement = document.createElement('label');
                const idPrefix = ID_KEYS.ELM_PREFIX + value.sdkType;

                checkboxElement.type = 'checkbox';
                checkboxElement.checked = (localStorage.getItem(idPrefix + ID_KEYS.CHECKBOX_SUFFIX) == 'true');
                checkboxElement.id = idPrefix + ID_KEYS.CHECKBOX_SUFFIX;
                
                // Initialize scan property from checkbox state
                value.scan = checkboxElement.checked;
                checkboxElement.onclick = (function(roadTypeKey, storageKey) {
                    return function() {
                        localStorage.setItem(storageKey, checkboxElement.checked.toString());
                        // Update scan property directly for immediate use
                        roadTypeConfig[roadTypeKey].scan = checkboxElement.checked;
                        
                        // Update toggle icon state when individual checkbox changes
                        updateToggleIconState();
                        
                        scanArea();
                    };
                })(key, idPrefix + ID_KEYS.CHECKBOX_SUFFIX);
                labelElement.htmlFor = idPrefix + ID_KEYS.CHECKBOX_SUFFIX;
                
                // Cache checkbox element for performance
                cachedElements.checkboxElements[value.sdkType] = checkboxElement;
                labelElement.textContent = value.typeName;
                labelElement.title = value.typeName;

                leftKeyContainer.appendChild(checkboxElement);
                leftKeyContainer.appendChild(labelElement);

                const rightParentElement = document.createElement('div');
                rightParentElement.className = 'rl-flex-right';
                const counterElement = document.createElement('div');
                counterElement.className = 'rl-flex-counter';
                counterElement.textContent = '-';
                rightParentElement.id = idPrefix + ID_KEYS.ROAD_TYPE_CONTAINER_SUFFIX;
                rightParentElement.appendChild(counterElement);
                rowContainer.appendChild(leftKeyContainer);
                rowContainer.appendChild(rightParentElement);
                resultsCntr.appendChild(rowContainer);
            });
            alertCntr.className = 'rl-alert-box';
            alertCntr.textContent = 'Watch out for map exceptions, some higher locks are there for a reason!';
            // Cache alert container for performance
            cachedElements.alertContainer = alertCntr;
            let rowElm;
            let colElm;

            const tableElm = document.createElement('table');
            tableElm.className = 'tg';

            const bodyElm = document.createElement('tbody');

            let countryRules = null;
            const topCountry = wmeSDK.DataModel.Countries.getTopCountry();
            if (topCountry && topCountry.abbr) {
                countryRules = rulesDB[topCountry.abbr];
            } else {
                ErrorHandler.handle('Top country not found or invalid', 'Country Retrieval in initUI', ErrorHandler.SEVERITY.ERROR);
            }

            if (countryRules) {
                Object.entries(countryRules).forEach(([key, value]) => {
                    if (key == "CountryName") return;

                    rowElm = document.createElement('tr');
                    rowElm.className = "tg-row";
                    rowElm.dataset.name = parseInt(key) === 0 ? 'country' : value.CityName;

                    colElm = document.createElement('td');
                    colElm.className = "tg-header";
                    const cityName = parseInt(key) === 0 ? countryRules.CountryName : value.CityName;
                    colElm.textContent = cityName;
                    colElm.colSpan = 6;
                    rowElm.appendChild(colElm);
                    tableElm.appendChild(rowElm);

                    const maxCol = 2;
                    let colIndex = 0;
                    rowElm = document.createElement('tr');
                    Object.entries(value.Locks).forEach(([k, v]) => {
                        if (v) {
                            rowElm.className = "tg-row";
                            rowElm.dataset.name = parseInt(key) === 0 ? 'country' : value.CityName; // need to hard code 'country' to identify later
                            if (colIndex < maxCol) {
                                colElm = document.createElement('td');
                                colElm.className = "tg-type";

                                const streetType = getTypeNameBySdkType(k) || k;
                                colElm.textContent = streetType;
                                colElm.title = streetType;
                                rowElm.appendChild(colElm);

                                colElm = document.createElement('td');
                                colElm.className = "tg-value";
                                colElm.textContent = v;
                                rowElm.appendChild(colElm);

                                colIndex++;
                                if (colIndex == maxCol) {
                                    colIndex = 0;
                                    tableElm.appendChild(rowElm);
                                    rowElm = document.createElement('tr');
                                }
                            }
                        }
                    });
                    tableElm.appendChild(rowElm);
                });
            }

            tableElm.appendChild(bodyElm);
            rulesCntr.className = 'rl-rules-table';
            rulesCntr.appendChild(tableElm);

            // add to stage
            // Create title and version container
            const titleVersionContainer = document.createElement('div');
            titleVersionContainer.className = 'rl-title-version-container';
            
            // Create content wrapper for title
            const titleContent = document.createElement('div');
            titleContent.className = 'rl-title-content';
            titleContent.appendChild(relockTitle);
            
            // Create content wrapper for version and hide button
            const versionContent = document.createElement('div');
            versionContent.className = 'rl-version-content';
            versionContent.appendChild(versionTitle);
            versionContent.appendChild(infoToggleButton);
            
            titleVersionContainer.appendChild(titleContent);
            titleVersionContainer.appendChild(versionContent);
            relockContent.appendChild(titleVersionContainer);
            
            // Always append the info box
            relockContent.appendChild(infoBox);
            
            // Set initial visibility based on localStorage
            if (localStorage.getItem(ID_KEYS.MSG_HIDE) === '1') {
                infoBox.style.display = 'none';
            }

            inputDiv1.appendChild(respectRouting);
            inputDiv1.appendChild(respectRoutingLabel);
            inputDiv2.appendChild(includeAllSegments);
            inputDiv2.appendChild(includeAllSegmentsLabel);
            
            // Hide the "Also relock higher locked objects" option if user level is too low
            if (userLevel < minimumUserLevelForHigherLocks) {
                inputDiv2.style.display = 'none';
            }
            
            relockContent.appendChild(inputDiv1);
            relockContent.appendChild(inputDiv2);

            relockContent.appendChild(alertCntr);
            
            // Create a flex container for the relock button and progress elements
            const buttonProgressContainer = document.createElement('div');
            buttonProgressContainer.className = 'rl-button-progress-container';
            buttonProgressContainer.appendChild(relockAllbutton);
            relockContent.appendChild(buttonProgressContainer);
            
            // Append scan counter container (created earlier)
            relockContent.appendChild(scanCounterContainer);
            relockContent.appendChild(resultsCntr);
            relockContent.appendChild(rulesSubTitle);
            relockContent.appendChild(rulesCntr);

            tabPane.appendChild(relockContent);

            // Initialize ProgressManager after UI elements are in the DOM
            ProgressManager.init(relockContent);
            
            // Set initial toggle icon state after all checkboxes are cached
            updateToggleIconState();

            const eventHandlers = [];

            function registerEventHandler(eventName, handler) {
                return ErrorHandler.wrapSync(() => {
                    const subscription = wmeSDK.Events.on({
                        eventName: eventName,
                        eventHandler: handler
                    });
                    eventHandlers.push(subscription);
                    return subscription;
                }, `Event Handler Registration (${eventName})`, ErrorHandler.SEVERITY.ERROR)();
            }

            const scanHandler = () => debouncedScan();
            registerEventHandler("wme-map-move-end", scanHandler);
            registerEventHandler("wme-after-edit", scanHandler);
            registerEventHandler("wme-after-undo", scanHandler);
            //registerEventHandler("wme-no-edits", scanHandler);
            registerEventHandler("wme-map-zoom-changed", scanHandler);

            function cleanup() {
                eventHandlers.forEach(handler => {
                    try {
                        handler.remove();
                    } catch (err) {
                        console.error(`${SCRIPT_LOG_PREFIX} Error removing event handler:`, err);
                    }
                });
                eventHandlers.length = 0;
            }


            const cleanupScript = () => {
                try {
                    cleanup();
                    const tabElement = document.getElementById('sidepanel-relockTab');
                    if (tabElement) {
                        tabElement.remove();
                    }
                    if (window.relockTimer) {
                        clearTimeout(window.relockTimer);
                    }
                    ProgressManager.complete();

                    console.log(`${SCRIPT_LOG_PREFIX} Cleanup completed successfully`);
                } catch (error) {
                    console.error(`${SCRIPT_LOG_PREFIX} Error during cleanup:`, error);
                }
            };


            if (typeof window.addEventListener === 'function') {
                window.addEventListener('beforeunload', cleanupScript);
            }
            relockShowAlert();
            scanHandler();
        }

        async function relock(obj, key) {
            try {
                const objects = obj[key];
                const total = objects.length;

                // Start progress tracking for individual relock operation
                ProgressManager.start('relock');

                // Process objects individually since SDK doesn't support batch actions
                for (let i = 0; i < total; i++) {
                    const feature = objects[i];
                    try {
                        if (key === POI_NAME) {
                            await updateVenueLock(feature.object, feature.lockRank);
                        } else {
                            await updateSegmentLock(feature.object, feature.lockRank);
                        }

                        // Update progress
                        ProgressManager.update(i + 1, total, 1); // Update every item for individual operations

                        // Small delay to prevent overwhelming the system
                        if ((i + 1) % 10 === 0) {
                            await delay(100);
                        }
                    } catch (err) {
                        console.error(`${SCRIPT_LOG_PREFIX} Error updating feature:`, err);
                        continue;
                    }
                }

                ProgressManager.complete();
            } catch (error) {
                console.error(`${SCRIPT_LOG_PREFIX} Error in relock operation:`, error);
                ProgressManager.complete();
            }
        }

        async function relockAll() {
            try {
                // Calculate total items across all types
                const totalItems = Object.values(relockObject).reduce((sum, objects) => sum + objects.length, 0);
                
                // Start progress tracking for bulk relock operation
                ProgressManager.start('relock-all');
                
                let processedItems = 0;

                // Process each type of feature (segments, POIs, etc.)
                for (const [key, objects] of Object.entries(relockObject)) {
                    if (objects.length === 0) continue;

                    // Process objects individually
                    for (const feature of objects) {
                        try {
                            if (key === POI_NAME) {
                                await updateVenueLock(feature.object, feature.lockRank);
                            } else {
                                await updateSegmentLock(feature.object, feature.lockRank);
                            }

                            processedItems++;
                            ProgressManager.update(processedItems, totalItems, 5); // Update every 5 items

                            // Small delay every 10 updates to prevent overwhelming the system
                            if (processedItems % 10 === 0) {
                                await delay(100);
                            }
                        } catch (err) {
                            console.error(`${SCRIPT_LOG_PREFIX} Error updating feature:`, err);
                            continue;
                        }
                    }
                }

                await scanArea(false); // Don't show loader during relock operation

                ProgressManager.complete();
            } catch (error) {
                console.error(`${SCRIPT_LOG_PREFIX} Error in relockAll operation:`, error);
                ProgressManager.complete();
            }
        }

        function relockShowAlert() {
            // Use cached element instead of getElementById
            if (!cachedElements.allSegmentsCheckbox) {
                cachedElements.allSegmentsCheckbox = document.getElementById(ID_KEYS.ALL_SEGMENTS);
            }
            const includeAllSegments = cachedElements.allSegmentsCheckbox;

            if (includeAllSegments && includeAllSegments.checked) {
                animateElement(cachedElements.alertContainer, true, 'fast');
            } else {
                animateElement(cachedElements.alertContainer, false, 'fast');
            }
        }

        function hideInactiveCities() {
            const allRows = document.querySelectorAll('tr.tg-row');
            allRows.forEach((row) => {
                let isActive = false;
                const cities = wmeSDK.DataModel.Cities.getAll();
                for (const city of cities) {
                    if (city.name === row.dataset.name) {
                        isActive = true;
                        break;
                    }
                }

                if (isActive || row.dataset.name == 'country') {
                    animateElement(row, true, 'fast', 'table-row');
                } else {
                    animateElement(row, false, 'fast');
                }
            });
        }

        await getAllLockRules();
    }

    Relock_bootstrap();
})();
