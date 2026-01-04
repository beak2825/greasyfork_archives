// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛТ) с управлением и автопереключением - От ВВ до Деревни
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций и автопереключением по клику
// @author       MyName
// @match        https://catwar.net/cw3/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546088/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%A2%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546088/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%A2%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для интерфейса
    GM_addStyle(`
        .cw-highlight-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        .cw-highlight-ui button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 0 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        .cw-highlight-ui button:hover {
            background: #45a049;
        }
        .cw-highlight-ui span {
            font-weight: bold;
            margin: 0 10px;
        }
        .highlighted-cell {
            cursor: pointer;
        }
    `);

    // База данных всех локаций (ID => {row, col}) из таблицы ЛТ.xlsx
    const highlightRules = {
        100: { row: 6, col: 5 },
        99: { row: 2, col: 7 },
        98: { row: 6, col: 1 },
        97: { row: 1, col: 8 },
        96: { row: 4, col: 2 },
        95: { row: 5, col: 1 },
        94: { row: 2, col: 1 },
        93: { row: 1, col: 4 },
        92: { row: 5, col: 9 },
        91: { row: 5, col: 9 },
        90: { row: 6, col: 8 },
        89: { row: 1, col: 6 },
        88: { row: 1, col: 3 },
        87: { row: 1, col: 6 },
        86: { row: 5, col: 4 },
        85: { row: 3, col: 5 },
        84: { row: 4, col: 1 },
        83: { row: 5, col: 9 },
        82: { row: 1, col: 9 },
        81: { row: 4, col: 9 },
        80: { row: 1, col: 3 },
        79: { row: 2, col: 5 },
        78: { row: 3, col: 4 },
        77: { row: 1, col: 5 },
        76: { row: 2, col: 6 },
        75: { row: 1, col: 3 },
        74: { row: 3, col: 4 },
        73: { row: 2, col: 9 },
        72: { row: 6, col: 5 },
        71: { row: 4, col: 7 },
        70: { row: 5, col: 5 },
        69: { row: 1, col: 3 },
        68: { row: 2, col: 2 },
        67: { row: 3, col: 5 },
        66: { row: 1, col: 5 },
        65: { row: 1, col: 7 },
        64: { row: 4, col: 5 },
        63: { row: 2, col: 3 },
        62: { row: 3, col: 1 },
        61: { row: 4, col: 9 },
        60: { row: 6, col: 1 },
        59: { row: 1, col: 2 },
        58: { row: 6, col: 6 },
        57: { row: 3, col: 7 },
        56: { row: 4, col: 4 },
        55: { row: 1, col: 2 },
        54: { row: 4, col: 1 },
        53: { row: 6, col: 5 },
        52: { row: 6, col: 8 },
        51: { row: 1, col: 7 },
        50: { row: 2, col: 5 },
        49: { row: 2, col: 2 },
        48: { row: 3, col: 1 },
        47: { row: 6, col: 1 },
        46: { row: 2, col: 4 },
        45: { row: 4, col: 3 },
        44: { row: 4, col: 8 },
        43: { row: 6, col: 6 },
        42: { row: 5, col: 2 },
        41: { row: 1, col: 9 },
        40: { row: 1, col: 4 },
        39: { row: 5, col: 1 },
        38: { row: 1, col: 2 },
        37: { row: 6, col: 7 },
        36: { row: 1, col: 6 },
        35: { row: 3, col: 2 },
        34: { row: 6, col: 1 },
        33: { row: 2, col: 4 },
        32: { row: 5, col: 3 },
        31: { row: 5, col: 4 },
        30: { row: 6, col: 4 },
        29: { row: 5, col: 2 },
        28: { row: 6, col: 3 },
        27: { row: 2, col: 1 },
        26: { row: 2, col: 1 },
        25: { row: 1, col: 5 },
        24: { row: 5, col: 2 },
        23: { row: 3, col: 2 },
        22: { row: 5, col: 1 },
        21: { row: 2, col: 3 },
        20: { row: 5, col: 8 },
        19: { row: 3, col: 8 },
        18: { row: 5, col: 3 },
        17: { row: 6, col: 7 },
        16: { row: 4, col: 3 },
        15: { row: 2, col: 7 },
        14: { row: 1, col: 7 },
        13: { row: 3, col: 1 },
        12: { row: 5, col: 1 },
        11: { row: 1, col: 6 },
        10: { row: 1, col: 7 },
        9: { row: 1, col: 6 },
        8: { row: 6, col: 4 },
        7: { row: 3, col: 6 },
        6: { row: 1, col: 9 },
        5: { row: 2, col: 8 },
        4: { row: 2, col: 1 },
        3: { row: 4, col: 1 },
        2: { row: 3, col: 5 },
        1: { row: 1, col: 1 }
    };

    // Загружаем сохраненный ID локации или используем 100 по умолчанию (максимальный ID в таблице)
    let currentLocationId = GM_getValue('currentLocationId', 100);
    let highlightedCell = null;

    // Создаем интерфейс управления
    function createUI() {
        const ui = document.createElement('div');
        ui.className = 'cw-highlight-ui';
        ui.innerHTML = `
            <button id="cw-prev">←</button>
            <span id="cw-location-id">ID: ${currentLocationId}</span>
            <button id="cw-next">→</button>
        `;
        document.body.appendChild(ui);

        // Обработчики кнопок
        document.getElementById('cw-prev').addEventListener('click', () => {
            if (currentLocationId > 1) {
                currentLocationId--;
                saveAndUpdate();
                highlightCurrentCell();
            }
        });

        document.getElementById('cw-next').addEventListener('click', () => {
            if (currentLocationId < 100) {
                currentLocationId++;
                saveAndUpdate();
                highlightCurrentCell();
            }
        });
    }

    // Сохраняем ID и обновляем интерфейс
    function saveAndUpdate() {
        GM_setValue('currentLocationId', currentLocationId);
        updateUI();
    }

    // Обновление отображаемого ID
    function updateUI() {
        document.getElementById('cw-location-id').textContent = `ID: ${currentLocationId}`;
    }

    // Подсветка текущей клетки
    function highlightCurrentCell() {
        const rule = highlightRules[currentLocationId];
        if (!rule) {
            alert(`Локация с ID ${currentLocationId} не найдена!`);
            return;
        }

        // Сначала убираем все подсветки
        clearHighlight();

        const table = document.getElementById('cages');
        if (!table) {
            alert('Игровое поле не найдено!');
            return;
        }

        try {
            const targetCell = table.rows[rule.row - 1].cells[rule.col - 1];
            targetCell.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            targetCell.style.boxShadow = '0 0 10px 5px yellow';
            targetCell.classList.add('highlighted-cell');

            // Сохраняем ссылку на подсвеченную ячейку
            highlightedCell = targetCell;

            // Добавляем обработчик клика
            highlightedCell.addEventListener('click', handleCellClick);

            console.log(`Подсвечена клетка для локации ID ${currentLocationId}: строка ${rule.row}, столбец ${rule.col}`);
        } catch (e) {
            alert(`Ошибка: неверные координаты для локации ${currentLocationId} (строка ${rule.row}, столбец ${rule.col})`);
        }
    }

    // Очистка подсветки
    function clearHighlight() {
        if (highlightedCell) {
            highlightedCell.style.backgroundColor = '';
            highlightedCell.style.boxShadow = '';
            highlightedCell.classList.remove('highlighted-cell');
            highlightedCell.removeEventListener('click', handleCellClick);
            highlightedCell = null;
        }
    }

    // Обработчик клика по подсвеченной ячейке
    function handleCellClick() {
        if (currentLocationId > 1) {
            currentLocationId--;
            saveAndUpdate();
            highlightCurrentCell();
        } else {
            clearHighlight();
            alert('Вы достигли последней локации!');
        }
    }

    // Запускаем при загрузке страницы
    window.addEventListener('load', function() {
        createUI();
        // Первая подсветка при загрузке
        setTimeout(highlightCurrentCell, 1000);
    });
})();
