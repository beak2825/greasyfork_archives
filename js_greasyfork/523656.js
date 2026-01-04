// ==UserScript==
// @name Moderator panel?
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Симулятор модератора в чате
// @author Minish
// @match https://drawaria.online/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/523656/Moderator%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/523656/Moderator%20panel.meta.js
// ==/UserScript==

(function() {
'use strict';

// Массив для хранения никнеймов забаненных игроков
const bannedPlayers = [];

// Создание кнопок на странице
function createButtons() {
    createBanButton();
    createWarningButton();
    createClearButton();
}

// Создание кнопки "Бан"
function createBanButton() {
    const banButton = document.createElement('button');
    banButton.innerText = 'Бан';
    banButton.style.position = 'fixed';
    banButton.style.bottom = '60px'; // Устанавливаем кнопку выше
    banButton.style.right = '10px';
    banButton.style.zIndex = '1000';
    banButton.style.padding = '10px';
    banButton.style.backgroundColor = 'red';
    banButton.style.color = 'white';
    banButton.style.border = 'none';
    banButton.style.borderRadius = '5px';
    banButton.style.cursor = 'pointer';

    document.body.appendChild(banButton);
    banButton.addEventListener('click', handleBanButtonClick);
}

// Функция для добавления сообщений модератора
function addModeratorMessages(nickname, action) {
    const chatBox = document.getElementById('chatbox_messages'); // ID чат-бокса

    if (chatBox) {
        const messages = [
            `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Kick Player</div>`,
            `<div class="chatmessage systemchatmessage7" data-ts="${Date.now()}">Пожаловаться на модератора можно в дискорде, на этом канале: <a href="https://discord.gg/XeVKWWs" target="_blank">#report-a-moderator</a></div>`,
            `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">Кто-то проголосовал за исключение из комнаты: ${nickname}</div>`,
            `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} исключён из комнаты!</div>`,
            `<div class="chatmessage systemchatmessage7" data-ts="${Date.now()}">${nickname} - игрок вышел из комнаты</div>`
        ];

        messages.forEach(message => {
            chatBox.innerHTML += message;
        });
    }
}

// Функция для обработки события нажатия кнопки "Бан"
function handleBanButtonClick() {
    const nickname = prompt("Введите никнейм игрока для бана:"); // Запрашиваем никнейм у пользователя

    if (nickname) {
        bannedPlayers.push(nickname); // Добавляем игрока в список забаненных
        addModeratorMessages(nickname); // Добавляем сообщения с никнеймом
        removePlayer(nickname); // Удаляем игрока из списка
        updatePlayerList(); // Обновляем список игроков сразу после бана
        disableChatWithUser (nickname); // Отключаем чат с забаненным игроком
    }
}

// Создание кнопки "Предупреждение"
function createWarningButton() {
    const button = document.createElement('button');
    button.innerText = 'Предупредить игрока';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = 'orange';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);
    button.addEventListener('click', handleWarningButtonClick);
}

// Функция для обработки нажатия кнопки предупреждения
function handleWarningButtonClick() {
    const playerList = document.getElementById('playerlist'); // Предполагаем, что это ID списка игроков
    const players = Array.from(playerList.querySelectorAll('.playerlist-row .playerlist-name a')).map(el => el.textContent.trim());

    const nickname = prompt("Введите никнейм игрока из списка:\n" + players.join('\n'));

    if (nickname) {
        addWarningMessage(nickname);
    }
}

// Функция для добавления предупреждающего сообщения в чат
function addWarningMessage(nickname) {
    const chatBox = document.getElementById('chatbox_messages'); // ID чат-бокса
    const message = `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: ${nickname} Матерные слова запрещены, предупреждение вам.</div>`;

    if (chatBox) {
        chatBox.innerHTML += message;
    }
}

// Создание кнопки "Очистить рисунок"
function createClearButton() {
    const button = document.createElement('button');
    button.innerText = 'Очистить рисунок';
    button.style.position = 'fixed';
    button.style.bottom = '110px'; // Устанавливаем кнопку выше
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = 'blue';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);
    button.addEventListener('click', handleClearButtonClick);
}

// Функция для обработки нажатия кнопки очистки
function handleClearButtonClick() {
    const drawingElement = document.getElementById('canvas'); // ID элемента канваса

    if (drawingElement) {
        const ctx = drawingElement.getContext('2d');
        // Очистка канваса и заполнение белым цветом
        ctx.clearRect(0, 0, drawingElement.width, drawingElement.height);
        ctx.fillStyle = 'white'; // Устанавливаем цвет заливки
        ctx.fillRect(0, 0, drawingElement.width, drawingElement.height); // Заполняем белым цветом
        
        // Добавляем сообщение в чат
        addClearMessage();
    } else {
        alert('Элемент канваса не найден!');
    }
}

// Функция для добавления сообщения в чат о очистке
function addClearMessage() {
    const chatBox = document.getElementById('chatbox_messages'); // ID чат-бокса
    const message = `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Reset Drawing.</div>`;
    
    if (chatBox) {
        chatBox.innerHTML += message;
        // Добавляем сообщение о жалобе на модератора
        const complaintMessage = `<div class="chatmessage systemchatmessage7" data-ts="${Date.now()}">Пожаловаться на модератора можно в дискорде, на этом канале: <a href="https://discord.gg/XeVKWWs" target="_blank">#report-a-moderator</a></div>`;
        chatBox.innerHTML += complaintMessage;
    }
}

// Функция для удаления игрока из списка
function removePlayer(nickname) {
    const playerList = document.getElementById('playerlist'); // ID списка игроков

    if (playerList) {
        const playerToRemove = Array.from(playerList.querySelectorAll('.playerlist-row')).find(player => {
            const nameElement = player.querySelector('.playerlist-name a');
            return nameElement && nameElement.textContent.trim() === nickname;
        });

        if (playerToRemove) {
            playerToRemove.remove(); // Удаляем игрока из списка
        }
    }
}

// Функция для обновления списка игроков
function updatePlayerList() {
    const playerList = document.getElementById('playerlist'); // ID списка игроков

    if (playerList) {
        // Перебираем всех игроков в списке
        Array.from(playerList.querySelectorAll('.playerlist-row')).forEach(player => {
            const nameElement = player.querySelector('.playerlist-name a');
            if (nameElement) {
                const playerName = nameElement.textContent.trim();
                // Если игрок забанен, скрываем его
                if (bannedPlayers.includes(playerName)) {
                    player.remove(); // Удаляем забаненного игрока из списка
                }
            }
        });
    }
}

// Функция для отключения чата с забаненным игроком
function disableChatWithUser (nickname) {
    const chatWithUser  = document.querySelector(`.chat-with-${nickname}`); // Замените на селектор вашего чата с игроком

    if (chatWithUser ) {
        chatWithUser .style.display = 'none'; // Скрываем чат с забаненным игроком
    }
}

// Запускаем создание кнопок
createButtons();
})();