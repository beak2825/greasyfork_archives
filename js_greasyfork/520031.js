// ==UserScript==
// @name         Залишок оплати
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Сума "Залишилось сплатити"
// @author       LanNet
// @match        https://e-oboi.salesdrive.me/ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesdrive.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520031/%D0%97%D0%B0%D0%BB%D0%B8%D1%88%D0%BE%D0%BA%20%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/520031/%D0%97%D0%B0%D0%BB%D0%B8%D1%88%D0%BE%D0%BA%20%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isCalculating = false;  // Флаг для запобігання дублювання викликів

    // Список статусів, які потрібно враховувати для залишку
    const validStatuses = ["В друці", "В дорозі", "Прибув"];
    const receivedStatus = "Отримано";  // Статус, який рахується окремо

    // Функція для підсумовування цін у таблиці
    function calculateTotalPrice() {
        if (isCalculating) return;  // Якщо вже виконується підрахунок, не робимо повторний виклик
        isCalculating = true;  // Встановлюємо флаг, що обчислення йде

        // Знайдемо таблицю за класом
        const table = document.querySelector('table.table.table-bordered.table-condensed.custom-striped.col-resizable.table-order.w0');

        if (!table) {
            isCalculating = false;  // Скидаємо флаг
            return;
        }

        // Знайдемо всі елементи в таблиці з атрибутом "attr-field-name='restPay'" і відповідними класами
        const priceElements = table.querySelectorAll('div[attr-field-name="restPay"][p-editable-number][p-editable-finish][p-editable-tabulate]');

        let totalPrice = 0;  // Загальна сума для статусів "В друці", "В дорозі", "Прибув"
        let validCount = 0;  // Лічильник кількості валідних значень для залишку
        let receivedAmount = 0;  // Сума для статусу "Отримано"
        let receivedCount = 0;  // Лічильник заявок для статусу "Отримано"

        // Перебираємо знайдені елементи
        priceElements.forEach(function(element) {
            let priceText = element.textContent || element.innerText;

            // Знайти статус для цього рядка
            const row = element.closest('tr'); // Знайдемо рядок для поточної ціни
            const statusElement = row.querySelector('.status-badge'); // Знайдемо елемент зі статусом

            if (statusElement) {
                const status = statusElement.textContent.trim(); // Очищаємо текст статусу

                if (validStatuses.includes(status)) {
                    // Статус "В друці", "В дорозі", "Прибув"
                    priceText = priceText.replace(/[^\d.,-]/g, '').replace(',', '.');

                    let price = parseFloat(priceText);

                    if (!isNaN(price) && price > 0) {
                        totalPrice += price;  // Додаємо до загальної суми
                        validCount++;  // Збільшуємо лічильник
                    }
                } else if (status === receivedStatus) {
                    // Статус "Отримано"
                    priceText = priceText.replace(/[^\d.,-]/g, '').replace(',', '.');

                    let price = parseFloat(priceText);

                    if (!isNaN(price) && price > 0) {
                        receivedAmount += price;  // Додаємо до суми для "Отримано"
                        receivedCount++;  // Збільшуємо лічильник для "Отримано"
                    }
                }
            }
        });

        // Створюємо або оновлюємо повідомлення
        const messageContainer = document.querySelector('#wrap > div.container-fluid.order-index.ng-scope > div > div > div > div > div > div:nth-child(3) > div:nth-child(1)');

        if (messageContainer) {
            let messageElement = messageContainer.querySelector('.custom-message');

            if (!messageElement) {
                // Якщо повідомлення ще не було створено, створимо нове
                messageElement = document.createElement('div');
                messageElement.className = 'custom-message';  // Додаємо клас для зручності
                messageElement.style.padding = '10px';
                messageElement.style.marginTop = '10px';
                messageElement.style.backgroundColor = '#f8d7da';  // Легкий червоний фон для повідомлення
                messageElement.style.border = '1px solid #f5c6cb';
                messageElement.style.color = 'rgb(6 94 0)';
                messageElement.style.borderRadius = '5px';
                messageElement.style.display = 'contents';

                // Вставляємо повідомлення після елемента
                messageContainer.appendChild(messageElement);
            }

            // Оновлюємо вміст повідомлення
            messageElement.innerHTML = `
                <strong>${validCount}</strong> заявок. Залишок сплати: <strong>${totalPrice.toFixed(2)} грн.</strong> | <strong>${receivedCount}</strong> заявок отримано: <strong>${receivedAmount.toFixed(2)} грн.</strong>`;
        }

        // Знімаємо флаг після обчислення
        isCalculating = false;
    }

    // Перехоплюємо консольні повідомлення
    const originalConsoleLog = console.log;
    console.log = function(message) {
        // Перевіряємо, чи є повідомлення "Data from backend received"
        if (message.includes("Data from backend received")) {
            // Після цього запускаємо обчислення
            setTimeout(function() {
                calculateTotalPrice();  // Викликаємо обчислення після того, як дані отримано
            }, 3000);  // Затримка в 3 секунди
        }
        // Викликаємо оригінальний console.log
        originalConsoleLog.apply(console, arguments);
    };

    // Використовуємо подію 'load', щоб почекати на повне завантаження сторінки
    window.addEventListener('load', function() {
    });

})();