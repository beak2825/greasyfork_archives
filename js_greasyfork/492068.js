// ==UserScript==
// @name         Копировать текст книги по нажатию кнопки с litnet.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Копировать текст книги по нажатию кнопки на сайте litnet.com
// @author       Canine
// @match        http://litnet.com/*
// @match        https://litnet.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/492068/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%20%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8%20%D0%BF%D0%BE%20%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D1%8E%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D1%81%20litnetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/492068/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%20%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8%20%D0%BF%D0%BE%20%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D1%8E%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D1%81%20litnetcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для копирования текста в буфер обмена
    function copyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    // Функция для обработки нажатия на кнопку
    function handleCopyButtonClick() {
        var textToCopy = '';

        // Проверяем наличие элемента h2 без классов и копируем текст из него, если он найден
        var elementH2 = document.querySelector('h2:not([class])');
        if (elementH2) {
            textToCopy += elementH2.innerText + '\n';
        }

        // Получаем текст из элемента с классом "jsReaderText"
        var elementReaderText = document.querySelector('.jsReaderText');
        if (elementReaderText) {
            textToCopy += elementReaderText.innerText;
        }

        if (textToCopy) {
            copyTextToClipboard(textToCopy);
            alert('Текст скопирован в буфер обмена!');
        } else {
            alert('Текст не найден для копирования.');
        }
    }

    // Создаем кнопку
    var button = document.createElement('button');
    button.innerHTML = 'Копировать текст';
    button.style.position = 'fixed'; // стиль кнопки
    button.style.top = '10px'; // расположение кнопки сверху
    button.style.right = '10px'; // расположение кнопки справа
    button.style.zIndex = '9999'; // устанавливаем высокий z-index, чтобы кнопка была поверх других элементов
    button.style.backgroundColor = 'blue'; // меняем цвет фона кнопки
    button.style.color = 'white'; // меняем цвет текста на кнопке
    button.style.padding = '5px 10px'; // устанавливаем отступы
    button.style.border = 'none'; // убираем границу кнопки
    button.style.cursor = 'pointer'; // меняем курсор при наведении
    button.addEventListener('click', handleCopyButtonClick);

    // Добавляем кнопку в элемент body
    document.body.appendChild(button);
})();