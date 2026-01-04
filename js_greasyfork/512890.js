// ==UserScript==
// @name         UpsTimerMobile - SayedSharon
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Display timer for OC and drug and mobile.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512890/UpsTimerMobile%20-%20SayedSharon.user.js
// @updateURL https://update.greasyfork.org/scripts/512890/UpsTimerMobile%20-%20SayedSharon.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // In Case button are not displaying, increase the next value like this : let lag = 250.
    let lag = 100;

    // Sleep
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Intercept The Fetch API
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

    // Listen until element is found
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

    // Get localStorage stored value for time
    function getLocalStorage() {
        let upsTimer = localStorage.getItem("upscript_mobile_timer");
        if (localStorage.getItem("upscript_mobile_timer") === null) {
            return 0;
        }
        return JSON.parse(upsTimer);
    }

    // Set localStorage stored value for time
    function setLocalStorage(OCTimer, drugTimer, upsHospitalTimer, upsEnergyTimer, upsNerveTimer) {
        localStorage.setItem("upscript_mobile_timer", JSON.stringify({
            upsOCTimer: OCTimer !== undefined ? OCTimer["timerExpiresAt"] ? OCTimer["timerExpiresAt"] : OCTimer["subtitle"] : "N/A",
            upsDrugTimer: drugTimer !== undefined ? drugTimer["timerExpiresAt"]: 0,
            upsHospitalTimer: upsHospitalTimer !== undefined ? upsHospitalTimer["timerExpiresAt"] : 0,
            upsEnergyTimer: upsEnergyTimer !== undefined ? upsEnergyTimer["timestampToUpdate"] : 0,
            upsNerveTimer: upsNerveTimer !== undefined ? upsNerveTimer["timestampToUpdate"] : 0
        }));
    }

    // Update the OC Timer Display
    function updateTimersDisplay() {
        let timers = getLocalStorage();
        if (timers === 0 || timers === null || timers === undefined) {
            document.getElementById('upsOCTimer').innerText = 'N/A';
            document.getElementById('upsDrugTimer').innerText = 'N/A';
            document.getElementById('upsEnergyTimer').innerText = 'N/A';
            document.getElementById('upsNerveTimer').innerText = 'N/A';
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
                    if (distance < 600 && key === 'upsEnergyTimer') timerElement.style.color = 'red';
                    if (distance < 600 && key === 'upsNerveTimer') timerElement.style.color = 'red';
                    if (distance < 3600 && key === 'upsOCTimer') timerElement.style.color = 'red';
                    if (distance < 3600 && key === 'upsBoosterTimer') timerElement.style.color = 'red';

                    timerElement.innerText = displayString.trim();
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

        timerText.innerText = text;
        dynamicTimer.id = id;

        timer.appendChild(timerText);
        timer.appendChild(dynamicTimer);
        container.appendChild(timer);
    }

    // Create the OC Timer Display
    function createTimerDisplay() {
        if (document.getElementById('upsTimerContainer')) return;
        let sidebar = document.getElementById('sidebarroot');
        let timerContainer = document.createElement('div');

        sidebar.style = 'position: relative;';
        timerContainer.id = 'upsTimerContainer';
        timerContainer.style = 'position: absolute;bottom: -19px;left: 12px; display: flex; gap: 8px; font-size: 20px;';

        sidebar.appendChild(timerContainer);
        createTimerElement(timerContainer, 'OC: ', 'upsOCTimer');
        createTimerElement(timerContainer, 'D: ', 'upsDrugTimer');
        createTimerElement(timerContainer, 'H: ', 'upsHospitalTimer');
        createTimerElement(timerContainer, 'E: ', 'upsEnergyTimer');
        createTimerElement(timerContainer, 'N: ', 'upsNerveTimer');
        updateTimersDisplay();
    }

    document.addEventListener('DOMContentLoaded', function () {
        waitForElm('#sidebarroot').then((elm) => {
            sleep(100).then(() => {
                if (window.innerWidth < 955) {
                    createTimerDisplay();
                }
            });
        });
    });
})();