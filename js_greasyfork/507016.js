// ==UserScript==
// @name         IMVU Peer Review Automation: Countdown Timer & Semi-Automater
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Automate and enhance your IMVU peer reviews with this Tampermonkey script: clicks the "View in 3D" button, auto-checks the "No issues" checkbox, and starts a 25-second countdown to prevent reviews from being done too quickly.

// @author       Spikes @ IMVU, spcckz on discord
// @match        https://www.imvu.com/peer_review/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507016/IMVU%20Peer%20Review%20Automation%3A%20Countdown%20Timer%20%20Semi-Automater.user.js
// @updateURL https://update.greasyfork.org/scripts/507016/IMVU%20Peer%20Review%20Automation%3A%20Countdown%20Timer%20%20Semi-Automater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a div to display the countdown
    const countdownDiv = document.createElement('div');
    countdownDiv.style.position = 'fixed';
    countdownDiv.style.top = '10px';
    countdownDiv.style.right = '10px';
    countdownDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    countdownDiv.style.color = 'white';
    countdownDiv.style.padding = '10px';
    countdownDiv.style.fontSize = '16px';
    countdownDiv.style.borderRadius = '5px';
    countdownDiv.innerHTML = 'Time remaining: 25 seconds';
    document.body.appendChild(countdownDiv);

    // Get the vote button and set it to disabled (with grayed out style)
    const voteButton = document.getElementById('btn_submit_vote');
    if (voteButton) {
        voteButton.disabled = true;
        voteButton.style.opacity = '0.5'; // Gray out the button when disabled
        voteButton.style.cursor = 'not-allowed'; // Show the "not allowed" cursor
    }

    // Start the countdown from 25 seconds
    let timeRemaining = 25;
    const countdownInterval = setInterval(() => {
        timeRemaining--;
        countdownDiv.innerHTML = `Time remaining: ${timeRemaining} seconds`;

        // When the countdown reaches 0, stop the interval and enable the button
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            countdownDiv.innerHTML = 'Countdown finished!';
            if (voteButton) {
                voteButton.disabled = false; // Enable the "Vote" button
                voteButton.style.opacity = '1'; // Restore normal button style
                voteButton.style.cursor = 'pointer'; // Change cursor back to pointer
            }
        }
    }, 1000); // 1000ms = 1 second

    // Function to wait for and click the "no issues" checkbox
    function clickCheckbox() {
        const checkbox = document.querySelector('input[name="no_issues"]');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    }

    // Wait for the checkbox element to be available and click it
    const observer = new MutationObserver(() => {
        const checkbox = document.querySelector('input[name="no_issues"]');
        if (checkbox) {
            clickCheckbox();
            observer.disconnect(); // Stop observing once the checkbox is found and clicked
        }
    });

    // Start observing the document for changes to detect when the checkbox loads
    observer.observe(document.body, { childList: true, subtree: true });

    // Click the specific button on the specific page
    if (window.location.href === 'https://www.imvu.com/peer_review/') {
        // Locate the button using its onclick attribute
        const specificButton = Array.from(document.querySelectorAll('button'))
            .find(button => button.getAttribute('onclick') && button.getAttribute('onclick').includes("/next/peer_review"));

        if (specificButton) {
            specificButton.click();
        }
    }

})();
