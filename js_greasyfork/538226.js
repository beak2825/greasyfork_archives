// ==UserScript==
// @name         shedevrum Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скачивает картинки и текстовые запросы Shedevrum.ai
// @license MIT
// @match        https://shedevrum.ai/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/538226/shedevrum%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/538226/shedevrum%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== КОНФИГУРАЦИЯ СЕЛЕКТОРОВ =====
    const SELECTORS = {
        // Промт и описание
        promptWithTitle: 'span.prompt[title], .prompt[title]',
        promptContainer: '.prompt',
        postTitle: '.stretch-promo',
        postDescription: '.stretch-quinary',
        alternativeDescription: '.whitespace-pre-wrap',

        // Изображения
        createPageImages: '.generate-form img',
        mainPostArea: 'article, .post',
        commentArea: '.comment, [class*="comment"]',
        adElements: 'a[href="/text-to-image/"], [class*="promo"], [class*="ad"], [class*="banner"]',

        // Навигация и UI
        postLinks: 'article a[href^="/post/"], a[href^="/post/"]',
        moreButton: 'button', // Будем фильтровать по тексту "Ещё"
        endIndicator: '.stretch-feed-end',
        promptTextarea: '#prompt',

        // Панели кнопок (могут изменяться)
        buttonPanels: [
            '.flex.gap-\\[\\.\\.8rem\\].nLDXHrna_.pt-\\[1\\.\\.4rem\\].md\\:pt-0',
            '.flex[class*="gap-"][class*="pt-"]',
            'article .absolute.z-\\[2\\].top-\\[1\\.2rem\\].right-\\[1\\.8rem\\]',
            'article .absolute.z-\\[2\\].top-\\[1\\.2rem\\].right-\\[1\\.2rem\\]',
            '.absolute.z-\\[2\\].top-\\[1\\.2rem\\].right-\\[1\\.8rem\\]',
            '.absolute.z-\\[2\\].top-\\[1\\.2rem\\].right-\\[1\\.2rem\\]',
            'article .absolute[class*="top-"][class*="right-"]',
            'article .relative .absolute'
        ],

        // Специальные селекторы для поста
        postImageContainer: 'article.bg-white .relative',
        postImageArea: 'article.bg-white .block.cursor-zoom-in',
        postRightColumn: '.basis-1\\/2.grow.min-w-0.flex.flex-col',
        postInfoBlock: '.bg-gray-100.rounded-\\[1\\.6rem\\]'
    };

    // ===== КОНСТАНТЫ =====
    const CONSTANTS = {
        imageHostnames: [
            'masterpiecer-images.s3.yandex.net', // картинки из создания
            'yastatic.net/naydex/shedevrum', // пожатые картинки
            'avatars.mds.yandex.net/get-shedevrum' // оригинальные картинки
        ],
        minImageSize: 200,
        requestDelay: 100,
        postDelay: 200,
        downloadDelay: 500,
        maxScrollAttempts: 100,
        maxLoadAttempts: 100,
        maxPosts: 1000
    };

    // ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
    let downloadMode = localStorage.getItem('shedevrum-download-mode') || 'zip';

    // ===== УТИЛИТЫ =====
    const Utils = {
        downloadFile(url, filename) {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        getTimestamp() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            return {
                folder: `${year}${month}${day}_${hours}${minutes}${seconds}`,
                date: `${year}${month}${day}`
            };
        },

        getOriginalFilename(url) {
            try {
                const urlParts = url.split('/');
                const filename = urlParts[urlParts.length - 1].split('?')[0];
                return filename.includes('.') ? filename : filename + '.jpg';
            } catch (error) {
                console.error('Ошибка при извлечении имени файла:', error);
                return 'image.jpg';
            }
        },

        getPageType() {
            if (document.querySelector(SELECTORS.promptTextarea)) {
                return 'create'; // /text-to-image/
            } else if (window.location.pathname.startsWith('/post/')) {
                return 'post'; // /post/[id]/
            } else if (window.location.pathname.startsWith('/profile/') ||
                       window.location.pathname === '/' ||
                       window.location.pathname.startsWith('/feed')) {
                return 'feed'; // /profile/[id]/, главная страница, или лента
            } else {
                return 'feed'; // По умолчанию считаем лентой
            }
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        isValidImage(img) {
            return img.src && CONSTANTS.imageHostnames.some(hostname =>
                img.src.includes(hostname)
            );
        },

        isImageTooSmall(img, minSize = CONSTANTS.minImageSize) {
            const rect = img.getBoundingClientRect();
            const width = parseInt(img.getAttribute('width')) || rect.width || 500;
            const height = parseInt(img.getAttribute('height')) || rect.height || 500;
            return width < minSize || height < minSize;
        },

        isAdOrAvatarImage(img) {
            return img.closest(SELECTORS.adElements) ||
                   img.closest(SELECTORS.commentArea);
        }
    };

    // ===== ПРОГРЕСС БАР =====
    class ProgressBar {
        constructor(title) {
            this.element = document.createElement('div');
            this.element.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                min-width: 300px;
            `;
            this.title = title;
            document.body.appendChild(this.element);
        }

        update(current, total, status, extra = '') {
            this.element.innerHTML = `
                <div>${this.title}</div>
                <div>${current}/${total}</div>
                <div>${status}</div>
                ${extra ? `<div style="opacity: 0.7;">${extra}</div>` : ''}
                <div style="margin-top: 10px;">
                    <div style="background: #333; height: 10px; border-radius: 5px;">
                        <div style="background: #4CAF50; height: 100%; width: ${(current/total)*100}%; border-radius: 5px;"></div>
                    </div>
                </div>
            `;
        }

        updateStatus(status) {
            this.element.innerHTML = `<div>${this.title}</div><div>${status}</div>`;
        }

        destroy() {
            if (this.element.parentNode) {
                document.body.removeChild(this.element);
            }
        }
    }

    // ===== ИЗВЛЕЧЕНИЕ ДАННЫХ =====
    class DataExtractor {
        static extractPromptText(doc = document, forcePostType = false) {
            const pageType = forcePostType ? 'post' : Utils.getPageType();
            let promptText = '';

            if (pageType === 'create') {
                // На странице создания ищем в textarea
                const promptTextarea = doc.querySelector(SELECTORS.promptTextarea);
                if (promptTextarea) {
                    promptText = promptTextarea.value || promptTextarea.textContent || '';
                    if (promptText) {
                        console.log('✓ Найден промт в textarea:', promptText.substring(0, 100) + '...');
                        return promptText;
                    }
                }
            } else {
                // На других страницах ищем в title атрибутах
                const promptWithTitle = doc.querySelector(SELECTORS.promptWithTitle);
                if (promptWithTitle) {
                    const titleText = promptWithTitle.getAttribute('title')?.trim();
                    if (titleText && titleText.length > 10) {
                        console.log('✓ Найден промт в title:', titleText.substring(0, 100) + '...');
                        promptText = titleText;
                    }
                }
            }

            return promptText;
        }

        static extractPostInfo(doc = document) {
            let postTitle = '';
            let postDescription = '';

            // Ищем заголовок поста
            const titleElement = doc.querySelector(SELECTORS.postTitle);
            if (titleElement) {
                postTitle = titleElement.textContent?.trim() || '';
                console.log('✓ Найден заголовок поста:', postTitle);
            }

            // Ищем описание поста
            const descriptionElement = doc.querySelector(SELECTORS.postDescription);
            if (descriptionElement) {
                postDescription = descriptionElement.textContent?.trim() || '';
                console.log('✓ Найдено описание поста:', postDescription.substring(0, 100) + '...');
            }

            // Альтернативный поиск описания
            if (!postDescription) {
                const description = doc.querySelector(SELECTORS.alternativeDescription);
                if (description && description.textContent && description.textContent.trim().length > 10) {
                    const descText = description.textContent.trim();
                    const promptText = this.extractPromptText(doc);
                    if (descText !== promptText) {
                        postDescription = descText;
                        console.log('✓ Найдено описание поста (альтернативный поиск):', postDescription.substring(0, 100) + '...');
                    }
                }
            }

            return { postTitle, postDescription };
        }

        static extractFullText(doc = document, forcePostType = false) {
            const pageType = forcePostType ? 'post' : Utils.getPageType();

            if (pageType === 'create') {
                // На странице создания берем ТОЛЬКО промт из textarea
                return this.extractPromptText(doc);
            } else {
                // На других страницах собираем полную информацию
                const promptText = this.extractPromptText(doc, forcePostType);
                const { postTitle, postDescription } = this.extractPostInfo(doc);

                let fullText = '';
                if (promptText) {
                    fullText += promptText;
                }

                if (postTitle || postDescription) {
                    if (fullText) {
                        fullText += '\n\n';
                    }

                    if (postTitle) {
                        fullText += postTitle;
                        if (postDescription) {
                            fullText += '\n' + postDescription;
                        }
                    } else if (postDescription) {
                        fullText += postDescription;
                    }
                }

                return fullText;
            }
        }

        static extractImages(doc = document, forcePostType = false) {
            const pageType = forcePostType ? 'post' : Utils.getPageType();
            const images = [];

            if (pageType === 'create') {
                const imgElements = doc.querySelectorAll(SELECTORS.createPageImages);
                imgElements.forEach(img => {
                    if (Utils.isValidImage(img)) {
                        images.push(img.src);
                    }
                });
            } else if (pageType === 'post') {
                const mainPostArea = doc.querySelector(SELECTORS.mainPostArea) || doc.body;
                const imgElements = mainPostArea.querySelectorAll('img');

                imgElements.forEach(img => {
                    if (!Utils.isValidImage(img) ||
                        Utils.isAdOrAvatarImage(img) ||
                        Utils.isImageTooSmall(img)) {
                        return;
                    }

                    console.log('Добавляем изображение поста:', img.src);
                    images.push(img.src);
                });
            }

            return [...new Set(images)]; // Убираем дубликаты
        }
    }

    // ===== ФОРМАТИРОВАНИЕ ТЕКСТА =====
    class TextFormatter {
        static formatPostText(postData, postNumber = 1) {
            const pageType = Utils.getPageType();

            // Для страницы создания - упрощенный формат
            if (pageType === 'create') {
                return this.formatCreatePageText(postData);
            }

            // Для постов и ленты - полный формат
            const imageCount = postData.images.length;
            const imageWord = this.getImageWord(imageCount);

            let formattedText = '';
            formattedText += `🎨 ПОСТ №${postNumber} | ${imageCount} ${imageWord}\n`;
            formattedText += `📋 URL: ${postData.url || window.location.href}\n`;

            if (postData.images.length > 0) {
                const filenames = postData.images.map((url, index) => {
                    const originalName = Utils.getOriginalFilename(url);
                    return postData.postId ?
                        `${postData.postId}_image${index + 1}.${originalName.split('.').pop()}` :
                        originalName;
                });
                formattedText += `🖼️ Файлы: ${filenames.join(', ')}\n`;
            }

            if (postData.text) {
                const lines = postData.text.split('\n\n');
                if (lines.length >= 2) {
                    formattedText += `💬 ПРОМПТ:\n${lines[0]}\n`;
                    formattedText += `📝 ОПИСАНИЕ:\n${lines.slice(1).join('\n\n')}\n`;
                } else {
                    formattedText += `💬 ПРОМПТ:\n${postData.text}\n`;
                }
            }

            formattedText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

            return formattedText;
        }

        static formatCreatePageText(postData) {
            let formattedText = '';

            // Только файлы и промпт для страницы создания
            if (postData.images.length > 0) {
                const filenames = postData.images.map((url, index) => {
                    return Utils.getOriginalFilename(url);
                });
                formattedText += `🖼️ Файлы: ${filenames.join(', ')}\n`;
            }

            if (postData.text) {
                formattedText += `💬 ПРОМПТ:\n${postData.text}\n`;
            }

            return formattedText;
        }

        static getImageWord(count) {
            if (count === 1) return 'изображение';
            if (count > 4) return 'изображений';
            return 'изображения';
        }
    }

    // ===== РАБОТА С ЛЕНТОЙ =====
    class FeedManager {
        static getPostLinksFromFeed() {
            const links = [];
            const articles = document.querySelectorAll(SELECTORS.postLinks);

            articles.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.includes('#comments')) {
                    const fullUrl = 'https://shedevrum.ai' + href;
                    if (!links.includes(fullUrl)) {
                        links.push(fullUrl);
                    }
                }
            });

            console.log(`Найдено ${links.length} постов в ленте`);
            return links;
        }

        static async loadAllFeedPosts() {
            return new Promise(async (resolve) => {
                const progressBar = new ProgressBar('🔄 Загружаем все посты');
                let totalLoaded = 0;
                let attempts = 0;

                async function scrollAndLoadMore() {
                    // Поиск кнопки "Ещё"
                    const buttons = document.querySelectorAll(SELECTORS.moreButton);
                    let moreButton = null;

                    for (const button of buttons) {
                        const buttonText = button.textContent.trim();
                        if (buttonText === 'Ещё' &&
                            !button.classList.contains('fixed') &&
                            !buttonText.includes('Наверх') &&
                            button.offsetParent !== null) {
                            moreButton = button;
                            break;
                        }
                    }

                    if (moreButton) {
                        console.log('🔘 Найдена кнопка "Ещё", кликаем...');
                        moreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await Utils.delay(500);
                        moreButton.click();
                        await Utils.delay(2000);
                    }

                    // Скролл и поиск конца
                    let scrollAttempts = 0;
                    while (scrollAttempts < CONSTANTS.maxScrollAttempts) {
                        const endIndicator = document.querySelector(SELECTORS.endIndicator);
                        if (endIndicator && endIndicator.textContent.includes('Конец')) {
                            console.log('✅ Найден индикатор "Конец! 🤷‍" - загрузка завершена');
                            return false;
                        }

                        window.scrollBy(0, 300);
                        await Utils.delay(50);
                        scrollAttempts++;
                    }

                    return true;
                }

                totalLoaded = this.getPostLinksFromFeed().length;
                progressBar.update(totalLoaded, totalLoaded, 'Начинаем загрузку всех постов...');

                let hasMore = true;
                while (hasMore && attempts < CONSTANTS.maxLoadAttempts) {
                    attempts++;
                    progressBar.update(totalLoaded, totalLoaded, 'Скроллим и ищем посты...',
                        `Попытка ${attempts}/${CONSTANTS.maxLoadAttempts}`);

                    hasMore = await scrollAndLoadMore();
                    const currentLinks = this.getPostLinksFromFeed();
                    totalLoaded = currentLinks.length;

                    if (hasMore) {
                        await Utils.delay(1000);
                    }
                }

                if (attempts >= CONSTANTS.maxLoadAttempts) {
                    progressBar.update(totalLoaded, totalLoaded, '⚠️ Достигнут лимит попыток');
                } else {
                    progressBar.update(totalLoaded, totalLoaded, '✅ Все посты загружены!');
                }

                setTimeout(() => {
                    progressBar.destroy();
                    resolve(totalLoaded);
                }, 1500);
            });
        }

        static async fetchPostData(url) {
            try {
                console.log(`Загружаем данные поста: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const text = DataExtractor.extractFullText(doc);
                const images = DataExtractor.extractImages(doc, true); // Принудительно как пост

                return {
                    url: url,
                    text: text,
                    images: images,
                    postId: url.split('/').pop().split('?')[0]
                };

            } catch (error) {
                console.error(`Ошибка при загрузке поста ${url}:`, error);
                return {
                    url: url,
                    text: '',
                    images: [],
                    postId: url.split('/').pop().split('?')[0],
                    error: error.message
                };
            }
        }
    }

    // ===== ЗАГРУЗЧИК =====
    class Downloader {
        static async downloadAsZip(postData = null, isFromFeed = false) {
            const timestamp = Utils.getTimestamp();
            const zip = new JSZip();

            // Если не передан postData, получаем данные с текущей страницы
            if (!postData) {
                const text = DataExtractor.extractFullText();
                const images = DataExtractor.extractImages();

                if (!text && images.length === 0) {
                    alert('Не найдено изображений или текстового запроса для скачивания');
                    return;
                }

                postData = {
                    url: window.location.href,
                    text: text,
                    images: images,
                    postId: window.location.pathname.split('/').pop()
                };
            }

            try {
                console.log(`Создаем ZIP архив с ${postData.images.length} изображениями...`);

                // Формируем текст в едином формате
                const formattedText = TextFormatter.formatPostText(postData);

                if (formattedText) {
                    const pageType = Utils.getPageType();
                    let filename;

                    if (pageType === 'create') {
                        filename = `shedevrum_create_${timestamp.date}.txt`;
                    } else if (isFromFeed) {
                        filename = `shedevrum_feed_${timestamp.date}.txt`;
                    } else {
                        filename = `shedevrum_post_${timestamp.date}.txt`;
                    }

                    zip.file(filename, formattedText);
                    console.log('Текстовый файл добавлен в архив');
                }

                // Добавляем изображения
                for (let i = 0; i < postData.images.length; i++) {
                    const imageUrl = postData.images[i];
                    try {
                        console.log(`Загружаем изображение ${i + 1}/${postData.images.length}: ${imageUrl}`);

                        const response = await fetch(imageUrl);
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }

                        const arrayBuffer = await response.arrayBuffer();
                        const filename = Utils.getOriginalFilename(imageUrl);

                        zip.file(filename, arrayBuffer);
                        console.log(`✓ Добавлено изображение: ${filename}`);

                        await Utils.delay(CONSTANTS.requestDelay);

                    } catch (error) {
                        console.error(`✗ Ошибка при загрузке изображения ${i + 1}:`, error);
                    }
                }

                console.log('Создаем ZIP архив...');

                const content = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                });

                const url = URL.createObjectURL(content);
                const pageType = Utils.getPageType();
                let archiveName;

                if (pageType === 'create') {
                    archiveName = `shedevrum_create_${timestamp.folder}.zip`;
                } else if (isFromFeed) {
                    archiveName = `shedevrum_feed_${timestamp.folder}.zip`;
                } else {
                    archiveName = `shedevrum_post_${timestamp.folder}.zip`;
                }

                Utils.downloadFile(url, archiveName);
                URL.revokeObjectURL(url);

                console.log(`✓ ZIP архив успешно создан: ${archiveName}`);

            } catch (error) {
                console.error('Критическая ошибка при создании ZIP архива:', error);
                alert(`Ошибка при создании архива: ${error.message}`);
            }
        }

        static async downloadWithPrefix(postData = null, isFromFeed = false) {
            const timestamp = Utils.getTimestamp();

            // Если не передан postData, получаем данные с текущей страницы
            if (!postData) {
                const text = DataExtractor.extractFullText();
                const images = DataExtractor.extractImages();

                if (!text && images.length === 0) {
                    alert('Не найдено изображений или текстового запроса для скачивания');
                    return;
                }

                postData = {
                    url: window.location.href,
                    text: text,
                    images: images,
                    postId: window.location.pathname.split('/').pop()
                };
            }

            // Формируем текст в едином формате
            const formattedText = TextFormatter.formatPostText(postData);

            if (formattedText) {
                const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const pageType = Utils.getPageType();
                let filename;

                if (pageType === 'create') {
                    filename = `${timestamp.folder}__shedevrum_create_${timestamp.date}.txt`;
                } else if (isFromFeed) {
                    filename = `${timestamp.folder}__shedevrum_feed_${timestamp.date}.txt`;
                } else {
                    filename = `${timestamp.folder}__shedevrum_post_${timestamp.date}.txt`;
                }

                Utils.downloadFile(url, filename);
                URL.revokeObjectURL(url);
            }

            // Скачиваем изображения
            postData.images.forEach(async (imageUrl, index) => {
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const originalName = Utils.getOriginalFilename(imageUrl);
                    const filename = `${timestamp.folder}__${originalName}`;

                    setTimeout(() => {
                        Utils.downloadFile(url, filename);
                        URL.revokeObjectURL(url);
                    }, index * CONSTANTS.downloadDelay);
                } catch (error) {
                    console.error(`Ошибка при скачивании изображения ${index + 1}:`, error);
                }
            });

            console.log(`Начато скачивание с префиксом: ${timestamp.folder}`);
        }

        static async downloadFromFeed() {
            const initialLinks = FeedManager.getPostLinksFromFeed();

            if (initialLinks.length === 0) {
                alert('❌ Не найдено постов в ленте!\n\n📄 Убедитесь, что страница полностью загружена');
                return;
            }

            // Проверка кнопки "Ещё"
            const buttons = document.querySelectorAll(SELECTORS.moreButton);
            let hasMoreButton = false;

            for (const button of buttons) {
                if (button.textContent.trim() === 'Ещё' && !button.classList.contains('fixed')) {
                    hasMoreButton = true;
                    break;
                }
            }

            let postLinks = initialLinks;

            if (hasMoreButton) {
                const choice = confirm(
                    `Найдено ${initialLinks.length} постов (есть кнопка "Ещё").\n\n` +
                    `ДА - сначала подгрузить ВСЕ посты из ленты\n` +
                    `НЕТ - работать с уже загруженными ${initialLinks.length} постами`
                );

                if (choice) {
                    await FeedManager.loadAllFeedPosts();
                    postLinks = FeedManager.getPostLinksFromFeed();
                }
            }

            const maxPosts = Math.min(postLinks.length, CONSTANTS.maxPosts);
            const selectedCount = prompt(
                `Найдено ${postLinks.length} постов в ленте.\n\n` +
                `Сколько постов скачать? (максимум ${maxPosts})\n` +
                `Введите число от 1 до ${maxPosts}:`,
                Math.min(20, maxPosts).toString()
            );

            if (!selectedCount || isNaN(selectedCount)) {
                return;
            }

            const count = Math.min(Math.max(1, parseInt(selectedCount)), maxPosts);
            const selectedLinks = postLinks.slice(0, count);

            if (downloadMode === 'zip') {
                await this.downloadFeedAsZip(selectedLinks);
            } else {
                await this.downloadFeedWithPrefix(selectedLinks);
            }
        }

        static async downloadFeedAsZip(selectedLinks) {
            const timestamp = Utils.getTimestamp();
            const zip = new JSZip();
            const progressBar = new ProgressBar('📦 Скачивание из ленты (ZIP)');

            let successCount = 0;
            let totalImages = 0;
            let allPostsText = '';

            try {
                for (let i = 0; i < selectedLinks.length; i++) {
                    const link = selectedLinks[i];
                    progressBar.update(i + 1, selectedLinks.length, 'Загружаем данные...');

                    const postData = await FeedManager.fetchPostData(link);

                    if (postData.error) {
                        console.error(`Ошибка при загрузке поста ${i + 1}:`, postData.error);
                        continue;
                    }

                    progressBar.update(i + 1, selectedLinks.length, 'Обрабатываем изображения...');

                    const imageFilenames = [];

                    // Добавляем изображения
                    for (let j = 0; j < postData.images.length; j++) {
                        const imageUrl = postData.images[j];
                        try {
                            progressBar.update(i + 1, selectedLinks.length,
                                `Изображение ${j + 1}/${postData.images.length}...`);

                            const response = await fetch(imageUrl);
                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                            }

                            const arrayBuffer = await response.arrayBuffer();
                            const filename = Utils.getOriginalFilename(imageUrl);

                            zip.file(filename, arrayBuffer);
                            imageFilenames.push(filename);
                            totalImages++;

                            await Utils.delay(CONSTANTS.requestDelay);

                        } catch (error) {
                            console.error(`Ошибка при загрузке изображения ${j + 1} из поста ${i + 1}:`, error);
                        }
                    }

                    // Добавляем информацию о посте
                    const postDataWithFilenames = {
                        ...postData,
                        imageFilenames: imageFilenames
                    };

                    allPostsText += TextFormatter.formatPostText(postDataWithFilenames, successCount + 1);
                    successCount++;

                    await Utils.delay(CONSTANTS.postDelay);
                }

                if (allPostsText) {
                    zip.file(`shedevrum_feed_${timestamp.date}.txt`, allPostsText);
                }

                progressBar.update(selectedLinks.length, selectedLinks.length, 'Создаем архив...');

                const content = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                });

                const url = URL.createObjectURL(content);
                Utils.downloadFile(url, `shedevrum_feed_${timestamp.folder}.zip`);
                URL.revokeObjectURL(url);

                progressBar.destroy();
                alert(`✅ Успешно скачано!\n\n📊 Обработано постов: ${successCount}/${selectedLinks.length}\n🖼️ Изображений: ${totalImages}\n📁 Архив: shedevrum_feed_${timestamp.folder}.zip`);

            } catch (error) {
                progressBar.destroy();
                console.error('Критическая ошибка при скачивании из ленты:', error);
                alert(`❌ Ошибка при создании архива: ${error.message}`);
            }
        }

        static async downloadFeedWithPrefix(selectedLinks) {
            const timestamp = Utils.getTimestamp();
            const progressBar = new ProgressBar('📦 Скачивание из ленты (Префикс)');

            let successCount = 0;
            let totalImages = 0;
            let downloadQueue = [];
            let allPostsText = '';

            try {
                for (let i = 0; i < selectedLinks.length; i++) {
                    const link = selectedLinks[i];
                    progressBar.update(i + 1, selectedLinks.length, 'Загружаем данные...');

                    const postData = await FeedManager.fetchPostData(link);

                    if (postData.error) {
                        console.error(`Ошибка при загрузке поста ${i + 1}:`, postData.error);
                        continue;
                    }

                    const imageFilenames = [];

                    // Добавляем изображения в очередь
                    for (let j = 0; j < postData.images.length; j++) {
                        const imageUrl = postData.images[j];
                        try {
                            progressBar.update(i + 1, selectedLinks.length,
                                `Подготавливаем изображение ${j + 1}/${postData.images.length}...`);

                            const response = await fetch(imageUrl);
                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                            }

                            const blob = await response.blob();
                            const url = URL.createObjectURL(blob);
                            const originalFilename = Utils.getOriginalFilename(imageUrl);
                            const imageFilename = `${timestamp.folder}__${originalFilename}`;

                            downloadQueue.push({
                                url,
                                filename: imageFilename,
                                delay: downloadQueue.length * CONSTANTS.downloadDelay
                            });
                            imageFilenames.push(originalFilename);
                            totalImages++;

                            await Utils.delay(CONSTANTS.requestDelay);

                        } catch (error) {
                            console.error(`Ошибка при загрузке изображения ${j + 1} из поста ${i + 1}:`, error);
                        }
                    }

                    const postDataWithFilenames = {
                        ...postData,
                        imageFilenames: imageFilenames
                    };

                    allPostsText += TextFormatter.formatPostText(postDataWithFilenames, successCount + 1);
                    successCount++;

                    await Utils.delay(CONSTANTS.postDelay);
                }

                // Добавляем общий текстовый файл в очередь
                if (allPostsText) {
                    const textBlob = new Blob([allPostsText], { type: 'text/plain;charset=utf-8' });
                    const textUrl = URL.createObjectURL(textBlob);
                    const textFilename = `${timestamp.folder}__shedevrum_feed_${timestamp.date}.txt`;
                    downloadQueue.unshift({url: textUrl, filename: textFilename, delay: 0});
                }

                progressBar.update(selectedLinks.length, selectedLinks.length, 'Начинаем скачивание файлов...');

                // Запускаем скачивание
                downloadQueue.forEach(item => {
                    setTimeout(() => {
                        Utils.downloadFile(item.url, item.filename);
                        URL.revokeObjectURL(item.url);
                    }, item.delay);
                });

                setTimeout(() => {
                    progressBar.destroy();
                    alert(`✅ Успешно скачано!\n\n📊 Обработано постов: ${successCount}/${selectedLinks.length}\n🖼️ Изображений: ${totalImages}\n📁 Префикс: ${timestamp.folder}`);
                }, 2000);

            } catch (error) {
                progressBar.destroy();
                console.error('Критическая ошибка при скачивании из ленты:', error);
                alert(`❌ Ошибка: ${error.message}`);
            }
        }
    }

    // ===== UI УПРАВЛЕНИЕ =====
    class UIManager {
        static toggleMode() {
            downloadMode = downloadMode === 'zip' ? 'prefix' : 'zip';
            localStorage.setItem('shedevrum-download-mode', downloadMode);
            UIManager.updateModeButton();
            console.log(`Режим переключен на: ${downloadMode}`);
        }

        static updateModeButton() {
            const modeButton = document.querySelector('#shedevrum-mode-btn');
            if (modeButton) {
                const isZip = downloadMode === 'zip';
                const isPostContainer = modeButton.closest('.shedevrum-buttons-container');
                const isOverlay = modeButton.classList.contains('bg-black/50');

                if (isPostContainer) {
                    // Для кнопок в правой колонке поста используем стандартные серые цвета
                    modeButton.style.background = isZip ? 'rgba(0,0,0,0.12)' : 'rgba(255, 152, 0, 0.8)';
                } else if (isOverlay) {
                    modeButton.style.backgroundColor = isZip ? 'rgba(0,0,0,0.5)' : 'rgba(70, 130, 180, 0.6)';
                } else {
                    modeButton.style.background = isZip ? 'rgba(0,0,0,0.12)' : 'rgba(255, 152, 0, 0.8)';
                }

                modeButton.title = isZip ? 'Режим: ZIP архив' : 'Режим: Отдельные файлы с префиксом';
            }
        }

        static findButtonContainer() {
            const pageType = Utils.getPageType();

            // Для страницы поста - создаем контейнер в правой колонке
            if (pageType === 'post') {
                return this.createPostButtonContainer();
            }

            // Для других страниц используем существующие панели
            for (const selector of SELECTORS.buttonPanels) {
                const container = document.querySelector(selector);
                if (container) {
                    return container;
                }
            }
            return null;
        }

        static createPostButtonContainer() {
            // Ищем правую колонку поста - используем более надежный селектор
            const rightColumn = document.querySelector('[class*="basis-1/2"][class*="grow"][class*="min-w-0"][class*="flex-col"]');
            if (!rightColumn) {
                console.log('Не найдена правая колонка поста');
                return null;
            }

            // Проверяем, не создали ли мы уже контейнер
            let buttonContainer = rightColumn.querySelector('.shedevrum-buttons-container');
            if (buttonContainer) {
                return buttonContainer;
            }

            // Создаем контейнер для кнопок в начале правой колонки
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'shedevrum-buttons-container';
            buttonContainer.style.cssText = `
                display: flex;
                gap: 12px;
                margin-bottom: 0.8rem;
                justify-content: flex-start;
            `;

            // Вставляем контейнер в начало правой колонки (после рекламного блока если есть)
            const firstChild = rightColumn.children[0];
            if (firstChild && firstChild.classList.contains('relative')) {
                // Если первый элемент - рекламный блок, вставляем после него
                rightColumn.insertBefore(buttonContainer, rightColumn.children[1]);
            } else {
                // Иначе вставляем в самое начало
                rightColumn.insertBefore(buttonContainer, firstChild);
            }

            console.log('✓ Создан контейнер для кнопок в правой колонке поста');
            return buttonContainer;
        }

        static createControlButtons() {
            const pageType = Utils.getPageType();

            if (document.querySelector('#shedevrum-download-btn')) {
                return;
            }

            let targetContainer = this.findButtonContainer();

            // Для ленты создаем плавающую панель
            if (pageType === 'feed' && !targetContainer) {
                targetContainer = document.createElement('div');
                targetContainer.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(0,0,0,0.8);
                    padding: 12px;
                    border-radius: 16px;
                    z-index: 1000;
                    display: flex;
                    gap: 12px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                `;
                document.body.appendChild(targetContainer);
            }

            if (!targetContainer) {
                return;
            }

            // Проверяем тип контейнера
            const isPostContainer = targetContainer.classList.contains('shedevrum-buttons-container');
            const isOverlayPosition = targetContainer.classList.contains('absolute') ||
                                    targetContainer.style.position === 'fixed';

            let buttonBaseStyle, buttonSize;

            if (isPostContainer) {
                // Для кнопок в правой колонке поста используем стиль как у обычных кнопок сайта
                buttonBaseStyle = 'flex justify-center items-center shrink-0 outline-none text-center text-button transition disabled:bg-[#00000064] whitespace-nowrap text-[#000] bg-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.15)] focus-visible:ring';
                buttonSize = 'h-[3.6rem] min-w-[3.6rem] px-[.8rem] py-[.7rem] rounded-[1rem] text-[1.3rem] leading-[1.6rem]';
            } else if (isOverlayPosition) {
                // Для плавающих панелей
                buttonBaseStyle = 'flex justify-center items-center shrink-0 outline-none text-center text-button transition text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20';
                buttonSize = 'w-[4rem] h-[4rem] rounded-[1rem]';
            } else {
                // Для обычных панелей
                buttonBaseStyle = 'flex justify-center items-center shrink-0 outline-none text-center text-button transition disabled:bg-[#00000064] whitespace-nowrap text-[#000] bg-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.15)] focus-visible:ring !p-0 disabled:bg-[rgba(0,0,0,.12)] disabled:opacity-[.4]';
                buttonSize = 'h-[5.6rem] min-w-[5.6rem] p-[1.8rem] rounded-[1.6rem] stretch-tertiary';
            }

            let buttonContainer = targetContainer;
            if (isOverlayPosition && pageType !== 'feed' && !isPostContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.className = 'flex gap-2';
                targetContainer.appendChild(buttonContainer);
            }

            // Кнопка переключения режима
            const modeButton = UIManager.createButton('shedevrum-mode-btn', buttonBaseStyle, buttonSize,
                'Режим: ZIP архив', UIManager.getArchiveIcon(isPostContainer || isOverlayPosition), () => UIManager.toggleMode());

            // Кнопка скачивания
            const downloadTitle = pageType === 'feed' ? 'Скачать посты из ленты' : 'Скачать изображения и промт';
            const downloadButton = UIManager.createButton('shedevrum-download-btn', buttonBaseStyle, buttonSize,
                downloadTitle, UIManager.getDownloadIcon(isPostContainer || isOverlayPosition), () => UIManager.handleDownload());

            buttonContainer.appendChild(modeButton);
            buttonContainer.appendChild(downloadButton);

            this.updateModeButton();
            console.log(`✓ Кнопки успешно добавлены (${pageType})`);
        }

        static createButton(id, baseStyle, size, title, innerHTML, clickHandler) {
            const button = document.createElement('button');
            button.id = id;
            button.className = `${baseStyle} ${size}`;
            button.setAttribute('tabindex', '0');
            button.title = title;
            button.innerHTML = innerHTML;
            button.addEventListener('click', clickHandler);
            return button;
        }

        static getArchiveIcon(isOverlay) {
            const iconSize = isOverlay ? '20' : '24';
            return `
                <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 2H14.5L16 3.5V6.5L20.5 7V20.5C20.5 21.3284 19.8284 22 19 22H5C4.17157 22 3.5 21.3284 3.5 20.5V3.5C3.5 2.67157 4.17157 2 5 2H9.5ZM9.5 4H5.5V20H18.5V9H14V4.5L12.5 3H9.5V4ZM8 12H16V14H8V12ZM8 16H14V18H8V16Z" fill="currentColor"/>
                </svg>
            `;
        }

        static getDownloadIcon(isOverlay) {
            const iconSize = isOverlay ? '20' : '24';
            return `
                <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none">
                    <path d="M16.7072 12.2929L15.293 10.8787L13.0001 13.1716V2H11.0001L11.0001 13.1716L8.70717 10.8787L7.29295 12.2929L12.0001 17L16.7072 12.2929Z" fill="currentColor"/>
                    <path d="M8 20H16C16.9592 20 17.5785 19.9989 18.0525 19.9666C18.5085 19.9355 18.6821 19.8822 18.7654 19.8478C19.2554 19.6448 19.6448 19.2554 19.8478 18.7654C19.8822 18.6821 19.9355 18.5085 19.9666 18.0525C19.9989 17.5785 20 16.9592 20 16V11H22V16C22 17.8638 22 18.7957 21.6955 19.5307C21.2895 20.5108 20.5108 21.2895 19.5307 21.6955C18.7956 22 17.8638 22 16 22H8C6.13623 22 5.20435 22 4.46927 21.6955C3.48915 21.2895 2.71046 20.5108 2.30448 19.5307C2 18.7957 2 17.8638 2 16V11H4V16C4 16.9592 4.00108 17.5785 4.03342 18.0525C4.06453 18.5085 4.11777 18.6821 4.15224 18.7654C4.35523 19.2554 4.74458 19.6448 5.23463 19.8478C5.31786 19.8822 5.49152 19.9355 5.94752 19.9666C6.42148 19.9989 7.04075 20 8 20Z" fill="currentColor"/>
                </svg>
            `;
        }

        static handleDownload() {
            const pageType = Utils.getPageType();

            if (pageType === 'feed') {
                Downloader.downloadFromFeed();
                return;
            }

            if (downloadMode === 'zip') {
                Downloader.downloadAsZip();
            } else {
                Downloader.downloadWithPrefix();
            }
        }
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    function init() {
        // Проверяем доступность JSZip
        if (typeof JSZip === 'undefined') {
            console.error('JSZip не загружен! ZIP режим недоступен.');
            downloadMode = 'prefix';
            localStorage.setItem('shedevrum-download-mode', 'prefix');
        }

        // Загружаем сохраненные настройки
        const savedMode = localStorage.getItem('shedevrum-download-mode');
        if (savedMode && (savedMode === 'zip' || savedMode === 'prefix')) {
            downloadMode = savedMode;
            console.log(`Загружен сохраненный режим: ${downloadMode}`);
        }

        // Создаем кнопки
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(UIManager.createControlButtons, 100);
            });
        } else {
            setTimeout(UIManager.createControlButtons, 100);
        }

        // Наблюдаем за изменениями DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    setTimeout(() => {
                        const hasPanel = UIManager.findButtonContainer() ||
                                        document.querySelector('.masonry-feed') ||
                                        document.querySelector('[class*="basis-1/2"][class*="grow"][class*="min-w-0"][class*="flex-col"]');
                        const hasOurButtons = document.querySelector('#shedevrum-download-btn');

                        if (hasPanel && !hasOurButtons) {
                            UIManager.createControlButtons();
                        }
                    }, 500);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                UIManager.handleDownload();
            }
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                UIManager.toggleMode();
            }
        });
    }

    // Запускаем скрипт
    init();

    console.log('Shedevrum.ai Downloader v1.0 загружен!');
    console.log('📍 Поддерживаемые страницы: создание изображений, отдельные посты, лента пользователя');
    console.log('⌨️  Горячие клавиши: Ctrl+D - скачать, Ctrl+M - сменить режим');
    console.log(`💾 Текущий режим: ${downloadMode}`);
})();