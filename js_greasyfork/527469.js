// ==UserScript==
// @name         Pinpointing Duels
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  The script that makes pinpointing matter. Read more at the GeoClassics discord server or check out Pinpointing Tournaments on twitch.tv/GeoClassics.
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/eKp3nIa.png
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527469/Pinpointing%20Duels.user.js
// @updateURL https://update.greasyfork.org/scripts/527469/Pinpointing%20Duels.meta.js
// ==/UserScript==

(function() {

    let movementAllowed = false;

    GM_registerMenuCommand("Settings", showSettingsPanel);

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

        // FIRST TO
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

    // Resolve a *single* CSS-module class by prefix
    function cn(prefix) {
      const el = document.querySelector(`[class^="${prefix}"]`);
      if (!el) return prefix; // fallback so code doesn't crash
      const cls = [...el.classList].find(c => c.startsWith(prefix));
      return cls || prefix;
    }

    function onDuelsUIReady(cb) {
      if (q("duels_hud__")) return cb();
      const obs = new MutationObserver(() => {
        if (q("duels_hud__")) { obs.disconnect(); cb(); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Shorthands for querying with module prefixes
    const q  = (pref, root = document) => root.querySelector(`[class^="${pref}"]`);
    const qa = (pref, root = document) => root.querySelectorAll(`[class^="${pref}"]`);

    // Match either of multiple prefixes
    const qAny  = (prefs, root = document) => root.querySelector(prefs.map(p => `[class^="${p}"]`).join(','));
    const qaAny = (prefs, root = document) => root.querySelectorAll(prefs.map(p => `[class^="${p}"]`).join(','));


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

    function getRoundHeaderContainer() {
      return qAny([
        "damage-animation_root__",
        "round-score-header_roundNumber__"
      ]);
    }

    function getHudMountRoot() {
      return document.body; // had to fallback to body cause the disappearing divs are not suitable
    }

    function mountWithAnchor(wrapper, anchor) {
      const mount = getHudMountRoot();
      mount.appendChild(wrapper);

      const mo = new MutationObserver(() => {
        if (!anchor.isConnected) {
          wrapper.remove();
          mo.disconnect();
        }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    function showResultDisplay(message) {

      const anchor = q("damage-animation_root__");
      if (!anchor) return;

      if (document.getElementById("roundDisplayMessage")) return;

      const wrapper = document.createElement("div");
      wrapper.id = "roundDisplayMessage";
      wrapper.innerHTML = `
        <div style="
          position: fixed; left: 50%; transform: translateX(-50%);
          top: 35%; padding: 16px 20px; font-size: 24px; line-height: 24px;
          text-align: center; color: #f2f2f2;
          background: linear-gradient(180deg,#322a6a 0%, #594eaf 100%);
          border: 7px solid #8f86e6;
          border-radius: 8px;
          box-shadow: 0 2px 0 rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.08);
          z-index: 9998;
        ">${message}</div>
      `;

      mountWithAnchor(wrapper, anchor);
    }

    function showPenaltyDisplay(message) {
      const anchor = q("damage-animation_root__");
      if (!anchor) return;

      if (document.getElementById("roundDisplayPenalty")) return;

      const wrapper = document.createElement("div");
      wrapper.id = "roundDisplayPenalty";
      wrapper.innerHTML = `
        <div style="
          position: fixed; left: 50%; transform: translateX(-50%);
          top: 55%; padding: 16px 20px; font-size: 24px; line-height: 24px;
          text-align: center; color: #f2f2f2;
          background: linear-gradient(180deg, #322a6a 0%, #594eaf 100%);
          border: 7px solid #8f86e6;
          border-radius: 8px;
          box-shadow: 0 2px 0 rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.08);
          z-index: 9998;
        ">SCORE 0 FOR GUESSING EARLY AND MISSING 5K: ${message}</div>
      `;

      mountWithAnchor(wrapper, anchor);
    }

    'use strict';

    let firstTo = GM_getValue('firstTo', 10); // Fallback 10
    let winThreshold = firstTo; //Win Value
    let tieRange = GM_getValue('tieRange', 0);

    let leftScore = 0, rightScore = 0;
    let gameOver = false; // Flag to ensure the end screen is only shown once
    let currentDuel = false; // Flag to ensure the end screen is only shown once

    // Extract the logged-in player's ID from __NEXT_DATA__
    const getLoggedInUserId = () => {
        const element = document.getElementById("__NEXT_DATA__");
        if (!element) return null;
        let exto = JSON.parse(element.innerText).props.accountProps.account.user.userId

        return exto;
    };

    // Determine which team (0 or 1) the logged-in user belongs to.
    const getLoggedInUserTeamIndex = (teams, loggedInUserId) => {
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].players && teams[i].players.some(player => player.playerId === loggedInUserId)) {
                return i;
            }
        }
        return null;
    };

    function modifyHealthBars() {
        if (!movementAllowed) return;

        const healthContainer = qAny(["hud-2_healthBars__", "hud_healthBars__"]);
        if (!healthContainer) return;


        qaAny([
            "health-bar-2_barContainer__",
            "health-bar-2_barSkewContainer__",
            "health-bar-2_barBackground__",
            "health-bar-2_bar__",
            "health-bar-2_barLabel__"

        ]).forEach(el => el && el.style.setProperty("display", "none", "important"));


        qaAny(["health-bar-2_barInnerContainer__", "health-bar_barInnerContainer__"])
            .forEach(c => c && (c.style.background = "none"));


        qaAny([
            "health-bar-2_playerContainer__", // legacy
            "health-bar_playerContainer__",   // legacy
            "health-bar-2_nickContainer__"    // current
        ]).forEach(c => {
            if (!c) return;
            c.style.top = "0.5rem";
            c.style.marginTop = "0.5rem";
        });

        if (!document.getElementById("leftScore") || !document.getElementById("rightScore")) {
            createScoreDisplays();
        }
    }

    // Create score display divs.
    const createScoreDisplays = () => {
        const hudRoot = q("duels_hud__");
        if (!hudRoot) return;
        const createScoreDiv = (id, position) => {
            const div = document.createElement("div");
            div.id = id;
            div.innerText = (id === "leftScore") ? leftScore : rightScore;
            div.style.cssText = `
                padding: 10px 20px;
                font-size: 36px;
                font-weight: bold;
                color: white;
                background: linear-gradient(180deg,#322a6a 0%, #594eaf 100%);
                border: 7px solid #8f86e6;
                border-radius: 8px;
                text-align: center;
                margin: 5px;
                position: absolute;
                top: 20px;
                ${position}: 320px;
                z-index: 1000;
            `;
            return div;
        };
        hudRoot.appendChild(createScoreDiv("leftScore", "left"));
        hudRoot.appendChild(createScoreDiv("rightScore", "right"));
    };

    const showEndScreen = () => {
        const overlay = document.createElement("div");
        overlay.id = "endScreenOverlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: linear-gradient(180deg,rgba(44,44,44,1),rgba(55,55,55,1) 95%),#555;
            color: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            text-align: center;
        `;
        const winnerText = (leftScore >= winThreshold) ? "YOU WIN THE GAME!" : "OPPONENT WINS THE GAME!";
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
        messageElem.innerText = "Guess Antarctica for the remaining rounds if you need to get a summary link.";
        messageElem.style.cssText = `
            font-size: 24pt;
            margin-bottom: 20px;
            color: white;
        `;

        const button = document.createElement("button");
        button.innerText = "Okay";
        button.setAttribute("style", `
          background-image: linear-gradient(rgb(151, 232, 81), rgb(71, 148, 64));
          border-radius: 60px;
          box-shadow: rgba(0, 0, 0, 0.25) 0px 4.4px 18px 0px,
                      rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset,
                      rgba(0, 0, 0, 0.3) 0px -2px 0px 0px inset;
          color: rgb(255, 255, 255);
          cursor: pointer;
          display: inline-block;
          font-family: ggFont, sans-serif;
          font-style: italic;
          font-weight: 700;
          font-size: 14px;
          height: 44px;
          margin-top: 4px;
          padding: 0 12px;
          position: relative;
          text-align: center;
          text-shadow: rgb(23, 18, 53) 0px 1px 2px;
          text-transform: uppercase;
          transition: transform 0.15s ease, background 0.15s ease;
          user-select: none;
          width: 65px;
          -webkit-font-smoothing: antialiased;
        `);
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
            scoreElement.style.background = (flashCount % 2 === 0) ? flashBackground : originalBackground;
            flashCount++;
            if (flashCount >= 10) {
                clearInterval(interval);
                scoreElement.style.background = originalBackground;
            }
        }, 500);
    };

    const updateScores = (response) => {
        let team0Score = 0, team1Score = 0;
        let newTeam0Score = 0, newTeam1Score = 0;
        let tieDistance = 0;
        const timeAfterGuess = response.options.roundTime;
        const maxRoundTime = response.options.maxRoundTime;

        if (response.teams && response.teams.length >= 2) {
            const loggedInUserId = getLoggedInUserId();
            const teamIndex = getLoggedInUserTeamIndex(response.teams, loggedInUserId);

            for (let i = 0; i < response.currentRoundNumber && newTeam0Score < winThreshold && newTeam1Score < winThreshold; i++) {
                if (!response.rounds[i].hasProcessedRoundTimeout) continue;
                const oldDisplayMessage = document.getElementById("roundDisplayMessage");
                if (oldDisplayMessage) oldDisplayMessage.remove();
                const oldPenaltyMessage = document.getElementById("roundDisplayPenalty");
                if (oldPenaltyMessage) oldPenaltyMessage.remove();
                let message = '', tieMessage = '', winMessage = '';

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
                    showPenaltyDisplay(teamIndex === 0 ? "YOU" : "YOUR OPPONENT");
                    team0RoundScore = 0;
                } else if (team1RoundScore < 5000 && team1Time < team0Time && team1Time < (roundStartTime + maxRoundTime - timeAfterGuess)) {
                    showPenaltyDisplay(teamIndex === 1 ? "YOU" : "YOUR OPPONENT");
                    team1RoundScore = 0;
                } // Score counted as 0 if penalty for early sending

                team0Score = newTeam0Score; team1Score = newTeam1Score;
                const highestScore = team0RoundScore > team1RoundScore ? team0RoundScore : team1RoundScore;
                if (tieRange > 0) tieDistance = Math.floor((5000 - highestScore) / tieRange);

                if (team0RoundScore === 5000 && team1RoundScore === 5000) {
                    if (team0Time < team1Time) newTeam0Score++;
                    else if (team1Time < team0Time) newTeam1Score++;
                    message = `1 POINT FOR FASTEST 5k`;
                } else if (team0RoundScore == 5000 || team1RoundScore == 5000) {
                     if (team0RoundScore == 5000) newTeam0Score += 2; else newTeam1Score += 2;
                    message = `2 POINTS FOR SOLO 5K`;
                } else if (team0RoundScore > team1RoundScore + tieDistance || team1RoundScore > team0RoundScore + tieDistance) {
                    if (team0RoundScore > team1RoundScore + tieDistance) newTeam0Score++; else newTeam1Score ++;
                    message = `1 POINT FOR CLOSEST GUESS`;
                    if (tieRange>0) tieMessage = `<br><span style="font-size: 14px;">TIE RANGE: ${tieDistance} POINTS</span>`;
                } else {
                    message = `TIE!`;
                    if (tieRange>0) tieMessage = `<br><span style="font-size: 14px;">TIE RANGE: ${tieDistance} POINTS</span>`;
                }
                if (message !== `TIE!`) winMessage = (teamIndex === 0) === (newTeam0Score > team0Score) ? "YOU WIN THE ROUND! <br>" : "YOUR OPPONENT WINS THE ROUND! <br>";
                const isMatchPoint = newTeam0Score >= winThreshold - 2 || newTeam1Score >= winThreshold - 2;
                showResultDisplay(`${winMessage} ${message} ${isMatchPoint ? "<br>MATCH POINT!" : "" } ${tieMessage}`);
            }

            const leftScoreChanged = (teamIndex === 0 ? newTeam0Score !== leftScore : newTeam1Score !== leftScore);
            const rightScoreChanged = (teamIndex === 0 ? newTeam1Score !== rightScore : newTeam0Score !== rightScore);

            if (teamIndex === 0) {
                leftScore = newTeam0Score;
                rightScore = newTeam1Score;
            } else if (teamIndex === 1) {
                leftScore = newTeam1Score;
                rightScore = newTeam0Score;
            } else {
                leftScore = newTeam0Score;
                rightScore = newTeam1Score;
            }
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
          `https://game-server.geoguessr.com/api/duels/${duelId}`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        const {
            forbidMoving,
            forbidZooming,
            forbidRotating
        } = data.options.movementOptions;

        movementAllowed = !(forbidMoving || forbidZooming || forbidRotating);

        if (!movementAllowed) {
            return;
        }

        modifyHealthBars();

        updateScores(data);
    }

    if (location.href.includes("/duels/")) {
        onDuelsUIReady(fetchDuelData);
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
        if (location.href.includes("/duels/")) {
            onDuelsUIReady(fetchDuelData);
        }
    });
    setInterval(() => {
        if (location.href.includes("/duels/")) {
            onDuelsUIReady(fetchDuelData);
        }
    }, 2500);

        if (location.href.includes("/team-duels/")) {
        onDuelsUIReady(fetchDuelData);
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
        if (location.href.includes("/team-duels/")) {
            onDuelsUIReady(fetchDuelData);
        }
    });
    setInterval(() => {
        if (location.href.includes("/team-duels/")) {
            onDuelsUIReady(fetchDuelData);
        }
    }, 2500);

})();