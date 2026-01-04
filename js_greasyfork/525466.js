// ==UserScript==
// @name         Weloma Download
// @name:en      Weloma Download
// @namespace    https://github.com/xxrxtnxxov
// @version      2.4.1
// @description  Добавляет кнопку скачивания рядом с каждой главой на сайте weloma.art
// @description:en  Allows you to download manga chapters in ZIP format from weloma.art.
// @author       antiQuarianN
// @match        https://weloma.art/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525466/Weloma%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/525466/Weloma%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(window, 'location', {
        set: () => console.warn('Попытка перенаправления заблокирована!')
    });
    window.open = () => console.warn('Попытка открытия нового окна заблокирована!');

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && /disable-devtool/.test(node.src)) {
                    node.remove();
                    console.warn('MEH');
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('contextmenu', e => e.stopPropagation(), true);
    window.addEventListener('keydown', e => e.stopPropagation(), true);

    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, time) {
        if (time < 1000) return originalSetInterval(callback, 1000);
        return originalSetInterval(callback, time);
    };

    function addDownloadButton() {
        const chapters = document.querySelectorAll('.list-chapters.at-series a');
        chapters.forEach(chapterLink => {
            const liElement = chapterLink.querySelector('li');
            const chapterNameElement = liElement.querySelector('.chapter-name.text-truncate');
            const chapterTimeElement = liElement.querySelector('.chapter-time');

            const mangaTitleElement = document.querySelector('h3[data-heading-tag="H3"]');
            const mangaTitle = mangaTitleElement ? mangaTitleElement.textContent.trim() : "Unknown Manga";

            const rowContainer = document.createElement('div');
            rowContainer.style.display = 'flex';
            rowContainer.style.alignItems = 'center';
            rowContainer.style.width = '100%';

            const downloadButton = document.createElement('button');
            downloadButton.style.border = 'none';
            downloadButton.style.background = 'none';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.marginRight = '10px';
            downloadButton.innerHTML = '<img src="https://raw.githubusercontent.com/xxrxtnxxov/weloma-download/refs/heads/main/dload.png" width="16" height="16" />';

            const progressSpan = document.createElement('span');
            progressSpan.style.marginRight = '10px';
            progressSpan.style.fontSize = '12px';
            progressSpan.style.color = '#aaa';
            progressSpan.style.display = 'none';

            const loadingImage = document.createElement('img');
            loadingImage.src = 'https://raw.githubusercontent.com/xxrxtnxxov/weloma-download/refs/heads/main/load.gif';
            loadingImage.style.width = '16px';
            loadingImage.style.height = '16px';
            loadingImage.style.display = 'none';

            const textContainer = document.createElement('div');
            textContainer.style.display = 'flex';
            textContainer.style.flexDirection = 'column';
            textContainer.style.flex = '1';
            textContainer.style.marginLeft = '5px';
            textContainer.appendChild(chapterNameElement);
            textContainer.appendChild(chapterTimeElement);

            rowContainer.appendChild(downloadButton);
            rowContainer.appendChild(progressSpan);
            rowContainer.appendChild(loadingImage);
            rowContainer.appendChild(textContainer);

            liElement.innerHTML = '';
            liElement.appendChild(rowContainer);

            downloadButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const chapterUrl = chapterLink.href;
                const chapterName = chapterNameElement.textContent.trim();
                const finalFileName = `${mangaTitle} - ${chapterName}`.replace(/[<>:"/\\|?*]/g, '');

                downloadButton.style.display = 'none';
                progressSpan.style.display = 'inline';
                progressSpan.textContent = '0/?';

                await downloadChapter(chapterUrl, finalFileName, progressSpan, downloadButton, loadingImage);
            });
        });
    }

    async function downloadChapter(url, finalFileName, progressSpan, downloadButton, loadingImage) {
        const response = await fetch(url);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const images = doc.querySelectorAll('.chapter-content img.chapter-img');
        const imageUrls = Array.from(images).map(img => img.getAttribute('data-src') || img.getAttribute('data-srcset') || (img.getAttribute('data-img') && atob(img.getAttribute('data-img')))).filter(Boolean);

        progressSpan.textContent = `0/${imageUrls.length}`;
        const zip = new JSZip();
        const chapterFolder = zip.folder(finalFileName);
        const imageBlobs = await loadImages(imageUrls, progressSpan, loadingImage);

        imageBlobs.forEach((blob, index) => {
            const fileName = `00${index + 1}`.slice(-3) + '.jpg';
            chapterFolder.file(fileName, blob);
        });

        progressSpan.style.display = 'none';
        loadingImage.style.display = 'inline';

        const content = await zip.generateAsync({type: 'blob'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${finalFileName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            loadingImage.style.display = 'none';
            downloadButton.style.display = 'inline';
        }, 1000);
    }

    function loadImages(imageUrls, progressSpan, loadingImage) {
        return new Promise((resolve, reject) => {
            const imageBlobs = [];
            let loadedCount = 0;

            imageUrls.forEach((imageUrl, index) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            imageBlobs[index] = response.response;
                            loadedCount++;
                            updateProgress(loadedCount, imageUrls.length, progressSpan, loadingImage);
                            if (loadedCount === imageUrls.length) resolve(imageBlobs);
                        } else reject(new Error(`Ошибка загрузки изображения: ${response.status}`));
                    },
                    onerror: (error) => reject(new Error(`Ошибка загрузки: ${error}`))
                });
            });
        });
    }

    function updateProgress(loadedCount, total, progressSpan, loadingImage) {
        progressSpan.textContent = `${loadedCount}/${total}`;
        console.log(`Скачивание: ${loadedCount}/${total}`);

        if (loadedCount === total) {
            progressSpan.style.display = 'none';
            loadingImage.style.display = 'inline';
        }
    }

    window.addEventListener('load', addDownloadButton);
})();