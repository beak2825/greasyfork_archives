// ==UserScript==
// @name         Hide Offensive Words
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для скрытия определённых слов на сайте lolz.live/*
// @author       ChatGPT
// @match        https://lolz.live/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510940/Hide%20Offensive%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/510940/Hide%20Offensive%20Words.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Список слов, которые нужно скрыть
    const wordsToHide = ['сука', 'блять', 'блядь', 'чёрт', 'пидор'];

    // Функция замены слов на звездочки
    function hideWords(text) {
        for (let word of wordsToHide) {
            let regExp = new RegExp(word, 'gi');
            text = text.replace(regExp, '*****');
        }
        return text;
    }

    // Функция для обработки элементов текста на странице
    function processTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = hideWords(node.nodeValue);
        } else {
            for (let child of node.childNodes) {
                processTextNodes(child);
            }
        }
    }

    // Обрабатываем начальную страницу
    processTextNodes(document.body);

    // Наблюдаем за изменениями на странице (динамическая загрузка контента)
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
                processTextNodes(addedNode);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
