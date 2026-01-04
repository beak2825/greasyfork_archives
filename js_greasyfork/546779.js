// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛБ) с управлением и автопереключением - От ВВ до Деревни
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций и автопереключением по клику
// @author       MyName
// @match        https://catwar.net/cw3/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546779/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%91%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546779/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%91%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.meta.js
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

    // База данных всех локаций (ID => {row, col}) из таблицы ЛБ.xlsx
    const highlightRules = {
        300: { row: 1, col: 5 },
        299: { row: 5, col: 9 },
        298: { row: 6, col: 6 },
        297: { row: 2, col: 7 },
        296: { row: 5, col: 5 },
        295: { row: 2, col: 8 },
        294: { row: 5, col: 3 },
        293: { row: 3, col: 7 },
        292: { row: 1, col: 5 },
        291: { row: 5, col: 1 },
        290: { row: 2, col: 9 },
        289: { row: 4, col: 2 },
        288: { row: 4, col: 2 },
        287: { row: 4, col: 5 },
        286: { row: 3, col: 6 },
        285: { row: 2, col: 9 },
        284: { row: 5, col: 3 },
        283: { row: 1, col: 1 },
        282: { row: 5, col: 4 },
        281: { row: 3, col: 1 },
        280: { row: 1, col: 1 },
        279: { row: 6, col: 1 },
        278: { row: 5, col: 6 },
        277: { row: 2, col: 2 },
        276: { row: 3, col: 2 },
        275: { row: 3, col: 9 },
        274: { row: 5, col: 1 },
        273: { row: 2, col: 1 },
        272: { row: 4, col: 3 },
        271: { row: 5, col: 2 },
        270: { row: 4, col: 5 },
        269: { row: 3, col: 9 },
        268: { row: 2, col: 5 },
        267: { row: 1, col: 9 },
        266: { row: 3, col: 1 },
        265: { row: 1, col: 1 },
        264: { row: 6, col: 5 },
        263: { row: 6, col: 1 },
        262: { row: 6, col: 8 },
        261: { row: 6, col: 9 },
        260: { row: 4, col: 8 },
        259: { row: 5, col: 5 },
        258: { row: 4, col: 8 },
        257: { row: 6, col: 5 },
        256: { row: 5, col: 8 },
        255: { row: 3, col: 8 },
        254: { row: 3, col: 5 },
        253: { row: 2, col: 4 },
        252: { row: 4, col: 9 },
        251: { row: 4, col: 9 },
        250: { row: 3, col: 5 },
        249: { row: 1, col: 7 },
        248: { row: 3, col: 3 },
        247: { row: 2, col: 3 },
        246: { row: 1, col: 6 },
        245: { row: 6, col: 2 },
        244: { row: 5, col: 8 },
        243: { row: 1, col: 4 },
        242: { row: 6, col: 5 },
        241: { row: 3, col: 9 },
        240: { row: 1, col: 7 },
        239: { row: 5, col: 9 },
        238: { row: 3, col: 6 },
        237: { row: 2, col: 5 },
        236: { row: 1, col: 5 },
        235: { row: 3, col: 6 },
        234: { row: 3, col: 9 },
        233: { row: 2, col: 3 },
        232: { row: 2, col: 1 },
        231: { row: 5, col: 2 },
        230: { row: 3, col: 4 },
        229: { row: 5, col: 5 },
        228: { row: 3, col: 4 },
        227: { row: 2, col: 6 },
        226: { row: 5, col: 4 },
        225: { row: 4, col: 6 },
        224: { row: 2, col: 8 },
        223: { row: 4, col: 4 },
        222: { row: 6, col: 8 },
        221: { row: 4, col: 2 },
        220: { row: 2, col: 8 },
        219: { row: 6, col: 6 },
        218: { row: 2, col: 5 },
        217: { row: 1, col: 2 },
        216: { row: 1, col: 1 },
        215: { row: 2, col: 3 },
        214: { row: 2, col: 4 },
        213: { row: 5, col: 1 },
        212: { row: 2, col: 7 },
        211: { row: 3, col: 4 },
        210: { row: 6, col: 8 },
        209: { row: 3, col: 5 },
        208: { row: 3, col: 1 },
        207: { row: 3, col: 4 },
        206: { row: 1, col: 5 },
        205: { row: 1, col: 4 },
        204: { row: 4, col: 8 },
        203: { row: 6, col: 7 },
        202: { row: 2, col: 8 },
        201: { row: 5, col: 2 },
        200: { row: 5, col: 9 },
        199: { row: 6, col: 2 },
        198: { row: 1, col: 6 },
        197: { row: 6, col: 6 },
        196: { row: 1, col: 4 },
        195: { row: 1, col: 2 },
        194: { row: 2, col: 4 },
        193: { row: 3, col: 1 },
        192: { row: 2, col: 3 },
        191: { row: 5, col: 6 },
        190: { row: 1, col: 7 },
        189: { row: 1, col: 2 },
        188: { row: 2, col: 6 },
        187: { row: 5, col: 5 },
        186: { row: 6, col: 1 },
        185: { row: 3, col: 1 },
        184: { row: 1, col: 8 },
        183: { row: 2, col: 6 },
        182: { row: 2, col: 2 },
        181: { row: 2, col: 3 },
        180: { row: 4, col: 1 },
        179: { row: 6, col: 6 },
        178: { row: 5, col: 1 },
        177: { row: 2, col: 1 },
        176: { row: 1, col: 7 },
        175: { row: 3, col: 1 },
        174: { row: 3, col: 9 },
        173: { row: 1, col: 4 },
        172: { row: 1, col: 7 },
        171: { row: 3, col: 7 },
        170: { row: 2, col: 3 },
        169: { row: 6, col: 4 },
        168: { row: 4, col: 6 },
        167: { row: 5, col: 7 },
        166: { row: 1, col: 5 },
        165: { row: 1, col: 8 },
        164: { row: 5, col: 4 },
        163: { row: 2, col: 5 },
        162: { row: 4, col: 7 },
        161: { row: 5, col: 1 },
        160: { row: 6, col: 2 },
        159: { row: 5, col: 4 },
        158: { row: 3, col: 9 },
        157: { row: 3, col: 2 },
        156: { row: 2, col: 8 },
        155: { row: 4, col: 2 },
        154: { row: 3, col: 3 },
        153: { row: 2, col: 9 },
        152: { row: 5, col: 3 },
        151: { row: 6, col: 1 },
        150: { row: 2, col: 6 },
        149: { row: 2, col: 4 },
        148: { row: 5, col: 3 },
        147: { row: 6, col: 2 },
        146: { row: 2, col: 8 },
        145: { row: 2, col: 1 },
        144: { row: 3, col: 2 },
        143: { row: 4, col: 4 },
        142: { row: 1, col: 4 },
        141: { row: 1, col: 4 },
        140: { row: 5, col: 3 },
        139: { row: 5, col: 2 },
        138: { row: 6, col: 9 },
        137: { row: 6, col: 8 },
        136: { row: 3, col: 4 },
        135: { row: 6, col: 2 },
        134: { row: 6, col: 3 },
        133: { row: 3, col: 2 },
        132: { row: 1, col: 8 },
        131: { row: 6, col: 7 },
        130: { row: 6, col: 1 },
        129: { row: 5, col: 7 },
        128: { row: 1, col: 7 },
        127: { row: 1, col: 2 },
        126: { row: 4, col: 7 },
        125: { row: 6, col: 1 },
        124: { row: 1, col: 8 },
        123: { row: 4, col: 3 },
        122: { row: 2, col: 2 },
        121: { row: 6, col: 7 },
        120: { row: 5, col: 5 },
        119: { row: 1, col: 3 },
        118: { row: 1, col: 7 },
        117: { row: 6, col: 2 },
        116: { row: 4, col: 2 },
        115: { row: 4, col: 7 },
        114: { row: 4, col: 5 },
        113: { row: 1, col: 7 },
        112: { row: 5, col: 9 },
        111: { row: 4, col: 4 },
        110: { row: 6, col: 2 },
        109: { row: 4, col: 7 },
        108: { row: 1, col: 4 },
        107: { row: 6, col: 1 },
        106: { row: 5, col: 4 },
        105: { row: 2, col: 1 },
        104: { row: 5, col: 9 },
        103: { row: 3, col: 9 },
        102: { row: 1, col: 6 },
        101: { row: 5, col: 2 },
        100: { row: 5, col: 4 },
        99: { row: 5, col: 6 },
        98: { row: 6, col: 1 },
        97: { row: 1, col: 5 },
        96: { row: 3, col: 2 },
        95: { row: 4, col: 8 },
        94: { row: 6, col: 5 },
        93: { row: 4, col: 1 },
        92: { row: 5, col: 4 },
        91: { row: 6, col: 8 },
        90: { row: 2, col: 7 },
        89: { row: 4, col: 3 },
        88: { row: 2, col: 6 },
        87: { row: 6, col: 2 },
        86: { row: 1, col: 5 },
        85: { row: 6, col: 2 },
        84: { row: 6, col: 1 },
        83: { row: 3, col: 5 },
        82: { row: 3, col: 5 },
        81: { row: 6, col: 5 },
        80: { row: 2, col: 8 },
        79: { row: 2, col: 2 },
        78: { row: 4, col: 6 },
        77: { row: 3, col: 5 },
        76: { row: 3, col: 8 },
        75: { row: 5, col: 7 },
        74: { row: 6, col: 8 },
        73: { row: 2, col: 2 },
        72: { row: 3, col: 1 },
        71: { row: 6, col: 3 },
        70: { row: 5, col: 9 },
        69: { row: 6, col: 7 },
        68: { row: 1, col: 9 },
        67: { row: 5, col: 2 },
        66: { row: 3, col: 5 },
        65: { row: 5, col: 5 },
        64: { row: 3, col: 8 },
        63: { row: 4, col: 2 },
        62: { row: 2, col: 9 },
        61: { row: 4, col: 4 },
        60: { row: 5, col: 6 },
        59: { row: 3, col: 6 },
        58: { row: 1, col: 3 },
        57: { row: 3, col: 3 },
        56: { row: 1, col: 1 },
        55: { row: 2, col: 9 },
        54: { row: 1, col: 3 },
        53: { row: 5, col: 5 },
        52: { row: 6, col: 4 },
        51: { row: 4, col: 8 },
        50: { row: 2, col: 8 },
        49: { row: 6, col: 1 },
        48: { row: 1, col: 1 },
        47: { row: 4, col: 8 },
        46: { row: 1, col: 6 },
        45: { row: 1, col: 8 },
        44: { row: 1, col: 6 },
        43: { row: 5, col: 2 },
        42: { row: 3, col: 4 },
        41: { row: 5, col: 9 },
        40: { row: 2, col: 7 },
        39: { row: 5, col: 1 },
        38: { row: 5, col: 2 },
        37: { row: 1, col: 8 },
        36: { row: 3, col: 5 },
        35: { row: 6, col: 7 },
        34: { row: 3, col: 2 },
        33: { row: 6, col: 6 },
        32: { row: 5, col: 1 },
        31: { row: 3, col: 6 },
        30: { row: 3, col: 1 },
        29: { row: 6, col: 1 },
        28: { row: 3, col: 1 },
        27: { row: 2, col: 1 },
        26: { row: 3, col: 1 },
        25: { row: 3, col: 3 },
        24: { row: 5, col: 6 },
        23: { row: 2, col: 1 },
        22: { row: 3, col: 6 },
        21: { row: 1, col: 6 },
        20: { row: 2, col: 3 },
        19: { row: 6, col: 3 },
        18: { row: 6, col: 9 },
        17: { row: 5, col: 1 },
        16: { row: 5, col: 4 },
        15: { row: 4, col: 6 },
        14: { row: 3, col: 9 },
        13: { row: 6, col: 3 },
        12: { row: 4, col: 4 },
        11: { row: 5, col: 2 },
        10: { row: 1, col: 6 },
        9: { row: 3, col: 5 },
        8: { row: 3, col: 7 },
        7: { row: 1, col: 9 },
        6: { row: 2, col: 2 },
        5: { row: 3, col: 8 },
        4: { row: 2, col: 1 },
        3: { row: 2, col: 7 },
        2: { row: 5, col: 5 },
        1: { row: 3, col: 8 }
    };

    // Загружаем сохраненный ID локации или используем 300 по умолчанию
    let currentLocationId = GM_getValue('currentLocationId', 300);
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
            if (currentLocationId < 300) {
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
