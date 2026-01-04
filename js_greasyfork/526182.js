// ==UserScript==
// @name         SteamDB - Sales; Ultimate Enhancer
// @namespace    https://steamdb.info/
// @version      1.4.1
// @description  Комплексное улучшение для SteamDB: фильтры по языкам, спискам, дате, РРЦ, конвертация валют, расширенная информация об играх, калькулятор желаемого, фильтры по % от ист. минимума.
// @author       0wn3df1x
// @license      MIT
// @include      https://steamdb.info/sales/*
// @include      https://steamdb.info/stats/mostfollowed/*
// @include      https://steamdb.info/stats/pricesnotavailable/*
// @include      https://steamdb.info/publisher/*
// @include      https://steamdb.info/developer/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.steampowered.com
// @connect      gist.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/526182/SteamDB%20-%20Sales%3B%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/526182/SteamDB%20-%20Sales%3B%20Ultimate%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scriptsConfig = {
        toggleEnglishLangInfo: false
    };
    const API_URL = "https://api.steampowered.com/IStoreBrowseService/GetItems/v1";
    const BATCH_SIZE = 200;
    const HOVER_DELAY = 300;
    const REQUEST_DELAY = 200;
    const DEFAULT_EXCHANGE_RATE = 0.19;
    const PAGE_RELOAD_DELAY = 3000;

    let collectedAppIds = new Set();
    let tooltip = null;
    let hoverTimer = null;
    let gameData = {};
    let activeLanguageFilter = null;
    let totalGamesOnPage = 0;
    let processedRuGames = 0;
    let processedUsGames = 0;
    let processedSingleStageGames = 0;

    let progressContainer = null;
    let requestQueue = [];
    let isProcessingQueue = false;
    let currentExchangeRate = DEFAULT_EXCHANGE_RATE;
    let activeListFilter = false;
    let activeDateFilterTimestamp = null;
    let isProcessingStarted = false;
    let processButton = null;
    let currentProcessingStage = '';

    let isRuModeActive = false;
    let activeRrcFilters = {
        lower: false,
        equal: false,
        higher: false
    };

    let activeShowDiscountFilters = { blue: false, green: false, purple: false };
    let activeHideDiscountFilters = { blue: false, green: false, purple: false };

    let activeShowAtlPercentFilters = { cheaper: false, equal: false, more_expensive: false };
    let activeHideAtlPercentFilters = { cheaper: false, equal: false, more_expensive: false };

    let reviewFilters = {
        minCount: null,
        maxCount: null,
        minRating: null,
        maxRating: null
    };
    let earlyAccessFilter = 'none';
    let isTotalSortEnabled = false;
    let debounceTimer;
    let activeTagFilters = {};
    let allTags = [];

    const PROCESS_BUTTON_TEXT = {
        idle: "Обработать игры",
        processing_ru: "Сбор RU данных...",
        processing_us: "Сбор US данных...",
        processing_single: "Сбор данных...",
        done: "Обработка завершена",
        calculate_wishlist_idle: "Высчитать"
    };

    const STATUS_TEXT = {
        ready_to_process: "Нажмите обработать игры для начала работы",
        processing_ru: "Идет сбор RU данных...",
        processing_us: "Идет сбор US данных...",
        processing_single: "Идет сбор данных...",
        processing_rrc: "Расчет РРЦ...",
        done: "Обработка завершена. Фильтры применены.",
        done_no_rrc: "Обработка данных завершена.",
        rrc_disabled: "Нажмите обработать игры для начала работы (РРЦ анализ доступен только для российской валюты)",
        error: "Произошла ошибка.",
        changing_entries_prefix: "Меняем на All... ",
        calculating_wishlist: "Анализ цен желаемого..."
    };

    const styles = `
    .steamdb-enhancer * { box-sizing: border-box; margin: 0; padding: 0; }
    .steamdb-enhancer { background: #16202d; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); padding: 12px; width: auto; margin-top: 5px; margin-bottom: 15px; max-width: 900px; }
    .enhancer-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; flex-wrap: wrap; }
    .row-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin-bottom: 12px; }
    .row-layout.compact { gap: 8px; margin-bottom: 0; }
    .control-group { background: #1a2635; border-radius: 6px; padding: 10px; margin: 6px 0; }
    .group-title { color: #66c0f4; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
    .btn-group { display: flex; flex-wrap: wrap; gap: 5px; }
    .btn { background: #2a3a4d; border: 1px solid #354658; border-radius: 4px; color: #c6d4df; cursor: pointer; font-size: 12px; padding: 5px 10px; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; white-space: nowrap; }
    .btn:hover { background: #31455b; border-color: #3d526b; }
    .btn.active { background: #66c0f4 !important; border-color: #66c0f4 !important; color: #1b2838 !important; }
    .btn-icon { width: 12px; height: 12px; fill: currentColor; }
    .progress-container { background: #1a2635; border-radius: 4px; height: 6px; overflow: hidden; margin: 10px 0 5px; }
    .progress-text { display: flex; justify-content: space-between; color: #8f98a0; font-size: 11px; margin: 4px 2px 0; }
    .progress-count { flex: 1; text-align: left; }
    .progress-percent { flex: 1; text-align: right; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, #66c0f4 0%, #4d9cff 100%); transition: width 0.3s ease; }
    .converter-group { display: flex; gap: 6px; flex: 1; }
    .input-field { background: #1a2635; border: 1px solid #2a3a4d; border-radius: 4px; color: #c6d4df; font-size: 12px; padding: 5px 8px; min-width: 60px; width: 80px; }
    .date-picker { background: #1a2635; border: 1px solid #2a3a4d; border-radius: 4px; color: #c6d4df; font-size: 12px; padding: 5px; width: 120px; }
    .status-indicator { display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 5px 8px; border-radius: 4px; color: #8f98a0;}
    .status-indicator.status-active { color: #66c0f4; }
    .steamdb-tooltip { position: absolute; background: #1b2838; color: #c6d4df; padding: 15px; border-radius: 3px; width: 320px; font-size: 14px; line-height: 1.5; box-shadow: 0 0 12px rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 9999; display: none; }
    .tooltip-arrow { position: absolute; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; }
    .group-top { margin-bottom: 8px; }
    .group-middle { margin-bottom: 12px; }
    .group-bottom { margin-bottom: 15px; }
    .tooltip-row { margin-bottom: 4px; }
    .tooltip-row.compact { margin-bottom: 2px; }
    .tooltip-row.spaced { margin-bottom: 10px; }
    .tooltip-row.language { margin-bottom: 8px; }
    .tooltip-row.description { margin-top: 15px; padding-top: 10px; border-top: 1px solid #2a3a4d; color: #8f98a0; font-style: italic; }
    .positive { color: #66c0f4; }
    .mixed { color: #997a00; }
    .negative { color: #a74343; }
    .no-reviews { color: #929396; }
    .language-yes { color: #66c0f4; }
    .language-no { color: #a74343; }
    .early-access-yes { color: #66c0f4; }
    .early-access-no { color: #929396; }
    .no-data { color: #929396; }
    tr.app td:first-child { position: relative; }
    .filter-submit-wrap {
        position: static !important;
    }

    .rrc-display-container {
        position: absolute;
        width: 100px;
        left: -100px;
        top: -1px;
        height: 100%;
        box-sizing: border-box;
        background-color: var(--body-bg-color, #161920);
        border-top: 1px solid var(--border-color-2, hsl(216, 25%, 16%));
        border-left: none;
        border-right: none;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0;
        font-size: 11px;
        color: var(--body-color, #ddd);
        text-align: center;
        white-space: normal;
        overflow: hidden;
        z-index: 3;
        pointer-events: none;
    }
    .rrc-display-container .rrc-content-wrapper { padding: 1px 3px; }
    .rrc-display-container .rrc-text { font-weight: 700; font-style: normal; padding: 1px 5px; border-radius: 3px; display: inline-block; line-height: 1.2; margin-bottom: 2px; }
    .rrc-display-container .rrc-text.equal { background-color: #4c6b22 !important; color: #c0ef15 !important; }
    .rrc-display-container .rrc-text.higher { background-color: #cb2431 !important; color: #fde2e4 !important; }
    .rrc-display-container .rrc-text.lower { background-color: #1566b7 !important; color: #d1e5fa !important; }
    .rrc-display-container .rrc-details { color: var(--muted-color, #999); font-size: 10px; line-height: 1.1; display: block; }
    .rrc-display-container .rrc-no-data { color: var(--muted-color, #999); font-style: italic; font-size: 11px; padding: 2px 0; }
    #rrc-filter-group.disabled-filter { opacity: 0.5; pointer-events: none; }
    #rrc-filter-group.disabled-filter .btn { cursor: not-allowed; }

    .steamdb-custom-discount-filters { display: flex; flex-direction: column; gap: 0px; margin-top: 0px; }
    .steamdb-custom-discount-filters .filter-block-title { color: #c6d4df; font-size: 14px; font-weight: 500; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #2a3f5a;}
    .steamdb-custom-discount-filters .filter-block-subtitle { color: #a0b0c0; font-size: 13px; font-weight: 400; margin-top: 10px; margin-bottom: 6px; }

    .discount-filter-row-steamdb {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 1px 0;
        font-size: 13px;
        min-height: 24px;
    }
    .discount-filter-row-steamdb .steamy-checkbox-control {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #9fbbcb;
        cursor: pointer;
        font-weight: normal;
        padding: 0;
        white-space: nowrap;
    }
    .discount-filter-row-steamdb .steamy-checkbox-control:hover,
    .discount-filter-row-steamdb .steamy-checkbox-control:focus-within {
        color: #fff;
    }
    .discount-filter-row-steamdb .steamy-checkbox-control input[type="checkbox"] {
        margin: 0 4px 0 0;
        vertical-align: middle;
    }
    .discount-filter-row-steamdb .steamy-checkbox-control:first-of-type {
        justify-self: start;
        padding-left: 0;
    }
    .discount-filter-label-text-steamdb {
        text-align: left;
        padding-left: 5px;
        color: #c6d4df;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: normal;
        vertical-align: middle;
    }
    .discount-filter-row-steamdb .steamy-checkbox-control:last-of-type {
        justify-self: end;
    }
    .tooltipped-blue input[type="checkbox"]:checked { accent-color: #1566b7; }
    .tooltipped-green input[type="checkbox"]:checked { accent-color: #4c6b22; }
    .tooltipped-purple input[type="checkbox"]:checked { accent-color: #74002d; }

    .steamy-checkbox-control.active { }
    #wishlist-calculator-group .group-title { font-size: 11px; color: #a0a0a0; text-transform: none; margin-bottom: 6px; }
    #wishlist-calculator-group .btn { width: 100%; justify-content: center; }

    .atl-percent-text { padding: 1px 3px; border-radius: 2px; font-weight: bold; }
    .atl-percent-text.cheaper { background-color: #1566b7 !important; color: #d1e5fa !important; }
    .atl-percent-text.equal { background-color: #4c6b22 !important; color: #c0ef15 !important; }
    .atl-percent-text.more_expensive { background-color: #74002d !important; color: #dfccff !important; }

    .tag-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10001; display: none; justify-content: center; align-items: center; }
    .tag-modal { background: #1b2838; color: #c6d4df; padding: 20px; border-radius: 6px; width: 500px; max-width: 90%; box-shadow: 0 5px 20px rgba(0,0,0,0.4); }
    .tag-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #2a3a4d; padding-bottom: 10px; }
    .tag-modal-header h2 { color: #66c0f4; margin: 0; font-size: 18px; }
    .tag-modal-close { background: none; border: none; color: #c6d4df; font-size: 24px; cursor: pointer; line-height: 1; padding: 0 5px; }
    .tag-modal-close:hover { color: #66c0f4; }
    .tag-search-input { width: 100%; background: #1a2635; border: 1px solid #2a3a4d; border-radius: 4px; color: #c6d4df; font-size: 14px; padding: 8px; margin-bottom: 10px; }
    .tag-search-results { max-height: 150px; overflow-y: auto; border: 1px solid #2a3a4d; border-radius: 4px; }
    .tag-search-result-item { padding: 8px; cursor: pointer; border-bottom: 1px solid #2a3a4d; }
    .tag-search-result-item:last-child { border-bottom: none; }
    .tag-search-result-item:hover { background: #2a3a4d; }
    .active-tag-filters-container { margin-top: 15px; }
    .active-tag-filter-row { display: flex; align-items: center; gap: 10px; background: #2a3a4d; padding: 8px; border-radius: 4px; margin-bottom: 8px; }
    .active-tag-filter-row span { flex-grow: 1; }
    .active-tag-filter-row input { width: 60px; text-align: center; }
    .active-tag-filter-row .btn-remove-tag { background-color: #a74343; font-size: 11px; padding: 3px 8px; }
    .tag-modal-footer { margin-top: 20px; text-align: right; }
    `;

    function extractAndDisplayGameDataSteamStyle() {
        const sourceTable = document.querySelector('table.table-sales.dataTable, table#DataTables_Table_0');
        if (!sourceTable) {
            alert('Исходная таблица не найдена!');
            return;
        }

        const rows = sourceTable.querySelectorAll('tbody tr.app');
        const gamesData = [];
        let totalApproximateFullPriceSum = 0;
        let totalCalculatedBestPriceSum = 0;
        let currentSortConfig = { columnKey: null, direction: 'asc' };

        function parseRawPrice(priceString) {
            if (typeof priceString !== 'string' && typeof priceString !== 'number') return null;
            let cleanedString = String(priceString).replace(/[^0-9,.]/g, '').replace(',', '.');
            if (cleanedString === '') return null;
            let price = parseFloat(cleanedString);
            return isNaN(price) ? null : price;
        }

        function formatPriceDisplay(value) {
            if (value === null || typeof value === 'undefined') {
                return 'N/A';
            }
            return Number(value).toFixed(2);
        }

        function extractPriceAfterLabel(text, label) {
            if (typeof text !== 'string' || typeof label !== 'string') return null;
            const labelIndex = text.toLowerCase().indexOf(label.toLowerCase());
            if (labelIndex === -1) return null;

            let potentialPriceText = text.substring(labelIndex + label.length).trim();
            const atIndex = potentialPriceText.search(/\s+\(at|\s+at\s+|\s+-?\d+%/);
            if (atIndex !== -1) {
                potentialPriceText = potentialPriceText.substring(0, atIndex).trim();
            }
            potentialPriceText = potentialPriceText.replace(/\s+\([\s\S]*?\)$/, '').trim();
            return parseRawPrice(potentialPriceText);
        }


        rows.forEach(row => {
            const cells = row.cells;
            if (cells.length < 5) return;

            const appId = row.dataset.appid;
            const nameElement = cells[2].querySelector('a.b');
            const name = nameElement ? nameElement.innerText.trim() : 'N/A';

            let currentPriceTextToParse = cells[4].dataset.originalPrice || cells[4].innerText.trim();
            const nonPriceValues = ["free", "—", "tba", "soon", "n/a", "бесплатно"];
            if (nonPriceValues.some(val => currentPriceTextToParse.toLowerCase().includes(val)) || !/\d/.test(currentPriceTextToParse)) {
                 if (nonPriceValues.some(val => currentPriceTextToParse.toLowerCase().includes(val) && (val === "free" || val === "бесплатно"))) {
                 } else {
                    return;
                 }
            }

            let currentPriceNum;
            if (nonPriceValues.some(val => currentPriceTextToParse.toLowerCase().includes(val) && (val === "free" || val === "бесплатно"))) {
                currentPriceNum = 0;
            } else {
                currentPriceNum = parseRawPrice(currentPriceTextToParse);
            }

            if (currentPriceNum === null && !nonPriceValues.some(val => currentPriceTextToParse.toLowerCase().includes(val) && (val === "free" || val === "бесплатно"))) {
                return;
            }
             if (currentPriceNum === null) currentPriceNum = 0;


            const currentDiscountString = cells[3].innerText.trim();
            let approximateFullPrice = currentPriceNum;
            let discountPercentage = 0;

            if (currentDiscountString && currentDiscountString.startsWith('-') && currentDiscountString.endsWith('%')) {
                const discountMatch = currentDiscountString.match(/-(\d+)%/);
                if (discountMatch && discountMatch[1]) {
                    discountPercentage = parseFloat(discountMatch[1]);
                    if (!isNaN(discountPercentage) && discountPercentage > 0 && discountPercentage < 100) {
                        if (currentPriceNum > 0) {
                           approximateFullPrice = currentPriceNum / (1 - (discountPercentage / 100));
                        } else {
                           approximateFullPrice = 0;
                        }
                    } else {
                        discountPercentage = 0;
                    }
                }
            }
            approximateFullPrice = Math.round(approximateFullPrice * 100) / 100;

            let allTimeLowPrice = null;
            let twoYearLowPrice = null;

            const infoSpans = cells[2].querySelectorAll('span[class*="cat"]');

            infoSpans.forEach(span => {
                const infoText = span.innerText.toLowerCase();
                if (infoText.includes('all-time low:')) {
                    allTimeLowPrice = extractPriceAfterLabel(span.innerText, 'All-time low:');
                } else if (infoText.includes('2-year low:')) {
                    twoYearLowPrice = extractPriceAfterLabel(span.innerText, '2-year low:');
                } else if (infoText.includes('current 2-year low')) {
                    twoYearLowPrice = currentPriceNum;
                } else if (infoText.includes('new historical low')) {
                     if (allTimeLowPrice === null || currentPriceNum < allTimeLowPrice) {
                        allTimeLowPrice = currentPriceNum;
                    }
                }
            });

            let bestPriceForCalculation = currentPriceNum;
            if (allTimeLowPrice !== null) {
                bestPriceForCalculation = allTimeLowPrice;
            } else if (twoYearLowPrice !== null) {
                bestPriceForCalculation = twoYearLowPrice;
            }

            gamesData.push({
                appId,
                name,
                currentPriceNum: currentPriceNum,
                currentDiscountText: currentDiscountString || 'N/A',
                approximateFullPrice: approximateFullPrice,
                allTimeLowPrice: allTimeLowPrice,
                twoYearLowPrice: twoYearLowPrice,
                bestPriceForCalculation: bestPriceForCalculation
            });

            totalApproximateFullPriceSum += approximateFullPrice;
            totalCalculatedBestPriceSum += bestPriceForCalculation;
        });

        if (gamesData.length === 0) {
            alert('Не найдено игр с указанными ценами для обработки.');
            return;
        }

        let modal = document.getElementById('steamTableModal');
        let modalContentElement;
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'steamTableModal';
            modal.innerHTML = `
                <div id="steamTableModalContent">
                    <span id="steamTableModalClose">&times;</span>
                    <h1>Отчет по ценам на игры</h1>
                    <div id="steamTableTotalsContainerPlaceholder"></div>
                    <table>
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                </div>
            `;
            document.body.appendChild(modal);

            const styleSheet = document.createElement("style");
            styleSheet.id = "steamTableModalStyles";
            styleSheet.textContent = `
                #steamTableModal {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background-color: rgba(23, 26, 33, 0.9);
                    z-index: 10000; display: none; justify-content: center; align-items: center;
                    font-family: "Motiva Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
                }
                #steamTableModalContent {
                    background-color: #1b2838; color: #c7d5e0;
                    padding: 20px; border-radius: 4px; width: 95%; max-width: 1600px; height: 90%;
                    overflow: auto; box-shadow: 0 0 30px rgba(0,0,0,0.7); position: relative;
                    border: 1px solid #000;
                }
                #steamTableModalClose {
                    position: absolute; top: 10px; right: 15px; font-size: 32px; color: #5c6b7c;
                    cursor: pointer; font-weight: bold; line-height: 1; user-select: none;
                }
                #steamTableModalClose:hover { color: #66c0f4; }
                #steamTableModalContent h1 {
                    color: #66c0f4; text-align: center; margin-top: 0; margin-bottom: 15px;
                    border-bottom: 1px solid #2a3f5a; padding-bottom: 10px; font-weight: 500;
                }
                #steamTableModalContent table { border-collapse: collapse; width: 100%; font-size: 13px; }
                #steamTableModalContent th, #steamTableModalContent td {
                    border: 1px solid #2a3f5a; padding: 8px 10px; text-align: left;
                }
                #steamTableModalContent th {
                    background-color: #2a475e; color: #c7d5e0; font-weight: normal;
                    cursor: pointer; user-select: none; position: relative;
                }
                #steamTableModalContent th:hover { background-color: #3a5f7e; }
                #steamTableModalContent th .sort-arrow {
                    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
                    font-size: 0.9em; color: #66c0f4;
                }
                #steamTableModalContent tr:nth-child(even) td { background-color: #203142; }
                #steamTableModalContent tr:hover td { background-color: #2c3e50; }
                #steamTableModalContent .price { text-align: right; white-space: nowrap; }
                #steamTableModalContent .discount { text-align: center; }
                #steamTableModalContent .na { color: #7d8a96; font-style: italic; }
                #steamTableModalContent ::-webkit-scrollbar { width: 10px; }
                #steamTableModalContent ::-webkit-scrollbar-track { background: #2a3f5a; }
                #steamTableModalContent ::-webkit-scrollbar-thumb { background: #5c6b7c; border-radius: 4px;}
                #steamTableModalContent ::-webkit-scrollbar-thumb:hover { background: #66c0f4; }
                #steamTableTotalsContainer {
                    margin-bottom: 15px; padding: 10px; background-color: #171a21;
                    color: #c7d5e0; border: 1px solid #2a3f5a; border-radius: 3px;
                }
                #steamTableTotalsContainer .total-item {
                    margin-bottom: 12px;
                }
                #steamTableTotalsContainer .total-item:last-child {
                    margin-bottom: 0;
                }
                #steamTableTotalsContainer .total-label {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }
                #steamTableTotalsContainer .total-value {
                    font-weight: bold;
                    color: #66c0f4;
                    display: block;
                    font-size: 1.1em;
                }
            `;
            document.head.appendChild(styleSheet);

            document.getElementById('steamTableModalClose').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modalContentElement = document.getElementById('steamTableModalContent');
        modal.style.display = 'flex';

        const totalsContainerPlaceholder = document.getElementById('steamTableTotalsContainerPlaceholder');
        const totalsContainer = document.createElement('div');
        totalsContainer.id = 'steamTableTotalsContainer';
        totalsContainer.innerHTML = `
            <div class="total-item">
                <div class="total-label">Итого, если купить все игры по ~ПОЛНЫМ (расчетным) ценам:</div>
                <div class="total-value">${formatPriceDisplay(totalApproximateFullPriceSum)}</div>
            </div>
            <div class="total-item">
                <div class="total-label">Итого, если купить игры по ЛУЧШИМ доступным ценам (All-time/2-year/Текущая со скидкой):</div>
                <div class="total-value">${formatPriceDisplay(totalCalculatedBestPriceSum)}</div>
            </div>
        `;
        if (totalsContainerPlaceholder) {
            totalsContainerPlaceholder.replaceWith(totalsContainer);
        }


        const theadElement = modalContentElement.querySelector('table thead');
        theadElement.innerHTML = `
            <tr>
                <th data-sort-key="appId">AppID <span class="sort-arrow"></span></th>
                <th data-sort-key="name">Название <span class="sort-arrow"></span></th>
                <th data-sort-key="currentDiscountText" class="discount">Текущая скидка <span class="sort-arrow"></span></th>
                <th data-sort-key="currentPriceNum" class="price">Текущая цена <span class="sort-arrow"></span></th>
                <th data-sort-key="approximateFullPrice" class="price">~Полная цена <span class="sort-arrow"></span></th>
                <th data-sort-key="allTimeLowPrice" class="price">All-time Low <span class="sort-arrow"></span></th>
                <th data-sort-key="twoYearLowPrice" class="price">2-year Low <span class="sort-arrow"></span></th>
                <th data-sort-key="bestPriceForCalculation" class="price">Цена для расчета <span class="sort-arrow"></span></th>
            </tr>
        `;

        theadElement.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                const columnKey = th.dataset.sortKey;
                sortAndRenderData(columnKey);
            });
        });

        function renderTableBody(dataToRender) {
            let tbodyHtml = '';
            dataToRender.forEach(game => {
                tbodyHtml += `
                    <tr>
                        <td>${game.appId}</td>
                        <td>${game.name}</td>
                        <td class="discount">${game.currentDiscountText}</td>
                        <td class="price">${formatPriceDisplay(game.currentPriceNum)}</td>
                        <td class="price">${formatPriceDisplay(game.approximateFullPrice)}</td>
                        <td class="price">${game.allTimeLowPrice !== null ? formatPriceDisplay(game.allTimeLowPrice) : '<span class="na">N/A</span>'}</td>
                        <td class="price">${game.twoYearLowPrice !== null ? formatPriceDisplay(game.twoYearLowPrice) : '<span class="na">N/A</span>'}</td>
                        <td class="price">${formatPriceDisplay(game.bestPriceForCalculation)}</td>
                    </tr>
                `;
            });
            modalContentElement.querySelector('table tbody').innerHTML = tbodyHtml;
        }

        function updateSortArrows() {
            theadElement.querySelectorAll('th').forEach(th => {
                let arrowSpan = th.querySelector('.sort-arrow');
                if (!arrowSpan) {
                    arrowSpan = document.createElement('span');
                    arrowSpan.className = 'sort-arrow';
                    th.appendChild(arrowSpan);
                }
                if (th.dataset.sortKey === currentSortConfig.columnKey) {
                    arrowSpan.innerHTML = currentSortConfig.direction === 'asc' ? ' ▲' : ' ▼';
                } else {
                    arrowSpan.innerHTML = '';
                }
            });
        }

        function sortAndRenderData(columnKey) {
            const sortOrder = (currentSortConfig.columnKey === columnKey && currentSortConfig.direction === 'asc') ? 'desc' : 'asc';
            currentSortConfig = { columnKey: columnKey, direction: sortOrder };

            gamesData.sort((a, b) => {
                let valA = a[columnKey];
                let valB = b[columnKey];

                if (columnKey === 'currentDiscountText') {
                    const parseDiscountVal = (text) => {
                        if (text === 'N/A' || !text.includes('%')) return 0;
                        const num = parseInt(text.replace('-', '').replace('%', ''), 10);
                        return isNaN(num) ? 0 : num;
                    };
                    valA = parseDiscountVal(a.currentDiscountText);
                    valB = parseDiscountVal(b.currentDiscountText);
                } else if (typeof valA === 'string' && typeof valB === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA === null || typeof valA === 'undefined') valA = sortOrder === 'asc' ? Infinity : -Infinity;
                if (valB === null || typeof valB === 'undefined') valB = sortOrder === 'asc' ? Infinity : -Infinity;

                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            renderTableBody(gamesData);
            updateSortArrows();
        }

        renderTableBody(gamesData);
        updateSortArrows();

        const tfootElement = modalContentElement.querySelector('table tfoot');
        if (tfootElement) tfootElement.innerHTML = '';
    }

    function createTagFilterModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'tag-filter-modal';
        modalOverlay.className = 'tag-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="tag-modal" onclick="event.stopPropagation();">
                <div class="tag-modal-header">
                    <h2>Настройка меток</h2>
                    <button class="tag-modal-close" data-action="close-tag-modal">&times;</button>
                </div>
                <div class="tag-modal-body">
                    <input type="text" id="tag-search-input" class="tag-search-input" placeholder="Введите название метки...">
                    <div id="tag-search-results" class="tag-search-results"></div>
                    <div id="active-tag-filters-container" class="active-tag-filters-container">
                        <div class="group-title">Активные фильтры</div>
                    </div>
                </div>
                <div class="tag-modal-footer">
                    <button class="btn" data-action="apply-tags-and-close">Применить и закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const searchInput = document.getElementById('tag-search-input');
        const searchResultsContainer = document.getElementById('tag-search-results');
        const activeFiltersContainer = document.getElementById('active-tag-filters-container');

        searchInput.addEventListener('keyup', () => {
            const query = searchInput.value.toLowerCase().trim();
            searchResultsContainer.innerHTML = '';
            if (query.length < 2) return;

            const filteredTags = Object.entries(allTags)
                .filter(([tagid, name]) => name.toLowerCase().includes(query) && !activeTagFilters[tagid])
                .slice(0, 50);

            filteredTags.forEach(([tagid, name]) => {
                const item = document.createElement('div');
                item.className = 'tag-search-result-item';
                item.textContent = name;
                item.dataset.tagid = tagid;
                item.dataset.tagname = name;
                searchResultsContainer.appendChild(item);
            });
        });

        searchResultsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-search-result-item')) {
                const tagId = e.target.dataset.tagid;
                activeTagFilters[tagId] = 20;
                e.target.remove();
                renderActiveTagFilters();
                searchInput.value = '';
                searchResultsContainer.innerHTML = '';
            }
        });

        activeFiltersContainer.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'remove-tag-filter') {
                const tagId = e.target.dataset.tagid;
                delete activeTagFilters[tagId];
                renderActiveTagFilters();
            }
        });

         activeFiltersContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('tag-position-input')) {
                const tagId = e.target.dataset.tagid;
                let value = parseInt(e.target.value, 10);
                if (isNaN(value) || value < 1) value = 1;
                if (value > 20) value = 20;
                activeTagFilters[tagId] = value;
                e.target.value = value;
            }
        });

        modalOverlay.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'close-tag-modal' || e.target.id === 'tag-filter-modal') {
                modalOverlay.style.display = 'none';
            } else if(action === 'apply-tags-and-close') {
                 modalOverlay.style.display = 'none';
                 applyAllFilters();
            }
        });
    }

    function renderActiveTagFilters() {
        const container = document.getElementById('active-tag-filters-container');
        container.innerHTML = '<div class="group-title">Активные фильтры</div>';

        for (const tagId in activeTagFilters) {
            const tagName = allTags[tagId] || `TagID: ${tagId}`;
            const position = activeTagFilters[tagId];

            const row = document.createElement('div');
            row.className = 'active-tag-filter-row';
            row.innerHTML = `
                <span>${tagName}</span>
                <input type="number" class="input-field tag-position-input" value="${position}" min="1" max="20" data-tagid="${tagId}">
                <button class="btn btn-remove-tag" data-action="remove-tag-filter" data-tagid="${tagId}">X</button>
            `;
            container.appendChild(row);
        }
    }

    async function fetchAndStoreTags() {
        const STEAM_TAGS_URL = "https://gist.githubusercontent.com/0wn3dg0d/22a351ff4c65e50a9a8af6da360defad/raw/steamrutagsownd.json";
        const CACHE_KEY = 'SteamDB_Enhancer_TagsCache';
        const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

        if (allTags && Object.keys(allTags).length > 0) return;

        try {
            const cached = JSON.parse(GM_getValue(CACHE_KEY, '{}'));
            const now = Date.now();

            if (cached.data && (now - cached.timestamp) < CACHE_DURATION) {
                allTags = cached.data;
                return;
            }

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: STEAM_TAGS_URL,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                allTags = data;
                GM_setValue(CACHE_KEY, JSON.stringify({
                    data: allTags,
                    timestamp: now
                }));
            } else {
                if(cached.data) allTags = cached.data;
            }
        } catch (e) {
            console.error("SteamDB Enhancer: Ошибка загрузки или обработки тегов.", e);
        }
    }

    function isRuCurrencySelected() {
        const currencySelector = document.querySelector('details#js-select-cc');
        if (currencySelector) {
            const checkedRadio = currencySelector.querySelector('input[name="cc"]:checked');
            if (checkedRadio) { return checkedRadio.value === 'ru'; }
            return currencySelector.dataset.default === 'ru';
        }
        const priceHeader = document.querySelector('th[data-name="price"] img[src*="/ru.svg"]');
        if (priceHeader) return true;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('cc') === 'ru';
    }

    function calculateRecommendedRubPrice(pUSD) {
        if (typeof pUSD !== 'number' || isNaN(pUSD)) return null;
        if (pUSD < 0.99) return 42; if (pUSD >= 0.99 && pUSD < 1.99) return 42; if (pUSD >= 1.99 && pUSD < 2.99) return 82; if (pUSD >= 2.99 && pUSD < 3.99) return 125; if (pUSD >= 3.99 && pUSD < 4.99) return 165; if (pUSD >= 4.99 && pUSD < 5.99) return 200; if (pUSD >= 5.99 && pUSD < 6.99) return 240; if (pUSD >= 6.99 && pUSD < 7.99) return 280; if (pUSD >= 7.99 && pUSD < 8.99) return 320; if (pUSD >= 8.99 && pUSD < 9.99) return 350; if (pUSD >= 9.99 && pUSD < 10.99) return 385; if (pUSD >= 10.99 && pUSD < 11.99) return 420; if (pUSD >= 11.99 && pUSD < 12.99) return 460; if (pUSD >= 12.99 && pUSD < 13.99) return 490; if (pUSD >= 13.99 && pUSD < 14.99) return 520; if (pUSD >= 14.99 && pUSD < 15.99) return 550; if (pUSD >= 15.99 && pUSD < 16.99) return 590; if (pUSD >= 16.99 && pUSD < 17.99) return 620; if (pUSD >= 17.99 && pUSD < 18.99) return 650; if (pUSD >= 18.99 && pUSD < 19.99) return 680; if (pUSD >= 19.99 && pUSD < 22.99) return 710; if (pUSD >= 22.99 && pUSD < 27.99) return 880; if (pUSD >= 27.99 && pUSD < 32.99) return 1100; if (pUSD >= 32.99 && pUSD < 37.99) return 1200; if (pUSD >= 37.99 && pUSD < 43.99) return 1300; if (pUSD >= 43.99 && pUSD < 47.99) return 1500; if (pUSD >= 47.99 && pUSD < 52.99) return 1600; if (pUSD >= 52.99 && pUSD < 57.99) return 1750; if (pUSD >= 57.99 && pUSD < 63.99) return 1900; if (pUSD >= 63.99 && pUSD < 67.99) return 2100; if (pUSD >= 67.99 && pUSD < 74.99) return 2250; if (pUSD >= 74.99 && pUSD < 79.99) return 2400; if (pUSD >= 79.99 && pUSD < 84.99) return 2600; if (pUSD >= 84.99 && pUSD < 89.99) return 2700; if (pUSD >= 89.99 && pUSD < 99.99) return 2900; if (pUSD >= 99.99 && pUSD < 109.99) return 3200; if (pUSD >= 109.99 && pUSD < 119.99) return 3550; if (pUSD >= 119.99 && pUSD < 129.99) return 3900; if (pUSD >= 129.99 && pUSD < 139.99) return 4200; if (pUSD >= 139.99 && pUSD < 149.99) return 4500; if (pUSD >= 149.99 && pUSD < 199.99) return 4800; if (pUSD >= 199.99) return 6500;
        return null;
    }

    function getPriceInCents(purchaseOption) {
        if (!purchaseOption) return null;
        if (purchaseOption.discount_pct > 0 && purchaseOption.original_price_in_cents) {
            return parseInt(purchaseOption.original_price_in_cents, 10);
        }
        if (purchaseOption.final_price_in_cents) {
            return parseInt(purchaseOption.final_price_in_cents, 10);
        }
        return null;
    }

    function createRrcDisplayElement(appId) {
        const container = document.createElement('div');
        container.className = 'rrc-display-container';
        const data = gameData[appId];
        let rrcStatus = 'no_data';
        let htmlContent = `<div class="rrc-content-wrapper"><span class="rrc-no-data">Нет данных РРЦ</span></div>`;

        if (isRuModeActive && data && typeof data.price_us_initial_cents === 'number' && typeof data.price_ru_initial_cents === 'number') {
            const pUSD = data.price_us_initial_cents / 100;
            const actualRubPrice = data.price_ru_initial_cents / 100;
            const recommendedRubPrice = calculateRecommendedRubPrice(pUSD);

            if (recommendedRubPrice !== null) {
                const diff = actualRubPrice - recommendedRubPrice;
                const diffPercent = recommendedRubPrice !== 0 ? (diff / recommendedRubPrice) * 100 : (diff > 0 ? Infinity : (actualRubPrice === 0 && recommendedRubPrice === 0 ? 0 : -Infinity));
                let textClass = 'equal';
                let symbol = '=';
                if (diff > 0.01) {
                    textClass = 'higher'; symbol = '>'; rrcStatus = 'higher';
                } else if (diff < -0.01) {
                    textClass = 'lower'; symbol = '<'; rrcStatus = 'lower';
                } else {
                    rrcStatus = 'equal';
                }
                htmlContent = `
                    <div class="rrc-content-wrapper">
                        <span class="rrc-text ${textClass}">${symbol} РРЦ</span>
                        <span class="rrc-details">(${diffPercent !== Infinity && diffPercent !== -Infinity ? diffPercent.toFixed(0) + '%' : (diffPercent > 0 ? '>~' : '<~') }, ${diff.toFixed(0)} ₽)</span>
                    </div>`;
            } else {
                rrcStatus = 'no_rec_price';
                htmlContent = `<div class="rrc-content-wrapper"><span class="rrc-no-data">Нет данных РРЦ (USD?)</span></div>`;
            }
        } else if (isRuModeActive && data && (!data.price_us_initial_cents || !data.price_ru_initial_cents)) {
            rrcStatus = 'no_price_data';
        }
        if (!isRuModeActive) rrcStatus = 'not_applicable';
        if (data) gameData[appId].rrc_status = rrcStatus;
        container.innerHTML = htmlContent;
        return container;
    }

    function injectRrcDisplay(row) {
        if (!isRuModeActive) return;
        const appId = row.dataset.appid;
        if (!appId) return;
        const targetCell = row.querySelector('td:first-child');
        if (!targetCell) return;
        let displayElement = targetCell.querySelector('.rrc-display-container');
        if (displayElement) displayElement.remove();
        displayElement = createRrcDisplayElement(appId);
        targetCell.prepend(displayElement);
    }

    function injectAllRrcDisplays() {
        if (!isRuModeActive) {
            document.querySelectorAll('.rrc-display-container').forEach(el => el.remove());
            return;
        }
        document.querySelectorAll('tr.app[data-appid]').forEach(row => injectRrcDisplay(row));
    }

    function createFiltersContainer() {
        const container = document.createElement('div');
        container.className = 'steamdb-enhancer';

        let rrcFilterHTML = '';
        if (isRuModeActive) {
            rrcFilterHTML = `
            <div class="control-group" id="rrc-filter-control-group">
                <div class="group-title">Фильтр РРЦ</div>
                <div class="btn-group" id="rrc-filter-group">
                    <button class="btn" data-filter-rrc="lower" title="Дешевле РРЦ">&lt; РРЦ</button>
                    <button class="btn" data-filter-rrc="equal" title="Соответствует РРЦ">= РРЦ</button>
                    <button class="btn" data-filter-rrc="higher" title="Дороже РРЦ">&gt; РРЦ</button>
                </div>
            </div>`;
        }

        let wishlistCalculatorHTML = '';
        const isWishlistMode = document.querySelector('input[name="displayOnly"][value="Wishlist"]:checked') !== null;
        if (isWishlistMode) {
            wishlistCalculatorHTML = `
                <div class="control-group" id="wishlist-calculator-group">
                    <div class="group-title">Калькулятор желаемого</div>
                    <button class="btn" data-action="calculate-wishlist">${PROCESS_BUTTON_TEXT.calculate_wishlist_idle}</button>
                </div>`;
        }

        container.innerHTML = `
        <div class="enhancer-header">
            <button class="btn" id="process-btn">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.8.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
                <span id="process-btn-text">${PROCESS_BUTTON_TEXT.idle}</span>
            </button>
            <div class="status-indicator status-inactive">${isRuModeActive ? STATUS_TEXT.ready_to_process : STATUS_TEXT.rrc_disabled}</div>
        </div>
        <div class="progress-container"><div class="progress-bar"></div></div>
        <div class="progress-text">
            <span class="progress-count">0/0</span>
            <span class="progress-percent">(0%)</span>
        </div>
        <div class="row-layout">
            <div class="control-group">
                <div class="group-title">Русский перевод</div>
                <div class="btn-group">
                    <button class="btn" data-filter="russian-any">Только текст</button>
                    <button class="btn" data-filter="russian-audio">Озвучка</button>
                    <button class="btn" data-filter="no-russian">Без перевода</button>
                </div>
            </div>
            <div class="control-group">
                <div class="group-title">Списки</div>
                <div class="btn-group">
                    <button class="btn" data-action="list1">Список 1</button>
                    <button class="btn" data-action="list2">Список 2</button>
                    <button class="btn" data-action="list-filter">Фильтр списков</button>
                </div>
            </div>
            ${wishlistCalculatorHTML}
            ${rrcFilterHTML}
            <div class="control-group">
                <div class="group-title">Метки</div>
                <div class="btn-group">
                    <button class="btn" data-action="open-tag-modal">Настройка меток</button>
                </div>
            </div>
            <div class="control-group">
                <div class="group-title">Дополнительные инструменты</div>
                <div class="row-layout compact">
                    <div class="converter-group">
                        <input type="number" class="input-field" id="exchange-rate-input" value="${DEFAULT_EXCHANGE_RATE}" step="0.01">
                        <button class="btn" data-action="convert">Конвертировать</button>
                    </div>
                    <div class="btn-group">
                        <input type="date" class="date-picker">
                        <button class="btn" data-action="date-filter">Фильтр по дате</button>
                    </div>
                </div>
            </div>

            <div class="control-group">
                <div class="group-title">Обзоры</div>
                <div class="review-filter-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: center;">
                    <div>
                        <label for="review-min-count" style="font-size: 11px; color: #a0b0c0;">Кол-во обзоров</label>
                        <div style="display: flex; gap: 5px;">
                            <input type="number" class="input-field" id="review-min-count" placeholder="Мин" style="width: 100%;">
                            <input type="number" class="input-field" id="review-max-count" placeholder="Макс" style="width: 100%;">
                        </div>
                    </div>
                    <div>
                        <label for="review-min-rating" style="font-size: 11px; color: #a0b0c0;">Рейтинг (%)</label>
                        <div style="display: flex; gap: 5px;">
                            <input type="number" class="input-field" id="review-min-rating" placeholder="Мин" style="width: 100%;" min="0" max="100">
                            <input type="number" class="input-field" id="review-max-rating" placeholder="Макс" style="width: 100%;" min="0" max="100">
                        </div>
                    </div>
                    <div style="grid-column: 1 / -1; margin-top: 5px;">
                        <label class="steamy-checkbox-control" style="font-size:13px; color: #c6d4df;">
                            <input type="checkbox" id="total-sort-checkbox" data-action="toggle-total-sort">
                            <span>Тотальная сортировка (кол-во * %)</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="control-group">
                <div class="group-title">Ранний доступ</div>
                <div class="btn-group">
                    <button class="btn" data-action="ea-show">Только игры с ранним доступом</button>
                    <button class="btn" data-action="ea-hide">Скрыть игры с ранним доступом</button>
                </div>
            </div>
            </div>`;

        if (!isRuModeActive) {
            const rrcGroup = container.querySelector('#rrc-filter-control-group');
            if (rrcGroup) rrcGroup.classList.add('disabled-filter');
        }
        return container;
    }

    async function ensureAllEntriesAndCountdown(callback, statusElement, actionButton) {
        const entriesSelect = document.getElementById('dt-length-0');
        const originalStatusText = statusElement.textContent;
        let originalButtonTextContent = "";
        let processButtonTextSpan = null;

        if (actionButton) {
            actionButton.disabled = true;
            if (actionButton.id === 'process-btn') {
                processButtonTextSpan = actionButton.querySelector('#process-btn-text');
                if(processButtonTextSpan) originalButtonTextContent = processButtonTextSpan.textContent;
            } else {
                originalButtonTextContent = actionButton.textContent;
            }
        }

        if (entriesSelect && entriesSelect.value !== "-1") {
            entriesSelect.value = "-1";
            entriesSelect.dispatchEvent(new Event('change', { bubbles: true }));

            let countdown = PAGE_RELOAD_DELAY / 1000;
            const updateCountdownText = () => {
                const countdownMsg = `${STATUS_TEXT.changing_entries_prefix}${countdown}...`;
                statusElement.textContent = countdownMsg;
                if (actionButton) {
                    if (processButtonTextSpan) {
                        processButtonTextSpan.textContent = countdownMsg;
                    } else {
                        actionButton.textContent = countdownMsg;
                    }
                }
            };

            updateCountdownText();

            const intervalId = setInterval(() => {
                countdown--;
                updateCountdownText();
                if (countdown <= 0) {
                    clearInterval(intervalId);
                    statusElement.textContent = originalStatusText;
                    if (actionButton) {
                        if (processButtonTextSpan) {
                            processButtonTextSpan.textContent = PROCESS_BUTTON_TEXT.idle;
                        } else {
                            actionButton.textContent = PROCESS_BUTTON_TEXT.calculate_wishlist_idle;
                        }
                        actionButton.disabled = false;
                    }
                    callback();
                }
            }, 1000);
        } else {
            if (actionButton) actionButton.disabled = false;
            callback();
        }
    }

    function handleDiscountFilterChange(event) {
        const checkbox = event.target;
        if (!checkbox.matches('input[type="checkbox"][data-discount-type]')) return;

        const type = checkbox.dataset.discountType;
        const mode = checkbox.dataset.filterMode;
        const isChecked = checkbox.checked;

        if (type.startsWith('percent_')) {
            if (mode === 'show') {
                activeShowAtlPercentFilters[type.replace('percent_', '')] = isChecked;
                if (isChecked && activeHideAtlPercentFilters[type.replace('percent_', '')]) {
                    activeHideAtlPercentFilters[type.replace('percent_', '')] = false;
                }
            } else if (mode === 'hide') {
                activeHideAtlPercentFilters[type.replace('percent_', '')] = isChecked;
                if (isChecked && activeShowAtlPercentFilters[type.replace('percent_', '')]) {
                    activeShowAtlPercentFilters[type.replace('percent_', '')] = false;
                }
            }
        } else {
            if (mode === 'show') {
                activeShowDiscountFilters[type] = isChecked;
                if (isChecked && activeHideDiscountFilters[type]) {
                    activeHideDiscountFilters[type] = false;
                }
            } else if (mode === 'hide') {
                activeHideDiscountFilters[type] = isChecked;
                if (isChecked && activeShowDiscountFilters[type]) {
                    activeShowDiscountFilters[type] = false;
                }
            }
        }
        updateDiscountFilterUI(type);
        applyAllFilters();

        if (typeof $ !== 'undefined' && $.fn.dataTable && $.fn.dataTable.tables(true).length > 0) {
            const dtTable = $($.fn.dataTable.tables(true)[0]);
            if (dtTable.length > 0 && dtTable.DataTable()?.settings()[0]) {
                dtTable.DataTable().draw(false);
            }
        }
    }

    function updateDiscountFilterUI(specificType = null) {
        const typesToUpdateAbsolute = specificType && !specificType.startsWith('percent_') ? [specificType] : ['blue', 'green', 'purple'];
        typesToUpdateAbsolute.forEach(type => {
            const showCheckbox = document.getElementById(`enhancer-show-${type}-discount`);
            const hideCheckbox = document.getElementById(`enhancer-hide-${type}-discount`);

            if (showCheckbox) {
                showCheckbox.checked = activeShowDiscountFilters[type];
                showCheckbox.parentElement.classList.toggle('active', activeShowDiscountFilters[type]);
            }
            if (hideCheckbox) {
                hideCheckbox.checked = activeHideDiscountFilters[type];
                hideCheckbox.parentElement.classList.toggle('active', activeHideDiscountFilters[type]);
            }
        });

        const typesToUpdatePercent = specificType && specificType.startsWith('percent_') ? [specificType.replace('percent_', '')] : ['cheaper', 'equal', 'more_expensive'];
        typesToUpdatePercent.forEach(type => {
            const showCheckbox = document.getElementById(`enhancer-show-percent_${type}-discount`);
            const hideCheckbox = document.getElementById(`enhancer-hide-percent_${type}-discount`);
            if (showCheckbox) {
                showCheckbox.checked = activeShowAtlPercentFilters[type];
                showCheckbox.parentElement.classList.toggle('active', activeShowAtlPercentFilters[type]);
            }
            if (hideCheckbox) {
                hideCheckbox.checked = activeHideAtlPercentFilters[type];
                hideCheckbox.parentElement.classList.toggle('active', activeHideAtlPercentFilters[type]);
            }
        });
    }

    function handleMainPanelClick(event) {
        const langBtn = event.target.closest('[data-filter]');
        if (langBtn) {
            const filterType = langBtn.dataset.filter;
            if (filterType.startsWith('russian-') || filterType === 'no-russian') {
                const wasActive = langBtn.classList.contains('active');
                document.querySelectorAll('.steamdb-enhancer [data-filter^="russian-"], .steamdb-enhancer [data-filter="no-russian"]').forEach(b => b.classList.remove('active'));
                if (!wasActive) {
                    langBtn.classList.add('active');
                    activeLanguageFilter = filterType;
                } else {
                    activeLanguageFilter = null;
                }
                applyAllFilters();
            }
        }

        if (isRuModeActive) {
            const rrcBtn = event.target.closest('[data-filter-rrc]');
            if (rrcBtn) {
                const filterType = rrcBtn.dataset.filterRrc;
                activeRrcFilters[filterType] = !activeRrcFilters[filterType];
                rrcBtn.classList.toggle('active', activeRrcFilters[filterType]);
                applyAllFilters();
            }
        }
        handleControlClick(event);
    }

    function handleControlClick(event) {
        const btn = event.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const statusIndicator = document.querySelector('.steamdb-enhancer .status-indicator');
        switch (action) {
            case 'list1': saveList('list1'); break;
            case 'list2': saveList('list2'); break;
            case 'list-filter':
                activeListFilter = !activeListFilter;
                btn.classList.toggle('active', activeListFilter);
                applyAllFilters();
                break;
            case 'convert':
                currentExchangeRate = parseFloat(document.getElementById('exchange-rate-input').value) || DEFAULT_EXCHANGE_RATE;
                convertPrices();
                break;
            case 'date-filter': {
                const dateInput = btn.previousElementSibling;
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active'); dateInput.value = ''; activeDateFilterTimestamp = null;
                } else {
                    const selectedDate = dateInput.value;
                    if (selectedDate) {
                        const dateObj = new Date(selectedDate + 'T00:00:00Z');
                        activeDateFilterTimestamp = dateObj.getTime() / 1000;
                        btn.classList.toggle('active', !isNaN(activeDateFilterTimestamp));
                        if (isNaN(activeDateFilterTimestamp)) activeDateFilterTimestamp = null;
                    } else {
                        activeDateFilterTimestamp = null; btn.classList.remove('active');
                    }
                }
                applyAllFilters(); break;
            }
            case 'calculate-wishlist':
                if (statusIndicator) statusIndicator.textContent = STATUS_TEXT.calculating_wishlist;
                ensureAllEntriesAndCountdown(extractAndDisplayGameDataSteamStyle, statusIndicator, btn);
                break;
            case 'ea-show': {
                const eaHideBtn = document.querySelector('[data-action="ea-hide"]');
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    earlyAccessFilter = 'none';
                } else {
                    btn.classList.add('active');
                    if (eaHideBtn) eaHideBtn.classList.remove('active');
                    earlyAccessFilter = 'show';
                }
                applyAllFilters();
                break;
            }
            case 'ea-hide': {
                const eaShowBtn = document.querySelector('[data-action="ea-show"]');
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    earlyAccessFilter = 'none';
                } else {
                    btn.classList.add('active');
                    if (eaShowBtn) eaShowBtn.classList.remove('active');
                    earlyAccessFilter = 'hide';
                }
                applyAllFilters();
                break;
            }
            case 'open-tag-modal': {
                const modal = document.getElementById('tag-filter-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    renderActiveTagFilters();
                }
                break;
            }
        }
    }

    function saveList(listName) {
        const appIds = Array.from(collectedAppIds);
        localStorage.setItem(listName, JSON.stringify(appIds));
        alert(`Список ${listName} сохранён (${appIds.length} игр)`);
    }

    function convertPrices() {
        document.querySelectorAll('tr.app').forEach(row => {
            const priceElement = row.cells[4];
            if (!priceElement) return;

            if (!priceElement.dataset.originalPrice) {
                priceElement.dataset.originalPrice = priceElement.textContent.trim();
            }
            const originalPriceText = priceElement.dataset.originalPrice;
            let priceValue = NaN;

            if (originalPriceText.includes('S/.')) {
                const priceMatch = originalPriceText.match(/S\/\.\s*([0-9,.]+)/);
                priceValue = priceMatch ? parseFloat(priceMatch[1].replace(/\s/g, '').replace(',', '.')) : NaN;
            } else if (originalPriceText.includes('₽')) {
                const priceMatch = originalPriceText.match(/([0-9,\s]+)\s*₽/);
                priceValue = priceMatch ? parseFloat(priceMatch[1].replace(/\s/g, '').replace(',', '.')) : NaN;
            } else if (originalPriceText.toLowerCase().includes('free') || originalPriceText.toLowerCase().includes('бесплатно')) {
                priceValue = 0;
            } else {
                const priceMatch = originalPriceText.replace(',', '.').match(/([0-9.]+)/);
                priceValue = priceMatch ? parseFloat(priceMatch[1]) : NaN;
            }

            if (!isNaN(priceValue)) {
                if (priceValue === 0) {
                    priceElement.textContent = priceElement.dataset.originalPrice;
                } else {
                    const converted = (priceValue * currentExchangeRate).toFixed(2);
                    priceElement.textContent = converted;
                }
            } else {
                priceElement.textContent = originalPriceText;
            }
        });
    }

    function updateReviewFilterPlaceholders() {
        const visibleRows = Array.from(document.querySelectorAll('tr.app[data-appid]')).filter(row => row.style.display !== 'none');

        if (visibleRows.length === 0) return;

        let minCount, maxCount, minRating, maxRating;

        visibleRows.forEach(row => {
            const appId = row.dataset.appid;
            const data = gameData[appId];
            if (data && data.review_count !== undefined && data.percent_positive !== undefined) {
                const count = data.review_count;
                const rating = data.percent_positive;

                if (minCount === undefined || count < minCount) minCount = count;
                if (maxCount === undefined || count > maxCount) maxCount = count;
                if (minRating === undefined || rating < minRating) minRating = rating;
                if (maxRating === undefined || rating > maxRating) maxRating = rating;
            }
        });

        const minCountInput = document.getElementById('review-min-count');
        const maxCountInput = document.getElementById('review-max-count');
        const minRatingInput = document.getElementById('review-min-rating');
        const maxRatingInput = document.getElementById('review-max-rating');

        if (minCountInput) minCountInput.placeholder = minCount !== undefined ? minCount : 'Мин';
        if (maxCountInput) maxCountInput.placeholder = maxCount !== undefined ? maxCount : 'Макс';
        if (minRatingInput) minRatingInput.placeholder = minRating !== undefined ? minRating : 'Мин';
        if (maxRatingInput) maxRatingInput.placeholder = maxRating !== undefined ? maxRating : 'Макс';
    }

    function handleReviewFilterChange() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const minCount = document.getElementById('review-min-count').value;
            const maxCount = document.getElementById('review-max-count').value;
            const minRating = document.getElementById('review-min-rating').value;
            const maxRating = document.getElementById('review-max-rating').value;

            reviewFilters.minCount = minCount ? parseInt(minCount, 10) : null;
            reviewFilters.maxCount = maxCount ? parseInt(maxCount, 10) : null;
            reviewFilters.minRating = minRating ? parseInt(minRating, 10) : null;
            reviewFilters.maxRating = maxRating ? parseInt(maxRating, 10) : null;

            applyAllFilters();
            updateReviewFilterPlaceholders();
        }, 500);
    }

    function applyTotalSort() {
        const dtTableAPI = $($.fn.dataTable.tables(true)[0]).DataTable();
        const ratingColumnIndex = 5;

        dtTableAPI.rows().every(function() {
            const rowNode = this.node();
            const appId = rowNode.dataset.appid;
            const data = gameData[appId];
            const ratingCell = rowNode.cells[ratingColumnIndex];

            if (ratingCell && data && data.review_count !== undefined && data.percent_positive !== undefined) {

                if (!ratingCell.dataset.originalSort) {
                    ratingCell.dataset.originalSort = ratingCell.getAttribute('data-sort') || '0';
                }
                if (!ratingCell.dataset.originalText) {
                    ratingCell.dataset.originalText = ratingCell.textContent;
                }

                if (isTotalSortEnabled) {
                    const totalScore = data.review_count * data.percent_positive;
                    ratingCell.setAttribute('data-sort', totalScore);
                    ratingCell.textContent = totalScore.toLocaleString('ru-RU');
                } else {
                    ratingCell.setAttribute('data-sort', ratingCell.dataset.originalSort);
                    ratingCell.textContent = ratingCell.dataset.originalText;
                }
                dtTableAPI.cell(ratingCell).invalidate();
            }
        });
        dtTableAPI.draw('page');
    }

    function applyAllFilters() {
        const rows = document.querySelectorAll('tr.app');
        const list1 = JSON.parse(localStorage.getItem('list1') || '[]');
        const list2 = JSON.parse(localStorage.getItem('list2') || '[]');
        const commonIds = new Set(list1.filter(id => list2.includes(id)));

        rows.forEach(row => {
            const appId = row.dataset.appid;
            const data = gameData[appId];
            let visible = true;

            if (activeListFilter) {
                visible = !commonIds.has(appId);
            }

            if (visible && activeDateFilterTimestamp !== null) {
                const cells = row.querySelectorAll('.timeago');
                const timeToCheck = parseInt(cells[1]?.dataset.sort || cells[0]?.dataset.sort || '0');
                if (!timeToCheck || isNaN(timeToCheck)) {
                    visible = false;
                } else {
                    visible = timeToCheck >= activeDateFilterTimestamp;
                }
            }

            if (visible && activeLanguageFilter && data) {
                const lang = data.language_support_russian || {};
                switch (activeLanguageFilter) {
                    case 'russian-any': visible = (lang.supported || lang.subtitles) && !lang.full_audio; break;
                    case 'russian-audio': visible = lang.full_audio; break;
                    case 'no-russian': visible = !lang.supported && !lang.full_audio && !lang.subtitles; break;
                }
            } else if (visible && activeLanguageFilter && !data && isProcessingStarted) {
                visible = false;
            }

            if (isRuModeActive && visible) {
                const rrcFilterIsActive = activeRrcFilters.lower || activeRrcFilters.equal || activeRrcFilters.higher;
                const allRrcFiltersSelected = activeRrcFilters.lower && activeRrcFilters.equal && activeRrcFilters.higher;
                const noRrcFiltersSelected = !activeRrcFilters.lower && !activeRrcFilters.equal && !activeRrcFilters.higher;

                if (rrcFilterIsActive && !allRrcFiltersSelected && !noRrcFiltersSelected) {
                    const rrcStatus = data?.rrc_status;
                    if (!rrcStatus || rrcStatus === 'no_data' || rrcStatus === 'no_price_data' || rrcStatus === 'no_rec_price' || rrcStatus === 'not_applicable') {
                        visible = false;
                    } else {
                        let match = false;
                        if (activeRrcFilters.lower && rrcStatus === 'lower') match = true;
                        if (activeRrcFilters.equal && rrcStatus === 'equal') match = true;
                        if (activeRrcFilters.higher && rrcStatus === 'higher') match = true;
                        if (!match) visible = false;
                    }
                }
            }

            if (visible) {
                const isBlue = row.querySelector('td.price-discount-major') !== null;
                const isGreen = row.querySelector('td.price-discount:not(.price-discount-major):not(.price-discount-minor)') !== null;
                const isPurple = row.querySelector('td.price-discount-minor') !== null;

                const anyShowDiscountFilterActive = activeShowDiscountFilters.blue || activeShowDiscountFilters.green || activeShowDiscountFilters.purple;
                if (anyShowDiscountFilterActive) {
                    let matchesActiveShowFilter = false;
                    if (activeShowDiscountFilters.blue && isBlue) matchesActiveShowFilter = true;
                    if (activeShowDiscountFilters.green && isGreen) matchesActiveShowFilter = true;
                    if (activeShowDiscountFilters.purple && isPurple) matchesActiveShowFilter = true;

                    if (!matchesActiveShowFilter) {
                        visible = false;
                    }
                }

                if (visible) {
                    if (activeHideDiscountFilters.blue && isBlue) visible = false;
                    if (activeHideDiscountFilters.green && isGreen) visible = false;
                    if (activeHideDiscountFilters.purple && isPurple) visible = false;
                }
            }

            if(visible) {
                const atlPercentStatus = row.dataset.atlPercentStatus;
                const anyShowAtlPercentFilterActive = activeShowAtlPercentFilters.cheaper || activeShowAtlPercentFilters.equal || activeShowAtlPercentFilters.more_expensive;
                if (anyShowAtlPercentFilterActive) {
                    let matchesActiveShowFilter = false;
                    if (activeShowAtlPercentFilters.cheaper && atlPercentStatus === 'cheaper') matchesActiveShowFilter = true;
                    if (activeShowAtlPercentFilters.equal && atlPercentStatus === 'equal') matchesActiveShowFilter = true;
                    if (activeShowAtlPercentFilters.more_expensive && atlPercentStatus === 'more_expensive') matchesActiveShowFilter = true;
                    if (!matchesActiveShowFilter) {
                        visible = false;
                    }
                }
                if (visible) {
                    if (activeHideAtlPercentFilters.cheaper && atlPercentStatus === 'cheaper') visible = false;
                    if (activeHideAtlPercentFilters.equal && atlPercentStatus === 'equal') visible = false;
                    if (activeHideAtlPercentFilters.more_expensive && atlPercentStatus === 'more_expensive') visible = false;
                }
            }

            if (visible && data) {
                if (earlyAccessFilter === 'show' && !data.is_early_access) {
                    visible = false;
                }
                if (earlyAccessFilter === 'hide' && data.is_early_access) {
                    visible = false;
                }

                if (reviewFilters.minCount !== null && (data.review_count || 0) < reviewFilters.minCount) {
                    visible = false;
                }
                if (reviewFilters.maxCount !== null && (data.review_count || 0) > reviewFilters.maxCount) {
                    visible = false;
                }
                if (reviewFilters.minRating !== null && (data.percent_positive || 0) < reviewFilters.minRating) {
                    visible = false;
                }
                if (reviewFilters.maxRating !== null && (data.percent_positive || 0) > reviewFilters.maxRating) {
                    visible = false;
                }
            } else if (visible && (reviewFilters.minCount || reviewFilters.maxCount || reviewFilters.minRating || reviewFilters.maxRating || earlyAccessFilter !== 'none') && !data && isProcessingStarted) {
                visible = false;
            }

            if (visible && Object.keys(activeTagFilters).length > 0) {
                if (!data || !data.tagids || data.tagids.length === 0) {
                    visible = false;
                } else {
                    for (const tagId in activeTagFilters) {
                        const requiredPosition = activeTagFilters[tagId];
                        const numericTagId = parseInt(tagId, 10);
                        const actualPositionIndex = data.tagids.indexOf(numericTagId);

                        if (actualPositionIndex === -1 || actualPositionIndex >= requiredPosition) {
                            visible = false;
                            break;
                        }
                    }
                }
            }

            row.style.display = visible ? '' : 'none';
        });
    }

    function processGameData(items, stage) {
        items.forEach(item => {
            if (!item?.id) return;
            if (!gameData[item.id]) gameData[item.id] = {};
            const purchaseOption = item.best_purchase_option || item.purchase_options?.[0];
            gameData[item.id].tagids = item.tagids || [];

            if (stage === 'RU' || (stage === 'SINGLE_FETCH' && isRuModeActive)) {
                if (!gameData[item.id].franchises) {
                    gameData[item.id].franchises = item.basic_info?.franchises?.map(f => f.name).join(', ');
                    gameData[item.id].percent_positive = item.reviews?.summary_filtered?.percent_positive;
                    gameData[item.id].review_count = item.reviews?.summary_filtered?.review_count;
                    gameData[item.id].is_early_access = item.is_early_access;
                    gameData[item.id].short_description = item.basic_info?.short_description;
                    gameData[item.id].language_support_russian = item.supported_languages?.find(l => l.elanguage === 8);
                    gameData[item.id].language_support_english = item.supported_languages?.find(l => l.elanguage === 0);
                }
                gameData[item.id].price_ru_initial_cents = getPriceInCents(purchaseOption);
                gameData[item.id].price_ru_formatted_final = purchaseOption?.formatted_final_price;
                if (stage === 'RU') processedRuGames++;
                else processedSingleStageGames++;
            } else if (stage === 'US') {
                gameData[item.id].price_us_initial_cents = getPriceInCents(purchaseOption);
                gameData[item.id].price_us_formatted_final = purchaseOption?.formatted_final_price;
                processedUsGames++;
            } else if (stage === 'SINGLE_FETCH' && !isRuModeActive) {
                if (!gameData[item.id].franchises) {
                    gameData[item.id].franchises = item.basic_info?.franchises?.map(f => f.name).join(', ');
                    gameData[item.id].percent_positive = item.reviews?.summary_filtered?.percent_positive;
                    gameData[item.id].review_count = item.reviews?.summary_filtered?.review_count;
                    gameData[item.id].is_early_access = item.is_early_access;
                    gameData[item.id].short_description = item.basic_info?.short_description;
                    gameData[item.id].language_support_russian = item.supported_languages?.find(l => l.elanguage === 8);
                    gameData[item.id].language_support_english = item.supported_languages?.find(l => l.elanguage === 0);
                }
                processedSingleStageGames++;
            }
        });
        updateProgress();
    }

    async function processRequestQueue() {
        if (isProcessingQueue || !requestQueue.length) {
            if (!isProcessingQueue && isRuModeActive) {
                if (currentProcessingStage === 'RU' && processedRuGames >= totalGamesOnPage) {
                    currentProcessingStage = 'US';
                    updateButtonAndStatus(PROCESS_BUTTON_TEXT.processing_us, STATUS_TEXT.processing_us);
                    const usBatches = Array.from(collectedAppIds).reduce((acc, id, i) => {
                        if (i % BATCH_SIZE === 0) acc.push([]);
                        acc[acc.length - 1].push(id);
                        return acc;
                    }, []);
                    requestQueue.push(...usBatches.map(batch => ({ batch, stage: 'US', lang: 'english', cc: 'US' })));
                    updateProgress();
                    await processRequestQueue();
                } else if (currentProcessingStage === 'US' && processedUsGames >= totalGamesOnPage) {
                    updateButtonAndStatus(PROCESS_BUTTON_TEXT.done, STATUS_TEXT.processing_rrc, true, false);
                    injectAllRrcDisplays();
                    applyAllFilters();
                    isProcessingStarted = false;
                    updateButtonAndStatus(PROCESS_BUTTON_TEXT.done, STATUS_TEXT.done, true, true);
                    updateReviewFilterPlaceholders();
                }
            } else if (!isProcessingQueue && !isRuModeActive && currentProcessingStage === 'SINGLE_FETCH' && processedSingleStageGames >= totalGamesOnPage) {
                applyAllFilters();
                isProcessingStarted = false;
                updateButtonAndStatus(PROCESS_BUTTON_TEXT.done, STATUS_TEXT.done_no_rrc, true, true);
                updateReviewFilterPlaceholders();
            }
            return;
        }

        isProcessingQueue = true;
        const { batch: currentBatch, stage: batchStage, lang: batchLang, cc: batchCC } = requestQueue.shift();

        try {
            await fetchGameData(currentBatch, batchCC, batchLang, batchStage);
            await new Promise(r => setTimeout(r, REQUEST_DELAY));
        } catch (error) {
            if (batchStage === 'RU') processedRuGames += currentBatch.length;
            else if (batchStage === 'US') processedUsGames += currentBatch.length;
            else if (batchStage === 'SINGLE_FETCH') processedSingleStageGames += currentBatch.length;
            updateProgress();
        } finally {
            isProcessingQueue = false;
            await processRequestQueue();
        }
    }

    function fetchGameData(appIds, countryCode, language, stage) {
        return new Promise((resolve) => {
            if (!appIds || appIds.length === 0) { resolve(); return; }
            const input = {
                ids: appIds.map(appid => ({ appid: parseInt(appid, 10) })),
                context: { language: language, country_code: countryCode, steam_realm: 1 },
                data_request: {
                    include_assets: false, include_release: true, include_platforms: false,
                    include_all_purchase_options: true, include_screenshots: false, include_trailers: false,
                    include_ratings: true, include_tag_count: true, include_reviews: true,
                    include_basic_info: true, include_supported_languages: true,
                    include_full_description: false, include_included_items: false
                }
            };
            const url = `${API_URL}?input_json=${encodeURIComponent(JSON.stringify(input))}`;
            GM_xmlhttpRequest({
                method: "GET", url: url, timeout: 15000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data?.response?.store_items) {
                                processGameData(data.response.store_items, stage);
                            } else {
                                if (stage === 'RU') processedRuGames += appIds.length;
                                else if (stage === 'US') processedUsGames += appIds.length;
                                else if (stage === 'SINGLE_FETCH') processedSingleStageGames += appIds.length;
                            }
                        } catch (e) {
                            if (stage === 'RU') processedRuGames += appIds.length;
                            else if (stage === 'US') processedUsGames += appIds.length;
                            else if (stage === 'SINGLE_FETCH') processedSingleStageGames += appIds.length;
                        }
                    } else {
                        if (stage === 'RU') processedRuGames += appIds.length;
                        else if (stage === 'US') processedUsGames += appIds.length;
                        else if (stage === 'SINGLE_FETCH') processedSingleStageGames += appIds.length;
                    }
                    updateProgress(); resolve();
                },
                onerror: function() {
                    if (stage === 'RU') processedRuGames += appIds.length;
                    else if (stage === 'US') processedUsGames += appIds.length;
                    else if (stage === 'SINGLE_FETCH') processedSingleStageGames += appIds.length;
                    updateProgress(); resolve();
                },
                ontimeout: function() {
                    if (stage === 'RU') processedRuGames += appIds.length;
                    else if (stage === 'US') processedUsGames += appIds.length;
                    else if (stage === 'SINGLE_FETCH') processedSingleStageGames += appIds.length;
                    updateProgress(); resolve();
                }
            });
        });
    }

    async function startDataCollection() {
        if (isProcessingStarted) return;
        isProcessingStarted = true;
        processedRuGames = 0; processedUsGames = 0; processedSingleStageGames = 0;
        requestQueue = []; gameData = {};
        const rows = document.querySelectorAll('tr.app[data-appid]');
        collectedAppIds = new Set(Array.from(rows).map(r => r.dataset.appid));
        totalGamesOnPage = collectedAppIds.size;

        if (totalGamesOnPage === 0) {
            isProcessingStarted = false;
            updateButtonAndStatus(PROCESS_BUTTON_TEXT.idle, isRuModeActive ? STATUS_TEXT.ready_to_process : STATUS_TEXT.rrc_disabled, false, true);
            return;
        }
        const batches = Array.from(collectedAppIds).reduce((acc, id, i) => {
            if (i % BATCH_SIZE === 0) acc.push([]);
            acc[acc.length - 1].push(id);
            return acc;
        }, []);

        if (isRuModeActive) {
            currentProcessingStage = 'RU';
            updateButtonAndStatus(PROCESS_BUTTON_TEXT.processing_ru, STATUS_TEXT.processing_ru);
            requestQueue = batches.map(batch => ({ batch, stage: 'RU', lang: 'russian', cc: 'RU' }));
        } else {
            currentProcessingStage = 'SINGLE_FETCH';
            updateButtonAndStatus(PROCESS_BUTTON_TEXT.processing_single, STATUS_TEXT.processing_single);
            const currentCC = document.querySelector('details#js-select-cc input[name="cc"]:checked')?.value || document.querySelector('details#js-select-cc')?.dataset.default || 'us';
            requestQueue = batches.map(batch => ({ batch, stage: 'SINGLE_FETCH', lang: 'english', cc: currentCC }));
        }
        updateProgress();
        await processRequestQueue();
    }

    function updateButtonAndStatus(btnText, statusMsg, isDone = false, enableButton = false) {
        const processBtnTextEl = document.getElementById('process-btn-text');
        if (processBtnTextEl) processBtnTextEl.textContent = btnText;

        const statusIndicator = document.querySelector('.steamdb-enhancer .status-indicator');
        if (statusIndicator) {
            statusIndicator.textContent = statusMsg;
            statusIndicator.classList.toggle('status-active', isDone);
            statusIndicator.classList.toggle('status-inactive', !isDone && !isProcessingStarted);
        }
        if (processButton) processButton.disabled = !enableButton && isProcessingStarted;
    }

    function updateProgress() {
        const progressBar = document.querySelector('.steamdb-enhancer .progress-bar');
        const progressCountEl = document.querySelector('.steamdb-enhancer .progress-count');
        const progressPercentEl = document.querySelector('.steamdb-enhancer .progress-percent');
        if (!progressBar || !progressCountEl || !progressPercentEl) return;
        let overallPercent = 0; let countText = "0/0";

        if (totalGamesOnPage > 0) {
            if (isRuModeActive) {
                if (currentProcessingStage === 'RU') {
                    overallPercent = (processedRuGames / totalGamesOnPage) * 50;
                    countText = `Этап RU: ${processedRuGames}/${totalGamesOnPage}`;
                } else if (currentProcessingStage === 'US') {
                    overallPercent = 50 + (processedUsGames / totalGamesOnPage) * 50;
                    countText = `Этап US: ${processedUsGames}/${totalGamesOnPage}`;
                }
            } else {
                overallPercent = (processedSingleStageGames / totalGamesOnPage) * 100;
                countText = `Обработано: ${processedSingleStageGames}/${totalGamesOnPage}`;
            }
        }
        overallPercent = Math.min(overallPercent, 100);
        progressBar.style.width = `${overallPercent}%`;
        progressCountEl.textContent = countText;
        progressPercentEl.textContent = `(${Math.round(overallPercent)}%)`;

        if (!isProcessingStarted && processButton) {
            const processBtnTextEl = document.getElementById('process-btn-text');
            if (processBtnTextEl) processBtnTextEl.textContent = PROCESS_BUTTON_TEXT.idle;
            processButton.disabled = false;
        }
    }

    function handleHover(event) {
        const row = event.target.closest('tr.app');
        if (!row || tooltip?.style?.opacity === '1') return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
            const appId = row.dataset.appid;
            if (gameData[appId] && (gameData[appId].franchises || gameData[appId].language_support_russian)) {
                showTooltip(row, gameData[appId]);
            }
        }, HOVER_DELAY);
        row.addEventListener('mouseleave', hideTooltip, { once: true });
    }

    function hideTooltip() {
        clearTimeout(hoverTimer);
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => { if (tooltip && tooltip.style.opacity === '0') tooltip.style.display = 'none'; }, 250);
        }
    }

    function showTooltip(element, data) {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'steamdb-tooltip';
            tooltip.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
            tooltip.addEventListener('mouseleave', hideTooltip);
            document.body.appendChild(tooltip);
        }
        tooltip.innerHTML = `<div class="tooltip-arrow"></div><div class="tooltip-content">${buildTooltipContent(data)}</div>`;
        const rect = element.getBoundingClientRect(); const tooltipRect = tooltip.getBoundingClientRect();
        let left = rect.right + window.scrollX + 10; let top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);
        top = Math.max(window.scrollY + 5, top); top = Math.min(window.scrollY + window.innerHeight - tooltipRect.height - 5, top);
        const arrow = tooltip.querySelector('.tooltip-arrow');
        if (left + tooltipRect.width > window.scrollX + window.innerWidth - 10) {
            left = rect.left + window.scrollX - tooltipRect.width - 10;
            arrow.style.left = 'auto'; arrow.style.right = '-10px'; arrow.style.borderRight = 'none'; arrow.style.borderLeft = '10px solid #1b2838';
        } else {
            arrow.style.left = '-10px'; arrow.style.right = 'auto'; arrow.style.borderLeft = 'none'; arrow.style.borderRight = '10px solid #1b2838';
        }
        arrow.style.top = `${Math.max(5, Math.min(tooltipRect.height - 15, (element.offsetHeight / 2) - 5))}px`;
        tooltip.style.left = `${left}px`; tooltip.style.top = `${top}px`; tooltip.style.display = 'block';
        requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
    }

    function buildTooltipContent(data) {
        const reviewClass = getReviewClass(data.percent_positive, data.review_count);
        const earlyAccessClass = data.is_early_access ? 'early-access-yes' : 'early-access-no';
        let languageSupportRussianText = "Отсутствует"; let languageSupportRussianClass = 'language-no';
        if (data.language_support_russian) {
            let content = [];
            if (data.language_support_russian.supported) content.push("Интерфейс");
            if (data.language_support_russian.subtitles) content.push("Субтитры");
            if (data.language_support_russian.full_audio) content.push("<u>Озвучка</u>");
            languageSupportRussianText = content.join(', ') || "Нет данных";
            languageSupportRussianClass = content.length > 0 ? 'language-yes' : 'language-no';
        }
        let languageSupportEnglishText = "Отсутствует"; let languageSupportEnglishClass = 'language-no';
        if (data.language_support_english) {
            let content = [];
            if (data.language_support_english.supported) content.push("Интерфейс");
            if (data.language_support_english.subtitles) content.push("Субтитры");
            if (data.language_support_english.full_audio) content.push("<u>Озвучка</u>");
            languageSupportEnglishText = content.join(', ') || "Нет данных";
            languageSupportEnglishClass = content.length > 0 ? 'language-yes' : 'language-no';
        }
        return `
            <div class="group-top"><div class="tooltip-row compact"><strong>Серия игр:</strong> <span class="${!data.franchises ? 'no-data' : ''}">${data.franchises || "Нет данных"}</span></div></div>
            <div class="group-middle">
                <div class="tooltip-row spaced"><strong>Отзывы:</strong> <span class="${reviewClass}">${data.percent_positive !== undefined ? data.percent_positive + '%' : "Нет данных"}</span> (${data.review_count || "0"})</div>
                <div class="tooltip-row spaced"><strong>Ранний доступ:</strong> <span class="${earlyAccessClass}">${data.is_early_access ? "Да" : "Нет"}</span></div>
            </div>
            <div class="group-bottom">
                <div class="tooltip-row language"><strong>Русский язык:</strong> <span class="${languageSupportRussianClass}">${languageSupportRussianText}</span></div>
                ${scriptsConfig.toggleEnglishLangInfo ? `<div class="tooltip-row language"><strong>Английский язык:</strong> <span class="${languageSupportEnglishClass}">${languageSupportEnglishText}</span></div>` : ''}
            </div>
            <div class="tooltip-row description"><strong>Описание:</strong> <span class="${!data.short_description ? 'no-data' : ''}">${data.short_description || "Нет данных"}</span></div>`;
    }

    function getReviewClass(percent, totalReviews) {
        if (totalReviews === undefined || totalReviews === null || totalReviews === 0) return 'no-reviews';
        if (percent === undefined || percent === null) return 'no-reviews';
        if (percent >= 70) return 'positive';
        if (percent >= 40) return 'mixed';
        return 'negative';
    }

    function reinitializePanel() {
        const oldFiltersContainer = document.querySelector('.steamdb-enhancer');
        if (oldFiltersContainer) {
            const parent = oldFiltersContainer.parentNode;
            const nextSibling = oldFiltersContainer.nextElementSibling;
            oldFiltersContainer.remove();

            const newFiltersContainer = createFiltersContainer();
            parent.insertBefore(newFiltersContainer, nextSibling);

            processButton = document.getElementById('process-btn');
            if(processButton) {
                processButton.addEventListener('click', () => {
                    const statusIndicator = document.querySelector('.steamdb-enhancer .status-indicator');
                    ensureAllEntriesAndCountdown(startDataCollection, statusIndicator, processButton);
                });
            }
            newFiltersContainer.addEventListener('click', handleMainPanelClick);
        }
        updateUiForCurrencyMode();
        document.querySelectorAll('tr.app[data-appid]').forEach(row => processAndStyleAtlDiscount(row));
    }

    function updateUiForCurrencyMode() {
        const rrcFilterGroup = document.querySelector('#rrc-filter-control-group');
        const statusIndicator = document.querySelector('.steamdb-enhancer .status-indicator');
        if (rrcFilterGroup) {
            rrcFilterGroup.style.display = isRuModeActive ? '' : 'none';
            if (!isRuModeActive) {
                activeRrcFilters = { lower: false, equal: false, higher: false };
                rrcFilterGroup.querySelectorAll('.btn.active').forEach(b => b.classList.remove('active'));
            }
        }
        if (statusIndicator && !isProcessingStarted) {
            statusIndicator.textContent = isRuModeActive ? STATUS_TEXT.ready_to_process : STATUS_TEXT.rrc_disabled;
        }
        if (document.querySelector('tr.app[data-appid]')) {
            applyAllFilters();
            if (!isRuModeActive) {
                document.querySelectorAll('.rrc-display-container').forEach(el => el.remove());
            }
        }
    }

    function processAndStyleAtlDiscount(row) {
        const catSpans = row.querySelectorAll('td:nth-child(3) span[class*="cat"]');
        const highestDiscountSpan = Array.from(catSpans).find(span => span.innerText.toLowerCase().includes('all-time low'));

        if (!highestDiscountSpan) {
            row.dataset.atlPercentStatus = 'no_data';
            return;
        }

        const atlText = highestDiscountSpan.innerText;
        const atlMatch = atlText.match(/at\s*-?(\d+)%/i);
        if (!atlMatch || !atlMatch[1]) {
            row.dataset.atlPercentStatus = 'no_data';
            return;
        }
        const historicalPercent = parseInt(atlMatch[1], 10);

        const currentDiscountCell = row.cells[3];
        const currentDiscountText = currentDiscountCell ? currentDiscountCell.innerText.trim() : '0%';
        const currentDiscountMatch = currentDiscountText.match(/-?(\d+)%/);
        const currentPercent = currentDiscountMatch ? parseInt(currentDiscountMatch[1], 10) : 0;

        let status = 'no_data';
        if (currentPercent > historicalPercent) {
            status = 'cheaper';
        } else if (currentPercent === historicalPercent) {
            status = 'equal';
        } else {
            status = 'more_expensive';
        }
        row.dataset.atlPercentStatus = status;

        const atlPercentTextNode = Array.from(highestDiscountSpan.childNodes).find(node => node.nodeType === Node.TEXT_NODE && /\s*at\s*-?\d+%/i.test(node.textContent));

        if (atlPercentTextNode) {
            const textContent = atlPercentTextNode.textContent;
            const match = textContent.match(/(\s*)(at\s*-?\d+%)(.*)/i);
            if (match) {
                const beforeText = match[1];
                const percentText = match[2];
                const afterText = match[3];

                const newSpan = document.createElement('span');
                newSpan.className = `atl-percent-text ${status}`;
                newSpan.textContent = percentText;

                const fragment = document.createDocumentFragment();
                if (beforeText) fragment.appendChild(document.createTextNode(beforeText));
                fragment.appendChild(newSpan);
                if (afterText) fragment.appendChild(document.createTextNode(afterText));

                highestDiscountSpan.replaceChild(fragment, atlPercentTextNode);
            }
        }
    }

    function setupCustomDiscountFilters(originalBlock) {
        originalBlock.innerHTML = '';
        originalBlock.classList.add('steamdb-custom-discount-filters');

        const mainTitle = document.createElement('div');
        mainTitle.className = 'filter-block-title';
        mainTitle.textContent = 'Фильтры по скидкам';
        originalBlock.appendChild(mainTitle);

        const absolutePriceSubtitle = document.createElement('div');
        absolutePriceSubtitle.className = 'filter-block-subtitle';
        absolutePriceSubtitle.textContent = 'Фильтры по абсолютной цене';
        originalBlock.appendChild(absolutePriceSubtitle);

        const absoluteDiscountTypes = [
            { type: 'blue', label: 'Ист. минимум', tooltipShow: 'Показать игры с исторически минимальной ценой', tooltipHide: 'Скрыть игры с исторически минимальной ценой' },
            { type: 'green', label: 'Повтор мин. цены', tooltipShow: 'Показать игры, соответствующие своей минимальной цене', tooltipHide: 'Скрыть игры, соответствующие своей минимальной цене' },
            { type: 'purple', label: 'Мин. за 2 года', tooltipShow: 'Показать игры с минимальной ценой за последние два года', tooltipHide: 'Скрыть игры с минимальной ценой за последние два года' }
        ];

        absoluteDiscountTypes.forEach(dt => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'discount-filter-row-steamdb';
            const showLabel = document.createElement('label');
            showLabel.className = `steamy-checkbox-control tooltipped tooltipped-${dt.type}`;
            showLabel.title = dt.tooltipShow;
            const showInput = document.createElement('input');
            showInput.type = 'checkbox';
            showInput.dataset.discountType = dt.type;
            showInput.dataset.filterMode = 'show';
            showInput.id = `enhancer-show-${dt.type}-discount`;
            const showSpan = document.createElement('span');
            showSpan.textContent = '';
            showLabel.appendChild(showInput);
            showLabel.appendChild(showSpan);
            const labelTextSpan = document.createElement('span');
            labelTextSpan.className = 'discount-filter-label-text-steamdb';
            labelTextSpan.textContent = dt.label;
            const hideLabel = document.createElement('label');
            hideLabel.className = `steamy-checkbox-control tooltipped tooltipped-${dt.type}`;
            hideLabel.title = dt.tooltipHide;
            const hideInput = document.createElement('input');
            hideInput.type = 'checkbox';
            hideInput.dataset.discountType = dt.type;
            hideInput.dataset.filterMode = 'hide';
            hideInput.id = `enhancer-hide-${dt.type}-discount`;
            const hideSpan = document.createElement('span');
            hideSpan.textContent = 'Скрыть';
            hideLabel.appendChild(hideInput);
            hideLabel.appendChild(hideSpan);
            rowDiv.appendChild(showLabel);
            rowDiv.appendChild(labelTextSpan);
            rowDiv.appendChild(hideLabel);
            originalBlock.appendChild(rowDiv);
        });
        updateDiscountFilterUI();

        const percentSubtitle = document.createElement('div');
        percentSubtitle.className = 'filter-block-subtitle';
        percentSubtitle.textContent = 'Фильтры по процентам в ист. мин.';
        originalBlock.appendChild(percentSubtitle);

        const percentDiscountTypes = [
            { type: 'percent_cheaper', label: '% < Минимума', colorClass: 'blue', tooltipShow: 'Показать игры, где текущий % скидки ВЫШЕ исторического % ATL', tooltipHide: 'Скрыть игры, где текущий % скидки ВЫШЕ исторического % ATL' },
            { type: 'percent_equal', label: '% = Минимуму', colorClass: 'green', tooltipShow: 'Показать игры, где текущий % скидки РАВЕН историческому % ATL', tooltipHide: 'Скрыть игры, где текущий % скидки РАВЕН историческому % ATL' },
            { type: 'percent_more_expensive', label: '% > Минимума', colorClass: 'purple', tooltipShow: 'Показать игры, где текущий % скидки НИЖЕ исторического % ATL', tooltipHide: 'Скрыть игры, где текущий % скидки НИЖЕ исторического % ATL' }
        ];

        percentDiscountTypes.forEach(dt => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'discount-filter-row-steamdb';
            const showLabel = document.createElement('label');
            showLabel.className = `steamy-checkbox-control tooltipped tooltipped-${dt.colorClass}`;
            showLabel.title = dt.tooltipShow;
            const showInput = document.createElement('input');
            showInput.type = 'checkbox';
            showInput.dataset.discountType = dt.type;
            showInput.dataset.filterMode = 'show';
            showInput.id = `enhancer-show-${dt.type}-discount`;
            const showSpan = document.createElement('span');
            showSpan.textContent = '';
            showLabel.appendChild(showInput);
            showLabel.appendChild(showSpan);
            const labelTextSpan = document.createElement('span');
            labelTextSpan.className = 'discount-filter-label-text-steamdb';
            labelTextSpan.textContent = dt.label;
            const hideLabel = document.createElement('label');
            hideLabel.className = `steamy-checkbox-control tooltipped tooltipped-${dt.colorClass}`;
            hideLabel.title = dt.tooltipHide;
            const hideInput = document.createElement('input');
            hideInput.type = 'checkbox';
            hideInput.dataset.discountType = dt.type;
            hideInput.dataset.filterMode = 'hide';
            hideInput.id = `enhancer-hide-${dt.type}-discount`;
            const hideSpan = document.createElement('span');
            hideSpan.textContent = 'Скрыть';
            hideLabel.appendChild(hideInput);
            hideLabel.appendChild(hideSpan);
            rowDiv.appendChild(showLabel);
            rowDiv.appendChild(labelTextSpan);
            rowDiv.appendChild(hideLabel);
            originalBlock.appendChild(rowDiv);
        });
        updateDiscountFilterUI();
    }

    async function init() {
        isRuModeActive = isRuCurrencySelected();
        await fetchAndStoreTags();

        const style = document.createElement('style');
        style.textContent = styles;
        document.head.append(style);

        createTagFilterModal();

        const header = document.querySelector('.header-title');
        if (header) {
            const filtersContainer = createFiltersContainer();
            header.parentNode.insertBefore(filtersContainer, header.nextElementSibling);
            processButton = document.getElementById('process-btn');
            if(processButton) {
                processButton.addEventListener('click', () => {
                    const statusIndicator = document.querySelector('.steamdb-enhancer .status-indicator');
                    ensureAllEntriesAndCountdown(startDataCollection, statusIndicator, processButton);
                });
            }
            filtersContainer.addEventListener('click', handleMainPanelClick);

            document.getElementById('review-min-count').addEventListener('input', handleReviewFilterChange);
            document.getElementById('review-max-count').addEventListener('input', handleReviewFilterChange);
            document.getElementById('review-min-rating').addEventListener('input', handleReviewFilterChange);
            document.getElementById('review-max-rating').addEventListener('input', handleReviewFilterChange);

            document.getElementById('total-sort-checkbox').addEventListener('change', (event) => {
                isTotalSortEnabled = event.target.checked;
                applyTotalSort();
            });

        } else {
            return;
        }

        const steamDbFilterForm = document.getElementById('js-filters');
        let originalDiscountBlock = null;
        if (steamDbFilterForm) {
            const allFilterBlocks = steamDbFilterForm.querySelectorAll('div.filter-block');
            for (let block of allFilterBlocks) {
                if (block.querySelector('input[id^="js-discounts-"]')) {
                    originalDiscountBlock = block;
                    break;
                }
            }
        }

        if (originalDiscountBlock) {
            setupCustomDiscountFilters(originalDiscountBlock);
            originalDiscountBlock.addEventListener('change', handleDiscountFilterChange);
        }

        document.querySelectorAll('tr.app[data-appid]').forEach(row => processAndStyleAtlDiscount(row));
        const observerOptions = { childList: true, subtree: true };
        const tableBody = document.querySelector('#DataTables_Table_0 tbody');
        if (tableBody) {
            const tableObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.matches('tr.app[data-appid]')) {
                                processAndStyleAtlDiscount(node);
                            }
                        });
                    }
                }
                if (typeof $ !== 'undefined' && $.fn.dataTable && $.fn.dataTable.isDataTable('#DataTables_Table_0')) {
                    $('#DataTables_Table_0').DataTable().rows().nodes().to$().each(function() {
                        processAndStyleAtlDiscount(this);
                    });
                }
            });
            tableObserver.observe(tableBody, observerOptions);
            if (typeof $ !== 'undefined' && $.fn.dataTable) {
                $(document).on('draw.dt', function (e, settings) {
                    if (settings.nTable.id === 'DataTables_Table_0') {
                        $('#DataTables_Table_0').DataTable().rows().nodes().to$().each(function() {
                            processAndStyleAtlDiscount(this);
                        });
                    }
                });
            }
        }

        document.querySelector('#DataTables_Table_0 tbody')?.addEventListener('mouseover', handleHover);

        const currencyDropdown = document.querySelector('details#js-select-cc');
        if (currencyDropdown) {
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-default' ||
                        mutation.target.nodeName === 'INPUT' && mutation.target.type === 'radio' && mutation.target.name === 'cc') {
                        const newRuMode = isRuCurrencySelected();
                        if (newRuMode !== isRuModeActive) {
                            isRuModeActive = newRuMode;
                            reinitializePanel();
                        }
                        break;
                    }
                }
            });
            observer.observe(currencyDropdown, { attributes: true, childList: true, subtree: true });
        }

        const typeDropdown = document.getElementById('js-select-type');
        if (typeDropdown) {
            const typeObserver = new MutationObserver(() => {
                reinitializePanel();
            });
            typeDropdown.querySelectorAll('input[name="displayOnly"]').forEach(radio => {
                typeObserver.observe(radio, { attributes: true, attributeFilter: ['checked'] });
            });
            typeObserver.observe(typeDropdown, { childList: true, subtree: true });
        }

        updateButtonAndStatus(PROCESS_BUTTON_TEXT.idle, isRuModeActive ? STATUS_TEXT.ready_to_process : STATUS_TEXT.rrc_disabled, false, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();