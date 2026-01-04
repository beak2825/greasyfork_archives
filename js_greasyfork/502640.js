// ==UserScript==
// @name         Daily Reminder Tool
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Set daily reminders
// @match        https://example.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502640/Daily%20Reminder%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/502640/Daily%20Reminder%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // We wrap all logic in a main function.
    // This lets us call it on initial load AND on bfcache restore.
    function initializeReminderScript() {
        console.log('Reminder Tool: Initializing...');

        // --- 1. Cleanup old state (for bfcache/page restore) ---
        // If an old interval is running (or paused), kill it.
        // This is the fix for the double-notification bug.
        if (window.myReminderIntervalId) {
            console.log('Reminder Tool: Clearing old interval ' + window.myReminderIntervalId);
            clearInterval(window.myReminderIntervalId);
        }

        // This array will hold all our reminder objects
        let allReminders = [];

        // --- 2. Setup the Page UI ---
        document.title = 'Daily Reminder Tool';
        document.body.innerHTML = `
            <h1>Daily Reminder Tool</h1>
            <input type="time" id="reminderTime" value="22:00">
            <input type="text" id="reminderMessage" placeholder="Reminder message" value="FT">
            <button id="setReminder">Set Daily Reminder</button>
            <hr>
            <h2>Active Reminders</h2>
            <div id="activeRemindersContainer"></div>
        `;

        // Get references to the UI elements *after* creating them
        const timeInputEl = document.getElementById('reminderTime');
        const messageInputEl = document.getElementById('reminderMessage');
        const setReminderBtn = document.getElementById('setReminder');
        const remindersContainer = document.getElementById('activeRemindersContainer');

        // --- 3. Define Functions ---

        function requestNotificationPermission() {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }

        function showNotification(message) {
            if (Notification.permission === 'granted') {
                new Notification('Daily Reminder', {
                    body: message,
                    requireInteraction: true
                });
            } else {
                alert(`Reminder: ${message}\n(Please grant notification permission)`);
            }
        }

        function updateReminderListUI() {
            remindersContainer.innerHTML = '';
            allReminders.forEach(reminder => {
                const reminderElement = document.createElement('p');
                reminderElement.textContent = `Daily reminder set for ${reminder.time}: ${reminder.message}`;
                remindersContainer.appendChild(reminderElement);
            });
        }

        function setDailyReminder(timeInput, message) {
            if (!timeInput || message.trim() === '') {
                alert('Please enter a valid time and message.');
                return;
            }
            allReminders.push({
                time: timeInput,
                message: message.trim()
            });
            updateReminderListUI();
        }

        // --- 4. The "Master Clock" ---
        function checkAllReminders() {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            allReminders.forEach(reminder => {
                const [hours, minutes] = reminder.time.split(':');
                if (parseInt(hours) === currentHours && parseInt(minutes) === currentMinutes) {
                    // Prevent spamming if check runs multiple times in one minute
                    if (!reminder.lastTriggered || (now.getTime() - reminder.lastTriggered) > 60000) {
                        reminder.lastTriggered = now.getTime();
                        showNotification(reminder.message);
                    }
                }
            });
        }

        // --- 5. Start Everything ---
        requestNotificationPermission();

        // Add your permanent reminders (and your commented-out ones)
        setDailyReminder('20:00', 'Sb');
        //setDailyReminder('21:30', 'tev');
        //setDailyReminder('22:30', 'tev2');

        // Add event listener for the button
        setReminderBtn.addEventListener('click', () => {
            setDailyReminder(timeInputEl.value, messageInputEl.value);
            messageInputEl.value = '';
        });

        // Start the master clock and save its ID to the window
        checkAllReminders(); // Run once immediately
        window.myReminderIntervalId = setInterval(checkAllReminders, 60000);
        console.log('Reminder Tool: Started new interval ' + window.myReminderIntervalId);
    }


    // --- This is the execution logic ---

    // 1. Run the script for the initial, standard page load
    initializeReminderScript();

    // 2. Add a listener to re-run the script if the page is restored from bfcache
    window.addEventListener('pageshow', function(event) {
        // event.persisted is true if the page was restored from cache
        if (event.persisted) {
            console.log('Reminder Tool: Re-initializing on bfcache restore.');
            initializeReminderScript();
        }
    });

})();