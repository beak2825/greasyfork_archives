// ==UserScript==
// @name        🚬🔑
// @namespace   http://tampermonkey.net/
// @version     2.3.5
// @description Automates using any "Baseado" once, waits 50 mins, includes Auto-Login, and optional page refresh on idle respecting interval.
// @author      Mark
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character*
// @match       https://*.popmundo.com/World/Popmundo.aspx/Locale*
// @match       https://*.popmundo.com/Default.aspx
// @match       https://*.popmundo.com/
// @match       https://*.popmundo.com/World/Popmundo.aspx/ChooseCharacter*
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/ItemDetails*
// @match       https://www.thegreatheist.com/
// @match       https://www.thegreatheist.com/Default.aspx
// @match       https://*.popmundo.com/World/Popmundo.aspx
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_info
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/537054/%F0%9F%9A%AC%F0%9F%94%91.user.js
// @updateURL https://update.greasyfork.org/scripts/537054/%F0%9F%9A%AC%F0%9F%94%91.meta.js
// ==/UserScript==

/* eslint-env jquery, greasemonkey */

(function() {
    'use strict';

    // --- Constants and Initialization ---
    const scriptVersion = typeof GM_info !== 'undefined' ? GM_info.script.version : '2.3.5';
    const CONFIG_KEY = "pmBaseadoSmokerConfig_v2.3.1";
    const PANEL_POSITION_KEY = "pmBaseadoPanelPosition_v1";
    const ACTION_LOG_KEY = "pmBaseadoActionLog_v2.2.0";
    const SESSION_ACTION_KEY = "pmBaseadoAction_v2";
    const LOGIN_PASSWORD_GM_KEY = "pmBaseadoLoginPassword_v1";
    const REFRESH_FLAG_KEY = "pmBaseadoRefreshJustHappened_v1";

    console.log(`[PM BaseadoSmoker v${scriptVersion}] Script preamble executed on: ${window.location.href}`);

    if (typeof $ === 'undefined') {
        console.error("[PM BaseadoSmoker ERRO] jQuery not available!");
        alert("PM BaseadoSmoker FATAL ERROR: jQuery did not load.");
        return;
    }
    console.log("[PM BaseadoSmoker] jQuery loaded.");

    // --- Default Configuration ---
    const DEFAULT_CONFIG = {
        scriptEnabled: false,
        baseadoAutomationEnabled: false,
        baseadoSearchName: 'Baseado',
        baseadoIntervalSeconds: 50 * 60,
        baseadoUsesPerCycle: 1,
        baseadoLastCycleCompletionTimestamp: 0,
        baseadoCurrentCycleUsesCompleted: 0,
        checkInterval: 60,
        actionLog: [],
        characterPageUrl: null,
        characterId: null,
        loginUsername: null,
        selectedCharacterName: null,
        refreshCharacterPageOnIdle: false,
    };

    const MAX_LOG_ENTRIES = 150;

    // --- Selectors ---
    const SELECTORS = {
        characterLink: 'a:contains("Meu Personagem"):first',
        avatarLink: '.avatar.pointer[onclick*="/Character/"]',
        useItemButton: 'input#ctl00_cphLeftColumn_ctl00_btnItemUse', // Este ID pode mudar se a estrutura da página do Popmundo mudar
        itemListTable: 'table.data',
        loginUsernameField: '#ctl00_cphLeftColumn_ucLogin_txtUsername, #ctl00_cphRightColumn_ucLogin_txtUsername',
        loginPasswordField: '#ctl00_cphLeftColumn_ucLogin_txtPassword, #ctl00_cphRightColumn_ucLogin_txtPassword',
        loginButton: '#ctl00_cphRightColumn_ucLogin_btnLogin',
        chooseCharacterButtonByName: (charName) => `input[type="submit"][value="Escolher ${charName}"]`,
    };

    // --- URLs and State Variables ---
    const BASE_URL_MATCH = "/World/Popmundo.aspx/Character";
    const ITEMS_URL_PATH_START = "/World/Popmundo.aspx/Character/Items";
    const ITEM_DETAILS_URL_PATH_START = "/World/Popmundo.aspx/Character/ItemDetails";
    const LOGIN_PAGE_PATH = "/Default.aspx";
    const POPMUNDO_HOME_PATH = "/";
    const CHOOSE_CHAR_PATH_START = "/World/Popmundo.aspx/ChooseCharacter";

    let config = {};
    let refreshTimerId = null;
    let countdownIntervalId = null;
    let currentStatus = "Initializing...";
    let isActionInProgress = false;
    let isLoginOrCharSelectInProgress = false;

    // --- Helper Functions ---
    function pm_sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function loadConfig() {
        try {
            let storedConfig = GM_getValue(CONFIG_KEY, null);
            config = { ...DEFAULT_CONFIG, ...(storedConfig || {}) };

            for (const key in DEFAULT_CONFIG) {
                if (typeof config[key] === 'undefined') {
                    config[key] = DEFAULT_CONFIG[key];
                }
            }
            config.baseadoIntervalSeconds = DEFAULT_CONFIG.baseadoIntervalSeconds;
            config.baseadoUsesPerCycle = 1;

            const loadedLog = GM_getValue(ACTION_LOG_KEY, []);
            config.actionLog = Array.isArray(loadedLog) ? loadedLog : [];
            console.log(`[PM BaseadoSmoker v${scriptVersion}] Config loaded (Script Enabled: ${config.scriptEnabled}, Baseado Auto: ${config.baseadoAutomationEnabled}, Baseado Interval: ${config.baseadoIntervalSeconds / 60} min, RefreshOnIdle: ${config.refreshCharacterPageOnIdle})`);
        } catch (e) {
            console.error(`[PM BaseadoSmoker v${scriptVersion}] CRITICAL ERROR loading config:`, e);
            config = { ...DEFAULT_CONFIG, actionLog: GM_getValue(ACTION_LOG_KEY, []) };
            config.baseadoUsesPerCycle = 1;
            config.baseadoIntervalSeconds = DEFAULT_CONFIG.baseadoIntervalSeconds;
            alert("Error loading Baseado Smoker configuration. Resetting to defaults (log kept).");
        }
    }

    function saveConfig(showSuccess = true) {
        try {
            const configToSave = { ...config };
            delete configToSave.loginPassword;

            GM_setValue(CONFIG_KEY, configToSave);
            GM_setValue(ACTION_LOG_KEY, config.actionLog);

            if ($('#pmBaseadoScriptToggle').length) $('#pmBaseadoScriptToggle').prop('checked', config.scriptEnabled);
            if ($('#pmBaseadoAutomationToggle').length) $('#pmBaseadoAutomationToggle').prop('checked', config.baseadoAutomationEnabled);
            if ($('#pmBaseadoSearchName').length) $('#pmBaseadoSearchName').val(config.baseadoSearchName);
            if ($('#pmRefreshCharacterPageOnIdleToggle').length) $('#pmRefreshCharacterPageOnIdleToggle').prop('checked', config.refreshCharacterPageOnIdle);
            if ($('#pmLoginUsername').length) $('#pmLoginUsername').val(config.loginUsername || '');
            if ($('#pmSelectedCharName').length) $('#pmSelectedCharName').val(config.selectedCharacterName || '');
            if ($('#pmLoginPassword').length && $('#pmLoginPassword').val()) {
                 $('#pmLoginPassword').val('');
            }
            if ($('#pmBaseadoPanel .pm-tab-content#pm-tab-status .pm-text-info').length) {
                const newTextInfo = `Uses any available "${config.baseadoSearchName || 'item'}" once, then waits ${formatTime(config.baseadoIntervalSeconds)}.`;
                $('#pmBaseadoPanel .pm-tab-content#pm-tab-status .pm-text-info').html(`<i class="fa-solid fa-info-circle"></i>${newTextInfo}`);
            }

            console.log(`[PM BaseadoSmoker v${scriptVersion}] Config saved.`);
            if (showSuccess) updateStatus("Configuration saved!", false, 'success');
            updateBaseadoStatusDisplay();

            if (config.scriptEnabled && !refreshTimerId && !sessionStorage.getItem(SESSION_ACTION_KEY) && !isLoginPage() && !isCharacterSelectionPage()) {
                stopTimers();
                updateStatus("Config saved. Restarting checks...");
                setTimeout(runCheck, 1000);
            } else if (!config.scriptEnabled) {
                stopTimers();
                updateStatus("Baseado Smoker script disabled.");
            }
        } catch (e) {
            console.error(`[PM BaseadoSmoker v${scriptVersion}] ERROR saving config:`, e);
            alert("Error saving Baseado Smoker configuration.");
            updateStatus("Error saving configuration!", true);
        }
    }

    function updateStatus(msg, isError = false, type = 'normal') {
        currentStatus = msg;
        const el = $('#pmBaseadoPanelStatus');
        if (!el.length) {
            console.log("[PM BaseadoSmoker Status (No Panel)]:", msg);
            if(isError) console.error("[PM BaseadoSmoker Status (No Panel, ERROR)]:", msg);
            return;
        }
        let iconHtml = '';
        if (type === 'error' || isError) iconHtml = '<i class="fa-solid fa-triangle-exclamation fa-fw"></i> ';
        else if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check fa-fw"></i> ';
        else if (msg.includes("Next check") || msg.includes("Scheduling") || msg.includes("Refreshing")) iconHtml = '<i class="fa-solid fa-hourglass-half fa-fw"></i> ';
        else if (msg.includes("disabled") || msg.includes("inactive") || msg.includes("Stopped") || msg.includes("Paused")) iconHtml = '<i class="fa-solid fa-power-off fa-fw"></i> ';
        else if (msg.includes("Using") || msg.includes("Navigating") || msg.includes("Clicking") || msg.includes("Logging in") || msg.includes("Selecting char")) iconHtml = '<i class="fa-solid fa-spinner fa-spin fa-fw"></i> ';
        else iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> ';

        el.removeClass('pm-status-error pm-status-success pm-status-accent pm-status-normal');
        if (type === 'error' || isError) el.addClass('pm-status-error');
        else if (type === 'success') el.addClass('pm-status-success');
        else if (msg.includes("Using") || msg.includes("Navigating") || msg.includes("Clicking") || msg.includes("Next check") || msg.includes("Logging in") || msg.includes("Selecting char") || msg.includes("Refreshing")) el.addClass('pm-status-accent');
        else el.addClass('pm-status-normal');
        el.html(iconHtml + msg);
        if (isError) console.error("[PM BaseadoSmoker Status (Panel, ERROR)]:", msg);
    }

    function stopTimers() {
        if (refreshTimerId) { clearTimeout(refreshTimerId); refreshTimerId = null; }
        if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; }
    }

    function navigateTo(urlPath) {
        stopTimers();
        if (!urlPath || !urlPath.startsWith('/')) {
            console.error(`[PM BaseadoSmoker Nav] Invalid URL: ${urlPath}`);
            updateStatus("Error: Invalid navigation URL.", true);
            sessionStorage.removeItem(SESSION_ACTION_KEY);
            return;
        }
        const fullUrl = window.location.origin + urlPath;
        updateStatus(`Navigating to ${urlPath.substring(0,50)}...`);
        console.log(`[PM BaseadoSmoker Nav] Navigating to: ${fullUrl}`);
        try {
            window.location.href = fullUrl;
        } catch (e) {
            updateStatus(`ERROR navigating to ${fullUrl}. Disabling script.`, true);
            console.error("[PM BaseadoSmoker Nav] Navigation error:", e);
            config.scriptEnabled = false;
            saveConfig(false);
            alert("Navigation error. Baseado Smoker script disabled.");
            sessionStorage.removeItem(SESSION_ACTION_KEY);
        }
    }

    async function clickElement(selector, description, delay = 300) {
        return new Promise(async (resolve) => {
            try {
                const element = $(selector);
                if (element.length > 0) {
                    const target = element.first();
                    updateStatus(`Clicking ${description}...`);
                    await pm_sleep(delay + Math.random() * 200);
                    try {
                        target[0].click();
                        await pm_sleep(150);
                        resolve(true);
                    } catch (err) {
                        console.error(`[PM BaseadoSmoker Click] Error during click on ${description}:`, err);
                        updateStatus(`ERROR clicking ${description}!`, true);
                        resolve(false);
                    }
                } else {
                    updateStatus(`ERROR: ${description} (${selector}) not found!`, true);
                    console.error(`[PM BaseadoSmoker Click] Element not found: ${description} (${selector})`);
                    resolve(false);
                }
            } catch (e) {
                console.error(`[PM BaseadoSmoker Click] General error for ${description}:`, e);
                updateStatus(`GENERAL ERROR with ${description}!`, true);
                resolve(false);
            }
        });
    }

    function getCharacterPageUrl() {
        const storageKey = 'pmBaseado_characterUrl_v2';
        try {
            const path = window.location.pathname;
            let match = path.match(/^(\/World\/Popmundo\.aspx\/Character\/(\d+))(\/|$)/);
            if (match && match[1] && match[2]) {
                sessionStorage.setItem(storageKey, match[1]);
                return match[1];
            }
            const charLink = $(SELECTORS.characterLink);
            if (charLink.length && charLink.attr('href')) {
                let href = charLink.attr('href');
                match = href.match(/^(\/World\/Popmundo\.aspx\/Character\/(\d+))$/);
                if (match && match[1] && match[2]) {
                    sessionStorage.setItem(storageKey, match[1]);
                    return match[1];
                }
            }
            const avatarLink = $(SELECTORS.avatarLink);
             if (avatarLink.length && avatarLink.attr('onclick')) {
                let onclickAttr = avatarLink.attr('onclick');
                match = onclickAttr.match(/\/Character\/(\d+)/);
                if (match && match[1]) {
                    const charUrl = `${BASE_URL_MATCH}/${match[1]}`;
                    sessionStorage.setItem(storageKey, charUrl);
                    return charUrl;
                }
            }
            let storedUrl = sessionStorage.getItem(storageKey);
            if (storedUrl && /^\/World\/Popmundo\.aspx\/Character\/\d+$/.test(storedUrl)) {
                return storedUrl;
            }
            return null;
        } catch (e) {
            console.error("[PM BaseadoSmoker URL] CRITICAL error getting character URL:", e);
            return null;
        }
    }

    function getCharacterId(url) {
        if (!url) return null;
        const match = url.match(/\/Character\/(\d+)/);
        return match && match[1] ? match[1] : null;
    }

    function getCurrentTime() { return Math.floor(Date.now() / 1000); }

    function formatTime(seconds) {
        if (seconds <= 0) return "Ready";
        const h = Math.floor(seconds / 3600);
        seconds %= 3600;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        let timeStr = "";
        if (h > 0) timeStr += `${h}h `;
        if (m > 0 || h > 0) timeStr += `${m.toString().padStart(h > 0 ? 2 : 1, '0')}m `;
        timeStr += `${s.toString().padStart(2, '0')}s`;
        return timeStr.trim();
    }

    function isLoginPage() {
        const path = window.location.pathname;
        return (path === LOGIN_PAGE_PATH || path === POPMUNDO_HOME_PATH) &&
               $(SELECTORS.loginUsernameField).length > 0 &&
               $(SELECTORS.loginPasswordField).length > 0;
    }
    function isCharacterSelectionPage() { return window.location.pathname.startsWith(CHOOSE_CHAR_PATH_START); }
    function isItemsPage() { return window.location.pathname.startsWith(ITEMS_URL_PATH_START); }
    function isItemDetailsPage() { return window.location.pathname.startsWith(ITEM_DETAILS_URL_PATH_START); }
    function isCharacterPage(charId = null) {
        const path = window.location.pathname;
        if (charId) return path === `${BASE_URL_MATCH}/${charId}`;
        return path.startsWith(BASE_URL_MATCH) &&
               !path.startsWith(ITEMS_URL_PATH_START) &&
               !path.startsWith(ITEM_DETAILS_URL_PATH_START) &&
               !path.startsWith(CHOOSE_CHAR_PATH_START);
    }

    async function performAutoLogin() {
        if (isLoginOrCharSelectInProgress) return false;
        const username = config.loginUsername;
        const password = GM_getValue(LOGIN_PASSWORD_GM_KEY, null);

        if (username && password) {
            const usernameField = $(SELECTORS.loginUsernameField);
            const passwordField = $(SELECTORS.loginPasswordField);
            const loginButton = $(SELECTORS.loginButton);

            if (usernameField.length && passwordField.length && loginButton.length) {
                isLoginOrCharSelectInProgress = true;
                updateStatus('Auto-Logging in...');
                logAction("🔑 Attempting Auto-Login...");
                usernameField.val(username);
                passwordField.val(password);
                const clicked = await clickElement(SELECTORS.loginButton, "Login button");
                isLoginOrCharSelectInProgress = false;
                if (clicked) {
                    logAction("🔑 Auto-Login submitted.");
                    return true;
                } else {
                    logAction("🔑 Auto-Login failed (click error).", true);
                    updateStatus('Auto-Login click failed!', true);
                    return false;
                }
            } else {
                updateStatus('Login form elements not found!', true);
                logAction("🔑 Login form elements N/E for Auto-Login.", true);
            }
        } else {
            if (!username) updateStatus('Username for Auto-Login not set.', true);
            else if (!password) updateStatus('Password for Auto-Login not saved.', true);
            logAction("🔑 Auto-Login credentials missing.", true);
        }
        isLoginOrCharSelectInProgress = false;
        return false;
    }
    async function selectCharacter() {
        if (isLoginOrCharSelectInProgress) return false;
        const charName = config.selectedCharacterName;
        if (!charName) {
            updateStatus("Character name for selection not set.", true);
            logAction("👤 Character name for auto-selection N/A.", true);
            return false;
        }

        isLoginOrCharSelectInProgress = true;
        updateStatus(`Auto-selecting character: ${charName}...`);
        logAction(`👤 Attempting to select character: ${charName}...`);
        const selector = SELECTORS.chooseCharacterButtonByName(charName);
        const clicked = await clickElement(selector, `button 'Escolher ${charName}'`);
        isLoginOrCharSelectInProgress = false;

        if (clicked) {
            logAction(`👤 Character '${charName}' selection submitted.`);
            return true;
        } else {
            logAction(`👤 Failed to select character '${charName}'. Button not found or click error.`, true);
            updateStatus(`Failed to select ${charName}!`, true);
            return false;
        }
    }

    function logAction(message, isError = false) {
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        let iconHtml = '<i class="fa-solid fa-info-circle fa-fw pm-log-secondary"></i> ';
        if (isError || message.toLowerCase().includes('error') || message.toLowerCase().includes('fail')) {
            iconHtml = '<i class="fa-solid fa-xmark fa-fw pm-log-error"></i> ';
        } else if (message.toLowerCase().includes('used') || message.toLowerCase().includes('success')) {
            iconHtml = '<i class="fa-solid fa-check fa-fw pm-log-success"></i> ';
        } else if (config.baseadoSearchName && message.toLowerCase().includes(config.baseadoSearchName.toLowerCase()) ) {
             iconHtml = '<i class="fa-solid fa-joint fa-fw pm-log-accent"></i> ';
        } else if (message.toLowerCase().includes('navigating') || message.toLowerCase().includes('checking') || message.toLowerCase().includes('refreshing')) {
            iconHtml = '<i class="fa-solid fa-route fa-fw pm-log-info"></i> ';
        } else if (message.toLowerCase().includes('auto-login')) {
            iconHtml = '<i class="fa-solid fa-key fa-fw pm-log-warning"></i> ';
        } else if (message.toLowerCase().includes('character')) {
             iconHtml = '<i class="fa-solid fa-user fa-fw pm-log-accent"></i> ';
        }

        config.actionLog.unshift(`[${timestamp}] ${iconHtml}${message}`);
        if (config.actionLog.length > MAX_LOG_ENTRIES) {
            config.actionLog.length = MAX_LOG_ENTRIES;
        }
        updateActionLogDisplay();
    }
    function updateActionLogDisplay() {
        const logContainer = $('#pmBaseadoActionLog');
        if (!logContainer.length) return;
        if (config.actionLog.length === 0) {
            logContainer.html('<div class="pm-log-empty"><i class="fa-solid fa-clipboard pm-log-empty-icon"></i><br>Log is empty.</div>');
        } else {
            logContainer.html(config.actionLog.map(entry => `<div class="pm-log-entry">${entry}</div>`).join(''));
        }
    }
    function clearActionLog() {
        if (confirm("Are you sure you want to clear the action log?")) {
            config.actionLog = [];
            updateActionLogDisplay();
            logAction("Log cleared by user.");
            saveConfig(false);
        }
    }

    function recordBaseadoUse() {
        console.log(`[PM BaseadoSmoker RecordUse DEBUG] Recording use. Current uses before increment: ${config.baseadoCurrentCycleUsesCompleted}`); // << LOG ADICIONADO
        config.baseadoCurrentCycleUsesCompleted++;
        if (config.baseadoCurrentCycleUsesCompleted >= config.baseadoUsesPerCycle) {
            logAction(`${config.baseadoSearchName} used (${config.baseadoCurrentCycleUsesCompleted}/${config.baseadoUsesPerCycle}). Cooldown period of ${formatTime(config.baseadoIntervalSeconds)} will start after returning to char page.`);
        } else {
            // Esta parte não deve ser atingida se usesPerCycle é 1
            logAction(`${config.baseadoSearchName} used (${config.baseadoCurrentCycleUsesCompleted}/${config.baseadoUsesPerCycle}). Preparing for next use in cycle.`);
        }
        saveConfig(false); // Salva o estado do ciclo
        updateBaseadoStatusDisplay();
    }

    function updateBaseadoStatusDisplay() {
        const statusEl = $('#pmBaseadoCycleStatus');
        if (!statusEl.length) return;

        const now = getCurrentTime();
        let displayMsg = "Automation disabled.";
        let iconClass = "fa-power-off";
        let colorVar = "var(--pm-value-secondary)";

        if (config.scriptEnabled && config.baseadoAutomationEnabled) {
            if (!config.baseadoSearchName || !config.baseadoSearchName.trim()) {
                displayMsg = "Item Name Missing!";
                iconClass = "fa-triangle-exclamation";
                colorVar = "var(--pm-value-error)";
            } else {
                const timeSinceLastCycleCompletion = config.baseadoLastCycleCompletionTimestamp === 0 ? Infinity : (now - config.baseadoLastCycleCompletionTimestamp);

                if (config.baseadoCurrentCycleUsesCompleted < config.baseadoUsesPerCycle) {
                    if (timeSinceLastCycleCompletion >= config.baseadoIntervalSeconds) {
                        displayMsg = `Ready for use ${config.baseadoCurrentCycleUsesCompleted + 1}/${config.baseadoUsesPerCycle}`;
                        iconClass = config.baseadoCurrentCycleUsesCompleted === 0 ? "fa-play" : "fa-forward-step";
                        colorVar = "var(--pm-value-success)";
                    } else {
                        const remaining = config.baseadoIntervalSeconds - timeSinceLastCycleCompletion;
                        displayMsg = `Main Cooldown: ${formatTime(remaining)}`;
                        iconClass = "fa-hourglass-half";
                        colorVar = "var(--pm-value-accent)";
                    }
                } else { // Ciclo completo (baseadoCurrentCycleUsesCompleted >= baseadoUsesPerCycle)
                    if (timeSinceLastCycleCompletion >= config.baseadoIntervalSeconds) {
                        // Esta condição (cooldown terminou E ciclo já está completo) implica que algo resetou o ciclo (ex: LastCompletionTimestamp)
                        // mas CurrentCycleUsesCompleted ainda não foi resetado para 0.
                        // Isso pode acontecer se o timestamp foi resetado por mudança de char, mas o uso não foi.
                        // O mais provável é que este 'else' seja atingido quando o cooldown AINDA está ativo.
                        displayMsg = "Cooldown Over! Ready for new cycle."; // Teoricamente, se chegou aqui, é para um novo ciclo.
                        iconClass = "fa-check-double";
                        colorVar = "var(--pm-value-success)";
                    } else {
                        const remaining = config.baseadoIntervalSeconds - timeSinceLastCycleCompletion;
                        displayMsg = `Main Cooldown: ${formatTime(remaining)}`;
                        iconClass = "fa-hourglass-half";
                        colorVar = "var(--pm-value-accent)";
                    }
                }
            }
        } else if (config.scriptEnabled && !config.baseadoAutomationEnabled) {
            displayMsg = "Baseado Automation Off";
            iconClass = "fa-toggle-off";
        }
        statusEl.html(`<i class="fa-solid ${iconClass} fa-fw"></i> ${displayMsg}`).css('color', colorVar);
    }


    // --- Main Logic ---
    async function runCheck() {
        if (isActionInProgress) {
            return;
        }
        isActionInProgress = true;

        try {
            if (isLoginPage()) {
                stopTimers();
                if (config.scriptEnabled && config.loginUsername && GM_getValue(LOGIN_PASSWORD_GM_KEY, null)) {
                    if (await performAutoLogin()) { return; }
                    else { updateStatus("Auto-Login failed. Waiting for manual login.", true); }
                } else { updateStatus("On Login Page. Auto-Login not configured or script disabled. Waiting."); }
                return;
            }

            if (isCharacterSelectionPage()) {
                stopTimers();
                if (config.scriptEnabled && config.selectedCharacterName) {
                    if (await selectCharacter()) { return; }
                    else { updateStatus("Character selection failed. Waiting for manual selection.", true); }
                } else { updateStatus("On Character Selection Page. Auto-select not configured or script disabled. Waiting."); }
                return;
            }

            const pageAction = sessionStorage.getItem(SESSION_ACTION_KEY);
            if (pageAction) {
                sessionStorage.removeItem(SESSION_ACTION_KEY);
                await handleBaseadoPageAction(pageAction);
                if (pageAction.includes("details") && (isItemDetailsPage() || isCharacterPage(config.characterId))) {
                    setTimeout(() => { isActionInProgress = false; runCheck(); }, 1500 + Math.random()*500);
                    return;
                }
            }

            const currentCharacterPageUrl = getCharacterPageUrl();
            const currentCharacterId = currentCharacterPageUrl ? getCharacterId(currentCharacterPageUrl) : null;
            if (currentCharacterId && currentCharacterPageUrl) {
                if(config.characterPageUrl !== currentCharacterPageUrl || config.characterId !== currentCharacterId){
                    config.characterPageUrl = currentCharacterPageUrl;
                    config.characterId = currentCharacterId;
                    config.baseadoLastCycleCompletionTimestamp = 0;
                    config.baseadoCurrentCycleUsesCompleted = 0;
                    saveConfig(false);
                }
                if ($('#pmDetectedCharId').length) $('#pmDetectedCharId').val(currentCharacterId);
                if ($('#pmDetectedCharUrl').length) $('#pmDetectedCharUrl').val(currentCharacterPageUrl);
            }

            if (!config.scriptEnabled) {
                updateStatus("Baseado Smoker script disabled.");
                stopTimers(); return;
            }
            if (!config.baseadoAutomationEnabled) {
                updateStatus("Baseado Automation is Off. Waiting.");
                isActionInProgress = false; scheduleNextCheck(config.checkInterval * 2); return;
            }
            if (!config.characterId || !config.characterPageUrl) {
                updateStatus("Character info missing. Navigate to character page or login.", true);
                logAction("Character ID/URL not detected. Automation paused.", true);
                isActionInProgress = false; scheduleNextCheck(config.checkInterval * 2); return;
            }
             if (!config.baseadoSearchName || !config.baseadoSearchName.trim()) {
                updateStatus("Baseado Item Name for search is not set in settings!", true);
                logAction("Baseado Item Name (for search) missing. Automation paused.", true);
                isActionInProgress = false; scheduleNextCheck(config.checkInterval * 2); return;
            }

            if (isCharacterPage(config.characterId)) {
                const now = getCurrentTime();
                let needsToUseBaseado = false;
                let statusDetail = "";
                const timeSinceLastCycleCompletion = config.baseadoLastCycleCompletionTimestamp === 0 ? Infinity : (now - config.baseadoLastCycleCompletionTimestamp);

                // << LOGS DE DEBUG PARA USO DO ITEM >>
                console.log(`[PM BaseadoSmoker RC DEBUG - Uso Item Check] Now: ${now}, LastCompletion: ${config.baseadoLastCycleCompletionTimestamp}, TimeSince: ${timeSinceLastCycleCompletion}, Interval: ${config.baseadoIntervalSeconds}, UsesCompleted: ${config.baseadoCurrentCycleUsesCompleted}, UsesPerCycle: ${config.baseadoUsesPerCycle}`);

                if (timeSinceLastCycleCompletion < config.baseadoIntervalSeconds) {
                    const remaining = config.baseadoIntervalSeconds - timeSinceLastCycleCompletion;
                    statusDetail = `${config.baseadoSearchName} main cooldown: ${formatTime(remaining)}.`;
                    console.log(`[PM BaseadoSmoker RC DEBUG - Uso Item Check] In main cooldown. Remaining: ${formatTime(remaining)}`);
                    needsToUseBaseado = false;
                } else {
                    console.log(`[PM BaseadoSmoker RC DEBUG - Uso Item Check] Main cooldown finished or first run.`);
                    if (config.baseadoCurrentCycleUsesCompleted < config.baseadoUsesPerCycle) {
                        if (config.baseadoLastCycleCompletionTimestamp !== 0 && config.baseadoCurrentCycleUsesCompleted === 0) {
                             logAction(`Main ${formatTime(config.baseadoIntervalSeconds)} cooldown for ${config.baseadoSearchName} finished. Starting new ${config.baseadoUsesPerCycle}-use cycle.`);
                        }
                        needsToUseBaseado = true;
                        statusDetail = `Ready for ${config.baseadoSearchName} use ${config.baseadoCurrentCycleUsesCompleted + 1}/${config.baseadoUsesPerCycle}.`;
                        console.log(`[PM BaseadoSmoker RC DEBUG - Uso Item Check] Ready to use. needsToUseBaseado = true.`);
                    } else {
                        logAction(`Completed ${config.baseadoUsesPerCycle} use(s) of ${config.baseadoSearchName}. Starting ${formatTime(config.baseadoIntervalSeconds)} cooldown.`);
                        config.baseadoLastCycleCompletionTimestamp = getCurrentTime();
                        config.baseadoCurrentCycleUsesCompleted = 0;
                        saveConfig(false);
                        const remaining = config.baseadoIntervalSeconds;
                        statusDetail = `${config.baseadoSearchName} main cooldown: ${formatTime(remaining)}.`;
                        console.log(`[PM BaseadoSmoker RC DEBUG - Uso Item Check] Cycle completed. Starting cooldown. needsToUseBaseado = false.`);
                        needsToUseBaseado = false;
                    }
                }
                updateBaseadoStatusDisplay(); // Atualiza o status do ciclo no painel
                updateStatus(statusDetail);    // Atualiza o status geral no painel

                if (needsToUseBaseado) {
                    logAction(statusDetail + ` Searching for any "${config.baseadoSearchName}". Navigating to items page.`);
                    sessionStorage.setItem(SESSION_ACTION_KEY, `go_to_items_baseado_generic:${config.characterId}`);
                    navigateTo(`${ITEMS_URL_PATH_START}/${config.characterId}`);
                    return;
                } else { // Não é hora de usar o Baseado
                    const refreshJustHappened = sessionStorage.getItem(REFRESH_FLAG_KEY);
                    console.log(`[PM BaseadoSmoker RC DEBUG - Refresh Check] refreshJustHappened: ${refreshJustHappened}, config.refreshCharacterPageOnIdle: ${config.refreshCharacterPageOnIdle}, config.scriptEnabled: ${config.scriptEnabled}, config.baseadoAutomationEnabled: ${config.baseadoAutomationEnabled}`);

                    if (refreshJustHappened) {
                        sessionStorage.removeItem(REFRESH_FLAG_KEY);
                        console.log("[PM BaseadoSmoker RC] Refresh flag found and removed. Setting isActionInProgress=false and scheduling next check.");
                        isActionInProgress = false;
                        scheduleNextCheck(config.checkInterval);
                    } else if (config.refreshCharacterPageOnIdle && config.scriptEnabled && config.baseadoAutomationEnabled) {
                        console.log("[PM BaseadoSmoker RC] Conditions for idle refresh MET. Proceeding to refresh.");
                        const remainingCooldownForLog = timeSinceLastCycleCompletion < config.baseadoIntervalSeconds ?
                                                       config.baseadoIntervalSeconds - timeSinceLastCycleCompletion : 0;
                        logAction(`Idle interval ended. Refreshing character page as per setting (cooldown: ${formatTime(remainingCooldownForLog)}).`);
                        updateStatus(`Refreshing character page (idle)...`);
                        sessionStorage.setItem(REFRESH_FLAG_KEY, 'true');
                        console.log("[PM BaseadoSmoker RC] Setting refresh flag and scheduling page reload.");
                        setTimeout(() => {
                            if (isCharacterPage(config.characterId)) {
                                console.log("[PM BaseadoSmoker RC] Reloading character page (idle refresh).");
                                window.location.reload();
                            } else {
                                console.warn("[PM BaseadoSmoker RC] Not on char page for idle refresh, removing flag and scheduling next check.");
                                sessionStorage.removeItem(REFRESH_FLAG_KEY);
                                isActionInProgress = false;
                                scheduleNextCheck(config.checkInterval);
                            }
                        }, 750 + Math.random() * 500);
                        return;
                    } else {
                        console.log("[PM BaseadoSmoker RC] Conditions for idle refresh NOT MET. Setting isActionInProgress=false and scheduling next regular check.");
                        if (!config.refreshCharacterPageOnIdle) console.log("[PM BaseadoSmoker RC DEBUG] Reason: refreshCharacterPageOnIdle is false.");
                        isActionInProgress = false;
                        scheduleNextCheck(config.checkInterval);
                    }
                }
            } else if (!pageAction && config.characterPageUrl && window.location.pathname !== config.characterPageUrl) {
                logAction(`Not on character page (${window.location.pathname}). Returning to ${config.characterPageUrl}.`);
                updateStatus("Returning to character page...");
                navigateTo(config.characterPageUrl);
                return;
            } else {
                isActionInProgress = false;
                scheduleNextCheck(config.checkInterval * 3);
            }

        } catch (e) {
            console.error("[PM BaseadoSmoker RC] CRITICAL ERROR in runCheck:", e);
            updateStatus("CRITICAL ERROR! Check console.", true);
            logAction(`CRITICAL ERROR in runCheck: ${e.message}`, true);
            stopTimers();
            config.scriptEnabled = false;
            saveConfig(false);
            alert("Critical error in Baseado Smoker. Script disabled. Check console.");
            sessionStorage.removeItem(SESSION_ACTION_KEY);
            sessionStorage.removeItem(REFRESH_FLAG_KEY);
        } finally {
            if (isActionInProgress) { // Só muda se ainda for true (ou seja, nenhum return quebrou o fluxo antes)
                 isActionInProgress = false;
            }
            updateUIDisplayLoop();
        }
    }

    async function handleBaseadoPageAction(pageActionString) {
        console.log(`[PM BaseadoSmoker HPA DEBUG] Handling page action: ${pageActionString}`);
        const [actionType, actionCharId] = pageActionString.split(':');
        const returnToCharPageUrl = config.characterPageUrl || `${BASE_URL_MATCH}/${config.characterId || ''}`;

        if (actionType === "go_to_items_baseado_generic") {
            console.log(`[PM BaseadoSmoker HPA DEBUG] Action: go_to_items_baseado_generic. Current page: ${window.location.pathname}`);
            if (isItemsPage() && window.location.pathname.includes(`/${actionCharId}`)) {
                updateStatus(`Looking for any "${config.baseadoSearchName}" on Items page...`);
                const itemLinkSelector = `table.data td:nth-child(2) a:contains("${config.baseadoSearchName}")`;
                console.log(`[PM BaseadoSmoker HPA DEBUG] Item selector: ${itemLinkSelector}`);
                const $itemLinks = $(itemLinkSelector);

                if ($itemLinks.length > 0) {
                    console.log(`[PM BaseadoSmoker HPA DEBUG] Found ${$itemLinks.length} item(s) matching "${config.baseadoSearchName}". Clicking first one.`);
                    if (await clickElement($itemLinks.first(), `first available "${config.baseadoSearchName}" link`)) {
                        console.log(`[PM BaseadoSmoker HPA DEBUG] Clicked item link. Setting session action to use_any_baseado_on_details.`);
                        sessionStorage.setItem(SESSION_ACTION_KEY, `use_any_baseado_on_details:${actionCharId}`);
                    } else {
                        logAction(`Error: Failed to click found "${config.baseadoSearchName}" link. Resetting cycle.`, true);
                        console.error(`[PM BaseadoSmoker HPA DEBUG] Failed to click item link.`);
                        config.baseadoCurrentCycleUsesCompleted = 0;
                        saveConfig(false);
                        navigateTo(returnToCharPageUrl);
                    }
                } else {
                    logAction(`Error: No item named "${config.baseadoSearchName}" found on Items page. Resetting cycle.`, true);
                    console.error(`[PM BaseadoSmoker HPA DEBUG] No item found with selector: ${itemLinkSelector}`);
                    config.baseadoCurrentCycleUsesCompleted = 0;
                    saveConfig(false);
                    navigateTo(returnToCharPageUrl);
                }
            } else {
                logAction(`Error: Not on correct Items page for ${actionType}. Current: ${window.location.pathname}. Expected: .../Items/${actionCharId}`, true);
                console.error(`[PM BaseadoSmoker HPA DEBUG] Mismatch items page. Path: ${window.location.pathname}, Expected CharID: ${actionCharId}`);
                navigateTo(returnToCharPageUrl);
            }
        } else if (actionType === "use_any_baseado_on_details") {
            console.log(`[PM BaseadoSmoker HPA DEBUG] Action: use_any_baseado_on_details. Current page: ${window.location.pathname}`);
            if (isItemDetailsPage()) {
                updateStatus(`Attempting to use current item (assumed ${config.baseadoSearchName})...`);
                console.log(`[PM BaseadoSmoker HPA DEBUG] Use Item button selector: ${SELECTORS.useItemButton}`);

                const useButtonExists = $(SELECTORS.useItemButton).length > 0;

                if (useButtonExists) {
                    if (await clickElement(SELECTORS.useItemButton, `Use Item button for current item`)) {
                        console.log(`[PM BaseadoSmoker HPA DEBUG] Clicked "Use Item" button. Calling recordBaseadoUse.`);
                        recordBaseadoUse();
                        navigateTo(returnToCharPageUrl);
                    } else {
                        logAction(`Error: Failed to click "Use Item" button (it was present, but click failed). Cycle may be broken. Returning to character page.`, true);
                        console.error(`[PM BaseadoSmoker HPA DEBUG] Failed to click "Use Item" button (it existed).`);
                        navigateTo(returnToCharPageUrl);
                    }
                } else {
                    // "Use Item" button was NOT found
                    logAction(`Error: "Use Item" button (${SELECTORS.useItemButton}) not found on details page. Assuming logout. Navigating to login page.`, true);
                    console.error(`[PM BaseadoSmoker HPA DEBUG] "Use Item" button not found. Redirecting to login.`);
                    updateStatus("Use Item button not found. Redirecting to login...", true);
                    sessionStorage.removeItem(SESSION_ACTION_KEY); // Clean up session action
                    navigateTo(LOGIN_PAGE_PATH); // Navigate to the main login page
                }
            } else {
                // This 'else' means we are not on an item details page, though we expected to be.
                logAction(`Error: Not on an Item Details page for ${actionType} action. Current: ${window.location.pathname}. Returning to character page.`, true);
                console.error(`[PM BaseadoSmoker HPA DEBUG] Mismatch item details page for use action. Path: ${window.location.pathname}`);
                navigateTo(returnToCharPageUrl);
            }
        } else {
            logAction(`Unknown Baseado session action: ${actionType}. Clearing and returning to character page.`, true);
            console.warn(`[PM BaseadoSmoker HPA DEBUG] Unknown session action: ${actionType}`);
            navigateTo(returnToCharPageUrl);
        }
    }

    let nextCheckScheduledTime = 0;
    function scheduleNextCheck(delaySeconds = config.checkInterval) {
        stopTimers();
        if (!config.scriptEnabled) {
            updateStatus("Baseado Smoker script disabled.");
            updateUIDisplayLoop();
            return;
        }
        if (isActionInProgress || sessionStorage.getItem(SESSION_ACTION_KEY) || isLoginOrCharSelectInProgress) {
             console.warn(`[PM BaseadoSmoker Sched] Scheduling aborted (isActionInProgress: ${isActionInProgress}, Session: ${!!sessionStorage.getItem(SESSION_ACTION_KEY)}, LoginBusy: ${isLoginOrCharSelectInProgress})`);
             updateUIDisplayLoop();
             return;
        }
        nextCheckScheduledTime = Date.now() + (delaySeconds * 1000);
        console.log(`[PM BaseadoSmoker Sched] Scheduling next logic check in ${delaySeconds}s.`);
        refreshTimerId = setTimeout(runCheck, delaySeconds * 1000);
        updateUIDisplayLoop();
    }

    function updateUIDisplayLoop() {
        if (countdownIntervalId) clearInterval(countdownIntervalId);

        function updateDisplay() {
            updateBaseadoStatusDisplay();
            const panelStatusEl = $('#pmBaseadoPanelStatus');
            if (!panelStatusEl.length) return;

            if (isActionInProgress || sessionStorage.getItem(SESSION_ACTION_KEY) || isLoginOrCharSelectInProgress) {
                return;
            }
            if (!config.scriptEnabled) {
                if (currentStatus !== "Baseado Smoker script disabled.") updateStatus("Baseado Smoker script disabled.");
                return;
            }
            if (!config.baseadoAutomationEnabled && config.scriptEnabled) {
                 if (currentStatus !== "Baseado Automation is Off. Waiting.") updateStatus("Baseado Automation is Off. Waiting.");
                 return;
            }
             if ((!config.baseadoSearchName || !config.baseadoSearchName.trim()) && config.scriptEnabled && config.baseadoAutomationEnabled) {
                 if (currentStatus !== "Baseado Item Name for search is not set in settings!") updateStatus("Baseado Item Name for search is not set in settings!", true);
                 return;
            }

            if (refreshTimerId && nextCheckScheduledTime > 0) {
                const remainingMs = nextCheckScheduledTime - Date.now();
                const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
                if (remainingSeconds > 0) {
                    if (!currentStatus.toLowerCase().includes("error") &&
                        !currentStatus.includes("Using") && !currentStatus.includes("Navigating") &&
                        !currentStatus.includes("Logging in") && !currentStatus.includes("Refreshing") &&
                        !currentStatus.includes("Selecting char")) {
                         updateStatus(`Next logic check in ${remainingSeconds}s.`);
                    }
                }
            }
        }
        updateDisplay();
        countdownIntervalId = setInterval(updateDisplay, 1000);
    }
    function verifyBaseadoNameOnItemsPage() {
        if (!isItemsPage()) {
            alert("This function helps verify the item name on the 'Character Items' page.");
            return;
        }
        const searchName = config.baseadoSearchName ? config.baseadoSearchName.trim() : "";
        if (!searchName) {
            alert("Please set the 'Item Name to Search For' in settings first.");
            return;
        }
        const itemLinkSelector = `table.data td:nth-child(2) a:contains("${searchName}")`;
        const $itemLinks = $(itemLinkSelector);
        if ($itemLinks.length > 0) {
            alert(`Found ${$itemLinks.length} item(s) containing the name "${searchName}" on this page. The script will attempt to use the first one it finds during automation.`);
            logAction(`Verified: Found ${$itemLinks.length} items matching "${searchName}".`);
        } else {
            alert(`Could not find any item containing the name "${searchName}" on this page. Please check the name in settings (it's case-sensitive for Popmundo links).`);
            logAction(`Verification failed: No items matching "${searchName}" found.`, true);
        }
    }

    function createControlPanel() {
        if ($('#pmBaseadoPanel').length) return;
        const panelHTML = `
            <div id="pmBaseadoPanel">
                <h4><i class="fa-solid fa-joint"></i> AutoUse Baseado <span>v${scriptVersion}</span></h4>
                <div class="pm-tabs">
                    <button class="pm-tab-button active" data-tab="status"><i class="fa-solid fa-bong"></i> Control</button>
                    <button class="pm-tab-button" data-tab="settings"><i class="fa-solid fa-sliders"></i> Settings</button>
                    <button class="pm-tab-button" data-tab="login"><i class="fa-solid fa-key"></i> Login</button>
                    <button class="pm-tab-button" data-tab="log"><i class="fa-solid fa-clipboard-list"></i> Log</button>
                </div>
                <div class="pm-tab-content-wrapper">
                    <div class="pm-tab-content active" id="pm-tab-status">
                         <label class="pm-toggle-label">
                            <input type="checkbox" id="pmBaseadoScriptToggle" ${config.scriptEnabled ? 'checked' : ''}>
                            <span class="pm-toggle-switch"></span>
                            <span class="pm-toggle-label-text">Enable Script</span>
                        </label>
                        <div class="pm-separator"></div>
                        <label class="pm-toggle-label">
                            <input type="checkbox" id="pmBaseadoAutomationToggle" ${config.baseadoAutomationEnabled ? 'checked' : ''}>
                            <span class="pm-toggle-switch"></span>
                            <span class="pm-toggle-label-text">Enable Baseado Automation</span>
                        </label>
                        <div class="pm-stat-display" style="margin-top: 10px;">
                            <span><i class="fa-solid fa-fire"></i> Cycle Status:</span>
                            <span id="pmBaseadoCycleStatus" class="pm-value">N/A</span>
                        </div>
                        <div id="pmBaseadoPanelStatus" class="pm-status-box" style="margin-top:10px;">${currentStatus}</div>
                         <div class="pm-text-info" style="margin-top: 8px;">
                            <i class="fa-solid fa-info-circle"></i>Uses any available "${config.baseadoSearchName || 'item'}" once, then waits ${formatTime(config.baseadoIntervalSeconds)}.
                        </div>
                    </div>
                    <div class="pm-tab-content" id="pm-tab-settings">
                        <div class="pm-section-header"><i class="fa-solid fa-cog"></i> Baseado Configuration</div>
                        <div>
                            <label for="pmBaseadoSearchName"><i class="fa-solid fa-tag"></i> Item Name to Search For:</label>
                            <input type="text" id="pmBaseadoSearchName" value="${config.baseadoSearchName || ''}" placeholder="e.g., Baseado">
                             <button id="pmVerifyBaseadoNameButton" class="pm-small-button" style="margin-top: 3px; width: 100%;"><i class="fa-solid fa-search-plus"></i> Verify Name on Items Page</button>
                            <div class="pm-text-info">Enter the <b>exact name</b> of the item (case-sensitive).</div>
                        </div>
                        <div class="pm-separator"></div>
                        <div class="pm-section-header"><i class="fa-solid fa-clock-rotate-left"></i> Script Timings</div>
                        <div>
                            <label for="pmBaseadoCheckInterval"><i class="fa-solid fa-stopwatch"></i> Idle Check Interval (sec):</label>
                            <input type="number" id="pmBaseadoCheckInterval" min="10" value="${config.checkInterval}">
                            <div class="pm-text-info">How often the script checks status when idle (min: 10s). If 'Refresh on Idle' is active, this is also the refresh interval on the character page.</div>
                        </div>
                        <div style="margin-top: 10px;">
                             <label class="pm-toggle-label" style="margin-bottom: 5px;">
                                <input type="checkbox" id="pmRefreshCharacterPageOnIdleToggle" ${config.refreshCharacterPageOnIdle ? 'checked' : ''}>
                                <span class="pm-toggle-switch"></span>
                                <span class="pm-toggle-label-text" style="font-size:12px; font-weight:normal;">Refresh Character Page on Idle</span>
                            </label>
                            <div class="pm-text-info">If enabled, when on the character page and the script is idle (e.g., during Baseado cooldown), the page will refresh after the 'Idle Check Interval' instead of just a silent logic check.</div>
                        </div>
                         <div class="pm-separator"></div>
                        <div class="pm-section-header"><i class="fa-solid fa-user-cog"></i> Character Info (Auto-detected)</div>
                        <div>
                            <label><i class="fa-solid fa-id-badge"></i> Detected Character ID:</label>
                            <input type="text" id="pmDetectedCharId" value="${config.characterId || 'N/A'}" readonly class="pm-input-disabled">
                        </div>
                        <div>
                            <label><i class="fa-solid fa-link"></i> Detected Character Page:</label>
                            <input type="text" id="pmDetectedCharUrl" value="${config.characterPageUrl || 'N/A'}" readonly class="pm-input-disabled">
                        </div>
                    </div>
                    <div class="pm-tab-content" id="pm-tab-login">
                        <div class="pm-section-header"><i class="fa-solid fa-right-to-bracket"></i> Auto-Login Credentials</div>
                        <div>
                            <label for="pmLoginUsername"><i class="fa-solid fa-user"></i> Username:</label>
                            <input type="text" id="pmLoginUsername" value="${config.loginUsername || ''}" autocomplete="username" placeholder="Your Popmundo username">
                        </div>
                        <div style="margin-top:8px;">
                            <label for="pmLoginPassword"><i class="fa-solid fa-key"></i> Password:</label>
                            <input type="password" id="pmLoginPassword" autocomplete="new-password" placeholder="Enter password to save/update">
                            <div class="pm-text-info pm-warning-text"><i class="fa-solid fa-triangle-exclamation"></i> Password is saved locally using Tampermonkey storage. Use at your own risk on shared computers.</div>
                        </div>
                        <div class="pm-separator"></div>
                         <div class="pm-section-header"><i class="fa-solid fa-users"></i> Auto Character Selection</div>
                        <div style="margin-top:8px;">
                            <label for="pmSelectedCharName"><i class="fa-solid fa-id-card-clip"></i> Character First Name:</label>
                            <input type="text" id="pmSelectedCharName" value="${config.selectedCharacterName || ''}" placeholder="e.g., John (for auto-selection)">
                             <div class="pm-text-info">Used if login leads to the character selection page. Enter the character's first name exactly.</div>
                        </div>
                    </div>
                     <div class="pm-tab-content" id="pm-tab-log">
                         <div class="pm-log-header">
                            <div><i class="fa-solid fa-clipboard-list"></i> Action Log:</div>
                            <button id="pmBaseadoClearLogButton" class="pm-clear-button" title="Clear Log"><i class="fa-solid fa-broom"></i> Clear</button>
                         </div>
                         <div id="pmBaseadoActionLog"></div>
                    </div>
                </div>
                <button id="pmBaseadoSaveConfig" class="pm-save-button"><i class="fa-solid fa-save"></i> Save Settings & Login Info</button>
                <div class="pm-signature"></div>
            </div>`;
        $('body').append(panelHTML);

        const panelElement = $('#pmBaseadoPanel');
        try {
            const savedPosition = GM_getValue(PANEL_POSITION_KEY, null);
            if (savedPosition && savedPosition.top && savedPosition.left) {
                panelElement.css({ top: savedPosition.top, left: savedPosition.left, right: 'auto' });
            }
        } catch (loadErr) { console.error("[PM BaseadoSmoker Drag] Error loading panel position:", loadErr); }

        panelElement.fadeIn(300, function() {
            updateActionLogDisplay();
            updateStatus(currentStatus);
            updateUIDisplayLoop();
        });

        $('.pm-tab-button').on('click', function() {
            const tabId = $(this).data('tab');
            $('.pm-tab-button').removeClass('active');
            $('.pm-tab-content').removeClass('active');
            $(this).addClass('active');
            $('#pm-tab-' + tabId).addClass('active');
        });

        $('#pmBaseadoScriptToggle').on('change', function() {
            config.scriptEnabled = $(this).is(':checked');
            logAction(`Script ${config.scriptEnabled ? 'enabled' : 'disabled'}.`);
            if (config.scriptEnabled) {
                if (!config.characterId && !isLoginPage() && !isCharacterSelectionPage()) {
                    const currentUrl = getCharacterPageUrl();
                    const currentId = currentUrl ? getCharacterId(currentUrl) : null;
                    if (currentId && currentUrl) {
                        config.characterId = currentId; config.characterPageUrl = currentUrl;
                        if ($('#pmDetectedCharId').length) $('#pmDetectedCharId').val(currentId);
                        if ($('#pmDetectedCharUrl').length) $('#pmDetectedCharUrl').val(currentUrl);
                    }
                }
                updateStatus("Script enabled. Initializing checks...");
                stopTimers();
                const refreshJustHappened = sessionStorage.getItem(REFRESH_FLAG_KEY);
                if (!refreshJustHappened || (refreshJustHappened && !config.refreshCharacterPageOnIdle) ) {
                    setTimeout(runCheck, 500);
                } else {
                     console.log("[PM BaseadoSmoker UI] Script enabled, but refresh flag is set and refresh on idle is on. runCheck will be scheduled by init or next cycle respecting interval.");
                }
            } else {
                stopTimers();
                updateStatus("Script disabled.");
                sessionStorage.removeItem(SESSION_ACTION_KEY);
            }
            saveConfig(false);
        });

        $('#pmBaseadoAutomationToggle').on('change', function() {
            config.baseadoAutomationEnabled = $(this).is(':checked');
            logAction(`Baseado automation ${config.baseadoAutomationEnabled ? 'enabled' : 'disabled'}.`);
            if (config.baseadoAutomationEnabled && config.scriptEnabled && !refreshTimerId && !isLoginPage() && !isCharacterSelectionPage()) {
                 const refreshJustHappened = sessionStorage.getItem(REFRESH_FLAG_KEY);
                 if (!refreshJustHappened || (refreshJustHappened && !config.refreshCharacterPageOnIdle) ) {
                    setTimeout(runCheck, 500);
                 } else {
                     console.log("[PM BaseadoSmoker UI] Automation enabled, but refresh flag is set and refresh on idle is on. runCheck will be scheduled by init or next cycle.");
                 }
            }
            saveConfig(false);
        });

        $('#pmBaseadoSearchName').on('change', function() {
            config.baseadoSearchName = $(this).val().trim();
            const newText = `Uses any available "${config.baseadoSearchName || 'item'}" once, then waits ${formatTime(config.baseadoIntervalSeconds)}.`;
            if ($('#pmBaseadoPanel .pm-tab-content#pm-tab-status .pm-text-info').length) {
                $('#pmBaseadoPanel .pm-tab-content#pm-tab-status .pm-text-info').html(`<i class="fa-solid fa-info-circle"></i>${newText}`);
            }
        });
        $('#pmVerifyBaseadoNameButton').on('click', verifyBaseadoNameOnItemsPage);

        $('#pmBaseadoSaveConfig').on('click', function() {
            config.baseadoSearchName = $('#pmBaseadoSearchName').val().trim();
            config.checkInterval = Math.max(10, parseInt($('#pmBaseadoCheckInterval').val()) || DEFAULT_CONFIG.checkInterval);
            $('#pmBaseadoCheckInterval').val(config.checkInterval);
            config.refreshCharacterPageOnIdle = $('#pmRefreshCharacterPageOnIdleToggle').is(':checked');
            config.loginUsername = $('#pmLoginUsername').val().trim() || null;
            config.selectedCharacterName = $('#pmSelectedCharName').val().trim() || null;

            const passwordInput = $('#pmLoginPassword').val();
            if (passwordInput) {
                GM_setValue(LOGIN_PASSWORD_GM_KEY, passwordInput);
                logAction("🔑 Login password updated and saved separately.");
                $('#pmLoginPassword').val('');
            } else if (!config.loginUsername && !GM_getValue(LOGIN_PASSWORD_GM_KEY, null)) {
                GM_deleteValue(LOGIN_PASSWORD_GM_KEY);
            }
            saveConfig(true);
        });

        $('#pmBaseadoClearLogButton').on('click', clearActionLog);

        const handle = panelElement.find('h4');
        let isDragging = false; let dragOffset = { x: 0, y: 0 };
        handle.on('mousedown', function(e) { if (e.target !== this && !$(e.target).is('h4 > i, h4 > span')) return; isDragging = true; panelElement.addClass('pm-dragging'); const panelOffset = panelElement.offset(); if (panelElement.css('right') !== 'auto' && panelElement.css('left') === 'auto') { const currentRight = parseFloat(panelElement.css('right')); const panelWidth = panelElement.outerWidth(); const windowWidth = $(window).width(); const initialLeft = windowWidth - panelWidth - currentRight; panelElement.css({ left: initialLeft + 'px', right: 'auto' }); if(panelOffset) panelOffset.left = initialLeft; } dragOffset.x = e.pageX - (panelOffset ? panelOffset.left:0); dragOffset.y = e.pageY - (panelOffset ? panelOffset.top:0); e.preventDefault(); });
        $(document).on('mousemove.pmBaseadoDrag', function(e) { if (!isDragging) return; let newLeft = e.pageX - dragOffset.x; let newTop = e.pageY - dragOffset.y; const winW = $(window).width(); const winH = $(window).height(); const panelW = panelElement.outerWidth(); const panelH = panelElement.outerHeight(); newLeft = Math.max(0, Math.min(newLeft, winW - panelW)); newTop = Math.max(0, Math.min(newTop, winH - panelH)); panelElement.css({ top: newTop + 'px', left: newLeft + 'px', right: 'auto' }); });
        $(document).on('mouseup.pmBaseadoDrag', function() { if (isDragging) { isDragging = false; panelElement.removeClass('pm-dragging'); try { GM_setValue(PANEL_POSITION_KEY, { top: panelElement.css('top'), left: panelElement.css('left') }); } catch (saveErr) { console.error("[PM BaseadoSmoker Drag] Error saving panel position:", saveErr); } } });
    }

    // --- CSS ---
    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        :root {
            --pm-font-family: 'Roboto', 'Segoe UI', sans-serif;
            --pm-bg-color: #f4f6f8; --pm-text-color: #333; --pm-text-color-secondary: #6c757d;
            --pm-border-color: #ced4da; --pm-subtle-bg: #ffffff; --pm-input-bg: #ffffff;
            --pm-input-border: var(--pm-border-color); --pm-input-text: var(--pm-text-color);
            --pm-button-bg: #007bff; --pm-button-hover-bg: #0056b3; --pm-button-text: #ffffff;
            --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #e9ecef; --pm-tab-hover-bg: #dde2e6;
            --pm-accent-color: #17a2b8; --pm-shadow-color: rgba(0, 0, 0, 0.1);
            --pm-success-color: #28a745; --pm-error-color: #dc3545; --pm-warning-color: #ffc107;
            --pm-info-color: #007bff; --pm-delete-color: #c82333; --pm-delete-hover-color: var(--pm-error-color);
            --pm-log-bg: #eef1f3;
            --pm-value-ok: var(--pm-text-color); --pm-value-success: var(--pm-success-color);
            --pm-value-error: var(--pm-error-color); --pm-value-warning: #e0a800;
            --pm-value-accent: var(--pm-accent-color); --pm-value-secondary: var(--pm-text-color-secondary);
        }
        #pmBaseadoPanel {
            position: fixed; top: 10px; right: 10px; background-color: var(--pm-bg-color);
            border: 1px solid var(--pm-border-color); padding: 0; z-index: 10003;
            width: 330px; font-family: var(--pm-font-family); font-size: 12px; color: var(--pm-text-color);
            box-shadow: 0 4px 12px var(--pm-shadow-color); border-radius: 6px; overflow: hidden; display: none;
        }
        #pmBaseadoPanel i.fas, #pmBaseadoPanel i.far, #pmBaseadoPanel i.fa-brands, #pmBaseadoPanel i.fa-regular, #pmBaseadoPanel i.fa-solid {
             margin-right: 5px; width: 1.1em; text-align: center; vertical-align: middle; display: inline-block;
             font-style: normal; font-variant: normal; text-rendering: auto; -webkit-font-smoothing: antialiased;
             font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
        }
        #pmBaseadoPanel i.fas, #pmBaseadoPanel i.fa-solid { font-weight: 900; }
        #pmBaseadoPanel i.far, #pmBaseadoPanel i.fa-regular { font-weight: 400; }
        #pmBaseadoPanel i.fa-brands { font-weight: 400; }
        #pmBaseadoPanel h4 {
            margin: 0; padding: 10px 14px; text-align: center; font-size: 15px; font-weight: 700;
            background-color: var(--pm-bg-color); color: var(--pm-text-color);
            border-bottom: 1px solid var(--pm-border-color); border-radius: 5px 5px 0 0;
            display: flex; align-items: center; justify-content: center; cursor: move; user-select: none;
        }
        #pmBaseadoPanel h4 i.fa-solid { margin-right: 8px; color: var(--pm-accent-color); }
        #pmBaseadoPanel h4 span { font-size: 9px; color: var(--pm-text-color-secondary); margin-left: 6px; font-weight: 400; }
        .pm-tabs { display: flex; background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); }
        .pm-tab-button {
            flex: 1; padding: 9px 6px; border: none; background: var(--pm-tab-inactive-bg);
            color: var(--pm-text-color-secondary); cursor: pointer; font-size: 11px; font-weight: 700;
            transition: all 0.25s ease; text-align: center; border-bottom: 2px solid transparent;
            margin-bottom: -1px; display: flex; align-items: center; justify-content: center;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pm-tab-button:hover { background: var(--pm-tab-hover-bg); color: var(--pm-text-color); }
        .pm-tab-button.active { color: var(--pm-accent-color); border-bottom-color: var(--pm-accent-color); background: var(--pm-tab-active-bg); }
        .pm-tab-button i.fa-solid { margin-right: 4px; }
        .pm-tab-content-wrapper { padding: 12px; max-height: 500px; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: var(--pm-text-color-secondary) var(--pm-subtle-bg); }
        .pm-tab-content { display: none; animation: pmFadeIn 0.4s ease; }
        .pm-tab-content.active { display: block; }
        @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pm-section-header { font-weight: bold; font-size: 11px; color: var(--pm-text-color); margin-bottom: 8px; margin-top: 5px; padding-bottom: 4px; border-bottom: 1px solid var(--pm-border-color); }
        .pm-section-header i.fa-solid { color: var(--pm-text-color-secondary); }
        #pmBaseadoPanel div[id^="pm-tab-"] > div:not(#pmBaseadoActionLog):not(.pm-stat-display):not(#pmBaseadoPanelStatus):not(.pm-log-header):not(.pm-section-header) { margin-bottom: 10px; }
        #pmBaseadoPanel label:not(.pm-toggle-label) { font-size: 11px; color: var(--pm-text-color-secondary); margin-bottom: 4px; display: block; font-weight: 600; }
        #pmBaseadoPanel label:not(.pm-toggle-label) i.fa-solid { width: 1.2em; }
        .pm-separator { height: 1px; background: var(--pm-border-color); margin: 12px 0; opacity: 0.8; }
        .pm-text-info { font-size: 10px; color: var(--pm-text-color-secondary); margin-top: 3px; line-height: 1.35; display: flex; align-items: flex-start; }
        .pm-text-info i.fa-solid { margin-right: 4px; flex-shrink: 0; margin-top: 1px;}
        .pm-text-info.pm-warning-text { color: var(--pm-warning-color); font-weight: bold; }
        #pmBaseadoPanel label.pm-toggle-label { display: flex; align-items: center; font-size: 13px; margin-bottom: 10px; cursor: pointer; color: var(--pm-text-color); position: relative; user-select: none; font-weight: bold; }
        .pm-toggle-label input[type="checkbox"] { opacity: 0; width: 0; height: 0; position: absolute; }
        .pm-toggle-switch {
            position: relative; display: inline-block; flex-shrink: 0; width: 40px; height: 20px; background-color: #ccc;
            border-radius: 10px; transition: background-color 0.3s ease; cursor: pointer; margin-right: 10px; vertical-align: middle;
            border: 1px solid rgba(0,0,0,0.1);
        }
        .pm-toggle-switch::before {
            content: ""; position: absolute; width: 14px; height: 14px; border-radius: 50%; background-color: white;
            top: 2px; left: 2px; transition: transform 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .pm-toggle-label input[type="checkbox"]:checked + .pm-toggle-switch { background-color: var(--pm-success-color); }
        .pm-toggle-label input[type="checkbox"]:checked + .pm-toggle-switch::before { transform: translateX(20px); }
        .pm-toggle-label-text { vertical-align: middle; line-height: 20px; }
        .pm-stat-display {
            display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; margin: 3px 0;
            background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); border-left: 4px solid var(--pm-border-color);
            border-radius: 4px; transition: all 0.2s ease; flex-wrap: nowrap; gap: 6px;
        }
        .pm-stat-display:hover { border-left-color: var(--pm-accent-color); background-color: #f8f9fa; }
        .pm-stat-display span:first-child { color: var(--pm-text-color-secondary); font-size: 11px; margin-right: 6px; display: flex; align-items: center; flex-shrink: 0; }
        .pm-stat-display span:first-child i.fa-solid { color: var(--pm-text-color-secondary); }
        .pm-stat-display .pm-value { font-weight: 700; font-size: 12px; text-align: right; display: flex; align-items: center; flex-grow: 1; justify-content: flex-end; }
        #pmBaseadoCycleStatus { min-width: 120px; text-align: right; }

        #pmBaseadoPanel input[type="text"], #pmBaseadoPanel input[type="password"], #pmBaseadoPanel input[type="number"], #pmBaseadoPanel select {
            width: 100%; padding: 7px 9px; border: 1px solid var(--pm-input-border); background: var(--pm-input-bg);
            color: var(--pm-input-text); border-radius: 4px; transition: all 0.2s ease; font-size: 12px;
            box-sizing: border-box; font-family: var(--pm-font-family); margin-top: 2px;
        }
        #pmBaseadoPanel .pm-input-disabled {
            background-color: #e9ecef !important; cursor: not-allowed; opacity: 0.8;
            border-color: #ced4da; color: #6c757d;
        }
        #pmBaseadoPanel input:focus, #pmBaseadoPanel select:focus {
            border-color: var(--pm-accent-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--pm-accent-color) 25%, transparent);
            outline: none; background-color: var(--pm-input-bg);
        }
        #pmBaseadoPanel button.pm-save-button {
            width: 100%; padding: 9px 14px; margin: 12px 0 0; background: var(--pm-button-bg);
            color: var(--pm-button-text); border: none; border-radius: 4px; font-weight: 700; font-size: 13px;
            cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center;
        }
        #pmBaseadoPanel button.pm-save-button:hover { background: var(--pm-button-hover-bg); transform: translateY(-1px); box-shadow: 0 3px 7px rgba(0,0,0,0.15); }
        #pmBaseadoPanel button.pm-save-button i.fa-solid { margin-right: 7px; }
         #pmBaseadoPanel button.pm-small-button, #pmBaseadoPanel button.pm-clear-button {
            background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); color: var(--pm-text-color-secondary);
            font-size: 11px; padding: 4px 10px; border-radius: 3px; cursor: pointer;
            transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center;
            font-weight: 600; width: auto; box-shadow: none;
        }
        #pmBaseadoPanel button.pm-small-button i.fa-solid, #pmBaseadoPanel button.pm-clear-button i.fa-solid { margin-right: 6px; }
        #pmBaseadoPanel button.pm-small-button:hover { background: #e2e6ea; border-color: #adb5bd; color: var(--pm-text-color); }

        .pm-status-box {
            font-size: 11px; padding: 7px 12px; margin-top: 10px; background: var(--pm-subtle-bg);
            border: 1px solid var(--pm-border-color); border-left: 4px solid var(--pm-border-color);
            border-radius: 4px; transition: all 0.3s ease; word-break: break-word; text-align: center;
            color: var(--pm-text-color-secondary); display: flex; align-items: center; justify-content: center;
            min-height: 1.4em; box-sizing: content-box;
        }
        .pm-status-box i.fa-solid { margin-right: 7px; }
        .pm-status-box.pm-status-normal { border-left-color: var(--pm-info-color); color: var(--pm-info-color); }
        .pm-status-box.pm-status-success { background: #d4edda; border-left-color: var(--pm-success-color); color: #155724; }
        .pm-status-box.pm-status-error { background: #f8d7da; border-left-color: var(--pm-error-color); color: #721c24; }
        .pm-status-box.pm-status-accent { border-left-color: var(--pm-accent-color); color: var(--pm-accent-color); }
        .pm-log-header { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; margin-bottom: 4px; }
        .pm-log-header > div { font-size: 11px; color: var(--pm-text-color-secondary); font-weight: bold; }
        .pm-log-header i.fa-solid { margin-right: 5px; }
        #pmBaseadoActionLog {
            font-size: 10px; max-height: 150px; overflow-y: auto; padding: 8px 10px;
            background: var(--pm-log-bg); border: 1px solid var(--pm-border-color); border-radius: 4px;
            margin-top: 5px; color: var(--pm-text-color-secondary); scrollbar-width: thin;
            scrollbar-color: var(--pm-text-color-secondary) var(--pm-log-bg);
        }
        #pmBaseadoActionLog .pm-log-entry {
            margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed #d8dde1;
            animation: logFadeIn 0.5s ease forwards; word-break: break-word; opacity:0; line-height: 1.35;
            display: flex; align-items: flex-start;
        }
        #pmBaseadoActionLog .pm-log-entry:last-child { border-bottom: none; }
        .pm-log-entry i.fa-solid { margin-right: 6px; margin-top: 1px; flex-shrink: 0; }
        .pm-log-entry i.pm-log-success { color: var(--pm-success-color); }
        .pm-log-entry i.pm-log-error { color: var(--pm-error-color); }
        .pm-log-entry i.pm-log-warning { color: var(--pm-warning-color); }
        .pm-log-entry i.pm-log-info { color: var(--pm-info-color); }
        .pm-log-entry i.pm-log-accent { color: var(--pm-accent-color); }
        .pm-log-entry i.pm-log-secondary { color: var(--pm-text-color-secondary); }
        .pm-log-empty { text-align: center; padding: 10px; color: var(--pm-text-color-secondary); font-style: italic; font-size: 11px; }
        .pm-log-empty-icon { display: block; margin-bottom: 5px; font-size: 20px; color: #bdc3c7; }
        @keyframes logFadeIn { to { opacity: 1; } }
        #pmBaseadoPanel.pm-dragging { opacity: 0.9; box-shadow: 0 8px 25px rgba(0,0,0,0.25); user-select: none; -webkit-user-select: none; -ms-user-select: none; }
        .pm-signature { padding: 8px 14px; text-align: center; font-size: 10px; color: var(--pm-text-color-secondary); background-color: var(--pm-bg-color); margin-top: 10px; border-top: 1px solid var(--pm-border-color); }
    `);

    // --- Initialization ---
    function init() {
        console.log(`[PM BaseadoSmoker v${scriptVersion}] Entering init() function.`);
        updateStatus("Initializing...");
        loadConfig();
        createControlPanel();

        const currentUrl = getCharacterPageUrl();
        const currentId = currentUrl ? getCharacterId(currentUrl) : null;
        let configWasModifiedInInit = false;
        if (currentId && currentUrl) {
            if (config.characterPageUrl !== currentUrl || config.characterId !== currentId) {
                 config.characterPageUrl = currentUrl;
                 config.characterId = currentId;
                 config.baseadoLastCycleCompletionTimestamp = 0;
                 config.baseadoCurrentCycleUsesCompleted = 0;
                 configWasModifiedInInit = true;
            }
            if ($('#pmDetectedCharId').length) $('#pmDetectedCharId').val(currentId);
            if ($('#pmDetectedCharUrl').length) $('#pmDetectedCharUrl').val(currentUrl);
        }
        if (configWasModifiedInInit) saveConfig(false);

        const initialRefreshJustHappened = sessionStorage.getItem(REFRESH_FLAG_KEY);
        if (initialRefreshJustHappened) {
            console.log("[PM BaseadoSmoker INIT] Detected that a refresh just happened from session flag.");
        }

        if (config.scriptEnabled) {
            logAction("Script enabled on load. Initializing checks.");
            updateStatus("Script enabled. Initializing checks...");
            stopTimers();
            if (initialRefreshJustHappened && config.refreshCharacterPageOnIdle) {
                console.log("[PM BaseadoSmoker INIT] Refresh flag set and refresh on idle is active, scheduling runCheck after checkInterval.");
                setTimeout(runCheck, config.checkInterval * 1000 + Math.random() * 300);
            } else {
                if(initialRefreshJustHappened) sessionStorage.removeItem(REFRESH_FLAG_KEY);
                console.log("[PM BaseadoSmoker INIT] No (or irrelevant) refresh flag, scheduling runCheck normally.");
                setTimeout(runCheck, 700 + Math.random() * 300);
            }
        } else {
            logAction("Script disabled on load.");
            updateStatus("Script disabled.");
            stopTimers();
            if(initialRefreshJustHappened) sessionStorage.removeItem(REFRESH_FLAG_KEY);
        }

        if (!countdownIntervalId) updateUIDisplayLoop();
        console.log(`[PM BaseadoSmoker v${scriptVersion}] Initialization complete.`);
    }

    try {
        setTimeout(init, 500);
    } catch (e) {
        console.error("[PM BaseadoSmoker FATAL] Error during top-level script execution or scheduling init:", e);
        alert("FATAL ERROR in Baseado Smoker. Check console immediately. Script may not run.");
    }

})();