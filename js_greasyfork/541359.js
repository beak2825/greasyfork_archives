// ==UserScript==
// @name         Stake Dice Bot
// @namespace    http://tampermonkey.net/
// @version      7.8.8
// @description  Advanced Dice Bot for Stake.us and Stake.com with a resizable UI, intelligent triggers, notifications, and enhanced strategy options.
// @author       shdw_lol
// @license      MIT
// @match        *://stake.com/casino/games/dice*
// @match        *://stake.com/*/casino/games/dice*
// @match        *://stake.ac/casino/games/dice*
// @match        *://stake.ac/*/casino/games/dice*
// @match        *://stake.games/casino/games/dice*
// @match        *://stake.games/*/casino/games/dice*
// @match        *://stake.bet/casino/games/dice*
// @match        *://stake.bet/*/casino/games/dice*
// @match        *://stake.pink/casino/games/dice*
// @match        *://stake.pink/*/casino/games/dice*
// @match        *://stake.mba/casino/games/dice*
// @match        *://stake.mba/*/casino/games/dice*
// @match        *://stake.jp/casino/games/dice*
// @match        *://stake.jp/*/casino/games/dice*
// @match        *://stake.bz/casino/games/dice*
// @match        *://stake.bz/*/casino/games/dice*
// @match        *://stake.ceo/casino/games/dice*
// @match        *://stake.ceo/*/casino/games/dice*
// @match        *://stake.krd/casino/games/dice*
// @match        *://stake.krd/*/casino/games/dice*
// @match        *://staketr.com/casino/games/dice*
// @match        *://staketr.com/*/casino/games/dice*
// @match        *://stake.us/casino/games/dice*
// @match        *://stake.us/*/casino/games/dice*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541359/Stake%20Dice%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/541359/Stake%20Dice%20Bot.meta.js
// ==/UserScript==

// --- DISCLAIMER ---
// This script interacts with the Stake API to perform actions like changing your game seed.
// To do this, it needs to use your account's session token. This token is retrieved from your browser's
// storage (cookies or local storage) and is ONLY sent back to Stake's official servers.
// It is never sent to any third-party server or stored outside of your browser.
// The password feature uses SHA-256 hashing and stores the result in your browser's local storage.
// It is never transmitted over the network.

