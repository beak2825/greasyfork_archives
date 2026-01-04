// ==UserScript==
// @name         Item stalker
// @namespace    http://torn.city.com.dot.com.com
// @version      0.2
// @description  Check supplied item IDs and list prices with colors
// @author       Adobi
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479255/Item%20stalker.user.js
// @updateURL https://update.greasyfork.org/scripts/479255/Item%20stalker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///////////////////////////////// USER DEFINED VARIABLES /////////////////////////////////

    const itemIDs = [817,818];
    const itemNames = ['alcohol', 'energy drinks'];
    const desiredPrices = [990000, 16000000]
    const leftAligned = false; // select true for left aligned, false for right aligned

    ////////// END OF USER DEFINED VARIABLES. Change things below at your own risk. //////////

    // Function to create and display yellow square with the option to enter API key
    function displayYellowSquare() {
        const yellowSquare = document.createElement('div');
        yellowSquare.id = 'yellowSquare';
        yellowSquare.style.position = 'fixed';
        yellowSquare.style.left = '0';
        yellowSquare.style.top = '0';
        yellowSquare.style.color = 'black';
        yellowSquare.style.top = '300px';
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
        const yellowTextNode0 = document.createTextNode('Busting friends');
        const lineBreak = document.createElement('br');
        const yellowTextNode1 = document.createTextNode('Click here to');
        const lineBreak2 = document.createElement('br');
        const yellowTextNode2 = document.createTextNode('supply public API key');

        // Append the text nodes and line break to the text container
        textContainer.appendChild(yellowTextNode0);
        textContainer.appendChild(lineBreak);
        textContainer.appendChild(yellowTextNode1);
        textContainer.appendChild(lineBreak2);
        textContainer.appendChild(yellowTextNode2);

        // Append the text container to the yellow square
        yellowSquare.appendChild(textContainer);

        // Append the yellow square to the body (if it's not already added)
        if (!document.getElementById('yellowSquare')) {
            document.body.appendChild(yellowSquare);
        }

        // Add a click event listener to the yellow square
        yellowSquare.addEventListener('click', () => {
            const apiKey = prompt('Enter your API key:');
            if (apiKey) {
                // Store the API key with GM_setValue
                GM_setValue('item_stalk_api_key', apiKey);
                yellowSquare.remove(); // Remove the yellow square after entering the API key
                fetchAndDisplayData(); // Run an API call with the new key
            }
        });
    }

    // Check if the API key is already stored using GM_getValue
    const apiKey = GM_getValue('item_stalk_api_key', '');

    // If the API key is not stored, display the yellow square
    if (!apiKey) {
        displayYellowSquare();
    }

    function displayText(bustlist, links, difficulty) {
        // Check if the text container already exists and remove it
        const existingTextContainer = document.getElementById('item-stalk-container-id');
        if (existingTextContainer) {
            existingTextContainer.remove();
        }

        const mainContainer = document.getElementById('mainContainer'); // Get the main container element

        if (mainContainer) {
            const textContainer = document.createElement('div');
            textContainer.id = 'item-stalk-container-id';
            textContainer.style.position = 'fixed';
            if (leftAligned) {
                textContainer.style.left = '0';
            } else {
                textContainer.style.right = '0';
            }
            textContainer.style.top = '100px';
            textContainer.style.zIndex = '9999';
            textContainer.style.display = 'block';

            for (let j = 0; j < bustlist.length; j++) {
                const link = document.createElement('a');
                link.href = links[j];
                link.textContent = bustlist[j] + difficulty[j];
                if (difficulty[j] < desiredPrices[j]) {
                    link.style.color = '#00FF00';
                } else {
                    link.style.color = 'red';
                }
                link.style.display = 'block';
                link.style.marginBottom = '2px';
                textContainer.appendChild(link);
            }

            mainContainer.appendChild(textContainer); // Append textContainer to mainContainer
        }
        displayBlackSquare(4 + bustlist.length * Math.round(125 / 9));
    }

    // Function to create and display the black square
    function displayBlackSquare(squareHeight) {
        const existingSquare = document.getElementById('item_stalk_blackSquare');
        if (existingSquare) {
            existingSquare.remove();
        }
        if (squareHeight > 4 ) {
            const mainContainer = document.getElementById('mainContainer'); // Get the main container element
            const blackSquare = document.createElement('div');
            blackSquare.id = 'item_stalk_blackSquare';
            blackSquare.style.position = 'fixed';
            if (leftAligned) {
                blackSquare.style.left = '0';
            } else {
                blackSquare.style.right = '0';
            }
            blackSquare.style.top = '98px';
            blackSquare.style.width = '260px';
            blackSquare.style.height = squareHeight + 'px';
            blackSquare.style.backgroundColor = '#191919';
            blackSquare.style.zIndex = '999';

            if (!document.getElementById('item_stalk_blackSquare')) {
                mainContainer.appendChild(blackSquare);
            }
        }
    }

    // Function to fetch API data for a single faction
    function fetchFactionData(factionID, apiKey, name) {
        return fetch(`https://api.torn.com/market/${factionID}?selections=bazaar,itemmarket&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
            const faction_and_name = [];
            const profile_link = [];
            const difficulty = [];

            // Check if there's an error in the API response
            if (data.error && data.error.error === 'Incorrect key') {
                GM_setValue('item_stalk_api_key', '');
                displayYellowSquare();
            } else {
                const mathyhelp = Math.min(data['itemmarket'][0]['cost'], data['bazaar'][0]['cost']);
                faction_and_name.push(name + " - ");
                profile_link.push('https://www.torn.com/imarket.php#/p=shop&step=shop&type=' + factionID);
                difficulty.push(mathyhelp);
            }

            return { faction_and_name, profile_link, difficulty };
        })
            .catch(error => {
            console.error('there was an API Error:', error);
            return { faction_and_name: [], profile_link: [], difficulty: [] };
        });
    }

    // Function to fetch API data and display the red square
    function fetchAndDisplayData() {
        const currentTime = Date.now();
        const lastCallTime = GM_getValue('item_stalk_lastCallTime', 0);

        // Check if at least 30 seconds have passed since the last API call
        if (currentTime - lastCallTime >= 30000) {
            // Check if the API key is already stored using GM_getValue
            const apiKey = GM_getValue('item_stalk_api_key', '');
            // If the API key is not stored, display the yellow square
            if (!apiKey) {
                displayYellowSquare();
            }

            const fetchPromises = [];
            GM_setValue('item_stalk_lastCallTime', currentTime); // Store the current timestamp
            for (let i = 0; i < itemIDs.length; i++) {
                const promise = fetchFactionData(itemIDs[i], apiKey, itemNames[i]);
                fetchPromises.push(promise);
            }

            Promise.all(fetchPromises)
                .then(results => {
                const faction_and_name = [];
                const profile_link = [];
                const difficulty = [];

                results.forEach(result => {
                    faction_and_name.push(...result.faction_and_name);
                    profile_link.push(...result.profile_link);
                    difficulty.push(...result.difficulty);
                });
                if (profile_link.length > 0) {
                    GM_setValue('item_stalk_fan', faction_and_name);
                    GM_setValue('item_stalk_pl', profile_link);
                    GM_setValue('item_stalk_t', difficulty);
                    displayText(faction_and_name, profile_link, difficulty);
                } else {
                    GM_setValue('item_stalk_fan', "");
                    GM_setValue('item_stalk_pl', "");
                    GM_setValue('item_stalk_t', "");
                }
            });
        } else {
            displayText(GM_getValue('item_stalk_fan'), GM_getValue('item_stalk_pl'), GM_getValue('item_stalk_t'));
        }
    }

    // Repeat every 5 seconds
    fetchAndDisplayData();
    setInterval(fetchAndDisplayData, 5000);
})();
