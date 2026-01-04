// ==UserScript==
// @name         CRM_Tool
// @version      1.0
// @description  Плагин позволяет смотреть время работы банков ЛатАма и создавать напоминания для лидов.
// @author       Bakesh_Legend322
// @match        *://semensemenovv0919.amocrm.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace    https://greasyfork.org/ru/scripts/529118
// @downloadURL https://update.greasyfork.org/scripts/529118/CRM_Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/529118/CRM_Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('CrmTool: Скрипт запущен');

    const GITHUB_VERSION_URL = 'https://raw.githubusercontent.com/PoopSoftWare/Crm_Tool/main/upd';
    const GITHUB_SCRIPT_URL = 'https://raw.githubusercontent.com/PoopSoftWare/Crm_Tool/main/crm_tool.js';
    const GITHUB_HOLIDAYS_URL = 'https://raw.githubusercontent.com/PoopSoftWare/Crm_Tool/main/holidays.json';
    const CURRENT_VERSION = '1.0';

    let isRemindersListVisible = false;
    let holidaysData = { holidays: {}, holidayNames: {} }; // Переменная для хранения данных о праздниках

    // Стили для интерфейса
    const styles = `
        .crm_tool-container {
            position: fixed;
            z-index: 10002;
            left: 0.6vw;
            bottom: 25vh;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            background: rgba(0, 0, 0, 0.1);
        }
        .crm_tool-reminder-button, .crm_tool-timer-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4a4a4a;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.5s ease-in-out;
        }
        .crm_tool-reminder-button:hover, .crm_tool-timer-button:hover {
            background-color: #666;
            transform: scale(1.1);
        }
        .crm_tool-reminder-button.active, .crm_tool-timer-button.active {
            animation: blink 1s infinite;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes blink {
            50% { background-color: #ff4444; }
        }
        .crm_tool-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #113c5c;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: 10003;
            width: 90%;
            max-width: 500px;
            animation: slideIn 0.3s ease-out;
            overflow: hidden;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .crm_tool-modal h2 {
            margin-top: 0;
            color: #ffffff;
            text-align: center;
        }
        .crm_tool-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .crm_tool-input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            background-color: #1a4d6e;
            color: white;
            box-sizing: border-box;
        }
        .crm_tool-button-group {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 15px;
        }
        .crm_tool-submit, .crm_tool-list, .crm_tool-close, .crm_tool-reset {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            font-weight: bold;
            box-sizing: border-box;
        }
        .crm_tool-submit {
            background-color: #4CAF50;
            color: white;
        }
        .crm_tool-submit:hover {
            background-color: #45a049;
            transform: translateY(-2px);
        }
        .crm_tool-list, .crm_tool-close, .crm_tool-reset {
            background-color: #f0f0f0;
            color: #333;
        }
        .crm_tool-list:hover, .crm_tool-close:hover, .crm_tool-reset:hover {
            background-color: #e0e0e0;
            transform: translateY(-2px);
        }
        .crm_tool-reminders {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 15px;
            display: none;
            padding-right: 10px;
        }
        .crm_tool-reminder {
            background-color: #153043;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 10px;
            position: relative;
            transition: all 0.3s ease;
        }
        .crm_tool-reminder:hover {
            background-color: #1e4f70;
        }
        .crm_tool-reminder-toggle {
            cursor: pointer;
            font-weight: bold;
        }
        .crm_tool-reminder-details {
            display: none;
            margin-top: 5px;
            padding-right: 10px;
        }
        .crm_tool-reminder button {
            background-color: #ff4d4d;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            float: right;
        }
        .crm_tool-reminder button:hover {
            background-color: #ff3333;
            transform: scale(1.1);
        }
        .crm_tool-update {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            display: none;
            transition: all 0.3s ease;
        }
        .crm_tool-update:hover {
            background-color: #45a049;
            transform: translateY(-2px);
        }
        .crm_tool-settings {
            margin-top: 10px;
            color: #fff;
        }
        #time-widget-container {
            position: fixed;
            zIndex: 9999;
            backgroundColor: #1a2a44;
            border: 1px solid #ddd;
            padding: 10px;
            boxShadow: '0 0 10px rgba(0,0,0,0.1)';
            borderRadius: '8px';
            resize: both;
            overflow: auto;
            transition: all 0.3s ease;
            left: 70px;
            min-width: 200px;
            min-height: 100px;
        }
        #time-widget-container h3 {
            margin: 0 0 10px 0;
            color: #ffffff;
            font-size: 1.2em;
        }
        #time-widget-container .clock-item:hover {
            cursor: pointer;
            background-color: rgba(255, 255, 255, 0.1);
        }
        #time-widget-container .holiday-notice {
            color: #ff69b4;
            font-style: italic;
            margin-top: 5px;
        }
        .crm_tool-country-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #1a2a44;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 10005;
            display: none;
            color: white;
            max-height: 80vh;
            overflow-y: auto;
        }
        .crm_tool-country-modal h3 {
            margin: 0 0 10px 0;
            color: #ffffff;
        }
        .crm_tool-country-modal select {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            background-color: #4a4a4a;
            color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .crm_tool-country-modal button {
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        }
        .crm_tool-country-modal button:hover {
            background-color: #45a049;
        }
        /* Стили для кастомного меню */
        .crm_tool-timer-menu {
            position: fixed;
            background-color: #1a2a44;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 10004;
            display: none;
            flex-direction: column;
            padding: 5px;
            width: 200px;
        }
        .crm_tool-timer-menu button {
            background-color: #4a4a4a;
            color: white;
            border: none;
            padding: 8px 12px;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-radius: 4px;
            margin: 2px 0;
        }
        .crm_tool-timer-menu button:hover {
            background-color: #666;
        }
        @media (max-width: 600px) {
            .crm_tool-container {
                left: 5px;
            }
            .crm_tool-reminder-button, .crm_tool-timer-button {
                width: 35px;
                height: 35px;
                font-size: 20px;
            }
            .crm_tool-modal {
                width: 95%;
            }
            .crm_tool-button-group {
                flex-direction: column;
            }
            .crm_tool-submit, .crm_tool-list, .crm_tool-close, .crm_tool-reset {
                width: 100%;
            }
            #time-widget-container {
                left: 50px;
            }
            .crm_tool-timer-menu {
                width: 150px;
            }
        }
        @media (max-height: 720px) {
            .crm_tool-container {
                bottom: 8vh;
            }
            #time-widget-container {
                top: 8vh;
            }
        }
        @media (max-height: 1080px) {
            .crm_tool-container {
                bottom: 8vh;
            }
            #time-widget-container {
                top: 8vh;
            }
        }
        @media (min-height: 1440px) {
            .crm_tool-container {
                bottom: 8vh;
            }
            #time-widget-container {
                top: 15vh;
            }
        }
    `;

    // Добавляем стили
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Создаем общий контейнер для кнопок
    const container = document.createElement('div');
    container.className = 'crm_tool-container';
    document.body.appendChild(container);
    console.log('Контейнер создан:', container);

    // Кнопка напоминаний
    const reminderButton = document.createElement('button');
    reminderButton.className = 'crm_tool-reminder-button';
    reminderButton.textContent = '+';
    container.appendChild(reminderButton);
    console.log('Кнопка напоминаний добавлена:', reminderButton);

    // Кнопка таймера
    const timerButton = document.createElement('button');
    timerButton.className = 'crm_tool-timer-button';
    timerButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
            <line x1="12" y1="12" x2="16" y2="8" stroke="white" stroke-width="2"/>
            <line x1="12" y1="12" x2="12" y2="16" stroke="white" stroke-width="2"/>
        </svg>
    `;
    container.appendChild(timerButton);
    console.log('Кнопка таймера добавлена:', timerButton);

    // Создаем кастомное меню для выбора типа окна
    const timerMenu = document.createElement('div');
    timerMenu.className = 'crm_tool-timer-menu';
    timerMenu.innerHTML = `
        <button class="crm_tool-timer-window">Открыть в новом окне</button>
        <button class="crm_tool-timer-panel">Открыть как виджет</button>
    `;
    document.body.appendChild(timerMenu); // Добавляем в body, чтобы позиционирование было фиксированным

    const modal = document.createElement('div');
    modal.className = 'crm_tool-modal';
    modal.innerHTML = `
        <h2>Добавить напоминание</h2>
        <form class="crm_tool-form">
            <input type="text" id="clientId" class="crm_tool-input" placeholder="ID Лида (опционально)">
            <input type="text" id="leadLink" class="crm_tool-input" placeholder="Ссылка на лида (опционально)">
            <input type="text" id="reminderText" class="crm_tool-input" placeholder="Текст напоминания" required>
            <input type="number" id="reminderHours" class="crm_tool-input" placeholder="Через сколько часов" min="0">
            <input type="number" id="reminderMinutes" class="crm_tool-input" placeholder="Через сколько минут" min="0">
            <div class="crm_tool-settings">
                <label><input type="checkbox" id="openLink"> Открывать ссылку на лида после таймера</label>
                <select id="notificationSound" class="crm_tool-input">
                    <option value="https://www.soundjay.com/buttons/sounds/button-7.mp3">Стандартный</option>
                    <option value="https://www.soundjay.com/buttons/beep-01a.mp3">Бип</option>
                    <option value="https://www.soundjay.com/buttons/button-09.mp3">Клик</option>
                </select>
            </div>
            <div class="crm_tool-button-group">
                <button type="button" class="crm_tool-submit">Сохранить</button>
                <button type="button" class="crm_tool-list">Список напоминаний</button>
                <button type="button" class="crm_tool-reset">Сбросить все</button>
                <button type="button" class="crm_tool-close">Закрыть</button>
            </div>
        </form>
        <div class="crm_tool-reminders"></div>
    `;
    document.body.appendChild(modal);
    console.log('Модальное окно добавлено:', modal);

    const updateButton = document.createElement('button');
    updateButton.className = 'crm_tool-update';
    updateButton.textContent = 'Обновить скрипт';
    document.body.appendChild(updateButton);
    console.log('Кнопка обновления добавлена:', updateButton);

    // Получаем элементы
    const form = modal.querySelector('.crm_tool-form');
    const clientIdInput = form.querySelector('#clientId');
    const leadLinkInput = form.querySelector('#leadLink');
    const reminderTextInput = form.querySelector('#reminderText');
    const reminderHoursInput = form.querySelector('#reminderHours');
    const reminderMinutesInput = form.querySelector('#reminderMinutes');
    const openLinkCheckbox = form.querySelector('#openLink');
    const notificationSoundSelect = form.querySelector('#notificationSound');
    const submitButtonModal = form.querySelector('.crm_tool-submit');
    const listButton = form.querySelector('.crm_tool-list');
    const resetButton = form.querySelector('.crm_tool-reset');
    const closeButton = form.querySelector('.crm_tool-close');
    const remindersContainer = modal.querySelector('.crm_tool-reminders');

    // Аудио для уведомлений
    let audio = new Audio(notificationSoundSelect.value);

    // Обновление звука уведомления
    notificationSoundSelect.addEventListener('change', () => {
        audio = new Audio(notificationSoundSelect.value);
    });

    // Сохранение напоминания
    function saveReminder() {
        const clientId = clientIdInput.value.trim();
        const leadLink = leadLinkInput.value.trim();
        const reminderText = reminderTextInput.value.trim();
        const reminderHours = parseInt(reminderHoursInput.value) || 0;
        const reminderMinutes = parseInt(reminderMinutesInput.value) || 0;
        const openLink = openLinkCheckbox.checked;

        if (!reminderText || (reminderHours === 0 && reminderMinutes === 0)) {
            alert('Укажите текст напоминания и время');
            return;
        }

        const now = new Date();
        const reminder = {
            clientId,
            leadLink,
            reminderText,
            reminderTime: reminderHours * 60 + reminderMinutes,
            reminderTimestamp: now.getTime() + (reminderHours * 60 + reminderMinutes) * 60000,
            openLink
        };

        let reminders = JSON.parse(localStorage.getItem('crm_toolReminders') || '[]');
        reminders.push(reminder);
        localStorage.setItem('crm_toolReminders', JSON.stringify(reminders));

        alert('Напоминание сохранено');
        form.reset();
        showRemindersList();
    }

    // Отображение списка напоминаний
    function showRemindersList() {
        const reminders = JSON.parse(localStorage.getItem('crm_toolReminders') || '[]');
        if (!isRemindersListVisible) {
            remindersContainer.style.display = 'block';
            remindersContainer.innerHTML = '';

            reminders.forEach((reminder, index) => {
                const reminderTime = new Date(reminder.reminderTimestamp);
                const formattedTime = formatMoscowTime(reminderTime);

                const reminderElement = document.createElement('div');
                reminderElement.className = 'crm_tool-reminder';
                reminderElement.innerHTML = `
                    <div class="crm_tool-reminder-toggle" data-index="${index}">Лид: ${reminder.clientId || 'Нет ID'} | ${reminder.reminderText}</div>
                    <div class="crm_tool-reminder-details" data-index="${index}">
                        <p><strong>Текст:</strong> ${reminder.reminderText}</p>
                        <p><strong>Время (МСК):</strong> ${formattedTime}</p>
                        <p><strong>Ссылка на лида:</strong> ${reminder.leadLink || 'Нет ссылки'}</p>
                        <button data-index="${index}">Удалить</button>
                    </div>
                `;
                remindersContainer.appendChild(reminderElement);

                reminderElement.querySelector('.crm_tool-reminder-toggle').addEventListener('click', function() {
                    const details = this.nextElementSibling;
                    details.style.display = details.style.display === 'block' ? 'none' : 'block';
                });

                reminderElement.querySelector('button').addEventListener('click', () => deleteReminder(index));
            });

            isRemindersListVisible = true;
        } else {
            remindersContainer.style.display = 'none';
            isRemindersListVisible = false;
        }
    }

    // Удаление напоминания
    function deleteReminder(index) {
        let reminders = JSON.parse(localStorage.getItem('crm_toolReminders') || '[]');
        reminders.splice(index, 1);
        localStorage.setItem('crm_toolReminders', JSON.stringify(reminders));
        showRemindersList();
    }

    // Сброс всех напоминаний
    function resetReminders() {
        if (confirm('Вы уверены, что хотите удалить все напоминания?')) {
            localStorage.removeItem('crm_toolReminders');
            remindersContainer.innerHTML = '';
            remindersContainer.style.display = 'none';
            isRemindersListVisible = false;
        }
    }

    // Проверка напоминаний
    function checkReminders() {
        let reminders = JSON.parse(localStorage.getItem('crm_toolReminders') || '[]');
        const now = Date.now();

        reminders = reminders.filter(reminder => {
            if (now >= reminder.reminderTimestamp) {
                audio.play();
                reminderButton.classList.add('active');
                setTimeout(() => reminderButton.classList.remove('active'), 2000);
                alert(`Напоминание: ${reminder.clientId || 'Нет ID'}: ${reminder.reminderText}`);
                if (reminder.openLink && reminder.leadLink) {
                    window.open(reminder.leadLink, '_blank');
                }
                return false;
            }
            return true;
        });

        localStorage.setItem('crm_toolReminders', JSON.stringify(reminders));
    }

    // Форматирование времени по Москве
    function formatMoscowTime(date) {
        return date.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    // Проверка обновлений
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: GITHUB_VERSION_URL,
            onload: function(response) {
                const latestVersion = response.responseText.trim();
                if (latestVersion && latestVersion !== CURRENT_VERSION) {
                    updateButton.style.display = 'block';
                    if (confirm(`Доступна новая версия CrmTool (${latestVersion}). Обновить сейчас?`)) {
                        window.location.href = GITHUB_SCRIPT_URL;
                    }
                }
            },
            onerror: function(error) {
                console.error('Ошибка проверки обновлений:', error);
            }
        });
    }

    // Загрузка данных о праздниках
    function loadHolidaysData(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: GITHUB_HOLIDAYS_URL,
            onload: function(response) {
                try {
                    holidaysData = JSON.parse(response.responseText);
                    console.log('Данные о праздниках загружены:', holidaysData);
                    callback();
                } catch (e) {
                    console.error('Ошибка парсинга данных о праздниках:', e);
                    alert('Не удалось загрузить данные о праздниках. Используются значения по умолчанию.');
                    holidaysData = { holidays: {}, holidayNames: {} };
                    callback();
                }
            },
            onerror: function(error) {
                console.error('Ошибка загрузки данных о праздниках:', error);
                alert('Не удалось загрузить данные о праздниках. Используются значения по умолчанию.');
                holidaysData = { holidays: {}, holidayNames: {} };
                callback();
            }
        });
    }

    // Обработчики событий
    reminderButton.addEventListener('click', () => {
        modal.style.display = 'block';
        reminderButton.classList.add('active');
        setTimeout(() => reminderButton.classList.remove('active'), 500);
    });
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    submitButtonModal.addEventListener('click', saveReminder);
    listButton.addEventListener('click', showRemindersList);
    resetButton.addEventListener('click', resetReminders);
    updateButton.addEventListener('click', () => {
        if (confirm('Обновить CrmTool?')) {
            window.location.href = GITHUB_SCRIPT_URL;
        }
    });

    // Таймер
    const timerScript = document.createElement('script');
    timerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.0/luxon.min.js';
    document.head.appendChild(timerScript);

    timerScript.onload = function() {
        const { DateTime } = luxon;

        const countries = {
            'Боливия': 'America/La_Paz',
            'Перу': 'America/Lima',
            'Эквадор': 'America/Guayaquil',
            'Колумбия': 'America/Bogota',
            'Гватемала': 'America/Guatemala',
            'Коста-Рика': 'America/Costa_Rica',
            'Аргентина': 'America/Argentina/Buenos_Aires',
            'Чили': 'America/Santiago',
            'Парагвай': 'America/Asuncion',
            'Уругвай': 'America/Montevideo',
            'Бразилия': 'America/Sao_Paulo',
            'Мексика': 'America/Mexico_City',
            'Венесуэла': 'America/Caracas',
            'Гондурас': 'America/Tegucigalpa',
            'Никарагуа': 'America/Managua',
            'Сальвадор': 'America/El_Salvador'
        };

        const bankHours = {
            'Боливия': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 12 },
            'Перу': { open: 9, close: 17, saturdayOpen: 9, saturdayClose: 13 },
            'Эквадор': { open: 9, close: 17, saturdayOpen: 9, saturdayClose: 13 },
            'Колумбия': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Гватемала': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 12 },
            'Коста-Рика': { open: 8, close: 16, saturdayOpen: 9, saturdayClose: 12 },
            'Аргентина': { open: 10, close: 15, saturdayOpen: 10, saturdayClose: 13 },
            'Чили': { open: 9, close: 14, saturdayOpen: 9, saturdayClose: 12 },
            'Парагвай': { open: 8, close: 15, saturdayOpen: 8, saturdayClose: 12 },
            'Уругвай': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Бразилия': { open: 10, close: 16, saturdayOpen: 10, saturdayClose: 14 },
            'Мексика': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Венесуэла': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Гондурас': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Никарагуа': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Сальвадор': { open: 8, close: 16, saturdayOpen: 8, saturdayClose: 12 }
        };

        function chooseMode() {
            console.log('chooseMode: Открытие меню');

            // Если меню уже открыто, закрываем его
            if (timerMenu.style.display === 'flex') {
                timerMenu.style.display = 'none';
                return;
            }

            // Показываем меню
            timerMenu.style.display = 'flex';

            // Позиционируем меню относительно кнопки
            const buttonRect = timerButton.getBoundingClientRect();
            let menuTop = buttonRect.bottom + 5; // Позиция ниже кнопки
            let menuLeft = buttonRect.left;

            // Убедимся, что меню не выходит за пределы экрана
            const menuHeight = timerMenu.offsetHeight;
            const menuWidth = timerMenu.offsetWidth;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // Если меню выходит за нижнюю границу экрана, показываем его выше кнопки
            if (menuTop + menuHeight > windowHeight) {
                menuTop = buttonRect.top - menuHeight - 5;
            }

            // Если меню выходит за правую границу экрана, корректируем положение
            if (menuLeft + menuWidth > windowWidth) {
                menuLeft = windowWidth - menuWidth - 5;
            }

            // Убедимся, что меню не уходит за левую или верхнюю границу
            menuLeft = Math.max(5, menuLeft);
            menuTop = Math.max(5, menuTop);

            timerMenu.style.top = `${menuTop}px`;
            timerMenu.style.left = `${menuLeft}px`;

            console.log(`chooseMode: Меню позиционировано - top: ${menuTop}px, left: ${menuLeft}px`);

            // Добавляем обработчик для скрытия меню при клике вне его
            const closeMenuOnClickOutside = (event) => {
                if (!timerMenu.contains(event.target) && event.target !== timerButton) {
                    console.log('chooseMode: Клик вне меню, закрытие');
                    timerMenu.style.display = 'none';
                    document.removeEventListener('click', closeMenuOnClickOutside);
                }
            };

            // Добавляем обработчик с небольшой задержкой, чтобы не сработал сразу
            setTimeout(() => {
                document.addEventListener('click', closeMenuOnClickOutside);
            }, 100);
        }

        function createTimeWindow() {
            let timeWindow = window.open('', '', 'width=300,height=500');
            if (!timeWindow) {
                alert('Разреши всплывающие окна для этого сайта!');
                return;
            }
            let container = timeWindow.document.createElement('div');
            container.id = 'time-widget-container';
            Object.assign(container.style, {
                backgroundColor: '#1a2a44',
                border: '1px solid #ddd',
                padding: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                resize: 'both',
                overflow: 'auto',
                minWidth: '200px',
                minHeight: '100px'
            });
            timeWindow.document.body.appendChild(container);
            setupClock(container);
        }

        function createTimePanel() {
            let container = document.createElement('div');
            container.id = 'time-widget-container';
            const savedPosition = GM_getValue('crm_toolTimerPosition', { top: '10px', left: '70px' });
            Object.assign(container.style, {
                position: 'fixed',
                top: savedPosition.top,
                left: savedPosition.left,
                zIndex: '9999',
                backgroundColor: '#1a2a44',
                border: '1px solid #ddd',
                padding: '15px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                resize: 'both',
                overflow: 'auto',
                minWidth: '200px',
                minHeight: '100px'
            });

            let header = document.createElement('h3');
            header.textContent = 'Банки Латинской Америки';
            Object.assign(header.style, {
                color: '#ffffff',
                margin: '0 0 10px 0',
                fontSize: '1.2em'
            });
            container.appendChild(header);

            let closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            Object.assign(closeButton.style, {
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '20px',
                height: '20px',
                zIndex: '10000'
            });
            closeButton.addEventListener('click', () => container.remove());
            container.appendChild(closeButton);

            document.body.appendChild(container);
            setupClock(container);
        }

        function setupClock(container) {
            let selectedCountries = GM_getValue('crm_toolSelectedCountries', Object.keys(countries));

            function createCountryElement(country) {
                let clock = document.createElement('div');
                Object.assign(clock.style, {
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                });
                clock.className = 'clock-item';

                let countryDiv = document.createElement('div');
                countryDiv.textContent = country;
                countryDiv.style.fontSize = '1.2em';
                countryDiv.style.color = '#ffffff';
                clock.appendChild(countryDiv);

                let timeDiv = document.createElement('div');
                timeDiv.style.fontSize = '1.5em';
                timeDiv.style.fontWeight = 'bold';
                clock.appendChild(timeDiv);

                let removeButton = document.createElement('button');
                removeButton.textContent = '✖';
                Object.assign(removeButton.style, {
                    marginLeft: '10px',
                    cursor: 'pointer',
                    color: '#ffffff',
                    background: 'transparent',
                    border: 'none'
                });
                removeButton.addEventListener('click', () => {
                    clock.remove();
                    selectedCountries = selectedCountries.filter(c => c !== country);
                    GM_setValue('crm_toolSelectedCountries', selectedCountries);
                    console.log('Страна удалена:', country);
                    updateCountrySelect(); // Обновляем список стран после удаления
                });
                clock.appendChild(removeButton);

                clock.timeDiv = timeDiv;
                clock.timeZone = countries[country];
                clock.bankHours = bankHours[country];
                clock.holidays = holidaysData.holidays[country] || [];
                clock.holidayNames = holidaysData.holidayNames[country] || {};

                return clock;
            }

            function addCountry(country) {
                if (!selectedCountries.includes(country)) {
                    selectedCountries.push(country);
                    const newCountryElement = createCountryElement(country);
                    container.insertBefore(newCountryElement, addCountryButton);
                    GM_setValue('crm_toolSelectedCountries', selectedCountries);
                    console.log('Страна добавлена:', country);
                    updateCountrySelect(); // Обновляем список стран после добавления
                } else {
                    alert('Эта страна уже добавлена!');
                }
            }

            // Создание и добавление существующих стран
            selectedCountries.forEach(country => container.appendChild(createCountryElement(country)));

            // Кнопка для добавления страны
            let addCountryButton = document.createElement('button');
            addCountryButton.textContent = 'Добавить страну';
            Object.assign(addCountryButton.style, {
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#4a4a4a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            });

            // Создание модального окна для выбора страны
            const countryModal = document.createElement('div');
            countryModal.className = 'crm_tool-country-modal';
            countryModal.style.display = 'none'; // По умолчанию скрыто

            // Функция для обновления списка стран в модальном окне
            function updateCountrySelect() {
                const availableCountries = Object.keys(countries).filter(c => !selectedCountries.includes(c));
                const countrySelect = countryModal.querySelector('#countrySelect');
                countrySelect.innerHTML = availableCountries
                    .map(country => `<option value="${country}">${country}</option>`)
                    .join('');
                if (availableCountries.length === 0) {
                    countryModal.style.display = 'none';
                    alert('Все страны уже добавлены');
                }
            }

            // Инициализация модального окна
            countryModal.innerHTML = `
                <h3>Выберите страну</h3>
                <select id="countrySelect">
                    ${Object.keys(countries)
                        .filter(c => !selectedCountries.includes(c))
                        .map(country => `<option value="${country}">${country}</option>`)
                        .join('')}
                </select>
                <button id="addCountryBtn">Добавить</button>
                <button id="cancelCountryBtn">Отмена</button>
            `;
            container.appendChild(countryModal);

            // Обработчик для кнопки "Добавить страну"
            addCountryButton.addEventListener('click', () => {
                const availableCountries = Object.keys(countries).filter(c => !selectedCountries.includes(c));
                if (!availableCountries.length) {
                    alert('Все страны уже добавлены');
                    return;
                }
                updateCountrySelect(); // Обновляем список перед показом
                countryModal.style.display = 'block'; // Показываем модальное окно
            });

            // Обработчики для модального окна
            const addCountryBtn = countryModal.querySelector('#addCountryBtn');
            const cancelCountryBtn = countryModal.querySelector('#cancelCountryBtn');
            const countrySelect = countryModal.querySelector('#countrySelect');

            addCountryBtn.addEventListener('click', () => {
                const selectedCountry = countrySelect.value;
                if (selectedCountry && countries.hasOwnProperty(selectedCountry)) {
                    addCountry(selectedCountry);
                    countryModal.style.display = 'none'; // Скрываем модальное окно после добавления
                }
            });

            cancelCountryBtn.addEventListener('click', () => {
                countryModal.style.display = 'none'; // Скрываем модальное окно при отмене
            });

            // Добавляем кнопку в контейнер
            container.appendChild(addCountryButton);

            function isHoliday(now, holidays) {
                const monthDay = now.toFormat('MM-dd');
                return holidays.includes(monthDay);
            }

            function isBankOpen(now, hours, holidays) {
                const day = now.weekday;
                const hour = now.hour;
                const isHolidayToday = isHoliday(now, holidays);

                if (isHolidayToday || day === 7) return false;
                if (day === 6) return hour >= hours.saturdayOpen && hour < hours.saturdayClose;
                return day >= 1 && day <= 5 && hour >= hours.open && hour < hours.close;
            }

            function getHolidayName(now, holidays, holidayNames) {
                const monthDay = now.toFormat('MM-dd');
                return holidayNames[monthDay] || 'Неизвестный праздник';
            }

            function updateTime() {
                let hasHoliday = false;
                [...container.children].forEach(clock => {
                    if (clock.timeDiv && clock.className === 'clock-item') {
                        let now = DateTime.now().setZone(clock.timeZone);
                        clock.timeDiv.textContent = now.toLocaleString(DateTime.TIME_WITH_SECONDS);
                        const isOpen = isBankOpen(now, clock.bankHours, clock.holidays);
                        const isHolidayToday = isHoliday(now, clock.holidays);
                        if (isHolidayToday) {
                            clock.timeDiv.style.color = '#ff69b4';
                            clock.timeDiv.setAttribute('title', `Праздник: ${getHolidayName(now, clock.holidays, clock.holidayNames)}`);
                            hasHoliday = true;
                        } else {
                            clock.timeDiv.style.color = isOpen ? 'green' : 'red';
                            clock.timeDiv.removeAttribute('title');
                        }
                        clock.querySelector('div:nth-child(1)').setAttribute('title', isHolidayToday ? `Праздник: ${getHolidayName(now, clock.holidays, clock.holidayNames)}` : '');
                    }
                });
                if (hasHoliday) {
                    let notice = container.querySelector('.holiday-notice') || document.createElement('div');
                    notice.className = 'holiday-notice';
                    notice.textContent = 'Сегодня праздник в: ' + selectedCountries.filter(c => isHoliday(DateTime.now().setZone(countries[c]), holidaysData.holidays[c] || [])).join(', ');
                    container.appendChild(notice);
                } else {
                    let notice = container.querySelector('.holiday-notice');
                    if (notice) notice.remove();
                }
            }

            setInterval(updateTime, 1000);
            updateTime();

            if (container.id === 'time-widget-container') {
                container.onmousedown = function(event) {
                    if (event.target.tagName.toLowerCase() === 'button' || event.target === closeButton) return;

                    let shiftX = event.clientX - container.getBoundingClientRect().left;
                    let shiftY = event.clientY - container.getBoundingClientRect().top;
                    let initialWidth = container.offsetWidth;
                    let initialHeight = container.offsetHeight;

                    function moveAt(pageX, pageY) {
                        let newLeft = pageX - shiftX;
                        let newTop = pageY - shiftY;
                        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - initialWidth));
                        newTop = Math.max(0, Math.min(newTop, window.innerHeight - initialHeight));
                        container.style.left = newLeft + 'px';
                        container.style.top = newTop + 'px';
                        GM_setValue('crm_toolTimerPosition', {
                            top: newTop + 'px',
                            left: newLeft + 'px'
                        });
                    }

                    function onMouseMove(event) {
                        moveAt(event.pageX, event.pageY);
                    }

                    document.addEventListener('mousemove', onMouseMove);
                    container.onmouseup = function() {
                        document.removeEventListener('mousemove', onMouseMove);
                        container.onmouseup = null;
                    };
                };
                container.ondragstart = () => false;
            }
        }

        // Обработчики для кнопок меню
        timerMenu.querySelector('.crm_tool-timer-window').addEventListener('click', () => {
            console.log('Выбрано: Открыть в новом окне');
            createTimeWindow();
            timerMenu.style.display = 'none';
        });

        timerMenu.querySelector('.crm_tool-timer-panel').addEventListener('click', () => {
            console.log('Выбрано: Открыть как виджет');
            createTimePanel();
            timerMenu.style.display = 'none';
        });

        timerButton.addEventListener('click', chooseMode);
    };

    // Проверка напоминаний каждую минуту
    setInterval(checkReminders, 60000);

    // Проверка обновлений и загрузка праздников
    loadHolidaysData(() => {
        checkForUpdates();
    });

    // Повторная инициализация с отладкой
    function initializeButtons() {
        console.log('CrmTool: Проверка инициализации...');
        if (!document.body || !document.body.contains(container)) {
            console.warn('CrmTool: document.body не доступен или контейнер не найден, пытаюсь добавить');
            document.body.appendChild(container);
            console.log('CrmTool: Контейнер добавлен:', container);
        } else {
            console.log('CrmTool: Контейнер уже в DOM:', container);
        }
        applyScreenPosition();
    }

    // Попытка инициализации при загрузке и с задержкой
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeButtons);
    } else {
        initializeButtons();
    }
    setTimeout(() => {
        console.log('CrmTool: Повторная попытка инициализации через 1 сек...');
        initializeButtons();
    }, 1000);
    setTimeout(() => {
        console.log('CrmTool: Повторная попытка инициализации через 3 сек...');
        initializeButtons();
    }, 3000);

    // Ручной вызов для отладки
    window.showCrmToolButtons = function() {
        initializeButtons();
        console.log('CrmTool: Кнопки показаны вручную');
    };

    // Обновление позиции при изменении размера окна
    window.addEventListener('resize', applyScreenPosition);

    // Функция для применения позиций в зависимости от разрешения
    function applyScreenPosition() {
        const height = window.innerHeight;
        if (height <= 720) {
            container.style.bottom = '8vh';
        } else if (height <= 1080) {
            container.style.bottom = '8vh';
        } else if (height <= 1440) {
            container.style.bottom = '8vh';
        } else {
            container.style.bottom = '8vh';
        }
    }
})();
