// ==UserScript==
// @name         Счетчик жалоб "Ожидание"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Показывает точное количество жалоб с префиксом "Ожидание" на странице.
// @author       Ваше Имя (или псевдоним)
// @match        *://*https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.994/* // <<<=== ИЗМЕНИТЕ ЭТОТ АДРЕС на URL страницы с жалобами
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534190/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%22%D0%9E%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%22.user.js
// @updateURL https://update.greasyfork.org/scripts/534190/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%22%D0%9E%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Настройки ---
    // !!! ВАЖНО: Измените этот CSS-селектор, чтобы он точно указывал на элементы,
    // содержащие текст статуса или заголовка жалобы.
    // Пример: Если текст "Ожидание: ..." находится внутри <span class="status">, используйте '.status'
    // Пример: Если это заголовок ссылки в списке <li>, может быть 'li a.complaint-title'
    const complaintElementSelector = '.complaint-title'; // <<<=== ИЗМЕНИТЕ ЭТОТ СЕЛЕКТОР

    const prefix = 'Ожидание'; // Префикс для поиска (учитывает регистр)
    // --- Конец настроек ---

    function countComplaints() {
        // Находим все элементы, соответствующие селектору
        const elements = document.querySelectorAll(complaintElementSelector);
        let count = 0;

        // Проходим по найденным элементам
        elements.forEach(element => {
            // Получаем текстовое содержимое элемента, удаляем лишние пробелы по краям
            const textContent = element.textContent.trim();
            // Проверяем, начинается ли текст с нужного префикса
            if (textContent.startsWith(prefix)) {
                count++;
            }
        });

        return count;
    }

    function displayCount(count) {
        // Пытаемся найти существующий элемент для отображения счетчика (если он уже был создан)
        let displayBox = document.getElementById('waiting-complaint-counter');

        // Если элемент не найден, создаем новый
        if (!displayBox) {
            displayBox = document.createElement('div');
            displayBox.id = 'waiting-complaint-counter';
            // Стили для отображения счетчика (можете настроить по своему вкусу)
            displayBox.style.position = 'fixed';
            displayBox.style.top = '10px';
            displayBox.style.right = '10px';
            displayBox.style.padding = '5px 10px';
            displayBox.style.backgroundColor = 'rgba(255, 255, 0, 0.8)'; // Полупрозрачный желтый
            displayBox.style.border = '1px solid black';
            displayBox.style.zIndex = '9999'; // Поверх других элементов
            displayBox.style.fontSize = '14px';
            displayBox.style.color = 'black';
            document.body.appendChild(displayBox); // Добавляем элемент на страницу
        }

        // Обновляем текст счетчика
        displayBox.textContent = `Жалобы "${prefix}": ${count}`;
    }

    // --- Основная логика ---

    // Запускаем подсчет и отображение после полной загрузки страницы
    // Используем requestAnimationFrame для ожидания отрисовки, если элементы появляются динамически
    function runCounter() {
       const count = countComplaints();
       displayCount(count);
    }

    // Запускаем сразу и на всякий случай через небольшую задержку,
    // если контент загружается динамически.
    runCounter();
    setTimeout(runCounter, 1000); // Повторный запуск через 1 секунду
    setTimeout(runCounter, 3000); // Повторный запуск через 3 секунды

    // Дополнительно: можно использовать MutationObserver для отслеживания изменений DOM,
    // если жалобы добавляются/обновляются без перезагрузки страницы.
    // Это более сложный, но надежный подход для динамических страниц.
    /*
    const observer = new MutationObserver(runCounter);
    observer.observe(document.body, { childList: true, subtree: true });
    */


})();
