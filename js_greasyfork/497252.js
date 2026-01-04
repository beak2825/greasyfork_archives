// ==UserScript==
// @name         Filter Appointments and rep appt count
// @namespace    http://tampermonkey.net/
// @version      2.49
// @description  Filter appointments by specific time ranges and show a list of appointment times by sales rep name
// @match        https://u923a.leadperfection.com/Present*
// @grant        none
// @author
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497252/Filter%20Appointments%20and%20rep%20appt%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/497252/Filter%20Appointments%20and%20rep%20appt%20count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Common button styling
    const buttonStyle = `
        color: #bcc2cb;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 10px;
        margin: 0;
        font-weight: normal;
    `;

    const activeButtonStyle = `
        color: #00ff00;
        font-weight: bold;
    `;

    // Button definitions
    const buttons = [
        { text: 'AM', filter: 'time', start: '6:00am', end: '11:30am' },
        { text: 'MID', filter: 'time', start: '12:00pm', end: '3:00pm' },
        { text: 'PM', filter: 'time', start: '3:01pm', end: '11:59pm' },
        { text: 'SALES!', filter: 'dispo', dispo: 'Sale' },
        { text: 'Bad', filter: 'dispo', dispo: ['1Leg', 'NP', 'BD', 'CNS'] },
        { text: 'CCC', filter: 'dispo', dispo: 'CCC' },
        { text: 'No Filter', filter: 'nofilter' },
        { text: 'Prime', filter: 'grade', grade: 'Prime' },
        { text: 'Plus', filter: 'grade', grade: 'Plus' },
        { text: 'No Grade', filter: 'nograde' }
    ];

    // Create new bar
    const newBar = document.createElement('div');
    newBar.style.backgroundColor = '#444d58';
    newBar.style.height = '50px';
    newBar.style.width = '100%';
    newBar.style.display = 'flex';
    newBar.style.alignItems = 'center';
    newBar.style.justifyContent = 'space-between';
    newBar.style.padding = '0 20px';
    newBar.style.boxShadow = '0 4px 2px -2px gray';
    newBar.style.position = 'fixed'; // Position fixed
    newBar.style.zIndex = '1';

    // Create button containers
    const timeButtonContainer = document.createElement('div');
    timeButtonContainer.style.display = 'flex';
    timeButtonContainer.style.gap = '10px';

    const dispoButtonContainer = document.createElement('div');
    dispoButtonContainer.style.display = 'flex';
    dispoButtonContainer.style.gap = '10px';

    const noFilterButtonContainer = document.createElement('div');
    noFilterButtonContainer.style.display = 'flex';
    noFilterButtonContainer.style.gap = '10px';

    const gradeButtonContainer = document.createElement('div');
    gradeButtonContainer.style.display = 'flex';
    gradeButtonContainer.style.gap = '10px';

    buttons.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.innerText = buttonInfo.text;
        button.style.cssText = buttonStyle;

        const countSpan = document.createElement('span');
        countSpan.style.color = '#bcc2cb';
        countSpan.style.marginLeft = '2px';

        button.appendChild(countSpan);

        buttonInfo.countSpan = countSpan;
        buttonInfo.element = button;

        button.addEventListener('click', () => {
            if (buttonInfo.filter === 'nofilter') {
                resetFilter();
            } else {
                toggleButton(buttonInfo);
            }
            applyFilters();
        });

        if (buttonInfo.filter === 'time') {
            timeButtonContainer.appendChild(button);
        } else if (buttonInfo.filter === 'dispo') {
            dispoButtonContainer.appendChild(button);
        } else if (buttonInfo.filter === 'grade' || buttonInfo.filter === 'nograde') {
            gradeButtonContainer.appendChild(button);
        } else if (buttonInfo.filter === 'nofilter') {
            noFilterButtonContainer.appendChild(button);
        }
    });

    newBar.appendChild(timeButtonContainer);
    newBar.appendChild(dispoButtonContainer);
    newBar.appendChild(noFilterButtonContainer);
    newBar.appendChild(gradeButtonContainer);
    document.body.appendChild(newBar);

    function toggleButton(buttonInfo) {
        if (buttonInfo.element.classList.contains('active')) {
            buttonInfo.element.classList.remove('active');
            buttonInfo.element.style.cssText = buttonStyle;
        } else {
            buttonInfo.element.classList.add('active');
            buttonInfo.element.style.cssText = buttonStyle + activeButtonStyle;
        }
    }

    function applyFilters() {
        const activeFilters = {
            time: [],
            dispo: [],
            grade: []
        };

        buttons.forEach(buttonInfo => {
            if (buttonInfo.element.classList.contains('active')) {
                if (buttonInfo.filter === 'time') {
                    activeFilters.time.push({ start: buttonInfo.start, end: buttonInfo.end });
                } else if (buttonInfo.filter === 'dispo') {
                    activeFilters.dispo.push(buttonInfo.dispo);
                } else if (buttonInfo.filter === 'grade') {
                    activeFilters.grade.push(buttonInfo.grade);
                } else if (buttonInfo.filter === 'nograde') {
                    activeFilters.grade.push('No Grade');
                }
            }
        });

        filterAppointments(activeFilters);
        updateButtonCounts();
    }

    function filterAppointments(filters) {
        const appointments = document.querySelectorAll('#presrow > tr');

        appointments.forEach(appointment => {
            let showAppointment = true;
            const dispoElement = appointment.querySelector('td.dispoTD > span.inputField.tblDispo');
            const dispoText = dispoElement ? dispoElement.innerText.trim() : '';

            if (filters.time.length > 0) {
                const timeElement = appointment.querySelector('td.center > span.inputField.custtimefield');
                const timeText = timeElement ? timeElement.innerText.trim() : '';
                const appointmentTime = timeText ? parseTime(timeText) : null;

                if (!filters.time.some(time => isInRange(appointmentTime, time.start, time.end))) {
                    showAppointment = false;
                }
            }

            if (filters.dispo.length > 0 && showAppointment) {
                if (!filters.dispo.some(dispo => Array.isArray(dispo) ? dispo.some(d => dispoText.includes(d)) : dispoText.includes(dispo))) {
                    showAppointment = false;
                }
            }

            if (filters.grade.length > 0 && showAppointment) {
                const gradeText = appointment.innerText;

                if (filters.grade.includes('No Grade')) {
                    if (gradeText.includes('Prime') || gradeText.includes('Plus')) {
                        showAppointment = false;
                    }
                } else {
                    if (!filters.grade.some(grade => gradeText.includes(grade))) {
                        showAppointment = false;
                    }
                }
            }

            appointment.style.display = showAppointment ? '' : 'none';
        });

        updateFooterCount();
        updateUnresultedCount();
    }

    function resetFilter() {
        const appointments = document.querySelectorAll('#presrow > tr');
        appointments.forEach(appointment => {
            appointment.style.display = '';
        });

        buttons.forEach(buttonInfo => {
            buttonInfo.element.classList.remove('active');
            buttonInfo.element.style.cssText = buttonStyle;
        });

        updateFooterCount();
        updateUnresultedCount();
        updateButtonCounts();
    }

    function parseTime(timeString) {
        const [time, modifier] = timeString.split(/(?<=\d)(?=[ap]m)/);
        const [hours, minutes] = time.split(':');
        let parsedHours = parseInt(hours, 10);
        if (modifier === 'pm' && parsedHours !== 12) {
            parsedHours += 12;
        } else if (modifier === 'am' && parsedHours === 12) {
            parsedHours = 0;
        }
        return new Date(1970, 0, 1, parsedHours, parseInt(minutes, 10));
    }

    function isInRange(time, start, end) {
        const startTime = parseTime(start);
        const endTime = parseTime(end);
        return time >= startTime && time <= endTime;
    }

    function updateFooterCount() {
        const footerElement = document.getElementById('repfooter');
        if (footerElement) {
            const visibleAppointments = document.querySelectorAll('#presrow > tr').length - document.querySelectorAll('#presrow > tr[style*="display: none"]').length;
            footerElement.innerText = `${visibleAppointments} Appts`;
        }
    }

    function updateUnresultedCount() {
        const unresultedElement = document.getElementById('custfooter');
        if (unresultedElement) {
            const unresultedCount = Array.from(document.querySelectorAll('#presrow > tr')).filter(appointment => {
                const dispoElement = appointment.querySelector('td.dispoTD > span.inputField.tblDispo');
                return dispoElement && dispoElement.innerText.includes('Issue') && appointment.style.display !== 'none';
            }).length;
            unresultedElement.innerText = `${unresultedCount} Unresulted`;
        }
    }

    function updateButtonCounts() {
        const appointments = document.querySelectorAll('#presrow > tr');
        const counts = {
            'AM': 0,
            'MID': 0,
            'PM': 0,
            'SALES!': 0,
            'Bad': 0,
            'CCC': 0,
            'Prime': 0,
            'Plus': 0,
            'No Grade': 0
        };

        appointments.forEach(appointment => {
            if (appointment.style.display === 'none') return;

            const dispoElement = appointment.querySelector('td.dispoTD > span.inputField.tblDispo');
            const dispoText = dispoElement ? dispoElement.innerText.trim() : '';
            const gradeText = appointment.innerText;

            const timeElement = appointment.querySelector('td.center > span.inputField.custtimefield');
            const timeText = timeElement ? timeElement.innerText.trim() : '';
            const appointmentTime = timeText ? parseTime(timeText) : null;

            if (appointmentTime) {
                if (isInRange(appointmentTime, '6:00am', '11:30am')) counts['AM']++;
                if (isInRange(appointmentTime, '12:00pm', '3:00pm')) counts['MID']++;
                if (appointmentTime > parseTime('3:00pm')) counts['PM']++;
            }

            if (dispoText.includes('Sale') && !dispoText.includes('Follow-Up')) counts['SALES!']++;
            if (['1Leg', 'NP', 'BD', 'CNS'].some(badDispo => dispoText.includes(badDispo))) counts['Bad']++;
            if (dispoText.includes('CCC')) counts['CCC']++;

            if (gradeText.includes('Prime')) counts['Prime']++;
            if (gradeText.includes('Plus')) counts['Plus']++;
            if (!gradeText.includes('Prime') && !gradeText.includes('Plus')) counts['No Grade']++;
        });

        buttons.forEach(buttonInfo => {
            const countSpan = buttonInfo.countSpan;
            const count = counts[buttonInfo.text];
            countSpan.innerText = count !== undefined ? `(${count})` : '';
        });
    }

    window.addEventListener('load', () => {
        setTimeout(updateButtonCounts, 1000);
        updateFooterCount();
        updateUnresultedCount();
    });

    const observer = new MutationObserver(() => {
        updateButtonCounts();
        updateFooterCount();
        updateUnresultedCount();
    });

    observer.observe(document.querySelector('#presrow'), { childList: true, subtree: true });

    const existingBar = document.querySelector('.page-header-menu');
    function adjustNewBarPosition() {
        const existingBarRect = existingBar.getBoundingClientRect();
        newBar.style.top = `${existingBarRect.bottom}px`; // Position just below the existing bar
    }

    window.addEventListener('scroll', adjustNewBarPosition);
    window.addEventListener('resize', adjustNewBarPosition);
    adjustNewBarPosition();

    const dayDropdown = document.querySelector('select[name="day"]');
    if (dayDropdown) {
        dayDropdown.addEventListener('change', () => {
            setTimeout(resetFilter, 1000);
        });
    }
})();
