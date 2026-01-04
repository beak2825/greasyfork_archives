// ==UserScript==
// @name         Stake Keno Bot
// @namespace    http://tampermonkey.net/
// @version      3.3.3
// @description  Advanced Keno Bot for Stake.us and Stake.com with pattern shifting/animation, resizable UI, pattern creator, risk selection, seed changing, and advanced strategy options.
// @author       LTC: ltc1qvpmsjyn6y7vk080uhje8v63mvty4adp7ewk20c (Original by Author, Bot UI by Gemini)
// @license      MIT
// @match        https://stake.us/casino/games/keno
// @match        https://stake.com/casino/games/keno
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/496037/Stake%20Keno%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/496037/Stake%20Keno%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION & STATE ---

    const botState = {
        running: false,
        betCount: 0,
        totalProfit: 0,
        winStreak: 0,
        lossStreak: 0,
        lastBetWasWin: null,
        lastMultiplier: 0,
        autoBetLoopInterval: null,
        lastPickedNumbers: [], // Holds the last set of picked numbers to avoid re-picking
        isLocked: false,
        isBotInitialized: false,
        logEntries: [],
        isPickingElement: false,
        pendingAction: null,
        storedUsername: '',
        storedPasswordHash: '',
        strategyFlags: {}, // For stateful conditions like 'firstStreakOf'
        persistentTriggerStates: {}, // For tracking profit/time based one-time actions
        apiBlockStartTime: 0, // To track API cooldown
    };

    const kenoState = {
        type: null, // 'bar', 'bird', 'random', 'custom', or 'user'
        position: null, // 'left', 'middle', 'right'
        flip: false,
        customCount: 3,
        userPatternName: null, // For 'user' type
        riskLevel: 'medium', // Default risk
        animation: { // For pattern shifting
            enabled: false,
            type: 'none',
            patternName: null,
            currentFrame: 0,
            currentAnchor: { row: 0, col: 0 },
            currentVelocity: { row: 1, col: 1 },
            metadata: null, // Will hold { offsets, height, width, validAnchorRows, validAnchorCols }
            customFrames: [] // Will hold arrays of tile numbers
        }
    };

    // For pattern creator modal dragging state
    const patternCreatorState = {
        isDragging: false,
        dragStartTile: null,
        dragStartCoords: null,
        currentTiles: [],
        currentMetadata: null,
    };

    const patterns = {
        bar: { left: [1, 2, 9, 10, 17, 18, 25, 26, 33, 34], middle: [4, 5, 12, 13, 20, 21, 28, 29, 36, 37], right: [7, 8, 15, 16, 23, 24, 31, 32, 39, 40] },
        bar_flip: { left: [2, 3, 10, 11, 18, 19, 26, 27, 34, 35], middle: [4, 5, 12, 13, 20, 21, 28, 29, 36, 37], right: [6, 7, 14, 15, 22, 23, 30, 31, 38, 39] },
        bird: { left: [33, 34, 35, 36, 37, 26, 27, 28, 19, 11], middle: [12, 20, 27, 28, 29, 34, 35, 36, 37, 38], right: [36, 37, 38, 39, 40, 29, 30, 31, 22, 14] },
        bird_flip: { left: [1, 9, 10, 17, 18, 19, 20, 25, 26, 33], middle: [2, 3, 4, 5, 6, 11, 12, 13, 20, 28], right: [21, 22, 23, 24, 15, 16, 8, 31, 32, 40] },
    };

    let userPatterns = {}; // Will store { name: { tiles: [], metadata: {}, animation: {} } }
    let advancedStrategies = {};

    const logFilters = {
        system: true,
        manual: true,
        auto: true,
        strategy: true,
    };

    let CONFIG = {
        authToken: '', // Added for seed change
        seedChangeEndpoint: '/_api/graphql', // Added for seed change
        betButton: '[data-testid="bet-button"]',
        clearButton: '[data-testid="clear-table-button"]',
        tile: '[data-testid^="tile-"], .tile.svelte-vebeey', // MODIFIED: More general selector for tiles
        amountInput: '[data-testid="input-game-amount"]',
        riskSelect: '[data-testid="risk-select"]', // Added risk selector
        pastBetsContainer: '.past-bets',
        injectControlsToPage: false,
        uiScale: 100,
        autoGames: 0, // Number of games for auto-bet
    };

    const CONFIG_FRIENDLY_NAMES = {
        authToken: "Auth Token (Auto-detected)", // Added
        seedChangeEndpoint: "API Endpoint", // Added
        betButton: "Bet Button",
        clearButton: "Clear Button",
        tile: "Keno Tile",
        amountInput: "Amount Input",
        riskSelect: "Risk Select Dropdown", // Added
        pastBetsContainer: "Past Bets List",
        injectControlsToPage: "Inject Manual Controls to Page",
        uiScale: "UI Scale (%)",
        autoGames: "Games to Run (0=inf)",
    };

    // --- UI (HTML & CSS) ---

    const botHtml = `
        <div id="bot-notification-container"></div>
        <div id="keno-bot-window" class="bot-window">
            <!-- Resizers -->
            <div class="resizer resizer-t"></div><div class="resizer resizer-r"></div><div class="resizer resizer-b"></div><div class="resizer resizer-l"></div>
            <div class="resizer resizer-tl"></div><div class="resizer resizer-tr"></div><div class="resizer resizer-br"></div><div class="resizer resizer-bl"></div>

            <!-- Header -->
            <div id="bot-header" class="bot-header">
                <span>Stake Keno Bot <span id="bot-status-indicator"></span> <span id="profit-loss-display"></span></span>
                <div class="window-controls">
                    <button id="minimize-btn" class="window-btn" title="Minimize">—</button>
                    <button id="close-btn" class="window-btn" title="Close">×</button>
                </div>
            </div>

            <!-- Main Content -->
            <div id="bot-main-content" class="bot-content">
                <div class="bot-tabs">
                    <button class="bot-tab-btn active" data-tab="manual">Manual</button>
                    <button class="bot-tab-btn" data-tab="auto">Auto</button>
                    <button class="bot-tab-btn" data-tab="patterns">Patterns</button>
                    <button class="bot-tab-btn" data-tab="advanced">Advanced</button>
                    <button class="bot-tab-btn" data-tab="log">Log</button>
                    <button class="bot-tab-btn" data-tab="config">Config</button>
                    <button class="bot-tab-btn" data-tab="admin">Admin</button>
                </div>

                <!-- Manual Tab -->
                <div id="tab-manual" class="bot-tab-content active">
                    <!-- Compacted Groups -->
                    <div class="compact-grid-2">
                        <div class="bot-input-group">
                            <label>Pattern Type</label>
                            <div class="btn-grid-3">
                                <button id="manual-btn-bar" data-category="type" data-value="bar" class="bot-btn bot-btn-secondary">Bar</button>
                                <button id="manual-btn-bird" data-category="type" data-value="bird" class="bot-btn bot-btn-secondary">Bird</button>
                                <button id="manual-btn-random" data-category="type" data-value="random" class="bot-btn bot-btn-secondary">Random</button>
                            </div>
                        </div>
                        <div class="bot-input-group">
                            <label>Position / Flip</label>
                            <div class="btn-grid-4">
                                <button id="manual-btn-flip" data-category="flip" class="bot-btn bot-btn-secondary" title="Flip">Flip</button>
                                <button id="manual-btn-left" data-category="position" data-value="left" class="bot-btn bot-btn-secondary" title="Left">L</button>
                                <button id="manual-btn-middle" data-category="position" data-value="middle" class="bot-btn bot-btn-secondary" title="Middle">M</button>
                                <button id="manual-btn-right" data-category="position" data-value="right" class="bot-btn bot-btn-secondary" title="Right">R</button>
                            </div>
                        </div>
                        <div class="bot-input-group">
                            <label>Custom Random</label>
                            <div class="flex-container justify-between">
                                <button id="manual-btn-custom" data-category="type" data-value="custom" class="bot-btn bot-btn-secondary" style="flex-grow: 1;">Custom</button>
                                <input type="number" id="keno-custom-count-input" class="bot-input" min="1" max="10" value="3" title="Number of random tiles" style="width: 60px; text-align: center; padding: 8px 4px;">
                            </div>
                        </div>
                        <div class="bot-input-group">
                            <label>Risk Level</label>
                            <select id="manual-risk-select" class="bot-input" style="padding: 8px 4px;">
                                <option value="classic">Classic</option>
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div id="manual-user-patterns" class="bot-input-group">
                        <label>User Patterns (<span id="manual-pattern-animation-status" style="font-weight: bold; color: var(--accent-yellow);"></span>)</label>
                        <div id="manual-user-patterns-container" class="btn-grid-3">
                            <!-- User patterns will be injected here -->
                        </div>
                    </div>

                    <hr>

                    <!-- New Manual Strategy/Bet Section -->
                    <div class="bot-input-group">
                        <label>Manual Strategy Step</label>
                        <select id="manual-strategy-select" class="bot-input">
                            <option value="none">None (Use Manual Selection)</option>
                            <!-- Strategies will be populated here -->
                        </select>
                        <p class="strategy-desc" style="margin-top: 8px; margin-bottom: 8px;">
                            Select a strategy to apply its logic on the next manual bet, or select "None" to use the pattern chosen above.
                        </p>
                    </div>
                    <div class="btn-grid-2">
                            <button id="manual-bet-btn" class="bot-btn bot-btn-primary" title="Place a single bet (B)">Manual Bet (B)</button>
                            <button id="manual-change-seed-btn" class="bot-btn bot-btn-secondary" title="Change Client Seed via API">Change Seed</button>
                    </div>
                </div>

                <!-- Auto Tab -->
                <div id="tab-auto" class="bot-tab-content">
                    <div class="bot-input-group">
                        <label>Games to Run (0 for infinite)</label>
                        <input type="number" id="keno-games-input" class="bot-input" value="0" min="0">
                    </div>
                    <div class="bot-input-group">
                        <label>Strategy</label>
                        <select id="auto-strategy-select" class="bot-input">
                            <option value="none">None (Use Manual Selection)</option>
                        </select>
                    </div>
                    <p class="strategy-desc">
                        If "None" is selected, the bot will continuously run the pattern and risk level currently selected on the "Manual" tab.
                        If a user pattern with animation is selected, it will animate.
                        If a strategy is selected, it will override the manual selection.
                    </p>
                    <button id="start-stop-btn" class="bot-btn bot-btn-primary" title="Starts or stops the bot (S)">Start Auto (S)</button>
                </div>

                <!-- Patterns Tab -->
                <div id="tab-patterns" class="bot-tab-content">
                    <div class="bot-input-group">
                        <label>Your Saved Patterns</label>
                        <select id="user-pattern-list" class="bot-input" size="8"></select>
                    </div>
                    <div class="btn-grid-3">
                        <button id="create-pattern-btn" class="bot-btn bot-btn-secondary">Create New</button>
                        <button id="edit-pattern-btn" class="bot-btn bot-btn-secondary">Edit Selected</button>
                        <button id="delete-pattern-btn" class="bot-btn bot-btn-danger">Delete</button>
                    </div>
                </div>

                <!-- Advanced Tab -->
                <div id="tab-advanced" class="bot-tab-content">
                    <div class="bot-input-group">
                        <label>Your Saved Strategies</label>
                        <select id="advanced-strategy-list" class="bot-input" size="8"></select>
                    </div>
                    <div class="btn-grid-2">
                        <button id="create-strategy-btn" class="bot-btn bot-btn-secondary">Create New</button>
                        <button id="edit-strategy-btn" class="bot-btn bot-btn-secondary">Edit Selected</button>
                        <button id="import-strategy-btn" class="bot-btn bot-btn-secondary">Import</button>
                        <button id="export-strategy-btn" class="bot-btn bot-btn-secondary">Export Selected</button>
                    </div>
                    <button id="delete-strategy-btn" class="bot-btn bot-btn-danger">Delete Selected</button>
                </div>

                <!-- Log Tab -->
                <div id="tab-log" class="bot-tab-content">
                    <div id="log-filters">
                        <label><input type="checkbox" data-filter="system" checked> System</label>
                        <label><input type="checkbox" data-filter="manual" checked> Manual</label>
                        <label><input type="checkbox" data-filter="auto" checked> Auto</label>
                        <label><input type="checkbox" data-filter="strategy" checked> Strategy</label>
                    </div>
                    <div id="log-container"></div>
                    <div class="btn-grid-2">
                        <button id="reset-stats-btn" class="bot-btn bot-btn-danger">Reset Stats</button>
                        <button id="save-log-btn" class="bot-btn bot-btn-secondary">Save Log to File</button>
                    </div>
                </div>

                <!-- Config Tab -->
                <div id="tab-config" class="bot-tab-content">
                    <p class="strategy-desc">Configure UI element selectors and bot behavior.</p>
                    <div id="config-container"></div>
                    <button id="save-config-btn" class="bot-btn bot-btn-primary">Save Config</button>
                    <button id="reset-config-btn" class="bot-btn bot-btn-danger">Reset to Defaults</button>
                </div>

                <!-- Admin Tab -->
                <div id="tab-admin" class="bot-tab-content">
                    <p class="strategy-desc">Set a password to lock bot settings. When locked, only the Manual and Admin tabs are usable.</p>
                    <div class="bot-input-group"><label>Username</label><input type="text" id="admin-username" class="bot-input" autocomplete="username"></div>
                    <div class="bot-input-group"><label>New Password (leave blank to keep current)</label><input type="password" id="admin-password" class="bot-input" autocomplete="new-password"></div>
                    <button id="save-credentials-btn" class="bot-btn bot-btn-secondary">Save Credentials</button>
                    <hr>
                    <button id="lock-unlock-btn" class="bot-btn bot-btn-primary">Lock</button>
                    <p id="admin-status" class="strategy-desc" style="margin-top: 15px; text-align: center;"></p>
                </div>
            </div>
        </div>

        <!-- Minimized Bar -->
        <div id="keno-bot-minimized-bar" style="display: none;">
            <span>Stake Keno Bot</span>
            <div class="window-controls">
                <button id="maximize-btn" class="window-btn" title="Maximize">□</button>
                <button id="close-minimized-btn" class="window-btn" title="Close">×</button>
            </div>
        </div>

        <!-- Modals -->
        <div id="pattern-creator-modal" class="bot-modal-backdrop" style="display: none;">
            <div class="bot-modal-content" style="max-width: 700px; width: 90%;">
                <h3 id="pattern-modal-title">Create New Pattern</h3>
                <div class="bot-input-group">
                    <label>Pattern Name</label>
                    <input type="text" id="pattern-name" class="bot-input">
                </div>
                <div class="bot-input-group">
                    <label>Click to select up to 10 tiles. If 'Custom Animation' is on, you can drag the pattern.</label>
                    <div id="keno-pattern-grid">
                        ${Array.from({ length: 40 }, (_, i) => `<div class="keno-pattern-tile" data-number="${i + 1}">${i + 1}</div>`).join('')}
                    </div>
                </div>

                <!-- Animation Settings -->
                <div id="pattern-animation-settings" class="strategy-rule">
                    <div class="bot-input-group" style="margin-bottom: 10px;">
                        <label class="flex-container" style="justify-content: space-between;">
                            Pattern Animation
                            <input type="checkbox" id="pattern-animation-enable" style="width: 20px; height: 20px;">
                        </label>
                    </div>
                    <div id="pattern-animation-controls" style="display: none;">
                        <div class="bot-input-group" style="margin-bottom: 10px;">
                            <label>Animation Type</label>
                            <select id="pattern-animation-type" class="bot-input">
                                <option value="none">None</option>
                                <option value="random">Random Shift</option>
                                <option value="dvd">DVD Bounce</option>
                                <option value="leftRight">Left-Right</option>
                                <option value="custom">Custom (Frames)</option>
                            </select>
                        </div>
                        <div id="pattern-animation-frames-ui" style="display: none;">
                            <label>Animation Frames</label>
                            <div class="flex-container" style="gap: 10px; align-items: flex-start;">
                                <select id="pattern-animation-frames-list" class="bot-input" size="5" style="flex-grow: 1;"></select>
                                <div class="flex-container" style="flex-direction: column; gap: 5px; flex-shrink: 0;">
                                    <button id="pattern-frame-add" class="bot-btn bot-btn-secondary" style="margin: 0; padding: 5px;" title="Save Current Grid as Frame">Save Frame</button>
                                    <button id="pattern-frame-delete" class="bot-btn bot-btn-danger" style="margin: 0; padding: 5px;" title="Delete Selected Frame">Delete</button>
                                    <button id="pattern-frame-up" class="bot-btn bot-btn-secondary" style="margin: 0; padding: 5px;" title="Move Up">↑</button>
                                    <button id="pattern-frame-down" class="bot-btn bot-btn-secondary" style="margin: 0; padding: 5px;" title="Move Down">↓</button>
                                </div>
                            </div>
                            <p class="strategy-desc" style="margin-top: 8px;">Drag pattern on grid above, then 'Save Frame'.</p>
                        </div>
                    </div>
                </div>
                
                <div class="btn-grid-2">
                    <button id="save-pattern-btn" class="bot-btn bot-btn-primary">Save</button>
                    <button id="cancel-pattern-btn" class="bot-btn bot-btn-danger">Cancel</button>
                </div>
            </div>
        </div>

        <div id="strategy-modal" class="bot-modal-backdrop" style="display: none;">
            <div id="strategy-modal-content" class="bot-modal-content">
                <h3 id="strategy-modal-title">Create Strategy</h3>
                <div class="bot-input-group"><label>Strategy Name</label><input type="text" id="strategy-name" class="bot-input"></div>
                <div id="strategy-rules-container"></div>
                <button id="add-rule-btn" class="bot-btn bot-btn-secondary">Add Condition Block</button>
                <hr>
                <p id="strategy-modal-warning" style="color: var(--accent-red); text-align: center; display: none;"></p>
                <button id="save-strategy-btn" class="bot-btn bot-btn-primary">Save Strategy</button>
                <button id="cancel-strategy-btn" class="bot-btn bot-btn-danger">Cancel</button>
            </div>
        </div>

        <div id="password-prompt-modal" class="bot-modal-backdrop" style="display: none;">
            <div id="password-prompt-content" class="bot-modal-content">
                <h3>Password Required</h3>
                <p id="password-prompt-message">Please enter the password to unlock this feature.</p>
                <div class="bot-input-group"><label>Password</label><input type="password" id="prompt-password-input" class="bot-input" autocomplete="current-password"></div>
                <p id="password-prompt-error" style="color: var(--accent-red); display: none;"></p>
                <div class="btn-grid-2">
                    <button id="password-prompt-submit" class="bot-btn bot-btn-primary">Submit</button>
                    <button id="password-prompt-cancel" class="bot-btn bot-btn-secondary">Cancel</button>
                </div>
            </div>
        </div>

        <div id="element-picker-overlay"></div>
        <div id="element-picker-tooltip">Click an element to select it. Press ESC to cancel.</div>
    `;

    const botCss = `
        :root { --bg-primary: #213743; --bg-secondary: #2F4553; --bg-tertiary: #1A2D3A; --accent-green: #00b373; --accent-red: #e53e3e; --accent-yellow: #FFC107; --accent-blue: #3b82f6; --text-primary: #fff; --text-secondary: #b1bad3; }
        .bot-window { position: fixed; top: 100px; right: 20px; width: 380px; min-width: 350px; max-width: 800px; height: 600px; min-height: 400px; max-height: 90vh; background-color: var(--bg-primary); border-radius: 8px; z-index: 9999; color: var(--text-primary); font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; }
        .bot-header { padding: 10px 15px; cursor: move; background-color: var(--bg-secondary); font-weight: 600; user-select: none; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        #bot-status-indicator { font-weight: normal; font-size: 12px; opacity: 0.8; margin-left: 8px; }
        #profit-loss-display { font-weight: 600; font-size: 12px; margin-left: 10px; }
        #profit-loss-display.profit { color: var(--accent-green); }
        #profit-loss-display.loss { color: var(--accent-red); }
        .window-controls { display: flex; gap: 8px; align-items: center; }
        .window-btn { background: none; border: none; color: var(--text-secondary); font-size: 20px; cursor: pointer; line-height: 1; padding: 0 5px; font-family: sans-serif; display: flex; align-items: center; justify-content: center; }
        .window-btn:hover { color: var(--text-primary); }
        #maximize-btn { font-size: 16px; }
        .bot-content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; min-height: 0; }
        .bot-tabs { display: flex; margin-bottom: 15px; background-color: var(--bg-primary); border-radius: 20px; padding: 4px; border: 1px solid var(--bg-secondary); flex-shrink: 0; overflow-x: auto; }
        .bot-tab-btn { flex: 1; padding: 8px; cursor: pointer; background: transparent; border: none; color: var(--text-secondary); border-radius: 20px; font-weight: 500; transition: all 0.2s ease-in-out; font-size: 13px; white-space: nowrap; }
        .bot-tab-btn.active { background-color: var(--bg-secondary); color: var(--text-primary); }
        .bot-tabs.locked .bot-tab-btn:not([data-tab="manual"]):not([data-tab="admin"]) { pointer-events: none; opacity: 0.5; }
        .bot-tab-content { display: none; overflow-y: auto; flex-grow: 1; flex-direction: column; padding-right: 5px; /* Add padding for scrollbar */ }
        .bot-tab-content.active { display: flex; }
        .bot-input-group { margin-bottom: 10px; display: flex; flex-direction: column; }
        .bot-input-group label { margin-bottom: 4px; font-size: 13px; color: #b1bad3; }
        .bot-input { width: 100%; padding: 8px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; color: #fff; box-sizing: border-box; }
        .bot-input:disabled { background-color: #2a414f; opacity: 0.7; }
        select.bot-input { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b1bad3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 8px center; background-size: 1em; padding-right: 2.5em; }
        select.bot-input[size] { background-image: none; padding-right: 8px; }
        .bot-btn { width: 100%; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; margin-top: 8px; transition: all 0.2s ease; }
        .bot-btn:disabled { background-color: #4A5568; cursor: not-allowed; opacity: 0.7; }
        .bot-btn-primary { background-color: var(--accent-green); color: #fff; }
        .bot-btn-danger { background-color: var(--accent-red); color: #fff; }
        .bot-btn-secondary { background-color: var(--bg-secondary); color: #fff; }
        .bot-btn-secondary.active { background-color: var(--accent-blue); }
        .bot-btn:hover:not(:disabled) { opacity: 0.8; }
        .strategy-desc { font-size: 12px; color: #b1bad3; background-color: var(--bg-secondary); padding: 8px; border-radius: 4px; margin: 5px 0 15px 0; }
        #config-container { background-color: var(--bg-primary); border-radius: 4px; padding: 8px; font-size: 12px; line-height: 1.5; }
        #log-container { flex-grow: 1; overflow-y: auto; padding-right: 5px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; padding: 8px; font-size: 12px; line-height: 1.5; min-height: 100px; }
        #log-container p { margin: 0 0 5px 0; padding: 2px 4px; border-radius: 3px; }
        #log-container p.log-manual { color: var(--accent-green); }
        #log-container p.log-auto { color: var(--accent-red); }
        #log-container p.log-strategy { color: var(--accent-yellow); }
        #log-container p b { font-weight: 900; }
        #log-filters { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 10px; background-color: var(--bg-secondary); padding: 8px; border-radius: 4px; }
        #log-filters label { display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer; }
        #keno-bot-minimized-bar { position: fixed; top: 100px; right: 20px; background-color: var(--bg-secondary); border-radius: 8px; z-index: 9999; color: #fff; font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; justify-content: space-between; align-items: center; padding: 8px 12px; cursor: move; }
        #keno-bot-minimized-bar span { font-weight: 600; user-select: none; }
        .config-group { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
        .config-group label { font-size: 12px; color: #b1bad3; flex-basis: 140px; flex-shrink: 0; display: flex; align-items: center; }
        .config-group .input-wrapper { display: flex; align-items: center; flex-grow: 1; position: relative; }
        .config-group input { flex-grow: 1; font-size: 11px; }
        .config-group input[type=text] { padding-right: 30px; }
        .config-pick-btn, .config-toggle-vis-btn { padding: 6px 8px; font-size: 10px; flex-shrink: 0; background-color: #4A5568; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .config-toggle-vis-btn { position: absolute; right: 1px; top: 1px; bottom: 1px; background-color: var(--bg-secondary); padding: 0 8px; }
        .config-toggle-vis-btn svg { width: 16px; height: 16px; pointer-events: none; }
        .config-group input[type=checkbox] { width: 16px; height: 16px; flex-grow: 0; }
        #element-picker-overlay { position: fixed; background-color: rgba(0, 179, 115, 0.3); border: 2px solid var(--accent-green); z-index: 10000; pointer-events: none; display: none; transition: all 0.1s linear; }
        #element-picker-tooltip { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: black; color: white; padding: 10px 20px; border-radius: 5px; z-index: 10001; display: none; }
        .bot-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center; }
        .bot-modal-content { background: var(--bg-primary); padding: 20px; border-radius: 8px; border: 1px solid var(--bg-secondary); width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        #strategy-modal-content > .bot-input-group, #strategy-modal-content > .bot-btn, #strategy-modal-content > hr { margin: 0; }
        #password-prompt-content { max-width: 380px; text-align: center; }
        #strategy-rules-container { overflow-y: auto; flex-grow: 1; min-height: 100px; }
        .strategy-rule { background: var(--bg-secondary); padding: 8px; border-radius: 4px; margin-bottom: 8px; }
        .strategy-rule-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .strategy-rule-summary { display: flex; gap: 5px; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .strategy-rule-summary span { font-size: 13px; }
        .strategy-rule-summary .summary-action { color: var(--accent-yellow); }
        .strategy-rule-controls { display: flex; align-items: center; }
        .strategy-rule-editor { display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--bg-primary); }
        .strategy-rule.expanded .strategy-rule-editor { display: block; }
        .strategy-rule.expanded .strategy-rule-summary { display: none; }
        .rule-toggle-group { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
        .rule-toggle-group label { background: var(--bg-primary); padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .rule-toggle-group input { display: none; }
        .rule-toggle-group input:checked + label { background: var(--accent-green); color: white; }
        .rule-sentence { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; margin-bottom: 8px; }
        .rule-sentence span { font-size: 13px; }
        .rule-sentence .bot-input { width: auto; flex-grow: 1; min-width: 80px; padding: 4px 6px; }
        .action-sentence .action-type { width: 180px; flex-grow: 0; flex-shrink: 0; }
        .rule-sentence .bot-input[type=number] { max-width: 100px; }
        .remove-btn, .move-btn { color: #fff; cursor: pointer; font-weight: bold; background: none; border: none; font-size: 18px; padding: 0 5px; }
        .remove-btn { color: var(--accent-red); }
        .btn-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .btn-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .btn-grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; }
        .btn-grid-2 .bot-btn, .btn-grid-3 .bot-btn, .btn-grid-4 .bot-btn { margin-top: 0; padding: 8px 4px; }
        hr { border: none; border-top: 1px solid var(--bg-secondary); margin: 10px 0; }
        .resizer { position: absolute; z-index: 10; }
        .resizer-r { cursor: e-resize; height: 100%; width: 5px; right: 0; top: 0; }
        .resizer-l { cursor: w-resize; height: 100%; width: 5px; left: 0; top: 0; }
        .resizer-b { cursor: s-resize; height: 5px; width: 100%; right: 0; bottom: 0; }
        .resizer-t { cursor: n-resize; height: 5px; width: 100%; left: 0; top: 0; }
        .resizer-br { cursor: se-resize; height: 15px; width: 15px; right: 0; bottom: 0; }
        .resizer-bl { cursor: sw-resize; height: 15px; width: 15px; left: 0; bottom: 0; }
        .resizer-tr { cursor: ne-resize; height: 15px; width: 15px; right: 0; top: 0; }
        .resizer-tl { cursor: nw-resize; height: 15px; width: 15px; left: 0; top: 0; }
        .resizer-br::after { content: ''; position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 0 12px 12px; border-color: transparent transparent rgba(177, 186, 211, 0.2) transparent; pointer-events: none; }
        #bot-notification-container { position: fixed; top: 20px; right: 20px; z-index: 10005; display: flex; flex-direction: column; gap: 10px; }
        .bot-notification { background-color: var(--bg-secondary); color: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); width: 300px; opacity: 0; transform: translateX(100%); animation: slideIn 0.5s forwards; }
        .bot-notification.fade-out { animation: slideOut 0.5s forwards; }
        .bot-notification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .bot-notification-header span { font-weight: bold; }
        .bot-notification-header .close-btn { background: none; border: none; color: #b1bad3; font-size: 20px; cursor: pointer; line-height: 1; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
        .flex-container { display: flex; align-items: center; gap: 0.5rem; }
        .justify-between { justify-content: space-between; }
        #keno-pattern-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; background-color: var(--bg-secondary); padding: 10px; border-radius: 4px; touch-action: none; }
        .keno-pattern-tile { background-color: var(--bg-tertiary); color: var(--text-secondary); aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 12px; cursor: pointer; user-select: none; }
        .keno-pattern-tile.selected { background-color: var(--accent-blue); color: white; }
        .keno-pattern-tile.dragging { opacity: 0.5; }
        #pattern-animation-settings { background: var(--bg-secondary); padding: 8px; border-radius: 4px; margin-top: 10px; }
        #pattern-animation-frames-list option:checked { background-color: var(--accent-blue); color: white; }
        .compact-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    `;

    // --- CORE LOGIC ---

    function init() {
        if (botState.isBotInitialized) return;
        botState.isBotInitialized = true;

        loadConfig();
        loadStrategies();
        loadUserPatterns();

        document.body.insertAdjacentHTML('beforeend', botHtml);
        GM_addStyle(botCss);
        document.getElementById('keno-bot-window').style.display = 'flex';

        applyUiScale();
        loadSecurityConfig();
        populateConfigTab(); // Needs to happen after loadConfig for auth token
        populateStrategyDropdowns();
        populatePatternDropdowns();
        setupEventListeners();
        makeDraggable(document.getElementById('keno-bot-window'), document.getElementById('bot-header'));
        makeDraggable(document.getElementById('keno-bot-minimized-bar'), document.getElementById('keno-bot-minimized-bar'));
        makeResizable(document.getElementById('keno-bot-window'));

        log("Bot UI Initialized. Waiting for game interface...", "system");
        waitForGameAndEnable();
        updateProfitDisplay();

        if (botState.storedPasswordHash) {
            lockUI();
        } else {
            updateAdminStatus("No password set. Bot is unlocked.", "info");
        }

        if (CONFIG.injectControlsToPage) {
            originalInjectControls();
        }
    }

    function setupEventListeners() {
        // Window Controls
        document.getElementById('minimize-btn').addEventListener('click', minimizeBot);
        document.getElementById('close-btn').addEventListener('click', closeBot);
        document.getElementById('maximize-btn').addEventListener('click', maximizeBot);
        document.getElementById('close-minimized-btn').addEventListener('click', closeBot);

        // Tab switching
        setupTabSwitching();

        // Manual Tab
        document.getElementById('manual-btn-bar').addEventListener('click', () => handleManualPatternChange('type', 'bar'));
        document.getElementById('manual-btn-bird').addEventListener('click', () => handleManualPatternChange('type', 'bird'));
        document.getElementById('manual-btn-random').addEventListener('click', () => handleManualPatternChange('type', 'random'));
        document.getElementById('manual-btn-custom').addEventListener('click', () => handleManualPatternChange('type', 'custom'));
        document.getElementById('keno-custom-count-input').addEventListener('change', (e) => {
            kenoState.customCount = parseInt(e.target.value, 10) || 3;
            if (kenoState.type === 'custom') handleManualPatternChange('type', 'custom'); // Re-apply if active
        });
        document.getElementById('manual-btn-flip').addEventListener('click', () => handleManualPatternChange('flip'));
        document.getElementById('manual-btn-left').addEventListener('click', () => handleManualPatternChange('position', 'left'));
        document.getElementById('manual-btn-middle').addEventListener('click', () => handleManualPatternChange('position', 'middle'));
        document.getElementById('manual-btn-right').addEventListener('click', () => handleManualPatternChange('position', 'right'));
        document.getElementById('manual-risk-select').addEventListener('change', handleManualRiskChange);
        document.getElementById('manual-change-seed-btn').addEventListener('click', handleManualSeedChange);
        document.getElementById('manual-bet-btn').addEventListener('click', handleManualBet); // Added

        // Auto Tab
        document.getElementById('start-stop-btn').addEventListener('click', toggleBot);
        document.getElementById('keno-games-input').addEventListener('change', (e) => {
            CONFIG.autoGames = parseInt(e.target.value, 10) || 0;
            // No need to save config immediately, just update the state
        });
        // Set initial value from CONFIG
        document.getElementById('keno-games-input').value = CONFIG.autoGames;


        // Patterns Tab
        document.getElementById('create-pattern-btn').addEventListener('click', () => openPatternCreator());
        document.getElementById('edit-pattern-btn').addEventListener('click', editSelectedPattern);
        document.getElementById('delete-pattern-btn').addEventListener('click', deleteSelectedPattern);
        document.getElementById('user-pattern-list').addEventListener('dblclick', editSelectedPattern);

        // Pattern Modal
        document.getElementById('save-pattern-btn').addEventListener('click', savePattern);
        document.getElementById('cancel-pattern-btn').addEventListener('click', () => document.getElementById('pattern-creator-modal').style.display = 'none');
        
        // Pattern Modal - Animation
        document.getElementById('pattern-animation-enable').addEventListener('change', (e) => {
            document.getElementById('pattern-animation-controls').style.display = e.target.checked ? 'block' : 'none';
        });
        document.getElementById('pattern-animation-type').addEventListener('change', (e) => {
            document.getElementById('pattern-animation-frames-ui').style.display = e.target.value === 'custom' ? 'block' : 'none';
            // Enable/disable grid dragging based on selection
            patternCreatorState.isDragging = false;
        });
        document.getElementById('pattern-frame-add').addEventListener('click', addPatternFrame);
        document.getElementById('pattern-frame-delete').addEventListener('click', deletePatternFrame);
        document.getElementById('pattern-frame-up').addEventListener('click', () => movePatternFrame(-1));
        document.getElementById('pattern-frame-down').addEventListener('click', () => movePatternFrame(1));

        // Pattern Modal - Grid Listeners
        const patternGrid = document.getElementById('keno-pattern-grid');
        patternGrid.addEventListener('click', handlePatternGridClick);
        patternGrid.addEventListener('mousedown', handlePatternGridDragStart);
        patternGrid.addEventListener('mousemove', handlePatternGridDragMove);
        patternGrid.addEventListener('mouseup', handlePatternGridDragEnd);
        patternGrid.addEventListener('mouseleave', handlePatternGridDragEnd); // Stop drag if mouse leaves grid


        // Advanced Strategy tab
        document.getElementById('create-strategy-btn').addEventListener('click', () => openStrategyModal());
        document.getElementById('edit-strategy-btn').addEventListener('click', editSelectedStrategy);
        document.getElementById('delete-strategy-btn').addEventListener('click', deleteSelectedStrategy);
        document.getElementById('import-strategy-btn').addEventListener('click', importStrategy);
        document.getElementById('export-strategy-btn').addEventListener('click', exportSelectedStrategy);
        document.getElementById('advanced-strategy-list').addEventListener('dblclick', editSelectedStrategy);

        // Strategy Modal
        document.getElementById('save-strategy-btn').addEventListener('click', saveStrategy);
        document.getElementById('cancel-strategy-btn').addEventListener('click', () => document.getElementById('strategy-modal').style.display = 'none');
        document.getElementById('add-rule-btn').addEventListener('click', () => addRuleToModal());

        // Config tab
        document.getElementById('save-config-btn').addEventListener('click', saveConfig);
        document.getElementById('reset-config-btn').addEventListener('click', resetConfigToDefault);

        // Log Tab
        document.getElementById('save-log-btn').addEventListener('click', saveLogToFile);
        document.getElementById('reset-stats-btn').addEventListener('click', resetStats);
        document.getElementById('log-filters').addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                logFilters[e.target.dataset.filter] = e.target.checked;
                applyLogFilters();
            }
        });

        // Admin tab
        document.getElementById('save-credentials-btn').addEventListener('click', saveCredentials);
        document.getElementById('lock-unlock-btn').addEventListener('click', handleLockUnlock);

        // Password Prompt
        document.getElementById('password-prompt-submit').addEventListener('click', handleSubmitPassword);
        document.getElementById('password-prompt-cancel').addEventListener('click', () => {
            document.getElementById('password-prompt-modal').style.display = 'none';
            botState.pendingAction = null;
        });
        document.getElementById('prompt-password-input').addEventListener('keydown', (e) => {
             if (e.key === "Enter") {
                 e.preventDefault();
                 document.getElementById('password-prompt-submit').click();
             }
        });


        // Keydown listener
        document.addEventListener('keydown', handleKeydown);
    }

    function setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.bot-tab-btn');
        const tabContents = document.querySelectorAll('.bot-tab-content');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (botState.isLocked && e.currentTarget.dataset.tab !== 'manual' && e.currentTarget.dataset.tab !== 'admin') {
                    promptForPassword(unlockUI, "Enter password to unlock bot settings.");
                    return;
                }
                const tabName = e.currentTarget.dataset.tab;
                tabButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === `tab-${tabName}`);
                });
            });
        });
    }

    // --- KENO CORE ACTIONS (Adapted from original script) ---
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clearTable() {
        const clearButton = document.querySelector(CONFIG.clearButton);
        if (clearButton && !clearButton.hasAttribute('disabled')) {
            // Use simulateClick for potentially better compatibility
            simulateClick(clearButton);
            await delay(100);
        }
    }

    async function pickTilesByNumbers(numbersToPick) {
        if (!numbersToPick || numbersToPick.length === 0) {
            console.warn("pickTilesByNumbers called with no numbers.");
            return false; // Indicate failure
        }
        const sortedNew = [...numbersToPick].sort((a,b) => a-b).toString();
        const sortedLast = [...botState.lastPickedNumbers].sort((a,b) => a-b).toString();

        if (sortedNew === sortedLast) {
            // console.log("Numbers already selected, skipping clear/pick.");
            return true; // Indicate success (already done)
        }

        await clearTable();
        // Use the potentially broader selector from CONFIG
        const tileElements = document.querySelectorAll(CONFIG.tile);
        if (tileElements.length === 0) {
            log("Keno tiles not found using selector: " + CONFIG.tile + ". Aborting pick.", "error");
            botState.lastPickedNumbers = []; // Reset state if tiles disappear
            return false; // Indicate failure
        }

        let pickedCount = 0;
        for (const number of numbersToPick) {
            // Find the specific tile button
            const tileToClick = Array.from(tileElements).find(el => {
                // Prioritize data-testid="tile-N"
                const testId = el.getAttribute('data-testid');
                if (testId === `tile-${number}`) {
                    return true;
                }
                // Fallback to checking span content
                const span = el.querySelector('span.tile-number');
                return span && parseInt(span.textContent, 10) === number;
            });

            if (tileToClick) {
                // Use simulateClick for potentially better compatibility
                simulateClick(tileToClick);
                pickedCount++;
                await delay(25); // Keep small delay
            } else {
                 log(`Tile number ${number} not found.`, "error");
            }
        }


        if (pickedCount === numbersToPick.length) {
            botState.lastPickedNumbers = numbersToPick.slice();
            // log(`Selected tiles: ${numbersToPick.join(', ')}`, "manual"); // Maybe too verbose for auto
            return true; // Indicate success
        } else {
            log(`Failed to select all tiles. Expected ${numbersToPick.length}, picked ${pickedCount}.`, "error");
            botState.lastPickedNumbers = []; // Reset if failed
            return false; // Indicate failure
        }
    }

    async function pickRandomTiles(count = 10) {
        const tileElements = document.querySelectorAll(CONFIG.tile);
        if (tileElements.length === 0) {
            log("Cannot pick random tiles: Keno tile elements not found using selector: " + CONFIG.tile, "error");
            botState.lastPickedNumbers = [];
            await clearTable();
            return false;
        }
        // Extract numbers, prioritizing data-testid, falling back to span
        const availableTiles = Array.from(tileElements).map(el => {
             const testId = el.getAttribute('data-testid');
             if (testId && testId.startsWith('tile-')) {
                 return parseInt(testId.substring(5), 10);
             }
             // Fallback to span content
             const span = el.querySelector('span.tile-number');
             return span ? parseInt(span.textContent, 10) : null;
        }).filter(num => num !== null && !isNaN(num)); // Filter out nulls and NaN

        if (availableTiles.length === 0) {
             log("Could not extract any tile numbers.", "error");
             return false;
        }

        const pickedNumbers = [];
        const numToPick = Math.min(count, 10, availableTiles.length); // Ensure we don't pick more than 10 or available

        while (pickedNumbers.length < numToPick && availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            pickedNumbers.push(availableTiles.splice(randomIndex, 1)[0]);
        }
        return await pickTilesByNumbers(pickedNumbers);
    }

    async function applyCurrentPattern() {
        let success = false;

        // Handle animation logic first
        if (kenoState.type === 'user' && kenoState.animation.enabled && kenoState.animation.patternName === kenoState.userPatternName) {
            return await executePatternAnimation();
        }

        // --- Standard (non-animated) pattern logic ---
        if (kenoState.type === 'custom') {
            success = await pickRandomTiles(kenoState.customCount);
        } else if (kenoState.type === 'random') {
            success = await pickAndApplyRandomPattern();
        } else if (kenoState.type === 'user') {
            const pattern = userPatterns[kenoState.userPatternName];
            if (pattern) {
                // Apply the base frame (index 0) of the pattern
                success = await pickTilesByNumbers(pattern.tiles);
            } else {
                log(`User pattern "${kenoState.userPatternName}" not found. Picking random.`, "error");
                success = await pickAndApplyRandomPattern();
            }
        } else if (['bar', 'bird'].includes(kenoState.type) && kenoState.position) {
            const patternKey = kenoState.flip ? `${kenoState.type}_flip` : kenoState.type;
            const selectedPattern = patterns[patternKey]?.[kenoState.position];
            if (selectedPattern) {
                success = await pickTilesByNumbers(selectedPattern);
            } else {
                log(`Pattern not defined: ${patternKey} - ${kenoState.position}`, "error");
                success = false;
            }
        } else {
            // No valid pattern selected, check if tiles are already picked
            if (botState.lastPickedNumbers.length > 0) {
                log("No pattern selected, using previously picked tiles.", "manual");
                success = true; // Tiles are already set
            } else {
                log("No valid pattern/position selected. Clearing table.", "manual");
                await clearTable();
                botState.lastPickedNumbers = [];
                success = true; // Clearing is considered a success in this context
            }
        }
        return success;
    }

    async function pickAndApplyRandomPattern() {
        const allPatternList = Object.values(patterns).flatMap(type => Object.values(type));
        const userPatternList = Object.values(userPatterns).map(p => p.tiles); // Use base tiles
        const combinedList = [...allPatternList, ...userPatternList];

        if (Math.random() > 0.5 && combinedList.length > 0) {
            // Pick a preset or user pattern
            const randomPattern = combinedList[Math.floor(Math.random() * combinedList.length)];
            return await pickTilesByNumbers(randomPattern);
        } else {
            // Pick random tiles (between 1 and 10)
            const randomCount = Math.floor(Math.random() * 10) + 1;
            return await pickRandomTiles(randomCount);
        }
    }

    // --- BOT LOGIC (Adapted from Dice Bot) ---

    function toggleBot() {
        if (botState.running) { // Stopping
            botState.running = false;
            if (botState.autoBetLoopInterval) {
                clearTimeout(botState.autoBetLoopInterval);
                botState.autoBetLoopInterval = null;
            }
            const btn = document.getElementById('start-stop-btn');
            btn.textContent = 'Start Auto (S)';
            btn.classList.remove('bot-btn-danger');
            btn.classList.add('bot-btn-primary');
            updateStatus('Stopped');
            log("Auto betting stopped.", "auto");
            updateInputDisabledState();
        } else { // Starting
            // Check if any tiles are selected if using manual selection without strategy
            const autoStrategyName = document.getElementById('auto-strategy-select').value;
            if (autoStrategyName === 'none' && botState.lastPickedNumbers.length === 0) {
                // Try to apply pattern first
                applyCurrentPattern().then(patternSet => {
                   if (!patternSet || botState.lastPickedNumbers.length === 0) {
                       showNotification("Please select a pattern or tiles manually before starting Auto mode without a strategy.", "error");
                   } else {
                       startBotInternal(); // Start if pattern was applied
                   }
                });
            } else {
                 startBotInternal(); // Start if strategy is selected or tiles already picked
            }
        }
    }

    function startBotInternal() {
        botState.running = true;
        const btn = document.getElementById('start-stop-btn');
        btn.textContent = 'Stop Auto (S)';
        btn.classList.remove('bot-btn-primary');
        btn.classList.add('bot-btn-danger');
        updateStatus('Auto Running...');
        updateInputDisabledState();
        startBot();
    }


    async function startBot() {
        const numGamesInput = document.getElementById('keno-games-input');
        const numGames = parseInt(numGamesInput.value, 10);
        const gameLimitText = (numGames <= 0) ? 'infinite games' : `${numGames} games`;
        log(`Starting auto-bet session for ${gameLimitText}.`, "auto");
        resetStats(); // Reset stats each time auto starts

        // Ensure initial risk level is set
        await setRiskLevel(kenoState.riskLevel);

        // Ensure initial pattern is set if not using a strategy
        const autoStrategyName = document.getElementById('auto-strategy-select').value;
        if (autoStrategyName === 'none') {
            const patternSet = await applyCurrentPattern();
            if (!patternSet) {
                log("Failed to set initial pattern. Stopping bot.", "error");
                toggleBot(); // Stop if pattern couldn't be set
                return;
            }
        }


        botState.autoBetLoopInterval = setTimeout(autoBetLoop, 100);
    }

    async function autoBetLoop() {
        if (!botState.running) return;

        await waitForGameToFinish();
        if (!botState.running) return;

        const autoStrategyName = document.getElementById('auto-strategy-select').value;
        const useAdvancedStrategy = autoStrategyName !== 'none' && advancedStrategies[autoStrategyName];
        let patternSetSuccessfully = true;

        if (useAdvancedStrategy) {
            // Strategy execution will handle tile picking
            patternSetSuccessfully = await executeAdvancedStrategy(advancedStrategies[autoStrategyName]);
        } else {
            // Apply manual selection (which includes animation logic)
            // This will either apply a static pattern or the next animation frame
            patternSetSuccessfully = await applyCurrentPattern();
        }

        // Stop if pattern failed (e.g., elements not found)
        if (!patternSetSuccessfully) {
            log("Failed to set tiles. Stopping bot.", "error");
            if (botState.running) toggleBot();
            return;
        }

        // Add a small delay after picking tiles before betting
        await delay(150);
        if (!botState.running) return; // Check again after delay

        const betAmount = getStakeBetAmount();
        if (betAmount <= 0) {
            log("Bet amount is zero or invalid. Stopping bot.", "error");
            if (botState.running) toggleBot();
            return;
        }

        const result = await placeBetAndGetResult(betAmount);

        if (result === null) {
            log("Failed to place bet or get result. Stopping bot.", "error");
            if (botState.running) toggleBot();
            return;
        }

        // Log auto bet result
        log(`Bet #${botState.betCount + 1}: ${result.win ? `WIN (x${result.multiplier.toFixed(2)})` : 'LOSS (x0.00)'}. Profit: ${result.profit.toFixed(8)}`, "auto");

        updateStateFromResult(result);

        // Game count check
        const numGamesInput = document.getElementById('keno-games-input');
        let gamesRemaining = parseInt(numGamesInput.value, 10);
        if (!isNaN(gamesRemaining) && gamesRemaining > 0) {
            gamesRemaining--;
            numGamesInput.value = gamesRemaining;
            if (gamesRemaining <= 0) {
                log("Finished requested number of games.", "auto");
                toggleBot();
                return; // Stop the loop
            }
        }

        // Continue loop if still running
        if (botState.running) {
            // Use a slightly longer delay between bets for Keno
            botState.autoBetLoopInterval = setTimeout(autoBetLoop, 1500); // Increased delay
        }
    }

    async function waitForGameToFinish() {
        let waitAttempts = 60; // 30 seconds timeout
        while (waitAttempts > 0) {
            const betButton = document.querySelector(CONFIG.betButton);
            // Check if the button exists and is enabled
            if (betButton && !betButton.disabled && !betButton.hasAttribute('disabled')) {
                await delay(300); // Shorter settle delay might be ok
                return;
            }
            await delay(500);
            waitAttempts--;
        }
        log("Timed out waiting for bet button to become active. Stopping auto-bet.", "error");
        if (botState.running) toggleBot();
        // Throw an error or return a specific value to signal timeout in autoBetLoop if needed
    }

    function placeBetAndGetResult(betAmount) {
        return new Promise(resolve => {
            const betButton = document.querySelector(CONFIG.betButton);
            if (!betButton || betButton.disabled || betButton.hasAttribute('disabled')) {
                updateStatus("ERROR: Bet button not active!");
                resolve(null);
                return;
            }
            const pastBetsContainer = document.querySelector(CONFIG.pastBetsContainer);
            if (!pastBetsContainer) {
                updateStatus("ERROR: Past bets list not found!");
                resolve(null);
                return;
            }

            const lastBetElement = pastBetsContainer.firstElementChild;
            const lastBetId = lastBetElement?.getAttribute('data-past-bet-id') || null;

            simulateClick(betButton); // Use simulateClick

            let attempts = 0;
            const maxAttempts = 75; // ~15 seconds timeout
            const pollInterval = setInterval(() => {
                const newBetElement = pastBetsContainer.firstElementChild;
                const newBetId = newBetElement?.getAttribute('data-past-bet-id') || null;

                // Check if a new bet has appeared in the history
                if (newBetElement && newBetId && newBetId !== lastBetId) {
                    clearInterval(pollInterval);

                    const textContent = newBetElement.textContent || "";
                    // Regex to find multiplier like "x12.34" or "x1,234.5"
                    const multiplierMatch = textContent.match(/x([\d,.]+)/);
                    let multiplier = 0;
                    if (multiplierMatch && multiplierMatch[1]) {
                        // Remove commas before parsing
                        multiplier = parseFloat(multiplierMatch[1].replace(/,/g, ''));
                    }

                    const isWin = multiplier > 0;
                    // Calculate profit based on multiplier and bet amount
                    const profit = isWin ? (betAmount * multiplier) - betAmount : -betAmount;

                    // Log more detailed info
                    // log(`Bet #${botState.betCount + 1}: ${isWin ? `WIN (x${multiplier.toFixed(2)})` : 'LOSS (x0.00)'}. Profit: ${profit.toFixed(8)}`, botState.running ? "auto" : "manual");

                    resolve({
                        win: isWin,
                        profit: profit,
                        multiplier: multiplier
                    });
                    return;
                }

                if (++attempts >= maxAttempts) {
                    clearInterval(pollInterval);
                    updateStatus("ERROR: Bet result timed out!");
                    log("Bet result timed out.", "error");
                    resolve(null);
                }
            }, 200);
        });
    }

    function updateStateFromResult(result) {
        botState.betCount++;
        botState.totalProfit += result.profit;
        botState.lastBetWasWin = result.win;
        botState.lastMultiplier = result.multiplier;
        if (result.win) {
            botState.winStreak++;
            botState.lossStreak = 0;
        } else {
            botState.lossStreak++;
            botState.winStreak = 0;
        }
        updateProfitDisplay();
    }

    function resetStats() {
        botState.betCount = 0;
        botState.totalProfit = 0;
        botState.winStreak = 0;
        botState.lossStreak = 0;
        botState.lastBetWasWin = null;
        botState.lastMultiplier = 0;
        botState.strategyFlags = {};
        botState.persistentTriggerStates = {};
        // Reset animation state
        kenoState.animation.currentFrame = 0;
        kenoState.animation.currentAnchor = { row: 0, col: 0 };
        kenoState.animation.currentVelocity = { row: 1, col: 1 };
        updateProfitDisplay();
        log("Stats reset.", "system");
    }

    // --- MANUAL CONTROLS ---
    function handleManualPatternChange(category, value) {
        let changed = false;
        if (category === 'type') {
            if (kenoState.type !== value) {
                kenoState.type = value;
                kenoState.userPatternName = null; // Clear user pattern if type changes
                kenoState.animation.enabled = false; // Disable animation
                changed = true;
            } else { // Click again to deselect
                kenoState.type = null;
                kenoState.animation.enabled = false;
                changed = true;
            }
        } else if (category === 'position') {
            if (!['bar', 'bird'].includes(kenoState.type)) return; // Only allow for relevant types
            if (kenoState.position !== value) {
                kenoState.position = value;
                changed = true;
            } else { // Click again to deselect
                kenoState.position = null;
                changed = true;
            }
        } else if (category === 'flip') {
            if (!['bar', 'bird'].includes(kenoState.type)) return; // Only allow for relevant types
            kenoState.flip = !kenoState.flip;
            changed = true;
        } else if (category === 'user') {
            if (kenoState.type !== 'user' || kenoState.userPatternName !== value) {
                kenoState.type = 'user';
                kenoState.userPatternName = value;
                // Deselect bar/bird specific settings
                kenoState.position = null;
                kenoState.flip = false;
                changed = true;

                // Load animation state for this pattern
                const pattern = userPatterns[value];
                if (pattern && pattern.animation && pattern.animation.enabled) {
                    kenoState.animation.enabled = true;
                    kenoState.animation.type = pattern.animation.type;
                    kenoState.animation.patternName = value;
                    kenoState.animation.metadata = pattern.metadata;
                    kenoState.animation.customFrames = pattern.animation.customFrames || [];
                    kenoState.animation.currentFrame = 0;
                    kenoState.animation.currentAnchor = { row: 0, col: 0 }; // Reset anchor
                    kenoState.animation.currentVelocity = { row: 1, col: 1 }; // Reset velocity
                } else {
                    kenoState.animation.enabled = false;
                }
            } else { // Click again to deselect
                kenoState.type = null;
                kenoState.userPatternName = null;
                kenoState.animation.enabled = false;
                changed = true;
            }
        }

        updateManualButtonStates();
        if (changed) {
            // Apply the base pattern, don't trigger animation step here
            // applyCurrentPattern();
            // Let's apply the base frame of the pattern, but not step animation
            const pattern = userPatterns[kenoState.userPatternName];
            if (kenoState.type === 'user' && pattern) {
                 pickTilesByNumbers(pattern.tiles); // Pick base frame
            } else {
                 applyCurrentPattern(); // Apply logic for bar/bird/etc.
            }
        }
    }

    async function handleManualRiskChange(event) {
        const newRisk = event.target.value;
        await setRiskLevel(newRisk);
    }

    async function setRiskLevel(level) {
        const success = setUIValue(CONFIG.riskSelect, level);
        if (success) {
            kenoState.riskLevel = level;
            log(`Risk level set to: ${level}`, "manual");
            // Update UI dropdown if change came from strategy
            const manualSelect = document.getElementById('manual-risk-select');
            if (manualSelect && manualSelect.value !== level) {
                manualSelect.value = level;
            }
        } else {
            log(`Failed to set risk level to ${level}. Selector: ${CONFIG.riskSelect}`, "error");
        }
        return success;
    }


    function updateManualButtonStates() {
        // Clear all active states first
        document.querySelectorAll('#tab-manual .bot-btn.active').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('#manual-user-patterns-container .bot-btn.active').forEach(b => b.classList.remove('active'));


        // Update Type buttons
        const typeButtons = ['bar', 'bird', 'random', 'custom'];
        typeButtons.forEach(type => {
            const btn = document.getElementById(`manual-btn-${type}`);
            if (btn) btn.classList.toggle('active', kenoState.type === type);
        });

        // Update User Pattern button
        if (kenoState.type === 'user' && kenoState.userPatternName) {
            const userBtn = document.querySelector(`#manual-user-patterns-container button[data-value="${kenoState.userPatternName}"]`);
            if (userBtn) userBtn.classList.add('active');
        }

        // Update Position buttons
        const positionButtons = ['left', 'middle', 'right'];
        const posFlipDisabled = !['bar', 'bird'].includes(kenoState.type);

        positionButtons.forEach(pos => {
            const btn = document.getElementById(`manual-btn-${pos}`);
            if (btn) {
                btn.disabled = posFlipDisabled;
                btn.classList.toggle('active', kenoState.position === pos && !posFlipDisabled);
            }
        });

        // Update Flip button
        const flipBtn = document.getElementById('manual-btn-flip');
        if (flipBtn) {
            flipBtn.disabled = posFlipDisabled;
            flipBtn.classList.toggle('active', kenoState.flip && !posFlipDisabled);
        }

        // Update Risk dropdown
        const riskSelect = document.getElementById('manual-risk-select');
        if (riskSelect) riskSelect.value = kenoState.riskLevel;

        // Reset irrelevant state if type disabled them
        if (posFlipDisabled) {
            // Keep state if type is 'user', otherwise reset
            if (kenoState.type !== 'user') {
                kenoState.position = null;
                kenoState.flip = false;
            }
        }

        // Update animation status text
        const animStatusEl = document.getElementById('manual-pattern-animation-status');
        if (animStatusEl) {
            if (kenoState.animation.enabled) {
                const typeText = document.querySelector(`#pattern-animation-type option[value="${kenoState.animation.type}"]`)?.textContent || 'Active';
                animStatusEl.textContent = `Animation: ${typeText}`;
                animStatusEl.style.display = '';
            } else {
                animStatusEl.style.display = 'none';
            }
        }
    }

    async function handleManualBet() {
        if (botState.running) {
            showNotification("Please stop Auto-bet before placing a manual bet.", "error");
            return;
        }

        const betButton = document.querySelector(CONFIG.betButton);
        if (betButton && (betButton.disabled || betButton.hasAttribute('disabled'))) {
            showNotification("Please wait for the previous bet to finish.", "info");
            return;
        }

        const manualBetBtn = document.getElementById('manual-bet-btn');
        manualBetBtn.disabled = true;
        manualBetBtn.textContent = "Betting...";
        updateStatus("Manual Bet...");

        try {
            const manualStrategyName = document.getElementById('manual-strategy-select').value;
            const useAdvancedStrategy = manualStrategyName !== 'none' && advancedStrategies[manualStrategyName];
            let patternSetSuccessfully = true;

            if (useAdvancedStrategy) {
                // Manually log this, as executeAdvancedStrategy is usually quiet
                log(`<b>Manual Step:</b> Applying strategy '${manualStrategyName}'...`, "manual");
                // Note: We are not in an auto-bet loop, so state (streaks) persists
                patternSetSuccessfully = await executeAdvancedStrategy(advancedStrategies[manualStrategyName]);
            } else {
                log("<b>Manual Step:</b> Applying manual selection...", "manual");
                // applyCurrentPattern will trigger animation step if enabled
                patternSetSuccessfully = await applyCurrentPattern();
            }

            if (!patternSetSuccessfully) {
                throw new Error("Failed to set tiles. Check pattern/strategy.");
            }

            await delay(150); // Small delay after picking

            const betAmount = getStakeBetAmount();
            if (betAmount <= 0) {
                throw new Error("Bet amount is zero or invalid.");
            }

            const result = await placeBetAndGetResult(betAmount);
            if (result === null) {
                throw new Error("Failed to place bet or get result.");
            }

            // Log manual bet result
            log(`<b>Manual Bet #${botState.betCount + 1}:</b> ${result.win ? `WIN (x${result.multiplier.toFixed(2)})` : 'LOSS (x0.00)'}. Profit: ${result.profit.toFixed(8)}`, "manual");

            updateStateFromResult(result);
            updateStatus("Ready");

        } catch (error) {
            log(`Manual Bet Failed: ${error.message}`, "error");
            showNotification(`Manual Bet Failed: ${error.message}`, "error");
            updateStatus("Error");
        } finally {
            manualBetBtn.disabled = false;
            manualBetBtn.textContent = "Manual Bet (B)";
        }
    }

    // --- PATTERN CREATOR ---
    // ... (loadUserPatterns, saveUserPatterns, populatePatternDropdowns remain the same) ...
    function loadUserPatterns() {
        const saved = localStorage.getItem('stakeKenoUserPatterns');
        if (saved) {
            try {
                userPatterns = JSON.parse(saved);
                // Ensure legacy patterns have new structure
                for(const name in userPatterns) {
                    if (Array.isArray(userPatterns[name])) { // Very old format
                         userPatterns[name] = {
                            tiles: userPatterns[name],
                            metadata: calculatePatternMetadata(userPatterns[name]),
                            animation: { enabled: false, type: 'none', customFrames: [] }
                         }
                    } else if (!userPatterns[name].metadata) { // New format missing metadata
                        userPatterns[name].metadata = calculatePatternMetadata(userPatterns[name].tiles);
                    }
                    if (!userPatterns[name].animation) { // Missing animation block
                        userPatterns[name].animation = { enabled: false, type: 'none', customFrames: [] };
                    }
                }
            } catch (e) {
                log("Failed to load user patterns.", "error");
                userPatterns = {};
            }
        }
    }

    function saveUserPatterns() {
        localStorage.setItem('stakeKenoUserPatterns', JSON.stringify(userPatterns));
        populatePatternDropdowns();
        populateStrategyDropdowns(); // Update strategy actions
    }

    function populatePatternDropdowns() {
        const list = document.getElementById('user-pattern-list');
        const manualContainer = document.getElementById('manual-user-patterns-container');
        const strategySelects = document.querySelectorAll('.strategy-action-pattern-select'); // Ensure this class exists in strategy modal

        const selectedListValue = list.value; // Preserve selection

        list.innerHTML = '';
        manualContainer.innerHTML = '';
        strategySelects.forEach(sel => { // Clear previous options
            const firstOption = sel.options[0]; // Preserve placeholder if exists
            sel.innerHTML = '';
            if (firstOption) sel.add(firstOption);
        });

        const patternNames = Object.keys(userPatterns).sort();

        if (patternNames.length === 0) {
            list.innerHTML = '<option disabled>No patterns created yet.</option>';
            manualContainer.innerHTML = '<p class="strategy-desc" style="margin: 0;">Create patterns in the "Patterns" tab.</p>';
        } else {
            patternNames.forEach(name => {
                // Add to patterns list
                list.add(new Option(name, name));

                // Add to strategy dropdowns
                strategySelects.forEach(sel => {
                    sel.add(new Option(name, name));
                });

                // Add to manual tab
                const btn = document.createElement('button');
                btn.className = 'bot-btn bot-btn-secondary';
                btn.textContent = name;
                btn.dataset.category = 'user';
                btn.dataset.value = name;
                btn.onclick = () => handleManualPatternChange('user', name);
                manualContainer.appendChild(btn);
            });
            list.value = selectedListValue; // Restore selection
        }
        updateManualButtonStates(); // Update manual buttons after repopulating
    }


    function openPatternCreator(patternName = '') {
        const modal = document.getElementById('pattern-creator-modal');
        const nameInput = document.getElementById('pattern-name');
        const grid = document.getElementById('keno-pattern-grid');

        // Reset grid
        grid.querySelectorAll('.keno-pattern-tile.selected').forEach(t => t.classList.remove('selected'));
        // Reset animation UI
        document.getElementById('pattern-animation-enable').checked = false;
        document.getElementById('pattern-animation-controls').style.display = 'none';
        document.getElementById('pattern-animation-type').value = 'none';
        document.getElementById('pattern-animation-frames-ui').style.display = 'none';
        document.getElementById('pattern-animation-frames-list').innerHTML = '';


        if (patternName && userPatterns[patternName]) {
            // Edit mode
            const pattern = userPatterns[patternName];
            document.getElementById('pattern-modal-title').textContent = 'Edit Pattern';
            nameInput.value = patternName;
            nameInput.dataset.originalName = patternName;

            // Load base tiles
            pattern.tiles.forEach(num => {
                const tile = grid.querySelector(`.keno-pattern-tile[data-number="${num}"]`);
                if (tile) tile.classList.add('selected');
            });

            // Load animation settings
            if (pattern.animation) {
                const animEnabled = pattern.animation.enabled;
                document.getElementById('pattern-animation-enable').checked = animEnabled;
                document.getElementById('pattern-animation-controls').style.display = animEnabled ? 'block' : 'none';
                document.getElementById('pattern-animation-type').value = pattern.animation.type || 'none';
                document.getElementById('pattern-animation-frames-ui').style.display = (animEnabled && pattern.animation.type === 'custom') ? 'block' : 'none';
                
                // Load custom frames
                const framesList = document.getElementById('pattern-animation-frames-list');
                framesList.innerHTML = '';
                if (pattern.animation.customFrames && pattern.animation.customFrames.length > 0) {
                    pattern.animation.customFrames.forEach((frameTiles, index) => {
                        const frameName = `Frame ${index + 1} (${frameTiles.length} tiles)`;
                        const opt = new Option(frameName, index);
                        opt.dataset.tiles = JSON.stringify(frameTiles);
                        framesList.add(opt);
                    });
                }
            }

        } else {
            // Create mode
            document.getElementById('pattern-modal-title').textContent = 'Create New Pattern';
            nameInput.value = '';
            nameInput.dataset.originalName = '';
        }
        modal.style.display = 'flex';
    }

    function handlePatternGridClick(e) {
        // Only allow clicking if not dragging or animation is not 'custom'
        const animType = document.getElementById('pattern-animation-type').value;
        const animEnabled = document.getElementById('pattern-animation-enable').checked;
        if (patternCreatorState.isDragging || (animEnabled && animType === 'custom')) {
            return;
        }

        if (e.target.classList.contains('keno-pattern-tile')) {
            const tile = e.target;
            const grid = document.getElementById('keno-pattern-grid');
            const selectedCount = grid.querySelectorAll('.keno-pattern-tile.selected').length;

            if (tile.classList.contains('selected')) {
                tile.classList.remove('selected');
            } else if (selectedCount < 10) {
                tile.classList.add('selected');
            } else {
                showNotification("You can only select up to 10 tiles.", "error");
            }
        }
    }

    // --- Pattern Dragging Logic ---
    function handlePatternGridDragStart(e) {
        const animType = document.getElementById('pattern-animation-type').value;
        const animEnabled = document.getElementById('pattern-animation-enable').checked;
        if (!animEnabled || animType !== 'custom') return; // Only drag in custom anim mode

        const tile = e.target.closest('.keno-pattern-tile');
        if (tile && tile.classList.contains('selected')) {
            e.preventDefault();
            patternCreatorState.isDragging = true;
            patternCreatorState.dragStartTile = parseInt(tile.dataset.number, 10);
            patternCreatorState.dragStartCoords = getTileCoords(patternCreatorState.dragStartTile);
            
            // Get current selected tiles and metadata
            const currentTiles = Array.from(document.querySelectorAll('#keno-pattern-grid .keno-pattern-tile.selected'))
                .map(t => parseInt(t.dataset.number, 10));
            patternCreatorState.currentTiles = currentTiles;
            patternCreatorState.currentMetadata = calculatePatternMetadata(currentTiles);
            
            tile.classList.add('dragging');
        }
    }

    function handlePatternGridDragMove(e) {
        if (!patternCreatorState.isDragging) return;
        
        const tile = e.target.closest('.keno-pattern-tile');
        if (!tile) return; // Moved off grid or onto gap

        e.preventDefault();
        const hoverTile = parseInt(tile.dataset.number, 10);
        const hoverCoords = getTileCoords(hoverTile);

        const metadata = patternCreatorState.currentMetadata;
        if (!metadata) return; // Should not happen

        // Calculate delta from where the drag *started*
        const deltaRow = hoverCoords.row - patternCreatorState.dragStartCoords.row;
        const deltaCol = hoverCoords.col - patternCreatorState.dragStartCoords.col;

        // Find the new anchor (top-left of bounding box)
        let newAnchorRow = metadata.minRow + deltaRow;
        let newAnchorCol = metadata.minCol + deltaCol;
        
        // Constrain anchor to valid grid positions
        newAnchorRow = Math.max(0, Math.min(newAnchorRow, metadata.validAnchorRows));
        newAnchorCol = Math.max(0, Math.min(newAnchorCol, metadata.validAnchorCols));

        // Shift pattern based on *offsets from bounding box*
        const newTiles = shiftPattern(metadata.offsets, newAnchorRow, newAnchorCol);

        // Update grid UI
        document.querySelectorAll('#keno-pattern-grid .keno-pattern-tile').forEach(t => {
            t.classList.toggle('selected', newTiles.includes(parseInt(t.dataset.number, 10)));
        });
    }

    function handlePatternGridDragEnd(e) {
        if (!patternCreatorState.isDragging) return;
        
        e.preventDefault();
        patternCreatorState.isDragging = false;
        patternCreatorState.dragStartTile = null;
        patternCreatorState.dragStartCoords = null;
        patternCreatorState.currentMetadata = null; // Clear metadata cache
        
        document.querySelectorAll('#keno-pattern-grid .keno-pattern-tile.dragging').forEach(t => t.classList.remove('dragging'));
    }

    // --- Pattern Frame Logic ---
    function addPatternFrame() {
        const list = document.getElementById('pattern-animation-frames-list');
        const selectedTiles = Array.from(document.querySelectorAll('#keno-pattern-grid .keno-pattern-tile.selected'))
            .map(t => parseInt(t.dataset.number, 10)).sort((a,b) => a-b);
        
        if (selectedTiles.length === 0) {
            showNotification("Select tiles on the grid to save a frame.", "error");
            return;
        }

        const frameName = `Frame ${list.options.length + 1} (${selectedTiles.length} tiles)`;
        const opt = new Option(frameName, list.options.length);
        opt.dataset.tiles = JSON.stringify(selectedTiles);
        list.add(opt);
        list.selectedIndex = list.options.length - 1; // Select new frame
    }

    function deletePatternFrame() {
        const list = document.getElementById('pattern-animation-frames-list');
        const selectedIndex = list.selectedIndex;
        if (selectedIndex === -1) {
            showNotification("Select a frame to delete.", "error");
            return;
        }
        list.remove(selectedIndex);
        // Re-index subsequent frames
        for (let i = selectedIndex; i < list.options.length; i++) {
            list.options[i].text = `Frame ${i + 1} (${JSON.parse(list.options[i].dataset.tiles).length} tiles)`;
            list.options[i].value = i;
        }
    }

    function movePatternFrame(direction) {
        const list = document.getElementById('pattern-animation-frames-list');
        const index = list.selectedIndex;
        if (index === -1) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= list.options.length) return; // Out of bounds

        // Simple swap
        const otherOpt = list.options[newIndex];
        const currentOpt = list.options[index];

        // Swap data
        const tempText = currentOpt.text;
        const tempTiles = currentOpt.dataset.tiles;
        currentOpt.text = otherOpt.text;
        currentOpt.dataset.tiles = otherOpt.dataset.tiles;
        otherOpt.text = tempText;
        otherOpt.dataset.tiles = tempTiles;

        // Re-index text
        list.options[index].text = `Frame ${index + 1} (${JSON.parse(list.options[index].dataset.tiles).length} tiles)`;
        list.options[newIndex].text = `Frame ${newIndex + 1} (${JSON.parse(list.options[newIndex].dataset.tiles).length} tiles)`;
        
        // Move selection
        list.selectedIndex = newIndex;
    }


    function savePattern() {
        const nameInput = document.getElementById('pattern-name');
        const originalName = nameInput.dataset.originalName || '';
        const newName = nameInput.value.trim();
        if (!newName) {
            showNotification("Pattern name cannot be empty.", "error");
            return;
        }
        if (newName !== originalName && userPatterns[newName]) {
            showNotification("A pattern with this name already exists.", "error");
            return;
        }

        const selectedTiles = Array.from(document.querySelectorAll('#keno-pattern-grid .keno-pattern-tile.selected'))
            .map(t => parseInt(t.dataset.number, 10));

        if (selectedTiles.length === 0 || selectedTiles.length > 10) { // Added max check
            showNotification("Please select between 1 and 10 tiles for the base pattern.", "error");
            return;
        }

        // Calculate metadata for the base pattern
        const metadata = calculatePatternMetadata(selectedTiles);

        // Get animation settings
        const animEnabled = document.getElementById('pattern-animation-enable').checked;
        const animType = document.getElementById('pattern-animation-type').value;
        const animFramesList = document.getElementById('pattern-animation-frames-list');
        let customFrames = [];

        if (animEnabled && animType === 'custom') {
            customFrames = Array.from(animFramesList.options).map(opt => JSON.parse(opt.dataset.tiles));
            if (customFrames.length === 0) {
                 showNotification("Custom animation is enabled, but no frames were saved. Saving pattern without animation.", "info");
            }
        }
        
        const animationSettings = {
            enabled: animEnabled,
            type: animType,
            customFrames: customFrames
        };

        // Delete old pattern if renaming
        if (originalName && newName !== originalName) {
            delete userPatterns[originalName];
            // If the active pattern was this one, clear it
            if (kenoState.userPatternName === originalName) {
                kenoState.type = null;
                kenoState.userPatternName = null;
                kenoState.animation.enabled = false;
            }
        }

        userPatterns[newName] = { 
            tiles: selectedTiles.sort((a,b)=>a-b), // Store sorted base frame
            metadata: metadata,
            animation: animationSettings
        };
        saveUserPatterns();

        document.getElementById('pattern-creator-modal').style.display = 'none';
        log(`Pattern "${newName}" saved.`, "system");
    }

    function editSelectedPattern() {
        const selectedName = document.getElementById('user-pattern-list').value;
        if (selectedName) {
            openPatternCreator(selectedName);
        } else {
            showNotification("Please select a pattern to edit.", "error");
        }
    }

    function deleteSelectedPattern() {
        const selectedName = document.getElementById('user-pattern-list').value;
        if (selectedName && confirm(`Are you sure you want to delete the pattern "${selectedName}"?`)) {
            delete userPatterns[selectedName];
            saveUserPatterns();
            log(`Pattern "${selectedName}" deleted.`, "system");
        }
    }


    // --- ADVANCED STRATEGY LOGIC ---

    function openStrategyModal(strategyName = '') {
        const modal = document.getElementById('strategy-modal');
        const nameInput = document.getElementById('strategy-name');
        const rulesContainer = document.getElementById('strategy-rules-container');
        document.getElementById('strategy-modal-title').textContent = strategyName ? 'Edit Strategy' : 'Create Strategy';
        nameInput.value = strategyName;
        nameInput.dataset.originalName = strategyName;
        rulesContainer.innerHTML = '';

        if (strategyName && advancedStrategies[strategyName]) {
            advancedStrategies[strategyName].forEach(rule => addRuleToModal(rule));
        } else {
            addRuleToModal(); // Add one empty rule by default
        }
        modal.style.display = 'flex';
    }

    function addRuleToModal(rule = {}) {
        const rulesContainer = document.getElementById('strategy-rules-container');
        const ruleDiv = document.createElement('div');
        ruleDiv.className = 'strategy-rule';
        const ruleId = `rule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        ruleDiv.id = ruleId;

        const defaults = {
            conditionType: 'bets', // Default condition type
            playConditionTerm: 'every',
            playConditionValue: 1,
            playConditionBetType: 'lose',
            netGainCondition: 'greater',
            netGainValue: 0,
            multiplierCondition: 'gte',
            multiplierValue: 10,
            action: 'changeTilesRandom', // Default action
            actionValue: '', // For preset/user patterns/notify text
            actionValueRisk: 'medium' // Default risk level for setRisk action
        };
        const currentRule = { ...defaults, ...rule };

        // Ensure numeric values are numbers, provide defaults if NaN
        currentRule.playConditionValue = Number(currentRule.playConditionValue) || defaults.playConditionValue;
        currentRule.netGainValue = Number(currentRule.netGainValue) || defaults.netGainValue;
        currentRule.multiplierValue = Number(currentRule.multiplierValue) || defaults.multiplierValue;

        ruleDiv.innerHTML = `
            <div class="strategy-rule-header">
                <div class="strategy-rule-summary"></div>
                <div class="strategy-rule-controls">
                    <button class="move-btn" data-direction="up" title="Move Up">↑</button>
                    <button class="move-btn" data-direction="down" title="Move Down">↓</button>
                    <button class="remove-btn" title="Remove Rule">&times;</button>
                </div>
            </div>
            <div class="strategy-rule-editor">
                <!-- Condition -->
                <div class="rule-toggle-group">
                    <input type="radio" id="${ruleId}-type-bets" name="${ruleId}-type" value="bets" ${currentRule.conditionType === 'bets' ? 'checked' : ''}>
                    <label for="${ruleId}-type-bets">Play</label>
                    <input type="radio" id="${ruleId}-type-profit" name="${ruleId}-type" value="profit" ${currentRule.conditionType === 'profit' ? 'checked' : ''}>
                    <label for="${ruleId}-type-profit">Net Gain</label>
                    <input type="radio" id="${ruleId}-type-multiplier" name="${ruleId}-type" value="multiplier" ${currentRule.conditionType === 'multiplier' ? 'checked' : ''}>
                    <label for="${ruleId}-type-multiplier">Multiplier</label>
                </div>

                <div class="play-condition-sentence rule-sentence" style="display: ${currentRule.conditionType === 'bets' ? 'flex': 'none'}">
                    <span>On</span>
                    <select class="bot-input play-term">
                        <option value="every">Every</option>
                        <option value="everyStreakOf">Every streak of</option>
                        <option value="firstStreakOf">First streak of</option>
                        <option value="streakGreaterThan">Streak greater than</option>
                    </select>
                    <input type="number" class="bot-input play-value" value="${currentRule.playConditionValue}">
                    <select class="bot-input play-bet-type">
                        <option value="win">Wins</option>
                        <option value="lose">Losses</option>
                        <option value="bet">Games</option>
                    </select>
                </div>
                <div class="net-gain-condition-sentence rule-sentence" style="display: ${currentRule.conditionType === 'profit' ? 'flex': 'none'}">
                    <span>If Net Gain is</span>
                    <select class="bot-input net-gain-condition">
                        <option value="greater">&gt;</option>
                        <option value="less">&lt;</option>
                        <option value="=">=</option>
                    </select>
                    <input type="number" step="any" class="bot-input net-gain-value" value="${currentRule.netGainValue}">
                </div>
                <div class="multiplier-condition-sentence rule-sentence" style="display: ${currentRule.conditionType === 'multiplier' ? 'flex': 'none'}">
                    <span>If Multiplier is</span>
                    <select class="bot-input multiplier-condition">
                        <option value="gte">≥</option>
                        <option value="lte">≤</option>
                        <option value="eq">=</option>
                    </select>
                    <input type="number" step="any" class="bot-input multiplier-value" value="${currentRule.multiplierValue}">
                    <span>x</span>
                </div>

                <!-- Action -->
                <div class="action-sentence rule-sentence">
                    <span>Do</span>
                    <select class="bot-input action-type">
                        <option value="changeTilesRandom">Change Tiles (Random)</option>
                        <option value="changeTilesPreset">Change Tiles (Preset)</option>
                        <option value="changeTilesUser">Change Tiles (User Pattern)</option>
                        <option value="setRiskLevel">Set Risk Level</option> <!-- Added Risk -->
                        <option value="changeSeed">Change Seed (API)</option> <!-- Added Seed -->
                        <option value="stop">Stop Autoplay</option>
                        <option value="notify">Show Notification</option>
                    </select>

                    <select class="bot-input action-value-preset" style="display: none;"></select>
                    <select class="bot-input action-value-user strategy-action-pattern-select" style="display: none;"></select>
                    <select class="bot-input action-value-risk" style="display: none;">
                        <option value="classic">Classic</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <input type="text" class="bot-input action-value-text" style="display: none;" placeholder="Notification message...">
                </div>
            </div>
        `;
        rulesContainer.appendChild(ruleDiv);

        // Populate dynamic dropdowns
        const presetSelect = ruleDiv.querySelector('.action-value-preset');
        presetSelect.innerHTML = ''; // Clear existing
        for (const pKey in patterns) {
            for (const posKey in patterns[pKey]) {
                const name = `${pKey.replace(/_/g, ' ')} - ${posKey}`;
                const value = `${pKey}:${posKey}`;
                presetSelect.add(new Option(name, value));
            }
        }

        const userSelect = ruleDiv.querySelector('.action-value-user');
        userSelect.innerHTML = ''; // Clear existing
        for (const name in userPatterns) {
            userSelect.add(new Option(name, name));
        }

        // Set current values from 'currentRule' object
        ruleDiv.querySelector('.play-term').value = currentRule.playConditionTerm;
        ruleDiv.querySelector('.play-bet-type').value = currentRule.playConditionBetType;
        ruleDiv.querySelector('.net-gain-condition').value = currentRule.netGainCondition;
        ruleDiv.querySelector('.multiplier-condition').value = currentRule.multiplierCondition;
        ruleDiv.querySelector('.action-type').value = currentRule.action;

        // Set action value based on action type
        const riskSelect = ruleDiv.querySelector('.action-value-risk');
        if (currentRule.action === 'changeTilesPreset') {
            presetSelect.value = currentRule.actionValue;
        } else if (currentRule.action === 'changeTilesUser') {
            userSelect.value = currentRule.actionValue;
        } else if (currentRule.action === 'setRiskLevel') {
            riskSelect.value = currentRule.actionValueRisk; // Use separate field
        } else if (currentRule.action === 'notify') {
            ruleDiv.querySelector('.action-value-text').value = currentRule.actionValue;
        }
        // 'changeSeed', 'stop', 'changeTilesRandom' have no value field


        const updateVisibility = () => {
            // Update condition visibility
            const type = ruleDiv.querySelector(`input[name="${ruleId}-type"]:checked`)?.value || 'bets';
            ruleDiv.querySelector('.play-condition-sentence').style.display = type === 'bets' ? 'flex' : 'none';
            ruleDiv.querySelector('.net-gain-condition-sentence').style.display = type === 'profit' ? 'flex' : 'none';
            ruleDiv.querySelector('.multiplier-condition-sentence').style.display = type === 'multiplier' ? 'flex' : 'none';

            // Update action value visibility
            const actionType = ruleDiv.querySelector('.action-type').value;
            ruleDiv.querySelector('.action-value-preset').style.display = actionType === 'changeTilesPreset' ? 'block' : 'none';
            ruleDiv.querySelector('.action-value-user').style.display = actionType === 'changeTilesUser' ? 'block' : 'none';
            ruleDiv.querySelector('.action-value-risk').style.display = actionType === 'setRiskLevel' ? 'block' : 'none';
            ruleDiv.querySelector('.action-value-text').style.display = actionType === 'notify' ? 'block' : 'none';

            updateSummary();
        };

        const updateSummary = () => {
            const summary = ruleDiv.querySelector('.strategy-rule-summary');
            if (!summary) return; // Exit if element not found

            const type = ruleDiv.querySelector(`input[name="${ruleId}-type"]:checked`)?.value || 'bets';
            let conditionText = '';

            try {
                if (type === 'bets') {
                    const termEl = ruleDiv.querySelector('.play-term');
                    const valueEl = ruleDiv.querySelector('.play-value');
                    const betTypeEl = ruleDiv.querySelector('.play-bet-type');
                    conditionText = `On ${termEl.options[termEl.selectedIndex]?.textContent || '?'} ${valueEl.value} ${betTypeEl.options[betTypeEl.selectedIndex]?.textContent || '?'}`;
                } else if (type === 'profit') {
                    const opEl = ruleDiv.querySelector('.net-gain-condition');
                    const valueEl = ruleDiv.querySelector('.net-gain-value');
                    conditionText = `If Net Gain ${opEl.options[opEl.selectedIndex]?.textContent || '?'} ${valueEl.value}`;
                } else if (type === 'multiplier') {
                    const opEl = ruleDiv.querySelector('.multiplier-condition');
                    const valueEl = ruleDiv.querySelector('.multiplier-value');
                    conditionText = `If Multiplier ${opEl.options[opEl.selectedIndex]?.textContent || '?'} ${valueEl.value}x`;
                }
            } catch (e) {
                console.error("Error updating condition summary:", e);
                conditionText = "Error";
            }

            const actionTypeSelect = ruleDiv.querySelector('.action-type');
            const actionText = actionTypeSelect.options[actionTypeSelect.selectedIndex]?.textContent || '?';
            let actionValueText = '';

            try {
                const actionType = actionTypeSelect.value;
                if (actionType === 'changeTilesPreset') {
                    const presetSelectEl = ruleDiv.querySelector('.action-value-preset');
                    actionValueText = ` to ${presetSelectEl.options[presetSelectEl.selectedIndex]?.textContent || 'N/A'}`;
                } else if (actionType === 'changeTilesUser') {
                    const userSelectEl = ruleDiv.querySelector('.action-value-user');
                    actionValueText = ` to ${userSelectEl.value || 'N/A'}`;
                } else if (actionType === 'setRiskLevel') {
                    const riskSelectEl = ruleDiv.querySelector('.action-value-risk');
                    actionValueText = ` to ${riskSelectEl.options[riskSelectEl.selectedIndex]?.textContent || 'N/A'}`;
                } else if (actionType === 'notify') {
                    actionValueText = ` "${ruleDiv.querySelector('.action-value-text')?.value || ''}"`;
                }
                // Actions like 'stop', 'changeSeed', 'changeTilesRandom' have no specific value text
            } catch (e) {
                console.error("Error updating action summary:", e);
                actionValueText = " Error";
            }

            summary.innerHTML = `<span>${conditionText} →</span><span class="summary-action">${actionText}${actionValueText}</span>`;
        };


        // Add event listeners
        const header = ruleDiv.querySelector('.strategy-rule-header');
        if (header) {
            header.addEventListener('click', (e) => {
                // Prevent toggling when clicking buttons
                if (!e.target.matches('.move-btn, .remove-btn')) {
                    ruleDiv.classList.toggle('expanded');
                    updateSummary(); // Update summary when toggling
                }
            });
        }

        // Update visibility and summary on any input/select change within the editor
        ruleDiv.querySelectorAll('.strategy-rule-editor input, .strategy-rule-editor select').forEach(el => {
            el.addEventListener('change', updateVisibility);
            el.addEventListener('input', updateSummary); // Also update summary on input for text/number fields
        });

        const removeBtn = ruleDiv.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                ruleDiv.remove();
                // If no rules left, add a default one back? Or handle in saveStrategy
            });
        }

        ruleDiv.querySelectorAll('.move-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent header click toggle
                const direction = e.target.dataset.direction;
                const parent = ruleDiv.parentNode;
                if (direction === 'up' && ruleDiv.previousElementSibling) {
                    parent.insertBefore(ruleDiv, ruleDiv.previousElementSibling);
                } else if (direction === 'down' && ruleDiv.nextElementSibling) {
                    parent.insertBefore(ruleDiv.nextElementSibling, ruleDiv);
                }
            });
        });

        // Initial setup
        updateVisibility(); // Set initial visibility based on currentRule
    }


    function saveStrategy() {
        const nameInput = document.getElementById('strategy-name');
        const originalName = nameInput.dataset.originalName;
        const newName = nameInput.value.trim();
        if (!newName) {
            showNotification('Strategy name cannot be empty.', "error");
            return;
        }
        if (newName !== originalName && advancedStrategies[newName]) {
            showNotification('A strategy with this name already exists.', "error");
            return;
        }

        const rules = [];
        let ruleError = false;
        document.querySelectorAll('.strategy-rule').forEach((ruleDiv, index) => {
            if (ruleError) return; // Stop processing if error found

            const action = ruleDiv.querySelector('.action-type').value;
            let actionValue = ''; // Default for actions without specific value
            let actionValueRisk = 'medium'; // Default for setRiskLevel

            try {
                if (action === 'changeTilesPreset') {
                    actionValue = ruleDiv.querySelector('.action-value-preset').value;
                } else if (action === 'changeTilesUser') {
                    actionValue = ruleDiv.querySelector('.action-value-user').value;
                    if (!actionValue) throw new Error(`User Pattern not selected for rule ${index + 1}`);
                } else if (action === 'setRiskLevel') {
                    actionValueRisk = ruleDiv.querySelector('.action-value-risk').value;
                } else if (action === 'notify') {
                    actionValue = ruleDiv.querySelector('.action-value-text').value;
                }

                rules.push({
                    conditionType: ruleDiv.querySelector('input[name*="-type"]:checked').value,
                    playConditionTerm: ruleDiv.querySelector('.play-term').value,
                    playConditionValue: parseFloat(ruleDiv.querySelector('.play-value').value) || 1,
                    playConditionBetType: ruleDiv.querySelector('.play-bet-type').value,
                    netGainCondition: ruleDiv.querySelector('.net-gain-condition').value,
                    netGainValue: parseFloat(ruleDiv.querySelector('.net-gain-value').value) || 0,
                    multiplierCondition: ruleDiv.querySelector('.multiplier-condition').value,
                    multiplierValue: parseFloat(ruleDiv.querySelector('.multiplier-value').value) || 10,
                    action: action,
                    actionValue: actionValue, // Store preset/user pattern name or notify text
                    actionValueRisk: actionValueRisk // Store risk level separately
                });
            } catch (e) {
                showNotification(`Error saving rule ${index + 1}: ${e.message}`, "error");
                ruleError = true;
            }
        });

        if (ruleError) return; // Don't save if errors occurred

        if (rules.length === 0) {
            showNotification('Strategy must have at least one rule.', "error");
            return;
        }

        if (originalName && originalName !== newName) {
            delete advancedStrategies[originalName];
        }
        advancedStrategies[newName] = rules;
        saveStrategies();
        document.getElementById('strategy-modal').style.display = 'none';
        log(`Strategy '${newName}' saved.`, "system");
    }

    // ... (editSelectedStrategy, deleteSelectedStrategy remain the same) ...
    function editSelectedStrategy() {
        const selectedName = document.getElementById('advanced-strategy-list').value;
        if (selectedName) {
            openStrategyModal(selectedName);
        } else {
            showNotification('Please select a strategy to edit.', "error");
        }
    }

    function deleteSelectedStrategy() {
        const selectedName = document.getElementById('advanced-strategy-list').value;
        if (selectedName && confirm(`Are you sure you want to delete the strategy "${selectedName}"?`)) {
            delete advancedStrategies[selectedName];
            saveStrategies();
            log(`Strategy '${selectedName}' deleted.`, "system");
        }
    }


    async function executeAdvancedStrategy(rules) {
        const currentStrategyName = document.getElementById('auto-strategy-select').value || document.getElementById('manual-strategy-select').value;
        let actionTaken = false; // Flag to ensure only one action per bet cycle if needed
        let tileActionTaken = false; // Flag if a tile-changing action was performed

        // Reset persistent trigger flags if their conditions are no longer met
        for (const ruleKey in botState.persistentTriggerStates) {
            const [strategyName, ruleIndexStr] = ruleKey.split('-');
            const ruleIndex = parseInt(ruleIndexStr, 10);
            if (strategyName !== currentStrategyName || !advancedStrategies[strategyName] || !advancedStrategies[strategyName][ruleIndex]) {
                delete botState.persistentTriggerStates[ruleKey];
                continue;
            }
            const rule = advancedStrategies[strategyName][ruleIndex];
            const isConditionMet = checkCondition(rule);
            if (!isConditionMet) {
                delete botState.persistentTriggerStates[ruleKey];
                log(`Persistent trigger for Rule #${ruleIndex + 1} reset.`, "strategy");
            }
        }

        for (const [index, rule] of rules.entries()) {
            if (actionTaken) break; // Optional: Stop after first matching rule action

            const conditionMet = checkCondition(rule);
            if (conditionMet) {
                log(`<b>Strategy Trigger:</b> Rule #${index + 1}`, "strategy");

                const isPersistentCondition = ['profit', 'multiplier'].includes(rule.conditionType);
                const ruleKey = `${currentStrategyName}-${index}`;

                if (isPersistentCondition) {
                    if (botState.persistentTriggerStates[ruleKey]) {
                        log(`&nbsp;&nbsp;↳ Action skipped: Persistent trigger already fired.`, "strategy");
                        continue; // Skip this rule, check next one
                    }
                    botState.persistentTriggerStates[ruleKey] = true; // Mark as fired for this condition met cycle
                }

                let currentActionSuccess = true; // Assume success unless action fails
                switch (rule.action) {
                    case 'changeTilesRandom':
                        log(`&nbsp;&nbsp;↳ Action: Changing tiles to Random.`, "strategy");
                        currentActionSuccess = await pickAndApplyRandomPattern();
                        tileActionTaken = true;
                        break;
                    case 'changeTilesPreset':
                        const [pKey, posKey] = rule.actionValue.split(':');
                        const presetPattern = patterns[pKey]?.[posKey];
                        if (presetPattern) {
                            log(`&nbsp;&nbsp;↳ Action: Changing tiles to Preset ${pKey.replace('_',' ')} - ${posKey}.`, "strategy");
                            currentActionSuccess = await pickTilesByNumbers(presetPattern);
                        } else {
                            log(`&nbsp;&nbsp;↳ Action Failed: Preset pattern ${rule.actionValue} not found.`, "error");
                            currentActionSuccess = false;
                        }
                        tileActionTaken = true;
                        break;
                    case 'changeTilesUser':
                        const userPattern = userPatterns[rule.actionValue];
                        if (userPattern) {
                            log(`&nbsp;&nbsp;↳ Action: Changing tiles to User Pattern "${rule.actionValue}".`, "strategy");
                            // Apply base frame, not animation
                            currentActionSuccess = await pickTilesByNumbers(userPattern.tiles); 
                        } else {
                            log(`&nbsp;&nbsp;↳ Action Failed: User pattern "${rule.actionValue}" not found.`, "error");
                            currentActionSuccess = false;
                        }
                        tileActionTaken = true;
                        break;
                    case 'setRiskLevel':
                        log(`&nbsp;&nbsp;↳ Action: Setting risk level to ${rule.actionValueRisk}.`, "strategy");
                        currentActionSuccess = await setRiskLevel(rule.actionValueRisk);
                        break;
                    case 'changeSeed':
                        log(`&nbsp;&nbsp;↳ Action: Changing client seed.`, "strategy");
                        // Note: changeSeedProgrammatically handles its own logging/status
                        currentActionSuccess = await changeSeedProgrammatically();
                        break;
                    case 'stop':
                        log(`&nbsp;&nbsp;↳ Action: Stopping autoplay.`, "strategy");
                        if (botState.running) toggleBot();
                        // No need to set currentActionSuccess = false, stopping is intentional
                        actionTaken = true; // Ensure loop terminates
                        return false; // Signal to stop the autoBetLoop
                    case 'notify':
                        log(`&nbsp;&nbsp;↳ Action: Sent notification: "${rule.actionValue}"`, "strategy");
                        showNotification(rule.actionValue);
                        // Notification doesn't affect betting flow, don't set actionTaken=true unless intended
                        break;
                }

                actionTaken = true; // Indicate an action was attempted or performed

                // If the action failed (like picking tiles), maybe stop the bot?
                if (!currentActionSuccess) {
                    log("Strategy action failed. Stopping bot.", "error");
                    if (botState.running) toggleBot();
                    return false; // Signal failure
                }

                // If only one action per cycle is desired, uncomment the break:
                // break;
            }
        }

        // If NO strategy rule was met OR no rule changed the tiles,
        // we must ensure the *current* pattern (animated or static) is applied.
        if (!tileActionTaken) {
            const patternSet = await applyCurrentPattern();
            if (!patternSet) {
                log("Failed to apply default pattern after strategy check. Stopping bot.", "error");
                if (botState.running) toggleBot();
                return false; // Signal failure
            }
            return true; // Signal success (default pattern applied)
        }


        return true; // Indicate strategy execution completed (successfully or intentionally stopped)
    }

    // ... (checkCondition, saveStrategies, loadStrategies remain similar) ...
    function checkCondition(rule) {
        switch (rule.conditionType) {
            case 'bets': {
                const value = rule.playConditionValue;
                const betType = rule.playConditionBetType;
                const isWin = betType === 'win';
                const streak = isWin ? botState.winStreak : botState.lossStreak;

                switch (rule.playConditionTerm) {
                    case 'every':
                        if (betType === 'bet' && botState.betCount > 0 && botState.betCount % value === 0) return true;
                        // Trigger on the bet *after* the streak hits the multiple
                        if (betType === 'win' && botState.lastBetWasWin === false && botState.winStreak > 0 && botState.winStreak % value === 0) return true; // Just ended a win streak of multiple
                        if (betType === 'lose' && botState.lastBetWasWin === true && botState.lossStreak > 0 && botState.lossStreak % value === 0) return true; // Just ended a loss streak of multiple
                        break;
                    case 'everyStreakOf':
                        // Trigger on the bet *after* the streak hits the multiple
                        if (betType === 'win' && botState.lastBetWasWin === false && botState.winStreak > 0 && botState.winStreak % value === 0) return true; // Just ended a win streak of multiple
                        if (betType === 'lose' && botState.lastBetWasWin === true && botState.lossStreak > 0 && botState.lossStreak % value === 0) return true; // Just ended a loss streak of multiple
                        break;
                    case 'firstStreakOf':
                        const flag = `firstStreak-${rule.playConditionBetType}-${rule.playConditionValue}`;
                        // Check if the streak *just hit* the target value
                        let justHitStreak = false;
                        if (betType === 'win' && botState.lastBetWasWin === true && streak === value) justHitStreak = true;
                        if (betType === 'lose' && botState.lastBetWasWin === false && streak === value) justHitStreak = true;

                        if (justHitStreak && !botState.strategyFlags[flag]) {
                            botState.strategyFlags[flag] = true; // Mark as triggered
                            return true;
                        }
                        // Reset flag if streak broken or goes beyond target value
                        if ((betType === 'win' && !botState.lastBetWasWin) || (betType === 'lose' && botState.lastBetWasWin)) {
                            // Check all flags related to this bet type and reset if streak is broken
                            Object.keys(botState.strategyFlags).forEach(key => {
                                if (key.startsWith(`firstStreak-${rule.playConditionBetType}-`)) {
                                    botState.strategyFlags[key] = false;
                                }
                            });
                        }
                        break;
                    case 'streakGreaterThan':
                        // Trigger if current streak is already greater
                        if (betType !== 'bet' && streak > value) return true;
                        break;
                }
                break;
            }
            case 'profit':
                if (rule.netGainCondition === 'greater' && botState.totalProfit > rule.netGainValue) return true;
                if (rule.netGainCondition === 'less' && botState.totalProfit < rule.netGainValue) return true;
                if (rule.netGainCondition === '=' && botState.totalProfit.toFixed(8) == rule.netGainValue.toFixed(8)) return true; // Use comparison with tolerance if needed
                break;
            case 'multiplier':
                if (botState.lastMultiplier <= 0) return false; // Only trigger if last bet had a multiplier (was a win)
                if (rule.multiplierCondition === 'gte' && botState.lastMultiplier >= rule.multiplierValue) return true;
                if (rule.multiplierCondition === 'lte' && botState.lastMultiplier <= rule.multiplierValue) return true;
                if (rule.multiplierCondition === 'eq' && botState.lastMultiplier === rule.multiplierValue) return true; // Use comparison with tolerance if needed
                break;
        }
        return false;
    }

    function saveStrategies() {
        localStorage.setItem('stakeKenoBotStrategies', JSON.stringify(advancedStrategies));
        populateStrategyDropdowns();
    }

    function loadStrategies() {
        const saved = localStorage.getItem('stakeKenoBotStrategies');
        if (saved) {
            try {
                advancedStrategies = JSON.parse(saved);
                // Basic validation: ensure it's an object
                if (typeof advancedStrategies !== 'object' || advancedStrategies === null) {
                    throw new Error("Invalid format: not an object.");
                }
                // Optional: Deeper validation of rules structure if needed
            } catch (e) {
                log(`Failed to load strategies: ${e.message}. Resetting to empty.`, "error");
                console.error("Failed to load strategies:", e);
                advancedStrategies = {};
                localStorage.removeItem('stakeKenoBotStrategies'); // Clear invalid data
            }
        } else {
            advancedStrategies = {}; // Initialize if not found
        }
    }


    function populateStrategyDropdowns() {
        const autoSelect = document.getElementById('auto-strategy-select');
        const manualSelect = document.getElementById('manual-strategy-select'); // Get new element
        const advancedList = document.getElementById('advanced-strategy-list');
        const rulePresetSelects = document.querySelectorAll('.action-value-preset'); // For presets in rules
        const ruleUserSelects = document.querySelectorAll('.action-value-user'); // For user patterns in rules

        // Preserve selections
        const selectedAuto = autoSelect.value;
        const selectedManual = manualSelect ? manualSelect.value : 'none'; // Get new value
        const selectedAdvanced = advancedList.value;

        // Clear existing options (keep the "-- Select --" or similar default option)
        advancedList.innerHTML = '';
        while (autoSelect.options.length > 1) autoSelect.remove(1);
        if (manualSelect) {
            while (manualSelect.options.length > 1) manualSelect.remove(1); // Clear new select
        }
        rulePresetSelects.forEach(sel => sel.innerHTML = '');
        ruleUserSelects.forEach(sel => sel.innerHTML = '');


        // Populate Strategy Lists/Selects
        for (const name in advancedStrategies) {
            advancedList.add(new Option(name, name));
            autoSelect.add(new Option(name, name));
            if (manualSelect) manualSelect.add(new Option(name, name)); // Add to new select
        }

        // Populate Preset Patterns in Rule Modals
        for (const pKey in patterns) {
            for (const posKey in patterns[pKey]) {
                const name = `${pKey.replace(/_/g, ' ')} - ${posKey}`;
                const value = `${pKey}:${posKey}`;
                rulePresetSelects.forEach(sel => sel.add(new Option(name, value)));
            }
        }

        // Populate User Patterns in Rule Modals
        for (const name in userPatterns) {
            ruleUserSelects.forEach(sel => sel.add(new Option(name, name)));
        }


        // Restore previous selections if they still exist
        autoSelect.value = (selectedAuto === 'none' || advancedStrategies[selectedAuto]) ? selectedAuto : 'none';
        if (manualSelect) manualSelect.value = (selectedManual === 'none' || advancedStrategies[selectedManual]) ? selectedManual : 'none'; // Restore new select
        advancedList.value = advancedStrategies[selectedAdvanced] ? selectedAdvanced : '';

        // If the advanced list is empty, add a disabled placeholder
        if (advancedList.options.length === 0) {
            advancedList.add(new Option("No strategies created", ""));
            advancedList.options[0].disabled = true;
        }
    }


    // ... (exportSelectedStrategy, importStrategy remain the same) ...
    function exportSelectedStrategy() {
        const selectedName = document.getElementById('advanced-strategy-list').value;
        if (!selectedName || !advancedStrategies[selectedName]) {
            showNotification("Please select a valid strategy to export.", "error");
            return;
        }
        const strategyData = { name: selectedName, rules: advancedStrategies[selectedName] };
        const blob = new Blob([JSON.stringify(strategyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedName}.keno-strategy.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        log(`Strategy '${selectedName}' exported.`, "system");
    }

    function importStrategy() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.keno-strategy'; // Allow specific extension too
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = readerEvent => {
                try {
                    const strategyData = JSON.parse(readerEvent.target.result);
                    // Basic Validation
                    if (!strategyData.name || typeof strategyData.name !== 'string' || !Array.isArray(strategyData.rules)) {
                        throw new Error("Invalid strategy file format (missing name or rules array).");
                    }
                    // Optional: Add deeper validation of rule structure here if needed

                    if (advancedStrategies[strategyData.name]) {
                        if (!confirm(`A strategy named "${strategyData.name}" already exists. Overwrite it?`)) {
                            return; // User cancelled overwrite
                        }
                    }
                    advancedStrategies[strategyData.name] = strategyData.rules;
                    saveStrategies(); // Save and repopulate dropdowns
                    showNotification(`Strategy "${strategyData.name}" imported successfully!`);
                    log(`Strategy '${strategyData.name}' imported.`, "system");
                } catch (err) {
                    showNotification(`Failed to import strategy: ${err.message}`, "error");
                    console.error("Import error:", err);
                }
            };
            reader.onerror = () => {
                showNotification(`Error reading file: ${reader.error}`, "error");
                console.error("File reading error:", reader.error);
            }
            reader.readAsText(file);
        };
        input.click();
    }


    // --- CONFIGURATION MANAGEMENT ---

    function populateConfigTab() {
        const container = document.getElementById('config-container');
        container.innerHTML = ''; // Clear previous content

        // Add Auth Token and Endpoint first (if needed for seed change)
        const seedChangeKeys = ['authToken', 'seedChangeEndpoint'];
        seedChangeKeys.forEach(key => {
            if (key in CONFIG) { // Check if key exists in CONFIG
                const friendlyName = CONFIG_FRIENDLY_NAMES[key] || key;
                const group = document.createElement('div');
                group.className = 'config-group';
                const labelHtml = `<label for="config-${key}">${friendlyName}</label>`;
                let inputWrapperHtml = '';

                if (key === 'authToken') {
                    inputWrapperHtml = `
                        <div class="input-wrapper">
                            <input type="password" id="config-${key}" class="bot-input" value="${CONFIG[key]}" placeholder="Auto-detected or paste here">
                            <button class="config-toggle-vis-btn" data-target="config-${key}" title="Toggle visibility">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                        </div>`;
                } else {
                    inputWrapperHtml = `
                        <div class="input-wrapper">
                            <input type="text" id="config-${key}" class="bot-input" value="${CONFIG[key]}">
                        </div>`;
                }
                group.innerHTML = `${labelHtml}${inputWrapperHtml}`;
                container.appendChild(group);
            }
        });


        // Add the rest of the config options
        for (const key in CONFIG) {
            if (seedChangeKeys.includes(key)) continue; // Skip already added keys

            const friendlyName = CONFIG_FRIENDLY_NAMES[key] || key;
            const group = document.createElement('div');
            group.className = 'config-group';

            const labelHtml = `<label for="config-${key}">${friendlyName}</label>`;
            let inputWrapperHtml = '';

            if (typeof CONFIG[key] === 'boolean') {
                inputWrapperHtml = `
                    <div class="input-wrapper">
                        <input type="checkbox" id="config-${key}" class="bot-input" ${CONFIG[key] ? 'checked' : ''}>
                    </div>
                `;
            } else if (key === 'uiScale') {
                inputWrapperHtml = `
                    <div class="input-wrapper" style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="config-uiScale" class="bot-input" min="50" max="150" value="${CONFIG[key]}" style="flex-grow: 1; padding: 0;">
                        <span id="config-uiScale-value" style="flex-basis: 40px; text-align: right;">${CONFIG[key]}%</span>
                    </div>
                `;
            } else {
                const isSelector = !["uiScale", "injectControlsToPage", "autoGames"].includes(key);
                inputWrapperHtml = `
                    <div class="input-wrapper">
                        <input type="${typeof CONFIG[key] === 'number' ? 'number' : 'text'}" id="config-${key}" class="bot-input" value="${CONFIG[key]}" ${key === 'autoGames' ? 'min="0"' : ''}>
                        ${isSelector ? `<button class="config-pick-btn" data-key="${key}" title="Pick element from page">Pick</button>` : ''}
                    </div>
                `;
            }

            group.innerHTML = `${labelHtml}${inputWrapperHtml}`;
            container.appendChild(group);
        }

        // Add event listeners after creating elements
        container.querySelectorAll('.config-pick-btn').forEach(btn => btn.addEventListener('click', (e) => initSelectorPicker(e.target.dataset.key)));
        container.querySelectorAll('.config-toggle-vis-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetInput = document.getElementById(e.currentTarget.dataset.target);
                if (targetInput) {
                    const isPassword = targetInput.type === 'password';
                    targetInput.type = isPassword ? 'text' : 'password';
                    // Optional: Change icon based on visibility state
                }
            });
        });

        const uiScaleSlider = document.getElementById('config-uiScale');
        if (uiScaleSlider) {
            const uiScaleValue = document.getElementById('config-uiScale-value');
            uiScaleSlider.addEventListener('input', () => {
                const scale = uiScaleSlider.value;
                uiScaleValue.textContent = `${scale}%`;
                applyUiScale(scale); // Apply scale change immediately
            });
        }
    }


    // ... (initSelectorPicker, generateSelector remain the same) ...
    function initSelectorPicker(configKey) {
        if (botState.isPickingElement) return;
        botState.isPickingElement = true;
        const overlay = document.getElementById('element-picker-overlay');
        const tooltip = document.getElementById('element-picker-tooltip');
        overlay.style.display = 'block';
        tooltip.style.display = 'block';

        const mouseMoveHandler = (e) => {
            try { // Add try-catch for safety during interaction
                const target = e.target;
                // Don't highlight self or children
                if (!target || target.id === 'keno-bot-window' || target.closest('#keno-bot-window') || target.id === 'element-picker-tooltip' || target.id === 'element-picker-overlay') {
                    overlay.style.display = 'none';
                    return;
                }
                overlay.style.display = 'block';
                const rect = target.getBoundingClientRect();
                Object.assign(overlay.style, {
                    width: `${rect.width}px`, height: `${rect.height}px`,
                    top: `${window.scrollY + rect.top}px`, // Account for scrolling
                    left: `${window.scrollX + rect.left}px` // Account for scrolling
                });
            } catch (err) {
                console.error("Error in mouseMoveHandler:", err);
                // Optionally hide overlay on error
                // overlay.style.display = 'none';
            }
        };


        const clickHandler = (e) => {
            try { // Add try-catch for safety during interaction
                e.preventDefault();
                e.stopPropagation();
                const target = e.target;
                if (!target || target.id === 'keno-bot-window' || target.closest('#keno-bot-window') || target.id === 'element-picker-tooltip' || target.id === 'element-picker-overlay') return;

                const selector = generateSelector(target);
                const inputElement = document.getElementById(`config-${configKey}`);
                if (inputElement) {
                    inputElement.value = selector;
                    log(`Picked selector for ${configKey}: ${selector}`, "system");
                } else {
                    log(`Error: Could not find config input for ${configKey}`, "error");
                }
                cleanup(); // Clean up listeners and UI elements
            } catch (err) {
                console.error("Error in clickHandler:", err);
                cleanup(); // Ensure cleanup happens even on error
            }
        };


        const escHandler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                cleanup();
                log("Element picking cancelled.", "system");
            }
        };

        const cleanup = () => {
            if (!botState.isPickingElement) return; // Prevent multiple cleanups
            document.removeEventListener('mousemove', mouseMoveHandler, true); // Use capture phase
            document.removeEventListener('click', clickHandler, true);     // Use capture phase
            document.removeEventListener('keydown', escHandler, true);   // Use capture phase
            if (overlay) overlay.style.display = 'none';
            if (tooltip) tooltip.style.display = 'none';
            botState.isPickingElement = false;
        };

        // Attach listeners with capture phase to potentially override page listeners
        document.addEventListener('mousemove', mouseMoveHandler, true);
        document.addEventListener('click', clickHandler, true);
        document.addEventListener('keydown', escHandler, true);
    }

    function generateSelector(el) {
        if (!el) return '';
        // Prioritize data-testid
        const testId = el.getAttribute('data-testid');
        if (testId) return `[data-testid="${testId}"]`;

        // Fallback to data-test
        const dataTest = el.getAttribute('data-test');
        if (dataTest) return `[data-test="${dataTest}"]`;

        // Fallback to ID if unique enough
        if (el.id) {
            // Basic check if ID seems specific (avoids generic IDs like 'app')
            // You might need more robust checks depending on the site structure
            if (!/^(app|main|container|wrapper|root)/i.test(el.id)) {
                try {
                    if (document.querySelectorAll(`#${el.id}`).length === 1) {
                        return `#${el.id.replace(/:/g, '\\:')}`; // Escape colons if any
                    }
                } catch (e) { /* Invalid ID syntax */ }
            }
        }

        // Fallback to class names, filtering out dynamic/common ones
        if (el.className && typeof el.className === 'string') {
            const classNames = el.className.split(' ')
                .filter(c => c && !/^(svelte-|active|focus|hover)/i.test(c) && c.length > 2) // Filter common/dynamic classes
                .map(c => `.${c.replace(/:/g, '\\:')}`) // Escape colons
                .join('');
            if (classNames) {
                try {
                    // Check if the combination is reasonably specific
                    if (document.querySelectorAll(classNames).length < 5) { // Adjust threshold as needed
                        return classNames;
                    }
                } catch (e) { /* Invalid class syntax */ }
            }
        }

        // Absolute fallback: Tag name (least specific)
        return el.tagName.toLowerCase();
    }


    function saveConfig() {
        const newConfig = { ...CONFIG };
        let configChanged = false;
        for (const key in CONFIG) {
            const el = document.getElementById(`config-${key}`);
            if (el) {
                let newValue;
                if (typeof CONFIG[key] === 'boolean') {
                    newValue = el.checked;
                } else if (typeof CONFIG[key] === 'number') {
                    // Use parseFloat for potentially decimal numbers, fallback to 0
                    newValue = parseFloat(el.value) || 0;
                    if (key === 'autoGames') newValue = Math.max(0, Math.floor(newValue)); // Ensure non-negative integer
                } else { // String
                    newValue = el.value.trim(); // Trim whitespace from strings
                }

                // Only update if the value actually changed
                if (newConfig[key] !== newValue) {
                    newConfig[key] = newValue;
                    configChanged = true;
                }
            }
        }

        if (configChanged) {
            localStorage.setItem('stakeKenoBotConfig', JSON.stringify(newConfig));
            CONFIG = newConfig; // Update the live CONFIG object
            showNotification('Configuration saved!');
            log("Configuration saved.", "system");

            // Handle injection change immediately
            const injectedControls = document.getElementById('keno-custom-controls-original');
            if (CONFIG.injectControlsToPage && !injectedControls) {
                originalInjectControls();
            } else if (!CONFIG.injectControlsToPage && injectedControls) {
                injectedControls.remove();
                log("Removed injected controls from page.", "system");
            }
            // Re-populate might be needed if selectors changed drastically, but usually not necessary
            // populateConfigTab();
        } else {
            showNotification('No changes detected in configuration.');
        }
    }


    function loadConfig() {
        const defaultConfig = {
            authToken: '',
            seedChangeEndpoint: '/_api/graphql',
            betButton: '[data-testid="bet-button"]',
            clearButton: '[data-testid="clear-table-button"]',
            tile: '[data-testid^="tile-"], .tile.svelte-vebeey', // Keep the updated selector
            amountInput: '[data-testid="input-game-amount"]',
            riskSelect: '[data-testid="risk-select"]',
            pastBetsContainer: '.past-bets', // Using a potentially more stable class selector
            injectControlsToPage: false,
            uiScale: 100,
            autoGames: 0,
        };

        let loadedConfig = { ...defaultConfig }; // Start with defaults

        const saved = localStorage.getItem('stakeKenoBotConfig');
        if (saved) {
            try {
                let customConfig = JSON.parse(saved);
                // Merge saved config over defaults, ensuring only known keys are kept
                for (const key in defaultConfig) {
                    if (key in customConfig) {
                        // Basic type checking (can be expanded)
                        if (typeof customConfig[key] === typeof defaultConfig[key]) {
                            loadedConfig[key] = customConfig[key];
                        } else {
                            console.warn(`Config key "${key}" has incorrect type in saved data. Using default.`);
                        }
                    }
                }
                 // Ensure the 'tile' selector uses the correct default if not saved or invalid
                 // Also ensure it includes the fix from v3.3.2 if loaded from an older version
                if (!loadedConfig.tile || typeof loadedConfig.tile !== 'string' || !loadedConfig.tile.includes('.tile.svelte-vebeey')) {
                    loadedConfig.tile = defaultConfig.tile;
                }
                log("Loaded custom config from storage.", "system");
            } catch (e) {
                log("Failed to parse custom config. Using defaults.", "error");
                console.error("Failed to parse custom config from localStorage.", e);
                loadedConfig = { ...defaultConfig }; // Reset to default on parse error
                localStorage.removeItem('stakeKenoBotConfig'); // Clear corrupted data
            }
        } else {
            log("No saved config found. Using defaults.", "system");
        }

        // Auto-detect auth token if not loaded or empty
        if (!loadedConfig.authToken) {
            loadedConfig.authToken = getAuthToken(); // Attempt auto-detection
            if (loadedConfig.authToken) {
                log("Auto-detected auth token.", "system");
            } else {
                log("Could not auto-detect auth token. Seed change may fail.", "system");
            }
        }

        CONFIG = loadedConfig; // Assign the final merged/default config
    }


    function resetConfigToDefault() {
        if (confirm("Are you sure you want to reset all configuration to defaults? This will clear saved settings.")) {
            localStorage.removeItem('stakeKenoBotConfig');
            // Re-call loadConfig to apply the defaults and perform auto-detection again
            loadConfig();
            populateConfigTab(); // Update UI with defaults
            applyUiScale(); // Reset UI scale visual
            showNotification("Configuration has been reset to default.");
            log("Configuration reset to defaults.", "system");

            // Remove injected controls if they exist
            const injectedControls = document.getElementById('keno-custom-controls-original');
            if (injectedControls) {
                injectedControls.remove();
                log("Removed injected controls from page.", "system");
            }
        }
    }


    // --- SECURITY & ADMIN ---

    // ... (hashPassword, loadSecurityConfig, saveCredentials, handleLockUnlock, lockUI, unlockUI, promptForPassword, handleSubmitPassword, updateAdminStatus remain the same) ...
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadSecurityConfig() {
        botState.storedUsername = localStorage.getItem('stakeKenoBotUser') || '';
        botState.storedPasswordHash = localStorage.getItem('stakeKenoBotPassHash') || '';
        document.getElementById('admin-username').value = botState.storedUsername;
    }

    async function saveCredentials() {
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        const newUsername = usernameInput.value.trim();
        const newPassword = passwordInput.value;

        const performSave = async () => {
            let changesMade = false;
            if (newUsername !== botState.storedUsername) {
                botState.storedUsername = newUsername;
                localStorage.setItem('stakeKenoBotUser', botState.storedUsername);
                log("Username updated.", "system");
                changesMade = true;
            }
            if (newPassword) {
                botState.storedPasswordHash = await hashPassword(newPassword);
                localStorage.setItem('stakeKenoBotPassHash', botState.storedPasswordHash);
                passwordInput.value = ''; // Clear password field after hashing
                log("Password updated.", "system");
                updateAdminStatus("Password updated. You can now lock the bot.", "info");
                changesMade = true;
            }
            // If no password exists and no new one provided, but username changed
            if (!botState.storedPasswordHash && !newPassword && newUsername !== localStorage.getItem('stakeKenoBotUser')) {
                changesMade = true; // Still count username change as a change
            }
            // If password exists, but no new one provided, and username changed
            if (botState.storedPasswordHash && !newPassword && newUsername !== localStorage.getItem('stakeKenoBotUser')) {
                changesMade = true; // Still count username change as a change
            }


            if (changesMade) {
                showNotification('Credentials saved!');
            } else {
                showNotification('No changes detected in credentials.');
            }
        };

        // If a password already exists and the user is trying to set a new one OR change username, require current password
        if (botState.storedPasswordHash && (newPassword || newUsername !== botState.storedUsername)) {
            promptForPassword(performSave, "Enter your CURRENT password to save changes.");
        } else {
            // Allow setting initial password or changing username without current password if none is set
            await performSave();
        }
    }

    function handleLockUnlock() {
        if (botState.isLocked) {
            promptForPassword(unlockUI);
        } else {
            if (!botState.storedPasswordHash) {
                showNotification("Please set a password before locking.");
                return;
            }
            lockUI();
        }
    }

    function lockUI() {
        botState.isLocked = true;
        // Force switch to Manual tab upon locking for safety/simplicity
        const manualTabBtn = document.querySelector('.bot-tab-btn[data-tab="manual"]');
        if (manualTabBtn) manualTabBtn.click();

        document.querySelector('.bot-tabs').classList.add('locked');
        const lockBtn = document.getElementById('lock-unlock-btn');
        lockBtn.textContent = "Unlock";
        lockBtn.classList.remove('bot-btn-primary');
        lockBtn.classList.add('bot-btn-danger');
        updateAdminStatus(`Locked by ${botState.storedUsername || 'Admin'}. UI is restricted.`, "locked");
        log("Bot settings locked.", "system");
    }

    function unlockUI() {
        botState.isLocked = false;
        document.querySelector('.bot-tabs').classList.remove('locked');
        const lockBtn = document.getElementById('lock-unlock-btn');
        lockBtn.textContent = "Lock";
        lockBtn.classList.remove('bot-btn-danger');
        lockBtn.classList.add('bot-btn-primary');
        updateAdminStatus("Bot is unlocked. Settings are editable.", "unlocked");
        log("Bot settings unlocked.", "system");
    }

    function promptForPassword(onSuccess, message = "Please enter the password to unlock this feature.") {
        const modal = document.getElementById('password-prompt-modal');
        if (!modal || modal.style.display === 'flex') return; // Prevent multiple prompts

        botState.pendingAction = onSuccess;
        const messageEl = document.getElementById('password-prompt-message');
        const errorEl = document.getElementById('password-prompt-error');
        const inputEl = document.getElementById('prompt-password-input');

        if (messageEl) messageEl.textContent = message;
        if (inputEl) inputEl.value = ""; // Clear previous input
        if (errorEl) errorEl.style.display = 'none'; // Hide previous error

        modal.style.display = 'flex';
        if (inputEl) inputEl.focus(); // Focus input field
    }

    async function handleSubmitPassword() {
        const passwordInput = document.getElementById('prompt-password-input');
        const errorEl = document.getElementById('password-prompt-error');
        if (!passwordInput || !errorEl) return;

        const password = passwordInput.value;
        if (!password) {
            errorEl.textContent = "Password cannot be empty.";
            errorEl.style.display = 'block';
            return;
        }

        const hash = await hashPassword(password);
        if (hash === botState.storedPasswordHash) {
            document.getElementById('password-prompt-modal').style.display = 'none';
            if (typeof botState.pendingAction === 'function') {
                try {
                    await botState.pendingAction(); // Execute the pending action (could be async)
                } catch (e) {
                    console.error("Error executing pending action after password prompt:", e);
                    showNotification("An error occurred after unlocking.", "error");
                }
            }
            botState.pendingAction = null; // Clear pending action
        } else {
            errorEl.textContent = "Incorrect password. Please try again.";
            errorEl.style.display = 'block';
            passwordInput.focus(); // Re-focus input on error
        }
    }

    function updateAdminStatus(text, status) {
        const statusEl = document.getElementById('admin-status');
        if (!statusEl) return;
        statusEl.textContent = text;
        if (status === 'locked') statusEl.style.color = 'var(--accent-red)';
        else if (status === 'unlocked') statusEl.style.color = 'var(--accent-green)';
        else statusEl.style.color = '#b1bad3'; // Default info color
    }


    // --- API & SEED CHANGE ---

    function getAuthToken() {
        // 1. Try specific localStorage keys often used by Stake
        const potentialKeys = ['x-access-token', 'token', 'session_token', 'auth_token'];
        for (const key of potentialKeys) {
            const token = localStorage.getItem(key);
            if (token && typeof token === 'string' && token.split('.').length === 3) {
                console.log(`Auth token found in localStorage key: "${key}"`);
                return token;
            }
        }

        // 2. Try cookies (less common for JWTs but possible)
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('session=') || row.startsWith('token='))?.split('=')[1];
        if (cookieToken && cookieToken.split('.').length === 3) {
            console.log("Auth token found in cookie.");
            return cookieToken;
        }

        // 3. Brute-force localStorage check (last resort)
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue; // Skip if key is null/undefined
                // Avoid checking keys related to the bot itself
                if (key.startsWith('stakeKenoBot')) continue;

                const value = localStorage.getItem(key);
                // Check if it looks like a JWT (string, 3 parts separated by dots)
                if (typeof value === 'string' && value.includes('.') && value.split('.').length === 3) {
                    // Basic check: first part looks like base64 URL encoded JSON (starts with 'ey')
                    if (value.startsWith('ey')) {
                        console.log(`Potential auth token found in generic localStorage key: "${key}"`);
                        return value;
                    }
                }
            }
        } catch (e) {
            console.error("Error iterating localStorage for auth token:", e);
        }

        console.warn("Could not auto-detect auth token from common locations.");
        return ''; // Return empty if not found
    }

    function generateRandomSeed() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = Math.floor(Math.random() * (64 - 10 + 1)) + 10; // Ensure min length 10
        let seed = '';
        for (let i = 0; i < length; i++) {
            seed += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return seed;
    }

    async function changeSeedProgrammatically() {
        updateStatus("Changing Seed...");
        log("Attempting to change seed via API...", "strategy");
        const token = CONFIG.authToken;
        if (!token) {
            updateStatus("Error: Auth Token missing!");
            log("Seed change failed: Auth Token missing in config. Cannot perform API request.", "error");
            showNotification("Auth Token missing. Seed change failed.", "error");
            return false;
        }

        const newClientSeed = generateRandomSeed();
        const graphqlQuery = {
            query: `
                mutation changeClientSeed($seed: String!) {
                    changeClientSeed(seed: $seed) {
                        ... on ClientSeed { id seed __typename }
                        ... on Error { message __typename }
                    }
                }
            `,
            variables: { seed: newClientSeed },
            operationName: "changeClientSeed"
        };

        try {
            const response = await fetch(CONFIG.seedChangeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    // 'Accept': 'application/json' // Good practice
                },
                body: JSON.stringify(graphqlQuery),
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok || !contentType || !contentType.includes("application/json")) {
                const responseText = await response.text();
                // Basic check for Cloudflare or HTML response
                if (responseText.includes("Cloudflare") || responseText.toLowerCase().includes("<!doctype html")) {
                    if (!botState.apiBlockStartTime) {
                        botState.apiBlockStartTime = Date.now();
                        log("API request blocked (Cloudflare suspected). Cooldown timer started.", "error");
                    }
                    throw new Error(`API Request Blocked (Status ${response.status}). Check Cloudflare or network issues.`);
                }
                throw new Error(`API Error: Status ${response.status}. Expected JSON response.`);
            }

            const responseData = await response.json();

            if (responseData.errors) {
                throw new Error(`GraphQL Error: ${responseData.errors.map(e => e.message).join(', ')}`);
            }
            if (responseData.data?.changeClientSeed?.__typename === 'Error') {
                throw new Error(`API Error: ${responseData.data.changeClientSeed.message}`);
            }
            if (!responseData.data?.changeClientSeed?.seed) {
                throw new Error("API Error: Seed change response format unexpected.");
            }

            // Success
            console.log("Successfully changed seed via API:", responseData.data.changeClientSeed);
            updateStatus("Seed Changed!");
            log(`Seed changed successfully via API.`, "strategy");
            showNotification("Client seed changed successfully!");

            // Reset cooldown timer on success
            if (botState.apiBlockStartTime) {
                const cooldownDuration = (Date.now() - botState.apiBlockStartTime) / 1000;
                log(`API access restored. Cooldown was ${cooldownDuration.toFixed(1)}s.`, "system");
                botState.apiBlockStartTime = 0;
            }
            return true; // Indicate success

        } catch (error) {
            console.error("Failed to change seed programmatically:", error);
            updateStatus("Error: Seed change failed.");
            log(`Seed change failed: ${error.message}`, "error");
            showNotification(`Seed change failed: ${error.message}`, "error");
            // Start cooldown timer if not already started and error indicates blocking
            if (error.message.includes("Blocked") && !botState.apiBlockStartTime) {
                botState.apiBlockStartTime = Date.now();
                log("API block detected. Cooldown timer started.", "error");
            }
            return false; // Indicate failure
        }
    }

    async function handleManualSeedChange() {
        const btn = document.getElementById('manual-change-seed-btn');
        if (!btn || btn.disabled) return; // Prevent multiple clicks

        btn.disabled = true;
        btn.textContent = "Changing...";
        const success = await changeSeedProgrammatically();
        // No need to reset text immediately, status updates handle feedback
        // Just re-enable after a short delay regardless of success/fail
        await delay(1000);
        btn.textContent = "Change Seed";
        btn.disabled = false;
    }


    // --- HELPER & STATE FUNCTIONS ---

    // ... (getStakeBetAmount, showNotification, updateStatus, updateProfitDisplay, updateInputDisabledState, applyLogFilters, log, saveLogToFile remain the same) ...
    function getStakeBetAmount() {
        const amountInput = document.querySelector(CONFIG.amountInput);
        if (amountInput) {
            const amount = parseFloat(amountInput.value);
            // Return 0 if NaN or less than minimum possible bet (adjust if needed)
            return (isNaN(amount) || amount < 0.00000001) ? 0 : amount;
        }
        log("Could not find amount input element.", "error");
        return 0; // Return 0 if input not found
    }

    function showNotification(message, type = 'info') {
        const container = document.getElementById('bot-notification-container');
        if (!container) return; // Ensure container exists

        const notification = document.createElement('div');
        notification.className = 'bot-notification';
        notification.innerHTML = `
            <div class="bot-notification-header">
                <span>${type === 'error' ? 'Error' : 'Bot Notification'}</span>
                <button class="close-btn" title="Dismiss">&times;</button>
            </div>
            <p>${message}</p>
        `;
        if (type === 'error') notification.style.backgroundColor = 'var(--accent-red)';

        container.appendChild(notification);

        // Function to remove the notification with fade-out
        const close = () => {
            // Prevent running multiple times
            if (notification.classList.contains('fade-out')) return;
            notification.classList.add('fade-out');
            // Remove from DOM after animation
            setTimeout(() => notification.remove(), 500);
        };

        // Add click listener to close button
        notification.querySelector('.close-btn').addEventListener('click', close, { once: true }); // Use {once: true}

        // Auto-dismiss after 5 seconds
        const timeoutId = setTimeout(close, 5000);

        // Optional: Clear timeout if manually closed
        notification.addEventListener('click', () => clearTimeout(timeoutId), { once: true });
    }

    function updateStatus(text) {
        const el = document.getElementById('bot-status-indicator');
        if (el) el.textContent = `- ${text}`;
    }

    function updateProfitDisplay() {
        const el = document.getElementById('profit-loss-display');
        if (!el) return;
        const profit = botState.totalProfit;
        // Format profit to 8 decimal places
        el.textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(8)}`;
        el.classList.remove('profit', 'loss');
        if (profit > 0.000000005) { // Use a small tolerance for floating point > 0
            el.classList.add('profit');
        } else if (profit < -0.000000005) { // Use a small tolerance for floating point < 0
            el.classList.add('loss');
        }
        // If profit is effectively zero, no class is added (neutral color)
    }

    function updateInputDisabledState() {
        const isRunning = botState.running;
        // More selectively disable elements
        document.querySelectorAll(
            // Elements always enabled
            '#bot-header button, #minimize-btn, #close-btn, #maximize-btn, #close-minimized-btn, #lock-unlock-btn, #tab-admin input, #tab-admin button, #password-prompt-modal button, #password-prompt-modal input'
        ).forEach(el => el.disabled = false);

        document.querySelectorAll(
            // Elements disabled when running (unless in admin or password prompt)
            '#tab-manual button, #tab-manual input, #tab-manual select, ' +
            '#tab-auto input, #tab-auto select, ' + // Exclude start/stop button initially
            '#tab-patterns button, #tab-patterns select, ' +
            '#tab-advanced button, #tab-advanced select, ' +
            '#tab-log button, #tab-log input, ' + // Includes filters
            '#tab-config button, #tab-config input, #tab-config select, .config-pick-btn, .config-toggle-vis-btn, ' +
            '#pattern-creator-modal button, #pattern-creator-modal input, #pattern-creator-modal select, #keno-pattern-grid div, ' + // Pattern modal elements
            '#strategy-modal button, #strategy-modal input, #strategy-modal select' // Strategy modal elements
        ).forEach(el => {
            // Allow interaction if admin tab is active OR if password prompt is shown
            const isAdminTabActive = document.getElementById('tab-admin')?.classList.contains('active');
            const isPasswordPromptVisible = document.getElementById('password-prompt-modal')?.style.display === 'flex';

            // Special handling for start/stop button
            if (el.id === 'start-stop-btn') {
                el.disabled = false; // Start/stop should always be clickable
            }
            // Allow admin tab elements always
            else if (el.closest('#tab-admin')) {
                el.disabled = false;
            }
            // Disable most things when running
            else {
                el.disabled = isRunning;
            }
        });

        // Ensure log filters remain clickable even when running
        document.querySelectorAll('#log-filters input').forEach(el => el.disabled = false);
    }

    function applyLogFilters() {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;
        let visibleCount = 0;
        logContainer.querySelectorAll('p[data-log-type]').forEach(entry => {
            const shouldDisplay = logFilters[entry.dataset.logType];
            entry.style.display = shouldDisplay ? '' : 'none';
            if (shouldDisplay) visibleCount++;
        });
        // console.log(`Applied log filters. Visible entries: ${visibleCount}`);
    }

    function log(message, type = 'system') {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) {
            console.log(`[${type}] ${message}`); // Fallback to console if UI not ready
            return;
        }

        const entry = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }); // Use 24-hour format
        // Sanitize message slightly - replace potential HTML tags if needed
        // For basic bolding like `<b>`, we allow it. For complex HTML, strip it.
        // entry.innerHTML = `[${timestamp}] ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}`; // Basic sanitization
        entry.innerHTML = `[${timestamp}] ${message}`; // Allow basic HTML like <b>
        entry.dataset.logType = type;

        // Apply classes for styling based on type
        entry.classList.add(`log-${type}`); // Use classes for styling

        // Set initial display based on filters
        entry.style.display = logFilters[type] ? '' : 'none';

        logContainer.appendChild(entry);
        // Keep log entries manageable (e.g., max 500 entries)
        const maxLogEntries = 500;
        while (logContainer.childElementCount > maxLogEntries) {
            logContainer.removeChild(logContainer.firstElementChild);
        }
        // Also trim the in-memory logEntries array
        const cleanMessage = `[${timestamp}] ${message.replace(/<[^>]*>/g, '')}`; // Store clean text
        botState.logEntries.push(cleanMessage);
        if (botState.logEntries.length > maxLogEntries) {
            botState.logEntries.shift(); // Remove oldest entry from array
        }


        // Scroll to bottom only if the user hasn't scrolled up manually
        const isScrolledToBottom = logContainer.scrollHeight - logContainer.clientHeight <= logContainer.scrollTop + 1;
        if (isScrolledToBottom) {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }


    function saveLogToFile() {
        if (botState.logEntries.length === 0) {
            showNotification("Log is empty, nothing to save.", "info");
            return;
        }
        const blob = new Blob([botState.logEntries.join('\n')], { type: 'text/plain;charset=utf-8' }); // Specify charset
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Create a more informative filename
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        a.download = `stake_keno_bot_log_${timestamp}.txt`;
        document.body.appendChild(a); // Append to body to ensure visibility
        try {
            a.click();
            log("Log saved to file.", "system");
        } catch (e) {
            log("Error saving log file.", "error");
            console.error("File save error:", e);
            showNotification("Could not save log file.", "error");
        } finally {
            document.body.removeChild(a); // Clean up the link
            URL.revokeObjectURL(url); // Release the object URL
        }
    }


    // ... (makeDraggable, makeResizable remain the same) ...
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (!element || !handle) return; // Basic check

        const dragMouseDown = (e) => {
            // Prevent drag on buttons, inputs, selects, resizers etc.
            const ignoredTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
            if (ignoredTags.includes(e.target.tagName) || e.target.classList.contains('resizer') || e.target.closest('.window-controls')) {
                // console.log("Drag ignored on target:", e.target);
                return;
            }

            e = e || window.event;
            e.preventDefault(); // Prevent text selection during drag

            // Get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Fix for right-aligned elements jumping on first drag
            const rect = element.getBoundingClientRect();
            if (element.style.right && element.style.right !== 'auto') {
                element.style.right = 'auto';
                element.style.left = rect.left + 'px';
            }
            if (element.style.bottom && element.style.bottom !== 'auto') {
                element.style.bottom = 'auto';
                element.style.top = rect.top + 'px';
            }
        };

        const elementDrag = (e) => {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position:
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // Boundary checks (optional, keeps element within viewport)
            const parentRect = document.body.getBoundingClientRect(); // Or specific parent
            const elemRect = element.getBoundingClientRect();
            newTop = Math.max(0, Math.min(newTop, parentRect.height - elemRect.height));
            newLeft = Math.max(0, Math.min(newLeft, parentRect.width - elemRect.width));


            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        };

        const closeDragElement = () => {
            // Stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        };

        handle.onmousedown = dragMouseDown;
    }

    function makeResizable(element) {
        const resizers = element.querySelectorAll('.resizer');
        if (!resizers || resizers.length === 0) return;

        const minimum_size = {
            width: parseInt(getComputedStyle(element).minWidth, 10) || 150,
            height: parseInt(getComputedStyle(element).minHeight, 10) || 100
        };
        const maximum_size = {
            width: parseInt(getComputedStyle(element).maxWidth, 10) || window.innerWidth,
            height: parseInt(getComputedStyle(element).maxHeight, 10) || window.innerHeight
        }

        let original_width = 0, original_height = 0;
        let original_x = 0, original_y = 0; // Element position
        let original_mouse_x = 0, original_mouse_y = 0;

        resizers.forEach(currentResizer => {
            const resizeMouseDown = (e) => {
                e.preventDefault(); // Prevent text selection
                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;

                window.addEventListener('mousemove', resizeMouseMove);
                window.addEventListener('mouseup', resizeMouseUp);
            };

            const resizeMouseMove = (e) => {
                const dx = e.pageX - original_mouse_x;
                const dy = e.pageY - original_mouse_y;
                let newWidth = original_width;
                let newHeight = original_height;
                let newLeft = original_x;
                let newTop = original_y;

                // Adjust dimensions and position based on which resizer is dragged
                if (currentResizer.classList.contains('resizer-r') || currentResizer.classList.contains('resizer-br') || currentResizer.classList.contains('resizer-tr')) {
                    newWidth = original_width + dx;
                }
                if (currentResizer.classList.contains('resizer-l') || currentResizer.classList.contains('resizer-bl') || currentResizer.classList.contains('resizer-tl')) {
                    newWidth = original_width - dx;
                    newLeft = original_x + dx; // Adjust left position when resizing from left
                }
                if (currentResizer.classList.contains('resizer-b') || currentResizer.classList.contains('resizer-br') || currentResizer.classList.contains('resizer-bl')) {
                    newHeight = original_height + dy;
                }
                if (currentResizer.classList.contains('resizer-t') || currentResizer.classList.contains('resizer-tr') || currentResizer.classList.contains('resizer-tl')) {
                    newHeight = original_height - dy;
                    newTop = original_y + dy; // Adjust top position when resizing from top
                }

                // Apply constraints
                newWidth = Math.max(minimum_size.width, Math.min(newWidth, maximum_size.width));
                newHeight = Math.max(minimum_size.height, Math.min(newHeight, maximum_size.height));

                // If resizing from left/top pushed against min size, adjust position back
                if (newWidth === minimum_size.width && (currentResizer.classList.contains('resizer-l') || currentResizer.classList.contains('resizer-bl') || currentResizer.classList.contains('resizer-tl'))) {
                    newLeft = original_x + (original_width - minimum_size.width);
                }
                if (newHeight === minimum_size.height && (currentResizer.classList.contains('resizer-t') || currentResizer.classList.contains('resizer-tr') || currentResizer.classList.contains('resizer-tl'))) {
                    newTop = original_y + (original_height - minimum_size.height);
                }


                // Apply styles
                element.style.width = newWidth + 'px';
                element.style.height = newHeight + 'px';
                // Only update position if resizing from top or left handles
                if (currentResizer.classList.contains('resizer-l') || currentResizer.classList.contains('resizer-bl') || currentResizer.classList.contains('resizer-tl')) {
                    element.style.left = newLeft + 'px';
                    element.style.right = 'auto'; // Ensure right isn't set
                }
                if (currentResizer.classList.contains('resizer-t') || currentResizer.classList.contains('resizer-tr') || currentResizer.classList.contains('resizer-tl')) {
                    element.style.top = newTop + 'px';
                    element.style.bottom = 'auto'; // Ensure bottom isn't set
                }
            };

            const resizeMouseUp = () => {
                window.removeEventListener('mousemove', resizeMouseMove);
                window.removeEventListener('mouseup', resizeMouseUp);
            };

            currentResizer.addEventListener('mousedown', resizeMouseDown);
        });
    }

    // ... (applyUiScale, waitForGameAndEnable remain the same) ...
    /**
     * handleKeydown - REFACTORED to fix input bug
     * 1. If user is typing in *any* input, let them type. Only special case is 'Enter' for password.
     * 2. If element picker is active, block hotkeys (it has its own 'Escape' listener).
     * 3. If a modal is open (and no input focused), block 's'/'b', but allow 'Escape' to close modal.
     * 4. If none of the above, process global hotkeys 's' and 'b'.
     */
    function handleKeydown(e) {
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA');

        // 1. If typing in an input, let it type.
        if (isInputFocused) {
            // Special case: 'Enter' in password prompt
            if (e.key === "Enter" && activeEl.id === 'prompt-password-input') {
                e.preventDefault(); // Prevent form submission
                document.getElementById('password-prompt-submit')?.click();
            }
            // For 's', 'b', or any other key, just let the input handle it.
            return;
        }

        // 2. If element picker is active, block hotkeys
        if (botState.isPickingElement) {
            // The picker's 'escHandler' will catch Escape.
            // We just want to prevent 's' and 'b' from firing.
            return;
        }

        // 3. If a modal is open (and no input is focused), block 's' and 'b'
        const isModalOpen = document.querySelector('.bot-modal-backdrop[style*="display: flex"]') !== null;
        if (isModalOpen) {
            if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'b') {
                e.preventDefault();
                e.stopPropagation();
            }
            // Allow Escape to close modals
            if (e.key === "Escape") {
                const visibleModal = document.querySelector('.bot-modal-backdrop[style*="display: flex"]');
                if (visibleModal) {
                    // Click the first available cancel button
                    visibleModal.querySelector('#cancel-pattern-btn, #cancel-strategy-btn, #password-prompt-cancel')?.click();
                }
            }
            return; // Block other keybinds
        }

        // 4. Global keybinds (no input, no picker, no modal)
        switch (e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                document.getElementById('start-stop-btn')?.click();
                break;
            case 'b':
                e.preventDefault();
                document.getElementById('manual-bet-btn')?.click();
                break;
        }
    }


    function applyUiScale(scaleValue = CONFIG.uiScale) {
        const windowEl = document.getElementById('keno-bot-window');
        const minimizedEl = document.getElementById('keno-bot-minimized-bar');
        const scale = Math.max(50, Math.min(150, scaleValue)) / 100; // Clamp scale between 50% and 150%

        // Apply zoom and adjust transform origin for better scaling appearance
        const applyZoom = (el, scaleFactor) => {
            if (el) {
                el.style.zoom = scaleFactor;
                // Optional: Adjust transform origin if needed, especially for elements positioned relative to corners
                // el.style.transformOrigin = 'top right'; // Example for top-right positioned element
            }
        }

        applyZoom(windowEl, scale);
        applyZoom(minimizedEl, scale);

        // Update the slider and value display if the function was called directly
        const uiScaleSlider = document.getElementById('config-uiScale');
        const uiScaleValue = document.getElementById('config-uiScale-value');
        if (uiScaleSlider && uiScaleSlider.value !== String(scaleValue)) {
            uiScaleSlider.value = scaleValue;
        }
        if (uiScaleValue) {
            uiScaleValue.textContent = `${scaleValue}%`;
        }
    }

    function waitForGameAndEnable() {
        let checkAttempts = 0;
        const maxAttempts = 30; // Wait up to 30 seconds

        const interval = setInterval(() => {
            checkAttempts++;
            const betButton = document.querySelector(CONFIG.betButton);
            const amountInput = document.querySelector(CONFIG.amountInput); // Check for amount input too
            const riskSelect = document.querySelector(CONFIG.riskSelect); // Check risk select
            const tiles = document.querySelector(CONFIG.tile); // Check for at least one tile

            if (betButton && amountInput && riskSelect && tiles) { // Added tile check
                clearInterval(interval);
                // Ensure inputs/buttons in the bot UI reflect the loaded state
                updateInputDisabledState();
                // Set initial risk from Keno state (which might load from config later)
                setRiskLevel(kenoState.riskLevel);
                updateManualButtonStates(); // Update button active states

                updateStatus("Ready");
                log("Game interface elements found. Bot is active.", "system");
            } else if (checkAttempts >= maxAttempts) {
                clearInterval(interval);
                updateStatus("Error: Game elements not found!");
                log("Failed to find essential game elements after timeout (Bet Button, Amount Input, Risk Select, Tiles). Bot may not function correctly. Check Config selectors.", "error");
                showNotification("Error: Could not find Keno game elements. Ensure you are on the Keno page and selectors are correct in the Config tab.", "error");
                // Keep UI enabled but log the error
                updateInputDisabledState(); // Ensure UI is usable to check config
            }
        }, 1000);

        // Initially disable inputs until game is found (or timeout)
        updateInputDisabledState();
        updateStatus("Initializing...");
    }

    // --- ORIGINAL INJECT FUNCTION (For config option) ---
    function originalInjectControls() {
        const betButton = document.querySelector(CONFIG.betButton);
        // Ensure parent exists before trying to insert
        if (!betButton?.parentNode || document.getElementById('keno-custom-controls-original')) return;

        log("Injecting manual controls directly onto page as per config.", "system");
        const mainContainer = document.createElement('div');
        mainContainer.id = 'keno-custom-controls-original';
        // Use more specific classes if available from Stake's UI, otherwise basic layout
        mainContainer.className = 'space-y-2 mt-3';

        const style = document.createElement('style');
        // Use Stake's variable names if known, otherwise define basics
        style.textContent = `
            #keno-custom-controls-original { padding: 5px; border: 1px solid var(--border-color, #2f4553); border-radius: 4px; }
            #keno-custom-controls-original .flex-container { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
            #keno-custom-controls-original .base-btn {
                flex-grow: 1; basis: 0;
                background-color: var(--button-secondary-bg, #2F4553);
                color: var(--button-secondary-color, white);
                padding: 0.7rem 1rem; /* Adjust padding */
                border-radius: var(--radius-sm, 0.125rem);
                border: none; /* Add border: none */
                font-weight: 600;
                font-size: 0.875rem; /* Adjust font size */
                cursor: pointer;
                text-align: center;
                transition: background-color 0.2s ease;
            }
            #keno-custom-controls-original .base-btn:hover:not(:disabled) { background-color: var(--button-secondary-hover-bg, #405a69); }
            #keno-custom-controls-original .base-btn.active { background-color: var(--button-primary-bg, #3b82f6); color: var(--button-primary-color, white); }
            #keno-custom-controls-original .base-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            #keno-custom-controls-original .risk-select-inject {
                flex-grow: 1;
                background-color: var(--input-bg, #0F212E);
                color: var(--input-color, white);
                border: 1px solid var(--input-border-color, #2f4553);
                border-radius: var(--radius-sm, 0.125rem);
                padding: 0.7rem;
                font-size: 0.875rem;
            }
        `;
        // Use document.head for styles
        document.head.appendChild(style);

        // Group 1: Type Buttons
        const group1 = document.createElement('div');
        group1.className = 'flex-container';
        group1.innerHTML = `
            <button class="base-btn" data-category="type" data-value="bar">Bar</button>
            <button class="base-btn" data-category="type" data-value="bird">Bird</button>
            <button class="base-btn" data-category="type" data-value="random">Random</button>
        `;

        // Group 2: Position/Flip
        const group2 = document.createElement('div');
        group2.className = 'flex-container';
        group2.innerHTML = `
            <button class="base-btn" data-category="flip" style="flex-grow: 0; padding: 0.7rem;">Flip</button>
            <button class="base-btn" data-category="position" data-value="left">Left</button>
            <button class="base-btn" data-category="position" data-value="middle">Middle</button>
            <button class="base-btn" data-category="position" data-value="right">Right</button>
        `;

        // Group 3: Risk Select
        const group3 = document.createElement('div');
        group3.className = 'flex-container';
        group3.innerHTML = `
            <label for="risk-select-inject-id" style="color: var(--text-secondary, #b1bad3); font-size: 0.875rem; margin-right: 5px;">Risk:</label>
            <select id="risk-select-inject-id" class="risk-select-inject">
                <option value="classic">Classic</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        `;
        const riskSelectInjected = group3.querySelector('select');
        riskSelectInjected.value = kenoState.riskLevel; // Set initial value


        mainContainer.append(group1, group2, group3);
        // Insert after the parent of the bet button (usually the controls container)
        betButton.parentNode.parentNode.insertBefore(mainContainer, betButton.parentNode.nextSibling);

        // --- Add Listeners to Injected Controls ---
        const syncAndUpdate = async (category, value) => {
            let changed = false;
            if (category === 'type') {
                if (kenoState.type !== value) { kenoState.type = value; kenoState.userPatternName = null; changed = true; }
                // Don't allow deselect from injected controls for simplicity
            } else if (category === 'position') {
                if (kenoState.position !== value) { kenoState.position = value; changed = true; }
            } else if (category === 'flip') {
                kenoState.flip = !kenoState.flip; changed = true;
            }

            // Update active states for injected buttons
            mainContainer.querySelectorAll('.base-btn[data-category="type"]').forEach(b => b.classList.toggle('active', kenoState.type === b.dataset.value));
            mainContainer.querySelectorAll('.base-btn[data-category="position"]').forEach(b => b.classList.toggle('active', kenoState.position === b.dataset.value));
            mainContainer.querySelector('.base-btn[data-category="flip"]')?.classList.toggle('active', kenoState.flip);

            // Disable/Enable Position/Flip based on Type
            const posFlipDisabled = !['bar', 'bird'].includes(kenoState.type);
            mainContainer.querySelectorAll('[data-category="position"], [data-category="flip"]').forEach(b => b.disabled = posFlipDisabled);
            if (posFlipDisabled) { // Reset state and visuals if disabled
                kenoState.position = null;
                kenoState.flip = false;
                mainContainer.querySelectorAll('.base-btn[data-category="position"], .base-btn[data-category="flip"]').forEach(b => b.classList.remove('active'));
            }

            updateManualButtonStates(); // Sync with main bot UI
            if (changed) await applyCurrentPattern(); // Apply pattern if state changed
        };

        // Button listeners
        mainContainer.querySelectorAll('button.base-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Ignore clicks if button is disabled
                if (btn.disabled) return;
                syncAndUpdate(btn.dataset.category, btn.dataset.value);
            });
        });

        // Risk Select listener
        riskSelectInjected.addEventListener('change', async (e) => {
            const newRisk = e.target.value;
            await setRiskLevel(newRisk); // This updates kenoState and Stake UI
            updateManualButtonStates(); // Sync main bot UI dropdown
        });

        // Initial sync of injected controls state
        syncAndUpdate(null, null); // Call once to set initial disabled/active states
        riskSelectInjected.value = kenoState.riskLevel;

    }


    // --- WINDOW CONTROLS ---
    function minimizeBot() {
        document.getElementById('keno-bot-window').style.display = 'none';
        document.getElementById('keno-bot-minimized-bar').style.display = 'flex';
    }
    function maximizeBot() {
        document.getElementById('keno-bot-window').style.display = 'flex';
        document.getElementById('keno-bot-minimized-bar').style.display = 'none';
    }
    function closeBot() {
        const win = document.getElementById('keno-bot-window');
        const min = document.getElementById('keno-bot-minimized-bar');
        if (win) win.style.display = 'none';
        if (min) min.style.display = 'none';
        // Optional: Add a way to reopen? For now, requires refresh.
        log("Bot window closed. Refresh the page to reopen.", "system");
    }

    // --- UTILITIES ---
    /**
     * More robust click simulation that triggers React's event handlers
     * by setting the 'value' property and dispatching 'input'/'change' events
     * or by dispatching mousedown/mouseup for buttons.
     */
    function simulateClick(element) {
        if (!element) return;

        // For buttons, a mousedown/mouseup sequence is often more reliable
        try {
            const downEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            const upEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
            element.dispatchEvent(downEvent);
            element.dispatchEvent(upEvent);
            // Fallback to click just in case
            // element.click();
        } catch (e) {
            console.error("Simulated click failed:", e);
            // Fallback
            element.click();
        }
    }

    /**
     * Sets the value of an input or select element and dispatches
     * the necessary events (input, change) to trigger React's state updates.
     */
    function setUIValue(selector, value) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`setUIValue: Element not found for selector: ${selector}`);
            return false;
        }

        try {
            if (element.tagName === 'SELECT') {
                element.value = value;
            } else if (element.tagName === 'INPUT') {
                // This trick is often needed to make React see the change
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(element, value);
            } else {
                console.warn(`setUIValue: Unsupported element type ${element.tagName}`);
                element.value = value; // Try anyway
            }

            // Dispatch events to notify React of the change
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            const changeEvent = new Event('change', { bubbles: true, cancelable: true });
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);

            return true;
        } catch (e) {
            console.error(`Failed to set UI value for ${selector}:`, e);
            return false;
        }
    }

    // --- PATTERN ANIMATION UTILITIES ---

    /**
     * Gets the 0-indexed row and col for a Keno tile number (1-40)
     * Grid is 8 wide (0-7), 5 high (0-4)
     */
    function getTileCoords(tileNum) {
        const zeroBasedNum = tileNum - 1;
        const row = Math.floor(zeroBasedNum / 8);
        const col = zeroBasedNum % 8;
        return { row, col };
    }

    /**
     * Calculates metadata for a pattern needed for safe shifting.
     * @param {number[]} tiles - Array of tile numbers [1-40]
     * @returns {object} - { offsets, minRow, minCol, height, width, validAnchorRows, validAnchorCols }
     */
    function calculatePatternMetadata(tiles) {
        if (!tiles || tiles.length === 0) {
            return { offsets: [], minRow: 0, minCol: 0, height: 0, width: 0, validAnchorRows: 4, validAnchorCols: 7 };
        }
        const coords = tiles.map(getTileCoords);
        const minRow = Math.min(...coords.map(c => c.row));
        const maxRow = Math.max(...coords.map(c => c.row));
        const minCol = Math.min(...coords.map(c => c.col));
        const maxCol = Math.max(...coords.map(c => c.col));

        const height = maxRow - minRow + 1;
        const width = maxCol - minCol + 1;

        // Offsets relative to the bounding box's top-left corner
        const offsets = coords.map(c => ({ row: c.row - minRow, col: c.col - minCol }));
        
        const validAnchorRows = 5 - height; // Max row index for anchor
        const validAnchorCols = 8 - width;  // Max col index for anchor

        return { offsets, minRow, minCol, height, width, validAnchorRows, validAnchorCols };
    }
    
    /**
     * Generates a new array of tile numbers based on offsets and a new anchor position.
     * @param {object[]} offsets - Array of {row, col} offsets from calculatePatternMetadata
     * @param {number} newAnchorRow - The new top-left row (0-indexed) for the bounding box
     * @param {number} newAnchorCol - The new top-left col (0-indexed) for the bounding box
     * @returns {number[]} - Array of new tile numbers
     */
    function shiftPattern(offsets, newAnchorRow, newAnchorCol) {
        const newTiles = [];
        for (const offset of offsets) {
            const newRow = newAnchorRow + offset.row;
            const newCol = newAnchorCol + offset.col;
            // Convert (row, col) back to tile number (1-40)
            const newTileNum = (newRow * 8) + newCol + 1;
            newTiles.push(newTileNum);
        }
        return newTiles.sort((a,b) => a-b);
    }

    /**
     * Executes the next step of a pattern animation.
     * @returns {Promise<boolean>} - True if tiles were picked successfully.
     */
    async function executePatternAnimation() {
        const anim = kenoState.animation;
        if (!anim.enabled || !anim.metadata) {
            log("Animation execution failed: State or metadata missing.", "error");
            return false;
        }

        const metadata = anim.metadata;
        let newTiles = [];
        
        switch (anim.type) {
            case 'random': {
                const newRow = Math.floor(Math.random() * (metadata.validAnchorRows + 1));
                const newCol = Math.floor(Math.random() * (metadata.validAnchorCols + 1));
                anim.currentAnchor = { row: newRow, col: newCol };
                newTiles = shiftPattern(metadata.offsets, newRow, newCol);
                log(`Anim: Random shift to [${newRow}, ${newCol}]`, "strategy");
                break;
            }
            case 'dvd': {
                let newRow = anim.currentAnchor.row + anim.currentVelocity.row;
                let newCol = anim.currentAnchor.col + anim.currentVelocity.col;

                // Bounce row
                if (newRow < 0) {
                    newRow = 0;
                    anim.currentVelocity.row *= -1;
                } else if (newRow > metadata.validAnchorRows) {
                    newRow = metadata.validAnchorRows;
                    anim.currentVelocity.row *= -1;
                }
                // Bounce col
                if (newCol < 0) {
                    newCol = 0;
                    anim.currentVelocity.col *= -1;
                } else if (newCol > metadata.validAnchorCols) {
                    newCol = metadata.validAnchorCols;
                    anim.currentVelocity.col *= -1;
                }
                
                anim.currentAnchor = { row: newRow, col: newCol };
                newTiles = shiftPattern(metadata.offsets, newRow, newCol);
                // log(`Anim: DVD bounce to [${newRow}, ${newCol}]`, "strategy");
                break;
            }
            case 'leftRight': {
                let newRow = anim.currentAnchor.row; // Row doesn't change
                let newCol = anim.currentAnchor.col + anim.currentVelocity.col;

                 // Bounce col
                if (newCol < 0) {
                    newCol = 0;
                    anim.currentVelocity.col *= -1;
                } else if (newCol > metadata.validAnchorCols) {
                    newCol = metadata.validAnchorCols;
                    anim.currentVelocity.col *= -1;
                }
                
                anim.currentAnchor = { row: newRow, col: newCol };
                newTiles = shiftPattern(metadata.offsets, newRow, newCol);
                // log(`Anim: Left-Right to [${newRow}, ${newCol}]`, "strategy");
                break;
            }
            case 'custom': {
                if (!anim.customFrames || anim.customFrames.length === 0) {
                    log("Animation Error: 'Custom' type selected but no frames exist.", "error");
                    return false;
                }
                newTiles = anim.customFrames[anim.currentFrame % anim.customFrames.length];
                log(`Anim: Custom Frame ${anim.currentFrame % anim.customFrames.length + 1}`, "strategy");
                anim.currentFrame++;
                break;
            }
            default: { // Added curly braces here
                log(`Unknown animation type: ${anim.type}. Using base pattern.`, "error");
                const pattern = userPatterns[anim.patternName];
                newTiles = pattern ? pattern.tiles : [];
                break; // Ensure break is inside the block
            }
        }
        
        if (newTiles.length === 0) {
            log("Animation resulted in zero tiles. Aborting.", "error");
            return false;
        }

        return await pickTilesByNumbers(newTiles);
    }


    // --- START ---
    // Use DOMContentLoaded for faster injection, fallback to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500); // Already loaded or interactive
    }

})();


