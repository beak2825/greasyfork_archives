// ==UserScript==
// @name         Moderator Simulator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Симулятор модератора в чате
// @author       Minish
// @match        drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522206/Moderator%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/522206/Moderator%20Simulator.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Массив для хранения никнеймов забаненных игроков
    const bannedPlayers = [];
 
    // Создание кнопки "Бан" и добавление её на страницу
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
 
        // Добавляем обработчик события нажатия на кнопку
        banButton.addEventListener('click', handleBanButtonClick);
    }
 
    // Функция для добавления сообщений модератора
    function addModeratorMessages(nickname) {
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
 
    // Запускаем создание кнопки "Бан"
    createBanButton();
 
})();