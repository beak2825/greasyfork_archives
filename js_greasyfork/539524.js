// ==UserScript==
// @name AnimeStars Deck Tracker
// @namespace http://tampermonkey.net/
// @version 5.1
// @description Ручной трекер колод с экспортом.
// @author Sandr
// @match *://animestars.org/*
// @match *://asstars.tv/*
// @match *://astars.club/*
// @match *://as1.astars.club/*
// @match *://as1.asstars.tv/*
// @match *://as2.asstars.tv/*
// @match *://asstars.club/*
// @match *://asstars.online/*
// @noframes
// @grant GM_getValue
// @grant GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539524/AnimeStars%20Deck%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/539524/AnimeStars%20Deck%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- ОБЩИЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ ---
    const normalize = str => str.trim().toLowerCase();
    const STORAGE_KEY = 'localDecks';
    const STATE_KEY = 'deckUIState';
    const S_KEY = 'sDecks';
    const SESSION_OPEN_KEY = 'deckManagerIsOpen';
    const HIGHLIGHT_KEY = 'highlightEnabled';
    const HISTORY_KEY = 'deckChangeHistory';

    let decks = GM_getValue(STORAGE_KEY, {});
    let uiState = GM_getValue(STATE_KEY, {
    top: 100,
    left: 100,
    right: null,
    anchorSide: 'left',
    isPinned: false,
    filter: "",
    width: 600,
    height: 500,
    scrollTop: 0
});
    let observer;
    let sDecks = GM_getValue(S_KEY, {});
    let highlightEnabled = GM_getValue(HIGHLIGHT_KEY, false);
    const saveDecks = () => GM_setValue(STORAGE_KEY, decks);
    const saveState = () => GM_setValue(STATE_KEY, uiState);
    const saveSDecks = () => GM_setValue(S_KEY, sDecks);
    const saveHighlightState = () => GM_setValue(HIGHLIGHT_KEY, highlightEnabled);

    const STATUS_STYLES = {
        collected: { text: 'Собрано', color: 'white', background: '#4caf50' },
        progress:  { text: 'В процессе', color: 'black', background: '#ffeb3b' },
        unknown:   { text: 'Без отметки', color: 'white', background: '#2196f3' }
    };
    const currentUsername = document.querySelector('.lgn__name span')?.textContent.trim() || '';
    const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

    // --- ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ ИНДИКАТОРОВ НА СТРАНИЦЕ ---
function updateIndicators() {
    const TITLE_COLORS = {
        collected: '#4caf50', // Зеленый
        progress: '#ffeb3b', // Желтый
        unknown: '#2196f3', // Синий
        S: '#f44336' // Красный
    };

    document.querySelectorAll('.user-anime').forEach(root => {
        const anchor = root.querySelector('.user-anime__title');
        if (!anchor) return;
        const title = anchor.textContent.trim();
        if (normalize(title) === 'полные колоды') return;
        const normTitle = normalize(title);
        const countDiv = root.querySelector('.user-anime__card-count');
        if (!countDiv) return;
        const currentDataState = sDecks[normTitle] ? 'S' : (decks[normTitle] ? decks[normTitle] : 'add');
        const newColor = TITLE_COLORS[currentDataState] || '';
        if (anchor.style.color !== newColor) {
             anchor.style.color = newColor;
        }

        let masterContainer = countDiv.querySelector('.script-buttons-container');
        if (!masterContainer) {
            masterContainer = document.createElement('div');
            masterContainer.className = 'script-buttons-container';
            masterContainer.style.cssText = 'display: inline-flex; align-items: center; gap: 5px; margin-left: 10px;';
            countDiv.style.display = 'inline-flex';
            countDiv.style.alignItems = 'center';
            countDiv.appendChild(masterContainer);
        }

        let deckTrackerContainer = masterContainer.querySelector('.deck-tracker-buttons');
        if (!deckTrackerContainer) {
            deckTrackerContainer = document.createElement('div');
            deckTrackerContainer.className = 'deck-tracker-buttons';
            deckTrackerContainer.style.display = 'inline-flex';
            deckTrackerContainer.style.gap = '5px';
            masterContainer.appendChild(deckTrackerContainer);
        }

        const displayedState = deckTrackerContainer.dataset.state;
        if (currentDataState === displayedState) {
            return;
        }

        deckTrackerContainer.innerHTML = '';
        deckTrackerContainer.dataset.state = currentDataState;

        // Создаем единый базовый стиль для всех кнопок/индикаторов
        const BASE_BUTTON_STYLE = `
            /* --- ГЛАВНЫЕ НАСТРОЙКИ РАЗМЕРА --- */
            padding: 7px 5px !important;       /* Внутренние отступы (вертикаль / горизонталь) */
            font-size: 14px !important;        /* Размер текста */
            line-height: 1.2 !important;       /* Высота строки, должна быть чуть больше шрифта */

            /* --- СБРОС СТИЛЕЙ САЙТА --- */
            height: auto !important;           /* Сбрасываем фиксированную высоту */
            min-width: 0 !important;           /* Сбрасываем минимальную ширину */

            /* --- ОСТАЛЬНЫЕ СТИЛИ --- */
            border-radius: 4px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            display: inline-flex !important;   /* Используем flex для лучшего центрирования */
            align-items: center !important;    /* Центрируем текст по вертикали */
            justify-content: center !important;/* Центрируем текст по горизонтали */
            text-transform: none !important;
            border: none !important;
        `;

        if (currentDataState === 'add') {

            // Кнопка "Добавить"
            const btnAdd = document.createElement('button');
            btnAdd.textContent = 'Добавить';
            btnAdd.className = 'deck-add-btn';
            btnAdd.title = 'Добавить в локальный список (без отметки)';

            // Применяем базовый стиль + уникальные цвета
            btnAdd.style.cssText = `${BASE_BUTTON_STYLE} background-color:#ccc; color:#000;`;
            btnAdd.onclick = () => {
                decks[normTitle] = 'unknown';
                saveDecks();
                debouncedUpdate();
            };
            deckTrackerContainer.appendChild(btnAdd);

            // Кнопка "Добавить с S"
            const btnAddS = document.createElement('button');
            btnAddS.textContent = 'Есть S';
            btnAddS.className = 'deck-add-s-btn';
            btnAddS.title = 'Добавить в список "Есть S"';

            // Применяем базовый стиль + уникальные цвета
            btnAddS.style.cssText = `${BASE_BUTTON_STYLE} background-color:#9a2951; color:white;`;
            btnAddS.onclick = () => {
                sDecks[normTitle] = true;
                saveSDecks();
                debouncedUpdate();
            };
            deckTrackerContainer.appendChild(btnAddS);

        } else if (currentDataState === 'S') {
            const btnRemoveS = document.createElement('button');
            btnRemoveS.textContent = 'Удалить с S';
            btnRemoveS.title = 'Полностью удалить колоду из списков';
            btnRemoveS.style.cssText = `${BASE_BUTTON_STYLE} background-color:#f44336; color:white;`;
            btnRemoveS.onclick = () => {
                 showCustomConfirm(`Вы уверены, что хотите полностью удалить "${title}" из S-списка? Это действие необратимо.`, () => {
                    delete sDecks[normTitle];
                    saveSDecks();
                    saveDecks();
                    debouncedUpdate();
                });
            };
            deckTrackerContainer.appendChild(btnRemoveS);

        } else {
            const status = decks[normTitle];
            const indicator = document.createElement('span');
            const styleInfo = STATUS_STYLES[status] || STATUS_STYLES.unknown;
            indicator.textContent = styleInfo.text;
            indicator.style.cssText = `${BASE_BUTTON_STYLE} background-color:${styleInfo.background}; color:${styleInfo.color};`;
            const actions = {
                'unknown': { title: 'Кликните, чтобы отметить как "в процессе"', newStatus: 'progress' },
                'progress': { title: 'Кликните, чтобы отметить как "собрано"', newStatus: 'collected' },
                'collected': { title: 'Кликните, чтобы удалить из списка' }
            };
            const action = actions[status];
            indicator.title = action.title;
            indicator.onclick = () => {
                if (status === 'collected') {
                        delete decks[normTitle];
                        saveDecks();
                        debouncedUpdate();
                } else if (action.newStatus) {
                    decks[normTitle] = action.newStatus;
                    delete sDecks[normTitle];
                    saveDecks();
                    saveSDecks();
                    debouncedUpdate();
                }
            };
            deckTrackerContainer.appendChild(indicator);
        }
    });
}

