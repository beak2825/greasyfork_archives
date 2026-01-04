// ==UserScript==
// @name         Cybroria Loot Tracker with Timer and Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tracks loot, timer, income, and Cyber Components delta separately.
// @author       Skydragon + Edit
// @match        https://cybroria.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535696/Cybroria%20Loot%20Tracker%20with%20Timer%20and%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/535696/Cybroria%20Loot%20Tracker%20with%20Timer%20and%20Value%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'cybroria_loot_stats';
    const VALUE_KEY = 'cybroria_loot_values';
    const POS_KEY = 'cybroria_tracker_position';
    const RESET_TIME_KEY = 'cybroria_reset_time';
    const CYBER_BASE_KEY = 'cybroria_cyber_components_base';
    const CYBER_GAIN_KEY = 'cybroria_cyber_components_gain';

    let timestamps = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let lootValues = JSON.parse(localStorage.getItem(VALUE_KEY) || '{}');
    let viewMode = 'hour'; // 'hour', 'day', 'session'

    if (!localStorage.getItem(RESET_TIME_KEY)) {
        localStorage.setItem(RESET_TIME_KEY, Date.now());
    }

    if (!localStorage.getItem(CYBER_GAIN_KEY)) {
        localStorage.setItem(CYBER_GAIN_KEY, '0');
    }

    const trackerBox = document.createElement('div');
    trackerBox.style.position = 'fixed';
    trackerBox.style.top = localStorage.getItem(POS_KEY + '_top') || '10px';
    trackerBox.style.left = localStorage.getItem(POS_KEY + '_left') || '10px';
    trackerBox.style.background = '#1a214c';
    trackerBox.style.color = 'white';
    trackerBox.style.padding = '10px';
    trackerBox.style.fontSize = '13px';
    trackerBox.style.fontFamily = 'monospace';
    trackerBox.style.zIndex = 9999;
    trackerBox.style.cursor = 'move';
    trackerBox.style.minWidth = '220px';
    trackerBox.style.border = '1px solid #0f0';
    document.body.appendChild(trackerBox);

    const timer = document.createElement('div');
    timer.id = 'cybroria-timer';
    timer.style.marginTop = '8px';
    timer.style.fontSize = '11px';
    timer.style.color = '#8f8';
    trackerBox.appendChild(timer);

    makeDraggable(trackerBox);
    renderControls();
    updateTimer();
    setInterval(updateTimer, 1000);

    function makeDraggable(el) {
        let offsetX, offsetY, dragging = false;
        el.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.classList.contains('icon')) return;
            dragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => {
            if (dragging) {
                localStorage.setItem(POS_KEY + '_top', el.style.top);
                localStorage.setItem(POS_KEY + '_left', el.style.left);
            }
            dragging = false;
        });
    }

    function renderControls() {
        const controls = document.createElement('div');
        controls.style.marginTop = '8px';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.onclick = () => {
            if (confirm("Reset all loot stats?")) {
                timestamps = [];
                localStorage.removeItem(STORAGE_KEY);
                localStorage.setItem(RESET_TIME_KEY, Date.now());
                localStorage.setItem(CYBER_GAIN_KEY, '0');
                localStorage.removeItem(CYBER_BASE_KEY);
                updateBox();
            }
        };

        const modeSelect = document.createElement('select');
        modeSelect.style.marginLeft = '6px';
        ['hour', 'day', 'session'].forEach(mode => {
            const opt = document.createElement('option');
            opt.value = mode;
            opt.textContent = `Per ${mode}`;
            modeSelect.appendChild(opt);
        });
        modeSelect.value = viewMode;
        modeSelect.onchange = () => {
            viewMode = modeSelect.value;
            updateBox();
        };

        const settingsBtn = document.createElement('span');
        settingsBtn.textContent = '⚙️';
        settingsBtn.title = 'Set values';
        settingsBtn.className = 'icon';
        settingsBtn.style.marginLeft = '8px';
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.onclick = showSettingsPopup;

        controls.appendChild(resetBtn);
        controls.appendChild(modeSelect);
        controls.appendChild(settingsBtn);
        trackerBox.appendChild(controls);
    }

    function formatNumber(n) {
        return n.toLocaleString();
    }

    function updateBox() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
        const now = Date.now();
        const hourAgo = now - 3600000;
        const dayAgo = now - 86400000;

        const stats = {};
        timestamps.forEach(entry => {
            const show = viewMode === 'session' ||
                         (viewMode === 'hour' && entry.time >= hourAgo) ||
                         (viewMode === 'day' && entry.time >= dayAgo);
            if (!show) return;
            if (!stats[entry.item]) stats[entry.item] = 0;
            stats[entry.item] += entry.amount;
        });

        let totalIncome = 0;
        const html = [];
        html.push('<strong>Cybroria Loot Tracker</strong><br><br>');
        html.push(`<u>Per ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}:</u><br><br>`);

        function renderGroup(title, items, calculateValue = false) {
            const group = [];
            let hasItems = false;
            items.forEach(item => {
                if (stats[item]) {
                    const amount = stats[item];
                    hasItems = true;
                    const displayAmount = formatNumber(amount);
                    if (calculateValue && lootValues[item]) {
                        const value = amount * lootValues[item];
                        totalIncome += value;
                    }
                    group.push(`${item}: ${displayAmount}`);
                }
            });
            return hasItems ? `<strong>${title}:</strong><br>${group.join('<br>')}<br><br>` : '';
        }

        html.push(renderGroup("Fighting Stats", ["Strength", "Agility", "Dexterity", "Vitality"]));
        html.push(renderGroup("Extraction Stats", ["Energy Tap", "System Breach", "Chemsynthesis", "Cyber Harvest"]));

        const currencyHtml = [];
        ["Credits", "Artifacts"].forEach(item => {
            if (stats[item]) {
                const val = lootValues[item] ? stats[item] * lootValues[item] : 0;
                if (val) totalIncome += val;
                currencyHtml.push(`${item}: ${formatNumber(stats[item])}`);
            }
        });

        const cyberGain = parseInt(localStorage.getItem(CYBER_GAIN_KEY), 10);
        if (cyberGain > 0) {
            const val = lootValues["Cyber Components"] ? cyberGain * lootValues["Cyber Components"] : 0;
            if (val) totalIncome += val;
            currencyHtml.push(`Cyber Components: ${formatNumber(cyberGain)}`);
        }

        if (currencyHtml.length) {
            html.push(`<strong>Currency:</strong><br>${currencyHtml.join('<br>')}<br><br>`);
        }

        html.push(renderGroup("Extraction Loot", ["Power Cells", "Logic Cores", "Cyber Implants", "Neuro Stims"], true));

        if (totalIncome > 0) {
            html.push(`<strong>Total Income:</strong> ${formatNumber(totalIncome)} credits<br>`);
        }

        const oldTimer = document.getElementById('cybroria-timer');
        trackerBox.innerHTML = html.join('');
        renderControls();
        if (oldTimer) trackerBox.appendChild(oldTimer);
    }

    function updateTimer() {
        const resetTime = parseInt(localStorage.getItem(RESET_TIME_KEY), 10);
        const seconds = Math.floor((Date.now() - resetTime) / 1000);
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        const timerEl = document.getElementById('cybroria-timer');
        if (timerEl) {
            timerEl.textContent = `⏱ since last reset: ${hrs}:${mins}:${secs}`;
        }
    }

    function showSettingsPopup() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#222';
        popup.style.color = '#fff';
        popup.style.padding = '20px';
        popup.style.border = '2px solid #0f0';
        popup.style.zIndex = 10000;
        popup.style.maxHeight = '80vh';
        popup.style.overflowY = 'auto';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginTop = '10px';
        closeBtn.onclick = () => popup.remove();

        const inputItems = ["Artifacts", "Power Cells", "Logic Cores", "Cyber Implants", "Neuro Stims", "Cyber Components"];
        lootValues.Credits = 1;
        inputItems.forEach(item => {
            const label = document.createElement('label');
            label.textContent = `${item} price: `;
            label.style.display = 'block';

            const input = document.createElement('input');
            input.type = 'number';
            input.value = lootValues[item] || '';
            input.style.marginBottom = '6px';
            input.onchange = () => {
                lootValues[item] = parseFloat(input.value) || 0;
                localStorage.setItem(VALUE_KEY, JSON.stringify(lootValues));
                updateBox();
            };

            label.appendChild(input);
            popup.appendChild(label);
        });

        popup.appendChild(closeBtn);
        document.body.appendChild(popup);
    }

    function parseLootText(text) {
        text = text.replace(/\u00A0/g, ' ')
                   .replace(/\s+/g, ' ')
                   .replace(/\([\d,]+ for your syndicate\)/g, '')
                   .trim();

        const statValueMatch = text.match(/You have found ([\d,]+) ([A-Za-z ]+?) Stat Value/i);
        if (statValueMatch) {
            const amount = parseInt(statValueMatch[1].replace(/,/g, ''), 10);
            const statName = statValueMatch[2].trim();
            if (trackedTypes.includes(statName)) {
                timestamps.push({ time: Date.now(), item: statName, amount });
                updateBox();
            }
            return;
        }

        const lootMatch = text.match(/You have found ([\d,]+) ([A-Za-z ]+)/);
        if (lootMatch) {
            const qty = parseInt(lootMatch[1].replace(/,/g, ''), 10);
            const item = lootMatch[2].trim();
            if (trackedTypes.includes(item)) {
                timestamps.push({ time: Date.now(), item, amount: qty });
                updateBox();
            }
        }
    }

    const trackedTypes = [
        "Strength", "Agility", "Dexterity", "Vitality",
        "Energy Tap", "System Breach", "Chemsynthesis", "Cyber Harvest",
        "Credits", "Power Cells", "Logic Cores", "Artifacts",
        "Neuro Stims", "Cyber Implants"
    ];

    function observeLootLog() {
        const seenLines = new Set();
        setInterval(() => {
            const logSpans = document.querySelectorAll('app-loot-log span.ng-star-inserted');
            logSpans.forEach(span => {
                const rawText = span.textContent.trim();
                if (rawText.includes("You have found") && !seenLines.has(rawText)) {
                    seenLines.add(rawText);
                    parseLootText(rawText);
                }
            });
        }, 1000);
    }

    function trackCyberComponentDelta() {
        setInterval(() => {
            const el = Array.from(document.querySelectorAll('*')).find(e =>
                e.textContent && e.textContent.includes("Cyber Components")
            );
            if (el) {
                const match = el.textContent.match(/Cyber Components\s*:?[\s]*([\d,]+)/i);
                if (match) {
                    const current = parseInt(match[1].replace(/,/g, ''), 10);
                    const base = parseInt(localStorage.getItem(CYBER_BASE_KEY) || current);
                    const gain = current - base;
                    localStorage.setItem(CYBER_GAIN_KEY, gain.toString());
                    localStorage.setItem(CYBER_BASE_KEY, base.toString());
                    updateBox();
                }
            }
        }, 2000);
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            observeLootLog();
            trackCyberComponentDelta();
        }, 3000);
        updateBox();
    });
})();
