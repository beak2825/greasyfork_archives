// ==UserScript==
// @name        Made it a game
// @namespace   Violentmonkey Scripts
// @match       https://johnbutlergames.com/games/circles/1-1-0/index.html*
// @grant       none
// @version     1.3
// @author      -
// @description Updated to fix final time display issue
// @downloadURL https://update.greasyfork.org/scripts/504663/Made%20it%20a%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/504663/Made%20it%20a%20game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a counter element to the page
    const counterElement = document.createElement('div');
    counterElement.style.position = 'fixed';
    counterElement.style.top = '10px';
    counterElement.style.right = '10px';
    counterElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
    counterElement.style.color = 'white';
    counterElement.style.padding = '10px';
    counterElement.style.borderRadius = '5px';
    counterElement.style.fontSize = '40px';
    counterElement.style.zIndex = '1000';
    document.body.appendChild(counterElement);

    // Add a timer element below the counter
    const timerElement = document.createElement('div');
    timerElement.style.position = 'fixed';
    timerElement.style.top = '60px'; // Positioned below the counter
    timerElement.style.right = '10px';
    timerElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
    timerElement.style.color = 'white';
    timerElement.style.padding = '5px';
    timerElement.style.borderRadius = '5px';
    timerElement.style.fontSize = '20px';
    timerElement.style.zIndex = '1000';
    document.body.appendChild(timerElement);

    // Add full-screen overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '900';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    // Add target selector UI
    const targetSelector = document.createElement('div');
    targetSelector.style.position = 'fixed';
    targetSelector.style.top = '50%';
    targetSelector.style.left = '50%';
    targetSelector.style.transform = 'translate(-50%, -50%)';
    targetSelector.style.backgroundColor = 'rgba(0,0,0,0.8)';
    targetSelector.style.color = 'white';
    targetSelector.style.padding = '20px';
    targetSelector.style.borderRadius = '10px';
    targetSelector.style.zIndex = '1000';
    targetSelector.style.display = 'none';
    targetSelector.style.textAlign = 'center';
    document.body.appendChild(targetSelector);

    // Create options for collectable targets
    const options = [10, 25, 50, 100];
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = `Collect ${option}`;
        button.style.margin = '5px';
        button.style.padding = '10px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => setTarget(option));
        targetSelector.appendChild(button);
    });

    // Add "You Won!" modal
    const winModal = document.createElement('div');
    winModal.style.position = 'fixed';
    winModal.style.top = '50%';
    winModal.style.left = '50%';
    winModal.style.transform = 'translate(-50%, -50%)';
    winModal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    winModal.style.color = 'white';
    winModal.style.padding = '90px'; // Tripled padding
    winModal.style.borderRadius = '10px';
    winModal.style.zIndex = '1000';
    winModal.style.display = 'none';
    winModal.style.textAlign = 'center';
    winModal.style.fontSize = '72px'; // Tripled font size
    document.body.appendChild(winModal);

    const winMessage = document.createElement('div');
    winMessage.textContent = 'You Won!';
    winMessage.style.fontSize = '72px'; // Tripled font size
    winMessage.style.marginBottom = '20px';
    winModal.appendChild(winMessage);

    const finalTimeMessage = document.createElement('div');
    finalTimeMessage.style.fontSize = '48px'; // Suitable size for time display
    finalTimeMessage.style.marginBottom = '20px';
    finalTimeMessage.style.cursor = 'pointer';
    finalTimeMessage.innerHTML = `Final Time: <span class="arrow">▼</span>`;
    finalTimeMessage.addEventListener('click', toggleBestTimes);
    winModal.appendChild(finalTimeMessage);

    const bestTimesContainer = document.createElement('div');
    bestTimesContainer.style.fontSize = '24px';
    bestTimesContainer.style.overflow = 'hidden';
    bestTimesContainer.style.maxHeight = '0'; // Start with a height of 0 for the animation
    bestTimesContainer.style.opacity = '0';
    bestTimesContainer.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';
    winModal.appendChild(bestTimesContainer);

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.padding = '10px 20px';
    okButton.style.fontSize = '32px'; // Tripled font size
    okButton.style.cursor = 'pointer';
    okButton.addEventListener('click', () => {
        winModal.style.display = 'none';
        window.location.reload();
    });
    winModal.appendChild(okButton);

    let collectablesCount = 0;
    let collectedIds = new Set();
    let targetCollectables = null;
    let gameRunning = true;
    let gameWon = false; // Add gameWon flag
    let originalPlayerUpdate = player.update;
    let timerStart = null;
    let timerInterval = null;
    let initialPlayerPosition = { x: player.x, y: player.y };
    let bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || {10: null, 25: null, 50: null, 100: null};

    function updateCounter() {
        if (targetCollectables !== null) {
            counterElement.innerHTML = `Circles Collected: ${collectablesCount} / ${targetCollectables}`;
        } else {
            counterElement.innerHTML = `Circles Collected: ${collectablesCount}`;
        }
        if (targetCollectables !== null && collectablesCount >= targetCollectables && !gameWon) {
            stopTimer(); // Ensure the timer stops before showing the win modal
            gameWon = true; // Set gameWon flag
            showWinModal();
        }
    }

    function updateTimer() {
        if (timerStart !== null) {
            const elapsed = Date.now() - timerStart;
            const seconds = Math.floor(elapsed / 1000);
            const milliseconds = Math.floor((elapsed % 1000) / 10); // 100th of a second
            timerElement.innerHTML = `Time: ${seconds}.${milliseconds}s`;
        }
    }

    function startTimer() {
        timerStart = Date.now();
        timerInterval = setInterval(updateTimer, 10); // Update every 10 milliseconds
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function checkCollectables() {
        if (!gameRunning) return;

        if (typeof game !== 'undefined' && game.chunks && game.chunks.loaded) {
            const collectables = getCollectables();

            collectables.forEach(circle => {
                if (circle.type === 'collectable') {
                    const id = `${circle.x}-${circle.y}`;
                    if (!collectedIds.has(id) && circle.collected) {
                        collectedIds.add(id);
                        collectablesCount++;
                        updateCounter();
                    }
                }
            });
        }
    }

    function trackCollectables() {
        setInterval(checkCollectables, 10);
    }

    function setTarget(target) {
        targetCollectables = target;
        targetSelector.style.display = 'none';
        overlay.style.display = 'none';
        gameRunning = true;
        gameWon = false; // Reset gameWon flag
        restorePlayerPosition();
        updateCounter();
        startTimer();
    }

    function showTargetSelector() {
        initialPlayerPosition = { x: player.x, y: player.y }; // Store initial player position
        targetSelector.style.display = 'block';
        overlay.style.display = 'block';
        gameRunning = false;
        freezePlayerPosition();
    }

    function showWinModal() {
        const elapsed = Date.now() - timerStart;
        const seconds = Math.floor(elapsed / 1000);
        const milliseconds = Math.floor((elapsed % 1000) / 10); // 100th of a second
        finalTimeMessage.innerHTML = `Final Time: ${seconds}.${milliseconds}s <span class="arrow">▼</span>`;
        winModal.style.display = 'block';

        // Update the best times
        if (bestTimes[targetCollectables] === null || elapsed < bestTimes[targetCollectables]) {
            bestTimes[targetCollectables] = elapsed;
            localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
        }
        updateBestTimesContainer();
    }

    function updateBestTimesContainer() {
        bestTimesContainer.innerHTML = 'Best Times:<br>';
        options.forEach(option => {
            if (bestTimes[option] !== null) {
                const seconds = Math.floor(bestTimes[option] / 1000);
                const milliseconds = Math.floor((bestTimes[option] % 1000) / 10);
                bestTimesContainer.innerHTML += `Collect ${option}: ${seconds}.${milliseconds}s<br>`;
            } else {
                bestTimesContainer.innerHTML += `Collect ${option}: N/A<br>`;
            }
        });
    }

    function toggleBestTimes() {
        if (bestTimesContainer.style.maxHeight === '0px' || bestTimesContainer.style.maxHeight === '') {
            bestTimesContainer.style.maxHeight = '500px'; // Adjust based on content height
            bestTimesContainer.style.opacity = '1';
            finalTimeMessage.querySelector('.arrow').textContent = '▲';
        } else {
            bestTimesContainer.style.maxHeight = '0';
            bestTimesContainer.style.opacity = '0';
            finalTimeMessage.querySelector('.arrow').textContent = '▼';
        }
    }

    function freezePlayerPosition() {
        player.update = function() {
            this.x = initialPlayerPosition.x;
            this.y = initialPlayerPosition.y;
            this.xmove = 0;
            this.ymove = 0;
        };
    }

    function restorePlayerPosition() {
        player.update = originalPlayerUpdate;
    }

    showTargetSelector();

    updateCounter();

    trackCollectables();
})();