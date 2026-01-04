// ==UserScript==
// @name         Catwar - Подсветка клеток (ВП) с управлением и автопереключением - От ВВ до Деревни
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций и автопереключением по клику
// @author       MyName
// @match        https://catwar.net/cw3/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546036/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%92%D0%9F%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546036/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%92%D0%9F%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20-%20%D0%9E%D1%82%20%D0%92%D0%92%20%D0%B4%D0%BE%20%D0%94%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B8.meta.js
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

    // База данных всех локаций (ID => {row, col}) из таблицы ВП.xlsx
    const highlightRules = {
        699: { row: 6, col: 5 },
        698: { row: 3, col: 6 },
        697: { row: 3, col: 9 },
        696: { row: 6, col: 3 },
        695: { row: 5, col: 7 },
        694: { row: 1, col: 3 },
        693: { row: 4, col: 9 },
        692: { row: 1, col: 5 },
        691: { row: 6, col: 3 },
        690: { row: 1, col: 1 },
        689: { row: 2, col: 8 },
        688: { row: 4, col: 4 },
        687: { row: 1, col: 1 },
        686: { row: 1, col: 8 },
        685: { row: 3, col: 5 },
        684: { row: 6, col: 1 },
        683: { row: 4, col: 1 },
        682: { row: 3, col: 7 },
        681: { row: 4, col: 5 },
        680: { row: 2, col: 1 },
        679: { row: 3, col: 2 },
        678: { row: 4, col: 8 },
        677: { row: 4, col: 9 },
        676: { row: 5, col: 1 },
        675: { row: 4, col: 3 },
        674: { row: 6, col: 1 },
        673: { row: 1, col: 6 },
        672: { row: 2, col: 8 },
        671: { row: 5, col: 5 },
        670: { row: 1, col: 2 },
        669: { row: 2, col: 1 },
        668: { row: 3, col: 1 },
        667: { row: 6, col: 3 },
        666: { row: 6, col: 5 },
        665: { row: 1, col: 6 },
        664: { row: 6, col: 2 },
        663: { row: 1, col: 9 },
        662: { row: 6, col: 2 },
        661: { row: 2, col: 3 },
        660: { row: 3, col: 3 },
        659: { row: 1, col: 1 },
        658: { row: 3, col: 4 },
        657: { row: 1, col: 7 },
        656: { row: 2, col: 5 },
        655: { row: 1, col: 2 },
        654: { row: 4, col: 8 },
        653: { row: 4, col: 1 },
        652: { row: 1, col: 8 },
        651: { row: 3, col: 4 },
        650: { row: 6, col: 5 },
        649: { row: 4, col: 4 },
        648: { row: 3, col: 9 },
        647: { row: 2, col: 7 },
        646: { row: 4, col: 5 },
        645: { row: 4, col: 9 },
        644: { row: 1, col: 4 },
        643: { row: 4, col: 3 },
        642: { row: 5, col: 7 },
        641: { row: 3, col: 2 },
        640: { row: 5, col: 5 },
        639: { row: 2, col: 9 },
        638: { row: 4, col: 6 },
        637: { row: 5, col: 3 },
        636: { row: 1, col: 1 },
        635: { row: 1, col: 1 },
        634: { row: 4, col: 3 },
        633: { row: 4, col: 3 },
        632: { row: 3, col: 5 },
        631: { row: 4, col: 4 },
        630: { row: 6, col: 3 },
        629: { row: 3, col: 5 },
        628: { row: 3, col: 7 },
        627: { row: 5, col: 9 },
        626: { row: 5, col: 7 },
        625: { row: 5, col: 3 },
        624: { row: 5, col: 4 },
        623: { row: 6, col: 3 },
        622: { row: 5, col: 7 },
        621: { row: 4, col: 3 },
        620: { row: 4, col: 1 },
        619: { row: 6, col: 6 },
        618: { row: 5, col: 8 },
        617: { row: 5, col: 9 },
        616: { row: 6, col: 6 },
        615: { row: 4, col: 8 },
        614: { row: 1, col: 9 },
        613: { row: 6, col: 5 },
        612: { row: 1, col: 4 },
        611: { row: 4, col: 2 },
        610: { row: 4, col: 1 },
        609: { row: 1, col: 4 },
        608: { row: 1, col: 3 },
        607: { row: 2, col: 4 },
        606: { row: 2, col: 2 },
        605: { row: 6, col: 1 },
        604: { row: 3, col: 5 },
        603: { row: 2, col: 7 },
        602: { row: 3, col: 3 },
        601: { row: 5, col: 3 },
        600: { row: 4, col: 4 },
        599: { row: 6, col: 8 },
        598: { row: 6, col: 2 },
        597: { row: 6, col: 1 },
        596: { row: 2, col: 7 },
        595: { row: 6, col: 3 },
        594: { row: 5, col: 1 },
        593: { row: 2, col: 4 },
        592: { row: 6, col: 2 },
        591: { row: 1, col: 9 },
        590: { row: 5, col: 6 },
        589: { row: 2, col: 3 },
        588: { row: 4, col: 1 },
        587: { row: 6, col: 7 },
        586: { row: 1, col: 6 },
        585: { row: 1, col: 2 },
        584: { row: 4, col: 1 },
        583: { row: 6, col: 2 },
        582: { row: 6, col: 9 },
        581: { row: 5, col: 5 },
        580: { row: 2, col: 6 },
        579: { row: 4, col: 4 },
        578: { row: 1, col: 6 },
        577: { row: 6, col: 3 },
        576: { row: 6, col: 5 },
        575: { row: 1, col: 1 },
        574: { row: 2, col: 5 },
        573: { row: 2, col: 1 },
        572: { row: 1, col: 6 },
        571: { row: 2, col: 2 },
        570: { row: 2, col: 8 },
        569: { row: 5, col: 4 },
        568: { row: 5, col: 9 },
        567: { row: 5, col: 5 },
        566: { row: 1, col: 5 },
        565: { row: 4, col: 8 },
        564: { row: 3, col: 2 },
        563: { row: 4, col: 6 },
        562: { row: 1, col: 5 },
        561: { row: 3, col: 3 },
        560: { row: 5, col: 6 },
        559: { row: 2, col: 5 },
        558: { row: 1, col: 9 },
        557: { row: 5, col: 8 },
        556: { row: 5, col: 1 },
        555: { row: 4, col: 4 },
        554: { row: 3, col: 3 },
        553: { row: 4, col: 6 },
        552: { row: 6, col: 5 },
        551: { row: 3, col: 5 },
        550: { row: 6, col: 5 },
        549: { row: 6, col: 3 },
        548: { row: 3, col: 3 },
        547: { row: 5, col: 4 },
        546: { row: 4, col: 3 },
        545: { row: 5, col: 1 },
        544: { row: 5, col: 4 },
        543: { row: 4, col: 5 },
        542: { row: 6, col: 6 },
        541: { row: 3, col: 8 },
        540: { row: 2, col: 4 },
        539: { row: 2, col: 7 },
        538: { row: 4, col: 3 },
        537: { row: 1, col: 4 },
        536: { row: 1, col: 4 },
        535: { row: 4, col: 3 },
        534: { row: 3, col: 4 },
        533: { row: 2, col: 3 },
        532: { row: 6, col: 4 },
        531: { row: 2, col: 3 },
        530: { row: 3, col: 7 },
        529: { row: 1, col: 9 },
        528: { row: 2, col: 2 },
        527: { row: 6, col: 5 },
        526: { row: 1, col: 5 },
        525: { row: 1, col: 6 },
        524: { row: 1, col: 5 },
        523: { row: 1, col: 8 },
        522: { row: 2, col: 5 },
        521: { row: 4, col: 1 },
        520: { row: 4, col: 5 },
        519: { row: 2, col: 9 },
        518: { row: 6, col: 5 },
        517: { row: 1, col: 7 },
        516: { row: 2, col: 3 },
        515: { row: 6, col: 8 },
        514: { row: 2, col: 7 },
        513: { row: 3, col: 9 },
        512: { row: 2, col: 8 },
        511: { row: 6, col: 4 },
        510: { row: 4, col: 6 },
        509: { row: 4, col: 5 },
        508: { row: 3, col: 5 },
        507: { row: 4, col: 4 },
        506: { row: 2, col: 2 },
        505: { row: 2, col: 7 },
        504: { row: 3, col: 3 },
        503: { row: 2, col: 2 },
        502: { row: 6, col: 2 },
        501: { row: 1, col: 2 },
        500: { row: 3, col: 9 },
        499: { row: 5, col: 2 },
        498: { row: 5, col: 2 },
        497: { row: 3, col: 5 },
        496: { row: 4, col: 9 },
        495: { row: 3, col: 3 },
        494: { row: 4, col: 7 },
        493: { row: 3, col: 7 },
        492: { row: 2, col: 5 },
        491: { row: 3, col: 5 },
        490: { row: 6, col: 6 },
        489: { row: 2, col: 9 },
        488: { row: 6, col: 9 },
        487: { row: 4, col: 2 },
        486: { row: 4, col: 8 },
        485: { row: 4, col: 1 },
        484: { row: 2, col: 1 },
        483: { row: 1, col: 3 },
        482: { row: 2, col: 7 },
        481: { row: 5, col: 7 },
        480: { row: 2, col: 6 },
        479: { row: 3, col: 2 },
        478: { row: 3, col: 9 },
        477: { row: 6, col: 4 },
        476: { row: 6, col: 6 },
        475: { row: 6, col: 8 },
        474: { row: 1, col: 4 },
        473: { row: 3, col: 3 },
        472: { row: 4, col: 2 },
        471: { row: 3, col: 3 },
        470: { row: 4, col: 9 },
        469: { row: 6, col: 4 },
        468: { row: 5, col: 2 },
        467: { row: 4, col: 3 },
        466: { row: 2, col: 6 },
        465: { row: 3, col: 2 },
        464: { row: 4, col: 9 },
        463: { row: 4, col: 3 },
        462: { row: 6, col: 6 },
        461: { row: 6, col: 7 },
        460: { row: 2, col: 2 },
        459: { row: 5, col: 9 },
        458: { row: 4, col: 1 },
        457: { row: 3, col: 4 },
        456: { row: 5, col: 6 },
        455: { row: 2, col: 6 },
        454: { row: 3, col: 2 },
        453: { row: 2, col: 9 },
        452: { row: 4, col: 2 },
        451: { row: 1, col: 8 },
        450: { row: 3, col: 6 },
        449: { row: 2, col: 9 },
        448: { row: 2, col: 2 },
        447: { row: 3, col: 9 },
        446: { row: 2, col: 9 },
        445: { row: 6, col: 6 },
        444: { row: 6, col: 5 },
        443: { row: 3, col: 1 },
        442: { row: 3, col: 6 },
        441: { row: 5, col: 5 },
        440: { row: 2, col: 1 },
        439: { row: 3, col: 4 },
        438: { row: 5, col: 6 },
        437: { row: 6, col: 4 },
        436: { row: 4, col: 6 },
        435: { row: 4, col: 4 },
        434: { row: 2, col: 1 },
        433: { row: 4, col: 6 },
        432: { row: 5, col: 3 },
        431: { row: 6, col: 2 },
        430: { row: 5, col: 8 },
        429: { row: 4, col: 2 },
        428: { row: 1, col: 8 },
        427: { row: 4, col: 1 },
        426: { row: 5, col: 7 },
        425: { row: 6, col: 7 },
        424: { row: 6, col: 5 },
        423: { row: 5, col: 3 },
        422: { row: 6, col: 4 },
        421: { row: 4, col: 7 },
        420: { row: 1, col: 2 },
        419: { row: 6, col: 8 },
        418: { row: 5, col: 8 },
        417: { row: 1, col: 4 },
        416: { row: 5, col: 2 },
        415: { row: 2, col: 6 },
        414: { row: 1, col: 6 },
        413: { row: 6, col: 7 },
        412: { row: 6, col: 2 },
        411: { row: 6, col: 8 },
        410: { row: 2, col: 5 },
        409: { row: 4, col: 7 },
        408: { row: 3, col: 3 },
        407: { row: 3, col: 5 },
        406: { row: 6, col: 4 },
        405: { row: 5, col: 4 },
        404: { row: 1, col: 2 },
        403: { row: 5, col: 6 },
        402: { row: 6, col: 3 },
        401: { row: 4, col: 4 },
        400: { row: 1, col: 4 },
        399: { row: 2, col: 1 },
        398: { row: 1, col: 4 },
        397: { row: 3, col: 2 },
        396: { row: 4, col: 6 },
        395: { row: 6, col: 7 },
        394: { row: 5, col: 9 },
        393: { row: 2, col: 4 },
        392: { row: 6, col: 4 },
        391: { row: 5, col: 7 },
        390: { row: 2, col: 7 },
        389: { row: 6, col: 1 },
        388: { row: 2, col: 2 },
        387: { row: 1, col: 7 },
        386: { row: 6, col: 8 },
        385: { row: 3, col: 9 },
        384: { row: 1, col: 4 },
        383: { row: 5, col: 5 },
        382: { row: 3, col: 6 },
        381: { row: 6, col: 1 },
        380: { row: 2, col: 4 },
        379: { row: 5, col: 4 },
        378: { row: 6, col: 2 },
        377: { row: 3, col: 7 },
        376: { row: 3, col: 6 },
        375: { row: 1, col: 1 },
        374: { row: 6, col: 2 },
        373: { row: 5, col: 3 },
        372: { row: 4, col: 1 },
        371: { row: 3, col: 2 },
        370: { row: 2, col: 4 },
        369: { row: 1, col: 9 },
        368: { row: 4, col: 1 },
        367: { row: 1, col: 9 },
        366: { row: 4, col: 7 },
        365: { row: 6, col: 1 },
        364: { row: 3, col: 2 },
        363: { row: 6, col: 1 },
        362: { row: 6, col: 5 },
        361: { row: 4, col: 9 },
        360: { row: 2, col: 4 },
        359: { row: 4, col: 4 },
        358: { row: 1, col: 7 },
        357: { row: 3, col: 4 },
        356: { row: 6, col: 3 },
        355: { row: 2, col: 2 },
        354: { row: 1, col: 3 },
        353: { row: 2, col: 4 },
        352: { row: 5, col: 8 },
        351: { row: 1, col: 8 },
        350: { row: 3, col: 2 },
        349: { row: 6, col: 1 },
        348: { row: 2, col: 1 },
        347: { row: 4, col: 2 },
        346: { row: 1, col: 3 },
        345: { row: 5, col: 6 },
        344: { row: 3, col: 5 },
        343: { row: 2, col: 2 },
        342: { row: 5, col: 5 },
        341: { row: 4, col: 9 },
        340: { row: 4, col: 2 },
        339: { row: 4, col: 6 },
        338: { row: 2, col: 9 },
        337: { row: 5, col: 9 },
        336: { row: 3, col: 4 },
        335: { row: 6, col: 2 },
        334: { row: 1, col: 4 },
        333: { row: 6, col: 3 },
        332: { row: 4, col: 5 },
        331: { row: 4, col: 2 },
        330: { row: 3, col: 7 },
        329: { row: 2, col: 7 },
        328: { row: 3, col: 2 },
        327: { row: 1, col: 6 },
        326: { row: 4, col: 9 },
        325: { row: 2, col: 2 },
        324: { row: 2, col: 3 },
        323: { row: 1, col: 4 },
        322: { row: 2, col: 8 },
        321: { row: 2, col: 9 },
        320: { row: 6, col: 6 },
        319: { row: 6, col: 7 },
        318: { row: 3, col: 7 },
        317: { row: 5, col: 4 },
        316: { row: 5, col: 2 },
        315: { row: 5, col: 2 },
        314: { row: 5, col: 7 },
        313: { row: 3, col: 8 },
        312: { row: 5, col: 9 },
        311: { row: 1, col: 4 },
        310: { row: 1, col: 7 },
        309: { row: 3, col: 8 },
        308: { row: 3, col: 5 },
        307: { row: 1, col: 8 },
        306: { row: 2, col: 2 },
        305: { row: 1, col: 7 },
        304: { row: 6, col: 2 },
        303: { row: 2, col: 8 },
        302: { row: 2, col: 1 },
        301: { row: 6, col: 9 },
        300: { row: 5, col: 5 },
        299: { row: 2, col: 9 },
        298: { row: 6, col: 4 },
        297: { row: 5, col: 9 },
        296: { row: 1, col: 2 },
        295: { row: 5, col: 7 },
        294: { row: 6, col: 7 },
        293: { row: 1, col: 2 },
        292: { row: 2, col: 2 },
        291: { row: 5, col: 1 },
        290: { row: 3, col: 1 },
        289: { row: 5, col: 9 },
        288: { row: 1, col: 3 },
        287: { row: 1, col: 7 },
        286: { row: 6, col: 6 },
        285: { row: 1, col: 7 },
        284: { row: 3, col: 7 },
        283: { row: 2, col: 5 },
        282: { row: 5, col: 5 },
        281: { row: 6, col: 3 },
        280: { row: 5, col: 3 },
        279: { row: 5, col: 6 },
        278: { row: 2, col: 7 },
        277: { row: 6, col: 4 },
        276: { row: 5, col: 1 },
        275: { row: 3, col: 2 },
        274: { row: 6, col: 6 },
        273: { row: 4, col: 8 },
        272: { row: 2, col: 5 },
        271: { row: 6, col: 9 },
        270: { row: 1, col: 1 },
        269: { row: 4, col: 3 },
        268: { row: 5, col: 5 },
        267: { row: 2, col: 3 },
        266: { row: 4, col: 7 },
        265: { row: 3, col: 2 },
        264: { row: 4, col: 1 },
        263: { row: 5, col: 6 },
        262: { row: 4, col: 8 },
        261: { row: 3, col: 1 },
        260: { row: 1, col: 3 },
        259: { row: 1, col: 9 },
        258: { row: 2, col: 6 },
        257: { row: 2, col: 6 },
        256: { row: 5, col: 5 },
        255: { row: 2, col: 7 },
        254: { row: 2, col: 3 },
        253: { row: 3, col: 7 },
        252: { row: 6, col: 4 },
        251: { row: 2, col: 2 },
        250: { row: 5, col: 7 },
        249: { row: 4, col: 1 },
        248: { row: 6, col: 4 },
        247: { row: 4, col: 3 },
        246: { row: 1, col: 4 },
        245: { row: 6, col: 9 },
        244: { row: 5, col: 2 },
        243: { row: 6, col: 2 },
        242: { row: 1, col: 6 },
        241: { row: 3, col: 5 },
        240: { row: 3, col: 5 },
        239: { row: 1, col: 5 },
        238: { row: 1, col: 6 },
        237: { row: 5, col: 6 },
        236: { row: 5, col: 9 },
        235: { row: 3, col: 5 },
        234: { row: 1, col: 2 },
        233: { row: 1, col: 4 },
        232: { row: 4, col: 5 },
        231: { row: 2, col: 1 },
        230: { row: 2, col: 6 },
        229: { row: 2, col: 3 },
        228: { row: 2, col: 9 },
        227: { row: 3, col: 2 },
        226: { row: 5, col: 4 },
        225: { row: 1, col: 9 },
        224: { row: 6, col: 5 },
        223: { row: 3, col: 8 },
        222: { row: 2, col: 2 },
        221: { row: 6, col: 6 },
        220: { row: 5, col: 9 },
        219: { row: 3, col: 9 },
        218: { row: 1, col: 2 },
        217: { row: 6, col: 2 },
        216: { row: 2, col: 3 },
        215: { row: 3, col: 7 },
        214: { row: 2, col: 6 },
        213: { row: 6, col: 9 },
        212: { row: 3, col: 7 },
        211: { row: 6, col: 7 },
        210: { row: 3, col: 1 },
        209: { row: 4, col: 2 },
        208: { row: 4, col: 9 },
        207: { row: 3, col: 9 },
        206: { row: 1, col: 1 },
        205: { row: 6, col: 1 },
        204: { row: 3, col: 2 },
        203: { row: 5, col: 7 },
        202: { row: 3, col: 1 },
        201: { row: 2, col: 3 },
        200: { row: 4, col: 2 },
        199: { row: 3, col: 1 },
        198: { row: 2, col: 1 },
        197: { row: 1, col: 2 },
        196: { row: 6, col: 5 },
        195: { row: 6, col: 6 },
        194: { row: 3, col: 3 },
        193: { row: 6, col: 3 },
        192: { row: 5, col: 6 },
        191: { row: 3, col: 9 },
        190: { row: 3, col: 4 },
        189: { row: 5, col: 8 },
        188: { row: 5, col: 5 },
        187: { row: 3, col: 5 },
        186: { row: 1, col: 4 },
        185: { row: 4, col: 9 },
        184: { row: 3, col: 6 },
        183: { row: 2, col: 2 },
        182: { row: 1, col: 9 },
        181: { row: 6, col: 9 },
        180: { row: 5, col: 4 },
        179: { row: 2, col: 3 },
        178: { row: 5, col: 8 },
        177: { row: 1, col: 2 },
        176: { row: 6, col: 9 },
        175: { row: 1, col: 7 },
        174: { row: 3, col: 3 },
        173: { row: 3, col: 8 },
        172: { row: 4, col: 3 },
        171: { row: 3, col: 7 },
        170: { row: 6, col: 1 },
        169: { row: 6, col: 6 },
        168: { row: 3, col: 9 },
        167: { row: 3, col: 3 },
        166: { row: 2, col: 3 },
        165: { row: 6, col: 8 },
        164: { row: 6, col: 6 },
        163: { row: 5, col: 3 },
        162: { row: 1, col: 5 },
        161: { row: 3, col: 7 },
        160: { row: 2, col: 3 },
        159: { row: 2, col: 8 },
        158: { row: 3, col: 2 },
        157: { row: 4, col: 6 },
        156: { row: 6, col: 4 },
        155: { row: 5, col: 4 },
        154: { row: 2, col: 5 },
        153: { row: 5, col: 6 },
        152: { row: 6, col: 9 },
        151: { row: 5, col: 2 },
        150: { row: 2, col: 7 },
        149: { row: 6, col: 5 },
        148: { row: 5, col: 9 },
        147: { row: 6, col: 2 },
        146: { row: 3, col: 2 },
        145: { row: 5, col: 2 },
        144: { row: 1, col: 3 },
        143: { row: 2, col: 2 },
        142: { row: 6, col: 5 },
        141: { row: 2, col: 4 },
        140: { row: 6, col: 7 },
        139: { row: 1, col: 7 },
        138: { row: 5, col: 1 },
        137: { row: 3, col: 9 },
        136: { row: 4, col: 1 },
        135: { row: 5, col: 5 },
        134: { row: 1, col: 3 },
        133: { row: 4, col: 1 },
        132: { row: 1, col: 9 },
        131: { row: 4, col: 7 },
        130: { row: 3, col: 9 },
        129: { row: 2, col: 4 },
        128: { row: 6, col: 7 },
        127: { row: 3, col: 1 },
        126: { row: 2, col: 1 },
        125: { row: 3, col: 1 },
        124: { row: 4, col: 1 },
        123: { row: 4, col: 3 },
        122: { row: 3, col: 5 },
        121: { row: 2, col: 9 },
        120: { row: 1, col: 3 },
        119: { row: 6, col: 5 },
        118: { row: 4, col: 3 },
        117: { row: 6, col: 9 },
        116: { row: 2, col: 8 },
        115: { row: 3, col: 4 },
        114: { row: 6, col: 4 },
        113: { row: 5, col: 9 },
        112: { row: 5, col: 6 },
        111: { row: 3, col: 4 },
        110: { row: 4, col: 1 },
        109: { row: 4, col: 1 },
        108: { row: 2, col: 1 },
        107: { row: 4, col: 9 },
        106: { row: 1, col: 5 },
        105: { row: 5, col: 4 },
        104: { row: 1, col: 2 },
        103: { row: 2, col: 8 },
        102: { row: 3, col: 6 },
        101: { row: 2, col: 2 },
        100: { row: 4, col: 8 },
        99: { row: 5, col: 9 },
        98: { row: 6, col: 2 },
        97: { row: 6, col: 7 },
        96: { row: 3, col: 2 },
        95: { row: 1, col: 2 },
        94: { row: 5, col: 2 },
        93: { row: 3, col: 6 },
        92: { row: 1, col: 5 },
        91: { row: 6, col: 4 },
        90: { row: 2, col: 2 },
        89: { row: 3, col: 2 },
        88: { row: 6, col: 3 },
        87: { row: 4, col: 5 },
        86: { row: 2, col: 2 },
        85: { row: 1, col: 9 },
        84: { row: 5, col: 8 },
        83: { row: 4, col: 4 },
        82: { row: 6, col: 7 },
        81: { row: 3, col: 4 },
        80: { row: 6, col: 4 },
        79: { row: 4, col: 2 },
        78: { row: 5, col: 7 },
        77: { row: 2, col: 9 },
        76: { row: 2, col: 3 },
        75: { row: 4, col: 7 },
        74: { row: 3, col: 5 },
        73: { row: 6, col: 9 },
        72: { row: 5, col: 7 },
        71: { row: 6, col: 3 },
        70: { row: 3, col: 7 },
        69: { row: 1, col: 4 },
        68: { row: 4, col: 8 },
        67: { row: 4, col: 1 },
        66: { row: 1, col: 8 },
        65: { row: 3, col: 4 },
        64: { row: 5, col: 6 },
        63: { row: 5, col: 5 },
        62: { row: 1, col: 2 },
        61: { row: 5, col: 1 },
        60: { row: 5, col: 5 },
        59: { row: 2, col: 8 },
        58: { row: 5, col: 9 },
        57: { row: 5, col: 5 },
        56: { row: 6, col: 1 },
        55: { row: 1, col: 3 },
        54: { row: 4, col: 5 },
        53: { row: 6, col: 8 },
        52: { row: 2, col: 1 },
        51: { row: 5, col: 6 },
        50: { row: 3, col: 2 },
        49: { row: 4, col: 7 },
        48: { row: 1, col: 7 },
        47: { row: 4, col: 1 },
        46: { row: 2, col: 2 },
        45: { row: 6, col: 1 },
        44: { row: 6, col: 2 },
        43: { row: 5, col: 6 },
        42: { row: 6, col: 9 },
        41: { row: 1, col: 3 },
        40: { row: 5, col: 6 },
        39: { row: 5, col: 5 },
        38: { row: 6, col: 6 },
        37: { row: 6, col: 9 },
        36: { row: 3, col: 9 },
        35: { row: 4, col: 1 },
        34: { row: 6, col: 2 },
        33: { row: 2, col: 7 },
        32: { row: 4, col: 7 },
        31: { row: 4, col: 4 },
        30: { row: 1, col: 5 },
        29: { row: 2, col: 1 },
        28: { row: 4, col: 5 },
        27: { row: 6, col: 9 },
        26: { row: 4, col: 1 },
        25: { row: 2, col: 6 },
        24: { row: 3, col: 6 },
        23: { row: 2, col: 8 },
        22: { row: 6, col: 1 },
        21: { row: 3, col: 8 },
        20: { row: 2, col: 3 },
        19: { row: 6, col: 6 },
        18: { row: 4, col: 7 },
        17: { row: 2, col: 9 },
        16: { row: 4, col: 4 },
        15: { row: 1, col: 3 },
        14: { row: 4, col: 3 },
        13: { row: 1, col: 7 },
        12: { row: 2, col: 6 },
        11: { row: 1, col: 4 },
        10: { row: 4, col: 7 },
        9: { row: 5, col: 7 },
        8: { row: 4, col: 9 },
        7: { row: 3, col: 6 },
        6: { row: 1, col: 1 },
        5: { row: 3, col: 3 },
        4: { row: 6, col: 2 },
        3: { row: 6, col: 4 },
        2: { row: 2, col: 2 },
        1: { row: 1, col: 1 }
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




