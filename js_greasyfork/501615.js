// ==UserScript==
// @name         Пуп лид таймер
// @version      2.1
// @description  Показывает время в Боливии, Перу, Эквадоре, Колумбии, Гватемале и Коста-Рике
// @author       Ебейший 77
// @match        *://web.chat2desk.com/*
// @match        *://web.chat2desk.by/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1338837
// @downloadURL https://update.greasyfork.org/scripts/501615/%D0%9F%D1%83%D0%BF%20%D0%BB%D0%B8%D0%B4%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/501615/%D0%9F%D1%83%D0%BF%20%D0%BB%D0%B8%D0%B4%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80.meta.js
// ==/UserScript==

// Luxon
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.0/luxon.min.js';
document.head.appendChild(script);

script.onload = function() {
    const { DateTime } = luxon;

    const button = document.createElement('button');
    button.textContent = 'Таймер';
    button.style.position = 'fixed';
    button.style.bottom = '2vh';
    button.style.left = '2vw';
    button.style.zIndex = 1000;
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.backgroundColor = '#808080';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    document.body.appendChild(button);

    function openTimeWindow() {
        var timeWindow = window.open('', '', 'width=300,height=500');
        if (!timeWindow) {
            alert('Леее, разреши всплывающие окно для этого сайта');
            return;
        }

        var container = timeWindow.document.createElement('div');
        container.id = 'time-widget-container';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ddd';
        container.style.padding = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        container.style.borderRadius = '8px';
        container.style.resize = 'both';
        container.style.overflow = 'auto';
        timeWindow.document.body.appendChild(container);

        // Часики
        var countries = {
            'Боливия': 'America/La_Paz',
            'Перу': 'America/Lima',
            'Эквадор': 'America/Guayaquil',
            'Колумбия': 'America/Bogota',
            'Гватемала': 'America/Guatemala',
            'Коста-Рика': 'America/Costa_Rica'
        };

        var bankHours = {
            'Боливия': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 12 },
            'Перу': { open: 9, close: 17, saturdayOpen: 9, saturdayClose: 13 },
            'Эквадор': { open: 9, close: 17, saturdayOpen: 9, saturdayClose: 13 },
            'Колумбия': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
            'Гватемала': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 12 },
            'Коста-Рика': { open: 8, close: 16, saturdayOpen: 9, saturdayClose: 12 }
        };

        for (var country in countries) {
            var clock = timeWindow.document.createElement('div');
            clock.style.marginBottom = '10px';
            var countryDiv = timeWindow.document.createElement('div');
            countryDiv.textContent = country;
            countryDiv.style.fontSize = '1.2em';
            countryDiv.style.marginBottom = '10px';
            clock.appendChild(countryDiv);
            var timeDiv = timeWindow.document.createElement('div');
            timeDiv.style.fontSize = '2em';
            timeDiv.style.fontWeight = 'bold';
            clock.appendChild(timeDiv);
            container.appendChild(clock);
            clock.timeDiv = timeDiv;
            clock.timeZone = countries[country];
            clock.bankHours = bankHours[country];
        }

        // Проверка времени работы банков
        function isBankOpen(now, hours) {
            var day = now.weekday; // 1 - понедельник, ..., 7 - воскресенье
            var hour = now.hour;

            if (day >= 1 && day <= 5) { // Понедельник - Пятница
                return hour >= hours.open && hour < hours.close;
            } else if (day === 6) { // Суббота
                return hour >= hours.saturdayOpen && hour < hours.saturdayClose;
            } else { // Воскресенье
                return false;
            }
        }

        // Обновление таймера
        function updateTime() {
            for (var i = 0; i < container.children.length; i++) {
                var clock = container.children[i];
                var now = DateTime.now().setZone(clock.timeZone);
                var options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
                clock.timeDiv.textContent = now.toLocaleString(DateTime.TIME_WITH_SECONDS);
                if (isBankOpen(now, clock.bankHours)) {
                    clock.timeDiv.style.color = 'green';
                } else {
                    clock.timeDiv.style.color = 'red';
                }
            }
        }

        setInterval(updateTime, 1000);
        updateTime();
    }

    button.addEventListener('click', openTimeWindow);
};
