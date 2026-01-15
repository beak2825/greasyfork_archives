// ==UserScript==
// @name         Kinorium +
// @namespace    https://kinorium.com/
// @version      1.7.9
// @description  Добавляет кнопки под постерами фильмов на Kinorium для поиска на трекерах и других сайтах
// @author       CgPT & Vladimir0202
// @include      /^https?:\/\/.*kinorium.*\/.*$/
// @icon         https://ru.kinorium.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529912/Kinorium%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/529912/Kinorium%20%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Проверка: находимся ли мы на главной странице фильма (например: https://kinorium.com/247921/)
    const path = window.location.pathname;
    const isMainFilmPage = /^\/\d+\/?$/.test(path);

    if (!isMainFilmPage) {
        console.log('Не главная страница фильма, кнопка не будет добавлена.');
        return;
    }

    console.log('Kinorium+ Search script started');

    const savedTrackers = GM_getValue('kinoriumTrackers', [
        { name: 'RuTracker', urlTemplate: 'https://rutracker.org/forum/tracker.php?nm={query}', icon: 'https://rutracker.org/favicon.ico' },
        { name: 'Kinozal.TV', urlTemplate: 'https://kinozal.tv/browse.php?s={query}', icon: 'https://kinozal.tv/pic/favicon.ico' },
        { name: 'RuTor', urlTemplate: 'http://rutor.info/search/0/0/100/0/{query}', icon: 'http://rutor.info/favicon.ico' },
        { name: 'NNM.Club', urlTemplate: 'https://nnmclub.to/forum/tracker.php?nm={query}', icon: 'https://nnmstatic.win/favicon.ico' },
        { name: 'HDRezka', urlTemplate: 'https://hdrezka.ag/search/?do=search&subaction=search&q={query}', icon: 'https://statichdrezka.ac/templates/hdrezka/images/favicon.ico' },
        { name: 'Kinopoisk', urlTemplate: 'https://www.kinopoisk.ru/index.php?kp_query={query}', icon: 'https://www.kinopoisk.ru/favicon.ico' },
        { name: 'Youtube', urlTemplate: 'https://www.youtube.com/results?search_query={query}', icon: 'https://www.youtube.com/favicon.ico'},
    ]);

    function saveTrackers() {
        GM_setValue('kinoriumTrackers', savedTrackers);
    }

    function extractMovieData() {
        const titleElement = document.querySelector('.film-page__title-text.film-page__itemprop');
        const title = titleElement ? titleElement.textContent.trim() : '';

        const titleEngElement = document.querySelector('.film-page__orig_with_comment');
        //|| document.querySelector('.film-page__subtitle');
        const titleEng = titleEngElement ? titleEngElement.textContent.trim() : '';

        const yearElement = document.querySelector('.film-page__date a[href*="years_min="]');
        const year = yearElement ? yearElement.textContent.trim() : '';

        console.log(`Extracted movie data: Title: "${title}", Original Title: "${titleEng}", Year: "${year}"`);

        return { title, titleEng, year };
    }

    function addNewTrackerButton(container) {
        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.title = 'Добавить новый сайт для поиска';
        addButton.style.width = '19px';
        addButton.style.height = '19px';
        addButton.style.fontWeight = 'bold';
        addButton.style.fontSize = '16px';
        addButton.style.border = '1px solid #ccc';
        addButton.style.backgroundColor = '#f0f0f0';
        addButton.style.borderRadius = '5px';
        addButton.style.display = 'flex';
        addButton.style.alignItems = 'center';
        addButton.style.justifyContent = 'center';
        addButton.style.cursor = 'pointer';

        addButton.addEventListener('mouseover', () => {
            addButton.style.transform = 'scale(1.1)';
            addButton.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
            addButton.style.backgroundColor = '#DFDCD8';
            addButton.style.alignItems = 'center';
            addButton.style.justifyContent = 'center';
        });

        addButton.addEventListener('mouseout', () => {
            addButton.style.transform = 'scale(1)';
            addButton.style.boxShadow = 'none';
            addButton.style.backgroundColor = '#f0f0f0';
        });

        addButton.addEventListener('click', async () => {
            const name = prompt('Введите название сайта:');
            const urlTemplate = prompt('Введите URL шаблон (используйте {query} или {queryEng} для поиска):');

            if (name && urlTemplate) {
                const domainMatch = urlTemplate.match(/^(https?:\/\/[^/]+)/);
                let icon = domainMatch ? `${domainMatch[1]}/favicon.ico` : '';
                savedTrackers.push({ name, urlTemplate, icon });
                saveTrackers();
                alert('Сайт успешно добавлен. Перезагрузите страницу, чтобы увидеть изменения.');
            }
        });

        container.appendChild(addButton);
    }

    function addSearchButtons() {
        const { title, titleEng, year } = extractMovieData();
        if (!title) {
            console.warn('Title not found, skipping button creation');
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.gap = '5px';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.marginBottom = '10px';

        savedTrackers.forEach(tracker => {
            const button = document.createElement('a');
            const query = encodeURIComponent(`${title} ${titleEng} ${year}`);
            const queryEng = encodeURIComponent(`${titleEng} ${year}`);
            const url = tracker.urlTemplate
            .replace('{query}', query)
            .replace('{queryEng}', queryEng);

            button.href = url;
            button.target = '_blank';
            button.title = tracker.name;
            button.style.width = '20px';
            button.style.height = '20px';
            button.style.borderRadius = '5px';
            button.style.backgroundImage = `url(${tracker.icon})`;
            button.style.backgroundSize = 'contain';
            button.style.backgroundRepeat = 'no-repeat';
            button.style.backgroundPosition = 'center';

            button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
            });

            button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
            });

            buttonContainer.appendChild(button);
        });

        addNewTrackerButton(buttonContainer);

        const targetElement = document.querySelector('.collectionWidget.collectionWidgetData.withFavourites');
        if (targetElement) {
            targetElement.after(buttonContainer);
            console.log('Search buttons added successfully');
        } else {
            console.warn('Target element for buttons not found');
        }
    }

    addSearchButtons();
})();
