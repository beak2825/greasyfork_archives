// ==UserScript==
// @name         Sun vs Moon Auto Click (Switchable)
// @namespace    http://tampermonkey.net/
// @version      3.3.2Beta
// @description  Automatically clicks either the Sun or Moon Button on pressing "S" and Stops Clicking on pressing "M" on https://neal.fun/sun-vs-moon/
// @author       Lav1nRulez
// @match        https://neal.fun/sun-vs-moon/
// @grant        none
// @icon         https://i.ibb.co/QXR89nv/2024-11-03-0z1-Kleki.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515639/Sun%20vs%20Moon%20Auto%20Click%20%28Switchable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515639/Sun%20vs%20Moon%20Auto%20Click%20%28Switchable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickInterval; // Variable to store the interval ID
    let targetButtonId = "sun-btn"; // Default to "Sun" button

    // Function to display on-screen messages with color customization
    function showMessage(text, color) {
        let messageDiv = document.getElementById("autoclicker-message");
        if (!messageDiv) {
            messageDiv = document.createElement("div");
            messageDiv.id = "autoclicker-message";
            messageDiv.style.position = "fixed";
            messageDiv.style.bottom = "20px";
            messageDiv.style.right = "20px";
            messageDiv.style.padding = "10px 20px";
            messageDiv.style.color = "white";
            messageDiv.style.fontSize = "16px";
            messageDiv.style.borderRadius = "5px";
            messageDiv.style.zIndex = "1000";
            document.body.appendChild(messageDiv);
        }

        // Set the text, background color, and display the message
        messageDiv.textContent = text;
        messageDiv.style.backgroundColor = color;
        messageDiv.style.display = "block";

        // Hide the message after 2 seconds
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 2000);
    }

    // Function to toggle the target button between "sun-btn" and "moon-btn"
    function toggleTargetButton() {
        targetButtonId = targetButtonId === "sun-btn" ? "moon-btn" : "sun-btn";
        toggleButton.textContent = `Switch to ${targetButtonId === "sun-btn" ? "Moon Clicker" : "Sun Clicker"}`;

        // Show message with orange for Sun and blue for Moon
        const targetColor = targetButtonId === "sun-btn" ? "orange" : "blue";
        showMessage(`Now targeting ${targetButtonId === "sun-btn" ? "Sun" : "Moon"}`, targetColor);
    }

    // Add a toggle button at the top-right corner
    let toggleButton = document.createElement("button");
    toggleButton.id = "toggle-button";
    toggleButton.textContent = "Switch to Moon Clicker";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.padding = "10px 15px";
    toggleButton.style.backgroundColor = "#333";
    toggleButton.style.color = "white";
    toggleButton.style.fontSize = "14px";
    toggleButton.style.border = "none";
    toggleButton.style.borderRadius = "5px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.zIndex = "1000";
    toggleButton.addEventListener("click", toggleTargetButton);
    document.body.appendChild(toggleButton);

    // Add a persistent label at the bottom-left corner with author name
    function addAuthorLabel() {
        let authorLabel = document.getElementById("author-label");
        if (!authorLabel) {
            authorLabel = document.createElement("div");
            authorLabel.id = "author-label";
            authorLabel.textContent = "Made by Lav1nRulez";
            authorLabel.style.position = "fixed";
            authorLabel.style.bottom = "10px";
            authorLabel.style.left = "10px";
            authorLabel.style.padding = "5px 10px";
            authorLabel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            authorLabel.style.color = "white";
            authorLabel.style.fontSize = "12px";
            authorLabel.style.borderRadius = "5px"; // Rounded box shape
            authorLabel.style.zIndex = "1000";
            document.body.appendChild(authorLabel);
        }
    }

    // Add the question mark button next to the author label
    function addQuestionMarkButton() {
        let questionButton = document.createElement("button");
        questionButton.id = "question-mark-button";
        questionButton.textContent = "?";
        questionButton.style.position = "fixed";
        questionButton.style.bottom = "10px";
        questionButton.style.left = "140px"; // Position it beside the author label
        questionButton.style.padding = "5px 10px"; // Adjust padding to be smaller
        questionButton.style.backgroundColor = "#333";
        questionButton.style.color = "white";
        questionButton.style.fontSize = "14px"; // Reduced font size
        questionButton.style.border = "none";
        questionButton.style.borderRadius = "10px"; // Rounded corners (same as modal box)
        questionButton.style.cursor = "pointer";
        questionButton.style.zIndex = "1000";
        questionButton.addEventListener("click", showRulesModal);
        document.body.appendChild(questionButton);
    }

    // Modal to display rules
    function showRulesModal() {
        // Check if the modal already exists, if not, create it
        let modal = document.getElementById("rules-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "rules-modal";
            modal.style.position = "fixed";
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            modal.style.color = "white";
            modal.style.padding = "20px";
            modal.style.borderRadius = "10px"; // Rounded corners
            modal.style.zIndex = "1001";
            modal.style.maxWidth = "400px";
            modal.style.width = "80%";
            modal.style.textAlign = "center";

            // Modal content
            modal.innerHTML = `
                <h2>Rules</h2>
                <ul style="list-style-type: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 10px;">Do not click "S" too many times, your website may crash.</li>
                    <li style="margin-bottom: 10px;">Press "S" to start the autoclicker and "M" to stop it.</li>
                </ul>
                <button id="close-modal" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 50%; position: absolute; top: 10px; right: 10px; cursor: pointer;">X</button>
            `;

            // Add close button functionality
            modal.querySelector("#close-modal").addEventListener("click", function() {
                document.body.removeChild(modal);
            });

            // Append modal to the body
            document.body.appendChild(modal);
        }
    }

    // Run the author label function to display it immediately
    addAuthorLabel();
    addQuestionMarkButton();

    // Add event listener for keydown events
    document.addEventListener('keydown', function(event) {
        if (event.key === 'S' || event.key === 's') {
            if (!clickInterval) {
                clickInterval = setInterval(() => {
                    const targetButton = document.getElementById(targetButtonId);
                    if (targetButton) {
                        targetButton.click();
                    }
                }, 1); // 1 millisecond interval
                showMessage("Autoclicker Started", "green"); // Green for start
            }
        } else if (event.key === 'M' || event.key === 'm') {
            if (clickInterval) {
                clearInterval(clickInterval);
                clickInterval = null;
                showMessage("Autoclicker Stopped", "red"); // Red for stop
            }
        }
    });
})();
