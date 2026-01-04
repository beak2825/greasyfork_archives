// ==UserScript==
// @name         Chain timer
// @namespace    Apo
// @version      1.0
// @description  Make chain timer bigger for better visibility
// @author       Apollyon [445323]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/491315/Chain%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/491315/Chain%20timer.meta.js
// ==/UserScript==

waitForKeyElements(".speed___dFP2B", actionFunction);

function actionFunction(jNode) {
    'use strict';

    const barStats = document.querySelector(".bar-stats___E_LqA");
    const timeLeft = document.querySelector(".bar-timeleft___B9RGV");
    const speed = document.querySelector(".speed___dFP2B");
    const tickList = document.querySelector(".tick-list___McObN");

    barStats.style.display = "block";
    timeLeft.style.fontSize = "60px";
    timeLeft.style.height = "62px";
    speed.style.top = "unset";
    tickList.style.height = "8px";

    function updateColor() {
        // Get the time remaining in HH:MM:SS format
        const timeRemaining = timeLeft.textContent.trim();

        // Convert the time remaining into seconds
        const [minutes, seconds] = timeRemaining.split(":").map(Number);
        const totalSeconds = minutes * 60 + seconds;

        // Check if time remaining is less than 1 minute and 30 seconds
        if (totalSeconds < 90) {
            timeLeft.style.color = "#ef1a09";
        }
        // Check if time remaining is less than 3 minutes
        else if (totalSeconds < 270) {
            timeLeft.style.color = "#efe80c";
        }
        // Default color
        else {
            timeLeft.style.color = "#28ef0c";
        }
    }

    // Update color initially
    updateColor();

    // Periodically update color every second
    setInterval(updateColor, 1000);
}