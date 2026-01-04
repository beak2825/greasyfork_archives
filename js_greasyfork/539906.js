// ==UserScript==
// @name         Manga Scroll Viewer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Позволяет просматривать мангу в режиме "рулона" на сайтах hentaichan с динамической настройкой ширины и отступов
// @author       You
// @match        https://y.hentaichan.live/online/*.html*
// @match        https://x3.h-chan.me/online/*.html*
// @match        https://xxl.hentaichan.live/online/*.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539906/Manga%20Scroll%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/539906/Manga%20Scroll%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для извлечения массива ссылок на изображения
    function getImageUrls() {
        try {
            if (window.data && window.data.fullimg) {
                return window.data.fullimg || [];
            }
        } catch (e) {
            console.error('Ошибка при доступе к данным:', e);
        }
        return [];
    }

    // Функция для создания плавающего меню с настройками и кнопкой
    function createFloatingMenu(scrollContainerRef) {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.bottom = '20px';
        menu.style.right = '20px';
        menu.style.zIndex = '1000';
        menu.style.backgroundColor = '#f9f9f9';
        menu.style.padding = '10px';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '5px';

        const widthLabel = document.createElement('label');
        widthLabel.textContent = 'Ширина контейнера (%): ';
        widthLabel.style.display = 'block';
        widthLabel.style.marginBottom = '5px';
        const widthInput = document.createElement('input');
        widthInput.type = 'range';
        widthInput.value = 50;
        widthInput.min = 10;
        widthInput.max = 100;
        widthInput.style.width = '100%';
        widthLabel.appendChild(widthInput);

        const marginLabel = document.createElement('label');
        marginLabel.textContent = 'Отступ между изображениями (px): ';
        marginLabel.style.display = 'block';
        marginLabel.style.marginBottom = '10px';
        const marginInput = document.createElement('input');
        marginInput.type = 'range';
        marginInput.value = 10;
        marginInput.min = 0;
        marginInput.max = 50;
        marginInput.style.width = '100%';
        marginLabel.appendChild(marginInput);

        const button = document.createElement('button');
        button.textContent = 'Изменить режим чтения';
        button.style.padding = '8px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.width = '100%';

        menu.appendChild(widthLabel);
        menu.appendChild(marginLabel);
        menu.appendChild(button);

        document.body.appendChild(menu);

        // Динамическое обновление ширины контейнера
        widthInput.addEventListener('input', () => {
            if (scrollContainerRef.container) {
                scrollContainerRef.container.style.width = `${widthInput.value}%`;
            }
        });

        // Динамическое обновление отступов между изображениями
        marginInput.addEventListener('input', () => {
            if (scrollContainerRef.container) {
                const images = scrollContainerRef.container.querySelectorAll('img');
                images.forEach(img => {
                    img.style.marginBottom = `${marginInput.value}px`;
                });
            }
        });

        return { button, widthInput, marginInput };
    }

    // Функция для загрузки всех страниц
    function loadAllPages(button, widthInput, marginInput, scrollContainerRef) {
        const imageUrls = getImageUrls();
        if (imageUrls.length === 0) {
            alert('Не удалось найти ссылки на изображения. Убедитесь, что страница полностью загружена, и JavaScript включен.');
            return;
        }

        // Очистить текущий контейнер с изображением
        const imageContainer = document.getElementById('image');
        if (imageContainer) {
            imageContainer.innerHTML = '';
        }

        // Удалить предыдущий контейнер, если он существует
        if (scrollContainerRef.container) {
            scrollContainerRef.container.remove();
        }

        // Создать новый контейнер для всех изображений
        const scrollContainer = document.createElement('div');
        scrollContainer.style.width = `${widthInput.value}%`;
        scrollContainer.style.margin = '0 auto';
        scrollContainer.style.padding = '10px';
        document.body.appendChild(scrollContainer);
        scrollContainerRef.container = scrollContainer;

        // Изменить состояние кнопки
        button.textContent = `Загружается 0 из ${imageUrls.length} страниц...`;
        button.style.backgroundColor = '#f44336';
        button.disabled = true;

        let loadedImages = 0;

        // Функция для добавления изображения с задержкой
        function addImage(index) {
            if (index >= imageUrls.length) {
                button.textContent = 'Загрузить заново';
                button.style.backgroundColor = '#4CAF50';
                button.disabled = false;
                return;
            }

            const img = document.createElement('img');
            img.src = imageUrls[index];
            img.style.width = '100%';
            img.style.marginBottom = `${marginInput.value}px`;
            img.style.display = 'block';
            img.onload = () => {
                loadedImages++;
                button.textContent = `Загружается ${loadedImages} из ${imageUrls.length} страниц...`;
            };
            img.onerror = () => {
                loadedImages++;
                button.textContent = `Загружается ${loadedImages} из ${imageUrls.length} страниц...`;
                console.warn(`Ошибка загрузки изображения: ${imageUrls[index]}`);
            };
            scrollContainer.appendChild(img);

            setTimeout(() => addImage(index + 1), 500); // Задержка 500 мс
        }

        addImage(0);
    }

    // Инициализация
    const scrollContainerRef = { container: null };
    const { button, widthInput, marginInput } = createFloatingMenu(scrollContainerRef);
    button.addEventListener('click', () => loadAllPages(button, widthInput, marginInput, scrollContainerRef));
})();