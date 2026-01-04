// ==UserScript==
// @name         GeoGuessr Highscore Date mockup
// @description  Adds game date for highscores
// @version      0.1
// @author       Tyow#3742
// @match        *://*.geoguessr.com/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1011193
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/511067/GeoGuessr%20Highscore%20Date%20mockup.user.js
// @updateURL https://update.greasyfork.org/scripts/511067/GeoGuessr%20Highscore%20Date%20mockup.meta.js
// ==/UserScript==

// Function to fetch game data from the API and extract the start date
async function fetchGameDate(gameId) {
    const url = `https://www.geoguessr.com/api/v3/games/${gameId}`;

    try {
        const response = await fetch(url);

        // If the response is successful
        if (response.ok) {
            const gameData = await response.json();

            // Extract the startTime of the first round
            const startTime = gameData.rounds[0].startTime;

            // Convert the startTime to a Date object and format it as yyyy-mm-dd
            const date = new Date(startTime).toISOString().split('T')[0];

            return date;
        } else {
            console.error(`Error fetching game data: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }

    return null; // Return null if there is an error
}

const fetchIds = async () => {


    // Select all the rows
    const rows = document.querySelectorAll('[class^="table_tr__"]');

    // Loop through each row and extract the gameid
    rows.forEach(async row => {
        // Find the link element within the row
        if (!row.classList.contains('highscoredate')) {
            const resultLink = row.querySelector('a[title="View results"]');

            // Extract the href attribute
            if (resultLink) {
                const href = resultLink.getAttribute('href');

                // Use a regular expression to match and extract the gameid
                const gameIdMatch = href.match(/\/results\/([a-zA-Z0-9]+)/);


                if (gameIdMatch && gameIdMatch[1]) {
                    row.classList.add('highscoredate')
                    const gameId = gameIdMatch[1];

                    const gameDate = await fetchGameDate(gameId);

                    if (gameDate) {
                        // Create a new td element
                        const newTd = document.createElement('td');

                        // Add the same classes as the other td elements in the row
                        newTd.classList.add(
                            'table_td__Z9pLI',
                            'table_textAlignLeft__8vcyr',
                            'table_noWrap__L4__t',
                            'map-highscore_colBody__Jp0zE'
                        );

                        // Set the text content to the extracted date
                        newTd.textContent = gameDate;

                        // Append the new td to the current row
                        row.appendChild(newTd);

                    }
                }
            }}});

}



new MutationObserver(async (mutations) => {
    fetchIds()
}).observe(document.body, { subtree: true, childList: true });