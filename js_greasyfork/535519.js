// ==UserScript==
// @name         Pinpointing Duels (5 Rounds)
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Hide health bars, insert score divs, update scores with improved performance, custom tie-breaking, auto-activation on URL change, update round header, and display an end screen for best-of-13 games. Recommended settings: 15 round max, 1m30s round timer, 60s guess timer, 10000000 max health, no damage multipliers, no healing round
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/2Rz2axY.png
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @downloadURL https://update.greasyfork.org/scripts/535519/Pinpointing%20Duels%20%285%20Rounds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535519/Pinpointing%20Duels%20%285%20Rounds%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    // Return one of: "YOU WIN THE ROUND", "OPPONENT WINS THE ROUND", or "TIE" for the last completed round.
    const getRoundWinnerText = (response) => {
        if (!response.teams || response.teams.length < 2 || response.currentRoundNumber < 1) {
            return "";
        }
        const roundIndex = response.currentRoundNumber - 1;
        const team0Score = response.teams[0]?.roundResults?.[roundIndex]?.score || 0;
        const team1Score = response.teams[1]?.roundResults?.[roundIndex]?.score || 0;
        let winningTeam = null;
        if (team0Score > team1Score) {
            winningTeam = 0;
        } else if (team1Score > team0Score) {
            winningTeam = 1;
        } else if (team0Score === 5000) {
            const team0Time = response.teams[0]?.roundResults?.[roundIndex]?.bestGuess?.created || Infinity;
            const team1Time = response.teams[1]?.roundResults?.[roundIndex]?.bestGuess?.created || Infinity;
            if (team0Time < team1Time) {
                winningTeam = 0;
            } else if (team1Time < team0Time) {
                winningTeam = 1;
            }
        }
        const loggedInUserId = getLoggedInUserId();
        const userTeamIndex = getLoggedInUserTeamIndex(response.teams, loggedInUserId);
        if (winningTeam === null) {
            return "TIE";
        } else if (winningTeam === userTeamIndex) {
            if (leftScore == 4 || rightScore == 4) {
                return "YOU WIN THE ROUND! MATCH POINT!";
            }
            else {
                return "YOU WIN THE ROUND!"
            }
        } else {
            if (leftScore == 4 || rightScore == 4) {
                return "OPPONENT WINS THE ROUND! MATCH POINT!";
            }
            else {
                return "OPPONENT WINS THE ROUND!"
            }
        }
    };

    // Remove unwanted UI elements and ensure our score display exists.
    const modifyHealthBars = () => {
        const healthContainer = document.querySelector("." + cn("hud_root__"));
        if (!healthContainer) return;
        document.querySelectorAll('[class*="health-bar_barInner__"]').forEach(bar => bar.style.display = "none");
        document.querySelectorAll('[class*="health-bar_slant__"]').forEach(slant => slant.style.display = "none");
        document.querySelectorAll("." + cn("health-bar_playerContainer__")).forEach(container => container.style.top = "0.5rem");
        document.querySelectorAll("." + cn("health-bar_container__")).forEach(container => container.style.setProperty("--bar-container-width", "15rem"));
        document.querySelectorAll("." + cn("health-bar_barInnerContainer__")).forEach(container => container.style.background = "none");
        if (!document.getElementById("leftScore") || !document.getElementById("rightScore")) {
            createScoreDisplays();
        }
    };

    // Create score display divs.
    const createScoreDisplays = () => {
        const hudRoot = document.querySelector("." + cn("hud_root__"));
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
                background: linear-gradient(180deg,rgba(131,125,187,.6),rgba(131,125,187,0) 75%),#3c2075;
                border-radius: 5px;
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

    // Create and display the end screen overlay.
    const showEndScreen = () => {
        const overlay = document.createElement("div");
        overlay.id = "endScreenOverlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: linear-gradient(180deg,rgba(6,43,20,1),rgba(11,65,43,1) 95%),#062b14;
            color: #5adb95;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            text-align: center;
        `;
        const winnerText = (leftScore >= 5) ? "YOU WIN THE GAME!" : "OPPONENT WINS THE GAME!";
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
        messageElem.innerText = "Please guess Antarctica for the remaining rounds so the game is saved and you get a summary link.";
        messageElem.style.cssText = `
            font-size: 24pt;
            margin-bottom: 20px;
            color: white;
        `;

        const button = document.createElement("button");
        button.innerText = "Okay";
        button.className = cn("button_button__") + " " + cn("button_variantPrimary__"); // Add the classes
        button.addEventListener("click", () => {
            overlay.remove();
        });

        overlay.appendChild(winnerElem);
        overlay.appendChild(scoreElem);
        overlay.appendChild(messageElem);
        overlay.appendChild(button);
        document.body.appendChild(overlay);
    };

    // Update cumulative scores and update round header text.
    const updateScores = (response) => {
        let newTeam0Score = 0, newTeam1Score = 0;
        if (response.teams && response.teams.length >= 2) {
            for (let i = 0; i < response.currentRoundNumber; i++) {
                const team0RoundScore = response.teams[0]?.roundResults?.[i]?.score || 0;
                const team1RoundScore = response.teams[1]?.roundResults?.[i]?.score || 0;
                if (team0RoundScore > team1RoundScore) {
                    newTeam0Score++;
                } else if (team1RoundScore > team0RoundScore) {
                    newTeam1Score++;
                } else if (team0RoundScore === 5000) {
                    const team0Time = response.teams[0]?.roundResults?.[i]?.bestGuess?.created || Infinity;
                    const team1Time = response.teams[1]?.roundResults?.[i]?.bestGuess?.created || Infinity;
                    if (team0Time < team1Time) {
                        newTeam0Score++;
                    } else if (team1Time < team0Time) {
                        newTeam1Score++;
                    }
                }
            }
            const loggedInUserId = getLoggedInUserId();
            const teamIndex = getLoggedInUserTeamIndex(response.teams, loggedInUserId);
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

            const leftScoreEl = document.getElementById("leftScore");
            const rightScoreEl = document.getElementById("rightScore");
            if (leftScoreEl) leftScoreEl.innerText = leftScore;
            if (rightScoreEl) rightScoreEl.innerText = rightScore;

            const roundHeader = document.querySelector("." + cn("round-score-header_roundNumber__"));
            if (roundHeader) {
                roundHeader.innerText = getRoundWinnerText(response);
            }

            // Check for game over condition (first to 5 wins in a best-of-13 game)
            if (!gameOver && (leftScore >= 5 || rightScore >= 5)) {
                gameOver = true;
                showEndScreen();
            }
        }
    };

    const fetchDuelData = () => {
        const duelId = location.pathname.split("/")[2];
        if (!duelId) return;

        if (gameOver)
        {
            if(duelId != currentDuel) {
                gameOver = false
            }
            else {
                return
            }
        }

        currentDuel = duelId
        fetch(`https://game-server.geoguessr.com/api/duels/${duelId}`, { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(updateScores)
            .catch(err => {});
    };

    const observer = new MutationObserver(() => {
        requestAnimationFrame(modifyHealthBars);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (location.href.includes("/duels/")) {
        scanStyles().then(_ => {
            fetchDuelData();
        });
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
            scanStyles().then(_ => {
                fetchDuelData();
                modifyHealthBars();
            });
        }
    });
    setInterval(() => {
        if (location.href.includes("/duels/")) {
            scanStyles().then(_ => {
                fetchDuelData();
            });
        }
    }, 5000);
})();