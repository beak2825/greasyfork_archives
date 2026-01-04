// ==UserScript==
// @name         Torn Spy Reports Manager
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @description  Automatically captures and manages spy reports for Army Generals. Displays collected intel on battle stats with smart merging of multiple spy attempts.
// @author       EvaKim [1770902]
// @license      MIT
// @match        *://www.torn.com/*
// @match        *://torn.com/*
// @grant        none
// @run-at       document-idle
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/544233/Torn%20Spy%20Reports%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/544233/Torn%20Spy%20Reports%20Manager.meta.js
// ==/UserScript==

/**
 * Torn Spy Reports Manager
 *
 * A userscript that automatically captures and manages spy reports for Army Generals.
 * Features intelligent merging of multiple spy attempts to build complete intelligence profiles.
 *
 * Architecture:
 * - Config: Application configuration and constants
 * - Utils: Utility functions (formatting, clipboard, etc.)
 * - Storage: LocalStorage management for reports and settings
 * - Modal: Custom modal dialog system
 * - ReportModel: Spy report data structure and operations
 * - ReportManager: Report CRUD operations and merging
 * - Parser: DOM parsing for spy report data extraction
 * - Exporter: Import/export functionality (JSON, Markdown)
 * - UI: User interface components and rendering
 * - App: Main application controller
 *
 * @author EvaKim [1770902]
 *
 * CHANGELOG:
 * ──────────────────────────────────────────────────────────────────────────────
 * 2025-12-10 - Major Rewrite
 *   ✦ Complete code rewrite with modular architecture
 *   ✦ Custom modal system replacing native browser dialogs
 *   ✦ Export/Import with choice modals (file download or clipboard)
 *   ✦ Discord-friendly markdown export with formatted stats
 *   ✦ Plain text export for simple chat sharing
 *   ✦ "Spy Again" button to quickly re-spy saved targets
 *   ✦ Hide/show reports toggle for better organization
 *   ✦ Auto-fill missing stat calculation (with sanity checks)
 *   ✦ Smart merging of multiple spy attempts
 *   ✦ Work stats tracking (END, INT, AGI)
 *   ✦ Copy name+ID to clipboard
 *   ✦ Responsive design for mobile
 *
 * v1.x.x (Previous versions)
 *   • Initial release with basic spy report capture
 *   • LocalStorage persistence
 *   • Basic export functionality
 * ──────────────────────────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    const Config = Object.freeze({
        // Storage keys
        STORAGE_KEY: 'torn_spy_reports',
        HIDDEN_REPORTS_KEY: 'torn_spy_hidden_reports',

        // Timing intervals (ms)
        MONITOR_INTERVAL: 1000,
        UI_UPDATE_DELAY: 500,
        COPY_FEEDBACK_DURATION: 1500,

        // Page paths
        JOBS_PATH: '/jobs.php',

        // Selectors
        SELECTORS: Object.freeze({
            SPY_CONTAINER: '.specials-confirm-cont',
            RANK_BENEFITS: '.rank-benefits',
            STAT_ELEMENTS: '.job-info li',
            NAME_LINK: 'a[href*="/profiles.php?XID="]',
            RANK_ELEMENT: '.job-info .desc.jrank',
        }),

        // Stat mappings for parsing
        STAT_MAPPINGS: Object.freeze({
            battle: {
                'strength': 'str',
                'defense': 'def',
                'speed': 'spd',
                'dexterity': 'dex',
                'total': 'total',
            },
            work: {
                'manual labor': 'end',
                'intelligence': 'int',
                'endurance': 'agi',
            },
        }),

        // Default stat structure
        DEFAULT_STATS: Object.freeze({
            battle: { str: 0, def: 0, spd: 0, dex: 0, total: 0 },
            work: { end: 0, int: 0, agi: 0 },
        }),
    });

    // ============================================================================
    // UTILITIES
    // ============================================================================

    const Utils = {
        /**
         * Formats a timestamp into a human-readable "time ago" string
         * @param {number} timestamp - Timestamp in milliseconds
         * @returns {string} Formatted time ago string
         */
        formatTimeAgo(timestamp) {
            const now = Date.now();
            const diffMs = now - timestamp;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffSeconds < 60) return `${diffSeconds} sec ago`;
            if (diffMinutes < 60) return `${diffMinutes} min ago`;
            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        },

        /**
         * Formats a number with locale-specific thousand separators
         * @param {number} num - Number to format
         * @returns {string} Formatted number string
         */
        formatNumber(num) {
            return (num || 0).toLocaleString();
        },

        /**
         * Formats a date for export display
         * @param {number} timestamp - Timestamp in milliseconds
         * @returns {string} Formatted date string
         */
        formatFullDate(timestamp) {
            return new Date(timestamp).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        },

        /**
         * Parses a stat value string to numeric
         * @param {string} value - Stat value string (e.g., "1,234,567")
         * @returns {number} Parsed numeric value
         */
        parseStatValue(value) {
            if (!value || value === 'N/A' || value.trim() === '') return null;
            return parseInt(value.replace(/,/g, ''), 10) || 0;
        },

        /**
         * Copies text to clipboard with fallback for older browsers
         * @param {string} text - Text to copy
         * @returns {Promise<boolean>} Success status
         */
        async copyToClipboard(text) {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (err) {
                    console.error('Clipboard API failed:', err);
                }
            }

            // Fallback to execCommand
            return this.fallbackCopyToClipboard(text);
        },

        /**
         * Fallback clipboard copy using execCommand
         * @param {string} text - Text to copy
         * @returns {boolean} Success status
         */
        fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.cssText = 'position:fixed;left:-999999px;top:-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                console.error('Fallback copy failed:', err);
                document.body.removeChild(textArea);
                return false;
            }
        },

        /**
         * Debounces a function call
         * @param {Function} func - Function to debounce
         * @param {number} wait - Wait time in ms
         * @returns {Function} Debounced function
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Safely queries a DOM element
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element (default: document)
         * @returns {Element|null} Found element or null
         */
        $(selector, context = document) {
            return context.querySelector(selector);
        },

        /**
         * Safely queries all matching DOM elements
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element (default: document)
         * @returns {NodeList} Found elements
         */
        $$(selector, context = document) {
            return context.querySelectorAll(selector);
        },
    };

    // ============================================================================
    // MODAL MANAGER
    // ============================================================================

    const Modal = {
        /** Modal container element */
        _container: null,

        /**
         * Initializes the modal container
         * @private
         */
        _init() {
            if (this._container) return;

            const html = `
                <div id="spy-modal-overlay" class="spy-modal-overlay">
                    <div class="spy-modal">
                        <div class="spy-modal-header">
                            <span class="spy-modal-title"></span>
                            <button class="spy-modal-close">&times;</button>
                        </div>
                        <div class="spy-modal-body">
                            <p class="spy-modal-message"></p>
                            <textarea class="spy-modal-input" rows="4" placeholder=""></textarea>
                        </div>
                        <div class="spy-modal-footer"></div>
                    </div>
                </div>
                ${this._getStyles()}
            `;

            document.body.insertAdjacentHTML('beforeend', html);
            this._container = Utils.$('#spy-modal-overlay');
        },

        /**
         * Gets modal styles
         * @private
         */
        _getStyles() {
            return `
                <style id="spy-modal-styles">
                    .spy-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.7);
                        display: none;
                        justify-content: center;
                        align-items: center;
                        z-index: 999999;
                        backdrop-filter: blur(2px);
                    }

                    .spy-modal-overlay.active {
                        display: flex;
                    }

                    .spy-modal {
                        background: #1a1a1a;
                        border: 1px solid #333;
                        border-radius: 8px;
                        min-width: 320px;
                        max-width: 500px;
                        width: 90%;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                        animation: spy-modal-appear 0.2s ease-out;
                    }

                    @keyframes spy-modal-appear {
                        from {
                            opacity: 0;
                            transform: scale(0.9) translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    .spy-modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        border-bottom: 1px solid #333;
                        background: #222;
                        border-radius: 8px 8px 0 0;
                    }

                    .spy-modal-title {
                        font-weight: bold;
                        color: #fff;
                        font-size: 14px;
                    }

                    .spy-modal-close {
                        background: none;
                        border: none;
                        color: #888;
                        font-size: 20px;
                        cursor: pointer;
                        padding: 0 4px;
                        line-height: 1;
                        transition: color 0.2s;
                    }

                    .spy-modal-close:hover {
                        color: #f44336;
                    }

                    .spy-modal-body {
                        padding: 16px;
                    }

                    .spy-modal-message {
                        color: #ccc;
                        font-size: 13px;
                        line-height: 1.5;
                        margin: 0 0 12px 0;
                        white-space: pre-wrap;
                    }

                    .spy-modal-input {
                        width: 100%;
                        background: #111;
                        border: 1px solid #444;
                        border-radius: 4px;
                        color: #fff;
                        font-family: monospace;
                        font-size: 12px;
                        padding: 10px;
                        resize: vertical;
                        box-sizing: border-box;
                    }

                    .spy-modal-input:focus {
                        outline: none;
                        border-color: #2196f3;
                    }

                    .spy-modal-input::placeholder {
                        color: #666;
                    }

                    .spy-modal-input.hidden {
                        display: none;
                    }

                    .spy-modal-footer {
                        display: flex;
                        justify-content: flex-end;
                        gap: 8px;
                        padding: 12px 16px;
                        border-top: 1px solid #333;
                        background: #1e1e1e;
                        border-radius: 0 0 8px 8px;
                    }

                    .spy-modal-btn {
                        padding: 8px 16px;
                        font-size: 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        border: 1px solid;
                        font-weight: 500;
                        transition: all 0.2s;
                    }

                    /* Default button style */
                    .spy-modal-btn {
                        background: #2196f3;
                        border-color: #1976d2;
                        color: white;
                    }

                    .spy-modal-btn:hover {
                        background: #1976d2;
                    }

                    /* Cancel/secondary button */
                    .spy-modal-btn.cancel {
                        background: transparent;
                        border-color: #555;
                        color: #aaa;
                    }

                    .spy-modal-btn.cancel:hover {
                        background: #333;
                        color: #fff;
                    }

                    /* Danger button */
                    .spy-modal-btn.danger {
                        background: #f44336;
                        border-color: #d32f2f;
                    }

                    .spy-modal-btn.danger:hover {
                        background: #d32f2f;
                    }

                    /* Success button */
                    .spy-modal-btn.success {
                        background: #4caf50;
                        border-color: #45a049;
                    }

                    .spy-modal-btn.success:hover {
                        background: #45a049;
                    }
                </style>
            `;
        },

        /**
         * Shows the modal
         * @private
         */
        _show(options) {
            this._init();

            const {
                title = 'Spy Reports Manager',
                message = '',
                placeholder = '',
                showInput = false,
                showClose = true,
                buttons = [{ text: 'OK', value: true, class: '' }],
                defaultValue = '',
            } = options;

            // Set content
            Utils.$('.spy-modal-title', this._container).textContent = title;
            Utils.$('.spy-modal-message', this._container).textContent = message;

            const input = Utils.$('.spy-modal-input', this._container);
            input.classList.toggle('hidden', !showInput);
            input.placeholder = placeholder;
            input.value = defaultValue;

            const closeBtn = Utils.$('.spy-modal-close', this._container);
            closeBtn.style.display = showClose ? 'block' : 'none';

            // Build footer buttons dynamically
            const footer = Utils.$('.spy-modal-footer', this._container);
            footer.innerHTML = buttons.map((btn, i) =>
                `<button class="spy-modal-btn ${btn.class || ''}" data-index="${i}">${btn.text}</button>`
            ).join('');

            // Show modal
            this._container.classList.add('active');

            // Focus first button or input
            setTimeout(() => {
                if (showInput) {
                    input.focus();
                    input.select();
                } else {
                    const firstBtn = Utils.$('.spy-modal-btn', footer);
                    firstBtn?.focus();
                }
            }, 50);

            return new Promise((resolve) => {
                const cleanup = () => {
                    this._container.classList.remove('active');
                    footer.removeEventListener('click', handleButtonClick);
                    if (showClose) closeBtn.removeEventListener('click', handleClose);
                    document.removeEventListener('keydown', handleKeydown);
                };

                const handleButtonClick = (e) => {
                    const btn = e.target.closest('.spy-modal-btn');
                    if (!btn) return;
                    const index = parseInt(btn.dataset.index, 10);
                    cleanup();
                    if (showInput && buttons[index].value !== null) {
                        resolve(input.value);
                    } else {
                        resolve(buttons[index].value);
                    }
                };

                const handleClose = () => {
                    cleanup();
                    resolve(null);
                };

                const handleKeydown = (e) => {
                    if (e.key === 'Escape' && showClose) handleClose();
                    if (e.key === 'Enter' && !showInput) {
                        // Trigger first non-cancel button
                        const primaryBtn = buttons.find(b => b.value !== null && b.value !== false);
                        if (primaryBtn) {
                            cleanup();
                            resolve(primaryBtn.value);
                        }
                    }
                    if (e.key === 'Enter' && showInput && e.ctrlKey) {
                        cleanup();
                        resolve(input.value);
                    }
                };

                footer.addEventListener('click', handleButtonClick);
                if (showClose) closeBtn.addEventListener('click', handleClose);
                document.addEventListener('keydown', handleKeydown);
            });
        },

        /**
         * Shows an alert modal (OK only)
         * @param {string} message - Message to display
         * @param {string} title - Modal title
         * @returns {Promise<boolean>} Always resolves to true
         */
        alert(message, title = 'Spy Reports Manager') {
            return this._show({
                title,
                message,
                showInput: false,
                showClose: false,
                buttons: [{ text: 'OK', value: true, class: '' }],
            });
        },

        /**
         * Shows a confirm modal (OK/Cancel)
         * @param {string} message - Message to display
         * @param {Object} options - Additional options
         * @returns {Promise<boolean>} True if confirmed, false otherwise
         */
        confirm(message, options = {}) {
            const { title = 'Confirm', danger = false } = options;
            return this._show({
                title,
                message,
                showInput: false,
                showClose: false,
                buttons: [
                    { text: 'Cancel', value: false, class: 'cancel' },
                    { text: danger ? 'Delete' : 'Confirm', value: true, class: danger ? 'danger' : '' },
                ],
            });
        },

        /**
         * Shows a choice modal with custom buttons
         * @param {string} message - Message to display
         * @param {Object} options - Options including choices array
         * @returns {Promise<string|null>} The value of the selected choice, or null if closed
         */
        choice(message, options = {}) {
            const { title = 'Choose', choices = [] } = options;
            const buttons = choices.map(c => ({
                text: c.text,
                value: c.value,
                class: c.class || '',
            }));
            return this._show({
                title,
                message,
                showInput: false,
                showClose: true,
                buttons,
            });
        },

        /**
         * Shows a prompt modal with text input
         * @param {string} message - Message to display
         * @param {Object} options - Additional options
         * @returns {Promise<string|null>} Input value or null if cancelled
         */
        prompt(message, options = {}) {
            const { title = 'Input', placeholder = '', defaultValue = '' } = options;
            return this._show({
                title,
                message,
                showInput: true,
                showClose: false,
                buttons: [
                    { text: 'Cancel', value: null, class: 'cancel' },
                    { text: 'Submit', value: true, class: 'success' },
                ],
                placeholder,
                defaultValue,
            });
        },

        /**
         * Shows a success message
         * @param {string} message - Message to display
         * @param {string} title - Modal title
         * @returns {Promise<boolean>}
         */
        success(message, title = 'Success') {
            return this._show({
                title,
                message,
                showInput: false,
                showClose: false,
                buttons: [{ text: 'OK', value: true, class: 'success' }],
            });
        },
    };

    // ============================================================================
    // STORAGE MANAGER
    // ============================================================================

    const Storage = {
        /**
         * Gets data from localStorage with error handling
         * @param {string} key - Storage key
         * @param {*} defaultValue - Default value if not found
         * @returns {*} Parsed data or default value
         */
        get(key, defaultValue = {}) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : defaultValue;
            } catch (error) {
                console.error(`Error reading ${key} from localStorage:`, error);
                return defaultValue;
            }
        },

        /**
         * Sets data in localStorage with error handling
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @returns {boolean} Success status
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error(`Error saving ${key} to localStorage:`, error);
                return false;
            }
        },

        /**
         * Removes data from localStorage
         * @param {string} key - Storage key
         * @returns {boolean} Success status
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Error removing ${key} from localStorage:`, error);
                return false;
            }
        },

        // Spy Reports specific methods
        getReports() {
            return this.get(Config.STORAGE_KEY, {});
        },

        saveReports(reports) {
            return this.set(Config.STORAGE_KEY, reports);
        },

        getHiddenReports() {
            return this.get(Config.HIDDEN_REPORTS_KEY, []);
        },

        saveHiddenReports(hidden) {
            return this.set(Config.HIDDEN_REPORTS_KEY, hidden);
        },

        clearAllReports() {
            this.remove(Config.STORAGE_KEY);
            this.remove(Config.HIDDEN_REPORTS_KEY);
        },
    };

    // ============================================================================
    // REPORT MODEL
    // ============================================================================

    const ReportModel = {
        /**
         * Creates a new spy report object
         * @param {Object} params - Report parameters
         * @returns {Object} Formatted spy report
         */
        create({ id, username, battlestats = {}, workstats = {} }) {
            return {
                id: String(id),
                username: String(username),
                battlestats: {
                    str: battlestats.str || 0,
                    def: battlestats.def || 0,
                    spd: battlestats.spd || 0,
                    dex: battlestats.dex || 0,
                    total: battlestats.total || 0,
                },
                workstats: {
                    end: workstats.end || 0,
                    int: workstats.int || 0,
                    agi: workstats.agi || 0,
                },
                timestamp: Date.now(),
            };
        },

        /**
         * Merges two reports, keeping the best available data
         * @param {Object} existing - Existing report
         * @param {Object} incoming - New report data
         * @param {Set} revealedStats - Set of stats revealed in new spy
         * @returns {Object} Merged report
         */
        merge(existing, incoming, revealedStats = new Set()) {
            const mergedBattle = { ...existing.battlestats };
            const mergedWork = { ...existing.workstats };

            // Update only revealed battle stats
            ['str', 'def', 'spd', 'dex', 'total'].forEach((stat) => {
                if (revealedStats.has(stat) && incoming.battlestats[stat] > 0) {
                    mergedBattle[stat] = incoming.battlestats[stat];
                }
            });

            // Update only revealed work stats
            ['end', 'int', 'agi'].forEach((stat) => {
                if (revealedStats.has(stat) && incoming.workstats[stat] > 0) {
                    mergedWork[stat] = incoming.workstats[stat];
                }
            });

            return this.create({
                id: incoming.id,
                username: incoming.username,
                battlestats: mergedBattle,
                workstats: mergedWork,
            });
        },

        /**
         * Calculates auto-fillable missing stat if possible
         * Also validates data consistency and clears invalid totals
         * @param {Object} stats - Battle stats object
         * @returns {Object} Stats with auto-filled value and indicator
         */
        autoFillMissingStat(stats) {
            const result = { ...stats };
            let autoFilledStat = null;

            const statKeys = ['str', 'def', 'spd', 'dex'];
            const nonZero = statKeys.filter((k) => result[k] > 0);
            const zero = statKeys.filter((k) => result[k] === 0);
            const sumKnown = nonZero.reduce((sum, k) => sum + result[k], 0);

            // Validate: if we have a total and known stats, check consistency
            // Total should always be >= sum of known stats
            if (result.total > 0 && sumKnown > result.total) {
                // Data is inconsistent - total is less than sum of parts
                // This means the total is stale/wrong, clear it
                result.total = 0;
            }

            // Case 1: One individual stat missing, total known
            // We can calculate: missing = total - sum(known stats)
            if (zero.length === 1 && result.total > 0) {
                const missingStat = zero[0];
                const calculated = result.total - sumKnown;

                // Only auto-fill if result is positive and makes sense
                if (calculated > 0 && calculated < result.total) {
                    result[missingStat] = calculated;
                    autoFilledStat = missingStat;
                }
            }
            // Case 2: Total missing or cleared, all individual stats known
            // We can calculate: total = sum(all stats)
            else if (nonZero.length === 4 && result.total === 0) {
                result.total = statKeys.reduce((sum, k) => sum + result[k], 0);
                autoFilledStat = 'total';
            }

            return { stats: result, autoFilledStat };
        },
    };

    // ============================================================================
    // REPORT MANAGER
    // ============================================================================

    const ReportManager = {
        /**
         * Gets all spy reports
         * @returns {Object} All reports keyed by username
         */
        getAll() {
            return Storage.getReports();
        },

        /**
         * Gets a specific user's report
         * @param {string} username - Username to lookup
         * @returns {Object|null} User's report or null
         */
        get(username) {
            const reports = this.getAll();
            return reports[username] || null;
        },

        /**
         * Adds or updates a spy report
         * @param {Object} report - Report to add/update
         * @param {Set} revealedStats - Stats revealed in this spy
         * @returns {Object} Updated reports
         */
        addOrUpdate(report, revealedStats = new Set()) {
            const reports = this.getAll();
            const existing = reports[report.username];

            if (existing && Object.keys(existing).length > 0) {
                reports[report.username] = ReportModel.merge(existing, report, revealedStats);
            } else {
                reports[report.username] = report;
            }

            Storage.saveReports(reports);
            return reports;
        },

        /**
         * Deletes a user's report
         * @param {string} username - Username to delete
         */
        delete(username) {
            const reports = this.getAll();
            const report = reports[username];

            // Also remove from hidden list
            if (report?.id) {
                const hidden = Storage.getHiddenReports();
                const idx = hidden.indexOf(report.id);
                if (idx > -1) {
                    hidden.splice(idx, 1);
                    Storage.saveHiddenReports(hidden);
                }
            }

            delete reports[username];
            Storage.saveReports(reports);
        },

        /**
         * Clears all reports
         */
        clearAll() {
            Storage.clearAllReports();
        },

        /**
         * Checks if a report is hidden
         * @param {string} userId - User ID to check
         * @returns {boolean} Hidden status
         */
        isHidden(userId) {
            return Storage.getHiddenReports().includes(userId);
        },

        /**
         * Toggles report visibility
         * @param {string} userId - User ID to toggle
         * @returns {boolean} New visibility state (true = visible)
         */
        toggleVisibility(userId) {
            const hidden = Storage.getHiddenReports();
            const idx = hidden.indexOf(userId);

            if (idx > -1) {
                hidden.splice(idx, 1);
            } else {
                hidden.push(userId);
            }

            Storage.saveHiddenReports(hidden);
            return idx > -1; // Return true if now visible
        },

        /**
         * Gets visible reports (not hidden)
         * @returns {Object} Visible reports keyed by username
         */
        getVisible() {
            const all = this.getAll();
            const hidden = Storage.getHiddenReports();

            return Object.fromEntries(
                Object.entries(all).filter(([_, report]) => !hidden.includes(report.id))
            );
        },

        /**
         * Imports reports from JSON data
         * @param {Object} importedData - Data to import
         * @returns {Object} Import statistics { newCount, mergeCount }
         */
        import(importedData) {
            const existing = this.getAll();
            let newCount = 0;
            let mergeCount = 0;

            for (const [username, imported] of Object.entries(importedData)) {
                if (existing[username]) {
                    // Merge with existing
                    const existingTs = existing[username].timestamp || 0;
                    const importedTs = imported.timestamp || 0;
                    const useImported = importedTs > existingTs;

                    const merged = this._smartMerge(existing[username], imported, useImported);
                    merged.timestamp = Math.max(existingTs, importedTs);
                    existing[username] = merged;
                    mergeCount++;
                } else {
                    existing[username] = imported;
                    newCount++;
                }
            }

            Storage.saveReports(existing);
            return { newCount, mergeCount };
        },

        /**
         * Smart merge for import - combines best data from both reports
         * @private
         */
        _smartMerge(existing, imported, preferImported) {
            const mergedBattle = { ...existing.battlestats };
            const mergedWork = { ...existing.workstats };

            // Merge battle stats
            if (imported.battlestats) {
                ['str', 'def', 'spd', 'dex', 'total'].forEach((stat) => {
                    if (imported.battlestats[stat] > 0 && (mergedBattle[stat] === 0 || preferImported)) {
                        mergedBattle[stat] = imported.battlestats[stat];
                    }
                });
            }

            // Merge work stats
            if (imported.workstats) {
                ['end', 'int', 'agi'].forEach((stat) => {
                    if (imported.workstats[stat] > 0 && (mergedWork[stat] === 0 || preferImported)) {
                        mergedWork[stat] = imported.workstats[stat];
                    }
                });
            }

            return ReportModel.create({
                id: imported.id || existing.id,
                username: imported.username || existing.username,
                battlestats: mergedBattle,
                workstats: mergedWork,
            });
        },
    };

    // ============================================================================
    // SPY REPORT PARSER
    // ============================================================================

    const Parser = {
        /** Tracks last processed spy signature to avoid duplicates */
        _lastSignature: null,

        /**
         * Parses spy report data from the DOM
         * @returns {Object|null} Parsed report or null if none found
         */
        parse() {
            const container = Utils.$(Config.SELECTORS.SPY_CONTAINER);
            if (!container || container.style.display === 'none') return null;

            try {
                // Extract user info
                const userInfo = this._extractUserInfo(container);
                if (!userInfo) return null;

                // Extract stats
                const statElements = Utils.$$(Config.SELECTORS.STAT_ELEMENTS, container);
                const { battlestats, workstats, revealedStats, signature } = this._extractStats(statElements);

                // Create unique signature for deduplication
                const spySignature = `${userInfo.id}-${signature}`;
                if (container.dataset.lastProcessedSignature === spySignature) {
                    return null;
                }

                // Mark as processed
                container.dataset.lastProcessedSignature = spySignature;

                const report = ReportModel.create({
                    id: userInfo.id,
                    username: userInfo.username,
                    battlestats,
                    workstats,
                });

                return { report, revealedStats };
            } catch (error) {
                console.error('Error parsing spy report:', error);
                return null;
            }
        },

        /**
         * Extracts user info from the spy container
         * @private
         */
        _extractUserInfo(container) {
            const nameLink = Utils.$(Config.SELECTORS.NAME_LINK, container);
            if (!nameLink) return null;

            const nameText = nameLink.textContent.trim();
            const match = nameText.match(/^(.+?)\s*\[(\d+)\]$/);

            return match ? { username: match[1], id: match[2] } : null;
        },

        /**
         * Extracts stats from stat elements
         * @private
         */
        _extractStats(statElements) {
            const battlestats = { ...Config.DEFAULT_STATS.battle };
            const workstats = { ...Config.DEFAULT_STATS.work };
            const revealedStats = new Set();
            let signature = '';

            for (const li of statElements) {
                const boldSpan = Utils.$('.bold', li);
                const descSpan = Utils.$('.desc', li);
                if (!boldSpan || !descSpan) continue;

                const statName = boldSpan.textContent.toLowerCase().trim().replace(':', '');
                const statValue = descSpan.textContent.trim();
                const numValue = Utils.parseStatValue(statValue);

                if (numValue === null) continue;

                signature += `${statName}:${statValue}|`;

                // Map to battle stat
                const battleKey = Config.STAT_MAPPINGS.battle[statName];
                if (battleKey) {
                    battlestats[battleKey] = numValue;
                    revealedStats.add(battleKey);
                    continue;
                }

                // Map to work stat
                const workKey = Config.STAT_MAPPINGS.work[statName];
                if (workKey) {
                    workstats[workKey] = numValue;
                    revealedStats.add(workKey);
                }
            }

            return { battlestats, workstats, revealedStats, signature };
        },
    };

    // ============================================================================
    // EXPORT MANAGER
    // ============================================================================

    const Exporter = {
        /**
         * Exports reports as JSON (file download or clipboard)
         */
        async exportJSON() {
            const reports = ReportManager.getAll();
            const count = Object.keys(reports).length;

            if (count === 0) {
                await Modal.alert('No spy reports to export.');
                return;
            }

            const method = await Modal.choice(
                `Export ${count} spy report${count !== 1 ? 's' : ''} as JSON.\n\nChoose your export method:`,
                {
                    title: 'Export JSON',
                    choices: [
                        { text: '📋 Copy to Clipboard', value: 'clipboard', class: '' },
                        { text: '💾 Download File', value: 'file', class: 'success' },
                    ],
                }
            );

            if (!method) return;

            const dataStr = JSON.stringify(reports, null, 2);

            if (method === 'file') {
                this._downloadFile(dataStr, 'application/json', `torn_spy_reports_${this._dateStamp()}.json`);
                await Modal.success('JSON file downloaded!', 'Export Complete');
            } else {
                const success = await Utils.copyToClipboard(dataStr);
                await (success
                    ? Modal.success('JSON copied to clipboard!', 'Copied')
                    : Modal.alert('Failed to copy to clipboard.'));
            }
        },

        /**
         * Exports visible reports as Discord-friendly markdown
         */
        async exportMarkdown() {
            const reports = ReportManager.getVisible();
            const count = Object.keys(reports).length;

            if (count === 0) {
                await Modal.alert('No visible spy reports to export.\n\nHidden reports are excluded from markdown export.');
                return;
            }

            const markdown = this._generateMarkdown(reports);
            const success = await Utils.copyToClipboard(markdown);
            await (success
                ? Modal.success(`${count} report${count !== 1 ? 's' : ''} copied as Discord markdown!`, 'Copied')
                : Modal.alert('Failed to copy to clipboard.'));
        },

        /**
         * Exports visible reports as plain text (for simple chat)
         */
        async exportPlain() {
            const reports = ReportManager.getVisible();
            const count = Object.keys(reports).length;

            if (count === 0) {
                await Modal.alert('No visible spy reports to export.\n\nHidden reports are excluded from export.');
                return;
            }

            const plain = this._generatePlain(reports);
            const success = await Utils.copyToClipboard(plain);
            await (success
                ? Modal.success(`${count} report${count !== 1 ? 's' : ''} copied as plain text!`, 'Copied')
                : Modal.alert('Failed to copy to clipboard.'));
        },

        /**
         * Imports reports from file or clipboard
         */
        async importReports() {
            const method = await Modal.choice(
                'Import spy reports from a backup.\n\nChoose your import method:',
                {
                    title: 'Import Reports',
                    choices: [
                        { text: '📋 Paste from Clipboard', value: 'clipboard', class: '' },
                        { text: '📁 Upload File', value: 'file', class: 'success' },
                    ],
                }
            );

            if (!method) return; // Modal closed

            if (method === 'file') {
                this._importFromFile();
            } else {
                await this._importFromClipboard();
            }
        },

        /**
         * Downloads data as a file
         * @private
         */
        _downloadFile(data, type, filename) {
            const blob = new Blob([data], { type });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        /**
         * Gets current date stamp for filenames
         * @private
         */
        _dateStamp() {
            return new Date().toISOString().split('T')[0];
        },

        /**
         * Generates Discord-friendly markdown
         * @private
         */
        _generateMarkdown(reports) {
            const count = Object.keys(reports).length;
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
            });
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'UTC',
            });

            let md = `## 🕵️ Spy Intel Report\n`;
            md += `\`${count} target${count !== 1 ? 's' : ''}\` • ${dateStr} @ ${timeStr} UTC\n\n`;

            // Sort by total stats descending
            const sorted = Object.entries(reports).sort(
                (a, b) => (b[1].battlestats.total || 0) - (a[1].battlestats.total || 0)
            );

            for (const [username, report] of sorted) {
                const { stats, autoFilledStat } = ReportModel.autoFillMissingStat(report.battlestats);

                // Format stat with padding for alignment in monospace
                const fmt = (v) => (v > 0 ? Utils.formatNumber(v) : '—');
                const fmtTotal = (v) => (v > 0 ? Utils.formatNumber(v) : '—');

                // Compact date format for Discord
                const date = new Date(report.timestamp);
                const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const shortTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                // Auto-calculated indicator
                const autoNote = autoFilledStat ? ' *(calc)*' : '';

                // Player header with link
                md += `**${username}** [${report.id}] • [View Profile](<https://www.torn.com/profiles.php?XID=${report.id}>)\n`;

                // Battle stats in code block for alignment
                md += '```\n';
                md += `STR  ${fmt(stats.str).padStart(12)}\n`;
                md += `DEF  ${fmt(stats.def).padStart(12)}\n`;
                md += `SPD  ${fmt(stats.spd).padStart(12)}\n`;
                md += `DEX  ${fmt(stats.dex).padStart(12)}\n`;
                md += `────────────────\n`;
                md += `TOTAL ${fmtTotal(stats.total).padStart(10)}${autoFilledStat ? ' *' : ''}\n`;
                md += '```\n\n';
            }

            // Footer note
            if (sorted.some(([_, r]) => ReportModel.autoFillMissingStat(r.battlestats).autoFilledStat)) {
                md += `\\* = auto-calculated from total\n`;
            }

            return md.trim();
        },

        /**
         * Generates plain text format for simple chat
         * @private
         */
        _generatePlain(reports) {
            const lines = [];

            // Sort by total stats descending
            const sorted = Object.entries(reports).sort(
                (a, b) => (b[1].battlestats.total || 0) - (a[1].battlestats.total || 0)
            );

            for (const [username, report] of sorted) {
                const { stats } = ReportModel.autoFillMissingStat(report.battlestats);
                const fmt = (v) => (v > 0 ? Utils.formatNumber(v) : '?');

                lines.push(`${username} [${report.id}]`);
                lines.push(`STR: ${fmt(stats.str)} | DEF: ${fmt(stats.def)} | SPD: ${fmt(stats.spd)} | DEX: ${fmt(stats.dex)}`);
                lines.push(`Total: ${fmt(stats.total)}`);
                lines.push(''); // Empty line between reports
            }

            return lines.join('\n').trim();
        },

        /**
         * Imports from file upload
         * @private
         */
        _importFromFile() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (ev) => this._processImport(ev.target.result, 'file');
                reader.readAsText(file);
            };
            input.click();
        },

        /**
         * Imports from clipboard
         * @private
         */
        async _importFromClipboard() {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    const text = await navigator.clipboard.readText();
                    if (!text.trim()) {
                        await Modal.alert('Clipboard is empty.');
                        return;
                    }
                    await this._processImport(text, 'clipboard');
                } else {
                    const text = await Modal.prompt('Please paste your JSON data here:', {
                        title: 'Import Data',
                        placeholder: 'Paste JSON data...',
                    });
                    if (text) await this._processImport(text, 'clipboard');
                }
            } catch (err) {
                console.error('Clipboard read failed:', err);
                const text = await Modal.prompt('Clipboard access failed. Please paste your JSON data here:', {
                    title: 'Import Data',
                    placeholder: 'Paste JSON data...',
                });
                if (text) await this._processImport(text, 'clipboard');
            }
        },

        /**
         * Processes imported data
         * @private
         */
        async _processImport(dataText, source) {
            try {
                const data = JSON.parse(dataText);

                if (typeof data !== 'object' || data === null) {
                    throw new Error('Invalid data format');
                }

                const { newCount, mergeCount } = ReportManager.import(data);

                // Refresh UI if on jobs page
                if (window.location.pathname === Config.JOBS_PATH) {
                    setTimeout(() => UI.render(), Config.UI_UPDATE_DELAY);
                }

                await Modal.success(
                    `Spy reports imported from ${source}!\n\n` +
                    `${newCount} new reports added\n` +
                    `${mergeCount} existing reports merged`,
                    'Import Complete'
                );
            } catch (error) {
                console.error('Import error:', error);
                await Modal.alert(`Failed to import from ${source}.\n\nError: ${error.message}`, 'Import Error');
            }
        },
    };

    // ============================================================================
    // USER INTERFACE
    // ============================================================================

    const UI = {
        /** Card element reference */
        _card: null,

        /**
         * Renders the spy reports card
         */
        render() {
            // Remove existing card
            this._card?.remove();

            // Find insertion point
            const rankBenefits = Utils.$(Config.SELECTORS.RANK_BENEFITS);
            if (!rankBenefits) return;

            // Create and insert card
            const cardHTML = this._buildCardHTML();
            rankBenefits.insertAdjacentHTML('afterend', cardHTML);

            // Cache reference and bind events
            this._card = Utils.$('.spy-reports-card');
            this._bindEvents();
        },

        /**
         * Updates timer displays
         */
        updateTimers() {
            const timers = Utils.$$('.spy-timer');
            timers.forEach((el) => {
                const ts = parseInt(el.dataset.timestamp, 10);
                if (ts) el.textContent = `(${Utils.formatTimeAgo(ts)})`;
            });
        },

        /**
         * Builds the card HTML
         * @private
         */
        _buildCardHTML() {
            const reports = ReportManager.getAll();
            const reportsHTML = this._buildReportsHTML(reports);

            return `
                ${this._getStyles()}
                <div class="rank-benefits m-top10 spy-reports-card">
                    <div class="job-list-title title-black top-round">
                        <div class="rank left" role="heading" aria-level="5">Spy Report(s)</div>
                        <div class="right">
                            ${this._buildButton('export-plain', 'PLAIN', '#9e9e9e', '#757575', 'Copy visible reports as plain text')}
                            ${this._buildButton('export-markdown', 'MARKDOWN', '#ff9800', '#f57c00', 'Copy visible reports as markdown')}
                            ${this._buildButton('export-json', 'EXPORT', '#4caf50', '#45a049', 'Export spy reports to file')}
                            ${this._buildButton('import-reports', 'IMPORT', '#2196f3', '#1976d2', 'Import spy reports')}
                            ${this._buildButton('clear-reports', 'CLEAR', '#f44336', '#d32f2f', 'Clear all spy reports')}
                        </div>
                        <div class="clear"></div>
                    </div>
                    <ul class="job-list spy-reports cont-gray bottom-round">
                        ${reportsHTML}
                    </ul>
                </div>
            `;
        },

        /**
         * Builds a button element
         * @private
         */
        _buildButton(id, text, bg, border, title) {
            return `<button id="${id}-btn" class="spy-action-btn" style="background:${bg};border-color:${border}" title="${title}">${text}</button>`;
        },

        /**
         * Builds HTML for all reports
         * @private
         */
        _buildReportsHTML(reports) {
            const entries = Object.entries(reports);

            if (entries.length === 0) {
                return `<li class="spy-empty">No spy reports available</li>`;
            }

            return entries.map(([username, report]) => this._buildReportRow(username, report)).join('');
        },

        /**
         * Builds HTML for a single report row
         * @private
         */
        _buildReportRow(username, report) {
            if (!report?.battlestats) return '';

            const { stats, autoFilledStat } = ReportModel.autoFillMissingStat(report.battlestats);
            const isHidden = ReportManager.isHidden(report.id);
            const hiddenClass = isHidden ? ' hidden' : '';

            const buildStat = (name, value) => {
                const isAuto = autoFilledStat === name;
                const style = isAuto ? ' style="opacity:0.6"' : '';
                const title = isAuto ? ' title="Auto-calculated"' : '';
                return `<span${style}${title}>${name.toUpperCase()}: ${Utils.formatNumber(value)}</span>`;
            };

            return `
                <li class="spy-report-row${hiddenClass}" data-username="${username}" data-userid="${report.id}">
                    <div class="spy-report-entry">
                        <div class="spy-report-header">
                            <div class="spy-report-info">
                                <a class="t-blue h" href="/profiles.php?XID=${report.id}" title="View profile">
                                    ${report.username} [${report.id}]
                                </a>
                                <button class="spy-copy-btn" data-fullname="${report.username} [${report.id}]" title="Copy name with ID">📋</button>
                                <span class="spy-timer" data-timestamp="${report.timestamp}">(${Utils.formatTimeAgo(report.timestamp)})</span>
                            </div>
                            <div class="spy-report-actions">
                                <button class="spy-again-btn" data-userid="${report.id}" data-username="${report.username}" title="Spy on this target again">🔍</button>
                                <button class="spy-visibility-btn" data-userid="${report.id}" data-username="${username}" title="${isHidden ? 'Show' : 'Hide'} report">
                                    ${isHidden ? '👁️‍🗨️' : '👁️'}
                                </button>
                                <button class="spy-delete-btn" data-userid="${report.id}" data-username="${username}" title="Delete report">🗑️</button>
                            </div>
                        </div>
                        <div class="spy-report-stats">
                            <div class="battle-stats">
                                ${buildStat('str', stats.str)}
                                ${buildStat('def', stats.def)}
                                ${buildStat('spd', stats.spd)}
                                ${buildStat('dex', stats.dex)}
                                <strong>${buildStat('total', stats.total)}</strong>
                            </div>
                            <div class="work-stats">
                                <span>END: ${Utils.formatNumber(report.workstats.end)}</span>
                                <span>INT: ${Utils.formatNumber(report.workstats.int)}</span>
                                <span>AGI: ${Utils.formatNumber(report.workstats.agi)}</span>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        },

        /**
         * Binds event listeners
         * @private
         */
        _bindEvents() {
            // Action buttons
            Utils.$('#export-plain-btn')?.addEventListener('click', () => Exporter.exportPlain());
            Utils.$('#export-markdown-btn')?.addEventListener('click', () => Exporter.exportMarkdown());
            Utils.$('#export-json-btn')?.addEventListener('click', () => Exporter.exportJSON());
            Utils.$('#import-reports-btn')?.addEventListener('click', () => Exporter.importReports());
            Utils.$('#clear-reports-btn')?.addEventListener('click', () => this._handleClearAll());

            // Delegate events for report rows
            this._card?.addEventListener('click', (e) => {
                const target = e.target;

                if (target.closest('.spy-copy-btn')) {
                    this._handleCopy(target.closest('.spy-copy-btn'));
                } else if (target.closest('.spy-again-btn')) {
                    this._handleSpyAgain(target.closest('.spy-again-btn'));
                } else if (target.closest('.spy-visibility-btn')) {
                    this._handleToggleVisibility(target.closest('.spy-visibility-btn'));
                } else if (target.closest('.spy-delete-btn')) {
                    this._handleDelete(target.closest('.spy-delete-btn'));
                }
            });
        },

        /**
         * Handles copy button click
         * @private
         */
        async _handleCopy(btn) {
            const fullName = btn.dataset.fullname;
            if (!fullName) return;

            const success = await Utils.copyToClipboard(fullName);
            if (success) {
                const original = btn.textContent;
                btn.textContent = '✓';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = original;
                    btn.classList.remove('copied');
                }, Config.COPY_FEEDBACK_DURATION);
            }
        },

        /**
         * Handles spy again button click
         * @private
         */
        async _handleSpyAgain(btn) {
            const { userid, username } = btn.dataset;
            if (!userid) return;

            // Find the spy form elements on the page
            const specialsForm = Utils.$('form[name="jobspecial"]');
            const spyRadio = Utils.$('input#spy[name="special"]'); // Hire a spy radio (id="spy", value="spy")

            if (!specialsForm || !spyRadio) {
                await Modal.alert(
                    'Unable to find the spy form on this page.\n\n' +
                    'Make sure you are on the Jobs page and have the spy special available.',
                    'Spy Unavailable'
                );
                return;
            }

            // Check if spy radio is disabled (not enough army points)
            if (spyRadio.disabled) {
                await Modal.alert(
                    'The spy option is currently unavailable.\n\n' +
                    'You may not have enough army points or cash.',
                    'Spy Unavailable'
                );
                return;
            }

            // Confirm the action
            const confirmed = await Modal.confirm(
                `Spy on ${username} [${userid}]?\n\n` +
                'This will use 10 army points and $5,000.',
                { title: 'Confirm Spy' }
            );

            if (!confirmed) return;

            // Select the spy option
            spyRadio.checked = true;
            spyRadio.dispatchEvent(new Event('change', { bubbles: true }));
            spyRadio.dispatchEvent(new Event('click', { bubbles: true }));

            // Click "Do Special" button to load the spy form
            const doSpecialBtn = Utils.$('.specials-cont-wrap button.torn-btn');
            if (doSpecialBtn) {
                doSpecialBtn.click();
            }

            // Wait for the spy input form to appear (it loads via AJAX)
            this._waitForSpyForm(userid, 0);
        },

        /**
         * Waits for the spy form to load and fills in the user ID
         * @private
         */
        _waitForSpyForm(userid, attempts) {
            const maxAttempts = 20; // 20 * 250ms = 5 seconds max wait
            
            // Look for the autocomplete input that appears after "Do Special" is clicked
            // The form has input[name="ID"] for the autocomplete search
            const spyInput = Utils.$('.act.error-wrap input[name="ID"]') || 
                            Utils.$('input.ac-search[name="ID"]') ||
                            Utils.$('input[name="userID"]');
            
            if (spyInput) {
                // Found the input, fill it with the user ID
                spyInput.value = userid;
                spyInput.dispatchEvent(new Event('input', { bubbles: true }));
                spyInput.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Focus and blur to trigger any validation
                spyInput.focus();
                
                // Wait a bit then click the submit button
                setTimeout(() => {
                    const submitBtn = Utils.$('.act.error-wrap input.torn-btn[type="submit"]') ||
                                     Utils.$('.act input.torn-btn[type="submit"]') ||
                                     Utils.$('.specials-cont-wrap input.torn-btn[type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                    }
                }, 300);
                return;
            }

            // Form not ready yet, try again
            if (attempts < maxAttempts) {
                setTimeout(() => this._waitForSpyForm(userid, attempts + 1), 250);
            } else {
                console.error('Spy form did not appear after waiting');
                Modal.alert(
                    'The spy form did not load in time.\n\n' +
                    'Please try manually or refresh the page.',
                    'Timeout'
                );
            }
        },

        /**
         * Handles visibility toggle
         * @private
         */
        _handleToggleVisibility(btn) {
            const userId = btn.dataset.userid;
            const row = Utils.$(`.spy-report-row[data-userid="${userId}"]`);

            if (!row || !userId) return;

            const isNowVisible = ReportManager.toggleVisibility(userId);

            row.classList.toggle('hidden', !isNowVisible);
            btn.textContent = isNowVisible ? '👁️' : '👁️‍🗨️';
            btn.title = isNowVisible ? 'Hide report' : 'Show report';
        },

        /**
         * Handles delete button click
         * @private
         */
        async _handleDelete(btn) {
            const { userid, username } = btn.dataset;

            const confirmed = await Modal.confirm(
                `Delete spy report for ${username} [${userid}]?\n\nThis cannot be undone.`,
                { title: 'Delete Report', danger: true }
            );

            if (!confirmed) return;

            ReportManager.delete(username);
            Utils.$(`.spy-report-row[data-userid="${userid}"]`)?.remove();

            // Show placeholder if no reports left
            if (Utils.$$('.spy-report-row').length === 0) {
                setTimeout(() => this.render(), 100);
            }
        },

        /**
         * Handles clear all button
         * @private
         */
        async _handleClearAll() {
            const count = Object.keys(ReportManager.getAll()).length;

            if (count === 0) {
                await Modal.alert('No spy reports to clear.');
                return;
            }

            const confirmed = await Modal.confirm(
                `Delete ALL ${count} spy reports?\n\nThis cannot be undone.`,
                { title: 'Clear All Reports', danger: true }
            );

            if (confirmed) {
                ReportManager.clearAll();
                this.render();
                await Modal.success('All spy reports cleared.', 'Cleared');
            }
        },

        /**
         * Gets component styles
         * @private
         */
        _getStyles() {
            return `
                <style>
                    /* Card Layout */
                    .spy-reports-card .job-list-title {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        width: 100%;
                        position: relative;
                    }

                    .spy-reports-card .job-list-title .right {
                        position: absolute;
                        top: 50%;
                        right: 15px;
                        transform: translateY(-50%);
                        display: flex;
                        gap: 5px;
                        align-items: center;
                    }

                    /* Action Buttons */
                    .spy-action-btn {
                        padding: 2px 6px;
                        font-size: 10px;
                        color: white;
                        border: 1px solid;
                        border-radius: 2px;
                        cursor: pointer;
                        font-family: Arial, sans-serif;
                        transition: opacity 0.2s;
                    }

                    .spy-action-btn:hover {
                        opacity: 0.85;
                    }

                    /* Report Rows */
                    .spy-report-row {
                        padding: 12px 15px;
                        border-bottom: 1px solid #333;
                        transition: opacity 0.3s, filter 0.3s;
                    }

                    .spy-report-row.hidden {
                        opacity: 0.3;
                        filter: grayscale(100%);
                    }

                    .spy-report-row.hidden .spy-report-stats {
                        display: none;
                    }

                    .spy-report-row.hidden .spy-report-header {
                        margin-bottom: 0;
                    }

                    /* Report Header */
                    .spy-report-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                        flex-wrap: wrap;
                        gap: 8px;
                    }

                    .spy-report-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex-wrap: wrap;
                    }

                    .spy-report-actions {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }

                    /* Stats Display */
                    .spy-report-stats {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 5px;
                    }

                    .battle-stats {
                        display: flex;
                        gap: 15px;
                        flex-wrap: wrap;
                    }

                    .work-stats {
                        display: flex;
                        gap: 15px;
                        font-size: 11px;
                        color: #999;
                        flex-wrap: wrap;
                    }

                    /* Icon Buttons */
                    .spy-copy-btn,
                    .spy-visibility-btn,
                    .spy-delete-btn {
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 2px 5px;
                        border-radius: 3px;
                        transition: background-color 0.2s;
                    }

                    .spy-copy-btn {
                        color: #888;
                        font-size: 11px;
                    }

                    .spy-copy-btn:hover,
                    .spy-copy-btn.copied {
                        background-color: rgba(76, 175, 80, 0.1);
                        color: #4caf50;
                    }

                    .spy-visibility-btn {
                        color: #999;
                        font-size: 14px;
                    }

                    .spy-visibility-btn:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }

                    .spy-again-btn {
                        color: #2196f3;
                        font-size: 13px;
                    }

                    .spy-again-btn:hover {
                        background-color: rgba(33, 150, 243, 0.1);
                        color: #42a5f5;
                    }

                    .spy-delete-btn {
                        color: #f44336;
                        font-size: 12px;
                    }

                    .spy-delete-btn:hover {
                        background-color: rgba(244, 67, 54, 0.1);
                        color: #ff5252;
                    }

                    /* Timer */
                    .spy-timer {
                        font-size: 10px;
                        color: #888;
                        font-style: italic;
                    }

                    /* Empty State */
                    .spy-empty {
                        padding: 12px 15px;
                        text-align: center;
                        color: #666;
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .spy-reports-card .job-list-title {
                            padding: 6px 10px;
                        }

                        .spy-reports-card .job-list-title .right {
                            right: 10px;
                            gap: 3px;
                        }

                        .spy-action-btn {
                            font-size: 8px;
                            padding: 2px 4px;
                        }

                        .battle-stats,
                        .work-stats {
                            font-size: 10px;
                            gap: 8px;
                        }

                        .spy-timer {
                            font-size: 9px;
                        }

                        .spy-report-row {
                            padding: 10px 8px;
                        }
                    }
                </style>
            `;
        },
    };

    // ============================================================================
    // APPLICATION CONTROLLER
    // ============================================================================

    const App = {
        /** Current page path for change detection */
        _currentPath: window.location.pathname,

        /**
         * Initializes the application
         */
        init() {
            this._checkSpyAvailability();
            this._startMonitoring();
        },

        /**
         * Checks if spy functionality is available
         * @private
         */
        _checkSpyAvailability() {
            if (window.location.pathname !== Config.JOBS_PATH) return;

            const pageText = document.body.textContent || '';
            const hasArmy = pageText.includes('You currently work in the Army');
            const hasSpy = pageText.includes('Hire a spy');

            const rankEl = Utils.$(Config.SELECTORS.RANK_ELEMENT);
            const hasGeneral = rankEl?.textContent.trim() === 'General';

            if (hasArmy && hasGeneral && hasSpy) {
                setTimeout(() => UI.render(), Config.UI_UPDATE_DELAY * 2);
            }
        },

        /**
         * Starts the monitoring loop
         * @private
         */
        _startMonitoring() {
            setInterval(() => {
                // Monitor for new spy reports
                this._checkForSpyReport();

                // Update timers on jobs page
                if (window.location.pathname === Config.JOBS_PATH) {
                    UI.updateTimers();
                }

                // Handle page navigation
                if (window.location.pathname !== this._currentPath) {
                    this._currentPath = window.location.pathname;
                    setTimeout(() => this._checkSpyAvailability(), Config.UI_UPDATE_DELAY * 2);
                }
            }, Config.MONITOR_INTERVAL);
        },

        /**
         * Checks for and processes new spy reports
         * @private
         */
        _checkForSpyReport() {
            const result = Parser.parse();
            if (!result) return;

            const { report, revealedStats } = result;
            ReportManager.addOrUpdate(report, revealedStats);
            console.log('Spy report saved for:', report.username);

            // Update UI if on jobs page
            if (window.location.pathname === Config.JOBS_PATH) {
                setTimeout(() => UI.render(), Config.UI_UPDATE_DELAY);
            }
        },
    };

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    App.init();
})();
