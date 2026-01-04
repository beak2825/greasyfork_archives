// ==UserScript==
// @name         Faction OC Highlighter MR
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  Highlights OCs, Priority goes: Prioritized > Paused > Close to being paused, Also hides/unhides OCs
// @author       defend [2683949]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535867/Faction%20OC%20Highlighter%20MR.user.js
// @updateURL https://update.greasyfork.org/scripts/535867/Faction%20OC%20Highlighter%20MR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- --- --- CONFIGURATION --- --- ---
    const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbwWx5Iij5wp9bcOPG8e-3IFCTdjVewUK16OOlVhoFl5a5SjxPv8gPvuEi3ey2XBllUO/exec';
    const ADMIN_IDS = [2683949, 2094410, 2443510, 2581696, 2334174, 1884573, 945786, 2549670];
    const MOBILE_MANAGER_KEY = 2818237;
    const CACHE_DURATION_MS = 1 * 60 * 1000;
    const FALLBACK_OC_REQUIREMENTS = { "BLAST FROM THE PAST": { _default: { min: 75 }, "PICKLOCK #2": {} }, "CLINICAL PRECISION": { _default: { min: 74 } }, "BREAK THE BANK": { _default: { min: 71 } }, "STACKING THE DECK": { _default: { min: 74 }, "DRIVER": { min: 66 } }, "ACE IN THE HOLE": { _default: { min: 64 }, "DRIVER": { min: 56 } }};


    // --- --- --- GLOBAL STATE & IDS --- --- ---
    const OC_PLANNER_PANEL_ID = 'oc-planner-panel-v1', OPEN_BUTTON_ID = 'oc-planner-open-btn-v1', HIGHLIGHT_CLASS = 'oc-planner-highlight-from-v2', PRIORITY_HIGHLIGHT_CLASS = 'oc-planner-priority-highlight', SCROLL_PROMPT_ID = 'oc-planner-scroll-prompt', NO_CRIMES_POPUP_ID = 'oc-planner-no-crimes-popup', LOADING_POPUP_ID = 'oc-planner-loading-popup';
    let OC_REQUIREMENTS = {}, PRIORITY_OCS = [], HIDDEN_OCS = [], previouslyHighlightedElements = new Set(), isAdmin = false, currentUserId = null, noCrimesAlertShown = false, userDismissedPriorityPrompt = false;

    // --- FLAGS ---
    let userOverrodeOcCheck = false; // Tracks if "Load Script" was clicked
    let scriptAborted = false;       // Tracks if "Close" was clicked (stops the script)

    // --- Selectors ---
    const BUTTON_TARGET_SELECTOR = '.currentDifficultyDescription___itwYT', CRIME_CARD_SELECTOR = 'div[data-oc-id].wrapper___U2Ap7', CRIME_TITLE_SELECTOR = '.panelTitle___aoGuV', JOINABLE_SLOT_SELECTOR = '.waitingJoin___jq10k', FILLED_SLOT_SELECTOR = '.wrapper___Lpz_D:not(.waitingJoin___jq10k)', PLANNING_CIRCLE_SELECTOR = '.planning___CjB09', SLOT_ROLE_NAME_SELECTOR = '.title___UqFNy', SLOT_USER_LEVEL_SELECTOR = '.successChance___ddHsR', INACTIVE_ICON_SELECTOR = '.inactive___Dpqh0';


    // --- --- --- DATA HANDLING (FETCH & SAVE) --- --- ---
    function fetchOCData() {
        return new Promise((resolve, reject) => {
            const cachedData = JSON.parse(sessionStorage.getItem('ocPlannerData'));
            if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
                OC_REQUIREMENTS = cachedData.data.requirements;
                PRIORITY_OCS = cachedData.data.priorityOCs || [];
                HIDDEN_OCS = cachedData.data.hiddenOCs || [];
                return resolve();
            }
            GM_xmlhttpRequest({
                method: 'GET', url: GOOGLE_SHEET_API_URL,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const dataToCache = { data: data, timestamp: Date.now() };
                            OC_REQUIREMENTS = data.requirements;
                            PRIORITY_OCS = data.priorityOCs || [];
                            HIDDEN_OCS = data.hiddenOCs || [];
                            sessionStorage.setItem('ocPlannerData', JSON.stringify(dataToCache));
                            resolve();
                        } catch (e) {
                            console.error("OC Planner: Failed to parse API data, using fallback.", e);
                            OC_REQUIREMENTS = FALLBACK_OC_REQUIREMENTS;
                            reject(e);
                        }
                    } else {
                        console.error("OC Planner: API error, using fallback. Status:", response.status);
                        OC_REQUIREMENTS = FALLBACK_OC_REQUIREMENTS;
                        reject(new Error("API Error"));
                    }
                },
                onerror: function(error) {
                    console.error("OC Planner: Network error, using fallback.", error);
                    OC_REQUIREMENTS = FALLBACK_OC_REQUIREMENTS;
                    reject(error);
                }
            });
        });
    }

    function saveOCRequirements(newRules) {
        GM_xmlhttpRequest({
            method: 'POST', url: GOOGLE_SHEET_API_URL, data: JSON.stringify(newRules), headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    alert("OC rules saved. Refresh the page");
                    sessionStorage.removeItem('ocPlannerData');
                } else { alert("Save failed."); }
            },
            onerror: function(error) { alert("Network error."); }
        });
    }

    function savePriorityOCs() {
        const payload = { action: 'setPriority', ocList: PRIORITY_OCS };
        GM_xmlhttpRequest({
            method: 'POST', url: GOOGLE_SHEET_API_URL, data: JSON.stringify(payload), headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    alert(`Priority list updated Refresh the page`);
                    sessionStorage.removeItem('ocPlannerData');
                } else { alert("Failed to save."); }
            },
            onerror: function(error) { alert("Network error."); }
        });
    }

    function saveHiddenOCs() {
        const payload = { action: 'setHidden', hiddenList: HIDDEN_OCS };
        GM_xmlhttpRequest({
            method: 'POST', url: GOOGLE_SHEET_API_URL, data: JSON.stringify(payload), headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    sessionStorage.removeItem('ocPlannerData');
                } else { alert("Failed to save hidden list."); }
            },
            onerror: function(error) { alert("Network error."); }
        });
    }


    // --- --- --- CORE HIGHLIGHTING LOGIC --- --- ---
    function extractDegreeFromStyle(bg) { if (!bg) return -1; const m = bg.match(/([\d\.]+)deg/); return m ? parseFloat(m[1]) : -1; }
    function isSlotAt0Deg(el) { const p = el.querySelector(PLANNING_CIRCLE_SELECTOR); return p?.style.background.replace(/\s+/g, '').includes('(var(--oc-clock-planning-bg)0deg,var(--oc-clock-bg)0deg)'); }
    function isSlotAt360Deg(el) {
        const p = el.querySelector(PLANNING_CIRCLE_SELECTOR);
        if (!p) return false;
        const bg = p.style.background;
        if (!bg) return false;
        const match = bg.match(/conic-gradient\(.*?([\d\.]+)deg/);
        if (match && match[1]) {
            return parseFloat(match[1]) >= 360;
        }
        return false;
    }
    function isSlotInactive(el) { return el.querySelector(INACTIVE_ICON_SELECTOR) !== null; }

    function isUserEligibleForCrime(card) {
        const title = card.querySelector(CRIME_TITLE_SELECTOR)?.textContent.trim().toUpperCase();
        const rules = OC_REQUIREMENTS[title];
        if (!rules) return true;

        for (const slot of card.querySelectorAll(JOINABLE_SLOT_SELECTOR)) {
            const roleEl = slot.querySelector(SLOT_ROLE_NAME_SELECTOR);
            const levelEl = slot.querySelector(SLOT_USER_LEVEL_SELECTOR);
            if (roleEl && levelEl) {
                const role = roleEl.textContent.trim().toUpperCase();
                const level = parseInt(levelEl.textContent);
                const rule = rules[role] || rules._default;
                if (rule) {
                    const meetsMin = 'min' in rule ? level >= rule.min : true;
                    const meetsMax = 'max' in rule ? level <= rule.max : true;
                    if (meetsMin && meetsMax) return true;
                }
            }
        }
        return false;
    }

    function checkIsUserInOC() {
        const icons = Array.from(document.querySelectorAll('ul[class*="status-icons"] li'));
        return icons.some(li => {
            const c = li.className || "";
            return c.includes('icon89') || c.includes('icon85') || c.includes('icon86');
        });
    }

    async function processAndHighlightOCs(forceLoad = false) {
        // Stop immediately if script was aborted via "Close" button
        if (scriptAborted) return;

        if (window.location.href.includes('crimeId=')) {
            previouslyHighlightedElements.forEach(el => el.classList.remove(HIGHLIGHT_CLASS, PRIORITY_HIGHLIGHT_CLASS));
            previouslyHighlightedElements.clear();
            const noCrimesPopup = document.getElementById(NO_CRIMES_POPUP_ID);
            if (noCrimesPopup) noCrimesPopup.remove();
            console.log('OC Planner: Specific crime ID linked. Skipping.');
            return;
        }

        if (forceLoad) { userOverrodeOcCheck = true; }
        if (!userOverrodeOcCheck && checkIsUserInOC()) { showInOcWarning(); return; }

        showLoadingIndicator();

        try {
            if (Object.keys(OC_REQUIREMENTS).length === 0) { try { await fetchOCData(); } catch (e) { /* fallback */ } }

            previouslyHighlightedElements.forEach(el => {
                el.classList.remove(HIGHLIGHT_CLASS, PRIORITY_HIGHLIGHT_CLASS);
            });
            previouslyHighlightedElements.clear();

            const allCrimeCards = Array.from(document.querySelectorAll(CRIME_CARD_SELECTOR));
            if (allCrimeCards.length === 0) return;

            // Reset display for all cards before processing
            allCrimeCards.forEach(c => {
                c.style.display = '';
                c.classList.remove('oc-planner-hidden-admin');
            });

            // Add Admin Controls to all cards
            allCrimeCards.forEach(addAdminControls);

            let nonPriorityCards = [...allCrimeCards];

            // --- HIDE LOGIC ---
            const visibleNonHiddenCards = [];
            nonPriorityCards.forEach(card => {
                const ocId = card.dataset.ocId;
                const isHidden = HIDDEN_OCS.some(h => h.id == ocId);
                if (isHidden) {
                    if (isAdmin) {
                        card.classList.add('oc-planner-hidden-admin');
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    visibleNonHiddenCards.push(card);
                }
            });
            nonPriorityCards = visibleNonHiddenCards;

            // --- PRIORITY LOGIC ---
            let missingPriority = false;
            let priorityCardsWereFound = false;

            if (PRIORITY_OCS && PRIORITY_OCS.length > 0) {
                const priorityCardsInOrder = [];
                PRIORITY_OCS.forEach(priority => {
                    const card = nonPriorityCards.find(c => c.dataset.ocId == priority.id);
                    if (card) {
                        nonPriorityCards = nonPriorityCards.filter(c => c.dataset.ocId != priority.id);
                        const currentMembers = card.querySelectorAll(FILLED_SLOT_SELECTOR).length;
                        if (currentMembers < priority.target && isUserEligibleForCrime(card)) {
                            priorityCardsInOrder.push(card);
                        }
                    } else {
                        const originalCard = allCrimeCards.find(c => c.dataset.ocId == priority.id);
                        if (!originalCard) { missingPriority = true; }
                    }
                });

                if (missingPriority) {
                    if (!userDismissedPriorityPrompt) { showScrollPrompt(PRIORITY_OCS); }
                } else {
                    hideScrollPrompt();
                }

                priorityCardsInOrder.reverse().forEach(card => {
                    if (card.querySelector(JOINABLE_SLOT_SELECTOR)) {
                        const parent = card.parentNode;
                        if (parent && parent.firstChild !== card) parent.insertBefore(card, parent.firstChild);
                        card.classList.add(PRIORITY_HIGHLIGHT_CLASS);
                        previouslyHighlightedElements.add(card);
                        priorityCardsWereFound = true;
                    }
                });
            } else {
                 hideScrollPrompt();
            }

            // --- STANDARD HIGHLIGHT LOGIC ---
            if (!priorityCardsWereFound) {
                let pausedOcsWereFound = false;
                const pausedEligibleOCs = [];

                nonPriorityCards.forEach(card => {
                    if (!card.querySelector(JOINABLE_SLOT_SELECTOR) || !isUserEligibleForCrime(card)) return;
                    const filledSlots = card.querySelectorAll(FILLED_SLOT_SELECTOR);
                    if (filledSlots.length === 0) return;
                    if (Array.from(filledSlots).every(isSlotAt360Deg)) {
                        pausedEligibleOCs.push(card);
                    }
                });

                if (pausedEligibleOCs.length > 0) {
                    pausedEligibleOCs.reverse().forEach(pausedOC => {
                        const parent = pausedOC.parentNode;
                        if (parent && parent.firstChild !== pausedOC) {
                            parent.insertBefore(pausedOC, parent.firstChild);
                        }
                        pausedOC.classList.add(HIGHLIGHT_CLASS);
                        previouslyHighlightedElements.add(pausedOC);
                    });
                    pausedOcsWereFound = true;
                }

                if (!pausedOcsWereFound) {
                    let candidateOCs = [];
                    nonPriorityCards.forEach(card => {
                        if (!card.querySelector(JOINABLE_SLOT_SELECTOR)) return;
                        let isDisq = false;
                        for (const slot of card.querySelectorAll(FILLED_SLOT_SELECTOR)) { if (isSlotAt0Deg(slot) || isSlotInactive(slot)) { isDisq = true; break; } }
                        if (isDisq || !isUserEligibleForCrime(card)) return;
                        let maxProgress = -1;
                        card.querySelectorAll(FILLED_SLOT_SELECTOR).forEach(slot => { const p = slot.querySelector(PLANNING_CIRCLE_SELECTOR); if (p) { const d = extractDegreeFromStyle(p.style.background); if (d < 360 && d > maxProgress) maxProgress = d; } });
                        if (maxProgress > -1) candidateOCs.push({ element: card, score: maxProgress });
                    });

                    if (candidateOCs.length > 0) {
                        candidateOCs.sort((a, b) => b.score - a.score);
                        const bestOCElement = candidateOCs[0].element;
                        const parent = bestOCElement.parentNode;
                        if (parent && parent.firstChild !== bestOCElement) parent.insertBefore(bestOCElement, parent.firstChild);
                        bestOCElement.classList.add(HIGHLIGHT_CLASS);
                        previouslyHighlightedElements.add(bestOCElement);
                    }
                }
            }

            if (previouslyHighlightedElements.size === 0) {
                if (!noCrimesAlertShown) {
                    showNoCrimesPopup();
                    noCrimesAlertShown = true;
                }
            } else {
                const noCrimesPopup = document.getElementById(NO_CRIMES_POPUP_ID);
                if (noCrimesPopup) noCrimesPopup.remove();
                noCrimesAlertShown = false;
            }
        } finally {
            hideLoadingIndicator();
        }
    }


    // --- --- --- UI & STYLES --- --- ---
    function initializeUI() {
        const userIdElement = document.querySelector('.menu-info-row___YG31c a.menu-value___gLaLR[href*="XID="]');
        if (userIdElement) {
            currentUserId = parseInt(userIdElement.href.split("XID=")[1]);
            isAdmin = ADMIN_IDS.includes(currentUserId);
        } else {
            if (ADMIN_IDS.includes(MOBILE_MANAGER_KEY)) { isAdmin = true; } else { isAdmin = false; }
        }

        if (isAdmin) {
            if (document.getElementById(OPEN_BUTTON_ID)) return;
            const targetElement = document.querySelector(BUTTON_TARGET_SELECTOR);
            if (!targetElement || !targetElement.parentNode) return;

            if (!document.getElementById(OC_PLANNER_PANEL_ID)) {
                const plannerPanel = document.createElement('div');
                plannerPanel.id = OC_PLANNER_PANEL_ID;
                plannerPanel.innerHTML = `
                    <div id="oc-planner-header">
                        <h2>Organized Crime Planner</h2>
                        <div class="oc-planner-header-controls">
                            <button id="oc-theme-toggle-btn" title="Toggle Theme"></button>
                            <button id="oc-planner-close-btn" title="Close">×</button>
                        </div>
                    </div>
                    <div id="oc-planner-content">
                        <div class="oc-planner-section oc-planner-admin-controls">
                             <h3>Admin Controls</h3>
                             <button id="oc-clear-priority-btn" class="torn-btn">Clear All Priorities</button>
                             <button id="oc-clear-hidden-btn" class="torn-btn" style="margin-left:10px;">Unhide All Crimes</button>
                        </div>
                        <div class="oc-planner-section">
                            <h3>Faction OC Rules</h3>
                            <div id="oc-admin-form-container">Loading...</div>
                        </div>
                    </div>
                    <div id="oc-planner-footer">
                        <button id="oc-admin-save-btn" class="torn-btn">Save Rules</button>
                    </div>`;

                document.body.appendChild(plannerPanel);
                setupPanelEventListeners();
                applySavedTheme();
            }

            const openButton = document.createElement('button');
            openButton.textContent = 'OC PLANNER';
            openButton.id = OPEN_BUTTON_ID;
            openButton.className = 'torn-btn';
            openButton.addEventListener('click', async () => {
                document.getElementById(OC_PLANNER_PANEL_ID).style.display = 'flex';
                await fetchOCData();
                populateAdminForm();
            });
            targetElement.parentNode.insertBefore(openButton, targetElement.nextSibling);
        }
        addGlobalStyles();
    }

    function setupPanelEventListeners() {
        document.getElementById('oc-planner-close-btn').addEventListener('click', () => {
            document.getElementById(OC_PLANNER_PANEL_ID).style.display = 'none';
        });

        document.getElementById('oc-admin-save-btn').addEventListener('click', handleSave);

        document.getElementById('oc-clear-priority-btn').addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all priority OCs for the faction?")) {
                PRIORITY_OCS = [];
                savePriorityOCs();
            }
        });

        document.getElementById('oc-clear-hidden-btn').addEventListener('click', () => {
             if (confirm("Are you sure you want to UNHIDE ALL crimes for the faction?")) {
                HIDDEN_OCS = [];
                saveHiddenOCs();
            }
        });

        const themeToggleBtn = document.getElementById('oc-theme-toggle-btn');
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = GM_getValue('ocPlannerTheme', 'light');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            GM_setValue('ocPlannerTheme', newTheme);
            applySavedTheme();
        });
    }

    function applySavedTheme() {
        const theme = GM_getValue('ocPlannerTheme', 'light');
        const panel = document.getElementById(OC_PLANNER_PANEL_ID);
        const toggleBtn = document.getElementById('oc-theme-toggle-btn');
        if (panel) {
            panel.classList.remove('light-theme', 'dark-theme');
            panel.classList.add(`${theme}-theme`);
        }
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    function addGlobalStyles() {
        if (document.getElementById('oc-planner-styles')) return;

        GM_addStyle(`
        :root {
            --ocp-light-bg: #f2f2f2; --ocp-light-content-bg: #ffffff; --ocp-light-header-bg: #e1e1e1; --ocp-light-border: #ccc; --ocp-light-text: #333; --ocp-light-text-label: #555; --ocp-light-input-bg: #fff; --ocp-light-input-border: #ccc; --ocp-light-fieldset-bg: #fafafa;
            --ocp-dark-bg: #2d2d2d; --ocp-dark-content-bg: #333333; --ocp-dark-header-bg: #222222; --ocp-dark-border: #555; --ocp-dark-text: #ddd; --ocp-dark-text-label: #bbb; --ocp-dark-input-bg: #444; --ocp-dark-input-border: #666; --ocp-dark-fieldset-bg: #383838;
        }

        .${HIGHLIGHT_CLASS},
        .${PRIORITY_HIGHLIGHT_CLASS} {
            border: 3px solid #1E90FF !important; /* A vibrant, accessible blue (Dodger Blue) */
            box-shadow: 0 0 8px #1E90FF !important;
            background-color: rgba(30, 144, 255, 0.1) !important; /* A light tint of the same blue */
        }

        /* HIDDEN OC STYLING FOR ADMINS */
        .oc-planner-hidden-admin {
            opacity: 0.5;
            filter: grayscale(80%);
            border: 2px dashed #999 !important;
            position: relative;
        }
        .oc-planner-hidden-admin::after {
            content: "HIDDEN";
            position: absolute;
            top: 5px;
            right: 5px;
            background: #333;
            color: #fff;
            padding: 2px 5px;
            font-size: 10px;
            border-radius: 3px;
            font-weight: bold;
        }

        .${HIGHLIGHT_CLASS} .contentLayer___IYFdz, .${PRIORITY_HIGHLIGHT_CLASS} .contentLayer___IYFdz { border-radius: inherit; }
        #${OPEN_BUTTON_ID} { margin-left: 15px; vertical-align: middle; position: relative; top: 11px; }

        /* --- Panel General Styles --- */
        #${OC_PLANNER_PANEL_ID} { display: none; position: fixed; width: 90%; max-width: 900px; height: 80vh; max-height: 800px; top: 10vh; left: 0; right: 0; margin: auto; z-index: 100000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 8px; overflow: hidden; }
        .light-theme { background: var(--ocp-light-bg); color: var(--ocp-light-text); border: 1px solid var(--ocp-light-border); }
        .dark-theme { background: var(--ocp-dark-bg); color: var(--ocp-dark-text); border: 1px solid var(--ocp-dark-border); }
        #oc-planner-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; font-size: 18px; font-weight: bold; user-select: none; }
        .light-theme #oc-planner-header { background: var(--ocp-light-header-bg); border-bottom: 1px solid var(--ocp-light-border); }
        .dark-theme #oc-planner-header { background: var(--ocp-dark-header-bg); border-bottom: 1px solid var(--ocp-dark-border); }
        #oc-planner-header h2 { margin: 0; font-size: 16px; }

        /* --- Panel Header Controls (Close & Theme) --- */
        .oc-planner-header-controls { display: flex; align-items: center; gap: 12px; }
        #oc-planner-close-btn, #oc-theme-toggle-btn { background: transparent; border: none; font-weight: bold; cursor: pointer; opacity: 0.6; transition: all 0.2s; padding: 0; }
        #oc-planner-close-btn { font-size: 24px; line-height: 1; }
        #oc-theme-toggle-btn { font-size: 18px; }
        .light-theme #oc-planner-close-btn, .light-theme #oc-theme-toggle-btn { color: var(--ocp-light-text); }
        .dark-theme #oc-planner-close-btn, .dark-theme #oc-theme-toggle-btn { color: var(--ocp-dark-text); }
        #oc-planner-close-btn:hover, #oc-theme-toggle-btn:hover { opacity: 1; transform: scale(1.1); }


        /* --- Panel Content Styles --- */
        #oc-planner-content { padding: 20px; flex-grow: 1; overflow-y: auto; }
        .light-theme #oc-planner-content { background: var(--ocp-light-content-bg); }
        .dark-theme #oc-planner-content { background: var(--ocp-dark-content-bg); }
        #oc-planner-content::-webkit-scrollbar { width: 8px; }
        #oc-planner-content::-webkit-scrollbar-track { background: transparent; }
        .light-theme #oc-planner-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        .dark-theme #oc-planner-content::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }

        .oc-planner-section { margin-bottom: 25px; }
        .oc-planner-section h3 { margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid; font-size: 15px; }
        .light-theme .oc-planner-section h3 { border-color: var(--ocp-light-border); }
        .dark-theme .oc-planner-section h3 { border-color: var(--ocp-dark-border); }

        /* --- Form & Input Styles --- */
        #oc-admin-form-container { display: flex; flex-direction: column; gap: 15px; }
        #oc-admin-form-container fieldset { border: 1px solid; padding: 15px; border-radius: 6px; display: flex; flex-direction: column; gap: 10px; }
        .light-theme #oc-admin-form-container fieldset { border-color: var(--ocp-light-border); background: var(--ocp-light-fieldset-bg); }
        .dark-theme #oc-admin-form-container fieldset { border-color: var(--ocp-dark-border); background: var(--ocp-dark-fieldset-bg); }
        #oc-admin-form-container legend { font-weight: bold; padding: 0 8px; }
        #oc-admin-form-container .form-row { display: flex; align-items: center; gap: 10px; }
        #oc-admin-form-container label { width: 150px; font-weight: 500; font-size: 14px; }
        .light-theme #oc-admin-form-container label { color: var(--ocp-light-text-label); }
        .dark-theme #oc-admin-form-container label { color: var(--ocp-dark-text-label); }
        #oc-admin-form-container input { width: 80px; padding: 6px 10px; border-radius: 4px; border: 1px solid; transition: border-color 0.2s, box-shadow 0.2s; }
        .light-theme #oc-admin-form-container input { background: var(--ocp-light-input-bg); border-color: var(--ocp-light-input-border); color: var(--ocp-light-text); }
        .dark-theme #oc-admin-form-container input { background: var(--ocp-dark-input-bg); border-color: var(--ocp-dark-input-border); color: var(--ocp-dark-text); }
        #oc-admin-form-container input:focus { outline: none; border-color: #66afe9; box-shadow: 0 0 5px rgba(102,175,233,.6); }

        /* --- Footer and Buttons --- */
        #oc-planner-footer { padding: 12px 20px; display: flex; justify-content: flex-end; }
        .light-theme #oc-planner-footer { background: var(--ocp-light-header-bg); border-top: 1px solid var(--ocp-light-border); }
        .dark-theme #oc-planner-footer { background: var(--ocp-dark-header-bg); border-top: 1px solid var(--ocp-dark-border); }

        /* --- Popups (NOW INCLUDING LOADING POPUP) --- */
        #${SCROLL_PROMPT_ID}, #${NO_CRIMES_POPUP_ID}, #${LOADING_POPUP_ID} { display: flex; flex-direction: column; align-items: center; gap: 10px; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background-color: #fff3cd; color: #664d03; border: 1px solid #ffecb5; padding: 15px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 200001; font-size: 14px; text-align: center; pointer-events: auto; }
        #${SCROLL_PROMPT_ID} .priority-oc-links { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; } #${SCROLL_PROMPT_ID} a { text-decoration: none; }

        /* BTN Styling Helper */
        .oc-control-btn-container { margin-top: 5px; display:flex; gap: 5px; }
        .set-priority-btn { margin: 0 !important; }
        .set-hidden-btn { margin: 0 !important; background-color: #555; }
        `);
        document.head.appendChild(document.createElement('style')).id = 'oc-planner-styles';
    }

    // --- Loading & Warning Indicators ---
    function getLoadingPopup() {
        let el = document.getElementById(LOADING_POPUP_ID);
        if (!el) {
            el = document.createElement('div');
            el.id = LOADING_POPUP_ID;
            document.body.appendChild(el);
        }
        return el;
    }

    function showLoadingIndicator() {
        const div = getLoadingPopup();
        div.textContent = "Loading OC Script...";
    }

    function showInOcWarning() {
        const div = getLoadingPopup();
        div.innerHTML = `
            <strong>You're already in an active OC.</strong>
            <span>Do not leave your current crime.</span>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <button id="oc-force-load-btn" class="torn-btn">Load Script</button>
                <button id="oc-close-warning-btn" class="torn-btn">Close</button>
            </div>
        `;
        document.getElementById('oc-force-load-btn').addEventListener('click', () => {
             processAndHighlightOCs(true);
        });
        document.getElementById('oc-close-warning-btn').addEventListener('click', () => {
             scriptAborted = true; // Stop the script loop
             div.remove();
        });
    }

    function hideLoadingIndicator() { const div = document.getElementById(LOADING_POPUP_ID); if (div) div.remove(); }

    function showScrollPrompt(unloadedPriorities) { if (document.getElementById(SCROLL_PROMPT_ID)) return; const prompt = document.createElement('div'); prompt.id = SCROLL_PROMPT_ID; const allCards = Array.from(document.querySelectorAll(CRIME_CARD_SELECTOR)); const unloadedLinks = unloadedPriorities.filter(p => !allCards.some(c => c.dataset.ocId == p.id)).map(p => `<a href="https://www.torn.com/factions.php?step=your&type=1#/tab=crimes&crimeId=${p.id}" class="torn-btn">Go to OC #${p.id}</a>`).join(''); if (unloadedLinks) { prompt.innerHTML = `<span>A priority OC is not visible. Click to jump to it:</span><div class="priority-oc-links">${unloadedLinks}</div><button>OK</button>`; prompt.querySelector('button').onclick = () => { prompt.remove(); userDismissedPriorityPrompt = true; }; document.body.appendChild(prompt); } }
    function hideScrollPrompt() { const p = document.getElementById(SCROLL_PROMPT_ID); if (p) p.remove(); userDismissedPriorityPrompt = false; }
    function showNoCrimesPopup() { if (document.getElementById(NO_CRIMES_POPUP_ID)) return; const prompt = document.createElement('div'); prompt.id = NO_CRIMES_POPUP_ID; prompt.innerHTML = `<strong>If you're already in an OC, ignore this pop-up and stay there.</strong><br><br><span>No available OCs right now, Don't join an OC, Wait until you see one highlighted</span><button class="torn-btn">OK</button>`; prompt.querySelector('button').onclick = () => prompt.remove(); document.body.appendChild(prompt); }

    // --- BUTTON INJECTION ---
    function addAdminControls(crimeCard) {
        if (!isAdmin) return;
        const ocId = crimeCard.dataset.ocId;

        let container = crimeCard.querySelector('.oc-control-btn-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'oc-control-btn-container';
            crimeCard.querySelector('.panelBody___lWhwy').appendChild(container);
        }

        // --- Priority Button Logic ---
        let prioBtn = container.querySelector('.set-priority-btn');
        if (!prioBtn) { prioBtn = document.createElement('button'); prioBtn.className = 'torn-btn set-priority-btn'; container.appendChild(prioBtn); }

        const isPriority = PRIORITY_OCS.some(p => p.id == ocId);
        const currentPriority = PRIORITY_OCS.find(p => p.id == ocId);
        if (currentPriority) {
            prioBtn.textContent = `Prioritized (${currentPriority.target} mbrs)`;
            prioBtn.style.backgroundColor = '#7a0000';
            prioBtn.onclick = () => { PRIORITY_OCS = PRIORITY_OCS.filter(p => p.id !== ocId); savePriorityOCs(); };
        } else {
            prioBtn.textContent = "Prioritize";
            prioBtn.style.backgroundColor = '';
            prioBtn.onclick = () => {
                const currentMembers = crimeCard.querySelectorAll(FILLED_SLOT_SELECTOR).length;
                const target = prompt(`Prioritize until how many members?`, String(currentMembers + 1));
                const targetNum = parseInt(target, 10);
                if (target && !isNaN(targetNum) && targetNum > currentMembers) { PRIORITY_OCS.push({ id: ocId, target: targetNum, admin: currentUserId }); savePriorityOCs(); }
            };
        }

        // --- Hide Button Logic ---
        let hideBtn = container.querySelector('.set-hidden-btn');
        if (!hideBtn) { hideBtn = document.createElement('button'); hideBtn.className = 'torn-btn set-hidden-btn'; container.appendChild(hideBtn); }

        const isHidden = HIDDEN_OCS.some(h => h.id == ocId);
        if (isHidden) {
             hideBtn.textContent = "Unhide";
             hideBtn.style.backgroundColor = '#444'; // Different Grey
             hideBtn.onclick = () => { HIDDEN_OCS = HIDDEN_OCS.filter(h => h.id != ocId); saveHiddenOCs(); };
        } else {
             hideBtn.textContent = "Hide";
             hideBtn.style.backgroundColor = '#555';
             hideBtn.onclick = () => { HIDDEN_OCS.push({ id: ocId, admin: currentUserId }); saveHiddenOCs(); };
        }
    }

    function populateAdminForm() { const container = document.getElementById('oc-admin-form-container'); if (!container) return; let formHtml = ''; for (const crimeName in OC_REQUIREMENTS) { formHtml += `<fieldset><legend>${crimeName}</legend>`; for (const roleName in OC_REQUIREMENTS[crimeName]) { const rule = OC_REQUIREMENTS[crimeName][roleName]; formHtml += `<div class="form-row"><label>${roleName.replace(/_/g, ' ')}:</label><input type="text" data-crime="${crimeName}" data-role="${roleName}" data-type="min" placeholder="MIN CPR" value="${rule.min || ''}"><input type="text" data-crime="${crimeName}" data-role="${roleName}" data-type="max" placeholder="MAX CPR" value="${rule.max || ''}"></div>`; } formHtml += `</fieldset>`; } container.innerHTML = formHtml; }
    function handleSave() { const newRules = {}; const inputs = document.querySelectorAll('#oc-admin-form-container input'); inputs.forEach(input => { const { crime, role, type } = input.dataset; if (!newRules[crime]) newRules[crime] = {}; if (!newRules[crime][role]) newRules[crime][role] = {}; const value = input.value.trim(); if (value) newRules[crime][role][type] = parseInt(value, 10); }); if (confirm("Are you sure you want to overwrite the faction-wide OC rules?")) saveOCRequirements(newRules); }

    // --- --- --- INITIALIZATION & OBSERVATION LOGIC --- --- ---
    let observer = null;
    let debounceTimer = null;
    async function handleContentChange() { clearTimeout(debounceTimer); debounceTimer = setTimeout(async () => { if (document.querySelector(BUTTON_TARGET_SELECTOR)) { initializeUI(); await processAndHighlightOCs(); } }, 150); }
    function startObserver() { const crimesRootNode = document.getElementById('faction-crimes-root'); if (crimesRootNode) { handleContentChange(); observer = new MutationObserver(handleContentChange); observer.observe(crimesRootNode, { childList: true, subtree: true, attributes: true }); } else { setTimeout(startObserver, 500); } }

    startObserver();

})();