// ==UserScript==
// @name         Editora Versa - Modulos - Progresso dos livros & ENEM Countdown
// @namespace    http://tampermonkey.net/
// @version      1.0.4.2
// @description  Progresso médio com texto centralizado e branco, contador ENEM e reordena Artes. (Atualizado para novo layout de página de disciplinas)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=editoraversa.com.br
// @author       Your Name (atualizado por IA)
// @match        https://editoraversa.com.br/sistema/materiais/colecoes
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      editoraversa.com.br
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536955/Editora%20Versa%20-%20Modulos%20-%20Progresso%20dos%20livros%20%20ENEM%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/536955/Editora%20Versa%20-%20Modulos%20-%20Progresso%20dos%20livros%20%20ENEM%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT CONFIGURATION ---
    const METADATA_VERSION = GM_info.script.version;
    const SCRIPT_LOGIC_VERSION = "v1.0.1"; // Incremented due to parsing logic change
    const SCRIPT_PREFIX = `[EditoraVersa Script ${METADATA_VERSION}]`;

    const PROCESSED_ATTR = `data-vrs-processed-${SCRIPT_LOGIC_VERSION.replace(/\./g, '-')}`;
    const CACHE_KEY_PREFIX = `versaBookProgress_v4_`; // Cache key prefix seems fine
    const CACHE_EXPIRY_MS = 60 * 1000;

    const ARTES_BOOK_TITLE_SUBSTRING = "VERSA ENEM E VESTIBULARES - 6V - Artes";

    // --- ENEM COUNTDOWN CONFIGURATION ---
    const ENEM_DATE_CONFIG = new Date(2025, 10, 9, 13, 0, 0); // November 9th, 2025 (Month is 0-indexed)
    const COUNTDOWN_START_DATE_CONFIG = new Date(2025, 1, 1, 0, 0, 0); // February 1st, 2025

    // --- SELECTORS ---
    const BOOK_GRID_CONTAINER_SELECTOR = '.content > div.intro-y.grid[class*="grid-cols-"]';
    const BOOK_ITEM_WRAPPER_SELECTOR = 'div.intro-y'; // Wrapper for each book card on /colecoes
    const BOOK_LINK_SELECTOR_UNPROCESSED = `a.box.flex.flex-col.zoom-in:not([${PROCESSED_ATTR}])`; // Selector for the link to the book's discipline page
    const BOOK_TITLE_SELECTOR_IN_LINK = 'div.p-5.text-center > div.font-medium.text-base';


    // --- CSS STYLES ---
    GM_addStyle(`
        /* Estilos para os Livros */
        .book-average-progress-wrapper { width: auto; padding: 0.5rem 1.25rem 1.25rem 1.25rem; box-sizing: border-box; margin-top: 0.25rem; }
        .progress-display-container { width: 100%; }
        .progress-label-div { display: flex; margin-bottom: 0.125rem; }
        .progress-label-text { font-size: 0.75rem; color: #4B5563; margin-left: auto; }
        .progress-track { width: 100%; background-color: #E5E7EB; border-radius: 9999px; position: relative; height: 1.25rem; }
        .progress-fill {
            background-color: #2da9a4;
            color: #FFFFFF; /* Texto sempre branco */
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            transition: width 0.3s ease-out;
            overflow: hidden; /* Garante que o texto não transborde visualmente */
        }
        .no-data-indicator-below, .loading-indicator-below { width: auto; padding: 0.75rem 1.25rem; box-sizing: border-box; text-align: center; font-size: 0.75rem; color: #9CA3AF; min-height: calc(1.25rem + 0.125rem + 0.75rem); }

        /* Estilos para o Contador ENEM */
        #enem-countdown-container { margin-bottom: 1.5rem; background-color: #ffffff; border-radius: 0.375rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1); padding: 1.25rem; display: flex; align-items: flex-start; }
        .enem-countdown-icon-wrapper { width: 2.5rem; height: 2.5rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background-color: #E2E8F0; border-radius: 0.375rem; margin-right: 1rem; }
        .enem-countdown-icon-wrapper i { font-size: 1.25rem; color: #2da9a4; }
        .enem-countdown-icon-wrapper .fa-hourglass-half::before { content: "⏳"; font-size: 1.5rem; }
        .enem-countdown-content-wrapper { flex-grow: 1; }
        #enem-countdown-title { font-weight: 500; color: #374151; line-height: 1.3; }
        #enem-countdown-days { font-size: 0.875rem; color: #4b5563; margin-top: 0.125rem; }
        .enem-countdown-progress-section { margin-top: 0.5rem; }
        .enem-countdown-progress-info { display: flex; justify-content: space-between; font-size: 0.7rem; color: #6b7280; margin-bottom: 2px; }
        #enem-countdown-start-date-label { font-style: italic; }
        .enem-progress-track { height: 18px !important; background-color: #E5E7EB; border-radius: 9999px; width: 100%; }
        .enem-progress-fill {
            height: 100% !important;
            background-color: #2da9a4;
            border-radius: 9999px;
            transition: width 0.5s ease-out;
            width: 0%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF; /* Texto branco */
            font-size: 0.7rem; /* Ligeiramente menor para barra mais fina */
            font-weight: 500;
            overflow: hidden; /* Garante que o texto não transborde visualmente */
        }
    `);

    // --- UTILITY & CACHE FUNCTIONS ---
    function log(...args) { console.log(SCRIPT_PREFIX, ...args); }
    function errorLog(...args) { console.error(SCRIPT_PREFIX, ...args); }

    function getCacheKey(bookUrl) { return CACHE_KEY_PREFIX + bookUrl.split('/').pop(); }
    function loadFromCache(bookUrl) {
        try {
            const cachedItem = localStorage.getItem(getCacheKey(bookUrl));
            if (cachedItem) {
                const parsed = JSON.parse(cachedItem);
                if (parsed && typeof parsed.timestamp === 'number' && typeof parsed.percentage === 'number') {
                    return parsed;
                }
            }
        } catch (e) { errorLog("Error loading from cache:", bookUrl, e); }
        return null;
    }
    function saveToCache(bookUrl, data) {
        try {
            data.timestamp = Date.now();
            localStorage.setItem(getCacheKey(bookUrl), JSON.stringify(data));
        } catch (e) { errorLog("Error saving to cache:", bookUrl, e); }
    }

    async function fetchBookDataHttp(bookUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: bookUrl, timeout: 20000,
                onload: (r) => { if (r.status >= 200 && r.status < 300) resolve(r.responseText); else reject(new Error(`HTTP Error ${r.status}`)); },
                onerror: () => reject(new Error("Network error")), ontimeout: () => reject(new Error("Timeout"))
            });
        });
    }

    // --- PARSE FETCHED DATA (Updated for new HTML structure) ---
    async function parseFetchedData(htmlContent, bookUrlForLog = "unknown book") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        let completedSum = 0, totalSum = 0, disciplineBoxesFound = 0;

        // The new HTML structure for progress on discipline pages is:
        // <div class="intro-y">
        //   <div class="box flex flex-col zoom-in">
        //     ...
        //     <div class="px-5 pb-3">
        //       <div class="flex justify-between items-center mb-1">
        //         <span class="text-gray-600 text-xs">Progresso</span>
        //         <span class="text-gray-600 text-xs">(COMPLETED | TOTAL)</span> <--- This is what we need
        //       </div>
        //       ...
        //     </div>
        //     ...
        //   </div>
        // </div>
        // We will look for the specific div containing these two spans.
        const progressInfoContainers = doc.querySelectorAll('div.flex.justify-between.items-center.mb-1');

        progressInfoContainers.forEach(container => {
            const spans = container.querySelectorAll('span.text-gray-600.text-xs');
            if (spans.length === 2) {
                const labelText = spans[0].textContent.trim();
                const valueText = spans[1].textContent.trim();

                // Ensure we are looking at a "Progresso" entry within a discipline card structure
                if (labelText === 'Progresso') {
                    // Check if the container is within the expected parent structure
                    // (div.px-5.pb-3) which is inside a (div.box) which is inside (div.intro-y)
                    const parentPx5 = container.parentElement;
                    if (parentPx5 && parentPx5.classList.contains('px-5') && parentPx5.classList.contains('pb-3')) {
                        const parentBox = parentPx5.parentElement;
                        if (parentBox && parentBox.classList.contains('box')) {
                            const parentIntroY = parentBox.parentElement;
                            if (parentIntroY && parentIntroY.classList.contains('intro-y')) {
                                const match = valueText.match(/\((\d+)\s*\|\s*(\d+)\)/);
                                if (match) {
                                    completedSum += parseInt(match[1], 10);
                                    totalSum += parseInt(match[2], 10);
                                    disciplineBoxesFound++;
                                } else {
                                    // log(`Could not parse progress value: "${valueText}" from ${bookUrlForLog}`);
                                }
                            }
                        }
                    }
                }
            }
        });
        // log(`Parsed data for ${bookUrlForLog}: completedSum=${completedSum}, totalSum=${totalSum}, disciplineBoxesFound=${disciplineBoxesFound}`);
        return { completedSum, totalSum, disciplineBoxesFound };
    }

    // --- DOM MANIPULATION (Book Progress) ---
    function createOrUpdateDisplay(bookLinkElement, displayData) {
        const { type, percentage, completedSum, totalSum, message, source } = displayData;

        bookLinkElement.querySelector('.book-average-progress-wrapper')?.remove();
        bookLinkElement.querySelector('.loading-indicator-below, .no-data-indicator-below')?.remove();

        if (type === 'progress') {
            const progressWrapper = document.createElement('div');
            progressWrapper.className = 'book-average-progress-wrapper';
            const sourceText = source === 'cache' ? 'cache' : (source === 'network_update' ? 'rede (at.)' : 'rede');
            const displayPercentage = Math.max(0, Math.min(100, percentage));

            progressWrapper.innerHTML = `
                <div class="progress-display-container">
                    <div class="progress-label-div">
                        <div class="progress-label-text">Média (${completedSum} | ${totalSum})</div>
                    </div>
                    <div class="progress-track" title="Média: ${percentage.toFixed(1)}% (${sourceText})">
                        <div class="progress-fill" style="width: ${displayPercentage.toFixed(1)}%;">
                            ${(totalSum === 0) ? 'N/A' : `${displayPercentage.toFixed(1)}%`}
                        </div>
                    </div>
                </div>`;

            const fillElement = progressWrapper.querySelector('.progress-fill');
            if (totalSum === 0 && fillElement) {
                fillElement.style.backgroundColor = '#D1D5DB'; // Cinza para N/A
                fillElement.style.color = '#374151';    // Texto mais escuro para N/A
            }
            bookLinkElement.appendChild(progressWrapper);
        } else {
            const indicatorWrapper = document.createElement('div');
            indicatorWrapper.className = type === 'loading' ? 'loading-indicator-below' : 'no-data-indicator-below';
            indicatorWrapper.textContent = message || (type === 'loading' ? 'Carregando...' : (type === 'no-data' ? 'Sem disciplinas' : 'Erro'));
            bookLinkElement.appendChild(indicatorWrapper);
        }
    }

    // --- CORE LOGIC (Book Progress) ---
    async function processBookElement(bookLinkElement) {
        if (bookLinkElement.hasAttribute(PROCESSED_ATTR)) return;
        bookLinkElement.setAttribute(PROCESSED_ATTR, 'true');

        const disciplinesPageUrl = bookLinkElement.href;
        const bookIdForLog = disciplinesPageUrl?.split('/').pop() || 'unknown-book';
        let isDisplayingFromCache = false;

        const cachedData = loadFromCache(disciplinesPageUrl);
        if (cachedData) {
            createOrUpdateDisplay(bookLinkElement, { type: 'progress', ...cachedData, source: 'cache' });
            isDisplayingFromCache = true;
            if ((Date.now() - cachedData.timestamp) < CACHE_EXPIRY_MS) return;
        } else {
            createOrUpdateDisplay(bookLinkElement, { type: 'loading', message: 'Carregando...' });
        }

        try {
            const html = await fetchBookDataHttp(disciplinesPageUrl);
            const { completedSum, totalSum, disciplineBoxesFound } = await parseFetchedData(html, bookIdForLog);
            if (disciplineBoxesFound > 0) {
                const percentageNum = totalSum > 0 ? (completedSum / totalSum) * 100 : 0;
                const newData = { percentage: percentageNum, completedSum, totalSum, disciplineBoxesFound };
                createOrUpdateDisplay(bookLinkElement, { type: 'progress', ...newData, source: isDisplayingFromCache ? 'network_update' : 'network_initial' });
                saveToCache(disciplinesPageUrl, newData);
            } else {
                createOrUpdateDisplay(bookLinkElement, { type: 'no-data', message: 'Sem disciplinas' });
                localStorage.removeItem(getCacheKey(disciplinesPageUrl)); // Clear cache if no data found
            }
        } catch (error) {
            errorLog(`Error processing ${bookIdForLog}: ${error.message}`, error);
            if (!isDisplayingFromCache) {
                let errorMsg = `Erro: ${error.message.substring(0, 30)}`;
                if (error.message.includes("HTTP Error")) errorMsg = `Falha Servidor (${error.message.split(" ")[2]})`;
                else if (error.message.includes("Timeout")) errorMsg = "Timeout";
                createOrUpdateDisplay(bookLinkElement, { type: 'error', message: errorMsg });
            } else { // If displayed from cache, just mark title with error
                const trackElement = bookLinkElement.querySelector('.progress-track');
                if (trackElement?.title) trackElement.title += ' (falha ao att.)';
            }
        }
    }

    // --- ENEM COUNTDOWN FUNCTIONS ---
    let enemCountdownInterval = null;
    function updateEnemCountdownDisplay() {
        const now = new Date();
        const timeRemainingMs = ENEM_DATE_CONFIG.getTime() - now.getTime();

        const daysEl = document.getElementById('enem-countdown-days');
        const fillEl = document.getElementById('enem-countdown-progress-fill');
        const percentageLabelOutsideEl = document.getElementById('enem-countdown-percentage-label');

        if (!daysEl || !fillEl) {
            if (enemCountdownInterval) clearInterval(enemCountdownInterval);
            return;
        }

        if (timeRemainingMs <= 0) {
            daysEl.textContent = "Prova do ENEM 2025 encerrada ou em andamento!";
            daysEl.style.fontWeight = "bold"; daysEl.style.color = "#c53030";
            fillEl.style.width = '100%';
            fillEl.textContent = '100%';
            if(percentageLabelOutsideEl) percentageLabelOutsideEl.textContent = '100%';
            if (enemCountdownInterval) clearInterval(enemCountdownInterval);
            return;
        }

        const days = Math.floor(timeRemainingMs / (1000 * 60 * 60 * 24));
        daysEl.textContent = `${days} dia${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`;
        daysEl.style.fontWeight = "normal"; daysEl.style.color = "#4b5563";

        const totalDurationMs = ENEM_DATE_CONFIG.getTime() - COUNTDOWN_START_DATE_CONFIG.getTime();
        const elapsedDurationMs = now.getTime() - COUNTDOWN_START_DATE_CONFIG.getTime();
        let progressPercentage = totalDurationMs > 0 ? (elapsedDurationMs / totalDurationMs) * 100 : 0;
        progressPercentage = Math.max(0, Math.min(100, progressPercentage));

        fillEl.style.width = `${progressPercentage.toFixed(2)}%`;
        fillEl.textContent = `${progressPercentage.toFixed(1)}%`;
        if(percentageLabelOutsideEl) percentageLabelOutsideEl.textContent = `${progressPercentage.toFixed(1)}%`;
    }

    function setupEnemCountdown() {
        if (document.getElementById('enem-countdown-container')) return;
        log("Setting up ENEM Countdown element.");

        const countdownElement = document.createElement('div');
        countdownElement.id = 'enem-countdown-container';
        countdownElement.innerHTML = `
            <div class="enem-countdown-icon-wrapper"><i class="fas fa-hourglass-half"></i></div>
            <div class="enem-countdown-content-wrapper">
                <div class="font-medium" id="enem-countdown-title">Contagem Regressiva ENEM 2025 (${ENEM_DATE_CONFIG.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })})</div>
                <div id="enem-countdown-days">Calculando...</div>
                <div class="enem-countdown-progress-section">
                    <div class="enem-countdown-progress-info">
                        <span id="enem-countdown-start-date-label">Progresso desde ${COUNTDOWN_START_DATE_CONFIG.toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'})}</span>
                        <span id="enem-countdown-percentage-label">0%</span>
                    </div>
                    <div class="enem-progress-track"><div id="enem-countdown-progress-fill" class="enem-progress-fill"></div></div>
                </div>
            </div>`;

        const bookGridContainer = document.querySelector(BOOK_GRID_CONTAINER_SELECTOR);
        if (bookGridContainer) {
            bookGridContainer.parentNode.insertBefore(countdownElement, bookGridContainer);
            updateEnemCountdownDisplay();
            if (enemCountdownInterval) clearInterval(enemCountdownInterval);
            enemCountdownInterval = setInterval(updateEnemCountdownDisplay, 60000);
        } else { errorLog("ENEM Countdown: Book grid container not found for countdown placement."); }
    }

    // --- BOOK REORDERING ---
    function moveArtesBookToEnd() {
        const gridContainer = document.querySelector(BOOK_GRID_CONTAINER_SELECTOR);
        if (!gridContainer) { errorLog("Cannot move Artes book: Grid container not found."); return; }

        // Need to select book wrappers directly under the grid container
        const bookWrappers = Array.from(gridContainer.querySelectorAll(`:scope > ${BOOK_ITEM_WRAPPER_SELECTOR}`));
        let artesBookWrapper = null;

        for (const wrapper of bookWrappers) {
            // The link selector should not have the :not([PROCESSED_ATTR]) part here as we just need the link
            const bookLink = wrapper.querySelector(BOOK_LINK_SELECTOR_UNPROCESSED.split(':')[0]);
            if (bookLink) {
                const titleElement = bookLink.querySelector(BOOK_TITLE_SELECTOR_IN_LINK);
                if (titleElement && titleElement.textContent.trim() === ARTES_BOOK_TITLE_SUBSTRING) {
                    artesBookWrapper = wrapper;
                    break;
                }
            }
        }

        if (artesBookWrapper) {
            log(`Found "${ARTES_BOOK_TITLE_SUBSTRING}", moving to end.`);
            gridContainer.appendChild(artesBookWrapper);
        }
    }

    // --- INITIALIZATION AND OBSERVER ---
    let observer = null;
    let initializeAttempts = 0;
    const MAX_INITIALIZE_ATTEMPTS = 25;

    function processAvailableBooks() {
        const mainGrid = document.querySelector(BOOK_GRID_CONTAINER_SELECTOR);
        if (mainGrid) {
            const bookLinkElements = mainGrid.querySelectorAll(`${BOOK_ITEM_WRAPPER_SELECTOR} > ${BOOK_LINK_SELECTOR_UNPROCESSED}`);
            if (bookLinkElements.length > 0) {
                // log(`Found ${bookLinkElements.length} unprocessed book elements on main page.`);
                bookLinkElements.forEach(processBookElement); return true;
            }
        }
        return false;
    }

    function initializeScript() {
        initializeAttempts++;
        // log(`Initialize attempt: ${initializeAttempts}`);

        setupEnemCountdown(); // Setup countdown first

        let booksProcessedInitially = processAvailableBooks();
        if (booksProcessedInitially) {
            moveArtesBookToEnd(); // Reorder after initial processing
        }

        const mainGridArea = document.querySelector(BOOK_GRID_CONTAINER_SELECTOR);
        if (mainGridArea && !observer) {
            // log("Main book grid area found. Attaching MutationObserver.");
            observer = new MutationObserver((mutationsList) => {
                let newBooksFoundOnMutation = false;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // Check if it's an element node
                                let linksToProcess = [];
                                if (node.matches && node.matches(BOOK_ITEM_WRAPPER_SELECTOR)) {
                                    const bookLink = node.querySelector(BOOK_LINK_SELECTOR_UNPROCESSED);
                                    if (bookLink) linksToProcess.push(bookLink);
                                } else if (node.querySelectorAll) { // If a container with multiple items is added
                                    node.querySelectorAll(`${BOOK_ITEM_WRAPPER_SELECTOR} > ${BOOK_LINK_SELECTOR_UNPROCESSED}`).forEach(bookLink => {
                                        linksToProcess.push(bookLink);
                                    });
                                }

                                if (linksToProcess.length > 0) {
                                    // log(`Observer found ${linksToProcess.length} new book elements to process.`);
                                    linksToProcess.forEach(processBookElement);
                                    newBooksFoundOnMutation = true;
                                }
                            }
                        });
                    }
                }
                if (newBooksFoundOnMutation) {
                    moveArtesBookToEnd(); // Reorder if new books were added and processed
                }
            });
            observer.observe(mainGridArea, { childList: true, subtree: false }); // Observe direct children of grid
        }

        if (!mainGridArea && initializeAttempts < MAX_INITIALIZE_ATTEMPTS) {
            const retryDelay = 400 + (initializeAttempts * 100);
            // log(`Main grid not found, retrying initialization in ${retryDelay}ms (Attempt ${initializeAttempts}/${MAX_INITIALIZE_ATTEMPTS})`);
            setTimeout(initializeScript, retryDelay);
        } else if (initializeAttempts >= MAX_INITIALIZE_ATTEMPTS) {
            errorLog("Max initialize attempts reached. Main grid not found or observer could not be attached.");
        } else if (!booksProcessedInitially && mainGridArea) {
             // Grid found, but no books yet. Observer will handle them.
            // log("Grid found, but no books initially. Observer is active.");
        }
    }

    function run() {
        log(`Script loaded. GreasyFork Version: ${METADATA_VERSION}, Internal Logic: ${SCRIPT_LOGIC_VERSION}`);
        initializeScript();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

})();