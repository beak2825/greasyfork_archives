// ==UserScript==
// @name         NSFW-Profile Links Adder
// @name:en      NSFW-Profile Links Adder
// @namespace    https://greasyfork.org/ru/users/1373266-godinraider
// @version      1.9
// @description  Добавляет кнопки с ссылками на Coomer, Kemono, Bunkr, Social Media Girls и Pornolab, используя юзернейм с OnlyFans, Patreon, Fansly и Boosty.
// @description:en  Adds buttons with links to Coomer, Kemono, Bunkr, Social Media Girls, and Pornolab using users with links to OnlyFans, Patreon, Fansly, and Boosty.
// @author       GodinRaider
// @match        *onlyfans.com/*
// @match        *patreon.com/*
// @match        *fansly.com/*
// @match        *boosty.to/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519387/NSFW-Profile%20Links%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/519387/NSFW-Profile%20Links%20Adder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция для извлечения юзернейма из URL
    function getUsername() {
        const path = window.location.pathname.replace(/^\/+|\/+$/g, ''); // Удаляем слэши в начале и конце
        return path.split('/')[0]; // Берем первую часть пути (юзернейм)
    }

    // Функция для создания кнопок
    function createButtons(username) {
        const containerId = 'nsfw-profile-links-container';

        // Удаляем старый контейнер, если он существует
        const oldContainer = document.getElementById(containerId);
        if (oldContainer) oldContainer.remove();

        // Если юзернейм отсутствует, ничего не делаем
        if (!username) return;

        // Создаем новый контейнер для кнопок
        const container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.top = '100px';
        container.style.left = '10px';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

        // Определяем текущий сайт
        const isPatreon = window.location.hostname.includes('patreon.com');
        const isFansly = window.location.hostname.includes('fansly.com');
        const isBoosty = window.location.hostname.includes('boosty.to');
        const isOnlyFans = window.location.hostname.includes('onlyfans.com');

        // Конфигурация кнопок
        const buttons = [
            {
                href: isPatreon
                    ? `https://kemono.su/artists?q=${username}&service=patreon&sort_by=favorited&order=desc`
                    : isBoosty
                    ? `https://kemono.su/artists?q=${username}&service=boosty&sort_by=favorited&order=desc`
                    : isFansly
                    ? `https://coomer.su/artists?q=${username}&service=fansly&sort_by=favorited&order=desc`
                    : `https://coomer.su/artists?q=${username}&service=&sort_by=favorited&order=desc`,
                icon: isPatreon || isBoosty
                    ? 'https://kemono.su/favicon.ico'
                    : 'https://coomer.su/favicon.ico',
                title: isPatreon
                    ? 'Kemono Patreon Search'
                    : isBoosty
                    ? 'Kemono Boosty Search'
                    : isFansly
                    ? 'Coomer Fansly Search'
                    : 'Coomer Search'
            },
            {
                href: `https://bunkr-albums.io/?search=${username}`,
                icon: 'https://status.bunkr.ru/icon.svg',
                title: 'Bunkr Search'
            },
            {
                href: `https://forums.socialmediagirls.com/search/?q=${username}`,
                icon: 'https://forums.socialmediagirls.com/favicon.ico',
                title: 'Social Media Girls Search'
            },
            {
                href: `https://pornolab.net/forum/tracker.php?o=1&s=2&tm=-1&nm=${username}&f=-1`,
                icon: 'https://pornolab.net/favicon.ico',
                title: 'Pornolab Search'
            }
        ];

        // Добавляем стиль для анимаций
        const style = document.createElement('style');
        style.textContent = `
            .profile-link-button {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .profile-link-button:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
            }
            .profile-link-button:active {
                transform: scale(0.95);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
        `;
        document.head.appendChild(style);

        // Создаем кнопки и добавляем их в контейнер
        buttons.forEach(({ href, icon, title }) => {
            const button = document.createElement('a');
            button.href = href;
            button.target = '_blank';
            button.title = title;
            button.className = 'profile-link-button';
            button.style.width = '50px';
            button.style.height = '50px';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.backgroundColor = '#fff';
            button.style.border = '1px solid #ccc';
            button.style.borderRadius = '5px';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

            const img = document.createElement('img');
            img.src = icon;
            img.alt = title;
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.objectFit = 'contain';
            button.appendChild(img);

            container.appendChild(button);
        });

        // Добавляем контейнер с кнопками на страницу
        document.body.appendChild(container);
    }

    // Инициализируем кнопки
    createButtons(getUsername());
})();
