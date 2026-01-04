// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛВ) с управлением и автопереключением - От ВВ до Деревни
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций и автопереключением по клику
// @author       MyName
// @match        https://catwar.net/cw3/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546085/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%92%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546085/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%92%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.meta.js
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

    // База данных всех локаций (ID => {row, col}) из таблицы ЛВ.xlsx
    const highlightRules = {
        250: { row: 6, col: 5 },
        249: { row: 1, col: 5 },
        248: { row: 1, col: 5 },
        247: { row: 1, col: 5 },
        246: { row: 1, col: 5 },
        245: { row: 1, col: 5 },
        244: { row: 1, col: 5 },
        243: { row: 1, col: 5 },
        242: { row: 1, col: 5 },
        241: { row: 1, col: 5 },
        240: { row: 1, col: 5 },
        239: { row: 1, col: 5 },
        238: { row: 1, col: 5 },
        237: { row: 1, col: 5 },
        236: { row: 1, col: 5 },
        235: { row: 1, col: 5 },
        234: { row: 1, col: 5 },
        233: { row: 1, col: 5 },
        232: { row: 1, col: 5 },
        231: { row: 1, col: 5 },
        230: { row: 1, col: 5 },
        229: { row: 1, col: 5 },
        228: { row: 1, col: 5 },
        227: { row: 1, col: 5 },
        226: { row: 1, col: 5 },
        225: { row: 1, col: 5 },
        224: { row: 1, col: 5 },
        223: { row: 1, col: 5 },
        222: { row: 1, col: 5 },
        221: { row: 1, col: 5 },
        220: { row: 1, col: 5 },
        219: { row: 1, col: 5 },
        218: { row: 1, col: 5 },
        217: { row: 1, col: 5 },
        216: { row: 1, col: 5 },
        215: { row: 1, col: 5 },
        214: { row: 6, col: 5 },
        213: { row: 1, col: 5 },
        212: { row: 1, col: 5 },
        211: { row: 1, col: 5 },
        210: { row: 1, col: 5 },
        209: { row: 1, col: 5 },
        208: { row: 1, col: 5 },
        207: { row: 1, col: 5 },
        206: { row: 1, col: 5 },
        205: { row: 1, col: 5 },
        204: { row: 1, col: 5 },
        203: { row: 1, col: 5 },
        202: { row: 1, col: 5 },
        201: { row: 1, col: 5 },
        200: { row: 1, col: 5 },
        199: { row: 1, col: 5 },
        198: { row: 1, col: 5 },
        197: { row: 1, col: 5 },
        196: { row: 1, col: 5 },
        195: { row: 1, col: 5 },
        194: { row: 1, col: 5 },
        193: { row: 1, col: 5 },
        192: { row: 1, col: 5 },
        191: { row: 1, col: 5 },
        190: { row: 1, col: 5 },
        189: { row: 1, col: 5 },
        188: { row: 1, col: 5 },
        187: { row: 1, col: 5 },
        186: { row: 1, col: 5 },
        185: { row: 1, col: 5 },
        184: { row: 1, col: 5 },
        183: { row: 1, col: 5 },
        182: { row: 1, col: 5 },
        181: { row: 1, col: 5 },
        180: { row: 1, col: 5 },
        179: { row: 1, col: 5 },
        178: { row: 1, col: 5 },
        177: { row: 1, col: 5 },
        176: { row: 1, col: 5 },
        175: { row: 1, col: 5 },
        174: { row: 1, col: 5 },
        173: { row: 1, col: 5 },
        172: { row: 1, col: 5 },
        171: { row: 1, col: 5 },
        170: { row: 1, col: 5 },
        169: { row: 1, col: 5 },
        168: { row: 1, col: 5 },
        167: { row: 1, col: 5 },
        166: { row: 1, col: 5 },
        165: { row: 1, col: 5 },
        164: { row: 6, col: 5 },
        163: { row: 1, col: 5 },
        162: { row: 1, col: 5 },
        161: { row: 1, col: 5 },
        160: { row: 1, col: 5 },
        159: { row: 1, col: 5 },
        158: { row: 1, col: 5 },
        157: { row: 1, col: 5 },
        156: { row: 1, col: 5 },
        155: { row: 1, col: 5 },
        154: { row: 1, col: 5 },
        153: { row: 1, col: 5 },
        152: { row: 1, col: 5 },
        151: { row: 1, col: 5 },
        150: { row: 1, col: 5 },
        149: { row: 1, col: 5 },
        148: { row: 1, col: 5 },
        147: { row: 1, col: 5 },
        146: { row: 1, col: 5 },
        145: { row: 1, col: 5 },
        144: { row: 1, col: 5 },
        143: { row: 1, col: 5 },
        142: { row: 1, col: 5 },
        141: { row: 1, col: 5 },
        140: { row: 1, col: 5 },
        139: { row: 1, col: 5 },
        138: { row: 1, col: 5 },
        137: { row: 1, col: 5 },
        136: { row: 1, col: 5 },
        135: { row: 1, col: 5 },
        134: { row: 1, col: 5 },
        133: { row: 1, col: 5 },
        132: { row: 1, col: 5 },
        131: { row: 1, col: 5 },
        130: { row: 1, col: 5 },
        129: { row: 1, col: 5 },
        128: { row: 1, col: 5 },
        127: { row: 1, col: 5 },
        126: { row: 1, col: 5 },
        125: { row: 1, col: 5 },
        124: { row: 1, col: 5 },
        123: { row: 1, col: 5 },
        122: { row: 1, col: 5 },
        121: { row: 1, col: 5 },
        120: { row: 1, col: 5 },
        119: { row: 1, col: 5 },
        118: { row: 1, col: 5 },
        117: { row: 1, col: 5 },
        116: { row: 1, col: 5 },
        115: { row: 6, col: 5 },
        114: { row: 1, col: 5 },
        113: { row: 1, col: 5 },
        112: { row: 1, col: 5 },
        111: { row: 1, col: 5 },
        110: { row: 1, col: 5 },
        109: { row: 1, col: 5 },
        108: { row: 1, col: 5 },
        107: { row: 1, col: 5 },
        106: { row: 1, col: 5 },
        105: { row: 1, col: 5 },
        104: { row: 1, col: 5 },
        103: { row: 1, col: 5 },
        102: { row: 1, col: 5 },
        101: { row: 1, col: 5 },
        100: { row: 1, col: 5 },
        99: { row: 1, col: 5 },
        98: { row: 1, col: 5 },
        97: { row: 1, col: 5 },
        96: { row: 1, col: 5 },
        95: { row: 1, col: 5 },
        94: { row: 1, col: 5 },
        93: { row: 1, col: 5 },
        92: { row: 1, col: 5 },
        91: { row: 1, col: 5 },
        90: { row: 1, col: 5 },
        89: { row: 1, col: 5 },
        88: { row: 1, col: 5 },
        87: { row: 1, col: 5 },
        86: { row: 1, col: 5 },
        85: { row: 1, col: 5 },
        84: { row: 1, col: 5 },
        83: { row: 1, col: 5 },
        82: { row: 1, col: 5 },
        81: { row: 1, col: 5 },
        80: { row: 1, col: 5 },
        79: { row: 1, col: 5 },
        78: { row: 1, col: 5 },
        77: { row: 1, col: 5 },
        76: { row: 1, col: 5 },
        75: { row: 1, col: 5 },
        74: { row: 1, col: 5 },
        73: { row: 1, col: 5 },
        72: { row: 1, col: 5 },
        71: { row: 1, col: 5 },
        70: { row: 1, col: 5 },
        69: { row: 1, col: 5 },
        68: { row: 1, col: 5 },
        67: { row: 1, col: 5 },
        66: { row: 1, col: 5 },
        65: { row: 1, col: 5 },
        64: { row: 1, col: 5 },
        63: { row: 1, col: 5 },
        62: { row: 1, col: 5 },
        61: { row: 1, col: 5 },
        60: { row: 1, col: 5 },
        59: { row: 1, col: 5 },
        58: { row: 1, col: 5 },
        57: { row: 1, col: 5 },
        56: { row: 1, col: 5 },
        55: { row: 1, col: 5 },
        54: { row: 1, col: 5 },
        53: { row: 1, col: 5 },
        52: { row: 1, col: 5 },
        51: { row: 1, col: 5 },
        50: { row: 1, col: 5 },
        49: { row: 1, col: 5 },
        48: { row: 1, col: 5 },
        47: { row: 1, col: 5 },
        46: { row: 1, col: 5 },
        45: { row: 1, col: 5 },
        44: { row: 1, col: 5 },
        43: { row: 1, col: 5 },
        42: { row: 1, col: 5 },
        41: { row: 1, col: 5 },
        40: { row: 1, col: 5 },
        39: { row: 1, col: 5 },
        38: { row: 1, col: 5 },
        37: { row: 1, col: 5 },
        36: { row: 1, col: 5 },
        35: { row: 1, col: 5 },
        34: { row: 1, col: 5 },
        33: { row: 1, col: 5 },
        32: { row: 1, col: 5 },
        31: { row: 1, col: 5 },
        30: { row: 1, col: 5 },
        29: { row: 1, col: 5 },
        28: { row: 1, col: 5 },
        27: { row: 1, col: 5 },
        26: { row: 1, col: 5 },
        25: { row: 1, col: 5 },
        24: { row: 1, col: 5 },
        23: { row: 1, col: 5 },
        22: { row: 1, col: 5 },
        21: { row: 1, col: 5 },
        20: { row: 1, col: 5 },
        19: { row: 1, col: 5 },
        18: { row: 1, col: 5 },
        17: { row: 1, col: 5 },
        16: { row: 1, col: 5 },
        15: { row: 1, col: 5 },
        14: { row: 1, col: 5 },
        13: { row: 1, col: 5 },
        12: { row: 1, col: 5 },
        11: { row: 1, col: 5 },
        10: { row: 1, col: 5 },
        9: { row: 1, col: 5 },
        8: { row: 1, col: 5 },
        7: { row: 1, col: 5 },
        6: { row: 1, col: 5 },
        5: { row: 1, col: 5 },
        4: { row: 1, col: 5 },
        3: { row: 1, col: 5 },
        2: { row: 1, col: 5 },
        1: { row: 1, col: 5 }
    };

    // Загружаем сохраненный ID локации или используем 250 по умолчанию
    let currentLocationId = GM_getValue('currentLocationId', 250);
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
            if (currentLocationId < 250) {
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
