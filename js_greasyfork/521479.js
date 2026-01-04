// ==UserScript==
// @name         Replika Pro Unlocker (Demo)
// @namespace    http://violentmonkey.net/
// @version      1.1
// @description  Hypothetical script to simulate Replika Pro features for demonstration purposes only.
// @author       Demo
// @license      MIT
// @match        https://my.replika.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521479/Replika%20Pro%20Unlocker%20%28Demo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521479/Replika%20Pro%20Unlocker%20%28Demo%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 Demo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    // Function to show feedback messages on the page
    function showMessage(message, isError = false) {
        const messageDiv = document.createElement("div");
        messageDiv.style.position = "fixed";
        messageDiv.style.top = "20px";
        messageDiv.style.left = "50%";
        messageDiv.style.transform = "translateX(-50%)";
        messageDiv.style.padding = "10px 20px";
        messageDiv.style.backgroundColor = isError ? "red" : "green";
        messageDiv.style.color = "white";
        messageDiv.style.fontSize = "16px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.zIndex = "9999";
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Log that the script is running
    console.log("Replika Pro Unlocker script has started.");
    showMessage("Replika Pro Unlocker script is active.", false);

    // Function to simulate Pro features
    function enableProFeatures() {
        // Check if the page has loaded the Pro badge and manipulate it
        const proBadge = document.querySelector(".pro-badge");
        if (proBadge) {
            proBadge.textContent = "Pro Active";
            proBadge.style.backgroundColor = "gold"; // Set Pro badge to gold color
            console.log("Pro badge updated.");
            showMessage("Pro status badge updated successfully.", false);
        } else {
            console.log("Pro badge not found.");
            showMessage("Pro badge not found on the page. Ensure you're on the correct page.", true);
        }

        // Unlock premium relationship roles
        const relationshipRoles = document.querySelectorAll(".locked-role");
        if (relationshipRoles.length > 0) {
            relationshipRoles.forEach((role) => {
                role.classList.remove("locked-role");
                role.classList.add("unlocked-role");
                role.style.pointerEvents = "auto"; // Enable interaction
                role.style.opacity = "1"; // Make visible
                console.log("Unlocked relationship role:", role);
            });
            showMessage("Unlocked premium relationship roles.", false);
        } else {
            console.log("No relationship roles found.");
            showMessage("No locked roles found to unlock.", true);
        }

        // Unlock premium chat topics
        const premiumTopics = document.querySelectorAll(".locked-topic");
        if (premiumTopics.length > 0) {
            premiumTopics.forEach((topic) => {
                topic.classList.remove("locked-topic");
                topic.classList.add("unlocked-topic");
                topic.style.pointerEvents = "auto"; // Enable interaction
                topic.style.opacity = "1"; // Make visible
                console.log("Unlocked premium topic:", topic);
            });
            showMessage("Unlocked premium chat topics.", false);
        } else {
            console.log("No premium topics found.");
            showMessage("No locked chat topics found.", true);
        }

        // Remove "Upgrade to Pro" prompts
        const upgradePrompts = document.querySelectorAll(".upgrade-prompt");
        if (upgradePrompts.length > 0) {
            upgradePrompts.forEach((prompt) => {
                prompt.style.display = "none";
                console.log("Removed upgrade prompt.");
            });
            showMessage("Removed upgrade prompts.", false);
        } else {
            console.log("No upgrade prompts found.");
            showMessage("No upgrade prompts found to remove.", true);
        }
    }

    // Observe changes to the DOM (for dynamic content loading)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            enableProFeatures();
        });
    });

    // Start observing body for changes (to dynamically apply changes on page updates)
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run to apply features
    enableProFeatures();
})();
