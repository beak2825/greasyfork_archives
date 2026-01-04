// ==UserScript==
// @name         MidJourney Image Downloader
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Добавить кнопки для скачивания изображений на сайте MidJourney
// @author       You
// @match        https://www.midjourney.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546405/MidJourney%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/546405/MidJourney%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавление стилей для значков скачивания
    const style = `
    .download-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
    }
    .download-badge:hover {
        background-color: rgba(0, 0, 0, 0.9);
    }
    `;
    GM_addStyle(style);

    // Функция для генерации ссылки на оригинальное изображение
    const getImageUrl = (src) => {
        let baseUrl = src.split("?")[0]; // Убираем параметры запроса
        baseUrl = baseUrl.replace("_640_N", ""); // Убираем _640_N
        return baseUrl.replace(".webp", ".png"); // Заменяем .webp на .png
    };

    // Функция для создания значка скачивания
    const addDownloadBadge = (imgElement) => {
        if (imgElement.dataset.downloadBadge) return; // Проверка, чтобы не добавлять несколько раз

        const badge = document.createElement("div");
        badge.className = "download-badge";
        badge.innerText = "↓ Скачайте";

        // Генерируем ссылку для скачивания
        const imgUrl = getImageUrl(imgElement.src);

        badge.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Используем GM_download для скачивания изображения
            GM_download({
                url: imgUrl, // URL изображения
                name: imgUrl.split("/").pop(), // Название файла будет последней частью URL
                saveAs: true // Открывает диалоговое окно для выбора места сохранения
            });
        });

        imgElement.parentElement.style.position = 'relative'; // Чтобы значок был внутри контейнера
        imgElement.parentElement.appendChild(badge); // Добавляем значок на картинку
        imgElement.dataset.downloadBadge = true; // Помечаем изображение как с кнопкой скачивания
    };

    // Функция для добавления значков на все изображения на странице
    const scanImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.includes("cdn.midjourney.com")) {
                addDownloadBadge(img);
            }
        });
    };

    // Инициализация сканирования изображений при загрузке страницы
    window.addEventListener('load', () => {
        scanImages();
    });

    // Наблюдатель для динамической загрузки изображений
    const observer = new MutationObserver(scanImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();