(function() {
    'use strict';

    // --- CONFIGURATION & STATE ---

    const state = {
        running: false,
        isLocked: false,
        baseBet: 0.01,
        currentBet: 0.01,
        betCount: 0,
        totalProfit: 0,
        winStreak: 0,
        lossStreak: 0,
        lastBetWasWin: null,
        onWinAction: 'reset',
        onWinIncrease: 0,
        onLossAction: 'increase',
        onLossIncrease: 100,
        strategyFlags: {}, // For stateful conditions like 'firstStreakOf'
        persistentTriggerStates: {}, // For tracking profit/time based one-time actions
        lastWinTimestamp: 0,
        outcomeHistory: '', // String of 'W' and 'L'
        originalAutoStrategy: null,
        originalBetDelay: null, // To store the bet delay from config when the bot starts
        apiBlockStartTime: 0, // To track API cooldown
        stackingDelay: 0, // For the stacking delay strategy
    };

    const semiAutoState = {
        currentBet: 0.01,
        isStarted: false,
    };

    let advancedStrategies = {};
    let isPickingElement = false;
    let logEntries = [];
    let isBotInitialized = false;
    let storedUsername = '';
    let storedPasswordHash = '';
    let pendingAction = null;

    const logFilters = {
        system: true,
        manual: true,
        auto: true,
        strategy: true,
    };

    // --- CONFIG & SELECTORS ---
    let CONFIG = {
        authToken: '',
        seedChangeEndpoint: '/_api/graphql',
        betButton: '[data-testid="bet-button"]',
        amountInput: '[data-testid="input-game-amount"]',
        payoutInput: '[data-testid="payout"]',
        winChanceInput: '[data-testid="chance"]',
        baseWinChance: 49.5,
        betDelay: '100', // Can be a single number or a range like "100-250"
        maxBetAmount: 0,
        gameFrame: '[data-testid="game-frame"]',
        pastBetsContainer: '.past-bets',
        winClass: 'variant-success',
        lossClass: 'variant-neutral',
        autoTab: '[data-testid="auto-tab"]',
        manualTab: '[data-testid="manual-tab"]',
        reverseRollButton: '[data-testid="reverse-roll"]',
        uiScale: 100, // UI Scale percentage
    };

    const CONFIG_FRIENDLY_NAMES = {
        authToken: "Auth Token",
        seedChangeEndpoint: "API Endpoint",
        betButton: "Bet Button",
        amountInput: "Amount Input",
        payoutInput: "Payout Input",
        winChanceInput: "Win Chance Input",
        baseWinChance: "Base Win Chance (%)",
        betDelay: "Bet Delay Range (ms)",
        maxBetAmount: "Max Bet Amount (0=off)",
        gameFrame: "Game Frame",
        pastBetsContainer: "Past Bets List",
        winClass: "Win Bet Class",
        lossClass: "Loss Bet Class",
        autoTab: "Auto Tab Button",
        manualTab: "Manual Tab Button",
        reverseRollButton: "Flip Over/Under Button",
        uiScale: "UI Scale (%)",
    };

    // --- UI (HTML & CSS) ---

    const botHtml = `
        <div id="bot-notification-container"></div>
        <div id="dice-bot-window" class="bot-window">
            <div class="resizer resizer-t"></div>
            <div class="resizer resizer-r"></div>
            <div class="resizer resizer-b"></div>
            <div class="resizer resizer-l"></div>
            <div class="resizer resizer-tl"></div>
            <div class="resizer resizer-tr"></div>
            <div class="resizer resizer-br"></div>
            <div class="resizer resizer-bl"></div>
            <div id="bot-header" class="bot-header">
                <span>Stake Dice Bot <span id="bot-status-indicator"></span> <span id="profit-loss-display"></span></span>
                <div class="window-controls">
                    <button id="minimize-btn" class="window-btn" title="Minimize">—</button>
                    <button id="close-btn" class="window-btn" title="Close">×</button>
                </div>
            </div>
            <div id="bot-main-content" class="bot-content">
                <div class="bot-tabs">
                    <button class="bot-tab-btn active" data-tab="semi-auto">Manual</button>
                    <button class="bot-tab-btn" data-tab="main">Auto</button>
                    <button class="bot-tab-btn" data-tab="advanced">Advanced</button>
                    <button class="bot-tab-btn" data-tab="log">Log</button>
                    <button class="bot-tab-btn" data-tab="config">Config</button>
                    <button class="bot-tab-btn" data-tab="admin">Admin</button>
                </div>
                <div id="tab-semi-auto" class="bot-tab-content active">
                    <div class="bot-input-group"><label>Base Amount</label><input type="number" id="semi-auto-base-bet" class="bot-input" value="0.01" step="0.01"></div>
                    <div class="bot-input-group"><label>Strategy</label><select id="semi-auto-strategy" class="bot-input"><option value="none" selected>None (Manual Betting)</option></select></div>
                    <p id="semi-auto-desc" class="strategy-desc">Select a custom strategy or use manual betting.</p>
                    <button id="semi-auto-step-btn" class="bot-btn bot-btn-primary" title="Run a single bet (D)">Run Step (D)</button>
                    <button id="semi-auto-reset-btn" class="bot-btn bot-btn-danger" title="Reset bet amount to base (R)">Reset to Base (R)</button>
                    <button id="manual-change-seed-btn" class="bot-btn bot-btn-secondary" title="Test the API seed change feature">Change Seed (API)</button>
                </div>
                <div id="tab-main" class="bot-tab-content">
                    <div class="bot-input-group"><label>Base Amount</label><input type="number" id="base-bet" class="bot-input" value="0.01" step="0.01"></div>
                    <div class="bot-input-group"><label>Strategy</label><select id="auto-strategy-select" class="bot-input"><option value="none">None (Use On Win/Loss %)</option></select></div>
                    <div id="on-win-loss-container">
                        <div class="bot-input-group on-action"><label>On Win</label><select id="on-win-action" class="bot-input"><option value="reset">Reset to Base</option><option value="increase">Increase by %</option></select><input type="number" id="on-win-increase" class="bot-input" value="0" min="0"></div>
                        <div class="bot-input-group on-action"><label>On Loss</label><select id="on-loss-action" class="bot-input"><option value="increase">Increase by %</option><option value="reset">Reset to Base</option></select><input type="number" id="on-loss-increase" class="bot-input" value="100" min="0"></div>
                    </div>
                    <button id="start-stop-btn" class="bot-btn bot-btn-primary" title="Starts or stops the bot (S)">Start Auto (S)</button>
                </div>
                <div id="tab-advanced" class="bot-tab-content">
                    <div class="bot-input-group">
                        <label>Your Saved Strategies</label>
                        <select id="advanced-strategy-list" class="bot-input"></select>
                    </div>
                    <div class="btn-grid">
                        <button id="create-strategy-btn" class="bot-btn bot-btn-secondary">Create New</button>
                        <button id="edit-strategy-btn" class="bot-btn bot-btn-secondary">Edit Selected</button>
                        <button id="import-strategy-btn" class="bot-btn bot-btn-secondary">Import</button>
                        <button id="export-strategy-btn" class="bot-btn bot-btn-secondary">Export Selected</button>
                    </div>
                    <button id="delete-strategy-btn" class="bot-btn bot-btn-danger">Delete Selected</button>
                </div>
                <div id="tab-log" class="bot-tab-content">
                    <div id="log-filters">
                        <label><input type="checkbox" data-filter="system" checked> System</label>
                        <label><input type="checkbox" data-filter="manual" checked> Manual</label>
                        <label><input type="checkbox" data-filter="auto" checked> Auto</label>
                        <label><input type="checkbox" data-filter="strategy" checked> Strategy</label>
                    </div>
                    <div id="log-container"></div>
                    <div class="btn-grid">
                        <button id="reset-stats-btn" class="bot-btn bot-btn-danger">Reset Stats</button>
                        <button id="save-log-btn" class="bot-btn bot-btn-secondary">Save Log to File</button>
                    </div>
                </div>
                <div id="tab-config" class="bot-tab-content">
                    <p class="strategy-desc">Configure API settings and UI element selectors. The bot tries to find the Auth Token automatically.</p>
                    <div id="config-container"></div>
                    <button id="save-config-btn" class="bot-btn bot-btn-primary">Save Config</button>
                    <button id="reset-config-btn" class="bot-btn bot-btn-danger">Reset to Defaults</button>
                </div>
                <div id="tab-admin" class="bot-tab-content">
                    <p class="strategy-desc">Set a password to lock bot settings. When locked, only the Manual and Admin tabs are usable.</p>
                    <div class="bot-input-group">
                        <label>Username</label>
                        <input type="text" id="admin-username" class="bot-input" autocomplete="username">
                    </div>
                    <div class="bot-input-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input type="password" id="admin-password" class="bot-input" autocomplete="new-password">
                    </div>
                    <button id="save-credentials-btn" class="bot-btn bot-btn-secondary">Save Credentials</button>
                    <hr>
                    <button id="lock-unlock-btn" class="bot-btn bot-btn-primary">Lock</button>
                    <p id="admin-status" class="strategy-desc" style="margin-top: 15px; text-align: center;"></p>
                </div>
            </div>
        </div>

        <div id="dice-bot-minimized-bar" style="display: none;">
            <span>Stake Dice Bot</span>
            <div class="window-controls">
                <button id="maximize-btn" class="window-btn" title="Maximize">□</button>
                <button id="close-minimized-btn" class="window-btn" title="Close">×</button>
            </div>
        </div>

        <div id="strategy-modal" style="display: none;">
            <div id="strategy-modal-content">
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
        <div id="password-prompt-modal" style="display: none;">
            <div id="password-prompt-content">
                <h3>Password Required</h3>
                <p id="password-prompt-message">Please enter the password to unlock this feature.</p>
                <div class="bot-input-group">
                    <label>Password</label>
                    <input type="password" id="prompt-password-input" class="bot-input" autocomplete="current-password">
                </div>
                <p id="password-prompt-error" style="color: var(--accent-red); display: none;"></p>
                <button id="password-prompt-submit" class="bot-btn bot-btn-primary">Submit</button>
                <button id="password-prompt-cancel" class="bot-btn bot-btn-secondary">Cancel</button>
            </div>
        </div>
        <div id="element-picker-overlay"></div>
        <div id="element-picker-tooltip">Click an element to select it. Press ESC to cancel.</div>
    `;

    const botCss = `
        :root { --bg-primary: #0F212E; --bg-secondary: #213743; --bg-tertiary: #1a2c38; --accent-green: #00b373; --accent-red: #e53e3e; --accent-yellow: #FFC107; --text-primary: #fff; --text-secondary: #b1bad3; }
        .bot-window { position: fixed; top: 100px; right: 20px; width: 380px; min-width: 350px; max-width: 800px; height: 550px; min-height: 400px; max-height: 90vh; background-color: var(--bg-primary); border-radius: 8px; z-index: 9999; color: var(--text-primary); font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; }
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
        .bot-tabs { display: flex; margin-bottom: 15px; background-color: var(--bg-primary); border-radius: 20px; padding: 4px; border: 1px solid var(--bg-secondary); flex-shrink: 0; }
        .bot-tab-btn { flex: 1; padding: 8px; cursor: pointer; background: transparent; border: none; color: var(--text-secondary); border-radius: 20px; font-weight: 500; transition: all 0.2s ease-in-out; font-size: 13px; white-space: nowrap; }
        .bot-tab-btn.active { background-color: var(--bg-secondary); color: var(--text-primary); }
        .bot-tabs.locked .bot-tab-btn:not([data-tab="semi-auto"]):not([data-tab="admin"]) { pointer-events: none; opacity: 0.5; }
        .bot-tab-content { display: none; }
        .bot-tab-content.active { display: flex; flex-grow: 1; flex-direction: column; }
        #tab-config { overflow-y: auto; }
        .bot-input-group { margin-bottom: 12px; display: flex; flex-direction: column; }
        .bot-input-group label { margin-bottom: 5px; font-size: 14px; color: #b1bad3; }
        .bot-input { width: 100%; padding: 8px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; color: #fff; box-sizing: border-box; }
        .bot-input:disabled { background-color: #2a414f; opacity: 0.7; }
        .bot-input-group.on-action { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px; align-items: flex-end; }
        .bot-input-group.on-action label { grid-column: 1 / -1; }
        #on-win-loss-container.disabled { opacity: 0.5; pointer-events: none; }
        .bot-btn { width: 100%; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600; margin-top: 10px; }
        .bot-btn:disabled { background-color: #4A5568; cursor: not-allowed; opacity: 0.7; }
        .bot-btn-primary { background-color: var(--accent-green); color: #fff; }
        .bot-btn-danger { background-color: var(--accent-red); color: #fff; }
        .bot-btn-secondary { background-color: var(--bg-secondary); color: #fff; }
        .strategy-desc { font-size: 12px; color: #b1bad3; background-color: var(--bg-secondary); padding: 8px; border-radius: 4px; margin: 5px 0 15px 0; }
        #config-container { background-color: var(--bg-primary); border-radius: 4px; padding: 8px; font-size: 12px; line-height: 1.5; }
        #log-container { flex-grow: 1; overflow-y: auto; padding-right: 5px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; padding: 8px; font-size: 12px; line-height: 1.5; }
        #log-container p { margin: 0 0 5px 0; padding: 2px 4px; border-radius: 3px; }
        #log-container p.log-manual { color: var(--accent-green); }
        #log-container p.log-auto { color: var(--accent-red); }
        #log-container p.log-strategy { color: var(--accent-yellow); }
        #log-container p b { font-weight: 900; }
        #log-filters { display: flex; gap: 15px; margin-bottom: 10px; background-color: var(--bg-secondary); padding: 8px; border-radius: 4px; }
        #log-filters label { display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer; }
        #dice-bot-minimized-bar { position: fixed; top: 100px; right: 20px; background-color: var(--bg-secondary); border-radius: 8px; z-index: 9999; color: #fff; font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; justify-content: space-between; align-items: center; padding: 8px 12px; cursor: move; }
        #dice-bot-minimized-bar span { font-weight: 600; user-select: none; }
        .config-group { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
        .config-group label { font-size: 12px; color: #b1bad3; flex-basis: 140px; flex-shrink: 0; display: flex; align-items: center; }
        .config-group .input-wrapper { display: flex; align-items: center; flex-grow: 1; position: relative; }
        .config-group input { flex-grow: 1; font-size: 11px; }
        .config-group input[type=text] { padding-right: 30px; }
        .config-group input.invalid-range { border-color: var(--accent-red) !important; }
        .config-range-wrapper { display: flex; align-items: center; gap: 5px; width: 100%; }
        .config-range-wrapper input { flex-grow: 1; text-align: center; }
        .config-range-wrapper span { color: #b1bad3; font-size: 11px; }
        .config-pick-btn, .config-toggle-vis-btn { padding: 6px 8px; font-size: 10px; flex-shrink: 0; background-color: #4A5568; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .config-toggle-vis-btn { position: absolute; right: 1px; top: 1px; bottom: 1px; background-color: var(--bg-secondary); padding: 0 8px; }
        .config-toggle-vis-btn svg { width: 16px; height: 16px; pointer-events: none; }
        .config-tooltip-trigger { display: inline-block; margin-left: 8px; background-color: var(--accent-yellow); color: var(--bg-primary); border-radius: 50%; width: 16px; height: 16px; text-align: center; line-height: 16px; font-weight: bold; cursor: help; position: relative; font-size: 12px; }
        .config-tooltip-trigger .tooltip-text { visibility: hidden; width: 220px; background-color: var(--bg-secondary); color: #fff; text-align: center; border-radius: 6px; padding: 8px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -110px; opacity: 0; transition: opacity 0.3s; font-weight: normal; font-size: 11px; }
        .config-tooltip-trigger:hover .tooltip-text { visibility: visible; opacity: 1; }
        #element-picker-overlay { position: fixed; background-color: rgba(0, 179, 115, 0.3); border: 2px solid var(--accent-green); z-index: 10000; pointer-events: none; display: none; transition: all 0.1s linear; }
        #element-picker-tooltip { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: black; color: white; padding: 10px 20px; border-radius: 5px; z-index: 10001; display: none; }
        #strategy-modal, #password-prompt-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center; }
        #strategy-modal-content, #password-prompt-content { background: var(--bg-primary); padding: 20px; border-radius: 8px; border: 1px solid var(--bg-secondary); width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        #strategy-modal-content > .bot-input-group, #strategy-modal-content > .bot-btn, #strategy-modal-content > hr { margin: 0; }
        #password-prompt-content { max-width: 380px; text-align: center; }
        #strategy-rules-container { overflow-y: auto; flex-grow: 1; min-height: 0; }
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
        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        hr { border: none; border-top: 1px solid var(--bg-secondary); margin: 15px 0; }
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
    `;

    // --- CORE LOGIC ---

    function init() {
        if (isBotInitialized) return;
        isBotInitialized = true;

        loadConfig();
        loadStrategies();

        document.body.insertAdjacentHTML('beforeend', botHtml);
        GM_addStyle(botCss);
        document.getElementById('dice-bot-window').style.display = 'flex';

        applyUiScale(); // Apply loaded scale on startup
        loadSecurityConfig();
        populateConfigTab();
        populateStrategyDropdowns();
        setupEventListeners();
        makeDraggable(document.getElementById('dice-bot-window'), document.getElementById('bot-header'));
        makeDraggable(document.getElementById('dice-bot-minimized-bar'), document.getElementById('dice-bot-minimized-bar'));
        makeResizable(document.getElementById('dice-bot-window'));


        log("Bot UI Initialized. Waiting for game interface...", "system");
        waitForGameAndEnable();
        updateSemiAutoDescription();
        updateProfitDisplay();

        if (storedPasswordHash) {
            lockUI();
        } else {
            updateAdminStatus("No password set. Bot is unlocked.", "info");
        }
    }

    function setupEventListeners() {
        // Window Controls
        document.getElementById('minimize-btn').addEventListener('click', minimizeBot);
        document.getElementById('close-btn').addEventListener('click', closeBot);
        document.getElementById('maximize-btn').addEventListener('click', maximizeBot);
        document.getElementById('close-minimized-btn').addEventListener('click', closeBot);

        // Tab switching
        const tabButtons = document.querySelectorAll('.bot-tab-btn');
        const tabContents = document.querySelectorAll('.bot-tab-content');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (state.isLocked && e.currentTarget.dataset.tab !== 'semi-auto' && e.currentTarget.dataset.tab !== 'admin') {
                    promptForPassword(unlockUI);
                    return;
                }
                const tabName = e.currentTarget.dataset.tab;

                tabButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                tabContents.forEach(content => {
                    if (content.id === `tab-${tabName}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });


        // Main controls
        document.getElementById('start-stop-btn').addEventListener('click', toggleBot);
        document.getElementById('semi-auto-step-btn').addEventListener('click', runSemiAutoStep);
        document.getElementById('semi-auto-reset-btn').addEventListener('click', resetSemiAutoProgression);
        document.getElementById('manual-change-seed-btn').addEventListener('click', handleManualSeedChange);
        document.getElementById('semi-auto-strategy').addEventListener('change', updateSemiAutoDescription);

        // Config tab
        document.getElementById('save-config-btn').addEventListener('click', saveConfig);
        document.getElementById('reset-config-btn').addEventListener('click', resetConfigToDefault);

        // Log Tab
        document.getElementById('save-log-btn').addEventListener('click', saveLogToFile);
        document.getElementById('reset-stats-btn').addEventListener('click', resetState);

        // Advanced Strategy tab
        document.getElementById('create-strategy-btn').addEventListener('click', () => openStrategyModal());
        document.getElementById('edit-strategy-btn').addEventListener('click', editSelectedStrategy);
        document.getElementById('delete-strategy-btn').addEventListener('click', deleteSelectedStrategy);
        document.getElementById('import-strategy-btn').addEventListener('click', importStrategy);
        document.getElementById('export-strategy-btn').addEventListener('click', exportSelectedStrategy);
        document.getElementById('save-strategy-btn').addEventListener('click', saveStrategy);
        document.getElementById('cancel-strategy-btn').addEventListener('click', () => document.getElementById('strategy-modal').style.display = 'none');
        document.getElementById('add-rule-btn').addEventListener('click', () => addRuleToModal());

        // Admin tab
        document.getElementById('save-credentials-btn').addEventListener('click', saveCredentials);
        document.getElementById('lock-unlock-btn').addEventListener('click', handleLockUnlock);

        // Password Prompt
        document.getElementById('password-prompt-submit').addEventListener('click', handleSubmitPassword);
        document.getElementById('password-prompt-cancel').addEventListener('click', () => document.getElementById('password-prompt-modal').style.display = 'none');

        // Log Filters
        document.getElementById('log-filters').addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                logFilters[e.target.dataset.filter] = e.target.checked;
                applyLogFilters();
            }
        });

        // Other listeners
        document.getElementById('auto-strategy-select').addEventListener('change', (e) => {
            document.getElementById('on-win-loss-container').classList.toggle('disabled', e.target.value !== 'none');
        });
        document.addEventListener('keydown', handleKeydown);
    }

    function toggleBot() {
        if (state.running) { // Stopping
            state.running = false;
            const btn = document.getElementById('start-stop-btn');
            btn.textContent = 'Start Auto (S)';
            btn.classList.remove('bot-btn-danger');
            btn.classList.add('bot-btn-primary');
            updateStatus('Stopped');
            log("Auto betting stopped.", "auto");
            updateInputDisabledState();

            if (state.originalAutoStrategy) {
                const autoSelect = document.getElementById('auto-strategy-select');
                const semiAutoSelect = document.getElementById('semi-auto-strategy');
                autoSelect.value = state.originalAutoStrategy;
                semiAutoSelect.value = state.originalAutoStrategy;
                state.originalAutoStrategy = null;
                log("Strategy selection reverted to original.", "system");
            }

            if (state.originalBetDelay) {
                CONFIG.betDelay = state.originalBetDelay;
                state.originalBetDelay = null;
                updateBetDelayConfigUI();
                log(`Bet delay reverted to config default: ${CONFIG.betDelay}ms`, "system");
            }

            state.stackingDelay = 0; // Reset stacking delay on stop
            log("Stacking delay has been reset.", "system");

        } else { // Starting
            state.running = true;
            state.originalAutoStrategy = document.getElementById('auto-strategy-select').value;
            state.originalBetDelay = CONFIG.betDelay; // Save current delay
            const btn = document.getElementById('start-stop-btn');
            btn.textContent = 'Stop Auto (S)';
            btn.classList.remove('bot-btn-primary');
            btn.classList.add('bot-btn-danger');
            updateStatus('Auto Running...');
            updateInputDisabledState();
            startBot();
        }
    }

    // --- WINDOW CONTROLS ---
    function minimizeBot() {
        document.getElementById('dice-bot-window').style.display = 'none';
        document.getElementById('dice-bot-minimized-bar').style.display = 'flex';
    }

    function maximizeBot() {
        document.getElementById('dice-bot-window').style.display = 'flex';
        document.getElementById('dice-bot-minimized-bar').style.display = 'none';
    }

    function closeBot() {
        document.getElementById('dice-bot-window').style.display = 'none';
        document.getElementById('dice-bot-minimized-bar').style.display = 'none';
        log("Bot window closed. Refresh the page to reopen.", "system");
    }


    // --- SECURITY & ADMIN ---

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadSecurityConfig() {
        storedUsername = localStorage.getItem('stakeDiceBotUser') || '';
        storedPasswordHash = localStorage.getItem('stakeDiceBotPassHash') || '';
        document.getElementById('admin-username').value = storedUsername;
    }

    async function saveCredentials() {
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        const newUsername = usernameInput.value.trim();
        const newPassword = passwordInput.value;

        const performSave = async () => {
            let changesMade = false;
            if (newUsername !== storedUsername) {
                storedUsername = newUsername;
                localStorage.setItem('stakeDiceBotUser', storedUsername);
                log("Username updated.", "system");
                changesMade = true;
            }

            if (newPassword) {
                storedPasswordHash = await hashPassword(newPassword);
                localStorage.setItem('stakeDiceBotPassHash', storedPasswordHash);
                passwordInput.value = '';
                log("Password updated.", "system");
                updateAdminStatus("Password updated. You can now lock the bot.", "info");
                changesMade = true;
            }

            if (changesMade) {
                showNotification('Credentials saved!');
            }
        };

        if (newPassword && storedPasswordHash) {
            promptForPassword(performSave, "Enter your CURRENT password to save changes.");
        } else {
            await performSave();
        }
    }


    function handleLockUnlock() {
        if (state.isLocked) {
            promptForPassword(unlockUI);
        } else {
            if (!storedPasswordHash) {
                showNotification("Please set a password before locking.");
                return;
            }
            lockUI();
        }
    }

    function lockUI() {
        state.isLocked = true;
        document.querySelector('.bot-tab-btn[data-tab="semi-auto"]').click();
        document.querySelector('.bot-tabs').classList.add('locked');
        const lockBtn = document.getElementById('lock-unlock-btn');
        lockBtn.textContent = "Unlock";
        lockBtn.classList.remove('bot-btn-primary');
        lockBtn.classList.add('bot-btn-danger');
        updateAdminStatus(`Locked by ${storedUsername || 'Admin'}. UI is restricted.`, "locked");
        log("Bot settings locked.", "system");
    }

    function unlockUI() {
        state.isLocked = false;
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
        if (modal.style.display === 'flex') return;

        pendingAction = onSuccess;
        const messageEl = document.getElementById('password-prompt-message');
        const errorEl = document.getElementById('password-prompt-error');

        if (messageEl) messageEl.textContent = message;
        document.getElementById('prompt-password-input').value = "";
        errorEl.style.display = 'none';
        modal.style.display = 'flex';
        document.getElementById('prompt-password-input').focus();
    }

    async function handleSubmitPassword() {
        const password = document.getElementById('prompt-password-input').value;
        const hash = await hashPassword(password);
        if (hash === storedPasswordHash) {
            document.getElementById('password-prompt-modal').style.display = 'none';
            if (typeof pendingAction === 'function') {
                pendingAction();
            }
            pendingAction = null;
        } else {
            const errorEl = document.getElementById('password-prompt-error');
            errorEl.textContent = "Incorrect password. Please try again.";
            errorEl.style.display = 'block';
        }
    }

    function updateAdminStatus(text, status) {
        const statusEl = document.getElementById('admin-status');
        if (!statusEl) return;
        statusEl.textContent = text;
        if (status === 'locked') {
            statusEl.style.color = 'var(--accent-red)';
        } else if (status === 'unlocked') {
            statusEl.style.color = 'var(--accent-green)';
        } else {
            statusEl.style.color = '#b1bad3';
        }
    }


    // --- API & NETWORK LOGIC ---

    function getAuthToken() {
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1];
        if (cookieToken) {
            console.log("Auto-detected auth token from cookie.");
            return cookieToken;
        }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (typeof value === 'string' && value.split('.').length === 3 && value.startsWith('ey')) {
                console.log(`Auto-detected auth token in localStorage key: "${key}"`);
                return value;
            }
        }
        console.warn("Could not auto-detect auth token.");
        return '';
    }

    function generateRandomSeed() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = Math.floor(Math.random() * 64) + 1;
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
            updateStatus("Error: Auth Token not found!");
            log("Seed change failed: Auth Token missing.", "error");
            return false;
        }

        const newClientSeed = generateRandomSeed();

        const graphqlQuery = {
            query: `
                mutation changeClientSeed($seed: String!) {
                    changeClientSeed(seed: $seed) {
                        id
                        seed
                        __typename
                    }
                }
            `,
            variables: {
                seed: newClientSeed
            },
            operationName: "changeClientSeed"
        };

        try {
            const response = await fetch(CONFIG.seedChangeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify(graphqlQuery),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const responseText = await response.text();
                if (responseText.includes("Cloudflare") || responseText.toLowerCase().includes("<!doctype html")) {
                    if (!state.apiBlockStartTime) {
                        state.apiBlockStartTime = Date.now();
                        log("API request blocked (Cloudflare). Cooldown timer started.", "error");
                    }
                    throw new Error("API request was blocked, likely by Cloudflare. The response was HTML, not JSON.");
                }
                throw new Error(`API returned a non-JSON response. Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!response.ok || responseData.errors || (responseData.data && !responseData.data.changeClientSeed)) {
                let errorMessage = 'Unknown API error';
                if (responseData.errors) {
                    errorMessage = responseData.errors.map(e => e.message).join(', ');
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                }
                throw new Error(`API Error: ${errorMessage}`);
            }

            console.log("Successfully changed seed via API:", responseData);
            updateStatus("Seed Changed!");
            log(`Seed changed successfully. New seed: ${newClientSeed}`, "strategy");

            if (state.apiBlockStartTime) {
                const cooldownDuration = (Date.now() - state.apiBlockStartTime) / 1000;
                log(`API privileges restored. Cooldown period was ${cooldownDuration.toFixed(2)} seconds.`, "system");
                state.apiBlockStartTime = 0; // Reset timer
            }
            return true;
        } catch (error) {
            console.error("Failed to change seed programmatically:", error);
            updateStatus("Error: Seed change failed.");
            log(`Seed change failed: ${error.message}`, "error");
            // Check if the error is a block and start the timer if not already started
            if (error.message.includes("blocked") && !state.apiBlockStartTime) {
                state.apiBlockStartTime = Date.now();
                log("API request blocked. Cooldown timer started.", "error");
            }
            return false;
        }
    }

    // --- CONFIGURATION MANAGEMENT ---

    function populateConfigTab() {
        const container = document.getElementById('config-container');
        container.innerHTML = '';
        for (const key in CONFIG) {
            const friendlyName = CONFIG_FRIENDLY_NAMES[key] || key;
            const group = document.createElement('div');
            group.className = 'config-group';

            let inputWrapperHtml = '';
            let labelHtml = `<label for="config-${key}">${friendlyName}</label>`;

            if (key === 'betDelay') {
                labelHtml = `<label>${friendlyName}
                    <span class="config-tooltip-trigger" style="display: none;">?
                        <span class="tooltip-text">A low delay (< 20ms) can cause the bot to miss bet results. Use with caution.</span>
                    </span>
                </label>`;

                const parts = String(CONFIG.betDelay).split('-').map(p => p.trim());
                const min = parts[0] || '';
                const max = parts[1] || '';

                inputWrapperHtml = `
                    <div class="input-wrapper config-range-wrapper">
                        <input type="number" id="config-betDelay-min" class="bot-input" value="${min}" placeholder="Min">
                        <span>to</span>
                        <input type="number" id="config-betDelay-max" class="bot-input" value="${max}" placeholder="Max">
                    </div>
                `;
                group.innerHTML = `${labelHtml}${inputWrapperHtml}`;
                container.appendChild(group);

            } else if (key === 'uiScale') {
                group.innerHTML = `
                    <label for="config-uiScale">${friendlyName}</label>
                    <div class="input-wrapper" style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="config-uiScale" class="bot-input" min="50" max="150" value="${CONFIG[key]}" style="flex-grow: 1; padding: 0;">
                        <span id="config-uiScale-value" style="flex-basis: 40px; text-align: right;">${CONFIG[key]}%</span>
                    </div>
                `;
                container.appendChild(group);

            } else {
                const isSelector = !["authToken", "seedChangeEndpoint", "baseWinChance", "maxBetAmount", "confirmSeedChange"].includes(key);
                if (key === 'authToken') {
                    inputWrapperHtml = `
                        <div class="input-wrapper">
                            <input type="password" id="config-${key}" class="bot-input" value="${CONFIG[key]}" placeholder="Auto-detected or paste here">
                            <button class="config-toggle-vis-btn" data-target="config-${key}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                        </div>
                    `;
                } else if (key === 'confirmSeedChange') {
                     // This key is from the old version and is no longer used, so we skip it to avoid adding it to the UI.
                } else {
                    inputWrapperHtml = `
                        <div class="input-wrapper">
                            <input type="text" id="config-${key}" class="bot-input" value="${CONFIG[key]}">
                            ${isSelector ? `<button class="config-pick-btn" data-key="${key}">Pick</button>` : ''}
                        </div>
                    `;
                }
                if (key !== 'confirmSeedChange') {
                    group.innerHTML = `${labelHtml}${inputWrapperHtml}`;
                    container.appendChild(group);
                }
            }
        }

        container.querySelectorAll('.config-pick-btn').forEach(btn => btn.addEventListener('click', (e) => initSelectorPicker(e.target.dataset.key)));
        container.querySelectorAll('.config-toggle-vis-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetInput = document.getElementById(e.currentTarget.dataset.target);
                if (targetInput) {
                    const isPassword = targetInput.type === 'password';
                    targetInput.type = isPassword ? 'text' : 'password';
                    e.currentTarget.innerHTML = isPassword ?
                        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` :
                        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
                }
            });
        });

        const minDelayInput = document.getElementById('config-betDelay-min');
        const maxDelayInput = document.getElementById('config-betDelay-max');

        if (minDelayInput && maxDelayInput) {
            const groupEl = minDelayInput.closest('.config-group');
            const tooltipTrigger = groupEl ? groupEl.querySelector('.config-tooltip-trigger') : null;

            const validateDelay = () => {
                const minVal = minDelayInput.value.trim();
                const maxVal = maxDelayInput.value.trim();
                const min = parseInt(minVal, 10);
                const max = parseInt(maxVal, 10);

                let isValid = true;
                let showWarning = false;

                if (minVal && isNaN(min)) isValid = false;
                if (maxVal && isNaN(max)) isValid = false;
                if (minVal && maxVal && min > max) isValid = false;
                if (!minVal && maxVal) isValid = false;

                if (minVal && min < 20) {
                    showWarning = true;
                }

                minDelayInput.classList.toggle('invalid-range', !isValid);
                maxDelayInput.classList.toggle('invalid-range', !isValid);
                if (tooltipTrigger) {
                    tooltipTrigger.style.display = showWarning ? 'inline-flex' : 'none';
                }
            };

            minDelayInput.addEventListener('input', validateDelay);
            maxDelayInput.addEventListener('input', validateDelay);
            validateDelay();
        }

        const uiScaleSlider = document.getElementById('config-uiScale');
        if (uiScaleSlider) {
            const uiScaleValue = document.getElementById('config-uiScale-value');
            uiScaleSlider.addEventListener('input', () => {
                const scale = uiScaleSlider.value;
                uiScaleValue.textContent = `${scale}%`;
                applyUiScale(scale);
            });
        }
    }

    function initSelectorPicker(configKey) {
        if (isPickingElement) return;
        isPickingElement = true;
        const overlay = document.getElementById('element-picker-overlay');
        const tooltip = document.getElementById('element-picker-tooltip');
        overlay.style.display = 'block';
        tooltip.style.display = 'block';

        const mouseMoveHandler = (e) => {
            const target = e.target;
            if (target.id === 'dice-bot-window' || target.closest('#dice-bot-window')) {
                overlay.style.display = 'none';
                return;
            }
            overlay.style.display = 'block';
            const rect = target.getBoundingClientRect();
            Object.assign(overlay.style, {
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                top: `${rect.top}px`,
                left: `${rect.left}px`
            });
        };

        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target;
            if (target.id === 'dice-bot-window' || target.closest('#dice-bot-window')) return;
            document.getElementById(`config-${configKey}`).value = generateSelector(target);
            cleanup();
        };

        const escHandler = (e) => e.key === "Escape" && cleanup();
        const cleanup = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('click', clickHandler, true);
            document.removeEventListener('keydown', escHandler, true);
            overlay.style.display = 'none';
            tooltip.style.display = 'none';
            isPickingElement = false;
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('click', clickHandler, true);
        document.addEventListener('keydown', escHandler, true);
    }

    function generateSelector(el) {
        if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
        if (el.getAttribute('data-test')) return `[data-test="${el.getAttribute('data-test')}"]`;
        if (el.id) return `#${el.id}`;
        if (el.className) {
            const classNames = typeof el.className === 'string' ? el.className.split(' ').filter(c => c && !c.includes('svelte-')) : [];
            if (classNames.length > 0) return `.${classNames.join('.')}`;
        }
        return el.tagName.toLowerCase();
    }

    function saveConfig() {
        const newConfig = { ...CONFIG
        };
        for (const key in CONFIG) {
            if (key === 'betDelay') {
                const min = document.getElementById('config-betDelay-min').value.trim();
                const max = document.getElementById('config-betDelay-max').value.trim();
                if (min && max) {
                    newConfig[key] = `${min}-${max}`;
                } else if (min) {
                    newConfig[key] = min;
                } else {
                    newConfig[key] = '100';
                }
            } else {
                const el = document.getElementById(`config-${key}`);
                if (el) {
                    if (key === 'uiScale') {
                        newConfig[key] = parseInt(el.value, 10);
                    } else if (typeof CONFIG[key] === 'boolean') {
                        newConfig[key] = el.value === 'true';
                    } else {
                        newConfig[key] = el.value;
                    }
                }
            }
        }
        localStorage.setItem('stakeDiceBotConfig', JSON.stringify(newConfig));
        CONFIG = newConfig;
        showNotification('Configuration saved!');
        log("Configuration saved.", "system");
    }

    function loadConfig() {
        const hostname = window.location.hostname;
        CONFIG.seedChangeEndpoint = '/_api/graphql';
        log(`API endpoint configured for ${hostname}.`, "system");

        const saved = localStorage.getItem('stakeDiceBotConfig');
        if (saved) {
            try {
                let customConfig = JSON.parse(saved);
                const selectorKeys = ['betButton', 'amountInput', 'payoutInput', 'winChanceInput', 'gameFrame', 'pastBetsContainer', 'autoTab', 'manualTab', 'reverseRollButton'];

                // Pre-validate any selector strings to prevent runtime errors.
                for (const key of selectorKeys) {
                    if (customConfig[key] && typeof customConfig[key] === 'string') {
                        try {
                            // Dummy query to validate the selector syntax.
                            document.querySelector(customConfig[key]);
                        } catch (e) {
                            log(`Skipping invalid selector for '${key}' from saved config.`, "system");
                            // Revert this key to the default to prevent errors.
                            delete customConfig[key];
                        }
                    }
                }
                CONFIG = { ...CONFIG, ...customConfig };
                console.log("Loaded custom config from storage.");
            } catch (e) {
                console.error("Failed to parse custom config from localStorage.", e);
            }
        }
        if (!CONFIG.authToken) {
            CONFIG.authToken = getAuthToken();
        }
    }

    function resetConfigToDefault() {
        if (confirm("Are you sure you want to reset all configuration to defaults?")) {
            localStorage.removeItem('stakeDiceBotConfig');
            CONFIG = {
                authToken: '',
                seedChangeEndpoint: '/_api/graphql',
                betButton: '[data-testid="bet-button"]',
                amountInput: '[data-testid="input-game-amount"]',
                payoutInput: '[data-testid="payout"]',
                winChanceInput: '[data-testid="chance"]',
                baseWinChance: 49.5,
                betDelay: '100',
                maxBetAmount: 0,
                gameFrame: '[data-testid="game-frame"]',
                pastBetsContainer: '.past-bets',
                winClass: 'variant-success',
                lossClass: 'variant-neutral',
                autoTab: '[data-testid="auto-tab"]',
                manualTab: '[data-testid="manual-tab"]',
                reverseRollButton: '[data-testid="reverse-roll"]',
                uiScale: 100,
            };
            loadConfig();
            populateConfigTab();
            applyUiScale();
            showNotification("Configuration has been reset to default.");
            log("Configuration reset to defaults.", "system");
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
            addRuleToModal();
        }
        modal.style.display = 'flex';
        validateStrategyRules();
    }

    function addRuleToModal(rule = {}) {
        const rulesContainer = document.getElementById('strategy-rules-container');
        const ruleDiv = document.createElement('div');
        ruleDiv.className = 'strategy-rule';
        const ruleId = `rule-${Date.now()}-${Math.random()}`;
        ruleDiv.id = ruleId;

        const defaults = {
            conditionType: 'bets',
            playConditionTerm: 'every',
            playConditionValue: 1,
            playConditionBetType: 'lose',
            netGainCondition: 'greater',
            netGainValue: 0,
            action: 'increaseByPercentage',
            actionValue: 100,
            timeSinceWinCondition: 'greater',
            timeSinceWinValue: 10,
            patternMatch: 'LWL',
        };
        const currentRule = { ...defaults,
            ...rule
        };

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
                <div class="rule-toggle-group">
                    <input type="radio" id="${ruleId}-type-bets" name="${ruleId}-type" value="bets" ${currentRule.conditionType === 'bets' ? 'checked' : ''}>
                    <label for="${ruleId}-type-bets">Play</label>
                    <input type="radio" id="${ruleId}-type-profit" name="${ruleId}-type" value="profit" ${currentRule.conditionType === 'profit' ? 'checked' : ''}>
                    <label for="${ruleId}-type-profit">Net Gain</label>
                    <input type="radio" id="${ruleId}-type-time" name="${ruleId}-type" value="time" ${currentRule.conditionType === 'time' ? 'checked' : ''}>
                    <label for="${ruleId}-type-time">Time</label>
                    <input type="radio" id="${ruleId}-type-pattern" name="${ruleId}-type" value="pattern" ${currentRule.conditionType === 'pattern' ? 'checked' : ''}>
                    <label for="${ruleId}-type-pattern">Pattern</label>
                </div>

                <div class="play-condition-sentence rule-sentence">
                    <span>On</span>
                    <select class="bot-input play-term">
                        <option value="every">Every</option>
                        <option value="everyStreakOf">Every streak of</option>
                        <option value="firstStreakOf">First streak of</option>
                        <option value="streakGreaterThan">Streak greater than</option>
                        <option value="streakLowerThan">Streak lower than</option>
                    </select>
                    <input type="number" class="bot-input play-value" value="${currentRule.playConditionValue}">
                    <select class="bot-input play-bet-type">
                        <option value="win">Wins</option>
                        <option value="lose">Losses</option>
                        <option value="bet">Games</option>
                    </select>
                </div>
                <div class="net-gain-condition-sentence rule-sentence">
                    <span>If Net Gain is</span>
                    <select class="bot-input net-gain-condition">
                        <option value="greater">&gt;</option>
                        <option value="less">&lt;</option>
                        <option value="=">=</option>
                    </select>
                    <input type="number" step="any" class="bot-input net-gain-value" value="${currentRule.netGainValue}">
                </div>
                <div class="time-condition-sentence rule-sentence">
                    <span>If time since last win is</span>
                    <select class="bot-input time-condition">
                        <option value="greater">&gt;</option>
                        <option value="less">&lt;</option>
                    </select>
                    <input type="number" class="bot-input time-value" value="${currentRule.timeSinceWinValue}">
                    <span>seconds</span>
                </div>
                <div class="pattern-condition-sentence rule-sentence">
                    <span>If last bets match pattern</span>
                    <input type="text" class="bot-input pattern-value" placeholder="e.g. LWL" value="${currentRule.patternMatch}">
                </div>

                <div class="action-sentence rule-sentence">
                    <span>Do</span>
                    <select class="bot-input action-type">
                        <option value="increaseByPercentage">Increase Amount by %</option>
                        <option value="decreaseByPercentage">Decrease Amount by %</option>
                        <option value="setAmount">Set Amount</option>
                        <option value="resetAmount">Reset Amount</option>
                        <option value="setBaseBet">Set Base Bet</option>
                        <option value="increaseBaseBetByPercentage">Increase Base Bet by %</option>
                        <option value="decreaseBaseBetByPercentage">Decrease Base Bet by %</option>
                        <option value="increaseWinChanceBy">Increase Win Chance by %</option>
                        <option value="decreaseWinChanceBy">Decrease Win Chance by %</option>
                        <option value="setWinChance">Set Win Chance</option>
                        <option value="resetWinChance">Reset Win Chance</option>
                        <option value="setBetSpeed">Change Delay Range</option>
                        <option value="addStackingDelayRange">Add Stacking Delay Range</option>
                        <option value="resetStackingBetSpeed">Reset Stacking Delay</option>
                        <option value="switchOverUnder">Switch Over/Under</option>
                        <option value="randomSwitchOnWin">Randomly Switch Over/Under on Win</option>
                        <option value="randomSwitchOnLoss">Randomly Switch Over/Under on Loss</option>
                        <option value="randomSwitch">Randomly Switch Over/Under</option>
                        <option value="changeSeed">Change Seed (API)</option>
                        <option value="switchStrategy">Switch Strategy</option>
                        <option value="stop">Stop Autoplay</option>
                        <option value="notify">Show Notification</option>
                    </select>
                    <input type="number" step="any" class="bot-input action-value" value="${currentRule.actionValue}">
                    <input type="text" class="bot-input action-value-text" style="display: none;" placeholder="Notification message...">
                    <select class="bot-input action-strategy-select" style="display: none;"></select>
                    <div class="action-value-range" style="display: none; align-items: center; gap: 5px;">
                        <input type="number" class="bot-input action-value-range-min" placeholder="Min">
                        <span>to</span>
                        <input type="number" class="bot-input action-value-range-max" placeholder="Max">
                        <span>ms</span>
                    </div>
                </div>
            </div>
        `;
        rulesContainer.appendChild(ruleDiv);

        ruleDiv.querySelector('.play-term').value = currentRule.playConditionTerm;
        ruleDiv.querySelector('.play-bet-type').value = currentRule.playConditionBetType;
        ruleDiv.querySelector('.net-gain-condition').value = currentRule.netGainCondition;
        ruleDiv.querySelector('.time-condition').value = currentRule.timeSinceWinCondition;
        ruleDiv.querySelector('.action-type').value = currentRule.action;

        const actionStrategySelect = ruleDiv.querySelector('.action-strategy-select');
        for (const name in advancedStrategies) {
            actionStrategySelect.add(new Option(name, name));
        }
        if (currentRule.action === 'switchStrategy') {
            actionStrategySelect.value = currentRule.actionValue;
        }


        const summary = ruleDiv.querySelector('.strategy-rule-summary');
        const playSentence = ruleDiv.querySelector('.play-condition-sentence');
        const netGainSentence = ruleDiv.querySelector('.net-gain-condition-sentence');
        const timeSentence = ruleDiv.querySelector('.time-condition-sentence');
        const patternSentence = ruleDiv.querySelector('.pattern-condition-sentence');
        const actionValueInput = ruleDiv.querySelector('.action-value');
        const actionValueTextInput = ruleDiv.querySelector('.action-value-text');
        const actionValueRange = ruleDiv.querySelector('.action-value-range');
        const actionTypeSelect = ruleDiv.querySelector('.action-type');

        if (currentRule.action === 'notify') {
            actionValueTextInput.value = currentRule.actionValue;
        } else if ((currentRule.action === 'setBetSpeed' || currentRule.action === 'addStackingDelayRange') && typeof currentRule.actionValue === 'string') {
            const [min, max] = currentRule.actionValue.split('-');
            ruleDiv.querySelector('.action-value-range-min').value = min || '';
            ruleDiv.querySelector('.action-value-range-max').value = max || '';
        }

        const updateVisibility = () => {
            const type = ruleDiv.querySelector(`input[name="${ruleId}-type"]:checked`).value;
            playSentence.style.display = type === 'bets' ? '' : 'none';
            netGainSentence.style.display = type === 'profit' ? '' : 'none';
            timeSentence.style.display = type === 'time' ? '' : 'none';
            patternSentence.style.display = type === 'pattern' ? '' : 'none';

            const actionType = actionTypeSelect.value;
            const noValueActions = ['resetAmount', 'resetWinChance', 'switchOverUnder', 'changeSeed', 'stop', 'resetStackingBetSpeed'];
            const isSwitchStrategy = actionType === 'switchStrategy';
            const isNotify = actionType === 'notify';
            const isSetSpeed = actionType === 'setBetSpeed';
            const isAddStackingDelay = actionType === 'addStackingDelayRange';

            actionValueInput.style.display = noValueActions.includes(actionType) || isSwitchStrategy || isNotify || isSetSpeed || isAddStackingDelay ? 'none' : 'block';
            actionValueTextInput.style.display = isNotify ? 'block' : 'none';
            actionStrategySelect.style.display = isSwitchStrategy ? 'block' : 'none';
            actionValueRange.style.display = isSetSpeed || isAddStackingDelay ? 'flex' : 'none';


            validateStrategyRules();
            updateSummary();
        };

        const updateSummary = () => {
            const type = ruleDiv.querySelector(`input[name="${ruleId}-type"]:checked`).value;
            let conditionText = '';
            if (type === 'bets') {
                const term = ruleDiv.querySelector('.play-term option:checked').textContent;
                const value = ruleDiv.querySelector('.play-value').value;
                const betType = ruleDiv.querySelector('.play-bet-type option:checked').textContent;
                conditionText = `On ${term} ${value} ${betType}`;
            } else if (type === 'profit') {
                const op = ruleDiv.querySelector('.net-gain-condition option:checked').textContent;
                const value = ruleDiv.querySelector('.net-gain-value').value;
                conditionText = `If Net Gain ${op} ${value}`;
            } else if (type === 'time') {
                const op = ruleDiv.querySelector('.time-condition option:checked').textContent;
                const value = ruleDiv.querySelector('.time-value').value;
                conditionText = `If time since win ${op} ${value}s`;
            } else if (type === 'pattern') {
                const value = ruleDiv.querySelector('.pattern-value').value;
                conditionText = `If pattern is ${value}`;
            }

            const actionType = actionTypeSelect.value;
            const actionText = actionTypeSelect.options[actionTypeSelect.selectedIndex].textContent;
            let actionValueText = '';
            const noValueActions = ['resetAmount', 'resetWinChance', 'switchOverUnder', 'changeSeed', 'stop', 'resetStackingBetSpeed'];

            if (!noValueActions.includes(actionType)) {
                if (actionType === 'switchStrategy') {
                    actionValueText = ` to ${actionStrategySelect.value}`;
                } else if (actionType === 'notify') {
                    actionValueText = ` "${actionValueTextInput.value}"`;
                } else if (actionType === 'setBetSpeed' || actionType === 'addStackingDelayRange') {
                    const min = ruleDiv.querySelector('.action-value-range-min').value;
                    const max = ruleDiv.querySelector('.action-value-range-max').value;
                    actionValueText = ` to ${min || '?'} - ${max || '?'}ms`;
                } else {
                    actionValueText = ` ${actionValueInput.value}`;
                }
            }

            summary.innerHTML = `<span>${conditionText} →</span><span class="summary-action">${actionText}${actionValueText}</span>`;
        };

        ruleDiv.querySelector('.strategy-rule-header').addEventListener('click', (e) => {
            if (!e.target.matches('.move-btn, .remove-btn')) {
                ruleDiv.classList.toggle('expanded');
                updateSummary();
            }
        });

        ruleDiv.querySelectorAll('input, select').forEach(el => el.addEventListener('change', updateVisibility));
        ruleDiv.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updateSummary));


        ruleDiv.querySelector('.remove-btn').addEventListener('click', () => {
            ruleDiv.remove();
            validateStrategyRules();
        });

        ruleDiv.querySelectorAll('.move-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.target.dataset.direction;
                const parent = ruleDiv.parentNode;
                if (direction === 'up' && ruleDiv.previousElementSibling) {
                    parent.insertBefore(ruleDiv, ruleDiv.previousElementSibling);
                } else if (direction === 'down' && ruleDiv.nextElementSibling) {
                    parent.insertBefore(ruleDiv.nextElementSibling, ruleDiv);
                }
            });
        });

        updateVisibility();
    }

    function validateStrategyRules() {
        const warningEl = document.getElementById('strategy-modal-warning');
        const saveBtn = document.getElementById('save-strategy-btn');
        // All validation logic for seed changes has been removed.
        warningEl.style.display = 'none';
        saveBtn.disabled = false;
    }


    function saveStrategy() {
        validateStrategyRules();
        if (document.getElementById('save-strategy-btn').disabled) {
            showNotification("Please fix the errors in your strategy before saving.", "error");
            return;
        }

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
        document.querySelectorAll('.strategy-rule').forEach(ruleDiv => {
            const action = ruleDiv.querySelector('.action-type').value;
            let actionValue;
            if (action === 'switchStrategy') {
                actionValue = ruleDiv.querySelector('.action-strategy-select').value;
            } else if (action === 'notify') {
                actionValue = ruleDiv.querySelector('.action-value-text').value;
            } else if (action === 'setBetSpeed' || action === 'addStackingDelayRange') {
                const min = ruleDiv.querySelector('.action-value-range-min').value.trim();
                const max = ruleDiv.querySelector('.action-value-range-max').value.trim();
                if (min && max) {
                    actionValue = `${min}-${max}`;
                } else {
                    actionValue = min;
                }
            } else {
                actionValue = parseFloat(ruleDiv.querySelector('.action-value').value);
            }

            rules.push({
                conditionType: ruleDiv.querySelector('input[name*="-type"]:checked').value,
                playConditionTerm: ruleDiv.querySelector('.play-term').value,
                playConditionValue: parseFloat(ruleDiv.querySelector('.play-value').value),
                playConditionBetType: ruleDiv.querySelector('.play-bet-type').value,
                netGainCondition: ruleDiv.querySelector('.net-gain-condition').value,
                netGainValue: parseFloat(ruleDiv.querySelector('.net-gain-value').value),
                timeSinceWinCondition: ruleDiv.querySelector('.time-condition').value,
                timeSinceWinValue: parseFloat(ruleDiv.querySelector('.time-value').value),
                patternMatch: ruleDiv.querySelector('.pattern-value').value,
                action: action,
                actionValue: actionValue,
            });
        });

        if (originalName && originalName !== newName) {
            delete advancedStrategies[originalName];
        }
        advancedStrategies[newName] = rules;
        saveStrategies();
        document.getElementById('strategy-modal').style.display = 'none';
        log(`Strategy '${newName}' saved.`, "system");
    }

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

    async function executeAdvancedStrategy(rules, targetState, baseBet) {
        let betAmountModified = false;
        let winChanceModified = false;
        const currentStrategyName = document.getElementById('auto-strategy-select').value;

        // Reset persistent trigger flags if their conditions are no longer met
        for (const ruleKey in state.persistentTriggerStates) {
            const [strategyName, ruleIndex] = ruleKey.split('-');
            if (strategyName !== currentStrategyName || !advancedStrategies[strategyName] || !advancedStrategies[strategyName][ruleIndex]) {
                delete state.persistentTriggerStates[ruleKey];
                continue;
            }
            const rule = advancedStrategies[strategyName][ruleIndex];
            const isConditionMet = checkCondition(rule);
            if (!isConditionMet) {
                delete state.persistentTriggerStates[ruleKey];
                log(`Persistent trigger for Rule #${parseInt(ruleIndex)+1} reset.`, "strategy");
            }
        }

        for (const [index, rule] of rules.entries()) {
            const conditionMet = checkCondition(rule);
            let conditionText = ''; // You can expand this to generate text for notifications if needed

            if (conditionMet) {
                log(`<b>Strategy Trigger:</b> Rule #${index + 1}`, "strategy");

                const action = rule.action;
                const isBetAction = ['increaseByPercentage', 'decreaseByPercentage', 'setAmount', 'resetAmount', 'setBaseBet', 'increaseBaseBetByPercentage', 'decreaseBaseBetByPercentage'].includes(action);
                const isWinChanceAction = ['increaseWinChanceBy', 'decreaseWinChanceBy', 'setWinChance', 'resetWinChance'].includes(action);
                const isOneTimeAction = ['changeSeed'];
                const isPersistentCondition = ['profit', 'time'].includes(rule.conditionType);

                if (isBetAction && betAmountModified) {
                    log(`&nbsp;&nbsp;↳ Action skipped: Bet amount already modified in this step.`, "strategy");
                    continue;
                }
                if (isWinChanceAction && winChanceModified) {
                    log(`&nbsp;&nbsp;↳ Action skipped: Win chance already modified in this step.`, "strategy");
                    continue;
                }

                if (isOneTimeAction.includes(action) && isPersistentCondition) {
                    const ruleKey = `${currentStrategyName}-${index}`;
                    if (state.persistentTriggerStates[ruleKey]) {
                        log(`&nbsp;&nbsp;↳ Action skipped: Persistent trigger already fired.`, "strategy");
                        continue;
                    }
                    state.persistentTriggerStates[ruleKey] = true;
                }


                switch (action) {
                    case 'increaseByPercentage':
                        targetState.currentBet *= (1 + rule.actionValue / 100);
                        log(`&nbsp;&nbsp;↳ Action: Increased bet by ${rule.actionValue}%. New bet: ${targetState.currentBet.toFixed(8)}`, "strategy");
                        break;
                    case 'decreaseByPercentage':
                        targetState.currentBet *= (1 - rule.actionValue / 100);
                        log(`&nbsp;&nbsp;↳ Action: Decreased bet by ${rule.actionValue}%. New bet: ${targetState.currentBet.toFixed(8)}`, "strategy");
                        break;
                    case 'resetAmount':
                        targetState.currentBet = baseBet;
                        log(`&nbsp;&nbsp;↳ Action: Reset bet to base. New bet: ${targetState.currentBet.toFixed(8)}`, "strategy");
                        break;
                    case 'setAmount':
                        targetState.currentBet = rule.actionValue;
                        log(`&nbsp;&nbsp;↳ Action: Set bet to ${rule.actionValue}. New bet: ${targetState.currentBet.toFixed(8)}`, "strategy");
                        break;
                    case 'setBaseBet':
                        if (targetState === state) { // Auto mode
                            state.baseBet = rule.actionValue;
                            document.getElementById('base-bet').value = rule.actionValue;
                        } else { // Semi-auto mode
                            document.getElementById('semi-auto-base-bet').value = rule.actionValue;
                        }
                        log(`&nbsp;&nbsp;↳ Action: Set base bet to ${rule.actionValue}.`, "strategy");
                        break;
                    case 'increaseBaseBetByPercentage':
                        if (targetState === state) { // Auto mode
                            state.baseBet *= (1 + rule.actionValue / 100);
                            document.getElementById('base-bet').value = state.baseBet.toFixed(8);
                        } else { // Semi-auto mode
                            const semiAutoBaseEl = document.getElementById('semi-auto-base-bet');
                            semiAutoBaseEl.value = (parseFloat(semiAutoBaseEl.value) * (1 + rule.actionValue / 100)).toFixed(8);
                        }
                        log(`&nbsp;&nbsp;↳ Action: Increased base bet by ${rule.actionValue}%.`, "strategy");
                        break;
                    case 'decreaseBaseBetByPercentage':
                        if (targetState === state) { // Auto mode
                            state.baseBet *= (1 - rule.actionValue / 100);
                            document.getElementById('base-bet').value = state.baseBet.toFixed(8);
                        } else { // Semi-auto mode
                            const semiAutoBaseEl = document.getElementById('semi-auto-base-bet');
                            semiAutoBaseEl.value = (parseFloat(semiAutoBaseEl.value) * (1 - rule.actionValue / 100)).toFixed(8);
                        }
                        log(`&nbsp;&nbsp;↳ Action: Decreased base bet by ${rule.actionValue}%.`, "strategy");
                        break;
                    case 'increaseWinChanceBy':
                        {
                            const input = document.querySelector(CONFIG.winChanceInput);
                            if (input) {
                                const currentVal = parseFloat(input.value) || 49.5;
                                const newVal = Math.min(98, currentVal + rule.actionValue);
                                setUIValue(CONFIG.winChanceInput, newVal);
                                log(`&nbsp;&nbsp;↳ Action: Increased win chance by ${rule.actionValue}%. New chance: ${newVal}%`, "strategy");
                            }
                            break;
                        }
                    case 'decreaseWinChanceBy':
                        {
                            const input = document.querySelector(CONFIG.winChanceInput);
                            if (input) {
                                const currentVal = parseFloat(input.value) || 49.5;
                                const newVal = Math.max(0.01, currentVal - rule.actionValue);
                                setUIValue(CONFIG.winChanceInput, newVal);
                                log(`&nbsp;&nbsp;↳ Action: Decreased win chance by ${rule.actionValue}%. New chance: ${newVal}%`, "strategy");
                            }
                            break;
                        }
                    case 'setWinChance':
                        setUIValue(CONFIG.winChanceInput, rule.actionValue);
                        log(`&nbsp;&nbsp;↳ Action: Set win chance to ${rule.actionValue}%.`, "strategy");
                        break;
                    case 'resetWinChance':
                        setUIValue(CONFIG.winChanceInput, CONFIG.baseWinChance);
                        log(`&nbsp;&nbsp;↳ Action: Reset win chance to base (${CONFIG.baseWinChance}%).`, "strategy");
                        break;
                    case 'setBetSpeed':
                        CONFIG.betDelay = rule.actionValue;
                        updateBetDelayConfigUI();
                        log(`&nbsp;&nbsp;↳ Action: Set bet speed to ${rule.actionValue}ms.`, "strategy");
                        break;
                    case 'addStackingDelayRange':
                        {
                            const delayRange = String(rule.actionValue).trim();
                            const parts = delayRange.split('-').map(p => parseInt(p.trim(), 10));
                            let addedDelay = 0;
                            if (parts.length === 2) {
                                const [min, max] = parts;
                                if (!isNaN(min) && !isNaN(max) && min <= max) {
                                    addedDelay = Math.floor(Math.random() * (max - min + 1)) + min;
                                }
                            } else if (parts.length === 1 && !isNaN(parts[0])) {
                                addedDelay = parts[0];
                            }

                            if (addedDelay > 0) {
                                state.stackingDelay += addedDelay;
                                log(`&nbsp;&nbsp;↳ Action: Added ${addedDelay}ms to stacking delay. Total: ${state.stackingDelay}ms`, "strategy");
                            } else {
                                log(`&nbsp;&nbsp;↳ Action failed: Invalid range for Add Stacking Delay: "${rule.actionValue}"`, "error");
                            }
                            break;
                        }
                    case 'resetStackingBetSpeed':
                        state.stackingDelay = 0;
                        log(`&nbsp;&nbsp;↳ Action: Reset stacking delay to 0ms.`, "strategy");
                        break;
                    case 'stop':
                        if (state.running) toggleBot();
                        log(`&nbsp;&nbsp;↳ Action: Stopped autoplay.`, "strategy");
                        break;
                    case 'changeSeed':
                        await promptForSeedChange(conditionText);
                        break;
                    case 'switchOverUnder':
                        document.querySelector(CONFIG.reverseRollButton)?.click();
                        log(`&nbsp;&nbsp;↳ Action: Switched Over/Under.`, "strategy");
                        break;
                    case 'randomSwitch':
                        {
                            // Use rule.actionValue as percentage chance (default 50)
                            const chance = isNaN(parseFloat(rule.actionValue)) ? 50 : parseFloat(rule.actionValue);
                            const roll = Math.random() * 100;
                            if (roll < chance) {
                                document.querySelector(CONFIG.reverseRollButton)?.click();
                                log(`&nbsp;&nbsp;↳ Action: Random switch triggered (${chance}% chance).`, "strategy");
                            } else {
                                log(`&nbsp;&nbsp;↳ Action skipped by randomness (${chance}% chance).`, "strategy");
                            }
                            break;
                        }
                    case 'randomSwitchOnWin':
                        {
                            // Only consider if the last bet was a win
                            const chance = isNaN(parseFloat(rule.actionValue)) ? 50 : parseFloat(rule.actionValue);
                            if (state.lastBetWasWin) {
                                const roll = Math.random() * 100;
                                if (roll < chance) {
                                    document.querySelector(CONFIG.reverseRollButton)?.click();
                                    log(`&nbsp;&nbsp;↳ Action: Random switch on WIN triggered (${chance}% chance).`, "strategy");
                                } else {
                                    log(`&nbsp;&nbsp;↳ Action skipped by randomness on WIN (${chance}% chance).`, "strategy");
                                }
                            } else {
                                log(`&nbsp;&nbsp;↳ Action skipped: last result was not a WIN.`, "strategy");
                            }
                            break;
                        }
                    case 'randomSwitchOnLoss':
                        {
                            // Only consider if the last bet was a loss
                            const chance = isNaN(parseFloat(rule.actionValue)) ? 50 : parseFloat(rule.actionValue);
                            if (!state.lastBetWasWin && state.lastBetWasWin !== null) { // Check for not win, and not the very first bet
                                const roll = Math.random() * 100;
                                if (roll < chance) {
                                    document.querySelector(CONFIG.reverseRollButton)?.click();
                                    log(`&nbsp;&nbsp;↳ Action: Random switch on LOSS triggered (${chance}% chance).`, "strategy");
                                } else {
                                    log(`&nbsp;&nbsp;↳ Action skipped by randomness on LOSS (${chance}% chance).`, "strategy");
                                }
                            } else {
                                log(`&nbsp;&nbsp;↳ Action skipped: last result was not a LOSS.`, "strategy");
                            }
                            break;
                        }
                    case 'switchStrategy':
                        {
                            const newStrategy = rule.actionValue;
                            const autoSelect = document.getElementById('auto-strategy-select');
                            const semiAutoSelect = document.getElementById('semi-auto-strategy');
                            if (autoSelect && semiAutoSelect && advancedStrategies[newStrategy]) {
                                autoSelect.value = newStrategy;
                                semiAutoSelect.value = newStrategy;
                                log(`&nbsp;&nbsp;↳ Action: Switched strategy to '${newStrategy}'.`, "strategy");
                            } else {
                                log(`&nbsp;&nbsp;↳ Action failed: Could not find strategy '${newStrategy}'.`, "error");
                            }
                            break;
                        }
                    case 'notify':
                        showNotification(rule.actionValue);
                        log(`&nbsp;&nbsp;↳ Action: Sent notification: "${rule.actionValue}"`, "strategy");
                        break;
                }

                if (isBetAction) betAmountModified = true;
                if (isWinChanceAction) winChanceModified = true;
            }
        }
    }

    function checkCondition(rule) {
        switch (rule.conditionType) {
            case 'bets':
                {
                    const value = rule.playConditionValue;
                    const betType = rule.playConditionBetType;
                    const isWin = betType === 'win';
                    const streak = isWin ? state.winStreak : state.lossStreak;

                    switch (rule.playConditionTerm) {
                        case 'every':
                            if (betType === 'bet' && state.betCount > 0 && state.betCount % value === 0) return true;
                            if (betType === 'win' && state.lastBetWasWin && streak > 0 && streak % value === 0) return true;
                            if (betType === 'lose' && !state.lastBetWasWin && streak > 0 && streak % value === 0) return true;
                            break;
                        case 'everyStreakOf':
                            if (betType !== 'bet' && streak > 0 && streak % value === 0) return true;
                            break;
                        case 'firstStreakOf':
                            const flag = `firstStreak-${rule.playConditionBetType}-${rule.playConditionValue}`;
                            if (betType !== 'bet' && streak === value && !state.strategyFlags[flag]) {
                                state.strategyFlags[flag] = true; // Mark as triggered for this session
                                return true;
                            } else if (betType !== 'bet' && streak < value) {
                                state.strategyFlags[flag] = false; // Reset if streak is broken
                            }
                            break;
                        case 'streakGreaterThan':
                            if (betType !== 'bet' && streak > value) return true;
                            break;
                        case 'streakLowerThan':
                            if (betType !== 'bet' && streak < value) return true;
                            break;
                    }
                    break;
                }
            case 'profit':
                if (rule.netGainCondition === 'greater' && state.totalProfit > rule.netGainValue) return true;
                if (rule.netGainCondition === 'less' && state.totalProfit < rule.netGainValue) return true;
                if (rule.netGainCondition === '=' && state.totalProfit.toFixed(8) == rule.netGainValue.toFixed(8)) return true;
                break;
            case 'time':
                {
                    const timeSinceWin = (Date.now() - state.lastWinTimestamp) / 1000;
                    if (rule.timeSinceWinCondition === 'greater' && timeSinceWin > rule.timeSinceWinValue) return true;
                    if (rule.timeSinceWinCondition === 'less' && timeSinceWin < rule.timeSinceWinValue) return true;
                    break;
                }
            case 'pattern':
                {
                    const pattern = rule.patternMatch.toUpperCase();
                    if (state.outcomeHistory.endsWith(pattern)) return true;
                    break;
                }
        }
        return false;
    }


    // --- HELPER & STATE FUNCTIONS ---

    function getBetDelay() {
        const delayValue = String(CONFIG.betDelay).trim();
        const parts = delayValue.split('-').map(p => parseInt(p.trim(), 10));
        let baseDelay = 100; // Default fallback

        if (parts.length === 2) {
            const [min, max] = parts;
            if (!isNaN(min) && !isNaN(max) && min <= max) {
                baseDelay = Math.floor(Math.random() * (max - min + 1)) + min;
            }
        } else if (parts.length === 1) {
            const delay = parts[0];
            if (!isNaN(delay)) {
                baseDelay = delay;
            }
        } else if (delayValue) { // Only log error if value is present but invalid
            log(`Invalid betDelay value "${CONFIG.betDelay}", defaulting to 100ms for base delay.`, 'error');
        }

        const totalDelay = baseDelay + (state.stackingDelay || 0);
        return totalDelay;
    }

    function showNotification(message, type = 'info') {
        const container = document.getElementById('bot-notification-container');
        const notification = document.createElement('div');
        notification.className = 'bot-notification';
        notification.innerHTML = `
            <div class="bot-notification-header">
                <span>${type === 'error' ? 'Error' : 'Bot Notification'}</span>
                <button class="close-btn">&times;</button>
            </div>
            <p>${message}</p>
        `;
        if (type === 'error') {
            notification.style.backgroundColor = 'var(--accent-red)';
        }
        container.appendChild(notification);

        const close = () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        };

        notification.querySelector('.close-btn').addEventListener('click', close);
        setTimeout(close, 10000); // Auto-dismiss after 10 seconds
    }

    /**
     * A more robust way to simulate a click event on an element.
     * @param {HTMLElement} element The element to click.
     */
    function simulateClick(element) {
        if (!element) return;
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: unsafeWindow
        };
        element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
        element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
        element.dispatchEvent(new MouseEvent('click', eventOptions));
    }

    /**
     * Sets an input element's value in a way that is compatible with frameworks like React.
     * @param {string} selector The CSS selector for the input element.
     * @param {string|number} value The value to set.
     * @returns {boolean} True if the element was found and updated, false otherwise.
     */
    function setUIValue(selector, value) {
        const input = document.querySelector(selector);
        if (input) {
            // Focus the element to simulate user interaction
            input.focus();

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, value.toString());

            // Dispatch events that React (and other frameworks) might listen for
            input.dispatchEvent(new Event('input', {
                bubbles: true
            }));
            input.dispatchEvent(new Event('change', {
                bubbles: true
            }));

            // Blur the element to complete the "interaction"
            input.blur();
            return true;
        }
        log(`Error: Could not find UI element with selector: ${selector}`, 'error');
        return false;
    }


    function getStakeBetAmount() {
        const amountInput = document.querySelector(CONFIG.amountInput);
        if (amountInput) {
            const amount = parseFloat(amountInput.value);
            return isNaN(amount) ? 0 : amount;
        }
        return 0;
    }

    function updateStatus(text) {
        const el = document.getElementById('bot-status-indicator');
        if (el) el.textContent = `- ${text}`;
    }

    function updateProfitDisplay() {
        const el = document.getElementById('profit-loss-display');
        if (!el) return;

        const profit = state.totalProfit;
        el.textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(8)}`;
        el.classList.remove('profit', 'loss');
        if (profit > 0) {
            el.classList.add('profit');
        } else if (profit < 0) {
            el.classList.add('loss');
        }
    }

    function resetState() {
        state.betCount = 0;
        state.totalProfit = 0;
        state.winStreak = 0;
        state.lossStreak = 0;
        state.lastBetWasWin = null;
        state.strategyFlags = {};
        state.persistentTriggerStates = {};
        state.lastWinTimestamp = Date.now();
        state.outcomeHistory = '';
        state.apiBlockStartTime = 0;
        state.stackingDelay = 0;
        updateProfitDisplay();
        log("State reset for new session.", "system");
    }

    function updateStateFromResult(result) {
        state.betCount++;
        state.totalProfit += result.profit;
        state.lastBetWasWin = result.win;
        if (result.win) {
            state.winStreak++;
            state.lossStreak = 0;
            state.lastWinTimestamp = Date.now();
            state.outcomeHistory += 'W';
        } else {
            state.lossStreak++;
            state.winStreak = 0;
            state.outcomeHistory += 'L';
        }
        if (state.outcomeHistory.length > 20) { // Keep history from growing too large
            state.outcomeHistory = state.outcomeHistory.slice(-20);
        }
        updateProfitDisplay();
    }

    function updateInputDisabledState() {
        const isRunning = state.running;
        document.querySelectorAll('#dice-bot-window .bot-input, #dice-bot-window .bot-btn, #dice-bot-window .config-pick-btn, #dice-bot-window select').forEach(el => {
            if (el.id === 'start-stop-btn') {
                el.disabled = false;
            } else {
                el.disabled = isRunning;
            }
        });
    }

    function updateSettings() {
        state.baseBet = parseFloat(document.getElementById('base-bet').value) || 0.01;
        state.currentBet = state.baseBet;
        state.onWinAction = document.getElementById('on-win-action').value;
        state.onWinIncrease = parseFloat(document.getElementById('on-win-increase').value) || 0;
        state.onLossAction = document.getElementById('on-loss-action').value;
        state.onLossIncrease = parseFloat(document.getElementById('on-loss-increase').value) || 100;

        const minDelay = document.getElementById('config-betDelay-min').value.trim();
        const maxDelay = document.getElementById('config-betDelay-max').value.trim();
        if (minDelay && maxDelay) {
            CONFIG.betDelay = `${minDelay}-${maxDelay}`;
        } else if (minDelay) {
            CONFIG.betDelay = minDelay;
        } else {
            CONFIG.betDelay = '100';
        }

        CONFIG.maxBetAmount = parseFloat(document.getElementById('config-maxBetAmount').value) || 0;
    }

    async function startBot() {
        updateSettings();
        resetState();

        while (state.running) {
            const autoStrategyName = document.getElementById('auto-strategy-select').value;
            const useAdvancedStrategy = autoStrategyName !== 'none' && advancedStrategies[autoStrategyName];

            if (useAdvancedStrategy) {
                if (state.betCount === 0) log(`Starting auto mode with advanced strategy: '${autoStrategyName}'`, "auto");
            } else {
                if (state.betCount === 0) log(`Starting auto mode with On Win/Loss % logic.`, "auto");
            }

            if (CONFIG.maxBetAmount > 0 && state.currentBet > CONFIG.maxBetAmount) {
                log(`SAFETY STOP: Bet amount (${state.currentBet.toFixed(8)}) exceeded max bet (${CONFIG.maxBetAmount}).`, 'error');
                toggleBot();
                break;
            }

            setBetAmount(state.currentBet);
            const result = await placeBetAndGetResult('auto');
            if (result === null) {
                if (state.running) toggleBot();
                break;
            }
            updateStateFromResult(result);

            const currentStrategyName = document.getElementById('auto-strategy-select').value;
            const currentUseAdvanced = currentStrategyName !== 'none' && advancedStrategies[currentStrategyName];

            if (currentUseAdvanced) {
                await executeAdvancedStrategy(advancedStrategies[currentStrategyName], state, state.baseBet);
            } else {
                updateNextBet(result.win);
            }

            await sleep(getBetDelay());
        }
    }

    function setBetAmount(amount) {
        setUIValue(CONFIG.amountInput, amount.toFixed(8));
    }

    function placeBetAndGetResult(betType = 'manual') {
        const amountForProfit = betType === 'auto' ? state.currentBet : semiAutoState.currentBet;
        const winChanceInput = document.querySelector(CONFIG.winChanceInput);
        const winChance = winChanceInput ? parseFloat(winChanceInput.value) : 49.5;

        return new Promise(resolve => {
            const betButton = document.querySelector(CONFIG.betButton);
            if (!betButton || betButton.disabled) {
                updateStatus("ERROR: Bet button not found or disabled!");
                resolve(null);
                return;
            }
            const pastBetsContainer = document.querySelector(CONFIG.pastBetsContainer);
            if (!pastBetsContainer) {
                updateStatus("ERROR: Past bets list not found!");
                resolve(null);
                return;
            }

            const findLastBetElement = () => {
                // preferred selector (data-last-bet-index="0"), fallback to first/last child with data-past-bet-id
                let el = pastBetsContainer.querySelector('[data-last-bet-index="0"]');
                if (!el) {
                    const candidates = Array.from(pastBetsContainer.querySelectorAll('[data-past-bet-id]'));
                    if (candidates.length) {
                        // try the highest index or last element
                        el = candidates.sort((a,b) => {
                            const ai = parseInt(a.getAttribute('data-last-bet-index') || "-1", 10);
                            const bi = parseInt(b.getAttribute('data-last-bet-index') || "-1", 10);
                            return bi - ai;
                        })[0] || candidates[0];
                    } else {
                        el = pastBetsContainer.firstElementChild || pastBetsContainer.lastElementChild;
                    }
                }
                return el;
            };

            const lastBetElement = findLastBetElement();
            const lastBetId = lastBetElement?.getAttribute('data-past-bet-id') || null;

            // Click
            simulateClick(betButton);

            let attempts = 0;
            const pollInterval = setInterval(() => {
                const newBetElement = findLastBetElement();
                const newBetId = newBetElement?.getAttribute('data-past-bet-id') || null;

                // robust win detection
                const isWinElement = (el) => {
                    if (!el) return false;
                    const classList = Array.from(el.classList || []);
                    const knownWinClasses = ['variant-positive', 'variant-success', 'variant-win', 'button-win'];
                    for (const wc of knownWinClasses) {
                        if (classList.includes(wc)) return true;
                    }
                    // fallback: look for data attributes or text hints
                    const txt = (el.textContent || '').toLowerCase();
                    if (txt.includes('won') || txt.includes('win')) return true;
                    for (const attr of ['data-result','data-outcome','data-win']) {
                        const v = el.getAttribute && el.getAttribute(attr);
                        if (v === 'win' || v === 'true') return true;
                    }
                    return false;
                };

                if (newBetElement && newBetId && newBetId !== lastBetId) {
                    clearInterval(pollInterval);
                    const isWin = isWinElement(newBetElement);
                    const multiplier = 99 / winChance;
                    const netProfit = isWin ? amountForProfit * (multiplier - 1) : -amountForProfit;
                    log(`Bet #${state.betCount + 1}: ${isWin ? 'WIN' : 'LOSS'}. Profit: ${netProfit.toFixed(8)}`, betType);
                    resolve({
                        win: isWin,
                        profit: netProfit
                    });
                    return;
                }

                if (++attempts >= 75) {
                    clearInterval(pollInterval);
                    updateStatus("ERROR: Bet result timed out!");
                    log("Bet result timed out.", "error");
                    // optional debug info in console to help future selector fixes
                    console.warn('placeBetAndGetResult: timeout', {
                        lastBetId,
                        lastOuter: lastBetElement?.outerHTML?.slice(0,500),
                        currentOuter: newBetElement?.outerHTML?.slice(0,500)
                    });
                    resolve(null);
                }
            }, 200);
        });
    }

    function updateNextBet(isWin) {
        if (isWin) {
            state.currentBet = state.onWinAction === 'reset' ? state.baseBet : state.currentBet * (1 + state.onWinIncrease / 100);
        } else {
            state.currentBet = state.onLossAction === 'reset' ? state.baseBet : state.currentBet * (1 + state.onLossIncrease / 100);
        }
        state.currentBet = Math.max(0.00000001, state.currentBet);
    }

    async function runSemiAutoStep() {
        const stepButton = document.getElementById('semi-auto-step-btn');
        stepButton.disabled = true;

        updateStatus('Manual Step...');
        if (!semiAutoState.isStarted) {
            semiAutoState.isStarted = true;
            resetState();
            const stakeAmount = getStakeBetAmount();
            const botBaseAmountInput = document.getElementById('semi-auto-base-bet');
            let startingBet = parseFloat(botBaseAmountInput.value) || 0.01;

            if (stakeAmount > 0) {
                startingBet = stakeAmount;
                botBaseAmountInput.value = startingBet.toFixed(8);
                log(`Starting manual session with bet amount from Stake UI: ${startingBet.toFixed(8)}`, "manual");
            }
            semiAutoState.currentBet = startingBet;
        }

        setBetAmount(semiAutoState.currentBet);
        const result = await placeBetAndGetResult('manual');
        if (result === null) {
            updateStatus("Error: Couldn't get result.");
            stepButton.disabled = false;
            return;
        }
        updateStateFromResult(result);

        const strategyName = document.getElementById('semi-auto-strategy').value;
        if (strategyName !== 'none' && advancedStrategies[strategyName]) {
            const baseBet = parseFloat(document.getElementById('semi-auto-base-bet').value) || 0.01;
            await executeAdvancedStrategy(advancedStrategies[strategyName], semiAutoState, baseBet);
        }

        setBetAmount(semiAutoState.currentBet);
        updateStatus('Ready for next step.');
        stepButton.disabled = false;
    }

    async function handleManualSeedChange() {
        const btn = document.getElementById('manual-change-seed-btn');
        btn.disabled = true;
        btn.textContent = "Changing...";
        await changeSeedProgrammatically();
        btn.textContent = "Change Seed (API)";
        btn.disabled = false;
    }

    function resetSemiAutoProgression() {
        semiAutoState.isStarted = false;
        const baseBet = parseFloat(document.getElementById('semi-auto-base-bet').value) || 0.01;
        semiAutoState.currentBet = baseBet;
        setBetAmount(baseBet);
        updateStatus('Progression Reset.');
        log("Manual progression reset to base bet.", "manual");
    }

    function saveStrategies() {
        localStorage.setItem('stakeDiceBotStrategies', JSON.stringify(advancedStrategies));
        populateStrategyDropdowns();
    }

    function loadStrategies() {
        const saved = localStorage.getItem('stakeDiceBotStrategies');
        if (saved) {
            try {
                advancedStrategies = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load strategies:", e);
                advancedStrategies = {};
            }
        }
    }

    function populateStrategyDropdowns() {
        const semiAutoSelect = document.getElementById('semi-auto-strategy');
        const advancedList = document.getElementById('advanced-strategy-list');
        const autoSelect = document.getElementById('auto-strategy-select');

        const selectedSemiAuto = semiAutoSelect.value;
        const selectedAdvanced = advancedList.value;
        const selectedAuto = autoSelect.value;

        advancedList.innerHTML = '';
        while (semiAutoSelect.options.length > 1) semiAutoSelect.remove(1);
        while (autoSelect.options.length > 1) autoSelect.remove(1);

        for (const name in advancedStrategies) {
            advancedList.add(new Option(name, name));
            semiAutoSelect.add(new Option(name, name));
            autoSelect.add(new Option(name, name));
        }

        // Fixed precedence — ensure we only restore if the previous value still exists
        semiAutoSelect.value = (selectedSemiAuto === 'none' || advancedStrategies[selectedSemiAuto]) ? selectedSemiAuto : 'none';
        advancedList.value = advancedStrategies[selectedAdvanced] ? selectedAdvanced : '';
        autoSelect.value = (selectedAuto === 'none' || advancedStrategies[selectedAuto]) ? selectedAuto : 'none';
    }

    function updateSemiAutoDescription() {
        const select = document.getElementById('semi-auto-strategy');
        const desc = document.getElementById('semi-auto-desc');
        const strategyName = select.value;

        if (strategyName === 'none') {
            desc.innerHTML = `<b>Manual Betting:</b> Bet amount is not changed automatically. Use Reset (R) to return to base amount.`;
        } else if (advancedStrategies[strategyName]) {
            desc.textContent = `Using advanced strategy: ${strategyName}`;
        }
    }

    function applyLogFilters() {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;
        logContainer.querySelectorAll('p').forEach(entry => {
            const type = entry.dataset.logType;
            if (logFilters[type]) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    }

    function log(message, type = 'system') {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;

        const entry = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `[${timestamp}] ${message}`;
        entry.dataset.logType = type;

        switch (type) {
            case 'manual':
                entry.className = 'log-manual';
                break;
            case 'auto':
                entry.className = 'log-auto';
                break;
            case 'strategy':
                entry.className = 'log-strategy';
                break;
            default:
                break;
        }

        if (!logFilters[type]) {
            entry.style.display = 'none';
        }

        logContainer.appendChild(entry);
        logEntries.push(`[${timestamp}] ${message.replace(/<[^>]*>/g, '')}`);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function saveLogToFile() {
        const blob = new Blob([logEntries.join('\n')], {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stake_dice_bot_log_${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        log("Log saved to file.", "system");
    }

    function exportSelectedStrategy() {
        const selectedName = document.getElementById('advanced-strategy-list').value;
        if (!selectedName || !advancedStrategies[selectedName]) {
            showNotification("Please select a valid strategy to export.", "error");
            return;
        }

        const strategyData = {
            name: selectedName,
            rules: advancedStrategies[selectedName]
        };

        const blob = new Blob([JSON.stringify(strategyData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedName}.strategy.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        log(`Strategy '${selectedName}' exported.`, "system");
    }

    function importStrategy() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.strategy';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = readerEvent => {
                try {
                    const content = readerEvent.target.result;
                    const strategyData = JSON.parse(content);

                    if (!strategyData.name || !Array.isArray(strategyData.rules)) {
                        throw new Error("Invalid strategy file format.");
                    }

                    if (advancedStrategies[strategyData.name]) {
                        if (!confirm(`A strategy named "${strategyData.name}" already exists. Overwrite it?`)) {
                            return;
                        }
                    }

                    advancedStrategies[strategyData.name] = strategyData.rules;
                    saveStrategies();
                    showNotification(`Strategy "${strategyData.name}" imported successfully!`);
                    log(`Strategy '${strategyData.name}' imported.`, "system");
                } catch (err) {
                    showNotification(`Failed to import strategy: ${err.message}`, "error");
                    console.error("Import error:", err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function makeDraggable(element, handle) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        handle.onmousedown = (e) => {
            // Prevent dragging when clicking on a button inside the header
            if (e.target.closest('.window-btn')) return;
            e.preventDefault();

            // FIX: Prevent stretching when dragging right-aligned elements
            const rect = element.getBoundingClientRect();
            // Unpin from the right and pin to the left at its current position
            // This ensures that subsequent updates to 'left' will move the element instead of stretching it.
            element.style.right = 'auto';
            element.style.left = rect.left + 'px';

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                let newTop = element.offsetTop - pos2;
                let newLeft = element.offsetLeft - pos1;

                const elemRect = element.getBoundingClientRect();
                const parentRect = document.body.getBoundingClientRect();

                if (newTop < 0) newTop = 0;
                if (newLeft < 0) newLeft = 0;
                if (newTop + elemRect.height > parentRect.height) newTop = parentRect.height - elemRect.height;
                if (newLeft + elemRect.width > parentRect.width) newLeft = parentRect.width - elemRect.width;

                element.style.top = newTop + "px";
                element.style.left = newLeft + "px";
            };
        };
    }

    function makeResizable(element) {
        const resizers = element.querySelectorAll('.resizer');
        const minimum_size = {
            width: parseFloat(getComputedStyle(element, null).getPropertyValue('min-width')),
            height: parseFloat(getComputedStyle(element, null).getPropertyValue('min-height'))
        };
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;

        resizers.forEach(currentResizer => {
            currentResizer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;

                const mouseMoveHandler = (e) => {
                    const dx = e.pageX - original_mouse_x;
                    const dy = e.pageY - original_mouse_y;

                    if (currentResizer.classList.contains('resizer-b') || currentResizer.classList.contains('resizer-br') || currentResizer.classList.contains('resizer-bl')) {
                        const height = original_height + dy;
                        if (height > minimum_size.height) {
                            element.style.height = height + 'px';
                        }
                    }
                    if (currentResizer.classList.contains('resizer-t') || currentResizer.classList.contains('resizer-tr') || currentResizer.classList.contains('resizer-tl')) {
                        const height = original_height - dy;
                        if (height > minimum_size.height) {
                            element.style.height = height + 'px';
                            element.style.top = original_y + dy + 'px';
                        }
                    }
                    if (currentResizer.classList.contains('resizer-r') || currentResizer.classList.contains('resizer-br') || currentResizer.classList.contains('resizer-tr')) {
                        const width = original_width + dx;
                        if (width > minimum_size.width) {
                            element.style.width = width + 'px';
                        }
                    }
                    if (currentResizer.classList.contains('resizer-l') || currentResizer.classList.contains('resizer-bl') || currentResizer.classList.contains('resizer-tl')) {
                        const width = original_width - dx;
                        if (width > minimum_size.width) {
                            element.style.width = width + 'px';
                            element.style.left = original_x + dx + 'px';
                        }
                    }
                };

                const mouseUpHandler = () => {
                    window.removeEventListener('mousemove', mouseMoveHandler);
                    window.removeEventListener('mouseup', mouseUpHandler);
                };

                window.addEventListener('mousemove', mouseMoveHandler);
                window.addEventListener('mouseup', mouseUpHandler);
            });
        });
    }

    async function promptForSeedChange(conditionText) {
        await changeSeedProgrammatically();
    }

    function handleKeydown(e) {

        const tag = document.activeElement.tagName;
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag) || isPickingElement || document.getElementById('password-prompt-modal').style.display === 'flex') return;

        switch (e.key.toLowerCase()) {
            case 's':
                document.getElementById('start-stop-btn').click();
                break;
            case 'd':
                document.getElementById('semi-auto-step-btn').click();
                break;
            case 'r':
                document.getElementById('semi-auto-reset-btn').click();
                break;
        }
    }

    function applyUiScale(scaleValue = CONFIG.uiScale) {
        const windowEl = document.getElementById('dice-bot-window');
        const minimizedEl = document.getElementById('dice-bot-minimized-bar');
        const scale = scaleValue / 100;
        if (windowEl) {
            windowEl.style.zoom = scale;
        }
        if (minimizedEl) {
            minimizedEl.style.zoom = scale;
        }
    }

    function updateBetDelayConfigUI() {
        const minInput = document.getElementById('config-betDelay-min');
        const maxInput = document.getElementById('config-betDelay-max');
        if (!minInput || !maxInput) return;

        const parts = String(CONFIG.betDelay).split('-').map(p => p.trim());
        minInput.value = parts[0] || '';
        maxInput.value = parts.length > 1 ? parts[1] || '' : '';
    }

    // --- ROBUST INITIALIZATION ---
    function waitForGameAndEnable() {
        const interval = setInterval(() => {
            const betButton = document.querySelector(CONFIG.betButton);
            if (betButton) {
                clearInterval(interval);
                updateInputDisabledState();
                updateStatus("Ready");
                log("Game interface found. Bot is active.", "system");
            }
        }, 1000);

        updateInputDisabledState();
    }

    window.addEventListener('load', () => {
        setTimeout(init, 2000);
    });

})();