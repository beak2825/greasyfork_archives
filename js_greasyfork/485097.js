// ==UserScript==
// @name         Spying :)
// @namespace    http://tampermonkey.net/
// @version      2024-01-19.4
// @description  Get information about the latest online user in MOPS
// @author       Nikita Nikitin
// @match        https://mops-portal.azurewebsites.net/taskaudit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azurewebsites.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485097/Spying%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485097/Spying%20%3A%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userName = [];
    const startTime = [];
    let minMinute = 900;

    // Массивы с именами пользователей для каждой роли
    const teamLeads = ['OlgaGanzina', 'LiliaIvanitskaya', 'AndriiZasypko', 'Tetyana Silenko', 'Siarhei Sviantsitski', 'OlhaRybak', 'BessmertnyiMaksym', 'Serghei Podreadov'];
    const supervisors = ['tatyana', 'AnnaPoshin', 'AnnaGrigorieva', 'Yakov Sidorenko', 'Irina Davydova', 'ArtemTorop', 'Vitaliy Kharchenko', 'GalkinaYevgeniia', 'ShchedrovskaOksana', 'KotOleksandr', 'Mozhenko Dmytro', 'DziubaVolodymyr', 'SvitlanaRybak', 'SydorchukYurii', 'BondarenkoDmytro', 'TumanovOleksii', 'PopovaElena', 'IrinaKvitko', 'DenysMelykh', 'Tavdina Lytvyn', 'NovakValeriia', 'ZatkheiYuliia', 'VolkovskaYana', 'DotsenkoOleksandr', 'FokYuliia', 'LapaiMaksym', 'LiraSilenko', 'NikitinaAlina', 'YevheniiPiliuhin', 'DmytroPeresiedov'];
    const moderators = ['MarharytaIvasishyna', 'AnatoliiRohoza', 'AleksandrKolesnikov', 'VladyslavMoroz', 'AndriiPavlenko', 'ValeriaCostenciuc', 'Seit-EminovaLolita', 'PopovOleg', 'NinaSavchenko', 'PopovaAnastasiia', 'ArtemBahler', 'MarynaAgapova', 'DaniilPysarenko', 'HryhoriiPuhach', 'PshenychnyiMykhailo', 'ShepelMykola', 'RiabovolOlena', 'OlesiaAvanesova', 'BondarenkoOleksandr', 'MuzychenkoBondaliukYuliana', 'VernygoraOleksandr', 'NikitaAgafonov', 'AnnaLysychkina', 'KravchenkoOlena', 'KurinnaKateryna', 'VolodymyrSydiuk', 'LavreniukSerhii', 'DmitriyStadnik', 'SidorchykArtem', 'YuryYaremenko', 'StanislavHoncharenko', 'DanyloRozumovskyi', 'YalashYuliia', 'TirnovschiDenis', 'MinacovaElena', 'СhebesGhenadie', 'IluşcaSvetlana', 'PlescoIulia', 'TihanschiiAndrei', 'DolgovichMariia', 'IluşcaIurie'];

    setTimeout(function() {
        // Функция для добавления элементов управления
        function addControlElements() {
            // Проверяем, существуют ли уже элементы управления
            if (document.getElementById('timeIntervalInput') || document.getElementById('startScriptButton')) {
                return; // Если уже существуют, ничего не делаем
            }

            const buttons = document.querySelectorAll('.btn.btn-primary');
            if (buttons.length < 2) {
                console.log("Не найдено достаточное количество элементов для вставки.");
                return;
            }
            const referenceElement = buttons[1];

            // Создаем поле ввода
            const inputField = document.createElement('input');
            inputField.type = 'number';
            inputField.id = 'timeIntervalInput';
            inputField.placeholder = 'Введите интервал в минутах';
            inputField.value = minMinute / 60;

            // Создаем кнопку
            const startButton = document.createElement('button');
            startButton.textContent = '🕵Шпионить';
            startButton.id = 'startScriptButton';

            // Вешаем обработчик на кнопку
            startButton.addEventListener('click', () => {
                // Обновляем глобальную переменную minMinute при каждом нажатии на кнопку
                minMinute = parseInt(document.getElementById('timeIntervalInput').value) * 60;
                collectData(1); // Запуск функции сбора данных
            });

            // Вставляем элементы на страницу
            referenceElement.after(inputField, startButton);
        }

        // Добавляем стили
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        #timeIntervalInput, #startScriptButton {
            margin-left: 5px;
        }
        #startScriptButton {
            display: inline-block;
            vertical-align: middle;
            color: #fff;
            background-color: #1b6ec2;
            border-color: #1861ac;
            border: none;
            border-radius: 0.25rem;
            padding: 0.375rem 0.75rem;
        }
        #startScriptButton:hover {
            color: #fff;
            background-color: #0b5ed7;
            border-color: #0a58ca;
        }
        #timeIntervalInput {
            display: inline-block;
            vertical-align: middle;
            padding: 0.375rem 0.75rem;
            border-radius: 0.25rem;
            border: 1px solid #c1c1c1;
            outline: none;
            width: 70px;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        `;
        document.head.appendChild(style);

        // Создаем и запускаем MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    addControlElements();
                }
            });
        });

        // Настройка и запуск наблюдателя за всем DOM документа
        observer.observe(document.body, { childList: true, subtree: true });

        // Начальный вызов функции для добавления элементов
        addControlElements();

    }, 2000);

    // Функция для сбора данных
    async function collectData(currentPage, minMinute)  {
        console.log(`Собираем данные на странице ${currentPage}`);

        // Подождать некоторое время перед сбором данных
        await new Promise(resolve => setTimeout(resolve, 1000)); // Подождать 1 секунду

        // Найти все строки данных на текущей странице
        const dataRows = document.querySelectorAll(".table.table-bordered.mb-0 tbody tr");

        // Пройтись по каждой строке и извлечь данные из нужных колонок
        dataRows.forEach(row => {
            const userNameColumn = row.querySelector("td:nth-child(2)");
            const startTimeColumn = row.querySelector("td:nth-child(4)");

            if (userNameColumn && startTimeColumn) {
                userName.push(userNameColumn.textContent.trim());
                startTime.push(startTimeColumn.textContent.trim());
            }
        });

        // Попытаться найти кнопку "Next"
        const nextPageButton = [...document.querySelectorAll('li.btn.page-link')].find(button => button.textContent.trim() === 'Next');

        if (nextPageButton && !nextPageButton.hasAttribute('disabled')) {
            // Если кнопка "Next" найдена и активна, переход на следующую страницу
            nextPageButton.click();
            currentPage++;
            collectData(currentPage);
        } else {
            // Завершение сбора данных, если кнопка "Next" недоступна
            stopCollectingData();
        }
    }

    // Добавляем вывод данных для диагностики
    function debugData() {
        console.log("Собранные имена пользователей:", userName);
        console.log("Собранные времена начала заданий:", startTime);
    }

    // Функция для остановки сбора данных и вывода результатов
    function stopCollectingData() {
        const inputInterval = parseInt(document.getElementById('timeIntervalInput').value) || 15;
        const minMinute = inputInterval * 60; // Используем значение inputInterval
        const currentTime = new Date();
        const timeDifferenceOffset = 2 * 60 * 60 * 1000; // Разница в 2 часа в миллисекундах
        const recentUsersSet = new Set(); // Используем Set для хранения уникальных пользователей

        startTime.forEach((time, index) => {
            const taskTime = new Date(time);
            const correctedTaskTime = new Date(taskTime.getTime() + timeDifferenceOffset); // Корректируем время с учетом разницы часовых поясов
            const timeDifference = (currentTime - correctedTaskTime) / 1000; // Разница во времени в секундах

            if (timeDifference <= minMinute) {
                recentUsersSet.add(userName[index]); // Добавляем пользователя, если он взял задание в указанный интервал
            }
        });


        // Функция для вывода пользователей по ролям
        function printUsersByRole(title, users, color) {
            console.log(`%c${title}:`, `font-size: 20px; font-weight: bold; text-transform: uppercase; color: white; background-color: ${color};`);
            users.forEach(user => {
                console.log(`%c${user}`, `font-size: 16px; font-weight: bold; color: ${color};`);
            });
            console.log('\n'); // Добавляем пустую строку после каждой группы для разделения
        }


        // Преобразуем Set обратно в массив для удобства и последующего использования
        const recentUsers = [...recentUsersSet];

        // Сначала сортируем, чтобы роли шли в нужном порядке
        const sortedUsers = [...recentUsers].sort((a, b) => {
            return teamLeads.includes(a) - teamLeads.includes(b) ||
                supervisors.includes(a) - supervisors.includes(b) ||
                moderators.includes(a) - moderators.includes(b);
        });

        console.log(`%cПользователи, взявшие задание за последние ${inputInterval} минут:`, 'font-size: 18px; font-weight: bold;');

        // Печатаем по группам
        printUsersByRole('Team Lead', sortedUsers.filter(user => teamLeads.includes(user)), 'red');
        printUsersByRole('Supervisor', sortedUsers.filter(user => supervisors.includes(user)), 'orange');
        printUsersByRole('Moderator', sortedUsers.filter(user => moderators.includes(user)), 'blue');

        // Печатаем пользователей без роли
        const usersWithoutRole = sortedUsers.filter(user =>
                                                    !teamLeads.includes(user) &&
                                                    !supervisors.includes(user) &&
                                                    !moderators.includes(user)
                                                   );
        if (usersWithoutRole.length > 0) {
            printUsersByRole('Other', usersWithoutRole, 'grey');
        }

    }
})();