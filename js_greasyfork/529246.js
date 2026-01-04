// ==UserScript==
// @name         Spam Destroyer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Удаляет сообщения с запрещёнными символами
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529246/Spam%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/529246/Spam%20Destroyer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BANNED_SYMBOLS = ['𒐫']; // Добавляйте свои запрещённые символы

    // Функция удаления спама
    const removeSpam = () => {
        const chat = document.getElementById('chatbox_messages');
        if (!chat) return;

        chat.querySelectorAll('.chatmessage.playerchatmessage-highlightable')
            .forEach(message => {
                const textElement = message.querySelector('.playerchatmessage-text');
                if (textElement) {
                    const text = textElement.textContent || '';
                    if (BANNED_SYMBOLS.some(symbol => text.includes(symbol))) {
                        console.log(`[Spam Filter] Удалено сообщение от ${message.querySelector('.playerchatmessage-selfname')?.textContent}: "${text}"`);
                        message.remove();
                    }
                }
            });
    };

    // Наблюдатель за новыми сообщениями
    const observer = new MutationObserver(() => {
        console.log('[Spam Filter] Обнаружено новое сообщение');
        removeSpam();
    });

    // Инициализация наблюдателя
    const initObserver = () => {
        const chat = document.getElementById('chatbox_messages');
        if (!chat) {
            setTimeout(initObserver, 100);
            return;
        }

        observer.observe(chat, {
            childList: true,
            subtree: true
        });
        console.log('[Spam Filter] Наблюдение за чатом активировано');
    };

    // Запуск наблюдателя
    window.addEventListener('load', initObserver);

    // Дополнительная проверка каждые 500 мс
    setInterval(removeSpam, 100);
})();
