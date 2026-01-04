// ==UserScript==
// @name         Pikabu Media Downloader (stable)
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Add manual download buttons for images and videos in Pikabu story posts (individual or ZIP), using canvas to bypass CORS
// @author       stalkermiha
// @match        https://pikabu.ru/*
// @grant        none
// @license      MIT
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/546629/Pikabu%20Media%20Downloader%20%28stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546629/Pikabu%20Media%20Downloader%20%28stable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script loaded at ' + new Date().toLocaleTimeString());

    // Общий метод для создания кнопок
    function createButton(text, color, clickHandler, wrapper) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `${text.toLowerCase().replace(/ /g, '-')}-button`;
        button.style.cssText = `margin: 5px auto; padding: 10px 20px; background-color: ${color}; color: white; border: none; border-radius: 5px; cursor: pointer;`;
        button.addEventListener('click', () => clickHandler(wrapper));
        return button;
    }

    // Функция для скачивания отдельных изображений
    function downloadImages(wrapper) {
        console.log('Starting individual image download process for wrapper...');
        const images = wrapper.querySelectorAll('.story-image__image');
        if (!images.length) {
            console.log('No images found in this wrapper!');
            return;
        }

        console.log(`Found ${images.length} images in this wrapper.`);
        let delay = 0;
        images.forEach((img, index) => {
            if (img.complete && img.naturalHeight > 0) {
                setTimeout(() => {
                    console.log(`Downloading image ${img.src}`);
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(blob => {
                        if (blob) {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `image_${index + 1}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            console.log(`Failed to create blob for image ${img.src}`);
                        }
                    }, 'image/png');
                }, delay);
                delay += 500;
            } else {
                console.log(`Skipping invalid image ${img.src}`);
            }
        });
    }

    // Функция для асинхронного скачивания архива изображений
    function downloadImagesAsZip(wrapper) {
        console.log('Starting ZIP download process for images in wrapper...');
        const images = wrapper.querySelectorAll('.story-image__image');
        if (!images.length) {
            console.log('No images found in this wrapper!');
            return;
        }

        console.log(`Found ${images.length} images in this wrapper for ZIP.`);
        const JSZip = window.JSZip;
        const zip = new JSZip();
        let processedCount = 0;

        images.forEach((img, index) => {
            if (img.complete && img.naturalHeight > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    if (blob) {
                        zip.file(`image_${index + 1}.png`, blob);
                        console.log(`Added image_${index + 1}.png to ZIP`);
                    } else {
                        console.log(`Failed to create blob for image ${img.src} in ZIP`);
                    }
                    processedCount++;
                    // Асинхронная генерация ZIP после обработки каждого изображения
                    if (processedCount === images.length) {
                        zip.generateAsync({ type: 'blob' }).then(content => {
                            console.log('ZIP generated, initiating download...');
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(content);
                            link.download = `pikabu_images_${Date.now()}.zip`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }).catch(err => console.error('Error generating ZIP:', err));
                    }
                }, 'image/png');
            } else {
                console.log(`Skipping invalid image ${img.src} for ZIP`);
                processedCount++;
                if (processedCount === images.length) {
                    zip.generateAsync({ type: 'blob' }).then(content => {
                        console.log('ZIP generated, initiating download...');
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = `pikabu_images_${Date.now()}.zip`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }).catch(err => console.error('Error generating ZIP:', err));
                }
            }
        });
    }

    // Функция для скачивания отдельных видео
    function downloadVideos(wrapper) {
        console.log('Starting individual video download process for wrapper...');
        const players = wrapper.querySelectorAll('.player');
        if (!players.length) {
            console.log('No videos found in this wrapper!');
            return;
        }

        console.log(`Found ${players.length} videos in this wrapper.`);
        let delay = 0;
        players.forEach((player, index) => {
            const webmUrl = player.getAttribute('data-webm');
            const av1Url = player.getAttribute('data-av1');
            const videoUrl = webmUrl || av1Url;
            if (videoUrl) {
                setTimeout(() => {
                    console.log(`Downloading video ${videoUrl}`);
                    fetch(videoUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `video_${index + 1}.${webmUrl ? 'webm' : 'mp4'}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        })
                        .catch(err => console.error(`Failed to download video ${videoUrl}:`, err));
                }, delay);
                delay += 1000;
            } else {
                console.log(`No downloadable video format found for player ${index + 1}`);
            }
        });
    }

    // Функция для скачивания архива видео
    function downloadVideosAsZip(wrapper) {
        console.log('Starting ZIP download process for videos in wrapper...');
        const players = wrapper.querySelectorAll('.player');
        if (!players.length) {
            console.log('No videos found in this wrapper!');
            return;
        }

        console.log(`Found ${players.length} videos in this wrapper for ZIP.`);
        const JSZip = window.JSZip;
        const zip = new JSZip();
        let processedCount = 0;

        players.forEach((player, index) => {
            const webmUrl = player.getAttribute('data-webm');
            const av1Url = player.getAttribute('data-av1');
            const videoUrl = webmUrl || av1Url;
            if (videoUrl) {
                fetch(videoUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        zip.file(`video_${index + 1}.${webmUrl ? 'webm' : 'mp4'}`, blob);
                        console.log(`Added video_${index + 1}.${webmUrl ? 'webm' : 'mp4'} to ZIP`);
                        processedCount++;
                        checkComplete();
                    })
                    .catch(err => {
                        console.error(`Failed to fetch video ${videoUrl}:`, err);
                        processedCount++;
                        checkComplete();
                    });
            } else {
                console.log(`No downloadable video format found for player ${index + 1}`);
                processedCount++;
                checkComplete();
            }
        });

        function checkComplete() {
            if (processedCount === players.length) {
                zip.generateAsync({ type: 'blob' }).then(content => {
                    console.log('ZIP generated, initiating download...');
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = `pikabu_videos_${Date.now()}.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).catch(err => console.error('Error generating ZIP:', err));
            }
        }
    }

    function addDownloadButtons(wrapper) {
        if (wrapper.dataset.buttonsAdded) return; // Пропускаем, если кнопки уже добавлены

        const images = wrapper.querySelectorAll('.story-image__image');
        const players = wrapper.querySelectorAll('.player');
        const lastBlock = wrapper.querySelector('.story-block:last-of-type');
        if (!lastBlock) {
            console.log('No last block found in wrapper!');
            return;
        }

        // Удаляем существующие кнопки, чтобы избежать дублирования
        const existingButtons = lastBlock.querySelectorAll('.download-button, .zip-button, .download-video-button, .zip-video-button');
        existingButtons.forEach(btn => btn.remove());

        console.log('Adding download buttons to wrapper...');

        // Кнопки для изображений, если есть
        if (images.length > 0) {
            const singleButton = createButton('Download Images', '#007bff', downloadImages, wrapper);
            const zipButton = createButton('Download Images as ZIP', '#28a745', downloadImagesAsZip, wrapper);
            lastBlock.appendChild(singleButton);
            lastBlock.appendChild(zipButton);
        }

        // Кнопки для видео, если есть
        if (players.length > 0) {
            const videoButton = createButton('Download Videos', '#dc3545', downloadVideos, wrapper);
            const zipVideoButton = createButton('Download Videos as ZIP', '#17a2b8', downloadVideosAsZip, wrapper);
            lastBlock.appendChild(videoButton);
            lastBlock.appendChild(zipVideoButton);
        }

        wrapper.dataset.buttonsAdded = 'true'; // Отмечаем, что кнопки добавлены
    }

    // Наблюдатель за появлением блоков контента
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const wrappers = document.querySelectorAll('.story__content-wrapper:not([data-buttons-added])');
                wrappers.forEach(wrapper => {
                    console.log('Detected new content wrapper, adding buttons...');
                    addDownloadButtons(wrapper);
                });
            }
        });
    });

    // Запуск скрипта сразу после загрузки зависимостей
    console.log('Loading dependencies...');
    const initialWrappers = document.querySelectorAll('.story__content-wrapper');
    initialWrappers.forEach(wrapper => addDownloadButtons(wrapper));
    observer.observe(document.body, { childList: true, subtree: true });

    const css = document.createElement('style');
    css.innerHTML = `
        .download-button:hover { background-color: #0056b3; }
        .zip-button:hover { background-color: #218838; }
        .download-video-button:hover { background-color: #c82333; }
        .zip-video-button:hover { background-color: #138496; }
    `;
    document.head.appendChild(css);
})();