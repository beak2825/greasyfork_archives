// ==UserScript==
// @name         Pinpointing Duels (Game Master) - GeoNederland Fork
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  This is a fork made for the GeoNederland server and its tournaments. Credits go to GeoClassics for the original script. The script that makes pinpointing matter. Read more at the GeoClassics discord server or check out Pinpointing Tournaments on twitch.tv/GeoClassics.
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/yzhD2N9.png
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540659/Pinpointing%20Duels%20%28Game%20Master%29%20-%20GeoNederland%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/540659/Pinpointing%20Duels%20%28Game%20Master%29%20-%20GeoNederland%20Fork.meta.js
// ==/UserScript==
 
(function() {
 
    GM_registerMenuCommand("Game Master Settings", showSettingsPanel);
 
function showSettingsPanel() {
    if (document.getElementById('settings-panel')) return;
 
    const firstToValue = GM_getValue('firstTo', 10);
    const tieRangeValue = GM_getValue('tieRange', 0);
    const horizontalValue = GM_getValue('scoreBoxOffset', 30);
    const verticalValue = GM_getValue('scoreBoxTop', 86);
 
    const panel = document.createElement('div');
    panel.id = 'settings-panel';
    panel.style.cssText = `
        position: fixed;
        top: 100px;
        right: 100px;
        background: #171717;
        color: white;
        padding: 20px;
        z-index: 10000;
        border-radius: 10px;
        font-family: sans-serif;
        width: 300px;
    `;
 
    // BEST OF
    const firstToLabel = document.createElement('label');
    firstToLabel.innerText = "First to:";
    const firstToSelect = document.createElement('select');
    for (let x = 3; x <= 30; x += 1) {
        const option = document.createElement('option');
        option.value = x;
        option.innerText = x;
        if (x == firstToValue) option.selected = true;
        firstToSelect.appendChild(option);
    }
 
    // TIE RANGE
    const tieLabel = document.createElement('label');
    tieLabel.innerText = "Tie Range Mode:";
    const tieSelect = document.createElement('select');
    [
        { value: 0, label: "Disabled" },
        { value: 1, label: "Full Tie Range" },
        { value: 2, label: "Half Tie Range" }
    ].forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = label;
        if (value == tieRangeValue) option.selected = true;
        tieSelect.appendChild(option);
    });
 
    // HORIZONTAL POSITION
    const hLabel = document.createElement('label');
    hLabel.innerText = `Score Board Horizontal Position: ${horizontalValue}%`;
    hLabel.style.display = "block";
    const hSlider = document.createElement('input');
    hSlider.type = "range";
    hSlider.min = "0";
    hSlider.max = "100";
    hSlider.value = horizontalValue;
    hSlider.style.width = "100%";
    hSlider.addEventListener('input', () => {
        hLabel.innerText = `Score Board Horizontal Position: ${hSlider.value}%`;
        updateScoreBoxPosition(parseInt(hSlider.value), parseInt(vSlider.value));
    });
 
    // VERTICAL POSITION
    const vLabel = document.createElement('label');
    vLabel.innerText = `Score Board Vertical Position: ${verticalValue}px`;
    vLabel.style.display = "block";
    const vSlider = document.createElement('input');
    vSlider.type = "range";
    vSlider.min = "0";
    vSlider.max = "300";
    vSlider.value = verticalValue;
    vSlider.style.width = "100%";
    vSlider.addEventListener('input', () => {
        vLabel.innerText = `Score Board Vertical Position: ${vSlider.value}px`;
        updateScoreBoxPosition(parseInt(hSlider.value), parseInt(vSlider.value));
    });
 
    // Buttons
    const saveBtn = document.createElement('button');
    saveBtn.innerText = "Save";
    saveBtn.style.margin = "10px";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.color = "white";
    saveBtn.onclick = () => {
        firstTo = parseInt(firstToSelect.value);
        tieRange = parseInt(tieSelect.value);
        winThreshold = firstTo;
 
        GM_setValue('firstTo', firstTo);
        GM_setValue('tieRange', tieRange);
        GM_setValue('scoreBoxOffset', parseInt(hSlider.value));
        GM_setValue('scoreBoxTop', parseInt(vSlider.value));
 
        alert("Settings saved!");
        panel.remove();
    };
 
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = "Cancel";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.color = "white";
    cancelBtn.onclick = () => panel.remove();
 
    // Add to DOM
    panel.append(
        firstToLabel, firstToSelect,
        document.createElement("br"),
        document.createElement("br"),
        tieLabel, tieSelect,
        document.createElement("br"),
        document.createElement("br"),
        hLabel, hSlider,
        document.createElement("br"),
        document.createElement("br"),
        vLabel, vSlider,
        document.createElement("br"),
        document.createElement("br"),
        saveBtn, cancelBtn
    );
 
    document.body.appendChild(panel);
}
 
