// ==UserScript==
// @name         ! Счетчик
// @namespace    https://forum.blackrussia.online/
// @version      0.2
// @description  Botir_Soliev   vk.com/id250006978
// @author       Botir_Soliev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/518591/%21%20%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/518591/%21%20%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Создаем контейнер для всех счетчиков
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px'; // Отступ от нижней части
    container.style.right = '10px'; // Отступ от правого края
    container.style.zIndex = '9999'; // Убедитесь, что контейнер поверх других элементов
    document.body.appendChild(container);

    // Функция для создания счетчика
    function createCounter(counterId) {
        const counterElement = document.createElement('div');
        counterElement.style.margin = '5px'; // Уменьшен отступ между счетчиками
        counterElement.style.padding = '5px'; // Уменьшен внутренний отступ
        counterElement.style.border = '1px solid #ccc';
        counterElement.style.borderRadius = '5px';
        counterElement.style.display = 'flex'; // Используем flex для выравнивания
        counterElement.style.alignItems = 'center'; // Вертикальное выравнивание
        counterElement.style.fontSize = '14px'; // Уменьшен размер шрифта

        const counterDisplay = document.createElement('span');
        counterDisplay.innerText = `${counterId}: ${localStorage.getItem(counterId) || 0}`; // Используем шаблонные строки
        counterDisplay.style.marginRight = '10px';

        const incrementButton = document.createElement('button');
        incrementButton.innerText = '+';
        incrementButton.style.marginRight = '5px';
        incrementButton.onclick = () => {
            let count = parseInt(localStorage.getItem(counterId)) || 0;
            count++;
            localStorage.setItem(counterId, count);
            counterDisplay.innerText = `${counterId}: ${count}`; // Используем шаблонные строки
        };

        const decrementButton = document.createElement('button');
        decrementButton.innerText = '-';
        decrementButton.style.marginRight = '5px';
        decrementButton.onclick = () => {
            let count = parseInt(localStorage.getItem(counterId)) || 0;
            count = count > 0 ? count - 1 : 0; // Не даем счетчику стать отрицательным
            localStorage.setItem(counterId, count);
            counterDisplay.innerText = `${counterId}: ${count}`; // Используем шаблонные строки
        };

        counterElement.appendChild(counterDisplay);
        counterElement.appendChild(incrementButton);
        counterElement.appendChild(decrementButton);
        container.appendChild(counterElement);
    }

    // Создаем несколько счетчиков
    createCounter('Закрыл тем');
    createCounter('Одобрено');
    createCounter('Отказано');
})();

