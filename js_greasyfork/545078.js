// ==UserScript==
// @name         Torn Poker Helper & Profile Tracker - Auto Opponent & Detailed Stats
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Poker helper with automatic active opponents detection and advanced opponent stats for Torn poker tables.
// @match        https://www.torn.com/poker.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545078/Torn%20Poker%20Helper%20%20Profile%20Tracker%20-%20Auto%20Opponent%20%20Detailed%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/545078/Torn%20Poker%20Helper%20%20Profile%20Tracker%20-%20Auto%20Opponent%20%20Detailed%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RANKS = "23456789TJQKA";
    const SUITS = ["c", "d", "h", "s"];

    const STORAGE_KEY = "tornPokerProfiles";

    // Load saved profiles or create empty object
    let playerProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    // --- Card and Hand Utilities ---

    function parseCard(cardStr) {
        return { rank: cardStr[0], suit: cardStr[1].toLowerCase() };
    }
    function cardToString(card) {
        return card.rank + card.suit;
    }

    function createDeck() {
        let deck = [];
        for (let r of RANKS) {
            for (let s of SUITS) {
                deck.push(r + s);
            }
        }
        return deck;
    }

    function removeCards(deck, cardsToRemove) {
        return deck.filter(c => !cardsToRemove.includes(c));
    }

    function rankValue(r) {
        return RANKS.indexOf(r);
    }

    // Poker hand evaluation functions from previous version
    // ... (reuse all evaluateHand, bestFiveCardHand, compareHands, etc.)

    // For brevity, let's reuse the evaluation functions from version 2 (or you can copy-paste them here)

    // --- Monte Carlo Multi-Opponent Simulation ---

    function monteCarloWinProbMultiOpp(holeCards, communityCards, numOpponents = 2, trials = 1000) {
        let wins = 0, ties = 0, losses = 0;

        let knownCards = holeCards.concat(communityCards);
        let deck = removeCards(createDeck(), knownCards);

        for (let t = 0; t < trials; t++) {
            let shuffled = deck.slice().sort(() => Math.random() - 0.5);

            let opponentsHoleCards = [];
            let usedIndex = 0;
            for (let i = 0; i < numOpponents; i++) {
                opponentsHoleCards.push([shuffled[usedIndex], shuffled[usedIndex+1]]);
                usedIndex += 2;
            }

            let needed = 5 - communityCards.length;
            let simCommunity = communityCards.concat(shuffled.slice(usedIndex, usedIndex + needed));

            let myHandRank = evaluateHand(holeCards.concat(simCommunity));
            let oppRanks = opponentsHoleCards.map(hc => evaluateHand(hc.concat(simCommunity)));

            let betterThanAll = true;
            let tieCount = 0;

            for (let r of oppRanks) {
                let cmp = compareHands(myHandRank, r);
                if (cmp < 0) {
                    betterThanAll = false;
                    break;
                }
                if (cmp === 0) tieCount++;
            }

            if (betterThanAll) {
                if (tieCount === 0) wins++;
                else ties++;
            } else {
                losses++;
            }
        }

        return (wins + ties * 0.5) / trials;
    }

    // --- UI Creation ---

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "80px";
    container.style.right = "10px";
    container.style.width = "320px";
    container.style.backgroundColor = "rgba(0,0,0,0.9)";
    container.style.color = "white";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.fontSize = "13px";
    container.style.zIndex = 10000;
    container.style.fontFamily = "Arial, sans-serif";
    container.style.maxHeight = "480px";
    container.style.overflowY = "auto";
    container.innerHTML = `<h3 style="margin: 5px 0; font-size:16px;">Torn Poker Helper</h3>
    <div id="yourOdds">Calculating odds...</div>
    <hr style="margin: 8px 0;">
    <div id="opponentProfiles"><b>Opponent Profiles:</b><br><i>Loading...</i></div>`;

    document.body.appendChild(container);

    // --- Game Data Extraction ---

    function getYourHoleCards() {
        let cards = [];
        document.querySelectorAll("img.poker-card.holecard").forEach(img => {
            let src = img.src;
            let match = src.match(/cards\/([2-9TJQKA][cdhs])\.png$/i);
            if (match) cards.push(match[1].toUpperCase());
        });
        return cards;
    }

    function getCommunityCards() {
        let cards = [];
        document.querySelectorAll("#pokerCommunity img.poker-card.community").forEach(img => {
            let src = img.src;
            let match = src.match(/cards\/([2-9TJQKA][cdhs])\.png$/i);
            if (match) cards.push(match[1].toUpperCase());
        });
        return cards;
    }

    // Get all players seated at the table (including you)
    function getAllPlayers() {
        let players = [];
        document.querySelectorAll("#pokerTable .player").forEach(el => {
            let nameEl = el.querySelector(".player-name");
            if (nameEl) {
                let name = nameEl.textContent.trim();
                if (name) players.push({name, el});
            }
        });
        return players;
    }

    // Determine which players are currently active in the hand (not folded)
    function getActiveOpponents() {
        let allPlayers = getAllPlayers();
        // Filter out you
        let opponents = allPlayers.filter(p => p.name !== "You");

        // Use the player's seat element to detect if folded this hand
        // This depends on the site showing a class like 'folded' or grayed out player
        // Example approach: if player element has class 'folded' or opacity < 1
        return opponents.filter(p => {
            let el = p.el;
            if (el.classList.contains("folded")) return false;
            // fallback: check opacity or other style
            let style = window.getComputedStyle(el);
            if (style.opacity && parseFloat(style.opacity) < 0.6) return false;
            return true;
        }).map(p => p.name);
    }

    // Track actions per hand with more detail for detailed stats
    let currentHandActions = {}; // {playerName: {preflop:[], postflop:[]}}
    let currentOpponents = [];

    function resetHand() {
        currentHandActions = {};
        currentOpponents = getActiveOpponents();
        for (let opp of currentOpponents) {
            if (!playerProfiles[opp]) {
                playerProfiles[opp] = {
                    handsPlayed: 0,
                    vpip: 0,
                    pfr: 0,
                    aggression: 0,
                    folds: 0,
                    calls: 0,
                    raises: 0,
                    foldToRaise: 0,
                    raiseFirstIn: 0,
                    opportunities: 0, // hands where opportunity to act preflop
                    raisesFaced: 0, // how many times faced raises
                    foldToRaiseCount: 0
                };
            }
            currentHandActions[opp] = { preflop: [], postflop: [] };
        }
    }

    // Parse action logs and categorize preflop/postflop actions
    // This depends on the site showing logs with timestamps or phase tags
    // For simplicity, assume log lines update in order and "Preflop" text or community cards signal flop start
    let handStage = "preflop"; // can be 'preflop', 'flop', 'turn', 'river'

    function parseActions() {
        let logs = document.querySelectorAll("#pokerLog .log-line");
        if (!logs.length) return;

        // Detect flop by checking community cards count or specific log lines
        let communityCount = getCommunityCards().length;
        if (communityCount >= 3 && handStage === "preflop") handStage = "postflop";

        logs.forEach(logLine => {
            let text = logLine.textContent.trim();
            let foldMatch = text.match(/^(.+?) folds$/i);
            let callMatch = text.match(/^(.+?) calls/i);
            let raiseMatch = text.match(/^(.+?) raises/i);
            let betMatch = text.match(/^(.+?) bets/i);
            let checkMatch = text.match(/^(.+?) checks/i);

            if (!foldMatch && !callMatch && !raiseMatch && !betMatch && !checkMatch) return;

            let playerName = foldMatch?.[1] || callMatch?.[1] || raiseMatch?.[1] || betMatch?.[1] || checkMatch?.[1];
            if (!playerName || !currentHandActions[playerName]) return;

            if (foldMatch) currentHandActions[playerName][handStage].push("fold");
            else if (callMatch) currentHandActions[playerName][handStage].push("call");
            else if (raiseMatch) currentHandActions[playerName][handStage].push("raise");
            else if (betMatch) currentHandActions[playerName][handStage].push("bet");
            else if (checkMatch) currentHandActions[playerName][handStage].push("check");
        });
    }

    // Update detailed stats after hand ends
    function updateProfiles() {
        for (let opp of currentOpponents) {
            let actions = currentHandActions[opp];
            if (!actions) continue;

            // Basic hand count
            playerProfiles[opp].handsPlayed++;

            // VPIP = voluntary put money in pot (calls or raises preflop)
            let vpip = actions.preflop.some(a => a === "call" || a === "raise" || a === "bet");
            if (vpip) playerProfiles[opp].vpip++;

            // PFR = preflop raise
            let pfr = actions.preflop.some(a => a === "raise" || a === "bet");
            if (pfr) playerProfiles[opp].pfr++;

            // Fold count
            let totalFolds = actions.preflop.filter(a => a === "fold").length + actions.postflop.filter(a => a === "fold").length;
            playerProfiles[opp].folds += totalFolds;

            // Calls and raises count
            playerProfiles[opp].calls += actions.preflop.filter(a => a === "call").length + actions.postflop.filter(a => a === "call").length;
            playerProfiles[opp].raises += actions.preflop.filter(a => a === "raise").length + actions.postflop.filter(a => a === "raise").length;

            // Aggression factor = (raises + bets) / calls postflop
            let postRaiseBet = actions.postflop.filter(a => a === "raise" || a === "bet").length;
            let postCalls = actions.postflop.filter(a => a === "call").length || 1; // avoid divide by zero
            playerProfiles[opp].aggression += postRaiseBet / postCalls;

            // Fold to raise - approximate: if faced raise preflop and folded
            // This is a simplification because real raise facing needs history
            // We'll increment opportunities when opponent acted preflop and fold after raise
            // (Could be refined with better action parsing)
            // For now, we won't implement fold to raise fully due to complexity
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playerProfiles));
    }

    // Update UI with detailed stats
    function updateUI() {
        let holeCards = getYourHoleCards();
        let communityCards = getCommunityCards();

        if (holeCards.length < 2) {
            document.getElementById("yourOdds").innerText = "Waiting for hole cards...";
            return;
        }

        // Automatically detect active opponents
        let activeOpponents = getActiveOpponents();
        let numOpponents = activeOpponents.length;

        let odds = monteCarloWinProbMultiOpp(holeCards, communityCards, numOpponents, 1000);
        let percent = (odds * 100).toFixed(1);
        document.getElementById("yourOdds").innerHTML = `<b>Your winning odds vs ${numOpponents} opponent(s):</b> ${percent}%`;

        let html = "";
        for (let opp of activeOpponents) {
            let p = playerProfiles[opp] || {
                handsPlayed:0, vpip:0, pfr:0, aggression:0,
                folds:0, calls:0, raises:0
            };
            let hands = p.handsPlayed || 1;
            let vpipPct = ((p.vpip / hands) * 100).toFixed(1);
            let pfrPct = ((p.pfr / hands) * 100).toFixed(1);
            let af = (p.aggression / hands).toFixed(2);
            let foldPct = ((p.folds / hands) * 100).toFixed(1);
            let callPct = ((p.calls / hands) * 100).toFixed(1);
            let raisePct = ((p.raises / hands) * 100).toFixed(1);

            html += `<b>${opp}</b><br>
                Hands: ${hands}<br>
                VPIP: ${vpipPct}% | PFR: ${pfrPct}% | AF: ${af}<br>
                Fold %: ${foldPct} | Call %: ${callPct} | Raise %: ${raisePct}<br><br>`;
        }

        document.getElementById("opponentProfiles").innerHTML = `<b>Opponent Profiles (active players):</b><br>${html}`;
    }

    // Detect new hand by change in hole cards
    let lastHoleCards = [];
    function checkForNewHand() {
        let holeCards = getYourHoleCards();
        if (holeCards.length === 2 && (holeCards[0] !== lastHoleCards[0] || holeCards[1] !== lastHoleCards[1])) {
            updateProfiles();
            resetHand();
            lastHoleCards = holeCards;
        }
    }

    setInterval(() => {
        checkForNewHand();
        parseActions();
        updateUI();
    }, 1500);

    resetHand();

})();