function updateScoreBoxPosition(horizontalPercent, verticalPx) {
    const leftEl = document.getElementById("leftScore");
    const rightEl = document.getElementById("rightScore");
    if (leftEl) {
        leftEl.style.left = `${horizontalPercent}%`;
        leftEl.style.top = `${verticalPx}px`;
    }
    if (rightEl) {
        rightEl.style.right = `${horizontalPercent}%`;
        rightEl.style.top = `${verticalPx}px`;
    }
}
 
/*function showTieDisplay(points) {
    const container = document.querySelector(".round-score-animations_scoreTable__BpRHh");
    if (!container) return;
 
    // Avoid duplicates
    if (document.getElementById("tieDisplayMessage")) return;
 
    const wrapper = document.createElement("div");
    wrapper.id = "tieDisplayMessage";
    wrapper.innerHTML = `
        <div style="margin: 0 auto; font-size: 32px; text-align: center; color: #f2f2f2;">TIE!</div>
        <div style="margin: 20px auto 0 auto; font-size: 20px; text-align: center; color: #ccc;">TIE RANGE: ${points} points</div>
    `;
    container.insertBefore(wrapper, container.firstChild);
}
 
function showPenaltyDisplay(team) {
    const container = document.querySelector(".round-score-animations_scoreTable__BpRHh");
    if (!container) return;
 
    // Avoid duplicates
    if (document.getElementById("penaltyDisplayMessage")) return;
 
    const wrapper = document.createElement("div");
    wrapper.id = "penaltyDisplayMessage";
    wrapper.innerHTML = `
        <div style="margin: 0 auto; font-size: 24px; text-align: center; color: #f2f2f2;">NON 5K PENALTY FOR ${team}</div>
    `;
    container.insertBefore(wrapper, container.firstChild);
}
 
function showBonusDisplay(team) {
    const container = document.querySelector(".round-score-animations_scoreTable__BpRHh");
    if (!container) return;
 
    if (document.getElementById("bonusDisplayMessage")) return;
 
    const wrapper = document.createElement("div");
    wrapper.id = "bonusDisplayMessage";
    wrapper.innerHTML = `
        <div style="margin: 0 auto; font-size: 28px; text-align: center; color: #90ee90;">${team} got a bonus point for 5K!</div>
    `;
    container.insertBefore(wrapper, container.firstChild);
}*/
function showResultDisplay(message) {
    const container = document.querySelector(".round-score-animations_scoreTable__BpRHh");
    if (!container) return;
 
    // Avoid duplicates
    if (document.getElementById("roundDisplayMessage")) return;
 
    const wrapper = document.createElement("div");
    wrapper.id = "roundDisplayMessage";
    wrapper.innerHTML = `
        <div style="padding: 20px 0; margin: 0 auto; font-size: 32px; line-height: 48px; text-align: center; color: #f2f2f2;">${message}</div>
    `;
    container.insertBefore(wrapper, container.firstChild);
}
 
