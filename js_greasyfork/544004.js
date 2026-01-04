// ==UserScript==
// @name         notes panel
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  notes panel from catliife
// @author       https://m.vk.com/modsforcatlife?from=groups
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544004/notes%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/544004/notes%20panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.gameNotesModAdded) return;
    window.gameNotesModAdded = true;

    // Стили для всех элементов (остаются без изменений)
    var style = document.createElement('style');
    style.textContent = `
        #notes-mod-container {
            position: fixed;
            top: 10px;
            right: 150px;
            z-index: 9999;
            font-family: 'Roboto', sans-serif;
        }

        #notes-toggle-btn {
            background: rgba(34, 34, 34, 0.8);
            color: #FF9500;
            border: none;
            padding: 8px 16px;
            border-radius: 18px;
            cursor: pointer;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(5px);
        }

        #notes-toggle-btn:hover {
            background: rgba(42, 42, 42, 0.8);
        }

        #notes-toggle-btn::before {
            content: "✏️";
        }

        #notes-panel {
            display: none;
            background: rgba(30, 30, 30, 0.9);
            border-radius: 12px;
            width: 350px;
            height: 500px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            flex-direction: column;
            backdrop-filter: blur(5px);
        }

        .notes-header {
            background: rgba(37, 37, 37, 0.9);
            color: #FF9500;
            padding: 16px;
            font-weight: 500;
            border-bottom: 1px solid #333;
            flex-shrink: 0;
        }

        .notes-tabs {
            display: flex;
            background: rgba(37, 37, 37, 0.9);
            padding: 8px;
            overflow-x: auto;
            border-bottom: 1px solid #333;
            flex-shrink: 0;
            scrollbar-width: none;
        }

        .notes-tabs::-webkit-scrollbar {
            display: none;
        }

        .notes-tab {
            padding: 8px 16px;
            cursor: pointer;
            white-space: nowrap;
            border-radius: 8px;
            color: #AAA;
            font-size: 14px;
            margin-right: 4px;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .notes-tab.active {
            background: rgba(51, 51, 51, 0.9);
            color: #FF9500;
            font-weight: 500;
        }

        .notes-content-wrapper {
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .notes-content {
            padding: 16px;
            overflow-y: auto;
            line-height: 1.5;
            border: 1px solid rgba(51, 51, 51, 0.5);
            margin: 16px;
            border-radius: 8px;
            background: rgba(37, 37, 37, 0.7);
            flex-grow: 1;
            white-space: pre-wrap;
        }

        .note-editor {
            display: none;
            padding: 0 16px;
            flex-grow: 1;
            overflow: hidden;
            flex-direction: column;
        }

        .note-editor.active {
            display: flex;
        }

        .note-title-input {
            width: calc(100% - 24px);
            padding: 8px 12px;
            margin: 16px 12px 12px;
            background: rgba(51, 51, 51, 0.7);
            color: #FFF;
            border: 1px solid rgba(68, 68, 68, 0.5);
            border-radius: 8px;
            font-size: 16px;
        }

        .note-content-textarea {
            width: calc(100% - 24px);
            padding: 12px;
            margin: 0 12px;
            background: rgba(51, 51, 51, 0.7);
            color: #FFF;
            border: 1px solid rgba(68, 68, 68, 0.5);
            border-radius: 8px;
            resize: none;
            flex-grow: 1;
            min-height: 100px;
            font-family: 'Roboto', monospace;
            white-space: pre-wrap;
        }

        .notes-controls {
            display: flex;
            padding: 8px 12px;
            background: rgba(37, 37, 37, 0.9);
            border-top: 1px solid #333;
            gap: 6px;
            flex-shrink: 0;
        }

        .notes-btn {
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            border: none;
            transition: background 0.2s;
            font-size: 13px;
        }

        .add-btn {
            background: #FF9500;
            color: #222;
            margin-right: auto;
            padding: 6px 12px;
        }

        .add-btn:hover {
            background: #ffaa33;
        }

        .delete-btn {
            background: rgba(51, 51, 51, 0.7);
            color: #FF3B30;
        }

        .delete-btn:hover {
            background: rgba(68, 68, 68, 0.7);
        }

        .save-btn {
            background: rgba(51, 51, 51, 0.7);
            color: #34C759;
        }

        .save-btn:hover {
            background: rgba(68, 68, 68, 0.7);
        }

        .edit-btn {
            background: rgba(51, 51, 51, 0.7);
            color: #4DABFF;
            display: none;
        }

        .edit-btn:hover {
            background: rgba(68, 68, 68, 0.7);
        }

        .notes-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .no-notes {
            padding: 20px;
            text-align: center;
            color: #666;
        }

        .note-date {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
        }

        /* Стили для HTML-элементов */
        .notes-content h1, .notes-content h2, .notes-content h3,
        .notes-content h4, .notes-content h5, .notes-content h6 {
            color: #FF9500;
            margin: 0.8em 0 0.4em;
            line-height: 1.2;
        }

        .notes-content h1 { font-size: 2em; font-weight: 500; }
        .notes-content h2 { font-size: 1.7em; font-weight: 500; }
        .notes-content h3 { font-size: 1.4em; }
        .notes-content h4 { font-size: 1.2em; }
        .notes-content h5 { font-size: 1em; }
        .notes-content h6 { font-size: 0.9em; color: #AAA; }

        .notes-content p {
            margin: 0.7em 0;
            line-height: 1.5;
        }

        .notes-content a {
            color: #4DABFF;
            text-decoration: none;
        }

        .notes-content a:hover {
            text-decoration: underline;
        }

        .notes-content strong, .notes-content b {
            font-weight: bold;
            color: #FFAA33;
        }

        .notes-content em, .notes-content i {
            font-style: italic;
        }

        .notes-content u {
            text-decoration: underline;
        }

        .notes-content del {
            text-decoration: line-through;
            color: #888;
        }

        .notes-content blockquote {
            border-left: 3px solid #FF9500;
            padding-left: 12px;
            margin: 12px 0;
            color: #CCC;
        }

        .notes-content pre {
            background: rgba(37, 37, 37, 0.7);
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
            margin: 12px 0;
            white-space: pre-wrap;
        }

        .notes-content code {
            font-family: 'JetBrains Mono', monospace;
            background: rgba(37, 37, 37, 0.7);
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 0.9em;
        }

        .notes-content ul, .notes-content ol {
            padding-left: 24px;
            margin: 12px 0;
        }

        .notes-content li {
            margin: 6px 0;
        }

        .notes-content hr {
            border: none;
            height: 1px;
            background: #333;
            margin: 16px 0;
        }

        .notes-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 12px 0;
        }

        .notes-content th, .notes-content td {
            border: 1px solid #333;
            padding: 8px 12px;
            text-align: left;
        }

        .notes-content th {
            background: rgba(37, 37, 37, 0.7);
            color: #FF9500;
        }

        .notes-content img {
            max-width: 100%;
            border-radius: 4px;
            margin: 8px 0;
        }

        /* Цвета через style */
        .notes-content span[style*="color"] {
            padding: 0 2px;
        }

        /* Прокрутка */
        #notes-panel {
            scroll-behavior: smooth;
        }

        .notes-content::-webkit-scrollbar,
        .note-content-textarea::-webkit-scrollbar {
            width: 8px;
        }

        .notes-content::-webkit-scrollbar-track,
        .note-content-textarea::-webkit-scrollbar-track {
            background: rgba(37, 37, 37, 0.5);
        }

        .notes-content::-webkit-scrollbar-thumb,
        .note-content-textarea::-webkit-scrollbar-thumb {
            background: #FF9500;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);

    // Добавляем шрифты
    var fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=JetBrains+Mono&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Создаем структуру интерфейса
    var container = document.createElement('div');
    container.id = 'notes-mod-container';

    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'notes-toggle-btn';
    toggleBtn.textContent = 'Заметки';

    var notesPanel = document.createElement('div');
    notesPanel.id = 'notes-panel';

    var header = document.createElement('div');
    header.className = 'notes-header';
    header.textContent = 'Мои заметки';

    var tabsContainer = document.createElement('div');
    tabsContainer.className = 'notes-tabs';

    var contentWrapper = document.createElement('div');
    contentWrapper.className = 'notes-content-wrapper';

    var contentContainer = document.createElement('div');
    contentContainer.className = 'notes-content';

    var editorContainer = document.createElement('div');
    editorContainer.className = 'note-editor';

    var titleInput = document.createElement('input');
    titleInput.className = 'note-title-input';
    titleInput.placeholder = 'Название заметки';

    var contentTextarea = document.createElement('textarea');
    contentTextarea.className = 'note-content-textarea';
    contentTextarea.placeholder = 'Введите текст с HTML-тегами (<h1>, <b>, <color="red"> и др.)';

    editorContainer.appendChild(titleInput);
    editorContainer.appendChild(contentTextarea);

    var controlsContainer = document.createElement('div');
    controlsContainer.className = 'notes-controls';

    var addBtn = document.createElement('button');
    addBtn.className = 'notes-btn add-btn';
    addBtn.textContent = 'Новая';

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'notes-btn delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.disabled = true;

    var saveBtn = document.createElement('button');
    saveBtn.className = 'notes-btn save-btn';
    saveBtn.textContent = 'Сохранить';

    var editBtn = document.createElement('button');
    editBtn.className = 'notes-btn edit-btn';
    editBtn.textContent = 'Ред.';

    controlsContainer.appendChild(addBtn);
    controlsContainer.appendChild(deleteBtn);
    controlsContainer.appendChild(saveBtn);
    controlsContainer.appendChild(editBtn);

    contentWrapper.appendChild(contentContainer);
    notesPanel.appendChild(header);
    notesPanel.appendChild(tabsContainer);
    notesPanel.appendChild(contentWrapper);
    notesPanel.appendChild(editorContainer);
    notesPanel.appendChild(controlsContainer);

    container.appendChild(toggleBtn);
    container.appendChild(notesPanel);
    document.body.appendChild(container);

    // Логика работы
    var notes = JSON.parse(localStorage.getItem('game-notes') || '[]');
    var currentNoteIndex = notes.length > 0 ? notes.length - 1 : -1;
    var isScrolling = false;

    function saveNotes() {
        localStorage.setItem('game-notes', JSON.stringify(notes));
    }

    function formatDate(date) {
        return new Date(date).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderNotes() {
        tabsContainer.innerHTML = '';

        if (notes.length === 0) {
            contentContainer.innerHTML = '<div class="no-notes">Нет заметок</div>';
            editorContainer.classList.remove('active');
            contentWrapper.style.display = 'block';
            deleteBtn.disabled = true;
            saveBtn.disabled = true;
            editBtn.style.display = 'none';
            return;
        }

        notes.forEach(function(note, index) {
            var tab = document.createElement('div');
            tab.className = 'notes-tab ' + (index === currentNoteIndex ? 'active' : '');
            tab.textContent = note.title || 'Без названия';
            tab.onclick = function() {
                currentNoteIndex = index;
                showNoteView(); // Добавлено: переключаем в режим просмотра при выборе заметки
                renderNotes();
            };
            tabsContainer.appendChild(tab);
        });

        var note = notes[currentNoteIndex];
        if (editorContainer.classList.contains('active')) {
            titleInput.value = note.title || '';
            contentTextarea.value = note.content || '';
        } else {
            // Безопасный рендеринг HTML
            var content = note.content || '';
            // Исправляем тег color
            content = content.replace(/<color=(['"])(.*?)\1>/gi, '<span style="color: $2">');
            content = content.replace(/<\/color>/gi, '</span>');
            contentContainer.innerHTML = content;

            if (note.updatedAt) {
                var dateElement = document.createElement('div');
                dateElement.className = 'note-date';
                dateElement.textContent = formatDate(note.updatedAt);
                contentContainer.appendChild(dateElement);
            }
        }

        deleteBtn.disabled = false;
        saveBtn.disabled = false;

        // Прокручиваем к активной вкладке
        if (tabsContainer.scrollWidth > tabsContainer.clientWidth) {
            var activeTab = tabsContainer.querySelector('.notes-tab.active');
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }

    function showNoteView() {
        editorContainer.classList.remove('active');
        contentWrapper.style.display = 'block';
        saveBtn.style.display = 'inline-block';
        editBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';

        // Обновляем содержимое заметки при переключении в режим просмотра
        if (currentNoteIndex >= 0) {
            var note = notes[currentNoteIndex];
            var content = note.content || '';
            content = content.replace(/<color=(['"])(.*?)\1>/gi, '<span style="color: $2">');
            content = content.replace(/<\/color>/gi, '</span>');
            contentContainer.innerHTML = content;

            if (note.updatedAt) {
                var dateElement = document.createElement('div');
                dateElement.className = 'note-date';
                dateElement.textContent = formatDate(note.updatedAt);
                contentContainer.appendChild(dateElement);
            }
        }
    }

    function showEditorView() {
        editorContainer.classList.add('active');
        contentWrapper.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'inline-block';
        contentTextarea.focus();

        // Обновляем содержимое редактора при переключении в режим редактирования
        if (currentNoteIndex >= 0) {
            var note = notes[currentNoteIndex];
            titleInput.value = note.title || '';
            contentTextarea.value = note.content || '';
        }
    }

    // Обработчики событий
    toggleBtn.addEventListener('click', function() {
        notesPanel.style.display = notesPanel.style.display === 'none' ? 'flex' : 'none';
        if (notesPanel.style.display === 'flex') {
            renderNotes();
        }
    });

    addBtn.addEventListener('click', function() {
        var newNote = {
            title: 'Новая заметка',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.push(newNote);
        currentNoteIndex = notes.length - 1;
        saveNotes();
        renderNotes();
        showEditorView();
        titleInput.focus();
    });

    deleteBtn.addEventListener('click', function() {
        if (currentNoteIndex >= 0 && confirm('Удалить эту заметку?')) {
            notes.splice(currentNoteIndex, 1);
            currentNoteIndex = notes.length > 0 ? Math.min(currentNoteIndex, notes.length - 1) : -1;
            saveNotes();
            renderNotes();
        }
    });

    titleInput.addEventListener('input', function() {
        if (currentNoteIndex >= 0) {
            notes[currentNoteIndex].title = titleInput.value;
            notes[currentNoteIndex].updatedAt = new Date().toISOString();
            saveNotes();
            renderNotes();
        }
    });

    contentTextarea.addEventListener('input', function() {
        if (currentNoteIndex >= 0) {
            notes[currentNoteIndex].content = contentTextarea.value;
            notes[currentNoteIndex].updatedAt = new Date().toISOString();
            saveNotes();
        }
    });

    saveBtn.addEventListener('click', function() {
        if (currentNoteIndex >= 0) {
            saveNotes();
            showNoteView();
        }
    });

    editBtn.addEventListener('click', function() {
        if (currentNoteIndex >= 0) {
            showEditorView();
        }
    });

    contentContainer.addEventListener('dblclick', function() {
        if (currentNoteIndex >= 0) {
            showEditorView();
        }
    });

    // Прокрутка между заметками колесиком
    tabsContainer.addEventListener('wheel', function(e) {
        if (isScrolling) return;

        isScrolling = true;
        e.preventDefault();

        if (notes.length > 1) {
            currentNoteIndex = (currentNoteIndex + (e.deltaY > 0 ? 1 : -1) + notes.length) % notes.length;
            showNoteView(); // Добавлено: переключаем в режим просмотра при прокрутке
            renderNotes();
        }

        setTimeout(() => { isScrolling = false; }, 100);
    });

    // Прокрутка содержимого заметки колесиком
    contentContainer.addEventListener('wheel', function(e) {
        this.scrollTop += e.deltaY;
        e.preventDefault();
    });

    // Прокрутка всей панели
    notesPanel.addEventListener('wheel', function(e) {
        if (e.target === notesPanel) {
            this.scrollTop += e.deltaY;
            e.preventDefault();
        }
    });

    // Инициализация
    notesPanel.style.display = 'none'
    editBtn.style.display = 'none';
    if (notes.length > 0) {
        renderNotes();
    }

    console.log('Мод "Заметки" с полной HTML-поддержкой успешно загружен!');
})();