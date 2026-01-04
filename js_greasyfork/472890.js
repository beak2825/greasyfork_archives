// ==UserScript==
// @name         Remini Image Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically show styled download button for images on Remini AI page
// @author       InfiniteInsight
// @match        https://app.remini.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472890/Remini%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/472890/Remini%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания стилизованной кнопки "Скачать"
    function createDownloadButton(image) {
        const downloadButton = document.createElement('button');
        downloadButton.innerText = 'Скачать';
        downloadButton.style.position = 'fixed';
        downloadButton.style.right = '10px';
        downloadButton.style.top = '50%';
        downloadButton.style.transform = 'translateY(-50%)';
        downloadButton.style.padding = '10px';
        downloadButton.style.backgroundColor = '#007bff';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';

        downloadButton.addEventListener('click', () => {
            // Получаем URL картинки и создаем ссылку для скачивания
            const imageURL = image.getAttribute('src');
            const filename = 'image.jpg'; // Задайте имя файла, которое вы хотите использовать

            fetch(imageURL)
                .then(response => response.blob())
                .then(blob => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                });
        });

        return downloadButton;
    }

    // Функция для создания стилизованной кнопки "Удалить водяной знак"
    function createWatermarkRemoverButton() {
        const watermarkRemoverButton = document.createElement('button');
        watermarkRemoverButton.innerText = 'Удалить водяной знак';
        watermarkRemoverButton.style.position = 'fixed';
        watermarkRemoverButton.style.right = '10px';
        watermarkRemoverButton.style.top = 'calc(50% + 60px)'; // Немного ниже кнопки "Скачать"
        watermarkRemoverButton.style.transform = 'translateY(-50%)';
        watermarkRemoverButton.style.padding = '10px';
        watermarkRemoverButton.style.backgroundColor = '#e74c3c';
        watermarkRemoverButton.style.color = 'white';
        watermarkRemoverButton.style.border = 'none';
        watermarkRemoverButton.style.borderRadius = '5px';
        watermarkRemoverButton.style.cursor = 'pointer';

        watermarkRemoverButton.addEventListener('click', () => {
            window.open('https://www.watermarkremover.io/ru/upload', '_blank');
        });

        return watermarkRemoverButton;
    }

    // Функция для обновления кнопок для конкретной картинки
    function updateButtonsForImage(image) {
        const downloadButtonId = image.getAttribute('src').split('/').pop().split('.')[0];
        const downloadButton = createDownloadButton(image);
        downloadButton.id = downloadButtonId;

        const watermarkRemoverButtonId = downloadButtonId + '-wmremove';
        const watermarkRemoverButton = createWatermarkRemoverButton();
        watermarkRemoverButton.id = watermarkRemoverButtonId;

        const existingDownloadButton = document.getElementById(downloadButtonId);
        if (existingDownloadButton) {
            existingDownloadButton.replaceWith(downloadButton);
        } else {
            document.body.appendChild(downloadButton);
        }

        const existingWatermarkRemoverButton = document.getElementById(watermarkRemoverButtonId);
        if (existingWatermarkRemoverButton) {
            existingWatermarkRemoverButton.replaceWith(watermarkRemoverButton);
        } else {
            document.body.appendChild(watermarkRemoverButton);
        }
    }

    // Проверяем каждую секунду наличие новых картинок и обновляем кнопки
    setInterval(() => {
        const images = document.querySelectorAll('img[src^="https://storage.googleapis.com/bsp-remini-image-out-web-us-central1-autodelete/"]');
        images.forEach(updateButtonsForImage);
    }, 1000);
})();
