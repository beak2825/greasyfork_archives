// ==UserScript==
// @name         Milky Way Idle - Loot Drops Overlay
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Displays combat loot drops in a draggable overlay with column layout
// @author       Kjay
// @license      MIT License
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531859/Milky%20Way%20Idle%20-%20Loot%20Drops%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/531859/Milky%20Way%20Idle%20-%20Loot%20Drops%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        CONTAINER_ID: 'milt-loot-drops-display',
        TOOLTIP_ID: 'milt-loot-drops-tooltip',
        DEFAULT_POS: { top: '120px', right: '30px' },
        STORAGE: {
            position: 'lootDropsPosition',
            hidden: 'lootDropsHidden',
            sort: 'lootDropsSortPref',
            startHidden: 'lootDropsStartHidden',
            sessionHistory: 'lootDropsSessionHistory'
        },
        PANEL_WIDTH_EXPANDED: '380px',
        PANEL_MAX_HEIGHT: '70vh',
        PLAYER_COLUMN_MIN_WIDTH: '160px',
        USERNAME_SELECTOR: ".CharacterName_name__1amXp[data-name]",
        SEARCH_DEBOUNCE_MS: 250,
        HISTORY_LIMIT: 40,
        DISPLAY_HISTORY_LIMIT: 10,
        INJECTION_FLAG: 'lootDropsInjected'
    };

    function readSessionHistory() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE.sessionHistory);
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.start && item.key) : [];
        } catch (e) { console.error("LDT: Error reading session history", e); return []; }
    }

    function writeSessionHistory(history) {
        try {
            let historyString = JSON.stringify(history);
            while (historyString.length > 4.0 * 1024 * 1024 && history.length > 0) {
                 history.shift();
                 historyString = JSON.stringify(history);
            }
            localStorage.setItem(CONFIG.STORAGE.sessionHistory, historyString);
        } catch (e) {
            console.error("LDT: Error writing session history", e);
            if (e.name === 'QuotaExceededError' && history.length > 0) {
                 history.shift();
                 try {
                     localStorage.setItem(CONFIG.STORAGE.sessionHistory, JSON.stringify(history));
                 } catch (e2) {
                     console.error("LDT: Failed to write history even after trimming.", e2);
                 }
            }
        }
    }

    function generateSessionKey(playerNames, startTimeString) {
        if (!playerNames || playerNames.length === 0 || !startTimeString) return null;
        const sortedNames = [...playerNames].sort().join(',');
        return `${sortedNames}@${startTimeString}`;
    }

    function formatLocationName(actionHrid) {
        if (!actionHrid || !actionHrid.startsWith('/actions/combat/')) {
            return 'Unknown Location';
        }
        return actionHrid.replace('/actions/combat/', '')
                         .replace(/_/g, ' ')
                         .split(' ')
                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                         .join(' ');
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func.apply(this, args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    class LootDropsTracker {
        constructor() {
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                return;
            }

            this.userName = null;
            this.playerDropStats = {};
            this.sessionHistory = readSessionHistory();
            this.viewingLive = true;
            this.startHiddenEnabled = localStorage.getItem(CONFIG.STORAGE.startHidden) === 'true';
            this.isHidden = this.startHiddenEnabled || localStorage.getItem(CONFIG.STORAGE.hidden) === 'true';
            this.isMoving = false;
            this.moveOffset = { x: 0, y: 0 };
            this.initialRight = 0;
            this.initialClientX = 0;
            this.domRefs = {
                panel: null, header: null, content: null, showButton: null, hideButton: null,
                exportButton: null, tooltip: null, timerDisplay: null, sortButton: null, searchInput: null,
                settingsButton: null, settingsMenu: null, startHiddenCheckbox: null,
                clearButton: null,
                historySelect: null,
                headerTopRow: null, headerControls: null, headerBottomRow: null
            };
            this.startTime = null;
            this.sessionEndTime = null;
            this.lastKnownActionHrid = null;
            this.timerInterval = null;
            this.isLiveSessionActive = false;
            this.sortPreference = localStorage.getItem(CONFIG.STORAGE.sort) || 'count';
            this.currentSearchTerm = '';
            this.currentSessionKey = null;
            this.isSettingsMenuVisible = false;
            this.aggregatedHistoryData = null;
            this.aggregatedHistoryDuration = 0;
            this.debouncedRender = debounce(this.renderCurrentView, CONFIG.SEARCH_DEBOUNCE_MS);
            this.init();
        }

        init() {
            this.injectCss();
            this.createPanel();
            this.setInitialCheckboxState();
            this.createTooltipElement();
            this.findUserName();
            this.bindUiEvents();
            this.setupFeedListener();
             if (!this.isHidden) {
                 this.renderCurrentView();
                 this.updateTimerDisplay();
             }
        }

        injectCss() {
            const styleId = `${CONFIG.CONTAINER_ID}-style`;
            if (document.getElementById(styleId)) return;

            const css = `
                #${CONFIG.CONTAINER_ID} {
                    --ldt-bg-primary: #333; --ldt-bg-header: #444; --ldt-bg-input: #222; --ldt-bg-hidden: #222; --ldt-bg-highlight: rgba(76, 175, 80, 0.18); --ldt-bg-settings-menu: #4a4a4a; --ldt-bg-select: #555; --ldt-bg-button-show: #4CAF50; --ldt-bg-button-show-hover: #5cb860; --ldt-bg-button-export: #0d6efd; --ldt-bg-button-export-border: #0b5ed7; --ldt-bg-button-hide: #6c757d; --ldt-bg-button-hide-border: #5c636a; --ldt-bg-button-sort: #7b4caf; --ldt-bg-button-sort-border: #6a3f9a; --ldt-bg-button-sort-hover: #8a5cb9; --ldt-bg-button-copied: #4CAF50; --ldt-bg-button-copied-border: #45a049; --ldt-bg-button-error: #f44336; --ldt-bg-button-error-border: #d32f2f; --ldt-bg-button-settings: #555; --ldt-bg-button-settings-border: #444; --ldt-bg-button-clear: #dc3545; --ldt-bg-button-clear-border: #b02a37;
                    --ldt-text-primary: #eee; --ldt-text-secondary: #bbb; --ldt-text-header: #fff; --ldt-text-button: #eee; --ldt-text-button-dark-bg: #fff; --ldt-text-player-current: #4CAF50; --ldt-text-player-other: #ddd; --ldt-text-select: #eee;
                    --ldt-border-primary: #555; --ldt-border-separator: #555; --ldt-border-header-bottom: #555; --ldt-border-item-dotted: #666; --ldt-border-item-dashed: #555; --ldt-border-settings-menu: #666; --ldt-border-select: #777;
                    --ldt-font-size-base: 13px; --ldt-font-size-small: 0.9em; --ldt-font-size-smaller: 0.85em; --ldt-font-size-large: 1.1em;
                    --ldt-radius: 5px; --ldt-radius-small: 3px;
                    --ldt-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); --ldt-transition-duration: 0.25s; --ldt-transition-timing: ease-out;
                }
                #${CONFIG.CONTAINER_ID} { position: fixed; background-color: var(--ldt-bg-primary); color: var(--ldt-text-primary); font-family: sans-serif; font-size: var(--ldt-font-size-base); border: 1px solid var(--ldt-border-primary); border-radius: var(--ldt-radius); z-index: 99997; user-select: none; box-shadow: var(--ldt-shadow); display: flex; flex-direction: column; overflow: hidden; transition: width var(--ldt-transition-duration) var(--ldt-transition-timing), height var(--ldt-transition-duration) var(--ldt-transition-timing), min-width var(--ldt-transition-duration) var(--ldt-transition-timing), opacity var(--ldt-transition-duration) var(--ldt-transition-timing); box-sizing: border-box; cursor: default; }
                #${CONFIG.CONTAINER_ID}:not(.is-hidden) { width: auto; min-width: ${CONFIG.PANEL_WIDTH_EXPANDED}; height: auto; max-height: ${CONFIG.PANEL_MAX_HEIGHT}; opacity: 1; }
                #${CONFIG.CONTAINER_ID}:not(.is-hidden) .hidden-state-only { display: none; }
                #${CONFIG.CONTAINER_ID}:not(.is-hidden) .visible-state-only { display: flex; }
                #${CONFIG.CONTAINER_ID}.is-hidden { width: auto; height: auto; min-width: 0; background: var(--ldt-bg-hidden); border-radius: var(--ldt-radius); padding: 4px 8px; cursor: move !important; flex-direction: row; align-items: center; opacity: 0.95; overflow: visible; max-height: none; }
                #${CONFIG.CONTAINER_ID}.is-hidden:hover { opacity: 1; }
                #${CONFIG.CONTAINER_ID}.is-hidden .visible-state-only { display: none; }
                #${CONFIG.CONTAINER_ID}.is-hidden .hidden-state-only { display: inline-flex; align-items: center; gap: 5px; }
                #${CONFIG.CONTAINER_ID}.is-hidden .ldt-hide-label { font-weight: normal; color: var(--ldt-text-primary); font-size: 1em; cursor: move; user-select: none; }
                #${CONFIG.CONTAINER_ID}.is-hidden .ldt-show-btn { background-color: var(--ldt-bg-button-show); color: var(--ldt-text-button-dark-bg); padding: 2px 5px; border-radius: var(--ldt-radius-small); text-decoration: none; font-size: var(--ldt-font-size-small); cursor: pointer; border: none; line-height: normal; vertical-align: middle; font-weight: normal; }
                #${CONFIG.CONTAINER_ID}.is-hidden .ldt-show-btn:hover { filter: brightness(1.1); background-color: var(--ldt-bg-button-show-hover); }
                .ldt-panel-header { flex-direction: column; padding: 5px 8px 8px 8px; background: var(--ldt-bg-header); border-bottom: 1px solid var(--ldt-border-header-bottom); flex-shrink: 0; user-select: none; }
                .ldt-header-top-row { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 5px; cursor: move; gap: 8px; }
                .ldt-panel-title-area { display: flex; align-items: center; gap: 6px; margin-right: auto; min-width: 0; }
                .ldt-panel-title { font-weight: bold; font-size: var(--ldt-font-size-large); color: var(--ldt-text-header); flex-shrink: 0; }
                .ldt-history-select { background-color: var(--ldt-bg-select); color: var(--ldt-text-select); border: 1px solid var(--ldt-border-select); border-radius: var(--ldt-radius-small); padding: 2px 4px; font-size: var(--ldt-font-size-smaller); max-width: 150px; cursor: pointer; flex-shrink: 1; }
                .ldt-history-select optgroup { font-style: italic; font-weight: bold; }
                .ldt-header-controls { position: relative; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
                .ldt-header-controls button { position: relative; border-radius: var(--ldt-radius-small); padding: 3px 7px; font-size: var(--ldt-font-size-small); font-weight: normal; cursor: pointer; transition: filter 0.15s, background-color 0.15s, border-color 0.15s, color 0.15s; font-family: inherit; line-height: 1.2; border: 1px solid var(--ldt-border-primary); color: var(--ldt-text-button); display: inline-flex; align-items: center; justify-content: center; }
                .ldt-header-controls button:hover { filter: brightness(1.15); }
                .ldt-clear-btn { background-color: var(--ldt-bg-button-clear); border-color: var(--ldt-bg-button-clear-border); color: var(--ldt-text-button-dark-bg); }
                .ldt-export-btn { background-color: var(--ldt-bg-button-export); border-color: var(--ldt-bg-button-export-border); color: var(--ldt-text-button-dark-bg); }
                .ldt-hide-btn { background-color: var(--ldt-bg-button-hide); border-color: var(--ldt-bg-button-hide-border); color: var(--ldt-text-button-dark-bg); }
                .ldt-btn-copied { background-color: var(--ldt-bg-button-copied) !important; border-color: var(--ldt-bg-button-copied-border) !important; color: var(--ldt-text-button-dark-bg) !important; }
                .ldt-btn-error { background-color: var(--ldt-bg-button-error) !important; border-color: var(--ldt-bg-button-error-border) !important; color: var(--ldt-text-button-dark-bg) !important; }
                .ldt-header-bottom-row { position: relative; display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 8px; }
                .ldt-search-input { background-color: var(--ldt-bg-input); color: var(--ldt-text-primary); border: 1px solid var(--ldt-border-primary); border-radius: var(--ldt-radius-small); padding: 3px 5px; font-size: var(--ldt-font-size-small); flex-grow: 1; min-width: 90px; max-width: 140px; cursor: text; }
                .ldt-settings-btn { background-color: var(--ldt-bg-button-settings); border-color: var(--ldt-bg-button-settings-border); color: var(--ldt-text-button); padding: 3px 5px; margin-left: auto; order: 1; }
                .ldt-settings-btn svg { width: 1em; height: 1em; fill: currentColor; display: block; }
                .ldt-sort-btn { background-color: var(--ldt-bg-button-sort); border-color: var(--ldt-bg-button-sort-border); color: var(--ldt-text-button); padding: 3px 7px; font-size: var(--ldt-font-size-smaller); flex-shrink: 0; order: 2; }
                .ldt-sort-btn:hover { filter: brightness(1.15); background-color: var(--ldt-bg-button-sort-hover); border-color: var(--ldt-bg-button-sort-border);}
                .ldt-timer { font-size: var(--ldt-font-size-small); color: var(--ldt-text-secondary); flex-shrink: 0; padding: 0 5px; white-space: nowrap; min-width: 85px; text-align: right; order: 3; }
                .ldt-settings-menu {display: none; position: absolute; top: 100%; left: 0; background-color: var(--ldt-bg-settings-menu); border: 1px solid var(--ldt-border-settings-menu); border-radius: var(--ldt-radius-small); padding: 8px; z-index: 10; box-shadow: 0 2px 5px rgba(0,0,0,0.3); margin-top: 4px; white-space: nowrap; }
                .ldt-settings-menu.visible { display: block; }
                .ldt-settings-menu label { display: flex; align-items: center; cursor: pointer; color: var(--ldt-text-primary); font-size: var(--ldt-font-size-small); }
                .ldt-settings-menu input[type="checkbox"] { margin-right: 6px; cursor: pointer; }
                .ldt-panel-body { display: flex; flex-direction: row; flex-grow: 1; overflow-y: auto; overflow-x: auto; background-color: var(--ldt-bg-primary); cursor: auto; padding: 0; }
                .ldt-body-empty { padding: 15px; text-align: center; color: var(--ldt-text-secondary); font-style: italic; width: 100%; line-height: 1.4; }
                .ldt-player-stats-section { flex: 1 1 auto; min-width: ${CONFIG.PLAYER_COLUMN_MIN_WIDTH}; padding: 8px 10px; box-sizing: border-box; }
                .ldt-player-stats-section:not(:first-child) { border-left: 1px solid var(--ldt-border-separator); padding-left: 10px; }
                .ldt-player-name-header { font-weight: bold; color: var(--ldt-text-player-other); background-color: transparent; padding: 4px 0 5px 0; margin-bottom: 5px; border-bottom: 1px dotted var(--ldt-border-item-dotted); font-size: 0.95em; }
                .ldt-player-name-header.is-current-player { color: var(--ldt-text-player-current); }
                .ldt-loot-list { padding: 0; list-style: none; margin: 0; }
                .ldt-loot-item-entry { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; padding: 2px 0px; font-size: 1em; border-bottom: 1px dashed var(--ldt-border-item-dashed); color: var(--ldt-text-primary); transition: background-color 0.2s linear; }
                .ldt-loot-item-entry:last-child { border-bottom: none; }
                .ldt-item-name { color: var(--ldt-text-primary); flex-grow: 1; margin-right: 10px; word-break: break-word; }
                .ldt-item-count { color: var(--ldt-text-primary); font-weight: normal; white-space: nowrap; }
                .ldt-loot-item-entry.highlight-match { background-color: var(--ldt-bg-highlight); }
                #${CONFIG.TOOLTIP_ID} { position: fixed; background-color: #222; color: #eee; padding: 4px 8px; font-size: 11px; border-radius: var(--ldt-radius-small); white-space: nowrap; opacity: 0; visibility: hidden; pointer-events: none; z-index: 100002; transition: opacity 0.2s ease-out, visibility 0s linear 0.2s; will-change: transform, opacity; }
                #${CONFIG.TOOLTIP_ID}.visible { opacity: 0.9; visibility: visible; transition: opacity 0.2s ease-out, visibility 0s linear 0s; }
            `;

            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }

        createPanel() {
             const panel = document.createElement('div');
             panel.id = CONFIG.CONTAINER_ID;
             this.domRefs.panel = panel;
             let savedPosition = {};
             try {
                savedPosition = JSON.parse(localStorage.getItem(CONFIG.STORAGE.position) || '{}');
             } catch (e) { console.error("LDT: Error parsing saved position", e); }
             panel.style.top = savedPosition.top || CONFIG.DEFAULT_POS.top;
             panel.style.right = savedPosition.right || CONFIG.DEFAULT_POS.right;
             if (this.isHidden) panel.classList.add('is-hidden');

             const settingsIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858z"/></svg>`;
             const clearIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;

             panel.innerHTML = `
                 <div class="hidden-state-only">
                     <span class="ldt-hide-label">Loot:</span>
                     <button class="ldt-show-btn" id="${CONFIG.CONTAINER_ID}-minbtn-minimized">Show</button>
                 </div>
                 <div class="visible-state-only ldt-panel-header" id="${CONFIG.CONTAINER_ID}-header">
                    <div class="ldt-header-top-row" id="${CONFIG.CONTAINER_ID}-header-top">
                        <div class="ldt-panel-title-area">
                            <span class="ldt-panel-title">Loot Drops</span>
                            <select class="ldt-history-select" id="${CONFIG.CONTAINER_ID}-history-select" title="View session history"></select>
                        </div>
                        <div class="ldt-header-controls" id="${CONFIG.CONTAINER_ID}-header-controls-top">
                            <button class="ldt-clear-btn" id="${CONFIG.CONTAINER_ID}-clearbtn" data-tooltip="Clear Your History">${clearIconSvg}</button>
                            <button class="ldt-export-btn" id="${CONFIG.CONTAINER_ID}-exportbtn" data-tooltip="Copy loot as CSV to clipboard">Export</button>
                            <button class="ldt-hide-btn" id="${CONFIG.CONTAINER_ID}-minbtn-expanded">Hide</button>
                        </div>
                    </div>
                    <div class="ldt-header-bottom-row" id="${CONFIG.CONTAINER_ID}-header-bottom">
                        <input type="text" class="ldt-search-input" id="${CONFIG.CONTAINER_ID}-search" placeholder="Highlight...">
                        <div class="ldt-header-controls" id="${CONFIG.CONTAINER_ID}-header-controls-bottom">
                            <button class="ldt-settings-btn" id="${CONFIG.CONTAINER_ID}-settingsbtn" data-tooltip="Settings">${settingsIconSvg}</button>
                             <div class="ldt-settings-menu" id="${CONFIG.CONTAINER_ID}-settings-menu">
                                <label>
                                    <input type="checkbox" id="${CONFIG.CONTAINER_ID}-starthidden-check"> Start Hidden
                                </label>
                            </div>
                            <button class="ldt-sort-btn" id="${CONFIG.CONTAINER_ID}-sortbtn">Sort: Count</button>
                            <span class="ldt-timer" id="${CONFIG.CONTAINER_ID}-timer">--:--:--</span>
                        </div>
                    </div>
                 </div>
                 <div class="visible-state-only ldt-panel-body" id="${CONFIG.CONTAINER_ID}-content"></div>
             `;
             document.body.appendChild(panel);

             Object.assign(this.domRefs, {
                panel: panel,
                header: panel.querySelector(`#${CONFIG.CONTAINER_ID}-header`),
                headerTopRow: panel.querySelector(`#${CONFIG.CONTAINER_ID}-header-top`),
                headerControls: panel.querySelector(`#${CONFIG.CONTAINER_ID}-header-controls-top`),
                headerBottomRow: panel.querySelector(`#${CONFIG.CONTAINER_ID}-header-bottom`),
                content: panel.querySelector(`#${CONFIG.CONTAINER_ID}-content`),
                showButton: panel.querySelector(`#${CONFIG.CONTAINER_ID}-minbtn-minimized`),
                hideButton: panel.querySelector(`#${CONFIG.CONTAINER_ID}-minbtn-expanded`),
                settingsButton: panel.querySelector(`#${CONFIG.CONTAINER_ID}-settingsbtn`),
                settingsMenu: panel.querySelector(`#${CONFIG.CONTAINER_ID}-settings-menu`),
                startHiddenCheckbox: panel.querySelector(`#${CONFIG.CONTAINER_ID}-starthidden-check`),
                historySelect: panel.querySelector(`#${CONFIG.CONTAINER_ID}-history-select`),
                clearButton: panel.querySelector(`#${CONFIG.CONTAINER_ID}-clearbtn`),
                exportButton: panel.querySelector(`#${CONFIG.CONTAINER_ID}-exportbtn`),
                timerDisplay: panel.querySelector(`#${CONFIG.CONTAINER_ID}-timer`),
                sortButton: panel.querySelector(`#${CONFIG.CONTAINER_ID}-sortbtn`),
                searchInput: panel.querySelector(`#${CONFIG.CONTAINER_ID}-search`)
             });

             this.updateSortButtonText();
        }

        aggregateSessionHistory() {
            if (!this.userName) {
                this.aggregatedHistoryData = {};
                this.aggregatedHistoryDuration = 0;
                return;
            }

            const aggregatedStats = {
                [this.userName]: { items: {} }
            };
            let totalDuration = 0;

            const allRelevantHistory = this.sessionHistory.filter(s =>
                s.key.split('@')[0].split(',').includes(this.userName)
            );

            const sortedRelevantHistory = allRelevantHistory.sort((a, b) => b.start - a.start);
            const sessionsToCombine = sortedRelevantHistory.slice(0, CONFIG.DISPLAY_HISTORY_LIMIT);

            sessionsToCombine.forEach(session => {
                totalDuration += session.duration || 0;
                if (session.stats && session.stats[this.userName] && session.stats[this.userName].items) {
                    Object.entries(session.stats[this.userName].items).forEach(([hrid, count]) => {
                        aggregatedStats[this.userName].items[hrid] = (aggregatedStats[this.userName].items[hrid] || 0) + count;
                    });
                }
            });

            const liveSessionHasData = this.userName &&
                                       this.playerDropStats[this.userName]?.items &&
                                       Object.keys(this.playerDropStats[this.userName].items).length > 0;

            if (liveSessionHasData && this.currentSessionKey) {
                 const liveSessionKey = this.currentSessionKey;
                 const liveSessionAlreadyIncluded = sessionsToCombine.some(s => s.key === liveSessionKey);

                 if (!liveSessionAlreadyIncluded) {
                     Object.entries(this.playerDropStats[this.userName].items).forEach(([hrid, count]) => {
                        aggregatedStats[this.userName].items[hrid] = (aggregatedStats[this.userName].items[hrid] || 0) + count;
                     });

                     if (this.startTime) {
                         const liveEndTime = this.sessionEndTime || Date.now();
                         const liveDuration = Math.max(0, liveEndTime - this.startTime.getTime());
                         totalDuration += liveDuration;
                     }
                 }
            }

            this.aggregatedHistoryData = aggregatedStats;
            this.aggregatedHistoryDuration = totalDuration;
        }

        updateHistoryDropdown() {
            if (!this.domRefs.historySelect || !this.userName) return;
            const select = this.domRefs.historySelect;
            const previousValue = select.value;
            select.innerHTML = '';

            const liveOption = document.createElement('option');
            liveOption.value = 'live';
            liveOption.textContent = 'Live Session';
            select.appendChild(liveOption);

            const relevantHistory = this.sessionHistory
                .filter(s => s.key.split('@')[0].split(',').includes(this.userName))
                .sort((a, b) => b.start - a.start)
                .slice(0, CONFIG.DISPLAY_HISTORY_LIMIT);

            if (relevantHistory.length > 0) {
                const historyGroup = document.createElement('optgroup');
                historyGroup.label = 'Past Sessions';

                relevantHistory.forEach((session) => {
                    const option = document.createElement('option');
                    option.value = session.key;
                    const startTime = new Date(session.start).toLocaleTimeString([], { hour: 'numeric', minute:'2-digit' });
                    const durationStr = this.formatElapsedTime(session.duration).replace(/^00:/, '');
                    option.textContent = `${startTime} (${durationStr})`;

                    const locationStr = session.location ? `Location: ${session.location}\n` : '';
                    const playersStr = `Players: ${session.key.split('@')[0] || '?'}\n`;
                    option.title = `${locationStr}${playersStr}Started: ${new Date(session.start).toLocaleString()}\nEnded: ${new Date(session.end).toLocaleString()}`;

                    historyGroup.appendChild(option);
                });
                select.appendChild(historyGroup);

                const combinedOption = document.createElement('option');
                combinedOption.value = 'combined';
                combinedOption.textContent = 'Combined History';
                select.appendChild(combinedOption);
            }

             if (select.querySelector(`option[value="${previousValue}"]`)) {
                 select.value = previousValue;
             } else {
                 select.value = 'live';
             }
             this.viewingLive = (select.value === 'live');
        }

        setInitialCheckboxState() {
             if (this.domRefs.startHiddenCheckbox) {
                 this.domRefs.startHiddenCheckbox.checked = this.startHiddenEnabled;
             }
         }

        createTooltipElement() {
            const tooltip = document.createElement('div');
            tooltip.id = CONFIG.TOOLTIP_ID;
            document.body.appendChild(tooltip);
            this.domRefs.tooltip = tooltip;
        }

        toggleVisibility() {
            this.isHidden = !this.isHidden;
            this.domRefs.panel.classList.toggle('is-hidden', this.isHidden);
            localStorage.setItem(CONFIG.STORAGE.hidden, String(this.isHidden));
            this.hideSettingsMenu();

            if (!this.isHidden) {
                 this.renderCurrentView();
                 this.updateTimerDisplay();
                 if (this.viewingLive && this.isLiveSessionActive) {
                     this.startTimer();
                 }
            } else {
                 this.stopTimer();
            }
        }

        updatePlayerStats(playerInfo) {
             const name = playerInfo.name;
             if (!name) return;

             if (!this.playerDropStats[name]) {
                 this.playerDropStats[name] = { items: {} };
             }
             const pStats = this.playerDropStats[name];
             const currentLootMap = playerInfo.totalLootMap || {};

             pStats.items = {};
             for (const key in currentLootMap) {
                const { itemHrid, count } = currentLootMap[key];
                 if (itemHrid && typeof count === 'number' && count > 0) {
                    pStats.items[itemHrid] = count;
                 }
             }
        }

        renderLootSections(dataSource) {
            if (!this.domRefs.content || this.isHidden) return;

            const playerNames = Object.keys(dataSource).sort((a, b) => {
                if (a === this.userName) return -1;
                if (b === this.userName) return 1;
                return a.localeCompare(b);
            });

            this.domRefs.content.innerHTML = '';

            if (playerNames.length === 0 || (this.isViewingCombined() && (!dataSource[this.userName] || Object.keys(dataSource[this.userName].items).length === 0))) {
                let message = 'No active combat session.<br><small style="color: var(--ldt-text-secondary);">If drops are happening but loot is not showing up here<br>Try refreshing the window<br><b>Browser</b>: F5 or Reload Button<br><b>Steam Client</b>: Top Menu > View > Reload</small>';
                if (this.viewingLive && this.isLiveSessionActive) {
                    message = 'Waiting for loot data...';
                } else if (this.viewingLive && !this.isLiveSessionActive && this.startTime) {
                    message = 'Session ended. No loot collected.';
                } else if (!this.viewingLive && !this.isViewingCombined()) {
                    message = 'No data in selected session for this character.';
                 } else if (this.isViewingCombined()) {
                     message = `No loot found for ${this.userName} in the combined history view.`;
                 }
                this.domRefs.content.innerHTML = `<div class="ldt-body-empty">${message}</div>`;
                return;
             }

            const fragment = document.createDocumentFragment();
            const searchTerm = this.currentSearchTerm.toLowerCase();

            playerNames.forEach(playerName => {
                if (this.isViewingCombined() && playerName !== this.userName) return;

                const pStats = dataSource[playerName];
                if (!pStats) return;
                const items = pStats.items;

                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'ldt-player-stats-section';

                const headerDiv = document.createElement('div');
                headerDiv.className = 'ldt-player-name-header';
                headerDiv.textContent = playerName;
                if (playerName === this.userName) {
                    headerDiv.classList.add('is-current-player');
                }

                const listDiv = document.createElement('ul');
                listDiv.className = 'ldt-loot-list';

                let sortedItems = Object.entries(items || {}).filter(([, count]) => count > 0);

                if (this.sortPreference === 'name') {
                    sortedItems.sort((a, b) => a[0].localeCompare(b[0]));
                } else {
                    sortedItems.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
                }

                if (sortedItems.length === 0) {
                    listDiv.innerHTML = `<li class="ldt-body-empty" style="font-size:var(--ldt-font-size-small); padding: 5px 0; color: var(--ldt-text-secondary);">No items collected.</li>`;
                } else {
                    sortedItems.forEach(([hrid, count]) => {
                        const name = hrid.replace("/items/", "").replace(/_/g, " ");
                        const itemLi = document.createElement('li');
                        itemLi.className = 'ldt-loot-item-entry';

                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'ldt-item-name';
                        nameSpan.textContent = name;

                        const countSpan = document.createElement('span');
                        countSpan.className = 'ldt-item-count';
                        countSpan.textContent = `× ${count}`;

                        if (searchTerm && name.toLowerCase().includes(searchTerm)) {
                            itemLi.classList.add('highlight-match');
                        }

                        itemLi.appendChild(nameSpan);
                        itemLi.appendChild(countSpan);
                        listDiv.appendChild(itemLi);
                    });
                }
                sectionDiv.appendChild(headerDiv);
                sectionDiv.appendChild(listDiv);
                fragment.appendChild(sectionDiv);
            });

            this.domRefs.content.appendChild(fragment);
        }

        renderCurrentView() {
            if (this.isHidden) return;

            const selectedValue = this.domRefs.historySelect?.value;

            if (this.viewingLive || selectedValue === 'live' || !selectedValue) {
                this.renderLootSections(this.playerDropStats);
            } else if (selectedValue === 'combined') {
                if (this.aggregatedHistoryData === null) {
                    this.aggregateSessionHistory();
                }
                this.renderLootSections(this.aggregatedHistoryData);
            } else {
                const selectedSession = this.sessionHistory.find(s => s.key === selectedValue);
                if (selectedSession && selectedSession.key.split('@')[0].split(',').includes(this.userName)) {
                    this.renderLootSections(selectedSession.stats);
                } else {
                     this.renderLootSections({});
                 }
            }
        }

        exportLootCsv() {
            let dataSource = {};
            let sourceDescription = "Unknown View";
            const selectedValue = this.domRefs.historySelect?.value;

            if (this.viewingLive || selectedValue === 'live') {
                dataSource = this.playerDropStats;
                sourceDescription = "Live / Last Session";
                 if (this.lastKnownActionHrid) {
                    sourceDescription += ` (${formatLocationName(this.lastKnownActionHrid)})`;
                 }
            } else if (selectedValue === 'combined') {
                 if (this.aggregatedHistoryData === null) this.aggregateSessionHistory();
                 dataSource = this.aggregatedHistoryData;
                 sourceDescription = `Combined History (${this.userName || 'Current User'})`;
            } else {
                 const selectedSession = this.sessionHistory.find(s => s.key === selectedValue);
                 if (selectedSession && selectedSession.key.split('@')[0].split(',').includes(this.userName)) {
                     dataSource = selectedSession.stats;
                     const startTimeStr = new Date(selectedSession.start).toLocaleTimeString([], { hour: 'numeric', minute:'2-digit' });
                     const locationStr = selectedSession.location ? ` - ${selectedSession.location}` : '';
                     sourceDescription = `Session @ ${startTimeStr}${locationStr}`;
                 } else {
                     this.flashExportButtonState('Error', 'ldt-btn-error', 2500);
                     return;
                 }
            }

            const playerNames = Object.keys(dataSource);
            const button = this.domRefs.exportButton;
            button.disabled = true;

            if (playerNames.length === 0 || (selectedValue === 'combined' && (!dataSource[this.userName] || Object.keys(dataSource[this.userName].items).length === 0))) {
                 this.flashExportButtonState('No Data', 'ldt-btn-error', 1500);
                 return;
            }

            let csvRows = [];
            let hasItems = false;
            playerNames.forEach(playerName => {
                 if (selectedValue === 'combined' && playerName !== this.userName) return;

                 const pStats = dataSource[playerName]; if (!pStats) return;
                 const items = pStats.items || {};
                 const sortedItems = Object.entries(items)
                    .filter(([, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

                 sortedItems.forEach(([hrid, count]) => {
                     const itemName = hrid.replace("/items/", "").replace(/_/g, " ");
                     const safePlayerName = `"${playerName.replace(/"/g, '""')}"`;
                     const safeItemName = `"${itemName.replace(/"/g, '""')}"`;
                     csvRows.push(`${safePlayerName},${safeItemName},${count}`);
                     hasItems = true;
                 });
            });

            if (!hasItems) {
                this.flashExportButtonState('No Items', 'ldt-btn-error', 1500);
                return;
            }

            const csvHeader = "Player,Item Name,Count\n";
            const csvContent = csvHeader + csvRows.join("\n");

            navigator.clipboard.writeText(csvContent).then(() => {
                this.flashExportButtonState('Copied!', 'ldt-btn-copied', 1800);
            }).catch(err => {
                console.error("LDT: Failed to copy CSV data to clipboard:", err);
                this.flashExportButtonState('Error', 'ldt-btn-error', 2500);
            });
        }

        flashExportButtonState(text, className, duration) {
            const button = this.domRefs.exportButton;
            if (!button) return;
            const originalText = button.textContent;
            const originalClasses = button.className;

            button.textContent = text;
            button.className = `ldt-export-btn ${className}`;

            setTimeout(() => {
                if (button) {
                   button.textContent = originalText;
                   button.className = originalClasses;
                   button.disabled = false;
                }
            }, duration);
        }

        bindUiEvents() {
            this.domRefs.headerTopRow.addEventListener('mousedown', (e) => {
                if (!this.isHidden && e.button === 0 && !e.target.closest('button, .ldt-settings-menu, .ldt-history-select, input')) {
                     this.startMove(e);
                 }
            });
            this.domRefs.panel.addEventListener('mousedown', (e) => {
                 if (this.isHidden && e.button === 0 && !e.target.closest('button')) {
                     this.startMove(e);
                 }
            });
            document.addEventListener('mousemove', this.movePanel.bind(this), { passive: true });
            document.addEventListener('mouseup', this.endMove.bind(this));

            this.domRefs.settingsButton.onclick = (e) => { e.stopPropagation(); this.toggleSettingsMenu(); };
            this.domRefs.clearButton.onclick = () => this.clearHistory();
            this.domRefs.exportButton.onclick = () => this.exportLootCsv();
            this.domRefs.showButton.onclick = () => this.toggleVisibility();
            this.domRefs.hideButton.onclick = () => this.toggleVisibility();
            this.domRefs.sortButton.onclick = () => this.cycleSortPreference();

            this.domRefs.startHiddenCheckbox.onchange = () => this.handleStartHiddenChange();
            this.domRefs.historySelect.onchange = () => this.handleHistorySelectionChange();
            this.domRefs.searchInput.addEventListener('input', (e) => {
                 this.currentSearchTerm = e.target.value.trim();
                 this.debouncedRender();
             });

             const tooltipElements = this.domRefs.panel.querySelectorAll('[data-tooltip]');
             tooltipElements.forEach(el => {
                 el.addEventListener('mouseenter', (e) => this.showTooltip(e));
                 el.addEventListener('mouseleave', () => this.hideTooltip());
             });

            document.addEventListener('click', this.handleClickOutsideMenu.bind(this));
            window.addEventListener("LootTrackerCombatEnded", (e) => this.handleSessionEnd(e.detail));
            window.addEventListener("LootTrackerBattle", (e) => this.processBattleUpdate(e.detail));
            window.addEventListener('storage', (e) => this.handleStorageChange(e));
        }

        clearHistory() {
             if (!this.userName) {
                 alert("Cannot clear history: User not identified yet.");
                 return;
             }
             if (window.confirm(`Are you sure you want to clear your session history for '${this.userName}'? Sessions involving only other players will remain. This cannot be undone.`)) {
                 let currentHistory = readSessionHistory();
                 const originalLength = currentHistory.length;
                 const filteredHistory = currentHistory.filter(s => !s.key.split('@')[0].split(',').includes(this.userName));
                 const removedCount = originalLength - filteredHistory.length;

                 if(removedCount > 0) {
                     writeSessionHistory(filteredHistory);
                     this.sessionHistory = filteredHistory;
                     this.aggregatedHistoryData = null;
                     this.updateHistoryDropdown();

                     if (!this.viewingLive) {
                         const selectedValue = this.domRefs.historySelect?.value;
                         if (selectedValue !== 'live' && selectedValue !== 'combined') {
                              if (!this.sessionHistory.some(s => s.key === selectedValue)) {
                                 if(this.domRefs.historySelect) this.domRefs.historySelect.value = 'live';
                                 this.handleHistorySelectionChange();
                              }
                         } else if (selectedValue === 'combined') {
                             this.aggregatedHistoryData = null;
                             if (!this.isHidden) this.renderCurrentView();
                             if (this.sessionHistory.length === 0) {
                                 const combinedOption = this.domRefs.historySelect?.querySelector('option[value="combined"]');
                                 if (combinedOption) combinedOption.remove();
                             }
                         } else {
                            this.renderCurrentView();
                         }
                     }
                 }
             }
        }

        handleHistorySelectionChange() {
            if (!this.domRefs.historySelect) return;

            const selectedValue = this.domRefs.historySelect.value;
            const wasViewingLive = this.viewingLive;

            const newViewingLive = (selectedValue === 'live');

            let viewCategoryChanged = false;
            if (newViewingLive !== wasViewingLive) {
                viewCategoryChanged = true;
            }

            this.viewingLive = newViewingLive;
            this.aggregatedHistoryData = null;

            if (viewCategoryChanged) {
                 if (this.viewingLive) {
                     if (this.isLiveSessionActive) this.startTimer();
                 } else {
                     this.stopTimer();
                 }
            }

            this.updateTimerDisplay();

            if (!this.isHidden) {
                 this.renderCurrentView();
            }
        }

        isViewingCombined() {
            return !this.viewingLive && this.domRefs.historySelect?.value === 'combined';
        }

        getCurrentHistoryViewItem() {
            if (this.viewingLive || this.isViewingCombined() || !this.userName) return null;
            const selectedValue = this.domRefs.historySelect?.value;
            if (!selectedValue || selectedValue === 'live' || selectedValue === 'combined') return null;
            const session = this.sessionHistory.find(s => s.key === selectedValue);
            if (session && session.key.split('@')[0].split(',').includes(this.userName)) {
                return session;
            }
            return null;
        }

        handleClickOutsideMenu(event) {
            if (!this.isSettingsMenuVisible) return;
            const isClickInsideMenu = this.domRefs.settingsMenu?.contains(event.target);
            const isClickOnButton = this.domRefs.settingsButton?.contains(event.target);

            if (!isClickInsideMenu && !isClickOnButton) {
                this.hideSettingsMenu();
            }
        }

        toggleSettingsMenu() {
             if (!this.domRefs.settingsMenu) return;
             this.isSettingsMenuVisible = !this.isSettingsMenuVisible;
             this.domRefs.settingsMenu.classList.toggle('visible', this.isSettingsMenuVisible);
         }

         hideSettingsMenu() {
             if (this.domRefs.settingsMenu) {
                 this.domRefs.settingsMenu.classList.remove('visible');
                 this.isSettingsMenuVisible = false;
             }
         }

         handleStartHiddenChange() {
             if (!this.domRefs.startHiddenCheckbox) return;
             this.startHiddenEnabled = this.domRefs.startHiddenCheckbox.checked;
             localStorage.setItem(CONFIG.STORAGE.startHidden, String(this.startHiddenEnabled));
         }

        showTooltip(event) {
            const targetButton = event.currentTarget;
            let tooltipText = targetButton.dataset.tooltip;

            if (targetButton === this.domRefs.sortButton) {
                tooltipText = `Click to sort by ${this.sortPreference === 'count' ? 'Name' : 'Count'}`;
            } else if (targetButton === this.domRefs.clearButton) {
                tooltipText = `Clear history for '${this.userName || '?'}'`;
                targetButton.dataset.tooltip = tooltipText;
            } else if (targetButton === this.domRefs.settingsButton && !tooltipText) {
                 tooltipText = "Settings";
                 targetButton.dataset.tooltip = tooltipText;
            }

            const tooltipElement = this.domRefs.tooltip;
            if (!tooltipText || !tooltipElement) return;

            tooltipElement.textContent = tooltipText;

            const btnRect = targetButton.getBoundingClientRect();
            tooltipElement.style.visibility = 'hidden';
            tooltipElement.style.display = 'block';
            const tooltipRect = tooltipElement.getBoundingClientRect();
            tooltipElement.style.display = '';
            tooltipElement.style.visibility = '';

            let top = btnRect.top - tooltipRect.height - 6;
            let left = btnRect.left + (btnRect.width / 2) - (tooltipRect.width / 2);

            if (top < 0) top = btnRect.bottom + 6;
            if (left < 5) left = 5;
            if (left + tooltipRect.width > window.innerWidth - 5) {
                left = window.innerWidth - tooltipRect.width - 5;
            }

            tooltipElement.style.top = `${top + window.scrollY}px`;
            tooltipElement.style.left = `${left + window.scrollX}px`;
            tooltipElement.classList.add('visible');
        }

        hideTooltip() {
            const tooltipElement = this.domRefs.tooltip;
            if (tooltipElement) tooltipElement.classList.remove('visible');
        }

        cycleSortPreference() {
            this.sortPreference = (this.sortPreference === 'count') ? 'name' : 'count';
            localStorage.setItem(CONFIG.STORAGE.sort, this.sortPreference);
            this.updateSortButtonText();
            this.renderCurrentView();
            this.hideTooltip();
        }

        updateSortButtonText() {
            if (this.domRefs.sortButton) {
                const sortMode = this.sortPreference.charAt(0).toUpperCase() + this.sortPreference.slice(1);
                this.domRefs.sortButton.textContent = `Sort: ${sortMode}`;
            }
        }

        processBattleUpdate(data) {
             if (!data || typeof data !== 'object' || !Array.isArray(data.players) || !data.combatStartTime) {
                 return;
             }
             if (!this.userName) this.findUserName();

             const playerNames = data.players.map(p => p?.name).filter(Boolean);
             const combatStartTimeString = data.combatStartTime;
             const newSessionKey = generateSessionKey(playerNames, combatStartTimeString);

             if (!newSessionKey) {
                 return;
             }

             let needsRender = false;
             let statsUpdated = false;

             if (newSessionKey !== this.currentSessionKey) {
                 if (this.isLiveSessionActive) {
                     this.saveCurrentSessionToHistory(this.lastKnownActionHrid);
                 }

                 this.playerDropStats = {};
                 this.currentSessionKey = newSessionKey;
                 this.isLiveSessionActive = true;
                 this.sessionEndTime = null;
                 this.lastKnownActionHrid = null;
                 this.aggregatedHistoryData = null;

                 try {
                     this.startTime = new Date(combatStartTimeString);
                 } catch (e) {
                     this.startTime = new Date();
                 }


                 statsUpdated = this.updatePlayerStatsFromEvent(data);
                 this.updateTimerDisplay();
                 if (!this.isHidden) this.startTimer();

                 if (!this.viewingLive) {
                     this.viewingLive = true;
                     if (this.domRefs.historySelect) this.domRefs.historySelect.value = 'live';
                     this.handleHistorySelectionChange();
                 } else {
                    needsRender = true;
                 }

             } else if (this.isLiveSessionActive) {
                 statsUpdated = this.updatePlayerStatsFromEvent(data);
                 if (statsUpdated) {
                     this.aggregatedHistoryData = null;
                 }
                 if (!this.timerInterval && !this.isHidden) this.startTimer();
                 if (this.viewingLive && statsUpdated && !this.isHidden) {
                     needsRender = true;
                 }
             }

             if (needsRender && !this.isHidden) {
                 if (this.viewingLive || this.isViewingCombined()) {
                    this.renderCurrentView();
                 }
             }
        }

        updatePlayerStatsFromEvent(data) {
            let updated = false;
             data.players.forEach(playerInfo => {
                 if (playerInfo?.name && typeof playerInfo.totalLootMap === 'object') {
                     this.updatePlayerStats(playerInfo);
                     updated = true;
                 }
             });
             return updated;
        }

        handleSessionEnd(detail) {
             const actionHrid = detail?.actionHrid;

             if (!this.isLiveSessionActive) {
                 return;
             }

             this.sessionEndTime = Date.now();
             this.isLiveSessionActive = false;
             this.lastKnownActionHrid = actionHrid;
             this.stopTimer();
             this.aggregatedHistoryData = null;

             this.saveCurrentSessionToHistory(actionHrid);

             if (this.viewingLive) {
                if (!this.isHidden) {
                    this.renderCurrentView();
                    this.updateTimerDisplay();
                }
             } else if (this.isViewingCombined()) {
                 if (!this.isHidden) this.renderCurrentView();
                 this.updateTimerDisplay();
             }
        }

        saveCurrentSessionToHistory(actionHrid) {
            if (!this.currentSessionKey || !this.startTime || !this.userName || !this.playerDropStats[this.userName]) {
                return;
            }

            const userItems = this.playerDropStats[this.userName].items || {};
            if (Object.keys(userItems).length === 0) {
                 return;
            }

            const endTime = this.sessionEndTime || Date.now();
            const duration = Math.max(0, endTime - this.startTime.getTime());

             if (duration < 5000 && !actionHrid?.includes('tutorial')) {
                 return;
             }

            let currentHistory = readSessionHistory();
            const existingSessionIndex = currentHistory.findIndex(s => s.key === this.currentSessionKey);

            if (existingSessionIndex === -1) {
                try {
                    const sessionLocation = formatLocationName(actionHrid);
                    const statsToSave = JSON.parse(JSON.stringify(this.playerDropStats));

                    const completedSession = {
                        key: this.currentSessionKey,
                        start: this.startTime.getTime(),
                        end: endTime,
                        duration: duration,
                        location: sessionLocation,
                        stats: statsToSave
                    };

                    currentHistory.push(completedSession);
                    currentHistory.sort((a, b) => b.start - a.start);
                    while (currentHistory.length > CONFIG.HISTORY_LIMIT) {
                        currentHistory.pop();
                    }

                    writeSessionHistory(currentHistory);
                    this.sessionHistory = currentHistory;
                    this.updateHistoryDropdown();
                } catch (e) {
                    console.error("LDT: Error creating or saving session JSON", e);
                }
            }
        }

        handleStorageChange(event) {
            if (event.key === CONFIG.STORAGE.startHidden && event.newValue !== null) {
                const newPref = event.newValue === 'true';
                if (newPref !== this.startHiddenEnabled) {
                    this.startHiddenEnabled = newPref;
                    this.setInitialCheckboxState();
                }
            }
             if (event.key === CONFIG.STORAGE.sort && event.newValue !== null) {
                 if (event.newValue !== this.sortPreference) {
                     this.sortPreference = event.newValue === 'name' ? 'name' : 'count';
                     this.updateSortButtonText();
                     if (!this.isHidden) this.renderCurrentView();
                 }
             }
             if (event.key === CONFIG.STORAGE.position && event.newValue !== null) {
                 try {
                     const newPos = JSON.parse(event.newValue);
                     if (newPos && newPos.top && newPos.right && this.domRefs.panel) {
                        if (this.domRefs.panel.style.top !== newPos.top || this.domRefs.panel.style.right !== newPos.right) {
                            this.domRefs.panel.style.top = newPos.top;
                            this.domRefs.panel.style.right = newPos.right;
                        }
                     }
                 } catch (e) { console.error("LDT: Error syncing position from storage", e); }
             }

            if (event.key === CONFIG.STORAGE.sessionHistory && event.newValue !== null) {
                const oldSelectedKey = this.domRefs.historySelect?.value;

                this.sessionHistory = readSessionHistory();
                this.aggregatedHistoryData = null;
                this.updateHistoryDropdown();

                if (!this.viewingLive && !this.isViewingCombined()) {
                    const currentViewStillExists = this.sessionHistory.some(s => s.key === oldSelectedKey);
                     if (!currentViewStillExists) {
                         if(this.domRefs.historySelect) this.domRefs.historySelect.value = 'live';
                         this.handleHistorySelectionChange();
                     }
                } else if (this.isViewingCombined()) {
                    if (!this.isHidden) this.renderCurrentView();
                     this.updateTimerDisplay();
                }
            }
        }

        startTimer() {
            this.stopTimer();
            if (!this.startTime || !this.viewingLive || !this.isLiveSessionActive || this.isHidden) {
                 this.updateTimerDisplay();
                 return;
            }

            this.updateTimerDisplay();
            this.timerInterval = setInterval(() => {
                 if (this.startTime && this.viewingLive && this.isLiveSessionActive && !this.isHidden) {
                     this.updateTimerDisplay();
                 } else {
                     this.stopTimer();
                     this.updateTimerDisplay();
                 }
             }, 1000);
        }

        stopTimer() {
            if (this.timerInterval) {
                 clearInterval(this.timerInterval);
                 this.timerInterval = null;
             }
        }

        updateTimerDisplay() {
            if (!this.domRefs.timerDisplay || this.isHidden) return;

            const selectedValue = this.domRefs.historySelect?.value;

            if (this.viewingLive || selectedValue === 'live') {
                if (!this.startTime) {
                    this.domRefs.timerDisplay.textContent = '--:--:--';
                } else if (!this.isLiveSessionActive && this.sessionEndTime) {
                    const duration = this.sessionEndTime - this.startTime.getTime();
                    this.domRefs.timerDisplay.textContent = `(${this.formatElapsedTime(duration)}) Ended`;
                } else if (this.isLiveSessionActive) {
                    const elapsedMs = Date.now() - this.startTime.getTime();
                    this.domRefs.timerDisplay.textContent = this.formatElapsedTime(elapsedMs);
                } else {
                     this.domRefs.timerDisplay.textContent = `(${this.formatElapsedTime(0)}) Waiting...`;
                }
            } else if (selectedValue === 'combined') {
                 if (this.aggregatedHistoryData === null) this.aggregateSessionHistory();
                 this.domRefs.timerDisplay.textContent = `(Σ ${this.formatElapsedTime(this.aggregatedHistoryDuration)})`;
            } else {
                 const selectedSession = this.getCurrentHistoryViewItem();
                 if (selectedSession) {
                     this.domRefs.timerDisplay.textContent = `(${this.formatElapsedTime(selectedSession.duration)})`;
                 } else {
                    this.domRefs.timerDisplay.textContent = '??:??:??';
                 }
            }
        }

        formatElapsedTime(ms) {
            if (ms === null || ms === undefined || ms < 0 || isNaN(ms)) ms = 0;
            let totalSeconds = Math.floor(ms / 1000);
            const days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            const hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            const hoursStr = String(hours).padStart(2, '0');
            const minutesStr = String(minutes).padStart(2, '0');
            const secondsStr = String(seconds).padStart(2, '0');

            if (days > 0) {
                return `${days}d ${hoursStr}:${minutesStr}:${secondsStr}`;
            } else {
                return `${hoursStr}:${minutesStr}:${secondsStr}`;
            }
        }

        startMove(event) {
             if (this.isMoving) return;
             this.isMoving = true;
             const panelRect = this.domRefs.panel.getBoundingClientRect();
             this.moveOffset.y = event.clientY - panelRect.top;
             this.initialRight = parseFloat(this.domRefs.panel.style.right || CONFIG.DEFAULT_POS.right);
             this.initialClientX = event.clientX;

             this.domRefs.panel.style.cursor = 'grabbing';
             this.domRefs.panel.style.transition = 'none';
             this.domRefs.panel.style.opacity = '0.88';
             this.domRefs.panel.style.willChange = 'top, right';
             event.preventDefault();
             event.stopPropagation();
             this.hideSettingsMenu();
        }

        movePanel(event) {
             if (!this.isMoving) return;
             const container = this.domRefs.panel;
             let newTop = event.clientY - this.moveOffset.y;
             const dx = event.clientX - this.initialClientX;
             let newRight = this.initialRight - dx;

             const winWidth = window.innerWidth;
             const winHeight = window.innerHeight;
             const rect = container.getBoundingClientRect();
             const overlayWidth = rect.width;
             const overlayHeight = rect.height;
             newTop = Math.max(0, Math.min(newTop, Math.max(0, winHeight - overlayHeight)));
             newRight = Math.max(0, Math.min(newRight, Math.max(0, winWidth - overlayWidth)));

             container.style.top = `${newTop}px`;
             container.style.right = `${newRight}px`;
             container.style.left = '';
        }

        endMove() {
             if (!this.isMoving) return;
             this.isMoving = false;
             this.domRefs.panel.style.cursor = '';
             this.domRefs.panel.style.transition = '';
             this.domRefs.panel.style.opacity = '';
             this.domRefs.panel.style.willChange = '';

             const finalTop = this.domRefs.panel.style.top;
             const finalRight = this.domRefs.panel.style.right;
             if (finalTop && finalTop.endsWith('px') && finalRight && finalRight.endsWith('px')) {
                 const position = { top: finalTop, right: finalRight };
                 try {
                     localStorage.setItem(CONFIG.STORAGE.position, JSON.stringify(position));
                 } catch (e) {
                     console.error("LDT: Failed to save panel position.", e);
                 }
             } else {
                 console.warn("LDT: Invalid final position values not saved.", { top: finalTop, right: finalRight });
             }
        }

        findUserName() {
            if (this.userName) return;
            const attemptFind = () => {
                const nameDiv = document.querySelector(CONFIG.USERNAME_SELECTOR);
                if (nameDiv && nameDiv.dataset.name) {
                    this.userName = nameDiv.dataset.name;
                    this.updateHistoryDropdown();
                    if (!this.isHidden) this.renderCurrentView();
                    this.aggregateHistoryData = null;
                } else {
                    setTimeout(attemptFind, 2000);
                }
            };
            attemptFind();
        }

        setupFeedListener() {
            const flag = CONFIG.INJECTION_FLAG;
            if (window[flag]) {
                return;
            }
            window[flag] = true;

            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    const flag = '${flag}';
                    const lootDropsWsKey = 'OriginalWebSocket_' + flag;

                    if (window[lootDropsWsKey]) {
                        return;
                    }
                    window[lootDropsWsKey] = window.WebSocket;

                    window.WebSocket = class LootDropsWebSocket extends window[lootDropsWsKey] {
                        constructor(...args) {
                            super(...args);
                            this._lootDropsListener = (event) => {
                                let data;
                                try {
                                    if (this.readyState !== 1 || typeof event.data !== 'string' || !event.data.startsWith('{')) return;
                                    data = JSON.parse(event.data);

                                    if (data?.type === "new_battle" && Array.isArray(data.players) && data.combatStartTime) {
                                        window.dispatchEvent(new CustomEvent("LootTrackerBattle", { detail: data }));
                                    }

                                    let combatEnded = false;
                                    let completedActionHrid = null;

                                    if (data?.type === "actions_updated" && Array.isArray(data.endCharacterActions)) {
                                        const completedCombatAction = data.endCharacterActions.find(action =>
                                            action?.actionHrid?.startsWith("/actions/combat/") && action.isDone === true
                                        );
                                        if (completedCombatAction) {
                                            combatEnded = true;
                                            completedActionHrid = completedCombatAction.actionHrid;
                                        }
                                    }
                                    else if (data?.type === "cancel_character_action" && data?.cancelCharacterActionData?.characterActionId) {
                                       combatEnded = true;
                                       completedActionHrid = data?.cancelCharacterActionData?.actionHrid || null;
                                    }

                                    if (combatEnded) {
                                        window.dispatchEvent(new CustomEvent("LootTrackerCombatEnded", {
                                            detail: { actionHrid: completedActionHrid }
                                        }));
                                    }

                                } catch (e) {
                                     if (!(e instanceof SyntaxError)) { console.error("LDT Inject: Error processing message:", e, event.data?.substring(0, 500)); }
                                }
                            };
                            this.addEventListener('message', this._lootDropsListener);
                        }

                        close(...args) {
                            try {
                                this.removeEventListener('message', this._lootDropsListener);
                            } catch (e) { console.error("LDT Inject: Error removing listener on close", e); }
                            super.close(...args);
                        }
                    };
                })();
            `;
            (document.documentElement || document.body).appendChild(script);
            setTimeout(() => { if (script.parentNode) script.parentNode.removeChild(script); }, 100);
        }

    }

    function main() {
        if (!window.lootDropsTrackerInstance) {
             window.lootDropsTrackerInstance = new LootDropsTracker();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();