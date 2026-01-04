// ==UserScript==
// @name         Цветовой Picker для форума Black Russia
// @namespace    https://blackrussia.online
// @version      1.2
// @description  Добавляет color picker для текста в редакторе форума Black Russia
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530258/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%BE%D0%B9%20Picker%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/530258/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%BE%D0%B9%20Picker%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Black%20Russia.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForEditor() {
        const toolbar = document.querySelector('.fr-toolbar'); // Панель редактора
        const textarea = document.querySelector('.fr-element[contenteditable="true"]'); // Само поле ввода

        if (toolbar && textarea) {
            addColorPicker(toolbar, textarea);
        } else {
            setTimeout(waitForEditor, 500);
        }
    }

    function addColorPicker(toolbar, editor) {
        // Создаём кнопку 🎨
        const btn = document.createElement('button');
        btn.textContent = '🎨';
        btn.title = 'Выбрать цвет текста';
        btn.style.padding = '4px';
        btn.style.fontSize = '16px';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';

        // Создаём input типа color
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.marginLeft = '5px';
        colorInput.style.cursor = 'pointer';
        colorInput.style.border = 'none';
        colorInput.style.background = 'transparent';

        // При выборе цвета — вставляем тег
        colorInput.addEventListener('input', () => {
            const color = colorInput.value;
            wrapSelectedText(editor, color);
        });

        // Добавляем в панель редактора
        toolbar.appendChild(btn);
        toolbar.appendChild(colorInput);
    }

    function wrapSelectedText(editor, color) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString() || 'текст';

        // Формируем HTML с BBCode
        const bbcode = `[color=${color}]${selectedText}[/color]`;

        // Заменяем выделенный текст
        range.deleteContents();
        range.insertNode(document.createTextNode(bbcode));

        // Убираем выделение
        selection.removeAllRanges();
    }

    waitForEditor();
})();