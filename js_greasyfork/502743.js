// ==UserScript==
// @name         UnicoTimer
// @version      3.2.1
// @description  Показывает время работы банков латама с возможностью настройки.
// @author       Ебейший 77
// @match        *://web-unico.chat2desk.com/*
// @match        *://web.chat2desk.by/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace    https://greasyfork.org/users/1338837
// @downloadURL https://update.greasyfork.org/scripts/502743/UnicoTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/502743/UnicoTimer.meta.js
// ==/UserScript==

const GITHUB_VERSION_URL = 'https://raw.githubusercontent.com/PoopSoftWare/ptimer/main/ver';
const GITHUB_SCRIPT_URL = 'https://update.greasyfork.org/scripts/502743/UnicoNotion.user.js';
const CURRENT_VERSION = '3.2.1';

function checkForUpdates() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: GITHUB_VERSION_URL,
        onload: function(response) {
            const latestVersion = response.responseText.trim();
            if (latestVersion > CURRENT_VERSION) {
                if (confirm(`Доступна новая версия UnicoTimer (${latestVersion}). Обновить сейчас?`)) {
                    window.location.href = GITHUB_SCRIPT_URL;
                }
            }
        }
    });
}

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.0/luxon.min.js';
document.head.appendChild(script);

script.onload = function() {
    const { DateTime } = luxon;

    const countries = {
        'Боливия': 'America/La_Paz',
        'Перу': 'America/Lima',
        'Эквадор': 'America/Guayaquil',
        'Колумбия': 'America/Bogota',
        'Гватемала': 'America/Guatemala',
        'Коста-Рика': 'America/Costa_Rica',
        'Аргентина': 'America/Argentina/Buenos_Aires',
        'Чили': 'America/Santiago',
        'Парагвай': 'America/Asuncion',
        'Уругвай': 'America/Montevideo',
        'Бразилия': 'America/Sao_Paulo',
        'Мексика': 'America/Mexico_City',
        'Венесуэла': 'America/Caracas',
        'Гондурас': 'America/Tegucigalpa',
        'Никарагуа': 'America/Managua',
        'Сальвадор': 'America/El_Salvador'
    };

    const bankHours = {
        'Боливия': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 12 },
        'Перу': { open: 9, close: 17, saturdayOpen: 9, saturdayClose: 13 },
        'Эквадор': { open: 9, close: 17, saturdayOpen: 9, saturdayClose: 13 },
        'Колумбия': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
        'Гватемала': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 12 },
        'Коста-Рика': { open: 8, close: 16, saturdayOpen: 9, saturdayClose: 12 },
        'Аргентина': { open: 10, close: 15, saturdayOpen: 10, saturdayClose: 13 },
        'Чили': { open: 9, close: 14, saturdayOpen: 9, saturdayClose: 12 },
        'Парагвай': { open: 8, close: 15, saturdayOpen: 8, saturdayClose: 12 },
        'Уругвай': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
        'Бразилия': { open: 10, close: 16, saturdayOpen: 10, saturdayClose: 14 },
        'Мексика': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
        'Венесуэла': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
        'Гондурас': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
        'Никарагуа': { open: 9, close: 16, saturdayOpen: 9, saturdayClose: 13 },
        'Сальвадор': { open: 8, close: 16, saturdayOpen: 8, saturdayClose: 12 }
    };

    function createButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                <line x1="12" y1="12" x2="16" y2="8" stroke="white" stroke-width="2"/>
                <line x1="12" y1="12" x2="12" y2="16" stroke="white" stroke-width="2"/>
            </svg>
        `;
        button.style.position = 'fixed';
        button.style.bottom = '2vh';
        button.style.left = '1vw';
        button.style.zIndex = 1000;
        button.style.width = '60px';
        button.style.height = '60px';
        button.style.backgroundColor = '#808080';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.cursor = 'pointer';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        document.body.appendChild(button);
        button.addEventListener('click', chooseMode);
    }

    function chooseMode() {
        const choice = confirm("Чтобы открыть часы в новом окне Нажмите 'OK' для нового окна или 'Отмена' для виджета на сайте.");
        if (choice) {
            createTimeWindow();
        } else {
            createTimePanel();
        }
    }

    function createTimeWindow() {
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

        setupClock(container);
    }

    function createTimePanel() {
        var container = document.createElement('div');
        container.id = 'time-widget-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ddd';
        container.style.padding = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        container.style.borderRadius = '8px';
        container.style.resize = 'both';
        container.style.overflow = 'auto';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
        closeButton.addEventListener('click', () => {
            container.remove();
        });
        container.appendChild(closeButton);

        document.body.appendChild(container);

        setupClock(container);
    }

    function setupClock(container) {
        let selectedCountries = GM_getValue('selectedCountries', Object.keys(countries));

        function createCountryElement(country) {
            const clock = document.createElement('div');
            clock.style.marginBottom = '10px';
            clock.style.display = 'flex';
            clock.style.alignItems = 'center';
            clock.style.justifyContent = 'space-between';

            const countryDiv = document.createElement('div');
            countryDiv.textContent = country;
            countryDiv.style.fontSize = '1.2em';
            clock.appendChild(countryDiv);

            const timeDiv = document.createElement('div');
            timeDiv.style.fontSize = '1.5em';
            timeDiv.style.fontWeight = 'bold';
            clock.appendChild(timeDiv);

            const removeButton = document.createElement('button');
            removeButton.textContent = '✖';
            removeButton.style.marginLeft = '10px';
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', () => {
                clock.remove();
                selectedCountries = selectedCountries.filter(c => c !== country);
                GM_setValue('selectedCountries', selectedCountries);
            });
            clock.appendChild(removeButton);

            clock.timeDiv = timeDiv;
            clock.timeZone = countries[country];
            clock.bankHours = bankHours[country];

            return clock;
        }

        function addCountry(country) {
            if (!selectedCountries.includes(country)) {
                selectedCountries.push(country);
                container.insertBefore(createCountryElement(country), addCountryButton);
                GM_setValue('selectedCountries', selectedCountries);
            }
        }

        selectedCountries.forEach(country => {
            container.appendChild(createCountryElement(country));
        });

        const addCountryButton = document.createElement('button');
        addCountryButton.textContent = 'Добавить страну';
        addCountryButton.style.marginTop = '10px';
        addCountryButton.addEventListener('click', () => {
            const availableCountries = Object.keys(countries).filter(c => !selectedCountries.includes(c));
            if (availableCountries.length === 0) {
                alert('Все страны уже добавлены');
                return;
            }
            const country = prompt('Выберите страну для добавления:\n' + availableCountries.join(', '));
            if (country && countries[country]) {
                addCountry(country);
            }
        });
        container.appendChild(addCountryButton);

        function isBankOpen(now, hours) {
            const day = now.weekday;
            const hour = now.hour;

            if (day >= 1 && day <= 5) {
                return hour >= hours.open && hour < hours.close;
            } else if (day === 6) {
                return hour >= hours.saturdayOpen && hour < hours.saturdayClose;
            } else {
                return false;
            }
        }

        function updateTime() {
            Array.from(container.children).forEach(clock => {
                if (clock.timeDiv) {
                    const now = DateTime.now().setZone(clock.timeZone);
                    clock.timeDiv.textContent = now.toLocaleString(DateTime.TIME_WITH_SECONDS);
                    clock.timeDiv.style.color = isBankOpen(now, clock.bankHours) ? 'green' : 'red';
                }
            });
        }

        setInterval(updateTime, 1000);
        updateTime();

        if (container.id === 'time-widget-container') {
            container.onmousedown = function(event) {
                if (event.target.tagName.toLowerCase() === 'button') return;

                const shiftX = event.clientX - container.getBoundingClientRect().left;
                const shiftY = event.clientY - container.getBoundingClientRect().top;

                function moveAt(pageX, pageY) {
                    container.style.left = pageX - shiftX + 'px';
                    container.style.top = pageY - shiftY + 'px';
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener('mousemove', onMouseMove);

                container.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    container.onmouseup = null;
                };
            };

            container.ondragstart = function() {
                return false;
            };
        }
    }

    createButton();
    checkForUpdates();
};
