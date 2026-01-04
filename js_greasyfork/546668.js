// ==UserScript==
// @name         YouTube-UI-Customizer
// @namespace    https://github.com/p65536
// @version      1.3.0
// @license      MIT
// @description  Enhances your YouTube experience. Customize the video grid layout by adjusting thumbnails per row, hide Shorts content, and automatically redirect the Shorts player to the standard video player.
// @icon         https://www.youtube.com/favicon.ico
// @author       p65536
// @match        https://www.youtube.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.addValueChangeListener
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546668/YouTube-UI-Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/546668/YouTube-UI-Customizer.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /**
     * Extracts the Video ID from a Shorts URL path.
     * @param {string} path
     * @returns {string|null} The video ID or null if not found.
     */
    const getShortsVideoId = (path) => {
        const match = path.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    // --- Fast Redirect for Shorts (Full Page Load) ---
    // This runs at @run-at document-start, *before* the DOM is ready.
    // It intercepts full page loads (e.g., new tab, ctrl+click) of /shorts/ URLs
    // and immediately replaces them with the standard /watch?v= player.
    // This prevents the Shorts player UI from ever loading or "flashing".
    const initialVideoId = getShortsVideoId(location.pathname);
    if (initialVideoId) {
        const params = new URLSearchParams(location.search);
        params.set('v', initialVideoId);
        location.replace(`/watch?${params.toString()}`);
        return; // Stop the rest of the script from executing, as we are navigating away.
    }

    // =================================================================================
    // SECTION: Script-Specific Definitions
    // =================================================================================

    const OWNERID = 'p65536';
    const APPID = 'ytuic';
    const APPNAME = 'YouTube UI Customizer';
    const LOG_PREFIX = `[${APPID.toUpperCase()}]`;

    // =================================================================================
    // SECTION: Logging Utility
    // Description: Centralized logging interface for consistent log output across modules.
    //              Handles log level control, message formatting, and console API wrapping.
    // =================================================================================

    // Style definitions for styled Logger.badge()
    const LOG_STYLES = {
        BASE: 'color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        BLUE: 'background: #007bff;',
        GREEN: 'background: #28a745;',
        YELLOW: 'background: #ffc107; color: black;',
        RED: 'background: #dc3545;',
    };

    class Logger {
        /** @property {object} levels - Defines the numerical hierarchy of log levels. */
        static levels = {
            error: 0,
            warn: 1,
            info: 2,
            log: 3,
            debug: 4,
        };
        /** @property {string} level - The current active log level. */
        static level = 'log'; // Default level

        /**
         * Sets the current log level.
         * @param {string} level The new log level. Must be one of 'error', 'warn', 'info', 'log', 'debug'.
         */
        static setLevel(level) {
            if (Object.prototype.hasOwnProperty.call(this.levels, level)) {
                this.level = level;
                Logger.badge('LOG LEVEL', LOG_STYLES.BLUE, 'log', `Logger level is set to '${this.level}'.`);
            } else {
                Logger.badge('INVALID LEVEL', LOG_STYLES.YELLOW, 'warn', `Invalid log level "${level}". Valid levels are: ${Object.keys(this.levels).join(', ')}. Level not changed.`);
            }
        }

        /** @param {...any} args The messages or objects to log. */
        static error(...args) {
            if (this.levels[this.level] >= this.levels.error) {
                console.error(LOG_PREFIX, ...args);
            }
        }

        /** @param {...any} args The messages or objects to log. */
        static warn(...args) {
            if (this.levels[this.level] >= this.levels.warn) {
                console.warn(LOG_PREFIX, ...args);
            }
        }

        /** @param {...any} args The messages or objects to log. */
        static info(...args) {
            if (this.levels[this.level] >= this.levels.info) {
                console.info(LOG_PREFIX, ...args);
            }
        }

        /** @param {...any} args The messages or objects to log. */
        static log(...args) {
            if (this.levels[this.level] >= this.levels.log) {
                console.log(LOG_PREFIX, ...args);
            }
        }

        /**
         * Logs messages for debugging. Only active in 'debug' level.
         * @param {...any} args The messages or objects to log.
         */
        static debug(...args) {
            if (this.levels[this.level] >= this.levels.debug) {
                // Use console.debug for better filtering in browser dev tools.
                console.debug(LOG_PREFIX, ...args);
            }
        }

        /**
         * Starts a timer for performance measurement. Only active in 'debug' level.
         * @param {string} label The label for the timer.
         */
        static time(label) {
            if (this.levels[this.level] >= this.levels.debug) {
                console.time(`${LOG_PREFIX} ${label}`);
            }
        }

        /**
         * Ends a timer and logs the elapsed time. Only active in 'debug' level.
         * @param {string} label The label for the timer, must match the one used in time().
         */
        static timeEnd(label) {
            if (this.levels[this.level] >= this.levels.debug) {
                console.timeEnd(`${LOG_PREFIX} ${label}`);
            }
        }

        /**
         * @param {...any} args The title for the log group.
         * @returns {void}
         */
        static group = (...args) => console.group(LOG_PREFIX, ...args);
        /**
         * @param {...any} args The title for the collapsed log group.
         * @returns {void}
         */
        static groupCollapsed = (...args) => console.groupCollapsed(LOG_PREFIX, ...args);
        /**
         * Closes the current log group.
         * @returns {void}
         */
        static groupEnd = () => console.groupEnd();

        /**
         * Logs a message with a styled badge for better visibility.
         * @param {string} badgeText - The text inside the badge.
         * @param {string} badgeStyle - The background-color style (from LOG_STYLES).
         * @param {'log'|'warn'|'error'|'info'|'debug'} level - The console log level.
         * @param {...any} args - Additional messages to log after the badge.
         */
        static badge(badgeText, badgeStyle, level, ...args) {
            if (this.levels[this.level] < this.levels[level]) {
                return; // Respect the current log level
            }

            const style = `${LOG_STYLES.BASE} ${badgeStyle}`;
            const consoleMethod = console[level] || console.log;

            consoleMethod(
                `%c${LOG_PREFIX}%c %c${badgeText}%c`,
                'font-weight: bold;', // Style for the prefix
                'color: inherit;', // Reset for space
                style, // Style for the badge
                'color: inherit;', // Reset for the rest of the message
                ...args
            );
        }
    }

    // =================================================================================
    // SECTION: Execution Guard
    // Description: Prevents the script from being executed multiple times per page.
    // =================================================================================

    class ExecutionGuard {
        // A shared key for all scripts from the same author to avoid polluting the window object.
        static #GUARD_KEY = `__${OWNERID}_guard__`;
        // A specific key for this particular script.
        static #APP_KEY = `${APPID}_executed`;

        /**
         * Checks if the script has already been executed on the page.
         * @returns {boolean} True if the script has run, otherwise false.
         */
        static hasExecuted() {
            return window[this.#GUARD_KEY]?.[this.#APP_KEY] || false;
        }

        /**
         * Sets the flag indicating the script has now been executed.
         */
        static setExecuted() {
            window[this.#GUARD_KEY] = window[this.#GUARD_KEY] || {};
            window[this.#GUARD_KEY][this.#APP_KEY] = true;
        }
    }

    // =================================================================================
    // SECTION: Configuration and Constants
    // =================================================================================

    const CONSTANTS = {
        CONFIG_KEY: `${APPID}_config`,
        TIMERS: {
            DEBOUNCE_MS: 300,
        },
        SELECTORS: {
            shortsFullScan: [
                'ytd-reel-shelf-renderer',
                'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
                'ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])',
                'ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])',
                'ytd-video-renderer:has(a[href*="/shorts/"])',
                'ytd-compact-video-renderer:has(a[href*="/shorts/"])',
                'ytd-guide-entry-renderer[guide-entry-title="Shorts"]',
                'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
                'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)',
            ],
            moreTopics: 'ytd-rich-section-renderer:has(ytd-chips-shelf-with-video-shelf-renderer)',
        },
        UI_DEFAULTS: {
            MODAL: {
                Z_INDEX: 10001,
            },
            SLIDER: {
                min: 2,
                max: 10,
                step: 1,
            },
        },
    };

    const DEFAULT_CONFIG = {
        options: {
            itemsPerRow: 5,
            hideShorts: true,
            hideMoreTopics: true,
            redirectShorts: true,
        },
    };

    const SITE_STYLES = {
        youtube: {
            MODAL_THEME: {
                bg: 'var(--yt-spec-menu-background, #fff)',
                text_primary: 'var(--yt-spec-text-primary, #030303)',
                text_secondary: 'var(--yt-spec-text-secondary, #606060)',
                border_default: 'var(--yt-spec-border-primary, #ddd)',
                accent_color: 'var(--yt-spec-call-to-action, #065fd4)',
                overlay_bg: 'rgb(0 0 0 / 0.6)',
            },
        },
    };

    const EVENTS = {
        CONFIG_UPDATED: `${APPID}:configUpdated`,
        CONFIG_SAVE_SUCCESS: `${APPID}:configSaveSuccess`,
    };

    // =================================================================================
    // SECTION: Event-Driven Architecture (Pub/Sub)
    // Description: A event bus for decoupled communication between classes.
    // =================================================================================

    const EventBus = {
        events: {},
        uiWorkQueue: [],
        isUiWorkScheduled: false,
        _logAggregation: {},
        // prettier-ignore
        _aggregatedEvents: new Set([
        ]),
        _aggregationDelay: 500, // ms

        /**
         * Subscribes a listener to an event using a unique key.
         * If a subscription with the same event and key already exists, it will be overwritten.
         * @param {string} event The event name.
         * @param {Function} listener The callback function.
         * @param {string} key A unique key for this subscription (e.g., 'ClassName.methodName').
         */
        subscribe(event, listener, key) {
            if (!key) {
                Logger.error('EventBus.subscribe requires a unique key.');
                return;
            }
            if (!this.events[event]) {
                this.events[event] = new Map();
            }
            this.events[event].set(key, listener);
        },
        /**
         * Subscribes a listener that will be automatically unsubscribed after one execution.
         * @param {string} event The event name.
         * @param {Function} listener The callback function.
         * @param {string} key A unique key for this subscription.
         */
        once(event, listener, key) {
            if (!key) {
                Logger.error('EventBus.once requires a unique key.');
                return;
            }
            const onceListener = (...args) => {
                this.unsubscribe(event, key);
                listener(...args);
            };
            this.subscribe(event, onceListener, key);
        },
        /**
         * Unsubscribes a listener from an event using its unique key.
         * @param {string} event The event name.
         * @param {string} key The unique key used during subscription.
         */
        unsubscribe(event, key) {
            if (!this.events[event] || !key) {
                return;
            }
            this.events[event].delete(key);
            if (this.events[event].size === 0) {
                delete this.events[event];
            }
        },
        /**
         * Publishes an event, calling all subscribed listeners with the provided data.
         * @param {string} event The event name.
         * @param {...any} args The data to pass to the listeners.
         */
        publish(event, ...args) {
            if (!this.events[event]) {
                return;
            }

            if (Logger.levels[Logger.level] >= Logger.levels.debug) {
                // --- Aggregation logic START ---
                if (this._aggregatedEvents.has(event)) {
                    if (!this._logAggregation[event]) {
                        this._logAggregation[event] = { timer: null, count: 0 };
                    }
                    const aggregation = this._logAggregation[event];
                    aggregation.count++;

                    clearTimeout(aggregation.timer);
                    aggregation.timer = setTimeout(() => {
                        const finalCount = this._logAggregation[event]?.count || 0;
                        if (finalCount > 0) {
                            console.log(LOG_PREFIX, `Event Published: ${event} (x${finalCount})`);
                        }
                        delete this._logAggregation[event];
                    }, this._aggregationDelay);

                    // Execute subscribers for the aggregated event, but without the verbose individual logs.
                    [...this.events[event].values()].forEach((listener) => {
                        try {
                            listener(...args);
                        } catch (e) {
                            Logger.error(`EventBus error in listener for event "${event}":`, e);
                        }
                    });
                    return; // End execution here for aggregated events in debug mode.
                }
                // --- Aggregation logic END ---

                // In debug mode, provide detailed logging for NON-aggregated events.
                const subscriberKeys = [...this.events[event].keys()];

                // Use groupCollapsed for a cleaner default view
                console.groupCollapsed(LOG_PREFIX, `Event Published: ${event}`);

                if (args.length > 0) {
                    console.log('  - Payload:', ...args);
                } else {
                    console.log('  - Payload: (No data)');
                }

                // Displaying subscribers helps in understanding the event's impact.
                if (subscriberKeys.length > 0) {
                    console.log('  - Subscribers:\n' + subscriberKeys.map((key) => `    > ${key}`).join('\n'));
                } else {
                    console.log('  - Subscribers: (None)');
                }

                // Iterate with keys for better logging
                this.events[event].forEach((listener, key) => {
                    try {
                        // Log which specific subscriber is being executed
                        Logger.debug(`-> Executing: ${key}`);
                        listener(...args);
                    } catch (e) {
                        // Enhance error logging with the specific subscriber key
                        Logger.badge('LISTENER ERROR', LOG_STYLES.RED, 'error', `Listener "${key}" failed for event "${event}":`, e);
                    }
                });

                console.groupEnd();
            } else {
                // Iterate over a copy of the values in case a listener unsubscribes itself.
                [...this.events[event].values()].forEach((listener) => {
                    try {
                        listener(...args);
                    } catch (e) {
                        Logger.badge('LISTENER ERROR', LOG_STYLES.RED, 'error', `Listener failed for event "${event}":`, e);
                    }
                });
            }
        },

        /**
         * Queues a function to be executed on the next animation frame.
         * Batches multiple UI updates into a single repaint cycle.
         * @param {Function} workFunction The function to execute.
         */
        queueUIWork(workFunction) {
            this.uiWorkQueue.push(workFunction);
            if (!this.isUiWorkScheduled) {
                this.isUiWorkScheduled = true;
                requestAnimationFrame(this._processUIWorkQueue.bind(this));
            }
        },

        /**
         * @private
         * @processUIWorkQueue Processes all functions in the UI work queue.
         */
        _processUIWorkQueue() {
            // Prevent modifications to the queue while processing.
            const queueToProcess = [...this.uiWorkQueue];
            this.uiWorkQueue.length = 0;

            for (const work of queueToProcess) {
                try {
                    work();
                } catch (e) {
                    Logger.badge('UI QUEUE ERROR', LOG_STYLES.RED, 'error', 'Error in queued UI work:', e);
                }
            }
            this.isUiWorkScheduled = false;
        },
    };

    /**
     * Creates a unique, consistent event subscription key for EventBus.
     * @param {object} context The `this` context of the subscribing class instance.
     * @param {string} eventName The full event name from the EVENTS constant.
     * @returns {string} A key in the format 'ClassName.purpose'.
     */
    function createEventKey(context, eventName) {
        // Extract a meaningful 'purpose' from the event name
        const parts = eventName.split(':');
        const purpose = parts.length > 1 ? parts.slice(1).join('_') : parts[0];

        let contextName = 'UnknownContext';
        if (context && context.constructor && context.constructor.name) {
            contextName = context.constructor.name;
        }
        return `${contextName}.${purpose}`;
    }

    // =================================================================================
    // SECTION: Utility Functions
    // =================================================================================

    /**
     * @param {Function} func
     * @param {number} delay
     * @returns {Function & { cancel: () => void }}
     */
    function debounce(func, delay) {
        let timeout;
        const debounced = function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
        debounced.cancel = () => {
            clearTimeout(timeout);
        };
        return debounced;
    }

    /**
     * Helper function to check if an item is a non-array object.
     * @param {*} item The item to check.
     * @returns {boolean}
     */
    function isObject(item) {
        return !!(item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * Recursively resolves the configuration by overlaying source properties onto the target object.
     * The target object is mutated. This handles recursive updates for nested objects but overwrites arrays/primitives.
     *
     * [MERGE BEHAVIOR]
     * Keys present in 'source' but missing in 'target' are ignored.
     * The 'target' object acts as a schema; it must contain all valid keys.
     *
     * @param {object} target The target object (e.g., a deep copy of default config).
     * @param {object} source The source object (e.g., user config).
     * @returns {object} The mutated target object.
     */
    function resolveConfig(target, source) {
        for (const key in source) {
            // Security: Prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }

            if (Object.prototype.hasOwnProperty.call(source, key)) {
                // Strict check: Ignore keys that do not exist in the target (default config).
                if (!Object.prototype.hasOwnProperty.call(target, key)) {
                    continue;
                }

                const sourceVal = source[key];
                const targetVal = target[key];

                if (isObject(sourceVal) && isObject(targetVal)) {
                    // If both are objects, recurse
                    resolveConfig(targetVal, sourceVal);
                } else if (typeof sourceVal !== 'undefined') {
                    // Otherwise, overwrite or set the value from the source
                    target[key] = sourceVal;
                }
            }
        }
        return target;
    }

    /**
     * @typedef {Node|string|number|boolean|null|undefined} HChild
     */
    /**
     * Creates a DOM element using a hyperscript-style syntax.
     * @param {string} tag - Tag name with optional ID/class (e.g., "div#app.container", "my-element").
     * @param {object | HChild | HChild[]} [propsOrChildren] - Attributes object or children.
     * @param {HChild | HChild[]} [children] - Children (if props are specified).
     * @returns {HTMLElement|SVGElement} The created DOM element.
     */
    function h(tag, propsOrChildren, children) {
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const match = tag.match(/^([a-z0-9-]+)(#[\w-]+)?((\.[\w-]+)*)$/i);
        if (!match) throw new Error(`Invalid tag syntax: ${tag}`);

        const [, tagName, id, classList] = match;
        const isSVG = ['svg', 'circle', 'rect', 'path', 'g', 'line', 'text', 'use', 'defs', 'clipPath'].includes(tagName);
        const el = isSVG ? document.createElementNS(SVG_NS, tagName) : document.createElement(tagName);

        if (id) el.id = id.slice(1);
        if (classList) {
            const classes = classList.replace(/\./g, ' ').trim();
            if (classes) {
                el.classList.add(...classes.split(/\s+/));
            }
        }

        let props = {};
        let childrenArray;
        if (propsOrChildren && Object.prototype.toString.call(propsOrChildren) === '[object Object]') {
            props = propsOrChildren;
            childrenArray = children;
        } else {
            childrenArray = propsOrChildren;
        }

        // --- Start of Attribute/Property Handling ---
        const directProperties = new Set(['value', 'checked', 'selected', 'readOnly', 'disabled', 'multiple', 'textContent']);
        const urlAttributes = new Set(['href', 'src', 'action', 'formaction']);
        const safeProtocols = new Set(['https:', 'http:', 'mailto:', 'tel:', 'blob:', 'data:']);

        for (const [key, value] of Object.entries(props)) {
            // 0. Handle `ref` callback (highest priority after props parsing).
            if (key === 'ref' && typeof value === 'function') {
                value(el);
            }
            // 1. Security check for URL attributes.
            else if (urlAttributes.has(key)) {
                const url = String(value);
                try {
                    const parsedUrl = new URL(url); // Throws if not an absolute URL.
                    if (safeProtocols.has(parsedUrl.protocol)) {
                        el.setAttribute(key, url);
                    } else {
                        el.setAttribute(key, '#');
                        Logger.badge('UNSAFE URL', LOG_STYLES.YELLOW, 'warn', `Blocked potentially unsafe protocol "${parsedUrl.protocol}" in attribute "${key}":`, url);
                    }
                } catch {
                    el.setAttribute(key, '#');
                    Logger.badge('INVALID URL', LOG_STYLES.YELLOW, 'warn', `Blocked invalid or relative URL in attribute "${key}":`, url);
                }
            }
            // 2. Direct property assignments.
            else if (directProperties.has(key)) {
                el[key] = value;
            }
            // 3. Other specialized handlers.
            else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key === 'dataset' && typeof value === 'object') {
                for (const [dataKey, dataVal] of Object.entries(value)) {
                    el.dataset[dataKey] = dataVal;
                }
            } else if (key.startsWith('on')) {
                if (typeof value === 'function') {
                    el.addEventListener(key.slice(2).toLowerCase(), value);
                }
            } else if (key === 'className') {
                const classes = String(value).trim();
                if (classes) {
                    el.classList.add(...classes.split(/\s+/));
                }
            } else if (key.startsWith('aria-')) {
                el.setAttribute(key, String(value));
            }
            // 4. Default attribute handling.
            else if (value !== false && value !== null) {
                el.setAttribute(key, value === true ? '' : String(value));
            }
        }
        // --- End of Attribute/Property Handling ---

        const fragment = document.createDocumentFragment();
        /**
         * Appends a child node or text to the document fragment.
         * @param {HChild} child - The child to append.
         */
        function append(child) {
            if (child === null || child === false || typeof child === 'undefined') return;
            if (typeof child === 'string' || typeof child === 'number') {
                fragment.appendChild(document.createTextNode(String(child)));
            } else if (Array.isArray(child)) {
                child.forEach(append);
            } else if (child instanceof Node) {
                fragment.appendChild(child);
            } else {
                throw new Error('Unsupported child type');
            }
        }
        append(childrenArray);

        el.appendChild(fragment);

        return el;
    }

    // =================================================================================
    // SECTION: Configuration Management (GM Storage)
    // =================================================================================

    class ConfigManagerBase {
        constructor({ configKey, defaultConfig }) {
            if (!configKey || !defaultConfig) {
                throw new Error('configKey and defaultConfig must be provided.');
            }
            this.CONFIG_KEY = configKey;
            this.DEFAULT_CONFIG = defaultConfig;
            this.config = null;
        }

        async load() {
            let raw = null;
            try {
                raw = await GM.getValue(this.CONFIG_KEY);
            } catch (e) {
                Logger.error('Failed to load configuration from storage.', e);
            }

            let userConfig = null;
            if (raw) {
                try {
                    userConfig = JSON.parse(raw);
                } catch (e) {
                    Logger.error('Failed to parse configuration. Resetting to default settings.', e);
                    userConfig = null;
                }
            }

            const completeConfig = JSON.parse(JSON.stringify(this.DEFAULT_CONFIG));
            this.config = resolveConfig(completeConfig, userConfig || {});
        }

        async save(obj) {
            this.config = obj;
            await GM.setValue(this.CONFIG_KEY, JSON.stringify(obj));
        }

        get() {
            return this.config;
        }
    }

    class ConfigManager extends ConfigManagerBase {
        constructor() {
            super({
                configKey: CONSTANTS.CONFIG_KEY,
                defaultConfig: DEFAULT_CONFIG,
            });
        }
    }

    // =================================================================================
    // SECTION: UI Elements - Base Classes
    // =================================================================================

    /**
     * @abstract
     * @description Base class for a UI component.
     */
    class UIComponentBase {
        constructor(callbacks = {}) {
            this.callbacks = callbacks;
            this.element = null;
        }

        /** @abstract */
        render() {
            throw new Error('Component must implement render method.');
        }

        destroy() {
            this.element?.remove();
            this.element = null;
        }
    }

    class SettingsModal extends UIComponentBase {
        constructor(callbacks) {
            super(callbacks);
            // Delegate save logic to the _saveConfig method.
            this.debouncedSave = debounce(() => {
                this._saveConfig();
            }, CONSTANTS.TIMERS.DEBOUNCE_MS);

            this._handleKeyDown = this._handleKeyDown.bind(this);
            this.overlay = null;
        }

        /**
         * Opens the settings modal.
         */
        async open() {
            if (this.overlay) return;

            // Prepare the form content
            this.element = this._createPanelContent();
            await this.populateForm();

            // Create Overlay and Container
            this.overlay = h(
                `div.${APPID}-modal-overlay`,
                {
                    onclick: (e) => {
                        // Close when clicking the overlay background
                        if (e.target === this.overlay) this.close();
                    },
                },
                [
                    h(`div.${APPID}-modal-box`, [
                        // Header
                        h(`div.${APPID}-modal-header`, [h('span', `${APPNAME} Settings`), h(`button.${APPID}-close-btn`, { onclick: () => this.close(), title: 'Close' }, '✕')]),
                        // Content
                        h(`div.${APPID}-modal-content`, [this.element]),
                    ]),
                ]
            );

            this._injectStyles();
            document.body.appendChild(this.overlay);

            // Add global key listener for ESC
            document.addEventListener('keydown', this._handleKeyDown);
        }

        /**
         * Closes the settings modal.
         */
        close() {
            if (this.overlay) {
                document.removeEventListener('keydown', this._handleKeyDown);

                // Immediately save pending changes before closing.
                this.debouncedSave.cancel();
                this._saveConfig();

                this.overlay.remove();
                this.overlay = null;
                this.element = null; // Clear reference
                this.callbacks.onClose?.();
            }
        }

        /**
         * Collects data and publishes the update event if changes are detected.
         * Executes synchronously to ensure data capture before DOM destruction.
         */
        _saveConfig() {
            // Do not process if the element is destroyed.
            if (!this.element) return;

            const currentConfig = this.callbacks.getCurrentConfig();
            const newConfig = this._collectDataFromForm();

            // Publish save event only if configuration has changed.
            if (JSON.stringify(currentConfig) !== JSON.stringify(newConfig)) {
                EventBus.publish(EVENTS.CONFIG_UPDATED, newConfig);
            }
        }

        toggle() {
            if (this.overlay) {
                this.close();
            } else {
                this.open();
            }
        }

        isOpen() {
            return !!this.overlay;
        }

        render() {
            // No-op. Styles are injected when opened.
            return null;
        }

        destroy() {
            this.close();
            const styleId = `${APPID}-modal-styles`;
            document.getElementById(styleId)?.remove();
            this.debouncedSave.cancel();
            super.destroy();
        }

        _handleKeyDown(e) {
            if (e.key === 'Escape') {
                this.close();
            }
        }

        _createPanelContent() {
            const sliderSettings = CONSTANTS.UI_DEFAULTS.SLIDER;
            const createToggle = (id, title) => {
                return h(`label.${APPID}-toggle-switch`, { title: title }, [h('input', { type: 'checkbox', id: id }), h(`span.${APPID}-toggle-slider`)]);
            };

            return h('div', [
                h(`div.${APPID}-submenu-row-stacked`, [
                    h('label', { htmlFor: `${APPID}-items-per-row-slider` }, 'Items per row'),
                    h(`div.${APPID}-slider-wrapper`, [
                        h('input', {
                            type: 'range',
                            id: `${APPID}-items-per-row-slider`,
                            min: sliderSettings.min,
                            max: sliderSettings.max,
                            step: sliderSettings.step,
                        }),
                        h(`span#${APPID}-slider-value-display`),
                    ]),
                ]),
                h('div', { style: { borderTop: '1px solid var(--yt-spec-border-primary, #ddd)', margin: '12px 0' } }),
                h(`div.${APPID}-submenu-row`, [
                    h('label', { htmlFor: `${APPID}-hide-shorts-toggle` }, 'Hide YouTube Shorts'),
                    createToggle(`${APPID}-hide-shorts-toggle`, 'Hides Shorts videos from shelves, search results, and navigation menus.'),
                ]),
                h(`div.${APPID}-submenu-row`, { style: { marginTop: '12px' } }, [
                    h('label', { htmlFor: `${APPID}-hide-more-topics-toggle` }, "Hide 'Explore more topics'"),
                    createToggle(`${APPID}-hide-more-topics-toggle`, "Hides the 'Explore more topics' section from the feed."),
                ]),
                h('div', { style: { borderTop: '1px solid var(--yt-spec-border-primary, #ddd)', margin: '12px 0' } }),
                h(`div.${APPID}-submenu-row`, [
                    h('label', { htmlFor: `${APPID}-redirect-shorts-toggle` }, 'Redirect Shorts player'),
                    createToggle(`${APPID}-redirect-shorts-toggle`, 'Redirects the Shorts player to the standard video player.'),
                ]),
                h(`div.${APPID}-settings-note`, { style: { marginTop: '16px' }, textContent: 'Settings are automatically synced across tabs.' }),
            ]);
        }

        async populateForm() {
            const config = await this.callbacks.getCurrentConfig();
            // Wait for element to be created
            if (!this.element) return;

            // Helper to update field with Input Guard
            const updateField = (selector, value, isCheckbox) => {
                const input = this.element.querySelector(selector);
                if (!input) return;

                // User Interface Guard:
                // If the user is actively interacting with this specific input (it has focus),
                // do NOT overwrite the value. This prevents the slider/toggle from jumping
                // under the user's cursor during a live update from another tab.
                if (document.activeElement === input) {
                    return;
                }

                if (isCheckbox) {
                    input.checked = value;
                } else {
                    input.value = value;
                }
            };

            updateField(`#${APPID}-items-per-row-slider`, config.options.itemsPerRow, false);
            const slider = this.element.querySelector(`#${APPID}-items-per-row-slider`);
            if (slider) this._updateSliderAppearance(slider);

            updateField(`#${APPID}-hide-shorts-toggle`, config.options.hideShorts, true);
            updateField(`#${APPID}-hide-more-topics-toggle`, config.options.hideMoreTopics, true);
            updateField(`#${APPID}-redirect-shorts-toggle`, config.options.redirectShorts, true);

            this._setupEventListeners();
        }

        _setupEventListeners() {
            // Use event delegation on the content element
            this.element.addEventListener('change', (e) => {
                if (e.target.matches('input[type="checkbox"]')) {
                    this.debouncedSave();
                }
            });
            this.element.addEventListener('input', (e) => {
                if (e.target.matches('input[type="range"]')) {
                    this._updateSliderAppearance(e.target);
                    this.debouncedSave();
                }
            });
        }

        /**
         * @returns {object} The new configuration object derived from the form state.
         */
        _collectDataFromForm() {
            // Ensure values are read synchronously before DOM destruction in close().
            const currentConfig = this.callbacks.getCurrentConfig();
            const newConfig = JSON.parse(JSON.stringify(currentConfig));

            // If panel is closed or element destroyed, do not collect (safety check)
            if (!this.element) return currentConfig;

            const slider = this.element.querySelector(`#${APPID}-items-per-row-slider`);
            if (slider) newConfig.options.itemsPerRow = parseInt(slider.value, 10);

            const hideShorts = this.element.querySelector(`#${APPID}-hide-shorts-toggle`);
            if (hideShorts) newConfig.options.hideShorts = hideShorts.checked;

            const hideMore = this.element.querySelector(`#${APPID}-hide-more-topics-toggle`);
            if (hideMore) newConfig.options.hideMoreTopics = hideMore.checked;

            const redirect = this.element.querySelector(`#${APPID}-redirect-shorts-toggle`);
            if (redirect) newConfig.options.redirectShorts = redirect.checked;

            return newConfig;
        }

        _updateSliderAppearance(slider) {
            const display = this.element.querySelector(`#${APPID}-slider-value-display`);
            if (display) display.textContent = slider.value;
        }

        _injectStyles() {
            const styleId = `${APPID}-modal-styles`;
            if (document.getElementById(styleId)) return;
            const styles = SITE_STYLES.youtube.MODAL_THEME;
            const zIndex = CONSTANTS.UI_DEFAULTS.MODAL.Z_INDEX;

            const style = h('style', {
                id: styleId,
                textContent: `
                .${APPID}-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: ${styles.overlay_bg};
                    z-index: ${zIndex};
                    display: flex; align-items: center; justify-content: center;
                }
                .${APPID}-modal-box {
                    background: ${styles.bg};
                    color: ${styles.text_primary};
                    width: 360px;
                    max-width: 90vw;
                    border: 1px solid ${styles.border_default};
                    border-radius: 12px;
                    box-shadow: 0 4px 16px rgb(0 0 0 / 0.3);
                    display: flex; flex-direction: column;
                    font-size: 14px;
                }
                .${APPID}-modal-header {
                    padding: 12px 16px;
                    font-size: 1.1em; font-weight: bold;
                    border-bottom: 1px solid ${styles.border_default};
                    display: flex; justify-content: space-between; align-items: center;
                }
                .${APPID}-close-btn {
                    background: none; border: none; cursor: pointer;
                    font-size: 18px; color: ${styles.text_secondary};
                    padding: 0 4px;
                }
                .${APPID}-close-btn:hover {
                    color: ${styles.text_primary};
                }
                .${APPID}-modal-content {
                    padding: 16px;
                    overflow-y: auto;
                    max-height: 80vh;
                }
                .${APPID}-submenu-row, .${APPID}-submenu-row-stacked {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .${APPID}-submenu-row {
                    justify-content: space-between;
                }
                .${APPID}-submenu-row-stacked {
                    flex-direction: column;
                    align-items: stretch;
                }
                .${APPID}-slider-wrapper {
                    display: flex; align-items: center; gap: 16px;
                }
                #${APPID}-items-per-row-slider {
                    flex-grow: 1;
                }
                #${APPID}-slider-value-display {
                    font-weight: 500; min-width: 20px; text-align: right; color: ${styles.text_secondary};
                }
                .${APPID}-toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 22px;
                    flex-shrink: 0;
                }
                .${APPID}-toggle-switch input {
                    opacity: 0; width: 0; height: 0;
                }
                .${APPID}-toggle-slider {
                    position: absolute; cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: var(--yt-spec-icon-disabled, #ccc);
                    transition: .3s;
                    border-radius: 22px;
                }
                .${APPID}-toggle-slider:before {
                    position: absolute; content: "";
                    height: 16px; width: 16px;
                    left: 3px; bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                .${APPID}-toggle-switch input:checked + .${APPID}-toggle-slider {
                    background-color: ${styles.accent_color};
                }
                .${APPID}-toggle-switch input:checked + .${APPID}-toggle-slider:before {
                    transform: translateX(18px);
                }
                .${APPID}-settings-note {
                    font-size: 12px;
                    color: ${styles.text_secondary};
                    margin-top: 8px;
                    text-align: left;
                }
                #${APPID}-sync-note {
                    min-height: 1.5em;
                }
            `,
            });
            document.head.appendChild(style);
        }
    }

    // =================================================================================
    // SECTION: UI Elements - Components and Manager
    // =================================================================================

    class UIManager {
        constructor(getCurrentConfig, siteStyles, callbacks = {}) {
            this.getCurrentConfig = getCurrentConfig;
            this.siteStyles = siteStyles;
            this.callbacks = callbacks;
            this.components = {};
        }

        init() {
            // Initialize the modal component (it won't render until opened)
            this.components.settingsModal = new SettingsModal({
                getCurrentConfig: this.getCurrentConfig,
                onClose: this.callbacks.onPanelClose, // Pass the callback down
            });

            // Register the menu command to open settings
            GM.registerMenuCommand('Open Settings', () => {
                this.components.settingsModal.toggle();
            });
        }

        destroy() {
            Object.values(this.components).forEach((component) => {
                if (component && typeof component.destroy === 'function') {
                    component.destroy();
                }
            });
            this.components = {};
        }
    }

    // =================================================================================
    // SECTION: Sync Manager
    // =================================================================================

    class SyncManager {
        constructor(app) {
            this.app = app;
            this.listenerId = null;
        }

        async init() {
            this.listenerId = await GM.addValueChangeListener(CONSTANTS.CONFIG_KEY, this._handleRemoteChange.bind(this));
        }

        async destroy() {
            if (this.listenerId) {
                await GM.removeValueChangeListener(this.listenerId);
                this.listenerId = null;
            }
        }

        /**
         * Called by AppController when a local save occurs.
         * No specific action needed for now, but kept for interface consistency.
         */
        onSave() {
            // No-op
        }

        /**
         * Called by AppController (via UIManager) when the settings panel is closed.
         * No specific action needed for now, but kept for interface consistency.
         */
        onPanelClose() {
            // No-op
        }

        /**
         * Handles the GM.addValueChangeListener event.
         * @private
         */
        async _handleRemoteChange(name, oldValue, newValue, remote) {
            if (!remote) {
                return;
            }

            // Guard: Wait for the local config to be loaded before processing a remote change.
            await this.app.configPromise;
            if (!this.app.configManager.config) {
                Logger.error('Config is still not available after promise resolved. Aborting remote change.');
                return;
            }

            Logger.log('Remote config change detected. Applying live update.');
            let newConfig;
            try {
                newConfig = JSON.parse(newValue);
            } catch (e) {
                Logger.error('Failed to parse remote config.', e);
                return;
            }

            // Always apply the remote update immediately (Live Update)
            this.app.applyRemoteUpdate(newConfig);
        }
    }

    // =================================================================================
    // SECTION: Style Manager
    // =================================================================================

    class StyleManager {
        static styleElement = null;

        static init() {
            if (this.styleElement) return;
            this.styleElement = h('style', { id: `${APPID}-dynamic-styles` });
            document.head.appendChild(this.styleElement);
        }

        static destroy() {
            if (this.styleElement) {
                this.styleElement.remove();
                this.styleElement = null;
            }
        }

        static update(options) {
            const { itemsPerRow, hideShorts, hideMoreTopics } = options;
            const GAP = 12; // A reasonable default gap in pixels

            let cssText = `
                /* Widen the main content container and remove padding */
                #primary.ytd-two-column-browse-results-renderer,
                #contents.ytd-page-manager {
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 0 !important;
                }

                /* Apply user settings and layout fixes to the video grid */
                ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: ${itemsPerRow} !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    gap: ${GAP}px !important;
                }
            `;

            if (hideShorts) {
                const selectorsToHide = CONSTANTS.SELECTORS.shortsFullScan.join(',\n');
                cssText += `
                    /* CSS to hide Shorts elements */
                    ${selectorsToHide} {
                        display: none !important;
                    }
                `;
            }

            if (hideMoreTopics) {
                cssText += `
                    /* CSS to hide 'Explore more topics' section */
                    ${CONSTANTS.SELECTORS.moreTopics} {
                        display: none !important;
                    }
                `;
            }

            if (this.styleElement.textContent !== cssText) {
                this.styleElement.textContent = cssText;
                Logger.log(`Styles updated: ItemsPerRow=${itemsPerRow}, HideShorts=${hideShorts}, HideMoreTopics=${hideMoreTopics}`);
            }
        }
    }

    // =================================================================================
    // SECTION: Main Application Controller
    // =================================================================================

    class AppController {
        constructor() {
            this.configManager = null;
            this.uiManager = null;
            this.syncManager = new SyncManager(this);
            this.configPromise = null; // Promise for config load
            this.subscriptions = [];

            // Bind handlers to preserve 'this' context for addEventListener/removeEventListener
            this.handleRedirectBound = this.handleRedirect.bind(this);
            this.handleNavigationBound = this.handleNavigation.bind(this);
            this.initDOMComponentsBound = this.initDOMComponents.bind(this);

            // Promise to resolve when DOM-dependent components are initialized
            this.domReadyPromise = new Promise((resolve) => {
                this.resolveDomReadyPromise = resolve;
            });
        }

        /**
         * Stage 1: Initialize non-DOM components and listeners.
         * This runs immediately at document-start.
         */
        init() {
            Logger.log('Initializing (Stage 1)...');

            this.configManager = new ConfigManager();
            this.configPromise = this.configManager.load(); // Start loading config

            this.syncManager.init(); // Initialize the sync listener.

            // Apply styles immediately after config load to prevent FOUC.
            // This runs as soon as config is ready, without waiting for DOMContentLoaded.
            this.configPromise.then(() => {
                // Ensure document.head exists (it usually does by the time config loads)
                if (!document.head) return;
                StyleManager.init();
                const config = this.configManager.get();
                if (config) {
                    StyleManager.update(config.options);
                }
            });

            // Register all event listeners immediately to prevent race conditions
            this._subscribe(EVENTS.CONFIG_UPDATED, this.handleSave.bind(this));
            document.addEventListener('yt-navigate-start', this.handleRedirectBound);
            document.addEventListener('yt-navigate-finish', this.handleNavigationBound);

            // Register Stage 2: Initialize DOM components when ready.
            // Check readyState to ensure initialization runs even if DOM is already loaded.
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.initDOMComponentsBound);
            } else {
                this.initDOMComponentsBound();
            }
        }

        /**
         * Helper to subscribe to EventBus and track the subscription for cleanup.
         * Appends the listener name and a unique suffix to the key to avoid conflicts.
         * @param {string} event
         * @param {Function} listener
         */
        _subscribe(event, listener) {
            const baseKey = createEventKey(this, event);
            // Use function name for debugging aid, fallback to 'anonymous'
            const listenerName = listener.name || 'anonymous';
            // Generate a short random suffix to guarantee uniqueness even for anonymous functions
            const uniqueSuffix = Math.random().toString(36).substring(2, 7);
            const key = `${baseKey}_${listenerName}_${uniqueSuffix}`;

            EventBus.subscribe(event, listener, key);
            this.subscriptions.push({ event, key });
        }

        /**
         * Stage 2: Initialize DOM-dependent components.
         * This runs after the DOM is ready.
         */
        async initDOMComponents() {
            Logger.log('Initializing (Stage 2 - DOM Ready)...');

            // Ensure config is loaded before creating UI
            await this.configPromise;
            Logger.log('Config loaded, initializing UI.');

            StyleManager.init();

            this.uiManager = new UIManager(() => this.configManager.get(), {
                onPanelClose: () => this.syncManager.onPanelClose(),
            });
            this.uiManager.init();

            // Apply initial settings now that UI and config are ready
            this.applySettings();

            // Signal that DOM initialization is complete
            this.resolveDomReadyPromise();
        }

        async destroy() {
            // 1. Unsubscribe from EventBus
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];

            // 2. Remove DOM event listeners
            document.removeEventListener('yt-navigate-start', this.handleRedirectBound);
            document.removeEventListener('yt-navigate-finish', this.handleNavigationBound);
            document.removeEventListener('DOMContentLoaded', this.initDOMComponentsBound);

            // 3. Destroy sub-managers
            if (this.uiManager) {
                this.uiManager.destroy();
            }
            if (this.syncManager) {
                await this.syncManager.destroy();
            }

            // 4. Clean up static StyleManager
            StyleManager.destroy();
        }

        /**
         * Lightweight method to apply styles.
         * Ensures config is loaded and DOM components (StyleManager) are initialized before acting.
         */
        async applySettings() {
            // Wait for both config and DOM initialization to be complete
            await this.configPromise;
            await this.domReadyPromise;

            const config = this.configManager.get();
            StyleManager.update(config.options);
        }

        /**
         * Applies an update received from another tab.
         * @param {object} newConfig - The new configuration object from the remote tab.
         */
        applyRemoteUpdate(newConfig) {
            this.configManager.config = newConfig;
            this.applySettings();

            // Live Update: If the modal is open, refresh its state.
            // populateForm() has built-in guards to avoid interrupting active user input.
            if (this.uiManager && this.uiManager.components.settingsModal && this.uiManager.components.settingsModal.isOpen()) {
                this.uiManager.components.settingsModal.populateForm();
            }
        }

        async handleSave(newConfig) {
            this.syncManager.onSave(); // Notify SyncManager that a local save is happening.
            await this.configManager.save(newConfig);
            Logger.log('Configuration saved.');

            // On save, only apply the (fast) stylesheet update.
            this.applySettings();
        }

        handleRedirect(e) {
            const config = this.configManager.get();

            // If config is not loaded yet or redirect is disabled, do nothing.
            if (!config || !config.options.redirectShorts) return;

            const urlString = e.detail.url;
            if (!urlString) return;

            const url = new URL(urlString, window.location.origin);
            const videoId = getShortsVideoId(url.pathname);

            if (videoId) {
                e.preventDefault(); // Stop the navigation to the Shorts player

                // Preserve existing query params and add 'v'
                url.searchParams.set('v', videoId);
                const newUrl = `/watch?${url.searchParams.toString()}`;

                Logger.log(`Shorts navigation detected, redirecting to: ${newUrl}`);
                window.history.pushState({}, '', newUrl);
                window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
            }
        }

        handleNavigation() {
            Logger.log(`Navigation finished. Running updates for: ${window.location.href}`);

            // On navigation, apply styles.
            // applySettings() will wait for config if it's not ready yet.
            this.applySettings();
        }
    }

    // =================================================================================
    // SECTION: Entry Point
    // =================================================================================

    if (ExecutionGuard.hasExecuted()) return;
    ExecutionGuard.setExecuted();

    const app = new AppController();
    app.init();
})();
