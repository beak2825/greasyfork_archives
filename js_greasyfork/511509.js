// ==UserScript==
// @name         UpsTimerMobile
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Display timer for OC, drug, booster, and hospital with API calls.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/511509/UpsTimerMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/511509/UpsTimerMobile.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const API_KEY = "your_api_key";
    const API_CALL_INTERVAL = 5 * 60 * 1000;
    const LAST_API_CALL_KEY = "lastApiCall";

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function getLocalStorage() {
        let upsTimer = localStorage.getItem("upscript_mobile_timer");
        if (localStorage.getItem("upscript_mobile_timer") === null) {
            return 0;
        }
        return JSON.parse(upsTimer);
    }

    function setLocalStorage(OCTimer, drugTimer, boosterTimer, upsHospitalTimer) {
        localStorage.setItem("upscript_mobile_timer", JSON.stringify({
            upsOCTimer: OCTimer !== undefined ? OCTimer["timerExpiresAt"] ? OCTimer["timerExpiresAt"] : OCTimer["subtitle"] : "N/A",
            upsDrugTimer: drugTimer !== undefined ? drugTimer["timerExpiresAt"] : 0,
            upsBoosterTimer: boosterTimer !== undefined ? boosterTimer["timerExpiresAt"] : 0,
            upsHospitalTimer: upsHospitalTimer !== undefined ? upsHospitalTimer["timerExpiresAt"] : 0
        }));
    }

    function extractTimeFromIcon(iconText) {
    const daysMatch = iconText.match(/(\d+)\s*days?/);
    const hoursMatch = iconText.match(/(\d+)\s*hours?/);
    const minutesMatch = iconText.match(/(\d+)\s*minutes?/);
    const secondsMatch = iconText.match(/(\d+)\s*seconds?/);

    const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

    const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
    console.log("Temps extrait :", { days, hours, minutes, seconds, totalSeconds });
    return totalSeconds;
}

    async function fetchData() {
    const lastApiCall = localStorage.getItem(LAST_API_CALL_KEY);
    if (lastApiCall && (Date.now() - parseInt(lastApiCall, 10)) < API_CALL_INTERVAL) {
        console.log("Trop tôt pour un nouvel appel API.");
        return;
    }

    try {
        const iconsResponse = await fetch(`https://api.torn.com/user/?key=${API_KEY}&selections=icons`);
        const iconsData = await iconsResponse.json();
        let organizedCrimeTime = null;
        let hospitalTime = null;

        if (iconsData.icons?.icon85) {
            organizedCrimeTime = extractTimeFromIcon(iconsData.icons.icon85);
            if (organizedCrimeTime === 0) {
                console.error("Temps non trouvé pour Organized Crime.");
            }
        }
        if (iconsData.icons?.icon15) {
            hospitalTime = extractTimeFromIcon(iconsData.icons.icon15);
            if (hospitalTime === 0) {
                console.error("Temps non trouvé pour Hospital.");
            }
        }

        const cooldownsResponse = await fetch(`https://api.torn.com/user/?key=${API_KEY}&selections=cooldowns`);
        const cooldownsData = await cooldownsResponse.json();

        const currentTime = Math.floor(Date.now() / 1000);

        const organizedCrimeEndTime = organizedCrimeTime ? currentTime + organizedCrimeTime : "N/A";
        const hospitalEndTime = hospitalTime ? currentTime + hospitalTime : "N/A";
        const drugEndTime = currentTime + cooldownsData.cooldowns.drug;
        const boosterEndTime = currentTime + cooldownsData.cooldowns.booster;

        setLocalStorage(
            { timerExpiresAt: organizedCrimeEndTime },
            { timerExpiresAt: drugEndTime },
            { timerExpiresAt: boosterEndTime },
            { timerExpiresAt: hospitalEndTime }
        );

        localStorage.setItem(LAST_API_CALL_KEY, Date.now().toString());
        console.log("Données mises à jour avec succès.");
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

    function updateTimersDisplay() {
        let timers = getLocalStorage();
        if (timers === 0 || timers === null || timers === undefined) {
            document.getElementById('upsOCTimer').innerText = 'N/A';
            document.getElementById('upsDrugTimer').innerText = 'N/A';
            document.getElementById('upsBoosterTimer').innerText = 'N/A';
            document.getElementById('upsHospitalTimer').innerText = 'N/A';
        }

        function updateTimer() {
            let now = Math.round(Date.now() / 1000);

            for (let key in timers) {
                let timerElement = document.getElementById(`${key}`);
                if (!timerElement) continue;
                if (typeof(timers[key]) === "string" && timers[key].includes('Ready')) {
                    timerElement.innerText = 'Ready';
                    timerElement.style.color = 'red';
                    continue;
                } else if (typeof(timers[key]) === "string" && timers[key].includes('N/A')) {
                    timerElement.innerText = 'N/A';
                    continue;
                }

                let distance = timers[key] - now;

                if (distance < 0) {
                    timerElement.innerText = 'N/A';
                    if (key === 'upsHospitalTimer')  {
                        timerElement.parentElement.remove();
                        delete timers.upsHospitalTimer;
                    }
                } else {
                    let days = Math.floor(distance / (60 * 60 * 24));
                    let hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
                    let minutes = Math.floor((distance % (60 * 60)) / 60);
                    let seconds = distance % 60;

                    if (key === 'upsBoosterTimer') days = 0;
                    if (key === 'upsBoosterTimer') hours = Math.floor(distance / (60 * 60));
                    if (key === 'upsBoosterTimer') seconds = 0;

                    let timeUnits = [
                        { value: days, unit: 'd' },
                        { value: hours, unit: 'h' },
                        { value: minutes, unit: 'm' },
                        { value: seconds, unit: 's' }
                    ];

                    let displayUnits = timeUnits.filter(t => t.value > 0).slice(0, 2);

                    let displayString = displayUnits.map(t => `${t.value}${t.unit}`).join(' ');

                    if (distance < 600 && key === 'upsDrugTimer') timerElement.style.color = 'red';
                    if (distance < 600 && key === 'upsHospitalTimer') timerElement.style.color = 'red';
                    if (distance < 3600 && key === 'upsOCTimer') timerElement.style.color = 'red';
                    if (distance < 3600 && key === 'upsBoosterTimer') timerElement.style.color = 'red';

                    timerElement.innerText = displayString.trim();
                }
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function createTimerDisplay() {
        if (document.getElementById('upsTimerContainer')) return;
        let sidebar = document.getElementById('sidebarroot');
        let timerContainer = document.createElement('div');

        sidebar.style = 'position: relative;';
        timerContainer.id = 'upsTimerContainer';
        timerContainer.style = 'position: absolute;bottom: -18px;left: 12px; display: flex; gap: 8px;';

        sidebar.appendChild(timerContainer);
        createTimerElement(timerContainer, 'OC: ', 'upsOCTimer');
        createTimerElement(timerContainer, 'Drug: ', 'upsDrugTimer');
        createTimerElement(timerContainer, 'Booster: ', 'upsBoosterTimer');
        createTimerElement(timerContainer, 'Hosp: ', 'upsHospitalTimer');
        updateTimersDisplay();
    }

    function createTimerElement(container, text, id) {
        let timer = document.createElement('p');
        let timerText = document.createElement('strong');
        let dynamicTimer = document.createElement('span');

        timerText.innerText = text;
        dynamicTimer.id = id;

        timer.appendChild(timerText);
        timer.appendChild(dynamicTimer);
        container.appendChild(timer);
    }

    document.addEventListener('DOMContentLoaded', function () {
        waitForElm('#sidebarroot').then((elm) => {
            sleep(100).then(async () => {
                if (window.innerWidth < 768) {
                    await fetchData();
                    createTimerDisplay();
                    setInterval(fetchData, API_CALL_INTERVAL);
                }
            });
        });
    });
})();