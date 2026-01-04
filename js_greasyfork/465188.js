// ==UserScript==
// @name         Territorial.io AI Bot
// @version      0.1
// @description  AI bot which plays territorial.io in a smart and efficient manner.
// @author       Musa Soruklu
// @match        https://territorial.io/
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js
// @namespace https://greasyfork.org/users/1070617
// @downloadURL https://update.greasyfork.org/scripts/465188/Territorialio%20AI%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/465188/Territorialio%20AI%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script running...');

    const injectCode = `
console.log('Code has been successfully Injected');

window.updateLeaderboardData = function() {
    window.leaderboardData = [];
    for (let i = 0; i < R.length; i++) {
        const score = bU[i];
        window.leaderboardData.push({ rank: R[i], name: gI[i], index: H[i], score: score, troops: ax[i] });
    }
}
`;

    function getAdditionalHTML() {
        return `
        <button id="toggle-top10-chart" style="position: absolute; top: 10px; right: 10px;">Toggle Top 10 Chart</button>
        <div id="chart-container" style="display: none; position: absolute; top: 50px; right: 10px; width: 400px; height: 400px; background-color: white; border: 1px solid black; padding: 10px; z-index: 1000;">
            <canvas id="score_to_troops_chart"></canvas>
        </div>
    `;
    }

    console.log('Sending GM_xmlhttpRequest...');

    GM_xmlhttpRequest({
        method: "GET",
        url: document.location.origin,
        onload: res => {
            console.log('GM_xmlhttpRequest response received...');
            let html = res.responseText;

            // Inject code to store leaderboard data in a global variable inside the bp function
            const targetCode = 'H[S]=b8+Y++}g()';
            const parts = html.split(targetCode);
            const firstPart = parts.slice(0, 1).join(targetCode);
            const rest = parts.slice(1).join(targetCode);
            html = firstPart + targetCode + injectCode + rest;

            console.log('Injecting code to remove annonymous function, this makes all functions/variables available to my script...');
            html = html.replace('    (function () {', '');
            html = html.replace('    })();', '');
            // Append the button and chart container HTML
            html += getAdditionalHTML();
            //console.log(html);

            document.open();
            document.write(html);
            document.close();

            // Call the initScript function after the document has been written
            unsafeWindow.initScript();
        }
    });
})();

unsafeWindow.printLeaderboard = function() {
    unsafeWindow.updateLeaderboardData();
    const leaderboardData = unsafeWindow.leaderboardData;
    if (!leaderboardData) {
        console.log("Leaderboard data is not available yet.");
        return;
    }
    console.log('Leaderboard:');
    for (const entry of leaderboardData) {
        console.log(`${entry.rank} ${entry.name} (Index: ${entry.index}, Score: ${entry.score}, Troops: ${entry.troops})`);
    }
};



function createToggleButton() {
    const button = document.getElementById('toggle-top10-chart');
    button.textContent = 'Toggle Top 10 weakest players Chart';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.right = '10px';
    document.body.appendChild(button);

    button.onclick = () => {
        const chartContainer = document.getElementById('chart-container');
        chartContainer.style.display = chartContainer.style.display === 'none' ? 'block' : 'none';
    };
    return button;
}

// Define a function called 'createChartContainer'
function createChartContainer() {
    // Create a new 'div' element for the chart container
    const container = document.createElement('div');
    // Set the properties for the chart container element
    container.id = 'chart-container';
    container.style.display = 'none';
    container.style.position = 'absolute';
    container.style.top = '50px';
    container.style.right = '10px';
    container.style.width = '600px';
    container.style.height = '400px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
    container.style.zIndex = '1000';
    // Append the chart container element to the body of the document
    document.body.appendChild(container);
    // Return the chart container element
    return container;
}

function createChartCanvas(container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'score_to_troops_chart';
    container.appendChild(canvas);
    return canvas;
}

