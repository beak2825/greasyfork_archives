// ==UserScript==
// @name         UpsTimerMobile - Heart
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Display timer for OC, drug, booster, and hospital with API calls.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531199/UpsTimerMobile%20-%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/531199/UpsTimerMobile%20-%20Heart.meta.js
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

    function setLocalStorage(OCTimer, drugTimer, boosterTimer, upsHospitalTimer, nerveFullTime, energyFullTime) {
        localStorage.setItem("upscript_mobile_timer", JSON.stringify({
            upsOCTimer: OCTimer !== undefined ? OCTimer["timerExpiresAt"] ? OCTimer["timerExpiresAt"] : OCTimer["subtitle"] : "N/A",
            upsDrugTimer: drugTimer !== undefined ? drugTimer["timerExpiresAt"] : 0,
            upsBoosterTimer: boosterTimer !== undefined ? boosterTimer["timerExpiresAt"] : 0,
            upsHospitalTimer: upsHospitalTimer !== undefined ? upsHospitalTimer["timerExpiresAt"] : 0,
            upsNerveTimer: nerveFullTime !== undefined ? nerveFullTime["timerExpiresAt"] : 0,
            upsEnergyTimer: energyFullTime !== undefined ? energyFullTime["timerExpiresAt"] : 0,
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
        console.log("Too early for new call.");
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
                console.error("No time found OC.");
            }
        }
        if (iconsData.icons?.icon15) {
            hospitalTime = extractTimeFromIcon(iconsData.icons.icon15);
            if (hospitalTime === 0) {
                console.error("No time found hospital.");
            }
        }

        const cooldownsResponse = await fetch(`https://api.torn.com/user/?key=${API_KEY}&selections=cooldowns`);
        const cooldownsData = await cooldownsResponse.json();

        const barsResponse = await fetch(`https://api.torn.com/user/?key=${API_KEY}&selections=bars`);
        const barsData = await barsResponse.json();

        const currentTime = Math.floor(Date.now() / 1000);

        const organizedCrimeEndTime = organizedCrimeTime ? currentTime + organizedCrimeTime : "N/A";
        const hospitalEndTime = hospitalTime ? currentTime + hospitalTime : "N/A";
        const drugEndTime = currentTime + cooldownsData.cooldowns.drug;
        const boosterEndTime = currentTime + cooldownsData.cooldowns.booster;
        const energyFullTime = currentTime + barsData.energy.fulltime;
        const nerveFullTime = currentTime + barsData.nerve.fulltime;

        setLocalStorage(
            { timerExpiresAt: organizedCrimeEndTime },
            { timerExpiresAt: drugEndTime },
            { timerExpiresAt: boosterEndTime },
            { timerExpiresAt: hospitalEndTime },
            { timerExpiresAt: nerveFullTime },
            { timerExpiresAt: energyFullTime },
        );

        localStorage.setItem(LAST_API_CALL_KEY, Date.now().toString());
        console.log("Data updated successfully.");
    } catch (error) {
        console.error("Error fetching data :", error);
    }
}

    function updateTimersDisplay() {
    let timers = getLocalStorage();
    if (timers === 0 || timers === null || timers === undefined) {
        document.getElementById('upsOCTimer').innerText = 'N/A';
        document.getElementById('upsDrugTimer').innerText = 'N/A';
        document.getElementById('upsBoosterTimer').innerText = 'N/A';
        document.getElementById('upsHospitalTimer').innerText = 'N/A';
        document.getElementById('upsEnergyTimer').innerText = 'N/A';
        document.getElementById('upsNerveTimer').innerText = 'N/A';
    }

    // Nouvelle fonction ajoutée pour formater l'heure de fin
    function formatTime(timestamp) {
        if (timestamp === "N/A") return "N/A";
        const date = new Date(timestamp * 1000);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const period = date.getHours() >= 12 ? "PM" : "AM";
        return `${hours}:${minutes}${period}`;
    }

    function updateTimer() {
        let now = Math.round(Date.now() / 1000);

        for (let key in timers) {
            let timerElement = document.getElementById(`${key}`);
            let endTimeElement = document.getElementById(`${key}End`); // Nouvel élément
            if (!timerElement || !endTimeElement) continue;

            // Logique modifiée pour la vérification "N/A"
            if (timers[key] === "N/A" && key === 'upsDrugTimer') {
                timerElement.innerText = 'Ready';
                timerElement.style.color = 'green';
                endTimeElement.innerText = '';
                continue;
            } else if (timers[key] === "N/A") {
                timerElement.innerText = 'N/A';
                timerElement.style.color = '#FFA500';
                endTimeElement.innerText = '';
                continue;
            }

            let distance = timers[key] - now;

            if (distance < 0) {
                // Modification des couleurs et textes
                timerElement.innerText = key === 'upsDrugTimer' ? 'Ready' : 'N/A';
                timerElement.style.color = key === 'upsDrugTimer' ? 'green' : '#FFA500';
                endTimeElement.innerText = '';
            } else {
                // Nouveau formatage du temps
                let timeString;
                if (key === 'upsBoosterTimer') {
                    let hours = Math.floor(distance / 3600);
                    let minutes = Math.floor((distance % 3600) / 60);
                    hours = String(hours).padStart(2, '0');
                    minutes = String(minutes).padStart(2, '0');
                    timeString = `${hours}H ${minutes}M`;
                } else {
                    let days = Math.floor(distance / (60 * 60 * 24));
                    let hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
                    let minutes = Math.floor((distance % (60 * 60)) / 60);
                    hours = String(hours).padStart(2, '0');
                    minutes = String(minutes).padStart(2, '0');
                    timeString = `${days > 0 ? days + 'D ' : ''}${hours}H ${minutes}M`;
                }

                timerElement.innerText = timeString.trim();
                endTimeElement.innerText = `(${formatTime(timers[key])})`; // Ajout de l'heure de fin

                // Modification de la logique des couleurs
                if ((key === 'upsDrugTimer' || key === 'upsHospitalTimer') && distance <= 600) {
                    timerElement.style.color = 'red';
                } else if ((key === 'upsOCTimer' || key === 'upsBoosterTimer') && distance <= 3600) {
                    timerElement.style.color = 'red';
                } else {
                    timerElement.style.color = '#FFA500';
                }
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
        createTimerElement(timerContainer, 'O: ', 'upsOCTimer');
        createTimerElement(timerContainer, 'D: ', 'upsDrugTimer');
        createTimerElement(timerContainer, 'B: ', 'upsBoosterTimer');
        createTimerElement(timerContainer, 'H: ', 'upsHospitalTimer');
        createTimerElement(timerContainer, 'E: ', 'upsEnergyTimer');
        createTimerElement(timerContainer, 'N: ', 'upsNerveTimer');
        updateTimersDisplay();
    }

    function createTimerElement(container, text, id) {
        let timer = document.createElement('p');
        let timerText = document.createElement('strong');
        let dynamicTimer = document.createElement('span');
        let endTime = document.createElement('span');

        timerText.innerText = text;
        dynamicTimer.id = id;
        endTime.id = id + 'End';
        endTime.style.fontSize = '12px';
        endTime.style.color = 'skyblue';
        endTime.style.display = 'block';

        timer.appendChild(timerText);
        timer.appendChild(dynamicTimer);
        timer.appendChild(endTime);
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