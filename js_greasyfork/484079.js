// ==UserScript==
// @name         Фильтр прямых трансляций YouTube
// @namespace    your-namespace
// @version      1.0
// @description  Фильтрует видео YouTube по значку "В ЭФИРЕ"
// @author       torchlight
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484079/%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D1%80%D1%8F%D0%BC%D1%8B%D1%85%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D1%8F%D1%86%D0%B8%D0%B9%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/484079/%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D1%80%D1%8F%D0%BC%D1%8B%D1%85%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D1%8F%D1%86%D0%B8%D0%B9%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция, которая будет вызываться при изменении документа
    function handleDocumentChanges(mutationsList, observer) {
        // Перебрать все мутации
        for (var mutation of mutationsList) {
            // Перебрать все добавленные узлы в мутации
            for (var addedNode of mutation.addedNodes) {
                // Проверить, является ли добавленный узел элементом
                if (addedNode instanceof Element) {
                    // Проверить, содержит ли добавленный узел нужный элемент с классом "ytd-badge-supported-renderer"
                    if (addedNode.classList.contains("ytd-badge-supported-renderer")) {
                        var badgeElement = addedNode;

                        // Проверить, содержит ли элемент нужный текст
                        var badgeText = badgeElement.innerText;
                        if (badgeText.includes("В ЭФИРЕ")) {
                            // Оставить только элементы с нужным текстом
                            badgeElement.closest("ytd-compact-video-renderer").style.display = "block";
                        } else {
                            // Скрыть остальные элементы
                            badgeElement.closest("ytd-compact-video-renderer").style.display = "none";
                        }
                    }
                }
            }
        }
    }

    // Создать новый экземпляр MutationObserver с функцией обратного вызова
    var observer = new MutationObserver(handleDocumentChanges);


    // Настроить наблюдение за изменениями в документе
    observer.observe(document, { childList: true, subtree: true });
})();