// ==UserScript==
// @name         KatieQoL
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Various QOL enhancements for FlatMMO with XP tracking and session stats
// @author       Straightmale
// @match        *://flatmmo.com/play.php
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543993/KatieQoL.user.js
// @updateURL https://update.greasyfork.org/scripts/543993/KatieQoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'katieqol_settings';

    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!settings.pickupNotifier) settings.pickupNotifier = { enabled: true };
    if (!settings.xpTracker) settings.xpTracker = { enabled: true, visibleSkills: {} };
    if (!settings.visuals) settings.visuals = {
        backgroundColor: 'rgba(0,0,0,0.85)',
        textColor: 'white',
        transparency: 85 // Default transparency (85%)
    };
    if (!settings.uiLock) settings.uiLock = { locked: false };

    const skills = [
        'melee', 'archery', 'stealing', 'health', 'magic', 'worship', 'mining',
        'forging', 'crafting', 'enchantment', 'fishing', 'woodcutting',
        'firemake', 'cooking', 'brewing', 'farming', 'hunting'
    ];

    skills.forEach(s => {
        if (!(s in settings.xpTracker.visibleSkills)) settings.xpTracker.visibleSkills[s] = true;
    });

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    // --- Session stats tracking ---
    let sessionItemsCollected = {};
    let sessionXpCollected = {};
    let sessionStartTime = Date.now();
    let sessionStatsUpdateInterval;
    skills.forEach(skill => sessionXpCollected[skill] = 0);

    function formatPlaytime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function calculateRates(count, playtimeMs) {
        const playtimeHours = playtimeMs / 3600000;
        const playtimeMinutes = playtimeMs / 60000;

        const perMin = playtimeMinutes > 0 ? count / playtimeMinutes : 0;
        const perHour = playtimeHours > 0 ? count / playtimeHours : 0;

        return {
            perMin: Math.round(perMin * 10) / 10,
            perHour: Math.round(perHour * 10) / 10
        };
    }

    function applyTransparency(color) {
        if (color.startsWith('rgba(')) {
            return color.replace(/[\d\.]+\)$/, (settings.visuals.transparency / 100) + ')');
        }
        if (color.startsWith('rgb(')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${settings.visuals.transparency / 100})`);
        }
        return color;
    }

    let lastInventory = {};
    const notifierContainer = document.createElement('div');
    notifierContainer.style.position = 'fixed';
    notifierContainer.style.bottom = '60px';
    notifierContainer.style.right = '20px';
    notifierContainer.style.zIndex = '99999';
    notifierContainer.style.fontFamily = 'Arial,sans-serif';
    notifierContainer.style.fontSize = '13px';
    notifierContainer.style.color = settings.visuals.textColor;
    notifierContainer.style.maxWidth = '300px';
    notifierContainer.style.pointerEvents = settings.uiLock.locked ? 'none' : 'auto';
    notifierContainer.style.background = applyTransparency(settings.visuals.backgroundColor);
    notifierContainer.style.padding = '8px';
    notifierContainer.style.borderRadius = '8px';
    notifierContainer.style.boxShadow = '0 0 15px rgba(0,0,0,0.7)';
    document.body.appendChild(notifierContainer);

    function applyVisuals() {
        const bgColor = applyTransparency(settings.visuals.backgroundColor);

        notifierContainer.style.background = bgColor;
        notifierContainer.style.color = settings.visuals.textColor;
        xpPanel.style.background = bgColor;
        xpPanel.style.color = settings.visuals.textColor;
        settingsPanel.style.background = bgColor;
        settingsPanel.style.color = settings.visuals.textColor;
        toggleSettingsBtn.style.background = bgColor;
        toggleSettingsBtn.style.color = settings.visuals.textColor;
        toggleSettingsBtn.style.border = `1px solid ${settings.visuals.textColor}`;
        sessionStatsPanel.style.background = bgColor;
        sessionStatsPanel.style.color = settings.visuals.textColor;
        viewSessionStatsBtn.style.background = bgColor;
        viewSessionStatsBtn.style.color = settings.visuals.textColor;
        viewSessionStatsBtn.style.border = `1px solid ${settings.visuals.textColor}`;
    }

    function showPickupMessage(text) {
        if (!settings.pickupNotifier.enabled) return;
        const el = document.createElement('div');
        el.textContent = text;
        el.style.background = 'rgba(0,0,0,0.6)';
        el.style.padding = '6px 10px';
        el.style.marginTop = '4px';
        el.style.borderRadius = '6px';
        el.style.boxShadow = '0 0 6px black';
        el.style.opacity = '1';
        el.style.transition = 'opacity 1s ease';
        notifierContainer.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => notifierContainer.removeChild(el), 1000);
        }, 3000);
    }

    // Smoothed XP tracking data
    const xpData = {};
    const now = () => Date.now();
    skills.forEach(skill => {
        xpData[skill] = { lastXP: 0, history: [] };
    });

const xpTable = [
0,0,108,177,265,380,527,717,956,1254,1622,2068,2605,3245,4000,4885,5913,7100,8464,10022,11794,13799,16060,18599,21442,24614,28145,32063,36400,41191,46470,52277,58652,65637,73279,81625,90728,100642,111424,123135,135841,149611,164516,180634,198047,216840,237105,258938,282440,307721,334893,364077,395399,428994,465003,503577,544871,589054,636300,686794,740732,798320,859775,925326,995213,1069691,1149027,1233503,1323417,1419081,1520824,1628993,1743952,1866086,1995798,2133515,2279683,2434772,2599278,2773721,2958649,3154637,3362289,3582243,3815166,4061762,4322767,4598959,4891153,5200203,5527011,5872521,6237725,6623665,7031436,7462185,7917120,8397507,8904674,9440017,10004999
];


    function xpToLevel(xp) {
        for(let lvl = 1; lvl < xpTable.length; lvl++) {
            if(xp < xpTable[lvl]) return lvl;
        }
        return xpTable.length;
    }

    function formatTime(seconds) {
        if (seconds === Infinity) return '∞';
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds/60)}m ${Math.round(seconds%60)}s`;
        return `${Math.floor(seconds/3600)}h ${Math.floor((seconds%3600)/60)}m`;
    }

    const xpPanel = document.createElement('div');
    xpPanel.style.position = 'fixed';
    xpPanel.style.top = '60px';
    xpPanel.style.right = '20px';
    xpPanel.style.width = '380px';
    xpPanel.style.maxHeight = '400px';
    xpPanel.style.overflowY = 'auto';
    xpPanel.style.background = applyTransparency(settings.visuals.backgroundColor);
    xpPanel.style.color = settings.visuals.textColor;
    xpPanel.style.padding = '10px';
    xpPanel.style.fontFamily = 'Arial,sans-serif';
    xpPanel.style.fontSize = '13px';
    xpPanel.style.borderRadius = '8px';
    xpPanel.style.zIndex = '99999';
    xpPanel.style.userSelect = 'none';
    xpPanel.style.boxShadow = '0 0 15px rgba(0,0,0,0.7)';
    xpPanel.style.pointerEvents = settings.uiLock.locked ? 'none' : 'auto';
    document.body.appendChild(xpPanel);

    function formatNumber(num) {
        return num.toLocaleString(undefined, {maximumFractionDigits: 2});
    }

    function updateXPDisplay() {
        if (!settings.xpTracker.enabled) {
            xpPanel.style.display = 'none';
            return;
        }
        xpPanel.style.display = 'block';

        let html = '<table style="width:100%; border-collapse: collapse;">';
        html += `<thead><tr><th style="text-align:left; padding:2px 6px;">Skill</th><th style="text-align:right; padding:2px 6px;">XP/min</th><th style="text-align:right; padding:2px 6px;">XP/hour</th><th style="text-align:right; padding:2px 6px;">Time to Next Level</th></tr></thead><tbody>`;

        const nowTime = now();

        skills.forEach(skill => {
            if (!settings.xpTracker.visibleSkills[skill]) return;
            const data = xpData[skill];
            if (!data.history || data.history.length < 2) return;

            const firstSample = data.history[0];
            const lastSample = data.history[data.history.length - 1];

            const elapsedMs = lastSample.time - firstSample.time;
            const xpGained = lastSample.xp - firstSample.xp;

            if (elapsedMs <= 0 || xpGained <= 0) {
                html += `<tr>
                    <td style="padding:2px 6px;">${skill.charAt(0).toUpperCase() + skill.slice(1)}</td>
                    <td style="text-align:right; padding:2px 6px;">0</td>
                    <td style="text-align:right; padding:2px 6px;">0</td>
                    <td style="text-align:right; padding:2px 6px;">∞</td>
                </tr>`;
                return;
            }

            const xpPerMs = xpGained / elapsedMs;
            const xpPerMin = xpPerMs * 60 * 1000;
            const xpPerHour = xpPerMin * 60;

            const currentLevel = xpToLevel(lastSample.xp);
            const nextLevelXP = xpTable[currentLevel] ?? xpTable[xpTable.length - 1];
            const xpNeeded = nextLevelXP - lastSample.xp;

            let timeRemaining = Infinity;
            if (xpPerMs > 0) timeRemaining = xpNeeded / xpPerMs / 1000;

            html += `<tr>
                <td style="padding:2px 6px;">${skill.charAt(0).toUpperCase() + skill.slice(1)}</td>
                <td style="text-align:right; padding:2px 6px;">${formatNumber(xpPerMin)}</td>
                <td style="text-align:right; padding:2px 6px;">${formatNumber(xpPerHour)}</td>
                <td style="text-align:right; padding:2px 6px;">${timeRemaining === Infinity ? '∞' : formatTime(timeRemaining)}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        xpPanel.innerHTML = `<h3 style="margin-top:0;margin-bottom:8px;">Skill XP Rate Tracker</h3>${html}`;
    }

    // Settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.style.position = 'fixed';
    settingsPanel.style.top = '50%';
    settingsPanel.style.left = '50%';
    settingsPanel.style.transform = 'translate(-50%, -50%)';
    settingsPanel.style.width = '420px';
    settingsPanel.style.maxHeight = '480px';
    settingsPanel.style.overflowY = 'auto';
    settingsPanel.style.background = applyTransparency(settings.visuals.backgroundColor);
    settingsPanel.style.color = settings.visuals.textColor;
    settingsPanel.style.padding = '15px 20px';
    settingsPanel.style.fontFamily = 'Arial,sans-serif';
    settingsPanel.style.fontSize = '14px';
    settingsPanel.style.borderRadius = '12px';
    settingsPanel.style.zIndex = '100000';
    settingsPanel.style.boxShadow = '0 0 25px rgba(0,0,0,0.8)';
    settingsPanel.style.display = 'none';
    settingsPanel.style.pointerEvents = 'auto';
    document.body.appendChild(settingsPanel);

    // Button to toggle settings panel
    const toggleSettingsBtn = document.createElement('button');
    toggleSettingsBtn.textContent = '⚙';
    toggleSettingsBtn.style.position = 'fixed';
    toggleSettingsBtn.style.bottom = '20px';
    toggleSettingsBtn.style.left = '50%';
    toggleSettingsBtn.style.transform = 'translateX(-50%)';
    toggleSettingsBtn.style.zIndex = '100001';
    toggleSettingsBtn.style.padding = '8px 16px';
    toggleSettingsBtn.style.fontFamily = 'Arial,sans-serif';
    toggleSettingsBtn.style.cursor = 'pointer';
    toggleSettingsBtn.style.borderRadius = '8px';
    toggleSettingsBtn.style.border = `1px solid ${settings.visuals.textColor}`;
    toggleSettingsBtn.style.background = applyTransparency(settings.visuals.backgroundColor);
    toggleSettingsBtn.style.color = settings.visuals.textColor;
    toggleSettingsBtn.style.pointerEvents = 'auto';
    document.body.appendChild(toggleSettingsBtn);

    toggleSettingsBtn.addEventListener('click', () => {
        if (settingsPanel.style.display === 'none') {
            renderSettingsUI();
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    });

    // Session stats panel
    const sessionStatsPanel = document.createElement('div');
    sessionStatsPanel.style.position = 'fixed';
    sessionStatsPanel.style.top = '60px';
    sessionStatsPanel.style.left = '20px';
    sessionStatsPanel.style.width = '350px';
    sessionStatsPanel.style.maxHeight = '400px';
    sessionStatsPanel.style.overflowY = 'auto';
    sessionStatsPanel.style.background = applyTransparency(settings.visuals.backgroundColor);
    sessionStatsPanel.style.color = settings.visuals.textColor;
    sessionStatsPanel.style.padding = '10px';
    sessionStatsPanel.style.fontFamily = 'Arial,sans-serif';
    sessionStatsPanel.style.fontSize = '13px';
    sessionStatsPanel.style.borderRadius = '8px';
    sessionStatsPanel.style.zIndex = '99999';
    sessionStatsPanel.style.userSelect = 'none';
    sessionStatsPanel.style.boxShadow = '0 0 15px rgba(0,0,0,0.7)';
    sessionStatsPanel.style.display = 'none';
    sessionStatsPanel.style.pointerEvents = settings.uiLock.locked ? 'none' : 'auto';
    document.body.appendChild(sessionStatsPanel);

    // Button to toggle session stats panel
    const viewSessionStatsBtn = document.createElement('button');
    viewSessionStatsBtn.textContent = '📊 Session Stats';
    viewSessionStatsBtn.title = 'View total items & XP collected this session';
    viewSessionStatsBtn.style.position = 'fixed';
    viewSessionStatsBtn.style.bottom = '20px';
    viewSessionStatsBtn.style.left = '20px';
    viewSessionStatsBtn.style.zIndex = '100001';
    viewSessionStatsBtn.style.padding = '8px 16px';
    viewSessionStatsBtn.style.fontFamily = 'Arial,sans-serif';
    viewSessionStatsBtn.style.cursor = 'pointer';
    viewSessionStatsBtn.style.borderRadius = '8px';
    viewSessionStatsBtn.style.border = `1px solid ${settings.visuals.textColor}`;
    viewSessionStatsBtn.style.background = applyTransparency(settings.visuals.backgroundColor);
    viewSessionStatsBtn.style.color = settings.visuals.textColor;
    viewSessionStatsBtn.style.pointerEvents = 'auto';
    document.body.appendChild(viewSessionStatsBtn);

    function renderSessionStats() {
        const playtimeMs = Date.now() - sessionStartTime;
        const playtimeFormatted = formatPlaytime(playtimeMs);

        let html = `<h3 style="margin-top:0; margin-bottom:8px;">Session Stats</h3>`;
        html += `<p style="margin-bottom:10px;"><strong>Playtime:</strong> ${playtimeFormatted}</p>`;

        html += '<h4>Items Collected</h4>';
        if (Object.keys(sessionItemsCollected).length === 0) {
            html += '<p>No items collected yet.</p>';
        } else {
            html += '<ul style="max-height:150px; overflow-y:auto; padding-left:18px;">';
            for (const [item, count] of Object.entries(sessionItemsCollected)) {
                const rates = calculateRates(count, playtimeMs);
                html += `<li>${item.replace(/_/g, ' ')}: ${count.toLocaleString()} <span style="color:#aaa;">(${rates.perMin}/m, ${rates.perHour}/h)</span></li>`;
            }
            html += '</ul>';
        }

        html += '<h4>XP Gained</h4>';
        html += '<ul style="max-height:150px; overflow-y:auto; padding-left:18px;">';
        skills.forEach(skill => {
            const xp = sessionXpCollected[skill];
            if (xp > 0) {
                const rates = calculateRates(xp, playtimeMs);
                html += `<li>${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${xp.toLocaleString()} <span style="color:#aaa;">(${rates.perMin}/m, ${rates.perHour}/h)</span></li>`;
            }
        });
        html += '</ul>';

        sessionStatsPanel.innerHTML = html;
    }

    function resetSessionStats() {
        sessionItemsCollected = {};
        sessionXpCollected = {};
        sessionStartTime = Date.now();
        skills.forEach(skill => sessionXpCollected[skill] = 0);
        if (sessionStatsPanel.style.display !== 'none') {
            renderSessionStats();
        }
    }

    function resetCalculator() {
        skills.forEach(skill => {
            xpData[skill] = { lastXP: 0, history: [] };
        });
        updateXPDisplay();
    }

    function updateUILockState() {
        const elements = [notifierContainer, xpPanel, sessionStatsPanel];
        elements.forEach(el => {
            el.style.pointerEvents = settings.uiLock.locked ? 'none' : 'auto';
        });

        if (settings.uiLock.locked) {
            makeUndraggable(notifierContainer);
            makeUndraggable(xpPanel);
            makeUndraggable(sessionStatsPanel);
        } else {
            makeDraggable(notifierContainer);
            makeDraggable(xpPanel);
            makeDraggable(sessionStatsPanel);
        }
    }

    function makeDraggable(el, handleSelector = null) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const handle = handleSelector ? el.querySelector(handleSelector) : el;
        if (!handle) return;

        handle.style.cursor = 'move';
        const dragMouseDown = (e) => {
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        };

        handle.addEventListener('mousedown', dragMouseDown);

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            el.style.left = (e.clientX - offsetX) + 'px';
            el.style.top = (e.clientY - offsetY) + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            el.style.position = 'fixed';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    function makeUndraggable(el) {
        const handle = el.querySelector('[style*="cursor: move"]');
        if (handle) {
            handle.style.cursor = 'default';
            const newHandle = handle.cloneNode(true);
            handle.parentNode.replaceChild(newHandle, handle);
        }
    }

    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        const match = rgb.match(/\d+/g);
        if (!match) return '#000000';
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function renderSettingsUI() {
        settingsPanel.innerHTML = `
            <h3 style="margin-top:0;margin-bottom:8px;">UI Behavior</h3>
            <label style="display:block; margin-bottom:12px; cursor:pointer;">
                <input type="checkbox" id="uiLock" ${settings.uiLock.locked ? 'checked' : ''}>
                Lock UI (make panels click-through)
            </label>

            <hr style="border:1px solid rgba(255,255,255,0.2); margin:12px 0;">

            <h3 style="margin-top:0;margin-bottom:8px;">Item Pickup Notifier</h3>
            <label style="display:block; margin-bottom:6px; cursor:pointer;">
                <input type="checkbox" id="pickupEnabled" ${settings.pickupNotifier.enabled ? 'checked' : ''}>
                Enabled
            </label>

            <hr style="border:1px solid rgba(255,255,255,0.2); margin:12px 0;">

            <h3 style="margin-top:0;margin-bottom:8px;">XP Tracker</h3>
            <label style="display:block; margin-bottom:6px; cursor:pointer;">
                <input type="checkbox" id="xpEnabled" ${settings.xpTracker.enabled ? 'checked' : ''}>
                Enabled
            </label>
            <p style="margin:8px 0 4px 0;">Visible Skills:</p>
            <div id="skillsToggles" style="max-height:160px; overflow-y:auto; border:1px solid rgba(255,255,255,0.2); padding:4px; border-radius:4px;">
            </div>

            <hr style="border:1px solid rgba(255,255,255,0.2); margin:12px 0;">

            <h3 style="margin-top:0;margin-bottom:8px;">Visual Customization</h3>
            <label style="display:block; margin-bottom:6px;">
                Background Color:
                <input type="color" id="backgroundColorPicker" value="${rgbToHex(settings.visuals.backgroundColor)}" style="margin-left:10px;">
            </label>
            <label style="display:block; margin-bottom:6px;">
                Text Color:
                <input type="color" id="textColorPicker" value="${rgbToHex(settings.visuals.textColor)}" style="margin-left:10px;">
            </label>
            <label style="display:block; margin-bottom:6px;">
                Transparency: <span id="transparencyValue">${settings.visuals.transparency}</span>%
                <input type="range" id="transparencySlider" min="10" max="100" value="${settings.visuals.transparency}" style="width:100%; margin-top:4px;">
            </label>

            <hr style="border:1px solid rgba(255,255,255,0.2); margin:12px 0;">

            <h3 style="margin-top:0;margin-bottom:8px;">Reset Options</h3>
            <button id="resetSessionBtn" style="margin-right:10px; padding:6px 12px; background:#d9534f; color:white; border:none; border-radius:4px; cursor:pointer;">Reset Session Stats</button>
            <button id="resetCalculatorBtn" style="padding:6px 12px; background:#f0ad4e; color:white; border:none; border-radius:4px; cursor:pointer;">Reset XP Calculator</button>
        `;

        const skillsContainer = document.getElementById('skillsToggles');
        skillsContainer.innerHTML = '';

        skills.forEach(skill => {
            const checked = settings.xpTracker.visibleSkills[skill];
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.cursor = 'pointer';
            label.style.userSelect = 'none';
            label.innerHTML = `<input type="checkbox" data-skill="${skill}" ${checked ? 'checked' : ''} style="margin-right:6px;">${skill.charAt(0).toUpperCase() + skill.slice(1)}`;
            skillsContainer.appendChild(label);
        });

        document.getElementById('uiLock').onchange = e => {
            settings.uiLock.locked = e.target.checked;
            saveSettings();
            updateUILockState();
        };

        document.getElementById('pickupEnabled').onchange = e => {
            settings.pickupNotifier.enabled = e.target.checked;
            saveSettings();
        };

        document.getElementById('xpEnabled').onchange = e => {
            settings.xpTracker.enabled = e.target.checked;
            saveSettings();
            updateXPDisplay();
        };

        skillsContainer.querySelectorAll('input[type=checkbox]').forEach(cb => {
            cb.onchange = e => {
                const skill = e.target.dataset.skill;
                settings.xpTracker.visibleSkills[skill] = e.target.checked;
                saveSettings();
                updateXPDisplay();
            };
        });

        document.getElementById('backgroundColorPicker').oninput = e => {
            settings.visuals.backgroundColor = hexToRgba(e.target.value, settings.visuals.transparency / 100);
            saveSettings();
            applyVisuals();
        };

        document.getElementById('textColorPicker').oninput = e => {
            settings.visuals.textColor = e.target.value;
            saveSettings();
            applyVisuals();
        };

        const transparencySlider = document.getElementById('transparencySlider');
        transparencySlider.addEventListener('input', e => {
            const value = e.target.value;
            document.getElementById('transparencyValue').textContent = value;
            settings.visuals.transparency = parseInt(value);
            settings.visuals.backgroundColor = hexToRgba(
                rgbToHex(settings.visuals.backgroundColor),
                settings.visuals.transparency / 100
            );
            saveSettings();
            applyVisuals();
        });

        document.getElementById('resetSessionBtn').addEventListener('click', resetSessionStats);
        document.getElementById('resetCalculatorBtn').addEventListener('click', resetCalculator);
    }

// WebSocket hook to track inventory changes and XP updates
const OriginalWebSocket = window.WebSocket;
window.WebSocket = function(...args) {
    const ws = new OriginalWebSocket(...args);
    ws.addEventListener('message', (event) => {
        const data = event.data;
        if (typeof data !== 'string') return;

        // Inventory items update
        if (data.startsWith('SET_INVENTORY_ITEMS=')) {
            if (!settings.pickupNotifier.enabled) return;

            const msg = data.substring('SET_INVENTORY_ITEMS='.length);
            const parts = msg.split('~');

            const inventory = {};

            // Correct parsing - items come in pairs: itemId, count
            for (let i = 0; i < parts.length; i += 2) {
                const itemId = parts[i];
                // Ensure we don't go out of bounds
                if (i + 1 >= parts.length) break;

                const count = parseInt(parts[i+1], 10) || 0;
                if (itemId && !isNaN(count)) {
                    inventory[itemId] = (inventory[itemId] || 0) + count;
                }
            }

            for (const [itemId, count] of Object.entries(inventory)) {
                const oldCount = lastInventory[itemId] || 0;
                if (count > oldCount) {
                    const gained = count - oldCount;
                    showPickupMessage(`+${gained} ${itemId.replace(/_/g, ' ')}`);

                    // Track session items collected
                    sessionItemsCollected[itemId] = (sessionItemsCollected[itemId] || 0) + gained;
                }
            }

            lastInventory = inventory;

            // Update session stats if panel is open
            if (sessionStatsPanel.style.display !== 'none') {
                renderSessionStats();
            }
        }

        // XP updates (keep this part unchanged)
        if (data.startsWith('REFRESH_VAR=')) {
            if (!settings.xpTracker.enabled) return;

            const msg = data.substring('REFRESH_VAR='.length);
            const parts = msg.split('~');
            if (parts.length >= 3) {
                let skillXpKey = parts[1];
                const xpValue = Number(parts[2]);
                if (skills.includes(skillXpKey.replace('_xp',''))) {
                    const skill = skillXpKey.replace('_xp','');
                    const data = xpData[skill];

                    // Add sample to history, keep last 10 samples for smoothing (~50s if update every 5s)
                    const nowTime = now();
                    data.history.push({ xp: xpValue, time: nowTime });
                    if (data.history.length > 10) data.history.shift();

                    // Calculate gained XP this update for session total
                    const lastSample = data.history.length > 1 ? data.history[data.history.length - 2] : null;
                    if (lastSample && xpValue > lastSample.xp) {
                        sessionXpCollected[skill] += xpValue - lastSample.xp;
                    }

                    data.lastXP = xpValue;

                    // Update session stats if panel is open
                    if (sessionStatsPanel.style.display !== 'none') {
                        renderSessionStats();
                    }
                }
            }
        }
    });
    return ws;
};
    viewSessionStatsBtn.addEventListener('click', () => {
        if (sessionStatsPanel.style.display === 'none') {
            renderSessionStats();
            sessionStatsPanel.style.display = 'block';
            // Update stats every second while panel is open
            sessionStatsUpdateInterval = setInterval(renderSessionStats, 1000);
        } else {
            sessionStatsPanel.style.display = 'none';
            clearInterval(sessionStatsUpdateInterval);
        }
    });

    setInterval(updateXPDisplay, 5000);
    makeDraggable(xpPanel);
    makeDraggable(notifierContainer);
    makeDraggable(sessionStatsPanel);
    makeDraggable(toggleSettingsBtn);


    applyVisuals();
    renderSettingsUI();
    updateUILockState();    
})();