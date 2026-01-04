// ==UserScript==
// @name         Доработка чата
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет ID игроков и время отправки сообщений в чат
// @author       Шумелка (347). ВК - https://vk.com/oleg_rennege
// @match        https://patron.kinwoods.com/game
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/536139/%D0%94%D0%BE%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%87%D0%B0%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/536139/%D0%94%D0%BE%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%87%D0%B0%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Кэш для хранения соответствия имён и ID игроков
    const playerIdCache = new Map();

    // Функция для извлечения ID игрока из ссылки на профиль
    function extractPlayerIdFromLink(link) {
        if (!link) return null;
        const match = link.match(/\/profile\?charId=(\d+)/);
        return match ? match[1] : null;
    }

    // Функция для поиска ID игрока на поле
    function findPlayerIdOnField(playerName) {
        // Ищем всех котов на поле
        const cats = document.querySelectorAll('.cell-tooltip .char-name a');
        for (const cat of cats) {
            if (cat.textContent.trim() === playerName) {
                return extractPlayerIdFromLink(cat.href);
            }
        }
        return null;
    }

    // Функция для получения ID игрока (с кэшированием)
    function getPlayerId(playerName) {
        // Проверяем кэш
        if (playerIdCache.has(playerName)) {
            return playerIdCache.get(playerName);
        }

        // Ищем на игровом поле
        const idFromField = findPlayerIdOnField(playerName);
        if (idFromField) {
            playerIdCache.set(playerName, idFromField);
            return idFromField;
        }

        // Если ничего не найдено
        return "N/A";
    }

    // Функция для добавления времени перед именем отправителя
    function addMessageTime(senderElement) {
        const container = senderElement.closest('.mess-container');
        if (!container.querySelector('.message-time')) {
            const timeElement = document.createElement('span');
            timeElement.className = 'message-time';
            timeElement.textContent = `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]`;
            timeElement.style.color = '#666';
            timeElement.style.fontSize = '0.9em';
            timeElement.style.marginRight = '5px';

            // Вставляем время перед именем
            senderElement.parentNode.insertBefore(timeElement, senderElement);
        }
    }

    // Функция для добавления ID к имени отправителя
    function addPlayerId(senderElement) {
        const senderName = senderElement.textContent.trim();

        // Пропускаем системные сообщения (с эмодзи в начале)
        if (/^[^\wа-яА-Я]/.test(senderName)) return;

        // Проверяем, не добавлен ли уже ID
        if (!senderElement.querySelector('.player-id')) {
            const playerId = getPlayerId(senderName);

            // Создаем элемент для ID
            const idSpan = document.createElement('span');
            idSpan.className = 'player-id';
            idSpan.textContent = ` (ID: ${playerId})`;
            idSpan.style.color = '#888';
            idSpan.style.fontSize = '0.9em';
            idSpan.style.marginLeft = '5px';

            senderElement.appendChild(idSpan);
        }
    }

    // Функция для обработки всех сообщений в чате
    function processChatMessages() {
        const chatMessages = document.getElementById('gamechat-messages');
        if (!chatMessages) return;

        const messages = chatMessages.querySelectorAll('.mess-container');
        messages.forEach(message => {
            const senderNameElement = message.querySelector('.senderName');
            if (senderNameElement) {
                addMessageTime(senderNameElement);
                addPlayerId(senderNameElement);
            }
        });
    }

    // MutationObserver для новых сообщений
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList.contains('mess-container')) {
                    const senderNameElement = node.querySelector('.senderName');
                    if (senderNameElement) {
                        addMessageTime(senderNameElement);
                        addPlayerId(senderNameElement);
                    }
                }
            });
        });
    });

    // Запускаем обработку существующих сообщений
    processChatMessages();

    // Начинаем наблюдение за изменениями в чате
    const chatContainer = document.getElementById('gamechat-messages');
    if (chatContainer) {
        observer.observe(chatContainer, {
            childList: true,
            subtree: false
        });
    }

    // Стили для новых элементов
    const style = document.createElement('style');
    style.textContent = `
        .message-time {
            color: #666;
            font-size: 0.8em;
            margin-right: 5px;
        }
        .player-id {
            color: #888;
            font-size: 0.8em;
            margin-left: 5px;
        }
    `;
    document.head.appendChild(style);
})();