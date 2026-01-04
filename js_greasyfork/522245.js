// ==UserScript==
// @name         Torn Racing Telemetry
// @namespace    https://www.torn.com/profiles.php?XID=2782979
// @version      3.4.2
// @description  Enhanced Torn Racing UI: Telemetry, driver stats, advanced stats panel, history tracking, and race results export.
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_setClipboard
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522245/Torn%20Racing%20Telemetry.user.js
// @updateURL https://update.greasyfork.org/scripts/522245/Torn%20Racing%20Telemetry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ScriptInfo = {
        version: '3.4.2',
        author: "TheProgrammer",
        contactId: "2782979",
        contactUrl: function() { return `https://www.torn.com/profiles.php?XID=${this.contactId}`; },
        description: "Provides enhanced telemetry, stats analysis, historical tracking, and race results export for Torn Racing.",
        notes: [
            "v3.4.2: Thanks to @MikeyJDoug[2137820] for noticing. Fixed a critical error in the stats panel for new users or users with no official race history. The panel will now display a proper message instead of crashing.",
            "v3.4.1: Implemented Race ID capture for unique race identification in logs and exports. Improved User ID detection for better script initialization.",
            "v3.4.0: Major telemetry engine overhaul. Implemented advanced EMA smoothing for speed & acceleration, robust handling for data gaps to prevent artifacts, and a more predictive lap time estimation model for significantly improved accuracy and stability.",
            "Your API key and all other script data (settings, history log) are stored **locally** in your browser's userscript storage. They are **never** transmitted anywhere except to the official Torn API when fetching data.",
        ]
    };

    if (window.racingCustomUITelemetryHasRun) return;
    window.racingCustomUITelemetryHasRun = true;

    // Check if we're running in Torn PDA
    const isPDA = typeof window.flutter_inappwebview !== 'undefined' &&
                typeof window.flutter_inappwebview.callHandler === 'function';

    // Function to load Chart.js in PDA environment
    async function loadChartJsInPDA() {
        try {
            if (typeof __PDA_platformReadyPromise !== 'undefined') {
                await __PDA_platformReadyPromise;
            }
            const chartJsUrl = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js';
            const response = await window.flutter_inappwebview.callHandler("PDA_httpGet", chartJsUrl, {});

            if (response && response.status === 200 && response.responseText) {
                await window.flutter_inappwebview.callHandler("PDA_evaluateJavascript", response.responseText);
                console.log("Torn Racing Telemetry: Successfully loaded Chart.js in PDA environment");
                return true;
            } else {
                console.error("Torn Racing Telemetry: Failed to fetch Chart.js in PDA environment", response);
                return false;
            }
        } catch (error) {
            console.error("Torn Racing Telemetry: Error loading Chart.js in PDA environment", error);
            return false;
        }
    }

    // Load Chart.js if needed
    if (isPDA) {
        console.log("Torn Racing Telemetry: Running in Torn PDA environment");
        loadChartJsInPDA().then(success => {
            if (!success) {
                console.error("Torn Racing Telemetry: Charts will not be available in PDA");
            }
        });
    }

    const Config = {
        defaults: {
            telemetryDisplayOptions: ['speed'],
            colorCode: true, animateChanges: true, speedUnit: 'mph',
            minUpdateInterval: 300, telemetryVisible: true, hideOriginalList: true, showLapEstimate: true,
            lapEstimateSmoothingFactor: 0.15, fetchApiStatsOnClick: true,
            historicalRaceLimit: 20,
            historyEnabled: true,
            statsPanelEnabled: true,
            historyCheckInterval: 15000,
            historyLogLimit: 10,
            speedSmoothingFactor: 0.7,
            maxAnimationDurationMs: 1000
        },
        data: {},
        storageKey: 'racingCustomUITelemetryConfig_v3.1.3', //never change or delete this comment unless absolutely game breaking update
        apiKeyStorageKey: 'racingCustomUITelemetryApiKey_persistent',

        load() {
            try {
                this.data = {...this.defaults, ...JSON.parse(GM_getValue(this.storageKey, '{}'))};
                this.data.apiKey = GM_getValue(this.apiKeyStorageKey, '');
            } catch (e) {
                this.data = {...this.defaults};
                this.data.apiKey = GM_getValue(this.apiKeyStorageKey, '');
            }
            for (const key in this.defaults) {
                if (!(key in this.data)) {
                    this.data[key] = this.defaults[key];
                }
            }
             if (!('speedSmoothingFactor' in this.data)) {
                this.data.speedSmoothingFactor = this.defaults.speedSmoothingFactor;
            }
             if (!('maxAnimationDurationMs' in this.data)) {
                this.data.maxAnimationDurationMs = this.defaults.maxAnimationDurationMs;
            }
            if ('animationLerpRate' in this.data) {
                delete this.data.animationLerpRate;
                this.save();
            }
            return this.data;
        },
        save() {
            const dataToSave = { ...this.data };
            delete dataToSave.apiKey;
            GM_setValue(this.storageKey, JSON.stringify(dataToSave));
        },
        get(key) {
            return key in this.data ? this.data[key] : this.defaults[key];
        },
        set(key, value) {
            if (key === 'apiKey') {
                this.data.apiKey = value;
                GM_setValue(this.apiKeyStorageKey, value);
            } else {
                this.data[key] = value;
                this.save();
            }
        },
        clearData() {
            const currentApiKey = GM_getValue(this.apiKeyStorageKey, '');
            this.data = { ...this.defaults };
            this.data.apiKey = currentApiKey;
            this.save();
            GM_deleteValue(HistoryManager.logStorageKey);
            HistoryManager.loadLog();
        },
        clearApiKey() {
             this.data.apiKey = '';
             GM_deleteValue(this.apiKeyStorageKey);
        }
    };
    Config.load();

    const State = {
        userId: null, previousMetrics: {},
        trackInfo: { id: null, name: null, laps: 5, length: 3.4, get total() { return this.laps * this.length; } },
        observers: [], lastUpdateTimes: {}, periodicCheckIntervalId: null, isUpdating: false,
        customUIContainer: null, originalLeaderboard: null,
        settingsPopupInstance: null, advancedStatsPanelInstance: null, historyPanelInstance: null, infoPanelInstance: null, downloadPopupInstance: null,
        trackNameMap: null, carBaseStatsMap: null, currentRaceClass: null,
        isInitialized: false, isRaceViewActive: false, raceFinished: false, currentRaceId: null,
        controlsContainer: null,
        lastKnownSkill: null, lastKnownClass: null, lastKnownPoints: null, historyLog: [], historyCheckIntervalId: null, isFetchingPoints: false,
        activeCharts: [],
        finalRaceData: [],

        resetRaceState() {
            document.querySelectorAll('.driver-telemetry-display').forEach(el => {
                if (el._animationRAF) cancelAnimationFrame(el._animationRAF);
                el._animationRAF = null;
                el._currentAnimSpeed = undefined;
                el._currentAnimAcc = undefined;
            });

            this.previousMetrics = {};
            this.lastUpdateTimes = {};
            if (this.periodicCheckIntervalId) clearInterval(this.periodicCheckIntervalId);
            this.periodicCheckIntervalId = null;
            document.querySelectorAll('.custom-driver-item[data-stats-loaded]').forEach(el => {
                el.removeAttribute('data-stats-loaded');
                el.querySelectorAll('.api-stat').forEach(span => span.textContent = '...');
                el.querySelector('.api-stats-container')?.classList.remove('error', 'loaded', 'no-key');
            });
            this.destroyActiveCharts();
            this.raceFinished = false;
            this.finalRaceData = [];
            this.currentRaceId = null;
            UI.updateControlButtonsVisibility();
        },
        clearPopupsAndFullReset() {
            this.resetRaceState();
            this.settingsPopupInstance?.remove(); this.settingsPopupInstance = null;
            this.advancedStatsPanelInstance?.remove(); this.advancedStatsPanelInstance = null;
            this.historyPanelInstance?.remove(); this.historyPanelInstance = null;
            this.infoPanelInstance?.remove(); this.infoPanelInstance = null;
            this.downloadPopupInstance?.remove(); this.downloadPopupInstance = null;
            this.trackInfo = { id: null, name: null, laps: 5, length: 3.4, get total() { return this.laps * this.length; } };
            this.currentRaceClass = null;
            this.trackNameMap = null;
            this.carBaseStatsMap = null;
            this.isInitialized = false;
            this.controlsContainer = null;
            this.customUIContainer = null;
            if (this.historyCheckIntervalId) clearInterval(this.historyCheckIntervalId);
            this.historyCheckIntervalId = null;
            this.lastKnownSkill = null;
            this.lastKnownClass = null;
            this.lastKnownPoints = null;
            this.historyLog = [];
            this.isFetchingPoints = false;
            this.destroyActiveCharts();
            this.raceFinished = false;
            this.finalRaceData = [];
            this.currentRaceId = null;
        },
        destroyActiveCharts() {
            this.activeCharts.forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    try { chart.destroy(); } catch (e) {}
                }
            });
            this.activeCharts = [];
        }
    };

    GM_addStyle(`
        :root { --text-color: #e0e0e0; --background-dark: #1a1a1a; --background-light: #2a2a2a; --border-color: #404040; --accent-color: #64B5F6; --primary-color: #4CAF50; --telemetry-default-color: rgb(136, 136, 136); --telemetry-accel-color: rgb(76, 175, 80); --telemetry-decel-color: rgb(244, 67, 54); --details-bg: #2f2f2f; --self-highlight-bg: #2a3a2a; --self-highlight-border: #4CAF50; --api-loading-color: #aaa; --api-error-color: #ff8a80; --api-info-color: #64B5F6; --table-header-bg: #333; --table-row-alt-bg: #222; --history-color: #FFC107; --danger-color: #f44336; --danger-hover-color: #d32f2f; --info-color: #2196F3; --download-color: #9C27B0;}
        #custom-driver-list-container { display: none; }
        #drivers-scrollbar { display: block !important; }
        #telemetryControlsContainer { display: flex; }
        body.hide-original-leaderboard #drivers-scrollbar { display: none !important; }
        body.hide-original-leaderboard #custom-driver-list-container { display: block; }
        #custom-driver-list-container { margin-top: 10px; border: 1px solid var(--border-color); border-radius: 5px; background-color: var(--background-dark); color: var(--text-color); padding: 0; max-height: 450px; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: #555 var(--background-dark); position: relative; }
        #custom-driver-list-container::-webkit-scrollbar { width: 8px; } #custom-driver-list-container::-webkit-scrollbar-track { background: var(--background-dark); border-radius: 4px; } #custom-driver-list-container::-webkit-scrollbar-thumb { background-color: #555; border-radius: 4px; border: 2px solid var(--background-dark); }
        .custom-driver-item { display: flex; padding: 6px 8px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background-color 0.2s ease; position: relative; flex-direction: column; align-items: stretch; }
        .driver-info-row { display: flex; align-items: center; width: 100%; }
        .custom-driver-item:last-child { border-bottom: none; } .custom-driver-item:hover { background-color: var(--background-light); } .custom-driver-item.is-self { background-color: var(--self-highlight-bg); border-left: 3px solid var(--self-highlight-border); padding-left: 5px; } .custom-driver-item.is-self:hover { background-color: #3a4a3a; }
        .driver-color-indicator { width: 10px; height: 20px; margin-right: 8px; border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: bold; line-height: 1; overflow: hidden; text-shadow: 0 0 2px rgba(0,0,0,0.7); }
        .driver-car-img { width: 38px; height: 19px; margin-right: 8px; object-fit: contain; flex-shrink: 0; } .driver-name { flex-grow: 1; font-weight: bold; margin-right: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 100px; } .driver-name .self-tag { color: #90EE90; font-weight: normal; margin-left: 4px; }
        .driver-telemetry-display { font-size: 0.85em; color: var(--telemetry-default-color); margin-left: auto; flex-shrink: 0; padding: 2px 6px; background: rgba(0,0,0,0.2); border-radius: 3px; white-space: nowrap; min-width: 70px; text-align: right; transition: color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease; opacity: 1; }
        .driver-telemetry-display .lap-estimate { font-size: 0.9em; opacity: 0.7; margin-left: 4px; } body.telemetry-hidden .driver-telemetry-display { opacity: 0; pointer-events: none; min-width: 0; padding: 0; }
        .driver-details { width: 100%; background-color: var(--details-bg); margin-top: 6px; padding: 0 10px; box-sizing: border-box; max-height: 0; opacity: 0; overflow: hidden; border-radius: 4px; color: #bbb; font-size: 0.9em; transition: max-height 0.4s ease-out, opacity 0.3s ease-in, padding-top 0.4s ease-out, padding-bottom 0.4s ease-out, margin-top 0.4s ease-out; }
        .driver-details p { margin: 5px 0; line-height: 1.4; } .driver-details strong { color: #ddd; } .driver-details a { color: var(--accent-color); text-decoration: none; } .driver-details a:hover { text-decoration: underline; } .custom-driver-item.details-visible .driver-details { max-height: 350px; opacity: 1; padding-top: 8px; padding-bottom: 8px; margin-top: 6px; }
        .api-stats-container { border-top: 1px dashed var(--border-color); margin-top: 8px; padding-top: 8px; } .api-stats-container.loading .api-stat { color: var(--api-loading-color); font-style: italic; } .api-stats-container.error .api-stat-error-msg, .api-stats-container.no-key .api-stat-error-msg { color: var(--api-error-color); display: block; font-style: italic; } .api-stats-container.no-key .api-stat-error-msg { color: var(--api-info-color); } .api-stat-error-msg { display: none; } .api-stats-container p { margin: 3px 0; } .api-stat { font-weight: bold; color: var(--text-color); }
        #telemetryControlsContainer { margin: 10px 0 5px 0; justify-content: flex-end; gap: 5px; }
        .telemetry-download-button, .telemetry-info-button, .telemetry-history-button, .telemetry-stats-button, .telemetry-settings-button { background: var(--background-light); color: var(--text-color); border: 1px solid var(--border-color); padding: 6px 12px; text-align: center; cursor: pointer; transition: all 0.2s ease; font-size: 13px; border-radius: 4px; display: inline-block; }
        .telemetry-info-button:hover, .telemetry-history-button:hover, .telemetry-stats-button:hover, .telemetry-settings-button:hover, .telemetry-download-button:hover { background-color: var(--accent-color); color: var(--background-dark); }
        .telemetry-history-button:hover { background-color: var(--history-color); color: var(--background-dark); }
        .telemetry-info-button:hover { background-color: var(--info-color); color: var(--background-dark); }
        .telemetry-download-button:hover { background-color: var(--download-color); color: white; }
        .telemetry-download-button { display: none; }
        .settings-popup, .stats-panel, .history-panel, .info-panel, .download-popup { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(3px); }
        .stats-panel, .history-panel, .info-panel, .download-popup { z-index: 1010; scrollbar-width: thin; scrollbar-color: #555 var(--background-dark); }
        .settings-popup-content, .stats-panel-content, .history-panel-content, .info-panel-content, .download-popup-content { background: var(--background-dark); border-radius: 10px; border: 1px solid var(--border-color); width: 90%; max-height: 90vh; overflow-y: auto; padding: 20px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3); }
        .settings-popup-content { max-width: 500px; }
        .stats-panel-content { max-width: 800px; }
        .history-panel-content { max-width: 750px; }
        .info-panel-content { max-width: 600px; }
        .download-popup-content { max-width: 450px; }
        .settings-title, .stats-title, .history-title, .info-title, .download-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .settings-title { color: var(--primary-color); }
        .stats-title { color: var(--accent-color); }
        .history-title { color: var(--history-color); }
        .info-title { color: var(--info-color); }
        .download-title { color: var(--download-color); }
        .settings-close, .stats-close, .history-close, .info-close, .download-close { background: var(--background-light); color: var(--text-color); border: none; border-radius: 4px; padding: 8px 15px; cursor: pointer; transition: all 0.2s ease; }
        .settings-close:hover, .stats-close:hover, .history-close:hover, .info-close:hover, .download-close:hover { background: var(--accent-color); color: var(--background-dark); }
        .history-panel .panel-actions { display: flex; justify-content: flex-end; margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color); }
        .history-clear-button { background: var(--danger-color); color: white; border: none; border-radius: 4px; padding: 8px 15px; cursor: pointer; transition: background-color 0.2s ease; font-size: 0.9em; }
        .history-clear-button:hover { background: var(--danger-hover-color); }
        .settings-content, .stats-content, .history-content, .info-content, .download-content { padding-top: 10px; }
        .stats-content, .history-content, .info-content, .download-content { font-size: 0.9em; }
        .download-content .download-options { display: flex; flex-direction: column; gap: 15px; }
        .download-content .format-group, .download-content .action-group { display: flex; align-items: center; gap: 10px; }
        .download-content label { font-weight: bold; min-width: 60px; }
        .download-content select { padding: 8px; background: var(--background-light); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); flex-grow: 1;}
        .download-content button { background: var(--background-light); color: var(--text-color); border: 1px solid var(--border-color); padding: 8px 15px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; }
        .download-content button:hover { background: var(--accent-color); color: var(--background-dark); }
        .download-content button.primary { background: var(--download-color); color: white; }
        .download-content button.primary:hover { background: #7B1FA2; }
        .info-content h3 { color: var(--primary-color); margin-top: 20px; margin-bottom: 10px; font-size: 1.1em;}
        .info-content p, .info-content ul { margin-bottom: 10px; line-height: 1.5; color: var(--text-color); }
        .info-content ul { list-style: disc; padding-left: 25px; }
        .info-content li { margin-bottom: 5px; }
        .info-content a { color: var(--accent-color); } .info-content a:hover { text-decoration: underline; }
        .stats-content h3, .history-content h3 { color: var(--primary-color); margin-top: 20px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px dashed var(--border-color); font-size: 1.2em; }
        .stats-content h3:first-child, .history-content h3:first-child { margin-top: 0; }
        .stats-content h4 { color: var(--accent-color); margin-top: 15px; margin-bottom: 8px; font-size: 1.1em; }
        .stats-content p { margin: 5px 0 10px 0; line-height: 1.5; color: #ccc; } .stats-content strong { color: var(--text-color); } .stats-content .loading-msg, .stats-content .error-msg, .stats-content .info-msg { padding: 10px; border-radius: 4px; margin: 15px 0; text-align: center; } .stats-content .loading-msg { background-color: rgba(170, 170, 170, 0.2); color: var(--api-loading-color); } .stats-content .error-msg { background-color: rgba(255, 138, 128, 0.2); color: var(--api-error-color); } .stats-content .info-msg { background-color: rgba(100, 181, 246, 0.2); color: var(--api-info-color); } .stats-content table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 0.95em; } .stats-content th, .stats-content td { border: 1px solid var(--border-color); padding: 6px 8px; text-align: left; } .stats-content th { background-color: var(--table-header-bg); font-weight: bold; color: var(--text-color); } .stats-content tr:nth-child(even) { background-color: var(--table-row-alt-bg); } .stats-content td.numeric, .stats-content th.numeric { text-align: right; } .stats-content .stat-label { color: #bbb; } .stats-content .stat-value { font-weight: bold; color: var(--text-color); } .stats-content .car-stats-inline { font-size: 0.8em; color: #aaa; } .stats-content .car-stats-inline strong { color: #bbb; } .stats-content .user-car-highlight { background-color: rgba(76, 175, 80, 0.15); } .stats-content a { color: var(--accent-color); text-decoration: none; } .stats-content a:hover { text-decoration: underline; }
        .stats-content td { color: var(--text-color); padding: 2px !important; }
        .stats-chart-container, .history-chart-container { margin: 20px 0; padding: 10px; border: 1px solid var(--border-color); border-radius: 5px; background-color: var(--background-light); min-height: 250px; position: relative;}
        .history-content table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.95em; }
        .history-content th, .history-content td { border: 1px solid var(--border-color); padding: 5px 8px; text-align: left; color: var(--text-color); }
        .history-content th { background-color: var(--table-header-bg); font-weight: bold; }
        .history-content tr:nth-child(even) { background-color: var(--table-row-alt-bg); }
        .history-content td.numeric, .history-content th.numeric { text-align: right; }
        .history-content .no-history-msg { padding: 15px; text-align: center; color: #aaa; font-style: italic; }
        .history-content .change-indicator { margin-left: 5px; font-weight: bold; font-size: 0.9em; }
        .history-content .change-positive { color: #81C784; }
        .history-content .change-negative { color: #E57373; }
        .history-content .change-neutral { color: #90A4AE; }
        .settings-item { margin-bottom: 15px; display: flex; flex-direction: column; }
        .settings-item label:not(.switch) { margin-bottom: 8px; color: var(--text-color); font-weight: bold; display: block; }
        .settings-item .telemetry-options-group { display: flex; flex-direction: column; gap: 10px; margin-top: 5px; border: 1px solid var(--border-color); border-radius: 4px; padding: 10px; background: var(--background-light);}
        .settings-item .telemetry-options-group .toggle-container { margin-bottom: 0; }
        .settings-item select, .settings-item input[type=number], .settings-item input[type=text], .settings-item input[type=password] { padding: 8px; background: var(--background-light); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); width: 100%; box-sizing: border-box; }
        .settings-item input[type=password] { font-family: monospace; }
        .toggle-container { padding: 0; display: flex; align-items: center; justify-content: space-between; background: none; border: none; } .toggle-container label:first-child { margin-bottom: 0; } .settings-buttons { display: flex; justify-content: space-between; margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--border-color); gap: 10px; flex-wrap: wrap; } .settings-btn { padding: 10px 15px; border-radius: 4px; border: none; cursor: pointer; background: var(--background-light); color: var(--text-color); transition: all 0.2s ease; flex-grow: 1; } .settings-btn:hover { background: var(--accent-color); color: var(--background-dark); } .settings-btn.primary { background: var(--primary-color); color: white; } .settings-btn.primary:hover { background: #388E3C; } .settings-btn.danger { background-color: var(--danger-color); color: white; } .settings-btn.danger:hover { background-color: var(--danger-hover-color); } .settings-data-buttons { display: flex; gap: 10px; width: 100%; margin-top: 10px; } .switch { position: relative; display: inline-block; width: 45px; height: 24px; flex-shrink: 0;} .switch input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4d4d4d; transition: .3s; border-radius: 12px; } .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 2px; background-color: #f4f4f4; transition: .3s; border-radius: 50%; } input:checked + .slider { background-color: var(--primary-color); } input:checked + .slider:before { transform: translateX(21px); }
        .api-tos-container { margin-top: 10px; margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px; font-size: 0.85em; color: #ccc; line-height: 1.4; border: 1px solid var(--border-color); }
        .api-tos-container p { margin: 0 0 8px 0; }
        .api-tos-container details { margin-top: 10px; }
        .api-tos-container summary { cursor: pointer; font-weight: bold; color: var(--text-color); }
        .api-tos-container table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.95em; }
        .api-tos-container th, .api-tos-container td { border: 1px solid var(--border-color); padding: 5px; text-align: left; vertical-align: top; }
        .api-tos-container th { background-color: var(--table-header-bg); }
        .api-tos-container td { color: var(--text-color); }
        .api-tos-container code { background: var(--background-light); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        .color-1 { background-color: #DC143C; } .color-2 { background-color: #4682B4; } .color-3 { background-color: #32CD32; } .color-4 { background-color: #FFD700; } .color-5 { background-color: #FF8C00; } .color-6 { background-color: #9932CC; } .color-7 { background-color: #00CED1; } .color-8 { background-color: #FF1493; } .color-9 { background-color: #8B4513; } .color-10 { background-color: #7FFF00; } .color-11 { background-color: #00FA9A; } .color-12 { background-color: #D2691E; } .color-13 { background-color: #6495ED; } .color-14 { background-color: #F08080; } .color-15 { background-color: #20B2AA; } .color-16 { background-color: #B0C4DE; } .color-17 { background-color: #DA70D6; } .color-18 { background-color: #FF6347; } .color-19 { background-color: #40E0D0; } .color-20 { background-color: #C71585; } .color-21 { background-color: #6A5ACD; } .color-22 { background-color: #FA8072; } .color-default { background-color: #666; }
        @media (max-width: 768px) { .custom-driver-item { padding: 5px; } .driver-info-row { margin-bottom: 4px; } .driver-name { min-width: 80px; } .driver-telemetry-display { font-size: 0.8em; min-width: 60px; margin-left: 5px; padding: 1px 4px;} .driver-details { font-size: 0.85em; } #custom-driver-list-container { max-height: 350px; } .telemetry-download-button, .telemetry-info-button, .telemetry-history-button, .telemetry-stats-button, .telemetry-settings-button { font-size: 12px; padding: 5px 10px; } .settings-popup-content, .stats-panel-content, .history-panel-content, .info-panel-content, .download-popup-content { width: 95%; padding: 15px; } .settings-title, .stats-title, .history-title, .info-title, .download-title { font-size: 18px; } .settings-btn { padding: 8px 12px; font-size: 14px; } .custom-driver-item.details-visible .driver-details { max-height: 320px; } .stats-content table { font-size: 0.9em; } .stats-content th, .stats-content td { padding: 4px 6px; } .history-content table { font-size: 0.9em; } .history-content th, .history-content td { padding: 4px 6px; } }
        @media (max-width: 480px) { .driver-name { min-width: 60px; } .driver-telemetry-display { min-width: 55px; font-size: 0.75em; } .stats-content table { font-size: 0.85em; } .stats-content th, .stats-content td { padding: 3px 4px; } .history-content table { font-size: 0.85em; } .history-content th, .history-content td { padding: 3px 4px; } .settings-buttons { flex-direction: column; } .settings-data-buttons { flex-direction: column; } }
    `);

    const Utils = {
        convertSpeed(speed, unit) { return unit === 'kmh' ? speed * 1.60934 : speed; },
        formatTime(seconds, showMs = false) { if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '--:--' + (showMs ? '.---' : ''); const min = Math.floor(seconds / 60); const sec = Math.floor(seconds % 60); const ms = showMs ? '.' + (seconds % 1).toFixed(3).substring(2) : ''; return `${min}:${sec < 10 ? '0' : ''}${sec}${ms}`; },
        formatDate(timestamp, includeTime = false) {
            if (!timestamp || timestamp <= 0) return 'N/A';
            try {
                const date = new Date(timestamp);
                const dateString = date.toISOString().split('T')[0];
                if (includeTime) {
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                    return `${dateString} ${timeString}`;
                }
                return dateString;
            } catch (e) {
                return 'N/A';
            }
        },
        isApiKeyAvailable() {
            const apiKey = Config.get('apiKey');
            if (!apiKey) return false;
            if (apiKey.trim() !== '###PDA-APIKEY###') return true;
            return isPDA;
        },
        parseTime(timeString) { if (!timeString?.includes(':')) return 0; const parts = timeString.split(':'); if (parts.length === 2) { return (parseInt(parts[0], 10) || 0) * 60 + (parseFloat(parts[1]) || 0); } return 0; },
        parseProgress(text) { const match = text?.match(/(\d+\.?\d*)%/); return match ? parseFloat(match[1]) : 0; },
        makeAbsoluteUrl(url) { if (!url || url.startsWith('http') || url.startsWith('data:')) return url; if (url.startsWith('//')) return `${window.location.protocol}${url}`; if (url.startsWith('/')) return `${window.location.protocol}//${window.location.host}${url}`; const base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')); return `${window.location.protocol}//${window.location.host}${base}/${url}`; },
        showNotification(message, type = 'info') { const notif = document.createElement('div'); notif.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'}; color: white; padding: 12px 20px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 9999; font-size: 14px; opacity: 0; transition: opacity 0.3s ease-in-out;`; notif.textContent = message; document.body.appendChild(notif); setTimeout(() => notif.style.opacity = '1', 10); setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 300); }, 3000); },
        createChart(ctx, config) {
             if (!ctx || typeof Chart === 'undefined') return null;
             try {
                 Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
                 const chart = new Chart(ctx, config);
                 State.activeCharts.push(chart);
                 return chart;
             } catch(e) {
                return null;
             }
         },
         escapeCSVField(field) {
            if (field === null || field === undefined) {
                return '';
            }
            const stringField = String(field);
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        }
    };

    const Telemetry = {
        easeInOutQuad(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; },
        interpolateColor(color1, color2, factor) { const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c))); return `rgb(${result[0]}, ${result[1]}, ${result[2]})`; },
        getTelemetryColor(acceleration) { const grey = [136, 136, 136]; const green = [76, 175, 80]; const red = [244, 67, 54]; const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--telemetry-default-color').match(/\d+/g)?.map(Number) || grey; const accelColor = getComputedStyle(document.documentElement).getPropertyValue('--telemetry-accel-color').match(/\d+/g)?.map(Number) || green; const decelColor = getComputedStyle(document.documentElement).getPropertyValue('--telemetry-decel-color').match(/\d+/g)?.map(Number) || red; if (!Config.get('colorCode')) return `rgb(${defaultColor.join(', ')})`; const maxAcc = 1.0; let factor = Math.min(Math.abs(acceleration) / maxAcc, 1); factor = isNaN(factor) ? 0 : factor; if (acceleration > 0.05) return this.interpolateColor(defaultColor, accelColor, factor); if (acceleration < -0.05) return this.interpolateColor(defaultColor, decelColor, factor); return `rgb(${defaultColor.join(', ')})`; },
        ema(current, prev, alpha) {
            if (prev === null || typeof prev === 'undefined' || !isFinite(prev)) return current;
            return alpha * current + (1 - alpha) * prev;
        },
        calculateDriverMetrics(driverId, progressPercentage, timestamp) {
            const prev = State.previousMetrics[driverId] || {
                progress: 0, time: timestamp - Config.get('minUpdateInterval'),
                lastProgressValueAtChange: 0, lastProgressChangeTimestamp: timestamp - Config.get('minUpdateInterval'),
                reportedSpeed: 0, acceleration: 0, lastDisplayedSpeed: 0, lastDisplayedAcceleration: 0,
                firstUpdate: true, currentLap: 1, progressInLap: 0,
                rawLapEstimate: null, smoothedLapEstimate: null, statusClass: 'ready',
                raceStartTime: timestamp, totalTimeElapsed: 0, totalDistanceTraveled: 0, wasStale: false
            };

            const minDt = Config.get('minUpdateInterval') / 1000;
            const dtSinceLastUpdate = (timestamp - prev.time) / 1000;
            const staleThresholdMs = 1500;

            if (prev.firstUpdate) {
                const totalLaps = State.trackInfo.laps || 1;
                const percentPerLap = 100 / totalLaps;
                const currentLap = Math.min(totalLaps, Math.floor(progressPercentage / percentPerLap) + 1);
                const startPercentOfLap = (currentLap - 1) * percentPerLap;
                const progressInLap = percentPerLap > 0 ? Math.max(0, Math.min(100, ((progressPercentage - startPercentOfLap) / percentPerLap) * 100)) : 0;

                State.previousMetrics[driverId] = {
                    ...prev, progress: progressPercentage, time: timestamp,
                    lastProgressValueAtChange: progressPercentage, lastProgressChangeTimestamp: timestamp,
                    reportedSpeed: 0, acceleration: 0, lastDisplayedSpeed: 0, lastDisplayedAcceleration: 0,
                    firstUpdate: false, currentLap: currentLap, progressInLap: progressInLap,
                    raceStartTime: timestamp, wasStale: false
                };
                return { speed: 0, acceleration: 0, timeDelta: dtSinceLastUpdate * 1000, noUpdate: true };
            }

            // REVISED: Stale data handling. If no update for a while, decay speed.
            if (dtSinceLastUpdate * 1000 > staleThresholdMs) {
                const decayFactor = 0.85;
                const decayedSpeed = prev.reportedSpeed * decayFactor;
                const gentleDeceleration = -0.5;
                prev.time = timestamp;
                prev.reportedSpeed = decayedSpeed;
                prev.acceleration = this.ema(gentleDeceleration, prev.acceleration, 0.1);
                prev.wasStale = true;
                return { speed: prev.reportedSpeed, acceleration: prev.acceleration, timeDelta: dtSinceLastUpdate * 1000, noUpdate: false };
            }

            if (dtSinceLastUpdate < minDt) {
                 return { speed: prev.reportedSpeed, acceleration: prev.acceleration, timeDelta: dtSinceLastUpdate * 1000, noUpdate: true };
            }

            let currentSpeed = prev.reportedSpeed;
            let calculatedSpeedThisTick = false;
            const epsilon = 0.001;
            const progressChanged = Math.abs(progressPercentage - prev.lastProgressValueAtChange) > epsilon;
            let distanceDelta = 0;

            if (progressChanged) {
                 const dtSinceChange = (timestamp - prev.lastProgressChangeTimestamp) / 1000;
                 const progressDeltaSinceChange = progressPercentage - prev.lastProgressValueAtChange;

                 if (dtSinceChange > 0 && progressDeltaSinceChange > 0) {
                    distanceDelta = State.trackInfo.total * (progressDeltaSinceChange / 100);
                    const rawSpeedMph = (distanceDelta / dtSinceChange) * 3600;

                    // REVISED: Use explicit EMA with faster catch-up after stale period
                    let speedAlpha = 1.0 - Config.get('speedSmoothingFactor');
                    if (prev.wasStale) speedAlpha = Math.min(0.9, speedAlpha * 2);
                    currentSpeed = this.ema(rawSpeedMph, prev.reportedSpeed, speedAlpha);

                    calculatedSpeedThisTick = true;
                    prev.lastProgressValueAtChange = progressPercentage;
                    prev.lastProgressChangeTimestamp = timestamp;
                 } else {
                    currentSpeed = prev.reportedSpeed * Math.max(0.1, 1.0 - (dtSinceChange * 0.5));
                 }
            }

            currentSpeed = Math.max(0, currentSpeed);
            const speedDeltaMps = (currentSpeed - prev.reportedSpeed) * 0.44704;
            const rawAcceleration = (dtSinceLastUpdate <= 0) ? 0 : (speedDeltaMps / dtSinceLastUpdate) / 9.81;

            // REVISED: Dual-stage smoothing. Apply a separate, gentle EMA to acceleration.
            const accelAlpha = 0.25; // More smoothing for acceleration
            let smoothedAcceleration = this.ema(rawAcceleration, prev.acceleration, accelAlpha);
            smoothedAcceleration = Math.max(-3.0, Math.min(3.0, smoothedAcceleration)); // Clamp to realistic values

            const totalLaps = State.trackInfo.laps || 1;
            const percentPerLap = 100 / totalLaps;
            const currentLap = Math.min(totalLaps, Math.floor(progressPercentage / percentPerLap) + 1);
            const startPercentOfLap = (currentLap - 1) * percentPerLap;
            const progressInLap = percentPerLap > 0 ? Math.max(0, Math.min(100, ((progressPercentage - startPercentOfLap) / percentPerLap) * 100)) : 0;

            const totalTimeElapsed = (timestamp - prev.raceStartTime) / 1000;
            const totalDistanceTraveled = (prev.totalDistanceTraveled || 0) + distanceDelta;

            State.previousMetrics[driverId] = {
                 ...prev,
                 progress: progressPercentage, time: timestamp,
                 reportedSpeed: currentSpeed, acceleration: smoothedAcceleration,
                 lastDisplayedSpeed: currentSpeed, lastDisplayedAcceleration: smoothedAcceleration,
                 currentLap, progressInLap,
                 totalTimeElapsed, totalDistanceTraveled,
                 wasStale: false
            };

            return {
                speed: currentSpeed, acceleration: smoothedAcceleration,
                timeDelta: dtSinceLastUpdate * 1000, noUpdate: !calculatedSpeedThisTick
            };
        },
        calculateSmoothedLapEstimate(driverId, metrics) {
            const driverState = State.previousMetrics[driverId];
            if (!driverState || (driverState.totalTimeElapsed || 0) < 5) return null;

            // REVISED: Use average race speed for a more stable prediction base
            let baseSpeed = metrics.speed;
            if (driverState.totalTimeElapsed > 0 && driverState.totalDistanceTraveled > 0) {
                const avgRaceSpeed = (driverState.totalDistanceTraveled / driverState.totalTimeElapsed) * 3600;
                if (avgRaceSpeed > 10) baseSpeed = avgRaceSpeed; // Use average if it's plausible
            }
            if (baseSpeed <= 1) return null;

            const lapLength = State.trackInfo.length || 0;
            if (lapLength <= 0) return null;

            const remainingProgressInLap = 100 - driverState.progressInLap;
            const remainingDistance = lapLength * (remainingProgressInLap / 100);
            const rawEstimate = (remainingDistance / baseSpeed) * 3600;
            driverState.rawLapEstimate = rawEstimate;

            const alpha = Config.get('lapEstimateSmoothingFactor');
            let smoothedEstimate = this.ema(rawEstimate, driverState.smoothedLapEstimate, alpha);

            if (smoothedEstimate > 3600 || smoothedEstimate < 0 || !isFinite(smoothedEstimate)) {
                smoothedEstimate = driverState.smoothedLapEstimate ?? rawEstimate;
            }

            driverState.smoothedLapEstimate = smoothedEstimate;
            return smoothedEstimate;
        },
        animateTelemetry(element, fromSpeed, toSpeed, fromAcc, toAcc, duration, displayMode, speedUnit, extraText) {
            let startTime = null;
            const easeFunction = this.easeInOutQuad;
            const getColor = this.getTelemetryColor.bind(this);

            fromSpeed = Number(fromSpeed) || 0;
            toSpeed = Number(toSpeed) || 0;
            fromAcc = Number(fromAcc) || 0;
            toAcc = Number(toAcc) || 0;
            duration = Math.max(Config.get('minUpdateInterval'), Math.min(Number(duration) || Config.get('minUpdateInterval'), Config.get('maxAnimationDurationMs')));

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                let linearProgress = Math.min((timestamp - startTime) / duration, 1);
                if (isNaN(linearProgress) || duration <= 0) linearProgress = 1;

                let progress = easeFunction(linearProgress);
                let currentSpeed = fromSpeed + (toSpeed - fromSpeed) * progress;
                let currentAcc = fromAcc + (toAcc - fromAcc) * progress;
                element._currentAnimSpeed = currentSpeed;
                element._currentAnimAcc = currentAcc;

                let color = Config.get('colorCode') ? getColor(currentAcc) : 'var(--telemetry-default-color)';
                let text = '';

                if (displayMode === 'speed') { text = `${Math.round(currentSpeed)} ${speedUnit}`; }
                else if (displayMode === 'acceleration') { text = `${currentAcc.toFixed(1)} g`; }
                else if (displayMode === 'both') { text = `${Math.round(currentSpeed)} ${speedUnit} | ${currentAcc.toFixed(1)} g`; }

                element.innerHTML = text + extraText;
                element.style.color = color;

                if (linearProgress < 1) {
                    element._animationRAF = requestAnimationFrame(step);
                } else {
                    element._animationRAF = null;
                    let finalSpeedText = `${Math.round(toSpeed)} ${speedUnit}`;
                    let finalAccelText = `${toAcc.toFixed(1)} g`;
                    let finalText = '';
                    if (displayMode === 'speed') { finalText = finalSpeedText; }
                    else if (displayMode === 'acceleration') { finalText = finalAccelText; }
                    else if (displayMode === 'both') { finalText = `${finalSpeedText} | ${finalAccelText}`; }
                    element.innerHTML = finalText + extraText;
                    element.style.color = Config.get('colorCode') ? getColor(toAcc) : 'var(--telemetry-default-color)';
                    element._currentAnimSpeed = undefined;
                    element._currentAnimAcc = undefined;
                }
            }

            if (element._animationRAF) {
                cancelAnimationFrame(element._animationRAF);
            }
            element._animationRAF = requestAnimationFrame(step);
        },
    };

    const UI = {
        createSettingsPopup() {
            if (State.settingsPopupInstance) State.settingsPopupInstance.remove();
            const popup = document.createElement('div');
            popup.className = 'settings-popup';
            const content = document.createElement('div');
            content.className = 'settings-popup-content';

            const displayOptions = Config.get('telemetryDisplayOptions');

            content.innerHTML = `
                <div class="settings-title">Telemetry & UI Settings <button class="settings-close">×</button></div>
                <div class="settings-content">
                    <div class="settings-item"> <div class="toggle-container"> <label for="historyEnabled">Enable History Panel & Logging</label> <label class="switch"> <input type="checkbox" id="historyEnabled"> <span class="slider"></span> </label> </div> </div>
                    <div class="settings-item"> <div class="toggle-container"> <label for="statsPanelEnabled">Enable Stats Panel</label> <label class="switch"> <input type="checkbox" id="statsPanelEnabled"> <span class="slider"></span> </label> </div> </div>
                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
                    <div class="settings-item">
                         <label>Telemetry Display Options:</label>
                         <div class="telemetry-options-group">
                            <div class="toggle-container"> <label for="telemetryShowSpeed">Show Speed</label> <label class="switch"> <input type="checkbox" id="telemetryShowSpeed"> <span class="slider"></span> </label> </div>
                            <div class="toggle-container"> <label for="telemetryShowAcceleration">Show Acceleration</label> <label class="switch"> <input type="checkbox" id="telemetryShowAcceleration"> <span class="slider"></span> </label> </div>
                            <div class="toggle-container"> <label for="telemetryShowProgress">Show Progress %</label> <label class="switch"> <input type="checkbox" id="telemetryShowProgress"> <span class="slider"></span> </label> </div>
                         </div>
                    </div>
                    <div class="settings-item"> <label for="speedUnit">Speed Unit</label> <select id="speedUnit"> <option value="mph">mph</option> <option value="kmh">km/h</option> </select> </div>
                    <div class="settings-item"> <div class="toggle-container"> <label for="colorCode">Color Code Telemetry (by Accel)</label> <label class="switch"> <input type="checkbox" id="colorCode"> <span class="slider"></span> </label> </div> </div>
                    <div class="settings-item"> <div class="toggle-container"> <label for="animateChanges">Animate Changes (Simple Cases)</label> <label class="switch"> <input type="checkbox" id="animateChanges"> <span class="slider"></span> </label> </div> <small style="color: #aaa; margin-top: 5px;">Animation only applies if just Speed, just Accel, or only Speed & Accel are shown. Uses capped duration.</small></div>
                    <div class="settings-item"> <label for="speedSmoothingFactor">Speed Smoothing Factor (0.1-0.9)</label> <input type="number" id="speedSmoothingFactor" min="0.1" max="0.9" step="0.1"> <small style="color: #aaa; margin-top: 5px;">Weight of *previous* speed vs. new calculation (higher = smoother). Default: ${Config.defaults.speedSmoothingFactor}</small></div>
                    <div class="settings-item"> <label for="maxAnimationDurationMs">Max Animation Duration (ms)</label> <input type="number" id="maxAnimationDurationMs" min="100" max="3000" step="100"> <small style="color: #aaa; margin-top: 5px;">Caps animation time for large update gaps. Default: ${Config.defaults.maxAnimationDurationMs}</small></div>
                    <div class="settings-item"> <div class="toggle-container"> <label for="showLapEstimate">Show Est. Lap Time</label> <label class="switch"> <input type="checkbox" id="showLapEstimate"> <span class="slider"></span> </label> </div> </div>
                    <div class="settings-item"> <label for="lapEstimateSmoothingFactor">Lap Est. Smoothing (0.01-1.0)</label> <input type="number" id="lapEstimateSmoothingFactor" min="0.01" max="1.0" step="0.01"> </div>
                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
                    <div class="settings-item"> <div class="toggle-container"> <label for="fetchApiStatsOnClick">Load Driver API Stats on Click</label> <label class="switch"> <input type="checkbox" id="fetchApiStatsOnClick"> <span class="slider"></span> </label> </div> <small style="color: #aaa; margin-top: 5px;">(Requires API key)</small> </div>
                    <div class="api-tos-container">
                        <p><strong>API Key Usage (ToS):</strong> This script stores your key and data locally in your browser only. It is never shared. Please expand the details below for full compliance information.</p>
                        <details>
                            <summary>View API Usage Details (Torn ToS)</summary>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data Storage</th>
                                        <th>Data Sharing</th>
                                        <th>Purpose of Use</th>
                                        <th>Key Storage & Sharing</th>
                                        <th>Key Access Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Only locally</td>
                                        <td>Nobody</td>
                                        <td>Non-malicious statistical analysis</td>
                                        <td>Stored locally / Not shared</td>
                                        <td>Custom selections: <code>user (personalstats, races)</code>, <code>racing (tracks, cars, records)</code>. A 'Limited Access' key is sufficient.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </details>
                    </div>
                    <div class="settings-item"> <label for="apiKey">Torn API Key (Limited Access Recommended)</label> <input type="password" id="apiKey" placeholder="Enter API Key or use '###PDA-APIKEY###' in Torn PDA"> </div>
                    <div class="settings-item"> <label for="historicalRaceLimit">Advanced Stats: Races to Analyze</label> <input type="number" id="historicalRaceLimit" min="10" max="1000" step="10"> </div>
                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
                    <div class="settings-item"> <label for="historyCheckInterval">History: Check Interval (ms)</label> <input type="number" id="historyCheckInterval" min="5000" max="60000" step="1000"> </div>
                    <div class="settings-item"> <label for="historyLogLimit">History: Max Log Entries</label> <input type="number" id="historyLogLimit" min="5" max="50" step="1"> </div>
                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
                    <div class="settings-item"> <div class="toggle-container"> <label for="hideOriginalList">Hide Torn's Leaderboard</label> <label class="switch"> <input type="checkbox" id="hideOriginalList"> <span class="slider"></span> </label> </div> </div>
                    <div class="settings-buttons">
                         <button class="settings-btn toggle-telemetry-btn">Toggle Telemetry</button>
                         <button class="settings-btn primary" id="saveSettings">Save & Close</button>
                    </div>
                    <div class="settings-data-buttons">
                         <button class="settings-btn danger" id="clearData">Clear Script Data</button>
                         <button class="settings-btn danger" id="clearApiKey">Clear API Key</button>
                    </div>
                </div>`;

            content.querySelector('#historyEnabled').checked = Config.get('historyEnabled');
            content.querySelector('#statsPanelEnabled').checked = Config.get('statsPanelEnabled');
            content.querySelector('#telemetryShowSpeed').checked = displayOptions.includes('speed');
            content.querySelector('#telemetryShowAcceleration').checked = displayOptions.includes('acceleration');
            content.querySelector('#telemetryShowProgress').checked = displayOptions.includes('progress');
            content.querySelector('#speedUnit').value = Config.get('speedUnit');
            content.querySelector('#colorCode').checked = Config.get('colorCode');
            content.querySelector('#animateChanges').checked = Config.get('animateChanges');
            content.querySelector('#speedSmoothingFactor').value = Config.get('speedSmoothingFactor');
            content.querySelector('#maxAnimationDurationMs').value = Config.get('maxAnimationDurationMs');
            content.querySelector('#showLapEstimate').checked = Config.get('showLapEstimate');
            content.querySelector('#lapEstimateSmoothingFactor').value = Config.get('lapEstimateSmoothingFactor');
            content.querySelector('#fetchApiStatsOnClick').checked = Config.get('fetchApiStatsOnClick');
            content.querySelector('#historicalRaceLimit').value = Config.get('historicalRaceLimit');
            content.querySelector('#historyCheckInterval').value = Config.get('historyCheckInterval');
            content.querySelector('#historyLogLimit').value = Config.get('historyLogLimit');
            content.querySelector('#hideOriginalList').checked = Config.get('hideOriginalList');
            content.querySelector('.toggle-telemetry-btn').textContent = Config.get('telemetryVisible') ? 'Hide Telemetry' : 'Show Telemetry';

            const apiKeyInput = content.querySelector('#apiKey');
            apiKeyInput.value = Config.get('apiKey');
            if (isPDA && apiKeyInput.value.trim() === '###PDA-APIKEY###') {
                apiKeyInput.disabled = true;
                const pdaNote = document.createElement('small');
                pdaNote.style.cssText = 'color: var(--api-info-color); margin-top: 5px; display: block;';
                pdaNote.textContent = 'Using Torn PDA managed API key. To change, edit in Torn PDA settings.';
                apiKeyInput.parentNode.insertBefore(pdaNote, apiKeyInput.nextSibling);
            }


            const closePopup = () => { popup.remove(); State.settingsPopupInstance = null; };
            content.querySelector('.settings-close').addEventListener('click', closePopup);
            popup.addEventListener('click', (e) => { if (e.target === popup) closePopup(); });
            content.querySelector('.toggle-telemetry-btn').addEventListener('click', (e) => { const newState = !Config.get('telemetryVisible'); Config.set('telemetryVisible', newState); document.body.classList.toggle('telemetry-hidden', !newState); e.target.textContent = newState ? 'Hide Telemetry' : 'Show Telemetry'; Utils.showNotification(`Telemetry display ${newState ? 'shown' : 'hidden'}.`); });
            content.querySelector('#hideOriginalList').addEventListener('change', (e) => { const hide = e.target.checked; Config.set('hideOriginalList', hide); document.body.classList.toggle('hide-original-leaderboard', hide); if (!hide) { RaceManager.stableUpdateCustomList(); }});

            content.querySelector('#saveSettings').addEventListener('click', () => {
                const historyWasEnabled = Config.get('historyEnabled');

                const selectedOptions = [];
                if (content.querySelector('#telemetryShowSpeed').checked) selectedOptions.push('speed');
                if (content.querySelector('#telemetryShowAcceleration').checked) selectedOptions.push('acceleration');
                if (content.querySelector('#telemetryShowProgress').checked) selectedOptions.push('progress');
                Config.set('telemetryDisplayOptions', selectedOptions);

                Config.set('historyEnabled', content.querySelector('#historyEnabled').checked);
                Config.set('statsPanelEnabled', content.querySelector('#statsPanelEnabled').checked);
                Config.set('speedUnit', content.querySelector('#speedUnit').value);
                Config.set('colorCode', content.querySelector('#colorCode').checked);
                Config.set('animateChanges', content.querySelector('#animateChanges').checked);
                let speedSmooth = parseFloat(content.querySelector('#speedSmoothingFactor').value);
                if (isNaN(speedSmooth) || speedSmooth < 0.1 || speedSmooth > 0.9) { speedSmooth = Config.defaults.speedSmoothingFactor; content.querySelector('#speedSmoothingFactor').value = speedSmooth; Utils.showNotification('Invalid Speed Smoothing Factor, reset to default.', 'error'); }
                Config.set('speedSmoothingFactor', speedSmooth);
                let animDuration = parseInt(content.querySelector('#maxAnimationDurationMs').value, 10);
                if (isNaN(animDuration) || animDuration < 100 || animDuration > 3000) { animDuration = Config.defaults.maxAnimationDurationMs; content.querySelector('#maxAnimationDurationMs').value = animDuration; Utils.showNotification('Invalid Max Animation Duration, reset to default.', 'error'); }
                Config.set('maxAnimationDurationMs', animDuration);
                Config.set('showLapEstimate', content.querySelector('#showLapEstimate').checked);
                Config.set('fetchApiStatsOnClick', content.querySelector('#fetchApiStatsOnClick').checked);
                const apiKeyInputFromUser = content.querySelector('#apiKey').value.trim();
                if (apiKeyInputFromUser.length > 0 && apiKeyInputFromUser.length < 16 && apiKeyInputFromUser !== '###PDA-APIKEY###') { Utils.showNotification('API Key seems too short.', 'error'); } else { Config.set('apiKey', apiKeyInputFromUser); }
                let lapSmoothFactor = parseFloat(content.querySelector('#lapEstimateSmoothingFactor').value);
                if (isNaN(lapSmoothFactor) || lapSmoothFactor < 0.01 || lapSmoothFactor > 1.0) { lapSmoothFactor = Config.defaults.lapEstimateSmoothingFactor; content.querySelector('#lapEstimateSmoothingFactor').value = lapSmoothFactor; Utils.showNotification('Invalid Lap Est. Smoothing Factor, reset to default.', 'error'); }
                Config.set('lapEstimateSmoothingFactor', lapSmoothFactor);
                let raceLimit = parseInt(content.querySelector('#historicalRaceLimit').value, 10);
                if (isNaN(raceLimit) || raceLimit < 10 || raceLimit > 1000) { raceLimit = Config.defaults.historicalRaceLimit; content.querySelector('#historicalRaceLimit').value = raceLimit; Utils.showNotification('Invalid Race Limit, reset to default.', 'error'); }
                Config.set('historicalRaceLimit', raceLimit);
                let histInterval = parseInt(content.querySelector('#historyCheckInterval').value, 10);
                if (isNaN(histInterval) || histInterval < 5000 || histInterval > 60000) { histInterval = Config.defaults.historyCheckInterval; content.querySelector('#historyCheckInterval').value = histInterval; Utils.showNotification('Invalid History Interval, reset to default.', 'error'); }
                Config.set('historyCheckInterval', histInterval);
                let histLimit = parseInt(content.querySelector('#historyLogLimit').value, 10);
                if (isNaN(histLimit) || histLimit < 5 || histLimit > 50) { histLimit = Config.defaults.historyLogLimit; content.querySelector('#historyLogLimit').value = histLimit; Utils.showNotification('Invalid History Limit, reset to default.', 'error'); }
                Config.set('historyLogLimit', histLimit);
                Utils.showNotification('Settings saved!', 'success');
                closePopup();
                UI.updateControlButtonsVisibility();
                if (Config.get('historyEnabled')) {
                    HistoryManager.restartCheckInterval();
                } else if (historyWasEnabled) {
                    if(State.historyCheckIntervalId) clearInterval(State.historyCheckIntervalId);
                    State.historyCheckIntervalId = null;
                }
                RaceManager.stableUpdateCustomList();
            });

            content.querySelector('#clearData').addEventListener('click', () => {
                 if (confirm('Are you sure you want to clear all script settings (except API key) and history data? This cannot be undone.')) {
                     Config.clearData();
                     Utils.showNotification('Script data cleared!', 'success');
                     closePopup();
                     UI.updateControlButtonsVisibility();
                     RaceManager.stableUpdateCustomList();
                     HistoryManager.restartCheckInterval();
                 }
             });

             content.querySelector('#clearApiKey').addEventListener('click', () => {
                  if (confirm('Are you sure you want to clear your API key? You will need to re-enter it to use API features.')) {
                      Config.clearApiKey();
                      content.querySelector('#apiKey').value = '';
                      Utils.showNotification('API Key cleared!', 'success');
                  }
              });

            popup.appendChild(content);
            document.body.appendChild(popup);
            State.settingsPopupInstance = popup;
        },
        async createAdvancedStatsPanel() {
            if (!Config.get('statsPanelEnabled')) return;
            if (State.advancedStatsPanelInstance) State.advancedStatsPanelInstance.remove();
            State.destroyActiveCharts();
            const popup = document.createElement('div');
            popup.className = 'stats-panel';
            const content = document.createElement('div');
            content.className = 'stats-panel-content';
            const statsContentDiv = document.createElement('div');
            statsContentDiv.className = 'stats-content';
            statsContentDiv.innerHTML = `<div class="loading-msg">Loading advanced stats...</div>`;
            content.innerHTML = `<div class="stats-title">Advanced Race Statistics <button class="stats-close">×</button></div>`;
            content.appendChild(statsContentDiv);
            const closePanel = () => { popup.remove(); State.advancedStatsPanelInstance = null; State.destroyActiveCharts(); };
            content.querySelector('.stats-close').addEventListener('click', closePanel);
            popup.addEventListener('click', (e) => { if (e.target === popup) closePanel(); });
            popup.appendChild(content);
            document.body.appendChild(popup);
            State.advancedStatsPanelInstance = popup;

            let errorMessages = [];
            let historicalStatsHTML = '';
            let trackAnalysisHTML = '';
            let processedData = null;
            let trackRecords = null;
            let topCarsData = null;

            try {
                if (!Utils.isApiKeyAvailable()) throw new Error("API Key not configured in Settings.");
                const apiKey = Config.get('apiKey');
                if (!State.userId) throw new Error("User ID not found.");

                if (!State.trackNameMap) {
                    try { State.trackNameMap = await APIManager.fetchTrackData(apiKey); }
                    catch (e) { errorMessages.push(`Could not fetch track names: ${e.message}`); State.trackNameMap = {}; }
                }
                if (!State.carBaseStatsMap) {
                     try { State.carBaseStatsMap = await APIManager.fetchCarBaseStats(apiKey); }
                     catch (e) { errorMessages.push(`Could not fetch car base stats: ${e.message}`); State.carBaseStatsMap = {}; }
                 }

                await RaceManager.updateTrackAndClassInfo();
                const currentTrackId = State.trackInfo.id;
                const currentTrackName = State.trackInfo.name || `Track ${currentTrackId || 'Unknown'}`;
                const currentRaceClass = State.currentRaceClass;
                let currentUserCar = null;
                try { currentUserCar = this.parseCurrentUserCarStats(); } catch (e) {}

                let historicalRaces = null;
                const promises = [APIManager.fetchHistoricalRaceData(apiKey, State.userId, Config.get('historicalRaceLimit'))];
                if (currentTrackId && currentRaceClass) {
                    promises.push(APIManager.fetchTrackRecords(apiKey, currentTrackId, currentRaceClass));
                } else {
                    promises.push(Promise.resolve(null));
                    if (!currentTrackId) errorMessages.push("Could not identify the current track.");
                    if (!currentRaceClass) errorMessages.push("Could not identify the race class from page banner.");
                }

                const [histResult, recordResult] = await Promise.allSettled(promises);

                if (histResult.status === 'fulfilled') {
                    historicalRaces = histResult.value;
                    processedData = StatsCalculator.processRaceData(historicalRaces, State.userId);
                    historicalStatsHTML = this.buildHistoricalStatsHTML(processedData);
                } else {
                    errorMessages.push(`Could not fetch historical races: ${histResult.reason.message}`);
                    historicalStatsHTML = `<p class="info-msg">Historical race data could not be loaded.</p>`;
                }

                if (recordResult.status === 'fulfilled' && recordResult.value !== null) {
                    trackRecords = recordResult.value;
                    topCarsData = StatsCalculator.processTrackRecords(trackRecords);
                } else if (recordResult.status === 'rejected') {
                    if (!recordResult.reason.message?.includes('404')) {
                         errorMessages.push(`Could not fetch track records: ${recordResult.reason.message}`);
                    } else {
                        trackRecords = [];
                        topCarsData = [];
                    }
                }

                if (currentTrackId && currentRaceClass) {
                    trackAnalysisHTML = this.buildTrackAnalysisHTML(trackRecords, currentUserCar, currentTrackName, currentRaceClass, topCarsData);
                } else {
                    trackAnalysisHTML = `<p class="info-msg">Track analysis requires knowing the track and race class.</p>`;
                }

            } catch (error) {
                errorMessages.push(`An unexpected error occurred: ${error.message}`);
                if (!historicalStatsHTML) historicalStatsHTML = `<p class="error-msg">Failed to load historical data.</p>`;
                if (!trackAnalysisHTML) trackAnalysisHTML = `<p class="error-msg">Failed to load track analysis data.</p>`;
            } finally {
                let finalHTML = '';
                if (errorMessages.length > 0) {
                    finalHTML += `<div class="error-msg"><strong>Encountered issues:</strong><br>${errorMessages.join('<br>')}</div>`;
                }
                finalHTML += historicalStatsHTML;
                finalHTML += trackAnalysisHTML;
                statsContentDiv.innerHTML = finalHTML;

                if (typeof Chart !== 'undefined') {
                    this.renderStatsCharts(processedData, topCarsData);
                } else {
                     statsContentDiv.querySelectorAll('.stats-chart-container').forEach(el => el.innerHTML = '<p class="info-msg">Charting library not loaded.</p>');
                }
            }
        },
        buildHistoricalStatsHTML(processedData) {
            if (!processedData || processedData.totalRaces === 0) {
                return `<h3>Your Recent Performance</h3><p class="info-msg">No recent official race data found to analyze.</p>`;
            }
            const overall = processedData.overall;
            const trackStats = Object.values(processedData.trackStats).sort((a, b) => b.races - a.races);
            const carStats = Object.values(processedData.carStats).sort((a, b) => b.races - a.races);

            let html = `<h3>Your Recent Performance</h3>`;
            html += `<p>Analyzed <strong>${overall.races}</strong> official races from ${Utils.formatDate(processedData.firstRaceTime)} to ${Utils.formatDate(processedData.lastRaceTime)}.</p>`;
            html += `<p><span class="stat-label">Avg Position:</span> <span class="stat-value">${overall.avgPosition.toFixed(2)}</span> | <span class="stat-label">Win Rate:</span> <span class="stat-value">${overall.winRate.toFixed(1)}%</span> | <span class="stat-label">Podium Rate:</span> <span class="stat-value">${overall.podiumRate.toFixed(1)}%</span> | <span class="stat-label">Crash Rate:</span> <span class="stat-value">${overall.crashRate.toFixed(1)}%</span></p>`;

            html += `<h4>Performance by Track</h4>`;
            if (trackStats.length > 0) {
                 html += `<div class="stats-chart-container"><canvas id="trackPerformanceChart"></canvas></div>`;
                 html += `<table><thead><tr><th>Track</th><th class="numeric">Races</th><th class="numeric">Avg Pos</th><th class="numeric">Win %</th><th class="numeric">Podium %</th><th class="numeric">Crash %</th><th class="numeric">Best Lap</th></tr></thead><tbody>`;
                 trackStats.forEach(t => {
                     html += `<tr><td>${t.name}</td><td class="numeric">${t.races}</td><td class="numeric">${t.avgPosition.toFixed(2)}</td><td class="numeric">${t.winRate.toFixed(1)}</td><td class="numeric">${t.podiumRate.toFixed(1)}</td><td class="numeric">${t.crashRate.toFixed(1)}</td><td class="numeric">${t.bestLap === Infinity ? '-' : t.bestLap.toFixed(2)}s</td></tr>`;
                 });
                 html += `</tbody></table>`;
            } else { html += `<p>No track-specific data.</p>`; }

            html += `<h4>Performance by Car</h4>`;
            if (carStats.length > 0) {
                 html += `<div class="stats-chart-container"><canvas id="carPerformanceChart"></canvas></div>`;
                 html += `<table><thead><tr><th>Car</th><th class="numeric">Races</th><th class="numeric">Avg Pos</th><th class="numeric">Win %</th><th class="numeric">Podium %</th><th class="numeric">Crash %</th></tr></thead><tbody>`;
                 carStats.forEach(c => {
                     html += `<tr><td>${c.name}</td><td class="numeric">${c.races}</td><td class="numeric">${c.avgPosition.toFixed(2)}</td><td class="numeric">${c.winRate.toFixed(1)}</td><td class="numeric">${c.podiumRate.toFixed(1)}</td><td class="numeric">${c.crashRate.toFixed(1)}</td></tr>`;
                 });
                 html += `</tbody></table>`;
            } else { html += `<p>No car-specific data.</p>`; }

            return html;
        },
        buildTrackAnalysisHTML(trackRecords, currentUserCar, trackName, raceClass, topCarsData) {
            let html = `<h3>Track Analysis: ${trackName} (Class ${raceClass || 'Unknown'})</h3>`;
            html += `<h4>Your Current Car</h4>`;
            if (currentUserCar && currentUserCar.stats) {
                 html += `<p><strong>${currentUserCar.name}</strong> (ID: ${currentUserCar.id})</p><p class="car-stats-inline">`;
                 const statOrder = ["Top Speed", "Acceleration", "Handling", "Braking", "Dirt", "Tarmac", "Safety"];
                 html += statOrder.map(statName => { const value = currentUserCar.stats[statName]; return value !== undefined ? `<strong>${statName}:</strong> ${value}` : null; }).filter(s => s !== null).join(' | ');
                 html += `</p>`;
            } else if (currentUserCar) { html += `<p><strong>${currentUserCar.name}</strong> (ID: ${currentUserCar.id}) - <i>Stats could not be parsed.</i></p>`; }
            else { html += `<p class="info-msg">Could not identify your currently selected car.</p>`; }

            html += `<h4>Track Records (Top 5)</h4>`;
            if (trackRecords && trackRecords.length > 0) {
                 html += `<table><thead><tr><th class="numeric">#</th><th class="numeric">Lap Time</th><th>Car</th><th>Driver</th></tr></thead><tbody>`;
                 trackRecords.slice(0, 5).forEach((rec, index) => {
                     const isUserCar = currentUserCar && rec.car_item_id === currentUserCar.id;
                     html += `<tr ${isUserCar ? 'class="user-car-highlight"' : ''}><td class="numeric">${index + 1}</td><td class="numeric">${rec.lap_time.toFixed(2)}s</td><td>${rec.car_item_name} ${isUserCar ? '(Your Car)' : ''}</td><td><a href="/profiles.php?XID=${rec.driver_id}" target="_blank" rel="noopener noreferrer">${rec.driver_name} [${rec.driver_id}]</a></td></tr>`;
                 });
                 html += `</tbody></table>`;
                 html += `<h4>Top Performing Cars Analysis</h4>`;
                 if (topCarsData && topCarsData.length > 0) {
                    html += `<div class="stats-chart-container"><canvas id="topCarsChart"></canvas></div>`;
                    html += `<table><thead><tr><th>Car</th><th class="numeric">Times in Top ${trackRecords.length}</th><th>Key Stats</th></tr></thead><tbody>`;
                    topCarsData.slice(0, 5).forEach(carData => {
                        const baseStats = State.carBaseStatsMap?.[carData.car_item_id];
                        let statsString = '<i>Base stats unavailable</i>';
                        if (baseStats) { statsString = `<strong>Spd:</strong> ${baseStats.top_speed}, <strong>Acc:</strong> ${baseStats.acceleration}, <strong>Hnd:</strong> ${baseStats.handling}, <strong>Brk:</strong> ${baseStats.braking}, <strong>Drt:</strong> ${baseStats.dirt}`; }
                        const isUserCar = currentUserCar && carData.car_item_id === currentUserCar.id;
                        html += `<tr ${isUserCar ? 'class="user-car-highlight"' : ''}><td>${carData.car_item_name} ${isUserCar ? '(Your Car)' : ''}</td><td class="numeric">${carData.count}</td><td><span class="car-stats-inline">${statsString}</span></td></tr>`;
                    });
                    html += `</tbody></table>`;
                 } else { html += `<p>Could not analyze top performing cars.</p>`; }
            } else if (trackRecords) { html += `<p class="info-msg">No records found for this track/class.</p>`; }
            else { html += `<p class="error-msg">Track records could not be loaded.</p>`; }
            return html;
        },
        renderStatsCharts(processedData, topCarsData) {
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
            const gridColor = 'rgba(255, 255, 255, 0.1)';
            const chartOptionsBase = {
                 responsive: true, maintainAspectRatio: false,
                 plugins: { legend: { labels: { color: textColor } }, tooltip: { mode: 'index', intersect: false } }
             };
            const barColors = ['#64B5F6', '#81C784', '#FFB74D', '#E57373', '#BA68C8', '#FFF176', '#7986CB', '#4DD0E1', '#FF8A65', '#A1887F'];

            if (processedData?.trackStats && Object.keys(processedData.trackStats).length > 0) {
                 const ctxTrack = document.getElementById('trackPerformanceChart')?.getContext('2d');
                 if(ctxTrack) {
                    const trackStats = Object.values(processedData.trackStats).sort((a, b) => b.races - a.races).slice(0, 10);
                    Utils.createChart(ctxTrack, {
                        type: 'bar',
                        data: {
                            labels: trackStats.map(t => t.name.length > 15 ? t.name.substring(0, 12) + '...' : t.name),
                            datasets: [
                                { label: 'Win %', data: trackStats.map(t => t.winRate), backgroundColor: barColors[0], yAxisID: 'yPercent' },
                                { label: 'Podium %', data: trackStats.map(t => t.podiumRate), backgroundColor: barColors[1], yAxisID: 'yPercent' },
                                { label: 'Crash %', data: trackStats.map(t => t.crashRate), backgroundColor: barColors[3], yAxisID: 'yPercent' },
                                { label: 'Races', data: trackStats.map(t => t.races), backgroundColor: barColors[4], yAxisID: 'yRaces' }
                            ]
                        },
                         options: {
                             ...chartOptionsBase,
                             scales: {
                                 x: { ticks: { color: textColor, autoSkip: false, maxRotation: 90, minRotation: 45 }, grid: { color: gridColor }, title: { color: textColor } },
                                 yPercent: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Percentage (%)', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } },
                                 yRaces: { type: 'linear', position: 'right', beginAtZero: true, title: { display: true, text: 'Races', color: textColor }, ticks: { color: textColor, precision: 0 }, grid: { drawOnChartArea: false } }
                             }
                        }
                    });
                 }
             }

             if (processedData?.carStats && Object.keys(processedData.carStats).length > 0) {
                 const ctxCar = document.getElementById('carPerformanceChart')?.getContext('2d');
                  if(ctxCar) {
                    const carStats = Object.values(processedData.carStats).sort((a, b) => b.races - a.races).slice(0, 10);
                    Utils.createChart(ctxCar, {
                        type: 'bar',
                        data: {
                            labels: carStats.map(c => c.name.length > 15 ? c.name.substring(0, 12) + '...' : c.name),
                            datasets: [
                                { label: 'Win %', data: carStats.map(c => c.winRate), backgroundColor: barColors[0], yAxisID: 'yPercent' },
                                { label: 'Podium %', data: carStats.map(c => c.podiumRate), backgroundColor: barColors[1], yAxisID: 'yPercent' },
                                { label: 'Crash %', data: carStats.map(c => c.crashRate), backgroundColor: barColors[3], yAxisID: 'yPercent' },
                                { label: 'Races', data: carStats.map(c => c.races), backgroundColor: barColors[4], yAxisID: 'yRaces' }
                            ]
                        },
                        options: {
                             ...chartOptionsBase,
                             scales: {
                                 x: { ticks: { color: textColor, autoSkip: false, maxRotation: 90, minRotation: 45 }, grid: { color: gridColor }, title: { color: textColor } },
                                 yPercent: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Percentage (%)', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } },
                                 yRaces: { type: 'linear', position: 'right', beginAtZero: true, title: { display: true, text: 'Races', color: textColor }, ticks: { color: textColor, precision: 0 }, grid: { drawOnChartArea: false } }
                             }
                         }
                     });
                  }
             }

             if (topCarsData && topCarsData.length > 0) {
                 const ctxTopCars = document.getElementById('topCarsChart')?.getContext('2d');
                 if(ctxTopCars && typeof trackRecords !== 'undefined') {
                     const topCars = topCarsData.slice(0, 10);
                     Utils.createChart(ctxTopCars, {
                         type: 'bar',
                         data: {
                             labels: topCars.map(c => c.car_item_name.length > 15 ? c.car_item_name.substring(0, 12) + '...' : c.car_item_name),
                             datasets: [{
                                 label: `Times in Top ${trackRecords?.length || '?'} Records`,
                                 data: topCars.map(c => c.count),
                                 backgroundColor: barColors.slice(0, topCars.length)
                             }]
                         },
                         options: {
                            ...chartOptionsBase,
                            indexAxis: 'y',
                            scales: {
                                x: { ticks: { color: textColor, precision: 0 }, grid: { color: gridColor }, title: { color: textColor } },
                                y: { ticks: { color: textColor }, grid: { color: gridColor }, title: { color: textColor } }
                            },
                            plugins: {
                                legend: { display: false },
                                tooltip: { mode: 'index', intersect: false }
                            }
                        }
                     });
                 }
             }
        },
        parseCurrentUserCarStats() { const carDiv = document.querySelector('div.car-selected.left'); if (!carDiv) return null; try { const nameEl = carDiv.querySelector('.model p:first-child'); const imgEl = carDiv.querySelector('.model .img img.torn-item'); const name = nameEl ? nameEl.textContent.trim() : 'Unknown Car'; let id = null; if (imgEl && imgEl.src) { const idMatch = imgEl.src.match(/\/items\/(\d+)\//); if (idMatch) id = parseInt(idMatch[1], 10); } const stats = {}; const statItems = carDiv.querySelectorAll('ul.properties-wrap li'); statItems.forEach(li => { const titleEl = li.querySelector('.title'); const progressBarEl = li.querySelector('.progressbar-wrap'); if (titleEl && progressBarEl && progressBarEl.title) { const statName = titleEl.textContent.trim(); const titleAttr = progressBarEl.title; const valueMatch = titleAttr.match(/^(\d+)\s*\(/); if (valueMatch) { stats[statName] = parseInt(valueMatch[1], 10); } } }); if (Object.keys(stats).length === 0) { return { name, id, stats: null }; } return { name, id, stats }; } catch (e) { return null; } },
        createHistoryPanel() {
            if (!Config.get('historyEnabled')) return;
            if (State.historyPanelInstance) State.historyPanelInstance.remove();
            State.destroyActiveCharts();
            const popup = document.createElement('div');
            popup.className = 'history-panel';
            const content = document.createElement('div');
            content.className = 'history-panel-content';
            const historyContentDiv = document.createElement('div');
            historyContentDiv.className = 'history-content';

            const historyLog = HistoryManager.getLog();
            let chartHTML = '';
            let tableHTML = '';

            if (historyLog.length === 0) {
                historyContentDiv.innerHTML = `<p class="no-history-msg">No historical changes recorded yet.</p>`;
            } else {
                 if (historyLog.length > 1 && typeof Chart !== 'undefined') {
                     chartHTML = `<div class="history-chart-container"><canvas id="historyProgressionChart" style="max-height: 250px;"></canvas></div>`;
                 } else if (historyLog.length <=1) {
                    chartHTML = `<p class="no-history-msg">Need at least two data points for a chart.</p>`;
                 } else {
                    chartHTML = `<p class="no-history-msg">Charting library not loaded.</p>`;
                 }

                const formatChange = (value, change, decimals = 2) => {
                    if (value === null) return 'N/A';
                    const formattedValue = typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : value;
                    if (change === 0 || isNaN(change) || change === null) return formattedValue;
                    const isIncrease = change > 0;
                    const sign = isIncrease ? '+' : '';
                    const changeClass = isIncrease ? 'change-positive' : 'change-negative';
                    const formattedChange = typeof change === 'number' ? change.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : change;
                    return `${formattedValue} <span class="change-indicator ${changeClass}">(${sign}${formattedChange})</span>`;
                };
                const formatClassChange = (currentClass, previousClass) => {
                    if (currentClass === null) return 'N/A';
                    if (!previousClass || currentClass === previousClass || previousClass === null) return currentClass;
                    return `${currentClass} <span class="change-indicator change-neutral">(was ${previousClass})</span>`;
                };

                tableHTML = `<h3>History Log (Last ${historyLog.length})</h3><table><thead><tr><th>Date & Time</th><th class="numeric">Skill</th><th class="numeric">Class</th><th class="numeric">Points</th></tr></thead><tbody>`;

                for (let i = 0; i < historyLog.length; i++) {
                    const entry = historyLog[i];
                    const olderEntry = historyLog[i + 1] || null;
                    let skillChange = null;
                    let pointsChange = null;
                    let previousClass = null;
                    if (olderEntry) {
                        skillChange = (entry.skill !== null && olderEntry.skill !== null) ? (entry.skill - olderEntry.skill) : null;
                        pointsChange = (entry.points !== null && olderEntry.points !== null) ? (entry.points - olderEntry.points) : null;
                        previousClass = olderEntry.class;
                    }
                    tableHTML += `<tr>
                        <td>${Utils.formatDate(entry.timestamp, true)}</td>
                        <td class="numeric">${formatChange(entry.skill, skillChange, 2)}</td>
                        <td class="numeric">${formatClassChange(entry.class, previousClass)}</td>
                        <td class="numeric">${formatChange(entry.points, pointsChange, 0)}</td>
                    </tr>`;
                }
                tableHTML += `</tbody></table>`;
                 historyContentDiv.innerHTML = chartHTML + tableHTML;
            }

            content.innerHTML = `<div class="history-title">Your Racing Stats History <button class="history-close">×</button></div>`;
            content.appendChild(historyContentDiv);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'panel-actions';
            const clearButton = document.createElement('button');
            clearButton.className = 'history-clear-button';
            clearButton.textContent = 'Clear History Log';
            clearButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your entire racing stats history log? This cannot be undone.')) {
                    HistoryManager.clearLog();
                    this.createHistoryPanel();
                    Utils.showNotification('History log cleared!', 'success');
                }
            });
            actionsDiv.appendChild(clearButton);
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export History';
            exportButton.addEventListener('click', () => {
                const format = prompt('Export as (csv/json):') || 'csv';
                let dataStr = format === 'json' ? JSON.stringify(HistoryManager.getLog(), null, 2) :
                              'Timestamp,Skill,Class,Points\n' + HistoryManager.getLog().map(e => `${Utils.formatDate(e.timestamp, true)},${e.skill},${e.class},${e.points}`).join('\n');
                DataExporter.downloadData(dataStr, format, `text/${format}`);
            });
            actionsDiv.appendChild(exportButton);
            content.appendChild(actionsDiv);

            const closePanel = () => { popup.remove(); State.historyPanelInstance = null; State.destroyActiveCharts(); };
            content.querySelector('.history-close').addEventListener('click', closePanel);
            popup.addEventListener('click', (e) => { if (e.target === popup) closePanel(); });

            popup.appendChild(content);
            document.body.appendChild(popup);
            State.historyPanelInstance = popup;

            if (historyLog.length > 1 && typeof Chart !== 'undefined') {
                 this.renderHistoryChart(historyLog);
            }
        },
        renderHistoryChart(historyLog) {
            const ctx = document.getElementById('historyProgressionChart')?.getContext('2d');
            if (!ctx) return;

            const reversedLog = [...historyLog].reverse();
            const labels = reversedLog.map(entry => Utils.formatDate(entry.timestamp, true));
            const skillData = reversedLog.map(entry => entry.skill);
            const pointsData = reversedLog.map(entry => entry.points);
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
            const gridColor = 'rgba(255, 255, 255, 0.1)';

            Utils.createChart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Racing Skill', data: skillData, borderColor: 'var(--primary-color)', backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.1, yAxisID: 'ySkill', spanGaps: true, pointRadius: 2, pointHoverRadius: 4
                        },
                        {
                            label: 'Racing Points', data: pointsData, borderColor: 'var(--history-color)', backgroundColor: 'rgba(255, 193, 7, 0.1)',
                            tension: 0.1, yAxisID: 'yPoints', spanGaps: true, pointRadius: 2, pointHoverRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: { ticks: { color: textColor, maxRotation: 70, minRotation: 45, autoSkip: true, maxTicksLimit: 15 }, grid: { color: gridColor }, title: { color: textColor } },
                        ySkill: { type: 'linear', position: 'left', beginAtZero: false, title: { display: true, text: 'Skill', color: textColor }, ticks: { color: textColor, precision: 2 }, grid: { color: gridColor } },
                        yPoints: { type: 'linear', position: 'right', beginAtZero: false, title: { display: true, text: 'Points', color: textColor }, ticks: { color: textColor, precision: 0 }, grid: { drawOnChartArea: false } }
                    },
                    plugins: { legend: { labels: { color: textColor } }, tooltip: { mode: 'index', intersect: false } }
                }
            });
        },
        createInfoPanel() {
            if (State.infoPanelInstance) State.infoPanelInstance.remove();
            const popup = document.createElement('div');
            popup.className = 'info-panel';
            const content = document.createElement('div');
            content.className = 'info-panel-content';
            let notesHTML = ScriptInfo.notes.map(note => `<li>${note}</li>`).join('');

            content.innerHTML = `
                <div class="info-title">Script Information <button class="info-close">×</button></div>
                <div class="info-content">
                    <h3>Torn Racing Telemetry</h3>
                    <p><strong>Version:</strong> ${ScriptInfo.version}</p>
                    <p><strong>Author:</strong> ${ScriptInfo.author} [<a href="${ScriptInfo.contactUrl()}" target="_blank" rel="noopener noreferrer">${ScriptInfo.contactId}</a>]</p>
                    <p><strong>Description:</strong> ${ScriptInfo.description}</p>
                    <h3>Contact & Support</h3>
                    <p>For suggestions, bug reports, or questions, please contact <a href="${ScriptInfo.contactUrl()}" target="_blank" rel="noopener noreferrer">${ScriptInfo.author} [${ScriptInfo.contactId}]</a> via Torn mail.</p>
                    <h3>Important Notes</h3>
                    <ul>${notesHTML}</ul>
                </div>`;

            const closePanel = () => { popup.remove(); State.infoPanelInstance = null; };
            content.querySelector('.info-close').addEventListener('click', closePanel);
            popup.addEventListener('click', (e) => { if (e.target === popup) closePanel(); });

            popup.appendChild(content);
            document.body.appendChild(popup);
            State.infoPanelInstance = popup;
        },
        createDownloadPopup() {
            if (State.downloadPopupInstance) State.downloadPopupInstance.remove();

            const popup = document.createElement('div');
            popup.className = 'download-popup';
            const content = document.createElement('div');
            content.className = 'download-popup-content';

            content.innerHTML = `
                <div class="download-title">Export Race Results <button class="download-close">×</button></div>
                <div class="download-content">
                    <div class="download-options">
                        <div class="format-group">
                            <label for="downloadFormat">Format:</label>
                            <select id="downloadFormat">
                                <option value="html">HTML Table</option>
                                <option value="md">Markdown Table</option>
                                <option value="csv">CSV (Comma Separated)</option>
                                <option value="txt">Plain Text</option>
                                <option value="json">JSON Data</option>
                            </select>
                        </div>
                         <div class="action-group">
                            <button id="downloadFileBtn" class="primary">💾 Download File</button>
                            <button id="copyClipboardBtn">📋 Copy to Clipboard</button>
                         </div>
                    </div>
                </div>`;

            const closePopup = () => { popup.remove(); State.downloadPopupInstance = null; };
            content.querySelector('.download-close').addEventListener('click', closePopup);
            popup.addEventListener('click', (e) => { if (e.target === popup) closePopup(); });

            const formatSelect = content.querySelector('#downloadFormat');
            const downloadBtn = content.querySelector('#downloadFileBtn');
            const copyBtn = content.querySelector('#copyClipboardBtn');

            const performAction = (actionType) => {
                const format = formatSelect.value;
                let dataString;
                let fileExt;
                let mimeType;

                try {
                    switch(format) {
                        case 'html':
                            dataString = DataExporter.formatAsHTML();
                            fileExt = 'html';
                            mimeType = 'text/html';
                            break;
                        case 'md':
                            dataString = DataExporter.formatAsMarkdown();
                            fileExt = 'md';
                            mimeType = 'text/markdown';
                            break;
                         case 'csv':
                            dataString = DataExporter.formatAsCSV();
                            fileExt = 'csv';
                            mimeType = 'text/csv';
                            break;
                        case 'txt':
                            dataString = DataExporter.formatAsPlainText();
                            fileExt = 'txt';
                            mimeType = 'text/plain';
                            break;
                        case 'json':
                        default:
                            dataString = DataExporter.formatAsJSON();
                            fileExt = 'json';
                            mimeType = 'application/json';
                            break;
                    }

                    if (actionType === 'download') {
                        DataExporter.downloadData(dataString, fileExt, mimeType);
                        Utils.showNotification('File download initiated.', 'success');
                    } else if (actionType === 'copy') {
                        DataExporter.copyToClipboard(dataString);
                        Utils.showNotification('Copied to clipboard!', 'success');
                    }
                     closePopup();
                } catch (e) {
                    Utils.showNotification('Error preparing data: ' + e.message, 'error');
                }
            };

            downloadBtn.addEventListener('click', () => performAction('download'));
            copyBtn.addEventListener('click', () => performAction('copy'));

            popup.appendChild(content);
            document.body.appendChild(popup);
            State.downloadPopupInstance = popup;
        },
        updateControlButtonsVisibility() {
            if (!State.controlsContainer) return;

            const historyBtn = State.controlsContainer.querySelector('.telemetry-history-button');
            const statsBtn = State.controlsContainer.querySelector('.telemetry-stats-button');
            const downloadBtn = State.controlsContainer.querySelector('.telemetry-download-button');

            if (historyBtn) historyBtn.style.display = Config.get('historyEnabled') ? 'inline-block' : 'none';
            if (statsBtn) statsBtn.style.display = Config.get('statsPanelEnabled') ? 'inline-block' : 'none';
            if (downloadBtn) downloadBtn.style.display = State.raceFinished ? 'inline-block' : 'none';
        },
        initializeControls() {
            if (!State.controlsContainer) return;
            State.controlsContainer.innerHTML = '';

             const infoButton = document.createElement('button');
             infoButton.className = 'telemetry-info-button';
             infoButton.textContent = 'ℹ️ Info';
             infoButton.title = 'View Script Information';
             infoButton.addEventListener('click', () => { this.createInfoPanel(); });
             State.controlsContainer.appendChild(infoButton);

             const historyButton = document.createElement('button');
             historyButton.className = 'telemetry-history-button';
             historyButton.textContent = '📜 History';
             historyButton.title = 'View Your Racing Stats History';
             historyButton.style.display = 'none';
             historyButton.addEventListener('click', () => { this.createHistoryPanel(); });
             State.controlsContainer.appendChild(historyButton);

            const statsButton = document.createElement('button');
            statsButton.className = 'telemetry-stats-button';
            statsButton.textContent = '📊 Stats';
            statsButton.title = 'Open Advanced Race Statistics';
            statsButton.style.display = 'none';
            statsButton.addEventListener('click', () => {
                RaceManager.updateTrackAndClassInfo().then(() => { this.createAdvancedStatsPanel(); })
                .catch(e => { Utils.showNotification("Error getting latest track/class info.", "error"); });
            });
            State.controlsContainer.appendChild(statsButton);

             const downloadButton = document.createElement('button');
             downloadButton.className = 'telemetry-download-button';
             downloadButton.textContent = '💾 Export';
             downloadButton.title = 'Export Race Results';
             downloadButton.style.display = 'none';
             downloadButton.addEventListener('click', () => { this.createDownloadPopup(); });
             State.controlsContainer.appendChild(downloadButton);

            const settingsButton = document.createElement('button');
            settingsButton.className = 'telemetry-settings-button';
            settingsButton.textContent = '⚙ Settings';
            settingsButton.title = 'Open Telemetry & UI Settings';
            settingsButton.addEventListener('click', () => { this.createSettingsPopup(); });
            State.controlsContainer.appendChild(settingsButton);

            this.updateControlButtonsVisibility();
            document.body.classList.toggle('telemetry-hidden', !Config.get('telemetryVisible'));
        }
    };

    const APIManager = {
        isFetching: new Set(),
        async fetchWithAuthHeader(url, apiKey, options = {}, retries = 3, baseDelay = 1000) {
            let delay = baseDelay;
            for (let attempt = 0; attempt < retries; attempt++) {
                try {
                    const response = await fetch(url, { ...options, headers: { 'Accept': 'application/json', 'Authorization': 'ApiKey ' + apiKey, ...(options.headers || {}) } });
                    if (!response.ok) {
                        let errorMsg = `API Error (${response.status}): ${response.statusText}`;
                        try {
                            const errorData = await response.json();
                            if (errorData.error?.error) {
                                errorMsg = `API Error: ${errorData.error.error} (Code ${errorData.error.code})`;
                            }
                        } catch (e) {}
                        const error = new Error(errorMsg);
                        error.statusCode = response.status;
                        throw error;
                    }
                    const data = await response.json();
                    if (data.error) {
                        if (data.error.code === 2 && attempt < retries - 1) {
                            await new Promise(res => setTimeout(res, delay));
                            delay *= 2;
                            continue;
                        }
                        throw new Error(`API Error: ${data.error.error} (Code ${data.error.code})`);
                    }
                    return data;
                } catch (error) {
                    if (attempt < retries - 1 && (error.message.includes('Too many requests') || error.message.includes('Code 2') || error.statusCode === 429)) {
                        await new Promise(res => setTimeout(res, delay));
                        delay *= 2;
                        continue;
                    }
                    throw error;
                }
            }
            throw new Error('Max retries reached');
        },
        async fetchAndDisplayRacingStats(driverItem, userId) {
            const detailsDiv = driverItem.querySelector('.driver-details');
            const statsContainer = detailsDiv?.querySelector('.api-stats-container');
            if (!statsContainer || !userId || this.isFetching.has(userId)) return;

            if (!Utils.isApiKeyAvailable()) {
                statsContainer.classList.add('no-key');
                statsContainer.querySelector('.api-stat-error-msg').textContent = 'API key not configured in settings.';
                statsContainer.querySelectorAll('.api-stat').forEach(span => span.textContent = 'N/A');
                driverItem.dataset.statsLoaded = 'true';
                return;
            }

            const apiKey = Config.get('apiKey');
            this.isFetching.add(userId);
            statsContainer.classList.remove('error', 'loaded', 'no-key');
            statsContainer.classList.add('loading');
            statsContainer.querySelector('.api-stat-error-msg').textContent = '';
            statsContainer.querySelectorAll('.api-stat').forEach(span => span.textContent = '...');
            const apiUrl = `https://api.torn.com/v2/user?selections=personalstats&id=${userId}&cat=racing&key=${apiKey}`;
            try { const response = await fetch(apiUrl); if (!response.ok) { let errorMsg = `HTTP error ${response.status}`; try { const errorData = await response.json(); if (errorData.error?.error) errorMsg = `API Error: ${errorData.error.error} (Code ${errorData.error.code})`; } catch (e) {} throw new Error(errorMsg); } const data = await response.json(); if (data.error) throw new Error(`API Error: ${data.error.error} (Code ${data.error.code})`); const racingStats = data?.personalstats?.racing; if (racingStats && typeof racingStats === 'object') { statsContainer.querySelector('.stat-skill').textContent = racingStats.skill?.toLocaleString() ?? 'N/A'; statsContainer.querySelector('.stat-points').textContent = racingStats.points?.toLocaleString() ?? 'N/A'; const racesEntered = racingStats.races?.entered; const racesWon = racingStats.races?.won; statsContainer.querySelector('.stat-races-entered').textContent = racesEntered?.toLocaleString() ?? 'N/A'; statsContainer.querySelector('.stat-races-won').textContent = racesWon?.toLocaleString() ?? 'N/A'; const winRate = (racesEntered && racesWon > 0) ? ((racesWon / racesEntered) * 100).toFixed(1) + '%' : (racesEntered > 0 ? '0.0%' : 'N/A'); statsContainer.querySelector('.stat-win-rate').textContent = winRate; statsContainer.classList.add('loaded'); driverItem.dataset.statsLoaded = 'true'; } else { statsContainer.classList.add('error'); statsContainer.querySelector('.api-stat-error-msg').textContent = 'No racing stats found (or permission denied).'; statsContainer.querySelectorAll('.api-stat').forEach(span => span.textContent = 'N/A'); driverItem.dataset.statsLoaded = 'true'; } } catch (error) { statsContainer.classList.add('error'); statsContainer.querySelector('.api-stat-error-msg').textContent = `Error: ${error.message}`; statsContainer.querySelectorAll('.api-stat').forEach(span => span.textContent = '-'); delete driverItem.dataset.statsLoaded; Utils.showNotification(error.message, 'error'); } finally { statsContainer.classList.remove('loading'); this.isFetching.delete(userId); }
        },
        async fetchUserRacingPoints(apiKey, userId) {
            if (!apiKey || !userId) return null;
            if (this.isFetching.has(`points-${userId}`)) return null;

            this.isFetching.add(`points-${userId}`);
            const apiUrl = `https://api.torn.com/v2/user?selections=personalstats&id=${userId}&cat=racing&key=${apiKey}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    let errorMsg = `HTTP error ${response.status}`;
                    let errorData = null;
                    try { errorData = await response.json(); } catch (e) { }
                    if (errorData && errorData.error?.error) { errorMsg = `API Error: ${errorData.error.error} (Code ${errorData.error.code})`; }
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                if (data.error) { throw new Error(`API Error: ${data.error.error} (Code ${data.error.code})`); }
                const points = data?.personalstats?.racing?.points;
                return typeof points === 'number' ? points : null;
            } catch (error) {
                Utils.showNotification(error.message, 'error');
                return null;
            } finally {
                this.isFetching.delete(`points-${userId}`);
            }
        },
        async fetchTrackData(apiKey) {
            const cached = GM_getValue('tornTrackCache', null);
            if (cached && Date.now() - cached.timestamp < 86400000) return cached.data;
            const data = await this.fetchWithAuthHeader('https://api.torn.com/v2/racing/tracks', apiKey);
            const trackMap = data.tracks ? data.tracks.reduce((map, t) => { map[t.id] = t.title; return map; }, {}) : {};
            GM_setValue('tornTrackCache', { data: trackMap, timestamp: Date.now() });
            return trackMap;
        },
        async fetchCarBaseStats(apiKey) {
            const cached = GM_getValue('tornCarCache', null);
            if (cached && Date.now() - cached.timestamp < 86400000) return cached.data;
            const data = await this.fetchWithAuthHeader('https://api.torn.com/v2/racing/cars', apiKey);
            const carMap = data.cars ? data.cars.reduce((map, c) => { map[c.car_item_id] = c; return map; }, {}) : {};
            GM_setValue('tornCarCache', { data: carMap, timestamp: Date.now() });
            return carMap;
        },
        async fetchHistoricalRaceData(apiKey, userId, limit) { if (!apiKey) throw new Error("API Key required."); if (!userId) throw new Error("User ID required."); limit = Math.max(10, Math.min(1000, limit || 100)); const url = `https://api.torn.com/v2/user/races?key=${apiKey}&id=${userId}&cat=official&sort=DESC&limit=${limit}`; const response = await fetch(url); if (!response.ok) { let errorMsg = `API Error (${response.status}): ${response.statusText}`; try { const errorData = await response.json(); if (errorData.error?.error) errorMsg = `API Error: ${errorData.error.error} (Code ${errorData.error.code})`; } catch (e) {} throw new Error(errorMsg); } const data = await response.json(); if (data.error) { throw new Error(`API Error: ${data.error.error} (Code ${data.error.code})`); } return data.races || []; },
        async fetchTrackRecords(apiKey, trackId, raceClass) { if (!trackId) throw new Error("Track ID required."); if (!raceClass) throw new Error("Race Class required."); const url = `https://api.torn.com/v2/racing/${trackId}/records?cat=${raceClass}`; const data = await this.fetchWithAuthHeader(url, apiKey); return data.records || []; }
    };

    const StatsCalculator = {
        processRaceData(races, userId) {
            if (!races || races.length === 0 || !userId) {
                return {
                    overall: { races: 0, wins: 0, podiums: 0, crashes: 0, positionSum: 0, winRate: 0, podiumRate: 0, crashRate: 0, avgPosition: 0 },
                    trackStats: {},
                    carStats: {},
                    totalRaces: 0,
                    firstRaceTime: null,
                    lastRaceTime: null
                };
            }
            const overall = { races: 0, wins: 0, podiums: 0, crashes: 0, positionSum: 0 };
            const trackStats = {};
            const carStats = {};
            let firstRaceTime = Infinity;
            let lastRaceTime = 0;
            races.forEach(race => {
                if (race.status !== 'finished' || !race.results) return;
                const userResult = race.results.find(r => r.driver_id == userId);
                if (!userResult) return;
                overall.races++;
                const raceTime = race.schedule?.end || 0;
                if (raceTime > 0) {
                    firstRaceTime = Math.min(firstRaceTime, raceTime * 1000);
                    lastRaceTime = Math.max(lastRaceTime, raceTime * 1000);
                }
                const trackId = race.track_id;
                const carName = userResult.car_item_name || 'Unknown Car';
                const trackName = State.trackNameMap?.[trackId] || `Track ${trackId}`;
                if (!trackStats[trackId]) trackStats[trackId] = { name: trackName, races: 0, wins: 0, podiums: 0, crashes: 0, positionSum: 0, bestLap: Infinity };
                if (!carStats[carName]) carStats[carName] = { name: carName, races: 0, wins: 0, podiums: 0, crashes: 0, positionSum: 0 };
                trackStats[trackId].races++;
                carStats[carName].races++;
                if (userResult.has_crashed) {
                    overall.crashes++;
                    trackStats[trackId].crashes++;
                    carStats[carName].crashes++;
                } else {
                    const position = userResult.position;
                    overall.positionSum += position;
                    trackStats[trackId].positionSum += position;
                    carStats[carName].positionSum += position;
                    if (position === 1) {
                        overall.wins++;
                        trackStats[trackId].wins++;
                        carStats[carName].wins++;
                    }
                    if (position <= 3) {
                        overall.podiums++;
                        trackStats[trackId].podiums++;
                        carStats[carName].podiums++;
                    }
                    if (userResult.best_lap_time && userResult.best_lap_time < trackStats[trackId].bestLap) {
                        trackStats[trackId].bestLap = userResult.best_lap_time;
                    }
                }
            });
            const calcRates = (stats) => {
                const finishedRaces = stats.races - stats.crashes;
                stats.winRate = finishedRaces > 0 ? (stats.wins / finishedRaces) * 100 : 0;
                stats.podiumRate = finishedRaces > 0 ? (stats.podiums / finishedRaces) * 100 : 0;
                stats.crashRate = stats.races > 0 ? (stats.crashes / stats.races) * 100 : 0;
                stats.avgPosition = finishedRaces > 0 ? (stats.positionSum / finishedRaces) : 0;
                return stats;
            };
            calcRates(overall);
            Object.values(trackStats).forEach(calcRates);
            Object.values(carStats).forEach(calcRates);
            return { overall, trackStats, carStats, totalRaces: overall.races, firstRaceTime: firstRaceTime === Infinity ? null : firstRaceTime, lastRaceTime: lastRaceTime === 0 ? null : lastRaceTime };
        },
        processTrackRecords(records) { if (!records || records.length === 0) return []; const carCounts = {}; records.forEach(rec => { if (!carCounts[rec.car_item_id]) { carCounts[rec.car_item_id] = { car_item_id: rec.car_item_id, car_item_name: rec.car_item_name, count: 0 }; } carCounts[rec.car_item_id].count++; }); return Object.values(carCounts).sort((a, b) => b.count - a.count); }
    };

    const DataExporter = {
        getFinalData() {
            const raceData = {
                 raceId: State.currentRaceId,
                 trackInfo: { ...State.trackInfo },
                 results: State.finalRaceData.map((driver, index) => ({
                     position: index + 1,
                     name: driver.name,
                     userId: driver.userId,
                     car: driver.carTitle,
                     status: driver.statusClass,
                     finalTimeOrStatus: driver.originalStatusText
                 }))
            };
            return raceData;
        },
        formatAsHTML() {
            const data = this.getFinalData();
            let tableRows = data.results.map(r => `
                <tr>
                    <td>${r.position}</td>
                    <td><a href="https://www.torn.com/profiles.php?XID=${r.userId}" target="_blank">${r.name} [${r.userId}]</a></td>
                    <td>${r.car}</td>
                    <td>${r.status === 'finished' ? r.finalTimeOrStatus : r.status.toUpperCase()}</td>
                </tr>`).join('');

            return `<!DOCTYPE html>
<html>
<head>
<title>Torn Race Results - ${data.trackInfo.name || 'Unknown Track'}</title>
<meta charset="UTF-8">
<style>
    body { font-family: sans-serif; line-height: 1.4; background-color: #f0f0f0; color: #333; margin: 20px; }
    table { border-collapse: collapse; width: 100%; margin-top: 15px; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background-color: #e9e9e9; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    h1, h2 { color: #555; }
</style>
</head>
<body>
    <h1>Race Results</h1>
    <h2>Race ID: ${data.raceId || 'N/A'}</h2>
    <h2>Track: ${data.trackInfo.name || 'Unknown'} (${data.trackInfo.laps} Laps, ${data.trackInfo.length} Miles)</h2>
    <table>
        <thead>
            <tr><th>Pos</th><th>Driver</th><th>Car</th><th>Time/Status</th></tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>
    <p><small>Exported by Torn Racing Telemetry Script v${ScriptInfo.version}</small></p>
</body>
</html>`;
        },
        formatAsMarkdown() {
            const data = this.getFinalData();
            let md = `# Race Results\n\n`;
            md += `**Race ID:** ${data.raceId || 'N/A'}\n`;
            md += `**Track:** ${data.trackInfo.name || 'Unknown'} (${data.trackInfo.laps} Laps, ${data.trackInfo.length} Miles)\n\n`;
            md += `| Pos | Driver | Car | Time/Status |\n`;
            md += `|----:|--------|-----|-------------|\n`;
            data.results.forEach(r => {
                const driverLink = `[${r.name} [${r.userId}]](https://www.torn.com/profiles.php?XID=${r.userId})`;
                const status = r.status === 'finished' ? r.finalTimeOrStatus : r.status.toUpperCase();
                md += `| ${r.position} | ${driverLink} | ${r.car} | ${status} |\n`;
            });
            md += `\n*Exported by Torn Racing Telemetry Script v${ScriptInfo.version}*`;
            return md;
        },
         formatAsCSV() {
            const data = this.getFinalData();
            const esc = Utils.escapeCSVField;
            const header = ["Position", "Driver Name", "Driver ID", "Car Name", "Status", "Final Time/Status"];
            const rows = data.results.map(r => [
                r.position,
                r.name,
                r.userId,
                r.car,
                r.status,
                r.status === 'finished' ? r.finalTimeOrStatus : r.status.toUpperCase()
            ].map(esc).join(','));

            let csvString = `# Torn Race Results\n`;
            csvString += `# Race ID: ${esc(data.raceId || 'N/A')}\n`;
            csvString += `# Track: ${esc(data.trackInfo.name || 'Unknown')} (${data.trackInfo.laps} Laps, ${data.trackInfo.length} Miles)\n`;
            csvString += `# Exported: ${new Date().toISOString()}\n`;
            csvString += `# Script Version: ${ScriptInfo.version}\n`;
            csvString += header.map(esc).join(',') + '\n';
            csvString += rows.join('\n');
            return csvString;
        },
        formatAsPlainText() {
            const data = this.getFinalData();
            let txt = `Torn Race Results\n`;
            txt += `Race ID: ${data.raceId || 'N/A'}\n`;
            txt += `Track: ${data.trackInfo.name || 'Unknown'} (${data.trackInfo.laps} Laps, ${data.trackInfo.length} Miles)\n`;
            txt += `--------------------------------------------------\n`;
            data.results.forEach(r => {
                const status = r.status === 'finished' ? r.finalTimeOrStatus : r.status.toUpperCase();
                txt += `${String(r.position).padStart(3)}. ${r.name} [${r.userId}] (${r.car}) - ${status}\n`;
            });
            txt += `--------------------------------------------------\n`;
            txt += `Exported by Torn Racing Telemetry Script v${ScriptInfo.version}\n`;
            return txt;
        },
        formatAsJSON() {
             const data = this.getFinalData();
             return JSON.stringify(data, null, 2);
        },
        downloadData(dataString, fileExt, mimeType) {
            const blob = new Blob([dataString], { type: mimeType + ';charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const trackNameSafe = (State.trackInfo.name || 'UnknownTrack').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `torn_race_${State.currentRaceId || trackNameSafe}_${timestamp}.${fileExt}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        copyToClipboard(text) {
             if (typeof GM_setClipboard !== 'undefined') {
                 GM_setClipboard(text);
             } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(err => {
                     Utils.showNotification('Failed to copy to clipboard.', 'error');
                 });
             } else {
                Utils.showNotification('Clipboard copy not supported by browser/script manager.', 'error');
             }
        }
    };

    const RaceManager = {
        getRaceId() {
            const firstDriverLi = document.querySelector('#leaderBoard > li[data-id]');
            if (firstDriverLi && firstDriverLi.dataset.id) {
                const parts = firstDriverLi.dataset.id.split('-');
                if (parts.length === 2 && /^\d+$/.test(parts[0])) {
                    return parts[0];
                }
            }
            return null;
        },
        parseDriverData(originalLi) { if (!originalLi || !originalLi.matches('li[id^="lbr-"]')) return null; const nameEl = originalLi.querySelector('.name span'); const carEl = originalLi.querySelector('.car img'); const colorEl = originalLi.querySelector('.color'); const timeEl = originalLi.querySelector('.time'); const statusDiv = originalLi.querySelector('.status-wrap > div'); const dataId = originalLi.dataset.id; const userId = dataId ? dataId.split('-')[1] : null; if (!userId) { return null; } const progressText = timeEl ? timeEl.textContent.trim() : '0%'; const progressPercentage = Utils.parseProgress(progressText); let statusClass = 'unknown'; let isFinished = false; let isCrashed = false; if (statusDiv) { const classList = statusDiv.classList; if (classList.contains('crashed')) { isCrashed = true; statusClass = 'crashed'; } else if (classList.contains('gold') || classList.contains('silver') || classList.contains('bronze') || classList.contains('finished')) { isFinished = true; statusClass = 'finished'; } } if (!isFinished && !isCrashed && timeEl && timeEl.textContent.includes(':')) { isFinished = true; statusClass = 'finished'; } if (!isCrashed && !isFinished) { if (progressPercentage > 0) { statusClass = 'racing'; } else { let raceStarted = false; const anyTimeEl = document.querySelector('#leaderBoard li .time:not(:empty)'); if (anyTimeEl) { raceStarted = true; } statusClass = raceStarted ? 'racing' : 'ready'; } } if (State.previousMetrics[userId]?.statusClass === 'finished' && statusClass !== 'crashed') { statusClass = 'finished'; } return { userId, originalId: originalLi.id, name: nameEl ? nameEl.textContent.trim() : 'N/A', carImgRaw: carEl ? carEl.getAttribute('src') : '', carTitle: carEl ? carEl.title : 'Unknown Car', colorClass: colorEl ? colorEl.className.replace('color', '').trim() : 'color-default', statusClass, originalStatusText: progressText, progress: progressPercentage }; },
        async updateTrackAndClassInfo() {
            let trackInfoUpdated = false;
            let classInfoUpdated = false;
            try {
                const infoElement = document.querySelector('div.track-info');
                const trackHeader = document.querySelector('.drivers-list .title-black');

                if (infoElement && infoElement.title) {
                    const trackNameFromTitle = infoElement.title.trim();
                    const lengthMatch = infoElement.dataset.length?.match(/(\d+\.?\d*)/);
                    const lapsMatch = trackHeader?.textContent.match(/(\d+)\s+laps?/i);
                    const laps = lapsMatch ? parseInt(lapsMatch[1]) : (State.trackInfo.laps || 5);
                    const length = lengthMatch ? parseFloat(lengthMatch[1]) : (State.trackInfo.length || 3.4);
                    let trackId = State.trackInfo.id;
                    let trackName = State.trackInfo.name;

                    if (!trackId || trackNameFromTitle !== trackName) {
                        if (!State.trackNameMap && Utils.isApiKeyAvailable()) {
                            try {
                                const apiKey = Config.get('apiKey');
                                if (apiKey) { State.trackNameMap = await APIManager.fetchTrackData(apiKey); }
                            } catch (e) { State.trackNameMap = {}; }
                        }
                        if (State.trackNameMap) {
                            const foundEntry = Object.entries(State.trackNameMap).find(([id, name]) => name.toLowerCase() === trackNameFromTitle.toLowerCase());
                            if (foundEntry) { trackId = parseInt(foundEntry[0], 10); trackName = foundEntry[1]; }
                            else { trackName = trackNameFromTitle; trackId = null; }
                        } else { trackName = trackNameFromTitle; trackId = null; }
                    }

                    if (trackId !== State.trackInfo.id || laps !== State.trackInfo.laps || Math.abs(length - State.trackInfo.length) > 0.01 || trackName !== State.trackInfo.name) {
                        State.trackInfo = { id: trackId, name: trackName, laps, length, get total() { return this.laps * this.length; } };
                        trackInfoUpdated = true;
                        if (trackId !== State.trackInfo.id || laps !== State.trackInfo.laps || Math.abs(length - State.trackInfo.length) > 0.01) { State.resetRaceState(); }
                    }
                }

                const classElement = document.querySelector('div.banner div.class-letter');
                const detectedClass = classElement ? classElement.textContent.trim().toUpperCase() : null;
                if (detectedClass && detectedClass !== State.currentRaceClass) {
                    State.currentRaceClass = detectedClass;
                    classInfoUpdated = true;
                }

            } catch (e) { console.error("Telemetry Script: Error in updateTrackAndClassInfo:", e); }
            return trackInfoUpdated || classInfoUpdated;
        },
        createDriverElement(driverData, position) { const item = document.createElement('div'); item.className = 'custom-driver-item'; item.dataset.originalId = driverData.originalId; item.dataset.userId = driverData.userId; const isSelf = driverData.userId === State.userId; if (isSelf) item.classList.add('is-self'); item.classList.add(`status-${driverData.statusClass}`); const absoluteCarImgUrl = Utils.makeAbsoluteUrl(driverData.carImgRaw); item.innerHTML = `<div class="driver-info-row"><div class="driver-color-indicator ${driverData.colorClass}"></div><img class="driver-car-img" src="${absoluteCarImgUrl}" alt="${driverData.carTitle}" title="${driverData.carTitle}"><div class="driver-name">${driverData.name}${isSelf ? '<span class="self-tag">(You)</span>' : ''}</div><div class="driver-telemetry-display"></div></div><div class="driver-details"></div>`; this.updateDriverElement(item, driverData, position); return item; },
        updateDriverElement(element, driverData, position) {
            const driverId = driverData.userId;
            const isSelf = driverId === State.userId;
            const now = Date.now();
            const detailsVisible = element.classList.contains('details-visible');
            const driverState = State.previousMetrics[driverId];

            element.className = `custom-driver-item status-${driverData.statusClass} ${isSelf ? 'is-self' : ''} ${detailsVisible ? 'details-visible' : ''}`.trim().replace(/\s+/g, ' ');

            const colorIndicator = element.querySelector('.driver-color-indicator');
            if (colorIndicator) {
                if (!colorIndicator.classList.contains(driverData.colorClass)) { colorIndicator.className = `driver-color-indicator ${driverData.colorClass}`; }
                let indicatorContent = position;
                if (driverData.statusClass === 'finished') { if (position === 1) indicatorContent = '🥇'; else if (position === 2) indicatorContent = '🥈'; else if (position === 3) indicatorContent = '🥉'; }
                else if (driverData.statusClass === 'crashed') { indicatorContent = '💥'; }
                else if (driverData.statusClass === 'ready') { indicatorContent = '-'; }
                colorIndicator.textContent = indicatorContent;
            }

            const carImg = element.querySelector('.driver-car-img');
            const currentCarSrc = carImg ? carImg.getAttribute('src') : '';
            const newCarSrc = Utils.makeAbsoluteUrl(driverData.carImgRaw);
            if (carImg && currentCarSrc !== newCarSrc) { carImg.src = newCarSrc; carImg.alt = driverData.carTitle; carImg.title = driverData.carTitle; }

            const nameDiv = element.querySelector('.driver-name');
            const expectedNameHTML = `${driverData.name}${isSelf ? '<span class="self-tag">(You)</span>' : ''}`;
            if (nameDiv && nameDiv.innerHTML !== expectedNameHTML) { nameDiv.innerHTML = expectedNameHTML; }

            const telemetryDiv = element.querySelector('.driver-telemetry-display');
            if (telemetryDiv) {
                const displayOptions = Config.get('telemetryDisplayOptions') || [];
                const speedUnit = Config.get('speedUnit');
                let extraTelemetryText = '';

                 if (driverData.statusClass === 'crashed' || driverData.statusClass === 'finished' || driverData.statusClass === 'ready') {
                    if (telemetryDiv._animationRAF) {
                         cancelAnimationFrame(telemetryDiv._animationRAF);
                         telemetryDiv._animationRAF = null;
                         telemetryDiv._currentAnimSpeed = undefined;
                         telemetryDiv._currentAnimAcc = undefined;
                    }

                    let telemetryText = '';
                    let telemetryColor = 'var(--telemetry-default-color)';

                    if (driverData.statusClass === 'crashed') {
                        telemetryText = '💥 CRASHED';
                        telemetryColor = 'var(--telemetry-decel-color)';
                    } else if (driverData.statusClass === 'finished') {
                        const finishTime = Utils.parseTime(driverData.originalStatusText);
                        let avgSpeedFormatted = '---';
                        let finishTimeText = driverData.originalStatusText || '--:--';
                        if (finishTime > 0 && State.trackInfo.total > 0) {
                            const avgSpeed = (State.trackInfo.total / finishTime) * 3600;
                            avgSpeedFormatted = `~${Math.round(Utils.convertSpeed(avgSpeed, speedUnit))} ${speedUnit}`;
                        }
                        telemetryText = `🏁 ${finishTimeText} (${avgSpeedFormatted})`;
                    } else {
                         const displayParts = [];
                         if (displayOptions.includes('speed')) displayParts.push(`0 ${speedUnit}`);
                         if (displayOptions.includes('acceleration')) displayParts.push(`0.0 g`);
                         if (displayOptions.includes('progress')) displayParts.push(`${driverData.progress.toFixed(1)}%`);
                         telemetryText = displayParts.length > 0 ? displayParts.join(' | ') : '-';
                    }

                    telemetryDiv.innerHTML = telemetryText;
                    telemetryDiv.style.color = telemetryColor;

                } else {
                    const metrics = Telemetry.calculateDriverMetrics(driverId, driverData.progress, now);
                    const targetSpeed = Utils.convertSpeed(metrics.speed, speedUnit);
                    const targetAcc = metrics.acceleration;

                    if (Config.get('showLapEstimate') && driverData.progress < 100 && State.trackInfo.id && driverState) {
                        const lapEstimateSeconds = Telemetry.calculateSmoothedLapEstimate(driverId, metrics);
                        if (lapEstimateSeconds !== null && isFinite(lapEstimateSeconds) && lapEstimateSeconds > 0) {
                            extraTelemetryText = ` <span class="lap-estimate">(~${Utils.formatTime(lapEstimateSeconds)})</span>`;
                        }
                    }

                    const canAnimate = Config.get('animateChanges') && driverState && !driverState.firstUpdate &&
                                      (displayOptions.includes('speed') || displayOptions.includes('acceleration')) &&
                                      !displayOptions.includes('progress');

                    if (canAnimate) {
                        const fromSpeed = (telemetryDiv._currentAnimSpeed !== undefined) ? telemetryDiv._currentAnimSpeed : Math.round(Utils.convertSpeed(driverState.lastDisplayedSpeed || 0, speedUnit));
                        const fromAcc = (telemetryDiv._currentAnimAcc !== undefined) ? telemetryDiv._currentAnimAcc : driverState.lastDisplayedAcceleration || 0;

                        const animationDuration = Math.min(metrics.timeDelta || Config.get('minUpdateInterval'), Config.get('maxAnimationDurationMs'));

                        let animationMode = '';
                        if (displayOptions.includes('speed') && displayOptions.includes('acceleration')) animationMode = 'both';
                        else if (displayOptions.includes('speed')) animationMode = 'speed';
                        else if (displayOptions.includes('acceleration')) animationMode = 'acceleration';

                        if (animationMode) {
                             Telemetry.animateTelemetry(telemetryDiv, fromSpeed, Math.round(targetSpeed), fromAcc, targetAcc, animationDuration, animationMode, speedUnit, extraTelemetryText);
                        } else {
                            if (telemetryDiv._animationRAF) cancelAnimationFrame(telemetryDiv._animationRAF);
                            telemetryDiv._animationRAF = null;
                            telemetryDiv.innerHTML = `${Math.round(targetSpeed)} ${speedUnit}${extraTelemetryText}`;
                             telemetryDiv.style.color = Config.get('colorCode') ? Telemetry.getTelemetryColor(targetAcc) : 'var(--telemetry-default-color)';
                        }

                    } else {
                         if (telemetryDiv._animationRAF) {
                             cancelAnimationFrame(telemetryDiv._animationRAF);
                             telemetryDiv._animationRAF = null;
                             telemetryDiv._currentAnimSpeed = undefined;
                             telemetryDiv._currentAnimAcc = undefined;
                         }

                        let staticText = '';
                        let staticColor = 'var(--telemetry-default-color)';
                        const parts = [];

                        if (displayOptions.includes('speed')) {
                             parts.push(`${Math.round(targetSpeed)} ${speedUnit}`);
                        }
                        if (displayOptions.includes('acceleration')) {
                            parts.push(`${targetAcc.toFixed(1)} g`);
                            if (Config.get('colorCode')) {
                                staticColor = Telemetry.getTelemetryColor(targetAcc);
                            }
                        }
                         if (displayOptions.includes('progress')) {
                            parts.push(`${driverData.progress.toFixed(1)}%`);
                            if (!displayOptions.includes('acceleration') || !Config.get('colorCode')) {
                                staticColor = 'var(--telemetry-default-color)';
                            }
                         }

                        staticText = parts.join(' | ');
                        if (!staticText) staticText = '-';

                        telemetryDiv.innerHTML = staticText + extraTelemetryText;
                        telemetryDiv.style.color = staticColor;
                    }
                     if (driverState) {
                        driverState.lastDisplayedSpeed = metrics.speed;
                        driverState.lastDisplayedAcceleration = metrics.acceleration;
                     }
                }
            }


            const detailsDiv = element.querySelector('.driver-details');
            if (detailsDiv) {
                const needsHTMLStructure = detailsVisible && !detailsDiv.hasChildNodes();
                if (needsHTMLStructure) {
                    let localInfoHTML = `<p><strong>Position:</strong> <span class="detail-stat detail-position">${driverData.statusClass === 'crashed' ? 'Crashed' : position}</span></p>`;
                    localInfoHTML += `<p><strong>Progress:</strong> <span class="detail-stat detail-progress">${driverData.progress.toFixed(2)}%</span></p>`;
                    localInfoHTML += `<p><strong>Lap:</strong> <span class="detail-stat detail-lap">-/-</span></p>`;
                    localInfoHTML += `<p><strong>Lap Progress:</strong> <span class="detail-stat detail-lap-progress">-%</span></p>`;
                    localInfoHTML += `<p><strong>Speed (Calc MPH):</strong> <span class="detail-stat detail-calc-speed">-</span> mph</p>`;
                    localInfoHTML += `<p><strong>Accel (Calc g):</strong> <span class="detail-stat detail-calc-accel">-</span> g</p>`;
                    localInfoHTML += `<p class="p-est-lap-time" style="display: none;"><strong>Est. Lap Time:</strong> <span class="detail-stat detail-est-lap-time">N/A</span></p>`;
                    const apiStatsHTML = Config.get('fetchApiStatsOnClick') ? `<div class="api-stats-container"><p>Skill: <span class="api-stat stat-skill">...</span></p><p>Points: <span class="api-stat stat-points">...</span></p><p>Races: <span class="api-stat stat-races-entered">...</span> (<span class="api-stat stat-races-won">...</span> Wins)</p><p>Win Rate: <span class="api-stat stat-win-rate">...</span></p><span class="api-stat-error-msg"></span></div>` : '';
                    detailsDiv.innerHTML = `
                        <p><strong>User:</strong> ${driverData.name} [<a href="/profiles.php?XID=${driverId}" target="_blank" rel="noopener noreferrer" title="View Profile">${driverId}</a>] ${isSelf ? '<strong>(You)</strong>':''}</p>
                        <p><strong>Car:</strong> ${driverData.carTitle}</p>
                        <p><strong>Status:</strong> <span style="text-transform: capitalize;" class="detail-status">${driverData.statusClass}</span> <span class="detail-original-status"></span></p>
                        ${localInfoHTML}
                        ${apiStatsHTML}
                        <p><em>Original ID: ${driverData.originalId}</em></p>`;
                    if (Config.get('fetchApiStatsOnClick') && driverId && !element.hasAttribute('data-stats-loaded') && !APIManager.isFetching.has(driverId)) {
                        setTimeout(() => APIManager.fetchAndDisplayRacingStats(element, driverId), 50);
                    }
                }
                if (detailsVisible) {
                    const updateDetailStat = (selector, value, placeholder = '-', isLiveData = true) => { const el = detailsDiv.querySelector(selector); const usePlaceholder = isLiveData && driverData.statusClass !== 'racing'; if (el) el.textContent = usePlaceholder ? placeholder : value; };
                    updateDetailStat('.detail-position', driverData.statusClass === 'crashed' ? 'Crashed' : position, '-', false);
                    updateDetailStat('.detail-progress', `${driverData.progress.toFixed(2)}%`, '0.00%', false);
                    const statusEl = detailsDiv.querySelector('.detail-status'); if (statusEl) statusEl.textContent = driverData.statusClass;
                    const statusSpan = detailsDiv.querySelector('.detail-original-status'); if (statusSpan) { statusSpan.textContent = (driverData.originalStatusText && !['finished', 'crashed'].includes(driverData.statusClass)) ? `(${driverData.originalStatusText})` : ''; }
                    if (driverState || driverData.statusClass !== 'racing') {
                        updateDetailStat('.detail-lap', `${driverState?.currentLap || '-'}/${State.trackInfo.laps || '-'}`, '-/-');
                        updateDetailStat('.detail-lap-progress', `${driverState?.progressInLap !== undefined ? driverState.progressInLap.toFixed(1) : '-'}%`, '-%');
                        updateDetailStat('.detail-calc-speed', `${driverState?.lastDisplayedSpeed !== undefined ? driverState.lastDisplayedSpeed.toFixed(1) : '-'}`, '-');
                        updateDetailStat('.detail-calc-accel', `${driverState?.lastDisplayedAcceleration !== undefined ? driverState.lastDisplayedAcceleration.toFixed(3) : '-'}`, '-');
                        const estLapTimeEl = detailsDiv.querySelector('.detail-est-lap-time'); const estLapParaEl = detailsDiv.querySelector('.p-est-lap-time');
                        if (estLapTimeEl && estLapParaEl) { const isRacing = driverData.statusClass === 'racing'; const estLapVisible = isRacing && Config.get('showLapEstimate') && driverState?.smoothedLapEstimate !== null && isFinite(driverState?.smoothedLapEstimate) && State.trackInfo.id && driverState?.smoothedLapEstimate > 0; if (estLapVisible) { estLapTimeEl.textContent = `${Utils.formatTime(driverState.smoothedLapEstimate)} (Raw: ${driverState.rawLapEstimate !== null && isFinite(driverState.rawLapEstimate) ? Utils.formatTime(driverState.rawLapEstimate) : '--:--'})`; estLapParaEl.style.display = ''; } else { estLapTimeEl.textContent = 'N/A'; estLapParaEl.style.display = 'none'; } }
                    }
                    if (Config.get('fetchApiStatsOnClick') && driverId && !element.hasAttribute('data-stats-loaded') && !APIManager.isFetching.has(driverId)) { const statsContainer = detailsDiv.querySelector('.api-stats-container'); if (statsContainer && !statsContainer.matches('.loading, .loaded, .error, .no-key')) { setTimeout(() => APIManager.fetchAndDisplayRacingStats(element, driverId), 50); } }
                }
            }
            if (driverState) driverState.statusClass = driverData.statusClass;
        },
        stableUpdateCustomList() {
            if (!Config.get('hideOriginalList')) { if (State.isInitialized) { State.resetRaceState(); } return; }
            if (State.isUpdating || !State.customUIContainer || !State.originalLeaderboard || !document.body.contains(State.originalLeaderboard)) { return; }
            State.isUpdating = true;
            const savedScrollTop = State.customUIContainer.scrollTop;
            const hadFocus = document.activeElement === State.customUIContainer || State.customUIContainer.contains(document.activeElement);
            const originalListItems = Array.from(State.originalLeaderboard.querySelectorAll(':scope > li[id^="lbr-"]'));
            const newDriversData = originalListItems.map(this.parseDriverData).filter(data => data !== null);
            const currentElementsMap = new Map();
            State.customUIContainer.querySelectorAll(':scope > .custom-driver-item[data-user-id]').forEach(el => { currentElementsMap.set(el.dataset.userId, el); });
            const newElementsToProcess = new Map();
            newDriversData.forEach((driverData, index) => { const position = index + 1; let element = currentElementsMap.get(driverData.userId); if (element) { this.updateDriverElement(element, driverData, position); newElementsToProcess.set(driverData.userId, { data: driverData, element: element, position: position }); currentElementsMap.delete(driverData.userId); } else { element = this.createDriverElement(driverData, position); newElementsToProcess.set(driverData.userId, { data: driverData, element: element, position: position }); } });
            currentElementsMap.forEach((elementToRemove, removedUserId) => {
                 const telemetryDiv = elementToRemove.querySelector('.driver-telemetry-display');
                 if (telemetryDiv && telemetryDiv._animationRAF) {
                     cancelAnimationFrame(telemetryDiv._animationRAF);
                 }
                 if(State.previousMetrics[removedUserId]) { delete State.previousMetrics[removedUserId]; delete State.lastUpdateTimes[removedUserId]; }
                 elementToRemove.remove();
             });
            let previousElement = null;
            newDriversData.forEach((driverData) => { const { element } = newElementsToProcess.get(driverData.userId); const insertBeforeNode = previousElement ? previousElement.nextSibling : State.customUIContainer.firstChild; if (element !== insertBeforeNode) { State.customUIContainer.insertBefore(element, insertBeforeNode); } previousElement = element; });

            const finishedOrCrashed = ['finished', 'crashed'];
            const allDriversFinished = newDriversData.length > 0 && newDriversData.every(d => finishedOrCrashed.includes(d.statusClass));

            if (allDriversFinished && !State.raceFinished) {
                 State.raceFinished = true;
                 State.finalRaceData = newDriversData;
                 UI.updateControlButtonsVisibility();
             } else if (!allDriversFinished && State.raceFinished) {
                 State.raceFinished = false;
                 State.finalRaceData = [];
                 UI.updateControlButtonsVisibility();
             }

            if (hadFocus && document.body.contains(State.customUIContainer)) { State.customUIContainer.scrollTop = savedScrollTop; }
            State.isUpdating = false;
        }
    };

    const HistoryManager = {
        logStorageKey: 'racingHistoryLog_v3.1.0',

        loadLog() {
            try {
                const storedLog = GM_getValue(this.logStorageKey, '[]');
                State.historyLog = JSON.parse(storedLog);
                if (State.historyLog.length > 0) {
                    const latest = State.historyLog[0];
                    State.lastKnownSkill = latest.skill;
                    State.lastKnownClass = latest.class;
                    State.lastKnownPoints = latest.points;
                } else {
                    State.lastKnownSkill = null;
                    State.lastKnownClass = null;
                    State.lastKnownPoints = null;
                }
            } catch (e) {
                State.historyLog = [];
                State.lastKnownSkill = null;
                State.lastKnownClass = null;
                State.lastKnownPoints = null;
                GM_setValue(this.logStorageKey, '[]');
            }
        },
        saveLog() {
            try {
                const limit = Config.get('historyLogLimit');
                if (State.historyLog.length > limit) {
                    State.historyLog = State.historyLog.slice(0, limit);
                }
                GM_setValue(this.logStorageKey, JSON.stringify(State.historyLog));
            } catch (e) {}
        },
        getLog() {
            return [...State.historyLog];
        },
        clearLog() {
            State.historyLog = [];
            State.lastKnownSkill = null;
            State.lastKnownClass = null;
            State.lastKnownPoints = null;
            GM_deleteValue(this.logStorageKey);
        },
        getCurrentSkillAndClass() {
            const skillElement = document.querySelector('div.banner div.skill');
            const classElement = document.querySelector('div.banner div.class-letter');
            const skill = skillElement ? parseFloat(skillElement.textContent) : null;
            const className = classElement ? classElement.textContent.trim().toUpperCase() : null;
            return { skill: !isNaN(skill) ? skill : null, class: className };
        },
        async checkAndLogUserStats() {
            if (!Config.get('historyEnabled') || !State.isRaceViewActive || !State.userId) return;

            const { skill: currentSkill, class: currentClass } = this.getCurrentSkillAndClass();
            let currentPoints = State.lastKnownPoints;

            if (Utils.isApiKeyAvailable() && !State.isFetchingPoints) {
                State.isFetchingPoints = true;
                const apiKey = Config.get('apiKey');
                try {
                     const fetchedPoints = await APIManager.fetchUserRacingPoints(apiKey, State.userId);
                     if (fetchedPoints !== null) currentPoints = fetchedPoints;
                } catch (e) { }
                finally { State.isFetchingPoints = false; }
            }

            const latestLogEntry = State.historyLog.length > 0 ? State.historyLog[0] : null;
            const skillChanged = currentSkill !== null && (!latestLogEntry || currentSkill !== latestLogEntry.skill);
            const classChanged = currentClass !== null && (!latestLogEntry || currentClass !== latestLogEntry.class);
            const pointsChanged = currentPoints !== null && (!latestLogEntry || currentPoints !== latestLogEntry.points);

            if (!latestLogEntry || skillChanged || classChanged || pointsChanged) {
                 if (currentSkill !== null || currentClass !== null || currentPoints !== null) {
                     const newEntry = { timestamp: Date.now(), skill: currentSkill, class: currentClass, points: currentPoints };
                     State.historyLog.unshift(newEntry);
                     const limit = Config.get('historyLogLimit');
                     if (State.historyLog.length > limit) { State.historyLog = State.historyLog.slice(0, limit); }
                     this.saveLog();
                     State.lastKnownSkill = currentSkill;
                     State.lastKnownClass = currentClass;
                     State.lastKnownPoints = currentPoints;
                     if (State.historyPanelInstance) { UI.createHistoryPanel(); }
                 }
            }
        },
        startCheckInterval() {
            if (State.historyCheckIntervalId) clearInterval(State.historyCheckIntervalId);
            State.historyCheckIntervalId = null;

            if (!Config.get('historyEnabled') || !State.isInitialized || !State.isRaceViewActive || !State.userId) return;

            this.checkAndLogUserStats();
            const intervalMs = Config.get('historyCheckInterval');
            State.historyCheckIntervalId = setInterval(() => { this.checkAndLogUserStats(); }, intervalMs);
        },
         restartCheckInterval() {
            this.startCheckInterval();
        }
    };

    function toggleDetails(event) { if (event.target.tagName === 'A') return; const driverItem = event.target.closest('.custom-driver-item'); if (driverItem && !State.isUpdating) { const driverId = driverItem.dataset.userId; const isOpening = !driverItem.classList.contains('details-visible'); driverItem.classList.toggle('details-visible'); const position = Array.from(driverItem.parentNode.children).indexOf(driverItem) + 1; const driverData = RaceManager.parseDriverData(document.getElementById(driverItem.dataset.originalId)); if (driverData) { RaceManager.updateDriverElement(driverItem, driverData, position); } if (isOpening && Config.get('fetchApiStatsOnClick') && driverId) { if (!driverItem.hasAttribute('data-stats-loaded') && !APIManager.isFetching.has(driverId)) { setTimeout(() => APIManager.fetchAndDisplayRacingStats(driverItem, driverId), 50); } } } }

    function cleanupScriptState(reason = "Unknown") {
        if (State.observers.length > 0) { State.observers.forEach(obs => obs.disconnect()); State.observers = []; }
        if (State.historyCheckIntervalId) { clearInterval(State.historyCheckIntervalId); State.historyCheckIntervalId = null; }
        document.querySelectorAll('.driver-telemetry-display').forEach(el => {
            if (el._animationRAF) cancelAnimationFrame(el._animationRAF);
             el._animationRAF = null;
             el._currentAnimSpeed = undefined;
             el._currentAnimAcc = undefined;
        });
        State.controlsContainer?.remove();
        State.customUIContainer?.remove();
        State.customUIContainer = null;
        State.controlsContainer = null;
        State.clearPopupsAndFullReset();
        State.isRaceViewActive = false;
        document.body.classList.remove('hide-original-leaderboard', 'telemetry-hidden');
    }

    async function initialize() {
        if (State.isInitialized) { return true; }
        try {
            let userIdFound = false;
            // Primary source: topBannerInitData global object
            const userIdFromBanner = window.topBannerInitData?.user?.data?.userID;
            if (userIdFromBanner) {
                State.userId = userIdFromBanner.toString();
                userIdFound = true;
            }

            // Fallback source: #torn-user input element
            if (!userIdFound) {
                const userInput = document.getElementById('torn-user');
                if (userInput) {
                    const userData = JSON.parse(userInput.value);
                    State.userId = userData.id?.toString();
                    if (State.userId) {
                        userIdFound = true;
                    }
                }
            }

            if (!userIdFound) throw new Error("User ID could not be determined.");


            // Auto-configure PDA key if running in PDA and no key is set
            if (isPDA && Config.get('apiKey') === '') {
                Config.set('apiKey', '###PDA-APIKEY###');
                Utils.showNotification('Torn PDA API key automatically configured.', 'success');
            }

            HistoryManager.loadLog();

            State.originalLeaderboard = document.getElementById('leaderBoard');
            const originalScrollbarContainer = document.getElementById('drivers-scrollbar');
            if (!State.originalLeaderboard || !originalScrollbarContainer) { throw new Error("Leaderboard elements not found."); }
            const parentContainer = originalScrollbarContainer.parentNode;

            if (!State.controlsContainer) {
                State.controlsContainer = document.getElementById('telemetryControlsContainer');
                if (!State.controlsContainer) {
                    State.controlsContainer = document.createElement('div');
                    State.controlsContainer.id = 'telemetryControlsContainer';
                    State.controlsContainer.className = 'telemetry-controls-container';
                    parentContainer.insertBefore(State.controlsContainer, originalScrollbarContainer);
                }
            }

            if (!State.customUIContainer) {
                State.customUIContainer = document.getElementById('custom-driver-list-container');
                if (State.customUIContainer) { State.customUIContainer.removeEventListener('click', toggleDetails); }
                else { State.customUIContainer = document.createElement('div'); State.customUIContainer.id = 'custom-driver-list-container'; parentContainer.insertBefore(State.customUIContainer, originalScrollbarContainer); }
                State.customUIContainer.addEventListener('click', toggleDetails);
            }

            UI.initializeControls();
            State.currentRaceId = RaceManager.getRaceId();
            await RaceManager.updateTrackAndClassInfo();
            document.body.classList.toggle('hide-original-leaderboard', Config.get('hideOriginalList'));

            if (Config.get('hideOriginalList') && State.originalLeaderboard.children.length > 0) { RaceManager.stableUpdateCustomList(); }
            else if (!Config.get('hideOriginalList')) { State.resetRaceState(); }

            State.isInitialized = true;
            HistoryManager.startCheckInterval();

            if (State.observers.length === 0 && document.body.contains(State.originalLeaderboard)) {
                const observer = new MutationObserver(() => {
                    window.requestAnimationFrame(async () => {
                        if (State.isUpdating || !State.isInitialized) return;
                         try {
                             const detectedRaceId = RaceManager.getRaceId();
                             if (detectedRaceId && detectedRaceId !== State.currentRaceId) {
                                 State.currentRaceId = detectedRaceId;
                             }
                            await RaceManager.updateTrackAndClassInfo();
                            RaceManager.stableUpdateCustomList();
                        } catch (e) {
                             console.error("Telemetry Script: Error during leaderboard update:", e);
                        }
                    });
                });
                const observerConfig = { childList: true, subtree: true, attributes: true, characterData: true };
                observer.observe(State.originalLeaderboard, observerConfig);
                State.observers.push(observer);
            }

            RaceManager.stableUpdateCustomList();

            return true;
        } catch (e) { Utils.showNotification(`Init Error: ${e.message}`, "error"); cleanupScriptState("Initialization error"); return false; }
    }

    let currentHref = document.location.href;
    const pageObserver = new MutationObserver(() => { if (currentHref !== document.location.href) { currentHref = document.location.href; if (State.isInitialized) { cleanupScriptState("Page Navigation"); } } });
    const raceViewObserver = new MutationObserver((mutations) => { let raceViewEntered = false; let raceViewExited = false; for (const mutation of mutations) { if (mutation.addedNodes.length) { for (const node of mutation.addedNodes) { if (node.nodeType === 1 && (node.id === 'racingupdates' || node.querySelector('#racingupdates'))) { raceViewEntered = true; break; } } } if (raceViewEntered) break; if (mutation.removedNodes.length) { for (const node of mutation.removedNodes) { if (node.nodeType === 1 && node.id === 'racingupdates') { raceViewExited = true; break; } } } if (raceViewExited) break; } if (raceViewEntered && !State.isRaceViewActive) { State.isRaceViewActive = true; setTimeout(initialize, 150); } else if (raceViewExited && State.isRaceViewActive) { State.isRaceViewActive = false; if (State.isInitialized) { cleanupScriptState("Exited Race View"); } } });

    function startObservers() { pageObserver.observe(document.body, { childList: true, subtree: true }); raceViewObserver.observe(document.body, { childList: true, subtree: true }); if (document.getElementById('racingupdates')) { if (!State.isRaceViewActive) { State.isRaceViewActive = true; setTimeout(initialize, 100); } } else { State.isRaceViewActive = false; } }
    if (document.readyState === 'complete' || document.readyState === 'interactive') { startObservers(); } else { document.addEventListener('DOMContentLoaded', startObservers); }
    window.addEventListener('unload', () => { pageObserver.disconnect(); raceViewObserver.disconnect(); if (State.isInitialized) { cleanupScriptState("Window Unload"); } });

})();