// ==UserScript==
// @name         AtoZ Arbeitszeitenrechner
// @namespace    https://atoz.amazon.work
// @version      1.0
// @description  Arbeitszeitrechner für AtoZ - Deutsch
// @author       @celvip
// @match        https://atoz.amazon.work/timecard*
// @match        https://atoz.amazon.work/schedule*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532179/AtoZ%20Arbeitszeitenrechner.user.js
// @updateURL https://update.greasyfork.org/scripts/532179/AtoZ%20Arbeitszeitenrechner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hilfsfunktionen für localStorage
    function setValue(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    function getValue(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    }

    let breakTime = getValue('breakTime', 30);
    let workTime = getValue('workTime', 8);
    const FIXED_MAX_BREAK = 45; // Feste Pausenzeit für maximale Arbeitszeit

    // Erweiterte Übersetzungen für verschiedene Sprachen und Variationen
    const TRANSLATIONS = {
        IN: ['Einstempeln', 'Clock in', 'Punch in', 'In'],
        OUT: ['Ausstempeln', 'Clock out', 'Punch out', 'Out'],
        MISSING: ['Fehlende Stempelzeit', 'Missing punch', 'Missed Punch', 'Missed punch', '--:--']
    };

    const COLORS = {
        GREEN: {
            bg: '#c6efce',
            text: '#006100'
        },
        YELLOW: {
            bg: '#ffeb9c',
            text: '#9c6500'
        },
        RED: {
            bg: '#ffc7ce',
            text: '#9c0006'
        }
    };

    function findPunchTimes() {
        let punchInTime = null;
        let punchOutTime = null;
        let missingPunch = false;

        const elements = document.querySelectorAll('*');

        elements.forEach(element => {
            const text = element.textContent.trim();

            TRANSLATIONS.IN.forEach(term => {
                if (text.includes(term)) {
                    const timeMatch = text.match(/\d{1,2}:\d{2}/);
                    if (timeMatch) {
                        punchInTime = timeMatch[0].padStart(5, '0');
                    }
                }
            });

            TRANSLATIONS.MISSING.forEach(term => {
                if (text.includes(term)) {
                    missingPunch = true;
                }
            });

            if (!missingPunch) {
                TRANSLATIONS.OUT.forEach(term => {
                    if (text.includes(term)) {
                        const timeMatch = text.match(/\d{1,2}:\d{2}/);
                        if (timeMatch) {
                            punchOutTime = timeMatch[0].padStart(5, '0');
                        }
                    }
                });
            }
        });

        return { punchInTime, punchOutTime };
    }

    function getCurrentWorktime(startTime, endTime) {
        if (endTime) {
            return getTimeDifference(startTime, endTime);
        }

        const now = new Date();
        const nowHours = now.getHours();
        const nowMinutes = now.getMinutes();
        const [startHours, startMinutes] = startTime.split(':').map(Number);

        let hours = nowHours - startHours;
        let minutes = nowMinutes - startMinutes;

        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        if (hours < 0) {
            hours += 24;
        }

        return hours + (minutes / 60);
    }

    function getTimeDifference(startTime, endTime) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        let hours = endHours - startHours;
        let minutes = endMinutes - startMinutes;

        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        if (hours < 0) {
            hours += 24;
        }

        return hours + (minutes / 60);
    }

    function getBackgroundColor(hours) {
        if (hours <= 8.5) return COLORS.GREEN;
        if (hours <= 10) return COLORS.YELLOW;
        return COLORS.RED;
    }

    function calculateEndTime(startTime, workHours, breakMinutes) {
        const [hours, minutes] = startTime.split(':').map(Number);
        let endHours = hours + workHours;
        let endMinutes = minutes + breakMinutes;

        if (endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;
        }
        if (endHours >= 24) {
            endHours -= 24;
        }

        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }

    function formatHoursAndMinutes(hours) {
        if (isNaN(hours)) return "0:00";

        const fullHours = Math.floor(hours);
        const minutes = Math.round((hours - fullHours) * 60);
        return `${fullHours}h ${minutes.toString().padStart(2, '0')}min`;
    }

    function updateDisplay(punchInTime = null, punchOutTime = null) {
        const display = document.getElementById('timeCalculator');

        if (display) {
            let content;
            const currentTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            if (punchInTime) {
                const currentWorktime = getCurrentWorktime(punchInTime, punchOutTime);
                const colors = getBackgroundColor(currentWorktime);
                const maxEndTime = calculateEndTime(punchInTime, 10, FIXED_MAX_BREAK);

                display.style.backgroundColor = colors.bg;
                content = `
                    <div style="margin-bottom: 12px; font-weight: bold; color: ${colors.text}; font-size: 20px; text-align: center;"><u>Arbeitszeitenrechner</u></div>
                    <div style="margin-bottom: 8px; color: ${colors.text};">Aktuelle Zeit: <strong>${currentTime}</strong></div>
                    <div style="margin-bottom: 8px; color: ${colors.text};">Einstempelzeit: <strong>${punchInTime}</strong></div>
                    ${punchOutTime ? `<div style="margin-bottom: 8px; color: ${colors.text};">Ausstempelzeit: <strong>${punchOutTime}</strong></div>` : ''}
                    <div style="margin-bottom: 8px; color: ${colors.text};">
                        Arbeitszeit:
                        <select id="workTimeSelect" style="margin-left: 5px; background-color: white;">
                            <option value="6" ${workTime === 6 ? 'selected' : ''}>6 Stunden</option>
                            <option value="8" ${workTime === 8 ? 'selected' : ''}>8 Stunden</option>
                            <option value="9" ${workTime === 9 ? 'selected' : ''}>9 Stunden</option>
                            <option value="10" ${workTime === 10 ? 'selected' : ''}>10 Stunden</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 8px; color: ${colors.text};">
                        Pausenzeit:
                        <select id="breakTimeSelect" style="margin-left: 5px; background-color: white;">
                            <option value="0" ${breakTime === 0 ? 'selected' : ''}>Keine Pause</option>
                            <option value="30" ${breakTime === 30 ? 'selected' : ''}>30 Minuten</option>
                            <option value="45" ${breakTime === 45 ? 'selected' : ''}>45 Minuten</option>
                            <option value="60" ${breakTime === 60 ? 'selected' : ''}>60 Minuten</option>
                        </select>
                    </div>
                    ${!punchOutTime ? `
                    <div style="margin-top: 12px; font-weight: bold; color: ${colors.text};">
                        Geplantes Arbeitsende: <strong>${calculateEndTime(punchInTime, workTime, breakTime)}</strong>
                    </div>
                    <div style="margin-top: 4px; font-weight: bold; color: red;">
                        Spätestes Arbeitsende: <span style="color: red; font-weight: bold; background-color: #ffdddd; padding: 2px 5px; border-radius: 3px;">❗${maxEndTime}❗</span>
                    </div>
                    ` : ''}
                    <div style="font-size: 12px; color: ${colors.text}; margin-top: 8px;">
                        ${punchOutTime ? 'Gesamte' : 'Aktuelle'} Arbeitszeit: ${formatHoursAndMinutes(currentWorktime)}
                    </div>
                    ${!punchOutTime ? `
                        <div style="font-size: 12px; color: ${colors.text}; margin-top: 4px;">
                            Geplante Gesamtzeit: ${workTime}h ${breakTime}min
                        </div>
                        <div style="font-size: 12px; color: ${colors.text}; margin-top: 4px;">
                            Maximale Gesamtzeit: 10h ${FIXED_MAX_BREAK}min
                        </div>
                    ` : ''}
                `;
            } else {
                display.style.backgroundColor = 'white';
                content = `
                    <div style="margin-bottom: 12px; font-weight: bold; color: #666;">Arbeitszeitrechner</div>
                    <div style="margin-bottom: 8px; color: #666;">Aktuelle Zeit: <strong>${currentTime}</strong></div>
                    <div style="margin-bottom: 8px; color: #666;">Einstempelzeit: <strong>Keine Stempelzeit gefunden</strong></div>
                    <div style="margin-bottom: 8px; color: #666;">
                        Arbeitszeit:
                        <select id="workTimeSelect" style="margin-left: 5px; background-color: white;">
                            <option value="6" ${workTime === 6 ? 'selected' : ''}>6 Stunden</option>
                            <option value="8" ${workTime === 8 ? 'selected' : ''}>8 Stunden</option>
                            <option value="9" ${workTime === 9 ? 'selected' : ''}>9 Stunden</option>
                            <option value="10" ${workTime === 10 ? 'selected' : ''}>10 Stunden</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 8px; color: #666;">
                        Pausenzeit:
                        <select id="breakTimeSelect" style="margin-left: 5px; background-color: white;">
                            <option value="30" ${breakTime === 30 ? 'selected' : ''}>30 Minuten</option>
                            <option value="45" ${breakTime === 45 ? 'selected' : ''}>45 Minuten</option>
                            <option value="60" ${breakTime === 60 ? 'selected' : ''}>60 Minuten</option>
                        </select>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 8px;">
                        Warte auf Stempelzeit...
                    </div>
                `;
            }

            display.innerHTML = content;

            // Event Listener
            const breakSelect = document.getElementById('breakTimeSelect');
            if (breakSelect) {
                breakSelect.addEventListener('change', function() {
                    breakTime = parseInt(this.value);
                    setValue('breakTime', breakTime);
                    updateDisplay(punchInTime, punchOutTime);
                });
            }

            const workSelect = document.getElementById('workTimeSelect');
            if (workSelect) {
                workSelect.addEventListener('change', function() {
                    workTime = parseInt(this.value);
                    setValue('workTime', workTime);
                    updateDisplay(punchInTime, punchOutTime);
                });
            }
        }
    }

    function addTimeCalculator() {
        try {
            let display = document.getElementById('timeCalculator');
            if (!display) {
                display = document.createElement('div');
                display.id = 'timeCalculator';
                display.style.cssText = `
                    position: fixed;
                    bottom: 100px;
                    right: 10px;
                    padding: 15px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    min-width: 220px;
                    transition: background-color 0.3s ease;
                    background-color: white;
                `;
                document.body.appendChild(display);
            }

            const { punchInTime, punchOutTime } = findPunchTimes();
            updateDisplay(punchInTime, punchOutTime);
        } catch (e) {
            console.error('Error in addTimeCalculator:', e);
        }
    }

    // Initial ausführen
    setTimeout(() => {
        addTimeCalculator();
        setInterval(addTimeCalculator, 5000);
    }, 1000);

})();