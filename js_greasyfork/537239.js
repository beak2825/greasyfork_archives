// ==UserScript==
// @name         Popmundo Auto-Joint Roller
// @namespace    http://tampermonkey.net/
// @version      1.2.17
// @description  Uso automático de baseados para conquista de 24h chapado.
// @author       Mark
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Locale*
// @match        https://*.popmundo.com/World/Popmundo.aspx/ChooseCharacter*
// @match        https://*.popmundo.com/World/Popmundo.aspx* // @match        https://*.popmundo.com/Default.aspx*
// @match        https://*.popmundo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_info
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537239/Popmundo%20Auto-Joint%20Roller.user.js
// @updateURL https://update.greasyfork.org/scripts/537239/Popmundo%20Auto-Joint%20Roller.meta.js
// ==/UserScript==

/* eslint-env jquery, greasemonkey */

(function() {
    'use strict';

    const SCRIPT_ID = "PopmundoAutoJoint";
    const SCRIPT_VERSION = GM_info.script.version;
    const CONFIG_KEY_PREFIX = `${SCRIPT_ID}_config_v1_`;

    const ACTION_KEY = `${SCRIPT_ID}_action`;
    const DOUBLE_USE_ATTEMPT_COUNT_KEY = `${SCRIPT_ID}_double_attempt_count`;
    const JUST_CLICKED_USE_FLAG_KEY = `${SCRIPT_ID}_just_clicked_use_flag`;

    const LOGIN_USERNAME_KEY_GM = `${CONFIG_KEY_PREFIX}loginUsername`;
    const LOGIN_PASSWORD_KEY_GM = `${CONFIG_KEY_PREFIX}loginPassword`;
    const CHAR_SELECT_NAME_KEY_GM = `${CONFIG_KEY_PREFIX}charSelectName`;

    const DEFAULT_COOLDOWN_MINUTES = 45;
    const JOINT_ITEM_NAME = "Baseado";
    const CHECK_INTERVAL_MS = 5000;
    const PAGE_LOAD_DELAY_MS = 1500 + Math.random() * 1000;

    const SELECTORS = {
        characterLink: 'a:contains("Meu Personagem"):first',
        avatarLink: '.avatar.pointer[onclick*="/Character/"]',
        jointLinkInList: (itemName) => `table.data td:nth-child(2) a[href*="/Character/ItemDetails/"]:contains("${itemName}")`,
        useItemButton: 'input#ctl00_cphLeftColumn_ctl00_btnItemUse',
        gameNotificationError: 'div.notification-real.notification-error',
        gameMessageAreaFallback: '#ctl00_cphLeftColumn_ctl00_divInfo, div.charSheet',
        loginUsernameField: '#ctl00_cphLeftColumn_ucLogin_txtUsername, #ctl00_cphRightColumn_ucLogin_txtUsername',
        loginPasswordField: '#ctl00_cphLeftColumn_ucLogin_txtPassword, #ctl00_cphRightColumn_ucLogin_txtPassword',
        loginButton: '#ctl00_cphLeftColumn_ucLogin_btnLogin, #ctl00_cphRightColumn_ucLogin_btnLogin',
        chooseCharacterButton: (charName) => `input[type="submit"][value="Escolher ${charName}"]`,
    };

    const PAGE_URL_PATTERNS = {
        characterBase: "/World/Popmundo.aspx/Character",
        items: "/World/Popmundo.aspx/Character/Items",
        itemDetails: "/World/Popmundo.aspx/Character/ItemDetails",
        loginPagePath: "/",
        potentialErrorPageDefaultAspx: "/Default.aspx",
        chooseCharacter: "/World/Popmundo.aspx/ChooseCharacter",
        errorPageSuffix: "/Error.aspx",
        worldHomeGeneral: "/World/Popmundo.aspx/", // Para páginas como /World/Popmundo.aspx/News etc.
        explicitWorldMainPage: "/World/Popmundo.aspx", // A página específica que você mencionou
    };

    let config = {
        enabled: false,
        nextUseTimestamp: 0,
        lastDetectedCooldown: DEFAULT_COOLDOWN_MINUTES,
        characterPageUrl: null,
        loginUsername: "",
        characterNameToSelect: "",
    };
    let currentStatus = "Inicializando...";
    let countdownIntervalId = null;
    let mainLoopTimeoutId = null;
    let isActing = false;

    // Funções de Log e Utilitárias (pm_log, pm_error, pm_sleep, loadConfig, saveConfig, navigateTo, clickElement, getCurrentPath)
    // ... (Copie estas funções da v1.2.14 pois não houve alteração nelas) ...
    function pm_log(message) { console.log(`[${SCRIPT_ID} v${SCRIPT_VERSION}] ${message}`); if (typeof updateActionLog === "function" && $(`#${SCRIPT_ID}_actionLog`).length) { updateActionLog(`[${new Date().toLocaleTimeString()}] ${message}`); } }
    function pm_error(message, e) { console.error(`[${SCRIPT_ID} v${SCRIPT_VERSION}] ERROR: ${message}`, e || ''); updateStatus(`ERRO: ${message}`, true); if (typeof updateActionLog === "function" && $(`#${SCRIPT_ID}_actionLog`).length) { updateActionLog(`[${new Date().toLocaleTimeString()}] <span style="color:red;">ERRO: ${message}</span>`); } }
    function pm_sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function loadConfig() { config.enabled = GM_getValue(CONFIG_KEY_PREFIX + "enabled", false); config.nextUseTimestamp = GM_getValue(CONFIG_KEY_PREFIX + "nextUseTimestamp", 0); config.lastDetectedCooldown = GM_getValue(CONFIG_KEY_PREFIX + "lastDetectedCooldown", DEFAULT_COOLDOWN_MINUTES); config.characterPageUrl = GM_getValue(CONFIG_KEY_PREFIX + "characterPageUrl", null); config.loginUsername = GM_getValue(LOGIN_USERNAME_KEY_GM, ""); config.characterNameToSelect = GM_getValue(CHAR_SELECT_NAME_KEY_GM, ""); console.log(`[${SCRIPT_ID} v${SCRIPT_VERSION}] Configuração carregada.`); }
    function saveConfig() { GM_setValue(CONFIG_KEY_PREFIX + "enabled", config.enabled); GM_setValue(CONFIG_KEY_PREFIX + "nextUseTimestamp", config.nextUseTimestamp); GM_setValue(CONFIG_KEY_PREFIX + "lastDetectedCooldown", config.lastDetectedCooldown); GM_setValue(CONFIG_KEY_PREFIX + "characterPageUrl", config.characterPageUrl); const uiLoginUsername = $(`#${SCRIPT_ID}_loginUser`).val(); if (uiLoginUsername !== undefined) { config.loginUsername = uiLoginUsername; GM_setValue(LOGIN_USERNAME_KEY_GM, config.loginUsername); } const uiLoginPassword = $(`#${SCRIPT_ID}_loginPass`).val(); if (uiLoginPassword && uiLoginPassword.length > 0) { GM_setValue(LOGIN_PASSWORD_KEY_GM, uiLoginPassword); $(`#${SCRIPT_ID}_loginPass`).val(""); pm_log("Senha de login salva e campo limpo."); } const uiCharSelectName = $(`#${SCRIPT_ID}_charSelectName`).val(); if (uiCharSelectName !== undefined) { config.characterNameToSelect = uiCharSelectName.trim(); GM_setValue(CHAR_SELECT_NAME_KEY_GM, config.characterNameToSelect); } pm_log("Configuração salva."); }
    function resetActionSequenceAndStartCooldown(reason, isErr = true, cooldownMinutes) { isActing = false; pm_log(`resetActionSequenceAndStartCooldown: ${reason}. Cooldown: ${cooldownMinutes} min.`); updateStatus(reason, isErr); sessionStorage.removeItem(ACTION_KEY); sessionStorage.removeItem(DOUBLE_USE_ATTEMPT_COUNT_KEY); sessionStorage.removeItem(JUST_CLICKED_USE_FLAG_KEY); config.lastDetectedCooldown = cooldownMinutes; config.nextUseTimestamp = Date.now() + (cooldownMinutes * 60 * 1000); saveConfig(); const targetCharUrl = config.characterPageUrl ? config.characterPageUrl.split('?')[0] : null; const currentCharUrl = window.location.href.split('?')[0]; if (targetCharUrl && currentCharUrl !== targetCharUrl && !isLoginPage() && !isCharacterSelectionPage() && !isErrorPage()) { navigateTo(targetCharUrl); } else { runMainLoop(); } }
    function navigateTo(url) { if (!url) { pm_error("URL de navegação inválida."); resetActionSequenceAndStartCooldown("URL Nula para navegação", true, DEFAULT_COOLDOWN_MINUTES); return; } pm_log(`NAVEGANDO PARA: ${url}`); updateStatus(`Navegando para ${url.split('/').pop()}...`); window.location.href = url; }
    async function clickElement(selector, description) { const element = $(selector); if (element.length > 0) { pm_log(`Clicando em "${description}" (${selector})...`); updateStatus(`Clicando "${description}"...`); await pm_sleep(300 + Math.random() * 300); let clickedItem = null; element.each(function() { if ($(this).is(':visible')) { clickedItem = this; return false; } }); if (clickedItem) { clickedItem.click(); return true; } if (element.length > 0 && !clickedItem) { pm_log(`Nenhum visível para '${description}', tentando o primeiro.`); element[0].click(); return true; } pm_error(`Elemento "${description}" (${selector}) não encontrado/clicável.`); return false; } else { pm_error(`Elemento "${description}" (${selector}) não encontrado.`); return false; } }
    function getCurrentPath() { return window.location.pathname; }


    // Funções de Verificação de Página
    function isErrorPage() {
        const path = getCurrentPath();
        const specificError = path.endsWith(PAGE_URL_PATTERNS.errorPageSuffix); // /Error.aspx
        const defaultAspxError = (path === PAGE_URL_PATTERNS.potentialErrorPageDefaultAspx); // /Default.aspx
        // if (specificError || defaultAspxError) pm_log(`isErrorPage: true (path: ${path})`); // Log muito frequente
        return specificError || defaultAspxError;
    }
    function isLoginPage() {
        const path = getCurrentPath();
        if (isErrorPage()) return false;
        const isActualLoginPage = (path === PAGE_URL_PATTERNS.loginPagePath); // Apenas '/'
        if (!isActualLoginPage) return false;
        const usernameFieldExists = $(SELECTORS.loginUsernameField).filter(':visible').length > 0;
        const passwordFieldExists = $(SELECTORS.loginPasswordField).filter(':visible').length > 0;
        return usernameFieldExists && passwordFieldExists;
    }
    function isCharacterSelectionPage() { return getCurrentPath().startsWith(PAGE_URL_PATTERNS.chooseCharacter); }
    function isCharacterPage() {
        const path = getCurrentPath();
        return path.startsWith(PAGE_URL_PATTERNS.characterBase) &&
               !path.startsWith(PAGE_URL_PATTERNS.items) &&
               !path.startsWith(PAGE_URL_PATTERNS.itemDetails) &&
               !path.startsWith(PAGE_URL_PATTERNS.chooseCharacter);
    }
    function isBaseCharacterPage(path) {
        if (!path) return false;
        return !!path.match(new RegExp(`^${PAGE_URL_PATTERNS.characterBase}/\\d+$`));
    }
    function isItemsPage() { return getCurrentPath().startsWith(PAGE_URL_PATTERNS.items); }
    function isItemDetailsPage() { return getCurrentPath().startsWith(PAGE_URL_PATTERNS.itemDetails); }
    function isGeneralPopmundoPage() { // Para páginas como /World/Popmundo.aspx/News ou a própria /World/Popmundo.aspx
        const path = getCurrentPath();
        return path === PAGE_URL_PATTERNS.explicitWorldMainPage || path.startsWith(PAGE_URL_PATTERNS.worldHomeGeneral);
    }
    function getCharacterPageUrlFromPage() { /* ... (igual v1.2.14) ... */
        let charUrl = null; let charLink = $(SELECTORS.characterLink);
        if (charLink.length && charLink.attr('href')) { charUrl = charLink.attr('href'); }
        else { charLink = $(SELECTORS.avatarLink); if (charLink.length && charLink.attr('onclick')) { const match = charLink.attr('onclick').match(/\/Character\/(\d+)/); if (match && match[1]) { charUrl = `${PAGE_URL_PATTERNS.characterBase}/${match[1]}`; } } }
        if (charUrl && charUrl.startsWith('/')) { return window.location.origin + charUrl; } else if (charUrl && (charUrl.startsWith('http://') || charUrl.startsWith('https://'))) { return charUrl; } return null;
    }

    // Funções da UI (createControlPanel, updateStatus, updateCountdownDisplay, updateActionLog, updateAllDisplays)
    // ... (Copie estas funções da v1.2.14 pois não houve alteração nelas, EXCETO updateStatus que já está acima com a lógica de contagem) ...
    function createControlPanel() { try { const panelHTML = `<div id="${SCRIPT_ID}_panel"><h4>${SCRIPT_ID.replace("Popmundo","")} v${SCRIPT_VERSION}</h4><div class="pm-tabs"><button class="pm-tab-button active" data-tab="status">Status</button><button class="pm-tab-button" data-tab="login">Login</button></div><div class="pm-tab-content-wrapper"><div class="pm-tab-content active" id="pm-tab-status"><label><input type="checkbox" id="${SCRIPT_ID}_toggleEnable" ${config.enabled?"checked":""}/> Ativar Auto-Baseado (x2)</label><div id="${SCRIPT_ID}_status" class="status-box">${currentStatus}</div><div id="${SCRIPT_ID}_countdown" class="countdown-box">Próximo uso: --</div><div class="log-header">Log de Ações:</div><div id="${SCRIPT_ID}_actionLog" class="action-log-box"></div></div><div class="pm-tab-content" id="pm-tab-login"><p><strong>Login Automático</strong></p><div><label for="${SCRIPT_ID}_loginUser">Usuário Popmundo:</label><input type="text" id="${SCRIPT_ID}_loginUser" value="${config.loginUsername}" autocomplete="username"></div><div><label for="${SCRIPT_ID}_loginPass">Senha Popmundo:</label><input type="password" id="${SCRIPT_ID}_loginPass" autocomplete="current-password"></div><div class="login-note">A senha será salva localmente.</div> <hr style="margin: 10px 0;"><p><strong>Seleção Automática de Personagem</strong></p><div><label for="${SCRIPT_ID}_charSelectName">Primeiro Nome do Personagem:</label><input type="text" id="${SCRIPT_ID}_charSelectName" value="${config.characterNameToSelect}"></div><div class="login-note"></div></div></div><button id="${SCRIPT_ID}_saveConfigButton" class="save-button">Salvar Configurações</button></div>`; const panel = $(panelHTML); $('body').append(panel); console.log(`[${SCRIPT_ID} v${SCRIPT_VERSION}] Painel CRIADO e adicionado.`); panel.find('.pm-tab-button').on('click', function() { const tabId = $(this).data('tab'); panel.find('.pm-tab-button').removeClass('active'); panel.find('.pm-tab-content').removeClass('active'); $(this).addClass('active'); $('#pm-tab-' + tabId).addClass('active'); }); $(`#${SCRIPT_ID}_loginUser`).val(config.loginUsername); $(`#${SCRIPT_ID}_charSelectName`).val(config.characterNameToSelect); $(`#${SCRIPT_ID}_toggleEnable`).on('change', function() { config.enabled = $(this).is(':checked'); GM_setValue(CONFIG_KEY_PREFIX + "enabled", config.enabled); if (config.enabled) { pm_log("Automação ativada."); updateStatus("Ativado, aguardando..."); if (!config.characterPageUrl && isBaseCharacterPage(getCurrentPath())) { config.characterPageUrl = window.location.href; } runMainLoop(); } else { pm_log("Automação desativada."); updateStatus("Desativado."); clearTimeout(mainLoopTimeoutId); clearInterval(countdownIntervalId); sessionStorage.removeItem(ACTION_KEY); sessionStorage.removeItem(DOUBLE_USE_ATTEMPT_COUNT_KEY); sessionStorage.removeItem(JUST_CLICKED_USE_FLAG_KEY); isActing = false; } updateAllDisplays(); }); $(`#${SCRIPT_ID}_saveConfigButton`).on('click', function() { pm_log("Botão 'Salvar Configurações' clicado."); saveConfig(); alert("Configurações salvas!"); updateStatus("Configurações salvas!"); }); updateAllDisplays(); } catch (e) { console.error(`[${SCRIPT_ID} v${SCRIPT_VERSION}] ERRO CRÍTICO ao criar painel:`, e); alert(`${SCRIPT_ID} ERRO ao criar painel. Verifique console (F12).`); } }
    function updateStatus(message, isError = false) { currentStatus = message; let statusText = (typeof message === 'string' ? message : String(message)); try { const activeAction = sessionStorage.getItem(ACTION_KEY); const successfulUsesSoFar = parseInt(sessionStorage.getItem(DOUBLE_USE_ATTEMPT_COUNT_KEY) || '-1'); if (activeAction === 'JOINT_USE_SEQUENCE_ACTIVE') { let attemptNumber = successfulUsesSoFar + 1; let attemptIndicator = `(Tentativa ${attemptNumber}/2)`; const lowerMessage = statusText.toLowerCase(); const actionKeywords = ["usando", "clicando", "verificando", "progresso", "processando", "tentativa", "preparando", "indo para", "procurando"]; if (actionKeywords.some(keyword => lowerMessage.includes(keyword))) { statusText = `${statusText.replace(/\s*\(Tentativa \d\/\d\)/ig, '').replace(/\s*\(contagem \d\)/ig, '')} ${attemptIndicator}`; } } else if (statusText === "Dois usos concluídos") { statusText = "Dois usos concluídos (2/2 OK). Cooldown iniciado."; } else if (statusText.startsWith("Falha no uso (cooldown dinâmico")) { let attemptNumber = successfulUsesSoFar + 1; if (successfulUsesSoFar >=0) statusText = `${statusText} (na Tentativa ${attemptNumber}/2)`; } else if (statusText.includes("Falha clique 'Usar Item'")) { let attemptNumber = successfulUsesSoFar + 1; if (successfulUsesSoFar >=0) statusText = `${statusText} (na Tentativa ${attemptNumber}/2)`; } } catch (e) { console.error(`[${SCRIPT_ID} v${SCRIPT_VERSION}] Erro DENTRO de updateStatus:`, e); } const statusDiv = $(`#${SCRIPT_ID}_status`); if (statusDiv.length) { statusDiv.text(statusText.trim()).toggleClass('error', isError); } else { console.log(`[Status UI (painel N/A)]: ${statusText}`); } }
    function updateCountdownDisplay() { const countdownDiv = $(`#${SCRIPT_ID}_countdown`); if (!countdownDiv.length) return; if (!config.enabled) { countdownDiv.text("Próximo uso: Desativado"); return; } if (config.nextUseTimestamp === 0) { countdownDiv.text("Próximo uso: Nunca usado/Pronto"); return; } const now = Date.now(); const remainingMs = config.nextUseTimestamp - now; if (remainingMs <= 0) { countdownDiv.text("Próximo uso: PRONTO!"); } else { const h=Math.floor(remainingMs/3600000),m=Math.floor((remainingMs%3600000)/60000),s=Math.floor((remainingMs%60000)/1000); countdownDiv.text(`Próximo uso em: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`); } }
    function updateActionLog(message) { const logBox = $(`#${SCRIPT_ID}_actionLog`); if (logBox.length) { logBox.prepend(`<div>${message}</div>`); while (logBox.children().length > 20) { logBox.children().last().remove(); }} }
    function updateAllDisplays() { updateStatus(currentStatus); updateCountdownDisplay(); }


    // Funções de Ação (performAutoLogin, performCharacterSelection, handleJointUsageProcess)
    // ... (Copie estas funções da v1.2.14 pois não houve alteração nelas, handleJointUsageProcess é a versão simplificada) ...
    async function performAutoLogin() { const username = config.loginUsername; const password = GM_getValue(LOGIN_PASSWORD_KEY_GM, null); if (!username || !password) { pm_log("Auto-login: Credenciais ausentes."); updateStatus("Login: Credenciais ausentes.", true); return false; } pm_log(`Auto-login: Tentando como '${username}'...`); updateStatus("Auto-Login em progresso..."); const usernameField = $(SELECTORS.loginUsernameField); const passwordField = $(SELECTORS.loginPasswordField); if (usernameField.filter(':visible').length > 0 && passwordField.filter(':visible').length > 0) { usernameField.filter(':visible').first().val(username); passwordField.filter(':visible').first().val(password); await pm_sleep(300); if (await clickElement(SELECTORS.loginButton, "Botão de Login")) { pm_log("Auto-login: Formulário enviado."); return true; } else { pm_error("Auto-login: Falha ao clicar botão login."); updateStatus("Login: Falha clique.", true); return false; } } else { pm_error("Auto-login: Campos não encontrados."); updateStatus("Login: Campos N/E.", true); return false; } }
    async function performCharacterSelection() { const charName = config.characterNameToSelect; if (!charName) { pm_log("Seleção Char: Nome não configurado."); updateStatus("Seleção Char: Nome ausente.", true); return false; } pm_log(`Seleção Char: Tentando selecionar '${charName}'...`); updateStatus(`Selecionando '${charName}'...`); const chooseButtonSelector = SELECTORS.chooseCharacterButton(charName); if (await clickElement(chooseButtonSelector, `Botão "Escolher ${charName}"`)) { pm_log(`Seleção Char: Botão '${charName}' clicado.`); return true; } else { pm_error(`Seleção Char: Falha ao clicar botão '${charName}'.`); updateStatus(`Seleção Char: Botão '${charName}' N/E.`, true); return false; } }
    async function handleJointUsageProcess() { isActing = true; let successfulUsesInCycle = parseInt(sessionStorage.getItem(DOUBLE_USE_ATTEMPT_COUNT_KEY) || '0'); pm_log(`handleJointUsageProcess: ATIVO. Sucessos no ciclo: ${successfulUsesInCycle}. Página: ${getCurrentPath()}`); updateStatus(`Processando uso do item...`); if (!config.characterPageUrl) { pm_error("CRÍTICO handle: config.characterPageUrl NULO."); resetActionSequenceAndStartCooldown("URL Char N/A", true, DEFAULT_COOLDOWN_MINUTES); return; } const characterIdMatch = config.characterPageUrl.match(/\/Character\/(\d+)/); const characterId = characterIdMatch ? characterIdMatch[1] : null; if (!characterId) { pm_error(`CRÍTICO handle: ID Char NULO.`); resetActionSequenceAndStartCooldown("ID Char N/A", true, DEFAULT_COOLDOWN_MINUTES); return; } const itemsPageUrl = `${window.location.origin}${PAGE_URL_PATTERNS.items}/${characterId}`; if (!isItemDetailsPage()) { if (!isItemsPage()) { if (!isCharacterPage() && config.characterPageUrl) { navigateTo(config.characterPageUrl); return; } navigateTo(itemsPageUrl); return; } else { if (!await clickElement(SELECTORS.jointLinkInList(JOINT_ITEM_NAME), JOINT_ITEM_NAME)) { resetActionSequenceAndStartCooldown(`Falha: "${JOINT_ITEM_NAME}" não encontrado`, true, DEFAULT_COOLDOWN_MINUTES); } return; } } pm_log(`handle: Na página de detalhes. Sucessos no ciclo: ${successfulUsesInCycle}.`); let justClickedFlag = sessionStorage.getItem(JUST_CLICKED_USE_FLAG_KEY); sessionStorage.removeItem(JUST_CLICKED_USE_FLAG_KEY); if (justClickedFlag === 'true') { pm_log(`Verificando resultado do uso (foi tentativa ${successfulUsesInCycle + 1} do ciclo).`); updateStatus("Verificando resultado..."); await pm_sleep(PAGE_LOAD_DELAY_MS); let cooldownMessageFound = false; let parsedCooldownMinutes = DEFAULT_COOLDOWN_MINUTES; const errorNotification = $(SELECTORS.gameNotificationError); if (errorNotification.length > 0) { const messageText = errorNotification.text(); pm_log(`Msg em '${SELECTORS.gameNotificationError}': "${messageText}"`); const cooldownMatch = messageText.match(/Você não pode fazer isso ainda\. Precisa esperar mais (\d+)\s*minuto\(s\)/i); if (cooldownMatch && cooldownMatch[1]) { parsedCooldownMinutes = parseInt(cooldownMatch[1], 10); cooldownMessageFound = true; } } if (!cooldownMessageFound) { const messageAreaFallback = $(SELECTORS.gameMessageAreaFallback); if(messageAreaFallback.length > 0) { const messageTextFallback = messageAreaFallback.text(); const cooldownMatchFallback = messageTextFallback.match(/Você não pode fazer isso ainda\. Precisa esperar mais (\d+)\s*minuto\(s\)/i); if (cooldownMatchFallback && cooldownMatchFallback[1]) { parsedCooldownMinutes = parseInt(cooldownMatchFallback[1], 10); cooldownMessageFound = true;} } } if (cooldownMessageFound) { pm_log(`Cooldown dinâmico DETECTADO: ${parsedCooldownMinutes} min. Ciclo interrompido.`); resetActionSequenceAndStartCooldown(`Falha no uso (cooldown ${parsedCooldownMinutes}m)`, true, parsedCooldownMinutes); return; } successfulUsesInCycle++; pm_log(`Uso ${successfulUsesInCycle} de 2 BEM SUCEDIDO neste ciclo.`); sessionStorage.setItem(DOUBLE_USE_ATTEMPT_COUNT_KEY, successfulUsesInCycle.toString()); updateStatus(`Uso ${successfulUsesInCycle}/2 OK`); if (successfulUsesInCycle < 2) { pm_log("Primeiro uso OK. Preparando para o segundo uso imediato."); updateStatus("Primeiro uso OK. Tentando segundo..."); sessionStorage.setItem(JUST_CLICKED_USE_FLAG_KEY, 'true'); if (!await clickElement(SELECTORS.useItemButton, `Botão Usar ${JOINT_ITEM_NAME} (para 2ª tentativa)`)) { pm_error("Falha ao clicar 'Usar Item' para a 2ª tentativa."); resetActionSequenceAndStartCooldown("Falha clique 2ª tentativa", true, DEFAULT_COOLDOWN_MINUTES); } return; } else { pm_log(`USO DUPLO COMPLETO (${successfulUsesInCycle} usos). Iniciando cooldown principal.`); resetActionSequenceAndStartCooldown("Dois usos concluídos", false, DEFAULT_COOLDOWN_MINUTES); return; } } else { pm_log(`Chegou na pág de detalhes. Próxima tentativa no ciclo: ${successfulUsesInCycle + 1}. Clicando 'Usar Item'.`); updateStatus(`Tentando uso ${successfulUsesInCycle + 1}/2...`); sessionStorage.setItem(JUST_CLICKED_USE_FLAG_KEY, 'true'); if (!await clickElement(SELECTORS.useItemButton, `Botão Usar ${JOINT_ITEM_NAME} (tentativa ${successfulUsesInCycle + 1})`)) { pm_error(`Falha ao clicar 'Usar Item' (tentativa ${successfulUsesInCycle + 1}).`); resetActionSequenceAndStartCooldown(`Falha clique 'Usar Item' (tentativa ${successfulUsesInCycle + 1})`, true, DEFAULT_COOLDOWN_MINUTES); } return; } }


    // runMainLoop MODIFICADO para usar a nova verificação de isGeneralPopmundoPage
    async function runMainLoop() {
        clearTimeout(mainLoopTimeoutId);
        const sessionAction = sessionStorage.getItem(ACTION_KEY);
        const currentPath = getCurrentPath();
        if (sessionAction || Math.random() < 0.05 || !isCharacterPage() || !isLoginPage() || !isCharacterSelectionPage() ) {
             pm_log(`runMainLoop: CICLO INICIADO. Path='${currentPath}', isActing=${isActing}, enabled=${config.enabled}, sessionAction='${sessionAction}'`);
        }

        if (isErrorPage()) {
            pm_log(`runMainLoop: Página de ERRO ESPECÍFICA detectada. Redirecionando para login.`);
            updateStatus("Página de erro do jogo. Indo para login...");
            isActing = false; sessionStorage.removeItem(ACTION_KEY); sessionStorage.removeItem(DOUBLE_USE_ATTEMPT_COUNT_KEY); sessionStorage.removeItem(JUST_CLICKED_USE_FLAG_KEY);
            navigateTo(PAGE_URL_PATTERNS.loginPagePath); return;
        }

        if (config.enabled && !sessionAction) {
            const onL = isLoginPage(); const onCS = isCharacterSelectionPage();
            const onC = isCharacterPage(); const onI = isItemsPage(); const onID = isItemDetailsPage();
            const onGP = isGeneralPopmundoPage(); // <<<< USA NOVA FUNÇÃO

            const onKnownPage = onL || onCS || onC || onI || onID || onGP;

            if (!onKnownPage) {
                pm_log(`runMainLoop: Página DESCONHECIDA ('${currentPath}') sem ação pendente. Indo para login.`);
                updateStatus("Página inesperada. Indo para login...");
                isActing = false; sessionStorage.removeItem(ACTION_KEY); sessionStorage.removeItem(DOUBLE_USE_ATTEMPT_COUNT_KEY); sessionStorage.removeItem(JUST_CLICKED_USE_FLAG_KEY);
                navigateTo(PAGE_URL_PATTERNS.loginPagePath); return;
            }
        }

        if (isLoginPage()) {
            if (config.enabled && config.loginUsername && GM_getValue(LOGIN_PASSWORD_KEY_GM, null)) {
                isActing = true; updateStatus("Tentando Auto-Login...");
                if (await performAutoLogin()) { pm_log("Auto-Login enviado."); return; }
                else { isActing = false; updateStatus("Auto-Login falhou.", true); }
            } else { updateStatus("Aguardando login manual...");}
        }
        else if (isCharacterSelectionPage()) {
            if (config.enabled && config.characterNameToSelect) {
                isActing = true; updateStatus("Selecionando personagem...");
                if (await performCharacterSelection()) { pm_log("Seleção de char enviada."); return; }
                else { isActing = false; updateStatus("Seleção de char falhou.", true); }
            } else { updateStatus("Aguardando seleção manual de char...");}
        }
        else if (sessionAction === 'JOINT_USE_SEQUENCE_ACTIVE') {
            await handleJointUsageProcess();
        } else if (config.enabled) {
            if (isActing && !sessionAction ) { // Limpa isActing de login/char select
                pm_log("runMainLoop: Limpando isActing de login/char select anterior.");
                isActing = false;
            }
            const isOnCharP = isCharacterPage(); const currentPathInner = getCurrentPath();
            const isOnBaseCharP = isBaseCharacterPage(currentPathInner);

            if (isOnBaseCharP && (!config.characterPageUrl || config.characterPageUrl !== window.location.href)) {
                config.characterPageUrl = window.location.href; saveConfig();
                pm_log(`runMainLoop: URL base do char definida/atualizada: ${config.characterPageUrl}`);
            }
            if (isOnCharP && !config.characterPageUrl && !isOnBaseCharP) {
                const foundBase = getCharacterPageUrlFromPage();
                if (foundBase && isBaseCharacterPage(new URL(foundBase).pathname)) {
                    config.characterPageUrl = foundBase; saveConfig();
                    pm_log(`runMainLoop: URL base do char obtida de link: ${config.characterPageUrl}`);
                } else {
                    updateStatus("Vá para pág. principal do char."); mainLoopTimeoutId = setTimeout(runMainLoop, CHECK_INTERVAL_MS * 2); updateAllDisplays(); return;
                }
            }
            if (!config.characterPageUrl && (isOnCharP || isOnBaseCharP) ) {
                 config.characterPageUrl = window.location.href; saveConfig();
                 pm_log(`runMainLoop: URL base do char forçosamente definida para atual: ${config.characterPageUrl}`);
            }

            if (config.characterPageUrl) { // Se temos a URL do char
                if (isOnCharP || isBaseCharacterPage(config.characterPageUrl)) { // Se estamos na pág do char ou a URL configurada É uma pág de char base
                    const timeNow = Date.now(); const nextUse = config.nextUseTimestamp;
                    if (nextUse === 0 || timeNow >= nextUse || Math.random() < 0.1) {
                        pm_log(`runMainLoop: TEMPO: Agora=${new Date(timeNow).toLocaleTimeString()}, ProxUso=${new Date(nextUse).toLocaleTimeString()}`);
                    }
                    if (timeNow >= nextUse) {
                        pm_log(`runMainLoop: COOLDOWN OK. Iniciando NOVA sequência de uso duplo.`);
                        updateStatus("Hora de usar o baseado (x2)!");
                        sessionStorage.setItem(ACTION_KEY, 'JOINT_USE_SEQUENCE_ACTIVE');
                        sessionStorage.setItem(DOUBLE_USE_ATTEMPT_COUNT_KEY, '0');
                        sessionStorage.removeItem(JUST_CLICKED_USE_FLAG_KEY);
                        await handleJointUsageProcess();
                    } else {
                        updateStatus("Aguardando cooldown do baseado...");
                        mainLoopTimeoutId = setTimeout(runMainLoop, CHECK_INTERVAL_MS);
                    }
                } else { // Não estamos na página do personagem, mas sabemos qual é. Navega para lá.
                    pm_log(`runMainLoop: Não na página do char (${currentPathInner}). Navegando para: ${config.characterPageUrl}`);
                    navigateTo(config.characterPageUrl);
                }
            } else { // Não sabemos qual é a página do personagem.
                pm_log("runMainLoop: ESTADO: URL base do char desconhecida. Aguardando usuário ir para a pág principal do char.");
                updateStatus("Vá para pág. principal do char para o script aprender a URL.", false);
                mainLoopTimeoutId = setTimeout(runMainLoop, CHECK_INTERVAL_MS * 2);
            }
        } else { // Script desabilitado
            updateStatus("Desativado.");
        }
        if ($(`#${SCRIPT_ID}_panel`).length) updateAllDisplays();
    }

    function init() {
        if (typeof $ === 'undefined' || typeof $.fn === 'undefined' || typeof $.fn.jquery === 'undefined') {
            console.error(`[${SCRIPT_ID} v${SCRIPT_VERSION}] ERRO FATAL: jQuery não carregou.`);
            alert(`${SCRIPT_ID} ERRO FATAL: jQuery não disponível!`); return;
        }
        console.log(`[${SCRIPT_ID} v${SCRIPT_VERSION}] Script iniciado. jQuery v${$.fn.jquery} detectado.`);
        loadConfig();
        try { createControlPanel(); } catch (e) {
            console.error(`[${SCRIPT_ID} v${SCRIPT_VERSION}] ERRO CRÍTICO ao criar painel:`, e);
            alert(`${SCRIPT_ID} ERRO ao criar painel. Verifique console (F12).`); return;
        }
        if (config.enabled) { pm_log("Monitor ativado (pós-painel)."); updateStatus("Ativado, verificando estado..."); }
        else { updateStatus("Desativado."); }
        countdownIntervalId = setInterval(updateCountdownDisplay, 1000);
        setTimeout(runMainLoop, PAGE_LOAD_DELAY_MS / 2);
    }

    GM_addStyle(`
        #${SCRIPT_ID}_panel {
            position: fixed; top: 100px; right: 10px; width: 280px;
            background-color: #f0f0f0; border: 1px solid #ccc; padding: 0;
            z-index: 10001; font-family: Arial, sans-serif; font-size: 12px;
            border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);
            display: flex; flex-direction: column;
        }
        #${SCRIPT_ID}_panel h4 {
            margin: 0; padding: 8px 10px; font-size: 14px; text-align: center;
            border-bottom: 1px solid #ddd; background-color: #e9e9e9;
            border-top-left-radius: 5px; border-top-right-radius: 5px;
        }
        #${SCRIPT_ID}_panel .pm-tabs { display: flex; border-bottom: 1px solid #ccc; background-color: #f8f8f8;}
        #${SCRIPT_ID}_panel .pm-tab-button {
            flex: 1; padding: 8px 5px; background-color: transparent; border: none;
            border-bottom: 2px solid transparent; cursor: pointer; font-weight: bold; color: #555;
        }
        #${SCRIPT_ID}_panel .pm-tab-button.active { border-bottom-color: #007bff; color: #007bff; }
        #${SCRIPT_ID}_panel .pm-tab-button:hover { background-color: #efefef; }
        #${SCRIPT_ID}_panel .pm-tab-content-wrapper { padding: 10px; flex-grow: 1; overflow-y: auto; max-height: calc(100vh - 200px); }
        #${SCRIPT_ID}_panel .pm-tab-content { display: none; }
        #${SCRIPT_ID}_panel .pm-tab-content.active { display: block; }
        #${SCRIPT_ID}_panel label { display: block; margin-bottom: 8px; font-weight:bold; color: #333; }
        #${SCRIPT_ID}_panel input[type="text"], #${SCRIPT_ID}_panel input[type="password"] {
            width: calc(100% - 12px); padding: 5px; margin-top: 2px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 3px;
            box-sizing: border-box;
        }
        #${SCRIPT_ID}_panel .login-note { font-size: 0.8em; color: #666; margin-top: -5px; margin-bottom: 10px;}
        #${SCRIPT_ID}_panel hr {border: 0; border-top: 1px solid #ddd; margin: 15px 0;}
        #${SCRIPT_ID}_panel .status-box { padding: 8px; margin-top: 5px; margin-bottom: 5px; border: 1px solid #ddd; background-color: #fff; border-radius: 3px; text-align: center; word-break: break-word;}
        #${SCRIPT_ID}_panel .status-box.error { color: red; border-left: 3px solid red; font-weight: bold; }
        #${SCRIPT_ID}_panel .countdown-box { padding: 6px; margin-bottom: 10px; border: 1px solid #e0e0e0; background-color: #f9f9f9; border-radius: 3px; text-align: center; font-weight: bold; }
        #${SCRIPT_ID}_panel .log-header { font-weight: bold; margin-bottom: 3px; font-size: 10px; color: #555; }
        #${SCRIPT_ID}_panel .action-log-box { max-height: 80px; overflow-y: auto; border: 1px solid #eee; padding: 5px; font-size: 10px; background-color: #fff; border-radius: 3px; }
        #${SCRIPT_ID}_panel .action-log-box div { padding-bottom: 2px; margin-bottom: 2px; border-bottom: 1px dotted #f0f0f0; word-break: break-all; }
        #${SCRIPT_ID}_panel .action-log-box div:last-child { border-bottom: none; }
        #${SCRIPT_ID}_panel .save-button {
             display: block; width: 100%; padding: 8px; margin-top: 10px;
             background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;
             box-sizing: border-box;
        }
        #${SCRIPT_ID}_panel .save-button:hover { background-color: #0056b3; }
    `);

    $(document).ready(function() {
        setTimeout(init, 750);
    });

})();