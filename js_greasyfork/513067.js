// ==UserScript==
// @name         Цвет статуса
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Возвращаем возможность менять цвет статуса как из стиля "Old"
// @author       Lolzteam
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513067/%D0%A6%D0%B2%D0%B5%D1%82%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/513067/%D0%A6%D0%B2%D0%B5%D1%82%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для изменения цвета статуса
    function updateStatusColor() {
        const statusElements = document.querySelectorAll('.userBlurb.current_text, .userStatus.userBlurb.userCounter.item.muted');
        statusElements.forEach((element) => {
            const color = localStorage.getItem('statusColor') || '#000000'; // Черный по умолчанию
            element.style.color = color;
        });
    }

    // Функция для добавления интерфейса выбора цвета на странице профиля
    function addColorPicker() {
        const profilePageUrl = 'https://lolz.live/account/personal-details';
        if (window.location.href.startsWith(profilePageUrl)) {
            const container = document.querySelector('.section'); // Найдем контейнер на странице профиля
            if (container && !document.getElementById('statusColorPicker')) { // Проверяем, есть ли уже пикер
                const colorPickerDiv = document.createElement('div');
                colorPickerDiv.style.marginTop = '20px';
                colorPickerDiv.innerHTML = `
                    <label for="statusColorPicker">Выберите цвет своего статуса:</label>
                    <input type="color" id="statusColorPicker" name="statusColorPicker" value="${localStorage.getItem('statusColor') || '#000000'}">
                `;
                container.appendChild(colorPickerDiv);

                // Обработчик изменения цвета
                const colorPicker = document.getElementById('statusColorPicker');
                colorPicker.addEventListener('input', (event) => {
                    const chosenColor = event.target.value;
                    localStorage.setItem('statusColor', chosenColor);
                    updateStatusColor();
                });
            }
        }
    }

    // Дебаунс-функция для уменьшения частоты вызовов
    function debounce(fn, delay) {
        let timeoutID;
        return function(...args) {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => fn(...args), delay);
        };
    }

    // Оптимизированная функция для наблюдения за изменениями
    const optimizedUpdate = debounce(() => {
        updateStatusColor();
        addColorPicker();
    }, 100); // 100 мс задержка для уменьшения нагрузки

    // Используем MutationObserver с отслеживанием только в нужной области
    const observer = new MutationObserver(optimizedUpdate);
    const targetNode = document.querySelector('body'); // Наблюдаем только за телом документа

    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Выполняем начальную настройку
    updateStatusColor();
    addColorPicker();
})();
