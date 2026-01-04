// ==UserScript==
// @name         Change User-Agent
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Change user-agent for navigator object after receiving script packets
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520743/Change%20User-Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/520743/Change%20User-Agent.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Сохраняем оригинальный метод send()
    var originalSend = XMLHttpRequest.prototype.send;

    // Переопределяем метод send()
    XMLHttpRequest.prototype.send = function(body) {
        // Проверяем URL, чтобы перехватывать только нужные запросы
        if (this._url && this._url.includes("/events/analytics/public/v4/events/logs")) {
            try {
                // Если тело запроса — JSON, парсим его
                let requestBody = JSON.parse(body);

                // Проверяем, содержит ли запрос данные о "browserRes" и изменяем их
                if (requestBody && Array.isArray(requestBody.events)) {
                    requestBody.events.forEach(event => {
                        if (event.device && event.device.browserRes) {
                            event.device.browserRes = "1920x1080"; // Меняем разрешение браузера
                        }
                        if (event.device && event.device.screenResolutionNumber) {
                            event.device.screenResolutionNumber = "1920x1080"; // Меняем разрешение экрана
                        }
                    });

                    // Преобразуем объект обратно в строку
                    body = JSON.stringify(requestBody);
                }
            } catch (error) {
                console.error("Ошибка при изменении данных в запросе:", error);
            }
        }

        // Вызываем оригинальный метод send() с изменённым или оригинальным телом
        return originalSend.call(this, body);
    };

    // Перехватываем URL запросов
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url; // Сохраняем URL для проверки в send()
        return originalOpen.apply(this, arguments);
    };

    console.log("Скрипт для перехвата и изменения запросов активирован.");
})();