// ==UserScript==
// @name         Hide YouTube Shorts from Search and Feed
// @namespace    http://tampermonkey.net
// @version      0.1
// @description  Скрывает элементы "Shorts" из выдачи поиска и ленты на YouTube, чтобы помочь не отвлекаться на короткие ролики.
// @author       Anonymous
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542480/Hide%20YouTube%20Shorts%20from%20Search%20and%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/542480/Hide%20YouTube%20Shorts%20from%20Search%20and%20Feed.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Функция для скрытия всех элементов, связанных с YouTube Shorts
    function hideShortsElements() {
        // Массив всех селекторов, элементы которых нужно скрыть
        const selectorsToHide = [
            '.yt-spec-touch-feedback-shape__fill',        // Элементы с этим классом
            '.ytGridShelfViewModelGridShelfItem',          // Элементы с этим классом
            '.shortsLockupViewModelHostThumbnailContainer', // Контейнеры с миниатюрами Shorts
            '.shortsLockupViewModelHostMetadataTitle',    // Титулы видео Shorts
            '.yt-spec-button-shape-next',                  // Кнопки и элементы управления
            '.yt-icon-shape',                              // Логотипы иконки "Shorts"
            '.yt-core-attributed-string',                  // Все строки текста
            '.yt-section-header-view-model',               // Заголовки секций
            '.shelf-header-layout-wiz',                    // Секции на странице
            '.shelf-header-layout-wiz__label-container',   // Контейнеры для меток секций
            '.shelf-header-layout-wiz__title',             // Заголовки секций, например "Shorts"
            '.ytd-rich-grid-media',                        // Элементы на странице, относящиеся к сетке видео
            'hr',                                         // Линии-разделители
            '.yt-uix-tooltip',                             // Всплывающие подсказки
            '.yt-spec-divider',                           // Разделители
        ];

        // Проходим по каждому селектору и скрываем соответствующие элементы
        selectorsToHide.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(element) {
                element.style.display = 'none';
            });
        });

        // Скрываем заголовки с текстом "Shorts" в отдельных блоках
        document.querySelectorAll('.yt-core-attributed-string').forEach(function(element) {
            if (element.textContent.trim().toLowerCase() === 'shorts') {
                element.style.display = 'none';
            }
        });
    }

    // Вызов функции сразу после загрузки страницы
    hideShortsElements();

    // Создаем MutationObserver, чтобы отслеживать изменения на странице
    const observer = new MutationObserver(function(mutationsList, observer) {
        // При изменениях на странице снова скрываем элементы
        hideShortsElements();
    });

    // Наблюдаем за изменениями в DOM
    observer.observe(document.body, {
        childList: true,  // Отслеживаем добавление/удаление дочерних элементов
        subtree: true,    // Отслеживаем все дочерние элементы на странице
    });
})();
