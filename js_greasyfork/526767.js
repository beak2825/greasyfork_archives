// ==UserScript==
// @name         Mathspace Confidence Booster
// @namespace    http://mathsspace.co/
// @version      1.0
// @description  Adds confidence points to the leaderboard to motivate students on MathsSpace.co
// @author       CodeCopilot
// @match        *://*.mathsspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526767/Mathspace%20Confidence%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/526767/Mathspace%20Confidence%20Booster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[MathsSpace Booster] Script Loaded ✅");

    function addConfidencePoints() {
        let correctMessage = document.querySelector(".correct-answer-message"); // Adjust if needed
        let leaderboard = document.querySelector(".leaderboard-score"); // Adjust if needed

        if (correctMessage && leaderboard) {
            let currentScore = parseInt(leaderboard.innerText, 10) || 0;
            let extraPoints = 50; // Confidence Boost
            let newScore = currentScore + extraPoints;

            leaderboard.innerText = newScore;
            showMotivationMessage(correctMessage, extraPoints);
        }
    }

    function showMotivationMessage(targetNode, points) {
        let messageBox = document.createElement("div");
        messageBox.className = "confidence-message";
        messageBox.style.background = "#4CAF50";
        messageBox.style.color = "#fff";
        messageBox.style.padding = "10px";
        messageBox.style.marginTop = "10px";
        messageBox.style.borderRadius = "5px";
        messageBox.style.fontWeight = "bold";
        messageBox.style.textAlign = "center";
        messageBox.innerText = `🎉 Great job! +${points} Confidence Points! 🎉`;

        targetNode.appendChild(messageBox);

        setTimeout(() => messageBox.remove(), 3000); // Hide after 3 seconds
    }

    function watchForChanges() {
        let observer = new MutationObserver(() => addConfidencePoints());
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("[MathsSpace Booster] Watching for achievements...");
    }

    watchForChanges();
})();


