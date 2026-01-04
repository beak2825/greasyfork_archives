// ==UserScript==
// @name         VK Copy Music Name
// @namespace    Anton Polyakin
// @version      2024-03-26
// @description  Добавляет возможность копирования названия аудиозаписи
// @author       Anton Polyakin
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490912/VK%20Copy%20Music%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/490912/VK%20Copy%20Music%20Name.meta.js
// ==/UserScript==

(function() {
    const style = window.document.createElement("style");
    style.textContent = `.vkuiGroup--mode-card:empty {
        margin: 0px!important;
    }
    .top_audio_player_title, .audio_page_layout .vkui__root div > div > div:nth-child(2) span.vkuiTypography,.audio_page_layout .vkui__root div > div > div:nth-child(2) span.vkuiTypography span{
        user-select:auto!important;
        -webkit-user-select: auto!important;
        -moz-user-select: initial!important;
        -ms-user-select: initial!important;
    }`;
    document.querySelector('head').appendChild(style);
})();