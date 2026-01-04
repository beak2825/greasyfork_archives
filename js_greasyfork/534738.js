// ==UserScript==
// @name         lztregistry - форум на твоей ладони
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  почувствуй форум с другой стороны - как на ладони
// @author       кошак - https://lolz.live/members/4330537/
// @match        *://*.lolz.live/*
// @match        *://*.lolz.guru/*
// @match        *://*.zelenka.guru/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534738/lztregistry%20-%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20%D0%BD%D0%B0%20%D1%82%D0%B2%D0%BE%D0%B5%D0%B9%20%D0%BB%D0%B0%D0%B4%D0%BE%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/534738/lztregistry%20-%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20%D0%BD%D0%B0%20%D1%82%D0%B2%D0%BE%D0%B5%D0%B9%20%D0%BB%D0%B0%D0%B4%D0%BE%D0%BD%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверка, является ли страница форумной
    const isForumPage = window.location.pathname.startsWith('/forums/');

    // Стили для страницы
    const style = document.createElement('style');
    style.textContent = isForumPage ? `
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
        }
    ` : `
        body {
            opacity: 0;
            background-color: #141414;
            margin: 0;
            padding: 0;
            height: 100vh;
            transition: opacity 0.2s ease-in;
        }
        body.fade-in {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Проверка, находится ли узел внутри исключенных div (область ввода текста или уведомления)
    function isInsideExcludedDiv(node) {
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains('fr-element') &&
                    node.classList.contains('fr-view') &&
                    node.classList.contains('fr-element-scroll-visible')) {
                    return true;
                }
                if (node.classList.contains('p2p-alertNotice-titleGroup')) {
                    return true;
                }
            }
            node = node.parentNode;
        }
        return false;
    }

    // Преобразование текста в нижний регистр
    function toLowerCaseText(node) {
        if (node.nodeType === Node.TEXT_NODE && !isInsideExcludedDiv(node)) {
            node.textContent = node.textContent.toLowerCase();
        }
    }

    // Модификация текста в <title>
    function modifyTitle() {
        if (document.title === 'Форум социальной инженерии —  Lolz.live (Lolzteam)') {
            document.title = 'форум социальной инженерии — lolz.live project';
        } else {
            document.title = document.title.toLowerCase();
        }
    }

    // Модификация текстовых полей ввода
    function modifyInputElements(root = document) {
        const inputs = root.querySelectorAll('input[type="text"][name="keywords"].textCtrl.QuickSearchQuery[placeholder="Поиск..."][title="Введите параметры поиска и нажмите ввод"][autocomplete="off"]:not(.fr-element *):not(.p2p-alertNotice-titleGroup *)');
        inputs.forEach(input => {
            if (!isInsideExcludedDiv(input)) {
                input.setAttribute('placeholder', 'поиск...');
                input.setAttribute('title', 'введите параметры поиска и нажмите ввод');
            }
        });
    }

    // Модификация значений кнопок
    function modifyButtonValues(root = document) {
        const submitInputs = root.querySelectorAll('input[type="submit"][value="Создать тему"].button.primary.mbottom:not(.fr-element *):not(.p2p-alertNotice-titleGroup *)');
        submitInputs.forEach(input => {
            if (!isInsideExcludedDiv(input)) {
                input.value = 'создать тему';
            }
        });
        const buttonInputs = root.querySelectorAll('input[type="button"][value="Предварительный просмотр"].button.PreviewButton.JsOnly:not(.fr-element *):not(.p2p-alertNotice-titleGroup *)');
        buttonInputs.forEach(input => {
            if (!isInsideExcludedDiv(input)) {
                input.value = 'предварительный просмотр';
            }
        });
    }

    // Обработка существующего контента
    function processExistingContent() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: node => !isInsideExcludedDiv(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }, false);
        let node;
        while (node = walker.nextNode()) {
            toLowerCaseText(node);
        }
        modifyTitle();
        modifyInputElements();
        modifyButtonValues();
    }

    // Настройка наблюдателя за динамическими изменениями
    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (!isInsideExcludedDiv(node)) {
                            if (node.nodeType === Node.TEXT_NODE) {
                                toLowerCaseText(node);
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                modifyInputElements(node);
                                modifyButtonValues(node);
                                const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
                                    acceptNode: textNode => !isInsideExcludedDiv(textNode) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
                                }, false);
                                let textNode;
                                while (textNode = walker.nextNode()) {
                                    toLowerCaseText(textNode);
                                }
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Плавное появление страницы (только для нефорумных страниц)
    function triggerFadeIn() {
        if (!isForumPage) {
            document.body.classList.add('fade-in');
        }
        document.body.style.overflow = ''; // Восстановление прокрутки
    }

    // Минимальный автофикс для предотвращения застревания в opacity: 0 (только для нефорумных страниц)
    function setupAutoFix() {
        if (!isForumPage) {
            setTimeout(() => {
                if (!document.body.classList.contains('fade-in')) {
                    document.body.classList.add('fade-in');
                }
            }, 2000); // Проверка через 2 секунды
        }
    }

    // Основная функция
    function main() {
        processExistingContent();
        setupObserver();
        setupAutoFix();
        triggerFadeIn();
    }

    // Запуск скрипта
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();