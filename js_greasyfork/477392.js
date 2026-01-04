// ==UserScript==
// @name         ImagePasteSaver
// @namespace    https://wi33y.ru/
// @version      1.1.0
// @description  Сохранение картинок в всплывающем окне, для быстрой вставки.
// @author       Wi33y
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477392/ImagePasteSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/477392/ImagePasteSaver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для окна
    GM_addStyle(`
        #myPopup {
            display: none;
            position: fixed;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            width: 470px; /* Фиксированная ширина */
            background-color: #222;
            border: 1px solid #ccc;
            max-height: 450px;
            overflow: auto;
            padding: 20px;
            z-index: 9999;
        }

        #myPopup .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }

        .image-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 10px;
        }

        .image-container img {
            max-width: 100px;
            max-height: 100px;
            margin-right: 10px;
        }

        .btn-container {
            display: flex;
            flex-direction: column;
        }

        .insert-button, .upload-button, .delete-button {
            margin-top: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            padding: 7px 14px;
            cursor: pointer;
        }

        .insert-button:hover, .upload-button:hover, .delete-button:hover {
            background-color: #0056b3;
        }

        .open-popup-button {
            position: fixed;
            top: 20%;
            right: 20px;
            background-color: #007BFF;
            color: #fff;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
        }

        .open-popup-button:hover {
            background-color: #0056b3;
        }
    `);

    // Создание попита
    const popup = document.createElement('div');
    popup.id = 'myPopup';

    // Кнопка "Закрыть" (крестик)
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // В попит крестик вставляем
    popup.appendChild(closeButton);

    // Сохраняем URL изображений
    let imageUrls = JSON.parse(localStorage.getItem('imageUrls')) || [];

    // Создаем контейер для изображения
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    // Кнопки "Вставить" и "Удалить"
    const insertButton = document.createElement('button');
    insertButton.textContent = 'Вставить';
    insertButton.className = 'insert-button';
    insertButton.style.display = 'none';
    insertButton.addEventListener('click', () => {
        const imageUrl = imgElement.src;
        if (imageUrl) {
            insertImageLink(imageUrl);
        }
    });

    // Элементы в попите
    imageContainer.appendChild(insertButton);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';

    // url поле
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'URL изображения';

    // Кнопка "Загрузить"
    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Загрузить';
    uploadButton.className = 'upload-button';
    uploadButton.addEventListener('click', () => {
        const imageUrl = urlInput.value;
        if (imageUrl) {
            imageUrls.push(imageUrl);
            localStorage.setItem('imageUrls', JSON.stringify(imageUrls)); // Сохраняем в localStorage
            displayImages();
            urlInput.value = '';
        }
    });

    btnContainer.appendChild(urlInput);
    btnContainer.appendChild(uploadButton);

    popup.appendChild(btnContainer);
    popup.appendChild(imageContainer);

    let isPopupOpen = false; // Флаг для отслеживания состояния окна

    // Создаем кнопку "Открыть/Закрыть окно" с классом "open-popup-button"
    const openPopupButton = document.createElement('button');
    openPopupButton.textContent = 'Открыть';
    openPopupButton.className = 'open-popup-button';

    openPopupButton.addEventListener('click', () => {
        if (!isPopupOpen) {
            displayImages(); // Отображаем изображения при открытии pop-up окна
            popup.style.display = 'block';
            openPopupButton.textContent = 'Закрыть';
        } else {
            popup.style.display = 'none';
            openPopupButton.textContent = 'Открыть';
        }
        isPopupOpen = !isPopupOpen;
    });

    document.body.appendChild(openPopupButton);

    // Отображаем изображения при открытии pop-up окна
    displayImages();

    document.body.appendChild(popup);

    function displayImages() {
        const imageUrlList = document.createElement('ul');
        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${imageUrl}" alt="Изображение" class="hover-zoom-image" data-index="${i}">
                <button class="insert-button" data-index="${i}">Вставить</button>
                <button class="delete-button" data-index="${i}">Удалить</button>
            `;
            imageUrlList.appendChild(listItem);
        }

        insertButton.style.display = imageUrls.length > 0 ? 'block' : 'none';
        imageContainer.innerHTML = '';
        imageContainer.appendChild(imageUrlList);

        const deleteButtons = imageUrlList.querySelectorAll('.delete-button');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (index !== null) {
                    imageUrls.splice(index, 1);
                    localStorage.setItem('imageUrls', JSON.stringify(imageUrls)); // Обновляем localStorage
                    displayImages();
                }
            });
        });

        const insertButtons = imageUrlList.querySelectorAll('.insert-button');
        insertButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (index !== null) {
                    const imageUrl = imageUrls[index];
                    if (imageUrl) {
                        insertImageLink(imageUrl);
                    }
                }
            });
        });

        const hoverZoomImages = imageUrlList.querySelectorAll('.hover-zoom-image');
        hoverZoomImages.forEach((image) => {
            image.addEventListener('mouseenter', () => {
                toggleImageSize(image, true); // Увеличить размер изображения
            });
            image.addEventListener('mouseleave', () => {
                toggleImageSize(image, false); // Вернуть размер изображения к обычному
            });
        });
    }

    function toggleImageSize(image, zoomIn) {
        if (zoomIn) {
            image.style.maxWidth = '420px';
            image.style.maxHeight = '180px';
        } else {
            image.style.maxWidth = '100px'; // Вернуть обычный размер
            image.style.maxHeight = '100px';
        }
    }

    // Функция для вставки изображения как ссылки в текстовое поле
    function insertImageLink(link) {
        const textField = document.querySelector('div.fr-element');
        if (textField) {
            const formattedLink = `[img]${link}[/img]`; // Убираем пробелы перед и после ссылки
            textField.innerHTML += formattedLink;
        }
    }
})();
