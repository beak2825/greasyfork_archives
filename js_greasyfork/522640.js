// ==UserScript==
// @name           VK_friends
// @name:ru        VK_friends
// @name:en        VK_friends
// @namespace      Violentmonkey Scripts
// @match          https://vk.com/friends?act=find
// @grant          none
// @version        1.01
// @author         public225989895
// @license        MIT
// @website        https://vk.com/o.drug
// @description:en The script adds 10,000 vkontakte friends quickly

// @description 01.01.2025, 13:24:00
// @downloadURL https://update.greasyfork.org/scripts/522640/VK_friends.user.js
// @updateURL https://update.greasyfork.org/scripts/522640/VK_friends.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let addCount = 0; // Счетчик добавлений
    const maxAddsPerHour = 59; // Максимум добавлений в час
    const intervalTime = 2000000 / maxAddsPerHour; // Интервал в миллисекундах между добавлениями

    function randomScrollTo(element) {
        // Генерируем случайное значение прокрутки от -500 до 100 пикселей
        const randomOffset = Math.floor(Math.random() * 501) - 100;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY + randomOffset;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }

    function addFriend() {
        // Находим все элементы <span> с классом vkuiButton__content
        const addButtons = Array.from(document.querySelectorAll('span.vkuiButton__content'));
        // Фильтруем только те, которые имеют текст "Добавить"
        const availableButtons = addButtons.filter(button => button.textContent.trim() === "Добавить" && !button.disabled);

        if (availableButtons.length > 0) {
            // Выбираем случайную кнопку из доступных
            const randomButton = availableButtons[Math.floor(Math.random() * availableButtons.length)];
            // Прокручиваем к элементу с рандомным смещением
            randomScrollTo(randomButton);

            // Генерируем случайное время ожидания перед нажатием (от 5000 до 1000 мс)
            const randomDelay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 999;

            // Нажимаем на элемент <span> с рандомной задержкой
            setTimeout(() => {
                randomButton.click();
                addCount++; // Увеличиваем счетчик добавлений
                console.log("Добавлен друг! Всего добавлено: " + addCount);

                // Проверяем, достигнут ли лимит
                if (addCount >= maxAddsPerHour) {
                    console.log("Достигнут лимит добавлений на этот час.");
                    return; // Прекращаем выполнение функции
                }
            }, randomDelay); // Задержка перед нажатием
        } else {
            console.log("Нет доступных кнопок для добавления друзей.");
        }
    }

    function startAdding() {
        // Запускаем добавление друзей с фиксированным интервалом
        addFriend();
        setTimeout(startAdding, intervalTime);
    }

    // Запускаем процесс добавления друзей
    startAdding();

    // Перезагружаем страницу каждые 200 секунд
    setInterval(() => {
        console.log("Перезагрузка страницы...");
        window.location.reload();
    }, 200000);
})();
