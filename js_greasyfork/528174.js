// ==UserScript==
// @name         DTF User Notes
// @version      1.4
// @description  Add notes to users on dtf.ru
// @author       Avicenna
// @match        https://dtf.ru/*
// @license      MIT
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/528174/DTF%20User%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/528174/DTF%20User%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки, является ли текущая страница профилем пользователя
    function isUserProfilePage() {
        const path = window.location.pathname;
        return /^\/(u\/\d+-[^\/]+|id\d+|[\w-]+)(\/comments)?\/?$/.test(path);
    }

    // Функция для создания заметки
    function createNote(userId, username) {
        const currentNote = localStorage.getItem(`note_${userId}`);
        const currentColor = localStorage.getItem(`note_color_${userId}`) || 'gray';

        const noteText = prompt(`Введите заметку для пользователя ${username}:`, currentNote || '');
        if (noteText === null) return;

        const useRedText = confirm("Сделать текст заметки красным? (ОК - да, Отмена - нет)");
        const textColor = useRedText ? 'red' : 'gray';

        localStorage.setItem(`note_${userId}`, noteText);
        localStorage.setItem(`note_color_${userId}`, textColor);
        displayUserNotes();
    }

    // Функция для извлечения ID пользователя из ссылки или JSON-LD
    function extractUserId(hrefOrPath) {
        // Проверяем старый формат ссылки: /u/12345-username
        const oldFormatMatch = hrefOrPath.match(/\/u\/(\d+)-/);
        if (oldFormatMatch) return oldFormatMatch[1];

        // Проверяем новый формат ссылки: /id12345
        const newFormatMatch = hrefOrPath.match(/\/id(\d+)/);
        if (newFormatMatch) return newFormatMatch[1];

        // Для кастомных ссылок (/username) ищем JSON-LD блок
        if (/^\/([\w-]+)$/.test(hrefOrPath)) {
            const jsonLdScript = document.querySelector('script[type="application/ld+json"][data-hid]');
            if (jsonLdScript) {
                try {
                    const jsonLd = JSON.parse(jsonLdScript.textContent);
                    if (jsonLd["@graph"] && jsonLd["@graph"][0] && jsonLd["@graph"][0].mainEntity) {
                        return jsonLd["@graph"][0].mainEntity.identifier.toString();
                    }
                } catch (e) {
                    console.error("Error parsing JSON-LD:", e);
                }
            }
        }

        return null;
    }

    // Функция для отображения заметок рядом с ником пользователя
    function displayUserNotes() {
        // Отображение заметок в постах и комментариях
        const authors = document.querySelectorAll('.author__name, .comment__author, .content-header__author a, .user-link, .comment-item__user-link');
        authors.forEach(author => {
            if (author.href || author.getAttribute('data-router-link')) {
                const href = author.href || author.getAttribute('data-router-link');
                const userId = extractUserId(href);
                if (userId) {
                    const note = localStorage.getItem(`note_${userId}`);
                    const textColor = localStorage.getItem(`note_color_${userId}`) || 'gray';

                    if (note) {
                        // Удаляем старую заметку, если она есть
                        const existingNote = author.parentNode.querySelector('.user-note');
                        if (existingNote) existingNote.remove();

                        const noteSpan = document.createElement('span');
                        noteSpan.innerText = ` ${note}`;
                        noteSpan.classList.add('user-note');
                        noteSpan.style.color = textColor;
                        noteSpan.style.marginLeft = '5px';
                        noteSpan.style.padding = '2px 5px';
                        noteSpan.style.borderRadius = '3px';

                        author.parentNode.insertBefore(noteSpan, author.nextSibling);
                    }
                }
            }
        });

        // Отображение заметки в профиле (только если это не превью)
        const profileCards = document.querySelectorAll('.subsite-card:not(.subsite-card--preview)');
        profileCards.forEach(card => {
            const profileName = card.querySelector('.subsite-card__name h1');
            if (profileName) {
                const userId = extractUserId(window.location.pathname);
                if (userId) {
                    const note = localStorage.getItem(`note_${userId}`);
                    const textColor = localStorage.getItem(`note_color_${userId}`) || 'gray';

                    if (note) {
                        // Удаляем старую заметку, если она есть
                        const existingNote = profileName.parentNode.querySelector('.user-note');
                        if (existingNote) existingNote.remove();

                        const noteSpan = document.createElement('span');
                        noteSpan.innerText = ` ${note}`;
                        noteSpan.classList.add('user-note');
                        noteSpan.style.color = textColor;
                        noteSpan.style.marginLeft = '5px';
                        noteSpan.style.padding = '2px 5px';
                        noteSpan.style.borderRadius = '3px';

                        profileName.parentNode.insertBefore(noteSpan, profileName.nextSibling);
                    }
                }
            }
        });
    }

    // Функция для экспорта заметок в JSON
    function exportNotes() {
        const notes = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('note_') && !key.startsWith('note_color_')) {
                const userId = key.replace('note_', '');
                const note = localStorage.getItem(key);
                const color = localStorage.getItem(`note_color_${userId}`) || 'gray';
                notes[userId] = { note, color };
            }
        }

        const json = JSON.stringify(notes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Форматируем дату и время для имени файла
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const fileName = `dtf_notes_${formattedDate}_${formattedTime}.json`;

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Функция для импорта заметок из JSON
    function importNotes(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Предупреждение перед импортом
        const warningMessage = `
            Внимание! Импорт удалит все текущие заметки.
            Убедитесь, что у вас есть резервная копия.
            Продолжить?
        `;

        const isConfirmed = confirm(warningMessage);
        if (!isConfirmed) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const json = e.target.result;
            const notes = JSON.parse(json);

            // Очищаем все существующие заметки
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('note_') || key.startsWith('note_color_')) {
                    localStorage.removeItem(key);
                }
            }

            // Добавляем только те заметки, которые есть в файле
            for (const userId in notes) {
                if (notes.hasOwnProperty(userId)) {
                    localStorage.setItem(`note_${userId}`, notes[userId].note);
                    localStorage.setItem(`note_color_${userId}`, notes[userId].color);
                }
            }

            displayUserNotes();
        };
        reader.readAsText(file);
    }

    // Функция для проверки, есть ли в меню пункт "Заблокировать"
    function hasBlockOption(menu) {
        const options = menu.querySelectorAll('.context-list-option__label');
        for (let option of options) {
            if (option.textContent.trim() === 'Заблокировать' || option.textContent.trim() === 'Разблокировать') {
                return true;
            }
        }
        return false;
    }

    // Функция для добавления кнопок в существующее выпадающее меню
    function addButtonsToExistingMenu() {
        const existingMenus = document.querySelectorAll('.context-list');

        existingMenus.forEach(menu => {
            // Проверяем, что это меню профиля пользователя и есть пункт "Заблокировать"
            if (!isUserProfilePage() || !hasBlockOption(menu)) return;

            // Проверяем, что кнопки еще не добавлены
            if (menu.querySelector('.custom-note-button')) return;

            // Получаем имя пользователя из страницы
            const usernameElement = document.querySelector('.subsite-card__name h1');
            if (!usernameElement) return;
            const username = usernameElement.textContent;

            // Получаем ID пользователя из URL или JSON-LD
            const userId = extractUserId(window.location.pathname);
            if (!userId) return;

            // Создаем кнопку "Добавить заметку"
            const addNoteOption = document.createElement('div');
            addNoteOption.classList.add('context-list-option', 'context-list-option--with-art', 'custom-note-button');
            addNoteOption.style = '--press-duration: 140ms;';
            addNoteOption.innerHTML = `
                <div class="context-list-option__art context-list-option__art--icon">
                    <svg class="icon icon--note" width="20" height="20"><use xlink:href="#note"></use></svg>
                </div>
                <div class="context-list-option__label">Добавить заметку</div>
            `;
            addNoteOption.onclick = () => createNote(userId, username);

            // Создаем кнопку "Экспорт заметок"
            const exportOption = document.createElement('div');
            exportOption.classList.add('context-list-option', 'context-list-option--with-art', 'custom-note-button');
            exportOption.style = '--press-duration: 140ms;';
            exportOption.innerHTML = `
                <div class="context-list-option__art context-list-option__art--icon">
                    <svg class="icon icon--export" width="20" height="20"><use xlink:href="#export"></use></svg>
                </div>
                <div class="context-list-option__label">Экспорт заметок</div>
            `;
            exportOption.onclick = exportNotes;

            // Создаем кнопку "Импорт заметок"
            const importOption = document.createElement('div');
            importOption.classList.add('context-list-option', 'context-list-option--with-art', 'custom-note-button');
            importOption.style = '--press-duration: 140ms;';
            importOption.innerHTML = `
                <div class="context-list-option__art context-list-option__art--icon">
                    <svg class="icon icon--import" width="20" height="20"><use xlink:href="#import"></use></svg>
                </div>
                <div class="context-list-option__label">Импорт заметок</div>
            `;
            importOption.onclick = () => {
                const importInput = document.createElement('input');
                importInput.type = 'file';
                importInput.accept = '.json';
                importInput.style.display = 'none';
                importInput.onchange = importNotes;
                importInput.click();
            };

            // Добавляем разделитель перед нашими кнопками
            const separator = document.createElement('div');
            separator.style.height = '1px';
            separator.style.backgroundColor = 'var(--color-border)';
            separator.style.margin = '4px 0';

            // Добавляем элементы в меню
            menu.appendChild(separator);
            menu.appendChild(addNoteOption);
            menu.appendChild(exportOption);
            menu.appendChild(importOption);
        });
    }

    // Функция для запуска после загрузки DOM
    function init() {
        if (document.querySelector('.subsite-card__header')) {
            displayUserNotes();
            addButtonsToExistingMenu();
        }
    }

    // Оптимизация: debounce для вызова displayUserNotes
    let debounceTimer;
    function debounceDisplayUserNotes() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => displayUserNotes(), 300); // Задержка 300 мс
    }

    // Отслеживание изменений на странице
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (document.querySelector('.subsite-card__header')) {
                    addButtonsToExistingMenu();
                }

                // Вызываем displayUserNotes с задержкой
                debounceDisplayUserNotes();
            }
        }
    });

    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Запуск функций при загрузке страницы
    init();
})();