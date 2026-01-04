// ==UserScript==
// @name          Automator PopMundo
// @namespace     https://popmundo.com/
// @version       2.1.0
// @description   Automatiza interações no Popmundo.
// @author        Ninja
// @match         https://*.popmundo.com/World/Popmundo.aspx/*
// @grant         none
// @require       https://cdn.jsdelivr.net/npm/js-cookie@3.0.0/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/537450/Automator%20PopMundo.user.js
// @updateURL https://update.greasyfork.org/scripts/537450/Automator%20PopMundo.meta.js
// ==/UserScript==
(function() {
    'use strict'

    //Delay entre abertura de abas em milisegundos.
    const DELAY = 500 //ms
    //Domain
    const DOMAIN = "popmundo.com";

    // Seletor flexível para o dropdown de personagem. A CHAVE DA SOLUÇÃO.
    const CHAR_DROPDOWN_SELECTOR = "select[id$='ucCharacterBar_ddlCurrentCharacter']";

    // Lista Mestra de todas as interações conhecidas.
    const allPossibleInteractions = {
        62: "Dizer o que pensa", 34: "Ter uma discussão profunda", 18: "Brincar com", 44: "Fazer massagem",
        60: "High Five", 67: "Queda de braço", 66: "Trançar o cabelo", 63: "Tapinha nas costas",
        1: "Cumprimentar", 3: "Conversar", 5: "Fazer graça", 65: "Fofocar", 69: "Contar segredos",
        70: "Dar uma volta", 51: "Consolar", 57: "Fraternizar", 68: "Dar conselhos", 55: "Aperto de mão",
        59: "Passar um tempo junto", 8: "Abraçar", 56: "Beijar o rosto", 21: "Cantar para", 4: "Contar piada",
        24: "Ligar para papear", 26: "Passar trote", 121: "Fofocar ao telefone", 58: "Mandar foto engraçada por MMS",
        61: "Mandar mensagem no celular", 158: "Dançar o fish slapping", 98: "Falar sobre hobbies",
        99: "Esconde-esconde", 93: "Pegar no colo", 95: "Trocar as fraldas", 6: "Gugu-dadá",
        96: "Cantar uma canção de ninar", 103: "Beijinho na testa", 91: "Olhar", 90: "Balbuciar",
        92: "Sorrir alegremente", 33: "Fazer uma mágica divertida",
        76: "Contar piada safada", 30: "Acariciar", 9: "Beijar", 75: "Louvar", 10: "Beijar apaixonadamente",
        77: "Dizer eu amo você", 161: "Piscar", 14: "Elogiar", 71: "Você vem sempre aqui?",
        20: "Dar uns tapinhas...", 13: "Rapidinha", 64: "Envolver", 12: "Fazer cócegas",
        165: "Ligação Romantica", 25: "Ligação safadinha", 74: "Flertar por SMS", 73: "Ligar para flertar",
        11: "Fazer amor", 19: "Sexo tântrico", 164: "Desfrutar do Kobe Sutra", 171: "Ligar para agradecer",
    };

    // --- GERENCIAMENTO DE ESTADO E DADOS ---
    let loggedInCharId;
    let loggedInCharName; // NOVO: Armazena o nome do personagem logado.
    let CUSTOM_PROFILES_KEY;

    const manageCharacterSession = () => {
        const STORAGE_KEY = 'popmundo_char_session_info';
        const dropdown = jQuery(CHAR_DROPDOWN_SELECTOR);

        const currentGuid = dropdown.find('option:selected').val();
        const currentName = dropdown.find('option:selected').text();
        loggedInCharName = currentName; // NOVO: Captura o nome.

        if (currentGuid === '0') {
             sessionStorage.removeItem(STORAGE_KEY);
             return null;
        }

        let storedInfo;
        try { storedInfo = JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch (e) { storedInfo = null; }

        if (storedInfo && storedInfo.guid === currentGuid && storedInfo.numericalId) {
            loggedInCharName = storedInfo.name; // Garante que temos o nome mesmo com a sessão.
            return storedInfo.numericalId;
        }

        console.log(`Automator Popmundo: Sessão nova ou troca de personagem detectada para "${currentName}". Re-identificando...`);

        const detectNumericalId = () => {
            const path = window.location.pathname;
            const extractIdFromHref = (href) => {
                if (!href || !href.includes('/Character/')) return null;
                try {
                    const potentialId = parseInt(href.split('/Character/')[1], 10);
                    return isNaN(potentialId) ? null : potentialId;
                } catch (e) { return null; }
            };
            if (path.includes('/Character/Relations/')) {
                try {
                    const id = parseInt(path.split('/Character/Relations/')[1], 10);
                    if (!isNaN(id)) return id;
                } catch (e) {}
            }
            let link = jQuery('#ctl00_cphLeftColumn_ctl00_divCharacterLinks a[href*="/Character/"]:first').attr('href');
            if (link) return extractIdFromHref(link);
            link = jQuery('a:has(img[alt="Meu Personagem"])').attr('href');
            if (link) return extractIdFromHref(link);
            link = jQuery('#column1 a[href*="/Character/"]:first').attr('href');
            if (link) return extractIdFromHref(link);
            return null;
        };

        const numericalId = detectNumericalId();

        if (numericalId) {
            const newInfo = { guid: currentGuid, numericalId: numericalId, name: currentName };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newInfo));
            console.log(`Automator Popmundo: Personagem "${currentName}" identificado com ID numérico ${numericalId}.`);
            return numericalId;
        }

        console.warn(`Automator Popmundo: Falha ao detectar o ID numérico para "${currentName}".`);
        return null;
    };


    const SCRIPT_STATE_KEY = 'interactScriptState';
    const LOG_STORAGE_KEY = 'popmundo_script_log';

    const getScriptState = () => localStorage.getItem(SCRIPT_STATE_KEY);
    const setScriptState = (state) => localStorage.setItem(SCRIPT_STATE_KEY, state);
    const stopScript = () => localStorage.removeItem(SCRIPT_STATE_KEY);
    const isScriptRunning = () => getScriptState() === 'running';
    const isScriptPaused = () => getScriptState() === 'paused';

    // --- NOVAS FUNÇÕES DE GERENCIAMENTO DE PERFIS ---

    /**
     * NOVO: Procura no localStorage por todos os perfis salvos de todos os personagens.
     * @returns {Array} Lista de objetos, cada um contendo id, nome e dados dos perfis de um personagem.
     */
    const findAllCharacterProfiles = () => {
        const allProfilesData = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('popmundo_profiles_')) {
                try {
                    const charId = parseInt(key.replace('popmundo_profiles_', ''), 10);
                    if (charId && charId !== loggedInCharId) { // Exclui o personagem atual
                        const data = JSON.parse(localStorage.getItem(key));
                        // Suporta a nova estrutura e a antiga
                        const charName = data.characterName || `Personagem ID ${charId}`;
                        const profiles = data.profiles || data;
                        if (Object.keys(profiles).length > 0) {
                           allProfilesData.push({ id: charId, name: charName, profiles: profiles });
                        }
                    }
                } catch (e) {
                    console.warn(`Automator Popmundo: Falha ao ler perfis da chave ${key}`, e);
                }
            }
        }
        return allProfilesData;
    };


    /**
     * MODIFICADO: Lê os perfis do personagem atual.
     * Agora extrai os perfis da nova estrutura de dados {characterName, profiles}.
     */
    const getCustomProfiles = () => {
        try {
            const rawData = localStorage.getItem(CUSTOM_PROFILES_KEY);
            if (!rawData) return {};
            const parsedData = JSON.parse(rawData);
            // Se 'profiles' existir, retorna isso (nova estrutura), senão, assume que é a estrutura antiga.
            return parsedData.profiles || parsedData;
        } catch (e) {
            return {};
        }
    };

    /**
     * MODIFICADO: Salva os perfis do personagem atual.
     * Agora salva no novo formato {characterName, profiles}.
     */
    const saveCustomProfiles = (profiles) => {
        const dataToStore = {
            characterName: loggedInCharName || "Desconhecido",
            profiles: profiles
        };
        localStorage.setItem(CUSTOM_PROFILES_KEY, JSON.stringify(dataToStore));
    };

    const getAllProfiles = () => getCustomProfiles();

    // --- FUNÇÕES DE NAVEGAÇÃO E INTERAÇÃO (sem alteração) ---
    jQuery.fn.center = function () { return this.css("left", jQuery("#ppm-main").position().left + "px") }
    const getInteractionUserLinks = () => {
        const l = [];
        jQuery(".data").not("#autointeract-log-table").find("a[href*='/Interact/Details/']").each((i, a) => {
            const url = a.href.replace("/Interact/Details/", "/Character/");
            const name = jQuery(a).closest('tr').find("a[href*='/Character/']").text().trim();
            l.push({ url: url, name: name });
        });
        return l;
    };
    const getAvaiableInteractions = () => { const r = []; jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o) => { if (o.value != 0) { r.push(o.value) } }); return r; };
    const getLocationId = () => { let r = 0; jQuery(".characterPresentation a").each((i, a) => { if (a.href.includes("/World/Popmundo.aspx/Locale/")) { r = Number(a.href.split("/Locale/")[1]) } }); return r; };
    const getCityId = () => { let r = 0; jQuery(".characterPresentation a").each((_, a) => { if (a.href.includes("/World/Popmundo.aspx/City/")) { r = Number(a.href.split("/City/")[1]) } }); return r; };
    const goToPage = (p) => { jQuery.when(jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage").val(p).change()).then(() => { __doPostBack('ctl00$cphLeftColumn$ctl00$ddlShowPage', '') }) };
    const gotoInteraction = (id) => { window.location.pathname = `/World/Popmundo.aspx/Interact/${id}` };
    const gotoPhone = (id) => { window.location.pathname = `/World/Popmundo.aspx/Interact/Phone/${id}` };
    const gotoLocation = (locId, userId) => { window.location.pathname = `/World/Popmundo.aspx/Locale/MoveToLocale/${locId}/${userId}` };
    const getPageCount = () => { const p = jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").length; return p == 0 ? 1 : p; };
    const getCurrentPage = () => { let c = 1; jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").each((_, o) => { if (jQuery(o).attr("selected")) { c = o.value } }); return c; };
    const isLastPage = () => (getCurrentPage() == getPageCount());
    const interact = (id) => { jQuery.when(jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val(id).change()).then(() => { let b = jQuery("#ctl00_cphTopColumn_ctl00_btnInteract"); if (b.length > 0) { b.click() } }) };

    const getNextInteraction = (userId) => {
        const allProfiles = getAllProfiles();
        const preference = Cookies.get("interact-" + userId, { domain: DOMAIN });
        const avaiableIntr = getAvaiableInteractions();
        if (preference && preference !== "skip" && allProfiles[preference]) {
            for (let intr of allProfiles[preference]) {
                if (avaiableIntr.includes(String(intr))) return intr;
            }
        }
        return -1;
    };

    let frameOpen = false;
    const openUrl = (url) => { frameOpen = true; jQuery('#interaction-iframe').attr('src', url); };
    const closeUrl = () => { frameOpen = false; jQuery('#interaction-iframe').attr('src', null); };
    const sendClose = () => { window.parent.postMessage("interaction-frame-close", "*") };

    // --- LÓGICA DE LOG (sem alteração) ---
    let LOG_INDEX = 0;
    const log = (data) => {
        if (window.parent === window) {
            jQuery("#autointeract-log-table").find('tbody').append(`<tr class="${LOG_INDEX++ % 2 == 0 ? "odd": "even"}"><td>${data}</td></tr>`);
            try {
                const storedLog = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
                storedLog.push(data);
                localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(storedLog));
            } catch (e) { console.error("Falha ao salvar log:", e); }
        } else {
            window.parent.postMessage("interaction-frame-log#"+data, "*");
        }
    };

    const loadLogFromStorage = () => {
        const logTableBody = jQuery("#autointeract-log-table").find('tbody');
        logTableBody.empty();
        try {
            const storedLog = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
            storedLog.forEach(logEntry => {
                logTableBody.append(`<tr class="${LOG_INDEX++ % 2 == 0 ? "odd": "even"}"><td>${logEntry}</td></tr>`);
            });
        } catch(e) { localStorage.removeItem(LOG_STORAGE_KEY); }
    };

    const open = (cityId, links, current, finished) => {
        if (links.length == current || !isScriptRunning()) {
            if (!isScriptRunning()) log('Script pausado ou cancelado.');
            finished();
            return;
        }
        const charName = encodeURIComponent(links[current].name);
        openUrl(`${links[current].url}#${cityId}|${charName}`);

        const interval = setInterval(() => {
            if (!frameOpen) {
                clearInterval(interval);
                setTimeout(() => open(cityId, links, current + 1, finished), DELAY);
            }
        }, 500);
    };

    const injectIframe = () => {
        jQuery("body").append(`<iframe id="interaction-iframe" style="position: absolute; width:0;height:0;border: 0;border: none;"></iframe>`);
        window.addEventListener('message', e => {
            const data = (e.message ? e.message : e.data) + "";
            if (data == "interaction-frame-close") closeUrl();
            if (data.includes("interaction-frame-log#")) log(data.split("interaction-frame-log#")[1]);
        }, false);
    };

    // ##################################################################################
    // #                     INTERFACE GRÁFICA (UI) v2.1.0                              #
    // ##################################################################################
    const injectGUI = () => {
        const allProfiles = getAllProfiles();
        let interactionOptions = '', existingProfilesHtml = '', bulkAssignOptions = '<option value="">-- Selecione --</option>';

        Object.entries(allPossibleInteractions).sort((a, b) => a[1].localeCompare(b[1])).forEach(([id, name]) => {
            interactionOptions += `<option value="${id}">[${id}] ${name}</option>`;
        });

        if (!loggedInCharId) {
            existingProfilesHtml = '<p style="color: #c00;">Não foi possível identificar o personagem. Os perfis não podem ser carregados ou criados.</p>';
        } else {
            for (const profileName in allProfiles) {
                existingProfilesHtml += `<div class="profile-item" data-profile-name="${profileName}"><strong>${profileName}</strong><span class="profile-controls"><button type="button" class="edit-profile-btn round">Editar</button><button type="button" class="delete-profile-btn round">Excluir</button></span></div>`;
                bulkAssignOptions += `<option value="${profileName}">${profileName}</option>`;
            }
            existingProfilesHtml = existingProfilesHtml || '<p>Nenhum perfil criado para este personagem.</p>';
        }

        // --- NOVO: HTML para o importador de perfis ---
        const otherCharactersWithProfiles = findAllCharacterProfiles();
        let importPanelHtml = '';
        if (otherCharactersWithProfiles.length > 0) {
            let charOptions = '<option value="">-- Selecione Personagem --</option>';
            otherCharactersWithProfiles.forEach(charData => {
                charOptions += `<option value="${charData.id}">${charData.name}</option>`;
            });
            importPanelHtml = `
                <div id="import-profiles-section">
                    <h4>Importar Perfil de Outro Personagem</h4>
                    <select id="import-char-select" class="round">${charOptions}</select>
                    <select id="import-profile-select" class="round" disabled><option value="">-- Selecione Perfil --</option></select>
                    <button type="button" id="import-profile-btn" class="round" disabled>Importar</button>
                </div>`;
        } else {
             importPanelHtml = `<div id="import-profiles-section"><h4>Importar Perfil</h4><p>Nenhum perfil de outros personagens encontrado.</p></div>`;
        }

        function getActionButtonsHtml() {
            const state = getScriptState();
            if (state === 'running') return `<button type="button" id="script-pause-btn" class="round">Pausar</button>`;
            if (state === 'paused') return `<button type="button" id="script-resume-btn" class="round">Retomar</button><button type="button" id="script-cancel-btn" class="round">Cancelar</button>`;
            return `<button type="button" id="script-start-btn" class="round">Iniciar</button>`;
        }

        const profileManagerPanel = `<div class="box"><details><summary><h2>Gerenciar Perfis de Interação:</h2></summary><div class="box-content"><div id="existing-profiles-list"><h4>Seus Perfis</h4>${existingProfilesHtml}</div><hr>${importPanelHtml}<hr><div id="profile-editor"><h4 id="editor-title">Criar Novo Perfil</h4><p><label for="profile-name-input">Nome:</label><br><input type="text" id="profile-name-input" class="round"></p><div class="editor-columns"><div><label>Disponíveis:</label><select id="available-interactions-select" size="10" class="round">${interactionOptions}</select><button type="button" id="add-interaction-btn" class="round">Adicionar →</button></div><div><label>No Perfil (ordem):</label><ul id="profile-selected-list"></ul></div></div><p class="actionbuttons"><button type="button" id="save-profile-btn" class="round">Salvar</button><button type="button" id="cancel-edit-btn" class="round" style="display: none;">Cancelar</button></p></div></div></details></div>`;
        const bulkAssignPanel = `<div class="box"><h2>Seleção Rápida:</h2><div class="box-content"><p>Aplicar perfil para personagens da <strong>mesma cidade</strong>:</p><select id="bulk-assign-same-city-profile-select" class="round">${bulkAssignOptions}</select><button id="bulk-assign-same-city-btn" class="round" type="button">Aplicar</button><p style="margin-top: 10px;">Aplicar perfil para personagens de <strong>outras cidades</strong>:</p><select id="bulk-assign-other-city-profile-select" class="round">${bulkAssignOptions}</select><button id="bulk-assign-other-city-btn" class="round" type="button">Aplicar</button></div></div>`;
        const actionLogPanel = `<div class="box"><h2>Ações e Log</h2><div class="box-content"><p class="actionbuttons" id="action-buttons-container">${getActionButtonsHtml()}<button id="clear-log-btn" class="round" type="button" title="Limpar Log" style="margin-left: 15px;">Limpar Log</button></p><table class="data" id="autointeract-log-table"><tbody></tbody></table></div></div>`;
        const uiStyles = `<style>#action-buttons-container button{margin-right:5px;}.box-content{padding:0 10px 10px 10px}summary{cursor:pointer;list-style:none}summary::-webkit-details-marker{display:none}summary h2{margin-bottom:0 !important}details[open] summary h2{margin-bottom:12px !important}#autointeract-container h4{margin-top:10px;border-bottom:1px solid #ccc;padding-bottom:5px}#existing-profiles-list .profile-item{display:flex;justify-content:space-between;align-items:center;padding:5px;border-bottom:1px solid #eee}#existing-profiles-list .profile-item:last-child{border:none}.profile-controls button{margin-left:5px}#profile-editor{padding:10px;border:1px dashed #ccc;margin-top:10px;border-radius:3px}#profile-editor .editor-columns{display:flex;gap:10px;align-items:flex-start}#profile-editor .editor-columns>div{flex:1}#profile-editor input,#profile-editor select{width:100%;box-sizing:border-box}#profile-editor #add-interaction-btn{margin-top:5px}#profile-selected-list{list-style:none;margin:0;padding:5px;border:1px solid #ccc;height:180px;overflow-y:auto;background:#fff;border-radius:3px}#profile-selected-list li{padding:4px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}#profile-selected-list li:hover{background:#f0f8ff}#profile-selected-list .controls button{font-size:12px;padding:1px 5px;margin-left:2px}#bulk-assign-same-city-profile-select, #bulk-assign-other-city-profile-select{margin-right:10px; width: auto;} #import-profiles-section select{margin-right: 5px;}</style>`;

        jQuery('head').append(uiStyles);
        jQuery("#ppm-content").prepend(`<div id="autointeract-container">${profileManagerPanel}${bulkAssignPanel}${actionLogPanel}</div>`);

        if (!loggedInCharId) {
            jQuery('#profile-editor input, #profile-editor select, #profile-editor button').prop('disabled', true);
            jQuery('#bulk-assign-same-city-profile-select, #bulk-assign-other-city-profile-select, #bulk-assign-same-city-btn, #bulk-assign-other-city-btn').prop('disabled', true);
            jQuery('#import-profiles-section select, #import-profiles-section button').prop('disabled', true);
        }

        const relationsTable = jQuery(".data").not("#autointeract-log-table");
        relationsTable.find("thead tr").append("<th>Prioridade</th>");
        relationsTable.find("tbody tr").each((_, elem) => {
            const link = jQuery(elem).find("a[href*='/Character/']");
            if (link.length > 0) {
                const id = Number(link.attr('href').split("/Character/")[1]);
                const selected = Cookies.get("interact-" + id, { domain: DOMAIN });
                let optionsHtml = '<option value="">-- Selecione --</option>';
                for (const name in allProfiles) { optionsHtml += `<option value="${name}" ${selected == name ? "selected":""}>${name}</option>`; }
                optionsHtml += `<option value="skip" ${selected == "skip" ? "selected":""}>Skip</option>`;
                jQuery(elem).append(`<td><select data-id="${id}" class="interaction-type round">${optionsHtml}</select></td>`);
            } else { relationsTable.find("thead tr th:last-child").remove(); }
        });
    };

    // ##################################################################################
    // #                     LÓGICA DE EVENTOS (HANDLERS)                               #
    // ##################################################################################
    function setupEventHandlers() {
        function addInteractionToSelectedList(id, name) { if (jQuery('#profile-selected-list').find(`li[data-id="${id}"]`).length > 0) return; jQuery('#profile-selected-list').append(`<li data-id="${id}"><span>[${id}] ${name}</span><span class="controls"><button type="button" class="move-up-btn round" title="Subir">▲</button><button type="button" class="move-down-btn round" title="Descer">▼</button><button type="button" class="remove-interaction-btn round" title="Remover">X</button></span></li>`); }
        jQuery(document).on('click', '#add-interaction-btn', () => { const opt = jQuery('#available-interactions-select option:selected'); if (opt.length) addInteractionToSelectedList(opt.val(), opt.text().split('] ')[1]); });
        jQuery(document).on('click', '.remove-interaction-btn', function() { jQuery(this).closest('li').remove(); });
        jQuery(document).on('click', '.move-up-btn', function() { const li = jQuery(this).closest('li'); li.prev().before(li); });
        jQuery(document).on('click', '.move-down-btn', function() { const li = jQuery(this).closest('li'); li.next().after(li); });
        function resetEditor() { jQuery('#editor-title').text('Criar Novo Perfil'); jQuery('#profile-name-input').val('').prop('readonly', false); jQuery('#profile-selected-list').empty(); jQuery('#cancel-edit-btn').hide(); }
        jQuery(document).on('click', '#save-profile-btn', () => { const name = jQuery('#profile-name-input').val().trim(); const interactions = jQuery('#profile-selected-list li').map(function() { return jQuery(this).data('id'); }).get(); if (!name) { alert('Insira um nome para o perfil.'); return; } if (interactions.length === 0) { alert('Adicione pelo menos uma interação.'); return; } const profiles = getCustomProfiles(); profiles[name] = interactions; saveCustomProfiles(profiles); alert(`Perfil "${name}" salvo! A página será recarregada.`); window.location.reload(); });
        jQuery(document).on('click', '.delete-profile-btn', function() { const name = jQuery(this).closest('.profile-item').data('profile-name'); if (confirm(`Excluir o perfil "${name}"?`)) { const profiles = getCustomProfiles(); delete profiles[name]; saveCustomProfiles(profiles); alert(`Perfil "${name}" excluído. A página será recarregada.`); window.location.reload(); } });
        jQuery(document).on('click', '.edit-profile-btn', function() { const name = jQuery(this).closest('.profile-item').data('profile-name'); const data = getCustomProfiles()[name]; if (data) { resetEditor(); jQuery('#editor-title').text(`Editando: ${name}`); jQuery('#profile-name-input').val(name).prop('readonly', true); data.forEach(id => addInteractionToSelectedList(id, allPossibleInteractions[id] || 'Desconhecido')); jQuery('#cancel-edit-btn').show(); const details = jQuery('#profile-editor').closest('details'); if (!details.prop('open')) { details.prop('open', true); } jQuery('html, body').animate({ scrollTop: jQuery("#profile-editor").offset().top - 20 }, 500); } });
        jQuery(document).on('click', '#cancel-edit-btn', resetEditor);
        jQuery(document).on('click', '#bulk-assign-same-city-btn', () => { const profile = jQuery('#bulk-assign-same-city-profile-select').val(); if (!profile) return; let count = 0; jQuery(".data").not("#autointeract-log-table").find("tbody tr").each(function() { const isSameCity = jQuery(this).find('a strong').length > 0; if (isSameCity) { const select = jQuery(this).find('select.interaction-type'); if (select.length) { select.val(profile).trigger('change'); count++; } } }); alert(`${count} personagem(ns) da mesma cidade atualizado(s) para o perfil "${profile}".`); });
        jQuery(document).on('click', '#bulk-assign-other-city-btn', () => { const profile = jQuery('#bulk-assign-other-city-profile-select').val(); if (!profile) return; let count = 0; jQuery(".data").not("#autointeract-log-table").find("tbody tr").each(function() { const isOtherCity = jQuery(this).find('a strong').length === 0 && jQuery(this).find('a[href*="/Character/"]').length > 0; if (isOtherCity) { const select = jQuery(this).find('select.interaction-type'); if (select.length) { select.val(profile).trigger('change'); count++; } } }); alert(`${count} personagem(ns) de outras cidades atualizado(s) para o perfil "${profile}".`); });
        jQuery(document).on("change", ".interaction-type", (event) => { const elem = jQuery(event.target); Cookies.set("interact-" + elem.data("id"), elem.val(), { domain: DOMAIN }); });

        // --- NOVOS EVENT HANDLERS PARA IMPORTAÇÃO ---
        const otherCharactersProfiles = findAllCharacterProfiles();
        jQuery(document).on('change', '#import-char-select', function() {
            const selectedCharId = jQuery(this).val();
            const profileSelect = jQuery('#import-profile-select');
            const importBtn = jQuery('#import-profile-btn');
            profileSelect.html('<option value="">-- Selecione Perfil --</option>').prop('disabled', true);
            importBtn.prop('disabled', true);

            if (selectedCharId) {
                const charData = otherCharactersProfiles.find(c => c.id == selectedCharId);
                if (charData && charData.profiles) {
                    Object.keys(charData.profiles).forEach(profileName => {
                        profileSelect.append(`<option value="${profileName}">${profileName}</option>`);
                    });
                    profileSelect.prop('disabled', false);
                }
            }
        });

        jQuery(document).on('change', '#import-profile-select', function() {
            jQuery('#import-profile-btn').prop('disabled', !jQuery(this).val());
        });

        jQuery(document).on('click', '#import-profile-btn', function() {
            const charId = jQuery('#import-char-select').val();
            const profileName = jQuery('#import-profile-select').val();

            if (!charId || !profileName) return;

            const charData = otherCharactersProfiles.find(c => c.id == charId);
            const profileToImport = charData.profiles[profileName];

            const currentProfiles = getCustomProfiles();

            if (currentProfiles[profileName]) {
                if (!confirm(`Um perfil com o nome "${profileName}" já existe. Deseja sobrescrevê-lo?`)) {
                    return;
                }
            }

            currentProfiles[profileName] = profileToImport;
            saveCustomProfiles(currentProfiles);
            alert(`Perfil "${profileName}" do personagem "${charData.name}" importado com sucesso! A página será recarregada.`);
            window.location.reload();
        });


        // Handlers de controle do script
        jQuery(document).on('click', '#script-start-btn', () => {
            if (!loggedInCharId) {
                alert("ERRO: Não foi possível identificar o personagem logado. O script não pode iniciar. Tente navegar para a página do seu personagem ou para a página de Relações e recarregue.");
                return;
            }
            localStorage.removeItem(LOG_STORAGE_KEY);
            setScriptState('running');
            window.location.reload();
        });
        jQuery(document).on('click', '#script-pause-btn', () => { setScriptState('paused'); jQuery('#action-buttons-container').html(`<button type="button" id="script-resume-btn" class="round">Retomar</button><button type="button" id="script-cancel-btn" class="round">Cancelar</button><button id="clear-log-btn" class="round" type="button" title="Limpar Log" style="margin-left: 15px;">Limpar Log</button>`); });
        jQuery(document).on('click', '#script-resume-btn', () => { setScriptState('running'); window.location.reload(); });
        jQuery(document).on('click', '#script-cancel-btn', () => { stopScript(); window.location.reload(); });

        jQuery(document).on('click', '#clear-log-btn', () => {
            if (confirm('Tem certeza que deseja apagar todo o log? Esta ação não pode ser desfeita.')) {
                localStorage.removeItem(LOG_STORAGE_KEY);
                jQuery("#autointeract-log-table tbody").empty();
                LOG_INDEX = 0;
            }
        });
    }

    const loadInteractionIds = () => { jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o)=>{ jQuery(o).html(`[${o.value}] ${jQuery(o).html()}`) }) };

    function initializeScript() {
        loggedInCharId = manageCharacterSession();
        CUSTOM_PROFILES_KEY = loggedInCharId ? `popmundo_profiles_${loggedInCharId}` : 'popmundo_profiles_fallback';

        jQuery('a[href*="/Logout.aspx"]').on('click', function() {
            sessionStorage.removeItem('popmundo_char_session_info');
        });

        const path = window.location.pathname;
        const extraData = decodeURIComponent(window.location.hash).replace("#", "");

        if (path.includes("/Character/Relations/")) {
            if (!loggedInCharId) {
                jQuery("#ppm-content").prepend('<div class="box" style="color: red; padding: 10px;"><b>Automator PopMundo:</b> Não foi possível identificar o personagem logado. O script não pode funcionar corretamente. Tente navegar para a página de Relações do seu personagem e recarregar.</div>');
            }
            injectIframe(); injectGUI(); loadLogFromStorage(); setupEventHandlers();
            const currentPage = Number(getCurrentPage()); const cityId = getCityId();
            if (localStorage.getItem("interactScriptPage") == currentPage) { stopScript(); localStorage.removeItem("interactScriptPage"); window.location.reload(); }

            if (isScriptRunning()) {
                if (!loggedInCharId) {
                    log("ERRO CRÍTICO: Personagem não identificado. Parando o script.");
                    stopScript();
                    alert("ERRO CRÍTICO: Não foi possível identificar o personagem logado. O script foi interrompido para evitar erros.");
                    window.location.reload();
                    return;
                }
                localStorage.setItem("interactScriptPage", currentPage);
                open(cityId, getInteractionUserLinks(), 0, () => {
                    if (isScriptRunning()) {
                        if (isLastPage()) { log("✨ Script finalizado com sucesso."); stopScript(); localStorage.removeItem("interactScriptPage"); alert("Script finalizado."); window.location.reload(); }
                        else { goToPage(currentPage + 1); }
                    }
                });
            }
        } else if (path.includes("/Character/") && !path.includes("/Character/Relations/") && isScriptRunning()) {
            const id = Number(path.split("/Character/")[1]);
            const [myCityId, charName] = extraData.split('|');
            const locId = getLocationId();
            if (isNaN(locId) || isNaN(id) || locId == 0 || getCityId() == 0) { sendClose(); return; }
            localStorage.setItem("interact-cid", id);
            localStorage.setItem("interact-cname", charName || `ID ${id}`);
            if (Number(myCityId) == getCityId()) { log(`📍 ${charName}: Na mesma cidade. Movendo para a localização...`); gotoLocation(locId, id); }
            else { log(`✈️ ${charName}: Em outra cidade. Tentando interagir diretamente...`); gotoInteraction(id); }
        } else if (path.includes("/Locale/") && isScriptRunning()) {
            const id = localStorage.getItem("interact-cid");
            const name = localStorage.getItem("interact-cname") || `ID ${id}`;
            if (id) { log(`📞 ${name}: Não foi possível entrar no local, tentando ligar...`); gotoPhone(id); }
        } else if (path.includes("/Interact/Details/")) {
            loadInteractionIds();
        } else if (path.includes("/Interact/")) {
            if (isScriptRunning()) {
                const isPhone = path.includes("/Interact/Phone/");
                const id = Number(path.split(isPhone ? "/Interact/Phone/" : "/Interact/")[1]);
                const name = localStorage.getItem("interact-cname") || `ID ${id}`;
                const itr = getNextInteraction(id);
                if (itr === -1) { log(`🤷 ${name}: Nenhuma interação válida ou foi pulado (skip).`); setTimeout(() => { sendClose() }, DELAY); return; }
                log(`<b>${isPhone ? "📞 Ligando para" : "🧑‍🤝‍🧑 Interagindo com"} ${name}</b> (Ação: [${itr}] ${allPossibleInteractions[itr]})`);
                interact(itr);
            } else if (isScriptPaused()) {
                const id = Number(path.split(path.includes("/Interact/Phone/") ? "/Interact/Phone/" : "/Interact/")[1]);
                const name = localStorage.getItem("interact-cname") || `ID ${id}`;
                log(`⏸️ Interação com ${name} ignorada, script pausado.`);
                setTimeout(() => { sendClose() }, DELAY);
            } else { loadInteractionIds(); }
        } else if (getScriptState()) {
            log(`❓ Caminho desconhecido: ${window.location.pathname}`);
            if (window.parent !== window) { sendClose(); }
        }
    }

    jQuery(document).ready(function() {
        const timeout = 10000;
        let intervalId;
        let timeoutId;

        intervalId = setInterval(function() {
            const element = jQuery(CHAR_DROPDOWN_SELECTOR);
            if (element.length > 0 && element.val() !== null) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                initializeScript();
            }
        }, 100);

        timeoutId = setTimeout(function() {
            clearInterval(intervalId);
            // Só exibe o erro se o script não for executado em uma página onde deveria.
            if (!loggedInCharId && (window.location.pathname.includes("/Character/") || window.location.pathname.includes("/World/Popmundo.aspx/News/"))) {
                 console.error(`Automator Popmundo: O elemento '${CHAR_DROPDOWN_SELECTOR}' não foi encontrado após ${timeout/1000} segundos. O script não será executado nesta página.`);
                 if (window.location.pathname.includes("/Character/Relations/")) {
                     jQuery("#ppm-content").prepend('<div class="box" style="color: red; padding: 10px;"><b>Automator PopMundo:</b> ERRO DE TIMING. A página não carregou os elementos necessários a tempo. Por favor, recarregue.</div>');
                 }
            }
        }, timeout);
    });

})();
