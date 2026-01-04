// ==UserScript==
// @name         Rezka+
// @namespace    https://rezka.ag/
// @version      1.8.1
// @description  Добавляет кнопки  под постерами на HDRezka для поиска фильмов на разных торрент-трекерах или других сайтах
// @author       CgPT & Vladimir0202
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @icon         https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522503/Rezka%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/522503/Rezka%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Получаем список трекеров из хранилища Tampermonkey или создаем дефолтный
    const savedTrackers = GM_getValue('rezkaTrackers', [
        { name: 'RuTracker', urlTemplate: 'https://rutracker.org/forum/tracker.php?nm={query}', icon: 'https://rutracker.org/favicon.ico' },
        { name: 'Kinozal.TV', urlTemplate: 'https://kinozal.tv/browse.php?s={query}', icon: 'https://kinozal.tv/pic/favicon.ico' },
        { name: 'RuTor', urlTemplate: 'http://rutor.info/search/0/0/100/0/{query}', icon: 'http://rutor.info/favicon.ico'},
        { name: 'NNM.Club', urlTemplate: 'https://nnmclub.to/forum/tracker.php?nm={query}', icon: 'https://nnmstatic.win/favicon.ico'},
        { name: 'Hurtom', urlTemplate: 'https://toloka.to/tracker.php?nm={queryEng}', icon: 'https://toloka.to/favicon.ico'},
        { name: 'КиноПоиск', urlTemplate: 'https://www.kinopoisk.ru/index.php?kp_query={query}', icon: 'https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru'},
        { name: 'Kinorium', urlTemplate: 'https://ru.kinorium.com/search/?q={query}', icon: 'https://ru.kinorium.com/favicon.ico'},
        { name: 'Youtube', urlTemplate: 'https://www.youtube.com/results?search_query={query}', icon: 'https://www.youtube.com/favicon.ico'},
    ]);

    // Сохраняем трекеры в хранилище Tampermonkey
    function saveTrackers() {
        GM_setValue('rezkaTrackers', savedTrackers);
    }

    // Добавляем кнопку для добавления сайта
    function addNewTrackerButton(container) {
        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.title = 'Добавить новый сайт для поиска';
        addButton.style.width = '12px';
        addButton.style.height = '12px';
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
                // Извлечение домена из URL шаблона
                const domainMatch = urlTemplate.match(/^(https?:\/\/[^/]+)/);
                let icon = '';
                if (domainMatch) {
                    const faviconUrl = `${domainMatch[1]}/favicon.ico`; // Основной путь к favicon
                    try {
                        // Проверяем доступность favicon
                        const response = await fetch(faviconUrl, { method: 'HEAD' });
                        if (response.ok) {
                            icon = faviconUrl; // Если доступен, используем его
                        } else {
                            throw new Error('Favicon not found');
                        }
                    } catch (error) {
                        // Если favicon не найден, используем Google Favicon API
                        icon = `https://www.google.com/s2/favicons?domain=${domainMatch[1]}`;
                    }
                }

                // Добавляем сайт в трекеры
                savedTrackers.push({ name, urlTemplate, icon });
                saveTrackers();
                alert('Сайт успешно добавлен. Перезагрузите страницу, чтобы увидеть изменения.');
            }
        });

        container.appendChild(addButton);
    }

    // Основной процесс добавления кнопок
    const movieCards = document.querySelectorAll('.b-content__columns');

    movieCards.forEach(card => {
        // Извлекаем название фильма
        const titleElement = card.querySelector('.b-post__title');
        if (!titleElement) return;
        const title = titleElement.textContent.trim();

        const titleEngElement = card.querySelector('.b-post__origtitle');
        const titleEng = titleEngElement ? titleEngElement.textContent.trim() : '';

        // Извлекаем год из ссылки внутри .b-post__info
        const yearLink = document.querySelector('.b-post__info a[href*="/year/"]');
        let year = '';
        if (yearLink) {
            year = yearLink.textContent.trim().replace('года', '').trim();
        }

        // Создаем контейнер для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.gap = '5px';
        buttonContainer.style.marginTop = '10px';

        // Добавляем кнопки для каждого сайта
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
            button.style.width = '12px';
            button.style.height = '12px';
            //button.style.border = '1px solid #ccc';
            //button.style.backgroundColor = '#fff';
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

        // Добавляем кнопку для добавления сайта
        addNewTrackerButton(buttonContainer);

        // Вставляем контейнер под постером
        const posterContainer = card.querySelector('.b-post__infotable_left');
        if (posterContainer) {
            posterContainer.appendChild(buttonContainer);
        }
    });

    console.log('Кнопки добавлены под постерами!');
})();
