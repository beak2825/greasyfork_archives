// ==UserScript==
// @name         Proza.ru & Stihi.ru Randomizer 22
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  "Мне повезёт" + навигация по дате/публикации
// @match        https://stihi.ru/*
// @match        https://proza.ru/*
// @icon         https://i.postimg.cc/3r2Z3hSs/psic.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542046/Prozaru%20%20Stihiru%20Randomizer%2022.user.js
// @updateURL https://update.greasyfork.org/scripts/542046/Prozaru%20%20Stihiru%20Randomizer%2022.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isProza = window.location.hostname.includes('proza.ru');
    const publicationLimits = isProza ? [1, 2000] : [1, 11000];
    const startLimits = isProza ? [1, 250] : [1, 450];

    saveToLocalStorage('publication_min', publicationLimits[0]);
    saveToLocalStorage('publication_max', publicationLimits[1]);
    saveToLocalStorage('start_min', startLimits[0]);
    saveToLocalStorage('start_max', startLimits[1]);

    // Helper functions
    function parseUrl() {
        const urlParts = window.location.pathname.split('/');
        return {
            year: urlParts[1] || '',
            month: urlParts[2] || '',
            day: urlParts[3] || '',
            publication: urlParts[4] || ''
        };
    }

    function updateUrl(year, month, day, publication) {
        const baseUrl = window.location.origin + '/';
        window.location.href = `${baseUrl}${year}/${month}/${day}/${publication}`;
    }

    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    function loadFromLocalStorage(key, defaultValue) {
        return localStorage.getItem(key) || defaultValue;
    }

    function validateInput(field, value) {
        let min, max;
        switch (field) {
            case 'publication':
                min = parseInt(loadFromLocalStorage('publication_min', publicationLimits[0]), 10);
                max = parseInt(loadFromLocalStorage('publication_max', publicationLimits[1]), 10);
                break;
            case 'start':
                min = parseInt(loadFromLocalStorage('start_min', startLimits[0]), 10);
                max = parseInt(loadFromLocalStorage('start_max', startLimits[1]), 10);
                break;
            case 'year':
                min = Math.max(parseInt(loadFromLocalStorage('year_min', '2000') || '2000', 10), 1);
                max = Math.min(parseInt(loadFromLocalStorage('year_max', '9999') || '9999', 10), new Date().getFullYear());
                break;
            default:
                min = parseInt(loadFromLocalStorage(`${field}_min`, '1') || '1', 10);
                max = parseInt(loadFromLocalStorage(`${field}_max`, '9999') || '9999', 10);
        }
        return Math.min(Math.max(value, min), max);
    }


    // Create UI container
    const container = document.createElement('div');
    container.id = 'navigation-enhancer';
    container.innerHTML = `
<table><tr><td>
        <input id="year" type="number" placeholder="Year" style="width: 80px;">
        <input id="month" type="number" placeholder="Month" style="width: 60px;">
        <input id="day" type="number" placeholder="Day" style="width: 60px;">
        <input id="publication" type="number" placeholder="Publication" style="width: 100px;">
        <button id="reset-main-button">🔄</button>
        <button id="settings-button">⚙️</button>
</td><td>
        <button id="lucky-button">🍀</button>
</td></tr></table>
        <div id="settings-menu" style="display:none;">
            <div class="settings-header">
        <label>Set Limits:</label>
        <button id="reset-settings-button">🔄</button>
    </div>
    <div class="settings-group">
        <label>Year:</label>
        <input id="year_min" type="number" style="width: 60px;">
        <input id="year_max" type="number" style="width: 60px;"><br>
        <label>Month:</label>
        <input id="month_min" type="number" style="width: 60px;">
        <input id="month_max" type="number" style="width: 60px;"><br>
        <label>Day:</label>
        <input id="day_min" type="number" style="width: 60px;">
        <input id="day_max" type="number" style="width: 60px;"><br>
        <div>
        <label>Publication:</label>
        <input id="publication_min" type="number" style="width: 60px;">
        <input id="publication_max" type="number" style="width: 60px;"><br>
        </div><div>
        <label>Start:</label>
        <input id="start_min" type="number" style="width: 60px;">
        <input id="start_max" type="number" style="width: 60px;"><br>
        </div>
    </div>
<div class="settings-group">
    <label>Redirect on Change:</label>
    <input id="redirect-on-change" type="checkbox" style="width: 20px;">
</div>
<div class="settings-group">
    <label>Retry on Error 🍀:</label>
    <input id="retry-on-error" type="checkbox" style="width: 20px;">
</div>

        </div>
    `;

    let accessedThroughLucky = false;

    function feelingLuckyList() {
        accessedThroughLucky = true;
        const yearMin = parseInt(loadFromLocalStorage('year_min', '2000'), 10);
        const yearMax = parseInt(loadFromLocalStorage('year_max', String(new Date().getFullYear())), 10);
        const randomYear = Math.floor(Math.random() * (yearMax - yearMin + 1)) + yearMin;

        // Respect user's month limits
        const monthMin = parseInt(loadFromLocalStorage('month_min', '1'), 10);
        const monthMax = parseInt(loadFromLocalStorage('month_max', '12'), 10);
        const randomMonth = Math.floor(Math.random() * (monthMax - monthMin + 1)) + monthMin;

        let maxDays = new Date(randomYear, randomMonth, 0).getDate();
        const randomDay = '01'; // List pages use '01' for day
        const randomStart = Math.floor(Math.random() * (parseInt(loadFromLocalStorage('start_max', startLimits[1]), 10) - parseInt(loadFromLocalStorage('start_min', startLimits[0]), 10) + 1)) + parseInt(loadFromLocalStorage('start_min', startLimits[0]), 10);

        // Parse the topic from the current URL
        const currentUrl = new URL(window.location.href);
        const topic = currentUrl.searchParams.get('topic');

        const baseUrl = window.location.origin + '/texts/list.html';
        const urlParams = `?day=${randomDay}&month=${String(randomMonth).padStart(2, '0')}&year=${randomYear}&topic=${topic}&start=${randomStart}`;

        window.location.href = baseUrl + urlParams;
    }

    function feelingLucky() {
        accessedThroughLucky = true;
        const yearMin = parseInt(loadFromLocalStorage('year_min', '2000'), 10);
        const yearMax = parseInt(loadFromLocalStorage('year_max', String(new Date().getFullYear())), 10);
        const randomYear = Math.floor(Math.random() * (yearMax - yearMin + 1)) + yearMin;
        const randomMonth = Math.floor(Math.random() * 12) + 1;
        let maxDays = new Date(randomYear, randomMonth, 0).getDate();
        const randomDay = Math.floor(Math.random() * maxDays) + 1;
        const randomPublication = Math.floor(Math.random() * 100) + 1;
        updateUrl(randomYear, String(randomMonth).padStart(2, '0'), String(randomDay).padStart(2, '0'), randomPublication);
    }


    // Find a suitable location for the navigation panel
    const header = document.querySelector('#header');
    const headerAlt = document.querySelector('body > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1)');
    if (header) {
        header.insertAdjacentElement('afterend', container);
        container.style.marginTop = '32px';
    } else if (headerAlt) {
        headerAlt.insertAdjacentElement('afterend', container);
    } else {
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Select the retryOnError element
    const retryOnError = document.getElementById('retry-on-error');

    // Restore the retryOnError state from localStorage
    retryOnError.checked = localStorage.getItem('checkboxState') === 'true';

    // Add an event listener to save the retryOnError state whenever it changes
    retryOnError.addEventListener('change', () => {
        localStorage.setItem('checkboxState', retryOnError.checked);
    });

    // Try again if the page is not found and the retryOnError is checked
    const notFound = document.querySelector('h1[align="center"], div[align="center"] > h1')?.textContent.match(/найд|удал|закр|ошиб|стр/i);
    if (notFound && retryOnError.checked && accessedThroughLucky) {
        feelingLucky();
    }

    // Load initial values into inputs
    const urlInfo = parseUrl();
    const inputFields = ['year', 'month', 'day', 'publication'];
    inputFields.forEach(field => {
        const input = document.getElementById(field);
        input.value = validateInput(field, urlInfo[field]);
        input.addEventListener('focus', () => saveToLocalStorage('lastFocusedField', field));
    });

    // Restore focus after reload
    const lastFocusedField = loadFromLocalStorage('lastFocusedField', '');
    if (lastFocusedField) {
        const focusedInput = document.getElementById(lastFocusedField);
        if (focusedInput) focusedInput.focus();
    }

    // Function to handle redirect logic
    let redirectOnChange = loadFromLocalStorage('redirectOnChange', false) === 'true';
    const redirectCheckbox = document.getElementById('redirect-on-change');
    redirectCheckbox.checked = redirectOnChange;

    redirectCheckbox.addEventListener('change', () => {
        redirectOnChange = redirectCheckbox.checked;
        saveToLocalStorage('redirectOnChange', redirectOnChange);
    });

    function updateAndRedirect() {
        accessedThroughLucky = false;
        if (redirectOnChange) {
            updateUrl(
                validateInput('year', document.getElementById('year').value),
                String(validateInput('month', document.getElementById('month').value)).padStart(2, '0'),
                String(validateInput('day', document.getElementById('day').value)).padStart(2, '0'),
                validateInput('publication', document.getElementById('publication').value)
            );
        }
    }

let previousValues = {};

inputFields.forEach(field => {
    const input = document.getElementById(field);
    previousValues[field] = input.value; // Initialize previous value

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleArrowKeys(field, e.key === 'ArrowUp' ? 'up' : 'down');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            saveToLocalStorage(field, input.value);
            previousValues[field] = input.value;
            updateUrl(
                validateInput('year', document.getElementById('year').value),
                String(validateInput('month', document.getElementById('month').value)).padStart(2, '0'),
                String(validateInput('day', document.getElementById('day').value)).padStart(2, '0'),
                validateInput('publication', document.getElementById('publication').value)
            );
        }
    });



    input.addEventListener('blur', () => {
        const validatedValue = validateInput(field, input.value);
        input.value = validatedValue;
        if (input.value !== previousValues[field]) {
            previousValues[field] = input.value; // Update previous value
            updateAndRedirect();
        }
    });

    // Add change event listener for year and month fields
    if (field === 'year' || field === 'month') {
        input.addEventListener('change', () => {
            updateDayLimits();
        });
    }
});

