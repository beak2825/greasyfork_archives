// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛЗ) с управлением, автопереключением и таймером
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций, автопереключением по клику и таймером
// @author       MyName
// @match        https://catwar.net/cw3/*
// @match        https://catwar.net/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/547239/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%97%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/547239/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%97%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%D0%BE%D0%BC.meta.js
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
            min-width: 200px;
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
        .cw-input-container {
            margin-top: 10px;
        }
        .cw-input-container input {
            width: 60px;
            padding: 5px;
            margin-right: 5px;
        }
        .cw-input-container button {
            padding: 5px 10px;
        }
        .cw-timer-container {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
        .cw-timer-display {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .cw-timer-setup {
            margin-top: 10px;
        }
    `);

    // База данных всех локаций (ID => {row, col}) из таблицы ЛЗ.xlsx
    const highlightRules = {
        489: { row: 3, col: 3 },
        488: { row: 4, col: 9 },
        487: { row: 3, col: 2 },
        486: { row: 4, col: 7 },
        485: { row: 4, col: 2 },
        484: { row: 5, col: 6 },
        483: { row: 5, col: 8 },
        482: { row: 5, col: 1 },
        481: { row: 5, col: 1 },
        480: { row: 1, col: 9 },
        479: { row: 2, col: 5 },
        478: { row: 2, col: 2 },
        477: { row: 2, col: 2 },
        476: { row: 1, col: 4 },
        475: { row: 4, col: 1 },
        474: { row: 1, col: 1 },
        473: { row: 2, col: 5 },
        472: { row: 3, col: 6 },
        471: { row: 1, col: 6 },
        470: { row: 6, col: 1 },
        469: { row: 6, col: 1 },
        468: { row: 4, col: 2 },
        467: { row: 4, col: 6 },
        466: { row: 5, col: 2 },
        465: { row: 6, col: 2 },
        464: { row: 3, col: 7 },
        463: { row: 2, col: 5 },
        462: { row: 3, col: 8 },
        461: { row: 2, col: 1 },
        460: { row: 1, col: 8 },
        459: { row: 4, col: 2 },
        458: { row: 2, col: 1 },
        457: { row: 3, col: 6 },
        456: { row: 4, col: 7 },
        455: { row: 5, col: 8 },
        454: { row: 5, col: 2 },
        453: { row: 5, col: 4 },
        452: { row: 1, col: 5 },
        451: { row: 4, col: 7 },
        450: { row: 5, col: 3 },
        449: { row: 4, col: 8 },
        448: { row: 4, col: 6 },
        447: { row: 5, col: 2 },
        446: { row: 5, col: 6 },
        445: { row: 3, col: 2 },
        444: { row: 2, col: 5 },
        443: { row: 6, col: 5 },
        442: { row: 1, col: 4 },
        441: { row: 4, col: 9 },
        440: { row: 6, col: 3 },
        439: { row: 3, col: 3 },
        438: { row: 4, col: 7 },
        437: { row: 4, col: 1 },
        436: { row: 2, col: 4 },
        435: { row: 6, col: 6 },
        434: { row: 1, col: 1 },
        433: { row: 6, col: 8 },
        432: { row: 6, col: 7 },
        431: { row: 4, col: 9 },
        430: { row: 6, col: 1 },
        429: { row: 4, col: 2 },
        428: { row: 5, col: 2 },
        427: { row: 5, col: 4 },
        426: { row: 5, col: 1 },
        425: { row: 5, col: 5 },
        424: { row: 5, col: 9 },
        423: { row: 5, col: 6 },
        422: { row: 3, col: 1 },
        421: { row: 6, col: 9 },
        420: { row: 5, col: 7 },
        419: { row: 4, col: 4 },
        418: { row: 2, col: 7 },
        417: { row: 2, col: 9 },
        416: { row: 1, col: 1 },
        415: { row: 1, col: 9 },
        414: { row: 2, col: 8 },
        413: { row: 4, col: 5 },
        412: { row: 5, col: 2 },
        411: { row: 3, col: 9 },
        410: { row: 1, col: 5 },
        409: { row: 3, col: 6 },
        408: { row: 1, col: 1 },
        407: { row: 1, col: 3 },
        406: { row: 2, col: 6 },
        405: { row: 1, col: 3 },
        404: { row: 2, col: 6 },
        403: { row: 6, col: 7 },
        402: { row: 2, col: 7 },
        401: { row: 3, col: 4 },
        400: { row: 3, col: 2 },
        399: { row: 4, col: 2 },
        398: { row: 4, col: 2 },
        397: { row: 2, col: 4 },
        396: { row: 3, col: 9 },
        395: { row: 1, col: 1 },
        394: { row: 2, col: 6 },
        393: { row: 2, col: 7 },
        392: { row: 4, col: 8 },
        391: { row: 3, col: 1 },
        390: { row: 4, col: 8 },
        389: { row: 6, col: 2 },
        388: { row: 4, col: 6 },
        387: { row: 4, col: 7 },
        386: { row: 4, col: 3 },
        385: { row: 6, col: 5 },
        384: { row: 1, col: 1 },
        383: { row: 1, col: 4 },
        382: { row: 5, col: 1 },
        381: { row: 2, col: 2 },
        380: { row: 5, col: 2 },
        379: { row: 3, col: 2 },
        378: { row: 2, col: 5 },
        377: { row: 2, col: 7 },
        376: { row: 2, col: 5 },
        375: { row: 3, col: 9 },
        374: { row: 2, col: 2 },
        373: { row: 5, col: 8 },
        372: { row: 2, col: 5 },
        371: { row: 2, col: 4 },
        370: { row: 6, col: 1 },
        369: { row: 3, col: 6 },
        368: { row: 1, col: 9 },
        367: { row: 1, col: 4 },
        366: { row: 2, col: 8 },
        365: { row: 6, col: 7 },
        364: { row: 1, col: 6 },
        363: { row: 3, col: 4 },
        362: { row: 3, col: 7 },
        361: { row: 6, col: 6 },
        360: { row: 2, col: 1 },
        359: { row: 2, col: 8 },
        358: { row: 1, col: 3 },
        357: { row: 5, col: 2 },
        356: { row: 6, col: 7 },
        355: { row: 2, col: 8 },
        354: { row: 4, col: 3 },
        353: { row: 1, col: 3 },
        352: { row: 6, col: 2 },
        351: { row: 1, col: 1 },
        350: { row: 4, col: 4 },
        349: { row: 2, col: 8 },
        348: { row: 2, col: 3 },
        347: { row: 4, col: 2 },
        346: { row: 5, col: 7 },
        345: { row: 1, col: 2 },
        344: { row: 4, col: 1 },
        343: { row: 5, col: 2 },
        342: { row: 3, col: 8 },
        341: { row: 5, col: 6 },
        340: { row: 1, col: 2 },
        339: { row: 5, col: 4 },
        338: { row: 3, col: 7 },
        337: { row: 3, col: 1 },
        336: { row: 3, col: 3 },
        335: { row: 4, col: 2 },
        334: { row: 6, col: 7 },
        333: { row: 5, col: 8 },
        332: { row: 5, col: 2 },
        331: { row: 6, col: 4 },
        330: { row: 2, col: 7 },
        329: { row: 6, col: 7 },
        328: { row: 6, col: 9 },
        327: { row: 4, col: 2 },
        326: { row: 2, col: 6 },
        325: { row: 4, col: 6 },
        324: { row: 1, col: 9 },
        323: { row: 1, col: 5 },
        322: { row: 5, col: 4 },
        321: { row: 1, col: 2 },
        320: { row: 5, col: 2 },
        319: { row: 2, col: 5 },
        318: { row: 1, col: 9 },
        317: { row: 5, col: 6 },
        316: { row: 2, col: 7 },
        315: { row: 2, col: 4 },
        314: { row: 1, col: 1 },
        313: { row: 2, col: 1 },
        312: { row: 3, col: 8 },
        311: { row: 1, col: 1 },
        310: { row: 1, col: 5 },
        309: { row: 2, col: 7 },
        308: { row: 2, col: 5 },
        307: { row: 4, col: 3 },
        306: { row: 6, col: 1 },
        305: { row: 5, col: 2 },
        304: { row: 2, col: 7 },
        303: { row: 2, col: 4 },
        302: { row: 6, col: 5 },
        301: { row: 2, col: 4 },
        300: { row: 4, col: 1 },
        299: { row: 1, col: 7 },
        298: { row: 2, col: 1 },
        297: { row: 3, col: 2 },
        296: { row: 3, col: 4 },
        295: { row: 4, col: 5 },
        294: { row: 6, col: 3 },
        293: { row: 3, col: 2 },
        292: { row: 6, col: 4 },
        291: { row: 2, col: 2 },
        290: { row: 2, col: 6 },
        289: { row: 5, col: 3 },
        288: { row: 4, col: 7 },
        287: { row: 1, col: 1 },
        286: { row: 5, col: 2 },
        285: { row: 5, col: 2 },
        284: { row: 6, col: 8 },
        283: { row: 3, col: 4 },
        282: { row: 2, col: 4 },
        281: { row: 3, col: 2 },
        280: { row: 1, col: 2 },
        279: { row: 6, col: 2 },
        278: { row: 2, col: 4 },
        277: { row: 5, col: 1 },
        276: { row: 3, col: 5 },
        275: { row: 6, col: 9 },
        274: { row: 1, col: 2 },
        273: { row: 3, col: 7 },
        272: { row: 1, col: 6 },
        271: { row: 1, col: 9 },
        270: { row: 1, col: 2 },
        269: { row: 5, col: 1 },
        268: { row: 3, col: 5 },
        267: { row: 1, col: 2 },
        266: { row: 2, col: 9 },
        265: { row: 2, col: 9 },
        264: { row: 2, col: 2 },
        263: { row: 1, col: 6 },
        262: { row: 3, col: 6 },
        261: { row: 6, col: 6 },
        260: { row: 2, col: 9 },
        259: { row: 3, col: 3 },
        258: { row: 3, col: 6 },
        257: { row: 1, col: 2 },
        256: { row: 1, col: 4 },
        255: { row: 3, col: 3 },
        254: { row: 2, col: 2 },
        253: { row: 1, col: 7 },
        252: { row: 5, col: 9 },
        251: { row: 6, col: 1 },
        250: { row: 5, col: 4 },
        249: { row: 2, col: 9 },
        248: { row: 3, col: 2 },
        247: { row: 1, col: 8 },
        246: { row: 5, col: 1 },
        245: { row: 2, col: 4 },
        244: { row: 2, col: 3 },
        243: { row: 2, col: 7 },
        242: { row: 4, col: 5 },
        241: { row: 2, col: 1 },
        240: { row: 3, col: 4 },
        239: { row: 2, col: 7 },
        238: { row: 2, col: 7 },
        237: { row: 4, col: 6 },
        236: { row: 2, col: 8 },
        235: { row: 5, col: 3 },
        234: { row: 5, col: 8 },
        233: { row: 4, col: 9 },
        232: { row: 2, col: 3 },
        231: { row: 1, col: 9 },
        230: { row: 6, col: 8 },
        229: { row: 3, col: 3 },
        228: { row: 4, col: 3 },
        227: { row: 2, col: 9 },
        226: { row: 1, col: 9 },
        225: { row: 4, col: 7 },
        224: { row: 5, col: 6 },
        223: { row: 5, col: 1 },
        222: { row: 4, col: 2 },
        221: { row: 6, col: 3 },
        220: { row: 2, col: 5 },
        219: { row: 5, col: 2 },
        218: { row: 2, col: 7 },
        217: { row: 1, col: 2 },
        216: { row: 1, col: 9 },
        215: { row: 5, col: 2 },
        214: { row: 3, col: 5 },
        213: { row: 5, col: 4 },
        212: { row: 2, col: 2 },
        211: { row: 2, col: 7 },
        210: { row: 3, col: 8 },
        209: { row: 1, col: 3 },
        208: { row: 1, col: 8 },
        207: { row: 4, col: 4 },
        206: { row: 5, col: 9 },
        205: { row: 2, col: 1 },
        204: { row: 3, col: 2 },
        203: { row: 3, col: 6 },
        202: { row: 1, col: 4 },
        201: { row: 5, col: 3 },
        200: { row: 1, col: 7 },
        199: { row: 4, col: 2 },
        198: { row: 2, col: 4 },
        197: { row: 2, col: 3 },
        196: { row: 6, col: 3 },
        195: { row: 4, col: 4 },
        194: { row: 6, col: 5 },
        193: { row: 3, col: 8 },
        192: { row: 2, col: 1 },
        191: { row: 1, col: 1 },
        190: { row: 2, col: 4 },
        189: { row: 1, col: 7 },
        188: { row: 1, col: 3 },
        187: { row: 2, col: 1 },
        186: { row: 1, col: 9 },
        185: { row: 2, col: 1 },
        184: { row: 1, col: 1 },
        183: { row: 1, col: 5 },
        182: { row: 1, col: 4 },
        181: { row: 2, col: 5 },
        180: { row: 5, col: 9 },
        179: { row: 4, col: 9 },
        178: { row: 3, col: 1 },
        177: { row: 3, col: 6 },
        176: { row: 3, col: 1 },
        175: { row: 2, col: 9 },
        174: { row: 6, col: 8 },
        173: { row: 1, col: 3 },
        172: { row: 1, col: 3 },
        171: { row: 1, col: 6 },
        170: { row: 3, col: 5 },
        169: { row: 5, col: 4 },
        168: { row: 5, col: 3 },
        167: { row: 2, col: 4 },
        166: { row: 2, col: 3 },
        165: { row: 6, col: 8 },
        164: { row: 3, col: 2 },
        163: { row: 4, col: 3 },
        162: { row: 6, col: 6 },
        161: { row: 5, col: 7 },
        160: { row: 3, col: 4 },
        159: { row: 2, col: 2 },
        158: { row: 1, col: 9 },
        157: { row: 3, col: 2 },
        156: { row: 1, col: 8 },
        155: { row: 1, col: 7 },
        154: { row: 5, col: 1 },
        153: { row: 2, col: 4 },
        152: { row: 5, col: 5 },
        151: { row: 3, col: 6 },
        150: { row: 2, col: 7 },
        149: { row: 3, col: 1 },
        148: { row: 1, col: 7 },
        147: { row: 1, col: 8 },
        146: { row: 5, col: 3 },
        145: { row: 6, col: 4 },
        144: { row: 1, col: 8 },
        143: { row: 2, col: 8 },
        142: { row: 4, col: 7 },
        141: { row: 1, col: 3 },
        140: { row: 4, col: 2 },
        139: { row: 3, col: 6 },
        138: { row: 5, col: 4 },
        137: { row: 6, col: 4 },
        136: { row: 1, col: 5 },
        135: { row: 5, col: 3 },
        134: { row: 3, col: 7 },
        133: { row: 1, col: 5 },
        132: { row: 6, col: 9 },
        131: { row: 2, col: 8 },
        130: { row: 5, col: 5 },
        129: { row: 6, col: 6 },
        128: { row: 3, col: 4 },
        127: { row: 1, col: 5 },
        126: { row: 5, col: 2 },
        125: { row: 6, col: 6 },
        124: { row: 1, col: 9 },
        123: { row: 2, col: 5 },
        122: { row: 1, col: 7 },
        121: { row: 3, col: 6 },
        120: { row: 6, col: 3 },
        119: { row: 4, col: 1 },
        118: { row: 1, col: 5 },
        117: { row: 6, col: 2 },
        116: { row: 3, col: 9 },
        115: { row: 4, col: 2 },
        114: { row: 5, col: 9 },
        113: { row: 3, col: 1 },
        112: { row: 5, col: 4 },
        111: { row: 3, col: 2 },
        110: { row: 6, col: 3 },
        109: { row: 4, col: 7 },
        108: { row: 2, col: 7 },
        107: { row: 3, col: 3 },
        106: { row: 4, col: 5 },
        105: { row: 3, col: 1 },
        104: { row: 4, col: 3 },
        103: { row: 6, col: 3 },
        102: { row: 6, col: 4 },
        101: { row: 3, col: 8 },
        100: { row: 4, col: 3 },
        99: { row: 2, col: 1 },
        98: { row: 2, col: 3 },
        97: { row: 6, col: 7 },
        96: { row: 5, col: 9 },
        95: { row: 3, col: 5 },
        94: { row: 2, col: 6 },
        93: { row: 4, col: 2 },
        92: { row: 4, col: 8 },
        91: { row: 6, col: 9 },
        90: { row: 3, col: 2 },
        89: { row: 6, col: 9 },
        88: { row: 4, col: 3 },
        87: { row: 3, col: 2 },
        86: { row: 1, col: 1 },
        85: { row: 3, col: 5 },
        84: { row: 6, col: 1 },
        83: { row: 5, col: 9 },
        82: { row: 1, col: 9 },
        81: { row: 1, col: 8 },
        80: { row: 3, col: 3 },
        79: { row: 3, col: 3 },
        78: { row: 1, col: 7 },
        77: { row: 1, col: 3 },
        76: { row: 1, col: 8 },
        75: { row: 6, col: 4 },
        74: { row: 6, col: 1 },
        73: { row: 6, col: 7 },
        72: { row: 6, col: 2 },
        71: { row: 5, col: 8 },
        70: { row: 5, col: 4 },
        69: { row: 4, col: 3 },
        68: { row: 5, col: 1 },
        67: { row: 5, col: 7 },
        66: { row: 5, col: 7 },
        65: { row: 5, col: 1 },
        64: { row: 6, col: 2 },
        63: { row: 6, col: 8 },
        62: { row: 1, col: 3 },
        61: { row: 3, col: 5 },
        60: { row: 5, col: 4 },
        59: { row: 2, col: 3 },
        58: { row: 1, col: 3 },
        57: { row: 2, col: 5 },
        56: { row: 5, col: 4 },
        55: { row: 3, col: 4 },
        54: { row: 6, col: 4 },
        53: { row: 2, col: 5 },
        52: { row: 2, col: 4 },
        51: { row: 1, col: 1 },
        50: { row: 1, col: 2 },
        49: { row: 6, col: 2 },
        48: { row: 2, col: 8 },
        47: { row: 2, col: 3 },
        46: { row: 5, col: 8 },
        45: { row: 1, col: 3 },
        44: { row: 1, col: 6 },
        43: { row: 3, col: 4 },
        42: { row: 4, col: 8 },
        41: { row: 2, col: 2 },
        40: { row: 3, col: 8 },
        39: { row: 4, col: 9 },
        38: { row: 3, col: 5 },
        37: { row: 1, col: 2 },
        36: { row: 3, col: 7 },
        35: { row: 3, col: 7 },
        34: { row: 6, col: 6 },
        33: { row: 2, col: 4 },
        32: { row: 4, col: 1 },
        31: { row: 2, col: 6 },
        30: { row: 3, col: 6 },
        29: { row: 4, col: 6 },
        28: { row: 5, col: 5 },
        27: { row: 3, col: 6 },
        26: { row: 2, col: 2 },
        25: { row: 4, col: 4 },
        24: { row: 5, col: 8 },
        23: { row: 2, col: 4 },
        22: { row: 2, col: 3 },
        21: { row: 4, col: 5 },
        20: { row: 6, col: 4 },
        19: { row: 1, col: 1 },
        18: { row: 6, col: 5 },
        17: { row: 6, col: 4 },
        16: { row: 2, col: 2 },
        15: { row: 6, col: 8 },
        14: { row: 6, col: 9 },
        13: { row: 4, col: 8 },
        12: { row: 6, col: 6 },
        11: { row: 2, col: 5 },
        10: { row: 4, col: 4 },
        9: { row: 2, col: 3 },
        8: { row: 2, col: 8 },
        7: { row: 1, col: 8 },
        6: { row: 4, col: 3 },
        5: { row: 4, col: 5 },
        4: { row: 2, col: 4 },
        3: { row: 6, col: 6 },
        2: { row: 3, col: 3 },
        1: { row: 6, col: 1 }
    };

    // Загружаем сохраненный ID локации или используем 489 по умолчанию
    let currentLocationId = GM_getValue('currentLocationId', 489);
    let highlightedCell = null;
    
    // Переменные для таймера
    let timerInterval = null;
    let timerEndTime = GM_getValue('timerEndTime', 0);
    let timerRunning = GM_getValue('timerRunning', false);
    let timerSeconds = GM_getValue('timerSeconds', 0);
    let notificationShown = false;

    // Создаем интерфейс управления
    function createUI() {
        const ui = document.createElement('div');
        ui.className = 'cw-highlight-ui';
        ui.innerHTML = `
            <button id="cw-prev">←</button>
            <span id="cw-location-id">ID: ${currentLocationId}</span>
            <button id="cw-next">→</button>
            <div class="cw-input-container">
                <input type="number" id="cw-location-input" min="1" max="489" placeholder="ID локации">
                <button id="cw-go">Перейти</button>
            </div>
            <div class="cw-timer-container">
                <div class="cw-timer-display" id="cw-timer-display">${timerSeconds}</div>
                <div class="cw-timer-setup">
                    <input type="number" id="cw-timer-input" min="1" placeholder="Секунды">
                    <button id="cw-timer-set">Установить</button>
                </div>
            </div>
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
            if (currentLocationId < 489) {
                currentLocationId++;
                saveAndUpdate();
                highlightCurrentCell();
            }
        });

        // Обработчик кнопки перехода
        document.getElementById('cw-go').addEventListener('click', () => {
            const input = document.getElementById('cw-location-input');
            const newId = parseInt(input.value);

            if (!isNaN(newId) && newId >= 1 && newId <= 489) {
                currentLocationId = newId;
                saveAndUpdate();
                highlightCurrentCell();
                input.value = ''; // Очищаем поле ввода
            } else {
                alert('Пожалуйста, введите число от 1 до 489');
            }
        });

        // Обработчик нажатия Enter в поле ввода
        document.getElementById('cw-location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('cw-go').click();
            }
        });

        // Обработчики таймера
        document.getElementById('cw-timer-set').addEventListener('click', setTimer);
        
        // Обработчик нажатия Enter в поле таймера
        document.getElementById('cw-timer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('cw-timer-set').click();
            }
        });

        // Инициализация таймера
        initTimer();
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
            // Если это не игровая страница, просто выходим
            return;
        }

        try {
            const targetCell = table.rows[rule.row - 1].cells[rule.col - 1];
            targetCell.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            targetCell.style.boxShadow = '0 0 10px 5px yellow';
            targetCell.classList.add('highlighted-cell');

            // Сохраняем ссылку на подсвеченную ячейку
            highlightedCell = targetCell;

            // Добавляем обработчик клика - теперь он запускает таймер!
            highlightedCell.addEventListener('click', handleCellClick);

            console.log(`Подсвечена клетка для локации ID ${currentLocationId}: строка ${rule.row}, столбец ${rule.col}`);
        } catch (e) {
            console.log(`Не удалось подсветить клетку для локации ${currentLocationId}`);
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

    // Обработчик клика по подсвеченной ячейке - теперь запускает таймер!
    function handleCellClick() {
        // Запускаем таймер при клике на выделенную область
        if (timerSeconds > 0 && !timerRunning) {
            startTimer();
        }
        
        // Старая логика переключения локаций
        if (currentLocationId > 1) {
            currentLocationId--;
            saveAndUpdate();
            highlightCurrentCell();
        } else {
            clearHighlight();
            alert('Вы достигли последней локации!');
        }
    }

    // Функции для работы с таймером
    function initTimer() {
        updateTimerDisplay();
        
        // Если таймер был запущен, продолжаем отсчет
        if (timerRunning && timerEndTime > Date.now()) {
            startTimerInterval();
        } else if (timerRunning) {
            // Таймер истек, но был запущен - сбрасываем
            resetTimerState();
        }
    }

    function startTimer() {
        if (timerSeconds <= 0) {
            return;
        }

        // Сбрасываем флаг уведомления
        notificationShown = false;
        
        // Устанавливаем время окончания
        timerEndTime = Date.now() + timerSeconds * 1000;
        timerRunning = true;
        
        // Сохраняем состояние
        GM_setValue('timerEndTime', timerEndTime);
        GM_setValue('timerRunning', timerRunning);
        
        // Запускаем интервал обновления
        startTimerInterval();
    }

    function setTimer() {
        const input = document.getElementById('cw-timer-input');
        const seconds = parseInt(input.value);
        
        if (!isNaN(seconds) && seconds > 0) {
            timerSeconds = seconds;
            GM_setValue('timerSeconds', timerSeconds);
            input.value = '';
            updateTimerDisplay();
        } else {
            alert('Пожалуйста, введите корректное количество секунд');
        }
    }

    function startTimerInterval() {
        // Останавливаем предыдущий интервал, если он был
        clearInterval(timerInterval);
        
        // Запускаем новый интервал
        timerInterval = setInterval(updateTimerDisplay, 1000);
        updateTimerDisplay();
    }

    function resetTimerState() {
        // Останавливаем интервал
        clearInterval(timerInterval);
        timerInterval = null;
        
        // Сбрасываем состояние запуска
        timerRunning = false;
        GM_setValue('timerRunning', timerRunning);
        
        // Возвращаем отображение к установленному времени
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const display = document.getElementById('cw-timer-display');
        
        if (!timerRunning || timerEndTime <= Date.now()) {
            // Таймер не запущен или истек
            if (timerEndTime > 0 && timerEndTime <= Date.now()) {
                // Таймер только что истек
                if (!notificationShown) {
                    // Показываем уведомление только один раз
                    alert('Переход закончился!');
                    notificationShown = true;
                }
                
                // Возвращаемся к установленному времени
                display.textContent = timerSeconds.toString();
                display.style.color = '#333';
                
                // Сбрасываем состояние таймера
                resetTimerState();
            } else {
                // Таймер не активен - показываем установленное время
                display.textContent = timerSeconds.toString();
                display.style.color = '#333';
            }
            return;
        }
        
        // Вычисляем оставшееся время в секундах
        const remainingSeconds = Math.floor((timerEndTime - Date.now()) / 1000);
        
        // Обновляем отображение
        display.textContent = remainingSeconds.toString();
        
        // Меняем цвет на красный при остатке менее 10 секунд
        if (remainingSeconds <= 10) {
            display.style.color = 'red';
        } else {
            display.style.color = '#333';
        }
    }

    // Запускаем при загрузке страницы
    window.addEventListener('load', function() {
        createUI();
        
        // Пытаемся подсветить клетку только если это игровая страница
        if (window.location.href.includes('/cw3/')) {
            setTimeout(highlightCurrentCell, 1000);
        }
        
        // Обновляем таймер каждую секунду на всех страницах
        setInterval(updateTimerDisplay, 1000);
    });
})();
