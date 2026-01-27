// ==UserScript==
// @name         Torn Pickpocketing Target Filter
// @namespace    http://tampermonkey.net/
// @version      2.9.12
// @description  Highlights targets with time-based colors. Greys out/disables others. Collapsible boxes expand over content + Master/6x audio toggles. Only works when window is focused to comply with Torn rules.
// @author       Elaine [2047176]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @require      https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533555/Torn%20Pickpocketing%20Target%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/533555/Torn%20Pickpocketing%20Target%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = "PickpocketFilter";
    const WIKI_TARGET_LIST = [ // Original casing for display
        'Businessman', 'Businesswoman', 'Classy Lady', 'Cyclist', 'Drunk Man',
        'Drunk Woman', 'Elderly Man', 'Elderly Woman', 'Gang Member', 'Homeless Person',
        'Jogger', 'Junkie', 'Laborer', 'Mobster', 'Police Officer', 'Postal Worker',
        'Rich Kid', 'Sex Worker', 'Student', 'Thug', 'Young Man', 'Young Woman'
    ];
    const WIKI_TARGET_LIST_LC = WIKI_TARGET_LIST.map(t => t.toLowerCase()); // Lowercase for keys

    const STORAGE_KEY_FILTERS = 'pickpocketingFilterState_v1_lc';
    const STORAGE_KEY_COLLAPSED = 'pickpocketingFilterCollapsedState_v1';
    const HIGHLIGHT_CLASS = 'kw-target-highlighted';
    const FILTERED_OUT_CLASS = 'kw-target-filtered-out';
    const CONTROL_BOX_ID = 'pickpocket-filter-box-Gemini';
    const COLLAPSED_CLASS = 'kw-collapsed';
    const COLLAPSED_BOX_HEIGHT = '38px'; // Define collapsed height

    const AUDIO_ALERT_BOX_ID = 'pickpocket-audio-alert-box-Gemini';
    const STORAGE_KEY_AUDIO_ALERTS = 'pickpocketingAudioAlertState_v1';
    const STORAGE_KEY_AUDIO_COLLAPSED = 'pickpocketingAudioCollapsedState_v1';

    const MASTER_AUDIO_BOX_ID = 'pickpocket-master-audio-box-Gemini';
    const MASTER_AUDIO_CHECKBOX_ID = 'kw-master-audio-enable';

    const SIXFOLD_AUDIO_BOX_ID = 'pickpocket-sixfold-audio-box-Gemini';
    const SIXFOLD_AUDIO_CHECKBOX_ID = 'kw-sixfold-audio-enable';
    const STORAGE_KEY_SIXFOLD_AUDIO = 'pickpocketingSixfoldAudioState_v1';
    const MULTIPLE_AUDIO_DELAY = 0.18; // Delay between multiple sounds in seconds (used for 6x)

    // --- Robust Selectors ---
    const SEL_CRIME_ROOT = 'div[class*="crime-root"][class*="pickpocketing-root"]';
    const SEL_CURRENT_CRIME_CONTAINER = 'div[class*="currentCrime"]'; // Container for the target list
    const SEL_TARGET_LIST_CONTAINER = 'div[class*="virtualList"]';
    const SEL_TARGET_ITEM = 'div[class*="virtualItem"]';
    const SEL_TARGET_ITEM_WRAPPER = 'div[class*="crimeOptionWrapper"]';
    const SEL_TARGET_OPTION_DIV = 'div[class*="crimeOption___"]'; // The div holding crime info inside wrapper
    const SEL_TARGET_MAIN_SECTION = 'div[class*="mainSection"]';
    const SEL_TARGET_TITLE_PROPS = 'div[class*="titleAndProps"]';
    const SEL_TARGET_TYPE_DIV = ':scope > div:first-child';
    const SEL_COMMIT_BUTTON = 'button[class*="commit-button"]';
    const SEL_ACTIVITY_DIV = 'div[class*="activity"]';
    const SEL_TIMER_CLOCK = 'div[class*="clock"]';
    const SEL_LOCKED_ITEM_MARKER = '[class*="locked___"]'; // Class indicating the item is locked/expired

    // --- Color Config ---
    const COLOR_GREEN = { r: 50, g: 180, b: 50 };
    const COLOR_ORANGE = { r: 255, g: 165, b: 0 };
    const COLOR_RED = { r: 200, g: 0, b: 0 };
    const HIGHLIGHT_OPACITY = 0.4;
    const BORDER_OPACITY = 0.9;
    const SHADOW_OPACITY = 0.7;
    const URGENCY_THRESHOLD = 10; // Seconds

    // --- State ---
    let filterState = {};
    let targetListContainer = null;
    let controlBoxElement = null;
    let crimeListObserver = null;
    let pageLoadObserver = null;
    let crimeRootElement = null;
    let isInitialized = false;
    let isInitializing = false;
    let highlightUpdateIntervalId = null;

    let audioAlertState = {};
    let audioAlertBoxElement = null;
    let synth; // Tone.js synthesizer instance
    let toneStarted = false; // Flag to check if Tone.js context is started

    let masterAudioEnabled = false; // Master switch for all audio alerts
    let masterAudioBoxElement = null;

    let sixfoldAudioEnabled = false; // Flag for playing sound 6 times
    let sixfoldAudioBoxElement = null;


    console.log(`${SCRIPT_PREFIX}: Script loaded (v2.9.11). Restricted to focused window.`);

    // --- Styles ---
    GM_addStyle(`
        /* Keep target list container as default block */
        ${SEL_CRIME_ROOT} > ${SEL_CURRENT_CRIME_CONTAINER} {
            display: block;
            min-width: 0;
         }

        /* Wrapper for control boxes */
        #kw-control-boxes-wrapper {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-bottom: 15px;
            align-items: flex-start;
            flex-wrap: wrap;
            position: relative;
            z-index: 100;
        }
        /* Shared styles for control boxes */
        .kw-control-box {
            border: 1px solid #555; background-color: #2e2e2e; color: #ccc;
            border-radius: 5px;
            box-sizing: border-box; transition: max-height 0.3s ease-out, background-color 0.3s ease-out;
            overflow: visible;
            width: 165px;
            flex-shrink: 0;
            position: relative;
        }
        /* Collapsible box header styles */
        .kw-control-box .kw-filter-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 10px;
            cursor: pointer; background-color: #3a3a3a;
            transition: background-color 0.2s ease;
            height: ${COLLAPSED_BOX_HEIGHT};
            box-sizing: border-box;
            position: relative;
            z-index: 1;
            border-radius: 5px;
        }
        .kw-control-box .kw-filter-header:hover { background-color: #454545; }
        .kw-control-box .kw-filter-header h5 { margin: 0; color: #eee; font-size: 1.0em; font-weight: bold; }
        .kw-control-box .kw-filter-header .kw-collapse-indicator { font-size: 0.8em; margin-left: 5px; color: #aaa; }

        /* Content area styles - ABSOLUTE POSITIONING (Overlay) */
        .kw-control-box .kw-filter-content {
            position: absolute;
            top: ${COLLAPSED_BOX_HEIGHT};
            left: 0;
            width: 100%;
            z-index: 50;
            background-color: #2e2e2e;
            border: 1px solid #555;
            border-top: none;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);

            padding: 8px 10px;
            max-height: 450px;
            overflow-y: auto;
            scrollbar-width: thin; scrollbar-color: #666 #333;
            box-sizing: border-box;
            display: block;
        }
        .kw-control-box .kw-filter-content::-webkit-scrollbar { width: 8px; }
        .kw-control-box .kw-filter-content::-webkit-scrollbar-track { background: #333; border-radius: 4px; }
        .kw-control-box .kw-filter-content::-webkit-scrollbar-thumb { background-color: #666; border-radius: 4px; border: 2px solid #333; }

        /* Collapsed state styles */
        .kw-control-box.${COLLAPSED_CLASS} {
             max-height: ${COLLAPSED_BOX_HEIGHT};
             overflow: hidden;
             background-color: #3a3a3a;
        }
        .kw-control-box.${COLLAPSED_CLASS} .kw-filter-content {
            display: none;
        }

        /* Label/Checkbox styles */
        .kw-control-box label {
            display: flex;
            align-items: center;
            margin-bottom: 6px; cursor: pointer; padding: 3px 5px;
            border-radius: 3px; transition: background-color 0.2s ease;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9em;
        }
        .kw-control-box label:hover { background-color: #484848; }
        .kw-control-box input[type="checkbox"] { margin-right: 6px; vertical-align: middle; transform: scale(0.85); }

        /* specific box adjustments */
        #${AUDIO_ALERT_BOX_ID} .kw-filter-content { max-height: 300px; }
        #${AUDIO_ALERT_BOX_ID} .kw-italic-placeholder { font-style: italic; color: #888; padding: 5px; display: block; }

        /* Apply non-collapsible style */
        #${MASTER_AUDIO_BOX_ID}, #${SIXFOLD_AUDIO_BOX_ID} {
             max-height: ${COLLAPSED_BOX_HEIGHT} !important;
             height: ${COLLAPSED_BOX_HEIGHT} !important;
             padding: 0 10px !important;
             display: flex !important;
             align-items: center !important;
             overflow: hidden;
        }
         #${MASTER_AUDIO_BOX_ID} label, #${SIXFOLD_AUDIO_BOX_ID} label {
             margin-bottom: 0 !important;
             padding: 0 5px !important;
             height: auto !important;
             flex-grow: 1;
         }

        /* Highlighted Targets Styling */
        .${HIGHLIGHT_CLASS} > ${SEL_TARGET_ITEM_WRAPPER} > ${SEL_TARGET_OPTION_DIV} {
            --highlight-color-start-r: ${COLOR_ORANGE.r}; --highlight-color-start-g: ${COLOR_ORANGE.g}; --highlight-color-start-b: ${COLOR_ORANGE.b};
            --highlight-color-end-r: ${COLOR_RED.r}; --highlight-color-end-g: ${COLOR_RED.g}; --highlight-color-end-b: ${COLOR_RED.b};
            --highlight-border-r: ${COLOR_ORANGE.r}; --highlight-border-g: ${COLOR_ORANGE.g}; --highlight-border-b: ${COLOR_ORANGE.b};
            --highlight-shadow-r: ${COLOR_ORANGE.r}; --highlight-shadow-g: ${COLOR_ORANGE.g}; --highlight-shadow-b: ${COLOR_ORANGE.b};

            background: linear-gradient(45deg,
                rgba(var(--highlight-color-start-r), var(--highlight-color-start-g), var(--highlight-color-start-b), ${HIGHLIGHT_OPACITY}),
                rgba(var(--highlight-color-end-r), var(--highlight-color-end-g), var(--highlight-color-end-b), ${HIGHLIGHT_OPACITY})
            ) !important;
            border: 1px dashed rgba(var(--highlight-border-r), var(--highlight-border-g), var(--highlight-border-b), ${BORDER_OPACITY}) !important;
            box-shadow: 0 0 8px rgba(var(--highlight-shadow-r), var(--highlight-shadow-g), var(--highlight-shadow-b), ${SHADOW_OPACITY}) !important;
            border-radius: 4px;
            transition: background 0.5s linear, border-color 0.5s linear, box-shadow 0.5s linear;
        }

        /* Filtered Out Targets Styling */
        .${FILTERED_OUT_CLASS} {
            opacity: 0.55; filter: grayscale(60%);
            transition: opacity 0.3s ease, filter 0.3s ease;
        }
        .${FILTERED_OUT_CLASS}.${HIGHLIGHT_CLASS} { opacity: 1; filter: none; }
        .${FILTERED_OUT_CLASS} ${SEL_COMMIT_BUTTON} { cursor: not-allowed !important; filter: grayscale(80%); }
        .${HIGHLIGHT_CLASS} ${SEL_COMMIT_BUTTON} { cursor: pointer !important; filter: none; }
    `);

    // --- Storage Functions ---
    async function loadFilters() {
        const savedState = await GM_getValue(STORAGE_KEY_FILTERS, null);
        let newState = {};
        if (savedState && typeof savedState === 'object') {
            WIKI_TARGET_LIST_LC.forEach(lcTarget => {
                let foundValue = true;
                for (const savedKey in savedState) {
                    if (savedKey.toLowerCase() === lcTarget) {
                        foundValue = savedState[savedKey];
                        break;
                    }
                }
                 newState[lcTarget] = foundValue;
            });
        } else {
            WIKI_TARGET_LIST_LC.forEach(lcTarget => newState[lcTarget] = true);
        }
        filterState = newState;
        await saveFilters();
    }

    async function saveFilters() {
        await GM_setValue(STORAGE_KEY_FILTERS, filterState);
    }

    async function loadCollapsedState() {
        return await GM_getValue(STORAGE_KEY_COLLAPSED, false);
    }

    async function saveCollapsedState(isCollapsed) {
        await GM_setValue(STORAGE_KEY_COLLAPSED, isCollapsed);
    }

    async function loadAudioAlertState() {
        const savedState = await GM_getValue(STORAGE_KEY_AUDIO_ALERTS, null);
        let newState = {};
        if (savedState && typeof savedState === 'object') {
            WIKI_TARGET_LIST_LC.forEach(lcTarget => {
                let foundValue = false;
                for (const savedKey in savedState) {
                    if (savedKey.toLowerCase() === lcTarget) {
                        foundValue = savedState[savedKey];
                        break;
                    }
                }
                newState[lcTarget] = foundValue;
            });
        } else {
            WIKI_TARGET_LIST_LC.forEach(lcTarget => newState[lcTarget] = false);
        }
        audioAlertState = newState;
    }

    async function saveAudioAlertState() {
        await GM_setValue(STORAGE_KEY_AUDIO_ALERTS, audioAlertState);
    }

    async function loadAudioCollapsedState() {
        return await GM_getValue(STORAGE_KEY_AUDIO_COLLAPSED, true);
    }

    async function saveAudioCollapsedState(isCollapsed) {
        await GM_setValue(STORAGE_KEY_AUDIO_COLLAPSED, isCollapsed);
    }

    async function loadSixfoldAudioState() {
        sixfoldAudioEnabled = await GM_getValue(STORAGE_KEY_SIXFOLD_AUDIO, false);
    }

    async function saveSixfoldAudioState() {
        await GM_setValue(STORAGE_KEY_SIXFOLD_AUDIO, sixfoldAudioEnabled);
    }


    // --- UI Creation ---
    async function createControlBox() {
        if (document.getElementById(CONTROL_BOX_ID)) {
            controlBoxElement = document.getElementById(CONTROL_BOX_ID);
            updateControlBoxCheckboxes();
            const isCollapsed = await loadCollapsedState();
            controlBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
            const indicator = controlBoxElement.querySelector('.kw-collapse-indicator');
            if (indicator) indicator.textContent = isCollapsed ? '►' : '▼';
            attachHeaderListener(controlBoxElement, saveCollapsedState);
            return controlBoxElement;
        }

        controlBoxElement = document.createElement('div');
        controlBoxElement.id = CONTROL_BOX_ID;
        controlBoxElement.className = 'kw-control-box';

        const header = document.createElement('div');
        header.className = 'kw-filter-header';
        const indicatorSpan = document.createElement('span');
        indicatorSpan.className = 'kw-collapse-indicator';
        header.innerHTML = `<h5>Filter Targets</h5>`;
        header.appendChild(indicatorSpan);

        const content = document.createElement('div');
        content.className = 'kw-filter-content';
        WIKI_TARGET_LIST.sort((a, b) => a.localeCompare(b)).forEach(target => {
            const lcTarget = target.toLowerCase();
            const label = document.createElement('label');
            label.title = target;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = lcTarget;
            checkbox.checked = filterState[lcTarget] ?? true;
            checkbox.dataset.targetType = lcTarget;
            checkbox.addEventListener('change', async (event) => {
                filterState[event.target.value] = event.target.checked;
                await saveFilters();
                processTargets();
                updateAudioAlertList();
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${target}`));
            content.appendChild(label);
        });

        controlBoxElement.appendChild(header);
        controlBoxElement.appendChild(content);

        const isCollapsed = await loadCollapsedState();
        controlBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
        indicatorSpan.textContent = isCollapsed ? '►' : '▼';

        attachHeaderListener(controlBoxElement, saveCollapsedState);
        return controlBoxElement;
    }

    async function createAudioAlertBox() {
        if (document.getElementById(AUDIO_ALERT_BOX_ID)) {
            audioAlertBoxElement = document.getElementById(AUDIO_ALERT_BOX_ID);
            await updateAudioAlertList();
            const isCollapsed = await loadAudioCollapsedState();
            audioAlertBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
            const indicator = audioAlertBoxElement.querySelector('.kw-collapse-indicator');
            if (indicator) indicator.textContent = isCollapsed ? '►' : '▼';
            attachHeaderListener(audioAlertBoxElement, saveAudioCollapsedState);
            return audioAlertBoxElement;
        }

        audioAlertBoxElement = document.createElement('div');
        audioAlertBoxElement.id = AUDIO_ALERT_BOX_ID;
        audioAlertBoxElement.className = 'kw-control-box';

        const header = document.createElement('div');
        header.className = 'kw-filter-header';
        const indicatorSpan = document.createElement('span');
        indicatorSpan.className = 'kw-collapse-indicator';
        header.innerHTML = `<h5>Audio Alert</h5>`;
        header.appendChild(indicatorSpan);

        const content = document.createElement('div');
        content.className = 'kw-filter-content';
        content.innerHTML = `<ul id="kw-audio-alert-list" style="list-style: none; padding: 0; margin: 0;"></ul>`;

        audioAlertBoxElement.appendChild(header);
        audioAlertBoxElement.appendChild(content);

        const isCollapsed = await loadAudioCollapsedState();
        audioAlertBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
        indicatorSpan.textContent = isCollapsed ? '►' : '▼';

        attachHeaderListener(audioAlertBoxElement, saveAudioCollapsedState);
        await updateAudioAlertList();

        return audioAlertBoxElement;
    }

    async function updateAudioAlertList() {
        if (!audioAlertBoxElement) return;
        const listElement = audioAlertBoxElement.querySelector('#kw-audio-alert-list');
        if (!listElement) return;

        listElement.innerHTML = '';
        let hasActiveFilters = false;

        const sortedTargets = [...WIKI_TARGET_LIST].sort((a, b) => a.localeCompare(b));

        sortedTargets.forEach(target => {
            const lcTarget = target.toLowerCase();
            if (filterState[lcTarget]) {
                hasActiveFilters = true;
                const li = document.createElement('li');
                const label = document.createElement('label');
                label.title = `Enable audio alert for ${target}`;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                const checkboxId = `kw-audio-alert-${lcTarget}`;
                checkbox.id = checkboxId;
                checkbox.value = lcTarget;
                checkbox.checked = audioAlertState[lcTarget] || false;
                checkbox.addEventListener('change', handleAudioAlertChange);

                label.htmlFor = checkboxId;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${target}`));

                li.appendChild(label);
                listElement.appendChild(li);
            }
        });

         if (!hasActiveFilters) {
             listElement.innerHTML = '<li class="kw-italic-placeholder">No targets filtered.</li>';
         }
    }

    function createMasterAudioBox() {
        if (document.getElementById(MASTER_AUDIO_BOX_ID)) {
            masterAudioBoxElement = document.getElementById(MASTER_AUDIO_BOX_ID);
            const checkbox = masterAudioBoxElement.querySelector(`#${MASTER_AUDIO_CHECKBOX_ID}`);
            if (checkbox) checkbox.checked = masterAudioEnabled;
            attachMasterAudioListener();
            return masterAudioBoxElement;
        }

        masterAudioBoxElement = document.createElement('div');
        masterAudioBoxElement.id = MASTER_AUDIO_BOX_ID;
        masterAudioBoxElement.className = 'kw-control-box';

        const label = document.createElement('label');
        label.htmlFor = MASTER_AUDIO_CHECKBOX_ID;
        label.title = "Enable/Disable all audio alerts for this session";

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = MASTER_AUDIO_CHECKBOX_ID;
        checkbox.checked = masterAudioEnabled;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' Enable Audio'));

        masterAudioBoxElement.appendChild(label);
        attachMasterAudioListener();
        return masterAudioBoxElement;
    }

    function attachMasterAudioListener() {
        if (!masterAudioBoxElement) return;
        const checkbox = masterAudioBoxElement.querySelector(`#${MASTER_AUDIO_CHECKBOX_ID}`);
        if (checkbox && !checkbox.dataset.listenerAttached) {
            checkbox.addEventListener('change', handleMasterAudioChange);
            checkbox.dataset.listenerAttached = 'true';
        }
    }

    function createSixfoldAudioBox() {
        if (document.getElementById(SIXFOLD_AUDIO_BOX_ID)) {
            sixfoldAudioBoxElement = document.getElementById(SIXFOLD_AUDIO_BOX_ID);
            const checkbox = sixfoldAudioBoxElement.querySelector(`#${SIXFOLD_AUDIO_CHECKBOX_ID}`);
            if (checkbox) checkbox.checked = sixfoldAudioEnabled;
            attachSixfoldAudioListener();
            return sixfoldAudioBoxElement;
        }

        sixfoldAudioBoxElement = document.createElement('div');
        sixfoldAudioBoxElement.id = SIXFOLD_AUDIO_BOX_ID;
        sixfoldAudioBoxElement.className = 'kw-control-box';

        const label = document.createElement('label');
        label.htmlFor = SIXFOLD_AUDIO_CHECKBOX_ID;
        label.title = "Play audio alert 6 times instead of once";

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = SIXFOLD_AUDIO_CHECKBOX_ID;
        checkbox.checked = sixfoldAudioEnabled;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' 6x Audio'));

        sixfoldAudioBoxElement.appendChild(label);
        attachSixfoldAudioListener();
        return sixfoldAudioBoxElement;
    }

    function attachSixfoldAudioListener() {
        if (!sixfoldAudioBoxElement) return;
        const checkbox = sixfoldAudioBoxElement.querySelector(`#${SIXFOLD_AUDIO_CHECKBOX_ID}`);
        if (checkbox && !checkbox.dataset.listenerAttached) {
            checkbox.addEventListener('change', handleSixfoldAudioChange);
            checkbox.dataset.listenerAttached = 'true';
        }
    }

    function attachHeaderListener(boxElement, saveStateFunction) {
         if (!boxElement || !boxElement.classList.contains('kw-control-box')) return;
         const header = boxElement.querySelector('.kw-filter-header');
         if (!header) return;
         if (!header.dataset.listenerAttached) {
             header.addEventListener('click', () => {
                 const isNowCollapsed = boxElement.classList.toggle(COLLAPSED_CLASS);
                 const indicator = header.querySelector('.kw-collapse-indicator');
                 if (indicator) {
                     indicator.textContent = isNowCollapsed ? '►' : '▼';
                 }
                 saveStateFunction(isNowCollapsed);
             });
             header.dataset.listenerAttached = 'true';
         }
    }

    // --- Time & Color Utilities ---
    function parseTimeToSeconds(timeString) {
        if (!timeString || typeof timeString !== 'string') return null;
        timeString = timeString.trim().toLowerCase();
        if (timeString === '0s' || timeString === '') return 0;
        let totalSeconds = 0;
        const minuteMatch = timeString.match(/(\d+)\s*m/);
        const secondMatch = timeString.match(/(\d+)\s*s/);
        if (minuteMatch) { totalSeconds += parseInt(minuteMatch[1], 10) * 60; }
        if (secondMatch) { totalSeconds += parseInt(secondMatch[1], 10); }
        else if (!minuteMatch && /^\d+$/.test(timeString)) { totalSeconds = parseInt(timeString, 10); }
        else if (!secondMatch && timeString === 's') { return 0; }
        else if (!minuteMatch && !secondMatch) { return null; }
        return totalSeconds;
    }

    function getTargetTimeRemaining(itemElement) {
        const activityDiv = itemElement.querySelector(SEL_ACTIVITY_DIV);
        const clockElement = activityDiv ? activityDiv.querySelector(SEL_TIMER_CLOCK) : null;
        if (!clockElement || clockElement.classList.contains('hidden___UI9Im') || clockElement.textContent === '') {
            return 0;
        }
        return parseTimeToSeconds(clockElement.textContent);
    }

    function interpolateColor(color1, color2, factor) {
        factor = Math.max(0, Math.min(1, factor));
        const r = Math.round(color1.r + factor * (color2.r - color1.r));
        const g = Math.round(color1.g + factor * (color2.g - color1.g));
        const b = Math.round(color1.b + factor * (color2.b - color1.b));
        return { r, g, b };
    }

    // --- Audio Handling Functions ---
    async function startTone() {
        const ToneRef = typeof Tone !== 'undefined' ? Tone : unsafeWindow.Tone;
        if (!ToneRef) return;
        if (!toneStarted) {
            try {
                await ToneRef.start();
                synth = new ToneRef.Synth().toDestination();
                toneStarted = true;
            } catch (err) {
                console.error(`${SCRIPT_PREFIX}: Error starting Tone.js:`, err);
                toneStarted = false;
            }
        }
    }

    function playAlertSound() {
        if (!masterAudioEnabled || !toneStarted || !synth) return;
        try {
            const now = Tone.now();
            if (sixfoldAudioEnabled) {
                for (let i = 0; i < 6; i++) {
                    synth.triggerAttackRelease("A4", "8n", now + i * MULTIPLE_AUDIO_DELAY);
                }
            } else {
                synth.triggerAttackRelease("A4", "8n", now);
            }
        } catch (error) {
            console.error(`${SCRIPT_PREFIX}: Error playing sound:`, error);
        }
    }

    async function handleAudioAlertChange(event) {
        const lcTarget = event.target.value;
        const isChecked = event.target.checked;
        audioAlertState[lcTarget] = isChecked;
        await saveAudioAlertState();
    }

    async function handleMasterAudioChange(event) {
        const isChecked = event.target.checked;
        masterAudioEnabled = isChecked;
        if (masterAudioEnabled && !toneStarted) {
            await startTone();
        }
    }

    async function handleSixfoldAudioChange(event) {
        sixfoldAudioEnabled = event.target.checked;
        await saveSixfoldAudioState();
    }


    // --- Core Logic ---
    function getTargetTypeFromElement(targetElement) {
        const mainSection = targetElement.querySelector(SEL_TARGET_MAIN_SECTION);
        const titleProps = mainSection ? mainSection.querySelector(SEL_TARGET_TITLE_PROPS) : null;
        const titleDiv = titleProps ? titleProps.querySelector(SEL_TARGET_TYPE_DIV) : null;
        return titleDiv ? titleDiv.textContent.trim() : null;
    }

    let processTimeout = null;
    function processTargets() {
        clearTimeout(processTimeout);
        processTimeout = setTimeout(_processTargetsInternal, 50);
    }

    /** Internal function to process targets. Added focus guard for rule compliance. */
    function _processTargetsInternal() {
        // ***** RULE COMPLIANCE: Stop script logic if window is not viewed/focused *****
        if (!document.hasFocus() || !targetListContainer || !isInitialized) return;

        const items = Array.from(targetListContainer.querySelectorAll(`:scope > ${SEL_TARGET_ITEM}`));
        if (items.length === 0 && targetListContainer.children.length === 0) return;

        let needsColorUpdate = false;

        items.forEach((item) => {
             const crimeOptionWrapper = item.querySelector(SEL_TARGET_ITEM_WRAPPER);
             if (!crimeOptionWrapper) return;

             const crimeOptionDiv = crimeOptionWrapper.querySelector(`:scope > ${SEL_TARGET_OPTION_DIV}`);
             if (!crimeOptionDiv) return;

            const targetType = getTargetTypeFromElement(item);
            const lcTargetType = targetType ? targetType.toLowerCase() : null;

            const isLocked = crimeOptionDiv.matches(SEL_LOCKED_ITEM_MARKER);
            const matchesFilter = lcTargetType && filterState[lcTargetType] === true;
            const shouldHighlight = matchesFilter && !isLocked;

            const hadHighlight = item.classList.contains(HIGHLIGHT_CLASS);
            item.classList.toggle(HIGHLIGHT_CLASS, shouldHighlight);
            item.classList.toggle(FILTERED_OUT_CLASS, !shouldHighlight);

            if (shouldHighlight && !hadHighlight) {
                needsColorUpdate = true;
                if (lcTargetType && audioAlertState[lcTargetType]) {
                    playAlertSound();
                }
            }

             const button = item.querySelector(SEL_COMMIT_BUTTON);
             if (button) button.disabled = !shouldHighlight;

              if (!shouldHighlight) clearHighlightStyles(crimeOptionDiv);
        });

        if (needsColorUpdate) updateHighlightColors();
    }

    /** Updates highlight colors. Added focus guard for rule compliance. */
    function updateHighlightColors() {
        // ***** RULE COMPLIANCE: Stop script logic if window is not viewed/focused *****
        if (!document.hasFocus() || !isInitialized) return;

        const highlightedItems = document.querySelectorAll(`${SEL_TARGET_LIST_CONTAINER} > ${SEL_TARGET_ITEM}.${HIGHLIGHT_CLASS}`);

        highlightedItems.forEach(item => {
            const crimeOptionDiv = item.querySelector(`${SEL_TARGET_ITEM_WRAPPER} > ${SEL_TARGET_OPTION_DIV}`);
            if (!crimeOptionDiv) return;

            const isLocked = crimeOptionDiv.matches(SEL_LOCKED_ITEM_MARKER);
            const time = getTargetTimeRemaining(item);

            if (isLocked || time === null) {
                item.classList.remove(HIGHLIGHT_CLASS);
                item.classList.remove(FILTERED_OUT_CLASS);
                clearHighlightStyles(crimeOptionDiv);
                const button = item.querySelector(SEL_COMMIT_BUTTON);
                if (button) button.disabled = true;
                return;
            }

            let colorStart, colorEnd, borderColor, shadowColor;

            if (time <= 0) {
                colorStart = COLOR_RED; colorEnd = COLOR_RED;
                borderColor = COLOR_RED; shadowColor = COLOR_RED;
            } else if (time > URGENCY_THRESHOLD) {
                colorStart = COLOR_GREEN; colorEnd = COLOR_GREEN;
                borderColor = COLOR_GREEN; shadowColor = COLOR_GREEN;
            } else {
                const factor = Math.min(1, Math.max(0, (URGENCY_THRESHOLD - time) / URGENCY_THRESHOLD));
                const interpolated = interpolateColor(COLOR_ORANGE, COLOR_RED, factor);
                colorStart = interpolated; colorEnd = interpolated;
                borderColor = interpolated; shadowColor = interpolated;
            }

            setHighlightStyles(crimeOptionDiv, colorStart, colorEnd, borderColor, shadowColor);
        });
    }

    function setHighlightStyles(element, start, end, border, shadow) {
        element.style.setProperty('--highlight-color-start-r', start.r);
        element.style.setProperty('--highlight-color-start-g', start.g);
        element.style.setProperty('--highlight-color-start-b', start.b);
        element.style.setProperty('--highlight-color-end-r', end.r);
        element.style.setProperty('--highlight-color-end-g', end.g);
        element.style.setProperty('--highlight-color-end-b', end.b);
        element.style.setProperty('--highlight-border-r', border.r);
        element.style.setProperty('--highlight-border-g', border.g);
        element.style.setProperty('--highlight-border-b', border.b);
        element.style.setProperty('--highlight-shadow-r', shadow.r);
        element.style.setProperty('--highlight-shadow-g', shadow.g);
        element.style.setProperty('--highlight-shadow-b', shadow.b);
    }

    function clearHighlightStyles(element) {
        element.style.removeProperty('--highlight-color-start-r');
        element.style.removeProperty('--highlight-color-start-g');
        element.style.removeProperty('--highlight-color-start-b');
        element.style.removeProperty('--highlight-color-end-r');
        element.style.removeProperty('--highlight-color-end-g');
        element.style.removeProperty('--highlight-color-end-b');
        element.style.removeProperty('--highlight-border-r');
        element.style.removeProperty('--highlight-border-g');
        element.style.removeProperty('--highlight-border-b');
        element.style.removeProperty('--highlight-shadow-r');
        element.style.removeProperty('--highlight-shadow-g');
        element.style.removeProperty('--highlight-shadow-b');
    }

    // --- Initialization ---
    function stopCrimeListObserver() {
         if (crimeListObserver) {
             crimeListObserver.disconnect();
             crimeListObserver = null;
         }
    }

    function startCrimeListObserver() {
        if (crimeListObserver || !targetListContainer) return;
        crimeListObserver = new MutationObserver((mutationsList) => {
            let relevantChange = mutationsList.some(mutation =>
                mutation.type === 'childList' &&
                [...mutation.addedNodes, ...mutation.removedNodes].some(node =>
                    node.nodeType === 1 && node.matches(SEL_TARGET_ITEM)
                )
            );
            if (relevantChange) processTargets();
        });
        crimeListObserver.observe(targetListContainer, { childList: true });
    }

    async function initializeScript(retryCount = 0) {
        const MAX_RETRIES = 30; const RETRY_DELAY = 300;
        if (retryCount === 0) { isInitializing = true; }

        stopCrimeListObserver();
        if(highlightUpdateIntervalId) clearInterval(highlightUpdateIntervalId);

        crimeRootElement = document.querySelector(SEL_CRIME_ROOT);
        const crimeContentContainer = crimeRootElement ? crimeRootElement.querySelector(SEL_CURRENT_CRIME_CONTAINER) : null;
        targetListContainer = crimeContentContainer ? crimeContentContainer.querySelector(SEL_TARGET_LIST_CONTAINER) : null;

        if (!crimeRootElement || !crimeContentContainer || !targetListContainer) {
            if (retryCount < MAX_RETRIES) {
                setTimeout(() => initializeScript(retryCount + 1), RETRY_DELAY);
            } else { isInitialized = false; isInitializing = false; }
            return;
        }

        await loadFilters();
        await loadAudioAlertState();
        await loadSixfoldAudioState();

        const filterBox = await createControlBox();
        const audioBox = await createAudioAlertBox();
        const masterAudioBox = createMasterAudioBox();
        const sixfoldAudioBox = createSixfoldAudioBox();

        if (filterBox && audioBox && masterAudioBox && sixfoldAudioBox && crimeRootElement && crimeRootElement.parentNode) {
             let controlsWrapper = document.getElementById('kw-control-boxes-wrapper');
             if (!controlsWrapper) {
                 controlsWrapper = document.createElement('div');
                 controlsWrapper.id = 'kw-control-boxes-wrapper';
                 crimeRootElement.parentNode.insertBefore(controlsWrapper, crimeRootElement);
             }
             if (!controlsWrapper.contains(filterBox)) controlsWrapper.appendChild(filterBox);
             if (!controlsWrapper.contains(audioBox)) controlsWrapper.appendChild(audioBox);
             if (!controlsWrapper.contains(masterAudioBox)) controlsWrapper.appendChild(masterAudioBox);
             if (!controlsWrapper.contains(sixfoldAudioBox)) controlsWrapper.appendChild(sixfoldAudioBox);

             isInitialized = true; isInitializing = false;
        } else {
             isInitialized = false; isInitializing = false; return;
        }

        processTargets();
        startCrimeListObserver();
        highlightUpdateIntervalId = setInterval(updateHighlightColors, 1000);

        // ***** RULE COMPLIANCE: Refresh when tab regained focus *****
        window.addEventListener('focus', () => {
            if (isInitialized) processTargets();
        });
    }

     function updateControlBoxCheckboxes() {
         if (!controlBoxElement) controlBoxElement = document.getElementById(CONTROL_BOX_ID); if (!controlBoxElement) return;
         const checkboxes = controlBoxElement.querySelectorAll('input[type="checkbox"]');
         checkboxes.forEach(cb => { cb.checked = filterState[cb.value] ?? true; });
     }

    function cleanupScript() {
        stopCrimeListObserver();
        if (highlightUpdateIntervalId) { clearInterval(highlightUpdateIntervalId); highlightUpdateIntervalId = null; }
        const wrapper = document.getElementById('kw-control-boxes-wrapper');
        if (wrapper) wrapper.remove();
        audioAlertState = {}; synth = null; toneStarted = false;
        audioAlertBoxElement = null; masterAudioBoxElement = null; masterAudioEnabled = false;
        sixfoldAudioBoxElement = null; sixfoldAudioEnabled = false;
        controlBoxElement = null; targetListContainer = null; crimeRootElement = null;
        clearTimeout(processTimeout);
        isInitialized = false; isInitializing = false;
    }

    function startPageLoadObserver() {
        const mainContentArea = document.querySelector('#mainContainer .content-wrapper');
        if (!mainContentArea) { setTimeout(startPageLoadObserver, 1000); return; }

         pageLoadObserver = new MutationObserver((mutationsList) => {
             const pickpocketRoot = mainContentArea.querySelector(SEL_CRIME_ROOT);
             const isOnPickpocketing = window.location.hash === '#/pickpocketing';
             if (isOnPickpocketing && pickpocketRoot && !isInitialized && !isInitializing) {
                 initializeScript();
             }
             else if (isInitialized && (!isOnPickpocketing || !pickpocketRoot)) {
                 cleanupScript();
             }
         });
         pageLoadObserver.observe(mainContentArea, { childList: true, subtree: true });

         setTimeout(() => {
             const pickpocketRoot = mainContentArea.querySelector(SEL_CRIME_ROOT);
             if (window.location.hash === '#/pickpocketing' && pickpocketRoot && !isInitialized && !isInitializing) {
                  initializeScript();
             } else if (window.location.hash !== '#/pickpocketing' && isInitialized) {
                  cleanupScript();
             }
         }, 300);
    }

    startPageLoadObserver();
})();