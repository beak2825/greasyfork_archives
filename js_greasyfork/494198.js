// ==UserScript==
// @name         Double Stop YouTube Video with Delay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply double stop to YouTube video on refresh with delay
// @author       AFKHAISE
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494198/Double%20Stop%20YouTube%20Video%20with%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/494198/Double%20Stop%20YouTube%20Video%20with%20Delay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для двойной паузы видео с задержкой
    function doublePauseWithDelay() {
        setTimeout(() => {
            let videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (!video.paused) {
                    video.pause(); // Первая пауза
                    setTimeout(() => {
                        if (!video.paused) {
                            video.pause(); // Вторая пауза после дополнительной задержки
                        }
                    }, 1000); // Вторая задержка в 1000 миллисекунд (1 секунда)
                }
            });
        }, 3000); // Первая задержка в 3000 миллисекунд (3 секунды)
    }

    // Обработчик события, вызываемый при полной загрузке вкладки
    window.addEventListener('load', doublePauseWithDelay);
})();