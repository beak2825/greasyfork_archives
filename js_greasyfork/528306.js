// ==UserScript==
// @name         Pinpointing Duels (Game Master - HellCup Edition)
// @namespace    http://tampermonkey.net/
// @version      2.1.7
// @description  The script that makes pinpointing matter. Read more at the GeoClassics discord server or check out Pinpointing Tournaments on twitch.tv/GeoClassics.
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/eKp3nIa.png
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528306/Pinpointing%20Duels%20%28Game%20Master%20-%20HellCup%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528306/Pinpointing%20Duels%20%28Game%20Master%20-%20HellCup%20Edition%29.meta.js
// ==/UserScript==

(function() {

    let movementAllowed = true;

    // === NEW: First-guess state ===
    let lastProcessedRound = 0;
    let latestEarlyNo5k = { blue: false, red: false };
    let announcedRoundBySide = { blue: 0, red: 0 };
    let queuedPenalty = { blue: null, red: null }; // { nick, round } per side
    let lastFlushedRound = 0;

    GM_registerMenuCommand("Game Master Settings", showSettingsPanel);

    const userNameMap = {};

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
        font-family: ggFont, sans-serif;
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

function showResultDisplay(message) {
    const container = document.querySelector(".round-score-animations_scoreTable__BpRHh");
    if (!container) return;

    if (document.getElementById("roundDisplayMessage")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "roundDisplayMessage";
    wrapper.innerHTML = `
        <div style="padding: 20px 10px; width: 35%; margin: 8px auto; font-size: 24px; line-height: 28px; text-align: center; color: #f2f2f2; background: rgb(14, 25, 29); border-radius: 5px;">${message}</div>
    `;
    container.insertBefore(wrapper, container.firstChild);
}

const FIRST_GUESS_DURATION_MS = 5000;
const FIRST_GUESS_BANNER_ID_PREFIX = "firstGuessBanner-";

function showFirstGuessBanner({ team, nick, variant }) {

    const colorMap = {
        lockedin: { bg: "#0e191d", accent: "#fcba03", text: "#ffffff" },
        penalized:   { bg: "#540000", accent: "#ff4d4f", text: "#ffffff" }
    };
    const { bg, accent, text } = colorMap[variant];

    // Container (stack banners)
    let stack = document.getElementById("first-guess-banner-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.id = "first-guess-banner-stack";
        stack.style.cssText = `
            position: fixed;
            top: 350px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 10050;
            pointer-events: none;
        `;
        document.body.appendChild(stack);
    }

    const id = `${FIRST_GUESS_BANNER_ID_PREFIX}${team}-${Date.now()}`;
    const el = document.createElement("div");
    el.id = id;
    el.style.cssText = `
        min-width: 520px;
        max-width: 820px;
        padding: 14px 18px;
        border-radius: 10px;
        background: ${bg};
        color: ${text};
        font-family: ggFont, sans-serif;
        font-weight: bold;
        font-size: 24px;
        line-height: 32px;
        text-align: center;
        border: 2px solid ${accent};
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        transform: translateY(-8px);
        opacity: 0;
        transition: opacity 220ms ease, transform 260ms ease;
        pointer-events: none;
    `;

    let message = "";
    if (variant === "lockedin") {
        message = `${nick} has locked in their guess`;
    } else {
        message = `${nick} locked in early and didn’t 5K — 0 points`;
    }

    // Team accent pill
    const pill = document.createElement("span");
    pill.textContent = team.toUpperCase() + " TEAM";
    pill.style.cssText = `
        display: inline-block;
        margin-right: 10px;
        padding: 2px 8px;
        border-radius: 999px;
        background: ${team};
        color: #ffffff;
        font-weight: 700;
        font-size: 12px;
        vertical-align: middle;
    `;

    const textNode = document.createElement("span");
    textNode.textContent = ` ${message}`;

    el.appendChild(pill);
    el.appendChild(textNode);
    stack.appendChild(el);

    requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateY(-8px)";
        setTimeout(() => el.remove(), 250);
    }, FIRST_GUESS_DURATION_MS);
}

    'use strict';

    const customStyles = `
        .overlay_backdrop__ueiEF,
        .views_activeRoundWrapper__1_J5M {
            background-image: url('https://i.imgur.com/mPr3kLz.png') !important;
            background-position: center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
        }
    `;
    const styleElem = document.createElement('style');
    styleElem.textContent = customStyles;
    document.head.appendChild(styleElem);

document.getElementById('pp-kill-anim-style')?.remove();

function setKillAnimEnabled(on) {
  const ID = 'pp-kill-anim-style';
  let el = document.getElementById(ID);
  if (on) {
    if (el) return; // already on
    el = document.createElement('style');
    el.id = ID;
    el.textContent = `
      /* BLUE side (left) — punish BLUE */
      body[data-pp-blue-punished="1"]
      div[class*="round-score-animations_scoreColumnLeft"]:not([class*="static"])
      div[class*="scoreContainer"] > div:not([class*="damage"]) {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
      }
      body[data-pp-blue-punished="1"]
      div[class*="round-score-animations_scoreColumnLeft"]:not([class*="static"]) {
        transform: none !important; transition: none !important; animation: none !important;
      }
      body[data-pp-blue-punished="1"]
      div[class*="round-score-animations_scoreColumnRight"]:not([class*="static"])
      div[class*="damage"] {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
      }
      /* RED side (right) — punish RED */
      body[data-pp-red-punished="1"]
      div[class*="round-score-animations_scoreColumnRight"]:not([class*="static"])
      div[class*="scoreContainer"] > div:not([class*="damage"]) {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
      }
      body[data-pp-red-punished="1"]
      div[class*="round-score-animations_scoreColumnRight"]:not([class*="static"]) {
        transform: none !important; transition: none !important; animation: none !important;
      }
      body[data-pp-red-punished="1"]
      div[class*="round-score-animations_scoreColumnLeft"]:not([class*="static"])
      div[class*="damage"] {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
      }
    `;
    document.head.appendChild(el);
  } else {
    el?.remove();
    document.body.removeAttribute('data-pp-blue-punished');
    document.body.removeAttribute('data-pp-red-punished');
  }
}

    let firstTo = GM_getValue('firstTo', 10); // Fallback 10
    let winThreshold = firstTo; //Win Value
    let tieRange = GM_getValue('tieRange', 0);

    let leftScore = 0, rightScore = 0;
    let gameOver = false;
    let currentDuel = false;

    const modifyHealthBars = () => {
        if (!movementAllowed) return;
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

    const showEndScreen = () => {
    const overlay = document.createElement("div");
    overlay.id = "endScreenOverlay";
    overlay.style.cssText = `
        position: fixed; inset: 0;
        background: linear-gradient(180deg,rgba(6,43,20,1),rgba(11,65,43,1) 95%),#062b14;
        color: #5adb95; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        z-index: 9999; text-align: center;
        opacity: 0; transform: scale(0.96);
        transition: opacity 500ms ease, transform 600ms ease;
    `;
        const winnerText = (leftScore >= winThreshold) ? "BLUE WINS THE GAME!" : "RED WINS THE GAME!";
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
        button.innerText = "FINISH";
        button.className = "button_button__aR6_e button_variantPrimary__u3WzI";
        button.addEventListener("click", () => {
            overlay.remove();
        });

        overlay.append(winnerElem, scoreElem, button);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        overlay.style.transform = "scale(1)";
    });
    };

    const flashScore = (scoreElement) => {
        const originalBackground = scoreElement.style.background;
        const flashBackground = "linear-gradient(180deg,rgba(90,219,149,1),rgba(60,200,110,1) 95%),#5adb95";
        let flashCount = 0;
        const interval = setInterval(() => {
            scoreElement.style.background = (flashCount % 2 === 0) ? flashBackground : originalBackground;
            flashCount++;
            if (flashCount >= 10) {
                clearInterval(interval);
                scoreElement.style.background = originalBackground;
            }
        }, 500);
    };

    function getPlayerName(teams, teamIndex, rnd) {
        const team = teams[teamIndex];
        if (!team) return "";

        let earliest = null; // { t, playerId }
        for (const p of (team.players || [])) {
            for (const g of (p.guesses || [])) {
                if (g.roundNumber !== rnd) continue;
                const is5k = (g.distance != null && g.distance < 25) || g.score === 5000;
                if (!is5k || !g.created) continue;
                const t = new Date(g.created).getTime();
                if (!earliest || t < earliest.t) earliest = { t, playerId: p.playerId };
            }
        }
        if (earliest) return userNameMap[earliest.playerId] || "Guest";

        for (const p of (team.players || [])) {
            const g = (p.guesses || []).find(gg => gg.roundNumber === rnd && gg.score === 5000);
            if (g) return userNameMap[p.playerId] || "Guest";
        }

        return team.name;
    }

    const updateScores = (response) => {
        let team0Score = 0, team1Score = 0;
        let newTeam0Score = 0, newTeam1Score = 0;
        let tieDistance = 0;
        const timeAfterGuess = response.options.roundTime;
        const maxRoundTime = response.options.maxRoundTime;

         for (let i = 0; i < response.currentRoundNumber && newTeam0Score < winThreshold && newTeam1Score < winThreshold; i++) {
            let team0Winner = null, team1Winner = null;

            if (!response.rounds[i].hasProcessedRoundTimeout) continue;
            const oldDisplayMessage = document.getElementById("roundDisplayMessage");
            if (oldDisplayMessage) oldDisplayMessage.remove();

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
                    team0Time = guessTime; team0RoundScore = score; team0Winner = response.teams[0].players[j];
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
                    team1Time = guessTime; team1RoundScore = score; team1Winner = response.teams[1].players[j];
                } else if (score > team1BestScore) {
                    team1BestScore = score;
                }
            }
            if (team1Time > roundEndTime) team1RoundScore = team1BestScore;


            if (team0RoundScore < 5000 && team0Time < team1Time && team0Time < (roundStartTime + maxRoundTime - timeAfterGuess)) {
                team0RoundScore = 0;
            } else if (team1RoundScore < 5000 && team1Time < team0Time && team1Time < (roundStartTime + maxRoundTime - timeAfterGuess)) {
                team1RoundScore = 0;
            }

            let message = '', tieMessage = '', winMessage = '';
            team0Score = newTeam0Score; team1Score = newTeam1Score;
            const highestScore = team0RoundScore > team1RoundScore ? team0RoundScore : team1RoundScore;
            if (tieRange > 0) tieDistance = Math.floor((5000 - highestScore) / tieRange);

            if (team0RoundScore === 5000 && team1RoundScore === 5000) {
                 if (team0Time < team1Time) {
                     newTeam0Score++;
                     message = `1 point for the fastest 5K by ${getPlayerName(response.teams, 0, i+1)}`;
                 } else if (team1Time < team0Time) {
                     newTeam1Score++;
                     message = `1 point for the fastest 5K by ${getPlayerName(response.teams, 1, i+1)}`;
                 } else {
                     message = `Both teams 5K at the same time`;
                 }
            }
            else if (team0RoundScore === 5000 || team1RoundScore === 5000) {
                if (team0RoundScore === 5000) {
                    newTeam0Score += 2;
                    message = `2 points for a solo 5K by ${getPlayerName(response.teams, 0, i+1)}`;
                } else {
                    newTeam1Score += 2;
                    message = `2 points for a solo 5K by ${getPlayerName(response.teams, 1, i+1)}`;
                }
            } else if (team0RoundScore > team1RoundScore + tieDistance || team1RoundScore > team0RoundScore + tieDistance) {
                if (team0RoundScore > team1RoundScore + tieDistance) newTeam0Score++; else newTeam1Score ++;
                message = `1 point for the closest guess`;
                if (tieRange>0) tieMessage = `<br><span style="font-size: 14px; color: #22dd22;">TIE RANGE: ${tieDistance} POINTS</span>`;
            } else {
                message = `TIE!`;
                if (tieRange>0) tieMessage = `<br><span style="font-size: 14px; color: #22dd22">TIE RANGE: ${tieDistance} POINTS</span>`;
            }
            if (message !== `TIE!`) winMessage = (newTeam0Score > team0Score) ? "BLUE WINS <br>" : "RED WINS <br>";
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
            setTimeout(showEndScreen, 2500)
        }
    };

    function roundTimedOutOrScoringVisible(response) {
        const rn = response.currentRoundNumber;
        const round = (response.rounds || []).find(r => r.roundNumber === rn);
        if (!round) return false;

        if (round.hasProcessedRoundTimeout) return true;

        if (document.querySelector('div[class*="round-score-animations_scoreTable"]')) return true;

        const start = round.startTime ? Date.parse(round.startTime) / 1000 : null;
        const max   = response.options?.maxRoundTime || null;
        if (start && max) {
            const now = Date.now() / 1000;
            if (now >= start + max) return true;
        }
        return false;
    }

    function processFirstGuesses(response) {
        const roundNumber = response.currentRoundNumber;
        if (!roundNumber) return;
        if (roundTimedOutOrScoringVisible(response)) return; // don’t banner post-timeout

        // Reset tracking when the round advances
        if (roundNumber !== lastProcessedRound) {
            lastProcessedRound = roundNumber;
            latestEarlyNo5k = { blue: false, red: false };
            announcedRoundBySide = { blue: 0, red: 0 };
            queuedPenalty = { blue: null, red: null };
            lastFlushedRound = 0;
            document.body.removeAttribute('data-pp-blue-punished');
            document.body.removeAttribute('data-pp-red-punished');
        }

        const roundObj = (response.rounds || []).find(r => r.roundNumber === roundNumber);
        const startSec       = roundObj?.startTime ? Date.parse(roundObj.startTime) / 1000 : null;
        const maxRoundTime   = response.options?.maxRoundTime ?? null;
        const timeAfterGuess = response.options?.roundTime ?? null;
        const windowStartSec = (startSec != null && maxRoundTime != null && timeAfterGuess != null)
        ? startSec + (maxRoundTime - timeAfterGuess)
        : null;

        const allGuesses = [];
        (response.teams || []).forEach(team => {
            (team.players || []).forEach(p => {
                (p.guesses || []).forEach(g => {
                    if (g.roundNumber === roundNumber && g.created) {
                        allGuesses.push({ createdSec: new Date(g.created).getTime()/1000, playerId: p.playerId });
                    }
                });
            });
        });
        if (!allGuesses.length) return;
        allGuesses.sort((a,b)=>a.createdSec-b.createdSec);
        const globalFirstTime = allGuesses[0].createdSec;

        const isFiveK = (distance) => {
            const E = response.options?.map?.maxErrorDistance || 1;
            let score = Math.round(5000 * Math.exp(-10 * distance / E)) || 0;
            if (distance < 25) score = 5000;
            return score === 5000;
        };

        (response.teams || []).forEach((team, tIdx) => {
            const side = (tIdx === 0 ? 'blue' : 'red');
            if (announcedRoundBySide[side] === roundNumber) return; // one banner per side per round

            // Team’s earliest guess
            let earliest = null;
            (team.players || []).forEach(p => {
                (p.guesses || []).forEach(g => {
                    if (g.roundNumber === roundNumber && g.created) {
                        const t = new Date(g.created).getTime()/1000;
                        if (!earliest || t < earliest.createdSec) {
                            earliest = { createdSec: t, distance: g.distance ?? null, playerId: p.playerId };
                        }
                    }
                });
            });
            if (!earliest || earliest.distance == null) return;

            const EPS = 0.0005;
            const isFirstLock = Math.abs(earliest.createdSec - globalFirstTime) <= EPS;
            const isEarly = isFirstLock && (
                windowStartSec != null ? (earliest.createdSec < windowStartSec) : true
            );

            const nick = userNameMap[earliest.playerId] || 'Guest';

            showFirstGuessBanner({ team: side, nick, variant: 'lockedin' });
            announcedRoundBySide[side] = roundNumber;

            if (isEarly && !isFiveK(earliest.distance)) {
                queuedPenalty[side] = { nick, round: roundNumber, t: earliest.createdSec };
            }
        });
    }

    function flushQueuedPenaltiesWhenScoringVisible(response) {
        const rn = response.currentRoundNumber;
        if (!rn || lastFlushedRound === rn) return;

        const round = (response.rounds || []).find(r => r.roundNumber === rn);
        const scoringShown = document.querySelector('div[class*="round-score-animations_scoreTable"]');
        if (!(round?.hasProcessedRoundTimeout || scoringShown)) return;

        const qb = queuedPenalty.blue;
        const qr = queuedPenalty.red;
        let penalSide = null;

        if (qb && qb.round === rn && qr && qr.round === rn) {
            // both queued → penalize the earliest
            penalSide = (qb.t <= qr.t) ? 'blue' : 'red';
        } else if (qb && qb.round === rn) {
            penalSide = 'blue';
        } else if (qr && qr.round === rn) {
            penalSide = 'red';
        }

        if (penalSide) {
            latestEarlyNo5k[penalSide] = true;
            document.body.setAttribute(`data-pp-${penalSide}-punished`, '1');
            const q = queuedPenalty[penalSide];
            showFirstGuessBanner({ team: penalSide, nick: q.nick, variant: 'penalized' });
        }

        queuedPenalty.blue = null;
        queuedPenalty.red  = null;

        tryOverrideRoundResultScores();
        lastFlushedRound = rn;
    }


    function tryOverrideRoundResultScores() {
        if (!latestEarlyNo5k.blue && !latestEarlyNo5k.red) return;

        const LEFT_COLS  = document.querySelectorAll('div[class*="round-score-animations_scoreColumnLeft"]');
        const RIGHT_COLS = document.querySelectorAll('div[class*="round-score-animations_scoreColumnRight"]');

        const zeroColumnNumbers = (colEl) => {
            if (!colEl) return;

            colEl.querySelectorAll('div[class*="static"] div[class*="shadow-text_root"]')
                .forEach(n => { n.textContent = '0'; });

            colEl.querySelectorAll('div[class*="scoreContainer"] > div:not([class*="damage"])')
                .forEach(n => { n.textContent = '0'; });
            colEl.querySelectorAll('div[class*="scoreContainer"] div[class*="shadow-text_root"]:not(div[class*="damage"] *)')
                .forEach(n => { n.textContent = '0'; });

            colEl.querySelectorAll('div[class*="damage"] div[class*="shadow-text_root"]')
                .forEach(n => { n.textContent = '0'; });
        };

        const applyForSide = (cols, sideKey) => {
            if (!latestEarlyNo5k[sideKey]) return;
            cols.forEach(zeroColumnNumbers);
        };

        applyForSide(LEFT_COLS,  'blue');
        applyForSide(RIGHT_COLS, 'red');

        if (!document.body.__pp_rezero_scheduled) {
            document.body.__pp_rezero_scheduled = true;
            setTimeout(() => {
                try {
                    const L = document.querySelectorAll('div[class*="round-score-animations_scoreColumnLeft"]');
                    const R = document.querySelectorAll('div[class*="round-score-animations_scoreColumnRight"]');
                    applyForSide(L, 'blue');
                    applyForSide(R, 'red');
                } finally {
                    document.body.__pp_rezero_scheduled = false;
                }
            }, 120); 
        }
    }

    const updateActiveRoundBackground = () => {
        let bgUrl = "https://i.imgur.com/mPr3kLz.png"; // default background
        if (leftScore >= winThreshold || rightScore >= winThreshold) {
            bgUrl = "https://i.imgur.com/mPr3kLz.png";
        }
        else if (leftScore >= winThreshold - 2 && rightScore >= winThreshold - 2) {
            bgUrl = "https://i.imgur.com/7CRPEfG.png";
        }
        else if (leftScore >= winThreshold - 2) {
            bgUrl = "https://i.imgur.com/QOGqB12.png";
        }
        else if (rightScore >= winThreshold - 2) {
            bgUrl = "https://i.imgur.com/wUvmJ71.png";
        }
        const activeRoundElem = document.querySelector(".views_activeRoundWrapper__1_J5M");
        if (activeRoundElem) {
            activeRoundElem.style.setProperty("background-image", `url('${bgUrl}')`, "important");
            activeRoundElem.style.setProperty("background-position", "center", "important");
            activeRoundElem.style.setProperty("background-size", "cover", "important");
            activeRoundElem.style.setProperty("background-repeat", "no-repeat", "important");
        }
    };

    async function fetchDuelData() {
        const duelId = location.pathname.split("/")[2];
        if (!duelId) return;

        if (gameOver) {
            if (duelId !== currentDuel) {
                gameOver = false;
            } else {
                return;
            }
        }
        currentDuel = duelId;

        const res = await fetch(
          `https://game-server.geoguessr.com/api/duels/${duelId}/spectate`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        updateActiveRoundBackground();
        const {
            forbidMoving,
            forbidZooming,
            forbidRotating
        } = data.options.movementOptions;

        movementAllowed = !(forbidMoving || forbidZooming || forbidRotating);

        setKillAnimEnabled(movementAllowed);

        if (!movementAllowed) {
            return;
        }

        const allPlayers = data.teams.flatMap(t => t.players);
        await Promise.all(allPlayers.map(async p => {
          if (userNameMap[p.playerId]) return;
          try {
            const r = await fetch(
              `https://www.geoguessr.com/api/v3/users/${p.playerId}`,
              { credentials: "include" }
            );
            if (!r.ok) throw new Error("not-found");
            const u = await r.json();
            userNameMap[p.playerId] = u.nick;
          } catch {
            // guest or missing account → safe default
            userNameMap[p.playerId] = "Guest";
          }
        }));

        updateScores(data);
        processFirstGuesses(data);
        flushQueuedPenaltiesWhenScoringVisible(data); // ← add this
    }


    const observer = new MutationObserver(() => {
        requestAnimationFrame(modifyHealthBars);
        requestAnimationFrame(tryOverrideRoundResultScores);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (location.href.includes("duels")) {
        fetchDuelData();
    }

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
    }, 2000);

})();