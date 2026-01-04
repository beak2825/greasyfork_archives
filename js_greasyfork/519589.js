// ==UserScript==
// @name         Rutracker Preview
// @name:en      Rutracker Preview
// @namespace    http://tampermonkey.net/
// @version      5.5.0
// @description  Предварительный просмотр скриншотов
// @description:en  Preview of screenshots
// @author       С
// @license MIT
// @match        https://rutracker.org/forum/tracker.php*
// @match        https://rutracker.org/forum/viewforum.php*
// @match        https://nnmclub.to/forum/tracker.php*
// @match        https://nnmclub.to/forum/viewforum.php*
// @match        https://tapochek.net/tracker.php*
// @match        https://tapochek.net/viewforum.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/519589/Rutracker%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/519589/Rutracker%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

//====================================
// НАСТРОЙКИ
//====================================

// Настройки по умолчанию
const defaultSettings = {
    // Размеры и внешний вид
    previewThumbnailSize: 100, // Размер миниатюр в окне предпросмотра (px)
    lightboxThumbnailSize: 800, // Максимальный размер изображения в лайтбоксе (px)
    previewMaxWidth: 500, // Максимальная ширина окна предпросмотра (px)
    previewMaxHeight: 500, // Максимальная высота окна предпросмотра (px)
    previewGridColumns: 3, // Количество столбцов в сетке миниатюр
    maxThumbnailsBeforeSpoiler: 12, // Макс. количество миниатюр до спойлера
    previewPosition: 'bottomLeft', // Положение окна предпросмотра

    // Цветовая схема
    colorTheme: 'light', // 'light', 'dark', 'system'

    // Времена и задержки
    hoverEffectTime: 0.3, // Время анимации эффекта наведения на миниатюру (сек)
    previewHideDelay: 300, // Задержка перед скрытием окна предпросмотра (мс)

    // Поведение
    enableAutoPreview: true, // Включить окно предпросмотра
    hidePreviewIfEmpty: true, // Не показывать окно предпросмотра, если нет скриншотов
    neverUseSpoilers: false, // Никогда не скрывать изображения под спойлер

    // Предзагрузка изображений
    enableImagePreloading: true, // Включить предзагрузку всех изображений в лайтбоксе
    maxConcurrentPreloads: 6, // Максимальное количество одновременных загрузок

    // Настройки для каждого сайта
    siteSettings: {
        rutracker: {
            enabled: true
        },
        tapochek: {
            enabled: true
        },
        nnmclub: {
            enabled: true
        }
    },

    // Кнопки навигации
    navButtonsSize: 60, // Размер кнопок навигации (px)
    navButtonsVisibility: 'always', // 'always', 'hover', 'never'

    // Горячие клавиши
    // keyboardShortcuts: {
        // close: 'Escape',
        // prev: 'ArrowLeft',
        // next: 'ArrowRight',
        // reset: 'Home'
    // },

    // Отладка
    enableLogging: false
};

// Функция для загрузки настроек
function loadSettings() {
    const savedSettings = GM_getValue('rtPreviewSettings');
    let settings = Object.assign({}, defaultSettings);

    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            settings = mergeDeep(settings, parsed);
        } catch (e) {
            console.error('Ошибка при загрузке настроек:', e);
        }
    }

    return settings;
}

// Функция для сохранения настроек
function saveSettings(settings) {
    GM_setValue('rtPreviewSettings', JSON.stringify(settings));
}

// Глубокое объединение объектов
function mergeDeep(target, source) {
    const isObject = obj => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
}

// Загрузка настроек
const settings = loadSettings();

// Функция для логирования в зависимости от настроек
function log(...args) {
    if (settings.enableLogging) {
        console.log(...args);
    }
}

//====================================
// СИСТЕМА ПРЕДЗАГРУЗКИ ИЗОБРАЖЕНИЙ
//====================================

class ImagePreloader {
    constructor(maxConcurrent = 6) {
        this.cache = new Map();
        this.loadingQueue = [];
        this.activeLoads = new Set();
        this.maxConcurrent = maxConcurrent;
        this.priorityQueue = [];
    }

    preloadImage(url, isPriority = false) {
        if (!url) return Promise.resolve(null);

        // Проверяем кэш
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            log('Найдено изображение в кэше:', url, 'статус:', cached.status);
            return cached.promise;
        }

        log('Добавляем изображение в очередь предзагрузки:', url, 'приоритет:', isPriority);

        // Создаем запись в кэше
        const cacheEntry = {
            img: new Image(),
            status: 'loading',
            promise: null
        };

        this.cache.set(url, cacheEntry);

        const promise = new Promise((resolve, reject) => {
            cacheEntry.img.onload = () => {
                cacheEntry.status = 'loaded';
                this.activeLoads.delete(url);
                this.processQueue();
                log('Предзагружено изображение:', url);
                resolve(cacheEntry.img);
            };

            cacheEntry.img.onerror = (error) => {
                cacheEntry.status = 'error';
                this.activeLoads.delete(url);
                this.processQueue();
                log('Ошибка предзагрузки:', url, error);
                reject(new Error('Failed to preload image: ' + url));
            };

            // Проверяем, можем ли загружать сейчас
            if (this.activeLoads.size < this.maxConcurrent) {
                this.startLoading(url, cacheEntry.img);
            } else {
                // Добавляем в очередь
                if (isPriority) {
                    this.priorityQueue.unshift(url);
                    log('Добавлено в приоритетную очередь:', url);
                } else {
                    this.loadingQueue.push(url);
                    log('Добавлено в обычную очередь:', url);
                }
            }
        });

        cacheEntry.promise = promise;
        return promise;
    }

    // Метод для немедленной загрузки приоритетных изображений
    preloadImageImmediate(url) {
        if (!url) return Promise.resolve(null);

        // Проверяем кэш
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            log('Немедленная загрузка - найдено в кэше:', url, 'статус:', cached.status);
            return cached.promise;
        }

        log('Немедленная загрузка изображения:', url);

        // Создаем запись в кэше
        const img = new Image();
        const cacheEntry = {
            img: img,
            status: 'loading',
            promise: null
        };

        this.cache.set(url, cacheEntry);

        const promise = new Promise((resolve, reject) => {
            img.onload = () => {
                cacheEntry.status = 'loaded';
                log('Немедленно предзагружено изображение:', url);
                resolve(img);
            };

            img.onerror = (error) => {
                cacheEntry.status = 'error';
                log('Ошибка немедленной предзагрузки:', url, error);
                reject(new Error('Failed to preload image immediately: ' + url));
            };

            // Загружаем немедленно
            img.src = url;
        });

        // Присваиваем promise после его создания
        cacheEntry.promise = promise;
        return promise;
    }

    startLoading(url, img) {
        if (this.activeLoads.has(url)) {
            log('Изображение уже загружается:', url);
            return;
        }

        this.activeLoads.add(url);
        log('Начинаем загрузку изображения:', url, 'активных загрузок:', this.activeLoads.size);
        img.src = url;
    }

    processQueue() {
        log('Обрабатываем очередь, активных загрузок:', this.activeLoads.size, 'макс:', this.maxConcurrent);

        while (this.activeLoads.size < this.maxConcurrent) {
            let url = this.priorityQueue.shift();
            if (!url) {
                url = this.loadingQueue.shift();
            }

            if (!url) {
                log('Очередь пуста');
                break;
            }

            const cached = this.cache.get(url);
            if (cached && cached.status === 'loading' && cached.img) {
                this.startLoading(url, cached.img);
            } else {
                log('Изображение не найдено в кэше или уже загружено:', url);
            }
        }
    }

    getCachedImage(url) {
        // Проверяем точное совпадение URL
        let cached = this.cache.get(url);
        if (cached && cached.status === 'loaded' && cached.img) {
            if (cached.img.complete && cached.img.naturalWidth > 0) {
                // log('Точное совпадение в кэше для:', url);
                return cached.img;
            }
        }

        log('Изображение не найдено в кэше для:', url);
        return null;
    }

    preloadAllImages(allUrls, currentIndex = 0) {
        if (!allUrls || allUrls.length === 0) return Promise.resolve([]);

        log('Начинаем предзагрузку всех изображений:', allUrls.length, 'текущий индекс:', currentIndex);

        const promises = [];

        allUrls.forEach((url, idx) => {
            if (!url) return;

            if (idx === currentIndex) {
                log('Текущее изображение для немедленной загрузки:', url);
                promises.push(this.preloadImageImmediate(url));
            } else if (Math.abs(idx - currentIndex) <= 1) {
                log('Соседнее изображение с высоким приоритетом:', url);
                promises.push(this.preloadImage(url, true));
            } else {
                log('Изображение с обычным приоритетом:', url);
                promises.push(this.preloadImage(url, false));
            }
        });

        log(`Запущена предзагрузка ${allUrls.filter(Boolean).length} изображений`);
        return Promise.allSettled(promises);
    }

    // cleanup() {
        // log('Очистка предзагрузчика');
        // this.activeLoads.clear();
        // this.loadingQueue = [];
        // this.priorityQueue = [];

        // const toDelete = [];
        // for (const [url, cached] of this.cache.entries()) {
            // if (cached.status !== 'loading') {
                // toDelete.push(url);
            // }
        // }

        // toDelete.forEach(url => this.cache.delete(url));
        // if (toDelete.length > 0) {
            // log(`Очищен кэш изображений, удалено: ${toDelete.length}`);
        // }
    // }

    getDebugInfo() {
        const cacheInfo = {};
        for (const [url, cached] of this.cache.entries()) {
            cacheInfo[url] = cached.status;
        }

        return {
            cacheSize: this.cache.size,
            activeLoads: this.activeLoads.size,
            loadingQueue: this.loadingQueue.length,
            priorityQueue: this.priorityQueue.length,
            cache: cacheInfo
        };
    }
}

// Глобальный экземпляр предзагрузчика
let imagePreloader = new ImagePreloader(settings.maxConcurrentPreloads);

//====================================
// ОКНО НАСТРОЕК
//====================================

