// ==UserScript==
// @name         YouTube Zoom Fix (Без уменьшения шрифта )
// @name:en      YouTube Zoom Fix (  No font reduction )
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Уменьшает масштаб блоков, но сохраняет читаемость текста. ОБАЗАТЕЛЬНО НАСТРАИВАЙТЕ ПОД СЕБЯ ИЗМЕНЯЯ ПАРАМЕТРЫ, ТАК КАК У ВСЕХ РАЗНЫЕ ПРЕДПОЧТЕНИЯ И ДИСПЛЕИ
// @description:en Reduces the scale of the blocks, but keeps the text readable. MAKE SURE YOU CUSTOMIZE THE SETTINGS, AS EVERYONE HAS DIFFERENT PREFERENCES AND DISPLAYS.
// @author       F1irSti Github https://github.com/F1irSti
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530912/YouTube%20Zoom%20Fix%20%28%D0%91%D0%B5%D0%B7%20%D1%83%D0%BC%D0%B5%D0%BD%D1%8C%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530912/YouTube%20Zoom%20Fix%20%28%D0%91%D0%B5%D0%B7%20%D1%83%D0%BC%D0%B5%D0%BD%D1%8C%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0%20%29.meta.js
// ==/UserScript==

GM_addStyle(`
    #page-manager {
        transform: scale(0.85);
        transform-origin: top center;
    }

    /* Коррекция размеров элементов \ Correction of element dimensions */
    ytd-app, ytd-page-manager, ytd-browse, ytd-watch-flexy {
        font-size: 20px !important; /* Фиксируем размер шрифта \Fix the font size */
    }

    /* Компенсация уменьшенного масштаба \ Zoom out compensation */
    html {
        font-size: 60% !important;
    }
`);
GM_addStyle(`
    /* Увеличиваем кнопку с тремя точками \ Zoom in on the button with three dots */
    ytd-menu-renderer ytd-button-renderer {
        transform: scale(1.5) !important; /* Увеличиваем размер кнопки \ Increase the size of the button */
    }

    /* Дополнительно увеличиваем сам иконный контейнер \ Additionally, we enlarge the icon container itself */
    ytd-menu-renderer yt-icon {
        width: 25px !important;
        height: 25px !important;
    }
`);