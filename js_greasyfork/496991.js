// ==UserScript==
// @name         Timer Just
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  Just's Timer
// @author       Ahmed Esslaoui
// @author       Enhanced by Mohamed Tarek
// @match        https://support-frontend.console3.com/*
// @grant        none
// @icon         https://www.svgrepo.com/download/218321/timer.svg
// @downloadURL https://update.greasyfork.org/scripts/496991/Timer%20Just.user.js
// @updateURL https://update.greasyfork.org/scripts/496991/Timer%20Just.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for flashing and heartbeat effect
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes flash {
            0%, 100% { background-color: red; }
            50% { background-color: yellow; }
        }
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
        }
        .flashing {
            animation: flash 1s infinite, heartbeat 1.5s infinite;
        }
    `;
    document.head.appendChild(style);

    // Function to format the time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Function to apply modern styles to the timer element
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
    }

    // Function to start the timer on the new chat element
    function startTimerOnElement(element, backgroundColor, shouldFlash) {
        let seconds = 0;

        function updateTimer() {
            // Check if the element is still in the DOM
            if (!document.body.contains(element)) {
                clearInterval(timerId);
                return;
            }

            // Update the timer text content
            element.textContent = formatTime(seconds);
            if (shouldFlash && seconds >= 20) {
                element.classList.add('flashing');
            }
            seconds++;
        }

        // Apply modern styles to the timer element
        applyStyles(element, backgroundColor);

        // Start the timer immediately
        updateTimer();

        // Continue updating the timer every second
        const timerId = setInterval(updateTimer, 1000); // Update every second
    }

    // Function to detect new chat elements
    function detectNewChats() {
        console.log('Searching for new chat elements...');

        function startTimerIfValid(element, backgroundColor, shouldFlash) {
            const textContent = element.textContent.trim();
            const number = parseInt(textContent, 10);
            if (!isNaN(number) && number >= 1 && number <= 20) {
                console.log('Valid chat element found:', element);
                element.dataset.timerStarted = true;
                element.dataset.timerSeconds = 0; // Initialize timer value
                startTimerOnElement(element, backgroundColor, shouldFlash);
            }
        }

        // Detect the first type of chat element
        const newChatElements1 = document.querySelectorAll('div[color="var(--text-and-icon-oncolor)"]');
        newChatElements1.forEach(newChatElement1 => {
            if (!newChatElement1.dataset.timerStarted) {
                startTimerIfValid(newChatElement1, 'red', true);
            }
        });

        // Detect the second type of chat element
        const newChatElements2 = document.querySelectorAll('div[color="var(--app-color-text-icon-primary-light-theme)"]');
        newChatElements2.forEach(newChatElement2 => {
            if (!newChatElement2.dataset.timerStarted) {
                startTimerIfValid(newChatElement2, '#1F8AFF', false);
            }
        });

        // Detect the third type of chat element
        const newChatElements3 = document.querySelectorAll('div[color="var(--extensions-background-lightaccent)"]');
        newChatElements3.forEach(newChatElement3 => {
            if (!newChatElement3.dataset.timerStarted) {
                startTimerIfValid(newChatElement3, '#1F8AFF', false);
            }
        });
    }

    // Run the function periodically to check for new chats
    setInterval(detectNewChats, 50); // Check every 50 milliseconds
})();