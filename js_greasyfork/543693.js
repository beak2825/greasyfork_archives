// ==UserScript==
// @name         Яндекс поиск по дате (Тёмная тема)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Добавляет плавающее окно с дорками для Яндекса, включая фильтр по одной дате или диапазону. Запоминает последний запрос.
// @author       Your Name
// @match        https://ya.ru/*
// @match        https://yandex.ru/*
// @match        https://yandex.by/*
// @match        https://yandex.com.tr/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543693/%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D0%BE%20%D0%B4%D0%B0%D1%82%D0%B5%20%28%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543693/%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D0%BE%20%D0%B4%D0%B0%D1%82%D0%B5%20%28%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для окна и кнопки в тёмной теме
    GM_addStyle(`
        .dork-widget-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: #ffcc00;
            border: 1px solid #555;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
            z-index: 10000;
            transition: background-color 0.2s;
        }
        .dork-widget-button:hover {
            background-color: #444;
        }
        .dork-widget-window {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            background-color: #2d2d2d;
            color: #f0f0f0;
            border: 1px solid #555;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 10001;
            display: none;
            flex-direction: column;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .dork-widget-header {
            cursor: move;
            padding: 10px;
            background-color: #3a3a3a;
            border-bottom: 1px solid #555;
            text-align: center;
            font-weight: bold;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            position: relative;
        }
        .dork-widget-content {
            padding: 15px;
            display: flex;
            flex-direction: column;
        }
        .dork-widget-content label {
            margin-top: 10px;
            margin-bottom: 5px;
        }
        .dork-widget-content input {
            padding: 8px;
            border: 1px solid #555;
            background-color: #444;
            color: #f0f0f0;
            border-radius: 4px;
            width: calc(100% - 18px);
        }
        .dork-widget-content input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
        }
        .dork-widget-content button {
            margin-top: 15px;
            padding: 10px;
            background-color: #ffcc00;
            color: #000;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        .dork-widget-content button:hover {
            background-color: #e6b800;
        }
        .dork-widget-close {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            line-height: 1;
            color: #ccc;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s;
        }
        .dork-widget-close:hover {
            color: #fff;
        }
    `);

    // Создание кнопки
    const widgetButton = document.createElement('button');
    widgetButton.innerHTML = '🔍';
    widgetButton.className = 'dork-widget-button';
    document.body.appendChild(widgetButton);

    // Создание окна
    const widgetWindow = document.createElement('div');
    widgetWindow.className = 'dork-widget-window';
    widgetWindow.innerHTML = `
        <div class="dork-widget-header">
            Яндекс Дорки
            <button class="dork-widget-close">×</button>
        </div>
        <div class="dork-widget-content">
            <label for="dork-query">Запрос:</label>
            <input type="text" id="dork-query" placeholder="Введите запрос">

            <label for="dork-start-date">С даты (или конкретная дата):</label>
            <input type="date" id="dork-start-date">

            <label for="dork-end-date">По дату (для диапазона):</label>
            <input type="date" id="dork-end-date">

            <button id="dork-search-button">Искать</button>
        </div>
    `;
    document.body.appendChild(widgetWindow);

    const closeButton = widgetWindow.querySelector('.dork-widget-close');
    const searchButton = widgetWindow.querySelector('#dork-search-button');
    const queryInput = widgetWindow.querySelector('#dork-query');
    const startDateInput = widgetWindow.querySelector('#dork-start-date');
    const endDateInput = widgetWindow.querySelector('#dork-end-date');

    // --- Функция: Загрузка сохраненных данных ---
    function loadSavedData() {
        const savedQuery = localStorage.getItem('dorkQuery');
        const savedStartDate = localStorage.getItem('dorkStartDate');
        const savedEndDate = localStorage.getItem('dorkEndDate');

        if (savedQuery) {
            queryInput.value = savedQuery;
        } else {
            // Если сохраненного запроса нет, берем с текущей страницы
            const currentSearchInput = document.querySelector('input[name="text"]') || document.querySelector('.search3__input');
            if (currentSearchInput) {
                queryInput.value = currentSearchInput.value.replace(/date:\d{8}(\.\.\d{8})?/g, '').trim();
            }
        }

        if (savedStartDate) {
            startDateInput.value = savedStartDate;
        }
        if (savedEndDate) {
            endDateInput.value = savedEndDate;
        }
    }

    // --- Показать/скрыть окно ---
    function toggleWidget() {
         if (widgetWindow.style.display === 'none' || widgetWindow.style.display === '') {
            loadSavedData(); // Загружаем данные при каждом открытии
            widgetWindow.style.display = 'flex';
        } else {
            widgetWindow.style.display = 'none';
        }
    }


    widgetButton.addEventListener('click', toggleWidget);
    closeButton.addEventListener('click', toggleWidget);

    // --- Обновленная функция поиска ---
    searchButton.addEventListener('click', () => {
        let query = queryInput.value.trim().replace(/date:\d{8}(\.\.\d{8})?/g, '').trim();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        let dateDork = '';

        // Логика для одной даты или диапазона
        if (startDate && endDate) {
            // Диапазон дат
            const formattedStartDate = startDate.replace(/-/g, '');
            const formattedEndDate = endDate.replace(/-/g, '');
            dateDork = ` date:${formattedStartDate}..${formattedEndDate}`;
        } else if (startDate) {
            // Только одна дата
            const formattedSingleDate = startDate.replace(/-/g, '');
            dateDork = ` date:${formattedSingleDate}`;
        }

        if (query) {
            const finalQuery = query + dateDork;

            // --- Функция: Сохранение данных ---
            localStorage.setItem('dorkQuery', query);
            localStorage.setItem('dorkStartDate', startDate);
            localStorage.setItem('dorkEndDate', endDate);

            // --- ИЗМЕНЕНО: Поиск на текущем домене ---
            const currentDomain = window.location.hostname;
            window.location.href = `https://${currentDomain}/search/?text=${encodeURIComponent(finalQuery)}`;
        }
    });

    // Реализация перетаскивания окна
    const header = widgetWindow.querySelector('.dork-widget-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        // Не начинать перетаскивание, если кликнули на кнопку закрытия
        if (e.target.classList.contains('dork-widget-close')) return;
        isDragging = true;
        offsetX = e.clientX - widgetWindow.offsetLeft;
        offsetY = e.clientY - widgetWindow.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            widgetWindow.style.left = `${e.clientX - offsetX}px`;
            widgetWindow.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Инициализация при загрузке скрипта
    loadSavedData();

})();