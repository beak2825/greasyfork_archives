// ==UserScript==
// @name         Rsload net Emerald Twilight Theme
// @name:ru      Rsload net Тема Изумрудные Сумерки
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  A dark green theme with orange accents and a gradient background (dark purple to dark blue) for rsload.net
// @description:ru Тёмно-зелёная тема с оранжевыми акцентами и градиентным фоном (от тёмно-фиолетового к тёмно-голубому) для rsload.net
// @author       Gullampis810
// @license      MIT
// @match        https://rsload.net/*
// @icon         https://github.com/sopernik566/icons/blob/main/rsloadiCon.png?raw=true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530936/Rsload%20net%20Emerald%20Twilight%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/530936/Rsload%20net%20Emerald%20Twilight%20Theme.meta.js
// ==/UserScript==



(function() {
    'use strict';

    GM_addStyle(`
        /* Стили для общего текста */
        * {
            color: #E0E0E0 !important;
        }

        .comm-info a {
            color: #C2185B !important;
            font-weight: bold;
            box-shadow: 1px 3px 8px 0px rgba(0, 0, 0, 0.79);
        }

        .ac-inputs input {
            width: 49%;
            background: #353535;
            color: #E0E0E0;
        }

        .search-page {
            background-color: #3A3A3A;
            border-radius: 4px;
            box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.38);
        }

        ::selection {
            background-color: #C2185B;
        }

        #fullsearch:not(.fullsearch) #searchinput {
            width: 100%;
            display: block;
            max-width: 600px;
            margin: 0 0 7px 0;
            border-radius: 4px;
            box-shadow: inset 0 2px 6px 2px rgba(0, 0, 0, 0.38);
            background-color: #353535;
        }

        .sres-wrap {
            background-color: #3A3A3A;
            border: 1px solid #C2185B;
        }

        /* поисковая строка */
        .search-inner input, .search-inner input:focus {
            background-color: #353535;
        }

        /* шапка градиента */
        .header-in {
            padding: 0 10px;
            background-color: #3A3A3A;
        }

        .cols {
            background-color: #2E2E2E;
        }

        .short {
            margin-bottom: 20px;
            background-color: #3A3A3A;
        }

        .side-bc {
            background-color: #3A3A3A;
        }

        .lb-user {
            margin: -20px -20px 20px -20px;
            padding: 20px;
            background-color: #3A3A3A;
            display: flex;
            flex-flow: row wrap;
            justify-content: left;
            align-items: center;
        }

        .bb-editor textarea {
            background-color: #424242;
        }

        .comm-two {
            background-color: #353535;
            border: 1px solid #C2185B;
            box-shadow: 0px 13px 9px 0px rgba(0, 0, 0, 0.79);
        }

        .comm-item {
            border-bottom: 1px solid #AD1457;
        }

        #gotop {
            position: fixed;
            width: 40px;
            height: 40px;
            line-height: 36px;
            right: 10px;
            bottom: 10px;
            cursor: pointer;
            font-size: 20px;
            z-index: 9998;
            display: none;
            opacity: 0.7;
            background-color: #C2185B;
            color: #fff;
            border-radius: 50%;
            text-align: center;
        }

        .comments-tree-list > .comments-tree-item > .comments-tree-list {
            padding: 20px 20px 20px 40px;
            margin: 0 -20px 20px -20px;
            background-color: #3A3A3A;
            box-shadow: inset 0 25px 20px -20px rgba(0, 0, 0, 0.15), inset 0 -25px 20px -20px rgba(0, 0, 0, 0.15);
        }

        .dle-comments-navigation .pagi-nav {
            background-color: #424242;
        }

        .quote {
            background-color: #353535;
        }

        .title_quote {
            background: #3A3A3A;
        }

        .comm-rate2 a {
            display: block;
            background-color: #C2185B;
        }

        .bb-pane {
            height: 1%;
            overflow: hidden;
            padding: 0 0 5px 5px;
            margin: 0;
            height: auto !important;
            text-decoration: none;
            background: linear-gradient(to bottom, #C2185B 0%, #2E2E2E 100%);
            border-radius: 0px;
            border: 1px solid #E91E63;
            box-shadow: none !important;
        }

        .lb-menu a {
            background-color: #2E2E2E;
            border-bottom: 1px solid #C2185B;
            position: relative;
            width: 198px;
            right: 18px;
        }

        .side-top a:hover {
            background-color: #E91E63;
        }

        .side-top a {
            border-bottom: 1px solid #C2185B;
        }

        .lcomm:hover {
            background-color: #353535;
            box-shadow: inset 0 0 7px 1px rgba(0, 0, 0, 0.65);
        }

        .lcomm {
            border-bottom: 1px solid #AD1457;
        }

        .lc-popup {
            background-color: #3A3A3A;
            border: 2px solid #C2185B;
            box-shadow: 30px 30px 55px 16px rgba(0, 0, 0, 0.79);
        }

        .bb-pane>b {
            background: #424242;
            border-radius: 5px;
            width: 40px;
            height: 25px;
            border: 2px solid #C2185B;
        }

        .bb-btn:active {
            background: #353535;
            border-color: #E91E63;
            box-shadow: 0 0 5px #000000 inset;
        }

        .bb-btn:hover {
            background: linear-gradient(to bottom, #E91E63 0%, #C2185B 100%);
            border: 2px solid #E91E63;
        }

        .scriptcode, .title_spoiler, .text_spoiler {
            background: #353535;
            border: 1px solid #C2185B;
        }

        .side-top a:hover, .lforum a:hover, .speedbar a:hover {
            background-color: #424242;
        }

        .lb-menu a:hover, .lb-menu a:hover .fa {
            background-color: #C2185B;
        }

        .up-second {
            background-color: #3A3A3A;
        }

        .up-third {
            border-bottom: 1px solid #C2185B;
            border-top: 1px solid #E91E63;
            box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.2);
            background: #3A3A3A;
        }

        .user-prof {
            border: 1px solid #C2185B;
            background-color: #3A3A3A;
        }

        .up-third li:nth-child(2n) {
            background-color: #353535;
        }

        .up-first {
            background-color: #2E2E2E;
        }

        .button, .pagi-load a, .up-second li a, .up-edit a, .qq-upload-button, button:not(.color-btn), html input[type="button"], input[type="reset"], input[type="submit"] {
            background: linear-gradient(171deg, #C2185B 0%, #2E2E2E 100%);
        }

        .button:hover, .up-second li a:hover, .up-edit a:hover, .qq-upload-button:hover, button:not(.color-btn):hover, html input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover {
            background: linear-gradient(to top, #E91E63 0%, #C2185B 100%);
        }

        .header:before, .side-bt, .short-top, .comm-one {
            background: linear-gradient(to bottom, #3A3A3A 0%, #C2185B 100%);
        }

        .header-menu > li > a:hover, .header-menu .menuactive > a, .hidden-menu a:hover {
            background-color: #424242;
            border-radius: 15px;
        }

        .hidden-menu {
            background-color: #3A3A3A;
            box-shadow: 3px 20px 20px 9px rgba(0, 0, 0, 0.61);
            border-radius: 15px;
        }

        .hidden-menu a {
            display: block;
            padding: 10px 20px;
            font-weight: 700;
            border: 2px solid transparent;
        }

        .pagi-nav > span {
            display: inline-block;
            background: #424242;
            border-radius: 5px;
        }

        .decor, .side-box, .short, .pm-page, .search-page, .static-page, .tags-page, .form-wrap {
            background-color: #3A3A3A;
            border-radius: 4px;
            box-shadow: 0 28px 20px 0px rgba(0, 0, 0, 0.29);
        }

        .fa-search:before {
            color: #C2185B;
        }
    `);
})();




