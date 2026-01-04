// ==UserScript==
// @name         OC Timer
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Display timer for OC, Drg, B, H, Energy, and Nerve with local end times for mobile.
// @author       Heart [3034011]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512535/OC%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/512535/OC%20Timer.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    let lag = 100;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const originalFetch = window.fetch;
    window.fetch = function () {
        sleep(lag);
        const url = arguments[0];
        if (url.includes("getSidebarData")) {
            return originalFetch.apply(this, arguments).then(function (response) {
                const clonedResponse = response.clone();
                clonedResponse.text().then(function (text) {
                    let jsonResponse = JSON.parse(text);
                    setLocalStorage(
                        jsonResponse["statusIcons"]["icons"]["organized_crime"],
                        jsonResponse["statusIcons"]["icons"]["drug_cooldown"],
                        jsonResponse["statusIcons"]["icons"]["booster_cooldown"],
                        jsonResponse["statusIcons"]["icons"]["hospital"],
                        jsonResponse["bars"]["energy"],
                        jsonResponse["bars"]["nerve"]
                    );
                });
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

    function getLocalStorage() {
        let upsTimer = localStorage.getItem("upscript_mobile_timer");
        if (upsTimer === null) {
            return 0;
        }
        return JSON.parse(upsTimer);
    }

    function setLocalStorage(OCTimer, drugTimer, boosterTimer, upsHospitalTimer, energyTimer, nerveTimer) {
        localStorage.setItem("upscript_mobile_timer", JSON.stringify({
            upsOCTimer: OCTimer ? OCTimer["timerExpiresAt"] || OCTimer["subtitle"] : "N/A",
            upsDrugTimer: drugTimer ? drugTimer["timerExpiresAt"] : 0,
            upsBoosterTimer: boosterTimer ? boosterTimer["timerExpiresAt"] : 0,
            upsHospitalTimer: upsHospitalTimer ? upsHospitalTimer["timerExpiresAt"] : 0,
            upsEnergyTimer: energyTimer ? energyTimer["timestampToUpdate"] : 0,
            upsNerveTimer: nerveTimer ? nerveTimer["timestampToUpdate"] : 0
        }));
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
                let endTimeElement = document.getElementById(`${key}End`);
                if (!timerElement || !endTimeElement) continue;

                if (timers[key] === "N/A" && key === 'upsDrugTimer') {
                    timerElement.innerText = 'Ready';
                    timerElement.style.color = 'green'; // Set color to green
                    endTimeElement.innerText = '';
                    continue;
                } else if (timers[key] === "N/A") {
                    timerElement.innerText = 'N/A';
                    timerElement.style.color = '#FFA500'; // Set default color to orange
                    endTimeElement.innerText = '';
                    continue;
                }

                let distance = timers[key] - now;
                if (distance < 0) {
                    timerElement.innerText = key === 'upsDrugTimer' ? 'Ready' : 'N/A';
                    timerElement.style.color = key === 'upsDrugTimer' ? 'green' : '#FFA500'; // Set default color to orange
                    endTimeElement.innerText = '';
                } else {
                    let timeString;
                    if (key === 'upsBoosterTimer') {
                        // Format for booster timer as "30H 20M"
                        let hours = Math.floor(distance / 3600);
                        let minutes = Math.floor((distance % 3600) / 60);
                        hours = String(hours).padStart(2, '0');
                        minutes = String(minutes).padStart(2, '0');
                        timeString = `${hours}H ${minutes}M`;
                    } else {
                        // Format with days, hours, minutes for others
                        let days = Math.floor(distance / (60 * 60 * 24));
                        let hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
                        let minutes = Math.floor((distance % (60 * 60)) / 60);
                        days = days > 0 ? days : 0;
                        hours = String(hours).padStart(2, '0');
                        minutes = String(minutes).padStart(2, '0');
                        timeString = `${days > 0 ? days + 'D ' : ''}${hours}H ${minutes}M`;
                    }

                    timerElement.innerText = timeString.trim();
                    endTimeElement.innerText = `(${formatTime(timers[key])})`;

                    // Set color to red if conditions are met
                    if ((key === 'upsDrugTimer' || key === 'upsHospitalTimer') && distance <= 600) {
                        timerElement.style.color = 'red';
                    } else if ((key === 'upsOCTimer' || key === 'upsBoosterTimer') && distance <= 3600) {
                        timerElement.style.color = 'red';
                    } else {
                        timerElement.style.color = '#FFA500'; // Set default color to orange
                    }
                }
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function createTimerElement(container, text, id) {
        let timer = document.createElement('p');
        let timerText = document.createElement('strong');
        let dynamicTimer = document.createElement('span');
        let endTime = document.createElement('span');

        timerText.innerText = text;
        timerText.style.color = 'orange'; // Set color for labels
        timerText.style.fontSize = '12px'; // Set font size for labels
        dynamicTimer.id = id;
        dynamicTimer.style.fontSize = '12px'; // Set font size for timer
dynamicTimer.style.fontWeight = 'bold'; // Make timer text bold
        endTime.id = id + 'End';
        endTime.style.fontSize = '12px'; // Set font size for end time
        endTime.style.color = 'skyblue'; // Set color for end time
        endTime.style.display = 'block';

        timer.appendChild(timerText);
        timer.appendChild(dynamicTimer);
        timer.appendChild(endTime);
        container.appendChild(timer);
    }

    function createTimerDisplay() {
        if (document.getElementById('upsTimerContainer')) return;
        let sidebar = document.getElementById('sidebarroot');
        let timerContainer = document.createElement('div');

        sidebar.style = 'position: relative;';
        timerContainer.id = 'upsTimerContainer';
        timerContainer.style = 'position: absolute;bottom: -27px;left: 6px; display: flex; gap: 6px;';

        sidebar.appendChild(timerContainer);
        createTimerElement(timerContainer, 'O: ', 'upsOCTimer');
        createTimerElement(timerContainer, 'D: ', 'upsDrugTimer');
        createTimerElement(timerContainer, 'B: ', 'upsBoosterTimer');
        createTimerElement(timerContainer, 'H: ', 'upsHospitalTimer');
        createTimerElement(timerContainer, 'E: ', 'upsEnergyTimer');
        createTimerElement(timerContainer, 'N: ', 'upsNerveTimer');
        updateTimersDisplay();
    }

    document.addEventListener('DOMContentLoaded', function () {
        waitForElm('#sidebarroot').then((elm) => {
            sleep(100).then(() => {
                if (window.innerWidth < 768) {
                    createTimerDisplay();
                }
            });
        });
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
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

})();