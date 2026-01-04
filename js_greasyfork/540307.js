// ==UserScript==
// @name         TikTok - Expand & Copy Comments (v4.0)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Automatically expands all comment threads and adds a button to copy all comments to the clipboard.
// @author       torch
// @match        https://www.tiktok.com/@*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540307/TikTok%20-%20Expand%20%20Copy%20Comments%20%28v40%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540307/TikTok%20-%20Expand%20%20Copy%20Comments%20%28v40%29.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    // --- НАСТРОЙКИ ---
    const checkInterval = 1500; // Проверять на наличие новых кнопок каждые 1.5 сек

    // --- СЕЛЕКТОРЫ И КЛЮЧЕВЫЕ СЛОВА ---
    const expandButtonContainerSelector = '.e2j3pk12'; // Контейнер кнопок "Просмотреть/Скрыть"
    const viewKeywords = {
        ru: ['Просмотреть'],
        en: ['View']
    };

    const commentContainerSelector = '.ejcng160'; // Главный контейнер всех комментариев
    const topLevelCommentSelector = '.e1970p9w9'; // Обертка для комментария и его ответов
    const commentItemSelector = '.e1970p9w0'; // Конкретный элемент комментария
    const replyContainerSelector = '.e2j3pk10'; // Контейнер с ответами

    // --- СОСТОЯНИЕ СКРИПТА ---
    let buttonAdded = false;

    // --- ФУНКЦИОНАЛ ---

    /**
     * Создает и добавляет на страницу кнопку "Скопировать все комментарии"
     */
    function addCopyButton() {
        const targetContainer = document.querySelector(commentContainerSelector);
        if (!targetContainer) return;

        // Создаем кнопку
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Скопировать все комментарии';
        copyButton.id = 'copy-all-comments-button';

        // Добавляем стили для кнопки
        const styles = `
            #copy-all-comments-button {
                background-color: #FE2C55;
                color: white;
                border: none;
                padding: 8px 16px;
                margin-bottom: 15px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            #copy-all-comments-button:hover {
                background-color: #e41e45;
            }
            #copy-all-comments-button:active {
                background-color: #c81035;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Добавляем обработчик клика
        copyButton.addEventListener('click', () => {
            copyAllComments(copyButton);
        });

        // Вставляем кнопку в начало контейнера комментариев
        targetContainer.prepend(copyButton);
        buttonAdded = true;
        console.log('[TikTok Expander] Кнопка "Скопировать" добавлена.');
    }

    /**
     * Собирает и копирует все комментарии
     * @param {HTMLElement} button - Элемент кнопки для обратной связи
     */
    async function copyAllComments(button) {
        const topLevelComments = document.querySelectorAll(topLevelCommentSelector);
        let allCommentsText = [];

        topLevelComments.forEach(commentThread => {
            // Парсим основной комментарий
            const mainComment = commentThread.querySelector(commentItemSelector);
            if (mainComment) {
                allCommentsText.push(parseComment(mainComment));
            }

            // Парсим все ответы на него
            const replies = commentThread.querySelectorAll(`${replyContainerSelector} ${commentItemSelector}`);
            replies.forEach(reply => {
                allCommentsText.push(parseComment(reply, true)); // true = это ответ
            });

            allCommentsText.push('---'); // Разделитель между ветками
        });

        const formattedString = allCommentsText.join('\n\n');

        try {
            await navigator.clipboard.writeText(formattedString);
            console.log(`[TikTok Expander] Скопировано ${topLevelComments.length} веток комментариев.`);
            // Обратная связь для пользователя
            const originalText = button.innerText;
            button.innerText = 'Скопировано!';
            button.disabled = true;
            setTimeout(() => {
                button.innerText = originalText;
                button.disabled = false;
            }, 3000);
        } catch (err) {
            console.error('[TikTok Expander] Не удалось скопировать комментарии: ', err);
            alert('Ошибка при копировании комментариев. Проверьте консоль (F12) для деталей.');
        }
    }

    /**
     * Извлекает информацию из одного элемента комментария
     * @param {HTMLElement} element - DOM-элемент комментария (.e1970p9w0)
     * @param {boolean} isReply - Является ли комментарий ответом
     * @returns {string} - Отформатированная строка комментария
     */
    function parseComment(element, isReply = false) {
        const usernameEl = element.querySelector('[data-e2e^="comment-username-"]');
        const textEl = element.querySelector('[data-e2e^="comment-level-"]');

        const username = usernameEl ? usernameEl.textContent.trim() : 'Unknown User';
        const text = textEl ? textEl.textContent.trim() : '';
        const prefix = isReply ? '  - ' : '';

        return `${prefix}${username}:\n${prefix}${text}`;
    }

    /**
     * Основной цикл, который ищет кнопки для раскрытия комментариев
     */
    function mainLoop() {
        // Раскрытие комментариев
        const allButtonContainers = document.querySelectorAll(expandButtonContainerSelector);
        let buttonsExpanded = 0;

        allButtonContainers.forEach(button => {
            const text = button.textContent;
            const isViewButton = viewKeywords.ru.some(k => text.includes(k)) ||
                                 viewKeywords.en.some(k => text.includes(k));

            if (isViewButton && document.body.contains(button) && button.offsetParent !== null) {
                button.click();
                buttonsExpanded++;
            }
        });

        if (buttonsExpanded > 0) {
            console.log(`[TikTok Expander] Раскрыто ${buttonsExpanded} веток комментариев.`);
        }

        // Добавление кнопки копирования (только один раз)
        if (!buttonAdded && document.querySelector(commentContainerSelector)) {
            addCopyButton();
        }
    }

    console.log("TikTok - Expand & Copy Comments script (v4.0) is running...");
    setInterval(mainLoop, checkInterval);

})();