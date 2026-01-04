// ==UserScript==
// @name         Удалить всё кроме рекламы в Яндекс Видео
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Удалить фрагменты видео Яндекса, кроме рекламы
// @author       You
// @match        https://yandex.kz/video/*
// @match        https://yandex.ru/video/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489802/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B2%D1%81%D1%91%20%D0%BA%D1%80%D0%BE%D0%BC%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%92%D0%B8%D0%B4%D0%B5%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489802/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B2%D1%81%D1%91%20%D0%BA%D1%80%D0%BE%D0%BC%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%92%D0%B8%D0%B4%D0%B5%D0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeVideoSnippets() {
        $('.VideoSnippet-Main').not('.VideoSnippet-Main .VideoThumb3-Overlay:has(> span:contains("Реклама"))').remove();
    }

    const observer = new MutationObserver(function() {
        removeVideoSnippets();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    removeVideoSnippets();
})();