function updateDayLimits() {
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const dayInput = document.getElementById('day');
    const maxDays = new Date(year, month, 0).getDate();

    dayInput.max = maxDays;
    dayInput.value = Math.min(parseInt(dayInput.value), maxDays);

    // Update day limits in settings
    const dayMinInput = document.getElementById('day_min');
    const dayMaxInput = document.getElementById('day_max');
    dayMaxInput.max = maxDays;
    dayMaxInput.value = Math.min(parseInt(dayMaxInput.value), maxDays);
    saveToLocalStorage('day_max', dayMaxInput.value);

    // Ensure day_max is always greater than or equal to day_min
    if (parseInt(dayMaxInput.value) < parseInt(dayMinInput.value)) {
        dayMaxInput.value = dayMinInput.value;
        saveToLocalStorage('day_max', dayMaxInput.value);
    }
}

function handleArrowKeys(field, direction) {
    accessedThroughLucky = false;
    const input = document.getElementById(field);
    let step = event.shiftKey ? 5 : 1;
    let newValue = parseInt(input.value) + (direction === 'up' ? step : -step);

    if (field === 'year') {
        input.value = validateInput(field, newValue);
    } else if (field === 'month') {
        if (newValue > 12) {
            document.getElementById('year').value = validateInput('year', parseInt(document.getElementById('year').value) + Math.floor((newValue - 1) / 12));
            input.value = validateInput('month', ((newValue - 1) % 12) + 1);
        } else if (newValue < 1) {
            document.getElementById('year').value = validateInput('year', parseInt(document.getElementById('year').value) - Math.ceil(-newValue / 12));
            input.value = validateInput('month', 12 - ((-newValue) % 12));
        } else {
            input.value = validateInput('month', newValue);
        }
    } else if (field === 'day') {
        const year = parseInt(document.getElementById('year').value);
        const month = parseInt(document.getElementById('month').value);
        let maxDays = new Date(year, month, 0).getDate();

        if (newValue > maxDays) {
            document.getElementById('month').value = validateInput('month', month + 1);
            if (parseInt(document.getElementById('month').value) > 12) {
                document.getElementById('year').value = validateInput('year', year + 1);
                document.getElementById('month').value = '1';
            }
            input.value = '1';
        } else if (newValue < 1) {
            document.getElementById('month').value = validateInput('month', month - 1);
            if (parseInt(document.getElementById('month').value) < 1) {
                document.getElementById('year').value = validateInput('year', year - 1);
                document.getElementById('month').value = '12';
            }
            maxDays = new Date(parseInt(document.getElementById('year').value), parseInt(document.getElementById('month').value), 0).getDate();
            input.value = maxDays;
        } else {
            input.value = validateInput('day', newValue);
        }
    } else if (field === 'publication') {
        input.value = validateInput('publication', newValue);
    }

    updateDayLimits();
    previousValues[field] = input.value;
    updateAndRedirect();
}

    // "Feeling Lucky" button event listener
    document.getElementById('lucky-button').addEventListener('click', () => {
        if (window.location.pathname.includes('list.html')) {
            feelingLuckyList();
        } else {
            feelingLucky();
        }
    });

    // Settings button functionality (toggle visibility)
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    settingsButton.addEventListener('click', () => {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';

        const limitFields = ['year_min', 'year_max', 'month_min', 'month_max', 'day_min', 'day_max'];
        if (window.location.pathname.includes('list.html')) {
            limitFields.push('start_min', 'start_max');
        } else {
            limitFields.push('publication_min', 'publication_max');
        }

        limitFields.forEach(field => {
            let defaultValue;
            if (field === 'publication_min' || field === 'publication_max') {
                defaultValue = field.includes('min') ? '1' : publicationLimits[1];
            } else if (field === 'start_min' || field === 'start_max') {
                defaultValue = field.includes('min') ? '1' : startLimits[1];
            } else if (field === 'day_max') {
                defaultValue = '31'; // Default max day
            } else {
                defaultValue = field.includes('min') ? '1' : '9999';
            }
            document.getElementById(field).value = loadFromLocalStorage(field, defaultValue);
            const input = document.getElementById(field);
            input.addEventListener('change', () => {
                saveToLocalStorage(field, input.value);
            });
        });
        updateDayLimits(); // Add this line

    });

    // Close settings when clicking outside
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target) && event.target !== settingsButton) {
            settingsMenu.style.display = 'none';
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsMenu.style.display !== 'none') {
            settingsMenu.style.display = 'none';
        }
    });

    const currentYear = new Date().getFullYear();
    const defaultSettings = {
        year_min: '2000',
        year_max: String(currentYear),
        month_min: '1',
        month_max: '12',
        day_min: '1',
        day_max: '31',
        publication_min: '1',
        publication_max: publicationLimits[1],
        start_min: '1',
        start_max: startLimits[1],
    };

    const isListPage = window.location.pathname.includes('list.html');
    const listPageSettings = document.getElementById('start_min').parentElement;
    const publicationSettings = document.getElementById('publication_min').parentElement;

    if (isListPage) {
        listPageSettings.style.display = 'block';
        publicationSettings.style.display = 'none';
    } else {
        listPageSettings.style.display = 'none';
        publicationSettings.style.display = 'block';
    }


    document.getElementById('reset-settings-button').addEventListener('click', resetSettings);

    function resetSettings() {
        const limitFields = ['year_min', 'year_max', 'month_min', 'month_max', 'day_min', 'day_max', 'publication_min', 'publication_max', 'start_min', 'start_max'];
        limitFields.forEach(field => {
            let defaultValue;
            if (field === 'publication_min' || field === 'publication_max') {
                defaultValue = defaultSettings[field];
            } else if (field === 'start_min' || field === 'start_max') {
                defaultValue = defaultSettings[field] || (field.includes('min') ? '1' : startLimits[1]);
            } else {
                defaultValue = defaultSettings[field];
            }
            document.getElementById(field).value = defaultValue;
            saveToLocalStorage(field, defaultValue);
        });
    }


    document.getElementById('reset-main-button').addEventListener('click', resetMainPanel);

    function resetMainPanel() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();
        const inputFields = ['year', 'month', 'day', 'publication'];
        inputFields.forEach(field => {
            let defaultValue;
            switch (field) {
                case 'year':
                    defaultValue = currentYear;
                    break;
                case 'month':
                    defaultValue = currentMonth;
                    break;
                case 'day':
                    defaultValue = currentDay;
                    break;
                case 'publication':
                    defaultValue = 1;
                    break;
            }
            const input = document.getElementById(field);
            input.value = validateInput(field, defaultValue);
            saveToLocalStorage(field, input.value);
        });
        updateUrl(currentYear, String(currentMonth).padStart(2, '0'), String(currentDay).padStart(2, '0'), 1);
    }


    // Add CSS styles directly in the script
    GM_addStyle(`
#navigation-enhancer {
    background-color: #111111;
    padding: 5px;
    font-family: Arial, sans-serif;
    width: 320px;
    margin: 0 24px 0 auto;
    color:white
}

#navigation-enhancer input {
    width: 40px;
    margin-right: 5px;
    background: #111111;
    color: #ffffff;
}

#navigation-enhancer input#publication {
    width: 60px;
}

#navigation-enhancer button {
    margin-right: 5px;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    margin-top: 5px;
    background:black
}

#navigation-enhancer button:hover {
background: #444444
}

#lucky-button{
font-size:200%
}
.settings-header {

}
#reset-settings-button{
}
#settings-menu {
border-left: 4px solid white;

padding:8px
}
.settings-group {
margin-top: 16px;
}
    `);

})();
