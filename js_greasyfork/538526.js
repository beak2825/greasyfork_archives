// ==UserScript==
// @name         Battledome Challenger Finder
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically refreshes pages as needed for unlocking battledome opponents until the challenger is found, upon which a pop up notification is generated.
// @author       Amanda Bynes & AI-manda Binary
// @match        https://www.neopets.com/games/dicearoo.phtml*
// @match        https://www.neopets.com/halloween/index.phtml*
// @match        https://www.neopets.com/worlds/index_roo.phtml*
// @match        https://www.neopets.com/prehistoric/painting2.phtml*
// @match        https://www.neopets.com/water/index_ruins.phtml*
// @match        https://www.neopets.com/space/index.phtml*
// @match        https://www.neopets.com/moon/*
// @match        https://www.neopets.com/moon/index.phtml/*
// @match        https://www.neopets.com/neohome.phtml?type=neighbourhood&location=0&street_name=4&street_number=131*
// @match        https://www.neopets.com/prehistoric/omelette.phtml*
// @match        https://www.neopets.com/prehistoric/townhall.phtml*
// @match        https://www.neopets.com/search.phtml?string=kastraliss*
// @match        https://www.neopets.com/search.phtml?s=kastraliss*
// @match        https://www.neopets.com/userlookup.phtml?user=kastraliss&place=99999*
// @match        https://www.neopets.com/water/index.phtml/*
// @match        https://www.neopets.com/lab2.phtml*
// @match        https://www.neopets.com/desert/tr4pd00r.phtml*
// @match        https://www.neopets.com/halloween/coconutshy.phtml*
// @match        https://www.neopets.com/faerieland/wheel.phtml*
// @match        https://www.neopets.com/desert/ldp/index.phtml?chapter=6*
// @match        https://www.neopets.com/prehistoric/plateau.phtml*
// @match        https://www.neopets.com/water/seaslug.phtml*
// @match        https://www.neopets.com/winter/*
// @match        https://www.neopets.com/weather.phtml?world=10*
// @match        https://www.neopets.com/art/index.phtml*
// @match        https://www.neopets.com/bdoffers.phtml*
// @match        https://www.neopets.com/worlds/deadlydice.phtml*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538526/Battledome%20Challenger%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/538526/Battledome%20Challenger%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const refreshInterval = 3000;
    const challengerText = "NEW BATTLEDOME CHALLENGER!!!";
    const storageKey = "autoRefreshActive";
    let refreshTimeout = null;

    function createButton(text, id, bgColor) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.innerText = text;
        btn.style.padding = "8px 14px";
        btn.style.margin = "0 10px";
        btn.style.backgroundColor = bgColor;
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";
        return btn;
    }

    function isChallengerFound() {
        return document.body.innerText.includes(challengerText);
    }

    function startAutoRefresh(startButton, stopButton) {
        localStorage.setItem(storageKey, "true");
        startButton.innerText = "Refreshing...";
        startButton.style.backgroundColor = "#555";
        stopButton.style.display = "inline-block";

        if (isChallengerFound()) {
            stopAutoRefresh(startButton, stopButton, true);
        } else {
            refreshTimeout = setTimeout(() => {
                location.reload();
            }, refreshInterval);
        }
    }

    function stopAutoRefresh(startButton, stopButton, found = false) {
        localStorage.removeItem(storageKey);
        clearTimeout(refreshTimeout);
        refreshTimeout = null;

        if (found) {
            alert("🎉 New Battledome Challenger found!");
            startButton.innerText = "Challenger Found!";
            startButton.style.backgroundColor = "#222";
        } else {
            startButton.innerText = "Start Auto-Refresh";
            startButton.style.backgroundColor = "#333";
        }

        stopButton.style.display = "none";
    }

    function init() {
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.top = "100px";
        wrapper.style.right = "0";
        wrapper.style.zIndex = "9999";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "flex-end";
        wrapper.style.padding = "10px";

        const startButton = createButton("Start Auto-Refresh", "start-refresh-btn", "#333");
        const stopButton = createButton("Stop Auto-Refresh", "stop-refresh-btn", "#666");
        stopButton.style.display = "none";

        startButton.addEventListener("click", () => {
            if (localStorage.getItem(storageKey) !== "true") {
                startAutoRefresh(startButton, stopButton);
            }
        });

        stopButton.addEventListener("click", () => {
            stopAutoRefresh(startButton, stopButton);
        });

        wrapper.appendChild(startButton);
        wrapper.appendChild(stopButton);
        document.body.appendChild(wrapper);

        if (localStorage.getItem(storageKey) === "true") {
            startAutoRefresh(startButton, stopButton);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }
})();
