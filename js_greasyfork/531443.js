// ==UserScript==
// @name         Auto Click Diamond
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Автоматически кликает на кристалл в чате, предотвращает таймаут и избегает неактивных кристаллов по времени
// @author       bemore
// @match        https://astars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531443/Auto%20Click%20Diamond.user.js
// @updateURL https://update.greasyfork.org/scripts/531443/Auto%20Click%20Diamond.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastActiveTime = "00:00";

    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    }

    function clickOnCrystal() {
        const chatMessages = document.querySelectorAll(".lc_chat_li");
        chatMessages.forEach(msg => {
            const author = msg.querySelector(".lc_chat_li_autor");
            const text = msg.querySelector(".lc_chat_li_text");
            const diamond = msg.querySelector("#diamonds-chat");
            const timeElement = msg.querySelector(".lc_chat_li_date");

            if (author && text && diamond && timeElement) {
                let messageTime = timeElement.textContent.trim();
                if (author.textContent.includes("ИИ Космический посикунчик") && messageTime >= lastActiveTime) {
                    console.log("Обнаружено сообщение от бота, кликаем на кристалл...");
                    diamond.click();
                    lastActiveTime = messageTime;
                } else {
                    console.log("Сообщение устарело, пропускаем...");
                }
            }
        });
    }

    function preventTimeout() {
        const timeoutButton = document.querySelector(".lc_chat_timeout_imback");
        if (timeoutButton) {
            console.log("Обнаружен таймаут, нажимаем 'Я вернулся'...");
            timeoutButton.click();
        }
    }

    function detectInactiveCrystal() {
        const warning = document.querySelector(".DLEPush-notification.push-warning");
        if (warning) {
            const closeButton = warning.querySelector(".DLEPush-close");
            if (closeButton) {
                closeButton.click();
            }
            console.log("Обнаружен неактивный кристалл, обновляем таймер...");
            lastActiveTime = getCurrentTime();
        }
    }

    function resetTimerAtMidnight() {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            console.log("00:00 МСК, сбрасываем таймер...");
            lastActiveTime = "00:00";
        }
    }

    setInterval(clickOnCrystal, 3000);
    setInterval(preventTimeout, 5000);
    setInterval(detectInactiveCrystal, 4000);
    setInterval(resetTimerAtMidnight, 60000);
})();
