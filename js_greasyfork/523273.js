// ==UserScript==
// @name         Buried Treasure Countdown Timer
// @description  Displays timer button on screen for Buried Treasure
// @version      1.0
// @license      GNU GPLv3
// @match        https://www.neopets.com/*
// @exclude      https://www.neopets.com/games/tycoon/*
// @exclude      https://www.neopets.com/pound/transfer_popup.phtml*
// @author       Posterboy
// @namespace    https://www.youtube.com/@Neo_PosterBoy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523273/Buried%20Treasure%20Countdown%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/523273/Buried%20Treasure%20Countdown%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script is running inside an iframe (prevents duplicates such as Trudy's Surprise)
    if (window.top !== window.self) {
        return;
    }

    // Image URLs (can be customized)
    const IMAGE_COUNTDOWN = '//images.neopets.com/nt/nt_images/574_keep_out.gif';
    const IMAGE_COMPLETE = '//images.neopets.com/pirates/map_scrollsNEW.gif';

    const timerPanelId = 'neopets-timer-panel';
    const imageElementId = 'neopets-countdown-image';
    const countdownElementId = 'neopets-countdown-timer';
    const isBuriedTreasurePage = location.pathname.includes('pirates/buriedtreasure/buriedtreasure.phtml');

    // Common styles for the timer panel and image
    const commonStyles = {
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '0px',
        borderRadius: '35px',
        fontSize: '18px',
        zIndex: '1000',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
    };

    // Function to create or get an existing element
    function createElement(id, tagName, styles, parentElement = document.body) {
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement(tagName);
            element.id = id;
            Object.assign(element.style, styles);
            parentElement.appendChild(element);
        }
        return element;
    }

    // Function to display the time remaining
    function updateTimeRemainingPanel(minutes) {
        const panel = document.getElementById(timerPanelId);
        if (panel) {
panel.innerHTML = `<strong style="font-size: 22px;">&nbsp;&nbsp; Time remaining: &nbsp;&nbsp;</strong><br>
                   <span style="font-size: 24px; font-weight: bold;">
                   <a href="https://www.neopets.com/pirates/buriedtreasure/buriedtreasure.phtml"
                      target="_blank" style="color: #FF6347; text-decoration: none;" rel="noopener noreferrer">
                      ${minutes} minute${minutes === 1 ? '' : 's'}</a></span>`;

        }
    }

    // Function to display "Visit Again" text with shortcut link
    function displayReadyToVisitAgain() {
        const panel = document.getElementById(timerPanelId);
        if (panel) {
            panel.innerHTML = `
                <strong style="font-size: 22px; color: #32CD32;">
                Ready to visit again!
                </strong>
                <br>
                <a href="https://www.neopets.com/pirates/buriedtreasure/buriedtreasure.phtml"
                   style="color: #FF6347; text-decoration: underline; font-size: 18px; font-weight: bold;"
                   target="_blank" rel="noopener noreferrer">
                   Click here to return to Buried Treasure
                </a>
            `;

            // Show notification when the timer is complete
            sendNotification();
        }
    }

    // Function to send the push notification
    function sendNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Buried Treasure Ready!', {
                body: 'The timer is complete! You can visit the game again.',
                icon: 'https://images.neopets.com/new_shopkeepers/t_1900.gif'
            });
        }
    }

    // Function to calculate the time difference and display the countdown
    function displayTimer(lastVisitTime, countdownDuration) {
        const currentTime = new Date().getTime();
        const timeRemaining = lastVisitTime + countdownDuration - currentTime;
        let minutes = 0;

        if (timeRemaining > 0) {
            minutes = Math.floor(timeRemaining / (1000 * 60));
            const countdownText = `${minutes} minute${minutes === 1 ? '' : 's'} remaining`;
            setImage(IMAGE_COUNTDOWN);
            setTimeout(() => displayTimer(lastVisitTime, countdownDuration), 60000);
            updateTimerPanel(countdownText);
            updateTimeRemainingPanel(minutes);
        } else {
            setImage(IMAGE_COMPLETE);
            removeTimer();
            displayReadyToVisitAgain();
        }
    }

    // Function to display the appropriate image based on the timer state
    function setImage(imageUrl) {
        let imageElement = document.getElementById(imageElementId);
        if (!imageElement) {
            imageElement = createElement(imageElementId, 'img', {
                ...commonStyles,
                bottom: '35px',
                right: '100px',
                width: '70px',
                height: '70px',
                cursor: 'pointer'
            });
            imageElement.addEventListener('click', toggleTimerPanel);
        }
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
    }

    // Function to hide timer
    function removeTimer() {
        const countdownElement = document.getElementById(countdownElementId);
        if (countdownElement) {
            countdownElement.remove();
        }
    }

    // Function to update the timer panel content
    function updateTimerPanel(content) {
        let panel = document.getElementById(timerPanelId);
        if (!panel) {
            panel = createElement(timerPanelId, 'div', {
                ...commonStyles,
                bottom: '105px',
                right: '35px',
                maxWidth: '300px',
                textAlign: 'center'
            });
        }

        panel.innerHTML = content;
    }

    // Function to toggle the timer panel visibility
    function toggleTimerPanel() {
        const panel = document.getElementById(timerPanelId);
        const lastVisitTime = GM_getValue('lastVisitTime');
        const countdownDuration = GM_getValue('countdownDuration', 3 * 60 * 60 * 1000); // default 3 hours if not set

        const currentTime = new Date().getTime();
        const timeRemaining = lastVisitTime + countdownDuration - currentTime;
        const minutes = Math.floor(timeRemaining / (1000 * 60));

        // If the panel doesn't exist, create it and set content
        if (!panel) {
            const newPanel = createElement(timerPanelId, 'div', {
                ...commonStyles,
                bottom: '150px',
                right: '150px',
                maxWidth: '250px',
                textAlign: 'center'
            });

            // Update the content based on the remaining time
            if (timeRemaining > 0) {
                updateTimerPanel(`${minutes} minute${minutes === 1 ? '' : 's'} remaining`);
            } else {
                displayReadyToVisitAgain();
            }

            // Show the panel if it was created
            newPanel.style.display = 'block';
        } else {
            // If the panel already exists, just toggle its visibility
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        }

        // Save the current panel state (open or closed)
        GM_setValue('timerPanelOpen', panel ? panel.style.display === 'block' : true);
    }

    // Function to check and apply the last state of the panel when the page loads
    function checkPanelState() {
        const panel = document.getElementById(timerPanelId);
        const panelState = GM_getValue('timerPanelOpen', true); // Default is open if no state is saved

        if (panel) {
            panel.style.display = panelState ? 'block' : 'none';
        }
    }

    // Handle visit time saving and displaying timer
    if (isBuriedTreasurePage) {
        const waitTimeMessage = document.body.textContent.match(/Sorry, you have to wait another (\d+) minutes to play again/);
        if (waitTimeMessage) {
            const waitMinutes = parseInt(waitTimeMessage[1], 10);
            const countdownDuration = waitMinutes * 60 * 1000;
            GM_setValue('countdownDuration', countdownDuration);
            const currentTime = new Date().getTime();
            GM_setValue('lastVisitTime', currentTime);
        }

        const lastVisitTime = GM_getValue('lastVisitTime');
        if (lastVisitTime) {
            const countdownDuration = GM_getValue('countdownDuration', 3 * 60 * 60 * 1000); // Default 3 hours
            displayTimer(lastVisitTime, countdownDuration);
        }
    } else {
        const lastVisitTime = GM_getValue('lastVisitTime');
        const countdownDuration = GM_getValue('countdownDuration', 3 * 60 * 60 * 1000); // Default 3 hours
        if (lastVisitTime) {
            displayTimer(lastVisitTime, countdownDuration);
        }
    }

    // Checks if timer was open/closed and persists based on last state
    checkPanelState();
})();
