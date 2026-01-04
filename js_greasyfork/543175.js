// ==UserScript==
// @name         War End
// @version      Beta1.6
// @namespace    https://greasyfork.org/
// @description  Adds a toggle-able side bar to estimate War End for a given faction.
// @author       Gravity0000
// @supportURL   https://www.torn.com/profiles.php?XID=2131364
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543175/War%20End.user.js
// @updateURL https://update.greasyfork.org/scripts/543175/War%20End.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
    const isDarkMode = document.body.classList.contains('dark-mode');
    let placeholderColor = isDarkMode ? '#bbbbbb' : '#555555';
    function updatePlaceholderStyle() {
        styleTag.textContent = `
            .leadBox::placeholder {
                color: ${placeholderColor} !important;
            }
        `;
    }

    const container = document.createElement('div');
    container.id = 'myScriptContainer';
    container.style.display = 'none';
    document.body.appendChild(container);

    const infoBox = document.createElement('div');
    infoBox.id = 'myInfoBox';
    infoBox.innerHTML = 'Initial Info';
    container.appendChild(infoBox);

    const leadBox = document.createElement('input');
    leadBox.type = 'number';
    leadBox.id = 'myLeadBox';
    leadBox.placeholder = 'Est. Lead or Blank';
    leadBox.classList.add('leadBox');
    container.appendChild(leadBox);

    leadBox.addEventListener('keypress', event => {
        const key = event.keyCode || event.which;
        if (!((key >= 48 && key <= 57) || key === 8)) event.preventDefault();
    });

    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'WarEnd';
    toggleButton.id = 'myToggleButton';
    Object.assign(toggleButton.style, {
        position: 'fixed',
        top: '65%',
        right: '0%',
        zIndex: '9999',
        cursor: 'pointer'
    });
    document.body.appendChild(toggleButton);
    toggleButton.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? '' : 'none';
    });

    const updateButton = document.createElement('button');
    updateButton.id = 'myUpdateButton';
    updateButton.textContent = 'Update';
    container.appendChild(updateButton);

    function applyThemeColors(isDark) {
        const textColor = isDark ? 'white' : 'black';
        const bgColor = isDark ? 'black' : 'white';
        const containerBg = isDark ? '#A9A9A9' : '#D3D3D3';
        const buttonBg = isDark ? '#009407' : '#98f59b';
        const borderColor = isDark ? 'white' : 'black';
        [infoBox, leadBox, toggleButton, updateButton].forEach(el => el.style.color = textColor);
        [infoBox, leadBox].forEach(el => el.style.backgroundColor = bgColor);
        [toggleButton, updateButton].forEach(el => {
            el.style.border = `1px solid ${borderColor}`;
            el.style.backgroundColor = buttonBg;
        });
        container.style.backgroundColor = containerBg;
        placeholderColor = isDark ? '#FFFFFF' : '#000000';
        updatePlaceholderStyle();
    }

    const observer = new MutationObserver(() => {
        applyThemeColors(document.body.classList.contains('dark-mode'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    updateButton.addEventListener('click', () => {
        const leadInput = parseInt(leadBox.value, 10);
        const noWar = document.querySelector('.f-msg .title')?.textContent.includes('NOT IN A WAR');
        const timerElem = document.querySelector('.infoBlock___bb_KF.timer___fSGg8');

        if (noWar && !timerElem) {
            infoBox.innerHTML = 'No current war';
            return;
        }

        if (!noWar && timerElem) {
            const spans = timerElem.querySelectorAll('span');
            const days = parseInt(spans[0].textContent + spans[1].textContent, 10);
            const hours = parseInt(spans[3].textContent + spans[4].textContent, 10);
            const minutes = parseInt(spans[6].textContent + spans[7].textContent, 10);
            const seconds = parseInt(spans[9].textContent + spans[10].textContent, 10);

            const targetElem = document.querySelector('.scoreBlock___Pr3xV .target___NBVXq');
            const scoreElem = document.querySelector('.scoreBlock___Pr3xV .right.scoreText___uVRQm.currentFaction___Omz6o');

            if (!targetElem || !scoreElem) {
                infoBox.innerHTML = 'War not started';
                return;
            }

            const match = targetElem.textContent.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*\/\s*(\d{1,3}(?:,\d{3})*|\d+)/);
            if (!match) {
                infoBox.innerHTML = 'Unable to parse target lead';
                return;
            }

            const currentLead = parseInt(match[1].replace(/,/g, ''), 10);
            const targetLead = parseInt(match[2].replace(/,/g, ''), 10);
            const hypotheticalLead = !isNaN(leadInput) ? leadInput : currentLead;

            const elapsedMs = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
            const nowMs = Date.now();
            const warStartMs = nowMs - elapsedMs;

            const elapsedHoursTotal = days * 24 + hours + minutes / 60 + seconds / 3600;

            const scoreGap = Math.max(0, targetLead - hypotheticalLead);

            let timeLeftHours = 0;

            if (scoreGap <= 0) {
                timeLeftHours = 0;
            } else {
                if (elapsedHoursTotal < 24) {
                    // Decay has not started yet, first tick at 24h
                    const decayPerHour = targetLead / 100; // fixed for first 100 ticks
                    const hoursUntilFirstTick = 24 - elapsedHoursTotal;
                    const remainingScore = scoreGap;
                    const additionalHours = Math.ceil(remainingScore / decayPerHour);
                    timeLeftHours = hoursUntilFirstTick + additionalHours;
                } else {
                    // Decay has started
                    const fullElapsedHours = Math.floor(elapsedHoursTotal);
                    const remainingDecayHours = 123 - fullElapsedHours;
                    const decayPerHour = targetLead / remainingDecayHours;
                    timeLeftHours = Math.ceil(scoreGap / decayPerHour) - (elapsedHoursTotal - fullElapsedHours);
                }
            }

            const dispDays = Math.floor(timeLeftHours / 24);
            const dispHours = Math.floor(timeLeftHours % 24);
            const dispMins = Math.round((timeLeftHours % 1) * 60);

            let timeLeftStr;
            if (dispDays > 0) {
                timeLeftStr = `${dispDays}d ${dispHours}h ${dispMins}m`;
            } else if (dispHours > 0) {
                timeLeftStr = `${dispHours}h ${dispMins}m`;
            } else {
                timeLeftStr = `${dispMins}m`;
            }

            const endMs = nowMs + timeLeftHours * 3600000;
const endDate = new Date(endMs);

// Round up to next full minute
if (endDate.getSeconds() > 0 || endDate.getMilliseconds() > 0) {
    endDate.setMinutes(endDate.getMinutes() + 1);
}
endDate.setSeconds(0, 0);

const endHours = String(endDate.getUTCHours()).padStart(2, '0');
const endMinutes = String(endDate.getUTCMinutes()).padStart(2, '0');
            let tctStr = `End Time TCT:<br>${endHours}:${endMinutes}`;
            if (dispDays > 0) tctStr = `End Time TCT:<br>In ${dispDays}D at ${endHours}:${endMinutes}`;

            infoBox.innerHTML = `Time Left:<br>${timeLeftStr}<br><br>${tctStr}`;
        } else {
            infoBox.innerHTML = 'War not started';
        }
    });

    GM_addStyle(`
        #myScriptContainer {
            position: fixed;
            width: 150px;
            top: 70%;
            right: 0%;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        #myLeadBox {
            padding: 5px;
            border: 1px solid #ddd;
        }
        #myInfoBox {
            color: black;
            padding: 5px;
            text-align: center;
            background-color: #f2f2f2;
        }
        #myUpdateButton, #myToggleButton {
            padding: 5px 10px;
            cursor: pointer;
        }
    `);

    // Apply initial theme
    applyThemeColors(isDarkMode);
})();