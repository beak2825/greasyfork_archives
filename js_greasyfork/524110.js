// ==UserScript==
// @name         Search Links for Kinopoisk
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Кнопка с ссылками для фильмов и аниме на Кинопоиске
// @match        *://www.kinopoisk.ru/*
// @icon         https://www.kinopoisk.ru/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524110/Search%20Links%20for%20Kinopoisk.user.js
// @updateURL https://update.greasyfork.org/scripts/524110/Search%20Links%20for%20Kinopoisk.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Список сайтов и их ссылки
    const defaultLinks = {
        'HDRezka': 'https://hdrezka.co/search/?do=search&subaction=search&q=',
        'LostFilm': 'https://lostfilm.tv/search/?q=',
        'Kinozal': 'https://kinozal.tv/browse.php?s=',
        'Traktorr': 'http://tragtorr.in/search/',
        'Rutor': 'https://rutor.is/search/0/0/100/0/', //
        'Shikimori': 'https://shikimori.one/animes?search=',
        'AnimeGo': 'https://animego.org/search/all?q=',
        'SeasonVar': 'http://seasonvar.ru/search?q=',
        'Kinorium': 'https://ru.kinorium.com/search/?q=',
        'Rutracker': 'https://rutracker.org/forum/tracker.php?nm=',
        'Reyohoho': 'https://reyohoho.github.io/reyohoho/#', // Поиск по ID
        'IMDB': 'https://www.imdb.com/find/?q=', // Поиск по названию
        'Kinofree': 'https://kinofree.su/search?key=' // Добавлена ссылка для Kinofree
    };

    // Загружаем настройки из LocalStorage, по умолчанию включены Кинориум, Traktorr, HDRezka, Shikimori и LostFilm
    let activeSites = JSON.parse(localStorage.getItem('activeSites')) || ['Kinorium', 'Traktorr', 'HDRezka', 'Shikimori', 'LostFilm', 'Rutracker'];

    // Функция для добавления кнопок
    function addButtons() {
        const titleElement = document.querySelector('h1');
        if (!titleElement || document.querySelector('.useful-links-container')) return;

        const movieTitle = titleElement.innerText.trim();
        const movieId = window.location.pathname.split('/')[2]; // Получаем ID фильма из URL
        const buttonContainer = createButtonContainer();

        // Добавляем кнопки для активных сайтов
        activeSites.forEach((siteName) => {
            const siteLink = siteName === 'Reyohoho'
                ? defaultLinks[siteName] + movieId  // Для Reyohoho используем ID фильма из URL
                : defaultLinks[siteName] + encodeURIComponent(movieTitle);  // Для остальных сайтов используем название фильма
            const button = createButton(siteName, siteLink);
            buttonContainer.appendChild(button);
        });

        // Кнопка настроек
        const settingsButton = createSettingsButton();
        buttonContainer.appendChild(settingsButton);

        // Добавляем контейнер в DOM
        titleElement.appendChild(buttonContainer);
    }

    // Создание контейнера для кнопок
    function createButtonContainer() {
        const container = document.createElement('div');
        container.className = 'useful-links-container';
        container.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
            gap: 10px;
        `;
        return container;
    }

    // Создание кнопки
    function createButton(text, link) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.cssText = `
            background-color: #f2f2f2;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            transition: 0.3s;
        `;
        button.onmouseover = () => button.style.backgroundColor = '#e0e0e0';
        button.onmouseout = () => button.style.backgroundColor = '#f2f2f2';
        button.onclick = () => window.open(link, '_blank');
        return button;
    }

    // Создание кнопки настроек
    function createSettingsButton() {
        const button = document.createElement('button');
        button.innerText = '⚙️';
        button.style.cssText = `
            background-color: #f2f2f2;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.3s;
        `;
        button.onmouseover = () => button.style.backgroundColor = '#e0e0e0';
        button.onmouseout = () => button.style.backgroundColor = '#f2f2f2';
        button.onclick = (event) => toggleSettingsMenu(event, button);
        return button;
    }

    // Показ/скрытие меню настроек
    function toggleSettingsMenu(event, button) {
        let menu = document.querySelector('.settings-menu');
        if (menu) {
            menu.remove();
            return;
        }

        menu = createSettingsMenu();
        document.body.appendChild(menu);

        // Установка позиции окна под кнопкой
        const rect = button.getBoundingClientRect();
        menu.style.top = `${window.scrollY + rect.bottom + 10}px`;
        menu.style.left = `${window.scrollX + rect.left}px`;

        // Закрытие окна при клике за его пределами
        const closeMenuOnClickOutside = (e) => {
            if (!menu.contains(e.target) && e.target !== button) {
                menu.remove();
                document.removeEventListener('click', closeMenuOnClickOutside);
            }
        };
        document.addEventListener('click', closeMenuOnClickOutside);
    }

    // Создание меню настроек
    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.className = 'settings-menu';
        menu.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        `;

        const title = document.createElement('h3');
        title.innerText = 'Настройки ссылок';
        title.style.cssText = `
            margin: 0 0 15px;
            font-size: 18px;
        `;
        menu.appendChild(title);

        Object.keys(defaultLinks).forEach((siteName) => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = activeSites.includes(siteName);
            checkbox.onchange = () => {
                if (checkbox.checked) activeSites.push(siteName);
                else activeSites = activeSites.filter(site => site !== siteName);
            };

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(siteName));
            menu.appendChild(label);
        });

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Сохранить';
        saveButton.style.cssText = `
            display: block;
            margin: 20px auto 0;
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        saveButton.onclick = () => {
            localStorage.setItem('activeSites', JSON.stringify(activeSites));
            menu.remove();
            location.reload(); // Обновление страницы
        };
        menu.appendChild(saveButton);

        return menu;
    }

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', addButtons);
})();
