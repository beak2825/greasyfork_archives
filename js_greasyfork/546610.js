// ==UserScript==
// @name         Stake Mines Bot
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Advanced bot for the Stake Mines game with customizable, savable strategies including static, random, and hybrid tile selection.
// @author       shdw_lol & Gemini
// @license      MIT
// @match        *://stake.com/casino/games/mines*
// @match        *://stake.us/casino/games/mines*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546610/Stake%20Mines%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/546610/Stake%20Mines%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION & STATE ---

    const SELECTORS = {
        betButton: '[data-testid="bet-button"]',
        cashoutButton: '[data-testid="cashout-button"]',
        amountInput: '[data-testid="input-game-amount"]',
        minesCountInput: '[data-testid="mines-count"]',
        profitDisplay: '[data-testid="profit-input"]',
        gameGrid: '[data-testid="game-mines"]',
        allGameTiles: '[data-testid="game-mines"] > button',
        activeTiles: '[data-testid="mines-tile"]:not([disabled])',
        revealedMine: '.mine.revealed',
    };

    const state = {
        running: false,
        pausedForManual: false,
        baseBet: 0.01,
        currentBet: 0.01,
        betCount: 0,
        totalProfit: 0,
        winStreak: 0,
        lossStreak: 0,
        lastBetWasWin: null,
        tileHighlight: null,
    };

    let activeStrategy = {};
    let savedStrategies = {};
    let logEntries = [];
    let manualLossObserver = null;

    // --- UI (HTML & CSS) ---

    const botHtml = `
        <div id="mines-bot-window" class="bot-window">
            <div id="bot-header" class="bot-header">
                <span>Stake Mines Bot <span id="bot-status-indicator"></span> <span id="profit-loss-display"></span></span>
                <div class="window-controls">
                     <button id="minimize-btn" class="window-btn" title="Minimize">—</button>
                    <button id="close-btn" class="window-btn" title="Close">×</button>
                </div>
            </div>
            <div id="bot-main-content" class="bot-content">
                <div class="bot-tabs">
                    <button class="bot-tab-btn active" data-tab="main">Auto</button>
                    <button class="bot-tab-btn" data-tab="strategy">Strategy</button>
                    <button class="bot-tab-btn" data-tab="log">Log</button>
                </div>

                <!-- Main Auto Tab -->
                <div id="tab-main" class="bot-tab-content active">
                    <div class="bot-input-group"><label>Base Bet Amount</label><input type="number" id="base-bet" class="bot-input" value="0.01" step="0.01"></div>
                    <div class="bot-input-group">
                        <label>Strategy</label>
                        <select id="auto-strategy-select" class="bot-input"></select>
                    </div>
                    <div id="no-strategy-container">
                         <div class="bot-input-group">
                            <label>Number of Random Tiles to Pick</label>
                            <input type="number" id="simple-random-count" class="bot-input" value="3" min="1" max="24">
                        </div>
                    </div>
                    <hr>
                    <div class="bot-input-group on-action"><label>On Win</label><select id="on-win-action" class="bot-input"><option value="reset">Reset to Base</option><option value="increase">Increase by %</option></select><input type="number" id="on-win-increase" class="bot-input" value="0" min="0"></div>
                    <div class="bot-input-group on-action"><label>On Loss</label><select id="on-loss-action" class="bot-input"><option value="increase">Increase by %</option><option value="reset">Reset to Base</option></select><input type="number" id="on-loss-increase" class="bot-input" value="100" min="0"></div>
                    <hr>
                    <div class="bot-input-group"><label>Stop on Profit > </label><input type="number" id="stop-profit" class="bot-input" value="0" placeholder="0 = off"></div>
                    <div class="bot-input-group"><label>Stop on Loss < </label><input type="number" id="stop-loss" class="bot-input" value="0" placeholder="0 = off"></div>
                    <button id="start-stop-btn" class="bot-btn bot-btn-primary">Start Auto</button>
                    <button id="cashout-now-btn" class="bot-btn bot-btn-secondary" style="display: none;">Cashout Now & Continue</button>
                </div>

                <!-- Strategy Tab -->
                <div id="tab-strategy" class="bot-tab-content">
                    <div class="bot-input-group">
                        <label>Your Saved Strategies</label>
                        <select id="strategy-list" class="bot-input"></select>
                    </div>
                    <div class="btn-grid">
                        <button id="create-strategy-btn" class="bot-btn bot-btn-secondary">Create New Strategy</button>
                        <button id="edit-strategy-btn" class="bot-btn bot-btn-secondary">Edit Selected</button>
                    </div>
                    <button id="delete-strategy-btn" class="bot-btn bot-btn-danger">Delete Selected</button>
                    <hr>
                    <div id="strategy-editor-container" style="display: none;">
                        <div class="bot-input-group"><label>Strategy Name</label><input type="text" id="strategy-name" class="bot-input" placeholder="My Awesome Strategy"></div>
                        <div class="bot-input-group">
                            <label>Tile Selection Mode</label>
                            <select id="tile-mode" class="bot-input">
                                <option value="static">Static</option>
                                <option value="random">Random</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div id="static-picker-container">
                            <label>Static Tiles (Hover to preview)</label>
                            <div id="tile-picker-grid"></div>
                        </div>
                        <div id="random-picker-container" class="bot-input-group" style="display:none;">
                            <label>Number of Random Tiles to Pick</label>
                            <input type="number" id="random-tile-count" class="bot-input" value="3" min="1" max="24">
                        </div>
                        <div class="bot-input-group" id="gem-target-container">
                            <label>Total Tiles to Pick</label>
                            <input type="number" id="gem-target" class="bot-input" value="5" min="1" max="24">
                        </div>
                        <div class="bot-input-group">
                            <label>After Picking Tiles...</label>
                            <select id="after-reveal-action" class="bot-input">
                                <option value="cashout">Auto-Cashout</option>
                                <option value="manual">Pause for Manual</option>
                            </select>
                        </div>
                         <div class="bot-input-group">
                            <label>Delay Between Clicks (ms)</label>
                            <input type="number" id="click-delay" class="bot-input" value="200" min="50">
                        </div>
                        <button id="save-strategy-btn" class="bot-btn bot-btn-primary">Save Strategy</button>
                        <button id="cancel-edit-btn" class="bot-btn bot-btn-secondary">Cancel</button>
                    </div>
                </div>

                <!-- Log Tab -->
                <div id="tab-log" class="bot-tab-content">
                    <div id="log-container"></div>
                    <div class="btn-grid">
                         <button id="reset-stats-btn" class="bot-btn bot-btn-danger">Reset Stats</button>
                         <button id="save-log-btn" class="bot-btn bot-btn-secondary">Save Log</button>
                    </div>
                </div>
            </div>
            <div id="mines-bot-minimized-bar" style="display: none;">
                <span>Mines Bot</span>
                <button id="maximize-btn" class="window-btn" title="Maximize">□</button>
            </div>
        </div>
        <div id="tile-highlight-overlay"></div>
    `;

    const botCss = `
        :root { --bg-primary: #0F212E; --bg-secondary: #213743; --accent-green: #00b373; --accent-red: #e53e3e; --accent-yellow: #FFC107; --accent-blue: #3498db; }
        .bot-window { position: fixed; top: 100px; right: 20px; width: 400px; background-color: var(--bg-primary); border-radius: 8px; z-index: 9999; color: #fff; font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; max-height: 85vh; }
        .bot-header { padding: 10px 15px; cursor: move; background-color: var(--bg-secondary); font-weight: 600; user-select: none; display: flex; justify-content: space-between; align-items: center; }
        #bot-status-indicator { font-weight: normal; font-size: 12px; opacity: 0.8; margin-left: 8px; }
        #profit-loss-display { font-weight: 600; font-size: 12px; margin-left: 10px; }
        #profit-loss-display.profit { color: var(--accent-green); }
        #profit-loss-display.loss { color: var(--accent-red); }
        .window-controls { display: flex; gap: 8px; }
        .window-btn { background: none; border: none; color: #b1bad3; font-size: 20px; cursor: pointer; line-height: 1; padding: 0 5px; }
        .bot-content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; min-height: 0; }
        .bot-tabs { display: flex; margin-bottom: 15px; background-color: var(--bg-primary); border-radius: 20px; padding: 4px; border: 1px solid var(--bg-secondary); }
        .bot-tab-btn { flex: 1; padding: 8px; cursor: pointer; background: transparent; border: none; color: #b1bad3; border-radius: 20px; font-weight: 500; transition: all 0.2s ease-in-out; font-size: 13px; }
        .bot-tab-btn.active { background-color: var(--bg-secondary); color: #fff; }
        .bot-tab-content { display: none; }
        .bot-tab-content.active { display: block; flex: 1; min-height: 0; overflow-y: auto; padding-right: 10px; }
        .bot-input-group { margin-bottom: 12px; display: flex; flex-direction: column; }
        .bot-input-group label { margin-bottom: 5px; font-size: 14px; color: #b1bad3; }
        .bot-input { width: 100%; padding: 8px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; color: #fff; box-sizing: border-box; }
        .bot-input-group.on-action { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; }
        .bot-input-group.on-action label { grid-column: 1 / 2; }
        .bot-btn { width: 100%; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600; margin-top: 10px; }
        .bot-btn:disabled { background-color: #4A5568 !important; cursor: not-allowed; opacity: 0.7; }
        .bot-btn-primary { background-color: var(--accent-green); color: #fff; }
        .bot-btn-danger { background-color: var(--accent-red); color: #fff; }
        .bot-btn-secondary { background-color: var(--bg-secondary); color: #fff; }
        #log-container { height: 350px; overflow-y: auto; padding: 8px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; font-size: 12px; line-height: 1.5; }
        #log-container p { margin: 0 0 5px 0; }
        #log-container p.log-win { color: var(--accent-green); }
        #log-container p.log-loss { color: var(--accent-red); }
        #log-container p.log-info { color: var(--accent-yellow); }
        hr { border: none; border-top: 1px solid var(--bg-secondary); margin: 15px 0; }
        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        #tile-picker-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; padding: 5px; background-color: var(--bg-secondary); border-radius: 4px; }
        .picker-tile { width: 100%; aspect-ratio: 1 / 1; background-color: var(--bg-primary); border: 1px solid #4a5568; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
        .picker-tile.selected { background-color: var(--accent-blue); border-color: #fff; }
        #mines-bot-minimized-bar { position: fixed; top: 100px; right: 20px; background-color: var(--bg-secondary); border-radius: 8px; z-index: 9999; color: #fff; font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; justify-content: space-between; align-items: center; padding: 8px 12px; cursor: move; }
        #tile-highlight-overlay { position: fixed; background-color: rgba(255, 193, 7, 0.5); border: 2px solid var(--accent-yellow); z-index: 9998; pointer-events: none; display: none; border-radius: 4px; transition: all 0.05s linear; }
    `;

    // --- CORE LOGIC ---

    function init() {
        if (document.getElementById('mines-bot-window')) return;

        document.body.insertAdjacentHTML('beforeend', botHtml);
        GM_addStyle(botCss);

        state.tileHighlight = document.getElementById('tile-highlight-overlay');

        createTilePicker();
        loadStrategies();
        populateStrategyDropdowns();
        handleAutoStrategyChange();

        setupEventListeners();
        makeDraggable(document.getElementById('mines-bot-window'), document.getElementById('bot-header'));
        makeDraggable(document.getElementById('mines-bot-minimized-bar'), document.getElementById('mines-bot-minimized-bar'));

        document.getElementById('mines-bot-window').style.display = 'flex';
        log("Mines Bot Initialized.", "info");
    }

    function setupEventListeners() {
        document.getElementById('minimize-btn').addEventListener('click', minimizeBot);
        document.getElementById('maximize-btn').addEventListener('click', maximizeBot);
        document.getElementById('close-btn').addEventListener('click', () => document.getElementById('mines-bot-window').remove());

        document.querySelectorAll('.bot-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                document.querySelectorAll('.bot-tab-btn, .bot-tab-content').forEach(el => el.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(`tab-${tabName}`).classList.add('active');
            });
        });

        document.getElementById('start-stop-btn').addEventListener('click', toggleBot);
        document.getElementById('cashout-now-btn').addEventListener('click', handleManualCashout);

        const autoStrategySelect = document.getElementById('auto-strategy-select');
        const strategyListSelect = document.getElementById('strategy-list');

        autoStrategySelect.addEventListener('change', () => {
            strategyListSelect.value = autoStrategySelect.value;
            handleAutoStrategyChange();
        });
        strategyListSelect.addEventListener('change', () => {
            autoStrategySelect.value = strategyListSelect.value;
            handleAutoStrategyChange();
        });

        document.getElementById('create-strategy-btn').addEventListener('click', () => showStrategyEditor(false));
        document.getElementById('edit-strategy-btn').addEventListener('click', () => showStrategyEditor(true));
        document.getElementById('cancel-edit-btn').addEventListener('click', hideStrategyEditor);
        document.getElementById('tile-mode').addEventListener('change', updateStrategyUI);
        document.getElementById('save-strategy-btn').addEventListener('click', saveStrategy);
        document.getElementById('delete-strategy-btn').addEventListener('click', deleteStrategy);

        document.getElementById('reset-stats-btn').addEventListener('click', resetState);
        document.getElementById('save-log-btn').addEventListener('click', saveLogToFile);
    }

    function toggleBot() {
        if (state.running) {
            stopBot("Stopped by user.");
        } else {
            startBot();
        }
    }

    function startBot() {
        state.running = true;
        const btn = document.getElementById('start-stop-btn');
        btn.textContent = 'Stop Auto';
        btn.classList.remove('bot-btn-primary');
        btn.classList.add('bot-btn-danger');

        updateSettingsFromUI();
        resetState();
        const strategyName = document.getElementById('auto-strategy-select').value;
        if (strategyName === 'none') {
            log(`Bot started with NO STRATEGY. Picking ${document.getElementById('simple-random-count').value} random tiles.`, "info");
        } else {
            log(`Bot started with strategy: "${strategyName}"`, "info");
        }

        runGameRound();
    }

    function stopBot(reason) {
        state.running = false;
        state.pausedForManual = false;
        stopManualLossDetector();
        const btn = document.getElementById('start-stop-btn');
        btn.textContent = 'Start Auto';
        btn.classList.add('bot-btn-primary');
        btn.classList.remove('bot-btn-danger');
        document.getElementById('cashout-now-btn').style.display = 'none';
        updateStatus("Stopped");
        log(reason, "info");
    }

    async function runGameRound() {
        if (!state.running) return;

        if (activeStrategy.stopProfit > 0 && state.totalProfit >= activeStrategy.stopProfit) {
            stopBot(`Take Profit target of ${activeStrategy.stopProfit} reached.`);
            return;
        }
        if (activeStrategy.stopLoss > 0 && state.totalProfit <= -activeStrategy.stopLoss) {
            stopBot(`Stop Loss target of -${activeStrategy.stopLoss} reached.`);
            return;
        }

        updateStatus("Starting round...");
        await setBetAmount(state.currentBet);

        const valueSetCorrectly = await waitForValue(SELECTORS.amountInput, state.currentBet);
        if (!valueSetCorrectly) {
            stopBot("Error: Failed to set bet amount correctly.");
            return;
        }

        const betButton = document.querySelector(SELECTORS.betButton);
        if (!betButton || betButton.disabled) {
            await sleep(1000);
            if (state.running) runGameRound();
            return;
        }
        betButton.click();

        await waitForTrue(() => document.querySelector(SELECTORS.activeTiles), 2000);

        const tilesToClick = determineTilesToClick();
        if (tilesToClick.length === 0) {
            stopBot("Error: Strategy resulted in 0 tiles to click.");
            return;
        }

        updateStatus(`Picking ${tilesToClick.length} tiles...`);
        let gemsFound = 0;
        let roundLost = false;

        for (const tileIndex of tilesToClick) {
            if (!state.running) return;

            const allTiles = document.querySelectorAll(SELECTORS.activeTiles);
            const tile = allTiles[tileIndex];
            if (tile) {
                tile.click();

                if (await checkForMine(500)) {
                    roundLost = true;
                    break;
                }
                gemsFound++;
                await sleep(activeStrategy.clickDelay);
            }
        }

        await sleep(250);

        if (roundLost) {
            handleRoundEnd(false);
        } else {
            const isGameOver = await checkForMine(100);
            const cashoutButton = document.querySelector(SELECTORS.cashoutButton);
            const isGameActive = cashoutButton && !cashoutButton.disabled;

            if (isGameOver || !isGameActive) {
                log("Failsafe triggered: Game ended on last click.", "info");
                handleRoundEnd(false);
            } else if (activeStrategy.afterRevealAction === 'manual') {
                state.pausedForManual = true;
                updateStatus(`Paused. ${gemsFound} gems found. Cashout or continue manually.`);
                log(`Paused for manual action. Profit if cashout: ${getProfitValue()}`, "info");
                document.getElementById('cashout-now-btn').style.display = 'block';
                startManualLossDetector();
            } else {
                updateStatus("Cashing out...");
                cashoutButton.click();
                handleRoundEnd(true);
            }
        }
    }

    async function handleRoundEnd(isWin) {
        state.betCount++;
        const profit = isWin ? getProfitValue(true) : -state.currentBet;
        state.totalProfit += profit;
        state.lastBetWasWin = isWin;

        if (isWin) {
            state.winStreak++;
            state.lossStreak = 0;
            log(`Round #${state.betCount} WIN. Profit: ${profit.toFixed(8)}`, "win");
        } else {
            state.lossStreak++;
            state.winStreak = 0;
            log(`Round #${state.betCount} LOSS. Lost: ${state.currentBet.toFixed(8)}`, "loss");
        }

        updateProfitDisplay();
        updateNextBetAmount(isWin);

        await waitForTrue(() => {
            const btn = document.querySelector(SELECTORS.betButton);
            return btn && !btn.disabled;
        }, 5000);

        if (state.running) {
            setTimeout(runGameRound, 1000);
        }
    }

    function handleManualCashout() {
        stopManualLossDetector();
        document.querySelector(SELECTORS.cashoutButton)?.click();
        state.pausedForManual = false;
        document.getElementById('cashout-now-btn').style.display = 'none';
        updateStatus("Cashed out. Continuing...");
        handleRoundEnd(true);
    }

    // --- STRATEGY & TILE LOGIC ---

    function determineTilesToClick() {
        const strategyName = document.getElementById('auto-strategy-select').value;
        if (strategyName === 'none') {
            const count = parseInt(document.getElementById('simple-random-count').value) || 1;
            return getRandomTiles(count, []);
        }

        const { tileMode, staticTiles, randomTileCount, gemTarget } = activeStrategy;
        const maxGems = 25 - getMinesCount();
        let targetCount = 0;

        if (tileMode === 'hybrid') {
            targetCount = (staticTiles?.length || 0) + (randomTileCount || 0);
        } else {
            targetCount = gemTarget;
        }

        const target = Math.min(targetCount, maxGems);
        let staticPicks = staticTiles || [];
        let finalPicks = [];

        if (tileMode === 'static') {
            finalPicks = staticPicks.slice(0, target);
        } else if (tileMode === 'random') {
            finalPicks = getRandomTiles(target, []);
        } else if (tileMode === 'hybrid') {
            finalPicks = [...staticPicks];
            const randomNeeded = target - finalPicks.length;
            if (randomNeeded > 0) {
                finalPicks.push(...getRandomTiles(randomNeeded, finalPicks));
            }
        }
        return finalPicks;
    }

    function getRandomTiles(count, exclude = []) {
        const available = [];
        for (let i = 0; i < 25; i++) {
            if (!exclude.includes(i)) {
                available.push(i);
            }
        }

        const randomTiles = [];
        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            randomTiles.push(available.splice(randomIndex, 1)[0]);
        }
        return randomTiles;
    }

    function createTilePicker() {
        const grid = document.getElementById('tile-picker-grid');
        for (let i = 0; i < 25; i++) {
            const tile = document.createElement('div');
            tile.className = 'picker-tile';
            tile.dataset.index = i;
            tile.addEventListener('click', () => tile.classList.toggle('selected'));
            tile.addEventListener('mouseover', () => highlightGameTile(i, true));
            tile.addEventListener('mouseout', () => highlightGameTile(i, false));
            grid.appendChild(tile);
        }
    }

    function highlightGameTile(index, show) {
        if (!state.tileHighlight) return;
        if (!show) {
            state.tileHighlight.style.display = 'none';
            return;
        }
        const gameTiles = document.querySelectorAll(SELECTORS.allGameTiles);
        const targetTile = gameTiles[index];
        if (targetTile) {
            const rect = targetTile.getBoundingClientRect();
            Object.assign(state.tileHighlight.style, {
                display: 'block',
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                top: `${rect.top}px`,
                left: `${rect.left}px`,
            });
        }
    }

    function updateStrategyUI() {
        const mode = document.getElementById('tile-mode').value;
        document.getElementById('static-picker-container').style.display = (mode === 'static' || mode === 'hybrid') ? 'block' : 'none';
        document.getElementById('random-picker-container').style.display = (mode === 'random' || mode === 'hybrid') ? 'block' : 'none';
        document.getElementById('gem-target-container').style.display = (mode === 'static' || mode === 'random') ? 'block' : 'none';
        if (mode === 'hybrid') {
            document.querySelector('#gem-target-container label').textContent = 'This mode adds random tiles to your static selection.';
        } else {
            document.querySelector('#gem-target-container label').textContent = 'Total Tiles to Pick';
        }
    }

    // --- DATA & SETTINGS MANAGEMENT ---

    function updateSettingsFromUI() {
        const stratName = document.getElementById('auto-strategy-select').value;
        if (stratName !== 'none') {
            activeStrategy = savedStrategies[stratName];
        } else {
            activeStrategy = {}; // Clear if no strategy is selected
        }
        // Always update these from the main tab
        activeStrategy.baseBet = parseFloat(document.getElementById('base-bet').value);
        activeStrategy.onWinAction = document.getElementById('on-win-action').value;
        activeStrategy.onWinIncrease = parseFloat(document.getElementById('on-win-increase').value);
        activeStrategy.onLossAction = document.getElementById('on-loss-action').value;
        activeStrategy.onLossIncrease = parseFloat(document.getElementById('on-loss-increase').value);
        activeStrategy.stopProfit = parseFloat(document.getElementById('stop-profit').value);
        activeStrategy.stopLoss = parseFloat(document.getElementById('stop-loss').value);

        state.baseBet = activeStrategy.baseBet;
        state.currentBet = activeStrategy.baseBet;
    }

    function loadStrategy(name) {
        const strat = savedStrategies[name];
        if (!strat) return;

        document.getElementById('strategy-name').value = name;
        document.getElementById('tile-mode').value = strat.tileMode;
        document.getElementById('random-tile-count').value = strat.randomTileCount;
        document.getElementById('gem-target').value = strat.gemTarget;
        document.getElementById('after-reveal-action').value = strat.afterRevealAction;
        document.getElementById('click-delay').value = strat.clickDelay;

        document.querySelectorAll('#tile-picker-grid .picker-tile').forEach(tile => {
            tile.classList.toggle('selected', strat.staticTiles.includes(parseInt(tile.dataset.index)));
        });

        updateStrategyUI();
    }

    function saveStrategy() {
        const name = document.getElementById('strategy-name').value.trim();
        if (!name) {
            alert("Please enter a name for the strategy.");
            return;
        }

        savedStrategies[name] = {
            name: name,
            tileMode: document.getElementById('tile-mode').value,
            staticTiles: Array.from(document.querySelectorAll('#tile-picker-grid .picker-tile.selected')).map(t => parseInt(t.dataset.index)),
            randomTileCount: parseInt(document.getElementById('random-tile-count').value),
            gemTarget: parseInt(document.getElementById('gem-target').value),
            afterRevealAction: document.getElementById('after-reveal-action').value,
            clickDelay: parseInt(document.getElementById('click-delay').value),
        };

        localStorage.setItem('stakeMinesBotStrategies', JSON.stringify(savedStrategies));
        populateStrategyDropdowns();
        document.getElementById('strategy-list').value = name;
        document.getElementById('auto-strategy-select').value = name;
        log(`Strategy "${name}" saved.`, "info");
        hideStrategyEditor();
    }

    function deleteStrategy() {
        const name = document.getElementById('strategy-list').value;
        if (name && name !== 'none' && confirm(`Are you sure you want to delete the strategy "${name}"?`)) {
            delete savedStrategies[name];
            localStorage.setItem('stakeMinesBotStrategies', JSON.stringify(savedStrategies));
            populateStrategyDropdowns();
            log(`Strategy "${name}" deleted.`, "info");
        }
    }

    function loadStrategies() {
        const saved = localStorage.getItem('stakeMinesBotStrategies');
        if (saved) {
            savedStrategies = JSON.parse(saved);
        }
    }

    function populateStrategyDropdowns() {
        const autoSelect = document.getElementById('auto-strategy-select');
        const stratSelect = document.getElementById('strategy-list');
        const currentAutoVal = autoSelect.value;
        const currentStratVal = stratSelect.value;

        autoSelect.innerHTML = '<option value="none">No Strategy (Random Pick)</option>';
        stratSelect.innerHTML = '';

        for (const name in savedStrategies) {
            autoSelect.add(new Option(name, name));
            stratSelect.add(new Option(name, name));
        }
        autoSelect.value = savedStrategies[currentAutoVal] ? currentAutoVal : 'none';
        stratSelect.value = savedStrategies[currentStratVal] ? currentStratVal : '';
    }

    function showStrategyEditor(isEditing) {
        if (isEditing) {
            const selectedStrategy = document.getElementById('strategy-list').value;
            if (!selectedStrategy) {
                alert("Please select a strategy to edit.");
                return;
            }
            loadStrategy(selectedStrategy);
        } else {
            // Clear the form for a new strategy
            document.getElementById('strategy-name').value = '';
            document.getElementById('tile-mode').value = 'static';
            document.querySelectorAll('.picker-tile.selected').forEach(t => t.classList.remove('selected'));
            document.getElementById('random-tile-count').value = 3;
            document.getElementById('gem-target').value = 5;
            updateStrategyUI();
        }
        document.getElementById('strategy-editor-container').style.display = 'block';
    }

    function hideStrategyEditor() {
        document.getElementById('strategy-editor-container').style.display = 'none';
    }

    function handleAutoStrategyChange() {
        const strategyName = document.getElementById('auto-strategy-select').value;
        document.getElementById('no-strategy-container').style.display = strategyName === 'none' ? 'block' : 'none';
    }

    // --- HELPER & UTILITY FUNCTIONS ---

    function startManualLossDetector() {
        const gameGrid = document.querySelector(SELECTORS.gameGrid);
        if (!gameGrid) return;

        manualLossObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.target.matches(SELECTORS.revealedMine)) {
                    log("Manual loss detected. Restarting bot...", "info");
                    state.pausedForManual = false;
                    document.getElementById('cashout-now-btn').style.display = 'none';
                    stopManualLossDetector();
                    handleRoundEnd(false);
                    break;
                }
            }
        });

        manualLossObserver.observe(gameGrid, { subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    function stopManualLossDetector() {
        if (manualLossObserver) {
            manualLossObserver.disconnect();
            manualLossObserver = null;
        }
    }

    async function checkForMine(timeout = 500) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (document.querySelector(SELECTORS.revealedMine)) {
                return true;
            }
            await sleep(50);
        }
        return false;
    }

    async function waitForTrue(conditionFn, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (conditionFn()) {
                return true;
            }
            await sleep(50);
        }
        return false;
    }

    async function waitForValue(selector, expectedValue, timeout = 2000) {
        const input = document.querySelector(selector);
        if (!input) return false;

        const startTime = Date.now();
        const targetValue = parseFloat(expectedValue.toFixed(8));

        while (Date.now() - startTime < timeout) {
            const currentValue = parseFloat(input.value);
            if (currentValue === targetValue) {
                return true;
            }
            await sleep(50);
        }
        log(`Timeout waiting for bet amount to update to ${targetValue}. Current value: ${input.value}`, 'error');
        return false;
    }

    function updateNextBetAmount(isWin) {
        if (isWin) {
            state.currentBet = activeStrategy.onWinAction === 'reset' ? state.baseBet : state.currentBet * (1 + activeStrategy.onWinIncrease / 100);
        } else {
            state.currentBet = activeStrategy.onLossAction === 'reset' ? state.baseBet : state.currentBet * (1 + activeStrategy.onLossIncrease / 100);
        }
        state.currentBet = Math.max(0.00000001, state.currentBet);
    }

    function getProfitValue(isWin = false) {
        const el = document.querySelector(SELECTORS.cashoutButton);
        if (!el) return 0;
        const match = el.textContent.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    function getMinesCount() {
        const el = document.querySelector(SELECTORS.minesCountInput);
        return el ? parseInt(el.value) || 3 : 3;
    }

    async function setBetAmount(amount) {
        const input = document.querySelector(SELECTORS.amountInput);
        const gameGrid = document.querySelector(SELECTORS.gameGrid);

        if (input && gameGrid) {
            input.focus();
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, amount.toFixed(8));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(50);
            gameGrid.click();
        }
    }

    function resetState() {
        state.betCount = 0;
        state.totalProfit = 0;
        state.winStreak = 0;
        state.lossStreak = 0;
        updateProfitDisplay();
    }

    function updateProfitDisplay() {
        const el = document.getElementById('profit-loss-display');
        const profit = state.totalProfit;
        el.textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(8)}`;
        el.className = profit > 0 ? 'profit' : (profit < 0 ? 'loss' : '');
    }

    function updateStatus(text) {
        document.getElementById('bot-status-indicator').textContent = `- ${text}`;
    }

    function log(message, type) {
        const container = document.getElementById('log-container');
        const entry = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `[${timestamp}] ${message}`;
        entry.className = `log-${type}`;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
        logEntries.push(`[${timestamp}] ${message}`);
    }

    function saveLogToFile() {
        const blob = new Blob([logEntries.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stake_mines_bot_log_${new Date().toISOString()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function minimizeBot() {
        document.getElementById('bot-main-content').style.display = 'none';
        document.getElementById('mines-bot-minimized-bar').style.display = 'flex';
    }

    function maximizeBot() {
        document.getElementById('bot-main-content').style.display = 'block';
        document.getElementById('mines-bot-minimized-bar').style.display = 'none';
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            };
        };
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- SCRIPT INITIALIZATION ---
    window.addEventListener('load', () => {
        setTimeout(init, 2000);
    });

})();
