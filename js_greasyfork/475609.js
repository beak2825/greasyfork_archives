// ==UserScript==
// @name         Busting reminder
// @namespace    http://torn.city.com.dot.com.com
// @version      0.7.2
// @description  Guess how many busts you can do without getting jailed
// @author       Adobi
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475609/Busting%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/475609/Busting%20reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// USER DEFINED VARIABLES
    let maxScore = 0; // If set to 0, script will determine your max bust capacity based on log.
    // END OF USER DEFINED VARIABLES

    function findLongestSequence(timestampArray) {
        const period = 24 * 60 * 60 * 3
        let longestSequence = 0;
        let currentSequence = 1;
        let currentMin = timestampArray[0];
        let currentMax = timestampArray[0];
        let firstTimestamp = 0;

        for (let i = 1; i < timestampArray.length; i++) {
            const TS = timestampArray[i];
            if ((currentMin - TS) <= period && (currentMax - TS) <= period) {
                currentSequence++;
                currentMin = Math.min(currentMin, TS);
                currentMax = Math.max(currentMax, TS);
            } else {
                if (longestSequence < currentSequence) { firstTimestamp = currentMin; }
                longestSequence = Math.max(longestSequence, currentSequence);
                currentSequence = 1;
                currentMin = TS;
                currentMax = TS;
            }
        }
        console.log(firstTimestamp)

        /*
        let score = 0;
        let localScore = 0

        for (let i = 0; i < timestampArray.length; i++) {
            if (firstTimestamp <= timestampArray[i]) {
                const hours = (timestampArray[i] - firstTimestamp) / 60 / 60;
                const tenHours = hours / 7.2;
                if (hours <= 72) {
                    localScore = 128 / Math.pow(2, tenHours);
                    score += localScore;
                    console.log(hours + " - " + localScore)
                }
            }
        } */
        let currentMaxScore = 0;
        for (let i = 0; i < timestampArray.length - longestSequence; i++) {
            let score = 0;
            let localScore = 0
            const initial_timestamp = timestampArray[i];
            for (let j = 0; j < longestSequence; j++) {
                const hours = (initial_timestamp - timestampArray[i+j]) / 60 / 60;
                const tenHours = hours / 7.2;
                localScore = 128 / Math.pow(2, tenHours);
                score += localScore;
            }
            currentMaxScore = Math.max(currentMaxScore, score);
        }
        return [Math.max(longestSequence, currentSequence), currentMaxScore];
    }



    // Function to create and display yellow square with the option to enter API key
    function displayYellowSquare() {
        const yellowSquare = document.createElement('div');
        yellowSquare.id = 'yellowSquare';
        yellowSquare.style.position = 'fixed';
        yellowSquare.style.left = '0';
        yellowSquare.style.top = '0';
        yellowSquare.style.color = 'black';
        yellowSquare.style.top = '100px';
        yellowSquare.style.width = '100px';
        yellowSquare.style.height = '100px';
        yellowSquare.style.backgroundColor = 'yellow';
        yellowSquare.style.zIndex = '99999999';
        yellowSquare.style.display = 'flex'; // Use flexbox for centering
        yellowSquare.style.cursor = 'pointer'; // Change cursor to pointer

        // Create a container div for centered text
        const textContainer = document.createElement('div');
        textContainer.style.margin = 'auto'; // Center horizontally
        textContainer.style.textAlign = 'center'; // Center text
        textContainer.style.display = 'flex';
        textContainer.style.flexDirection = 'column'; // Center vertically

        // Create text nodes for the yellow square with a line break
        const yellowTextNode0 = document.createTextNode('Busting reminder');
        const lineBreak = document.createElement('br');
        const yellowTextNode1 = document.createTextNode('Click here to supply full access API key');


        // Append the text nodes and line break to the text container
        textContainer.appendChild(yellowTextNode0);
        textContainer.appendChild(lineBreak);
        textContainer.appendChild(yellowTextNode1);

        // Append the text container to the yellow square
        yellowSquare.appendChild(textContainer);

        // Append the yellow square to the body (if it's not already added)
        if (!document.getElementById('yellowSquare')) {
            document.body.appendChild(yellowSquare);
        }

        // Add a click event listener to the yellow square
        yellowSquare.addEventListener('click', () => {
            const apiKey = prompt('Enter your full access API key:');
            if (apiKey) {
                // Store the API key with GM_setValue
                GM_setValue('busting_api_key', apiKey);
                yellowSquare.remove(); // Remove the yellow square after entering the API key
                fetchAndDisplayData(); // Run an API call with the new key
            }
        });
    }

    // Function to fetch API data
    function fetchAndDisplayData() {
        const currentTime = Date.now()/1000;
        const apiKey = GM_getValue('busting_api_key', '');
        // If the API key is not stored, display the yellow square
        if (!apiKey) {
            displayYellowSquare();
            return;
        }
        const url = `https://api.torn.com/user/?selections=log&log=5360&key=${apiKey}`
        const timestamps = [];
        let mostBustsIn72h = 0;
        let last24h = 0;
        let last72h = 0;
        fetch(url)
            .then(response => response.json())
            .then(data => {
            if (data.error) {
                if (data.error.error === "Incorrect key" || data.error.error === "Access level of this key is not high enough") {
                    GM_setValue('busting_api_key', "");
                    displayYellowSquare();
                } else { return; }
            } else {
                // Counts how many busts you've done in last 72h and 24h.
                let score = 0;
                let localScore = 0
                for (const entry in data['log']) {
                    timestamps.push(data['log'][entry]['timestamp']);
                    const hours = (currentTime - data['log'][entry]['timestamp']) / 60 / 60;
                    const tenHours = hours / 7.2;
                    if (hours <= 72) {
                        localScore = 128 / Math.pow(2, tenHours);
                        score += localScore;
                    }
                    if (data['log'][entry]['timestamp'] > currentTime - 24 * 60 * 60 * 3) {
                        last72h++;
                        if (data['log'][entry]['timestamp'] > currentTime - 24 * 60 * 60) {
                            last24h++;
                        }
                    }
                }

                if (maxScore === 0) {
                    const sequenceAndScore = findLongestSequence(timestamps);
                    mostBustsIn72h = sequenceAndScore[0];
                    maxScore = Math.floor(sequenceAndScore[1]);
                }
                const currentAvailableBusts = (maxScore - score) / 128;
                console.log(score.toFixed(0) + " current bust score out of a maximum " + maxScore + ", " + currentAvailableBusts.toFixed(2) + " busts available.");

                let jailLink = document.querySelector('div#nav-jail');
                let jailLinkText = jailLink.querySelector('.linkName___FoKha');

                // Check if there's an existing text element and remove it
                let existingTextElement = jailLinkText.parentNode.querySelector('.bust-guesser');
                if (existingTextElement) {
                    existingTextElement.remove();
                }

                const newSpan = document.createElement('p');
                newSpan.className = 'linkName___FoKha bust-guesser';
                newSpan.style.color = 'red';
                if (currentAvailableBusts <= 0) { newSpan.style.color = 'green'; }
                newSpan.style.float = 'right';
                newSpan.style.paddingRight = '5px';
                newSpan.textContent = Math.floor(score) + "/" + maxScore + ": " + Math.floor(currentAvailableBusts);
                jailLinkText.parentNode.appendChild(newSpan);
            }
        });
    }

    fetchAndDisplayData()
    setInterval(fetchAndDisplayData, 10 * 60 * 1000);
    //displayYellowSquare() //debugging
})();
