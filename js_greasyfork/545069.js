// ==UserScript==
// @name         event planner
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  event planner from catliife
// @author       https://m.vk.com/modsforcatlife?from=groups
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545069/event%20planner.user.js
// @updateURL https://update.greasyfork.org/scripts/545069/event%20planner.meta.js
// ==/UserScript==

(function() {
    // Создаем кнопку для открытия панели
    const showBtn = document.createElement('button');
    showBtn.textContent = '📅 События';
    showBtn.id = 'event-notifier-btn';
    showBtn.style = `
        position: fixed;
        top: 10px;
        right: 260px;
        padding: 8px 15px;
        background-color: rgba(34, 34, 34, 0.8);
        color: #FF9500;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        z-index: 9998;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        font-size: 14px;
        transition: all 0.3s ease;
    `;
    showBtn.onmouseover = () => {
        showBtn.style.backgroundColor = 'white';
        showBtn.style.transform = 'scale(1.05)';
    };
        showBtn.onmouseout = () => {
        showBtn.style.backgroundColor = 'rgba(34, 34, 34, 0.8)';
        showBtn.style.transform = 'scale(1)';
    };

    document.body.appendChild(showBtn);

    // Создаем основную структуру панели (изначально скрыта)
    const panel = document.createElement('div');
    panel.id = 'event-notifier-panel';
    panel.style = `
        position: fixed;
        top: 50px;
        right: 20px;
        width: 350px;
        background-color: rgba(0, 0, 0, 0.85);
        border: 2px solid #FF6D00;
        border-radius: 10px;
        color: white;
        font-family: Arial, sans-serif;
        z-index: 9999;
        box-shadow: 0 0 15px rgba(255, 109, 0, 0.5);
        max-height: 80vh;
        overflow: hidden;
        display: none;
        flex-direction: column;
    `;

    // Заголовок панели
    const header = document.createElement('div');
    header.style = `
        background-color: #FF6D00;
        padding: 10px 15px;
        font-weight: bold;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.textContent = 'Планировщик событий';

    // Кнопка закрытия
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.style = `
        cursor: pointer;
        font-size: 20px;
    `;
    closeBtn.onclick = () => {
        panel.style.display = 'none';
        showBtn.style.display = 'block';
    };
    header.appendChild(closeBtn);

    // Основное содержимое
    const content = document.createElement('div');
    content.style = `
        padding: 15px;
        overflow-y: auto;
        flex-grow: 1;
    `;

    // Форма добавления/редактирования события
    const form = document.createElement('div');
    form.style.marginBottom = '20px';

    const titleInput = document.createElement('input');
    titleInput.placeholder = 'Название события';
    titleInput.style = `
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        background-color: rgba(255,255,255,0.1);
        border: 1px solid #FF6D00;
        color: white;
        border-radius: 4px;
    `;

    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.style = `
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        background-color: rgba(255,255,255,0.1);
        border: 1px solid #FF6D00;
        color: white;
        border-radius: 4px;
    `;

    const descInput = document.createElement('textarea');
    descInput.placeholder = 'Описание (необязательно)';
    descInput.style = `
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        background-color: rgba(255,255,255,0.1);
        border: 1px solid #FF6D00;
        color: white;
        border-radius: 4px;
        min-height: 60px;
        resize: vertical;
    `;

    const actionBtn = document.createElement('button');
    actionBtn.id = 'event-action-btn';
    actionBtn.textContent = 'Добавить событие';
    actionBtn.style = `
        width: 100%;
        padding: 10px;
        background-color: #FF6D00;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
    `;
    actionBtn.onmouseover = () => actionBtn.style.backgroundColor = '#FF8B33';
    actionBtn.onmouseout = () => actionBtn.style.backgroundColor = '#FF6D00';

    // Скрытое поле для хранения индекса редактируемого события
    const editIndexInput = document.createElement('input');
    editIndexInput.type = 'hidden';
    editIndexInput.id = 'edit-index';

    // Список событий
    const eventsList = document.createElement('div');
    eventsList.id = 'events-list';
    eventsList.style = `
        margin-top: 20px;
        border-top: 1px solid #FF6D00;
        padding-top: 15px;
    `;

    const noEvents = document.createElement('div');
    noEvents.textContent = 'Нет запланированных событий';
    noEvents.style = `
        text-align: center;
        color: #888;
        font-style: italic;
        padding: 10px;
    `;
    eventsList.appendChild(noEvents);

    // Собираем форму
    form.appendChild(titleInput);
    form.appendChild(dateInput);
    form.appendChild(descInput);
    form.appendChild(editIndexInput);
    form.appendChild(actionBtn);

    content.appendChild(form);
    content.appendChild(eventsList);

    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);

    // Локальное хранилище для событий
    let events = JSON.parse(localStorage.getItem('event-notifier-events')) || [];

    // Функция отображения событий
    function renderEvents() {
        eventsList.innerHTML = '';

        if (events.length === 0) {
            eventsList.appendChild(noEvents);
            return;
        }

        // Сортируем события по дате
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        events.forEach((event, index) => {
            const eventElement = document.createElement('div');
            eventElement.style = `
                background-color: rgba(255, 109, 0, 0.1);
                border-left: 3px solid #FF6D00;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 0 4px 4px 0;
                position: relative;
            `;

            const eventTitle = document.createElement('div');
            eventTitle.style = `
                font-weight: bold;
                margin-bottom: 5px;
                color: #FF6D00;
            `;
            eventTitle.textContent = event.title;

            const eventDate = document.createElement('div');
            eventDate.style = `
                font-size: 12px;
                margin-bottom: 5px;
                color: #ccc;
            `;
            eventDate.textContent = new Date(event.date).toLocaleString();

            const eventDesc = document.createElement('div');
            eventDesc.style = `
                font-size: 13px;
                margin-bottom: 5px;
                color: #aaa;
            `;
            eventDesc.textContent = event.desc || 'Нет описания';

            const btnContainer = document.createElement('div');
            btnContainer.style = `
                display: flex;
                justify-content: flex-end;
                gap: 5px;
            `;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Редактировать';
            editBtn.style = `
                background-color: rgba(255, 165, 0, 0.3);
                color: white;
                border: none;
                padding: 3px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;
            editBtn.onclick = () => {
                titleInput.value = event.title;
                dateInput.value = event.date.replace(' ', 'T').slice(0, 16);
                descInput.value = event.desc || '';
                document.getElementById('edit-index').value = index;
                actionBtn.textContent = 'Сохранить изменения';
                panel.scrollTop = 0;
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Удалить';
            deleteBtn.style = `
                background-color: rgba(255, 0, 0, 0.3);
                color: white;
                border: none;
                padding: 3px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;
            deleteBtn.onclick = () => {
                events.splice(index, 1);
                localStorage.setItem('event-notifier-events', JSON.stringify(events));
                renderEvents();
            };

            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);

            eventElement.appendChild(eventTitle);
            eventElement.appendChild(eventDate);
            eventElement.appendChild(eventDesc);
            eventElement.appendChild(btnContainer);

            eventsList.appendChild(eventElement);
        });
    }

    // Функция добавления/редактирования события
    actionBtn.onclick = () => {
        if (!titleInput.value || !dateInput.value) {
            alert('Пожалуйста, заполните название и дату события');
            return;
        }

        const editIndex = document.getElementById('edit-index').value;

        const eventData = {
            title: titleInput.value,
            date: dateInput.value,
            desc: descInput.value,
            notified: false
        };

        if (editIndex !== '') {
            // Редактирование существующего события
            events[editIndex] = eventData;
        } else {
            // Добавление нового события
            events.push(eventData);
        }

        localStorage.setItem('event-notifier-events', JSON.stringify(events));

        // Сброс формы
        titleInput.value = '';
        dateInput.value = '';
        descInput.value = '';
        document.getElementById('edit-index').value = '';
        actionBtn.textContent = 'Добавить событие';

        renderEvents();
    };

    // Проверка событий на уведомления
    function checkNotifications() {
        const now = new Date();

        events.forEach(event => {
            const eventDate = new Date(event.date);

            if (eventDate <= now && !event.notified) {
                // Помечаем как уведомленное
                event.notified = true;
                localStorage.setItem('event-notifier-events', JSON.stringify(events));

                // Показываем уведомление
                if (Notification.permission === 'granted') {
                    new Notification(`Наступило событие: ${event.title}`, {
                        body: event.desc || 'Нет описания',
                        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0ZGNkQwMCIgZD0iTTEyLDJMMTIsMkwxMiwyQzcuMDMsMiAzLDYuMDMgMywxMUMyLDE2IDYsMTkuNSAxMSwyMkMxNiwxOS41IDIwLDE2IDIwLDExQzIwLDYuMDMgMTUuOTcsMiAxMS45OSwyTDEyLDJMMTIsMkwxMiwyWiIvPjwvc3ZnPg=='
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification(`Наступило событие: ${event.title}`, {
                                body: event.desc || 'Нет описания',
                                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0ZGNkQwMCIgZD0iTTEyLDJMMTIsMkwxMiwyQzcuMDMsMiAzLDYuMDMgMywxMUMyLDE2IDYsMTkuNSAxMSwyMkMxNiwxOS41IDIwLDE2IDIwLDExQzIwLDYuMDMgMTUuOTcsMiAxMS45OSwyTDEyLDJMMTIsMkwxMiwyWiIvPjwvc3ZnPg=='
                            });
                        }
                    });
                }

                // Обновляем список
                renderEvents();
            }
        });
    }

    // Запрашиваем разрешение на уведомления при первом запуске
    if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    // Инициализация
    renderEvents();

    // Проверяем события каждую минуту
    setInterval(checkNotifications, 60000);
    checkNotifications(); // Проверить сразу при загрузке

    // Обработчик кнопки показа панели
    showBtn.onclick = () => {
        panel.style.display = 'flex';
        showBtn.style.display = 'none';
    };

    // Закрытие панели при клике вне ее
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== showBtn && panel.style.display === 'flex') {
            panel.style.display = 'none';
            showBtn.style.display = 'block';
        }
    });
})();