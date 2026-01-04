// ==UserScript==
// @name         Previewer Media on Chats  1.2.39
// @namespace    http://tampermonkey.net/
// @version      1.2.39
// @description  Preview media links including shortened URLs kappa.lol
// @author       Gullampis810 
// @license      MIT
// @grant        GM_xmlhttpRequest
// @match        https://www.twitch.tv/* 
// @match        https://*.imgur.com/*
// @match        https://7tv.app/* 
// @icon         https://yt3.googleusercontent.com/ytc/AOPolaS0epA6kuqQqudVFRN0l9aJ2ScCvwK0YqC7ojbU=s900-c-k-c0x00ffffff-no-rj
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/530574/Previewer%20Media%20on%20Chats%20%201239.user.js
// @updateURL https://update.greasyfork.org/scripts/530574/Previewer%20Media%20on%20Chats%20%201239.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlCache = new Map();

    // Поддерживаемые типы файлов
    const fileTypes = {
        image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif']
    };

    // Поддерживаемые платформы эмодзи и изображений
    const emotePlatforms = {
        '7tv.app': (url) => {
            const emoteIdMatch = url.match(/7tv\.app\/emotes\/([a-zA-Z0-9]+)/);
            return emoteIdMatch ? `https://cdn.7tv.app/emote/${emoteIdMatch[1]}/2x.webp` : url;
        },
        'frankerfacez.com': (url) => {
            const emoteIdMatch = url.match(/frankerfacez\.com\/emoticon\/(\d+)/);
            return emoteIdMatch ? `https://cdn.frankerfacez.com/emoticon/${emoteIdMatch[1]}/2` : url;
        },
        'betterttv.com': (url) => {
            const emoteIdMatch = url.match(/betterttv\.com\/emotes\/([a-zA-Z0-9]+)/);
            return emoteIdMatch ? `https://cdn.betterttv.net/emote/${emoteIdMatch[1]}/2x` : url;
        },
        'imgur.com': (url) => {
            const albumMatch = url.match(/imgur\.com\/a\/([a-zA-Z0-9]+)/);
            const imageMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
            if (albumMatch) return `https://i.imgur.com/${albumMatch[1]}.jpg`;
            if (imageMatch) return `https://i.imgur.com/${imageMatch[1]}.jpg`;
            return url;
        }
    };

    // Определение типа файла
    function getFileType(url) {
        const cleanUrl = url.split('?')[0].toLowerCase();
        const extension = cleanUrl.substring(cleanUrl.lastIndexOf('.'));

        console.debug(`Checking file type for URL: ${url}`);
        if (fileTypes.image.includes(extension)) {
            console.debug(`Extension matched: ${extension}`);
            return 'image';
        }
        if (Object.keys(emotePlatforms).some(platform => url.includes(platform))) {
            console.debug(`Platform matched: ${url}`);
            return 'image';
        }
        if (url.includes('cdn.7tv.app') || url.includes('7tv.app/emotes') || url.includes('i.imgur.com') || url.includes('yandex.net') || url.includes('susanin.news')) {
            console.debug(`Domain matched: ${url}`);
            return 'image';
        }
        return null;
    }

    // Определение типа по Content-Type
    function getFileTypeFromContentType(contentType) {
        if (!contentType) {
            console.debug('No Content-Type received');
            return null;
        }
        if (contentType.includes('image')) {
            console.debug(`Content-Type is image: ${contentType}`);
            return 'image';
        }
        return null;
    }

    // Трансформация URL для эмодзи и Imgur
    function transformEmoteUrl(url) {
        for (const [platform, transformer] of Object.entries(emotePlatforms)) {
            if (url.includes(platform)) {
                const transformed = transformer(url);
                console.debug(`Transformed URL: ${url} -> ${transformed}`);
                return transformed;
            }
        }
        return url;
    }

    // Разрешение коротких URL и Imgur альбомов
    async function resolveShortUrl(url) {
        if (urlCache.has(url)) {
            console.debug(`Using cached URL: ${url}`);
            return urlCache.get(url);
        }

        try {
            const response = await fetch(url, {
                method: 'HEAD',
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PreWatcher/1.2.4)' }
            });
            const finalUrl = response.url || url;
            const contentType = response.headers.get('content-type');
            const result = { resolvedUrl: finalUrl, contentType };
            urlCache.set(url, result);
            console.debug(`Resolved URL: ${url} -> ${finalUrl}, Content-Type: ${contentType}`);
            return result;
        } catch (error) {
            console.error(`Error resolving URL ${url}:`, error);
            return { resolvedUrl: url, contentType: null };
        }
    }

    // Извлечение прямой ссылки на изображение из Imgur
    async function extractImgurImage(url) {
        if (!url.includes('imgur.com/a/')) {
            console.debug(`Not an Imgur album: ${url}`);
            return url;
        }
        try {
            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const img = doc.querySelector('img[src*="i.imgur.com"]');
            const directUrl = img ? img.getAttribute('src') : url;
            console.debug(`Extracted Imgur image: ${url} -> ${directUrl}`);
            return directUrl;
        } catch (error) {
            console.error(`Imgur extraction error for ${url}:`, error);
            return url;
        }
    }

    // Проверка доступности изображения и получение размеров
    async function testImage(url) {
        if (urlCache.has(url)) {
            console.debug(`Using cached image test for ${url}`);
            return urlCache.get(url);
        }

        return new Promise((resolve) => {
            const img = new Image();
            let timedOut = false;

            const timeout = setTimeout(() => {
                timedOut = true;
                urlCache.set(url, { valid: false });
                console.debug(`Image test timeout for ${url}`);
                resolve({ valid: false });
            }, 2000); // Таймаут 2 секунды

            img.onload = () => {
                if (!timedOut) {
                    clearTimeout(timeout);
                    urlCache.set(url, { valid: true, width: img.naturalWidth, height: img.naturalHeight });
                    console.debug(`Image loaded: ${url}, size: ${img.naturalWidth}x${img.naturalHeight}`);
                    resolve({ valid: true, width: img.naturalWidth, height: img.naturalHeight });
                }
            };
            img.onerror = () => {
                if (!timedOut) {
                    clearTimeout(timeout);
                    urlCache.set(url, { valid: false });
                    console.debug(`Image failed to load: ${url}`);
                    resolve({ valid: false });
                }
            };
            img.src = url;
        });
    }

    // Замена ссылки на изображение с сохранением URL и адаптивным размером
  // Замена ссылки на изображение с сохранением URL и адаптивным размером
