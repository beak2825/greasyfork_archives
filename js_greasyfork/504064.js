// ==UserScript==
// @name         nhentai Download
// @version      1.5
// @description  Download images from nhentai gallery as a zip archive
// @match        https://nhentai.net/g/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/504064/nhentai%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/504064/nhentai%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создание кнопки "Download Fetch"
    const buttonsContainer = document.querySelector('.buttons');
    const fetchButton = document.createElement('button');
    fetchButton.id = 'download-fetch';
    fetchButton.className = 'btn btn-secondary';
    fetchButton.innerHTML = '<i class="fa fa-download"></i> Download Fetch';
    buttonsContainer.appendChild(fetchButton);

    // Создаем элемент для отображения статуса загрузки
    const statusContainer = document.createElement('div');
    statusContainer.style.marginTop = '10px';
    statusContainer.style.fontSize = '14px';
    statusContainer.style.color = '#666';
    buttonsContainer.appendChild(statusContainer);

    // Функция для задержки между запросами
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Функция для получения ссылок на изображения с подстраниц с обработкой ошибок
    async function getImageUrls() {
        const imageUrls = [];
        const pageLinks = document.querySelectorAll('.gallerythumb');
        const retryDelay = 2000; // Задержка перед повтором запроса в случае ошибки (5 секунд)
        const delayBetweenRequests = 200; // Задержка между запросами (1 секунда)

        statusContainer.textContent = `Found ${pageLinks.length} pages. Fetching images...`;

        for (let i = 0; i < pageLinks.length; i++) {
            const link = pageLinks[i];
            const pageUrl = link.href;

            statusContainer.textContent = `Processing page ${i + 1} of ${pageLinks.length}`;

            let success = false;
            let attempts = 0;

            while (!success && attempts < 3) { // Пытаемся получить изображение, максимум 3 попытки
                attempts++;
                try {
                    const response = await fetch(pageUrl);
                    if (response.status === 429) {
                        statusContainer.textContent = `Too Many Requests. Waiting for ${retryDelay / 1000} seconds...`;
                        await delay(retryDelay);
                        continue;
                    }

                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const imgElement = doc.querySelector('#image-container img');
                    if (imgElement) {
                        const imageUrl = imgElement.src;
                        imageUrls.push(imageUrl);
                        success = true;
                    } else {
                        console.error(`Image not found on page: ${pageUrl}`);
                        success = true; // Прекращаем попытки, так как элемент не найден
                    }
                } catch (error) {
                    console.error(`Failed to fetch page: ${pageUrl}. Attempt ${attempts} of 3`, error);
                    if (attempts >= 3) {
                        statusContainer.textContent = `Failed to fetch after 3 attempts. Skipping page ${i + 1}`;
                    } else {
                        statusContainer.textContent = `Error fetching page ${i + 1}. Retrying in ${retryDelay / 1000} seconds...`;
                        await delay(retryDelay);
                    }
                }
            }

            // Задержка перед следующим запросом
            if (success) {
                await delay(delayBetweenRequests);
            }
        }

        statusContainer.textContent = `Image URLs fetched successfully!`;

        return imageUrls;
    }

    // Функция для загрузки изображения с использованием GM_xmlhttpRequest
    function downloadImageWithGM(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`Failed to download image: ${url}`));
                    }
                },
                onerror: function() {
                    reject(new Error(`Failed to download image: ${url}`));
                }
            });
        });
    }

    // Функция для скачивания изображений и создания архива
    async function downloadImages() {
        const imageUrls = await getImageUrls();
        if (imageUrls.length === 0) {
            statusContainer.textContent = 'No images found. Exiting download.';
            return;
        }

        const zip = new JSZip();
        const errors = [];
        const titleElement = document.querySelector('h1.title .pretty');
        let title = titleElement.textContent.split('|')[0].trim();
        let count = 1;

        statusContainer.textContent = 'Starting download...';

        for (let imageUrl of imageUrls) {
            try {
                const blob = await downloadImageWithGM(imageUrl);
                const fileName = `${count} - ${imageUrl.split('/').pop()}`;
                zip.file(fileName, blob);

                statusContainer.textContent = `Downloaded ${count} of ${imageUrls.length} images`;
                count++;
            } catch (error) {
                console.error(`Failed to download image: ${imageUrl}`, error);
                errors.push(`Image URL: ${imageUrl}\nError: ${error.message}`);
            }
        }

        // Добавление логов ошибок в архив
        errors.forEach((error, index) => {
            zip.file(`log ${index + 1}.txt`, error);
        });

        zip.generateAsync({ type: 'blob' }).then(function(content) {
            saveAs(content, `${title}.zip`);
            statusContainer.textContent = 'Download completed!';
        }).catch(error => {
            console.error('Failed to generate zip:', error);
            statusContainer.textContent = 'Failed to generate zip. Check console for details.';
        });
    }

    // Обработчик нажатия на кнопку
    fetchButton.addEventListener('click', function() {
        statusContainer.textContent = 'Starting the process...';
        downloadImages().catch(error => {
            console.error('Error during download:', error);
            statusContainer.textContent = 'Error during download. Check console for details.';
        });
    });
})();
