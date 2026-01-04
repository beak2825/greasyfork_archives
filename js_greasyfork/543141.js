// ==UserScript==
// @name         Удаление полоски с загрузкой
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Убирает полоску загрузки с форума
// @author       https://lolz.live/matbast0s
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543141/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%BE%D1%81%D0%BA%D0%B8%20%D1%81%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/543141/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%BE%D1%81%D0%BA%D0%B8%20%D1%81%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%BE%D0%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeLoadingElements() {
        document.querySelectorAll('div[class^="progress-bar"], div.spinner-bar').forEach(el => el.remove());
    }

    const observer = new MutationObserver(removeLoadingElements);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', removeLoadingElements);
})();