// ==UserScript==
// @name         *LSS Einsatzliste – Notizfeld
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Einsatz Notizfeld mit Min-/Max-Zeit-Anzeige
// @author       Hendrik & ChatGPT(OpenAI)
// @license      MIT
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534041/%2ALSS%20Einsatzliste%20%E2%80%93%20Notizfeld.user.js
// @updateURL https://update.greasyfork.org/scripts/534041/%2ALSS%20Einsatzliste%20%E2%80%93%20Notizfeld.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractAverageCredits(mission) {
        const missionData = mission.dataset.sortableBy;
        if (missionData) {
            try {
                const missionObj = JSON.parse(missionData);
                return missionObj.average_credits;
            } catch (e) {
                console.error('Fehler beim Parsen von missionData:', e);
            }
        }
        return null;
    }

    function roundToNextQuarterHour(time) {
        const minutes = time.getMinutes();
        const remainder = minutes % 15;
        const roundedMinutes = remainder === 0 ? minutes : minutes + (15 - remainder);
        time.setMinutes(roundedMinutes);
        time.setSeconds(0);
        return time;
    }

    function setMissionTime(mission) {
        const averageCredits = extractAverageCredits(mission);
        if (averageCredits !== null) {
            const currentTime = new Date();
            let newTime;
            if (averageCredits >= 5000) {
                newTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000); // 3h ab 5000
            } else {
                newTime = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000); // 1h bis 4999
            }

            newTime = roundToNextQuarterHour(newTime);

            const hours = newTime.getHours().toString().padStart(2, '0');
            const minutes = newTime.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}${minutes}`;

            const noteField = mission.querySelector('input[type="text"]');
            const missionId = mission.getAttribute('mission_id');
            if (noteField && missionId) {
                const existingValue = noteField.value.trim();
                if (existingValue === '') {
                    noteField.value = formattedTime;
                    localStorage.setItem('lss_note_' + missionId, formattedTime);
                }
                updateInputColor(noteField);
            }
        }
    }

    function addTextFields() {
        const container = document.querySelector('#mission_list_alliance');
        if (!container) return;

        container.querySelectorAll('.missionSideBarEntry:not([data-textfield-added])').forEach(entry => {
            const missionId = entry.getAttribute('mission_id') || entry.dataset.missionId;
            if (!missionId) return;

            entry.style.display = 'flex';
            entry.style.alignItems = 'center';
            entry.style.justifyContent = 'space-between';

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.flexShrink = '0';
            wrapper.style.width = '80px';
            wrapper.style.marginLeft = '10px';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Notiz';
            input.style.width = '100%';
            input.style.boxSizing = 'border-box';
            input.style.borderRadius = '12px';
            input.style.border = '1px solid #ff4d4d';
            input.style.padding = '8px 24px 8px 8px';
            input.style.backgroundColor = '#ffd6d6';
            input.style.fontSize = '14px';
            input.style.fontFamily = 'Arial, sans-serif';
            input.style.color = '#b30000';
            input.style.textAlign = 'center';

            input.maxLength = 5;
            input.value = localStorage.getItem('lss_note_' + missionId) || '';

            input.addEventListener('focus', () => {
                input.style.borderColor = '#ff1a1a';
                input.style.backgroundColor = '#ffcccc';
            });

            input.addEventListener('blur', () => {
                updateInputColor(input);
            });

            input.addEventListener('input', () => {
                localStorage.setItem('lss_note_' + missionId, input.value);
                updateInputColor(input);
            });

            const clearBtn = document.createElement('span');
            clearBtn.textContent = '×';
            clearBtn.style.position = 'absolute';
            clearBtn.style.right = '8px';
            clearBtn.style.top = 'calc(50% - 1px)';
            clearBtn.style.transform = 'translateY(-50%)';
            clearBtn.style.cursor = 'pointer';
            clearBtn.style.color = '#900';
            clearBtn.style.fontWeight = 'bold';
            clearBtn.style.fontSize = '14px';

            clearBtn.addEventListener('click', () => {
                input.value = '';
                localStorage.removeItem('lss_note_' + missionId);
                updateInputColor(input);
            });

            wrapper.appendChild(input);
            wrapper.appendChild(clearBtn);
            entry.appendChild(wrapper);
            entry.setAttribute('data-textfield-added', 'true');

            updateInputColor(input);
            setMissionTime(entry);
        });
    }

    function updateInputColor(input) {
        const val = input.value.trim();
        if (val === '') {
            input.style.backgroundColor = '#ffd6d6';
            input.style.color = '#b30000';
            input.style.borderColor = '#ff4d4d';
        } else if (/^\d{4}$/.test(val)) {
            input.style.backgroundColor = '#d4f7d4';
            input.style.color = '#006400';
            input.style.borderColor = '#006400';
        } else {
            input.style.backgroundColor = '#ffe4b3';
            input.style.color = '#ff8c00';
            input.style.borderColor = '#ff8c00';
        }
    }

    function updateMinTime() {
        const minTimeBox = document.getElementById('minTimeDisplay');
        if (!minTimeBox) return;

        let times = [];

        const container = document.querySelector('#mission_list_alliance');
        if (!container) return;

        container.querySelectorAll('.missionSideBarEntry input[type="text"]').forEach(input => {
            const val = input.value.trim();
            if (/^\d{4}$/.test(val)) {
                const hour = parseInt(val.slice(0, 2), 10);
                const min = parseInt(val.slice(2), 10);
                if (hour <= 23 && min <= 59) {
                    times.push({ hour, min, input });
                }
            }
        });

        if (times.length > 0) {
            times.sort((a, b) => (a.hour * 60 + a.min) - (b.hour * 60 + b.min));

            const next = times[0];
            const last = times[times.length - 1];
            const count = times.filter(t => t.hour === next.hour && t.min === next.min).length;

            const formatTime = t => `${String(t.hour).padStart(2, '0')}:${String(t.min).padStart(2, '0')}`;
            minTimeBox.textContent = `Nächster: ${formatTime(next)} Uhr (${count}x) | Letzter: ${formatTime(last)} Uhr`;

            minTimeBox.onclick = () => {
                next.input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                next.input.focus();
            };
        } else {
            minTimeBox.textContent = 'Nächster: --:-- Uhr | Letzter: --:-- Uhr';
            minTimeBox.onclick = () => {};
        }
    }

    function addMinTimeDisplay() {
        const container = document.querySelector('#mission_list_alliance');
        if (!container || document.getElementById('minTimeDisplay')) return;

        const box = document.createElement('div');
        box.id = 'minTimeDisplay';
        box.style.fontSize = '16px';
        box.style.fontWeight = 'bold';
        box.style.color = '#006400';
        box.style.backgroundColor = '#90EE90';
        box.style.padding = '5px 10px';
        box.style.borderRadius = '10px';
        box.style.cursor = 'pointer';
        container.parentElement.insertBefore(box, container);

        updateMinTime();
        document.addEventListener('input', updateMinTime);
    }

    function updateCompletedMissions() {
        const container = document.querySelector('#mission_list_alliance');
        if (!container) return;

        container.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const status = entry.querySelector('.missionStatus');
            if (status && status.textContent.includes('abgeschlossen')) {
                entry.style.display = 'none';
            }
            if (entry.classList.contains('mission_deleted')) {
                entry.style.display = 'none';
            }
        });
    }

    setInterval(addTextFields, 1000);
    setInterval(addMinTimeDisplay, 1000);
    setInterval(updateCompletedMissions, 5000);
})();