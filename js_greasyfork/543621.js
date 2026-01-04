// ==UserScript==
// @name         Torn - Custom Crime Reminders
// @namespace    duck.wowow
// @version      0.4
// @description  Adds a UI to set custom reminders. Hours input supports conversion of weeks, days, hours and minutes if entered as 2w 3d 23h 10m.
// @author       Baccy
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/543621/Torn%20-%20Custom%20Crime%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/543621/Torn%20-%20Custom%20Crime%20Reminders.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const containerStyles = `
    padding: 10px;
    background-color: #1e1e1e;
    color: #fff;
    border: 1px solid #444;
    border-radius: 8px;
    margin: 10px auto;
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 976px;
    `;

    const inputStyles = `
        background-color: #2c2c2c;
        border: 1px solid #555;
        color: #fff;
        padding: 5px;
        border-radius: 4px;
    `;

    const buttonStyles = `
        background-color: #444;
        color: #fff;
        border: 1px solid #666;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    `;

    function parseDuration(inputStr) {
        let totalMinutes = 0;
        const regex = /(\d+(\.\d+)?)([wdhm])/g;
        const raw = inputStr.trim().toLowerCase();

        if (/^\d+(\.\d+)?$/.test(raw)) {
            return parseFloat(raw);
        }

        let match;
        while ((match = regex.exec(raw)) !== null) {
            const value = parseFloat(match[1]);
            const unit = match[3];
            switch (unit) {
                case 'w':
                    totalMinutes += value * 7 * 24 * 60;
                    break;
                case 'd':
                    totalMinutes += value * 24 * 60;
                    break;
                case 'h':
                    totalMinutes += value * 60;
                    break;
                case 'm':
                    totalMinutes += value;
                    break;
            }
        }

        return totalMinutes > 0 ? totalMinutes / 60 : null;
    }


    const appendReminderUI = () => {
        const root = document.querySelector('#header-root');
        if (!root) return;

        const container = document.createElement('div');
        container.setAttribute('style', containerStyles);

        const hourInput = document.createElement('input');
        hourInput.type = 'text';
        hourInput.placeholder = 'Hours (or 1w 2d 3h 15m)';
        hourInput.setAttribute('style', inputStyles + ' flex: 0 1 auto;');

        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.placeholder = 'Reminder message';
        messageInput.setAttribute('style', inputStyles + ' flex: 1 1 auto;');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.setAttribute('style', buttonStyles + ' flex: 0 1 auto;');


        container.appendChild(hourInput);
        container.appendChild(messageInput);
        container.appendChild(saveButton);
        root.appendChild(container);

        let parseTimeout = null;

        hourInput.addEventListener('input', () => {
            if (parseTimeout) clearTimeout(parseTimeout);
            parseTimeout = setTimeout(() => {
                const parsed = parseDuration(hourInput.value);
                if (!isNaN(parsed)) {
                    hourInput.value = Number.isInteger(parsed) ? parsed.toString() : parsed.toFixed(5);
                }
            }, 3000);
        });

        saveButton.addEventListener('click', async () => {
            const hours = parseFloat(hourInput.value);
            const message = messageInput.value.trim();

            if (isNaN(hours) || hours <= 0 || !message) {
                alert('Enter a valid time (like 2d 3h 15m) and a message.');
                return;
            }

            const time = Date.now() + hours * 60 * 60 * 1000;
            const reminders = await GM.getValue('reminders', {});
            const id = Date.now().toString();
            reminders[id] = { time, message };

            await GM.setValue('reminders', reminders);

            hourInput.value = '';
            messageInput.value = '';
            saveButton.textContent = 'Saved';
            setTimeout(() => {
                saveButton.textContent = 'Save';
            }, 500);
        });
    };

    const checkReminders = async () => {
        const root = document.querySelector('#header-root');
        if (!root) return;

        const reminders = await GM.getValue('reminders', {});
        const now = Date.now();

        for (const [id, { time, message }] of Object.entries(reminders)) {
            if (time <= now) {
                const alertBox = document.createElement('div');
                alertBox.setAttribute('style', containerStyles + ' background-color: #331a1a; border-color: #aa4444;');

                const text = document.createElement('span');
                text.textContent = `Reminder: ${message}`;
                text.setAttribute('style', 'flex: 1;');

                const dismissButton = document.createElement('button');
                dismissButton.textContent = 'Dismiss';
                dismissButton.setAttribute('style', buttonStyles + ' background-color: #aa4444;');

                dismissButton.addEventListener('click', async () => {
                    delete reminders[id];
                    await GM.setValue('reminders', reminders);
                    alertBox.remove();
                });

                alertBox.appendChild(text);
                alertBox.appendChild(dismissButton);
                root.appendChild(alertBox);
            }
        }
    };

    function init() {
        appendReminderUI();
        checkReminders();
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
