// ==UserScript==
// @name         Drawaria Chat Bot (send hook method)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Бот Скрепка, надёжный перехват WebSocket через send(), без зависимости от конструктора 🧷
// @author       𝘣𝘢𝘳𝘴𝘪𝘬 𝘩𝘢𝘤𝘬𝘦𝘳
// @match        https://drawaria.online/*
// @grant        none
// @run-at       document-start
// @license 𝘣𝘢𝘳𝘴𝘪𝘬
// @downloadURL https://update.greasyfork.org/scripts/544141/Drawaria%20Chat%20Bot%20%28send%20hook%20method%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544141/Drawaria%20Chat%20Bot%20%28send%20hook%20method%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let socket = null;

    const OriginalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) {
            console.log('[Скрепка] WebSocket найден через send()');
            socket = this;

            // Подключение при первом использовании
            const originalOnMessage = socket.onmessage;
            socket.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data && data.chatMessage) {
                        handleChatMessage(data.chatMessage);
                    }
                } catch (e) {
                    // Игнор ошибок
                }

                if (originalOnMessage) {
                    originalOnMessage.call(this, event);
                }
            };
        }
        return OriginalSend.apply(this, args);
    };

    // После загрузки интерфейс
    window.addEventListener('DOMContentLoaded', () => {
        const BOT_NAME = "Скрепка";
        let botEnabled = false;

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '100px';
        panel.style.left = '100px';
        panel.style.background = '#222';
        panel.style.color = '#fff';
        panel.style.padding = '10px';
        panel.style.borderRadius = '8px';
        panel.style.zIndex = 9999;
        panel.style.cursor = 'move';
        panel.innerHTML = `
            <strong>Скрепка 🤖</strong><br>
            <button id="enableBot" style="margin-top:5px;">Включить чат бот</button>
        `;
        document.body.appendChild(panel);

        // Перетаскивание
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        panel.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        function handleChatMessage(msg) {
            if (!botEnabled) return;
            if (!msg || !msg.message || !msg.author) return;

            const text = msg.message.trim().toLowerCase();

            if (text === '?скрепка') {
                sendMessage(`Привет! Я ${BOT_NAME} 🧷. Чем могу помочь?`);
            }
        }

        function sendMessage(text) {
            const input = document.querySelector('input.chat-input');
            if (!input) return;
            input.value = text;

            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                keyCode: 13
            });
            input.dispatchEvent(enterEvent);
        }

        document.getElementById('enableBot').addEventListener('click', () => {
            if (botEnabled) {
                alert(`${BOT_NAME} уже активирован.`);
                return;
            }

            if (!socket) {
                alert('⏳ Сокет ещё не определён. Попробуйте отправить любое сообщение в чат, чтобы бот активировался.');
                return;
            }

            botEnabled = true;
            alert(`✅ Чат-бот ${BOT_NAME} активирован.`);
        });
    });
})();
