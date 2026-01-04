// ==UserScript==
// @name         Timer Sound Notification
// @namespace    your-namespace
// @version      1.0
// @description  Plays a sound notification when the timer reaches 0
// @match        https://click-bnb.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477461/Timer%20Sound%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/477461/Timer%20Sound%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Онлайн ссылка на звуковой файл уведомления
    const notificationSoundUrl = 'https://cdn.pixabay.com/audio/2022/10/16/audio_10bebc0b9f.mp3';

    // Создание элемента audio для воспроизведения звука
    const audioElement = new Audio(notificationSoundUrl);

    // Объявление функции для проверки таймера и воспроизведения звука
    function checkTimer() {
        const timerElement = document.querySelector('.timer-header');

        if (timerElement) {
            const timerText = timerElement.textContent.trim();

            if (timerText === '00:00') {
                // Воспроизведение звука
                audioElement.play();
            }
        }
    }

    // Запуск проверки таймера каждую секунду
    setInterval(checkTimer, 1000);
})();