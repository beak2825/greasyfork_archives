// ==UserScript==
// @name         Cartel Empire Blackjack Pro Assistant
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Blackjack based on basic strategy + dynamic betting + stats tracking + training AI mode + reset/toggle controls
// @match        https://cartelempire.online/Casino/Blackjack
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537241/Cartel%20Empire%20Blackjack%20Pro%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/537241/Cartel%20Empire%20Blackjack%20Pro%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stats = JSON.parse(localStorage.getItem('bjStats') || '{"wins":0,"losses":0,"pushes":0,"rounds":0,"profit":0}');

    function saveStats() {
        localStorage.setItem('bjStats', JSON.stringify(stats));
    }

    function resetStats() {
        stats = { wins: 0, losses: 0, pushes: 0, rounds: 0, profit: 0 };
        saveStats();
    }

    function getCardValue(text) {
        if (["J","Q","K"].includes(text)) return 10;
        if (text === "A") return 11;
        return parseInt(text);
    }

    function readHand(selector) {
        const cards = Array.from(document.querySelectorAll(selector));
        return cards.map(card => card.textContent.trim());
    }

    function calculateTotal(cards) {
        let total = 0, aces = 0;
        cards.forEach(card => {
            const val = getCardValue(card);
            if (val === 11) aces++;
            total += val;
        });
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
        return total;
    }

    function isSoftHand(cards) {
        let total = 0, aces = 0;
        cards.forEach(card => {
            const val = getCardValue(card);
            if (val === 11) aces++;
            total += val;
        });
        return (aces > 0 && total <= 21);
    }

    function isPair(cards) {
        return cards.length === 2 && getCardValue(cards[0]) === getCardValue(cards[1]);
    }

    function getAdvice(playerCards, dealerCard) {
        const dealer = getCardValue(dealerCard);
        const playerTotal = calculateTotal(playerCards);
        const soft = isSoftHand(playerCards);
        const pair = isPair(playerCards);
        const val = getCardValue(playerCards[0]);

        if (pair) {
            switch(val) {
                case 11: case 8: return "SPLIT";
                case 10: return "STAND";
                case 9: return ([2,3,4,5,6,8,9].includes(dealer)) ? "SPLIT" : "STAND";
                case 7: return (dealer <= 7) ? "SPLIT" : "HIT";
                case 6: return (dealer >= 2 && dealer <= 6) ? "SPLIT" : "HIT";
                case 5: return (dealer >= 2 && dealer <= 9) ? "DOUBLE" : "HIT";
                case 4: return ([5,6].includes(dealer)) ? "SPLIT" : "HIT";
                case 3: case 2: return (dealer <= 7) ? "SPLIT" : "HIT";
            }
        }

        if (soft) {
            switch(playerTotal) {
                case 20: case 19: return "STAND";
                case 18:
                    if ([3,4,5,6].includes(dealer)) return "DOUBLE";
                    if ([2,7,8].includes(dealer)) return "STAND";
                    return "HIT";
                case 17: case 16: case 15: case 14:
                    return (dealer >= 4 && dealer <= 6) ? "DOUBLE" : "HIT";
                case 13: case 12:
                    return ([5,6].includes(dealer)) ? "DOUBLE" : "HIT";
            }
        }

        if (playerTotal >= 17) return "STAND";
        if (playerTotal >= 13 && dealer <= 6) return "STAND";
        if (playerTotal === 12 && dealer >= 4 && dealer <= 6) return "STAND";
        if (playerTotal === 11) return "DOUBLE";
        if (playerTotal === 10 && dealer <= 9) return "DOUBLE";
        if (playerTotal === 9 && dealer >= 3 && dealer <= 6) return "DOUBLE";
        return "HIT";
    }

    function getBetAmount() {
        const betEl = document.querySelector("#currentBetAmount");
        if (betEl) {
            const val = parseInt(betEl.textContent.trim());
            return isNaN(val) ? 1 : val;
        }
        return 1;
    }

    function displayAdvice(advice) {
        let box = document.getElementById("bjAdviceBox");
        if (!box) {
            box = document.createElement("div");
            box.id = "bjAdviceBox";
            box.style.position = "fixed";
            box.style.bottom = "100px";
            box.style.right = "20px";
            box.style.background = "#111";
            box.style.color = "#0f0";
            box.style.padding = "14px";
            box.style.borderRadius = "12px";
            box.style.zIndex = "10000";
            box.style.fontSize = "16px";
            box.style.fontFamily = "monospace";

            const statsDiv = document.createElement("div");
            statsDiv.id = "bjStatsDiv";
            box.appendChild(statsDiv);

            const resetBtn = document.createElement("button");
            resetBtn.textContent = "Reset Stats";
            resetBtn.style.margin = "6px 4px 0";
            resetBtn.onclick = () => { resetStats(); displayAdvice(advice); };

            const controlsDiv = document.createElement("div");
            controlsDiv.id = "bjControlsDiv";
            controlsDiv.appendChild(document.createElement("br"));
            controlsDiv.appendChild(resetBtn);

            box.appendChild(controlsDiv);
            document.body.appendChild(box);
        }

        const statsDiv = document.getElementById("bjStatsDiv");
        if (statsDiv) {
            const winRate = stats.rounds > 0 ? ((stats.wins / stats.rounds) * 100).toFixed(1) : "0.0";
            statsDiv.innerHTML = `
                💡 <b>Move:</b> ${advice}<br>
                🧾 <b>Rounds:</b> ${stats.rounds} |
                ✅ ${stats.wins} 🟥 ${stats.losses} ⚖️ ${stats.pushes}<br>
                💰 <b>Profit:</b> ${stats.profit} chips<br>
                📈 <b>Win Rate:</b> ${winRate}%
            `;
        }
    }

    function autoRebet() {
        const betBtn = document.querySelector("#repeatBetBtn") || document.querySelector("#rebetButton");
        if (betBtn && betBtn.offsetParent !== null) {
            betBtn.click();
        }
    }

    function trackResults() {
        const resultEl = document.querySelector("#blackjackResult");
        if (!resultEl || resultEl.dataset.processed === "true") return;

        const result = resultEl.textContent.trim().toLowerCase();
        if (!result) return;

        resultEl.dataset.processed = "true";
        const bet = getBetAmount();

        stats.rounds++;
        if (result.includes("win")) { stats.wins++; stats.profit += bet; }
        else if (result.includes("lose")) { stats.losses++; stats.profit -= bet; }
        else if (result.includes("push")) { stats.pushes++; }

        saveStats();
        setTimeout(autoRebet, 500);
    }

    function update() {
        trackResults();

        const playerCards = readHand('#playerCards .blackjackCardText');
        const dealerCards = readHand('#dealerCards .blackjackCardText');

        if (playerCards.length === 0 || dealerCards.length === 0) return;

        const advice = getAdvice(playerCards, dealerCards[0]);
        displayAdvice(advice);
    }

    setInterval(update, 1200);
})();
