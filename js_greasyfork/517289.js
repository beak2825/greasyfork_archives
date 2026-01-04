// ==UserScript==
// @name         Анализ позиций прайса на продаваемость
// @namespace    http://your-namespace.com/
// @version      2.0
// @description  Автоматизирует ввод данных, снятие флажков и вставку даты
// @match        https://admin.adeo.pro/admin/admin_pricerelevance/list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517289/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%20%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B9%20%D0%BF%D1%80%D0%B0%D0%B9%D1%81%D0%B0%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D0%B0%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/517289/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%20%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B9%20%D0%BF%D1%80%D0%B0%D0%B9%D1%81%D0%B0%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D0%B0%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // Функция для добавления атрибута accept в поле загрузки файла
    function setFileAcceptAttribute() {
        const fileInput = document.querySelector('input[type="file"][name="price"]');
        if (fileInput) {
            fileInput.setAttribute('accept', '.xlsx, .xls');
            console.log("Атрибут 'accept' добавлен к полю загрузки файла");
            return true;
        }
        return false;
    }

    // Функция для заполнения поля "Добавить колонки после"
    function fillOutStartField() {
        const outStartField = document.querySelector('input[name="outStart"]');
        if (outStartField) {
            outStartField.value = "5";
            console.log("Поле 'Добавить колонки после' заполнено");
            return true;
        }
        return false;
    }

    // Функция для снятия флажка "Средняя цена в заказах"
    function uncheckAvgCostCheckbox() {
        const avgCostCheckbox = document.querySelector('input[name="orders_avg_cost"] + .iCheck-helper');
        if (avgCostCheckbox) {
            avgCostCheckbox.click();
            console.log("Флажок 'Средняя цена в заказах' снят");
            return true;
        }
        return false;
    }

    // Функция для снятия флажка "Макс. цена в заказах"
    function uncheckMaxCostCheckbox() {
        const maxCostCheckbox = document.querySelector('input[name="orders_max_cost"] + .iCheck-helper');
        if (maxCostCheckbox) {
            maxCostCheckbox.click();
            console.log("Флажок 'Макс. цена в заказах' снят");
            return true;
        }
        return false;
    }

    // Функция для вставки даты "месяц назад" в поле даты
    function fillDateField() {
        const dateField = document.querySelector('input[name="start_date"]');
        if (dateField) {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - 1); // Отнимаем 1 месяц от текущей даты
            const formattedDate = currentDate.toISOString().split('T')[0]; // Форматируем дату в YYYY-MM-DD
            dateField.value = formattedDate;
            console.log(`Поле 'Начать статистику с' заполнено датой: ${formattedDate}`);
            return true;
        }
        return false;
    }

    // Периодически проверяем наличие элементов каждые 500 мс
    const intervalId = setInterval(() => {
        const fieldOutStartFilled = fillOutStartField();
        const checkboxAvgCostUnchecked = uncheckAvgCostCheckbox();
        const checkboxMaxCostUnchecked = uncheckMaxCostCheckbox();
        const dateFieldFilled = fillDateField();
        const fileInputUpdated = setFileAcceptAttribute();

        // Останавливаем интервал, если все действия выполнены
        if (fieldOutStartFilled && checkboxAvgCostUnchecked && checkboxMaxCostUnchecked && dateFieldFilled && fileInputUpdated) {
            clearInterval(intervalId);
        }
    }, 500); // Проверка каждые 500 мс

})();
