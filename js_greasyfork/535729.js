// ==UserScript==
// @name            Torn Jail Dynamic Reloader (Hash-Triggered)
// @namespace       TornJailDynamicReloader
// @version         1.2.45
// @description     Dynamically reloads the jail list on Torn.com. Adds advanced filters (including score, with dual range sliders), manual refresh, quick bust/bail, and settings GUI with info tooltips. Improved refresh reliability.
// @author          GNSC4 [268863]
// @match           https://www.torn.com/jailview.php*
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @connect         api.torn.com
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/535729/Torn%20Jail%20Dynamic%20Reloader%20%28Hash-Triggered%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535729/Torn%20Jail%20Dynamic%20Reloader%20%28Hash-Triggered%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration Constants ---
    const SCRIPT_NAME = 'Torn Jail Reloader';
    const SCRIPT_VERSION = typeof GM_info !== 'undefined' ? GM_info.script.version : '1.2.45';

    const OBSERVED_PARENT_SELECTOR = '.userlist-wrapper';
    const PLAYER_LIST_CONTAINER_SELECTOR = '.users-list';
    const PLAYER_ITEMS_QUERY_SELECTOR = ':scope > li';
    const LOADING_SPINNER_SELECTOR = '.torn-loader, .ajax-preloader';
    const NOBODY_IN_JAIL_TEXT = "nobody is in jail";

    const MANUAL_REFRESH_BUTTON_ID = 'userscriptRefreshJailBtn';
    const MANUAL_REFRESH_BUTTON_TEXT = 'Refresh List';
    const MANUAL_REFRESH_BUTTON_LOADING_TEXT = 'Refreshing...';
    const SETTINGS_BUTTON_ID = 'userscriptSettingsBtn';
    const SETTINGS_MODAL_ID = 'userscriptSettingsModal';
    const NO_VISIBLE_PLAYERS_REFRESH_ID = 'userscriptNoPlayersRefreshBtn';
    const JAIL_TIME_REGEX = /(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/;
    const BAIL_COST_PER_MINUTE_PER_LEVEL = 100;

    // Slider configurations (absolute min/max for the range)
    const LEVEL_ABS_MIN = 1;
    const LEVEL_ABS_MAX = 100;
    const LEVEL_SLIDER_STEP = 1;

    const TIME_ABS_MIN = 0;
    const TIME_ABS_MAX = 4320; // 72 hours * 60 minutes
    const TIME_SLIDER_STEP = 10;

    const SCORE_ABS_MIN = 0;
    const SCORE_ABS_MAX = 5000;
    const SCORE_SLIDER_STEP = 10;


    // --- Mutable Settings (with defaults) ---
    let currentRefreshIntervalSeconds = 60;
    let autoRefreshEnabled = true;
    let filterSettings = {
        apiKey: '',
        nameId: '',
        minLevel: String(LEVEL_ABS_MIN),
        maxLevel: String(LEVEL_ABS_MAX),
        reason: '',
        minTimeMinutes: String(TIME_ABS_MIN),
        maxTimeMinutes: String(TIME_ABS_MAX),
        minScore: String(SCORE_ABS_MIN),
        maxScore: String(SCORE_ABS_MAX),
        factionName: '',
        maxBailCost: '',
        bailReductionPercent: '0',
        apiFetchedBailReduction: null,
        enableQuickBust: true,
        enableQuickBail: true
    };

    // --- Script State ---
    let refreshIntervalId = null;
    let isRefreshing = false;
    let expectingListUpdate = false;
    let listMutationObserver = null;
    let applyFiltersTimeout = null;
    const OBSERVER_DEBOUNCE_MS = 250;
    let ignoreNextObserverExternalTrigger = false;

    let initialLoadPollInterval = null;
    let initialLoadPollAttempts = 0;
    const MAX_INITIAL_LOAD_POLL_ATTEMPTS = 12;
    const INITIAL_LOAD_POLL_DELAY = 300;

    let applyFiltersRetryCount = 0;
    const MAX_APPLY_FILTERS_RETRIES = 4;
    const APPLY_FILTERS_RETRY_DELAY = 150;
    let currentRfcvToken = null;

    function log(message, ...optionalParams) {
        console.log(`${SCRIPT_NAME} (v${SCRIPT_VERSION}): ${message}`, ...optionalParams);
    }
    function logWarn(message, ...optionalParams) {
        console.warn(`${SCRIPT_NAME} (v${SCRIPT_VERSION}): ${message}`, ...optionalParams);
    }
    function logError(message, errorObj = null, ...optionalParams) {
        console.error(`${SCRIPT_NAME} (v${SCRIPT_VERSION}): ${message}`, errorObj || '', ...optionalParams);
    }

    function getCookie(name) {
        const nameRegex = new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)");
        const matches = document.cookie.match(nameRegex);
        return matches ? decodeURIComponent(matches[1]) : null;
    }

    function updateRfcvToken() {
        const foundToken = getCookie('rfc_v');
        if (foundToken) {
            if (currentRfcvToken !== foundToken) {
                log(`Updated RFC_V token from cookie: ${foundToken}`);
            }
            currentRfcvToken = foundToken;
        } else {
            if (currentRfcvToken !== null) {
                logWarn("RFC_V token cookie (named 'rfc_v') no longer found.");
            }
            currentRfcvToken = null;
        }
    }

    function loadSettings() {
        currentRefreshIntervalSeconds = parseInt(GM_getValue('refreshIntervalSeconds', 60), 10);
        if (isNaN(currentRefreshIntervalSeconds) || currentRefreshIntervalSeconds < 0) currentRefreshIntervalSeconds = 60;
        autoRefreshEnabled = GM_getValue('autoRefreshEnabled', true) === true;

        filterSettings.apiKey = GM_getValue('apiKey', '');
        filterSettings.nameId = GM_getValue('filterNameId', '');
        filterSettings.minLevel = GM_getValue('filterMinLevel', String(LEVEL_ABS_MIN));
        filterSettings.maxLevel = GM_getValue('filterMaxLevel', String(LEVEL_ABS_MAX));
        filterSettings.reason = GM_getValue('filterReason', '');
        filterSettings.minTimeMinutes = GM_getValue('filterMinTimeMinutes', String(TIME_ABS_MIN));
        filterSettings.maxTimeMinutes = GM_getValue('filterMaxTimeMinutes', String(TIME_ABS_MAX));
        filterSettings.minScore = GM_getValue('filterMinScore', String(SCORE_ABS_MIN));
        filterSettings.maxScore = GM_getValue('filterMaxScore', String(SCORE_ABS_MAX));
        filterSettings.factionName = GM_getValue('filterFactionName', '');
        filterSettings.maxBailCost = GM_getValue('filterMaxBailCost', '');
        filterSettings.bailReductionPercent = GM_getValue('filterBailReductionPercent', '0');
        filterSettings.apiFetchedBailReduction = null;
        filterSettings.enableQuickBust = GM_getValue('enableQuickBust', true) === true;
        filterSettings.enableQuickBail = GM_getValue('enableQuickBail', true) === true;
        log(`Loaded settings. API Key Present: ${!!filterSettings.apiKey}, QuickBust: ${filterSettings.enableQuickBust}, QuickBail: ${filterSettings.enableQuickBail}, Persisted Bail Reduction: ${filterSettings.bailReductionPercent}%`);
    }

    function saveSettings() {
        GM_setValue('refreshIntervalSeconds', currentRefreshIntervalSeconds);
        GM_setValue('autoRefreshEnabled', autoRefreshEnabled);
        GM_setValue('apiKey', filterSettings.apiKey);
        GM_setValue('filterNameId', filterSettings.nameId);
        GM_setValue('filterMinLevel', filterSettings.minLevel);
        GM_setValue('filterMaxLevel', filterSettings.maxLevel);
        GM_setValue('filterReason', filterSettings.reason);
        GM_setValue('filterMinTimeMinutes', filterSettings.minTimeMinutes);
        GM_setValue('filterMaxTimeMinutes', filterSettings.maxTimeMinutes);
        GM_setValue('filterMinScore', filterSettings.minScore);
        GM_setValue('filterMaxScore', filterSettings.maxScore);
        GM_setValue('filterFactionName', filterSettings.factionName);
        GM_setValue('filterMaxBailCost', filterSettings.maxBailCost);
        GM_setValue('filterBailReductionPercent', filterSettings.bailReductionPercent);
        GM_setValue('enableQuickBust', filterSettings.enableQuickBust);
        GM_setValue('enableQuickBail', filterSettings.enableQuickBail);
        log(`Saved settings. Persisted Bail Reduction: ${filterSettings.bailReductionPercent}%`);
    }

    async function fetchAndApplyPerksFromApi() {
        const apiKey = filterSettings.apiKey;
        if (!apiKey) {
            updateApiStatus("API Key is missing.", true);
            return;
        }
        updateApiStatus("Fetching perks...", false);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=perks&key=${apiKey}`,
            timeout: 15000,
            onload: function(response) {
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.error) {
                        logError("Torn API Error:", json.error);
                        updateApiStatus(`API Error: ${json.error.error || 'Unknown error code ' + json.error.code }. Check API key & permissions.`, true);
                        filterSettings.apiFetchedBailReduction = null;
                        return;
                    }

                    let totalReduction = 0;
                    let perksFound = false;
                    const knownPerkCategories = [
                        "faction_perks", "job_perks", "property_perks",
                        "education_perks", "enhancer_perks", "book_perks",
                        "stock_perks", "merit_perks"
                    ];

                    knownPerkCategories.forEach(categoryKey => {
                        const perkArray = json[categoryKey];
                        if (perkArray && Array.isArray(perkArray)) {
                            perksFound = true;
                            perkArray.forEach(perkString => {
                                if (typeof perkString !== 'string') return;
                                const simpleBailRegex = /(\d+\.?\d*|\.\d+)%/i;
                                const simpleMatch = perkString.match(simpleBailRegex);
                                if (simpleMatch && simpleMatch[1]) {
                                    const perkStringLower = perkString.toLowerCase();
                                    const keywordsPresent = perkStringLower.includes("bail cost") ||
                                                            perkStringLower.includes("decrease in bail") ||
                                                            perkStringLower.includes("bail reduction");
                                    if (keywordsPresent) {
                                        const reductionValue = parseFloat(simpleMatch[1]);
                                        if (!isNaN(reductionValue)) totalReduction += reductionValue;
                                        else logWarn(`Could not parse reduction value from: ${simpleMatch[1]} in perk: "${perkString}"`);
                                    }
                                }
                            });
                        }
                    });

                    if (json.company_perks && typeof json.company_perks === 'object' && !Array.isArray(json.company_perks)) {
                        perksFound = true;
                        Object.values(json.company_perks).forEach(companyPerkCategoryArray => {
                            if (Array.isArray(companyPerkCategoryArray)) {
                                companyPerkCategoryArray.forEach(perkString => {
                                     if (typeof perkString !== 'string') return;
                                    const simpleBailRegex = /(\d+\.?\d*|\.\d+)%/i;
                                    const simpleMatch = perkString.match(simpleBailRegex);
                                    if (simpleMatch && simpleMatch[1]) {
                                        const perkStringLower = perkString.toLowerCase();
                                        const keywordsPresent = perkStringLower.includes("bail cost") || perkStringLower.includes("decrease in bail") || perkStringLower.includes("bail reduction");
                                        if (keywordsPresent) {
                                            const reductionValue = parseFloat(simpleMatch[1]);
                                            if (!isNaN(reductionValue)) totalReduction += reductionValue;
                                        }
                                    }
                                });
                            }
                        });
                    }

                    if (!perksFound && Object.keys(json).length > 0 && !json.perks && !json.job_perks && !json.faction_perks) {
                         logWarn("No relevant perk categories found in API response.");
                         updateApiStatus("No bail reduction perks found in API data. Manual reduction will be used.", true);
                         filterSettings.apiFetchedBailReduction = null;
                    } else if (!perksFound && Object.keys(json).length === 0) {
                        logWarn("Empty API response. No perk data found.");
                        updateApiStatus("No perk data found (empty response). Manual reduction will be used.", true);
                        filterSettings.apiFetchedBailReduction = null;
                    }
                    else {
                         updateApiStatus(`Successfully fetched perks. Total Bail Reduction: ${totalReduction.toFixed(1)}%`, false);
                         log(`Total calculated reduction from API: ${totalReduction}`);
                         filterSettings.apiFetchedBailReduction = totalReduction;
                         filterSettings.bailReductionPercent = totalReduction.toFixed(1);
                         saveSettings();
                    }

                    const bailReductionInput = document.getElementById('userscriptFilterBailReduction');
                    if (bailReductionInput) {
                        const valueToShow = filterSettings.apiFetchedBailReduction !== null ? filterSettings.apiFetchedBailReduction.toFixed(1) : filterSettings.bailReductionPercent;
                        bailReductionInput.value = valueToShow;
                    }

                    applyFilters();
                } catch (e) {
                    logError("Error parsing API response:", e);
                    updateApiStatus("Error parsing API response.", true);
                    filterSettings.apiFetchedBailReduction = null;
                }
            },
            onerror: function(error) {
                logError("GM_xmlhttpRequest error (API):", error);
                updateApiStatus("Network error or request blocked.", true);
                filterSettings.apiFetchedBailReduction = null;
            },
            ontimeout: function() {
                logError("API request timed out.");
                updateApiStatus("API request timed out.", true);
                filterSettings.apiFetchedBailReduction = null;
            }
        });
    }

    function updateApiStatus(message, isError = false) {
        const statusEl = document.getElementById('userscriptApiStatus');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.color = isError ? 'red' : 'lightgreen';
        }
    }

    function extractPlayerData(liElement) {
        const data = { name: '', id: '', level: 0, reason: '', timeMinutes: null, score: 0, faction: '', calculatedBailCost: null };
        try {
            const nameLink = liElement.querySelector('a.user.name[href*="profiles.php?XID="]');
            if (nameLink) {
                const nameText = nameLink.textContent.trim();
                const idMatch = nameLink.href.match(/XID=(\d+)/);
                if (idMatch && idMatch[1]) data.id = idMatch[1];
                const nameMatch = nameText.match(/(.*)\[\d+\]/);
                data.name = nameMatch ? nameMatch[1].trim() : nameText;
            } else {
                const genericNameLink = liElement.querySelector('a[href*="profiles.php?XID="]');
                if(genericNameLink) {
                    const nameText = genericNameLink.textContent.trim();
                    const idMatch = genericNameLink.href.match(/XID=(\d+)/);
                    if (idMatch && idMatch[1]) data.id = idMatch[1];
                    const nameMatch = nameText.match(/(.*)\[\d+\]/);
                    data.name = nameMatch ? nameMatch[1].trim() : nameText;
                }
            }

            const levelElement = liElement.querySelector('span.level');
            if (levelElement) {
                const levelText = levelElement.textContent.replace(/LEVEL\s*:\s*/i, '').trim();
                data.level = parseInt(levelText, 10) || 0;
            }

            const reasonElement = liElement.querySelector('span.reason');
            if (reasonElement) data.reason = reasonElement.textContent.trim().toLowerCase();

            const timeElement = liElement.querySelector('span.time');
            if (timeElement) {
                const timeTextContent = timeElement.textContent.replace(/TIME\s*:\s*/i, '').trim().toLowerCase();
                if (timeTextContent.includes("less than a minute")) {
                    data.timeMinutes = 0;
                } else {
                    const timeMatch = timeTextContent.match(JAIL_TIME_REGEX);
                    if (timeMatch) {
                        data.timeMinutes = (parseInt(timeMatch[1], 10) || 0) * 60 + (parseInt(timeMatch[2], 10) || 0);
                    }
                }
            }

            if (data.level > 0 && data.timeMinutes !== null) {
                const hoursInJail = Math.floor(data.timeMinutes / 60);
                data.score = data.level * (hoursInJail + 3);
            }


            if (data.timeMinutes !== null && data.level > 0) {
                const baseBailCost = data.timeMinutes * data.level * BAIL_COST_PER_MINUTE_PER_LEVEL;
                const reductionPercentToUse = filterSettings.apiFetchedBailReduction !== null ?
                                              filterSettings.apiFetchedBailReduction :
                                              parseFloat(filterSettings.bailReductionPercent);
                const parsedReductionPercent = parseFloat(reductionPercentToUse);
                const effectiveReduction = (isNaN(parsedReductionPercent) || parsedReductionPercent < 0) ? 0 : Math.min(100, parsedReductionPercent);
                const reductionMultiplier = (100 - effectiveReduction) / 100;
                data.calculatedBailCost = Math.round(baseBailCost * reductionMultiplier);
            }

            const factionLink = liElement.querySelector('a.user.faction[href*="factions.php?step=profile"]');
            if (factionLink) {
                const factionImg = factionLink.querySelector('img[title]');
                data.faction = (factionImg && factionImg.title) ? factionImg.title.trim() : factionLink.textContent.trim();
            }
        } catch (e) { logError("Error extracting player data for element:", e, liElement); }
        return data;
    }

    function setupQuickActionHandlers(liElement) {
        const originalBustLink = liElement.querySelector("a.bust[href*='step=breakout']");
        const originalBailLink = liElement.querySelector("a.bye[href*='step=buy']");

        if (originalBustLink) {
            let bustHref = originalBustLink.getAttribute('href');
            if (filterSettings.enableQuickBust) {
                if (bustHref.includes('step=breakout') && !bustHref.includes('step=breakout1')) {
                    bustHref = bustHref.replace('step=breakout', 'step=breakout1');
                }
                bustHref = bustHref.replace(/&?ajax=1/g, '').replace(/&?timestamp=\d+/g, '');
                bustHref = bustHref.replace(/\?&/, '?').replace(/&&/, '&');
                if (bustHref.endsWith('?') || bustHref.endsWith('&')) bustHref = bustHref.slice(0, -1);
                if (originalBustLink.href !== bustHref) originalBustLink.href = bustHref;
            } else {
                if (bustHref.includes('step=breakout1')) {
                    bustHref = bustHref.replace('step=breakout1', 'step=breakout');
                }
                if (originalBustLink.href !== bustHref) originalBustLink.href = bustHref;
            }
        }

        if (originalBailLink) {
            let bailHref = originalBailLink.getAttribute('href');
            if (filterSettings.enableQuickBail) {
                if (bailHref.includes('step=buy') && !bailHref.includes('step=buy1')) {
                    bailHref = bailHref.replace('step=buy', 'step=buy1');
                }
                bailHref = bailHref.replace(/&?ajax=1/g, '').replace(/&?timestamp=\d+/g, '');
                bailHref = bailHref.replace(/\?&/, '?').replace(/&&/, '&');
                if (bailHref.endsWith('?') || bailHref.endsWith('&')) bailHref = bailHref.slice(0, -1);
                if (originalBailLink.href !== bailHref) originalBailLink.href = bailHref;
            } else {
                if (bailHref.includes('step=buy1')) {
                    bailHref = bailHref.replace('step=buy1', 'step=buy');
                }
                if (originalBailLink.href !== bailHref) originalBailLink.href = bailHref;
            }
        }
    }

    function removeNoVisiblePlayersRefreshButton() {
        const existingButtonWrapper = document.getElementById(NO_VISIBLE_PLAYERS_REFRESH_ID + "-wrapper");
        if (existingButtonWrapper) {
            existingButtonWrapper.remove();
        }
    }

    function showNoVisiblePlayersRefreshButton() {
        removeNoVisiblePlayersRefreshButton();

        const playerListContainer = document.querySelector(PLAYER_LIST_CONTAINER_SELECTOR);
        if (!playerListContainer) {
            logWarn("Cannot add 'No Visible Players Refresh Button': Player list container not found.");
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.id = NO_VISIBLE_PLAYERS_REFRESH_ID + "-wrapper";
        wrapper.className = 'userscript-no-players-refresh-wrapper';

        const button = document.createElement('button');
        button.id = NO_VISIBLE_PLAYERS_REFRESH_ID;
        button.textContent = 'No Targets - Refresh List';
        button.className = 'torn-btn btn userscript-btn';
        button.addEventListener('click', () => {
            if (!isRefreshing) {
                log("Inline 'No Targets' refresh button clicked.");
                runRefreshCycle();
            }
        });
        if (isRefreshing) {
            button.disabled = true;
            button.textContent = MANUAL_REFRESH_BUTTON_LOADING_TEXT;
        }

        wrapper.appendChild(button);
        playerListContainer.appendChild(wrapper);
        log("Added 'No Targets - Refresh List' button.");
    }


    function applyFilters(isInternalRetry = false) {
        removeNoVisiblePlayersRefreshButton();

        if (!isInternalRetry) {
            applyFiltersRetryCount = 0;
        } else {
            log(`Applying filters (Retry ${applyFiltersRetryCount}/${MAX_APPLY_FILTERS_RETRIES})...`);
        }

        const userlistWrapper = document.querySelector(OBSERVED_PARENT_SELECTOR);
        if (!userlistWrapper) {
            logWarn(`ApplyFilters: Userlist wrapper ('${OBSERVED_PARENT_SELECTOR}') not found.`);
             if (initialLoadPollInterval) { clearInterval(initialLoadPollInterval); initialLoadPollInterval = null; }
            return false;
        }

        const playerListContainer = userlistWrapper.querySelector(PLAYER_LIST_CONTAINER_SELECTOR);
        if (!playerListContainer) {
            logWarn(`ApplyFilters: Player list container ('${PLAYER_LIST_CONTAINER_SELECTOR}') not found within wrapper. Aborting.`);
            if (initialLoadPollInterval) { clearInterval(initialLoadPollInterval); initialLoadPollInterval = null; }
            return false;
        }

        const isLoaderPresent = !!(playerListContainer.querySelector(LOADING_SPINNER_SELECTOR) || userlistWrapper.querySelector(LOADING_SPINNER_SELECTOR));
        const players = playerListContainer.querySelectorAll(PLAYER_ITEMS_QUERY_SELECTOR);
        const hasPlayerItems = players.length > 0;
        const isConfirmedEmpty = playerListContainer.textContent.toLowerCase().includes(NOBODY_IN_JAIL_TEXT);


        if (isLoaderPresent) {
            log("ApplyFilters: Torn's loader present. Aborting filter pass.");
            if (initialLoadPollInterval) { clearInterval(initialLoadPollInterval); initialLoadPollInterval = null; }
            applyFiltersRetryCount = 0;
            return false;
        }

        if (!hasPlayerItems && !isConfirmedEmpty) {
            if (applyFiltersRetryCount === 0 && !isInternalRetry) {
                // logWarn(`ApplyFilters: No player items and not confirmed empty...`);
            }
            if (applyFiltersRetryCount < MAX_APPLY_FILTERS_RETRIES) {
                applyFiltersRetryCount++;
                log(`ApplyFilters: No player items and not confirmed empty. Retrying in ${APPLY_FILTERS_RETRY_DELAY}ms (Attempt ${applyFiltersRetryCount}/${MAX_APPLY_FILTERS_RETRIES}).`);
                setTimeout(() => applyFilters(true), APPLY_FILTERS_RETRY_DELAY);
            } else {
                logWarn("ApplyFilters: Max retries reached. No player items and not confirmed empty. Aborting filter pass.");
                if (initialLoadPollInterval) { clearInterval(initialLoadPollInterval); initialLoadPollInterval = null; }
                applyFiltersRetryCount = 0;
            }
            return false;
        }

        if (initialLoadPollInterval) {
            clearInterval(initialLoadPollInterval);
            initialLoadPollInterval = null;
            log("ApplyFilters: Successfully applied filters during initial load poll. Stopping poll.");
        }
        applyFiltersRetryCount = 0;

        log(`ApplyFilters: Found ${players.length} player items to filter/setup.`);
        let visibleCount = 0;

        const fNameId = filterSettings.nameId.toLowerCase();
        const fReason = filterSettings.reason.toLowerCase();
        const fMinLvl = filterSettings.minLevel !== '' ? parseInt(filterSettings.minLevel, 10) : null;
        const fMaxLvl = filterSettings.maxLevel !== '' ? parseInt(filterSettings.maxLevel, 10) : null;
        const fMinTime = filterSettings.minTimeMinutes !== '' ? parseInt(filterSettings.minTimeMinutes, 10) : null;
        const fMaxTime = filterSettings.maxTimeMinutes !== '' ? parseInt(filterSettings.maxTimeMinutes, 10) : null;
        const fMinScore = filterSettings.minScore !== '' ? parseInt(filterSettings.minScore, 10) : null;
        const fMaxScore = filterSettings.maxScore !== '' ? parseInt(filterSettings.maxScore, 10) : null;
        const fFaction = filterSettings.factionName.toLowerCase();
        const fMaxBail = filterSettings.maxBailCost !== '' ? parseInt(filterSettings.maxBailCost.replace(/,/g, ''), 10) : null;

        players.forEach(li => {
            const pData = extractPlayerData(li);
            setupQuickActionHandlers(li);

            let matches = true;

            if (fNameId && !(pData.name.toLowerCase().includes(fNameId) || pData.id.includes(fNameId))) matches = false;
            if (matches && fMinLvl !== null && pData.level < fMinLvl) matches = false;
            if (matches && fMaxLvl !== null && pData.level > fMaxLvl) matches = false;
            if (matches && fReason && !pData.reason.includes(fReason)) matches = false;

            if (matches) {
                if (pData.timeMinutes !== null) {
                    if (fMinTime !== null && pData.timeMinutes < fMinTime) matches = false;
                    if (matches && fMaxTime !== null && pData.timeMinutes > fMaxTime) matches = false;
                } else {
                    if (fMinTime !== null && fMinTime > 0) matches = false;
                }
            }

            if (matches && fMinScore !== null && pData.score < fMinScore) matches = false;
            if (matches && fMaxScore !== null && pData.score > fMaxScore) matches = false;


            if (matches && fFaction && !pData.faction.toLowerCase().includes(fFaction)) matches = false;

            if (matches && fMaxBail !== null) {
                if (pData.calculatedBailCost === null || pData.calculatedBailCost > fMaxBail) {
                    matches = false;
                }
            }

            li.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });
        log(`ApplyFilters: Filtering & Quick Action setup complete. ${visibleCount} players visible.`);

        if (visibleCount === 0 && players.length > 0 && !isConfirmedEmpty) {
            showNoVisiblePlayersRefreshButton();
        }

        return true;
    }

    function resetRefreshState() {
        expectingListUpdate = false;
        if (isRefreshing) {
            isRefreshing = false;
            log("Refresh cycle state has been reset (isRefreshing set to false).");
        }

        const refreshButton = document.getElementById(MANUAL_REFRESH_BUTTON_ID);
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = MANUAL_REFRESH_BUTTON_TEXT;
        }
        const noTargetsRefreshButton = document.getElementById(NO_VISIBLE_PLAYERS_REFRESH_ID);
        if (noTargetsRefreshButton) {
            noTargetsRefreshButton.disabled = false;
            noTargetsRefreshButton.textContent = 'No Targets - Refresh List';
        }

        ignoreNextObserverExternalTrigger = true;
        setTimeout(() => {
            ignoreNextObserverExternalTrigger = false;
        }, 100);
    }

    async function runRefreshCycle() {
        if (isRefreshing) {
            logWarn("Refresh already in progress. Ignoring new request.");
            return;
        }
        isRefreshing = true;
        expectingListUpdate = true;
        log("Triggering refresh, expecting list update.");

        removeNoVisiblePlayersRefreshButton();
        updateRfcvToken();

        const refreshButton = document.getElementById(MANUAL_REFRESH_BUTTON_ID);
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = MANUAL_REFRESH_BUTTON_LOADING_TEXT;
        }
        const noTargetsRefreshButton = document.getElementById(NO_VISIBLE_PLAYERS_REFRESH_ID);
        if (noTargetsRefreshButton) {
            noTargetsRefreshButton.disabled = true;
            noTargetsRefreshButton.textContent = MANUAL_REFRESH_BUTTON_LOADING_TEXT;
        }


        const originalHash = window.location.hash;
        let refreshTargetHash = originalHash.includes('start=') ? originalHash : (originalHash === '' ? '#start=0' : originalHash);
        if (!refreshTargetHash.includes('start=')) refreshTargetHash = '#start=0';

        let tempHash = '#_userscript_refresh_' + Date.now();
        if (tempHash === refreshTargetHash) {
            tempHash = '#_userscript_refresh_alt_' + Date.now();
        }

        window.location.hash = tempHash;

        setTimeout(() => {
            window.location.hash = refreshTargetHash;
            log(`Hash set to ${refreshTargetHash}. Observer will handle filtering and state reset.`);

            setTimeout(() => {
                if (expectingListUpdate || isRefreshing) {
                    logWarn("Refresh cycle fallback timeout: Resetting flags forcefully.");
                    resetRefreshState();
                    logWarn("Attempting a final applyFilters due to fallback timeout.");
                    applyFilters();
                }
            }, 5000);

        }, 200);
    }

    function applyRefreshSettings() {
        if (refreshIntervalId) clearInterval(refreshIntervalId);
        refreshIntervalId = null;
        if (autoRefreshEnabled && currentRefreshIntervalSeconds > 0) {
            refreshIntervalId = setInterval(runRefreshCycle, currentRefreshIntervalSeconds * 1000);
            log(`Auto-refresh ON. Interval: ${currentRefreshIntervalSeconds}s.`);
        } else {
            log("Auto-refresh OFF.");
        }
    }

    function createDualRangeSliderGroup(labelText, baseId, currentMinValue, currentMaxValue, absMin, absMax, step, unit = '', tooltipText = '') {
        const tooltipHtml = tooltipText ?
            `<span class="userscript-info-icon">ⓘ<span class="userscript-tooltip-text">${tooltipText}</span></span>` : '';
        return `
            <div class="userscript-form-group userscript-dual-range-slider-group" id="userscriptDualRangeGroup${baseId}">
                <label for="userscriptFilter${baseId}Min">${labelText}: ${tooltipHtml}</label>
                <div class="userscript-dual-range-controls">
                    <span id="userscriptFilter${baseId}MinValueDisplay" class="userscript-slider-value">${currentMinValue}${unit}</span>
                    <div class="userscript-dual-range-wrapper">
                        <div class="userscript-dual-range-track-bg"></div>
                        <div id="userscriptFilter${baseId}Fill" class="userscript-dual-range-fill"></div>
                        <input type="range" id="userscriptFilter${baseId}Min" class="userscript-range-min"
                               value="${currentMinValue}" min="${absMin}" max="${absMax}" step="${step}">
                        <input type="range" id="userscriptFilter${baseId}Max" class="userscript-range-max"
                               value="${currentMaxValue}" min="${absMin}" max="${absMax}" step="${step}">
                    </div>
                    <span id="userscriptFilter${baseId}MaxValueDisplay" class="userscript-slider-value">${currentMaxValue}${unit}</span>
                </div>
            </div>
        `;
    }


    function createSettingsModal() {
        if (document.getElementById(SETTINGS_MODAL_ID)) return;
        const modalHTML = `
            <div id="${SETTINGS_MODAL_ID}-overlay" class="userscript-modal-overlay"></div>
            <div id="${SETTINGS_MODAL_ID}" class="userscript-modal">
                <div class="userscript-modal-header">
                    <h2>Jail Reloader & Filter Settings (v${SCRIPT_VERSION})</h2>
                    <button id="${SETTINGS_MODAL_ID}-close" class="userscript-modal-close-btn">&times;</button>
                </div>
                <div class="userscript-modal-content">
                    <div class="userscript-modal-content-inner">
                        <fieldset class="userscript-fieldset">
                            <legend>API & Auto-Refresh</legend>
                            <div class="userscript-form-group">
                                <label for="userscriptApiKey">Torn API Key (Minimal Access for Perks):</label>
                                <input type="text" id="userscriptApiKey" placeholder="Your API Key" value="${filterSettings.apiKey}">
                                <button id="userscriptFetchPerksBtn" class="userscript-btn userscript-btn-blue">Fetch Perks via API</button>
                                <small id="userscriptApiStatus" class="userscript-api-status"></small>
                            </div>
                            <div class="userscript-form-group">
                                <label for="userscriptRefreshIntervalInput">Refresh Interval (seconds):</label>
                                <input type="number" id="userscriptRefreshIntervalInput" min="0" value="${currentRefreshIntervalSeconds}">
                            </div>
                            <div class="userscript-form-group">
                                <input type="checkbox" id="userscriptAutoRefreshEnabledCheckbox" ${autoRefreshEnabled ? 'checked' : ''}>
                                <label for="userscriptAutoRefreshEnabledCheckbox" class="userscript-checkbox-label">Enable Auto-refresh</label>
                            </div>
                        </fieldset>
                        <fieldset class="userscript-fieldset">
                            <legend>Quick Actions</legend>
                             <div class="userscript-form-group">
                                <input type="checkbox" id="userscriptEnableQuickBust" ${filterSettings.enableQuickBust ? 'checked' : ''}>
                                <label for="userscriptEnableQuickBust" class="userscript-checkbox-label">Enable Quick Bust (Modifies Link)</label>
                            </div>
                            <div class="userscript-form-group">
                                <input type="checkbox" id="userscriptEnableQuickBail" ${filterSettings.enableQuickBail ? 'checked' : ''}>
                                <label for="userscriptEnableQuickBail" class="userscript-checkbox-label">Enable Quick Bail (Modifies Link)</label>
                            </div>
                        </fieldset>
                        <fieldset class="userscript-fieldset">
                            <legend>Filters</legend>
                            <div class="userscript-form-group">
                                <label for="userscriptFilterNameId">Name / ID:</label>
                                <input type="text" id="userscriptFilterNameId" value="${filterSettings.nameId}">
                            </div>
                            ${createDualRangeSliderGroup('Level Range', 'Level', filterSettings.minLevel, filterSettings.maxLevel, LEVEL_ABS_MIN, LEVEL_ABS_MAX, LEVEL_SLIDER_STEP)}
                            ${createDualRangeSliderGroup('Time Range', 'Time', filterSettings.minTimeMinutes, filterSettings.maxTimeMinutes, TIME_ABS_MIN, TIME_ABS_MAX, TIME_SLIDER_STEP, ' min')}
                            ${createDualRangeSliderGroup('Score Range', 'Score', filterSettings.minScore, filterSettings.maxScore, SCORE_ABS_MIN, SCORE_ABS_MAX, SCORE_SLIDER_STEP, '', 'Score = Level * (Hours in Jail + 3)')}
                            <div class="userscript-form-group">
                                <label for="userscriptFilterMaxBailCost">Max Bail Cost ($): <span class="userscript-info-icon">ⓘ<span class="userscript-tooltip-text">Base Cost = (Time in Minutes * Level * ${BAIL_COST_PER_MINUTE_PER_LEVEL})<br>Final Cost = Base Cost * (1 - (Your Bail Reduction % / 100))</span></span></label>
                                <input type="text" id="userscriptFilterMaxBailCost" placeholder="e.g., 500,000" value="${filterSettings.maxBailCost}">
                            </div>
                            <div class="userscript-form-group">
                                <label for="userscriptFilterBailReduction">Your Bail Reduction (%):</label>
                                <input type="number" id="userscriptFilterBailReduction" min="0" max="100" step="0.1" placeholder="Manual or API fetched" value="${filterSettings.bailReductionPercent}">
                                <small>Enter manually or use "Fetch Perks". API value overrides this for calculation if successful.</small>
                            </div>
                            <div class="userscript-form-group">
                                <label for="userscriptFilterFactionName">Faction Name (contains):</label>
                                <input type="text" id="userscriptFilterFactionName" value="${filterSettings.factionName}">
                            </div>
                            <div class="userscript-form-group">
                                <label for="userscriptFilterReason">Reason (contains):</label>
                                <input type="text" id="userscriptFilterReason" value="${filterSettings.reason}">
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div class="userscript-modal-footer">
                    <button id="${SETTINGS_MODAL_ID}-save" class="userscript-btn userscript-btn-primary">Save Settings</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById(SETTINGS_MODAL_ID);
        const overlay = document.getElementById(`${SETTINGS_MODAL_ID}-overlay`);
        const closeButton = document.getElementById(`${SETTINGS_MODAL_ID}-close`);
        const saveButton = document.getElementById(`${SETTINGS_MODAL_ID}-save`);
        const fetchPerksButton = document.getElementById('userscriptFetchPerksBtn');

        fetchPerksButton.onclick = fetchAndApplyPerksFromApi;

        const setupDualRangeSliderListener = (baseId, unit = '', absMin, absMax) => {
            const minSlider = document.getElementById(`userscriptFilter${baseId}Min`);
            const maxSlider = document.getElementById(`userscriptFilter${baseId}Max`);
            const minDisplay = document.getElementById(`userscriptFilter${baseId}MinValueDisplay`);
            const maxDisplay = document.getElementById(`userscriptFilter${baseId}MaxValueDisplay`);
            const fill = document.getElementById(`userscriptFilter${baseId}Fill`);

            if (!minSlider || !maxSlider || !minDisplay || !maxDisplay || !fill) {
                logError(`Dual slider elements not found for baseId: ${baseId}`);
                return;
            }

            function updateVisuals() {
                const minValue = parseInt(minSlider.value, 10);
                const maxValue = parseInt(maxSlider.value, 10);
                const range = absMax - absMin;

                if (minValue > maxValue) {
                    minSlider.value = maxValue;
                }
                if (maxValue < minValue) {
                    maxSlider.value = minValue;
                }

                minDisplay.textContent = minSlider.value + unit;
                maxDisplay.textContent = maxSlider.value + unit;

                const minPercent = range === 0 ? 0 : ((parseInt(minSlider.value, 10) - absMin) / range) * 100;
                const maxPercent = range === 0 ? 0 : ((parseInt(maxSlider.value, 10) - absMin) / range) * 100;

                fill.style.left = `${minPercent}%`;
                fill.style.width = `${maxPercent - minPercent}%`;
            }

            minSlider.addEventListener('input', updateVisuals);
            maxSlider.addEventListener('input', updateVisuals);
            updateVisuals();
        };

        setupDualRangeSliderListener('Level', '', LEVEL_ABS_MIN, LEVEL_ABS_MAX);
        setupDualRangeSliderListener('Time', ' min', TIME_ABS_MIN, TIME_ABS_MAX);
        setupDualRangeSliderListener('Score', '', SCORE_ABS_MIN, SCORE_ABS_MAX);


        const maxBailInput = document.getElementById('userscriptFilterMaxBailCost');
        if (maxBailInput) {
            maxBailInput.addEventListener('input', (e) => {
                let rawValue = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            });
             maxBailInput.addEventListener('blur', (e) => {
                let rawValue = e.target.value.replace(/[^0-9]/g, '');
                if (rawValue) {
                    e.target.value = parseInt(rawValue, 10).toLocaleString('en-US');
                } else {
                    e.target.value = '';
                }
            });
        }
        const bailReductionInput = document.getElementById('userscriptFilterBailReduction');
        if (bailReductionInput) {
            bailReductionInput.addEventListener('input', (e) => {
                let value = e.target.value;
                if (!(/^(\d{1,2}(\.\d{0,1})?|100(\.0{0,1})?|)$/.test(value))) {
                     const storedValue = filterSettings.apiFetchedBailReduction !== null ?
                                         filterSettings.apiFetchedBailReduction.toFixed(1) :
                                         filterSettings.bailReductionPercent;
                    e.target.value = storedValue;
                }
            });
        }


        const closeModal = () => { modal.style.display = 'none'; overlay.style.display = 'none'; };
        overlay.onclick = closeModal;
        closeButton.onclick = closeModal;

        saveButton.onclick = () => {
            const newInterval = parseInt(document.getElementById('userscriptRefreshIntervalInput').value, 10);
            autoRefreshEnabled = document.getElementById('userscriptAutoRefreshEnabledCheckbox').checked;

            if (!isNaN(newInterval) && newInterval >= 0) {
                currentRefreshIntervalSeconds = newInterval;
            } else {
                document.getElementById('userscriptRefreshIntervalInput').value = currentRefreshIntervalSeconds;
            }

            if (autoRefreshEnabled && currentRefreshIntervalSeconds === 0) {
                logWarn("Auto-refresh is enabled, but the interval is 0. The list will not auto-refresh.");
            }

            filterSettings.apiKey = document.getElementById('userscriptApiKey').value.trim();
            filterSettings.nameId = document.getElementById('userscriptFilterNameId').value.trim();
            filterSettings.reason = document.getElementById('userscriptFilterReason').value.trim();
            filterSettings.factionName = document.getElementById('userscriptFilterFactionName').value.trim();

            filterSettings.minLevel = document.getElementById('userscriptFilterLevelMin').value;
            filterSettings.maxLevel = document.getElementById('userscriptFilterLevelMax').value;
            filterSettings.minTimeMinutes = document.getElementById('userscriptFilterTimeMin').value;
            filterSettings.maxTimeMinutes = document.getElementById('userscriptFilterTimeMax').value;
            filterSettings.minScore = document.getElementById('userscriptFilterScoreMin').value;
            filterSettings.maxScore = document.getElementById('userscriptFilterScoreMax').value;

            let rawMaxBail = document.getElementById('userscriptFilterMaxBailCost').value.replace(/,/g, '');
            filterSettings.maxBailCost = /^\d+$/.test(rawMaxBail) ? rawMaxBail : '';

            const currentBailReductionInputValue = document.getElementById('userscriptFilterBailReduction').value;
            const currentBailReductionFloat = parseFloat(currentBailReductionInputValue);

            if (filterSettings.apiFetchedBailReduction !== null &&
                (isNaN(currentBailReductionFloat) || currentBailReductionFloat.toFixed(1) !== filterSettings.apiFetchedBailReduction.toFixed(1))) {
                filterSettings.apiFetchedBailReduction = null;
                filterSettings.bailReductionPercent = (isNaN(currentBailReductionFloat) || currentBailReductionInputValue === '') ? '0' : currentBailReductionInputValue;
            } else if (filterSettings.apiFetchedBailReduction === null) {
                 filterSettings.bailReductionPercent = (isNaN(currentBailReductionFloat) || currentBailReductionInputValue === '') ? '0' : currentBailReductionInputValue;
            }

            filterSettings.enableQuickBust = document.getElementById('userscriptEnableQuickBust').checked;
            filterSettings.enableQuickBail = document.getElementById('userscriptEnableQuickBail').checked;

            saveSettings();
            applyRefreshSettings();
            applyFilters();
            closeModal();
        };
    }

    function showSettingsModal() {
        let modal = document.getElementById(SETTINGS_MODAL_ID);
        if (!modal) {
            createSettingsModal();
            modal = document.getElementById(SETTINGS_MODAL_ID);
        }

        document.getElementById('userscriptApiKey').value = filterSettings.apiKey;
        document.getElementById('userscriptRefreshIntervalInput').value = currentRefreshIntervalSeconds;
        document.getElementById('userscriptAutoRefreshEnabledCheckbox').checked = autoRefreshEnabled;
        document.getElementById('userscriptFilterNameId').value = filterSettings.nameId;
        document.getElementById('userscriptFilterReason').value = filterSettings.reason;
        document.getElementById('userscriptFilterFactionName').value = filterSettings.factionName;

        const maxBailDisplayValue = filterSettings.maxBailCost ? parseInt(filterSettings.maxBailCost, 10).toLocaleString('en-US') : '';
        document.getElementById('userscriptFilterMaxBailCost').value = maxBailDisplayValue;

        const bailReductionToShow = filterSettings.apiFetchedBailReduction !== null
                                    ? filterSettings.apiFetchedBailReduction.toFixed(1)
                                    : filterSettings.bailReductionPercent;
        document.getElementById('userscriptFilterBailReduction').value = bailReductionToShow;

        document.getElementById('userscriptEnableQuickBust').checked = filterSettings.enableQuickBust;
        document.getElementById('userscriptEnableQuickBail').checked = filterSettings.enableQuickBail;

        updateApiStatus('');

        const populateDualRangeSlider = (baseId, minValue, maxValue, unit = '', absMin, absMax) => {
            const minSlider = document.getElementById(`userscriptFilter${baseId}Min`);
            const maxSlider = document.getElementById(`userscriptFilter${baseId}Max`);
            const minDisplay = document.getElementById(`userscriptFilter${baseId}MinValueDisplay`);
            const maxDisplay = document.getElementById(`userscriptFilter${baseId}MaxValueDisplay`);
            const fill = document.getElementById(`userscriptFilter${baseId}Fill`);

            if (minSlider) minSlider.value = minValue;
            if (maxSlider) maxSlider.value = maxValue;
            if (minDisplay) minDisplay.textContent = minValue + unit;
            if (maxDisplay) maxDisplay.textContent = maxValue + unit;

            if (fill && minSlider && maxSlider) {
                const valMin = parseInt(minSlider.value, 10);
                const valMax = parseInt(maxSlider.value, 10);
                const range = absMax - absMin;
                const minPercent = range === 0 ? 0 : ((valMin - absMin) / range) * 100;
                const maxPercent = range === 0 ? 0 : ((valMax - absMin) / range) * 100;
                fill.style.left = `${minPercent}%`;
                fill.style.width = `${maxPercent - minPercent}%`;
            }
        };

        populateDualRangeSlider('Level', filterSettings.minLevel, filterSettings.maxLevel, '', LEVEL_ABS_MIN, LEVEL_ABS_MAX);
        populateDualRangeSlider('Time', filterSettings.minTimeMinutes, filterSettings.maxTimeMinutes, ' min', TIME_ABS_MIN, TIME_ABS_MAX);
        populateDualRangeSlider('Score', filterSettings.minScore, filterSettings.maxScore, '', SCORE_ABS_MIN, SCORE_ABS_MAX);

        document.getElementById(`${SETTINGS_MODAL_ID}-overlay`).style.display = 'block';
        modal.style.display = 'flex';
    }


    function addControlButtons() {
        const userlistWrapper = document.querySelector('.userlist-wrapper');
        if (userlistWrapper) {
            const usersListTitle = userlistWrapper.querySelector('.users-list-title, .title, h4, h5');
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'userscript-buttons-container';

            const settingsButton = document.createElement('button');
            settingsButton.textContent = 'Settings & Filters';
            settingsButton.id = SETTINGS_BUTTON_ID;
            settingsButton.className = 'torn-btn btn userscript-btn';
            settingsButton.onclick = showSettingsModal;

            const refreshButton = document.createElement('button');
            refreshButton.textContent = MANUAL_REFRESH_BUTTON_TEXT;
            refreshButton.id = MANUAL_REFRESH_BUTTON_ID;
            refreshButton.className = 'torn-btn btn userscript-btn';
            refreshButton.addEventListener('click', () => {
                if (!isRefreshing) runRefreshCycle();
            });

            buttonsContainer.appendChild(settingsButton);
            buttonsContainer.appendChild(refreshButton);

            if (usersListTitle && usersListTitle.parentNode === userlistWrapper) {
                userlistWrapper.insertBefore(buttonsContainer, usersListTitle);
            } else {
                logWarn("Could not find a suitable title element to insert buttons before, prepending to userlist-wrapper.");
                userlistWrapper.prepend(buttonsContainer);
            }
        } else logWarn("Could not find '.userlist-wrapper' to insert buttons.");
    }

    function addAllStyles() {
        GM_addStyle(`
            .userscript-buttons-container { display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 10px; }
            .userscript-btn {
                padding: 6px 12px !important; font-size: 12px !important; line-height: 1.5 !important;
                border-radius: 3px !important; cursor: pointer !important;
                font-weight: bold !important;
            }
            .userscript-btn-blue { /* New style for fetch perks button */
                background-color: #337ab7 !important; border: 1px solid #2e6da4 !important; color: white !important;
                padding: 4px 8px !important; font-size: 11px !important; margin-left: 10px; vertical-align: middle;
            }
            .userscript-btn-blue:hover { background-color: #286090 !important; border-color: #204d74 !important; }

            #${MANUAL_REFRESH_BUTTON_ID} { background-color: #5cb85c !important; border: 1px solid #4cae4c !important; color: white !important; }
            #${MANUAL_REFRESH_BUTTON_ID}:hover { background-color: #4cae4c !important; border-color: #398439 !important; }
            #${MANUAL_REFRESH_BUTTON_ID}[disabled] { background-color: #777 !important; border-color: #666 !important; opacity: 0.65; cursor: not-allowed !important; }
            #${SETTINGS_BUTTON_ID} { background-color: #f0ad4e !important; border: 1px solid #eea236 !important; color: white !important; }
            #${SETTINGS_BUTTON_ID}:hover { background-color: #ec971f !important; border-color: #d58512 !important; }

            .userscript-no-players-refresh-wrapper {
                width: 100%; display: flex; justify-content: flex-end; padding: 2px 2px 10px 0; box-sizing: border-box;
            }
            #${NO_VISIBLE_PLAYERS_REFRESH_ID} {
                background-color: #d9534f !important; border: 1px solid #d43f3a !important;
                color: white !important; padding: 8px 15px !important;
            }
            #${NO_VISIBLE_PLAYERS_REFRESH_ID}:hover {
                background-color: #c9302c !important; border-color: #ac2925 !important;
            }
             #${NO_VISIBLE_PLAYERS_REFRESH_ID}[disabled] {
                background-color: #777 !important; border-color: #666 !important; opacity: 0.65; cursor: not-allowed !important;
            }

            .userscript-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 9998; }
            .userscript-modal {
                position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
                background-color: #333; color: #f1f1f1; border: 1px solid #555; border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 9999;
                width: 90%; max-width: 600px; max-height: 90vh; display: none; flex-direction: column;
            }
            .userscript-modal-header { padding: 15px 20px; border-bottom: 1px solid #555; flex-shrink: 0; }
            .userscript-modal-header h2 { margin: 0; font-size: 18px; display: inline-block;}
            .userscript-modal-close-btn {
                background: none; border: none; font-size: 24px; font-weight: bold; color: #aaa;
                cursor: pointer; padding: 0; line-height: 1; float: right;
            }
            .userscript-modal-close-btn:hover { color: #fff; }
            .userscript-modal-content { overflow: hidden; flex-grow: 1; min-height: 0; display: flex; flex-direction: column; }
            .userscript-modal-content-inner { padding: 10px 20px 20px 20px; overflow-y: auto; width: 100%; box-sizing: border-box; }
            .userscript-modal-content .userscript-form-group { margin-bottom: 15px; }
            .userscript-modal-content .userscript-form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
            .userscript-modal-content .userscript-checkbox-label { display: inline-block; font-weight: normal; margin-left: 5px; vertical-align: middle; cursor: pointer; }
            .userscript-modal-content input[type="number"], .userscript-modal-content input[type="text"] {
                padding: 8px; border-radius: 3px; border: 1px solid #555;
                background-color: #444; color: #f1f1f1; width: calc(100% - 18px); box-sizing: border-box;
            }
            .userscript-modal-content input[type="number"]#userscriptRefreshIntervalInput { width: 80px; }
            /* Adjust API Key input width to accommodate the styled button */
            .userscript-modal-content input#userscriptApiKey { width: calc(100% - 160px - 10px); display: inline-block; vertical-align: middle; margin-right:5px; }
            .userscript-modal-content button#userscriptFetchPerksBtn { /* Now uses .userscript-btn-blue */ }
            .userscript-modal-content input#userscriptFilterMaxBailCost { width: 150px; }
            .userscript-modal-content input#userscriptFilterBailReduction { width: 120px; }
            .userscript-modal-content input[type="checkbox"] { width: auto; margin-right: 0; vertical-align: middle; cursor: pointer;}
            .userscript-modal-content small { display: block; font-size: 0.8em; color: #aaa; margin-top: 3px; }
            .userscript-api-status { display: inline-block; margin-left: 10px; font-size: 0.9em; vertical-align: middle; }
            .userscript-modal-footer { padding: 15px 20px; border-top: 1px solid #555; text-align: right; flex-shrink: 0; }
            .userscript-btn-primary { background-color: #5cb85c !important; border-color: #4cae4c !important; color: white !important;}
            .userscript-btn-primary:hover { background-color: #4cae4c !important; }
            .userscript-fieldset { border: 1px solid #555; border-radius: 4px; padding: 10px 15px 15px; margin-bottom: 20px; }
            .userscript-fieldset legend { font-weight: bold; padding: 0 5px; color: #f0ad4e; }

            .userscript-dual-range-slider-group { display: flex; flex-direction: column; gap: 5px; }
            .userscript-dual-range-slider-group > label { margin-bottom: 5px; display: block; }
            .userscript-dual-range-controls { display: flex; align-items: center; gap: 10px; width: 100%; }
            .userscript-dual-range-wrapper {
                position: relative; flex-grow: 1; height: 20px; display: flex; align-items: center;
            }
            .userscript-dual-range-track-bg {
                position: absolute; height: 6px; background-color: #555;
                width: 100%; border-radius: 3px; top: 50%; transform: translateY(-50%); z-index: 1;
            }
            .userscript-dual-range-fill {
                position: absolute; height: 6px; background-color: #f0ad4e;
                border-radius: 3px; top: 50%; transform: translateY(-50%); z-index: 2;
            }
            .userscript-range-min, .userscript-range-max {
                -webkit-appearance: none; appearance: none; width: 100%; background: transparent;
                position: absolute; top: 0; left: 0; height: 20px; margin: 0; z-index: 3; pointer-events: none;
            }
            .userscript-range-min::-webkit-slider-thumb, .userscript-range-max::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
                background: #ddd; border: 1px solid #333; border-radius: 50%; cursor: pointer;
                margin-top: -7px; pointer-events: auto; position: relative; z-index: 4;
            }
            .userscript-range-min::-moz-range-thumb, .userscript-range-max::-moz-range-thumb {
                width: 18px; height: 18px; background: #ddd; border: 1px solid #333;
                border-radius: 50%; cursor: pointer; pointer-events: auto; position: relative; z-index: 4;
            }
            .userscript-slider-value { min-width: 55px; text-align: center; font-weight: bold; color: #ddd;}

            /* Info Icon and Tooltip Styles */
            .userscript-info-icon {
                display: inline-block;
                margin-left: 5px;
                color: #f0ad4e; /* Orange to match legend */
                cursor: help;
                position: relative; /* For tooltip positioning */
                font-weight: bold;
            }
            .userscript-tooltip-text {
                visibility: hidden;
                width: 220px; /* Adjust as needed */
                background-color: #222; /* Darker background for tooltip */
                color: #fff;
                text-align: left;
                font-weight: normal; /* Normal weight for tooltip text */
                font-size: 11px; /* Smaller font for tooltip */
                border-radius: 4px;
                padding: 8px;
                position: absolute;
                z-index: 10000; /* Ensure tooltip is on top */
                bottom: 125%; /* Position above the icon */
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.2s;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                border: 1px solid #555;
            }
            .userscript-info-icon:hover .userscript-tooltip-text {
                visibility: visible;
                opacity: 1;
            }
            /* Optional: Arrow for the tooltip */
            .userscript-tooltip-text::after {
                content: "";
                position: absolute;
                top: 100%; /* At the bottom of the tooltip */
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #222 transparent transparent transparent;
            }
        `);
    }

    function setupListMutationObserver() {
        const observedParentElement = document.querySelector(OBSERVED_PARENT_SELECTOR);
        if (!observedParentElement) {
            logError(`Observer setup: Parent element "${OBSERVED_PARENT_SELECTOR}" not found. Observer not started. Retrying...`);
            setTimeout(setupListMutationObserver, 2000);
            return;
        }
        log(`Observer setup: Observing parent element "${OBSERVED_PARENT_SELECTOR}".`);

        const observerOptions = { childList: true, subtree: true };

        listMutationObserver = new MutationObserver((mutationsList) => {
            updateRfcvToken();

            const currentPlayerListContainer = observedParentElement.querySelector(PLAYER_LIST_CONTAINER_SELECTOR);
            if (!currentPlayerListContainer) {
                return;
            }

            const playerItems = currentPlayerListContainer.querySelectorAll(PLAYER_ITEMS_QUERY_SELECTOR);
            const playerItemsNowPresent = playerItems.length > 0;
            const loaderNowPresent = !!(currentPlayerListContainer.querySelector(LOADING_SPINNER_SELECTOR) || observedParentElement.querySelector(LOADING_SPINNER_SELECTOR));
            const listNowConfirmedEmpty = currentPlayerListContainer.textContent.toLowerCase().includes(NOBODY_IN_JAIL_TEXT);

            let shouldDebounceAndFilter = false;

            if (expectingListUpdate) {
                if (!loaderNowPresent && (playerItemsNowPresent || listNowConfirmedEmpty)) {
                    log("Observer (Expecting Update): Loader gone, content ready. Scheduling filter and state reset.");
                    shouldDebounceAndFilter = true;
                }
            } else {
                if (ignoreNextObserverExternalTrigger) {
                    log("Observer (External/Initial): Ignoring due to recent filter application.");
                    ignoreNextObserverExternalTrigger = false;
                } else if (!loaderNowPresent && (playerItemsNowPresent || listNowConfirmedEmpty)) {
                    log("Observer (External/Initial): Content ready. Scheduling filter.");
                    shouldDebounceAndFilter = true;
                }
            }

            if (shouldDebounceAndFilter) {
                clearTimeout(applyFiltersTimeout);
                applyFiltersTimeout = setTimeout(() => {
                    log(`Observer: Debounced action (${OBSERVER_DEBOUNCE_MS}ms) - attempting applyFilters.`);
                    applyFilters();

                    if (expectingListUpdate) {
                        log("Observer: List update was expected and list is ready. Resetting refresh state.");
                        resetRefreshState();
                    } else {
                        log("Observer: Filters applied for an external/initial update (or no update was expected).");
                    }
                }, OBSERVER_DEBOUNCE_MS);
            }
        });
        listMutationObserver.observe(observedParentElement, observerOptions);
        log("MutationObserver ON and observing parent.");
    }

    function initialize() {
        log("Userscript initializing...");
        loadSettings();
        updateRfcvToken();

        if (!document.querySelector(OBSERVED_PARENT_SELECTOR)) {
            logWarn(`Initial check: Parent element "${OBSERVED_PARENT_SELECTOR}" for observer not found. setupListMutationObserver will attempt to find it.`);
        }

        addAllStyles();
        addControlButtons();
        setupListMutationObserver();
        applyRefreshSettings();

        log("Initialization complete. Starting initial load polling for filters.");
        initialLoadPollAttempts = 0;
        if (initialLoadPollInterval) clearInterval(initialLoadPollInterval);

        initialLoadPollInterval = setInterval(() => {
            updateRfcvToken();
            const userlistWrapper = document.querySelector(OBSERVED_PARENT_SELECTOR);
            if (!userlistWrapper) {
                 initialLoadPollAttempts++;
                 if (initialLoadPollAttempts >= MAX_INITIAL_LOAD_POLL_ATTEMPTS) {
                    logWarn("Initial Load Poll: Max attempts reached for finding userlist wrapper. Stopping poll.");
                    clearInterval(initialLoadPollInterval);
                    initialLoadPollInterval = null;
                 }
                 return;
            }

            const playerListContainer = userlistWrapper.querySelector(PLAYER_LIST_CONTAINER_SELECTOR);
            if (playerListContainer) {
                const isLoaderPresent = !!(playerListContainer.querySelector(LOADING_SPINNER_SELECTOR) || userlistWrapper.querySelector(LOADING_SPINNER_SELECTOR));
                const players = playerListContainer.querySelectorAll(PLAYER_ITEMS_QUERY_SELECTOR);
                const hasPlayerItems = players.length > 0;
                const isConfirmedEmpty = playerListContainer.textContent.toLowerCase().includes(NOBODY_IN_JAIL_TEXT);

                if (!isLoaderPresent && (hasPlayerItems || isConfirmedEmpty)) {
                    log(`Initial Load Poll: List ready. (Players: ${players.length}, EmptyMsg: ${isConfirmedEmpty}). Applying filters and stopping poll.`);
                    applyFilters();
                    clearInterval(initialLoadPollInterval);
                    initialLoadPollInterval = null;
                    return;
                }
            }

            initialLoadPollAttempts++;
            if (initialLoadPollAttempts >= MAX_INITIAL_LOAD_POLL_ATTEMPTS) {
                logWarn("Initial Load Poll: Max attempts reached for list readiness. Stopping poll. Filters may not have been applied if list never became ready.");
                clearInterval(initialLoadPollInterval);
                initialLoadPollInterval = null;
            }
        }, INITIAL_LOAD_POLL_DELAY);

        window.addEventListener('beforeunload', () => {
            if (refreshIntervalId) clearInterval(refreshIntervalId);
            if (initialLoadPollInterval) clearInterval(initialLoadPollInterval);
            if (listMutationObserver) {
                listMutationObserver.disconnect();
                log("Disconnected MutationObserver.");
            }
            log("Cleaned up intervals and observer on page unload.");
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initialize, 700);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 700));
    }

})();
