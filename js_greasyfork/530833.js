// ==UserScript==
// @name        Last Origin Pmang Auto Fill Birthday
// @namespace   Violentmonkey Scripts
// @match       https://gates.pmang.jp/lastorigin/gamestart*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 2025/3/25 21:12:05
// @downloadURL https://update.greasyfork.org/scripts/530833/Last%20Origin%20Pmang%20Auto%20Fill%20Birthday.user.js
// @updateURL https://update.greasyfork.org/scripts/530833/Last%20Origin%20Pmang%20Auto%20Fill%20Birthday.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Default values for birthday
    const defaultBirthday = { year: '1995', month: '05', day: '01' };
    let userBirthday = { ...defaultBirthday };

    // Load saved configuration from localStorage
    function loadConfig() {
        const savedBirthday = localStorage.getItem('autoFillBirthday');
        if (savedBirthday) {
            try {
                userBirthday = JSON.parse(savedBirthday);
            } catch {
                console.warn('Failed to parse saved birthday. Resetting to default.');
                userBirthday = { ...defaultBirthday };
            }
        }
    }

    // Save configuration to localStorage
    function saveConfig() {
        localStorage.setItem('autoFillBirthday', JSON.stringify(userBirthday));
    }

    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.id = 'birthday-config-panel';
        panel.style.position = 'fixed';
        panel.style.top = '70px';
        panel.style.left = '70px';
        panel.style.background = 'white';
        panel.style.border = '2px solid #007bff';
        panel.style.borderRadius = '10px';
        panel.style.padding = '20px';
        panel.style.zIndex = '9999';
        panel.style.width = '250px';
        panel.style.display = 'none'; // Hidden by default
        panel.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        panel.style.fontFamily = 'Arial, sans-serif';

        // Title
        const title = document.createElement('h3');
        title.style.fontSize = '16px';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#007bff';
        title.textContent = '配置出生日期';
        panel.appendChild(title);

        // Input for date
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        // Pre-fill with user's saved birthday or default birthday
        const birthday = `${userBirthday.year}-${userBirthday.month}-${userBirthday.day}`;
        dateInput.value = birthday;
        dateInput.style.width = '100%';
        dateInput.style.padding = '8px';
        dateInput.style.marginBottom = '15px';
        dateInput.style.boxSizing = 'border-box';
        dateInput.style.fontSize = '14px';
        dateInput.style.border = '1px solid #ccc';
        dateInput.style.borderRadius = '4px';
        panel.appendChild(dateInput);

        // Save button
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.backgroundColor = '#007bff';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.marginRight = '10px';
        saveButton.style.fontSize = '14px';
        saveButton.onclick = () => {
            const [year, month, day] = dateInput.value.split('-'); // Parse date from input
            userBirthday = { year, month, day };
            saveConfig();
            alert('生日已保存！');
        };
        panel.appendChild(saveButton);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.backgroundColor = '#ccc';
        closeButton.style.color = 'black';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.onclick = () => {
            panel.style.display = 'none';
        };
        panel.appendChild(closeButton);

        document.body.appendChild(panel);
    }

// Create the floating button
    function createFloatingButton() {
        const button = document.createElement('div');
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.left = '20px';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.fontSize = '24px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        button.style.zIndex = '9999';
        button.innerHTML = '&#9881;'; // Gear icon (Unicode)
        button.title = '配置生日';

        button.onclick = () => {
            const panel = document.getElementById('birthday-config-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        document.body.appendChild(button);
    }

    // Function to auto-fill the form and simulate button click
    function autofillAndClickSubmit() {
        const form = document.forms['frmBirthday']; // Find the form with the name 'frmBirthday'
        if (form) {
            const yearInput = form.querySelector('[name="year"]');  // Find the input element for 'year'
            const monthInput = form.querySelector('[name="month"]'); // Find the input element for 'month'
            const dayInput = form.querySelector('[name="day"]');    // Find the input element for 'day'
            const submitButton = form.querySelector('.btn-submit'); // Find the button with class 'btn-submit'

            if (yearInput && monthInput && dayInput && submitButton) {
                yearInput.value = userBirthday.year;
                monthInput.value = userBirthday.month;
                dayInput.value = userBirthday.day;
                console.log(`Form fields have been auto-filled with birthday: ${userBirthday.year}-${userBirthday.month}-${userBirthday.day}`);

                // Simulate a click on the submit button
                setTimeout(() => {
                  submitButton.click();
                }, 200)
                console.log('Submit button has been clicked.');
            } else {
                console.warn('Some input fields (year, month, day) or the submit button are missing in the form.');
            }
        }
    }

    // Observe DOM changes and check if the form exists
    const observer = new MutationObserver(() => {
        const form = document.forms['frmBirthday'];
        if (form) {
            autofillAndClickSubmit(); // Call the function to fill and simulate button click when the form is detected
            observer.disconnect(); // Stop observing once the form is handled
        }
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize the script
    loadConfig(); // Load user configuration
    createConfigPanel(); // Create the configuration panel
    createFloatingButton(); // Create the floating button
})();