function showPenaltyDisplay(message) {
    const container = document.querySelector(".round-score-animations_scoreTable__BpRHh");
    if (!container) return;
 
    // Avoid duplicates
    if (document.getElementById("roundDisplayPenalty")) return;
 
    const wrapper = document.createElement("div");
    wrapper.id = "roundDisplayPenalty";
    wrapper.innerHTML = `
        <div style="padding: 20px 0; margin: 24px auto; font-size: 24px; line-height: 24px; text-align: center; color: #f2f2f2;">SCORE 0 FOR GUESSING EARLY AND MISSING 5K: ${message}</div>
    `;
    container.insertBefore(wrapper, container.firstChild);
}
 
    'use strict';
 
    // Inject custom CSS for the overlay backdrop and active round wrapper to use your default image.
    const customStyles = `
        .overlay_backdrop__ueiEF,
        .views_activeRoundWrapper__1_J5M {
            background-image: url('https://i.imgur.com/KBKHefn.png') !important;
            background-position: center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
        }
    `;
    const styleElem = document.createElement('style');
    styleElem.textContent = customStyles;
    document.head.appendChild(styleElem);
 
    let firstTo = GM_getValue('firstTo', 10); // Fallback 10
    let winThreshold = firstTo; //Win Value
    let tieRange = GM_getValue('tieRange', 0);
 
    let leftScore = 0, rightScore = 0;
    let gameOver = false; // Flag to ensure the end screen is only shown once
    let currentDuel = false; // Flag to ensure the end screen is only shown once
 
    // Remove unwanted UI elements and ensure our score display exists.
    const modifyHealthBars = () => {
        const healthContainer = document.querySelector(".cam-hud_playerBadge__RViHv");
        if (!healthContainer) return;
        document.querySelectorAll('[class*="wc-health-bar_container__zK0hz"]').forEach(bar => bar.style.visibility = "hidden");
        document.querySelectorAll('.views_roundMultiplier__iQZZW').forEach(el => el.style.display = "none");
        if (!document.getElementById("leftScore") || !document.getElementById("rightScore")) {
            createScoreDisplays();
        }
    };
 
    const createScoreDisplays = () => {
        const hudRoot = document.querySelector(".cam-hud_wrapper__4whN_");
        if (!hudRoot) return;
        const createScoreDiv = (id, position) => {
            const div = document.createElement("div");
            div.id = id;
            div.innerText = (id === "leftScore") ? leftScore : rightScore;
            div.style.cssText = `
                padding: 10px 20px;
                font-size: 48px;
                font-weight: bold;
                color: white;
                background: #0e191d;
                border-radius: 5px;
                text-align: center;
                margin: 5px;
                position: absolute;
                width: 100px;
                ${position}: ${GM_getValue('scoreBoxOffset', 30)}%;
                top: ${GM_getValue('scoreBoxTop', 86)}px;
                z-index: 1000;
            `;
            return div;
        };
        hudRoot.appendChild(createScoreDiv("leftScore", "left"));
        hudRoot.appendChild(createScoreDiv("rightScore", "right"));
        updateScoreBoxPosition(GM_getValue('scoreBoxOffset', 30), GM_getValue('scoreBoxTop', 86));
    };
 
    // Create and display the end screen overlay.
    const showEndScreen = () => {
        const overlay = document.createElement("div");
        overlay.id = "endScreenOverlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: linear-gradient(180deg,rgba(0, 24, 47, 1) 0%, rgba(1, 57, 122, 1) 95%);,#352A9B;
            color: #FF770F;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            text-align: center;
        `;
        const winnerText = (leftScore >= winThreshold) ? "BLUE WINS THE GAME" : "RED WINS THE GAME!";
        const scoreText = `${leftScore}-${rightScore}`;
 
        const winnerElem = document.createElement("div");
        winnerElem.innerText = winnerText;
        winnerElem.style.cssText = `
            font-size: 72pt;
            margin-bottom: 20px;
        `;
 
        const scoreElem = document.createElement("div");
        scoreElem.innerText = scoreText;
        scoreElem.style.cssText = `
            font-size: 90pt;
            margin-bottom: 20px;
            color: white;
        `;
 
        const messageElem = document.createElement("div");
        messageElem.innerText = "Feel free to abort the game, or let players guess Antarctica for the remaining rounds.";
        messageElem.style.cssText = `
            font-size: 24pt;
            margin-bottom: 20px;
            color: white;
        `;
 
        const button = document.createElement("button");
        button.innerText = "Okay";
        button.className = "button_button__aR6_e button_variantPrimary__u3WzI";
        button.addEventListener("click", () => {
            overlay.remove();
        });
 
        overlay.appendChild(winnerElem);
        overlay.appendChild(scoreElem);
        overlay.appendChild(messageElem);
        overlay.appendChild(button);
        document.body.appendChild(overlay);
    };
 
    // Flash the score element by toggling backgrounds every 0.5s for 5s.
    const flashScore = (scoreElement) => {
        const originalBackground = scoreElement.style.background;
        const flashBackground = "linear-gradient(180deg,rgba(90,219,149,1),rgba(60,200,110,1) 95%),#5adb95";
        let flashCount = 0;
        const interval = setInterval(() => {
            // Toggle the background on odd/even counts.
            scoreElement.style.background = (flashCount % 2 === 0) ? flashBackground : originalBackground;
            flashCount++;
            if (flashCount >= 10) { // 10 toggles * 0.5s = 5 seconds total.
                clearInterval(interval);
                scoreElement.style.background = originalBackground;
            }
        }, 500);
    };
 
    // Update cumulative scores.
    const updateScores = (response) => {
        let team0Score = 0, team1Score = 0;
        let newTeam0Score = 0, newTeam1Score = 0;
        let tieDistance = 0;
        const timeAfterGuess = response.options.roundTime;
        const maxRoundTime = response.options.maxRoundTime;
 
         for (let i = 0; i < response.currentRoundNumber && newTeam0Score < winThreshold && newTeam1Score < winThreshold; i++) {
            if (!response.rounds[i].hasProcessedRoundTimeout) continue;
            const oldDisplayMessage = document.getElementById("roundDisplayMessage");
            if (oldDisplayMessage) oldDisplayMessage.remove();
            const oldPenaltyMessage = document.getElementById("roundDisplayPenalty");
            if (oldPenaltyMessage) oldPenaltyMessage.remove();
 
            let roundStartTime = new Date(response.rounds[i]?.startTime)/1000 || Infinity;
            let roundEndTime = new Date(response.rounds[i]?.endTime)/1000 || Infinity;
            let team0RoundScore = 0,team1RoundScore = 0;
            let team0Time = Infinity, team1Time = Infinity;
            let team0BestScore = 0, team1BestScore = 0;
 
            for (let j = 0; j < response.teams[0]?.players.length; j++){
                let currentGuess;
                response.teams[0].players[j].guesses.forEach((guess) => {if (guess.roundNumber == i+1) currentGuess = guess;});
                if (currentGuess === undefined) continue;
                let guessTime = new Date(currentGuess.created)/1000 || Infinity;
                let score = Math.round(5000*Math.exp(-10*currentGuess.distance/response.options?.map?.maxErrorDistance)) || 0;
                score = currentGuess.distance < 25 ? 5000 : score;
                if (guessTime < team0Time && guessTime < roundEndTime) {
                    team0Time = guessTime; team0RoundScore = score;
                } else if (score > team0BestScore) {
                    team0BestScore = score;
                }
            }
            if (team0Time > roundEndTime) team0RoundScore = team0BestScore;
            for (let j = 0; j < response.teams[1]?.players.length; j++){
                let currentGuess;
                response.teams[1].players[j].guesses.forEach((guess) => {if (guess.roundNumber == i+1) currentGuess = guess;});
                if (currentGuess === undefined) continue;
                let guessTime = new Date(currentGuess.created)/1000 || Infinity;
                let score = Math.round(5000*Math.exp(-10*currentGuess.distance/response.options?.map?.maxErrorDistance)) || 0;
                score = currentGuess.distance < 25 ? 5000 : score;
                if (guessTime < team1Time && guessTime < roundEndTime) {
                    team1Time = guessTime; team1RoundScore = score;
                } else if (score > team1BestScore) {
                    team1BestScore = score;
                }
            }
            if (team1Time > roundEndTime) team1RoundScore = team1BestScore;
 
 
            if (team0RoundScore < 5000 && team0Time < team1Time && team0Time < (roundStartTime + maxRoundTime - timeAfterGuess)) {
                showPenaltyDisplay("BLUE");
                team0RoundScore = 0;
            } else if (team1RoundScore < 5000 && team1Time < team0Time && team1Time < (roundStartTime + maxRoundTime - timeAfterGuess)) {
                showPenaltyDisplay("RED");
                team1RoundScore = 0;
            } // Score counted as 0 if penalty for early sending
 
            let message = '', tieMessage = '', winMessage = '';
            team0Score = newTeam0Score; team1Score = newTeam1Score;
            const highestScore = team0RoundScore > team1RoundScore ? team0RoundScore : team1RoundScore;
            if (tieRange > 0) tieDistance = Math.floor((5000 - highestScore) / tieRange);
 
            if (team0RoundScore === 5000 && team1RoundScore === 5000) {
                if (team0Time < team1Time) newTeam0Score++;
                else if (team1Time < team0Time) newTeam1Score++;
                message = `Point for fastest 5K`;
            } else if (team0RoundScore > team1RoundScore + tieDistance || team1RoundScore > team0RoundScore + tieDistance) {
                if (team0RoundScore > team1RoundScore + tieDistance) newTeam0Score++; else newTeam1Score ++;
                message = `Point for closest guess`;
                if (tieRange>0) tieMessage = `<br><span style="font-size: 14px;">TIE RANGE: ${tieDistance} POINTS</span>`;
            } else {
                message = `TIE!`;
                if (tieRange>0) tieMessage = `<br><span style="font-size: 14px;">TIE RANGE: ${tieDistance} POINTS</span>`;
            }
            if (message !== `TIE!`) winMessage = (newTeam0Score > team0Score) ? "BLUE WINS THE ROUND! <br>" : "RED WINS THE ROUND! <br>";
            const isMatchPoint = newTeam0Score >= winThreshold - 2 || newTeam1Score >= winThreshold - 2;
            showResultDisplay(`${winMessage} ${message} ${isMatchPoint ? "<br>MATCH POINT!" : "" } ${tieMessage}`);
        }
 
        const leftScoreChanged = newTeam0Score !== leftScore;
        const rightScoreChanged = newTeam1Score !== rightScore;
 
        leftScore = newTeam0Score;
        rightScore = newTeam1Score;
        const isMatchPoint = leftScore >= winThreshold - 2 || rightScore >= winThreshold - 2;
        const leftScoreEl = document.getElementById("leftScore");
        const rightScoreEl = document.getElementById("rightScore");
        if (leftScoreEl) {
            leftScoreEl.innerText = leftScore;
            if (leftScoreChanged) flashScore(leftScoreEl);
        }
        if (rightScoreEl) {
            rightScoreEl.innerText = rightScore;
            if (rightScoreChanged) flashScore(rightScoreEl);
        }
 
        if (!gameOver && (leftScore >= winThreshold || rightScore >= winThreshold)) {
            gameOver = true;
            showEndScreen();
        }
    };
 
    // Update the background image of the active round wrapper based on the current scores.
    const updateActiveRoundBackground = () => {
        let bgUrl = "https://i.imgur.com/vzIi2Wl.jpeg"; // default background
        // If game is over, use default background.
        if (leftScore >= winThreshold || rightScore >= winThreshold) {
            bgUrl = "https://i.imgur.com/vzIi2Wl.jpeg";
        }
        // Both players at match point.
        else if (leftScore === (winThreshold-1) && rightScore === (winThreshold-1)) {
            bgUrl = "https://i.imgur.com/fkDBh8y.jpeg";
        }
        // Left at match point.
        else if (leftScore === (winThreshold-1)) {
            bgUrl = "https://i.imgur.com/AFaqXv0.jpeg";
        }
        // Right at match point.
        else if (rightScore === (winThreshold-1)) {
            bgUrl = "https://i.imgur.com/u6jRQuM.jpeg";
        }
        const activeRoundElem = document.querySelector(".views_activeRoundWrapper__1_J5M");
        if (activeRoundElem) {
            activeRoundElem.style.setProperty("background-image", `url('${bgUrl}')`, "important");
            activeRoundElem.style.setProperty("background-position", "center", "important");
            activeRoundElem.style.setProperty("background-size", "cover", "important");
            activeRoundElem.style.setProperty("background-repeat", "no-repeat", "important");
        }
    };
 
    const fetchDuelData = () => {
        const duelId = location.pathname.split("/")[2];
        if (!duelId) return;
 
        if (gameOver) {
            if (duelId != currentDuel) {
                gameOver = false;
            } else {
                return;
            }
        }
 
        currentDuel = duelId;
        fetch(`https://game-server.geoguessr.com/api/duels/${duelId}/spectate`, { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(updateScores)
            .catch(err => {});
    };
 
    const observer = new MutationObserver(() => {
        requestAnimationFrame(modifyHealthBars);
    });
    observer.observe(document.body, { childList: true, subtree: true });
 
    if (location.href.includes("duels")) {
        fetchDuelData();
    }
 
    // Listen for URL changes to auto-activate the script.
    (function() {
        const _wr = type => {
            const orig = history[type];
            return function() {
                const rv = orig.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return rv;
            };
        };
        history.pushState = _wr("pushState");
        history.replaceState = _wr("replaceState");
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    })();
    window.addEventListener('locationchange', function(){
        if (location.href.includes("duels")) {
            fetchDuelData();
            modifyHealthBars();
        }
    });
    setInterval(() => {
        if (location.href.includes("duels")) {
            fetchDuelData();
        }
    }, 5000);
 
            if (location.href.includes("duels")) {
        scanStyles().then(_ => {
            fetchDuelData();
        });
    }
 
})();