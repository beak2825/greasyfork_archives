// ==UserScript==
// @name         Reminder addon for Bodega Bot
// @version      1.1
// @description  Adds a customizable reminder system to Bodega Bot.
// @author       Bort
// @license
// @icon        https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts*
// @grant       none
// @run-at      document-end
// @namespace https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/502416/Reminder%20addon%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/502416/Reminder%20addon%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Bodega Bot Reminder Script is running");

    function initializeReminder() {
        console.log("Initializing reminder system");

        // Create a style element for custom styles
        const style = document.createElement('style');
        style.innerHTML = `
            #reminder-container {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
            }
            #reminder-form {
                display: none;
                margin-top: 10px;
            }
            .reminder {
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);

        // HTML for the reminder UI
        const reminderUI = `
            <div id="reminder-container">
                <h3>Reminders</h3>
                <div id="reminder-list"></div>
                <button id="add-reminder">Add Reminder</button>
                <div id="reminder-form">
                    <input type="text" id="reminder-text" placeholder="Enter reminder text" style="width: 100%; margin-bottom: 5px;">
                    <input type="color" id="reminder-color" value="#ff0000" style="width: 100%; margin-bottom: 5px;">
                    <input type="text" id="reminder-emoji" placeholder="Enter emoji" style="width: 100%; margin-bottom: 5px;">
                    <button id="save-reminder">Save Reminder</button>
                    <button id="cancel-reminder">Cancel</button>
                </div>
            </div>
        `;

        // Add the reminder UI to the page
        const div = document.createElement('div');
        div.innerHTML = reminderUI;
        document.body.appendChild(div);

        // Event listeners for buttons
        document.getElementById('add-reminder').addEventListener('click', () => {
            console.log("Add Reminder button clicked");
            document.getElementById('reminder-form').style.display = 'block';
        });

        document.getElementById('save-reminder').addEventListener('click', () => {
            console.log("Save Reminder button clicked");
            const text = document.getElementById('reminder-text').value;
            const color = document.getElementById('reminder-color').value;
            const emoji = document.getElementById('reminder-emoji').value;
            console.log(`Reminder details - Text: ${text}, Color: ${color}, Emoji: ${emoji}`);
            if (text) {
                addReminder(text, color, emoji);
                document.getElementById('reminder-text').value = '';
                document.getElementById('reminder-color').value = '#ff0000';
                document.getElementById('reminder-emoji').value = '';
                document.getElementById('reminder-form').style.display = 'none';
            }
        });

        document.getElementById('cancel-reminder').addEventListener('click', () => {
            console.log("Cancel Reminder button clicked");
            document.getElementById('reminder-text').value = '';
            document.getElementById('reminder-color').value = '#ff0000';
            document.getElementById('reminder-emoji').value = '';
            document.getElementById('reminder-form').style.display = 'none';
        });

        console.log("Event listeners attached");
    }

    // Function to add a reminder
    function addReminder(text, color, emoji) {
        console.log(`Adding reminder: ${text}, ${color}, ${emoji}`);
        const reminderList = document.getElementById('reminder-list');
        const reminderDiv = document.createElement('div');
        reminderDiv.className = 'reminder';
        reminderDiv.style.color = color;
        reminderDiv.innerHTML = `${emoji} ${text}`;
        reminderList.appendChild(reminderDiv);
    }

    // Run the initialization function when the DOM is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeReminder);
    } else {
        initializeReminder();
    }
})();