// ==UserScript==
// @name         Google SERP Scraper
// @namespace    https://greasyfork.org/en/users/1467948-stonedkhajiit
// @version      0.3.0
// @description  Scrape Google SERP results. View, filter, and export (JSON, CSV, MD, URLs). With optional auto-scrape on dynamic page updates.
// @author       StonedKhajiit
// @match        https://www.google.com/*search?*
// @match        https://www.google.*/*search?*
// @exclude      /^https:\/\/www\.google\.[^/]+\/search\?.*(?:tbm=(?:isch|nws|shop|vid|bks|fin|app)|udm=(?:2|7|28|36)).*$/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536230/Google%20SERP%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/536230/Google%20SERP%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Application Namespace ---
    const GSRS_App = {
        // Core State
        allResults: [],
        filteredResults: [],
        observer: null,
        currentSettings: {},

        // Script-wide state variables
        state: {
            filterTimeout: null,
            copyDownloadTarget: 'current',
            currentViewMode: 'list',
            selectedResultListItem: null,
            isMaximized: false,
            originalPanelState: { top: '', left: '', width: '', height: '', right: '' },
            originalTitleBarText: 'Google SERP Scraper',
            selectorTestHighlightTimeout: null,
            currentContextMenuItemData: null,
            contextMenuHighlightTimeout: null,
            lastListItemHighlightedElement: null,
            observerDebounceTimer: null, // Timer for debouncing mutation observer
        },

        // UI Element References
        uiElements: {
            uiContainer: null, resultsTextArea: null, uiMessageDiv: null, filterInput: null,
            resultsCountSpan: null, observerStatusSpan: null, resultsListContainer: null,
            resultPreviewArea: null, settingsPanel: null, contextMenuElement: null,
            settingsDOMElements: {},
        },

        DEFAULT_SETTINGS: {
            titleSelector: 'a h3',
            // observerTargetSelector is now primarily for the MutationObserver
            observerTargetSelector: 'body',
            uiContentVisible: true, uiSettingsVisible: false, uiPanelTop: '20px', uiPanelLeft: 'auto', uiPanelRight: '20px', uiPanelWidth: '380px',
            debugMode: false, highlightParsed: true, highlightListItemOnPage: true,
            autoScrapeOnUpdate: false, // Default to OFF for stability
            showPreviewInListMode: true, showFilterInputArea: true, showDownloadActionsArea: true,
            darkMode: false, lastFilterTerm: '',
            // Data Fetching Settings
            fetchTitle: true, fetchUrl: true, fetchSiteName: true, fetchBreadcrumbs: true, fetchDescription: true, fetchDescriptionKeywords: true, fetchDateInfo: true,
            fetchForumStats: true, fetchRelatedPosts: true,
            decodeUrlsToReadable: true, hideDisabledFetchFields: true,
            // Export Settings
            exportCsvMdPosition: true, exportCsvMdTitle: true, exportCsvMdUrl: true, exportCsvMdSiteName: true, exportCsvMdBreadcrumbs: true, exportCsvMdDescription: true, exportCsvMdHighlightedSnippets: true, exportCsvMdOriginalDateText: true, exportCsvMdParsedDateISO: true,
            exportCsvMdForumStats: true, exportCsvMdRelatedPosts: true,
        },

        INTERNAL_SELECTORS: {
            potentialResultBlockSelectors: ['div.xfX4Ac', 'div.MjjYud', 'div.g', 'div.tF2Cxc', 'div.Gx5Zad'],
            ancestorToExcludeBlockIfInside: '', parentContainerToExcludeBlockIfInside: '',
            knowledgePanelSelector: [ 'div.kp-wholepage', 'div[data-kpsecret]', 'div.kp-wholepage-osrp', 'div.bzXtMb.M8OgIe.dRpWwb', 'div.TQc1id.IVvPP' ].join(','),
            knowledgePanelCoreContentDirectChild: [ ':scope > div[jscontroller="sG005c"]', ':scope > div.mod', ':scope > div.kp-UID', ':scope > div[data-hveid="CAkQCQ"]', ':scope > div.yTFeqb.wp-ms.oJxARb', ':scope > div.xpdopen', ':scope > div.SALvLe.k29K0b' ].join(','),
            carouselStructureIndicator: 'div.XNfAUb, div.pla-carousel',
            relatedQuestionsBlockHeadingSpan: 'span.mgAbYb.OSrXXb.RES9jf.IFnjPb',
            relatedQuestionsBlockTextIndicators: ['相關問題', 'People also ask', 'Autres questions également posées', 'Ähnliche Fragen', 'Otras personas también preguntan', '関連する質問'],
            individualRelatedQuestionPair: '.related-question-pair, div[jscontroller="xfmZMb"]',
            outerDescriptionBlockSelector: 'div.kb0PBd[data-sncf^="1"]',
            directDescriptionContainer: 'div.VwiC3b.yXK7lf:not(:has(div.fzUZNc)):not(.yfStGF)',
            genericDescriptionContainer: 'div.VwiC3b:not([class*=" "]):not(:has(img)):not(:has(video)):not(:has(div.fzUZNc)):not(.yfStGF), div.VwiC3b.p4wth:not(.yXK7lf)',
            videoDescriptionSelector: 'div.fzUZNc > div.ITZIwc.p4wth',
            siteNameSelector: 'span.VuuXrf, .byrV5b .cHaqb:first-of-type',
            citeDisplay: 'cite, .qLRx3b',
            anchorInTitle: 'a',
            dataAttributesForCandidate: ['data-hveid', 'data-ved'],
            elementsToExcludeFromText: 'a, h1, h2, h3, h4, h5, h6, cite, button, form, input, script, style, nav, footer, .TbwUpd, .B6fmyf',
            datePrefixSpanSelector: 'span.YrbPuc, span[style*="color:#70757a"]',
            descriptionKeywordSelector: 'em.t55VCb, .VwiC3b span > em',
            // Selectors for new forum-style data
            relatedPostsContainer: 'div.kXlpWb',
            relatedPostRow: 'div.VNLkW.Pr4Y6d',
            relatedPostLink: 'a.fl',
            relatedPostMetadataCell: 'div.G1Rrjc',
            translationLinkNoise: 'a.fl[href*="translate.google.com"]',
        },

        // Debounce timers
        URL_CHANGE_DEBOUNCE_DELAY: 500,
        OBSERVER_DEBOUNCE_DELAY: 750, // Debounce for MutationObserver auto-scraping
    };

    // --- URL Change Detection Logic (Informational Only) ---
    GSRS_App.urlChangeDetector = {
        lastUrl: '',
        lastStartParam: undefined,

        checkUrlChange: function(source = "manual_or_init") {
            const currentUrl = window.location.href;
            const currentQueryString = window.location.search;
            const urlParams = new URLSearchParams(currentQueryString);
            const newStartParam = urlParams.get('start');

            if (GSRS_App.currentSettings.debugMode) {
                console.log(`GSRS_Debug (URLCheck - Info Only): Source: ${source}, Current URL: ${currentUrl}, Last URL: ${this.lastUrl}, NewStart: ${newStartParam}, LastStart: ${this.lastStartParam}`);
            }

            if (currentUrl !== this.lastUrl) {
                 if (GSRS_App.currentSettings.debugMode) {
                    console.log(`GSRS (URLChange - Info Only): URL recorded as changed from "${this.lastUrl}" to "${currentUrl}"`);
                }
            }
            this.lastUrl = currentUrl;
            this.lastStartParam = newStartParam;
        },

        init: function() {
            this.lastUrl = window.location.href;
            const initialParams = new URLSearchParams(window.location.search);
            this.lastStartParam = initialParams.get('start');

            if (GSRS_App.currentSettings.debugMode) {
                console.log(`GSRS (URLChangeDetector Init - Info Only): Initial URL: ${this.lastUrl}, Initial 'start' param: ${this.lastStartParam}`);
            }

            const originalPushState = history.pushState;
            history.pushState = function() {
                const prev = window.location.href;
                const result = originalPushState.apply(this, arguments);
                if(window.location.href !== prev && GSRS_App.urlChangeDetector) GSRS_App.urlChangeDetector.checkUrlChange('history_pushstate');
                return result;
            };

            const originalReplaceState = history.replaceState;
            history.replaceState = function() {
                const prev = window.location.href;
                const result = originalReplaceState.apply(this, arguments);
                if(window.location.href !== prev && GSRS_App.urlChangeDetector) GSRS_App.urlChangeDetector.checkUrlChange('history_replacestate');
                return result;
            };

            window.addEventListener('popstate', () => {
                if(GSRS_App.urlChangeDetector) GSRS_App.urlChangeDetector.checkUrlChange('popstate');
            });

            if (GSRS_App.currentSettings.debugMode) {
                console.log("GSRS (URLChangeDetector - Info Only): Initialized. History API calls will be logged if debug mode is on.");
            }
            this.checkUrlChange('initial_setup');
        }
    };


    // --- Settings Manager ---
    GSRS_App.settingsManager = {
        load: function() {
            GSRS_App.currentSettings = { ...GSRS_App.DEFAULT_SETTINGS };
            Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                GSRS_App.currentSettings[key] = GM_getValue(`gsrs_${key}`, GSRS_App.DEFAULT_SETTINGS[key]);
            });
            GSRS_App.state.currentViewMode = GM_getValue('gsrs_lastViewMode', GSRS_App.state.currentViewMode);
            if (GSRS_App.currentSettings.debugMode) console.log("GSRS: Settings & UI State loaded:", JSON.parse(JSON.stringify(GSRS_App.currentSettings)));
        },
        saveUIPrefs: function() {
            GM_setValue('gsrs_uiContentVisible', GSRS_App.currentSettings.uiContentVisible);
            GM_setValue('gsrs_uiSettingsVisible', GSRS_App.currentSettings.uiSettingsVisible);
            const uiContainer = GSRS_App.uiElements.uiContainer;
            if (uiContainer && !GSRS_App.state.isMaximized) {
                const currentTop = uiContainer.style.top;
                const currentLeft = uiContainer.style.left;
                const currentRight = uiContainer.style.right;
                GSRS_App.currentSettings.uiPanelTop = (currentTop && currentTop.endsWith('px')) ? currentTop : GSRS_App.DEFAULT_SETTINGS.uiPanelTop;
                GM_setValue('gsrs_uiPanelTop', GSRS_App.currentSettings.uiPanelTop);

                if (currentLeft && currentLeft !== 'auto') {
                    GSRS_App.currentSettings.uiPanelLeft = (currentLeft.endsWith('px')) ? currentLeft : GSRS_App.DEFAULT_SETTINGS.uiPanelLeft;
                    GSRS_App.currentSettings.uiPanelRight = 'auto';
                    GM_setValue('gsrs_uiPanelLeft', GSRS_App.currentSettings.uiPanelLeft);
                    GM_setValue('gsrs_uiPanelRight', 'auto');
                } else if (currentRight && currentRight !== 'auto') {
                    GSRS_App.currentSettings.uiPanelRight = (currentRight.endsWith('px')) ? currentRight : GSRS_App.DEFAULT_SETTINGS.uiPanelRight;
                    GSRS_App.currentSettings.uiPanelLeft = 'auto';
                    GM_setValue('gsrs_uiPanelRight', GSRS_App.currentSettings.uiPanelRight);
                    GM_setValue('gsrs_uiPanelLeft', 'auto');
                } else {
                    GSRS_App.currentSettings.uiPanelRight = GSRS_App.DEFAULT_SETTINGS.uiPanelRight;
                    GSRS_App.currentSettings.uiPanelLeft = 'auto';
                    GM_setValue('gsrs_uiPanelRight', GSRS_App.currentSettings.uiPanelRight);
                    GM_setValue('gsrs_uiPanelLeft', 'auto');
                }
            }
            GM_setValue('gsrs_lastViewMode', GSRS_App.state.currentViewMode);
        },
        updateInputs: function() {
            const elements = GSRS_App.uiElements.settingsDOMElements; if (!elements || Object.keys(elements).length === 0) { return; }
            if (elements.titleInput) elements.titleInput.value = GSRS_App.currentSettings.titleSelector;
            if (elements.observerInput) elements.observerInput.value = GSRS_App.currentSettings.observerTargetSelector;
            if (elements.debugCheckbox) elements.debugCheckbox.checked = GSRS_App.currentSettings.debugMode;
            if (elements.highlightCheckbox) elements.highlightCheckbox.checked = GSRS_App.currentSettings.highlightParsed;
            if (elements.highlightListItemOnPageCheckbox) elements.highlightListItemOnPageCheckbox.checked = GSRS_App.currentSettings.highlightListItemOnPage;
            if (elements.autoScrapeCheckbox) elements.autoScrapeCheckbox.checked = GSRS_App.currentSettings.autoScrapeOnUpdate;
            if (elements.showPreviewInListModeCheckbox) elements.showPreviewInListModeCheckbox.checked = GSRS_App.currentSettings.showPreviewInListMode;
            if (elements.showFilterInputAreaCheckbox) elements.showFilterInputAreaCheckbox.checked = GSRS_App.currentSettings.showFilterInputArea;
            if (elements.showDownloadActionsAreaCheckbox) elements.showDownloadActionsAreaCheckbox.checked = GSRS_App.currentSettings.showDownloadActionsArea;
            if (elements.darkModeCheckbox) elements.darkModeCheckbox.checked = GSRS_App.currentSettings.darkMode;
            // Data Fetching
            if (elements.fetchTitleCheckbox) elements.fetchTitleCheckbox.checked = GSRS_App.currentSettings.fetchTitle;
            if (elements.fetchUrlCheckbox) elements.fetchUrlCheckbox.checked = GSRS_App.currentSettings.fetchUrl;
            if (elements.fetchSiteNameCheckbox) elements.fetchSiteNameCheckbox.checked = GSRS_App.currentSettings.fetchSiteName;
            if (elements.fetchDescriptionCheckbox) elements.fetchDescriptionCheckbox.checked = GSRS_App.currentSettings.fetchDescription;
            if (elements.fetchDescriptionKeywordsCheckbox) elements.fetchDescriptionKeywordsCheckbox.checked = GSRS_App.currentSettings.fetchDescriptionKeywords;
            if (elements.fetchDateInfoCheckbox) elements.fetchDateInfoCheckbox.checked = GSRS_App.currentSettings.fetchDateInfo;
            if (elements.fetchBreadcrumbsCheckbox) elements.fetchBreadcrumbsCheckbox.checked = GSRS_App.currentSettings.fetchBreadcrumbs;
            if (elements.fetchForumStatsCheckbox) elements.fetchForumStatsCheckbox.checked = GSRS_App.currentSettings.fetchForumStats;
            if (elements.fetchRelatedPostsCheckbox) elements.fetchRelatedPostsCheckbox.checked = GSRS_App.currentSettings.fetchRelatedPosts;
            if (elements.decodeUrlsCheckbox) elements.decodeUrlsCheckbox.checked = GSRS_App.currentSettings.decodeUrlsToReadable;
            if (elements.hideFieldsCheckbox) elements.hideFieldsCheckbox.checked = GSRS_App.currentSettings.hideDisabledFetchFields;

            // Export Fields
            Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                if (key.startsWith('exportCsvMd')) {
                    const checkboxId = `gsrs-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}-checkbox`;
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox) { checkbox.checked = GSRS_App.currentSettings[key]; }
                }
            });
            const fetchDescCheckbox = elements.fetchDescriptionCheckbox;
            const fetchKeywordsContainer = document.getElementById('gsrs-fetch-keywords-container');
            if (fetchDescCheckbox && fetchKeywordsContainer) {
                fetchKeywordsContainer.style.display = fetchDescCheckbox.checked ? 'block' : 'none';
            }
        },
        save: function() {
            const elements = GSRS_App.uiElements.settingsDOMElements; if (!elements || Object.keys(elements).length === 0) { GSRS_App.uiManager.showUIMessage('Error: Settings DOM elements not found.', 'error'); return; }
            const { titleInput, observerInput, debugCheckbox, highlightCheckbox, highlightListItemOnPageCheckbox, autoScrapeCheckbox, showPreviewInListModeCheckbox, showFilterInputAreaCheckbox, showDownloadActionsAreaCheckbox, darkModeCheckbox, fetchTitleCheckbox, fetchUrlCheckbox, fetchSiteNameCheckbox, fetchDescriptionCheckbox, fetchDescriptionKeywordsCheckbox, fetchBreadcrumbsCheckbox, decodeUrlsCheckbox, fetchDateInfoCheckbox, fetchForumStatsCheckbox, fetchRelatedPostsCheckbox, hideFieldsCheckbox } = elements;
            if (!titleInput || !observerInput || !debugCheckbox || !highlightCheckbox || !highlightListItemOnPageCheckbox || !autoScrapeCheckbox || !showPreviewInListModeCheckbox || !showFilterInputAreaCheckbox || !showDownloadActionsAreaCheckbox || !darkModeCheckbox || !fetchTitleCheckbox || !fetchUrlCheckbox || !fetchSiteNameCheckbox || !fetchDescriptionCheckbox || !fetchDescriptionKeywordsCheckbox || !fetchBreadcrumbsCheckbox || !decodeUrlsCheckbox || !fetchDateInfoCheckbox || !fetchForumStatsCheckbox || !fetchRelatedPostsCheckbox || !hideFieldsCheckbox ) { GSRS_App.uiManager.showUIMessage('Error: One or more core settings input elements are missing.', 'error'); if(GSRS_App.currentSettings.debugMode) console.error("GSRS SaveSettings: Missing core DOM elements", elements); return; }

            const newTitleSelector = titleInput.value.trim();
            if (!newTitleSelector || !isValidSelector(newTitleSelector)) {
                GSRS_App.uiManager.showUIMessage(`Invalid or empty Title Selector: "${newTitleSelector.substring(0,50)}...". Using default.`, 'error', 7000);
                GSRS_App.currentSettings.titleSelector = GSRS_App.DEFAULT_SETTINGS.titleSelector;
            } else {
                GSRS_App.currentSettings.titleSelector = newTitleSelector;
            }
            const newObserverSelector = observerInput.value.trim();
            if (newObserverSelector && !isValidSelector(newObserverSelector)) {
                 GSRS_App.uiManager.showUIMessage(`Invalid Observer Target Selector: ${newObserverSelector.substring(0,50)}...`, 'error', 5000); return;
            }
            GSRS_App.currentSettings.observerTargetSelector = newObserverSelector || GSRS_App.DEFAULT_SETTINGS.observerTargetSelector;

            GSRS_App.currentSettings.debugMode = debugCheckbox.checked;
            GSRS_App.currentSettings.highlightParsed = highlightCheckbox.checked;
            GSRS_App.currentSettings.highlightListItemOnPage = highlightListItemOnPageCheckbox.checked;
            GSRS_App.currentSettings.autoScrapeOnUpdate = autoScrapeCheckbox.checked;
            GSRS_App.currentSettings.showPreviewInListMode = showPreviewInListModeCheckbox.checked;
            GSRS_App.currentSettings.showFilterInputArea = showFilterInputAreaCheckbox.checked;
            GSRS_App.currentSettings.showDownloadActionsArea = showDownloadActionsAreaCheckbox.checked;
            // Data Fetching
            GSRS_App.currentSettings.fetchTitle = fetchTitleCheckbox.checked;
            GSRS_App.currentSettings.fetchUrl = fetchUrlCheckbox.checked;
            GSRS_App.currentSettings.fetchSiteName = fetchSiteNameCheckbox.checked;
            GSRS_App.currentSettings.fetchDescription = fetchDescriptionCheckbox.checked;
            GSRS_App.currentSettings.fetchDescriptionKeywords = fetchDescriptionKeywordsCheckbox.checked;
            GSRS_App.currentSettings.fetchBreadcrumbs = fetchBreadcrumbsCheckbox.checked;
            GSRS_App.currentSettings.fetchDateInfo = fetchDateInfoCheckbox.checked;
            GSRS_App.currentSettings.fetchForumStats = fetchForumStatsCheckbox.checked;
            GSRS_App.currentSettings.fetchRelatedPosts = fetchRelatedPostsCheckbox.checked;
            // Other
            GSRS_App.currentSettings.decodeUrlsToReadable = decodeUrlsCheckbox.checked;
            GSRS_App.currentSettings.hideDisabledFetchFields = hideFieldsCheckbox.checked;

            Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                if (key === 'darkMode') {
                    GM_setValue(`gsrs_${key}`, darkModeCheckbox.checked);
                    GSRS_App.currentSettings[key] = darkModeCheckbox.checked;
                } else if (GSRS_App.currentSettings.hasOwnProperty(key)) {
                    GM_setValue(`gsrs_${key}`, GSRS_App.currentSettings[key]);
                }
            });
            // Export Fields
            Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                if (key.startsWith('exportCsvMd')) {
                    const checkboxId = `gsrs-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}-checkbox`;
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox) {
                        GSRS_App.currentSettings[key] = checkbox.checked;
                        GM_setValue(`gsrs_${key}`, GSRS_App.currentSettings[key]);
                    } else if (GSRS_App.currentSettings.debugMode) {
                        console.warn(`GSRS SaveSettings: Checkbox with ID ${checkboxId} for export setting ${key} not found.`);
                    }
                }
            });

            titleInput.value = GSRS_App.currentSettings.titleSelector;
            observerInput.value = GSRS_App.currentSettings.observerTargetSelector;

            const warningP = document.querySelector('#gsrs-settings-panel .gsrs-settings-warning');
            if (warningP) { warningP.innerHTML = `Extraction uses title selector '<code>${GSRS_App.currentSettings.titleSelector}</code>' to find parent blocks.`; }

            if (GSRS_App.uiElements.resultPreviewArea) {
                GSRS_App.uiElements.resultPreviewArea.style.display = (GSRS_App.currentSettings.showPreviewInListMode && GSRS_App.state.currentViewMode === 'list') ? 'block' : 'none';
            }
            const filterContainerEl = document.querySelector('.gsrs-filter-container');
            if (filterContainerEl) { filterContainerEl.style.display = GSRS_App.currentSettings.showFilterInputArea ? 'flex' : 'none'; }
            const downloadOptionsEl = document.querySelector('.gsrs-copy-download-options');
            const downloadBarEl = document.querySelector('.gsrs-action-button-bar');
            if (downloadOptionsEl) downloadOptionsEl.style.display = GSRS_App.currentSettings.showDownloadActionsArea ? 'block' : 'none';
            if (downloadBarEl) downloadBarEl.style.display = GSRS_App.currentSettings.showDownloadActionsArea ? 'flex' : 'none';

            if (GSRS_App.state.currentViewMode === 'list') {
                GSRS_App.uiManager.toggleViewMode('list');
            }
            GSRS_App.uiManager.toggleDarkMode(darkModeCheckbox.checked);
            GSRS_App.uiManager.showUIMessage('Settings saved! Re-scrape if needed.', 'success');
            if (GSRS_App.currentSettings.debugMode) console.log("GSRS: Settings saved.");

            setupMutationObserver(); // Re-initialize observer with new settings
            GSRS_App.uiManager.toggleSettingsView(false);
        },
        resetToDefaults: function() {
            if (confirm("Reset ALL settings to defaults (selectors, fetching, display, UI position)? Filter term won't change.")) {
                Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                    GSRS_App.currentSettings[key] = GSRS_App.DEFAULT_SETTINGS[key];
                    GM_setValue(`gsrs_${key}`, GSRS_App.DEFAULT_SETTINGS[key]);
                });
                GSRS_App.currentSettings.uiPanelTop = GSRS_App.DEFAULT_SETTINGS.uiPanelTop;
                GSRS_App.currentSettings.uiPanelLeft = GSRS_App.DEFAULT_SETTINGS.uiPanelLeft;
                GSRS_App.currentSettings.uiPanelRight = GSRS_App.DEFAULT_SETTINGS.uiPanelRight;
                GM_setValue('gsrs_uiPanelTop', GSRS_App.currentSettings.uiPanelTop);
                GM_setValue('gsrs_uiPanelLeft', GSRS_App.currentSettings.uiPanelLeft);
                GM_setValue('gsrs_uiPanelRight', GSRS_App.currentSettings.uiPanelRight);

                const uiContainer = GSRS_App.uiElements.uiContainer;
                if (uiContainer) {
                    uiContainer.style.top = GSRS_App.currentSettings.uiPanelTop;
                    uiContainer.style.left = GSRS_App.currentSettings.uiPanelLeft;
                    uiContainer.style.right = GSRS_App.currentSettings.uiPanelRight;
                    uiContainer.style.width = GSRS_App.DEFAULT_SETTINGS.uiPanelWidth;
                }

                this.updateInputs();

                const warningP = document.querySelector('#gsrs-settings-panel .gsrs-settings-warning');
                if (warningP) { warningP.innerHTML = `Extraction uses title selector '<code>${GSRS_App.DEFAULT_SETTINGS.titleSelector}</code>' to find parent blocks.`; }

                if (GSRS_App.uiElements.resultPreviewArea) {
                    GSRS_App.uiElements.resultPreviewArea.style.display = (GSRS_App.DEFAULT_SETTINGS.showPreviewInListMode && GSRS_App.state.currentViewMode === 'list') ? 'block' : 'none';
                }
                const filterContainerEl = document.querySelector('.gsrs-filter-container');
                if (filterContainerEl) { filterContainerEl.style.display = GSRS_App.DEFAULT_SETTINGS.showFilterInputArea ? 'flex' : 'none'; }
                const downloadOptionsEl = document.querySelector('.gsrs-copy-download-options');
                const downloadBarEl = document.querySelector('.gsrs-action-button-bar');
                if (downloadOptionsEl) downloadOptionsEl.style.display = GSRS_App.DEFAULT_SETTINGS.showDownloadActionsArea ? 'block' : 'none';
                if (downloadBarEl) downloadBarEl.style.display = GSRS_App.DEFAULT_SETTINGS.showDownloadActionsArea ? 'flex' : 'none';

                if (GSRS_App.state.currentViewMode === 'list') {
                    GSRS_App.uiManager.toggleViewMode('list');
                }
                GSRS_App.uiManager.toggleDarkMode(GSRS_App.currentSettings.darkMode);

                GSRS_App.uiManager.showUIMessage('All settings reset to defaults. Re-scrape if needed.', 'success');
                if (GSRS_App.currentSettings.debugMode) console.log("GSRS: All settings reset.");
                setupMutationObserver(); // Re-initialize observer with default settings
                GSRS_App.uiManager.toggleSettingsView(false);
            }
        }
    };

    // --- UI Manager ---
    GSRS_App.uiManager = {
        create: function() {
            if (document.getElementById('gsrs-ui-container')) return;
            GSRS_App.uiElements.uiContainer = document.createElement('div');
            GSRS_App.uiElements.uiContainer.id = 'gsrs-ui-container';
            if (GSRS_App.currentSettings.darkMode) { GSRS_App.uiElements.uiContainer.classList.add('gsrs-dark-theme'); }

            GSRS_App.uiElements.uiContainer.style.top = GSRS_App.currentSettings.uiPanelTop || GSRS_App.DEFAULT_SETTINGS.uiPanelTop;
            if (GSRS_App.currentSettings.uiPanelLeft && GSRS_App.currentSettings.uiPanelLeft !== 'auto') {
                GSRS_App.uiElements.uiContainer.style.left = GSRS_App.currentSettings.uiPanelLeft;
                GSRS_App.uiElements.uiContainer.style.right = 'auto';
            } else if (GSRS_App.currentSettings.uiPanelRight && GSRS_App.currentSettings.uiPanelRight !== 'auto') {
                GSRS_App.uiElements.uiContainer.style.right = GSRS_App.currentSettings.uiPanelRight;
                GSRS_App.uiElements.uiContainer.style.left = 'auto';
            } else {
                GSRS_App.uiElements.uiContainer.style.left = GSRS_App.DEFAULT_SETTINGS.uiPanelLeft;
                GSRS_App.uiElements.uiContainer.style.right = GSRS_App.DEFAULT_SETTINGS.uiPanelRight;
            }

            if (GSRS_App.currentSettings.uiSettingsVisible) GSRS_App.uiElements.uiContainer.classList.add('gsrs-settings-view-active');

            const titleBar = this.createTitleBar();
            GSRS_App.uiElements.uiContainer.appendChild(titleBar);

            const contentWrapper = document.createElement('div');
            contentWrapper.id = 'gsrs-content-wrapper';
            contentWrapper.style.display = GSRS_App.currentSettings.uiContentVisible ? 'flex' : 'none';
            if (!GSRS_App.currentSettings.uiContentVisible) { GSRS_App.uiElements.uiContainer.classList.add('gsrs-minimized');}

            contentWrapper.appendChild(this.createMainActions());
            contentWrapper.appendChild(this.createFilterArea());
            contentWrapper.appendChild(this.createResultsCountAndViews());
            contentWrapper.appendChild(this.createResultsViewAreaContainer());

            GSRS_App.uiElements.uiMessageDiv = document.createElement('div');
            GSRS_App.uiElements.uiMessageDiv.id = 'gsrs-ui-message';
            contentWrapper.appendChild(GSRS_App.uiElements.uiMessageDiv);

            contentWrapper.appendChild(this.createCopyDownloadOptions());
            contentWrapper.appendChild(this.createActionButtonBar());

            GSRS_App.uiElements.settingsPanel = this.createSettingsPanel();
            contentWrapper.appendChild(GSRS_App.uiElements.settingsPanel);

            GSRS_App.uiElements.uiContainer.appendChild(contentWrapper);

            GSRS_App.uiElements.contextMenuElement = this.createContextMenu();
            document.body.appendChild(GSRS_App.uiElements.contextMenuElement);

            document.body.appendChild(GSRS_App.uiElements.uiContainer);

            this.populateSettingsDOMElements();
            this.attachSettingsPanelEvents();
            this.attachActionLinkEvents();
            this.attachMinimizeToggle(titleBar.querySelector('#gsrs-minimize-btn'), contentWrapper);
            this.makeDraggable(GSRS_App.uiElements.uiContainer, titleBar);
            this.addStyles();
        },
        createTitleBar: function() {
            const titleBar = document.createElement('div'); titleBar.id = 'gsrs-title-bar';
            const settingsToggleTitleBar = document.createElement('button'); settingsToggleTitleBar.id = 'gsrs-settings-toggle-titlebar'; settingsToggleTitleBar.innerHTML = '⚙️'; settingsToggleTitleBar.title = 'Settings'; settingsToggleTitleBar.addEventListener('click', () => this.toggleSettingsView()); titleBar.appendChild(settingsToggleTitleBar);
            const titleBarText = document.createElement('span'); titleBarText.id = 'gsrs-title-bar-text'; titleBarText.textContent = GSRS_App.state.originalTitleBarText; titleBar.appendChild(titleBarText);
            const titleBarControls = document.createElement('div'); titleBarControls.id = 'gsrs-title-bar-controls';
            GSRS_App.uiElements.observerStatusSpan = document.createElement('span'); GSRS_App.uiElements.observerStatusSpan.id = 'gsrs-observer-status';
            GSRS_App.uiElements.observerStatusSpan.innerHTML = '○';
            GSRS_App.uiElements.observerStatusSpan.title = 'Dynamic loading detection inactive';
            GSRS_App.uiElements.observerStatusSpan.classList.add('gsrs-obs-inactive'); titleBarControls.appendChild(GSRS_App.uiElements.observerStatusSpan);
            const maximizeButton = document.createElement('button'); maximizeButton.id = 'gsrs-maximize-btn'; maximizeButton.innerHTML = '<span class="icon">🗖</span>'; maximizeButton.title = 'Maximize Panel'; maximizeButton.addEventListener('click', toggleMaximizePanel); titleBarControls.appendChild(maximizeButton);
            const minimizeButton = document.createElement('button'); minimizeButton.id = 'gsrs-minimize-btn'; minimizeButton.textContent = '－'; minimizeButton.title = 'Minimize/Restore Panel'; titleBarControls.appendChild(minimizeButton);
            titleBar.appendChild(titleBarControls);
            return titleBar;
        },
		
        attachMinimizeToggle: function(minimizeButton, contentWrapper) {
            minimizeButton.addEventListener('click', () => {
                const titleBarTextEl = document.getElementById('gsrs-title-bar-text');
                if (!contentWrapper || !titleBarTextEl) return;
                const isCurrentlyHidden = getComputedStyle(contentWrapper).display === 'none';
                const newVisibility = isCurrentlyHidden;
                contentWrapper.style.display = newVisibility ? 'flex' : 'none';
                GSRS_App.uiElements.uiContainer.classList.toggle('gsrs-minimized', !newVisibility);
                minimizeButton.textContent = newVisibility ? '－' : '＋';
                GSRS_App.currentSettings.uiContentVisible = newVisibility;
                titleBarTextEl.textContent = GSRS_App.state.originalTitleBarText;
                if (!newVisibility && GSRS_App.uiElements.uiContainer.classList.contains('gsrs-settings-view-active')) {
                    this.toggleSettingsView(false);
                }
                GSRS_App.settingsManager.saveUIPrefs();
                if (newVisibility && !GSRS_App.uiElements.uiContainer.classList.contains('gsrs-settings-view-active')) {
                    contentWrapper.style.display = 'none'; void contentWrapper.offsetHeight; contentWrapper.style.display = 'flex';
                }
            });
            if(!GSRS_App.currentSettings.uiContentVisible) {
                minimizeButton.textContent = '＋';
                const titleBarTextEl = document.getElementById('gsrs-title-bar-text');
                if (titleBarTextEl) titleBarTextEl.textContent = GSRS_App.state.originalTitleBarText;
            }
        },
        createMainActions: function() {
            const mainActionsDiv = document.createElement('div'); mainActionsDiv.className = 'gsrs-main-actions';
            const startButton = document.createElement('button'); startButton.id = 'gsrs-start-btn'; startButton.className = 'gsrs-button';
            startButton.textContent = 'Scrape Page';
            startButton.addEventListener('click', handleStartParse); mainActionsDiv.appendChild(startButton);
            const clearButton = document.createElement('button'); clearButton.id = 'gsrs-clear-btn'; clearButton.className = 'gsrs-button'; clearButton.innerHTML = '<span class="icon">🗑️</span>'; clearButton.title = 'Clear Results'; clearButton.addEventListener('click', handleClearResults); mainActionsDiv.appendChild(clearButton);
            return mainActionsDiv;
        },
        createFilterArea: function() {
            const filterContainerEl = document.createElement('div'); filterContainerEl.className = 'gsrs-filter-container';
            filterContainerEl.style.display = GSRS_App.currentSettings.showFilterInputArea ? 'flex' : 'none';
            GSRS_App.uiElements.filterInput = document.createElement('input'); GSRS_App.uiElements.filterInput.type = 'text'; GSRS_App.uiElements.filterInput.id = 'gsrs-filter-input'; GSRS_App.uiElements.filterInput.placeholder = 'Filter results by keyword...';
            GSRS_App.uiElements.filterInput.value = GSRS_App.currentSettings.lastFilterTerm;
            GSRS_App.uiElements.filterInput.addEventListener('input', handleFilterResults);
            filterContainerEl.appendChild(GSRS_App.uiElements.filterInput);
            const clearFilterButton = document.createElement('button'); clearFilterButton.id = 'gsrs-clear-filter-btn'; clearFilterButton.className = 'gsrs-button'; clearFilterButton.innerHTML = 'X'; clearFilterButton.title = 'Clear Filter';
            clearFilterButton.addEventListener('click', () => { if (GSRS_App.uiElements.filterInput) GSRS_App.uiElements.filterInput.value = ''; handleFilterResults(); });
            filterContainerEl.appendChild(clearFilterButton);
            if (GSRS_App.currentSettings.lastFilterTerm && GSRS_App.currentSettings.lastFilterTerm.trim() !== '') {
                GSRS_App.uiElements.filterInput.classList.add('gsrs-filter-active');
            }
            return filterContainerEl;
        },
        createResultsCountAndViews: function() {
            const resultsCountWrapper = document.createElement('div'); resultsCountWrapper.id = 'gsrs-results-count-wrapper';
            GSRS_App.uiElements.resultsCountSpan = document.createElement('span'); GSRS_App.uiElements.resultsCountSpan.id = 'gsrs-results-count'; GSRS_App.uiElements.resultsCountSpan.textContent = 'Results: 0'; resultsCountWrapper.appendChild(GSRS_App.uiElements.resultsCountSpan);
            const viewToggleButtons = document.createElement('div'); viewToggleButtons.className = 'gsrs-view-toggle-buttons';
            const jsonViewBtn = document.createElement('button'); jsonViewBtn.id = 'gsrs-view-toggle-json'; jsonViewBtn.textContent = '📜 JSON'; jsonViewBtn.title = "View as JSON";
            const listViewBtn = document.createElement('button'); listViewBtn.id = 'gsrs-view-toggle-list'; listViewBtn.textContent = '📄 List'; listViewBtn.title = "View as List & Preview";
            jsonViewBtn.addEventListener('click', () => this.toggleViewMode('json'));
            listViewBtn.addEventListener('click', () => this.toggleViewMode('list'));
            viewToggleButtons.appendChild(jsonViewBtn); viewToggleButtons.appendChild(listViewBtn);
            resultsCountWrapper.appendChild(viewToggleButtons);
            return resultsCountWrapper;
        },
        createResultsViewAreaContainer: function() {
            const resultsViewAreaContainer = document.createElement('div'); resultsViewAreaContainer.id = 'gsrs-results-view-area';
            GSRS_App.uiElements.resultsTextArea = document.createElement('textarea'); GSRS_App.uiElements.resultsTextArea.id = 'gsrs-results-area'; GSRS_App.uiElements.resultsTextArea.placeholder = 'Scraped results will appear here...'; GSRS_App.uiElements.resultsTextArea.readOnly = true; resultsViewAreaContainer.appendChild(GSRS_App.uiElements.resultsTextArea);
            GSRS_App.uiElements.resultsListContainer = document.createElement('div'); GSRS_App.uiElements.resultsListContainer.id = 'gsrs-results-list-container'; resultsViewAreaContainer.appendChild(GSRS_App.uiElements.resultsListContainer);
            GSRS_App.uiElements.resultPreviewArea = document.createElement('div'); GSRS_App.uiElements.resultPreviewArea.id = 'gsrs-result-preview-area'; GSRS_App.uiElements.resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 10px;">Click an item from the list to see details.</p>'; resultsViewAreaContainer.appendChild(GSRS_App.uiElements.resultPreviewArea);
            return resultsViewAreaContainer;
        },
        createCopyDownloadOptions: function() {
            const copyDownloadOptionsDiv = document.createElement('div'); copyDownloadOptionsDiv.className = 'gsrs-copy-download-options';
            copyDownloadOptionsDiv.style.display = GSRS_App.currentSettings.showDownloadActionsArea ? 'block' : 'none';
            copyDownloadOptionsDiv.innerHTML = `<span>Action Target: </span><label><input type="radio" name="gsrsCopyDownloadTarget" value="current" checked> Current View</label><label><input type="radio" name="gsrsCopyDownloadTarget" value="all"> All Results</label>`;
            copyDownloadOptionsDiv.querySelectorAll('input[name="gsrsCopyDownloadTarget"]').forEach(radio => {
                radio.addEventListener('change', (event) => {
                    GSRS_App.state.copyDownloadTarget = event.target.value;
                    if(GSRS_App.currentSettings.debugMode) console.log("GSRS Debug: Copy/Download target set to:", GSRS_App.state.copyDownloadTarget);
                    this.updateActionLinkTitles();
                    updateActionButtonsState();
                });
            });
            const currentTargetRadio = copyDownloadOptionsDiv.querySelector(`input[value="${GSRS_App.state.copyDownloadTarget}"]`);
            if (currentTargetRadio) currentTargetRadio.checked = true;
            return copyDownloadOptionsDiv;
        },
        createActionButtonBar: function() {
            const actionButtonBar = document.createElement('div'); actionButtonBar.id = 'gsrs-action-button-bar'; actionButtonBar.className = 'gsrs-action-button-bar';
            actionButtonBar.style.display = GSRS_App.currentSettings.showDownloadActionsArea ? 'flex' : 'none';
            const copyActionSet = document.createElement('div'); copyActionSet.className = 'gsrs-action-set';
            const copyIcon = document.createElement('span'); copyIcon.className = 'icon gsrs-action-icon'; copyIcon.innerHTML = '📋'; copyActionSet.appendChild(copyIcon);
            ['json', 'urls', 'md'].forEach((format, index, arr) => {
                const link = document.createElement('span'); link.className = 'gsrs-action-format-link'; link.dataset.action = 'copy'; link.dataset.format = format; link.textContent = format.toUpperCase();
                if (format === 'urls') link.textContent = 'URLs'; if (format === 'md') link.textContent = 'MD';
                copyActionSet.appendChild(link); if (index < arr.length - 1) copyActionSet.appendChild(document.createTextNode(', '));
            });
            actionButtonBar.appendChild(copyActionSet);
            const downloadActionSet = document.createElement('div'); downloadActionSet.className = 'gsrs-action-set';
            const downloadIcon = document.createElement('span'); downloadIcon.className = 'icon gsrs-action-icon'; downloadIcon.innerHTML = '⬇️'; downloadActionSet.appendChild(downloadIcon);
            ['json', 'csv', 'urls', 'md'].forEach((format, index, arr) => {
                const link = document.createElement('span'); link.className = 'gsrs-action-format-link'; link.dataset.action = 'download'; link.dataset.format = format; link.textContent = format.toUpperCase();
                if (format === 'urls') link.textContent = 'URLs.txt'; if (format === 'md') link.textContent = 'MD';
                downloadActionSet.appendChild(link); if (index < arr.length - 1) downloadActionSet.appendChild(document.createTextNode(', '));
            });
            actionButtonBar.appendChild(downloadActionSet);
            this.updateActionLinkTitles();
            return actionButtonBar;
        },
        updateActionLinkTitles: function() {
            const actionButtonBar = document.getElementById('gsrs-action-button-bar'); if (!actionButtonBar) return;
            const targetText = GSRS_App.state.copyDownloadTarget === 'current' ? '(Current View)' : '(All Results)';
            actionButtonBar.querySelectorAll('.gsrs-action-format-link').forEach(link => {
                const action = link.dataset.action; const format = link.dataset.format.toUpperCase();
                let baseTitle = `${action.charAt(0).toUpperCase() + action.slice(1)} ${format === 'URLS' ? 'URLs' : format.replace('URLS.TXT', 'URLs.txt')}`;
                if (format === 'MD') baseTitle = `${action.charAt(0).toUpperCase() + action.slice(1)} MD`;
                link.title = `${baseTitle} ${targetText}`;
            });
        },
        createSettingsPanel: function() {
            const settingsPanel = document.createElement('div'); settingsPanel.id = 'gsrs-settings-panel';
            let exportOptionsHTML = '<div class="gsrs-export-options-grid">';
            const exportFieldLabels = { Position: "Position", Title: "Title", Url: "URL", SiteName: "Site Name", Breadcrumbs: "Breadcrumbs", Description: "Description", HighlightedSnippets: "Keywords", OriginalDateText: "Original Date", ParsedDateISO: "Parsed Date", ForumStats: "Forum Stats", RelatedPosts: "Related Posts" };
            Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                if (key.startsWith('exportCsvMd')) {
                    const fieldName = key.substring('exportCsvMd'.length);
                    const checkboxId = `gsrs-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}-checkbox`;
                    const labelText = exportFieldLabels[fieldName] || fieldName;
                    exportOptionsHTML += `<div><input type="checkbox" id="${checkboxId}"><label for="${checkboxId}" style="font-weight:normal; cursor:pointer;">${labelText}</label></div>`;
                }
            });
            exportOptionsHTML += '</div>';
            settingsPanel.innerHTML = ` <details open> <summary>Selectors</summary> <div> <div class="gsrs-setting-item"> <label for="gsrs-input-title-selector">Title Element Selector:</label> <div class="gsrs-setting-input-group"> <input type="text" id="gsrs-input-title-selector" title="CSS selector for result titles."> <button class="gsrs-test-selector-btn" data-input-id="gsrs-input-title-selector" data-result-id="gsrs-title-test-result" data-preview-id="gsrs-title-test-preview">Test</button> <span class="gsrs-test-result-span" id="gsrs-title-test-result"></span> </div> <div class="gsrs-selector-test-preview" id="gsrs-title-test-preview"></div> </div> <div class="gsrs-setting-item"> <label for="gsrs-input-observer-selector">Observer Target Selector:</label> <div class="gsrs-setting-input-group"> <input type="text" id="gsrs-input-observer-selector" title="CSS selector for the element to watch for dynamic content."> <button class="gsrs-test-selector-btn" data-input-id="gsrs-input-observer-selector" data-result-id="gsrs-observer-test-result" data-preview-id="gsrs-observer-test-preview">Test</button> <span class="gsrs-test-result-span" id="gsrs-observer-test-result"></span> </div> <div class="gsrs-selector-test-preview" id="gsrs-observer-test-preview"></div> </div> </div> </details> <details> <summary>Data Fetching & Processing</summary> <div> <div class="gsrs-setting-input-group" style="flex-direction: column; align-items: flex-start;"> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-title-checkbox"><label for="gsrs-fetch-title-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Title</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-url-checkbox"><label for="gsrs-fetch-url-checkbox" style="font-weight:normal; cursor:pointer;">Fetch URL</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-sitename-checkbox"><label for="gsrs-fetch-sitename-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Site Name</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-breadcrumbs-checkbox"><label for="gsrs-fetch-breadcrumbs-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Breadcrumbs</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-description-checkbox"><label for="gsrs-fetch-description-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Description</label></div> <div style="margin-left: 20px; margin-bottom: 5px; display: none;" id="gsrs-fetch-keywords-container"> <input type="checkbox" id="gsrs-fetch-description-keywords-checkbox"><label for="gsrs-fetch-description-keywords-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Highlighted Keywords in Description</label> </div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-dateinfo-checkbox"><label for="gsrs-fetch-dateinfo-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Date Information</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-forum-stats-checkbox"><label for="gsrs-fetch-forum-stats-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Forum Stats (Comments, Votes, etc.)</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-fetch-related-posts-checkbox"><label for="gsrs-fetch-related-posts-checkbox" style="font-weight:normal; cursor:pointer;">Fetch Related Posts (from forum results)</label></div> <div><input type="checkbox" id="gsrs-decode-urls-checkbox"><label for="gsrs-decode-urls-checkbox" style="font-weight:normal; cursor:pointer;">Decode URLs to Readable Format</label></div> </div> </div> </details> <details> <summary>CSV/Markdown Export Fields</summary> <div> ${exportOptionsHTML} </div> </details> <details> <summary>Interface Display Options</summary> <div> <div class="gsrs-setting-input-group" style="flex-direction: column; align-items: flex-start;"> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-dark-mode-checkbox"><label for="gsrs-dark-mode-checkbox" style="font-weight:normal; cursor:pointer;">Enable Dark Mode</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-show-preview-list-mode-checkbox"><label for="gsrs-show-preview-list-mode-checkbox" style="font-weight:normal; cursor:pointer;">Show preview in List mode</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-show-filter-area-checkbox"><label for="gsrs-show-filter-area-checkbox" style="font-weight:normal; cursor:pointer;">Show filter area</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-show-download-area-checkbox"><label for="gsrs-show-download-area-checkbox" style="font-weight:normal; cursor:pointer;">Show download actions area</label></div> </div> </div> </details> <details> <summary>Highlighting & Automation</summary> <div> <div class="gsrs-setting-input-group" style="flex-direction: column; align-items: flex-start;"> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-highlight-parsed-checkbox"><label for="gsrs-highlight-parsed-checkbox" style="font-weight:normal; cursor:pointer;">Highlight Scraped Results (temporary, during scrape)</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-highlight-list-item-on-page-checkbox"><label for="gsrs-highlight-list-item-on-page-checkbox" style="font-weight:normal; cursor:pointer;">Highlight selected list item on page</label></div> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-auto-scrape-checkbox"><label for="gsrs-auto-scrape-checkbox" style="font-weight:normal; cursor:pointer;">Auto-scrape new results on scroll (Experimental)</label></div> </div> </div> </details> <details> <summary>Debug & Output Options</summary> <div> <div class="gsrs-setting-input-group" style="flex-direction: column; align-items: flex-start;"> <div style="margin-bottom: 5px;"><input type="checkbox" id="gsrs-debug-mode-checkbox"><label for="gsrs-debug-mode-checkbox" style="font-weight:normal; cursor:pointer;">Enable Debug Mode Logging</label></div> <div><input type="checkbox" id="gsrs-hide-fields-checkbox"><label for="gsrs-hide-fields-checkbox" style="font-weight:normal; cursor:pointer;">Hide non-fetched fields in output</label></div> </div> </div> </details> <div class="gsrs-button-group" style="margin-top: 15px;"> <button class="gsrs-button" id="gsrs-btn-save-settings">Save Settings</button> <button class="gsrs-button" id="gsrs-btn-reset-settings">Reset to Defaults</button> </div> <p class="gsrs-settings-warning">Extraction uses title selector '<code>${GSRS_App.DEFAULT_SETTINGS.titleSelector}</code>' to find parent blocks.</p> `;
            return settingsPanel;
        },
        populateSettingsDOMElements: function() {
            GSRS_App.uiElements.settingsDOMElements = { titleInput: document.getElementById('gsrs-input-title-selector'), observerInput: document.getElementById('gsrs-input-observer-selector'), debugCheckbox: document.getElementById('gsrs-debug-mode-checkbox'), highlightCheckbox: document.getElementById('gsrs-highlight-parsed-checkbox'), highlightListItemOnPageCheckbox: document.getElementById('gsrs-highlight-list-item-on-page-checkbox'), autoScrapeCheckbox: document.getElementById('gsrs-auto-scrape-checkbox'), showPreviewInListModeCheckbox: document.getElementById('gsrs-show-preview-list-mode-checkbox'), showFilterInputAreaCheckbox: document.getElementById('gsrs-show-filter-area-checkbox'), showDownloadActionsAreaCheckbox: document.getElementById('gsrs-show-download-area-checkbox'), darkModeCheckbox: document.getElementById('gsrs-dark-mode-checkbox'), fetchTitleCheckbox: document.getElementById('gsrs-fetch-title-checkbox'), fetchUrlCheckbox: document.getElementById('gsrs-fetch-url-checkbox'), fetchSiteNameCheckbox: document.getElementById('gsrs-fetch-sitename-checkbox'), fetchDescriptionCheckbox: document.getElementById('gsrs-fetch-description-checkbox'), fetchDescriptionKeywordsCheckbox: document.getElementById('gsrs-fetch-description-keywords-checkbox'), fetchDateInfoCheckbox: document.getElementById('gsrs-fetch-dateinfo-checkbox'), fetchBreadcrumbsCheckbox: document.getElementById('gsrs-fetch-breadcrumbs-checkbox'), fetchForumStatsCheckbox: document.getElementById('gsrs-fetch-forum-stats-checkbox'), fetchRelatedPostsCheckbox: document.getElementById('gsrs-fetch-related-posts-checkbox'), decodeUrlsCheckbox: document.getElementById('gsrs-decode-urls-checkbox'), hideFieldsCheckbox: document.getElementById('gsrs-hide-fields-checkbox'), saveButton: document.getElementById('gsrs-btn-save-settings'), resetButton: document.getElementById('gsrs-btn-reset-settings'), };
            Object.keys(GSRS_App.DEFAULT_SETTINGS).forEach(key => {
                if (key.startsWith('exportCsvMd')) {
                    const checkboxId = `gsrs-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}-checkbox`;
                    GSRS_App.uiElements.settingsDOMElements[key + 'Checkbox'] = document.getElementById(checkboxId);
                }
            });
        },

        attachSettingsPanelEvents: function() {
            const elements = GSRS_App.uiElements.settingsDOMElements;
            if (elements.saveButton) elements.saveButton.addEventListener('click', () => GSRS_App.settingsManager.save());
            if (elements.resetButton) elements.resetButton.addEventListener('click', () => GSRS_App.settingsManager.resetToDefaults());
            if (elements.darkModeCheckbox) { elements.darkModeCheckbox.addEventListener('change', (event) => { this.toggleDarkMode(event.target.checked); }); }
            const settingsPanel = GSRS_App.uiElements.settingsPanel;
            if(settingsPanel) {
                settingsPanel.querySelectorAll('.gsrs-test-selector-btn').forEach(btn => { btn.addEventListener('click', () => testSelector(btn.dataset.inputId, btn.dataset.resultId, btn.dataset.previewId)); });
                const fetchDescCheckbox = elements.fetchDescriptionCheckbox;
                const fetchKeywordsContainer = settingsPanel.querySelector('#gsrs-fetch-keywords-container');
                const fetchKeywordsCheckbox = elements.fetchDescriptionKeywordsCheckbox;
                if (fetchDescCheckbox && fetchKeywordsContainer && fetchKeywordsCheckbox) {
                    const toggleKeywordsOption = () => { fetchKeywordsContainer.style.display = fetchDescCheckbox.checked ? 'block' : 'none'; if (!fetchDescCheckbox.checked) { fetchKeywordsCheckbox.checked = false; } };
                    fetchDescCheckbox.addEventListener('change', toggleKeywordsOption);
                    toggleKeywordsOption();
                }
                const detailsElements = settingsPanel.querySelectorAll('details');
                detailsElements.forEach(details => {
                    details.addEventListener('toggle', (event) => {
                        if (event.target.open) {
                            detailsElements.forEach(otherDetails => {
                                if (otherDetails !== event.target && otherDetails.open) {
                                    otherDetails.open = false;
                                }
                            });
                        }
                    });
                });
            }
        },
        attachActionLinkEvents: function() {
            const actionButtonBar = document.getElementById('gsrs-action-button-bar'); if (!actionButtonBar) return;
            actionButtonBar.querySelectorAll('.gsrs-action-format-link').forEach(link => {
                link.addEventListener('click', (event) => {
                    if (link.classList.contains('gsrs-action-disabled')) return;
                    const action = event.target.dataset.action; const format = event.target.dataset.format;
                    if (action === 'copy') {
                        if (format === 'json') handleCopyResults();
                        else if (format === 'urls') handleCopyUrls();
                        else if (format === 'md') handleCopyOrDownloadMarkdown('copy');
                    } else if (action === 'download') {
                        if (format === 'json') handleDownloadResults('json');
                        else if (format === 'csv') handleDownloadResults('csv');
                        else if (format === 'urls') handleDownloadUrls();
                        else if (format === 'md') handleCopyOrDownloadMarkdown('download');
                    }
                });
            });
        },
        createContextMenu: function() {
            const contextMenuElement = document.createElement('div'); contextMenuElement.id = 'gsrs-context-menu';
            if (GSRS_App.currentSettings.darkMode) { contextMenuElement.classList.add('gsrs-context-menu-dark'); }
            contextMenuElement.innerHTML = ` <div class="gsrs-context-menu-item" data-action="copy-json">Copy Item JSON</div> <div class="gsrs-context-menu-item" data-action="copy-title">Copy Title</div> <div class="gsrs-context-menu-item" data-action="copy-url">Copy URL</div> <div class="gsrs-context-menu-item" data-action="copy-description">Copy Description</div> <div class="gsrs-context-menu-separator"></div> <div class="gsrs-context-menu-item" data-action="open-url">Open URL in New Tab</div> <div class="gsrs-context-menu-item" data-action="highlight-on-page">Highlight Item on Page</div> `;
            contextMenuElement.querySelectorAll('.gsrs-context-menu-item').forEach(item => { if (item.dataset.action) { item.addEventListener('click', () => handleContextMenuAction(item.dataset.action)); } });
            document.addEventListener('click', (event) => { if (contextMenuElement && contextMenuElement.style.display === 'block') { if (!contextMenuElement.contains(event.target)) { contextMenuElement.style.display = 'none'; GSRS_App.state.currentContextMenuItemData = null; } } });
            contextMenuElement.addEventListener('contextmenu', e => e.preventDefault());
            return contextMenuElement;
        },
        toggleSettingsView: function(show) {
            const uiContainer = GSRS_App.uiElements.uiContainer; const settingsPanel = GSRS_App.uiElements.settingsPanel; if (!uiContainer || !settingsPanel) return;
            const shouldShow = typeof show === 'boolean' ? show : !uiContainer.classList.contains('gsrs-settings-view-active');
            GSRS_App.currentSettings.uiSettingsVisible = shouldShow;
            uiContainer.classList.toggle('gsrs-settings-view-active', shouldShow);
            const titleBarTextEl = document.getElementById('gsrs-title-bar-text');
            if (titleBarTextEl) { titleBarTextEl.textContent = GSRS_App.state.originalTitleBarText; }
            if (shouldShow) {
                const allDetails = settingsPanel.querySelectorAll('details');
                let firstOpenFound = false;
                allDetails.forEach(details => { if (details.hasAttribute('open')) { if (firstOpenFound) { details.removeAttribute('open'); } else { firstOpenFound = true; } } });
                if (!firstOpenFound && allDetails.length > 0 && !Array.from(allDetails).some(d => d.open)) { allDetails[0].open = true;}
            }
            GSRS_App.settingsManager.saveUIPrefs();
        },
        toggleDarkMode: function(enable) {
            if (typeof enable !== 'boolean') { enable = !GSRS_App.currentSettings.darkMode; }
            GSRS_App.currentSettings.darkMode = enable;
            if (GSRS_App.uiElements.uiContainer) { GSRS_App.uiElements.uiContainer.classList.toggle('gsrs-dark-theme', GSRS_App.currentSettings.darkMode); }
            if (GSRS_App.uiElements.contextMenuElement) { GSRS_App.uiElements.contextMenuElement.classList.toggle('gsrs-context-menu-dark', GSRS_App.currentSettings.darkMode); }
            GM_setValue('gsrs_darkMode', GSRS_App.currentSettings.darkMode);
            if (GSRS_App.uiElements.settingsDOMElements.darkModeCheckbox) { GSRS_App.uiElements.settingsDOMElements.darkModeCheckbox.checked = GSRS_App.currentSettings.darkMode; }
        },
        showUIMessage: function(message, type = 'success', duration = 3000, details = null) {
            const uiMessageDiv = GSRS_App.uiElements.uiMessageDiv; if (!uiMessageDiv) return;
            uiMessageDiv.textContent = message; uiMessageDiv.className = ''; uiMessageDiv.classList.add('gsrs-ui-message'); uiMessageDiv.classList.add(`gsrs-${type}`);
            uiMessageDiv.style.display = 'block';
            setTimeout(() => { if (uiMessageDiv) uiMessageDiv.style.display = 'none'; }, duration);
            if (details && (type === 'error' || GSRS_App.currentSettings.debugMode)) { console[type === 'error' ? 'error' : 'log'](`GSRS UI Message (${type}): ${message}`, details); }
        },
        makeDraggable: function(element, handle) { makeDraggable(element, handle); },
        toggleViewMode: function(mode) { toggleViewMode(mode); },
        updateObserverStatus: function(isActive) {
            const observerStatusSpan = GSRS_App.uiElements.observerStatusSpan;
            if (observerStatusSpan) {
                if(isActive) {
                    observerStatusSpan.innerHTML = '●';
                    observerStatusSpan.classList.add('gsrs-obs-active');
                    observerStatusSpan.classList.remove('gsrs-obs-inactive');
                    observerStatusSpan.title = 'Dynamic loading detection active';
                } else {
                    observerStatusSpan.innerHTML = '○';
                    observerStatusSpan.classList.remove('gsrs-obs-active');
                    observerStatusSpan.classList.add('gsrs-obs-inactive');
                    observerStatusSpan.title = 'Dynamic loading detection inactive';
                }
            }
        },
        updateResultsDisplay: function() { updateResultsDisplay(); },
        populateResultsList: function() { populateResultsList(); },
        addStyles: function() { GM_addStyle(STYLES); }
    };
	
    // STYLES (Reformatted for readability)
    const STYLES = `
        /* --- GSRS UI Container & Wrapper --- */
        #gsrs-ui-container {
            position: fixed;
            width: ${GSRS_App.DEFAULT_SETTINGS.uiPanelWidth}; /* Injected from default settings */
            min-height: 480px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 99999; /* High z-index to stay on top */
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            display: flex;
            flex-direction: column;
            transition: width 0.2s ease-out, height 0.2s ease-out, top 0.2s ease-out, left 0.2s ease-out, right 0.2s ease-out;
        }
        #gsrs-ui-container.gsrs-maximized-panel {
            min-height: unset; /* Allow full screen height */
        }
        #gsrs-ui-container.gsrs-minimized #gsrs-content-wrapper {
            display: none !important;
        }
        #gsrs-ui-container.gsrs-minimized {
            min-height: unset !important;
            height: auto !important; /* Collapse to title bar height */
        }
        #gsrs-content-wrapper {
            display: flex;
            flex-direction: column;
            flex-grow: 1; /* Take available vertical space */
            overflow: hidden; /* Prevent content spill */
            min-height: 0; /* For flex child proper shrinking */
            box-sizing: border-box;
            padding: 10px;
        }

        /* --- Title Bar --- */
        #gsrs-title-bar {
            padding: 8px 10px;
            background-color: #eee;
            border-bottom: 1px solid #ccc;
            cursor: move;
            user-select: none;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0; /* Don't shrink title bar */
        }
        #gsrs-settings-toggle-titlebar {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0 8px 0 0;
            color: #333;
            margin-right: auto; /* Pushes other controls to the right */
            flex-shrink: 0;
        }
        #gsrs-title-bar-text {
            text-align: center;
            flex-grow: 1;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        #gsrs-title-bar-controls {
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }
        #gsrs-ui-container.gsrs-minimized #gsrs-settings-toggle-titlebar {
            margin-right: 5px !important; /* Adjust spacing when minimized */
        }
        #gsrs-ui-container.gsrs-minimized #gsrs-title-bar-text {
            display: block !important; /* Ensure it's visible */
            flex-grow: 1 !important;
            text-align: center !important;
            margin-left: 5px;
            margin-right: 5px;
        }
        #gsrs-observer-status {
            font-size: 18px;
            margin-right: 10px;
        }
        #gsrs-observer-status.gsrs-obs-active { color: green; }
        #gsrs-observer-status.gsrs-obs-inactive { color: #FF8C00; }
        #gsrs-maximize-btn,
        #gsrs-minimize-btn {
            cursor: pointer;
            background: none;
            border: none;
            font-size: 16px;
            padding: 0 5px;
            color: #333;
            margin-left: 5px;
        }

        /* --- Main Content Areas (Actions, Filter, Results Display etc.) --- */
        .gsrs-main-actions,
        .gsrs-filter-container,
        #gsrs-results-count-wrapper,
        .gsrs-copy-download-options,
        .gsrs-action-button-bar,
        #gsrs-ui-message,
        #gsrs-results-view-area {
            padding-left: 0; /* Reset any inherited padding */
            padding-right: 0;
        }
        .gsrs-main-actions {
            margin-bottom: 10px;
            display: flex;
            gap: 5px;
        }
        .gsrs-filter-container {
            margin-bottom: 5px;
            display: flex;
            flex-shrink: 0; /* Prevent filter area from shrinking too much */
        }
        #gsrs-results-count-wrapper {
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        .gsrs-copy-download-options {
            margin-bottom: 5px;
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: #f0f0f0;
            border-radius:3px;
            flex-shrink: 0;
            text-align: center;
            font-size: 12px;
        }
        .gsrs-action-button-bar {
            margin-top: 8px;
            display: flex;
            gap: 15px; /* Space between copy/download sets */
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            flex-wrap: wrap; /* Allow wrapping if panel is too narrow */
            font-size: 13px;
        }
        #gsrs-ui-message {
            margin-top: 5px;
            font-size: 12px;
            padding-top: 5px;
            padding-bottom: 5px;
            border-radius: 3px;
            text-align: center;
            display: none; /* Shown by JS */
            flex-shrink: 0;
        }
        #gsrs-results-view-area {
            display: flex;
            flex-direction: column; /* Stack list and preview vertically */
            flex-grow: 1;
            min-height: 0; /* For flex child proper shrinking */
            overflow: hidden; /* Child elements will handle their own scroll */
            margin-bottom: 5px;
        }

        /* --- Buttons & Inputs --- */
        .gsrs-button {
            padding: 8px 12px;
            margin-right: 5px; /* Default spacing, overridden where needed */
            margin-bottom: 5px; /* Default spacing */
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            text-align: center;
            display: inline-flex; /* For icon alignment */
            align-items: center;
            justify-content: center;
            line-height: 1; /* Consistent line height */
        }
        .gsrs-button:hover { opacity: 0.9; }
        #gsrs-start-btn {
            background-color: #4CAF50; /* Green */
            flex-grow: 1; /* Take available space in main-actions */
            margin-right: 0;
            margin-bottom: 0;
        }
        #gsrs-clear-btn {
            background-color: #f44336; /* Red */
            margin-right: 0;
            margin-bottom: 0;
            flex-shrink: 0;
        }
        #gsrs-filter-input {
            flex-grow: 1;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 13px;
            margin-right: 5px; /* Space before clear button */
            height: 34px; /* Match button height */
            box-sizing: border-box;
        }
        #gsrs-filter-input.gsrs-filter-active {
            border-color: #FF9800; /* Orange highlight */
            box-shadow: 0 0 3px #FF980080;
        }
        #gsrs-clear-filter-btn {
            padding: 0 10px; /* Horizontal padding only */
            font-size: 16px;
            background-color: #9E9E9E; /* Grey */
            color: white;
            min-width: auto; /* Allow natural width */
            flex-shrink: 0;
            height: 34px; /* Match input height */
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .gsrs-copy-download-options label {
            margin-right: 15px;
            cursor: pointer;
        }
        .gsrs-copy-download-options input[type="radio"] {
            margin-right: 4px;
            vertical-align: middle;
            cursor: pointer;
        }

        /* --- Results Display (JSON, List, Preview) --- */
        #gsrs-results-area { /* JSON View Textarea */
            width: 100%;
            box-sizing: border-box;
            flex-grow: 1;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 5px;
            font-family: monospace;
            font-size: 12px;
            resize: none; /* Or 'vertical' if preferred */
        }
        #gsrs-results-count {
            font-size: 12px;
            color: #555;
        }
        .gsrs-view-toggle-buttons button {
            font-size: 11px;
            padding: 3px 6px;
            background-color: #e0e0e0;
            color: #333;
            border: 1px solid #ccc;
            margin-left: 5px;
        }
        .gsrs-view-toggle-buttons button.active {
            background-color: #c0c0c0;
            font-weight: bold;
        }
        #gsrs-results-list-container {
            display: none; /* Toggled by JS */
            flex-direction: column;
            width: 100%;
            flex-grow: 3; /* Takes more space than preview */
            flex-shrink: 1;
            flex-basis: 150px; /* Initial basis */
            min-height: 120px; /* Minimum scrollable area */
            max-height: 100%; /* Don't exceed parent */
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 5px;
            margin-bottom:5px; /* Space between list and preview */
            background-color: #fff;
            box-sizing: border-box;
        }
        #gsrs-results-list-container .gsrs-list-item {
            padding: 3px 5px;
            cursor: pointer;
            border-bottom: 1px dotted #eee;
            font-size: 12px;
            line-height: 1.4;
            overflow-wrap: break-word;
            user-select: none;
        }
        #gsrs-results-list-container .gsrs-list-item:last-child {
            border-bottom: none;
        }
        #gsrs-results-list-container .gsrs-list-item:hover {
            background-color: #f0f0f0;
        }
        #gsrs-results-list-container .gsrs-list-item.selected {
            background-color: #d0e0ff; /* Light blue selection */
            font-weight: bold;
        }
        #gsrs-result-preview-area {
            display: none; /* Toggled by JS */
            width: 100%;
            flex-grow: 1; /* Takes less space than list */
            flex-shrink: 1;
            flex-basis: 80px; /* Initial basis */
            min-height: 80px; /* Minimum scrollable area */
            max-height: 30%; /* Limit height relative to parent */
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 5px;
            background-color: #fff;
            font-size: 12px;
            box-sizing: border-box;
        }
        #gsrs-result-preview-area p {
            margin: 0 0 5px 0;
            word-break: break-all;
        }
        #gsrs-result-preview-area strong { font-weight: bold; }
        #gsrs-result-preview-area a { color: #1a0dab; text-decoration: none; }
        #gsrs-result-preview-area a:hover { text-decoration: underline; }
        #gsrs-result-preview-area .gsrs-preview-related-posts { margin-top: 8px; border-top: 1px solid #eee; padding-top: 5px; }
        #gsrs-result-preview-area .gsrs-preview-related-post-item { font-size: 11px; margin-bottom: 3px; }
        #gsrs-result-preview-area .gsrs-preview-related-post-item span { color: #555; }


        /* --- UI Messages --- */
        #gsrs-ui-message.gsrs-success {
            background-color: #d4edda; /* Bootstrap success green */
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        #gsrs-ui-message.gsrs-error {
            background-color: #f8d7da; /* Bootstrap error red */
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        /* --- Settings Panel --- */
        #gsrs-settings-panel {
            display: none; /* Shown when .gsrs-settings-view-active on container */
            flex-direction: column;
            overflow-y: auto;
            padding: 10px;
            background-color: #fff;
            box-sizing: border-box;
        }
        #gsrs-ui-container.gsrs-settings-view-active #gsrs-content-wrapper > *:not(#gsrs-settings-panel) {
            display: none !important;
        }
        #gsrs-ui-container.gsrs-settings-view-active #gsrs-settings-panel {
            display: flex !important;
            flex-grow: 1;
            min-height: 0;
        }
        #gsrs-settings-panel details {
            border: 1px solid #eee;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        #gsrs-settings-panel summary {
            padding: 8px;
            background-color: #f7f7f7;
            cursor: pointer;
            font-weight: bold;
            list-style-position: inside;
            border-bottom: 1px solid #eee;
        }
        #gsrs-settings-panel details[open] summary {
            border-bottom: 1px solid #eee;
        }
        #gsrs-settings-panel details > div {
            padding: 10px;
        }
        .gsrs-export-options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 5px;
        }
        .gsrs-setting-item { margin-bottom: 8px; }
        .gsrs-setting-item.gsrs-setting-group-divider {
            margin-top: 15px;
            margin-bottom: 10px;
            border-top: 1px dashed #ccc;
            padding-top: 10px;
        }
        .gsrs-setting-item label { /* General labels in settings */
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
            font-size: 12px;
        }
        .gsrs-setting-input-group {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        .gsrs-setting-item input[type="text"] {
            flex-grow: 1;
            min-width: 150px;
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            margin-right: 5px;
        }
        .gsrs-setting-item input[type="checkbox"] {
            margin-right: 5px;
            vertical-align: middle;
        }
        #gsrs-btn-save-settings { background-color: #007bff; /* Blue */ }
        #gsrs-btn-reset-settings { background-color: #dc3545; /* Red */ }
        .gsrs-settings-warning {
            font-size: 11px;
            color: #777;
            margin-top: 10px;
        }
        .gsrs-test-selector-btn {
            background-color: #607D8B !important; /* Blue Grey */
            font-size: 11px !important;
            padding: 4px 8px !important;
            margin-left: 5px;
            flex-shrink: 0;
            color: white !important;
        }
        .gsrs-test-result-span {
            font-size: 11px;
            margin-left: 8px;
            color: #3F51B5; /* Indigo */
            white-space: nowrap;
        }
        .gsrs-selector-test-preview {
            max-height: 150px;
            overflow-y: auto;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 5px;
            margin-top: 5px;
            font-family: monospace;
            font-size: 11px;
            white-space: pre-wrap;
            word-break: break-all;
            display: none;
        }
        .gsrs-selector-test-preview strong {
            font-weight: bold;
            display: block;
            margin-bottom: 3px;
            font-size: 10px;
            color: #555;
        }
        .gsrs-dark-theme .gsrs-selector-test-preview div {
            background-color: #2c2c2c !important;
            color: #e0e0e0 !important;
            border: 1px solid #4a4a4a !important;
        }

        /* --- Action Links (Copy/Download) --- */
        .gsrs-action-set {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .gsrs-action-icon {
            font-size: 1.1em;
            margin-right: 2px;
        }
        .gsrs-action-format-link {
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
        }
        .gsrs-action-format-link:hover {
            text-decoration: underline;
            color: #0056b3;
        }
        .gsrs-action-format-link.gsrs-action-disabled {
            color: #bbbbbb !important;
            cursor: default;
            pointer-events: none;
            text-decoration: none !important;
        }

        /* --- Highlighting Styles --- */
        .gsrs-highlighted {
            outline: 2px dashed #FF9800 !important; /* Orange */
            box-shadow: 0 0 10px #FF980080 !important;
            transition: outline 0.5s ease-out, box-shadow 0.5s ease-out;
        }
        .gsrs-selector-test-highlight {
            outline: 2px dashed #4CAF50 !important; /* Green */
            background-color: rgba(76, 175, 80, 0.1) !important;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.5) !important;
            transition: outline 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out;
        }
        .gsrs-context-highlight {
            outline: 3px solid #2196F3 !important; /* Blue */
            background-color: rgba(33, 150, 243, 0.15) !important;
            box-shadow: 0 0 10px rgba(33, 150, 243, 0.6) !important;
            transition: outline 0.4s ease-in-out, background-color 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
        }
        .gsrs-list-item-page-highlight {
            outline: 3px solid #00BCD4 !important; /* Cyan */
            background-color: rgba(0, 188, 212, 0.15) !important;
            box-shadow: 0 0 10px rgba(0, 188, 212, 0.6) !important;
            transition: outline 0.4s ease-in-out, background-color 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
        }

        /* --- Context Menu --- */
        #gsrs-context-menu {
            position: fixed;
            display: none;
            background-color: #ffffff;
            border: 1px solid #cccccc;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            border-radius: 4px;
            padding: 5px 0;
            z-index: 100000;
            font-size: 13px;
            min-width: 180px;
            color: #333333;
        }
        .gsrs-context-menu-item {
            padding: 7px 15px;
            cursor: pointer;
            user-select: none;
            color: #333333;
        }
        .gsrs-context-menu-item:hover {
            background-color: #f0f0f0;
            color: #111111;
        }
        .gsrs-context-menu-item.gsrs-cm-disabled {
            color: #aaaaaa !important;
            cursor: default !important;
            background-color: transparent !important;
        }
        .gsrs-context-menu-separator {
            height: 1px;
            background-color: #e0e0e0;
            margin: 4px 0;
        }

        /* --- Dark Theme --- */
        #gsrs-ui-container.gsrs-dark-theme {
            background-color: #2e2e2e;
            color: #e0e0e0;
            border: 1px solid #4a4a4a;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-title-bar {
            background-color: #202124;
            border-bottom: 1px solid #4a4a4a;
            color: #e0e0e0;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-settings-toggle-titlebar,
        #gsrs-ui-container.gsrs-dark-theme #gsrs-maximize-btn,
        #gsrs-ui-container.gsrs-dark-theme #gsrs-minimize-btn,
        #gsrs-ui-container.gsrs-dark-theme #gsrs-observer-status {
            color: #e0e0e0;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-observer-status.gsrs-obs-active { color: #6fbf73; /* Lighter green for dark bg */ }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-observer-status.gsrs-obs-inactive { color: #FFB74D; /* Lighter Orange */ }
        #gsrs-ui-container.gsrs-dark-theme input[type="text"],
        #gsrs-ui-container.gsrs-dark-theme textarea {
            background-color: #3c4043;
            color: #e0e0e0;
            border: 1px solid #5f6368;
        }
        #gsrs-ui-container.gsrs-dark-theme input[type="text"]::placeholder,
        #gsrs-ui-container.gsrs-dark-theme textarea::placeholder {
            color: #9e9e9e;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-filter-input.gsrs-filter-active {
            border-color: #fdd835; /* Yellow for dark theme */
            box-shadow: 0 0 3px #fdd83580;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-start-btn { background-color: #388e3c; /* Darker Green */ }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-clear-btn { background-color: #d32f2f; /* Darker Red */ }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-clear-filter-btn { background-color: #4a4a4a !important; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-test-selector-btn { background-color: #455A64 !important; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-copy-download-options {
            background-color: #3c4043;
            border: 1px solid #4a4a4a;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-results-count { color: #bdbdbd; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-view-toggle-buttons button {
            background-color: #424242;
            color: #e0e0e0;
            border: 1px solid #5f6368;
        }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-view-toggle-buttons button.active { background-color: #535353; }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-results-area,
        #gsrs-ui-container.gsrs-dark-theme #gsrs-results-list-container,
        #gsrs-ui-container.gsrs-dark-theme #gsrs-result-preview-area {
            background-color: #202124; /* Very dark grey, like Google's dark theme */
            border: 1px solid #4a4a4a;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-settings-panel { background-color: #2e2e2e; }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-settings-panel details { border: 1px solid #4a4a4a; }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-settings-panel summary {
            background-color: #3c4043;
            border-bottom: 1px solid #4a4a4a;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-settings-panel details[open] summary { border-bottom: 1px solid #4a4a4a; }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-results-list-container .gsrs-list-item {
            border-bottom: 1px dotted #4a4a4a;
            color: #e0e0e0;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-results-list-container .gsrs-list-item:hover { background-color: #3c4043; }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-results-list-container .gsrs-list-item.selected {
            background-color: #334e7c; /* Darker blue for selection */
            font-weight: bold;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-result-preview-area a { color: #8ab4f8; /* Google's dark theme link color */ }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-action-format-link { color: #8ab4f8; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-action-format-link:hover { color: #aecbfa; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-action-format-link.gsrs-action-disabled { color: #777777 !important; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-setting-item label { color: #e0e0e0; }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-setting-input-group input[type="checkbox"] + label {
            color: #e0e0e0 !important;
            font-weight: normal !important;
        }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-settings-warning { color: #bdbdbd; }
        .gsrs-dark-theme .gsrs-selector-test-preview {
            background-color: #3c4043;
            border: 1px solid #5f6368;
        }
        .gsrs-dark-theme .gsrs-selector-test-preview div {
            background-color: #2c2c2c !important;
            color: #e0e0e0 !important;
            border: 1px solid #4a4a4a !important;
        }
        .gsrs-dark-theme .gsrs-selector-test-preview strong { color: #bdbdbd; }
        .gsrs-dark-theme .gsrs-test-result-span { color: #81d4fa; /* Light blue */ }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-ui-message.gsrs-success {
            background-color: #2E7D32; color: #C8E6C9; border: 1px solid #388E3C;
        }
        #gsrs-ui-container.gsrs-dark-theme .gsrs-ui-message.gsrs-error {
            background-color: #C62828; color: #FFCDD2; border: 1px solid #D32F2F;
        }
        #gsrs-ui-container.gsrs-dark-theme #gsrs-result-preview-area .gsrs-preview-related-post-item span { color: #9e9e9e; }
        /* Dark theme scrollbar */
        #gsrs-ui-container.gsrs-dark-theme ::-webkit-scrollbar { width: 10px; height: 10px; }
        #gsrs-ui-container.gsrs-dark-theme ::-webkit-scrollbar-track { background: #2e2e2e; }
        #gsrs-ui-container.gsrs-dark-theme ::-webkit-scrollbar-thumb { background: #555; border-radius: 5px; border: 2px solid #2e2e2e; }
        #gsrs-ui-container.gsrs-dark-theme ::-webkit-scrollbar-thumb:hover { background: #666; }
        #gsrs-ui-container.gsrs-dark-theme select {
            background-color: #3c4043;
            color: #e0e0e0;
            border: 1px solid #5f6368;
        }
        /* Dark theme context menu */
        #gsrs-context-menu.gsrs-context-menu-dark {
            background-color: #383838;
            border-color: #585858;
            color: #e0e0e0;
        }
        #gsrs-context-menu.gsrs-context-menu-dark .gsrs-context-menu-item { color: #e0e0e0; }
        #gsrs-context-menu.gsrs-context-menu-dark .gsrs-context-menu-item:hover { background-color: #4f4f4f; color: #ffffff; }
        #gsrs-context-menu.gsrs-context-menu-dark .gsrs-context-menu-item.gsrs-cm-disabled { color: #777777 !important; }
        #gsrs-context-menu.gsrs-context-menu-dark .gsrs-context-menu-separator { background-color: #5f6368; }
    `;
	
    // Punycode.js
    const punycode = (() => {
        const maxInt = 2147483647; const base = 36; const tMin = 1; const tMax = 26; const skew = 38; const damp = 700; const initialBias = 72; const initialN = 128; const delimiter = '-'; const errors = { 'overflow': 'Overflow: input needs wider integers to process', 'not-basic': 'Illegal input >= 0x80 (not a basic code point)', 'invalid-input': 'Invalid input' }; const baseMinusTMin = base - tMin; function error(type) { throw new RangeError(errors[type]); } function basicToDigit(codePoint) { if (codePoint - 0x30 < 0x0A) { return codePoint - 0x16; } if (codePoint - 0x41 < 0x1A) { return codePoint - 0x41; } if (codePoint - 0x61 < 0x1A) { return codePoint - 0x61; } return base; } function adapt(delta, numPoints, firstTime) { let k = 0; delta = firstTime ? Math.floor(delta / damp) : delta >> 1; delta += Math.floor(delta / numPoints); for (; delta > baseMinusTMin * tMax >> 1; k += base) { delta = Math.floor(delta / baseMinusTMin); } return Math.floor(k + (baseMinusTMin + 1) * delta / (delta + skew)); } function decode(input) { const output = []; const inputLength = input.length; let i = 0; let n = initialN; let bias = initialBias; let basic = input.lastIndexOf(delimiter); if (basic < 0) { basic = 0; } for (let j = 0; j < basic; ++j) { if (input.charCodeAt(j) >= 0x80) { error('not-basic'); } output.push(input.charCodeAt(j)); } for (let index = basic > 0 ? basic + 1 : 0; index < inputLength;) { let oldi = i; let w = 1; for (let k = base; ; k += base) { if (index >= inputLength) { error('invalid-input'); } const digit = basicToDigit(input.charCodeAt(index++)); if (digit >= base || digit > Math.floor((maxInt - i) / w)) { error('overflow'); } i += digit * w; const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias); if (digit < t) { break; } const baseMinusT = base - t; if (w > Math.floor(maxInt / baseMinusT)) { error('overflow'); } w *= baseMinusT; } const out = output.length + 1; bias = adapt(i - oldi, out, oldi == 0); if (Math.floor(i / out) > maxInt - n) { error('overflow'); } n += Math.floor(i / out); i %= out; output.splice(i++, 0, n); } return String.fromCodePoint(...output); } return { decode: decode, };
    })();

    // --- Date Parsing Functions (Enhanced for i18n) ---
    function getPageLanguageSimple() { const htmlLang = document.documentElement.lang; if (htmlLang) { const langPart = htmlLang.split('-')[0].toLowerCase(); const regionPart = htmlLang.split('-')[1]?.toLowerCase(); if (langPart === "zh") { if (regionPart === "tw" || regionPart === "hk" || htmlLang.toLowerCase().includes("hant")) return "zh-tw"; return "zh-tw"; } if (langPart === "ja") return "ja"; if (langPart === "en") return "en"; } return "unknown"; }
    const englishMonths = { jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11 };
    function parseDateStringPureJS(textDate, refDate = new Date()) {
        if (!textDate || typeof textDate !== 'string' || textDate.trim() === '') { return null; }
        const originalTextDate = textDate.trim();
        let textForMatching = originalTextDate.toLowerCase();
        const debug = GSRS_App.currentSettings && GSRS_App.currentSettings.debugMode;
        const lang = getPageLanguageSimple();
        let year, month, day, hour, minute, second;
        const tempDate = new Date(refDate.getTime());
        if (debug) console.log(`GSRS (PureJSParse Attempt): "${originalTextDate}", Lang: ${lang}, RefDate: ${refDate.toISOString()}`);

        // Relative Date Patterns (Multi-lingual)
        const relativePatterns = [
            { lang: 'en', pattern: /^(\d+)\s+(hour|minute|second|day|week|month|year)s?\s+ago$/, handler: (v, u) => {
                if (u === 'hour') tempDate.setHours(tempDate.getHours() - v); else if (u === 'minute') tempDate.setMinutes(tempDate.getMinutes() - v); else if (u === 'second') tempDate.setSeconds(tempDate.getSeconds() - v); else if (u === 'day') tempDate.setDate(tempDate.getDate() - v); else if (u === 'week') tempDate.setDate(tempDate.getDate() - (v * 7)); else if (u === 'month') tempDate.setMonth(tempDate.getMonth() - v); else if (u === 'year') tempDate.setFullYear(tempDate.getFullYear() - v); return tempDate; } },
            { lang: 'ja', pattern: /^(\d+)\s*時間前$/, handler: (v) => { tempDate.setHours(tempDate.getHours() - v); return tempDate; } },
            { lang: 'ja', pattern: /^(\d+)\s*分前$/, handler: (v) => { tempDate.setMinutes(tempDate.getMinutes() - v); return tempDate; } },
            { lang: 'ja', pattern: /^(\d+)\s*日前$/, handler: (v) => { tempDate.setDate(tempDate.getDate() - v); return tempDate; } },
            { lang: 'ja', pattern: /^(\d+)\s*週間前$/, handler: (v) => { tempDate.setDate(tempDate.getDate() - (v * 7)); return tempDate; } },
            { lang: 'ja', pattern: /^(\d+)\s*か月前$/, handler: (v) => { tempDate.setMonth(tempDate.getMonth() - v); return tempDate; } },
            { lang: 'ja', pattern: /^(\d+)\s*年前$/, handler: (v) => { tempDate.setFullYear(tempDate.getFullYear() - v); return tempDate; } },
            { lang: 'zh-tw', pattern: /^(\d+)\s*小時前$/, handler: (v) => { tempDate.setHours(tempDate.getHours() - v); return tempDate; } },
            { lang: 'zh-tw', pattern: /^(\d+)\s*分鐘前$/, handler: (v) => { tempDate.setMinutes(tempDate.getMinutes() - v); return tempDate; } },
            { lang: 'zh-tw', pattern: /^(\d+)\s*天前$/, handler: (v) => { tempDate.setDate(tempDate.getDate() - v); return tempDate; } },
            { lang: 'zh-tw', pattern: /^(\d+)\s*週前$/, handler: (v) => { tempDate.setDate(tempDate.getDate() - (v * 7)); return tempDate; } },
            { lang: 'zh-tw', pattern: /^(\d+)\s*個月前$/, handler: (v) => { tempDate.setMonth(tempDate.getMonth() - v); return tempDate; } },
            { lang: 'zh-tw', pattern: /^(\d+)\s*年前$/, handler: (v) => { tempDate.setFullYear(tempDate.getFullYear() - v); return tempDate; } },
        ];

        for (const p of relativePatterns) {
            if (p.lang === lang || lang === 'unknown') {
                let match = originalTextDate.match(p.pattern);
                if (match) {
                    const value = parseInt(match[1]);
                    const unit = match.length > 2 ? match[2] : null;
                    const parsed = p.handler(value, unit);
                    if (debug) console.log(`GSRS (PureJSParse Rel): "${originalTextDate}" -> ${parsed.toISOString()}`);
                    return parsed;
                }
            }
        }
        
        // Keyword-based relative dates (Multi-lingual)
        const keywordDates = [
            { lang: 'en', keywords: ["yesterday"], handler: () => { tempDate.setDate(tempDate.getDate() - 1); tempDate.setHours(0,0,0,0); return tempDate; } },
            { lang: 'en', keywords: ["just now", "now"], handler: () => new Date(refDate.getTime()) },
            { lang: 'ja', keywords: ["昨日"], handler: () => { tempDate.setDate(tempDate.getDate() - 1); tempDate.setHours(0,0,0,0); return tempDate; } },
            { lang: 'ja', keywords: ["たった今", "今さっき"], handler: () => new Date(refDate.getTime()) },
            { lang: 'zh-tw', keywords: ["昨天"], handler: () => { tempDate.setDate(tempDate.getDate() - 1); tempDate.setHours(0,0,0,0); return tempDate; } },
            { lang: 'zh-tw', keywords: ["剛剛", "剛"], handler: () => new Date(refDate.getTime()) }
        ];

        for (const kd of keywordDates) {
             if (kd.lang === lang || lang === 'unknown') {
                 if (kd.keywords.includes(textForMatching)) {
                     const parsed = kd.handler();
                     if (debug) console.log(`GSRS (PureJSParse Rel Keyword): "${originalTextDate}" -> ${parsed.toISOString()}`);
                     return parsed;
                 }
             }
        }

        let parsed, isValid, hasTimePartInString;
        let engAbsMatch = originalTextDate.match(/^([a-z.]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s*|\s+)(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?)?$/i);
        if (engAbsMatch) {
            const monthName = engAbsMatch[1].toLowerCase().replace('.', '');
            month = englishMonths[monthName]; day = parseInt(engAbsMatch[2]); year = parseInt(engAbsMatch[3]);
            hasTimePartInString = false;
            if (typeof month === 'number' && month >= 0 && month <= 11) {
                hour = 0; minute = 0; second = 0;
                if (engAbsMatch[4] && engAbsMatch[5]) {
                    hasTimePartInString = true;
                    hour = parseInt(engAbsMatch[4]); minute = parseInt(engAbsMatch[5]); second = engAbsMatch[6] ? parseInt(engAbsMatch[6]) : 0;
                    const ampm = engAbsMatch[7] ? engAbsMatch[7].toLowerCase() : null;
                    if (ampm === 'pm' && hour < 12) hour += 12;
                    if (ampm === 'am' && hour === 12) hour = 0;
                }
                parsed = hasTimePartInString ? new Date(year, month, day, hour, minute, second) : new Date(Date.UTC(year, month, day));
                isValid = hasTimePartInString ? (parsed.getFullYear() === year && parsed.getMonth() === month && parsed.getDate() === day && parsed.getHours() === hour && parsed.getMinutes() === minute) : (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month && parsed.getUTCDate() === day);
                if (isValid) {
                    if (debug) console.log(`GSRS (PureJSParse EN Abs MonthDDYYYY): "${originalTextDate}" -> ${parsed.toISOString()} (UTC: ${!hasTimePartInString})`);
                    return parsed;
                } else if (debug) {
                    console.log(`GSRS (PureJSParse EN Abs MonthDDYYYY): Invalid date components for "${originalTextDate}" -> Y:${year},M:${month},D:${day}, H:${hour},m:${minute} (UTC: ${!hasTimePartInString})`);
                }
            }
        }
        let cjkDateParts = originalTextDate.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日?(?:\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (cjkDateParts) {
            year = parseInt(cjkDateParts[1]); month = parseInt(cjkDateParts[2]) - 1; day = parseInt(cjkDateParts[3]);
            hasTimePartInString = !!(cjkDateParts[4] && cjkDateParts[5]);
            hour = hasTimePartInString ? parseInt(cjkDateParts[4]) : 0; minute = hasTimePartInString ? parseInt(cjkDateParts[5]) : 0; second = (hasTimePartInString && cjkDateParts[6]) ? parseInt(cjkDateParts[6]) : 0;
            parsed = hasTimePartInString ? new Date(year, month, day, hour, minute, second) : new Date(Date.UTC(year, month, day));
            isValid = hasTimePartInString ? (parsed.getFullYear() === year && parsed.getMonth() === month && parsed.getDate() === day) : (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month && parsed.getUTCDate() === day);
            if (isValid) {
                if (debug) console.log(`GSRS (PureJSParse CJK Abs YMD): "${originalTextDate}" -> ${parsed.toISOString()} (UTC: ${!hasTimePartInString})`);
                return parsed;
            }
        }
        cjkDateParts = !parsed ? originalTextDate.match(/(\d{1,2})月\s*(\d{1,2})日?/) : null;
        if (cjkDateParts) {
            month = parseInt(cjkDateParts[1]) - 1; day = parseInt(cjkDateParts[2]);
            hasTimePartInString = false;
            year = refDate.getFullYear();
            const tempProspectiveDateThisYear = new Date(Date.UTC(year, month, day));
            if (tempProspectiveDateThisYear.getTime() > refDate.getTime() && (month > refDate.getUTCMonth() || (month === refDate.getUTCMonth() && day > refDate.getUTCDate()))) {
                year--;
            }
            parsed = new Date(Date.UTC(year, month, day));
            isValid = (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month && parsed.getUTCDate() === day);
            if (isValid) {
                if (debug) console.log(`GSRS (PureJSParse CJK Abs MD): "${originalTextDate}" -> ${parsed.toISOString()} (UTC: true)`);
                return parsed;
            }
        }
        let isoDateParts = !parsed ? originalTextDate.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/) : null;
        if (isoDateParts) {
            year = parseInt(isoDateParts[1]); month = parseInt(isoDateParts[2]) - 1; day = parseInt(isoDateParts[3]);
            hasTimePartInString = !!(isoDateParts[4] && isoDateParts[5]);
            hour = hasTimePartInString ? parseInt(isoDateParts[4]) : 0; minute = hasTimePartInString ? parseInt(isoDateParts[5]) : 0; second = (hasTimePartInString && isoDateParts[6]) ? parseInt(isoDateParts[6]) : 0;
            parsed = hasTimePartInString ? new Date(year, month, day, hour, minute, second) : new Date(Date.UTC(year, month, day));
            isValid = hasTimePartInString ? (parsed.getFullYear() === year && parsed.getMonth() === month && parsed.getDate() === day) : (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month && parsed.getUTCDate() === day);
            if (isValid) {
                if (debug) console.log(`GSRS (PureJSParse ISO-like): "${originalTextDate}" -> ${parsed.toISOString()} (UTC: ${!hasTimePartInString})`);
                return parsed;
            }
        }
        let mdDateParts = !parsed ? originalTextDate.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/) : null;
        if (mdDateParts) {
            hasTimePartInString = false;
            let mAttempt, dAttempt;
            if (lang === 'en' || lang === 'unknown') {
                mAttempt = parseInt(mdDateParts[1]) - 1; dAttempt = parseInt(mdDateParts[2]);
            } else {
                dAttempt = parseInt(mdDateParts[1]); mAttempt = parseInt(mdDateParts[2]) - 1;
            }
            year = parseInt(mdDateParts[3]);
            parsed = new Date(Date.UTC(year, mAttempt, dAttempt));
            isValid = (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === mAttempt && parsed.getUTCDate() === dAttempt);
            if (isValid) {
                if (debug) console.log(`GSRS (PureJSParse M/D/YYYY or D.M.YYYY like): "${originalTextDate}" -> ${parsed.toISOString()} (UTC: true)`);
                return parsed;
            }
        }
        if (debug) console.log(`GSRS (PureJSParse): Failed to parse "${originalTextDate}" with all PureJS rules.`);
        return null;
    }

    // --- Utility Functions ---
    function isValidSelector(selector) { if (!selector || typeof selector !== 'string' || selector.trim() === '') return false; try { document.querySelector(selector); return true; } catch (e) { return false; } }
    function convertToMarkdownList(dataArray) { if (!dataArray || dataArray.length === 0) { return ''; } let mdString = ""; const headersOrder = [ 'position', 'title', 'url', 'siteName', 'breadcrumbs', 'description', 'highlightedSnippets', 'originalDateText', 'parsedDateISO', 'forumStats', 'relatedPosts' ]; dataArray.forEach(item => { let itemMd = ""; let hasContent = false; headersOrder.forEach(key => { const settingKey = `exportCsvMd${key.charAt(0).toUpperCase() + key.slice(1)}`; if (item.hasOwnProperty(key) && GSRS_App.currentSettings[settingKey]) { let value = item[key] === null || typeof item[key] === 'undefined' ? 'N/A' : item[key]; if (value === 'N/A' || (Array.isArray(value) && value.length === 0)) return; if (!hasContent && item.position) { itemMd += `- **Position:** ${item.position || 'N/A'}\n`; hasContent = true; } else if (key !== 'position') { if (key === 'url' && item[key] && item[key] !== 'N/A') { value = `[${item[key].replace(/([\[\]])/g, "\\$1")}](${item[key].replace(/\)/g, "%29")})`; } else if (key === 'relatedPosts' && Array.isArray(value) && value.length > 0) { let relatedPostsMd = '\n'; value.forEach(post => { relatedPostsMd += `    - **[${post.title.replace(/([\[\]])/g, "\\$1")}](${post.url.replace(/\)/g, "%29")})**`; if (post.stats) relatedPostsMd += ` (${post.stats})`; if (post.date) relatedPostsMd += ` - _${post.date}_`; relatedPostsMd += '\n'; }); value = relatedPostsMd; } else if (typeof value === 'string') { value = value.replace(/\n/g, ' '); } let displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); if (key === 'highlightedSnippets') displayName = 'Keywords'; if (key === 'originalDateText') displayName = 'Original Date'; if (key === 'parsedDateISO') displayName = 'Parsed Date'; if (key === 'forumStats') displayName = 'Forum Stats'; if (key === 'relatedPosts') displayName = 'Related Posts'; itemMd += `  - **${displayName}:** ${value}\n`; hasContent = true; } } }); if (hasContent) { mdString += itemMd + "\n"; } }); return mdString.trim(); }
    function convertToCSV(dataArray) { if (!dataArray || dataArray.length === 0) { return ''; } const escapeCSVField = (field) => { if (field === null || typeof field === 'undefined') { return ''; } if (Array.isArray(field)) { field = JSON.stringify(field); } const stringField = String(field); if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n') || stringField.includes('\r')) { return `"${stringField.replace(/"/g, '""')}"`; } return stringField; }; const firstItemKeys = Object.keys(dataArray[0]); const headers = firstItemKeys.filter(key => { const settingKey = `exportCsvMd${key.charAt(0).toUpperCase() + key.slice(1)}`; return GSRS_App.currentSettings[settingKey] === true; }); if (headers.length === 0) return ''; const csvRows = []; csvRows.push(headers.map(header => escapeCSVField(header)).join(',')); for (const item of dataArray) { const row = headers.map(header => { return escapeCSVField(item[header]); }); csvRows.push(row.join(',')); } return csvRows.join('\r\n'); }
    function decodeUrlIfEnabled(urlString) { if (!GSRS_App.currentSettings.decodeUrlsToReadable || !urlString || urlString === "Extraction Failed") { return urlString; } let decodedUrl = urlString; try { decodedUrl = decodeURIComponent(urlString.replace(/\+/g, '%20')); } catch (e) { if (GSRS_App.currentSettings.debugMode) console.warn(`GSRS: decodeURIComponent failed for "${urlString}". Using intermediate: "${decodedUrl}". Error: ${e.message}`); } try { const tempUrl = (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://') || decodedUrl.startsWith('//')) ? decodedUrl : 'http://' + decodedUrl; const urlObj = new URL(tempUrl); let processedHostname = urlObj.hostname; if (processedHostname.includes('xn--')) { const labels = processedHostname.split('.'); const decodedLabels = labels.map(label => { if (label.startsWith('xn--')) { try { return punycode.decode(label.substring(4)); } catch (punyError) { if (GSRS_App.currentSettings.debugMode) console.error(`GSRS: Punycode.js decoding failed for label "${label}" in "${processedHostname}": ${punyError.message}. Original error:`, punyError); return label; } } return label; }); processedHostname = decodedLabels.join('.'); } let path = urlObj.pathname; let search = urlObj.search; let hash = urlObj.hash; try { path = decodeURIComponent(path.replace(/\+/g, '%20')); } catch (e) { /* keep as is */ } try { search = decodeURIComponent(search.replace(/\+/g, '%20')); } catch (e) { /* keep as is */ } try { hash = decodeURIComponent(hash.replace(/\+/g, '%20')); } catch (e) { /* keep as is */ } let finalProtocol = urlObj.protocol; if (urlString.startsWith('//')) { finalProtocol = ''; } let newReconstructedUrl = `${finalProtocol}${finalProtocol ? '//' : ''}${processedHostname}`; if (urlObj.port) newReconstructedUrl += `:${urlObj.port}`; newReconstructedUrl += path + search + hash; decodedUrl = newReconstructedUrl; } catch (e) { if (GSRS_App.currentSettings.debugMode) console.error(`GSRS: Error during URL object-based processing for "${urlString}": ${e.message}. Current decodedUrl: "${decodedUrl}". Original error:`, e); } return decodedUrl; }
    function getOutputDisplayObject(fullDisplayData) { if (!GSRS_App.currentSettings.hideDisabledFetchFields) { const completeObject = { position: fullDisplayData.position, title: GSRS_App.currentSettings.fetchTitle ? fullDisplayData.title : null, url: GSRS_App.currentSettings.fetchUrl ? fullDisplayData.url : null, siteName: GSRS_App.currentSettings.fetchSiteName ? fullDisplayData.siteName : null, breadcrumbs: GSRS_App.currentSettings.fetchBreadcrumbs ? fullDisplayData.breadcrumbs : null, description: GSRS_App.currentSettings.fetchDescription ? fullDisplayData.description : null, highlightedSnippets: (GSRS_App.currentSettings.fetchDescription && GSRS_App.currentSettings.fetchDescriptionKeywords) ? fullDisplayData.highlightedSnippets : null, originalDateText: GSRS_App.currentSettings.fetchDateInfo ? fullDisplayData.originalDateText : null, parsedDateISO: GSRS_App.currentSettings.fetchDateInfo ? fullDisplayData.parsedDateISO : null, forumStats: GSRS_App.currentSettings.fetchForumStats ? fullDisplayData.forumStats : null, relatedPosts: GSRS_App.currentSettings.fetchRelatedPosts ? fullDisplayData.relatedPosts : [], }; return completeObject; } const output = {}; if (fullDisplayData.hasOwnProperty('position')) output.position = fullDisplayData.position; if (GSRS_App.currentSettings.fetchTitle) output.title = fullDisplayData.title; if (GSRS_App.currentSettings.fetchUrl) output.url = fullDisplayData.url; if (GSRS_App.currentSettings.fetchSiteName) output.siteName = fullDisplayData.siteName; if (GSRS_App.currentSettings.fetchBreadcrumbs) output.breadcrumbs = fullDisplayData.breadcrumbs; if (GSRS_App.currentSettings.fetchDescription) { output.description = fullDisplayData.description; if (GSRS_App.currentSettings.fetchDescriptionKeywords) { output.highlightedSnippets = fullDisplayData.highlightedSnippets; } } if (GSRS_App.currentSettings.fetchDateInfo) { output.originalDateText = fullDisplayData.originalDateText; output.parsedDateISO = fullDisplayData.parsedDateISO; } if (GSRS_App.currentSettings.fetchForumStats) output.forumStats = fullDisplayData.forumStats; if (GSRS_App.currentSettings.fetchRelatedPosts) output.relatedPosts = fullDisplayData.relatedPosts; return output; }
	
    // --- Enhanced testSelector ---
    function testSelector(inputId, resultSpanId, previewId) {
        const inputElement = document.getElementById(inputId);
        const resultSpan = document.getElementById(resultSpanId);
        const previewDiv = document.getElementById(previewId);

        clearTimeout(GSRS_App.state.selectorTestHighlightTimeout);
        document.querySelectorAll('.gsrs-selector-test-highlight').forEach(el => el.classList.remove('gsrs-selector-test-highlight'));

        if (!inputElement || !resultSpan || !previewDiv) { console.error(`GSRS: Test selector UI elements not found. Input ID: ${inputId}, Result Span ID: ${resultSpanId}, Preview ID: ${previewId}`); if(resultSpan) { resultSpan.textContent = "Error!"; resultSpan.style.color = "red"; } if(previewDiv) { previewDiv.style.display = 'none'; previewDiv.innerHTML = ''; } return; }
        const rawSelectorString = inputElement.value.trim();
        previewDiv.style.display = 'none'; previewDiv.innerHTML = '';

        if (!rawSelectorString) { resultSpan.textContent = "Selector is empty."; resultSpan.style.color = "red"; previewDiv.innerHTML = 'Selector is empty.'; previewDiv.style.display = 'block'; return; }

        try {
            const elements = Array.from(document.querySelectorAll(rawSelectorString));
            const count = elements.length;
            resultSpan.textContent = `Found: ${count}`;
            resultSpan.style.color = count > 0 ? "green" : "orange";

            if (count > 0) {
                elements.forEach(el => el.classList.add('gsrs-selector-test-highlight'));
                if(GSRS_App.currentSettings.debugMode) console.log(`GSRS Test: Selector "${rawSelectorString}" found ${count} elements. First element:`, elements[0]);

                previewDiv.innerHTML = '';
                const MAX_PREVIEW_ITEMS = 5;
                const itemsToPreview = elements.slice(0, MAX_PREVIEW_ITEMS);

                itemsToPreview.forEach((el, idx) => {
                    const itemPreviewContainer = document.createElement('div');
                    itemPreviewContainer.style.borderBottom = idx < itemsToPreview.length - 1 ? '1px dashed #ccc' : 'none';
                    itemPreviewContainer.style.paddingBottom = '5px';
                    itemPreviewContainer.style.marginBottom = '5px';

                    const itemTitle = document.createElement('strong');
                    itemTitle.textContent = `Match ${idx + 1} (of ${count > MAX_PREVIEW_ITEMS ? MAX_PREVIEW_ITEMS + ' shown' : count}): <${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).trim().replace(/\s+/g,'.') : ''}>`;
                    itemPreviewContainer.appendChild(itemTitle);

                    const innerTextStrong = document.createElement('strong');
                    innerTextStrong.textContent = 'InnerText (truncated):';
                    innerTextStrong.style.display = 'block'; innerTextStrong.style.marginTop = '3px';
                    itemPreviewContainer.appendChild(innerTextStrong);
                    const innerTextDiv = document.createElement('div');
                    innerTextDiv.style.maxHeight = '40px'; innerTextDiv.style.overflowY = 'auto'; innerTextDiv.style.background = '#e9e9e9'; innerTextDiv.style.padding = '2px';
                    const innerTextRaw = el.innerText || "";
                    innerTextDiv.textContent = innerTextRaw.length > 150 ? innerTextRaw.substring(0, 150) + "..." : innerTextRaw;
                    itemPreviewContainer.appendChild(innerTextDiv);

                    const outerHTMLStrong = document.createElement('strong');
                    outerHTMLStrong.textContent = 'OuterHTML (truncated):';
                    outerHTMLStrong.style.display = 'block'; outerHTMLStrong.style.marginTop = '3px';
                    itemPreviewContainer.appendChild(outerHTMLStrong);
                    const outerHTMLDiv = document.createElement('div');
                    outerHTMLDiv.style.maxHeight = '60px'; outerHTMLDiv.style.overflowY = 'auto'; outerHTMLDiv.style.background = '#e0e0e0'; outerHTMLDiv.style.padding = '2px';
                    const outerHTMLRaw = el.outerHTML || "";
                    outerHTMLDiv.textContent = outerHTMLRaw.length > 300 ? outerHTMLRaw.substring(0, 300) + "\n... (truncated)" : outerHTMLRaw;
                    itemPreviewContainer.appendChild(outerHTMLDiv);
                    previewDiv.appendChild(itemPreviewContainer);
                });
                 if (count > MAX_PREVIEW_ITEMS) {
                    const moreInfo = document.createElement('p');
                    moreInfo.textContent = `... and ${count - MAX_PREVIEW_ITEMS} more match(es).`;
                    moreInfo.style.fontSize = '10px';
                    moreInfo.style.textAlign = 'center';
                    previewDiv.appendChild(moreInfo);
                }
                previewDiv.style.display = 'block';

                GSRS_App.state.selectorTestHighlightTimeout = setTimeout(() => {
                    document.querySelectorAll('.gsrs-selector-test-highlight').forEach(el => el.classList.remove('gsrs-selector-test-highlight'));
                }, 3500);
            } else {
                 if(GSRS_App.currentSettings.debugMode) console.log(`GSRS Test: Selector "${rawSelectorString}" found 0 elements.`);
                 previewDiv.innerHTML = 'No elements matched this selector.';
                 previewDiv.style.display = 'block';
            }
        } catch (e) {
            resultSpan.textContent = "Invalid selector!";
            resultSpan.style.color = "red";
            previewDiv.innerHTML = '';
            const errorStrong = document.createElement('strong');
            errorStrong.textContent = 'Error:';
            previewDiv.appendChild(errorStrong);
            previewDiv.appendChild(document.createTextNode(" " + e.message));
            previewDiv.style.display = 'block';
            console.error(`GSRS Test Selector Error for "${rawSelectorString}":`, e.message);
        }
    }

    // --- Global functions needing GSRS_App.state ---
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = handle || element;
        let currentTransition = '';

        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            let target = e.target;
            let isInteractive = false;

            if (handle && handle.contains(target) && target !== handle) {
                if (target.closest('button, input, select, textarea, a')) {
                    if (!(target.id === 'gsrs-settings-toggle-titlebar' || target.id === 'gsrs-minimize-btn' || target.id === 'gsrs-maximize-btn' || target.closest('#gsrs-settings-toggle-titlebar'))) {
                        isInteractive = true;
                    }
                }
            } else if (dragHandle === element) {
                const nonDraggableSelectors = 'input, textarea, button, select, a, .gsrs-selector-test-preview, #gsrs-results-area, #gsrs-results-list-container, #gsrs-result-preview-area, .gsrs-copy-download-options label, .gsrs-view-toggle-buttons button, #gsrs-settings-panel > *:not(#gsrs-title-bar), .gsrs-list-item, .gsrs-action-format-link, #gsrs-context-menu, .gsrs-context-menu-item';
                 if (target.closest(nonDraggableSelectors) && target !== element && !target.closest('#gsrs-title-bar')) {
                    isInteractive = true;
                }
            }

            if (isInteractive) {
                if (GSRS_App.currentSettings.debugMode) console.log("GSRS Drag: Interactive element click, drag NOT initiated on:", target);
                return;
            }
            if (GSRS_App.state.isMaximized) return;

            e.preventDefault();
            currentTransition = element.style.transition || '';
            element.style.transition = 'none';
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            const panelWidth = element.offsetWidth;
            const panelHeight = element.offsetHeight;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            if (element.style.left !== 'auto' && GSRS_App.state.originalPanelState.left !== 'auto') {
                newLeft = Math.max(0, Math.min(newLeft, winWidth - panelWidth));
                element.style.left = newLeft + "px";
                element.style.right = 'auto';
            } else {
                let currentRight = parseFloat(getComputedStyle(element).right);
                 if (isNaN(currentRight)) { // If 'auto' or not set, calculate from offsetLeft
                    currentRight = winWidth - (element.offsetLeft + panelWidth);
                 }
                let newRightValue = currentRight + pos1;
                newRightValue = Math.max(0, Math.min(newRightValue, winWidth - panelWidth));
                element.style.right = newRightValue + "px";
                element.style.left = 'auto';
            }

            const actualHandleHeight = (dragHandle.offsetHeight > 0) ? dragHandle.offsetHeight : 20;
            const MIN_VISIBLE_HANDLE_PART = 10;
            if (panelHeight <= winHeight) {
                newTop = Math.max(0, Math.min(newTop, winHeight - panelHeight));
            } else {
                newTop = Math.max(MIN_VISIBLE_HANDLE_PART - actualHandleHeight, Math.min(newTop, winHeight - MIN_VISIBLE_HANDLE_PART));
            }
            element.style.top = newTop + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            if (element) element.style.transition = currentTransition;
            if (!GSRS_App.state.isMaximized) {
                GSRS_App.settingsManager.saveUIPrefs();
            }
        }
    }
    function toggleMaximizePanel() {
        const uiContainer = GSRS_App.uiElements.uiContainer; if (!uiContainer) return;
        const maximizeBtn = document.getElementById('gsrs-maximize-btn');
        const contentWrapper = document.getElementById('gsrs-content-wrapper');
        const prevTransition = getComputedStyle(uiContainer).transition;
        uiContainer.style.transition = 'none';

        if (GSRS_App.state.isMaximized) {
            uiContainer.style.width = GSRS_App.state.originalPanelState.width || GSRS_App.DEFAULT_SETTINGS.uiPanelWidth;
            uiContainer.style.height = GSRS_App.state.originalPanelState.height || '';
            uiContainer.style.top = GSRS_App.state.originalPanelState.top || GSRS_App.DEFAULT_SETTINGS.uiPanelTop;
            if (GSRS_App.state.originalPanelState.left && GSRS_App.state.originalPanelState.left !== 'auto') {
                uiContainer.style.left = GSRS_App.state.originalPanelState.left;
                uiContainer.style.right = 'auto';
            } else if (GSRS_App.state.originalPanelState.right && GSRS_App.state.originalPanelState.right !== 'auto') {
                uiContainer.style.right = GSRS_App.state.originalPanelState.right;
                uiContainer.style.left = 'auto';
            } else {
                uiContainer.style.left = GSRS_App.DEFAULT_SETTINGS.uiPanelLeft;
                uiContainer.style.right = GSRS_App.DEFAULT_SETTINGS.uiPanelRight;
            }
            uiContainer.classList.remove('gsrs-maximized-panel');
            if (maximizeBtn) { maximizeBtn.innerHTML = '<span class="icon">🗖</span>'; maximizeBtn.title = 'Maximize Panel'; }
            GSRS_App.state.isMaximized = false;
        } else {
            GSRS_App.state.originalPanelState = {
                top: uiContainer.style.top || getComputedStyle(uiContainer).top,
                left: uiContainer.style.left || getComputedStyle(uiContainer).left,
                right: uiContainer.style.right || getComputedStyle(uiContainer).right,
                width: uiContainer.style.width || getComputedStyle(uiContainer).width,
                height: uiContainer.style.height || getComputedStyle(uiContainer).height
            };
            const winWidth = window.innerWidth; const winHeight = window.innerHeight; const padding = 20;
            let newWidth = winWidth - (padding * 2); let newHeight = winHeight - (padding * 2);
            newWidth = Math.max(newWidth, parseInt(GSRS_App.DEFAULT_SETTINGS.uiPanelWidth, 10));
            newHeight = Math.max(newHeight, 480);

            uiContainer.style.width = newWidth + 'px';
            uiContainer.style.height = newHeight + 'px';
            uiContainer.style.top = padding + 'px';
            uiContainer.style.left = padding + 'px';
            uiContainer.style.right = 'auto';
            uiContainer.classList.add('gsrs-maximized-panel');
            if (maximizeBtn) { maximizeBtn.innerHTML = '<span class="icon">🗗</span>'; maximizeBtn.title = 'Restore Panel Size'; }
            GSRS_App.state.isMaximized = true;
        }
        void uiContainer.offsetWidth;
        uiContainer.style.transition = prevTransition;
        if (contentWrapper) {
            const isMinimizedState = uiContainer.classList.contains('gsrs-minimized');
            const currentDisplay = getComputedStyle(contentWrapper).display;
            if (!isMinimizedState && currentDisplay === 'none') {
                contentWrapper.style.display = 'none'; void contentWrapper.offsetHeight; contentWrapper.style.display = 'flex';
            } else if (isMinimizedState) {
                contentWrapper.style.display = 'none';
            }
        }
    }
    function toggleViewMode(mode) {
        if (mode === GSRS_App.state.currentViewMode && GSRS_App.uiElements.uiContainer && !GSRS_App.uiElements.uiContainer.classList.contains('gsrs-view-just-toggled')) {
            if (mode === 'list') GSRS_App.uiManager.populateResultsList();
            return;
        }
        GSRS_App.state.currentViewMode = mode;
        if (GSRS_App.uiElements.uiContainer) GSRS_App.uiElements.uiContainer.classList.add('gsrs-view-just-toggled');

        const jsonViewBtn = document.getElementById('gsrs-view-toggle-json');
        const listViewBtn = document.getElementById('gsrs-view-toggle-list');
        const resultsTextArea = GSRS_App.uiElements.resultsTextArea;
        const resultsListContainer = GSRS_App.uiElements.resultsListContainer;
        const resultPreviewArea = GSRS_App.uiElements.resultPreviewArea;

        if (GSRS_App.state.currentViewMode === 'list') {
            if (resultsTextArea) resultsTextArea.style.display = 'none';
            if (resultsListContainer) resultsListContainer.style.display = 'flex';
            if (resultPreviewArea) { resultPreviewArea.style.display = GSRS_App.currentSettings.showPreviewInListMode ? 'block' : 'none'; }
            if (jsonViewBtn) jsonViewBtn.classList.remove('active');
            if (listViewBtn) listViewBtn.classList.add('active');
            GSRS_App.uiManager.populateResultsList();
            if (resultPreviewArea && (!GSRS_App.state.selectedResultListItem || (resultsListContainer && resultsListContainer.children.length === 0 && !resultsListContainer.textContent.includes("No results")) )) {
                resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 20px;">Click an item from the list to see details.</p>';
            }
        } else { // JSON mode
            clearAllPageHighlights(false);
            if (resultsTextArea) resultsTextArea.style.display = 'block';
            if (resultsListContainer) resultsListContainer.style.display = 'none';
            if (resultPreviewArea) resultPreviewArea.style.display = 'none';
            if (jsonViewBtn) jsonViewBtn.classList.add('active');
            if (listViewBtn) listViewBtn.classList.remove('active');
            GSRS_App.uiManager.updateResultsDisplay();
        }
        GM_setValue('gsrs_lastViewMode', GSRS_App.state.currentViewMode);
        if (GSRS_App.uiElements.uiContainer) setTimeout(() => GSRS_App.uiElements.uiContainer.classList.remove('gsrs-view-just-toggled'), 0);
    }

    // --- Enhanced Context Menu Logic ---
    function handleContextMenuAction(action) {
        if (!GSRS_App.state.currentContextMenuItemData || !action) {
            if(GSRS_App.currentSettings.debugMode) console.warn("GSRS ContextMenu: No item data or action specified for action:", action);
            return;
        }

        const displayData = getOutputDisplayObject(GSRS_App.state.currentContextMenuItemData.display);
        const internalData = GSRS_App.state.currentContextMenuItemData.internal;
        const domElement = GSRS_App.state.currentContextMenuItemData.domElement;

        if(GSRS_App.currentSettings.debugMode) console.log(`GSRS ContextMenu: Action "${action}" on item:`, GSRS_App.state.currentContextMenuItemData);
        clearAllPageHighlights(false);

        switch (action) {
            case 'copy-json': GM_setClipboard(JSON.stringify(displayData, null, 2)); GSRS_App.uiManager.showUIMessage('Item JSON copied!', 'success', 2000); break;
            case 'copy-title': if (displayData.title && displayData.title !== "Extraction Failed" && displayData.title !== "Title Selector Failed") { GM_setClipboard(displayData.title); GSRS_App.uiManager.showUIMessage('Title copied!', 'success', 2000); } else { GSRS_App.uiManager.showUIMessage('No valid title to copy.', 'error', 2000); } break;
            case 'copy-url':
                let urlToCopy = (displayData.url && displayData.url !== "Extraction Failed" && displayData.url !== "URL Extraction Failed") ? displayData.url : null;
                if (!urlToCopy && internalData.rawUrl && internalData.rawUrl !== "Extraction Failed" && internalData.rawUrl !== "URL Extraction Failed") { urlToCopy = decodeUrlIfEnabled(internalData.rawUrl); }
                if (urlToCopy) { GM_setClipboard(urlToCopy); GSRS_App.uiManager.showUIMessage('URL copied!', 'success', 2000); }
                else { GSRS_App.uiManager.showUIMessage('No valid URL to copy.', 'error', 2000); }
                break;
            case 'copy-description':
                if (displayData.description && displayData.description !== "Extraction Failed" && displayData.description !== "Desc Extraction Failed") { GM_setClipboard(displayData.description); GSRS_App.uiManager.showUIMessage('Description copied!', 'success', 2000); }
                else { GSRS_App.uiManager.showUIMessage('No valid description to copy.', 'error', 2000); }
                break;
            case 'open-url':
                if (internalData.rawUrl && internalData.rawUrl !== "Extraction Failed" && internalData.rawUrl !== "URL Extraction Failed" && !internalData.rawUrl.startsWith('javascript:')) {
                    window.open(internalData.rawUrl, '_blank');
                } else {
                    GSRS_App.uiManager.showUIMessage('Invalid or no URL to open.', 'error', 2000);
                }
                break;
            case 'highlight-on-page':
                if (domElement && document.body.contains(domElement)) {
                    clearTimeout(GSRS_App.state.contextMenuHighlightTimeout);
                    if (GSRS_App.state.lastListItemHighlightedElement && GSRS_App.state.lastListItemHighlightedElement !== domElement && document.body.contains(GSRS_App.state.lastListItemHighlightedElement)) {
                        GSRS_App.state.lastListItemHighlightedElement.classList.remove('gsrs-list-item-page-highlight');
                    }
                    domElement.classList.remove('gsrs-highlighted', 'gsrs-context-highlight', 'gsrs-list-item-page-highlight');
                    domElement.classList.add('gsrs-context-highlight');
                    domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    GSRS_App.state.lastListItemHighlightedElement = domElement;
                    GSRS_App.state.contextMenuHighlightTimeout = setTimeout(() => {
                        if (domElement && document.body.contains(domElement)) domElement.classList.remove('gsrs-context-highlight');
                        if (GSRS_App.state.lastListItemHighlightedElement === domElement) GSRS_App.state.lastListItemHighlightedElement = null;
                    }, 3500);
                    GSRS_App.uiManager.showUIMessage('Item highlighted on page.', 'success', 2000);
                } else {
                    GSRS_App.uiManager.showUIMessage('Could not find item on page to highlight.', 'error', 2000);
                     if (GSRS_App.currentSettings.debugMode) console.warn("GSRS ContextMenu: domElement not found or not in body for highlight.", domElement);
                }
                break;
            default:
                if(GSRS_App.currentSettings.debugMode) console.warn(`GSRS ContextMenu: Unknown action "${action}"`);
        }
        if (GSRS_App.uiElements.contextMenuElement) GSRS_App.uiElements.contextMenuElement.style.display = 'none';
    }
    function handleResultListItemContextMenu(event) {
        const contextMenuElement = GSRS_App.uiElements.contextMenuElement;
        if (!contextMenuElement) return;
        event.preventDefault();
        GSRS_App.state.currentContextMenuItemData = null;

        const listItem = event.target.closest('.gsrs-list-item');
        if (!listItem || !listItem.dataset.originalFullArrayIndex) {
            contextMenuElement.style.display = 'none';
            return;
        }

        const originalIndex = parseInt(listItem.dataset.originalFullArrayIndex, 10);
        if (originalIndex >= 0 && originalIndex < GSRS_App.allResults.length) {
            GSRS_App.state.currentContextMenuItemData = GSRS_App.allResults[originalIndex];
        } else {
            contextMenuElement.style.display = 'none';
            return;
        }

        if (!GSRS_App.state.currentContextMenuItemData) {
             contextMenuElement.style.display = 'none';
             return;
        }

        const menuWidth = contextMenuElement.offsetWidth; const menuHeight = contextMenuElement.offsetHeight;
        const windowWidth = window.innerWidth; const windowHeight = window.innerHeight;
        let x = event.clientX; let y = event.clientY;
        if (x + menuWidth > windowWidth) { x = windowWidth - menuWidth - 5; }
        if (y + menuHeight > windowHeight) { y = windowHeight - menuHeight - 5; }
        x = Math.max(0, x); y = Math.max(0, y);

        contextMenuElement.style.left = `${x}px`; contextMenuElement.style.top = `${y}px`;
        contextMenuElement.style.display = 'block';

        const openUrlItem = contextMenuElement.querySelector('[data-action="open-url"]');
        const highlightItem = contextMenuElement.querySelector('[data-action="highlight-on-page"]');
        const copyDescItem = contextMenuElement.querySelector('[data-action="copy-description"]');
        const copyTitleItem = contextMenuElement.querySelector('[data-action="copy-title"]');
        const copyUrlItem = contextMenuElement.querySelector('[data-action="copy-url"]');

        const internalData = GSRS_App.state.currentContextMenuItemData.internal;
        const displayData = GSRS_App.state.currentContextMenuItemData.display;

        if (openUrlItem) {
            const urlIsInvalid = !internalData.rawUrl || internalData.rawUrl === "Extraction Failed" || internalData.rawUrl === "URL Extraction Failed" || internalData.rawUrl.startsWith('javascript:');
            openUrlItem.classList.toggle('gsrs-cm-disabled', urlIsInvalid);
        }
        if (highlightItem) {
            highlightItem.classList.toggle('gsrs-cm-disabled', !GSRS_App.state.currentContextMenuItemData.domElement || !document.body.contains(GSRS_App.state.currentContextMenuItemData.domElement));
        }
        if(copyDescItem){
            const descIsInvalid = !displayData.description || displayData.description === "Extraction Failed" || displayData.description === "Desc Extraction Failed";
            copyDescItem.classList.toggle('gsrs-cm-disabled', descIsInvalid);
        }
        if(copyTitleItem){
            const titleIsInvalid = !displayData.title || displayData.title === "Extraction Failed" || displayData.title === "Title Selector Failed";
            copyTitleItem.classList.toggle('gsrs-cm-disabled', titleIsInvalid);
        }
        if(copyUrlItem){
            const displayUrlIsInvalid = !displayData.url || displayData.url === "Extraction Failed" || displayData.url === "URL Extraction Failed";
            const rawUrlIsInvalid = !internalData.rawUrl || internalData.rawUrl === "Extraction Failed" || internalData.rawUrl === "URL Extraction Failed";
            copyUrlItem.classList.toggle('gsrs-cm-disabled', displayUrlIsInvalid && rawUrlIsInvalid);
        }
    }
    function populateResultsList() {
        const resultsListContainer = GSRS_App.uiElements.resultsListContainer; if (!resultsListContainer) return;
        clearAllPageHighlights(false);
        resultsListContainer.innerHTML = '';
        const resultsToDisplay = (GSRS_App.uiElements.filterInput && GSRS_App.uiElements.filterInput.value.trim() !== "") ? GSRS_App.filteredResults : GSRS_App.allResults;

        if (resultsToDisplay.length === 0) {
            resultsListContainer.innerHTML = '<div style="text-align:center; color:#777; padding:10px 0;">No results to display.</div>';
            if (GSRS_App.uiElements.resultPreviewArea) { GSRS_App.uiElements.resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 20px;">No results to preview.</p>'; }
            return;
        }

        const fragment = document.createDocumentFragment();
        let currentSelectedOriginalResult = null;
        if(GSRS_App.state.selectedResultListItem && GSRS_App.state.selectedResultListItem.dataset.originalFullArrayIndex) {
            const originalIdx = parseInt(GSRS_App.state.selectedResultListItem.dataset.originalFullArrayIndex, 10);
            if(originalIdx >= 0 && originalIdx < GSRS_App.allResults.length) {
                if (resultsToDisplay.includes(GSRS_App.allResults[originalIdx])) {
                    currentSelectedOriginalResult = GSRS_App.allResults[originalIdx];
                } else {
                    GSRS_App.state.selectedResultListItem = null;
                    if (GSRS_App.uiElements.resultPreviewArea) GSRS_App.uiElements.resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 20px;">Click an item from the list to see details.</p>';
                }
            }
        }

        resultsToDisplay.forEach((item, indexInCurrentList) => {
            const listItem = document.createElement('div'); listItem.className = 'gsrs-list-item';
            const originalIndex = GSRS_App.allResults.indexOf(item);
            const displayObjForTitle = getOutputDisplayObject(item.display);
            listItem.textContent = `[${displayObjForTitle.position || (originalIndex + 1)}] ${displayObjForTitle.title || item.internal.rawTitle || 'N/A'}`;
            listItem.dataset.resultIndexInCurrentList = indexInCurrentList;
            if (originalIndex !== -1) { listItem.dataset.originalFullArrayIndex = originalIndex; }
            listItem.addEventListener('click', handleResultListItemClick);
            listItem.addEventListener('contextmenu', handleResultListItemContextMenu);
            fragment.appendChild(listItem);

            if (item === currentSelectedOriginalResult) {
                listItem.classList.add('selected');
                GSRS_App.state.selectedResultListItem = listItem;
                if (GSRS_App.currentSettings.highlightListItemOnPage && item.domElement && document.body.contains(item.domElement)) {
                    if (GSRS_App.state.lastListItemHighlightedElement && GSRS_App.state.lastListItemHighlightedElement !== item.domElement) {
                        GSRS_App.state.lastListItemHighlightedElement.classList.remove('gsrs-list-item-page-highlight');
                    }
                    item.domElement.classList.add('gsrs-list-item-page-highlight');
                    GSRS_App.state.lastListItemHighlightedElement = item.domElement;
                }
            }
        });
        resultsListContainer.appendChild(fragment);
        if (!GSRS_App.state.selectedResultListItem && GSRS_App.uiElements.resultPreviewArea && resultsToDisplay.length > 0 && GSRS_App.currentSettings.showPreviewInListMode) {
            GSRS_App.uiElements.resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 20px;">Click an item from the list to see details.</p>';
        } else if (!GSRS_App.currentSettings.showPreviewInListMode && GSRS_App.uiElements.resultPreviewArea) {
            GSRS_App.uiElements.resultPreviewArea.innerHTML = '';
        }
    }
    function handleResultListItemClick(event) {
        const resultPreviewArea = GSRS_App.uiElements.resultPreviewArea;
        if (!resultPreviewArea && !GSRS_App.currentSettings.highlightListItemOnPage) return;
        clearAllPageHighlights(false);
        const listItem = event.currentTarget;
        let resultItem = null;
        const currentResultsSource = (GSRS_App.uiElements.filterInput && GSRS_App.uiElements.filterInput.value.trim() !== "") ? GSRS_App.filteredResults : GSRS_App.allResults;

        if (listItem.dataset.originalFullArrayIndex) {
            const originalIndex = parseInt(listItem.dataset.originalFullArrayIndex, 10);
            if (originalIndex >= 0 && originalIndex < GSRS_App.allResults.length) {
                if (currentResultsSource.includes(GSRS_App.allResults[originalIndex])) {
                    resultItem = GSRS_App.allResults[originalIndex];
                }
            }
        }
        if (!resultItem) {
            const resultIndexInCurrentList = parseInt(listItem.dataset.resultIndexInCurrentList, 10);
            if (resultIndexInCurrentList >= 0 && resultIndexInCurrentList < currentResultsSource.length) {
                resultItem = currentResultsSource[resultIndexInCurrentList];
            }
        }

        if (resultItem) {
            const resultData = getOutputDisplayObject(resultItem.display);
            const originalIndexGlobal = GSRS_App.allResults.indexOf(resultItem);
            if (resultPreviewArea && GSRS_App.currentSettings.showPreviewInListMode) {
                let previewHTML = `<p><strong>Position:</strong> ${resultData.position || (originalIndexGlobal + 1)}</p>`;
                if (resultData.hasOwnProperty('title')) { previewHTML += `<p><strong>Title:</strong> ${resultData.title ? resultData.title.replace(/</g, '<') : 'Not Fetched/Available'}</p>`; }
                else if (resultItem.internal.rawTitle && resultItem.internal.rawTitle !== "Extraction Failed" && resultItem.internal.rawTitle !== "Title Selector Failed") { previewHTML += `<p><strong>Title (raw):</strong> ${resultItem.internal.rawTitle.replace(/</g, '<')}</p>`; }
                if (resultData.hasOwnProperty('url')) { const urlToDisplayInText = (resultData.url && resultData.url !== "Extraction Failed" && resultData.url !== "URL Extraction Failed") ? resultData.url : "Not Fetched/Available"; const hrefForLink = (resultItem.internal.rawUrl && resultItem.internal.rawUrl !== "Extraction Failed" && resultItem.internal.rawUrl !== "URL Extraction Failed") ? resultItem.internal.rawUrl : '#'; previewHTML += `<p><strong>URL:</strong> ${resultData.url ? `<a href="${hrefForLink}" target="_blank" title="Raw URL: ${hrefForLink}">${urlToDisplayInText.replace(/</g, '<')}</a>` : urlToDisplayInText}</p>`; }
                if (resultData.hasOwnProperty('siteName')) { previewHTML += `<p><strong>Site Name:</strong> ${resultData.siteName ? resultData.siteName.replace(/</g, '<') : 'Not Fetched/Available'}</p>`; }
                if (resultData.hasOwnProperty('breadcrumbs')) { previewHTML += `<p><strong>Breadcrumbs:</strong> ${resultData.breadcrumbs ? resultData.breadcrumbs.replace(/</g, '<') : 'Not Fetched/Available'}</p>`; }
                if (resultData.hasOwnProperty('originalDateText') || resultData.hasOwnProperty('parsedDateISO')) { let dateDisplay = "Not Fetched/Available"; if (resultData.originalDateText) { dateDisplay = resultData.originalDateText.replace(/</g, '<'); if (resultData.parsedDateISO) { try { const d = new Date(resultData.parsedDateISO); if (!isNaN(d.getTime())) { dateDisplay += ` (Parsed: ${d.toLocaleString()})`; } } catch (e) {} } } else if (resultData.parsedDateISO) { try { const d = new Date(resultData.parsedDateISO); if (!isNaN(d.getTime())) { dateDisplay = `(Parsed: ${d.toLocaleString()})`; } else { dateDisplay = "Invalid Parsed Date"; } } catch (e) { dateDisplay = "Error parsing date"; } } previewHTML += `<p><strong>Date Info:</strong> ${dateDisplay}</p>`; }
                if (resultData.hasOwnProperty('description')) { previewHTML += `<p><strong>Description:</strong> ${resultData.description ? resultData.description.replace(/</g, '<') : 'Not Fetched/Available'}</p>`; }
                if (resultData.hasOwnProperty('highlightedSnippets') && resultData.highlightedSnippets) { previewHTML += `<p><strong>Keywords:</strong> ${resultData.highlightedSnippets.replace(/</g, '<')}</p>`; }
                if (resultData.hasOwnProperty('forumStats') && resultData.forumStats) { previewHTML += `<p><strong>Forum Stats:</strong> ${resultData.forumStats.replace(/</g, '<')}</p>`; }
                if (resultData.hasOwnProperty('relatedPosts') && Array.isArray(resultData.relatedPosts) && resultData.relatedPosts.length > 0) {
                    let relatedHTML = '<div class="gsrs-preview-related-posts"><p><strong>Related Posts:</strong></p>';
                    resultData.relatedPosts.forEach(post => {
                        relatedHTML += `<div class="gsrs-preview-related-post-item"><a href="${post.url}" target="_blank">${post.title.replace(/</g, '<')}</a>`;
                        if (post.stats || post.date) {
                            relatedHTML += ` <span>(${(post.stats || '')} ${(post.date || '')})</span>`;
                        }
                        relatedHTML += '</div>';
                    });
                    relatedHTML += '</div>';
                    previewHTML += relatedHTML;
                }
                resultPreviewArea.innerHTML = previewHTML;
            }
            if (GSRS_App.state.selectedResultListItem && GSRS_App.state.selectedResultListItem !== listItem) { GSRS_App.state.selectedResultListItem.classList.remove('selected'); }
            listItem.classList.add('selected');
            GSRS_App.state.selectedResultListItem = listItem;

            if (GSRS_App.currentSettings.highlightListItemOnPage && resultItem.domElement && document.body.contains(resultItem.domElement)) {
                resultItem.domElement.classList.remove('gsrs-highlighted', 'gsrs-context-highlight');
                resultItem.domElement.classList.add('gsrs-list-item-page-highlight');
                resultItem.domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                GSRS_App.state.lastListItemHighlightedElement = resultItem.domElement;
            }
        } else {
            if (resultPreviewArea && GSRS_App.currentSettings.showPreviewInListMode) { resultPreviewArea.innerHTML = '<p style="color: red;">Error: Could not retrieve result details.</p>'; }
            if (GSRS_App.state.selectedResultListItem) GSRS_App.state.selectedResultListItem.classList.remove('selected');
            GSRS_App.state.selectedResultListItem = null;
        }
    }
    function handleStartParse() {
        if (GSRS_App.currentSettings.debugMode) console.log("%cGSRS: handleStartParse called.", "color: orange; font-weight: bold;");
        GSRS_App.allResults = []; GSRS_App.filteredResults = [];
        const filterInput = GSRS_App.uiElements.filterInput;
        if (filterInput) { filterInput.value = ''; GSRS_App.currentSettings.lastFilterTerm = ''; GM_setValue('gsrs_lastFilterTerm', ''); filterInput.classList.remove('gsrs-filter-active'); }
        if (GSRS_App.state.selectedResultListItem) {GSRS_App.state.selectedResultListItem.classList.remove('selected'); GSRS_App.state.selectedResultListItem = null;}
        const resultPreviewArea = GSRS_App.uiElements.resultPreviewArea;
        if(resultPreviewArea) resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 20px;">Click an item from the list to see details.</p>';
        clearAllPageHighlights(true);
        try { document.querySelectorAll('[data-gsrs-block-parsed="true"]').forEach(el => {el.removeAttribute('data-gsrs-block-parsed');}); document.querySelectorAll('[data-gsrs-title-processed="true"]').forEach(el => {el.removeAttribute('data-gsrs-title-processed');}); }
        catch (e) { console.warn(`GSRS: Issue clearing parsed flags. Error: ${e.message}`); }

        const initialFoundCount = processPageForResults(document);

        if (GSRS_App.allResults.length === 0 && document.querySelectorAll(GSRS_App.currentSettings.titleSelector).length > 0) { const specificMessage = `Scrape initiated. Found 0 results. Title selector '${GSRS_App.currentSettings.titleSelector}' matched elements, but no valid result blocks were identified. Check parent block logic or exclusion rules.`; GSRS_App.uiManager.showUIMessage(specificMessage, 'error', 12000); if(GSRS_App.currentSettings.debugMode) console.warn(`GSRS: ${specificMessage}`); }
        else if (GSRS_App.allResults.length === 0 && document.querySelectorAll(GSRS_App.currentSettings.titleSelector).length === 0 && GSRS_App.uiElements.uiMessageDiv && !GSRS_App.uiElements.uiMessageDiv.textContent.includes("Warning: Title selector")) { const specificMessage = `Scrape initiated. Found 0 results. Title selector '${GSRS_App.currentSettings.titleSelector}' found NO elements. Please check your title selector.`; GSRS_App.uiManager.showUIMessage(specificMessage, 'error', 12000); if(GSRS_App.currentSettings.debugMode) console.warn(`GSRS: ${specificMessage}`); }
        else if (GSRS_App.allResults.length > 0) { GSRS_App.uiManager.showUIMessage(`Scraped ${GSRS_App.allResults.length} results from current page.`, 'success'); }
        else { GSRS_App.uiManager.showUIMessage('Scrape initiated. No results found on current page.', 'success', 4000); }

        GSRS_App.uiManager.updateResultsDisplay();
        setupMutationObserver();

        const startButton = document.getElementById('gsrs-start-btn'); if (startButton) startButton.textContent = 'Re-Scrape Page';
    }
    function handleFilterResults() {
        const filterInput = GSRS_App.uiElements.filterInput;
        const searchTerm = filterInput ? filterInput.value.toLowerCase().trim() : "";
        clearTimeout(GSRS_App.state.filterTimeout);
        GSRS_App.state.filterTimeout = setTimeout(() => {
            GSRS_App.currentSettings.lastFilterTerm = searchTerm;
            GM_setValue('gsrs_lastFilterTerm', searchTerm);
            if (GSRS_App.currentSettings.debugMode) console.log("GSRS: Saved filter term:", searchTerm);
        }, 500);

        if (filterInput) { if (searchTerm) filterInput.classList.add('gsrs-filter-active'); else filterInput.classList.remove('gsrs-filter-active'); }

        if (!searchTerm) {
            GSRS_App.filteredResults = [];
        } else {
            GSRS_App.filteredResults = GSRS_App.allResults.filter(item => {
                const displayItem = getOutputDisplayObject(item.display); if (!displayItem) return false;
                let match = false;
                if (displayItem.hasOwnProperty('title') && displayItem.title && typeof displayItem.title === 'string') match = match || displayItem.title.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('url') && displayItem.url && typeof displayItem.url === 'string') match = match || displayItem.url.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('siteName') && displayItem.siteName && typeof displayItem.siteName === 'string') match = match || displayItem.siteName.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('breadcrumbs') && displayItem.breadcrumbs && typeof displayItem.breadcrumbs === 'string') match = match || displayItem.breadcrumbs.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('description') && displayItem.description && typeof displayItem.description === 'string') match = match || displayItem.description.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('highlightedSnippets') && displayItem.highlightedSnippets && typeof displayItem.highlightedSnippets === 'string') match = match || displayItem.highlightedSnippets.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('originalDateText') && displayItem.originalDateText && typeof displayItem.originalDateText === 'string') match = match || displayItem.originalDateText.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('forumStats') && displayItem.forumStats && typeof displayItem.forumStats === 'string') match = match || displayItem.forumStats.toLowerCase().includes(searchTerm);
                if (displayItem.hasOwnProperty('relatedPosts') && Array.isArray(displayItem.relatedPosts)) { const relatedText = JSON.stringify(displayItem.relatedPosts).toLowerCase(); match = match || relatedText.includes(searchTerm); }
                return match;
            });
        }
        clearAllPageHighlights(false);
        if (GSRS_App.state.currentViewMode === 'list') { GSRS_App.uiManager.populateResultsList(); }
        GSRS_App.uiManager.updateResultsDisplay();
    }
    function handleClearResults() {
        const resultsTextArea = GSRS_App.uiElements.resultsTextArea;
        const noResultsYet = GSRS_App.allResults.length === 0 && (!resultsTextArea || !resultsTextArea.value || (resultsTextArea.placeholder && resultsTextArea.value === '' && resultsTextArea.placeholder.toLowerCase().includes('no results scraped yet')));
        const filterInput = GSRS_App.uiElements.filterInput;
        if (noResultsYet && (!filterInput || !filterInput.value)) { GSRS_App.uiManager.showUIMessage('Already empty.', 'error', 2000); return; }

        GSRS_App.allResults = []; GSRS_App.filteredResults = [];
        if(filterInput) { filterInput.value = ''; GSRS_App.currentSettings.lastFilterTerm = ''; GM_setValue('gsrs_lastFilterTerm', ''); filterInput.classList.remove('gsrs-filter-active'); }
        if (resultsTextArea) resultsTextArea.value = '';
        const resultPreviewArea = GSRS_App.uiElements.resultPreviewArea;
        if (resultPreviewArea) resultPreviewArea.innerHTML = '<p style="color: #777; text-align:center; margin-top: 20px;">Click an item from the list to see details.</p>';
        if (GSRS_App.state.selectedResultListItem) { GSRS_App.state.selectedResultListItem.classList.remove('selected'); GSRS_App.state.selectedResultListItem = null; }
        clearAllPageHighlights(true);
        GSRS_App.uiManager.updateResultsDisplay();
        GSRS_App.uiManager.showUIMessage('Results cleared.', 'success');
    }
    function updateActionButtonsState() {
        const actionButtonBar = document.getElementById('gsrs-action-button-bar');
        if (!actionButtonBar) { if (GSRS_App.currentSettings.debugMode && document.readyState === 'complete') { console.warn("GSRS: updateActionButtonsState - #gsrs-action-button-bar not found."); } return; }
        const actionLinks = actionButtonBar.querySelectorAll('.gsrs-action-format-link');
        if (!actionLinks || actionLinks.length === 0) { if (GSRS_App.currentSettings.debugMode && document.readyState === 'complete') { console.warn("GSRS: updateActionButtonsState - no .gsrs-action-format-link found."); } return; }

        let resultsToConsider;
        const filterInput = GSRS_App.uiElements.filterInput;
        const isFilterActive = filterInput && filterInput.value.trim() !== "";

        if (GSRS_App.state.copyDownloadTarget === 'all') {
            resultsToConsider = GSRS_App.allResults;
        } else {
            resultsToConsider = isFilterActive ? GSRS_App.filteredResults : GSRS_App.allResults;
        }
        const noResults = resultsToConsider.length === 0;
        actionLinks.forEach(link => { link.classList.toggle('gsrs-action-disabled', noResults); });

        if (GSRS_App.currentSettings.debugMode) {
            console.log(`GSRS: updateActionButtonsState - Target: ${GSRS_App.state.copyDownloadTarget}, FilterActive: ${isFilterActive}, ResultsToConsider: ${resultsToConsider.length}, NoResults: ${noResults}`);
            actionLinks.forEach(link => { console.log(` - Link "${link.textContent}" (Action: ${link.dataset.action}, Format: ${link.dataset.format}): Disabled = ${link.classList.contains('gsrs-action-disabled')}`); });
        }
    }
    function handleCopyOrDownloadMarkdown(actionType) {
        let baseResultsToConsider = GSRS_App.allResults;
        const filterInput = GSRS_App.uiElements.filterInput;
        const isFilterActive = filterInput && filterInput.value.trim() !== '';
        if (GSRS_App.state.copyDownloadTarget === 'current' && isFilterActive) { baseResultsToConsider = GSRS_App.filteredResults; }
        const resultsToProcess = baseResultsToConsider.map(item => getOutputDisplayObject(item.display));

        if (resultsToProcess.length === 0) { let msg = `No results to ${actionType} as Markdown.`; if (isFilterActive && GSRS_App.state.copyDownloadTarget === 'current') { msg = `Filter yielded no results to ${actionType} as Markdown.`; } GSRS_App.uiManager.showUIMessage(msg, 'error'); return; }

        const markdownString = convertToMarkdownList(resultsToProcess);
        if (actionType === 'copy') { GM_setClipboard(markdownString); GSRS_App.uiManager.showUIMessage(`Copied ${resultsToProcess.length} results as Markdown!`, 'success'); }
        else if (actionType === 'download') {
            const blob = new Blob([markdownString], {type: 'text/markdown;charset=utf-8;'}); const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            const qParam = new URLSearchParams(window.location.search).get('q') || 'serp_results'; const filenameSafeQuery = qParam.replace(/[^a-z0-9_.-]/gi,'_').substring(0, 50);
            a.download = `${filenameSafeQuery}_${new Date().toISOString().slice(0,10)}.md`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            GSRS_App.uiManager.showUIMessage(`Downloaded ${resultsToProcess.length} results as Markdown.`, 'success');
        }
    }
    function handleCopyResults() {
        let baseResultsToConsider = GSRS_App.allResults;
        const filterInput = GSRS_App.uiElements.filterInput;
        const isFilterActive = filterInput && filterInput.value.trim() !== '';
        if (GSRS_App.state.copyDownloadTarget === 'current' && isFilterActive) { baseResultsToConsider = GSRS_App.filteredResults; }
        const resultsToActOn = baseResultsToConsider.map(item => getOutputDisplayObject(item.display));

        if (resultsToActOn.length > 0) { GM_setClipboard(JSON.stringify(resultsToActOn, null, 2)); GSRS_App.uiManager.showUIMessage(`Copied ${resultsToActOn.length} results as JSON!`, 'success'); }
        else { let msg = 'No results to copy as JSON.'; if (isFilterActive && GSRS_App.state.copyDownloadTarget === 'current') { msg = 'Filter yielded no results to copy as JSON.'; } GSRS_App.uiManager.showUIMessage(msg, 'error'); }
    }
    function handleDownloadResults(format = 'json') {
        let baseResultsToConsider = GSRS_App.allResults;
        const filterInput = GSRS_App.uiElements.filterInput;
        const isFilterActive = filterInput && filterInput.value.trim() !== '';
        if (GSRS_App.state.copyDownloadTarget === 'current' && isFilterActive) { baseResultsToConsider = GSRS_App.filteredResults; }
        const resultsToDownload = baseResultsToConsider.map(item => getOutputDisplayObject(item.display));

        if (resultsToDownload.length === 0) { let msg = 'No results to download.'; if (isFilterActive && GSRS_App.state.copyDownloadTarget === 'current') { msg = 'Filter yielded no results to download.'; } GSRS_App.uiManager.showUIMessage(msg, 'error'); return; }

        let dataString, blobType, fileExtension;
        if (format === 'csv') {
            const csvData = convertToCSV(resultsToDownload);
            if (!csvData) { GSRS_App.uiManager.showUIMessage('No columns selected for CSV export. Please check settings.', 'error'); return; }
            dataString = '\uFEFF' + csvData; blobType = 'text/csv;charset=utf-8;'; fileExtension = 'csv';
        } else {
            dataString = JSON.stringify(resultsToDownload, null, 2); blobType = 'application/json;charset=utf-8;'; fileExtension = 'json';
        }
        const blob = new Blob([dataString], {type: blobType}); const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        const q = new URLSearchParams(window.location.search).get('q')||'serp_results'; const filenameSafeQuery = q.replace(/[^a-z0-9_.-]/gi,'_').substring(0, 50);
        a.download = `${filenameSafeQuery}_${new Date().toISOString().slice(0,10)}.${fileExtension}`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        GSRS_App.uiManager.showUIMessage(`Downloaded ${resultsToDownload.length} results as ${fileExtension.toUpperCase()}.`, 'success');
    }
    function handleCopyUrls() {
        let baseResultsToConsider = GSRS_App.allResults;
        const filterInput = GSRS_App.uiElements.filterInput;
        const isFilterActive = filterInput && filterInput.value.trim() !== '';
        if (GSRS_App.state.copyDownloadTarget === 'current' && isFilterActive) { baseResultsToConsider = GSRS_App.filteredResults; }
        const urls = baseResultsToConsider.map(item => { const displayObj = getOutputDisplayObject(item.display); return displayObj.url && displayObj.url !== "Extraction Failed" && displayObj.url !== "URL Extraction Failed" && !displayObj.url.startsWith('javascript:void(0)') ? displayObj.url : null; }).filter(url => url);

        if (urls.length > 0) { let message = `Copied ${urls.length} URLs!`; if (urls.length === 1 && urls[0].length < 70) { message = `Copied URL: ${urls[0]}`; } GM_setClipboard(urls.join('\n')); GSRS_App.uiManager.showUIMessage(message, 'success', urls.length === 1 && urls[0].length < 70 ? 3000 : 2000); }
        else { let msg = 'No valid URLs to copy.'; if (isFilterActive && GSRS_App.state.copyDownloadTarget === 'current') { msg = 'Filter yielded no URLs to copy.'; } else if (GSRS_App.allResults.length > 0 && urls.length === 0) { msg = 'No valid URLs found in current results (check fetch settings).'; } GSRS_App.uiManager.showUIMessage(msg, 'error'); }
    }
    function handleDownloadUrls() {
        let baseResultsToConsider = GSRS_App.allResults;
        const filterInput = GSRS_App.uiElements.filterInput;
        const isFilterActive = filterInput && filterInput.value.trim() !== '';
        if (GSRS_App.state.copyDownloadTarget === 'current' && isFilterActive) { baseResultsToConsider = GSRS_App.filteredResults; }
        const urls = baseResultsToConsider.map(item => { const displayObj = getOutputDisplayObject(item.display); return displayObj.url && displayObj.url !== "Extraction Failed" && displayObj.url !== "URL Extraction Failed" && !displayObj.url.startsWith('javascript:void(0)') ? displayObj.url : null; }).filter(url => url);

        if (urls.length === 0) { let msg = 'No valid URLs to download.'; if (isFilterActive && GSRS_App.state.copyDownloadTarget === 'current') { msg = 'Filter yielded no URLs to download.'; } else if (GSRS_App.allResults.length > 0 && urls.length === 0) { msg = 'No valid URLs found in current results (check fetch settings).'; } GSRS_App.uiManager.showUIMessage(msg, 'error'); return; }

        const dataString = urls.join('\r\n'); const blobType = 'text/plain;charset=utf-8;'; const fileExtension = 'txt';
        const blob = new Blob([dataString], {type: blobType}); const fileUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = fileUrl;
        const q = new URLSearchParams(window.location.search).get('q')||'serp_urls'; const filenameSafeQuery = q.replace(/[^a-z0-9_.-]/gi,'_').substring(0, 50);
        a.download = `${filenameSafeQuery}_${new Date().toISOString().slice(0,10)}_urls.${fileExtension}`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(fileUrl);
        GSRS_App.uiManager.showUIMessage(`Downloaded ${urls.length} URLs as ${fileExtension.toUpperCase()}.`, 'success');
    }
    function updateResultsDisplay() {
        const filterInput = GSRS_App.uiElements.filterInput;
        const resultsCountSpan = GSRS_App.uiElements.resultsCountSpan;
        const resultsTextArea = GSRS_App.uiElements.resultsTextArea;
        const isFilterActive = filterInput && filterInput.value.trim() !== "";
        const resultsToUseForDisplay = isFilterActive ? GSRS_App.filteredResults : GSRS_App.allResults;

        if (resultsCountSpan) {
            if (isFilterActive) { resultsCountSpan.textContent = `Showing ${resultsToUseForDisplay.length} of ${GSRS_App.allResults.length} results (filtered)`; }
            else { resultsCountSpan.textContent = `Results: ${GSRS_App.allResults.length}`; }
        }

        if (GSRS_App.state.currentViewMode === 'json') {
            if (resultsTextArea) {
                const displayableJsonResults = resultsToUseForDisplay.map(item => getOutputDisplayObject(item.display));
                if (displayableJsonResults.length === 0) {
                    if (isFilterActive && GSRS_App.allResults.length > 0) { resultsTextArea.value = 'No results match your filter.'; }
                    else { resultsTextArea.placeholder = 'No results scraped yet. Click "Scrape Page".'; resultsTextArea.value = ''; }
                } else {
                    resultsTextArea.value = JSON.stringify(displayableJsonResults, null, 2);
                    resultsTextArea.placeholder = 'Scraped results will appear here...';
                }
            }
        } else if (GSRS_App.state.currentViewMode === 'list') {
            GSRS_App.uiManager.populateResultsList();
        }
        updateActionButtonsState();
    }
    function isPAAContainer(blockElement) { if (!blockElement) return false; const headingSpan = blockElement.querySelector(GSRS_App.INTERNAL_SELECTORS.relatedQuestionsBlockHeadingSpan); if (headingSpan && headingSpan.innerText) { const headingText = headingSpan.innerText.trim(); return GSRS_App.INTERNAL_SELECTORS.relatedQuestionsBlockTextIndicators.some(indicator => headingText.includes(indicator)); } return false; }
    function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function _extractTitleAndUrl(resultBlock, debug, position) { let rawTitle = "Title Selector Failed"; let rawUrl = "URL Extraction Failed"; const titleElement = resultBlock.querySelector(GSRS_App.currentSettings.titleSelector); if (titleElement?.innerText) { rawTitle = titleElement.innerText.trim(); const anchorElement = titleElement.closest(GSRS_App.INTERNAL_SELECTORS.anchorInTitle); if (anchorElement?.href && !anchorElement.href.startsWith('javascript:')) { rawUrl = anchorElement.href; } if (debug) console.log(`GSRS (extractTitleUrl) [Pos ${position}]: Title found: "${rawTitle.substring(0,50)}...", URL from title anchor: "${rawUrl}"`); } else { if (debug) console.log(`GSRS (extractTitleUrl) [Pos ${position}]: titleElement (selector: ${GSRS_App.currentSettings.titleSelector}) not found or no innerText.`); } if (rawUrl === "URL Extraction Failed" || rawUrl === "Extraction Failed") { const firstLinkInBlock = resultBlock.querySelector('a[href] > h3'); if (firstLinkInBlock?.parentElement?.href && !firstLinkInBlock.parentElement.href.startsWith('javascript:')) { rawUrl = firstLinkInBlock.parentElement.href; if (rawTitle === "Title Selector Failed" && firstLinkInBlock.innerText) rawTitle = firstLinkInBlock.innerText.trim(); if (debug) console.log(`GSRS (extractTitleUrl) [Pos ${position}]: Fallback URL (a > h3): "${rawUrl}", Title: "${rawTitle.substring(0,50)}..."`); } else { const genericLink = resultBlock.querySelector('h3 > a[href], div > a[href] > h3, div > div > a[href] > h3'); if(genericLink?.href && !genericLink.href.startsWith('javascript:')) { rawUrl = genericLink.href; const h3InsideGeneric = genericLink.querySelector('h3'); if (rawTitle === "Title Selector Failed" && h3InsideGeneric?.innerText) { rawTitle = h3InsideGeneric.innerText.trim(); } else if (rawTitle === "Title Selector Failed" && genericLink.closest('h3')?.innerText) { rawTitle = genericLink.closest('h3').innerText.trim(); } else if (rawTitle === "Title Selector Failed" && genericLink.innerText) { rawTitle = genericLink.innerText.trim().split('\n')[0]; } if (debug) console.log(`GSRS (extractTitleUrl) [Pos ${position}]: Fallback URL (genericLink): "${rawUrl}", Title: "${rawTitle.substring(0,50)}..."`); } } } if (debug && (rawUrl === "URL Extraction Failed" || rawUrl === "Extraction Failed")) console.log(`GSRS (extractTitleUrl) [Pos ${position}]: URL extraction failed after all fallbacks.`); if (rawUrl.startsWith('javascript:void(0)')) rawUrl = "URL Extraction Failed"; if (rawTitle === "Title Selector Failed" && rawUrl !== "URL Extraction Failed" && rawUrl !== "Extraction Failed") { const urlAnchor = resultBlock.querySelector(`a[href="${CSS.escape(rawUrl)}"]`); if (urlAnchor?.innerText) { let potentialTitle = urlAnchor.innerText.trim(); const h3InAnchor = urlAnchor.querySelector('h3'); if (h3InAnchor?.innerText) potentialTitle = h3InAnchor.innerText.trim(); else if (urlAnchor.closest('h3')?.innerText) potentialTitle = urlAnchor.closest('h3').innerText.trim(); if(potentialTitle) rawTitle = potentialTitle.split('\n')[0]; if (debug && rawTitle !== "Title Selector Failed") console.log(`GSRS (extractTitleUrl) [Pos ${position}]: Title recovered from URL context: "${rawTitle.substring(0,50)}..."`); } } return { rawTitle, rawUrl }; }
    function _extractSiteName(resultBlock, rawUrl, debug, position) { if (!GSRS_App.currentSettings.fetchSiteName) return null; let siteNameText = "Extraction Failed"; const siteNameElement = resultBlock.querySelector(GSRS_App.INTERNAL_SELECTORS.siteNameSelector); if (siteNameElement?.innerText) { let tempSiteName = siteNameElement.innerText.trim(); if (tempSiteName.includes('http')) { try { if (rawUrl && rawUrl !== "URL Extraction Failed" && rawUrl !== "Extraction Failed") { const urlPart = new URL(rawUrl.startsWith('http') ? rawUrl : 'http://' + rawUrl); if (tempSiteName.toLowerCase().includes(urlPart.hostname.replace('www.','').toLowerCase())) { tempSiteName = tempSiteName.split(/·|>|\u203A/)[0].trim(); tempSiteName = tempSiteName.replace(urlPart.hostname, '').replace(/\(|\)/g,'').trim(); } } } catch(e){ if (debug) console.warn(`GSRS (extractSiteName) [Pos ${position}]: Error cleaning siteName from URL parts. Error: ${e.message}`); } } siteNameText = tempSiteName || "Extraction Failed"; if (debug) console.log(`GSRS (extractSiteName) [Pos ${position}]: Site name: "${siteNameText}"`); } else if (debug) { console.warn(`GSRS (extractSiteName) [Pos ${position}]: siteNameElement NOT found using selector: "${GSRS_App.INTERNAL_SELECTORS.siteNameSelector}" on block:`, resultBlock); siteNameText = null; } return siteNameText; }
    function _extractBreadcrumbs(resultBlock, rawUrl, debug, position) { if (!GSRS_App.currentSettings.fetchBreadcrumbs) return null; let breadcrumbsText = "Extraction Failed"; const citeElement = resultBlock.querySelector(GSRS_App.INTERNAL_SELECTORS.citeDisplay); if (citeElement?.innerText) { let tempBreadcrumbs = citeElement.innerText.trim(); if (rawUrl && rawUrl !== "URL Extraction Failed" && rawUrl !== "Extraction Failed") { try { const urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : 'http://' + rawUrl); let hostnamePattern = urlObj.hostname.replace('www.', ''); hostnamePattern = escapeRegExp(hostnamePattern); const hostnameRegex = new RegExp(`(https?:\\/\\/)?(www\\.)?${hostnamePattern}\\s*([›>/\\s]|$)`, 'gi'); tempBreadcrumbs = tempBreadcrumbs.replace(hostnameRegex, '').trim(); } catch (e) { if (debug) console.warn(`GSRS (extractBreadcrumbs) [Pos ${position}]: Error cleaning breadcrumbs from URL. Error: ${e.message}`); } } tempBreadcrumbs = tempBreadcrumbs.replace(/^[\s›>\/\-\|]+|[\s›>\/\-\|]+$/g, '').replace(/\s+/g, ' ').trim(); if (tempBreadcrumbs && tempBreadcrumbs.length > 1) { const BREADCRUMB_NOISE_PATTERNS = [ /^\d+([.,]\d+)*\s*(萬|千)?\s*個?(追蹤者|粉絲|的說法|回應|評論|評分|評價|觀看次數|月前|天前|小時前|分鐘前|年前)/i, /^\d+年\d+月\d+日/i, /^\d{1,2}\/\d{1,2}\/\d{2,4}/, /^\w+\s\d{1,2},\s\d{4}/i, /重要時刻/i, /^\d+:\d+(?::\d+)?$/ ]; if (BREADCRUMB_NOISE_PATTERNS.some(p => p.test(tempBreadcrumbs))) { breadcrumbsText = null; if (debug) console.log(`GSRS (extractBreadcrumbs) [Pos ${position}]: Breadcrumb candidate "${tempBreadcrumbs}" filtered by noise pattern.`); } else if (!tempBreadcrumbs.includes(' ') && tempBreadcrumbs.includes('.') && !tempBreadcrumbs.includes('›') && !tempBreadcrumbs.includes('>')) { try { new URL('http://' + tempBreadcrumbs); breadcrumbsText = null; } catch(e){ breadcrumbsText = tempBreadcrumbs; } } else { breadcrumbsText = tempBreadcrumbs; } } else { breadcrumbsText = null; } if (debug) console.log(`GSRS (extractBreadcrumbs) [Pos ${position}]: Breadcrumbs: "${breadcrumbsText}" (Original cite: "${citeElement.innerText.trim().substring(0,100)}")`); } else if (debug) { console.warn(`GSRS (extractBreadcrumbs) [Pos ${position}]: citeElement for breadcrumbs NOT found using selector: "${GSRS_App.INTERNAL_SELECTORS.citeDisplay}" on block:`, resultBlock); breadcrumbsText = null; } return breadcrumbsText; }
    function _extractDescriptionDetails(resultBlock, debug, position) { if (!GSRS_App.currentSettings.fetchDescription) { return { descriptionText: null, highlightedSnippetsText: null, originalDateText: null, parsedDateISO: null }; } let descriptionText = "Desc Extraction Failed"; let highlightedSnippetsText = null; let originalDateText = null; let parsedDateISO = null; let fullDescriptionSourceText = null; let descriptionContainerElement = null; let foundBySelector = "None"; const descSelectorsAttemptOrder = [ { name: "directDescriptionContainer", selector: GSRS_App.INTERNAL_SELECTORS.directDescriptionContainer }, { name: "genericDescriptionContainer", selector: GSRS_App.INTERNAL_SELECTORS.genericDescriptionContainer }, { name: "videoDescriptionSelector", selector: GSRS_App.INTERNAL_SELECTORS.videoDescriptionSelector } ]; for (const attempt of descSelectorsAttemptOrder) { descriptionContainerElement = resultBlock.querySelector(attempt.selector); if (descriptionContainerElement) { foundBySelector = attempt.name; if (debug) console.log(`GSRS (extractDescDetails) [Pos ${position}]: Desc container found by ${foundBySelector}. HTML (brief): ${descriptionContainerElement.outerHTML.substring(0,100)}`); break; } } if (!descriptionContainerElement) { const outerDescBlock = resultBlock.querySelector(GSRS_App.INTERNAL_SELECTORS.outerDescriptionBlockSelector); if (outerDescBlock) { if (debug) console.log(`GSRS (extractDescDetails) [Pos ${position}]: OuterDescBlock found, trying selectors inside it.`); for (const attempt of descSelectorsAttemptOrder) { descriptionContainerElement = outerDescBlock.querySelector(attempt.selector); if (descriptionContainerElement) { foundBySelector = `${attempt.name} (in outer)`; if (debug) console.log(`GSRS (extractDescDetails) [Pos ${position}]: Desc container found by ${foundBySelector}. HTML (brief): ${descriptionContainerElement.outerHTML.substring(0,100)}`); break; } } } } if (descriptionContainerElement) { fullDescriptionSourceText = descriptionContainerElement.innerText.trim(); if (debug) console.log(`GSRS (extractDescDetails) [Pos ${position}]: Raw innerText from container (${foundBySelector}): "${fullDescriptionSourceText.substring(0, 200)}..."`); if (GSRS_App.currentSettings.fetchDescriptionKeywords) { const keywordElements = descriptionContainerElement.querySelectorAll(GSRS_App.INTERNAL_SELECTORS.descriptionKeywordSelector); if (keywordElements.length > 0) { highlightedSnippetsText = Array.from(keywordElements).map(em => em.innerText.trim()).filter(text => text).join(' ... '); if (debug) console.log(`GSRS (extractDescDetails) [Pos ${position}]: Highlighted snippets: "${highlightedSnippetsText}"`); } else if (debug) { console.log(`GSRS (extractDescDetails) [Pos ${position}]: No keyword elements found with selector: ${GSRS_App.INTERNAL_SELECTORS.descriptionKeywordSelector}`); } } } else { if (debug) console.warn(`GSRS (extractDescDetails) [Pos ${position}]: Description container NOT found. Searched with: ${descSelectorsAttemptOrder.map(s=>s.selector).join(' , ')} on block:`, resultBlock); descriptionText = null; } if (fullDescriptionSourceText) { let processedDescription = fullDescriptionSourceText; if (GSRS_App.currentSettings.fetchDateInfo) { const dateInfo = _extractDateFromDescription(processedDescription, descriptionContainerElement, debug, position); originalDateText = dateInfo.originalDateText; parsedDateISO = dateInfo.parsedDateISO; if(originalDateText) { processedDescription = dateInfo.remainingDescription; } } descriptionText = processedDescription.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(); if (descriptionText === "" && fullDescriptionSourceText !== "") { if (originalDateText && fullDescriptionSourceText.toLowerCase().trim() === originalDateText.toLowerCase().trim()) { if (debug) console.log(`GSRS (extractDescDetails) [Pos ${position}]: Description is empty because original text was just the date.`); descriptionText = null; } else if (originalDateText) { descriptionText = (fullDescriptionSourceText.length > originalDateText.length + 5) ? "Desc Extraction Failed" : null; if (debug && descriptionText === "Desc Extraction Failed") console.warn(`GSRS (extractDescDetails) [Pos ${position}]: Description empty after date removal, but original was more. Original: "${fullDescriptionSourceText.substring(0,50)}...", Date: "${originalDateText}"`); else if (debug && descriptionText === null) console.log(`GSRS (extractDescDetails) [Pos ${position}]: Description considered null after date removal (original likely date + minor surrounding text).`); } } else if (descriptionText === "" && fullDescriptionSourceText === "" ) { descriptionText = null; } if (debug && descriptionText !== "Desc Extraction Failed") console.log(`GSRS (extractDescDetails) [Pos ${position}]: Final descriptionText: "${(descriptionText||"").substring(0,100)}..."`); } else if (!descriptionContainerElement) { descriptionText = null; } return { descriptionText, highlightedSnippetsText, originalDateText, parsedDateISO }; }
    function _extractDateFromDescription(currentDescription, descriptionContainerElement, debug, position) { let originalDateText = null; let parsedDateISO = null; let remainingDescription = currentDescription; const separatorPatternGeneral = /^\s*(?:—|-)\s+/; const datePrefixSpan = descriptionContainerElement ? descriptionContainerElement.querySelector(GSRS_App.INTERNAL_SELECTORS.datePrefixSpanSelector) : null; if (datePrefixSpan?.innerText) { const potentialDateStrFromSpan = datePrefixSpan.innerText.trim(); if (debug) console.log(`GSRS (_extractDate) [Pos ${position}]: Date prefix span found, text: "${potentialDateStrFromSpan}"`); if (remainingDescription.startsWith(potentialDateStrFromSpan)) { const textAfterSpan = remainingDescription.substring(potentialDateStrFromSpan.length); const separatorMatch = textAfterSpan.match(separatorPatternGeneral); if (separatorMatch) { originalDateText = potentialDateStrFromSpan; remainingDescription = textAfterSpan.substring(separatorMatch[0].length).trim(); if (debug) console.log(`GSRS (_extractDate SPAN) [Pos ${position}]: Date extracted: "${originalDateText}". Desc remaining: "${remainingDescription.substring(0,50)}..."`); } else { if (debug) console.log(`GSRS (_extractDate SPAN) [Pos ${position}]: Found span text "${potentialDateStrFromSpan}", but no standard separator in: "${textAfterSpan.substring(0,30)}"`); const tempParsedDate = parseDateStringPureJS(potentialDateStrFromSpan, new Date()); if (tempParsedDate) { originalDateText = potentialDateStrFromSpan; remainingDescription = textAfterSpan.trim(); if (debug) console.log(`GSRS (_extractDate SPAN, NO SEP) [Pos ${position}]: Date candidate from span: "${originalDateText}". Desc remaining: "${remainingDescription.substring(0,50)}..."`); } else if (debug) { console.log(`GSRS (_extractDate SPAN, NO SEP) [Pos ${position}]: Span text "${potentialDateStrFromSpan}" did not parse as date, not using it as date.`); } } } } if (!originalDateText && remainingDescription) { if (debug) console.log(`GSRS (_extractDate REGEX) [Pos ${position}]: Trying regex on: "${remainingDescription.substring(0,50)}..."`); const cjkAbsoluteDatePatterns = [ /^(\d{4}年\s*\d{1,2}月\s*\d{1,2}日?(?:\s*\d{1,2}:\d{1,2}(?::\d{1,2})?)?)\s*(?:—|-)\s+/i, /^((\d{1,2})月\s*(\d{1,2})日?)\s*(?:—|-)\s+/i, ]; const enAbsoluteDatePatterns = [ /^(([a-z.]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s*|\s+)(\d{4})(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?\s*(?:am|pm)?)?)\s*(?:—|-)\s+/i, /^((\d{1,2})\s+([a-z.]{3,9})\s+(\d{4})(?:\s+\d{1,2}:\d{1,2}(?::\d{1,2})?\s*(?:am|pm)?)?)\s*(?:—|-)\s+/i, /^((\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s]\d{1,2}:\d{1,2}(?::\d{1,2})?)?)\s*(?:—|-)\s+/i, /^((\d{1,2})[-/.](\d{1,2})[-/.](\d{4}))\s*(?:—|-)\s+/i, ]; const relativeDatePatterns = [ /^((?:\d+\s+)?(?:year|month|week|day|hour|minute|second)s?\s+ago)\s*(?:—|-)\s+/i, /^(yesterday|today|just now|now)\s*(?:—|-)\s+/i, /^(\d+\s*(?:年|ヶ月|か月|個月|週間|週|日|天|時間|小時|分|分鐘)前)\s*(?:—|-)\s+/i, /^(昨日|たった今|今さっき|昨天|剛剛|剛)\s*(?:—|-)\s+/i, ]; const generalDatePrefixPatterns = [ ...cjkAbsoluteDatePatterns, ...enAbsoluteDatePatterns, ...relativeDatePatterns ]; for (const pattern of generalDatePrefixPatterns) { const match = remainingDescription.match(pattern); if (match && match[1]) { originalDateText = match[1].trim(); remainingDescription = remainingDescription.substring(match[0].length).trim(); if (debug) console.log(`GSRS (_extractDate REGEX) [Pos ${position}]: Date extracted: "${originalDateText}". Desc remaining: "${remainingDescription.substring(0,50)}..."`); break; } } } if (originalDateText) { const parsedDateObject = parseDateStringPureJS(originalDateText, new Date()); if (parsedDateObject) { parsedDateISO = parsedDateObject.toISOString(); if (debug) console.log(`GSRS (_extractDate PARSE) [Pos ${position}]: Parsed "${originalDateText}" to ISO: ${parsedDateISO}`); } else if (debug) { console.log(`GSRS (_extractDate PARSE) [Pos ${position}]: Failed to parse extracted date string "${originalDateText}" with PureJS.`); } } else if (debug) { if (currentDescription && currentDescription.trim() !== "") { console.log(`GSRS (_extractDate) [Pos ${position}]: No date string extracted from description starting with: "${currentDescription.substring(0,100)}..."`); } } return { originalDateText, parsedDateISO, remainingDescription }; }
    function _extractForumMetadata(resultBlock, position, debug) { let forumStats = null; let relatedPosts = []; let extractedDate = { original: null, iso: null }; const citeElement = resultBlock.querySelector(GSRS_App.INTERNAL_SELECTORS.citeDisplay); if (citeElement) { let citeText = citeElement.innerText.trim(); const translationLink = citeElement.querySelector(GSRS_App.INTERNAL_SELECTORS.translationLinkNoise); if (translationLink) { citeText = citeText.replace(translationLink.innerText, '').trim(); } const statsRegex = /((?:超過|以上)?\s*\d[\d,.]*[Kk]?\+?\s*(?:則留言|個答案|則貼文|件以上のコメント|回答\s*\d+\s*件|件の投稿|comments|answers|posts|votes))/i; const statsMatch = citeText.match(statsRegex); if (statsMatch && GSRS_App.currentSettings.fetchForumStats) { forumStats = statsMatch[1].trim(); citeText = citeText.replace(statsMatch[0], '').replace(/·/g, '').trim(); if (debug) console.log(`GSRS (_extractForumMetadata) [Pos ${position}]: Found Forum Stats: "${forumStats}"`); } const dateFromCite = parseDateStringPureJS(citeText, new Date()); if (dateFromCite) { extractedDate.original = citeText; extractedDate.iso = dateFromCite.toISOString(); if (debug) console.log(`GSRS (_extractForumMetadata) [Pos ${position}]: Found Date in cite: "${citeText}" -> ${extractedDate.iso}`); } } const relatedPostsContainer = resultBlock.querySelector(GSRS_App.INTERNAL_SELECTORS.relatedPostsContainer); if (relatedPostsContainer && GSRS_App.currentSettings.fetchRelatedPosts) { relatedPostsContainer.querySelectorAll(GSRS_App.INTERNAL_SELECTORS.relatedPostRow).forEach(row => { const linkEl = row.querySelector(GSRS_App.INTERNAL_SELECTORS.relatedPostLink); if (!linkEl) return; const post = { title: linkEl.innerText.trim(), url: linkEl.href, stats: null, date: null }; const metaCells = row.querySelectorAll(GSRS_App.INTERNAL_SELECTORS.relatedPostMetadataCell); if (metaCells.length > 0) { post.stats = metaCells[0].innerText.trim(); } if (metaCells.length > 1) { post.date = metaCells[1].innerText.trim(); } relatedPosts.push(post); }); if (debug && relatedPosts.length > 0) console.log(`GSRS (_extractForumMetadata) [Pos ${position}]: Found ${relatedPosts.length} related posts.`); } return { forumStats, relatedPosts, extractedDate }; }
	function extractSingleResultElement(resultBlock, position) { if (!resultBlock || resultBlock.dataset.gsrsBlockParsed === 'true') { return null; } const debug = GSRS_App.currentSettings.debugMode; if (resultBlock.id && (resultBlock.id.startsWith('infy-scroll-divider-') || resultBlock.id === 'infy-scroll-loading' || resultBlock.id === 'infy-scroll-bottom')) { if (debug) console.log(`GSRS (extractSingleResultElement) [Pos ${position}]: Ignoring Infy Scroll helper element:`, resultBlock.id); resultBlock.dataset.gsrsBlockParsed = 'true'; return null; } if (debug) console.log(`%cGSRS (extractSingleResultElement): Processing block for position ${position}. Element:`, "color: purple; font-weight: bold;", resultBlock); const { rawTitle, rawUrl } = _extractTitleAndUrl(resultBlock, debug, position); const siteNameText = _extractSiteName(resultBlock, rawUrl, debug, position); let breadcrumbsText = _extractBreadcrumbs(resultBlock, rawUrl, debug, position); const descDetails = _extractDescriptionDetails(resultBlock, debug, position); let { originalDateText, parsedDateISO } = descDetails; const forumData = _extractForumMetadata(resultBlock, position, debug); if (forumData.extractedDate.original) { originalDateText = forumData.extractedDate.original; parsedDateISO = forumData.extractedDate.iso; breadcrumbsText = null; } if (rawTitle === "Title Selector Failed" && (rawUrl === "URL Extraction Failed" || rawUrl === "Extraction Failed")) { if (debug) console.log(`GSRS (extractSingleResultElement) [Pos ${position}]: Returning NULL - Title selector failed AND URL extraction also failed.`); return null; } resultBlock.dataset.gsrsBlockParsed = 'true'; if (GSRS_App.currentSettings.highlightParsed) { if (!resultBlock.classList.contains('gsrs-list-item-page-highlight') && !resultBlock.classList.contains('gsrs-context-highlight')) { resultBlock.classList.add('gsrs-highlighted'); setTimeout(() => { if (resultBlock && resultBlock.classList.contains('gsrs-highlighted') && !resultBlock.classList.contains('gsrs-list-item-page-highlight') && !resultBlock.classList.contains('gsrs-context-highlight')) { resultBlock.classList.remove('gsrs-highlighted'); } }, 2500); } } const displayUrl = decodeUrlIfEnabled(rawUrl === "URL Extraction Failed" ? "Extraction Failed" : rawUrl); if (debug) { console.log(`%cGSRS (extractSingleResultElement Result) [Pos ${position}]:%c \nTitle: "${(rawTitle === "Title Selector Failed" ? "Extraction Failed" : rawTitle).substring(0,30)}..." \nRaw URL: "${rawUrl}" \nDisplay URL: "${displayUrl}" \nSiteName: "${siteNameText}" \nBreadcrumbs: "${breadcrumbsText}" \nOriginal Date: "${originalDateText}" \nParsed Date ISO: "${parsedDateISO}" \nDescription: "${(descDetails.descriptionText||"N/A").substring(0,50)}..." \nKeywords: "${(descDetails.highlightedSnippetsText||"N/A").substring(0,30)}..." \nForum Stats: "${forumData.forumStats}" \nRelated Posts: ${forumData.relatedPosts.length}`, "color: green; font-weight: bold;", "color: green;"); } return { internal: { rawTitle: (rawTitle === "Title Selector Failed" ? "Extraction Failed" : rawTitle), rawUrl }, display: { position, title: (rawTitle === "Title Selector Failed" ? "Extraction Failed" : rawTitle), url: displayUrl, siteName: siteNameText, breadcrumbs: breadcrumbsText, description: descDetails.descriptionText, highlightedSnippets: descDetails.highlightedSnippetsText, originalDateText: originalDateText, parsedDateISO: parsedDateISO, forumStats: forumData.forumStats, relatedPosts: forumData.relatedPosts, }, domElement: resultBlock }; }
    function processPageForResults(rootElement = document) { if (GSRS_App.currentSettings.debugMode) console.log("%cGSRS: processPageForResults starting...", "color: blue; font-weight: bold;", "Root:", rootElement === document ? "document" : rootElement); let newResultsFoundInThisPass = 0; const titleQuerySelector = GSRS_App.currentSettings.titleSelector; if (GSRS_App.allResults.length === 0 && rootElement === document) { try { if (document.querySelectorAll(titleQuerySelector).length === 0) { GSRS_App.uiManager.showUIMessage(`Warning: Title selector "${titleQuerySelector}" found 0 elements on the page. Check selector settings.`, 'error', 10000); } } catch (e) { GSRS_App.uiManager.showUIMessage(`Error with title selector "${titleQuerySelector}": ${e.message}. Please correct it in settings.`, 'error', 10000); return 0; } } const titleElements = Array.from(rootElement.querySelectorAll(titleQuerySelector)) .filter(titleEl => { if (titleEl.dataset.gsrsTitleProcessed === 'true') return false; if (titleEl.closest(GSRS_App.INTERNAL_SELECTORS.individualRelatedQuestionPair)) { if (GSRS_App.currentSettings.debugMode) console.log(`GSRS (processPage): Filtering out PAA item title: "${titleEl.innerText.substring(0,30)}..."`, titleEl); titleEl.dataset.gsrsTitleProcessed = 'true'; return false; } return true; }); const potentialResultBlocks = new Set(); if (GSRS_App.currentSettings.debugMode) console.log(`GSRS (processPage): Found ${titleElements.length} potential title elements (after PAA filtering) in root:`, rootElement === document ? "document" : rootElement); titleElements.forEach((titleEl) => { if (GSRS_App.currentSettings.debugMode) console.log(`GSRS (processPage): Processing Title Element: "${titleEl.innerText.substring(0, 50)}..."`, titleEl); let bestCandidateBlock = null; for (const knownSelector of GSRS_App.INTERNAL_SELECTORS.potentialResultBlockSelectors) { const closestKnownBlock = titleEl.closest(knownSelector); if (closestKnownBlock) { bestCandidateBlock = closestKnownBlock; if (GSRS_App.currentSettings.debugMode) console.log(`GSRS (processPage): Title belongs to known block type "${knownSelector}"`, bestCandidateBlock); break; } } if (!bestCandidateBlock) { let tempCandidate = titleEl; const MAX_FALLBACK_TRACE = 4; for (let i = 0; i < MAX_FALLBACK_TRACE && tempCandidate.parentElement; i++) { tempCandidate = tempCandidate.parentElement; if (tempCandidate.tagName === 'DIV' && GSRS_App.INTERNAL_SELECTORS.dataAttributesForCandidate.some(attr => tempCandidate.hasAttribute(attr))) { if (tempCandidate.id !== 'search' && tempCandidate.id !== 'rso' && tempCandidate.id !== 'main' && tempCandidate.tagName.toLowerCase() !== 'body' && tempCandidate.tagName.toLowerCase() !== 'html') { bestCandidateBlock = tempCandidate; if (GSRS_App.currentSettings.debugMode) console.log(`GSRS (processPage): Title fallback found block with data attribute.`, bestCandidateBlock); break; } } } } if (bestCandidateBlock) { if (bestCandidateBlock.dataset.gsrsBlockParsed === 'true') { titleEl.dataset.gsrsTitleProcessed = 'true'; return; } let isExcluded = false; if (GSRS_App.INTERNAL_SELECTORS.carouselStructureIndicator && bestCandidateBlock.querySelector(GSRS_App.INTERNAL_SELECTORS.carouselStructureIndicator)) { isExcluded = true; if (GSRS_App.currentSettings.debugMode) console.log("GSRS (processPage exclude): Carousel structure detected in block.", bestCandidateBlock); } if (!isExcluded) { const closestKPShell = bestCandidateBlock.closest(GSRS_App.INTERNAL_SELECTORS.knowledgePanelSelector); if (closestKPShell) { const isCandidateTheKPShellItself = bestCandidateBlock.matches(GSRS_App.INTERNAL_SELECTORS.knowledgePanelSelector); const candidateHasKPCoreDirectChild = GSRS_App.INTERNAL_SELECTORS.knowledgePanelCoreContentDirectChild.split(',').some(sel => bestCandidateBlock.querySelector(sel.trim())); if (isCandidateTheKPShellItself || candidateHasKPCoreDirectChild) { isExcluded = true; if (GSRS_App.currentSettings.debugMode) console.log("GSRS (processPage exclude): Knowledge panel detected.", bestCandidateBlock); } } } if (!isExcluded && isPAAContainer(bestCandidateBlock)) { isExcluded = true; if (GSRS_App.currentSettings.debugMode) console.log("GSRS (processPage exclude): PAA container block detected.", bestCandidateBlock); bestCandidateBlock.querySelectorAll(GSRS_App.currentSettings.titleSelector).forEach(t => t.dataset.gsrsTitleProcessed = 'true'); } if (!isExcluded) { potentialResultBlocks.add(bestCandidateBlock); } else { bestCandidateBlock.dataset.gsrsBlockParsed = 'true'; } } titleEl.dataset.gsrsTitleProcessed = 'true'; }); potentialResultBlocks.forEach(blockElement => { if (blockElement.dataset.gsrsBlockParsed === 'true') return; const parsedResultContainer = extractSingleResultElement(blockElement, GSRS_App.allResults.length + 1); if (parsedResultContainer?.internal) { const { internal } = parsedResultContainer; let isDuplicate = false; if (internal.rawUrl && internal.rawUrl !== "URL Extraction Failed" && internal.rawUrl !== "Extraction Failed" && !internal.rawUrl.startsWith('javascript:void(0)')) { isDuplicate = GSRS_App.allResults.some(existingItem => existingItem.internal.rawUrl === internal.rawUrl); } else if (internal.rawTitle && internal.rawTitle !== "Title Selector Failed" && internal.rawTitle !== "Extraction Failed") { isDuplicate = GSRS_App.allResults.some(existingItem => existingItem.internal.rawTitle === internal.rawTitle && (!existingItem.internal.rawUrl || ["URL Extraction Failed", "Extraction Failed"].includes(existingItem.internal.rawUrl) || existingItem.internal.rawUrl.startsWith('javascript:void'))); } if (!isDuplicate) { parsedResultContainer.display.position = GSRS_App.allResults.length + 1; GSRS_App.allResults.push(parsedResultContainer); newResultsFoundInThisPass++; } else { if (GSRS_App.currentSettings.debugMode) console.log("GSRS (processPage): Duplicate result skipped:", internal.rawTitle, internal.rawUrl); blockElement.dataset.gsrsBlockParsed = 'true'; } } else { if (!blockElement.dataset.gsrsBlockParsed) blockElement.dataset.gsrsBlockParsed = 'true'; if (GSRS_App.currentSettings.debugMode && parsedResultContainer === null && !(blockElement.id && blockElement.id.startsWith('infy-scroll-'))) { console.log("GSRS (processPage): extractSingleResultElement returned null for block, marking as parsed.", blockElement); } } }); if (GSRS_App.currentSettings.debugMode) console.log(`GSRS: processPageForResults finished for root ${rootElement === document ? "document" : "node"}. New results found in this pass: ${newResultsFoundInThisPass}`); return newResultsFoundInThisPass; }
    function clearAllPageHighlights(includeScrapeTimeHighlight = true) { if (GSRS_App.state.lastListItemHighlightedElement && document.body.contains(GSRS_App.state.lastListItemHighlightedElement)) { GSRS_App.state.lastListItemHighlightedElement.classList.remove('gsrs-list-item-page-highlight'); GSRS_App.state.lastListItemHighlightedElement.classList.remove('gsrs-context-highlight'); } GSRS_App.state.lastListItemHighlightedElement = null; document.querySelectorAll('.gsrs-context-highlight').forEach(el => el.classList.remove('gsrs-context-highlight')); clearTimeout(GSRS_App.state.contextMenuHighlightTimeout); document.querySelectorAll('.gsrs-list-item-page-highlight').forEach(el => el.classList.remove('gsrs-list-item-page-highlight')); if (includeScrapeTimeHighlight) { document.querySelectorAll('.gsrs-highlighted').forEach(el => el.classList.remove('gsrs-highlighted')); } }

    // --- MutationObserver (For auto-scraping dynamic content) ---
    function setupMutationObserver() {
        // First, disconnect any existing observer to prevent duplicates.
        if (GSRS_App.observer) {
            GSRS_App.observer.disconnect();
            GSRS_App.observer = null;
            if (GSRS_App.currentSettings.debugMode) console.log("GSRS_Debug (ObserverSetup): Disconnected pre-existing observer instance.");
        }

        // If the feature is disabled in settings, ensure UI is updated and exit.
        if (!GSRS_App.currentSettings.autoScrapeOnUpdate) {
            if (GSRS_App.currentSettings.debugMode) { console.log("GSRS: Auto-scraping is disabled. MutationObserver will not be started."); }
            GSRS_App.uiManager.updateObserverStatus(false);
            return;
        }

        const targetNode = document.querySelector(GSRS_App.currentSettings.observerTargetSelector);
        if (!targetNode) {
            if (GSRS_App.currentSettings.debugMode) { console.error(`GSRS: MutationObserver target "${GSRS_App.currentSettings.observerTargetSelector}" not found.`); }
            GSRS_App.uiManager.updateObserverStatus(false);
            return;
        }

        /**
         * A smarter mutation callback that only triggers the debounce if it finds
         * a node containing a potential new, unprocessed search result.
         */
        const smarterMutationCallback = (mutationsList) => {
            let newContentFound = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const addedNode of mutation.addedNodes) {
                        // We only care about element nodes.
                        if (addedNode.nodeType !== 1) continue;

                        // Check if the added node or its descendants contain a title that hasn't been processed.
                        // This is the key to avoiding false positives from other scripts.
                        const unprocessedTitleSelector = `${GSRS_App.currentSettings.titleSelector}:not([data-gsrs-title-processed="true"])`;
                        if (addedNode.querySelector(unprocessedTitleSelector)) {
                            newContentFound = true;
                            break; // Exit the inner loop once found
                        }
                    }
                }
                if (newContentFound) {
                    break; // Exit the outer loop once found
                }
            }

            // Only if we found meaningful new content, we proceed with the debounced scrape.
            if (newContentFound) {
                clearTimeout(GSRS_App.state.observerDebounceTimer);
                GSRS_App.state.observerDebounceTimer = setTimeout(() => {
                    if (GSRS_App.currentSettings.debugMode) console.log(`%cGSRS: Meaningful DOM change detected, starting auto-scrape after debounce...`, "color: blue;");
                    
                    // Run the processing and get the count of *actually new* results.
                    const newCount = processPageForResults(document.body);

                    // Only show a message and update the UI if new results were actually added.
                    if (newCount > 0) {
                        GSRS_App.uiManager.showUIMessage(`Auto-scraped ${newCount} new results.`, 'success', 3000);
                        GSRS_App.uiManager.updateResultsDisplay();
                    } else if (GSRS_App.currentSettings.debugMode) {
                        console.log("GSRS_Debug (Observer): DOM change detected, but no new results were parsed.");
                    }
                }, GSRS_App.OBSERVER_DEBOUNCE_DELAY);
            }
        };

        const MutationObserverClass = window.MutationObserver || window.WebKitMutationObserver;
        GSRS_App.observer = new MutationObserverClass(smarterMutationCallback);
        GSRS_App.observer.observe(targetNode, { childList: true, subtree: true });

        if (GSRS_App.currentSettings.debugMode) { console.log(`GSRS: MutationObserver started, observing target:`, targetNode); }
        GSRS_App.uiManager.updateObserverStatus(true);
    }

    function init() {
        GSRS_App.settingsManager.load();
        GSRS_App.uiManager.create();
        GSRS_App.settingsManager.updateInputs();
        GSRS_App.uiManager.toggleViewMode(GSRS_App.state.currentViewMode);

        if (GSRS_App.urlChangeDetector && typeof GSRS_App.urlChangeDetector.init === 'function') {
            GSRS_App.urlChangeDetector.init();
        } else if (GSRS_App.currentSettings.debugMode) {
            console.error("GSRS: URLChangeDetector not found or init is not a function.");
        }

        if (GSRS_App.currentSettings.debugMode) console.log("GSRS (Init): Performing initial page scrape.");
        handleStartParse();

        if(GSRS_App.currentSettings.lastFilterTerm) {
            handleFilterResults();
        }

        setTimeout(() => {
            if (GSRS_App.currentSettings.debugMode) console.log("GSRS: Delayed initial call to updateActionButtonsState from init().");
            updateActionButtonsState();
        }, 100);

        if (GSRS_App.currentSettings.debugMode) console.log("%cGSRS: Init complete.", "color: orange; font-weight: bold;");
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();