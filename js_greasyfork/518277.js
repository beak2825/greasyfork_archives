// ==UserScript==
// @name         ! Скрипт для создания нескольких счетчиков с кнопками + и -
// @namespace    https://forum.blackrussia.online/
// @version      0.0.2
// @description  Botir_Soliev   vk.com/id250006978
// @author       Botir_Soliev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @description Скрипт для создания нескольких счетчиков с кнопками + и -
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/518277/%21%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%B8%D1%85%20%D1%81%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%20%D1%81%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8%20%2B%20%D0%B8%20-.user.js
// @updateURL https://update.greasyfork.org/scripts/518277/%21%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%B8%D1%85%20%D1%81%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%20%D1%81%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8%20%2B%20%D0%B8%20-.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем контейнер для всех счетчиков
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%'; // Центрируем по вертикали
    container.style.right = '10px'; // Отступ от правого края
    container.style.transform = 'translateY(-50%)'; // Центрируем по вертикали
    container.style.zIndex = '9999'; // Убедитесь, что контейнер поверх других элементов
    document.body.appendChild(container);

    // Функция для создания счетчика
    function createCounter(counterId) {
        const counterElement = document.createElement('div');
        counterElement.style.margin = '5px'; // Уменьшен отступ между счетчиками
        counterElement.style.padding = '5px'; // Уменьшен внутренний отступ
        counterElement.style.border = '1px solid #ccc';
        counterElement.style.borderRadius = '5px';
        counterElement.style.display = 'inline-block';
        counterElement.style.fontSize = '14px'; // Уменьшен размер шрифта
        
        const counterDisplay = document.createElement('span');
        counterDisplay.innerText = `Счетчик ${counterId}: ${localStorage.getItem(counterId) || 0}`;
        counterDisplay.style.marginRight = '5px'; // Уменьшен отступ между текстом и кнопками

        const incrementButton = document.createElement('button');
        incrementButton.innerText = '+';
        incrementButton.style.marginRight = '3px'; // Уменьшен отступ между кнопками
        incrementButton.style.fontSize = '12px'; // Уменьшен размер шрифта кнопки
        incrementButton.onclick = () => {
            let count = parseInt(localStorage.getItem(counterId)) || 0;
            count++;
            localStorage.setItem(counterId, count);
            counterDisplay.innerText = `Счетчик ${counterId}: ${count}`;
        };

        const decrementButton = document.createElement('button');
        decrementButton.innerText = '-';
        decrementButton.style.marginRight = '3px'; // Уменьшен отступ между кнопками
        decrementButton.style.fontSize = '12px'; // Уменьшен размер шрифта кнопки
        decrementButton.onclick = () => {
            let count = parseInt(localStorage.getItem(counterId)) || 0;
            count = count > 0 ? count - 1 : 0; // Не даем счетчику стать отрицательным
            localStorage.setItem(counterId, count);
            counterDisplay.innerText = `Счетчик ${counterId}: ${count}`;
        };

        counterElement.appendChild(counterDisplay);
        counterElement.appendChild(incrementButton);
        counterElement.appendChild(decrementButton);
        container.appendChild(counterElement);
    }

    // Создаем несколько счетчиков
    createCounter('counter1');
    createCounter('counter2');
    createCounter('counter3');
})();
