// ==UserScript==
// @name         Grok - Filter'S For Code 1.25.26
// @version      1.25.26
// @description  Adds a filter menu to the code blocks in the Grok chat while maintaining the settings
// @author       tapeavion
// @license      MIT
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/531088/Grok%20-%20Filter%27S%20For%20Code%2012526.user.js
// @updateURL https://update.greasyfork.org/scripts/531088/Grok%20-%20Filter%27S%20For%20Code%2012526.meta.js
// ==/UserScript==
  
  
// ==== custom slider Volume grok imagin === //  

(function () {
    'use strict';
    const VOLUME_KEY = 'customGrokVideoVolume';

    // Стили (без изменений)
    let style = document.getElementById('custom-he5jfyj5jfyt-volume-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'custom-he5jfyj5jfyt-volume-style';
  style.textContent = `
    .slider-volume::-webkit-slider-thumb {
        appearance: none;
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        cursor: pointer !important;
    }
    .slider-volume::-moz-range-thumb {
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        cursor: pointer !important;
        border: none;
    }
    .custom-play-pause-btn {
        width: 37px !important;
        height: 39px !important;
        background: #3c2c50;
        border-radius: 34px !important;
        border: solid 1px #cdb4e2;
        pointer-events: auto !important; /* Добавлено */
    }
    .custom-volume-controls {
        position: relative !important;
        top: 9px !important;
        width: 252px !important;
        background: #13052782 !important;
        cursor: pointer !important;
        z-index: 1000000 !important;
        pointer-events: auto !important; /* Основное исправление */
    }
    .custom-volume-slider {
        appearance: none !important;
        height: 14px !important;
        background: #153031 !important;
        cursor: pointer !important;
        pointer-events: auto !important; /* Добавлено для надёжности */
    }
`;
        document.head.appendChild(style);
    }

    const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`;
    const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

    function getSavedVolume() {
        const saved = parseFloat(localStorage.getItem(VOLUME_KEY));
        return isNaN(saved) ? 0.75 : saved;
    }

    function setGlobalVolume(vol) {
        localStorage.setItem(VOLUME_KEY, vol);
        document.querySelectorAll('video').forEach(video => {
            video.volume = vol;
        });
        document.querySelectorAll('.custom-volume-slider').forEach(slider => {
            slider.value = vol;
        });
    }

    // === Новый наблюдатель за громкостью (чтобы не было сброса на 100%) ===
    const volumeObserver = new MutationObserver(mutations => {
        const vol = getSavedVolume();
        mutations.forEach(mutation => {
            // Новые узлы
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        node.volume = vol;
                    }
                });
            }
            // Изменение атрибута src
            if (mutation.type === 'attributes' && mutation.attributeName === 'src' && mutation.target.nodeName === 'VIDEO') {
                mutation.target.volume = vol;
            }
        });
    });
    volumeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    });

    // === Перехват play() — только одно видео играет на всей странице ===
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
        document.querySelectorAll('video').forEach(v => {
            if (v !== this) v.pause();
        });
        return originalPlay.apply(this, arguments);
    };

    function initializeForPlayer(controlsContainer) {
        if (controlsContainer.querySelector('.custom-volume-controls')) return;

        const playerGroup = controlsContainer.closest('.group.relative.mx-auto.rounded-2xl.overflow-hidden');
        if (!playerGroup) return;

        const videos = playerGroup.querySelectorAll('video');
        if (videos.length === 0) return;

        const customContainer = document.createElement('div');
        customContainer.className = 'custom-volume-controls flex flex-row items-center gap-6 bg-black/60 backdrop-blur-sm rounded-full px-5 py-3';

        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'custom-play-pause-btn text-white focus:outline-none';

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.className = 'custom-volume-slider w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-volume';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.01';

        customContainer.appendChild(playPauseBtn);
        customContainer.appendChild(volumeSlider);
        controlsContainer.appendChild(customContainer);

        [customContainer, volumeSlider, playPauseBtn].forEach(el => {
            el.addEventListener('click', e => e.stopPropagation());
            el.addEventListener('mousedown', e => e.stopPropagation());
            el.addEventListener('touchstart', e => e.stopPropagation());
        });

        // === Обновление иконки: проверяем, играет ли хоть одно видео в плеере ===
        function updateIcon() {
            const anyPlaying = Array.from(videos).some(v => !v.paused);
            playPauseBtn.innerHTML = anyPlaying ? pauseIcon : playIcon;
        }

        // Изначальное состояние
        updateIcon();

        // Кнопка play/pause
        playPauseBtn.addEventListener('click', e => {
            e.stopPropagation();
            const anyPlaying = Array.from(videos).some(v => !v.paused);
            if (anyPlaying) {
                videos.forEach(v => v.pause());
            } else {
                videos.forEach(v => v.play().catch(() => {}));
            }
            updateIcon();
        });

        // Отслеживаем внешние изменения состояния (автовоспроизведение и т.д.)
        videos.forEach(v => {
            v.addEventListener('play', updateIcon);
            v.addEventListener('pause', updateIcon);
            v.addEventListener('loadeddata', updateIcon);
        });

        // Громкость
        const currentVolume = getSavedVolume();
        videos.forEach(v => v.volume = currentVolume);
        volumeSlider.value = currentVolume;

        volumeSlider.addEventListener('input', e => {
            e.stopPropagation();
            const vol = parseFloat(volumeSlider.value);
            setGlobalVolume(vol);
        });
    }

    function initializeAll() {
        const containers = document.querySelectorAll('.absolute.bottom-12.left-0.flex.flex-col.items-center.w-full.p-3.gap-3');
        containers.forEach(initializeForPlayer);
    }

    const observer = new MutationObserver(initializeAll);
    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализация существующих
    initializeAll();

    // Применяем сохранённую громкость ко всем видео сразу (на всякий случай)
    setGlobalVolume(getSavedVolume());
})();



(function() {
    'use strict';
 
    // Флаг для включения/выключения логов
    let LOGS_ENABLED = false; // false, true
 
    // Функция логирования с проверкой флага
    function log(...args) {
        if (LOGS_ENABLED) {
            console.log(...args); // Исправлено: было log(...args), что вызывало рекурсию
        }
    }
 
    // Вкл/выкл логов снаружи (для удобства отладки в консоли)
    window.toggleLogs = function(state) {
        if (typeof state === 'boolean') {
            LOGS_ENABLED = state;
        } else {
            LOGS_ENABLED = !LOGS_ENABLED; // переключатель
        }
        log(`Логи ${LOGS_ENABLED ? 'включены' : 'выключены'}`);
    };
 
    // Определение языка пользователя
    const userLang = navigator.language || navigator.languages[0];
    const isRussian = userLang.startsWith('ru');
    const defaultLang = isRussian ? 'ru' : 'en';
 
    // Локализация
    const translations = {
        ru: {
            filtersBtn: 'Фильтры',
            sliderLabel: 'Степень:',
            // Удалено: commentColorLabel: 'Цвет комментариев:',
            // Удалено: resetColorBtn: 'Сбросить цвет',
            filters: [
                { name: 'Негатив', value: 'invert', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 },
                { name: 'Сепия', value: 'sepia', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 },
                { name: 'Ч/Б', value: 'grayscale', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 },
                { name: 'Размытие', value: 'blur', hasSlider: true, min: 0, max: 5, step: 0.1, default: 2, unit: 'px' },
                { name: 'Контраст', value: 'contrast', hasSlider: true, min: 0, max: 3, step: 0.1, default: 2 },
                { name: 'Яркость', value: 'brightness', hasSlider: true, min: 0, max: 3, step: 0.1, default: 1.5 },
                { name: 'Поворот оттенка', value: 'hue-rotate', hasSlider: true, min: 0, max: 360, step: 1, default: 90, unit: 'deg' },
                { name: 'Насыщенность', value: 'saturate', hasSlider: true, min: 0, max: 3, step: 0.1, default: 1 },
                { name: 'Прозрачность', value: 'opacity', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 }
            ],
            langSelect: 'Выберите язык:',
            langOptions: [
                { value: 'ru', label: 'Русский' },
                { value: 'en', label: 'English' }
            ]
        },
        en: {
            filtersBtn: 'Filters',
            sliderLabel: 'Level:',
            // Удалено: commentColorLabel: 'Comment color:',
            // Удалено: resetColorBtn: 'Reset color',
            filters: [
                { name: 'Invert', value: 'invert', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 },
                { name: 'Sepia', value: 'sepia', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 },
                { name: 'Grayscale', value: 'grayscale', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 },
                { name: 'Blur', value: 'blur', hasSlider: true, min: 0, max: 5, step: 0.1, default: 2, unit: 'px' },
                { name: 'Contrast', value: 'contrast', hasSlider: true, min: 0, max: 3, step: 0.1, default: 2 },
                { name: 'Brightness', value: 'brightness', hasSlider: true, min: 0, max: 3, step: 0.1, default: 1.5 },
                { name: 'Hue Rotate', value: 'hue-rotate', hasSlider: true, min: 0, max: 360, step: 1, default: 90, unit: 'deg' },
                { name: 'Saturate', value: 'saturate', hasSlider: true, min: 0, max: 3, step: 0.1, default: 1 },
                { name: 'Opacity', value: 'opacity', hasSlider: true, min: 0, max: 1, step: 0.1, default: 1 }
            ],
            langSelect: 'Select language:',
            langOptions: [
                { value: 'ru', label: 'Русский' },
                { value: 'en', label: 'English' }
            ]
        }
    };
 
    // Глобальный объект для хранения настроек и контейнеров
    const state = {
        settings: null,
        codeBlocks: new Map() // Храним соответствие headerBlock -> {codeContainer, filterBtn, filterMenu}
    };
 
    // Загрузка настроек
    function loadSettings(callback) {
        chrome.storage.local.get(
            ['filterMenuLang', 'codeFilterStates', 'codeFilterValues'], // Удалено: 'commentColor'
            (result) => {
                const settings = {
                    filterMenuLang: result.filterMenuLang || defaultLang,
                    codeFilterStates: result.codeFilterStates || {},
                    codeFilterValues: result.codeFilterValues || {},
                    // Удалено: commentColor: result.commentColor || 'rgb(106, 153, 85)'
                };
                state.settings = settings;
                callback(settings);
            }
        );
    }
 
    //  ===================== инъекция статического Фона CSS ======================
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        pre.shiki.slack-dark {
            background: rgb(34 34 34) !important;
        }
    `;
    document.head.appendChild(styleElement);
    //  ===================== инъекция статического Фона CSS ======================
 
    // Применение фильтров к конкретному блоку с retry
    // Обновлённая функция applyFilters (убрали логику фона)
    function applyFilters(targetBlock, filterStates, filterValues, retries = 10) {
        const preElement = targetBlock.querySelector('pre.shiki');
        if (!preElement) {
            if (retries > 0) {
                setTimeout(() => applyFilters(targetBlock, filterStates, filterValues, retries - 1), 100);
            } else {
                console.warn('Элемент <pre> не найден в контейнере:', targetBlock);
            }
            return;
        }
 
        // Сбрасываем CSS-фильтр перед применением своих
        preElement.style.setProperty('filter', 'none', 'important');
 
        const filters = translations[state.settings.filterMenuLang].filters;
        const activeFilters = filters
            .filter(filter => filterStates[filter.value])
            .map(filter => {
                const unit = filter.unit || '';
                const value = filterValues[filter.value] || filter.default;
                return `${filter.value}(${value}${unit})`;
            });
 
        // Применяем фильтры с приоритетом
        preElement.style.setProperty('filter', activeFilters.length > 0 ? activeFilters.join(' ') : 'none', 'important');
    }
 
    // Обновление фильтров для всех блоков
    function updateAllFilters() {
        state.codeBlocks.forEach(({codeContainer}) => {
            applyFilters(codeContainer, state.settings.codeFilterStates, state.settings.codeFilterValues);
        });
        chrome.storage.local.set({
            codeFilterStates: state.settings.codeFilterStates,
            codeFilterValues: state.settings.codeFilterValues
        });
    }
 
    // Удалена функция: applyCommentColor
    // Удалена функция: updateAllCommentColors
 
    // Создание меню фильтров
    function addFilterMenu(headerBlock, codeContainer) {
        if (headerBlock.querySelector('.filter-menu-btn')) return;
 
        let currentLang = state.settings.filterMenuLang;
        // Удалено: let currentCommentColor = state.settings.commentColor;
        let savedFilterStates = { ...state.settings.codeFilterStates };
        let savedFilterValues = { ...state.settings.codeFilterValues };
 
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-menu-btn';
        filterBtn.textContent = translations[currentLang].filtersBtn;
 
        const filterMenu = document.createElement('div');
        filterMenu.className = 'filter-menu';
 
        // Инициализация фильтров
        const filters = translations[currentLang].filters;
        filters.forEach(filter => {
            if (!(filter.value in savedFilterStates)) {
                savedFilterStates[filter.value] = false;
            }
            if (!(filter.value in savedFilterValues)) {
                savedFilterValues[filter.value] = filter.default;
            }
        });
 
        // Создание выпадающего списка для языка
        const langSelect = document.createElement('select');
        langSelect.className = 'language-select';
        const langLabel = document.createElement('label');
        langLabel.textContent = translations[currentLang].langSelect;
        langLabel.style.color = ' #a0a0a0';
        langLabel.style.fontSize = '12px';
        langLabel.style.marginBottom = '2px';
        langLabel.style.display = 'block';
 
        translations[currentLang].langOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            if (option.value === currentLang) opt.selected = true;
            langSelect.appendChild(opt);
        });
 
        // Удалено: Создание выбора цвета (colorPickerLabel, colorPicker, debounce, обработчик input)
        // Удалено: function debounce(...) { ... }
 
        // Обновление интерфейса при смене языка
        function updateLanguage(lang) {
            currentLang = lang;
            state.settings.filterMenuLang = lang;
            chrome.storage.local.set({ filterMenuLang: lang });
            filterBtn.textContent = translations[currentLang].filtersBtn;
            langLabel.textContent = translations[currentLang].langSelect;
            // Удалено: colorPickerLabel.textContent = translations[currentLang].commentColorLabel;
            renderFilters();
        }
 
        langSelect.addEventListener('change', () => updateLanguage(langSelect.value));
 
        // Рендеринг фильтров
        function renderFilters() {
            filterMenu.innerHTML = '';
            filterMenu.appendChild(langLabel);
            filterMenu.appendChild(langSelect);
            // Удалено: filterMenu.appendChild(colorPickerLabel); filterMenu.appendChild(colorPicker);
            // Удалено: const resetColorBtn = ...; filterMenu.appendChild(resetColorBtn);
 
            filters.forEach(filter => {
                const filterItem = document.createElement('div');
                filterItem.className = 'filter-item';
 
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = savedFilterStates[filter.value];
                checkbox.id = `filter-${filter.value}-${Date.now()}`; // Уникальный ID
 
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = filter.name;
 
                const sliderLabel = document.createElement('label');
                sliderLabel.className = 'filter-slider-label';
                sliderLabel.textContent = translations[currentLang].sliderLabel;
 
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.className = 'filter-slider';
                slider.min = filter.min;
                slider.max = filter.max;
                slider.step = filter.step;
                slider.value = savedFilterValues[filter.value];
 
                // Добавляем стилизацию ползунка
                const updateSlider = () => {
                    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
                    slider.style.background = `linear-gradient(to right, #218a73 ${value}%, #173034 ${value}%)`;
                };
 
                // Обновляем при изменении значения слайдера
                slider.addEventListener('input', updateSlider);
 
                // Инициализация при загрузке
                updateSlider();
 
                if (checkbox.checked && filter.hasSlider) {
                    slider.style.display = 'block';
                    sliderLabel.style.display = 'block';
                }
 
                checkbox.addEventListener('change', () => {
                    savedFilterStates[filter.value] = checkbox.checked;
                    state.settings.codeFilterStates = savedFilterStates;
                    if (filter.hasSlider) {
                        slider.style.display = checkbox.checked ? 'block' : 'none';
                        sliderLabel.style.display = checkbox.checked ? 'block' : 'none';
                    }
                    updateAllFilters();
                });
 
                slider.addEventListener('input', () => {
                    savedFilterValues[filter.value] = slider.value;
                    state.settings.codeFilterValues = savedFilterValues;
                    updateAllFilters();
                });
 
                filterItem.appendChild(checkbox);
                filterItem.appendChild(label);
                filterMenu.appendChild(filterItem);
                filterMenu.appendChild(sliderLabel);
                filterMenu.appendChild(slider);
            });
        }
 
        renderFilters();
 
        filterBtn.addEventListener('click', () => {
            filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
        });
 
        document.addEventListener('click', (e) => {
            if (!filterBtn.contains(e.target) && !filterMenu.contains(e.target)) {
                filterMenu.style.display = 'none';
            }
        });
 
        headerBlock.style.position = 'relative';
        headerBlock.appendChild(filterBtn);
        headerBlock.appendChild(filterMenu);
 
        // Сохраняем блок в state
        state.codeBlocks.set(headerBlock, { codeContainer, filterBtn, filterMenu });
 
        applyFilters(codeContainer, savedFilterStates, savedFilterValues);
        // Удалено: applyCommentColor(codeContainer, currentCommentColor);
    }
 
    // Обработка блоков кода
    function processCodeBlocks() {
        if (!state.settings) {
            loadSettings((settings) => {
                processCodeBlocksInternal(settings);
            });
            return;
        }
        processCodeBlocksInternal(state.settings);
    }
 
    function findCodeContainer(bar) {
        let sibling = bar.nextElementSibling;
        while (sibling) {
            if (sibling.matches('div.shiki') || sibling.querySelector('pre, code') || sibling.matches('div[class*="code"]') || sibling.matches('div.sticky')) {
                if (sibling.matches('div.shiki')) {
                    return sibling;
                }
            }
            sibling = sibling.nextElementSibling;
        }
        return null;
    }
 
    function processCodeBlocksInternal(settings) {
        const headerSelectors = [
            'div.flex.flex-row.px-4.py-2.h-10.items-center.rounded-t-xl.bg-surface-l1.border.border-border-l1 > span.font-mono.text-xs',
            'div.flex.flex-row.px-4.py-2.h-10.items-center.rounded-t-xl.bg-surface-l2.border.border-border-l1 > span.font-mono.text-xs',
            'div.flex.flex-row.items-center.rounded-t-xl.bg-surface-l2.border > span.font-mono.text-xs',
            'div[class*="flex"][class*="rounded-t"] > span.font-mono.text-xs',
            'div[class*="flex"][class*="bg-surface"] > span',
            'div > span[class*="font-mono"]'
        ];
 
        let headerBlocks = [];
        for (const selector of headerSelectors) {
            const headers = Array.from(document.querySelectorAll(selector))
                .filter(span => {
                    const text = span.textContent.toLowerCase();
                    return [
                        'javascript',
                        'js',
                        'kotlin',
                        'properties',
                        'typescript',
                        'text',
                        'scss',
                        'css',
                        'html',
                        'python',
                        'java',
                        'vue',
                        'cpp',
                        'json',
                        'bash',
                         'powershell',
                        'sql',
                        'xml',
                        'yaml',
                        'markdown'
                    ].includes(text);
                })
                .map(span => span.closest('div'));
            headerBlocks.push(...headers);
        }
        headerBlocks = [...new Set(headerBlocks)];
 
        // Очистка удалённых блоков
        state.codeBlocks.forEach((value, key) => {
            if (!document.body.contains(key)) {
                state.codeBlocks.delete(key);
            }
        });
 
        headerBlocks.forEach(headerBlock => {
            if (state.codeBlocks.has(headerBlock)) return;
 
            const langSpan = headerBlock.querySelector('span.font-mono.text-xs');
            if (!langSpan) {
                log('Не найден span с языком:', headerBlock);
                return;
            }
 
            const codeContainer = findCodeContainer(headerBlock);
 
            if (codeContainer) {
                addFilterMenu(headerBlock, codeContainer);
                // Наблюдатель за изменениями внутри codeContainer
                const codeObserver = new MutationObserver(() => {
                    requestAnimationFrame(() => {
                        // Удалено: applyCommentColor(codeContainer, state.settings.commentColor);
                    });
                });
                codeObserver.observe(codeContainer, { childList: true, subtree: true, attributes: true });
            } else {
                log('Контейнер кода не найден для:', headerBlock);
            }
        });
    }
 
    // Инициализация
    processCodeBlocks();
 
    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver((mutations) => {
        const relevantChanges = mutations.some(mutation => {
            return mutation.addedNodes.length > 0 && Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 && (
                    node.getAttribute('data-testid') === 'code-block' ||
                    node.matches('div.message-bubble, .flex.flex-col.items-center, div.response-content-markdown, div.shiki, div[class*="code"], div[class*="flex"][class*="rounded-t"], div[class*="bg-surface-l1"]') ||
                    node.querySelector('[data-testid="code-block"], div.message-bubble, div.response-content-markdown, div.shiki, div[class*="code"], div[class*="flex"][class*="rounded-t"], div[class*="bg-surface-l1"]')
                );
            });
        });
        if (relevantChanges) {
            processCodeBlocks();
            setTimeout(processCodeBlocks, 1000);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
 
})();
   
 


  //  ======== inject css custom ======= //
