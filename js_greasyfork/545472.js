// ==UserScript==
// @name         RedGIFs Video Download Button
// @namespace    https://github.com/p65536
// @version      2.1.0
// @license      MIT
// @description  Adds a download button (for one-click HD downloads) and an "Open in New Tab" button to each video on the RedGIFs site.
// @icon         https://www.redgifs.com/favicon.ico
// @author       p65536
// @match        https://*.redgifs.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545472/RedGIFs%20Video%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/545472/RedGIFs%20Video%20Download%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // SECTION: Script-Specific Definitions
    // =================================================================================

    const OWNERID = 'p65536';
    const APPID = 'rgvdb';
    const APPNAME = 'RedGIFs Video Download Button';
    const LOG_PREFIX = `[${APPID.toUpperCase()}]`;

    // =================================================================================
    // SECTION: Configuration Definitions
    // =================================================================================

    const CONSTANTS = {
        CONFIG_KEY: `${APPID}_config`,
        VIDEO_CONTAINER_SELECTOR: '.GifPreview',
        TILE_ITEM_SELECTOR: '.tileItem',
        WATCH_URL_BASE: 'https://www.redgifs.com/watch/',
        TOAST_DURATION: 3000,
        TOAST_ERROR_DURATION: 6000,
        TOAST_FADE_OUT_DURATION: 300,
        ICON_REVERT_DELAY: 2000,
        CANCEL_LOCK_DURATION: 600, // (ms) Duration to lock download button to prevent mis-click cancel
        CONTEXT_TYPE: {
            TILE: 'TILE',
            PREVIEW: 'PREVIEW',
        },
        MODAL: {
            WIDTH: 400,
            Z_INDEX: 10001,
        },
    };

    /**
     * Default configuration settings.
     * Contains the initial values and descriptions for user-configurable options.
     */
    const DEFAULT_CONFIG = {
        /**
         * General settings affecting all buttons/UI.
         */
        common: {
            /**
             * If true, ALL buttons are hidden by default and only appear when hovering over the thumbnail/video.
             * This applies globally to prevent layout misalignment.
             * (On mobile, buttons are always visible regardless of this setting to prevent usability issues)
             */
            showOnlyOnHover: false,
        },

        /**
         * Settings related to the Download functionality.
         */
        download: {
            /**
             * Template for the filename of downloaded videos.
             * You can customize the format using the following placeholders:
             * - {user}: The creator's username (e.g., "RedGifsOfficial")
             * - {date}: The creation date (YYYYMMDD_HHMMSS)
             * - {id}:   The unique video ID (e.g., "watchfulwaiting")
             *
             * Default: '{user}_{date}_{id}'
             */
            filenameTemplate: '{user}_{date}_{id}',
        },

        /**
         * Settings related to the "Open in New Tab" functionality.
         */
        openInNewTab: {
            /**
             * Set to false to completely remove this button.
             * If disabled, the download button will automatically move up to take its place.
             */
            enabled: true,
        },

        /**
         * Developer settings for debugging.
         */
        developer: {
            /**
             * Controls the verbosity of logs in the console.
             * Options: 'error', 'warn', 'info', 'log', 'debug'
             */
            logger_level: 'log',
        },
    };

    const EVENTS = {
        CONFIG_UPDATED: `${APPID}:configUpdated`,
        CONFIG_SAVE_SUCCESS: `${APPID}:configSaveSuccess`,
    };

    // =================================================================================
    // SECTION: Style Definitions
    // =================================================================================
    const UI_STYLES_TEMPLATE = `
        /* Open in New Tab Button on Thumbnails */
        ${CONSTANTS.TILE_ITEM_SELECTOR} {
            position: relative;
        }
        .${APPID}-open-in-new-tab-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            width: 28px;
            height: 28px;
            padding: 4px;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.6);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            text-decoration: none; /* For <a> tag */
            color: inherit; /* Prevent blue link color */
        }
        .${APPID}-open-in-new-tab-btn:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
        /* Download Button on Thumbnails */
        .${APPID}-tile-download-btn {
            position: absolute;
            top: 40px; /* Positioned below the open-in-new-tab button (8px + 28px + 4px) */
            right: 8px;
            z-index: 10;
            width: 28px;
            height: 28px;
            padding: 0;
            border-radius: 4px;
            background-color: red;
            border: none;
            cursor: pointer;
            display: grid;
            place-items: center;
        }
        .${APPID}-tile-download-btn:hover {
            background-color: #c00;
        }

        /* Buttons on Video Preview */
        ${CONSTANTS.VIDEO_CONTAINER_SELECTOR} {
            position: relative;
        }
        .${APPID}-preview-open-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 1000;
            width: 32px;
            height: 32px;
            padding: 4px;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.6);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none; /* For <a> tag */
            color: inherit; /* Prevent blue link color */
        }
        .${APPID}-preview-open-btn:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
        .${APPID}-preview-download-btn {
            position: absolute;
            top: 44px; /* Positioned below the open-in-new-tab button */
            right: 8px;
            z-index: 1000;
            width: 32px;
            height: 32px;
            padding: 0;
            border-radius: 4px;
            background-color: red;
            border: none;
            cursor: pointer;
            display: grid;
            place-items: center;
        }
        .${APPID}-preview-download-btn:hover {
            background-color: #c00;
        }

        /* Spinner Animation */
        .${APPID}-spinner {
            animation: ${APPID}-spinner-rotate 1s linear infinite;
            transform-origin: center;
        }

        /* Toast Notifications */
        .${APPID}-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .${APPID}-toast {
            padding: 12px 18px;
            border-radius: 6px;
            color: white;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
            animation: ${APPID}-toast-fade-in 0.3s ease-out;
        }
        .${APPID}-toast.exiting {
            animation: ${APPID}-toast-fade-out 0.3s ease-in forwards;
        }
        .${APPID}-toast-success { background-color: rgb(40, 167, 69); }
        .${APPID}-toast-error { background-color: rgb(220, 53, 69); }
        .${APPID}-toast-info { background-color: rgb(23, 162, 184); }

        /* Mobile: Adjust button position to avoid overlapping native UI */
        .App.phone .${APPID}-preview-open-btn {
            /* Offset by toolbar height (assumed 56px) + 8px original top */
            top: 64px; 
        }
        .App.phone .${APPID}-preview-download-btn {
            /* Offset by toolbar height (assumed 56px) + 44px original top */
            top: 100px;
        }

        /* Keyframes */
        @keyframes ${APPID}-spinner-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes ${APPID}-toast-fade-in {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ${APPID}-toast-fade-out {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;

    // Dark theme styles specifically for the settings modal
    const MODAL_STYLES = `
        .${APPID}-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: ${CONSTANTS.MODAL.Z_INDEX};
            display: flex; align-items: center; justify-content: center;
        }
        .${APPID}-modal-box {
            background: #222; color: #eee;
            width: ${CONSTANTS.MODAL.WIDTH}px;
            max-width: 90vw;
            border: 1px solid #444;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
            display: flex; flex-direction: column;
            font-family: sans-serif; font-size: 14px;
        }
        .${APPID}-modal-header {
            padding: 12px 16px;
            font-size: 1.1em; font-weight: bold;
            border-bottom: 1px solid #444;
            display: flex; justify-content: space-between; align-items: center;
        }
        .${APPID}-modal-content {
            padding: 16px;
            overflow-y: auto;
            max-height: 80vh;
        }
        .${APPID}-modal-footer {
            padding: 12px 16px;
            border-top: 1px solid #444;
            display: flex; justify-content: space-between;
            align-items: center;
        }
        .${APPID}-footer-actions {
            display: flex; gap: 8px;
        }
        .${APPID}-form-group {
            margin-bottom: 16px;
        }
        .${APPID}-form-label {
            display: block; margin-bottom: 6px; font-weight: 500; color: #ccc;
        }
        .${APPID}-form-desc {
            font-size: 0.85em; color: #999; margin-bottom: 6px;
        }
        .${APPID}-form-input {
            width: 100%; padding: 6px 8px;
            background: #333; border: 1px solid #555; border-radius: 4px;
            color: #fff; box-sizing: border-box;
        }
        .${APPID}-form-input:focus {
            border-color: #007bff; outline: none;
        }
        .${APPID}-checkbox-wrapper {
            display: flex; align-items: center; gap: 8px;
        }
        .${APPID}-btn {
            padding: 6px 16px; border-radius: 4px; border: none;
            cursor: pointer; font-size: 14px; font-weight: 500;
            transition: background 0.2s;
        }
        .${APPID}-btn-primary {
            background: #007bff; color: white;
        }
        .${APPID}-btn-primary:hover { background: #0056b3; }
        .${APPID}-btn-secondary {
            background: #555; color: white;
        }
        .${APPID}-btn-secondary:hover { background: #444; }

        /* New Styles for Preview and Warning */
        .${APPID}-input-preview-label {
            display: block; font-size: 0.85em; color: #888; margin-top: 12px;
        }
        .${APPID}-input-preview-content {
            display: block; font-size: 1.2em; color: #eee; margin-top: 4px; font-family: monospace; word-break: break-all;
            transition: color 0.2s;
        }
        .${APPID}-preview-valid {
            color: #4cd964 !important; /* Pastel Green for valid state */
        }
        .${APPID}-preview-error {
            color: #ff6b6b !important; /* Soft Red for error (forbidden chars) */
        }
        .${APPID}-preview-fallback {
            color: #ffb74d !important; /* Soft Orange for fallback state */
        }
        .${APPID}-text-warning {
            display: none; font-size: 0.85em; color: #ffc107; margin-top: 4px;
        }
    `;

    // =================================================================================
    // SECTION: Icon Definitions
    // =================================================================================

    const BASE_ICON_PROPS = {
        xmlns: 'http://www.w3.org/2000/svg',
        height: '24px',
        viewBox: '0 0 24 24',
        width: '24px',
        fill: '#e3e3e3',
    };
    const ICONS = {
        DOWNLOAD: {
            tag: 'svg',
            props: BASE_ICON_PROPS,
            children: [
                { tag: 'path', props: { d: 'M0 0h24v24H0V0z', fill: 'none' } },
                { tag: 'path', props: { d: 'M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z' } },
            ],
        },
        SPINNER: {
            tag: 'svg',
            props: { ...BASE_ICON_PROPS, class: `${APPID}-spinner` },
            children: [
                { tag: 'path', props: { d: 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18A8,8,0,1,1,20,12,8,8,0,0,1,12,20Z', opacity: '0.3' } },
                { tag: 'path', props: { d: 'M12,2A10,10,0,0,1,22,12h-2A8,8,0,0,0,12,4Z' } },
            ],
        },
        SUCCESS: {
            tag: 'svg',
            props: BASE_ICON_PROPS,
            children: [
                { tag: 'path', props: { d: 'M0 0h24v24H0V0z', fill: 'none' } },
                { tag: 'path', props: { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' } },
            ],
        },
        ERROR: {
            tag: 'svg',
            props: BASE_ICON_PROPS,
            children: [
                { tag: 'path', props: { d: 'M0 0h24v24H0V0z', fill: 'none' } },
                { tag: 'path', props: { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' } },
            ],
        },
        OPEN_IN_NEW: {
            tag: 'svg',
            props: BASE_ICON_PROPS,
            children: [
                { tag: 'path', props: { d: 'M0 0h24v24H0V0z', fill: 'none' } },
                { tag: 'path', props: { d: 'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z' } },
            ],
        },
    };

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
    // SECTION: General Utilities
    // =================================================================================

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

    /**
     * Recursively builds a DOM element from a definition object using the h() function.
     * @param {object} def The definition object for the element.
     * @returns {HTMLElement | SVGElement | null} The created DOM element.
     */
    function createIconFromDef(def) {
        if (!def) return null;
        const children = def.children ? def.children.map((child) => createIconFromDef(child)) : [];
        return h(def.tag, def.props, children);
    }

    const CACHED_ICONS = (() => {
        const cache = {};
        for (const key in ICONS) {
            cache[key] = createIconFromDef(ICONS[key]);
        }
        return cache;
    })();

    /**
     * Helper function to check if an item is a non-array object.
     * @param {*} item The item to check.
     * @returns {boolean}
     */
    function isObject(item) {
        return !!(item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * Creates a deep copy of a JSON-serializable object.
     * @template T
     * @param {T} obj The object to clone.
     * @returns {T} The deep copy of the object.
     */
    function deepClone(obj) {
        return structuredClone(obj);
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
     * Formats a UNIX timestamp into a YYYYMMDD_HHMMSS string.
     * @param {number} timestamp - The UNIX timestamp (in seconds).
     * @returns {string} The formatted date string.
     */
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const Y = date.getFullYear();
        const M = String(date.getMonth() + 1).padStart(2, '0');
        const D = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${Y}${M}${D}_${h}${m}${s}`;
    }

    /**
     * Safely extracts the file extension (including the dot) from a URL.
     * Considers query parameters and hashes.
     * @param {string} url - The URL to parse.
     * @returns {string} The extension (e.g., ".mp4") or an empty string if not found.
     */
    function getExtension(url) {
        try {
            // Use URL constructor to isolate pathname, ignoring query/hash
            const pathname = new URL(url).pathname;

            // Find the last dot
            const lastDotIndex = pathname.lastIndexOf('.');

            // If no dot is found, or if it's the first character (e.g., "/.config"),
            // it's not a valid extension for our purpose.
            if (lastDotIndex < 1) {
                return ''; // No extension found
            }

            // Return the substring from the last dot to the end.
            return pathname.substring(lastDotIndex); // e.g., ".mp4"
        } catch (e) {
            Logger.warn('Could not parse URL to get extension:', url, e);
            return ''; // Return empty on URL parsing failure
        }
    }

    /**
     * Resolves a filename template with provided replacements, handling sanitization.
     * @param {string} template - The filename template (e.g., "{user}_{date}_{id}").
     * @param {Object<string, string>} replacements - Key-value pairs for replacements.
     * @returns {string} The resolved and sanitized filename.
     */
    function resolveFilename(template, replacements) {
        // 1. Validate bracket checks (simple balance check for {})
        const openCount = (template.match(/\{/g) || []).length;
        const closeCount = (template.match(/\}/g) || []).length;

        let validTemplate = template;
        // Fallback to default if brackets are unbalanced
        if (openCount !== closeCount) {
            Logger.warn('Filename template has unbalanced brackets. Falling back to default.');
            validTemplate = '{user}_{date}_{id}';
        }

        // 2. Replace placeholders
        let result = validTemplate.replace(/\{(\w+)\}/g, (match, key) => {
            // If key exists in replacements, use it (even if empty string).
            // If key does NOT exist in replacements, keep the original placeholder string.
            if (Object.prototype.hasOwnProperty.call(replacements, key)) {
                const val = replacements[key];
                return val ? String(val) : '';
            }
            return match;
        });

        // 3. Sanitize
        // Step A: Remove forbidden characters (Windows/Linux/macOS safe)
        // Removes only OS reserved characters: < > : " / \ | ? *
        result = result.replace(/[<>:"/\\|?*]/g, '');

        // Step B: Replace consecutive separators (space, underscore, hyphen, dot) with a single instance of the first match.
        // This prevents double underscores like "__" or "_-_" when a placeholder is empty.
        result = result.replace(/([ _.-])\1+/g, '$1');

        // Remove separators from start and end
        result = result.replace(/^[ _.-]+|[ _.-]+$/g, '');

        // Fallback if result becomes empty (unlikely but possible if all data is missing)
        if (!result) {
            result = 'video';
        }

        return result;
    }

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
            EVENTS.UI_REPOSITION,
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
         * Processes all functions in the UI work queue.
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
     * @param {string} eventName The full event name from the EVENTS constant (e.g., 'EVENTS.NAVIGATION').
     * @returns {string} A key in the format 'ClassName.purpose'.
     */
    function createEventKey(context, eventName) {
        // Extract a meaningful 'purpose' from the event name
        const parts = eventName.split(':');
        const purpose = parts.length > 1 ? parts.slice(1).join('_') : parts[0]; // Use underscores if there are multiple parts after the first colon

        if (!context || !context.constructor || !context.constructor.name) {
            // Fallback for contexts where constructor name might not be available
            return `UnknownContext.${purpose}`;
        }
        return `${context.constructor.name}.${purpose}`;
    }

    // =================================================================================
    // SECTION: Configuration Management
    // =================================================================================

    const ConfigProcessor = {
        /**
         * Processes and sanitizes an entire configuration object.
         * @param {object|null} userConfig The user configuration object (partial or full).
         * @returns {object} The complete, sanitized configuration object.
         */
        process(userConfig) {
            // 1. Start with a deep copy of the defaults.
            const completeConfig = deepClone(DEFAULT_CONFIG);

            if (userConfig) {
                // 2. Merge user config
                resolveConfig(completeConfig, userConfig);
            }

            return completeConfig;
        },
    };

    class ConfigManager {
        constructor() {
            /** @type {object|null} */
            this.config = null;
        }

        /**
         * Loads the configuration from storage asynchronously.
         * Assumes the configuration is stored as a JSON string.
         * @returns {Promise<void>}
         */
        async load() {
            const raw = await GM.getValue(CONSTANTS.CONFIG_KEY, null);
            let userConfig = null;
            if (raw) {
                try {
                    userConfig = JSON.parse(raw);
                } catch (e) {
                    Logger.error('Failed to parse configuration. Using default settings.', e);
                }
            }
            this.config = ConfigProcessor.process(userConfig);
            // Apply logger level immediately
            Logger.setLevel(this.config.developer.logger_level);
        }

        /**
         * Saves the configuration object to storage as a JSON string.
         * @param {object} newConfig The configuration object to save.
         * @returns {Promise<void>}
         */
        async save(newConfig) {
            const completeConfig = ConfigProcessor.process(newConfig);
            await GM.setValue(CONSTANTS.CONFIG_KEY, JSON.stringify(completeConfig));
            this.config = completeConfig;

            // Apply new settings
            Logger.setLevel(this.config.developer.logger_level);

            // Notify other components
            EventBus.publish(EVENTS.CONFIG_UPDATED, this.config);
            EventBus.publish(EVENTS.CONFIG_SAVE_SUCCESS);
        }

        /**
         * @returns {object} The current configuration object.
         */
        get() {
            return this.config || deepClone(DEFAULT_CONFIG);
        }
    }

    // =================================================================================
    // SECTION: Settings Modal
    // =================================================================================

    class SettingsModal {
        /**
         * @param {ConfigManager} configManager
         */
        constructor(configManager) {
            this.configManager = configManager;
            this.overlay = null;
            // Bind the keydown handler once to ensure consistent reference for add/removeEventListener
            this._boundHandleKeyDown = this._handleKeyDown.bind(this);
        }

        /**
         * Opens the settings modal.
         */
        open() {
            if (this.overlay) return;
            const config = this.configManager.get();

            // Create input elements
            const filenameInput = h(`input#${APPID}-input-filename.${APPID}-form-input`, {
                type: 'text',
                value: config.download.filenameTemplate,
            });

            const warningText = h(`div#${APPID}-warning-text.${APPID}-text-warning`, 'Forbidden characters will be removed.');
            const previewLabel = h(`div.${APPID}-input-preview-label`, 'Preview:');
            const previewContent = h(`div#${APPID}-preview-content.${APPID}-input-preview-content`, '');

            // Attach input listener for real-time preview
            filenameInput.addEventListener('input', () => {
                this._updatePreview(filenameInput.value, warningText, previewContent);
            });

            this.overlay = h(
                `div.${APPID}-modal-overlay`,
                {
                    // Click handler for closing when clicking outside (on the overlay)
                    onclick: (e) => {
                        if (e.target === this.overlay) this.close();
                    },
                },
                [
                    h(`div.${APPID}-modal-box`, [
                        // Header
                        h(`div.${APPID}-modal-header`, [h('span', `${APPNAME} Settings`)]),
                        // Content
                        h(`div.${APPID}-modal-content`, [
                            this._createFormGroup(
                                'Filename Template',
                                null, // Desc is moved inside the control wrapper
                                // Wrap input and feedback elements together
                                h('div', [h(`div.${APPID}-form-desc`, 'Available placeholders: {user}, {date}, {id}'), filenameInput, warningText, previewLabel, previewContent])
                            ),
                            this._createFormGroup(
                                'Appearance',
                                '',
                                h(`label.${APPID}-checkbox-wrapper`, [
                                    h(`input#${APPID}-input-hover`, {
                                        type: 'checkbox',
                                        checked: config.common.showOnlyOnHover,
                                    }),
                                    h('span', 'Show buttons only on hover (Desktop)'),
                                ])
                            ),
                            this._createFormGroup(
                                'Functionality',
                                '',
                                h(`label.${APPID}-checkbox-wrapper`, [
                                    h(`input#${APPID}-input-newtab`, {
                                        type: 'checkbox',
                                        checked: config.openInNewTab.enabled,
                                    }),
                                    h('span', 'Enable "Open in New Tab" button'),
                                ])
                            ),
                        ]),
                        // Footer
                        h(`div.${APPID}-modal-footer`, [
                            // Left: Restore Defaults
                            h(`button.${APPID}-btn.${APPID}-btn-secondary`, { onclick: () => this._restoreDefaults() }, 'Restore Defaults'),
                            // Right: Actions
                            h(`div.${APPID}-footer-actions`, [
                                h(`button.${APPID}-btn.${APPID}-btn-secondary`, { onclick: () => this.close() }, 'Cancel'),
                                h(`button.${APPID}-btn.${APPID}-btn-primary`, { onclick: () => this.save() }, 'Save'),
                            ]),
                        ]),
                    ]),
                ]
            );

            document.body.appendChild(this.overlay);

            // Add global key listener for ESC
            document.addEventListener('keydown', this._boundHandleKeyDown);

            // Trigger initial preview
            this._updatePreview(filenameInput.value, warningText, previewContent);

            // Set initial focus
            filenameInput.focus();
        }

        /**
         * Closes the settings modal.
         */
        close() {
            if (this.overlay) {
                // Remove global key listener
                document.removeEventListener('keydown', this._boundHandleKeyDown);

                this.overlay.remove();
                this.overlay = null;
            }
        }

        /**
         * Saves the current settings from the form.
         */
        async save() {
            const newConfig = this.configManager.get();

            // Collect values from DOM
            const filenameInput = document.getElementById(`${APPID}-input-filename`);
            const hoverInput = document.getElementById(`${APPID}-input-hover`);
            const newTabInput = document.getElementById(`${APPID}-input-newtab`);

            if (filenameInput) newConfig.download.filenameTemplate = filenameInput.value;
            if (hoverInput) newConfig.common.showOnlyOnHover = hoverInput.checked;
            if (newTabInput) newConfig.openInNewTab.enabled = newTabInput.checked;

            await this.configManager.save(newConfig);
            this.close();
        }

        /**
         * Updates the preview text and warning based on the input template.
         * @private
         */
        _updatePreview(template, warningEl, previewEl) {
            const dummyReplacements = {
                user: 'RedGifsOfficial',
                date: '20250101_120000',
                id: 'watchfulwaiting',
            };

            // Resolve filename using dummy data
            const resolved = resolveFilename(template, dummyReplacements);
            // Append example extension
            const previewFilename = `${resolved}.mp4`;

            // Reset classes and state
            previewEl.classList.remove(`${APPID}-preview-valid`, `${APPID}-preview-error`, `${APPID}-preview-fallback`);
            warningEl.style.display = 'none';
            warningEl.textContent = '';

            // 1. Check for fallback triggers (Unbalanced brackets or Empty)
            // Note: resolveFilename handles this internally, but we check here to provide UI feedback.
            const openCount = (template.match(/\{/g) || []).length;
            const closeCount = (template.match(/\}/g) || []).length;
            const isUnbalanced = openCount !== closeCount;
            const isEmpty = !template || template.trim().length === 0;

            if (isUnbalanced || isEmpty) {
                previewEl.classList.add(`${APPID}-preview-fallback`);
                warningEl.style.display = 'block';
                if (isEmpty) {
                    warningEl.textContent = "Template is empty. Using 'video' as fallback.";
                } else {
                    warningEl.textContent = 'Unbalanced brackets. Reverted to default.';
                }
                previewEl.textContent = previewFilename;
                return;
            }

            // 2. Check for forbidden characters
            const forbiddenRegex = /[<>:"/\\|?*]/;
            const hasForbidden = forbiddenRegex.test(template);

            if (hasForbidden) {
                previewEl.classList.add(`${APPID}-preview-error`);
                warningEl.style.display = 'block';
                warningEl.textContent = 'Forbidden characters (< > : " / \\ | ? *) will be removed.';
                previewEl.textContent = previewFilename;
                return;
            }

            // 3. Valid State
            previewEl.classList.add(`${APPID}-preview-valid`);
            previewEl.textContent = previewFilename;
        }

        /**
         * Restores default settings to the form inputs.
         * @private
         */
        _restoreDefaults() {
            // Restore Filename Template
            const filenameInput = document.getElementById(`${APPID}-input-filename`);
            if (filenameInput) {
                filenameInput.value = DEFAULT_CONFIG.download.filenameTemplate;
                // Trigger preview update manually since programmatic change doesn't fire 'input' event
                const warningText = document.getElementById(`${APPID}-warning-text`);
                const previewContent = document.getElementById(`${APPID}-preview-content`);
                if (warningText && previewContent) {
                    this._updatePreview(filenameInput.value, warningText, previewContent);
                }
            }

            // Restore Checkboxes
            const hoverInput = document.getElementById(`${APPID}-input-hover`);
            if (hoverInput) {
                hoverInput.checked = DEFAULT_CONFIG.common.showOnlyOnHover;
            }

            const newTabInput = document.getElementById(`${APPID}-input-newtab`);
            if (newTabInput) {
                newTabInput.checked = DEFAULT_CONFIG.openInNewTab.enabled;
            }
        }

        /**
         * Handles global keydown events.
         * @private
         */
        _handleKeyDown(e) {
            if (e.key === 'Escape') {
                this.close();
            }
        }

        /**
         * Helper to create a labeled form group.
         * @private
         */
        _createFormGroup(label, desc, control) {
            return h(`div.${APPID}-form-group`, [h(`label.${APPID}-form-label`, label), control, desc ? h(`div.${APPID}-form-desc`, desc) : null]);
        }
    }

    // =================================================================================
    // SECTION: API Manager
    // =================================================================================

    class ApiManager {
        /**
         * Extracts the video ID from a 'gif' object in the API response.
         * @param {object} gif - The gif object from the API.
         * @returns {string|undefined} The video ID.
         */
        static #API_GIF_ID_EXTRACTOR = (gif) => gif?.id;

        /**
         * Extracts the HD video URL from a 'gif' object in the API response.
         * @param {object} gif - The gif object from the API.
         * @returns {string|undefined} The HD URL.
         */
        static #API_GIF_HD_URL_EXTRACTOR = (gif) => gif?.urls?.hd;

        /**
         * Extracts the User Name from a 'gif' object in the API response.
         * @param {object} gif - The gif object from the API.
         * @returns {string|undefined} The User Name.
         */
        static #API_GIF_USERNAME_EXTRACTOR = (gif) => gif?.userName;

        /**
         * Extracts the Create Date (timestamp) from a 'gif' object in the API response.
         * @param {object} gif - The gif object from the API.
         * @returns {number|undefined} The creation timestamp.
         */
        static #API_GIF_CREATEDATE_EXTRACTOR = (gif) => gif?.createDate;

        constructor() {
            /** @type {Map<string, {hdUrl: string, userName: string, createDate: number}>} */
            this.videoCache = new Map();
            this._initJsonInterceptor();
        }

        /**
         * Gets the cached Video Info for a given video ID.
         * @param {string} videoId The ID of the video.
         * @returns {{hdUrl: string, userName: string, createDate: number}|undefined} The cached info object or undefined if not found.
         */
        getCachedVideoInfo(videoId) {
            // Normalize ID to lowercase for cache lookup
            return this.videoCache.get(videoId.toLowerCase());
        }

        /**
         * Sets up JSON.parse interceptor to capture API responses.
         * @private
         */
        _initJsonInterceptor() {
            const originalJsonParse = JSON.parse;
            const self = this; // Preserve ApiManager instance for use in the closure

            JSON.parse = function (text, reviver) {
                // Pass through to the original parser first
                const result = originalJsonParse.call(this, text, reviver);

                try {
                    // 1. Check if the result is an object
                    if (result && typeof result === 'object') {
                        // 2. Check for the specific keys we care about (result.gifs or result.gif)
                        if (Array.isArray(result.gifs) || (result.gif && typeof result.gif === 'object')) {
                            // 3. If it matches, process the data
                            self._processApiData(result);
                        }
                    }
                } catch (error) {
                    Logger.error('Error during JSON.parse interception:', error, result);
                }

                // Always return the original result
                return result;
            };
        }

        /**
         * Processes the parsed API data to cache video URLs.
         * @param {object} data The parsed JSON data from the API.
         * @private
         */
        _processApiData(data) {
            try {
                // Handle both single 'gif' object (watch page) and 'gifs' array (feeds)
                const gifsToProcess = [];
                if (data && Array.isArray(data.gifs)) {
                    gifsToProcess.push(...data.gifs);
                }
                // Also check for the single 'gif' object
                if (data && data.gif && typeof data.gif === 'object') {
                    gifsToProcess.push(data.gif);
                }

                // Check if we have any gifs to process
                if (gifsToProcess.length > 0) {
                    let count = 0;
                    for (const gif of gifsToProcess) {
                        // Use internal static extractors
                        // Extractors are null-safe (e.g., gif?.id)
                        const videoId = ApiManager.#API_GIF_ID_EXTRACTOR(gif);
                        const hdUrl = ApiManager.#API_GIF_HD_URL_EXTRACTOR(gif);

                        // Only require videoId and hdUrl to cache.
                        if (videoId && hdUrl) {
                            // Normalize ID to lowercase for cache storage to match HTML attributes
                            const normalizedId = videoId.toLowerCase();

                            if (!this.videoCache.has(normalizedId)) {
                                // Get optional metadata. These can be undefined.
                                const userName = ApiManager.#API_GIF_USERNAME_EXTRACTOR(gif);
                                const createDate = ApiManager.#API_GIF_CREATEDATE_EXTRACTOR(gif);

                                // Store the info object, possibly with undefined values.
                                this.videoCache.set(normalizedId, { hdUrl, userName, createDate });
                                count++;
                            }
                        }
                    }

                    // Log on successful processing
                    const path = '[JSON_PARSE]';

                    if (count > 0) {
                        Logger.badge('CACHE UPDATED', LOG_STYLES.BLUE, 'log', `${path} Added ${count} new items. Total: ${this.videoCache.size}`);
                    } else {
                        // Log if the feed contained items, but all were already cached.
                        Logger.badge('API HIT', LOG_STYLES.GREEN, 'log', `${path} (No new items added. Cache total: ${this.videoCache.size})`);
                    }
                }
                // If no gifs found (e.g., an empty feed or non-media API response), silently do nothing.
            } catch (error) {
                Logger.warn('Failed to process API data object:', error, data);
            }
        }
    }

    // =================================================================================
    // SECTION: UI Manager
    // =================================================================================

    class UIManager {
        /**
         * @param {ConfigManager} configManager
         */
        constructor(configManager) {
            this.subscriptions = [];
            /** @type {ConfigManager} */
            this.configManager = configManager;
            /** @type {HTMLElement|null} */
            this.toastContainer = null;

            // Subscribe to config updates to refresh styles dynamically
            this._subscribe(EVENTS.CONFIG_UPDATED, () => this.updateDynamicStyles());
        }

        /**
         * Helper to subscribe to EventBus events with automatic key management.
         * @param {string} event - The event name to subscribe to.
         * @param {Function} listener - The callback function.
         * @private
         */
        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        /**
         * Initializes the UI components that require the DOM.
         * Creates and appends the toast container to the document body.
         */
        init() {
            this._createToastContainer();
            this.injectStaticStyles();
            this.updateDynamicStyles();
        }

        /**
         * Injects the static CSS styles (UI templates + Modal styles).
         * These do not change during the session.
         */
        injectStaticStyles() {
            const id = `${APPID}-static-styles`;
            if (document.getElementById(id)) return;
            const styleElement = h('style', { id: id, type: 'text/css', 'data-owner': APPID }, UI_STYLES_TEMPLATE + MODAL_STYLES);
            document.head.appendChild(styleElement);
        }

        /**
         * Updates CSS styles that depend on configuration (e.g., showOnlyOnHover).
         * Called on init and when configuration changes.
         */
        updateDynamicStyles() {
            const config = this.configManager.get();
            const id = `${APPID}-dynamic-styles`;

            // Remove existing dynamic styles to re-apply
            let styleEl = document.getElementById(id);
            if (!styleEl) {
                styleEl = h('style', { id: id, type: 'text/css' });
                document.head.appendChild(styleEl);
            }

            // Define class names locally
            const CLS = {
                TILE_OPEN: `${APPID}-open-in-new-tab-btn`,
                TILE_DOWNLOAD: `${APPID}-tile-download-btn`,
                PREVIEW_OPEN: `${APPID}-preview-open-btn`,
                PREVIEW_DOWNLOAD: `${APPID}-preview-download-btn`,
            };

            let css = '';

            // Apply 'Show Only On Hover' logic
            if (config.common.showOnlyOnHover) {
                const createHoverStyle = (btnClass, parentSelector) => `
                    /* Default state: Hidden and non-clickable */
                    .${btnClass} {
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.2s ease-in-out;
                    }
                    /* Hover state: Visible and clickable */
                    ${parentSelector}:hover .${btnClass} {
                        opacity: 1;
                        pointer-events: auto;
                    }
                    /* Mobile: Always visible (force override) */
                    .App.phone .${btnClass} {
                        opacity: 1 !important;
                        pointer-events: auto !important;
                    }
                `;
                // Apply to all 4 button types
                css += createHoverStyle(CLS.TILE_OPEN, CONSTANTS.TILE_ITEM_SELECTOR);
                css += createHoverStyle(CLS.PREVIEW_OPEN, CONSTANTS.VIDEO_CONTAINER_SELECTOR);
                css += createHoverStyle(CLS.TILE_DOWNLOAD, CONSTANTS.TILE_ITEM_SELECTOR);
                css += createHoverStyle(CLS.PREVIEW_DOWNLOAD, CONSTANTS.VIDEO_CONTAINER_SELECTOR);
            }

            // Layout Adjustments (if Open in New Tab is disabled)
            if (!config.openInNewTab.enabled) {
                css += `
                    /* Move Download Button to top position */
                    .${CLS.TILE_DOWNLOAD} { top: 8px !important; }
                    .${CLS.PREVIEW_DOWNLOAD} { top: 8px !important; }
                    
                    /* Mobile adjustment for Preview */
                    .App.phone .${CLS.PREVIEW_DOWNLOAD} { top: 64px !important; }

                    /* Hide existing buttons if they exist in DOM (for immediate update without reload) */
                    .${CLS.TILE_OPEN}, .${CLS.PREVIEW_OPEN} { display: none !important; }
                `;
            }

            styleEl.textContent = css;
        }

        /**
         * Creates and appends the toast container to the document body.
         * @private
         */
        _createToastContainer() {
            this.toastContainer = h(`div.${APPID}-toast-container`);
            document.body.appendChild(this.toastContainer);
        }

        /**
         * Displays a toast notification.
         * @param {string} message The message to display.
         * @param {'info'|'success'|'error'} type The type of toast.
         */
        showToast(message, type) {
            if (!this.toastContainer) {
                Logger.error('Toast container element not found. Cannot display toast.');
                return;
            }

            const toastClass = `${APPID}-toast-${type}`;
            const toastElement = h(`div.${APPID}-toast`, { className: toastClass }, message);

            this.toastContainer.appendChild(toastElement);

            // Determine duration based on type
            const duration = type === 'error' ? CONSTANTS.TOAST_ERROR_DURATION : CONSTANTS.TOAST_DURATION;

            // Start the process to remove the toast after a delay.
            setTimeout(() => {
                toastElement.classList.add('exiting');

                // Set a second, final timeout to remove the element from the DOM.
                setTimeout(() => {
                    toastElement.remove();
                }, CONSTANTS.TOAST_FADE_OUT_DURATION);
            }, duration);
        }

        /**
         * A generic helper to create and append a button.
         * @param {object} options - The configuration for the button.
         * @param {HTMLElement} options.parentElement - The element to append the button to.
         * @param {string} options.className - The CSS class for the button.
         * @param {string} options.title - The button's tooltip text.
         * @param {string} options.iconName - The key of the icon in the ICONS object.
         * @param {(e: MouseEvent) => void} options.clickHandler - The function to call on click.
         */
        createButton({ parentElement, className, title, iconName, clickHandler }) {
            // Prevent duplicate buttons
            if (parentElement.querySelector(`.${className}`)) {
                return;
            }

            const button = h(`button.${className}`, {
                title: title,
                onclick: clickHandler,
            });

            this._setButtonIcon(button, iconName);
            parentElement.appendChild(button);
        }

        /**
         * Sets the icon for a given button.
         * @param {HTMLElement} button The button or anchor element to modify.
         * @param {'DOWNLOAD'|'SPINNER'|'SUCCESS'|'ERROR'|'OPEN_IN_NEW'} iconName The name of the icon to set.
         * @private
         */
        _setButtonIcon(button, iconName) {
            const cachedIcon = CACHED_ICONS[iconName];
            if (!cachedIcon) {
                Logger.error(`Icon "${iconName}" not found.`);
                return;
            }

            // Clear existing content
            while (button.firstChild) {
                button.removeChild(button.firstChild);
            }

            // Add new icon
            const newIcon = cachedIcon.cloneNode(true);
            if (newIcon) {
                button.appendChild(newIcon);
            }
        }

        /**
         * Updates the button's visual state and reverts it after a delay for transient states.
         * @param {HTMLButtonElement} button The button to update.
         * @param {'IDLE'|'LOADING_LOCKED'|'LOADING_CANCELLABLE'|'SUCCESS'|'ERROR'} state The new state.
         */
        updateButtonState(button, state) {
            const stateMap = {
                IDLE: { icon: 'DOWNLOAD', disabled: false },
                LOADING_LOCKED: { icon: 'SPINNER', disabled: true }, // Cancel lock
                LOADING_CANCELLABLE: { icon: 'SPINNER', disabled: false }, // Cancellable
                SUCCESS: { icon: 'SUCCESS', disabled: true },
                ERROR: { icon: 'ERROR', disabled: true },
            };

            const { icon, disabled } = stateMap[state] || stateMap.IDLE;
            this._setButtonIcon(button, icon);
            button.disabled = disabled;

            // Revert to IDLE state after a delay for success or error states.
            if (state === 'SUCCESS' || state === 'ERROR') {
                setTimeout(() => {
                    this.updateButtonState(button, 'IDLE');
                }, CONSTANTS.ICON_REVERT_DELAY);
            }
        }

        /**
         * A generic helper to create and append a link button (<a> tag).
         * @param {object} options - The configuration for the button.
         * @param {HTMLElement} options.parentElement - The element to append the button to.
         * @param {string} options.className - The CSS class for the button.
         * @param {string} options.title - The button's tooltip text.
         * @param {string} options.iconName - The key of the icon in the ICONS object.
         * @param {string} options.href - The URL the link points to.
         * @param {(e: MouseEvent) => void} [options.clickHandler] - Optional click handler (e.g., for stopPropagation).
         */
        createLinkButton({ parentElement, className, title, iconName, href, clickHandler }) {
            // Prevent duplicate buttons
            if (parentElement.querySelector(`.${className}`)) {
                return;
            }

            const button = h(`a.${className}`, {
                href: href,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: title,
                draggable: 'false', // Prevent dragging the link image
                onclick: clickHandler,
            });

            this._setButtonIcon(button, iconName);
            parentElement.appendChild(button);
        }
    }

    // =================================================================================
    // SECTION: Annoyance Manager
    // =================================================================================

    class AnnoyanceManager {
        /**
         * @private
         * @static
         * @const {string}
         */
        static STYLES = `
                /* --- RGVDB Annoyance Removal --- */

                /* Header: Link button to external site (Desktop) */
                .topNav .aTab {
                    display: none !important;
                }

                /* Information Bar (Top Banner) */
                .InformationBar {
                    display: none !important;
                }

                /* Ad Containers (:has() dependent) */
                .sideBarItem:has(.liveAdButton) {
                    display: none !important;
                }

                /* Feed Injections (Trending Niches/Creators, Ads, etc.) */
                .injection {
                    display: none !important;
                }

                /* Feed Modules (Suggested/Trending Niches, Suggested/Trending Creators, Mobile OF Creators, Niche Explorer) */
                /* Backward compatibility: Keep existing class-based selectors combined with new attribute-based selectors */
                .FeedModule:has(.nicheListWidget.trendingNiches),
                .FeedModule[data-feed-module-type="trending-niches"],
                .FeedModule:has(.seeMoreBlock.suggestedCreators),
                .FeedModule[data-feed-module-type="suggested-creators"],
                .FeedModule:has(.seeMoreBlock.trendingCreators),
                .FeedModule[data-feed-module-type="trending-creators"],
                .FeedModule:has(.OnlyFansCreatorsModule),
                .FeedModule[data-feed-module-type="only-fans"],
                .FeedModule:has(.nicheExplorer),
                .FeedModule[data-feed-module-type="suggested-niches"],
                .FeedModule[data-feed-module-type="live-cam"] {
                    display: none !important;
                }

                /* Sidebar: OnlyFans Creators (Desktop) */
                /* Use visibility:hidden to hide without affecting layout (prevents center feed shift) */
                .OnlyFansCreatorsSidebar {
                    visibility: hidden !important;
                }
            `;

        /**
         * Injects the annoyance removal CSS into the document's head.
         */
        injectStyles() {
            const styleElement = h('style', { type: 'text/css', 'data-owner': `${APPID}-annoyances` }, AnnoyanceManager.STYLES);
            document.head.appendChild(styleElement);
        }

        /**
         * Registers Sentinel observers to hide elements that cannot be hidden by CSS alone or require dynamic content injection.
         * @param {Sentinel} sentinel - The Sentinel instance.
         */
        removeElements(sentinel) {
            // Helper to hide ad containers (VisibleOnly elements often cause layout shifts or blank spaces)
            const adHider = (adElement) => {
                const adContainer = adElement.closest('.GifPreview.VisibleOnly');
                if (adContainer) {
                    // Do NOT use .remove() as it breaks the site's virtual DOM state.
                    // Use inline style to force hide.
                    adContainer.style.setProperty('display', 'none', 'important');
                }
            };

            // --- Unified Annoyance Hiding ---
            // Handles Live Cam streams (Streamate) on both Desktop and Mobile.
            // Selectors are updated to match current site structure (.StreamateCameraDispatcher).
            sentinel.on('.StreamateCameraDispatcher', adHider);
        }
    }

    // =================================================================================
    // SECTION: Sentinel (DOM Node Insertion Observer)
    // =================================================================================

    /**
     * @class Sentinel
     * @description Detects DOM node insertion using a shared, prefixed CSS animation trick.
     * @property {Map<string, Array<(element: Element) => void>>} listeners
     * @property {Set<string>} rules
     * @property {HTMLElement | null} styleElement
     * @property {CSSStyleSheet | null} sheet
     * @property {string[]} pendingRules
     * @property {WeakMap<CSSRule, string>} ruleSelectors
     */
    class Sentinel {
        /**
         * @param {string} prefix - A unique identifier for this Sentinel instance to avoid CSS conflicts. Required.
         */
        constructor(prefix) {
            if (!prefix) {
                throw new Error('[Sentinel] "prefix" argument is required to avoid CSS conflicts.');
            }

            /** @type {any} */
            const globalScope = window;
            globalScope.__global_sentinel_instances__ = globalScope.__global_sentinel_instances__ || {};
            if (globalScope.__global_sentinel_instances__[prefix]) {
                return globalScope.__global_sentinel_instances__[prefix];
            }

            // Use a unique, prefixed animation name shared by all scripts in a project.
            this.animationName = `${prefix}-global-sentinel-animation`;
            this.styleId = `${prefix}-sentinel-global-rules`; // A single, unified style element
            this.listeners = new Map();
            this.rules = new Set(); // Tracks all active selectors
            this.styleElement = null; // Holds the reference to the single style element
            this.sheet = null; // Cache the CSSStyleSheet reference
            this.pendingRules = []; // Queue for rules requested before sheet is ready
            /** @type {WeakMap<CSSRule, string>} */
            this.ruleSelectors = new WeakMap(); // Tracks selector strings associated with CSSRule objects

            this._injectStyleElement();
            document.addEventListener('animationstart', this._handleAnimationStart.bind(this), true);

            globalScope.__global_sentinel_instances__[prefix] = this;
        }

        _injectStyleElement() {
            // Ensure the style element is injected only once per project prefix.
            this.styleElement = document.getElementById(this.styleId);

            if (this.styleElement instanceof HTMLStyleElement) {
                this.sheet = this.styleElement.sheet;
                return;
            }

            // Create empty style element
            this.styleElement = h('style', {
                id: this.styleId,
            });

            // CSP Fix: Try to fetch a valid nonce from existing scripts/styles
            // "nonce" property exists on HTMLScriptElement/HTMLStyleElement, not basic Element.
            let nonce;
            const script = document.querySelector('script[nonce]');
            const style = document.querySelector('style[nonce]');

            if (script instanceof HTMLScriptElement) {
                nonce = script.nonce;
            } else if (style instanceof HTMLStyleElement) {
                nonce = style.nonce;
            }

            if (nonce) {
                this.styleElement.setAttribute('nonce', nonce);
            }

            // Try to inject immediately. If the document is not yet ready (e.g. extremely early document-start), wait for the root element.
            const target = document.head || document.documentElement;

            const initSheet = () => {
                if (this.styleElement instanceof HTMLStyleElement) {
                    this.sheet = this.styleElement.sheet;
                    // Insert the shared keyframes rule at index 0.
                    try {
                        const keyframes = `@keyframes ${this.animationName} { from { transform: none; } to { transform: none; } }`;
                        this.sheet.insertRule(keyframes, 0);
                    } catch (e) {
                        Logger.badge('SENTINEL', LOG_STYLES.RED, 'error', 'Failed to insert keyframes rule:', e);
                    }
                    this._flushPendingRules();
                }
            };

            if (target) {
                target.appendChild(this.styleElement);
                initSheet();
            } else {
                const observer = new MutationObserver(() => {
                    const retryTarget = document.head || document.documentElement;
                    if (retryTarget) {
                        observer.disconnect();
                        retryTarget.appendChild(this.styleElement);
                        initSheet();
                    }
                });
                observer.observe(document, { childList: true });
            }
        }

        _flushPendingRules() {
            if (!this.sheet || this.pendingRules.length === 0) return;

            const rulesToInsert = [...this.pendingRules];
            this.pendingRules = [];

            rulesToInsert.forEach((selector) => {
                this._insertRule(selector);
            });
        }

        /**
         * Helper to insert a single rule into the stylesheet
         * @param {string} selector
         */
        _insertRule(selector) {
            try {
                const index = this.sheet.cssRules.length;
                const ruleText = `${selector} { animation-duration: 0.001s; animation-name: ${this.animationName}; }`;
                this.sheet.insertRule(ruleText, index);

                // Associate the inserted rule with the selector via WeakMap for safer removal later.
                // This mimics sentinel.js behavior to handle index shifts and selector normalization.
                const insertedRule = this.sheet.cssRules[index];
                if (insertedRule) {
                    this.ruleSelectors.set(insertedRule, selector);
                }
            } catch (e) {
                Logger.badge('SENTINEL', LOG_STYLES.RED, 'error', `Failed to insert rule for selector "${selector}":`, e);
            }
        }

        _handleAnimationStart(event) {
            // Check if the animation is the one we're listening for.
            if (event.animationName !== this.animationName) return;

            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            // Check if the target element matches any of this instance's selectors.
            for (const [selector, callbacks] of this.listeners.entries()) {
                if (target.matches(selector)) {
                    // Use a copy of the callbacks array in case a callback removes itself.
                    [...callbacks].forEach((cb) => cb(target));
                }
            }
        }

        /**
         * @param {string} selector
         * @param {(element: Element) => void} callback
         */
        on(selector, callback) {
            // Add callback to listeners
            if (!this.listeners.has(selector)) {
                this.listeners.set(selector, []);
            }
            this.listeners.get(selector).push(callback);

            // If selector is already registered in rules, do nothing
            if (this.rules.has(selector)) return;

            this.rules.add(selector);

            // Apply rule
            if (this.sheet) {
                this._insertRule(selector);
            } else {
                this.pendingRules.push(selector);
            }
        }

        /**
         * @param {string} selector
         * @param {(element: Element) => void} callback
         */
        off(selector, callback) {
            const callbacks = this.listeners.get(selector);
            if (!callbacks) return;

            const newCallbacks = callbacks.filter((cb) => cb !== callback);

            if (newCallbacks.length === callbacks.length) {
                return; // Callback not found, do nothing.
            }

            if (newCallbacks.length === 0) {
                // Remove listener and rule
                this.listeners.delete(selector);
                this.rules.delete(selector);

                if (this.sheet) {
                    // Iterate backwards to avoid index shifting issues during deletion
                    for (let i = this.sheet.cssRules.length - 1; i >= 0; i--) {
                        const rule = this.sheet.cssRules[i];
                        // Check for recorded selector via WeakMap or fallback to selectorText match
                        const recordedSelector = this.ruleSelectors.get(rule);

                        if (recordedSelector === selector || (rule instanceof CSSStyleRule && rule.selectorText === selector)) {
                            this.sheet.deleteRule(i);
                            // We assume one rule per selector, so we can break after deletion
                            break;
                        }
                    }
                }
            } else {
                this.listeners.set(selector, newCallbacks);
            }
        }

        suspend() {
            if (this.styleElement instanceof HTMLStyleElement) {
                this.styleElement.disabled = true;
            }
            Logger.badge('SENTINEL', LOG_STYLES.GRAY, 'debug', 'Suspended.');
        }

        resume() {
            if (this.styleElement instanceof HTMLStyleElement) {
                this.styleElement.disabled = false;
            }
            Logger.badge('SENTINEL', LOG_STYLES.GRAY, 'debug', 'Resumed.');
        }
    }

    // =================================================================================
    // SECTION: Main Application Controller
    // =================================================================================

    /**
     * @typedef {object} ButtonConfig
     * @property {string} className - The CSS class for the button.
     * @property {string} title - The button's tooltip text.
     * @property {keyof ICONS} iconName - The key of the icon in the ICONS object.
     */
    class AppController {
        constructor() {
            /** @type {ConfigManager} */
            this.configManager = new ConfigManager();
            /** @type {ApiManager} */
            this.apiManager = new ApiManager();
            /** @type {UIManager} */
            this.ui = new UIManager(this.configManager); // Pass configManager to UIManager
            /** @type {AnnoyanceManager} */
            this.annoyanceManager = new AnnoyanceManager();
            /** @type {Map<string, AbortController>} */
            this.activeDownloads = new Map();
            /** @type {SettingsModal|null} */
            this.settingsModal = null;
        }

        /**
         * Initializes the script.
         */
        async init() {
            // 1. Load configuration asynchronously
            await this.configManager.load();

            // 2. Initialize Settings Modal and register menu command
            this.settingsModal = new SettingsModal(this.configManager);
            GM.registerMenuCommand('Open Settings', () => {
                this.settingsModal.open();
            });

            // 3. Inject annoyance removal styles
            this.annoyanceManager.injectStyles();

            // 4. Inject script UI (buttons, toast) styles
            this.ui.init();

            const sentinel = new Sentinel(OWNERID);

            // 5. Register JS-based annoyance removal
            this.annoyanceManager.removeElements(sentinel);

            /**
             * Registers a Sentinel observer.
             * @param {string} selector The CSS selector to observe.
             * @param {(element: Element) => void} handler The callback handler for found elements.
             */
            const registerObserver = (selector, handler) => {
                sentinel.on(selector, handler);
            };

            // Shared ID extractor for dataset-based IDs
            const getFeedId = (el) => {
                // ID is in 'data-feed-item-id'
                const feedId = el.dataset.feedItemId;
                // Filter out non-video items (e.g. 'feed-module-...') and normalize to lowercase
                if (feedId && !feedId.startsWith('feed-module-')) {
                    return feedId.toLowerCase();
                }
                // Fallback: Check for ID attribute if layout reverts or mixed
                // Tile IDs were just the ID, Preview IDs were 'gif_ID'
                if (el.id) {
                    const idPart = el.id.startsWith('gif_') ? el.id.split('_')[1] : el.id;
                    return idPart ? idPart.toLowerCase() : null;
                }
                return null;
            };

            // Set up the listener using Sentinel.
            // When Sentinel registers a new selector, it rewrites its stylesheet.
            // This triggers the animationstart event for both elements
            // that already exist in the DOM and elements added later.

            // Setup observer for Tile Items (Grid View)
            registerObserver(CONSTANTS.TILE_ITEM_SELECTOR, (element) => {
                this._onElementFound(element, getFeedId, CONSTANTS.CONTEXT_TYPE.TILE);
            });

            // Setup observer for Video Containers (Preview/Watch View)
            registerObserver(CONSTANTS.VIDEO_CONTAINER_SELECTOR, (element) => {
                this._onElementFound(element, getFeedId, CONSTANTS.CONTEXT_TYPE.PREVIEW);
            });

            Logger.log('Initialized and observing DOM for new content.');
        }

        /**
         * Generic handler for found elements (replaces _onTileItemFound and _onPreviewFound).
         * @param {HTMLElement} element The found DOM element.
         * @param {(element: HTMLElement) => string|null} idExtractor A function to extract the video ID from the element.
         * @param {string} type The context type of the element (from CONSTANTS.CONTEXT_TYPE).
         * @private
         */
        _onElementFound(element, idExtractor, type) {
            if (!element) {
                return;
            }

            const videoId = idExtractor(element);

            // Robust check: Ensure videoId is truthy (not null, undefined, or empty string)
            if (videoId) {
                this._addButtonsToElement(element, videoId, type);
            }
        }

        /**
         * Adds buttons to a given element.
         * @param {HTMLElement} element The parent element for the buttons.
         * @param {string} videoId The video ID associated with the buttons.
         * @param {string} type The context type (from CONSTANTS.CONTEXT_TYPE).
         * @private
         */
        _addButtonsToElement(element, videoId, type) {
            const isTile = type === CONSTANTS.CONTEXT_TYPE.TILE;

            // --- 1. Open in New Tab Button (Link) ---
            // Always create the button elements. Visibility is toggled via CSS based on settings.
            {
                const className = isTile ? `${APPID}-open-in-new-tab-btn` : `${APPID}-preview-open-btn`;
                const url = `${CONSTANTS.WATCH_URL_BASE}${videoId}`;

                this.ui.createLinkButton({
                    parentElement: element,
                    className: className,
                    title: 'Open in new tab',
                    iconName: 'OPEN_IN_NEW',
                    href: url,
                    clickHandler: (e) => e.stopPropagation(), // Only stop propagation to prevent parent navigation
                });
            }

            // --- 2. Download Button (Action) ---
            {
                const className = isTile ? `${APPID}-tile-download-btn` : `${APPID}-preview-download-btn`;
                const clickHandler = (e) => this._handleDownloadClick(e, videoId);

                this.ui.createButton({
                    parentElement: element,
                    className: className,
                    title: 'Download HD Video',
                    iconName: 'DOWNLOAD',
                    clickHandler: clickHandler,
                });
            }
        }

        /**
         * Handles the click event on the download button.
         * Manages download start, 1s lock, and cancellation.
         * @param {MouseEvent} e - The click event.
         * @param {string} videoId - The ID of the video to download.
         * @private
         */
        async _handleDownloadClick(e, videoId) {
            e.stopPropagation(); // Prevent parent elements from handling the click.

            const button = e.currentTarget;

            // --- 1. Cancellation Logic ---
            // Check if this videoId is already being downloaded
            if (this.activeDownloads.has(videoId)) {
                // If the button is disabled, it's in the 1s lock, ignore the click
                if (button.disabled) return;

                // Button is enabled (LOADING_CANCELLABLE), proceed with cancellation
                Logger.log(`Cancelling download for ${videoId}...`);
                const controller = this.activeDownloads.get(videoId);
                controller.abort(); // Trigger the abort signal

                // No need to delete from map here, the finally block in the original call will handle it.
                // No toast here for cancellation click, only log. Toast is shown if the fetch promise rejects with AbortError.
                this.ui.updateButtonState(button, 'IDLE'); // Reset button immediately
                return;
            }

            // --- 2. Download Start Logic ---
            if (button.disabled) return; // Should not happen if state is IDLE, but as a safeguard.

            const controller = new AbortController();
            this.activeDownloads.set(videoId, controller);

            // Set state to LOADING_LOCKED (Spinner, disabled: true)
            this.ui.updateButtonState(button, 'LOADING_LOCKED');
            this.ui.showToast('Download started...', 'info');

            // Transition to cancellable state
            setTimeout(() => {
                // Only transition if the download is still active
                if (this.activeDownloads.has(videoId)) {
                    this.ui.updateButtonState(button, 'LOADING_CANCELLABLE');
                }
            }, CONSTANTS.CANCEL_LOCK_DURATION);

            try {
                // --- 2a. Check Cache ---
                const videoInfo = this.apiManager.getCachedVideoInfo(videoId);

                if (videoInfo) {
                    // --- 2b. [Cache Hit] Execute Download ---
                    Logger.badge('CACHE HIT', LOG_STYLES.LOG, 'log', `Starting download for ${videoId}`);
                    await this._executeDownload(videoInfo, videoId, controller.signal);

                    // --- 2c. Handle Success ---
                    this.ui.updateButtonState(button, 'SUCCESS');
                    this.ui.showToast('Download successful!', 'success');
                    Logger.log(`Downloaded ${videoId} from:`, videoInfo.hdUrl);
                } else {
                    // --- 2d. [Cache Miss] Handle Failure ---
                    Logger.warn(`Video info not found in cache for ${videoId}.`);
                    this.ui.showToast('Video info not found in cache. (Try scrolling or refreshing)', 'error');
                    this.ui.updateButtonState(button, 'ERROR');
                }
            } catch (error) {
                // --- 2e. Handle Errors (including AbortError) ---
                if (error.name === 'AbortError') {
                    // Handle cancellation specifically (when the promise rejects)
                    Logger.log(`Download process for ${videoId} was aborted.`);
                    this.ui.showToast('Download cancelled.', 'info');
                    // Button state should be reset by the click handler that initiated the abort
                    // If the abort happened for other reasons (e.g., page navigation), this ensures cleanup
                    if (this.activeDownloads.has(videoId)) {
                        // Check if cleanup is needed
                        this.ui.updateButtonState(button, 'IDLE');
                    }
                } else if (error.status === 404) {
                    Logger.warn(`Download failed: Not Found (404) for ${videoId}`, error);
                    this.ui.showToast('Video not found (404).', 'error');
                    this.ui.updateButtonState(button, 'ERROR');
                } else if (error.status === 403) {
                    Logger.warn(`Download failed: Forbidden (403) for ${videoId}`, error);
                    this.ui.showToast('Access forbidden (403).', 'error');
                    this.ui.updateButtonState(button, 'ERROR');
                } else {
                    // Handle all other errors (API, Download, Network, 5xx, etc.) uniformly
                    Logger.error('Download failed:', error); // Keep existing detailed log for developer

                    const userErrorMessage = 'Download failed. (Network error or site update?)';

                    this.ui.showToast(userErrorMessage, 'error'); // Show unified message to user
                    this.ui.updateButtonState(button, 'ERROR'); // Update button state
                }
            } finally {
                // --- 3. Cleanup ---
                // Always remove the task from the map when the process finishes (success, error, or abort)
                this.activeDownloads.delete(videoId);
            }
        }

        /**
         * Performs the actual download process (file save).
         * @param {{hdUrl: string, userName: string|undefined, createDate: number|undefined}} videoInfo - The video info object from the cache.
         * @param {string} videoId - The ID of the video to download (for filename).
         * @param {AbortSignal} signal - The AbortSignal to cancel the fetch operations.
         * @returns {Promise<void>}
         * @private
         */
        async _executeDownload(videoInfo, videoId, signal) {
            const config = this.configManager.get();
            // --- A. Get Video Info ---
            const { hdUrl, userName, createDate } = videoInfo;
            const downloadUrl = hdUrl;

            // --- B. Resolve Filename ---
            const dateString = createDate && typeof createDate === 'number' ? formatTimestamp(createDate) : '';

            const replacements = {
                user: userName || '',
                date: dateString,
                id: videoId || '',
            };

            const baseFilename = resolveFilename(config.download.filenameTemplate, replacements);

            // --- Dynamic Extension ---
            let extension = getExtension(hdUrl);

            if (!extension) {
                Logger.warn(`Could not determine extension from URL. Defaulting to '.mp4'. URL:`, hdUrl);
                extension = '.mp4'; // Fallback to ".mp4" if extraction fails
            }

            // The _downloadFile method will sanitize this filename further if needed.
            const filename = `${baseFilename}${extension}`;

            // --- C. Download File ---
            await this._downloadFile(downloadUrl, filename, signal);
        }

        /**
         * Initiates a download for the given URL using fetch and saves the file.
         * @param {string} url The URL of the video to download.
         * @param {string} filename The desired filename for the downloaded video.
         * @param {AbortSignal} [signal] - An optional AbortSignal to cancel the request.
         * @returns {Promise<void>}
         * @private
         */
        async _downloadFile(url, filename, signal) {
            const response = await fetch(url, { signal }); // Pass signal to fetch
            // Throw a more user-friendly error message for HTTP errors.
            if (!response.ok) {
                const err = new Error(`Server responded with ${response.status}`);
                err.status = response.status;
                throw err;
            }

            const videoBlob = await response.blob();
            let objectUrl = null;
            let link = null;
            try {
                objectUrl = URL.createObjectURL(videoBlob);
                link = h('a', {
                    href: objectUrl,
                    download: filename,
                });
                document.body.appendChild(link);
                link.click();
            } finally {
                if (link) {
                    document.body.removeChild(link);
                }
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                }
            }
        }
    }

    // =================================================================================
    // SECTION: Entry Point
    // =================================================================================

    if (ExecutionGuard.hasExecuted()) return;
    ExecutionGuard.setExecuted();

    // 1. Instantiate controller immediately at document-start.
    // The constructor sets up the JSON.parse interceptor (ApiManager).
    const app = new AppController();

    // 2. Defer the UI initialization (init()) until the DOM is ready, as UIManager and Sentinel need access to document.body.
    // init() is now async because it loads configuration first.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            app.init().catch((e) => {
                Logger.error('Failed to initialize app:', e);
            });
        });
    } else {
        // Already 'interactive' or 'complete'
        app.init().catch((e) => {
            Logger.error('Failed to initialize app:', e);
        });
    }
})();
