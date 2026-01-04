// ==UserScript==
// @name         Torn - Travel Reminders
// @namespace    https://www.torn.com/
// @version      0.2
// @description  Set reminders while traveling that prevent you from accidentally flying out again
// @author       Baccy
// @match        https://www.torn.com/index.php
// @match        https://www.torn.com/travelagency.php
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519993/Torn%20-%20Travel%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/519993/Torn%20-%20Travel%20Reminders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add input and save button to flying page
    if (window.location.href === 'https://www.torn.com/index.php') {
        const headerBanner = document.querySelector('#topHeaderBanner');
        headerBanner.style.textAlign = 'center';
        if (headerBanner && !document.querySelector('#travel-reminder-input')) {
            const input = document.createElement('input');
            input.id = 'travel-reminder-input';
            input.placeholder = 'Enter your travel reminder...';

            input.style.padding = '5px 10px';
            input.style.border = '1px solid #555';
            input.style.borderRadius = '5px';
            input.style.backgroundColor = '#333';
            input.style.color = '#fff';
            input.style.fontSize = '14px';
            input.style.marginRight = '10px';
            input.style.outline = 'none';

            input.addEventListener('focus', () => {
                input.style.borderColor = '#888';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#555';
            });

            const saveButton = document.createElement('button');
            saveButton.id = 'save-reminder-button';
            saveButton.textContent = 'Save';

            saveButton.style.padding = '5px 15px';
            saveButton.style.border = '1px solid #555';
            saveButton.style.borderRadius = '5px';
            saveButton.style.backgroundColor = '#444';
            saveButton.style.color = '#fff';
            saveButton.style.fontSize = '14px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.transition = 'background-color 0.3s';

            saveButton.addEventListener('mouseover', () => {
                saveButton.style.backgroundColor = '#555';
            });
            saveButton.addEventListener('mouseout', () => {
                saveButton.style.backgroundColor = '#444';
            });

            saveButton.addEventListener('click', () => {
                const reminderText = input.value.trim();
                if (reminderText) {
                    localStorage.setItem('beforeTravelReminder', reminderText);
                    input.value = '';
                }
            });

            const container = document.createElement('div');
            container.appendChild(input);
            container.appendChild(saveButton);
            headerBanner.appendChild(container);
        }
    }

    // Disable travel and display reminder
    if (window.location.href === 'https://www.torn.com/travelagency.php') {
        const reminder = localStorage.getItem('beforeTravelReminder');
        const tabMenu = document.querySelector('#tab-menu4');

        if (reminder && tabMenu) {
            tabMenu.style.display = 'none';

            const reminderContainer = document.createElement('span');
            reminderContainer.textContent = reminder;

            reminderContainer.style.color = '#fff';
            reminderContainer.style.fontSize = '14px';
            reminderContainer.style.backgroundColor = '#333';
            reminderContainer.style.padding = '5px 10px';
            reminderContainer.style.borderRadius = '5px';
            reminderContainer.style.marginRight = '10px';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Clear';

            deleteButton.style.padding = '5px 15px';
            deleteButton.style.border = '1px solid #555';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.backgroundColor = '#444';
            deleteButton.style.color = '#fff';
            deleteButton.style.fontSize = '14px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.transition = 'background-color 0.3s';

            deleteButton.addEventListener('mouseover', () => {
                deleteButton.style.backgroundColor = '#555';
            });
            deleteButton.addEventListener('mouseout', () => {
                deleteButton.style.backgroundColor = '#444';
            });

            deleteButton.addEventListener('click', () => {
                localStorage.removeItem('beforeTravelReminder');
                reminderContainer.remove();
                deleteButton.remove();

                tabMenu.style.removeProperty('display');
            });

            tabMenu.parentNode.insertBefore(reminderContainer, tabMenu);
            tabMenu.parentNode.insertBefore(deleteButton, tabMenu);
        }
    }
})();