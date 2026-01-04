// ==UserScript==
// @name         COZE - Free GPT4 reply box extension from  640px with 1280px
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Expanded, the width of the window is for the whole response code to be visible, not some fragment.
// @description:Change all 640px to 1280px on the page
// @author       You
// @match *://www.coze.com/*
// @match *://www.coze.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493890/COZE%20-%20Free%20GPT4%20reply%20box%20extension%20from%20%20640px%20with%201280px.user.js
// @updateURL https://update.greasyfork.org/scripts/493890/COZE%20-%20Free%20GPT4%20reply%20box%20extension%20from%20%20640px%20with%201280px.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для замены значений в стилях
    function replacePx(styleAttr) {
        return styleAttr.replace(/640px/g, '1280px');
    }

    // Переопределение inline-стилей для элемента и его дочерних элементов
    function replaceInlineStyles(element) {
        if (element.style.cssText.includes('640px')) {
            element.style.cssText = replacePx(element.style.cssText);
        }

        Array.from(element.children).forEach(child => replaceInlineStyles(child));
    }

    // Создание наблюдателя за мутациями, который отслеживает изменения в DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(newNode => {
                if (newNode.nodeType === Node.ELEMENT_NODE) {
                    // Заменяем inline-стили для новых элементов
                    replaceInlineStyles(newNode);
                }
            });
        });
    });

    // Настройки конфигурации наблюдателя
    const config = { childList: true, subtree: true };

    // Запуск наблюдателя для всего body документа
    observer.observe(document.body, config);

    // Замена для уже существующих элементов
    replaceInlineStyles(document.body);
})();