// --- ФУНКЦИЯ ПОДСВЕТКИ КАРТОЧЕК ---
    function highlightCards() {
        if (!highlightEnabled) {
            document.querySelectorAll('.anime-cards__item[data-deck-status]').forEach(card => {
                card.removeAttribute('data-deck-status');
            });
            return;
        }
        document.querySelectorAll('.anime-cards__item').forEach(card => {
            const animeName = card.dataset.animeName?.trim().toLowerCase();
            if (!animeName) return;
            let status = sDecks[animeName] ? 'S' : (decks[animeName] || null);
            if (status) {
                card.setAttribute('data-deck-status', status);
            } else {
                card.setAttribute('data-deck-status', 'none'); // если нет в списках
            }
        });
        if (!document.getElementById('deckHighlightStyles')) {
            const style = document.createElement('style');
            style.id = 'deckHighlightStyles';
            style.textContent = `
                .anime-cards__item[data-deck-status] {
                    position: relative;
                }
                .anime-cards__item[data-deck-status]::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    border-radius: 3px; /* скругляем полоску */
                }
                .anime-cards__item[data-deck-status="collected"]::after { background: #4caf50; }
                .anime-cards__item[data-deck-status="progress"]::after  { background: #ffeb3b; }
                .anime-cards__item[data-deck-status="unknown"]::after    { background: #2196f3; }
                .anime-cards__item[data-deck-status="S"]::after          { background: #f44336; }
                .anime-cards__item[data-deck-status="none"]::after       { background: white; }
            `;
            document.head.appendChild(style);
        }
    }

// --- ОКРАШИВАНИЕ ИНДИКАТОРА И ДОБАВЛЕНИЕ ССЫЛКИ В МОДАЛЬНОМ ОКНЕ ---
function updateModalIndicatorColor() {
    const modal = document.getElementById('card-modal');
    if (!modal || !currentUsername) return;
    const animeTitleElement = modal.querySelector('.anime-cards__link span');
    if (!animeTitleElement) return;
    const normTitle = normalize(animeTitleElement.textContent);
    const rankElement = modal.querySelector('.ncard__rank');
    if (!rankElement) return;
    const iconElement = rankElement.querySelector('.fa-award');
    if (!iconElement) return;
    const status = sDecks[normTitle] ? 'S' : (decks[normTitle] || null);
    const TITLE_COLORS = {
        collected: '#4caf50', // зелёный
        progress: '#ffeb3b', // жёлтый
        unknown: '#2196f3', // синий
        delete: '#9e9e9e', // серый "удалить"
        S: '#f44336' // красный для "есть S"
    };
    const newColor = status ? TITLE_COLORS[status] : '';
    if (iconElement.style.color !== newColor) {
        iconElement.style.color = newColor;
    }
    let link = rankElement.querySelector('a.deck-tracker-modal-link');
    if (!link) {
        link = document.createElement('a');
        link.href = `/user/${currentUsername}/cards_progress/?search=${encodeURIComponent(normTitle)}`;
        link.className = 'deck-tracker-modal-link';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';
        link.style.cursor = 'pointer';
        rankElement.insertBefore(link, iconElement);
        link.appendChild(iconElement);

        // Добавляем прокрутку колесиком для смены статуса
        link.addEventListener('wheel', (e) => {
            e.preventDefault();
            const statuses = ['unknown', 'progress', 'collected', 'delete', 'S'];
            let currentStatus = sDecks[normTitle] ? 'S' : (decks[normTitle] || 'delete');
            let idx = statuses.indexOf(currentStatus);
            if (e.deltaY > 0) {
                idx = (idx + 1) % statuses.length;
            } else {
                idx = (idx - 1 + statuses.length) % statuses.length;
            }
            const newStatus = statuses[idx];
            if (newStatus === 'S') {
                sDecks[normTitle] = true;
                delete decks[normTitle];
            } else if (newStatus === 'delete') {
                delete decks[normTitle];
                delete sDecks[normTitle];
            } else {
                decks[normTitle] = newStatus;
                delete sDecks[normTitle];
            }
            saveDecks();
            saveSDecks();
            debouncedUpdate();
            updateModalIndicatorColor();
            if (document.getElementById('deckModal')) {
                renderDeckList();
                updateFilterCounts();
            }
        }, { passive: false });
    }

    // 🔔 Подсказка: всегда показываем "Перейти к колоде..."
    let baseTitle = `Перейти к колоде "${animeTitleElement.textContent.trim()}"`;
    if (sDecks[normTitle]) {
        link.title = `${baseTitle}\n(статус нельзя изменить — есть в списке S)`;
    } else {
        link.title = `${baseTitle}\n(🔄колёсико — смена статуса)`;
    }
}

    // --- МЕНЕДЖЕР КОЛОД (ВСПЛЫВАЮЩЕЕ ОКНО) ---
