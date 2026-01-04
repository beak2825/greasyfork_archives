// ==UserScript==
// @name         YouTube: Строгий фильтр по языку (RU/EN) + Блок рекламы
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Добавляет кнопку для строгой фильтрации видео по языку (RU/EN) и скрывает рекламу в результатах поиска.
// @author       torch
// @match        *://www.youtube.com/results*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/545730/YouTube%3A%20%D0%A1%D1%82%D1%80%D0%BE%D0%B3%D0%B8%D0%B9%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D1%83%20%28RUEN%29%20%2B%20%D0%91%D0%BB%D0%BE%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545730/YouTube%3A%20%D0%A1%D1%82%D1%80%D0%BE%D0%B3%D0%B8%D0%B9%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D1%83%20%28RUEN%29%20%2B%20%D0%91%D0%BB%D0%BE%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        // --- 1. Управление состоянием фильтра ---
        let activeFilterMode = GM_getValue('languageFilterMode', 'none');
        let isFilterEnabled = GM_getValue('isFilterEnabled', false);
        let menuHideTimer;

        // --- 2. Стили ---
        GM_addStyle(`
            #language-filter-container { position: fixed !important; bottom: 20px !important; right: 20px !important; z-index: 10001 !important; }
            #language-filter-toggle { width: 56px; height: 56px; background-color: #303030; color: #FFFFFF; border: 1px solid #505050; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: background-color 0.3s; }
            #language-filter-toggle:hover { background-color: #4d4d4d; }
            #language-filter-toggle.active { background-color: #007bff; border-color: #0056b3; }
            #language-filter-toggle.active:hover { background-color: #0056b3; }
            #language-filter-toggle svg { width: 24px; height: 24px; fill: #FFFFFF; }
            #language-filter-menu { position: absolute; bottom: 65px; right: 0; background-color: #282828; border: 1px solid #505050; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); padding: 8px; width: 220px; opacity: 0; transform: translateY(10px); transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none; }
            #language-filter-menu.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
            .language-option { display: flex; align-items: center; padding: 8px; cursor: pointer; border-radius: 4px; color: #FFFFFF; }
            .language-option:hover { background-color: #3d3d3d; }
            .language-option label { cursor: pointer; width: 100%; margin-left: 10px; }
            .language-option input[type="radio"] { cursor: pointer; }
            .filter-hidden { display: none !important; }
        `);

        // --- 3. Создание HTML-элементов ---
        const container = document.createElement('div');
        container.id = 'language-filter-container';

        const toggleButton = document.createElement('button');
        toggleButton.id = 'language-filter-toggle';

        const svgNS = "http://www.w3.org/2000/svg";
        const svgElem = document.createElementNS(svgNS, "svg");
        svgElem.setAttribute("viewBox", "0 0 24 24");
        const pathElem = document.createElementNS(svgNS, "path");
        pathElem.setAttribute("d", "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z");
        svgElem.appendChild(pathElem);
        toggleButton.appendChild(svgElem);

        const menu = document.createElement('div');
        menu.id = 'language-filter-menu';

        function createMenuOption(id, value, text) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'language-option';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = id;
            radio.name = 'filter-mode';
            radio.value = value;
            const label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = text;
            optionDiv.appendChild(radio);
            optionDiv.appendChild(label);
            return optionDiv;
        }

        menu.appendChild(createMenuOption('filter-mode-russian', 'russian', 'Только русский'));
        menu.appendChild(createMenuOption('filter-mode-english', 'english', 'Только английский (без RU)'));
        menu.appendChild(createMenuOption('filter-mode-none', 'none', 'Сбросить (показать все)'));

        // --- 4. Логика фильтрации ---
        const regexPatterns = {
            russian: /[а-яА-ЯЁё]/,
            english: /[a-zA-Z]/
        };
        const hideAds = () => {
            const adSelectors = ['ytd-ad-slot-renderer', 'ytd-promoted-sparkles-web-renderer', 'ytd-promoted-video-renderer', 'div#player-ads'];
            document.querySelectorAll(adSelectors.join(', ')).forEach(ad => ad.classList.add('filter-hidden'));
            document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer').forEach(video => {
                if (video.querySelector('ytd-badge-supported-renderer .badge-style-type-ad')) {
                     video.classList.add('filter-hidden');
                }
            });
        };

        const applyFilter = () => {
            if (!isFilterEnabled || activeFilterMode === 'none') {
                showAllVideos();
                return;
            }
            const videoSelectors = 'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer';
            document.querySelectorAll(videoSelectors).forEach(video => {
                const titleElement = video.querySelector('#video-title');
                if (!titleElement) return;
                const titleText = titleElement.textContent || '';
                const hasCyrillic = regexPatterns.russian.test(titleText);
                const hasLatin = regexPatterns.english.test(titleText);
                let shouldHide = false;
                if (activeFilterMode === 'russian' && !hasCyrillic) shouldHide = true;
                if (activeFilterMode === 'english' && (hasCyrillic || !hasLatin)) shouldHide = true;
                video.classList.toggle('filter-hidden', shouldHide);
            });
        };

        const showAllVideos = () => {
            document.querySelectorAll('.filter-hidden').forEach(video => video.classList.remove('filter-hidden'));
        };

        // --- 5. Обновление UI и сохранение состояния ---
        const updateUIAndSaveState = () => {
            toggleButton.classList.toggle('active', isFilterEnabled && activeFilterMode !== 'none');
            toggleButton.title = (isFilterEnabled && activeFilterMode !== 'none') ? 'Фильтр активен' : 'Фильтр выключен';
            const radio = document.querySelector(`#filter-mode-${activeFilterMode}`);
            if(radio) radio.checked = true;
            GM_setValue('isFilterEnabled', isFilterEnabled);
            GM_setValue('languageFilterMode', activeFilterMode);
        };

        const reapplyFilters = () => {
            hideAds();
            if (isFilterEnabled) applyFilter(); else showAllVideos();
        };

        // --- 6. Обработчики событий ---
        container.addEventListener('mouseenter', () => { clearTimeout(menuHideTimer); menu.classList.add('visible'); });
        container.addEventListener('mouseleave', () => { menuHideTimer = setTimeout(() => { menu.classList.remove('visible'); }, 300); });
        toggleButton.addEventListener('click', () => { isFilterEnabled = !isFilterEnabled; updateUIAndSaveState(); reapplyFilters(); });
        menu.addEventListener('change', (event) => {
            if (event.target.name === 'filter-mode') {
                activeFilterMode = event.target.value;
                isFilterEnabled = activeFilterMode !== 'none';
                updateUIAndSaveState();
                reapplyFilters();
            }
        });

        // --- 7. Запуск и MutationObserver ---
        function main() {
            container.appendChild(menu);
            container.appendChild(toggleButton);
            document.body.appendChild(container);
            updateUIAndSaveState();
            setTimeout(reapplyFilters, 500);

            const observerTarget = document.querySelector("ytd-section-list-renderer #contents");
            if (observerTarget) {
                 const observer = new MutationObserver(() => {
                    setTimeout(reapplyFilters, 300);
                 });
                observer.observe(observerTarget, { childList: true, subtree: true });
            } else {
                // Если основной контейнер не найден, скрипт молча прекратит работу,
                // чтобы не вызывать ошибок в консоли.
            }
        }

        // Ожидание полной загрузки страницы для запуска скрипта.
        const waitForElem = setInterval(() => {
            if (document.querySelector("ytd-section-list-renderer #contents")) {
                clearInterval(waitForElem);
                main();
            }
        }, 500);

    } catch (e) {
        // Логирование критических ошибок оставлено на всякий случай
        console.error("Критическая ошибка в скрипте фильтрации YouTube:", e);
    }
})();