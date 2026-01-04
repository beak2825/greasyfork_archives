// ==UserScript==
// @name         Cybroria Loot Tracker v4.3.2
// @namespace    http://tampermonkey.net/
// @version      4.3.2
// @description  Tracks loot, stats, Cyber Components, income calculator, with theme switcher, click-through toggle, collapsible controls, and hotkey toggle (Ctrl+L). Fully fixed pointer events and layout logic for reliable performance.
// @author       Skydragon
// @match        https://cybroria.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535639/Cybroria%20Loot%20Tracker%20v432.user.js
// @updateURL https://update.greasyfork.org/scripts/535639/Cybroria%20Loot%20Tracker%20v432.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'cybroria_loot_stats';
    const VALUE_KEY = 'cybroria_loot_values';
    const POS_KEY = 'cybroria_tracker_position';
    const RESET_TIME_KEY = 'cybroria_reset_time';
    const CYBER_BASE_KEY = 'cybroria_cyber_components_base';
    const CYBER_GAIN_KEY = 'cybroria_cyber_components_gain';
    const OPACITY_KEY = 'cybroria_tracker_opacity';
    const THEME_KEY = 'cybroria_tracker_theme';
    const CLICKTHRU_KEY = 'cybroria_tracker_clickthrough';
    const UI_COLLAPSE_KEY = 'cybroria_tracker_controls_hidden';

    let timestamps = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let lootValues = JSON.parse(localStorage.getItem(VALUE_KEY) || '{}');
    let viewMode = 'hour';
    let panelOpacity = parseFloat(localStorage.getItem(OPACITY_KEY)) || 0.6;
    let theme = localStorage.getItem(THEME_KEY) || 'dark';
    let clickThrough = localStorage.getItem(CLICKTHRU_KEY) === 'true';
    let controlsHidden = localStorage.getItem(UI_COLLAPSE_KEY) === 'true';

    if (!localStorage.getItem(RESET_TIME_KEY)) {
        localStorage.setItem(RESET_TIME_KEY, Date.now());
    }
    if (!localStorage.getItem(CYBER_GAIN_KEY)) {
        localStorage.setItem(CYBER_GAIN_KEY, '0');
    }

    const trackedTypes = [
        "Strength", "Agility", "Dexterity", "Vitality",
        "Energy Tap", "System Breach", "Chemsynthesis", "Cyber Harvest",
        "Credits", "Power Cells", "Logic Cores", "Artifacts",
        "Neuro Stims", "Cyber Implants", "Cyber Components"
    ];

    const trackerBox = document.createElement('div');
    trackerBox.id = 'cybroria-tracker';
    trackerBox.style.position = 'fixed';
    trackerBox.style.top = localStorage.getItem(POS_KEY + '_top') || '10px';
    trackerBox.style.left = localStorage.getItem(POS_KEY + '_left') || '10px';

    function applyPanelStyles() {
        const glow = '0 0 12px rgba(0,255,100,0.4)';
        const light = '0 0 8px rgba(255,255,255,0.3)';
        const base = trackerBox.style;
        base.background = theme === 'dark' ? `rgba(0,0,0,${panelOpacity})` : `rgba(255,255,255,${panelOpacity})`;
        base.color = theme === 'dark' ? '#cfc' : '#333';
        base.borderRadius = '10px';
        base.boxShadow = theme === 'dark' ? glow : light;
        base.border = theme === 'dark' ? '1px solid rgba(0,255,100,0.3)' : '1px solid rgba(0,0,0,0.2)';
        base.textShadow = theme === 'dark' ? '0 0 4px rgba(0,255,100,0.3)' : 'none';
        base.fontFamily = 'monospace';
        base.fontSize = '13px';
        base.padding = '12px';
        base.zIndex = 9999;
        base.cursor = 'move';
        base.minWidth = '240px';
        base.pointerEvents = clickThrough ? 'none' : 'auto';
    }

    applyPanelStyles();
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

    function updateBox() {
        trackerBox.innerHTML = '';
        trackerBox.appendChild(timer);
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
        const currencyHtml = [];

        const cyberGain = parseInt(localStorage.getItem(CYBER_GAIN_KEY), 10);
        if (cyberGain > 0) {
            const value = lootValues['Cyber Components'] || 0;
            totalIncome += cyberGain * value;
            currencyHtml.push(`Cyber Components: ${cyberGain.toLocaleString()}`);
        }

        const html = [];
        html.push('<strong>Cybroria Loot Tracker</strong><br><br>');
        html.push(`<u>Per ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}:</u><br><br>`);

        const sections = {
            'Fighting Stats': ["Strength", "Agility", "Dexterity", "Vitality"],
            'Extraction Stats': ["Energy Tap", "System Breach", "Chemsynthesis", "Cyber Harvest"],
            'Currency': ["Credits", "Artifacts"],
            'Extraction Loot': ["Power Cells", "Logic Cores", "Cyber Implants", "Neuro Stims"]
        };

        for (const [title, items] of Object.entries(sections)) {
            const group = items.map(item => {
                if (!stats[item]) return null;
                const amount = stats[item];
                const value = lootValues[item] || 0;
                totalIncome += amount * value;
                return `${item}: ${amount.toLocaleString()}`;
            }).filter(Boolean);
            if (group.length) {
                html.push(`<strong>${title}:</strong><br>${group.join('<br>')}<br><br>`);
            }
        }

        if (currencyHtml.length) {
            html.push(`<strong>Currency:</strong><br>${currencyHtml.join('<br>')}<br><br>`);
        }

        if (totalIncome > 0) {
            html.push(`<strong>Total Income:</strong> ${totalIncome.toLocaleString()} credits<br>`);
        }

        trackerBox.innerHTML += html.join('');
        trackerBox.appendChild(timer);
        renderControls();
    }
    function renderControls() {
        const controlsWrapper = document.createElement('div');
        controlsWrapper.id = 'tracker-controls';

        const collapseToggle = document.createElement('div');
        collapseToggle.textContent = controlsHidden ? '[+]' : '[–]';
        collapseToggle.style.cursor = 'pointer';
        collapseToggle.style.marginBottom = '6px';
        collapseToggle.style.fontWeight = 'bold';
        collapseToggle.onclick = () => {
            controlsHidden = !controlsHidden;
            localStorage.setItem(UI_COLLAPSE_KEY, controlsHidden);
            updateBox();
        };
        trackerBox.appendChild(collapseToggle);

        if (controlsHidden) return;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.onclick = () => {
            if (confirm('Reset all loot stats?')) {
                timestamps = [];
                localStorage.removeItem(STORAGE_KEY);
                localStorage.setItem(RESET_TIME_KEY, Date.now());
                localStorage.setItem(CYBER_GAIN_KEY, '0');
                localStorage.removeItem(CYBER_BASE_KEY);
                updateBox();
            }
        };

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export CSV';
        exportBtn.style.marginLeft = '6px';
        exportBtn.onclick = () => {
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

        controlsWrapper.appendChild(resetBtn);
        controlsWrapper.appendChild(exportBtn);
        controlsWrapper.appendChild(modeSelect);
        controlsWrapper.appendChild(settingsBtn);
        trackerBox.appendChild(controlsWrapper);

        if (clickThrough) {
            const icon = trackerBox.querySelector('.icon');
            if (icon) icon.style.pointerEvents = 'auto';
        }
    }

    function parseLootText(text) {
        text = text.replace(/\u00A0/g, ' ')
                   .replace(/\s+/g, ' ')
                   .replace(/\([\d,]+ for your syndicate\)/g, '')
                   .trim();

        const statMatch = text.match(/You have found ([\d,]+) ([A-Za-z ]+?) Stat Value/i);
        if (statMatch) {
            const amount = parseInt(statMatch[1].replace(/,/g, ''), 10);
            const statName = statMatch[2].trim();
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

    function observeLootLog() {
        const seenLines = new Set();
        setInterval(() => {
            const logSpans = document.querySelectorAll('app-loot-log span.ng-star-inserted');
            logSpans.forEach(span => {
                const rawText = span.textContent.trim();
                if (rawText.includes('You have found') && !seenLines.has(rawText)) {
                    seenLines.add(rawText);
                    parseLootText(rawText);
                }
            });
        }, 1000);
    }

    function trackCyberComponentDelta() {
        setInterval(() => {
            const el = Array.from(document.querySelectorAll('*')).find(e =>
                e.textContent && e.textContent.includes('Cyber Components')
            );
            if (el) {
                const match = el.textContent.match(/Cyber Components\s*:?\s*([\d,]+)/i);
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

    const timer = document.createElement('div');
    timer.id = 'cybroria-timer';
    timer.style.marginTop = '8px';
    timer.style.fontSize = '11px';
    timer.style.color = theme === 'dark' ? '#8f8' : '#555';
    trackerBox.appendChild(timer);

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

    const inputItems = [
        "Artifacts", "Power Cells", "Logic Cores",
        "Cyber Implants", "Neuro Stims", "Cyber Components"
    ];
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

    // Theme toggle
    const themeToggle = document.createElement('button');
    themeToggle.textContent = `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
    themeToggle.onclick = () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, theme);
        applyPanelStyles();
        updateBox();
        themeToggle.textContent = `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
    };

    // Opacity slider
    const opacityLabel = document.createElement('label');
    opacityLabel.textContent = 'Opacity:';
    opacityLabel.style.display = 'block';

    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0.2';
    opacitySlider.max = '1.0';
    opacitySlider.step = '0.05';
    opacitySlider.value = panelOpacity;
    opacitySlider.oninput = () => {
        panelOpacity = parseFloat(opacitySlider.value);
        localStorage.setItem(OPACITY_KEY, panelOpacity);
        applyPanelStyles();
    };

    opacityLabel.appendChild(opacitySlider);
    popup.appendChild(document.createElement('hr'));
    popup.appendChild(themeToggle);
    popup.appendChild(opacityLabel);

    // Click-through toggle
    const clickToggle = document.createElement('button');
    clickToggle.textContent = clickThrough ? 'Click-through: ON' : 'Click-through: OFF';
    clickToggle.onclick = () => {
        clickThrough = !clickThrough;
        localStorage.setItem(CLICKTHRU_KEY, clickThrough);
        applyPanelStyles();
        updateBox();
        clickToggle.textContent = clickThrough ? 'Click-through: ON' : 'Click-through: OFF';
makeDraggable(trackerBox);

    };

    popup.appendChild(document.createElement('hr'));
    popup.appendChild(clickToggle);
    popup.appendChild(document.createElement('hr'));
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);
}


    setTimeout(() => {
        observeLootLog();
        trackCyberComponentDelta();
        updateBox();
        document.body.appendChild(trackerBox);
    }, 3000);
})();
