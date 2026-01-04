// ==UserScript==
// @name         Auto Minting Coin (Pc + Mobile)
// @version      1.6
// @description  Minting automatically at the academy at random intervals
// @include      https://*/game.php*screen=snob*
// @namespace    https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/514954/Auto%20Minting%20Coin%20%28Pc%20%2B%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514954/Auto%20Minting%20Coin%20%28Pc%20%2B%20Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getVillageId() {
        const match = window.location.href.match(/village=(\d+)/);
        return match ? match[1] : null;
    }

    const villageId = getVillageId();
    if (!villageId) {
        console.error('Village ID not found in URL.');
        return; // Stop execution if no villageId is found
    }

    let countdownInterval;
    let isMinting = JSON.parse(localStorage.getItem(`isMinting${villageId}`)) ?? false;
    let countdownTime;
    let minInterval = parseInt(localStorage.getItem('minInterval')) || 300; // Default 5 minutes
    let maxInterval = parseInt(localStorage.getItem('maxInterval')) || 720; // Default 12 minutes

    function saveState() {
        localStorage.setItem(`isMinting${villageId}`, JSON.stringify(isMinting));
    }

    function saveIntervals() {
        localStorage.setItem('minInterval', minInterval);
        localStorage.setItem('maxInterval', maxInterval);
    }

    function initializeUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.backgroundColor = '#333';
        container.style.color = '#fff';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.zIndex = 10000;

        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown-timer';
        countdownElement.style.marginBottom = '10px';
        container.appendChild(countdownElement);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = isMinting ? 'Stop Minting' : 'Start Minting';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.marginRight = '5px';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backgroundColor = isMinting ? '#FF0000' : '#4CAF50';
        toggleButton.style.color = '#fff';

        toggleButton.addEventListener('click', () => {
            isMinting = !isMinting;
            toggleButton.textContent = isMinting ? 'Stop Minting' : 'Start Minting';
            toggleButton.style.backgroundColor = isMinting ? '#FF0000' : '#4CAF50';
            saveState();

            if (isMinting) {
                mintCoins();
                startCountdown();
            } else {
                stopCountdown();
            }
        });

        container.appendChild(toggleButton);

        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'Settings';
        settingsButton.style.padding = '5px 10px';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '3px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.backgroundColor = '#28a745';
        settingsButton.style.color = '#fff';

        settingsButton.addEventListener('click', () => {
            const newMin = parseInt(prompt('Set minimum interval (seconds):', minInterval));
            const newMax = parseInt(prompt('Set maximum interval (seconds):', maxInterval));

            if (!isNaN(newMin) && !isNaN(newMax) && newMin > 0 && newMax > newMin) {
                minInterval = newMin;
                maxInterval = newMax;
                saveIntervals();
                alert(`Intervals updated! Min: ${minInterval}s, Max: ${maxInterval}s`);
            } else {
                alert('Invalid input. Please enter valid intervals.');
            }
        });

        container.appendChild(settingsButton);

        document.body.appendChild(container);
    }

    function mintCoins() {
        const maxCoinElement = document.getElementById('coin_mint_fill_max');
        const maxCoinValue = maxCoinElement ? parseInt(maxCoinElement.textContent.match(/\((\d+)\)/)?.[1], 10) : null;

        if (maxCoinValue !== null) {
            document.getElementById('coin_mint_count').value = maxCoinValue;

            const mintButton = document.querySelector("input[type='submit'][value='Mint']");
            if (mintButton) {
                mintButton.click();
                console.log('Tombol "Mint" diklik dengan nilai:', maxCoinValue);
            } else {
                console.log('Tombol "Mint" tidak ditemukan.');
            }
        } else {
            console.log('Tidak dapat menemukan nilai maksimum.');
        }
    }

    function startCountdown() {
        const countdownElement = document.getElementById('countdown-timer');
        countdownTime = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

        countdownInterval = setInterval(() => {
            countdownTime--;
            const minutes = Math.floor(countdownTime / 60);
            const seconds = countdownTime % 60;
            countdownElement.textContent = `Next mint in: ${minutes}m ${seconds}s`;

            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                location.reload();
            }
        }, 1000);
    }

    function stopCountdown() {
        clearInterval(countdownInterval);
        const countdownElement = document.getElementById('countdown-timer');
        if (countdownElement) countdownElement.textContent = '';
    }

    initializeUI();

    if (isMinting) {
        const initialDelay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
        setTimeout(() => {
            mintCoins();
            startCountdown();
        }, initialDelay);
    }
})();
