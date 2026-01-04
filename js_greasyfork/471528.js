// ==UserScript==
// @name         LztWeatherApi
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Отображение погоды на главной странице форума
// @author       vuchaev2015
// @match        https://zelenka.guru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471528/LztWeatherApi.user.js
// @updateURL https://update.greasyfork.org/scripts/471528/LztWeatherApi.meta.js
// ==/UserScript==

const apiKey = "3a068cfd15014c20b75173452232307";
let city = "";

fetch('https://ipwho.is/')
    .then(response => response.json())
    .then(data => {
    city = data.city.replace(/'/g, "");

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
        let text = `Город: ${city}<br>`;
        const h = data.current;

        if ('temp_c' in h) {
            text += `Температура: ${h['temp_c']} °C<br>`;
        }

        if ('feelslike_c' in h) {
            text += `Ощущается как: ${h['feelslike_c']} °C<br>`;
        }

        if ('humidity' in h) {
            text += `Влажность: ${h['humidity']} %<br>`;
        }

        if ('pressure_mb' in h) {
            text += `Давление: ${h['pressure_mb']} мб<br>`;
        }

        if ('wind_kph' in h) {
            text += `Скорость ветра: ${h['wind_kph']} км/ч<br>`;
        }

        if ('vis_km' in h) {
            text += `Видимость: ${h['vis_km']} км<br>`;
        }

        const weatherContainer = document.querySelector(".section.visitorPanel");
        const weatherElement = document.createElement("div");
        weatherElement.innerHTML = `<br><div class="secondaryContent">
            <span class="muted">Погода</span>
            <div id="avatar-plus-nick-status">
                <a href="pelmeni2023/" class="avatar Av302690s" data-avatarhtml="true"></a>
                <div></div>
            </div>
            <div class="mn-15-0-0">${text}</div>
            <a class="mn-15-0-0 button primary block" href="https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}">Получить Json</a>
        </div>`;
        weatherContainer.appendChild(weatherElement);
    });
});