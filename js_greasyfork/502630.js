// ==UserScript==
// @name         UnicoNotion
// @version      2.9.3
// @description  Скрипт,который позволяет ставить напоминание на клиента через определенное время.
// @author       Ебейший 77
// @match        *://web-unico.chat2desk.com/*
// @match        *://web.chat2desk.by/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @namespace https://greasyfork.org/users/1338837
// @downloadURL https://update.greasyfork.org/scripts/502630/UnicoNotion.user.js
// @updateURL https://update.greasyfork.org/scripts/502630/UnicoNotion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GITHUB_VERSION_URL = 'https://raw.githubusercontent.com/PoopSoftWare/UnicoNotion/main/upd';
    const GITHUB_SCRIPT_URL = 'https://update.greasyfork.org/scripts/502630/UnicoNotion.user.js';
    const CURRENT_VERSION = '2.9.3';

    function createButton(text, styles) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, styles, {
            position: 'fixed',
            zIndex: 1000,
            cursor: 'pointer',
        });
        return button;
    }

    const reminderButton = createButton('+', {
        bottom: '10vh',
        left: '1vw',
        width: '60px',
        height: '60px',
        backgroundColor: '#808080',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        fontSize: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    });

    document.body.appendChild(reminderButton);

    const formContainer = createFormContainer();
    document.body.appendChild(formContainer);

    const listContainer = createListContainer();
    document.body.appendChild(listContainer);

    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-7.mp3');

    reminderButton.addEventListener('click', () => formContainer.style.display = 'block');

    document.getElementById('closeForm').addEventListener('click', () => formContainer.style.display = 'none');
    document.getElementById('saveReminder').addEventListener('click', saveReminder);
    document.getElementById('showList').addEventListener('click', showRemindersList);

    //функциональность перетаскивания формы
    makeFormDraggable(formContainer);

    function createFormContainer() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'none',
            position: 'fixed',
            top: '20vh',
            left: '2vw',
            zIndex: 1001,
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ddd',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            width: '300px',
            cursor: 'move', // Указываем, что форма перетаскиваемая
        });
        container.innerHTML = `
            <h3>Добавить напоминание</h3>
            <label>ID Лида:</label>
            <input type="text" id="clientId" style="width: 100%; margin-bottom: 10px;">
            <label>Текст напоминания:</label>
            <input type="text" id="reminderText" style="width: 100%; margin-bottom: 10px;">
            <label>Через сколько часов:</label>
            <input type="number" id="reminderHours" style="width: 100%; margin-bottom: 10px;" min="0" placeholder="Часы">
            <label>Через сколько минут:</label>
            <input type="number" id="reminderMinutes" style="width: 100%; margin-bottom: 10px;" min="0" placeholder="Минуты">
            <button id="saveReminder" style="width: 100%;">Сохранить</button>
            <button id="showList" style="width: 100%; margin-top: 10px;">Список напоминаний</button>
            <button id="closeForm" style="width: 100%; margin-top: 10px;">Закрыть</button>
        `;
        return container;
    }

    function createListContainer() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'none',
            position: 'fixed',
            top: '20vh',
            left: '2vw',
            zIndex: 1001,
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ddd',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            width: '400px',
            maxHeight: '60vh',
            overflowY: 'auto',
        });
        container.innerHTML = `
            <h3>Список напоминаний</h3>
            <div id="remindersList"></div>
            <button id="closeList" style="width: 100%; margin-top: 10px;">Закрыть</button>
        `;
        container.querySelector('#closeList').addEventListener('click', () => {
            container.style.display = 'none';
            formContainer.style.display = 'block';
        });
        return container;
    }

    function saveReminder() {
        const clientId = document.getElementById('clientId').value;
        const reminderText = document.getElementById('reminderText').value;
        const reminderHours = parseInt(document.getElementById('reminderHours').value) || 0;
        const reminderMinutes = parseInt(document.getElementById('reminderMinutes').value) || 0;

        if (!clientId || !reminderText || (isNaN(reminderHours) && isNaN(reminderMinutes))) {
            alert('Заполните все поля');
            return;
        }

        const now = new Date();
        const reminder = {
            clientId,
            reminderText,
            reminderTime: reminderHours * 60 + reminderMinutes,
            reminderTimestamp: now.getTime() + (reminderHours * 60 + reminderMinutes) * 60000
        };

        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.push(reminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));

        alert('Напоминание сохранено');

        // Очищаем поля после сохранения
        document.getElementById('clientId').value = '';
        document.getElementById('reminderText').value = '';
        document.getElementById('reminderHours').value = '';
        document.getElementById('reminderMinutes').value = '';
    }

    function showRemindersList() {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const listElement = document.getElementById('remindersList');
        listElement.innerHTML = '';

        reminders.forEach((reminder, index) => {
            const reminderTime = new Date(reminder.reminderTimestamp);
            const formattedTime = formatMoscowTime(reminderTime);

            const reminderItem = document.createElement('div');
            reminderItem.innerHTML = `
                <p><strong>Лид:</strong> ${reminder.clientId}</p>
                <p><strong>Напоминание:</strong> ${reminder.reminderText}</p>
                <p><strong>Время (МСК):</strong> ${formattedTime}</p>
                <button class="deleteReminder" data-index="${index}">Удалить</button>
                <hr>
            `;
            listElement.appendChild(reminderItem);
        });

        // Добавляем обработчик события для всех кнопок удаления
        const deleteButtons = listElement.getElementsByClassName('deleteReminder');
        for (const button of deleteButtons) {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteReminder(index);
            });
        }

        formContainer.style.display = 'none';
        listContainer.style.display = 'block';
    }

    function formatMoscowTime(date) {
        const moscowOffset = 3 * 60; // Moscow is UTC+3
        const userOffset = -date.getTimezoneOffset();
        const offsetDiff = moscowOffset - userOffset;

        const moscowDate = new Date(date.getTime() + offsetDiff * 60000);

        return moscowDate.toLocaleString('ru-RU', {
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

    function deleteReminder(index) {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.splice(index, 1);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        showRemindersList();
    }

    function checkReminders() {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const now = Date.now();

        reminders = reminders.filter(reminder => {
            if (now >= reminder.reminderTimestamp) {
                audio.play();
                alert(`Напоминание: ${reminder.clientId}: ${reminder.reminderText}`);
                return false;
            }
            return true;
        });

        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: GITHUB_VERSION_URL,
            onload: function(response) {
                const latestVersion = response.responseText.trim();
                if (latestVersion !== CURRENT_VERSION) {
                    const updateButton = createButton('Обновить', {
                        bottom: '10vh',
                        right: '1vw',
                        width: '80px',
                        height: '40px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                    });
                    document.body.appendChild(updateButton);
                    updateButton.addEventListener('click', () => {
                        window.open(GITHUB_SCRIPT_URL, '_blank');
                    });
                }
            }
        });
    }

    // Функция для перетаскивания формы
    function makeFormDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'move';
        });
    }

    setInterval(checkReminders, 60000); // Проверка каждую минуту
    checkForUpdates();
})();

