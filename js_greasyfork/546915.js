// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛС) с управлением и автопереключением - От ВВ до Деревни
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций и автопереключением по клику
// @author       MyName
// @match        https://catwar.net/cw3/*
// @match        https://catwar.su/cw3/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546915/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%A1%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546915/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%A1%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.meta.js
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
    `);

    // База данных всех локаций (ID => {row, col}) из ЛС.xlsx
    const highlightRules = {
        700: { row: 1, col: 5 },
        699: { row: 1, col: 9 },
        698: { row: 5, col: 2 },
        697: { row: 1, col: 2 },
        696: { row: 5, col: 4 },
        695: { row: 6, col: 2 },
        694: { row: 5, col: 1 },
        693: { row: 2, col: 3 },
        692: { row: 6, col: 1 },
        691: { row: 4, col: 2 },
        690: { row: 2, col: 2 },
        689: { row: 1, col: 1 },
        688: { row: 1, col: 5 },
        687: { row: 5, col: 1 },
        686: { row: 4, col: 4 },
        685: { row: 2, col: 5 },
        684: { row: 6, col: 2 },
        683: { row: 2, col: 5 },
        682: { row: 4, col: 3 },
        681: { row: 1, col: 8 },
        680: { row: 2, col: 8 },
        679: { row: 1, col: 5 },
        678: { row: 2, col: 5 },
        677: { row: 4, col: 9 },
        676: { row: 5, col: 3 },
        675: { row: 1, col: 1 },
        674: { row: 1, col: 6 },
        673: { row: 1, col: 2 },
        672: { row: 5, col: 5 },
        671: { row: 1, col: 6 },
        670: { row: 3, col: 4 },
        669: { row: 1, col: 2 },
        668: { row: 3, col: 8 },
        667: { row: 5, col: 6 },
        666: { row: 2, col: 6 },
        665: { row: 4, col: 1 },
        664: { row: 1, col: 1 },
        663: { row: 3, col: 1 },
        662: { row: 6, col: 5 },
        661: { row: 3, col: 5 },
        660: { row: 5, col: 1 },
        659: { row: 3, col: 5 },
        658: { row: 2, col: 9 },
        657: { row: 3, col: 4 },
        656: { row: 6, col: 2 },
        655: { row: 5, col: 8 },
        654: { row: 3, col: 1 },
        653: { row: 5, col: 8 },
        652: { row: 5, col: 5 },
        651: { row: 5, col: 6 },
        650: { row: 5, col: 1 },
        649: { row: 5, col: 6 },
        648: { row: 2, col: 6 },
        647: { row: 3, col: 1 },
        646: { row: 1, col: 8 },
        645: { row: 2, col: 2 },
        644: { row: 2, col: 3 },
        643: { row: 3, col: 9 },
        642: { row: 4, col: 7 },
        641: { row: 2, col: 2 },
        640: { row: 5, col: 7 },
        639: { row: 3, col: 2 },
        638: { row: 6, col: 4 },
        637: { row: 6, col: 8 },
        636: { row: 5, col: 7 },
        635: { row: 3, col: 7 },
        634: { row: 4, col: 9 },
        633: { row: 3, col: 7 },
        632: { row: 1, col: 3 },
        631: { row: 4, col: 8 },
        630: { row: 3, col: 8 },
        629: { row: 1, col: 6 },
        628: { row: 3, col: 6 },
        627: { row: 4, col: 2 },
        626: { row: 5, col: 5 },
        625: { row: 1, col: 6 },
        624: { row: 6, col: 5 },
        623: { row: 2, col: 3 },
        622: { row: 5, col: 4 },
        621: { row: 3, col: 5 },
        620: { row: 6, col: 3 },
        619: { row: 5, col: 8 },
        618: { row: 6, col: 2 },
        617: { row: 6, col: 2 },
        616: { row: 5, col: 8 },
        615: { row: 6, col: 4 },
        614: { row: 6, col: 5 },
        613: { row: 6, col: 3 },
        612: { row: 6, col: 4 },
        611: { row: 6, col: 4 },
        610: { row: 6, col: 9 },
        609: { row: 4, col: 4 },
        608: { row: 2, col: 4 },
        607: { row: 5, col: 3 },
        606: { row: 3, col: 1 },
        605: { row: 3, col: 1 },
        604: { row: 1, col: 6 },
        603: { row: 4, col: 8 },
        602: { row: 1, col: 5 },
        601: { row: 3, col: 2 },
        600: { row: 4, col: 6 },
        599: { row: 2, col: 7 },
        598: { row: 3, col: 2 },
        597: { row: 5, col: 7 },
        596: { row: 1, col: 2 },
        595: { row: 3, col: 9 },
        594: { row: 2, col: 6 },
        593: { row: 6, col: 2 },
        592: { row: 3, col: 8 },
        591: { row: 6, col: 3 },
        590: { row: 6, col: 9 },
        589: { row: 1, col: 8 },
        588: { row: 6, col: 5 },
        587: { row: 3, col: 3 },
        586: { row: 2, col: 1 },
        585: { row: 3, col: 7 },
        584: { row: 6, col: 9 },
        583: { row: 2, col: 9 },
        582: { row: 5, col: 3 },
        581: { row: 6, col: 3 },
        580: { row: 3, col: 1 },
        579: { row: 1, col: 9 },
        578: { row: 6, col: 8 },
        577: { row: 6, col: 7 },
        576: { row: 3, col: 3 },
        575: { row: 4, col: 4 },
        574: { row: 1, col: 7 },
        573: { row: 6, col: 9 },
        572: { row: 1, col: 4 },
        571: { row: 4, col: 6 },
        570: { row: 6, col: 3 },
        569: { row: 3, col: 9 },
        568: { row: 1, col: 8 },
        567: { row: 5, col: 7 },
        566: { row: 3, col: 1 },
        565: { row: 2, col: 2 },
        564: { row: 2, col: 5 },
        563: { row: 3, col: 6 },
        562: { row: 1, col: 2 },
        561: { row: 5, col: 9 },
        560: { row: 6, col: 8 },
        559: { row: 5, col: 2 },
        558: { row: 2, col: 3 },
        557: { row: 2, col: 7 },
        556: { row: 3, col: 5 },
        555: { row: 4, col: 1 },
        554: { row: 1, col: 1 },
        553: { row: 5, col: 5 },
        552: { row: 4, col: 4 },
        551: { row: 4, col: 6 },
        550: { row: 5, col: 5 },
        549: { row: 6, col: 4 },
        548: { row: 2, col: 1 },
        547: { row: 6, col: 4 },
        546: { row: 5, col: 8 },
        545: { row: 4, col: 8 },
        544: { row: 6, col: 2 },
        543: { row: 1, col: 9 },
        542: { row: 3, col: 9 },
        541: { row: 2, col: 2 },
        540: { row: 1, col: 7 },
        539: { row: 6, col: 4 },
        538: { row: 1, col: 5 },
        537: { row: 1, col: 9 },
        536: { row: 6, col: 9 },
        535: { row: 5, col: 8 },
        534: { row: 5, col: 8 },
        533: { row: 2, col: 3 },
        532: { row: 6, col: 7 },
        531: { row: 5, col: 7 },
        530: { row: 3, col: 9 },
        529: { row: 1, col: 6 },
        528: { row: 1, col: 4 },
        527: { row: 6, col: 5 },
        526: { row: 5, col: 4 },
        525: { row: 5, col: 6 },
        524: { row: 6, col: 4 },
        523: { row: 3, col: 6 },
        522: { row: 5, col: 7 },
        521: { row: 5, col: 1 },
        520: { row: 4, col: 4 },
        519: { row: 1, col: 4 },
        518: { row: 1, col: 2 },
        517: { row: 6, col: 4 },
        516: { row: 4, col: 6 },
        515: { row: 5, col: 1 },
        514: { row: 4, col: 4 },
        513: { row: 6, col: 3 },
        512: { row: 1, col: 8 },
        511: { row: 1, col: 5 },
        510: { row: 4, col: 1 },
        509: { row: 6, col: 6 },
        508: { row: 6, col: 2 },
        507: { row: 5, col: 7 },
        506: { row: 5, col: 6 },
        505: { row: 5, col: 5 },
        504: { row: 1, col: 6 },
        503: { row: 5, col: 2 },
        502: { row: 1, col: 3 },
        501: { row: 5, col: 2 },
        500: { row: 4, col: 9 },
        499: { row: 1, col: 6 },
        498: { row: 5, col: 9 },
        497: { row: 5, col: 7 },
        496: { row: 1, col: 9 },
        495: { row: 6, col: 2 },
        494: { row: 4, col: 1 },
        493: { row: 5, col: 6 },
        492: { row: 3, col: 7 },
        491: { row: 6, col: 4 },
        490: { row: 2, col: 5 },
        489: { row: 1, col: 6 },
        488: { row: 4, col: 1 },
        487: { row: 1, col: 4 },
        486: { row: 1, col: 5 },
        485: { row: 6, col: 9 },
        484: { row: 5, col: 3 },
        483: { row: 4, col: 6 },
        482: { row: 5, col: 9 },
        481: { row: 4, col: 1 },
        480: { row: 5, col: 3 },
        479: { row: 3, col: 8 },
        478: { row: 2, col: 9 },
        477: { row: 3, col: 8 },
        476: { row: 4, col: 9 },
        475: { row: 1, col: 6 },
        474: { row: 2, col: 7 },
        473: { row: 2, col: 4 },
        472: { row: 3, col: 2 },
        471: { row: 6, col: 7 },
        470: { row: 1, col: 9 },
        469: { row: 1, col: 6 },
        468: { row: 4, col: 3 },
        467: { row: 2, col: 4 },
        466: { row: 3, col: 9 },
        465: { row: 3, col: 8 },
        464: { row: 4, col: 4 },
        463: { row: 3, col: 2 },
        462: { row: 5, col: 6 },
        461: { row: 5, col: 6 },
        460: { row: 1, col: 7 },
        459: { row: 5, col: 1 },
        458: { row: 6, col: 8 },
        457: { row: 5, col: 6 },
        456: { row: 5, col: 3 },
        455: { row: 6, col: 5 },
        454: { row: 5, col: 5 },
        453: { row: 6, col: 1 },
        452: { row: 4, col: 6 },
        451: { row: 3, col: 7 },
        450: { row: 6, col: 6 },
        449: { row: 2, col: 4 },
        448: { row: 2, col: 3 },
        447: { row: 3, col: 1 },
        446: { row: 1, col: 3 },
        445: { row: 1, col: 9 },
        444: { row: 2, col: 6 },
        443: { row: 6, col: 8 },
        442: { row: 6, col: 3 },
        441: { row: 1, col: 1 },
        440: { row: 2, col: 8 },
        439: { row: 6, col: 4 },
        438: { row: 3, col: 3 },
        437: { row: 2, col: 4 },
        436: { row: 2, col: 8 },
        435: { row: 1, col: 1 },
        434: { row: 4, col: 9 },
        433: { row: 1, col: 7 },
        432: { row: 6, col: 6 },
        431: { row: 3, col: 1 },
        430: { row: 3, col: 4 },
        429: { row: 3, col: 7 },
        428: { row: 1, col: 9 },
        427: { row: 2, col: 2 },
        426: { row: 6, col: 9 },
        425: { row: 2, col: 5 },
        424: { row: 6, col: 9 },
        423: { row: 5, col: 4 },
        422: { row: 5, col: 8 },
        421: { row: 2, col: 2 },
        420: { row: 1, col: 5 },
        419: { row: 6, col: 3 },
        418: { row: 6, col: 3 },
        417: { row: 6, col: 7 },
        416: { row: 5, col: 6 },
        415: { row: 1, col: 2 },
        414: { row: 5, col: 4 },
        413: { row: 1, col: 4 },
        412: { row: 6, col: 3 },
        411: { row: 1, col: 1 },
        410: { row: 5, col: 2 },
        409: { row: 1, col: 7 },
        408: { row: 4, col: 8 },
        407: { row: 2, col: 2 },
        406: { row: 4, col: 7 },
        405: { row: 1, col: 8 },
        404: { row: 3, col: 2 },
        403: { row: 2, col: 4 },
        402: { row: 1, col: 1 },
        401: { row: 2, col: 5 },
        400: { row: 3, col: 9 },
        399: { row: 6, col: 4 },
        398: { row: 5, col: 9 },
        397: { row: 1, col: 2 },
        396: { row: 3, col: 9 },
        395: { row: 5, col: 6 },
        394: { row: 1, col: 3 },
        393: { row: 1, col: 8 },
        392: { row: 3, col: 9 },
        391: { row: 2, col: 6 },
        390: { row: 3, col: 1 },
        389: { row: 5, col: 1 },
        388: { row: 1, col: 8 },
        387: { row: 3, col: 9 },
        386: { row: 4, col: 4 },
        385: { row: 6, col: 9 },
        384: { row: 5, col: 8 },
        383: { row: 3, col: 1 },
        382: { row: 5, col: 9 },
        381: { row: 3, col: 2 },
        380: { row: 5, col: 2 },
        379: { row: 4, col: 2 },
        378: { row: 2, col: 7 },
        377: { row: 4, col: 9 },
        376: { row: 2, col: 3 },
        375: { row: 5, col: 5 },
        374: { row: 2, col: 6 },
        373: { row: 3, col: 5 },
        372: { row: 6, col: 3 },
        371: { row: 1, col: 3 },
        370: { row: 5, col: 2 },
        369: { row: 2, col: 6 },
        368: { row: 2, col: 6 },
        367: { row: 4, col: 4 },
        366: { row: 5, col: 9 },
        365: { row: 4, col: 7 },
        364: { row: 5, col: 2 },
        363: { row: 2, col: 1 },
        362: { row: 3, col: 2 },
        361: { row: 4, col: 4 },
        360: { row: 6, col: 7 },
        359: { row: 6, col: 2 },
        358: { row: 5, col: 9 },
        357: { row: 1, col: 1 },
        356: { row: 5, col: 6 },
        355: { row: 4, col: 7 },
        354: { row: 1, col: 8 },
        353: { row: 3, col: 5 },
        352: { row: 2, col: 4 },
        351: { row: 4, col: 7 },
        350: { row: 1, col: 6 },
        349: { row: 2, col: 9 },
        348: { row: 1, col: 9 },
        347: { row: 4, col: 2 },
        346: { row: 5, col: 3 },
        345: { row: 2, col: 9 },
        344: { row: 5, col: 2 },
        343: { row: 4, col: 3 },
        342: { row: 6, col: 1 },
        341: { row: 5, col: 5 },
        340: { row: 6, col: 4 },
        339: { row: 4, col: 8 },
        338: { row: 2, col: 1 },
        337: { row: 1, col: 4 },
        336: { row: 6, col: 9 },
        335: { row: 6, col: 1 },
        334: { row: 1, col: 4 },
        333: { row: 4, col: 2 },
        332: { row: 1, col: 8 },
        331: { row: 4, col: 8 },
        330: { row: 3, col: 8 },
        329: { row: 5, col: 1 },
        328: { row: 6, col: 9 },
        327: { row: 3, col: 1 },
        326: { row: 2, col: 9 },
        325: { row: 6, col: 5 },
        324: { row: 2, col: 1 },
        323: { row: 1, col: 8 },
        322: { row: 6, col: 5 },
        321: { row: 5, col: 1 },
        320: { row: 5, col: 1 },
        319: { row: 6, col: 3 },
        318: { row: 4, col: 6 },
        317: { row: 1, col: 9 },
        316: { row: 2, col: 1 },
        315: { row: 2, col: 5 },
        314: { row: 4, col: 3 },
        313: { row: 4, col: 6 },
        312: { row: 1, col: 9 },
        311: { row: 5, col: 6 },
        310: { row: 5, col: 1 },
        309: { row: 1, col: 7 },
        308: { row: 6, col: 9 },
        307: { row: 5, col: 3 },
        306: { row: 1, col: 9 },
        305: { row: 4, col: 9 },
        304: { row: 2, col: 8 },
        303: { row: 3, col: 3 },
        302: { row: 5, col: 9 },
        301: { row: 6, col: 7 },
        300: { row: 3, col: 6 },
        299: { row: 3, col: 1 },
        298: { row: 6, col: 8 },
        297: { row: 2, col: 4 },
        296: { row: 1, col: 7 },
        295: { row: 2, col: 8 },
        294: { row: 6, col: 3 },
        293: { row: 6, col: 2 },
        292: { row: 2, col: 1 },
        291: { row: 2, col: 4 },
        290: { row: 1, col: 6 },
        289: { row: 4, col: 7 },
        288: { row: 5, col: 7 },
        287: { row: 3, col: 4 },
        286: { row: 2, col: 1 },
        285: { row: 5, col: 1 },
        284: { row: 2, col: 1 },
        283: { row: 3, col: 8 },
        282: { row: 1, col: 4 },
        281: { row: 6, col: 3 },
        280: { row: 4, col: 9 },
        279: { row: 1, col: 5 },
        278: { row: 1, col: 1 },
        277: { row: 3, col: 8 },
        276: { row: 1, col: 4 },
        275: { row: 4, col: 4 },
        274: { row: 5, col: 4 },
        273: { row: 2, col: 8 },
        272: { row: 5, col: 9 },
        271: { row: 1, col: 1 },
        270: { row: 3, col: 3 },
        269: { row: 3, col: 9 },
        268: { row: 2, col: 9 },
        267: { row: 6, col: 6 },
        266: { row: 3, col: 3 },
        265: { row: 2, col: 3 },
        264: { row: 4, col: 6 },
        263: { row: 4, col: 6 },
        262: { row: 6, col: 3 },
        261: { row: 4, col: 3 },
        260: { row: 4, col: 7 },
        259: { row: 5, col: 3 },
        258: { row: 3, col: 8 },
        257: { row: 4, col: 6 },
        256: { row: 2, col: 5 },
        255: { row: 1, col: 8 },
        254: { row: 2, col: 5 },
        253: { row: 4, col: 3 },
        252: { row: 6, col: 6 },
        251: { row: 2, col: 5 },
        250: { row: 1, col: 5 },
        249: { row: 6, col: 2 },
        248: { row: 5, col: 1 },
        247: { row: 3, col: 4 },
        246: { row: 5, col: 2 },
        245: { row: 4, col: 5 },
        244: { row: 4, col: 7 },
        243: { row: 3, col: 9 },
        242: { row: 6, col: 5 },
        241: { row: 2, col: 2 },
        240: { row: 5, col: 7 },
        239: { row: 5, col: 8 },
        238: { row: 5, col: 2 },
        237: { row: 6, col: 7 },
        236: { row: 1, col: 1 },
        235: { row: 3, col: 1 },
        234: { row: 1, col: 7 },
        233: { row: 1, col: 7 },
        232: { row: 6, col: 1 },
        231: { row: 4, col: 9 },
        230: { row: 2, col: 3 },
        229: { row: 1, col: 2 },
        228: { row: 3, col: 4 },
        227: { row: 1, col: 7 },
        226: { row: 6, col: 8 },
        225: { row: 3, col: 6 },
        224: { row: 1, col: 9 },
        223: { row: 6, col: 1 },
        222: { row: 3, col: 5 },
        221: { row: 4, col: 2 },
        220: { row: 5, col: 5 },
        219: { row: 6, col: 6 },
        218: { row: 2, col: 9 },
        217: { row: 2, col: 3 },
        216: { row: 4, col: 2 },
        215: { row: 5, col: 5 },
        214: { row: 2, col: 4 },
        213: { row: 5, col: 1 },
        212: { row: 5, col: 2 },
        211: { row: 1, col: 5 },
        210: { row: 4, col: 5 },
        209: { row: 6, col: 7 },
        208: { row: 6, col: 7 },
        207: { row: 4, col: 9 },
        206: { row: 4, col: 1 },
        205: { row: 3, col: 7 },
        204: { row: 2, col: 6 },
        203: { row: 3, col: 1 },
        202: { row: 3, col: 1 },
        201: { row: 3, col: 1 },
        200: { row: 5, col: 7 },
        199: { row: 4, col: 7 },
        198: { row: 6, col: 6 },
        197: { row: 4, col: 7 },
        196: { row: 5, col: 4 },
        195: { row: 1, col: 9 },
        194: { row: 6, col: 4 },
        193: { row: 2, col: 6 },
        192: { row: 5, col: 2 },
        191: { row: 4, col: 4 },
        190: { row: 5, col: 2 },
        189: { row: 6, col: 3 },
        188: { row: 5, col: 7 },
        187: { row: 4, col: 7 },
        186: { row: 2, col: 7 },
        185: { row: 4, col: 8 },
        184: { row: 3, col: 8 },
        183: { row: 4, col: 1 },
        182: { row: 2, col: 7 },
        181: { row: 5, col: 4 },
        180: { row: 4, col: 8 },
        179: { row: 5, col: 6 },
        178: { row: 6, col: 1 },
        177: { row: 6, col: 3 },
        176: { row: 1, col: 1 },
        175: { row: 2, col: 8 },
        174: { row: 2, col: 8 },
        173: { row: 6, col: 7 },
        172: { row: 4, col: 1 },
        171: { row: 4, col: 4 },
        170: { row: 6, col: 1 },
        169: { row: 5, col: 9 },
        168: { row: 4, col: 2 },
        167: { row: 6, col: 7 },
        166: { row: 3, col: 2 },
        165: { row: 5, col: 7 },
        164: { row: 2, col: 3 },
        163: { row: 1, col: 5 },
        162: { row: 5, col: 1 },
        161: { row: 6, col: 5 },
        160: { row: 3, col: 8 },
        159: { row: 4, col: 5 },
        158: { row: 5, col: 9 },
        157: { row: 2, col: 9 },
        156: { row: 6, col: 7 },
        155: { row: 6, col: 1 },
        154: { row: 6, col: 8 },
        153: { row: 1, col: 4 },
        152: { row: 4, col: 4 },
        151: { row: 6, col: 3 },
        150: { row: 4, col: 7 },
        149: { row: 1, col: 5 },
        148: { row: 2, col: 8 },
        147: { row: 1, col: 7 },
        146: { row: 2, col: 7 },
        145: { row: 6, col: 6 },
        144: { row: 5, col: 2 },
        143: { row: 6, col: 7 },
        142: { row: 1, col: 4 },
        141: { row: 1, col: 8 },
        140: { row: 1, col: 5 },
        139: { row: 3, col: 2 },
        138: { row: 3, col: 1 },
        137: { row: 1, col: 3 },
        136: { row: 2, col: 9 },
        135: { row: 3, col: 5 },
        134: { row: 4, col: 6 },
        133: { row: 6, col: 7 },
        132: { row: 1, col: 2 },
        131: { row: 3, col: 1 },
        130: { row: 6, col: 8 },
        129: { row: 1, col: 2 },
        128: { row: 3, col: 9 },
        127: { row: 6, col: 5 },
        126: { row: 5, col: 9 },
        125: { row: 5, col: 8 },
        124: { row: 4, col: 8 },
        123: { row: 6, col: 2 },
        122: { row: 6, col: 4 },
        121: { row: 1, col: 7 },
        120: { row: 1, col: 4 },
        119: { row: 4, col: 5 },
        118: { row: 1, col: 2 },
        117: { row: 5, col: 5 },
        116: { row: 4, col: 2 },
        115: { row: 2, col: 4 },
        114: { row: 5, col: 9 },
        113: { row: 4, col: 6 },
        112: { row: 1, col: 4 },
        111: { row: 5, col: 8 },
        110: { row: 4, col: 8 },
        109: { row: 3, col: 4 },
        108: { row: 6, col: 3 },
        107: { row: 2, col: 6 },
        106: { row: 2, col: 3 },
        105: { row: 4, col: 3 },
        104: { row: 3, col: 8 },
        103: { row: 1, col: 1 },
        102: { row: 4, col: 2 },
        101: { row: 6, col: 6 },
        100: { row: 3, col: 1 },
        99: { row: 3, col: 1 },
        98: { row: 4, col: 7 },
        97: { row: 1, col: 1 },
        96: { row: 2, col: 5 },
        95: { row: 4, col: 9 },
        94: { row: 2, col: 7 },
        93: { row: 3, col: 9 },
        92: { row: 2, col: 8 },
        91: { row: 3, col: 8 },
        90: { row: 1, col: 2 },
        89: { row: 4, col: 6 },
        88: { row: 1, col: 2 },
        87: { row: 1, col: 7 },
        86: { row: 3, col: 1 },
        85: { row: 6, col: 6 },
        84: { row: 3, col: 5 },
        83: { row: 3, col: 3 },
        82: { row: 6, col: 6 },
        81: { row: 2, col: 7 },
        80: { row: 2, col: 1 },
        79: { row: 5, col: 2 },
        78: { row: 1, col: 5 },
        77: { row: 3, col: 8 },
        76: { row: 4, col: 6 },
        75: { row: 3, col: 9 },
        74: { row: 3, col: 4 },
        73: { row: 4, col: 8 },
        72: { row: 1, col: 9 },
        71: { row: 5, col: 6 },
        70: { row: 2, col: 5 },
        69: { row: 6, col: 6 },
        68: { row: 3, col: 1 },
        67: { row: 3, col: 9 },
        66: { row: 5, col: 3 },
        65: { row: 1, col: 3 },
        64: { row: 5, col: 4 },
        63: { row: 6, col: 5 },
        62: { row: 1, col: 2 },
        61: { row: 3, col: 6 },
        60: { row: 3, col: 2 },
        59: { row: 3, col: 6 },
        58: { row: 3, col: 3 },
        57: { row: 2, col: 8 },
        56: { row: 5, col: 6 },
        55: { row: 3, col: 5 },
        54: { row: 5, col: 7 },
        53: { row: 3, col: 3 },
        52: { row: 2, col: 6 },
        51: { row: 5, col: 6 },
        50: { row: 6, col: 8 },
        49: { row: 6, col: 8 },
        48: { row: 6, col: 2 },
        47: { row: 2, col: 5 },
        46: { row: 6, col: 9 },
        45: { row: 4, col: 1 },
        44: { row: 1, col: 4 },
        43: { row: 3, col: 6 },
        42: { row: 2, col: 6 },
        41: { row: 1, col: 7 },
        40: { row: 6, col: 5 },
        39: { row: 3, col: 6 },
        38: { row: 1, col: 6 },
        37: { row: 2, col: 3 },
        36: { row: 4, col: 6 },
        35: { row: 4, col: 2 },
        34: { row: 6, col: 7 },
        33: { row: 1, col: 6 },
        32: { row: 1, col: 4 },
        31: { row: 6, col: 6 },
        30: { row: 2, col: 7 },
        29: { row: 2, col: 1 },
        28: { row: 6, col: 8 },
        27: { row: 2, col: 7 },
        26: { row: 3, col: 7 },
        25: { row: 4, col: 8 },
        24: { row: 2, col: 9 },
        23: { row: 1, col: 9 },
        22: { row: 6, col: 6 },
        21: { row: 6, col: 8 },
        20: { row: 4, col: 9 },
        19: { row: 5, col: 2 },
        18: { row: 2, col: 4 },
        17: { row: 4, col: 7 },
        16: { row: 2, col: 4 },
        15: { row: 3, col: 1 },
        14: { row: 2, col: 2 },
        13: { row: 3, col: 2 },
        12: { row: 3, col: 7 },
        11: { row: 1, col: 3 },
        10: { row: 2, col: 1 },
        9: { row: 4, col: 3 },
        8: { row: 2, col: 1 },
        7: { row: 6, col: 4 },
        6: { row: 4, col: 6 },
        5: { row: 5, col: 2 },
        4: { row: 2, col: 3 },
        3: { row: 4, col: 2 },
        2: { row: 6, col: 8 },
        1: { row: 5, col: 7 }
    };
  // Загружаем сохраненный ID локации или используем 699 по умолчанию
    let currentLocationId = GM_getValue('currentLocationId', 699);
    let highlightedCell = null;

    // Создаем интерфейс управления
    function createUI() {
        const ui = document.createElement('div');
        ui.className = 'cw-highlight-ui';
        ui.innerHTML = `
            <button id="cw-prev">←</button>
            <span id="cw-location-id">ID: ${currentLocationId}</span>
            <button id="cw-next">→</button>
            <div class="cw-input-container">
                <input type="number" id="cw-location-input" min="1" max="699" placeholder="ID локации">
                <button id="cw-go">Перейти</button>
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
            if (currentLocationId < 699) {
                currentLocationId++;
                saveAndUpdate();
                highlightCurrentCell();
            }
        });

        // Обработчик кнопки перехода
        document.getElementById('cw-go').addEventListener('click', () => {
            const input = document.getElementById('cw-location-input');
            const newId = parseInt(input.value);

            if (!isNaN(newId) && newId >= 1 && newId <= 699) {
                currentLocationId = newId;
                saveAndUpdate();
                highlightCurrentCell();
                input.value = ''; // Очищаем поле ввода
            } else {
                alert('Пожалуйста, введите число от 1 до 699');
            }
        });

        // Обработчик нажатия Enter в поле ввода
        document.getElementById('cw-location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('cw-go').click();
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

