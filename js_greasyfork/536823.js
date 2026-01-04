// ==UserScript==
// @name         MZ - Coach Monitor
// @namespace    douglaskampl
// @version      3.69
// @description  Monitors the coach market
// @author       Douglas & (´｡• ᵕ •｡`) ♡
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536823/MZ%20-%20Coach%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/536823/MZ%20-%20Coach%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        CHECK_INTERVAL_MINUTES: 5,
        API_URL: "https://www.managerzone.com/ajax.php?p=coaches&sub=hire-coaches&sport=soccer",
        COACH_DETAIL_URL_PREFIX: "https://www.managerzone.com/?p=trainers&sub=offer&extra=freeagent&cid=",
        STORAGE_KEYS: {
            CONFIG: "MZ_COACH_MONITOR_CONFIG_V1",
            LIVE: "MZ_COACH_MONITOR_LIVE_V1",
            HISTORY: "MZ_COACH_MONITOR_HISTORY_V1"
        }
    };

    const SKILLS = {
        '3': 'Speed', '4': 'Stamina', '5': 'Play Intelligence', '6': 'Passing',
        '7': 'Shooting', '8': 'Heading', '9': 'Keeping', '10': 'Ball Control',
        '11': 'Tackling', '12': 'Aerial Passing', '13': 'Set Plays'
    };

    const DEFAULT_CONFIG = {
        coachClass: "5",
        maxSalary: 29000,
        minSkills: {
            '3': 9, '4': 9, '5': 9, '6': 9, '7': 9, '8': 9,
            '9': 9, '10': 9, '11': 9, '12': 9, '13': 9
        }
    };

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap');
        :root {
            --bg-primary: #191825;
            --bg-secondary: #232233;
            --bg-tertiary: #35334D;
            --border-color: #494663;
            --text-primary: #F4F4F5;
            --text-secondary: #A1A1AA;
            --accent-primary: #C778DD;
            --accent-notification: #EF4444;
            --font-family: 'Lexend', sans-serif;
            --success-color: #22C55E;
        }
        .mzc-toast {
            position: fixed; bottom: 25px; right: 25px; background-color: var(--bg-secondary);
            color: var(--text-primary); padding: 16px 24px; border-radius: 8px;
            border-left: 5px solid var(--accent-primary); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10000; font-family: var(--font-family); font-size: 14px; opacity: 0;
            transform: translateX(110%); transition: opacity 0.4s ease, transform 0.4s ease; max-width: 400px;
        }
        .mzc-toast.show { opacity: 1; transform: translateX(0); }
        .mzc-icon-wrapper { display: inline-flex; align-items: center; gap: 10px; }
        .mzc-icon {
            font-size: 13px; color: var(--text-secondary); margin-left: 5px; cursor: pointer;
            position: relative; transition: color 0.3s ease, transform 0.3s ease;
        }
        .mzc-icon:hover { color: var(--accent-primary); transform: scale(1.1); }
        .mzc-icon.loading { animation: mzc-spin 1.2s linear infinite; }
        @keyframes mzc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .mzc-icon.new-coaches::after {
            content: ''; position: absolute; top: -2px; right: -3px; width: 9px; height: 9px;
            background-color: var(--accent-notification); border-radius: 50%; border: 2px solid var(--bg-primary);
            box-shadow: 0 0 8px var(--accent-notification);
        }
        .mzc-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(25, 24, 37, 0.85);
            backdrop-filter: blur(4px); display: none; justify-content: center; align-items: center;
            z-index: 9998; opacity: 0; transition: opacity 0.3s ease-in-out;
        }
        .mzc-modal-overlay.visible { display: flex; opacity: 1; }
        .mzc-modal-container, .mzc-settings-container {
            font-family: var(--font-family); background-color: var(--bg-secondary); color: var(--text-primary);
            padding: 28px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            border: 1px solid var(--border-color); transform: scale(0.95); transition: transform 0.3s ease-in-out;
        }
        .mzc-modal-container { max-width: 1100px; width: 95%; max-height: 90vh; overflow-y: auto; }
        .mzc-modal-overlay.visible .mzc-modal-container, .mzc-modal-overlay.visible .mzc-settings-container { transform: scale(1); }
        .mzc-modal-header {
            display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color);
            padding-bottom: 16px; margin-bottom: 24px; gap: 16px;
        }
        .mzc-modal-title-group { display: flex; align-items: center; gap: 16px; margin: 0; flex-wrap: wrap; }
        .mzc-modal-title { margin: 0; font-size: 1.6rem; font-weight: 500; }
        .mzc-view-selector button {
            background-color: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color);
            padding: 6px 14px; border-radius: 6px; cursor: pointer; font-family: var(--font-family);
            transition: background-color 0.2s, color 0.2s;
        }
        .mzc-view-selector button:hover { background-color: var(--border-color); color: var(--text-primary); }
        .mzc-view-selector button.active { background-color: var(--accent-primary); color: white; border-color: var(--accent-primary); }
        .mzc-header-actions { display: flex; align-items: center; }
        .mzc-modal-close {
            background: transparent; border: 0; color: var(--text-secondary); font-size: 1.5rem;
            cursor: pointer; transition: color 0.2s, transform 0.2s;
        }
        .mzc-modal-close:hover { color: var(--text-primary); transform: rotate(90deg); }
        .mzc-modal-content table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
        .mzc-modal-content th, .mzc-modal-content td { padding: 14px 12px; border-bottom: 1px solid var(--border-color); white-space: nowrap; }
        .mzc-modal-content td { color: var(--text-primary); }
        .mzc-modal-content th { font-weight: 500; color: var(--text-secondary); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
        .mzc-modal-content td a { color: var(--accent-primary); text-decoration: none; font-weight: 500; transition: color 0.2s ease; }
        .mzc-modal-content td a:hover { color: white; text-decoration: underline; }
        .mzc-modal-content .mzc-new-badge {
            background-color: var(--accent-notification); color: white; padding: 3px 7px; border-radius: 5px;
            font-size: 0.65em; margin-left: 10px; font-weight: 600; vertical-align: middle; text-transform: uppercase;
        }
        .mzc-strength {
            display: inline-block; font-size: 0.8rem; background-color: var(--bg-tertiary);
            border-radius: 4px; padding: 3px 8px; margin-right: 6px; margin-top: 4px;
        }
        .mzc-strength-value { font-weight: 600; color: var(--text-primary); margin-left: 4px; }
        .mzc-settings-overlay { z-index: 9999; }
        .mzc-settings-container { background-color: var(--bg-tertiary); max-width: 600px; width: 90%; }
        .mzc-settings-grid {
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;
        }
        .mzc-setting-item, .mzc-setting-item-full { display: flex; flex-direction: column; gap: 8px; }
        .mzc-setting-item-full { grid-column: 1 / -1; }
        .mzc-settings-grid label, .mzc-setting-item-full label { font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
        .mzc-settings-grid input, .mzc-settings-grid select, .mzc-setting-item-full input, .mzc-setting-item-full select {
            background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px;
            padding: 10px; color: var(--text-primary); font-family: var(--font-family); font-size: 0.9rem;
        }
        .mzc-settings-actions { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 10px; }
        .mzc-settings-actions button {
            color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 20px;
            border-radius: 6px; cursor: pointer; font-family: var(--font-family); font-weight: 500;
            transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }
        .mzc-settings-actions button.mzc-btn-secondary { background-color: transparent; }
        .mzc-settings-actions button.mzc-btn-secondary:hover { background-color: var(--border-color); }
        .mzc-settings-actions button.mzc-btn-primary { background-color: var(--accent-primary); border-color: var(--accent-primary); }
        .mzc-settings-actions button.mzc-btn-primary:hover { filter: brightness(1.1); }
        .mzc-settings-actions button.mzc-btn-success { background-color: var(--success-color); border-color: var(--success-color); }
    `;

    function createToast(message) {
        const toast = document.createElement('div');
        toast.className = 'mzc-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 6000);
    }

    async function initializeUI() {
        GM_addStyle(STYLES);
        const mainModalHTML = `
            <div id="mzc-modal-overlay" class="mzc-modal-overlay">
                <div class="mzc-modal-container" role="dialog" aria-modal="true" aria-labelledby="mzc-modal-title">
                    <header class="mzc-modal-header">
                        <div class="mzc-modal-title-group">
                           <h2 class="mzc-modal-title" id="mzc-modal-title">Market Intelligence</h2>
                           <div class="mzc-view-selector">
                               <button id="mzc-view-live" class="active">Active On Market</button>
                               <button id="mzc-view-history">Complete History</button>
                           </div>
                        </div>
                        <div class="mzc-header-actions">
                            <i id="mzc-settings-icon" title="Configure Filters" class="mzc-icon fas fa-cog"></i>
                            <button id="mzc-modal-close" class="mzc-modal-close" aria-label="Close modal">&#10006;</button>
                        </div>
                    </header>
                    <main id="mzc-modal-content" class="mzc-modal-content">
                        <p>Awaiting initial data sweep...</p>
                    </main>
                </div>
            </div>`;

        const settingsModalHTML = `
            <div id="mzc-settings-overlay" class="mzc-modal-overlay mzc-settings-overlay">
                <div class="mzc-settings-container" role="dialog" aria-modal="true" aria-labelledby="mzc-settings-title">
                    <header class="mzc-modal-header">
                        <h2 class="mzc-modal-title" id="mzc-settings-title">Monitor Configuration</h2>
                        <button id="mzc-settings-close" class="mzc-modal-close" aria-label="Close settings">&#10006;</button>
                    </header>
                    <main>
                        <div class="mzc-setting-item-full">
                            <label for="mzc-coachClass">Coach License</label>
                            <select id="mzc-coachClass" name="coachClass">
                                <option value="0">All</option><option value="6">Class A</option><option value="5">Class B</option>
                                <option value="4">Class C</option><option value="3">Class D</option><option value="2">Class E</option>
                                <option value="1">Class F</option>
                            </select>
                        </div>
                        <div class="mzc-setting-item-full">
                           <label for="mzc-maxSalaryText">Maximum Salary</label>
                           <input type="text" id="mzc-maxSalaryText" name="maxSalary">
                        </div>
                        <h3 class="mzc-modal-title" style="font-size: 1.2rem; margin: 20px 0 10px 0; grid-column: 1 / -1;">Minimum Skills (0 to ignore)</h3>
                        <div id="mzc-skills-grid" class="mzc-settings-grid"></div>
                        <div class="mzc-settings-actions">
                           <button id="mzc-settings-cancel" class="mzc-btn-secondary">Cancel</button>
                           <button id="mzc-settings-save" class="mzc-btn-primary">Save Changes</button>
                        </div>
                    </main>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', mainModalHTML);
        document.body.insertAdjacentHTML('beforeend', settingsModalHTML);

        const skillsGrid = document.getElementById('mzc-skills-grid');
        for (const [id, name] of Object.entries(SKILLS)) {
            const skillItemHTML = `
                <div class="mzc-setting-item">
                    <label for="mzc-skill-${id}">${name}</label>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" id="mzc-skill-${id}" data-skill-id="${id}" maxlength="2">
                </div>`;
            skillsGrid.insertAdjacentHTML('beforeend', skillItemHTML);
        }

        document.getElementById('mzc-modal-close').addEventListener('click', closeCoachModal);
        document.getElementById('mzc-modal-overlay').addEventListener('click', e => e.target.id === 'mzc-modal-overlay' && closeCoachModal());
        document.getElementById('mzc-settings-icon').addEventListener('click', openSettingsModal);
        document.getElementById('mzc-settings-close').addEventListener('click', closeSettingsModal);
        document.getElementById('mzc-settings-cancel').addEventListener('click', closeSettingsModal);
        document.getElementById('mzc-settings-overlay').addEventListener('click', e => e.target.id === 'mzc-settings-overlay' && closeSettingsModal());
        document.getElementById('mzc-settings-save').addEventListener('click', saveSettings);
        document.getElementById('mzc-view-live').addEventListener('click', () => renderCoachTable('live'));
        document.getElementById('mzc-view-history').addEventListener('click', () => renderCoachTable('history'));
    }

    async function renderCoachTable(viewType) {
        document.getElementById('mzc-view-live').classList.toggle('active', viewType === 'live');
        document.getElementById('mzc-view-history').classList.toggle('active', viewType === 'history');

        const key = viewType === 'live' ? CONFIG.STORAGE_KEYS.LIVE : CONFIG.STORAGE_KEYS.HISTORY;
        const storedData = await GM.getValue(key, []);
        const contentDiv = document.getElementById('mzc-modal-content');

        if (!Array.isArray(storedData) || storedData.length === 0) {
            contentDiv.innerHTML = `<p>No matching assets found for this view.</p>`;
            return;
        }

        const sortedData = [...storedData].sort((a, b) => (b.isNew - a.isNew) || (a.salaryLow - b.salaryLow));
        const tableRows = sortedData.map(coach => {
            const isNew = coach.isNew ? '<span class="mzc-new-badge">New</span>' : '';
            const coachLink = `<a href="${CONFIG.COACH_DETAIL_URL_PREFIX}${coach.ID}" target="_blank" rel="noopener noreferrer">${coach.Name}</a>`;
            const strengthsHTML = coach.strengths.map(s => `<span class="mzc-strength">${s.name}<span class="mzc-strength-value">${s.value}</span></span>`).join('');
            return `
                <tr>
                    <td>${coachLink}${isNew}</td>
                    <td style="white-space: normal;">${strengthsHTML}</td>
                    <td>${coach.salaryLow.toLocaleString()} - ${coach.salaryHigh.toLocaleString()}</td>
                    <td>${coach.bonus.toLocaleString()}</td>
                    <td>${coach.foundAt || 'N/A'}</td>
                </tr>`;
        }).join('');

        contentDiv.innerHTML = `
            <table>
                <thead>
                    <tr><th>Name</th><th>Key Strengths</th><th>Compensation</th><th>Signing Fee</th><th>Discovery Timestamp</th></tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>`;
    }

    async function openCoachModal() {
        const icon = document.getElementById('mzc-main-icon');
        if (icon) icon.classList.remove('new-coaches');
        await renderCoachTable('live');
        document.getElementById('mzc-modal-overlay').classList.add('visible');
        const liveData = await GM.getValue(CONFIG.STORAGE_KEYS.LIVE, []);
        const updatedLive = liveData.map(c => ({ ...c, isNew: false }));
        await GM.setValue(CONFIG.STORAGE_KEYS.LIVE, updatedLive);

        const historyData = await GM.getValue(CONFIG.STORAGE_KEYS.HISTORY, []);
        const updatedHistory = historyData.map(c => ({ ...c, isNew: false }));
        await GM.setValue(CONFIG.STORAGE_KEYS.HISTORY, updatedHistory);
    }

    function closeCoachModal() {
        document.getElementById('mzc-modal-overlay').classList.remove('visible');
    }

    async function openSettingsModal() {
        const settings = await GM.getValue(CONFIG.STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
        document.getElementById('mzc-coachClass').value = settings.coachClass;
        document.getElementById('mzc-maxSalaryText').value = settings.maxSalary.toLocaleString();
        for (const [id] of Object.entries(SKILLS)) {
            const input = document.getElementById(`mzc-skill-${id}`);
            if (input) {
                input.value = settings.minSkills[id] || 0;
            }
        }
        document.getElementById('mzc-settings-overlay').classList.add('visible');
    }

    function closeSettingsModal() {
        document.getElementById('mzc-settings-overlay').classList.remove('visible');
    }

    async function saveSettings() {
        const saveButton = document.getElementById('mzc-settings-save');
        const newConfig = { minSkills: {} };
        newConfig.coachClass = document.getElementById('mzc-coachClass').value;
        const salaryString = document.getElementById('mzc-maxSalaryText').value.replace(/\D/g, '');
        const maxSalary = parseInt(salaryString, 10);
        newConfig.maxSalary = !isNaN(maxSalary) && maxSalary >= 0 ? maxSalary : 0;

        document.querySelectorAll('#mzc-skills-grid input').forEach(input => {
            const skillId = input.dataset.skillId;
            let skillValue = parseInt(input.value, 10);
            if (isNaN(skillValue) || skillValue < 0) skillValue = 0;
            if (skillValue > 10) skillValue = 10;
            newConfig.minSkills[skillId] = skillValue;
        });

        await GM.setValue(CONFIG.STORAGE_KEYS.CONFIG, newConfig);
        saveButton.textContent = 'Saved!';
        saveButton.classList.add('mzc-btn-success');

        setTimeout(async () => {
            saveButton.textContent = 'Save Changes';
            saveButton.classList.remove('mzc-btn-success');
            closeSettingsModal();
            await runCheck();
            if (document.getElementById('mzc-modal-overlay').classList.contains('visible')) {
                const activeView = document.getElementById('mzc-view-live').classList.contains('active') ? 'live' : 'history';
                await renderCoachTable(activeView);
            }
        }, 1000);
    }

    function parseCoachList(htmlText) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;
        const coachRows = tempDiv.querySelectorAll('#coaches_list > tbody > tr:not(.minified-view)');
        return Array.from(coachRows).map(row => {
            const partialCoach = {};
            const nameLink = row.cells[0]?.querySelector('a');
            if (!nameLink) return null;
            partialCoach.Name = nameLink.textContent.trim();
            const coachIdMatch = nameLink.href.match(/cid=(\d+)/);
            partialCoach.ID = coachIdMatch ? coachIdMatch[1] : null;
            if (!partialCoach.ID) return null;

            const coachSkills = Object.entries(SKILLS).map(([id, name]) => {
                const cellIndex = parseInt(id, 10);
                const skillCell = row.cells[cellIndex];
                const value = skillCell ? parseInt(skillCell.textContent.trim(), 10) || 0 : 0;
                return { name, value, id };
            });

            partialCoach.skills = coachSkills;
            partialCoach.strengths = [...coachSkills].sort((a, b) => b.value - a.value).slice(0, 2);
            return partialCoach;
        }).filter(Boolean);
    }

    async function fetchCoachDetails(coach) {
        try {
            const response = await fetch(CONFIG.COACH_DETAIL_URL_PREFIX + coach.ID);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const htmlText = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlText;
            const salaryText = tempDiv.querySelector('#salary_range nobr')?.textContent || '';
            const salaryMatches = salaryText.match(/(\d[\d\s]*)\s*-\s*(\d[\d\s]*)/);
            coach.salaryLow = salaryMatches ? parseInt(salaryMatches[1].replace(/\s/g, ''), 10) : 0;
            coach.salaryHigh = salaryMatches ? parseInt(salaryMatches[2].replace(/\s/g, ''), 10) : 0;
            const bonusEl = tempDiv.querySelector('img[src="img/active.gif"]')?.parentElement.nextElementSibling;
            const bonusText = bonusEl?.textContent || '';
            const bonusMatch = bonusText.match(/\((.*?)\)/);
            coach.bonus = bonusMatch ? parseInt(bonusMatch[1].replace(/\D/g, ''), 10) : 0;
            return coach;
        } catch (error) {
            return { ...coach, salaryLow: 0, salaryHigh: 0, bonus: 0, error: true };
        }
    }

    function buildApiPayload(settings) {
        const apiNameMap = {
            playintelligence: 'gameintelligence', ballcontrol: 'technique',
            aerialpassing: 'highpassing', setplays: 'situations', keeping: 'goalkeeping'
        };
        let payload = `fresh-p=&of=&od=&o=0&coachClass=${settings.coachClass}&country=0`;
        const skillFilters = [];
        for (const [id, value] of Object.entries(settings.minSkills)) {
            if (value > 0) {
                const skillName = SKILLS[id].toLowerCase().replace(/ /g, '');
                const apiSkillName = apiNameMap[skillName] || skillName;
                skillFilters.push(`attr${apiSkillName}_from=${value}&attr${apiSkillName}_to=10`);
            }
        }
        if (skillFilters.length > 0) {
            payload += `&${skillFilters.join('&')}&skills_conjunction=or`;
        }
        payload += `&salary_to=${settings.maxSalary}`;
        return payload;
    }

    async function runCheck() {
        const icon = document.getElementById('mzc-main-icon');
        if (!icon || icon.classList.contains('loading')) return;
        icon.classList.add('loading', 'fa-spinner');
        icon.classList.remove('fa-binoculars');

        try {
            const settings = await GM.getValue(CONFIG.STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
            const apiPayload = buildApiPayload(settings);
            const initialResponse = await fetch(CONFIG.API_URL, {
                method: "POST", body: apiPayload,
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
            });

            if (!initialResponse.ok) throw new Error(`API fetch failed with status ${initialResponse.status}`);
            const html = await initialResponse.text();
            const partialCoaches = parseCoachList(html);
            const detailPromises = partialCoaches.map(c => fetchCoachDetails(c));
            let freshCoaches = (await Promise.all(detailPromises)).filter(c => !c.error && c.salaryLow > 0);

            const storedHistory = await GM.getValue(CONFIG.STORAGE_KEYS.HISTORY, []);
            const historyMap = new Map(storedHistory.map(c => [c.ID, c]));
            let newCoachCount = 0;
            const notableSkills = new Set();

            freshCoaches.forEach(freshCoach => {
                const existingHistoryEntry = historyMap.get(freshCoach.ID);
                if (!existingHistoryEntry) {
                    newCoachCount++;
                    const timestamp = new Date().toLocaleString();
                    freshCoach.isNew = true;
                    freshCoach.foundAt = timestamp;

                    freshCoach.skills.forEach(skill => {
                        const minSkill = settings.minSkills[skill.id] || 0;
                        if (minSkill > 0 && skill.value >= minSkill) {
                             notableSkills.add(skill.name);
                        }
                    });
                    historyMap.set(freshCoach.ID, { ...freshCoach });
                } else {
                    freshCoach.isNew = false;
                    freshCoach.foundAt = existingHistoryEntry.foundAt;
                    historyMap.set(freshCoach.ID, { ...existingHistoryEntry, ...freshCoach, isNew: false });
                }
            });

            await GM.setValue(CONFIG.STORAGE_KEYS.LIVE, freshCoaches);

            if (newCoachCount > 0) {
                const updatedHistory = Array.from(historyMap.values());
                await GM.setValue(CONFIG.STORAGE_KEYS.HISTORY, updatedHistory);
                let toastMessage = `${newCoachCount} new asset(s) identified.`;
                if (notableSkills.size > 0) {
                    toastMessage += ` Notable skills: ${Array.from(notableSkills).join(', ')}.`;
                }
                createToast(toastMessage);
                icon.classList.add('new-coaches');
            }
        } catch (error) {
            createToast('Monitor encountered an error during its sweep.');
        } finally {
            icon.classList.remove('loading', 'fa-spinner');
            icon.classList.add('fa-binoculars');
        }
    }

    function initialize() {
        initializeUI();
        const ptWrapper = document.getElementById('pt-wrapper');
        if (ptWrapper) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'mzc-icon-wrapper';
            const icon = document.createElement('i');
            icon.className = 'mzc-icon fas fa-binoculars';
            icon.id = 'mzc-main-icon';
            icon.title = 'Show Monitored Coaches';
            icon.addEventListener('click', openCoachModal);
            iconWrapper.appendChild(icon);
            ptWrapper.appendChild(iconWrapper);
            setTimeout(runCheck, 2000);
            setInterval(runCheck, CONFIG.CHECK_INTERVAL_MINUTES * 60 * 1000);
        }
    }

    initialize();
})();