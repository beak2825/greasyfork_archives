// ==UserScript==
// @name          AS ClubBoost Stats Downloader
// @namespace     https://animestars.org/
// @version       3
// @description   Добавляет кнопку для скачивания текстового файла со статистикой вклада пользователей на странице буста клуба, с указанием фильтра.
// @author        ChatGPT
// @match         https://animestars.org/clubs/boost/?id=20*
// @match         https://asstars.tv/clubs/boost/?id=20*
// @match         https://astars.club/clubs/boost/?id=20*
// @match         https://as1.astars.club/clubs/boost/?id=20*
// @match         https://as1.asstars.tv/clubs/boost/?id=20*
// @match         https://as2.asstars.tv/clubs/boost/?id=20*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/540435/AS%20ClubBoost%20Stats%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540435/AS%20ClubBoost%20Stats%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для добавления стилей на страницу
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Добавляем flexbox для tabs__nav, чтобы выровнять элементы */
            .tabs__nav {
                display: flex;
                align-items: center; /* Выравнивание по центру по вертикали */
                justify-content: flex-start; /* Элементы слева */
                flex-wrap: wrap; /* Разрешить перенос строк, если много элементов */
            }

            /* Контейнер кнопки, чтобы он оттолкнул существующие ссылки вправо */
            .as-download-button-wrapper {
                margin-left: auto; /* Отталкивает элемент максимально вправо */
                display: flex;
                align-items: center;
                gap: 10px;
                padding-left: 15px; /* Небольшой отступ от вкладок */
            }

            /* Стили для самой кнопки */
            .as-download-button {
                background-color: #007bff;
                color: white;
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9em;
                transition: background-color 0.2s;
                white-space: nowrap; /* Предотвращаем перенос текста */
            }
            .as-download-button:hover {
                background-color: #0056b3;
            }
            .as-download-message {
                color: #28a745;
                font-weight: bold;
                font-size: 0.8em;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
    }

    // Функция для скачивания статистики вклада
    function downloadContributionStats() {
        const userItems = document.querySelectorAll('.club-boost__top-item');
        if (userItems.length === 0) {
            alert('Не удалось найти данные о вкладе пользователей на этой странице.');
            return;
        }

        const data = [];
        // Добавляем заголовки таблицы
        const headers = ['Позиция', 'Имя пользователя', 'Вклад (карты)'];
        data.push(headers);

        userItems.forEach(item => {
            const position = item.querySelector('.club-boost__top-position')?.textContent.trim() || '';
            const name = item.querySelector('.club-boost__top-name')?.textContent.trim() || '';
            const contribution = item.querySelector('.club-boost__top-contribution')?.textContent.trim() || '';
            data.push([position, name, contribution]);
        });

        // **ИЗМЕНЕННЫЙ БЛОК КОДА**
        // Теперь мы не вычисляем ширину столбцов и не используем padEnd,
        // а просто объединяем элементы каждой строки одним пробелом.
        const formattedData = data.map(row => {
            // Для каждой строки объединяем элементы с одним пробелом
            return row.join(' ');
        }).join('\n');
        // **КОНЕЦ ИЗМЕНЕННОГО БЛОКА КОДА**

        if (formattedData) {
            const blob = new Blob([formattedData], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;

            // Определяем активный фильтр
            let filterName = 'Все'; // По умолчанию
            const activeTab = document.querySelector('.tabs__nav .tabs__item--active');
            if (activeTab) {
                const tabText = activeTab.textContent.trim();
                if (['День', 'Неделя', 'Месяц'].includes(tabText)) {
                    filterName = tabText;
                }
            } else {
                // Если нет активного --active класса, попробуем по URL
                const urlParams = new URLSearchParams(window.location.search);
                const interval = urlParams.get('interval');
                if (interval === 'week') filterName = 'Неделя';
                else if (interval === 'month') filterName = 'Месяц';
                else if (interval === 'all') filterName = 'Все';
                else filterName = 'День'; // По умолчанию, если нет interval параметра
            }

            // Формируем имя файла с учетом фильтра и даты
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const filename = `animestars_boost_stats_${filterName}_${year}-${month}-${day}.txt`;

            a.download = filename;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const messageEl = document.getElementById('as-download-message'); // Обновил ID
            if (messageEl) {
                messageEl.textContent = 'Файл скачан!';
                setTimeout(() => messageEl.textContent = '', 3000);
            }
        }
    }

    // Главная функция для инициализации UI
    function initUI() {
        const tabsNav = document.querySelector('.tabs__nav');

        if (!tabsNav) {
            return;
        }

        // Проверяем, не была ли кнопка уже добавлена
        if (document.getElementById('as-download-button-wrapper')) { // Обновил ID
            return;
        }

        const buttonWrapper = document.createElement('div');
        buttonWrapper.id = 'as-download-button-wrapper';
        buttonWrapper.classList.add('as-download-button-wrapper');
        buttonWrapper.innerHTML = `
            <button id="as-download-club-stats-button" class="as-download-button">Скачать статистику вклада</button>
            <span id="as-download-message" class="as-download-message"></span>
        `;

        // Вставляем контейнер с кнопкой в конец tabs__nav
        tabsNav.appendChild(buttonWrapper);

        // Добавляем слушатель события
        document.getElementById('as-download-club-stats-button')?.addEventListener('click', downloadContributionStats);
    }

    // Запускаем скрипт после загрузки DOM
    addStyles();
    initUI();

    // Используем MutationObserver для динамически загружаемого контента,
    // если tabs__nav появляется не сразу при загрузке страницы.
    const observer = new MutationObserver((mutationsList, observer) => {
        const tabsNav = document.querySelector('.tabs__nav');
        const buttonExists = document.getElementById('as-download-button-wrapper');

        // Если tabs__nav появился, а кнопка еще не добавлена
        if (tabsNav && !buttonExists) {
            initUI();
        }
    });

    const mainContentArea = document.querySelector('.page__inner-content') || document.body;
    observer.observe(mainContentArea, { childList: true, subtree: true });

})();