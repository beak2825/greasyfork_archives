// ==UserScript==
// @name         месячный МОПС
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  туда сюда месяц
// @author       You
// @match        https://mops-portal.azurewebsites.net/taskaudit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azurewebsites.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512641/%D0%BC%D0%B5%D1%81%D1%8F%D1%87%D0%BD%D1%8B%D0%B9%20%D0%9C%D0%9E%D0%9F%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/512641/%D0%BC%D0%B5%D1%81%D1%8F%D1%87%D0%BD%D1%8B%D0%B9%20%D0%9C%D0%9E%D0%9F%D0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback, interval = 100, timeout = 10000) {
        const startTime = Date.now();
        function checkElement() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(checkElement, interval);
            } else {
                console.error(`Element not found: ${selector}`);
            }
        }
        checkElement();
    }

    function updateDatetimeInput(dateTimeInput, newTime) {
        var currentValue = dateTimeInput.value;
        var newValue = currentValue.replace(/\d{2}:\d{2}/, newTime);
        dateTimeInput.value = newValue;
        dateTimeInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateTimeInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`Datetime input set to ${newValue}`);
    }

    function applyFilter(time, date, updateDate, callback) {
        waitForElement('input[type="datetime"]', function(dateTimeInput) {
            if (updateDate) {
                var currentValue = dateTimeInput.value;
                var newDateTime = currentValue.replace(/\d{2}\/\d{2}\/\d{4}/, date);
                dateTimeInput.value = newDateTime;
            }
            updateDatetimeInput(dateTimeInput, time);

            waitForElement('button.btn.btn-primary[type="submit"]', function(selectButton) {
                selectButton.click();

                setTimeout(function() {
                    waitForElement('p[role="status"]', function(statusElement) {
                        const statusText = statusElement.textContent;
                        const timeMatch = statusText.match(/Total time spent:\s(\d{1,2}:\d{2}:\d{2})/);
                        const timeValue = timeMatch ? timeMatch[1] : '0:00:00';
                        callback(timeValue);
                    });
                }, 2000);
            });
        });
    }

    function parseTime(timeStr) {
        const parts = timeStr.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    }

    function calculateRemainingTime(monthTime) {
        const maxTimeSeconds = 173 * 3600; // 173 часов в секундах
        const monthTimeSeconds = parseTime(monthTime);
        const remainingSeconds = maxTimeSeconds - monthTimeSeconds;
        return formatTime(Math.max(0, remainingSeconds)); // чтобы не было отрицательного времени
    }

    function calculateDaysLeft() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const nextMonth = new Date(now.getFullYear(), currentMonth + 1, 1);
        const timeDiff = nextMonth - now;
        const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Конвертируем миллисекунды в дни
        return daysLeft;
    }

    function formatTimeWithSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60); // Округляем секунды до целого числа
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function calculateDailyHours(remainingTime, daysLeft) {
    const remainingSeconds = parseTime(remainingTime);
    const dailySeconds = remainingSeconds / daysLeft;
    return formatTimeWithSeconds(Math.max(0, dailySeconds)); // Оставляем секунды без дробной части
    }

    function displayResults(todayTime, monthTime) {
        let todayElement = document.querySelector('#todayTime');
        if (!todayElement) {
            todayElement = document.createElement('p');
            todayElement.id = 'todayTime';
            todayElement.style.backgroundColor = '#f0f0f0';
            todayElement.style.padding = '5px 10px';
            todayElement.style.borderRadius = '10px';
            todayElement.style.marginTop = '10px';
            todayElement.style.display = 'inline-block';
            todayElement.style.border = '1px solid blue';
            const statusElement = document.querySelector('p[role="status"]');
            if (statusElement) {
                statusElement.insertAdjacentElement('afterend', todayElement);
            } else {
                document.body.appendChild(todayElement); // Fallback if status element is not found
            }
        }
        todayElement.innerHTML = `ЗА СЕГОДНЯ: ${todayTime}`;

        setTimeout(function() { // Добавляем задержку для отображения данных за месяц
            let monthElement = document.querySelector('#monthTime');
            if (!monthElement) {
                monthElement = document.createElement('p');
                monthElement.id = 'monthTime';
                monthElement.style.backgroundColor = '#f0f0f0';
                monthElement.style.padding = '5px 10px';
                monthElement.style.borderRadius = '10px';
                monthElement.style.marginTop = '5px';
                monthElement.style.display = 'inline-block';
                monthElement.style.border = '1px solid red';
                const statusElement = document.querySelector('p[role="status"]');
                if (statusElement) {
                    statusElement.insertAdjacentElement('afterend', monthElement);
                } else {
                    document.body.appendChild(monthElement); // Fallback if status element is not found
                }
            }
            monthElement.innerHTML = `ЗА МЕСЯЦ: ${monthTime}`;

            const remainingTime = calculateRemainingTime(monthTime);
            let remainingElement = document.querySelector('#remainingTime');
            if (!remainingElement) {
                remainingElement = document.createElement('p');
                remainingElement.id = 'remainingTime';
                remainingElement.style.backgroundColor = '#f0f0f0';
                remainingElement.style.padding = '5px 10px';
                remainingElement.style.borderRadius = '10px';
                remainingElement.style.marginTop = '5px';
                remainingElement.style.display = 'inline-block';
                remainingElement.style.border = '1px solid green';
                monthElement.insertAdjacentElement('afterend', remainingElement);
            }
            remainingElement.innerHTML = `До конца месяца осталось: ${remainingTime}`;

            const daysLeft = calculateDaysLeft();
            const dailyHours = calculateDailyHours(remainingTime, daysLeft);

            let dailyWorkElement = document.querySelector('#dailyWorkTime');
            if (!dailyWorkElement) {
                dailyWorkElement = document.createElement('p');
                dailyWorkElement.id = 'dailyWorkTime';
                dailyWorkElement.style.backgroundColor = '#f0f0f0';
                dailyWorkElement.style.padding = '5px 10px';
                dailyWorkElement.style.borderRadius = '10px';
                dailyWorkElement.style.marginTop = '5px';
                dailyWorkElement.style.display = 'inline-block';
                dailyWorkElement.style.border = '1px solid orange';
                remainingElement.insertAdjacentElement('afterend', dailyWorkElement);
            }
            dailyWorkElement.innerHTML = `Пахать в день нужно по: ${dailyHours}`;
        }, 2000); // Задержка в 5 секунд перед отображением итогов за месяц
    }

    function main() {
        const now = new Date();
        const currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        const firstDayOfMonth = `01/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

        waitForElement('button.btn.btn-primary', function(filterButton) {
            filterButton.click(); // Click the filter button once

            applyFilter('00:01', currentDate, false, function(todayTime) {
                applyFilter('00:01', firstDayOfMonth, true, function(monthTime) {
                    displayResults(todayTime, monthTime);
                });
            });
        });
    }

    window.addEventListener('load', main); // Запуск основной функции при загрузке страницы
})();
