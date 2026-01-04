// ==UserScript==
// @name ! Кнопки навигации 76-80
// @match https://forum.blackrussia.online/*
// @version 1.0
// @license none
// @namespace Botir_Soliev      https://vk.com/botsol
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/519742/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%2076-80.user.js
// @updateURL https://update.greasyfork.org/scripts/519742/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%2076-80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Скрипт загружен");

    // Добавляем стили для кнопок и меню
    GM_addStyle(`
        .button-container {
            position: fixed;
            left: 50%;
            top: 60px;
            transform: translateX(-50%);
            z-index: 9999;
            display: none;
            flex-wrap: wrap;
            justify-content: center;
            width: 300px;
            transition: opacity 0.3s ease;
        }
                .custom-button {
            color: black;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold; /* Устанавливаем жирный шрифт */
            cursor: pointer;
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.2s;
            margin: 5px;
            width: calc(33% - 10px); /* 100% / 15 = 6.25% */
            text-align: center;
        }



        .custom-button:hover {
            opacity: 0.8;
            transform: scale(1.05);
        }

        .button-wrapper {
            position: fixed;
            top: 8px;
            right: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        }

        .menu-button, .open-forum-button, .knowledge-base-button, .notes-button, .vk-button, .tasks-button {
            padding: 3px 10px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 120px;
        }

        .menu-button { background-color: #007bff; }
        .open-forum-button { background-color: #28a745; }
        .knowledge-base-button { background-color: #ffc107; }
        .notes-button { background-color: #17a2b8; }
        .vk-button { background-color: #4A76A8; }
        .tasks-button { background-color: #fd7e14; }

        .notepad {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 400px;
            background-color: white;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: none;
            padding: 10px;
            box-sizing: border-box;
            overflow-y: auto;
        }

        .notepad textarea {
            width: 100%;
            height: 100px;
            border: none;
            resize: none;
            font-size: 14px;
        }

        .notepad-close {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: red;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .tasks-container {
            margin-top: 10px;
        }

        .task-item {
            margin: 5px 0;
            padding: 5px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: black; /* Установлен черный цвет текста */
        }

        .input-container {
            margin-bottom: 10px;
        }

        .input-container input {
            width: calc(50% - 5px);
            margin-right: 5px;
        }
    `);

    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    document.body.appendChild(buttonContainer);

    // Массив с данными кнопок
    const buttonsData = [


    { text: 'РАЗДЕЛ 76', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chita.3394/', color: '#35CA68' },
    { text: 'ЖБ ТЕХ 76', link: 'https://forum.blackrussia.online/forums/Сервер-№76-chita.3393/', color: '#35CA68' },
    { text: 'ИГРОКИ 76', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3414/', color: '#35CA68' },

    { text: 'РАЗДЕЛ 77', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kostroma.3429/', color: '#F1B10D' },
    { text: 'ЖБ ТЕХ 77', link: 'https://forum.blackrussia.online/forums/Сервер-№77-kostroma.3428/', color: '#F1B10D' },
    { text: 'ИГРОКИ 77', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3449/', color: '#F1B10D' },

    { text: 'РАЗДЕЛ 78', link: 'https://forum.blackrussia.online/forums/Технический-раздел-vladimir.3464/', color: '#F58041' },
    { text: 'ЖБ ТЕХ 78', link: 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/', color: '#F58041' },
    { text: 'ИГРОКИ 78', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/', color: '#F58041' },

    { text: 'РАЗДЕЛ 79', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kaluga.3499/', color: '#3032A4' },
    { text: 'ЖБ ТЕХ 79', link: 'https://forum.blackrussia.online/forums/Сервер-№79-kaluga.3498/', color: '#3032A4' },
    { text: 'ИГРОКИ 79', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3519/', color: '#3032A4' },

    { text: 'РАЗДЕЛ 80', link: 'https://forum.blackrussia.online/forums/Технический-раздел-novgorod.3535/', color: '#FFC700' },
    { text: 'ЖБ ТЕХ 80', link: 'https://forum.blackrussia.online/forums/Сервер-№80-novgorod.3533/', color: '#FFC700' },
    { text: 'ИГРОКИ 80', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3555/', color: '#FFC700' },

        // ... другие кнопки
    ];

    // Функция для создания кнопок
    buttonsData.forEach((buttonData) => {
        const button = document.createElement('div');
        button.className = 'custom-button';
        button.innerHTML = buttonData.text;
        button.style.backgroundColor = buttonData.color;

        button.addEventListener('click', function() {
            window.location.href = buttonData.link;
        });

        buttonContainer.appendChild(button);
    });

    // Создаем обертку для кнопок "Меню", "Открыть Логи", "База Знаний", "Заметки", "ВКонтакте" и "Задания"
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'button-wrapper';
    document.body.appendChild(buttonWrapper);

    // Создаем кнопку "Меню"
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.innerHTML = 'Меню';

    menuButton.addEventListener('click', function() {
        const isVisible = buttonContainer.style.display === 'flex';
        buttonContainer.style.display = isVisible ? 'none' : 'flex';
        console.log(isVisible ? "Контейнер скрыт" : "Контейнер показан");
    });

    buttonWrapper.appendChild(menuButton);
    console.log("Кнопка меню добавлена");

    // Создаем кнопку "Открыть Логи"
    const openForumButton = document.createElement('button');
    openForumButton.className = 'open-forum-button';
    openForumButton.innerHTML = 'Открыть Логи';

    openForumButton.addEventListener('click', function() {
        window.open('https://logs.blackrussia.online', '_blank');
        console.log("Логи открыты в новом окне");
    });

    buttonWrapper.appendChild(openForumButton);
    console.log("Кнопка 'Открыть Логи' добавлена");

    // Создаем кнопку "База Знаний"
    const knowledgeBaseButton = document.createElement('button');
    knowledgeBaseButton.className = 'knowledge-base-button';
    knowledgeBaseButton.innerHTML = 'База Знаний';

    knowledgeBaseButton.addEventListener('click', function() {
        window.open('https://vk.com/br_spec', '_blank');
        console.log("База знаний открыта в новом окне");
    });

    buttonWrapper.appendChild(knowledgeBaseButton);
    console.log("Кнопка 'База Знаний' добавлена");

    // Создаем кнопку "Заметки"
    const notesButton = document.createElement('button');
    notesButton.className = 'notes-button';
    notesButton.innerHTML = 'Заметки';

    notesButton.addEventListener('click', function() {
        notepad.style.display = 'block';
        console.log("Блокнот открыт");
    });

    buttonWrapper.appendChild(notesButton);
    console.log("Кнопка 'Заметки' добавлена");

    // Создаем кнопку "ВКонтакте"
    const vkButton = document.createElement('button');
    vkButton.className = 'vk-button';
    vkButton.innerHTML = 'ВКонтакте';

    vkButton.addEventListener('click', function() {
        window.open('https://vk.com/feed', '_blank');
        console.log("ВКонтакте открыто в новом окне");
    });

    buttonWrapper.appendChild(vkButton);
    console.log("Кнопка 'ВКонтакте' добавлена");

    // Создаем текстовой блокнот
    const notepad = document.createElement('div');
    notepad.className = 'notepad';
    document.body.appendChild(notepad);

    const closeButton = document.createElement('button');
    closeButton.className = 'notepad-close';
    closeButton.innerHTML = 'Закрыть';
    closeButton.addEventListener('click', function() {
        notepad.style.display = 'none';
        console.log("Блокнот закрыт");
    });

    notepad.appendChild(closeButton);

    // Создаем контейнер для задач
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    notepad.appendChild(tasksContainer);

    // Создаем контейнер для ввода задания
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    tasksContainer.appendChild(inputContainer);

    // Создаем текстовое поле для ввода задания с ограничением на 45 символов
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = '(макс. 45 символов)';
    taskInput.maxLength = 45; // Ограничение на 45 символов
    inputContainer.appendChild(taskInput);

    // Кнопка для добавления задания
    const addTaskButton = document.createElement('button');
    addTaskButton.innerHTML = 'Добавить задание';
    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = ''; // Очистить поле ввода
        } else {
            alert("Пожалуйста, введите задание.");
        }
    });

    inputContainer.appendChild(addTaskButton);

    // Функция для добавления задания
    function addTask(taskText) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const taskTextElement = document.createElement('strong');
        taskTextElement.innerHTML = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', function() {
            tasksContainer.removeChild(taskItem);
            saveTasks();
            console.log("Задание удалено: " + taskText);
        });

        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(deleteButton);

        tasksContainer.appendChild(taskItem);
        saveTasks();
        console.log("Задание добавлено: " + taskText);
    }

    // Сохранение заданий в localStorage
    function saveTasks() {
        const tasks = Array.from(tasksContainer.getElementsByClassName('task-item')).map(item => item.firstChild.innerText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Загрузка заданий из localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskText => {
            addTask(taskText);
        });
    }

    loadTasks(); // Загружаем задания при инициализации

///////////////////////////////////////////////////////////////////



(function() {
    'use strict';

    // Создаем контейнер для всех счетчиков
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.backgroundColor = 'rgba(45, 50, 56, 0.9)';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(container);

    // Функция для создания счетчика сообщений
    function createMessageCounter(counterId, label) {
        const messageCounterElement = document.createElement('div');
        messageCounterElement.style.display = 'flex';
        messageCounterElement.style.alignItems = 'center';
        messageCounterElement.style.margin = '5px 0';

        const messageCounterDisplay = document.createElement('span');
        messageCounterDisplay.innerText = `${label}: ${localStorage.getItem(`messageCount${counterId}`) || 0}`;
        messageCounterDisplay.style.marginRight = '10px';
        messageCounterDisplay.style.cursor = 'pointer';

        // Добавляем обработчик клика для каждого счетчика
        messageCounterDisplay.addEventListener('click', () => {
            incrementCounter(counterId);
        });

        // Добавляем элемент отображения в контейнер
        messageCounterElement.appendChild(messageCounterDisplay);
        container.appendChild(messageCounterElement);

        return messageCounterDisplay;
    }

    const counters = [
        { id: 1, label: 'РАССМОТРЕНО' },
        { id: 2, label: 'РЕШЕН' },
        { id: 3, label: 'ЗАКРЫТО' },
        { id: 4, label: 'ОТКАЗАНО' }
    ];

    const countersDisplays = counters.map(counter => createMessageCounter(counter.id, counter.label));

    const totalElement = document.createElement('div');
    totalElement.innerText = `ИТОГО: 0`;
    container.appendChild(totalElement);

    function updateTotalCount() {
        let totalCount = 0;
        counters.forEach(counter => {
            totalCount += parseInt(localStorage.getItem(`messageCount${counter.id}`)) || 0;
        });
        totalElement.innerText = `ИТОГО: ${totalCount}`;
    }

    function incrementCounter(counterId) {
        let count = parseInt(localStorage.getItem(`messageCount${counterId}`)) || 0;
        count++;
        localStorage.setItem(`messageCount${counterId}`, count);
        countersDisplays[counterId - 1].innerText = `${counters[counterId - 1].label}: ${count}`;
        updateTotalCount();
    }

    function resetCounters() {
        counters.forEach(counter => {
            localStorage.setItem(`messageCount${counter.id}`, 0);
            countersDisplays[counter.id - 1].innerText = `${counter.label}: 0`;
        });
        updateTotalCount();
    }

    // Инициализация счетчиков при загрузке страницы
    counters.forEach(counter => {
        if (localStorage.getItem(`messageCount${counter.id}`) === null) {
            localStorage.setItem(`messageCount${counter.id}`, 0); // Устанавливаем значение в 0, если его нет
        }
        countersDisplays[counter.id - 1].innerText = `${counter.label}: ${localStorage.getItem(`messageCount${counter.id}`)}`; // Обновляем отображение
    });

    updateTotalCount(); // Обновляем общее количество тем при загрузке

    const resetButton = document.createElement('button');
    resetButton.innerText = 'Сбросить';
    resetButton.style.backgroundColor = 'red';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.padding = '5px 10px';
    resetButton.style.marginTop = '10px';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';

    resetButton.addEventListener('click', resetCounters);
    container.appendChild(resetButton);

    const buttons = {
        'РАССМОТРЕНО': 'button#watched',
        'РЕШЕН': 'button#decided',
        'ЗАКРЫТО': 'button#closed',
        'ОТКАЗАНО': 'button#unaccept'
    };

    for (const [label, selector] of Object.entries(buttons)) {
        const button = document.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => {
                const counterId = counters.find(counter => counter.label === label).id;
                incrementCounter(counterId);
            });
        } else {
            console.warn(`Кнопка "${label}" не найдена. Убедитесь, что селектор правильный.`);
        }
    }
})();



})();