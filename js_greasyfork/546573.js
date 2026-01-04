// ==UserScript==
// @name         Auto Use
// @namespace    http://tampermonkey.net/
// @version      14.3
// @description  -
// @author       Popper
// @match        *://*.popmundo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546573/Auto%20Use.user.js
// @updateURL https://update.greasyfork.org/scripts/546573/Auto%20Use.meta.js
// ==/UserScript==

/* global $, jQuery */
(function() {
    'use strict';

    // --- CONFIGURAÇÕES E ESTADO GLOBAL ---
    const ITENS_CONFIG = { "Skate": { location: "Parque", locationId: "3", icon: "fa-person-skating", moveErrorMessage: "visita uma pista de skate" }, "Prancha de surf": { location: "Praia pública", locationId: "104", icon: "fa-person-swimming", moveErrorMessage: "visita uma praia" }};
    const SCRIPT_VERSION = "14.3";
    let actionLog = GM_getValue('autoItemLog_v14', []);
    let currentTheme = GM_getValue('autoItemTheme_v14', 'light');
    let isMinimized = GM_getValue('autoItemMinimized_v14', false);
    let isActionInProgress = false;

    // --- FUNÇÕES DE LOG ---
    function logAction(message, isError = false) { const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); actionLog.unshift({ timestamp, message, isError }); if (actionLog.length > 50) actionLog.pop(); GM_setValue('autoItemLog_v14', actionLog); updateLogDisplay(); }
    function updateLogDisplay() { const logContainer = $('#ai-log-container'); if (!logContainer.length) return; if (actionLog.length === 0) { logContainer.html('<div class="ai-log-empty"><i class="fa-solid fa-clipboard"></i><br>Log vazio</div>'); } else { logContainer.html(actionLog.map(e => `<div class="ai-log-entry ${e.isError ? 'error' : ''}">[${e.timestamp}] ${e.isError ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-info-circle"></i>'} ${e.message}</div>`).join('')); }}
    function clearLog() { actionLog = []; GM_setValue('autoItemLog_v14', []); logAction("Log limpo."); }

    // --- FUNÇÕES DE DADOS ---
    function loadSettings() { const defaultSettings = {}; Object.keys(ITENS_CONFIG).forEach(item => { defaultSettings[item] = { enabled: false, interval: 30, nextAvailableUse: 0 }; }); return $.extend(true, {}, defaultSettings, GM_getValue('itemSettingsV14', {})); }
    function saveSettings(settings) { GM_setValue('itemSettingsV14', settings); }

    // --- LÓGICA DE ATUALIZAÇÃO E COOLDOWN ---
    function refreshInventorySilently() { logAction("Atualizando inventário..."); GM_xmlhttpRequest({ method: "GET", url: window.location.href, onload: function(response) { if (response.status === 200) { const newHtml = $(response.responseText); $('#checkedlist').replaceWith(newHtml.find('#checkedlist')); $('div.box:has(h2:contains("Peso"))').replaceWith(newHtml.find('div.box:has(h2:contains("Peso"))')); logAction("Inventário atualizado."); $('#autoItemPanel').css({ 'transition': 'background-color 0.2s', 'background-color': '#a8d8ff' }).delay(400).queue(function(next){ $(this).css('background-color', ''); next(); }); } else { logAction("Falha ao atualizar inventário (Status: " + response.status + ").", true); }}, onerror: function() { logAction("Erro de rede ao atualizar inventário.", true); }});}
    function waitForNotificationAndProcess(lastAttemptedItem) { let attempts = 0; logAction(`Vigiando por resultado de: ${lastAttemptedItem}`); const intervalId = setInterval(() => { const errorDiv = $('.notification-real.notification-error'); if (errorDiv.length > 0) { clearInterval(intervalId); const errorText = errorDiv.text(); const itemConfig = ITENS_CONFIG[lastAttemptedItem]; if (itemConfig && itemConfig.moveErrorMessage && errorText.includes(itemConfig.moveErrorMessage)) { logAction("Erro de localização detectado!"); processMoveRequired(lastAttemptedItem); } else { logAction("Cooldown de tempo encontrado!"); processCooldownMessage(errorText, lastAttemptedItem); } return; } if (++attempts >= 50) { clearInterval(intervalId); logAction("Nenhuma notificação encontrada. Sucesso."); processSuccess(lastAttemptedItem); }}, 100); }
    function processMoveRequired(itemName) { logAction(`Movimentação necessária para ${itemName}.`, true); sessionStorage.removeItem(`autoItemMoved_${itemName}`); const settings = loadSettings(); settings[itemName].nextAvailableUse = 0; saveSettings(settings); GM_deleteValue('lastAttemptedItem'); logAction("Próxima tentativa irá iniciar a rota."); }
    function processCooldownMessage(errorText, itemName) { let cd = 0; const hMatch = errorText.match(/(\d+)\s+hora\(s\)/); if (hMatch) cd += parseInt(hMatch[1], 10) * 3600000; const mMatch = errorText.match(/(\d+)\s+minuto\(s\)/); if (mMatch) cd += parseInt(mMatch[1], 10) * 60000; const settings = loadSettings(); settings[itemName].nextAvailableUse = Date.now() + (cd > 0 ? cd + 10000 : 60000); saveSettings(settings); GM_deleteValue('lastAttemptedItem'); logAction(`Cooldown de tempo detectado para ${itemName}.`, true); }
    function processSuccess(itemName) { const settings = loadSettings(); settings[itemName].nextAvailableUse = Date.now() + settings[itemName].interval * 60000; saveSettings(settings); GM_deleteValue('lastAttemptedItem'); logAction(`Uso de ${itemName} bem-sucedido.`); if (window.location.pathname.includes("/Character/Items")) { refreshInventorySilently(); }}

    // --- LÓGICA DE CONFIRMAÇÃO (CORRIGIDA) ---
    function watchForConfirmationAndClick() {
        let attempts = 0;
        const maxAttempts = 50; // Vigia por 5 segundos
        const intervalId = setInterval(() => {
            const confirmDialog = $("div.ui-dialog:visible:has(span.ui-dialog-title:contains('Confirme, por favor'))");
            if (confirmDialog.length > 0) {
                const confirmButton = confirmDialog.find("div.ui-dialog-buttonset button:contains('Sim')");
                if (confirmButton.length > 0) {
                    clearInterval(intervalId);
                    logAction("Caixa de confirmação encontrada e clicada.");
                    confirmButton.click();
                    return;
                }
            }
            if (++attempts >= maxAttempts) {
                clearInterval(intervalId);
                // Não faz nada se não encontrar, pois o recarregamento já pode ter acontecido.
            }
        }, 100);
    }

    // --- LÓGICA DE NAVEGAÇÃO OCULTA ---
    async function performHiddenNavigation(itemName) { if (isActionInProgress) return; isActionInProgress = true; logAction(`Iniciando navegação oculta para ${itemName}.`); updateStatus(itemName, 'Movendo em 2º plano...', 'active'); const itemConfig = ITENS_CONFIG[itemName]; const iframe = $('<iframe id="ai-worker-frame" style="display:none;"></iframe>').appendTo('body')[0]; function loadPage(url) { logAction(`[Oculto] Carregando: ${url.split('/').pop()}`); return new Promise((resolve, reject) => { iframe.onload = () => setTimeout(() => { if (iframe.contentDocument) resolve(iframe.contentDocument); else reject(new Error("Conteúdo do iframe inacessível.")); }, 2500); iframe.onerror = () => reject(new Error("Falha ao carregar iframe.")); iframe.src = url; }); } try { let doc = await loadPage(`/World/Popmundo.aspx/City`); const findLocalesLink = $(doc).find('a[href*="/City/Locales"]').attr('href'); if (!findLocalesLink) throw new Error("Link 'Achar Locais' não encontrado."); doc = await loadPage(findLocalesLink); $(doc).find('select[name$="ddlLocaleType"]').val(itemConfig.locationId); const findBtn = $(doc).find('input[name$="btnFind"]')[0]; if (!findBtn) throw new Error("Botão 'Encontrar' não encontrado."); findBtn.click(); await new Promise(resolve => setTimeout(resolve, 3000)); doc = iframe.contentDocument; const moveLink = $(doc).find('#tablelocales tbody tr:first a[href*="MoveToLocale"]').attr('href'); if (!moveLink) throw new Error("Nenhum local encontrado para se mover."); await loadPage(moveLink); logAction(`Movimentação para ${itemName} concluída com sucesso!`); sessionStorage.setItem(`autoItemMoved_${itemName}`, 'true'); useItemDirectly(itemName); } catch (error) { logAction(`ERRO na navegação oculta: ${error.message}`, true); } finally { $(iframe).remove(); isActionInProgress = false; }}
    
    function useItemDirectly(itemName) {
        logAction(`Tentando usar ${itemName}...`);
        const useButton = $(`#checkedlist a:contains('${itemName}')`).filter((i, el) => $(el).text().trim() === itemName).closest('tr').find('input[type="image"][title="Usar"]');
        if (useButton.length > 0) {
            // Define a intenção ANTES da ação que pode recarregar a página
            GM_setValue('lastAttemptedItem', itemName);
            // Inicia a vigilância pela caixa de diálogo
            watchForConfirmationAndClick();
            // Clica no botão de usar
            useButton.click();
        } else {
            logAction(`ERRO: Botão 'Usar' para ${itemName} não encontrado.`, true);
        }
    }

    // --- LÓGICA PRINCIPAL ---
    function mainLogic() { if (isActionInProgress) return; const settings = loadSettings(); const now = Date.now(); const isOnItemsPage = window.location.pathname.includes("/Character/Items"); for (const itemName of Object.keys(ITENS_CONFIG)) { const safeItemName = itemName.replace(/\s/g, '_'); const timerDisplay = $(`#ai-status-${safeItemName}`); if (timerDisplay.length === 0) continue; const config = settings[itemName]; const startStopButton = $(`button[data-item-name="${itemName}"]`); if (!config.enabled) { updateStatus(itemName, 'Parado', 'idle'); if(startStopButton.hasClass('stop')) startStopButton.removeClass('stop').addClass('start').html('<i class="fa-solid fa-play"></i>'); continue; } if(startStopButton.hasClass('start')) startStopButton.removeClass('start').addClass('stop').html('<i class="fa-solid fa-stop"></i>'); if (now >= config.nextAvailableUse) { if (isOnItemsPage) { const hasMoved = sessionStorage.getItem(`autoItemMoved_${itemName}`) === 'true'; if (ITENS_CONFIG[itemName].location && !hasMoved) { performHiddenNavigation(itemName); return; } else { useItemDirectly(itemName); return; } } else if (config.enabled) { updateStatus(itemName, 'Aguardando pág. de itens', 'waiting'); } } else { const timeLeft = config.nextAvailableUse - now; const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000), s = Math.floor((timeLeft % 60000) / 1000); const timeStr = (h > 0) ? `<strong>${h}h ${m}m</strong>` : `<strong>${m}m ${s}s</strong>`; updateStatus(itemName, timeStr, 'waiting'); }}}
    function updateStatus(itemName, text, statusClass) { const icons = { idle: 'fa-power-off', waiting: 'fa-hourglass-half', active: 'fa-route', error: 'fa-triangle-exclamation' }; $(`#ai-status-${itemName.replace(/\s/g, '_')}`).html(`<i class="fa-solid ${icons[statusClass]}"></i> ${text}`).removeClass().addClass(`ai-status-box status-${statusClass}`); }

    // --- FUNÇÕES DE INTERFACE ---
    function createControlPanel() { const settings = loadSettings(); const itemsInInventory = Object.keys(ITENS_CONFIG).filter(itemName => $(`#checkedlist a:contains('${itemName}')`).filter((i, el) => $(el).text().trim() === itemName).length > 0); if (itemsInInventory.length === 0 && !isActionInProgress) return; let itemsHTML = itemsInInventory.map(itemName => { const itemConfig = ITENS_CONFIG[itemName]; const config = settings[itemName]; const safeName = itemName.replace(/\s/g, '_'); return `<div class="ai-item-row"><div class="ai-item-name"><i class="fa-solid ${itemConfig.icon}"></i> ${itemName}</div><div class="ai-controls"><input type="number" class="ai-interval-input" value="${config.interval}" data-item-name="${itemName}"><button class="ai-start-stop-btn ${config.enabled ? 'stop' : 'start'}" data-item-name="${itemName}"><i class="fa-solid ${config.enabled ? 'fa-stop' : 'fa-play'}"></i></button></div><div id="ai-status-${safeName}" class="ai-status-box status-idle"><i class="fa-solid fa-power-off"></i> Parado</div></div>`; }).join(''); const panelHTML = `<div id="autoItemPanel" class="${currentTheme} ${isMinimized ? 'minimized' : ''}"><div class="ai-panel-header"><h4><i class="fa-solid fa-bolt"></i> Auto Use <span>v${SCRIPT_VERSION}</span></h4><div class="ai-header-controls"><button id="aiThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button><button id="aiMinimizeToggle" title="Minimizar"><i class="fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}"></i></button></div></div><div class="ai-tabs"><button class="ai-tab-button active" data-tab="control">Controle</button><button class="ai-tab-button" data-tab="log">Log</button></div><div class="ai-panel-content"><div id="tab-control" class="ai-tab-content active">${itemsHTML}</div><div id="tab-log" class="ai-tab-content"><div class="ai-log-header"><span>Log de Atividades</span><button id="aiClearLogBtn" title="Limpar Log"><i class="fa-solid fa-broom"></i> Limpar</button></div><div id="ai-log-container"></div></div></div></div>`; $('body').append(panelHTML); const pos = GM_getValue('autoItemPanelPosition_v14', { top: '10px', left: '10px' }); $('#autoItemPanel').css(pos).fadeIn(400); updateLogDisplay(); }
    function attachEventHandlers() { const panel = $('#autoItemPanel'); panel.on('click', '#aiThemeToggle', () => { currentTheme = currentTheme === 'light' ? 'dark' : 'light'; panel.removeClass('light dark').addClass(currentTheme); $('#aiThemeToggle i').toggleClass('fa-sun fa-moon'); GM_setValue('autoItemTheme_v14', currentTheme); }); panel.on('click', '#aiMinimizeToggle', () => { isMinimized = !isMinimized; panel.toggleClass('minimized', isMinimized); $('#aiMinimizeToggle i').toggleClass('fa-window-minimize fa-window-maximize'); GM_setValue('autoItemMinimized_v14', isMinimized); }); panel.on('click', '.ai-start-stop-btn', function() { const itemName = $(this).data('item-name'); const settings = loadSettings(); settings[itemName].enabled = !settings[itemName].enabled; if (settings[itemName].enabled) { settings[itemName].nextAvailableUse = 0; sessionStorage.removeItem(`autoItemMoved_${itemName}`); } saveSettings(settings); location.reload(); }); panel.on('change', '.ai-interval-input', function() { const itemName = $(this).data('item-name'); const newInterval = parseInt($(this).val(), 10); if (!isNaN(newInterval) && newInterval > 0) { const settings = loadSettings(); settings[itemName].interval = newInterval; saveSettings(settings); $(this).css('border-color', '#28a745'); setTimeout(() => $(this).css('border-color', ''), 2000); } }); panel.on('click', '.ai-tab-button', function() { const tab = $(this).data('tab'); panel.find('.ai-tab-button, .ai-tab-content').removeClass('active'); $(this).addClass('active'); $(`#tab-${tab}`).addClass('active'); }); panel.on('click', '#aiClearLogBtn', clearLog); }
    function makePanelDraggable() { const panel = $("#autoItemPanel"); const header = panel.find(".ai-panel-header"); header.on('mousedown', function(e) { if ($(e.target).closest("button").length) return; const offset = panel.offset(); const drag = { x: e.pageX - offset.left, y: e.pageY - offset.top }; panel.addClass('is-dragging'); $(document).on('mousemove.ai_drag', e => panel.offset({ top: e.pageY - drag.y, left: e.pageX - drag.x })).on('mouseup.ai_drag', () => { $(document).off('mousemove.ai_drag mouseup.ai_drag'); panel.removeClass('is-dragging'); GM_setValue('autoItemPanelPosition_v14', { top: panel.css('top'), left: panel.css('left') }); }); }); }
    function addGlobalStyles() {GM_addStyle(`@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');:root { --ai-font: 'Roboto', sans-serif; --ai-success: #28a745; --ai-error: #dc3545; --ai-accent: #007bff; --ai-waiting: #ffc107; --ai-active: #17a2b8; --ai-idle: #6c757d;}#autoItemPanel.light { --bg: #f8f9fa; --text: #212529; --border: #dee2e6; --header-bg: #e9ecef; --input-bg: #fff; --shadow: rgba(0,0,0,0.1); --tab-active-bg: #fff; }#autoItemPanel.dark { --bg: #2c3e50; --text: #ecf0f1; --border: #34495e; --header-bg: #34495e; --input-bg: #4a627a; --shadow: rgba(0,0,0,0.4); --tab-active-bg: #2c3e50; }#autoItemPanel { position: fixed; z-index: 10001; width: 480px; font-family: var(--ai-font); font-size: 13px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 5px 15px var(--shadow); display: none; } .ai-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--header-bg); border-bottom: 1px solid var(--border); cursor: move; user-select: none; border-top-left-radius: 7px; border-top-right-radius: 7px; } .ai-panel-header h4 { margin: 0; font-size: 14px; font-weight: 700; } .ai-panel-header h4 i { color: var(--ai-accent); margin-right: 8px; } .ai-panel-header h4 span { font-size: 10px; opacity: 0.7; } .ai-header-controls button { background: none; border: none; color: var(--text); opacity: 0.7; cursor: pointer; padding: 2px 4px; } .ai-header-controls button:hover { opacity: 1; } #autoItemPanel.minimized .ai-panel-content, #autoItemPanel.minimized .ai-tabs { display: none; } #autoItemPanel.is-dragging { opacity: 0.9; cursor: grabbing; } .ai-tabs { display: flex; background-color: var(--header-bg); } .ai-tab-button { flex-grow: 1; padding: 8px; border: none; background: transparent; color: var(--text); opacity: 0.7; cursor: pointer; border-bottom: 2px solid transparent; } .ai-tab-button.active { opacity: 1; font-weight: 700; border-bottom-color: var(--ai-accent); background-color: var(--tab-active-bg); } .ai-panel-content { padding: 5px 12px; } .ai-tab-content { display: none; } .ai-tab-content.active { display: block; animation: fadeIn 0.3s; } @keyframes fadeIn { from {opacity:0} to {opacity:1} } .ai-item-row { display: grid; grid-template-columns: 1fr 1fr 150px; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); } .ai-item-row:last-child { border-bottom: none; } .ai-item-name { font-weight: 700; } .ai-item-name i { margin-right: 8px; opacity: 0.8; } .ai-controls { display: flex; align-items: center; justify-content: flex-end; } .ai-interval-input { width: 50px; text-align: center; background: var(--input-bg); color: var(--text); border: 1px solid var(--border); border-radius: 4px; padding: 5px; margin-right: 8px; } .ai-start-stop-btn { font-size: 13px; color: #fff; border: none; border-radius: 4px; width: 32px; height: 32px; cursor: pointer; transition: background-color 0.2s; } .ai-start-stop-btn.start { background-color: var(--ai-success); } .ai-start-stop-btn.start:hover { background-color: #218838; } .ai-start-stop-btn.stop { background-color: var(--ai-error); } .ai-start-stop-btn.stop:hover { background-color: #c82333; } .ai-status-box { text-align: center; font-size: 12px; padding: 6px; border-radius: 4px; } .ai-status-box strong { font-weight: 700; } .ai-status-box i { margin-right: 6px; } .status-idle { color: var(--ai-idle); } .status-waiting { color: var(--ai-waiting); } .status-active { color: var(--ai-active); } .status-error { color: var(--ai-error); } .ai-log-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; } .ai-log-header span { font-weight: 700; } #aiClearLogBtn { background: var(--input-bg); border: 1px solid var(--border); color: var(--text); opacity: 0.7; font-size: 11px; padding: 2px 8px; border-radius: 3px; cursor: pointer; } #aiClearLogBtn:hover { opacity: 1; } #ai-log-container { font-size: 11px; height: 180px; overflow-y: auto; padding: 8px; background: var(--input-bg); border: 1px solid var(--border); border-radius: 4px; color: var(--text); opacity: 0.8; } .ai-log-entry { margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed var(--border); } .ai-log-entry:last-child { border-bottom: none; } .ai-log-entry.error { color: var(--ai-error); } .ai-log-empty { text-align: center; padding: 40px 0; opacity: 0.5; }`);}

    // --- INICIALIZAÇÃO ---
    $(document).ready(function() {
        if (window.location.pathname.includes("/Character/Items")) {
            addGlobalStyles(); createControlPanel(); attachEventHandlers(); makePanelDraggable();
            logAction(`Script inicializado na página: ${window.location.pathname}`);
            const lastAttemptedItem = GM_getValue('lastAttemptedItem');
            if (lastAttemptedItem) { waitForNotificationAndProcess(lastAttemptedItem); }
            setInterval(mainLogic, 1000);
        }
    });

})();