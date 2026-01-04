// ==UserScript==
// @name         Torn Pickpocketing Target Filter
// @namespace    http://tampermonkey.net/
// @version      2.9.11
// @description  Highlights targets with time-based colors. Greys out/disables others. Collapsible boxes + Master/6x audio toggles (positioned above, side-by-side). Robust selectors. Precise highlight removal. Complete Code.
// @author       Elaine [2047176]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @require      https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
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


    console.log(`${SCRIPT_PREFIX}: Script loaded (v2.9.10).`); // Version updated

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
            gap: 10px; /* Reduced gap */
            margin-bottom: 15px; /* Add space below the boxes */
            align-items: flex-start; /* Align boxes to the top */
            flex-wrap: wrap; /* Allow boxes to wrap on very narrow screens */
            position: relative; /* Needed for z-index context if children use it */
            z-index: 100; /* Ensure wrapper is generally above crime content */
        }
        /* Shared styles for control boxes */
        .kw-control-box {
            border: 1px solid #555; background-color: #2e2e2e; color: #ccc;
            border-radius: 5px;
            box-sizing: border-box; transition: max-height 0.3s ease-out, background-color 0.3s ease-out;
            overflow: visible; /* Allow absolute content to overflow */
            /* max-height: 600px; */ /* Max height now controlled by content */
            width: 165px; /* Reduced width */
            flex-shrink: 0; /* Prevent boxes from shrinking */
            position: relative; /* Crucial for absolute positioning of content */
        }
        /* Collapsible box header styles */
        .kw-control-box .kw-filter-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 10px;
            cursor: pointer; background-color: #3a3a3a;
            /* border-bottom: 1px solid #555; */ /* Border moved to content */
            transition: background-color 0.2s ease;
            height: ${COLLAPSED_BOX_HEIGHT};
            box-sizing: border-box;
            position: relative; /* Keep header in flow */
            z-index: 1; /* Header above content */
            border-radius: 5px; /* Round corners when collapsed */
        }
        .kw-control-box .kw-filter-header:hover { background-color: #454545; }
        .kw-control-box .kw-filter-header h5 { margin: 0; color: #eee; font-size: 1.0em; font-weight: bold; }
        .kw-control-box .kw-filter-header .kw-collapse-indicator { font-size: 0.8em; margin-left: 5px; color: #aaa; }

        /* Content area styles - ABSOLUTE POSITIONING */
        .kw-control-box .kw-filter-content {
            position: absolute;
            top: ${COLLAPSED_BOX_HEIGHT}; /* Position below the header */
            left: 0;
            width: 100%; /* Match parent box width */
            z-index: 50; /* Sit above page content below */
            background-color: #2e2e2e; /* Match box background */
            border: 1px solid #555;
            border-top: none; /* Avoid double border with header */
            border-radius: 0 0 5px 5px; /* Round bottom corners */
            box-shadow: 0 4px 8px rgba(0,0,0,0.3); /* Add shadow for overlay effect */

            padding: 8px 10px;
            max-height: 450px; /* Still allow scroll */
            overflow-y: auto;
            scrollbar-width: thin; scrollbar-color: #666 #333;
            box-sizing: border-box;
            /* transition: padding 0.3s ease-out; */ /* Transition might look weird with absolute */
            display: block; /* Ensure it's block */
        }
        .kw-control-box .kw-filter-content::-webkit-scrollbar { width: 8px; }
        .kw-control-box .kw-filter-content::-webkit-scrollbar-track { background: #333; border-radius: 4px; }
        .kw-control-box .kw-filter-content::-webkit-scrollbar-thumb { background-color: #666; border-radius: 4px; border: 2px solid #333; }

        /* Collapsed state styles */
        .kw-control-box.${COLLAPSED_CLASS} {
             max-height: ${COLLAPSED_BOX_HEIGHT}; /* Limit height of container */
             overflow: hidden; /* Hide the absolute content when container shrinks */
             background-color: #3a3a3a;
        }
        .kw-control-box.${COLLAPSED_CLASS} .kw-filter-header {
            border-bottom-color: #3a3a3a; /* Match background when collapsed */
        }
         /* Hide content using display:none still works and is efficient */
        .kw-control-box.${COLLAPSED_CLASS} .kw-filter-content {
            display: none;
        }

        /* Label/Checkbox styles */
        .kw-control-box label {
            display: flex;
            align-items: center;
            /* height: 100%; */ /* Removed fixed height for labels inside scrolling content */
            margin-bottom: 6px; cursor: pointer; padding: 3px 5px;
            border-radius: 3px; transition: background-color 0.2s ease;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9em;
        }
        .kw-control-box label:hover { background-color: #484848; }
        .kw-control-box input[type="checkbox"] { margin-right: 6px; vertical-align: middle; transform: scale(0.85); }

        /* Specific ID for filter box */
        #${CONTROL_BOX_ID} { /* Inherits .kw-control-box styles */ }

        /* Specific ID and styles for audio alert box */
        #${AUDIO_ALERT_BOX_ID} { /* Inherits .kw-control-box styles */ }
        #${AUDIO_ALERT_BOX_ID} .kw-filter-content {
            max-height: 300px; /* Potentially shorter list */
        }
        #${AUDIO_ALERT_BOX_ID} .kw-italic-placeholder {
             font-style: italic;
             color: #888;
             padding: 5px;
             height: auto; /* Override label height */
             display: block; /* Override label display */
        }
        #${AUDIO_ALERT_BOX_ID} .kw-filter-content li { height: auto; } /* Override li height if needed */
        #${AUDIO_ALERT_BOX_ID} .kw-filter-content label { height: auto; } /* Override label height */


        /* Apply non-collapsible style */
        #${MASTER_AUDIO_BOX_ID}, #${SIXFOLD_AUDIO_BOX_ID} { /* Updated ID */
             /* Inherits .kw-control-box styles like border, bg, width, etc. */
             /* Apply non-collapsible fixed height and centering */
             max-height: ${COLLAPSED_BOX_HEIGHT} !important;
             height: ${COLLAPSED_BOX_HEIGHT} !important;
             padding: 0 10px !important; /* Adjusted padding */
             display: flex !important;
             align-items: center !important;
             overflow: hidden; /* Ensure content doesn't overflow fixed height */
        }
         #${MASTER_AUDIO_BOX_ID} label, #${SIXFOLD_AUDIO_BOX_ID} label { /* Updated ID */
             margin-bottom: 0 !important;
             padding: 0 5px !important;
             height: auto !important; /* Let height be natural */
             flex-grow: 1; /* Allow label to take space */
         }


        /* Highlighted Targets Styling - Uses CSS Variables */
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
    /**
     * Loads filter state from GM storage, ensuring lowercase keys.
     * Defaults to all true if no state found.
     */
    async function loadFilters() {
        const savedState = await GM_getValue(STORAGE_KEY_FILTERS, null);
        let newState = {};
        if (savedState && typeof savedState === 'object') {
            WIKI_TARGET_LIST_LC.forEach(lcTarget => {
                let foundValue = true; // Default if not found
                for (const savedKey in savedState) {
                    if (savedKey.toLowerCase() === lcTarget) {
                        foundValue = savedState[savedKey];
                        break;
                    }
                }
                 newState[lcTarget] = foundValue;
            });
        } else {
            console.log(`${SCRIPT_PREFIX}: No saved filters found. Defaulting all to checked.`);
            WIKI_TARGET_LIST_LC.forEach(lcTarget => newState[lcTarget] = true);
        }
        filterState = newState;
        await saveFilters(); // Save potentially migrated/defaulted state
    }

    /**
     * Saves the current filter state (with lowercase keys) to GM storage.
     */
    async function saveFilters() {
        await GM_setValue(STORAGE_KEY_FILTERS, filterState);
    }

    /**
     * Loads the collapsed state of the filter box. Defaults to false (expanded).
     * @returns {Promise<boolean>} True if collapsed, false otherwise.
     */
    async function loadCollapsedState() {
        return await GM_getValue(STORAGE_KEY_COLLAPSED, false); // Default to expanded (false)
    }

    /**
     * Saves the collapsed state of the filter box.
     * @param {boolean} isCollapsed - True if the box is collapsed.
     */
    async function saveCollapsedState(isCollapsed) {
        await GM_setValue(STORAGE_KEY_COLLAPSED, isCollapsed);
    }

    /**
     * Loads the audio alert state from GM storage. Defaults to all false.
     */
    async function loadAudioAlertState() {
        const savedState = await GM_getValue(STORAGE_KEY_AUDIO_ALERTS, null);
        let newState = {};
        if (savedState && typeof savedState === 'object') {
            // Load saved state, ensuring keys are lowercase
            WIKI_TARGET_LIST_LC.forEach(lcTarget => {
                let foundValue = false; // Default to false (off)
                for (const savedKey in savedState) {
                    if (savedKey.toLowerCase() === lcTarget) {
                        foundValue = savedState[savedKey];
                        break;
                    }
                }
                newState[lcTarget] = foundValue;
            });
        } else {
            // Default all to false if nothing saved
            WIKI_TARGET_LIST_LC.forEach(lcTarget => newState[lcTarget] = false);
        }
        audioAlertState = newState;
        // No need to save defaults immediately unless required
    }

    /**
     * Saves the current audio alert state to GM storage.
     */
    async function saveAudioAlertState() {
        await GM_setValue(STORAGE_KEY_AUDIO_ALERTS, audioAlertState);
    }

     /**
     * Loads the collapsed state of the audio alert box. Defaults to true (collapsed).
     * @returns {Promise<boolean>} True if collapsed, false otherwise.
     */
    async function loadAudioCollapsedState() {
        return await GM_getValue(STORAGE_KEY_AUDIO_COLLAPSED, true); // Default to collapsed (true)
    }

    /**
     * Saves the collapsed state of the audio alert box.
     * @param {boolean} isCollapsed - True if the box is collapsed.
     */
    async function saveAudioCollapsedState(isCollapsed) {
        await GM_setValue(STORAGE_KEY_AUDIO_COLLAPSED, isCollapsed);
    }

    /**
     * Loads the sixfold audio state from GM storage. Defaults to false.
     */
    async function loadSixfoldAudioState() {
        sixfoldAudioEnabled = await GM_getValue(STORAGE_KEY_SIXFOLD_AUDIO, false); // Default to false
    }

    /**
     * Saves the current sixfold audio state to GM storage.
     */
    async function saveSixfoldAudioState() {
        await GM_setValue(STORAGE_KEY_SIXFOLD_AUDIO, sixfoldAudioEnabled);
    }


    // --- UI Creation ---
    /**
     * Creates the filter control box element or returns it if it already exists.
     * Applies the saved collapsed state.
     * @returns {Promise<HTMLElement|null>} The control box element or null if creation fails.
     */
    async function createControlBox() {
        if (document.getElementById(CONTROL_BOX_ID)) {
            controlBoxElement = document.getElementById(CONTROL_BOX_ID);
            updateControlBoxCheckboxes(); // Update checkboxes with current filter state
            const isCollapsed = await loadCollapsedState();
            controlBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
            const indicator = controlBoxElement.querySelector('.kw-collapse-indicator');
            if (indicator) indicator.textContent = isCollapsed ? '►' : '▼';
            attachHeaderListener(controlBoxElement, saveCollapsedState); // Ensure listener is attached
            return controlBoxElement;
        }

        console.log(`${SCRIPT_PREFIX}: Creating filter control box UI.`);
        controlBoxElement = document.createElement('div');
        controlBoxElement.id = CONTROL_BOX_ID;
        controlBoxElement.className = 'kw-control-box'; // Use shared class

        // Header
        const header = document.createElement('div');
        header.className = 'kw-filter-header';
        const indicatorSpan = document.createElement('span');
        indicatorSpan.className = 'kw-collapse-indicator';
        header.innerHTML = `<h5>Filter Targets</h5>`;
        header.appendChild(indicatorSpan);

        // Content (Checkboxes)
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
            checkbox.addEventListener('change', async (event) => { // Make async
                filterState[event.target.value] = event.target.checked;
                await saveFilters(); // Wait for save
                processTargets(); // Trigger processing immediately on filter change
                updateAudioAlertList(); // Update audio list when filter changes
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${target}`)); // Display original case
            content.appendChild(label);
        });

        controlBoxElement.appendChild(header);
        controlBoxElement.appendChild(content);

        // Apply initial collapse state
        const isCollapsed = await loadCollapsedState();
        controlBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
        indicatorSpan.textContent = isCollapsed ? '►' : '▼'; // Set initial indicator text

        attachHeaderListener(controlBoxElement, saveCollapsedState); // Attach listener after elements are created
        return controlBoxElement;
    }

    /**
     * Creates the audio alert control box element or returns it if it already exists.
     * Applies the saved collapsed state.
     * @returns {Promise<HTMLElement|null>} The audio alert box element or null if creation fails.
     */
    async function createAudioAlertBox() {
        if (document.getElementById(AUDIO_ALERT_BOX_ID)) {
            audioAlertBoxElement = document.getElementById(AUDIO_ALERT_BOX_ID);
            await updateAudioAlertList(); // Update content based on current filter/audio state
            const isCollapsed = await loadAudioCollapsedState();
            audioAlertBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
            const indicator = audioAlertBoxElement.querySelector('.kw-collapse-indicator');
            if (indicator) indicator.textContent = isCollapsed ? '►' : '▼';
            attachHeaderListener(audioAlertBoxElement, saveAudioCollapsedState); // Ensure listener is attached
            return audioAlertBoxElement;
        }

        console.log(`${SCRIPT_PREFIX}: Creating audio alert control box UI.`);
        audioAlertBoxElement = document.createElement('div');
        audioAlertBoxElement.id = AUDIO_ALERT_BOX_ID;
        audioAlertBoxElement.className = 'kw-control-box'; // Use shared class

        // Header
        const header = document.createElement('div');
        header.className = 'kw-filter-header';
        const indicatorSpan = document.createElement('span');
        indicatorSpan.className = 'kw-collapse-indicator';
        header.innerHTML = `<h5>Audio Alert</h5>`;
        header.appendChild(indicatorSpan);

        // Content (Checkboxes for filtered items)
        const content = document.createElement('div');
        content.className = 'kw-filter-content';
        content.innerHTML = `<ul id="kw-audio-alert-list" style="list-style: none; padding: 0; margin: 0;"></ul>`; // Add UL container

        audioAlertBoxElement.appendChild(header);
        audioAlertBoxElement.appendChild(content);

        // Apply initial collapse state
        const isCollapsed = await loadAudioCollapsedState();
        audioAlertBoxElement.classList.toggle(COLLAPSED_CLASS, isCollapsed);
        indicatorSpan.textContent = isCollapsed ? '►' : '▼';

        attachHeaderListener(audioAlertBoxElement, saveAudioCollapsedState); // Attach listener

        // Initial population of the list
        await updateAudioAlertList();

        return audioAlertBoxElement;
    }

    /**
     * Updates the 'Audio Alert' list based on the *active* filters.
     */
    async function updateAudioAlertList() {
        if (!audioAlertBoxElement) {
             return;
        }
        const listElement = audioAlertBoxElement.querySelector('#kw-audio-alert-list');
        if (!listElement) {
             return;
        }

        listElement.innerHTML = ''; // Clear existing list
        let hasActiveFilters = false;

        // Use original casing list for display, lowercase for keys
        const sortedTargets = [...WIKI_TARGET_LIST].sort((a, b) => a.localeCompare(b));

        sortedTargets.forEach(target => {
            const lcTarget = target.toLowerCase();
            // Only add victims that are CHECKED in the main filter list
            if (filterState[lcTarget]) {
                hasActiveFilters = true;
                const li = document.createElement('li');
                const label = document.createElement('label');
                label.title = `Enable audio alert for ${target}`;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                const checkboxId = `kw-audio-alert-${lcTarget}`; // Unique ID
                checkbox.id = checkboxId;
                checkbox.value = lcTarget;
                // Set checked based on loaded/saved audio alert state
                checkbox.checked = audioAlertState[lcTarget] || false;
                checkbox.addEventListener('change', handleAudioAlertChange); // Add event listener

                label.htmlFor = checkboxId;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${target}`)); // Display original case

                li.appendChild(label);
                listElement.appendChild(li);
            }
        });

         if (!hasActiveFilters) {
             listElement.innerHTML = '<li class="kw-italic-placeholder">No targets filtered.</li>';
         }
    }

    /**
     * Creates the master audio control box.
     * @returns {HTMLElement|null} The master audio box element or null if creation fails.
     */
    function createMasterAudioBox() {
        if (document.getElementById(MASTER_AUDIO_BOX_ID)) {
            masterAudioBoxElement = document.getElementById(MASTER_AUDIO_BOX_ID);
            // Update checkbox state (although it defaults to false on load)
            const checkbox = masterAudioBoxElement.querySelector(`#${MASTER_AUDIO_CHECKBOX_ID}`);
            if (checkbox) checkbox.checked = masterAudioEnabled;
            attachMasterAudioListener(); // Ensure listener attached
            return masterAudioBoxElement;
        }

        console.log(`${SCRIPT_PREFIX}: Creating master audio control box UI.`);
        masterAudioBoxElement = document.createElement('div');
        masterAudioBoxElement.id = MASTER_AUDIO_BOX_ID;
        masterAudioBoxElement.className = 'kw-control-box'; // Base style

        const label = document.createElement('label');
        label.htmlFor = MASTER_AUDIO_CHECKBOX_ID;
        label.title = "Enable/Disable all audio alerts for this session";

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = MASTER_AUDIO_CHECKBOX_ID;
        checkbox.checked = masterAudioEnabled; // Should be false initially

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' Enable Audio'));

        masterAudioBoxElement.appendChild(label);

        attachMasterAudioListener(); // Attach listener

        return masterAudioBoxElement;
    }

    /** Attaches listener to the master audio checkbox */
    function attachMasterAudioListener() {
        if (!masterAudioBoxElement) return;
        const checkbox = masterAudioBoxElement.querySelector(`#${MASTER_AUDIO_CHECKBOX_ID}`);
        if (checkbox && !checkbox.dataset.listenerAttached) {
            checkbox.addEventListener('change', handleMasterAudioChange);
            checkbox.dataset.listenerAttached = 'true';
        }
    }

    /**
     * Creates the sixfold audio control box.
     * @returns {HTMLElement|null} The sixfold audio box element or null if creation fails.
     */
    function createSixfoldAudioBox() { // Renamed function
        if (document.getElementById(SIXFOLD_AUDIO_BOX_ID)) {
            sixfoldAudioBoxElement = document.getElementById(SIXFOLD_AUDIO_BOX_ID);
            // Update checkbox state from loaded value
            const checkbox = sixfoldAudioBoxElement.querySelector(`#${SIXFOLD_AUDIO_CHECKBOX_ID}`);
            if (checkbox) checkbox.checked = sixfoldAudioEnabled;
            attachSixfoldAudioListener(); // Ensure listener attached
            return sixfoldAudioBoxElement;
        }

        console.log(`${SCRIPT_PREFIX}: Creating 6x audio control box UI.`); // Updated log
        sixfoldAudioBoxElement = document.createElement('div');
        sixfoldAudioBoxElement.id = SIXFOLD_AUDIO_BOX_ID; // Updated ID
        sixfoldAudioBoxElement.className = 'kw-control-box'; // Base style

        const label = document.createElement('label');
        label.htmlFor = SIXFOLD_AUDIO_CHECKBOX_ID; // Updated ID
        label.title = "Play audio alert 6 times instead of once"; // Updated title

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = SIXFOLD_AUDIO_CHECKBOX_ID; // Updated ID
        checkbox.checked = sixfoldAudioEnabled; // Use loaded state

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' 6x Audio')); // Updated text

        sixfoldAudioBoxElement.appendChild(label);

        attachSixfoldAudioListener(); // Attach listener

        return sixfoldAudioBoxElement;
    }

    /** Attaches listener to the sixfold audio checkbox */
    function attachSixfoldAudioListener() { // Renamed function
        if (!sixfoldAudioBoxElement) return;
        const checkbox = sixfoldAudioBoxElement.querySelector(`#${SIXFOLD_AUDIO_CHECKBOX_ID}`);
        if (checkbox && !checkbox.dataset.listenerAttached) {
            checkbox.addEventListener('change', handleSixfoldAudioChange); // Renamed handler
            checkbox.dataset.listenerAttached = 'true';
        }
    }


    /**
     * Attaches the click listener to a collapsible control box header.
     * @param {HTMLElement} boxElement - The control box element (filter or audio).
     * @param {Function} saveStateFunction - The function to call to save the collapsed state.
     */
    function attachHeaderListener(boxElement, saveStateFunction) {
         if (!boxElement || !boxElement.classList.contains('kw-control-box')) return; // Ensure it's a control box
         const header = boxElement.querySelector('.kw-filter-header');
         if (!header) return; // Only attach to boxes with headers (i.e., collapsible ones)

         // Check if listener already attached to prevent duplicates
         if (!header.dataset.listenerAttached) {
             header.addEventListener('click', () => {
                 // Removed startTone() call from here
                 const isNowCollapsed = boxElement.classList.toggle(COLLAPSED_CLASS);
                 const indicator = header.querySelector('.kw-collapse-indicator');
                 if (indicator) {
                     indicator.textContent = isNowCollapsed ? '►' : '▼';
                 }
                 saveStateFunction(isNowCollapsed); // Save the new state using the provided function
             });
             header.dataset.listenerAttached = 'true'; // Mark listener as attached
         }
    }

    // --- Time & Color Utilities ---
    /**
     * Parses a time string (e.g., "1m 5s", "30s", "0s") into seconds.
     * @param {string} timeString - The time string from the target element.
     * @returns {number|null} Total seconds, or null if parsing fails.
     */
    function parseTimeToSeconds(timeString) {
        if (!timeString || typeof timeString !== 'string') return null;
        timeString = timeString.trim().toLowerCase();
        if (timeString === '0s' || timeString === '') return 0;

        let totalSeconds = 0;
        const minuteMatch = timeString.match(/(\d+)\s*m/);
        const secondMatch = timeString.match(/(\d+)\s*s/);

        if (minuteMatch) { totalSeconds += parseInt(minuteMatch[1], 10) * 60; }
        if (secondMatch) { totalSeconds += parseInt(secondMatch[1], 10); }
        else if (!minuteMatch && /^\d+$/.test(timeString)) { totalSeconds = parseInt(timeString, 10); } // Handle plain number as seconds
        else if (!secondMatch && timeString === 's') { return 0; } // Handle "s" alone
        else if (!minuteMatch && !secondMatch) { return null; } // Invalid format

        return totalSeconds;
    }

    /**
     * Gets the remaining time in seconds for a target item element.
     * @param {HTMLElement} itemElement - The target item element (div[class*="virtualItem"]).
     * @returns {number|null} Remaining seconds, 0 if hidden/expired, null if not found.
     */
    function getTargetTimeRemaining(itemElement) {
        const activityDiv = itemElement.querySelector(SEL_ACTIVITY_DIV);
        const clockElement = activityDiv ? activityDiv.querySelector(SEL_TIMER_CLOCK) : null;
        // Check if clock element exists and is not hidden
        if (!clockElement || clockElement.classList.contains('hidden___UI9Im') || clockElement.textContent === '') {
            return 0; // Treat hidden or empty clock as 0 seconds
        }
        return parseTimeToSeconds(clockElement.textContent);
    }

    /**
     * Linearly interpolates between two RGB colors.
     * @param {{r: number, g: number, b: number}} color1 - Start color.
     * @param {{r: number, g: number, b: number}} color2 - End color.
     * @param {number} factor - Interpolation factor (0.0 to 1.0).
     * @returns {{r: number, g: number, b: number}} Interpolated color.
     */
    function interpolateColor(color1, color2, factor) {
        factor = Math.max(0, Math.min(1, factor)); // Clamp factor
        const r = Math.round(color1.r + factor * (color2.r - color1.r));
        const g = Math.round(color1.g + factor * (color2.g - color1.g));
        const b = Math.round(color1.b + factor * (color2.b - color1.b));
        return { r, g, b };
    }

    // --- Audio Handling Functions ---
    /**
     * Initializes the Tone.js audio context if not already started.
     * Should be called upon user interaction (checking the master audio box).
     */
    async function startTone() {
        const ToneRef = typeof Tone !== 'undefined' ? Tone : unsafeWindow.Tone;
        if (!ToneRef) {
            console.error(`${SCRIPT_PREFIX}: Tone.js not found! Audio alerts disabled.`);
            return;
        }
        if (!toneStarted) {
            try {
                await ToneRef.start();
                console.log(`${SCRIPT_PREFIX}: Audio context started via user interaction.`);
                synth = new ToneRef.Synth().toDestination();
                toneStarted = true;
            } catch (err) {
                console.error(`${SCRIPT_PREFIX}: Error starting Tone.js:`, err);
                toneStarted = false; // Ensure it's false if start failed
            }
        }
    }

    /**
     * Plays a simple alert sound using Tone.js, if master audio is enabled.
     * Plays 6 times if sixfold audio is enabled.
     */
    function playAlertSound() {
        // Check master switch first
        if (!masterAudioEnabled) {
            return;
        }

        if (!toneStarted || !synth) {
            console.warn(`${SCRIPT_PREFIX}: Tone.js not initialized or synth not ready. Cannot play sound.`);
            return; // Don't play if not ready
        }
        try {
            const now = Tone.now();
            // ***** ADDED/MODIFIED START (v2.9.9 - Renamed 3x -> 6x) *****
            if (sixfoldAudioEnabled) { // Check renamed flag
                // Play 6 times with delay
                for (let i = 0; i < 6; i++) { // Loop 6 times
                    synth.triggerAttackRelease("A4", "8n", now + i * MULTIPLE_AUDIO_DELAY);
                }
            } else {
                // Play once
                synth.triggerAttackRelease("A4", "8n", now);
            }
            // ***** ADDED/MODIFIED END (v2.9.9 - Renamed 3x -> 6x) *****
        } catch (error) {
            console.error(`${SCRIPT_PREFIX}: Error playing sound:`, error);
        }
    }

    /**
     * Handles changes in the specific audio alert checkboxes.
     */
    async function handleAudioAlertChange(event) {
        // Note: We no longer call startTone() here. It's handled by the master checkbox.
        const lcTarget = event.target.value; // Value is lowercase target name
        const isChecked = event.target.checked;
        audioAlertState[lcTarget] = isChecked;
        await saveAudioAlertState(); // Save the change
    }

    /**
     * Handles changes in the master audio enable checkbox.
     */
    async function handleMasterAudioChange(event) {
        const isChecked = event.target.checked;
        masterAudioEnabled = isChecked;
        console.log(`${SCRIPT_PREFIX}: Master audio ${masterAudioEnabled ? 'enabled' : 'disabled'}.`);

        if (masterAudioEnabled && !toneStarted) {
            // If enabling audio and context isn't started, start it now.
            console.log(`${SCRIPT_PREFIX}: Master audio checked, attempting to start Tone.js...`);
            await startTone();
        }
        // No need to explicitly stop Tone.js when unchecked, playAlertSound checks the flag.
    }

     // ***** ADDED/MODIFIED START (v2.9.9 - Renamed 3x -> 6x) *****
    /**
     * Handles changes in the sixfold audio enable checkbox.
     */
    async function handleSixfoldAudioChange(event) { // Renamed handler
        sixfoldAudioEnabled = event.target.checked;
        console.log(`${SCRIPT_PREFIX}: 6x audio ${sixfoldAudioEnabled ? 'enabled' : 'disabled'}.`);
        await saveSixfoldAudioState(); // Renamed save function
    }
    // ***** ADDED/MODIFIED END (v2.9.9 - Renamed 3x -> 6x) *****


    // --- Core Logic: Highlight, Disable, Color Update ---
    /**
     * Extracts the target type (e.g., "Businessman") from a target item element.
     * @param {HTMLElement} targetElement - The target item element.
     * @returns {string|null} The target type string or null.
     */
    function getTargetTypeFromElement(targetElement) {
        const mainSection = targetElement.querySelector(SEL_TARGET_MAIN_SECTION);
        const titleProps = mainSection ? mainSection.querySelector(SEL_TARGET_TITLE_PROPS) : null;
        const titleDiv = titleProps ? titleProps.querySelector(SEL_TARGET_TYPE_DIV) : null;
        return titleDiv ? titleDiv.textContent.trim() : null;
    }

    let processTimeout = null;
    /**
     * Debounced function to process all visible targets, applying highlight/filter classes and disabling buttons.
     */
    function processTargets() {
        clearTimeout(processTimeout);
        processTimeout = setTimeout(_processTargetsInternal, 50); // Short debounce
    }

    /**
     * Internal function to process targets. Applies classes based on filter and locked state.
     */
    function _processTargetsInternal() {
        if (!targetListContainer || !isInitialized) return;

        const items = Array.from(targetListContainer.querySelectorAll(`:scope > ${SEL_TARGET_ITEM}`));
        if (items.length === 0 && targetListContainer.children.length === 0) return;

        let needsColorUpdate = false; // Flag if any item newly highlighted

        items.forEach((item) => {
             const crimeOptionWrapper = item.querySelector(SEL_TARGET_ITEM_WRAPPER);
             if (!crimeOptionWrapper) return; // Skip placeholders

             const crimeOptionDiv = crimeOptionWrapper.querySelector(`:scope > ${SEL_TARGET_OPTION_DIV}`);
             if (!crimeOptionDiv) return;

            const targetType = getTargetTypeFromElement(item);
            const lcTargetType = targetType ? targetType.toLowerCase() : null;

            // Determine if item should be highlighted
            const isLocked = crimeOptionDiv.matches(SEL_LOCKED_ITEM_MARKER); // Check if Torn marked it locked
            const matchesFilter = lcTargetType && filterState[lcTargetType] === true;
            const shouldHighlight = matchesFilter && !isLocked; // Highlight ONLY if matches filter AND is NOT locked

            // Apply/Remove classes
            const hadHighlight = item.classList.contains(HIGHLIGHT_CLASS);
            item.classList.toggle(HIGHLIGHT_CLASS, shouldHighlight);
            item.classList.toggle(FILTERED_OUT_CLASS, !shouldHighlight);

            if (shouldHighlight && !hadHighlight) {
                needsColorUpdate = true; // Need to set initial color

                // Play sound ONLY when target becomes highlighted and audio alert is enabled
                if (lcTargetType && audioAlertState[lcTargetType]) {
                    // playAlertSound function now checks masterAudioEnabled and toneStarted internally
                    playAlertSound();
                }
            }

             // Disable Button
             const button = item.querySelector(SEL_COMMIT_BUTTON);
             if (button) {
                 button.disabled = !shouldHighlight; // Disable if filtered out OR locked
             }

              // Clear styles if NOT highlighted (handles filter changes and locking)
              if (!shouldHighlight) {
                   clearHighlightStyles(crimeOptionDiv);
              }
        });

        // Update colors immediately if any item was newly highlighted
        if (needsColorUpdate) {
            updateHighlightColors();
        }
    }

    /**
     * Updates the highlight color of currently highlighted items based on their timers.
     * Also removes highlight if item becomes locked. Runs periodically.
     */
    function updateHighlightColors() {
        if (!isInitialized) return;

        const highlightedItems = document.querySelectorAll(`${SEL_TARGET_LIST_CONTAINER} > ${SEL_TARGET_ITEM}.${HIGHLIGHT_CLASS}`);

        highlightedItems.forEach(item => {
            const crimeOptionDiv = item.querySelector(`${SEL_TARGET_ITEM_WRAPPER} > ${SEL_TARGET_OPTION_DIV}`);
            if (!crimeOptionDiv) return;

            // --- Check if item became locked ---
            const isLocked = crimeOptionDiv.matches(SEL_LOCKED_ITEM_MARKER);
            const time = getTargetTimeRemaining(item); // Still get time for color logic if not locked

            if (isLocked || time === null) {
                // Remove highlight immediately if locked or time is invalid
                item.classList.remove(HIGHLIGHT_CLASS);
                item.classList.remove(FILTERED_OUT_CLASS); // Ensure filter class is also removed
                clearHighlightStyles(crimeOptionDiv);
                const button = item.querySelector(SEL_COMMIT_BUTTON);
                if (button) button.disabled = true; // Ensure button is disabled when locked
                return; // Stop processing this item
            }
            // --- End lock check ---

            // If not locked and time is valid, proceed with color setting
            let colorStart, colorEnd, borderColor, shadowColor;

            if (time <= 0) {
                // Time is 0 or less, set final RED color.
                colorStart = COLOR_RED; colorEnd = COLOR_RED;
                borderColor = COLOR_RED; shadowColor = COLOR_RED;
            } else if (time > URGENCY_THRESHOLD) {
                // Green for > 10 seconds
                colorStart = COLOR_GREEN; colorEnd = COLOR_GREEN;
                borderColor = COLOR_GREEN; shadowColor = COLOR_GREEN;
            } else {
                // Interpolate Orange -> Red for <= 10 seconds
                const factor = Math.min(1, Math.max(0, (URGENCY_THRESHOLD - time) / URGENCY_THRESHOLD));
                const interpolated = interpolateColor(COLOR_ORANGE, COLOR_RED, factor);
                colorStart = interpolated; colorEnd = interpolated;
                borderColor = interpolated; shadowColor = interpolated;
            }

            // Set CSS Variables for styling
            setHighlightStyles(crimeOptionDiv, colorStart, colorEnd, borderColor, shadowColor);
        });
    }

    /** Helper to set CSS Variables for highlight colors */
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

    /** Helper to clear CSS Variables */
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


    // --- Initialization and Observation ---
    /** Stop observing the crime list container */
    function stopCrimeListObserver() {
         if (crimeListObserver) {
             crimeListObserver.disconnect();
             crimeListObserver = null;
         }
    }

    /** Start observing the crime list container for item changes */
    function startCrimeListObserver() {
        if (crimeListObserver || !targetListContainer) return;
        crimeListObserver = new MutationObserver((mutationsList) => {
            let relevantChange = mutationsList.some(mutation =>
                mutation.type === 'childList' &&
                [...mutation.addedNodes, ...mutation.removedNodes].some(node =>
                    node.nodeType === 1 && node.matches(SEL_TARGET_ITEM)
                )
            );
            if (relevantChange) processTargets(); // Re-run checks when list items change
        });
        crimeListObserver.observe(targetListContainer, { childList: true });
    }

    /** Initialize the script, find elements, set up UI and observers */
    async function initializeScript(retryCount = 0) {
        const MAX_RETRIES = 30; const RETRY_DELAY = 300;
        if (retryCount === 0) { isInitializing = true; }

        stopCrimeListObserver(); // Stop previous observers first
        if(highlightUpdateIntervalId) clearInterval(highlightUpdateIntervalId); // Clear previous interval

        // Find elements using robust selectors
        crimeRootElement = document.querySelector(SEL_CRIME_ROOT);
        const crimeContentContainer = crimeRootElement ? crimeRootElement.querySelector(SEL_CURRENT_CRIME_CONTAINER) : null;
        targetListContainer = crimeContentContainer ? crimeContentContainer.querySelector(SEL_TARGET_LIST_CONTAINER) : null;

        // Check if core elements are found
        if (!crimeRootElement || !crimeContentContainer || !targetListContainer) {
            if (retryCount < MAX_RETRIES) {
                if (retryCount % 5 === 0) { console.log(`${SCRIPT_PREFIX}: Core elements not found, retrying...`); }
                setTimeout(() => initializeScript(retryCount + 1), RETRY_DELAY);
            } else { console.error(`${SCRIPT_PREFIX}: Initialization FAILED after ${MAX_RETRIES} retries. Could not find core elements.`); isInitialized = false; isInitializing = false; }
            return;
        }

        console.log(`${SCRIPT_PREFIX}: Core containers found. Proceeding with setup.`);
        await loadFilters(); // Load filters first
        await loadAudioAlertState(); // Load audio alert state
        // ***** ADDED/MODIFIED START (v2.9.9 - Renamed 3x -> 6x) *****
        await loadSixfoldAudioState(); // Load sixfold audio state
        // ***** ADDED/MODIFIED END (v2.9.9 - Renamed 3x -> 6x) *****

        // Create or update the control boxes UI
        const filterBox = await createControlBox();
        const audioBox = await createAudioAlertBox();
        const masterAudioBox = createMasterAudioBox();
        // ***** ADDED/MODIFIED START (v2.9.9 - Renamed 3x -> 6x) *****
        const sixfoldAudioBox = createSixfoldAudioBox(); // Renamed create function
        // ***** ADDED/MODIFIED END (v2.9.9 - Renamed 3x -> 6x) *****

        if (filterBox && audioBox && masterAudioBox && sixfoldAudioBox && crimeRootElement && crimeRootElement.parentNode) { // Added sixfoldAudioBox check
             // Create a wrapper for the control boxes if it doesn't exist
             let controlsWrapper = document.getElementById('kw-control-boxes-wrapper'); // Check document globally first
             if (!controlsWrapper) {
                 controlsWrapper = document.createElement('div');
                 controlsWrapper.id = 'kw-control-boxes-wrapper';
                 // Insert the wrapper *before* the crimeRootElement
                 crimeRootElement.parentNode.insertBefore(controlsWrapper, crimeRootElement);
                 console.log(`${SCRIPT_PREFIX}: Control boxes wrapper injected.`);
             }

             // Append the boxes to the wrapper if they aren't already there
             if (!controlsWrapper.contains(filterBox)) {
                 controlsWrapper.appendChild(filterBox);
                 console.log(`${SCRIPT_PREFIX}: Filter box appended to wrapper.`);
             }
             if (!controlsWrapper.contains(audioBox)) {
                 controlsWrapper.appendChild(audioBox);
                 console.log(`${SCRIPT_PREFIX}: Audio alert box appended to wrapper.`);
             }
             if (!controlsWrapper.contains(masterAudioBox)) {
                 controlsWrapper.appendChild(masterAudioBox);
                 console.log(`${SCRIPT_PREFIX}: Master audio box appended to wrapper.`);
             }
             // ***** ADDED/MODIFIED START (v2.9.9 - Renamed 3x -> 6x) *****
             if (!controlsWrapper.contains(sixfoldAudioBox)) {
                 controlsWrapper.appendChild(sixfoldAudioBox);
                 console.log(`${SCRIPT_PREFIX}: 6x audio box appended to wrapper.`); // Updated log
             }
             // ***** ADDED/MODIFIED END (v2.9.9 - Renamed 3x -> 6x) *****

             isInitialized = true; isInitializing = false; // Mark initialization complete
        } else {
             console.error(`${SCRIPT_PREFIX}: Failed to create or inject control boxes. FilterBox valid: ${!!filterBox}, AudioBox valid: ${!!audioBox}, MasterAudioBox valid: ${!!masterAudioBox}, SixfoldAudioBox valid: ${!!sixfoldAudioBox}, CrimeRoot valid: ${!!crimeRootElement}, CrimeRoot Parent valid: ${!!crimeRootElement?.parentNode}`); // Updated check
             isInitialized = false; isInitializing = false; return; // Stop if UI fails
        }

        processTargets(); // Initial apply of classes/styles
        startCrimeListObserver(); // Start observing list changes
        highlightUpdateIntervalId = setInterval(updateHighlightColors, 1000); // Start color updates (check every second)
        console.log(`${SCRIPT_PREFIX}: Highlight color update interval started.`);
    }

     /** Updates the check state of checkboxes in the filter control box */
     function updateControlBoxCheckboxes() {
         if (!controlBoxElement) controlBoxElement = document.getElementById(CONTROL_BOX_ID); if (!controlBoxElement) return;
         const checkboxes = controlBoxElement.querySelectorAll('input[type="checkbox"]');
         checkboxes.forEach(cb => { cb.checked = filterState[cb.value] ?? true; }); // value is lowercase
     }

    /** Cleans up intervals, observers, and removes the UI */
    function cleanupScript() {
        console.log(`${SCRIPT_PREFIX}: Cleaning up script.`);
        stopCrimeListObserver();
        if (highlightUpdateIntervalId) { clearInterval(highlightUpdateIntervalId); highlightUpdateIntervalId = null; }

        const wrapper = document.getElementById('kw-control-boxes-wrapper');
        if (wrapper) wrapper.remove(); // Remove the wrapper, taking all boxes with it

        // Reset audio state
        audioAlertState = {};
        synth = null;
        toneStarted = false;
        audioAlertBoxElement = null; // Clear reference
        masterAudioBoxElement = null; // Clear reference
        masterAudioEnabled = false; // Reset master switch
        // ***** ADDED/MODIFIED START (v2.9.9 - Renamed 3x -> 6x) *****
        sixfoldAudioBoxElement = null; // Clear reference
        sixfoldAudioEnabled = false; // Reset sixfold switch
        // ***** ADDED/MODIFIED END (v2.9.9 - Renamed 3x -> 6x) *****

        controlBoxElement = null; // Clear reference
        targetListContainer = null;
        crimeRootElement = null;
        clearTimeout(processTimeout);
        isInitialized = false;
        isInitializing = false;
    }

    // --- Run Script Logic ---
    /** Starts the observer that watches for the main crime page content */
    function startPageLoadObserver() {
        const mainContentArea = document.querySelector('#mainContainer .content-wrapper');
        if (!mainContentArea) { console.error(`${SCRIPT_PREFIX}: Cannot find observer target (#mainContainer .content-wrapper). Retrying...`); setTimeout(startPageLoadObserver, 1000); return; }

         pageLoadObserver = new MutationObserver((mutationsList) => {
             const pickpocketRoot = mainContentArea.querySelector(SEL_CRIME_ROOT);
             const isOnPickpocketing = window.location.hash === '#/pickpocketing';

             // Initialize if on correct page, root exists, and not already running/initializing
             if (isOnPickpocketing && pickpocketRoot && !isInitialized && !isInitializing) {
                 initializeScript();
             }
             // Cleanup if initialized but page changed or root disappeared
             else if (isInitialized && (!isOnPickpocketing || !pickpocketRoot)) {
                 cleanupScript();
             }
         });
         pageLoadObserver.observe(mainContentArea, { childList: true, subtree: true });
         console.log(`${SCRIPT_PREFIX}: Page load observer is now active.`);

         // Initial check in case already on the page
         setTimeout(() => {
             const pickpocketRoot = mainContentArea.querySelector(SEL_CRIME_ROOT);
             if (window.location.hash === '#/pickpocketing' && pickpocketRoot && !isInitialized && !isInitializing) {
                  console.log(`${SCRIPT_PREFIX}: Triggering init from initial check.`);
                  initializeScript();
             } else if (window.location.hash !== '#/pickpocketing' && isInitialized) {
                  console.log(`${SCRIPT_PREFIX}: Triggering cleanup from initial check (not on pickpocketing page).`);
                  cleanupScript(); // Cleanup if loaded on wrong page but script was active
             }
         }, 300);
    }

    // Start the page observer to monitor page changes
    startPageLoadObserver();

})();
