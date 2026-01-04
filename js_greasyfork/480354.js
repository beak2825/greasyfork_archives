// ==UserScript==
// @name         Новогодний таймер на Форуме
// @description  таймер до нг
// @author       stealyourbrain
// @license      MIT
// @match        https://zelenka.guru/*
// @version 0.0.1.20231120102010
// @namespace https://greasyfork.org/users/1220529
// @downloadURL https://update.greasyfork.org/scripts/480354/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D0%BD%D0%B0%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/480354/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D0%BD%D0%B0%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const countdownTimer = document.createElement('div');
    countdownTimer.id = 'ny-timer';
    document.body.appendChild(countdownTimer);

    const newYearDate = new Date('January 1, 2024 00:00:00 GMT+03:00');

    function updateTimer() {
        const currentDate = new Date();
        const timeDiff = newYearDate - currentDate;

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        countdownTimer.innerHTML = `
            <div class="ny-timer-block">
                <span class="ny-timer-number">${days}</span>
                <span class="ny-timer-label">дней</span>
            </div>
            <div class="ny-timer-block">
                <span class="ny-timer-number">${hours}</span>
                <span class="ny-timer-label">часов</span>
            </div>
            <div class="ny-timer-block">
                <span class="ny-timer-number">${minutes}</span>
                <span class="ny-timer-label">минут</span>
            </div>
            <div class="ny-timer-block">
                <span class="ny-timer-number">${seconds}</span>
                <span class="ny-timer-label">секунд</span>
            </div>
        `;
    }

    const styles = `
        #ny-timer {
            position: fixed;
            bottom: 100px;
            right: 1px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            background-color: #333;
            padding: 5px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .ny-timer-block {
            margin-right: 10px;
            text-align: center;
            color: #fff;
        }
        .ny-timer-number {
            font-size: 12px;
            font-weight: bold;
        }
        .ny-timer-label {
            font-size: 8px;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    setInterval(updateTimer, 1000);

    updateTimer();
})();