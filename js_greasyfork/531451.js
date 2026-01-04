// ==UserScript==
// @name         Auto Click Crystals & Anti-AFK - AnimeStars
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Авто-клик по кристаллам, защита от AFK и авто-закрытие уведомления "Камень не активный" (крестик) на animestars.org
// @author       Твой Ник
// @match        https://astars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://animestars.org/aniserials/video/action/2772-prirozhdennyj-povelitel.html
// @match        https://asstars.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531451/Auto%20Click%20Crystals%20%20Anti-AFK%20-%20AnimeStars.user.js
// @updateURL https://update.greasyfork.org/scripts/531451/Auto%20Click%20Crystals%20%20Anti-AFK%20-%20AnimeStars.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastActiveTime = "00:00"; // Время последнего обработанного сообщения

    // Функция для клика по кристаллам
    function clickOnCrystal() {
        const chatMessages = document.querySelectorAll(".lc_chat_li"); // Проверить актуальный селектор!

        chatMessages.forEach(msg => {
            const author = msg.querySelector(".lc_chat_li_autor");
            const text = msg.querySelector(".lc_chat_li_text");
            const diamond = msg.querySelector("#diamonds-chat");
            const timeElement = msg.querySelector(".lc_chat_li_date");

            if (author && text && diamond && timeElement) {
                let messageTime = timeElement.textContent.trim();

                if (author.textContent.toLowerCase().includes("ии космический посикунчик") && messageTime >= lastActiveTime) {
                    console.log("💎 Найден кристалл от бота, кликаем!");
                    diamond.click();
                    lastActiveTime = messageTime; // Обновляем последнее активное сообщение
                }
            }
        });
    }

    // Функция для защиты от AFK
    function preventTimeout() {
        let timeoutButton = document.querySelector(".lc_chat_timeout_imback") ||
                            document.querySelector(".timeout-button") ||
                            document.querySelector(".afk-return-button") ||
                            document.querySelector("button:contains('Я вернулся')");

        if (timeoutButton) {
            console.log("🔄 Найдена AFK-кнопка, нажимаем 'Я вернулся'!");
            timeoutButton.click();
        } else {
            console.log("✅ AFK-кнопка не найдена, всё в порядке.");
        }
    }

    // Функция для закрытия всплывающего окна (нажатие на крестик)
    function closeExpiredPopup() {
        let popupCloseButton = document.querySelector(".modal-content .close") || // Основной крестик
                               document.querySelector(".modal-close") || // Альтернативный селектор
                               document.querySelector(".notification-close"); // Другие возможные варианты

        if (popupCloseButton) {
            console.log("❌ Найдено уведомление 'Камень не активный', закрываем!");
            popupCloseButton.click();
        }
    }

    // Запуск функций
    setInterval(clickOnCrystal, 3000); // Клик по кристаллам каждые 3 секунды
    setInterval(preventTimeout, 180000); // AFK-защита каждые 3 минуты
    setInterval(closeExpiredPopup, 5000); // Проверка всплывающего окна каждые 5 секунд

    console.log("🚀 Скрипт AnimeStars успешно запущен!");

})();