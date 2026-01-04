// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛИ) с управлением и автопереключением
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Подсвечивает клетки на catwar.net/cw3/ согласно таблице ЛИ.xlsx
// @author       MyName
// @match        https://catwar.net/cw3/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546139/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%98%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/546139/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%98%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC.meta.js
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

    // База данных всех локаций из таблицы ЛИ.xlsx (ID => {row, col})
    const highlightRules = {
        549: { row: 6, col: 5 },
        548: { row: 5, col: 6 },
        547: { row: 4, col: 3 },
        546: { row: 3, col: 7 },
        545: { row: 4, col: 7 },
        544: { row: 5, col: 5 },
        543: { row: 4, col: 5 },
        542: { row: 1, col: 3 },
        541: { row: 6, col: 4 },
        540: { row: 1, col: 2 },
        539: { row: 5, col: 1 },
        538: { row: 6, col: 9 },
        537: { row: 3, col: 5 },
        536: { row: 5, col: 5 },
        535: { row: 2, col: 3 },
        534: { row: 5, col: 6 },
        533: { row: 3, col: 2 },
        532: { row: 5, col: 5 },
        531: { row: 4, col: 1 },
        530: { row: 2, col: 3 },
        529: { row: 5, col: 6 },
        528: { row: 3, col: 3 },
        527: { row: 2, col: 8 },
        526: { row: 5, col: 8 },
        525: { row: 4, col: 9 },
        524: { row: 2, col: 7 },
        523: { row: 6, col: 2 },
        522: { row: 6, col: 1 },
        521: { row: 6, col: 5 },
        520: { row: 4, col: 2 },
        519: { row: 5, col: 5 },
        518: { row: 2, col: 5 },
        517: { row: 2, col: 4 },
        516: { row: 2, col: 8 },
        515: { row: 6, col: 2 },
        514: { row: 5, col: 2 },
        513: { row: 3, col: 8 },
        512: { row: 3, col: 6 },
        511: { row: 2, col: 1 },
        510: { row: 2, col: 6 },
        509: { row: 1, col: 4 },
        508: { row: 1, col: 2 },
        507: { row: 1, col: 4 },
        506: { row: 1, col: 2 },
        505: { row: 1, col: 3 },
        504: { row: 6, col: 6 },
        503: { row: 6, col: 8 },
        502: { row: 3, col: 5 },
        501: { row: 6, col: 3 },
        500: { row: 3, col: 1 },
        499: { row: 2, col: 4 },
        498: { row: 6, col: 6 },
        497: { row: 6, col: 4 },
        496: { row: 1, col: 5 },
        495: { row: 1, col: 4 },
        494: { row: 3, col: 8 },
        493: { row: 6, col: 2 },
        492: { row: 5, col: 9 },
        491: { row: 2, col: 2 },
        490: { row: 1, col: 1 },
        489: { row: 4, col: 5 },
        488: { row: 1, col: 7 },
        487: { row: 5, col: 4 },
        486: { row: 6, col: 1 },
        485: { row: 5, col: 9 },
        484: { row: 5, col: 1 },
        483: { row: 2, col: 6 },
        482: { row: 2, col: 4 },
        481: { row: 4, col: 9 },
        480: { row: 3, col: 8 },
        479: { row: 6, col: 8 },
        478: { row: 3, col: 2 },
        477: { row: 2, col: 4 },
        476: { row: 4, col: 1 },
        475: { row: 4, col: 1 },
        474: { row: 6, col: 3 },
        473: { row: 6, col: 5 },
        472: { row: 3, col: 6 },
        471: { row: 1, col: 9 },
        470: { row: 4, col: 7 },
        469: { row: 1, col: 3 },
        468: { row: 6, col: 2 },
        467: { row: 6, col: 8 },
        466: { row: 1, col: 1 },
        465: { row: 3, col: 7 },
        464: { row: 5, col: 9 },
        463: { row: 5, col: 8 },
        462: { row: 3, col: 2 },
        461: { row: 5, col: 1 },
        460: { row: 6, col: 3 },
        459: { row: 5, col: 3 },
        458: { row: 4, col: 4 },
        457: { row: 2, col: 1 },
        456: { row: 3, col: 2 },
        455: { row: 6, col: 9 },
        454: { row: 6, col: 4 },
        453: { row: 2, col: 4 },
        452: { row: 3, col: 1 },
        451: { row: 2, col: 7 },
        450: { row: 5, col: 7 },
        449: { row: 3, col: 3 },
        448: { row: 4, col: 5 },
        447: { row: 3, col: 9 },
        446: { row: 3, col: 4 },
        445: { row: 4, col: 3 },
        444: { row: 1, col: 7 },
        443: { row: 2, col: 6 },
        442: { row: 5, col: 5 },
        441: { row: 5, col: 7 },
        440: { row: 3, col: 8 },
        439: { row: 2, col: 9 },
        438: { row: 6, col: 1 },
        437: { row: 2, col: 8 },
        436: { row: 1, col: 1 },
        435: { row: 5, col: 1 },
        434: { row: 4, col: 2 },
        433: { row: 6, col: 9 },
        432: { row: 1, col: 6 },
        431: { row: 5, col: 6 },
        430: { row: 2, col: 3 },
        429: { row: 3, col: 7 },
        428: { row: 1, col: 6 },
        427: { row: 1, col: 3 },
        426: { row: 1, col: 8 },
        425: { row: 2, col: 5 },
        424: { row: 4, col: 4 },
        423: { row: 3, col: 1 },
        422: { row: 2, col: 4 },
        421: { row: 3, col: 2 },
        420: { row: 3, col: 9 },
        419: { row: 3, col: 6 },
        418: { row: 2, col: 8 },
        417: { row: 6, col: 4 },
        416: { row: 1, col: 3 },
        415: { row: 6, col: 4 },
        414: { row: 2, col: 5 },
        413: { row: 5, col: 4 },
        412: { row: 5, col: 8 },
        411: { row: 3, col: 9 },
        410: { row: 4, col: 7 },
        409: { row: 5, col: 7 },
        408: { row: 4, col: 4 },
        407: { row: 2, col: 3 },
        406: { row: 4, col: 6 },
        405: { row: 4, col: 4 },
        404: { row: 1, col: 4 },
        403: { row: 1, col: 7 },
        402: { row: 3, col: 5 },
        401: { row: 2, col: 2 },
        400: { row: 5, col: 4 },
        399: { row: 6, col: 2 },
        398: { row: 1, col: 7 },
        397: { row: 1, col: 4 },
        396: { row: 1, col: 1 },
        395: { row: 5, col: 4 },
        394: { row: 3, col: 8 },
        393: { row: 1, col: 4 },
        392: { row: 5, col: 8 },
        391: { row: 6, col: 1 },
        390: { row: 2, col: 1 },
        389: { row: 6, col: 4 },
        388: { row: 4, col: 2 },
        387: { row: 1, col: 5 },
        386: { row: 4, col: 8 },
        385: { row: 2, col: 1 },
        384: { row: 1, col: 5 },
        383: { row: 4, col: 2 },
        382: { row: 3, col: 7 },
        381: { row: 5, col: 3 },
        380: { row: 4, col: 2 },
        379: { row: 5, col: 1 },
        378: { row: 5, col: 9 },
        377: { row: 2, col: 2 },
        376: { row: 4, col: 3 },
        375: { row: 2, col: 5 },
        374: { row: 4, col: 3 },
        373: { row: 1, col: 2 },
        372: { row: 3, col: 2 },
        371: { row: 6, col: 9 },
        370: { row: 3, col: 2 },
        369: { row: 5, col: 9 },
        368: { row: 3, col: 2 },
        367: { row: 3, col: 5 },
        366: { row: 1, col: 8 },
        365: { row: 1, col: 5 },
        364: { row: 3, col: 1 },
        363: { row: 5, col: 6 },
        362: { row: 2, col: 4 },
        361: { row: 3, col: 6 },
        360: { row: 5, col: 7 },
        359: { row: 6, col: 5 },
        358: { row: 5, col: 5 },
        357: { row: 3, col: 5 },
        356: { row: 4, col: 7 },
        355: { row: 5, col: 7 },
        354: { row: 6, col: 8 },
        353: { row: 6, col: 8 },
        352: { row: 2, col: 2 },
        351: { row: 4, col: 7 },
        350: { row: 6, col: 4 },
        349: { row: 3, col: 5 },
        348: { row: 1, col: 7 },
        347: { row: 3, col: 9 },
        346: { row: 2, col: 8 },
        345: { row: 2, col: 9 },
        344: { row: 5, col: 8 },
        343: { row: 6, col: 1 },
        342: { row: 6, col: 7 },
        341: { row: 1, col: 6 },
        340: { row: 4, col: 4 },
        339: { row: 5, col: 4 },
        338: { row: 4, col: 5 },
        337: { row: 6, col: 1 },
        336: { row: 1, col: 1 },
        335: { row: 4, col: 4 },
        334: { row: 3, col: 6 },
        333: { row: 1, col: 7 },
        332: { row: 6, col: 8 },
        331: { row: 4, col: 3 },
        330: { row: 1, col: 6 },
        329: { row: 5, col: 8 },
        328: { row: 1, col: 4 },
        327: { row: 3, col: 9 },
        326: { row: 1, col: 2 },
        325: { row: 2, col: 9 },
        324: { row: 3, col: 6 },
        323: { row: 3, col: 6 },
        322: { row: 5, col: 7 },
        321: { row: 1, col: 6 },
        320: { row: 4, col: 8 },
        319: { row: 6, col: 4 },
        318: { row: 6, col: 3 },
        317: { row: 4, col: 4 },
        316: { row: 6, col: 5 },
        315: { row: 4, col: 8 },
        314: { row: 3, col: 6 },
        313: { row: 2, col: 3 },
        312: { row: 2, col: 7 },
        311: { row: 2, col: 8 },
        310: { row: 4, col: 5 },
        309: { row: 2, col: 1 },
        308: { row: 5, col: 4 },
        307: { row: 5, col: 2 },
        306: { row: 1, col: 1 },
        305: { row: 5, col: 7 },
        304: { row: 1, col: 9 },
        303: { row: 2, col: 6 },
        302: { row: 2, col: 3 },
        301: { row: 5, col: 4 },
        300: { row: 6, col: 4 },
        299: { row: 1, col: 9 },
        298: { row: 4, col: 4 },
        297: { row: 1, col: 3 },
        296: { row: 4, col: 4 },
        295: { row: 1, col: 6 },
        294: { row: 4, col: 5 },
        293: { row: 5, col: 6 },
        292: { row: 4, col: 2 },
        291: { row: 4, col: 2 },
        290: { row: 6, col: 3 },
        289: { row: 4, col: 4 },
        288: { row: 1, col: 9 },
        287: { row: 5, col: 7 },
        286: { row: 5, col: 5 },
        285: { row: 1, col: 4 },
        284: { row: 6, col: 3 },
        283: { row: 2, col: 2 },
        282: { row: 6, col: 6 },
        281: { row: 6, col: 1 },
        280: { row: 6, col: 6 },
        279: { row: 6, col: 5 },
        278: { row: 3, col: 6 },
        277: { row: 6, col: 8 },
        276: { row: 6, col: 5 },
        275: { row: 2, col: 2 },
        274: { row: 1, col: 5 },
        273: { row: 1, col: 5 },
        272: { row: 5, col: 5 },
        271: { row: 2, col: 3 },
        270: { row: 4, col: 2 },
        269: { row: 6, col: 5 },
        268: { row: 4, col: 1 },
        267: { row: 1, col: 5 },
        266: { row: 2, col: 3 },
        265: { row: 6, col: 2 },
        264: { row: 4, col: 1 },
        263: { row: 4, col: 4 },
        262: { row: 1, col: 4 },
        261: { row: 6, col: 5 },
        260: { row: 1, col: 4 },
        259: { row: 4, col: 9 },
        258: { row: 2, col: 1 },
        257: { row: 4, col: 6 },
        256: { row: 2, col: 9 },
        255: { row: 6, col: 2 },
        254: { row: 5, col: 8 },
        253: { row: 6, col: 7 },
        252: { row: 1, col: 7 },
        251: { row: 3, col: 2 },
        250: { row: 3, col: 3 },
        249: { row: 5, col: 3 },
        248: { row: 1, col: 4 },
        247: { row: 4, col: 5 },
        246: { row: 1, col: 6 },
        245: { row: 3, col: 2 },
        244: { row: 1, col: 2 },
        243: { row: 2, col: 1 },
        242: { row: 6, col: 7 },
        241: { row: 6, col: 5 },
        240: { row: 5, col: 1 },
        239: { row: 5, col: 6 },
        238: { row: 4, col: 9 },
        237: { row: 4, col: 1 },
        236: { row: 5, col: 1 },
        235: { row: 6, col: 2 },
        234: { row: 1, col: 5 },
        233: { row: 2, col: 5 },
        232: { row: 6, col: 5 },
        231: { row: 4, col: 9 },
        230: { row: 6, col: 7 },
        229: { row: 2, col: 5 },
        228: { row: 2, col: 3 },
        227: { row: 3, col: 9 },
        226: { row: 2, col: 2 },
        225: { row: 2, col: 4 },
        224: { row: 2, col: 7 },
        223: { row: 1, col: 2 },
        222: { row: 3, col: 2 },
        221: { row: 5, col: 6 },
        220: { row: 4, col: 2 },
        219: { row: 6, col: 1 },
        218: { row: 6, col: 3 },
        217: { row: 6, col: 7 },
        216: { row: 1, col: 7 },
        215: { row: 1, col: 3 },
        214: { row: 3, col: 8 },
        213: { row: 1, col: 2 },
        212: { row: 2, col: 9 },
        211: { row: 3, col: 4 },
        210: { row: 4, col: 1 },
        209: { row: 3, col: 4 },
        208: { row: 2, col: 4 },
        207: { row: 3, col: 4 },
        206: { row: 5, col: 6 },
        205: { row: 5, col: 7 },
        204: { row: 3, col: 9 },
        203: { row: 1, col: 8 },
        202: { row: 1, col: 9 },
        201: { row: 1, col: 2 },
        200: { row: 4, col: 2 },
        199: { row: 6, col: 7 },
        198: { row: 6, col: 3 },
        197: { row: 2, col: 6 },
        196: { row: 3, col: 4 },
        195: { row: 6, col: 7 },
        194: { row: 1, col: 6 },
        193: { row: 1, col: 8 },
        192: { row: 2, col: 2 },
        191: { row: 1, col: 8 },
        190: { row: 2, col: 4 },
        189: { row: 4, col: 4 },
        188: { row: 1, col: 7 },
        187: { row: 4, col: 1 },
        186: { row: 5, col: 7 },
        185: { row: 6, col: 5 },
        184: { row: 6, col: 1 },
        183: { row: 4, col: 2 },
        182: { row: 1, col: 2 },
        181: { row: 4, col: 2 },
        180: { row: 1, col: 6 },
        179: { row: 6, col: 6 },
        178: { row: 3, col: 6 },
        177: { row: 1, col: 9 },
        176: { row: 1, col: 6 },
        175: { row: 1, col: 3 },
        174: { row: 1, col: 9 },
        173: { row: 5, col: 5 },
        172: { row: 6, col: 7 },
        171: { row: 1, col: 4 },
        170: { row: 1, col: 9 },
        169: { row: 3, col: 3 },
        168: { row: 4, col: 4 },
        167: { row: 2, col: 7 },
        166: { row: 3, col: 7 },
        165: { row: 1, col: 3 },
        164: { row: 5, col: 3 },
        163: { row: 4, col: 2 },
        162: { row: 1, col: 5 },
        161: { row: 1, col: 6 },
        160: { row: 1, col: 6 },
        159: { row: 4, col: 5 },
        158: { row: 1, col: 3 },
        157: { row: 1, col: 1 },
        156: { row: 1, col: 7 },
        155: { row: 1, col: 6 },
        154: { row: 1, col: 2 },
        153: { row: 2, col: 7 },
        152: { row: 6, col: 5 },
        151: { row: 3, col: 2 },
        150: { row: 3, col: 5 },
        149: { row: 5, col: 2 },
        148: { row: 5, col: 8 },
        147: { row: 6, col: 8 },
        146: { row: 6, col: 3 },
        145: { row: 1, col: 6 },
        144: { row: 4, col: 8 },
        143: { row: 3, col: 6 },
        142: { row: 5, col: 8 },
        141: { row: 5, col: 7 },
        140: { row: 2, col: 3 },
        139: { row: 5, col: 4 },
        138: { row: 5, col: 6 },
        137: { row: 1, col: 8 },
        136: { row: 3, col: 4 },
        135: { row: 6, col: 7 },
        134: { row: 1, col: 9 },
        133: { row: 6, col: 5 },
        132: { row: 3, col: 3 },
        131: { row: 1, col: 6 },
        130: { row: 4, col: 4 },
        129: { row: 5, col: 8 },
        128: { row: 1, col: 5 },
        127: { row: 4, col: 7 },
        126: { row: 4, col: 7 },
        125: { row: 3, col: 2 },
        124: { row: 1, col: 5 },
        123: { row: 2, col: 5 },
        122: { row: 1, col: 5 },
        121: { row: 2, col: 2 },
        120: { row: 5, col: 1 },
        119: { row: 2, col: 5 },
        118: { row: 1, col: 8 },
        117: { row: 3, col: 1 },
        116: { row: 6, col: 4 },
        115: { row: 2, col: 2 },
        114: { row: 6, col: 8 },
        113: { row: 3, col: 5 },
        112: { row: 4, col: 6 },
        111: { row: 1, col: 9 },
        110: { row: 2, col: 3 },
        109: { row: 3, col: 5 },
        108: { row: 1, col: 3 },
        107: { row: 5, col: 8 },
        106: { row: 1, col: 8 },
        105: { row: 1, col: 6 },
        104: { row: 1, col: 9 },
        103: { row: 3, col: 9 },
        102: { row: 5, col: 4 },
        101: { row: 3, col: 3 },
        100: { row: 4, col: 1 },
        99: { row: 3, col: 4 },
        98: { row: 5, col: 2 },
        97: { row: 4, col: 6 },
        96: { row: 3, col: 2 },
        95: { row: 5, col: 2 },
        94: { row: 4, col: 9 },
        93: { row: 6, col: 5 },
        92: { row: 1, col: 8 },
        91: { row: 2, col: 1 },
        90: { row: 3, col: 8 },
        89: { row: 3, col: 3 },
        88: { row: 1, col: 9 },
        87: { row: 3, col: 2 },
        86: { row: 5, col: 2 },
        85: { row: 6, col: 5 },
        84: { row: 1, col: 5 },
        83: { row: 6, col: 2 },
        82: { row: 6, col: 2 },
        81: { row: 4, col: 4 },
        80: { row: 2, col: 8 },
        79: { row: 6, col: 4 },
        78: { row: 1, col: 8 },
        77: { row: 2, col: 4 },
        76: { row: 4, col: 9 },
        75: { row: 6, col: 3 },
        74: { row: 1, col: 8 },
        73: { row: 4, col: 1 },
        72: { row: 4, col: 7 },
        71: { row: 4, col: 9 },
        70: { row: 4, col: 3 },
        69: { row: 5, col: 9 },
        68: { row: 5, col: 4 },
        67: { row: 1, col: 6 },
        66: { row: 5, col: 6 },
        65: { row: 3, col: 3 },
        64: { row: 6, col: 8 },
        63: { row: 2, col: 5 },
        62: { row: 2, col: 2 },
        61: { row: 6, col: 7 },
        60: { row: 5, col: 1 },
        59: { row: 4, col: 4 },
        58: { row: 6, col: 3 },
        57: { row: 1, col: 2 },
        56: { row: 6, col: 1 },
        55: { row: 6, col: 6 },
        54: { row: 4, col: 7 },
        53: { row: 1, col: 5 },
        52: { row: 2, col: 3 },
        51: { row: 3, col: 3 },
        50: { row: 4, col: 2 },
        49: { row: 5, col: 3 },
        48: { row: 4, col: 9 },
        47: { row: 6, col: 1 },
        46: { row: 2, col: 6 },
        45: { row: 6, col: 1 },
        44: { row: 1, col: 5 },
        43: { row: 3, col: 2 },
        42: { row: 2, col: 3 },
        41: { row: 6, col: 9 },
        40: { row: 2, col: 9 },
        39: { row: 6, col: 4 },
        38: { row: 2, col: 9 },
        37: { row: 3, col: 8 },
        36: { row: 2, col: 8 },
        35: { row: 3, col: 6 },
        34: { row: 5, col: 8 },
        33: { row: 1, col: 5 },
        32: { row: 1, col: 9 },
        31: { row: 3, col: 2 },
        30: { row: 6, col: 5 },
        29: { row: 2, col: 9 },
        28: { row: 6, col: 4 },
        27: { row: 2, col: 8 },
        26: { row: 4, col: 4 },
        25: { row: 6, col: 7 },
        24: { row: 4, col: 6 },
        23: { row: 6, col: 4 },
        22: { row: 3, col: 8 },
        21: { row: 1, col: 4 },
        20: { row: 3, col: 1 },
        19: { row: 5, col: 3 },
        18: { row: 2, col: 2 },
        17: { row: 4, col: 8 },
        16: { row: 4, col: 5 },
        15: { row: 4, col: 9 },
        14: { row: 2, col: 2 },
        13: { row: 1, col: 2 },
        12: { row: 1, col: 7 },
        11: { row: 5, col: 4 },
        10: { row: 5, col: 6 },
        9: { row: 4, col: 1 },
        8: { row: 2, col: 7 },
        7: { row: 3, col: 7 },
        6: { row: 2, col: 9 },
        5: { row: 3, col: 3 },
        4: { row: 2, col: 5 },
        3: { row: 1, col: 7 },
        2: { row: 1, col: 6 },
        1: { row: 1, col: 5 }
    };

    // Загружаем сохраненный ID локации или используем 1 по умолчанию
    let currentLocationId = GM_getValue('currentLocationId', 1);
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
            if (currentLocationId < 549) {
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
