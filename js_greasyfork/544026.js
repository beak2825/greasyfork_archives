// ==UserScript==
// @name         Flatmmo kill per hour tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track kills per hour and minute in FlatMMO
// @author       Straightmale (kat(i)e)
// @match        *://flatmmo.com/play.php
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544026/Flatmmo%20kill%20per%20hour%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/544026/Flatmmo%20kill%20per%20hour%20tracker.meta.js
// ==/UserScript==

// I expect a jolly rancher from you Dralina
(function () {
  'use strict';

  let killTimestamps = [];
  let tracker = null;

  console.log("[KillTracker] Script loaded");

  function setupDisplay() {
    if (!document.body) {
      console.warn("[KillTracker] Body not ready, retrying...");
      setTimeout(setupDisplay, 100);
      return;
    }

    tracker = document.createElement("div");
    tracker.id = "kill-tracker-ui";
    Object.assign(tracker.style, {
      position: "fixed",
      top: "10px",
      left: "10px",
      padding: "8px 12px",
      background: "rgba(255, 0, 0, 0.9)",
      color: "white",
      fontFamily: "monospace",
      fontSize: "16px",
      borderRadius: "6px",
      zIndex: "999999",
      display: "block",
      pointerEvents: "none"
    });

    tracker.innerText = "Kills: 0\nKills/hour: 0\nKills/minute: 0";
    document.body.appendChild(tracker);
    console.log("[KillTracker] UI initialized");
  }

  const checkReady = setInterval(() => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      clearInterval(checkReady);
      setupDisplay();
    }
  }, 100);

  function updateDisplay() {
    const now = Date.now();
    killTimestamps = killTimestamps.filter(ts => now - ts <= 3600000); // keep last 1hr

    if (killTimestamps.length === 0) {
      tracker.innerText = `Kills: 0\nKills/hour: 0\nKills/minute: 0`;
      return;
    }

    const elapsed = now - killTimestamps[0];
    const kills = killTimestamps.length;
    const kph = (kills * 3600000 / elapsed).toFixed(1);
    const kpm = (kills * 60000 / elapsed).toFixed(1);

    tracker.innerText = `Kills: ${kills}\nKills/hour: ${kph}\nKills/minute: ${kpm}`;
    console.log(`[KillTracker] Updated: ${kills} kills, ${kph} KPH, ${kpm} KPM`);
  }

  setInterval(() => {
    if (tracker) updateDisplay();
  }, 10000);

  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = function (...args) {
    const ws = new OriginalWebSocket(...args);

    ws.addEventListener("message", function (event) {
      const data = event.data;
      if (typeof data !== "string") return;

      if (data.includes("PLAY_SOUND=sounds/kill.mp3~")) {
        console.log("[KillTracker] Kill sound detected:", data);
        killTimestamps.push(Date.now());
        if (tracker) updateDisplay();
      }
    });

    return ws;
  };
})();
