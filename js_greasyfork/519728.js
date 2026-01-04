// ==UserScript==
// @name ! Кнопки навигации 21-25
// @match https://forum.blackrussia.online/*
// @version 1.0
// @license none
// @namespace Botir_Soliev      https://vk.com/botsol
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/519728/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%2021-25.user.js
// @updateURL https://update.greasyfork.org/scripts/519728/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%2021-25.meta.js
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
            padding: 5px 15px;
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
    { text: 'РАЗДЕЛ 21', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chilli.1007/', color: '#FE2726' },
    { text: 'ЖБ ТЕХ 21', link: 'https://forum.blackrussia.online/forums/Сервер-№21-chilli.1202/', color: '#FE2726' },
    { text: 'ИГРОКИ 21', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.994/', color: '#FE2726' },

    { text: 'РАЗДЕЛ 22', link: 'https://forum.blackrussia.online/forums/Технический-раздел-choco.1048/', color: '#BF835C' },
    { text: 'ЖБ ТЕХ 22', link: 'https://forum.blackrussia.online/forums/Сервер-№22-choco.1203/', color: '#BF835C' },
    { text: 'ИГРОКИ 22', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1036/', color: '#BF835C' },

    { text: 'РАЗДЕЛ 23', link: 'https://forum.blackrussia.online/forums/Технический-раздел-moscow.1052/', color: '#FF2B3B' },
    { text: 'ЖБ ТЕХ 23', link: 'https://forum.blackrussia.online/forums/Сервер-№23-moscow.1204/', color: '#FF2B3B' },
    { text: 'ИГРОКИ 23', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1082/', color: '#FF2B3B' },

    { text: 'РАЗДЕЛ 24', link: 'https://forum.blackrussia.online/forums/Технический-раздел-spb.1095/', color: '#11A6FA' },
    { text: 'ЖБ ТЕХ 24', link: 'https://forum.blackrussia.online/forums/Сервер-№24-spb.1205/', color: '#11A6FA' },
    { text: 'ИГРОКИ 24', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/', color: '#11A6FA' },

    { text: 'РАЗДЕЛ 25', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ufa.1138/', color: '#FFBA08' },
    { text: 'ЖБ ТЕХ 25', link: 'https://forum.blackrussia.online/forums/Сервер-№25-ufa.1206/', color: '#FFBA08' },
    { text: 'ИГРОКИ 25', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1167/', color: '#FFBA08' },

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

})();