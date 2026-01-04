// ==UserScript==
// @name         RR Strategy Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows different strategies for RR.
// @author       Lollipop [2717731]
// @match        *://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/531291/RR%20Strategy%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531291/RR%20Strategy%20Helper.meta.js
// ==/UserScript==

// Adapted from the Sore Foot Club
// https://docs.google.com/document/d/1h20ClPju29mqh79pvRAmTxgc2e7JaIZYavWYxJDB5e0

(function() {
    'use strict';

    // --- Constants ---
    const SCRIPT_PREFIX = 'rrHelper_';
    const STRATEGIES = {
        MG: 'Martingale',
        GMG: 'Grand Martingale',
        WP: 'Weighted Progression'
    };
    const RISK_LEVELS = {
        low: 'Low (12 losses)',
        medium: 'Medium (10 losses)',
        high: 'High (8 losses)'
    };
    const WP_RATIOS = [1, 1.8, 4, 9, 20, 45, 100, 230, 530, 1200, 2750, 6300];
    const BET_INPUT_SELECTOR = '.createWrap___l0pd7 input.input-money.input___j7D9i';
    const MONEY_BUTTON_SELECTOR = '.createWrap___l0pd7 button#moneyInput';
    const MAX_HISTORY = 10;
    const POT_MONEY_SELECTOR = '.money___vFqoi .count___U4X8W'; // Used transiently in result handling

    // --- State Variables ---
    let state = {
        bankroll: 100000000,
        riskLevel: 'medium',
        strategy: 'WP',
        streak: 0, // Renamed from currentStreak, positive for wins, negative for losses
        sessionProfitLoss: 0,
        baseBet: 0,
        nextBet: 0, // currentActualBet removed
        isAffordable: true,
        initialized: false,
        gameHistory: []
    };
    // currentBetInterval removed as updateCurrentBetDisplay is removed
    let observer = null;

    // --- GM Storage Functions ---
    function saveState() {
        GM_setValue(SCRIPT_PREFIX + 'bankroll', state.bankroll);
        GM_setValue(SCRIPT_PREFIX + 'riskLevel', state.riskLevel);
        GM_setValue(SCRIPT_PREFIX + 'strategy', state.strategy);
        GM_setValue(SCRIPT_PREFIX + 'streak', state.streak); // Use new key
        GM_setValue(SCRIPT_PREFIX + 'sessionProfitLoss', state.sessionProfitLoss);
        GM_setValue(SCRIPT_PREFIX + 'gameHistory', JSON.stringify(state.gameHistory));
    }

    function loadState() {
        state.bankroll = GM_getValue(SCRIPT_PREFIX + 'bankroll', 300000000);
        state.riskLevel = GM_getValue(SCRIPT_PREFIX + 'riskLevel', 'medium');
        state.strategy = GM_getValue(SCRIPT_PREFIX + 'strategy', 'WP');
        state.streak = GM_getValue(SCRIPT_PREFIX + 'streak', 0); // Use new key
        state.sessionProfitLoss = GM_getValue(SCRIPT_PREFIX + 'sessionProfitLoss', 0);
        const savedHistory = GM_getValue(SCRIPT_PREFIX + 'gameHistory', '[]');
        try {
            state.gameHistory = JSON.parse(savedHistory) || [];
            if (!Array.isArray(state.gameHistory)) state.gameHistory = [];
            state.gameHistory = state.gameHistory.slice(0, MAX_HISTORY);
        } catch (e) {
            console.error("RR Helper: Error parsing history", e);
            state.gameHistory = [];
        }
        state.initialized = true;
        console.log("RR Helper: State Loaded", state);
    }

    function resetSession() {
        state.streak = 0; // Reset streak
        state.sessionProfitLoss = 0;
        state.gameHistory = [];
        saveState();
        calculateBets(); // Recalculate bets after reset
        updateUI();
        console.log("RR Helper: Session Reset");
    }

    // --- History Function ---
    function addGameToHistory(outcome, betAmount) {
        if (!outcome || !betAmount || betAmount <= 0) return;
        state.gameHistory.unshift({
            outcome: outcome,
            bet: betAmount,
            timestamp: Date.now()
        });
        if (state.gameHistory.length > MAX_HISTORY) {
            state.gameHistory.pop();
        }
        saveState(); // Save state after history update
        updateHistoryUI();
    }

    // --- Calculation Functions ---
    function roundToNearestThousand(amount) {
        if (!isFinite(amount)) return amount;
        return Math.round(amount / 10000) * 10000;
    }

    function parseMoney(moneyString) {
        if (typeof moneyString !== 'string') return 0;
        return parseInt(moneyString.replace(/[^0-9]/g, ''), 10) || 0;
    }

    function formatMoney(amount) {
        if (amount === undefined || amount === null || !isFinite(amount)) return '$?';
        const roundedAmount = roundToNearestThousand(amount);
        return '$' + Math.floor(roundedAmount).toLocaleString();
    }

    function getCumulativeRatioSum(strategy, N_losses) {
        let sum = 0;
        if (N_losses <= 0) return 0;
        if (strategy === 'MG') {
            sum = Math.pow(2, N_losses) - 1;
        } else if (strategy === 'GMG') {
            sum = Math.pow(2, N_losses + 1) - 2 - N_losses;
        } else if (strategy === 'WP') {
            for (let i = 0; i < N_losses && i < WP_RATIOS.length; i++) sum += WP_RATIOS[i];
        }
        return Math.max(0, sum);
    }

    function getBetRatio(strategy, lossStreakIndex) { // Takes the index of the loss streak
        if (lossStreakIndex < 0) return 1; // If not in a loss streak, ratio is 1 (base bet)
        if (strategy === 'MG') {
            return Math.pow(2, lossStreakIndex);
        } else if (strategy === 'GMG') {
            return Math.pow(2, lossStreakIndex + 1) - 1;
        } else if (strategy === 'WP') {
            return (lossStreakIndex >= 0 && lossStreakIndex < WP_RATIOS.length) ? WP_RATIOS[lossStreakIndex] : Infinity;
        }
        return 1;
    }

    function calculateBaseBet() {
        let N_risk = 0;
        if (state.riskLevel === 'low') N_risk = 12;
        else if (state.riskLevel === 'medium') N_risk = 10;
        else if (state.riskLevel === 'high') N_risk = 8;

        if (N_risk <= 0) {
            state.baseBet = Math.max(1000, roundToNearestThousand(Math.floor(state.bankroll * 0.01)));
            calculateNextBetAmount(); // Ensure next bet is calculated even with fallback base bet
            return;
        }

        const cumulativeRatioSumN = getCumulativeRatioSum(state.strategy, N_risk);
        const ratioNplus1 = getBetRatio(state.strategy, N_risk); // Get ratio for the Nth loss

        let calculatedBaseBetRaw = 1;
        if (!isFinite(ratioNplus1)) {
            console.warn(`RR Helper: Strategy ${state.strategy} ratio fallback at N=${N_risk}`);
            const maxAllowedLoss = state.bankroll * 0.5; // Use 50% of bankroll if ratio is infinite
            calculatedBaseBetRaw = (cumulativeRatioSumN > 0) ? Math.max(1, Math.floor(maxAllowedLoss / cumulativeRatioSumN)) : Math.max(1, Math.floor(state.bankroll * 0.01));
        } else {
            const totalRatioRequirement = cumulativeRatioSumN + ratioNplus1;
            calculatedBaseBetRaw = (totalRatioRequirement > 0 && isFinite(totalRatioRequirement)) ? Math.max(1, Math.floor(state.bankroll / totalRatioRequirement)) : 1;
        }

        state.baseBet = roundToNearestThousand(calculatedBaseBetRaw);
        if (state.baseBet < 1000 && calculatedBaseBetRaw >= 1) state.baseBet = 1000; // Ensure minimum bet
        if (state.baseBet === 0 && calculatedBaseBetRaw > 0) state.baseBet = 1000; // Ensure minimum bet

        // console.log(`RR Helper: Base Bet: ${formatMoney(state.baseBet)} (Raw: ${calculatedBaseBetRaw})`);
        calculateNextBetAmount(); // Calculate next bet after base bet is determined
    }

    function calculateNextBetAmount() {
        if (state.baseBet <= 0) {
            state.nextBet = 0;
            state.isAffordable = false;
            return;
        }

        // If streak is positive (win streak) or zero, next bet is base bet.
        // If streak is negative (loss streak), calculate progressive bet.
        const lossStreakIndex = state.streak < 0 ? Math.abs(state.streak) : 0;
        let nextBetRatio = getBetRatio(state.strategy, lossStreakIndex);

        let nextBetRaw = 0;
        if (!isFinite(nextBetRatio)) {
            console.warn(`RR Helper: Max loss streak reached/undefined ratio at index ${lossStreakIndex}.`);
            state.nextBet = Infinity; // Indicate max reached
        } else {
            nextBetRaw = Math.max(1, Math.floor(state.baseBet * nextBetRatio));
            state.nextBet = roundToNearestThousand(nextBetRaw); // Round the calculated bet
            // Ensure minimum bet is met
            if (state.nextBet < 1000 && nextBetRaw >= 1) state.nextBet = 1000;
            if (state.nextBet === 0 && nextBetRaw > 0) state.nextBet = 1000;
        }

        const currentCapital = state.bankroll + state.sessionProfitLoss;
        state.isAffordable = isFinite(state.nextBet) ? state.nextBet <= currentCapital : false;

        // console.log(`RR Helper: Next Bet: ${formatMoney(state.nextBet)} (Raw: ${nextBetRaw}, Streak: ${state.streak}, LossIndex: ${lossStreakIndex}, Affordable: ${state.isAffordable})`);
    }

    function calculateBets() {
        calculateBaseBet(); // This now also triggers calculateNextBetAmount
    }

    // --- UI Functions ---

    function createHelperUI() {
        const existingUI = document.getElementById('rr-helper-container');
        if (existingUI) {
            updateUI();
            return;
        }

        const uiContainer = document.createElement('div');
        uiContainer.id = 'rr-helper-container';
        uiContainer.className = 'torn-calculator-container rr-helper';

        // Revised HTML structure
        uiContainer.innerHTML = `
            <h4>RR Strategy Helper</h4>
            <div class="rr-content-wrapper">
                <div class="rr-main-content">
                    <div class="rr-helper-inputs torn-calculator-inputs">
                        <div> <label for="rrBankroll">Bankroll:</label> <input type="number" id="rrBankroll" step="10000000" value="${state.bankroll}"> </div>
                        <div> <label for="rrRiskLevel">Risk Level:</label> <select id="rrRiskLevel">${Object.entries(RISK_LEVELS).map(([k, v]) => `<option value="${k}" ${state.riskLevel === k ? 'selected' : ''}>${v}</option>`).join('')}</select> </div>
                        <div> <label for="rrStrategy">Strategy:</label> <select id="rrStrategy">${Object.entries(STRATEGIES).map(([k, v]) => `<option value="${k}" ${state.strategy === k ? 'selected' : ''}>${v}</option>`).join('')}</select> </div>
                        <div> <label> </label> <button id="rrResetSession" class="torn-btn alternate rr-action-button">Reset Session</button> </div>
                    </div>

                    <hr class="rr-divider">

                    <div class="rr-helper-status">
                        <p><span class="rr-status-label">Base Bet:</span> <span id="rrBaseBet" class="rr-status-value">${formatMoney(state.baseBet)}</span></p>
                        <p><span class="rr-status-label">Streak:</span> <span id="rrStreak" class="rr-status-value rr-streak-neutral">${state.streak}</span></p> <!-- Changed ID and label -->
                        <p><span class="rr-status-label">Session P/L:</span> <span id="rrSessionPL" class="rr-status-value">${formatMoney(state.sessionProfitLoss)}</span></p>
                        <p><span class="rr-status-label">Current Capital:</span> <span id="rrCurrentCapital" class="rr-status-value">${formatMoney(state.bankroll + state.sessionProfitLoss)}</span></p>
                        <!-- Current Game Bet Removed -->

                        <div class="rr-next-bet-section">
                           <span class="rr-status-label">Next Recommended Bet:</span>
                           <span id="rrNextBet" class="rr-status-value rr-next-bet-value">${formatMoney(state.nextBet)}</span>
                           <button id="rrFillBetButton" class="torn-btn rr-action-button rr-fill-button">Fill</button>
                        </div>
                    </div>
                </div>
                <div class="rr-history-panel">
                    <h5>Recent Games</h5>
                    <ul id="rrGameHistoryList"><li>No games recorded yet.</li></ul>
                </div>
            </div>
        `;
        const reactRoot = document.getElementById('react-root');
        if (reactRoot && reactRoot.parentNode) {
            reactRoot.parentNode.insertBefore(uiContainer, reactRoot.nextSibling);
            addEventListeners(uiContainer);
            updateUI(); // Initial UI update
        } else {
            console.error("RR Helper: Could not find '#react-root' or parent.");
            // Fallback (simplified): Inject somewhere reasonable if react-root fails
            const contentWrap = document.querySelector('#content-wrap') || document.body;
            contentWrap.insertBefore(uiContainer, contentWrap.firstChild);
            addEventListeners(uiContainer);
            updateUI();
        }
    }

    function updateHistoryUI() {
        const historyList = document.getElementById('rrGameHistoryList');
        if (!historyList) return;
        if (state.gameHistory.length === 0) {
            historyList.innerHTML = '<li>No games recorded yet.</li>';
            return;
        }
        historyList.innerHTML = ''; // Clear existing list
        state.gameHistory.forEach(game => {
            const li = document.createElement('li');
            const outcomeClass = game.outcome === 'win' ? 'rr-history-win' : 'rr-history-loss';
            li.className = outcomeClass;
            li.textContent = `${game.outcome.toUpperCase()} - ${formatMoney(game.bet)}`;
            historyList.appendChild(li);
        });
    }

    function addEventListeners(container) {
        // Helper inputs
        container.querySelector('#rrBankroll').addEventListener('change', (e) => {
            state.bankroll = parseInt(e.target.value, 10) || 0;
            calculateBets();
            saveState();
            updateUI();
        });
        container.querySelector('#rrRiskLevel').addEventListener('change', (e) => {
            state.riskLevel = e.target.value;
            calculateBets();
            saveState();
            updateUI();
        });
        container.querySelector('#rrStrategy').addEventListener('change', (e) => {
            state.strategy = e.target.value;
            calculateBets();
            saveState();
            updateUI();
        });
        // Action buttons in helper
        container.querySelector('#rrResetSession').addEventListener('click', resetSession);
        container.querySelector('#rrFillBetButton').addEventListener('click', handleFillButtonClick);

        // Listener for Torn's native $ button
        attachMoneyButtonListener();
    }

    function attachMoneyButtonListener() {
        const findButtonInterval = setInterval(() => {
            const moneyButton = document.querySelector(MONEY_BUTTON_SELECTOR);
            if (moneyButton) {
                clearInterval(findButtonInterval);
                if (!moneyButton.hasAttribute('data-rr-listener')) {
                    console.log("RR Helper: Attaching listener to TORN money button.");
                    moneyButton.addEventListener('click', handleTornMoneyButtonClick);
                    moneyButton.setAttribute('data-rr-listener', 'true');
                }
            }
        }, 500);
        setTimeout(() => clearInterval(findButtonInterval), 10000); // Stop trying after 10 seconds
    }

    // Handler for OUR "Fill" button
    function handleFillButtonClick(event) {
        console.log("RR Helper: Fill button clicked.");
        updateBetInput(true); // Pass true for manual trigger
    }

    // Handler for TORN's "$" button
    function handleTornMoneyButtonClick(event) {
        console.log("RR Helper: TORN Money button clicked.");
        updateBetInput(true); // Also trigger fill on TORN button click
    }

    function dispatchEvent(element, eventType) {
        try {
            const event = new Event(eventType, {
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        } catch (e) {
            console.error(`RR Helper: Error dispatching ${eventType} event:`, e);
        }
    }

    function updateBetInput(manualTrigger = false) {
        const moneyInput = document.querySelector(BET_INPUT_SELECTOR);
        if (!moneyInput) {
            if (manualTrigger) console.warn("RR Helper: Bet input field not found when trying to fill manually.");
            return;
        }

        // Determine the bet amount: Use nextBet if affordable, otherwise consider baseBet? Or 0?
        // Let's stick to nextBet if affordable, otherwise maybe empty it or use base bet?
        // Using nextBet makes most sense, as base bet might not be intended.
        // If nextBet is infinite (max streak) or unaffordable, perhaps leave input as is or clear it.
        // For simplicity: Use nextBet if finite and affordable, otherwise use baseBet as a fallback.
        let recommendedBet = (isFinite(state.nextBet) && state.nextBet > 0 && state.isAffordable) ? state.nextBet : state.baseBet;

        // If even base bet is unaffordable (unlikely but possible), or nextBet is infinite, set to 1000 minimum? Or empty? Let's default to baseBet.
        if (!isFinite(state.nextBet) || !state.isAffordable) {
            recommendedBet = state.baseBet; // Fallback to base bet if nextBet is invalid/unaffordable
        }

        const betValueToSet = (isFinite(recommendedBet) && recommendedBet > 0) ? String(recommendedBet) : '1000'; // Default to 1000 if calculation fails

        if (moneyInput.value !== betValueToSet || manualTrigger) {
            if (manualTrigger) console.log(`RR Helper: Manually setting input via native setter: ${betValueToSet}`);
            else console.log(`RR Helper: Auto-setting input via native setter: ${betValueToSet} (was: ${moneyInput.value})`);

            try {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(moneyInput, betValueToSet);
                    // Use requestAnimationFrame to ensure DOM is ready for events
                    requestAnimationFrame(() => {
                        dispatchEvent(moneyInput, 'input');
                        dispatchEvent(moneyInput, 'change');
                    });
                } else {
                    console.error("RR Helper: Could not get native value setter. Falling back.");
                    moneyInput.value = betValueToSet;
                    requestAnimationFrame(() => {
                        dispatchEvent(moneyInput, 'input');
                        dispatchEvent(moneyInput, 'change');
                    });
                }
            } catch (e) {
                console.error("RR Helper: Error using native value setter:", e);
                moneyInput.value = betValueToSet;
                requestAnimationFrame(() => {
                    dispatchEvent(moneyInput, 'input');
                    dispatchEvent(moneyInput, 'change');
                });
            }
        }
    }

    function updateUI() {
        const container = document.getElementById('rr-helper-container');
        if (!container || !state.initialized) return;

        // Update Helper UI (Inputs, Status)
        container.querySelector('#rrBankroll').value = state.bankroll;
        container.querySelector('#rrRiskLevel').value = state.riskLevel;
        container.querySelector('#rrStrategy').value = state.strategy;
        container.querySelector('#rrBaseBet').textContent = formatMoney(state.baseBet);

        // Update Streak display and color
        const streakEl = container.querySelector('#rrStreak');
        streakEl.textContent = state.streak > 0 ? `+${state.streak}` : (state.streak < 0 ? `${state.streak}` : '0');
        streakEl.classList.remove('rr-streak-win', 'rr-streak-loss', 'rr-streak-neutral'); // Clear previous classes
        if (state.streak > 0) streakEl.classList.add('rr-streak-win');
        else if (state.streak < 0) streakEl.classList.add('rr-streak-loss');
        else streakEl.classList.add('rr-streak-neutral');

        // Update Session P/L display and color
        const sessionPLEl = container.querySelector('#rrSessionPL');
        sessionPLEl.textContent = formatMoney(state.sessionProfitLoss);
        sessionPLEl.classList.remove('positive', 'negative');
        if (state.sessionProfitLoss > 0) sessionPLEl.classList.add('positive');
        else if (state.sessionProfitLoss < 0) sessionPLEl.classList.add('negative');

        container.querySelector('#rrCurrentCapital').textContent = formatMoney(state.bankroll + state.sessionProfitLoss);
        // Current Actual Bet display removed

        // Update Next Bet display and color
        const nextBetEl = container.querySelector('#rrNextBet');
        let nextBetText = formatMoney(state.nextBet);
        if (!isFinite(state.nextBet)) {
            nextBetText = "MAX STREAK / UNDEFINED";
            state.isAffordable = false; // Ensure affordability is false if infinite
        }
        nextBetEl.textContent = nextBetText;
        nextBetEl.style.color = state.isAffordable ? '#fff' : 'salmon'; // Set color based on affordability

        updateHistoryUI(); // Update history list

        // Autofill bet input (with slight delay)
        setTimeout(() => updateBetInput(false), 100);
    }

    // --- Current Bet Detection (Removed) ---
    // function updateCurrentBetDisplay() { ... } // Removed

    // --- Win/Loss Detection ---
    function handleGameResult(messageText) {
        // console.log("RR Helper: Processing message:", messageText);
        let outcome = null;
        if (messageText.includes("You take your winnings")) {
            outcome = 'win';
        } else if (messageText.includes("You fall down holding the foot")) {
            outcome = 'loss';
        }

        if (!outcome) {
            // console.log("RR Helper: Message ignored (not win/loss).");
            return; // Ignore messages that are not win/loss confirmations
        }

        // Determine the bet amount of the game that just finished
        let betOfCompletedGame = 0;
        // Try reading the pot money *immediately* after the message appears
        // This is a fallback, ideally the bet was known beforehand (e.g., state.nextBet before the click)
        // but reading the pot *might* still work depending on timing.
        const potMoneyElement = document.querySelector(POT_MONEY_SELECTOR);
        if (potMoneyElement) {
            const potMoney = parseMoney(potMoneyElement.textContent);
            if (potMoney > 0) {
                betOfCompletedGame = potMoney / 2;
                console.log(`RR Helper: Used pot read for completed game bet: ${formatMoney(betOfCompletedGame)}`);
            }
        }

        // If pot read failed, try using the 'nextBet' calculated *before* this game
        // This assumes the user bet the recommended amount.
        if (betOfCompletedGame <= 0 && isFinite(state.nextBet) && state.nextBet > 0) {
            // We need the bet *before* recalculation. Let's store it temporarily?
            // Or, assume the bet placed was the one recommended *before* the outcome.
            // This is tricky. Let's recalculate what the bet *should* have been based on the streak *before* this outcome.
            const previousLossStreakIndex = state.streak < 0 ? Math.abs(state.streak) : 0;
            const previousBetRatio = getBetRatio(state.strategy, previousLossStreakIndex);
            if (isFinite(previousBetRatio)) {
                const previousBetRaw = Math.max(1, Math.floor(state.baseBet * previousBetRatio));
                const previousBetRounded = roundToNearestThousand(previousBetRaw);
                betOfCompletedGame = (previousBetRounded < 1000 && previousBetRaw >= 1) ? 1000 : previousBetRounded;
                if (betOfCompletedGame === 0 && previousBetRaw > 0) betOfCompletedGame = 1000; // Min bet check
                console.log(`RR Helper: Used *calculated* previous bet for completed game: ${formatMoney(betOfCompletedGame)}`);
            }
        }


        if (betOfCompletedGame <= 0) {
            console.error(`RR Helper: ${outcome.toUpperCase()} detected, but FAILED to determine bet amount. P/L not updated reliably.`);
            // We can still update the streak, but P/L and history will be wrong.
            // Let's try a last resort: guess 1000? Or skip P/L update? Skip P/L and history.
        } else {
            addGameToHistory(outcome, betOfCompletedGame);
            if (outcome === 'win') {
                console.log("RR Helper: Win processed. Bet:", formatMoney(betOfCompletedGame));
                state.sessionProfitLoss += betOfCompletedGame;
            } else { // loss
                console.log("RR Helper: Loss processed. Bet:", formatMoney(betOfCompletedGame));
                state.sessionProfitLoss -= betOfCompletedGame;
            }
        }

        // Update streak *after* processing P/L based on the previous state
        if (outcome === 'win') {
            if (state.streak <= 0) { // Was losing or neutral, start win streak
                state.streak = 1;
            } else { // Was already winning, increment win streak
                state.streak++;
            }
        } else { // loss
            if (state.streak >= 0) { // Was winning or neutral, start loss streak
                state.streak = -1;
            } else { // Was already losing, increment loss streak (make more negative)
                state.streak--;
            }
        }

        saveState(); // Save the updated state (streak, P/L, history)
        calculateBets(); // Recalculate next bet based on the new streak
        updateUI(); // Update the display with new streak, P/L, next bet, etc.
    }

    // Observer setup remains largely the same, targeting the message area
    const observerCallback = function(mutationsList, obs) {
        for (const mutation of mutationsList) {
            // Check various conditions to catch the message update robustly
            if (
                mutation.target === document.querySelector('.messageWrap___feWba') || // Direct target
                mutation.target.classList?.contains('message___tinv3') || // Message span itself
                (mutation.type === 'characterData' && mutation.target.parentElement?.classList?.contains('message___tinv3')) || // Text change within message span
                (mutation.type === 'childList' && mutation.target.classList?.contains('messageWrap___feWba') && mutation.addedNodes.length > 0) // Nodes added to wrapper
            ) {
                const messageSpan = document.querySelector('.messageWrap___feWba .message___tinv3');
                if (messageSpan) {
                    const text = messageSpan.textContent;
                    // Use a small delay to allow potentially related DOM updates (like pot money) to finish
                    setTimeout(() => handleGameResult(text), 100);
                    return; // Process only the first relevant mutation found
                }
            }
        }
    };

    function observeMessages() {
        if (observer) {
            observer.disconnect(); // Disconnect previous observer if any
        }
        const targetNode = document.querySelector('.messageWrap___feWba');
        if (targetNode) {
            const config = {
                childList: true,
                subtree: true,
                characterData: true
            };
            observer = new MutationObserver(observerCallback);
            observer.observe(targetNode, config);
            // console.log("RR Helper: Observer attached.");
        } else {
            // If target not found, retry after a delay
            // console.log("RR Helper: Message wrap not found, retrying observer attachment...");
            setTimeout(observeMessages, 500);
        }
    }

    // --- Initialization ---

    function initialize() {
        // Inject CSS - Added styles for layout polishing and streak colors
        GM_addStyle(`
            /* Main container */
            .rr-helper { background: #333; color: #f0f0f0; padding: 15px 20px; border-radius: 8px; margin: 15px 10px; border: 1px solid #444; box-shadow: 0 2px 4px rgba(0,0,0,0.5); max-width: calc(100% - 20px); box-sizing: border-box; clear: both; }
            .rr-helper h4 { margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 8px; margin-bottom: 15px; color: #eee; font-size: 1.2em; text-align: center; }

            /* Two column layout */
            .rr-content-wrapper { display: grid; grid-template-columns: minmax(300px, 2fr) 1fr; gap: 25px; }
            @media (max-width: 850px) { .rr-content-wrapper { grid-template-columns: 1fr; } .rr-history-panel { margin-top: 20px; border-top: 1px dashed #555; padding-top: 15px;} }

            /* Left column - Inputs & Status */
            .rr-main-content {}
            .rr-helper-inputs { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px 18px; margin-bottom: 20px; }
            .rr-helper-inputs label { display: block; margin-bottom: 4px; color: #ccc; font-size: 0.9em; }
            .rr-helper-inputs input, .rr-helper-inputs select { width: 100%; padding: 8px 10px; background-color: #2a2a2a; color: #fff; border: 1px solid #555; border-radius: 4px; font-size: 13px; box-sizing: border-box;}
            .rr-helper-inputs label[for="rrResetSession"] { visibility: hidden; }
            .rr-action-button { padding: 8px 12px; font-size: 13px; width: 100%; box-sizing: border-box; margin-top: 1px; }
            .rr-fill-button { margin-left: 10px; width: auto !important; padding: 6px 15px !important; font-size: 0.95em !important; vertical-align: middle; }

            /* Divider */
            .rr-divider { border: none; border-top: 1px dashed #555; margin: 0 0 20px 0; }

            /* Status section */
            .rr-helper-status {}
            .rr-helper-status p { margin: 8px 0; font-size: 1.0em; color: #ddd; display: flex; justify-content: space-between; align-items: center; padding: 3px 0; border-bottom: 1px solid #3a3a3a; }
            .rr-helper-status p:last-child { border-bottom: none; }
            .rr-status-label { color: #aaa; margin-right: 10px; }
            .rr-status-value { color: #fff; font-weight: bold; text-align: right; }
            #rrSessionPL.positive { color: lightgreen; }
            #rrSessionPL.negative { color: salmon; }
            #rrStreak.rr-streak-win { color: lightgreen; } /* Style for winning streak */
            #rrStreak.rr-streak-loss { color: salmon; }    /* Style for losing streak */
            #rrStreak.rr-streak-neutral { color: #fff; } /* Style for neutral streak (0) */


            /* Next bet section */
            .rr-next-bet-section {
                margin-top: 15px; padding: 10px; background-color: #2a2a2a; border-radius: 5px; border: 1px solid #444;
                display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
            }
            .rr-next-bet-section .rr-status-label { font-weight: bold; color: #ccc; font-size: 1.05em; margin-bottom: 5px; }
            .rr-next-bet-value { font-size: 1.2em; font-weight: bold; margin: 0 10px; }

            /* Right column - History */
            .rr-history-panel {}
            .rr-history-panel h5 { margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px; color: #ccc; text-align: center; font-size: 1.1em; }
            #rrGameHistoryList { list-style: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto; font-size: 0.9em; }
            #rrGameHistoryList li { padding: 5px 8px; margin-bottom: 4px; border-radius: 3px; border: 1px solid #444; display: flex; justify-content: space-between; }
            .rr-history-win { background-color: rgba(76, 175, 80, 0.15); border-color: #4CAF50 !important; color: #a5d6a7; }
            .rr-history-loss { background-color: rgba(211, 47, 47, 0.15); border-color: #d32f2f !important; color: #ef9a9a; }
         `);

        loadState();
        calculateBets(); // Initial calculation based on loaded state
        createHelperUI(); // Creates the UI elements
        observeMessages(); // Start observing for win/loss messages

        // Interval to re-attach listener to TORN's money button if it gets recreated (e.g., SPA navigation)
        // No longer need interval for current bet display
        setInterval(() => {
            const moneyButton = document.querySelector(MONEY_BUTTON_SELECTOR);
            if (moneyButton && !moneyButton.hasAttribute('data-rr-listener')) {
                console.log("RR Helper: Re-attaching listener to money button via interval check.");
                moneyButton.addEventListener('click', handleTornMoneyButtonClick); // Ensure correct handler
                moneyButton.setAttribute('data-rr-listener', 'true');
            }
            // Also re-attach observer if needed
            const messageWrap = document.querySelector('.messageWrap___feWba');
            if (messageWrap && (!observer || !observer.takeRecords()?.length)) { // Crude check if observer is attached and active
                // console.log("RR Helper: Re-attaching observer via interval check.");
                // observeMessages(); // Re-attach if seems disconnected
            }

        }, 2000); // Check every 2 seconds

        // Re-initialize observer when tab becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log("RR Helper: Tab became visible, ensuring observer is active.");
                setTimeout(observeMessages, 250); // Re-attach observer with a small delay
            } else {
                if (observer) observer.disconnect(); // Disconnect when tab is hidden to save resources
                console.log("RR Helper: Tab hidden, observer disconnected.");
            }
        });
    }

    // --- Initialization Wait Loop ---
    // Waits for the main Torn page element to load before initializing the script
    const maxInitAttempts = 20;
    let initAttempts = 0;
    const initInterval = setInterval(() => {
        initAttempts++;
        const reactRoot = document.getElementById('react-root');
        // Check if the react root exists and has a parent node (basic check for page load)
        if (reactRoot && reactRoot.parentNode) {
            clearInterval(initInterval); // Stop the interval timer
            initialize(); // Run the main initialization function
        } else if (initAttempts >= maxInitAttempts) {
            clearInterval(initInterval); // Stop trying after max attempts
            console.error("RR Helper: Failed to find '#react-root' and parent after multiple attempts. Script will not initialize.");
        }
    }, 500); // Check every 500ms

})();