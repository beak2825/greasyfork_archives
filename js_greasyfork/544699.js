// ==UserScript==
// @name         Quick-Text-Buttons
// @namespace    https://github.com/p65536
// @version      3.0.0
// @license      MIT
// @description  Adds customizable buttons to paste predefined text into the input field on ChatGPT/Gemini.
// @icon         https://raw.githubusercontent.com/p65536/p65536/main/images/qtb.svg
// @author       p65536
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/544699/Quick-Text-Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/544699/Quick-Text-Buttons.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // =================================================================================
    // SECTION: Script-Specific Definitions (DO NOT COPY TO OTHER PLATFORM)
    // =================================================================================

    const OWNERID = 'p65536';
    const APPID = 'qtbux';
    const APPNAME = 'Quick Text Buttons';
    const LOG_PREFIX = `[${APPID.toUpperCase()}]`;

    // =================================================================================
    // SECTION: Logging Utility
    // Description: Centralized logging interface for consistent log output across modules.
    //              Handles log level control, message formatting, and console API wrapping.
    // =================================================================================

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
         * Defines the available badge styles.
         * @property {object} styles
         */
        static styles = {
            BASE: 'color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
            RED: 'background: #dc3545;',
            YELLOW: 'background: #ffc107; color: black;',
            GREEN: 'background: #28a745;',
            BLUE: 'background: #007bff;',
            GRAY: 'background: #6c757d;',
            ORANGE: 'background: #fd7e14;',
            PINK: 'background: #e83e8c;',
            PURPLE: 'background: #6f42c1;',
            CYAN: 'background: #17a2b8; color: black;',
            TEAL: 'background: #20c997; color: black;',
        };

        /**
         * Maps log levels to default badge styles.
         * @private
         */
        static _defaultStyles = {
            error: this.styles.RED,
            warn: this.styles.YELLOW,
            info: this.styles.BLUE,
            log: this.styles.GREEN,
            debug: this.styles.GRAY,
        };

        /**
         * Sets the current log level.
         * @param {string} level The new log level. Must be one of 'error', 'warn', 'info', 'log', 'debug'.
         */
        static setLevel(level) {
            if (Object.prototype.hasOwnProperty.call(this.levels, level)) {
                this.level = level;
            } else {
                // Use default style (empty string) for the badge
                this._out('warn', 'INVALID LEVEL', '', `Invalid log level "${level}". Valid levels are: ${Object.keys(this.levels).join(', ')}. Level not changed.`);
            }
        }

        /**
         * Internal method to output logs if the level permits.
         * @private
         * @param {string} level - The log level ('error', 'warn', 'info', 'log', 'debug').
         * @param {string} badgeText - The text inside the badge. If empty, no badge is shown.
         * @param {string} badgeStyle - The background-color style (from Logger.styles). If empty, uses default.
         * @param {...any} args - The messages to log.
         */
        static _out(level, badgeText, badgeStyle, ...args) {
            if (this.levels[this.level] >= this.levels[level]) {
                const consoleMethod = console[level] || console.log;

                if (badgeText !== '') {
                    // Badge mode: Use %c formatting
                    let style = badgeStyle;
                    if (style === '') {
                        style = this._defaultStyles[level] || this.styles.GRAY;
                    }
                    const combinedStyle = `${this.styles.BASE} ${style}`;

                    consoleMethod(
                        `%c${LOG_PREFIX}%c %c${badgeText}%c`,
                        'font-weight: bold;', // Style for the prefix
                        'color: inherit;', // Reset for space
                        combinedStyle, // Style for the badge
                        'color: inherit;', // Reset for the rest of the message
                        ...args
                    );
                } else {
                    // No badge mode: Direct output for better object inspection
                    consoleMethod(LOG_PREFIX, ...args);
                }
            }
        }

        /**
         * Internal method to start a log group if the level permits (debug or higher).
         * @private
         * @param {'group'|'groupCollapsed'} method - The console method to use.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static _groupOut(method, badgeText, badgeStyle, ...args) {
            if (this.levels[this.level] >= this.levels.debug) {
                const consoleMethod = console[method];

                if (badgeText !== '') {
                    let style = badgeStyle;
                    if (style === '') {
                        style = this.styles.GRAY;
                    }
                    const combinedStyle = `${this.styles.BASE} ${style}`;

                    consoleMethod(`%c${LOG_PREFIX}%c %c${badgeText}%c`, 'font-weight: bold;', 'color: inherit;', combinedStyle, 'color: inherit;', ...args);
                } else {
                    consoleMethod(LOG_PREFIX, ...args);
                }
            }
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static error(badgeText, badgeStyle, ...args) {
            this._out('error', badgeText, badgeStyle, ...args);
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static warn(badgeText, badgeStyle, ...args) {
            this._out('warn', badgeText, badgeStyle, ...args);
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static info(badgeText, badgeStyle, ...args) {
            this._out('info', badgeText, badgeStyle, ...args);
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static log(badgeText, badgeStyle, ...args) {
            this._out('log', badgeText, badgeStyle, ...args);
        }

        /**
         * Logs messages for debugging. Only active in 'debug' level.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static debug(badgeText, badgeStyle, ...args) {
            this._out('debug', badgeText, badgeStyle, ...args);
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
         * Starts a log group. Only active in 'debug' level.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args The title for the log group.
         */
        static group(badgeText, badgeStyle, ...args) {
            this._groupOut('group', badgeText, badgeStyle, ...args);
        }

        /**
         * Starts a collapsed log group. Only active in 'debug' level.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args The title for the log group.
         */
        static groupCollapsed(badgeText, badgeStyle, ...args) {
            this._groupOut('groupCollapsed', badgeText, badgeStyle, ...args);
        }

        /**
         * Closes the current log group. Only active in 'debug' level.
         * @returns {void}
         */
        static groupEnd() {
            if (this.levels[this.level] >= this.levels.debug) {
                console.groupEnd();
            }
        }
    }

    // Alias for ease of use
    const LOG_STYLES = Logger.styles;

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
    // Description: Defines default settings, global constants, and CSS selectors.
    // =================================================================================

    const CONSTANTS = {
        CONFIG_KEY: `${APPID}_config`,
        CONFIG_SIZE_RECOMMENDED_LIMIT_BYTES: 5 * 1024 * 1024, // 5MB
        CONFIG_SIZE_LIMIT_BYTES: 10 * 1024 * 1024, // 10MB
        ID_PREFIX: `${APPID}-id-`,
        Z_INDICES: {
            SETTINGS_PANEL: 11000,
            TEXT_LIST: 20001,
        },
        TIMING: {
            TIMEOUTS: {
                POST_NAVIGATION_DOM_SETTLE: 200,
                HIDE_DELAY_MS: 250,
            },
        },
        // Platform-specific path exclusions
        URL_EXCLUSIONS: {
            chatgpt: [/^\/codex/, /^\/gpts/, /^\/apps/],
            gemini: [/^\/gems/],
        },
        PLATFORM: {
            CHATGPT: {
                ID: 'chatgpt',
                HOST: 'chatgpt.com',
            },
            GEMINI: {
                ID: 'gemini',
                HOST: 'gemini.google.com',
            },
        },
        SELECTORS: {
            chatgpt: {
                // Reference element for button positioning (Parent container)
                INSERTION_ANCHOR: 'form[data-type="unified-composer"] div[class*="[grid-area:leading]"]',
                // Actual input element for text insertion
                INPUT_TARGET: 'div.ProseMirror#prompt-textarea',
                // Explicit settings for layout strategy
                ANCHOR_PADDING_LEFT: null, // No padding adjustment needed
                INSERT_METHOD: 'prepend',
            },
            gemini: {
                // Reference element for button positioning - Main text input wrapper (Stable parent)
                INSERTION_ANCHOR: 'input-area-v2 .text-input-field',
                // Actual input element for text insertion
                INPUT_TARGET: 'rich-textarea .ql-editor',
                // Settings for absolute positioning strategy
                // Button occupies 48px (left:8px + width:40px). 52px provides a 4px gap.
                ANCHOR_PADDING_LEFT: '52px',
                INSERT_METHOD: 'append',
            },
        },
        MODAL_TYPES: {
            JSON: 'json',
            TEXT_EDITOR: 'textEditor',
        },
    };

    const EVENTS = {
        CONFIG_SIZE_EXCEEDED: `${APPID}:configSizeExceeded`,
        CONFIG_SAVE_SUCCESS: `${APPID}:configSaveSuccess`,
        REOPEN_MODAL: `${APPID}:reOpenModal`,
        CONFIG_UPDATED: `${APPID}:configUpdated`,
        UI_REPOSITION: `${APPID}:uiReposition`,
        NAVIGATION_START: `${APPID}:navigationStart`,
        NAVIGATION: `${APPID}:navigation`,
    };

    // =================================================================================
    // SECTION: Style System & Definitions
    // Description: Centralizes all CSS generation logic, class name definitions, and DOM injection mechanics.
    // =================================================================================

    /**
     * @class StyleDefinitions
     * @description Manages pure style definitions, class names, and CSS generation logic.
     */
    class StyleDefinitions {
        static ICONS = (() => {
            const COMMON_PROPS = {
                xmlns: 'http://www.w3.org/2000/svg',
                height: '24px',
                viewBox: '0 -960 960 960',
                width: '24px',
                fill: 'currentColor',
            };
            return {
                up: {
                    tag: 'svg',
                    props: { ...COMMON_PROPS },
                    children: [{ tag: 'path', props: { d: 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z' } }],
                },
                down: {
                    tag: 'svg',
                    props: { ...COMMON_PROPS },
                    children: [{ tag: 'path', props: { d: 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z' } }],
                },
                delete: {
                    tag: 'svg',
                    props: { ...COMMON_PROPS },
                    children: [{ tag: 'path', props: { d: 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' } }],
                },
                insert: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 0 24 24', width: '24px', fill: 'currentColor' },
                    children: [
                        { tag: 'path', props: { d: 'M0 0h24v24H0V0z', fill: 'none' } },
                        {
                            tag: 'path',
                            props: {
                                d: 'M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z',
                            },
                        },
                    ],
                },
                dragHandle: {
                    tag: 'svg',
                    props: { ...COMMON_PROPS },
                    children: [
                        {
                            tag: 'path',
                            props: {
                                d: 'M349.85-524.85q-14.52 0-24.68-10.16-10.17-10.17-10.17-24.69t10.17-24.68q10.16-10.17 24.68-10.17t24.69 10.17q10.16 10.16 10.16 24.68t-10.16 24.69q-10.17 10.16-24.69 10.16Zm260.3,0q-14.52 0-24.68-10.16-10.17-10.17-10.17-24.69t10.17-24.68q10.16-10.17 24.68-10.17t24.69 10.17q10.16 10.16 10.16 24.68t-10.16 24.69q-10.17 10.16-24.69 10.16Zm-260.3-170q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm260.3,0q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm-260.3,340q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm260.3,0q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Z',
                            },
                        },
                    ],
                },
            };
        })();

        static COMMON_CLASSES = (() => {
            const prefix = `${APPID}-common`;
            return {
                modalButton: `${prefix}-btn`,
                primaryBtn: `${prefix}-btn-primary`,
                pushRightBtn: `${prefix}-btn-push-right`,

                // Form Elements
                formField: `${prefix}-form-field`,
                inputWrapper: `${prefix}-input-wrapper`,
                toggleSwitch: `${prefix}-toggle`,
                toggleSlider: `${prefix}-toggle-slider`,
                selectInput: `${prefix}-select`,

                // Layouts
                submenuRow: `${prefix}-row`,
                submenuFieldset: `${prefix}-fieldset`,
                submenuSeparator: `${prefix}-separator`,
                settingsNote: `${prefix}-note`,

                // Notification
                conflictText: `${prefix}-conflict-text`,
                conflictReloadBtnId: `${prefix}-conflict-reload-btn`,
                warningBanner: `${prefix}-warning-banner`,
            };
        })();

        static MODAL_CLASSES = (() => {
            const prefix = `${APPID}-modal`;
            return {
                dialog: `${prefix}-dialog`,
                box: `${prefix}-box`,
                header: `${prefix}-header`,
                content: `${prefix}-content`,
                footer: `${prefix}-footer`,
                footerMessage: `${prefix}-footer-message`,
                buttonGroup: `${prefix}-button-group`,
            };
        })();

        static SETTINGS_PANEL_CLASSES = (() => {
            const prefix = `${APPID}-settings-panel`;
            return {
                panel: `${prefix}-container`,
                topRow: `${prefix}-top-row`,
            };
        })();

        static VARS = {
            // Backgrounds
            MODAL_BG: `--${APPID}-modal-bg`,
            PANEL_BG: `--${APPID}-panel-bg`,
            INPUT_BG: `--${APPID}-input-bg`,

            // Text Colors
            TEXT_PRIMARY: `--${APPID}-text-primary`,
            TEXT_SECONDARY: `--${APPID}-text-secondary`,
            TEXT_DANGER: `--${APPID}-text-danger`,
            TEXT_WARNING: `--${APPID}-text-warning`,
            TEXT_ACCENT: `--${APPID}-text-accent`,

            // Borders
            BORDER_DEFAULT: `--${APPID}-border-default`,
            BORDER_MEDIUM: `--${APPID}-border-medium`,
            BORDER_LIGHT: `--${APPID}-border-light`,

            // Buttons (Standard)
            BTN_BG: `--${APPID}-btn-bg`,
            BTN_HOVER_BG: `--${APPID}-btn-hover-bg`,
            BTN_TEXT: `--${APPID}-btn-text`,
            BTN_BORDER: `--${APPID}-btn-border`,

            // Toggle Switch
            TOGGLE_BG_OFF: `--${APPID}-toggle-bg-off`,
            TOGGLE_BG_ON: `--${APPID}-toggle-bg-on`,
            TOGGLE_KNOB: `--${APPID}-toggle-knob`,

            // Components specific (Text List & Tabs)
            LIST_BG: `--${APPID}-list-bg`,
            LIST_SHADOW: `--${APPID}-list-shadow`,
            TAB_BG: `--${APPID}-tab-bg`,
            TAB_TEXT: `--${APPID}-tab-text`,
            TAB_BORDER: `--${APPID}-tab-border`,
            TAB_HOVER_BG: `--${APPID}-tab-hover-bg`,
            TAB_ACTIVE_BG: `--${APPID}-tab-active-bg`,
            TAB_ACTIVE_BORDER: `--${APPID}-tab-active-border`,
            TAB_ACTIVE_OUTLINE: `--${APPID}-tab-active-outline`,

            OPTION_BG: `--${APPID}-option-bg`,
            OPTION_TEXT: `--${APPID}-option-text`,
            OPTION_BORDER: `--${APPID}-option-border`,
            OPTION_HOVER_BG: `--${APPID}-option-hover-bg`,
            OPTION_HOVER_BORDER: `--${APPID}-option-hover-border`,
            OPTION_HOVER_OUTLINE: `--${APPID}-option-hover-outline`,

            // Insert Button
            INSERT_BTN_COLOR: `--${APPID}-insert-btn-color`,
            INSERT_BTN_HOVER_BG: `--${APPID}-insert-btn-hover-bg`,
            INSERT_BTN_POSITION: `--${APPID}-insert-btn-position`,
            INSERT_BTN_LEFT: `--${APPID}-insert-btn-left`,
            INSERT_BTN_BOTTOM: `--${APPID}-insert-btn-bottom`,
            INSERT_BTN_SIZE: `--${APPID}-insert-btn-size`,

            // Anchor Layout
            ANCHOR_PADDING_LEFT: `--${APPID}-anchor-padding-left`,
            ANCHOR_GAP: `--${APPID}-anchor-gap`,

            // Theme Modal Specific
            DELETE_BTN_TEXT: `--${APPID}-delete-btn-text`,
            DELETE_BTN_BG: `--${APPID}-delete-btn-bg`,
            DELETE_BTN_HOVER_TEXT: `--${APPID}-delete-btn-hover-text`,
            DELETE_BTN_HOVER_BG: `--${APPID}-delete-btn-hover-bg`,
            DND_INDICATOR: `--${APPID}-dnd-indicator`,
        };

        static PLATFORM_THEMES = {
            chatgpt: {
                [this.VARS.MODAL_BG]: 'var(--main-surface-primary)',
                [this.VARS.PANEL_BG]: 'var(--sidebar-surface-primary)',
                [this.VARS.INPUT_BG]: 'var(--bg-primary)',

                [this.VARS.TEXT_PRIMARY]: 'var(--text-primary)',
                [this.VARS.TEXT_SECONDARY]: 'var(--text-secondary)',
                [this.VARS.TEXT_DANGER]: 'var(--text-danger)',
                [this.VARS.TEXT_WARNING]: '#FFD54F',
                [this.VARS.TEXT_ACCENT]: 'var(--text-accent)',

                [this.VARS.BORDER_DEFAULT]: 'var(--border-default)',
                [this.VARS.BORDER_MEDIUM]: 'var(--border-medium)',
                [this.VARS.BORDER_LIGHT]: 'var(--border-light)',

                [this.VARS.BTN_BG]: 'var(--interactive-bg-tertiary-default)',
                [this.VARS.BTN_HOVER_BG]: 'var(--interactive-bg-secondary-hover)',
                [this.VARS.BTN_TEXT]: 'var(--text-primary)',
                [this.VARS.BTN_BORDER]: 'var(--border-default)',

                [this.VARS.TOGGLE_BG_OFF]: 'var(--bg-primary)',
                [this.VARS.TOGGLE_BG_ON]: 'var(--text-accent)',
                [this.VARS.TOGGLE_KNOB]: 'var(--text-primary)',

                [this.VARS.LIST_BG]: 'var(--main-surface-primary)',
                [this.VARS.LIST_SHADOW]: 'var(--drop-shadow-md, 0 3px 3px #0000001f)',
                [this.VARS.TAB_BG]: 'var(--interactive-bg-tertiary-default)',
                [this.VARS.TAB_TEXT]: 'var(--text-primary)',
                [this.VARS.TAB_BORDER]: 'var(--border-light)',
                [this.VARS.TAB_HOVER_BG]: 'var(--interactive-bg-secondary-hover)',
                [this.VARS.TAB_ACTIVE_BG]: 'var(--interactive-bg-secondary-hover)',
                [this.VARS.TAB_ACTIVE_BORDER]: 'var(--border-default)',
                [this.VARS.TAB_ACTIVE_OUTLINE]: 'var(--border-default)',

                [this.VARS.OPTION_BG]: 'var(--interactive-bg-tertiary-default)',
                [this.VARS.OPTION_TEXT]: 'var(--text-primary)',
                [this.VARS.OPTION_BORDER]: 'var(--border-default)',
                [this.VARS.OPTION_HOVER_BG]: 'var(--interactive-bg-secondary-hover)',
                [this.VARS.OPTION_HOVER_BORDER]: 'var(--border-default)',
                [this.VARS.OPTION_HOVER_OUTLINE]: 'var(--border-default)',

                [this.VARS.INSERT_BTN_COLOR]: 'var(--text-primary)',
                [this.VARS.INSERT_BTN_HOVER_BG]: 'var(--interactive-bg-secondary-hover)',
                [this.VARS.INSERT_BTN_POSITION]: 'static',
                [this.VARS.INSERT_BTN_LEFT]: 'auto',
                [this.VARS.INSERT_BTN_BOTTOM]: 'auto',
                [this.VARS.INSERT_BTN_SIZE]: 'calc(var(--spacing)*9)',

                [this.VARS.ANCHOR_PADDING_LEFT]: '0',
                [this.VARS.ANCHOR_GAP]: '2px',

                [this.VARS.DELETE_BTN_TEXT]: 'var(--interactive-label-danger-secondary-default)',
                [this.VARS.DELETE_BTN_BG]: 'var(--interactive-bg-danger-secondary-default)',
                [this.VARS.DELETE_BTN_HOVER_TEXT]: 'var(--interactive-label-danger-secondary-hover)',
                [this.VARS.DELETE_BTN_HOVER_BG]: 'var(--interactive-bg-secondary-hover)',
                [this.VARS.DND_INDICATOR]: 'var(--text-accent)',
            },
            gemini: {
                [this.VARS.MODAL_BG]: 'var(--gem-sys-color--surface-container-highest)',
                [this.VARS.PANEL_BG]: 'var(--gem-sys-color--surface-container-highest)',
                [this.VARS.INPUT_BG]: 'var(--gem-sys-color--surface-container-low)',

                [this.VARS.TEXT_PRIMARY]: 'var(--gem-sys-color--on-surface)',
                [this.VARS.TEXT_SECONDARY]: 'var(--gem-sys-color--on-surface-variant)',
                [this.VARS.TEXT_DANGER]: 'var(--gem-sys-color--error)',
                [this.VARS.TEXT_WARNING]: '#FFD54F',
                [this.VARS.TEXT_ACCENT]: 'var(--gem-sys-color--primary)',

                [this.VARS.BORDER_DEFAULT]: 'var(--gem-sys-color--outline)',
                [this.VARS.BORDER_MEDIUM]: 'var(--gem-sys-color--outline)',
                [this.VARS.BORDER_LIGHT]: 'var(--gem-sys-color--outline-low)',

                [this.VARS.BTN_BG]: 'var(--gem-sys-color--surface-container-high)',
                [this.VARS.BTN_HOVER_BG]: 'var(--gem-sys-color--surface-container-higher)',
                [this.VARS.BTN_TEXT]: 'var(--gem-sys-color--on-surface-variant)',
                [this.VARS.BTN_BORDER]: 'var(--gem-sys-color--outline)',

                [this.VARS.TOGGLE_BG_OFF]: 'var(--gem-sys-color--surface-container)',
                [this.VARS.TOGGLE_BG_ON]: 'var(--gem-sys-color--primary)',
                [this.VARS.TOGGLE_KNOB]: 'var(--gem-sys-color--on-primary-container)',

                [this.VARS.LIST_BG]: 'var(--gem-sys-color--surface-container-high)',
                [this.VARS.LIST_SHADOW]: '0 4px 12px rgb(0 0 0 / 0.25)',
                [this.VARS.TAB_BG]: 'var(--gem-sys-color--surface-container)',
                [this.VARS.TAB_TEXT]: 'var(--gem-sys-color--on-surface-variant)',
                [this.VARS.TAB_BORDER]: 'var(--gem-sys-color--outline)',
                [this.VARS.TAB_HOVER_BG]: 'var(--gem-sys-color--secondary-container)',
                [this.VARS.TAB_ACTIVE_BG]: 'var(--gem-sys-color--surface-container-higher)',
                [this.VARS.TAB_ACTIVE_BORDER]: 'var(--gem-sys-color--primary)',
                [this.VARS.TAB_ACTIVE_OUTLINE]: 'var(--gem-sys-color--primary)',

                [this.VARS.OPTION_BG]: 'var(--gem-sys-color--surface-container)',
                [this.VARS.OPTION_TEXT]: 'var(--gem-sys-color--on-surface-variant)',
                [this.VARS.OPTION_BORDER]: 'var(--gem-sys-color--outline)',
                [this.VARS.OPTION_HOVER_BG]: 'var(--gem-sys-color--secondary-container)',
                [this.VARS.OPTION_HOVER_BORDER]: 'var(--gem-sys-color--outline)',
                [this.VARS.OPTION_HOVER_OUTLINE]: 'var(--gem-sys-color--primary)',

                [this.VARS.INSERT_BTN_COLOR]: 'var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant))',
                [this.VARS.INSERT_BTN_HOVER_BG]: 'color-mix(in srgb, var(--mat-icon-button-state-layer-color) 8%, transparent)',
                [this.VARS.INSERT_BTN_POSITION]: 'absolute',
                [this.VARS.INSERT_BTN_LEFT]: '8px',
                [this.VARS.INSERT_BTN_BOTTOM]: '12px',
                [this.VARS.INSERT_BTN_SIZE]: '40px',

                [this.VARS.ANCHOR_PADDING_LEFT]: '52px',
                [this.VARS.ANCHOR_GAP]: '0',

                [this.VARS.DELETE_BTN_TEXT]: 'var(--gem-sys-color--on-error-container)',
                [this.VARS.DELETE_BTN_BG]: 'var(--gem-sys-color--error-container)',
                [this.VARS.DELETE_BTN_HOVER_TEXT]: 'var(--gem-sys-color--on-error-container)',
                [this.VARS.DELETE_BTN_HOVER_BG]: 'color-mix(in srgb, var(--gem-sys-color--on-error-container) 15%, var(--gem-sys-color--error-container))',
                [this.VARS.DND_INDICATOR]: 'var(--gem-sys-color--primary)',
            },
        };

        static getPlatformVariables(platformId) {
            const theme = this.PLATFORM_THEMES[platformId];
            if (!theme) return '';

            return Object.entries(theme)
                .map(([key, value]) => `${key}: ${value};`)
                .join('\n');
        }

        static getCommon() {
            const key = 'common';
            const cls = StyleDefinitions.COMMON_CLASSES;
            const v = StyleDefinitions.VARS;

            const cssGenerator = (classes) => `
                /* Buttons */
                .${classes.modalButton} {
                    background: var(${v.BTN_BG});
                    border: 1px solid var(${v.BTN_BORDER});
                    border-radius: var(--radius-md, 5px);
                    color: var(${v.BTN_TEXT});
                    cursor: pointer;
                    font-size: 13px;
                    padding: 5px 16px;
                    transition: background 0.12s, color 0.12s, opacity 0.12s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    white-space: nowrap;
                    min-width: 80px;
                }
                .${classes.modalButton}:hover {
                    background: var(${v.BTN_HOVER_BG}) !important;
                    border-color: var(${v.BTN_BORDER});
                }
                .${classes.modalButton}:disabled {
                    background: var(${v.BTN_BG}) !important;
                    cursor: not-allowed;
                    opacity: 0.5;
                }
                .${classes.primaryBtn} {
                    background-color: #1a73e8 !important;
                    color: #ffffff !important;
                    border: 1px solid transparent !important;
                }
                .${classes.primaryBtn}:hover {
                    background-color: #1557b0 !important;
                }
                .${classes.pushRightBtn} {
                    margin-left: auto !important;
                }

                /* Fieldset & Layout */
                .${classes.submenuFieldset} {
                    border: 1px solid var(${v.BORDER_DEFAULT});
                    border-radius: 4px;
                    padding: 8px 12px 12px;
                    margin: 0 0 12px 0;
                    min-width: 0;
                }
                .${classes.submenuFieldset} legend {
                    padding: 0 4px;
                    font-weight: 500;
                    color: var(${v.TEXT_SECONDARY});
                }
                .${classes.submenuRow} {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    margin-top: 8px;
                }
                .${classes.submenuRow} label {
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .${classes.submenuRow} select {
                    width: 50%;
                }
                .${classes.submenuSeparator} {
                    border-top: 1px solid var(${v.BORDER_LIGHT});
                    margin: 12px 0;
                }
                .${classes.settingsNote} {
                    font-size: 0.85em;
                    color: var(${v.TEXT_SECONDARY});
                    text-align: left;
                    margin-top: 8px;
                    padding: 0 4px;
                }

                /* Notification Banner */
                .${classes.warningBanner} {
                    background-color: var(--bg-danger, #ffe6e6);
                    color: var(${v.TEXT_DANGER});
                    padding: 8px 12px;
                    margin-bottom: 12px;
                    border: 1px solid var(--border-danger, #ffcdd2);
                    border-radius: 4px;
                    font-size: 0.9em;
                    line-height: 1.4;
                    white-space: pre-wrap;
                }

                /* Form Inputs */
                .${classes.selectInput} {
                    width: 100%;
                    box-sizing: border-box;
                    background: var(${v.INPUT_BG});
                    border: 1px solid var(${v.BORDER_DEFAULT});
                    color: var(${v.TEXT_PRIMARY});
                    border-radius: 4px;
                    padding: 4px 6px;
                }

                /* Toggle Switch */
                .${classes.toggleSwitch} {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 22px;
                    flex-shrink: 0;
                }
                .${classes.toggleSwitch} input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .${classes.toggleSlider} {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: var(${v.TOGGLE_BG_OFF});
                    transition: .3s;
                    border-radius: 22px;
                }
                .${classes.toggleSlider}:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 3px;
                    bottom: 3px;
                    background-color: var(${v.TOGGLE_KNOB});
                    transition: .3s;
                    border-radius: 50%;
                }
                .${classes.toggleSwitch} input:checked + .${classes.toggleSlider} {
                    background-color: var(${v.TOGGLE_BG_ON});
                }
                .${classes.toggleSwitch} input:checked + .${classes.toggleSlider}:before {
                    transform: translateX(18px);
                }
            `;
            return { key, classes: cls, vars: {}, generator: cssGenerator };
        }

        static getModal() {
            const key = 'modal';
            const cls = StyleDefinitions.MODAL_CLASSES;
            const common = StyleDefinitions.COMMON_CLASSES;
            const v = StyleDefinitions.VARS;

            const cssGenerator = (classes) => `
                dialog.${classes.dialog} {
                    padding: 0;
                    border: none;
                    background: transparent;
                    max-width: 100vw;
                    max-height: 100vh;
                    overflow: visible;
                }
                dialog.${classes.dialog}::backdrop {
                    background: rgb(0 0 0 / 0.5);
                    pointer-events: auto;
                }
                .${classes.box} {
                    display: flex;
                    flex-direction: column;
                    background: var(${v.MODAL_BG});
                    color: var(${v.TEXT_PRIMARY});
                    border: 1px solid var(${v.BORDER_DEFAULT});
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
                }
                .${classes.header}, .${classes.footer} {
                    flex-shrink: 0;
                    padding: 12px 16px;
                }
                .${classes.header} {
                    font-size: 1.1em;
                    font-weight: 600;
                    border-bottom: 1px solid var(${v.BORDER_DEFAULT});
                }
                .${classes.content} {
                    flex-grow: 1;
                    padding: 16px;
                    overflow-y: auto;
                }
                .${classes.footer} {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    border-top: 1px solid var(${v.BORDER_DEFAULT});
                }
                .${classes.footerMessage} {
                    flex-grow: 1;
                    font-size: 0.9em;
                }
                .${classes.buttonGroup} {
                    display: flex;
                    gap: 8px;
                }

                /* Conflict Notification */
                .${classes.footerMessage}.${common.conflictText} {
                    color: var(${v.TEXT_DANGER});
                    display: flex;
                    align-items: center;
                }
                .${classes.footerMessage} #${common.conflictReloadBtnId} {
                    border-color: var(${v.TEXT_DANGER});
                }
            `;
            return { key, classes: cls, vars: {}, generator: cssGenerator };
        }

        static getSettingsPanel() {
            const key = 'settings-panel';
            const cls = StyleDefinitions.SETTINGS_PANEL_CLASSES;
            const common = StyleDefinitions.COMMON_CLASSES;
            const v = StyleDefinitions.VARS;

            const cssGenerator = (classes) => `
                #${classes.panel} {
                    position: fixed;
                    width: min(340px, 95vw);
                    max-height: 85vh;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    background: var(${v.PANEL_BG});
                    color: var(${v.TEXT_PRIMARY});
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 20px 0 rgb(0 0 0 / 15%);
                    padding: 12px;
                    z-index: ${CONSTANTS.Z_INDICES.SETTINGS_PANEL};
                    border: 1px solid var(${v.BORDER_MEDIUM});
                    font-size: 0.9em;
                }
                .${classes.topRow} {
                    display: flex; gap: 12px;
                }
                .${classes.topRow} .${common.submenuFieldset} {
                    flex: 1 1 0px;
                }
            `;
            return { key, classes: cls, vars: {}, generator: cssGenerator };
        }

        static getTextList() {
            const key = 'text-list';
            const prefix = `${APPID}-text-list`;
            const classes = {
                list: `${prefix}-container`,
                profileBar: `${prefix}-profile-bar`,
                profileName: `${prefix}-profile-name`,
                navBtn: `${prefix}-nav-btn`,
                rotateLeft: `${prefix}-rotate-left`,
                rotateRight: `${prefix}-rotate-right`,
                tabs: `${prefix}-tabs`,
                separator: `${prefix}-separator`,
                tab: `${prefix}-tab`,
                options: `${prefix}-options`,
                option: `${prefix}-option`,
            };
            const v = StyleDefinitions.VARS;

            const cssGenerator = (cls) => `
                #${cls.list} {
                    position: fixed;
                    z-index: ${CONSTANTS.Z_INDICES.TEXT_LIST};
                    display: none;
                    width: min(500px, 95vw);
                    padding: 4px 8px;
                    border-radius: var(--radius-md, 4px);
                    background: var(${v.LIST_BG});
                    color: var(${v.TEXT_PRIMARY});
                    border: 1px solid var(${v.BORDER_MEDIUM});
                    box-shadow: var(${v.LIST_SHADOW});
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                }
                .${cls.profileBar} {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 4px 0;
                    padding: 4px 0;
                    border-top: 1px solid var(${v.BORDER_DEFAULT});
                    border-bottom: 1px solid var(${v.BORDER_DEFAULT});
                    flex: 0 0 auto;
                    gap: 8px;
                }
                .${cls.profileName} {
                    flex-grow: 1;
                    text-align: center;
                    font-weight: bold;
                    font-size: 0.95em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding: 0 8px;
                    color: var(${v.TEXT_PRIMARY});
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                .${cls.profileName}:hover {
                    background: var(${v.OPTION_HOVER_BG});
                }
                .${cls.navBtn} {
                    background: transparent;
                    border: none;
                    color: var(${v.TEXT_PRIMARY});
                    cursor: pointer;
                    padding: 2px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 24px;
                    height: 24px;
                    opacity: 0.7;
                    transition: opacity 0.2s, background 0.2s;
                }
                .${cls.navBtn}:hover {
                    opacity: 1;
                    background: var(${v.OPTION_HOVER_BG});
                }
                .${cls.rotateLeft} { transform: rotate(-90deg); }
                .${cls.rotateRight} { transform: rotate(90deg); }
                
                .${cls.tabs} {
                    display: flex;
                    margin: 4px 0;
                    flex: 0 0 auto;
                }
                .${cls.separator} {
                    height: 1px;
                    margin: 4px 0;
                    background: var(${v.BORDER_DEFAULT});
                    flex: 0 0 auto;
                }
                .${cls.tab} {
                    flex: 1 1 0;
                    min-width: 0;
                    max-width: 90px;
                    margin-right: 4px;
                    padding: 4px 0;
                    border-radius: var(--radius-md, 4px);
                    font-size: 12px;
                    text-align: center;
                    background: var(${v.TAB_BG});
                    color: var(${v.TAB_TEXT});
                    border: 1px solid var(${v.TAB_BORDER});
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .${cls.tab}.active {
                    background: var(${v.TAB_ACTIVE_BG});
                    border-color: var(${v.TAB_ACTIVE_BORDER});
                    outline: 2px solid var(${v.TAB_ACTIVE_OUTLINE});
                }
                .${cls.tab}:hover {
                    background: var(${v.TAB_HOVER_BG});
                }
                
                .${cls.options} {
                    flex: 1 1 auto;
                    overflow-y: auto;
                    min-height: 0;
                    overscroll-behavior: contain;
                }
                .${cls.option} {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    width: 100%;
                    margin: 4px 0;
                    padding: 4px;
                    font-size: 13px;
                    text-align: left;
                    border-radius: var(--radius-md, 5px);
                    background: var(${v.OPTION_BG});
                    color: var(${v.OPTION_TEXT});
                    border: 1px solid var(${v.OPTION_BORDER});
                    cursor: pointer;
                }
                .${cls.option}:hover, .${cls.option}:focus {
                    background: var(${v.OPTION_HOVER_BG}) !important;
                    border-color: var(${v.OPTION_HOVER_BORDER}) !important;
                    outline: 2px solid var(${v.OPTION_HOVER_OUTLINE});
                }
                .${cls.option}.active {
                    background: var(${v.TAB_ACTIVE_BG});
                    border-color: var(${v.TAB_ACTIVE_BORDER});
                    font-weight: bold;
                }
            `;
            return { key, classes, vars: {}, generator: cssGenerator };
        }

        static getInsertButton() {
            const key = 'insert-btn';
            const prefix = `${APPID}-insert`;
            const classes = {
                buttonId: `${CONSTANTS.ID_PREFIX}insert-btn`,
                anchorStyled: `${prefix}-anchor-styled`,
            };
            const v = StyleDefinitions.VARS;

            const cssGenerator = (cls) => `
                #${cls.buttonId} {
                    /* Dynamic Layout via Vars */
                    position: var(${v.INSERT_BTN_POSITION}) !important;
                    left: var(${v.INSERT_BTN_LEFT});
                    bottom: var(${v.INSERT_BTN_BOTTOM});
                    width: var(${v.INSERT_BTN_SIZE});
                    height: var(${v.INSERT_BTN_SIZE});
                    margin: 0 !important;
                    
                    /* Visuals */
                    display: flex;
                    background: transparent;
                    border: none;
                    border-radius: 50%;
                    color: var(${v.INSERT_BTN_COLOR});
                    
                    /* Base */
                    font-size: 16px;
                    cursor: pointer;
                    box-shadow: var(--drop-shadow-xs, 0 1px 1px #0000000d);
                    transition: background 0.12s, border-color 0.12s, box-shadow 0.12s;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    pointer-events: auto !important;
                }
                #${cls.buttonId}:hover {
                    background: var(${v.INSERT_BTN_HOVER_BG});
                }
                
                /* Anchor Styling */
                .${cls.anchorStyled} {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: var(${v.ANCHOR_GAP});
                    padding-left: var(${v.ANCHOR_PADDING_LEFT}) !important;
                }
            `;
            return { key, classes, vars: {}, generator: cssGenerator };
        }

        static getTextEditorModal() {
            const key = 'text-editor';
            const prefix = `${APPID}-text-editor`;
            const classes = {
                // Header Controls
                headerControls: `${prefix}-header-controls`,
                headerRow: `${prefix}-header-row`,
                renameArea: `${prefix}-rename-area`,
                actionArea: `${prefix}-action-area`,
                mainActions: `${prefix}-main-actions`,
                renameActions: `${prefix}-rename-actions`,
                deleteConfirmGroup: `${prefix}-delete-confirm-group`,
                deleteConfirmLabel: `${prefix}-delete-confirm-label`,
                deleteConfirmBtnYes: `${prefix}-delete-confirm-btn-yes`,

                // Content Layout
                modalContent: `${prefix}-modal-content`,
                scrollableArea: `${prefix}-scrollable-area`,

                // Text Item
                textItem: `${prefix}-text-item`,
                dragHandle: `${prefix}-drag-handle`,
                itemControls: `${prefix}-text-item-controls`,

                // Buttons
                moveBtn: `${prefix}-move-btn`,
                deleteBtn: `${prefix}-delete-btn`,
            };
            const v = StyleDefinitions.VARS;
            const common = StyleDefinitions.COMMON_CLASSES;

            const cssGenerator = (cls) => `
                /* Header Layout */
                .${cls.headerControls} {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                }
                .${cls.headerRow} {
                  display: grid;
                  /* Label | Flexible Input | Action Buttons */
                  grid-template-columns: 5.5rem 1fr auto;
                  gap: 8px;
                  align-items: center;
                }
                @media (max-width: 800px) {
                    .${cls.headerRow} {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    .${cls.headerRow} > label {
                        text-align: left;
                    }
                    .${cls.headerRow} > .${cls.renameArea} {
                        grid-column: 1;
                    }
                    .${cls.headerRow} > .${cls.actionArea} {
                        grid-column: 1;
                    }
                }
                .${cls.headerRow}.is-disabled {
                  opacity: 0.5;
                  pointer-events: none;
                }
                .${cls.headerRow} > label {
                  grid-column: 1;
                  text-align: right;
                  color: var(${v.TEXT_SECONDARY});
                  font-size: 0.9em;
                }
                .${cls.headerRow} > .${cls.renameArea} {
                  grid-column: 2;
                  min-width: 180px;
                }
                .${cls.headerRow} > .${cls.actionArea} {
                  grid-column: 3;
                  display: grid;
                  grid-template-columns: 1fr;
                  align-items: center;
                }
                .${cls.actionArea} > * {
                    grid-area: 1 / 1;
                    width: 100%;
                    display: flex;
                    align-items: center;
                }
                .${cls.mainActions},
                .${cls.renameActions} {
                    justify-content: flex-start;
                    gap: 8px;
                    flex-wrap: nowrap;
                }
                .${cls.deleteConfirmGroup} {
                  justify-content: space-between;
                  gap: 8px;
                }
                
                /* Delete Confirmation Styles */
                .${cls.deleteConfirmLabel} {
                  color: var(${v.TEXT_DANGER});
                  font-style: italic;
                  white-space: nowrap;
                }
                .${cls.deleteConfirmBtnYes} {
                  background-color: var(${v.DELETE_BTN_BG}) !important;
                  color: var(${v.DELETE_BTN_TEXT}) !important;
                }
                .${cls.deleteConfirmBtnYes}:hover {
                  background-color: var(${v.DELETE_BTN_HOVER_BG}) !important;
                  color: var(${v.DELETE_BTN_HOVER_TEXT}) !important;
                  filter: brightness(0.85);
                }

                /* Content Layout */
                .${cls.modalContent} {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  height: 60vh;
                  min-height: 200px;
                  overflow: hidden;
                }
                .${cls.scrollableArea} {
                  flex-grow: 1;
                  overflow-y: auto;
                  padding: 4px 8px 4px 4px;
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  border: 1px solid var(${v.BORDER_DEFAULT});
                  border-radius: 4px;
                  background: var(${v.INPUT_BG});
                  transition: opacity 0.2s;
                }
                .${cls.scrollableArea}.is-disabled {
                  pointer-events: none;
                  opacity: 0.5;
                }

                /* Text Item (Drag & Drop) */
                .${cls.textItem} {
                  display: flex;
                  align-items: flex-start;
                  gap: 8px;
                  padding: 4px;
                  border-radius: 4px;
                  border-top: 2px solid transparent;
                  border-bottom: 2px solid transparent;
                  transition: background-color 0.2s, border-color 0.1s;
                }
                .${cls.textItem}.dragging {
                  opacity: 0.4;
                  background-color: rgb(255 255 255 / 0.1);
                }
                .${cls.textItem}.drag-over-top {
                  border-top: 2px solid var(${v.DND_INDICATOR});
                }
                .${cls.textItem}.drag-over-bottom {
                  border-bottom: 2px solid var(${v.DND_INDICATOR});
                }
                .${cls.dragHandle} {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 24px;
                  flex-shrink: 0;
                  align-self: center;
                  cursor: grab;
                  color: var(${v.TEXT_SECONDARY});
                  opacity: 0.6;
                }
                .${cls.dragHandle}:hover {
                  opacity: 1;
                }
                .${cls.dragHandle}:active {
                  cursor: grabbing;
                }
                .${cls.textItem} textarea {
                  flex-grow: 1;
                  resize: none;
                  min-height: 80px;
                  max-height: 250px;
                  overflow-y: auto;
                  font-family: monospace;
                }
                .${cls.textItem}.dragging textarea {
                  pointer-events: none;
                }
                
                /* Item Controls */
                .${cls.itemControls} {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }
                .${common.modalButton}.${cls.moveBtn} {
                  line-height: 1;
                  min-width: 24px;
                  padding: 4px;
                  height: 24px;
                  width: 24px;
                }
                .${common.modalButton}.${cls.deleteBtn} {
                  line-height: 1;
                  min-width: 24px;
                  padding: 4px;
                  height: 24px;
                  width: 24px;
                  font-size: 16px;
                  color: var(${v.TEXT_DANGER});
                }
                
                /* Validation & Common Overrides within this modal */
                .is-invalid {
                  border-color: var(${v.TEXT_DANGER}) !important;
                }

                /* Generic Input Styles for this Modal */
                .${StyleDefinitions.MODAL_CLASSES.box} input,
                .${StyleDefinitions.MODAL_CLASSES.box} select,
                .${StyleDefinitions.MODAL_CLASSES.box} textarea {
                    width: 100%;
                    box-sizing: border-box;
                    background: var(${v.INPUT_BG});
                    color: var(${v.TEXT_PRIMARY});
                    border: 1px solid var(${v.BORDER_DEFAULT});
                    border-radius: 4px;
                    padding: 4px 6px;
                }
            `;
            return { key, classes, vars: {}, generator: cssGenerator };
        }

        static getJsonModal() {
            const key = 'json-modal';
            const prefix = `${APPID}-json`;
            const classes = {
                modalRoot: `${prefix}-root`,
                statusContainer: `${prefix}-status-container`,
                content: `${prefix}-content`,
                editor: `${prefix}-editor`,
                statusRow: `${prefix}-status-row`,
                msg: `${prefix}-modal-msg`,
                sizeInfo: `${prefix}-modal-size-info`,
            };
            const v = StyleDefinitions.VARS;
            const common = StyleDefinitions.COMMON_CLASSES;
            const modalClasses = StyleDefinitions.MODAL_CLASSES;

            const cssGenerator = (cls) => `
                /* Footer Layout Adjustments - Scoped to JSON Modal */
                /* Hide footer message only when it does NOT have the conflict warning class */
                .${cls.modalRoot} .${modalClasses.footerMessage}:not(.${common.conflictText}) {
                    display: none !important;
                }
                
                /* Allow wrapping in footer to prevent overflow when warning message is displayed */
                .${cls.modalRoot} .${modalClasses.footer} {
                    flex-wrap: wrap;
                }

                .${cls.modalRoot} .${modalClasses.buttonGroup} {
                    width: 100%;
                }

                /* Utility classes override for this modal context */
                .${common.modalButton}.${common.pushRightBtn} {
                    margin-left: auto !important;
                }
                .${common.primaryBtn} {
                    background-color: #1a73e8 !important;
                    color: #ffffff !important;
                    border: 1px solid transparent !important;
                }
                .${common.primaryBtn}:hover {
                    background-color: #1557b0 !important;
                }

                .${cls.content} {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    min-width: 0;
                    width: 100%;
                }
                .${cls.modalRoot} .${cls.editor} {
                    width: 100% !important;
                    height: 200px;
                    min-width: 0 !important;
                    max-width: 100%;
                    resize: none;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    font-family: monospace;
                    font-size: 13px;
                    border: 1px solid var(${v.BORDER_DEFAULT});
                    background: var(${v.INPUT_BG});
                    color: var(${v.TEXT_PRIMARY});
                    padding: 6px;
                    border-radius: 4px;
                }
                .${cls.statusRow} {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 8px;
                }
                .${cls.msg} {
                    color: var(${v.TEXT_DANGER});
                    font-size: 0.9em;
                    flex: 1;
                    min-height: 1.2em;
                    word-break: break-word;
                }
                .${cls.sizeInfo} {
                    color: var(${v.TEXT_SECONDARY});
                    font-size: 0.85em;
                    white-space: normal;
                    word-break: break-all;
                    text-align: right;
                    margin-top: 2px;
                    flex-shrink: 0;
                }
            `;
            return { key, classes, vars: {}, generator: cssGenerator };
        }

        static getShortcutModal() {
            const key = 'shortcut-modal';
            const prefix = `${APPID}-shortcut`;
            const classes = {
                grid: `${prefix}-grid`,
                keyGroup: `${prefix}-key-group`,
                key: `${prefix}-key`,
                desc: `${prefix}-desc`,
                sectionHeader: `${prefix}-section-header`,
            };
            const v = StyleDefinitions.VARS;

            const cssGenerator = (cls) => `
                .${cls.grid} {
                    display: grid;
                    grid-template-columns: max-content 1fr;
                    gap: 8px 16px;
                    align-items: baseline;
                    padding: 4px;
                }
                .${cls.sectionHeader} {
                    grid-column: 1 / -1;
                    font-weight: bold;
                    color: var(${v.TEXT_SECONDARY});
                    border-bottom: 1px solid var(${v.BORDER_LIGHT});
                    margin-top: 12px;
                    margin-bottom: 4px;
                    padding-bottom: 2px;
                    font-size: 0.9em;
                }
                .${cls.sectionHeader}:first-child {
                    margin-top: 0;
                }
                .${cls.keyGroup} {
                    text-align: right;
                    white-space: nowrap;
                }
                .${cls.key} {
                    display: inline-block;
                    padding: 2px 6px;
                    font-family: monospace;
                    font-size: 0.9em;
                    line-height: 1.2;
                    color: var(${v.TEXT_PRIMARY});
                    background-color: var(${v.BTN_BG});
                    border: 1px solid var(${v.BORDER_DEFAULT});
                    border-radius: 4px;
                    box-shadow: 0 1px 1px rgb(0 0 0 / 0.1);
                    min-width: 1.2em;
                    text-align: center;
                }
                .${cls.desc} {
                    color: var(${v.TEXT_PRIMARY});
                    font-size: 0.95em;
                }
            `;
            return { key, classes, vars: {}, generator: cssGenerator };
        }
    }

    /**
     * @class StyleManager
     * @description Centralizes the creation, injection, and management of CSS style elements.
     */
    class StyleManager {
        static _handles = new Map();

        /**
         * @param {string} id The ID of the style element.
         * @param {string} cssContent The CSS content to inject.
         */
        static _inject(id, cssContent) {
            let style = document.getElementById(id);
            if (!style) {
                const newStyle = document.createElement('style');
                newStyle.id = id;
                style = newStyle;
                const target = document.head || document.documentElement;
                if (target) {
                    target.appendChild(style);
                }
            }
            if (style) {
                style.textContent = cssContent;
            }
        }

        /**
         * Requests a style handle for the given definition provider.
         * @param {() => object} defProvider Function that returns the style definition.
         * @returns {{id: string, prefix: string, classes: object, vars: object}} The style handle.
         */
        static request(defProvider) {
            if (!this._handles.has(defProvider)) {
                const def = defProvider();
                const id = `${APPID}-style-${def.key}`;
                const prefix = `${APPID}-${def.key}`;
                const cssContent = def.generator(def.classes);

                this._inject(id, cssContent);
                this._handles.set(defProvider, { id, prefix, classes: def.classes, vars: def.vars });
            }
            return this._handles.get(defProvider);
        }

        /**
         * Injects platform-specific CSS variables into the root element.
         * @param {string} platformId
         */
        static injectPlatformVariables(platformId) {
            const css = StyleDefinitions.getPlatformVariables(platformId);
            if (css) {
                this._inject(`${APPID}-platform-vars`, `body { ${css} }`);
            }
        }
    }

    // prettier-ignore
    const DEFAULT_CONFIG = {
        options: {
            enable_shortcut: true,
            insert_before_newline: false,
            insert_after_newline: false,
            insertion_position: 'cursor', // 'start', 'cursor', 'end'
            trigger_mode: 'click', // 'click', 'hover'
            activeProfileName: 'Default',
        },
        developer: {
            logger_level: 'log', // 'error', 'warn', 'info', 'log', 'debug'
        },
        texts: [
            {
                name: 'Default',
                categories: [
                    {
                        name: 'Structured',
                        items: [
                            'Explain this step by step.',
                            'Summarize this using bullet points.',
                            'Provide the answer in a table format.'
                        ],
                    },
                    {
                        name: 'Refine',
                        items: [
                            'Can you clarify this point with a concrete example?',
                            'Rephrase this in a more concise and technical manner.',
                            'List the assumptions you are making in this explanation.'
                        ],
                    },
                    {
                        name: 'Coding',
                        items: [
                            'Show a minimal reproducible example.',
                            'Explain this from a performance and maintainability perspective.',
                            'Point out potential edge cases or pitfalls.'
                        ],
                    },
                    {
                        name: 'Twist',
                        items: [
                            'Explain this as if you were teaching a beginner.',
                            'Explain this to an expert in one paragraph.',
                            'Give an alternative perspective or unconventional approach.'
                        ],
                    },
                    {
                        name: 'Image-gen',
                        items: [
                            'Based on all of our previous conversations, generate an image of me as you imagine. Make it super-realistic. Please feel free to fill in any missing information with your own imagination. Do not ask follow-up questions; generate the image immediately.',
                            'Based on all of our previous conversations, generate an image of my ideal partner (opposite sex) as you imagine. Make it super-realistic. Please feel free to fill in any missing information with your own imagination. Do not ask follow-up questions; generate the image immediately.',
                            'Based on all of our previous conversations, generate an image of a person who is the exact opposite of my ideal partner. Make it super-realistic. Please feel free to fill in any missing information with your own imagination. Do not ask follow-up questions; generate the image immediately.',
                        ],
                    },
                ],
            },
        ],
    };

    // =================================================================================
    // SECTION: Platform-Specific Adapter
    // Description: Centralizes all platform-specific logic, such as selectors and
    //              DOM manipulation strategies.
    // =================================================================================

    const PlatformAdapters = {
        General: {
            getPlatformDetails() {
                const { host } = location;
                // ChatGPT
                if (host.includes(CONSTANTS.PLATFORM.CHATGPT.HOST)) {
                    return {
                        platformId: CONSTANTS.PLATFORM.CHATGPT.ID,
                        selectors: CONSTANTS.SELECTORS.chatgpt,
                    };
                }
                // Gemini
                if (host.includes(CONSTANTS.PLATFORM.GEMINI.HOST)) {
                    return {
                        platformId: CONSTANTS.PLATFORM.GEMINI.ID,
                        selectors: CONSTANTS.SELECTORS.gemini,
                    };
                }
                // invalid
                return null;
            },

            /**
             * Checks if the current page URL is on the exclusion list for this platform.
             * @returns {boolean} True if the page should be excluded, otherwise false.
             */
            isExcludedPage() {
                const platform = this.getPlatformDetails();
                if (!platform) return false;

                const exclusions = CONSTANTS.URL_EXCLUSIONS[platform.platformId] || [];
                const pathname = window.location.pathname;

                return exclusions.some((pattern) => pattern.test(pathname));
            },

            /**
             * Finds the editor element and delegates the text insertion task to the EditorController.
             * @param {string} text The text to insert.
             * @param {object} options The insertion options.
             */
            insertText(text, options = {}) {
                const platform = this.getPlatformDetails();
                if (!platform) {
                    Logger.error('PLATFORM', LOG_STYLES.RED, 'Platform details not found.');
                    return;
                }

                // Use INPUT_TARGET for text insertion logic
                const editor = document.querySelector(platform.selectors.INPUT_TARGET);
                if (!editor || !(editor instanceof HTMLElement)) {
                    Logger.error('DOM ERROR', LOG_STYLES.RED, 'Input element not found via selector:', platform.selectors.INPUT_TARGET);
                    return;
                }

                // Delegate the complex insertion logic to the specialized controller.
                EditorController.insertText(text, editor, options, platform.platformId);
            },
        },

        UI: {
            repositionInsertButton(insertButton) {
                if (!insertButton?.element) return;

                withLayoutCycle({
                    measure: () => {
                        // Read phase
                        const platform = PlatformAdapters.General.getPlatformDetails();
                        if (!platform) return { anchor: null };

                        const anchor = document.querySelector(platform.selectors.INSERTION_ANCHOR);
                        if (!(anchor instanceof HTMLElement)) return { anchor: null };

                        // Retrieve configuration for positioning
                        // Configuration now handled via CSS classes, but we verify method logic here
                        const insertMethod = platform.selectors.INSERT_METHOD;

                        if (!insertMethod) {
                            Logger.warn('LAYOUT', LOG_STYLES.YELLOW, 'INSERT_METHOD is not defined for this platform.');
                        }

                        // Ghost Detection Logic
                        const existingBtn = document.getElementById(insertButton.element.id);
                        const isGhost = existingBtn && existingBtn !== insertButton.element;

                        // Check if button is already inside
                        const isInside = !isGhost && anchor.contains(insertButton.element);

                        // Check specific position validity
                        let isAtCorrectPosition = isInside;
                        if (isInside) {
                            if (insertMethod === 'append') {
                                isAtCorrectPosition = anchor.lastElementChild === insertButton.element;
                            } else if (insertMethod === 'prepend') {
                                isAtCorrectPosition = anchor.firstElementChild === insertButton.element;
                            }
                        }

                        return {
                            anchor,
                            isGhost,
                            existingBtn,
                            shouldInject: !isAtCorrectPosition,
                            insertMethod,
                        };
                    },
                    mutate: (measured) => {
                        // Write phase

                        // Guard: Component might be destroyed during async wait
                        if (!insertButton || !insertButton.element) {
                            return;
                        }

                        if (!measured || !measured.anchor) {
                            insertButton.element.style.display = 'none';
                            return;
                        }

                        const { anchor, isGhost, existingBtn, shouldInject, insertMethod } = measured;

                        if (!anchor.isConnected) {
                            Logger.debug('UI RETRY', LOG_STYLES.CYAN, 'Anchor detached. Retrying reposition.');
                            EventBus.publish(EVENTS.UI_REPOSITION);
                            return;
                        }

                        // 1. Ghost Buster
                        if (isGhost && existingBtn) {
                            Logger.warn('GHOST BUSTER', '', 'Detected non-functional ghost button. Removing...');
                            existingBtn.remove();
                        }

                        // 2. Injection
                        if (shouldInject || isGhost) {
                            // Add marker class to apply flex/relative styles defined in CSS
                            // Retrieve class name dynamically from StyleDefinitions
                            const styledClass = StyleDefinitions.getInsertButton().classes.anchorStyled;
                            if (!anchor.classList.contains(styledClass)) {
                                anchor.classList.add(styledClass);
                            }

                            // Insert based on explicit method
                            if (insertMethod === 'append') {
                                anchor.appendChild(insertButton.element);
                            } else if (insertMethod === 'prepend') {
                                anchor.prepend(insertButton.element);
                            }
                            Logger.debug('UI INJECTION', LOG_STYLES.GREEN, `Button injected into Anchor (${insertMethod}).`);
                        }

                        insertButton.element.style.display = '';
                    },
                });
            },
        },

        Observer: {
            /**
             * Returns an array of platform-specific observer initialization functions.
             * @returns {Function[]} An array of functions to be called by ObserverManager.
             */
            // prettier-ignore
            getInitializers() {
                return [
                    this.triggerInitialPlacement,
                ];
            },

            /**
             * @private
             * @description triggers the initial button placement when the anchor element is detected.
             * @returns {() => void} Cleanup function to remove the listener and hide the UI.
             */
            triggerInitialPlacement() {
                const platform = PlatformAdapters.General.getPlatformDetails();
                if (!platform) return () => {};

                const selector = platform.selectors.INSERTION_ANCHOR;

                const handleAnchorAppearance = () => {
                    EventBus.publish(EVENTS.UI_REPOSITION);
                };

                sentinel.on(selector, handleAnchorAppearance);

                // Initial check in case the element is already present
                const initialInputArea = document.querySelector(selector);
                if (initialInputArea instanceof HTMLElement) {
                    handleAnchorAppearance();
                }

                return () => {
                    sentinel.off(selector, handleAnchorAppearance);

                    // Ensure the button is hidden when the observer is cleaned up (e.g., on excluded pages)
                    const btnId = `${CONSTANTS.ID_PREFIX}insert-btn`;
                    const btn = document.getElementById(btnId);
                    if (btn) {
                        btn.style.display = 'none';
                    }
                };
            },
        },
    };

    // =================================================================================
    // SECTION: Editor Controller
    // Description: Handles all direct DOM manipulation and logic for rich text editors.
    // =================================================================================

    class EditorController {
        /**
         * Inserts text for rich text editors (ChatGPT/Gemini) using a full replacement strategy.
         * @param {string} text The text to insert.
         * @param {HTMLElement} editor The target editor element.
         * @param {object} options The insertion options.
         * @param {string} platformId The ID of the current platform ('chatgpt' or 'gemini').
         */
        static insertText(text, editor, options, platformId) {
            const executeInsertion = () => {
                editor.focus();

                const selection = window.getSelection();
                // Check if selection is valid and within the editor
                const hasValidSelection = selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode);
                let range;

                if (hasValidSelection) {
                    range = selection.getRangeAt(0);
                } else {
                    // Fallback: Create a range at the end if invalid
                    range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(false);
                    // Update selection to match this new range so subsequent calls work
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }

                // 1. Get existing text, handling ChatGPT's restored state
                let existingText;
                const paragraphs = Array.from(editor.childNodes).filter((n) => n.nodeName === 'P');
                // A restored state in ChatGPT is characterized by a single <p> containing newlines.
                const isRestoredState = platformId === CONSTANTS.PLATFORM.CHATGPT.ID && paragraphs.length === 1 && paragraphs[0].textContent.includes('\n');

                if (isRestoredState) {
                    // For the restored state, get text content directly from the single paragraph.
                    existingText = paragraphs[0].textContent;
                } else {
                    // For the normal multi-<p> state, use the standard parsing logic.
                    existingText = this._getTextFromEditor(editor, platformId);
                }

                let cursorPos = 0;
                // Determine insertion position based on options and validity of selection
                if (options.insertion_position === 'cursor' && hasValidSelection) {
                    cursorPos = this._getCursorPositionInText(editor, platformId);
                } else if (options.insertion_position === 'start') {
                    cursorPos = 0;
                } else {
                    // 'end' or fallback for invalid selection
                    cursorPos = existingText.length;
                }

                // 2. Prepare the text to be inserted
                let textToInsert = text;
                if (options.insert_before_newline) textToInsert = '\n' + textToInsert;
                if (options.insert_after_newline) textToInsert += '\n';

                // 3. Construct the final, complete text and new cursor position
                const finalText = existingText.slice(0, cursorPos) + textToInsert + existingText.slice(cursorPos);
                const newCursorPos = cursorPos + textToInsert.length;

                // 4. Build a single DOM fragment for the entire new content
                const finalFragment = this._createTextFragmentForEditor(finalText, platformId);

                // 5. Replace editor content safely using Range API
                // We select all contents again to ensure complete replacement
                range.selectNodeContents(editor);
                range.deleteContents();
                range.insertNode(finalFragment);

                // 6. Set the cursor to the end of the inserted text
                this._setCursorPositionByOffset(editor, newCursorPos);

                // 7. Platform-specific cleanup
                if (platformId === CONSTANTS.PLATFORM.GEMINI.ID) {
                    editor.classList.remove('ql-blank');
                }

                // 8. Dispatch events to notify the editor of the change
                editor.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                editor.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            };

            // Branch: Focus Check
            if (document.activeElement && editor.contains(document.activeElement)) {
                // Branch A: Already focused -> Execute immediately (Sync)
                executeInsertion();
            } else {
                // Branch B: Not focused -> Focus and wait for next frame (Async)
                editor.focus();
                requestAnimationFrame(() => executeInsertion());
            }
        }

        /**
         * Retrieves the plain text content from the editor (ChatGPT or Gemini).
         * @param {HTMLElement} editor The target editor element.
         * @param {string} platformId The ID of the current platform.
         * @returns {string} The plain text content.
         * @private
         */
        static _getTextFromEditor(editor, platformId) {
            // ChatGPT
            if (platformId === CONSTANTS.PLATFORM.CHATGPT.ID && editor.querySelector('p.placeholder')) {
                return '';
            }
            // Gemini's initial state is <p><br></p>, which should be treated as empty.
            if (platformId === CONSTANTS.PLATFORM.GEMINI.ID && editor.childNodes.length === 1 && editor.firstChild instanceof HTMLElement && editor.firstChild.nodeName === 'P' && editor.firstChild.innerHTML === '<br>') {
                return '';
            }

            const lines = [];

            for (const p of editor.childNodes) {
                if (p.nodeName !== 'P') continue;

                const isStructuralEmptyLine = p.childNodes.length === 1 && p.firstChild && p.firstChild.nodeName === 'BR';
                let isEmptyLine = false;

                if (isStructuralEmptyLine) {
                    if (platformId === CONSTANTS.PLATFORM.CHATGPT.ID) {
                        // For ChatGPT, the class must also match for it to be a true empty line paragraph.
                        if (p.firstChild instanceof HTMLElement) {
                            isEmptyLine = p.firstChild.className === 'ProseMirror-trailingBreak';
                        }
                    } else {
                        // For Gemini, the structure alone is sufficient.
                        isEmptyLine = true;
                    }
                }

                if (isEmptyLine) {
                    lines.push('');
                } else {
                    lines.push(p.textContent);
                }
            }
            return lines.join('\n');
        }

        /**
         * Calculates the cursor's character offset within the plain text representation of the editor.
         * @param {HTMLElement} editor The editor element.
         * @param {string} platformId The ID of the current platform.
         * @returns {number} The character offset of the cursor.
         * @private
         */
        static _getCursorPositionInText(editor, platformId) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return 0;

            const range = selection.getRangeAt(0);
            if (!editor.contains(range.startContainer)) return 0;

            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(editor);
            preCaretRange.setEnd(range.startContainer, range.startOffset);

            const tempDiv = document.createElement('div');
            tempDiv.appendChild(preCaretRange.cloneContents());

            const textBeforeCursor = this._getTextFromEditor(tempDiv, platformId);
            return textBeforeCursor.length;
        }

        /**
         * Creates a DocumentFragment based on the editor's expected <p> structure.
         * @param {string} text The plain text to convert, with newlines as \n.
         * @param {string} platformId The ID of the current platform.
         * @returns {DocumentFragment} The constructed fragment.
         * @private
         */
        static _createTextFragmentForEditor(text, platformId) {
            const fragment = document.createDocumentFragment();
            const lines = text.split('\n');

            lines.forEach((line) => {
                const p = document.createElement('p');
                if (line === '') {
                    const br = document.createElement('br');
                    if (platformId === CONSTANTS.PLATFORM.CHATGPT.ID) {
                        // ChatGPT
                        br.className = 'ProseMirror-trailingBreak';
                    }
                    p.appendChild(br);
                } else {
                    p.appendChild(document.createTextNode(line));
                }
                fragment.appendChild(p);
            });
            return fragment;
        }

        /**
         * Sets the cursor position within the editor based on a character offset.
         * @param {HTMLElement} editor The editor element.
         * @param {number} offset The target character offset from a plain text representation (with \n).
         * @private
         */
        static _setCursorPositionByOffset(editor, offset) {
            const selection = window.getSelection();
            if (!selection) return;

            const range = document.createRange();
            let charCount = 0;
            /** @type {Node} */
            let lastNode = editor; // Fallback node

            const paragraphs = Array.from(editor.childNodes).filter((n) => n.nodeName === 'P');

            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                lastNode = p;
                const treeWalker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
                let textNode = null;

                while ((textNode = treeWalker.nextNode())) {
                    lastNode = textNode;
                    const nodeLength = textNode.textContent.length;
                    if (charCount + nodeLength >= offset) {
                        range.setStart(textNode, offset - charCount);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        return; // Position found and set.
                    }
                    charCount += nodeLength;
                }

                // After processing a paragraph, account for the newline character,
                // but only if it's not the last paragraph.
                if (i < paragraphs.length - 1) {
                    if (charCount === offset) {
                        // This case handles when the cursor position is exactly at the newline.
                        // We place the cursor at the end of the current paragraph.
                        range.selectNodeContents(p);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        return;
                    }
                    charCount++; // Increment for the newline
                }
            }

            // If the offset is beyond all text, place cursor at the end of the last node.
            range.selectNodeContents(lastNode);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
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
            EVENTS.NAVIGATION,
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
                Logger.error('', '', 'EventBus.subscribe requires a unique key.');
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
                Logger.error('', '', 'EventBus.once requires a unique key.');
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
                            Logger.debug('EventBus', LOG_STYLES.PURPLE, `Event Published: ${event} (x${finalCount})`);
                        }
                        delete this._logAggregation[event];
                    }, this._aggregationDelay);

                    // Execute subscribers for the aggregated event, but without the verbose individual logs.
                    [...this.events[event].values()].forEach((listener) => {
                        try {
                            listener(...args);
                        } catch (e) {
                            Logger.error('', '', `EventBus error in listener for event "${event}":`, e);
                        }
                    });
                    return; // End execution here for aggregated events in debug mode.
                }
                // --- Aggregation logic END ---

                // In debug mode, provide detailed logging for NON-aggregated events.
                const subscriberKeys = [...this.events[event].keys()];

                Logger.groupCollapsed('EventBus', LOG_STYLES.PURPLE, `Event Published: ${event}`);

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
                        Logger.debug('', LOG_STYLES.PURPLE, `-> Executing: ${key}`);
                        listener(...args);
                    } catch (e) {
                        // Enhance error logging with the specific subscriber key
                        Logger.error('LISTENER ERROR', LOG_STYLES.RED, `Listener "${key}" failed for event "${event}":`, e);
                    }
                });

                Logger.groupEnd();
            } else {
                // Iterate over a copy of the values in case a listener unsubscribes itself.
                [...this.events[event].values()].forEach((listener) => {
                    try {
                        listener(...args);
                    } catch (e) {
                        Logger.error('LISTENER ERROR', LOG_STYLES.RED, `Listener failed for event "${event}":`, e);
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
                    Logger.error('UI QUEUE ERROR', LOG_STYLES.RED, 'Error in queued UI work:', e);
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
     * Schedules a function to run when the browser is idle.
     * Returns a cancel function to abort the scheduled task.
     * In environments without `requestIdleCallback`, this runs asynchronously immediately (1ms delay) to prevent blocking,
     * effectively ignoring the `timeout` constraint by satisfying it instantly.
     * @param {(deadline: IdleDeadline) => void} callback The function to execute.
     * @param {number} timeout The maximum time to wait for idle before forcing execution.
     * @returns {() => void} A function to cancel the scheduled task.
     */
    function runWhenIdle(callback, timeout) {
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(callback, { timeout });
            return () => window.cancelIdleCallback(id);
        } else {
            // Fallback: Execute almost immediately (1ms) to avoid blocking.
            // This satisfies the "run by timeout" contract trivially since 1ms < timeout.
            const id = setTimeout(() => {
                // Provide a minimal IdleDeadline-like object.
                // timeRemaining() returns 50ms to simulate a fresh frame.
                callback({
                    didTimeout: false,
                    timeRemaining: () => 50,
                });
            }, 1);

            return () => clearTimeout(id);
        }
    }

    /**
     * @param {Function} func
     * @param {number} delay
     * @param {boolean} useIdle
     * @returns {((...args: any[]) => void) & { cancel: () => void }}
     */
    function debounce(func, delay, useIdle) {
        let timerId = null;
        let cancelIdle = null;

        const cancel = () => {
            if (timerId !== null) {
                clearTimeout(timerId);
                timerId = null;
            }
            if (cancelIdle) {
                cancelIdle();
                cancelIdle = null;
            }
        };

        const debounced = function (...args) {
            cancel();
            timerId = setTimeout(() => {
                timerId = null; // Timer finished
                if (useIdle) {
                    // Calculate idle timeout based on delay: clamp(delay * 4, 200, 2000)
                    // This ensures short delays don't wait too long, while long delays are capped.
                    const idleTimeout = Math.min(Math.max(delay * 4, 200), 2000);

                    // Schedule idle callback and store the cancel function
                    // Explicitly receive 'deadline' to match runWhenIdle signature
                    cancelIdle = runWhenIdle((deadline) => {
                        cancelIdle = null; // Idle callback finished
                        func.apply(this, args);
                    }, idleTimeout);
                } else {
                    func.apply(this, args);
                }
            }, delay);
        };

        debounced.cancel = cancel;
        return debounced;
    }

    /**
     * Helper function to check if an item is a non-array object.
     * @param {unknown} item The item to check.
     * @returns {item is Record<string, any>}
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
        try {
            return structuredClone(obj);
        } catch (e) {
            Logger.error('CLONE FAILED', '', 'deepClone failed. Data contains non-clonable items.', e);
            throw e;
        }
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
     * Proposes a unique name by appending a suffix if the base name already exists in a given set.
     * Supports both an array of strings and an array of objects with a 'name' property.
     * @param {string} baseName The initial name to check.
     * @param {Set<string>|Array<string>|Array<object>} existingItems Collection of existing names or objects.
     * @returns {string} A unique name.
     */
    function proposeUniqueName(baseName, existingItems) {
        const lowerNames = new Set();
        const items = Array.isArray(existingItems) ? existingItems : Array.from(existingItems);

        // Normalize input to a set of lowercase strings
        items.forEach((item) => {
            if (typeof item === 'string') {
                lowerNames.add(item.toLowerCase());
            } else if (item && typeof item === 'object' && typeof item.name === 'string') {
                lowerNames.add(item.name.toLowerCase());
            }
        });

        if (!lowerNames.has(baseName.trim().toLowerCase())) {
            return baseName;
        }

        let proposedName = `${baseName} Copy`;
        if (!lowerNames.has(proposedName.trim().toLowerCase())) {
            return proposedName;
        }

        let counter = 2;
        while (true) {
            proposedName = `${baseName} Copy ${counter}`;
            if (!lowerNames.has(proposedName.trim().toLowerCase())) {
                return proposedName;
            }
            counter++;
        }
    }

    /**
     * @description A utility to prevent layout thrashing by separating DOM reads (measure)
     * from DOM writes (mutate). The mutate function is executed in the next animation frame.
     * @param {{
     * measure: () => T,
     * mutate: (data: T) => void
     * }} param0 - An object containing the measure and mutate functions.
     * @returns {Promise<void>} A promise that resolves after the mutate function has completed.
     * @template T
     */
    function withLayoutCycle({ measure, mutate }) {
        return new Promise((resolve, reject) => {
            let measuredData;

            // Phase 1: Synchronously read all required layout properties from the DOM.
            try {
                measuredData = measure();
            } catch (e) {
                Logger.error('LAYOUT ERROR', LOG_STYLES.RED, 'Error during measure phase:', e);
                reject(e);
                return;
            }

            // Phase 2: Schedule the DOM mutations to run in the next animation frame.
            requestAnimationFrame(() => {
                try {
                    mutate(measuredData);
                    resolve();
                } catch (e) {
                    Logger.error('LAYOUT ERROR', LOG_STYLES.RED, 'Error during mutate phase:', e);
                    reject(e);
                }
            });
        });
    }

    /**
     * @typedef {Node|string|number|boolean|null|undefined} HChild
     */
    /**
     * Creates a DOM element using a hyperscript-style syntax.
     * @param {string} tag - Tag name with optional ID/class (e.g., "div#app.container", "my-element").
     * @param {object | HChild | HChild[]} [propsOrChildren] - Attributes object or children.
     * @param {HChild | HChild[]} [children] - Children (if props are specified).
     * @returns {HTMLElement | SVGElement} The created DOM element.
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
                        Logger.warn('UNSAFE URL', LOG_STYLES.YELLOW, `Blocked potentially unsafe protocol "${parsedUrl.protocol}" in attribute "${key}":`, url);
                    }
                } catch {
                    el.setAttribute(key, '#');
                    Logger.warn('INVALID URL', LOG_STYLES.YELLOW, `Blocked invalid or relative URL in attribute "${key}":`, url);
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
            else if (value !== false && value !== null && typeof value !== 'undefined') {
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

        if (el instanceof HTMLElement || el instanceof SVGElement) {
            return el;
        }
        throw new Error('Created element is not a valid HTMLElement or SVGElement');
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

    /**
     * A helper function to safely retrieve a nested property from an object using a dot-notation string.
     * @param {object} obj The object to query.
     * @param {string} path The dot-separated path to the property.
     * @returns {any} The value of the property, or undefined if not found.
     */
    function getPropertyByPath(obj, path) {
        if (!obj || typeof path !== 'string') {
            return undefined;
        }
        return path.split('.').reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), obj);
    }

    /**
     * Sets a nested property on an object using a dot-notation path.
     * @param {object} obj The object to modify.
     * @param {string} path The dot-separated path to the property.
     * @param {any} value The value to set.
     * @returns {boolean} True if successful, false if the path was invalid or blocked.
     */
    function setPropertyByPath(obj, path, value) {
        if (!obj || typeof obj !== 'object') {
            Logger.warn('OBJ GUARD', LOG_STYLES.YELLOW, `setPropertyByPath: Target object is invalid (type: ${typeof obj}).`);
            return false;
        }
        if (!path) return false;
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            if (!key) {
                Logger.warn('OBJ GUARD', LOG_STYLES.YELLOW, `setPropertyByPath: Invalid empty key in path "${path}".`);
                return false;
            }

            // Security: Prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                Logger.warn('OBJ GUARD', LOG_STYLES.YELLOW, `setPropertyByPath: Blocked forbidden key "${key}" in path "${path}".`);
                return false;
            }

            // If the property exists, validate that it is an object (and not null) to allow nesting.
            if (current[key] !== undefined && current[key] !== null) {
                if (typeof current[key] !== 'object') {
                    Logger.warn('OBJ GUARD', LOG_STYLES.YELLOW, `setPropertyByPath: Cannot set property "${keys[i + 1]}" on non-object value at "${keys.slice(0, i + 1).join('.')}" in path "${path}".`);
                    return false;
                }
            } else {
                // Only create a new object if the property is null or undefined.
                // This prevents overwriting existing values (like arrays) with empty objects.
                current[key] = {};
            }

            current = current[key];
        }

        const lastKey = keys[keys.length - 1];

        if (!lastKey) {
            Logger.warn('OBJ GUARD', LOG_STYLES.YELLOW, `setPropertyByPath: Invalid empty key at end of path "${path}".`);
            return false;
        }

        // Security: Prevent prototype pollution on the last key
        if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype') {
            Logger.warn('OBJ GUARD', LOG_STYLES.YELLOW, `setPropertyByPath: Blocked forbidden key "${lastKey}" in path "${path}".`);
            return false;
        }

        current[lastKey] = value;
        return true;
    }

    // =================================================================================
    // SECTION: Base Manager
    // Description: Provides common lifecycle and event subscription management.
    // =================================================================================

    /**
     * @class BaseManager
     * @description Provides common lifecycle and event subscription management capabilities.
     * Implements the Template Method pattern for init/destroy cycles.
     */
    class BaseManager {
        constructor() {
            /** @type {Array<{event: string, key: string}>} */
            this.subscriptions = [];
            this.isInitialized = false;
            this.isDestroyed = false;
            /** @type {Promise<void>|null} */
            this._initPromise = null;
        }

        /**
         * Initializes the manager.
         * Prevents double initialization and supports async hooks.
         * @param {...any} args Arguments to pass to the hook method.
         * @returns {Promise<void>}
         */
        async init(...args) {
            if (this.isInitialized) return;

            // Guard against concurrent initialization
            if (this._initPromise) {
                await this._initPromise;
                return;
            }

            this.isDestroyed = false;

            this._initPromise = (async () => {
                await this._onInit(...args);
                // Check if destroyed during async init
                if (!this.isDestroyed) {
                    this.isInitialized = true;
                }
            })();

            try {
                await this._initPromise;
            } finally {
                this._initPromise = null;
            }
        }

        /**
         * Destroys the manager and cleans up resources.
         * Idempotent: safe to call multiple times.
         */
        destroy() {
            if (this.isDestroyed) return;
            this.isDestroyed = true;
            this.isInitialized = false;

            // 1. Hook for subclass specific cleanup
            this._onDestroy();

            // 2. Unsubscribe from all events
            // Create a snapshot to safely iterate even if unsubscribing modifies the original array
            const subsToUnsubscribe = [...this.subscriptions];
            // Immediately clear the array to prevent re-entry or access during cleanup
            this.subscriptions = [];

            // Iterate in reverse order (LIFO) to respect dependencies
            for (let i = subsToUnsubscribe.length - 1; i >= 0; i--) {
                const { event, key } = subsToUnsubscribe[i];
                EventBus.unsubscribe(event, key);
            }
        }

        /**
         * Registers a platform-specific listener.
         * Exposes subscription capability to adapters safely.
         * @param {string} event
         * @param {Function} callback
         */
        registerPlatformListener(event, callback) {
            this._subscribe(event, callback);
        }

        /**
         * Registers a one-time platform-specific listener.
         * Exposes single subscription capability to adapters safely.
         * @param {string} event
         * @param {Function} callback
         */
        registerPlatformListenerOnce(event, callback) {
            this._subscribeOnce(event, callback);
        }

        /**
         * Hook method for initialization logic.
         * @protected
         * @param {...any} args
         */
        _onInit(...args) {
            // To be implemented by subclasses
        }

        /**
         * Hook method for cleanup logic.
         * @protected
         */
        _onDestroy() {
            // To be implemented by subclasses
        }

        /**
         * Helper to subscribe to EventBus and track the subscription for cleanup.
         * Appends the listener name and a unique suffix to the key to avoid conflicts.
         * @protected
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
         * Helper to subscribe to EventBus once and track the subscription for cleanup.
         * Appends the listener name and a unique suffix to the key to avoid conflicts.
         * @protected
         * @param {string} event
         * @param {Function} listener
         */
        _subscribeOnce(event, listener) {
            const baseKey = createEventKey(this, event);
            // Use function name for debugging aid, fallback to 'anonymous'
            const listenerName = listener.name || 'anonymous';
            // Generate a short random suffix to guarantee uniqueness even for anonymous functions
            const uniqueSuffix = Math.random().toString(36).substring(2, 7);
            const key = `${baseKey}_${listenerName}_${uniqueSuffix}`;

            // Wrapper to cleanup the subscription record after firing
            const wrappedListener = (...args) => {
                this._removeSubscriptionRecord(key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        /**
         * Helper to unsubscribe from specific events dynamically.
         * @protected
         * @param {string} event The event name.
         * @param {string} [keyPrefix] Optional prefix to filter specific listeners (e.g. 'ClassName.purpose').
         */
        _unsubscribe(event, keyPrefix) {
            const fullKeyPrefix = keyPrefix || createEventKey(this, event);

            // Find matching subscriptions
            const toRemove = this.subscriptions.filter((sub) => sub.event === event && sub.key.startsWith(fullKeyPrefix));

            // Unsubscribe and remove from list
            toRemove.forEach((sub) => {
                EventBus.unsubscribe(sub.event, sub.key);
                this._removeSubscriptionRecord(sub.key);
            });
        }

        /**
         * Internal helper to remove a subscription record from the array by key.
         * @private
         * @param {string} key
         */
        _removeSubscriptionRecord(key) {
            this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
        }
    }

    // =================================================================================
    // SECTION: UI Construction System (ReactiveStore / FormEngine / SchemaBuilder)
    // =================================================================================

    /**
     * @abstract
     * @class UIComponentBase
     * @extends BaseManager
     * @description Base class for a UI component with lifecycle management.
     */
    class UIComponentBase extends BaseManager {
        constructor(callbacks = {}) {
            super();
            this.callbacks = callbacks;
            this.element = null;
            this.storeSubscriptions = [];
        }

        /**
         * @abstract
         * Renders the component's DOM structure. Must be implemented by subclasses.
         * @returns {HTMLElement|void}
         */
        render() {
            throw new Error('Component must implement render method.');
        }

        /**
         * Adds a store subscription handle (unsubscribe function) to be managed by the component.
         * @param {() => void} unsub - The unsubscribe function returned by store.subscribe.
         */
        addStoreSubscription(unsub) {
            if (typeof unsub === 'function') {
                this.storeSubscriptions.push(unsub);
            }
        }

        /**
         * Executes all registered store subscription handles and clears the list.
         * Can be called manually (e.g. on modal close) or automatically on destroy.
         */
        clearStoreSubscriptions() {
            this.storeSubscriptions.forEach((unsub) => unsub());
            this.storeSubscriptions = [];
        }

        /**
         * Lifecycle hook for cleanup.
         * Removes the component's element from the DOM.
         * @protected
         * @override
         */
        _onDestroy() {
            this.clearStoreSubscriptions();
            this.element?.remove();
            this.element = null;
        }
    }

    /**
     * @class ReactiveStore
     * @description A simple reactive store implementing the Pub/Sub pattern.
     * It allows setting and getting values using dot-notation paths and notifies listeners on changes.
     *
     * [NOTIFICATION BEHAVIOR]
     * - Notifications are triggered strictly for the exact path being modified.
     * - Changes do NOT bubble up to parent paths.
     * - Subscribers are responsible for determining if a change affects them (e.g., using startsWith checks).
     */
    class ReactiveStore {
        constructor(initialState) {
            this.state = deepClone(initialState);
            this.listeners = new Set();
        }

        /**
         * Retrieves a value from the store by path.
         * @param {string} path - The dot-notation path to the property.
         * @returns {any} The value at the specified path.
         */
        get(path) {
            return getPropertyByPath(this.state, path);
        }

        /**
         * Sets a value in the store at the specified path.
         * Notifies listeners if the value has effectively changed.
         * @param {string} path - The dot-notation path to the property.
         * @param {any} value - The new value to set.
         */
        set(path, value) {
            // Validate path to prevent errors in split logic or setPropertyByPath
            if (!path || typeof path !== 'string') {
                Logger.warn('Store', '', `ReactiveStore.set: Invalid path "${path}"`);
                return;
            }

            const currentValue = this.get(path);
            // Use Object.is for strict equality check (handles NaN, -0/+0 correctly)
            if (Object.is(currentValue, value)) return;

            // Only notify if the update was successful
            if (setPropertyByPath(this.state, path, value)) {
                // Notify only the specific path that changed.
                this.notify(path);
            }
        }

        /**
         * Returns a deep copy of the current full state object.
         * @returns {object}
         */
        getData() {
            return deepClone(this.state);
        }

        /**
         * Replaces the entire state with a new object and notifies listeners.
         * Triggers notifications for all top-level keys in both old and new states.
         * @param {object} newState - The new full state object. Must be a valid object (null is ignored).
         */
        replaceState(newState) {
            if (!newState || typeof newState !== 'object') {
                Logger.warn('Store', '', 'ReactiveStore.replaceState: Invalid state object.');
                return;
            }

            const oldState = this.state;
            this.state = deepClone(newState);

            // Notify for the union of keys in old and new states to ensure deleted keys are handled
            const keys = new Set([...Object.keys(oldState || {}), ...Object.keys(this.state || {})]);

            keys.forEach((key) => {
                this.notify(key);
            });
        }

        /**
         * Subscribes to store updates.
         * WARNING: The state object passed to the callback is a direct reference to the store's internal state.
         * Do not mutate the state object directly within the callback. Use store.set() for updates.
         * @param {function(object, string): void} callback - The function to call on update. Receives (state, changedPath).
         * @returns {function(): void} A function to unsubscribe.
         */
        subscribe(callback) {
            if (typeof callback !== 'function') {
                Logger.warn('Store', '', 'ReactiveStore.subscribe: Callback must be a function.');
                return () => {};
            }
            this.listeners.add(callback);
            return () => this.listeners.delete(callback);
        }

        /**
         * @private
         * Notifies all subscribers of a change.
         * @param {string} changedPath - The path that was updated.
         */
        notify(changedPath) {
            for (const listener of this.listeners) {
                try {
                    listener(this.state, changedPath);
                } catch (e) {
                    Logger.error('Store', '', 'ReactiveStore listener failed:', e);
                }
            }
        }
    }

    /**
     * @class ComponentRegistry
     * @description Registry for UI components used by FormEngine.
     */
    class ComponentRegistry {
        static components = new Map();

        /**
         * Registers a component definition.
         * @param {string} type - Component type name.
         * @param {object} def - Component definition containing render logic.
         */
        static register(type, def) {
            this.components.set(type, def);
        }

        /**
         * Retrieves a component definition.
         * @param {string} type
         * @returns {object|undefined}
         */
        static get(type) {
            return this.components.get(type);
        }
    }

    /**
     * @class FormEngine
     * @description A reactive form engine that binds a schema to a ReactiveStore.
     * Handles DOM generation, event binding, and dynamic property updates.
     */
    class FormEngine {
        /**
         * @param {ReactiveStore} store - The data store.
         * @param {Array<object>|object} schema - The UI schema.
         * @param {object} context - Context object containing styles, etc.
         */
        constructor(store, schema, context) {
            this.store = store;
            this.schema = Array.isArray(schema) ? schema : [schema];
            this.context = context;
            this.elements = new Map(); // Map<schemaId, HTMLElement>
            this.unsubscribers = [];
            this.boundEventListeners = [];

            // Bind methods
            this._handleInput = this._handleInput.bind(this);
            this._handleStoreUpdate = this._handleStoreUpdate.bind(this);
        }

        /**
         * Renders the form definition into a DocumentFragment.
         * @returns {DocumentFragment}
         */
        render() {
            const fragment = document.createDocumentFragment();
            this._renderRecursive(this.schema, fragment);

            // Setup reactivity after rendering
            this.unsubscribers.push(this.store.subscribe(this._handleStoreUpdate));

            // Initial evaluation of dynamic properties
            this._evaluateDynamicProperties(this.store.getData());

            return fragment;
        }

        destroy() {
            this.unsubscribers.forEach((unsub) => unsub());
            this.unsubscribers = [];

            // Clean up event listeners explicitly to prevent memory leaks
            this.boundEventListeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
            this.boundEventListeners = [];

            // Execute component-specific cleanup logic
            for (const { element, node } of this.elements.values()) {
                const component = ComponentRegistry.get(node.type);
                if (component && typeof component.destroy === 'function') {
                    try {
                        component.destroy(element);
                    } catch (e) {
                        Logger.warn('FormEngine', LOG_STYLES.YELLOW, `Error destroying component "${node.type}"`, e);
                    }
                }
            }

            this.elements.clear();
        }

        /**
         * @private
         */
        _renderRecursive(schemaNodes, parent) {
            for (const node of schemaNodes) {
                const component = ComponentRegistry.get(node.type);
                if (!component) {
                    Logger.warn('FormEngine', '', `Unknown component type "${node.type}"`);
                    continue;
                }

                // Render the component
                const element = component.render(node, this.context, this);

                if (element) {
                    const nodeId = node.id || `_node_${Math.random().toString(36).slice(2)}`;
                    node._internalId = nodeId;
                    this.elements.set(nodeId, { element, node });

                    // Bind events if the component is interactive
                    if (node.configKey) {
                        this._bindInteractiveElement(element, node);
                    }

                    // Recursively render children if applicable
                    // Some components might handle children rendering internally (e.g. specialized containers),
                    // but the default behavior is to append them.
                    if (node.children && !component.handlesChildren) {
                        const container = component.getContentContainer ? component.getContentContainer(element) : element;
                        this._renderRecursive(node.children, container);
                    }

                    parent.appendChild(element);
                }
            }
        }

        /**
         * @private
         */
        _bindInteractiveElement(rootElement, node) {
            const component = ComponentRegistry.get(node.type);

            // Skip default binding if component handles it manually
            if (component && component.manualBinding) {
                // Just trigger initial update to sync UI with Store
                const value = this.store.get(node.configKey);
                if (component.onUpdate) {
                    component.onUpdate(rootElement, value, this.context, node);
                }
                return;
            }

            // Find the actual input element.
            let input = rootElement.matches('input, select, textarea') ? rootElement : rootElement.querySelector('input, select, textarea');

            if (!input) {
                input = rootElement;
            }

            // Retrieve initial value once
            const initialValue = this.store.get(node.configKey);

            // Check if input is a file input using selector match (safer than type property)
            const isFileInput = input.matches('input[type="file"]');

            // Set initial value (skip for file inputs to avoid security errors)
            if (!isFileInput) {
                this._setElementValue(input, initialValue, node);
            }

            // Initial UI update (for auxiliary displays like slider values)
            if (component && component.onUpdate) {
                component.onUpdate(input, initialValue, this.context, node);
            }

            // Listen for changes
            const handler = (e) => this._handleInput(e, node);

            // Determine correct event type to avoid double subscription
            let useChangeEvent = false;
            if (input.tagName === 'SELECT') {
                useChangeEvent = true;
            } else if (input.matches('input[type="checkbox"], input[type="radio"], input[type="file"]')) {
                useChangeEvent = true;
            }

            const eventType = useChangeEvent ? 'change' : 'input';

            input.addEventListener(eventType, handler);
            this.boundEventListeners.push({ element: input, type: eventType, handler });
        }

        /**
         * @private
         */
        _handleInput(e, node) {
            const target = e.target;
            let value;

            if (target.type === 'checkbox') {
                value = target.checked;
            } else if (target.type === 'number') {
                const floatVal = parseFloat(target.value);
                // Convert NaN (invalid input or empty string) to null for safety
                value = Number.isNaN(floatVal) ? null : floatVal;
            } else {
                // Convert empty string to null for text inputs
                value = target.value === '' ? null : target.value;
            }

            // Execute transformation hook if defined (UI Value -> Store Value)
            if (node.transformValue) {
                value = node.transformValue(value);
            }

            this.store.set(node.configKey, value);

            // Execute side-effect hook if defined
            if (node.onChange) {
                node.onChange(value, this.store.getData());
            }
        }

        _setElementValue(element, value, node) {
            // Apply transformation from Store Value -> UI Input Value if defined
            let inputValue = value;
            if (node && node.toInputValue) {
                inputValue = node.toInputValue(value);
            }

            if (element.type === 'checkbox') {
                element.checked = !!inputValue;
            } else if (element.type === 'number') {
                // Handle null/undefined for numeric inputs
                if (inputValue === null || inputValue === undefined) {
                    // Check for dataset defaults or specific logic (can be extended)
                    element.value = element.min || 0;
                } else {
                    element.value = inputValue;
                }
            } else {
                element.value = inputValue === null || inputValue === undefined ? '' : inputValue;
            }
        }

        /**
         * @private
         */
        _handleStoreUpdate(state, changedPath) {
            // 1. Update bound values
            for (const { element, node } of this.elements.values()) {
                // Check for exact match, parent path match (changedPath is parent), OR child path match (changedPath is child)
                // This ensures bi-directional updates:
                // - Parent change updates children (e.g. store.set('user', ...) updates 'user.name' input)
                // - Child change updates parent (e.g. store.set('user.name', ...) updates 'user' bound component)
                if (node.configKey && typeof changedPath === 'string' && (node.configKey === changedPath || node.configKey.startsWith(changedPath + '.') || changedPath.startsWith(node.configKey + '.'))) {
                    const component = ComponentRegistry.get(node.type);
                    const newValue = this.store.get(node.configKey);

                    // Handle manual binding components (e.g. padding slider)
                    // These components manage their own internal state updates via onUpdate
                    if (component && component.manualBinding) {
                        if (component.onUpdate) {
                            component.onUpdate(element, newValue, this.context, node);
                        }
                        continue;
                    }

                    // Default behavior for standard inputs
                    const input = element.matches('input, select, textarea') ? element : element.querySelector('input, select, textarea');
                    if (input) {
                        // Only update DOM if different to prevent cursor jumping
                        if (input.type === 'checkbox') {
                            if (input.checked !== !!newValue) input.checked = !!newValue;
                        } else {
                            // Calculate expected UI value to compare
                            let expectedValue = newValue;
                            if (node.toInputValue) {
                                expectedValue = node.toInputValue(newValue);
                            }
                            // Loose equality check to allow string/number conversions
                            // eslint-disable-next-line eqeqeq
                            if (input.value != expectedValue) this._setElementValue(input, newValue, node);
                        }

                        // Trigger UI update hook
                        if (component && component.onUpdate) {
                            component.onUpdate(input, newValue, this.context, node);
                        }
                    } else if (component && component.onUpdate) {
                        component.onUpdate(element, newValue, this.context, node);
                    }
                }
            }

            // 2. Evaluate dynamic properties (visibility, disabled state)
            this._evaluateDynamicProperties(state);
        }

        /**
         * @private
         */
        _evaluateDynamicProperties(state) {
            for (const { element, node } of this.elements.values()) {
                // Visibility
                if (node.visibleIf) {
                    const isVisible = node.visibleIf(state);
                    element.style.display = isVisible ? '' : 'none';
                }

                // Disabled state
                if (node.disabledIf) {
                    const isDisabled = node.disabledIf(state);
                    const targets = element.matches('input, select, textarea, button') ? [element] : element.querySelectorAll('input, select, textarea, button');
                    targets.forEach((t) => (t.disabled = isDisabled));

                    // Style adjustments for containers
                    if (isDisabled) {
                        element.classList.add('is-disabled');
                        element.style.opacity = '0.5';
                        element.style.pointerEvents = 'none';
                    } else {
                        element.classList.remove('is-disabled');
                        element.style.opacity = '';
                        element.style.pointerEvents = '';
                    }
                }
            }
        }
    }

    const SchemaBuilder = {
        create(type, id, props = {}) {
            return { type, id, ...props };
        },
        Group(label, children, options = {}) {
            return { type: 'group', label, children, ...options };
        },
        Row(children, options = {}) {
            return { type: 'row', children, ...options };
        },
        Separator(options = {}) {
            return { type: 'separator', ...options };
        },
        Container(children, options = {}) {
            return { type: 'container', children, ...options };
        },
        Label(text, options = {}) {
            return { type: 'label', text, ...options };
        },
        Text(key, label, options = {}) {
            return { type: 'text', configKey: key, label, ...options };
        },
        TextArea(key, label, options = {}) {
            return { type: 'textarea', configKey: key, label, ...options };
        },
        Toggle(key, label, options = {}) {
            return { type: 'toggle', configKey: key, label, ...options };
        },
        Select(key, label, optionValues, options = {}) {
            return { type: 'select', configKey: key, label, options: optionValues, ...options };
        },
        Button(id, text, onClick, options = {}) {
            return { type: 'button', id, text, onClick, ...options };
        },
        CodeEditor(key, options = {}) {
            return { type: 'code-editor', configKey: key, ...options };
        },
        TextDisplay(key, options = {}) {
            return { type: 'text-display', configKey: key, ...options };
        },
    };

    /**
     * Registers standard UI components to the registry.
     */
    function registerFormComponents() {
        ComponentRegistry.register('group', {
            render(node, context) {
                const cls = context.styles;
                const className = node.className ? `${cls.submenuFieldset} ${node.className}` : cls.submenuFieldset;
                return h('fieldset', { className }, [h('legend', { title: node.title }, node.label)]);
            },
        });

        ComponentRegistry.register('row', {
            render(node, context) {
                const cls = context.styles;
                let className = cls.submenuRow;
                if (node.className) {
                    const mapped = cls[node.className]; // Check for mapped alias (e.g. topRow)
                    className = mapped ? mapped : `${className} ${node.className}`;
                }
                return h('div', { className });
            },
        });

        ComponentRegistry.register('separator', {
            render(node, context) {
                return h('div', { className: context.styles.submenuSeparator });
            },
        });

        ComponentRegistry.register('container', {
            render(node, context) {
                const cls = context.styles;
                let className = '';
                if (node.className) {
                    const mapped = cls[node.className];
                    className = mapped || node.className;
                }
                return h('div', { className });
            },
        });

        ComponentRegistry.register('label', {
            render(node) {
                return h('label', { htmlFor: node.for, title: node.title }, node.text);
            },
        });

        ComponentRegistry.register('select', {
            render(node, context) {
                const cls = context.styles;
                const select = h('select', { id: node.id, title: node.title, className: cls.selectInput });
                const options = resolveSelectOptions(node, context?.store?.getData?.());
                populateSelectOptions(select, options);
                if (node.label) {
                    return h('div', {}, [h('label', { title: node.title }, node.label), select]);
                }
                return select;
            },
            onUpdate(element, value, context, node) {
                const select = element.matches('select') ? element : element.querySelector('select');
                if (!select) return;
                const options = resolveSelectOptions(node, context?.store?.getData?.());
                populateSelectOptions(select, options);
                select.value = value;
                if (!options.find((opt) => opt.value === value) && options.length > 0 && context?.store) {
                    context.store.set(node.configKey, options[0].value);
                }
            },
        });

        ComponentRegistry.register('toggle', {
            render(node, context) {
                const cls = context.styles;
                return h('label', { className: cls.toggleSwitch, title: node.title }, [h('input', { type: 'checkbox', id: node.id }), h('span', { className: cls.toggleSlider })]);
            },
        });

        ComponentRegistry.register('button', {
            render(node, context) {
                const cls = context.styles;
                const btnClass = node.className ? `${cls.modalButton} ${node.className}` : cls.modalButton;
                return h(
                    'button',
                    {
                        id: node.id,
                        className: btnClass,
                        title: node.title,
                        type: 'button',
                        style: { width: node.fullWidth ? '100%' : 'auto' },
                        onclick: (e) => {
                            e.preventDefault();
                            if (node.onClick) node.onClick(e);
                        },
                    },
                    node.text
                );
            },
        });

        ComponentRegistry.register('text', {
            render(node, context) {
                const cls = context.styles;
                // Reuse selectInput style for text inputs to ensure consistency
                const input = h('input', { type: 'text', id: node.id, title: node.title, className: cls.selectInput });
                if (node.label) {
                    return h('div', {}, [h('label', { title: node.title }, node.label), input]);
                }
                return input;
            },
        });

        ComponentRegistry.register('textarea', {
            render(node, context) {
                const cls = context.styles;
                // Reuse selectInput style for textareas to ensure consistency
                const textarea = h('textarea', { id: node.id, rows: node.rows || 3, title: node.title, className: cls.selectInput });
                if (node.label) {
                    return h('div', {}, [h('label', { title: node.title }, node.label), textarea]);
                }
                return textarea;
            },
        });

        ComponentRegistry.register('code-editor', {
            manualBinding: true,
            render(node, context, engine) {
                // Use class from context if available, or fallback
                const cls = context.styles;
                return h('textarea', {
                    className: cls.editor || `${APPID}-json-editor`,
                    spellcheck: false,
                    oninput: (e) => {
                        engine.store.set(node.configKey, e.target.value);
                        if (node.onChange) node.onChange(e.target.value, engine.store.getData());
                    },
                });
            },
            onUpdate(element, value) {
                if (!(element instanceof HTMLTextAreaElement)) return;
                if (document.activeElement === element) return;
                element.value = value || '';
            },
        });

        ComponentRegistry.register('text-display', {
            manualBinding: true,
            render(node, context) {
                // Map className using context.styles if possible
                let className = node.className || '';
                if (context.styles && context.styles[node.className]) {
                    className = context.styles[node.className];
                } else if (node.className) {
                    // Fallback to raw class name if not in map
                    className = node.className;
                }
                return h('div', { className });
            },
            onUpdate(element, value) {
                if (value && typeof value === 'object') {
                    element.textContent = value.text || '';
                    element.style.color = value.color || '';
                    element.style.fontWeight = value.bold ? 'bold' : 'normal';
                    element.title = value.title || '';
                } else {
                    element.textContent = value || '';
                    element.style.color = '';
                    element.style.fontWeight = 'normal';
                    element.title = '';
                }
            },
        });

        ComponentRegistry.register('text-list', {
            manualBinding: true, // Required: Control own rendering

            render(node, context) {
                const cls = context.styles;
                // Return container only. Content is rendered in onUpdate.
                return h(`div.${cls.scrollableArea}`, {
                    dataset: { fingerprint: '' },
                });
            },

            onUpdate(element, value, context, node) {
                // Initialization check
                if (!context?.textEditor || !value) return;

                const { currentTexts, listFingerprint, focusedIndex } = value;
                const prevFingerprint = element.dataset.fingerprint;

                // Lazy Sync: Re-render only when Fingerprint (structure) changes
                // Text input (input event) does not change Fingerprint, so this block is skipped
                if (prevFingerprint === String(listFingerprint)) {
                    return;
                }

                // --- Re-render process ---
                element.replaceChildren(); // Clear (CSP safe)
                element.dataset.fingerprint = listFingerprint;
                const cls = context.styles;

                currentTexts.forEach((text, index) => {
                    const textItem = h(`div.${cls.textItem}`, { 'data-index': index }, [
                        // Drag handle
                        h(`div.${cls.dragHandle}`, { title: 'Drag to reorder', draggable: 'true' }, [createIconFromDef(StyleDefinitions.ICONS.dragHandle)]),
                        // Textarea
                        h('textarea', {
                            'data-index': index,
                            rows: 3,
                            value: text, // Initial value
                            // Input event: Update Store value but do NOT update Fingerprint (Avoid re-render)
                            oninput: (e) => {
                                context.textEditor._handleTextPixelInput(index, e.target.value);
                                // Auto resize
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            },
                            // Track focus to determine insertion point for 'New' button
                            onfocus: () => {
                                context.store.set('editor.focusedIndex', index);
                            },
                        }),
                        // Controls
                        h(`div.${cls.itemControls}`, [
                            h(`button.${cls.modalButton}.${cls.moveBtn}.move-up-btn`, { title: 'Move up', disabled: index === 0 }, [createIconFromDef(StyleDefinitions.ICONS.up)]),
                            h(`button.${cls.modalButton}.${cls.moveBtn}.move-down-btn`, { title: 'Move down', disabled: index === currentTexts.length - 1 }, [createIconFromDef(StyleDefinitions.ICONS.down)]),
                            h(`button.${cls.modalButton}.${cls.deleteBtn}.delete-btn`, { title: 'Delete' }, [createIconFromDef(StyleDefinitions.ICONS.delete)]),
                        ]),
                    ]);
                    element.appendChild(textItem);
                });

                // Auto resize (for initial display)
                requestAnimationFrame(() => {
                    element.querySelectorAll('textarea').forEach((ta) => {
                        ta.style.height = 'auto';
                        ta.style.height = `${ta.scrollHeight}px`;
                    });

                    // Restore focus
                    if (focusedIndex >= 0 && focusedIndex < currentTexts.length) {
                        const target = element.querySelector(`textarea[data-index="${focusedIndex}"]`);
                        if (target) {
                            target.focus();
                            // Set cursor to end
                            const len = target.value.length;
                            target.setSelectionRange(len, len);
                        }
                    }
                });
            },
        });

        ComponentRegistry.register('text-editor-header', {
            manualBinding: true,
            render(node, context) {
                return context?.textEditor?._createHeaderControls() || null;
            },
            onUpdate(element, value, context, node) {
                if (!context?.textEditor || !value) return;

                // --- Add guard to prevent unnecessary re-renders ---
                const { activeProfile, activeCategory, mode, targetType, lastUpdated } = value;
                const newRenderState = JSON.stringify({ p: activeProfile, c: activeCategory, m: mode, t: targetType, u: lastUpdated });

                if (element.dataset.renderState === newRenderState) {
                    return;
                }
                element.dataset.renderState = newRenderState;
                // ---------------------------------------

                const { cachedConfig } = context.textEditor;
                if (!cachedConfig) return;

                const cls = context.styles;
                const isAnyRenaming = mode === 'rename';
                const isAnyDeleting = mode === 'delete_confirm';
                const isAnyActionInProgress = isAnyRenaming || isAnyDeleting;

                // Get profile and category keys
                const profiles = cachedConfig.texts || [];
                const profileKeys = profiles.map((p) => p.name);

                const activeProfileObj = profiles.find((p) => p.name === activeProfile);
                const categories = activeProfileObj ? activeProfileObj.categories : [];
                const categoryKeys = categories.map((c) => c.name);

                // Update logic per row
                const updateRow = (type, keys, activeKey) => {
                    const row = element.querySelector(`.${cls.headerRow}[data-type="${type}"]`);
                    if (!row) return;

                    const isRenamingThis = isAnyRenaming && targetType === type;
                    const isDeletingThis = isAnyDeleting && targetType === type;
                    const isTargetDisabled = isAnyActionInProgress && targetType !== type;

                    row.classList.toggle('is-disabled', isTargetDisabled);

                    const select = row.querySelector('select');
                    const renameInput = row.querySelector('input[type="text"]');
                    const mainActions = row.querySelector(`.${cls.mainActions}`);
                    const renameActions = row.querySelector(`.${cls.renameActions}`);
                    const deleteConfirmGroup = row.querySelector(`.${cls.deleteConfirmGroup}`);

                    // Toggle Select / Input display
                    select.style.display = isRenamingThis ? 'none' : 'block';
                    renameInput.style.display = isRenamingThis ? 'block' : 'none';

                    // Toggle button area display
                    mainActions.style.visibility = !isRenamingThis && !isDeletingThis ? 'visible' : 'hidden';
                    renameActions.style.display = isRenamingThis ? 'flex' : 'none';
                    deleteConfirmGroup.style.display = isDeletingThis ? 'flex' : 'none';

                    // Update Select options (only when not renaming)
                    if (!isRenamingThis) {
                        const currentScroll = select.scrollTop;
                        // Check for diff update (simple)
                        const newSignature = keys.join('|');
                        if (select.dataset.signature !== newSignature || select.value !== activeKey) {
                            select.textContent = '';
                            keys.forEach((key, index) => select.appendChild(h('option', { value: key }, `${index + 1}. ${key}`)));
                            select.dataset.signature = newSignature;
                        }
                        select.value = activeKey;
                        select.scrollTop = currentScroll;
                    } else {
                        renameInput.value = activeKey;
                    }

                    // Button activity control
                    const upBtn = row.querySelector(`#${APPID}-${type}-up-btn`);
                    const downBtn = row.querySelector(`#${APPID}-${type}-down-btn`);
                    const deleteBtn = row.querySelector(`#${APPID}-${type}-delete-btn`);
                    const newBtn = row.querySelector(`#${APPID}-${type}-new-btn`);
                    const copyBtn = row.querySelector(`#${APPID}-${type}-copy-btn`);
                    const renameBtn = row.querySelector(`#${APPID}-${type}-rename-btn`);
                    const index = keys.indexOf(activeKey);

                    if (upBtn) upBtn.disabled = isAnyActionInProgress || index <= 0;
                    if (downBtn) downBtn.disabled = isAnyActionInProgress || index >= keys.length - 1;
                    if (deleteBtn) deleteBtn.disabled = isAnyActionInProgress || keys.length <= 1;
                    if (newBtn) newBtn.disabled = isAnyActionInProgress;
                    if (copyBtn) copyBtn.disabled = isAnyActionInProgress;
                    if (renameBtn) renameBtn.disabled = isAnyActionInProgress;
                };

                updateRow('profile', profileKeys, activeProfile);
                updateRow('category', categoryKeys, activeCategory);

                // Control the entire modal (footer buttons, etc.)
                const modalElement = context.textEditor.modal.element;
                const scrollArea = modalElement.querySelector(`.${cls.scrollableArea}`);

                if (scrollArea) scrollArea.classList.toggle('is-disabled', isAnyActionInProgress);

                const setDisabled = (selector, disabled) => {
                    const el = modalElement.querySelector(selector);
                    if (el) el.disabled = disabled;
                };

                setDisabled(`#${APPID}-text-new-btn`, isAnyActionInProgress);
                setDisabled(`#${APPID}-editor-modal-apply-btn`, isAnyActionInProgress);
                setDisabled(`#${APPID}-editor-modal-save-btn`, isAnyActionInProgress);
                setDisabled(`#${APPID}-editor-modal-cancel-btn`, isAnyActionInProgress);
            },
        });
    }

    function resolveSelectOptions(node, data) {
        if (typeof node.options === 'function') {
            return normalizeOptions(node.options(data));
        }
        return normalizeOptions(node.options || []);
    }

    function normalizeOptions(options) {
        return (options || []).map((opt) => {
            if (typeof opt === 'string') {
                return { value: opt, label: opt };
            }
            return { value: opt.value, label: opt.label ?? opt.value };
        });
    }

    function populateSelectOptions(select, options) {
        const signature = JSON.stringify(options);
        if (select.dataset.optionsSignature === signature) return;
        select.dataset.optionsSignature = signature;
        select.textContent = '';
        options.forEach((opt) => select.appendChild(h('option', { value: opt.value }, opt.label)));
    }

    registerFormComponents();

    // =================================================================================
    // SECTION: Configuration Processor
    // Description: Handles validation, sanitization, and merging of configuration data.
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

            if (isObject(userConfig)) {
                // 2. Merge user config into default config.
                // resolveConfig enforces the structure of completeConfig (DEFAULT_CONFIG),
                // automatically ignoring keys like 'system' that don't exist in the default.
                resolveConfig(completeConfig, userConfig);
            }

            // 3. Sanitize specific structures (Deep validation & Migration for texts)
            // Even if 'texts' was overwritten with an old object format by resolveConfig,
            // _sanitizeTexts handles the migration to array format.
            completeConfig.texts = this._sanitizeTexts(completeConfig.texts);

            // 4. Validate Options (Consistency check)
            this._validateOptions(completeConfig);

            return completeConfig;
        },

        /**
         * Migrates old object-based texts structure to new array-based structure.
         * @param {object} oldTexts The old texts object.
         * @returns {Array} The new texts array.
         */
        _migrateTexts(oldTexts) {
            if (!isObject(oldTexts)) return [];
            return Object.keys(oldTexts).map((profileName) => {
                const profileObj = oldTexts[profileName] || {};
                const categories = Object.keys(profileObj).map((catName) => ({
                    name: catName,
                    items: Array.isArray(profileObj[catName]) ? profileObj[catName] : [],
                }));
                return {
                    name: profileName,
                    categories: categories,
                };
            });
        },

        /**
         * Sanitizes the nested texts structure.
         * Handles migration from Object to Array and enforces unique names.
         * @param {object|Array} texts
         * @returns {Array} Sanitized texts array
         */
        _sanitizeTexts(texts) {
            // 1. Migration: Convert object to array if necessary
            const profiles = Array.isArray(texts) ? texts : this._migrateTexts(texts);

            // 2. Sanitize contents
            const sanitizedProfiles = [];
            const usedProfileNames = new Set();

            for (const profile of profiles) {
                if (!isObject(profile)) continue;

                let pName = String(profile.name || 'Untitled Profile').trim();
                if (!pName) pName = 'Untitled Profile';

                // Unique Profile Name Enforcement
                if (usedProfileNames.has(pName)) {
                    let counter = 2;
                    while (usedProfileNames.has(`${pName} ${counter}`)) counter++;
                    pName = `${pName} ${counter}`;
                }
                usedProfileNames.add(pName);

                // Sanitize Categories
                const rawCategories = Array.isArray(profile.categories) ? profile.categories : [];
                const sanitizedCategories = [];
                const usedCatNames = new Set();

                for (const cat of rawCategories) {
                    if (!isObject(cat)) continue;

                    let cName = String(cat.name || 'Untitled Category').trim();
                    if (!cName) cName = 'Untitled Category';

                    // Unique Category Name Enforcement
                    if (usedCatNames.has(cName)) {
                        let counter = 2;
                        while (usedCatNames.has(`${cName} ${counter}`)) counter++;
                        cName = `${cName} ${counter}`;
                    }
                    usedCatNames.add(cName);

                    // Sanitize Items
                    const rawItems = Array.isArray(cat.items) ? cat.items : [];
                    const items = rawItems.map((item) => {
                        if (typeof item !== 'string') {
                            Logger.warn('SANITIZER', LOG_STYLES.YELLOW, `Sanitizing invalid text entry: Item in category "${cName}" was not a string.`);
                            return String(item);
                        }
                        return item;
                    });

                    sanitizedCategories.push({
                        name: cName,
                        items: items,
                    });
                }

                // Ensure there's at least one category
                if (sanitizedCategories.length === 0) {
                    Logger.warn('SANITIZER', LOG_STYLES.YELLOW, `Profile "${pName}" has no categories. Adding a default category.`);
                    sanitizedCategories.push({ name: 'New Category', items: [] });
                }

                sanitizedProfiles.push({
                    name: pName,
                    categories: sanitizedCategories,
                });
            }

            // Ensure there's at least one profile.
            if (sanitizedProfiles.length === 0) {
                Logger.warn('', '', 'Configuration resulted in no profiles after sanitization. Restoring default texts structure.');
                // Restore from default config (already array structure)
                return deepClone(DEFAULT_CONFIG.texts);
            }

            return sanitizedProfiles;
        },

        /**
         * Validates and corrects option values based on the sanitized config.
         * @param {object} config
         */
        _validateOptions(config) {
            // Ensure options object exists
            if (!config.options) {
                config.options = deepClone(DEFAULT_CONFIG.options);
            }

            // Validate activeProfileName (against Array structure)
            const activeProfileName = config.options.activeProfileName;
            const profileExists = config.texts.some((p) => p.name === activeProfileName);

            if (!profileExists) {
                const fallback = config.texts.length > 0 ? config.texts[0].name : null;
                Logger.info('CONFIG', LOG_STYLES.YELLOW, `Active profile "${activeProfileName || 'undefined'}" not found. Falling back to "${fallback}".`);
                config.options.activeProfileName = fallback;
            }

            // Validate logger_level
            const validLevels = Object.keys(Logger.levels);
            if (!config.developer || !validLevels.includes(config.developer.logger_level)) {
                Logger.warn('CONFIG', LOG_STYLES.YELLOW, `Invalid or missing logger_level. Resetting to default '${DEFAULT_CONFIG.developer.logger_level}'.`);
                if (!config.developer) config.developer = {};
                config.developer.logger_level = DEFAULT_CONFIG.developer.logger_level;
            }
        },
    };

    // =================================================================================
    // SECTION: Configuration Management (GM Storage)
    // =================================================================================

    class ConfigManager extends BaseManager {
        constructor() {
            super();
            this.CONFIG_KEY = CONSTANTS.CONFIG_KEY;
            this.DEFAULT_CONFIG = DEFAULT_CONFIG;
            /** @type {object|null} */
            this.config = null;
        }

        /**
         * @returns {object|null} The current configuration object.
         */
        get() {
            return this.config;
        }

        /**
         * Loads the configuration from storage, delegates processing to ConfigProcessor.
         */
        async load() {
            const raw = await GM_getValue(this.CONFIG_KEY);
            let userConfig = null;
            if (raw) {
                try {
                    userConfig = JSON.parse(raw);
                } catch (e) {
                    Logger.error('LOAD FAILED', LOG_STYLES.RED, 'Failed to parse configuration. Using default settings.', e);
                    userConfig = null;
                }
            }
            this.config = ConfigProcessor.process(userConfig);
        }

        /**
         * Processes via ConfigProcessor, checks size, and saves to storage.
         * @param {object} obj The configuration object to save.
         */
        async save(obj) {
            const completeConfig = ConfigProcessor.process(obj);

            // Size Check
            const validation = this.validateConfigSize(completeConfig);
            if (!validation.isValid) {
                EventBus.publish(EVENTS.CONFIG_SIZE_EXCEEDED, { message: validation.message });
                throw new Error(validation.message);
            }

            const jsonString = JSON.stringify(completeConfig);
            this.config = completeConfig;
            await GM_setValue(this.CONFIG_KEY, jsonString);
            EventBus.publish(EVENTS.CONFIG_SAVE_SUCCESS);
        }

        /**
         * Decodes a raw string from storage into a user configuration object.
         * @param {string | null} rawValue The raw string from GM_getValue.
         * @returns {Promise<object | null>} The parsed user configuration object, or null if parsing fails.
         */
        async decode(rawValue) {
            if (!rawValue) return null;
            try {
                const parsed = JSON.parse(rawValue);
                if (isObject(parsed)) {
                    return parsed;
                }
                return null;
            } catch (e) {
                Logger.error('LOAD FAILED', LOG_STYLES.RED, `Failed to parse raw value. Error: ${e.message}`);
                return null;
            }
        }

        /**
         * Validates if the given configuration object is within the storage size limit.
         * @param {object} configObj - The configuration object to check.
         * @returns {{ isValid: boolean, message: string | null }}
         */
        validateConfigSize(configObj) {
            const jsonString = JSON.stringify(configObj);
            const configSize = new Blob([jsonString]).size;

            if (configSize > CONSTANTS.CONFIG_SIZE_LIMIT_BYTES) {
                const sizeInMB = (configSize / 1024 / 1024).toFixed(2);
                const limitInMB = (CONSTANTS.CONFIG_SIZE_LIMIT_BYTES / 1024 / 1024).toFixed(1);
                const message = `Configuration size (${sizeInMB} MB) exceeds the ${limitInMB} MB limit.\nChanges are not saved.`;
                return { isValid: false, message };
            }

            return { isValid: true, message: null };
        }
    }

    // =================================================================================
    // SECTION: UI Elements - Components and Manager
    // =================================================================================

    /**
     * @class CustomModal
     * @description A reusable, promise-based modal component. It provides a flexible
     * structure with header, content, and footer sections, and manages its own
     * lifecycle and styles using StyleManager.
     */
    class CustomModal {
        /**
         * @param {object} [options]
         * @param {string} [options.title=''] - The title displayed in the modal header.
         * @param {string} [options.width='500px'] - The width of the modal.
         * @param {boolean} [options.closeOnBackdropClick=true] - Whether to close the modal when clicking the backdrop.
         * @param {Array<object>} [options.buttons=[]] - An array of button definitions for the footer.
         * @param {function(): void} [options.onDestroy] - A callback function executed when the modal is destroyed.
         * @param {{text: string, id: string, className: string, onClick: (modalInstance: CustomModal, event: Event) => void}} options.buttons[]
         */
        constructor(options = {}) {
            this.options = {
                title: '',
                width: 'min(500px, 95vw)', // Responsive default
                closeOnBackdropClick: true,
                buttons: [],
                onDestroy: null,
                ...options,
            };
            this.style = StyleManager.request(StyleDefinitions.getModal);
            this.commonStyle = StyleManager.request(StyleDefinitions.getCommon);
            this.element = null;
            this.dom = {}; // To hold references to internal elements like header, content, footer
            this._createModalElement();
        }

        _createModalElement() {
            const cls = this.style.classes;
            const commonCls = this.commonStyle.classes;

            // Define variables to hold references to key elements.
            let header, headerTitle, headerContent, content, footer, modalBox, footerMessage;
            // Create footer buttons declaratively using map and h().
            const buttons = this.options.buttons.map((btnDef) => {
                // Merge passed className with the common modal button class
                const fullClassName = [commonCls.modalButton, btnDef.className].filter(Boolean).join(' ');
                return h(
                    'button',
                    {
                        id: btnDef.id,
                        className: fullClassName,
                        onclick: (e) => btnDef.onClick(this, e),
                    },
                    btnDef.text
                );
            });

            const buttonGroup = h(`div.${cls.buttonGroup}`, buttons);

            // Create the entire modal structure using h().
            this.element = h(
                `dialog.${cls.dialog}`,
                (modalBox = h(`div.${cls.box}`, { style: { width: this.options.width } }, [
                    (header = h(`div.${cls.header}`, [(headerTitle = h('div', this.options.title)), (headerContent = h('div'))])),
                    (content = h(`div.${cls.content}`)),
                    (footer = h(`div.${cls.footer}`, [(footerMessage = h(`div.${cls.footerMessage}`)), buttonGroup])),
                ]))
            );

            // The 'close' event is the single source of truth for when the dialog has been dismissed.
            this.element.addEventListener('close', () => this.destroy());

            if (this.options.closeOnBackdropClick) {
                this.element.addEventListener('click', (e) => {
                    if (e.target === this.element) {
                        this.close();
                    }
                });
            }

            // Store references and append the final element to the body.
            this.dom = { header, headerTitle, headerContent, content, footer, modalBox, footerMessage };
            document.body.appendChild(this.element);
        }

        show(anchorElement = null) {
            if (this.element instanceof HTMLDialogElement && typeof this.element.showModal === 'function') {
                if (this.element.open) return; // Prevent InvalidStateError

                this.element.showModal();
                // Positioning logic
                if (anchorElement && typeof anchorElement.getBoundingClientRect === 'function') {
                    // ANCHORED POSITIONING
                    const modalBox = this.dom.modalBox;
                    const btnRect = anchorElement.getBoundingClientRect();
                    const margin = 8;
                    // Use actual offsetWidth if available, otherwise fallback to a safe fixed value (500)
                    const modalWidth = modalBox.offsetWidth || 500;
                    const modalHeight = modalBox.offsetHeight;

                    let left = btnRect.left;
                    let top = btnRect.bottom + 4;

                    if (left + modalWidth > window.innerWidth - margin) {
                        left = window.innerWidth - modalWidth - margin;
                    }

                    // Vertical collision detection & adjustment
                    if (top + modalHeight > window.innerHeight - margin) {
                        // Try positioning above the anchor
                        const topAbove = btnRect.top - modalHeight - 4;
                        if (topAbove > margin) {
                            top = topAbove;
                        } else {
                            // If it doesn't fit above, pin to the bottom edge of the window
                            top = window.innerHeight - modalHeight - margin;
                        }
                    }

                    Object.assign(this.element.style, {
                        position: 'absolute',
                        left: `${Math.max(left, margin)}px`,
                        top: `${Math.max(top, margin)}px`,
                        margin: '0',
                        transform: 'none',
                    });
                } else {
                    // DEFAULT CENTERING
                    Object.assign(this.element.style, {
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        margin: '0',
                    });
                }
            }
        }

        close() {
            if (this.element instanceof HTMLDialogElement && this.element.open) {
                this.element.close();
            }
        }

        destroy() {
            if (!this.element) return;
            this.element.remove();
            this.element = null;

            if (this.options.onDestroy) {
                this.options.onDestroy();
            }
        }

        setContent(element) {
            this.dom.content.textContent = '';
            this.dom.content.appendChild(element);
        }

        setHeader(element) {
            this.dom.headerContent.textContent = '';
            this.dom.headerContent.appendChild(element);
        }

        getContentContainer() {
            return this.dom.content;
        }
    }

    /**
     * @abstract
     * @description Base class for a settings panel/submenu UI component.
     */
    class SettingsPanelBase extends UIComponentBase {
        constructor(callbacks) {
            super(callbacks);
            this.debouncedSave = debounce(this._handleDebouncedSave.bind(this), 300, true);
            this._handleDocumentClick = this._handleDocumentClick.bind(this);
            this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);
            this._handleConfigUpdate = this._handleConfigUpdate.bind(this);
        }

        _onInit() {
            this._subscribe(EVENTS.CONFIG_UPDATED, this._handleConfigUpdate);
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this.hide();
            this.debouncedSave.cancel();
            super._onDestroy();
        }

        /**
         * @private
         * Collects data and calls the onSave callback. Designed to be debounced.
         */
        async _handleDebouncedSave() {
            const newConfig = await this._collectDataFromForm();
            try {
                await this.callbacks.onSave?.(newConfig);
            } catch (e) {
                // Log the error to console. User notification is handled via EventBus (CONFIG_SIZE_EXCEEDED).
                Logger.error('SAVE FAILED', LOG_STYLES.RED, 'SettingsPanel save failed:', e);
            }
        }

        /**
         * @private
         * Handles the CONFIG_UPDATED event to refresh the form if the panel is open.
         * @param {object} newConfig The updated configuration object from the event payload.
         */
        async _handleConfigUpdate(newConfig) {
            if (this.isOpen()) {
                Logger.debug('UI REFRESH', LOG_STYLES.CYAN, 'Settings panel is open, refreshing form due to config update.');
                // Pass the received config directly to populateForm
                await this.populateForm(newConfig);
            }
        }

        render() {
            this._injectStyles();
            this.element = this._createPanelContainer();
            const content = this._createPanelContent();
            this.element.appendChild(content);

            document.body.appendChild(this.element);
            this._setupEventListeners();
            return this.element;
        }

        toggle() {
            const shouldShow = this.element.style.display === 'none';
            if (shouldShow) {
                this.show();
            } else {
                this.hide();
            }
        }

        isOpen() {
            return this.element && this.element.style.display !== 'none';
        }

        async show() {
            if (this.isOpen()) return; // Prevent re-entry

            await this.populateForm();
            const anchorRect = this.callbacks.getAnchorElement().getBoundingClientRect();

            let top = anchorRect.bottom + 4;
            let left = anchorRect.left;

            this.element.style.display = 'block';
            const panelWidth = this.element.offsetWidth;
            const panelHeight = this.element.offsetHeight;

            if (left + panelWidth > window.innerWidth - 8) {
                left = window.innerWidth - panelWidth - 8;
            }
            if (top + panelHeight > window.innerHeight - 8) {
                top = window.innerHeight - panelHeight - 8;
            }

            this.element.style.left = `${Math.max(8, left)}px`;
            this.element.style.top = `${Math.max(8, top)}px`;
            document.addEventListener('click', this._handleDocumentClick, true);
            document.addEventListener('keydown', this._handleDocumentKeydown, true);
        }

        hide() {
            this.element.style.display = 'none';
            document.removeEventListener('click', this._handleDocumentClick, true);
            document.removeEventListener('keydown', this._handleDocumentKeydown, true);
        }

        _createPanelContainer() {
            return h(`div#${APPID}-settings-panel`, { style: { display: 'none' }, role: 'menu' });
        }

        _handleDocumentClick(e) {
            const anchor = this.callbacks.getAnchorElement();
            if (this.element && !this.element.contains(e.target) && anchor && !anchor.contains(e.target)) {
                this.hide();
            }
        }

        _handleDocumentKeydown(e) {
            if (e.key === 'Escape') {
                this.hide();
            }
        }

        // --- Abstract methods to be implemented by subclasses ---
        _createPanelContent() {
            throw new Error('Subclass must implement _createPanelContent()');
        }
        _injectStyles() {
            throw new Error('Subclass must implement _injectStyles()');
        }
        populateForm(config) {
            throw new Error('Subclass must implement populateForm()');
        }
        _collectDataFromForm() {
            throw new Error('Subclass must implement _collectDataFromForm()');
        }
        _setupEventListeners() {
            throw new Error('Subclass must implement _setupEventListeners()');
        }
    }

    class SettingsPanelComponent extends SettingsPanelBase {
        constructor(callbacks) {
            super(callbacks);
            this.engine = null;
            this.formContainer = null;
            this.store = new ReactiveStore(DEFAULT_CONFIG);
            this.isPopulating = false;
            this.styleHandle = null;
            this.commonStyleHandle = null;
            this.warningState = null;

            // Delegate subscription management to the base class
            this.addStoreSubscription(
                this.store.subscribe((state, changedPath) => {
                    // Prevent infinite loop: do not trigger save if the change is internal (system state)
                    if (changedPath && changedPath.startsWith('system')) return;

                    if (!this.isPopulating) {
                        this.debouncedSave();
                    }
                })
            );
        }

        _onInit() {
            super._onInit();
            this._subscribe(EVENTS.CONFIG_SIZE_EXCEEDED, ({ message }) => {
                this.warningState = { text: message };
                if (this.store) {
                    this.store.set('system.warning', this.warningState);
                }
            });
            this._subscribe(EVENTS.CONFIG_SAVE_SUCCESS, () => {
                this.warningState = null;
                if (this.store) {
                    this.store.set('system.warning', null);
                }
            });
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this.engine?.destroy();
            this.engine = null;
            super._onDestroy();
        }

        _injectStyles() {
            this.styleHandle = StyleManager.request(StyleDefinitions.getSettingsPanel);
            this.commonStyleHandle = StyleManager.request(StyleDefinitions.getCommon);
        }

        _createPanelContainer() {
            const cls = this.styleHandle.classes;
            return h(`div#${cls.panel}`, { style: { display: 'none' }, role: 'menu' });
        }

        _getPanelSchema() {
            // Note: Schema uses logical class names mapped in StyleDefinitions
            return [
                SchemaBuilder.TextDisplay('system.warning', {
                    className: 'warningBanner',
                    visibleIf: (data) => !!data?.system?.warning,
                }),
                SchemaBuilder.Group(
                    'Default Profile',
                    [
                        SchemaBuilder.Select('options.activeProfileName', null, (data) => (data?.texts || []).map((p) => p.name), {
                            id: `${APPID}-profile-select`,
                            title: 'Select the default profile loaded on startup.',
                        }),
                    ],
                    { title: 'Select the default profile loaded on startup.' }
                ),
                SchemaBuilder.Container(
                    [
                        SchemaBuilder.Group(
                            'Texts',
                            [
                                SchemaBuilder.Button(
                                    `${APPID}-submenu-edit-texts-btn`,
                                    'Edit Texts...',
                                    () => {
                                        this.callbacks.onShowTextEditorModal?.();
                                        this.hide();
                                    },
                                    { fullWidth: true, title: 'Open the text editor.' }
                                ),
                            ],
                            { title: 'Open the text editor.' }
                        ),
                        SchemaBuilder.Group(
                            'JSON',
                            [
                                SchemaBuilder.Button(
                                    `${APPID}-submenu-json-btn`,
                                    'JSON...',
                                    () => {
                                        this.callbacks.onShowJsonModal?.();
                                        this.hide();
                                    },
                                    {
                                        fullWidth: true,
                                        title: 'Import, export, or edit settings via JSON.',
                                    }
                                ),
                            ],
                            { title: 'Import, export, or edit settings via JSON.' }
                        ),
                    ],
                    { className: 'topRow' } // Mapped to cls.topRow
                ),
                SchemaBuilder.Group(
                    'Options',
                    [
                        SchemaBuilder.Row([
                            SchemaBuilder.Label('Trigger Mode', { for: `${APPID}-opt-trigger-mode`, title: 'Choose how to open the text list.' }),
                            SchemaBuilder.Select(
                                'options.trigger_mode',
                                null,
                                [
                                    { value: 'click', label: 'Click' },
                                    { value: 'hover', label: 'Hover' },
                                ],
                                {
                                    id: `${APPID}-opt-trigger-mode`,
                                    title: '"Click" opens on click, "Hover" opens on mouse over.',
                                }
                            ),
                        ]),
                        SchemaBuilder.Row([
                            SchemaBuilder.Label('Enable Shortcut to Trigger (Alt+Q)', {
                                for: `${APPID}-opt-enable-shortcut`,
                                title: 'Enables the keyboard shortcut (Alt+Q) to toggle the Text List.',
                            }),
                            SchemaBuilder.Toggle('options.enable_shortcut', null, {
                                id: `${APPID}-opt-enable-shortcut`,
                                title: 'Enables the keyboard shortcut (Alt+Q) to toggle the Text List.',
                            }),
                        ]),
                        SchemaBuilder.Container(
                            [
                                SchemaBuilder.Button(
                                    `${APPID}-submenu-shortcut-btn`,
                                    'Shortcuts & Controls',
                                    () => {
                                        this.callbacks.onShowShortcutModal?.();
                                        this.hide();
                                    },
                                    { title: 'Show the keyboard shortcuts cheat sheet.' }
                                ),
                            ],
                            { className: 'submenuRow' }
                        ),
                        SchemaBuilder.Separator(),
                        SchemaBuilder.Row([
                            SchemaBuilder.Label('Insertion position', {
                                for: `${APPID}-opt-insertion-position`,
                                title: 'Determines where the text is inserted in the input field.',
                            }),
                            SchemaBuilder.Select(
                                'options.insertion_position',
                                null,
                                [
                                    { value: 'start', label: 'Start' },
                                    { value: 'cursor', label: 'Cursor' },
                                    { value: 'end', label: 'End' },
                                ],
                                {
                                    id: `${APPID}-opt-insertion-position`,
                                    title: 'Determines where the text is inserted in the input field.',
                                }
                            ),
                        ]),
                        SchemaBuilder.Row([
                            SchemaBuilder.Label('Insert newline before text', {
                                for: `${APPID}-opt-insert-before-newline`,
                                title: 'Automatically add a newline before the pasted text.',
                            }),
                            SchemaBuilder.Toggle('options.insert_before_newline', null, {
                                id: `${APPID}-opt-insert-before-newline`,
                                title: 'Adds a newline character before the inserted text.',
                            }),
                        ]),
                        SchemaBuilder.Row([
                            SchemaBuilder.Label('Insert newline after text', {
                                for: `${APPID}-opt-insert-after-newline`,
                                title: 'Automatically add a newline after the pasted text.',
                            }),
                            SchemaBuilder.Toggle('options.insert_after_newline', null, {
                                id: `${APPID}-opt-insert-after-newline`,
                                title: 'Adds a newline character after the inserted text.',
                            }),
                        ]),
                        SchemaBuilder.Container(
                            [SchemaBuilder.Label("Note: Option behavior may depend on the input field's state (focus and existing content). For consistent results, click an insert button while the input field is focused.")],
                            {
                                className: 'settingsNote', // Mapped to cls.settingsNote
                            }
                        ),
                    ],
                    { title: 'Configure general options and behavior.' }
                ),
            ];
        }

        _createPanelContent() {
            this.formContainer = h('div');
            return this.formContainer;
        }

        /**
         * Populates the settings form with configuration data.
         * Uses the provided config object if available, otherwise fetches the current config.
         * @param {object} [config] - Optional. The configuration object to use for population.
         */
        async populateForm(config) {
            const currentConfig = config || (await this.callbacks.getCurrentConfig());
            if (!currentConfig || !currentConfig.options) return;

            this.isPopulating = true;

            // Merge current config with warning state if present
            const storeData = deepClone(currentConfig);
            if (this.warningState) {
                storeData.system = { warning: this.warningState };
            } else {
                storeData.system = { warning: null };
            }

            // If the engine already exists, update the state instead of rebuilding the DOM.
            if (this.engine) {
                this.store.replaceState(storeData);
                this.isPopulating = false;
                return;
            }

            if (this.formContainer) {
                this.formContainer.textContent = '';
            }

            this.store.replaceState(storeData);

            const schema = this._getPanelSchema();
            // Merge styles: Common classes take precedence or serve as base, SettingsPanel classes add specifics
            const cls = { ...this.commonStyleHandle.classes, ...this.styleHandle.classes };
            const context = { styles: cls, store: this.store };

            this.engine = new FormEngine(this.store, schema, context);

            if (this.formContainer) {
                this.formContainer.appendChild(this.engine.render());
            }

            this.isPopulating = false;
        }

        async _collectDataFromForm() {
            return this.store.getData();
        }

        _setupEventListeners() {
            // Handled by FormEngine and schema onClick handlers.
        }
    }

    /**
     * Manages the Text Settings modal by leveraging the CustomModal component.
     */
    class TextEditorModalComponent extends UIComponentBase {
        constructor(callbacks) {
            super(callbacks);
            this.modal = null;
            this.store = null;
            this.headerEngine = null;
            this.contentEngine = null;
            this.draggedIndex = null;
            this.cachedConfig = null; // Config cache for Store synchronization
            this.styleHandle = null;
            this.commonStyleHandle = null;
        }

        _onInit() {
            // Subscribe to size exceeded event to show error in footer
            this._subscribe(EVENTS.CONFIG_SIZE_EXCEEDED, ({ message }) => {
                const footerMessage = this.modal?.dom?.footerMessage;
                if (footerMessage) {
                    footerMessage.textContent = message;
                    footerMessage.style.color = `var(${StyleDefinitions.VARS.TEXT_DANGER})`;
                }
            });

            // Subscribe to save success event to clear footer
            this._subscribe(EVENTS.CONFIG_SAVE_SUCCESS, () => {
                const footerMessage = this.modal?.dom?.footerMessage;
                if (footerMessage) {
                    footerMessage.textContent = '';
                    footerMessage.style.color = '';
                }
            });
        }

        _checkConfigSize() {
            if (!this.cachedConfig || !this.modal?.dom?.footerMessage) return;

            const validation = this.callbacks.checkConfigSize(this.cachedConfig);

            if (!validation.isValid) {
                const footerMessage = this.modal.dom.footerMessage;
                footerMessage.textContent = validation.message;
                footerMessage.style.color = `var(${StyleDefinitions.VARS.TEXT_DANGER})`;
            }
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this.modal?.destroy();
            super._onDestroy();
        }

        render() {
            this.styleHandle = StyleManager.request(StyleDefinitions.getTextEditorModal);
            this.commonStyleHandle = StyleManager.request(StyleDefinitions.getCommon);
        }

        async open(targetProfile, targetCategoryKey) {
            if (this.modal || this.isOpening) return; // Prevent re-entry

            // Ensure styles are ready
            if (!this.styleHandle) this.render();

            this.isOpening = true;

            try {
                const cls = this.styleHandle.classes;
                const commonCls = this.commonStyleHandle.classes;

                // Load and cache initial config
                const globalConfig = await this.callbacks.getCurrentConfig();
                this.cachedConfig = deepClone(globalConfig);

                if (!this.cachedConfig || !this.cachedConfig.texts) return;

                // Determine initial display position
                const profiles = this.cachedConfig.texts;
                const initialProfileName = targetProfile || this.cachedConfig.options.activeProfileName || profiles[0]?.name;
                const validProfileObj = profiles.find((p) => p.name === initialProfileName) || profiles[0];
                const validProfile = validProfileObj?.name;

                const categories = validProfileObj?.categories || [];
                let initialCategory = categories[0]?.name || null;

                if (targetCategoryKey && categories.some((c) => c.name === targetCategoryKey)) {
                    initialCategory = targetCategoryKey;
                }

                this.callbacks.onModalOpenStateChange?.(true);

                // Initialize Store
                this.store = new ReactiveStore({
                    editor: {
                        activeProfile: validProfile,
                        activeCategory: initialCategory,
                        mode: 'normal', // 'normal' | 'rename' | 'delete_confirm'
                        targetType: null, // 'profile' | 'category'
                        targetKey: null,
                        currentTexts: [], // Initial value will be loaded later
                        listFingerprint: 0,
                        focusedIndex: -1,
                    },
                });

                this.modal = new CustomModal({
                    title: `${APPNAME} - Settings`,
                    width: 'min(880px, 95vw)',
                    closeOnBackdropClick: false,
                    buttons: [
                        { text: 'Cancel', id: `${APPID}-editor-modal-cancel-btn`, className: '', title: 'Discard changes and close the modal.', onClick: () => this.close() },
                        { text: 'Apply', id: `${APPID}-editor-modal-apply-btn`, className: '', title: 'Save changes and keep the modal open.', onClick: () => this._handleSaveAction(false) },
                        { text: 'Save', id: `${APPID}-editor-modal-save-btn`, className: commonCls.primaryBtn, title: 'Save changes and close the modal.', onClick: () => this._handleSaveAction(true) },
                    ],
                    onDestroy: () => {
                        this.callbacks.onModalOpenStateChange?.(false);
                        this.headerEngine?.destroy();
                        this.contentEngine?.destroy();
                        this.headerEngine = null;
                        this.contentEngine = null;
                        this.store = null;
                        this.modal = null;
                        this.cachedConfig = null;
                    },
                });

                // Context for FormEngine, providing styles and store reference
                const context = {
                    textEditor: this,
                    store: this.store,
                    styles: { ...commonCls, ...cls }, // Merge styles for usage in child components
                };

                // Header engine setup
                this.headerEngine = new FormEngine(this.store, [SchemaBuilder.create('text-editor-header', `${APPID}-text-editor-header`, { configKey: 'editor' })], context);

                // Content engine setup (Use text-list)
                this.contentEngine = new FormEngine(
                    this.store,
                    [
                        SchemaBuilder.Container([SchemaBuilder.create('text-list', `${APPID}-text-list`, { configKey: 'editor' }), SchemaBuilder.Button(`${APPID}-text-new-btn`, 'Add New Text', null, { className: commonCls.modalButton })], {
                            className: cls.modalContent,
                        }),
                    ],
                    context
                );

                const headerControls = this.headerEngine.render();
                const mainContent = this.contentEngine.render();

                Object.assign(this.modal.dom.header.style, {
                    paddingBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: '12px',
                });
                Object.assign(this.modal.dom.footer.style, {
                    paddingTop: '16px',
                });

                this.modal.setHeader(headerControls);
                this.modal.setContent(mainContent);

                this._setupEventListeners();

                // Load initial state
                this._loadStateFromConfig(validProfile, initialCategory);

                // Actively check config size and display warning if already exceeded
                this._checkConfigSize();

                this.modal.show();
            } finally {
                this.isOpening = false;
            }
        }

        close() {
            this.modal?.close();
        }

        _createHeaderControls() {
            const cls = this.styleHandle.classes;
            const commonCls = this.commonStyleHandle.classes;
            const icons = StyleDefinitions.ICONS;

            const createControlRow = (type, label) => {
                return h(`div.${cls.headerRow}`, { 'data-type': type }, [
                    // Container 1: Label
                    h('label', { htmlFor: `${APPID}-${type}-select` }, label),

                    // Container 2: Select / Input
                    h(`div.${cls.renameArea}`, [h(`select#${APPID}-${type}-select`), h('input', { type: 'text', id: `${APPID}-${type}-rename-input`, style: { display: 'none' } })]),

                    // Container 3: Action Buttons
                    h(`div.${cls.actionArea}`, [
                        h(`div.${cls.mainActions}`, [
                            h(`button#${APPID}-${type}-rename-btn.${commonCls.modalButton}`, 'Rename'),
                            h(`button#${APPID}-${type}-up-btn.${commonCls.modalButton}.${cls.moveBtn}`, [createIconFromDef(icons.up)]),
                            h(`button#${APPID}-${type}-down-btn.${commonCls.modalButton}.${cls.moveBtn}`, [createIconFromDef(icons.down)]),
                            h(`button#${APPID}-${type}-new-btn.${commonCls.modalButton}`, 'New'),
                            h(`button#${APPID}-${type}-copy-btn.${commonCls.modalButton}`, 'Copy'),
                            h(`button#${APPID}-${type}-delete-btn.${commonCls.modalButton}`, 'Delete'),
                        ]),
                        h(`div.${cls.renameActions}`, { style: { display: 'none' } }, [
                            // visibility: hidden replaced by display:none/flex in CSS, setting default here
                            h(`button#${APPID}-${type}-rename-ok-btn.${commonCls.modalButton}`, 'OK'),
                            h(`button#${APPID}-${type}-rename-cancel-btn.${commonCls.modalButton}`, 'Cancel'),
                        ]),
                        h(`div.${cls.deleteConfirmGroup}`, { style: { display: 'none' } }, [
                            h(`span.${cls.deleteConfirmLabel}`, 'Are you sure?'),
                            h(`div`, { style: { display: 'flex', gap: '8px' } }, [
                                h(`button#${APPID}-${type}-delete-confirm-btn.${commonCls.modalButton}.${cls.deleteConfirmBtnYes}`, 'Confirm Delete'),
                                h(`button#${APPID}-${type}-delete-cancel-btn.${commonCls.modalButton}`, 'Cancel'),
                            ]),
                        ]),
                    ]),
                ]);
            };

            return h(`div.${cls.headerControls}`, [createControlRow('profile', 'Profile:'), createControlRow('category', 'Category:')]);
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to enter delete confirmation mode for.
         */
        _enterDeleteConfirmationMode(itemType) {
            if (this.store.get('editor.mode') !== 'normal') return;

            const keyToDelete = itemType === 'profile' ? this.store.get('editor.activeProfile') : this.store.get('editor.activeCategory');

            if (!keyToDelete) return;

            this.store.set('editor.mode', 'delete_confirm');
            this.store.set('editor.targetType', itemType);
            this.store.set('editor.targetKey', keyToDelete);
        }

        _exitDeleteConfirmationMode() {
            this.store.set('editor.mode', 'normal');
            this.store.set('editor.targetType', null);
            this.store.set('editor.targetKey', null);
        }

        _setupEventListeners() {
            if (!this.modal) return;
            const modalElement = this.modal.element;
            const cls = this.styleHandle.classes;

            modalElement.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if (!target) return;

                const textItemControls = target.closest(`.${cls.itemControls}`);
                if (textItemControls) {
                    const textItem = textItemControls.closest(`.${cls.textItem}`);
                    const textarea = textItem.querySelector('textarea');
                    const index = parseInt(textarea.dataset.index, 10);

                    if (target.classList.contains('move-up-btn')) this._handleTextMove(index, -1);
                    if (target.classList.contains('move-down-btn')) this._handleTextMove(index, 1);
                    if (target.classList.contains('delete-btn')) this._handleTextDelete(index);
                    return;
                }

                const actionMap = {
                    // Profile Actions
                    [`${APPID}-profile-new-btn`]: () => this._handleItemNew('profile'),
                    [`${APPID}-profile-copy-btn`]: () => this._handleItemCopy('profile'),
                    [`${APPID}-profile-delete-btn`]: () => this._enterDeleteConfirmationMode('profile'),
                    [`${APPID}-profile-delete-confirm-btn`]: () => this._handleItemDelete(),
                    [`${APPID}-profile-delete-cancel-btn`]: () => this._exitDeleteConfirmationMode(),
                    [`${APPID}-profile-up-btn`]: () => this._handleItemMove('profile', -1),
                    [`${APPID}-profile-down-btn`]: () => this._handleItemMove('profile', 1),
                    [`${APPID}-profile-rename-btn`]: () => this._enterRenameMode('profile'),
                    [`${APPID}-profile-rename-ok-btn`]: () => this._handleRenameConfirm('profile'),
                    [`${APPID}-profile-rename-cancel-btn`]: () => this._exitRenameMode(true),
                    // Category Actions
                    [`${APPID}-category-new-btn`]: () => this._handleItemNew('category'),
                    [`${APPID}-category-copy-btn`]: () => this._handleItemCopy('category'),
                    [`${APPID}-category-delete-btn`]: () => this._enterDeleteConfirmationMode('category'),
                    [`${APPID}-category-delete-confirm-btn`]: () => this._handleItemDelete(),
                    [`${APPID}-category-delete-cancel-btn`]: () => this._exitDeleteConfirmationMode(),
                    [`${APPID}-category-up-btn`]: () => this._handleItemMove('category', -1),
                    [`${APPID}-category-down-btn`]: () => this._handleItemMove('category', 1),
                    [`${APPID}-category-rename-btn`]: () => this._enterRenameMode('category'),
                    [`${APPID}-category-rename-ok-btn`]: () => this._handleRenameConfirm('category'),
                    [`${APPID}-category-rename-cancel-btn`]: () => this._exitRenameMode(true),
                    // Text Actions
                    [`${APPID}-text-new-btn`]: () => this._handleTextNew(),
                };
                const action = actionMap[target.id];
                if (action) action();
            });

            // Reflect values directly to Store (With Two-Step Commit)
            modalElement.addEventListener('change', async (e) => {
                if (e.target.matches(`#${APPID}-profile-select`)) {
                    // 1. Prepare new state
                    const newProfileName = e.target.value;
                    const profiles = this.cachedConfig.texts || [];
                    const activeProfileObj = profiles.find((p) => p.name === newProfileName);
                    const newCategory = activeProfileObj?.categories[0]?.name || null;

                    // 2. Update Store & Load new data
                    this.store.set('editor.activeProfile', newProfileName);
                    this.store.set('editor.activeCategory', newCategory);
                    this._loadStateFromConfig(newProfileName, newCategory);
                } else if (e.target.matches(`#${APPID}-category-select`)) {
                    // 1. Update Store & Load new data
                    const newCategory = e.target.value;
                    this.store.set('editor.activeCategory', newCategory);
                    this._loadStateFromConfig(this.store.get('editor.activeProfile'), newCategory);
                }
            });

            // Input handling for validation visual cues
            modalElement.addEventListener('input', (e) => {
                const target = e.target;
                if (target.matches('textarea')) {
                    target.classList.toggle('is-invalid', target.value.trim() === '');
                    const footerMessage = this.modal?.dom?.footerMessage;
                    if (footerMessage && footerMessage.textContent) {
                        footerMessage.textContent = '';
                    }
                }
                if (target.matches('input[type="text"]')) {
                    target.classList.remove('is-invalid');
                    const footerMessage = this.modal?.dom?.footerMessage;
                    if (footerMessage && footerMessage.textContent) {
                        footerMessage.textContent = '';
                    }
                }
            });

            modalElement.addEventListener('keydown', (e) => {
                if (e.target.matches('input[type="text"]')) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const type = e.target.id.includes('profile') ? 'profile' : 'category';
                        this._handleRenameConfirm(type);
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        this._exitRenameMode(true);
                    }
                }
            });

            // Drag and Drop
            // Use the dynamic class for scrollable area
            const getScrollArea = () => modalElement.querySelector(`.${cls.scrollableArea}`);

            modalElement.addEventListener('dragstart', (e) => {
                const scrollArea = getScrollArea();
                if (!scrollArea) return;

                const handle = e.target.closest(`.${cls.dragHandle}`);
                if (handle) {
                    const target = handle.closest(`.${cls.textItem}`);
                    if (target && scrollArea.contains(target)) {
                        this.draggedIndex = parseInt(target.dataset.index, 10);
                        setTimeout(() => target.classList.add('dragging'), 0);
                    }
                }
            });

            modalElement.addEventListener('dragend', () => {
                const scrollArea = getScrollArea();
                if (!scrollArea || this.draggedIndex === null) return;

                const draggingElement = scrollArea.querySelector('.dragging');
                if (draggingElement) draggingElement.classList.remove('dragging');
                this.draggedIndex = null;
            });

            modalElement.addEventListener('dragover', (e) => {
                const scrollArea = getScrollArea();
                if (!scrollArea || !scrollArea.contains(e.target)) return;

                e.preventDefault();
                const draggingElement = scrollArea.querySelector('.dragging');
                if (!draggingElement) return;

                scrollArea.querySelectorAll(`.${cls.textItem}`).forEach((el) => {
                    el.classList.remove('drag-over-top', 'drag-over-bottom');
                });

                const target = e.target.closest(`.${cls.textItem}`);
                if (target && target !== draggingElement) {
                    const box = target.getBoundingClientRect();
                    const isAfter = e.clientY > box.top + box.height / 2;
                    target.classList.toggle('drag-over-bottom', isAfter);
                    target.classList.toggle('drag-over-top', !isAfter);
                } else if (!target) {
                    const lastElement = scrollArea.querySelector(`.${cls.textItem}:last-child:not(.dragging)`);
                    if (lastElement) {
                        lastElement.classList.add('drag-over-bottom');
                    }
                }
            });

            modalElement.addEventListener('drop', (e) => {
                const scrollArea = getScrollArea();
                if (!scrollArea || !scrollArea.contains(e.target)) return;

                e.preventDefault();
                if (this.draggedIndex === null) return;

                const dropTarget = scrollArea.querySelector('.drag-over-top, .drag-over-bottom');
                // Calculate drop index
                let dropIndex = -1;

                if (dropTarget) {
                    const targetIndex = parseInt(dropTarget.dataset.index, 10);
                    if (dropTarget.classList.contains('drag-over-bottom')) {
                        dropIndex = targetIndex + 1;
                    } else {
                        dropIndex = targetIndex;
                    }
                    // Adjust dropIndex if moving downwards
                    if (this.draggedIndex < dropIndex) {
                        dropIndex--;
                    }
                } else {
                    // Check if dropped at the end
                    const lastElement = scrollArea.querySelector(`.${cls.textItem}:last-child:not(.dragging)`);
                    if (lastElement && lastElement.classList.contains('drag-over-bottom')) {
                        dropIndex = this.store.get('editor.currentTexts').length - 1;
                    }
                }

                // Cleanup visual cues
                scrollArea.querySelectorAll(`.${cls.textItem}`).forEach((el) => {
                    el.classList.remove('drag-over-top', 'drag-over-bottom');
                });

                // Perform move if valid
                if (dropIndex !== -1 && dropIndex !== this.draggedIndex) {
                    this._handleTextMove(this.draggedIndex, dropIndex - this.draggedIndex);
                }
            });
        }

        /**
         * Commit Store's currentTexts to cachedConfig (Array-based).
         * Must be called before Profile/Category switch or Save.
         */
        _saveCurrentStateToConfig() {
            const activeProfile = this.store.get('editor.activeProfile');
            const activeCategory = this.store.get('editor.activeCategory');
            const currentTexts = this.store.get('editor.currentTexts');

            const profileObj = this.cachedConfig.texts.find((p) => p.name === activeProfile);
            if (profileObj) {
                const categoryObj = profileObj.categories.find((c) => c.name === activeCategory);
                if (categoryObj) {
                    categoryObj.items = [...currentTexts];
                }
            }
        }

        /**
         * Load data from Config cache to Store (Array-based).
         * Call on initialization or Profile/Category switch.
         */
        _loadStateFromConfig(profileName, categoryName) {
            const profileObj = this.cachedConfig.texts.find((p) => p.name === profileName);
            const categoryObj = profileObj ? profileObj.categories.find((c) => c.name === categoryName) : null;
            const texts = categoryObj ? categoryObj.items : [];

            this.store.set('editor.currentTexts', [...texts]); // Deep copy
            this.store.set('editor.listFingerprint', Date.now()); // Force render
            this.store.set('editor.focusedIndex', -1);
        }

        /**
         * Handler for text pixel input (No re-render)
         */
        _handleTextPixelInput(index, value) {
            const currentTexts = this.store.get('editor.currentTexts');
            if (currentTexts && currentTexts[index] !== undefined) {
                currentTexts[index] = value;
                // Update Store, but Fingerprint check in onUpdate prevents DOM rebuild
                this.store.set('editor.currentTexts', currentTexts);
            }
        }

        async _exitRenameMode(refresh = false) {
            const currentMode = this.store.get('editor.mode');
            if (currentMode !== 'rename') return;

            const type = this.store.get('editor.targetType');

            this.store.set('editor.mode', 'normal');
            this.store.set('editor.targetType', null);

            if (this.modal) {
                const input = this.modal.element.querySelector(`#${APPID}-${type}-rename-input`);
                if (input) input.classList.remove('is-invalid');
                const footerMessage = this.modal.dom.footerMessage;
                if (footerMessage) footerMessage.textContent = '';
            }

            // When forced update is required (e.g., on cancel, to restore original value)
            if (refresh) {
                this.store.set('editor.lastUpdated', Date.now());
            }
        }

        _getDragAfterElement(container, y) {
            const cls = this.styleHandle.classes;
            const draggableElements = [...container.querySelectorAll(`.${cls.textItem}:not(.dragging)`)];
            return draggableElements.reduce(
                (closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child };
                    } else {
                        return closest;
                    }
                },
                { offset: Number.NEGATIVE_INFINITY }
            ).element;
        }

        _autoResizeTextarea(textarea) {
            if (!textarea) return;
            // Temporarily set height to auto to allow the textarea to shrink if text is deleted.
            // Use requestAnimationFrame to prevent layout thrashing during rapid typing.
            requestAnimationFrame(() => {
                textarea.style.height = 'auto';
                // Set the height to its scrollHeight to fit the content.
                textarea.style.height = `${textarea.scrollHeight}px`;
            });
        }

        _handleTextNew() {
            // 1. Modify data
            const currentTexts = [...this.store.get('editor.currentTexts')];
            const focusedIndex = this.store.get('editor.focusedIndex');
            let insertIndex;

            // Determine insertion position: after the focused item, or at the end
            if (focusedIndex >= 0 && focusedIndex < currentTexts.length) {
                insertIndex = focusedIndex + 1;
            } else {
                insertIndex = currentTexts.length;
            }

            currentTexts.splice(insertIndex, 0, ''); // Insert empty text

            // 2. Update Store to trigger render
            this.store.set('editor.currentTexts', currentTexts);
            this.store.set('editor.listFingerprint', Date.now());
            this.store.set('editor.focusedIndex', insertIndex); // Focus new item
        }

        _handleTextDelete(index) {
            // 1. Modify data
            const currentTexts = this.store.get('editor.currentTexts');
            const newTexts = currentTexts.filter((_, i) => i !== index);

            // 2. Update Store to trigger render
            this.store.set('editor.currentTexts', newTexts);
            this.store.set('editor.listFingerprint', Date.now());
            this.store.set('editor.focusedIndex', -1);
        }

        _handleTextMove(index, direction) {
            // 1. Modify data
            const currentTexts = [...this.store.get('editor.currentTexts')];
            const newIndex = index + direction;

            if (newIndex < 0 || newIndex >= currentTexts.length) return;

            // Remove from old position
            const [movedItem] = currentTexts.splice(index, 1);
            // Insert at new position
            currentTexts.splice(newIndex, 0, movedItem);

            // 2. Update Store to trigger render
            this.store.set('editor.currentTexts', currentTexts);
            this.store.set('editor.listFingerprint', Date.now());
            this.store.set('editor.focusedIndex', newIndex); // Follow focus
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to create.
         */
        async _handleItemNew(itemType) {
            const newConfig = deepClone(this.cachedConfig);
            const activeProfileName = this.store.get('editor.activeProfile');
            const activeCategoryName = this.store.get('editor.activeCategory');

            if (itemType === 'profile') {
                const profiles = newConfig.texts;
                const activeIndex = profiles.findIndex((p) => p.name === activeProfileName);
                // Insert after current or at end
                const insertIndex = activeIndex >= 0 ? activeIndex + 1 : profiles.length;

                const newName = proposeUniqueName('New Profile', profiles);
                const newProfile = {
                    name: newName,
                    categories: [{ name: 'New Category', items: [] }],
                };

                profiles.splice(insertIndex, 0, newProfile);

                await this.callbacks.onSave(newConfig);
                this.cachedConfig = newConfig;

                this.store.set('editor.activeProfile', newName);
                this.store.set('editor.activeCategory', 'New Category');
            } else {
                const profile = newConfig.texts.find((p) => p.name === activeProfileName);
                if (!profile) return;

                const categories = profile.categories;
                const activeIndex = categories.findIndex((c) => c.name === activeCategoryName);
                const insertIndex = activeIndex >= 0 ? activeIndex + 1 : categories.length;

                const newName = proposeUniqueName('New Category', categories);
                const newCategory = {
                    name: newName,
                    items: [],
                };

                categories.splice(insertIndex, 0, newCategory);

                // Update config (since profile is a reference to object inside newConfig, it's updated)
                await this.callbacks.onSave(newConfig);
                this.cachedConfig = newConfig;

                this.store.set('editor.activeCategory', newName);
            }

            // Reload texts
            this._loadStateFromConfig(this.store.get('editor.activeProfile'), this.store.get('editor.activeCategory'));

            // Enter rename mode
            this._enterRenameMode(itemType);
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to copy.
         */
        async _handleItemCopy(itemType) {
            const newConfig = deepClone(this.cachedConfig);
            const activeProfileName = this.store.get('editor.activeProfile');
            const activeCategoryName = this.store.get('editor.activeCategory');

            if (itemType === 'profile') {
                const profiles = newConfig.texts;
                const activeIndex = profiles.findIndex((p) => p.name === activeProfileName);
                if (activeIndex === -1) return;

                const sourceProfile = profiles[activeIndex];
                const newName = proposeUniqueName(`${sourceProfile.name} Copy`, profiles);

                const newProfile = deepClone(sourceProfile);
                newProfile.name = newName;

                profiles.splice(activeIndex + 1, 0, newProfile);

                await this.callbacks.onSave(newConfig);
                this.cachedConfig = newConfig;

                this.store.set('editor.activeProfile', newName);
                this.store.set('editor.activeCategory', newProfile.categories[0]?.name || null);
            } else {
                const profile = newConfig.texts.find((p) => p.name === activeProfileName);
                if (!profile) return;

                const categories = profile.categories;
                const activeIndex = categories.findIndex((c) => c.name === activeCategoryName);
                if (activeIndex === -1) return;

                const sourceCategory = categories[activeIndex];
                const newName = proposeUniqueName(`${sourceCategory.name} Copy`, categories);

                const newCategory = deepClone(sourceCategory);
                newCategory.name = newName;

                categories.splice(activeIndex + 1, 0, newCategory);

                await this.callbacks.onSave(newConfig);
                this.cachedConfig = newConfig;

                this.store.set('editor.activeCategory', newName);
            }

            // Reload texts
            this._loadStateFromConfig(this.store.get('editor.activeProfile'), this.store.get('editor.activeCategory'));
        }

        /**
         * @private
         */
        async _handleItemDelete() {
            const itemType = this.store.get('editor.targetType');
            const keyToDelete = this.store.get('editor.targetKey'); // name

            if (!keyToDelete) {
                this._exitDeleteConfirmationMode();
                return;
            }

            const newConfig = deepClone(this.cachedConfig);

            if (itemType === 'profile') {
                const profiles = newConfig.texts;
                const indexToDelete = profiles.findIndex((p) => p.name === keyToDelete);

                if (indexToDelete !== -1) {
                    profiles.splice(indexToDelete, 1);

                    // Determine next profile to show
                    const nextIndex = Math.min(indexToDelete, profiles.length - 1);
                    const nextProfile = profiles[nextIndex] || profiles[0];
                    const nextViewKey = nextProfile?.name || null;

                    if (newConfig.options.activeProfileName === keyToDelete) {
                        newConfig.options.activeProfileName = nextViewKey;
                    }

                    await this.callbacks.onSave(newConfig);
                    this.cachedConfig = newConfig;

                    this.store.set('editor.activeProfile', nextViewKey);
                    this.store.set('editor.activeCategory', nextProfile?.categories[0]?.name || null);
                }
            } else {
                const activeProfileName = this.store.get('editor.activeProfile');
                const profile = newConfig.texts.find((p) => p.name === activeProfileName);

                if (profile) {
                    const categories = profile.categories;
                    const indexToDelete = categories.findIndex((c) => c.name === keyToDelete);

                    if (indexToDelete !== -1) {
                        categories.splice(indexToDelete, 1);

                        // Determine next category
                        const nextIndex = Math.min(indexToDelete, categories.length - 1);
                        const nextCategory = categories[nextIndex] || categories[0];
                        const nextViewKey = nextCategory?.name || null;

                        await this.callbacks.onSave(newConfig);
                        this.cachedConfig = newConfig;

                        this.store.set('editor.activeCategory', nextViewKey);
                    }
                }
            }

            // Reload texts
            this._loadStateFromConfig(this.store.get('editor.activeProfile'), this.store.get('editor.activeCategory'));

            this._exitDeleteConfirmationMode();
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to move.
         * @param {number} direction The direction to move (-1 for up, 1 for down).
         */
        async _handleItemMove(itemType, direction) {
            const newConfig = deepClone(this.cachedConfig);
            const activeProfileName = this.store.get('editor.activeProfile');
            const activeCategoryName = this.store.get('editor.activeCategory');
            let targetArray;
            let activeKey;

            if (itemType === 'profile') {
                targetArray = newConfig.texts;
                activeKey = activeProfileName;
            } else {
                const profile = newConfig.texts.find((p) => p.name === activeProfileName);
                if (!profile) return;
                targetArray = profile.categories;
                activeKey = activeCategoryName;
            }

            const currentIndex = targetArray.findIndex((item) => item.name === activeKey);

            if (currentIndex === -1) return;
            const newIndex = currentIndex + direction;
            if (newIndex < 0 || newIndex >= targetArray.length) return;

            // Move using splice (Arrays maintain order correctly)
            const [movedItem] = targetArray.splice(currentIndex, 1);
            targetArray.splice(newIndex, 0, movedItem);

            await this.callbacks.onSave(newConfig);
            this.cachedConfig = newConfig;

            // Value hasn't changed, but trigger forced update for reordering UI
            this.store.set('editor.lastUpdated', Date.now());
        }

        async _handleSaveAction(shouldClose) {
            const footerMessage = this.modal?.dom?.footerMessage;
            if (footerMessage) {
                // Clear previous messages (unless it's a conflict warning)
                if (!footerMessage.classList.contains(this.commonStyleHandle.classes.conflictText)) {
                    footerMessage.textContent = '';
                    footerMessage.style.color = '';
                }
            }
            this.modal.element.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

            // 1. Validate
            const currentTexts = this.store.get('editor.currentTexts');
            const cls = this.styleHandle.classes;

            if (currentTexts.some((t) => t.trim() === '')) {
                // Mark invalid elements manually since we synced to store
                const scrollArea = this.modal.element.querySelector(`.${cls.scrollableArea}`);
                if (scrollArea) {
                    scrollArea.querySelectorAll('textarea').forEach((ta, i) => {
                        if (currentTexts[i].trim() === '') ta.classList.add('is-invalid');
                    });
                }
                if (footerMessage) {
                    footerMessage.textContent = 'Text fields cannot be empty.';
                    footerMessage.style.color = `var(${StyleDefinitions.VARS.TEXT_DANGER})`;
                }
                return;
            }

            // 2. Commit to Config
            this._saveCurrentStateToConfig();

            // 3. Save
            try {
                await this.callbacks.onSave(this.cachedConfig);
                this.cachedConfig = deepClone(this.cachedConfig); // Re-clone to be safe

                if (shouldClose) {
                    this.close();
                }
            } catch (e) {
                // Primary error handling is done via events (e.g. CONFIG_SIZE_EXCEEDED).
                // This catch block serves as a fallback for other unexpected errors.
                if (footerMessage) {
                    footerMessage.textContent = e.message;
                    footerMessage.style.color = `var(${StyleDefinitions.VARS.TEXT_DANGER})`;
                }
            }
        }

        _enterRenameMode(type) {
            const currentMode = this.store.get('editor.mode');
            if (currentMode === 'rename') return;

            this.store.set('editor.mode', 'rename');
            this.store.set('editor.targetType', type);

            // Set focus after UI update
            requestAnimationFrame(() => {
                if (this.modal) {
                    const input = this.modal.element.querySelector(`#${APPID}-${type}-rename-input`);
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }
            });
        }

        async _handleRenameConfirm(type) {
            const footerMessage = this.modal?.dom?.footerMessage;
            const input = this.modal.element.querySelector(`#${APPID}-${type}-rename-input`);
            const newName = input.value.trim();
            const oldName = type === 'profile' ? this.store.get('editor.activeProfile') : this.store.get('editor.activeCategory');

            if (!newName) {
                if (footerMessage) {
                    footerMessage.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} name cannot be empty.`;
                    footerMessage.style.color = `var(${StyleDefinitions.VARS.TEXT_DANGER})`;
                }
                input.classList.add('is-invalid');
                return;
            }

            // Check for duplicates
            const config = this.cachedConfig;
            let itemsToCheck;
            if (type === 'profile') {
                itemsToCheck = config.texts;
            } else {
                const profile = config.texts.find((p) => p.name === this.store.get('editor.activeProfile'));
                itemsToCheck = profile ? profile.categories : [];
            }

            if (newName.toLowerCase() !== oldName.toLowerCase() && itemsToCheck.some((item) => item.name.toLowerCase() === newName.toLowerCase())) {
                if (footerMessage) {
                    footerMessage.textContent = `Name "${newName}" is already in use.`;
                    footerMessage.style.color = `var(${StyleDefinitions.VARS.TEXT_DANGER})`;
                }
                input.classList.add('is-invalid');
                return;
            }

            // Notify UIManager about the rename BEFORE saving to maintain session consistency
            if (this.callbacks.onRename) {
                const activeProfile = this.store.get('editor.activeProfile');
                this.callbacks.onRename(type, oldName, newName, activeProfile);
            }

            const newConfig = deepClone(config);

            if (type === 'profile') {
                const profile = newConfig.texts.find((p) => p.name === oldName);
                if (profile) {
                    profile.name = newName; // Simply update the property
                }

                // Update activeProfileName option if needed
                if (config.options.activeProfileName === oldName) {
                    newConfig.options.activeProfileName = newName;
                }

                await this.callbacks.onSave(newConfig);
                this.cachedConfig = newConfig;

                this.store.set('editor.activeProfile', newName);
            } else {
                const activeProfileName = this.store.get('editor.activeProfile');
                const profile = newConfig.texts.find((p) => p.name === activeProfileName);
                if (profile) {
                    const category = profile.categories.find((c) => c.name === oldName);
                    if (category) {
                        category.name = newName; // Simply update the property
                    }
                }

                await this.callbacks.onSave(newConfig);
                this.cachedConfig = newConfig;

                this.store.set('editor.activeCategory', newName);
            }

            this._exitRenameMode(true);
        }

        getContextForReopen() {
            const activeCategory = this.store ? this.store.get('editor.activeCategory') : null;
            return { type: CONSTANTS.MODAL_TYPES.TEXT_EDITOR, key: activeCategory };
        }
    }

    /**
     * Manages the JSON editing modal by using the CustomModal component.
     */
    class JsonModalComponent extends UIComponentBase {
        constructor(callbacks) {
            super(callbacks);
            this.modal = null; // To hold the CustomModal instance
            this.store = null;
            this.engine = null;
            this.styleHandle = null;
            this.commonStyleHandle = null;
            this.debouncedUpdateSize = debounce((text) => this._updateSizeDisplay(text), 300, true);
        }

        render() {
            this.styleHandle = StyleManager.request(StyleDefinitions.getJsonModal);
            this.commonStyleHandle = StyleManager.request(StyleDefinitions.getCommon);
        }

        async open(anchorElement) {
            if (this.modal || this.isOpening) return; // Prevent re-entry
            this.callbacks.onModalOpenStateChange?.(true);

            // Ensure styles are ready
            if (!this.styleHandle) this.render();

            this.isOpening = true;

            try {
                const cls = this.styleHandle.classes;
                const commonCls = this.commonStyleHandle.classes;

                this.modal = new CustomModal({
                    title: `${APPNAME} Settings`,
                    width: 'min(440px, 95vw)',
                    closeOnBackdropClick: true,
                    buttons: [
                        { text: 'Export', id: `${APPID}-json-modal-export-btn`, className: '', onClick: () => this._handleExport() },
                        { text: 'Import', id: `${APPID}-json-modal-import-btn`, className: '', onClick: () => this._handleImport() },
                        { text: 'Cancel', id: `${APPID}-json-modal-cancel-btn`, className: commonCls.pushRightBtn, onClick: () => this.close() },
                        { text: 'Save', id: `${APPID}-json-modal-save-btn`, className: commonCls.primaryBtn, onClick: () => this._handleSave() },
                    ],
                    onDestroy: () => {
                        this.debouncedUpdateSize.cancel();
                        this.callbacks.onModalOpenStateChange?.(false);
                        this.engine?.destroy();
                        this.engine = null;
                        this.store = null;
                        this.modal = null;
                    },
                });

                // Apply scoped root class to prevent style leak
                this.modal.element.classList.add(cls.modalRoot);

                // Set content specific styles using mapped class names
                const contentContainer = this.modal.getContentContainer();
                contentContainer.classList.add(cls.statusContainer); // Use container class for padding/layout if needed

                this.store = new ReactiveStore({
                    json: {
                        editor: '',
                        status: { text: '' },
                        sizeInfo: { text: 'Checking size...' },
                    },
                });

                const context = {
                    styles: { ...commonCls, ...cls }, // Merge styles for FormEngine
                    store: this.store,
                };

                this.engine = new FormEngine(this.store, this._getSchema(), context);
                this.modal.setContent(this.engine.render());

                this.callbacks.onModalOpen?.(); // Notify UIManager

                const config = await this.callbacks.getCurrentConfig();
                const initialText = JSON.stringify(config, null, 2);
                this.store.set('json.editor', initialText);
                this._updateSizeDisplay(initialText);

                this.modal.show(anchorElement);

                // Defer focus and scroll adjustment until the modal is visible
                requestAnimationFrame(() => {
                    const textarea = this.modal.getContentContainer().querySelector(`textarea`);
                    if (!textarea) return;
                    textarea.focus();
                    textarea.scrollTop = 0;
                    textarea.selectionStart = 0;
                    textarea.selectionEnd = 0;
                });
            } finally {
                this.isOpening = false;
            }
        }

        close() {
            if (this.modal) {
                this.modal.close();
            }
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this.debouncedUpdateSize.cancel();
            this.engine?.destroy();
            this.engine = null;
            this.store = null;
            this.modal?.destroy();
            super._onDestroy();
        }

        _getSchema() {
            // Note: Schema uses logical class names mapped in StyleDefinitions
            return [
                SchemaBuilder.Container(
                    [
                        SchemaBuilder.CodeEditor('json.editor', {
                            onChange: (value) => this.debouncedUpdateSize(value || ''),
                        }),
                        SchemaBuilder.Row(
                            [
                                SchemaBuilder.TextDisplay('json.status', { className: 'msg' }), // Mapped to cls.msg
                                SchemaBuilder.TextDisplay('json.sizeInfo', { className: 'sizeInfo' }), // Mapped to cls.sizeInfo
                            ],
                            {
                                className: 'statusRow', // Mapped to cls.statusRow
                            }
                        ),
                    ],
                    { className: 'content' } // Mapped to cls.content
                ),
            ];
        }

        async _handleSave() {
            try {
                this._setStatus('');
                const jsonText = this.store?.get('json.editor') || '';
                const obj = JSON.parse(jsonText);
                await this.callbacks.onSave(obj);
                this.close();
            } catch (e) {
                this._setStatus(e.message, `var(${StyleDefinitions.VARS.TEXT_DANGER})`);
            }
        }

        async _handleExport() {
            try {
                this._setStatus('');

                const config = await this.callbacks.getCurrentConfig();
                const jsonString = JSON.stringify(config, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = h('a', {
                    href: url,
                    download: `${APPID}_config.json`,
                });

                if (a instanceof HTMLElement) {
                    a.click();
                }

                // Revoke the URL after a delay to ensure the download has time to start.
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                this._setStatus('Export successful.', `var(${StyleDefinitions.VARS.TEXT_ACCENT})`);
            } catch (e) {
                this._setStatus(`Export failed: ${e.message}`, `var(${StyleDefinitions.VARS.TEXT_DANGER})`);
            }
        }

        _handleImport() {
            const textarea = this.modal.getContentContainer().querySelector(`textarea`);
            if (!(textarea instanceof HTMLTextAreaElement)) return;

            const fileInput = h('input', {
                type: 'file',
                accept: 'application/json',
                onchange: (event) => {
                    const target = event.target;
                    if (!(target instanceof HTMLInputElement)) return;

                    const file = target.files?.[0];
                    // Reset input value to allow re-importing the same file if needed
                    target.value = '';

                    if (!file) return;

                    const reader = new FileReader();

                    // Step 1: Update UI immediately upon load completion
                    reader.onload = (e) => {
                        this._setStatus('Processing...');
                        document.body.style.cursor = 'wait';

                        // Step 2: Defer heavy processing to allow UI to render
                        requestAnimationFrame(() => {
                            // Guard: Check if modal is still open before proceeding
                            if (!this.modal || !textarea.isConnected) {
                                document.body.style.cursor = '';
                                return;
                            }

                            try {
                                const readerTarget = e.target;
                                if (readerTarget && typeof readerTarget.result === 'string') {
                                    // Heavy operations
                                    const importedConfig = JSON.parse(readerTarget.result);
                                    const jsonString = JSON.stringify(importedConfig, null, 2);

                                    this.store?.set('json.editor', jsonString);
                                    this._updateSizeDisplay(jsonString);

                                    this._setStatus('Import successful. Click "Save" to apply.', `var(${StyleDefinitions.VARS.TEXT_ACCENT})`);
                                }
                            } catch (err) {
                                this._setStatus(`Import failed: ${err.message}`, `var(${StyleDefinitions.VARS.TEXT_DANGER})`);
                            } finally {
                                document.body.style.cursor = '';
                            }
                        });
                    };

                    reader.onerror = () => {
                        this._setStatus('Failed to read file.', `var(${StyleDefinitions.VARS.TEXT_DANGER})`);
                    };

                    // Initial status
                    this._setStatus('Reading file...');
                    reader.readAsText(file);
                },
            });

            if (fileInput instanceof HTMLElement) {
                fileInput.click();
            }
        }

        getContextForReopen() {
            return { type: 'json' };
        }

        _updateSizeDisplay(text) {
            const container = this.modal?.getContentContainer();
            if (!container) return;

            let sizeInBytes = 0;
            let isRaw = false;

            try {
                // Try to parse and minify to get the actual storage size
                const obj = JSON.parse(text);
                const minified = JSON.stringify(obj);
                sizeInBytes = new Blob([minified]).size;
            } catch {
                // Fallback to raw text size if parsing fails
                sizeInBytes = new Blob([text]).size;
                isRaw = true;
            }

            const sizeStr = this._formatBytes(sizeInBytes);
            const recommendedStr = this._formatBytes(CONSTANTS.CONFIG_SIZE_RECOMMENDED_LIMIT_BYTES);
            const limitStr = this._formatBytes(CONSTANTS.CONFIG_SIZE_LIMIT_BYTES);

            // Display format: 1.23 MB / 5.00 MB (Max: 10.00 MB)
            let color = '';
            let bold = false;
            const v = StyleDefinitions.VARS;

            // Use colors directly or vars
            if (sizeInBytes >= CONSTANTS.CONFIG_SIZE_LIMIT_BYTES) {
                color = `var(${v.TEXT_DANGER})`;
                bold = true;
            } else if (sizeInBytes >= CONSTANTS.CONFIG_SIZE_RECOMMENDED_LIMIT_BYTES) {
                color = `var(${v.TEXT_WARNING})`;
                bold = true;
            }
            const sizeText = `${isRaw ? '(Raw) ' : ''}${sizeStr} / ${recommendedStr} (Max: ${limitStr})`;
            this.store?.set('json.sizeInfo', {
                text: sizeText,
                color,
                bold,
                title: `Recommended Limit: ${recommendedStr} (Warns if exceeded)\nHard Limit: ${limitStr} (Cannot save if exceeded)`,
            });
        }

        _setStatus(text, color = '') {
            this.store?.set('json.status', { text, color, bold: false });
        }

        _formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    /**
     * Manages the Shortcut Cheat Sheet modal.
     */
    class ShortcutModalComponent extends UIComponentBase {
        constructor(callbacks) {
            super(callbacks);
            this.modal = null;
            this.styleHandle = null;
        }

        render() {
            this.styleHandle = StyleManager.request(StyleDefinitions.getShortcutModal);
        }

        open(anchorElement) {
            if (this.modal) return; // Prevent re-entry

            // Ensure styles are ready
            if (!this.styleHandle) this.render();

            const cls = this.styleHandle.classes;
            const commonCls = StyleManager.request(StyleDefinitions.getCommon).classes;

            this.modal = new CustomModal({
                title: `${APPNAME} Keyboard Shortcuts`,
                width: 'min(400px, 95vw)',
                closeOnBackdropClick: true,
                buttons: [{ text: 'Close', id: `${APPID}-shortcut-close-btn`, className: commonCls.primaryBtn, onClick: () => this.close() }],
                onDestroy: () => {
                    this.modal = null;
                },
            });

            // Helper to create grid rows
            const createRow = (keys, desc, separator = ' + ') => {
                const keyElements = keys
                    .map((k, i) => {
                        const els = [h(`span.${cls.key}`, k)];
                        if (i < keys.length - 1) els.push(h('span', separator));
                        return els;
                    })
                    .flat();

                return [h(`div.${cls.keyGroup}`, keyElements), h(`div.${cls.desc}`, desc)];
            };

            const createHeader = (text) => h(`div.${cls.sectionHeader}`, text);

            const content = h(`div.${cls.grid}`, [
                createHeader('Global'),
                ...createRow(['Alt', 'Q'], 'Toggle Text List (If enabled)'),

                createHeader('Navigation'),
                ...createRow(['↑ / ↓'], 'Select Item'),
                ...createRow(['← / →'], 'Switch Category'),
                ...createRow(['Ctrl', '← / →'], 'Switch Profile'),
                ...createRow(['Ctrl', '↑ / ↓'], 'Toggle Profile List'),

                createHeader('Action'),
                ...createRow(['Enter', 'Space', 'Tab'], 'Select item', ' / '),
                ...createRow(['Esc'], 'Close Text List'),
            ]);

            this.modal.setContent(content);
            this.modal.show();
        }

        close() {
            this.modal?.close();
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this.close();
            super._onDestroy();
        }
    }

    class InsertButtonComponent extends UIComponentBase {
        constructor(callbacks, options) {
            super(callbacks);
            this.options = options;
            this.styleHandle = null;
        }

        /**
         * Updates the button's title (tooltip) dynamically.
         * @param {string} title The new title text.
         */
        setTitle(title) {
            this.options.title = title;
            if (this.element) {
                this.element.title = title;
            }
        }

        /**
         * Renders the settings button element and appends it to the document body.
         * @returns {HTMLElement} The created button element.
         */
        render() {
            // Use StyleManager
            this.styleHandle = StyleManager.request(StyleDefinitions.getInsertButton);
            const cls = this.styleHandle.classes;

            // Remove existing if any (safety check)
            const oldElement = document.getElementById(cls.buttonId);
            if (oldElement) oldElement.remove();

            this.element = h('button', {
                type: 'button',
                id: cls.buttonId,
                title: this.options.title,
                // Prevent focus loss from the input area
                onmousedown: (e) => e.preventDefault(),
                // Restore event handlers directly on the element
                onclick: (e) => {
                    e.stopPropagation();
                    this.callbacks.onClick?.(e);
                },
                oncontextmenu: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.callbacks.onContextMenu?.(e);
                },
                onmouseenter: (e) => this.callbacks.onMouseEnter?.(e),
                onmouseleave: (e) => this.callbacks.onMouseLeave?.(e),
            });

            // Retrieve icon definition from unified definition
            const iconDef = StyleDefinitions.ICONS.insert;
            if (iconDef) {
                const svgElement = createIconFromDef(iconDef);
                if (svgElement) {
                    this.element.appendChild(svgElement);
                }
            }

            return this.element;
        }
    }

    class TextListComponent extends UIComponentBase {
        constructor(callbacks, options) {
            super(callbacks);
            this.options = options;
            this.styleHandle = null;
            this.elements = {
                tabsContainer: null,
                optionsContainer: null,
            };
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            super._onDestroy();
        }

        /**
         * @private
         * Retrieves the current list of option buttons.
         * @returns {HTMLElement[]}
         */
        _getOptions() {
            if (!this.elements.optionsContainer) return [];
            // Use the class name from the style handle
            const cls = this.styleHandle.classes;
            // Convert to Array to satisfy return type and allow array methods
            return Array.from(this.elements.optionsContainer.querySelectorAll(`.${cls.option}`));
        }

        /**
         * Focuses the option at the specified index.
         * @param {number} index
         */
        focusOption(index) {
            const options = this._getOptions();
            if (options.length === 0) return;

            // Clamp index
            let targetIndex = index;
            if (targetIndex < 0) targetIndex = 0;
            if (targetIndex >= options.length) targetIndex = options.length - 1;

            options[targetIndex].focus();
        }

        /**
         * Focuses the next option in the list. Loops to start if at end.
         */
        focusNext() {
            const options = this._getOptions();
            if (options.length === 0) return;

            const current = document.activeElement;
            const currentIndex = current instanceof HTMLElement ? options.indexOf(current) : -1;

            // If focus is not on an option, start from -1 so next is 0
            let nextIndex = currentIndex + 1;
            if (nextIndex >= options.length) nextIndex = 0;

            options[nextIndex].focus();
        }

        /**
         * Focuses the previous option in the list. Loops to end if at start.
         */
        focusPrev() {
            const options = this._getOptions();
            if (options.length === 0) return;

            const current = document.activeElement;
            // If focus is not on an option, start from length (so prev is length-1)
            let currentIndex = current instanceof HTMLElement ? options.indexOf(current) : -1;
            if (currentIndex === -1) currentIndex = 0;

            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = options.length - 1;

            options[prevIndex].focus();
        }

        render() {
            this.styleHandle = StyleManager.request(StyleDefinitions.getTextList);
            const cls = this.styleHandle.classes;

            // Retrieve icon definitions from StyleDefinitions
            // Reuse "up" icon for navigation arrows by rotating via CSS classes
            const upIcon = StyleDefinitions.ICONS.up;

            // Create profile bar
            const profileBar = h(`div.${cls.profileBar}`, [
                // Previous button (Left arrow: upIcon rotated -90 degrees)
                (this.elements.prevBtn = h(
                    `button.${cls.navBtn}.${cls.rotateLeft}`,
                    {
                        title: 'Previous Profile',
                        onclick: (e) => {
                            e.stopPropagation(); // Stop propagation to prevent list from closing
                            this.callbacks.onPrevProfile?.();
                        },
                    },
                    [createIconFromDef(upIcon)]
                )),
                // Next button (Right arrow: upIcon rotated 90 degrees)
                (this.elements.nextBtn = h(
                    `button.${cls.navBtn}.${cls.rotateRight}`,
                    {
                        title: 'Next Profile',
                        onclick: (e) => {
                            e.stopPropagation(); // Stop propagation to prevent list from closing
                            this.callbacks.onNextProfile?.();
                        },
                    },
                    [createIconFromDef(upIcon)]
                )),
                // Profile name display area
                (this.elements.profileName = h(`span.${cls.profileName}`, {
                    title: 'Current Profile (Click to switch / Right-Click to edit)',
                    onclick: (e) => {
                        e.stopPropagation();
                        this.callbacks.onProfileNameClick?.();
                    },
                    oncontextmenu: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.callbacks.onProfileNameContextMenu?.();
                    },
                })),
            ]);

            this.element = h(
                `div#${cls.list}`,
                {
                    style: { display: 'none' },
                    onmouseenter: (e) => this.callbacks.onMouseEnter?.(e),
                    onmouseleave: (e) => this.callbacks.onMouseLeave?.(e),
                    onmousemove: (e) => this.callbacks.onMouseMove?.(e),
                },
                [
                    profileBar,
                    (this.elements.tabsContainer = h(`div.${cls.tabs}`)),
                    (this.elements.separator = h(`div.${cls.separator}`)), // Store reference
                    (this.elements.optionsContainer = h(`div.${cls.options}`)),
                ]
            );

            document.body.appendChild(this.element);
            return this.element;
        }

        /**
         * Updates the profile name displayed in the header.
         * @param {string} name
         */
        setProfileName(name) {
            if (this.elements.profileName) {
                this.elements.profileName.textContent = name;
            }
        }

        /**
         * Toggles the visibility of category tabs and separator.
         * @param {boolean} visible
         */
        toggleTabs(visible) {
            const display = visible ? '' : 'none';
            if (this.elements.tabsContainer) this.elements.tabsContainer.style.display = display;
            if (this.elements.separator) this.elements.separator.style.display = display;
        }
    }

    class UIManager extends BaseManager {
        /** * @param {object} config
         * @param {(config: object) => Promise<void>} onSave
         * @param {object} platformDetails
         * @param {() => void} onModalClose
         * @param {(config: object) => {isValid: boolean, message: string|null}} checkConfigSizeCallback
         */
        constructor(config, onSave, platformDetails, onModalClose, checkConfigSizeCallback) {
            super();
            this.config = config;
            this.onSave = onSave;
            this.platformDetails = platformDetails;
            this.onModalClose = onModalClose;

            // Flag for requestAnimationFrame throttling
            this.isRepositioningScheduled = false;

            // State flag for input mode
            this.isKeyboardNavigating = false;

            // Initialize Session State (Array-based access)
            const profiles = this.config.texts || [];
            this.sessionActiveProfile = this.config.options.activeProfileName || profiles[0]?.name;

            const activeProfile = profiles.find((p) => p.name === this.sessionActiveProfile) || profiles[0];
            // Update sessionActiveProfile in case the configured one was missing
            if (activeProfile) {
                this.sessionActiveProfile = activeProfile.name;
            }

            const categories = activeProfile ? activeProfile.categories : [];
            this.activeCategory = categories[0]?.name || null;

            this.hideTimeoutId = null;
            this.isModalOpen = false;
            this.isProfileListMode = false;
            this.lastFocusedIndex = 0; // Remember last position for UX

            this._handlers = {
                globalClick: this._handleGlobalClick.bind(this),
                globalKeydown: this._handleGlobalKeydown.bind(this),
            };

            this.components = {
                settingsPanel: null,
                insertBtn: null,
                textList: null,
                textEditorModal: null,
                jsonModal: null,
                shortcutModal: null,
            };

            const modalCallbacks = {
                onSave: (newConfig) => this.onSave(newConfig),
                getCurrentConfig: () => this.config,
                onModalOpenStateChange: (isOpen) => this.setModalState(isOpen),
                checkConfigSize: checkConfigSizeCallback, // Pass validator to modals
                // Handle renaming to maintain session consistency
                onRename: (type, oldName, newName, parentContext) => {
                    if (type === 'profile') {
                        if (this.sessionActiveProfile === oldName) {
                            this.sessionActiveProfile = newName;
                        }
                    } else if (type === 'category') {
                        if (this.sessionActiveProfile === parentContext && this.activeCategory === oldName) {
                            this.activeCategory = newName;
                        }
                    }
                },
            };

            // Initialize Settings Panel first to reference it in InsertButton callbacks
            this.components.settingsPanel = new SettingsPanelComponent({
                onSave: (newConfig) => this.onSave(newConfig),
                getCurrentConfig: () => this.config,
                // Anchor to insertBtn (will be assigned later, but reference is dynamic)
                getAnchorElement: () => this.components.insertBtn.element,
                // Pass only session profile
                onShowTextEditorModal: () => this.components.textEditorModal.open(this.sessionActiveProfile),
                onShowJsonModal: () => {
                    this.components.jsonModal.open(this.components.insertBtn.element);
                },
                onShowShortcutModal: () => {
                    this.components.shortcutModal.open(this.components.insertBtn.element);
                },
            });

            this.components.insertBtn = new InsertButtonComponent(
                {
                    onClick: (e) => {
                        const mode = this.config.options.trigger_mode || 'hover';

                        if (this.components.settingsPanel.isOpen()) {
                            this.components.settingsPanel.hide();
                            this._showTextList(false);
                            return;
                        }

                        if (mode === 'click') {
                            if (this.components.textList.element.style.display === 'none') {
                                this._showTextList(false);
                            } else {
                                this._hideTextList();
                            }
                        } else {
                            this._hideTextList();
                            this.components.settingsPanel.show();
                        }
                    },
                    onContextMenu: (e) => {
                        this._hideTextList();
                        this.components.settingsPanel.toggle();
                    },
                    onMouseEnter: () => {
                        const mode = this.config.options.trigger_mode || 'hover';
                        if (mode === 'hover' && !this.components.settingsPanel.isOpen()) {
                            this._showTextList(false);
                        }
                    },
                    onMouseLeave: () => {
                        const mode = this.config.options.trigger_mode || 'hover';
                        if (mode !== 'click') {
                            this._startHideTimer();
                        }
                    },
                },
                {
                    id: `${CONSTANTS.ID_PREFIX}insert-btn`,
                    title: 'Add quick text',
                }
            );

            this.components.textList = new TextListComponent(
                {
                    onMouseEnter: () => clearTimeout(this.hideTimeoutId),
                    onMouseLeave: () => {
                        const mode = this.config.options.trigger_mode || 'hover';
                        if (mode !== 'click') {
                            this._startHideTimer();
                        }
                    },
                    onMouseMove: (e) => {
                        if (this.isKeyboardNavigating) {
                            // Check if mouse actually moved to prevent unexpected blur on layout changes
                            if (e.movementX === 0 && e.movementY === 0) return;

                            this.isKeyboardNavigating = false;

                            // Remove focus from the list item to clear selection visual
                            if (document.activeElement instanceof HTMLElement && this.components.textList.element.contains(document.activeElement)) {
                                document.activeElement.blur();
                            }
                        }
                    },
                    onPrevProfile: () => this._switchProfile(-1),
                    onNextProfile: () => this._switchProfile(1),
                    onProfileNameClick: () => this.toggleProfileList(),
                    onProfileNameContextMenu: () => {
                        this._hideTextList();
                        this.components.textEditorModal.open(this.sessionActiveProfile);
                    },
                },
                {
                    id: `${CONSTANTS.ID_PREFIX}text-list`,
                }
            );

            this.components.jsonModal = new JsonModalComponent(modalCallbacks);
            this.components.textEditorModal = new TextEditorModalComponent({
                ...modalCallbacks,
                onShowJsonModal: () => {
                    this.components.textEditorModal.close();
                    this.components.jsonModal.open(this.components.insertBtn.element);
                },
            });
            this.components.shortcutModal = new ShortcutModalComponent(modalCallbacks);
        }

        async _onInit() {
            // Explicitly render components that require it
            this.components.insertBtn?.render();
            this.components.textList?.render();
            this.components.settingsPanel?.render();
            this.components.textEditorModal?.render();
            this.components.jsonModal?.render();
            this.components.shortcutModal?.render();

            this.renderContent();
            this._updateButtonTitle();

            this._subscribe(EVENTS.REOPEN_MODAL, ({ type, key }) => {
                if (type === CONSTANTS.MODAL_TYPES.JSON) {
                    this.components.jsonModal.open(this.components.insertBtn.element);
                } else if (type === CONSTANTS.MODAL_TYPES.TEXT_EDITOR) {
                    this.components.textEditorModal.open(this.sessionActiveProfile, key);
                }
            });

            this._subscribe(EVENTS.UI_REPOSITION, () => this.repositionInsertButton());

            this._subscribe(EVENTS.NAVIGATION_START, () => {
                this.components.settingsPanel.hide();
                this._hideTextList();
            });

            this.repositionInsertButton();

            // Register global key listener for shortcuts (Alt+Q)
            document.addEventListener('keydown', this._handlers.globalKeydown);

            if (this.components.settingsPanel) {
                await this.components.settingsPanel.init();
            }
            if (this.components.textEditorModal) {
                await this.components.textEditorModal.init();
            }
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this._hideTextList();
            clearTimeout(this.hideTimeoutId);

            // Remove global listeners
            document.removeEventListener('keydown', this._handlers.globalKeydown);
            document.removeEventListener('click', this._handlers.globalClick); // Ensure click listener is also removed

            for (const key in this.components) {
                this.components[key]?.destroy();
            }
            super._onDestroy();
        }

        repositionInsertButton() {
            if (this.isRepositioningScheduled) return;

            this.isRepositioningScheduled = true;
            requestAnimationFrame(() => {
                PlatformAdapters.UI.repositionInsertButton(this.components.insertBtn);
                this.isRepositioningScheduled = false;
            });
        }

        getActiveModal() {
            if (this.components.jsonModal?.modal?.element?.open) {
                return this.components.jsonModal;
            }
            if (this.components.textEditorModal?.modal?.element?.open) {
                return this.components.textEditorModal;
            }
            return null;
        }

        setModalState(isOpen) {
            this.isModalOpen = isOpen;
            if (!isOpen) {
                this.onModalClose?.();
            }
        }

        toggleProfileList() {
            this.isProfileListMode = !this.isProfileListMode;
            if (this.isProfileListMode) {
                this.renderProfileList();
            } else {
                this.renderContent();
            }
        }

        renderProfileList() {
            if (!this.components.textList) return;

            this.components.textList.toggleTabs(false);

            const { optionsContainer } = this.components.textList.elements;
            optionsContainer.textContent = '';

            // Array-based access
            const profiles = this.config.texts || [];
            const activeProfileName = this.sessionActiveProfile;

            // Retrieve class names from StyleDefinitions
            const cls = StyleDefinitions.getTextList().classes;

            profiles.forEach((profile) => {
                const profileName = profile.name;
                const btn = h('button', {
                    className: `${cls.option}` + (profileName === activeProfileName ? ' active' : ''),
                    textContent: profileName,
                    title: 'Switch to this profile',
                    onclick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this._setProfile(profileName);

                        // Only focus if navigating via keyboard
                        if (this.isKeyboardNavigating) {
                            requestAnimationFrame(() => this.components.textList.focusOption(0));
                        }
                    },
                });
                optionsContainer.appendChild(btn);
            });

            optionsContainer.scrollTop = 0;
        }

        updateConfig(newConfig) {
            this.config = newConfig;

            // Array-based validation
            const profiles = this.config.texts || [];
            const activeProfileObj = profiles.find((p) => p.name === this.sessionActiveProfile);

            if (!activeProfileObj) {
                Logger.warn('STATE RECOVERY', LOG_STYLES.ORANGE, `Session profile "${this.sessionActiveProfile}" no longer exists. Falling back to default.`);
                const fallbackProfile = profiles[0];
                this.sessionActiveProfile = this.config.options.activeProfileName || fallbackProfile?.name;

                const activeProfile = profiles.find((p) => p.name === this.sessionActiveProfile) || fallbackProfile;
                this.activeCategory = activeProfile?.categories[0]?.name || null;
            } else {
                const categories = activeProfileObj.categories;
                const categoryExists = categories.some((c) => c.name === this.activeCategory);
                if (this.activeCategory && !categoryExists) {
                    this.activeCategory = categories[0]?.name || null;
                }
            }

            this.renderContent();
            this._updateButtonTitle();
        }

        renderContent() {
            if (!this.components.textList) return;

            this.isProfileListMode = false;
            this.components.textList.toggleTabs(true);

            const { tabsContainer, optionsContainer } = this.components.textList.elements;
            tabsContainer.textContent = '';
            optionsContainer.textContent = '';

            const activeProfileName = this.sessionActiveProfile;
            const profiles = this.config.texts || [];
            const activeProfile = profiles.find((p) => p.name === activeProfileName);

            if (!activeProfile) {
                Logger.warn('', '', `Active profile "${activeProfileName}" not found.`);
                return;
            }

            this.components.textList.setProfileName(activeProfileName);

            // Retrieve class names from StyleDefinitions
            const cls = StyleDefinitions.getTextList().classes;
            const categories = activeProfile.categories || [];

            categories.forEach((cat) => {
                const catName = cat.name;
                const tab = h('button', {
                    className: `${cls.tab}` + (catName === this.activeCategory ? ' active' : ''),
                    textContent: catName,
                    onclick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.activeCategory = catName;
                        this.renderContent();

                        // Only focus if navigating via keyboard
                        if (this.isKeyboardNavigating) {
                            requestAnimationFrame(() => this.components.textList.focusOption(0));
                        }
                    },
                });
                tabsContainer.appendChild(tab);
            });

            // Find active category object
            const activeCategoryObj = categories.find((c) => c.name === this.activeCategory);
            const items = activeCategoryObj ? activeCategoryObj.items : [];

            items.forEach((txt) => {
                const btn = h('button', {
                    className: `${cls.option}`,
                    textContent: txt,
                    title: txt,
                    onclick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this._insertText(txt);
                        this._hideTextList();
                    },
                });
                optionsContainer.appendChild(btn);
            });
        }

        async _switchCategory(direction) {
            const profiles = this.config.texts || [];
            const activeProfile = profiles.find((p) => p.name === this.sessionActiveProfile);
            if (!activeProfile) return;

            const categories = activeProfile.categories || [];
            if (categories.length <= 1) return;

            const currentIndex = categories.findIndex((c) => c.name === this.activeCategory);
            // Fallback if not found
            const baseIndex = currentIndex === -1 ? 0 : currentIndex;

            let newIndex = (baseIndex + direction) % categories.length;
            if (newIndex < 0) newIndex += categories.length;

            const newCategory = categories[newIndex];
            this.activeCategory = newCategory.name;

            this.renderContent();

            // Reset focus to the first item in the new category
            requestAnimationFrame(() => this.components.textList.focusOption(0));
        }

        async _switchProfile(direction) {
            const profiles = this.config.texts || [];
            if (profiles.length <= 1) return;

            const currentProfileIndex = profiles.findIndex((p) => p.name === this.sessionActiveProfile);
            // Fallback if not found
            const baseIndex = currentProfileIndex === -1 ? 0 : currentProfileIndex;

            let newIndex = (baseIndex + direction) % profiles.length;
            if (newIndex < 0) newIndex += profiles.length;

            const newProfile = profiles[newIndex];
            this.sessionActiveProfile = newProfile.name;
            this.activeCategory = newProfile.categories[0]?.name || null;

            this.renderContent();

            if (this.components.textList.elements.optionsContainer) {
                this.components.textList.elements.optionsContainer.scrollTop = 0;
            }
        }

        async _setProfile(profileName) {
            if (profileName === this.sessionActiveProfile) {
                this.renderContent();
                return;
            }

            this.sessionActiveProfile = profileName;

            const profiles = this.config.texts || [];
            const activeProfile = profiles.find((p) => p.name === profileName);

            this.activeCategory = activeProfile?.categories[0]?.name || null;

            this.renderContent();

            if (this.components.textList.elements.optionsContainer) {
                this.components.textList.elements.optionsContainer.scrollTop = 0;
            }
        }

        _updateButtonTitle() {
            if (!this.components.insertBtn) return;
            const mode = this.config.options.trigger_mode || 'hover';
            const shortcutSuffix = this.config.options.enable_shortcut ? ' (Alt+Q)' : '';

            let title;
            if (mode === 'click') {
                title = `Click to open Text List${shortcutSuffix} / Right-click to open Settings`;
            } else {
                title = `Hover to open Text List${shortcutSuffix} / Click to open Settings`;
            }
            this.components.insertBtn.setTitle(title);
        }

        _insertText(text) {
            PlatformAdapters.General.insertText(text, this.config.options);
        }

        _positionList() {
            requestAnimationFrame(() => {
                const btnRect = this.components.insertBtn.element.getBoundingClientRect();
                const listElem = this.components.textList.element;
                const margin = 8;
                const gap = 4;

                const spaceAbove = btnRect.top - margin - gap;
                const spaceBelow = window.innerHeight - btnRect.bottom - margin - gap;

                const placeOnTop = spaceAbove >= 200 || spaceAbove >= spaceBelow;

                if (placeOnTop) {
                    listElem.style.flexDirection = 'column-reverse';
                    listElem.style.top = 'auto';
                    listElem.style.bottom = `${window.innerHeight - btnRect.top + gap}px`;
                    listElem.style.maxHeight = `${spaceAbove}px`;
                } else {
                    listElem.style.flexDirection = 'column';
                    listElem.style.bottom = 'auto';
                    listElem.style.top = `${btnRect.bottom + gap}px`;
                    listElem.style.maxHeight = `${spaceBelow}px`;
                }

                const listWidth = listElem.offsetWidth || 500;
                let left = btnRect.left;
                if (left + listWidth > window.innerWidth - margin) {
                    left = window.innerWidth - listWidth - margin;
                }
                left = Math.max(left, margin);
                listElem.style.left = `${left}px`;

                listElem.style.opacity = '1';
            });
        }

        _showTextList(isKeyboard) {
            clearTimeout(this.hideTimeoutId);
            const listElem = this.components.textList.element;

            if (listElem.style.display !== 'none') return;

            // Set navigation mode flag based on trigger source
            this.isKeyboardNavigating = isKeyboard;

            listElem.style.display = 'flex';
            listElem.style.opacity = '0';
            listElem.style.left = '-9999px';
            listElem.style.top = '';
            listElem.style.bottom = '';

            this._positionList();

            // Setup global click listener for closing (only when open)
            document.addEventListener('click', this._handlers.globalClick);

            // Restore focus (Native Focus Management)
            if (isKeyboard) {
                requestAnimationFrame(() => {
                    if (this.isProfileListMode) {
                        this.components.textList.focusOption(0);
                    } else {
                        this.components.textList.focusOption(this.lastFocusedIndex);
                    }
                });
            }
        }

        _startHideTimer() {
            this.hideTimeoutId = setTimeout(() => {
                this._hideTextList();
            }, CONSTANTS.TIMING.TIMEOUTS.HIDE_DELAY_MS);
        }

        _hideTextList() {
            clearTimeout(this.hideTimeoutId);

            const listElem = this.components.textList.element;
            if (listElem.style.display === 'none') return;

            // Remember focus index if not in profile list mode
            if (!this.isProfileListMode) {
                const options = this.components.textList._getOptions();
                const current = document.activeElement;
                const index = current instanceof HTMLElement ? options.indexOf(current) : -1;
                if (index >= 0) {
                    this.lastFocusedIndex = index;
                }
            }

            listElem.style.display = 'none';

            // Remove global click listener (Keydown listener remains active)
            document.removeEventListener('click', this._handlers.globalClick);

            if (this.isProfileListMode) {
                this.renderContent(); // Reset to text content view
            }

            // UX: Restore focus to the input editor
            const editorSelector = this.platformDetails.selectors.INPUT_TARGET;
            const editor = document.querySelector(editorSelector);
            if (editor instanceof HTMLElement) {
                editor.focus();
            }
        }

        _handleGlobalClick(e) {
            const listEl = this.components.textList.element;
            const btnEl = this.components.insertBtn.element;

            // If closed, do nothing (though listener should be removed)
            if (listEl.style.display === 'none') return;

            // Ignore clicks inside the list or on the toggle button
            if (listEl.contains(e.target) || btnEl.contains(e.target)) {
                return;
            }

            this._hideTextList();
        }

        /**
         * Checks if any modal or settings panel is currently open.
         * @returns {boolean}
         * @private
         */
        _isAnyModalOpen() {
            // Check Settings Panel
            if (this.components.settingsPanel && this.components.settingsPanel.isOpen()) {
                return true;
            }

            // Check Dialog Modals
            const modals = [this.components.textEditorModal, this.components.jsonModal, this.components.shortcutModal];

            return modals.some((comp) => comp?.modal?.element?.open);
        }

        _handleGlobalKeydown(e) {
            // 1. Global Toggle (Alt+Q)
            // Use code 'KeyQ' for physical key position independence, or 'q' key property.
            // Exclude AltGr (Ctrl+Alt) to avoid accidental trigger on some keyboard layouts
            const isAltGraph = e.getModifierState ? e.getModifierState('AltGraph') : false;

            if (e.altKey && !e.ctrlKey && !e.metaKey && !isAltGraph && (e.code === 'KeyQ' || e.key === 'q')) {
                // Check if shortcut is enabled
                if (this.config.options.enable_shortcut === false) {
                    return;
                }

                // If any modal/panel is open, ignore the shortcut completely
                if (this._isAnyModalOpen()) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                if (this.components.textList.element.style.display === 'none') {
                    this._showTextList(true);
                } else {
                    this._hideTextList();
                }
                return;
            }

            // If list is closed, stop processing navigation keys
            if (this.components.textList.element.style.display === 'none') return;

            // Prevent interference with IME composition (e.g., when focus logic fails and focus remains on input)
            if (e.isComposing) return;

            // Close list on character input
            // Consume the event so no character is entered, then close the list.
            // Note: Space key is excluded here because it is handled explicitly in the switch statement below.
            const isCharKey = !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && e.key !== ' ';
            if (isCharKey) {
                e.preventDefault();
                e.stopPropagation();
                this._hideTextList();
                return;
            }

            // 2. Navigation when List is Open
            const isProfileList = this.isProfileListMode;

            // Update navigation mode to keyboard
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                this.isKeyboardNavigating = true;
            }

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    this._hideTextList();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.ctrlKey) {
                        // Ctrl+Up: Toggle Profile List
                        this.toggleProfileList();
                        if (this.isProfileListMode) {
                            requestAnimationFrame(() => this.components.textList.focusOption(0));
                        } else {
                            requestAnimationFrame(() => this.components.textList.focusOption(this.lastFocusedIndex));
                        }
                    } else {
                        // Normal Up: Previous Item
                        this.components.textList.focusPrev();
                    }
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.ctrlKey) {
                        // Ctrl+Down: Toggle Profile List
                        this.toggleProfileList();
                        if (this.isProfileListMode) {
                            requestAnimationFrame(() => this.components.textList.focusOption(0));
                        } else {
                            requestAnimationFrame(() => this.components.textList.focusOption(this.lastFocusedIndex));
                        }
                    } else {
                        // Normal Down: Next Item
                        this.components.textList.focusNext();
                    }
                    break;

                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.ctrlKey) {
                        // Ctrl+Left: Switch Profile
                        if (!isProfileList) {
                            this._switchProfile(-1).then(() => {
                                // Reset focus to first item after switch
                                requestAnimationFrame(() => this.components.textList.focusOption(0));
                            });
                        }
                    } else {
                        // Normal Left: Switch Category (New Feature)
                        if (!isProfileList) {
                            this._switchCategory(-1);
                        }
                    }
                    break;

                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.ctrlKey) {
                        // Ctrl+Right: Switch Profile
                        if (!isProfileList) {
                            this._switchProfile(1).then(() => {
                                // Reset focus to first item after switch
                                requestAnimationFrame(() => this.components.textList.focusOption(0));
                            });
                        }
                    } else {
                        // Normal Right: Switch Category
                        if (!isProfileList) {
                            this._switchCategory(1);
                        }
                    }
                    break;

                case 'Tab':
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    e.stopPropagation();
                    if (document.activeElement instanceof HTMLElement && this.components.textList.element.contains(document.activeElement)) {
                        document.activeElement.click();
                    } else {
                        // Handle selection via mouse hover if no element is focused
                        const cls = StyleManager.request(StyleDefinitions.getTextList).classes;
                        const hoverOption = this.components.textList.element.querySelector(`.${cls.option}:hover`);
                        if (hoverOption instanceof HTMLElement) {
                            hoverOption.click();
                        } else {
                            this._hideTextList();
                        }
                    }
                    break;
            }
        }
    }

    // =================================================================================
    // SECTION: Sync Manager
    // =================================================================================

    class SyncManager extends BaseManager {
        constructor(appInstance) {
            super();
            this.app = appInstance;
            this.pendingRemoteConfig = null;
            this.remoteChangeListenerId = null;
        }

        _onInit() {
            this.remoteChangeListenerId = GM_addValueChangeListener(this.app.configKey, async (name, oldValue, newValue, remote) => {
                if (remote) {
                    await this._handleRemoteChange(newValue);
                }
            });
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            if (this.remoteChangeListenerId !== null) {
                GM_removeValueChangeListener(this.remoteChangeListenerId);
                this.remoteChangeListenerId = null;
            }
            super._onDestroy();
        }

        onModalClose() {
            if (this.pendingRemoteConfig) {
                Logger.log('', '', 'SyncManager: Modal closed with a pending update. Applying it now.');
                this.app.applyUpdate(this.pendingRemoteConfig);
                this.pendingRemoteConfig = null;
            }
        }

        onSave() {
            // A local save overwrites any pending remote changes.
            this.pendingRemoteConfig = null;
            // Also, clear any visible conflict notifications.
            const activeModal = this.app.uiManager.getActiveModal?.();
            if (activeModal) {
                this._clearConflictNotification(activeModal);
            }
        }

        async _handleRemoteChange(rawValue) {
            Logger.info('SYNC', LOG_STYLES.TEAL, 'SyncManager: Remote config change detected.');
            try {
                const newConfig = await this.app.configManager.decode(rawValue);
                const activeModal = this.app.uiManager.getActiveModal?.();

                if (activeModal) {
                    Logger.info('SYNC', LOG_STYLES.TEAL, 'SyncManager: A modal is open. Storing update and displaying conflict notification.');
                    this.pendingRemoteConfig = newConfig;
                    this._showConflictNotification(activeModal);
                } else {
                    Logger.info('SYNC', LOG_STYLES.TEAL, 'SyncManager: No modal open. Applying silent update.');
                    this.app.applyUpdate(newConfig);
                }
            } catch (e) {
                Logger.error('SYNC ERROR', LOG_STYLES.RED, 'SyncManager: Failed to handle remote config change:', e);
            }
        }

        _showConflictNotification(modalComponent) {
            if (!modalComponent?.modal) return;
            this._clearConflictNotification(modalComponent); // Clear previous state first

            const messageArea = modalComponent.modal.dom.footerMessage;
            const cls = StyleDefinitions.COMMON_CLASSES;
            const v = StyleDefinitions.VARS;

            if (messageArea) {
                const messageText = h('span', {
                    textContent: 'Settings updated in another tab.',
                    style: { display: 'flex', alignItems: 'center' },
                });
                const reloadBtn = h('button', {
                    id: cls.conflictReloadBtnId,
                    className: cls.modalButton,
                    textContent: 'Reload UI',
                    title: 'Discard local changes and load the settings from the other tab.',
                    style: {
                        borderColor: `var(${v.TEXT_DANGER})`,
                        marginLeft: '12px',
                    },
                    onclick: () => {
                        const reopenContext = modalComponent.getContextForReopen?.();
                        modalComponent.close();
                        // onModalClose will handle applying the pending update.
                        // Request to reopen the modal after a short delay to ensure sync completion.
                        setTimeout(() => {
                            EventBus.publish(EVENTS.REOPEN_MODAL, reopenContext);
                        }, 100);
                    },
                });
                messageArea.textContent = '';
                messageArea.classList.add(cls.conflictText);
                messageArea.append(messageText, reloadBtn);
            }
        }

        _clearConflictNotification(modalComponent) {
            if (!modalComponent?.modal) return;
            const messageArea = modalComponent.modal.dom.footerMessage;
            if (messageArea) {
                messageArea.textContent = '';
                messageArea.classList.remove(StyleDefinitions.COMMON_CLASSES.conflictText);
            }
        }
    }

    // =================================================================================
    // SECTION: Navigation Monitor
    // Description: Centralizes URL change detection via history API hooks and popstate events.
    // =================================================================================

    class NavigationMonitor {
        constructor() {
            this.originalHistoryMethods = { pushState: null, replaceState: null };
            this._historyWrappers = {};
            this.isInitialized = false;
            this.lastPath = null;
            this._handlePopState = this._handlePopState.bind(this);

            // Debounce the navigation event to allow the DOM to settle and prevent duplicate events
            this.debouncedNavigation = debounce(
                () => {
                    EventBus.publish(EVENTS.NAVIGATION);
                },
                CONSTANTS.TIMING.TIMEOUTS.POST_NAVIGATION_DOM_SETTLE,
                true
            );
        }

        init() {
            if (this.isInitialized) return;
            this.isInitialized = true;
            // Capture initial path
            this.lastPath = location.pathname + location.search;
            this._hookHistory();
            window.addEventListener('popstate', this._handlePopState);
        }

        destroy() {
            if (!this.isInitialized) return;
            this._restoreHistory();
            window.removeEventListener('popstate', this._handlePopState);
            this.debouncedNavigation.cancel();
            this.isInitialized = false;
        }

        _hookHistory() {
            // Capture the instance for use in the wrapper
            const instance = this;

            for (const m of ['pushState', 'replaceState']) {
                const orig = history[m];
                this.originalHistoryMethods[m] = orig;

                const wrapper = function (...args) {
                    const result = orig.apply(this, args);
                    instance._onUrlChange();
                    return result;
                };

                this._historyWrappers[m] = wrapper;
                history[m] = wrapper;
            }
        }

        _restoreHistory() {
            for (const m of ['pushState', 'replaceState']) {
                if (this.originalHistoryMethods[m]) {
                    if (history[m] === this._historyWrappers[m]) {
                        history[m] = this.originalHistoryMethods[m];
                    } else {
                        Logger.warn('HISTORY HOOK', LOG_STYLES.YELLOW, `history.${m} has been wrapped by another script. Skipping restoration to prevent breaking the chain.`);
                    }
                    this.originalHistoryMethods[m] = null;
                }
            }
            this._historyWrappers = {};
        }

        _handlePopState() {
            this._onUrlChange();
        }

        _onUrlChange() {
            const currentPath = location.pathname + location.search;

            // Prevent re-triggers if the path hasn't actually changed
            if (currentPath === this.lastPath) {
                return;
            }
            this.lastPath = currentPath;

            EventBus.publish(EVENTS.NAVIGATION_START);
            this.debouncedNavigation();
        }
    }

    // =================================================================================
    // SECTION: DOM Observers and Event Listeners
    // =================================================================================

    class ObserverManager extends BaseManager {
        constructor() {
            super();
            this.activePageObservers = []; // To store cleanup functions
        }

        /**
         * Starts all platform-specific observers by retrieving and executing them
         * from the PlatformAdapter.
         */
        start() {
            // Subscribe to navigation events to handle page changes
            this._subscribe(EVENTS.NAVIGATION, () => this._onNavigation());

            // Perform initial setup by publishing the navigation event.
            EventBus.publish(EVENTS.NAVIGATION);
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            this.activePageObservers.forEach((cleanup) => cleanup());
            this.activePageObservers = [];
            super._onDestroy();
        }

        /**
         * @private
         * @description Handles the logic required when a navigation occurs or the app initializes.
         * Resets observers and sets up page-specific listeners.
         */
        _onNavigation() {
            try {
                Logger.debug('NAVIGATOR', LOG_STYLES.CYAN, 'Navigation detected. Starting lifecycle...');

                // 1. Cleanup previous page resources
                this.activePageObservers.forEach((cleanup) => cleanup());
                this.activePageObservers = [];

                // 2. Initialize Page-Specific Observers
                const observerStarters = PlatformAdapters.Observer.getInitializers();
                for (const startObserver of observerStarters) {
                    // Ensure the context of 'this' is the ObserverManager instance
                    const cleanup = startObserver.call(this, {});
                    if (typeof cleanup === 'function') {
                        this.activePageObservers.push(cleanup);
                    }
                }
            } catch (e) {
                Logger.error('NAV_HANDLER_ERROR', LOG_STYLES.RED, 'Error during navigation handling:', e);
            }
        }
    }

    // =================================================================================
    // SECTION: Main Application Controller
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
                        Logger.error('SENTINEL', LOG_STYLES.RED, 'Failed to insert keyframes rule:', e);
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
                Logger.error('SENTINEL', LOG_STYLES.RED, `Failed to insert rule for selector "${selector}":`, e);
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
            Logger.debug('SENTINEL', LOG_STYLES.CYAN, 'Suspended.');
        }

        resume() {
            if (this.styleElement instanceof HTMLStyleElement) {
                this.styleElement.disabled = false;
            }
            Logger.debug('SENTINEL', LOG_STYLES.CYAN, 'Resumed.');
        }
    }

    // =================================================================================
    // SECTION: Core Functions
    // =================================================================================

    class AppController extends BaseManager {
        constructor(platformDetails) {
            super();
            this.configManager = null;
            this.uiManager = null;
            this.platformDetails = platformDetails;
            this.syncManager = null;
            this.observerManager = new ObserverManager();
        }

        async _onInit() {
            // Inject platform-specific CSS variables immediately
            StyleManager.injectPlatformVariables(this.platformDetails.platformId);

            this.configManager = new ConfigManager();
            await this.configManager.load();

            // Set logger level from config immediately after loading
            Logger.setLevel(this.configManager.get().developer.logger_level);

            this.syncManager = new SyncManager(this);

            this.uiManager = new UIManager(
                this.configManager.get(),
                (newConfig) => this.handleSave(newConfig),
                this.platformDetails,
                () => this.syncManager.onModalClose(),
                (conf) => this.configManager.validateConfigSize(conf) // Pass size validator
            );
            await this.uiManager.init();
            await this.syncManager.init();

            this.observerManager.init();
            this.observerManager.start();
        }

        /**
         * @override
         * @protected
         */
        _onDestroy() {
            // Do not destroy navigationMonitor to keep history hooks active for recovery
            this.uiManager?.destroy();
            this.observerManager?.destroy();
            this.configManager?.destroy();
            this.syncManager?.destroy();
            super._onDestroy();
            Logger.debug('SHUTDOWN', LOG_STYLES.GRAY, 'AppController destroyed (suspended).');
        }

        // Method required by the SyncManager's interface for silent updates
        applyUpdate(newConfig) {
            const completeConfig = ConfigProcessor.process(newConfig);
            this.configManager.config = completeConfig;
            this.uiManager.updateConfig(completeConfig);

            // Apply logger level immediately
            if (completeConfig.developer && completeConfig.developer.logger_level) {
                Logger.setLevel(completeConfig.developer.logger_level);
            }

            // Notify UI components (e.g., SettingsPanel) to update their state
            EventBus.publish(EVENTS.CONFIG_UPDATED, completeConfig);
        }

        // Method required by the SyncManager's interface
        getAppId() {
            return APPID;
        }

        // Getter required by the SyncManager's interface
        get configKey() {
            return CONSTANTS.CONFIG_KEY;
        }

        async handleSave(newConfig) {
            try {
                // 1. Save to storage (Validation and sanitization occur here)
                await this.configManager.save(newConfig);

                // 2. Retrieve the sanitized config from the manager
                // This ensures we are using the valid data that was actually saved.
                const savedConfig = this.configManager.get();

                // 3. Update the UI Manager with the new config
                this.uiManager.updateConfig(savedConfig);

                // 4. Apply the new logger level immediately
                if (savedConfig.developer && savedConfig.developer.logger_level) {
                    Logger.setLevel(savedConfig.developer.logger_level);
                }

                // 5. Notify UI components (e.g., SettingsPanel) to refresh their form values
                // This is critical if the save was triggered by one component but others need to stay in sync.
                EventBus.publish(EVENTS.CONFIG_UPDATED, savedConfig);

                // 6. Notify SyncManager of the successful save
                this.syncManager.onSave();
            } catch (err) {
                Logger.error('CONFIG', '', 'Failed to save config:', err);
                throw err; // Re-throw the error for the UI layer to catch
            }
        }
    }

    // =================================================================================
    // SECTION: Lifecycle Manager
    // Description: Centralizes application startup/shutdown logic.
    // =================================================================================

    class LifecycleManager extends BaseManager {
        constructor(platformDetails) {
            super();
            this.platformDetails = platformDetails;
            this.app = new AppController(platformDetails);
            this.navMonitor = new NavigationMonitor();
            this._boundUpdateState = this._updateState.bind(this);
        }

        /**
         * @protected
         * @override
         */
        _onInit() {
            // Start navigation monitoring
            this.navMonitor.init();

            // Trigger 1: DOM Detection
            sentinel.on(this.platformDetails.selectors.INPUT_TARGET, this._boundUpdateState);

            // Trigger 2: Navigation
            this._subscribe(EVENTS.NAVIGATION, this._boundUpdateState);

            // Initial check
            this._updateState();
        }

        /**
         * @protected
         * @override
         */
        _onDestroy() {
            // Stop navigation monitoring
            this.navMonitor.destroy();

            // Cleanup Sentinel listener
            sentinel.off(this.platformDetails.selectors.INPUT_TARGET, this._boundUpdateState);

            // Ensure AppController is destroyed
            if (this.app.isInitialized) {
                this.app.destroy();
            }
            super._onDestroy();
        }

        _updateState() {
            // 1. Check exclusion rules
            if (PlatformAdapters.General.isExcludedPage()) {
                Logger.info('SUSPENDED', LOG_STYLES.YELLOW, 'Excluded page detected. App suspended.');
                if (this.app.isInitialized) {
                    this.app.destroy();
                }
                return;
            }

            // 2. Try to launch if valid target exists
            if (!this.app.isInitialized) {
                const target = document.querySelector(this.platformDetails.selectors.INPUT_TARGET);
                if (target) {
                    this.app.init();
                }
            }
        }
    }

    // =================================================================================
    // SECTION: Entry Point
    // =================================================================================

    // Exit if already executed
    if (ExecutionGuard.hasExecuted()) return;
    ExecutionGuard.setExecuted();

    // Singleton instance for observing internal DOM node insertions.
    const sentinel = new Sentinel(OWNERID);

    // Main Execution
    const platformDetails = PlatformAdapters.General.getPlatformDetails();
    if (platformDetails) {
        const lifecycleManager = new LifecycleManager(platformDetails);
        lifecycleManager.init();
    }
})();
