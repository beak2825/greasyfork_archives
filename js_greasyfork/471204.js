// ==UserScript==
// @name         DealColor
// @namespace    http://pravovest.ru
// @version      1.1
// @description  Смена цвета лидов и сделок
// @author       Pravovest
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471204/DealColor.user.js
// @updateURL https://update.greasyfork.org/scripts/471204/DealColor.meta.js
// ==/UserScript==

function changeColors() {
    const priceColor = '#fba0e3';
    // Задайте новый цвет для сделок созданных в текущем месяце
    const currentMonthColor = '#a8e4a0';

    const dealElements = document.querySelectorAll('.crm-kanban-item');

    dealElements.forEach((element) => {
        const titleElements = element.querySelectorAll('.crm-kanban-item-fields-item-title-text');
        let sourceValue = null;

        for (const titleElement of titleElements) {
            if (titleElement.textContent === 'Источник') {
                const sourceElement = titleElement.closest('.crm-kanban-item-fields-item');
                if (sourceElement) {
                    sourceValue = sourceElement.querySelector('.crm-kanban-item-fields-item-value').textContent.trim();
                    break;
                }
            }
        }

        if (sourceValue === 'НПП Покупка/Прайс' || sourceValue === 'ПРАВОВЕСТ Покупка/Прайс') {
            element.style.backgroundColor = priceColor;
        } else {
            const dateElement = element.querySelector('.fields.date.field-item');
            if (dateElement) {
                const dealDate = extractDateFromString(dateElement.textContent);
                const currentDate = new Date();
                
                // Если прошлый месяц или источник не "НПП Покупка/Прайс" или "ПРАВОВЕСТ Покупка/Прайс"
                if (!dealDate || (dealDate.getMonth() !== currentDate.getMonth() || dealDate.getFullYear() !== currentDate.getFullYear())) {
                    element.style.backgroundColor = '#fff';
                } else {
                    element.style.backgroundColor = currentMonthColor;
                }
            } else {
                element.style.backgroundColor = '#fff';
            }
        }
    });
}

function extractDateFromString(str) {
    const regex = /(\d{2})\.(\d{2})\.(\d{4})/;
    const match = str.match(regex);

    if (match) {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = parseInt(match[3]);
        return new Date(year, month, day);
    }

    return null;
}

changeColors();
setInterval(changeColors, 3000);
