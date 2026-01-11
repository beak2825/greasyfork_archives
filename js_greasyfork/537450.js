// ==UserScript==
// @name          Automator PopMundo V3.2 
// @namespace     https://popmundo.com/
// @version       3.2.0
// @description   Automatiza interações no Popmundo com UI Minimalista, perfis por personagem, correção de bugs e sistema de backup.
// @author        Ninja
// @match         https://*.popmundo.com/World/Popmundo.aspx/*
// @grant         none
// @require       https://cdn.jsdelivr.net/npm/js-cookie@3.0.0/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/537450/Automator%20PopMundo%20V32.user.js
// @updateURL https://update.greasyfork.org/scripts/537450/Automator%20PopMundo%20V32.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURAÇÕES ---
    const DELAY = 500; // Tempo entre ações (ms)
    const DOMAIN = "popmundo.com";
    const LOG_STORAGE_KEY = 'popmundo_automator_log';

    // --- LISTA DE INTERAÇÕES ---
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

    // --- VARIÁVEIS GLOBAIS ---
    let CURRENT_CHAR_ID = null;
    let STORAGE_KEY_PROFILES = null;

    // --- ESTILOS CSS ---
    const injectStyles = () => {
        if (jQuery('link[href*="font-awesome"]').length === 0) {
            jQuery('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">');
        }

        const css = `
            #automator-panel {
                background: #fff; border-left: 4px solid #333; border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;
                font-family: 'Segoe UI', Tahoma, sans-serif; color: #333;
                border: 1px solid #e0e0e0; border-left-width: 4px;
            }
            .auto-header {
                padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;
                background: #fcfcfc; border-bottom: 1px solid #eee;
            }
            .auto-header h3 { margin: 0; font-size: 14px; font-weight: 700; color: #444; }
            .auto-status { font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.5px; }
            .status-off { background: #eee; color: #777; }
            .status-on { background: #28a745; color: #fff; }

            .auto-body { padding: 15px; display: flex; gap: 20px; flex-wrap: wrap; }
            .auto-column { flex: 1; min-width: 300px; }
            .auto-actions { display: flex; gap: 8px; margin-bottom: 15px; }

            .auto-btn {
                border: 1px solid #ccc; background: #fff; padding: 6px 12px;
                border-radius: 4px; cursor: pointer; font-size: 12px; color: #333;
                transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
                font-weight: 500;
            }
            .auto-btn:hover { background: #f5f5f5; border-color: #bbb; }
            .btn-primary { background: #333; color: #fff; border-color: #333; }
            .btn-primary:hover { background: #000; border-color: #000; }
            .btn-danger { color: #d9534f; border-color: #d9534f; }
            .btn-danger:hover { background: #d9534f; color: #fff; }
            .btn-success { color: #28a745; border-color: #28a745; }
            .btn-success:hover { background: #28a745; color: #fff; }

            .auto-log {
                background: #222; color: #0f0; font-family: 'Consolas', monospace;
                font-size: 11px; padding: 10px; height: 140px; overflow-y: auto;
                border-radius: 4px; margin-top: 5px; line-height: 1.4;
            }
            .log-entry { border-bottom: 1px solid #333; padding: 1px 0; }
            .log-time { color: #666; margin-right: 8px; }

            /* Editor */
            #profile-manager { border-top: 1px solid #eee; margin-top: 15px; padding-top: 15px; }
            summary { cursor: pointer; outline: none; font-size: 13px; font-weight: 600; color: #555; }
            .editor-box { margin-top: 10px; padding: 15px; background: #fafafa; border: 1px solid #eee; border-radius: 4px; }
            .editor-row { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
            .editor-label { font-size: 11px; font-weight: bold; color: #777; width: 100%; margin-bottom: 3px; display:block;}

            .editor-list {
                height: 150px; overflow-y: auto; border: 1px solid #ddd;
                background: #fff; list-style: none; padding: 0; margin: 0; border-radius: 3px;
            }
            .editor-list li {
                padding: 6px 10px; border-bottom: 1px solid #f0f0f0; display: flex;
                justify-content: space-between; align-items: center; font-size: 12px;
            }
            .editor-list li:nth-child(even) { background: #fbfbfb; }
            .editor-list li:hover { background: #f0f8ff; }
            .rm-int { border:none; background:none; color:#999; cursor:pointer; font-weight:bold; padding:0 5px; }
            .rm-int:hover { color: red; }

            select.auto-select, input.auto-input {
                padding: 6px; border: 1px solid #ddd; border-radius: 4px; width: 100%; font-size: 12px; box-sizing: border-box;
            }

            /* Tabela Popmundo */
            select.interaction-type { border: 1px solid #ccc; padding: 2px; border-radius: 3px; font-size: 10px; max-width: 120px; }
        `;
        jQuery('head').append(`<style>${css}</style>`);
    };

    // --- LÓGICA DE DADOS ---
    const getProfiles = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PROFILES) || '{}'); }
        catch (e) { return {}; }
    };

    const saveProfiles = (profiles) => {
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    };

    // --- LÓGICA DE LOG ---
    const log = (msg) => {
        const time = new Date().toLocaleTimeString();
        if (window.parent === window) {
            const logBox = jQuery('#auto-log-box');
            if (logBox.length) {
                logBox.prepend(`<div class="log-entry"><span class="log-time">[${time}]</span> ${msg}</div>`);
            }
            let history = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
            history.unshift(`[${time}] ${msg}`);
            if(history.length > 50) history = history.slice(0, 50);
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(history));
        } else {
            window.parent.postMessage("automator-log#" + msg, "*");
        }
    };

    // --- LÓGICA CORE (Navegação via Iframe) ---
    let frameOpen = false;
    const openUrl = (url) => { frameOpen = true; jQuery('#interaction-iframe').attr('src', url); };
    const closeUrl = () => { frameOpen = false; jQuery('#interaction-iframe').attr('src', null); };
    const sendClose = () => { window.parent.postMessage("interaction-frame-close", "*") };

    const getScriptState = () => localStorage.getItem('interactScriptState');
    const setScriptState = (state) => localStorage.setItem('interactScriptState', state);
    const stopScript = () => localStorage.removeItem('interactScriptState');
    const isScriptRunning = () => getScriptState() === 'running';

    // Helpers
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
        const allProfiles = getProfiles();
        const preference = Cookies.get(`interact-${CURRENT_CHAR_ID}-${userId}`, { domain: DOMAIN });
        if (preference && preference !== "skip" && allProfiles[preference]) {
            const available = getAvaiableInteractions();
            for (let intr of allProfiles[preference]) {
                if (available.includes(String(intr))) return intr;
            }
        }
        return -1;
    };

    const getInteractionUserLinks = () => {
        const l = [];
        jQuery(".data").not("#autointeract-log-table").find("a[href*='/Interact/Details/']").each((i, a) => {
            const url = a.href.replace("/Interact/Details/", "/Character/");
            const name = jQuery(a).closest('tr').find("a[href*='/Character/']").text().trim();
            l.push({ url: url, name: name });
        });
        return l;
    };

    const open = (cityId, links, current, finished) => {
        if (links.length == current || !isScriptRunning()) {
            finished(); return;
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
            if (data.includes("automator-log#")) log(data.split("automator-log#")[1]);
        }, false);
    };

    // --- GUI INJECTION ---
    const injectGUI = () => {
        const isRunning = getScriptState() === 'running';
        const profiles = getProfiles();
        const storedLog = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');

        // Opções de perfil
        let profileOpts = '<option value="">-- Selecione um perfil --</option>';
        for(let p in profiles) profileOpts += `<option value="${p}">${p}</option>`;

        // Opções de interação (ordenadas alfabeticamente)
        let allInteractionOpts = '';
        Object.entries(allPossibleInteractions).sort((a,b)=>a[1].localeCompare(b[1])).forEach(([id, name]) => {
            allInteractionOpts += `<option value="${id}">[${id}] ${name}</option>`;
        });

        const logHtml = storedLog.map(l => `<div class="log-entry">${l}</div>`).join('');

        const html = `
        <div id="automator-panel">
            <div class="auto-header">
                <h3><i class="fa fa-robot"></i> Automator <span style="font-weight:400; font-size:12px; color:#777;">| ID: ${CURRENT_CHAR_ID}</span></h3>
                <span class="auto-status ${isRunning ? 'status-on' : 'status-off'}">${isRunning ? 'EXECUTANDO' : 'PARADO'}</span>
            </div>
            <div class="auto-body">
                <div class="auto-column">
                    <div class="auto-actions">
                        ${isRunning
                            ? `<button id="btn-stop" class="auto-btn btn-danger" type="button"><i class="fa fa-stop"></i> Parar</button>`
                            : `<button id="btn-start" class="auto-btn btn-primary" type="button"><i class="fa fa-play"></i> Iniciar</button>`
                        }
                        <button id="btn-clear-log" class="auto-btn" type="button"><i class="fa fa-trash"></i> Log</button>
                    </div>

                    <div style="background:#f9f9f9; padding:8px; border:1px solid #eee; border-radius:4px; margin-bottom:10px;">
                        <span class="editor-label">Aplicar Perfil em Massa:</span>
                        <div style="display:flex; gap:5px; margin-bottom:5px;">
                            <select id="bulk-profile" class="auto-select" style="flex:1">${profileOpts}</select>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button id="btn-bulk-city" class="auto-btn" type="button">Mesma Cidade</button>
                            <button id="btn-bulk-others" class="auto-btn" type="button">Outras Cidades</button>
                        </div>
                    </div>

                    <div id="profile-manager">
                        <details>
                            <summary><i class="fa fa-edit"></i> Gerenciar Perfis</summary>
                            <div class="editor-box">
                                <span class="editor-label">Backup / Restauração:</span>
                                <div class="editor-row" style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                                    <button id="btn-export-profiles" class="auto-btn" style="flex:1" type="button"><i class="fa fa-download"></i> Exportar</button>
                                    <button id="btn-import-profiles" class="auto-btn" style="flex:1" type="button"><i class="fa fa-upload"></i> Importar</button>
                                    <input type="file" id="import-file-input" style="display:none" accept=".json">
                                </div>

                                <span class="editor-label">Criar novo:</span>
                                <div class="editor-row">
                                    <input type="text" id="new-profile-name" class="auto-input" placeholder="Nome do perfil">
                                    <button id="btn-create-profile" class="auto-btn" type="button"><i class="fa fa-plus"></i></button>
                                </div>
                                <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
                                <span class="editor-label">Editar existente:</span>
                                <div class="editor-row">
                                    <select id="editor-profile-select" class="auto-select">${profileOpts}</select>
                                    <button id="btn-delete-profile" class="auto-btn btn-danger" type="button"><i class="fa fa-trash"></i></button>
                                </div>
                                <div class="editor-row">
                                    <select id="editor-interaction-select" class="auto-select">${allInteractionOpts}</select>
                                    <button id="btn-add-interaction" class="auto-btn" type="button">Adicionar</button>
                                </div>
                                <span class="editor-label" style="margin-top:5px;">Lista de Ações:</span>
                                <ul id="editor-list" class="editor-list"></ul>
                                <button id="btn-save-profile" class="auto-btn btn-primary" type="button" style="width:100%; margin-top:10px;">Salvar & Atualizar</button>
                            </div>
                        </details>
                    </div>
                </div>
                <div class="auto-column">
                    <span class="editor-label">Log de Atividades:</span>
                    <div id="auto-log-box" class="auto-log">${logHtml}</div>
                </div>
            </div>
        </div>
        `;

        jQuery("#ppm-content").prepend(html);

        // Inject dropdowns into Popmundo table
        jQuery(".data").not("#autointeract-log-table").find("thead tr").append("<th>Perfil</th>");
        jQuery(".data").not("#autointeract-log-table").find("tbody tr").each((_, elem) => {
            const link = jQuery(elem).find("a[href*='/Character/']");
            if (link.length > 0) {
                const id = Number(link.attr('href').split("/Character/")[1]);
                const selected = Cookies.get(`interact-${CURRENT_CHAR_ID}-${id}`, { domain: DOMAIN });

                let opts = '<option value="">--</option>';
                for (let p in profiles) opts += `<option value="${p}" ${selected == p ? "selected":""}>${p}</option>`;
                opts += `<option value="skip" ${selected == "skip" ? "selected":""}>Pular</option>`;

                jQuery(elem).append(`<td><select data-id="${id}" class="interaction-type">${opts}</select></td>`);
            } else { jQuery(elem).find("thead tr th:last-child").remove(); }
        });

        setupEvents();
    };

    const setupEvents = () => {
        // --- FUNÇÕES DE RENDERIZAÇÃO ---
        const renderEditorList = (profileName) => {
            const list = jQuery('#editor-list');
            list.empty();
            const profiles = getProfiles();

            if (profileName && profiles[profileName]) {
                if (profiles[profileName].length === 0) {
                    list.append('<li style="color:#999; justify-content:center;">(Vazio)</li>');
                } else {
                    profiles[profileName].forEach((id, idx) => {
                        const name = allPossibleInteractions[id] || "ID Desconhecido: " + id;
                        list.append(`<li><span>${name}</span> <button type="button" class="rm-int" data-idx="${idx}" data-profile="${profileName}">x</button></li>`);
                    });
                }
            } else {
                list.append('<li style="color:#999; justify-content:center;">Selecione um perfil</li>');
            }
        };

        // --- HANDLERS (Todos usam e.preventDefault() para não recarregar) ---

        // Start/Stop
        jQuery('#btn-start').click((e) => { e.preventDefault(); setScriptState('running'); window.location.reload(); });
        jQuery('#btn-stop').click((e) => { e.preventDefault(); stopScript(); window.location.reload(); });
        jQuery('#btn-clear-log').click((e) => { e.preventDefault(); localStorage.removeItem(LOG_STORAGE_KEY); jQuery('#auto-log-box').empty(); });

        // Save Cookie on Change
        jQuery(document).on("change", ".interaction-type", (e) => {
            const elem = jQuery(e.target);
            Cookies.set(`interact-${CURRENT_CHAR_ID}-${elem.data("id")}`, elem.val(), { domain: DOMAIN });
        });

        // Bulk Actions
        jQuery('#btn-bulk-city, #btn-bulk-others').click(function(e) {
            e.preventDefault();
            const profile = jQuery('#bulk-profile').val();
            if(!profile) return alert("Por favor, selecione um perfil para aplicar em massa.");

            const isSameCityBtn = this.id === 'btn-bulk-city';
            let count = 0;

            jQuery(".data tbody tr").each(function() {
                const isSameCity = jQuery(this).find('a strong').length > 0; // Popmundo bolds name if same city
                const shouldApply = isSameCityBtn ? isSameCity : !isSameCity;

                if (shouldApply) {
                    const sel = jQuery(this).find('select.interaction-type');
                    if(sel.length) { sel.val(profile).trigger('change'); count++; }
                }
            });
            alert(`Aplicado perfil "${profile}" para ${count} personagens.`);
        });

        // --- EXPORT / IMPORT LOGIC ---

        // Exportar
        jQuery('#btn-export-profiles').click(e => {
            e.preventDefault();
            const profiles = getProfiles();
            if(Object.keys(profiles).length === 0) return alert("Não há perfis para exportar.");

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `popmundo_profiles_${CURRENT_CHAR_ID}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });

        // Botão Importar (Dispara o input file)
        jQuery('#btn-import-profiles').click(e => {
            e.preventDefault();
            jQuery('#import-file-input').click();
        });

        // Input File Change (Lê o arquivo)
        jQuery('#import-file-input').change(function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (typeof imported !== 'object') throw new Error("Arquivo inválido ou corrompido.");

                    const current = getProfiles();
                    const merged = { ...current, ...imported }; // Merge: Importados sobrescrevem iguais

                    if(confirm(`Encontrados ${Object.keys(imported).length} perfis. Deseja importar e mesclar com os atuais?`)) {
                        saveProfiles(merged);
                        alert("Perfis importados com sucesso!");
                        window.location.reload();
                    }
                } catch(err) {
                    alert("Erro ao importar: " + err.message);
                }
            };
            reader.readAsText(file);
        });


        // --- EDITOR LOGIC ---

        // Criar Perfil
        jQuery('#btn-create-profile').click((e) => {
            e.preventDefault();
            const name = jQuery('#new-profile-name').val().trim();
            if(!name) return alert("Digite um nome para o perfil.");

            const profiles = getProfiles();
            if(profiles[name]) return alert("Perfil já existe!");

            profiles[name] = [];
            saveProfiles(profiles);
            alert(`Perfil "${name}" criado! A página irá recarregar para atualizar os menus.`);
            window.location.reload();
        });

        // Deletar Perfil
        jQuery('#btn-delete-profile').click((e) => {
            e.preventDefault();
            const name = jQuery('#editor-profile-select').val();
            if(!name) return alert("Selecione um perfil para excluir.");
            if(!confirm(`Tem certeza que deseja apagar o perfil "${name}"?`)) return;

            const profiles = getProfiles();
            delete profiles[name];
            saveProfiles(profiles);
            window.location.reload();
        });

        // Mudar Dropdown de Perfil
        jQuery('#editor-profile-select').change(function() {
            renderEditorList(this.value);
        });

        // Adicionar Interação
        jQuery('#btn-add-interaction').click((e) => {
            e.preventDefault();
            const profile = jQuery('#editor-profile-select').val();
            const intId = jQuery('#editor-interaction-select').val();

            if(!profile) return alert("Selecione um perfil na lista 'Editar existente' primeiro!");

            const profiles = getProfiles();
            if(!profiles[profile]) profiles[profile] = [];

            profiles[profile].push(Number(intId));
            saveProfiles(profiles);

            renderEditorList(profile);
        });

        // Remover Interação (Dinâmico)
        jQuery(document).on('click', '.rm-int', function(e) {
            e.preventDefault();
            const idx = jQuery(this).data('idx');
            const profile = jQuery(this).data('profile');

            const profiles = getProfiles();
            if(profiles[profile]) {
                profiles[profile].splice(idx, 1);
                saveProfiles(profiles);
                renderEditorList(profile);
            }
        });

        // Salvar Geral
        jQuery('#btn-save-profile').click((e) => { e.preventDefault(); window.location.reload(); });
    };

    // --- INICIALIZAÇÃO DO SCRIPT ---
    const init = () => {
        // 1. Detectar ID
        const relationsMatch = window.location.pathname.match(/\/Character\/Relations\/(\d+)/);
        if (relationsMatch) {
            CURRENT_CHAR_ID = relationsMatch[1];
        } else {
            const dropdown = jQuery("select[id$='ucCharacterBar_ddlCurrentCharacter']");
            const fromStorage = JSON.parse(sessionStorage.getItem('popmundo_char_session_info') || '{}');
            if(fromStorage.numericalId) CURRENT_CHAR_ID = fromStorage.numericalId;
        }

        if(!CURRENT_CHAR_ID) {
             const link = jQuery('a:has(img[alt="Meu Personagem"])').attr('href');
             if(link) CURRENT_CHAR_ID = link.split('/Character/')[1];
        }

        if (!CURRENT_CHAR_ID) {
            console.log("Automator: Aguardando identificação do personagem...");
            return;
        }

        // 2. Definir chave de storage única
        STORAGE_KEY_PROFILES = `popmundo_profiles_${CURRENT_CHAR_ID}`;
        injectStyles();

        const path = window.location.pathname;
        const extraData = decodeURIComponent(window.location.hash).replace("#", "");

        // 3. Roteamento
        if (path.includes("/Character/Relations/")) {
            injectIframe();
            injectGUI();

            if (isScriptRunning()) {
                const currentPage = Number(getCurrentPage());
                const cityId = getCityId();
                if (localStorage.getItem("interactScriptPage") == currentPage) {
                    stopScript(); localStorage.removeItem("interactScriptPage"); window.location.reload();
                }
                localStorage.setItem("interactScriptPage", currentPage);

                open(cityId, getInteractionUserLinks(), 0, () => {
                    if (isScriptRunning()) {
                        if (isLastPage()) {
                            log("Ciclo finalizado."); stopScript(); localStorage.removeItem("interactScriptPage"); alert("Automação concluída!"); window.location.reload();
                        } else { goToPage(currentPage + 1); }
                    }
                });
            }
        }
        else if (path.includes("/Character/") && isScriptRunning()) {
            const id = Number(path.split("/Character/")[1]);
            const [myCityId, charName] = extraData.split('|');
            const locId = getLocationId();
            if (isNaN(locId) || isNaN(id)) { sendClose(); return; }

            if (Number(myCityId) == getCityId()) {
                log(`Movendo: ${charName}`); gotoLocation(locId, id);
            } else {
                log(`Tentando remoto: ${charName}`); gotoInteraction(id);
            }
        }
        else if (path.includes("/Interact/") && isScriptRunning()) {
            const isPhone = path.includes("/Interact/Phone/");
            const id = Number(path.split(isPhone ? "/Interact/Phone/" : "/Interact/")[1]);
            const itr = getNextInteraction(id);

            if (itr === -1) {
                log(`ID ${id}: Sem ação ou Pular.`);
                setTimeout(sendClose, DELAY);
            } else {
                log(`Ação [${itr}]: ${allPossibleInteractions[itr]}`);
                interact(itr);
            }
        }
        else if (isScriptRunning() && (path.includes("/Locale/") || path.includes("/City/"))) {
             setTimeout(sendClose, DELAY);
        }
    };

    jQuery(document).ready(init);

})();