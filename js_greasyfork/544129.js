// ==UserScript==
// @name         Asymmetrical Multis
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Modifies multipliers in duels
// @match        https://www.geoguessr.com/*
// @license      MIT
// @require      https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @downloadURL https://update.greasyfork.org/scripts/544129/Asymmetrical%20Multis.user.js
// @updateURL https://update.greasyfork.org/scripts/544129/Asymmetrical%20Multis.meta.js
// ==/UserScript==

(function() {

    'use strict';

    let maxHealth = 6000;
    let leftHealth = 0, rightHealth = 0;
    let leftMultis = 1, rightMultis = 1;
    let gameOver = false; // Flag to ensure the end screen is only shown once
    let currentDuel = false; // Flag to ensure the end screen is only shown once

    const multisHTML = '<div class="hud_specialRound__ZTi3q"><div class="round-icon_container__5WOtO"><svg class="round-icon_svg__MPwhu" width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M41.1795 10.0208L24.8205 0.776141C23.0577 -0.258714 20.9423 -0.258714 19.1795 0.776141L2.82051 10.0208C1.05769 10.9867 0 12.7805 0 14.7812V33.2706C0 35.2023 1.05769 37.065 2.82051 38.0309L19.1795 47.2756C20.9423 48.2415 23.0577 48.2415 24.8205 47.2756L41.1795 38.0309C42.9423 37.065 44 35.2713 44 33.2706V14.7812C44 12.8494 42.9423 10.9867 41.1795 10.0208ZM38.534 11.7682L24.4315 3.67912C22.9118 2.77363 21.0882 2.77363 19.5685 3.67912L5.46596 11.7682C3.94629 12.6134 3.03448 14.1829 3.03448 15.9335V32.1118C3.03448 33.802 3.94629 35.4319 5.46596 36.277L19.5685 44.3662C21.0882 45.2113 22.9118 45.2113 24.4315 44.3662L38.534 36.277C40.0537 35.4319 40.9655 33.8624 40.9655 32.1118V15.9335C40.9655 14.2433 40.0537 12.6134 38.534 11.7682Z" fill="#1A1A2E" fill-opacity="0.8"></path><path d="M24.4314 3.67912L38.534 11.7682C40.0537 12.6134 40.9655 14.2433 40.9655 15.9335V32.1118C40.9655 33.8624 40.0537 35.4319 38.534 36.277L24.4314 44.3662C22.9117 45.2113 21.0881 45.2113 19.5685 44.3662L5.4659 36.277C3.94623 35.4319 3.03442 33.802 3.03442 32.1118V15.9335C3.03442 14.1829 3.94623 12.6134 5.4659 11.7682L19.5685 3.67912C21.0881 2.77363 22.9117 2.77363 24.4314 3.67912Z" fill="#1A1A2E"></path></svg><div class="round-icon_text__oCPD3 round-icon_multiplierSmall__LEphN"><p>1x</p></div></div></div>';

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

    const replaceHealthDisplays = () => {
        let healthBars = document.querySelectorAll("." + cn("health-bar-2_healthBarSection__"));
        if (document.querySelectorAll("." + cn("round-icon_text__")).length > 0) return;
        let leftMultis = document.createElement("div");
        leftMultis.innerHTML = multisHTML;
        leftMultis.style.position = "relative";
        let rightMultis = leftMultis.cloneNode(true);
        leftMultis.style.left = "1rem";
        rightMultis.style.right = "1rem";
        healthBars[0].appendChild(leftMultis);
        healthBars[1].appendChild(rightMultis);
    }

    // Update score display divs.
    const updateHealthDisplays = () => {
        replaceHealthDisplays();
        let healthLabels = document.querySelectorAll("." + cn("health-bar-2_barLabel__"));
        let healthBars = document.querySelectorAll("." + cn("health-bar-2_bar__"));
        healthLabels[0].firstChild.textContent = leftHealth;
        healthLabels[1].firstChild.textContent = rightHealth;
        healthBars[0].style.transform = `translate3d(-${Math.round((maxHealth-leftHealth)/maxHealth*1000)/10}%, 0px, 0px)`;
        healthBars[1].style.transform = `translate3d(${Math.round((maxHealth-rightHealth)/maxHealth*1000)/10}%, 0px, 0px)`;
        if (leftHealth < maxHealth/2) healthBars[0].classList.add('health-bar-2_isWarning__ikFdk'); else healthBars[0].classList.remove('health-bar-2_isWarning__ikFdk');
        if (leftHealth < maxHealth/6) healthBars[0].classList.add('health-bar-2_isDanger__ccopY'); else healthBars[0].classList.remove('health-bar-2_isDanger__ccopY');
        if (rightHealth < maxHealth/2) healthBars[1].classList.add('health-bar-2_isWarning__ikFdk'); else healthBars[1].classList.remove('health-bar-2_isWarning__ikFdk');
        if (rightHealth < maxHealth/6) healthBars[1].classList.add('health-bar-2_isDanger__ccopY'); else healthBars[1].classList.remove('health-bar-2_isDanger__ccopY');
        let multiValues = document.querySelectorAll("." + cn("round-icon_text__"));
        multiValues[0].firstChild.textContent = leftMultis + 'x';
        multiValues[1].firstChild.textContent = rightMultis + 'x';
    };

    // Create and display the end screen overlay.
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

        const winnerText = (leftHealth > 0) ? "YOU WIN THE GAME!" : "OPPONENT WINS THE GAME!";

        const winnerElem = document.createElement("div");
        winnerElem.innerText = winnerText;
        winnerElem.style.cssText = `
            font-size: 72pt;
            margin-bottom: 20px;
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
        overlay.appendChild(messageElem);
        overlay.appendChild(button);
        document.body.appendChild(overlay);
    };


const updateScores = (response) => {
    const multiIncrement = response.options.multiplierIncrement / 10;
    maxHealth = response.options.initialHealth;
    let team0Health = maxHealth, team1Health = maxHealth;
    let team0Multis = 1, team1Multis = 1;
    leftHealth = maxHealth;
    rightHealth = maxHealth;

    if (response.teams && response.teams.length >= 2) {
        const loggedInUserId = getLoggedInUserId();
        const teamIndex = getLoggedInUserTeamIndex(response.teams, loggedInUserId);

        for (let i = 0; i < response.currentRoundNumber && team0Health > 0 && team1Health > 0; i++) {
            if (!response.rounds[i].hasProcessedRoundTimeout) continue;

            let team0RoundScore = 0, team1RoundScore = 0;
            team0RoundScore = response.teams[0].roundResults[i].bestGuess?.score;
            team1RoundScore = response.teams[1].roundResults[i].bestGuess?.score;
            if (!team0RoundScore) team0RoundScore = 0;
            if (!team1RoundScore) team1RoundScore = 0;

            let damage = Math.round((team0RoundScore - team1RoundScore) * team0Multis, 2);
            if (team0RoundScore > team1RoundScore) {
                team1Health = Math.max(0, team1Health - damage);
                /*if (2*team0RoundScore - 5000 > team1RoundScore)*/ team0Multis = Math.round((team0Multis + multiIncrement) * 10) / 10;
            } else if (team1RoundScore > team0RoundScore) {
                damage = Math.round((team1RoundScore - team0RoundScore) * team1Multis, 2);
                team0Health = Math.max(0, team0Health - damage);
                /*if (2*team1RoundScore - 5000 > team0RoundScore)*/ team1Multis = Math.round((team1Multis + multiIncrement) * 10) / 10;
            }
        }

        if (teamIndex === 0) {
            leftHealth = team0Health;
            rightHealth = team1Health;
            leftMultis = team0Multis;
            rightMultis = team1Multis;
        } else if (teamIndex === 1) {
            leftHealth = team1Health;
            rightHealth = team0Health;
            leftMultis = team1Multis;
            rightMultis = team0Multis;
        } else {
            leftHealth = team0Health;
            rightHealth = team1Health;
            leftMultis = team0Multis;
            rightMultis = team1Multis;
        }
        if (!gameOver && (leftHealth === 0 || rightHealth === 0)) {
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

        updateHealthDisplays();

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