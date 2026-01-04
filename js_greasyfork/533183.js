// ==UserScript==
// @name         Сверяем баланс с Битриксом | А24
// @namespace    http://a24.biz/
// @version      1.1
// @description  Загружает данные из CRM и отображает их на странице баланса.
// @author       Ваше имя
// @match        https://a24.biz/home/balance*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/533183/%D0%A1%D0%B2%D0%B5%D1%80%D1%8F%D0%B5%D0%BC%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%20%D1%81%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%BE%D0%BC%20%7C%20%D0%9024.user.js
// @updateURL https://update.greasyfork.org/scripts/533183/%D0%A1%D0%B2%D0%B5%D1%80%D1%8F%D0%B5%D0%BC%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%20%D1%81%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%BE%D0%BC%20%7C%20%D0%9024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для получения дат текущего месяца
    function getCurrentMonthDates() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Получаем первый день месяца
        const firstDay = `01.${month.toString().padStart(2, '0')}.${year}`;

        // Получаем последний день месяца
        const lastDay = new Date(year, month, 0);
        const lastDayFormatted = `${lastDay.getDate().toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;

        return {
            firstDay,
            lastDay: lastDayFormatted
        };
    }

    // Конфигурация URL для каждого аккаунта (с шаблонами для замены дат)
    const accountUrlTemplates = {
        '4211132': 'https://bx.cloudguru.us/crm/reports/report/view/323/?set_filter=Y&sort_id=10&sort_type=DESC&F_DATE_TYPE=all&F_DATE_FROM=&F_DATE_TO=&F_DATE_DAYS=&filter[0][0]=15&filter[1][0]=__FIRST_DAY__&filter[1][1]=__LAST_DAY__&filter[1][2][]=429&filter[1][4][]=&save=Y',
        '4211265': 'https://bx.cloudguru.us/crm/reports/report/view/323/?set_filter=Y&sort_id=10&sort_type=DESC&F_DATE_TYPE=all&F_DATE_FROM=&F_DATE_TO=&F_DATE_DAYS=&filter[0][0]=15&filter[1][0]=__FIRST_DAY__&filter[1][1]=__LAST_DAY__&filter[1][2][]=430&filter[1][4][]=&save=Y',
        '6292415': 'https://bx.cloudguru.us/crm/reports/report/view/323/?set_filter=Y&sort_id=10&sort_type=DESC&F_DATE_TYPE=all&F_DATE_FROM=&F_DATE_TO=&F_DATE_DAYS=&filter[0][0]=15&filter[1][0]=__FIRST_DAY__&filter[1][1]=__LAST_DAY__&filter[1][2][]=834&filter[1][4][]=&save=Y'
    };

    const accountNames = {
        '4211132': 'Маша',
        '4211265': 'Стёпа',
        '6292415': 'Надя'
    };

    function formatNumber(value) {
        const num = value.replace(/\D+/g, '');
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '₽';
    }

    function getCurrentAccountId() {
        const profileDiv = document.querySelector('.top-menu__profile');
        if (!profileDiv) {
            throw new Error('Не найден элемент .top-menu__profile');
        }
        const userId = profileDiv.getAttribute('data-userid');
        if (!userId || !accountUrlTemplates[userId]) {
            throw new Error(`Аккаунт с ID ${userId} не поддерживается.`);
        }
        return userId;
    }

    function extractLastNumericValue(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const numericCells = doc.querySelectorAll('td.reports-numeric-column');
        if (numericCells.length === 0) {
            throw new Error('Элементы с классом "reports-numeric-column" не найдены.');
        }
        return numericCells[numericCells.length - 1].textContent.trim();
    }

    function insertValueIntoBalancePage(value, accountId) {
        const balanceDiv = document.querySelector('.balance-how_money');
        if (!balanceDiv) {
            throw new Error('Элемент .balance-how_money не найден.');
        }
        const a24Value = document.querySelector('.balance-how_money').textContent.trim();
        balanceDiv.textContent = "A24: " + balanceDiv.textContent

        const oldContainer = document.querySelector('.crm-extracted-value');
        if (oldContainer) oldContainer.remove();

        const valueContainer = document.createElement('div');
        valueContainer.className = 'balance-how_money';
        valueContainer.textContent = `Б24: ${formatNumber(value)}`;
        valueContainer.style.cursor = 'pointer';
        valueContainer.addEventListener('click', function() {
            const textToCopy = `${accountNames[accountId]} Битрикс ${formatNumber(value)}\n${accountNames[accountId]} Автор ${a24Value}`;
            GM_setClipboard(textToCopy, 'text');
            valueContainer.style.color = 'green';
            setTimeout(function() {
                valueContainer.style.color = 'white';
            }, 1000);
        });

        balanceDiv.insertAdjacentElement('afterend', valueContainer);
    }

    // Основная логика
    try {
        const accountId = getCurrentAccountId();
        const { firstDay, lastDay } = getCurrentMonthDates();

        // Заменяем плейсхолдеры в URL на актуальные даты
        const reportUrl = accountUrlTemplates[accountId]
            .replace('__FIRST_DAY__', firstDay)
            .replace('__LAST_DAY__', lastDay);

        GM_xmlhttpRequest({
            method: 'GET',
            url: reportUrl,
            onload: function(response) {
                try {
                    const value = extractLastNumericValue(response.responseText);
                    console.log(`Значение для аккаунта ${accountId}:`, value);
                    insertValueIntoBalancePage(value, accountId);
                } catch (error) {
                    showError(error.message);
                }
            },
            onerror: function() {
                showError('Ошибка загрузки данных из CRM.');
            }
        });
    } catch (error) {
        showError(error.message);
    }

    function showError(message) {
        console.error('Ошибка:', message);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'crm-error';
        errorDiv.style.color = 'red';
        errorDiv.textContent = `Ошибка: ${message}`;
        document.querySelector('.balance-how_money')?.insertAdjacentElement('afterend', errorDiv);
    }
})();