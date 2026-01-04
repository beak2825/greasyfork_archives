// ==UserScript==
// @name         Editora Versa - Modulos - Navegador de Questões
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Navegação inteligente que direciona para o gabarito ou para a página de resposta, conforme o status da questão. Melhora a visualização mobile da lista de questões.
// @author       Your Name
// @match        https://editoraversa.com.br/sistema/materiais/questoes/*
// @match        https://editoraversa.com.br/sistema/materiais/responder_questao/*
// @match        https://editoraversa.com.br/sistema/materiais/mostrar_gabarito/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=editoraversa.com.br
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @connect      editoraversa.com.br
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539794/Editora%20Versa%20-%20Modulos%20-%20Navegador%20de%20Quest%C3%B5es.user.js
// @updateURL https://update.greasyfork.org/scripts/539794/Editora%20Versa%20-%20Modulos%20-%20Navegador%20de%20Quest%C3%B5es.meta.js
// ==/UserScript==

/* global $, feather, tinymce, gerarEditorTinyMCE */

(function() {
    'use strict';

    // --- Configuration ---
    const MODULE_QUESTIONS_KEY_PREFIX = 'versa_module_questions_v3.4_';
    const PENDING_UPDATE_KEY_PREFIX = 'versa_pending_question_update_v3.4_';
    let valueChangeListeners = [];

    // --- Style Injection ---
    GM_addStyle(`
        /* Estilos de navegação e botões */
        .versa-nav-container { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .versa-nav-group { display: flex; align-items: center; gap: 0.5rem; }
        .versa-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s ease-in-out; cursor: pointer; text-decoration: none !important; white-space: nowrap; }
        .versa-btn-primary { background-color: #2DA9A4; color: white; border: 1px solid #2DA9A4; }
        .versa-btn-primary:hover { background-color: #269a94; color: white; }
        .versa-btn-secondary { background-color: transparent; color: #555; border: 1px solid #ccc; }
        .versa-btn-secondary:hover { background-color: #f0f0f0; border-color: #bbb; }

        /* Estilos responsivos */
        @media (max-width: 767px) {
            .versa-btn-secondary .versa-btn-text { display: none; }
            .versa-btn-secondary { padding: 0.75rem; }
            .versa-btn-secondary > .feather { margin: 0 !important; }

            /* MELHORIA: Oculta colunas na lista de questões em telas pequenas */
            .table-report thead tr th:nth-child(1), /* Coluna Frente */
            .table-report tbody tr td:nth-child(1),
            .table-report thead tr th:nth-child(2), /* Coluna Módulo */
            .table-report tbody tr td:nth-child(2),
            .table-report thead tr th:nth-child(3), /* Coluna Sessão de Exercícios */
            .table-report tbody tr td:nth-child(3) {
                display: none;
            }
        }

        /* Estilos para Carregamento Discreto no Card */
        .expandir-div { position: relative !important; } /* Garante que o overlay fique contido */
        #versa-loading-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(2px);
            z-index: 999;
            display: none; /* Inicia oculto */
            justify-content: center;
            align-items: center;
            border-radius: 0.375rem;
        }
        .versa-spinner {
            border: 8px solid #f3f3f3; border-top: 8px solid #2DA9A4; border-radius: 50%;
            width: 60px; height: 60px;
            animation: versa-spin 1s linear infinite;
        }
        @keyframes versa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // --- Utility Functions ---
    let featherTimeout = null;
    function callFeatherReplace() {
        if (typeof feather !== 'undefined' && feather.replace) {
            clearTimeout(featherTimeout);
            featherTimeout = setTimeout(() => feather.replace(), 50);
        }
    }

    function getModuleInfo() {
        const breadcrumbLinks = $('#breadcrumb a');
        const urlPath = window.location.pathname.split('/').filter(p => p);
        let info = { collectionId: null, disciplineId: null, frente: null, moduleId: null, pageType: null };
        const materiaisIndex = urlPath.indexOf('materiais');
        if (materiaisIndex !== -1 && urlPath.length > materiaisIndex + 2) {
            info.pageType = urlPath[materiaisIndex + 1];
            info.collectionId = urlPath[materiaisIndex + 2];
            info.disciplineId = urlPath[materiaisIndex + 3];
        }
        const moduleLink = breadcrumbLinks.filter((i, el) => $(el).text().trim().startsWith("Módulo")).last();
        if (moduleLink.length > 0) {
            info.moduleId = moduleLink.text().trim().replace("Módulo ", "");
            const href = moduleLink.attr('href');
            if (href) {
                const urlParams = new URLSearchParams(href.split('?')[1] || '');
                if (urlParams.has('frente')) {
                    info.frente = urlParams.get('frente');
                } else {
                    const frenteMatch = href.match(/frente=([^/&]+)/);
                    if (frenteMatch) info.frente = decodeURIComponent(frenteMatch[1].replace(/\+/g, ' '));
                }
            }
        }
        if (!info.moduleId) { const moduloParam = new URLSearchParams(window.location.search).get('modulo'); if (moduloParam) info.moduleId = moduloParam; }
        if (!info.frente) { const frenteParam = new URLSearchParams(window.location.search).get('frente'); if (frenteParam) info.frente = frenteParam; }
        if (!info.collectionId || !info.disciplineId || !info.moduleId || !info.frente) { console.warn("Versa Script: Could not determine all required IDs.", info); return null; }
        return info;
    }

    function getCurrentQuestionNumberFromBreadcrumb() {
        const breadcrumbText = $('#breadcrumb').text();
        const match = breadcrumbText.match(/Questão Nº (\d+)/);
        if (match) return match[1];
        // Fallback for dynamic navigation
        const currentUrl = window.location.pathname;
        const urlParts = currentUrl.split('/');
        const questionId = urlParts[urlParts.length - 1];
        const moduleInfo = getModuleInfo();
        if (!moduleInfo) return null;
        const questionsData = GM_getValue(MODULE_QUESTIONS_KEY_PREFIX + moduleInfo.moduleId, []);
        const question = questionsData.find(q => (q.responderUrl && q.responderUrl.endsWith(questionId)) || (q.gabaritoUrl && q.gabaritoUrl.endsWith(questionId)));
        return question ? question.number : null;
    }

    // --- MELHORIA: Lógica de Navegação Inteligente ---
    /**
     * Retorna a URL correta (gabarito ou resposta) com base no status da questão.
     * @param {object} questionObject O objeto da questão contendo status, gabaritoUrl e responderUrl.
     * @returns {string} A URL de navegação apropriada.
     */
    function getSmartNavUrl(questionObject) {
        if (!questionObject) return '#';
        const hasGabarito = ['Acertou', 'Errou', 'Respondido'].includes(questionObject.status);

        if (hasGabarito && questionObject.gabaritoUrl) {
            return questionObject.gabaritoUrl;
        }
        // O fallback padrão é sempre a página de resposta.
        return questionObject.responderUrl || '#';
    }


    function scrapeQuestionDataFromHtml(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const questionRows = doc.querySelectorAll('table.table-report tbody tr.intro-x');
        let scrapedData = [];
        questionRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 7) return;
            const number = cells[3].innerText.trim();
            const statusText = cells[4].innerText.trim();
            let status = 'Não respondida';
            if (statusText.includes('Acertou')) status = 'Acertou';
            else if (statusText.includes('Errou')) status = 'Errou';
            else if (statusText.includes('Discursiva')) status = 'Respondido';
            else if (statusText === '-') status = 'Não respondida';
            const actionLinkElement = cells[6].querySelector('a');
            const actionLink = actionLinkElement ? actionLinkElement.href : '';
            let responderUrl = '', gabaritoUrl = '';
            if (actionLink.includes('responder_questao')) {
                responderUrl = actionLink;
                gabaritoUrl = actionLink.replace('responder_questao', 'mostrar_gabarito');
            } else if (actionLink.includes('mostrar_gabarito')) {
                gabaritoUrl = actionLink;
                responderUrl = actionLink.replace('mostrar_gabarito', 'responder_questao');
            }
            scrapedData.push({ number, status, responderUrl, gabaritoUrl });
        });
        return scrapedData.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    }

    async function fetchAndUpdateModuleData(moduleInfo) {
        const { collectionId, disciplineId, frente, moduleId } = moduleInfo;
        const listPageUrl = `https://editoraversa.com.br/sistema/materiais/questoes/${collectionId}/${disciplineId}/frente=${encodeURIComponent(frente)}/modulo=${moduleId}`;
        const questionsStorageKey = MODULE_QUESTIONS_KEY_PREFIX + moduleId;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: listPageUrl,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const newQuestionsData = scrapeQuestionDataFromHtml(response.responseText);
                        GM_setValue(questionsStorageKey, newQuestionsData);
                        resolve(newQuestionsData);
                    } else { resolve(GM_getValue(questionsStorageKey, [])); }
                },
                onerror: function() { resolve(GM_getValue(questionsStorageKey, [])); }
            });
        });
    }

    function updateAccordion(moduleInfo, questionsData) {
        if (!questionsData || questionsData.length === 0) return;
        const currentQuestionNumber = getCurrentQuestionNumberFromBreadcrumb();
        const { moduleId } = moduleInfo;
        const accordionItemsHtml = questionsData.map(q => {
            // CORREÇÃO: Usa a lógica inteligente para definir o link do acordeão
            const linkHref = getSmartNavUrl(q);
            const isCurrent = q.number === currentQuestionNumber;
            const statusClass = q.status === 'Acertou' ? 'bg-theme-3 text-white' : q.status === 'Errou' ? 'bg-theme-36 text-white' : q.status === 'Respondido' ? 'bg-theme-1 text-white' : 'bg-gray-200 text-gray-600';
            const activeClass = isCurrent ? 'font-bold text-theme-9' : '';
            return `<li class="accordion__pane mb-1 text-gray-900"><a href="${linkHref}" data-question-number="${q.number}" class="block flex items-center versa-nav-link ${activeClass}" style="padding-left: 0.5rem; ${isCurrent ? 'color: #4299e1 !important;' : 'color: #1a202c !important;'}">Questão ${q.number}<span class="ml-2 text-xs px-1 rounded ${statusClass}">${q.status}</span></a></li>`;
        }).join('');
        const accordionHtml = `<div class="bg-white p-5 rounded mb-5 versa-custom-accordion-box"><ul class="accordion w-full"><li class="accordion__pane active"><a class="text-base font-medium block accordion__pane__toggle" href="javascript:;">Questões do Módulo ${moduleId}</a><ul class="pt-3 mt-3 border-t border-gray-200 accordion__pane__content" style="display: block;">${accordionItemsHtml}</ul></li></ul></div>`;
        $('.versa-custom-accordion-box').remove();
        $('#pdf-sidebar').find('div.bg-white.p-5.rounded').first().before(accordionHtml);
    }

    function applyClickableRows(questionsData) {
        $('table.table-report tbody tr.intro-x').each(function() {
            const row = $(this);
            const number = row.find('td').eq(3).text().trim();
            const qData = questionsData.find(q => q.number === number);
            if (qData) {
                // CORREÇÃO: Usa a lógica inteligente para a linha da tabela
                const navUrl = getSmartNavUrl(qData);
                if (navUrl && navUrl !=='#') {
                    row.css('cursor', 'pointer').off('click.versaNav').on('click.versaNav', function(e) {
                        if ($(e.target).is('a, button') || $(e.target).closest('a, button').length) return;
                        window.location.href = navUrl;
                    });
                }
            }
        });
    }

    // --- LÓGICA DE NAVEGAÇÃO DINÂMICA ---
    function updatePageForNewContent(htmlText, newUrl) {
        const $newHtml = $($.parseHTML(htmlText));
        document.title = $newHtml.filter('title').text();
        $('#breadcrumb').html($newHtml.find('#breadcrumb').html());
        const $mainContent = $('.expandir-div').first();
        const $newMainContent = $newHtml.find('.expandir-div').first();
        if ($mainContent.length && $newMainContent.length) {
            $mainContent.html($newMainContent.html());
        } else {
            console.error("Versa Script: Falha ao encontrar contêineres. Recarregando.");
            window.location.href = newUrl;
            return;
        }

        const editorSelector = 'textarea.input, #resposta';
        if (typeof tinymce !== 'undefined') {
            tinymce.remove(editorSelector);
        }
        if (typeof gerarEditorTinyMCE === 'function' && $mainContent.find(editorSelector).length > 0) {
            gerarEditorTinyMCE(editorSelector);
        }

        initializeQuestionPage();
        callFeatherReplace();
        const moduleInfo = getModuleInfo();
        const questionsData = GM_getValue(MODULE_QUESTIONS_KEY_PREFIX + moduleInfo.moduleId, []);
        updateAccordion(moduleInfo, questionsData);
    }

    function loadAndDisplayQuestion(url) {
        if (!url || url ==='#') return;
        $('.expandir-div #versa-loading-overlay').css('display', 'flex');

        GM_xmlhttpRequest({
            method: 'GET', url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    updatePageForNewContent(response.responseText, url);
                    history.pushState({ path: url }, '', url);
                } else {
                    window.location.href = url;
                }
                $('.expandir-div #versa-loading-overlay').hide();
            },
            onerror: function() {
                alert('Erro ao carregar a questão. A página será recarregada.');
                window.location.href = url;
            }
        });
    }

    function handleNavClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const url = $(this).attr('href');
        if (url && url !== '#' && url !== 'javascript:;') {
            loadAndDisplayQuestion(url);
        }
    }

    // --- LÓGICA PRINCIPAL ---
    const moduleInfo = getModuleInfo();
    if (!moduleInfo) return;

    const { moduleId, pageType } = moduleInfo;
    const questionsStorageKey = MODULE_QUESTIONS_KEY_PREFIX + moduleId;
    const pendingUpdateKey = PENDING_UPDATE_KEY_PREFIX + moduleId;

    function initializeQuestionPage() {
        const $mainContentCard = $('.expandir-div').first();
        if ($mainContentCard.length && $mainContentCard.find('#versa-loading-overlay').length === 0) {
            $mainContentCard.append('<div id="versa-loading-overlay"><div class="versa-spinner"></div></div>');
        }

        if (getModuleInfo().pageType === 'mostrar_gabarito') {
            $('.intro-y.box.p-5 > div:empty').remove();
        }

        const questionsDataForNav = GM_getValue(questionsStorageKey, []);
        if (questionsDataForNav.length === 0) return;

        const currentQuestionNumber = getCurrentQuestionNumberFromBreadcrumb();
        const currentIndex = questionsDataForNav.findIndex(q => q.number === currentQuestionNumber);
        if (currentIndex === -1) return;

        let prevButtonHtml = '', nextButtonHtml = '';
        if (currentIndex > 0) {
            const prevQ = questionsDataForNav[currentIndex - 1];
            // CORREÇÃO: Usa a lógica inteligente para o botão "Anterior"
            const prevLink = getSmartNavUrl(prevQ);
            if (prevLink !== '#') prevButtonHtml = `<a href="${prevLink}" class="versa-btn versa-btn-secondary versa-nav-link"><i data-feather="arrow-left" class="w-4 h-4 mr-2"></i><span class="versa-btn-text">Anterior</span></a>`;
        }
        if (currentIndex < questionsDataForNav.length - 1) {
            const nextQ = questionsDataForNav[currentIndex + 1];
            // CORREÇÃO: Usa a lógica inteligente para o botão "Próxima"
            const nextLink = getSmartNavUrl(nextQ);
            if (nextLink !== '#') nextButtonHtml = `<a href="${nextLink}" class="versa-btn versa-btn-secondary versa-nav-link"><span class="versa-btn-text">Próxima</span><i data-feather="arrow-right" class="w-4 h-4 ml-2"></i></a>`;
        }

        const backLinkHref = `https://editoraversa.com.br/sistema/materiais/questoes/${moduleInfo.collectionId}/${moduleInfo.disciplineId}/frente=${encodeURIComponent(moduleInfo.frente)}/modulo=${moduleInfo.moduleId}`;
        const backButtonHtml = `<a href="${backLinkHref}" class="versa-btn versa-btn-secondary"><i data-feather="list" class="w-4 h-4 mr-2"></i><span class="versa-btn-text">Voltar para Questões</span></a>`;

        let actionButtonHtml = '';
        const currentPageType = getModuleInfo().pageType;
        const currentQuestionData = questionsDataForNav[currentIndex];
        if (currentPageType === 'responder_questao') {
            actionButtonHtml = `<button type="submit" class="versa-btn versa-btn-primary"><i data-feather="check-circle" class="w-4 h-4 mr-2"></i><span class="versa-btn-text">Responder</span></button>`;
        } else if (currentPageType === 'mostrar_gabarito' && currentQuestionData.responderUrl) {
            actionButtonHtml = `<a href="${currentQuestionData.responderUrl}" class="versa-btn versa-btn-primary versa-nav-link"><i data-feather="edit-3" class="w-4 h-4 mr-2"></i><span class="versa-btn-text">Responder Novamente</span></a>`;
        }

        const navHtml = `<div class="versa-nav-container"><div class="versa-nav-group">${backButtonHtml}</div><div class="versa-nav-group">${prevButtonHtml} ${nextButtonHtml} ${actionButtonHtml}</div></div>`;

        const $navContainer = $('.intro-y.lg\\:col-span-8.col-span-12.flex-wrap').first();
        if ($navContainer.length) {
            $navContainer.empty().removeClass('sm:flex-no-wrap').append(navHtml);
            $navContainer.find('button[type="submit"].versa-btn-primary').on('click.versaNav', () => GM_setValue(pendingUpdateKey, true));
        }

        callFeatherReplace();
    }

    (async () => {
        let questionsData = GM_getValue(questionsStorageKey, []);
        if (GM_getValue(pendingUpdateKey, false) || questionsData.length === 0) {
            GM_setValue(pendingUpdateKey, false);
            questionsData = await fetchAndUpdateModuleData(moduleInfo);
        } else {
             fetchAndUpdateModuleData(moduleInfo); // Update in background
        }
        updateAccordion(moduleInfo, questionsData);

        if (['responder_questao', 'mostrar_gabarito'].includes(pageType)) {
            initializeQuestionPage();
            window.addEventListener('popstate', () => loadAndDisplayQuestion(location.href));
        }

        if (pageType === 'questoes') {
            applyClickableRows(questionsData);
        }
    })();

    $('body').on('click', '.versa-nav-link', handleNavClick);

    const listenerId = GM_addValueChangeListener(questionsStorageKey, (name, old_value, new_value) => {
        const currentModuleInfo = getModuleInfo();
        if (currentModuleInfo) {
            updateAccordion(currentModuleInfo, new_value);
            if (currentModuleInfo.pageType === 'questoes') applyClickableRows(new_value);
        }
    });
    valueChangeListeners.push(listenerId);

    window.addEventListener('unload', () => {
        valueChangeListeners.forEach(id => GM_removeValueChangeListener(id));
        $('body').off('click', '.versa-nav-link', handleNavClick);
    });

})();