// Define a function called 'initializeChart' that takes a canvas element as an argument
function initializeChart(canvas) {
    // Get the 2D rendering context for the canvas element
    const chartContext = canvas.getContext('2d');
    // Create a new Chart object with the specified context, chart type, data, and options
    const chart = new Chart(chartContext, {
        type: 'bar', // Chart type is set to 'bar'
        data: {
            labels: [], // Initialize empty labels array for the chart
            datasets: [{
                label: 'Top 10 most vulnerable Players', // Title for the dataset
                data: [], // Initialize empty data array for the chart
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Set the background color for the bars
                borderColor: 'rgba(75, 192, 192, 1)', // Set the border color for the bars
                borderWidth: 1 // Set the border width for the bars
            }]
        },
        options: {
            indexAxis: 'y', // Set the index axis to 'y' (bar chart will be horizontal)
            scales: {
                x: {
                    title: {
                        display: true, // Display the x-axis title
                        text: 'Score-to-Troops Ratio' // Set the text for the x-axis title
                    }
                },
                y: {
                    title: {
                        display: true, // Display the y-axis title
                        text: 'Player Name' // Set the text for the y-axis title
                    }
                }
            }
        }
    });
    // Return the initialized chart object
    return chart;
}

function updateTop10Chart(chart) {
    unsafeWindow.updateLeaderboardData();
    const leaderboardData = unsafeWindow.leaderboardData;
    if (!leaderboardData) {
        console.log("Leaderboard data is not available yet.");
        return;
    }

    // Sort the data by the highest score-to-troops ratio
    leaderboardData.sort((a, b) => (b.score / b.troops) - (a.score / a.troops));

    // Get the top 10 players or all the players if there are less than 10
    const topPlayers = leaderboardData.slice(0, Math.min(10, leaderboardData.length));

    chart.data.labels = topPlayers.map(player => player.name);
    chart.data.datasets[0].data = topPlayers.map(player => player.score / player.troops);
    chart.update();
}

// Define a function called 'getBorderingPlayers'
function getBorderingPlayers() {
    // Call the 'updateLeaderboardData' function to update the leaderboard data
    unsafeWindow.updateLeaderboardData();
    // Get the updated leaderboard data from the 'unsafeWindow' object
    const leaderboardData = unsafeWindow.leaderboardData;
    // Create a Set of the local player's pixels
    const localPlayerPixels = new Set(unsafeWindow.bM[0]);
    // Create a Set for bordering players and bordering pixels
    const borderingPlayers = new Set();
    const borderingPixels = new Set();
    // Loop through all other players in the game
    for (let playerIndex = 1; playerIndex < unsafeWindow.bM.length; playerIndex++) {
        // Create a Set of the current player's pixels
        const otherPlayerPixelsSet = new Set(unsafeWindow.bM[playerIndex]);
        // If the current player does not have any pixels, skip to the next player
        if (!otherPlayerPixelsSet) {
            continue;
        }
        // Loop through the local player's pixels
        for (const localPixel of localPlayerPixels) {
            // If the current player's pixels are adjacent to the local player's pixels, add the player index to the 'borderingPlayers' Set
            if (otherPlayerPixelsSet.has(localPixel - 4) || otherPlayerPixelsSet.has(localPixel + 4)) {
                borderingPlayers.add(playerIndex);
                // If the current player's pixel is to the left of the local player's pixel, add it to the 'borderingPixels' Set
                if (otherPlayerPixelsSet.has(localPixel - 4)) {
                    borderingPixels.add(localPixel - 4);
                }
                // If the current player's pixel is to the right of the local player's pixel, add it to the 'borderingPixels' Set
                if (otherPlayerPixelsSet.has(localPixel + 4)) {
                    borderingPixels.add(localPixel + 4);
                }
                // Exit the inner loop and move to the next player
                break;
            }
        }
    }
    // Convert the 'borderingPlayers' Set to an array of bordering player names
    const borderingPlayerNames = Array.from(borderingPlayers).map(playerIndex => {
        // Find the player data in the leaderboard data using the player index
        const playerData = leaderboardData.find(player => player.index === playerIndex);
        // If the player data exists, return the player's name; otherwise, return null
        return playerData ? playerData.name : null;
    }).filter(name => name !== null); // Remove any null values from the array
    // Return an object containing the bordering player names and bordering pixels
    return { borderingPlayerNames, borderingPixels };
}

