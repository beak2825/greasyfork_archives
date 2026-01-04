// ==UserScript==
// @name         LeetCode 10-Min Timer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a 10-minute countdown timer on LeetCode problems.
// @author       Yange
// @match        https://leetcode.com/problems/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529442/LeetCode%2010-Min%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/529442/LeetCode%2010-Min%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createTimerButton() {
        const button = document.createElement("button");
        button.innerText = "Start 10m Timer";
        button.style.position = "absolute";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px";
        button.style.backgroundColor = "#ff5722";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.zIndex = "9999";

        button.onclick = startTimer;
        document.body.appendChild(button);
    }

    function startTimer() {
        let timeLeft = 10 * 60; // 10 minutes in seconds
        const timerDisplay = document.createElement("div");
        timerDisplay.style.position = "absolute";
        timerDisplay.style.bottom = "50px";
        timerDisplay.style.right = "20px";
        timerDisplay.style.padding = "10px";
        timerDisplay.style.backgroundColor = "#222";
        timerDisplay.style.color = "#fff";
        timerDisplay.style.borderRadius = "5px";
        timerDisplay.style.fontSize = "16px";
        timerDisplay.style.zIndex = "9999";
        timerDisplay.innerText = "10:00";
        document.body.appendChild(timerDisplay);

        const interval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeLeft <= 0) {
                clearInterval(interval);
                alert("Time is up!");
                timerDisplay.innerText = "Time's up!";
                timerDisplay.style.backgroundColor = "red";
            }
        }, 1000);
    }

    createTimerButton();
})();