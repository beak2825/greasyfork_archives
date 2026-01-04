// ==UserScript==
// @name         Chain Watcher
// @description  Glows the UI different colors to alert you to the time left on your chain timer. Bleeps when it gets low.
// @author       Steejo [3014487]
// @version      1.1
// @match        https://www.torn.com/*
// @namespace https://greasyfork.org/users/1386898
// @downloadURL https://update.greasyfork.org/scripts/514251/Chain%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/514251/Chain%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Edit these settings as needed (color, minutes, seconds), colors change to the next one at the time selected
    const settings = {
        green: { color: '#00FF00', minutes: 3, seconds: 0 },
        orange: { color: '#FFA500', minutes: 2, seconds: 0},
        red: { color: '#FF0000', minutes: 1, seconds: 30 },
        alarm: { color: '#FF0000', minutes: 0, seconds: 1 }
    };

    // Find element displaying the time left in the chain
    const targetClassName = 'bar-timeleft';
    const audio = new Audio('https://www.torn.com/audio/chat/Plink_1.mp3');

    let timer = null;
    let intervalId = null;

    // Function to parse time string into total seconds
    const parseTimeToSeconds = (timeStr) => {
        const [minutes, seconds] = timeStr.split(':').map(num => parseInt(num));
        return minutes * 60 + seconds;
    };

    // Function to log the innerHTML of the target element
    const logInnerHTML = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const targetElement = document.querySelector(`[class^="${targetClassName}"]`);
                if (targetElement) {
                    timer = targetElement.innerHTML;
                    return; // Exit once we've found and updated the timer
                }
            }
        }
    };

    // Function to set the shadow color based on the time left
    const setImmediateColor = () => {
        if (!timer) return;

        const [minutes, seconds] = timer.split(':').map(num => parseInt(num));
        const totalSeconds = minutes * 60 + seconds;

        if (minutes >= 4) {
            removeAnimation();
            audio.pause();
        } else if (totalSeconds >= parseTimeToSeconds(`${settings.green.minutes}:${settings.green.seconds}`)) {
            changeShadowColor(settings.green.color);
        } else if (totalSeconds >= parseTimeToSeconds(`${settings.orange.minutes}:${settings.orange.seconds}`)) {
            changeShadowColor(settings.orange.color);
        } else if (totalSeconds >= parseTimeToSeconds(`${settings.red.minutes}:${settings.red.seconds}`)) {
            changeShadowColor(settings.red.color);
        } else if (totalSeconds >= parseTimeToSeconds(`${settings.alarm.minutes}:${settings.alarm.seconds}`)) {
            changeShadowColor(settings.alarm.color);
            audio.play();
        } else {
            removeAnimation();
            audio.pause();
        }
    };

    // Create a MutationObserver instance
    const observer = new MutationObserver(logInnerHTML);

    const elements = [
        '#header-root',
        '#sidebarroot',
        '.content-wrapper',
        '._chat-box-wrap_1pskg_111'
    ];

    const removeAnimation = () => {
        const existingStyle = document.getElementById('breathe-animation');
        if (existingStyle) {
            existingStyle.remove();
        }
        // Remove animations from elements
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.animation = 'none';
            }
        });
    };

    const changeShadowColor = (color) => {
        // Remove existing animation style
        removeAnimation();

        // Add new animation style
        const style = document.createElement('style');
        style.id = 'breathe-animation';
        style.innerHTML = `
            @keyframes breathe {
                0% { box-shadow: 0 0 5px ${color}; }
                50% { box-shadow: 0 0 20px ${color}, 0 0 30px ${color}; }
                100% { box-shadow: 0 0 5px ${color}; }
            }
        `;
        document.head.appendChild(style);

        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.animation = 'breathe 1s infinite';
            }
        });
    };

    // Cleanup function
    const cleanup = () => {
        observer.disconnect();
        if (intervalId) {
            clearInterval(intervalId);
        }
        removeAnimation();
        audio.pause();
    };

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Set the shadow color every second
    intervalId = setInterval(setImmediateColor, 1000);

    // Clean up when the page unloads
    window.addEventListener('unload', cleanup);
})();