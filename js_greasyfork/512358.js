// ==UserScript==
// @name         Exact Seconds, Minutes, Hours and Days for Zendesk (Simple & Reliable)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Replace "minutes ago" with exact time in seconds, minutes, hours or days for Zendesk with smooth counting and absolute time.
// @author       Swiftlyx (rewritten by Gemini)
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512358/Exact%20Seconds%2C%20Minutes%2C%20Hours%20and%20Days%20for%20Zendesk%20%28Simple%20%20Reliable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512358/Exact%20Seconds%2C%20Minutes%2C%20Hours%20and%20Days%20for%20Zendesk%20%28Simple%20%20Reliable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UPDATE_FREQUENCY_MS = 1000;

    function getFormattedTimeDifference(dateTime) {
        const eventTimeObj = new Date(dateTime);
        // Перевірка, чи дата валідна
        if (isNaN(eventTimeObj.getTime())) {
            return null;
        }

        const eventTime = eventTimeObj.getTime();
        const currentTime = new Date().getTime();
        const differenceInSeconds = Math.floor((currentTime - eventTime) / 1000);

        const hoursAbs = eventTimeObj.getHours().toString().padStart(2, '0');
        const minutesAbs = eventTimeObj.getMinutes().toString().padStart(2, '0');
        const secondsAbs = eventTimeObj.getSeconds().toString().padStart(2, '0');
        const absoluteTime = `(${hoursAbs}:${minutesAbs}:${secondsAbs})`;

        if (differenceInSeconds < 0) {
             return `in the future ${absoluteTime}`;
        }
        if (differenceInSeconds < 60) {
            return `${differenceInSeconds} seconds ago ${absoluteTime}`;
        }
        if (differenceInSeconds < 3600) {
            const minutes = Math.floor(differenceInSeconds / 60);
            const seconds = differenceInSeconds % 60;
            return `${minutes} min ${seconds} seconds ago ${absoluteTime}`;
        }
        if (differenceInSeconds < 86400) {
            const hours = Math.floor(differenceInSeconds / 3600);
            const minutes = Math.floor((differenceInSeconds % 3600) / 60);
            return `${hours} hr ${minutes} min ago ${absoluteTime}`;
        }
        const days = Math.floor(differenceInSeconds / 86400);
        const hours = Math.floor((differenceInSeconds % 86400) / 3600);
        return `${days} days ${hours} hr ago ${absoluteTime}`;
    }

    function updateAllTimestamps() {
        const timeElements = document.querySelectorAll('time[data-test-id="timestamp-relative"]');

        timeElements.forEach(timeElement => {
            // Використовуємо data-original-time для зберігання початкового значення, щоб не читати його з DOM щоразу
            let originalDateTime = timeElement.dataset.originalTime;

            if (!originalDateTime) {
                originalDateTime = timeElement.getAttribute('datetime');
                if (originalDateTime) {
                    timeElement.dataset.originalTime = originalDateTime;
                }
            }

            if (originalDateTime) {
                const formattedTime = getFormattedTimeDifference(originalDateTime);
                if (formattedTime && timeElement.textContent !== formattedTime) {
                    timeElement.textContent = formattedTime;
                }
            }
        });
    }

    // Запускаємо оновлення кожну секунду
    setInterval(updateAllTimestamps, UPDATE_FREQUENCY_MS);

})();
