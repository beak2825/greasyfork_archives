// ==UserScript==
// @name    RuTracker - Dark Themes Switcher
// @name:ru    RuTracker - Переключатель тёмных тем
// @namespace    https://greasyfork.org/ru/users/1419429
// @version    30
// @description    Dark theme for Rutracker with switch button and color themes menu
// @description:ru    Тёмная тема для Rutracker с кнопкой переключения и меню цветовых схем
// @author    xyzzy1388
// @license    MIT
// @match    https://rutracker.org/*
// @include    https://rutracker.*/*
// @exclude    https://rutracker.wiki/*
// @icon    https://rutracker.org/favicon.ico
// @run-at    document-start
// @downloadURL https://update.greasyfork.org/scripts/522796/RuTracker%20-%20Dark%20Themes%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/522796/RuTracker%20-%20Dark%20Themes%20Switcher.meta.js
// ==/UserScript==

// За основу взят скрипт от apkx (ver 0.92)
// https://userstyles.world/style/9940/rutracker-dark
// Адаптировал для Tampermonkey и проверил в Chrome/Firefox
// Добавил кнопку внизу справа для вкл/выкл тёмной темы и меню цветовых схем при нажатии правой кнопки мыши
// Исправление множества косяков с элементами и замена цветов
// Добавил комментарии
// P.S. Вы можете добавить свои цветовые схемы. В начале скрипта есть закомментированный шаблон. Именем схемы служит первая строка в шаблоне.
// Для подбора кодов цветов удобно использовать, например, ColorMania

// Based on the script from apkx (ver 0.92)
// https://userstyles.world/style/9940/rutracker-dark
// Adapted for Tampermonkey and tested in Chrome/Firefox
// Added a button at the bottom right to turn on/off the dark theme and a menu of color schemes when you right-click
// Fixes for many bugs with elements and replacing colors
// Added comments
// P.S. You can add your own color schemes. There is a commented template at the beginning of the script. The name of the scheme is the first line in the template.
// For selecting color codes, it is convenient to use, for example, ColorMania

