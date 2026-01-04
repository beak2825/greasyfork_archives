// ==UserScript==
// @name         Klavia Race Logger
// @version      2024-03-30
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @description  Logs Klavia Races
// @match        *://*.ntcomps.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
  const script = document.createElement("script");
  script.textContent = `
    (function () {
      const STORAGE_KEY = "klaviaRaceHistory";
      const seenRaceIDs = new Set();

     const estimatePoints = (wpm, accuracy) => Math.round(Math.pow(wpm, 1) * Math.pow(accuracy, 2.5) * 0.000027);

      function loadRaceHistory() {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
          return [];
        }
      }

      function saveRaceHistory(history) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }

      function attachRaceLogger(ws) {
        ws.addEventListener("message", (event) => {
          let parsed;
          try {
            parsed = JSON.parse(event.data);
          } catch {
            return;
          }

          const identifier = parsed.identifier ? JSON.parse(parsed.identifier) : {};
          const msg = parsed.message;

          if (
            identifier.channel === "RaceChannel" &&
            msg?.message === "update_race_results" &&
            msg?.textCompleted === true &&
            msg?.raceId &&
            !seenRaceIDs.has(msg.raceId)
          ) {
            seenRaceIDs.add(msg.raceId);

            const raceData = {
              raceId: msg.raceId,
              points: estimatePoints(msg.wpm, parseFloat(msg.accuracy)),
              wpm: msg.wpm,
              accuracy: parseFloat(msg.accuracy),
              raceSeconds: msg.raceSeconds,
              textSeconds: msg.textSeconds,
              boostBonus: msg.boostBonus,
              timestamp: new Date().toISOString(),
            };

            const history = loadRaceHistory();
            history.unshift(raceData);
            saveRaceHistory(history);
          }
        });
      }

      const originalWS = window.WebSocket;
      window.WebSocket = new Proxy(originalWS, {
        construct(target, args) {
          const ws = new target(...args);
          attachRaceLogger(ws);
          return ws;
        }
      });
    })();
  `;
  document.documentElement.appendChild(script);
})();
