// ==UserScript==
// @name         Bumble Filter (Interactive Settings with Radio Buttons & Number Filter)
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Highlights profiles on Bumble based on various criteria (Nice, Neutral, No-Go) with an interactive settings panel, radio button selection, and specific handling for height.
// @author       Your Name
// @match        *://*.bumble.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538333/Bumble%20Filter%20%28Interactive%20Settings%20with%20Radio%20Buttons%20%20Number%20Filter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538333/Bumble%20Filter%20%28Interactive%20Settings%20with%20Radio%20Buttons%20%20Number%20Filter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GLOBAL VARIABLES AND DEFAULT CONFIGURATION ---
    const SETTINGS_KEY = 'bumbleFilterSettings_v0_9_1'; // Updated version key

    const HIGHLIGHT_COLOR_NICE = 'lightgreen';
    const HIGHLIGHT_COLOR_INDIFFERENT = '#f0f0f0'; // Light gray for "neutral"
    const HIGHLIGHT_COLOR_NO_GO = '#ffcccb';

    const defaultSettingsTemplate = {
        education: { imageSubstring: 'education', desired: [], noGo: [], label: "Education", allKnownValues: [], type: "radio" },
        familyplans: { imageSubstring: 'familyplans', desired: [], noGo: [], label: "Family Plans", allKnownValues: [], type: "radio" },
        height: {
            imageSubstring: 'height',
            desiredMinCm: null,
            desiredMaxCm: null,
            noGoSpecificCm: [],
            label: "Height",
            allKnownValues: [],
            type: "numberRange"
        },
        exercise: { imageSubstring: 'exercise', desired: [], noGo: [], label: "Exercise", allKnownValues: [], type: "radio" },
        drinking: { imageSubstring: 'drinking', desired: [], noGo: [], label: "Drinking Habits", allKnownValues: [], type: "radio" },
        smoking: { imageSubstring: 'smoking', desired: [], noGo: [], label: "Smoking Habits", allKnownValues: [], type: "radio" },
        cannabis: { imageSubstring: 'cannabis', desired: [], noGo: [], label: "Cannabis Use", allKnownValues: [], type: "radio" },
        religion: { imageSubstring: 'religion', desired: [], noGo: [], label: "Religion", allKnownValues: [], type: "radio" },
        intentions: { imageSubstring: 'intentions', desired: [], noGo: [], label: "Intentions", allKnownValues: [], type: "radio" },
        politics: { imageSubstring: 'politics', desired: [], noGo: [], label: "Politics", allKnownValues: [], type: "radio" },
        starsign: { imageSubstring: 'starsign', desired: [], noGo: [], label: "Star Sign", allKnownValues: [], type: "radio" }
    };

    let currentSettings = {};
    const profileCardSelectors = ['.encounters-story'];

    function parseCmValue(cmString) {
        if (typeof cmString !== 'string') return null;
        const match = cmString.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    function loadSettings() {
        console.log("[Bumble Filter] Loading settings...");
        const storedSettings = GM_getValue(SETTINGS_KEY);
        currentSettings = JSON.parse(JSON.stringify(defaultSettingsTemplate));

        if (storedSettings) {
            console.log("[Bumble Filter] Found stored settings:", JSON.parse(JSON.stringify(storedSettings)));
            for (const key in currentSettings) {
                if (storedSettings[key]) {
                    const categoryTemplate = defaultSettingsTemplate[key];
                    const storedCategory = storedSettings[key];

                    if (categoryTemplate.type === "numberRange") {
                        currentSettings[key].desiredMinCm = storedCategory.desiredMinCm !== undefined ? (parseInt(String(storedCategory.desiredMinCm), 10) || null) : categoryTemplate.desiredMinCm;
                        currentSettings[key].desiredMaxCm = storedCategory.desiredMaxCm !== undefined ? (parseInt(String(storedCategory.desiredMaxCm), 10) || null) : categoryTemplate.desiredMaxCm;
                        currentSettings[key].noGoSpecificCm = Array.isArray(storedCategory.noGoSpecificCm) ? storedCategory.noGoSpecificCm.map(s => parseInt(String(s), 10)).filter(n => !isNaN(n)) : categoryTemplate.noGoSpecificCm;
                    } else {
                        currentSettings[key].desired = Array.isArray(storedCategory.desired) ? storedCategory.desired.map(s => String(s).toLowerCase().trim()).filter(s => s) : categoryTemplate.desired;
                        currentSettings[key].noGo = Array.isArray(storedCategory.noGo) ? storedCategory.noGo.map(s => String(s).toLowerCase().trim()).filter(s => s) : categoryTemplate.noGo;
                    }
                    currentSettings[key].allKnownValues = Array.isArray(storedCategory.allKnownValues) ? storedCategory.allKnownValues.map(s => String(s).toLowerCase().trim()).filter(s => s) : [];
                }
            }
        }
        for (const key in currentSettings) {
            const category = currentSettings[key];
            if (category.type === "radio") {
                const knownValuesSet = new Set(category.allKnownValues);
                category.desired.forEach(val => knownValuesSet.add(String(val).toLowerCase().trim()));
                category.noGo.forEach(val => knownValuesSet.add(String(val).toLowerCase().trim()));
                category.allKnownValues = Array.from(knownValuesSet).sort();
            }
        }
        console.log("[Bumble Filter] Settings loaded and merged:", JSON.parse(JSON.stringify(currentSettings)));
    }

    function saveSettings() {
        console.log("[Bumble Filter] Attempting to save settings. Current settings object before reading DOM:", JSON.parse(JSON.stringify(currentSettings)));
        for (const categoryKey in currentSettings) {
            const category = currentSettings[categoryKey];
            const panelContent = document.getElementById('bf-panel-content');
            if (!panelContent) {
                console.error("[Bumble Filter] Panel content not found for saving.");
                continue;
            }

            console.log(`[Bumble Filter] Saving category: ${categoryKey}`);

            if (category.type === "numberRange") {
                const minInput = panelContent.querySelector(`#bf-desiredMinCm-${categoryKey}`);
                const maxInput = panelContent.querySelector(`#bf-desiredMaxCm-${categoryKey}`);
                const noGoInput = panelContent.querySelector(`#bf-noGoSpecificCm-${categoryKey}`);

                category.desiredMinCm = minInput && minInput.value.trim() !== "" ? parseInt(minInput.value, 10) : null;
                category.desiredMaxCm = maxInput && maxInput.value.trim() !== "" ? parseInt(maxInput.value, 10) : null;
                category.noGoSpecificCm = noGoInput ? noGoInput.value.split('\n').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
            } else {
                const newDesired = [];
                const newNoGo = [];

                category.allKnownValues.forEach((value, index) => {
                    const stringValue = String(value);
                    const radioGroupName = `bf-state-${categoryKey}-${index}`;
                    const checkedRadio = panelContent.querySelector(`input[name="${radioGroupName}"]:checked`);

                    if (checkedRadio) {
                        if (checkedRadio.value === 'nice') {
                            newDesired.push(stringValue);
                        } else if (checkedRadio.value === 'nogo') {
                            newNoGo.push(stringValue);
                        }
                    }
                });
                category.desired = newDesired;
                category.noGo = newNoGo;
                console.log(`[Bumble Filter] Category ${categoryKey} after DOM read - Desired:`, [...category.desired], "NoGo:", [...category.noGo]);
            }
        }
        GM_setValue(SETTINGS_KEY, currentSettings);
        console.log("[Bumble Filter] Settings saved to GM_setValue:", JSON.parse(JSON.stringify(currentSettings)));
        document.querySelectorAll('[data-custom-filter-processed-v9-1]').forEach(card => {
            card.removeAttribute('data-custom-filter-processed-v9-1');
        });
        processVisibleProfileCards();
    }

    function resetSettings() {
        console.log("[Bumble Filter] Resetting settings to default.");
        if (confirm("Do you really want to reset all filter settings to their default values?")) {
            GM_setValue(SETTINGS_KEY, undefined);
            loadSettings();
            const panel = document.getElementById('bumble-filter-settings-panel');
            if (panel && panel.style.display === 'block') {
                 buildSettingsPanelContent(panel.querySelector('#bf-panel-content'));
            }
            document.querySelectorAll('[data-custom-filter-processed-v9-1]').forEach(card => {
                card.removeAttribute('data-custom-filter-processed-v9-1');
            });
            processVisibleProfileCards();
            alert("Settings have been reset.");
        }
    }

    function buildSettingsPanelContent(panelContentDiv) {
        if (!panelContentDiv) {
            console.error("[Bumble Filter] buildSettingsPanelContent: panelContentDiv is null");
            return;
        }
        for (const key in currentSettings) {
            const category = currentSettings[key];
            if (category.type === "radio") {
                const knownValuesSet = new Set(category.allKnownValues);
                currentSettings[key].desired.forEach(val => knownValuesSet.add(String(val).toLowerCase().trim()));
                currentSettings[key].noGo.forEach(val => knownValuesSet.add(String(val).toLowerCase().trim()));
                category.allKnownValues = Array.from(knownValuesSet).sort();
            }
        }
        console.log("[Bumble Filter] Building panel content with current settings for UI:", JSON.parse(JSON.stringify(currentSettings)));

        let contentHtml = '';
        for (const categoryKey in currentSettings) {
            const category = currentSettings[categoryKey];
            contentHtml += `<div class="bf-category-section"><h3>${category.label} (ID: ${category.imageSubstring})</h3>`;

            if (category.type === "numberRange") {
                contentHtml += `
                    <div class="bf-input-group">
                        <label for="bf-desiredMinCm-${categoryKey}">Min. desired height (cm):</label>
                        <input type="number" id="bf-desiredMinCm-${categoryKey}" value="${category.desiredMinCm === null ? '' : category.desiredMinCm}" placeholder="e.g. 170">
                    </div>
                    <div class="bf-input-group">
                        <label for="bf-desiredMaxCm-${categoryKey}">Max. desired height (cm):</label>
                        <input type="number" id="bf-desiredMaxCm-${categoryKey}" value="${category.desiredMaxCm === null ? '' : category.desiredMaxCm}" placeholder="e.g. 185">
                    </div>
                    <div class="bf-input-group">
                        <label for="bf-noGoSpecificCm-${categoryKey}">No-Go heights (cm, per line):</label>
                        <textarea id="bf-noGoSpecificCm-${categoryKey}" placeholder="e.g. 160\n195">${category.noGoSpecificCm.join('\n')}</textarea>
                    </div>`;
                if (category.allKnownValues.length > 0) {
                     contentHtml += `<p class="bf-info-text">Discovered heights (examples): ${category.allKnownValues.map(v => parseCmValue(v) + 'cm').filter(v => v !== 'nullcm').slice(0,10).join(', ')}${category.allKnownValues.length > 10 ? '...' : ''}</p>`;
                }
            } else {
                if (category.allKnownValues.length === 0) {
                    contentHtml += `<p class="bf-no-values">No values discovered for this category yet. They will be collected as you swipe.</p>`;
                }
                const sortedKnownValues = [...category.allKnownValues].sort();

                sortedKnownValues.forEach((value, index) => {
                    const stringValue = String(value);
                    const isDesired = category.desired.includes(stringValue);
                    const isNoGo = category.noGo.includes(stringValue);
                    const isNeutral = !isDesired && !isNoGo;
                    const radioGroupName = `bf-state-${categoryKey}-${index}`;

                    contentHtml += `
                        <div class="bf-value-row">
                            <span class="bf-value-label" title="${stringValue}">${stringValue.length > 25 ? stringValue.substring(0, 22) + '...' : stringValue}</span>
                            <div class="bf-radio-group">
                                <label class="bf-radio-label"><input type="radio" name="${radioGroupName}" value="nice" ${isDesired ? 'checked' : ''}> Nice</label>
                                <label class="bf-radio-label"><input type="radio" name="${radioGroupName}" value="neutral" ${isNeutral ? 'checked' : ''}> Neutral</label>
                                <label class="bf-radio-label"><input type="radio" name="${radioGroupName}" value="nogo" ${isNoGo ? 'checked' : ''}> No-Go</label>
                            </div>
                        </div>`;
                });
            }
            contentHtml += `</div>`;
        }
        panelContentDiv.innerHTML = contentHtml;
    }

    function createSettingsPanelShell() {
        let panel = document.getElementById('bumble-filter-settings-panel');
        if (panel) return panel;

        console.log("[Bumble Filter] Creating settings panel shell for the first time.");
        let panelHtml = `
            <div id="bf-panel-header">
                <h2>Bumble Filter Settings</h2>
                <button id="bf-close-panel" title="Close">X</button>
            </div>
            <div id="bf-panel-content"></div>
            <div id="bf-panel-footer">
                <button id="bf-reset-settings" title="Reset all settings to default">Reset</button>
                <button id="bf-save-settings">Save & Apply</button>
            </div>`;
        panel = document.createElement('div');
        panel.id = 'bumble-filter-settings-panel';
        panel.innerHTML = panelHtml;
        document.body.appendChild(panel);

        document.getElementById('bf-save-settings').addEventListener('click', () => saveSettings());
        document.getElementById('bf-close-panel').addEventListener('click', () => {
            const panelToClose = document.getElementById('bumble-filter-settings-panel');
            if(panelToClose) panelToClose.style.display = 'none';
        });
        document.getElementById('bf-reset-settings').addEventListener('click', () => resetSettings());
        return panel;
    }

    function addStyles() {
        GM_addStyle(`
            #bumble-filter-settings-panel {
                position: fixed; top: 50px; right: 20px; width: 480px; max-height: 85vh;
                background-color: white; border: 1px solid #ccc; box-shadow: 0 0 15px rgba(0,0,0,0.2);
                z-index: 100000 !important; display: none; font-family: Arial, sans-serif; font-size: 14px; border-radius: 8px;
                pointer-events: auto !important;
            }
            #bf-panel-header {
                background-color: #f0f0f0; padding: 10px 15px; border-bottom: 1px solid #ccc;
                display: flex; justify-content: space-between; align-items: center;
                border-top-left-radius: 8px; border-top-right-radius: 8px;
            }
            #bf-panel-header h2 { margin: 0; font-size: 16px; }
            #bf-close-panel, #bf-save-settings, #bf-open-settings-button, #bf-reset-settings {
                pointer-events: auto !important; cursor: pointer;
            }
            #bf-close-panel { background: none; border: none; font-size: 20px; padding: 0 5px;}
            #bf-panel-content { padding: 15px; overflow-y: auto; max-height: calc(85vh - 100px); }
            .bf-category-section { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
            .bf-category-section:last-child { border-bottom: none; margin-bottom: 0; }
            .bf-category-section h3 { font-size: 14px; margin-top: 0; margin-bottom: 10px; color: #333; }
            .bf-no-values, .bf-info-text { font-style: italic; color: #777; margin-left: 10px; font-size: 12px; }
            .bf-value-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px; border-radius: 3px; }
            .bf-value-row:hover { background-color: #f9f9f9; }
            .bf-value-label { flex-basis: 35%; font-size: 13px; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
            .bf-radio-group { display: flex; gap: 8px; pointer-events: auto !important; flex-basis: 65%; justify-content: flex-end; }
            .bf-radio-label { font-size: 12px; cursor: pointer; display:flex; align-items:center; pointer-events: auto !important; padding: 2px 5px; border-radius:3px; }
            .bf-radio-label:hover { background-color: #e9e9e9; }
            .bf-radio-label input[type="radio"] {
                margin-right: 3px; cursor: pointer; pointer-events: auto !important;
                z-index: 100001 !important; position: relative; appearance: auto !important;
                -webkit-appearance: auto !important; -moz-appearance: auto !important;
                opacity: 1 !important; visibility: visible !important;
                width: auto !important; height: auto !important;
            }
            .bf-input-group { margin-bottom: 10px; }
            .bf-input-group label { display: block; margin-bottom: 4px; font-weight: bold; font-size: 13px; }
            .bf-input-group input[type="number"], .bf-input-group textarea {
                width: 95%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;
            }
            .bf-input-group textarea { min-height: 50px; resize: vertical; }
            #bf-panel-footer {
                padding: 10px 15px; display: flex; justify-content: space-between; align-items: center;
                border-top: 1px solid #ccc; background-color: #f9f9f9;
                border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;
            }
            #bf-save-settings, #bf-reset-settings {
                padding: 8px 15px; color: white; border: none;
                border-radius: 4px; font-size: 14px;
            }
            #bf-save-settings { background-color: #5cb85c; }
            #bf-save-settings:hover { background-color: #4cae4c; }
            #bf-reset-settings { background-color: #d9534f; }
            #bf-reset-settings:hover { background-color: #c9302c; }
            #bf-open-settings-button {
                position: fixed; bottom: 20px; right: 20px; width: 40px; height: 40px;
                background-color: #7B1FA2; color: white; border: none; border-radius: 50%;
                font-size: 20px; font-weight: bold; text-align: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 99999 !important;
            }
            #bf-open-settings-button:hover { background-color: #6A1B9A; }
        `);
    }

    function logPills(profileCard) {
        const allTextPillsOnCard = profileCard.querySelectorAll('.pill__title > div.p-3.text-ellipsis.font-weight-medium, .pill__title > div.text-ellipsis.font-weight-medium.p-3');
        let cardMatchesAnyNiceCriteria = false;
        let cardHasAnyNoGo = false;
        let settingsModifiedByNewValues = false;

        allTextPillsOnCard.forEach(pillTextElement => {
            const pillTextOriginal = pillTextElement.textContent.trim();
            const pillTextLower = pillTextOriginal.toLowerCase().replace(/\u00a0/g, " ").trim();

            if (!pillTextLower) return;

            let pillTypeKey = null;
            let imageSrcFound = null;

            const pillTitleDiv = pillTextElement.parentElement;
            if (pillTitleDiv && pillTitleDiv.classList.contains('pill__title')) {
                const commonPillWrapper = pillTextElement.closest('li, .pill, .profile-badge-container, .user-interest, div.p-2, div.profile-v2-interest__badge') || pillTitleDiv.parentElement;
                if (commonPillWrapper) {
                    const imageElement = commonPillWrapper.querySelector('img.pill__image');
                    if (imageElement && imageElement.src) {
                        imageSrcFound = imageElement.src.toLowerCase();
                        for (const key in currentSettings) {
                            if (currentSettings[key] && currentSettings[key].imageSubstring && imageSrcFound.includes(currentSettings[key].imageSubstring.toLowerCase())) {
                                pillTypeKey = key;
                                break;
                            }
                        }
                    }
                }
            }

            if (pillTypeKey) {
                const category = currentSettings[pillTypeKey];
                const stringPillTextLower = String(pillTextLower);

                if (!category.allKnownValues.map(String).includes(stringPillTextLower)) {
                    category.allKnownValues.push(stringPillTextLower);
                    category.allKnownValues.sort();
                    settingsModifiedByNewValues = true;
                    console.log(`[Bumble Filter] New value discovered for '${category.label}': "${pillTextOriginal}"`);
                }

                let currentPillHighlightColor = HIGHLIGHT_COLOR_INDIFFERENT;
                let isNice = false;
                let isNoGo = false;

                if (category.type === "numberRange") {
                    const heightValue = parseCmValue(stringPillTextLower);
                    if (heightValue !== null) {
                        if (category.noGoSpecificCm && category.noGoSpecificCm.includes(heightValue)) {
                            isNoGo = true;
                        } else {
                            const minOk = category.desiredMinCm === null || heightValue >= category.desiredMinCm;
                            const maxOk = category.desiredMaxCm === null || heightValue <= category.desiredMaxCm;
                            if (minOk && maxOk && (category.desiredMinCm !== null || category.desiredMaxCm !== null)) {
                                isNice = true;
                            }
                        }
                    }
                } else {
                    isNice = category.desired.map(String).includes(stringPillTextLower);
                    isNoGo = category.noGo.map(String).includes(stringPillTextLower);
                }

                if (isNice) {
                    currentPillHighlightColor = HIGHLIGHT_COLOR_NICE;
                    cardMatchesAnyNiceCriteria = true;
                } else if (isNoGo) {
                    currentPillHighlightColor = HIGHLIGHT_COLOR_NO_GO;
                    cardHasAnyNoGo = true;
                }

                pillTextElement.style.backgroundColor = currentPillHighlightColor;
                pillTextElement.style.borderRadius = '5px';
                pillTextElement.style.padding = '2px 4px';
                pillTextElement.style.display = 'inline-block';
                pillTextElement.style.margin = '1px';
            }
        });

        if (settingsModifiedByNewValues) {
            const panel = document.getElementById('bumble-filter-settings-panel');
            if (panel && panel.style.display === 'block') {
                console.log("[Bumble Filter] New values discovered, refreshing panel content.");
                buildSettingsPanelContent(panel.querySelector('#bf-panel-content'));
            }
        }

        if (cardHasAnyNoGo) {
            // profileCard.style.border = `3px solid ${HIGHLIGHT_COLOR_NO_GO}`;
        } else if (cardMatchesAnyNiceCriteria) {
            // profileCard.style.border = `3px solid ${HIGHLIGHT_COLOR_NICE}`;
        }
    }

    function processVisibleProfileCards() {
        let processedSomethingOnThisRun = false;
        for (const selector of profileCardSelectors) {
            const cards = document.querySelectorAll(selector);
            if (cards.length > 0) {
                cards.forEach(card => {
                    if (!card.dataset.customFilterProcessedV9_0) { // Updated dataset version
                        logPills(card);
                        card.dataset.customFilterProcessedV9_0 = 'true';
                        processedSomethingOnThisRun = true;
                    }
                });
                if (processedSomethingOnThisRun) break;
            }
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        let newNodesAddedInThisBatch = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                newNodesAddedInThisBatch = true;
                break;
            }
        }
        if (newNodesAddedInThisBatch) {
            setTimeout(processVisibleProfileCards, 150);
        }
    });

    function init() {
        console.log("[Bumble Filter] Script started (v0.9.0 - Radio Buttons & Number Filter).");
        loadSettings();
        addStyles();

        if (!document.getElementById('bf-open-settings-button')) {
            const openButton = document.createElement('button');
            openButton.id = 'bf-open-settings-button';
            openButton.textContent = 'B';
            openButton.title = 'Bumble Filter Settings';
            document.body.appendChild(openButton);

            openButton.addEventListener('click', () => {
                let panel = document.getElementById('bumble-filter-settings-panel');
                if (!panel) {
                    panel = createSettingsPanelShell();
                }

                if (panel.style.display === 'block') {
                    panel.style.display = 'none';
                } else {
                    buildSettingsPanelContent(panel.querySelector('#bf-panel-content'));
                    panel.style.display = 'block';
                }
            });
        }

        let targetNode = document.querySelector('main.page__content') || document.querySelector('#main main') || document.body;
        if (targetNode) {
            processVisibleProfileCards();
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
            console.warn("[Bumble Filter] Main target node for observer not found.");
            const lateObserver = new MutationObserver(() => {
                targetNode = document.querySelector('main.page__content') || document.querySelector('#main main') || document.body;
                if (targetNode) {
                    lateObserver.disconnect();
                    processVisibleProfileCards();
                    observer.observe(targetNode, { childList: true, subtree: true });
                }
            });
            lateObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }

})();