// загрузка скачивание описание


(function() {
    'use strict';

    GM_addStyle(`
        /* Контейнер блока загрузки */
        div[style*="background-color: #f8f9fa"] {
            background-color: #3A3A3A !important;
            border: 1px solid #C2185B !important;
            border-radius: 10px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
        }

        /* Заголовок h3 */
        h3[style*="color: #2c3e50"] {
            color: #E0E0E0 !important;
            margin-top: 0 !important;
            border-bottom: 2px solid #C2185B !important;
            padding-bottom: 10px !important;
        }

        /* Основная ссылка */
        a[style*="background-color: #0078d7"] {
            text-decoration: none !important;
            color: #E0E0E0 !important;
            background-color: #C2185B !important;
            padding: 10px 15px !important;
            border-radius: 6px !important;
            font-weight: bold !important;
            display: inline-flex !important;
            align-items: center !important;
        }

        /* Текст "Дополнительные зеркала" */
        p[style*="color: #555"] {
            margin-bottom: 15px !important;
            color: #E0E0E0 !important;
        }

        /* Все ссылки зеркал */
        a[style*="padding: 8px 12px"] {
            text-decoration: none !important;
            color: #E0E0E0 !important;
            background-color: #C2185B !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            display: inline-flex !important;
            align-items: center !important;
        }

        /* Нижний текст с подсказкой */
        p[style*="color: #777"] {
            margin-top: 15px !important;
            color: #A0A0A0 !important;
            font-size: 13px !important;
        }

        /* Hover эффект для всех ссылок */
        a[style*="background-color"]:hover {
            background-color: #E91E63 !important;
        }

         /* Ячейки с белым фоном #f9f9f9 */
        td[style*="background-color: #f9f9f9"] {
            background-color: #3A3A3A !important;
            border-bottom: 1px solid #C2185B !important;
            padding: 12px 16px !important;
            color: #E0E0E0 !important;
        }

        /* Ячейки без фона */
        td[style*="padding: 12px 16px; border-bottom"] {
            background-color: #353535 !important;
            border-bottom: 1px solid #C2185B !important;
            padding: 12px 16px !important;
            color: #E0E0E0 !important;
        }

        /* Ячейка без нижней границы */
        td[style*="padding: 12px 16px; background-color: #f9f9f9"] {
            background-color: #3A3A3A !important;
            padding: 12px 16px !important;
            color: #E0E0E0 !important;
        }

        /* Переопределение всех цветов текста */
        td[style*="color: #16a34a"],
        td[style*="color: #2563eb"],
        td[style*="color: #dc2626"] {
            color: #E0E0E0 !important;
        }


        /* Список с белым фоном и серой границей */
        ul[style*="background-color: #f5f5f5"] {
            border: 2px solid #C2185B !important;
            background-color: #3A3A3A !important;
            padding: 15px 40px 15px 40px !important;
            border-radius: 8px !important;
        }

        /* Элементы списка */
        ul[style*="background-color: #f5f5f5"] li {
            color: #E0E0E0 !important;
        }

        /* Hover эффект для элементов списка */
        ul[style*="background-color: #f5f5f5"] li:hover {
            background-color: #424242 !important;
            border-radius: 4px !important;
        }
    `);
})();





