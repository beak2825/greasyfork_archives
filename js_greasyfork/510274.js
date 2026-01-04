// ==UserScript==
// @name         Авточтение - удаления уведомлений
// @namespace    https://lolz.live/
// @version      1.2
// @description  Авточтение
// @author       lolzteam
// @license      MIT
// @match        https://lolz.live/account/alerts
// @match        https://lolz.live/account/alerts*
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/account/alerts*
// @match        https://lzt.market/account/alerts*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://cdn.jsdelivr.net/gh/ilyhalight/lzt-upgrade@1.1.0/public/static/img/lzt-upgrade-mini.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510274/%D0%90%D0%B2%D1%82%D0%BE%D1%87%D1%82%D0%B5%D0%BD%D0%B8%D0%B5%20-%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/510274/%D0%90%D0%B2%D1%82%D0%BE%D1%87%D1%82%D0%B5%D0%BD%D0%B8%D0%B5%20-%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для имитации нажатия на кнопку "Прочитать все"
    function markAllAsRead() {
        const readAllButton = document.querySelector('a[href*="account/alerts/mark-all-read"]');
        if (readAllButton) {
            readAllButton.click();
            console.log("Все уведомления помечены как прочитанные.");
        } else {
            console.log("Кнопка для прочтения уведомлений не найдена.");
        }
    }

    // Функция для удаления всех уведомлений через кнопку очистки
    function clearAllAlerts() {
        const clearAlertsButton = document.querySelector('a.AlertsClear[href*="account/alerts-clear"]');
        if (clearAlertsButton) {
            clearAlertsButton.click();
            console.log("Все уведомления очищены.");
        } else {
            console.log("Кнопка для очистки уведомлений не найдена.");
        }
    }

    // Пытаемся сразу выполнить действия, как только DOM будет доступен
    function attemptActions() {
        markAllAsRead();
        setTimeout(clearAllAlerts, 0);  // Запускаем удаление сразу после прочтения
    }

    // Если документ уже загружен, выполняем сразу, иначе ждем его готовности
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        attemptActions();
    } else {
        document.addEventListener('DOMContentLoaded', attemptActions);
    }

})();
