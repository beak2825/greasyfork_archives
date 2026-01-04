// ==UserScript==
// @name         Open Unique Admin Links KZ
// @namespace    https://dodopizza.design-terminal.io
// @version      1.5
// @description  Adds a button to open unique admin links in new tabs, filtered and deduplicated, one by one with delay to avoid browser restrictions.
// @author       YourName
// @match        https://dodopizza.design-terminal.io/packs
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dodopizza.design-terminal.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531696/Open%20Unique%20Admin%20Links%20KZ.user.js
// @updateURL https://update.greasyfork.org/scripts/531696/Open%20Unique%20Admin%20Links%20KZ.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция для добавления кнопки
    function addButton() {
        const table = document.querySelector('.packs-view__table');
        const existingButton = document.getElementById('open-admin-links-kz');

        // Проверяем, существует ли таблица и кнопка уже добавлена
        if (table && !existingButton) {
            const section = document.createElement('section');
            section.classList.add('section');
            section.innerHTML = `
                <p>
                    <a class="link" href="#" id="open-admin-links">Open unique KZ packs in admin area</a>
                </p>`;
            table.parentNode.insertAdjacentElement('afterend', section);
            console.log('Кнопка добавлена под таблицей!');

            // Добавляем обработчик события для кнопки
            document.getElementById('open-admin-links').addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем переход по ссылке
                openUniqueLinksWithDelay();
            });
        }
    }

    // Функция для открытия только уникальных ссылок с задержкой
    function openUniqueLinksWithDelay() {
        const table = document.querySelector('.packs-view__table');
        if (table) {
            const links = table.querySelectorAll('a.link'); // Находим все ссылки
            const uniqueIds = new Set();
            const urls = Array.from(links)
                .map(link => {
                    const url = new URL(link.href);
                    if (!url.pathname.startsWith('/admin/')) {
                        url.pathname = `/admin${url.pathname}`;
                    }
                    return url.toString();
                })
                .filter(url => {
                    // Фильтруем ссылки, оставляя только уникальные ID
                    const match = url.match(/\/admin\/packs\/(\d+)$/);
                    if (match) {
                        const id = match[1];
                        if (!uniqueIds.has(id)) {
                            uniqueIds.add(id);
                            return true;
                        }
                    }
                    return false;
                });

            // Открываем ссылки с задержкой
            let index = 0;
            const delay = 10; // 500 мс задержки между открытиями
            const openNextLink = () => {
                if (index < urls.length) {
                    window.open(urls[index] + '#ToggleKazakhstan', '_blank');
                    index++;
                    setTimeout(openNextLink, delay);
                } else {
                    console.log(`${urls.length} уникальных ссылок открыто.`);
                }
            };
            openNextLink();
        }
    }

    // Регулярная проверка наличия таблицы каждые 500 мс
    const interval = setInterval(() => {
        addButton();
        // Если кнопка добавлена, останавливаем проверку
        if (document.getElementById('open-admin-links')) {
            clearInterval(interval);
        }
    }, 500);
})();
