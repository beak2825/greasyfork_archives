// ==UserScript==
// @name        Калькулятор лун
// @namespace   http://tampermonkey.net/
// @match       https://patron.kinwoods.com/profile*
// @grant       none
// @version     1.2
// @author      Шумелка (347). ВК - https://vk.com/oleg_rennege
// @description Просто калькулятор... Считает в какой день вашему персонажу стукнет N лун
// @run-at      document-end
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/536143/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BB%D1%83%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/536143/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BB%D1%83%D0%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Форматирование времени
    function formatTime(days) {
        const totalHours = days * 24;
        const fullDays = Math.floor(days);
        const remainingHours = Math.floor(totalHours - fullDays * 24);
        const minutes = Math.round((totalHours - Math.floor(totalHours)) * 60);

        let result = [];
        if (fullDays > 0) result.push(`${fullDays} д.`);
        if (remainingHours > 0) result.push(`${remainingHours} ч.`);
        if (minutes > 0 && fullDays === 0) result.push(`${minutes} мин.`);

        return result.join(' ') || 'менее 1 минуты';
    }

    // Создание калькулятора
    function createCalculator(currentMoons) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.marginTop = '8px';
        container.className = 'moon-calculator-container';

        // Заголовок-переключатель
        const toggleHeader = document.createElement('div');
        toggleHeader.className = 'name flex-row svelte-pcekts';
        toggleHeader.style.cssText = `
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            background-color: rgba(0,0,0,0.05);
            user-select: none;
            display: flex;
            align-items: center;
        `;

        const toggleIcon = document.createElement('span');
        toggleIcon.textContent = '▶';
        toggleIcon.style.cssText = `
            margin-right: 6px;
            font-size: 10px;
            transition: transform 0.2s;
        `;

        const toggleText = document.createElement('span');
        toggleText.textContent = 'Калькулятор лун';
        toggleText.style.fontSize = '15px';

        toggleHeader.append(toggleIcon, toggleText);

        // Содержимое калькулятора
        const calculatorContent = document.createElement('div');
        calculatorContent.style.cssText = `
            display: none;
            padding: 8px;
            padding-top: 6px;
            font-size: 15px;
            background: rgba(0,0,0,0.03);
            border-radius: 4px;
            margin-top: 4px;
        `;

        // Форма ввода
        const inputRow = document.createElement('div');
        inputRow.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            gap: 6px;
            flex-wrap: wrap;
        `;

        const inputLabel = document.createElement('span');
        inputLabel.textContent = 'До:';
        inputLabel.style.flex = '0 0 auto';

        const moonInput = document.createElement('input');
        moonInput.type = 'number';
        moonInput.step = '0.1';
        moonInput.min = currentMoons;
        moonInput.value = (currentMoons + 1).toFixed(1);
        moonInput.style.cssText = `
            width: 80px;
            padding: 4px 6px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-family: inherit;
            font-size: 18px;
        `;

        const calculateBtn = document.createElement('button');
        calculateBtn.textContent = 'OK';
        calculateBtn.style.cssText = `
            padding: 4px 10px;
            background: linear-gradient(to bottom, #6b8cae, #4a6b8a);
            color: white;
            border: 1px solid #3a5a7a;
            border-radius: 3px;
            cursor: pointer;
            font-size: 15px;
            flex-shrink: 0;
        `;

        inputRow.append(inputLabel, moonInput, calculateBtn);

        // Блок результата
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            line-height: 1.4;
            margin-top: 6px;
            min-height: 40px;
        `;

        calculatorContent.append(inputRow, resultDiv);
        container.append(toggleHeader, calculatorContent);

        // Логика переключения
        let isExpanded = false;
        toggleHeader.addEventListener('click', () => {
            isExpanded = !isExpanded;
            calculatorContent.style.display = isExpanded ? 'block' : 'none';
            toggleIcon.textContent = isExpanded ? '▼' : '▶';
            toggleHeader.style.backgroundColor = isExpanded ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.05)';
        });

        // Логика расчета
        function calculateMoonDate() {
            const targetMoons = parseFloat(moonInput.value);

            if (isNaN(targetMoons)) {
                resultDiv.innerHTML = `<span style="color:#d33">Введите число</span>`;
                return;
            }

            if (targetMoons <= currentMoons) {
                resultDiv.innerHTML = `<span style="color:#d33">Цель должна быть > ${currentMoons.toFixed(1)}</span>`;
                return;
            }

            const moonsNeeded = targetMoons - currentMoons;
            const daysNeeded = moonsNeeded * 4;
            const timeString = formatTime(daysNeeded);

            const currentDate = new Date();
            const targetDate = new Date(currentDate);
            targetDate.setDate(currentDate.getDate() + daysNeeded);

            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };

            let formattedDate = targetDate.toLocaleDateString('ru-RU', options);
            formattedDate = formattedDate.replace(' г.,', ',');

            resultDiv.innerHTML = `
                <div>Через: <strong>${timeString}</strong></div>
                <div>Дата: <strong>${formattedDate}</strong></div>
            `;
        }

        // Обработчики событий
        moonInput.addEventListener('input', calculateMoonDate);
        calculateBtn.addEventListener('click', calculateMoonDate);
        moonInput.addEventListener('keypress', (e) => e.key === 'Enter' && calculateMoonDate());

        // Первый расчет
        calculateMoonDate();

        return container;
    }

    // Основная функция инициализации
    function initMoonCalculator() {
        try {
            const moonElement = document.querySelector('.moons p');
            if (!moonElement) {
                console.log('[Калькулятор лун] Элемент с лунами не найден, повторная попытка...');
                setTimeout(initMoonCalculator, 1000);
                return;
            }

            const currentMoons = parseFloat(moonElement.textContent);
            if (isNaN(currentMoons)) {
                console.error('[Калькулятор лун] Не удалось распознать количество лун');
                return;
            }

            const iconList = moonElement.closest('.iconlist');
            if (!iconList) {
                console.error('[Калькулятор лун] Не найден родительский элемент .iconlist');
                return;
            }

            // Проверяем, не добавлен ли уже калькулятор
            if (document.querySelector('.moon-calculator-container')) {
                console.log('[Калькулятор лун] Калькулятор уже существует');
                return;
            }

            const calculator = createCalculator(currentMoons);
            iconList.appendChild(calculator);
            console.log('[Калькулятор лун] Калькулятор успешно добавлен');

        } catch (e) {
            console.error('[Калькулятор лун] Ошибка инициализации:', e);
        }
    }

    // Запускаем после полной загрузки страницы
    if (document.readyState === 'complete') {
        initMoonCalculator();
    } else {
        window.addEventListener('load', initMoonCalculator);
    }

    // Дополнительная проверка для SPA (если страница подгружается динамически)
    new MutationObserver(() => {
        if (!document.querySelector('.moon-calculator-container')) {
            initMoonCalculator();
        }
    }).observe(document.body, { childList: true, subtree: true });
})();