// ==UserScript==
// @name         Счетчик тем
// @namespace    https://forum.blackrussia.online
// @version      0.0.5
// @description  *Данный скрипт очень полезный для ГКФ/ЗГКФ/КФ
// @author       Maksim_Dmiitirev
// @match        https://forum.blackrussia.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537221/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/537221/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 
    // Массив стоковых цветов для дней недели
    const dayColors = {
        "Пн": "#cccccc",   // Пн (стоковый цвет)
        "Вт": "#cccccc",   // Вт
        "Ср": "#cccccc",   // Ср
        "Чт": "#cccccc",   // Чт
        "Пт": "#cccccc",   // Пт
        "Сб": "#cccccc",   // Сб
        "Вс": "#cccccc",   // Вс
    };
 
    // Массив цветов для изменения при наведении
    const hoverColors = {
        "Пн": "#FF5733",   // Пн
        "Вт": "#33FF57",   // Вт
        "Ср": "#3357FF",   // Ср
        "Чт": "#9C27B0",   // Чт
        "Пт": "#00BCD4",   // Пт
        "Сб": "#FFEB3B",   // Сб
        "Вс": "#8D6E63",   // Вс
    };
 
    // Функция для создания элемента с подсчетом
    function createCountElement(count, text, day) {
        var countElement = document.createElement('div');
        countElement.className = 'count-element';
        countElement.textContent = text + ': ' + count;
 
        // Получаем стоковый цвет для дня
        const color = dayColors[day] || "#cccccc";
        const hoverColor = hoverColors[day] || "#cccccc";
 
        // Стиль элемента с учетом стокового цвета
        countElement.style.fontFamily = 'Arial, sans-serif';
        countElement.style.fontSize = '14px';  // Уменьшаем размер шрифта
        countElement.style.color = '#ffffff';
        countElement.style.backgroundColor = color;  // Устанавливаем стоковый цвет
        countElement.style.padding = '5px';  // Уменьшаем отступы
        countElement.style.margin = '2px 0';  // Уменьшаем отступы между элементами
        countElement.style.borderRadius = '5px';
        countElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        countElement.style.transition = 'background-color 0.3s ease, transform 0.2s ease';
 
        // Анимация при наведении
        countElement.addEventListener('mouseover', function() {
            countElement.style.backgroundColor = hoverColor;  // Меняем цвет при наведении
            countElement.style.transform = 'scale(1.05)';
        });
 
        countElement.addEventListener('mouseout', function() {
            countElement.style.backgroundColor = color;  // Возвращаем стоковый цвет
            countElement.style.transform = 'scale(1)';
        });
 
        return countElement;
    }
 
    // Функция для получения дня недели и даты в формате ДД.ММ.ГГГГ
    function getDayOfWeekAndFullDate(dateString) {
        const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const dayOfWeek = daysOfWeek[dayIndex];
 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
 
        return `${dayOfWeek} ${day}.${month}.${year}`;
    }
 
    // Функция для получения даты создания темы
    function getThreadCreationDate(element) {
        const dateElement = element.querySelector('time[datetime]');
        if (dateElement) {
            const dateTimeString = dateElement.getAttribute('datetime');
            return dateTimeString.split('T')[0]; // Возвращаем только дату (без времени)
        }
        return null;
    }
  
    // Функция для проверки, находится ли тема в пределах текущей недели
    function isWithinCurrentWeek(threadDate) {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);
 
        const threadDateObj = new Date(threadDate);
        return threadDateObj >= oneWeekAgo && threadDateObj <= currentDate;
    }
    // Основная функция для подсчета элементов
    async function countElements() {
        // 1. Получаем все темы с нужными классами для "в ожидании" и "на рассмотрении"
        var elementsWaiting = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        var elementsUnderReview = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');
 
        // 2. Подсчитываем количество тем
        var waitingCount = elementsWaiting.length;
        var underReviewCount = elementsUnderReview.length;
 
        // 3. Получаем все темы на странице
        const currentPageThreads = document.querySelectorAll('.structItem.structItem--thread');
 
        // 4. Создаем объект для хранения количества тем по дням недели
        const weekCounts = {
            "Пн": {date: '', count: 0},
            "Вт": {date: '', count: 0},
            "Ср": {date: '', count: 0},
            "Чт": {date: '', count: 0},
            "Пт": {date: '', count: 0},
            "Сб": {date: '', count: 0},
            "Вс": {date: '', count: 0}
        };
 
        // 5. Перебираем все темы и считаем темы по дням недели
        currentPageThreads.forEach(element => {
            const threadDate = getThreadCreationDate(element);
            if (threadDate && isWithinCurrentWeek(threadDate)) {
                const dayOfWeekAndFullDate = getDayOfWeekAndFullDate(threadDate);
                const dayOfWeek = dayOfWeekAndFullDate.split(' ')[0];
 
                weekCounts[dayOfWeek].count++;
                weekCounts[dayOfWeek].date = dayOfWeekAndFullDate;
            }
        });
 
        // 6. Создаем контейнер для счетчика тем за неделю
        const counterContainerWeek = document.createElement('div');
        counterContainerWeek.style.position = 'absolute';
        counterContainerWeek.style.top = '10px';
        counterContainerWeek.style.left = '10px';
        counterContainerWeek.style.zIndex = '9999';
        counterContainerWeek.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerWeek.style.padding = '10px';
        counterContainerWeek.style.borderRadius = '8px';
        counterContainerWeek.style.color = '#fff';
        counterContainerWeek.style.fontFamily = 'Arial, sans-serif';
        counterContainerWeek.style.fontSize = '14px';
        counterContainerWeek.style.maxWidth = '300px';
        counterContainerWeek.style.maxHeight = '300px';
        counterContainerWeek.style.overflowY = 'auto';
        counterContainerWeek.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
 
        // Создаем заголовок для блока
        const headerElementWeek = document.createElement('div');
        headerElementWeek.textContent = 'Темы за неделю по дням:';
        headerElementWeek.style.fontWeight = 'bold';
        headerElementWeek.style.marginBottom = '10px';
        counterContainerWeek.appendChild(headerElementWeek);
 
        // Добавляем количество тем по дням недели в контейнер
        for (const day in weekCounts) {
            if (weekCounts[day].date !== '') {
                counterContainerWeek.appendChild(createCountElement(weekCounts[day].count, `${weekCounts[day].date}`, day));
            }
        }
 
        // 7. Создаем контейнер для счетчика тем в ожидании и на рассмотрении (в правом верхнем углу)
        const counterContainerStatus = document.createElement('div');
        counterContainerStatus.style.position = 'absolute';
        counterContainerStatus.style.top = '10px';  // Размещаем в верхней части
        counterContainerStatus.style.right = '10px';  // Размещаем справа
        counterContainerStatus.style.zIndex = '9999';
        counterContainerStatus.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerStatus.style.padding = '10px';
        counterContainerStatus.style.borderRadius = '8px';
        counterContainerStatus.style.color = '#fff';
        counterContainerStatus.style.fontFamily = 'Arial, sans-serif';
        counterContainerStatus.style.fontSize = '14px';
        counterContainerStatus.style.maxWidth = '200px';
        counterContainerStatus.style.maxHeight = '200px';
        counterContainerStatus.style.overflowY = 'auto';
        counterContainerStatus.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
 
        // Создаем заголовок для блока
        const headerElementStatus = document.createElement('div');
        headerElementStatus.textContent = 'Статус тем:';
        headerElementStatus.style.fontWeight = 'bold';
        headerElementStatus.style.marginBottom = '10px';
        counterContainerStatus.appendChild(headerElementStatus);
 
        // Добавляем количество тем в ожидании и на рассмотрении
        const waitingElement = createCountElement(waitingCount, `В ожидании`, 'Пн');
        const underReviewElement = createCountElement(underReviewCount, `На рассмотрении`, 'Вт');
        counterContainerStatus.appendChild(waitingElement);
        counterContainerStatus.appendChild(underReviewElement);
 
        // Вставляем контейнеры в body
        document.body.appendChild(counterContainerWeek);
        document.body.appendChild(counterContainerStatus);
    }
 
    // Вызываем функцию при загрузке страницы
    window.onload = function() {
        countElements();
    };
 
})();