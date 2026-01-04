// ==UserScript==
// @name         Quick-Text-Buttons
// @namespace    https://github.com/p65536
// @version      2.2.0
// @license      MIT
// @description  Adds customizable buttons to paste predefined text into the input field on ChatGPT/Gemini.
// @icon         https://raw.githubusercontent.com/p65536/p65536/main/images/qtb.svg
// @author       p65536
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
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
    // SECTION: Style Definitions
    // =================================================================================

    // Style definitions for styled Logger.badge()
    const LOG_STYLES = {
        BASE: 'color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        BLUE: 'background: #007bff;',
        GREEN: 'background: #28a745;',
        YELLOW: 'background: #ffc107; color: black;',
        RED: 'background: #dc3545;',
        GRAY: 'background: #6c757d;',
    };

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
    // Description: Defines default settings, global constants, and CSS selectors.
    // =================================================================================

    const CONSTANTS = {
        CONFIG_KEY: `${APPID}_config`,
        CONFIG_SIZE_LIMIT_BYTES: 10485760, // 10MB
        ID_PREFIX: `${APPID}-id-`,
        TEXT_LIST_WIDTH: 500,
        HIDE_DELAY_MS: 250,
        Z_INDICES: {
            SETTINGS_PANEL: 11000,
            TEXT_LIST: 20001,
        },
        MODAL: {
            WIDTH: 440,
            PADDING: 16,
            RADIUS: 8,
            BTN_RADIUS: 5,
            BTN_FONT_SIZE: 13,
            BTN_PADDING: '5px 16px',
            TITLE_MARGIN_BOTTOM: 8,
            BTN_GROUP_GAP: 8,
            TEXTAREA_HEIGHT: 200,
        },
        TIMING: {
            DEBOUNCE_DELAYS: {
                UI_UPDATE: 50,
            },
            TIMEOUTS: {
                // Fallback delay for requestIdleCallback
                IDLE_EXECUTION_FALLBACK: 50,
                POST_NAVIGATION_DOM_SETTLE: 200,
                // Delay to wait for panel transition animations to complete
                PANEL_TRANSITION_DURATION: 350,
            },
        },
        UI_DEFAULTS: {
            // Offset from the left edge of the input area
            BUTTON_OFFSET_X: 12,
            // Gap between buttons
            BUTTON_GAP_Y: 8,
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
        MODAL_TYPES: {
            JSON: 'json',
            TEXT_EDITOR: 'textEditor',
        },
        SLIDER_MAPPINGS: {
            VALUE_TO_CONFIG: { 0: 'start', 1: 'cursor', 2: 'end' },
            CONFIG_TO_VALUE: { start: '0', cursor: '1', end: '2' },
            VALUE_TO_DISPLAY: { 0: 'Start', 1: 'Cursor', 2: 'End' },
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

    // ---- Site-specific Style Variables ----
    const SITE_STYLES = {
        chatgpt: {
            ANCHOR: {
                display: 'flex',
                'align-items': 'center',
                gap: '2px',
            },
            INSERT_BUTTON: {
                styles: {
                    position: 'static !important',
                    margin: '0 0 0 0 !important',
                    display: 'flex',
                    // Updated dimensions to match native buttons
                    width: 'calc(var(--spacing)*9)',
                    height: 'calc(var(--spacing)*9)',
                    background: 'transparent',
                    border: 'none',
                    // Capsule/Circle shape
                    'border-radius': '50%',
                    // Apply site icon color
                    color: 'var(--text-primary)',
                },
                hoverStyles: {
                    background: 'var(--interactive-bg-secondary-hover)',
                },
                iconDef: {
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
            },
            SETTINGS_PANEL: {
                bg: 'var(--sidebar-surface-primary)',
                text_primary: 'var(--text-primary)',
                text_secondary: 'var(--text-secondary)',
                border_medium: 'var(--border-medium)',
                border_default: 'var(--border-default)',
                border_light: 'var(--border-light)',
                accent_color: 'var(--text-accent)',
                input_bg: 'var(--bg-primary)',
                input_text: 'var(--text-primary)',
                input_border: 'var(--border-default)',
                toggle_bg_off: 'var(--bg-primary)',
                toggle_bg_on: 'var(--text-accent)',
                toggle_knob: 'var(--text-primary)',
            },
            JSON_MODAL: {
                bg: 'var(--main-surface-primary)',
                text: 'var(--text-primary)',
                border: 'var(--border-default)',
                btn_bg: 'var(--interactive-bg-tertiary-default)',
                btn_hover_bg: 'var(--interactive-bg-secondary-hover)',
                btn_text: 'var(--text-primary)',
                btn_border: 'var(--border-default)',
                textarea_bg: 'var(--bg-primary)',
                textarea_text: 'var(--text-primary)',
                textarea_border: 'var(--border-default)',
                msg_error_text: 'var(--text-danger)',
                msg_success_text: 'var(--text-accent)',
            },
            THEME_MODAL: {
                bg: 'var(--main-surface-primary)',
                text: 'var(--text-primary)',
                border: 'var(--border-default)',
                btn_bg: 'var(--interactive-bg-tertiary-default)',
                btn_hover_bg: 'var(--interactive-bg-secondary-hover)',
                btn_text: 'var(--text-primary)',
                btn_border: 'var(--border-default)',
                error_text: 'var(--text-danger)',
                delete_confirm_label_text: 'var(--text-danger)',
                delete_confirm_btn_text: 'var(--interactive-label-danger-secondary-default)',
                delete_confirm_btn_bg: 'var(--interactive-bg-danger-secondary-default)',
                delete_confirm_btn_hover_text: 'var(--interactive-label-danger-secondary-hover)',
                delete_confirm_btn_hover_bg: 'var(--interactive-bg-danger-secondary-hover)',
                fieldset_border: 'var(--border-medium)',
                legend_text: 'var(--text-secondary)',
                label_text: 'var(--text-secondary)',
                input_bg: 'var(--bg-primary)',
                input_text: 'var(--text-primary)',
                input_border: 'var(--border-default)',
                slider_display_text: 'var(--text-secondary)',
                popup_bg: 'var(--main-surface-primary)',
                popup_border: 'var(--border-default)',
                dnd_indicator_color: 'var(--text-accent)',
                upIconDef: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' },
                    children: [{ tag: 'path', props: { d: 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z' } }],
                },
                downIconDef: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' },
                    children: [{ tag: 'path', props: { d: 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z' } }],
                },
                deleteIconDef: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' },
                    children: [{ tag: 'path', props: { d: 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' } }],
                },
            },
            TEXT_LIST: {
                bg: 'var(--main-surface-primary)',
                text: 'var(--text-primary)',
                border: 'var(--border-light)',
                shadow: 'var(--drop-shadow-md, 0 3px 3px #0000001f)',
                separator_bg: 'var(--border-default)',
                tab_bg: 'var(--interactive-bg-tertiary-default)',
                tab_text: 'var(--text-primary)',
                tab_border: 'var(--border-light)',
                tab_hover_bg: 'var(--interactive-bg-secondary-hover)',
                tab_active_bg: 'var(--interactive-bg-secondary-hover)',
                tab_active_border: 'var(--border-default)',
                tab_active_outline: 'var(--border-default)',
                option_bg: 'var(--interactive-bg-tertiary-default)',
                option_text: 'var(--text-primary)',
                option_border: 'var(--border-default)',
                option_hover_bg: 'var(--interactive-bg-secondary-hover)',
                option_hover_border: 'var(--border-default)',
                option_hover_outline: 'var(--border-default)',
            },
        },
        gemini: {
            ANCHOR: {
                display: 'flex',
                'align-items': 'center',
                position: 'relative', // Ensure anchor is a positioning context
            },
            INSERT_BUTTON: {
                styles: {
                    position: 'absolute !important',
                    left: '8px',
                    bottom: '12px',
                    margin: '0 !important',
                    display: 'flex',
                    width: '40px',
                    height: '40px',
                    background: 'transparent',
                    border: 'none',
                    'border-radius': '50%',
                    // Match native tool button color
                    color: 'var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant))',
                },
                hoverStyles: {
                    // Replicate Material Design 3 state layer: State Layer Color at 8% opacity
                    background: 'color-mix(in srgb, var(--mat-icon-button-state-layer-color) 8%, transparent)',
                },
                iconDef: {
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
            },
            SETTINGS_PANEL: {
                bg: 'var(--gem-sys-color--surface-container-highest)',
                text_primary: 'var(--gem-sys-color--on-surface)',
                text_secondary: 'var(--gem-sys-color--on-surface-variant)',
                border_medium: 'var(--gem-sys-color--outline)',
                border_default: 'var(--gem-sys-color--outline)',
                border_light: 'var(--gem-sys-color--outline)',
                accent_color: 'var(--gem-sys-color--primary)',
                input_bg: 'var(--gem-sys-color--surface-container-low)',
                input_text: 'var(--gem-sys-color--on-surface)',
                input_border: 'var(--gem-sys-color--outline)',
                toggle_bg_off: 'var(--gem-sys-color--surface-container)',
                toggle_bg_on: 'var(--gem-sys-color--primary)',
                toggle_knob: 'var(--gem-sys-color--on-primary-container)',
            },
            JSON_MODAL: {
                bg: 'var(--gem-sys-color--surface-container-highest)',
                text: 'var(--gem-sys-color--on-surface)',
                border: 'var(--gem-sys-color--outline)',
                btn_bg: 'var(--gem-sys-color--surface-container-high)',
                btn_hover_bg: 'var(--gem-sys-color--surface-container-higher)',
                btn_text: 'var(--gem-sys-color--on-surface-variant)',
                btn_border: 'var(--gem-sys-color--outline)',
                textarea_bg: 'var(--gem-sys-color--surface-container-low)',
                textarea_text: 'var(--gem-sys-color--on-surface)',
                textarea_border: 'var(--gem-sys-color--outline)',
                msg_error_text: 'var(--gem-sys-color--error)',
                msg_success_text: 'var(--gem-sys-color--primary)',
            },
            THEME_MODAL: {
                bg: 'var(--gem-sys-color--surface-container-highest)',
                text: 'var(--gem-sys-color--on-surface)',
                border: 'var(--gem-sys-color--outline)',
                btn_bg: 'var(--gem-sys-color--surface-container-high)',
                btn_hover_bg: 'var(--gem-sys-color--surface-container-higher)',
                btn_text: 'var(--gem-sys-color--on-surface-variant)',
                btn_border: 'var(--gem-sys-color--outline)',
                error_text: 'var(--gem-sys-color--error)',
                delete_confirm_label_text: 'var(--gem-sys-color--error)',
                delete_confirm_btn_text: 'var(--gem-sys-color--on-error-container)',
                delete_confirm_btn_bg: 'var(--gem-sys-color--error-container)',
                delete_confirm_btn_hover_text: 'var(--gem-sys-color--on-error-container)',
                delete_confirm_btn_hover_bg: 'var(--gem-sys-color--error-container)',
                fieldset_border: 'var(--gem-sys-color--outline)',
                legend_text: 'var(--gem-sys-color--on-surface-variant)',
                label_text: 'var(--gem-sys-color--on-surface-variant)',
                input_bg: 'var(--gem-sys-color--surface-container-low)',
                input_text: 'var(--gem-sys-color--on-surface)',
                input_border: 'var(--gem-sys-color--outline)',
                slider_display_text: 'var(--gem-sys-color--on-surface-variant)',
                popup_bg: 'var(--gem-sys-color--surface-container-highest)',
                popup_border: 'var(--gem-sys-color--outline)',
                dnd_indicator_color: 'var(--gem-sys-color--primary)',
                upIconDef: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' },
                    children: [{ tag: 'path', props: { d: 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z' } }],
                },
                downIconDef: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' },
                    children: [{ tag: 'path', props: { d: 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z' } }],
                },
                deleteIconDef: {
                    tag: 'svg',
                    props: { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' },
                    children: [{ tag: 'path', props: { d: 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' } }],
                },
            },
            TEXT_LIST: {
                bg: 'var(--gem-sys-color--surface-container-high)',
                text: 'var(--gem-sys-color--on-surface)',
                border: 'var(--gem-sys-color--outline)',
                shadow: '0 4px 12px rgba(0,0,0,0.25)',
                separator_bg: 'var(--gem-sys-color--outline-variant)',
                tab_bg: 'var(--gem-sys-color--surface-container)',
                tab_text: 'var(--gem-sys-color--on-surface-variant)',
                tab_border: 'var(--gem-sys-color--outline)',
                tab_hover_bg: 'var(--gem-sys-color--surface-container-higher)',
                tab_active_bg: 'var(--gem-sys-color--surface-container-higher)',
                tab_active_border: 'var(--gem-sys-color--primary)',
                tab_active_outline: 'var(--gem-sys-color--primary)',
                option_bg: 'var(--gem-sys-color--surface-container)',
                option_text: 'var(--gem-sys-color--on-surface-variant)',
                option_border: 'var(--gem-sys-color--outline)',
                option_hover_bg: 'var(--gem-sys-color--surface-container-higher)',
                option_hover_border: 'var(--gem-sys-color--outline)',
                option_hover_outline: 'var(--gem-sys-color--primary)',
            },
        },
    };

    const DEFAULT_CONFIG = {
        options: {
            insert_before_newline: false,
            insert_after_newline: false,
            insertion_position: 'cursor', // 'cursor', 'start', 'end'
            trigger_mode: 'hover', // 'hover', 'click'
            activeProfileName: 'Default',
        },
        developer: {
            logger_level: 'log', // 'error', 'warn', 'info', 'log', 'debug'
        },
        texts: {
            Default: {
                Test: [
                    '[TEST MESSAGE] You can ignore this message.',
                    'Tell me something interesting.',
                    'Based on all of our previous conversations, generate an image of me as you imagine. Make it super-realistic. Please feel free to fill in any missing information with your own imagination. Do not ask follow-up questions; generate the image immediately.',
                    'Based on all of our previous conversations, generate an image of my ideal partner (opposite sex) as you imagine. Make it super-realistic. Please feel free to fill in any missing information with your own imagination. Do not ask follow-up questions; generate the image immediately.',
                    'Based on all of our previous conversations, generate an image of a person who is the exact opposite of my ideal partner. Make it super-realistic. Please feel free to fill in any missing information with your own imagination. Do not ask follow-up questions; generate the image immediately.',
                ],
                Images: [
                    'For each generated image, include an "image number" (e.g., Image 1, Image 2, ...), a title, and an image description.\n\n',
                    'Refer to the body shape and illustration style in the attached images, and draw the same person. Pay special attention to maintaining character consistency.\n\n',
                    'Feel free to illustrate a scene from everyday life. You can choose the composition or situation. If you are depicting consecutive scenes (a story), make sure to keep everything consistent (e.g., do not change clothing for no reason).\n\n',
                ],
                Coding: [
                    '### Code Editing Rules (Apply to the entire chat)\nStrictly follow these rules for all code suggestions, changes, optimizations, and Canvas reflection:\n1. **Do not modify any part of the code that is not being edited.**\n   * This includes blank lines, comments, variable names, order, etc. **Strictly keep all unmodified parts as is.**\n2. **Always leave concise, meaningful comments.**\n   * Limit comments to content that aids understanding or future maintenance. Do not include formal or duplicate notes.\n3. **When proposing or changing code, clearly state the intent and scope.**\n   * Example: "Improve performance of this function," "Simplify this conditional branch," etc.\n4. **Apply the above rules even for Canvas reflection.**\n   * Do not reformat, remove, or reorder content on the GPT side.\n5. **Preserve the overall style of the code (indentation, newlines, etc.).**\n   * Only edited parts should stand out clearly as differences.\n\n',
                    'Optimize the following script according to modern design guidelines.\nWhile maintaining its purpose and function, improve the structure, readability, and extensibility.\nIf there are improvements, clearly indicate them in the code comments and compare Before→After.\n\n```\n```\n\n',
                ],
                Summary: [
                    'STEP 1: For this chat log, do not summarize, but clearly show the structure of the content. Please output in the following format:\n\n- 🔹 List of topics (each topic heading and its starting point)\n- 🧷 List of technical terms / keywords / commands / proper nouns\n- 📌 Key statements marking turning points in the discussion (quotes allowed)\n\n[NOTE]\nThe goal is not to summarize, but to "enumerate and organize the topics."\nGive priority to extracting important elements while maintaining context.\n',
                    'STEP 2: For this chat log, enumerate the content as it is, without summarizing or restructuring.\n\nSample output format:\n1. [Start] Consulted about PowerShell script character encoding error\n2. [Proposal] Suggested UTF-8 with BOM save\n3. [Clarification] Clarified misunderstanding about Shift-JIS (e.g., cp932)\n4. [Conclusion] Decided on UTF-8-only approach with PowerShell\n\n[NOTE]\nMaintain the original order of topics. The goal is not to summarize, but to list "what was discussed" and "what conclusions were drawn."',
                    "STEP 3: Provide a mid-level summary for each topic in this chat log.\nCompression ratio can be low. Do not omit topics, and keep granularity somewhat fine.\n\nSample output format:\n## Chat title (or date)\n\n### Topic 1: About XXXXX\n- Overview:\n- Main discussion points:\n- Tentative conclusion or direction:\n\n### Topic 2: About YYYYY\n- ...\n\n[NOTE]\nIt's okay to be verbose. Ensure important details are not omitted so that a human can organize them later.",
                    'STEP 4: For each topic in this chat log, add the following indicators:\n\n- [Importance]: High / Medium / Low\n- [Reference recommended]: Yes / No (Is it worth reusing/repurposing?)\n- [Reference keywords]: About 3 search keywords\n\nThe purpose is to provide criteria for organizing or deleting this record in the future.',
                ],
                Memory: [
                    '[Memory list output] Please display all currently stored model set context (memory list) for me.\nSeparate by category, output concisely and accurately.',
                    '[Add to memory] Please add the following content to the model set context:\n\n[Category] (e.g., PowerShell)\n[Content]\n- Always unify the log output folder for PowerShell scripts to a "logs" subfolder.\n- Internal comments in scripts should be written in Japanese.\n\nPlease consistently refer to this information as context and policy in future conversations.',
                    '[Edit memory] Please edit the following memory content:\n\n[Target category] PowerShell\n[Current text to be edited] The default encoding for PowerShell scripts is "UTF-8 with BOM."\n[New text] The default encoding for PowerShell scripts is "UTF-8 without BOM."\n\nBe sure to discard the old information and replace it with the new information.',
                    '[Delete memory] Please completely delete the following memory content:\n\n[Target category] Image generation (Haruna)\n[Text to be deleted]\n- Always include an image number and situation description (caption) when generating images.\n\nEnsure that this information is completely removed and will not affect future conversations.',
                    'Summarize everything you have learned about our conversation and commit it to the memory update.',
                ],
            },
        },
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
             * Finds the editor element and delegates the text insertion task to the EditorController.
             * @param {string} text The text to insert.
             * @param {object} options The insertion options.
             */
            insertText(text, options = {}) {
                const platform = this.getPlatformDetails();
                if (!platform) {
                    Logger.error('Platform details not found.');
                    return;
                }

                // Use INPUT_TARGET for text insertion logic
                const editor = document.querySelector(platform.selectors.INPUT_TARGET);
                if (!editor) {
                    Logger.error('Input element not found via selector:', platform.selectors.INPUT_TARGET);
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
                        const paddingLeft = platform.selectors.ANCHOR_PADDING_LEFT;
                        const insertMethod = platform.selectors.INSERT_METHOD;

                        if (!insertMethod) {
                            Logger.warn('INSERT_METHOD is not defined for this platform.');
                        }

                        // Check if padding update is needed
                        let shouldUpdatePadding = false;
                        if (paddingLeft) {
                            const currentPadding = anchor.style.paddingLeft;
                            shouldUpdatePadding = currentPadding !== paddingLeft;
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
                            shouldUpdatePadding,
                            paddingLeft,
                            insertMethod,
                        };
                    },
                    mutate: (measured) => {
                        // Write phase

                        if (!measured || !measured.anchor) {
                            insertButton.element.style.display = 'none';
                            return;
                        }

                        const { anchor, isGhost, existingBtn, shouldInject, shouldUpdatePadding, paddingLeft, insertMethod } = measured;

                        if (!anchor.isConnected) {
                            Logger.badge('UI RETRY', LOG_STYLES.YELLOW, 'debug', 'Anchor detached. Retrying reposition.');
                            EventBus.publish(EVENTS.UI_REPOSITION);
                            return;
                        }

                        // 1. Ghost Buster
                        if (isGhost && existingBtn) {
                            Logger.badge('GHOST BUSTER', LOG_STYLES.YELLOW, 'warn', 'Detected non-functional ghost button. Removing...');
                            existingBtn.remove();
                        }

                        // 2. Injection
                        if (shouldInject || isGhost) {
                            // Add marker class to apply flex/relative styles from SITE_STYLES.ANCHOR
                            anchor.classList.add(`${APPID}-anchor-styled`);

                            // Insert based on explicit method
                            if (insertMethod === 'append') {
                                anchor.appendChild(insertButton.element);
                            } else if (insertMethod === 'prepend') {
                                anchor.prepend(insertButton.element);
                            }
                            Logger.badge('UI INJECTION', LOG_STYLES.GREEN, 'debug', `Button injected into Anchor (${insertMethod}).`);
                        }

                        // 3. Update padding if configured
                        if (shouldUpdatePadding && paddingLeft) {
                            anchor.style.paddingLeft = paddingLeft;
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
             * @returns {Promise<() => void>}
             */
            async triggerInitialPlacement() {
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
                };
            },
        },

        StyleManager: {
            getInsertButtonConfig(platformId) {
                const platformStyles = SITE_STYLES[platformId];
                return {
                    ...platformStyles.INSERT_BUTTON,
                    anchorStyles: platformStyles.ANCHOR, // Include anchor styles for injection
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
            if (platformId === CONSTANTS.PLATFORM.GEMINI.ID && editor.childNodes.length === 1 && editor.firstChild.nodeName === 'P' && editor.firstChild.innerHTML === '<br>') {
                return '';
            }

            const lines = [];

            for (const p of editor.childNodes) {
                if (p.nodeName !== 'P') continue;

                const isStructuralEmptyLine = p.childNodes.length === 1 && p.firstChild.nodeName === 'BR';
                let isEmptyLine = false;

                if (isStructuralEmptyLine) {
                    if (platformId === CONSTANTS.PLATFORM.CHATGPT.ID) {
                        // For ChatGPT, the class must also match for it to be a true empty line paragraph.
                        isEmptyLine = p.firstChild.className === 'ProseMirror-trailingBreak';
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
            let lastNode = editor; // Fallback node

            const paragraphs = Array.from(editor.childNodes).filter((n) => n.nodeName === 'P');

            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                lastNode = p;
                const treeWalker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
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

    // =================================================================================
    // SECTION: Utility Functions
    // =================================================================================

    /**
     * Schedules a function to run when the browser is idle.
     * @param {(deadline: IdleDeadline) => void} callback The function to execute.
     * @param {number} [timeout] The maximum delay in milliseconds.
     */
    function runWhenIdle(callback, timeout = 2000) {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(callback, { timeout });
        } else {
            setTimeout(callback, CONSTANTS.TIMING.TIMEOUTS.IDLE_EXECUTION_FALLBACK);
        }
    }

    /**
     * @param {Function} func
     * @param {number} delay
     * @returns {((...args: any[]) => void) & { cancel: () => void }}
     */
    function debounce(func, delay) {
        let timeout;
        const debounced = function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // After the debounce delay, schedule the actual execution for when the browser is idle.
                runWhenIdle(() => func.apply(this, args));
            }, delay);
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
     * Proposes a unique name by appending a suffix if the base name already exists in a given set.
     * It checks for "Copy", "Copy 2", "Copy 3", etc., in a case-insensitive manner.
     * @param {string} baseName The initial name to check.
     * @param {Set<string> | Array<string>} existingNames A Set or Array containing existing names.
     * @returns {string} A unique name.
     */
    function proposeUniqueName(baseName, existingNames) {
        const existingNamesLower = new Set(Array.from(existingNames).map((name) => name.toLowerCase()));

        if (!existingNamesLower.has(baseName.trim().toLowerCase())) {
            return baseName;
        }

        let proposedName = `${baseName} Copy`;
        if (!existingNamesLower.has(proposedName.trim().toLowerCase())) {
            return proposedName;
        }

        let counter = 2;
        while (true) {
            proposedName = `${baseName} Copy ${counter}`;
            if (!existingNamesLower.has(proposedName.trim().toLowerCase())) {
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
                Logger.badge('LAYOUT ERROR', LOG_STYLES.RED, 'error', 'Error during measure phase:', e);
                reject(e);
                return;
            }

            // Phase 2: Schedule the DOM mutations to run in the next animation frame.
            requestAnimationFrame(() => {
                try {
                    mutate(measuredData);
                    resolve();
                } catch (e) {
                    Logger.badge('LAYOUT ERROR', LOG_STYLES.RED, 'error', 'Error during mutate phase:', e);
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

    /**
     * Waits for a specific HTMLElement to appear in the DOM using a high-performance, Sentinel-based approach.
     * It specifically checks for `instanceof HTMLElement` and will not resolve for other element types (e.g., SVGElement), even if they match the selector.
     * @param {string} selector The CSS selector for the element.
     * @param {object} [options]
     * @param {number} [options.timeout] The maximum time to wait in milliseconds.
     * @param {Document | HTMLElement} [options.context] The element to search within.
     * @param {Sentinel} [sentinelInstance] The Sentinel instance to use (defaults to global `sentinel`).
     * @returns {Promise<HTMLElement | null>} A promise that resolves with the HTMLElement or null if timed out.
     */
    function waitForElement(selector, { timeout = 10000, context = document } = {}, sentinelInstance = sentinel) {
        // First, check if the element already exists.
        const existingEl = context.querySelector(selector);
        if (existingEl instanceof HTMLElement) {
            return Promise.resolve(existingEl);
        }

        // If not, use Sentinel wrapped in a Promise.
        return new Promise((resolve) => {
            let timer = null;
            let sentinelCallback = null;

            const cleanup = () => {
                if (timer) clearTimeout(timer);
                if (sentinelCallback) sentinelInstance.off(selector, sentinelCallback);
            };

            timer = setTimeout(() => {
                cleanup();
                Logger.badge('WAIT TIMEOUT', LOG_STYLES.YELLOW, 'warn', `Timed out after ${timeout}ms waiting for element "${selector}"`);
                resolve(null);
            }, timeout);

            sentinelCallback = (element) => {
                // Ensure the found element is an HTMLElement and is within the specified context.
                if (element instanceof HTMLElement && context.contains(element)) {
                    cleanup();
                    resolve(element);
                }
            };

            sentinelInstance.on(selector, sentinelCallback);
        });
    }

    /**
     * @description A dispatch table object that maps UI schema types to their respective rendering functions.
     */
    const UI_SCHEMA_RENDERERS = {
        _renderContainer(def) {
            let className = def.className;
            if (!className) {
                const classMap = {
                    'container-row': `${APPID}-submenu-row`,
                    'container-stacked-row': `${APPID}-submenu-row-stacked`,
                };
                className = classMap[def.type] || '';
            }
            const element = h(`div`, { className });
            if (def.children) {
                element.appendChild(buildUIFromSchema(def.children));
            }
            return element;
        },
        fieldset(def) {
            const element = h(`fieldset.${APPID}-submenu-fieldset`, [h('legend', def.legend)]);
            if (def.children) {
                element.appendChild(buildUIFromSchema(def.children));
            }
            return element;
        },
        'submenu-separator': (def) => h(`div.${APPID}-submenu-separator`),
        select(def) {
            return h('select', { id: def.id, title: def.title });
        },
        slider(def) {
            return h(`div.${APPID}-slider-wrapper`, [
                h('input', {
                    type: 'range',
                    id: def.id,
                    min: def.min,
                    max: def.max,
                    step: def.step,
                    dataset: def.dataset,
                }),
                h(`span`, { id: def.displayId }),
            ]);
        },
        button(def) {
            return h(
                `button#${def.id}.${APPID}-modal-button`,
                {
                    style: { width: '100%' },
                    title: def.title,
                },
                def.text
            );
        },
        label: (def) => h('label', { htmlFor: def.for, title: def.title }, def.text),
        toggle(def) {
            return h(`label.${APPID}-toggle-switch`, { title: def.title }, [h('input', { type: 'checkbox', id: def.id }), h(`span.${APPID}-toggle-slider`)]);
        },
    };

    // Assign aliases for container types
    ['container', 'container-row', 'container-stacked-row'].forEach((type) => {
        UI_SCHEMA_RENDERERS[type] = UI_SCHEMA_RENDERERS._renderContainer;
    });

    /**
     * @description Recursively builds a DOM fragment from a declarative schema object.
     * @param {Array<object>} definitions - An array of objects, each defining a UI element.
     * @returns {DocumentFragment} A document fragment containing the constructed DOM elements.
     */
    function buildUIFromSchema(definitions) {
        const fragment = document.createDocumentFragment();
        if (!definitions) return fragment;

        for (const def of definitions) {
            const renderer = UI_SCHEMA_RENDERERS[def.type];
            if (renderer) {
                const element = renderer(def);
                if (element) {
                    fragment.appendChild(element);
                }
            } else if (typeof def === 'string') {
                fragment.appendChild(document.createTextNode(def));
            }
        }
        return fragment;
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
        return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    }

    /**
     * Sets a nested property on an object using a dot-notation path.
     * @param {object} obj The object to modify.
     * @param {string} path The dot-separated path to the property.
     * @param {any} value The value to set.
     */
    function setPropertyByPath(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!isObject(current[key])) {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }

    /**
     * @description A utility function to update the text display of a slider component.
     * @param {HTMLInputElement} slider The slider input element.
     * @param {HTMLElement} display The element where the slider's value is displayed.
     * @param {Record<string, string>} displayMap A map of slider values to display text.
     */
    function updateSliderDisplay(slider, display, displayMap) {
        if (!slider || !display || !displayMap) return;
        const value = slider.value;
        display.textContent = displayMap[value] || '';
        slider.dataset.value = value;
    }

    /**
     * @description A dispatch table defining how to get/set values for different form field types.
     */
    const FORM_FIELD_HANDLERS = {
        select: {
            getValue: (el) => el.value || null,
            setValue: (el, value) => {
                el.value = value ?? '';
            },
        },
        slider: {
            getValue: (slider) => {
                return CONSTANTS.SLIDER_MAPPINGS.VALUE_TO_CONFIG[slider.value] || 'cursor';
            },
            setValue: (slider, value, { componentInstance }) => {
                const val = value || 'cursor';
                slider.value = CONSTANTS.SLIDER_MAPPINGS.CONFIG_TO_VALUE[val] || '1';
                componentInstance._updateSliderAppearance(slider);
            },
        },
        toggle: {
            getValue: (el) => el.checked,
            setValue: (el, value) => {
                el.checked = !!value;
            },
        },
    };

    /**
     * Populates a form with data from a configuration object based on a UI schema.
     * @param {Array<object>} definitions The UI schema definitions.
     * @param {HTMLElement} rootElement The root element of the form to populate.
     * @param {object} config The configuration object containing the data.
     * @param {object} componentInstance The component instance, passed to the handler for context.
     */
    function populateFormFromSchema(definitions, rootElement, config, componentInstance) {
        for (const def of definitions) {
            const { configKey, id } = def;
            const handler = FORM_FIELD_HANDLERS[def.type];

            if (handler && configKey && id) {
                const element = rootElement.querySelector(`#${id}`);
                if (element) {
                    const value = getPropertyByPath(config, configKey);
                    handler.setValue(element, value, { componentInstance });
                }
            }
            if (def.children) {
                populateFormFromSchema(def.children, rootElement, config, componentInstance);
            }
        }
    }

    /**
     * Collects data from a form into a configuration object based on a UI schema.
     * @param {Array<object>} definitions The UI schema definitions.
     * @param {HTMLElement} rootElement The root element of the form.
     * @param {object} configObject The configuration object to populate with data.
     */
    function collectDataFromSchema(definitions, rootElement, configObject) {
        for (const def of definitions) {
            const { configKey, id } = def;
            const handler = FORM_FIELD_HANDLERS[def.type];

            if (handler && configKey && id) {
                const element = rootElement.querySelector(`#${id}`);
                if (element) {
                    const value = handler.getValue(element);
                    setPropertyByPath(configObject, configKey, value);
                }
            }
            if (def.children) {
                collectDataFromSchema(def.children, rootElement, configObject);
            }
        }
    }

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
                // 2. Handle 'texts' separately: Overwrite if present in userConfig, otherwise keep default.
                if (isObject(userConfig.texts)) {
                    completeConfig.texts = deepClone(userConfig.texts);
                }

                // 3. Merge other top-level keys (options, developer, etc.)
                for (const key in userConfig) {
                    if (key !== 'texts' && Object.prototype.hasOwnProperty.call(userConfig, key)) {
                        if (isObject(userConfig[key]) && isObject(completeConfig[key])) {
                            // Recursively resolve if both are objects
                            resolveConfig(completeConfig[key], userConfig[key]);
                        } else if (typeof userConfig[key] !== 'undefined') {
                            // Otherwise, overwrite or set the value from userConfig
                            completeConfig[key] = userConfig[key];
                        }
                    }
                }
            }

            // 4. Sanitize specific structures (Deep validation)
            completeConfig.texts = this._sanitizeTexts(completeConfig.texts);

            // 5. Validate Options (Consistency check)
            this._validateOptions(completeConfig);

            return completeConfig;
        },

        /**
         * Sanitizes the nested texts object structure.
         * Validates: Profile -> Category -> Text Array -> Strings
         * @param {object} texts
         * @returns {object} Sanitized texts object
         */
        _sanitizeTexts(texts) {
            if (!isObject(texts)) return {};

            for (const profileName in texts) {
                const profile = texts[profileName];
                if (!isObject(profile)) {
                    Logger.warn(`Sanitizing invalid profile entry: "${profileName}" was not an object.`);
                    delete texts[profileName];
                    continue;
                }
                if (Object.keys(profile).length === 0) {
                    Logger.warn(`Profile "${profileName}" has no categories. Adding a default category.`);
                    profile['New Category'] = [];
                }
                for (const categoryName in profile) {
                    const category = profile[categoryName];
                    if (!Array.isArray(category)) {
                        Logger.warn(`Sanitizing invalid category entry: "${categoryName}" in profile "${profileName}" was not an array.`);
                        delete profile[categoryName];
                        continue;
                    }
                    // Ensure all items in the array are strings
                    profile[categoryName] = category.map((text, i) => {
                        if (typeof text !== 'string') {
                            Logger.warn(`Sanitizing invalid text entry: Item at index ${i} in category "${categoryName}" was not a string.`);
                            return String(text);
                        }
                        return text;
                    });
                }
            }

            // Ensure there's at least one profile.
            if (Object.keys(texts).length === 0) {
                Logger.warn('Configuration resulted in no profiles after sanitization. Restoring default texts structure.');
                return deepClone(DEFAULT_CONFIG.texts);
            }

            return texts;
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

            // Validate activeProfileName
            const profileKeys = Object.keys(config.texts);
            const activeProfileName = config.options.activeProfileName;

            if (!profileKeys.includes(activeProfileName)) {
                const fallback = profileKeys.length > 0 ? profileKeys[0] : null;
                Logger.log(`Active profile "${activeProfileName || 'undefined'}" not found. Falling back to "${fallback}".`);
                config.options.activeProfileName = fallback;
            }

            // Validate logger_level
            const validLevels = Object.keys(Logger.levels);
            if (!config.developer || !validLevels.includes(config.developer.logger_level)) {
                Logger.warn(`Invalid or missing logger_level. Resetting to default '${DEFAULT_CONFIG.developer.logger_level}'.`);
                if (!config.developer) config.developer = {};
                config.developer.logger_level = DEFAULT_CONFIG.developer.logger_level;
            }
        },
    };

    // =================================================================================
    // SECTION: Configuration Management (GM Storage)
    // =================================================================================

    /**
     * @abstract
     * @description Base class for managing script configurations via GM_setValue/GM_getValue.
     * Handles generic logic for loading, saving, backups, and validation.
     * This class is platform-agnostic and designed to be extended.
     */
    class ConfigManagerBase {
        /**
         * @param {object} params
         * @param {string} params.configKey The key for GM_setValue/GM_getValue.
         * @param {object} params.defaultConfig The default configuration object for the script.
         */
        constructor({ configKey, defaultConfig }) {
            if (!configKey || !defaultConfig) {
                throw new Error('configKey and defaultConfig must be provided.');
            }
            this.CONFIG_KEY = configKey;
            this.DEFAULT_CONFIG = defaultConfig;
            /** @type {object|null} */
            this.config = null;
        }

        /**
         * Loads the configuration from storage.
         * Assumes the configuration is stored as a JSON string.
         * @returns {Promise<void>}
         */
        async load() {
            const raw = await GM_getValue(this.CONFIG_KEY);
            let userConfig = null;
            if (raw) {
                try {
                    userConfig = JSON.parse(raw);
                } catch (e) {
                    Logger.error('Failed to parse configuration. Resetting to default settings.', e);
                    userConfig = null;
                }
            }

            const completeConfig = deepClone(this.DEFAULT_CONFIG);
            this.config = resolveConfig(completeConfig, userConfig || {});

            this._validateAndSanitizeOptions();
        }

        /**
         * Saves the configuration object to storage as a JSON string.
         * @param {object} obj The configuration object to save.
         * @returns {Promise<void>}
         */
        async save(obj) {
            this.config = obj;
            await GM_setValue(this.CONFIG_KEY, JSON.stringify(obj));
        }

        /**
         * @returns {object|null} The current configuration object.
         */
        get() {
            return this.config;
        }

        /**
         * @abstract
         * @protected
         * This method should be overridden by subclasses to perform script-specific
         * validation and sanitization of the `this.config.options` object.
         */
        _validateAndSanitizeOptions() {
            // Default implementation does nothing.
            // Subclasses should provide their own logic.
        }
    }

    class ConfigManager extends ConfigManagerBase {
        constructor() {
            super({
                configKey: CONSTANTS.CONFIG_KEY,
                defaultConfig: DEFAULT_CONFIG,
            });
            this.subscriptions = [];
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        destroy() {
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
        }

        /**
         * @override
         * Loads the configuration from storage, delegates processing to ConfigProcessor.
         */
        async load() {
            const raw = await GM_getValue(this.CONFIG_KEY);
            let userConfig = null;
            if (raw) {
                try {
                    userConfig = JSON.parse(raw);
                } catch (e) {
                    Logger.error('Failed to parse configuration. Using default settings.', e);
                    userConfig = null;
                }
            }
            this.config = ConfigProcessor.process(userConfig);
        }

        /**
         * @override
         * Processes via ConfigProcessor, checks size, and saves to storage.
         * @param {object} obj The configuration object to save.
         */
        async save(obj) {
            const completeConfig = ConfigProcessor.process(obj);
            const jsonString = JSON.stringify(completeConfig);
            const configSize = new Blob([jsonString]).size;

            if (configSize > CONSTANTS.CONFIG_SIZE_LIMIT_BYTES) {
                const sizeInMB = (configSize / 1024 / 1024).toFixed(2);
                const limitInMB = (CONSTANTS.CONFIG_SIZE_LIMIT_BYTES / 1024 / 1024).toFixed(1);
                const errorMsg = `Configuration size (${sizeInMB} MB) exceeds the ${limitInMB} MB limit.\nChanges are not saved.`;

                EventBus.publish(EVENTS.CONFIG_SIZE_EXCEEDED, { message: errorMsg });
                throw new Error(errorMsg);
            }

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
                Logger.error(`Failed to parse raw value. Error: ${e.message}`);
                return null;
            }
        }

        /**
         * @override
         * @protected
         */
        _validateAndSanitizeOptions() {
            // Handled by ConfigProcessor
        }
    }

    // =================================================================================
    // SECTION: UI Elements - Components and Manager
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

    /**
     * @class CustomModal
     * @description A reusable, promise-based modal component. It provides a flexible
     * structure with header, content, and footer sections, and manages its own
     * lifecycle and styles.
     */
    class CustomModal {
        /**
         * @param {object} [options]
         * @param {string} [options.title=''] - The title displayed in the modal header.
         * @param {string} [options.width='500px'] - The width of the modal.
         * @param {string} [options.cssPrefix='cm'] - A prefix for all CSS classes.
         * @param {boolean} [options.closeOnBackdropClick=true] - Whether to close the modal when clicking the backdrop.
         * @param {Array<object>} [options.buttons=[]] - An array of button definitions for the footer.
         * @param {function(): void} [options.onDestroy] - A callback function executed when the modal is destroyed.
         * @param {object} [options.styles] - Optional object containing style definitions (bg, text, border, etc.).
         * @param {{text: string, id: string, className: string, onClick: function(modalInstance, event): void}} options.buttons[]
         */
        constructor(options = {}) {
            this.options = {
                title: '',
                width: '500px',
                cssPrefix: 'cm',
                closeOnBackdropClick: true,
                buttons: [],
                onDestroy: null,
                styles: null,
                ...options,
            };
            this.element = null;
            this.dom = {}; // To hold references to internal elements like header, content, footer
            this._injectStyles();
            this._createModalElement();
        }

        _injectStyles() {
            const styleId = this.options.cssPrefix + '-styles';
            if (document.getElementById(styleId)) return;

            const p = this.options.cssPrefix;
            const style = h('style', { id: styleId });
            style.textContent = `
                dialog.${p}-dialog {
                    padding: 0;
                    border: none;
                    background: transparent;
                    max-width: 100vw;
                    max-height: 100vh;
                    overflow: visible;
                }
                dialog.${p}-dialog::backdrop {
                    background: rgb(0 0 0 / 0.5);
                    pointer-events: auto;
                }
                .${p}-box {
                    display: flex;
                    flex-direction: column;
                    background: var(--${p}-bg, #fff);
                    color: var(--${p}-text, #000);
                    border: 1px solid var(--${p}-border-color, #888);
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
                }
                .${p}-header, .${p}-footer {
                    flex-shrink: 0;
                    padding: 12px 16px;
                }
                .${p}-header {
                    font-size: 1.1em;
                    font-weight: 600;
                    border-bottom: 1px solid var(--${p}-border-color, #888);
                }
                .${p}-content {
                    flex-grow: 1;
                    padding: 16px;
                    overflow-y: auto;
                }
                .${p}-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    border-top: 1px solid var(--${p}-border-color, #888);
                }
                .${p}-footer-message {
                    flex-grow: 1;
                    font-size: 0.9em;
                }
                .${p}-button-group {
                    display: flex;
                    gap: 8px;
                }
                .${p}-button {
                    background: var(--${p}-btn-bg, #efefef);
                    color: var(--${p}-btn-text, #000);
                    border: 1px solid var(--${p}-btn-border-color, #ccc);
                    border-radius: 5px;
                    padding: 5px 16px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.12s;
                }
                .${p}-button:hover {
                    background: var(--${p}-btn-hover-bg, #e0e0e0);
                }
            `;
            document.head.appendChild(style);
        }

        _createModalElement() {
            const p = this.options.cssPrefix;
            // Define variables to hold references to key elements.
            let header, content, footer, modalBox, footerMessage;
            // Create footer buttons declaratively using map and h().
            const buttons = this.options.buttons.map((btnDef) => {
                const fullClassName = [`${p}-button`, btnDef.className, `${APPID}-modal-button`].filter(Boolean).join(' ');
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

            const buttonGroup = h(`div.${p}-button-group`, buttons);

            // Create the entire modal structure using h().
            this.element = h(
                `dialog.${p}-dialog`,
                (modalBox = h(`div.${p}-box`, { style: { width: this.options.width } }, [
                    (header = h(`div.${p}-header`, this.options.title)),
                    (content = h(`div.${p}-content`)),
                    (footer = h(`div.${p}-footer`, [(footerMessage = h(`div.${p}-footer-message`)), buttonGroup])),
                ]))
            );

            // Apply theme styles if provided
            const s = this.options.styles;
            if (s) {
                modalBox.style.setProperty(`--${p}-bg`, s.bg);
                modalBox.style.setProperty(`--${p}-text`, s.text);
                modalBox.style.setProperty(`--${p}-border-color`, s.border);

                modalBox.style.setProperty(`--${p}-btn-bg`, s.btn_bg);
                modalBox.style.setProperty(`--${p}-btn-text`, s.btn_text);
                modalBox.style.setProperty(`--${p}-btn-border-color`, s.btn_border);
                modalBox.style.setProperty(`--${p}-btn-hover-bg`, s.btn_hover_bg);
            }

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
            this.dom = { header, content, footer, modalBox, footerMessage };
            document.body.appendChild(this.element);
        }

        show(anchorElement = null) {
            if (this.element && typeof this.element.showModal === 'function') {
                this.element.showModal();
                // Positioning logic
                if (anchorElement && typeof anchorElement.getBoundingClientRect === 'function') {
                    // ANCHORED POSITIONING
                    const modalBox = this.dom.modalBox;
                    const btnRect = anchorElement.getBoundingClientRect();
                    const margin = 8;
                    const modalWidth = modalBox.offsetWidth || parseInt(this.options.width, 10);
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
            if (this.element && this.element.open) {
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
            this.dom.header.textContent = '';
            this.dom.header.appendChild(element);
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
            this.subscriptions = [];
            this.debouncedSave = debounce(this._handleDebouncedSave.bind(this), 300);
            this._handleDocumentClick = this._handleDocumentClick.bind(this);
            this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        init() {
            this._subscribe(EVENTS.CONFIG_UPDATED, this._handleConfigUpdate);
        }

        destroy() {
            this.hide();
            super.destroy(); // Call UIComponentBase's destroy
            this.debouncedSave.cancel();
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
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
                Logger.error('SettingsPanel save failed:', e);
            }
        }

        /**
         * @private
         * Handles the CONFIG_UPDATED event to refresh the form if the panel is open.
         * @param {object} newConfig The updated configuration object from the event payload.
         */
        async _handleConfigUpdate(newConfig) {
            if (this.isOpen()) {
                Logger.log('Settings panel is open, refreshing form due to config update.');
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
        populateForm() {
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
        _getPanelSchema() {
            return [
                {
                    type: 'fieldset',
                    legend: 'Profile',
                    children: [
                        {
                            type: 'select',
                            id: `${APPID}-profile-select`,
                            // configKey is handled manually in populate/collect methods for this element
                            title: 'Select the active profile.',
                        },
                    ],
                },
                {
                    type: 'container',
                    className: `${APPID}-submenu-top-row`,
                    children: [
                        {
                            type: 'fieldset',
                            legend: 'Texts',
                            children: [
                                {
                                    type: 'button',
                                    id: `${APPID}-submenu-edit-texts-btn`,
                                    text: 'Edit Texts...',
                                    title: 'Open the text editor.',
                                },
                            ],
                        },
                        {
                            type: 'fieldset',
                            legend: 'JSON',
                            children: [
                                {
                                    type: 'button',
                                    id: `${APPID}-submenu-json-btn`,
                                    text: 'JSON...',
                                    title: 'Opens the advanced settings modal to directly edit, import, or export the entire configuration in JSON format.',
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'fieldset',
                    legend: 'Options',
                    children: [
                        {
                            type: 'container-row',
                            children: [
                                {
                                    type: 'label',
                                    for: `${APPID}-opt-trigger-mode`,
                                    text: 'Trigger Mode',
                                    title: 'Choose how to open the text list.',
                                },
                                {
                                    type: 'select',
                                    id: `${APPID}-opt-trigger-mode`,
                                    configKey: 'options.trigger_mode',
                                    title: 'Choose how to open the text list. "Hover" opens on mouse over, "Click" opens on click (preventing accidental opens).',
                                },
                            ],
                        },
                        { type: 'submenu-separator' },
                        {
                            type: 'container-row',
                            children: [
                                {
                                    type: 'label',
                                    for: `${APPID}-opt-insert-before-newline`,
                                    text: 'Insert newline before text',
                                    title: 'Automatically add a newline before the pasted text.',
                                },
                                {
                                    type: 'toggle',
                                    id: `${APPID}-opt-insert-before-newline`,
                                    configKey: 'options.insert_before_newline',
                                    title: 'Adds a newline character before the inserted text.',
                                },
                            ],
                        },
                        {
                            type: 'container-row',
                            children: [
                                {
                                    type: 'label',
                                    for: `${APPID}-opt-insert-after-newline`,
                                    text: 'Insert newline after text',
                                    title: 'Automatically add a newline after the pasted text.',
                                },
                                {
                                    type: 'toggle',
                                    id: `${APPID}-opt-insert-after-newline`,
                                    configKey: 'options.insert_after_newline',
                                    title: 'Adds a newline character after the inserted text.',
                                },
                            ],
                        },
                        { type: 'submenu-separator' },
                        {
                            type: 'container-stacked-row',
                            children: [
                                {
                                    type: 'label',
                                    for: `${APPID}-insertion-pos-slider`,
                                    title: 'Determines where the text is inserted in the input field.',
                                    text: 'Insertion position',
                                },
                                {
                                    type: 'slider',
                                    id: `${APPID}-insertion-pos-slider`,
                                    configKey: 'options.insertion_position',
                                    min: '0',
                                    max: '2',
                                    step: '1',
                                    displayId: `${APPID}-slider-value-display`,
                                },
                            ],
                        },
                        {
                            type: 'container',
                            className: `${APPID}-settings-note`,
                            children: ['Note: Option behavior may depend on the input field’s state (focus and existing content). For consistent results, click an insert button while the input field is focused.'],
                        },
                    ],
                },
            ];
        }

        _createPanelContent() {
            const schema = this._getPanelSchema();
            return buildUIFromSchema(schema);
        }

        /**
         * Populates the settings form with configuration data.
         * Uses the provided config object if available, otherwise fetches the current config.
         * @param {object} [config] - Optional. The configuration object to use for population.
         */
        async populateForm(config) {
            // Use the provided config if available, otherwise fetch the current one
            const currentConfig = config || (await this.callbacks.getCurrentConfig());
            if (!currentConfig || !currentConfig.options) return;

            // --- Manually handle dynamic select options (Profile) ---
            const profileSelect = this.element.querySelector(`#${APPID}-profile-select`);
            profileSelect.textContent = ''; // Clear existing options
            const profileNames = Object.keys(currentConfig.texts);
            profileNames.forEach((name) => {
                const option = h('option', { value: name }, name);
                profileSelect.appendChild(option);
            });
            // Ensure the selected value exists, fallback if necessary
            const activeProfileName = currentConfig.options.activeProfileName;
            if (profileNames.includes(activeProfileName)) {
                profileSelect.value = activeProfileName;
            } else if (profileNames.length > 0) {
                profileSelect.value = profileNames[0];
                Logger.warn(`Active profile "${activeProfileName}" not found, falling back to "${profileNames[0]}".`);
            } else {
                profileSelect.value = ''; // No profiles available
            }

            // --- Manually handle dynamic select options (Trigger Mode) ---
            const triggerSelect = this.element.querySelector(`#${APPID}-opt-trigger-mode`);
            if (triggerSelect) {
                triggerSelect.textContent = '';
                const triggerOptions = [
                    { value: 'hover', text: 'Hover' },
                    { value: 'click', text: 'Click' },
                ];
                triggerOptions.forEach((opt) => {
                    triggerSelect.appendChild(h('option', { value: opt.value }, opt.text));
                });
            }

            // --- End manual handling ---

            const schema = this._getPanelSchema();
            // Pass the determined config to the schema populator
            populateFormFromSchema(schema, this.element, currentConfig, this);
        }

        async _collectDataFromForm() {
            const currentConfig = await this.callbacks.getCurrentConfig();
            const newConfig = deepClone(currentConfig);
            if (!newConfig.options) newConfig.options = {};

            // --- Manually handle dynamic select options ---
            const profileSelect = this.element.querySelector(`#${APPID}-profile-select`);
            newConfig.options.activeProfileName = profileSelect.value;
            // --- End manual handling ---

            const schema = this._getPanelSchema();
            collectDataFromSchema(schema, this.element, newConfig);

            return newConfig;
        }

        _setupEventListeners() {
            this.element.querySelector(`#${APPID}-submenu-edit-texts-btn`).addEventListener('click', () => {
                this.callbacks.onShowTextEditorModal?.();
                this.hide();
            });
            this.element.querySelector(`#${APPID}-submenu-json-btn`).addEventListener('click', () => {
                this.callbacks.onShowJsonModal?.();
                this.hide();
            });
            this.element.querySelector(`#${APPID}-profile-select`).addEventListener('change', this.debouncedSave);

            this.element.querySelector(`#${APPID}-opt-trigger-mode`).addEventListener('change', this.debouncedSave);

            this.element.querySelector(`#${APPID}-opt-insert-before-newline`).addEventListener('change', this.debouncedSave);
            this.element.querySelector(`#${APPID}-opt-insert-after-newline`).addEventListener('change', this.debouncedSave);

            const slider = this.element.querySelector(`#${APPID}-insertion-pos-slider`);
            slider.addEventListener('input', () => this._updateSliderAppearance(slider));
            slider.addEventListener('change', this.debouncedSave);
        }

        _updateSliderAppearance(slider) {
            const display = this.element.querySelector(`#${APPID}-slider-value-display`);
            updateSliderDisplay(slider, display, CONSTANTS.SLIDER_MAPPINGS.VALUE_TO_DISPLAY);
        }

        _injectStyles() {
            const styleId = `${APPID}-ui-styles`;
            if (document.getElementById(styleId)) return;

            const styles = this.callbacks.siteStyles;
            const style = h('style', {
                id: styleId,
                textContent: `
                #${APPID}-settings-panel {
                    position: fixed;
                    width: 340px;
                    background: ${styles.bg};
                    color: ${styles.text_primary};
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 20px 0 rgb(0 0 0 / 15%);
                    padding: 12px;
                    z-index: ${CONSTANTS.Z_INDICES.SETTINGS_PANEL};
                    border: 1px solid ${styles.border_medium};
                    font-size: 0.9em;
                }
                .${APPID}-submenu-top-row {
                    display: flex; gap: 12px;
                }
                .${APPID}-submenu-top-row .${APPID}-submenu-fieldset {
                    flex: 1 1 0px;
                }
                .${APPID}-submenu-fieldset {
                    border: 1px solid ${styles.border_default};
                    border-radius: 4px;
                    padding: 8px 12px 12px;
                    margin: 0 0 12px 0;
                    min-width: 0;
                }
                .${APPID}-submenu-fieldset legend {
                    padding: 0 4px;
                    font-weight: 500;
                    color: ${styles.text_secondary};
                }
                .${APPID}-submenu-fieldset select {
                    width: 100%;
                    box-sizing: border-box;
                    background: ${styles.input_bg};
                    border: 1px solid ${styles.input_border};
                    color: ${styles.input_text};
                    border-radius: 4px;
                    padding: 4px 6px;
                }
                .${APPID}-submenu-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    margin-top: 8px;
                }
                .${APPID}-submenu-row label {
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .${APPID}-submenu-row select {
                    width: 60%;
                }
                .${APPID}-submenu-row-stacked {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 4px;
                    margin-top: 8px;
                }
                .${APPID}-submenu-separator {
                    border-top: 1px solid ${styles.border_light};
                    margin: 12px 0;
                }
                .${APPID}-settings-note {
                    font-size: 0.85em;
                    color: ${styles.text_secondary};
                    text-align: left;
                    margin-top: 8px;
                    padding: 0 4px;
                }
                .${APPID}-toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 22px;
                    flex-shrink: 0;
                }
                .${APPID}-toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .${APPID}-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: ${styles.toggle_bg_off};
                    transition: .3s;
                    border-radius: 22px;
                }
                .${APPID}-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 3px;
                    bottom: 3px;
                    background-color: ${styles.toggle_knob};
                    transition: .3s;
                    border-radius: 50%;
                }
                .${APPID}-toggle-switch input:checked + .${APPID}-toggle-slider {
                    background-color: ${styles.toggle_bg_on};
                }
                .${APPID}-toggle-switch input:checked + .${APPID}-toggle-slider:before {
                    transform: translateX(18px);
                }
                .${APPID}-slider-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 4px;
                }
                #${APPID}-insertion-pos-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    flex-grow: 1;
                    height: 8px;
                    border-radius: 5px;
                    outline: none;
                    background: linear-gradient(to right, ${styles.input_bg} 0%, ${styles.input_bg} 100%);
                }
                #${APPID}-insertion-pos-slider[data-value="0"] {
                    background: linear-gradient(to right, ${styles.accent_color} 0%, ${styles.accent_color} 33.3%, ${styles.input_bg} 33.3%, ${styles.input_bg} 100%);
                }
                #${APPID}-insertion-pos-slider[data-value="1"] {
                    background: linear-gradient(to right, ${styles.input_bg} 0%, ${styles.input_bg} 33.3%, ${styles.accent_color} 33.3%, ${styles.accent_color} 66.6%, ${styles.input_bg} 66.6%, ${styles.input_bg} 100%);
                }
                #${APPID}-insertion-pos-slider[data-value="2"] {
                    background: linear-gradient(to right, ${styles.input_bg} 0%, ${styles.input_bg} 66.6%, ${styles.accent_color} 66.6%, ${styles.accent_color} 100%);
                }
                #${APPID}-insertion-pos-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: ${styles.accent_color};
                    cursor: pointer;
                    border-radius: 50%;
                    margin-top: -5px;
                }
                #${APPID}-insertion-pos-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: ${styles.accent_color};
                    cursor: pointer;
                    border-radius: 50%;
                    border: none;
                }
                #${APPID}-slider-value-display {
                    font-weight: 500;
                    min-width: 50px;
                    text-align: right;
                    color: ${styles.text_secondary};
                }
            `,
            });
            document.head.appendChild(style);
        }
    }

    /**
     * Manages the Text Settings modal by leveraging the CustomModal component.
     */
    class TextEditorModalComponent extends UIComponentBase {
        constructor(callbacks) {
            super(callbacks);
            this.subscriptions = [];
            this.activeProfileKey = null;
            this.activeCategoryKey = null;
            this.pendingDeletion = null;
            this.modal = null;
            this.draggedIndex = null;
            this.renameState = {
                type: null,
                isActive: false,
            };
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        destroy() {
            this.modal?.destroy();
            super.destroy();
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
        }

        render() {
            this._injectStyles();
        }

        async open(anchorElement) {
            // Reset all local UI states every time the modal is opened.
            // This is the simplest and most robust way to ensure a clean state.
            this.renameState = { type: null, isActive: false };
            this.pendingDeletion = null;

            if (this.modal) return;

            this.callbacks.onModalOpenStateChange?.(true);
            this.modal = new CustomModal({
                title: `${APPNAME} - Settings`,
                width: '880px',
                cssPrefix: `${APPID}-editor-modal-shell`,
                closeOnBackdropClick: false,
                styles: this.callbacks.siteStyles, // Use injected styles
                buttons: [
                    { text: 'Cancel', id: `${APPID}-editor-modal-cancel-btn`, className: `${APPID}-modal-button`, title: 'Discard changes and close the modal.', onClick: () => this.close() },
                    { text: 'Apply', id: `${APPID}-editor-modal-apply-btn`, className: `${APPID}-modal-button`, title: 'Save changes and keep the modal open.', onClick: () => this._handleSaveAction(false) },
                    { text: 'Save', id: `${APPID}-editor-modal-save-btn`, className: `${APPID}-modal-button -btn-primary`, title: 'Save changes and close the modal.', onClick: () => this._handleSaveAction(true) },
                ],
                onDestroy: () => {
                    this.callbacks.onModalOpenStateChange?.(false);
                    this.modal = null;
                },
            });

            const headerControls = this._createHeaderControls();
            const mainContent = this._createMainContent();

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

            this.modal.dom.header.appendChild(headerControls);
            this.modal.setContent(mainContent);

            this._setupEventListeners();

            const config = await this.callbacks.getCurrentConfig();
            if (config) {
                this.activeProfileKey = config.options.activeProfileName || Object.keys(config.texts)[0];
                const activeProfile = config.texts[this.activeProfileKey] || {};
                this.activeCategoryKey = Object.keys(activeProfile)[0] || null;
                await this._refreshModalState();
            }

            this.modal.show(anchorElement);

            // Re-calculate textarea heights after the modal is visible.
            // Calculations dependent on layout (scrollHeight) fail when the element is hidden.
            requestAnimationFrame(() => {
                const scrollableArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
                if (scrollableArea) {
                    scrollableArea.scrollTop = 0;
                    // Force recalculation of height for all textareas now that they are visible
                    scrollableArea.querySelectorAll('textarea').forEach((ta) => this._autoResizeTextarea(ta));
                }
            });
        }

        close() {
            this.modal?.close();
        }

        async _refreshModalState() {
            if (!this.modal) return;
            const config = await this.callbacks.getCurrentConfig();
            if (!config) return;

            const profileKeys = Object.keys(config.texts);
            const activeProfile = config.texts[this.activeProfileKey] || {};
            const categoryKeys = Object.keys(activeProfile);
            const isAnyRenaming = this.renameState.isActive;
            const isAnyDeleting = !!this.pendingDeletion;

            const profileRow = this.modal.element.querySelector(`.${APPID}-header-row[data-type="profile"]`);
            const categoryRow = this.modal.element.querySelector(`.${APPID}-header-row[data-type="category"]`);
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);

            const isProfileDisabled = (isAnyRenaming && this.renameState.type !== 'profile') || (isAnyDeleting && this.pendingDeletion?.type !== 'profile');
            const isCategoryDisabled = (isAnyRenaming && this.renameState.type !== 'category') || (isAnyDeleting && this.pendingDeletion?.type !== 'category');
            profileRow.classList.toggle('is-disabled', isProfileDisabled);
            categoryRow.classList.toggle('is-disabled', isCategoryDisabled);

            const updateRow = (row, type, keys, activeKey) => {
                const isRenamingThis = isAnyRenaming && this.renameState.type === type;
                const isDeletingThis = this.pendingDeletion?.type === type;

                const select = row.querySelector('select');
                const renameInput = row.querySelector('input[type="text"]');
                const mainActions = row.querySelector(`.${APPID}-main-actions`);
                const renameActions = row.querySelector(`.${APPID}-rename-actions`);
                const deleteConfirmGroup = row.querySelector(`.${APPID}-delete-confirm-group`);

                const showMainActions = !isRenamingThis && !isDeletingThis;
                select.style.display = isRenamingThis ? 'none' : 'block';
                renameInput.style.display = isRenamingThis ? 'block' : 'none';
                mainActions.style.visibility = showMainActions ? 'visible' : 'hidden';
                renameActions.style.display = isRenamingThis ? 'flex' : 'none';
                deleteConfirmGroup.style.display = isDeletingThis ? 'flex' : 'none';

                if (!isRenamingThis) {
                    const scroll = select.scrollTop;
                    select.textContent = '';
                    keys.forEach((key) => select.appendChild(h('option', { value: key }, key)));
                    select.value = activeKey;
                    select.scrollTop = scroll;
                } else {
                    renameInput.value = activeKey;
                }

                const isAnyActionInProgress = isAnyRenaming || isAnyDeleting;
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

            updateRow(profileRow, 'profile', profileKeys, this.activeProfileKey);
            updateRow(categoryRow, 'category', categoryKeys, this.activeCategoryKey);

            const isAnyActionInProgress = isAnyRenaming || isAnyDeleting;
            scrollArea.classList.toggle('is-disabled', isAnyActionInProgress);
            this.modal.element.querySelector(`#${APPID}-text-new-btn`).disabled = isAnyActionInProgress;
            this.modal.element.querySelector(`#${APPID}-editor-modal-apply-btn`).disabled = isAnyActionInProgress;
            this.modal.element.querySelector(`#${APPID}-editor-modal-save-btn`).disabled = isAnyActionInProgress;
            this.modal.element.querySelector(`#${APPID}-editor-modal-cancel-btn`).disabled = isAnyActionInProgress;

            if (!isAnyActionInProgress) {
                const texts = activeProfile[this.activeCategoryKey] || [];
                this._renderTextList(texts);
            }
        }

        _createHeaderControls() {
            const styles = this.callbacks.siteStyles;

            const createControlRow = (type, label) => {
                return h(`div.${APPID}-header-row`, { 'data-type': type }, [
                    // Container 1: Label
                    h('label', { htmlFor: `${APPID}-${type}-select` }, label),

                    // Container 2: Select / Input
                    h(`div.${APPID}-rename-area`, [h(`select#${APPID}-${type}-select`), h('input', { type: 'text', id: `${APPID}-${type}-rename-input`, style: { display: 'none' } })]),

                    // Container 3: Action Buttons
                    h(`div.${APPID}-action-area`, [
                        h(`div.${APPID}-main-actions`, [
                            h(`button#${APPID}-${type}-rename-btn.${APPID}-modal-button`, 'Rename'),
                            h(`button#${APPID}-${type}-up-btn.${APPID}-modal-button.${APPID}-move-btn`, [createIconFromDef(styles.upIconDef)]),
                            h(`button#${APPID}-${type}-down-btn.${APPID}-modal-button.${APPID}-move-btn`, [createIconFromDef(styles.downIconDef)]),
                            h(`button#${APPID}-${type}-new-btn.${APPID}-modal-button`, 'New'),
                            h(`button#${APPID}-${type}-copy-btn.${APPID}-modal-button`, 'Copy'),
                            h(`button#${APPID}-${type}-delete-btn.${APPID}-modal-button`, 'Delete'),
                        ]),
                        h(`div.${APPID}-rename-actions`, { style: { display: 'none' } }, [
                            h(`button#${APPID}-${type}-rename-ok-btn.${APPID}-modal-button`, 'OK'),
                            h(`button#${APPID}-${type}-rename-cancel-btn.${APPID}-modal-button`, 'Cancel'),
                        ]),
                        h(`div.${APPID}-delete-confirm-group`, { style: { display: 'none' } }, [
                            h(`span.${APPID}-delete-confirm-label`, 'Are you sure?'),
                            h(`button#${APPID}-${type}-delete-confirm-btn.${APPID}-modal-button.${APPID}-delete-confirm-btn-yes`, 'Confirm'),
                            h(`button#${APPID}-${type}-delete-cancel-btn.${APPID}-modal-button`, 'Cancel'),
                        ]),
                    ]),
                ]);
            };

            return h(`div.${APPID}-editor-modal-header-controls`, [createControlRow('profile', 'Profile:'), createControlRow('category', 'Category:')]);
        }

        _createMainContent() {
            return h(`div.${APPID}-editor-modal-content`, [h(`div.${APPID}-editor-scrollable-area`), h(`button#${APPID}-text-new-btn.${APPID}-modal-button`, 'Add New Text')]);
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to enter delete confirmation mode for.
         */
        _enterDeleteConfirmationMode(itemType) {
            if (!this.modal || this.renameState.isActive) return;

            const keyToDelete = itemType === 'profile' ? this.activeProfileKey : this.activeCategoryKey;
            if (!keyToDelete) return;

            this.pendingDeletion = { key: keyToDelete, type: itemType };
            this._refreshModalState();
        }

        _exitDeleteConfirmationMode() {
            this.pendingDeletion = null;
            if (this.modal) {
                this._refreshModalState();
            }
        }

        _setupEventListeners() {
            if (!this.modal) return;
            const modalElement = this.modal.element;
            const scrollArea = modalElement.querySelector(`.${APPID}-editor-scrollable-area`);

            modalElement.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if (!target) return;

                const textItemControls = target.closest(`.${APPID}-text-item-controls`);
                if (textItemControls) {
                    const textItem = textItemControls.closest(`.${APPID}-text-item`);
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
            modalElement.addEventListener('change', async (e) => {
                if (e.target.matches(`#${APPID}-profile-select`)) {
                    this.activeProfileKey = e.target.value;
                    const config = await this.callbacks.getCurrentConfig();
                    const activeProfile = config.texts[this.activeProfileKey] || {};
                    this.activeCategoryKey = Object.keys(activeProfile)[0] || null;
                    await this._refreshModalState();
                } else if (e.target.matches(`#${APPID}-category-select`)) {
                    this.activeCategoryKey = e.target.value;
                    await this._refreshModalState();
                }
            });
            modalElement.addEventListener('input', (e) => {
                const target = e.target;
                if (target.matches('textarea')) {
                    target.classList.toggle('is-invalid', target.value.trim() === '');
                    const footerMessage = this.modal?.dom?.footerMessage;
                    if (footerMessage && footerMessage.textContent) {
                        footerMessage.textContent = '';
                    }
                    this._autoResizeTextarea(target);
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
            modalElement.addEventListener('dragstart', (e) => {
                const handle = e.target.closest(`.${APPID}-drag-handle`);
                if (handle) {
                    const target = handle.closest(`.${APPID}-text-item`);
                    if (target && scrollArea.contains(target)) {
                        this.draggedIndex = parseInt(target.dataset.index, 10);
                        setTimeout(() => target.classList.add('dragging'), 0);
                    }
                }
            });
            modalElement.addEventListener('dragend', () => {
                if (this.draggedIndex === null) return;
                const draggingElement = scrollArea.querySelector('.dragging');
                if (draggingElement) draggingElement.classList.remove('dragging');
                this.draggedIndex = null;
            });
            scrollArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = scrollArea.querySelector('.dragging');
                if (!draggingElement) return;

                scrollArea.querySelectorAll(`.${APPID}-text-item`).forEach((el) => {
                    el.classList.remove('drag-over-top', 'drag-over-bottom');
                });

                const target = e.target.closest(`.${APPID}-text-item`);
                if (target && target !== draggingElement) {
                    const box = target.getBoundingClientRect();
                    const isAfter = e.clientY > box.top + box.height / 2;
                    target.classList.toggle('drag-over-bottom', isAfter);
                    target.classList.toggle('drag-over-top', !isAfter);
                } else if (!target) {
                    const lastElement = scrollArea.querySelector(`.${APPID}-text-item:last-child:not(.dragging)`);
                    if (lastElement) {
                        lastElement.classList.add('drag-over-bottom');
                    }
                }
            });
            scrollArea.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedIndex === null) return;

                const draggingElement = scrollArea.querySelector('.dragging');
                if (!draggingElement) return;

                const dropTarget = scrollArea.querySelector('.drag-over-top, .drag-over-bottom');
                if (dropTarget) {
                    if (dropTarget.classList.contains('drag-over-bottom')) {
                        scrollArea.insertBefore(draggingElement, dropTarget.nextSibling);
                    } else {
                        scrollArea.insertBefore(draggingElement, dropTarget);
                    }
                }

                scrollArea.querySelectorAll(`.${APPID}-text-item`).forEach((el) => {
                    el.classList.remove('drag-over-top', 'drag-over-bottom');
                });
                this._updateTextItemsUI();
            });
        }

        async _exitRenameMode(refresh = false) {
            if (!this.renameState.isActive) return;

            const type = this.renameState.type;
            this.renameState = { type: null, isActive: false };

            // If the modal still exists, clear validation state
            if (this.modal) {
                const input = this.modal.element.querySelector(`#${APPID}-${type}-rename-input`);
                if (input) input.classList.remove('is-invalid');

                const footerMessage = this.modal.dom.footerMessage;
                if (footerMessage) footerMessage.textContent = '';

                // Refresh the UI if requested (e.g., by Cancel button)
                if (refresh) await this._refreshModalState();
            }
        }

        _getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll(`.${APPID}-text-item:not(.dragging)`)];
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

        _renderTextList(texts, indexToFocus = -1) {
            const styles = this.callbacks.siteStyles;
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
            scrollArea.textContent = '';

            texts.forEach((text, index) => {
                const textItem = h(
                    `div.${APPID}-text-item`,
                    {
                        'data-index': index,
                    },
                    [
                        h(`div.${APPID}-drag-handle`, { title: 'Drag to reorder', draggable: 'true' }, [
                            h('svg', { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' }, [
                                h('path', {
                                    d: 'M349.85-524.85q-14.52 0-24.68-10.16-10.17-10.17-10.17-24.69t10.17-24.68q10.16-10.17 24.68-10.17t24.69 10.17q10.16 10.16 10.16 24.68t-10.16 24.69q-10.17 10.16-24.69 10.16Zm260.3,0q-14.52 0-24.68-10.16-10.17-10.17-10.17-24.69t10.17-24.68q10.16-10.17 24.68-10.17t24.69 10.17q10.16 10.16 10.16 24.68t-10.16 24.69q-10.17 10.16-24.69 10.16Zm-260.3-170q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm260.3,0q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm-260.3,340q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm260.3,0q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Z',
                                }),
                            ]),
                        ]),
                        h(
                            'textarea',
                            {
                                'data-index': index,
                                rows: 3,
                                ref: (el) => {
                                    if (index === indexToFocus) {
                                        requestAnimationFrame(() => el.focus());
                                    }
                                },
                            },
                            text
                        ),
                        h(`div.${APPID}-text-item-controls`, [
                            h(`button.${APPID}-modal-button.${APPID}-move-btn.move-up-btn`, { title: 'Move up', disabled: index === 0 }, [createIconFromDef(styles.upIconDef)]),
                            h(`button.${APPID}-modal-button.${APPID}-move-btn.move-down-btn`, { title: 'Move down', disabled: index === texts.length - 1 }, [createIconFromDef(styles.downIconDef)]),
                            h(`button.${APPID}-modal-button.${APPID}-delete-btn.delete-btn`, { title: 'Delete' }, [createIconFromDef(styles.deleteIconDef)]),
                        ]),
                    ]
                );
                scrollArea.appendChild(textItem);
            });

            // Call auto-resize for all textareas after they have been added to the DOM.
            scrollArea.querySelectorAll('textarea').forEach((ta) => this._autoResizeTextarea(ta));
        }

        _collectAllDataFromForm() {
            if (!this.modal) return null;
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
            const textareas = scrollArea.querySelectorAll('textarea');
            const texts = Array.from(textareas).map((ta) => ta.value);

            return { texts, textareas };
        }

        _updateTextItemsUI() {
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
            const items = scrollArea.querySelectorAll(`.${APPID}-text-item`);

            items.forEach((item, index) => {
                item.dataset.index = index;
                const textarea = item.querySelector('textarea');
                if (textarea) textarea.dataset.index = index;

                const upBtn = item.querySelector('.move-up-btn');
                const downBtn = item.querySelector('.move-down-btn');
                if (upBtn) upBtn.disabled = index === 0;
                if (downBtn) downBtn.disabled = index === items.length - 1;
            });
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
            const styles = this.callbacks.siteStyles;
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
            const items = scrollArea.querySelectorAll(`.${APPID}-text-item`);
            const newIndex = items.length;
            const newItem = h(
                `div.${APPID}-text-item`,
                {
                    'data-index': newIndex,
                },
                [
                    h(`div.${APPID}-drag-handle`, { title: 'Drag to reorder', draggable: 'true' }, [
                        h('svg', { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 -960 960 960', width: '24px', fill: 'currentColor' }, [
                            h('path', {
                                d: 'M349.85-524.85q-14.52 0-24.68-10.16-10.17-10.17-10.17-24.69t10.17-24.68q10.16-10.17 24.68-10.17t24.69 10.17q10.16 10.16 10.16 24.68t-10.16 24.69q-10.17 10.16-24.69 10.16Zm260.3,0q-14.52 0-24.68-10.16-10.17-10.17-10.17-24.69t10.17-24.68q10.16-10.17 24.68-10.17t24.69 10.17q10.16 10.16 10.16 24.68t-10.16 24.69q-10.17 10.16-24.69 10.16Zm-260.3-170q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm260.3,0q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm-260.3,340q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Zm260.3,0q-14.52 0-24.68-10.17-10.17-10.16-10.17-24.68t10.17-24.69q10.16-10.16 24.68-10.16t24.69 10.16q10.16 10.17 10.16 24.69t-10.16 24.68q-10.17 10.17-24.69 10.17Z',
                            }),
                        ]),
                    ]),
                    h('textarea', {
                        'data-index': newIndex,
                        rows: 3,
                    }),
                    h(`div.${APPID}-text-item-controls`, [
                        h(`button.${APPID}-modal-button.${APPID}-move-btn.move-up-btn`, { title: 'Move up' }, [createIconFromDef(styles.upIconDef)]),
                        h(`button.${APPID}-modal-button.${APPID}-move-btn.move-down-btn`, { title: 'Move down' }, [createIconFromDef(styles.downIconDef)]),
                        h(`button.${APPID}-modal-button.${APPID}-delete-btn.delete-btn`, { title: 'Delete' }, [createIconFromDef(styles.deleteIconDef)]),
                    ]),
                ]
            );

            scrollArea.appendChild(newItem);
            this._updateTextItemsUI();

            const newTextarea = newItem.querySelector('textarea');
            if (newTextarea) {
                this._autoResizeTextarea(newTextarea);
                newTextarea.focus();
            }
        }

        _handleTextDelete(index) {
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
            const itemToDelete = scrollArea.querySelector(`.${APPID}-text-item[data-index="${index}"]`);
            if (itemToDelete) {
                itemToDelete.remove();
                this._updateTextItemsUI();
            }
        }

        _handleTextMove(index, direction) {
            const scrollArea = this.modal.element.querySelector(`.${APPID}-editor-scrollable-area`);
            const items = Array.from(scrollArea.querySelectorAll(`.${APPID}-text-item`));
            const newIndex = index + direction;

            if (newIndex < 0 || newIndex >= items.length) return;
            const currentItem = items[index];
            const targetItem = items[newIndex];

            if (direction === -1) {
                // Move up
                scrollArea.insertBefore(currentItem, targetItem);
            } else {
                // Move down
                scrollArea.insertBefore(currentItem, targetItem.nextSibling);
            }

            this._updateTextItemsUI();
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to create.
         */
        async _handleItemNew(itemType) {
            const config = await this.callbacks.getCurrentConfig();
            const newConfig = deepClone(config);

            if (itemType === 'profile') {
                const existingKeys = Object.keys(newConfig.texts);
                const newName = proposeUniqueName('New Profile', existingKeys);
                newConfig.texts[newName] = { 'New Category': [] };
                await this.callbacks.onSave(newConfig);

                this.activeProfileKey = newName;
                this.activeCategoryKey = 'New Category';
            } else {
                // category
                if (!this.activeProfileKey) return;
                const activeProfile = newConfig.texts[this.activeProfileKey] || {};
                const existingKeys = Object.keys(activeProfile);
                const newName = proposeUniqueName('New Category', existingKeys);
                newConfig.texts[this.activeProfileKey][newName] = [];
                await this.callbacks.onSave(newConfig);

                this.activeCategoryKey = newName;
            }

            await this._refreshModalState();
            this._enterRenameMode(itemType);
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to copy.
         */
        async _handleItemCopy(itemType) {
            const config = await this.callbacks.getCurrentConfig();
            const newConfig = deepClone(config);

            if (itemType === 'profile') {
                if (!this.activeProfileKey) return;
                const itemToCopy = deepClone(newConfig.texts[this.activeProfileKey]);
                const existingKeys = Object.keys(newConfig.texts);
                const newName = proposeUniqueName(`${this.activeProfileKey} Copy`, existingKeys);

                const keys = Object.keys(newConfig.texts);
                const insertIndex = keys.indexOf(this.activeProfileKey) + 1;
                const reorderedItems = {};
                keys.slice(0, insertIndex).forEach((key) => (reorderedItems[key] = newConfig.texts[key]));
                reorderedItems[newName] = itemToCopy;
                keys.slice(insertIndex).forEach((key) => (reorderedItems[key] = newConfig.texts[key]));
                newConfig.texts = reorderedItems;

                this.activeProfileKey = newName;
                this.activeCategoryKey = Object.keys(itemToCopy)[0] || null;
            } else {
                // category
                if (!this.activeProfileKey || !this.activeCategoryKey) return;
                const activeProfile = newConfig.texts[this.activeProfileKey];
                const itemToCopy = deepClone(activeProfile[this.activeCategoryKey]);
                const existingKeys = Object.keys(activeProfile);
                const newName = proposeUniqueName(`${this.activeCategoryKey} Copy`, existingKeys);

                const keys = Object.keys(activeProfile);
                const insertIndex = keys.indexOf(this.activeCategoryKey) + 1;
                const reorderedItems = {};
                keys.slice(0, insertIndex).forEach((key) => (reorderedItems[key] = activeProfile[key]));
                reorderedItems[newName] = itemToCopy;
                keys.slice(insertIndex).forEach((key) => (reorderedItems[key] = activeProfile[key]));
                newConfig.texts[this.activeProfileKey] = reorderedItems;

                this.activeCategoryKey = newName;
            }

            await this.callbacks.onSave(newConfig);
            await this._refreshModalState();
        }

        /**
         * @private
         */
        async _handleItemDelete() {
            const { key: keyToDelete, type: itemType } = this.pendingDeletion;
            if (!keyToDelete) {
                this._exitDeleteConfirmationMode();
                return;
            }

            const config = await this.callbacks.getCurrentConfig();
            const newConfig = deepClone(config);

            if (itemType === 'profile') {
                const keys = Object.keys(newConfig.texts);
                const currentIndex = keys.indexOf(keyToDelete);
                delete newConfig.texts[keyToDelete];

                // Determine the next profile to view
                const latestKeys = Object.keys(newConfig.texts);
                const nextIndex = Math.min(currentIndex, latestKeys.length - 1);
                const nextViewKey = latestKeys[nextIndex] || (latestKeys.length > 0 ? latestKeys[0] : null);

                // Update the active profile setting ONLY if the deleted profile was the active one.
                if (newConfig.options.activeProfileName === keyToDelete) {
                    newConfig.options.activeProfileName = nextViewKey;
                }

                // Always update the view to the next item
                this.activeProfileKey = nextViewKey;
                const activeProfile = newConfig.texts[this.activeProfileKey] || {};
                this.activeCategoryKey = Object.keys(activeProfile)[0] || null;
            } else {
                // category
                if (!this.activeProfileKey) return;
                const activeProfile = newConfig.texts[this.activeProfileKey];
                const keys = Object.keys(activeProfile);
                const currentIndex = keys.indexOf(keyToDelete);
                delete newConfig.texts[this.activeProfileKey][keyToDelete];

                const latestKeys = Object.keys(newConfig.texts[this.activeProfileKey]);
                // Select the next item, or the previous one if the deleted item was last.
                const nextIndex = Math.min(currentIndex, latestKeys.length - 1);
                this.activeCategoryKey = latestKeys[nextIndex] || (latestKeys.length > 0 ? latestKeys[0] : null);
            }

            await this.callbacks.onSave(newConfig);
            this._exitDeleteConfirmationMode();
            await this._refreshModalState();
        }

        /**
         * @private
         * @param {'profile' | 'category'} itemType The type of item to move.
         * @param {number} direction The direction to move (-1 for up, 1 for down).
         */
        async _handleItemMove(itemType, direction) {
            const config = await this.callbacks.getCurrentConfig();
            const newConfig = deepClone(config);
            let keys, dataContext, activeKey;

            if (itemType === 'profile') {
                if (!this.activeProfileKey) return;
                keys = Object.keys(newConfig.texts);
                dataContext = newConfig.texts;
                activeKey = this.activeProfileKey;
            } else {
                // category
                if (!this.activeProfileKey || !this.activeCategoryKey) return;
                dataContext = newConfig.texts[this.activeProfileKey];
                if (!dataContext) return;
                keys = Object.keys(dataContext);
                activeKey = this.activeCategoryKey;
            }

            const currentIndex = keys.indexOf(activeKey);
            const newIndex = currentIndex + direction;
            if (newIndex < 0 || newIndex >= keys.length) return;

            [keys[currentIndex], keys[newIndex]] = [keys[newIndex], keys[currentIndex]];
            const reorderedItems = {};
            keys.forEach((key) => {
                reorderedItems[key] = dataContext[key];
            });

            if (itemType === 'profile') {
                newConfig.texts = reorderedItems;
            } else {
                newConfig.texts[this.activeProfileKey] = reorderedItems;
            }

            await this.callbacks.onSave(newConfig);
            await this._refreshModalState();
        }

        async _handleSaveAction(shouldClose) {
            const footerMessage = this.modal?.dom?.footerMessage;
            if (footerMessage) {
                footerMessage.textContent = '';
                footerMessage.style.color = this.callbacks.siteStyles.error_text;
            }
            this.modal.element.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

            // Collect only text area data
            const formData = this._collectAllDataFromForm();
            let isFormValid = true;

            // --- Validation (only for text areas) ---
            formData.textareas.forEach((ta) => {
                if (ta.value.trim() === '') {
                    ta.classList.add('is-invalid');
                    isFormValid = false;
                }
            });
            if (!isFormValid) {
                if (footerMessage) footerMessage.textContent = 'Text fields cannot be empty.';
                return;
            }

            // --- Config Update (only for text areas) ---
            const { texts } = formData;
            const config = await this.callbacks.getCurrentConfig();
            const newConfig = deepClone(config);

            // Check if the active profile and category still exist
            if (newConfig.texts[this.activeProfileKey] && Object.prototype.hasOwnProperty.call(newConfig.texts[this.activeProfileKey], this.activeCategoryKey)) {
                newConfig.texts[this.activeProfileKey][this.activeCategoryKey] = texts;
            } else {
                // This case should ideally not happen in normal flow
                Logger.warn('Could not save texts because the active profile or category was not found.');
                if (footerMessage) footerMessage.textContent = 'Error: Active profile or category not found.';
                return;
            }

            // --- Final Save and UI Update ---
            try {
                await this.callbacks.onSave(newConfig);
                if (shouldClose) {
                    this.close();
                } else {
                    // Just stay on the current view
                    await this._refreshModalState();
                }
            } catch (e) {
                if (footerMessage) footerMessage.textContent = e.message;
            }
        }

        async _enterRenameMode(type) {
            if (this.renameState.isActive) return;

            this.renameState = {
                type: type,
                isActive: true,
            };

            await this._refreshModalState();

            // Focus and select text in the new input
            const input = this.modal.element.querySelector(`#${APPID}-${type}-rename-input`);
            if (input) {
                input.focus();
                input.select();
            }
        }

        async _handleRenameConfirm(type) {
            const footerMessage = this.modal?.dom?.footerMessage;
            const input = this.modal.element.querySelector(`#${APPID}-${type}-rename-input`);
            const newName = input.value.trim();
            const oldName = type === 'profile' ? this.activeProfileKey : this.activeCategoryKey;

            // --- Validation ---
            if (!newName) {
                if (footerMessage) {
                    footerMessage.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} name cannot be empty.`;
                    footerMessage.style.color = this.callbacks.siteStyles.error_text;
                }
                input.classList.add('is-invalid');
                return;
            }

            const config = await this.callbacks.getCurrentConfig();
            let existingKeys;
            if (type === 'profile') {
                existingKeys = Object.keys(config.texts);
            } else {
                existingKeys = Object.keys(config.texts[this.activeProfileKey] || {});
            }

            if (newName.toLowerCase() !== oldName.toLowerCase() && existingKeys.some((k) => k.toLowerCase() === newName.toLowerCase())) {
                if (footerMessage) {
                    footerMessage.textContent = `Name "${newName}" is already in use.`;
                    footerMessage.style.color = this.callbacks.siteStyles.error_text;
                }
                input.classList.add('is-invalid');
                return;
            }

            // --- Config Update ---
            const newConfig = deepClone(config);

            if (type === 'profile') {
                const reorderedProfiles = {};
                for (const key of Object.keys(newConfig.texts)) {
                    if (key === oldName) {
                        reorderedProfiles[newName] = newConfig.texts[key];
                    } else {
                        reorderedProfiles[key] = newConfig.texts[key];
                    }
                }
                newConfig.texts = reorderedProfiles;
                newConfig.options.activeProfileName = newName;
                this.activeProfileKey = newName;
            } else {
                // type === 'category'
                const profileData = newConfig.texts[this.activeProfileKey];
                const reorderedCategories = {};
                for (const key of Object.keys(profileData)) {
                    if (key === oldName) {
                        reorderedCategories[newName] = profileData[key];
                    } else {
                        reorderedCategories[key] = profileData[key];
                    }
                }
                newConfig.texts[this.activeProfileKey] = reorderedCategories;
                this.activeCategoryKey = newName;
            }

            // --- Save and Exit ---
            try {
                await this.callbacks.onSave(newConfig);
                await this._exitRenameMode(true);
            } catch (e) {
                if (footerMessage) footerMessage.textContent = `Save failed: ${e.message}`;
            }
        }

        _injectStyles() {
            const styleId = `${APPID}-editor-modal-styles`;
            if (document.getElementById(styleId)) return;

            const styles = this.callbacks.siteStyles;
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .${APPID}-editor-modal-header-controls {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                }
                .${APPID}-header-row {
                  display: grid;
                  /* Label | Flexible Input | Action Buttons */
                  grid-template-columns: 5.5rem 1fr auto;
                  gap: 8px;
                  align-items: center;
                }
                .${APPID}-header-row.is-disabled {
                  opacity: 0.5;
                  pointer-events: none;
                }
                .${APPID}-header-row > label {
                  grid-column: 1;
                  text-align: right;
                  color: ${styles.label_text};
                  font-size: 0.9em;
                }
                .${APPID}-header-row > .${APPID}-rename-area {
                  grid-column: 2;
                  min-width: 180px; /* Ensure a minimum width */
                }
                .${APPID}-header-row > .${APPID}-action-area {
                  grid-column: 3;
                  display: grid; /* Use grid for stacking */
                  align-items: center;
                }
                /* Stacking trick: place all button groups in the same cell */
                .${APPID}-action-area > * {
                    grid-area: 1 / 1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .${APPID}-main-actions,
                .${APPID}-rename-actions {
                    justify-content: flex-start;
                }
                .${APPID}-delete-confirm-group {
                  justify-content: flex-end;
                  display: none;
                }
                .${APPID}-delete-confirm-label {
                  color: ${styles.delete_confirm_label_text};
                  font-style: italic;
                  margin-right: auto;
                }
                .${APPID}-delete-confirm-btn-yes {
                  background-color: ${styles.delete_confirm_btn_bg} !important;
                  color: ${styles.delete_confirm_btn_text} !important;
                }
                .${APPID}-delete-confirm-btn-yes:hover {
                  background-color: ${styles.delete_confirm_btn_hover_bg} !important;
                  color: ${styles.delete_confirm_btn_hover_text} !important;
                }
                .${APPID}-editor-modal-content {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  height: 60vh;
                  min-height: 400px;
                  overflow: hidden;
                }
                .${APPID}-editor-scrollable-area {
                  flex-grow: 1;
                  overflow-y: auto;
                  padding: 4px 8px 4px 4px;
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  border: 1px solid ${styles.input_border};
                  border-radius: 4px;
                  background: ${styles.input_bg};
                  transition: opacity 0.2s;
                }
                .${APPID}-editor-scrollable-area.is-disabled {
                  pointer-events: none;
                  opacity: 0.5;
                }
                .${APPID}-drag-handle {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 24px;
                  flex-shrink: 0;
                  align-self: center;
                  cursor: grab;
                  color: ${styles.label_text};
                  opacity: 0.6;
                }
                .${APPID}-drag-handle:hover {
                  opacity: 1;
                }
                .${APPID}-drag-handle:active {
                  cursor: grabbing;
                }
                .${APPID}-text-item {
                  display: flex;
                  align-items: flex-start;
                  gap: 8px;
                  padding: 4px;
                  border-radius: 4px;
                  border-top: 2px solid transparent;
                  border-bottom: 2px solid transparent;
                  transition: background-color 0.2s, border-color 0.1s;
                }
                .${APPID}-text-item.dragging {
                  opacity: 0.4;
                  background-color: rgba(255,255,255,0.1);
                }
                .${APPID}-text-item.drag-over-top {
                  border-top: 2px solid ${styles.dnd_indicator_color};
                }
                .${APPID}-text-item.drag-over-bottom {
                  border-bottom: 2px solid ${styles.dnd_indicator_color};
                }
                .${APPID}-text-item textarea {
                  flex-grow: 1;
                  resize: none;
                  min-height: 80px;
                  max-height: 250px;
                  overflow-y: auto;
                  font-family: monospace;
                }
                .${APPID}-text-item.dragging textarea {
                  pointer-events: none;
                }
                .${APPID}-editor-modal-shell-box .is-invalid {
                  border-color: ${styles.error_text} !important;
                }
                .${APPID}-text-item-controls {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }
                .${APPID}-editor-modal-shell-box input,
                .${APPID}-editor-modal-shell-box textarea,
                .${APPID}-editor-modal-shell-box select {
                  background: ${styles.input_bg};
                  border: 1px solid ${styles.input_border};
                  border-radius: 4px;
                  box-sizing: border-box;
                  color: ${styles.input_text};
                  padding: 6px 8px;
                  width: 100%;
                }
                 .${APPID}-modal-button {
                  background: ${styles.btn_bg};
                  border: 1px solid ${styles.btn_border};
                  border-radius: var(--radius-md, ${CONSTANTS.MODAL.BTN_RADIUS}px);
                  color: ${styles.btn_text};
                  cursor: pointer;
                  font-size: ${CONSTANTS.MODAL.BTN_FONT_SIZE}px;
                  padding: ${CONSTANTS.MODAL.BTN_PADDING};
                  transition: background 0.12s, color 0.12s, opacity 0.12s;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  white-space: nowrap;
                  min-width: 80px; /* Unify button width */
                }
                .${APPID}-modal-button:hover {
                  background: ${styles.btn_hover_bg} !important;
                  border-color: ${styles.btn_border};
                }
                .${APPID}-modal-button:disabled {
                  background: ${styles.btn_bg} !important;
                  cursor: not-allowed;
                  opacity: 0.5;
                }
                .${APPID}-modal-button.${APPID}-move-btn {
                  line-height: 1;
                  min-width: 24px;
                  padding: 4px;
                  height: 24px;
                  width: 24px;
                }
                 .${APPID}-modal-button.${APPID}-delete-btn {
                  line-height: 1;
                  min-width: 24px;
                  padding: 4px;
                  height: 24px;
                  width: 24px;
                  font-size: 16px;
                  color: ${styles.delete_confirm_label_text};
                }
                .${APPID}-editor-modal-shell-footer-message.${APPID}-conflict-text {
                    color: ${styles.error_text};
                    display: flex;
                    align-items: center;
                }
                #${APPID}-conflict-reload-btn {
                    border-color: ${styles.error_text};
                }
                .-btn-primary {
                    background-color: #1a73e8 !important;
                    color: #ffffff !important;
                    border: 1px solid transparent !important;
                }
                .-btn-primary:hover {
                    background-color: #1557b0 !important;
                }
            `;
            document.head.appendChild(style);
        }

        getContextForReopen() {
            return { type: CONSTANTS.MODAL_TYPES.TEXT_EDITOR, key: this.activeCategoryKey };
        }
    }

    /**
     * Manages the JSON editing modal by using the CustomModal component.
     */
    class JsonModalComponent {
        constructor(callbacks) {
            this.subscriptions = [];
            this.callbacks = callbacks;
            this.modal = null;
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        destroy() {
            this.modal?.destroy();
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
        }

        render() {
            // This method is now obsolete as the modal is created on demand in open().
            return;
        }

        async open(anchorElement) {
            if (this.modal) return;
            this.callbacks.onModalOpenStateChange?.(true);

            const p = APPID;
            this.modal = new CustomModal({
                title: `${APPNAME} Settings`,
                width: `${CONSTANTS.MODAL.WIDTH}px`,
                cssPrefix: `${p}-modal-shell`,
                styles: this.callbacks.siteStyles, // Use injected styles
                buttons: [
                    { text: 'Export', id: `${p}-json-modal-export-btn`, onClick: () => this._handleExport() },
                    { text: 'Import', id: `${p}-json-modal-import-btn`, onClick: () => this._handleImport() },
                    { text: 'Cancel', id: `${p}-json-modal-cancel-btn`, className: '-btn-push-right', onClick: () => this.close() },
                    { text: 'Save', id: `${p}-json-modal-save-btn`, className: '-btn-primary', onClick: () => this._handleSave() },
                ],
                onDestroy: () => {
                    this.callbacks.onModalOpenStateChange?.(false);
                    this.modal = null;
                },
            });
            this._injectStyles(); // Keep injectStyles for internal elements like textarea
            const contentContainer = this.modal.getContentContainer();
            this._createContent(contentContainer);

            const config = await this.callbacks.getCurrentConfig();
            const textarea = contentContainer.querySelector('textarea');
            textarea.value = JSON.stringify(config, null, 2);

            this.modal.show(anchorElement);
            // Set focus and move cursor to the start of the textarea.
            textarea.focus();
            textarea.scrollTop = 0;
            textarea.selectionStart = 0;
            textarea.selectionEnd = 0;
        }

        close() {
            if (this.modal) {
                this.modal.close();
            }
        }

        _createContent(parent) {
            const styles = this.callbacks.siteStyles;
            parent.style.paddingTop = '16px';
            parent.style.paddingBottom = '8px';

            const textarea = h('textarea', {
                style: {
                    width: '100%',
                    height: `${CONSTANTS.MODAL.TEXTAREA_HEIGHT}px`,
                    boxSizing: 'border-box',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    marginBottom: '0',
                    border: `1px solid ${styles.textarea_border}`,
                    background: styles.textarea_bg,
                    color: styles.textarea_text,
                },
            });
            const msgDiv = h(`div.${APPID}-modal-msg`, {
                style: {
                    color: styles.msg_error_text,
                    marginTop: '4px',
                    fontSize: '0.9em',
                },
            });
            parent.append(textarea, msgDiv);
        }

        async _handleSave() {
            const textarea = this.modal.getContentContainer().querySelector('textarea');
            const msgDiv = this.modal.getContentContainer().querySelector(`.${APPID}-modal-msg`);
            try {
                const obj = JSON.parse(textarea.value);
                await this.callbacks.onSave(obj);
                this.close();
            } catch (e) {
                // Display the specific error message from the save process.
                msgDiv.textContent = e.message;
                msgDiv.style.color = this.callbacks.siteStyles.msg_error_text;
            }
        }

        async _handleExport() {
            const msgDiv = this.modal.getContentContainer().querySelector(`.${APPID}-modal-msg`);
            try {
                // Clear previous messages before starting.
                msgDiv.textContent = '';

                const config = await this.callbacks.getCurrentConfig();
                const jsonString = JSON.stringify(config, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = h('a', {
                    href: url,
                    download: `${APPID}_config.json`,
                });
                a.click();

                // Revoke the URL after a delay to ensure the download has time to start.
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                msgDiv.textContent = 'Export successful.';
                msgDiv.style.color = this.callbacks.siteStyles.msg_success_text;
            } catch (e) {
                msgDiv.textContent = `Export failed: ${e.message}`;
                msgDiv.style.color = this.callbacks.siteStyles.msg_error_text;
            }
        }

        _handleImport() {
            const textarea = this.modal.getContentContainer().querySelector('textarea');
            const msgDiv = this.modal.getContentContainer().querySelector(`.${APPID}-modal-msg`);
            const fileInput = h('input', {
                type: 'file',
                accept: 'application/json',
                onchange: (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const importedConfig = JSON.parse(e.target.result);
                                textarea.value = JSON.stringify(importedConfig, null, 2);
                                msgDiv.textContent = 'Import successful. Click "Save" to apply.';
                                msgDiv.style.color = this.callbacks.siteStyles.msg_success_text;
                            } catch (err) {
                                msgDiv.textContent = `Import failed: ${err.message}`;
                                msgDiv.style.color = this.callbacks.siteStyles.msg_error_text;
                            }
                        };
                        reader.readAsText(file);
                    }
                },
            });
            fileInput.click();
        }

        _injectStyles() {
            const styleId = `${APPID}-json-modal-styles`;
            if (document.getElementById(styleId)) return;

            const style = h('style', {
                id: styleId,
                textContent: `
                    .${APPID}-modal-shell-footer-message {
                        display: none !important;
                    }
                    .${APPID}-modal-shell-button-group {
                        flex-grow: 1;
                    }
                    .${APPID}-modal-shell-button {
                        min-width: 80px;
                    }
                    .-btn-push-right {
                        margin-left: auto !important;
                    }
                    .-btn-primary {
                        background-color: #1a73e8 !important;
                        color: #ffffff !important;
                        border: 1px solid transparent !important;
                    }
                    .-btn-primary:hover {
                        background-color: #1557b0 !important;
                    }
                `,
            });
            document.head.appendChild(style);
        }

        getContextForReopen() {
            return { type: CONSTANTS.MODAL_TYPES.JSON };
        }
    }

    class InsertButtonComponent extends UIComponentBase {
        constructor(callbacks, options) {
            super(callbacks);
            this.options = options;
            this.id = this.options.id;
            this.styleId = `${this.id}-style`;
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
            this._injectStyles();

            this.element = h('button', {
                // Explicitly set type="button" to prevent form submission
                type: 'button',
                id: this.id,
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

            // Retrieve icon definition from the config structure
            const iconDef = this.options.config.iconDef;
            if (iconDef) {
                const svgElement = createIconFromDef(iconDef);
                if (svgElement) {
                    this.element.appendChild(svgElement);
                }
            }

            return this.element;
        }

        /** @private */
        _injectStyles() {
            if (document.getElementById(this.styleId)) return;

            const { styles, hoverStyles, anchorStyles } = this.options.config;

            // Helper to stringify style objects directly
            const toCss = (obj) =>
                Object.entries(obj || {})
                    .map(([k, v]) => `${k}: ${v};`)
                    .join('\n                    ');

            const style = h('style', {
                id: this.styleId,
                textContent: `
                #${this.id} {
                    ${toCss(styles)}
                    
                    /* Fixed base styles */
                    font-size: 16px;
                    cursor: pointer;
                    box-shadow: var(--drop-shadow-xs, 0 1px 1px #0000000d);
                    transition: background 0.12s, border-color 0.12s, box-shadow 0.12s;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    pointer-events: auto !important;
                }
                #${this.id}:hover {
                    ${toCss(hoverStyles)}
                }
                .${APPID}-anchor-styled {
                    ${toCss(anchorStyles)}
                }
            `,
            });
            document.head.appendChild(style);
        }
    }

    class TextListComponent extends UIComponentBase {
        constructor(callbacks, options) {
            super(callbacks);
            this.subscriptions = [];
            this.options = options;
            this.id = this.options.id;
            this.styleId = `${this.id}-style`;
            this.elements = {
                tabsContainer: null,
                optionsContainer: null,
            };
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        destroy() {
            super.destroy();
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
        }

        render() {
            this._injectStyles();

            this.element = h(
                `div#${this.id}`,
                {
                    style: { display: 'none' },
                    onmouseenter: (e) => this.callbacks.onMouseEnter?.(e),
                    onmouseleave: (e) => this.callbacks.onMouseLeave?.(e),
                },
                [(this.elements.tabsContainer = h(`div.${APPID}-category-tabs`)), h(`div.${APPID}-category-separator`), (this.elements.optionsContainer = h(`div.${APPID}-text-options`))]
            );

            document.body.appendChild(this.element);
            return this.element;
        }

        /** @private */
        _injectStyles() {
            if (document.getElementById(this.styleId)) return;

            const styles = this.options.siteStyles;

            const style = h('style', {
                id: this.styleId,
                textContent: `
                #${this.id} {
                    position: fixed;
                    z-index: ${CONSTANTS.Z_INDICES.TEXT_LIST};
                    display: none;
                    min-width: ${CONSTANTS.TEXT_LIST_WIDTH}px;
                    max-width: ${CONSTANTS.TEXT_LIST_WIDTH}px;
                    padding: 8px;
                    border-radius: var(--radius-md, 4px);
                    background: ${styles.bg};
                    color: ${styles.text};
                    border: 1px solid ${styles.border};
                    box-shadow: ${styles.shadow};
                    /* Flexbox for structural ordering */
                    display: flex;
                    flex-direction: column;
                    /* Box sizing important for height calculations */
                    box-sizing: border-box;
                }
                .${APPID}-category-tabs {
                    display: flex;
                    margin: 4px 0;
                    flex: 0 0 auto; /* Fixed height */
                }
                .${APPID}-category-separator {
                    height: 1px;
                    margin: 4px 0;
                    background: ${styles.separator_bg};
                    flex: 0 0 auto; /* Fixed height */
                }
                .${APPID}-category-tab {
                    flex: 1 1 0;
                    min-width: 0;
                    max-width: 90px;
                    margin-right: 4px;
                    padding: 4px 0;
                    border-radius: var(--radius-md, 4px);
                    font-size: 12px;
                    text-align: center;
                    background: ${styles.tab_bg};
                    color: ${styles.tab_text};
                    border: 1px solid ${styles.tab_border};
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .${APPID}-category-tab.active {
                    background: ${styles.tab_active_bg};
                    border-color: ${styles.tab_active_border};
                    outline: 2px solid ${styles.tab_active_outline};
                }
                .${APPID}-category-tab:hover {
                    background: ${styles.tab_hover_bg};
                }
                .${APPID}-text-options {
                    flex: 1 1 auto; /* Flexible height */
                    overflow-y: auto; /* Enable scrolling here */
                    min-height: 0; /* Crucial for nested flex scrolling */
                    overscroll-behavior: contain;
                }
                .${APPID}-text-option {
                    display: block;
                    width: 100%;
                    margin: 4px 0;
                    padding: 4px;
                    font-size: 13px;
                    text-align: left;
                    border-radius: var(--radius-md, 5px);
                    background: ${styles.option_bg};
                    color: ${styles.option_text};
                    border: 1px solid ${styles.option_border};
                    cursor: pointer;
                }
                .${APPID}-text-option:hover, .${APPID}-text-option:focus {
                    background: ${styles.option_hover_bg} !important;
                    border-color: ${styles.option_hover_border} !important;
                    outline: 2px solid ${styles.option_hover_outline};
                }
            `,
            });
            document.head.appendChild(style);
        }
    }

    class UIManager {
        /** * @param {(config: AppConfig) => Promise<void>} onSaveCallback
         * @param {() => Promise<AppConfig>} getCurrentConfigCallback
         * @param {() => void} onModalClose
         * @param {object} siteStyles
         */
        constructor(config, onSave, platformDetails, siteStyles, onModalClose) {
            this.subscriptions = [];
            this.config = config;
            this.onSave = onSave;
            this.platformDetails = platformDetails;
            this.siteStyles = siteStyles;
            this.onModalClose = onModalClose;

            // Flag for requestAnimationFrame throttling
            this.isRepositioningScheduled = false;

            const activeProfileName = this.config.options.activeProfileName || Object.keys(this.config.texts)[0];
            const activeProfile = this.config.texts[activeProfileName] || {};
            this.activeCategory = Object.keys(activeProfile)[0] || null;

            this.hideTimeoutId = null;
            this.globalListenerTimeoutId = null; // Added to prevent listener registration conflicts
            this.isModalOpen = false;

            // Bind handlers for global events to ensure reference equality for removal
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
            };

            const modalCallbacks = {
                onSave: (newConfig) => this.onSave(newConfig),
                getCurrentConfig: () => this.config,
                onModalOpenStateChange: (isOpen) => this.setModalState(isOpen),
            };

            // Initialize Settings Panel first to reference it in InsertButton callbacks
            this.components.settingsPanel = new SettingsPanelComponent({
                onSave: (newConfig) => this.onSave(newConfig),
                getCurrentConfig: () => this.config,
                // Anchor to insertBtn (will be assigned later, but reference is dynamic)
                getAnchorElement: () => this.components.insertBtn.element,
                onShowTextEditorModal: () => this.components.textEditorModal.open(),
                onShowJsonModal: () => {
                    this.components.settingsPanel.hide();
                    this.components.jsonModal.open(this.components.insertBtn.element);
                },
                siteStyles: this.siteStyles.SETTINGS_PANEL,
            });

            this.components.insertBtn = new InsertButtonComponent(
                {
                    onClick: (e) => {
                        const mode = this.config.options.trigger_mode || 'hover';

                        // Check if settings panel is open
                        if (this.components.settingsPanel.isOpen()) {
                            // If settings panel is open, close it and open text list.
                            this.components.settingsPanel.hide();
                            this._showTextList();
                            return;
                        }

                        if (mode === 'click') {
                            // Click mode: Toggle list
                            if (this.components.textList.element.style.display === 'none') {
                                this._showTextList();
                            } else {
                                this._hideTextList();
                            }
                        } else {
                            // Hover mode (legacy): Toggle settings panel
                            // (If we reached here, settings panel is closed, so we open it)
                            // Exclusive control: Hide text list when opening settings
                            this._hideTextList();
                            this.components.settingsPanel.show();
                        }
                    },
                    onContextMenu: (e) => {
                        // Right-click: Toggle settings panel
                        this._hideTextList(); // Always close text list first
                        if (this.components.settingsPanel.isOpen()) {
                            this.components.settingsPanel.hide();
                        } else {
                            this.components.settingsPanel.show();
                        }
                    },
                    onMouseEnter: () => {
                        const mode = this.config.options.trigger_mode || 'hover';
                        // Exclusive control: Only show list if settings panel is closed
                        if (mode === 'hover' && !this.components.settingsPanel.isOpen()) {
                            this._showTextList();
                        }
                    },
                    onMouseLeave: () => {
                        // In click mode, we do NOT auto-hide on mouse leave
                        const mode = this.config.options.trigger_mode || 'hover';
                        if (mode !== 'click') {
                            this._startHideTimer();
                        }
                    },
                },
                {
                    id: `${CONSTANTS.ID_PREFIX}insert-btn`,
                    title: 'Add quick text', // Initial title, will be updated in init()
                    // Pass the structured config from StyleManager
                    config: PlatformAdapters.StyleManager.getInsertButtonConfig(this.platformDetails.platformId),
                }
            );

            this.components.textList = new TextListComponent(
                {
                    onMouseEnter: () => clearTimeout(this.hideTimeoutId),
                    onMouseLeave: () => {
                        // In click mode, we do NOT auto-hide on mouse leave
                        const mode = this.config.options.trigger_mode || 'hover';
                        if (mode !== 'click') {
                            this._startHideTimer();
                        }
                    },
                },
                {
                    id: `${CONSTANTS.ID_PREFIX}text-list`,
                    siteStyles: this.siteStyles.TEXT_LIST,
                }
            );

            this.components.jsonModal = new JsonModalComponent({
                ...modalCallbacks,
                siteStyles: this.siteStyles.JSON_MODAL,
            });
            this.components.textEditorModal = new TextEditorModalComponent({
                ...modalCallbacks,
                siteStyles: this.siteStyles.THEME_MODAL,
                onShowJsonModal: () => {
                    this.components.textEditorModal.close();
                    this.components.jsonModal.open(this.components.insertBtn.element);
                },
            });
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        init() {
            this._renderComponents();
            this.renderContent();
            this._updateButtonTitle(); // Initialize tooltip based on config

            this._subscribe(EVENTS.REOPEN_MODAL, ({ type, key }) => {
                if (type === CONSTANTS.MODAL_TYPES.JSON) {
                    this.components.jsonModal.open(this.components.insertBtn.element);
                } else if (type === CONSTANTS.MODAL_TYPES.TEXT_EDITOR) {
                    // Assuming open method takes key for textEditor
                    this.components.textEditorModal.open(this.components.insertBtn.element, key);
                }
            });

            // Use direct method call instead of debounced version
            this._subscribe(EVENTS.UI_REPOSITION, () => this.repositionInsertButton());

            // Close all floating UIs when navigation starts
            this._subscribe(EVENTS.NAVIGATION_START, () => {
                this.components.settingsPanel.hide();
                this._hideTextList();
            });

            // Trigger initial repositioning
            this.repositionInsertButton();

            // Initialize SettingsPanel to start listening for updates
            if (this.components.settingsPanel) {
                this.components.settingsPanel.init();
            }
        }

        destroy() {
            clearTimeout(this.hideTimeoutId);
            clearTimeout(this.globalListenerTimeoutId);
            for (const key in this.components) {
                this.components[key]?.destroy();
            }
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
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

        updateConfig(newConfig) {
            this.config = newConfig;
            const activeProfileName = this.config.options.activeProfileName || Object.keys(this.config.texts)[0];
            const activeProfile = this.config.texts[activeProfileName] || {};
            this.activeCategory = Object.keys(activeProfile)[0] || null;
            this.renderContent();
            this._updateButtonTitle(); // Update tooltip when config changes
        }

        renderContent() {
            if (!this.components.textList) return;
            const { tabsContainer, optionsContainer } = this.components.textList.elements;
            tabsContainer.textContent = '';
            optionsContainer.textContent = '';

            const activeProfileName = this.config.options.activeProfileName;
            const activeProfile = this.config.texts[activeProfileName];

            if (!activeProfile) {
                Logger.warn(`Active profile "${activeProfileName}" not found.`);
                return;
            }

            Object.keys(activeProfile).forEach((cat) => {
                const tab = h('button', {
                    className: `${APPID}-category-tab` + (cat === this.activeCategory ? ' active' : ''),
                    textContent: cat,
                    // Prevent focus loss
                    onmousedown: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.activeCategory = cat;
                        this.renderContent();
                    },
                });
                tabsContainer.appendChild(tab);
            });

            (activeProfile[this.activeCategory] || []).forEach((txt) => {
                const btn = h('button', {
                    className: `${APPID}-text-option`,
                    textContent: txt.length > 100 ? `${txt.slice(0, 100)}…` : txt,
                    title: txt,
                    // Prevent focus loss
                    onmousedown: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this._insertText(txt);
                        // Ensure _hideTextList is called to clean up listeners properly
                        this._hideTextList();
                    },
                });
                optionsContainer.appendChild(btn);
            });
        }

        /**
         * Updates the insert button's tooltip based on the current trigger mode.
         * @private
         */
        _updateButtonTitle() {
            if (!this.components.insertBtn) return;
            const mode = this.config.options.trigger_mode || 'hover';
            const title = mode === 'click' ? 'Click for Text List / Right-click for Settings' : 'Hover for Text List / Click for Settings';
            this.components.insertBtn.setTitle(title);
        }

        _renderComponents() {
            for (const key in this.components) {
                this.components[key]?.render();
            }
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

                // 1. Calculate available space
                const spaceAbove = btnRect.top - margin - gap;
                const spaceBelow = window.innerHeight - btnRect.bottom - margin - gap;

                // 2. Determine direction
                // Default to 'top' (upwards) unless space is extremely tight and bottom has significantly more room
                const placeOnTop = spaceAbove >= 200 || spaceAbove >= spaceBelow;

                // 3. Apply Styles via JS (Bypass CSS class dependency)
                if (placeOnTop) {
                    // Upwards: Tabs at bottom (column-reverse), anchored to button top
                    listElem.style.flexDirection = 'column-reverse';
                    listElem.style.top = 'auto';
                    listElem.style.bottom = `${window.innerHeight - btnRect.top + gap}px`;
                    listElem.style.maxHeight = `${spaceAbove}px`;
                } else {
                    // Downwards: Tabs at top (column), anchored to button bottom
                    listElem.style.flexDirection = 'column';
                    listElem.style.bottom = 'auto';
                    listElem.style.top = `${btnRect.bottom + gap}px`;
                    listElem.style.maxHeight = `${spaceBelow}px`;
                }

                // 4. Calculate horizontal position
                const listWidth = listElem.offsetWidth || CONSTANTS.TEXT_LIST_WIDTH;
                let left = btnRect.left;
                if (left + listWidth > window.innerWidth - margin) {
                    left = window.innerWidth - listWidth - margin;
                }
                left = Math.max(left, margin);
                listElem.style.left = `${left}px`;

                // 5. Reveal
                listElem.style.opacity = '1';
            });
        }

        _showTextList() {
            clearTimeout(this.hideTimeoutId);
            clearTimeout(this.globalListenerTimeoutId); // Clear any pending listener attachment
            const listElem = this.components.textList.element;

            // Reset styles to ensure clean state before calculation
            listElem.style.display = 'flex'; // Use flex, not block
            listElem.style.opacity = '0'; // Hide visually
            listElem.style.left = '-9999px'; // Move off-screen
            listElem.style.top = ''; // Clear potential stuck values
            listElem.style.bottom = '';

            this._positionList();

            const mode = this.config.options.trigger_mode || 'hover';
            if (mode === 'click') {
                // Add global listeners with slight delay to avoid immediate trigger from the opening click
                this.globalListenerTimeoutId = setTimeout(() => {
                    document.addEventListener('click', this._handlers.globalClick);
                    document.addEventListener('keydown', this._handlers.globalKeydown);
                }, 0);
            }
        }

        _startHideTimer() {
            this.hideTimeoutId = setTimeout(() => {
                this._hideTextList();
            }, CONSTANTS.HIDE_DELAY_MS);
        }

        _hideTextList() {
            clearTimeout(this.hideTimeoutId);
            clearTimeout(this.globalListenerTimeoutId); // Cancel pending listener attachment
            if (this.components.textList && this.components.textList.element) {
                this.components.textList.element.style.display = 'none';
            }

            // Remove global listeners
            document.removeEventListener('click', this._handlers.globalClick);
            document.removeEventListener('keydown', this._handlers.globalKeydown);
        }

        _handleGlobalClick(e) {
            const listEl = this.components.textList.element;
            const btnEl = this.components.insertBtn.element;

            // Check if list is visible; if not, cleanup listeners (safety check)
            if (listEl.style.display === 'none') {
                this._hideTextList();
                return;
            }

            // If click is inside list or button, do nothing (keep open)
            if (listEl.contains(e.target) || btnEl.contains(e.target)) {
                return;
            }

            // Clicked outside: close list
            this._hideTextList();
        }

        _handleGlobalKeydown(e) {
            const listEl = this.components.textList.element;
            if (listEl.style.display === 'none') return;

            if (e.key === 'Escape') {
                this._hideTextList();
            }
        }
    }

    // =================================================================================
    // SECTION: Sync Manager
    // =================================================================================

    class SyncManager {
        constructor(appInstance) {
            this.subscriptions = [];
            this.app = appInstance;
            this.pendingRemoteConfig = null;
            this.remoteChangeListenerId = null;
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        init() {
            this.remoteChangeListenerId = GM_addValueChangeListener(this.app.configKey, async (name, oldValue, newValue, remote) => {
                if (remote) {
                    await this._handleRemoteChange(newValue);
                }
            });
        }

        destroy() {
            if (this.remoteChangeListenerId !== null) {
                GM_removeValueChangeListener(this.remoteChangeListenerId);
                this.remoteChangeListenerId = null;
            }
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
        }

        onModalClose() {
            if (this.pendingRemoteConfig) {
                Logger.log('SyncManager: Modal closed with a pending update. Applying it now.');
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
            Logger.log('SyncManager: Remote config change detected.');
            try {
                const newConfig = await this.app.configManager.decode(rawValue);
                const activeModal = this.app.uiManager.getActiveModal?.();

                if (activeModal) {
                    Logger.log('SyncManager: A modal is open. Storing update and displaying conflict notification.');
                    this.pendingRemoteConfig = newConfig;
                    this._showConflictNotification(activeModal);
                } else {
                    Logger.log('SyncManager: No modal open. Applying silent update.');
                    this.app.applyUpdate(newConfig);
                }
            } catch (e) {
                Logger.error('SyncManager: Failed to handle remote config change:', e);
            }
        }

        _showConflictNotification(modalComponent) {
            if (!modalComponent?.modal) return;
            this._clearConflictNotification(modalComponent); // Clear previous state first

            const styles = modalComponent.callbacks.siteStyles;
            const messageArea = modalComponent.modal.dom.footerMessage;

            if (messageArea) {
                const messageText = h('span', {
                    textContent: 'Settings updated in another tab.',
                    style: { display: 'flex', alignItems: 'center' },
                });
                const reloadBtn = h('button', {
                    id: `${APPID}-conflict-reload-btn`,
                    className: `${APPID}-modal-button`,
                    textContent: 'Reload UI',
                    title: 'Discard local changes and load the settings from the other tab.',
                    style: {
                        borderColor: styles.error_text || 'red',
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
                messageArea.classList.add(`${APPID}-conflict-text`);
                messageArea.style.color = styles.error_text || 'red';
                messageArea.append(messageText, reloadBtn);
            }
        }

        _clearConflictNotification(modalComponent) {
            if (!modalComponent?.modal) return;
            const messageArea = modalComponent.modal.dom.footerMessage;
            if (messageArea) {
                messageArea.textContent = '';
                messageArea.classList.remove(`${APPID}-conflict-text`);
            }
        }
    }

    // =================================================================================
    // SECTION: DOM Observers and Event Listeners
    // =================================================================================

    class ObserverManager {
        constructor() {
            this.subscriptions = [];
            this.activePageObservers = []; // To store cleanup functions
            this.urlObserverInitialized = false;
            this.originalHistoryMethods = { pushState: null, replaceState: null };
            this.boundURLChangeHandler = null;
            this._historyWrappers = null; // Store wrappers to identify them later
        }

        init() {}

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        /**
         * Starts all platform-specific observers by retrieving and executing them
         * from the PlatformAdapter.
         */
        start() {
            // Call the URL change observer to set up all page-specific listeners.
            this.startURLChangeObserver();
        }

        destroy() {
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];

            this.activePageObservers.forEach((cleanup) => cleanup());
            this.activePageObservers = [];

            // Cancel any pending debounced handler execution
            if (this.boundURLChangeHandler && typeof this.boundURLChangeHandler.cancel === 'function') {
                this.boundURLChangeHandler.cancel();
            }

            // Restore original history methods and remove listeners if they were initialized.
            if (this.urlObserverInitialized) {
                // Safe unhooking for pushState
                if (this.originalHistoryMethods.pushState) {
                    if (history.pushState === this._historyWrappers?.pushState) {
                        history.pushState = this.originalHistoryMethods.pushState;
                    }
                    this.originalHistoryMethods.pushState = null;
                }

                // Safe unhooking for replaceState
                if (this.originalHistoryMethods.replaceState) {
                    if (history.replaceState === this._historyWrappers?.replaceState) {
                        history.replaceState = this.originalHistoryMethods.replaceState;
                    }
                    this.originalHistoryMethods.replaceState = null;
                }

                if (this.boundURLChangeHandler) {
                    window.removeEventListener('popstate', this.boundURLChangeHandler);
                }
                this.urlObserverInitialized = false;
                this.boundURLChangeHandler = null;
                this._historyWrappers = null;
            }
        }

        /**
         * @private
         * @description Sets up the monitoring for URL changes, which acts as the main entry point for initializing page-specific observers.
         * Implements a robust lifecycle: Detect -> Cleanup -> Wait for Container -> Initialize.
         */
        startURLChangeObserver() {
            // The handler is now defined only once and bound to the instance for stable reference.
            if (!this.boundURLChangeHandler) {
                // Initialize with null to ensure the handler logic runs on the first call after any init.
                let lastPath = null;

                // Define the "raw" handler function that contains the navigation logic.
                const rawURLChangeHandler = async () => {
                    const currentPath = location.pathname + location.search;

                    // Gate: If the URL is the same as the one we just processed, do nothing.
                    if (currentPath === lastPath) {
                        Logger.debug('URL change detected, but path is the same as last processed. Ignoring.');
                        return;
                    }

                    try {
                        lastPath = currentPath;
                        Logger.debug('Navigation detected. Starting lifecycle...');

                        // 1. Notify Start
                        EventBus.publish(EVENTS.NAVIGATION_START);

                        // 2. Cleanup previous page resources
                        this.activePageObservers.forEach((cleanup) => cleanup());
                        this.activePageObservers = [];

                        // 3. Notify Navigation (General cleanup)
                        EventBus.publish(EVENTS.NAVIGATION);

                        // 4. Wait for INPUT_TARGET (Crucial for SPA transitions)
                        // The platform adapter must provide the correct selector for the INPUT_TARGET.
                        const platform = PlatformAdapters.General.getPlatformDetails();
                        if (!platform) return;

                        const appContainer = await waitForElement(platform.selectors.INPUT_TARGET);
                        if (!appContainer) {
                            Logger.badge('OBSERVER INIT', LOG_STYLES.YELLOW, 'warn', 'Target container not found after URL change. Aborting initialization.');
                            return;
                        }

                        Logger.debug('Target container detected. Initializing observers...');

                        // 5. Initialize Page-Specific Observers
                        const observerStarters = PlatformAdapters.Observer.getInitializers();
                        for (const startObserver of observerStarters) {
                            // Ensure the context of 'this' is the ObserverManager instance
                            // Note: Dependencies are no longer needed for the new logic, passing empty object for compatibility
                            const cleanup = await startObserver.call(this, {});
                            if (typeof cleanup === 'function') {
                                this.activePageObservers.push(cleanup);
                            }
                        }
                    } catch (e) {
                        Logger.badge('NAV_HANDLER_ERROR', LOG_STYLES.RED, 'error', 'Error during navigation handling:', e);
                    }
                };

                // Create the debounced version of the handler.
                // This prevents race conditions during rapid URL changes on initialization.
                this.boundURLChangeHandler = debounce(rawURLChangeHandler, CONSTANTS.TIMING.TIMEOUTS.POST_NAVIGATION_DOM_SETTLE || 200);
            }

            // Hook into history changes only once per lifecycle.
            if (!this.urlObserverInitialized) {
                this.urlObserverInitialized = true;
                this._historyWrappers = {}; // Store our wrappers to identify them later

                // Capture the ObserverManager instance for use in the wrapper function.
                const observerManagerInstance = this;

                for (const m of ['pushState', 'replaceState']) {
                    const orig = history[m];
                    this.originalHistoryMethods[m] = orig; // Store original for restoration

                    // Define the wrapper function
                    const wrapper = function (...args) {
                        // Call original method with the correct context (`this` = `history`).
                        const result = orig.apply(this, args);

                        // Call our handler using the captured instance.
                        if (observerManagerInstance.boundURLChangeHandler) {
                            observerManagerInstance.boundURLChangeHandler();
                        }
                        return result;
                    };

                    // Store our wrapper reference and apply it
                    this._historyWrappers[m] = wrapper;
                    history[m] = wrapper;
                }
                window.addEventListener('popstate', this.boundURLChangeHandler);
            }

            // Manually call the handler on initialization to process the initial page load.
            if (this.boundURLChangeHandler) {
                this.boundURLChangeHandler();
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
    // SECTION: Core Functions
    // =================================================================================

    class AppController {
        constructor() {
            this.subscriptions = [];
            this.configManager = null;
            this.uiManager = null;
            this.platformDetails = null;
            this.syncManager = null;
            this.observerManager = new ObserverManager();
        }

        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        _subscribeOnce(event, listener) {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2);
            const key = `${createEventKey(this, event)}_${uniqueSuffix}`;

            const wrappedListener = (...args) => {
                this.subscriptions = this.subscriptions.filter((sub) => sub.key !== key);
                listener(...args);
            };

            EventBus.once(event, wrappedListener, key);
            this.subscriptions.push({ event, key });
        }

        async init() {
            this.platformDetails = PlatformAdapters.General.getPlatformDetails();
            if (!this.platformDetails) {
                Logger.log('Not on a supported page.');
                return;
            }

            this.configManager = new ConfigManager();
            await this.configManager.load();

            // Set logger level from config immediately after loading
            Logger.setLevel(this.configManager.get().developer.logger_level);

            this.syncManager = new SyncManager(this);

            const siteStyles = SITE_STYLES[this.platformDetails.platformId] || SITE_STYLES.chatgpt;
            this.uiManager = new UIManager(
                this.configManager.get(),
                (newConfig) => this.handleSave(newConfig),
                this.platformDetails,
                siteStyles,
                () => this.syncManager.onModalClose()
            );
            this.uiManager.init();
            // Call init for the settings panel instance
            if (this.uiManager.components.settingsPanel) {
                this.uiManager.components.settingsPanel.init();
            }
            this.syncManager.init();

            this.observerManager.init();
            this.observerManager.start();
        }

        destroy() {
            this.uiManager?.destroy();
            this.observerManager?.destroy();
            this.configManager?.destroy();
            this.syncManager?.destroy();
            this.subscriptions.forEach(({ event, key }) => EventBus.unsubscribe(event, key));
            this.subscriptions = [];
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
                Logger.error('Failed to save config:', err);
                throw err; // Re-throw the error for the UI layer to catch
            }
        }
    }

    // =================================================================================
    // SECTION: Entry Point
    // =================================================================================

    // Exit if already executed
    if (ExecutionGuard.hasExecuted()) return;
    // Set executed flag if not executed yet
    ExecutionGuard.setExecuted();

    // Singleton instance for observing internal DOM node insertions.
    const sentinel = new Sentinel(OWNERID);

    const platformDetails = PlatformAdapters.General.getPlatformDetails();
    if (platformDetails) {
        let isInitialized = false;

        const initApp = () => {
            if (isInitialized) return;
            isInitialized = true;

            Logger.badge('INIT', LOG_STYLES.GREEN, 'log', 'Target element detected. Initializing...');
            const app = new AppController();
            app.init();
        };

        sentinel.on(platformDetails.selectors.INPUT_TARGET, initApp);

        const existingElement = document.querySelector(platformDetails.selectors.INPUT_TARGET);
        if (existingElement) {
            Logger.badge('INIT', LOG_STYLES.GRAY, 'debug', 'Target already exists. Triggering immediate init.');
            initApp();
        }
    }
})();
