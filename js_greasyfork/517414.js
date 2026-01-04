// ==UserScript==
// @name            Death Counter
// @name:ru         Счётчик Смертей
// @namespace       http://tampermonkey.net/
// @version         1.3
// @description     Count how many Deaths you got and log deaths by area. Disables the 'B' key for leaderboard deletion.
// @description:ru  Посчитай, сколько у тебя смертей, и это отключит клавишу B.
// @author          ArhaanJinnah
// @match           https://evades.io/*
// @icon            none
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/517414/Death%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/517414/Death%20Counter.meta.js
// ==/UserScript==

// Objects to track deaths
const playerDeathData = {}; // { playerName: { map: { area: deathCount } } }
const watchedPlayers = new Set(); // Set of players to track
const downedPlayers = new Set(); // Set of currently downed players

// Death counter UI container
const counterContainer = document.createElement('div');
counterContainer.style.position = 'fixed';
counterContainer.style.bottom = '10px';
counterContainer.style.right = '10px';
counterContainer.style.backgroundColor = '#333';
counterContainer.style.color = '#fff';
counterContainer.style.padding = '10px';
counterContainer.style.borderRadius = '5px';
counterContainer.style.display = 'none';
counterContainer.style.display = 'flex';
counterContainer.style.flexDirection = 'column';
counterContainer.style.alignItems = 'flex-start';
document.body.appendChild(counterContainer);

// Reset button
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.style.padding = '5px';
resetButton.style.cursor = 'pointer';
resetButton.style.backgroundColor = '#ff5c5c';
resetButton.style.color = '#fff';
resetButton.style.border = 'none';
resetButton.style.borderRadius = '5px';
resetButton.addEventListener('click', () => {
    watchedPlayers.forEach(playerName => {
        playerDeathData[playerName] = {};
    });
    updateDeathCounters();
});

// Create the Toggle Size Button
const toggleSizeButton = document.createElement('button');
toggleSizeButton.innerText = 'Toggle';
toggleSizeButton.style.padding = '5px';
toggleSizeButton.style.cursor = 'pointer';
toggleSizeButton.style.backgroundColor = '#4CAF50';
toggleSizeButton.style.color = '#fff';
toggleSizeButton.style.border = 'none';
toggleSizeButton.style.borderRadius = '5px';

let isSmall = false;
toggleSizeButton.addEventListener('click', () => {
    if (isSmall) {
        counterContainer.style.width = 'auto';
        counterContainer.style.height = 'auto';
        counterContainer.style.padding = '10px';
        resetButton.style.display = 'block';
    } else {
        counterContainer.style.width = '5px';
        counterContainer.style.height = '5px';
        counterContainer.style.padding = '5px';
        resetButton.style.display = 'none';
    }
    isSmall = !isSmall;
});

// Button container
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.alignItems = 'center';
buttonContainer.appendChild(resetButton);
buttonContainer.appendChild(toggleSizeButton);

counterContainer.appendChild(buttonContainer);

// Update death counters UI
function updateDeathCounters() {
    counterContainer.innerHTML = '';
    counterContainer.appendChild(buttonContainer);

    if (watchedPlayers.size > 0) {
        counterContainer.style.display = 'block';
        watchedPlayers.forEach(playerName => {
            const playerData = playerDeathData[playerName] || {};
            const mapDeaths = Object.keys(playerData).reduce((total, map) => {
                const mapData = playerData[map];
                return total + Object.values(mapData).reduce((sum, deaths) => sum + deaths, 0);
            }, 0);

            const playerDiv = document.createElement('div');
            playerDiv.innerText = `${playerName}: ${mapDeaths} deaths`;
            playerDiv.style.marginBottom = '5px';
            playerDiv.style.cursor = 'pointer';

            // Left-click to show Death Log
            playerDiv.addEventListener('click', () => showDeathLog(playerName));

            // Right-click context menu for removing player
            playerDiv.addEventListener('contextmenu', (event) => {
                event.preventDefault(); // Prevent the default right-click menu
                
                // Create custom context menu
                const contextMenu = document.createElement('div');
                contextMenu.style.position = 'absolute';
                contextMenu.style.top = `${event.clientY}px`;
                contextMenu.style.left = `${event.clientX}px`;
                contextMenu.style.backgroundColor = '#333';
                contextMenu.style.color = '#fff';
                contextMenu.style.padding = '10px';
                contextMenu.style.borderRadius = '5px';
                contextMenu.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
                contextMenu.style.zIndex = '1000';

                // Add "Remove" option to context menu
                const removeOption = document.createElement('div');
                removeOption.innerText = 'Remove';
                removeOption.style.cursor = 'pointer';
                removeOption.style.padding = '5px';
                removeOption.style.borderBottom = '1px solid #fff';
                removeOption.addEventListener('click', () => {
                    watchedPlayers.delete(playerName);
                    updateDeathCounters();
                    document.body.removeChild(contextMenu); // Close the context menu
                });

                contextMenu.appendChild(removeOption);
                document.body.appendChild(contextMenu);

                // Close the menu if clicking outside
                document.addEventListener('click', () => {
                    document.body.removeChild(contextMenu);
                }, { once: true });
            });

            counterContainer.appendChild(playerDiv);
        });
    } else {
        counterContainer.style.display = 'none';
    }
}