(function() {
    'use strict';

    const imageBrightness = 0.9; // от 0 до 1, яркость картинок
    const imageOpacity = 0.7; // от 0 до 1, прозрачность картинок
    const imageInvert = 1; // 0 или 1, инвертирование некоторых мелких изображений
    const borderWidth = '1px'; // 1px, ширина в пикселях линий границ

    // Цветовые схемы
    let colorSchemes = {
        // Шаблон цветовой схемы, коды цветов в формате HTML Hex
        /* yourColorName: { // имя схемы без пробелов
            mainBG: '#24221A', // основной фон
            textColor: '#8F8B7F', // текст
            headerColor: '#E8D9B3', // заголовки текст
            cellBG1: '#252713', // фон ячейки 1
            cellBG2: '#282413', // фон ячейки 2
            mainText: '#B9B4A5', // основной текст
            linkHoverText: '#9F7E4C', // текст ссылки при наведении курсора
            overlayColor: 'rgba(90,90,99,0.25)', // наложение
            hoverText: '#5E5D34', // текст при наведении курсора
            messageBG: '#38321B', // фон, чередование сообщений
            borderColor: '#3F3F3F', // цвет линий, цвет полосы прокрутки
            additionalColor: '#60602B', // дополнительный цвет
            tagBG: '#5B1E00', // фон метки тем
            loginColor: '#FFA73A', // цвет логина, цвет ползунка прокрутки
        }, */
        darkBrown: {
            mainBG: '#1C1C1C', textColor: '#D0D0D0', headerColor: '#B0B0B0', cellBG1: '#2A2A2A', cellBG2: '#3A3A3A', mainText: '#C0C0C0', linkHoverText: '#B29475', overlayColor: 'rgba(90,90,90,0.25)', hoverText: '#8C8C8C', messageBG: '#2F2F2F', borderColor: '#4A4A4A', additionalColor: '#7D7D7D', tagBG: '#CC563C', loginColor: '#CE8415',
        },
        darkOlive: {
            mainBG: '#2A2A1D', textColor: '#B5B28D', headerColor: '#D1CFA1', cellBG1: '#25271B', cellBG2: '#353B24', mainText: '#C1BFA8', linkHoverText: '#A68A4D', overlayColor: 'rgba(90,90,90,0.25)', hoverText: '#6B6C3A', messageBG: '#252210', borderColor: '#41442F', additionalColor: '#8A8D3D', tagBG: '#D76D00', loginColor: '#7C9815',
        },
        darkGrayBlue: {
            mainBG: '#292E3A', textColor: '#DCE2E4', headerColor: '#E8D9B3', cellBG1: '#363D4B', cellBG2: '#4F586D', mainText: '#CCD3DD', linkHoverText: '#69A6E8', overlayColor: 'rgba(90,90,99,0.25)', hoverText: '#434C5E', messageBG: '#41495A', borderColor: '#59657C', additionalColor: '#B2D992', tagBG: '#FF5500', loginColor: '#E18E13',
        },
        darkPurple: {
            mainBG: '#291F2C', textColor: '#F2D3D9', headerColor: '#F4C0D5', cellBG1: '#3B2C3F', cellBG2: '#4E3B4F', mainText: '#E1B2C5', linkHoverText: '#E15B91', overlayColor: 'rgba(70,70,80,0.25)', hoverText: '#A65B7D', messageBG: '#502E59', borderColor: '#614767', additionalColor: '#C49BB1', tagBG: '#D85C6D', loginColor: '#CE826F',
        },
        darkRed: {
            mainBG: '#2A1D1D', textColor: '#B28D8D', headerColor: '#CFA1A1', cellBG1: '#2F1F1F', cellBG2: '#3B2424', mainText: '#BF8A8A', linkHoverText: '#D04949', overlayColor: 'rgba(70,70,80,0.25)', hoverText: '#6C3A3A', messageBG: '#521919', borderColor: '#654343', additionalColor: '#8D3D3D', tagBG: '#A00000', loginColor: '#CE826F',
        },
    };

    // Текст кнопки переключения тем, Unicode эмоции
    // Примеры: 🌑🌕 | 🌒🌔 | 🌚🌝
    const lightTheme = '🌝';
    const darkTheme = '🌚';

    // Функция для безопасной работы с localStorage
    function getStorageItem(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            return defaultValue;
        }
    }

    function setStorageItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    // Проверяем состояние темы и схемы из localStorage
    let isDarkTheme = getStorageItem('isDarkTheme', false);
    let currentColorScheme = getStorageItem('currentColorScheme', colorSchemes.darkBrown);
    
    // Если currentColorScheme - строка (имя схемы), получаем объект схемы
    if (typeof currentColorScheme === 'string') {
        currentColorScheme = colorSchemes[currentColorScheme] || colorSchemes.darkBrown;
    }

    // Названия пунктов меню выбора цветовых схем
    const menuColorSchemes = Object.keys(colorSchemes).map(key => ({ value: key }));

    // Функция для применения цветовой схемы
    function applyColorScheme(scheme) {
        currentColorScheme = colorSchemes[scheme]; // Обновляем текущую цветовую схему
        setStorageItem('currentColorScheme', scheme); // Сохраняем имя
        removeDarkThemeStyles(); // Удаляем предыдущие стили
        addThemeStyles(); // Применяем новые стили
    }

    // Функция для удаления темной темы
    function removeDarkThemeStyles() {
        const styleElement = document.getElementById('customThemeStyles');
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }

    // Создание кнопки вкл/выкл темной темы
    function createButton() {
        if (document.getElementById('theme-toggle-button')) {
            return; // Если кнопка уже существует, ничего не делаем
        }

        const button = document.createElement('button');
        button.id = 'theme-toggle-button';
        button.innerText = isDarkTheme ? `${lightTheme}` : `${darkTheme}`;
        button.style.position = 'fixed';
        button.style.bottom = '1rem'; // 10px
        button.style.right = '1rem'; // 10px
        button.style.zIndex = '2000';
        button.style.cursor = 'pointer';
        button.style.fontSize = '3rem'; // 32px
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.padding = '0';
        button.style.margin = '0';
        button.style.opacity = '0.25';

        button.addEventListener('mouseenter', () => {
            button.style.opacity = '0.9';
        });

        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.25';
        });

        // Добавляем обработчик для правого клика
        button.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Предотвращаем стандартное контекстное меню
            showContextMenu(button);
        });

        document.body.appendChild(button);

        // Переключение темы при нажатии на иконку
        button.addEventListener('click', () => {
            if (isDarkTheme) {
                removeDarkThemeStyles();
                button.innerText = `${darkTheme}`;
            } else {
                addThemeStyles();
                button.innerText = `${lightTheme}`;
            }
            isDarkTheme = !isDarkTheme;
            setStorageItem('isDarkTheme', isDarkTheme); // Сохраняем состояние темы
        });
    }

    // Функция для отображения контекстного меню
    function showContextMenu(button) {
        let contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) {
            contextMenu = document.createElement('div');
            contextMenu.id = 'contextMenu';
            contextMenu.style.position = 'fixed';
            contextMenu.style.color = 'black';
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '3px dashed black';
            contextMenu.style.zIndex = '2001';
            contextMenu.style.cursor = 'default';
            contextMenu.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)';
            contextMenu.style.display = 'block';
            contextMenu.style.right = '10px';
            contextMenu.style.bottom = `${button.offsetHeight + 15}px`;

            // Создание списка элементов меню
            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.margin = '0';
            ul.style.padding = '0';

            // Добавляем элементы для каждой цветовой схемы
            menuColorSchemes.forEach(scheme => {
                const li = document.createElement('li');
                li.style.padding = '8px';
                li.style.cursor = 'pointer';
                li.innerText = scheme.value;
                li.style.fontWeight = 'bold';
                li.style.textDecoration = 'underline';
                li.style.fontSize = '1rem';

                // Выделяем текущую цветовую схему
                const isCurrent = colorSchemes[scheme.value] === currentColorScheme || 
                                  JSON.stringify(colorSchemes[scheme.value]) === JSON.stringify(currentColorScheme);

                if (isCurrent) {
                    li.style.color = currentColorScheme.headerColor;
                    li.style.backgroundColor = currentColorScheme.cellBG2;
                }

                li.addEventListener('mouseover', () => {
                    li.style.color = 'white';
                    li.style.backgroundColor = 'black';
                });

                li.addEventListener('mouseout', () => {
                    if (!isCurrent) {
                        li.style.color = 'inherit';
                        li.style.backgroundColor = 'inherit';
                    } else {
                        li.style.color = currentColorScheme.headerColor;
                        li.style.backgroundColor = currentColorScheme.cellBG2;
                    }
                });

                // Добавляем обработчик клика
                li.addEventListener('click', () => {
                    applyColorScheme(scheme.value);
                    contextMenu.style.display = 'none'; // Скрыть меню после выбора
                });

                ul.appendChild(li);
            });

            contextMenu.appendChild(ul);
            document.body.appendChild(contextMenu);

            // Скрываем меню при клике вне его
            document.addEventListener('click', () => {
                contextMenu.style.display = 'none';
                document.body.removeChild(contextMenu);
            }, { once: true });
        } else {
            contextMenu.style.display = 'block';
            contextMenu.style.right = '10px';
            contextMenu.style.bottom = `${button.offsetHeight + 15}px`;
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (document.body) {
                    createButton();
                    if (isDarkTheme) {
                        addThemeStyles();
                    }
                    observer.disconnect();
                }
            }
        }
    });

    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document,{ childList: true,subtree: true });

    // Функция для добавления стилей цветовой схемы
    function addThemeStyles() {
        const styleId = 'customThemeStyles';
        if (!document.getElementById(styleId)) {
            const styles = `

/* Стили для полосы прокрутки */

                html {
                    scrollbar-width: auto; /* ширина полосы прокрутки (thin, auto, none) */
                    scrollbar-color: ${currentColorScheme.loginColor} ${currentColorScheme.borderColor}; /* Цвет ползунка и цвет области */
                }
                ::-webkit-scrollbar-thumb, /* Цвет ползунка */
                ::-webkit-scrollbar-thumb:hover { /* Цвет ползунка при наведении */
                    background-color: ${currentColorScheme.loginColor} !important;
                }
                ::-webkit-scrollbar-track, /* Цвет области полосы прокрутки */
                ::-webkit-scrollbar-track:hover { /* Цвет области при наведении */
                    background: ${currentColorScheme.borderColor} !important;
                }

/* Стили для текста */

                * { /* удаление тени текста, чтобы текст не двоился */
                    text-shadow: none !important;
                }
                
                #logged-in-username { /* цвет логина вверху страницы */
                    color: ${currentColorScheme.loginColor} !important;
                }

                .forum-desc-in-title {
                    color: #E8B6AD;
                }

                .post-b,
                .torTopic,
                a.torTopic {
                    color: #CFC9BD !important;
                }

                .a-like.med {
                    color: ${currentColorScheme.mainText} !important;
                }

                #categories-wrap .idx-row a.gen.bold span,
                #fs--1,
                #page_container,
                .c-head,
                .code-label,
                .forumlink a[href*="viewforum.php?f=1649"],
                .gen,
                .gensmall,
                .inline-block,
                .med,
                .new .dot-sf,
                .news_date,
                .news_title,
                .poster_info em,
                .q,
                .q-head span,
                .q-head,
                .row1 td,
                .row1,
                .sb2-block,
                .site-nav,
                .small,
                .sp-body,
                .sp-head span,
                .topmenu,
                .txtb,
                ::marker,
                body,
                div.t-tags span,
                input,
                legend,
                optgroup option,
                select,
                span.brackets-pair,
                span.p-color,
                textarea {
                    color: ${currentColorScheme.textColor} !important;
                }

                #idx-sidebar2 h3,
                #latest_news h3,
                #sidebar1 h3,
                #thx-list b,
                .catTitle,
                .cat_title a,
                .forumline th,
                .maintitle,
                .pagetitle,
                .posted_since,
                .poster_info p,
                .topmenu option,
                a.tLink,
                a:hover .brackets-pair,
                optgroup,
                td.topicSep {
                    color: ${currentColorScheme.headerColor} !important;
                }

                #latest_news a,
                #thx-list i,
                .a-like,
                .nick a,
                .nick,
                .nick-author a,
                .nick-author,
                a,
                ul.a-like-items > li {
                    color: ${currentColorScheme.mainText} !important;
                }

                #latest_news a:hover,
                .a-like:hover,
                .site-nav a:active,
                .site-nav a:hover,
                a:active,
                a:focus,
                a:hover {
                    color: ${currentColorScheme.linkHoverText} !important;
                }

                #timezone,
                .dot-sf,
                .ext-group-1,.ext-group-2,
                .f-bysize i,
                .forum_desc,
                .med b,
                .prof-tbl h6,
                .subforums .p-ext-link b,
                .subforums .p-ext-link span,
                .topicAuthor,
                .topicPoll,
                .tor-dup,
                /* .torTopic, */
                a[href="viewtopic.php?t=2965837"] b,
                li.dir>div s,
                li.file>div s,
                .post-b,
                .top-alert a,
                .vf-col-replies .med {
                    color: inherit !important;
                }

/* Стили для фона */

                #body_container,
                #nav-opt-menu,
                #page_container,
                .bg-gradient-gray,
                .menu-a,
                .news_title,
                .ped-editor-buttons option:not(:first-of-type),
                .print-mode *,
                .q,
                .site-nav,
                .sp-body,
                body,
                input,
                optgroup option,
                select,
                td.cat.pad_2,
                textarea {
                    background-color: ${currentColorScheme.mainBG} !important;
                    background-image: none;
                }

                #ajax-loading,
                #nav-panel,
                .menu-a a,
                .menu-a a:hover,
                .menu-sub table td,
                .news_date,
                .row1 td,
                .row1,
                .row4 td,
                .row4,
                .row5 td,
                .row5,
                .sb2-block,
                .sp-wrap,
                .topmenu,
                optgroup,
                table.forumline {
                    background-color: ${currentColorScheme.cellBG1} !important;
                    background-image: none;
                }

                #nav-opt-menu > li:hover,
                #search-wrapper,
                .bordered th,
                .cat,
                .cat_title,
                .forumline th,
                .row3 td,
                .row3,
                .spaceRow,
                div.nav-btn:hover,
                div.t-tags span,
                div.topic-detail > div,
                input[type=submit],
                option:hover,
                td.cat,
                td.catBottom,
                td.catHead,
                td.catTitle,
                tr.hl-tr:hover td,
                .ta-inf2 {
                    background-color: ${currentColorScheme.cellBG2} !important;
                    background-image: none;
                }

                #fs--1,
                #traf-stats-tbl,
                .code-label,
                .hl-selected-row,.hl-selected-row td,
                .menu-sub table th,
                .row2 td,
                .row2 {
                    background-color: ${currentColorScheme.messageBG} !important;
                }

                .c-body {
                    color: inherit !important;
                    background: transparent !important;
                }

                .pm-row {
                    background: inherit !important;
                }

/* Стили для границ */

                #fs-main,
                #nav-opt-menu,
                #nav-panel,
                #search-wrapper,
                #tor-tbl td,
                #traf-stats-tbl,
                .border,
                .bordered td,
                .bordered th,
                .c-body,
                .cat_title,
                .forumline td,
                .forumline th,
                .forums td.row1,
                .menu-a,
                .menu-sub table,
                .news_date,
                .post_btn_2,
                .post_head,
                .q,
                .sb2-block,
                .signature::before,
                .sp-body,
                .sp-head,
                .sp-wrap,
                .topic .td1,
                .topic .td2,
                .topic .td3,
                .topmenu,
                div.topic-detail > div,
                fieldset,
                hr,
                input,
                select,
                table.bordered,
                table.borderless .bordered td,
                table.borderless .bordered th,
                table.error,
                table.error .msg,
                table.forumline,
                table.topic,
                textarea,
                .ta-inf2 {
                    border-color: ${currentColorScheme.borderColor} !important;
                    border-width: ${borderWidth} !important;
                }

                div.t-tags span,
                div.t-tags span:hover {
                    border-color: ${currentColorScheme.overlayColor} !important;
                }

                option {
                    border-color: ${currentColorScheme.cellBG1} !important;
                }

                .gr-button {
                    background-color: ${currentColorScheme.cellBG2} !important;
                    background-image: none !important;
                    border-color: ${currentColorScheme.borderColor} !important;
                }

                .gr-button:hover {
                    background-color: ${currentColorScheme.messageBG} !important;
                }

/* Стили для кнопок */

                input[type=submit]:hover {
                    background-color: ${currentColorScheme.overlayColor} !important;
                }

                input[type=submit]:active {
                    background-color: ${currentColorScheme.hoverText} !important;
                }

                .post-box {
                    border: none !important;
                    background: ${currentColorScheme.cellBG2} !important;
                }

                .ped-editor-buttons .buttons-row input[type=button] {
                    text-shadow: none;
                    background: 0 0;
                    box-shadow: none;
                }

                /* размер кнопки Поиск и Спасибо */
                #thx-btn,
                #tr-submit-btn,
                #search-content input[type=submit],
                input.long {
                    width: 200px !important;
                    height: 30px;
                }

                #search-submit { /* размер кнопки Поиск в строке с логином*/
                    width: 130px !important;
                }

                .ped-buttons-row {
                    line-height: unset !important;
                }

                .ped-buttons-row input[type=button] {
                    background: ${currentColorScheme.cellBG2};
                }

                .ped-buttons-row input[type=button]:active {
                    background: linear-gradient(#0d0d0d 0%,#0d0d0d 100%);
                }

                .ped-editor select {
                    background: ${currentColorScheme.cellBG2};
                }

/* Стили для ссылок */

                /* a.tLink:hover,
                a.topictitle:hover,
                a.torTopic:hover {
                    text-decoration: none !important;
                } */

                a.postLink {
                    color: ${currentColorScheme.additionalColor} !important;
                }

                .highlight-cyrillic:hover,
                .highlight-cyrillic:hover > .cyrillic-char {
                    color: ${currentColorScheme.linkHoverText} !important;
                    /* text-decoration: none !important; */
                }

                .cat_title a:hover {
                    background: ${currentColorScheme.cellBG1};
                    color: ${currentColorScheme.linkHoverText} !important;
                }

/* Стили для изображений */

                /* яркость и прозрачность изображений */
                #smilies,
                .avatar img,
                .postLink .postImg,
                .poster-flag,
                .user-rank,
                img.icon1,
                img.postImg,
                img.smile,
                img.tor-icon,
                img[alt="avatar"],
                img[alt="magnet"],
                img[alt="Скачать .torrent"] {
                    filter: brightness(${imageBrightness}) !important;
                    opacity: ${imageOpacity} !important;
                }

                /* инверсия изображений */
                .menu-split .menu-root img,
                .nav-icon,
                .pad_2.hide-for-print img,
                img.forum_icon,
                img.log-out-icon,
                img.pm_box_icon,
                img.topic_icon,
                img[alt="#"],
                img[alt="new"],
                img[alt="Новая тема"],
                img[alt="Ответить"],
                img[alt="Тема закрыта"],
                input[type="checkbox"],
                input[type="radio"],
                li.dir > div:before {
                    filter: invert(${imageInvert});
                }

/* Стили для скрытия элементов */

                #adriver-240x120,
                #bn-bot-wrap,
                #bn-idx-3,
                #bn-idx-marathonbet,
                #cse-search-btn-top,
                #idx-sidebar2 iframe,
                #logo, /* логотип */
                .bn-idx,
                .internal-promo-text-top,
                .thHead,
                table.w100 iframe,
                td.bn-topic {
                    display: none;
                }

/* Прочие стили */

                .dlComplete,
                .seed,
                .seedmed,
                .seedsmall {
                    color: #0BCA11 !important;
                }

                .dlDown,
                .leech,
                .leechmed,
                .leechsmall {
                    color: #D51C0C !important;
                }

                .row7[style] {
                    background: #111111 !important;
                }

                li.dir > div:hover,
                .a-like:hover,
                ul.a-like-items > li:hover {
                    color: ${currentColorScheme.linkHoverText} !important;
                }

                #tor-filelist,
                #tor-fl-wrap,
                #tor-filelist,
                .menu-sub table,
                .menu-sub table td {
                    background: ${currentColorScheme.mainBG} !important;
                }

                .ttp-label.ttp-antiq, /* фон метки темы */
                .ttp-label.ttp-hot {
                    background-color: ${currentColorScheme.tagBG};
                }

                .nav em {
                    color: #D08770;
                    font-style: normal;
                }

                .category table.forums {
                    border-left: 1px solid #262626;
                }

                .cat_title,
                .t-top-buttons-wrap.row3.med.bold.hide-for-print {
                    border: 1px solid #262626;
                }

                .nav.pad_6.row1 {
                    background: ${currentColorScheme.mainBG} !important;
                }

                .w100.vMiddle .small.bold {
                    margin-top: 0 !important;
                }

                .t-note .note-html,
                .t-note .note-text {
                    background: 0;
                    border: 1px solid ${currentColorScheme.cellBG2};
                }

                .menu-split a:hover {
                    color: ${currentColorScheme.linkHoverText} !important;
                }

                .scrolled-to-post .hl-scrolled-to-wrap {
                    background: transparent;
                    border: 1px solid ${currentColorScheme.borderColor};
                }

                #bb-alert-msg, /* ошибка при повторном 'спасибо' в теме */
                #bb-alert-box,
                .bb-alert-err,
                table.error .msg {
                    color: ${currentColorScheme.mainText};
                    background: ${currentColorScheme.mainBG};
                    box-shadow: 0 0 20px ${currentColorScheme.borderColor};
                }

                /* замена текста 'Главная' на 'Rutracker.org' */
                .site-nav {
                    font-size: 1.05rem;
                }
                li a[href="index.php"] b {
                    display: none;
                }
                li a[href="index.php"]::before {
                    content: 'Ru';
                    font-weight: bold;
                    color: #D51C0C !important;
                    font-size: 1.3rem;
                }
                li a[href="index.php"]::after {
                    content: 'tracker.org';
                    font-weight: bold;
                    color: #0BCA11 !important;
                    font-size: 1.3rem;
                }

/* Стили для таблиц */

                table.message td {
                    background: ${currentColorScheme.cellBG2};
                }

                #fs-nav-list {
                    border: 3px double ${currentColorScheme.borderColor};
                    background: ${currentColorScheme.cellBG1} !important;
                }

            `;
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
    }

    // Применяем тему при загрузке
    if (isDarkTheme) {
        addThemeStyles();
    }

})();