function openDeckManager() {
    if (document.getElementById('deckModal')) return;
    sessionStorage.setItem(SESSION_OPEN_KEY, 'true');
    const modal = document.createElement('div');
    modal.id = 'deckModal';
    modal.style.position = 'fixed';
    modal.style.background = '#222';
    modal.style.color = '#fff';
    modal.style.zIndex = '999999';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    if (isMobile) {
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw'; // Viewport width
        modal.style.height = '100vh'; // Viewport height
        modal.style.borderRadius = '0'; // No border radius on mobile
        modal.style.boxShadow = 'none'; // No shadow on mobile
        modal.style.minWidth = 'unset'; // Remove min-width
        modal.style.minHeight = 'unset'; // Remove min-height
        modal.style.overflowY = 'auto'; // Enable scrolling for content
    } else {
        const positionStyle = uiState.anchorSide === 'right' && uiState.right !== null
            ? `right:${uiState.right}px;`
            : `left:${uiState.left}px;`;
        modal.style.top = `${uiState.top}px`;
        if (uiState.anchorSide === 'right' && uiState.right !== null) {
            modal.style.right = `${uiState.right}px`;
            modal.style.left = '';
        } else {
            modal.style.left = `${uiState.left}px`;
            modal.style.right = '';
        }
        modal.style.width = `${uiState.width}px`;
        modal.style.height = `${uiState.height}px`;
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 0 10px black';
        modal.style.minWidth = '550px';
        modal.style.minHeight = '200px';
    }

modal.innerHTML = `
<div id="deckModalHeader" style="display:flex;align-items:center;padding:10px 20px;border-bottom:1px solid #444;">
    <h3 style="margin:0; flex-grow:1;">Менеджер колод</h3>
    <input id="deckSearch" placeholder="Поиск..." style="margin-left:15px;flex:1;padding:5px;background:#333;border:1px solid #555;border-radius:15px;color:#fff;">
    <button id="clearSearchBtn" title="Очистить поиск" style="margin-left:-35px; margin-right: 10px; width:20px; height:20px; background:transparent; border:none; color:#aaa; border-radius:50%; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center;">✖️</button>
    <button id="deckCloseBtn" style="margin-left:10px; background:#555; border:none; color:#fff; border-radius:50%; width: 35px; height: 40px; cursor:pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">❌</button>
</div>
<div id="deckList" style="padding:10px 20px; flex: 1; min-height: 0; overflow-y: auto;"></div>
<div id="deckModalFooter" style="padding:10px 20px;border-top:1px solid #444;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
    <button id="exportAllBtn" title="Экспорт/Бэкап" style="background:none; border:none; cursor:pointer; padding:5px;">
        <svg width="30" height="30" viewBox="-51.2 -51.2 614.40 614.40" fill="#2cdd08" stroke="#2cdd08">
            <path d="M243.591,309.362c3.272,4.317,7.678,6.692,12.409,6.692c4.73,0,9.136-2.376,12.409-6.689l89.594-118.094
                   c3.348-4.414,4.274-8.692,2.611-12.042c-1.666-3.35-5.631-5.198-11.168-5.198H315.14c-9.288,0-16.844-7.554-16.844-16.84V59.777
                   c0-11.04-8.983-20.027-20.024-20.027h-44.546c-11.04,0-20.022,8.987-20.022,20.027v97.415c0,9.286-7.556,16.84-16.844,16.84
                   h-34.305c-5.538,0-9.503,1.848-11.168,5.198c-1.665,3.35-0.738,7.628,2.609,12.046L243.591,309.362z"></path>
            <path d="M445.218,294.16v111.304H66.782V294.16H0v152.648c0,14.03,11.413,25.443,25.441,25.443h461.118
                   c14.028,0,25.441-11.413,25.441-25.443V294.16H445.218z"></path>
        </svg>
    </button>
    <button id="importAllBtn" title="Загрузить (без статуса)" style="background:none; border:none; cursor:pointer; padding:5px;">
        <svg width="34" height="34" viewBox="0 0 48 48" fill="#DAA520">
            <path d="M25.1767767,20.7521555 L30.8336309,26.4090097 C31.3217863,26.8971651 31.3217863,27.6886213 30.8336309,28.1767767
                   C30.3454756,28.6649321 29.5540194,28.6649321 29.065864,28.1767767 L25.499039,24.610039 L25.5,38 C25.5,38.6472087
                   25.0081253,39.1795339 24.3778052,39.2435464 L24.25,39.25 C23.6027913,39.25 23.0704661,38.7581253 23.0064536,38.1278052
                   L23,38 L22.999039,24.696039 L19.5199224,28.1767767 C19.0317671,28.6649321 18.2403109,28.6649321 17.7521555,28.1767767
                   C17.2640001,27.6886213 17.2640001,26.8971651 17.7521555,26.4090097 L23.4090097,20.7521555 C23.8971651,20.2640001
                   24.6886213,20.2640001 25.1767767,20.7521555 Z M24.0011082,9.01781011 C30.3381703,9.01781011 33.9330779,13.2123909 34.4559068,18.2780629
                   L34.6158392,18.2780577 C38.6939986,18.2780577 42,21.5755054 42,25.6431133 C42,29.7107212 38.6939986,33.0081689 34.6158392,33.0081689
                   L29.25,33 C28.6027913,33 28.0704661,32.5081253 28.0064536,31.8778052 L28,31.75 C28,31.1027913 28.4918747,30.5704661
                   29.1221948,30.5064536 L29.25,30.5 L34.8041625,30.5129895 C37.3982331,30.5129895 39.5011427,28.3991642 39.5011427,25.7916285
                   C39.5011427,23.1840929 37.3982331,21.0702676 34.8042083,21.0702676 L33.3835784,21.070314 C32.6322761,21.0703385
                   31.9761435,20.4781889 31.9761435,19.7235607 C31.9761435,14.8998476 28.2621633,11.5129895 24.0011082,11.5129895
                   C19.740053,11.5129895 16.0260728,14.9609421 16.0260728,19.7235607 C16.0260728,20.4781889 15.3699402,21.0703385 14.6186379,21.070314
                   L13.1980538,21.0702676 C10.6039833,21.0702676 8.50107362,23.1840929 8.50107362,25.7916285 C8.50107362,28.3991642
                   10.6039833,30.5129895 13.1980538,30.5129895 L18.75,30.5 C19.4403559,30.5 20,31.0596441 20,31.75 C20,32.3972087
                   19.5081253,32.9295339 18.8778052,32.9935464 L18.75,33 L13.3863771,33.0081689 C9.3082177,33.0081689 6.00221632,29.7107212
                   6.00221632,25.6431133 C6.00221632,21.6568576 9.17730005,18.4102636 13.1426767,18.2819944 L13.5463095,18.2780629
                   C14.0721799,13.1790956 17.664046,9.01781011 24.0011082,9.01781011 Z"></path>
        </svg>
    </button>
    <button id="exportNamesBtn" title="Скачать названия колод без S (текстовый файл)" style="background:none; border:none; cursor:pointer; padding:5px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#f7f7f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 13H16M8 17H12" stroke="#f7f7f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>

    <div style="width:1px; height: 24px; background-color: #555; margin: 0 5px;"></div>

    <button id="importBackupBtn" title="Восстановить из бэкапа (ЗАМЕНИТ текущие данные)" style="background:none; border:none; cursor:pointer; padding:5px;">
        <svg width="34" height="34" viewBox="0 0 48 48" fill="#ff0033">
            <path d="M25.1767767,20.7521555 L30.8336309,26.4090097 C31.3217863,26.8971651 31.3217863,27.6886213 30.8336309,28.1767767
                   C30.3454756,28.6649321 29.5540194,28.6649321 29.065864,28.1767767 L25.499039,24.610039 L25.5,38 C25.5,38.6472087
                   25.0081253,39.1795339 24.3778052,39.2435464 L24.25,39.25 C23.6027913,39.25 23.0704661,38.7581253 23.0064536,38.1278052
                   L23,38 L22.999039,24.696039 L19.5199224,28.1767767 C19.0317671,28.6649321 18.2403109,28.6649321 17.7521555,28.1767767
                   C17.2640001,27.6886213 17.2640001,26.8971651 17.7521555,26.4090097 L23.4090097,20.7521555 C23.8971651,20.2640001
                   24.6886213,20.2640001 25.1767767,20.7521555 Z M24.0011082,9.01781011 C30.3381703,9.01781011 33.9330779,13.2123909 34.4559068,18.2780629
                   L34.6158392,18.2780577 C38.6939986,18.2780577 42,21.5755054 42,25.6431133 C42,29.7107212 38.6939986,33.0081689 34.6158392,33.0081689
                   L29.25,33 C28.6027913,33 28.0704661,32.5081253 28.0064536,31.8778052 L28,31.75 C28,31.1027913 28.4918747,30.5704661
                   29.1221948,30.5064536 L29.25,30.5 L34.8041625,30.5129895 C37.3982331,30.5129895 39.5011427,28.3991642 39.5011427,25.7916285
                   C39.5011427,23.1840929 37.3982331,21.0702676 34.8042083,21.0702676 L33.3835784,21.070314 C32.6322761,21.0703385
                   31.9761435,20.4781889 31.9761435,19.7235607 C31.9761435,14.8998476 28.2621633,11.5129895 24.0011082,11.5129895
                   C19.740053,11.5129895 16.0260728,14.9609421 16.0260728,19.7235607 C16.0260728,20.4781889 15.3699402,21.0703385 14.6186379,21.070314
                   L13.1980538,21.0702676 C10.6039833,21.0702676 8.50107362,23.1840929 8.50107362,25.7916285 C8.50107362,28.3991642
                   10.6039833,30.5129895 13.1980538,30.5129895 L18.75,30.5 C19.4403559,30.5 20,31.0596441 20,31.75 C20,32.3972087
                   19.5081253,32.9295339 18.8778052,32.9935464 L18.75,33 L13.3863771,33.0081689 C9.3082177,33.0081689 6.00221632,29.7107212
                   6.00221632,25.6431133 C6.00221632,21.6568576 9.17730005,18.4102636 13.1426767,18.2819944 L13.5463095,18.2780629
                   C14.0721799,13.1790956 17.664046,9.01781011 24.0011082,9.01781011 Z"></path>
        </svg>
    </button>

    <button id="highlightToggleBtn" style="margin-left: 10px; padding: 5px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Подсветка колод">
        <svg id="highlightIcon" width="24px" height="24px" viewBox="0 0 20 20" fill="none">
            <path id="highlightIconPath" stroke-width="2"
                  d="M3.093 3.09A1.007 1.007 0 014.095 2h11.81c.589 0 1.05.504 1.002 1.09
                  -.144 1.778-.407 5.362-.407 7.91 0 1.9.146 4.373.28 6.247.067.933-1.072 1.46-1.734.8
                  l-4.339-4.34a1 1 0 00-1.414 0l-4.34 4.34c-.66.66-1.8.133-1.733-.8
                  .134-1.874.28-4.348.28-6.247 0-2.548-.263-6.132-.407-7.91z"></path>
        </svg>
    </button>
<button id="gistSyncBtn"
        title="Gist: ЛКМ — загрузить"
        style="background:none;border:none;cursor:pointer;color:#5fc0ff;padding:5px;font-size:22px;">
    <i class="fal fa-cloud-download"></i>
</button>

<button id="gistSaveBtn"
        title="Сохранить в Gist"
        style="background:none;border:none;cursor:pointer;color:#55ff55;padding:5px;font-size:22px;display:none;">
    <i class="fal fa-cloud-upload"></i>
</button>
    <div style="flex-grow: 1;"></div>
    <input type="file" id="importAllFile" accept=".json" style="display:none">
    <input type="file" id="importBackupFile" accept=".json" style="display:none">
    <select id="deckFilter" style="padding:5px;border-radius:4px;background:#333;color:#fff;width: 150px;">
        <option value="">Все</option>
        <option value="collected">Собрано</option>
        <option value="progress">В процессе</option>
        <option value="unknown">Без отметки</option>
        <option value="S">Есть S</option>
        <option value="history">История</option> <!-- [НОВОЕ] Добавлена опция "История" -->
    </select>
</div>
`;

    document.body.appendChild(modal);
    const highlightBtn = document.getElementById('highlightToggleBtn');
    const highlightIconPath = document.getElementById('highlightIconPath');

    function updateHighlightButton() {
        if (highlightEnabled) {
            highlightIconPath.setAttribute('stroke', '#04fa00');
            highlightBtn.title = "Подсветка включена";
        } else {
            highlightIconPath.setAttribute('stroke', '#ff3300');
            highlightBtn.title = "Подсветка выключена";
        }
    }

    updateHighlightButton();
    highlightBtn.onclick = () => {
        highlightEnabled = !highlightEnabled;
        saveHighlightState();
        updateHighlightButton();
        debouncedHighlight();
    };
initGistUI();
    // Адаптация содержимого для мобильных устройств
    if (isMobile) {
        const deckModalHeader = modal.querySelector('#deckModalHeader');
        if (deckModalHeader) {
            deckModalHeader.style.flexDirection = 'column';
            deckModalHeader.style.alignItems = 'stretch';
            deckModalHeader.style.padding = '10px';
        }

        const deckSearchInput = modal.querySelector('#deckSearch');
        if (deckSearchInput) {
            deckSearchInput.style.marginLeft = '0';
            deckSearchInput.style.marginTop = '10px';
            deckSearchInput.style.flex = 'none';
            deckSearchInput.style.width = '100%';
            deckSearchInput.style.boxSizing = 'border-box';
        }

        // Позиционируем кнопки заголовка абсолютно, чтобы они не мешали
        const clearSearchBtn = modal.querySelector('#clearSearchBtn');
        if (clearSearchBtn) {
            clearSearchBtn.style.position = 'absolute';
            clearSearchBtn.style.right = '50px';
            clearSearchBtn.style.top = '15px';
            clearSearchBtn.style.marginLeft = '0';
            clearSearchBtn.style.marginRight = '0';
            clearSearchBtn.style.zIndex = '1';
        }

        const deckCloseBtn = modal.querySelector('#deckCloseBtn');
        if (deckCloseBtn) {
            deckCloseBtn.style.position = 'absolute';
            deckCloseBtn.style.right = '10px';
            deckCloseBtn.style.top = '10px';
            deckCloseBtn.style.marginLeft = '0';
            deckCloseBtn.style.zIndex = '1';
        }

        const deckModalFooter = modal.querySelector('#deckModalFooter');
        if (deckModalFooter) {
            deckModalFooter.style.flexWrap = 'wrap';
            deckModalFooter.style.justifyContent = 'center';
            deckModalFooter.style.padding = '10px';
            deckModalFooter.style.gap = '8px';
        }
        // Уменьшение размера кнопок в подвале
        deckModalFooter.querySelectorAll('button').forEach(button => {
            button.style.padding = '8px';
            button.style.fontSize = '12px';
        });
        const filterSelect = modal.querySelector('#deckFilter');
        if (filterSelect) {
            filterSelect.style.width = '100%';
            filterSelect.style.marginTop = '10px';
            filterSelect.style.marginLeft = '0';
            filterSelect.style.boxSizing = 'border-box';
        }

        const deckList = modal.querySelector('#deckList');
        if (deckList) {
            deckList.style.padding = '5px';
        }
const highlightBtn = document.getElementById('highlightToggleBtn');
    const highlightIconPath = document.getElementById('highlightIconPath');

    function updateHighlightButton() {
        if (highlightEnabled) {
            highlightIconPath.setAttribute('stroke', '#04fa00');
            highlightBtn.title = "Подсветка включена";
        } else {
            highlightIconPath.setAttribute('stroke', '#ff3300');
            highlightBtn.title = "Подсветка выключена";
        }
    }

    updateHighlightButton();
    highlightBtn.onclick = () => {
        highlightEnabled = !highlightEnabled;
        saveHighlightState();
        updateHighlightButton();
        debouncedHighlight();
    };
    }


    const header = modal.querySelector('#deckModalHeader');
    let isDragging = false, offsetX = 0, offsetY = 0;
    if (!isMobile) {
        header.addEventListener('mousedown', e => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
                return;
            }
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) {
                if (modal.style.right) {
                    modal.style.right = '';
                }
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;
                const maxLeft = window.innerWidth - modal.offsetWidth;
                const maxTop = window.innerHeight - modal.offsetHeight;
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                modal.style.left = `${newLeft}px`;
                modal.style.top = `${newTop}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'grab';
                const finalLeft = modal.offsetLeft;
                const finalTop = modal.offsetTop;
                const modalCenter = finalLeft + modal.offsetWidth / 2;
                const windowCenter = window.innerWidth / 2;
                if (modalCenter > windowCenter) {
                    uiState.anchorSide = 'right';
                    const newRight = window.innerWidth - (finalLeft + modal.offsetWidth);
                    uiState.right = newRight;
                    uiState.left = null;
                    modal.style.left = '';
                    modal.style.right = `${newRight}px`;
                } else {
                    uiState.anchorSide = 'left';
                    uiState.left = finalLeft;
                    uiState.right = null;
                    modal.style.right = '';
                }
                uiState.top = finalTop;
                uiState.isPinned = true;
                saveState();
            }
        });

// ЛОГИКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА (только для ПК)
        const resizeHandle = document.createElement('div');
        resizeHandle.id = 'deckResizeHandle';
        resizeHandle.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nesw-resize;
            z-index: 10;
            background: linear-gradient(225deg, transparent 50%, rgba(255,255,255,0.2) 50%);
        `;
        modal.appendChild(resizeHandle);
        let isResizing = false;
        let initialWidth, initialHeight, initialMouseX, initialMouseY, initialTop, initialLeft, initialBottom;
        resizeHandle.addEventListener('mousedown', e => {
            isResizing = true;
            initialWidth = modal.offsetWidth;
            initialHeight = modal.offsetHeight;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            initialTop = modal.offsetTop;
            initialLeft = modal.offsetLeft;
            initialBottom = initialTop + initialHeight;
            if (uiState.anchorSide === 'right') {
                modal.style.right = '';
                modal.style.left = `${initialLeft}px`;
            }
            e.preventDefault();
            e.stopPropagation();
        });
        document.addEventListener('mousemove', e => {
            if (isResizing) {
                const dx = e.clientX - initialMouseX;
                modal.style.width = `${initialWidth + dx}px`;
                const dy = e.clientY - initialMouseY;
                let newTop = initialTop + dy;
                const minHeight = parseInt(modal.style.minHeight) || 200;
                if (newTop < 0) {
                    newTop = 0;
                }
                if (newTop > initialBottom - minHeight) {
                    newTop = initialBottom - minHeight;
                }
                let newHeight = initialBottom - newTop;
                modal.style.top = `${newTop}px`;
                modal.style.height = `${newHeight}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                const finalLeft = modal.offsetLeft;
                const modalCenter = finalLeft + modal.offsetWidth / 2;
                const windowCenter = window.innerWidth / 2;
                if (modalCenter > windowCenter) {
                    uiState.anchorSide = 'right';
                    const newRight = window.innerWidth - (finalLeft + modal.offsetWidth);
                    uiState.right = newRight;
                    uiState.left = null;
                    modal.style.left = '';
                    modal.style.right = `${newRight}px`;
                } else {
                    uiState.anchorSide = 'left';
                    uiState.left = finalLeft;
                    uiState.right = null;
                }
                uiState.width = modal.offsetWidth;
                uiState.height = modal.offsetHeight;
                uiState.top = modal.offsetTop;
                saveState();
            }
        });
    }

    document.getElementById('deckCloseBtn').onclick = () => {
        sessionStorage.removeItem(SESSION_OPEN_KEY);
        modal.remove();
    };
    document.getElementById('deckSearch').oninput = renderDeckList;
    document.getElementById('clearSearchBtn').onclick = () => {
        document.getElementById('deckSearch').value = '';
        renderDeckList();
    };
    document.getElementById('exportAllBtn').onclick = exportCombinedDecks;
    document.getElementById('importAllBtn').onclick = () => document.getElementById('importAllFile').click();
    document.getElementById('importAllFile').onchange = importCombinedDecks;
    document.getElementById('exportNamesBtn').onclick = exportDeckNamesTXT;
    document.getElementById('importBackupBtn').onclick = () => document.getElementById('importBackupFile').click();
    document.getElementById('importBackupFile').onchange = importFullBackup;
    const filterSelect = document.getElementById('deckFilter');
    filterSelect.value = uiState.filter || "";
    filterSelect.onchange = () => {
        uiState.filter = filterSelect.value;
        saveState();
        renderDeckList();
    };
    renderDeckList();
    updateFilterCounts();
    const listElement = document.getElementById('deckList');
    if (uiState.scrollTop) {
        setTimeout(() => {
            listElement.scrollTop = uiState.scrollTop;
        }, 0);
    }
    const debouncedSaveScroll = debounce(() => {
        uiState.scrollTop = listElement.scrollTop;
        saveState();
    }, 250);
    listElement.addEventListener('scroll', debouncedSaveScroll);
}

// Функция для отрисовки истории изменений
function renderHistoryList() {
    const list = document.getElementById('deckList');
    list.innerHTML = '';
    const history = GM_getValue(HISTORY_KEY, []);
    if (history.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #aaa; padding-top: 20px;">История изменений пуста.</div>';
        return;
    }
    history.forEach(entry => {
        const group = document.createElement('div');
        group.style.cssText = `
            padding: 10px;
            margin-bottom: 15px;
            border-bottom: 1px solid #555;
        `;
        const timestamp = new Date(entry.timestamp);
        const dateString = timestamp.toLocaleString('ru-RU', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const header = document.createElement('h4');
        header.textContent = `Изменения от ${dateString}`;
        header.style.cssText = `margin: 0 0 10px 0; color: #DAA520;`;
        group.appendChild(header);
        if (entry.added && entry.added.length > 0) {
            const addedHeader = document.createElement('div');
            addedHeader.textContent = `Добавлено (без статуса): ${entry.added.length}`;
            addedHeader.style.cssText = `font-weight: bold; margin-bottom: 5px; color: #2196f3;`;
            group.appendChild(addedHeader);
            const addedList = document.createElement('ul');
            addedList.style.cssText = `list-style: none; padding-left: 15px; margin: 0;`;
            entry.added.forEach(deckName => {
                const li = document.createElement('li');
                li.style.wordBreak = 'break-all';
                const link = document.createElement('a');
                const url = new URL(`/user/${currentUsername}/cards_progress/`, window.location.origin);
                url.searchParams.set('search', deckName);
                url.searchParams.set('scrollToDeck', '1');
                link.href = url.toString();
                link.textContent = `• ${deckName}`;
                link.style.color = 'inherit';
                link.style.textDecoration = 'none';
                link.style.cursor = 'pointer';
                link.onmouseover = () => { link.style.textDecoration = 'underline'; };
                link.onmouseleave = () => { link.style.textDecoration = 'none'; };
                li.appendChild(link);
                addedList.appendChild(li);
            });
            group.appendChild(addedList);
        }

        if (entry.upgraded && entry.upgraded.length > 0) {
            const upgradedHeader = document.createElement('div');
            upgradedHeader.textContent = `Повышено до S: ${entry.upgraded.length}`;
            upgradedHeader.style.cssText = `font-weight: bold; margin-top: 10px; margin-bottom: 5px; color: #f44336;`;
            group.appendChild(upgradedHeader);
            const upgradedList = document.createElement('ul');
            upgradedList.style.cssText = `list-style: none; padding-left: 15px; margin: 0;`;
            entry.upgraded.forEach(deckName => {
                const li = document.createElement('li');
                li.style.wordBreak = 'break-all';
                const link = document.createElement('a');
                const url = new URL(`/user/${currentUsername}/cards_progress/`, window.location.origin);
                url.searchParams.set('search', deckName);
                url.searchParams.set('scrollToDeck', '1');
                link.href = url.toString();
                link.textContent = `• ${deckName}`;
                link.style.color = 'inherit';
                link.style.textDecoration = 'none';
                link.style.cursor = 'pointer';
                link.onmouseover = () => { link.style.textDecoration = 'underline'; };
                link.onmouseleave = () => { link.style.textDecoration = 'none'; };
                li.appendChild(link);
                upgradedList.appendChild(li);
            });
            group.appendChild(upgradedList);
        }
        list.appendChild(group);
    });
}

// Основная функция отрисовки списка
function renderDeckList() {
    const query = normalize(document.getElementById('deckSearch').value);
    const filter = document.getElementById('deckFilter').value;
    const searchInput = document.getElementById('deckSearch');
    const list = document.getElementById('deckList');
    list.innerHTML = '';
    if (filter === 'history') {
        searchInput.disabled = true;
        searchInput.placeholder = 'Поиск недоступен в истории';
        renderHistoryList();
        return;
    }
    searchInput.disabled = false;
    searchInput.placeholder = 'Поиск...';
    const allDecks = {
        ...Object.fromEntries(Object.entries(decks)),
        ...Object.fromEntries(Object.keys(sDecks).map(k => [k, 'S']))
    };
        const matched = Object.entries(allDecks).filter(([name, status]) => {
        const matchQuery = name.includes(query);
        const matchFilter = !filter || status === filter;
        return matchQuery && matchFilter;
    });
    matched.sort(([nameA, statusA], [nameB, statusB]) => {
        if (!filter) {
            const sortOrder = {
                'collected': 1,
                'progress': 2,
                'unknown': 3,
                'S': 4
            };
            const priorityA = sortOrder[statusA] || 5;
            const priorityB = sortOrder[statusB] || 5;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
        }
        return nameA.localeCompare(nameB);
    });

    if (matched.length === 0) {
        list.innerHTML = '<div style="color:#aaa;">Нет совпадений</div>';
        return;
    }

    matched.forEach(([name, status], index) => {
        const row = document.createElement('div');
        row.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid #444;
        `;

        const title = document.createElement('div');
        title.textContent = `${index + 1}. ${name}`;
        title.style = `
            flex: 1;
            margin-right: 10px;
            word-break: break-word;
            color: ${status === 'collected' ? '#4caf50' :
                            status === 'progress' ? '#ffeb3b' :
                            status === 'S' ? 'red' : '#2196f3'};
        `;

        const actions = document.createElement('div');
        actions.style.cssText = `
            display: flex;
            flex-shrink: 0;
            gap: 5px;
            justify-content: flex-end;
        `;
        if (isMobile) {
            actions.style.minWidth = 'unset';
            actions.style.flexWrap = 'wrap';
            actions.style.justifyContent = 'center';
        } else {
            actions.style.minWidth = '160px';
        }

        const searchBtn = document.createElement('a');
        searchBtn.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
        searchBtn.title = 'Перейти к колоде';
        const url = new URL(`/user/${currentUsername}/cards_progress/`, window.location.origin);
url.searchParams.set('search', name);
url.searchParams.set('scrollToDeck', '1');
searchBtn.href = url.toString();
        searchBtn.style = `
            text-decoration: none;
            padding: 4px 8px;
            background: #35588d;
            color: white;
            border-radius: 5px;            display: flex;
            justify-content: center;
            align-items: center;
        `;
        if (isMobile) {
            searchBtn.style.padding = '3px 6px';
        }

        actions.appendChild(searchBtn);

        const btnSymbols = [
            {
                iconHTML: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" stroke="#00fa11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                title: 'Отметить как собрано',
                action: () => {
                    decks[name] = 'collected';
                    delete sDecks[name];
                    saveDecks();
                    saveSDecks();
                }
            },
            {
                iconHTML: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 3V7M12 17V21M3 12H7M17 12H21M12 12H12.01M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" stroke="#eeff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                title: 'Отметить как в процессе',
                action: () => {
                    decks[name] = 'progress';
                    delete sDecks[name];
                    saveDecks();
                    saveSDecks();
                }
            },
            {
                iconHTML: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.3689 5.64103L5.63548 18.3634M5.63106 5.64103L18.3645 18.3634M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#0000FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                title: 'Отметить как без статуса',
                action: () => {
                    decks[name] = 'unknown';
                    delete sDecks[name];
                    saveDecks();
                    saveSDecks();
                }
            },
            {
                iconHTML: 'S',
                title: 'Переместить в "Есть S"',
                action: () => {
                    sDecks[name] = true;
                    delete decks[name];
                    saveSDecks();
                    saveDecks();
                }
            },
            {
                iconHTML: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                title: 'Удалить колоду',
                action: () => {
                    showCustomConfirm(`Удалить "${name}" из всех списков?`, () => {
                        delete decks[name];
                        delete sDecks[name];
                        saveDecks();
                        saveSDecks();
                        renderDeckList();
                        debouncedUpdate();
                        updateFilterCounts();

                    });
                }
            }
        ];

        btnSymbols.forEach(({ iconHTML, title: tooltip, action }) => {
            const btn = document.createElement('button');
            btn.innerHTML = iconHTML;
            btn.title = tooltip;
            btn.style = `
                padding: 4px 8px;
                background: #757575;
                border: none;
                color: #FF0000;
                cursor: pointer;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
            `;
            if (isMobile) {
                btn.style.padding = '3px 6px';
            }
            if (tooltip === 'Переместить в "Есть S"') {
                btn.style.fontWeight = 'bold';
            }
            if (tooltip !== 'Удалить колоду') {
               btn.onclick = () => {
                    action();
                    renderDeckList();
                    debouncedUpdate();
                    updateFilterCounts();
                };
            } else {
                btn.onclick = action;
            }
            actions.appendChild(btn);
        });
        row.appendChild(title);
        row.appendChild(actions);
        list.appendChild(row);
    });
}

    function addManagerButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fal fa-trophy-alt"></i>';
        btn.title = 'Менеджер колод';
        btn.id = 'deckToggleBtn';
        btn.style = `
        position: fixed;
        left: 0;
        bottom: 0;

        width: 45px;
        height: 45px;
        backdrop-filter: blur(6px);
        background: rgba(44, 62, 80, 0.35);

        border-radius: 0;

        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        z-index: 99999;
        cursor: pointer;
        transition: background 0.3s ease;
    `;
btn.onmouseover = () => { btn.style.background = 'rgba(44, 62, 80, 0.6)'; };
btn.onmouseleave = () => { btn.style.background = 'rgba(44, 62, 80, 0.35)'; };
btn.onmousedown = (event) => {
        if (event.button !== 0) {
            return;
        }
        const existing = document.getElementById('deckModal');
        if (existing) {
            existing.remove();
            uiState.isOpen = false;
            saveState();
        } else {
            openDeckManager();
        }
    };
    document.body.appendChild(btn);
    if (!document.getElementById('deck-tracker-fscr-styles')) {
        const style = document.createElement('style');
        style.id = 'deck-tracker-fscr-styles';
        style.textContent = `
            /* Когда у body появляется класс fscr-active, скрываем кнопку менеджера колод */
            body.fscr-active #deckToggleBtn {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

    function showCustomConfirm(message, onConfirm) {
        const confirmOverlay = document.createElement('div');
        confirmOverlay.style = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
        `;

        const confirmBox = document.createElement('div');
        confirmBox.style = `
            background: #333;
            padding: 20px;
            border-radius: 10px;
            color: white;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 0 10px black;
        `;
        confirmBox.innerHTML = `
            <p style="margin-bottom: 20px;">${message}</p>
            <button id="confirmYes" style="margin-right:10px;padding:8px 16px;background:#4caf50;border:none;border-radius:5px;color:#fff;">Да</button>
            <button id="confirmNo" style="padding:8px 16px;background:#f44336;border:none;border-radius:5px;color:#fff;">Нет</button>
        `;

        confirmOverlay.appendChild(confirmBox);
        document.body.appendChild(confirmOverlay);

        confirmBox.querySelector('#confirmYes').onclick = () => {
            onConfirm();
            confirmOverlay.remove();
        };
        confirmBox.querySelector('#confirmNo').onclick = () => confirmOverlay.remove();
    }

// Объединенный экспорт для ОБМЕНА -----
function exportCombinedDecks() {
    const combinedData = { ...decks };
    Object.keys(sDecks).forEach(deckName => {
        combinedData[deckName] = 'S';
    });
    const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'animestars_all_decks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

// ----- Объединенный импорт для ОБМЕНА + ЗАПИСЬ В ИСТОРИЮ -----
function importCombinedDecks(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const importedData = JSON.parse(reader.result);
            if (typeof importedData !== 'object' || importedData === null || Array.isArray(importedData)) {
                alert('Ошибка: Неверный формат файла. Ожидается объединенный JSON-объект.');
                return;
            }

            const newlyAdded = [];
            const upgradedToS = [];

            for (const name in importedData) {
                if (Object.hasOwnProperty.call(importedData, name)) {
                    const norm = normalize(name);
                    const statusFromFile = importedData[name];
                    if (sDecks[norm]) {
                        continue;
                    }
                    if (statusFromFile === 'S') {
                        if (decks[norm]) {
                            delete decks[norm];
                            upgradedToS.push(norm);
                        } else {
                            newlyAdded.push(norm);
                        }
                        sDecks[norm] = true;
                        continue;
                    }
                    if (!decks[norm] && !sDecks[norm]) {
                        decks[norm] = 'unknown';
                        newlyAdded.push(norm);
                    }
                }
            }

            // Сохраняем запись в историю, если были изменения
            if (newlyAdded.length > 0 || upgradedToS.length > 0) {
                let history = GM_getValue(HISTORY_KEY, []);
                history.unshift({
                    timestamp: new Date().toISOString(),
                    added: newlyAdded,
                    upgraded: upgradedToS
                });
                // Ограничиваем историю, чтобы она не росла бесконечно (например, 2 последних записей)
                history = history.slice(0, 10);
                GM_setValue(HISTORY_KEY, history);
            }
            saveDecks();
            saveSDecks();
            alert(`Импорт завершен!\n\n- Добавлено новых колод: ${newlyAdded.length}\n- Повышено до S: ${upgradedToS.length}\n\nПодробности можно посмотреть в фильтре "История".`);
            if (document.getElementById('deckModal')) {
                 renderDeckList();
                 updateFilterCounts();
            }
            debouncedUpdate();
        } catch (e) {
            console.error("Ошибка при импорте:", e);
            alert('Ошибка при чтении файла. Убедитесь, что это корректный JSON.');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}


// ----- Восстановление из полного БЭКАПА -----
function importFullBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        showCustomConfirm(
            "Вы уверены, что хотите восстановить данные из бэкапа? <br><br><b>ВНИМАНИЕ:</b> Все текущие отметки будут полностью <b>ЗАМЕНЕНЫ</b> данными из файла!",
            () => {
                try {
                    const importedData = JSON.parse(reader.result);
                    if (typeof importedData !== 'object' || importedData === null || Array.isArray(importedData)) {
                        alert('Ошибка: Неверный формат файла бэкапа.');
                        return;
                    }
                    const newDecks = {};
                    const newSDecks = {};
                    let sCount = 0;
                    let normalCount = 0;
                    for (const name in importedData) {
                        if (Object.hasOwnProperty.call(importedData, name)) {
                            const norm = normalize(name);
                            const status = importedData[name];
                            if (status === 'S') {
                                newSDecks[norm] = true;
                                sCount++;
                            } else {
                                newDecks[norm] = status;
                                normalCount++;
                            }
                        }
                    }
                    decks = newDecks;
                    sDecks = newSDecks;
                    saveDecks();
                    saveSDecks();
                    alert(`Восстановление из бэкапа завершено.\n\nВосстановлено S-колод: ${sCount}\nВосстановлено обычных колод: ${normalCount}`);
                    if (document.getElementById('deckModal')) renderDeckList();
                    debouncedUpdate();
                } catch (e) {
                    console.error("Ошибка при восстановлении из бэкапа:", e);
                    alert('Ошибка при чтении файла бэкапа. Убедитесь, что файл не поврежден.');
                } finally {
                    event.target.value = '';
                }
            }
        );
    };
    reader.readAsText(file);
}

// Обновление количества записей в фильтре ---
function updateFilterCounts() {
    const allDecks = {
        ...Object.fromEntries(Object.entries(decks)),
        ...Object.fromEntries(Object.keys(sDecks).map(k => [k, 'S']))
    };
    const counts = {
        collected: 0,
        progress: 0,
        unknown: 0,
        S: 0
    };
    for (const status of Object.values(allDecks)) {
        if (counts[status] !== undefined) {
            counts[status]++;
        }
    }
    const filterSelect = document.getElementById('deckFilter');
    if (!filterSelect) return;
    filterSelect.querySelector('option[value=""]').textContent =
        `Все (${Object.keys(allDecks).length})`;
    filterSelect.querySelector('option[value="collected"]').textContent =
        `Собрано (${counts.collected})`;
    filterSelect.querySelector('option[value="progress"]').textContent =
        `В процессе (${counts.progress})`;
    filterSelect.querySelector('option[value="unknown"]').textContent =
        `Без отметки (${counts.unknown})`;
    filterSelect.querySelector('option[value="S"]').textContent =
        `Есть S (${counts.S})`;
}

    function exportDeckNamesTXT() {
        const names = Object.keys(decks).sort().join('\n');
        const blob = new Blob([names], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'deck_names.txt';
        a.click();
    }


    // --- СИСТЕМА ИНИЦИАЛИЗАЦИИ И БЕЗОПАСНОГО ОБНОВЛЕНИЯ ---
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    const debouncedUpdate = debounce(updateIndicators, 250);
    const debouncedHighlight = debounce(highlightCards, 250);

function initializeTracker() {
    observer = new MutationObserver(() => {
        debouncedUpdate();
        debouncedHighlight();
        updateModalIndicatorColor();
    });
    debouncedUpdate();
    debouncedHighlight();
    updateModalIndicatorColor();
    observer.observe(document.body, { childList: true, subtree: true });
}
// ====== [Автопрокрутка к поиску, если был переход с параметром scrollToDeck=1] ======
(function autoScrollToDeck() {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldScroll = urlParams.get('scrollToDeck') === '1';
    if (shouldScroll) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const target = document.querySelector('.card-filter-form__controls');
                if (target) {
                    const offset = target.getBoundingClientRect().top + window.scrollY - 20;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }, 200);
        });
    }
})();
// ============================
//        GIST STORAGE BLOCK
//      (Обновленный, с таймером и баннером)
// ============================

const GLOBAL_GIST_ID = "1795164462c60d392be26655220c1f9f";
const GLOBAL_GIST_RAW_URL =
    "https://gist.githubusercontent.com/Sokol234s2/" +
    GLOBAL_GIST_ID +
    "/raw/AS_decks.json";

let gistToken = GM_getValue("gistToken", "");

// --- Новые константы для проверки по расписанию ---
const CHECK_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 часа (можно изменить)
const LAST_CHECK_KEY = "lastGistCheckTimestamp";
// ---------------------------------------------------


function buildCombinedJSON() {
    const combined = { ...decks };
    Object.keys(sDecks).forEach(k => combined[k] = "S");
    return combined;
}

// --- Новая функция для стилизованного уведомления ---
function createUpdateNotification(addedCount, upgradedCount) {
    // Проверяем, существует ли уже уведомление
    if (document.getElementById('gistUpdateNotification')) {
        return;
    }

    const notificationHtml = `
        <div id="gistUpdateNotification" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #282c34;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
            max-width: 300px;
            line-height: 1.4;
            border-left: 5px solid #61afef; /* Аквамариновый акцент */
            opacity: 0; /* Начинаем с 0 для анимации */
            transition: opacity 0.3s ease-in-out;
        ">
            <div style="font-weight: bold; margin-bottom: 5px;">Найдены новые колоды!</div>
            <div style="font-size: 13px; margin-bottom: 10px;">
                Добавлено новых: <strong>${addedCount}</strong><br>
                Повышено до S: <strong>${upgradedCount}</strong>
            </div>
            <div>
                <button id="updateNowBtn" style="
                    background: #98c379; /* Зеленый */
                    color: #282c34;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                    font-weight: bold;
                ">Обновить сейчас</button>
                <button id="closeNotificationBtn" style="
                    background: #5c6370; /* Серый */
                    color: #fff;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Закрыть</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notificationHtml);
    const notificationElement = document.getElementById('gistUpdateNotification');

    // Анимируем появление
    setTimeout(() => {
        if(notificationElement) notificationElement.style.opacity = 1;
    }, 10);

    // Добавляем обработчики событий
    document.getElementById('updateNowBtn').addEventListener('click', () => {
        if (notificationElement) notificationElement.remove();
        loadFromGist(); // Вызываем существующую функцию полной загрузки
    });

    document.getElementById('closeNotificationBtn').addEventListener('click', () => {
        if (notificationElement) notificationElement.remove();
    });
}
// ---------------------------------------------------


// --- Новые функции для проверки по расписанию ---

function shouldCheckGistForUpdates() {
    // Получаем метку времени последней проверки
    const lastCheckTime = GM_getValue(LAST_CHECK_KEY, 0);
    const currentTime = Date.now();

    // Возвращаем true, если прошло больше времени, чем CHECK_INTERVAL_MS
    return (currentTime - lastCheckTime) > CHECK_INTERVAL_MS;
}

async function checkGistForDifferences() {
    try {
        // 1. Запрос Gist
        const resp = await fetch(GLOBAL_GIST_RAW_URL + "?t=" + Date.now());
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const importedData = await resp.json();

        // 2. Проверка формата данных
        if (typeof importedData !== 'object' || importedData === null || Array.isArray(importedData)) {
            console.error('Ошибка: Неверный формат Gist при проверке.');
            return { hasUpdates: false };
        }

        let newlyAddedCount = 0;
        let upgradedToSCount = 0;

        // 3. Сравнение с локальными данными (логика из loadFromGist)
        for (const name in importedData) {
            if (Object.hasOwnProperty.call(importedData, name)) {
                const norm = normalize(name);
                const statusFromGist = importedData[name];

                // Если уже есть S — пропускаем
                if (sDecks[norm]) continue;

                // Если статус = S
                if (statusFromGist === 'S') {
                    if (decks[norm]) {
                        upgradedToSCount++;
                    } else {
                        newlyAddedCount++;
                    }
                    continue;
                }

                // Если новая обычная колода, которой нет ни в decks, ни в sDecks
                if (!decks[norm] && !sDecks[norm]) {
                    newlyAddedCount++;
                }
            }
        }

        // 4. Сохраняем метку времени, так как запрос был успешным
        GM_setValue(LAST_CHECK_KEY, Date.now());

        // 5. Возвращаем результат
        if (newlyAddedCount > 0 || upgradedToSCount > 0) {
            return { hasUpdates: true, added: newlyAddedCount, upgraded: upgradedToSCount };
        } else {
            return { hasUpdates: false };
        }

    } catch (e) {
        console.error("Ошибка проверки Gist:", e);
        // Не обновляем метку времени, чтобы повторить проверку при следующем запуске
        return { hasUpdates: false };
    }
}

async function checkUpdatesPeriodically() {
    if (shouldCheckGistForUpdates()) {
        const result = await checkGistForDifferences();

        if (result.hasUpdates) {
            // Показываем стилизованное уведомление вместо confirm
            createUpdateNotification(result.added, result.upgraded);
        }
    }
}
// ---------------------------------------------------


async function loadFromGist() {
    try {
        const resp = await fetch(GLOBAL_GIST_RAW_URL + "?t=" + Date.now());
        if (!resp.ok) throw new Error("HTTP " + resp.status);

        const importedData = await resp.json();

        if (typeof importedData !== 'object' || importedData === null || Array.isArray(importedData)) {
            alert('Ошибка: Неверный формат Gist. Ожидается объединённый JSON-объект.');
            return;
        }

        const newlyAdded = [];
        const upgradedToS = [];

        for (const name in importedData) {
            if (Object.hasOwnProperty.call(importedData, name)) {

                const norm = normalize(name);
                const statusFromGist = importedData[name];

                // Если уже есть S — пропускаем
                if (sDecks[norm]) continue;

                // Если статус = S
                if (statusFromGist === 'S') {

                    // Был обычный статус → повышаем
                    if (decks[norm]) {
                        delete decks[norm];
                        upgradedToS.push(norm);
                    } else {
                        // Просто новая колода со статусом S
                        newlyAdded.push(norm);
                    }

                    sDecks[norm] = true;
                    continue;
                }

                // Если новая обычная колода
                if (!decks[norm] && !sDecks[norm]) {
                    decks[norm] = 'unknown';
                    newlyAdded.push(norm);
                }
            }
        }

        // История — 1-в-1 как в импорте файла
        if (newlyAdded.length > 0 || upgradedToS.length > 0) {
            let history = GM_getValue(HISTORY_KEY, []);
            history.unshift({
                timestamp: new Date().toISOString(),
                added: newlyAdded,
                upgraded: upgradedToS
            });
            history = history.slice(0, 10);
            GM_setValue(HISTORY_KEY, history);
        }

        saveDecks();
        saveSDecks();

        alert(
            `✔ Загрузка завершена.\n\n` +
            `Добавлено новых колод: ${newlyAdded.length}\n` +
            `Повышено до S: ${upgradedToS.length}\n\n` +
            `Подробности можно посмотреть в фильтре "История".`
        );

        if (document.getElementById("deckModal")) {
            renderDeckList();
            updateFilterCounts();
        }

        debouncedUpdate();

    } catch (e) {
        alert("Ошибка загрузки из Gist:\n" + e);
    }
}


async function saveToGist() {
    if (!gistToken) {
        alert("❌ У вас нет токена. ПКМ по кнопке ☁.");
        return;
    }

    try {
        // 1. Загружаем старый Gist
        const resp = await fetch(GLOBAL_GIST_RAW_URL + "?t=" + Date.now());
        if (!resp.ok) throw new Error("HTTP " + resp.status);

        const gistData = await resp.json();
        const merged = { ...gistData };

        // 2. Добавляем локальные обычные колоды (только если их нет в Gist)
        for (const k in decks) {
            const norm = normalize(k);
            if (!merged.hasOwnProperty(norm)) {
                merged[norm] = decks[norm]; // обычно "unknown"
            }
        }

        // 3. Обновляем/добавляем статус S (локальный S всегда важнее)
        for (const k in sDecks) {
            const norm = normalize(k);
            merged[norm] = "S";
        }

        // 4. Отправляем объединённый результат обратно в Gist
        const update = await fetch("https://api.github.com/gists/" + GLOBAL_GIST_ID, {
            method: "PATCH",
            headers: {
                "Authorization": "token " + gistToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                files: {
                    "AS_decks.json": {
                        content: JSON.stringify(merged, null, 2)
                    }
                }
            })
        });

        if (!update.ok) throw new Error("HTTP " + update.status);

        alert("✔ Данные синхронизированы с Gist (объединение выполнено).");

    } catch (e) {
        alert("Ошибка при сохранении в Gist:\n" + e);
    }
}
// ============================
//       GIST UI BUTTONS
// ============================

function initGistUI() {
    const sync = document.getElementById("gistSyncBtn");
    const save = document.getElementById("gistSaveBtn");

    // ЛКМ = загрузка
    sync.addEventListener("click", (e) => {
        e.stopPropagation();
        loadFromGist();
    });

    // ПКМ = ввод токена
    sync.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const t = prompt("Введите GitHub Token:");
        if (!t) return;

        gistToken = t;
        GM_setValue("gistToken", t);
        alert("Token сохранён!");

        save.style.display = "inline-flex";
    });

    // Показываем кнопку сохранения, если есть токен
    if (gistToken) save.style.display = "inline-flex";

    // Сохранение
    save.addEventListener("click", (e) => {
        e.stopPropagation();
        saveToGist();
    });

    // ВНИМАНИЕ: Здесь больше нет вызова checkUpdatesPeriodically().
    // Он будет вызван в конце скрипта, при его загрузке.
}

// --- ЗАПУСК СКРИПТА ---
    addManagerButton();
    initializeTracker();

    // Новая строка: Запуск периодической проверки Gist при старте скрипта
    checkUpdatesPeriodically();

    if (sessionStorage.getItem(SESSION_OPEN_KEY) === 'true') {
        openDeckManager();
    }
// ======================================================================
// DeckTracker — Авто-обнаружение колод из ACM Tooltip
// ======================================================================

// ======================================================================
// Popup-уведомления
// ======================================================================
function showDeckPopup(text) {
    const old = document.getElementById("deckAddedPopup");
    if (old) old.remove();

    const box = document.createElement("div");
    box.id = "deckAddedPopup";
    box.style.cssText = `
        position: fixed;
        left: 80px;
        bottom: 20px;
        background: rgba(40,40,40,0.95);
        border: 1px solid rgba(255,255,255,0.2);
        padding: 10px 15px;
        border-radius: 4px; /* Небольшое скругление */
        font-size: 14px;
        color: #fff;
        z-index: 9999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        opacity: 0;
        transition: opacity .3s ease-out, transform .3s ease-out;

        /* ГЛАВНОЕ ИЗМЕНЕНИЕ: Создаем форму параллелограмма */
        transform: skewX(-15deg); /* Наклон всего блока */

        /* Начальная анимация (чтобы выезжало) */
        left: 60px; /* Начинаем чуть левее */
    `;
    box.textContent = text;

    document.body.appendChild(box);

    // Добавляем внутренний элемент, чтобы вернуть текст в нормальное состояние
    const innerText = document.createElement("span");
    innerText.textContent = text;
    innerText.style.cssText = `
        display: block;
        transform: skewX(15deg); /* Возвращаем текст в прямое состояние */
        padding: 0 5px; /* Корректировка паддинга, если нужно */
    `;

    // Заменяем box.textContent на innerText
    box.textContent = '';
    box.appendChild(innerText);


    // Анимация появления
    setTimeout(() => {
        box.style.opacity = "1";
        box.style.left = "80px"; /* Перемещаем в конечную позицию */
    }, 10);

    // Анимация исчезновения
    setTimeout(() => {
        box.style.opacity = "0";
        box.style.left = "60px"; /* Уезжает обратно */
        setTimeout(() => box.remove(), 500);
    }, 3000);
}

function popupNewDeck(name) { showDeckPopup(`Новая колода: ${name}`); }
function popupNewSDeck(name) { showDeckPopup(`Добавлена S-колода: ${name}`); }
function popupCollected(name) { showDeckPopup(`Колода собрана: ${name}`); }
function popupUpgradedToS(name) { showDeckPopup(`Колода обновлена до S: ${name}`); }

// ======================================================================
// История — повышение в S
// ======================================================================
function addHistoryRecord_UpgradeToS(deckName) {
    let history = GM_getValue(HISTORY_KEY, []);
    history.unshift({
        timestamp: new Date().toISOString(),
        added: [],
        upgraded: [deckName]
    });
    history = history.slice(0, 10);
    GM_setValue(HISTORY_KEY, history);
}

// ======================================================================
// Извлечение ссылки на страницу аниме из tooltip
// ======================================================================
function extractAnimeLinkFromTooltip(html) {
    const m = html.match(/<a[^>]+href="([^"]+)"[^>]*class="title-link"/);
    return m ? m[1] : null;
}
// ======================================================================
// ТОЧНАЯ проверка S через AJAX /cards_ajax  — полный список карт аниме
// ======================================================================
async function doesAnimeHaveRealSCard(animeLink) {
    try {
        const idMatch = animeLink.match(/\/(\d+)-/);
        if (!idMatch) return false;

        const animeId = idMatch[1];

        const form = new FormData();
        form.append("action", "anime_cards");
        form.append("news_id", animeId);
        form.append("user_hash", window.dle_login_hash || "");

        const res = await fetch("/engine/ajax/controller.php?mod=cards_ajax", {
            method: "POST",
            body: form
        });

        const json = await res.json();
        if (!json || !json.html) return false;

        const doc = new DOMParser().parseFromString(json.html, "text/html");

        // Находим ВСЕ карты
        const cards = [...doc.querySelectorAll(".anime-cards__item")];

        // Ищем реальные S
        return cards.some(c => c.dataset.rank === "s");
    }
    catch (e) {
        console.error("[DeckTracker] Ошибка проверки S:", e);
        return false;
    }
}


// ======================================================================
// Добавление / обновление колоды
// ======================================================================
async function addDeckFromTooltip(deck) {

    let sData = GM_getValue("sDecks", {});
    let lData = GM_getValue("localDecks", {});

    const key = deck.anime.toLowerCase().trim();

// ======================================================================
// Новая логика S:
//  - Если tooltip показал S > 1 → сразу S
//  - Если tooltip показал S = 1 → проверяем по AJAX
// ======================================================================
if (deck.isSDeck && !sData[key] && deck.animeLink) {

    if (deck.totalSCount > 1) {
        console.log(`[DeckTracker] Tooltip показывает более одной S (${deck.totalSCount}) → принимаем сразу`);
    }
    else if (deck.totalSCount === 1) {
        console.log(`[DeckTracker] Проверка единственной S для: ${deck.anime}`);

        const exists = await doesAnimeHaveRealSCard(deck.animeLink);

        if (!exists) {
            console.log("[DeckTracker] На сервере S нет → отменяем S");
            deck.isSDeck = false;
        }
    }
    else {
        deck.isSDeck = false;
    }
}

    // ====================== S-DECK ==========================
    if (deck.isSDeck) {

        const wasLocal = !!lData[key];
        const wasS = !!sData[key];

        if (!wasS) {
            sData[key] = true;
            GM_setValue("sDecks", sData);

            if (wasLocal) {
                popupUpgradedToS(deck.anime);
                addHistoryRecord_UpgradeToS(deck.anime);
            } else {
                popupNewSDeck(deck.anime);
            }
        }

        sDecks = sData;
        decks = lData;
        debouncedUpdate();
        if (document.getElementById("deckModal")) renderDeckList();
        return;
    }

    // ====================== COLLECTED ==========================
    if (deck.isCollected) {

        if (!sData[key] && lData[key] !== "collected") {
            lData[key] = "collected";
            GM_setValue("localDecks", lData);
            popupCollected(deck.anime);
        }

        sDecks = sData;
        decks = lData;
        debouncedUpdate();
        if (document.getElementById("deckModal")) renderDeckList();
        return;
    }

    // ====================== UNKNOWN ==========================
    if (!lData[key] && !sData[key]) {
        lData[key] = "unknown";
        GM_setValue("localDecks", lData);
        popupNewDeck(deck.anime);
    }

    sDecks = sData;
    decks = lData;
    debouncedUpdate();
    if (document.getElementById("deckModal")) renderDeckList();
}

// ======================================================================
// Разбор tooltip
// ======================================================================
function parseTooltip(tooltip) {

    const html = tooltip.innerHTML;

    const titleMatch = html.match(/<strong class="title">(.*?)<\/strong>/);
    if (!titleMatch) return;

    const animeName = titleMatch[1].trim();

    const totalMatch = html.match(/Карт в колоде:\s*([\d]+)/);
    if (!totalMatch) return;

    const total = parseInt(totalMatch[1]);
    if (total < 10) return;

    const collectedMatch =
        html.match(/Собрано карт:\s*<b>([\d]+)/) ||
        html.match(/Собрано карт:\s*<\/b><b>([\d]+)/);

    const collected = collectedMatch ? parseInt(collectedMatch[1]) : null;
    const isCollected = collected !== null && collected === total;

    // ===============================================================
    // Извлекаем реальное количество S-карт из tooltip
    // ===============================================================

    const sProgressMatch = html.match(/>S<\/b>\s*([\d]+)\/([\d]+)/);
    let totalSCount = 0;

    if (sProgressMatch) {
        totalSCount = parseInt(sProgressMatch[2]); // ← смотрим ТОЛЬКО второе число
    }

    const isSDeck = totalSCount > 0;
    const animeLink = extractAnimeLinkFromTooltip(html);

    addDeckFromTooltip({
        anime: animeName,
        total,
        isCollected,
        isSDeck,
        totalSCount,
        animeLink
    });
}

// ======================================================================
// Ожидание загрузки tooltip
// ======================================================================
function processTooltip(node) {

    let last = node.innerHTML;

    const obs = new MutationObserver(() => {

        const now = node.innerHTML;
        if (now === last) return;
        last = now;

        if (now.includes('<strong class="title">') &&
            now.includes('Карт в колоде')) {

            obs.disconnect();
            parseTooltip(node);
        }
    });

    obs.observe(node, { childList: true, subtree: true });
}

// ======================================================================
// Observer — ищет tooltip только в body
// ======================================================================
(function observeACMTooltips() {

    const obs = new MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {

                if (!(n instanceof HTMLElement)) continue;

                if (n.classList.contains("acm-info-tooltip-popup")) {
                    console.log("[DeckTracker] Tooltip пойман → обработка...");
                    processTooltip(n);
                }
            }
        }
    });

    obs.observe(document.body, {
        childList: true,
        subtree: false
    });

    console.log("[DeckTracker] Авто-добавление колод активировано.");
})();



})();