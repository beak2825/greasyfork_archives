// ==UserScript==
// @name         Plati.Market; Ultimate Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Расширенный поиск по Plati.Market + Просмотр и сбор полного каталога продавца с фильтрами и исключениями.
// @author       0wn3df1x
// @match        https://plati.market/*
// @match        https://plati.market/asp/block_goods_s2.asp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plati.market
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.1/nouislider.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.digiseller.com
// @connect      plati.market
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534572/PlatiMarket%3B%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/534572/PlatiMarket%3B%20Ultimate%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Общая Конфигурация ---
    const IMAGE_DOMAIN = 'digiseller.mycdn.ink';
    const NEW_ITEM_THRESHOLD_DAYS = 7;

    // --- Конфигурация MegaSearch (MS) ---
    const MS_API_BASE_URL = 'https://api.digiseller.com/api/products/search2';
    const MS_SUGGEST_API_URL = 'https://plati.market/api/suggest.ashx';
    const MS_RESULTS_PER_PAGE_CHECK = 1;
    const MS_DEFAULT_SORT_MODE = 2;
    const MS_SUGGEST_DEBOUNCE_MS = 300;
    const MS_FILTER_DEBOUNCE_MS = 500;
    const MS_FILTER_STORAGE_PREFIX = 'megaSearchFilter_v2_';
    const MS_FILTER_PANEL_WIDTH = 230;
    const MS_EXCLUSION_PANEL_WIDTH = 250;
    const MS_SIDE_PANEL_HORIZONTAL_PADDING = 20;
    const MS_CONTENT_PADDING_BUFFER = 15;
    const MS_CONTENT_PADDING_LEFT = MS_FILTER_PANEL_WIDTH + MS_SIDE_PANEL_HORIZONTAL_PADDING + MS_CONTENT_PADDING_BUFFER;
    const MS_CONTENT_PADDING_RIGHT = MS_EXCLUSION_PANEL_WIDTH + MS_SIDE_PANEL_HORIZONTAL_PADDING + MS_CONTENT_PADDING_BUFFER;
    const MS_HEADER_APPROX_HEIGHT = 65;
    const MS_TOP_OFFSET_FOR_SIDE_PANELS = MS_HEADER_APPROX_HEIGHT + 25;
    const MS_BOTTOM_OFFSET_FOR_SIDE_PANELS = 20;
    const MS_ADV_SORT_CONTAINER_WIDTH = 230;

    // --- Конфигурация MegaCatalog (MC) ---
    const MC_BASE_URL = 'https://plati.market/asp/block_goods_s2.asp';
    const MC_ROWS_PER_PAGE = 100;
    const MC_PROGRESS_BAR_COLOR = '#4D88FF';
    const MC_FILTER_STORAGE_PREFIX = 'megaCatalogFilter_';
    const MC_EXCLUSION_STORAGE_KEY = 'megaCatalogExclusions';
    const MC_FILTER_PANEL_WIDTH = 200;
    const MC_EXCLUSION_PANEL_WIDTH = 220;
    const MC_SIDE_PANEL_HORIZONTAL_PADDING = 15;
    const MC_CONTENT_PADDING_BUFFER = 10;
    const MC_CONTENT_PADDING_LEFT = MC_FILTER_PANEL_WIDTH + MC_SIDE_PANEL_HORIZONTAL_PADDING + MC_CONTENT_PADDING_BUFFER;
    const MC_CONTENT_PADDING_RIGHT = MC_EXCLUSION_PANEL_WIDTH + MC_SIDE_PANEL_HORIZONTAL_PADDING + MC_CONTENT_PADDING_BUFFER;
    const MC_TOP_OFFSET_FOR_SIDE_PANELS = 55;
    const MC_BOTTOM_OFFSET_FOR_SIDE_PANELS = 15;


    // --- Глобальные переменные (MegaSearch) ---
    let ms_currentResults = [];
    let ms_currentSort = GM_getValue('megaSearchLastSort', {
        field: 'relevance',
        direction: 'asc'
    });
    let ms_currentCurrency = GM_getValue('megaSearchCurrency', 'RUR');
    let ms_firstSortClick = {};
    ['price', 'sales', 'name', 'relevance', 'date_create', 'discount', 'seller_rating', 'review_ratio', 'good_reviews', 'bad_reviews', 'returns'].forEach(field => {
        ms_firstSortClick[field] = ms_currentSort.field !== field;
    });
    let ms_exclusionKeywords = GM_getValue('megaSearchExclusions', []);
    let ms_currentFilters = ms_loadFilters();
    let ms_suggestDebounceTimeout;
    let ms_filterDebounceTimeout;
    let ms_advSortMenuTimeout;

    // --- Глобальные переменные (MegaCatalog) ---
    let mc_initialCatalogData = [];
    let mc_fullCatalogData = [];
    let mc_isCatalogCollected = false;
    let mc_currentSort = {
        field: 'default',
        direction: 'asc'
    };
    let mc_sellerId = null;
    let mc_totalItems = 0;
    let mc_requestsPending = 0;
    let mc_currentFilters = mc_loadFilters();
    let mc_exclusionKeywords = GM_getValue(MC_EXCLUSION_STORAGE_KEY, []);
    let mc_filterDebounceTimeout;

    // --- DOM Элементы (MegaSearch) ---
    let ms_modal, ms_closeBtn, ms_searchInput, ms_searchBtn, ms_sortPriceBtn, ms_sortSalesBtn, ms_advSortBtnContainer, ms_advSortBtn, ms_advSortMenu, ms_currencySelect, ms_resetSortBtn;
    let ms_resultsContainer, ms_resultsDiv, ms_statusDiv, ms_excludeInput, ms_addExcludeBtn, ms_exclusionTagsDiv;
    let ms_suggestionsDiv;
    let ms_filtersPanel;
    let ms_filterPriceMin, ms_filterPriceMax, ms_filterSalesMin, ms_filterSalesMax, ms_filterRatingMin, ms_filterRatingMax;
    let ms_filterHideBadReviews, ms_filterHideReturns, ms_filterOnlyDiscount;
    let ms_filterDateSelect;
    let ms_resetAllFiltersBtn;
    let ms_exclusionTagsListDiv;

    // --- DOM Элементы (MegaCatalog) ---
    let mc_catalogContainer, mc_headerDiv, mc_collectBtn, mc_sortButtons = {},
        mc_statusDiv, mc_progressBar, mc_resultsDiv;
    let mc_filtersPanel, mc_filterPriceMin, mc_filterPriceMax, mc_filterSalesMin, mc_filterSalesMax, mc_resetAllFiltersBtn;
    let mc_exclusionPanel, mc_excludeInput, mc_addExcludeBtn, mc_exclusionTagsListDiv;


    // Описания сортировок (MegaSearch)
    const ms_advancedSorts = {
        'name': {
            name: 'По названию',
            defaultDir: 'asc',
            apiField: 'name'
        },
        'date_create': {
            name: 'По дате добавления',
            defaultDir: 'desc',
            apiField: 'date_create'
        },
        'discount': {
            name: 'По % в скид. системе',
            defaultDir: 'desc',
            apiField: 'discount'
        },
        'seller_rating': {
            name: 'По рейтингу продавца',
            defaultDir: 'desc',
            apiField: 'seller_rating'
        },
        'review_ratio': {
            name: 'По соотношению отзывов',
            defaultDir: 'desc',
            apiField: 'review_ratio'
        },
        'good_reviews': {
            name: 'По кол-ву хор. отзывов',
            defaultDir: 'desc',
            apiField: 'cnt_good_responses'
        },
        'bad_reviews': {
            name: 'По кол-ву плох. отзывов',
            defaultDir: 'asc',
            apiField: 'cnt_bad_responses'
        },
        'returns': {
            name: 'По кол-ву возвратов',
            defaultDir: 'asc',
            apiField: 'cnt_return'
        }
    };
    const ms_advSortOrder = ['name', 'date_create', 'discount', 'seller_rating', 'review_ratio', 'good_reviews', 'bad_reviews', 'returns'];
    const ms_dateFilterOptions = {
        'all': 'За все время',
        '1d': 'За сутки',
        '2d': 'За 2 дня',
        '1w': 'За неделю',
        '1m': 'За месяц',
        '6m': 'За полгода',
        '1y': 'За год',
        '5y': 'За 5 лет',
        '10y': 'За 10 лет',
    };

    // --- Стили ---
    addGlobalStyles();

    // --- Общие Вспомогательные функции ---
    function formatPrice(priceStr) {
        if (!priceStr) return 0;
        return parseFloat(String(priceStr).replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    }

    function formatSales(salesStr) {
        if (!salesStr) return 0;
        const cleanedStr = String(salesStr).replace(/\D/g, '');
        return parseInt(cleanedStr, 10) || 0;
    }

    function parseSellerRating(ratingStr) {
        if (!ratingStr) return 0;
        return parseFloat(String(ratingStr).replace(',', '.')) || 0;
    }

    function calculateReviewRatio(item) {
        const good = parseInt(item.cnt_good_responses || '0', 10);
        const bad = parseInt(item.cnt_bad_responses || '0', 10);
        const total = good + bad;
        return total > 0 ? (good / total) : -1;
    }

    function parseDate(dateStr) {
        if (!dateStr) return 0;
        const parts = dateStr.split(' ');
        if (parts.length !== 2) return 0;
        const dateParts = parts[0].split('.');
        const timeParts = parts[1].split(':');
        if (dateParts.length !== 3 || timeParts.length !== 3) return 0;
        return new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2])).getTime() || 0;
    }

    function formatDateString(timestamp) {
        if (!timestamp || timestamp === 0) return 'N/A';
        try {
            const date = new Date(timestamp);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = String(date.getUTCFullYear()).slice(-2);
            return `${day}.${month}.${year}`;
        } catch (e) {
            return 'N/A';
        }
    }

    function getPriceInSelectedCurrency(item, currency) {
        let price = 0;
        switch (currency) {
            case 'USD':
                price = formatPrice(item.price_usd);
                break;
            case 'EUR':
                price = formatPrice(item.price_eur);
                break;
            case 'UAH':
                price = formatPrice(item.price_uah);
                break;
            case 'RUR':
            default:
                price = formatPrice(item.price_rur);
                break;
        }
        if (price <= 0 && currency !== 'RUR') price = formatPrice(item.price_rur);
        if (price <= 0 && currency !== 'USD') price = formatPrice(item.price_usd) * 80;
        return price > 0 ? price : Infinity;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function getCurrentSellerIdFromUrl() {
        const match = window.location.pathname.match(/\/seller\/[^\/]+\/(\d+)/);
        return match ? match[1] : null;
    }

    function getCurrentCatalogSellerIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id_s');
    }

    function getCurrentCatalogLangFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang') || 'ru';
    }

    function getCurrentCatalogCurrFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('curr') || 'rur';
    }

    // ========================================
    // === MegaSearch: Функционал Модального Окна ===
    // ========================================

    // --- MegaSearch: Создание UI ---
    function createModal() {
        ms_modal = document.createElement('div');
        ms_modal.id = 'megaSearchModal';
        const container = document.createElement('div');
        container.id = 'megaSearchContainer';
        const header = document.createElement('div');
        header.id = 'megaSearchHeader';
        const searchInputContainer = document.createElement('div');
        searchInputContainer.className = 'megaSearchInputContainer';
        ms_searchInput = document.createElement('input');
        ms_searchInput.id = 'megaSearchInput';
        ms_searchInput.type = 'text';
        ms_searchInput.placeholder = 'Введите название игры...';
        ms_searchInput.autocomplete = 'off';
        ms_searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') ms_triggerSearch();
        };
        ms_searchInput.oninput = () => {
            clearTimeout(ms_suggestDebounceTimeout);
            ms_suggestDebounceTimeout = setTimeout(() => {
                ms_fetchSuggestions(ms_searchInput.value);
            }, MS_SUGGEST_DEBOUNCE_MS);
        };
        ms_searchInput.onblur = () => {
            setTimeout(() => {
                if (ms_suggestionsDiv) ms_suggestionsDiv.style.display = 'none';
            }, 150);
        };
        ms_suggestionsDiv = document.createElement('div');
        ms_suggestionsDiv.id = 'megaSearchSuggestions';
        searchInputContainer.appendChild(ms_searchInput);
        searchInputContainer.appendChild(ms_suggestionsDiv);
        header.appendChild(searchInputContainer);
        ms_searchBtn = document.createElement('button');
        ms_searchBtn.textContent = 'Найти';
        ms_searchBtn.id = 'megaSearchGoBtn';
        ms_searchBtn.className = 'megaSearchBtn';
        ms_searchBtn.onclick = ms_triggerSearch;
        header.appendChild(ms_searchBtn);
        ms_resetSortBtn = document.createElement('button');
        ms_resetSortBtn.id = 'resetSortBtn';
        ms_resetSortBtn.className = 'megaSearchBtn';
        ms_resetSortBtn.title = 'Сбросить сортировку';
        ms_resetSortBtn.innerHTML = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8Z"/></svg>`;
        ms_resetSortBtn.onclick = ms_resetSort;
        header.appendChild(ms_resetSortBtn);
        ms_sortPriceBtn = document.createElement('button');
        ms_sortPriceBtn.textContent = 'Цена ▼';
        ms_sortPriceBtn.className = 'megaSearchBtn sortBtn';
        ms_sortPriceBtn.dataset.sort = 'price';
        ms_sortPriceBtn.dataset.dir = 'desc';
        ms_sortPriceBtn.onclick = () => ms_handleSort('price');
        header.appendChild(ms_sortPriceBtn);
        ms_sortSalesBtn = document.createElement('button');
        ms_sortSalesBtn.textContent = 'Продажи ▼';
        ms_sortSalesBtn.className = 'megaSearchBtn sortBtn';
        ms_sortSalesBtn.dataset.sort = 'sales';
        ms_sortSalesBtn.dataset.dir = 'desc';
        ms_sortSalesBtn.onclick = () => ms_handleSort('sales');
        header.appendChild(ms_sortSalesBtn);
        ms_advSortBtnContainer = document.createElement('div');
        ms_advSortBtnContainer.id = 'megaSearchAdvSortBtnContainer';
        ms_advSortBtn = document.createElement('button');
        ms_advSortBtn.id = 'megaSearchAdvSortBtn';
        ms_advSortBtn.textContent = 'Доп. сорт.';
        ms_advSortBtn.className = 'megaSearchBtn sortBtn';
        ms_advSortBtnContainer.appendChild(ms_advSortBtn);
        ms_advSortMenu = document.createElement('div');
        ms_advSortMenu.id = 'megaSearchAdvSortMenu';
        ms_advSortOrder.forEach(key => {
            const sortInfo = ms_advancedSorts[key];
            const menuItem = document.createElement('div');
            menuItem.className = 'megaSearchSortMenuItem';
            menuItem.dataset.sort = key;
            menuItem.dataset.dir = 'desc';
            menuItem.innerHTML = `${sortInfo.name} <span class="sortArrow">▼</span>`;
            menuItem.onclick = () => ms_handleSort(key);
            ms_advSortMenu.appendChild(menuItem);
        });
        ms_advSortBtnContainer.appendChild(ms_advSortMenu);
        header.appendChild(ms_advSortBtnContainer);
        ms_currencySelect = document.createElement('select');
        ms_currencySelect.id = 'megaSearchCurrencySelect';
        ['RUR', 'USD', 'EUR', 'UAH'].forEach(curr => {
            const option = document.createElement('option');
            option.value = curr;
            option.textContent = curr;
            if (curr === ms_currentCurrency) option.selected = true;
            ms_currencySelect.appendChild(option);
        });
        ms_currencySelect.onchange = ms_handleCurrencyChange;
        header.appendChild(ms_currencySelect);
        container.appendChild(header);
        ms_resultsContainer = document.createElement('div');
        ms_resultsContainer.id = 'megaSearchResultsContainer';
        ms_resultsDiv = document.createElement('div');
        ms_resultsDiv.id = 'megaSearchResults';
        ms_statusDiv = document.createElement('div');
        ms_statusDiv.id = 'megaSearchResultsStatus';
        ms_resultsContainer.appendChild(ms_statusDiv);
        ms_resultsContainer.appendChild(ms_resultsDiv);
        container.appendChild(ms_resultsContainer);
        ms_modal.appendChild(container);
        ms_filtersPanel = document.createElement('div');
        ms_filtersPanel.id = 'megaSearchFiltersPanel';
        ms_filtersPanel.innerHTML = ` <div class="filterGroup"> <h4>Цена (${ms_currentCurrency}) ${ms_createResetButtonHTML('price')}</h4> <div class="filterRangeInputs"> <input type="number" id="filterPriceMin" placeholder="от" min="0"> <input type="number" id="filterPriceMax" placeholder="до" min="0"> </div> </div> <div class="filterGroup"> <h4>Продажи ${ms_createResetButtonHTML('sales')}</h4> <div class="filterRangeInputs"> <input type="number" id="filterSalesMin" placeholder="от" min="0"> <input type="number" id="filterSalesMax" placeholder="до" min="0"> </div> </div> <div class="filterGroup"> <h4>Рейтинг продавца ${ms_createResetButtonHTML('rating')}</h4> <div class="filterRangeInputs"> <input type="number" id="filterRatingMin" placeholder="от" step="0.1" min="0"> <input type="number" id="filterRatingMax" placeholder="до" step="0.1" min="0"> </div> </div> <div class="filterGroup"> <h4>Опции ${ms_createResetButtonHTML('options')}</h4> <div class="filterCheckbox"> <label><input type="checkbox" id="filterHideBadReviews"> Скрыть с плох. отзывами</label> </div> <div class="filterCheckbox"> <label><input type="checkbox" id="filterHideReturns"> Скрыть с возвратами</label> </div> <div class="filterCheckbox"> <label><input type="checkbox" id="filterOnlyDiscount"> Система скидок</label> </div> </div> <div class="filterGroup"> <h4>Дата добавления ${ms_createResetButtonHTML('date')}</h4> <div class="filterSelect"> <select id="filterDateSelect"> ${Object.entries(ms_dateFilterOptions).map(([key, text]) => `<option value="${key}">${text}</option>`).join('')} </select> </div> </div> <button id="resetAllFiltersBtn" class="megaSearchBtn">Сбросить все фильтры</button> `;
        ms_modal.appendChild(ms_filtersPanel);
        ms_exclusionTagsDiv = document.createElement('div');
        ms_exclusionTagsDiv.id = 'megaSearchExclusionTags';
        const exclusionInputGroup = document.createElement('div');
        exclusionInputGroup.className = 'exclusionInputGroup';
        ms_excludeInput = document.createElement('input');
        ms_excludeInput.type = 'text';
        ms_excludeInput.id = 'megaSearchExcludeInput';
        ms_excludeInput.placeholder = 'Исключить слово';
        ms_excludeInput.onkeydown = (e) => {
            if (e.key === 'Enter') ms_addFilterKeyword();
        };
        ms_addExcludeBtn = document.createElement('button');
        ms_addExcludeBtn.id = 'megaSearchAddExcludeBtn';
        ms_addExcludeBtn.innerHTML = `<svg viewBox="0 0 20 20"><path d="M10 2.5a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6a.75.75 0 0 1 .75-.75Z" /></svg>`;
        ms_addExcludeBtn.onclick = ms_addFilterKeyword;
        exclusionInputGroup.appendChild(ms_excludeInput);
        exclusionInputGroup.appendChild(ms_addExcludeBtn);
        ms_exclusionTagsDiv.appendChild(exclusionInputGroup);
        ms_exclusionTagsListDiv = document.createElement('div');
        ms_exclusionTagsListDiv.id = 'exclusionTagsList';
        ms_exclusionTagsDiv.appendChild(ms_exclusionTagsListDiv);
        ms_modal.appendChild(ms_exclusionTagsDiv);
        ms_closeBtn = document.createElement('button');
        ms_closeBtn.id = 'megaSearchCloseBtn';
        ms_closeBtn.innerHTML = '&times;';
        ms_closeBtn.onclick = hideModal;
        ms_modal.appendChild(ms_closeBtn);
        document.body.appendChild(ms_modal);
        ms_filterPriceMin = document.getElementById('filterPriceMin');
        ms_filterPriceMax = document.getElementById('filterPriceMax');
        ms_filterSalesMin = document.getElementById('filterSalesMin');
        ms_filterSalesMax = document.getElementById('filterSalesMax');
        ms_filterRatingMin = document.getElementById('filterRatingMin');
        ms_filterRatingMax = document.getElementById('filterRatingMax');
        ms_filterHideBadReviews = document.getElementById('filterHideBadReviews');
        ms_filterHideReturns = document.getElementById('filterHideReturns');
        ms_filterOnlyDiscount = document.getElementById('filterOnlyDiscount');
        ms_filterDateSelect = document.getElementById('filterDateSelect');
        ms_resetAllFiltersBtn = document.getElementById('resetAllFiltersBtn');
        ms_addFilterEventListeners();
        applyLoadedFiltersToUI();
        ms_updateSortButtonsState();
    }

    function ms_createResetButtonHTML(filterKey) {
        return `<button class="filterResetBtn" title="Сбросить фильтр" data-filter-key="${filterKey}"><svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></svg></button>`;
    }

    // --- MegaSearch: Управление Модальным Окном ---
    function showModal() {
        if (!ms_modal) createModal();
        document.body.style.overflow = 'hidden';
        ms_modal.style.display = 'block';
        ms_modal.scrollTop = 0;
        ms_searchInput.focus();
        ms_renderExclusionTags();
        applyLoadedFiltersToUI();
        ms_updateFilterPlaceholders();
        ms_applyFilters();
        ms_updateSortButtonsState();
        const header = document.getElementById('megaSearchHeader');
        const headerBottom = header ? header.getBoundingClientRect().bottom + window.scrollY : MS_TOP_OFFSET_FOR_SIDE_PANELS;
        const newTopOffset = headerBottom + 5;
        if (ms_filtersPanel) ms_filtersPanel.style.top = `${newTopOffset}px`;
        if (ms_exclusionTagsDiv) ms_exclusionTagsDiv.style.top = `${newTopOffset}px`;
    }

    function hideModal() {
        if (ms_modal) {
            ms_modal.style.display = 'none';
            if (ms_suggestionsDiv) ms_suggestionsDiv.style.display = 'none';
        }
        document.body.style.overflow = '';
    }

    // --- MegaSearch: Обновление статуса ---
    function ms_updateStatus(message) {
        if (ms_statusDiv) ms_statusDiv.textContent = message;
    }

    // --- MegaSearch: Запуск поиска ---
    function ms_triggerSearch() {
        const query = ms_searchInput.value.trim();
        if (ms_suggestionsDiv) ms_suggestionsDiv.style.display = 'none';
        if (!query) {
            ms_updateStatus('Пожалуйста, введите запрос.');
            return;
        }
        ms_currentResults = [];
        ms_resetSort(false);
        applyLoadedFiltersToUI();
        ms_renderResults();
        ms_updateStatus('Получение общего количества...');
        ms_fetchTotalCount(query);
    }

    // --- MegaSearch: Функции подсказок ---
    function ms_fetchSuggestions(query) {
        const trimmedQuery = query.trim();
        if (trimmedQuery.length < 2) {
            if (ms_suggestionsDiv) {
                ms_suggestionsDiv.innerHTML = '';
                ms_suggestionsDiv.style.display = 'none';
            }
            return;
        }
        const params = new URLSearchParams({
            q: trimmedQuery,
            v: 2
        });
        try {
            if (typeof plang !== 'undefined') params.append('lang', plang);
            if (typeof clientgeo !== 'undefined') params.append('geo', clientgeo);
        } catch (e) {
            console.warn("Could not get plang/clientgeo for suggestions.");
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: `${MS_SUGGEST_API_URL}?${params.toString()}`,
            onload: function(response) {
                try {
                    const suggestions = JSON.parse(response.responseText);
                    ms_renderSuggestions(suggestions);
                } catch (e) {
                    console.error("Error parsing suggestions:", e, response.responseText);
                    if (ms_suggestionsDiv) {
                        ms_suggestionsDiv.innerHTML = '';
                        ms_suggestionsDiv.style.display = 'none';
                    }
                }
            },
            onerror: function(error) {
                console.error("Error fetching suggestions:", error);
                if (ms_suggestionsDiv) {
                    ms_suggestionsDiv.innerHTML = '';
                    ms_suggestionsDiv.style.display = 'none';
                }
            }
        });
    }

    function ms_renderSuggestions(suggestions) {
        if (!ms_suggestionsDiv) return;
        if (!suggestions || suggestions.length === 0) {
            ms_suggestionsDiv.innerHTML = '';
            ms_suggestionsDiv.style.display = 'none';
            return;
        }
        ms_suggestionsDiv.innerHTML = '';
        suggestions.forEach(suggestion => {
            if (suggestion.type === "Товары" || suggestion.type === "Search") {
                const item = document.createElement('div');
                item.className = 'suggestionItem';
                item.textContent = suggestion.name;
                item.onmousedown = (e) => {
                    e.preventDefault();
                    ms_searchInput.value = suggestion.name;
                    ms_suggestionsDiv.style.display = 'none';
                    ms_triggerSearch();
                };
                ms_suggestionsDiv.appendChild(item);
            }
        });
        ms_suggestionsDiv.style.display = ms_suggestionsDiv.children.length > 0 ? 'block' : 'none';
    }

    // --- MegaSearch: Запросы API ---
    function ms_fetchTotalCount(query) {
        const params = new URLSearchParams({
            query: query,
            searchmode: 10,
            sortmode: MS_DEFAULT_SORT_MODE,
            pagesize: MS_RESULTS_PER_PAGE_CHECK,
            pagenum: 1,
            owner: 1,
            details: 1,
            checkhidesales: 1,
            host: 'plati.market'
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: `${MS_API_BASE_URL}?${params.toString()}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data?.result?.total > 0) {
                        const total = data.result.total;
                        ms_updateStatus(`Найдено ${total} товаров. Загрузка...`);
                        ms_fetchAllResults(query, total);
                    } else {
                        ms_updateStatus(`По запросу "${query}" ничего не найдено.`);
                        ms_currentResults = [];
                        ms_renderResults();
                        ms_updateFilterPlaceholders();
                        ms_applyFilters();
                    }
                } catch (e) {
                    console.error("Ошибка парсинга ответа (количество):", e, response.responseText);
                    ms_updateStatus('Ошибка получения общего количества товаров.');
                }
            },
            onerror: function(error) {
                console.error("Сетевая ошибка (количество):", error);
                ms_updateStatus('Ошибка сети при получении общего количества товаров.');
            }
        });
    }

    function ms_fetchAllResults(query, total) {
        const MAX_PAGE_SIZE = 1000;
        const effectivePageSize = Math.min(total, MAX_PAGE_SIZE);
        if (total > MAX_PAGE_SIZE) {
            console.warn(`MegaSearch: Запрошено ${total} товаров, но API будет вызван с ограничением ${MAX_PAGE_SIZE}.`);
            ms_updateStatus(`Найдено ${total} товаров. Загрузка первых ${MAX_PAGE_SIZE}...`);
        }
        const params = new URLSearchParams({
            query: query,
            searchmode: 10,
            sortmode: MS_DEFAULT_SORT_MODE,
            pagesize: effectivePageSize,
            pagenum: 1,
            owner: 1,
            details: 1,
            checkhidesales: 1,
            host: 'plati.market'
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: `${MS_API_BASE_URL}?${params.toString()}`,
            timeout: 90000,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data?.items?.item) {
                        ms_currentResults = data.items.item.map((item, index) => ({
                            ...item,
                            originalIndex: index
                        }));
                        const loadedCount = ms_currentResults.length;
                        ms_updateStatus(`Загружено ${loadedCount}${total > loadedCount ? ` из ${total}` : ''} товаров.`);
                        ms_applySort(ms_currentSort.field, ms_currentSort.direction);
                        ms_renderResults();
                        ms_updateFilterPlaceholders();
                        ms_applyFilters();
                    } else {
                        ms_updateStatus(`Ошибка загрузки товаров. Ответ API не содержит данных.`);
                        ms_currentResults = [];
                        ms_renderResults();
                        ms_updateFilterPlaceholders();
                        ms_applyFilters();
                    }
                } catch (e) {
                    console.error("Ошибка парсинга ответа (все):", e, response.responseText);
                    ms_updateStatus('Ошибка обработки данных товаров.');
                    ms_currentResults = [];
                    ms_renderResults();
                    ms_updateFilterPlaceholders();
                    ms_applyFilters();
                }
            },
            onerror: function(error) {
                console.error("Сетевая ошибка (все):", error);
                ms_updateStatus('Ошибка сети при загрузке товаров.');
                ms_currentResults = [];
                ms_renderResults();
                ms_updateFilterPlaceholders();
                ms_applyFilters();
            },
            ontimeout: function() {
                console.error("Таймаут загрузки результатов");
                ms_updateStatus('Время ожидания ответа от сервера истекло.');
                ms_currentResults = [];
                ms_renderResults();
                ms_updateFilterPlaceholders();
                ms_applyFilters();
            }
        });
    }

    // --- MegaSearch: Сортировка ---
    function ms_handleSort(field) {
        let newDirection;
        const isAdvanced = !!ms_advancedSorts[field];
        const currentBtnQuery = isAdvanced ? `#megaSearchAdvSortMenu .megaSearchSortMenuItem[data-sort="${field}"]` : `#megaSearchHeader > .megaSearchBtn.sortBtn[data-sort="${field}"]`;
        const currentBtn = $(currentBtnQuery);
        const currentDir = currentBtn.attr('data-dir') || (ms_advancedSorts[field] ? ms_advancedSorts[field].defaultDir : 'desc');
        if (ms_firstSortClick[field]) {
            newDirection = ms_advancedSorts[field] ? ms_advancedSorts[field].defaultDir : (field === 'price' ? 'asc' : 'desc');
        } else {
            newDirection = currentDir === 'desc' ? 'asc' : 'desc';
        }
        Object.keys(ms_firstSortClick).forEach(key => {
            ms_firstSortClick[key] = (key !== field);
        });
        ms_firstSortClick[field] = false;
        ms_currentSort.field = field;
        ms_currentSort.direction = newDirection;
        GM_setValue('megaSearchLastSort', ms_currentSort);
        ms_updateSortButtonsState(field, newDirection);
        ms_applySort(field, newDirection);
        ms_renderResults();
    }

    function ms_updateSortButtonsState(activeField = ms_currentSort.field, activeDirection = ms_currentSort.direction) {
        $('#megaSearchHeader > .megaSearchBtn.sortBtn').each(function() {
            const btnField = $(this).data('sort');
            if (!ms_advancedSorts[btnField]) {
                const baseText = $(this).text().replace(' ▲', '').replace(' ▼', '');
                if (btnField === activeField) {
                    const arrow = activeDirection === 'asc' ? ' ▲' : ' ▼';
                    $(this).addClass('active').text(baseText + arrow).attr('data-dir', activeDirection);
                } else {
                    $(this).removeClass('active').text(baseText + ' ▼').attr('data-dir', 'desc');
                }
            }
        });
        let advBtnText = 'Доп. сорт.';
        const advButton = $('#megaSearchAdvSortBtn');
        if (ms_advancedSorts[activeField]) {
            advButton.addClass('active');
            const arrow = activeDirection === 'asc' ? ' ▲' : ' ▼';
            advBtnText = `${ms_advancedSorts[activeField].name}${arrow}`;
        } else {
            advButton.removeClass('active');
        }
        if (advButton.length) advButton.text(advBtnText);
        $('#megaSearchAdvSortMenu .megaSearchSortMenuItem').each(function() {
            const itemField = $(this).data('sort');
            const baseText = ms_advancedSorts[itemField].name;
            if (itemField === activeField) {
                const arrow = activeDirection === 'asc' ? ' ▲' : ' ▼';
                $(this).addClass('active').html(`${baseText} <span class="sortArrow">${arrow}</span>`).attr('data-dir', activeDirection);
            } else {
                const defaultDir = ms_advancedSorts[itemField].defaultDir;
                const defaultArrow = defaultDir === 'asc' ? ' ▲' : ' ▼';
                $(this).removeClass('active').html(`${baseText} <span class="sortArrow">${defaultArrow}</span>`).attr('data-dir', defaultDir);
            }
        });
    }

    function ms_resetSort(render = true) {
        ms_currentSort = {
            field: 'relevance',
            direction: 'asc'
        };
        ms_firstSortClick = {
            price: true,
            sales: true,
            name: true,
            relevance: false,
            date_create: true,
            discount: true,
            seller_rating: true,
            review_ratio: true,
            good_reviews: true,
            bad_reviews: true,
            returns: true
        };
        GM_setValue('megaSearchLastSort', ms_currentSort);
        ms_updateSortButtonsState();
        if (render) {
            ms_applySort(ms_currentSort.field, ms_currentSort.direction);
            ms_renderResults();
        }
    }

    function ms_applySort(field, direction) {
        const dirMultiplier = direction === 'asc' ? 1 : -1;
        const selectedCurrency = ms_currencySelect ? ms_currencySelect.value.toUpperCase() : 'RUR';
        ms_currentResults.sort((a, b) => {
            let valA, valB;
            const nameA = (typeof a.name === 'string' ? a.name : '').toLowerCase();
            const nameB = (typeof b.name === 'string' ? b.name : '').toLowerCase();
            const finalPriceA = getPriceInSelectedCurrency(a, selectedCurrency);
            const finalPriceB = getPriceInSelectedCurrency(b, selectedCurrency);
            let comparisonResult = 0;
            switch (field) {
                case 'price':
                    valA = finalPriceA;
                    valB = finalPriceB;
                    break;
                case 'sales':
                    valA = formatSales(a.cnt_sell);
                    valB = formatSales(b.cnt_sell);
                    break;
                case 'name':
                    comparisonResult = nameA.localeCompare(nameB) * dirMultiplier;
                    break;
                case 'date_create':
                    valA = parseDate(a.date_create);
                    valB = parseDate(b.date_create);
                    break;
                case 'discount':
                    valA = parseInt(a.discount || '0', 10);
                    valB = parseInt(b.discount || '0', 10);
                    break;
                case 'seller_rating':
                    valA = parseSellerRating(a.seller_rating);
                    valB = parseSellerRating(b.seller_rating);
                    break;
                case 'review_ratio':
                    valA = calculateReviewRatio(a);
                    valB = calculateReviewRatio(b);
                    break;
                case 'good_reviews':
                    valA = parseInt(a.cnt_good_responses || '0', 10);
                    valB = parseInt(b.cnt_good_responses || '0', 10);
                    break;
                case 'bad_reviews':
                    valA = parseInt(a.cnt_bad_responses || '0', 10);
                    valB = parseInt(b.cnt_bad_responses || '0', 10);
                    break;
                case 'returns':
                    valA = parseInt(a.cnt_return || '0', 10);
                    valB = parseInt(b.cnt_return || '0', 10);
                    break;
                case 'relevance':
                    valA = a.originalIndex;
                    valB = b.originalIndex;
                    break;
                default:
                    return 0;
            }
            if (field !== 'name') {
                const fallbackAsc = Infinity;
                const fallbackDesc = -Infinity;
                if (valA === null || valA === undefined || isNaN(valA) || valA === Infinity || valA === -Infinity) valA = direction === 'asc' ? fallbackAsc : fallbackDesc;
                if (valB === null || valB === undefined || isNaN(valB) || valB === Infinity || valB === -Infinity) valB = direction === 'asc' ? fallbackAsc : fallbackDesc;
                if (valA < valB) comparisonResult = -1;
                else if (valA > valB) comparisonResult = 1;
                else comparisonResult = 0;
                comparisonResult *= dirMultiplier;
            }
            if (comparisonResult !== 0) return comparisonResult;
            if (field !== 'name') {
                let nameCompare = nameA.localeCompare(nameB);
                if (nameCompare !== 0) return nameCompare;
            }
            if (field !== 'price') {
                if (finalPriceA < finalPriceB) return -1;
                if (finalPriceA > finalPriceB) return 1;
            }
            return a.originalIndex - b.originalIndex;
        });
    }

    // --- MegaSearch: Управление Фильтрами ---
    function ms_getFilterStorageKey(key) {
        return `${MS_FILTER_STORAGE_PREFIX}${key}`;
    }

    function ms_loadFilters() {
        const defaults = {
            priceMin: '',
            priceMax: '',
            salesMin: '',
            salesMax: '',
            ratingMin: '',
            ratingMax: '',
            hideBadReviews: false,
            hideReturns: false,
            onlyDiscount: false,
            date: 'all'
        };
        let loaded = {};
        for (const key in defaults) {
            loaded[key] = GM_getValue(ms_getFilterStorageKey(key), defaults[key]);
        }
        return loaded;
    }

    function ms_saveFilter(key, value) {
        ms_currentFilters[key] = value;
        GM_setValue(ms_getFilterStorageKey(key), value);
    }

    function applyLoadedFiltersToUI() {
        if (!ms_filtersPanel) return;
        ms_filterPriceMin.value = ms_currentFilters.priceMin;
        ms_filterPriceMax.value = ms_currentFilters.priceMax;
        ms_filterSalesMin.value = ms_currentFilters.salesMin;
        ms_filterSalesMax.value = ms_currentFilters.salesMax;
        ms_filterRatingMin.value = ms_currentFilters.ratingMin;
        ms_filterRatingMax.value = ms_currentFilters.ratingMax;
        ms_filterHideBadReviews.checked = ms_currentFilters.hideBadReviews;
        ms_filterHideReturns.checked = ms_currentFilters.hideReturns;
        ms_filterOnlyDiscount.checked = ms_currentFilters.onlyDiscount;
        ms_filterDateSelect.value = ms_currentFilters.date;
        const priceHeader = ms_filtersPanel.querySelector('.filterGroup h4');
        if (priceHeader && priceHeader.textContent.includes('Цена')) {
            priceHeader.innerHTML = `Цена (${ms_currentCurrency}) ${ms_createResetButtonHTML('price')}`;
            const resetButton = priceHeader.querySelector('.filterResetBtn');
            if (resetButton) resetButton.onclick = ms_handleFilterReset;
        }
    }

    function ms_addFilterEventListeners() {
        const debouncedApply = debounce(ms_applyFilters, MS_FILTER_DEBOUNCE_MS);
        ms_filterPriceMin.addEventListener('input', (e) => {
            ms_saveFilter('priceMin', e.target.value);
            debouncedApply();
        });
        ms_filterPriceMax.addEventListener('input', (e) => {
            ms_saveFilter('priceMax', e.target.value);
            debouncedApply();
        });
        ms_filterSalesMin.addEventListener('input', (e) => {
            ms_saveFilter('salesMin', e.target.value);
            debouncedApply();
        });
        ms_filterSalesMax.addEventListener('input', (e) => {
            ms_saveFilter('salesMax', e.target.value);
            debouncedApply();
        });
        ms_filterRatingMin.addEventListener('input', (e) => {
            ms_saveFilter('ratingMin', e.target.value);
            debouncedApply();
        });
        ms_filterRatingMax.addEventListener('input', (e) => {
            ms_saveFilter('ratingMax', e.target.value);
            debouncedApply();
        });
        ms_filterHideBadReviews.addEventListener('change', (e) => {
            ms_saveFilter('hideBadReviews', e.target.checked);
            ms_applyFilters();
        });
        ms_filterHideReturns.addEventListener('change', (e) => {
            ms_saveFilter('hideReturns', e.target.checked);
            ms_applyFilters();
        });
        ms_filterOnlyDiscount.addEventListener('change', (e) => {
            ms_saveFilter('onlyDiscount', e.target.checked);
            ms_applyFilters();
        });
        ms_filterDateSelect.addEventListener('change', (e) => {
            ms_saveFilter('date', e.target.value);
            ms_applyFilters();
        });
        ms_resetAllFiltersBtn.addEventListener('click', () => ms_resetAllFilters(true));
        ms_filtersPanel.querySelectorAll('.filterResetBtn').forEach(btn => {
            btn.onclick = ms_handleFilterReset;
        });
    }

    function ms_handleFilterReset(event) {
        const key = event.currentTarget.dataset.filterKey;
        ms_resetFilterByKey(key, true);
    }

    function ms_resetFilterByKey(key, apply = true) {
        switch (key) {
            case 'price':
                ms_saveFilter('priceMin', '');
                if (ms_filterPriceMin) ms_filterPriceMin.value = '';
                ms_saveFilter('priceMax', '');
                if (ms_filterPriceMax) ms_filterPriceMax.value = '';
                break;
            case 'sales':
                ms_saveFilter('salesMin', '');
                if (ms_filterSalesMin) ms_filterSalesMin.value = '';
                ms_saveFilter('salesMax', '');
                if (ms_filterSalesMax) ms_filterSalesMax.value = '';
                break;
            case 'rating':
                ms_saveFilter('ratingMin', '');
                if (ms_filterRatingMin) ms_filterRatingMin.value = '';
                ms_saveFilter('ratingMax', '');
                if (ms_filterRatingMax) ms_filterRatingMax.value = '';
                break;
            case 'options':
                ms_saveFilter('hideBadReviews', false);
                if (ms_filterHideBadReviews) ms_filterHideBadReviews.checked = false;
                ms_saveFilter('hideReturns', false);
                if (ms_filterHideReturns) ms_filterHideReturns.checked = false;
                ms_saveFilter('onlyDiscount', false);
                if (ms_filterOnlyDiscount) ms_filterOnlyDiscount.checked = false;
                break;
            case 'date':
                ms_saveFilter('date', 'all');
                if (ms_filterDateSelect) ms_filterDateSelect.value = 'all';
                break;
        }
        if (apply) ms_applyFilters();
    }

    function ms_resetAllFilters(apply = true) {
        const filterKeys = ['price', 'sales', 'rating', 'options', 'date'];
        filterKeys.forEach(key => ms_resetFilterByKey(key, false));
        if (apply) ms_applyFilters();
    }

    function ms_updateFilterPlaceholders() {
        if (!ms_currentResults || ms_currentResults.length === 0 || !ms_filtersPanel) {
            $('#filterPriceMin, #filterPriceMax, #filterSalesMin, #filterSalesMax, #filterRatingMin, #filterRatingMax').attr('placeholder', '-');
            return;
        }
        let minPrice = Infinity,
            maxPrice = -Infinity;
        let minSales = Infinity,
            maxSales = -Infinity;
        let minRating = Infinity,
            maxRating = -Infinity;
        const selectedCurrency = ms_currencySelect ? ms_currencySelect.value.toUpperCase() : 'RUR';
        ms_currentResults.forEach(item => {
            const price = getPriceInSelectedCurrency(item, selectedCurrency);
            const sales = formatSales(item.cnt_sell);
            const rating = parseSellerRating(item.seller_rating);
            if (price !== Infinity && price < minPrice) minPrice = price;
            if (price !== Infinity && price > maxPrice) maxPrice = price;
            if (sales < minSales) minSales = sales;
            if (sales > maxSales) maxSales = sales;
            if (rating < minRating) minRating = rating;
            if (rating > maxRating) maxRating = rating;
        });
        if (ms_filterPriceMin) ms_filterPriceMin.placeholder = minPrice === Infinity ? '-' : `от ${Math.floor(minPrice)}`;
        if (ms_filterPriceMax) ms_filterPriceMax.placeholder = maxPrice === -Infinity ? '-' : `до ${Math.ceil(maxPrice)}`;
        if (ms_filterSalesMin) ms_filterSalesMin.placeholder = minSales === Infinity ? '-' : `от ${minSales}`;
        if (ms_filterSalesMax) ms_filterSalesMax.placeholder = maxSales === -Infinity ? '-' : `до ${maxSales}`;
        if (ms_filterRatingMin) ms_filterRatingMin.placeholder = minRating === Infinity ? '-' : `от ${minRating.toFixed(1)}`;
        if (ms_filterRatingMax) ms_filterRatingMax.placeholder = maxRating === -Infinity ? '-' : `до ${maxRating.toFixed(1)}`;
    }

    function ms_getDateThreshold(periodKey) {
        const now = Date.now();
        let threshold = 0;
        switch (periodKey) {
            case '1d':
                threshold = now - 1 * 24 * 60 * 60 * 1000;
                break;
            case '2d':
                threshold = now - 2 * 24 * 60 * 60 * 1000;
                break;
            case '1w':
                threshold = now - 7 * 24 * 60 * 60 * 1000;
                break;
            case '1m':
                threshold = now - 30 * 24 * 60 * 60 * 1000;
                break;
            case '6m':
                threshold = now - 182 * 24 * 60 * 60 * 1000;
                break;
            case '1y':
                threshold = now - 365 * 24 * 60 * 60 * 1000;
                break;
            case '5y':
                threshold = now - 5 * 365 * 24 * 60 * 60 * 1000;
                break;
            case '10y':
                threshold = now - 10 * 365 * 24 * 60 * 60 * 1000;
                break;
            case 'all':
            default:
                threshold = 0;
                break;
        }
        return threshold;
    }

    function ms_applyFilters() {
        if (!ms_resultsDiv) return;
        const keywords = ms_exclusionKeywords.map(k => k.toLowerCase());
        const pMin = parseFloat(ms_currentFilters.priceMin) || 0;
        const pMax = parseFloat(ms_currentFilters.priceMax) || Infinity;
        const sMin = parseInt(ms_currentFilters.salesMin, 10) || 0;
        const sMax = parseInt(ms_currentFilters.salesMax, 10) || Infinity;
        const rMin = parseFloat(ms_currentFilters.ratingMin) || 0;
        const rMax = parseFloat(ms_currentFilters.ratingMax) || Infinity;
        const hideBad = ms_currentFilters.hideBadReviews;
        const hideRet = ms_currentFilters.hideReturns;
        const onlyDisc = ms_currentFilters.onlyDiscount;
        const datePeriod = ms_currentFilters.date;
        const dateThreshold = ms_getDateThreshold(datePeriod);
        const selectedCurrency = ms_currencySelect ? ms_currencySelect.value.toUpperCase() : 'RUR';
        let visibleCount = 0;
        const items = ms_resultsDiv.querySelectorAll('.megaSearchItem');
        items.forEach(itemElement => {
            const itemId = itemElement.dataset.id;
            const itemData = ms_currentResults.find(r => r.id === itemId);
            if (!itemData) {
                itemElement.classList.add('hidden-by-filter');
                return;
            }
            let shouldHide = false;
            if (keywords.length > 0) {
                const title = (itemData.name || '').toLowerCase();
                const seller = (itemData.seller_name || '').toLowerCase();
                const itemText = title + ' ' + seller;
                if (keywords.some(keyword => itemText.includes(keyword))) {
                    shouldHide = true;
                }
            }
            if (!shouldHide) {
                const price = getPriceInSelectedCurrency(itemData, selectedCurrency);
                if (price < pMin || price > pMax) {
                    shouldHide = true;
                }
            }
            if (!shouldHide) {
                const sales = formatSales(itemData.cnt_sell);
                if (sales < sMin || sales > sMax) {
                    shouldHide = true;
                }
            }
            if (!shouldHide) {
                const rating = parseSellerRating(itemData.seller_rating);
                if (rating < rMin || rating > rMax) {
                    shouldHide = true;
                }
            }
            if (!shouldHide && hideBad) {
                if (parseInt(itemData.cnt_bad_responses || '0', 10) > 0) {
                    shouldHide = true;
                }
            }
            if (!shouldHide && hideRet) {
                if (parseInt(itemData.cnt_return || '0', 10) > 0) {
                    shouldHide = true;
                }
            }
            if (!shouldHide && onlyDisc) {
                if (parseInt(itemData.discount || '0', 10) <= 0) {
                    shouldHide = true;
                }
            }
            if (!shouldHide && dateThreshold > 0) {
                const itemDate = parseDate(itemData.date_create);
                if (!itemDate || itemDate < dateThreshold) {
                    shouldHide = true;
                }
            }
            if (shouldHide) {
                itemElement.classList.add('hidden-by-filter');
            } else {
                itemElement.classList.remove('hidden-by-filter');
                visibleCount++;
            }
        });
        const totalCount = ms_currentResults.length;
        const anyFilterActive = pMin > 0 || pMax < Infinity || sMin > 0 || sMax < Infinity || rMin > 0 || rMax < Infinity || hideBad || hideRet || onlyDisc || datePeriod !== 'all' || keywords.length > 0;
        if (totalCount > 0) {
            if (anyFilterActive) {
                ms_updateStatus(`Показано ${visibleCount} из ${totalCount} товаров (фильтры применены).`);
            } else {
                ms_updateStatus(`Загружено ${totalCount} товаров.`);
            }
        } else if (!ms_searchInput || !ms_searchInput.value.trim()) {
            ms_updateStatus(`Введите запрос для поиска.`);
        }
        if (visibleCount === 0 && totalCount > 0 && anyFilterActive) {
            ms_statusDiv.textContent = 'Нет товаров, соответствующих фильтрам.';
            ms_statusDiv.style.display = 'block';
        } else if (visibleCount > 0) {
            ms_statusDiv.style.display = 'none';
        } else if (totalCount === 0 && ms_searchInput && ms_searchInput.value.trim()) {
            ms_statusDiv.style.display = 'block';
        } else {
            ms_statusDiv.style.display = 'none';
        }
    }

    // --- MegaSearch: Фильтрация Исключений (Облака) ---
    function ms_addFilterKeyword() {
        const keyword = ms_excludeInput.value.trim().toLowerCase();
        if (keyword && !ms_exclusionKeywords.includes(keyword)) {
            ms_exclusionKeywords.push(keyword);
            GM_setValue('megaSearchExclusions', ms_exclusionKeywords);
            ms_excludeInput.value = '';
            ms_renderExclusionTags();
            ms_applyFilters();
        }
    }

    function ms_removeFilterKeyword(keywordToRemove) {
        ms_exclusionKeywords = ms_exclusionKeywords.filter(k => k !== keywordToRemove);
        GM_setValue('megaSearchExclusions', ms_exclusionKeywords);
        ms_renderExclusionTags();
        ms_applyFilters();
    }

    function ms_renderExclusionTags() {
        if (!ms_exclusionTagsListDiv) return;
        ms_exclusionTagsListDiv.innerHTML = '';
        ms_exclusionKeywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'exclusionTag';
            tag.textContent = keyword;
            tag.title = `Удалить "${keyword}"`;
            tag.onclick = () => ms_removeFilterKeyword(keyword);
            ms_exclusionTagsListDiv.appendChild(tag);
        });
    }

    // --- MegaSearch: Рендеринг Результатов ---
    function ms_renderResults() {
        if (!ms_resultsDiv) return;
        ms_resultsDiv.innerHTML = '';
        if (ms_currentResults.length === 0) {
            ms_applyFilters();
            return;
        }
        const now = Date.now();
        const thresholdTime = now - NEW_ITEM_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
        const fragment = document.createDocumentFragment();
        const selectedCurrency = ms_currencySelect ? ms_currencySelect.value.toUpperCase() : 'RUR';
        ms_currentResults.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'megaSearchItem';
            itemDiv.dataset.id = item.id;
            const link = document.createElement('a');
            link.href = item.url || `https://plati.market/itm/${item.id}`;
            link.target = '_blank';
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'card-image-wrapper';
            const img = document.createElement('img');
            const imgSrc = `//${IMAGE_DOMAIN}/imgwebp.ashx?id_d=${item.id}&w=164&h=164&dc=${item.ticks_last_change || Date.now()}`;
            img.src = imgSrc;
            img.alt = item.name || 'Product image';
            img.loading = 'lazy';
            img.onerror = function() {
                this.onerror = null;
                this.src = 'https://plati.market/images/logo-plati.png';
            };
            imageWrapper.appendChild(img);
            const itemDate = parseDate(item.date_create);
            if (itemDate && itemDate > thresholdTime) {
                const newBadge = document.createElement('span');
                newBadge.className = 'newItemBadge';
                newBadge.textContent = 'New';
                imageWrapper.appendChild(newBadge);
            }
            link.appendChild(imageWrapper);
            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';
            let displayPrice = getPriceInSelectedCurrency(item, selectedCurrency);
            let currencySymbol;
            switch (selectedCurrency) {
                case 'USD':
                    currencySymbol = '$';
                    break;
                case 'EUR':
                    currencySymbol = '€';
                    break;
                case 'UAH':
                    currencySymbol = '₴';
                    break;
                case 'RUR':
                default:
                    currencySymbol = '₽';
                    break;
            }
            priceDiv.textContent = displayPrice !== Infinity ? `${displayPrice.toLocaleString('ru-RU', {minimumFractionDigits: 0, maximumFractionDigits: 2})} ${currencySymbol}` : 'Нет цены';
            link.appendChild(priceDiv);
            const titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.textContent = item.name || 'Без названия';
            titleDiv.title = item.name || 'Без названия';
            link.appendChild(titleDiv);
            const infoContainer = document.createElement('div');
            infoContainer.className = 'cardInfoContainer';
            const infoRow1 = document.createElement('div');
            infoRow1.className = 'cardInfoRow1';
            const infoRow2 = document.createElement('div');
            infoRow2.className = 'cardInfoRow2';
            const ratingVal = parseSellerRating(item.seller_rating);
            const goodRev = parseInt(item.cnt_good_responses || '0');
            const badRev = parseInt(item.cnt_bad_responses || '0');
            const returns = parseInt(item.cnt_return || '0');
            let salesCount = formatSales(item.cnt_sell);
            infoRow1.innerHTML = `<span>Рейт: ${ratingVal > 0 ? ratingVal.toLocaleString('ru-RU', {maximumFractionDigits: 0}) : 'N/A'}</span>` + `<span>Отз: <span class="reviewsGood">${goodRev}</span>${badRev > 0 ? '/<span class="reviewsBad">' + badRev + '</span>' : ''}</span>` + `<span>Возв: ${returns}</span>`;
            infoRow2.innerHTML = `<span class="sales">Прод: ${salesCount > 0 ? salesCount.toLocaleString('ru-RU') : '0'}</span>` + `<span class="dateAdded">Доб: ${formatDateString(itemDate)}</span>`;
            infoContainer.appendChild(infoRow1);
            infoContainer.appendChild(infoRow2);
            const sellerLink = document.createElement('a');
            sellerLink.className = 'sellerLink';
            sellerLink.textContent = `Продавец: ${item.seller_name || 'N/A'}`;
            sellerLink.title = `Продавец: ${item.seller_name || 'N/A'}`;
            if (item.seller_id && item.seller_name) {
                const safeSellerName = encodeURIComponent(item.seller_name.replace(/[^a-zA-Z0-9_\-.~]/g, '-')).replace(/%2F/g, '/');
                sellerLink.href = `https://plati.market/seller/${safeSellerName}/${item.seller_id}/`;
                sellerLink.target = '_blank';
                sellerLink.onclick = (e) => {
                    e.stopPropagation();
                };
            } else {
                sellerLink.style.pointerEvents = 'none';
            }
            infoContainer.appendChild(sellerLink);
            link.appendChild(infoContainer);
            const buyButtonDiv = document.createElement('div');
            buyButtonDiv.className = 'buyButton';
            buyButtonDiv.textContent = 'Перейти';
            link.appendChild(buyButtonDiv);
            itemDiv.appendChild(link);
            fragment.appendChild(itemDiv);
        });
        ms_resultsDiv.appendChild(fragment);
        ms_applyFilters();
    }

    // --- MegaSearch: Обработчики UI ---
    function ms_handleCurrencyChange() {
        ms_currentCurrency = ms_currencySelect.value.toUpperCase();
        GM_setValue('megaSearchCurrency', ms_currentCurrency);
        applyLoadedFiltersToUI();
        ms_updateFilterPlaceholders();
        if (ms_currentSort.field === 'price') {
            ms_applySort(ms_currentSort.field, ms_currentSort.direction);
        }
        ms_renderResults();
    }


    // ========================================
    // === MegaCatalog: Функционал Каталога ===
    // ========================================

    function initCatalogPage() {
        console.log("MegaCatalog: Инициализация страницы каталога...");
        mc_sellerId = getCurrentCatalogSellerIdFromUrl();
        if (!mc_sellerId) {
            console.error("MegaCatalog: Не удалось получить ID продавца из URL.");
            return;
        }

        document.body.mc_originalBodyHTML = document.body.innerHTML;

        document.body.classList.add('mc-redesigned');
        mc_catalogContainer = document.createElement('div');
        mc_catalogContainer.id = 'megaCatalogContainer';

        mc_headerDiv = document.createElement('div');
        mc_headerDiv.id = 'megaCatalogHeader';
        const sortContainer = document.createElement('div');
        sortContainer.className = 'mc-sort-container';
        const sortTypes = {
            'default': 'По умолчанию',
            'name': 'Название',
            'price': 'Цена',
            'sales': 'Продажи',
            'newness': 'Новизна'
        };
        for (const [key, text] of Object.entries(sortTypes)) {
            const btn = document.createElement('button');
            btn.className = 'mc-sort-btn megaCatalogBtn';
            btn.dataset.sort = key;
            btn.textContent = text + (key === 'default' || key === 'sales' || key === 'newness' ? ' ▼' : ' ▲');
            btn.addEventListener('click', () => mc_handleSort(key));
            mc_sortButtons[key] = btn;
            sortContainer.appendChild(btn);
        }
        if (mc_sortButtons['default']) mc_sortButtons['default'].classList.add('active');
        mc_collectBtn = document.createElement('button');
        mc_collectBtn.id = 'mcCollectBtn';
        mc_collectBtn.className = 'megaCatalogBtn accent';
        mc_collectBtn.textContent = 'Собрать каталог';
        mc_collectBtn.addEventListener('click', mc_startCatalogCollection);
        mc_statusDiv = document.createElement('div');
        mc_statusDiv.id = 'megaCatalogStatus';
        mc_progressBar = document.createElement('div');
        mc_progressBar.id = 'mcProgressBar';
        mc_progressBar.style.display = 'none';
        const progressBarInner = document.createElement('div');
        progressBarInner.id = 'mcProgressBarInner';
        mc_progressBar.appendChild(progressBarInner);
        mc_headerDiv.appendChild(sortContainer);
        mc_headerDiv.appendChild(mc_collectBtn);
        mc_headerDiv.appendChild(mc_statusDiv);
        mc_headerDiv.appendChild(mc_progressBar);
        mc_catalogContainer.appendChild(mc_headerDiv);

        mc_resultsDiv = document.createElement('div');
        mc_resultsDiv.id = 'megaCatalogResults';
        mc_catalogContainer.appendChild(mc_resultsDiv);

        mc_filtersPanel = document.createElement('div');
        mc_filtersPanel.id = 'mcFiltersPanel';
        mc_filtersPanel.innerHTML = `
            <div class="mc-filterGroup"> <h4>Цена ${mc_createResetButtonHTML('price')}</h4> <div class="filterRangeInputs"> <input type="number" id="mcFilterPriceMin" placeholder="от" min="0"> <input type="number" id="mcFilterPriceMax" placeholder="до" min="0"> </div> </div>
            <div class="mc-filterGroup"> <h4>Продажи ${mc_createResetButtonHTML('sales')}</h4> <div class="filterRangeInputs"> <input type="number" id="mcFilterSalesMin" placeholder="от" min="0"> <input type="number" id="mcFilterSalesMax" placeholder="до" min="0"> </div> </div>
            <button id="mcResetAllFiltersBtn" class="megaCatalogBtn">Сбросить фильтры</button>
        `;

        mc_exclusionPanel = document.createElement('div');
        mc_exclusionPanel.id = 'mcExclusionPanel';
        const mcExclusionInputGroup = document.createElement('div');
        mcExclusionInputGroup.className = 'mc-exclusionInputGroup';
        mc_excludeInput = document.createElement('input');
        mc_excludeInput.type = 'text';
        mc_excludeInput.id = 'mcExcludeInput';
        mc_excludeInput.placeholder = 'Исключить слово';
        mc_excludeInput.onkeydown = (e) => {
            if (e.key === 'Enter') mc_addExclusionKeyword();
        };
        mc_addExcludeBtn = document.createElement('button');
        mc_addExcludeBtn.id = 'mcAddExcludeBtn';
        mc_addExcludeBtn.innerHTML = `<svg viewBox="0 0 20 20"><path d="M10 2.5a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6a.75.75 0 0 1 .75-.75Z" /></svg>`;
        mc_addExcludeBtn.onclick = mc_addExclusionKeyword;
        mcExclusionInputGroup.appendChild(mc_excludeInput);
        mcExclusionInputGroup.appendChild(mc_addExcludeBtn);
        mc_exclusionPanel.appendChild(mcExclusionInputGroup);
        mc_exclusionTagsListDiv = document.createElement('div');
        mc_exclusionTagsListDiv.id = 'mcExclusionTagsList';
        mc_exclusionPanel.appendChild(mc_exclusionTagsListDiv);

        document.body.innerHTML = '';
        document.body.appendChild(mc_catalogContainer);
        document.body.appendChild(mc_filtersPanel);
        document.body.appendChild(mc_exclusionPanel);

        mc_filterPriceMin = document.getElementById('mcFilterPriceMin');
        mc_filterPriceMax = document.getElementById('mcFilterPriceMax');
        mc_filterSalesMin = document.getElementById('mcFilterSalesMin');
        mc_filterSalesMax = document.getElementById('mcFilterSalesMax');
        mc_resetAllFiltersBtn = document.getElementById('mcResetAllFiltersBtn');

        mc_parseAndStoreInitialData();
        mc_addFilterEventListeners();
        mc_applyLoadedFiltersToUI();
        mc_renderExclusionTags();
        mc_updateFilterPlaceholders();

        mc_updateStatus(`Загружено ${mc_initialCatalogData.length} товаров (страница 1)`);
        mc_applySort('default', 'asc');
        mc_renderCatalogResults(mc_initialCatalogData);
        mc_updateCatalogSortButtons();
        mc_positionSidePanels();
    }

    function mc_createResetButtonHTML(filterKey) {
        return `<button class="mc-filterResetBtn filterResetBtn" title="Сбросить фильтр" data-filter-key="${filterKey}"><svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></svg></button>`;
    }

    function mc_positionSidePanels() {
        const header = document.getElementById('megaCatalogHeader');
        const headerBottom = header ? header.getBoundingClientRect().bottom + window.scrollY : MC_TOP_OFFSET_FOR_SIDE_PANELS;
        const newTopOffset = headerBottom + 5;
        if (mc_filtersPanel) mc_filtersPanel.style.top = `${newTopOffset}px`;
        if (mc_exclusionPanel) mc_exclusionPanel.style.top = `${newTopOffset}px`;
    }

    function mc_parseAndStoreInitialData() {
        mc_initialCatalogData = [];
        console.log("MegaCatalog: Парсинг начальных данных...");
        const parser = new DOMParser();
        const initialHTML = document.body.mc_originalBodyHTML || '';
        if (!initialHTML) {
            console.warn("MegaCatalog: Не найден исходный HTML для парсинга начальных данных.");
            return;
        }
        const doc = parser.parseFromString(initialHTML, "text/html");
        const originalItems = doc.querySelectorAll('li.section-list__item');

        originalItems.forEach((item, index) => {
            const parsed = mc_parseListItem(item, index);
            if (parsed) mc_initialCatalogData.push(parsed);
        });

        console.log(`MegaCatalog: Спарсено ${mc_initialCatalogData.length} начальных товаров.`);
        document.body.mc_originalBodyHTML = null;
    }

    function mc_parseListItem(itemElement, index) {
        try {
            const linkElement = itemElement.querySelector('a.card');
            const imgElement = itemElement.querySelector('img.preview-image');
            const priceElement = itemElement.querySelector('span[name="price"]');
            const titleElement = itemElement.querySelector('p[name="title"] span');
            const soldElement = itemElement.querySelector('span[name="sold"]');

            if (!linkElement || !titleElement || !priceElement) {
                return null;
            }

            const url = linkElement.getAttribute('href');
            const id = linkElement.getAttribute('product_id') || url.split('/').pop();
            const name = titleElement.textContent.trim();
            const priceStr = priceElement.textContent.trim();
            const salesStr = soldElement ? soldElement.textContent.trim() : '0';
            const imgSrc = imgElement ? imgElement.getAttribute('src') : '';

            return {
                id: id,
                name: name,
                url: url.startsWith('/') ? `https://plati.market${url}` : url,
                price: formatPrice(priceStr),
                sales: formatSales(salesStr),
                imageUrl: imgSrc,
                originalIndex: index
            };
        } catch (e) {
            console.error("MegaCatalog: Ошибка парсинга элемента списка:", e, itemElement);
            return null;
        }
    }

    function mc_renderCatalogResults(dataToRender) {
        if (!mc_resultsDiv) return;
        mc_resultsDiv.innerHTML = '';
        const fragment = document.createDocumentFragment();
        console.log(`MegaCatalog: Рендеринг ${dataToRender.length} товаров...`);

        dataToRender.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'megaCatalogItem';
            itemDiv.dataset.id = item.id;
            const link = document.createElement('a');
            link.href = item.url;
            link.target = '_blank';
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'card-image-wrapper';
            const img = document.createElement('img');
            const imgSrc = item.imageUrl.includes(IMAGE_DOMAIN) ? item.imageUrl.replace(/&w=\d+&h=\d+/, '&w=164&h=164') : item.imageUrl || 'https://plati.market/images/logo-plati.png';
            img.src = imgSrc;
            img.alt = item.name;
            img.loading = 'lazy';
            img.onerror = function() {
                this.onerror = null;
                this.src = 'https://plati.market/images/logo-plati.png';
            };
            imageWrapper.appendChild(img);
            link.appendChild(imageWrapper);
            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';
            priceDiv.textContent = `${item.price.toLocaleString('ru-RU')} ₽`;
            link.appendChild(priceDiv);
            const titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.textContent = item.name;
            titleDiv.title = item.name;
            link.appendChild(titleDiv);
            const infoContainer = document.createElement('div');
            infoContainer.className = 'cardInfoContainer';
            const infoRow1 = document.createElement('div');
            infoRow1.className = 'cardInfoRow1';
            infoRow1.innerHTML = `<span class="sales">Продано: ${item.sales.toLocaleString('ru-RU')}</span>`;
            infoContainer.appendChild(infoRow1);
            link.appendChild(infoContainer);
            const buyButtonDiv = document.createElement('div');
            buyButtonDiv.className = 'buyButton';
            buyButtonDiv.textContent = 'Перейти';
            link.appendChild(buyButtonDiv);
            itemDiv.appendChild(link);
            fragment.appendChild(itemDiv);
        });
        mc_resultsDiv.appendChild(fragment);
        console.log("MegaCatalog: Рендеринг завершен.");
        mc_applyFilters();
    }

    function mc_updateStatus(message) {
        if (mc_statusDiv) mc_statusDiv.textContent = message;
    }

    function mc_updateProgressBar(currentPage, totalPages) {
        if (!mc_progressBar) return;
        const percent = totalPages <= 1 ? 100 : Math.round(((currentPage) / totalPages) * 100);
        const innerBar = mc_progressBar.querySelector('#mcProgressBarInner');
        if (innerBar) {
            innerBar.style.width = `${percent}%`;
            innerBar.textContent = `${percent}%`;
        }
        mc_progressBar.style.display = 'block';
    }

    function mc_fetchCatalogPage(page) {
        return new Promise((resolve, reject) => {
            const lang = getCurrentCatalogLangFromUrl();
            const curr = getCurrentCatalogCurrFromUrl();
            const url = `${MC_BASE_URL}?id_s=${mc_sellerId}&page=${page}&rows=${MC_ROWS_PER_PAGE}&curr=${curr}&lang=${lang}`;
            console.log(`MegaCatalog: Запрос страницы ${page}...`);
            mc_requestsPending++;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 30000,
                onload: function(response) {
                    mc_requestsPending--;
                    console.log(`MegaCatalog: Получена страница ${page}, статус ${response.status}`);
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(`Ошибка загрузки страницы ${page}: ${response.statusText}`);
                    }
                    mc_updateStatus(`Загрузка каталога... (Осталось запросов: ${mc_requestsPending})`);
                },
                onerror: function(error) {
                    mc_requestsPending--;
                    console.error(`MegaCatalog: Сетевая ошибка при загрузке страницы ${page}:`, error);
                    reject(`Сетевая ошибка при загрузке страницы ${page}`);
                    mc_updateStatus(`Загрузка каталога... (Осталось запросов: ${mc_requestsPending}, возникла ошибка)`);
                },
                ontimeout: function() {
                    mc_requestsPending--;
                    console.error(`MegaCatalog: Таймаут при загрузке страницы ${page}`);
                    reject(`Таймаут при загрузке страницы ${page}`);
                    mc_updateStatus(`Загрузка каталога... (Осталось запросов: ${mc_requestsPending}, возник таймаут)`);
                }
            });
        });
    }

    async function mc_startCatalogCollection() {
        if (!mc_sellerId) return;
        mc_collectBtn.disabled = true;
        mc_collectBtn.textContent = 'Сбор...';
        mc_updateStatus('Получение общего количества товаров...');
        mc_progressBar.style.display = 'block';
        mc_updateProgressBar(0, 1);
        try {
            const firstPageResponse = await mc_fetchCatalogPage(1);
            const firstPageItems = mc_parseHtmlResponse(firstPageResponse);
            firstPageItems.forEach((item, index) => item.originalIndex = index);
            mc_initialCatalogData = firstPageItems;

            const totalMatch = firstPageResponse.match(/^(\d+)\|/);
            if (!totalMatch || !totalMatch[1]) {
                throw new Error("Не удалось определить общее количество товаров.");
            }
            mc_totalItems = parseInt(totalMatch[1], 10);
            mc_updateStatus(`Обнаружено ${mc_totalItems} товаров. Загрузка страниц...`);
            const totalPages = Math.ceil(mc_totalItems / MC_ROWS_PER_PAGE);
            console.log(`MegaCatalog: Всего страниц для загрузки: ${totalPages}`);
            mc_updateProgressBar(1, totalPages);

            const pagePromises = [];
            if (totalPages > 1) {
                mc_updateStatus(`Загрузка каталога... (Осталось запросов: ${totalPages - 1})`);
                for (let page = 2; page <= totalPages; page++) {
                    pagePromises.push(mc_fetchCatalogPage(page).then(html => {
                        mc_updateProgressBar(totalPages - mc_requestsPending, totalPages);
                        return html;
                    }));
                }
            } else {
                mc_updateStatus('Все товары уже загружены (1 страница).');
            }

            const remainingPagesHtml = await Promise.all(pagePromises);
            mc_updateStatus('Обработка данных...');
            mc_fullCatalogData = [...mc_initialCatalogData];
            let currentOverallIndex = mc_initialCatalogData.length;
            remainingPagesHtml.forEach(html => {
                const pageItems = mc_parseHtmlResponse(html);
                pageItems.forEach(item => {
                    item.originalIndex = currentOverallIndex++;
                    mc_fullCatalogData.push(item);
                });
            });

            if (mc_fullCatalogData.length > 0) {
                const seenIds = new Set();
                const uniqueCatalogData = [];
                for (const item of mc_fullCatalogData) {
                    if (item && typeof item.id !== 'undefined') {
                        if (!seenIds.has(item.id)) {
                            seenIds.add(item.id);
                            uniqueCatalogData.push(item);
                        }
                    } else {
                        if (item && typeof item.id === 'undefined' && !seenIds.has(undefined)) {
                             seenIds.add(undefined);
                             uniqueCatalogData.push(item);
                        }
                        console.warn("MegaCatalog: Item without ID or problematic item found during deduplication", item);
                    }
                }
                const removedCount = mc_fullCatalogData.length - uniqueCatalogData.length;
                if (removedCount > 0) {
                    console.log(`MegaCatalog: Удалено ${removedCount} дубликатов.`);
                }
                mc_fullCatalogData = uniqueCatalogData;
            }

            mc_isCatalogCollected = true;
            mc_collectBtn.style.display = 'none';
            mc_progressBar.style.display = 'none';
            mc_updateStatus(`Каталог собран! Загружено ${mc_fullCatalogData.length} уникальных товаров (из ${mc_totalItems} потенциальных).`);
            mc_applySort('default', 'asc');
            mc_renderCatalogResults(mc_fullCatalogData);
            mc_updateFilterPlaceholders();
        } catch (error) {
            console.error("MegaCatalog: Ошибка при сборе каталога:", error);
            mc_updateStatus(`Ошибка сбора каталога: ${error}`);
            mc_collectBtn.disabled = false;
            mc_collectBtn.textContent = 'Повторить сбор';
            mc_progressBar.style.display = 'none';
        }
    }

    function mc_parseHtmlResponse(htmlText) {
        const items = [];
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const listItems = doc.querySelectorAll('li.section-list__item');
            listItems.forEach(itemElement => {
                const parsed = mc_parseListItem(itemElement, 0);
                if (parsed) {
                    items.push(parsed);
                }
            });
        } catch (e) {
            console.error("MegaCatalog: Ошибка парсинга HTML ответа:", e, htmlText);
        }
        return items;
    }

    // --- MegaCatalog: Сортировка ---
    function mc_handleSort(field) {
        const dataToSort = mc_isCatalogCollected ? mc_fullCatalogData : mc_initialCatalogData;
        if (dataToSort.length === 0) return;
        let newDirection;
        if (mc_currentSort.field === field) {
            newDirection = mc_currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            if (field === 'price' || field === 'name') {
                newDirection = 'asc';
            } else if (field === 'newness') {
                newDirection = 'desc';
            }
            else {
                newDirection = 'desc';
            }
        }
        mc_currentSort.field = field;
        mc_currentSort.direction = newDirection;
        mc_applySort(field, newDirection);
        mc_renderCatalogResults(dataToSort);
        mc_updateCatalogSortButtons();
    }

    function mc_updateCatalogSortButtons() {
        const activeField = mc_currentSort.field;
        const activeDirection = mc_currentSort.direction;
        for (const field in mc_sortButtons) {
            const btn = mc_sortButtons[field];
            let baseText = '';
            if (field === 'default') baseText = 'По умолчанию';
            else if (field === 'name') baseText = 'Название';
            else if (field === 'price') baseText = 'Цена';
            else if (field === 'sales') baseText = 'Продажи';
            else if (field === 'newness') baseText = 'Новизна';

            if (field === activeField) {
                const arrow = activeDirection === 'asc' ? ' ▲' : ' ▼';
                btn.classList.add('active');
                btn.textContent = baseText + arrow;
            } else {
                btn.classList.remove('active');
                if (field === 'price' || field === 'name') {
                    btn.textContent = baseText + ' ▲';
                } else if (field === 'newness') {
                     btn.textContent = baseText + ' ▼';
                }
                else {
                    btn.textContent = baseText + ' ▼';
                }
            }
        }
    }

    function mc_applySort(field, direction) {
        const dataToSort = mc_isCatalogCollected ? mc_fullCatalogData : mc_initialCatalogData;
        const dirMultiplier = direction === 'asc' ? 1 : -1;
        dataToSort.sort((a, b) => {
            let valA, valB;
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            let comparisonResult = 0;
            switch (field) {
                case 'price':
                    valA = a.price;
                    valB = b.price;
                    break;
                case 'sales':
                    valA = a.sales;
                    valB = b.sales;
                    break;
                case 'name':
                    comparisonResult = nameA.localeCompare(nameB) * dirMultiplier;
                    break;
                case 'newness':
                    valA = parseInt(a.id, 10);
                    valB = parseInt(b.id, 10);
                    break;
                case 'default':
                    valA = a.originalIndex;
                    valB = b.originalIndex;
                    break;
                default:
                    return 0;
            }
            if (field !== 'name') {
                const fallbackAsc = Infinity;
                const fallbackDesc = -Infinity;
                if (valA === null || valA === undefined || isNaN(valA) || valA === Infinity || valA === -Infinity) valA = direction === 'asc' ? fallbackAsc : fallbackDesc;
                if (valB === null || valB === undefined || isNaN(valB) || valB === Infinity || valB === -Infinity) valB = direction === 'asc' ? fallbackAsc : fallbackDesc;
                if (valA < valB) comparisonResult = -1;
                else if (valA > valB) comparisonResult = 1;
                else comparisonResult = 0;
                comparisonResult *= dirMultiplier;
            }
            if (comparisonResult !== 0) return comparisonResult;
            if (field !== 'name') {
                let nameCompare = nameA.localeCompare(nameB);
                if (nameCompare !== 0) return nameCompare;
            }
            if (field !== 'price') {
                if (a.price < b.price) return -1;
                if (a.price > b.price) return 1;
            }
            if (field !== 'default' && field !== 'newness') {
                 const idA = parseInt(a.id, 10);
                 const idB = parseInt(b.id, 10);
                 if (!isNaN(idA) && !isNaN(idB)) {
                     if (idA < idB) return -1;
                     if (idA > idB) return 1;
                 }
            }
            return String(a.id).localeCompare(String(b.id));
        });
    }

    // --- MegaCatalog: Управление Фильтрами ---
    function mc_getFilterStorageKey(key) {
        return `${MC_FILTER_STORAGE_PREFIX}${key}`;
    }

    function mc_loadFilters() {
        const defaults = {
            priceMin: '',
            priceMax: '',
            salesMin: '',
            salesMax: ''
        };
        let loaded = {};
        for (const key in defaults) {
            loaded[key] = GM_getValue(mc_getFilterStorageKey(key), defaults[key]);
        }
        return loaded;
    }

    function mc_saveFilter(key, value) {
        mc_currentFilters[key] = value;
        GM_setValue(mc_getFilterStorageKey(key), value);
    }

    function mc_applyLoadedFiltersToUI() {
        if (!mc_filtersPanel) return;
        mc_filterPriceMin.value = mc_currentFilters.priceMin;
        mc_filterPriceMax.value = mc_currentFilters.priceMax;
        mc_filterSalesMin.value = mc_currentFilters.salesMin;
        mc_filterSalesMax.value = mc_currentFilters.salesMax;
        const priceHeader = mc_filtersPanel.querySelector('.mc-filterGroup h4');
        if (priceHeader && priceHeader.textContent.includes('Цена')) {
            priceHeader.innerHTML = `Цена ${mc_createResetButtonHTML('price')}`;
            const resetButton = priceHeader.querySelector('.mc-filterResetBtn');
            if (resetButton) resetButton.onclick = mc_handleFilterReset;
        }
    }

    function mc_addFilterEventListeners() {
        if (!mc_filtersPanel) return;
        const debouncedApply = debounce(mc_applyFilters, MS_FILTER_DEBOUNCE_MS);
        mc_filterPriceMin.addEventListener('input', (e) => {
            mc_saveFilter('priceMin', e.target.value);
            debouncedApply();
        });
        mc_filterPriceMax.addEventListener('input', (e) => {
            mc_saveFilter('priceMax', e.target.value);
            debouncedApply();
        });
        mc_filterSalesMin.addEventListener('input', (e) => {
            mc_saveFilter('salesMin', e.target.value);
            debouncedApply();
        });
        mc_filterSalesMax.addEventListener('input', (e) => {
            mc_saveFilter('salesMax', e.target.value);
            debouncedApply();
        });
        mc_resetAllFiltersBtn.addEventListener('click', () => mc_resetAllFilters(true));
        mc_filtersPanel.querySelectorAll('.mc-filterResetBtn').forEach(btn => {
            btn.onclick = mc_handleFilterReset;
        });
    }

    function mc_handleFilterReset(event) {
        const key = event.currentTarget.dataset.filterKey;
        mc_resetFilterByKey(key, true);
    }

    function mc_resetFilterByKey(key, apply = true) {
        switch (key) {
            case 'price':
                mc_saveFilter('priceMin', '');
                if (mc_filterPriceMin) mc_filterPriceMin.value = '';
                mc_saveFilter('priceMax', '');
                if (mc_filterPriceMax) mc_filterPriceMax.value = '';
                break;
            case 'sales':
                mc_saveFilter('salesMin', '');
                if (mc_filterSalesMin) mc_filterSalesMin.value = '';
                mc_saveFilter('salesMax', '');
                if (mc_filterSalesMax) mc_filterSalesMax.value = '';
                break;
        }
        if (apply) mc_applyFilters();
    }

    function mc_resetAllFilters(apply = true) {
        const filterKeys = ['price', 'sales'];
        filterKeys.forEach(key => mc_resetFilterByKey(key, false));
        if (apply) mc_applyFilters();
    }

    function mc_updateFilterPlaceholders() {
        if (!mc_filtersPanel) return;
        const data = mc_isCatalogCollected ? mc_fullCatalogData : mc_initialCatalogData;
        if (!data || data.length === 0) {
            $('#mcFilterPriceMin, #mcFilterPriceMax, #mcFilterSalesMin, #mcFilterSalesMax').attr('placeholder', '-');
            return;
        }
        let minPrice = Infinity,
            maxPrice = -Infinity,
            minSales = Infinity,
            maxSales = -Infinity;
        data.forEach(item => {
            if (item.price !== Infinity && item.price < minPrice) minPrice = item.price;
            if (item.price !== Infinity && item.price > maxPrice) maxPrice = item.price;
            if (item.sales < minSales) minSales = item.sales;
            if (item.sales > maxSales) maxSales = item.sales;
        });
        if (mc_filterPriceMin) mc_filterPriceMin.placeholder = minPrice === Infinity ? '-' : `от ${Math.floor(minPrice)}`;
        if (mc_filterPriceMax) mc_filterPriceMax.placeholder = maxPrice === -Infinity ? '-' : `до ${Math.ceil(maxPrice)}`;
        if (mc_filterSalesMin) mc_filterSalesMin.placeholder = minSales === Infinity ? '-' : `от ${minSales}`;
        if (mc_filterSalesMax) mc_filterSalesMax.placeholder = maxSales === -Infinity ? '-' : `до ${maxSales}`;
    }

    function mc_applyFilters() {
        if (!mc_resultsDiv) return;
        const dataToFilter = mc_isCatalogCollected ? mc_fullCatalogData : mc_initialCatalogData;
        const keywords = mc_exclusionKeywords.map(k => k.toLowerCase());
        const pMin = parseFloat(mc_currentFilters.priceMin) || 0;
        const pMax = parseFloat(mc_currentFilters.priceMax) || Infinity;
        const sMin = parseInt(mc_currentFilters.salesMin, 10) || 0;
        const sMax = parseInt(mc_currentFilters.salesMax, 10) || Infinity;
        let visibleCount = 0;
        const items = mc_resultsDiv.querySelectorAll('.megaCatalogItem');
        items.forEach(itemElement => {
            const itemId = itemElement.dataset.id;
            const itemData = dataToFilter.find(r => String(r.id) === String(itemId));
            if (!itemData) {
                itemElement.classList.add('hidden-by-filter');
                return;
            }
            let shouldHide = false;
            if (keywords.length > 0) {
                const name = (itemData.name || '').toLowerCase();
                if (keywords.some(keyword => name.includes(keyword))) {
                    shouldHide = true;
                }
            }
            if (!shouldHide) {
                const price = itemData.price;
                if (price < pMin || price > pMax) {
                    shouldHide = true;
                }
            }
            if (!shouldHide) {
                const sales = itemData.sales;
                if (sales < sMin || sales > sMax) {
                    shouldHide = true;
                }
            }
            if (shouldHide) {
                itemElement.classList.add('hidden-by-filter');
            } else {
                itemElement.classList.remove('hidden-by-filter');
                visibleCount++;
            }
        });
        const totalCount = dataToFilter.length;
        const anyFilterActive = pMin > 0 || pMax < Infinity || sMin > 0 || sMax < Infinity || keywords.length > 0;
        if (totalCount > 0) {
            if (anyFilterActive) {
                mc_updateStatus(`Показано ${visibleCount} из ${totalCount} товаров (фильтры/исключения применены).`);
            } else if (mc_isCatalogCollected) {
                mc_updateStatus(`Каталог собран. Показано ${totalCount} товаров.`);
            } else {
                mc_updateStatus(`Загружено ${totalCount} товаров (страница 1).`);
            }
        } else if (mc_isCatalogCollected) {
            mc_updateStatus(`Каталог собран, но нет товаров.`);
        } else {
            mc_updateStatus(`Нет товаров на первой странице.`);
        }
        if (visibleCount === 0 && totalCount > 0 && anyFilterActive) {
            mc_statusDiv.textContent += ' Нет товаров, соответствующих критериям.';
        }
    }

    // --- MegaCatalog: Управление Исключениями ---
    function mc_addExclusionKeyword() {
        const keyword = mc_excludeInput.value.trim().toLowerCase();
        if (keyword && !mc_exclusionKeywords.includes(keyword)) {
            mc_exclusionKeywords.push(keyword);
            GM_setValue(MC_EXCLUSION_STORAGE_KEY, mc_exclusionKeywords);
            mc_excludeInput.value = '';
            mc_renderExclusionTags();
            mc_applyFilters();
        }
    }

    function mc_removeExclusionKeyword(keywordToRemove) {
        mc_exclusionKeywords = mc_exclusionKeywords.filter(k => k !== keywordToRemove);
        GM_setValue(MC_EXCLUSION_STORAGE_KEY, mc_exclusionKeywords);
        mc_renderExclusionTags();
        mc_applyFilters();
    }

    function mc_renderExclusionTags() {
        if (!mc_exclusionTagsListDiv) return;
        mc_exclusionTagsListDiv.innerHTML = '';
        mc_exclusionKeywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'mc-exclusionTag exclusionTag';
            tag.textContent = keyword;
            tag.title = `Удалить "${keyword}"`;
            tag.onclick = () => mc_removeExclusionKeyword(keyword);
            mc_exclusionTagsListDiv.appendChild(tag);
        });
    }


    // --- Инициализация скрипта ---
    function initialize() {
        const currentUrl = window.location.href;
        const sellerIdOnPage = getCurrentSellerIdFromUrl();
        const sellerIdInCatalog = getCurrentCatalogSellerIdFromUrl();

        if (sellerIdInCatalog && currentUrl.includes('block_goods_s2.asp')) {
            initCatalogPage();
        } else if (sellerIdOnPage && currentUrl.includes('/seller/')) {
            initSellerPage(sellerIdOnPage);
            initMegaSearchButton();
        } else {
            initMegaSearchButton();
        }
    }

    function initSellerPage(sellerId) {
        console.log("MegaSearch: На странице продавца", sellerId);
        const targetBlock = document.querySelector('.block.d-flex.flex-column.flex-md-row');
        const questionButton = targetBlock ? targetBlock.querySelector('button[onclick*="PopUp"]') : null;
        if (questionButton) {
            if (document.getElementById('megaCatalogLaunchBtn')) return;
            const catalogButton = document.createElement('a');
            catalogButton.className = questionButton.className;
            catalogButton.style.marginLeft = '10px';
            catalogButton.textContent = 'MegaCatalog';
            catalogButton.id = 'megaCatalogLaunchBtn';
            const lang = getCurrentCatalogLangFromUrl() || 'ru';
            const curr = getCurrentCatalogCurrFromUrl() || 'rur';
            catalogButton.href = `${MC_BASE_URL}?id_s=${sellerId}&page=1&rows=${MC_ROWS_PER_PAGE}&curr=${curr}&lang=${lang}`;
            questionButton.parentNode.insertBefore(catalogButton, questionButton.nextSibling);
            console.log("MegaSearch: Кнопка MegaCatalog добавлена.");
        } else {
            console.warn("MegaSearch: Не найдена кнопка 'Задать вопрос' для добавления 'MegaCatalog'.");
        }
    }

    function initMegaSearchButton() {
        const logoLink = document.querySelector('a[href="/"][class*="order-xl-1"]');
        if (logoLink) {
            if (document.getElementById('megaSearchLaunchBtn')) return;
            const megaSearchButton = document.createElement('button');
            megaSearchButton.className = 'button button--accent button--medium';
            megaSearchButton.id = 'megaSearchLaunchBtn';
            megaSearchButton.innerHTML = `<svg class="icon" width="20" height="20"><use xlink:href="/build/sprite.svg#loupe"></use></svg><span style="margin-left: 6px;">MegaSearch</span>`;
            megaSearchButton.onclick = showModal;
            logoLink.parentNode.insertBefore(megaSearchButton, logoLink.nextSibling);
            console.log("MegaSearch: Кнопка MegaSearch добавлена.");
        } else {
            console.warn("MegaSearch Script: Не найден элемент логотипа для добавления кнопки MegaSearch.");
        }
    }

    function addGlobalStyles() {
        GM_addStyle(`
            /* --- Стили MegaSearch --- */
            #megaSearchModal {
            	position: fixed;
            	top: 0;
            	left: 0;
            	width: 100%;
            	height: 100%;
            	background-color: rgba(20, 20, 25, 0.97);
            	z-index: 9999;
            	display: none;
            	color: #eee;
            	font-family: "Inter", sans-serif;
            	overflow-y: auto;
            }

            #megaSearchModal * {
            	box-sizing: border-box;
            }

            #megaSearchContainer {
            	max-width: 1300px;
            	margin: 0 auto;
            	padding: 20px ${MS_SIDE_PANEL_HORIZONTAL_PADDING}px;
            	position: relative;
            	min-height: 100%;
            }

            #megaSearchCloseBtn {
            	position: fixed;
            	top: 15px;
            	right: 20px;
            	font-size: 35px;
            	color: #aaa;
            	background: none;
            	border: none;
            	cursor: pointer;
            	line-height: 1;
            	z-index: 10002;
            }

            #megaSearchCloseBtn:hover {
            	color: #fff;
            }

            #megaSearchHeader {
            	display: flex;
            	align-items: center;
            	gap: 10px;
            	margin-bottom: 20px;
            	flex-wrap: wrap;
            	position: relative;
            	z-index: 5;
            	border-bottom: 1px solid #444;
            	padding-bottom: 15px;
            	padding-left: ${MS_CONTENT_PADDING_LEFT}px;
            	padding-right: ${MS_CONTENT_PADDING_RIGHT}px;
            	margin-left: -${MS_CONTENT_PADDING_LEFT}px;
            	margin-right: -${MS_CONTENT_PADDING_RIGHT}px;
            	flex-shrink: 0;
            }

            .megaSearchInputContainer {
            	position: relative;
            	flex-grow: 0.7;
            	min-width: 150px;
            	flex-basis: 300px;
            }

            #megaSearchInput {
            	width: 100%;
            	padding: 10px 15px;
            	font-size: 16px;
            	background-color: #333;
            	border: 1px solid #555;
            	color: #eee;
            	border-radius: 4px;
            	height: 38px;
            }

            #megaSearchSuggestions {
            	position: absolute;
            	top: 100%;
            	left: 0;
            	right: 0;
            	background-color: #3a3a40;
            	border: 1px solid #555;
            	border-top: none;
            	border-radius: 0 0 4px 4px;
            	max-height: 300px;
            	overflow-y: auto;
            	z-index: 10000;
            	display: none;
            }

            .suggestionItem {
            	padding: 8px 15px;
            	cursor: pointer;
            	color: #eee;
            	font-size: 14px;
            	border-bottom: 1px solid #4a4a50;
            }

            .suggestionItem:last-child {
            	border-bottom: none;
            }

            .suggestionItem:hover {
            	background-color: #4a4a55;
            }

            .megaSearchBtn {
            	padding: 10px 15px;
            	font-size: 14px;
            	color: white;
            	border: none;
            	border-radius: 4px;
            	cursor: pointer;
            	white-space: nowrap;
            	height: 38px;
            	display: inline-flex;
            	align-items: center;
            	justify-content: center;
            	flex-shrink: 0;
            }

            #megaSearchGoBtn {
            	background-color: #4D88FF;
            }

            #megaSearchGoBtn:hover {
            	background-color: #3366CC;
            }

            .megaSearchBtn.sortBtn {
            	background-color: #555;
            	position: relative;
            }

            .megaSearchBtn.sortBtn.active {
            	background-color: #007bff;
            }

            .megaSearchBtn.sortBtn:hover {
            	background-color: #666;
            }

            .megaSearchBtn.sortBtn.active:hover {
            	background-color: #0056b3;
            }

            #resetSortBtn {
            	background-color: #777;
            	margin-right: 5px;
            }

            #resetSortBtn:hover {
            	background-color: #888;
            }

            #resetSortBtn svg {
            	width: 16px;
            	height: 16px;
            	fill: currentColor;
            }

            #megaSearchAdvSortBtnContainer {
            	position: relative;
            	flex-shrink: 0;
            	width: ${MS_ADV_SORT_CONTAINER_WIDTH}px;
            	display: flex;
            	justify-content: center;
            }

            #megaSearchAdvSortBtn {
            	width: 100%;
            	justify-content: center;
            	overflow: hidden;
            	white-space: nowrap;
            	text-overflow: ellipsis;
            }

            #megaSearchCurrencySelect {
            	margin-left: 10px;
            	background-color: #333;
            	color: #eee;
            	border: 1px solid #555;
            	border-radius: 4px;
            	height: 38px;
            	padding: 0 8px;
            	font-size: 14px;
            	cursor: pointer;
            	flex-shrink: 0;
            }

            #megaSearchCurrencySelect:focus {
            	outline: none;
            	border-color: #777;
            }

            #megaSearchAdvSortMenu {
            	display: none;
            	position: absolute;
            	top: 100%;
            	left: 0;
            	background-color: #3a3a40;
            	border: 1px solid #555;
            	border-radius: 4px;
            	min-width: 100%;
            	z-index: 10001;
            	padding: 5px 0;
            	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .megaSearchSortMenuItem {
            	display: block;
            	padding: 8px 15px;
            	color: #eee;
            	font-size: 14px;
            	cursor: pointer;
            	white-space: nowrap;
            }

            .megaSearchSortMenuItem:hover {
            	background-color: #4a4a55;
            }

            .megaSearchSortMenuItem.active {
            	background-color: #007bff;
            	color: white;
            }

            .megaSearchSortMenuItem .sortArrow {
            	display: inline-block;
            	margin-left: 5px;
            	font-size: 12px;
            }

            #megaSearchAdvSortBtnContainer:hover #megaSearchAdvSortMenu {
            	display: block;
            }

            #megaSearchFiltersPanel {
            	position: fixed;
            	left: ${MS_SIDE_PANEL_HORIZONTAL_PADDING}px;
            	top: ${MS_TOP_OFFSET_FOR_SIDE_PANELS}px;
            	width: ${MS_FILTER_PANEL_WIDTH}px;
            	max-height: calc(100vh - ${MS_TOP_OFFSET_FOR_SIDE_PANELS}px - ${MS_BOTTOM_OFFSET_FOR_SIDE_PANELS}px);
            	overflow-y: auto;
            	z-index: 1000;
            	padding: 10px;
            	padding-right: 15px;
            	scrollbar-width: thin;
            	scrollbar-color: #555 #2a2a30;
            	background-color: transparent;
            	transition: top 0.2s ease-in-out;
            }

            #megaSearchFiltersPanel::-webkit-scrollbar {
            	width: 5px;
            }

            #megaSearchFiltersPanel::-webkit-scrollbar-track {
            	background: rgba(42, 42, 48, 0.5);
            	border-radius: 3px;
            }

            #megaSearchFiltersPanel::-webkit-scrollbar-thumb {
            	background-color: #555;
            	border-radius: 3px;
            }

            .filterGroup {
            	margin-bottom: 18px;
            	background-color: transparent !important;
            }

            .filterGroup h4 {
            	font-size: 15px;
            	color: #ddd;
            	margin-bottom: 8px;
            	padding-bottom: 4px;
            	display: flex;
            	justify-content: space-between;
            	align-items: center;
            	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            	font-weight: 500;
            }

            .filterResetBtn {
            	font-size: 12px;
            	color: #aaa;
            	background: none;
            	border: none;
            	cursor: pointer;
            	padding: 0 3px;
            	line-height: 1;
            }

            .filterResetBtn:hover {
            	color: #fff;
            }

            .filterResetBtn svg {
            	width: 14px;
            	height: 14px;
            	vertical-align: middle;
            	fill: currentColor;
            }

            .filterRangeInputs {
            	display: flex;
            	gap: 8px;
            	align-items: center;
            }

            .filterRangeInputs input[type="number"] {
            	width: calc(50% - 4px);
            	padding: 6px 8px;
            	font-size: 13px;
            	background-color: rgba(51, 51, 51, 0.85);
            	border: 1px solid #666;
            	color: #eee;
            	border-radius: 3px;
            	height: 30px;
            	text-align: center;
            	-moz-appearance: textfield;
            	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
            }

            .filterRangeInputs input[type="number"]::-webkit-outer-spin-button,
            .filterRangeInputs input[type="number"]::-webkit-inner-spin-button {
            	-webkit-appearance: none;
            	margin: 0;
            }

            .filterRangeInputs input[type="number"]::placeholder {
            	color: #999;
            	font-size: 11px;
            	text-align: center;
            }

            .filterCheckbox,
            .filterSelect {
            	margin-bottom: 8px;
            }

            .filterCheckbox label {
            	display: flex;
            	align-items: center;
            	font-size: 14px;
            	cursor: pointer;
            	color: #ccc;
            	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            }

            .filterCheckbox input[type="checkbox"] {
            	margin-right: 8px;
            	width: 16px;
            	height: 16px;
            	accent-color: #007bff;
            	cursor: pointer;
            	flex-shrink: 0;
            }

            .filterSelect select {
            	width: 100%;
            	padding: 6px 8px;
            	font-size: 13px;
            	background-color: rgba(51, 51, 51, 0.85);
            	border: 1px solid #666;
            	color: #eee;
            	border-radius: 3px;
            	height: 30px;
            	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
            }

            #resetAllFiltersBtn {
            	width: 100%;
            	margin-top: 10px;
            	padding: 8px 10px;
            	height: auto;
            	background-color: rgba(108, 117, 125, 0.8);
            	border: 1px solid #888;
            	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
            }

            #resetAllFiltersBtn:hover {
            	background-color: rgba(90, 98, 104, 0.9);
            }

            #megaSearchResultsContainer {
            	position: relative;
            	padding-left: ${MS_CONTENT_PADDING_LEFT}px;
            	padding-right: ${MS_CONTENT_PADDING_RIGHT}px;
            	margin-left: -${MS_CONTENT_PADDING_LEFT}px;
            	margin-right: -${MS_CONTENT_PADDING_RIGHT}px;
            }

            #megaSearchResults {
            	display: flex;
            	flex-wrap: wrap;
            	gap: 15px;
            	justify-content: flex-start;
            	padding-top: 10px;
            }

            #megaSearchResultsStatus {
            	width: 100%;
            	text-align: center;
            	font-size: 18px;
            	color: #aaa;
            	padding: 50px 0;
            }

            #megaSearchExclusionTags {
            	position: fixed;
            	top: ${MS_TOP_OFFSET_FOR_SIDE_PANELS}px;
            	right: ${MS_SIDE_PANEL_HORIZONTAL_PADDING}px;
            	width: ${MS_EXCLUSION_PANEL_WIDTH}px;
            	max-height: calc(100vh - ${MS_TOP_OFFSET_FOR_SIDE_PANELS}px - ${MS_BOTTOM_OFFSET_FOR_SIDE_PANELS}px);
            	overflow-y: auto;
            	z-index: 1000;
            	display: flex;
            	flex-direction: column;
            	gap: 10px;
            	padding: 10px;
            	scrollbar-width: thin;
            	scrollbar-color: #555 #2a2a30;
            	background-color: transparent;
            	transition: top 0.2s ease-in-out;
            }

            #megaSearchExclusionTags::-webkit-scrollbar {
            	width: 5px;
            }

            #megaSearchExclusionTags::-webkit-scrollbar-track {
            	background: rgba(42, 42, 48, 0.5);
            	border-radius: 3px;
            }

            #megaSearchExclusionTags::-webkit-scrollbar-thumb {
            	background-color: rgba(85, 85, 85, 0.7);
            	border-radius: 3px;
            }

            .exclusionInputGroup {
            	display: flex;
            	align-items: stretch;
            	border: 1px solid #555;
            	border-radius: 4px;
            	background-color: rgba(51, 51, 51, 0.85);
            	overflow: hidden;
            	height: 34px;
            	flex-shrink: 0;
            	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
            }

            .exclusionInputGroup #megaSearchExcludeInput {
            	padding: 6px 10px;
            	font-size: 13px;
            	background-color: transparent;
            	border: none;
            	color: #eee;
            	outline: none;
            	border-radius: 0;
            	flex-grow: 1;
            	width: auto;
            	height: auto;
            }

            .exclusionInputGroup #megaSearchAddExcludeBtn {
            	display: flex;
            	align-items: center;
            	justify-content: center;
            	padding: 0 10px;
            	background-color: #555;
            	border: none;
            	border-left: 1px solid #555;
            	cursor: pointer;
            	border-radius: 0;
            	color: #eee;
            	height: auto;
            }

            .exclusionInputGroup #megaSearchAddExcludeBtn:hover {
            	background-color: #666;
            }

            .exclusionInputGroup #megaSearchAddExcludeBtn svg {
            	width: 16px;
            	height: 16px;
            	fill: currentColor;
            }

            #exclusionTagsList {
            	display: flex;
            	flex-direction: row;
            	flex-wrap: wrap;
            	align-content: flex-start;
            	gap: 8px;
            	overflow-y: auto;
            	flex-grow: 1;
            }

            .exclusionTag {
            	display: inline-block;
            	background-color: rgba(70, 70, 80, 0.9);
            	color: #ddd;
            	padding: 5px 10px;
            	border-radius: 15px;
            	font-size: 13px;
            	cursor: pointer;
            	transition: background-color 0.2s;
            	border: 1px solid rgba(100, 100, 110, 0.9);
            	white-space: nowrap;
            	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
            }

            .exclusionTag:hover {
            	background-color: rgba(220, 53, 69, 0.9);
            	border-color: rgba(200, 40, 50, 0.95);
            	color: #fff;
            }

            .exclusionTag::after {
            	content: ' ×';
            	font-weight: bold;
            	margin-left: 4px;
            }

            .megaSearchItem {
            	background-color: #2a2a30;
            	border-radius: 8px;
            	padding: 10px;
            	width: calc(20% - 12px);
            	min-width: 160px;
            	display: flex;
            	flex-direction: column;
            	transition: transform 0.2s ease;
            	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            	position: relative;
            	color: #ccc;
            	font-size: 13px;
            	min-height: 340px;
            }

            .megaSearchItem:hover {
            	transform: translateY(-3px);
            	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .megaSearchItem a {
            	text-decoration: none;
            	color: inherit;
            	display: flex;
            	flex-direction: column;
            	height: 100%;
            }

            .megaSearchItem .card-image-wrapper {
            	position: relative;
            	width: 100%;
            	aspect-ratio: 1 / 1;
            	margin-bottom: 8px;
            }

            .megaSearchItem img {
            	position: absolute;
            	top: 0;
            	left: 0;
            	width: 100%;
            	height: 100%;
            	object-fit: cover;
            	border-radius: 6px;
            	background-color: #444;
            }

            .newItemBadge {
            	position: absolute;
            	top: 4px;
            	left: 4px;
            	background-color: #f54848;
            	color: white;
            	padding: 1px 5px;
            	font-size: 10px;
            	border-radius: 3px;
            	font-weight: bold;
            	z-index: 1;
            }

            .megaSearchItem .price {
            	font-size: 16px;
            	font-weight: 700;
            	color: #6cff5c;
            	margin-bottom: 5px;
            }

            .megaSearchItem .title {
            	font-size: 13px;
            	font-weight: 500;
            	line-height: 1.3;
            	height: 3.9em;
            	overflow: hidden;
            	text-overflow: ellipsis;
            	margin-bottom: 6px;
            	color: #eee;
            	display: -webkit-box;
            	-webkit-line-clamp: 3;
            	-webkit-box-orient: vertical;
            }

            .cardInfoContainer {
            	margin-top: auto;
            	padding-top: 6px;
            }

            .cardInfoRow1,
            .cardInfoRow2 {
            	display: flex;
            	justify-content: space-between;
            	flex-wrap: nowrap;
            	gap: 8px;
            	font-size: 12px;
            	color: #bbb;
            	margin-bottom: 4px;
            }

            .cardInfoRow1 span,
            .cardInfoRow2 span {
            	white-space: nowrap;
            	overflow: hidden;
            	text-overflow: ellipsis;
            	flex-shrink: 1;
            }

            .cardInfoRow1 span:first-child,
            .cardInfoRow2 span:first-child {
            	flex-shrink: 0;
            	margin-right: auto;
            }

            .sellerLink {
            	display: block;
            	font-size: 12px;
            	color: #bbb;
            	text-decoration: none;
            	margin-bottom: 4px;
            	white-space: nowrap;
            	overflow: hidden;
            	text-overflow: ellipsis;
            }

            .sellerLink:hover {
            	color: #ddd;
            	text-decoration: underline;
            }

            .reviewsGood {
            	color: #6cff5c;
            }

            .reviewsBad {
            	color: #f54848;
            	margin-left: 2px;
            }

            .megaSearchItem .buyButton {
            	display: block;
            	text-align: center;
            	padding: 8px;
            	margin-top: 8px;
            	background-color: #007bff;
            	color: white;
            	border-radius: 4px;
            	font-size: 13px;
            	font-weight: 600;
            }

            .megaSearchItem .buyButton:hover {
            	background-color: #0056b3;
            }

            .hidden-by-filter {
            	display: none !important;
            }

            @media (max-width: 1600px) {
            	.megaSearchItem {
            		width: calc(25% - 12px);
            	}
            }

            @media (max-width: 1250px) {
            	.megaSearchItem {
            		width: calc(33.33% - 10px);
            	}
            }

            @media (max-width: 950px) {
            	.megaSearchItem {
            		width: calc(50% - 8px);
            	}
            }

            @media (max-width: 850px) {

            	#megaSearchFiltersPanel,
            	#megaSearchExclusionTags,
            	#mcFiltersPanel,
            	#mcExclusionPanel {
            		display: none;
            	}

            	#megaSearchHeader,
            	#megaSearchResultsContainer,
            	#megaCatalogHeader,
            	#megaCatalogResults {
            		padding-left: 0;
            		padding-right: 0;
            		margin-left: 0;
            		margin-right: 0;
            	}

            	.megaSearchItem,
            	.megaCatalogItem {
            		width: calc(50% - 8px);
            	}

            	#megaSearchHeader {
            		gap: 5px;
            	}

            	.megaSearchInputContainer {
            		min-width: 150px;
            	}

            	#megaSearchAdvSortBtnContainer {
            		width: auto;
            		min-width: 150px;
            	}
            }

            @media (max-width: 575px) {

            	.megaSearchItem,
            	.megaCatalogItem {
            		width: 100%;
            	}

            	#megaSearchHeader {
            		align-items: center;
            	}

            	#megaSearchCurrencySelect,
            	#megaSearchAdvSortBtnContainer {
            		margin-left: 0;
            		margin-top: 5px;
            	}

            	#megaSearchContainer,
            	#megaCatalogContainer {
            		padding-left: 10px;
            		padding-right: 10px;
            	}

            	#mcHeaderDiv {
            		flex-direction: column;
            		align-items: stretch;
            	}
            }

            #megaSearchLaunchBtn {
            	vertical-align: middle;
            	padding-top: 0;
            	padding-bottom: 0;
            	height: 40px;
            	line-height: 40px;
            	gap: 6px;
            	margin-left: 20px !important;
            }

            #megaSearchLaunchBtn .icon {
            	width: 20px;
            	height: 20px;
            	fill: currentColor;
            }

            /* --- Стили MegaCatalog --- */
            body.mc-redesigned {
            	background-color: #1f1f23 !important;
            	color: #eee !important;
            	font-family: "Inter", sans-serif !important;
            	padding-top: 20px !important;
            	/* Отступ сверху */
            }

            #megaCatalogContainer {
            	max-width: 1400px;
            	margin: 0 auto;
            	padding: 0 ${MC_SIDE_PANEL_HORIZONTAL_PADDING}px;
            	/* Только гориз. отступы от края */
            	position: relative;
            }

            #megaCatalogHeader {
            	display: flex;
            	flex-wrap: wrap;
            	align-items: center;
            	gap: 15px;
            	margin-bottom: 20px;
            	padding-bottom: 15px;
            	border-bottom: 1px solid #444;
            	/* Отступы для контента от боковых панелей */
            	padding-left: ${MC_CONTENT_PADDING_LEFT}px;
            	padding-right: ${MC_CONTENT_PADDING_RIGHT}px;
            	margin-left: -${MC_CONTENT_PADDING_LEFT}px;
            	/* Компенсация */
            	margin-right: -${MC_CONTENT_PADDING_RIGHT}px;
            	/* Компенсация */
            }

            .mc-sort-container {
            	display: flex;
            	gap: 8px;
            	flex-wrap: wrap;
            }

            .megaCatalogBtn {
            	padding: 8px 14px;
            	font-size: 14px;
            	color: white;
            	background-color: #555;
            	border: none;
            	border-radius: 4px;
            	cursor: pointer;
            	white-space: nowrap;
            }

            .megaCatalogBtn:hover {
            	background-color: #666;
            }

            .megaCatalogBtn.active {
            	background-color: #007bff;
            }

            .megaCatalogBtn.accent {
            	background-color: #4D88FF;
            }

            .megaCatalogBtn.accent:hover {
            	background-color: #3366CC;
            }

            .megaCatalogBtn:disabled {
            	background-color: #444;
            	color: #888;
            	cursor: not-allowed;
            }

            #megaCatalogStatus {
            	margin-left: auto;
            	color: #bbb;
            	font-size: 14px;
            	align-self: center;
            }

            #mcProgressBar {
            	width: 200px;
            	height: 20px;
            	background-color: #444;
            	border-radius: 4px;
            	overflow: hidden;
            	margin-left: 15px;
            	align-self: center;
            }

            #mcProgressBarInner {
            	width: 0%;
            	height: 100%;
            	background-color: ${MC_PROGRESS_BAR_COLOR};
            	color: white;
            	text-align: center;
            	line-height: 20px;
            	font-size: 12px;
            	font-weight: bold;
            	transition: width 0.3s ease;
            }

            #megaCatalogResults {
            	display: flex;
            	flex-wrap: wrap;
            	gap: 15px;
            	justify-content: flex-start;
            	padding-left: ${MC_CONTENT_PADDING_LEFT}px;
            	padding-right: ${MC_CONTENT_PADDING_RIGHT}px;
            	margin-left: -${MC_CONTENT_PADDING_LEFT}px;
            	margin-right: -${MC_CONTENT_PADDING_RIGHT}px;
            }

            .megaCatalogItem {
            	background-color: #2a2a30;
            	border-radius: 8px;
            	padding: 10px;
            	width: calc(25% - 130px);
            	min-width: 190px;
            	min-height: 320px;
            	display: flex;
            	flex-direction: column;
            	transition: transform 0.2s ease;
            	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            	position: relative;
            	color: #ccc;
            	font-size: 13px;
            }

            .megaCatalogItem:hover {
            	transform: translateY(-3px);
            	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .megaCatalogItem a {
            	text-decoration: none;
            	color: inherit;
            	display: flex;
            	flex-direction: column;
            	height: 100%;
            }

            .megaCatalogItem .card-image-wrapper {
            	position: relative;
            	width: 100%;
            	aspect-ratio: 1 / 1;
            	margin-bottom: 8px;
            }

            .megaCatalogItem img {
            	position: absolute;
            	top: 0;
            	left: 0;
            	width: 100%;
            	height: 100%;
            	object-fit: cover;
            	border-radius: 6px;
            	background-color: #444;
            }

            .megaCatalogItem .price {
            	font-size: 16px;
            	font-weight: 700;
            	color: #6cff5c;
            	margin-bottom: 5px;
            }

            .megaCatalogItem .title {
            	font-size: 13px;
            	font-weight: 500;
            	line-height: 1.3;
            	height: 3.9em;
            	overflow: hidden;
            	text-overflow: ellipsis;
            	margin-bottom: 6px;
            	color: #eee;
            	display: -webkit-box;
            	-webkit-line-clamp: 3;
            	-webkit-box-orient: vertical;
            }

            .megaCatalogItem .cardInfoContainer {
            	margin-top: auto;
            	padding-top: 6px;
            }

            .megaCatalogItem .cardInfoRow1 {
            	display: flex;
            	justify-content: space-between;
            	flex-wrap: nowrap;
            	gap: 8px;
            	font-size: 12px;
            	color: #bbb;
            	margin-bottom: 4px;
            }

            .megaCatalogItem .sales {
            	white-space: nowrap;
            	overflow: hidden;
            	text-overflow: ellipsis;
            }

            .megaCatalogItem .buyButton {
            	display: block;
            	text-align: center;
            	padding: 8px;
            	margin-top: 8px;
            	background-color: #007bff;
            	color: white;
            	border-radius: 4px;
            	font-size: 13px;
            	font-weight: 600;
            }

            .megaCatalogItem .buyButton:hover {
            	background-color: #0056b3;
            }

            /* --- Стили Фильтров/Исключений Каталога --- */
            #mcFiltersPanel {
            	position: fixed;
            	left: ${MC_SIDE_PANEL_HORIZONTAL_PADDING}px;
            	top: ${MC_TOP_OFFSET_FOR_SIDE_PANELS}px;
            	width: ${MC_FILTER_PANEL_WIDTH}px;
            	max-height: calc(100vh - ${MC_TOP_OFFSET_FOR_SIDE_PANELS}px - ${MC_BOTTOM_OFFSET_FOR_SIDE_PANELS}px);
            	overflow-y: auto;
            	z-index: 1000;
            	padding: 10px;
            	padding-right: 15px;
            	scrollbar-width: thin;
            	scrollbar-color: #555 #2a2a30;
            	background-color: transparent;
            	transition: top 0.2s ease-in-out;
            }

            #mcFiltersPanel::-webkit-scrollbar {
            	width: 5px;
            }

            #mcFiltersPanel::-webkit-scrollbar-track {
            	background: rgba(42, 42, 48, 0.5);
            	border-radius: 3px;
            }

            #mcFiltersPanel::-webkit-scrollbar-thumb {
            	background-color: #555;
            	border-radius: 3px;
            }

            .mc-filterGroup {
            	margin-bottom: 18px;
            }

            /* Используем MC префикс */
            .mc-filterGroup h4 {
            	font-size: 15px;
            	color: #ddd;
            	margin-bottom: 8px;
            	padding-bottom: 4px;
            	display: flex;
            	justify-content: space-between;
            	align-items: center;
            	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            	font-weight: 500;
            }

            #mcResetAllFiltersBtn {
            	width: 100%;
            	margin-top: 10px;
            }

            #mcExclusionPanel {
            	position: fixed;
            	top: ${MC_TOP_OFFSET_FOR_SIDE_PANELS}px;
            	right: ${MC_SIDE_PANEL_HORIZONTAL_PADDING}px;
            	width: ${MC_EXCLUSION_PANEL_WIDTH}px;
            	max-height: calc(100vh - ${MC_TOP_OFFSET_FOR_SIDE_PANELS}px - ${MC_BOTTOM_OFFSET_FOR_SIDE_PANELS}px);
            	overflow-y: auto;
            	z-index: 1000;
            	display: flex;
            	flex-direction: column;
            	gap: 10px;
            	padding: 10px;
            	scrollbar-width: thin;
            	scrollbar-color: #555 #2a2a30;
            	background-color: transparent;
            	transition: top 0.2s ease-in-out;
            }

            #mcExclusionPanel::-webkit-scrollbar {
            	width: 5px;
            }

            #mcExclusionPanel::-webkit-scrollbar-track {
            	background: rgba(42, 42, 48, 0.5);
            	border-radius: 3px;
            }

            #mcExclusionPanel::-webkit-scrollbar-thumb {
            	background-color: rgba(85, 85, 85, 0.7);
            	border-radius: 3px;
            }

            .mc-exclusionInputGroup {
            	display: flex;
            	align-items: stretch;
            	border: 1px solid #555;
            	border-radius: 4px;
            	background-color: rgba(51, 51, 51, 0.85);
            	overflow: hidden;
            	height: 34px;
            	flex-shrink: 0;
            	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
            }

            .mc-exclusionInputGroup #mcExcludeInput {
            	padding: 6px 10px;
            	font-size: 13px;
            	background-color: transparent;
            	border: none;
            	color: #eee;
            	outline: none;
            	border-radius: 0;
            	flex-grow: 1;
            	width: auto;
            	height: auto;
            }

            .mc-exclusionInputGroup #mcAddExcludeBtn {
            	display: flex;
            	align-items: center;
            	justify-content: center;
            	padding: 0 10px;
            	background-color: #555;
            	border: none;
            	border-left: 1px solid #555;
            	cursor: pointer;
            	border-radius: 0;
            	color: #eee;
            	height: auto;
            }

            .mc-exclusionInputGroup #mcAddExcludeBtn:hover {
            	background-color: #666;
            }

            .mc-exclusionInputGroup #mcAddExcludeBtn svg {
            	width: 16px;
            	height: 16px;
            	fill: currentColor;
            }

            #mcExclusionTagsList {
            	display: flex;
            	flex-direction: row;
            	flex-wrap: wrap;
            	align-content: flex-start;
            	gap: 8px;
            	overflow-y: auto;
            	flex-grow: 1;
            }

            .mc-exclusionTag {
            }

            /* Адаптивность карточек каталога */
            @media (max-width: 1400px) {
            	.megaCatalogItem {
            		width: calc(33.33% - 10px);
            	}
            }

            @media (max-width: 1000px) {
            	.megaCatalogItem {
            		width: calc(50% - 8px);
            	}
            }

            @media (max-width: 850px) {
            	.megaCatalogItem {
            		width: calc(50% - 8px);
            	}
            }

            @media (max-width: 575px) {
            	.megaCatalogItem {
            		width: 100%;
            	}
            }

        `);
    }

    // --- Запуск скрипта ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();