// ==UserScript==
// @name         Fortnite Image Replacer
// @version      1.143
// @description  Adds a panel to replace item previews with their full-size 'featured' images or a high-resolution frame from the item's video. Caches results in IndexedDB
// @match        https://fortnite.gg/*
// @grant        none
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/482590/Fortnite%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/482590/Fortnite%20Image%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Глобальные константы ---
    const PROCESSED_ATTRIBUTE = 'data-processed-by-script';
    const IMAGE_SELECTOR = `.img:not([${PROCESSED_ATTRIBUTE}]), img[src*="/img/items/"]:not([${PROCESSED_ATTRIBUTE}])`;

    // --- Модуль локализации интерфейса ---
    const translations = {
        'en': { // Английский (по умолчанию)
            replaceButton: '🖼️ Replace Images',
            clearButton: '🧹 Clear Cache',
            confirmMessage: 'Are you sure you want to clear the entire image cache and reload the page?',
            clearingMessage: 'Clearing...'
        },
        'ru': { // Русский
            replaceButton: '🖼️ Заменить изображения',
            clearButton: '🧹 Очистить кеш',
            confirmMessage: 'Вы уверены, что хотите очистить весь кеш изображений и перезагрузить страницу?',
            clearingMessage: 'Очистка...'
        },
        'es': { // Испанский
            replaceButton: '🖼️ Reemplazar Imágenes',
            clearButton: '🧹 Limpiar Caché',
            confirmMessage: '¿Estás seguro de que quieres borrar toda la caché de imágenes y recargar la página?',
            clearingMessage: 'Limpiando...'
        },
        'de': { // Немецкий
            replaceButton: '🖼️ Bilder ersetzen',
            clearButton: '🧹 Cache leeren',
            confirmMessage: 'Möchten Sie den gesamten Bild-Cache wirklich leeren und die Seite neu laden?',
            clearingMessage: 'Wird gelöscht...'
        },
         'fr': { // Французский
            replaceButton: '🖼️ Remplacer les images',
            clearButton: '🧹 Vider le cache',
            confirmMessage: 'Êtes-vous sûr de vouloir vider tout le cache d\'images et recharger la page ?',
            clearingMessage: 'Vidage...'
        },
        'pt': { // Португальский
            replaceButton: '🖼️ Substituir Imagens',
            clearButton: '🧹 Limpar Cache',
            confirmMessage: 'Tem certeza de que deseja limpar todo o cache de imagens e recarregar a página?',
            clearingMessage: 'Limpando...'
        }
    };

    /**
     * Определяет язык пользователя и возвращает соответствующий объект с переводами.
     * @returns {object} - Объект с текстовыми строками на нужном языке.
     */
    function getLocale() {
        const lang = navigator.language.split('-')[0]; // Получаем основной язык (например, "ru" из "ru-RU")
        return translations[lang] || translations['en']; // Возвращаем перевод или английский по умолчанию
    }


    // --- Модуль для работы с IndexedDB (кеширование) ---
    const idb = {
        db: null,
        DB_NAME: 'FortniteImageCacheDB',
        STORE_NAME: 'ImageStore',

        async init() {
            if (this.db) return;
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.DB_NAME, 1);
                request.onerror = () => reject('Ошибка IndexedDB: ' + request.error);
                request.onsuccess = () => { this.db = request.result; resolve(); };
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                        db.createObjectStore(this.STORE_NAME);
                    }
                };
            });
        },

        async get(key) {
            await this.init();
            return new Promise((resolve) => {
                const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
                const store = transaction.objectStore(this.STORE_NAME);
                const request = store.get(key);
                request.onerror = () => resolve(undefined);
                request.onsuccess = () => resolve(request.result);
            });
        },

        async set(key, value) {
            await this.init();
            return new Promise((resolve) => {
                const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
                const store = transaction.objectStore(this.STORE_NAME);
                const request = store.put(value, key);
                request.onerror = () => resolve();
                request.onsuccess = () => resolve();
            });
        },

        async clear() {
            await this.init();
            return new Promise((resolve) => {
                const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
                const store = transaction.objectStore(this.STORE_NAME);
                const request = store.clear();
                request.onerror = () => resolve();
                request.onsuccess = () => resolve();
            });
        }
    };

    // --- Асинхронные утилиты для работы с медиа ---

    async function checkImage(url) {
        const cacheKey = 'status_' + url.split('?')[0];
        const cachedStatus = await idb.get(cacheKey);
        if (cachedStatus !== undefined) {
            return cachedStatus === 'exists';
        }
        return new Promise(resolve => {
            const img = new Image();
            img.onload = async () => { await idb.set(cacheKey, 'exists'); resolve(true); };
            img.onerror = async () => { await idb.set(cacheKey, 'missing'); resolve(false); };
            img.src = url;
        });
    }

    async function captureVideoFrame(videoUrl) {
        const cacheKey = 'frame_' + videoUrl.split('?')[0];
        const cachedFrame = await idb.get(cacheKey);
        if (cachedFrame) {
            return cachedFrame === 'failed' ? null : cachedFrame;
        }
        return new Promise(resolve => {
            const video = document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.muted = true;
            const cleanup = () => video.remove();
            video.addEventListener('loadeddata', () => { video.currentTime = 2; }, { once: true });
            video.addEventListener('seeked', async () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const frameUrl = canvas.toDataURL('image/jpeg');
                await idb.set(cacheKey, frameUrl);
                resolve(frameUrl);
                cleanup();
            }, { once: true });
            video.addEventListener('error', async () => {
                await idb.set(cacheKey, 'failed');
                resolve(null);
                cleanup();
            }, { once: true });
            video.src = videoUrl;
        });
    }

    // --- Ключевая логика обработки изображений ---

    async function processImage(image) {
        if (image.dataset.processedByScript) return;
        image.dataset.processedByScript = 'true';

        try {
            const originalSrc = image.src || image.getAttribute('data-src');
            if (!originalSrc) return;

            // --- НОВАЯ ЛОГИКА: Приоритетная проверка для страницы /shop ---
            // Ищем родительскую обёртку, в стилях которой хранится качественное изображение.
            const parentWrap = image.closest('a.fn-item-wrap');
            if (parentWrap) {
                const style = window.getComputedStyle(parentWrap);
                const bgImage = style.backgroundImage;
                const bgUrlMatch = bgImage.match(/url\("?(.+?)"?\)/); // Извлекаем URL из свойства 'background-image'

                if (bgUrlMatch && bgUrlMatch[1]) {
                    const highResUrl = bgUrlMatch[1];
                    // Убеждаемся, что это реальный URL, а не градиент или пустое значение
                    if (highResUrl && highResUrl !== 'none' && !highResUrl.includes('gradient')) {
                        image.src = highResUrl;
                        return; // Завершаем обработку, так как лучшая версия найдена.
                    }
                }
            }

            // --- Старая логика (остаётся как фолбэк для других страниц) ---
            const iconMatch = originalSrc.match(/\/img\/items\/(\d+)\/icon\.(png|jpg)(\?.+)?/);
            if (iconMatch) {
                const itemId = iconMatch[1];
                const query = iconMatch[3] || '';
                let newImageUrl = null;

                const featuredUrl = `https://fortnite.gg/img/items/${itemId}/featured.png${query}`;
                if (await checkImage(featuredUrl)) {
                    newImageUrl = featuredUrl;
                } else {
                    const videoUrl = `https://fnggcdn.com/items/${itemId}/video.mp4`;
                    const frameUrl = await captureVideoFrame(videoUrl);
                    if (frameUrl) {
                        newImageUrl = frameUrl;
                    }
                }

                if (newImageUrl) {
                    image.src = newImageUrl;
                }
                return;
            }

            if (originalSrc.includes('/img/survey/') && !originalSrc.includes('/big/')) {
                const highResUrl = originalSrc.replace('/survey/', '/survey/big/');
                if (await checkImage(highResUrl)) {
                    image.src = highResUrl;
                }
            }
        } catch (error) {
            console.error('Ошибка при обработке изображения:', image.src, error);
        }
    }

    function processAllVisibleImages() {
        const imagesToProcess = document.querySelectorAll(IMAGE_SELECTOR);
        Promise.allSettled(Array.from(imagesToProcess).map(processImage));
    }

    // --- UI ---

    function addControlPanel() {
        const locale = getLocale();

        const panel = document.createElement('div');
        panel.style.cssText = 'position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; z-index: 9999;';
        const buttonStyle = 'display: block; width: 100%; min-width: 150px; margin: 5px 0; padding: 10px; background: #5865F2; color: white; border: none; border-radius: 4px; cursor: pointer;';

        const replaceBtn = document.createElement('button');
        replaceBtn.textContent = locale.replaceButton;
        replaceBtn.style.cssText = buttonStyle;
        replaceBtn.onclick = processAllVisibleImages;

        const clearBtn = document.createElement('button');
        clearBtn.textContent = locale.clearButton;
        clearBtn.style.cssText = buttonStyle;
        clearBtn.onclick = async () => {
            if (confirm(locale.confirmMessage)) {
                replaceBtn.disabled = true;
                clearBtn.disabled = true;
                clearBtn.textContent = locale.clearingMessage;
                await idb.clear();
                window.location.reload();
            }
        };

        panel.appendChild(replaceBtn);
        panel.appendChild(clearBtn);
        document.body.appendChild(panel);
    }

    // --- Точка входа ---
    window.addEventListener('load', () => {
        addControlPanel();
    });
})();