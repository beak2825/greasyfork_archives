// ==UserScript==
// @name         TikTok Unfollow Non-Mutuals
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Unfollows everyone you’re not mutual friends with on TikTok
// @match        https://www.tiktok.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515789/TikTok%20Unfollow%20Non-Mutuals.user.js
// @updateURL https://update.greasyfork.org/scripts/515789/TikTok%20Unfollow%20Non-Mutuals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function unfollowNonMutuals() {
        // Find all "Following" buttons in the list
        const buttons = document.querySelectorAll('button');

        let unfollowCount = 0;

        for (const button of buttons) {
            if (button.textContent === "Following") {
                // Check for a mutual friends indicator (e.g., "Friends", "Mutual")
                const parentElement = button.closest("div"); // adjust this as needed based on TikTok layout
                const mutualIndicator = parentElement && parentElement.textContent.includes("Friends");

                // If there's no mutual friends indicator, unfollow this account
                if (!mutualIndicator) {
                    console.log("Unfollowing non-mutual...");
                    button.click();
                    unfollowCount++;

                    // Add a delay between actions to avoid spam detection
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        alert(`Unfollowed ${unfollowCount} non-mutuals.`);
    }

    // Create a control button to trigger the unfollow action
    if (!document.querySelector("#unfollowNonMutualsButton")) {
        const controlButton = document.createElement("button");
        controlButton.id = "unfollowNonMutualsButton";
        controlButton.innerText = "Unfollow Non-Mutuals";
        controlButton.style.position = "fixed";
        controlButton.style.top = "20px";
        controlButton.style.right = "20px";
        controlButton.style.padding = "10px";
        controlButton.style.backgroundColor = "#ff5b5b";
        controlButton.style.color = "#fff";
        controlButton.style.border = "none";
        controlButton.style.borderRadius = "5px";
        controlButton.style.zIndex = "10000";
        controlButton.style.cursor = "pointer";
        controlButton.onclick = unfollowNonMutuals;
        document.body.appendChild(controlButton);
    }
})();
