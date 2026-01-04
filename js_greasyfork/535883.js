// ==UserScript==
// @name         Бортовой Журнал
// @namespace    Sirotkin1
// @version      1.25
// @description  Специально для Деши
// @author       Сирота [1390991]
// @copyright    Wilhelm Birkner [https://vk.vk.com/washclown]
// @match        *://catwar.net/cw3/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535883/%D0%91%D0%BE%D1%80%D1%82%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%96%D1%83%D1%80%D0%BD%D0%B0%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/535883/%D0%91%D0%BE%D1%80%D1%82%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%96%D1%83%D1%80%D0%BD%D0%B0%D0%BB.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwWaX6_u9ONEAKTFfAtmz9ft5DJ06Yurbo_ma9pImq1BYfnUjSlSj_PBfNC5LxzXXnojw/exec';
 
    const NYRKI_SHEET_NAME = "Нырки";
    const DUPLO_SHEET_NAME = "Дупло";
    const PROCHEE_SHEET_NAME = "Прочее"; // Это название отправляется в Apps Script для идентификации группы действий
 
    // Списки действий и URL картинок
    const itemImageUrls = {
        'Ракушка30': 'https://catwar.net/cw3/things/3995.png', 'ракушка28': 'https://catwar.net/cw3/things/3999.png', 'ракушка20': 'https://catwar.net/cw3/things/3994.png',
        'ракушка15': 'https://catwar.net/cw3/things/3998.png', 'ракушка сон': 'https://catwar.net/cw3/things/3997.png', 'целебная водоросль': 'https://catwar.net/cw3/things/21.png',
        'ветка': 'https://catwar.net/cw3/things/565.png', 'плотная водоросль': 'https://catwar.net/cw3/things/3993.png', 'рыба': 'https://catwar.net/cw3/things/3965.png',
        'мох': 'https://catwar.net/cw3/things/75.png', 'водный мох': 'https://catwar.net/cw3/things/3420.png', 'камен3': 'https://catwar.net/cw3/things/418.png',
        'камень2': 'https://catwar.net/cw3/things/417.png', 'камень1': 'https://catwar.net/cw3/things/1034.png', 'угорь': 'https://catwar.net/cw3/things/3971.png',
        'рак': 'https://catwar.net/cw3/things/3956.png', 'жаба': 'https://catwar.net/cw3/things/3962.png', 'ком': 'https://catwar.net/cw3/things/4009.png'
    };
    const diveActions = Object.keys(itemImageUrls);
    const specialDiveActions = ['Пустой нырок', 'Сбитый нырок', 'Комок мальки', 'Удачный комок'];
 
    // Исправленные списки действий и URL картинок для Дупла
    const newDuploActions = [
        "гнездо", "сперо", "кперо", "чперо", "пау", "вьюн", "мох", "питьмох", "мед", "камень2",
        "камень1", "яйцо", "ящер", "змея1", "змея2", "ЯДКА1", "ЯДКА2", "пчела", "паук", "мышь", "птица", "белка"
    ];
 
    const specialDuploActions = ["строчка", "гнездо яйцо", "гнездо удача"];
 
     const duploButtonImageUrls = {
        'гнездо': 'https://catwar.net/cw3/things/2072.png', 'сперо': 'https://catwar.net/cw3/things/2077.png', 'кперо': 'https://catwar.net/cw3/things/2076.png',
        'чперо': 'https://catwar.net/cw3/things/2075.png',
        'пау': 'https://catwar.net/cw3/things/20.png',
        'вьюн': 'https://catwar.net/cw3/things/566.png',
        'мох': 'https://catwar.net/cw3/things/75.png', // Исправлен лишний пробел
        'питьмох': 'https://catwar.net/cw3/things/76.png',
        'мед': 'https://catwar.net/cw3/things/110.png',
        'камень2': 'https://catwar.net/cw3/things/417.png',
        'камень1': 'https://catwar.net/cw3/things/1034.png',
        'яйцо': 'https://catwar.net/cw3/things/2074.png',
        'ящер': 'https://catwar.net/cw3/things/8041.png',
        'змея1': 'https://catwar.net/cw3/things/8025.png',
        'змея2': 'https://catwar.net/cw3/things/8026.png',
        'ЯДКА1': 'https://catwar.net/cw3/things/8028.png',
        'ЯДКА2': 'https://catwar.net/cw3/things/8027.png',
        'пчела': 'https://catwar.net/cw3/things/8020.png',
        'паук': 'https://catwar.net/cw3/things/8024.png',
        'мышь': 'https://catwar.net/cw3/things/8037.png',
        'птица': 'https://catwar.net/cw3/things/8032.png',
        'белка': 'https://catwar.net/cw3/things/8036.png'
    };
 
 
    // Список действий для Прочее, отправляемых в Apps Script
    const updatedProcheeActions = [
        { text: "Ущелье", sends: "Ущелье" }, { text: "Паутина(у)", sends: "Паутина(у)" },
        { text: "Уступы", sends: "Уступы" }, { text: "Мох(у)", sends: "Мох(у)" },
        { text: "Туннели", sends: "Туннели" }, { text: "Паутина(т)", sends: "Паутина(т)" },
        { text: "Горы", sends: "Горы" }, { text: "Мох(г)", sends: "Мох(г)" },
        { text: "Патрули", sends: "Патрули" }, { text: "Дозоры", sends: "Дозоры" }
    ];
 
 
    let uiContainer = null;
    let mainHeader = null;
    let contentContainer = null;
    let nyrkiSectionContainer = null;
    let nyrkiHeader = null;
    let nyrkiContent = null;
    let collapseIndicatorNyrki = null;
    let duploSectionContainer = null;
    let duploHeader = null;
    let duploContent = null;
    let collapseIndicatorDuplo = null;
    let procheeSectionContainer = null;
    let procheeHeader = null;
    let procheeContent = null;
    let collapseIndicatorProchee = null;
 
 
    let diveCount = 0;
    let diveCounterDisplay = null;
 
    // Переменные для перетаскивания
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
 
    // Состояния сворачивания секций
    let isNyrkiCollapsed = false;
    let isDuploCollapsed = false;
    let isProcheeCollapsed = false;
 
 
    // Ключи для сохранения состояния
    const POS_STORAGE_KEY = 'boardLogUI_position_v2';
    const NYRKI_COLLAPSE_STORAGE_KEY = 'boardLogUI_nyrki_collapsed_v1';
    const DUPLO_COLLAPSE_STORAGE_KEY = 'boardLogUI_duplo_collapsed_v1';
    const PROCHEE_COLLAPSE_STORAGE_KEY = 'boardLogUI_prochee_collapsed_v1';
    const DIVE_COUNT_STORAGE_KEY = 'boardLogUI_dive_count_v1';
 
     const ANIMATED_PROPERTIES = 'left 0.3s ease, top 0.3s ease, right 0.3s ease, bottom 0.3s ease, opacity 0.3s ease';
 
 
    // Функция отправки данных
    function sendData(sheetName, action, value = undefined) {
        console.log(`[Board Log Script] Отправка данных: лист "${sheetName}", действие "${action}"${value !== undefined ? ', значение "' + value + '"' : ''}`);
 
        if (SCRIPT_URL === 'https://script.google.com/macros/s/АКтуальный_URL/exec' || SCRIPT_URL === '') {
            console.error("[Board Log Script] SCRIPT_URL не сконфигурирован!");
            return;
        }
 
        const data = { sheet: sheetName, action: action };
        if (value !== undefined) data.value = value;
 
        GM_xmlhttpRequest({
            method: "POST",
            url: SCRIPT_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function (response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.success) {
                        console.log("[Board Log Script] Успешно:", res.message || 'Действие записано.');
                    } else {
                        console.error("[Board Log Script] Ошибка на сервере:", res.message || res.error || 'Неизвестная ошибка.');
                    }
                } catch (e) {
                    console.error("[Board Log Script] Ошибка парсинга ответа от сервера:", e, response.responseText);
                }
            },
            onerror: function (error) {
                console.error("[Board Log Script] Ошибка сетевого запроса:", error);
            }
        });
    }
 
     // Функции счетчика нырков
     function updateDiveCounterDisplay() {
        if (diveCounterDisplay) {
            diveCounterDisplay.textContent = `Нырков: ${diveCount}`;
        }
    }
 
    function handleDiveAction() {
        diveCount++;
        updateDiveCounterDisplay();
        saveState();
    }
 
 
    // Функции сохранения/загрузки состояния
    function saveState() {
        if (uiContainer) {
            const pos = {
                left: uiContainer.style.left, top: uiContainer.style.top,
                right: uiContainer.style.right, bottom: uiContainer.style.bottom,
                width: uiContainer.style.width, height: uiContainer.style.height
            };
            GM_setValue(POS_STORAGE_KEY, pos);
            GM_setValue(NYRKI_COLLAPSE_STORAGE_KEY, isNyrkiCollapsed);
            GM_setValue(DUPLO_COLLAPSE_STORAGE_KEY, isDuploCollapsed);
            GM_setValue(PROCHEE_COLLAPSE_STORAGE_KEY, isProcheeCollapsed);
            GM_setValue(DIVE_COUNT_STORAGE_KEY, diveCount);
        }
    }
 
    function loadState() {
        const savedPos = GM_getValue(POS_STORAGE_KEY, null);
        isNyrkiCollapsed = GM_getValue(NYRKI_COLLAPSE_STORAGE_KEY, true);
        isDuploCollapsed = GM_getValue(DUPLO_COLLAPSE_STORAGE_KEY, true);
        isProcheeCollapsed = GM_getValue(PROCHEE_COLLAPSE_STORAGE_KEY, true);
        diveCount = GM_getValue(DIVE_COUNT_STORAGE_KEY, 0);
 
        if (diveCounterDisplay) {
            updateDiveCounterDisplay();
        }
 
 
        if (uiContainer) {
            if (savedPos) {
                uiContainer.style.left = savedPos.left || 'auto';
                uiContainer.style.top = savedPos.top || 'auto';
                uiContainer.style.right = savedPos.right || 'auto';
                uiContainer.style.bottom = savedPos.bottom || 'auto';
                 if (savedPos.width) uiContainer.style.width = savedPos.width;
                 if (savedPos.height) uiContainer.style.height = savedPos.height;
 
                 // Если сохраненная позиция - 'auto', устанавливаем дефолтную в левом нижнем углу
                 if (savedPos.left === 'auto' && savedPos.top === 'auto' && savedPos.right === 'auto' && savedPos.bottom === 'auto') {
                     uiContainer.style.bottom = '20px';
                     uiContainer.style.left = '20px';
                 }
 
            } else {
                 // Дефолтная позиция при первом запуске
                uiContainer.style.bottom = '20px';
                uiContainer.style.left = '20px';
                uiContainer.style.right = 'auto';
                uiContainer.style.top = 'auto';
            }
 
             // Применяем сохраненные состояния сворачивания с небольшой задержкой
            requestAnimationFrame(() => {
                applyNyrkiCollapseState();
                applyDuploCollapseState();
                applyProcheeCollapseState();
            });
 
        } else {
             console.error("[Board Log Script] uiContainer не найден при попытке загрузки состояния.");
        }
 
    }
 
    // Функции применения состояния сворачивания
     function applyNyrkiCollapseState() {
        if (!nyrkiSectionContainer || !nyrkiContent || !collapseIndicatorNyrki) return;
        nyrkiContent.style.display = isNyrkiCollapsed ? 'none' : 'block';
        collapseIndicatorNyrki.textContent = isNyrkiCollapsed ? '▼' : '▲';
    }
 
    function applyDuploCollapseState() {
        if (!duploSectionContainer || !duploContent || !collapseIndicatorDuplo) return;
        duploContent.style.display = isDuploCollapsed ? 'none' : 'block';
        collapseIndicatorDuplo.textContent = isDuploCollapsed ? '▼' : '▲';
    }
 
    function applyProcheeCollapseState() {
        if (!procheeSectionContainer || !procheeContent || !collapseIndicatorProchee) return;
        procheeContent.style.display = isProcheeCollapsed ? 'none' : 'block';
        collapseIndicatorProchee.textContent = isProcheeCollapsed ? '▼' : '▲';
    }
 
    // Функции переключения сворачивания
    function toggleNyrkiCollapse() { isNyrkiCollapsed = !isNyrkiCollapsed; applyNyrkiCollapseState(); saveState(); }
    function toggleDuploCollapse() { isDuploCollapsed = !isDuploCollapsed; applyDuploCollapseState(); saveState(); }
    function toggleProcheeCollapse() { isProcheeCollapsed = !isProcheeCollapsed; applyProcheeCollapseState(); saveState(); }
 
    function handleMouseDown(e) {
        // Проверяем, что клик был по заголовку или его непосредственному потомку, не индикатору сворачивания
        if (e.target === mainHeader || (e.target.parentNode === mainHeader && !e.target.classList.contains('collapse-indicator'))) {
            isDragging = true;
            const rect = uiContainer.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            uiContainer.style.cursor = 'grabbing';
            uiContainer.style.transition = 'none'; // Отключаем анимацию на время перетаскивания
            document.body.style.userSelect = 'none'; // Отключаем выделение текста на странице
 
             // Добавляем обработчики событий mousemove и mouseup только при начале перетаскивания
             document.addEventListener('mousemove', handleMouseMove);
             document.addEventListener('mouseup', handleMouseUp);
             document.addEventListener('mouseleave', handleMouseUp); // Добавляем слушатель mouseleave на документ
        }
    }
 
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault(); // Отменяем стандартное действие браузера
        uiContainer.style.left = `${e.clientX - dragOffsetX}px`;
        uiContainer.style.top = `${e.clientY - dragOffsetY}px`;
        uiContainer.style.right = 'auto'; // Сбрасываем привязки к правому/нижнему краю
        uiContainer.style.bottom = 'auto';
    }
 
     function handleMouseUp() {
        if (isDragging) {
            isDragging = false;
            uiContainer.style.cursor = 'grab';
            uiContainer.style.transition = ANIMATED_PROPERTIES; // Включаем обратно анимацию
            document.body.style.userSelect = ''; // Включаем обратно выделение текста
            saveState(); // Сохраняем новую позицию окна
 
             // Удаляем обработчики событий mousemove и mouseup после завершения перетаскивания
             document.removeEventListener('mousemove', handleMouseMove);
             document.removeEventListener('mouseup', handleMouseUp);
             document.removeEventListener('mouseleave', handleMouseUp); // Удаляем слушатель mouseleave
        }
    }
 
 
    // Функция создания пользовательского интерфейса
    function createUI() {
        // Если UI уже существует, просто находим ссылки на элементы и загружаем состояние
        if (document.getElementById('boardLogUI')) {
            uiContainer = document.getElementById('boardLogUI');
            mainHeader = uiContainer.querySelector('#boardLogUI > div:first-child');
            contentContainer = document.getElementById('boardLogContentContainer');
 
             // Находим контейнеры секций
            nyrkiSectionContainer = contentContainer.querySelector('.section-container:nth-child(1)');
            nyrkiHeader = nyrkiSectionContainer?.querySelector('.section-header');
            nyrkiContent = nyrkiSectionContainer?.querySelector('.section-content');
            collapseIndicatorNyrki = nyrkiHeader?.querySelector('.collapse-indicator');
            diveCounterDisplay = nyrkiContent?.querySelector('#diveCounterTextElement'); // Находим элемент счетчика нырков
 
            duploSectionContainer = contentContainer.querySelector('.section-container:nth-child(2)');
            duploHeader = duploSectionContainer?.querySelector('.section-header');
            duploContent = duploSectionContainer?.querySelector('.section-content');
            collapseIndicatorDuplo = duploHeader?.querySelector('.collapse-indicator');
 
            procheeSectionContainer = contentContainer.querySelector('.section-container:nth-child(3)');
            procheeHeader = procheeSectionContainer?.querySelector('.section-header');
            procheeContent = procheeSectionContainer?.querySelector('.section-content');
            collapseIndicatorProchee = procheeHeader?.querySelector('.collapse-indicator');
 
            if (mainHeader && !mainHeader._hasMousedownListener) {
                 mainHeader.addEventListener('mousedown', handleMouseDown);
                 mainHeader._hasMousedownListener = true;
            }
 
             // Добавляем слушатели клика на заголовки секций
             if (nyrkiHeader && !nyrkiHeader._hasCollapseListener) {
                 nyrkiHeader.addEventListener('click', toggleNyrkiCollapse);
                 nyrkiHeader._hasCollapseListener = true;
             }
             if (duploHeader && !duploHeader._hasCollapseListener) {
                 duploHeader.addEventListener('click', toggleDuploCollapse);
                 duploHeader._hasCollapseListener = true;
             }
             if (procheeHeader && !procheeHeader._hasCollapseListener) {
                 procheeHeader.addEventListener('click', toggleProcheeCollapse);
                 procheeHeader._hasCollapseListener = true;
             }
 
             // Находим кнопку сброса счетчика нырков и добавляем слушатель
             const existingResetButton = nyrkiContent?.querySelector('#resetDiveCounterButton');
             if (existingResetButton && !existingResetButton._hasResetListener) {
                 existingResetButton.addEventListener('click', () => {
                     diveCount = 0;
                     updateDiveCounterDisplay();
                     saveState();
                 });
                 existingResetButton._hasResetListener = true;
             }
 
 
            loadState(); // Загружаем сохраненное состояние
            return; // Если UI уже создан, выходим
        }
 
        // Если UI не существует, создаем его
        uiContainer = document.createElement('div');
        uiContainer.id = 'boardLogUI';
        Object.assign(uiContainer.style, {
            position: 'fixed',
             // Изначальные размеры окна (можно настроить)
            width: '200px',
            minWidth: '150px',
            maxHeight: '85vh',
            minHeight: '50px',
 
            background: 'rgba(30, 30, 30, 0.95)',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '8px',
            zIndex: '10000',
            color: '#fff',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            boxShadow: '0 44px 12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden', // Скрываем содержимое, выходящее за границы
            resize: 'both', // Разрешаем изменение размера
            display: 'flex',
            flexDirection: 'column',
            transition: ANIMATED_PROPERTIES, // Плавное перемещение
            boxSizing: 'border-box'
        });
 
        // Добавляем общие стили через GM_addStyle
        const style = `
            #boardLogUI::-webkit-resizer {
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-bottom-right-radius: 5px;
                background: transparent;
            }
            .section-container {
                border-bottom: 1px solid #555; margin-bottom: 8px; padding-bottom: 8px;
            }
            .section-container:last-child {
                border-bottom: none; margin-bottom: 0; padding-bottom: 0;
            }
            .section-header {
                cursor: pointer;
                background: rgba(50, 50, 50, 0.8);
                padding: 6px; margin-bottom: 4px; border-radius: 5px;
                font-weight: bold; user-select: none;
                display: flex; justify-content: space-between; align-items: center;
                transition: background 0.2s ease;
            }
            .section-header:hover {
                background: rgba(60, 60, 60, 0.9);
            }
            .section-content {
                flex-shrink: 0;
            }
            .collapse-indicator {
                margin-left: 8px; cursor: pointer; font-weight: bold;
                padding: 0 4px; user-select: none;
            }
            #boardLogContentContainer {
                flex-grow: 1; overflow-y: auto; overflow-x: hidden;
                padding-right: 3px; margin-right: -2px; box-sizing: border-box;
            }
            #boardLogContentContainer::-webkit-scrollbar { width: 6px; }
            #boardLogContentContainer::-webkit-scrollbar-track { background: rgba(50, 50, 50, 0.3); border-radius: 3px; }
            #boardLogContentContainer::-webkit-scrollbar-thumb { background: rgba(100, 100, 100, 0.6); border-radius: 3px; }
            #boardLogContentContainer::-webkit-scrollbar-thumb:hover { background: rgba(120, 120, 120, 0.7); }
 
            .item-button {
                padding: 3px; border: none; border-radius: 4px; cursor: pointer;
                display: flex; justify-content: center; align-items: center;
                width: 50px; height: 50px; transition: background 0.2s ease;
                box-sizing: border-box; background: #444;
            }
           .item-button:hover { background: #666; }
           .item-button img {
             width: 40px; height: 40px; object-fit: contain; pointer-events: none;
           }
            .special-button {
                padding: 4px; color: #eee; border: none; border-radius: 4px;
                cursor: pointer; font-size: 10px; width: 100%; box-sizing: border-box;
                transition: background 0.2s ease; white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis; text-align: center; background: #5a4130;
            }
            .special-button:hover { background: #70513b; }
 
            .button-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
                gap: 6px; padding-bottom: 8px;
            }
            .text-button-grid {
                display: grid; grid-template-columns: repeat(2, 1fr);
                gap: 6px; padding-bottom: 8px;
            }
            .text-button {
                padding: 6px 12px; border: 1px solid #777; border-radius: 4px;
                cursor: pointer; background: #444; color: #eee;
                transition: background 0.2s ease; font-size: 12px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                text-align: center; width: 100%; box-sizing: border-box;
            }
            .text-button:hover { background: #666; }
 
            .special-button-flex {
                display: flex; gap: 6px; justify-content: space-between; flex-wrap: wrap;
            }
            #diveCounterContainer {
                display: flex; justify-content: space-between; align-items: center;
                padding: 4px 2px; margin-bottom: 10px; border-bottom: 1px solid #4a4a4a;
                font-size: 13px;
            }
            #diveCounterTextElement { color: #ccc; }
            #resetDiveCounterButton {
                width: auto !important; padding: 3px 7px !important; font-size: 10px !important;
                margin: 0 !important; flex-shrink: 0;
            }
        `;
 
        try {
            GM_addStyle(style);
        } catch (e) {
            console.error('[Board Log Script] Ошибка GM_addStyle:', e);
        }
 
        // Создаем заголовок окна
        mainHeader = document.createElement('div');
        Object.assign(mainHeader.style, {
            cursor: 'grab', // Курсор для перетаскивания
            background: 'rgba(40, 40, 40, 0.9)',
            padding: '6px',
            marginBottom: '8px',
            borderRadius: '5px',
            textAlign: 'center',
            fontWeight: 'bold',
            userSelect: 'none',
            flexShrink: '0',
            color: '#bbb'
        });
        mainHeader.textContent = 'Бортовой журнал';
        uiContainer.appendChild(mainHeader);
 
        // Создаем контейнер для содержимого
        contentContainer = document.createElement('div');
        contentContainer.id = 'boardLogContentContainer';
        uiContainer.appendChild(contentContainer);
 
        // --- Создаем секцию "Нырки" ---
        nyrkiSectionContainer = document.createElement('div');
        nyrkiSectionContainer.classList.add('section-container');
        contentContainer.appendChild(nyrkiSectionContainer);
 
        nyrkiHeader = document.createElement('div');
        nyrkiHeader.classList.add('section-header');
        nyrkiHeader.textContent = 'Нырки ';
        collapseIndicatorNyrki = document.createElement('span');
        collapseIndicatorNyrki.classList.add('collapse-indicator');
        nyrkiHeader.appendChild(collapseIndicatorNyrki);
        nyrkiSectionContainer.appendChild(nyrkiHeader);
        nyrkiHeader.addEventListener('click', toggleNyrkiCollapse); // Слушатель сворачивания/разворачивания
         nyrkiHeader._hasCollapseListener = true;
 
 
        nyrkiContent = document.createElement('div');
        nyrkiContent.classList.add('section-content');
        nyrkiSectionContainer.appendChild(nyrkiContent);
 
        // Элементы счетчика нырков
        const diveCounterContainerEl = document.createElement('div');
        diveCounterContainerEl.id = 'diveCounterContainer';
        diveCounterDisplay = document.createElement('span');
        diveCounterDisplay.id = 'diveCounterTextElement';
        updateDiveCounterDisplay(); // Обновляем отображение счетчика
 
        const resetDiveCounterButton = document.createElement('button');
        resetDiveCounterButton.id = 'resetDiveCounterButton';
        resetDiveCounterButton.classList.add('special-button');
        resetDiveCounterButton.textContent = 'Сброс';
        resetDiveCounterButton.title = "Сбросить счетчик нырков";
        resetDiveCounterButton.addEventListener('click', () => {
            diveCount = 0;
            updateDiveCounterDisplay();
            saveState(); // Сохраняем после сброса
        });
         resetDiveCounterButton._hasResetListener = true;
 
 
        diveCounterContainerEl.appendChild(diveCounterDisplay);
        diveCounterContainerEl.appendChild(resetDiveCounterButton);
        nyrkiContent.appendChild(diveCounterContainerEl);
 
        // Кнопки предметов нырков
        const itemButtonsContainer = document.createElement('div');
        itemButtonsContainer.classList.add('button-grid');
        nyrkiContent.appendChild(itemButtonsContainer);
 
        diveActions.forEach(action => {
            const button = document.createElement('button');
            button.classList.add('item-button');
            button.title = action;
            const img = document.createElement('img');
            img.src = itemImageUrls[action];
            img.alt = action;
            button.appendChild(img);
            button.addEventListener('click', () => {
                sendData(NYRKI_SHEET_NAME, `Нырок: ${action}`);
                handleDiveAction(); // Увеличиваем счетчик нырков
            });
            itemButtonsContainer.appendChild(button);
        });
 
        // Кнопки специальных действий нырков
        const specialNyrkiButtonsContainer = document.createElement('div');
        specialNyrkiButtonsContainer.classList.add('special-button-flex');
        nyrkiContent.appendChild(specialNyrkiButtonsContainer);
 
        specialDiveActions.forEach(action => {
            const button = document.createElement('button');
            button.classList.add('special-button');
            button.textContent = action;
            button.title = action;
            button.addEventListener('click', () => {
                sendData(NYRKI_SHEET_NAME, `Нырок: ${action}`);
                handleDiveAction(); // Увеличиваем счетчик нырков
            });
            specialNyrkiButtonsContainer.appendChild(button);
        });
 
        // --- Создаем секцию "Дупло" ---
        duploSectionContainer = document.createElement('div');
        duploSectionContainer.classList.add('section-container');
        contentContainer.appendChild(duploSectionContainer);
 
        duploHeader = document.createElement('div');
        duploHeader.classList.add('section-header');
        duploHeader.textContent = 'Дупло ';
        collapseIndicatorDuplo = document.createElement('span');
        collapseIndicatorDuplo.classList.add('collapse-indicator');
        duploHeader.appendChild(collapseIndicatorDuplo);
        duploSectionContainer.appendChild(duploHeader);
        duploHeader.addEventListener('click', toggleDuploCollapse); // Слушатель сворачивания/разворачивания
         duploHeader._hasCollapseListener = true;
 
 
        duploContent = document.createElement('div');
        duploContent.classList.add('section-content');
        duploSectionContainer.appendChild(duploContent);
 
        // Кнопки предметов Дупла
         const duploItemButtonsContainer = document.createElement('div');
        duploItemButtonsContainer.classList.add('button-grid');
        duploContent.appendChild(duploItemButtonsContainer);
 
        newDuploActions.forEach(action => {
            const button = document.createElement('button');
            button.classList.add('item-button');
            button.title = action;
            const img = document.createElement('img');
            img.src = duploButtonImageUrls[action]; // Используем исправленный объект с URL картинок
            img.alt = action;
            button.appendChild(img);
            button.addEventListener('click', () => sendData(DUPLO_SHEET_NAME, action));
            duploItemButtonsContainer.appendChild(button);
        });
 
        // Кнопки специальных действий Дупла
         const specialDuploButtonsContainer = document.createElement('div');
        specialDuploButtonsContainer.classList.add('special-button-flex');
        duploContent.appendChild(specialDuploButtonsContainer);
 
        specialDuploActions.forEach(action => {
            const button = document.createElement('button');
            button.classList.add('special-button');
            button.textContent = action;
            button.title = action;
            button.addEventListener('click', () => sendData(DUPLO_SHEET_NAME, action));
            specialDuploButtonsContainer.appendChild(button);
        });
 
 
        // --- Создаем секцию "Прочее" ---
        procheeSectionContainer = document.createElement('div');
        procheeSectionContainer.classList.add('section-container');
        contentContainer.appendChild(procheeSectionContainer);
 
        procheeHeader = document.createElement('div');
        procheeHeader.classList.add('section-header');
        procheeHeader.textContent = 'Прочее ';
        collapseIndicatorProchee = document.createElement('span');
        collapseIndicatorProchee.classList.add('collapse-indicator');
        procheeHeader.appendChild(collapseIndicatorProchee);
        procheeSectionContainer.appendChild(procheeHeader);
        procheeHeader.addEventListener('click', toggleProcheeCollapse); // Слушатель сворачивания/разворачивания
         procheeHeader._hasCollapseListener = true;
 
 
        procheeContent = document.createElement('div');
        procheeContent.classList.add('section-content');
        procheeSectionContainer.appendChild(procheeContent);
 
        // Кнопки действий Прочее
        const procheeButtonsContainer = document.createElement('div');
        procheeButtonsContainer.classList.add('text-button-grid');
        procheeContent.appendChild(procheeButtonsContainer);
 
        updatedProcheeActions.forEach(entry => {
            const button = document.createElement('button');
            button.classList.add('text-button');
            button.textContent = entry.text;
            button.addEventListener('click', () => {
                sendData(PROCHEE_SHEET_NAME, entry.sends);
            });
            procheeButtonsContainer.appendChild(button);
        });
 
 
        // Добавляем окно в body страницы
        document.body.appendChild(uiContainer);
      // Эти слушатели добавляются только один раз при создании UI
         mainHeader.addEventListener('mousedown', handleMouseDown);
         mainHeader._hasMousedownListener = true; // Флаг, чтобы не добавить повторно (на всякий случай)
 
        loadState(); // Загружаем сохраненное состояние
    }
 
    // Инициализация скрипта
    function initScript() {
        // Привязываем создание UI к событиям изменения URL (переход по локациям)
        window.addEventListener('hashchange', createUI);
        window.addEventListener('popstate', createUI);
 
        // Наблюдатель за изменениями в DOM для пересоздания UI, если он был удален игрой
        const observer = new MutationObserver((mutations) => {
            let uiNeedsRecreation = false;
            for (const mutation of mutations) {
                if (mutation.removedNodes.length) {
                    for (const node of mutation.removedNodes) {
                        if (node.id === 'boardLogUI') {
                            uiNeedsRecreation = true;
                            break;
                        }
                    }
                }
                if (uiNeedsRecreation) break;
            }
            if (uiNeedsRecreation) {
                // Очищаем ссылки на старые элементы, чтобы они были созданы заново
                uiContainer = null; mainHeader = null; contentContainer = null;
                nyrkiSectionContainer = null; nyrkiHeader = null; nyrkiContent = null; collapseIndicatorNyrki = null; diveCounterDisplay = null;
                duploSectionContainer = null; duploHeader = null; duploContent = null; collapseIndicatorDuplo = null;
                procheeSectionContainer = null; procheeHeader = null; procheeContent = null; collapseIndicatorProchee = null;
                setTimeout(createUI, 100); // Пытаемся пересоздать UI с небольшой задержкой
            }
        });
         // Наблюдаем за изменениями в body страницы
        observer.observe(document.body, { subtree: true, childList: true });
 
 
        // Создаем UI при первой загрузке страницы
        createUI();
    }
 
    // Запускаем инициализацию скрипта после полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript(); // Если DOM уже загружен, запускаем сразу
    }
 
})();