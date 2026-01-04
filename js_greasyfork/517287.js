// ==UserScript==
// @name         Анализ конкурентоспособности
// @namespace    http://your-namespace.com/
// @version      2.0
// @description  Автоматизирует нажатия и заполнение полей
// @match        https://admin.adeo.pro/admin/supplier/price/marketability/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517287/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%20%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D1%80%D0%B5%D0%BD%D1%82%D0%BE%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/517287/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%20%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D1%80%D0%B5%D0%BD%D1%82%D0%BE%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для установки флажка на "Выводить уникальные позиции"
    function clickUniqueCheckbox() {
        const uniqueCheckbox = document.querySelector('#unique + .iCheck-helper');
        if (uniqueCheckbox) {
            uniqueCheckbox.click();
            console.log("Флажок 'Уникальные позиции' нажат");
            return true;
        }
        return false;
    }

    // Функция для установки флажка на "Наценка за самовывоз"
    function clickMarkupPickupCheckbox() {
        const markupPickupCheckbox = document.querySelector('#markupPickup + .iCheck-helper');
        if (markupPickupCheckbox) {
            markupPickupCheckbox.click();
            console.log("Флажок 'Наценка за самовывоз' нажат");
            return true;
        }
        return false;
    }

    // Функция для заполнения поля "по" (rank_max)
    function fillRankMaxField() {
        const rankMaxField = document.querySelector('#rank_max');
        if (rankMaxField) {
            rankMaxField.value = "998";
            rankMaxField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Поле 'rank_max' заполнено");
            return true;
        }
        return false;
    }

    // Функция для заполнения поля "ID дилера для анализа цен" (client_id)
    function fillClientIdField() {
        const clientIdField = document.querySelector('#client_id');
        if (clientIdField) {
            clientIdField.value = "153893";
            clientIdField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Поле 'client_id' заполнено");
            return true;
        }
        return false;
    }

    // Функция для заполнения поля "markupPickupVal" (значение наценки за самовывоз)
    function fillMarkupPickupValField() {
        const markupPickupValField = document.querySelector('#markupPickupVal');
        if (markupPickupValField) {
            markupPickupValField.value = "0";
            markupPickupValField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Поле 'markupPickupVal' заполнено");
            return true;
        }
        return false;
    }

    // Периодически проверяем наличие элементов каждые 500 мс
    const intervalId = setInterval(() => {
        const checkboxUniqueClicked = clickUniqueCheckbox();
        const checkboxMarkupPickupClicked = clickMarkupPickupCheckbox();
        const fieldRankMaxFilled = fillRankMaxField();
        const fieldClientIdFilled = fillClientIdField();
        const fieldMarkupPickupValFilled = fillMarkupPickupValField();

        // Останавливаем интервал, если все действия выполнены
        if (checkboxUniqueClicked && checkboxMarkupPickupClicked && fieldRankMaxFilled && fieldClientIdFilled && fieldMarkupPickupValFilled) {
            clearInterval(intervalId);
        }
    }, 500); // Проверка каждые 500 мс

})();
    // Кнопки
(function() {
    'use strict';

    // Функция для заполнения поля "ID дилера для анализа цен" (client_id)
    function fillClientIdField(value) {
        const clientIdField = document.querySelector('#client_id');
        if (clientIdField) {
            clientIdField.value = value;
            clientIdField.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }
        return false;
    }

    // Функция для добавления кнопок "Закупочная" и "Клиентская"
    function addCustomButtons() {
        const clientIdField = document.querySelector('#client_id');
        if (!clientIdField || document.getElementById("purchaseButton")) return;

        const buttons = [
            { id: "purchaseButton", text: "Закупочная", value: "153893" },
            { id: "clientButton", text: "Клиентская", value: "258" },
            { id: "clientButton2", text: "Проверка", value: "129234" }
        ];

        buttons.forEach(button => {
            const newButton = document.createElement("button");
            newButton.id = button.id;
            newButton.innerText = button.text;
            newButton.style.marginLeft = "5px";
            newButton.addEventListener("click", (event) => {
                event.preventDefault(); // Останавливаем обновление страницы
                fillClientIdField(button.value);
            });
            clientIdField.parentNode.appendChild(newButton);
        });
    }

    // Заполняем поле и добавляем кнопки
    if (fillClientIdField("153893")) {
        addCustomButtons(); // Добавляем кнопки после завершения всех действий
    }

})();