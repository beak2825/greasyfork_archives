// ==UserScript==
// @name         Cybroria Loot Tracker (Stole from Skydragon)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Tracks loot and stat drops from right-hand log in Cybroria, now with CSV export, drag, reset, and persistent storage features.
// @author       Skydragon ofc
// @match        https://cybroria.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535672/Cybroria%20Loot%20Tracker%20%28Stole%20from%20Skydragon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535672/Cybroria%20Loot%20Tracker%20%28Stole%20from%20Skydragon%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'cybroria_loot_stats';
    const POS_KEY = 'cybroria_tracker_position';
    let timestamps = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let viewMode = 'hour'; // 'hour', 'day', or 'session'

    const trackedTypes = [
        "Strength", "Agility", "Dexterity", "Vitality",
        "Energy Tap", "System Breach", "Chemsynthesis", "Cyber Harvest",
        "Credits", "Power Cells", "Logic Cores", "Cyber Components", "Artifacts", "Power Cells",
        "Neuro Stims", "Cyber Implants"
    ];

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
    trackerBox.style.minWidth = '200px';
    trackerBox.style.border = '1px solid #0f0';
    trackerBox.innerHTML = '<strong>Cybroria Loot Tracker</strong><br>';
    document.body.appendChild(trackerBox);

    makeDraggable(trackerBox);
    renderControls();

    function makeDraggable(el) {
        let offsetX, offsetY, dragging = false;

        el.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;
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
        resetBtn.textContent = 'RR';
        resetBtn.onclick = () => {
            if (confirm("Reset all loot stats?")) {
                timestamps = [];
                localStorage.removeItem(STORAGE_KEY);
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

        controls.appendChild(resetBtn);
        controls.appendChild(modeSelect);
        trackerBox.appendChild(controls);
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

    let html = '<strong>Cybroria Loot Tracker</strong><br><br>';
    html += `<u>Per ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}:</u><br><br>`;

    function renderGroup(title, items) {
        let hasItems = items.some(item => stats[item]);
        if (!hasItems) return '';
        let section = `<strong>${title}:</strong><br>`;
        items.forEach(item => {
            if (stats[item]) {
                section += `${item}: ${stats[item]}<br>`;
            }
        });
        section += '<br>';
        return section;
    }

    html += renderGroup("Fighting Stats", ["Strength", "Agility", "Dexterity", "Vitality"]);
    html += renderGroup("Extraction Stats", ["Energy Tap", "System Breach", "Chemsynthesis", "Cyber Harvest"]);
    html += renderGroup("Currency", ["Credits", "Artifacts", "Cyber Components"]);
    html += renderGroup("Extraction Loot", ["Power Cells", "Logic Cores", "Cyber Implants", "Neuro Stims"]);

    trackerBox.innerHTML = html;
    renderControls();
}


    function exportCSV() {
        let csv = 'Item,Amount\n';
        const totals = {};

        timestamps.forEach(t => {
            if (!totals[t.item]) totals[t.item] = 0;
            totals[t.item] += t.amount;
        });

        for (const item in totals) {
            csv += `${item},${totals[item]}\n`;
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cybroria_loot.csv';
        link.click();
        URL.revokeObjectURL(url);
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
                timestamps.push({ time: Date.now(), item: item, amount: qty });
                updateBox();
            }
        }
    }

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

    window.addEventListener('load', () => {
        setTimeout(observeLootLog, 3000);
        updateBox();
    });
})();