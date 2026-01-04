// ==UserScript==
// @name         Otvet.mail.ru Auto Expander (DEBUG v1.4)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically expands collapsible text and reply threads on otvet.mail.ru question pages.
// @author       Your Name
// @match        *://otvet.mail.ru/question/*
// @grant        GM_log
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536630/Otvetmailru%20Auto%20Expander%20%28DEBUG%20v14%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536630/Otvetmailru%20Auto%20Expander%20%28DEBUG%20v14%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logPrefix = "[Otvet Expander] ";
    const DEBUG = true; // Установите в false, когда отладка не нужна

    function log(message, ...args) {
        if (DEBUG) {
            // Tampermonkey/Greasemonkey могут иметь GM_log, который удобнее
            if (typeof GM_log === 'function') {
                GM_log(logPrefix + message + (args.length > 0 ? JSON.stringify(args) : ''));
            } else {
                console.log(logPrefix + message, ...args);
            }
        }
    }

    log("Script starting...");

    let expandTimeoutId = null;

    function expandElements() {
        log("expandElements called.");

        // 1. Expand "Раскрыть" buttons for main question and answers
        const mainExpandButtons = document.querySelectorAll('div[class*="_CollapsibleTextToggler_more_"] button');
        log(`Found ${mainExpandButtons.length} potential main/answer expand buttons.`);
        mainExpandButtons.forEach((button, index) => {
            log(`  Button ${index + 1}: Text="${button.textContent?.trim()}", autoExpanded="${button.dataset.autoExpanded}"`);
            if (button.textContent && button.textContent.includes('Раскрыть') && !button.dataset.autoExpanded) {
                log('    Clicking "Раскрыть":', button);
                button.click();
                button.dataset.autoExpanded = 'true';
            }
        });

        // 2. Expand "N ответ(ов)" buttons for reply threads
        const replyTogglers = document.querySelectorAll('button[class*="_ReplyItemRepliesToggler_"]');
        log(`Found ${replyTogglers.length} potential reply togglers.`);
        replyTogglers.forEach((button, index) => {
            const siteExpanded = button.getAttribute('data-auto-expanded') === 'true';
            log(`  Toggler ${index + 1}: Text="${button.textContent?.trim()}", siteExpanded="${siteExpanded}", autoExpandedReplies="${button.dataset.autoExpandedReplies}"`);

            // Если кнопка не раскрыта сайтом И не помечена нами как автоматически раскрытая
            if (!siteExpanded && !button.dataset.autoExpandedReplies) {
                if (button.textContent && /ответ|ответа|ответов/.test(button.textContent)) {
                    log('    Clicking reply toggler:', button);
                    button.click();
                    button.dataset.autoExpandedReplies = 'true';
                }
            }
        });
        log("expandElements finished.");
    }

    // --- MutationObserver Setup ---
    const observerCallback = (mutationsList, observerInstance) => {
        let relevantChangeDetected = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                relevantChangeDetected = true;
                break;
            }
        }

        if (relevantChangeDetected) {
            log("Relevant DOM change detected. Scheduling expandElements.");
            // Небольшая задержка, чтобы дать DOM "успокоиться"
            // и чтобы не вызывать expandElements слишком часто, если много мелких мутаций
            clearTimeout(expandTimeoutId);
            expandTimeoutId = setTimeout(() => {
                log("Executing scheduled expandElements.");
                expandElements();
            }, 300); // Задержку можно подбирать, 300-500ms обычно достаточно
        }
    };

    const observer = new MutationObserver(observerCallback);
    const observerConfig = {
        childList: true,
        subtree: true
    };

    // Попробуем наблюдать за более конкретным элементом, если он существует
    // Если нет, то вернемся к document.body
    let targetNode = document.querySelector('div[class*="_RepliesListWrapper_"]') || // Контейнер для списка ответов
                     document.querySelector('div[class*="_ListItem_1i6yp_7"]') ||   // Отдельный элемент списка
                     document.body;

    log("Observer will target:", targetNode.tagName, targetNode.className);
    observer.observe(targetNode, observerConfig);

    // --- Initial run & Cleanup ---
    log("Initial check for elements on document-idle.");
    // Дадим немного времени после document-idle, если элементы не сразу готовы
    setTimeout(expandElements, 500);
    setTimeout(expandElements, 1500); // Еще одна проверка чуть позже

    window.addEventListener('unload', () => {
        if (observer) {
            observer.disconnect();
            log("Observer disconnected on page unload.");
        }
        clearTimeout(expandTimeoutId);
    });

    log("Script loaded and MutationObserver is active.");

})();