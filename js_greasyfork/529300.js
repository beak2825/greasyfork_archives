// ==UserScript==
// @license MIT
// @name         YandexMusicBetaMod PlusUnlocker
// @namespace    YandexMusicBetaMod
// @version      2025-03-09
// @description  Plus unlocker
// @author       Stephanzion
// @match        https://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.yandex.ru
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529300/YandexMusicBetaMod%20PlusUnlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/529300/YandexMusicBetaMod%20PlusUnlocker.meta.js
// ==/UserScript==

// Функция для рекурсивного обновления объектов с лимитом глубины
function updateObject(obj, depth = 0, maxDepth = 16) {
    if (typeof obj !== 'object' || obj === null || depth >= maxDepth) return;

    if (obj.hasOwnProperty('hasPlus') && obj.hasPlus === false) {
        obj.hasPlus = true;
    }

    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            updateObject(obj[key], depth + 1, maxDepth);
        }
    }
}

// Функция для переопределения push
function overridePush() {
    if (!window.__STATE_SNAPSHOT__) return;

    if (!window.__STATE_SNAPSHOT__.push.overridden) {
        const originalPush = window.__STATE_SNAPSHOT__.push;

        window.__STATE_SNAPSHOT__.push = function (...items) {
            items.forEach(item => {
                try {
                    if (typeof item === 'object' && item !== null) {
                        updateObject(item);
                    }
                } catch (e) {
                    console.error('Ошибка при обработке объекта:', e);
                }
            });
            return originalPush.apply(this, items);
        };

        window.__STATE_SNAPSHOT__.push.overridden = true;

        setTimeout(() => {
            window.__STATE_SNAPSHOT__.push = originalPush;
            console.log('Метод push для __STATE_SNAPSHOT__ восстановлен');
        }, 2000);
    }
}

// Проверяем появление __STATE_SNAPSHOT__ динамически
const checkInterval = setInterval(() => {
    if (window.__STATE_SNAPSHOT__) {
        overridePush();
        clearInterval(checkInterval);
    }
}, 100);



