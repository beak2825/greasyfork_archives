// ==UserScript==
// @name        Fast forward and rewind buttons for Plex.tv
// @namespace   Violentmonkey Scripts
// @match       https://watch.plex.tv/*
// @grant       none
// @version     1.0
// @author      LovingObserver
// @license     GNU GPLv3
// @description 5/12/2025
// @downloadURL https://update.greasyfork.org/scripts/535822/Fast%20forward%20and%20rewind%20buttons%20for%20Plextv.user.js
// @updateURL https://update.greasyfork.org/scripts/535822/Fast%20forward%20and%20rewind%20buttons%20for%20Plextv.meta.js
// ==/UserScript==

// Create a MutationObserver to detect when the playerControls element is added
const observer = new MutationObserver((mutationsList, observer) => {
    let playerControls = document.querySelector('[class*="PlayerControls_bottomControls"] div div:nth-of-type(2) div:nth-of-type(2)');

    if (playerControls) {
        console.log("Player Controls detected!");

        // Stop observing once the element is found
        observer.disconnect();

        // SVG buttons
        let fastFwdIcon = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon transform="rotate(5, 24, 24)" stroke="none" fill="white" points="21,18 32,19 25,28"></polygon>
            <path d="M16,32C9,32 4,26 4,20C4,14 9,8 16,8C23,8 28,14 28,20" stroke="white" stroke-width="3" fill="none"></path>
        </svg>`;

        let rewindIcon = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon transform="rotate(-5, 24, 24)" stroke="none" fill="white" points="26,18 15,19 23,28"></polygon>
            <path d="M32,32C39,32 44,26 44,20C44,14 39,8 32,8C25,8 20,14 20,20" stroke="white" stroke-width="3" fill="none"></path>
        </svg>`;

        // Create the button elements
        let rewindBtn = document.createElement("div");
        rewindBtn.innerHTML = rewindIcon;
        rewindBtn.id = "rewindBtn";

        let fastFwdBtn = document.createElement("div");
        fastFwdBtn.innerHTML = fastFwdIcon;
        fastFwdBtn.id = "fastFwdBtn";

        // Function to rewind video
        function rewind() {
            let video = document.querySelector("video");
            if (video) video.currentTime -= 5;
        }

        // Function to fast forward video
        function fastForward() {
            let video = document.querySelector("video");
            if (video) video.currentTime += 5;
        }

        // Add event listeners
        rewindBtn.addEventListener("click", rewind);
        fastFwdBtn.addEventListener("click", fastForward);

        // Add event listeners for keyboard shortcuts
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                rewind();
            } else if (event.key === "ArrowRight") {
                fastForward();
            }
        });

        // Append buttons to player controls
        playerControls.prepend(rewindBtn);
        playerControls.appendChild(fastFwdBtn);
    }
});

// Start observing the document body for added elements
observer.observe(document.body, { childList: true, subtree: true });

console.log("Observer started, waiting for Player Controls...");