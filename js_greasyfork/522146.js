// ==UserScript==
// @name         Удаление секций с классом q1b1*
// @name:ru      Ozon Убрать слова "распродажа" и "осталось"
// @namespace    http://tampermonkey.net/
// @version      2025-09-28
// @description  Находит и удаляет <section> с классом, начинающимся на "q1b1"
// @description:ru  Убирает плашки со словами "распродажа" и "осталось"
// @author         Саня Лептон
// @match          http://*.ozon.ru/*
// @match          https://*.ozon.ru/*
// @match          http://*.ozon.com/*
// @match          https://*.ozon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/522146/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D0%B9%20%D1%81%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%BE%D0%BC%20q1b1%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/522146/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D0%B9%20%D1%81%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%BE%D0%BC%20q1b1%2A.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Функция для поиска и удаления элементов
    function removeSections() {
        // Используем селектор, ищущий все <section> с классами, начинающимися на q1b1
        // Это можно сделать с помощью атрибута ^= (начинается с)
        const sections = document.querySelectorAll('section[class^="q1b1"]');

        sections.forEach(section => {
            section.remove();
        });
    }

    // Вызываем функцию после загрузки страницы
    window.addEventListener('load', removeSections);

    // Также можно повторно запускать через интервал, если контент подгружается динамически
    const observer = new MutationObserver(() => {
        removeSections();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();