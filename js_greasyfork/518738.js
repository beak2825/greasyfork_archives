// ==UserScript==
// @name         Candidate Vote Difference with Formatting and Styling
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Calculate and display vote difference between two candidates with formatted numbers, improved styling, and time
// @author       You
// @match        https://prezenta.roaep.ro/prezidentiale24112024/pv/romania/results/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518738/Candidate%20Vote%20Difference%20with%20Formatting%20and%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/518738/Candidate%20Vote%20Difference%20with%20Formatting%20and%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract candidate data
    function extractData() {
        // Candidates you're interested in
        const candidates = ["ION-MARCEL CIOLACU", "ELENA-VALERICA LASCONI"];

        // Wait for the page to load properly and then execute the logic
        const rows = document.querySelectorAll("tr");

        let candidateVotes = {};

        rows.forEach(row => {
            const nameElement = row.querySelector("span");
            if (nameElement) {
                const candidateName = nameElement.innerText.trim();

                // If it's one of the candidates we're tracking
                if (candidates.includes(candidateName)) {
                    const numbers = row.querySelectorAll("span");
                    if (numbers.length >= 2) {
                        const votes = parseInt(numbers[1].innerText.trim().replace(/\D/g, ''));  // Remove non-numeric characters
                        candidateVotes[candidateName] = votes;
                    }
                }
            }
        });

        // Check if both candidates' votes were found
        if (candidateVotes["ION-MARCEL CIOLACU"] && candidateVotes["ELENA-VALERICA LASCONI"]) {
            const ciolacuVotes = candidateVotes["ION-MARCEL CIOLACU"];
            const lasconiVotes = candidateVotes["ELENA-VALERICA LASCONI"];
            const voteDifference = ciolacuVotes - lasconiVotes;

            // Display the result on the page
            displayResult(ciolacuVotes, lasconiVotes, voteDifference);
        }
    }

    // Function to format numbers with a dot as a thousands separator
    function formatNumber(number) {
        return number.toLocaleString('en-GB');  // 'en-GB' uses a dot as the thousands separator
    }

    // Function to get the current time in a readable format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString();  // Returns time in the format HH:MM:SS AM/PM
    }

    // Function to display the result on the page
    function displayResult(ciolacuVotes, lasconiVotes, voteDifference) {
        // Create a div element to show the result
        const resultDiv = document.createElement("div");
        resultDiv.style.position = "fixed";
        resultDiv.style.top = "10px";
        resultDiv.style.right = "10px";
        resultDiv.style.backgroundColor = "#333"; // Dark background for better readability
        resultDiv.style.color = "#fff";  // White text for contrast
        resultDiv.style.borderRadius = "15px"; // Rounded corners
        resultDiv.style.padding = "20px"; // Padding around the content
        resultDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Subtle shadow for depth
        resultDiv.style.fontFamily = "'Arial', sans-serif"; // Clean font style
        resultDiv.style.zIndex = "9999";
        resultDiv.style.fontSize = "16px";  // Slightly larger text for better readability
        resultDiv.style.maxWidth = "300px"; // Limit the width for better layout

        resultDiv.innerHTML = `
            <h3 style="font-size: 18px; font-weight: bold;">Vote Difference:</h3>
            <p style="color: rgb(201, 35, 43);">ION-MARCEL CIOLACU Votes: <strong>${formatNumber(ciolacuVotes)}</strong></p>
            <p style="color: rgb(45, 111, 163);">ELENA-VALERICA LASCONI Votes: <strong>${formatNumber(lasconiVotes)}</strong></p>
            <p>Vote Difference: <strong>${formatNumber(voteDifference)}</strong></p>
            <p style="font-size: 14px;">Last Updated: <strong>${getCurrentTime()}</strong></p>
        `;

        // Append the result div to the body
        document.body.appendChild(resultDiv);
    }

    // Wait for the page to load and then extract data
    window.addEventListener('load', () => {
        setTimeout(extractData, 3000);  // Wait a few seconds for the page to fully load
    });
})();
