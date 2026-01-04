// ==UserScript==
// @name         Timesheet Helper (SYEP)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Adds a draggable and minimizable UI to generate a schedule and slowly autofill the timesheet.
// @author       AI Assistant
// @match        https://participant.yepsonline.org/Pages/TimeSheetDetail.aspx*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542931/Timesheet%20Helper%20%28SYEP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542931/Timesheet%20Helper%20%28SYEP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- TWEAKABLE SETTINGS ---
    const config = {
        DAYS_TO_FILL: ['monday', 'tuesday', 'wednesday', 'thursday', 'sunday'],
        TOTAL_HOURS_GOAL: 25,
        MAX_DAILY_HOURS: 8,
        MIN_DAILY_HOURS: 4,
        MIN_START_HOUR: 8,
        MAX_START_HOUR: 10,
        MIN_LUNCH_START_HOUR: 12,
        MAX_LUNCH_START_HOUR: 14,
    };
    // --- END OF SETTINGS ---

    const dayMap = { 'sunday': 1, 'monday': 2, 'tuesday': 3, 'wednesday': 4, 'thursday': 5, 'friday': 6, 'saturday': 7 };

    // --- CORE LOGIC FUNCTIONS ---
    function generateDailyHours() {
        const numDays = config.DAYS_TO_FILL.length;
        if (numDays === 0) { console.error("Config Error: DAYS_TO_FILL is empty."); return null; }
        let hours = Array(numDays).fill(config.MIN_DAILY_HOURS);
        let remainingHours = config.TOTAL_HOURS_GOAL - (config.MIN_DAILY_HOURS * numDays);
        if (remainingHours < 0) { console.error("Config Error: Total minimum hours exceeds goal."); return null; }

        let attempts = 0;
        while (remainingHours > 0 && attempts < 2000) {
            let randomIndex = Math.floor(Math.random() * numDays);
            if (hours[randomIndex] < config.MAX_DAILY_HOURS) {
                hours[randomIndex] = parseFloat((hours[randomIndex] + 0.5).toFixed(2));
                remainingHours = parseFloat((remainingHours - 0.5).toFixed(2));
            }
            attempts++;
        }
        if (remainingHours > 0) {
            for (let i = 0; remainingHours > 0 && i < numDays; i++) {
                let addAmount = Math.min(config.MAX_DAILY_HOURS - hours[i], remainingHours);
                hours[i] += addAmount; remainingHours -= addAmount;
            }
        }
        return hours;
    }

    function getRandomTime(minHour, maxHour) {
        const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
        const minutes = [0, 15, 30, 45];
        const minute = minutes[Math.floor(Math.random() * minutes.length)];
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        return date;
    }

    function formatTime(date) {
        if (!date) return '---';
        const hh = date.getHours(); const mm = ('0' + date.getMinutes()).slice(-2);
        const ampm = hh >= 12 ? 'PM' : 'AM';
        let displayHour = hh % 12; if (displayHour === 0) displayHour = 12;
        return `${displayHour}:${mm} ${ampm}`;
    }

    // --- UI & EVENT FUNCTIONS ---
    function generateAndDisplaySchedule() {
        const dailyHours = generateDailyHours();
        if (!dailyHours) return;
        const tableBody = document.getElementById('schedule-table-body');
        tableBody.innerHTML = '';

        dailyHours.forEach((hours, index) => {
            const dayName = config.DAYS_TO_FILL[index];
            const startTime = getRandomTime(config.MIN_START_HOUR, config.MAX_START_HOUR);
            let lunchMinutes = 0;
            if (hours > 7) lunchMinutes = 60; else if (hours > 5) lunchMinutes = 30;
            let lunchStartTime = lunchMinutes > 0 ? getRandomTime(config.MIN_LUNCH_START_HOUR, config.MAX_LUNCH_START_HOUR) : null;
            let lunchEndTime = lunchMinutes > 0 ? new Date(lunchStartTime.getTime() + lunchMinutes * 60000) : null;
            const totalDurationMinutes = (hours * 60) + lunchMinutes;
            const endTime = new Date(startTime.getTime() + totalDurationMinutes * 60000);

            const row = document.createElement('tr');
            row.innerHTML = `<td>${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</td><td>${formatTime(startTime)}</td><td>${formatTime(lunchStartTime)}</td><td>${formatTime(lunchEndTime)}</td><td>${formatTime(endTime)}</td><td>${hours.toFixed(2)}</td>`;
            tableBody.appendChild(row);
        });
        document.getElementById('autofill-go-btn').disabled = false;
    }

    async function slowTypeValue(element, value) {
        element.focus(); element.value = '';
        for (const char of value) {
            element.value += char;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function startAutofill() {
        const autofillBtn = document.getElementById('autofill-go-btn');
        autofillBtn.disabled = true; autofillBtn.textContent = 'Filling...';

        const rows = document.querySelectorAll('#schedule-table-body tr');
        for (const row of rows) {
            const cells = row.getElementsByTagName('td');
            const dayName = cells[0].textContent.toLowerCase();
            const dayIndex = dayMap[dayName];
            const timeData = { TimeIn: cells[1].textContent, LunchOut: cells[2].textContent, LunchIn: cells[3].textContent, TimeOut: cells[4].textContent };

            for (const type in timeData) {
                const [timeValue, ampmValue] = timeData[type].split(' ');
                if (timeValue !== '---') {
                    const timeBox = document.getElementById(`ctl00_MainContent_txtTC${type}${dayIndex}_tcTimeBox`);
                    const ampmBox = document.getElementById(`ctl00_MainContent_txtTC${type}${dayIndex}_tcAMPMBox`);
                    if (timeBox && ampmBox) {
                        await slowTypeValue(timeBox, timeValue);
                        if (ampmValue) {
                           ampmBox.value = ampmValue;
                           ampmBox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            }
        }
        autofillBtn.textContent = 'Autofill Complete!';
        setTimeout(() => { autofillBtn.textContent = 'Autofill from Table'; autofillBtn.disabled = false; }, 3000);
        if (typeof showHoursWorked === 'function') { showHoursWorked(); }
    }

    // --- UI CREATION & STYLING ---
    const container = document.createElement('div'); container.id = 'autofill-container';
    const header = document.createElement('div'); header.id = 'autofill-header';
    const title = document.createElement('span'); title.textContent = 'Timesheet Helper';
    const minimizeBtn = document.createElement('button'); minimizeBtn.id = 'minimize-btn'; minimizeBtn.innerHTML = '—';
    header.appendChild(title); header.appendChild(minimizeBtn);
    const content = document.createElement('div'); content.id = 'autofill-content';
    const buttonContainer = document.createElement('div'); buttonContainer.className = 'button-container';
    const generateBtn = document.createElement('button'); generateBtn.innerHTML = 'Generate Schedule'; generateBtn.id = 'generate-btn';
    const autofillBtn = document.createElement('button'); autofillBtn.innerHTML = 'Autofill from Table'; autofillBtn.id = 'autofill-go-btn'; autofillBtn.disabled = true;
    buttonContainer.appendChild(generateBtn); buttonContainer.appendChild(autofillBtn);
    const table = document.createElement('table'); table.id = 'schedule-table';
    table.innerHTML = `<thead><tr><th>Day</th><th>In</th><th>Lunch Out</th><th>Lunch In</th><th>Out</th><th>Hrs</th></tr></thead><tbody id="schedule-table-body"></tbody>`;
    content.appendChild(buttonContainer); content.appendChild(table);
    container.appendChild(header); container.appendChild(content);
    document.body.appendChild(container);

    // --- EVENT LISTENERS ---
    generateBtn.addEventListener('click', generateAndDisplaySchedule);
    autofillBtn.addEventListener('click', startAutofill);
    minimizeBtn.addEventListener('click', () => {
        const isMinimized = content.style.display === 'none';
        content.style.display = isMinimized ? 'block' : 'none';
        minimizeBtn.innerHTML = isMinimized ? '—' : '▢';
    });

    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', (e) => {
        isDragging = true; offsetX = e.clientX - container.offsetLeft; offsetY = e.clientY - container.offsetTop;
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); e.preventDefault();
    });
    function onMouseMove(e) { if (!isDragging) return; container.style.left = `${e.clientX - offsetX}px`; container.style.top = `${e.clientY - offsetY}px`; }
    function onMouseUp() { isDragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }

    // --- STYLES ---
    GM_addStyle(`
        #autofill-container { position: fixed; top: 100px; right: 20px; z-index: 9999; width: 550px; background: #282a36; color: #f8f8f2; border: 1px solid #44475a; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-family: Segoe UI, sans-serif; }
        #autofill-header { padding: 10px 15px; background: #44475a; cursor: move; border-top-left-radius: 11px; border-top-right-radius: 11px; display: flex; justify-content: space-between; align-items: center; }
        #autofill-header span { font-weight: bold; }
        #autofill-content { padding: 15px; border-top: 1px solid #44475a; }
        #minimize-btn { background: none; border: none; color: #f8f8f2; font-size: 20px; font-weight: bold; cursor: pointer; line-height: 1; padding: 0 5px; }
        .button-container { display: flex; gap: 10px; margin-bottom: 15px; }
        #generate-btn, #autofill-go-btn { flex: 1; padding: 10px; font-size: 14px; font-weight: bold; color: white; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, transform 0.1s; }
        #generate-btn { background-color: #6272a4; } #generate-btn:hover { background-color: #7184c2; }
        #autofill-go-btn { background-color: #50fa7b; color: #282a36; } #autofill-go-btn:hover { background-color: #69ff91; }
        #autofill-go-btn:disabled { background-color: #555; cursor: not-allowed; opacity: 0.6; }
        #schedule-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        #schedule-table th, #schedule-table td { border: 1px solid #44475a; padding: 6px; text-align: center; }
        #schedule-table th { background-color: #44475a; }
        #schedule-table td { background-color: #3b3d4d; }
    `);
})();