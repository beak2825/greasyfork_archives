// ==UserScript==
// @name         Editora Versa - Dashboard - Calendário com Estuda.com
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Busca eventos do Estuda.com, clona o calendário do Versa, exibe os dados do Estuda no novo calendário e utiliza cache. Feedback apenas no console.
// @author       Seu Nome ou Apelido
// @match        https://editoraversa.com.br/sistema/
// @match        https://editoraversa.com.br/sistema/index.php*
// @match        https://editoraversa.com.br/sistema/login/validar*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=editoraversa.com.br
// @connect      estuda.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/locale/pt-br.js
// @downloadURL https://update.greasyfork.org/scripts/539865/Editora%20Versa%20-%20Dashboard%20-%20Calend%C3%A1rio%20com%20Estudacom.user.js
// @updateURL https://update.greasyfork.org/scripts/539865/Editora%20Versa%20-%20Dashboard%20-%20Calend%C3%A1rio%20com%20Estudacom.meta.js
// ==/UserScript==

/* global jQuery, $, moment, GM_setValue, GM_getValue, GM_addStyle, GM_xmlhttpRequest */

(function() {
    'use strict';

    console.log("Script Duplicar Calendário Versa/Estuda (Sem Alertas Visuais) v2.5.1 iniciado.");

    const estudaUrl = 'https://estuda.com/calendario-vestibulares/';
    const originalCalendarWrapperSelector = '.intro-y.box:has(#calendar)';
    const originalCalendarSelector = '#calendar';
    const newCalendarId = 'estuda-calendar';
    const estudaEventColor = '#3b82f6';

    // --- Constantes de Cache ---
    const CACHE_KEY_EVENTS = 'estudaCalendarEvents_v3'; // Versão do cache atualizada para forçar recarga
    const CACHE_KEY_TIMESTAMP = 'estudaCalendarTimestamp_v3';
    const CACHE_EXPIRATION_MS = 6 * 60 * 60 * 1000; // 6 horas em milissegundos

    GM_addStyle(`
        #${newCalendarId}-wrapper {
             margin-top: 2rem;
        }
        #${newCalendarId} .fc-list-item-title {
            white-space: normal !important;
        }
        /* Estilos para o Float Alert foram removidos. */
    `);

    // --- Função para Float Alert (DESATIVADA) ---
    function showFloatAlert(message, type = 'info', duration = 5000) {
        // Função desativada para remover os alertas visuais.
        // O feedback agora é exibido apenas no console através da função displayMessage.
    }

    // --- Função displayMessage MODIFICADA para usar console.log ---
    function displayMessage(type, message) {
        switch (type) {
            case 'success':
                console.log(`[SUCCESS] ${message}`);
                break;
            case 'error':
                console.error(`[ERROR] ${message}`);
                break;
            case 'loading':
            case 'info':
                console.info(`[INFO] ${message}`);
                break;
            default:
                 console.log(`[${type.toUpperCase()}] ${message}`);
                 break;
        }
    }


    // --- Funções de Cache (sem alteração) ---
    function saveEventsToCache(events) {
        try {
            GM_setValue(CACHE_KEY_EVENTS, JSON.stringify(events));
            GM_setValue(CACHE_KEY_TIMESTAMP, Date.now());
            console.log("Eventos salvos no cache.");
        } catch (e) {
            console.error("Erro ao salvar eventos no cache:", e);
        }
    }

    function loadEventsFromCache() {
        const eventsJson = GM_getValue(CACHE_KEY_EVENTS, null);
        const timestamp = GM_getValue(CACHE_KEY_TIMESTAMP, 0);

        if (!eventsJson || !timestamp) {
            console.log("Nenhum cache de eventos encontrado.");
            return null;
        }

        if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
            console.log("Cache de eventos expirado.");
            return null;
        }

        try {
            const events = JSON.parse(eventsJson);
            console.log(`Eventos carregados do cache (${events.length} eventos). Cache de ${new Date(timestamp).toLocaleString()}`);
            return events;
        } catch (e) {
            console.error("Erro ao parsear eventos do cache:", e);
            return null;
        }
    }

    // --- Funções de Parse e Extração (MODIFICADAS) ---

    // Mapa para converter nomes de meses em números
    const monthMap = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    };

    /**
     * Converte uma string de data do site Estuda.com para o formato YYYY-MM-DD.
     * @param {string} dateString - A string da data (ex: "06/01" ou "agosto/2025").
     * @param {number} calendarYear - O ano base do calendário, para datas sem ano explícito.
     * @returns {string|null} A data formatada ou null se a conversão falhar.
     */
    function parseEstudaDate(dateString, calendarYear) {
        dateString = dateString.trim();

        // Tenta encontrar o formato "dd/mm". Usa o ano do calendário como base.
        let match = dateString.match(/(\d{1,2})\/(\d{1,2})/);
        if (match) {
            const day = match[1].padStart(2, '0');
            const month = match[2].padStart(2, '0');
            const parsedDate = moment(`${calendarYear}-${month}-${day}`, 'YYYY-MM-DD', true);
            if (parsedDate.isValid()) {
                 return parsedDate.format('YYYY-MM-DD');
            }
        }

        // Tenta encontrar o formato "mes/ano" (ex: "agosto/2025"). Este formato contém o ano.
        match = dateString.match(/(\w+)\/(\d{4})/i);
        if (match) {
            const monthName = match[1].toLowerCase();
            const year = match[2];
            if (monthMap[monthName]) {
                const month = monthMap[monthName];
                // Como não há dia, define para o dia 1 para posicionamento no calendário.
                const day = '01';
                const parsedDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD', true);
                if (parsedDate.isValid()) {
                    return parsedDate.format('YYYY-MM-DD');
                }
            }
        }

        console.warn("Não foi possível parsear a data:", dateString, "- Ano base:", calendarYear);
        return null;
    }

    function cleanEventHTML(html) {
        if (!html) return '';
        let cleanText = html.replace(/<br\s*\/?>/gi, '||BR||');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanText;
        cleanText = tempDiv.textContent || tempDiv.innerText || '';
        cleanText = cleanText.replace(/\|\|BR\|\|/g, '<br>');
        cleanText = cleanText.replace(/\s{2,}/g, ' ').trim();
        return cleanText;
    }

    /**
     * Extrai os dados dos eventos do conteúdo HTML da página do Estuda.com.
     * @param {Element} contentDiv - O elemento que contém o conteúdo do post.
     * @param {number} calendarYear - O ano base para os eventos.
     * @returns {Array} Uma lista de objetos de evento para o FullCalendar.
     */
    function extractCalendarData(contentDiv, calendarYear) {
        const headings = contentDiv.querySelectorAll('h3.wp-block-heading');
        const events = [];
        const processedTables = new Set();
        const keywordToExclude = 'famema';

        // Processa tabelas que estão diretamente sob um H3 de mês
        headings.forEach(heading => {
            const monthSpan = heading.querySelector('span[id^="Calendario_dos_vestibulares"]');
            if (!monthSpan) return;
            let currentElement = heading.nextElementSibling;
            let tableFigure = null;
            while (currentElement && !tableFigure) {
                if (currentElement.matches('figure.wp-block-table')) {
                    tableFigure = currentElement;
                } else if (currentElement.matches('h2, h3, .elementor-widget-form, .elementor-widget-jet-listing-grid, #_form_11_')) {
                    break;
                }
                currentElement = currentElement.nextElementSibling;
            }
            if (tableFigure) {
                processedTables.add(tableFigure);
                const table = tableFigure.querySelector('table');
                if (table && table.tBodies.length > 0) {
                    const rows = table.tBodies[0].querySelectorAll('tr');
                    rows.forEach((row, index) => {
                        const cells = row.querySelectorAll('td');
                        if (index === 0 && (row.querySelector('th') || (cells.length > 0 && cells[0].querySelector('strong')))) return;
                        if (cells.length >= 2) {
                            const dateText = cells[0].textContent.trim();
                            const eventHTMLRaw = cells[1].innerHTML;
                            const eventTextClean = cleanEventHTML(eventHTMLRaw);
                            if (eventTextClean.toLowerCase().includes(keywordToExclude)) {
                                return;
                            }
                            const startDate = parseEstudaDate(dateText, calendarYear);
                            if (startDate && eventTextClean) {
                                events.push({ title: eventTextClean, start: startDate, allDay: true, color: estudaEventColor, source: 'estuda.com' });
                            } else if (dateText && eventTextClean) {
                                events.push({ title: `[${dateText}] ${eventTextClean}`, start: `${calendarYear}-01-01`, allDay: true, color: '#f59e0b', source: 'estuda.com-dataproblem' });
                            }
                        }
                    });
                }
            }
        });

        // Processa as tabelas de "prévia" que não foram processadas antes
        const previewTables = contentDiv.querySelectorAll('figure.wp-block-table');
        previewTables.forEach((figure) => {
            if (processedTables.has(figure)) return;
            // Verifica se é uma tabela de calendário válida que não foi processada
            const headerText = figure.querySelector('table tr:first-child')?.textContent.toLowerCase() || '';
            if (!headerText.includes('data') || !headerText.includes('evento')) {
                return; // Pula tabelas que não são de calendário
            }

            const table = figure.querySelector('table');
            if (table && table.tBodies.length > 0) {
                const rows = table.tBodies[0].querySelectorAll('tr');
                rows.forEach((row, index) => {
                    const cells = row.querySelectorAll('td');
                    if (index === 0 && (row.querySelector('th') || (cells.length > 0 && cells[0].querySelector('strong')))) return;
                    if (cells.length >= 2) {
                        const dateText = cells[0].textContent.trim();
                        let eventHTMLRaw = cells[1].innerHTML;
                        const institutionText = cells.length >= 3 ? (cells[2].textContent || '').trim() : '';
                        let eventTextClean = cleanEventHTML(eventHTMLRaw);
                        if (institutionText && institutionText !== 'Instituição') {
                            eventTextClean += ` (${institutionText})`;
                        }
                        if (eventTextClean.toLowerCase().includes(keywordToExclude)) {
                            return;
                        }
                        const startDate = parseEstudaDate(dateText, calendarYear);
                        if (startDate && eventTextClean) {
                            events.push({ title: eventTextClean, start: startDate, allDay: true, color: '#10b981', source: 'estuda.com-previa' });
                        } else if (dateText && eventTextClean) {
                            events.push({ title: `[Prévia: ${dateText}] ${eventTextClean}`, start: `${calendarYear}-01-01`, allDay: true, color: '#f59e0b', source: 'estuda.com-previa-dataproblem' });
                        }
                    }
                });
            }
        });
        return events;
    }

    function createDuplicateCalendar(estudaEvents) {
        const originalWrapper = $(originalCalendarWrapperSelector);
        if (!originalWrapper.length) {
            console.error("Container do calendário original não encontrado:", originalCalendarWrapperSelector);
            return false;
        }
        $(`#${newCalendarId}-wrapper`).remove();
        const clonedWrapper = originalWrapper.clone();
        const clonedCalendarDiv = clonedWrapper.find(originalCalendarSelector);
        if (!clonedCalendarDiv.length) {
             console.error("Div do calendário não encontrada dentro do wrapper clonado.");
             displayMessage('error', "Erro ao preparar o novo calendário (estrutura interna).");
             return false;
        }
        clonedCalendarDiv.attr('id', newCalendarId);
        clonedWrapper.attr('id', `${newCalendarId}-wrapper`);
        clonedCalendarDiv.html('');
        originalWrapper.before(clonedWrapper);
        console.log("Wrapper do calendário clonado e inserido.");
        try {
            console.log(`Inicializando FullCalendar em #${newCalendarId} com ${estudaEvents ? estudaEvents.length : 0} eventos.`);
            $(`#${newCalendarId}`).fullCalendar({
                locale: 'pt-br',
                header: { left: 'title', center: '', right: 'prev,next today month,listWeek' },
                events: estudaEvents || [],
                defaultView: 'month',
                eventRender: function(event, element) {
                    if (event.title.includes('<br>')) {
                         element.find('.fc-list-item-title').html(event.title);
                     }
                }
            });
            console.log("Novo calendário FullCalendar inicializado com sucesso.");
            return true;
        } catch (e) {
            console.error("Erro ao inicializar o novo FullCalendar:", e);
            displayMessage('error', "Ocorreu um erro ao inicializar o novo calendário.");
            clonedWrapper.remove();
            return false;
        }
    }

    function fetchAndCreateCalendar(cachedEvents, usedCacheForInitialRender) {
        console.log("Tentando buscar dados de:", estudaUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: estudaUrl,
            onload: function(response) {
                console.log("Dados recebidos do Estuda.com. Status:", response.status);

                if (response.status >= 200 && response.status < 300) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    // Seletor atualizado para a área de conteúdo principal
                    const contentDiv = doc.querySelector('.elementor-widget-theme-post-content');

                    if (!contentDiv) {
                        console.error("Container de conteúdo principal não encontrado no Estuda.com.");
                        displayMessage('error', "Erro ao analisar o conteúdo da página do Estuda.com. Estrutura pode ter mudado.");
                        return;
                    }

                    // Extrai o ano do título H1 para lidar com páginas de anos diferentes (ex: 2025, 2026)
                    let calendarYear = new Date().getFullYear(); // Padrão para o ano atual
                    const h1 = doc.querySelector('h1.elementor-heading-title');
                    if (h1) {
                        const yearMatch = h1.textContent.match(/\b(20\d{2})\b/);
                        if (yearMatch) {
                            calendarYear = parseInt(yearMatch[1], 10);
                        }
                    }
                    console.log(`Ano do calendário detectado: ${calendarYear}`);

                    // Passa o ano detectado para a função de extração
                    const freshEvents = extractCalendarData(contentDiv, calendarYear);
                    saveEventsToCache(freshEvents);

                    if (usedCacheForInitialRender && $(`#${newCalendarId}`).data('fullCalendar')) {
                        const freshEventsJson = JSON.stringify(freshEvents);
                        const cachedEventsJson = JSON.stringify(cachedEvents || []);

                        if (freshEventsJson !== cachedEventsJson) {
                            console.log("Dados do cache são diferentes dos dados frescos. Atualizando calendário.");
                            $(`#${newCalendarId}`).fullCalendar('removeEvents');
                            $(`#${newCalendarId}`).fullCalendar('addEventSource', freshEvents);
                            displayMessage('success', 'Calendário do Estuda.com atualizado com os dados mais recentes.');
                        } else {
                            console.log("Dados do cache já estão atualizados.");
                            displayMessage('info', 'Dados do cache do Estuda.com confirmados como os mais recentes.');
                        }
                    } else {
                        $(`#${newCalendarId}-wrapper`).remove(); // Remove qualquer tentativa anterior, se houver
                        if (createDuplicateCalendar(freshEvents)) {
                             if (freshEvents.length > 0) {
                                displayMessage('success', 'Calendário do Estuda.com carregado com sucesso.');
                             } else {
                                displayMessage('info', 'Calendário do Estuda.com carregado, mas nenhum evento encontrado para o ano atual.');
                             }
                        }
                    }

                    if (freshEvents.length === 0 && !usedCacheForInitialRender) {
                         console.warn("Nenhum evento de calendário encontrado ou extraído do Estuda.com na primeira carga.");
                    }

                } else {
                    console.error("Erro ao buscar a página do Estuda.com. Status:", response.status);
                    displayMessage('error', `Erro ao buscar dados do Estuda.com (Status: ${response.status}). ${usedCacheForInitialRender ? 'Mantendo dados do cache.' : ''}`);
                }
            },
            onerror: function(error) {
                console.error("Erro na requisição para Estuda.com:", error);
                displayMessage('error', `Erro de rede ao buscar dados. ${usedCacheForInitialRender ? 'Mantendo dados do cache.' : ''}`);
            }
        });
    }


    function waitForOriginalCalendarAndProceed() {
        const checkInterval = setInterval(function() {
            const originalCal = $(originalCalendarSelector);
            if (originalCal.length && (typeof originalCal.data('fullCalendar') !== 'undefined' || originalCal.hasClass('fc'))) {
                clearInterval(checkInterval);
                console.log("FullCalendar original encontrado/inicializado.");

                let cachedEvents = loadEventsFromCache();
                let usedCacheForInitialRender = false;

                if (cachedEvents && cachedEvents.length >= 0) {
                    console.log("Tentando usar dados do cache para renderização inicial.");
                    if (createDuplicateCalendar(cachedEvents)) {
                        displayMessage('info', 'Calendário carregado do cache. Verificando atualizações...');
                        usedCacheForInitialRender = true;
                    } else {
                        cachedEvents = null; // Falhou ao usar cache, força busca
                        displayMessage('loading', 'Falha ao usar cache. Carregando do Estuda.com...');
                    }
                } else {
                    displayMessage('loading', 'Carregando calendário do Estuda.com...');
                }
                fetchAndCreateCalendar(cachedEvents, usedCacheForInitialRender);
            } else {
                console.log("Aguardando FullCalendar ORIGINAL ser inicializado...");
            }
        }, 500);

        setTimeout(() => {
            if (checkInterval) { // Verifica se o intervalo ainda está ativo
                clearInterval(checkInterval);
                const originalCal = $(originalCalendarSelector);
                if (!(originalCal.length && (typeof originalCal.data('fullCalendar') !== 'undefined' || originalCal.hasClass('fc')))) {
                    console.error("Timeout: FullCalendar ORIGINAL não foi encontrado ou inicializado a tempo.");
                    displayMessage('error', "Timeout: Calendário original do Versa não encontrado para duplicação.");
                }
            }
        }, 15000);
    }

    $(document).ready(function() {
        console.log("Documento pronto. Aguardando calendário original...");
        waitForOriginalCalendarAndProceed();
    });

})();