// password inputs login

(function() {
    'use strict';

    GM_addStyle(`
        /* Внешний контейнер */
        .side-bc {
            background-color: #3A3A3A !important;
        }

        /* Блок авторизации */
        #login-box.login-box {
            background-color: #3A3A3A !important;
            border: 2px solid #C2185B !important;
            border-radius: 8px !important;
            padding: 15px !important;
        }

        /* Переопределение стилей для всех инпутов внутри .login-box */
        .login-box input[type="text"],
        .login-box input[type="password"] {
            background-color: #424242 !important;
            color: #E0E0E0 !important;
            border: 2px solid #C2185B !important;
            border-radius: 6px !important;
            padding: 8px !important;
            width: 100% !important;
            margin-bottom: 10px !important;
            box-sizing: border-box !important;
            display: block !important;
        }

        /* Перехват autofill стилей */
        .login-box input[type="text"]:-webkit-autofill,
        .login-box input[type="password"]:-webkit-autofill,
        .login-box input[type="text"]:-webkit-autofill:hover,
        .login-box input[type="password"]:-webkit-autofill:hover,
        .login-box input[type="text"]:-webkit-autofill:focus,
        .login-box input[type="password"]:-webkit-autofill:focus,
        .login-box input[type="text"]:-internal-autofill-selected,
        .login-box input[type="password"]:-internal-autofill-selected {
            -webkit-box-shadow: 0 0 0 1000px #424242 inset !important;
            background-color: #424242 !important;
            background-image: none !important;
            color: #E0E0E0 !important;
            border: 2px solid #C2185B !important;
            -webkit-text-fill-color: #E0E0E0 !important;
        }

        /* Плейсхолдеры */
        .login-box input[type="text"]::placeholder,
        .login-box input[type="password"]::placeholder {
            color: #A0A0A0 !important;
            opacity: 1 !important;
        }

        /* Hover для инпутов */
        .login-box input[type="text"]:hover,
        .login-box input[type="password"]:hover {
            background-color: #4A4A4A !important;
            border-color: #E91E63 !important;
        }

        /* Focus для инпутов */
        .login-box input[type="text"]:focus,
        .login-box input[type="password"]:focus {
            background-color: #4A4A4A !important;
            border-color: #E91E63 !important;
            box-shadow: 0 0 5px #C2185B !important;
            outline: none !important;
        }

        /* Кнопка входа */
        .login-box button[type="submit"] {
            background-color: #C2185B !important;
            color: #E0E0E0 !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 10px !important;
            width: 100% !important;
            cursor: pointer !important;
            transition: background-color 0.3s ease !important;
            display: block !important;
        }

        /* Hover для кнопки */
        .login-box button[type="submit"]:hover {
            background-color: #E91E63 !important;
        }

        /* Чекбокс и текст */
        .login-box .lb-check {
            margin-top: 10px !important;
            color: #E0E0E0 !important;
        }

        .login-box .lb-check input[type="checkbox"] {
            margin-right: 5px !important;
        }

        .login-box .lb-check label {
            color: #E0E0E0 !important;
        }

        /* Ссылки */
        .login-box .lb-lnk {
            margin-top: 10px !important;
        }

        .login-box .lb-lnk a {
            color: #C2185B !important;
            text-decoration: none !important;
        }

        .login-box .lb-lnk a:hover {
            color: #E91E63 !important;
            text-decoration: underline !important;
        }

        .login-box .lb-lnk .log-register {
            margin-left: 10px !important;
        }
    `);
})();
