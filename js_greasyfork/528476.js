// ==UserScript==
// @name         Mchl - 28 Days Later
// @namespace    http://tampermonkey.net/
// @version      2025-03-01-2
// @description  Medication re-order reminder every 28 days
// @author       You
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528476/Mchl%20-%2028%20Days%20Later.user.js
// @updateURL https://update.greasyfork.org/scripts/528476/Mchl%20-%2028%20Days%20Later.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'a_meds_reminder';
    const element = document.querySelector('#topHeaderBanner');

    if (!element) return;

    function getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    function addDays(dateStr, days) {
        let date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    function saveReminder(days) {
        const today = getCurrentDate();
        const nextReminderDate = addDays(today, days);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nextReminderDate }));
        location.reload();
    }

    function showMessage(msg) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'odung-meds-reminder';
        messageDiv.style.cssText = "background: #555; color: white; padding: 10px; font-size: 16px; text-align: center; border-radius: 5px;";
        messageDiv.textContent = msg;
        if (!document.querySelector('.odung-meds-reminder')) element.appendChild(messageDiv);
    }

    let storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!storedData) {
        const inputDiv = document.createElement('div');
        inputDiv.style.cssText = "background: #222; color: white; padding: 10px; text-align: center; border-radius: 5px;";

        const inputField = document.createElement('input');
        inputField.type = 'number';
        inputField.min = 1;
        inputField.value = 28;
        inputField.style.cssText = "margin-right: 10px; padding: 5px; border-radius: 3px; border: 1px solid #ccc;";

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = "background: green; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;";
        saveButton.onclick = () => saveReminder(parseInt(inputField.value, 10));

        inputDiv.appendChild(document.createTextNode('Set reminder interval (days): '));
        inputDiv.appendChild(inputField);
        inputDiv.appendChild(saveButton);
        element.appendChild(inputDiv);
    } else {
        let { nextReminderDate } = storedData;
        const today = getCurrentDate();

        while (nextReminderDate < today) {
            nextReminderDate = addDays(nextReminderDate, 28);
        }

        if (nextReminderDate === today) {
            showMessage("Reminder: Reorder your meds today!");
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nextReminderDate }));
    }
})();
