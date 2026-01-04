// ==UserScript==
// @name         Pikabu Advertising Author Blocker & Class Hider
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Блокирует статьи рекламных авторов на Pikabu, опционально блокирует блоки с фандрайзингом/играми/Telegram-ссылками в параграфах, а также элементы по списку классов.
// @match        https://pikabu.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514626/Pikabu%20Advertising%20Author%20Blocker%20%20Class%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/514626/Pikabu%20Advertising%20Author%20Blocker%20%20Class%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const blockedAuthorsList = ["rabota.pikabu", "yandex.travel", "pikabu.promokody"]; // Список авторов
    const otherSelectorsToHide = ['.feed-games-carousel', '.story-block_type_fundraising']; // Селекторы других блоков для скрытия
    const blockOtherSelectors = true; // Включить/выключить блокировку других блоков

    const blockTelegramLinksInParagraphs = true; // Блокировка <p> с Telegram ссылками
    const telegramLinkPattern = /^https:\/\/t\.me\/(\+)?/; // Регулярное выражение для поиска Telegram ссылок

    // НОВОЕ: Конфигурация для блокировки по классам
    const classesToHide = ["popup", "another-class-to-hide"]; // Список CSS-классов для скрытия
    const blockListedClasses = true; // Включить/выключить блокировку по списку классов

    // Используем Set для быстрой проверки авторов
    const blockedAuthorsSet = new Set(blockedAuthorsList);

    // CSS класс для скрытия элементов
    const hideClassName = 'paab-hidden-element';

    // --- CSS Injection ---
    function addHideStyle() {
        const styleId = 'paab-hide-style';
        if (document.getElementById(styleId)) {
            return;
        }
        const css = `.${hideClassName} { display: none !important; }`;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // --- Core Blocking Logic ---
    function hideElements() {
        // 1. Блокировка статей авторов
        const articles = document.querySelectorAll(`article[data-author-name]:not(.${hideClassName})`);
        articles.forEach(article => {
            const authorName = article.getAttribute("data-author-name");
            if (blockedAuthorsSet.has(authorName)) {
                article.classList.add(hideClassName);
                // console.log(`PAAB: Hiding article by ${authorName}`);
            }
        });

        // 2. Блокировка других блоков по селекторам, если включено
        if (blockOtherSelectors) {
            otherSelectorsToHide.forEach(selector => {
                const elements = document.querySelectorAll(`${selector}:not(.${hideClassName})`);
                elements.forEach(element => {
                    element.classList.add(hideClassName);
                    // console.log(`PAAB: Hiding element matching selector ${selector}`);
                });
            });
        }

        // 3. Блокировка параграфов (<p>) с ссылками на Telegram, если включено
        if (blockTelegramLinksInParagraphs) {
            const paragraphs = document.querySelectorAll(`p:not(.${hideClassName})`);
            paragraphs.forEach(pElement => {
                const linksInParagraph = pElement.querySelectorAll('a[href]');
                for (const link of linksInParagraph) {
                    const href = link.getAttribute('href');
                    if (href && telegramLinkPattern.test(href)) {
                        pElement.classList.add(hideClassName);
                        // console.log(`PAAB: Hiding paragraph with Telegram link: ${href} in P: ${pElement.textContent.substring(0,50)}...`);
                        break;
                    }
                }
            });
        }

        // 4. НОВОЕ: Блокировка элементов по списку классов, если включено
        if (blockListedClasses) {
            classesToHide.forEach(className => {
                // Убедимся, что className не пустая строка и является валидным идентификатором для селектора
                if (className && typeof className === 'string' && className.trim() !== '') {
                    // Экранируем класс, если он содержит специальные символы (хотя для простых имен классов это не нужно)
                    // const safeClassName = CSS.escape(className.trim()); // CSS.escape() может быть не везде, используем простой trim
                    const trimmedClassName = className.trim();
                    try {
                        const elementsToHide = document.querySelectorAll(`.${trimmedClassName}:not(.${hideClassName})`);
                        elementsToHide.forEach(element => {
                            element.classList.add(hideClassName);
                            // console.log(`PAAB: Hiding element with class .${trimmedClassName}`);
                        });
                    } catch (e) {
                        console.error(`PAAB: Invalid CSS class name "${trimmedClassName}" in classesToHide.`, e);
                    }
                }
            });
        }
    }

    // --- Initialization and Observation ---

    addHideStyle();

    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", hideElements);
    } else {
        hideElements();
    }

    const observer = new MutationObserver(mutations => {
        let nodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // Проверяем, есть ли среди добавленных узлов или их дочерних элементов
                // что-то, что нам нужно скрыть. Это более точная проверка,
                // но для простоты можно просто вызывать hideElements().
                nodesAdded = true;
                break;
            }
        }
        if (nodesAdded) {
             hideElements(); // Перепроверяем все типы скрываемых элементов
        }
    });

    // Наблюдаем за body, так как большинство динамического контента появляется там.
    // Если на Pikabu контент добавляется вне body (маловероятно, но возможно),
    // то нужно будет наблюдать за document.documentElement.
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

})();