unsafeWindow.printBorderingPlayers = function() {
    const { borderingPlayerNames, borderingPixels } = getBorderingPlayers();
    console.log('Bordering players:', borderingPlayerNames);
    console.log('Bordering pixels:', Array.from(borderingPixels));
};

// Define a function called 'hasUnoccupiedBorderPixel'
function hasUnoccupiedBorderPixel() {
    // Create a Set of the local player's pixels
    const localPlayerPixels = new Set(unsafeWindow.bM[0]);
    // Create a Set for bordering players
    const borderingPlayers = new Set();
    // Loop through all other players in the game
    for (let playerIndex = 1; playerIndex < unsafeWindow.bM.length; playerIndex++) {
        // Create a Set of the current player's pixels
        const otherPlayerPixelsSet = new Set(unsafeWindow.bM[playerIndex]);
        // If the current player does not have any pixels, skip to the next player
        if (!otherPlayerPixelsSet) {
            continue;
        }
        // Loop through the local player's pixels
        for (const localPixel of localPlayerPixels) {
            // If the current player's pixels are adjacent to the local player's pixels, add the player index to the 'borderingPlayers' Set
            if (otherPlayerPixelsSet.has(localPixel - 4) || otherPlayerPixelsSet.has(localPixel + 4)) {
                borderingPlayers.add(playerIndex);
                // Exit the inner loop and move to the next player
                break;
            }
        }
    }
    // Check if there are no bordering players (unoccupied border pixel exists)
    return borderingPlayers.size === 0;
}


unsafeWindow.printUnoccupiedBorderPixelStatus = function() {
    const hasUnoccupiedPixel = hasUnoccupiedBorderPixel();
    console.log('Has unoccupied border pixel:', hasUnoccupiedPixel);
};

// Declare an asynchronous function called 'playGame' that takes 'logContainer' as an argument
async function playGame(logContainer) {
    // Check if there is an unoccupied border pixel
    const hasUnoccupiedPixel = hasUnoccupiedBorderPixel();
    // If there is an unoccupied pixel
    if (hasUnoccupiedPixel) {
        // Move to the unoccupied pixel
        unsafeWindow.fL(0, 512, 500);
        // Log the AI action to the 'logContainer'
        logContainer.innerHTML += 'AI action: Moving to unoccupied pixel<br>';
        // Scroll to the bottom of the 'logContainer'
        logContainer.scrollTop = logContainer.scrollHeight;
    } else {
        // If there is no unoccupied pixel, get the bordering players and their pixels
        const { borderingPlayerNames, borderingPixels } = getBorderingPlayers();
        // If there are bordering players
        if (borderingPlayerNames.length > 0) {
            // Update the leaderboard data
            unsafeWindow.updateLeaderboardData();
            // Get the leaderboard data
            const leaderboardData = unsafeWindow.leaderboardData;
            // Filter the bordering player data
            const borderingPlayerData = leaderboardData.filter(player => borderingPlayerNames.includes(player.name));
            // Sort the bordering player data based on their score and troops
            borderingPlayerData.sort((a, b) => {
                const scoreDiff = b.score - a.score;
                if (scoreDiff !== 0) {
                    return scoreDiff;
                }
                return a.troops - b.troops;
            });
            // Get the target player to attack
            const targetPlayer = borderingPlayerData[0];
            // Attack the target player
            unsafeWindow.fL(0, targetPlayer.index, 500);
            // Log the AI action to the 'logContainer'
            logContainer.innerHTML += `AI action: Attacking ${targetPlayer.name}<br>`;
            // Scroll to the bottom of the 'logContainer'
            logContainer.scrollTop = logContainer.scrollHeight;
            // Get the local player data
            const localPlayer = leaderboardData.find(player => player.index === 0);
            // Get the very weak cities to eliminate
            const veryWeakCities = borderingPlayerData.filter(player => player.score <= localPlayer.score * 0.1);
            // Iterate over the very weak cities
            for (const weakCity of veryWeakCities) {
                // Attempt to eliminate the very weak city
                unsafeWindow.fL(0, weakCity.index, 100);
                // Log the AI action to the 'logContainer'
                logContainer.innerHTML += `AI action: Attempting to eliminate very weak city (${weakCity.name})<br>`;
                // Scroll to the bottom of the 'logContainer'
                logContainer.scrollTop = logContainer.scrollHeight;
            }
        }
    }
    // If the AI is active, call the 'playGame' function again after a 5-second delay
    if (aiActive) {
        setTimeout(() => playGame(logContainer), 5000); // Update the timeout to 5 seconds
    }
}

