// ==UserScript==
// @name         Torn Last Action Display (Profile + Attack)
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  Show last action & status on attack and profile pages with toggle (default off)
// @author       You
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537474/Torn%20Last%20Action%20Display%20%28Profile%20%2B%20Attack%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537474/Torn%20Last%20Action%20Display%20%28Profile%20%2B%20Attack%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const apiKey = '';

    const isAttackPage = window.location.href.includes('loader.php?sid=attack');
    const isProfilePage = window.location.href.includes('profiles.php?XID=');
    const playerId = isAttackPage
        ? new URLSearchParams(window.location.search).get('user2ID')
        : new URLSearchParams(window.location.search).get('XID');

    const targetContainer = isAttackPage
        ? document.querySelector('.titleContainer___QrlWP')
        : document.querySelector('.content-title');

    if (!targetContainer || !playerId) return;

    const infoBox = document.createElement('div');
    infoBox.style.padding = '5px';
    infoBox.style.marginTop = '5px';
    infoBox.style.background = '#111';
    infoBox.style.color = '#fff';
    infoBox.style.borderRadius = '5px';
    infoBox.innerText = 'Fetching is OFF';

    const fetchTimeBox = document.createElement('div');
    fetchTimeBox.style.marginTop = '5px';
    fetchTimeBox.style.fontSize = '11px';
    fetchTimeBox.style.color = '#ccc';
    fetchTimeBox.innerText = 'Last fetch time: N/A';

    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Start Fetching';
    toggleButton.style.marginTop = '5px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#222';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = '1px solid #555';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';

    targetContainer.appendChild(infoBox);
    targetContainer.appendChild(fetchTimeBox);
    targetContainer.appendChild(toggleButton);

    let intervalId = null;
    let fetching = false;

    function convertSecondsToAge(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        let diff = now - timestamp;

        let days = Math.floor(diff / 86400);
        diff %= 86400;
        let hrs = Math.floor(diff / 3600);
        diff %= 3600;
        let minutes = Math.floor(diff / 60);
        let seconds = diff % 60;

        let result = '';
        if (days) result += `${days} days `;
        if (hrs) result += `${hrs} hours `;
        if (minutes) result += `${minutes} minutes `;
        result += `${seconds} seconds`;
        return result;
    }

    async function getPlayerData() {
        try {
            const response = await fetch(`https://api.torn.com/user/${playerId}?selections=profile,personalstats&key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                infoBox.innerText = `API Error: ${data.error.error}`;
                return;
            }

            const lastActionTimestamp = data.last_action.timestamp;
            const status = data.status.state;

            console.log('Raw timestamp:', lastActionTimestamp);

            const age = convertSecondsToAge(lastActionTimestamp);
            const nowFormatted = new Date().toLocaleTimeString();

            infoBox.innerText = `Last action: ${age}\nStatus: ${status}`;
            fetchTimeBox.innerText = `Last fetch time: ${nowFormatted}`;
        } catch (err) {
            infoBox.innerText = 'Error fetching player data.';
            console.error(err);
        }
    }

    function startFetching() {
        if (!intervalId) {
            intervalId = setInterval(getPlayerData, 1200);
            fetching = true;
            toggleButton.innerText = 'Stop Fetching';
            infoBox.innerText = 'Loading...';
        }
    }

    function stopFetching() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            fetching = false;
            toggleButton.innerText = 'Start Fetching';
            infoBox.innerText = 'Fetching is OFF';
            fetchTimeBox.innerText = 'Last fetch time: N/A';
        }
    }

    toggleButton.addEventListener('click', () => {
        fetching ? stopFetching() : startFetching();
    });
})();
