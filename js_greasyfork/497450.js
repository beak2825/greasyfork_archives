// ==UserScript==
// @name         Beta testing Timer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent timer from disapearing
// @author       Ahmed
// @match        https://support-frontend.console3.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497450/Beta%20testing%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/497450/Beta%20testing%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timerIntervals = {};
    let startTimes = {};
    let timerDisplays = {};

    function startTimer(chatId) {
        startTimes[chatId] = new Date().getTime();
        timerIntervals[chatId] = setInterval(() => updateTimer(chatId), 1000);
        updateTimer(chatId); // Ensure the timer updates immediately
        console.log(`Timer started for chat ${chatId} at:`, new Date(startTimes[chatId]).toLocaleTimeString());
    }

    function updateTimer(chatId) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTimes[chatId]) / 1000);
        const seconds = elapsedTime % 60;
        const minutes = Math.floor(elapsedTime / 60);

        timerDisplays[chatId].textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log(`Timer updated for chat ${chatId}:`, timerDisplays[chatId].textContent);
    }

    function stopTimer(chatId) {
        clearInterval(timerIntervals[chatId]);
        delete timerIntervals[chatId];
        delete startTimes[chatId];
        if (timerDisplays[chatId]) {
            timerDisplays[chatId].remove();
            delete timerDisplays[chatId];
        }
        console.log(`Timer stopped for chat ${chatId} at:`, new Date().toLocaleTimeString());
    }


    function applyStyles(element, backgroundColor = 'red') {
        element.style.fontSize = '20px';
        element.style.fontWeight = 'bold';
        element.style.backgroundColor = backgroundColor;
        element.style.color = 'white';
        element.style.padding = '5px';
        element.style.borderRadius = '5px';
        element.style.textAlign = 'center';
        element.style.display = 'inline-block';
        element.style.minWidth = '50px';
        element.style.position = 'absolute';
        element.style.top = '50%';
        element.style.right = '-20px';
        element.style.transform = 'translateY(-50%)';
        element.style.zIndex = '1000';
    }

    function createTimerDisplay(chatId) {
        const timerDisplay = document.createElement('div');
        applyStyles(timerDisplay);
        timerDisplays[chatId] = timerDisplay;
        console.log(`Timer display created and styled for chat ${chatId}`);
    }

    function checkForElement() {
        const chatElements = document.querySelectorAll('button[id^="chat_card_"]');
        chatElements.forEach((chatElement) => {
            const chatId = chatElement.id.replace('chat_card_', '');

            const targetElement = chatElement.querySelector('div[color="var(--text-and-icon-oncolor)"]');
            const unansweredRequestTag = chatElement.querySelector('#unansweredRequestTag');
            const displayContainer = chatElement.querySelector('.sitljh0.t1ekqefo');

            if (targetElement && !timerIntervals[chatId]) {
                console.log(`Target element detected in chat ${chatId}:`, targetElement);
                createTimerDisplay(chatId);
                if (displayContainer) {
                    displayContainer.appendChild(timerDisplays[chatId]);
                    console.log(`Timer display appended to chat ${chatId}:`, displayContainer);
                }
                startTimer(chatId);
            }

            if (chatElement && !unansweredRequestTag && timerIntervals[chatId]) {
                console.log(`unansweredRequestTag not found in chat ${chatId}:`, chatElement);
                stopTimer(chatId);
            }
        });
    }

    setInterval(checkForElement, 1000);
})();