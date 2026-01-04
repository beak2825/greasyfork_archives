// ==UserScript==
// @name         Кнопка для поиска фильма на Flicksbar через API Кинопоиска используя базу фильмов HDRezka
// @namespace    http://tampermonkey.net/
// @icon         https://icon2.cleanpng.com/lnd/20240915/sf/f756b06ecd171836c2c3ef125178d4.webp
// @version      0.8.0.2
// @description  Добавляет кнопку для поиска фильма на Flicksbar через API Кинопоиска (поиск только после нажатия кнопки)
// @author       Vladimir_0202
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/532002/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0%20%D0%BD%D0%B0%20Flicksbar%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20API%20%D0%9A%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%83%D1%8F%20%D0%B1%D0%B0%D0%B7%D1%83%20%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%BE%D0%B2%20HDRezka.user.js
// @updateURL https://update.greasyfork.org/scripts/532002/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0%20%D0%BD%D0%B0%20Flicksbar%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20API%20%D0%9A%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%83%D1%8F%20%D0%B1%D0%B0%D0%B7%D1%83%20%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%BE%D0%B2%20HDRezka.meta.js
// ==/UserScript==

(function() {
    'use strict';
// CSS-код
GM.addStyle(`
.b-sidecover {
    margin-bottom: 8px;
}
`);


        const currentUrl = window.location.href;
        // Проверяем, содержится ли в текущем URL подстрока '/person/'
        if (currentUrl.includes('/person/')) {
            console.log('Скрипт не выполняется на этой странице:', currentUrl);
            return; // Прекращаем выполнение скрипта
        }

    const API_KEY = 'GG52TS1-SJD4GFR-N4Z8HGS-GYEA9FX';
    const API_URL = 'https://api.kinopoisk.dev/v1.3/movie';

    function getFilmDetails() {
        const titleElement = document.querySelector('.b-post__title');
        const originalTitleElement = document.querySelector('.b-post__origtitle');
        const yearLink = document.querySelector('.b-post__info a[href*="/year/"]');
        const typeLink = document.querySelector('.b-post__info a[href*="/series/"]');

        const title = titleElement ? titleElement.textContent.trim() : '';
        const originalTitle = originalTitleElement ? originalTitleElement.textContent.trim() : '';
        let year = '';
        if (yearLink) {
            year = yearLink.textContent.trim().replace('года', '').trim();
        }

        const isSeries = typeLink !== null;
        console.log('Извлеченные данные о фильме:', { title, originalTitle, year, isSeries });
        return { title, originalTitle, year, isSeries };
    }

    async function searchOnKinopoisk({ title, originalTitle, year }) {
        try {
            const queries = [
                { name: title, year },
                { name: originalTitle, year },
                { name: title },
                { name: originalTitle }
            ];

            for (const query of queries) {
                const searchParams = new URLSearchParams(query).toString();
                console.log('Поиск с параметрами:', searchParams);

                const response = await fetch(`${API_URL}?${searchParams}`, {
                    headers: { 'X-API-KEY': API_KEY }
                });

                if (!response.ok) {
                    console.error(`Ошибка API (${response.status}):`, await response.text());
                    continue;
                }

                const data = await response.json();
                console.log('Ответ API:', data);

                if (data.docs && data.docs.length > 0) {
                    console.log('Найден фильм с ID:', data.docs[0].id);
                    return { id: data.docs[0].id, type: data.docs[0].type };
                }
            }
            console.log('Фильмы не найдены');
        } catch (error) {
            console.error('Ошибка при запросе к API Кинопоиска:', error);
        }
        return null;
    }

    function createButton() {
        const { title, originalTitle, year } = getFilmDetails();
        const button = document.createElement('button');
        button.textContent = 'Найти на Flicksbar (API)';
        button.style.padding = '9px';
        button.style.marginTop = '5px';
        button.style.marginBottom = '2px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = '1px dashed lightblue';
        button.style.borderRadius = '3px';
        button.style.width = '100%';
        button.style.cursor = 'pointer';
        button.title = `Поиск: ${title} ${originalTitle} ${year}`;

        button.onclick = async () => {
            const { title, originalTitle, year, isSeries } = getFilmDetails();
            if (!title) {
                alert('Не удалось извлечь информацию о фильме.');
                console.log('Не найдены данные о фильме');
                return;
            }

            button.textContent = 'Ищу фильм...';
            button.disabled = true;
            button.style.backgroundColor = '#ffcc00';

            const result = await searchOnKinopoisk({ title, originalTitle, year });
            if (result) {
                const flicksbarType = isSeries ? 'series' : 'film';
                const flicksbarLink = `https://flicksbar.mom/${flicksbarType}/${result.id}`;
                console.log('Ссылка на Flicksbar:', flicksbarLink);
                button.textContent = 'Смотреть на Flicksbar';
                button.style.backgroundColor = '#28a745';
                button.disabled = false;
                button.onclick = () => window.open(flicksbarLink, '_blank');
            } else {
                button.textContent = 'Фильм не найден';
                button.style.backgroundColor = '#dc3545';
                button.disabled = false;
            }
        };

        const sideCover = document.querySelector('.b-sidecover');
        if (sideCover) {
            sideCover.appendChild(button);
            console.log('Кнопка добавлена');
        } else {
            console.log('Ошибка: не найден элемент .b-sidecover');
        }
    }

    window.addEventListener('load', createButton);
})();
