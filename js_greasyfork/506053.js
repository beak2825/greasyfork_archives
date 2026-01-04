// ==UserScript==
// @name         salesDrive_m2_calculation
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  Скрипт для розрахунку площі (м²) у SalesDrive при редагуванні товару
// @author       LanNet
// @match        https://e-oboi.salesdrive.me/ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesdrive.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506053/salesDrive_m2_calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/506053/salesDrive_m2_calculation.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Функція для обчислення площі (м²) на основі тексту опису
    function calculateSquareMeters(descriptionText) {
        const regexPatterns = [
            /[(ш)]\s*(\d+)\s*х\s*[(в)]\s*(\d+)/i,   // Формат (ш)350 х (в)300
            /(\d+)\s*[xх]\s*(\d+)/i,                // Формат 350x300 або 236x250
            /ширина\s*(\d+)\s*х\s*(\d+)\s*висота/i, // Формат ширина 350х300 висота
        ];

        let width = '';
        let height = '';

        for (const pattern of regexPatterns) {
            const match = descriptionText.match(pattern);
            if (match) {
                width = parseFloat(match[1]);
                height = parseFloat(match[2]);
                break;
            }
        }

        if (width && height) {
            return (width * height) / 10000; // Переводимо в м²
        } else {
            return null;
        }
    }

    // Функція для вставлення площі (м²) в поле введення
    function setSquareMetersToInput(area, inputElement) {
        if (area !== null && inputElement) {
            inputElement.value = area.toFixed(2);
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
        }
    }

    // Функція для отримання розміру з тексту опису і вставлення обчисленої площі
    function updateDescriptionCalculations(row) {
        const descriptionElement = row.querySelector('.underline-description.ng-binding.ng-scope');

        if (descriptionElement) {
            const descriptionText = descriptionElement.textContent || '';
            const area = calculateSquareMeters(descriptionText);

            // Вибираємо input для поточного товару
            const inputElement = row.querySelector('input.form-control.input-listener');

            if (area !== null && inputElement) {
                setSquareMetersToInput(area, inputElement); // Вставляємо площу
            }
        }
    }

    // Функція для обробки введення в textarea та оновлення обчислень для конкретного товару
    function handleTextareaInputEvent(event, row) {
        const descriptionText = event.target.value || '';
        const area = calculateSquareMeters(descriptionText);
        const inputElement = row.querySelector('input.form-control.input-listener');
        setSquareMetersToInput(area, inputElement);
    }

    // Функція для оновлення обчислень для конкретного ряду
    function updateCalculations(row) {
        const itemTextarea = row.querySelector('textarea[ng-model="item.description"]');
        const addItemTextarea = row.querySelector('textarea[ng-model="viewModel.addAttribute.description"]');

        if (itemTextarea) {
            handleTextareaInputEvent({ target: itemTextarea }, row);
        }

        if (addItemTextarea) {
            handleTextareaInputEvent({ target: addItemTextarea }, row);
        }

        // Також оновлюємо обчислення на основі опису
        updateDescriptionCalculations(row);
    }

    // Функція для обробки вибору опцій у select2
    function handleSelectChange(event, row) {
        // Запускаємо обчислення для конкретного товару
        updateCalculations(row);
    }

    // Функція для додавання подій на select2
    function addSelectEventListeners(row) {
        const selectElement = row.querySelector('.select2-selection__rendered');
        if (selectElement) {
            const observer = new MutationObserver(() => {
                handleSelectChange(null, row);
            });
            observer.observe(selectElement, { childList: true, subtree: true });
        }
    }

    // Додаємо події на textarea для перерахунку площі для кожного товару
    function addEventListenersForRow(row) {
        const itemTextarea = row.querySelector('textarea[ng-model="item.description"]');
        const addItemTextarea = row.querySelector('textarea[ng-model="viewModel.addAttribute.description"]');

        if (itemTextarea) {
            itemTextarea.addEventListener('input', event => handleTextareaInputEvent(event, row));
        }

        if (addItemTextarea) {
            addItemTextarea.addEventListener('input', event => handleTextareaInputEvent(event, row));
        }

        // Додаємо прослуховування змін у select2 для кожного ряду
        addSelectEventListeners(row);
    }

    // Функція для обробки введення в textarea та оновлення обчислень для нового товару
    function handleNewAttributeTextareaInputEvent(event) {
        const descriptionText = event.target.value || '';
        const area = calculateSquareMeters(descriptionText);

        // Вибираємо input для введення нової кількості
        const inputElement = document.querySelector('input[ng-model="viewModel.addAttribute.newAmount"]');
        if (area !== null && inputElement) {
            inputElement.value = area.toFixed(2); // Вставляємо площу у відповідне поле
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
        }
    }

    // Додаємо обробку textarea для нового рядка товару
    function addNewAttributeEventListener() {
        const newAttributeTextarea = document.querySelector('textarea[ng-model="viewModel.addAttribute.description"]');

        if (newAttributeTextarea) {
            newAttributeTextarea.addEventListener('input', handleNewAttributeTextareaInputEvent);
        }
    }

    // Додаємо обробку нових textarea та select для кожного ряду
    function addEventListeners() {
        // Вибираємо всі ряди з товарами
        const rows = document.querySelectorAll('tr.price-to-order, tr.create-active-attribute-row'); // Додаємо новий рядок

        rows.forEach(row => {
            addEventListenersForRow(row); // Додаємо обробку подій для кожного товару
            addSelectEventListeners(row); // Додаємо обробку select2 для кожного товару
        });

        // Додаємо обробку для нового товару
        addNewAttributeEventListener();
    }

    // Створюємо MutationObserver для спостереження за змінами в DOM
    const domObserver = new MutationObserver(() => {
        addEventListeners(); // Додаємо слухачі на нові елементи
    });

    // Спостерігаємо за змінами в тілі документа
    domObserver.observe(document.body, { childList: true, subtree: true });

    // Додаємо обробку подій при завантаженні сторінки
    window.addEventListener('load', () => {
        addEventListeners();  // Додаємо обробку textarea, select та кліків по опціях
    });

})();