// ==UserScript==
// @name         Steam Friend Ranking Based on Steam Levels
// @author       Struki
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fetches Steam levels from public profiles and ranks user on friends' friend lists
// @match        *://steamcommunity.com/*/*/friends*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510020/Steam%20Friend%20Ranking%20Based%20on%20Steam%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/510020/Steam%20Friend%20Ranking%20Based%20on%20Steam%20Levels.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const yourSteamID = null;
    let yourSteamLevel = 0;
    const maxConcurrentRequests = 5; // Limit the number of concurrent requests

    // UI: Adding options to initiate the script
    function addOptionsUI() {
        const titleBar = document.querySelector('.profile_friends.title_bar');
        if (titleBar) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'ranking_controls';
            controlContainer.style.cssText = `
                margin: 10px 0;
                display: flex;
                gap: 10px;
                align-items: center;
            `;

            // Create select input for Steam ID options
            const selectInput = document.createElement('select');
            selectInput.innerHTML = `
                <option value="Level">Steam Level</option>
                <option value="me">My Steam Profile</option>
                <option value="viewing">Current Friend's Profile</option>
            `;
            controlContainer.appendChild(selectInput);

            // Input for Steam Level
            const LevelInput = document.createElement('input');
            LevelInput.type = 'number';
            LevelInput.placeholder = 'Enter Steam Level';
            controlContainer.appendChild(LevelInput);

            // Create a button to start the ranking process
            const startButton = document.createElement('button');
            startButton.textContent = 'Start Ranking';
            controlContainer.appendChild(startButton);

            // Event listener for the dropdown selection
            selectInput.addEventListener('change', () => {
                if (selectInput.value === 'Level') {
                    LevelInput.style.display = 'inline-block';
                } else {
                    LevelInput.style.display = 'none';
                }
            });

            // Event listener for the start button
            startButton.addEventListener('click', async () => {
                if (selectInput.value === 'Level' && LevelInput.value) {
                    // Get 'yourSteamLevel' from LevelInput.value, then addRank();
                    yourSteamLevel = parseInt(LevelInput.value);
                    if (!isNaN(yourSteamLevel)) {
                        console.log(`Your Steam Level: ${yourSteamLevel}`);
                        addRanking();
                    } else {
                        console.error('Failed to read Level.');
                    }
                } else if (selectInput.value === 'me') {
                    // Get steamid from your own account
                    const steamIDMatch = document.querySelector('a.user_avatar.playerAvatar');
                    if (steamIDMatch) {
                        const steamID = steamIDMatch.href.split('/').pop();
                        yourSteamID = steamID; // Store your Steam ID
                        yourSteamLevel = await getSteamLevel(yourSteamID); // Fetch your Steam level
                        if (yourSteamLevel) {
                            addRanking();
                        } else {
                            console.error('Failed to fetch your Steam profile or level.');
                        }
                    } else {
                        console.error('Failed to fetch your Steam ID.');
                    }
                } else if (selectInput.value === 'viewing') {
                    // Get steamid from person who's friendlist you are viewing
                    const friendIDMatch = document.querySelector('.friends_header_avatar a');
                    if (friendIDMatch) {
                        const friendSteamID = friendIDMatch.href.split('/').pop();
                        yourSteamLevel = await getSteamLevel(friendSteamID); // Fetch the friend's Steam level
                        if (yourSteamLevel) {
                            addRanking();
                        } else {
                            console.error('Failed to fetch current friend\'s Steam ID.');
                        }
                    } else {
                        console.error('Failed to fetch current friend\'s Steam ID.');
                    }
                } else {
                    console.error('Please select a valid option and enter a Steam ID if necessary.');
                }
            });
            // Insert the control container into the DOM
            titleBar.insertAdjacentElement('afterend', controlContainer);
        } else {
            console.error('Failed to find title bar to insert options.');
        }
    }


    // Function to scrape a user's Steam level from their profile
    async function getSteamLevel(steamID) {
        const profileUrl = `https://steamcommunity.com/profiles/${steamID}/`;

        try {
            const response = await fetch(profileUrl);
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const levelElement = doc.querySelector('.friendPlayerLevelNum');
            const level = levelElement ? parseInt(levelElement.innerText.trim()) : null;

            if (level === null) {
                console.log(`Could not fetch Steam level for Steam ID: ${steamID}. The profile might be private.`);
            }

            return level;
        } catch (error) {
            console.error(`Error scraping Steam level for Steam ID: ${steamID}`, error);
            return null;
        }
    }

    // Function to scrape the friend's list of a friend and their Steam levels
    async function fetchFriendsLevels(friendSteamID, friendName, friendBlock) {
        const profileUrl = `https://steamcommunity.com/profiles/${friendSteamID}/friends/`;

        try {
            const response = await fetch(profileUrl);
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const friendsElements = doc.querySelectorAll('.friend_block_v2');
            const friendsSteamIDs = Array.from(friendsElements).map(el => el.getAttribute('data-steamid'));

            console.log(`Fetched ${friendsSteamIDs.length} friends for Steam ID: ${friendSteamID} (${friendName})`);

            // Limit the number of concurrent requests
            const friendsLevels = [];
            let percent = 1;
            for (let i = 0; i < friendsSteamIDs.length; i += maxConcurrentRequests) {
                const levelPromises = friendsSteamIDs.slice(i, i + maxConcurrentRequests).map(async (steamID, index) => {
                    const level = await getSteamLevel(steamID);
                    console.log(`${friendName}: ${index + i + 1}/${friendsSteamIDs.length} Steam ID: ${steamID}, Level: ${level}`); // Added log
                    if(i/friendsSteamIDs.length >= (percent/10))
                    {
                        console.log(`Progress: ${percent*10}%`);

                        // Update progress in the DOM (Ensure this only updates the friendBlock UI once per batch)
                        const progressElement = friendBlock.querySelector('.ranking_white');
                        if (progressElement) {
                            progressElement.textContent = `Progress: ${percent * 10}%`; // Just an example of progress display
                        } else {
                            const newprogressElement = document.createElement('div');
                            newprogressElement.className = 'ranking_white';
                            newprogressElement.style.cssText = `
                            position: absolute;
                            top: 2px;
                            right: -2px;
                            font-weight: bold;
                            font-size: 11px;
                            color: #6a6e70; //grey
                            background-color: rgba(29, 35, 42, 0.6);
                            padding: 2px 6px;
                            border-radius: 3px;
                        `;
                            newprogressElement.textContent = `Progress: ${percent * 10}%`;
                            friendBlock.querySelector('.friend_block_content').insertAdjacentElement('afterend', newprogressElement);
                        }
                        percent++;
                    }
                    return level;
                });
                const levels = await Promise.all(levelPromises);
                friendsLevels.push(...levels.filter(level => level !== null)); // Filter out null levels
            }
            // Remove the progress element before leaving
            const progressElement = friendBlock.querySelector('.ranking_white');
            if (progressElement) {
                progressElement.remove(); // Remove the whole ranking element
            }

            return friendsLevels;
        } catch (error) {
            console.error(`Error fetching friends' levels for Steam ID: ${friendSteamID} (${friendName})`, error);
            return [];
        }
    }

    // Function to compare levels and assign a rank based on friends' friends' levels
    function compareLevels(friendLevels) {
        const higherLevels = friendLevels.filter(level => level > yourSteamLevel);
        return higherLevels.length + 1;
    }

    // Main function to add the rank next to each friend's block
    async function addRanking() {
        const friendBlocks = document.querySelectorAll('.friend_block_v2');
        if (friendBlocks.length > 0) {
            for (let i = 0; i < friendBlocks.length; i++) {
                const friendBlock = friendBlocks[i];
                const friendSteamID = friendBlock.getAttribute('data-steamid');
                const friendName = friendBlock.querySelector('.friend_block_content').childNodes[0].textContent.trim(); // Extract the friend's name

                if (!friendBlock.querySelector('.ranking')) {
                    try {
                        console.log(`Fetching friends' levels for Steam ID: ${friendSteamID} (${friendName})`);
                        const friendLevels = await fetchFriendsLevels(friendSteamID, friendName, friendBlock);

                        let rankText = 'N/A';
                        let higherlevel = null;
                        let lowerlevel = null;
                        if (friendLevels.length > 0) {
                            const rank = compareLevels(friendLevels);
                            higherlevel = friendLevels.filter(level => level > yourSteamLevel);
                            lowerlevel = friendLevels.filter(level => level < yourSteamLevel);

                            if (higherlevel.length > 0) {
                                higherlevel = Math.min(...higherlevel);
                            }

                            // Calculate the highest lower level
                            if (lowerlevel.length > 0) {
                                lowerlevel = Math.max(...lowerlevel);
                            } else {
                                lowerlevel = null; // Explicitly set lowerlevel to null if no lower levels found
                            }

                            // Create the rank text with styled spans
                            const rankElement = document.createElement('div');
                            rankElement.className = 'ranking_white';
                            rankElement.style.cssText = `
                            position: absolute;
                            top: 2px;
                            right: -2px;  /* Move it to the side of the text */
                            font-weight: bold;
                            font-size: 11px;
                            color: #ebebeb; /* Default color for other text */
                            background-color: rgba(29, 35, 42, 0.6);
                            padding: 2px 6px;
                            border-radius: 3px;
                            z-index: 10; /* Ensure it's above other content */
                            `;

                            // Append the rank text with color coding
                            const rankTextElement = document.createElement('span');
                            rankTextElement.style.color = '#ebebeb'; // Color for "Rank: "
                            rankTextElement.textContent = `Rank: `;
                            rankElement.appendChild(rankTextElement);

                            const rankingValue = document.createElement('span');
                            rankingValue.style.color = '#f7ef8a'; // Gold color for the rank value
                            rankingValue.textContent = `${rank}`;
                            rankElement.appendChild(rankingValue);

                            const totalFriendsText = document.createElement('span');
                            totalFriendsText.style.color = '#ebebeb'; // Color for "(of ${friendLevels.length})"
                            totalFriendsText.textContent = ` (of ${friendLevels.length})`;
                            rankElement.appendChild(totalFriendsText);

                            rankElement.appendChild(document.createElement('br')); // Line break

                            // Handle higherlevel
                            if (higherlevel > yourSteamLevel) {
                                const nextText0 = document.createElement('span');
                                nextText0.style.color = '#ebebeb'; // whitish
                                nextText0.textContent = `Next: ${higherlevel} (`;
                                rankElement.appendChild(nextText0);

                                const nextText1 = document.createElement('span');
                                nextText1.style.color = '#80EF80'; // pastel green
                                nextText1.textContent = `+${higherlevel - yourSteamLevel}`;
                                rankElement.appendChild(nextText1);

                                const nextText2 = document.createElement('span');
                                nextText2.style.color = '#ebebeb'; // whitish
                                nextText2.textContent = `)`;
                                rankElement.appendChild(nextText2);
                                rankElement.appendChild(document.createElement('br')); // Line break

                            }

                            // Handle lowerlevel
                            if (lowerlevel != null) {
                                const prevText0 = document.createElement('span');
                                prevText0.style.color = '#ebebeb'; // whitish
                                prevText0.textContent = `Prev.: ${lowerlevel} (`;
                                rankElement.appendChild(prevText0);

                                const prevText1 = document.createElement('span');
                                prevText1.style.color = '#ff746c'; // pastel red
                                prevText1.textContent = `-${yourSteamLevel - lowerlevel}`;
                                rankElement.appendChild(prevText1);

                                const prevText2 = document.createElement('span');
                                prevText2.style.color = '#ebebeb'; // whitish
                                prevText2.textContent = `)`;
                                rankElement.appendChild(prevText2);
                            }

                            const friendContent = friendBlock.querySelector('.friend_block_content');
                            if (friendContent) {
                                friendContent.style.position = 'relative';
                                friendContent.insertAdjacentElement('afterend', rankElement);
                            } else {
                                console.error(`Could not find friend content block for Steam ID: ${friendSteamID}`);
                            }
                        } else {
                            // If no levels were fetched, mark as N/A
                            const rankElement = document.createElement('div');
                            rankElement.className = 'ranking_white';
                            rankElement.style.cssText = `
                            position: absolute;
                            top: 2px;
                            right: -2px;  /* Move it to the side of the text */
                            font-weight: bold;
                            font-size: 11px;
                            color: #ebebeb; /* Default color for other text */
                            background-color: rgba(0, 0, 0, 0);
                            padding: 2px 6px;
                            border-radius: 3px;
                            z-index: 10; /* Ensure it's above other content */
                            `;

                            // Mark as N/A for private profiles
                            const rankTextElement = document.createElement('span');
                            rankTextElement.style.color = '#6a6e70'; // grey
                            rankTextElement.textContent = `N/A`;
                            rankElement.appendChild(rankTextElement);

                            const friendContent = friendBlock.querySelector('.friend_block_content');
                            if (friendContent) {
                                friendContent.style.position = 'relative';
                                friendContent.insertAdjacentElement('afterend', rankElement);
                            } else {
                                console.error(`Could not find friend content block for Steam ID: ${friendSteamID}`);
                            }
                        }
                    } catch (error) {
                        console.error("Error ranking friend:", error);
                    }
                }
            }
        } else {
            console.log("No friend blocks found on the page.");
        }
    }

    // Add options UI when the page is ready
    window.onload = addOptionsUI;
})();
