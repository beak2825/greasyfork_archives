// ==UserScript==
// @name         CS Timer Ultimate Auto-Enter & Stat Tracker
// @namespace    https://violentmonkey.github.io/
// @version      3.0
// @description  Advanced CS Timer automation with auto-entry, live stats, UI controls, and failsafe mechanisms
// @author       YourName
// @license      MIT
// @match        https://cstimer.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/532938/CS%20Timer%20Ultimate%20Auto-Enter%20%20Stat%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/532938/CS%20Timer%20Ultimate%20Auto-Enter%20%20Stat%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** SETTINGS **/
    let autoGenerate = true; // Toggle auto-generation
    let entryInterval = 700; // Milliseconds between each generated solve
    let stats = { count: 0, best: Infinity, worst: 0, totalTime: 0 };

    function generateTime() {
        let randomChance = Math.random();
        let randomTime = (randomChance < 0.8) ? (Math.random() * (5.01 - 3.16) + 3.16).toFixed(2) : (Math.random() * (6.06 - 1.84) + 1.84).toFixed(2);

        updateStats(randomTime);
        document.getElementById("timeDisplay").innerText = `Generated Time: ${randomTime} seconds`;

        let timeInput = document.getElementById("inputTimer");
        if (timeInput) {
            timeInput.style.display = "inline-block";
            timeInput.focus();
            simulateTyping(timeInput, randomTime, 10, pressEnter);
        }
    }

    function updateStats(time) {
        let timeFloat = parseFloat(time);
        stats.count++;
        stats.totalTime += timeFloat;
        stats.best = Math.min(stats.best, timeFloat);
        stats.worst = Math.max(stats.worst, timeFloat);

        document.getElementById("statsDisplay").innerText = `Solve Count: ${stats.count} | Avg Time: ${(stats.totalTime/stats.count).toFixed(2)}s | Best: ${stats.best}s | Worst: ${stats.worst}s`;
    }

    function simulateTyping(element, text, delay, callback) {
        let index = 0;
        element.value = "";
        function typeChar() {
            if (index < text.length) {
                element.value += text[index];
                index++;
                element.dispatchEvent(new Event('input'));
                setTimeout(typeChar, delay);
            } else if (callback) {
                setTimeout(callback, 100);
            }
        }
        typeChar();
    }

    function pressEnter() {
        let timeInput = document.getElementById("inputTimer");
        if (timeInput) {
            timeInput.focus();
            ["keydown", "keyup"].forEach(eventType => {
                let enterKeyEvent = new KeyboardEvent(eventType, { key: "Enter", code: "Enter", bubbles: true });
                timeInput.dispatchEvent(enterKeyEvent);
            });
        }
    }

    function startAutoGenerate() {
        setInterval(() => {
            if (autoGenerate) generateTime();
        }, entryInterval);
    }

    function resetStats() {
        stats = { count: 0, best: Infinity, worst: 0, totalTime: 0 };
        document.getElementById("statsDisplay").innerText = "Solve Count: 0 | Avg Time: 0.00s | Best: -- | Worst: --";
    }

    function toggleAutoGenerate() {
        autoGenerate = !autoGenerate;
        document.getElementById("toggleButton").innerText = autoGenerate ? "Disable Auto-Generate" : "Enable Auto-Generate";
    }

    function createUI() {
        let container = document.createElement("div");
        container.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px;
            background: #f9f9f9;
            border: 2px solid #ccc;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
            text-align: center;
        `;

        let title = document.createElement("h3");
        title.innerText = "CS Timer Auto-Enter Pro";
        container.appendChild(title);

        let timeDisplay = document.createElement("p");
        timeDisplay.id = "timeDisplay";
        timeDisplay.innerText = "Generated times will appear here...";
        container.appendChild(timeDisplay);

        let statsDisplay = document.createElement("p");
        statsDisplay.id = "statsDisplay";
        statsDisplay.innerText = "Solve Count: 0 | Avg Time: 0.00s | Best: -- | Worst: --";
        container.appendChild(statsDisplay);

        let toggleButton = document.createElement("button");
        toggleButton.id = "toggleButton";
        toggleButton.innerText = "Disable Auto-Generate";
        toggleButton.onclick = toggleAutoGenerate;
        container.appendChild(toggleButton);

        let resetButton = document.createElement("button");
        resetButton.innerText = "Reset Stats";
        resetButton.onclick = resetStats;
        container.appendChild(resetButton);

        document.body.appendChild(container);
    }

    createUI();
    startAutoGenerate();
})();
