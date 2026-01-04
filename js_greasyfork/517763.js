// ==UserScript==
// @name         Torn - Gas Station Skimmer Collection Reminder
// @namespace    http://www.torn.com/
// @version      1.0
// @description  Displays a message that your card skimmers are ready for collection after you set a time (in days) on the skimming page
// @author       Baccy
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/517763/Torn%20-%20Gas%20Station%20Skimmer%20Collection%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/517763/Torn%20-%20Gas%20Station%20Skimmer%20Collection%20Reminder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const gasStationKey = 'gasStationPlacement';

    // Check if the message should be displayed
    function checkReminder() {
        const savedTimestamp = localStorage.getItem(gasStationKey);
        if (savedTimestamp) {
            const now = Date.now();

            // Display message if the saved timestapm is in the past
            if (now > savedTimestamp) {
                displayReminder();
            }
        }
    }

    // Display the reminder
    function displayReminder() {
        const topBanner = document.querySelector('#topHeaderBanner');
        if (topBanner) {
            // Remove any previous reminder messages with the class 'reminder-message'
            const existingMessage = topBanner.querySelector('.skimmer-reminder-message');
            if (existingMessage) {
                existingMessage.remove();
            }
    
            // Create a new element for the reminder message
            const reminderMessage = document.createElement('div');
            reminderMessage.textContent = 'Your Gas Station card skimmers are ready to be collected!';
            reminderMessage.style.color = 'red';
            reminderMessage.style.marginTop = '5px';
            reminderMessage.style.fontWeight = 'bold';
            reminderMessage.classList.add('skimmer-reminder-message');

            topBanner.appendChild(reminderMessage);
        }
    }

    // Add the button and input to the skimming page
    function addInputButton() {
        if (window.location.href.includes('https://www.torn.com/loader.php?sid=crimes#/cardskimming')) {
            const targetElement = document.querySelector('.crime-root.cardskimming-root');
            const buttonElement = document.querySelector('.skimmer-reminder-button');
            const inputElement = document.querySelector('.skimmer-reminder-input');

            if (targetElement && !buttonElement && !inputElement) {
                const button = document.createElement('button');
                button.textContent = 'Set Reminder';
                button.style.margin = '10px';
                button.style.padding = '10px';
                button.style.cursor = 'pointer';
                button.classList.add('skimmer-reminder-button');

                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = 'Days';
                input.style.marginLeft = '10px';
                input.style.backgroundColor = '#232323';
                input.style.color = 'white';
                input.style.padding = '5px';
                input.style.width = '80px';
                input.classList.add('skimmer-reminder-input');

                // Event listener for the button click
                button.addEventListener('click', () => {
                    const days = input.value;
                    const targetTimestamp = Date.now() + (days * 24 * 60 * 60 * 1000);
                    localStorage.setItem(gasStationKey, targetTimestamp);
                    alert(`Card skimmers reminder set for ${days} days.`);
                });

                // Insert the button and input on top of the skimming container
                const container = targetElement.parentElement;
                container.insertBefore(button, targetElement);
                container.insertBefore(input, button.nextSibling);
            }
        }
    }

    // Load functions one second after the page loads (for connection speed differences)
    setTimeout(checkReminder, 1000);
    setTimeout(addInputButton, 1000);
})();
