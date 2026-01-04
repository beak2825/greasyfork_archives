// ==UserScript==
// @name         Enemy Check Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display a message when your enemy count goes up
// @author       Baccy
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514516/Enemy%20Check%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/514516/Enemy%20Check%20Script.meta.js
// ==/UserScript==

function getAPIKey() {
    let publicAPIKey = localStorage.getItem('publicAPIKey');

    if (!publicAPIKey) {
        const container = document.querySelector('#topHeaderBanner');

        if (container) {
            let existingMessage = document.getElementById('api-key-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.id = 'api-key-message';
            messageDiv.innerHTML = "<p>Please enter your public API key to check for enemies.</p>";

            messageDiv.style.fontSize = '16px';
            messageDiv.style.marginTop = '10px';
            messageDiv.style.color = '#ffffff';
            messageDiv.style.padding = '10px';
            messageDiv.style.backgroundColor = '#1c1b22';
            messageDiv.style.borderRadius = '5px';
            messageDiv.style.lineHeight = '1.5';
            messageDiv.style.textAlign = 'center';

            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'text';
            apiKeyInput.placeholder = 'Enter API Key';
            apiKeyInput.style.marginTop = '10px';
            apiKeyInput.style.padding = '5px';
            apiKeyInput.style.width = '150px';
            apiKeyInput.style.borderRadius = '5px';
            apiKeyInput.style.border = '1px solid #848884';

            const saveAPIKeyButton = document.createElement('button');
            saveAPIKeyButton.innerText = 'Save API Key';
            saveAPIKeyButton.style.marginTop = '10px';
            saveAPIKeyButton.style.padding = '5px 10px';
            saveAPIKeyButton.style.backgroundColor = '#848884';
            saveAPIKeyButton.style.color = '#ffffff';
            saveAPIKeyButton.style.border = 'none';
            saveAPIKeyButton.style.borderRadius = '5px';
            saveAPIKeyButton.style.cursor = 'pointer';

            saveAPIKeyButton.addEventListener('click', () => {
                publicAPIKey = apiKeyInput.value.trim();

                if (publicAPIKey) {
                    localStorage.setItem('publicAPIKey', publicAPIKey);
                    messageDiv.remove();
                    checkAndFetchEnemyData();
                } else {
                    alert('API key is required for the script to work.');
                }
            });

            messageDiv.appendChild(apiKeyInput);
            messageDiv.appendChild(saveAPIKeyButton);
            container.appendChild(messageDiv);
        }
    } else {
        checkAndFetchEnemyData();
    }
}

function checkAndFetchEnemyData() {
    const publicAPIKey = localStorage.getItem('publicAPIKey');
    if (!publicAPIKey) return getAPIKey();

    const lastFetch = localStorage.getItem('enemyCheckTimestamp');
    const now = Date.now();

    if (lastFetch && now - lastFetch < 5 * 60 * 1000) return;

    const url = `https://api.torn.com/user/?selections=profile&key=${publicAPIKey}&comment=enemyCheck`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const enemyCount = data.enemies || 0;
            localStorage.setItem('enemyCheckTimestamp', now);

            const savedEnemyCount = parseInt(localStorage.getItem('enemyCount')) || 0;
            const enemyDifference = enemyCount - savedEnemyCount;

            displayEnemyMessage(enemyDifference, enemyCount);
        })
        .catch(error => console.error("Error fetching data:", error));
}

function displayEnemyMessage(enemyDifference, enemyCount) {
    const container = document.querySelector('#topHeaderBanner');
    if (!container) return;

    let messageDiv = document.getElementById('enemy-message');
    if (messageDiv) messageDiv.remove();

    if (enemyDifference !== 0) {
        const differenceText = enemyDifference > 0 
            ? `${enemyDifference} new enemies` 
            : `${Math.abs(enemyDifference)} less enemies`;
        
        messageDiv = document.createElement('div');
        messageDiv.id = 'enemy-message';
        messageDiv.innerHTML = `<p>You have ${differenceText}! Current enemy count: ${enemyCount}</p>`;

        messageDiv.style.fontSize = '16px';
        messageDiv.style.marginTop = '10px';
        messageDiv.style.color = '#ffffff';
        messageDiv.style.padding = '10px';
        messageDiv.style.backgroundColor = '#1c1b22';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.lineHeight = '1.5';
        messageDiv.style.textAlign = 'center';

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save Count';
        saveButton.style.marginTop = '10px';
        saveButton.style.padding = '5px 10px';
        saveButton.style.backgroundColor = '#848884';
        saveButton.style.color = '#ffffff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';

        saveButton.addEventListener('click', () => {
            localStorage.setItem('enemyCount', enemyCount);
            messageDiv.remove();
        });

        messageDiv.appendChild(saveButton);
        container.appendChild(messageDiv);
    }
}

// Call getAPIKey() on page load to initialize the process
getAPIKey();
