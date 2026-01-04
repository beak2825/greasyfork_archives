// ==UserScript==
// @name         Torn - Mission Countdown Timer
// @namespace    duck.wowow
// @version      0.1
// @description  Grabs the mission with the lowest remaining time from the missions page and displays a countdown on the sidebar. Toggle button on missions page. PC only.
// @author       Odung
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529666/Torn%20-%20Mission%20Countdown%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/529666/Torn%20-%20Mission%20Countdown%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptEnabled;

    function formatTime(expireTime) {
        if (expireTime === 'Infinity') return 'N/A';

        const now = Date.now();
        const remainingTime = expireTime - now;
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        let timeString = '';
        if (days > 0) timeString += `${days}d `;
        if (days > 0 || hours > 0) timeString += `${hours}h `;
        if (days > 0 || hours > 0 || minutes > 0) timeString += `${minutes}m `;
        timeString += `${seconds}s`;

        return timeString.trim();
    }

    function missionPage() {
        if (window.location.href.toLowerCase().includes('https://www.torn.com/loader.php?sid=missions')) {
            const toggleButton = document.createElement('button');
            toggleButton.innerText = 'Countdown';
            toggleButton.style = scriptEnabled
                ? 'padding: 5px 10px; border-radius: 5px; background-color: #555555; color: lightgreen; border: none; cursor: pointer;'
                : 'padding: 5px 10px; border-radius: 5px; background-color: #555555; color: white; border: none; cursor: pointer;';
            toggleButton.onclick = () => {
                scriptEnabled = !scriptEnabled;
                localStorage.setItem('a_mission_countdown_enabled', scriptEnabled);
                if (scriptEnabled) {
                    toggleButton.style.color = 'lightgreen';
                    addTimer();
                } else toggleButton.style.color = 'white';
            };
            const pageTitle = document.querySelector('div.content-title > h4');
            if (pageTitle && !document.querySelector('city-job-upgrade')) pageTitle.appendChild(toggleButton);

            const missionTimes = Array.from(document.querySelectorAll('i[data-timewhenfailedleft]'))
            .map(i => parseInt(i.getAttribute('data-timewhenfailedleft'), 10));
            if (!missionTimes) {
                localStorage.removeItem('a_mission_countdown_time');
                return;
            }
            const lowestTime = Math.min(...missionTimes);
            const expireTime = Date.now() + lowestTime * 1000;
            localStorage.setItem('a_mission_expire_time', expireTime);
        }
    }


    function addTimer() {
        const missionExpireTime = localStorage.getItem('a_mission_expire_time');
        if (missionExpireTime) {
            if (!document.querySelector('.mission-timer-odung')) {
                const pointsElement = document.querySelector('.points___UO9AU');
                if (pointsElement) {
                    const pointsBlock = document.createElement('p');
                    const nameElement = document.createElement('span');
                    const valueElement = document.createElement('span');
                    pointsBlock.className = 'mission-timer-odung point-block___rQyUK';
                    nameElement.textContent = 'Mission';
                    nameElement.classList.add('name___ChDL3');
                    valueElement.textContent = formatTime(missionExpireTime);
                    valueElement.classList.add('value___mHNGb');
                    pointsBlock.appendChild(nameElement);
                    pointsBlock.appendChild(valueElement);
                    pointsElement.appendChild(pointsBlock);
                    const interval = setInterval(function() {
                        valueElement.textContent = formatTime(missionExpireTime);
                    }, 1000);
                }
            }
        }
    }

    scriptEnabled = JSON.parse(localStorage.getItem('a_mission_countdown_enabled')) ?? true;
    missionPage();
    if (scriptEnabled) addTimer();

    const observer = new MutationObserver(mutations => {
        const elements = document.querySelector('.point-block___rQyUK');
        if (elements) {
            if (scriptEnabled) addTimer();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();