// Show detailed Death Log
function showDeathLog(playerName) {
    const log = playerDeathData[playerName] || {};
    const logContainer = document.createElement('div');
    logContainer.style.position = 'fixed';
    logContainer.style.top = '50%';
    logContainer.style.left = '50%';
    logContainer.style.transform = 'translate(-50%, -50%)';
    logContainer.style.backgroundColor = '#333';
    logContainer.style.color = '#fff';
    logContainer.style.padding = '20px';
    logContainer.style.borderRadius = '10px';
    logContainer.style.zIndex = '1000';
    logContainer.style.whiteSpace = 'pre-wrap';
    logContainer.style.textAlign = 'left';
    logContainer.style.maxHeight = '70%';
    logContainer.style.overflowY = 'auto';
    logContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';

    // Title
    const title = document.createElement('h2');
    title.innerText = `Death Log for ${playerName}`;
    title.style.marginBottom = '10px';
    logContainer.appendChild(title);

    // Map and area breakdown
    Object.entries(log).forEach(([map, areas]) => {
        const mapEntry = document.createElement('div');
        mapEntry.style.marginBottom = '5px';
        mapEntry.style.cursor = 'pointer';
        mapEntry.style.fontWeight = 'bold';
        mapEntry.innerText = `${map}: ${Object.values(areas).reduce((sum, deaths) => sum + deaths, 0)} deaths`;

        const areaContainer = document.createElement('div');
        areaContainer.style.marginTop = '5px';
        areaContainer.style.paddingLeft = '10px';
        areaContainer.style.display = 'none'; // Hidden by default

        Object.entries(areas).forEach(([area, deaths]) => {
            const areaEntry = document.createElement('div');
            areaEntry.style.marginBottom = '3px';
            areaEntry.innerText = `- ${area}: ${deaths} deaths`;
            areaContainer.appendChild(areaEntry);
        });

        // Toggle area breakdown on click
        mapEntry.addEventListener('click', () => {
            areaContainer.style.display = areaContainer.style.display === 'none' ? 'block' : 'none';
        });

        logContainer.appendChild(mapEntry);
        logContainer.appendChild(areaContainer);
    });

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.backgroundColor = '#ff5c5c';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(logContainer);
    });

    logContainer.appendChild(closeButton);
    document.body.appendChild(logContainer);
}

// Check leaderboard for downed players
function checkLeaderboard() {
    const leaderboardLines = document.querySelectorAll('#leaderboard .leaderboard-line');
    const currentDownedPlayers = new Set();

    leaderboardLines.forEach(line => {
        const title = line.getAttribute('title');
        const playerName = title.split(' [')[0];
        const map = line.classList[1].replace(/-/g, ' ');
        const area = title.match(/\[(.*?)\]/)?.[1] || 'Unknown Area';

        if (playerName) {
            if (!line.querySelector('.track-button')) {
                const trackButton = document.createElement('button');
                trackButton.innerText = 'Track';
                trackButton.classList.add('track-button');
                trackButton.style.marginLeft = '10px';
                trackButton.style.padding = '3px 8px';
                trackButton.style.cursor = 'pointer';
                trackButton.style.backgroundColor = '#4CAF50';
                trackButton.style.color = '#fff';
                trackButton.style.border = 'none';
                trackButton.style.borderRadius = '5px';

                trackButton.addEventListener('click', () => {
                    if (!watchedPlayers.has(playerName)) {
                        watchedPlayers.add(playerName);
                        trackButton.innerText = 'Untrack';
                        trackButton.style.backgroundColor = '#ff5c5c';
                    } else {
                        watchedPlayers.delete(playerName);
                        trackButton.innerText = 'Track';
                        trackButton.style.backgroundColor = '#4CAF50';
                    }
                    updateDeathCounters();
                });

                const playerNameElement = line.querySelector('.leaderboard-name');
                if (playerNameElement) {
                    playerNameElement.appendChild(trackButton);
                }
            }
        }

        if (line.classList.contains('leaderboard-downed')) {
            if (playerName && watchedPlayers.has(playerName)) {
                if (!downedPlayers.has(playerName)) {
                    if (!playerDeathData[playerName]) playerDeathData[playerName] = {};
                    if (!playerDeathData[playerName][map]) playerDeathData[playerName][map] = {};
                    playerDeathData[playerName][map][area] = (playerDeathData[playerName][map][area] || 0) + 1;

                    updateDeathCounters();
                }
                currentDownedPlayers.add(playerName);
            }
        }
    });

    downedPlayers.clear();
    currentDownedPlayers.forEach(player => downedPlayers.add(player));
}

// Disable 'B' key for leaderboard deletion
document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'b') {
        event.stopPropagation();
        event.preventDefault();
    }
});

// Toggle leaderboard visibility
const leaderboard = document.getElementById('leaderboard');
leaderboard.style.visibility = 'hidden';

const toggleLeaderboardButton = document.createElement('button');
toggleLeaderboardButton.textContent = 'Toggle Leaderboard';
toggleLeaderboardButton.style.position = 'absolute';
toggleLeaderboardButton.style.left = '10px';
toggleLeaderboardButton.style.top = '50px';
toggleLeaderboardButton.style.zIndex = '1000';

let isLeaderboardVisible = false;

function updateButtonColor() {
    toggleLeaderboardButton.style.backgroundColor = isLeaderboardVisible ? 'green' : 'red';
}

updateButtonColor();

toggleLeaderboardButton.addEventListener('click', () => {
    isLeaderboardVisible = !isLeaderboardVisible;
    leaderboard.style.visibility = isLeaderboardVisible ? 'visible' : 'hidden';
    updateButtonColor();
});

const leaderboardObserver = new MutationObserver(() => {
    if (!isLeaderboardVisible) leaderboard.style.visibility = 'hidden';
});

leaderboardObserver.observe(leaderboard, { attributes: true, childList: true, subtree: true });

document.body.appendChild(toggleLeaderboardButton);

// Check leaderboard periodically
setInterval(checkLeaderboard, 100);

// Initialize with some watched players
watchedPlayers.add('ArhaanJinnah');
updateDeathCounters();
