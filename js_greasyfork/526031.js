// ==UserScript==
// @name         YouTrack Copy Megaplan ID + Task Title + Issue ID
// @namespace    https://github.com/rdavydov
// @author       rdavydov
// @icon         https://avatars0.githubusercontent.com/u/15850461
// @homepageURL  https://greasyfork.org/scripts/526031-youtrack-copy-megaplan-id-task-title
// @version      1.1
// @description  Быстрое копирование Megaplan ID, issue id (если найден) и заголовка задачи для YouTrack
// @match        *://youtrack.*/agiles/*
// @match        *://youtrack.*/issue/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526031/YouTrack%20Copy%20Megaplan%20ID%20%2B%20Task%20Title%20%2B%20Issue%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/526031/YouTrack%20Copy%20Megaplan%20ID%20%2B%20Task%20Title%20%2B%20Issue%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Извлекает issue id из URL.
     * Приоритет: параметр ?issue=... > часть пути /issue/GC-1213...
     *
     * @returns {string|null} issue id, либо null если не найден
     */
    function getIssueIdFromUrl() {
        const url = window.location.href;
        const params = new URLSearchParams(window.location.search);
        if (params.has("issue")) {
            return params.get("issue");
        }
        // Попытка извлечь через регулярное выражение для URL вида /issue/GC-1213 или /issue/GC-1213/...
        const match = url.match(/\/issue\/([A-Z]+-\d+)/);
        if (match) {
            return match[1];
        }
        return null;
    }

    /**
     * Добавляет кнопку копирования в заголовок задачи.
     *
     * @param {Element} headerEl - Элемент с заголовком задачи (селектор [data-test="issueSummary"]).
     */
    function addCopyButtonForHeader(headerEl) {
        if (!headerEl) return;
        // Если кнопка уже добавлена, выходим.
        if (headerEl.querySelector('.copy-megaplan-button')) return;

        // Извлекаем заголовок задачи.
        const taskTitle = headerEl.textContent.trim();
        if (!taskTitle) {
            console.warn('Не найден заголовок задачи.');
            return;
        }

        // Ищем строку таблицы с Megaplan ID.
        const row = Array.from(document.querySelectorAll('tr.yt-issue-fields-panel__row'))
            .find(row => {
                const labelEl = row.querySelector('.yt-issue-fields-panel__field-label');
                return labelEl && labelEl.textContent.trim() === 'Megaplan ID';
            });
        if (!row) {
            console.warn('Не найдена строка с Megaplan ID.');
            return;
        }
        const valueCell = row.querySelector('.yt-issue-key-value-list__column_value');
        if (!valueCell) {
            console.warn('Не найдена ячейка с Megaplan ID.');
            return;
        }
        const megaplanId = valueCell.getAttribute('title') || valueCell.textContent.trim();
        if (!megaplanId) {
            console.warn('Megaplan ID пустой.');
            return;
        }

        // Пытаемся извлечь issue id из URL.
        const issueId = getIssueIdFromUrl();

        // Формируем итоговую строку:
        // Если issueId найден – "[megaplanId] [issueId] taskTitle"
        // Иначе – "[megaplanId] taskTitle"
        const copyText = issueId ? `[${megaplanId}] [${issueId}] ${taskTitle}` : `[${megaplanId}] ${taskTitle}`;

        // Создаем кнопку копирования.
        const button = document.createElement('button');
        button.className = 'copy-megaplan-button';
        button.textContent = '📋';
        button.style.fontSize = '14px';
        button.style.padding = '2px 4px';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid #ccc';
        button.style.background = '#f9f9f9';
        button.style.color = '#333';
        button.style.borderRadius = '3px';
        button.style.marginRight = '5px';
        button.title = 'Скопировать Megaplan ID, Issue ID (если найден) и заголовок задачи';

        button.addEventListener('click', () => {
            GM_setClipboard(copyText);
        });

        // Добавляем кнопку в начало заголовка.
        headerEl.prepend(button);
    }

    /**
     * Наблюдает за изменениями в DOM и добавляет кнопку копирования, если это необходимо.
     */
    function observeChanges() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('[data-test="issueSummary"]').forEach(headerEl => {
                addCopyButtonForHeader(headerEl);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeChanges);
    } else {
        observeChanges();
    }
})();
