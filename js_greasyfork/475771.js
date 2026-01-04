// ==UserScript==
// @name         Center and Adjust Width for Dzen Video Page
// @namespace    http://yournamespace.example.com
// @version      1.0
// @description  Center and adjust width for the Dzen video page on screens wider than 1600px.
// @author       gfkm
// @match        https://dzen.ru/video/watch/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475771/Center%20and%20Adjust%20Width%20for%20Dzen%20Video%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/475771/Center%20and%20Adjust%20Width%20for%20Dzen%20Video%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверяем ширину экрана
    if (window.innerWidth > 1600) {
        // Устанавливаем новые стили для контейнера
        GM_addStyle(`
            .video-site-layout._watch-type_long._is-watch-page {
                max-width: 50% !important; /* Устанавливаем максимальную ширину в 50% ширины экрана */
                width: 50% !important; /* Устанавливаем ширину в 50% ширины экрана */
                margin: 0 auto !important; /* Центрируем контент */
            }
        `);
    }
})();
