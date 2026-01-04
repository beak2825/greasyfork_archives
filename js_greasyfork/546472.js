// ==UserScript==
// @name         Arhivach.vc Thread Hider (v9.8 - Cooperative Styling)
// @namespace    http://tampermonkey.net/
// @version      9.8
// @description  Скрывает треды на arhivach.vc. Кнопка управления использует нативные стили сайта для тем, не переопределяя их.
// @author       Gemini & User
// @match        https://arhivach.vc/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546472/Arhivachvc%20Thread%20Hider%20%28v98%20-%20Cooperative%20Styling%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546472/Arhivachvc%20Thread%20Hider%20%28v98%20-%20Cooperative%20Styling%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Ключ хранения ---
    const HIDDEN_THREADS_KEY = 'arhivach_hidden_threads_v8_titles';
    let hiddenThreads = GM_getValue(HIDDEN_THREADS_KEY, []) || [];

    // --- Стили (НОВЫЙ ПОДХОД) ---
    // Мы больше не задаем цвет и тень для кнопки, позволяя сайту сделать это за нас.
    // Мы стилизуем только компоновку и уникальный элемент - бейдж.
    GM_addStyle(`
        /* Общие стили для модального окна и иконки скрытия */
        .ath-hide-btn { cursor: pointer; margin-left: 4px; display: inline-block; vertical-align: middle; font-size: 1.2em; line-height: 1; }
        #hidden-threads-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.75); z-index: 10000; display: none; justify-content: center; align-items: center; }
        #hidden-threads-modal-content { background-color: #2c2f33; color: #eee; padding: 20px; border-radius: 8px; width: 90%; max-width: 800px; max-height: 80vh; overflow-y: auto; border: 1px solid #4f545c; display: flex; flex-direction: column; }
        #hidden-threads-modal-content h2 { margin-top: 0; border-bottom: 1px solid #4f545c; padding-bottom: 10px; }
        #hidden-threads-list { flex-grow: 1; overflow-y: auto; margin-bottom: 15px; }
        #hidden-threads-list div { padding: 2px 8px; border-bottom: 1px solid #3a3d40; display: flex; justify-content: space-between; align-items: center; }
        #hidden-threads-list div a { flex-grow: 1; margin-right: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ath-restore-btn { background-color: #4caf50; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; flex-shrink: 0; font-size: 0.9em; }
        #hidden-threads-modal-buttons { margin-top: 10px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        #hidden-threads-modal-buttons button { border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; }
        #hidden-threads-modal-backup-controls { border-top: 1px solid #4f545c; padding-top: 15px; margin-top: 15px; display: flex; gap: 10px; justify-content: flex-start; }
        #ath-backup-btn { background-color: #0288d1; }
        #ath-restore-btn { background-color: #512da8; }
        #ath-restore-all-btn { background-color: #d32f2f; }
        #ath-modal-close-btn { background-color: #616161; }

        /* --- СТИЛИЗАЦИЯ КНОПКИ: ТОЛЬКО КОМПОНОВКА --- */
        #hidden-threads-manager-li a {
            /* Мы НЕ трогаем color и text-shadow. Их установит CSS сайта. */
            padding: 10px 15px;
            font-weight: normal !important; /* Убираем жирность */
            display: flex !important; /* Важно для компоновки */
            align-items: center !important; /* Важно для компоновки */
            gap: 0.5em !important; /* Важно для компоновки */
        }

        /* --- СТИЛИЗАЦИЯ БЕЙДЖА --- */
        .ath-badge {
            padding: 1px 6px;
            font-size: 10px;
            font-weight: bold;
            line-height: 1.4;
            border-radius: 8px;
            text-shadow: none; /* Убираем наследуемую тень, она на бейдже не нужна */
        }

        /* Бейдж для СВЕТЛОЙ ТЕМЫ */
        body:not(.dark) .ath-badge {
            background-color: #777777;
            color: white;
        }

        /* Бейдж для ТЕМНОЙ ТЕМЫ */
        body.dark .ath-badge {
            background-color: #c6c6c6;
            color: #333333;
        }
    `);

    // --- Функции для работы с хранилищем ---
    const saveHiddenThreads = () => GM_setValue(HIDDEN_THREADS_KEY, hiddenThreads);
    const loadHiddenThreads = () => { hiddenThreads = GM_getValue(HIDDEN_THREADS_KEY, []) || []; };

    // --- Основная функция обработки треда ---
    function processThreadRow(threadRow) {
        if (threadRow.dataset.hiderProcessed) return;
        threadRow.dataset.hiderProcessed = 'true';
        const threadId = threadRow.id.replace('thread_row_', '');
        if (!threadId) return;
        if (hiddenThreads.some(thread => thread.id === threadId)) {
            threadRow.style.display = 'none';
        }
        const controlCell = threadRow.querySelector('.thread_control nobr');
        if (controlCell) {
            const hideLink = document.createElement('a');
            hideLink.href = '#';
            hideLink.className = 'ath-hide-btn';
            hideLink.title = 'Скрыть этот тред';
            hideLink.innerHTML = '<i class="icon-eye-close"></i>';
            hideLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!hiddenThreads.some(thread => thread.id === threadId)) {
                    let threadTitle = 'Без заголовка';
                    const titleElement = threadRow.querySelector('div.thread_text a b');
                    if (titleElement && titleElement.textContent.trim()) {
                        threadTitle = titleElement.textContent.trim();
                    } else {
                        const linkElement = threadRow.querySelector('div.thread_text a');
                        if (linkElement && linkElement.textContent.trim()) {
                            const fullText = linkElement.textContent.trim().replace(/\s+/g, ' ');
                            threadTitle = fullText.substring(0, 70) + (fullText.length > 70 ? '...' : '');
                        }
                    }
                    hiddenThreads.unshift({ id: threadId, title: threadTitle });
                    saveHiddenThreads();
                    threadRow.style.display = 'none';
                    updateManagementButton();
                }
            });
            controlCell.appendChild(hideLink);
        }
    }

    // --- Функции бэкапа и восстановления ---
    function handleBackup() {
        if (hiddenThreads.length === 0) {
            alert('Нет скрытых тредов для экспорта.');
            return;
        }
        const dataStr = JSON.stringify(hiddenThreads, null, 2);
        const blob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `arhivach_hidden_threads_backup_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    function handleRestoreClick() {
        document.getElementById('ath-restore-input').click();
    }
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data) || (data.length > 0 && (typeof data[0].id === 'undefined' || typeof data[0].title === 'undefined'))) {
                   throw new Error('Неверный формат файла. Ожидается массив объектов с полями "id" и "title".');
                }
                if (confirm(`Вы уверены, что хотите импортировать ${data.length} записей из файла? \n\nВНИМАНИЕ: Это действие ЗАМЕНИТ ваш текущий список скрытых тредов.`)) {
                    hiddenThreads = data;
                    saveHiddenThreads();
                    alert(`Импорт успешно завершен. Будет перезагружена страница.`);
                    window.location.reload();
                }
            } catch (error) {
                alert('Ошибка при чтении или обработке файла: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    // --- UI управления ---
    function handleEscKey(event) {
        if (event.key === 'Escape') {
            hideManagementModal();
        }
    }
    function hideManagementModal() {
        const overlay = document.getElementById('hidden-threads-modal-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            document.removeEventListener('keydown', handleEscKey);
        }
    }

    function createManagementUI() {
        if (document.getElementById('hidden-threads-manager-btn')) return;
        const topMenu = document.querySelector('ul.nav');
        if (!topMenu) return;
        const managementLi = document.createElement('li');
        managementLi.id = 'hidden-threads-manager-li';

        const count = hiddenThreads.length;
        const badgeHtml = count > 0 ? `<span class="ath-badge">${count}</span>` : '';
        managementLi.innerHTML = `<a href="#" id="hidden-threads-manager-btn"><i class="icon-eye-close"></i><span>Скрытые</span>${badgeHtml}</a>`;

        topMenu.insertBefore(managementLi, topMenu.firstChild);
        managementLi.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); showManagementModal(); });
        createModal();
    }

    function updateManagementButton() {
        const btn = document.getElementById('hidden-threads-manager-btn');
        if (btn) {
            const count = hiddenThreads.length;
            const badgeHtml = count > 0 ? `<span class="ath-badge">${count}</span>` : '';
            btn.innerHTML = `<i class="icon-eye-close"></i><span>Скрытые</span>${badgeHtml}`;
        }
    }

    function createModal() {
        if (document.getElementById('hidden-threads-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'hidden-threads-modal-overlay';
        overlay.innerHTML = `
            <div id="hidden-threads-modal-content">
                <h2>Управление скрытыми тредами</h2>
                <div id="hidden-threads-list"></div>
                <div id="hidden-threads-modal-backup-controls">
                    <button id="ath-backup-btn">Экспорт в JSON</button>
                    <button id="ath-restore-btn">Импорт из JSON</button>
                    <input type="file" id="ath-restore-input" accept=".json" style="display: none;">
                </div>
                <div id="hidden-threads-modal-buttons">
                    <button id="ath-restore-all-btn">Восстановить все и перезагрузить</button>
                    <button id="ath-modal-close-btn">Закрыть</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'hidden-threads-modal-overlay' || e.target.id === 'ath-modal-close-btn') {
                hideManagementModal();
            }
        });

        document.getElementById('ath-restore-all-btn').addEventListener('click', () => {
            if (confirm('Вы уверены? Это действие восстановит все скрытые треды и перезагрузит страницу.')) {
                GM_setValue(HIDDEN_THREADS_KEY, []);
                window.location.reload();
            }
        });
        document.getElementById('ath-backup-btn').addEventListener('click', handleBackup);
        document.getElementById('ath-restore-btn').addEventListener('click', handleRestoreClick);
        document.getElementById('ath-restore-input').addEventListener('change', handleFileSelect);
    }
    function showManagementModal() {
        loadHiddenThreads();
        const listContainer = document.getElementById('hidden-threads-list');
        listContainer.innerHTML = hiddenThreads.length === 0 ? '<div>Нет скрытых тредов.</div>' : '';

        hiddenThreads.forEach(thread => {
            const item = document.createElement('div');
            item.innerHTML = `
                <a href="/thread/${thread.id}/" target="_blank" title="${thread.title}">Тред #${thread.id} (${thread.title})</a>
                <button class="ath-restore-btn" data-id="${thread.id}">Восстановить</button>
            `;
            listContainer.appendChild(item);
        });

        listContainer.querySelectorAll('.ath-restore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRestore = e.target.dataset.id;
                hiddenThreads = hiddenThreads.filter(thread => thread.id !== idToRestore);
                saveHiddenThreads();
                const threadRowToShow = document.getElementById('thread_row_' + idToRestore);
                if (threadRowToShow) { threadRowToShow.style.display = ''; }
                updateManagementButton();
                showManagementModal();
            });
        });

        document.getElementById('hidden-threads-modal-overlay').style.display = 'flex';
        document.addEventListener('keydown', handleEscKey);
    }

    // --- ИНИЦИАЛИЗАЦИЯ И НАБЛЮДЕНИЕ ---
    function initialize() {
        loadHiddenThreads();
        createManagementUI();
        document.querySelectorAll('tr[id^="thread_row_"]').forEach(processThreadRow);
    }

    const threadObserver = new MutationObserver((mutations) => {
        if (!document.getElementById('hidden-threads-manager-btn')) { createManagementUI(); }
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('tr[id^="thread_row_"]')) { processThreadRow(node); }
                        node.querySelectorAll('tr[id^="thread_row_"]').forEach(processThreadRow);
                    }
                }
            }
        }
    });
    threadObserver.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
