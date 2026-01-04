// ==UserScript==
// @name         Carregador do Chefe 🚚 ❤️
// @namespace    http://tampermonkey.net/
// @version      5.1.0
// @description  Mula para o dia z.
// @author       Chris Popper
// @match        https://*.popmundo.com/World/Popmundo.aspx/*
// @match        https://*.popmundo.com/Default.aspx?logout=true
// @match        https://*.popmundo.com/Default.aspx
// @match        https://www.popmundo.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545995/Carregador%20do%20Chefe%20%F0%9F%9A%9A%20%E2%9D%A4%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/545995/Carregador%20do%20Chefe%20%F0%9F%9A%9A%20%E2%9D%A4%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* eslint-env jquery, greasemonkey */

    const scriptVersion = GM_info.script.version;
    const HUMAN_DELAY = 4000;
    const ITEM_NAME_TO_TRANSFER = "Analgésicos";
    const PANEL_POSITION_KEY = "tghMulePanelPosition_v5";
    const THEME_KEY = "tghMuleTheme_v5";
    const MINIMIZED_KEY = "tghMuleMinimized_v5";

    const SELECTORS = {
        myCharLink: 'a[href*="/Character/"]:contains("Informações gerais")',
        offerItemSubmitButton: '#ctl00_cphLeftColumn_ctl00_btnGive',
        offerItemDropdown: '#ctl00_cphLeftColumn_ctl00_ddlItem',
        itemsTable: 'table.data',
        healthValue: "tr:has(#ctl00_cphLeftColumn_ctl00_imgHealth) div.progressBar div div",
        moodValue: "tr:has(#ctl00_cphLeftColumn_ctl00_imgMood) div.progressBar div div",
        improveHealthButton: 'input#ctl00_cphLeftColumn_ctl00_repAttributes_ctl02_btnBoostAttribute',
        improveMoodButton: 'input#ctl00_cphLeftColumn_ctl00_repAttributes_ctl01_btnBoostAttribute',
        loginUsernameField: '#ctl00_cphLeftColumn_ucLogin_txtUsername, #ctl00_cphRightColumn_ucLogin_txtUsername',
        loginPasswordField: '#ctl00_cphLeftColumn_ucLogin_txtPassword, #ctl00_cphRightColumn_ucLogin_txtPassword',
        loginButton: '#ctl00_cphRightColumn_ucLogin_btnLogin',
    };

    let config = {};
    let actionLog = [];
    let pageRefreshTimer = null;
    let currentStatus = "Inicializando...";
    let currentTheme = GM_getValue(THEME_KEY, 'light');
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);

    const DEFAULT_CONFIG = {
        enabled: false,
        mainCharName: "", mainCharId: "",
        itemThreshold: 10, transferUpTo: 55,
        refreshInterval: 300,
        muleUsername: "",
        muleCharName: "",
        maintenance: {
            enabled: true,
            minHealth: 50,
            minMood: 50
        }
    };

    function logAction(message) {
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        actionLog.unshift(`[${timestamp}] ${message}`);
        if (actionLog.length > 50) { actionLog.length = 50; }
        GM_setValue('tghMuleLog_v1', actionLog);
        updateLogDisplay();
    }

    function updateLogDisplay() {
        const logContainer = $('#muleActionLog');
        if (!logContainer.length) return;
        if (actionLog.length === 0) {
            logContainer.html('<div class="pm-log-empty"><i class="fa-solid fa-clipboard pm-log-empty-icon"></i><br>Log vazio.</div>');
        } else {
            logContainer.html(actionLog.map(entry => `<div class="pm-log-entry">${entry}</div>`).join(''));
        }
    }

    function clearLog() {
        if (confirm("Limpar todo o log de atividades?")) {
            actionLog = [];
            GM_setValue('tghMuleLog_v1', []);
            logAction("Log limpo.");
        }
    }

    function loadConfig() {
        const loadedConfig = GM_getValue("tghMuleScriptConfig_v5.1", {});
        config = $.extend(true, {}, DEFAULT_CONFIG, loadedConfig);
        actionLog = GM_getValue("tghMuleLog_v1", []);
        console.log(`[Carregador do Chefe v${scriptVersion}] Config carregada.`, config);
    }

    function saveConfig() {
        const saveButton = $('#pmLoaderSave');
        saveButton.prop('disabled', true); // Desabilita para evitar cliques duplos

        try {
            const wasEnabled = config.enabled; // Guarda o estado anterior

            // Salva todas as configurações no objeto 'config'
            config.enabled = $('#pmMuleMasterToggle_checkbox').prop('checked');
            config.refreshInterval = Math.max(30, parseInt($('#pmRefreshInterval').val()) || 300);
            config.mainCharName = $('#pmLoaderMainChar').val().trim();
            config.mainCharId = $('#pmLoaderMainId').val().trim();
            config.itemThreshold = parseInt($('#pmLoaderThreshold').val()) || 10;
            config.transferUpTo = parseInt($('#pmLoaderUpTo').val()) || 55;
            config.maintenance.enabled = $('#pmMaintToggle_checkbox').prop('checked');
            config.maintenance.minHealth = parseInt($('#pmMinHealth').val()) || 50;
            config.maintenance.minMood = parseInt($('#pmMinMood').val()) || 50;
            config.muleUsername = $('#muleUsername').val().trim();
            config.muleCharName = $('#muleCharName').val().trim();
            const passIn = $('#mulePassword').val();
            if (passIn) { GM_setValue("tghMulePassword", passIn); $('#mulePassword').val(''); }

            // Salva no armazenamento do Tampermonkey
            GM_setValue("tghMuleScriptConfig_v5.1", config);

            // Feedback visual no botão e no status
            logAction("Configuração salva.");
            updateStatus("Configuração salva com sucesso!", 'success');
            saveButton.html('<i class="fa-solid fa-check"></i> Salvo!').addClass('pm-save-success');

            // Volta o botão ao normal após 2 segundos
            setTimeout(() => {
                saveButton.html('<i class="fa-solid fa-save"></i> Salvar').removeClass('pm-save-success').prop('disabled', false);
            }, 2000);

            // Se o script estiver rodando, agenda a próxima checagem com o novo intervalo
            if(config.enabled) {
                 clearTimeout(pageRefreshTimer);
                 logAction("Configurações atualizadas. Retomando ciclo.");
                 scheduleRefresh();
            }

        } catch (e) {
            updateStatus("Erro ao salvar!", 'error');
            logAction("ERRO ao salvar config: " + e.message);
            saveButton.prop('disabled', false); // Reabilita o botão em caso de erro
        }
    }

    function navigateTo(urlPath) {
        updateStatus(`Navegando para ${urlPath}...`);
        logAction(`Navegando para ${urlPath}`);
        setTimeout(() => { window.location.href = window.location.origin + urlPath; }, HUMAN_DELAY + Math.random() * 2000);
    }

    function clickElement(selector, description) {
        const el = $(selector);
        if (el.length > 0) {
            setTimeout(() => {
                 updateStatus(description);
                 logAction(`Clicando: ${description}`);
                 el.first()[0].click();
            }, HUMAN_DELAY + Math.random() * 2000);
            return true;
        }
        updateStatus(`ERRO: "${description}" não encontrado! Abortando.`, 'error');
        logAction(`ERRO: "${description}" não encontrado!`);
        scheduleRefresh(true);
        return false;
    }

    function parseStatValue(sel) {
        const el = $(sel).first();
        if (el.length) {
            const txt = el.text();
            const m = txt.match(/(\d+)/);
            if (m && m[1]) return parseInt(m[1], 10);
        }
        return null;
    }

    function countItemsInInventoryHTML(htmlText) {
        const html = $(htmlText);
        const itemTable = html.find(SELECTORS.itemsTable);
        let totalCount = 0;
        if (itemTable.length === 0) { return 0; }
        itemTable.find('tr').each(function() {
            const row = $(this);
            const itemLink = row.find(`a:contains("${ITEM_NAME_TO_TRANSFER}")`);
            if (itemLink.length > 0) {
                const quantityElement = itemLink.siblings('em');
                if (quantityElement.length > 0) {
                    const quantity = parseInt(quantityElement.first().text().replace('x', '').trim(), 10);
                    if (!isNaN(quantity)) totalCount += quantity;
                } else {
                    totalCount += 1;
                }
            }
        });
        return totalCount;
    }

    function scheduleRefresh(isError = false) {
        sessionStorage.removeItem('tghMuleAction');
        sessionStorage.removeItem('tghItemsToTransfer');
        sessionStorage.removeItem('tghItemsTransferred');
        clearTimeout(pageRefreshTimer);
        const interval = isError ? 60000 : config.refreshInterval * 1000;
        const nextCheckTime = new Date(Date.now() + interval).toLocaleTimeString();
        const statusMsg = isError ? `Erro. Nova tentativa às ${nextCheckTime}` : `Próxima atualização às ${nextCheckTime}.`;
        updateStatus(statusMsg);
        logAction(`Agendando atualização para ${nextCheckTime}.`);
        pageRefreshTimer = setTimeout(() => navigateTo('/World/Popmundo.aspx/Character'), interval);
    }

    function getMyCharId() {
        const urlMatch = window.location.pathname.match(/\/Character\/(\d+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    function getCharacterNameFromPage() {
        const header = $('div.character-header > h1');
        if (header.length > 0) {
            return header.clone().children().remove().end().text().trim();
        }
        return null;
    }

    function isLoginPage() {
        return $(SELECTORS.loginUsernameField).length > 0 && $(SELECTORS.loginPasswordField).length > 0;
    }

    function isCharacterSelectionPage() {
        return window.location.pathname.includes('/ChooseCharacter');
    }

    function performAutoLogin() {
        const username = config.muleUsername;
        const password = GM_getValue("tghMulePassword", null);
        if (!username || !password) {
            updateStatus("Credenciais de login não configuradas.", 'error');
            logAction("Tentativa de login falhou: credenciais ausentes.");
            return false;
        }
        const userField = $(SELECTORS.loginUsernameField);
        const passField = $(SELECTORS.loginPasswordField);
        if (userField.length && passField.length) {
            logAction("Página de login detectada. Tentando logar...");
            updateStatus("Realizando login automático...");
            userField.val(username);
            passField.val(password);
            clickElement(SELECTORS.loginButton, "botão de Login");
            return true;
        }
        return false;
    }

    function selectMuleCharacter() {
        const charName = config.muleCharName;
        if (!charName) {
            updateStatus("Nome da Mula não configurado para seleção.", 'error');
            logAction("ERRO: Nome da Mula não configurado na aba Login.");
            return false;
        }
        const selector = `input[type="submit"][value="Escolher ${charName}"]`;
        logAction(`Selecionando personagem Mula: ${charName}...`);
        updateStatus(`Selecionando ${charName}...`);
        return clickElement(selector, `botão de seleção '${charName}'`);
    }

    async function runCheck() {
        if (isLoginPage()) {
            if (config.enabled) { performAutoLogin(); }
            else { updateStatus("Na página de login. Mula desativada."); }
            return;
        }

        if (isCharacterSelectionPage()) {
            if (config.enabled) { selectMuleCharacter(); }
            else { updateStatus("Na seleção de personagem. Mula desativada."); }
            return;
        }

        if (!config.enabled) {
            updateStatus("Mula desativada.");
            return;
        }

        const myId = getMyCharId();
        const onImprovePage = window.location.pathname.includes('/ImproveCharacter/');
        const onOfferPage = window.location.pathname.includes('/OfferItem/');
        const currentState = sessionStorage.getItem('tghMuleAction');

        console.log(`[Carregador do Chefe] Estado atual: ${currentState || 'Nenhum'}`);

        if (!currentState) {
            if (!myId || myId === config.mainCharId) {
                updateStatus("Ponto de partida incorreto. Retornando ao perfil da mula...");
                const muleProfileLink = $(SELECTORS.myCharLink);
                if (muleProfileLink.length > 0) navigateTo(muleProfileLink.attr('href'));
                else {
                    updateStatus("ERRO: Link 'Informações gerais' não encontrado.", 'error');
                    scheduleRefresh(true);
                }
                return;
            }

            logAction("Iniciando ciclo de verificação...");
            if (config.maintenance.enabled) {
                const health = parseStatValue(SELECTORS.healthValue);
                const mood = parseStatValue(SELECTORS.moodValue);
                if (health !== null) {
                    logAction(`Saúde/Humor da Mula: ${health}% / ${mood}%.`);
                    updateStatus(`Saúde: ${health}% | Humor: ${mood}%`);
                }
                if (health !== null && health < config.maintenance.minHealth) {
                    sessionStorage.setItem('tghMuleAction', 'go_to_improve_health');
                    runCheck(); return;
                }
                if (mood !== null && mood < config.maintenance.minMood) {
                    sessionStorage.setItem('tghMuleAction', 'go_to_improve_mood');
                    runCheck(); return;
                }
            }

            updateStatus(`Verificando inventário de ${config.mainCharName}...`);
            const mainCharItemsURL = `${window.location.origin}/World/Popmundo.aspx/Character/Items/${config.mainCharId}`;
            GM_xmlhttpRequest({
                method: "GET", url: mainCharItemsURL,
                onload: (response) => {
                    if (response.status !== 200) { scheduleRefresh(true); return; }
                    const quantity = countItemsInInventoryHTML(response.responseText);
                    logAction(`Principal tem ${quantity} ${ITEM_NAME_TO_TRANSFER} (Mínimo: ${config.itemThreshold}).`);
                    updateStatus(`Principal tem ${quantity} ${ITEM_NAME_TO_TRANSFER}. (Mínimo: ${config.itemThreshold})`);
                    if (quantity < config.itemThreshold) {
                        const needed = config.transferUpTo - quantity;
                        if (needed <= 0) { scheduleRefresh(); return; }
                        const toTransfer = needed;
                        logAction(`Iniciando transferência de ${toTransfer} itens.`);
                        updateStatus(`Itens baixos! Iniciando transferência de ${toTransfer} itens.`);
                        sessionStorage.setItem('tghItemsToTransfer', toTransfer);
                        sessionStorage.setItem('tghItemsTransferred', 0);
                        sessionStorage.setItem('tghMuleAction', 'go_to_offer_page');
                        runCheck();
                    } else {
                        logAction("Estoque OK.");
                        updateStatus("Estoque do principal está OK.");
                        scheduleRefresh();
                    }
                },
                onerror: () => scheduleRefresh(true)
            });
            return;
        }

        switch (currentState) {
            case 'go_to_offer_page':
                sessionStorage.setItem('tghMuleAction', 'offer_items_loop');
                navigateTo(`/World/Popmundo.aspx/Character/OfferItem/${config.mainCharId}`);
                break;
            case 'offer_items_loop':
                if(onOfferPage) {
                    if ($(SELECTORS.offerItemDropdown).find(`option:contains("${ITEM_NAME_TO_TRANSFER}")`).length === 0) {
                        updateStatus(`Mula sem ${ITEM_NAME_TO_TRANSFER}! Desativando...`, 'error');
                        logAction(`ERRO: Mula não tem mais ${ITEM_NAME_TO_TRANSFER}! Desativando automação.`);
                        config.enabled = false;
                        GM_setValue("tghMuleScriptConfig_v5.1", config);
                        $('#pmMuleMasterToggle_checkbox').prop('checked', false);
                        sessionStorage.setItem('tghMuleAction', 'return_to_idle');
                        runCheck(); return;
                    }
                    let itemsTransferred = parseInt(sessionStorage.getItem('tghItemsTransferred') || '0');
                    let itemsToTransfer = parseInt(sessionStorage.getItem('tghItemsToTransfer') || '1');
                    if (itemsTransferred >= itemsToTransfer) {
                        logAction("Meta de transferência atingida.");
                        updateStatus("Meta atingida. Retornando...");
                        sessionStorage.setItem('tghMuleAction', 'return_to_idle');
                        runCheck(); return;
                    }
                    itemsTransferred++;
                    sessionStorage.setItem('tghItemsTransferred', itemsTransferred);
                    clickElement(SELECTORS.offerItemSubmitButton, `Ofertando item ${itemsTransferred}/${itemsToTransfer}...`);
                }
                break;
            case 'go_to_improve_health':
                 logAction("Saúde baixa. Navegando para aprimorar.");
                 sessionStorage.setItem('tghMuleAction', 'click_improve_health');
                 navigateTo(`/World/Popmundo.aspx/Character/ImproveCharacter/${myId}`);
                 break;
            case 'click_improve_health':
                 if(onImprovePage) {
                    sessionStorage.setItem('tghMuleAction', 'return_to_idle');
                    clickElement(SELECTORS.improveHealthButton, "botão Melhorar Saúde");
                 }
                 break;
            case 'go_to_improve_mood':
                 logAction("Humor baixo. Navegando para aprimorar.");
                 sessionStorage.setItem('tghMuleAction', 'click_improve_mood');
                 navigateTo(`/World/Popmundo.aspx/Character/ImproveCharacter/${myId}`);
                 break;
            case 'click_improve_mood':
                 if(onImprovePage) {
                    sessionStorage.setItem('tghMuleAction', 'return_to_idle');
                    clickElement(SELECTORS.improveMoodButton, "botão Melhorar Humor");
                 }
                 break;
            case 'return_to_idle':
                logAction("Ciclo concluído. Retornando para a pág. principal.");
                sessionStorage.removeItem('tghMuleAction');
                navigateTo('/World/Popmundo.aspx/Character');
                break;
        }
    }

    function toggleMinimize(minimized, save = true) {
        const panel = $('#pmMulePanel');
        const toggleButton = $('#pmMinimizeToggle');
        if (minimized) {
            panel.addClass('minimized');
            toggleButton.find('i').removeClass('fa-window-minimize').addClass('fa-window-maximize');
            toggleButton.attr('title', 'Maximizar');
        } else {
            panel.removeClass('minimized');
            toggleButton.find('i').removeClass('fa-window-maximize').addClass('fa-window-minimize');
            toggleButton.attr('title', 'Minimizar');
        }
        if (save) { GM_setValue(MINIMIZED_KEY, minimized); }
    }

    function createControlPanel() {
        const panelHTML = `
            <div id="pmMulePanel" class="${currentTheme} ${isMinimized ? 'minimized' : ''}">
                <div class="pm-panel-header">
                    <h4><i class="fa-solid fa-truck-fast"></i> Carregador do Chefe <span>v${scriptVersion}</span></h4>
                    <div id="pmCharacterNameHeader" class="pm-character-name-header"><i class="fa-solid fa-spinner fa-spin"></i> Carregando...</div>
                    <div class="pm-header-controls">
                        <button id="pmThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
                        <button id="pmMinimizeToggle" title="${isMinimized ? 'Maximizar' : 'Minimizar'}"><i class="fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}"></i></button>
                    </div>
                </div>
                <div class="pm-tabs">
                    <button class="pm-tab-button active" data-tab="status"><i class="fa-solid fa-tachometer-alt"></i> Status</button>
                    <button class="pm-tab-button" data-tab="transfer"><i class="fa-solid fa-exchange-alt"></i> Transferência</button>
                    <button class="pm-tab-button" data-tab="maintenance"><i class="fa-solid fa-heart-pulse"></i> Manutenção</button>
                    <button class="pm-tab-button" data-tab="login"><i class="fa-solid fa-key"></i> Login</button>
                </div>
                <div class="pm-tab-content-wrapper">
                    <div id="tab-status" class="pm-tab-content active">
                         <label class="pm-toggle-label" for="pmMuleMasterToggle_checkbox">
                             <input type="checkbox" id="pmMuleMasterToggle_checkbox" ${config.enabled ? 'checked' : ''}>
                             <span class="pm-toggle-switch"></span>
                             <span class="pm-toggle-label-text">Ligar Mula</span>
                         </label>
                         <div class="pm-separator"></div>
                         <div><label for="pmRefreshInterval"><i class="fa-solid fa-sync-alt"></i> Atualizar e Verificar a cada (s):</label><input type="number" id="pmRefreshInterval" min="30" value="${config.refreshInterval}"></div>
                         <div id="pmMuleStatus" class="pm-status-box">${currentStatus}</div>
                         <div class="pm-log-header"><div><i class="fa-solid fa-clipboard-list"></i> Log de Atividades:</div><button id="clearLogBtn" class="pm-clear-button"><i class="fa-solid fa-broom"></i> Limpar</button></div>
                         <div id="muleActionLog"></div>
                    </div>
                    <div id="tab-transfer" class="pm-tab-content">
                        <p class="pm-text-info"><i class="fa-solid fa-circle-info"></i> Configure o personagem que receberá os itens.</p>
                        <div><label for="pmLoaderMainChar"><i class="fa-solid fa-user-astronaut"></i> Nome do Principal:</label><input type="text" id="pmLoaderMainChar" value="${config.mainCharName || ''}" placeholder="Nome Exato"></div>
                        <div><label for="pmLoaderMainId"><i class="fa-solid fa-id-card"></i> ID do Principal:</label><input type="text" id="pmLoaderMainId" value="${config.mainCharId || ''}" placeholder="Ex: 1234567"></div>
                        <div class="pm-separator"></div>
                        <div><label for="pmLoaderThreshold"><i class="fa-solid fa-arrow-down"></i> Recarregar se tiver <strong>menos de</strong>:</label><input type="number" id="pmLoaderThreshold" min="1" value="${config.itemThreshold}"></div>
                        <div><label for="pmLoaderUpTo"><i class="fa-solid fa-arrow-up"></i> Transferir <strong>até atingir</strong>:</label><input type="number" id="pmLoaderUpTo" min="1" value="${config.transferUpTo}"></div>
                    </div>
                    <div id="tab-maintenance" class="pm-tab-content">
                        <label class="pm-toggle-label" for="pmMaintToggle_checkbox">
                            <input type="checkbox" id="pmMaintToggle_checkbox" ${config.maintenance.enabled ? 'checked' : ''}>
                            <span class="pm-toggle-switch"></span>
                            <span class="pm-toggle-label-text">Manter Saúde/Humor da Mula</span>
                        </label>
                        <div class="pm-separator"></div>
                        <p class="pm-text-info"><i class="fa-solid fa-circle-info"></i> Usará XP para recuperar os status da mula.</p>
                        <div>
                            <label for="pmMinHealth"><i class="fa-solid fa-heart-pulse"></i> Recuperar saúde abaixo de:</label>
                            <div class="pm-input-with-suffix">
                                <input type="number" id="pmMinHealth" min="1" max="99" value="${config.maintenance.minHealth}">
                                <span>%</span>
                            </div>
                        </div>
                        <div>
                            <label for="pmMinMood"><i class="fa-solid fa-face-smile"></i> Recuperar humor abaixo de:</label>
                            <div class="pm-input-with-suffix">
                                <input type="number" id="pmMinMood" min="1" max="99" value="${config.maintenance.minMood}">
                                <span>%</span>
                            </div>
                        </div>
                    </div>
                    <div id="tab-login" class="pm-tab-content">
                         <p class="pm-text-info"><i class="fa-solid fa-shield-halved"></i> Credenciais para Login Automático</p>
                         <div><label for="muleUsername"><i class="fa-solid fa-user"></i> Usuário:</label><input type="text" id="muleUsername" value="${config.muleUsername || ''}" autocomplete="username" placeholder="Seu nome de usuário"></div>
                         <div><label for="mulePassword"><i class="fa-solid fa-key"></i> Senha:</label><input type="password" id="mulePassword" placeholder="••••••••" autocomplete="new-password"></div>
                         <div class="pm-separator"></div>
                         <div><label for="muleCharName"><i class="fa-solid fa-id-card-clip"></i> Nome do Personagem (Mula):</label><input type="text" id="muleCharName" value="${config.muleCharName || ''}" placeholder="Nome exato para seleção"></div>
                         <p class="pm-text-info pm-warning-text"><i class="fa-solid fa-triangle-exclamation"></i> A senha fica salva localmente no seu navegador.</p>
                    </div>
                    <button id="pmLoaderSave" class="pm-save-button"><i class="fa-solid fa-save"></i> Salvar</button>
                </div>
            </div>`;
        $('body').append(panelHTML);

        const panelElement = $('#pmMulePanel');
        const savedPosition = GM_getValue(PANEL_POSITION_KEY, null);
        if (savedPosition && savedPosition.top && savedPosition.left) {
            panelElement.css({ top: savedPosition.top, left: savedPosition.left, right: 'auto', bottom: 'auto' });
        } else {
             panelElement.css({ top: '10px', right: '10px', left: 'auto', bottom: 'auto' });
        }
        panelElement.fadeIn(400);
        toggleMinimize(isMinimized, false);
        const charName = getCharacterNameFromPage() || "Mula";
        $('#pmCharacterNameHeader').html(`<i class="fa-solid fa-user-secret"></i> ${charName}`).attr('title', `Script rodando como: ${charName}`);

        $('.pm-tab-button').on('click', function() {
            const tabId = $(this).data('tab');
            $('.pm-tab-button').removeClass('active');
            $('.pm-tab-content').removeClass('active');
            $(this).addClass('active');
            $('#tab-' + tabId).addClass('active');
        });
        $('#pmThemeToggle').on('click', function() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            panelElement.removeClass('light dark').addClass(currentTheme);
            $(this).find('i').removeClass('fa-moon fa-sun').addClass(currentTheme === 'dark' ? 'fa-sun' : 'fa-moon');
            GM_setValue(THEME_KEY, currentTheme);
        });
        $('#pmMinimizeToggle').on('click', () => { isMinimized = !isMinimized; toggleMinimize(isMinimized, true); });
        $('#clearLogBtn').on('click', clearLog);
        $('#pmLoaderSave').on('click', saveConfig);

        // Listener para o toggle principal ter efeito imediato
        $('#pmMuleMasterToggle_checkbox').on('change', function() {
            const isEnabled = $(this).prop('checked');
            config.enabled = isEnabled;
            // Salva a mudança de estado imediatamente para persistir
            GM_setValue("tghMuleScriptConfig_v5.1", config);

            clearTimeout(pageRefreshTimer); // Para qualquer ação agendada

            if (isEnabled) {
                logAction("Mula ativada pelo interruptor.");
                updateStatus("Mula ativada. Iniciando verificação...", 'success');
                runCheck(); // Inicia o script imediatamente
            } else {
                logAction("Mula desativada pelo interruptor.");
                updateStatus("Mula desativada.");
                // Limpa o estado da ação para garantir uma parada limpa
                sessionStorage.removeItem('tghMuleAction');
            }
        });

        const handle = panelElement.find('.pm-panel-header');
        handle.on('mousedown', function(e) {
            if ($(e.target).closest('button').length > 0) return;
            const panel = $('#pmMulePanel'); let isDragging = true;
            panel.addClass('pm-dragging');
            const offset = panel.offset(); const dragOffset = { x: e.pageX - offset.left, y: e.pageY - offset.top };
            $(document).on('mousemove.pmDrag', function(e) {
                if (!isDragging) return;
                let newLeft = e.pageX - dragOffset.x; let newTop = e.pageY - dragOffset.y;
                const winW = $(window).width(); const winH = $(window).height();
                const panelW = panel.outerWidth(); const panelH = panel.outerHeight();
                newLeft = Math.max(0, Math.min(newLeft, winW - panelW));
                newTop = Math.max(0, Math.min(newTop, winH - panelH));
                panel.css({ top: newTop + 'px', left: newLeft + 'px', right: 'auto', bottom: 'auto' });
            }).on('mouseup.pmDrag', function() {
                isDragging = false;
                $(this).off('mousemove.pmDrag mouseup.pmDrag');
                panel.removeClass('pm-dragging');
                GM_setValue(PANEL_POSITION_KEY, { top: panel.css('top'), left: panel.css('left') });
            });
        });
    }

    function updateStatus(msg, type = 'info') {
        currentStatus = msg;
        const statusEl = $('#pmMuleStatus');
        if (!statusEl.length) return;
        let iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> ';
        if (type === 'error') iconHtml = '<i class="fa-solid fa-triangle-exclamation fa-fw"></i> ';
        else if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check fa-fw"></i> ';
        else if (msg.includes("Atualiza") || msg.includes("Verificando")) iconHtml = '<i class="fa-solid fa-hourglass-half fa-fw"></i> ';
        else if (msg.includes("desativada")) iconHtml = '<i class="fa-solid fa-power-off fa-fw"></i> ';
        else if (msg.includes("Navegando") || msg.includes("Ofertando") || msg.includes("Clicando")) iconHtml = '<i class="fa-solid fa-spinner fa-spin fa-fw"></i> ';
        statusEl.removeClass('pm-status-error pm-status-success pm-status-accent pm-status-normal');
        if (type === 'error') statusEl.addClass('pm-status-error');
        else if (type === 'success') statusEl.addClass('pm-status-success');
        else if (msg.includes("Atualiza")) statusEl.addClass('pm-status-accent');
        else statusEl.addClass('pm-status-normal');
        statusEl.html(iconHtml + msg);
        console.log(`[Carregador do Chefe Status] ${msg}`);
    }

    function init() {
        loadConfig();
        createControlPanel();
        updateLogDisplay();
        updateStatus(currentStatus);
        if (config.enabled) {
            runCheck();
        } else {
            updateStatus("Mula desativada.");
        }
    }

    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        :root { --pm-font-family: 'Roboto', 'Segoe UI', sans-serif; --pm-shadow-color: rgba(0, 0, 0, 0.15); --pm-success-color: #28a745; --pm-error-color: #dc3545; --pm-warning-color: #ffc107; --pm-info-color: #17a2b8; --pm-accent-color: #0056b3; }
        #pmMulePanel.light { --pm-bg-color: #f0f0f0; --pm-text-color: #2c3e50; --pm-text-color-secondary: #7f8c8d; --pm-border-color: #bdc3c7; --pm-subtle-bg: #ffffff; --pm-input-bg: #ffffff; --pm-input-border: var(--pm-border-color); --pm-button-bg: #004080; --pm-button-hover-bg: #003366; --pm-button-text: #ffffff; --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #e4e4e4; --pm-tab-hover-bg: #dcdcdc; --pm-log-bg: #e9ecef; }
        #pmMulePanel.dark { --pm-bg-color: #3d3d3d; --pm-text-color: #f0f0f0; --pm-text-color-secondary: #b0b0b0; --pm-border-color: #555555; --pm-subtle-bg: #474747; --pm-input-bg: #505050; --pm-input-border: #6a6a6a; --pm-button-bg: #0056b3; --pm-button-hover-bg: #004080; --pm-button-text: #ffffff; --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #505050; --pm-tab-hover-bg: #5a5a5a; --pm-log-bg: #474747; --pm-shadow-color: rgba(0, 0, 0, 0.4); }
        #pmMulePanel { position: fixed; background-color: var(--pm-bg-color); border: 1px solid var(--pm-border-color); padding: 0; z-index: 10001; width: 320px; font-family: var(--pm-font-family); font-size: 12px; color: var(--pm-text-color); box-shadow: 0 4px 12px var(--pm-shadow-color); border-radius: 5px; overflow: hidden; display: none; }
        #pmMulePanel i.fa-solid { margin-right: 5px; width: 1.1em; text-align: center; vertical-align: middle; }
        .pm-panel-header { background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); padding: 6px 10px; cursor: move; user-select: none; display: flex; flex-direction: column; position: relative; }
        .pm-panel-header h4 { margin: 0 0 4px 0; text-align: center; font-size: 14px; font-weight: 400; } .pm-panel-header h4 i { margin-right: 8px; color: var(--pm-accent-color); } .pm-panel-header h4 span { font-size: 9px; color: var(--pm-text-color-secondary); margin-left: 5px; }
        .pm-character-name-header { font-size: 11px; color: var(--pm-text-color-secondary); text-align: center; padding: 2px 5px; background: rgba(0,0,0,0.03); border-radius: 3px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pm-header-controls { position: absolute; top: 6px; right: 10px; display: flex; gap: 5px; } .pm-header-controls button { background: none; border: none; color: var(--pm-text-color-secondary); cursor: pointer; font-size: 12px; padding: 0; } .pm-header-controls button:hover { color: var(--pm-accent-color); }
        #pmMulePanel.minimized .pm-tabs, #pmMulePanel.minimized .pm-tab-content-wrapper, #pmMulePanel.minimized .pm-save-button { display: none; } #pmMulePanel.minimized { height: auto !important; }
        .pm-tabs { display: flex; background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); }
        .pm-tab-button { flex: 1; padding: 8px 5px; border: none; background: var(--pm-tab-inactive-bg); color: var(--pm-text-color-secondary); cursor: pointer; font-size: 11px; font-weight: 400; transition: all 0.25s ease; border-bottom: 2px solid transparent; } .pm-tab-button:hover { background: var(--pm-tab-hover-bg); } .pm-tab-button.active { color: var(--pm-accent-color); border-bottom-color: var(--pm-accent-color); background: var(--pm-tab-active-bg); font-weight: 700; }
        .pm-tab-button i { margin-right: 4px; }
        .pm-tab-content-wrapper { padding: 10px; }
        .pm-tab-content { display: none; animation: pmFadeIn 0.5s ease; } .pm-tab-content.active { display: block; } @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        #pmMulePanel div[id^="tab-"] > div:not(.pm-log-header):not(.pm-input-with-suffix) { margin-bottom: 8px; }
        #pmMulePanel label { font-size: 11px; color: var(--pm-text-color-secondary); margin-bottom: 3px; display: block; font-weight: 400; }
        .pm-separator { height: 1px; background: var(--pm-border-color); margin: 10px 0; }
        .pm-text-info { font-size: 10px; color: var(--pm-text-color-secondary); margin-top: 2px; } .pm-text-info i { margin-right: 4px; }
        .pm-text-info.pm-warning-text { color: var(--pm-warning-color); font-weight: bold; }
        .pm-toggle-label { display: flex; align-items: center; font-size: 12px; margin-bottom: 8px; cursor: pointer; user-select: none; }
        .pm-toggle-label input { display: none; }
        .pm-toggle-switch { position: relative; display: inline-block; width: 36px; height: 18px; background-color: var(--pm-border-color); border-radius: 9px; transition: background-color 0.3s ease; cursor: pointer; margin-right: 8px; }
        .pm-toggle-switch::before { content: ""; position: absolute; width: 12px; height: 12px; border-radius: 50%; background-color: white; top: 2px; left: 2px; transition: transform 0.3s ease; }
        .pm-toggle-label input:checked + .pm-toggle-switch { background-color: var(--pm-success-color); }
        .pm-toggle-label input:checked + .pm-toggle-switch::before { transform: translateX(18px); }
        #pmMulePanel input[type="text"], #pmMulePanel input[type="password"], #pmMulePanel input[type="number"] { width: 100%; padding: 6px 8px; border: 1px solid var(--pm-input-border); background: var(--pm-input-bg); color: var(--pm-text-color); border-radius: 3px; font-size: 12px; box-sizing: border-box; }
        .pm-save-button { width: calc(100% - 20px); margin: 10px; background: var(--pm-button-bg); color: var(--pm-button-text); border: none; border-radius: 4px; font-weight: 400; font-size: 13px; cursor: pointer; transition: all 0.2s ease; padding: 8px 12px; } .pm-save-button:hover { background: var(--pm-button-hover-bg); }
        .pm-save-button.pm-save-success { background-color: var(--pm-success-color); cursor: default; }
        .pm-clear-button { background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); color: var(--pm-text-color-secondary); font-size: 10px; padding: 2px 8px; border-radius: 3px; cursor: pointer; }
        .pm-status-box { font-size: 11px; padding: 6px 10px; margin-top: 8px; margin-bottom: 8px; background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); border-left: 3px solid var(--pm-border-color); border-radius: 3px; text-align: center; }
        .pm-status-box.pm-status-normal { color: var(--pm-text-color); } .pm-status-box.pm-status-success { border-left-color: var(--pm-success-color); } .pm-status-box.pm-status-error { border-left-color: var(--pm-error-color); } .pm-status-box.pm-status-accent { border-left-color: var(--pm-accent-color); }
        .pm-log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; font-size: 10px; color: var(--pm-text-color-secondary); }
        #muleActionLog { font-size: 10px; height: 150px; overflow-y: auto; padding: 6px 8px; background: var(--pm-log-bg); border: 1px solid var(--pm-border-color); border-radius: 3px; color: var(--pm-text-color-secondary); }
        .pm-log-entry { margin-bottom: 3px; padding-bottom: 3px; border-bottom: 1px dashed var(--pm-border-color); } .pm-log-entry:last-child { border-bottom: none; }
        .pm-log-empty { text-align: center; padding: 20px; color: var(--pm-text-color-secondary); }
        #pmMulePanel.pm-dragging { opacity: 0.85; }
        .pm-input-with-suffix { display: flex; align-items: center; margin-bottom: 8px;}
        .pm-input-with-suffix input { width: 60px; text-align: center; margin-right: 5px; }
        .pm-input-with-suffix span { font-size: 12px; color: var(--pm-text-color-secondary); }
    `);

    $(document).ready(init);
})();
