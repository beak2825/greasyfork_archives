// ==UserScript==
// @name         Settings Tab Manager (STM)
// @namespace    shared-settings-manager
// @version      1.1.4d
// @description  Provides an API for userscripts to add tabs to a site's settings menu, with improved state handling.
// @author       Gemini & User Input
// @license      MIT
// @match        https://8chan.moe/*
// @match        https://8chan.se/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const MANAGER_ID = 'SettingsTabManager';
    const log = (...args) => console.log(`[${MANAGER_ID}]`, ...args);
    const warn = (...args) => console.warn(`[${MANAGER_ID}]`, ...args);
    const error = (...args) => console.error(`[${MANAGER_ID}]`, ...args);

    const SELECTORS = Object.freeze({
        SETTINGS_MENU: '#settingsMenu',
        TAB_CONTAINER: '#settingsMenu .floatingContainer > div:first-child',
        PANEL_CONTAINER: '#settingsMenu .menuContentPanel',
        SITE_TAB: '.settingsTab',
        SITE_PANEL: '.panelContents',
        SITE_SEPARATOR: '.settingsTabSeparator',
    });
    const ACTIVE_CLASSES = Object.freeze({
        TAB: 'selectedTab',
        PANEL: 'selectedPanel',
    });
    const ATTRS = Object.freeze({
        SCRIPT_ID: 'data-stm-script-id',
        MANAGED: 'data-stm-managed',
        SEPARATOR: 'data-stm-main-separator',
        ORDER: 'data-stm-order',
    });

    // --- State ---
    let isInitialized = false;
    let settingsMenuEl = null;
    let tabContainerEl = null;
    let panelContainerEl = null;
    let activeStmTabId = null; // Renamed: Tracks the scriptId of the *STM* tab that is active
    const registeredTabs = new Map(); // Stores { scriptId: config }
    const pendingRegistrations = []; // Stores { config } for tabs registered before init
    let isSeparatorAdded = false; // Flag for single separator

    // --- Readiness Promise ---
    let resolveReadyPromise;
    const readyPromise = new Promise(resolve => { resolveReadyPromise = resolve; });

    // --- Public API Definition ---
    const publicApi = Object.freeze({
        ready: readyPromise,
        registerTab: (config) => registerTabImpl(config),
        activateTab: (scriptId) => activateTabImpl(scriptId),
        getPanelElement: (scriptId) => getPanelElementImpl(scriptId),
        getTabElement: (scriptId) => getTabElementImpl(scriptId)
    });

    // --- Styling ---
    GM_addStyle(`
        /* Ensure panels added by STM behave like native ones */
        ${SELECTORS.PANEL_CONTAINER} > div[${ATTRS.MANAGED}] {
            display: none; /* Hide inactive panels */
        }
        ${SELECTORS.PANEL_CONTAINER} > div[${ATTRS.MANAGED}].${ACTIVE_CLASSES.PANEL} {
            display: block; /* Show active panel */
        }
        /* Optional: Basic styling for the added tabs */
        ${SELECTORS.TAB_CONTAINER} > span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}] {
           cursor: pointer;
        }
        /* Styling for the single separator */
        ${SELECTORS.TAB_CONTAINER} > span[${ATTRS.SEPARATOR}] {
            cursor: default;
            margin: 0 5px; /* Add some spacing around the separator */
        }
    `);

    // --- Core Logic Implementation Functions ---

    /** Finds the essential DOM elements for the settings UI. Returns true if all found. */
    function findSettingsElements() {
        settingsMenuEl = document.querySelector(SELECTORS.SETTINGS_MENU);
        if (!settingsMenuEl) return false;

        tabContainerEl = settingsMenuEl.querySelector(SELECTORS.TAB_CONTAINER);
        panelContainerEl = settingsMenuEl.querySelector(SELECTORS.PANEL_CONTAINER);

        if (!tabContainerEl) {
            warn('Tab container not found within settings menu using selector:', SELECTORS.TAB_CONTAINER);
            return false;
        }
        if (!panelContainerEl) {
            warn('Panel container not found within settings menu using selector:', SELECTORS.PANEL_CONTAINER);
            return false;
        }
        // Ensure the elements are still in the document (relevant for re-init checks)
        if (!document.body.contains(settingsMenuEl) || !document.body.contains(tabContainerEl) || !document.body.contains(panelContainerEl)) {
             warn('Found settings elements are detached from the DOM.');
             settingsMenuEl = null;
             tabContainerEl = null;
             panelContainerEl = null;
             isSeparatorAdded = false; // Reset separator if containers are gone
             return false;
        }
        return true;
    }

    /**
     * Deactivates the STM tab specified by the scriptId.
     * Removes active classes and calls the onDeactivate callback.
     * Does NOT change activeStmTabId itself.
     * @param {string} scriptId The ID of the STM tab to deactivate visuals/callbacks for.
     */
    function _deactivateStmTabVisualsAndCallback(scriptId) {
        if (!scriptId) return; // Nothing to deactivate

        const config = registeredTabs.get(scriptId);
        // If config not found, still try to remove visuals defensively but don't warn/error.

        const tab = getTabElementImpl(scriptId);
        const panel = getPanelElementImpl(scriptId);

        if (tab) tab.classList.remove(ACTIVE_CLASSES.TAB);
        // else { log(`Tab element not found for ${scriptId} during deactivation.`); }

        if (panel) {
            panel.classList.remove(ACTIVE_CLASSES.PANEL);
            panel.style.display = 'none';
        }
        // else { log(`Panel element not found for ${scriptId} during deactivation.`); }

        // Call the script's deactivate hook only if config exists
        if (config) {
            try {
                // Pass potentially null elements if lookup failed earlier
                config.onDeactivate?.(panel, tab);
            } catch (e) {
                error(`Error during onDeactivate for ${scriptId}:`, e);
            }
        }
    }

    /**
     * Activates the STM tab specified by the scriptId.
     * Adds active classes, ensures panel display, and calls the onActivate callback.
     * Does NOT change activeStmTabId itself.
     * Does NOT deactivate other tabs (STM or native).
     * @param {string} scriptId The ID of the STM tab to activate visuals/callbacks for.
     * @returns {boolean} True if activation visuals/callback were attempted, false if elements/config not found.
     */
    function _activateStmTabVisualsAndCallback(scriptId) {
        const config = registeredTabs.get(scriptId);
        if (!config) {
            error(`Cannot activate visuals: ${scriptId}. Config not found.`);
            return false;
        }

        const tab = getTabElementImpl(scriptId);
        const panel = getPanelElementImpl(scriptId);

        if (!tab || !panel) {
            error(`Cannot activate visuals: ${scriptId}. Tab or Panel element not found.`);
            return false;
        }

        // Activate the new STM tab/panel visuals
        tab.classList.add(ACTIVE_CLASSES.TAB);
        panel.classList.add(ACTIVE_CLASSES.PANEL);
        panel.style.display = 'block';

        // Call the script's activation hook
        try {
            config.onActivate?.(panel, tab);
        } catch (e) {
            error(`Error during onActivate for ${scriptId}:`, e);
            // Activation visuals already applied, hard to revert cleanly. Error logged.
        }
        return true; // Activation attempted
    }

    /** Handles clicks within the tab container to switch tabs. */
    function handleTabClick(event) {
        const clickedTabElement = event.target.closest(SELECTORS.SITE_TAB); // Get the specific tab element clicked
        if (!clickedTabElement || !tabContainerEl || !panelContainerEl) {
            return; // Clicked outside a known tab or containers not ready
        }

        const isStmTab = clickedTabElement.matches(`span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}]`);
        const clickedStmScriptId = isStmTab ? clickedTabElement.getAttribute(ATTRS.SCRIPT_ID) : null;

        // --- Case 1: Clicked an STM Tab ---
        if (isStmTab && clickedStmScriptId) {
            event.stopPropagation(); // Prevent site handler interference

            if (clickedStmScriptId === activeStmTabId) {
                // log(`Clicked already active STM tab: ${clickedStmScriptId}`);
                return; // Already active, do nothing
            }

            // --- Deactivate previous tab (if any) ---
            const previousActiveStmId = activeStmTabId; // Store the ID before changing state
            if (previousActiveStmId) {
                // Deactivate the previously active *STM* tab
                _deactivateStmTabVisualsAndCallback(previousActiveStmId);
            } else {
                // If no STM tab was active, ensure any *native* site tab is visually deactivated
                // This prepares for the STM tab to become the only active one.
                panelContainerEl.querySelectorAll(`:scope > ${SELECTORS.SITE_PANEL}.${ACTIVE_CLASSES.PANEL}:not([${ATTRS.MANAGED}])`)
                    .forEach(p => p.classList.remove(ACTIVE_CLASSES.PANEL));
                tabContainerEl.querySelectorAll(`:scope > ${SELECTORS.SITE_TAB}.${ACTIVE_CLASSES.TAB}:not([${ATTRS.MANAGED}])`)
                    .forEach(t => t.classList.remove(ACTIVE_CLASSES.TAB));
            }

            // --- Activate the clicked STM tab ---
            if (_activateStmTabVisualsAndCallback(clickedStmScriptId)) {
                activeStmTabId = clickedStmScriptId; // Update the state *after* successful activation attempt
            } else {
                // Activation failed (elements missing?), revert state if needed?
                // For now, log the error and potentially leave state inconsistent.
                activeStmTabId = null; // Or revert to previousActiveStmId? Null is safer.
            }

            return; // Handled by STM
        }

        // --- Case 2: Clicked a Native Site Tab ---
        if (!isStmTab && clickedTabElement.matches(`${SELECTORS.SITE_TAB}:not([${ATTRS.MANAGED}])`)) {
            // log(`Native site tab clicked.`);

            // If an STM tab *was* active, deactivate its visuals and clear STM's active state.
            if (activeStmTabId) {
                // log(`Deactivating current STM tab (${activeStmTabId}) due to native tab click.`);
                _deactivateStmTabVisualsAndCallback(activeStmTabId);
                activeStmTabId = null; // Clear STM state
            }

            // **Allow propagation** - Let the site's own click handler run to manage the native tab.
            // log("Allowing event propagation for native tab handler.");
            return;
        }

        // --- Case 3: Clicked the STM Separator ---
        if (clickedTabElement.matches(`span[${ATTRS.SEPARATOR}]`)) {
            event.stopPropagation(); // Do nothing, prevent site handler
            // log("Separator clicked, propagation stopped.");
            return;
        }

        // If click was somewhere else (e.g., empty space in tab container), do nothing specific.
        // log("Clicked non-tab area.");
    }

    /** Attaches the main click listener to the tab container. */
    function attachTabClickListener() {
        if (!tabContainerEl) return;
        tabContainerEl.removeEventListener('click', handleTabClick, true);
        tabContainerEl.addEventListener('click', handleTabClick, true); // Use capture phase
        log('Tab click listener attached.');
    }

    /** Helper to create the SINGLE separator span */
    function createSeparator() {
         const separator = document.createElement('span');
         separator.className = SELECTORS.SITE_SEPARATOR ? SELECTORS.SITE_SEPARATOR.substring(1) : 'settings-tab-separator-fallback';
         separator.setAttribute(ATTRS.MANAGED, 'true');
         separator.setAttribute(ATTRS.SEPARATOR, 'true');
         separator.textContent = '|';
         return separator;
     }

    /** Creates and inserts the tab and panel elements for a given script config. */
    function createTabAndPanel(config) {
        if (!tabContainerEl || !panelContainerEl) { error(`Cannot create tab/panel for ${config.scriptId}: Containers not found.`); return; }
        if (tabContainerEl.querySelector(`span[${ATTRS.SCRIPT_ID}="${config.scriptId}"]`)) { log(`Tab element already exists for ${config.scriptId}, skipping creation.`); return; }

        log(`Creating tab/panel for: ${config.scriptId}`);

        const newTab = document.createElement('span');
        newTab.className = SELECTORS.SITE_TAB.substring(1);
        newTab.textContent = config.tabTitle;
        newTab.setAttribute(ATTRS.SCRIPT_ID, config.scriptId);
        newTab.setAttribute(ATTRS.MANAGED, 'true');
        newTab.setAttribute('title', `${config.tabTitle} (Settings by ${config.scriptId})`);
        const desiredOrder = typeof config.order === 'number' ? config.order : Infinity;
        newTab.setAttribute(ATTRS.ORDER, desiredOrder);

        const newPanel = document.createElement('div');
        newPanel.className = SELECTORS.SITE_PANEL.substring(1);
        newPanel.setAttribute(ATTRS.SCRIPT_ID, config.scriptId);
        newPanel.setAttribute(ATTRS.MANAGED, 'true');
        newPanel.id = `${MANAGER_ID}-${config.scriptId}-panel`;

        // --- Insertion Logic (Single Separator & Ordered Tabs) ---
        let insertBeforeTab = null;
        const existingStmTabs = Array.from(tabContainerEl.querySelectorAll(`span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}]`));
        existingStmTabs.sort((a, b) => (parseInt(a.getAttribute(ATTRS.ORDER) || Infinity, 10)) - (parseInt(b.getAttribute(ATTRS.ORDER) || Infinity, 10)));
        for (const existingTab of existingStmTabs) {
            if (desiredOrder < (parseInt(existingTab.getAttribute(ATTRS.ORDER) || Infinity, 10))) {
                insertBeforeTab = existingTab; break;
            }
        }

        const isFirstStmTabBeingAdded = existingStmTabs.length === 0;
        let separatorInstance = null;
        if (!isSeparatorAdded && isFirstStmTabBeingAdded) {
            separatorInstance = createSeparator();
            isSeparatorAdded = true;
            log('Adding the main STM separator.');
        }

        if (insertBeforeTab) {
            if (separatorInstance) tabContainerEl.insertBefore(separatorInstance, insertBeforeTab);
            tabContainerEl.insertBefore(newTab, insertBeforeTab);
        } else {
            if (separatorInstance) tabContainerEl.appendChild(separatorInstance);
            tabContainerEl.appendChild(newTab);
        }
        // --- End Insertion Logic ---

        panelContainerEl.appendChild(newPanel);

        // --- Initialize Panel Content ---
        try {
            Promise.resolve(config.onInit(newPanel, newTab)).catch(e => {
                error(`Error during async onInit for ${config.scriptId}:`, e);
                newPanel.innerHTML = `<p style="color: red;">Error initializing settings panel for ${config.scriptId}. See console.</p>`;
            });
        } catch (e) {
            error(`Error during sync onInit for ${config.scriptId}:`, e);
            newPanel.innerHTML = `<p style="color: red;">Error initializing settings panel for ${config.scriptId}. See console.</p>`;
        }
    }

    /** Sorts and processes all pending registrations once the manager is initialized. */
    function processPendingRegistrations() {
        if (!isInitialized) return;
        log(`Processing ${pendingRegistrations.length} pending registrations...`);
        pendingRegistrations.sort((a, b) => {
             const orderA = typeof a.order === 'number' ? a.order : Infinity;
             const orderB = typeof b.order === 'number' ? b.order : Infinity;
             return orderA - orderB;
        });
        while (pendingRegistrations.length > 0) {
            const config = pendingRegistrations.shift();
            if (!registeredTabs.has(config.scriptId)) {
                registeredTabs.set(config.scriptId, config);
                createTabAndPanel(config);
            } else {
                warn(`Script ID ${config.scriptId} was already registered. Skipping pending registration.`);
            }
        }
        log('Finished processing pending registrations.');
    }

    // --- Initialization and Observation ---

    /** Main initialization routine. Finds elements, attaches listener, processes queue. */
    function initializeManager() {
        if (!findSettingsElements()) { return false; }
        if (isInitialized && settingsMenuEl && tabContainerEl && panelContainerEl) {
             attachTabClickListener(); return true;
        }
        log('Initializing Settings Tab Manager...');
        attachTabClickListener();
        isInitialized = true;
        log('Manager is ready.');
        resolveReadyPromise(publicApi);
        processPendingRegistrations();
        return true;
    }

    // --- Mutation Observer ---
    const observer = new MutationObserver((mutationsList, obs) => {
        let needsReInitCheck = false;
        if (!isInitialized && document.querySelector(SELECTORS.SETTINGS_MENU)) { needsReInitCheck = true; }
        else if (isInitialized && settingsMenuEl && !document.body.contains(settingsMenuEl)) {
            warn('Settings menu seems to have been removed from DOM.');
            isInitialized = false; settingsMenuEl = null; tabContainerEl = null; panelContainerEl = null; isSeparatorAdded = false; activeStmTabId = null;
            needsReInitCheck = true;
        }
        if (!settingsMenuEl || needsReInitCheck) {
             for (const mutation of mutationsList) {
                 if (mutation.addedNodes) {
                     for (const node of mutation.addedNodes) {
                         if (node.nodeType === Node.ELEMENT_NODE) {
                              const menu = (node.matches && node.matches(SELECTORS.SETTINGS_MENU)) ? node : (node.querySelector ? node.querySelector(SELECTORS.SETTINGS_MENU) : null);
                             if (menu) { log('Settings menu detected in DOM via MutationObserver.'); needsReInitCheck = true; break; }
                         }
                     }
                 }
                 if (needsReInitCheck) break;
             }
        }
        if (needsReInitCheck) { setTimeout(() => { if (initializeManager()) { log('Manager initialized/re-initialized successfully via MutationObserver.'); } }, 0); }
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });
    log('Mutation observer started for settings menu detection.');

    // Attempt initial initialization
    setTimeout(initializeManager, 0);


    // --- API Implementation Functions ---

    /** Public API function to register a new settings tab. */
    function registerTabImpl(config) {
        // --- Input Validation ---
        if (!config || typeof config !== 'object') { error('Registration failed: Invalid config object provided.'); return false; }
        const { scriptId, tabTitle, onInit } = config;
        if (typeof scriptId !== 'string' || !scriptId.trim()) { error('Registration failed: Invalid or missing scriptId (string).', config); return false; }
        if (typeof tabTitle !== 'string' || !tabTitle.trim()) { error('Registration failed: Invalid or missing tabTitle (string).', config); return false; }
        if (typeof onInit !== 'function') { error('Registration failed: onInit callback must be a function.', config); return false; }
        if (config.onActivate && typeof config.onActivate !== 'function') { error(`Registration for ${scriptId} failed: onActivate (if provided) must be a function.`); return false; }
        if (config.onDeactivate && typeof config.onDeactivate !== 'function') { error(`Registration for ${scriptId} failed: onDeactivate (if provided) must be a function.`); return false; }
        if (config.order !== undefined && typeof config.order !== 'number') { warn(`Registration for ${scriptId}: Invalid order value provided. Defaulting to end.`, config); delete config.order; }
        if (registeredTabs.has(scriptId) || pendingRegistrations.some(p => p.scriptId === scriptId)) { warn(`Registration failed: Script ID "${scriptId}" is already registered or pending.`); return false; }
        // --- End Validation ---

        log(`Registration accepted for: ${scriptId}`);
        const registrationData = { ...config }; // Shallow clone

        if (isInitialized) {
            registeredTabs.set(scriptId, registrationData);
            createTabAndPanel(registrationData);
        } else {
            log(`Manager not ready, queueing registration for ${scriptId}`);
            pendingRegistrations.push(registrationData);
             pendingRegistrations.sort((a, b) => { // Keep queue sorted
                 const orderA = typeof a.order === 'number' ? a.order : Infinity;
                 const orderB = typeof b.order === 'number' ? b.order : Infinity;
                 return orderA - orderB;
             });
        }
        return true; // Registration accepted
    }

    /** Public API function to programmatically activate a registered tab. */
    function activateTabImpl(scriptId) {
        // Add trace for debugging client script calls
        console.trace(`[${MANAGER_ID}] activateTabImpl called with ID: ${scriptId}`);

        if (typeof scriptId !== 'string' || !scriptId.trim()) {
            error('activateTab failed: Invalid scriptId provided.'); return;
        }
        if (!isInitialized) {
            warn(`Cannot activate tab ${scriptId} yet, manager not initialized.`); return;
        }
        if (!registeredTabs.has(scriptId)) {
            error(`activateTab failed: Script ID "${scriptId}" is not registered.`); return;
        }
        if (scriptId === activeStmTabId) {
            // log(`activateTab: Tab ${scriptId} is already active.`);
            return; // Already active, do nothing
        }

        // --- Deactivate previous tab (if any) ---
        const previousActiveStmId = activeStmTabId; // Store the ID before changing state
        if (previousActiveStmId) {
            _deactivateStmTabVisualsAndCallback(previousActiveStmId);
        } else {
            // If no STM tab was active, ensure any *native* site tab is visually deactivated
            panelContainerEl?.querySelectorAll(`:scope > ${SELECTORS.SITE_PANEL}.${ACTIVE_CLASSES.PANEL}:not([${ATTRS.MANAGED}])`).forEach(p => p.classList.remove(ACTIVE_CLASSES.PANEL));
            tabContainerEl?.querySelectorAll(`:scope > ${SELECTORS.SITE_TAB}.${ACTIVE_CLASSES.TAB}:not([${ATTRS.MANAGED}])`).forEach(t => t.classList.remove(ACTIVE_CLASSES.TAB));
        }

        // --- Activate the requested STM tab ---
        if (_activateStmTabVisualsAndCallback(scriptId)) {
            activeStmTabId = scriptId; // Update the state *after* successful activation attempt
            log(`Programmatically activated tab: ${scriptId}`);
        } else {
            // Activation failed (elements missing?)
            warn(`Programmatic activation failed for tab: ${scriptId}`);
            // Attempt to restore previous state? Or leave as is? Leave as is for now.
            // If previousActiveStmId existed, maybe try to reactivate it? Complex.
            activeStmTabId = null; // Set to null if activation fails
        }
    }

    /** Public API function to get the DOM element for a tab's panel. */
    function getPanelElementImpl(scriptId) {
        if (!isInitialized || !panelContainerEl) return null;
        if (typeof scriptId !== 'string' || !scriptId.trim()) return null;
        return panelContainerEl.querySelector(`div[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}="${scriptId}"]`);
    }

    /** Public API function to get the DOM element for a tab's clickable part. */
    function getTabElementImpl(scriptId) {
        if (!isInitialized || !tabContainerEl) return null;
        if (typeof scriptId !== 'string' || !scriptId.trim()) return null;
        return tabContainerEl.querySelector(`span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}="${scriptId}"]`);
     }

    // --- Global Exposure ---
    if (window.SettingsTabManager && window.SettingsTabManager !== publicApi) {
        warn('window.SettingsTabManager is already defined by another script or instance! Potential conflict.');
    } else if (!window.SettingsTabManager) {
        Object.defineProperty(window, 'SettingsTabManager', {
            value: publicApi,
            writable: false,
            configurable: true
        });
        log('SettingsTabManager API exposed on window.');
    }

})(); // End of IIFE