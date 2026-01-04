// ==UserScript==
// @name         Timewaste Tracker
// @namespace    https://lagomor.ph
// @version      1.0
// @description  Track time wasted on Reddit and Youtube
// @match        *://*.reddit.com/*
// @match        *://*.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/502924/Timewaste%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/502924/Timewaste%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to format time in HH:MM:SS
    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // Initialize or load timers
    let site = window.location.hostname.includes('reddit.com') ? 'reddit' : 'youtube';
    let sessionTime = 0;
    let lifetimeTime = GM_getValue(`${site}_lifetimeTime`, 0);

    const timerBar = document.createElement("div");
    timerBar.id = "timer-bar";
    timerBar.style.position = "fixed";
    timerBar.style.bottom = "0";
    timerBar.style.width = "100%";
    timerBar.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    timerBar.style.color = "white";
    timerBar.style.zIndex = "9999";
    timerBar.style.textAlign = "center";
    timerBar.style.padding = "5px 0";
    timerBar.style.transition = "background-color 0.5s";
    timerBar.innerHTML = `
        <div id="timer-text">TIME WASTED (SESSION): 00:00:00 | TIME WASTED (LIFETIME): 00:00:00</div>
    `;
    document.body.appendChild(timerBar);

    const updateTimerBar = () => {
        const timerText = document.getElementById("timer-text");
        if (timerText) {
            timerText.innerHTML = `
                TIME WASTED (SESSION): ${formatTime(sessionTime)} | TIME WASTED (LIFETIME): ${formatTime(lifetimeTime)}
            `;
            timerBar.style.backgroundColor = "orange";
            setTimeout(() => {
                timerBar.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            }, 500);
        }
    };

    // Update timer every second
    setInterval(() => {
        sessionTime += 1;
        lifetimeTime += 1;
        GM_setValue(`${site}_lifetimeTime`, lifetimeTime);
        updateTimerBar();
    }, 1000);

    // Reset session and lifetime timers
    GM_registerMenuCommand("Reset Session Timer", () => {
        sessionTime = 0;
        updateTimerBar();
    });

    GM_registerMenuCommand("Reset Lifetime Timer", () => {
        lifetimeTime = 0;
        GM_setValue(`${site}_lifetimeTime`, 0);
        updateTimerBar();
    });

    // Initial update
    updateTimerBar();
})();

