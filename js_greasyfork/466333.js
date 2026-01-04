// ==UserScript==
// @name         Zaka-Zaka Gift Auto Participate
// @namespace    https://zaka-zaka.com
// @version      1.2
// @description  Automatically participates in gifts on Zaka-Zaka website
// @match        https://zaka-zaka.com/game/gifts/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466333/Zaka-Zaka%20Gift%20Auto%20Participate.user.js
// @updateURL https://update.greasyfork.org/scripts/466333/Zaka-Zaka%20Gift%20Auto%20Participate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function participateInGifts() {
        var giftButtons = document.querySelectorAll('.gift-btn');

        giftButtons.forEach(function(button) {
            var buttonText = button.querySelector('span').textContent.trim();

            if (buttonText === 'Участвовать') {
                button.click();
            }
        });
    }

    function checkForNewGifts() {
        var giftList = document.querySelector('.gifts-list');

        if (giftList) {
            participateInGifts();
        }
    }

    function checkTimer() {
        var timerElement = document.querySelector('.timer-tiny');

        if (timerElement) {
            var timerText = timerElement.textContent.trim();

            if (timerText === '00:00:00') {
                location.href = location.href; // Перезагрузка страницы
            }
        }
    }

    var observer = new MutationObserver(checkForNewGifts);

    window.addEventListener('load', function() {
        participateInGifts();

        var config = { childList: true, subtree: true };
        observer.observe(document.body, config);

        setInterval(checkTimer, 1000); // Проверка таймера каждую секунду
    });
})();
