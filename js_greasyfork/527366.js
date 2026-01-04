// ==UserScript==
// @name         FastPic Upload
// @name:en      FastPic Upload
// @namespace    http://tampermonkey.net/
// @version      6.2.1
// @license MIT
// @description  Загрузка изображений на FastPic
// @description:en  Image uploading to FastPic
// @author       С
// @match        https://rutracker.org/forum/viewtopic.php?*
// @match        https://rutracker.org/forum/posting.php?*
// @match        https://rutracker.org/forum/privmsg.php?*
// @match        https://nnmclub.to/forum/viewtopic.php?*
// @match        https://nnmclub.to/forum/posting.php*
// @match        https://nnmclub.to/forum/privmsg.php?*
// @match        https://tapochek.net/viewtopic.php?*
// @match        https://tapochek.net/posting.php*
// @match        https://tapochek.net/privmsg.php?*
// @match        https://4pda.to/forum/index.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/527366/FastPic%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/527366/FastPic%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Настройки по умолчанию
    const DEFAULT_SETTINGS = {
        uploadService: 'newfastpic',
        fastpic: {
            codeFormat: 'bb_thumb',  // direct, bb_thumb, bb_full, html_thumb, markdown_thumb
            thumb: {
                checkThumb: 'size',  // 'size', 'text', 'filename', 'no'
                thumbText: 'Увеличить',
                thumbSize: '150',
                thumbSizeVertical: false
            },
            image: {
                origResize: {
                    enabled: false,
                    resSelect: '500',  // '150', '320', '500', '640', '800'
                    customSize: '500'
                },
                origRotate: {
                    enabled: false,
                    value: '0'  // '0', '90', '180', '270'
                },
                optimization: {
                    enabled: false,
                    jpegQuality: '75'  // 0-99
                },
                poster: false
            }
        },
        newfastpic: {
            codeFormat: 'bb_thumb',
            thumb: {
                checkThumb: 'size',
                thumbText: 'Увеличить',
                thumbSize: '150',
                thumbSizeVertical: false
            },
            image: {
                origResize: {
                    enabled: false,
                    customSize: '1200'
                },
                optimization: {
                    enabled: false,
                    jpegQuality: '80'
                },
                poster: false
            },
            deleteAfter: '0',
            albumName: '',
            useExistingAlbum: false,  // использовать существующий альбом
            selectedAlbumId: '',      // ID выбранного альбома
            availableAlbums: []       // список доступных альбомов
        },
        imgbb: {
            codeFormat: 'bb_thumb_linked',  // viewer_link, direct, html_image, html_full_linked, html_medium_linked, html_thumb_linked, bb_full, bb_full_linked, bb_medium_linked, bb_thumb_linked
            apiKey: '',
            expiration: '',  //значение в секундах
            useOriginalFilename: false
        },
        imagebam: {
            codeFormat: 'bb_thumb',  // direct, bb_thumb, html_thumb
            thumbnailSize: '2',  // размер превью: 1, 2, 3, 4
            contentType: 'sfw',  // тип контента: nsfw, sfw
            galleryEnabled: false,  // включить галерею
            galleryTitle: '', // название галереи
            useExistingGallery: false,  // использовать существующую галерею
            selectedGalleryToken: '',   // токен выбранной галереи
            availableGalleries: []      // список доступных галерей
        },
        uploadHistory: {
            enabled: true,
            maxItems: 50,
            items: []  // [{url, service, imageCount, date, timestamp}]
        }
    };

    // Функция глубокого слияния объектов
    function deepMerge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    // ===== ФУНКЦИИ ДЛЯ РАБОТЫ С АЛЬБОМАМИ NEW FASTPIC =====

    // Функция получения списка альбомов с HTML страницы New FastPic
    async function fetchNewFastPicAlbums() {
        try {
            const response = await new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://new.fastpic.org',
                    headers: {
                        'Accept': 'text/html',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    onload: resolve
                });
            });

            // Ищем переменную uploadsList в JavaScript коде страницы
            const htmlContent = response.responseText;

            // Ищем объявление uploadsList в JavaScript
            const uploadsListMatch = htmlContent.match(/uploadsList:\s*(\[.*?\])/s);

            if (uploadsListMatch) {
                try {
                    // Парсим JSON массив альбомов
                    const uploadsListStr = uploadsListMatch[1];
                    const uploadsList = JSON.parse(uploadsListStr);
                    const existingAlbums = [];

                    uploadsList.forEach((upload) => {
                        const albumId = upload.upload_id;
                        const title = upload.upload_name;

                        // Пропускаем пустой option с текстом "Выбор из ваших альбомов"
                        if (albumId && title && !title.includes('Выбор из ваших альбомов') && !title.includes('последние 50')) {
                            existingAlbums.push({
                                id: albumId,
                                title: title
                            });
                        }
                    });

                    return existingAlbums;

                } catch (parseError) {
                    console.error('Ошибка парсинга JSON альбомов New FastPic:', parseError);
                    return [];
                }
            }

            return [];

        } catch (error) {
            console.error('Ошибка при получении списка альбомов New FastPic:', error);
            return [];
        }
    }

    // Функция обновления списка альбомов в настройках New FastPic
    async function updateNewFastPicAlbums() {
        const albums = await fetchNewFastPicAlbums();
        settings.newfastpic.availableAlbums = albums;
        saveSettings();
        return albums;
    }

    // ===== ФУНКЦИИ ДЛЯ РАБОТЫ С ГАЛЕРЕЯМИ IMAGEBAM =====

    // Функция получения списка галерей с HTML страницы ImageBam
    async function fetchImageBamGalleries() {
        try {
            const response = await new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://www.imagebam.com/',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Referer': 'https://www.imagebam.com/',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    },
                onload: resolve,
                onerror: resolve,
                ontimeout: resolve
                });
            });

            // Проверяем успешность запроса
            if (response.status === 0 || !response.responseText) {
                throw new Error('Не удалось получить ответ от ImageBam');
            }

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: Сервер вернул ошибку`);
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            const gallerySelect = doc.querySelector('select[name="gallery"]');
            if (!gallerySelect) {
                console.warn('Не найден элемент select[name="gallery"] на странице ImageBam');
                return [];
            }

            const existingGalleries = [];
            const optgroup = gallerySelect.querySelector('optgroup[label="Existing Galleries"]');

            if (optgroup) {
                const options = optgroup.querySelectorAll('option');
                options.forEach(option => {
                    const token = option.value;
                    const title = option.textContent.trim();
                    if (token && token !== '-1' && !isNaN(token)) {
                        existingGalleries.push({
                            token: token,
                            title: title
                        });
                    }
                });
            }

            return existingGalleries;
        } catch (error) {
            console.error('Ошибка при получении списка галерей ImageBam:', error);
            throw error; // Пробрасываем ошибку для обработки в UI
        }
    }

    // Функция обновления списка галерей в настройках
    async function updateImageBamGalleries() {
        try {
            const galleries = await fetchImageBamGalleries();
            settings.imagebam.availableGalleries = galleries;
            saveSettings();
            return galleries;
        } catch (error) {
            console.error('Ошибка при обновлении списка галерей ImageBam:', error);
            throw error;
        }
    }

    // Утилитарные функции стилизации
    function addScriptStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fastpicext-upload-progress {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 9999;
            }

            #fastpicext-notifications-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }

            .fastpicext-notification {
                background: #fff;
                padding: 10px 20px;
                margin-bottom: 10px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                pointer-events: auto;
                max-width: 300px;
                word-wrap: break-word;
                border: 1px solid #e0e0e0;
            }

            .fastpicext-notification a {
                color: #0066cc;
                text-decoration: none;
            }

            .fastpicext-notification a:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }

    // Функция для определения текущего сайта
    function getCurrentSite() {
        const hostname = window.location.hostname;
        if (hostname.includes('rutracker')) return 'rutracker';
        if (hostname.includes('nnmclub')) return 'nnmclub';
        if (hostname.includes('tapochek')) return 'tapochek';
        if (hostname.includes('4pda')) return '4pda';
        return null;
    }

    // Функция для поиска textarea
    function findTextarea() {
        const site = getCurrentSite();

        switch(site) {
            case 'rutracker':
                return document.querySelector('#post-textarea');
            case 'tapochek':
                return document.querySelector('textarea.editor[name="message"]');
            case 'nnmclub':
                return document.querySelector('#post_body');
            case '4pda':
                return document.querySelector('#ed-0_textarea') || document.querySelector('.ed-textarea');
            default:
                return null;
        }
    }

    // Функция для показа уведомлений
    function showNotification(message, duration = 3000, sessionUrl = '') {
        // Создаем или находим контейнер для уведомлений
        let notificationContainer = document.getElementById('fastpicext-notifications-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'fastpicext-notifications-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(notificationContainer);
        }

        const notification = document.createElement('div');
        notification.className = 'fastpicext-notification';
        notification.style.cssText = `
            background: #fff;
            padding: 10px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            pointer-events: auto;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            border: 1px solid #e0e0e0;
        `;

        if (sessionUrl) {
            const link = document.createElement('a');
            link.href = sessionUrl;
            link.target = '_blank';
            link.textContent = message;
            link.style.cssText = 'color: #0066cc; text-decoration: none;';
            link.addEventListener('mouseover', () => link.style.textDecoration = 'underline');
            link.addEventListener('mouseout', () => link.style.textDecoration = 'none');
            notification.appendChild(link);
        } else {
            notification.textContent = message;
        }

        // Добавляем уведомление в контейнер
        notificationContainer.appendChild(notification);

        // Анимация появления
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Удаление уведомления
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }

                // Удаляем контейнер, если он пустой
                if (notificationContainer.children.length === 0) {
                    notificationContainer.remove();
                }
            }, 300);
        }, duration);
    }

    // Функция для для сохранения в историю
    function saveToHistory(sessionUrl, service, imageCount) {
        if (!settings.uploadHistory.enabled || !sessionUrl) return;

        settings.uploadHistory.items.unshift({
            url: sessionUrl,
            service: service,
            imageCount: imageCount,
            date: new Date().toLocaleString('ru-RU'),
            timestamp: Date.now()
        });

        // Ограничиваем количество
        if (settings.uploadHistory.items.length > settings.uploadHistory.maxItems) {
            settings.uploadHistory.items.length = settings.uploadHistory.maxItems;
        }

        saveSettings();
    }

    // Функция форматирования кода
    function formatCode(image) {
        const serviceSettings = settings[settings.uploadService];

        // Форматы FastPic и New.FastPic
        if (settings.uploadService === 'fastpic' || settings.uploadService === 'newfastpic') {
            const formats = {
                direct: image.imagePath,
                bb_thumb: `[URL=${image.viewUrl}][IMG]${image.thumbPath}[/IMG][/URL]`,
                bb_full: `[URL=${image.viewUrl}][IMG]${image.imagePath}[/IMG][/URL]`,
                html_thumb: `<a href="${image.viewUrl}" target="_blank"><img src="${image.thumbPath}" border="0"></a>`,
                markdown_thumb: `[![FastPic.Ru](${image.thumbPath})](${image.viewUrl})`
            };

            return formats[serviceSettings.codeFormat]
                .replace('{viewUrl}', image.viewUrl)
                .replace('{imagePath}', image.imagePath)
                .replace('{thumbPath}', image.thumbPath);
        }

        // Форматы ImgBB
        else if (settings.uploadService === 'imgbb') {
            const formats = {
                viewer_link: image.url_viewer,  // Ссылка на просмотр
                direct: image.url,  // Прямая ссылка

                html_image: `<img src="${image.url}" alt="${image.name}" border="0">`,  // HTML-код изображения
                html_full_linked: `<a href="${image.url_viewer}"><img src="${image.url}" alt="${image.name}" border="0"></a>`,  // HTML-код полноразмерного со ссылкой
                html_medium_linked: `<a href="${image.url_viewer}"><img src="${image.medium?.url || image.url}" alt="${image.name}" border="0"></a>`,  // HTML-код среднего размера со ссылкой
                html_thumb_linked: `<a href="${image.url_viewer}"><img src="${image.thumb.url}" alt="${image.name}" border="0"></a>`,  // HTML-код миниатюры со ссылкой

                bb_full: `[img]${image.url}[/img]`,  // BB-код полноразмерного
                bb_full_linked: `[url=${image.url_viewer}][img]${image.url}[/img][/url]`,  // BB-код полноразмерного со ссылкой
                bb_medium_linked: `[url=${image.url_viewer}][img]${image.medium?.url || image.url}[/img][/url]`,  // BB-код среднего размера со ссылкой
                bb_thumb_linked: `[url=${image.url_viewer}][img]${image.thumb.url}[/img][/url]`  // BB-код миниатюры со ссылкой
            };

            return formats[serviceSettings.codeFormat]
                .replace('{viewUrl}', image.url_viewer)
                .replace('{imagePath}', image.url)
                .replace('{thumbPath}', image.thumb.url)
                .replace('{mediumPath}', image.medium?.url || image.url);

        }

        // Форматы ImageBam
        else if (settings.uploadService === 'imagebam') {
            const formats = {
                direct: image.url_viewer,  // Прямая ссылка - ссылка на просмотр
                bb_thumb: `[URL=${image.url_viewer}][IMG]${image.thumb.url}[/IMG][/URL]`,  // BB-код с превью
                html_thumb: `<a href="${image.url_viewer}" target="_blank"><img src="${image.thumb.url}" alt=""/></a>`  // HTML-код
            };
            return formats[serviceSettings.codeFormat]
                .replace('{viewUrl}', image.url_viewer)
                .replace('{imagePath}', image.thumb.url.replace('_t.', '.'))
                .replace('{thumbPath}', image.thumb.url);
        }
    }

    // Функция для парсинга ответа FastPic
    function parseFastPicResponse(responseText) {
        // Ищем все блоки UploadSettings в ответе
        const uploadSettingsRegex = /<UploadSettings[^>]*>([\s\S]*?)<\/UploadSettings>/g;
        const results = [];
        let match;

        while ((match = uploadSettingsRegex.exec(responseText)) !== null) {
            const settingsXml = match[0];

            // Извлекаем нужные значения из каждого блока
            const status = settingsXml.match(/<status>([^<]+)<\/status>/)?.[1];

            if (status === 'ok') {
                const imagePath = settingsXml.match(/<imagepath>([^<]+)<\/imagepath>/)?.[1];
                const thumbPath = settingsXml.match(/<thumbpath>([^<]+)<\/thumbpath>/)?.[1];
                const viewUrl = settingsXml.match(/<viewurl>([^<]+)<\/viewurl>/)?.[1];
                const sessionUrl = settingsXml.match(/<sessionurl>([^<]+)<\/sessionurl>/)?.[1];

                if (imagePath && thumbPath && viewUrl) {
                    results.push({
                        imagePath,
                        thumbPath,
                        viewUrl,
                        sessionUrl
                    });
                }
            } else {
                const error = settingsXml.match(/<error>([^<]+)<\/error>/)?.[1] || 'Неизвестная ошибка';
                throw new Error(error);
            }
        }

        // Извлекаем URL сессии из XML ответа FastPic
        const sessionUrl = responseText.match(/<viewurl>([^<]+)<\/viewurl>/)?.[1] || '';

        return { results, sessionUrl };
    }

    // Функция для загрузки на FastPic
    async function uploadToFastPic(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`file${i + 1}`, files[i]);
        }

        // Добавляем параметры FastPic
        formData.append('uploading', files.length.toString());

        // Добавляем настройки превью
        formData.append('check_thumb', settings.fastpic.thumb.checkThumb);
        formData.append('thumb_text', settings.fastpic.thumb.thumbText);

        formData.append('thumb_size', settings.fastpic.thumb.thumbSize);
        if (settings.fastpic.thumb.thumbSizeVertical) {
            formData.append('check_thumb_size_vertical', '1');
        }

        // Добавляем настройки изображения
        if (settings.fastpic.image.origResize.enabled) {
            formData.append('check_orig_resize', '1');
            formData.append('res_select', settings.fastpic.image.origResize.resSelect);
            formData.append('orig_resize', settings.fastpic.image.origResize.customSize);
        } else {
            // Явно отключаем изменение размера
            formData.append('check_orig_resize', '0');
            formData.append('res_select', '0');
            formData.append('orig_resize', '0');
        }

        if (settings.fastpic.image.origRotate.enabled) {
            formData.append('check_orig_rotate', '1');
            formData.append('orig_rotate', settings.fastpic.image.origRotate.value);
        }

        if (settings.fastpic.image.optimization.enabled) {
            formData.append('check_optimization', 'on');
            formData.append('jpeg_quality', settings.fastpic.image.optimization.jpegQuality);
        }

        if (settings.fastpic.image.poster) {
            formData.append('check_poster', 'on');
        }

        formData.append('submit', 'Загрузить');

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://fastpic.org/upload?api=1',
                data: formData,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error)
            });
        });

        return parseFastPicResponse(response.responseText);
    }

    // Функция для загрузки на New.FastPic
    async function uploadToNewFastPic(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`file${i + 1}`, files[i]);
        }

        // Добавляем параметры New FastPic
        formData.append('uploading', files.length.toString());

        // Логика работы с альбомами
        if (settings.newfastpic.useExistingAlbum && settings.newfastpic.selectedAlbumId) {
            // Используем существующий альбом - передаем только upload_id
            formData.append('upload_id', settings.newfastpic.selectedAlbumId);
        } else if (settings.newfastpic.albumName) {
            // Создаем новый альбом - передаем upload_id + album_name
            // Для новой галереи можно использовать любой upload_id или не передавать вовсе
            formData.append('album_name', settings.newfastpic.albumName);
        }

        formData.append('fp', 'not-loaded');

        // Добавляем настройки превью
        formData.append('check_thumb', settings.newfastpic.thumb.checkThumb);
        formData.append('thumb_text', settings.newfastpic.thumb.thumbText);
        formData.append('thumb_size', settings.newfastpic.thumb.thumbSize);
        formData.append('check_thumb_size_vertical', settings.newfastpic.thumb.thumbSizeVertical.toString());

        // Добавляем настройки изображения
        formData.append('check_orig_resize', settings.newfastpic.image.origResize.enabled.toString());
        if (settings.newfastpic.image.origResize.enabled) {
            formData.append('orig_resize', settings.newfastpic.image.origResize.customSize);
        }
        formData.append('check_optimization', settings.newfastpic.image.optimization.enabled.toString());
        if (settings.newfastpic.image.optimization.enabled) {
            formData.append('jpeg_quality', settings.newfastpic.image.optimization.jpegQuality);
        }

        formData.append('check_poster', settings.newfastpic.image.poster.toString());
        formData.append('delete_after', settings.newfastpic.deleteAfter);

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://new.fastpic.org/v2upload/',
                data: formData,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error)
            });
        });

        const data = JSON.parse(response.responseText);
        // console.log('Server response:', response.responseText);
        // console.log('New FastPic parsed data:', data);

        // Преобразуем URL в абсолютные с помощью URL API
        const BASE_URL = 'https://new.fastpic.org';
        const makeAbsolute = url => url ? (url.startsWith('http') ? url : new URL(url, BASE_URL).href) : url;

        // Применяем преобразование ко всем URL
        const links = {
            direct: makeAbsolute(data.direct_link),
            thumb: makeAbsolute(data.thumb_link),
            view: makeAbsolute(data.view_link),
            album: makeAbsolute(data.album_link)
        };

        // Определяем URL для сессии (альбом > сессия > просмотр)
        const sessionUrl = links.album ||
                          (data.session_id ? `${BASE_URL}/session/${data.session_id}` : links.view);

        return {
            results: [{
                imagePath: links.direct,
                thumbPath: links.thumb,
                viewUrl: links.view,
                albumUrl: links.album,
                sessionId: data.session_id
            }],
            sessionUrl: sessionUrl
        };
    }

    // Функция для загрузки на ImgBB
    async function uploadToImgBB(file) {
        if (!settings.imgbb.apiKey) {
            throw new Error(`Требуется API ключ ImgBB`);
        }

        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const formData = new FormData();
        formData.append('image', base64);

        // Передаем имя файла только если включена опция
        if (settings.imgbb.useOriginalFilename) {
            formData.append('name', file.name);
        }

        // Добавляем параметр только если выбран срок хранения
        if (settings.imgbb.expiration) {
            formData.append('expiration', settings.imgbb.expiration);
        }

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://api.imgbb.com/1/upload?key=${settings.imgbb.apiKey}`,
                data: formData,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error)
            });
        });

        const data = JSON.parse(response.responseText);
        if (!data.success) {
            throw new Error(data.error?.message || 'Ошибка загрузки на ImgBB');
        }

        // console.log('Server response:', response.responseText);
        // console.log('Parsed data:', data);

        return data.data;
    }

    // Функция для загрузки на ImageBam
    async function uploadToImageBam(file) {
        // Получаем XSRF-токен
        const sessionResponse = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.imagebam.com/',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Referer': 'https://www.imagebam.com/',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                onload: resolve,
                onerror: resolve,
                ontimeout: resolve
            });
        });

        const xsrfToken = sessionResponse.responseHeaders.match(/XSRF-TOKEN=([^;]+)/)?.[1];
        if (!xsrfToken) throw new Error('Не удалось получить XSRF-токен');

        // Формируем данные для создания сессии
        let data = `thumbnail_size=${settings.imagebam.thumbnailSize}&content_type=${settings.imagebam.contentType}&comments_enabled=false`;

        // Логика для галерей
        if (settings.imagebam.galleryEnabled) {
            data += '&gallery=true';

            // Если используется существующая галерея
            if (settings.imagebam.useExistingGallery && settings.imagebam.selectedGalleryToken) {
                data += `&gallery_token=${settings.imagebam.selectedGalleryToken}&gallery_title=`;
            }
            // Если создается новая галерея
            else if (settings.imagebam.galleryTitle) {
                data += `&gallery_token=&gallery_title=${encodeURIComponent(settings.imagebam.galleryTitle)}`;
            }
        }

        // Создаем сессию
        const uploadSessionResponse = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.imagebam.com/upload/session',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    'Cookie': `XSRF-TOKEN=${xsrfToken}`,
                    'Accept': 'application/json'
                },
                data: data,
                onload: resolve
            });
        });

        const sessionData = JSON.parse(uploadSessionResponse.responseText);
        if (!sessionData.session) throw new Error('Ошибка создания сессии: отсутствует параметр session');

        // Загружаем файл
        const formData = new FormData();
        formData.append('data', sessionData.data);
        formData.append('files[0]', file);

        const uploadResponse = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://www.imagebam.com/upload?session=${sessionData.session}`,
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    'Cookie': `XSRF-TOKEN=${xsrfToken}`
                },
                data: formData,
                onload: resolve
            });
        });

        const uploadResult = JSON.parse(uploadResponse.responseText);
        if (!uploadResult.success) throw new Error('Ошибка загрузки');

        // Получаем BB-код
        const completeResponse = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: uploadResult.success,
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    'Cookie': `XSRF-TOKEN=${xsrfToken}`
                },
                onload: resolve
            });
        });

        // Ищем BB-код в input'ах
        const doc = new DOMParser().parseFromString(completeResponse.responseText, 'text/html');
        const bbcode = Array.from(doc.querySelectorAll('input[type="text"]'))
            .map(input => input.value)
            .find(value => value.includes('[URL=') && value.includes('_t.'));

        if (!bbcode) throw new Error('Не удалось найти BB-код');

        // Извлекаем URL
        const urlMatch = bbcode.match(/\[URL=([^\]]+)\]/);
        const imgMatch = bbcode.match(/\[IMG\]([^\]]+)\[\/IMG\]/);

        if (!urlMatch || !imgMatch) throw new Error('Неправильный формат BB-кода');

        return {
            url: imgMatch[1].replace('_t.', '.'),
            url_viewer: urlMatch[1],
            thumb: { url: imgMatch[1] },
            session: sessionData.session
        };
    }

    // Функция для загрузки изображений
    async function uploadImages(files) {
        switch (settings.uploadService) {
            case 'fastpic':
                return await uploadToFastPic(files);

            case 'newfastpic':
                return await uploadToNewFastPic(files);

            case 'imgbb':
                const imgbbResults = [];
                for (const file of files) {
                    const result = await uploadToImgBB(file);
                    imgbbResults.push(result);
                }
                return { results: imgbbResults };

            case 'imagebam':
                const imagebamResults = [];
                for (const file of files) {
                    const result = await uploadToImageBam(file);
                    imagebamResults.push(result);
                }
                return { results: imagebamResults };

            default:
                throw new Error('Неподдерживаемый сервис загрузки');
        }
    }

    // Общая функция обработки загрузки изображений
    async function handleImageUpload(files) {
        if (files.length === 0) return;

        // Проверка форматов и размера
        const allowedFormats = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
        const maxFileSizes = {
            'fastpic': 25 * 1024 * 1024,  // 25MB
            'newfastpic': 25 * 1024 * 1024,  // 25MB
            'imgbb': 32 * 1024 * 1024,    // 32MB
            'imagebam': 16 * 1024 * 1024,
        };
        const maxFiles = {
            'fastpic': 30,
            'newfastpic': 30,
            'imgbb': 30,
            'imagebam': 30,
        };

        const maxFileSize = maxFileSizes[settings.uploadService];
        const maxFileCount = maxFiles[settings.uploadService];

        // Фильтруем файлы по формату и размеру
        const validFiles = Array.from(files).filter(file => {
            if (!allowedFormats.includes(file.type)) {
                showNotification(`Файл ${file.name} имеет неподдерживаемый формат. Разрешены: gif, jpeg, png, webp, bmp`);
                return false;
            }
            if (file.size > maxFileSize) {
                showNotification(`Файл ${file.name} превышает максимальный размер в ${Math.floor(maxFileSize / 1024 / 1024)}MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            showNotification('Нет подходящих файлов для загрузки');
            return;
        }

        if (validFiles.length > maxFileCount) {
            showNotification(`Можно загрузить максимум ${maxFileCount} файлов одновременно`);
            return false;
        }

        // Создаем индикатор прогресса
        const progressDiv = document.createElement('div');
        progressDiv.className = 'fastpicext-upload-progress';
        document.body.appendChild(progressDiv);

        const textarea = findTextarea();
        if (!textarea) return;

        // Сохраняем позицию курсора
        const cursorPos = textarea.selectionStart;
        let formattedCode = '';

        try {
            progressDiv.textContent = `Загрузка ${validFiles.length} изображений...`;

            const { results: images, sessionUrl: uploadSessionUrl } = await uploadImages(validFiles);

            // Получаем sessionUrl в зависимости от сервиса
            let sessionUrl = null;

            // Для FastPic берем sessionUrl из ответа
            if (settings.uploadService === 'fastpic') {
                sessionUrl = images[0]?.sessionUrl;
            }

            // Для ImageBam формируем ссылку на сессию
            else if (settings.uploadService === 'imagebam') {
                sessionUrl = `https://www.imagebam.com/upload/complete?session=${images[0]?.session}`;
            }

            // Для New FastPic используем sessionUrl полученный при загрузке
            else if (settings.uploadService === 'newfastpic') {
                sessionUrl = uploadSessionUrl;
            }

            // Для ImgBB используем url_viewer
            else if (settings.uploadService === 'imgbb') {
                sessionUrl = images[0]?.url_viewer;
            }

            // Формируем код для всех изображений
            let formattedCode = images.map(image => formatCode(image)).join(' ');

            // Вставляем formattedCode в текстовое поле
            const textBefore = textarea.value.substring(0, cursorPos);
            const textAfter = textarea.value.substring(cursorPos);
            textarea.value = textBefore + formattedCode + textAfter;
            textarea.selectionStart = textarea.selectionEnd = cursorPos + formattedCode.length;

            // Сохраняем в историю
            saveToHistory(sessionUrl, settings.uploadService, images.length);

            showNotification(`Успешно загружено ${images.length} изображений`, 15000, sessionUrl);
        } catch (error) {
            console.error('Ошибка при загрузке изображений:', error);
            showNotification(`Ошибка при загрузке изображений: ${error.message}`, 5000);
        } finally {
            setTimeout(() => progressDiv.remove(), 3000);
        }
    }

    // Создание меню настроек
    function createSettingsMenu() {
        const site = getCurrentSite();
        if (!site) return;

        const menuButton = document.createElement('input');
        menuButton.type = 'button';
        menuButton.value = 'Настройки FastPic Upload';
        menuButton.id = 'fastpicext-settings-btn';
        menuButton.style.cssText = 'margin: 0 5px;';

        // стили
        if (site === '4pda') {
            menuButton.className = 'zbtn zbtn-default';
        } else if (site === 'nnmclub') {
            menuButton.className = 'input mainoption';
        }

        // Добавление кнопки в зависимости от сайта
        switch(site) {
            case 'rutracker':
                const rutrackerNav = document.querySelector('#ped-submit-buttons');
                if (rutrackerNav) {
                    rutrackerNav.appendChild(menuButton);
                }
                break;

            case 'tapochek':
                const tapochekNav = document.querySelector('.mrg_4.tCenter');
                if (tapochekNav) {
                    tapochekNav.appendChild(menuButton);
                }
                break;

            case 'nnmclub':
                const nnmNav = document.querySelector('td.row2[align="center"][valign="middle"][style*="padding: 6px"]');
                if (nnmNav) {
                    nnmNav.appendChild(menuButton);
                }
                break;

            case '4pda':
                const pdaNav = document.querySelector('.dfrms.text-center') || document.querySelector('div[style*="margin-top:3px"]');
                if (pdaNav) {
                    pdaNav.appendChild(menuButton);
                }
                break;
        }

        menuButton.addEventListener('click', showSettingsDialog);
    }

    // Создание переключателя сервисов
    function createServiceSwitcher() {
        const site = getCurrentSite();
        if (!site) return;

        const switcher = document.createElement('select');
        switcher.id = 'fastpicext-service-switcher';
        switcher.style.cssText = 'margin: 0 5px;';

        // Добавляем опции
        switcher.innerHTML = `
            <option value="fastpic">FastPic</option>
            <option value="newfastpic">New FastPic</option>
            <option value="imgbb">ImgBB</option>
            <option value="imagebam">ImageBam</option>
        `;

        // Устанавливаем текущее значение
        switcher.value = settings.uploadService;

        // Стили в зависимости от сайта
        if (site === '4pda') {
            switcher.className = 'zbtn zbtn-default';
        } else if (site === 'nnmclub') {
            switcher.className = 'input mainoption';
        }

        // Обработчик изменения
        switcher.addEventListener('change', (e) => {
            settings.uploadService = e.target.value;
            saveSettings();
            showNotification(`Выбран сервис: ${e.target.options[e.target.selectedIndex].text}`);
        });

        // Добавление на страницу (находим кнопку настроек и вставляем после нее)
        const settingsBtn = document.querySelector('#fastpicext-settings-btn');
        if (settingsBtn) {
            settingsBtn.insertAdjacentElement('afterend', switcher);
        }
    }

    // Создание диалога настроек
    function showSettingsDialog(e) {
        if (e) e.preventDefault();

        const dialog = document.createElement('div');
        dialog.className = 'fastpicext-settings-dialog';
        dialog.innerHTML = `
            <style>
                .fastpicext-settings-dialog {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    z-index: 10000;
                    min-width: 300px;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                .fastpicext-settings-dialog h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                }
                .settings-container {
                    display: flex;
                    gap: 20px;
                }
                .settings-left {
                    flex: 1;
                    min-width: 400px;
                }
                .settings-right {
                    width: 300px;
                    border-left: 2px solid #eee;
                    padding-left: 20px;
                }
                .fastpicext-settings-dialog .setting-group {
                    margin-bottom: 15px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .fastpicext-settings-dialog label {
                    display: block;
                    margin-bottom: 5px;
                }
                .fastpicext-settings-dialog select,
                .fastpicext-settings-dialog input[type="text"] {
                    width: 100%;
                    padding: 5px;
                    margin-bottom: 10px;
                }
                .fastpicext-settings-dialog .buttons {
                    text-align: right;
                    margin-top: 15px;
                    display: flex;
                    justify-content: space-between;
                }
                .fastpicext-settings-dialog .right-buttons {
                    display: flex;
                    gap: 10px;
                }
                .fastpicext-settings-dialog button.reset {
                    background-color: #fff;
                    color: black;
                    border: none;
                    padding: 5px 5px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .fastpicext-settings-dialog button.reset:hover {
                    background-color: #fff;
                }
                .fastpicext-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                }
                .service-settings {
                    display: none;
                }
                .service-settings.active {
                    display: block;
                }
                #history-list {
                    max-height: calc(80vh - 200px);
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    padding: 5px;
                    background: #f9f9f9;
                    border-radius: 4px;
                }
            </style>
            <h3>Настройки FastPic Upload</h3>
            <div class="settings-container">
                <div class="settings-left">
                    <div class="setting-group">
                        <label>Сервис загрузки:</label>
                        <select id="uploadService">
                            <option value="fastpic">FastPic</option>
                            <option value="newfastpic">New FastPic</option>
                            <option value="imgbb">ImgBB</option>
                            <option value="imagebam">ImageBam</option>
                        </select>
                    </div>

                    <!-- Настройки FastPic -->
                    <div id="fastpic-settings" class="service-settings setting-group">
                        <h4>Настройки FastPic</h4>

                        <!-- Existing code format setting -->
                        <label>Формат кода:</label>
                        <select id="fastpic-codeFormat">
                            <option value="direct">Прямая ссылка</option>
                            <option value="bb_thumb">BB-код (превью)</option>
                            <option value="bb_full">BB-код (большое изображение)</option>
                            <option value="html_thumb">HTML</option>
                            <option value="markdown_thumb">Markdown</option>
                        </select>

                        <!-- Настройки превью -->
                        <div class="setting-group">
                            <h5>Настройки превью</h5>
                            <label>Тип превью:</label>
                            <select id="fastpic-checkThumb">
                                <option value="size">Размер</option>
                                <option value="text">Текст</option>
                                <option value="filename">Имя файла</option>
                                <option value="no">Без надписи</option>
                            </select>
                            <div id="fastpic-thumbText-container">
                                <label>Текст превью:</label>
                                <input type="text" id="fastpic-thumbText" value="Увеличить">
                            </div>
                            <label>Размер превью (px):</label>
                            <input type="number" id="fastpic-thumbSize" min="1" max="999" value="150">
                            <label>
                                <input type="checkbox" id="fastpic-thumbSizeVertical">
                                по высоте
                            </label>
                        </div>

                        <!-- Настройки изображения -->
                        <div class="setting-group">
                            <h5>Настройки изображения</h5>

                            <!-- Изменение размера -->
                            <label>
                                <input type="checkbox" id="fastpic-origResizeEnabled">
                                Уменьшить
                            </label>
                            <div id="fastpic-resizeOptions" style="margin-left: 20px;">
                                <label>Предустановленный размер:</label>
                                <select id="fastpic-resSelect">
                                    <option value="150">150px</option>
                                    <option value="320">320px</option>
                                    <option value="500">500px</option>
                                    <option value="640">640px</option>
                                    <option value="800">800px</option>
                                </select>
                                <label>Размер по вертикали (px):</label>
                                <input type="number" id="fastpic-customSize" value="500">
                            </div>

                            <!-- Настройки поворота -->
                            <label>
                                <input type="checkbox" id="fastpic-origRotateEnabled">
                                Повернуть
                            </label>
                            <div id="fastpic-rotateOptions" style="margin-left: 20px;">
                                <select id="fastpic-origRotate">
                                    <option value="0">0°</option>
                                    <option value="90">90° по часовой</option>
                                    <option value="180">180°</option>
                                    <option value="270">90° против часовой</option>
                                </select>
                            </div>

                            <!-- Оптимизация -->
                            <label>
                                <input type="checkbox" id="fastpic-optimizationEnabled">
                                Оптимизировать в JPEG
                            </label>
                            <div id="fastpic-optimizationOptions" style="margin-left: 20px;">
                                <label>Качество JPEG (0-99):</label>
                                <input type="number" id="fastpic-jpegQuality" min="0" max="99" value="85">
                            </div>

                            <!-- Настройки постера -->
                            <label>
                                <input type="checkbox" id="fastpic-poster">
                                Постер
                            </label>
                        </div>
                    </div>

                    <!-- Настройки New.FastPic -->
                    <div id="newfastpic-settings" class="service-settings setting-group">
                        <h4>Настройки New FastPic</h4>

                        <!-- Existing code format setting -->
                        <label>Формат кода:</label>
                        <select id="newfastpic-codeFormat">
                            <option value="direct">Прямая ссылка</option>
                            <option value="bb_thumb">BB-код (превью)</option>
                            <option value="bb_full">BB-код (большое изображение)</option>
                            <option value="html_thumb">HTML</option>
                            <option value="markdown_thumb">Markdown</option>
                        </select>

                        <!-- Настройки превью -->
                        <div class="setting-group">
                            <h5>Настройки превью</h5>
                            <label>Тип превью:</label>
                            <select id="newfastpic-checkThumb">
                                <option value="size">Размер</option>
                                <option value="text">Текст</option>
                                <option value="filename">Имя файла</option>
                                <option value="no">Без надписи</option>
                            </select>
                            <div id="newfastpic-thumbText-container">
                                <label>Текст превью:</label>
                                <input type="text" id="newfastpic-thumbText" value="Увеличить">
                            </div>
                            <label>Размер превью (px):</label>
                            <input type="number" id="newfastpic-thumbSize" min="1" max="999" value="150">
                            <label>
                                <input type="checkbox" id="newfastpic-thumbSizeVertical">
                                по высоте
                            </label>
                        </div>

                        <!-- Настройки изображения -->
                        <div class="setting-group">
                            <h5>Настройки изображения</h5>

                            <!-- Изменение размера -->
                            <label>
                                <input type="checkbox" id="newfastpic-origResizeEnabled">
                                Уменьшить
                            </label>
                            <div id="newfastpic-resizeOptions" style="margin-left: 20px;">
                                <label>Размер (px):</label>
                                <input type="number" id="newfastpic-customSize" value="1200">
                            </div>

                            <!-- Оптимизация -->
                            <label>
                                <input type="checkbox" id="newfastpic-optimizationEnabled">
                                Оптимизировать в JPEG
                            </label>
                            <div id="newfastpic-optimizationOptions" style="margin-left: 20px;">
                                <label>Качество JPEG (0-99):</label>
                                <input type="number" id="newfastpic-jpegQuality" min="0" max="99" value="80">
                            </div>

                            <!-- Постер -->
                            <label>
                                <input type="checkbox" id="newfastpic-poster">
                                Постер
                            </label>
                        </div>

                        <!-- Удаление -->
                        <div class="setting-group">
                            <h5>Автоудаление</h5>
                            <select id="newfastpic-deleteAfter">
                                <option value="0">Не удалять</option>
                                <option value="1">Через 1 минуту</option>
                                <option value="5">Через 5 минут</option>
                                <option value="10">Через 10 минут</option>
                                <option value="60">Через 1 час</option>
                                <option value="1440">Через 1 день</option>
                            </select>
                        </div>

                        <!-- Настройки альбомов для New FastPic -->
                        <div class="setting-group">
                            <h5>Альбомы</h5>

                            <!-- Выбор между новым и существующим альбомом -->
                            <div>
                                <label>
                                    <input type="radio" name="newfastpic-album-type" value="new" id="newfastpic-new-album"> Создать новый альбом
                                </label>
                            </div>
                            <div id="newfastpic-new-album-options" style="margin-left: 20px; margin-top: 5px;">
                                <label>Название альбома:</label>
                                <input type="text" id="newfastpic-albumName" placeholder="Введите название альбома">
                            </div>

                            <div style="margin-top: 10px;">
                                <label>
                                    <input type="radio" name="newfastpic-album-type" value="existing" id="newfastpic-existing-album"> Использовать существующий альбом
                                </label>
                            </div>
                            <div id="newfastpic-existing-album-options" style="margin-left: 20px; margin-top: 5px;">
                                <label>Выберите альбом:</label>
                                <select id="newfastpic-selectedAlbum">
                                    <option value="">Сначала обновите список альбомов</option>
                                </select>
                                <button type="button" id="newfastpic-refresh-albums" style="margin-top: 5px; padding: 5px 10px;">
                                    🔄 Обновить список альбомов
                                </button>
                                <div id="newfastpic-albums-status" style="margin-top: 5px; font-size: 12px; color: #666;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Настройки ImgBB -->
                    <div id="imgbb-settings" class="service-settings setting-group">
                        <h4>Настройки ImgBB</h4>
                        <label><a href="https://api.imgbb.com/" target="_blank">API ключ ImgBB</a>:</label>
                        <input type="text" id="imgbb-apiKey" placeholder="Введите API ключ ImgBB">
                        <label>Формат кода:</label>
                        <select id="imgbb-codeFormat">
                            <option value="viewer_link">Ссылка на просмотр</option>
                            <option value="direct">Прямая ссылка</option>
                            <option value="html_image">HTML-код изображения</option>
                            <option value="html_full_linked">HTML-код полноразмерного со ссылкой</option>
                            <option value="html_medium_linked">HTML-код среднего размера со ссылкой</option>
                            <option value="html_thumb_linked">HTML-код миниатюры со ссылкой</option>
                            <option value="bb_full">BB-код полноразмерного</option>
                            <option value="bb_full_linked">BB-код полноразмерного со ссылкой</option>
                            <option value="bb_medium_linked">BB-код среднего размера со ссылкой</option>
                            <option value="bb_thumb_linked">BB-код миниатюры со ссылкой</option>
                        </select>
                        <label>Срок хранения:</label>
                        <select id="imgbb-expiration">
                            <option value="" selected="">Никогда не удалять</option>
                            <option value="60">1 минута</option>
                            <option value="300">5 минут</option>
                            <option value="900">15 минут</option>
                            <option value="1800">30 минут</option>
                            <option value="3600">1 час</option>
                            <option value="10800">3 часа</option>
                            <option value="21600">6 часов</option>
                            <option value="43200">12 часов</option>
                            <option value="86400">1 день</option>
                            <option value="172800">2 дня</option>
                            <option value="259200">3 дня</option>
                            <option value="345600">4 дня</option>
                            <option value="432000">5 дней</option>
                            <option value="518400">6 дней</option>
                            <option value="604800">1 неделя</option>
                            <option value="1209600">2 недели</option>
                            <option value="1814400">3 недели</option>
                            <option value="2592000">1 месяц</option>
                            <option value="5184000">2 месяца</option>
                            <option value="7776000">3 месяца</option>
                            <option value="10368000">4 месяца</option>
                            <option value="12960000">5 месяцев</option>
                            <option value="15552000">6 месяцев</option>
                        </select>
                        <label>
                            <input type="checkbox" id="imgbb-useOriginalFilename"> Оригинальное имя файла
                        </label>
                    </div>

                    <!-- Настройки ImageBam -->
                    <div id="imagebam-settings" class="service-settings setting-group">
                        <h4>Настройки ImageBam</h4>
                        <label>Формат кода:</label>
                        <select id="imagebam-codeFormat">
                            <option value="direct">Прямая ссылка</option>
                            <option value="bb_thumb">BB-код (превью)</option>
                            <option value="html_thumb">HTML-код</option>
                        </select>
                        <label>Размер превью:</label>
                        <select id="imagebam-thumbnailSize">
                            <option value="1">100x100 (small)</option>
                            <option value="2">180x180 (standard)</option>
                            <option value="3">250x250 (large)</option>
                            <option value="4">300x300 (extra large)</option>
                        </select>
                        <label>Тип контента:</label>
                        <select id="imagebam-contentType">
                            <option value="sfw">Family Safe Content</option>
                            <option value="nsfw">Adult Content</option>
                        </select>

                        <!-- Настройки галерей для ImageBam -->
                        <div>
                            <label>
                                <input type="checkbox" id="imagebam-galleryEnabled"> Использовать галерею
                            </label>
                        </div>
                        <div id="imagebam-gallery-options" style="display:none; margin-left: 20px; margin-top: 10px;">
                            <!-- Выбор между новой и существующей галереей -->
                            <div>
                                <label>
                                    <input type="radio" name="imagebam-gallery-type" value="new" id="imagebam-new-gallery"> Создать новую галерею
                                </label>
                            </div>
                            <div id="imagebam-new-gallery-options" style="margin-left: 20px; margin-top: 5px;">
                                <label>Название галереи:</label>
                                <input type="text" id="imagebam-galleryTitle" placeholder="Введите название галереи">
                            </div>

                            <div style="margin-top: 10px;">
                                <label>
                                    <input type="radio" name="imagebam-gallery-type" value="existing" id="imagebam-existing-gallery"> Использовать существующую галерею
                                </label>
                            </div>
                            <div id="imagebam-existing-gallery-options" style="margin-left: 20px; margin-top: 5px;">
                                <label>Выберите галерею:</label>
                                <select id="imagebam-selectedGallery">
                                    <option value="">Сначала обновите список галерей</option>
                                </select>
                                <button type="button" id="imagebam-refresh-galleries" style="margin-top: 5px; padding: 5px 10px;">
                                    🔄 Обновить список галерей
                                </button>
                                <div id="imagebam-galleries-status" style="margin-top: 5px; font-size: 12px; color: #666;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                    <!-- История загрузок -->
                <div class="settings-right">
                    <h4>История загрузок</h4>
                    <label>
                        <input type="checkbox" id="history-enabled"> Сохранять историю
                    </label>
                    <div style="display: flex; justify-content: space-between; margin: 10px 0 5px;">
                        <span style="font-size: 12px; color: #666;">Записей: <span id="history-count">0</span></span>
                        <button type="button" id="clear-history" style="padding: 2px 8px; font-size: 11px;">Очистить все</button>
                    </div>
                    <div id="history-list"></div>
                </div>
            </div>

            <div class="buttons">
                <button class="reset" id="resetSettings">Сброс</button>
                <div class="right-buttons">
                    <button id="cancelSettings">Отмена</button>
                    <button id="saveSettings">Сохранить</button>
                </div>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'fastpicext-overlay';
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        overlay.addEventListener('click', (e) => {
            // Проверяем, что клик был именно по оверлею, а не по диалогу
            if (e.target === overlay) {
                dialog.remove();
                overlay.remove();
            }
        });

        // Предотвращение закрытия при клике по самому диалогу
        dialog.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Заполняем текущими настройками
        dialog.querySelector('#uploadService').value = settings.uploadService;

        // Обработчик кнопки сброса
        dialog.querySelector('#resetSettings').addEventListener('click', () => {
            // Сохраняем API ключ ImgBB
            const apiKey = settings.imgbb.apiKey;
            // Сохраняем списки галерей/альбомов
            const availableGalleries = settings.imagebam.availableGalleries;
            const availableAlbums = settings.newfastpic.availableAlbums;

            // Сохраняем текущий выбранный сервис
            const currentService = dialog.querySelector('#uploadService').value;

            // Сбрасываем настройки к значениям по умолчанию
            settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

            // Восстанавливаем сохраненные данные
            settings.imgbb.apiKey = apiKey;
            settings.imagebam.availableGalleries = availableGalleries;
            settings.newfastpic.availableAlbums = availableAlbums;

            // Восстанавливаем текущий сервис
            settings.uploadService = currentService;

            // Сохраняем обновленные настройки
            saveSettings();

            // Перезагружаем диалог с сохранением текущего сервиса
            dialog.remove();
            overlay.remove();
            showSettingsDialog(new Event('click'));

            // Показываем уведомление
            showNotification('Настройки сброшены до значений по умолчанию');
        });

        // <-- Настройки FastPic -->
        const fastpicSettings = settings.fastpic;
        // codeFormat
        dialog.querySelector('#fastpic-codeFormat').value = fastpicSettings.codeFormat;

        // Настройки thumb
        dialog.querySelector('#fastpic-checkThumb').value = fastpicSettings.thumb.checkThumb;
        dialog.querySelector('#fastpic-thumbText').value = fastpicSettings.thumb.thumbText;
        dialog.querySelector('#fastpic-thumbSize').value = fastpicSettings.thumb.thumbSize;
        dialog.querySelector('#fastpic-thumbSizeVertical').checked = fastpicSettings.thumb.thumbSizeVertical;

        // Настройки image.origResize
        dialog.querySelector('#fastpic-origResizeEnabled').checked = fastpicSettings.image.origResize.enabled;
        dialog.querySelector('#fastpic-resSelect').value = fastpicSettings.image.origResize.resSelect;
        dialog.querySelector('#fastpic-customSize').value = fastpicSettings.image.origResize.customSize;

        // Настройки origRotate
        dialog.querySelector('#fastpic-origRotateEnabled').checked = fastpicSettings.image.origRotate.enabled;
        dialog.querySelector('#fastpic-origRotate').value = fastpicSettings.image.origRotate.value;

        // Настройки image.optimization
        dialog.querySelector('#fastpic-optimizationEnabled').checked = fastpicSettings.image.optimization.enabled;
        dialog.querySelector('#fastpic-jpegQuality').value = fastpicSettings.image.optimization.jpegQuality;

        // Настройки постера
        dialog.querySelector('#fastpic-poster').checked = fastpicSettings.image.poster;

        // Управление видимостью опций изменения размера
        const resizeOptions = dialog.querySelector('#fastpic-resizeOptions');
        resizeOptions.style.display = fastpicSettings.image.origResize.enabled ? 'block' : 'none';
        dialog.querySelector('#fastpic-origResizeEnabled').addEventListener('change', (e) => {
            resizeOptions.style.display = e.target.checked ? 'block' : 'none';
        });

        // Управление видимостью опций поворота
        const rotateOptions = dialog.querySelector('#fastpic-rotateOptions');
        rotateOptions.style.display = fastpicSettings.image.origRotate.enabled ? 'block' : 'none';
        dialog.querySelector('#fastpic-origRotateEnabled').addEventListener('change', (e) => {
            rotateOptions.style.display = e.target.checked ? 'block' : 'none';
        });

        // Управление видимостью опций оптимизации
        const optimizationOptions = dialog.querySelector('#fastpic-optimizationOptions');
        optimizationOptions.style.display = fastpicSettings.image.optimization.enabled ? 'block' : 'none';
        dialog.querySelector('#fastpic-optimizationEnabled').addEventListener('change', (e) => {
            optimizationOptions.style.display = e.target.checked ? 'block' : 'none';
        });

        // Обработчик видимости типа превью
        const thumbTypeSelect = dialog.querySelector('#fastpic-checkThumb');
        const thumbTextContainer = dialog.querySelector('#fastpic-thumbText-container');
        function updateThumbTextVisibility() {
            thumbTextContainer.style.display = thumbTypeSelect.value === 'text' ? 'block' : 'none';
        }
        thumbTypeSelect.addEventListener('change', updateThumbTextVisibility);
        updateThumbTextVisibility(); // Устанавливаем начальное состояние

        // Синхронизация предустановленного и пользовательского размера
        const resSelect = dialog.querySelector('#fastpic-resSelect');
        const customSize = dialog.querySelector('#fastpic-customSize');
        // Обработчик изменения предустановленного размера
        resSelect.addEventListener('change', (e) => {
            customSize.value = e.target.value;
        });
        // Начальная синхронизация при открытии диалога
        customSize.value = resSelect.value;


        // <-- Настройки New.FastPic -->
        const newfastpicSettings = settings.newfastpic;
        dialog.querySelector('#newfastpic-codeFormat').value = newfastpicSettings.codeFormat;

        // Настройки thumb
        dialog.querySelector('#newfastpic-checkThumb').value = newfastpicSettings.thumb.checkThumb;
        dialog.querySelector('#newfastpic-thumbText').value = newfastpicSettings.thumb.thumbText;
        dialog.querySelector('#newfastpic-thumbSize').value = newfastpicSettings.thumb.thumbSize;
        dialog.querySelector('#newfastpic-thumbSizeVertical').checked = newfastpicSettings.thumb.thumbSizeVertical;

        // Настройки image.origResize
        dialog.querySelector('#newfastpic-origResizeEnabled').checked = newfastpicSettings.image.origResize.enabled;
        dialog.querySelector('#newfastpic-customSize').value = newfastpicSettings.image.origResize.customSize;

        // Настройки image.optimization
        dialog.querySelector('#newfastpic-optimizationEnabled').checked = newfastpicSettings.image.optimization.enabled;
        dialog.querySelector('#newfastpic-jpegQuality').value = newfastpicSettings.image.optimization.jpegQuality;

        // Настройки постера
        dialog.querySelector('#newfastpic-poster').checked = newfastpicSettings.image.poster;

        // Настройки удаления
        dialog.querySelector('#newfastpic-deleteAfter').value = newfastpicSettings.deleteAfter;

        // Настройки альбома
        dialog.querySelector('#newfastpic-albumName').value = newfastpicSettings.albumName;

        const albumNewRadio = dialog.querySelector('#newfastpic-new-album');
        const albumExistingRadio = dialog.querySelector('#newfastpic-existing-album');
        const newAlbumOptions = dialog.querySelector('#newfastpic-new-album-options');
        const existingAlbumOptions = dialog.querySelector('#newfastpic-existing-album-options');
        const refreshAlbumsBtn = dialog.querySelector('#newfastpic-refresh-albums');
        const albumsStatus = dialog.querySelector('#newfastpic-albums-status');
        const selectedAlbumSelect = dialog.querySelector('#newfastpic-selectedAlbum');

        // Управление видимостью опций нового/существующего альбома
        function updateAlbumTypeOptions() {
            newAlbumOptions.style.display = albumNewRadio.checked ? 'block' : 'none';
            existingAlbumOptions.style.display = albumExistingRadio.checked ? 'block' : 'none';
        }

        albumNewRadio.addEventListener('change', updateAlbumTypeOptions);
        albumExistingRadio.addEventListener('change', updateAlbumTypeOptions);

        // Устанавливаем начальные значения
        if (settings.newfastpic.useExistingAlbum) {
            albumExistingRadio.checked = true;
        } else {
            albumNewRadio.checked = true;
        }

        updateAlbumTypeOptions();

        // Заполняем список существующих альбомов
        function populateAlbums() {
            selectedAlbumSelect.innerHTML = '<option value="">Выберите альбом...</option>';
            settings.newfastpic.availableAlbums.forEach(album => {
                const option = document.createElement('option');
                option.value = album.id;
                option.textContent = `${album.title}`;
                if (album.id === settings.newfastpic.selectedAlbumId) {
                    option.selected = true;
                }
                selectedAlbumSelect.appendChild(option);
            });

            albumsStatus.textContent = settings.newfastpic.availableAlbums.length > 0
                ? `Найдено ${settings.newfastpic.availableAlbums.length} альбомов`
                : 'Альбомов не найдено';
        }

        // Кнопка обновления списка альбомов
        refreshAlbumsBtn.addEventListener('click', async () => {
            refreshAlbumsBtn.disabled = true;
            refreshAlbumsBtn.textContent = '🔄 Загрузка...';
            albumsStatus.textContent = 'Получение списка альбомов...';

            try {
                const albums = await updateNewFastPicAlbums();
                populateAlbums();
                showNotification(`Обновлен список альбомов: найдено ${albums.length} альбомов`);
            } catch (error) {
                albumsStatus.textContent = 'Ошибка получения альбомов';
                showNotification('Ошибка при получении списка альбомов');
            } finally {
                refreshAlbumsBtn.disabled = false;
                refreshAlbumsBtn.textContent = '🔄 Обновить список альбомов';
            }
        });

        // Заполняем список при открытии диалога
        populateAlbums();

        // Обработчики видимости опций
        const updateNewFastpicOptionsVisibility = () => {
            const resizeOptions = dialog.querySelector('#newfastpic-resizeOptions');
            const optimizationOptions = dialog.querySelector('#newfastpic-optimizationOptions');

            resizeOptions.style.display = dialog.querySelector('#newfastpic-origResizeEnabled').checked ? 'block' : 'none';
            optimizationOptions.style.display = dialog.querySelector('#newfastpic-optimizationEnabled').checked ? 'block' : 'none';
        };

        // Обработчик видимости типа превью
        const thumbNewFastpicTypeSelect = dialog.querySelector('#newfastpic-checkThumb');
        const thumbNewFastpicTextContainer = dialog.querySelector('#newfastpic-thumbText-container');
        function updateNewFastpicThumbTextVisibility() {
            thumbNewFastpicTextContainer.style.display = thumbNewFastpicTypeSelect.value === 'text' ? 'block' : 'none';
        }
        thumbNewFastpicTypeSelect.addEventListener('change', updateNewFastpicThumbTextVisibility);
        updateNewFastpicThumbTextVisibility(); // Устанавливаем начальное состояние

        dialog.querySelector('#newfastpic-origResizeEnabled').addEventListener('change', updateNewFastpicOptionsVisibility);
        dialog.querySelector('#newfastpic-optimizationEnabled').addEventListener('change', updateNewFastpicOptionsVisibility);
        updateNewFastpicOptionsVisibility();


        // <-- Настройки ImgBB -->
        dialog.querySelector('#imgbb-apiKey').value = settings.imgbb.apiKey;
        dialog.querySelector('#imgbb-codeFormat').value = settings.imgbb.codeFormat;
        dialog.querySelector('#imgbb-expiration').value = settings.imgbb.expiration;
        dialog.querySelector('#imgbb-useOriginalFilename').checked = settings.imgbb.useOriginalFilename;


        // <-- Настройки ImageBam -->
        dialog.querySelector('#imagebam-codeFormat').value = settings.imagebam.codeFormat;
        dialog.querySelector('#imagebam-thumbnailSize').value = settings.imagebam.thumbnailSize;
        dialog.querySelector('#imagebam-contentType').value = settings.imagebam.contentType;
        dialog.querySelector('#imagebam-galleryEnabled').checked = settings.imagebam.galleryEnabled;
        dialog.querySelector('#imagebam-galleryTitle').value = settings.imagebam.galleryTitle;

        // Настройки галерей
        const galleryCheckbox = dialog.querySelector('#imagebam-galleryEnabled');
        const galleryOptions = dialog.querySelector('#imagebam-gallery-options');
        const newGalleryRadio = dialog.querySelector('#imagebam-new-gallery');
        const existingGalleryRadio = dialog.querySelector('#imagebam-existing-gallery');
        const newGalleryOptions = dialog.querySelector('#imagebam-new-gallery-options');
        const existingGalleryOptions = dialog.querySelector('#imagebam-existing-gallery-options');
        const refreshGalleriesBtn = dialog.querySelector('#imagebam-refresh-galleries');
        const galleriesStatus = dialog.querySelector('#imagebam-galleries-status');
        const selectedGallerySelect = dialog.querySelector('#imagebam-selectedGallery');

        // Управление видимостью опций галерей
        galleryCheckbox.addEventListener('change', () => {
            galleryOptions.style.display = galleryCheckbox.checked ? 'block' : 'none';
        });

        // Управление видимостью опций новой/существующей галереи
        function updateGalleryTypeOptions() {
            newGalleryOptions.style.display = newGalleryRadio.checked ? 'block' : 'none';
            existingGalleryOptions.style.display = existingGalleryRadio.checked ? 'block' : 'none';
        }

        newGalleryRadio.addEventListener('change', updateGalleryTypeOptions);
        existingGalleryRadio.addEventListener('change', updateGalleryTypeOptions);

        // Устанавливаем начальные значения
        if (settings.imagebam.useExistingGallery) {
            existingGalleryRadio.checked = true;
        } else {
            newGalleryRadio.checked = true;
        }

        galleryOptions.style.display = settings.imagebam.galleryEnabled ? 'block' : 'none';
        updateGalleryTypeOptions();

        // Заполняем список существующих галерей
        function populateGalleries() {
            selectedGallerySelect.innerHTML = '<option value="">Выберите галерею...</option>';
            settings.imagebam.availableGalleries.forEach(gallery => {
                const option = document.createElement('option');
                option.value = gallery.token;
                option.textContent = `${gallery.title} (${gallery.token})`;
                if (gallery.token === settings.imagebam.selectedGalleryToken) {
                    option.selected = true;
                }
                selectedGallerySelect.appendChild(option);
            });

            galleriesStatus.textContent = settings.imagebam.availableGalleries.length > 0
                ? `Найдено ${settings.imagebam.availableGalleries.length} галерей`
                : 'Галерей не найдено';
        }

        // Кнопка обновления списка галерей
        refreshGalleriesBtn.addEventListener('click', async () => {
            refreshGalleriesBtn.disabled = true;
            refreshGalleriesBtn.textContent = '🔄 Загрузка...';
            galleriesStatus.textContent = 'Получение списка галерей...';

            try {
                const galleries = await updateImageBamGalleries();
                populateGalleries();
                showNotification(`Обновлен список галерей: найдено ${galleries.length} галерей`);
            } catch (error) {
                galleriesStatus.textContent = 'Ошибка получения галерей';
                showNotification('Ошибка при получении списка галерей');
            } finally {
                refreshGalleriesBtn.disabled = false;
                refreshGalleriesBtn.textContent = '🔄 Обновить список галерей';
            }
        });

        // Заполняем список при открытии диалога
        populateGalleries();

        // История загрузок
        dialog.querySelector('#history-enabled').checked = settings.uploadHistory.enabled;
        const historyContainer = dialog.querySelector('#history-container');
        const historyList = dialog.querySelector('#history-list');
        const historyCount = dialog.querySelector('#history-count');

        function updateHistoryDisplay() {
            historyCount.textContent = settings.uploadHistory.items.length;
            historyList.innerHTML = settings.uploadHistory.items.length === 0
                ? '<div style="color: #999; text-align: center; padding: 10px;">История пуста</div>'
                : settings.uploadHistory.items.map((item, index) => `
                    <div style="padding: 5px; border-bottom: 1px solid #eee; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <a href="${item.url}" target="_blank" style="color: #0066cc;">${item.service} (${item.imageCount} шт.)</a>
                            <div style="color: #666; font-size: 11px;">${item.date}</div>
                        </div>
                        <button class="delete-history-item" data-index="${index}" style="padding: 2px 6px; margin-left: 10px; cursor: pointer;" title="Удалить">❌</button>
                    </div>
                `).join('');

            // Добавляем обработчики для кнопок удаления
            historyList.querySelectorAll('.delete-history-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    settings.uploadHistory.items.splice(index, 1);
                    saveSettings();
                    updateHistoryDisplay();
                });
            });
        }

        updateHistoryDisplay();

        dialog.querySelector('#clear-history').addEventListener('click', () => {
            if (confirm('Очистить историю загрузок?')) {
                settings.uploadHistory.items = [];
                saveSettings();
                updateHistoryDisplay();
            }
        });

        // Управление видимостью настроек сервисов
        const updateServiceSettings = () => {
            const service = dialog.querySelector('#uploadService').value;
            document.querySelectorAll('.service-settings').forEach(el => {
                el.classList.remove('active');
            });
            dialog.querySelector(`#${service}-settings`).classList.add('active');
        };

        dialog.querySelector('#uploadService').addEventListener('change', updateServiceSettings);
        updateServiceSettings();

        // Обработчики кнопок
        dialog.querySelector('#cancelSettings').addEventListener('click', () => {
            overlay.remove();
            dialog.remove();
        });


        // <-- Настройки сохранения -->
        dialog.querySelector('#saveSettings').addEventListener('click', () => {
            settings.uploadService = dialog.querySelector('#uploadService').value;

            // Сохраняем настройки FastPic
            settings.fastpic = {
                codeFormat: dialog.querySelector('#fastpic-codeFormat').value,
                thumb: {
                    checkThumb: dialog.querySelector('#fastpic-checkThumb').value,
                    thumbText: dialog.querySelector('#fastpic-thumbText').value,
                    thumbSize: dialog.querySelector('#fastpic-thumbSize').value,
                    thumbSizeVertical: dialog.querySelector('#fastpic-thumbSizeVertical').checked
                },
                image: {
                    origResize: {
                        enabled: dialog.querySelector('#fastpic-origResizeEnabled').checked,
                        resSelect: dialog.querySelector('#fastpic-resSelect').value,
                        customSize: dialog.querySelector('#fastpic-customSize').value
                    },
                    origRotate: {
                        enabled: dialog.querySelector('#fastpic-origRotateEnabled').checked,
                        value: dialog.querySelector('#fastpic-origRotate').value
                    },
                    optimization: {
                        enabled: dialog.querySelector('#fastpic-optimizationEnabled').checked,
                        jpegQuality: dialog.querySelector('#fastpic-jpegQuality').value
                    },
                    poster: dialog.querySelector('#fastpic-poster').checked
                }
            };

            // Сохраняем настройки New FastPic
            settings.newfastpic = {
                codeFormat: dialog.querySelector('#newfastpic-codeFormat').value,
                thumb: {
                    checkThumb: dialog.querySelector('#newfastpic-checkThumb').value,
                    thumbText: dialog.querySelector('#newfastpic-thumbText').value,
                    thumbSize: dialog.querySelector('#newfastpic-thumbSize').value,
                    thumbSizeVertical: dialog.querySelector('#newfastpic-thumbSizeVertical').checked
                },
                image: {
                    origResize: {
                        enabled: dialog.querySelector('#newfastpic-origResizeEnabled').checked,
                        customSize: dialog.querySelector('#newfastpic-customSize').value
                    },
                    optimization: {
                        enabled: dialog.querySelector('#newfastpic-optimizationEnabled').checked,
                        jpegQuality: dialog.querySelector('#newfastpic-jpegQuality').value
                    },
                    poster: dialog.querySelector('#newfastpic-poster').checked
                },
                deleteAfter: dialog.querySelector('#newfastpic-deleteAfter').value,
                albumName: dialog.querySelector('#newfastpic-albumName').value,
                useExistingAlbum: dialog.querySelector('#newfastpic-existing-album').checked,
                selectedAlbumId: dialog.querySelector('#newfastpic-selectedAlbum').value,
                availableAlbums: settings.newfastpic.availableAlbums // Сохраняем текущий список
            };

            // Сохраняем настройки ImgBB
            settings.imgbb = {
                apiKey: dialog.querySelector('#imgbb-apiKey').value,
                codeFormat: dialog.querySelector('#imgbb-codeFormat').value,
                expiration: dialog.querySelector('#imgbb-expiration').value,
                useOriginalFilename: dialog.querySelector('#imgbb-useOriginalFilename').checked
            };

            // Сохраняем настройки ImageBam
            settings.imagebam = {
                codeFormat: dialog.querySelector('#imagebam-codeFormat').value,
                thumbnailSize: dialog.querySelector('#imagebam-thumbnailSize').value,
                contentType: dialog.querySelector('#imagebam-contentType').value,
                galleryEnabled: dialog.querySelector('#imagebam-galleryEnabled').checked,
                galleryTitle: dialog.querySelector('#imagebam-galleryTitle').value,
                useExistingGallery: dialog.querySelector('#imagebam-existing-gallery').checked,
                selectedGalleryToken: dialog.querySelector('#imagebam-selectedGallery').value,
                availableGalleries: settings.imagebam.availableGalleries // Сохраняем текущий список
            };

            settings.uploadHistory.enabled = dialog.querySelector('#history-enabled').checked;

            saveSettings();
            overlay.remove();
            dialog.remove();

            showNotification('Настройки сохранены');
        });
    }

    // Функция настройки кнопки загрузки
    function setupUploadButton() {
        const site = getCurrentSite();
        if (!site) return;

        // Создаем input для файлов
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        // Находим существующую кнопку загрузки изображений или добавляем новую
        let uploadButton;
        switch(site) {
            case 'rutracker':
                uploadButton = document.querySelector('#load-pic-btn');
                break;

            case 'tapochek':
                // Создаем новую кнопку для tapochek
                uploadButton = document.createElement('input');
                uploadButton.type = 'button';
                uploadButton.value = 'Загрузить картинку';
                uploadButton.style.cssText = 'margin: 0 5px;';
                const tapochekNav = document.querySelector('.mrg_4.tCenter');
                if (tapochekNav) {
                    // Вставляем в начало
                    tapochekNav.insertBefore(uploadButton, tapochekNav.firstChild);
                }
                break;

            case 'nnmclub':
                // Создаем новую кнопку для nnmclub
                uploadButton = document.createElement('input');
                uploadButton.type = 'button';
                uploadButton.value = 'Загрузить картинку';
                uploadButton.className = 'input mainoption';  // Используем стили nnmclub
                uploadButton.style.cssText = 'margin: 0 5px;';
                const nnmNav = document.querySelector('td.row2[align="center"][valign="middle"][style*="padding: 6px"]');
                if (nnmNav) {
                    // Вставляем в начало
                    nnmNav.insertBefore(uploadButton, nnmNav.firstChild);
                }
                break;

            case '4pda':
                // Создаем новую кнопку для 4pda
                uploadButton = document.createElement('input');
                uploadButton.type = 'button';
                uploadButton.value = 'Загрузить картинку';
                uploadButton.className = 'zbtn zbtn-default';  // Используем стили 4pda
                uploadButton.style.cssText = 'margin: 0 5px;';
                const pdaNav = document.querySelector('.dfrms.text-center') || document.querySelector('div[style*="margin-top:3px"]');
                if (pdaNav) {
                    // Вставляем в начало
                    pdaNav.insertBefore(uploadButton, pdaNav.firstChild);
                }
                break;
        }

        if (uploadButton) {
            uploadButton.onclick = (e) => {
                e.preventDefault();
                input.click();
            };

            // Добавляем обработчик выбора файлов
            input.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    await handleImageUpload(files);
                }
                input.value = '';  // Сброс input для возможности повторной загрузки тех же файлов
            });
        }
    }

    // Настройка drag&drop для textarea
    function setupDragAndDrop() {
        const textarea = findTextarea();
        if (!textarea) return;

        textarea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            textarea.style.border = '2px dashed #4a90e2';
        });

        textarea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            textarea.style.border = '';
        });

        textarea.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            textarea.style.border = '';

            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            if (files.length > 0) {
                await handleImageUpload(files);
            }
        });
    }

    // Настройка вставки из буфера обмена
    function setupClipboardPaste() {
        const textarea = findTextarea();
        if (!textarea) return;

        textarea.addEventListener('paste', async (e) => {
            // Получаем данные из буфера обмена
            const clipboardData = e.clipboardData || window.clipboardData;

            // Сначала проверяем наличие файлов (важно для Firefox)
            if (clipboardData.files && clipboardData.files.length > 0) {
                const imageFiles = Array.from(clipboardData.files).filter(file => file.type.startsWith('image/'));

                if (imageFiles.length > 0) {
                    e.preventDefault(); // Останавливаем стандартную вставку текста
                    await handleImageUpload(imageFiles);
                    return;
                }
            }

            // Проверяем наличие изображений в буфере обмена (для Chrome и других браузеров)
            const items = clipboardData.items;
            if (items) {
                // Ищем изображения среди элементов буфера
                const imageItems = Array.from(items)
                    .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
                    .map(item => item.getAsFile());

                if (imageItems.length > 0) {
                    e.preventDefault(); // Останавливаем стандартную вставку текста
                    await handleImageUpload(imageItems);
                }
            }
        });
    }

    // Функция сохранения настроек
    function saveSettings() {
        GM_setValue('fastpicextSettings', settings);
    }

    // Добавляем пункт меню в Tampermonkey
    function registerTampermonkeyMenu() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('Настройки FastPic Upload', showSettingsDialog);
        }
    }

    // Инициализация скрипта
    function initializeScript() {
        addScriptStyles();
        createSettingsMenu();
        createServiceSwitcher();
        setupUploadButton();
        setupDragAndDrop();
        setupClipboardPaste();
        registerTampermonkeyMenu();
    }

    // Загрузка сохраненных настроек
    let settings = deepMerge(DEFAULT_SETTINGS, GM_getValue('fastpicextSettings', {}));

    // Вызов инициализации
    initializeScript();
})();