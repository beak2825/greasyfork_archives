// ==UserScript==
// @name         RGB Palitra dlya Zelenka.guru
// @namespace    https://zelenka.guru/p_gr/ | Wi33y
// @version      6.5
// @description  RGB Палитра для Zelenka.guru
// @author       Your Name
// @match        https://zelenka.guru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476874/RGB%20Palitra%20dlya%20Zelenkaguru.user.js
// @updateURL https://update.greasyfork.org/scripts/476874/RGB%20Palitra%20dlya%20Zelenkaguru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем контейнер для кнопок
    const container = document.createElement('div');
    container.style.display = 'inline-block'; //  inline-block
    container.style.verticalAlign = 'middle'; // Выравниваем
    container.style.marginTop = '5px'; //

    // Создаем кнопку "Выбрать цвет" с иконкой
    const colorButton = createButton('Выбрать цвет', 'fal fa-paint-brush', '#222', toggleColorMenu);

    // Создаем кнопку "Применить цвет" с иконкой
    const applyButton = createButton('Применить цвет', 'fal fa-check', '#222', applyColor);

    // Создаем меню выбора RGB цвета
    const rgbColorMenu = document.createElement('input');
    rgbColorMenu.type = 'color'; //
    rgbColorMenu.style.zIndex = '9999';
    rgbColorMenu.style.display = 'none'; //
    rgbColorMenu.style.left = 'calc(100% + 10px)'; //
    rgbColorMenu.style.top = '0'; //

    // Добавляем кнопки "Выбрать цвет" и "Применить цвет" в контейнер
    container.appendChild(colorButton);
    container.appendChild(applyButton);

    // Добавляем контейнер в контейнер редактора
    const editorToolbar = document.querySelector('.fr-toolbar');
    if (editorToolbar) {
        editorToolbar.appendChild(container);
        editorToolbar.appendChild(rgbColorMenu); //

        colorButton.addEventListener('click', toggleColorMenu);
    }

    // Функция для создания кнопки с заданными параметрами
    function createButton(text, iconClass, bgColor, clickHandler) {
        const button = document.createElement('span');
        button.style.padding = '3px 8px'; //
        button.style.backgroundColor = bgColor; //
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.lineHeight = '1'; //
        button.style.color = 'white'; //
        button.style.display = 'inline-block'; //
        button.style.verticalAlign = 'middle'; //

        // Создаем иконку для кнопки
        const icon = document.createElement('i');
        icon.className = iconClass; //
        icon.style.marginRight = '3px'; //

        button.appendChild(icon);
        button.appendChild(document.createTextNode(text));

        button.addEventListener('click', clickHandler);

        return button;
    }

    // Функция для переключения видимости меню выбора цвета
    function toggleColorMenu() {
        if (rgbColorMenu.style.display === 'none' || rgbColorMenu.style.display === '') {
            rgbColorMenu.style.display = 'block';
        } else {
            rgbColorMenu.style.display = 'none';
        }
    }

    // Функция для применения цвета к выделенному тексту
    function applyColor() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.color = rgbColorMenu.value;
            range.surroundContents(span);
        }
        rgbColorMenu.style.display = 'none'; //
    }
})();