// Move the aiActive variable declaration to a higher scope
let aiActive = false;

function createToggleAIButton() {
    const button = document.createElement('button');
    button.id = 'toggle-ai';
    button.textContent = 'Toggle AI';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    document.body.appendChild(button);

    const aiStatusLabel = document.createElement('span');
    aiStatusLabel.id = 'ai-status-label';
    aiStatusLabel.textContent = 'AI: OFF';
    aiStatusLabel.style.position = 'absolute';
    aiStatusLabel.style.top = '10px';
    aiStatusLabel.style.left = '90px';
    aiStatusLabel.style.color = 'red';
    document.body.appendChild(aiStatusLabel);

    button.onclick = () => {
        aiActive = !aiActive;
        if (aiActive) {
            aiStatusLabel.textContent = 'AI: ON';
            aiStatusLabel.style.color = 'green'; // Change color to green when AI is ON
            setTimeout(() => playGame(aiLog), 5000); // Call playGame with setTimeout instead of setInterval
            console.log('AI started');
        } else {
            aiStatusLabel.textContent = 'AI: OFF';
            aiStatusLabel.style.color = 'red'; // Change color to red when AI is OFF
            console.log('AI stopped');
        }
    };
    return button;
}

function createAILog() {
    const logContainer = document.createElement('div');
    logContainer.id = 'ai-log-container';
    logContainer.style.position = 'absolute';
    logContainer.style.top = '40px';
    logContainer.style.left = '10px';
    logContainer.style.width = '300px';
    logContainer.style.height = '100px';
    logContainer.style.overflowY = 'scroll';
    logContainer.style.border = '1px solid black';
    logContainer.style.padding = '10px';
    logContainer.style.backgroundColor = 'white';
    document.body.appendChild(logContainer);
    return logContainer;
}


// Declare a variable called 'aiLog'
let aiLog;
// Add a new function called 'initScript' to the 'unsafeWindow' object
unsafeWindow.initScript = function() {
    // Create a toggle button for the chart
    const toggleButton = createToggleButton();
    // Create a toggle button for the AI
    const toggleAIButton = createToggleAIButton();
    // Create a container for the chart
    const chartContainer = createChartContainer();
    // Create a canvas element inside the chart container
    const chartCanvas = createChartCanvas(chartContainer);
    // Initialize the chart on the canvas element
    const chart = initializeChart(chartCanvas);
    // Create an AI log container
    aiLog = createAILog();
    // Add the chart to the 'unsafeWindow' object
    unsafeWindow.chart = chart;

    // Set the 'onclick' event for the toggle button
    toggleButton.onclick = () => {
        // Toggle the display of the chart container between 'block' and 'none'
        chartContainer.style.display = chartContainer.style.display === 'none' ? 'block' : 'none';

        // If the chart container is visible
        if (chartContainer.style.display !== 'none') {
            // Update the Top 10 chart
            updateTop10Chart(chart);

            // Schedule the next chart update after 1 second (1000 milliseconds)
            setTimeout(() => {
                // If the chart container is still visible, update the Top 10 chart
                if (chartContainer.style.display !== 'none') {
                    updateTop10Chart(chart);
                }
            }, 1000);
        }
    };
};