async function replaceLinkWithImage(link) {
    let url = link.getAttribute('href');
    let fileType = getFileType(url);
    let mediaUrl = transformEmoteUrl(url);

    console.debug(`Processing link: ${url}`);

    // Проверяем короткие ссылки и Imgur альбомы
    if (!fileType || url.match(/t\.co|bit\.ly|imgur\.com/)) {
        const { resolvedUrl, contentType } = await resolveShortUrl(url);
        mediaUrl = resolvedUrl;
        fileType = getFileType(mediaUrl) || getFileTypeFromContentType(contentType);
        console.debug(`After resolve: ${mediaUrl}, fileType: ${fileType}`);
    }

    // Для Imgur альбомов извлекаем прямую ссылку
    if (mediaUrl.includes('imgur.com/a/')) {
        mediaUrl = await extractImgurImage(mediaUrl);
        fileType = getFileType(mediaUrl);
        console.debug(`After Imgur extraction: ${mediaUrl}`);
    }

    if (!fileType) {
        const imageInfo = await testImage(mediaUrl);
        fileType = imageInfo.valid ? 'image' : null;
        console.debug(`After testImage: fileType=${fileType}`);
    }

    if (!fileType) {
        console.debug(`Skipping non-image URL: ${url}`);
        return;
    }

    const imageInfo = await testImage(mediaUrl);
    if (!imageInfo.valid) {
        console.debug(`Image not valid: ${mediaUrl}`);
        return;
    }

    // Определяем размер изображения
    const maxSize = 512;
    let width = imageInfo.width;
    let height = imageInfo.height;
    if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    // Создаем изображение
    const img = document.createElement('img');
    Object.assign(img, {
        src: mediaUrl,
        alt: link.textContent,
        draggable: false
    });
    Object.assign(img.style, {
        width: `520px`,
        height: `300px`,
        verticalAlign: 'middle',
        margin: '0 4px',
        objectFit: 'contain',
        pointerEvents: 'none'
    });

    // Заменяем оригинальную ссылку только на изображение
    link.replaceWith(img);
    link.dataset.processed = 'true';
    console.debug(`Replaced link with image (no link): ${url} -> ${mediaUrl}`);
}
    // Обработка ссылок
    async function processLinks() {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (!chatContainer) {
            console.debug('Chat container not found');
            return;
        }

        const messages = chatContainer.querySelectorAll('.chat-line__message:not([data-processed])');
        for (const message of messages) {
            // Учитываем ссылки с классом ffz-tooltip link-fragment
            const links = message.querySelectorAll('a[href]:not([data-processed]), a.ffz-tooltip.link-fragment:not([data-processed])');
            for (const link of links) {
                await replaceLinkWithImage(link);
            }
            message.dataset.processed = 'true';
        }
    }

    // Дебаунс функция
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const debouncedProcessLinks = debounce(processLinks, 100); // 100 мс для быстрой обработки

    // Инициализация
    document.addEventListener('DOMContentLoaded', debouncedProcessLinks);
    new MutationObserver(debouncedProcessLinks).observe(document.body, { childList: true, subtree: true });

    window.previewLinks = debouncedProcessLinks;

    // Добавление стилей
    const style = document.createElement('style');
    style.textContent = `
        .chat-line__message img {
            display: inline-block;
            vertical-align: middle;
        }
        .chat-line__message a {
            display: inline-block;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);
})();