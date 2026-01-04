// ==UserScript==
// @name         8chan Settings Tab Manager (STM) [Core API]
// @namespace    nipah-scripts-8chan
// @version      1.2.0
// @description  Core API - Provides window.SettingsTabManager for other scripts to add settings tabs.
// @author       nipah, Gemini
// @license      MIT
// @match        https://8chan.moe/*
// @match        https://8chan.se/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533689/8chan%20Settings%20Tab%20Manager%20%28STM%29%20%5BCore%20API%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/533689/8chan%20Settings%20Tab%20Manager%20%28STM%29%20%5BCore%20API%5D.meta.js
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
        SITE_TAB: '.settingsTab',          // Generic class for any tab (native or STM)
        SITE_PANEL: '.panelContents',      // Generic class for any panel (native or STM)
        SITE_SEPARATOR: '.settingsTabSeparator', // Class for separators (native or STM)
    });
    const ACTIVE_CLASSES = Object.freeze({
        TAB: 'selectedTab',
        PANEL: 'selectedPanel',
    });
    const ATTRS = Object.freeze({
        SCRIPT_ID: 'data-stm-script-id', // Identifies the script managing the tab/panel
        MANAGED: 'data-stm-managed',     // Marks elements managed by STM
        SEPARATOR: 'data-stm-main-separator', // Marks the STM main separator
        ORDER: 'data-stm-order',         // Stores the desired display order for STM tabs
    });

    // --- State ---
    let isInitialized = false;
    let settingsMenuEl = null;
    let tabContainerEl = null;
    let panelContainerEl = null;
    /** @type {string | null} Tracks the scriptId of the *currently active* STM tab. Null if a native tab is active or no tab is active. */
    let activeStmTabId = null;
    /** @type {Map<string, object>} Stores registered tab configurations: { scriptId: config } */
    const registeredTabs = new Map();
    /** @type {Array<object>} Stores configurations for tabs registered before the manager is initialized. */
    const pendingRegistrations = [];
    let isSeparatorAdded = false; // Flag to ensure only one main separator is added.

    // --- Readiness Promise ---
    let resolveReadyPromise;
    /** @type {Promise<object>} A promise that resolves with the public API when the manager is ready. */
    const readyPromise = new Promise(resolve => { resolveReadyPromise = resolve; });

    // --- Public API Definition ---
    const publicApi = Object.freeze({
        /** A Promise that resolves with the API object itself once the manager is initialized and ready. */
        ready: readyPromise,
        /**
         * Registers a new settings tab.
         * @param {object} config - The configuration object for the tab.
         * @param {string} config.scriptId - A unique identifier for the script registering the tab.
         * @param {string} config.tabTitle - The text displayed on the tab.
         * @param {(panelElement: HTMLDivElement, tabElement: HTMLSpanElement) => void | Promise<void>} config.onInit - Callback function executed once when the tab and panel are first created. Receives the panel's content div and the tab span element. Can be async.
         * @param {number} [config.order] - Optional number to control the tab's position relative to other STM tabs (lower numbers appear first). Defaults to appearing last.
         * @param {(panelElement: HTMLDivElement | null, tabElement: HTMLSpanElement | null) => void} [config.onActivate] - Optional callback executed when this tab becomes active. Receives the panel and tab elements (or null if lookup fails).
         * @param {(panelElement: HTMLDivElement | null, tabElement: HTMLSpanElement | null) => void} [config.onDeactivate] - Optional callback executed when this tab becomes inactive. Receives the panel and tab elements (or null if lookup fails).
         * @returns {boolean} True if the registration was accepted (either processed immediately or queued), false if validation failed.
         */
        registerTab: (config) => registerTabImpl(config),
        /**
         * Programmatically activates a registered STM tab.
         * @param {string} scriptId - The unique scriptId of the tab to activate.
         */
        activateTab: (scriptId) => activateTabImpl(scriptId),
        /**
         * Retrieves the DOM element for a registered tab's content panel.
         * @param {string} scriptId - The scriptId of the tab.
         * @returns {HTMLDivElement | null} The panel element, or null if not found or not initialized.
         */
        getPanelElement: (scriptId) => getPanelElementImpl(scriptId),
        /**
         * Retrieves the DOM element for a registered tab's clickable tab element.
         * @param {string} scriptId - The scriptId of the tab.
         * @returns {HTMLSpanElement | null} The tab element, or null if not found or not initialized.
         */
        getTabElement: (scriptId) => getTabElementImpl(scriptId)
    });

    // --- Styling ---
    GM_addStyle(`
        /* Ensure panels added by STM behave like native ones */
        ${SELECTORS.PANEL_CONTAINER} > div[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}] {
            display: none; /* Hide inactive panels */
        }
        ${SELECTORS.PANEL_CONTAINER} > div[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}].${ACTIVE_CLASSES.PANEL} {
            display: block; /* Show active panel */
        }
        /* Basic styling for the added tabs */
        ${SELECTORS.TAB_CONTAINER} > span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}] {
           cursor: pointer;
        }
        /* Styling for the single separator */
        ${SELECTORS.TAB_CONTAINER} > span[${ATTRS.SEPARATOR}] {
            cursor: default;
            margin: 0 5px; /* Add some spacing around the separator */
            user-select: none; /* Prevent text selection */
            -webkit-user-select: none;
        }
    `);

    // --- Core Logic Implementation Functions ---

    /**
     * Finds and caches the essential DOM elements for the settings UI.
     * @returns {boolean} True if all required elements are found and attached to the DOM, false otherwise.
     */
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
             activeStmTabId = null; // Reset active tab state
             return false;
        }
        return true;
    }

    /**
     * Internal helper: Deactivates the specified STM tab visually and triggers its onDeactivate callback.
     * Does *not* change `activeStmTabId`.
     * @param {string} scriptId The ID of the STM tab to deactivate.
     */
    function _deactivateStmTabVisualsAndCallback(scriptId) {
        if (!scriptId) return;

        const config = registeredTabs.get(scriptId);
        const tab = getTabElementImpl(scriptId);
        const panel = getPanelElementImpl(scriptId);

        tab?.classList.remove(ACTIVE_CLASSES.TAB);
        if (panel) {
            panel.classList.remove(ACTIVE_CLASSES.PANEL);
            // Ensure display is none, overriding potential inline styles from activation
            panel.style.display = 'none';
        }

        // Call the script's deactivate hook only if config exists
        if (config?.onDeactivate) {
            try {
                config.onDeactivate(panel, tab); // Pass potentially null elements
            } catch (e) {
                error(`Error during onDeactivate for ${scriptId}:`, e);
            }
        }
    }

    /**
     * Internal helper: Activates the specified STM tab visually and triggers its onActivate callback.
     * Does *not* change `activeStmTabId` or deactivate other tabs.
     * @param {string} scriptId The ID of the STM tab to activate.
     * @returns {boolean} True if activation visuals/callback were attempted successfully (elements found), false otherwise.
     */
    function _activateStmTabVisualsAndCallback(scriptId) {
        const config = registeredTabs.get(scriptId);
        if (!config) {
            error(`Cannot activate visuals: Config not found for ${scriptId}.`);
            return false;
        }

        const tab = getTabElementImpl(scriptId);
        const panel = getPanelElementImpl(scriptId);

        if (!tab || !panel) {
            error(`Cannot activate visuals: Tab or Panel element not found for ${scriptId}.`);
            return false;
        }

        // Activate the new STM tab/panel visuals
        tab.classList.add(ACTIVE_CLASSES.TAB);
        panel.classList.add(ACTIVE_CLASSES.PANEL);
        // Explicitly set display to block, ensuring visibility even if default CSS is overridden elsewhere
        panel.style.display = 'block';

        // Call the script's activation hook
        if (config.onActivate) {
            try {
                config.onActivate(panel, tab);
            } catch (e) {
                error(`Error during onActivate for ${scriptId}:`, e);
                // Activation visuals already applied, difficult to revert cleanly. Error logged.
            }
        }
        return true; // Activation attempted
    }

    /**
     * Deactivates all *native* (non-STM) tabs and panels.
     * Used when switching from a native tab to an STM tab.
     */
    function _deactivateNativeTabs() {
        if (!tabContainerEl || !panelContainerEl) return;

        panelContainerEl.querySelectorAll(`:scope > ${SELECTORS.SITE_PANEL}.${ACTIVE_CLASSES.PANEL}:not([${ATTRS.MANAGED}])`)
            .forEach(p => p.classList.remove(ACTIVE_CLASSES.PANEL));
        tabContainerEl.querySelectorAll(`:scope > ${SELECTORS.SITE_TAB}.${ACTIVE_CLASSES.TAB}:not([${ATTRS.MANAGED}])`)
            .forEach(t => t.classList.remove(ACTIVE_CLASSES.TAB));
        // log('Deactivated native tabs/panels.');
    }

    /**
     * Handles clicks within the tab container to switch between native and STM tabs.
     * Uses event delegation on the tab container.
     * @param {MouseEvent} event - The click event.
     */
    function handleTabClick(event) {
        // Ensure containers are still valid before proceeding
        if (!tabContainerEl || !panelContainerEl || !event.target) {
            return;
        }

        // Find the closest ancestor that is a tab element (native or STM)
        const clickedTabElement = event.target.closest(SELECTORS.SITE_TAB);
        if (!clickedTabElement) {
            // Clicked outside any tab (e.g., empty space, maybe separator if not matched by SITE_TAB)
            // Check specifically for our separator
            if (event.target.closest(`span[${ATTRS.SEPARATOR}]`)) {
                event.stopPropagation(); // Prevent any site action if separator is clicked
                return;
            }
            return; // Not a relevant click
        }

        const isStmTab = clickedTabElement.matches(`span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}]`);
        const clickedStmScriptId = isStmTab ? clickedTabElement.getAttribute(ATTRS.SCRIPT_ID) : null;

        // --- Case 1: Clicked an STM Tab ---
        if (isStmTab && clickedStmScriptId) {
            event.stopPropagation(); // Prevent site's default handler for tabs

            if (clickedStmScriptId === activeStmTabId) {
                // log(`Clicked already active STM tab: ${clickedStmScriptId}`);
                return; // Already active, do nothing
            }

            // Deactivate previously active tab (could be native or another STM tab)
            if (activeStmTabId) {
                _deactivateStmTabVisualsAndCallback(activeStmTabId); // Deactivate previous STM tab
            } else {
                _deactivateNativeTabs(); // Deactivate native tabs if one was active
            }

            // Activate the clicked STM tab
            if (_activateStmTabVisualsAndCallback(clickedStmScriptId)) {
                activeStmTabId = clickedStmScriptId; // Update state *after* successful activation attempt
            } else {
                // Activation failed (elements missing?) - log already happened inside helper.
                // Reset state to avoid inconsistent UI.
                activeStmTabId = null;
            }
            return; // Handled by STM
        }

        // --- Case 2: Clicked a Native Site Tab ---
        // Check it's specifically a non-managed tab to avoid accidental matches if selectors overlap badly
        if (clickedTabElement.matches(`${SELECTORS.SITE_TAB}:not([${ATTRS.MANAGED}])`)) {
            // If an STM tab *was* active, deactivate it visually and clear STM's active state.
            if (activeStmTabId) {
                // log(`Deactivating current STM tab (${activeStmTabId}) due to native tab click.`);
                _deactivateStmTabVisualsAndCallback(activeStmTabId);
                activeStmTabId = null; // Clear STM state, site handler will manage native state
            }

            // **Allow event propagation** - Let the site's own click handler manage the native tab switch.
            // log("Allowing event propagation for native tab handler.");
            return;
        }

        // --- Case 3: Clicked something else matching SITE_TAB (e.g., STM separator if it has SITE_TAB class) ---
        // If it's our separator, stop propagation. (This check might be redundant if separator doesn't have SITE_TAB class)
        if (clickedTabElement.matches(`span[${ATTRS.SEPARATOR}]`)) {
            event.stopPropagation();
            return;
        }

        // Otherwise, ignore (shouldn't happen often if selectors are correct).
    }

    /** Attaches the main click listener to the tab container using the capture phase. */
    function attachTabClickListener() {
        if (!tabContainerEl) return;
        // Remove existing listener before adding to prevent duplicates if re-initialized
        tabContainerEl.removeEventListener('click', handleTabClick, true);
        tabContainerEl.addEventListener('click', handleTabClick, true); // Use capture phase to run before site's potential handlers
        log('Tab click listener attached.');
    }

    /**
     * Creates the single separator span element used between native and STM tabs.
     * @returns {HTMLSpanElement} The separator element.
     */
    function createSeparator() {
         const separator = document.createElement('span');
         // Use the site's separator class if defined, otherwise a fallback
         separator.className = SELECTORS.SITE_SEPARATOR.startsWith('.')
            ? SELECTORS.SITE_SEPARATOR.substring(1)
            : 'settings-tab-separator-fallback'; // Basic fallback class name
         separator.setAttribute(ATTRS.MANAGED, 'true');
         separator.setAttribute(ATTRS.SEPARATOR, 'true');
         separator.textContent = '|'; // Simple visual separator
         return separator;
     }

    /**
     * Creates and inserts the tab and panel DOM elements for a given script configuration.
     * Handles ordering and the single separator insertion.
     * @param {object} config - The registration configuration object for the tab.
     */
    function createTabAndPanel(config) {
        if (!tabContainerEl || !panelContainerEl) {
            error(`Cannot create tab/panel for ${config.scriptId}: Containers not found.`);
            return;
        }
        // Avoid creating duplicates if called multiple times (e.g., during re-init)
        if (getTabElementImpl(config.scriptId) || getPanelElementImpl(config.scriptId)) {
            log(`Tab or panel element already exists for ${config.scriptId}, skipping creation.`);
            return;
        }

        log(`Creating tab/panel for: ${config.scriptId}`);

        // --- Create Tab Element ---
        const newTab = document.createElement('span');
        newTab.className = SELECTORS.SITE_TAB.substring(1); // Use site's tab class
        newTab.textContent = config.tabTitle;
        newTab.setAttribute(ATTRS.SCRIPT_ID, config.scriptId);
        newTab.setAttribute(ATTRS.MANAGED, 'true');
        newTab.setAttribute('title', `${config.tabTitle} (Settings by ${config.scriptId})`);
        const desiredOrder = config.order ?? Infinity; // Use nullish coalescing for default
        newTab.setAttribute(ATTRS.ORDER, desiredOrder);

        // --- Create Panel Element ---
        const newPanel = document.createElement('div');
        newPanel.className = SELECTORS.SITE_PANEL.substring(1); // Use site's panel class
        newPanel.setAttribute(ATTRS.SCRIPT_ID, config.scriptId);
        newPanel.setAttribute(ATTRS.MANAGED, 'true');
        newPanel.id = `${MANAGER_ID}-${config.scriptId}-panel`; // Unique ID for the panel

        // --- Insertion Logic (Separator & Ordering) ---
        let insertBeforeTab = null;
        // Get existing STM tabs, convert NodeList to Array for sorting
        const existingStmTabs = Array.from(tabContainerEl.querySelectorAll(`span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}]`));

        // Sort existing tabs by their order attribute to find the correct insertion point
        existingStmTabs.sort((a, b) => (parseFloat(a.getAttribute(ATTRS.ORDER) ?? Infinity)) - (parseFloat(b.getAttribute(ATTRS.ORDER) ?? Infinity)));

        // Find the first existing STM tab with a higher order number
        for (const existingTab of existingStmTabs) {
            if (desiredOrder < (parseFloat(existingTab.getAttribute(ATTRS.ORDER) ?? Infinity))) {
                insertBeforeTab = existingTab;
                break;
            }
        }

        // Add the separator only once, before the *first* STM tab is added
        let separatorInstance = null;
        if (!isSeparatorAdded && existingStmTabs.length === 0) {
            separatorInstance = createSeparator();
            isSeparatorAdded = true; // Set flag
            log('Adding the main STM separator.');
        }

        // Perform the insertion
        if (insertBeforeTab) {
            // Insert separator (if created) and new tab before the found element
            if (separatorInstance) tabContainerEl.insertBefore(separatorInstance, insertBeforeTab);
            tabContainerEl.insertBefore(newTab, insertBeforeTab);
        } else {
            // Append separator (if created) and new tab to the end
            if (separatorInstance) tabContainerEl.appendChild(separatorInstance);
            tabContainerEl.appendChild(newTab);
        }
        // Append the panel to the panel container (order doesn't matter visually here)
        panelContainerEl.appendChild(newPanel);

        // --- Initialize Panel Content (Safely) ---
        try {
            // Use Promise.resolve to handle both sync and async onInit functions gracefully
            Promise.resolve(config.onInit(newPanel, newTab)).catch(e => {
                error(`Error during async onInit for ${config.scriptId}:`, e);
                newPanel.innerHTML = `<p style="color: red;">Error initializing settings panel for ${config.scriptId}. See console.</p>`;
            });
        } catch (e) {
            // Catch synchronous errors from onInit
            error(`Error during sync onInit for ${config.scriptId}:`, e);
            newPanel.innerHTML = `<p style="color: red;">Error initializing settings panel for ${config.scriptId}. See console.</p>`;
        }
    }

    /** Processes all pending registrations that arrived before initialization was complete. */
    function processPendingRegistrations() {
        if (!isInitialized) return; // Should not happen if called correctly, but safe check
        if (pendingRegistrations.length === 0) return; // Nothing to process

        log(`Processing ${pendingRegistrations.length} pending registrations...`);

        // Sort the pending queue by order *before* processing
        pendingRegistrations.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

        while (pendingRegistrations.length > 0) {
            const config = pendingRegistrations.shift(); // Process in sorted order
            // Double-check it wasn't somehow registered already (e.g., edge case with re-init)
            if (!registeredTabs.has(config.scriptId)) {
                registeredTabs.set(config.scriptId, config);
                createTabAndPanel(config); // This function handles ordering relative to existing tabs
            } else {
                warn(`Script ID ${config.scriptId} was already registered. Skipping pending registration.`);
            }
        }
        log('Finished processing pending registrations.');
    }

    // --- Initialization and Observation ---

    /**
     * Main initialization routine. Finds elements, attaches listener, processes queue, resolves ready promise.
     * @returns {boolean} True if initialization was successful, false otherwise.
     */
    function initializeManager() {
        // Attempt to find the core elements
        if (!findSettingsElements()) {
            // log('Settings elements not found yet.');
            return false; // Cannot initialize
        }

        // If already initialized AND the elements are still valid, just ensure listener is attached and exit.
        // This handles cases where the observer might trigger initialize multiple times without DOM changes.
        if (isInitialized && settingsMenuEl && tabContainerEl && panelContainerEl) {
            // log('Manager already initialized and elements are valid. Ensuring listener is attached.');
            attachTabClickListener(); // Re-attach listener just in case it was somehow removed
            return true;
        }

        log('Initializing Settings Tab Manager...');
        attachTabClickListener();
        isInitialized = true;
        log('Manager is now initialized and ready.');

        // Process any registrations that occurred before init completed
        processPendingRegistrations();

        // Resolve the public promise to signal readiness to consumer scripts
        resolveReadyPromise(publicApi);

        return true;
    }

    /**
     * MutationObserver callback to detect when the settings menu is added to or removed from the DOM.
     * @param {MutationRecord[]} mutationsList - List of mutations that occurred.
     * @param {MutationObserver} obs - The observer instance.
     */
    function handleDOMChanges(mutationsList, obs) {
        let needsReInitCheck = false;
        let settingsMenuFoundInMutation = false;

        // Scenario 1: Manager isn't initialized yet, check if the settings menu was added.
        if (!isInitialized) {
            if (document.querySelector(SELECTORS.SETTINGS_MENU)) {
                 // Menu exists in the DOM now, maybe added before observer caught it or by this mutation.
                 needsReInitCheck = true;
                 settingsMenuFoundInMutation = true; // Assume it might have been added
            } else {
                 // Menu doesn't exist, check if it was added in this specific mutation batch
                 for (const mutation of mutationsList) {
                     if (mutation.addedNodes) {
                         for (const node of mutation.addedNodes) {
                             if (node.nodeType === Node.ELEMENT_NODE) {
                                 // Check if the added node itself is the menu, or if it contains the menu
                                 const menu = (node.matches?.(SELECTORS.SETTINGS_MENU)) ? node : node.querySelector?.(SELECTORS.SETTINGS_MENU);
                                 if (menu) {
                                     log('Settings menu detected in addedNodes via MutationObserver.');
                                     needsReInitCheck = true;
                                     settingsMenuFoundInMutation = true;
                                     break; // Found it
                                 }
                             }
                         }
                     }
                     if (settingsMenuFoundInMutation) break; // Stop checking mutations if found
                 }
            }
        }
        // Scenario 2: Manager *was* initialized, check if the menu element was removed.
        else if (isInitialized && settingsMenuEl && !document.body.contains(settingsMenuEl)) {
            warn('Settings menu seems to have been removed from the DOM. De-initializing.');
            // Reset state
            isInitialized = false;
            settingsMenuEl = null;
            tabContainerEl = null;
            panelContainerEl = null;
            isSeparatorAdded = false;
            activeStmTabId = null;
            // Don't clear registeredTabs or pendingRegistrations, they might be needed if menu reappears
            // We need to check again later if the menu reappears
            needsReInitCheck = true; // Trigger a check in case it was immediately re-added
        }

        // If a check is needed (menu added or removed), attempt initialization asynchronously.
        // Using setTimeout defers execution slightly, allowing the DOM to stabilize after mutations.
        if (needsReInitCheck) {
            // log('Mutation detected, scheduling initialization/re-check.'); // Can be verbose
            setTimeout(() => {
                if (initializeManager()) {
                    // Successfully initialized or re-initialized
                    if (settingsMenuFoundInMutation) {
                        log('Manager initialized successfully following menu detection.');
                    } else {
                        // This case might occur if the menu was removed and re-added quickly,
                        // or if initializeManager was called due to state reset.
                        log('Manager state updated/re-initialized.');
                    }
                } else {
                    // Initialization failed (e.g., menu found but internal structure missing)
                    // log('Initialization attempt after mutation failed.'); // Can be verbose
                }
            }, 0);
        }
    }

    // --- Start Observer ---
    const observer = new MutationObserver(handleDOMChanges);
    observer.observe(document.body, {
        childList: true, // Watch for addition/removal of child nodes
        subtree: true    // Watch descendants as well
    });
    log('Mutation observer started for settings menu detection.');

    // --- Initial Initialization Attempt ---
    // Try to initialize immediately after script runs, in case the menu is already present.
    // Use setTimeout to ensure it runs after the current execution context.
    setTimeout(initializeManager, 0);


    // --- API Implementation Functions ---

    /** @inheritdoc */
    function registerTabImpl(config) {
        // --- Input Validation ---
        if (!config || typeof config !== 'object') { error('Registration failed: Invalid config object provided.'); return false; }
        const { scriptId, tabTitle, onInit } = config; // Destructure required fields for checks

        // Validate required fields
        if (typeof scriptId !== 'string' || !scriptId.trim()) { error('Registration failed: Invalid or missing scriptId (string).', config); return false; }
        if (typeof tabTitle !== 'string' || !tabTitle.trim()) { error(`Registration failed for ${scriptId}: Invalid or missing tabTitle (string).`, config); return false; }
        if (typeof onInit !== 'function') { error(`Registration failed for ${scriptId}: onInit callback must be a function.`, config); return false; }

        // Validate optional fields
        if (config.onActivate !== undefined && typeof config.onActivate !== 'function') { error(`Registration for ${scriptId} failed: onActivate (if provided) must be a function.`); return false; }
        if (config.onDeactivate !== undefined && typeof config.onDeactivate !== 'function') { error(`Registration for ${scriptId} failed: onDeactivate (if provided) must be a function.`); return false; }
        if (config.order !== undefined && (typeof config.order !== 'number' || !isFinite(config.order))) {
            warn(`Registration for ${scriptId}: Invalid 'order' value provided (must be a finite number). Using default order.`, config);
            delete config.order; // Remove invalid order so default (Infinity) applies
        }

        // Check for duplicates
        if (registeredTabs.has(scriptId) || pendingRegistrations.some(p => p.scriptId === scriptId)) {
            warn(`Registration failed: Script ID "${scriptId}" is already registered or pending registration.`);
            return false;
        }
        // --- End Validation ---

        log(`Registration accepted for: ${scriptId}`);
        const registrationData = { ...config }; // Shallow clone to avoid external modification

        if (isInitialized) {
            // Manager is ready, register and create elements immediately
            registeredTabs.set(scriptId, registrationData);
            createTabAndPanel(registrationData); // Handles insertion order
        } else {
            // Manager not ready, add to the pending queue
            log(`Manager not ready, queueing registration for ${scriptId}`);
            pendingRegistrations.push(registrationData);
            // Keep queue sorted for predictable processing later (though createTabAndPanel handles final order)
            pendingRegistrations.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
        }
        return true; // Registration accepted (processed or queued)
    }

    /** @inheritdoc */
    function activateTabImpl(scriptId) {
        // console.trace(`[${MANAGER_ID}] activateTabImpl called with ID: ${scriptId}`); // Uncomment for deep debugging

        if (typeof scriptId !== 'string' || !scriptId.trim()) {
            error('activateTab failed: Invalid scriptId provided (must be a non-empty string).'); return;
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

        // Deactivate previously active tab (could be native or another STM tab)
        if (activeStmTabId) {
            _deactivateStmTabVisualsAndCallback(activeStmTabId); // Deactivate previous STM tab
        } else {
             // If no STM tab was active, assume a native tab might be. Deactivate native tabs.
             _deactivateNativeTabs();
        }

        // Activate the requested STM tab
        if (_activateStmTabVisualsAndCallback(scriptId)) {
            activeStmTabId = scriptId; // Update the state *after* successful activation attempt
            log(`Programmatically activated tab: ${scriptId}`);
        } else {
            // Activation failed (elements missing?) - logs already happened inside helper.
            warn(`Programmatic activation failed for tab: ${scriptId}. Resetting active tab state.`);
            activeStmTabId = null; // Reset state to avoid inconsistency
        }
    }

    /** @inheritdoc */
    function getPanelElementImpl(scriptId) {
        if (!isInitialized || !panelContainerEl || typeof scriptId !== 'string' || !scriptId.trim()) {
             return null;
        }
        // Use optional chaining for safety, though panelContainerEl is checked above
        return panelContainerEl?.querySelector(`div[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}="${scriptId}"]`);
    }

    /** @inheritdoc */
    function getTabElementImpl(scriptId) {
        if (!isInitialized || !tabContainerEl || typeof scriptId !== 'string' || !scriptId.trim()) {
            return null;
        }
        // Use optional chaining for safety
        return tabContainerEl?.querySelector(`span[${ATTRS.MANAGED}][${ATTRS.SCRIPT_ID}="${scriptId}"]`);
     }

    // --- Global Exposure ---
    /**
     * Exposes the public API on `unsafeWindow` for cross-script communication.
     * `unsafeWindow` bypasses the userscript sandbox, allowing different scripts
     * managed by the same userscript engine instance to access the same object.
     */
    function exposeApiGlobally() {
        log('Attempting to expose API globally on unsafeWindow...');
        try {
            // `unsafeWindow` is provided by some userscript managers (e.g., Tampermonkey, Violentmonkey)
            // It represents the raw page `window` object.
            if (typeof unsafeWindow === 'undefined') {
                throw new Error('`unsafeWindow` is not available. Cannot guarantee cross-script communication.');
            }

            // Check if the API is already defined, possibly by a duplicate script instance.
            if (typeof unsafeWindow.SettingsTabManager !== 'undefined') {
                // Avoid overwriting if it's the exact same object (e.g., script ran twice weirdly but points to same instance)
                // Though realistically, multiple instances would create distinct objects.
                if (unsafeWindow.SettingsTabManager !== publicApi) {
                     warn('`unsafeWindow.SettingsTabManager` is already defined by potentially another script or instance! Overwriting. Check for duplicate STM scripts.');
                } else {
                     warn('`unsafeWindow.SettingsTabManager` seems to be defined already *as this exact object*. This might indicate the script ran multiple times.');
                     // No need to redefine if it's the same object.
                     return;
                }
                // Attempt to remove the old property before redefining. Might fail if non-configurable.
                try {
                    delete unsafeWindow.SettingsTabManager;
                } catch (deleteErr) {
                    warn('Could not delete previous unsafeWindow.SettingsTabManager definition.', deleteErr);
                }
            }

            // Define the property on unsafeWindow.
            Object.defineProperty(unsafeWindow, 'SettingsTabManager', {
                value: publicApi,
                writable: false, // Prevent accidental reassignment by page scripts or basic user errors.
                configurable: true // Allow removal/redefinition by other userscripts or the manager if needed.
            });

            // Verify that the definition succeeded.
            if (unsafeWindow.SettingsTabManager === publicApi) {
                log('SettingsTabManager API exposed successfully on unsafeWindow.');
            } else {
                // This should ideally not happen if defineProperty doesn't throw.
                throw new Error('Failed to verify API definition on unsafeWindow after defineProperty.');
            }

        } catch (e) {
            error('Fatal error exposing SettingsTabManager API:', e);
            // Attempt to alert the user, as dependent scripts will likely fail.
            try {
                 alert(`${MANAGER_ID} Error: Failed to expose API globally on unsafeWindow. Other scripts depending on STM may fail. Check the browser console (F12) for details.`);
            } catch (alertErr) {
                error('Failed to show alert about API exposure failure.');
            }
        }
    }

    exposeApiGlobally(); // Expose the API

})(); // End of IIFE