// HTML-код для модального окна настроек
const settingsDialogHTML = `
<div id="rt-preview-settings-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 10000; display: flex; justify-content: center; align-items: center;">
    <div id="rt-preview-settings-dialog" style="background-color: white; border-radius: 8px; padding: 20px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative;">
        <h2 style="margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Настройки Rutracker Preview</h2>

        <div style="position: absolute; top: 20px; right: 20px; cursor: pointer; font-size: 24px; font-weight: bold;" id="rt-preview-settings-close">×</div>

        <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <!-- Колонка 1: Размеры и внешний вид -->
            <div style="flex: 1; min-width: 300px;">
                <h3>Размеры и внешний вид</h3>

                <div style="margin-bottom: 15px;">
                    <label for="previewThumbnailSize">Размер миниатюр в окне предпросмотра (px):</label>
                    <input type="range" id="previewThumbnailSize" min="50" max="500" step="10" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>50</span>
                        <span id="previewThumbnailSizeValue">100</span>
                        <span>500</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="lightboxThumbnailSize">Размер изображений в лайтбоксе (px):</label>
                    <input type="range" id="lightboxThumbnailSize" min="400" max="1500" step="100" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>400</span>
                        <span id="lightboxThumbnailSizeValue">800</span>
                        <span>1500</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="previewMaxWidth">Максимальная ширина окна предпросмотра (px):</label>
                    <input type="range" id="previewMaxWidth" min="200" max="1000" step="50" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>200</span>
                        <span id="previewMaxWidthValue">500</span>
                        <span>1000</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="previewMaxHeight">Максимальная высота окна предпросмотра (px):</label>
                    <input type="range" id="previewMaxHeight" min="200" max="1000" step="50" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>200</span>
                        <span id="previewMaxHeightValue">500</span>
                        <span>1000</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="previewGridColumns">Количество столбцов в сетке миниатюр:</label>
                    <input type="range" id="previewGridColumns" min="1" max="8" step="1" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>1</span>
                        <span id="previewGridColumnsValue">3</span>
                        <span>8</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="maxThumbnailsBeforeSpoiler">Макс. количество миниатюр до спойлера:</label>
                    <input type="range" id="maxThumbnailsBeforeSpoiler" min="3" max="50" step="1" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>3</span>
                        <span id="maxThumbnailsBeforeSpoilerValue">12</span>
                        <span>50</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="previewPosition">Положение окна предпросмотра:</label>
                    <select id="previewPosition" style="width: 100%; padding: 5px;">
                        <option value="bottomRight">Снизу справа</option>
                        <option value="bottomLeft">Снизу слева</option>
                        <option value="topRight">Сверху справа</option>
                        <option value="topLeft">Сверху слева</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="colorTheme">Цветовая схема:</label>
                    <select id="colorTheme" style="width: 100%; padding: 5px;">
                        <option value="light">Светлая</option>
                        <option value="dark">Темная</option>
                        <option value="system">Системная</option>
                    </select>
                </div>
            </div>

            <!-- Колонка 2: Поведение и настройки для сайтов -->
            <div style="flex: 1; min-width: 300px;">
                <h3>Поведение</h3>

                <div style="margin-bottom: 15px;">
                    <label for="previewHideDelay">Задержка перед скрытием окна предпросмотра (мс):</label>
                    <input type="range" id="previewHideDelay" min="100" max="2000" step="100" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>100</span>
                        <span id="previewHideDelayValue">300</span>
                        <span>2000</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="enableAutoPreview">
                        Включить окно предпросмотра
                    </label>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="hidePreviewIfEmpty">
                        Не показывать окно предпросмотра, если нет скриншотов
                    </label>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="neverUseSpoilers">
                        Никогда не скрывать изображения под спойлер
                    </label>
                </div>

                <h3>Предзагрузка изображений</h3>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="enableImagePreloading">
                        Включить предзагрузку всех изображений в лайтбоксе
                    </label>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="maxConcurrentPreloads">Максимальное количество одновременных загрузок:</label>
                    <input type="range" id="maxConcurrentPreloads" min="1" max="12" step="1" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>1</span>
                        <span id="maxConcurrentPreloadsValue">6</span>
                        <span>12</span>
                    </div>
                </div>

                <h3>Настройки сайтов</h3>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="rutrackerEnabled">
                        Включить для Rutracker
                    </label>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="tapochekEnabled">
                        Включить для Tapochek
                    </label>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="nnmclubEnabled">
                        Включить для NNMClub
                    </label>
                </div>
            </div>

            <!-- Колонка 3: Кнопки навигации, горячие клавиши и отладка -->
            <div style="flex: 1; min-width: 300px;">
                <h3>Кнопки навигации</h3>

                <div style="margin-bottom: 15px;">
                    <label for="navButtonsSize">Размер кнопок навигации (px):</label>
                    <input type="range" id="navButtonsSize" min="30" max="100" step="5" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>30</span>
                        <span id="navButtonsSizeValue">60</span>
                        <span>100</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="navButtonsVisibility">Видимость кнопок навигации:</label>
                    <select id="navButtonsVisibility" style="width: 100%; padding: 5px;">
                        <option value="always">Всегда видимы</option>
                        <option value="hover">Видимы при наведении</option>
                        <option value="never">Всегда скрыты</option>
                    </select>
                </div>

                <h3>Отладка</h3>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="enableLogging">
                        Включить логирование
                    </label>
                </div>

                <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: space-between;">
                    <button id="saveSettings" style="padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Сохранить настройки</button>
                    <button id="resetSettings" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Сбросить настройки</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// Функция для открытия окна настроек
function openSettingsDialog() {
    // Проверяем, существует ли уже окно настроек
    if (document.getElementById('rt-preview-settings-backdrop')) {
        return;
    }

    // Создаем элемент для диалога и добавляем HTML
    const dialogContainer = document.createElement('div');
    dialogContainer.innerHTML = settingsDialogHTML;
    document.body.appendChild(dialogContainer);

    // Получаем ссылки на элементы формы
    const elements = {
        // Размеры и внешний вид
        previewThumbnailSize: document.getElementById('previewThumbnailSize'),
        previewThumbnailSizeValue: document.getElementById('previewThumbnailSizeValue'),
        lightboxThumbnailSize: document.getElementById('lightboxThumbnailSize'),
        lightboxThumbnailSizeValue: document.getElementById('lightboxThumbnailSizeValue'),
        previewMaxWidth: document.getElementById('previewMaxWidth'),
        previewMaxWidthValue: document.getElementById('previewMaxWidthValue'),
        previewMaxHeight: document.getElementById('previewMaxHeight'),
        previewMaxHeightValue: document.getElementById('previewMaxHeightValue'),
        previewGridColumns: document.getElementById('previewGridColumns'),
        previewGridColumnsValue: document.getElementById('previewGridColumnsValue'),
        maxThumbnailsBeforeSpoiler: document.getElementById('maxThumbnailsBeforeSpoiler'),
        maxThumbnailsBeforeSpoilerValue: document.getElementById('maxThumbnailsBeforeSpoilerValue'),
        previewPosition: document.getElementById('previewPosition'),
        colorTheme: document.getElementById('colorTheme'),

        // Поведение
        previewHideDelay: document.getElementById('previewHideDelay'),
        previewHideDelayValue: document.getElementById('previewHideDelayValue'),
        enableAutoPreview: document.getElementById('enableAutoPreview'),
        hidePreviewIfEmpty: document.getElementById('hidePreviewIfEmpty'),
        neverUseSpoilers: document.getElementById('neverUseSpoilers'),

        // Предзагрузка
        enableImagePreloading: document.getElementById('enableImagePreloading'),
        maxConcurrentPreloads: document.getElementById('maxConcurrentPreloads'),
        maxConcurrentPreloadsValue: document.getElementById('maxConcurrentPreloadsValue'),

        // Настройки сайтов
        rutrackerEnabled: document.getElementById('rutrackerEnabled'),
        tapochekEnabled: document.getElementById('tapochekEnabled'),
        nnmclubEnabled: document.getElementById('nnmclubEnabled'),

        // Кнопки навигации
        navButtonsSize: document.getElementById('navButtonsSize'),
        navButtonsSizeValue: document.getElementById('navButtonsSizeValue'),
        navButtonsVisibility: document.getElementById('navButtonsVisibility'),

        // Отладка
        enableLogging: document.getElementById('enableLogging'),

        // Кнопки
        saveSettings: document.getElementById('saveSettings'),
        resetSettings: document.getElementById('resetSettings'),
        closeButton: document.getElementById('rt-preview-settings-close')
    };

    // Заполняем форму текущими значениями

    // Размеры и внешний вид
    elements.previewThumbnailSize.value = settings.previewThumbnailSize;
    elements.previewThumbnailSizeValue.textContent = settings.previewThumbnailSize;
    elements.lightboxThumbnailSize.value = settings.lightboxThumbnailSize;
    elements.lightboxThumbnailSizeValue.textContent = settings.lightboxThumbnailSize;
    elements.previewMaxWidth.value = settings.previewMaxWidth;
    elements.previewMaxWidthValue.textContent = settings.previewMaxWidth;
    elements.previewMaxHeight.value = settings.previewMaxHeight;
    elements.previewMaxHeightValue.textContent = settings.previewMaxHeight;
    elements.previewGridColumns.value = settings.previewGridColumns;
    elements.previewGridColumnsValue.textContent = settings.previewGridColumns;
    elements.maxThumbnailsBeforeSpoiler.value = settings.maxThumbnailsBeforeSpoiler;
    elements.maxThumbnailsBeforeSpoilerValue.textContent = settings.maxThumbnailsBeforeSpoiler;
    elements.previewPosition.value = settings.previewPosition;
    elements.colorTheme.value = settings.colorTheme;

    // Поведение
    elements.previewHideDelay.value = settings.previewHideDelay;
    elements.previewHideDelayValue.textContent = settings.previewHideDelay;
    elements.enableAutoPreview.checked = settings.enableAutoPreview;
    elements.hidePreviewIfEmpty.checked = settings.hidePreviewIfEmpty;
    elements.neverUseSpoilers.checked = settings.neverUseSpoilers;

    // Предзагрузка
    elements.enableImagePreloading.checked = settings.enableImagePreloading;
    elements.maxConcurrentPreloads.value = settings.maxConcurrentPreloads;
    elements.maxConcurrentPreloadsValue.textContent = settings.maxConcurrentPreloads;

    // Настройки сайтов
    elements.rutrackerEnabled.checked = settings.siteSettings.rutracker.enabled;
    elements.tapochekEnabled.checked = settings.siteSettings.tapochek.enabled;
    elements.nnmclubEnabled.checked = settings.siteSettings.nnmclub.enabled;

    // Кнопки навигации
    elements.navButtonsSize.value = settings.navButtonsSize;
    elements.navButtonsSizeValue.textContent = settings.navButtonsSize;
    elements.navButtonsVisibility.value = settings.navButtonsVisibility;

    // Отладка
    elements.enableLogging.checked = settings.enableLogging;

    // Добавляем обработчики событий для слайдеров
    elements.previewThumbnailSize.addEventListener('input', () => {
        elements.previewThumbnailSizeValue.textContent = elements.previewThumbnailSize.value;
    });

    elements.lightboxThumbnailSize.addEventListener('input', () => {
        elements.lightboxThumbnailSizeValue.textContent = elements.lightboxThumbnailSize.value;
    });

    elements.previewMaxWidth.addEventListener('input', () => {
        elements.previewMaxWidthValue.textContent = elements.previewMaxWidth.value;
    });

    elements.previewMaxHeight.addEventListener('input', () => {
        elements.previewMaxHeightValue.textContent = elements.previewMaxHeight.value;
    });

    elements.previewGridColumns.addEventListener('input', () => {
        elements.previewGridColumnsValue.textContent = elements.previewGridColumns.value;
    });

    elements.maxThumbnailsBeforeSpoiler.addEventListener('input', () => {
        elements.maxThumbnailsBeforeSpoilerValue.textContent = elements.maxThumbnailsBeforeSpoiler.value;
    });

    elements.previewHideDelay.addEventListener('input', () => {
        elements.previewHideDelayValue.textContent = elements.previewHideDelay.value;
    });

    elements.maxConcurrentPreloads.addEventListener('input', () => {
        elements.maxConcurrentPreloadsValue.textContent = elements.maxConcurrentPreloads.value;
    });

    elements.navButtonsSize.addEventListener('input', () => {
        elements.navButtonsSizeValue.textContent = elements.navButtonsSize.value;
    });

    // Обработчик для сохранения настроек
    elements.saveSettings.addEventListener('click', () => {
        // Собираем новые настройки из формы
        const newSettings = {
            // Размеры и внешний вид
            previewThumbnailSize: parseInt(elements.previewThumbnailSize.value),
            lightboxThumbnailSize: parseInt(elements.lightboxThumbnailSize.value),
            previewMaxWidth: parseInt(elements.previewMaxWidth.value),
            previewMaxHeight: parseInt(elements.previewMaxHeight.value),
            previewGridColumns: parseInt(elements.previewGridColumns.value),
            maxThumbnailsBeforeSpoiler: parseInt(elements.maxThumbnailsBeforeSpoiler.value),
            previewPosition: elements.previewPosition.value,
            colorTheme: elements.colorTheme.value,

            // Поведение
            previewHideDelay: parseInt(elements.previewHideDelay.value),
            enableAutoPreview: elements.enableAutoPreview.checked,
            hidePreviewIfEmpty: elements.hidePreviewIfEmpty.checked,
            neverUseSpoilers: elements.neverUseSpoilers.checked,

            // Предзагрузка
            enableImagePreloading: elements.enableImagePreloading.checked,
            maxConcurrentPreloads: parseInt(elements.maxConcurrentPreloads.value),

            // Настройки для каждого сайта
            siteSettings: {
                rutracker: {
                    enabled: elements.rutrackerEnabled.checked
                },
                tapochek: {
                    enabled: elements.tapochekEnabled.checked
                },
                nnmclub: {
                    enabled: elements.nnmclubEnabled.checked
                }
            },

            // Кнопки навигации
            navButtonsSize: parseInt(elements.navButtonsSize.value),
            navButtonsVisibility: elements.navButtonsVisibility.value,

            // Горячие клавиши
            keyboardShortcuts: {
                close: 'Escape',
                prev: 'ArrowLeft',
                next: 'ArrowRight',
                reset: 'Home'
            },

            // Отладка
            enableLogging: elements.enableLogging.checked
        };

        // Сохраняем настройки
        saveSettings(newSettings);

        // Обновляем объект settings
        Object.assign(settings, newSettings);

        // Обновляем настройки предзагрузчика
        imagePreloader.maxConcurrent = newSettings.maxConcurrentPreloads;
        log('Обновлены настройки предзагрузчика, maxConcurrent:', newSettings.maxConcurrentPreloads);

        // Закрываем диалог
        closeSettingsDialog();
    });

    // Обработчик для сброса настроек
    elements.resetSettings.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить все настройки на значения по умолчанию?')) {
            saveSettings(defaultSettings);
            Object.assign(settings, defaultSettings);
            closeSettingsDialog();
        }
    });

    // Обработчик для закрытия диалога
    elements.closeButton.addEventListener('click', closeSettingsDialog);

    // Закрытие диалога при клике на задний фон
    const backdrop = document.getElementById('rt-preview-settings-backdrop');
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            closeSettingsDialog();
        }
    });
}

// Функция для закрытия окна настроек
function closeSettingsDialog() {
    const dialog = document.getElementById('rt-preview-settings-backdrop');
    if (dialog) {
        dialog.remove();
    }
}

// Регистрируем команду меню для открытия настроек
GM_registerMenuCommand('⚙️ Настройки Rutracker Preview', openSettingsDialog);

//====================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
//====================================

// Функция для создания HTML элемента с заданными свойствами
function createElement(tag, properties = {}, styles = {}) {
    const element = document.createElement(tag);

    // Применяем свойства
    for (const [key, value] of Object.entries(properties)) {
        element[key] = value;
    }

    // Применяем стили
    for (const [key, value] of Object.entries(styles)) {
        element.style[key] = value;
    }

    return element;
}

// Функция для добавления эффекта наведения на элемент
function addHoverEffect(element, imgElement) {
    // Устанавливаем время перехода из настроек
    imgElement.style.transition = `transform ${settings.hoverEffectTime}s ease`;

    element.addEventListener('mouseenter', () => {
        imgElement.style.transform = 'scale(1.05)';
    });

    element.addEventListener('mouseleave', () => {
        imgElement.style.transform = 'scale(1)';
    });
}

// Функция для создания миниатюры изображения с ссылкой
function createThumbnail(imgData, openImageFunc, siteName) {
    // Создаем ссылку для изображения
    const aElement = createElement('a', { href: imgData.fullUrl });

    // Добавляем обработчик клика
    aElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Открываем изображение в лайтбоксе
        openImageFunc(imgData.thumbUrl, imgData.fullUrl);
    });

    // Создаем элемент изображения с размером из настроек
    const imgElement = createElement('img',
        { src: imgData.thumbUrl },
        {
            maxWidth: '100%',
            maxHeight: `${settings.previewThumbnailSize}px`,
            objectFit: 'cover'
        }
    );

    // Добавляем эффект при наведении
    addHoverEffect(aElement, imgElement);

    aElement.appendChild(imgElement);
    return aElement;
}

// Функция для добавления коллекции изображений в контейнер
function addImagesToContainer(container, imageLinks, openImageFunc, siteName, startIndex = 0, endIndex = imageLinks.length) {
    const links = imageLinks.slice(startIndex, endIndex);
    links.forEach(imgData => {
        const thumbnail = createThumbnail(imgData, openImageFunc, siteName);
        container.appendChild(thumbnail);
    });
}

//====================================
// ФУНКЦИЯ ПРОВЕРКИ URL
//====================================

// Функция для проверки соответствия URL сайту
function isUrlMatch(url, matchUrls) {
    if (typeof matchUrls === 'string') {
        return url.startsWith(matchUrls);
    }
    if (Array.isArray(matchUrls)) {
        return matchUrls.some(matchUrl => url.startsWith(matchUrl));
    }
    return false;
}

//====================================
// САЙТОЗАВИСИМЫЕ НАСТРОЙКИ
//====================================

// Общий обработчик для openImage
function createSiteOpenImageHandler(siteName) {
    return function(imageUrl, fullImageUrl = null) {
        // Проверка: есть ли вообще данные превью
        if (!currentPreviewData) {
            log('Нет currentPreviewData при клике на изображение');
            // Fallback - открываем только это изображение
            const thumbnails = [imageUrl];
            const fullSizeUrls = [fullImageUrl || imageUrl];
            showImageLightbox(imageUrl, thumbnails, fullSizeUrls, 0, true, fullSizeUrls);
            return;
        }

        // Проверка: совпадает ли ID превью с текущим активным
        if (currentPreviewData.id !== activePreviewId) {
            log('Внимание: ID превью не совпадает! currentPreviewData.id:', currentPreviewData.id, 'activePreviewId:', activePreviewId);
            // Можно добавить предупреждение или игнорировать клик
            // Пока используем данные как есть, но залоггируем проблему
        }

        const { thumbnails, fullSizeUrls, processedUrls } = currentPreviewData;

        // Определяем текущий индекс изображения
        let currentIndex = thumbnails.indexOf(imageUrl);

        // Если изображение не найдено в массиве, добавляем его
        if (currentIndex === -1) {
            thumbnails.push(imageUrl);
            fullSizeUrls.push(fullImageUrl || imageUrl);
            if (processedUrls) {
                processedUrls.push(fullImageUrl || imageUrl);
            }
            currentIndex = thumbnails.length - 1;
        }

        const urlsForLightbox = processedUrls && processedUrls.length > 0 ? processedUrls : fullSizeUrls;
        const displayUrl = urlsForLightbox[currentIndex] || fullSizeUrls[currentIndex] || imageUrl;

        showImageLightbox(displayUrl, thumbnails, fullSizeUrls, currentIndex, true, urlsForLightbox);

        // log('Используем URL для лайтбокса:', displayUrl); // Первое изображение для показа
        // log('processedUrls доступны:', !!processedUrls, 'длина:', processedUrls ? processedUrls.length : 0); // Фоновая обработка URL завершена, получены прямые ссылки

    };
}

// Общие функции для сайтов с одинаковой структурой, как на rutracker
const RutrackerLike = {
    // Функция для извлечения ссылок на скриншоты из спойлеров
    getScreenshotLinks: function(spoilerElement, spoilerSelector) {
        const links = [];
        const aElements = spoilerElement.querySelectorAll('a.postLink');

        aElements.forEach(link => {
            // Проверяем, что ближайший спойлер это именно наш spoilerElement
            if (link.closest(spoilerSelector) === spoilerElement) {
                const img = link.querySelector('var.postImg[title], img.postImg');
                if (img) {
                    const fullUrl = link.href;
                    const thumbUrl = img.tagName.toLowerCase() === 'var' ?
                                    img.getAttribute('title').split('?')[0] :
                                    img.src.split('?')[0];

                    links.push({
                        fullUrl: fullUrl,
                        thumbUrl: thumbUrl
                    });
                }
            }
        });

        return links;
    },

    // Функция для поиска скриншотов по всему посту
    getScreenshotsFromPost: function(postElement) {
        const links = [];
        // Ищем все ссылки с классом postLink, которые содержат var.postImg или img.postImg
        const aElements = postElement.querySelectorAll('a.postLink');

        aElements.forEach(link => {
            const img = link.querySelector('var.postImg[title], img.postImg');
            if (img) {
                // Проверяем, что это не обложка (обычно обложка не внутри ссылки или стоит отдельно)
                if (!link.closest('div[style*="float"]')) {
                    const fullUrl = link.href;
                    const thumbUrl = img.tagName.toLowerCase() === 'var' ?
                                    img.getAttribute('title').split('?')[0] :
                                    img.src.split('?')[0];

                    links.push({
                        fullUrl: fullUrl,
                        thumbUrl: thumbUrl
                    });
                }
            }
        });

        return links;
    },

    // Функция для поиска обложки
    getCover: function(postElement) {
        const coverElement = postElement.querySelector('var.postImg[title]');
        if (!coverElement) return null;

        const coverUrl = coverElement.getAttribute('title').split('?')[0];
        return coverUrl;
    }
};

// Определение функций для получения данных скриншотов и обложек, специфичных для каждого сайта
const siteSpecificFunctions = {
    rutracker: {
        ...RutrackerLike,
        // Открывать изображения на Rutracker
        openImage: createSiteOpenImageHandler('rutracker')
    },

    tapochek: {
        // Функция для извлечения ссылок на скриншоты для Tapochek из спойлеров
        getScreenshotLinks: function(spoilerElement, spoilerSelector) {
            const links = [];

            // Получаем div.sp-body внутри .sp-wrap
            const spBody = spoilerElement.querySelector('.sp-body');
            if (!spBody) return links;

            // Ищем div с выравниванием по центру, где обычно находятся скриншоты
            const centerDiv = spBody.querySelector('div[style*="text-align: center"]');
            const container = centerDiv || spBody;

            // Ищем ссылки с классом zoom (специфично для Tapochek)
            const aElements = container.querySelectorAll('a.zoom');

            aElements.forEach(link => {
                // Проверяем, что ближайший .sp-wrap это именно наш spoilerElement
                if (link.closest(spoilerSelector) === spoilerElement) {
                    const img = link.querySelector('img');
                    if (img) {
                        const fullUrl = link.href;
                        const thumbUrl = img.src;
                        links.push({ fullUrl, thumbUrl });
                    }
                }
            });

            return links;
        },

        // Функция для поиска скриншотов по всему посту на Tapochek
        getScreenshotsFromPost: function(postElement) {
            const links = [];

            // Ищем все ссылки, которые могут содержать изображения
            const aElements = postElement.querySelectorAll('a.zoom, a[href*="ibb.co"], a[href*="fastpic.org"]');

            aElements.forEach(link => {
                // Проверяем, что ссылка не находится в блоке с обложкой
                if (!link.closest('div[style*="float"]') && !link.querySelector('img[style*="float"]')) {
                    const img = link.querySelector('img');
                    if (img) {
                        const fullUrl = link.href;
                        const thumbUrl = img.src;
                        links.push({ fullUrl, thumbUrl });
                    }
                }
            });

            return links;
        },

        // Функция для поиска обложки на Tapochek
        getCover: function(postElement) {
            // Вариант 1: обложка как на Rutracker - в var.postImg
            const varElement = postElement.querySelector('var.postImg[title]');
            if (varElement) {
                return varElement.getAttribute('title').split('?')[0];
            }

            // Вариант 2: обложка как отдельное изображение с float: right
            const imgElement = postElement.querySelector('img[style*="float: right"]');
            if (imgElement) {
                return imgElement.src;
            }

            // Вариант 3: обложка как изображение с классами glossy и т.д.
            const glossyImg = postElement.querySelector('img.glossy');
            if (glossyImg) {
                return glossyImg.src;
            }

            return null;
        },

        // Открывать изображения на Tapochek
        openImage: createSiteOpenImageHandler('tapochek')
    },

    nnmclub: {
        // Функция для извлечения ссылок на скриншоты для NNMClub из спойлеров
        getScreenshotLinks: function(spoilerElement, spoilerSelector) {
            const links = [];

            // Ищем все ссылки с классом highslide внутри спойлера
            const aElements = spoilerElement.querySelectorAll('a.highslide');

            aElements.forEach(link => {
                // Проверяем, что ближайший спойлер это именно наш spoilerElement
                if (link.closest(spoilerSelector) === spoilerElement) {
                    const varElement = link.querySelector('var.postImg[title]');
                    const imgElement = link.querySelector('img.postImg');

                    if (varElement) {
                        const fullUrl = link.href;
                        // У nnmclub изображения обычно в атрибуте title var-элемента
                        const thumbUrl = varElement.getAttribute('title');

                        links.push({
                            fullUrl: fullUrl,
                            thumbUrl: thumbUrl
                        });
                    } else if (imgElement && imgElement.src) {
                        const fullUrl = link.href;
                        const thumbUrl = imgElement.src;

                        links.push({
                            fullUrl: fullUrl,
                            thumbUrl: thumbUrl
                        });
                    }
                }
            });

            return links;
        },

        // Функция для поиска скриншотов по всему посту на NNMClub
        getScreenshotsFromPost: function(postElement) {
            const links = [];

            // Ищем все теги center со скриншотами (обычный формат для nnmclub)
            const centerElements = postElement.querySelectorAll('center');

            centerElements.forEach(center => {
                // Проверяем, есть ли в центр-блоке заголовок "Скриншоты"
                const hasScreenshotsTitle = Array.from(center.childNodes).some(node =>
                    node.textContent && node.textContent.includes('Скриншоты')
                );

                if (hasScreenshotsTitle || center.innerHTML.includes('Скриншоты')) {
                    log('Найден блок со скриншотами');
                    // Находим все ссылки с классом highslide внутри этого центр-блока
                    const aElements = center.querySelectorAll('a.highslide');

                    aElements.forEach(link => {
                        const varElement = link.querySelector('var.postImg[title]');
                        const imgElement = link.querySelector('img.postImg');

                        if (varElement) {
                            const fullUrl = link.href;
                            const thumbUrl = varElement.getAttribute('title');
                            log('Найден скриншот:', thumbUrl);

                            links.push({
                                fullUrl: fullUrl,
                                thumbUrl: thumbUrl
                            });
                        } else if (imgElement && imgElement.src) {
                            const fullUrl = link.href;
                            const thumbUrl = imgElement.src;
                            log('Найден скриншот через img:', thumbUrl);

                            links.push({
                                fullUrl: fullUrl,
                                thumbUrl: thumbUrl
                            });
                        }
                    });
                }
            });

            // Если скриншоты не найдены в центр-блоках, ищем все ссылки с классом highslide
            if (links.length === 0) {
                log('Скриншоты не найдены в center блоках, ищем по всему посту');
                const aElements = postElement.querySelectorAll('a.highslide');

                aElements.forEach(link => {
                    // Проверяем, что ссылка не содержит обложку
                    const varElement = link.querySelector('var.postImg[title]');
                    const imgElement = link.querySelector('img.postImg');

                    // Пропускаем элементы с классами postImgAligned или img-right (обычно это обложки)
                    const isAligned = varElement && (
                        varElement.classList.contains('postImgAligned') ||
                        varElement.classList.contains('img-right')
                    );

                    const imgIsAligned = imgElement && (
                        imgElement.classList.contains('postImgAligned') ||
                        imgElement.classList.contains('img-right')
                    );

                    if (!isAligned && !imgIsAligned) {
                        if (varElement) {
                            const fullUrl = link.href;
                            const thumbUrl = varElement.getAttribute('title');
                            log('Найден скриншот в посте:', thumbUrl);

                            links.push({
                                fullUrl: fullUrl,
                                thumbUrl: thumbUrl
                            });
                        } else if (imgElement && imgElement.src) {
                            const fullUrl = link.href;
                            const thumbUrl = imgElement.src;
                            log('Найден скриншот через img в посте:', thumbUrl);

                            links.push({
                                fullUrl: fullUrl,
                                thumbUrl: thumbUrl
                            });
                        }
                    }
                });
            }

            return links;
        },

        // Функция для поиска обложки на NNMClub
        getCover: function(postElement) {
            // Ищем обложку по классам postImgAligned и img-right
            const alignedVar = postElement.querySelector('var.postImg.postImgAligned.img-right[title], var.postImg.img-right[title], var.postImgAligned.img-right[title]');
            if (alignedVar) {
                log('Найдена обложка с классами postImgAligned и img-right');
                return alignedVar.getAttribute('title');
            }

            // Ищем изображение с классами postImgAligned и img-right
            const alignedImg = postElement.querySelector('img.postImg.postImgAligned.img-right, img.postImg.img-right, img.postImgAligned.img-right');
            if (alignedImg) {
                log('Найдена обложка img с классами postImgAligned и img-right');
                return alignedImg.src;
            }

            // Ищем первое изображение с var.postImg, которое не в center-блоке
            const varElements = postElement.querySelectorAll('var.postImg[title]');

            for (let i = 0; i < varElements.length; i++) {
                const varElement = varElements[i];
                // Если элемент не внутри center-блока, считаем его обложкой
                if (!varElement.closest('center')) {
                    log('Найдена обложка как первое var.postImg вне center');
                    return varElement.getAttribute('title');
                }
            }

            return null;
        },

        // Открывать изображения на NNMClub
        openImage: createSiteOpenImageHandler('nnmclub')
    }
};

// Конфигурация для разных сайтов
const sitesConfig = {
    rutracker: {
        matchUrls: 'https://rutracker.org/forum/',
        topicLinkSelector: 'a[href^="viewtopic.php?t="]',
        firstPostSelector: 'td.message.td2[rowspan="2"]',
        spoilerSelector: '.sp-body',
        getScreenshots: siteSpecificFunctions.rutracker.getScreenshotLinks,
        getScreenshotsFromPost: siteSpecificFunctions.rutracker.getScreenshotsFromPost,
        getCover: siteSpecificFunctions.rutracker.getCover,
        openImage: siteSpecificFunctions.rutracker.openImage
    },

    tapochek: {
        matchUrls: 'https://tapochek.net',
        topicLinkSelector: 'a[href^="./viewtopic.php?t="], a[href^="/viewtopic.php?t="], a[href^="viewtopic.php?t="]',
        firstPostSelector: 'td.message.td2[rowspan="2"]',
        spoilerSelector: '.sp-wrap',
        getScreenshots: siteSpecificFunctions.tapochek.getScreenshotLinks,
        getScreenshotsFromPost: siteSpecificFunctions.tapochek.getScreenshotsFromPost,
        getCover: siteSpecificFunctions.tapochek.getCover,
        openImage: siteSpecificFunctions.tapochek.openImage
    },

    nnmclub: {
        matchUrls: 'https://nnmclub.to/forum/',
        topicLinkSelector: 'a[href^="viewtopic.php?t="]',
        firstPostSelector: 'div.postbody',
        spoilerSelector: '.hide.spoiler-wrap',
        getScreenshots: siteSpecificFunctions.nnmclub.getScreenshotLinks,
        getScreenshotsFromPost: siteSpecificFunctions.nnmclub.getScreenshotsFromPost,
        getCover: siteSpecificFunctions.nnmclub.getCover,
        openImage: siteSpecificFunctions.nnmclub.openImage
    }
};

//====================================
// ОБЩИЙ КОД
//====================================

// Флаг, указывающий, открыт ли лайтбокс
let isLightboxOpen = false;

// Кэш для обработанных URL изображений
let processedImageUrlsCache = {};

// Счетчик для генерации уникальных ID
let previewRequestId = 0;

// ID текущего активного превью
let activePreviewId = null;

// Контекст текущей обработки URL для возможности отмены
let activeUrlProcessing = null;

// Функция для взятия URL изображений из различных хостингов
function processImageUrls(fullSizeUrls, callback, processingContext = null) {
    // Счетчик необработанных URL
    let pendingUrls = 0;
    // Копия массива для безопасного изменения
    const processedUrls = [...fullSizeUrls];

    // Немедленно вызываем callback, если нет URL для обработки
    if (fullSizeUrls.length === 0) {
        return callback(processedUrls);
    }

    // Обрабатываем все URL
    for (let i = 0; i < fullSizeUrls.length; i++) {
        const url = fullSizeUrls[i];

        // Проверяем сначала кэш для обработанных URL изображений
        if (processedImageUrlsCache[url]) {
            processedUrls[i] = processedImageUrlsCache[url];
            log('Используем кэшированную прямую ссылку:', url);
            continue;
        }

        // Проверяем различные хостинги изображений
        const isFastPic = url && url.match(/fastpic\.(org|ru)\/((full)?view|big)\//);
        const isImageBam = url && url.match(/imagebam\.com\/view\//);
        const isImgBox = url && url.match(/imgbox\.com\//);
        const isImageBan = url && url.match(/imageban\.ru\/show\//);

        if (isFastPic || isImageBam || isImgBox || isImageBan) {
            pendingUrls++;

            // Формируем URL для запроса в зависимости от хостинга
            let requestUrl = url;

            // Отправляем запрос
            GM_xmlhttpRequest({
                method: 'GET',
                url: requestUrl,
                headers: {
                    'Referer': 'https://fastpic.org/' || 'https://www.imagebam.com/' || 'https://imgbox.com/' || 'https://imageban.ru/'
                },
                onload: function(response) {
                    // Критическая проверка: проверяем, не отменена ли операция
                    if (processingContext && processingContext.cancelled) {
                        log('Игнорируем результат обработки URL - операция отменена:', url);
                        return;
                    }

                    const html = response.responseText;
                    let directUrl = null;

                    // Извлекаем прямую ссылку в зависимости от хостинга
                    if (isFastPic) {
                        const imgMatch = html.match(/<img src="(https?:\/\/i\d+\.fastpic\.org\/big\/[^"]+)"[^>]*class="image/);
                        if (imgMatch && imgMatch[1]) {
                            directUrl = imgMatch[1];
                        }
                    }

                    else if (isImageBam) {
                        const imgMatches = [
                            // Первый вариант: поиск по классу main-image
                            // html.match(/<img [^>]*src="(https?:\/\/images\d+\.imagebam\.com\/[^"]+)"[^>]*class="main-image"/),

                            // Второй вариант: более общий поиск внутри div с классом view-image
                            html.match(/<div class="view-image">.*?src="(https?:\/\/images\d+\.imagebam\.com\/[^"]+)".*?<\/div>/s),

                            // Третий вариант: просто найти любой img с src imgbox
                            // html.match(/<img [^>]*src="(https?:\/\/images\d+\.imagebam\.com\/[^"]+)"[^>]*>/)
                        ];
                        // Проверяем каждый вариант
                        for (const imgMatch of imgMatches) {
                            if (imgMatch && imgMatch[1]) {
                                directUrl = imgMatch[1];
                                break;
                            }
                        }
                    }

                    else if (isImgBox) {
                        const imgMatches = [
                            // Первый вариант: поиск по классу image-content
                            // html.match(/<img [^>]*src="(https?:\/\/images\d+\.imgbox\.com\/[^"]+)"[^>]*class="image-content"/),

                            // Второй вариант: более общий поиск внутри div с классом image-container
                            html.match(/<div class="image-container">.*?src="(https?:\/\/images\d+\.imgbox\.com\/[^"]+)".*?<\/div>/s),

                            // Третий вариант: просто найти любой img с src imgbox
                            // html.match(/<img [^>]*src="(https?:\/\/images\d+\.imgbox\.com\/[^"]+)"[^>]*>/)
                        ];

                        // Проверяем каждый вариант
                        for (const imgMatch of imgMatches) {
                            if (imgMatch && imgMatch[1]) {
                                directUrl = imgMatch[1];
                                break;
                            }
                        }
                    }

                    else if (isImageBan) {
                        const imgMatches = [
                            // Первый вариант: поиск по data-original в <div class="docs-pictures clearfix">
                            // html.match(/<img [^>]*data-original="(https?:\/\/i\d+\.imageban\.ru\/out\/[^"]+)"[^>]*>/),

                            // Второй вариант: поиск по src внутри div с классом docs-pictures
                            html.match(/<div class="docs-pictures clearfix">.*?src="(https?:\/\/i\d+\.imageban\.ru\/out\/[^"]+)".*?<\/div>/s),

                            // Третий вариант: просто найти любой img с src imageban
                            // html.match(/<img [^>]*src="(https?:\/\/i\d+\.imageban\.ru\/out\/[^"]+)"[^>]*>/)
                        ];

                        // Проверяем каждый вариант
                        for (const imgMatch of imgMatches) {
                            if (imgMatch && imgMatch[1]) {
                                directUrl = imgMatch[1];
                                break;
                            }
                        }
                    }

                    if (directUrl) {
                        processedUrls[i] = directUrl;
                        // Кэшируем результат обработанных URL изображений
                        processedImageUrlsCache[url] = directUrl;
                        log('Получена прямая ссылка:', directUrl);
                    }

                    pendingUrls--;
                    if (pendingUrls === 0) {
                        // Финальная проверка перед вызовом callback
                        if (processingContext && processingContext.cancelled) {
                            log('Не вызываем callback - операция отменена');
                            return;
                        }
                        callback(processedUrls);
                    }
                },
                onerror: function(error) {
                    log('Ошибка получения URL:', error);
                    pendingUrls--;
                    if (pendingUrls === 0) {
                        if (processingContext && processingContext.cancelled) {
                            return;
                        }
                        callback(processedUrls);
                    }
                }
            });
        }
    }

    // Если нет URL для обработки, вызываем callback сразу
    if (pendingUrls === 0) {
        callback(processedUrls);
    }
}

// Функция для сбора всех изображений из окна предпросмотра
function collectImagesFromPreview(thumbnails, fullSizeUrls) {
    const previewContainer = document.getElementById('torrent-preview');

    if (previewContainer) {
        // Ищем все контейнеры с миниатюрами
        const imageContainers = previewContainer.querySelectorAll('a[href]');

        imageContainers.forEach(link => {
            const img = link.querySelector('img');
            if (img && img.src) {
                // Собираем миниатюры и полные URL
                thumbnails.push(img.src);
                fullSizeUrls.push(link.href); // URL полноразмерного изображения
            }
        });
    }
}

// Функция для создания кнопок управления в лайтбоксе
function createControlButton(content, title, onClick, fontSize = '28px') {
    const button = createElement('div',
        {
            innerHTML: content,
            title: title
        },
        {
            color: 'white',
            fontSize: fontSize,
            cursor: 'pointer',
            opacity: '0.7'
        }
    );

    button.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
    });

    button.addEventListener('mouseleave', function() {
        this.style.opacity = '0.7';
    });

    if (onClick) {
        button.addEventListener('click', function(e) {
            // console.log('КЛИК на кнопку:', title);
            onClick(e);
        });
    }

    return button;
}

// Функция для отображения изображений в лайтбоксе с возможностью перелистывания
function showImageLightbox(imageUrl, thumbnails = [], fullSizeUrls = [], currentIndex = -1, useFullSizeForDisplay = false, preloadUrls = null) {
    // ОТЛАДКА: проверяем что приходит в функцию
    // log('=== showImageLightbox DEBUG ===');
    // log('imageUrl:', imageUrl);
    // log('preloadUrls длина:', preloadUrls ? preloadUrls.length : 'null');
    // if (preloadUrls && preloadUrls.length > 0) {
        // log('Первый preloadUrl:', preloadUrls[0]);
        // log('preloadUrl[currentIndex]:', preloadUrls[currentIndex]);
    // }
    // log('currentIndex:', currentIndex);
    // log('=== END DEBUG ===');
    // Устанавливаем флаг, что лайтбокс открыт
    isLightboxOpen = true;

    // Проверяем, существует ли уже лайтбокс, если да - удаляем его
    const existingLightbox = document.getElementById('rt-preview-lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }

    // Сохраняем текущее значение overflow
    const originalOverflow = document.body.style.overflow;

    // Определение URL для предзагрузки и навигации
    let urlsToPreload = preloadUrls || (useFullSizeForDisplay ? fullSizeUrls : thumbnails);

    if (!urlsToPreload || !Array.isArray(urlsToPreload)) {
        urlsToPreload = thumbnails || [];
        // log('Fallback to thumbnails for preload URLs:', urlsToPreload.length);
    }

    // Корректируем currentIndex если он некорректный
    if (currentIndex < 0 || currentIndex >= urlsToPreload.length) {
        // Пытаемся найти правильный индекс по исходному URL
        const foundIndex = urlsToPreload.indexOf(imageUrl);
        if (foundIndex !== -1) {
            currentIndex = foundIndex;
            // log('Исправлен currentIndex по imageUrl:', currentIndex);
        } else {
            // Ищем в thumbnails если не нашли в urlsToPreload
            const thumbIndex = thumbnails.indexOf(imageUrl);
            if (thumbIndex !== -1 && !useFullSizeForDisplay) {
                currentIndex = thumbIndex;
                // log('Исправлен currentIndex по thumbnails:', currentIndex);
            } else {
                currentIndex = 0;
                // log('Установлен currentIndex по умолчанию:', currentIndex);
            }
        }
    }

    // log('================================');
    // log('imageUrl:', imageUrl);
    // log('thumbnails count:', thumbnails.length);
    // log('fullSizeUrls count:', fullSizeUrls.length);
    // log('urlsToPreload count:', urlsToPreload.length);
    // log('currentIndex:', currentIndex);
    // log('useFullSizeForDisplay:', useFullSizeForDisplay);
    // log('================================');

    // Настройка размера и фона лайтбокса с учетом цветовой схемы
    const lightbox = createElement('div',
        { id: 'rt-preview-lightbox' },
        {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: settings.colorTheme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        }
    );

    // Создаем внешний контейнер для изображения
    const imgContainer = createElement('div', {}, {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '95vw',
        maxHeight: '95vh',
        overflow: 'visible' // Важно для перемещения за границы
    });

    // Создаем внутренний контейнер для изображения и кнопок
    const contentContainer = createElement('div', {}, {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible' // Важно для перемещения за границы
    });

    // Добавляем индикатор загрузки
    const loadingIndicator = createElement('div',
        { textContent: '...' },
        {
            color: 'white',
            fontSize: '20px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10001'
        }
    );
    contentContainer.appendChild(loadingIndicator);

    // Создаем элемент изображения
    const img = createElement('img',
        {
            // title: 'Нажмите дважды, чтобы открыть в новой вкладке. Удерживайте для перемещения.'
        },
        {
            maxWidth: `${settings.lightboxThumbnailSize}px`,
            maxHeight: `${settings.lightboxThumbnailSize}px`,
            border: `2px solid ${settings.colorTheme === 'dark' ? '#444' : 'black'}`,
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
            cursor: 'move', // Курсор в виде перемещения
            display: 'none', // Скрываем до загрузки
            zIndex: '10002'
        }
    );

    // Обновляем настройки предзагрузчика
    imagePreloader.maxConcurrent = settings.maxConcurrentPreloads;

    // Функция для загрузки изображения с использованием кэша предзагрузчика
    const loadImage = (url, showLoading = true, expectedIndex = currentIndex) => {
        log('Загружаем изображение:', url, 'showLoading:', showLoading, 'expectedIndex:', expectedIndex);

        // Определяем какой URL будем использовать
        let targetUrl = url;

        // Проверяем, есть ли currentPreviewData и processedUrls
        if (currentPreviewData && currentPreviewData.processedUrls) {
            // Используем обработанный URL если он доступен
            const processedUrl = currentPreviewData.processedUrls[expectedIndex];
            if (processedUrl) {
                // log('Используем обработанный URL:', processedUrl);
                targetUrl = processedUrl;
            }
        }

        // Проверяем кэш ПЕРЕД показом loading
        const cachedImg = imagePreloader.getCachedImage(targetUrl);
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
            // log('Изображение найдено в кэше, загружаем мгновенно:', targetUrl);

            // Проверка актуальности
            if (expectedIndex !== currentIndex) {
                log('Игнорируем кэшированное изображение - индекс изменился. Ожидали:', expectedIndex, 'Текущий:', currentIndex);
                return Promise.resolve(cachedImg);
            }

            // Мгновенная загрузка без показа loading
            img.src = cachedImg.src;
            loadingIndicator.style.display = 'none';
            img.style.display = 'block';
            return Promise.resolve(cachedImg);
        }

        // Если изображения нет в кэше, показываем loading
        if (showLoading) {
            loadingIndicator.style.display = 'block';
            loadingIndicator.textContent = '...';
            img.style.display = 'none';
        }

        // Если есть обработанный URL, загружаем его
        if (currentPreviewData && currentPreviewData.processedUrls && currentPreviewData.processedUrls[expectedIndex]) {
            return loadDirectImage(targetUrl, showLoading, expectedIndex);
        }

        // Если обработанных URL нет, но есть currentPreviewData, значит обработка еще идет
        if (currentPreviewData && !currentPreviewData.processedUrls) {
            log('Обработка URL еще не завершена, ждем...');

            // Ждем завершения обработки URL
            const checkProcessedUrls = () => {
                if (currentPreviewData && currentPreviewData.processedUrls) {
                    const processedUrl = currentPreviewData.processedUrls[expectedIndex];
                    if (processedUrl) {
                        // Проверка актуальности
                        if (expectedIndex !== currentIndex) {
                            log('Игнорируем - индекс изменился. Ожидали:', expectedIndex, 'Текущий:', currentIndex);
                            return;
                        }
                        log('Обработка завершена, используем URL:', processedUrl);
                        loadDirectImage(processedUrl, showLoading, expectedIndex);
                    } else {
                        log('Обработанный URL не найден, используем исходный:', url);
                        loadDirectImage(url, showLoading, expectedIndex);
                    }
                } else {
                    // Продолжаем ждать
                    setTimeout(checkProcessedUrls, 100);
                }
            };

            setTimeout(checkProcessedUrls, 100);
            return Promise.resolve();
        }

        // Fallback - загружаем исходный URL напрямую
        log('Нет currentPreviewData, загружаем исходный URL:', url);
        return loadDirectImage(url, showLoading, expectedIndex);
    };

    // Вспомогательная функция для загрузки URL напрямую
    const loadDirectImage = (url, showLoading, expectedIndex) => {
        // Проверяем кэш еще раз (на случай если изображение появилось в кэше после первой проверки)
        const cachedImg = imagePreloader.getCachedImage(url);
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
            log('Используем предзагруженное изображение из кэша:', url);

            // Проверка актуальности
            if (expectedIndex !== currentIndex) {
                log('Игнорируем кэшированное изображение - индекс изменился. Ожидали:', expectedIndex, 'Текущий:', currentIndex);
                return Promise.resolve(cachedImg);
            }

            img.src = cachedImg.src;
            if (showLoading) {
                loadingIndicator.style.display = 'none';
                img.style.display = 'block';
            }
            return Promise.resolve(cachedImg);
        }

        // Если нет в кэше, пытаемся предзагрузить немедленно
        log('Изображение не найдено в кэше, пытаемся предзагрузить:', url);

        return imagePreloader.preloadImageImmediate(url).then((loadedImg) => {
            // Проверка актуальности
            if (expectedIndex !== currentIndex) {
                log('Игнорируем предзагруженное изображение - индекс изменился. Ожидали:', expectedIndex, 'Текущий:', currentIndex);
                return loadedImg;
            }

            log('Изображение предзагружено успешно:', url);
            img.src = loadedImg.src;
            if (showLoading) {
                loadingIndicator.style.display = 'none';
                img.style.display = 'block';
            }
            return loadedImg;
        }).catch((error) => {
            log('Ошибка предзагрузки, загружаем обычным способом:', url, error);

            // Fallback - загружаем обычным способом
            return new Promise((resolve, reject) => {
                const tempImg = new Image();
                tempImg.onload = () => {
                    // Проверка актуальности
                    if (expectedIndex !== currentIndex) {
                        log('Игнорируем fallback изображение - индекс изменился. Ожидали:', expectedIndex, 'Текущий:', currentIndex);
                        resolve(tempImg);
                        return;
                    }

                    log('Изображение загружено обычным способом:', url);
                    img.src = tempImg.src;
                    if (showLoading) {
                        loadingIndicator.style.display = 'none';
                        img.style.display = 'block';
                    }
                    resolve(tempImg);
                };
                tempImg.onerror = () => {
                    log('Ошибка загрузки следующего изображения:', url);
                    if (showLoading && expectedIndex === currentIndex) {
                        loadingIndicator.textContent = 'Ошибка загрузки'; // Ошибка загрузки изображения
                    }
                    reject(new Error('Failed to load image'));
                };
                tempImg.src = url;
            });
        });
    };

    // Функция для предзагрузки соседних изображений
    const preloadNeighborImages = (currentIdx, urls) => {
        if (!settings.enableImagePreloading) return;

        // Функция для получения правильного URL (обработанного если есть)
        const getCorrectUrl = (index) => {
            if (currentPreviewData && currentPreviewData.processedUrls && currentPreviewData.processedUrls[index]) {
                return currentPreviewData.processedUrls[index];
            }
            return urls[index];
        };

        // Предзагружаем предыдущее изображение
        if (currentIdx > 0) {
            const prevUrl = getCorrectUrl(currentIdx - 1);
            if (prevUrl) {
                imagePreloader.preloadImage(prevUrl, true);
                // log('Предзагружаем предыдущее изображение:', prevUrl);
            }
        }

        // Предзагружаем следующее изображение
        if (currentIdx < urls.length - 1) {
            const nextUrl = getCorrectUrl(currentIdx + 1);
            if (nextUrl) {
                imagePreloader.preloadImage(nextUrl, true);
                // log('Предзагружаем следующее изображение:', nextUrl);
            }
        }
    };

    // Добавляем изображение в contentContainer
    contentContainer.appendChild(img);

    // Функция закрытия лайтбокса
    const closeLightbox = function() {
        // Очищаем оптимизацию производительности
        cleanupOptimization();

        document.body.style.overflow = originalOverflow;
        lightbox.remove();
        document.removeEventListener('keydown', keyHandler);
        isLightboxOpen = false;

        // if (settings.enableImagePreloading) {
            // Выводим отладочную информацию перед очисткой
            // const debugInfo = imagePreloader.getDebugInfo();
            // log('Состояние предзагрузчика перед очисткой:', debugInfo);
            // imagePreloader.cleanup();
        // }
    };

    // Переменные для перетаскивания и масштабирования
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;
    let lastTranslateX = 0, lastTranslateY = 0;
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 10;
    const scaleStep = 0.1;

    // Переменные для оптимизации производительности масштабирования
    let rafId = null;
    let pendingZoom = false;
    let accumulatedDelta = 0;

    // Добавляем CSS-свойство для оптимизации рендеринга
    contentContainer.style.willChange = 'transform';

    // Функция применения трансформации через requestAnimationFrame
    const applyTransform = () => {
        if (!pendingZoom) return;

        contentContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        // Обновляем сохраненные значения позиции для функции перетаскивания
        lastTranslateX = translateX;
        lastTranslateY = translateY;

        pendingZoom = false;
        rafId = null;
    };

    // Функция обработки накопленного масштабирования
    const processZoom = (mouseX, mouseY) => {
        if (accumulatedDelta === 0) return;

        const oldScale = scale;

        // Чувствительность масштабирования
        const zoomSensitivity = 0.001;
        const zoomFactor = 1 - (accumulatedDelta * zoomSensitivity);

        let newScale = oldScale * zoomFactor;

        // Ограничиваем масштаб в пределах минимального и максимального значений
        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        // Проверяем, изменился ли масштаб
        if (newScale === scale) {
            accumulatedDelta = 0;
            return;
        }

        scale = newScale;

        // Вычисляем смещение для масштабирования относительно позиции курсора
        if (oldScale !== 0) {
            const scaleDiff = scale - oldScale;
            translateX -= mouseX * scaleDiff / oldScale;
            translateY -= mouseY * scaleDiff / oldScale;
        }

        // Отмечаем, что нужно применить изменения
        pendingZoom = true;

        // Сбрасываем накопленную дельту
        accumulatedDelta = 0;
    };

    // Функция очистки ресурсов при закрытии лайтбокса
    const cleanupOptimization = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        pendingZoom = false;
        accumulatedDelta = 0;

        // Убираем CSS-оптимизацию
        if (contentContainer) {
            contentContainer.style.willChange = 'auto';
        }
    };

    // Функции для перелистывания
    const prevImage = function() {
        if (urlsToPreload.length > 1 && currentIndex > 0) {
            currentIndex--;
            const newUrl = urlsToPreload[currentIndex];
            const expectedIndex = currentIndex; // Запоминаем ожидаемый индекс
            log('Переключаемся на предыдущее изображение:', newUrl, 'индекс:', currentIndex);
            loadImage(newUrl, true, expectedIndex); // Передаем expectedIndex
            preloadNeighborImages(currentIndex, urlsToPreload);
            updateNavButtons();
        }
    };

    const nextImage = function() {
        if (urlsToPreload.length > 1 && currentIndex < urlsToPreload.length - 1) {
            currentIndex++;
            const newUrl = urlsToPreload[currentIndex];
            const expectedIndex = currentIndex; // Запоминаем ожидаемый индекс
            log('Переключаемся на следующее изображение:', newUrl, 'индекс:', currentIndex);
            loadImage(newUrl, true, expectedIndex); // Передаем expectedIndex
            preloadNeighborImages(currentIndex, urlsToPreload);
            updateNavButtons();
        }
    };

    // Функции для перетаскивания
    const startDrag = function(e) {
        // Проверяем, что это левая кнопка мыши
        if (e.button === 0) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            lastTranslateX = translateX;
            lastTranslateY = translateY;

            // Меняем курсор на перемещение
            contentContainer.style.cursor = 'grabbing';

            // Предотвращаем выделение текста при перетаскивании
            e.preventDefault();

            // Предотвращаем закрытие лайтбокса при перетаскивании
            e.stopPropagation();
        }
    };

    // Обновляем функцию для перемещения изображения
    const moveDrag = function(e) {
        if (!isDragging) return;

        translateX = lastTranslateX + (e.clientX - startX);
        translateY = lastTranslateY + (e.clientY - startY);

        // Применяем трансформацию к contentContainer
        contentContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        // Предотвращаем любые действия по умолчанию
        e.preventDefault();
        e.stopPropagation();
    };

    // Функция для окончания перетаскивания
    const endDrag = function(e) {
        if (isDragging) {
            isDragging = false;
            contentContainer.style.cursor = 'auto';
            // Возвращаем обычный курсор
            img.style.cursor = 'move';

            // Предотвращаем всплытие события, чтобы не закрыть лайтбокс
            if (e) e.stopPropagation();
        }
    };

    // Кнопки навигации
    let prevButton = null;
    let nextButton = null;

    // Функция для обновления состояния кнопок навигации
    const updateNavButtons = function() {
        if (prevButton && nextButton) {
            // Кнопка "Назад"
            if (currentIndex > 0) {
                // Активная кнопка
                prevButton.style.opacity = '0.7';
                prevButton.style.cursor = 'pointer';
                prevButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                prevButton.style.color = 'white';
            } else {
                // Неактивная кнопка
                prevButton.style.opacity = '0.3';
                prevButton.style.cursor = 'not-allowed';
                prevButton.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
                prevButton.style.color = '#999';
            }

            // Кнопка "Вперед"
            if (currentIndex < urlsToPreload.length - 1) {
                // Активная кнопка
                nextButton.style.opacity = '0.7';
                nextButton.style.cursor = 'pointer';
                nextButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                nextButton.style.color = 'white';
            } else {
                // Неактивная кнопка
                nextButton.style.opacity = '0.3';
                nextButton.style.cursor = 'not-allowed';
                nextButton.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
                nextButton.style.color = '#999';
            }
        }
    };

    // Создаем кнопки для перелистывания, если есть несколько изображений
    if (urlsToPreload.length > 1 && currentIndex !== -1) {
        const buttonSize = settings.navButtonsSize;
        const navButtonStyles = {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            color: 'white',
            fontSize: `${Math.floor(buttonSize * 0.4)}px`,
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: '10005',
            userSelect: 'none',
            display: settings.navButtonsVisibility === 'always' ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none'
        };

        // Создаем кнопку "Назад"
        prevButton = createElement('div', {
            innerHTML: '&#8249;', // Красивая стрелка влево
            title: 'Предыдущее изображение'
        });

        Object.assign(prevButton.style, navButtonStyles, {
            left: `-${buttonSize + 20}px`
        });

        // Эффекты для кнопки "Назад"
        prevButton.addEventListener('mouseenter', function() {
            if (currentIndex > 0) { // Только если кнопка активна
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                this.style.transform = 'translateY(-50%) scale(1.1)';
                this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
            }
        });

        prevButton.addEventListener('mouseleave', function() {
            if (currentIndex > 0) { // Только если кнопка активна
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateY(-50%) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }
        });

        prevButton.addEventListener('mousedown', function() {
            if (currentIndex > 0) { // Только если кнопка активна
                this.style.transform = 'translateY(-50%) scale(0.95)';
            }
        });

        prevButton.addEventListener('mouseup', function() {
            if (currentIndex > 0) { // Только если кнопка активна
                this.style.transform = 'translateY(-50%) scale(1.1)';
            }
        });

        prevButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Останавливаем всплытие события
            if (currentIndex > 0) { // Проверяем, активна ли кнопка
                prevImage();
            }
        });

        // Создаем кнопку "Вперед"
        nextButton = createElement('div', {
            innerHTML: '&#8250;', // Красивая стрелка вправо
            title: 'Следующее изображение'
        });

        Object.assign(nextButton.style, navButtonStyles, {
            right: `-${buttonSize + 20}px`
        });

        // Эффекты для кнопки "Вперед"
        nextButton.addEventListener('mouseenter', function() {
            if (currentIndex < urlsToPreload.length - 1) { // Только если кнопка активна
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                this.style.transform = 'translateY(-50%) scale(1.1)';
                this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
            }
        });

        nextButton.addEventListener('mouseleave', function() {
            if (currentIndex < urlsToPreload.length - 1) { // Только если кнопка активна
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateY(-50%) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }
        });

        nextButton.addEventListener('mousedown', function() {
            if (currentIndex < urlsToPreload.length - 1) { // Только если кнопка активна
                this.style.transform = 'translateY(-50%) scale(0.95)';
            }
        });

        nextButton.addEventListener('mouseup', function() {
            if (currentIndex < urlsToPreload.length - 1) { // Только если кнопка активна
                this.style.transform = 'translateY(-50%) scale(1.1)';
            }
        });

        nextButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Останавливаем всплытие события
            if (currentIndex < urlsToPreload.length - 1) { // Проверяем, активна ли кнопка
                nextImage();
            }
        });

        if (settings.navButtonsVisibility === 'never') {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }

        contentContainer.appendChild(prevButton);
        contentContainer.appendChild(nextButton);
        updateNavButtons();
    }

    // Обработчики для показа/скрытия кнопок
    contentContainer.addEventListener('mouseenter', function() {
        if (prevButton && nextButton && settings.navButtonsVisibility === 'hover') {
            if (currentIndex > 0) prevButton.style.display = 'flex';
            if (currentIndex < urlsToPreload.length - 1) nextButton.style.display = 'flex';
        }
    });

    contentContainer.addEventListener('mouseleave', function() {
        if (prevButton && nextButton && settings.navButtonsVisibility === 'hover') {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    });

    // Добавляем обработчики событий
    contentContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);

    // Обработчик для закрытия лайтбокса при клике на фон
    lightbox.addEventListener('click', function(e) {
        if ((e.target === lightbox || !e.target.closest('img')) && !isDragging) {
            closeLightbox();
        }
    });

    // Предотвращаем закрытие лайтбокса при клике на изображение или контейнер
    contentContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Обработчик двойного клика для открытия в новой вкладке
    img.addEventListener('dblclick', function(e) {
        const fullSizeUrl = fullSizeUrls && fullSizeUrls[currentIndex] ?
            fullSizeUrls[currentIndex] : urlsToPreload[currentIndex];
        window.open(fullSizeUrl, '_blank');
    });

    // Обработчик колесика мыши
    img.addEventListener('wheel', function(e) {
        e.preventDefault();

        const rect = contentContainer.getBoundingClientRect();

        // Определяем координаты курсора относительно центра контейнера
        const mouseX = e.clientX - rect.left - (rect.width / 2);
        const mouseY = e.clientY - rect.top - (rect.height / 2);

        // Получаем значение прокрутки колесика
        let delta = e.deltaY;

        // Обработка разных режимов прокрутки для кроссбраузерной совместимости
        if (e.deltaMode === 1) { // Режим прокрутки по строкам
            delta *= 16; // Преобразуем в пиксели
        } else if (e.deltaMode === 2) { // Режим прокрутки по страницам
            delta *= 400; // Преобразуем в пиксели
        }

        // Накапливаем дельту для обработки группы событий
        accumulatedDelta += delta;

        // Обрабатываем масштабирование
        processZoom(mouseX, mouseY);

        // Планируем применение трансформации через requestAnimationFrame
        if (!rafId && pendingZoom) {
            rafId = requestAnimationFrame(applyTransform);
        }
    }, { passive: false });

    // Кнопки управления
    const controlsContainer = createElement('div', {}, {
        position: 'absolute',
        top: '10px',
        right: '20px',
        zIndex: '10006',
        display: 'flex',
        gap: '15px'
    });

    const resetButton = createControlButton('↻', 'Сбросить позицию (Home)', function(e) {
        e.stopPropagation();
        translateX = 0; translateY = 0; lastTranslateX = 0; lastTranslateY = 0; scale = 1;
        contentContainer.style.transform = 'translate(0, 0) scale(1)';
    });

    const openButton = createControlButton('&#x1F5D7;', 'Открыть в новой вкладке', function(e) {
        e.stopPropagation();
        const fullSizeUrl = fullSizeUrls && fullSizeUrls[currentIndex] ?
            fullSizeUrls[currentIndex] : urlsToPreload[currentIndex];
        window.open(fullSizeUrl, '_blank');
    });

    const closeButton = createControlButton('×', 'Закрыть', function(e) {
        e.stopPropagation();
        closeLightbox();
    }, '40px');
    closeButton.style.fontWeight = 'bold';

    controlsContainer.appendChild(resetButton);
    controlsContainer.appendChild(openButton);
    controlsContainer.appendChild(closeButton);

    // Обработчик клавиш
    const keyHandler = function(e) {
        const keyMappings = settings.keyboardShortcuts;
        if (e.key === keyMappings.close) {
            closeLightbox();
        } else if (e.key === keyMappings.prev) {
            prevImage();
        } else if (e.key === keyMappings.next) {
            nextImage();
        } else if (e.key === keyMappings.reset) {
            translateX = 0; translateY = 0; lastTranslateX = 0; lastTranslateY = 0; scale = 1;
            contentContainer.style.transform = 'translate(0, 0) scale(1)';
        } else if (e.key === keyMappings.fullscreen) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                lightbox.requestFullscreen();
            }
        }
    };
    document.addEventListener('keydown', keyHandler);

    // Собираем лайтбокс
    imgContainer.appendChild(contentContainer);
    lightbox.appendChild(imgContainer);
    lightbox.appendChild(controlsContainer);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Определяем URL первого изображения
    const initialUrl = (currentIndex >= 0 && currentIndex < urlsToPreload.length) ?
        urlsToPreload[currentIndex] : imageUrl;

    log('Первое изображение для показа:', initialUrl);

    // Запускаем фоновую предзагрузку всех изображений
    if (settings.enableImagePreloading && urlsToPreload.length > 1) {
        log('Запускаем предзагрузку для', urlsToPreload.length, 'изображений, текущий индекс:', currentIndex);

        // Сначала предзагружаем текущее и соседние с высоким приоритетом
        preloadNeighborImages(currentIndex, urlsToPreload);

        // Затем предзагружаем все остальные изображения с обычным приоритетом
        setTimeout(() => {
            imagePreloader.preloadAllImages(urlsToPreload, currentIndex);
        }, 100);
    } else {
        log('Предзагрузка отключена или нет изображений. Включена:', settings.enableImagePreloading, 'Изображений:', urlsToPreload.length);
    }

    // Загружаем первое изображение
    loadImage(initialUrl, true, currentIndex).catch((error) => {
        log('Критическая ошибка загрузки первого изображения:', error);
        loadingIndicator.textContent = 'Ошибка загрузки'; // Ошибка загрузки изображения
    });
}

// Переменные для управления превью
let currentPreviewLink = null; // Ссылка, для которой отображается превью
let hoverPreviewLink = null;   // Ссылка, на которую наведена мышь в данный момент
let previewWindow = null;      // HTML-элемент окна превью
let removeTimeout = null;      // Таймаут для удаления окна
let currentRequest = null;     // Текущий AJAX-запрос
let requestInProgress = false; // Флаг для отслеживания состояния запроса
let cachedRequests = {};       // Кэш для хранения результатов запросов
let currentPreviewData = null; // Данные текущего превью с обработанными URL

// Список для хранения обработчиков событий, чтобы их можно было правильно удалить
let eventHandlers = [];

// Функция для удаления окна предпросмотра
function removePreviewWithDelay() {
    if (previewWindow && !isLightboxOpen) {
        clearTimeout(removeTimeout);
        removeTimeout = setTimeout(() => {
            removePreviewWindow();
        }, settings.previewHideDelay);
    }
}

// Максимальный размер кэша
const MAX_CACHE_SIZE = 20;

// Функция очистки кэша при превышении размера
function cleanupCache() {
    const cacheKeys = Object.keys(cachedRequests);
    if (cacheKeys.length > MAX_CACHE_SIZE) {
        // Удаляем самые старые записи
        const keysToRemove = cacheKeys.slice(0, cacheKeys.length - MAX_CACHE_SIZE);
        keysToRemove.forEach(key => {
            delete cachedRequests[key];
        });
    }
}

// Функция для обработки данных ответа
function processResponseData(response, requestLink, siteConfig, requestId) {
    // Критическая проверка: проверяем актуальность запроса
    if (activePreviewId !== requestId) {
        log('Игнорируем устаревший ответ, requestId:', requestId, 'activePreviewId:', activePreviewId);
        return;
    }

    // Если окно предпросмотра было удалено или это не актуальный запрос, выходим
    if (!previewWindow || (currentPreviewLink !== requestLink && hoverPreviewLink !== requestLink)) {
        log('Превью уже не актуально для requestId:', requestId);
        return;
    }

    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
    const firstPost = doc.querySelector(siteConfig.firstPostSelector);

    // Ищем только первый пост
    if (!firstPost) {
        previewWindow.innerHTML = 'Не удалось найти первый пост';
        return;
    }

    // Определяем, на каком сайте мы находимся
    const siteName = Object.keys(sitesConfig).find(name => isUrlMatch(window.location.href, sitesConfig[name].matchUrls));

    // Ищем обложку, используя функцию из конфигурации
    const coverUrl = siteConfig.getCover(firstPost);

    // Создаем контейнер для обложки
    const coverContainer = createElement('div', {}, {
        float: 'right',
        marginLeft: '10px',
        marginBottom: '10px',
        maxWidth: '150px'
    });

    // Если обложка найдена, добавляем ее в контейнер с возможностью открытия в лайтбоксе
    if (coverUrl) {
        // Создаем ссылку для обложки
        const coverLink = createElement('a', { href: coverUrl });

        // Создаем изображение обложки
        const coverImage = createElement('img',
            {
                src: coverUrl,
                alt: 'Обложка'
            },
            {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '6px'
            }
        );

        // Добавляем эффект при наведении на обложку
        addHoverEffect(coverLink, coverImage);

        // Обработчик клика на обложку, открываем в лайтбоксе
        coverLink.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем открытие в новой вкладке по умолчанию

            // Открываем обложку в лайтбоксе
            siteConfig.openImage(coverUrl, coverUrl);
        });

        // Собираем элементы вместе
        coverLink.appendChild(coverImage);
        coverContainer.appendChild(coverLink);
    }

    // Находим все спойлеры в посте
    const spoilerElements = firstPost.querySelectorAll(siteConfig.spoilerSelector);
    let screenshotLinks = [];

    // Используем функцию из конфигурации для извлечения скриншотов из спойлеров
    spoilerElements.forEach(spoiler => {
        const links = siteConfig.getScreenshots(spoiler, siteConfig.spoilerSelector);
        links.forEach(link => screenshotLinks.push(link));
    });

    // Если скриншоты не найдены в спойлерах, ищем по всему посту
    if (screenshotLinks.length === 0) {
        log('Скриншоты не найдены в спойлерах, ищем по всему посту');
        const linksFromPost = siteConfig.getScreenshotsFromPost(firstPost);
        screenshotLinks = linksFromPost;
    }

    // Повторная проверка актуальности
    if (activePreviewId !== requestId) {
        log('Превью устарело во время обработки, requestId:', requestId);
        return;
    }

    // Проверяем, что окно превью существует и это актуальный запрос
    if (!previewWindow || (currentPreviewLink !== requestLink && hoverPreviewLink !== requestLink)) return;

    // Проверяем, нужно ли скрыть превью, если нет скриншотов или обложки
    if (settings.hidePreviewIfEmpty && !coverUrl && screenshotLinks.length === 0) {
        removePreviewWindow();
        return;
    }

    // Получаем состояние темы
    const isDarkTheme = settings.colorTheme === 'dark' ||
        (settings.colorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Очищаем содержимое окна предпросмотра и добавляем обложку и информацию о скриншотах
    previewWindow.innerHTML = '';

    // Добавляем контейнер с обложкой, если она найдена
    if (coverUrl) {
        previewWindow.appendChild(coverContainer);
    }

    // Добавляем информацию о количестве скриншотов
    const infoElement = createElement('div', {
        textContent: `Скриншоты: ${screenshotLinks.length ? screenshotLinks.length : 'Не найдены'}`
    });
    previewWindow.appendChild(infoElement);

    if (screenshotLinks.length > 0) {
        // Запускаем фоновую обработку URL для получения прямых ссылок
        const fullSizeUrls = screenshotLinks.map(link => link.fullUrl);

        // Создаем массивы для лайтбокса
        const thumbnailsForLightbox = screenshotLinks.map(link => link.thumbUrl);
        const fullSizeUrlsForLightbox = [...fullSizeUrls];

        // Если есть обложка, добавляем её в начало массивов
        if (coverUrl) {
            thumbnailsForLightbox.unshift(coverUrl);
            fullSizeUrlsForLightbox.unshift(coverUrl);
        }

        // Сохраняем исходные данные для лайтбокса - создаем currentPreviewData с уникальным ID
        currentPreviewData = {
            id: requestId, // ДОБАВЛЯЕМ ID
            thumbnails: thumbnailsForLightbox,
            fullSizeUrls: fullSizeUrlsForLightbox,
            processedUrls: null, // Будет заполнено после обработки
            siteName: siteName,
            siteConfig: siteConfig
        };

        // Создаем контекст для обработки URL с возможностью отмены
        const urlProcessingContext = {
            cancelled: false,
            requestId: requestId
        };

        // Сохраняем контекст как активный
        activeUrlProcessing = urlProcessingContext;

        // Запускаем фоновую обработку URL с контекстом
        processImageUrls(fullSizeUrlsForLightbox, function(processedUrls) {
            log('Фоновая обработка URL завершена, получены прямые ссылки:', processedUrls.length);
            log('Примеры обработанных URL:', processedUrls.slice(0, 3));
            // Проверка: актуален ли еще этот запрос
            if (activePreviewId !== requestId) {
                log('Игнорируем processedUrls для устаревшего превью, requestId:', requestId);
                return;
            }

            // Проверка: существует ли еще currentPreviewData и совпадает ли ID
            if (currentPreviewData && currentPreviewData.id === requestId) {
                log('Фоновая обработка URL завершена, получены прямые ссылки:', processedUrls.length);
                currentPreviewData.processedUrls = processedUrls;
                // log('processedUrls сохранены в currentPreviewData, количество:', processedUrls.length); // Фоновая обработка URL завершена, получены прямые ссылки
            } else {
                log('currentPreviewData уже не актуальна или изменилась');
            }
        }, urlProcessingContext); // Передаем контекст

        // Создаем контейнер для отображения миниатюр с настройками количества столбцов
        const imagesContainer = createElement('div', {}, {
            display: 'grid',
            gridTemplateColumns: `repeat(${settings.previewGridColumns}, 1fr)`,
            gap: '5px',
            justifyItems: 'center'
        });

        // Если настроено не скрывать изображения под спойлер или количество изображений меньше предела
        const maxVisible = settings.neverUseSpoilers ? screenshotLinks.length : settings.maxThumbnailsBeforeSpoiler;

        // Добавляем первые N скриншотов с указанием имени сайта для настройки поведения при клике
        // Важно: Для превью используем thumbUrl, для лайтбокса будут использоваться processedUrls
        addImagesToContainer(imagesContainer, screenshotLinks, siteConfig.openImage, siteName, 0, maxVisible);
        previewWindow.appendChild(imagesContainer);

        // Спойлер с остальными скриншотами (если их больше N и не выбрана опция "никогда не скрывать под спойлер")
        if (!settings.neverUseSpoilers && screenshotLinks.length > settings.maxThumbnailsBeforeSpoiler) {
            const spoilerContainer = createElement('div', {}, {
                marginTop: '10px'
            });

            const spoilerButton = createElement('button',
                { textContent: 'Показать остальные скриншоты' },
                {
                    background: isDarkTheme ? '#333' : '#f0f0f0',
                    border: `1px solid ${isDarkTheme ? '#555' : '#ccc'}`,
                    color: isDarkTheme ? '#eee' : 'black',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    width: '100%'
                }
            );

            const hiddenImagesContainer = createElement('div', {}, {
                display: 'none',
                gridTemplateColumns: `repeat(${settings.previewGridColumns}, 1fr)`,
                gap: '5px',
                justifyItems: 'center',
                marginTop: '10px'
            });

            // Добавляем остальные скриншоты с указанием имени сайта
            addImagesToContainer(hiddenImagesContainer, screenshotLinks, siteConfig.openImage, siteName, settings.maxThumbnailsBeforeSpoiler);

            const buttonClickHandler = () => {
                if (hiddenImagesContainer.style.display === 'none') {
                    hiddenImagesContainer.style.display = 'grid';
                    spoilerButton.textContent = 'Скрыть скриншоты';
                } else {
                    hiddenImagesContainer.style.display = 'none';
                    spoilerButton.textContent = 'Показать скриншоты';
                }
            };
            spoilerButton.addEventListener('click', buttonClickHandler);
            // Сохраняем обработчик для последующего удаления
            eventHandlers.push({ element: spoilerButton, type: 'click', handler: buttonClickHandler });

            spoilerContainer.appendChild(spoilerButton);
            spoilerContainer.appendChild(hiddenImagesContainer);
            previewWindow.appendChild(spoilerContainer);
        }
    } else if (coverUrl) {
        // Если нет скриншотов, но есть обложка - создаем currentPreviewData только с обложкой
        currentPreviewData = {
            id: requestId, // ДОБАВЛЯЕМ ID
            thumbnails: [coverUrl],
            fullSizeUrls: [coverUrl],
            processedUrls: [coverUrl], // Обложка обычно не требует обработки
            siteName: siteName,
            siteConfig: siteConfig
        };
    }

    // Добавляем обработчики событий мыши если их еще нет
    if (previewWindow) {
        // Функции-обработчики для окна предпросмотра
        const mouseEnterHandler = () => {
            clearTimeout(removeTimeout);
            removeTimeout = null;
        };

        const mouseLeaveHandler = () => {
            clearTimeout(removeTimeout);
            // Не закрываем превью, если открыт лайтбокс
            if (!isLightboxOpen) {
                removeTimeout = setTimeout(() => {
                    removePreviewWindow();
                }, settings.previewHideDelay);
            }
        };

        // Добавляем обработчики и сохраняем их для последующего удаления
        previewWindow.addEventListener('mouseenter', mouseEnterHandler);
        previewWindow.addEventListener('mouseleave', mouseLeaveHandler);
        requestLink.addEventListener('mouseleave', mouseLeaveHandler);

        // Сохраняем обработчики для последующего удаления
        eventHandlers.push(
            { element: previewWindow, type: 'mouseenter', handler: mouseEnterHandler },
            { element: previewWindow, type: 'mouseleave', handler: mouseLeaveHandler },
            { element: requestLink, type: 'mouseleave', handler: mouseLeaveHandler }
        );
    }
}

// Функция для создания окна предпросмотра
function createPreviewWindow(event, siteConfig) {
    // Проверяем, включено ли автоматическое открытие превью
    if (!settings.enableAutoPreview) return;

    // Проверяем, включен ли этот сайт в настройках
    const siteName = Object.keys(sitesConfig).find(name => isUrlMatch(window.location.href, sitesConfig[name].matchUrls));
    if (siteName && !settings.siteSettings[siteName].enabled) return;

    const link = event.target.closest(siteConfig.topicLinkSelector);
    if (!link) return;

    // Обновляем текущую ссылку, на которую наведена мышь
    hoverPreviewLink = link;

    // Отменяем любой таймаут, который был установлен для скрытия окна
    if (removeTimeout) {
        clearTimeout(removeTimeout);
        removeTimeout = null;
    }

    // Если окно уже существует для этой ссылки, не создаем новое
    if (previewWindow && currentPreviewLink === link) {
        return;
    }

    // Генерируем новый уникальный ID
    const newRequestId = ++previewRequestId;
    activePreviewId = newRequestId;

    log('Создаем новое превью с ID:', newRequestId);

    // Агрессивная отмена всех активных операций

    // 1. Отменяем активную обработку URL
    if (activeUrlProcessing) {
        log('Отменяем активную обработку URL для ID:', activeUrlProcessing.requestId);
        activeUrlProcessing.cancelled = true;
        activeUrlProcessing = null;
    }

    // 2. Отменяем текущий AJAX-запрос
    if (currentRequest && requestInProgress) {
        log('Отменяем активный AJAX-запрос');
        try {
            currentRequest.abort();
        } catch (e) {
            log('Ошибка при отмене запроса:', e);
        }
        currentRequest = null;
        requestInProgress = false;
    }

    // 3. Очищаем старые данные превью
    currentPreviewData = null;

    // Удаляем старое окно и обработчики
    removePreviewWindow();

    // Отмечаем текущую ссылку, для которой будет показано превью
    currentPreviewLink = link;

    // Применяем цветовые стили в зависимости от цветовой схемы
    const isDarkTheme = settings.colorTheme === 'dark' ||
        (settings.colorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Создаем окно предпросмотра
    previewWindow = createElement('div',
        {
            id: 'torrent-preview',
            innerHTML: 'Загрузка...'
        },
        {
            position: 'absolute',
            backgroundColor: isDarkTheme ? '#222' : 'white',
            color: isDarkTheme ? '#eee' : 'black',
            border: `1px solid ${isDarkTheme ? '#444' : '#ccc'}`,
            padding: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: '1000',
            maxWidth: `${settings.previewMaxWidth}px`,
            maxHeight: `${settings.previewMaxHeight}px`,
            overflowY: 'auto',
            wordWrap: 'break-word'
        }
    );

    document.body.appendChild(previewWindow);

    // Функция для обновления позиции окна предпросмотра
    const updatePosition = () => {
        if (!previewWindow) return;
        const rect = link.getBoundingClientRect();

        // Устанавливаем положение в зависимости от настроек
        switch (settings.previewPosition) {
            case 'topLeft':
                previewWindow.style.top = (rect.top + window.scrollY - previewWindow.offsetHeight - 5) + 'px';
                previewWindow.style.left = (rect.left + window.scrollX) + 'px';
                break;
            case 'topRight':
                previewWindow.style.top = (rect.top + window.scrollY - previewWindow.offsetHeight - 5) + 'px';
                previewWindow.style.left = (rect.right + window.scrollX - previewWindow.offsetWidth) + 'px';
                break;
            case 'bottomLeft':
                previewWindow.style.top = (rect.bottom + window.scrollY + 5) + 'px';
                previewWindow.style.left = (rect.left + window.scrollX) + 'px';
                break;
            case 'bottomRight':
            default:
                previewWindow.style.top = (rect.bottom + window.scrollY + 5) + 'px';
                previewWindow.style.left = (rect.right + window.scrollX - previewWindow.offsetWidth) + 'px';
                break;
        }
    };

    updatePosition();

    // Добавляем обработчик прокрутки и сохраняем его для последующего удаления
    const scrollHandler = () => updatePosition();
    window.addEventListener('scroll', scrollHandler);
    eventHandlers.push({ element: window, type: 'scroll', handler: scrollHandler });

    // Запоминаем ссылку, для которой создается превью
    const requestLink = link;
    const requestUrl = link.href;

    // Проверяем кэш запросов
    if (cachedRequests[requestUrl]) {
        log('Используем кэшированный ответ для:', requestUrl, 'с ID:', newRequestId);
        processResponseData(cachedRequests[requestUrl], requestLink, siteConfig, newRequestId);
        return;
    }

    // Устанавливаем флаг запроса в процессе
    requestInProgress = true;

    // Выполняем AJAX запрос для получения содержимого страницы
    currentRequest = GM_xmlhttpRequest({
        method: 'GET',
        url: requestUrl,
        onload: function(response) {
            // Сбрасываем флаг запроса
            requestInProgress = false;

            // Проверка: актуален ли еще этот запрос
            if (activePreviewId !== newRequestId) {
                log('Получен ответ для устаревшего запроса ID:', newRequestId, 'текущий activePreviewId:', activePreviewId);
                return;
            }

            // Кэшируем ответ
            cachedRequests[requestUrl] = response;

            // Если текущая ссылка под курсором изменилась, но это была последняя запрошенная ссылка
            if (hoverPreviewLink !== requestLink && currentPreviewLink !== requestLink) {
                log('Мышь перешла на другую ссылку, игнорируем ответ для:', requestUrl);
                return;
            }

            // Обработка готовых данных - передаем requestId в обработчик
            processResponseData(response, requestLink, siteConfig, newRequestId);

            // Сбрасываем текущий запрос после завершения
            currentRequest = null;
        }
    });
}

// Механизм задержки для предотвращения создания превью при быстром проходе мыши
let hoverTimer = null;
const hoverDelay = 10; // Небольшая задержка в мс для фильтрации быстрых перемещений мыши

// Функция для удаления окна предпросмотра и всех связанных обработчиков
function removePreviewWindow() {
    // Отменяем активную обработку URL при удалении превью
    if (activeUrlProcessing) {
        log('Отменяем обработку URL при удалении превью, ID:', activeUrlProcessing.requestId);
        activeUrlProcessing.cancelled = true;
        activeUrlProcessing = null;
    }

    // Удаляем все зарегистрированные обработчики событий
    eventHandlers.forEach(handler => {
        if (handler.element && handler.element.removeEventListener) {
            handler.element.removeEventListener(handler.type, handler.handler);
        }
    });

    // Очищаем массив обработчиков
    eventHandlers = [];

    // Удаляем окно предпросмотра, если оно существует
    if (previewWindow) {
        previewWindow.remove();
        previewWindow = null;
    }

    // Очищаем ссылки
    currentPreviewLink = null;

    // Очищаем данные текущего превью
    currentPreviewData = null;

    // Отменяем текущий запрос, если он в процессе
    if (currentRequest && requestInProgress) {
        try {
            currentRequest.abort();
        } catch (e) {
            log('Ошибка при отмене запроса:', e);
        }
        currentRequest = null;
        requestInProgress = false;
    }

    // Очищаем кэш при необходимости
    cleanupCache();
}

//====================================
// ИНИЦИАЛИЗАЦИЯ СКРИПТА
//====================================

// Проверяем, поддерживается ли текущий сайт
function initializeScript() {
    // Проверяем каждый сайт по его URL-паттернам
    for (const [siteName, siteConfig] of Object.entries(sitesConfig)) {
        if (isUrlMatch(window.location.href, siteConfig.matchUrls)) {
            log('Инициализация скрипта для сайта:', siteName);

            // Слушаем событие mouseenter для отслеживания наведения на ссылки
            document.addEventListener('mouseenter', (event) => {
                // Сначала очищаем существующий таймер, если он есть
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                }

                // Проверяем, что мышь наведена на ссылку этого сайта
                const link = event.target.closest(siteConfig.topicLinkSelector);
                if (link) {
                    // Обновляем, на какой ссылке находится курсор в данный момент
                    hoverPreviewLink = link;

                    // Отменяем любой существующий таймаут при наведении на ссылку
                    clearTimeout(removeTimeout);
                    removeTimeout = null;

                    // Задержка перед созданием превью для фильтрации случайных перемещений
                    hoverTimer = setTimeout(() => {
                        // Создаем превью только если мышь все еще над этой ссылкой
                        if (hoverPreviewLink === link) {
                            createPreviewWindow(event, siteConfig);
                        }
                    }, hoverDelay);
                } else {
                    // Если курсор не на ссылке, то обнуляем переменную текущей ссылки
                    hoverPreviewLink = null;
                }
            }, true);

            // Отслеживание области документа, не связанной с предпросмотром
            document.addEventListener('mouseover', (event) => {
                if (!previewWindow || isLightboxOpen) return;

                // Проверяем, покинула ли мышь область предпросмотра и ссылки
                const isOverPreview = event.target.closest('#torrent-preview');
                const isOverLink = currentPreviewLink && (
                    event.target === currentPreviewLink ||
                    event.target.closest(currentPreviewLink.tagName + '[href="' + currentPreviewLink.getAttribute('href') + '"]')
                );

                if (!isOverPreview && !isOverLink) {
                    removePreviewWithDelay();
                } else {
                    // Если мышь над превью или ссылкой, отменяем таймер
                    clearTimeout(removeTimeout);
                    removeTimeout = null;
                }
            });

            return; // Выходим после нахождения подходящего сайта
        }
    }

    log('Текущий сайт не поддерживается:', window.location.href);
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScript);
} else {
    initializeScript();
}

})();