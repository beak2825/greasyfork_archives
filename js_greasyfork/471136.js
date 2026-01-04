// ==UserScript==
// @name         DealColor
// @namespace    http://pravovest.ru
// @version      0.1
// @description  Смена цвета лидов и сделок
// @author       Pravovest
// @match        https://pravovest.bitrix24.ru/crm/deal/kanban/category/16/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471136/DealColor.user.js
// @updateURL https://update.greasyfork.org/scripts/471136/DealColor.meta.js
// ==/UserScript==

(function() {
    'use strict';

 function changeColors() {
        // Задайте новый красный цвет для сделок с источником "НПП"
        const redColor = '#c9c8f1';
        // Задайте новый желтый цвет для сделок с источником "ПРАВОВЕСТ"
        const yellowColor = '#c8f1de';
        // Задайте новый голубой цвет для сделок с источником "Звонок"
        const blueColor = '#f0f1c8';

        const dealElements = document.querySelectorAll('.crm-kanban-item');

        dealElements.forEach((element) => {
            const sourceValue = element.textContent.trim();

            // Проверка, содержит ли значение источника фразы "НПП", "ПРАВОВЕСТ" или "Звонок" с использованием регулярных выражений
            if (/НПП|ПРАВОВЕСТ|Звонок/i.test(sourceValue)) {
                if (/НПП/i.test(sourceValue)) {
                    element.style.backgroundColor = redColor;
                } else if (/ПРАВОВЕСТ/i.test(sourceValue)) {
                    element.style.backgroundColor = yellowColor;
                } else if (/Звонок/i.test(sourceValue)) {
                    element.style.backgroundColor = blueColor;
                }
            }
        });
    }

    changeColors();
    setInterval(changeColors, 3000);
})();