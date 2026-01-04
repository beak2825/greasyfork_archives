// ==UserScript==
// @name         Антирепорт v1
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  отдельная благодарность абузерам репортов
// @author       steamuser
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486352/%D0%90%D0%BD%D1%82%D0%B8%D1%80%D0%B5%D0%BF%D0%BE%D1%80%D1%82%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/486352/%D0%90%D0%BD%D1%82%D0%B8%D1%80%D0%B5%D0%BF%D0%BE%D1%80%D1%82%20v1.meta.js
// ==/UserScript==

// Текст для вставки
let insertText = "[exceptids=]    [/exceptids]";

(function() {
    'use strict';

    // Создаем кнопку
    let button = document.createElement('button');
    button.style.width = '20px'; // Изменяем размеры кнопки до 20 на 20 единиц
    button.style.height = '20px';
    button.style.marginTop = '2px'; // Опускаем кнопку на 2 единицы
    button.style.backgroundColor = 'rgb(240,0,0)'; // Покрасить кнопку в rgb(240,0,0)
    button.style.borderRadius = '50%'; // Сделать кнопку круглой
    button.innerHTML = '<b>!</b>'; // Заменяем текст на "!", делаем его жирным

    // Добавляем обработчик событий для кнопки
    button.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault(); // Предотвращаем отправку формы

        let textArea = document.querySelector('.fr-element');
        let currentText = textArea.textContent || textArea.innerText;

        // Если текст из insertText уже есть в поле для ввода текста, выходим из обработчика событий
        if (currentText.includes(insertText)) {
            return;
        }

        textArea.focus(); // Переносим фокус на текстовое поле
        let sel = window.getSelection();
        let range = sel.getRangeAt(0);
        range.deleteContents();
        let textNode = document.createTextNode(insertText);
        range.insertNode(textNode);
        range.setStart(textNode, textNode.length - 12); // Сдвигаем курсор на 12 знаков назад
        range.setEnd(textNode, textNode.length - 12);
        sel.removeAllRanges();
        sel.addRange(range);

        // Удаляем текст-заполнитель "Напишите ответ..."
        let placeholder = document.querySelector('.fr-placeholder');
        if (placeholder) {
            placeholder.textContent = '';
        }
    });

    // Добавляем кнопку в контейнер
    let container = document.querySelector('.lzt-fe-se-extraButtonsContainer');
    container.insertBefore(button, container.firstChild);
})();