(function() {
    // Проверяем, не добавлен ли уже этот стиль (по уникальному селектору, чтобы избежать дубликатов)
    if (document.querySelector('#grok-styles-inject')) {
        console.log('Стили уже инжектированы.');
        return;
    }
 
    var style = document.createElement('style');
    style.id = 'grok-styles-inject'; // Уникальный ID для идентификации
    style.type = 'text/css';
 
    style.innerHTML = `
  /* ==================== БАР Полоска с кнопками копировать, свернуть, фильтр, ВЕРХНИЙ ==================== */
.flex.flex-row.px-4.py-2.h-10.items-center.rounded-t-xl.bg-surface-l1.border.border-border-l1 {
    background: #cfb252 !important;
    color: black !important;
    height: 98px !important;
}
/* ------ новый селектор для markdown js --------*/
.flex.flex-row.px-4.py-2.h-10  {
     background: #cfb252 !important;
    color: black !important;
    height: 95px !important;
}

span.font-mono {
  color: #000000 !important;
}

/* ==================== БАР Полоска с кнопками копировать, свернуть, фильтр, ВЕРХНИЙ ==================== */

/*======== контейнер с кодом code ========*/
 pre.shiki.slack-dark {
            background: rgb(34 34 34) !important;
 }
/*======== контейнер с кодом code ========*/

/*======== color-comments ========*/

button#color-comments-btn {
    position: absolute !important;
    right: 520px !important;
}
/*======== color-comments ========*/

.filter-menu {
   z-index: 100002 !important;
    top: 100px;
    right: 4px;
    z-index: 9999;
    display: none;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px;
    width: 285px;
    max-height: 750px;
    overflow-y: auto;
    background: rgb(45, 45, 45);
    border-radius: 8px;
    padding: 5px;
    border-width: 2px !important;
    border-style: solid !important;
    border-color: rgb(93, 255, 247) !important;
    border-image: initial !important;
}
.filter-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
    color: #a0a0a0;
    font-size: 12px;
}
.filter-item input[type="checkbox"] {
    margin-right: 5px;
}
.filter-item label {
    flex: 1;
    cursor: pointer;
}


.filter-menu-btn {
            position: absolute;
            top: 62px;
            right: 375px;
            height: 31px !important;
            z-index: 1;
            padding: 4px 12px;
            background: #1d5752;
            color: #dcfff9;
            border: 2px solid aquamarine;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s ease, color 0.2s ease;
        }
.filter-menu-btn:hover {
    background: #4a8983;
}

.filter-menu {
    position: fixed;
}


label {
    color: #80ebff;
}

label.color-picker-label {
    color: #40bb97;
}




.color-picker {
    margin: 5px 0 5px 20px;
    width: calc(100% - 20px);
}
.color-picker-label {
    display: block;
    color: #a0a0a0;
    font-size: 12px;
    margin: 2px 0 2px 20px;
}


@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}




/* .\[\&_div\+div\]\:\!mt-0 div+div {
    background: linear-gradient(186deg, #113d2c, #1f162b) !important;
    filter: hue-rotate(45deg) !important;
} */





/* ---------------- filter цвет фона и слайдер -------------------- */

.filter-slider {
    display: none;
    margin: 5px 0 5px 20px;
    width: calc(100% - 20px);
     background: #173034; /* Темный фон для пустой части трека */
}
.filter-slider-label {
    display: none;
    color: #a0a0a0;
    font-size: 12px;
    margin: 2px 0 2px 20px;
}
.language-select {
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    background: #3a3a3a;
    color: #a0a0a0;
    border: none;
        border-radius: 31px !important;
    font-size: 12px;
}

.filter-item input[type="checkbox"] {
    width: 29px;
    height: 29px;
}

.filter-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 225px;
    height: 15px;
    outline: none;
    right: 15px;
    position: relative;
        border-radius: 31px !important;
}

/* Стили для ползунка в WebKit-браузерах (Chrome, Safari, Edge) */
.filter-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px; /* Ширина ползунка */
    height: 20px; /* Высота ползунка (увеличивает толщину) */
    background: #35805f; /* Цвет ползунка */
    border: 3px solid #164a53 !important;
       border-radius: 31px !important;
    cursor: pointer;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3); /* Тень для эффекта */
}

/* Стили для ползунка в Firefox */
.filter-slider::-moz-range-thumb {
    width: 20px; /* Ширина ползунка */
    height: 20px; /* Высота ползунка */
    background: #4CAF50; /* Цвет ползунка */
        border-radius: 31px !important;
    cursor: pointer;
    border: none; /* Убираем стандартную границу Firefox */
}

/* Цвет заполнения для WebKit-браузеров */
.filter-slider::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #218a73 var(--value), #173034 var(--value)); /* Градиент для заполнения */
    left: 110px !important;
        border-radius: 31px !important;
     border: 3px solid #55dfc5 !important;
}

/* Цвет заполнения для Firefox */
.filter-slider::-moz-range-progress {
    background: #4CAF50; /* Цвет заполненной части */
    height: 6px; /* Толщина заполненной части */
        border-radius: 31px !important;
}
/* ---------------- filter цвет фона и слайдер -------------------- */



 .reset-colorGrok6h63ew45-btn {
        /* Новые стили для кнопки сброса */
        background-color: #173034  !important;
        color: #218a73 !important;
        padding: 5px 10px;
        border: 1px solid #218a73 !important;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 5px;
        display: block;
        width: 100%;
        text-align: center;
    }
  .reset-colorGrok6h63ew45-btn:hover {
        background-color: #719e8b !important;
        color: #051b16 !important;
    }
    
button.inline-flex.items-center.justify-center svg.lucide-play {
       display: block !important;
}

button.inline-flex.items-center.justify-center:has(svg.lucide-play) {
        display: block !important;
}
    `;
 
    document.head.appendChild(style);
    console.log('Стили успешно инжектированы.');
})(); 


