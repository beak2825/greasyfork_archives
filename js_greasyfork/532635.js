// ==UserScript==
// @name         Bongacams Links Dropdown
// @version      1.18
// @description  Показывает выпадающий список ссылок при наведении на ник модели и копирует ник при клике
// @match        *://*.bongacams*.com/*
// @include      *://*.bongacams*.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1425459
// @downloadURL https://update.greasyfork.org/scripts/532635/Bongacams%20Links%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/532635/Bongacams%20Links%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Cтили
    GM_addStyle(`
        .model-links-dropdown {
            position: absolute;
            background: #2a2a2a;
            border-radius: 8px;
            padding: 10px 0;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            min-width: 170px;
        }

        .model-links-dropdown.show {
            opacity: 1;
            transform: translateY(0);
        }

        .model-links-row {
            display: flex;
            align-items: center;
            padding: 8px 15px 8px 15px;
            padding-right: 10px;
            color: #ffffff;
            text-decoration: none;
            transition: background 0.2s ease;
        }

        .model-links-row:hover {
            background: #3a3a3a;
        }

        .model-links-row a {
            color: #ffffff;
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .model-links-row img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
        }

        .model-links-row .old-link {
            margin-left: auto;
            padding-right: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            opacity: 1 !important;
            transition: transform 0.2s ease;
        }

        .model-links-row .old-link:hover {
            transform: scale(1.2);
        }

        .model-links-row .old-link svg {
            width: 20px;
            height: 20px;
        }

        .model-links-row .resource-name {
            flex: 1;
        }

        .ch_h_name {
            position: relative;
            cursor: pointer;
        }

        .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1001;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .copy-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    `);

    // Функция для получения ника из URL
    function getUrlNickname() {
        try {
            const path = window.location.pathname;
            const match = path.match(/^\/([^/]+)/);
            return match ? decodeURIComponent(match[1]).trim() : null;
        } catch (e) {
            return null;
        }
    }

    // Функция для обработки ника для CamWhores и Camclips
    function formatCamWhoresName(name) {
        try {
            return name.replace(/-/g, '--');
        } catch (e) {
            return name;
        }
    }

    // Функция для создания ссылок
    function createLinks(modelName) {
        return [
            {
                name: 'CamWhores',
                url: `https://www.camwhores.tv/search/${formatCamWhoresName(modelName)}/`,
                icon: 'https://www.camwhores.tv/favicon.ico'
            },
            {
                name: 'Livecamrips',
                url: `https://livecamrips.tv/search/${modelName}/1`,
                icon: 'https://livecamrips.tv/ico/favicon.ico'
            },
            {
                name: 'Privateshow',
                url: `https://privateshow.cam/model/${modelName}/`,
                icon: 'https://privateshow.cam/favicon.ico'
            },
            {
                name: 'CamGirlFinder',
                url: `https://camgirlfinder.net/models/bc/${modelName}#1`,
                icon: 'https://camgirlfinder.net/favicon.ico'
            },
            {
                name: 'Nobodyhome',
                url: `https://nobodyhome.tv/search.php?action=do_search&postthread=1&keywords=${modelName}`,
                icon: 'https://nobodyhome.tv/favicon.ico'
            },
            {
                name: 'Camclips',
                url: `https://www.camsclips.co/search/${formatCamWhoresName(modelName)}/`,
                icon: 'https://www.camsclips.co/favicon.ico'
            }
        ];
    }

    // Функция для создания ссылки [old]
    function createOldLink(modelName, resourceName) {
        try {
            switch (resourceName) {
                case 'CamWhores':
                    return `https://www.camwhores.tv/search/${formatCamWhoresName(modelName)}/`;
                case 'Livecamrips':
                    return `https://livecamrips.tv/search/${modelName}/1`;
                case 'Privateshow':
                    return `https://privateshow.cam/model/${modelName}/`;
                case 'CamGirlFinder':
                    return `https://camgirlfinder.net/models/bc/${modelName}#1`;
                case 'Nobodyhome':
                    return `https://nobodyhome.tv/search.php?action=do_search&postthread=1&keywords=${modelName}`;
                case 'Camclips':
                    return `https://www.camsclips.co/search/${formatCamWhoresName(modelName)}/`;
                default:
                    return '#';
            }
        } catch (e) {
            return '#';
        }
    }

    // Функция для показа уведомления о копировании
    function showCopyNotification(modelName) {
        try {
            const existingNotification = document.querySelector('.copy-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = `Ник "${modelName}" скопирован!`;

            document.body.appendChild(notification);

            requestAnimationFrame(() => {
                notification.classList.add('show');
            });

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        } catch (e) {}
    }

    // Функция для копирования в буфер обмена
    function copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text).then(() => {
                showCopyNotification(text);
            });
        } catch (e) {}
    }

    // Функция для создания и показа выпадающего списка
    function showDropdown(element, modelName) {
        try {
            // Удаляем существующий dropdown, если есть
            const existingDropdown = document.querySelector('.model-links-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
            }

            // Проверяем валидность modelName
            if (!modelName || typeof modelName !== 'string' || modelName.trim() === '') {
                return null;
            }

            // Получаем ник из URL
            const urlNickname = getUrlNickname();
            const isDifferentNickname = urlNickname && urlNickname.toLowerCase() !== modelName.toLowerCase();

            // Создаем новый dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'model-links-dropdown';

            // Создаем строки
            const links = createLinks(modelName);
            links.forEach(link => {
                const row = document.createElement('div');
                row.className = 'model-links-row';

                // Иконка ресурса
                const img = document.createElement('img');
                img.src = link.icon;
                img.alt = link.name;
                img.onerror = () => { img.src = ''; };

                // Название ресурса
                const nameSpan = document.createElement('span');
                nameSpan.className = 'resource-name';
                nameSpan.textContent = link.name;

                // Основная ссылка
                const mainLink = document.createElement('a');
                mainLink.href = link.url;
                mainLink.target = '_blank';
                mainLink.rel = 'noopener';
                mainLink.appendChild(img);
                mainLink.appendChild(nameSpan);

                row.appendChild(mainLink);

                // Кнопка [old], если ники различаются
                if (isDifferentNickname) {
                    const oldLink = document.createElement('a');
                    oldLink.className = 'old-link';
                    oldLink.href = createOldLink(urlNickname, link.name);
                    oldLink.target = '_blank';
                    oldLink.rel = 'noopener';

                    // Красный круг 20x20 с помощью SVG
                    const oldIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    oldIcon.setAttribute('viewBox', '0 0 20 20');
                    oldIcon.setAttribute('width', '20');
                    oldIcon.setAttribute('height', '20');
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', '10');
                    circle.setAttribute('cy', '10');
                    circle.setAttribute('r', '10');
                    circle.setAttribute('fill', 'red');
                    oldIcon.appendChild(circle);

                    oldLink.appendChild(oldIcon);

                    row.appendChild(oldLink);
                }

                dropdown.appendChild(row);
            });

            // Позиционируем dropdown по центру ника
            const rect = element.getBoundingClientRect();
            const dropdownWidth = 170;
            const leftOffset = rect.left + (rect.width - dropdownWidth) / 2;
            dropdown.style.left = `${leftOffset}px`;
            dropdown.style.top = `${rect.bottom + window.scrollY}px`;

            document.body.appendChild(dropdown);

            // Показываем с анимацией
            requestAnimationFrame(() => {
                dropdown.classList.add('show');
            });

            return dropdown;
        } catch (e) {
            return null;
        }
    }

    // Функция для скрытия выпадающего списка
    function hideDropdown(dropdown) {
        if (dropdown) {
            dropdown.classList.remove('show');
            setTimeout(() => {
                dropdown.remove();
            }, 300);
        }
    }

    // Функция для поиска элемента с именем модели
    function findModelNameElement() {
        // Пробуем найти элемент по основному селектору
        let element = document.querySelector('.ch_h_name');
        if (element) {
            return element;
        }

        // Альтернативные селекторы
        element = document.querySelector('.profile-name');
        if (element) {
            return element;
        }

        element = document.querySelector('.model-name');
        if (element) {
            return element;
        }

        element = document.querySelector('h1');
        if (element) {
            return element;
        }

        element = document.querySelector('h2');
        if (element) {
            return element;
        }

        return null;
    }

    // Основная функция
    function init() {
        try {
            // Проверяем, есть ли элемент с именем модели
            const nameElement = findModelNameElement();
            if (!nameElement) {
                return;
            }

            // Проверяем, не добавлены ли уже обработчики
            if (nameElement.dataset.dropdownAttached) {
                return;
            }

            nameElement.dataset.dropdownAttached = 'true';

            let dropdown = null;
            let hideTimeout = null;

            // Обработчик наведения на ник
            nameElement.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                const modelName = nameElement.textContent.trim();
                dropdown = showDropdown(nameElement, modelName);

                // Добавляем обработчики для dropdown
                if (dropdown) {
                    dropdown.addEventListener('mouseenter', () => {
                        clearTimeout(hideTimeout);
                    });

                    dropdown.addEventListener('mouseleave', () => {
                        hideTimeout = setTimeout(() => {
                            hideDropdown(dropdown);
                            dropdown = null;
                        }, 200);
                    });
                }
            });

            // Обработчик ухода курсора с ника
            nameElement.addEventListener('mouseleave', (e) => {
                if (dropdown) {
                    hideTimeout = setTimeout(() => {
                        if (!dropdown.contains(e.relatedTarget)) {
                            hideDropdown(dropdown);
                            dropdown = null;
                        }
                    }, 200);
                }
            });

            // Обработчик клика для копирования
            nameElement.addEventListener('click', (e) => {
                e.preventDefault();
                const modelName = nameElement.textContent.trim();
                copyToClipboard(modelName);
            });
        } catch (e) {}
    }

    // Запускаем скрипт с повторными попытками
    function startWithRetries() {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = 1000;

        const intervalId = setInterval(() => {
            attempts++;
            const nameElement = findModelNameElement();
            if (nameElement) {
                clearInterval(intervalId);
                init();
            }

            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
            }
        }, interval);
    }

    // Запускаем скрипт с небольшой задержкой
    setTimeout(() => {
        startWithRetries();

        // Отслеживаем изменения DOM с оптимизацией
        const observer = new MutationObserver((mutations, obs) => {
            try {
                const nameElement = findModelNameElement();
                if (nameElement) {
                    init();
                }
            } catch (e) {}
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);
})();