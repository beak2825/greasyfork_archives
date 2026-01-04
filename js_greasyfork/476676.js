// ==UserScript==
// @name         Enable Custom BG LOLZ
// @namespace    Wi33y | https://zelenka.guru/p_gr/
// @version      1.7
// @description  Custom BG for LZT
// @match        https://zelenka.guru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476676/Enable%20Custom%20BG%20LOLZ.user.js
// @updateURL https://update.greasyfork.org/scripts/476676/Enable%20Custom%20BG%20LOLZ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для установки фонового изображения
    function setCustomBackgroundImage(imageUrl) {
        document.body.style.backgroundImage = `url(${imageUrl})`;
    }

    // Получаем URL сохраненного пользовательского фонового изображения
    const savedBackgroundImage = GM_getValue('customBackgroundImage');

    // Если есть сохраненное фоновое изображение, устанавливаем его
    if (savedBackgroundImage) {
        setCustomBackgroundImage(savedBackgroundImage);
    }

    // Создаем контейнер для элементов
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.justifyContent = 'flex-end'; // Размещаем элементы справа

    // Создаем чекбокс для скрытия/раскрытия элементов
    const hideCheckbox = document.createElement('input');
    hideCheckbox.type = 'checkbox';
    hideCheckbox.id = 'hideCustomBackgroundElements';
    hideCheckbox.checked = GM_getValue('hideCustomBackgroundElements'); // Загружаем состояние чекбокса из хранилища

    // Создаем текстовое поле "Введите URL изображения"
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Введите URL изображения';

    // кнопка "Загрузить по ссылке"
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Загрузить по ссылке';

    // Функция для скрытия элементов
    function hideElements() {
        urlInput.classList.add('hidden');
        loadButton.classList.add('hidden');
    }

    // Функция для отображения элементов
    function showElements() {
        urlInput.classList.remove('hidden');
        loadButton.classList.remove('hidden');
    }

    // Добавляем текстовое поле и кнопку в контейнер
    inputContainer.appendChild(hideCheckbox);
    inputContainer.appendChild(document.createTextNode('Скрыть элементы'));
    inputContainer.appendChild(urlInput);
    inputContainer.appendChild(loadButton);

    // Находим элемент <div class="breadBoxTop">
    const breadBoxTop = document.querySelector('.breadBoxTop');

    // Если элемент <div class="breadBoxTop"> найден, добавляем контейнер внутри него
    if (breadBoxTop) {
        breadBoxTop.appendChild(inputContainer);
    }

    // Обработчик события для сохранения состояния чекбокса при изменении его значения
    hideCheckbox.addEventListener('change', function() {
        GM_setValue('hideCustomBackgroundElements', this.checked); // Сохраняем состояние чекбокса в хранилище

        if (this.checked) {
            hideElements();
        } else {
            showElements();
        }
    });

    // Обработчик события для загрузки изображения по ссылке
    loadButton.addEventListener('click', function() {
        const imageUrl = urlInput.value.trim();
        if (imageUrl) {
            setCustomBackgroundImage(imageUrl);
            GM_setValue('customBackgroundImage', imageUrl);
        }
    });

    // видимость элементов в зависимости от состояния чекбокса при загрузке страницы
    if (hideCheckbox.checked) {
        hideElements();
    } else {
        showElements();
    }
})();
