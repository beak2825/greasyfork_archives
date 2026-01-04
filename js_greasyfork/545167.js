// ==UserScript==
// @name         YouTube Russian Language and Shorts Filter (DEBUG)
// @namespace    http://tampermonkey.net/
// @version      7.3-debug
// @description  Hides all videos except those with Russian characters in the title, and also hides all Shorts content. Remembers toggle state. Updated for current YouTube layout.
// @description:ru Скрывает все видео, кроме тех, в названии которых есть русские буквы, а также скрывает весь контент Shorts. Запоминает состояние кнопки. Обновлено для актуальной верстки YouTube.
// @author       torch
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545167/YouTube%20Russian%20Language%20and%20Shorts%20Filter%20%28DEBUG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545167/YouTube%20Russian%20Language%20and%20Shorts%20Filter%20%28DEBUG%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    const DEBUG = true; // Включаем режим отладки. Все шаги будут выводиться в консоль (F12).
    const TRAIN_ALGORITHM = false;

    let isScriptEnabled = GM_getValue('isRussianFilterEnabled', true);
    const russianRegex = /[а-яА-ЯёЁ]/;
    let runCount = 0;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickNotInterested(videoElement, titleText) {
        if (!TRAIN_ALGORITHM) return;
        try {
            const menuButton = videoElement.querySelector('#menu button[aria-label="Ещё"], #menu button[aria-label="Action menu"]');
            if (!menuButton) {
                if (DEBUG) console.log(`[YT Filter DEBUG] Кнопка меню "..." не найдена для видео: "${titleText}"`);
                return;
            }
            menuButton.click();
            await sleep(250);

            const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer, yt-list-item-view-model');
            let found = false;
            for (const item of menuItems) {
                if (item.offsetParent === null) continue;
                const textElement = item.querySelector('yt-formatted-string, .yt-core-attributed-string');
                if (textElement && (textElement.textContent.trim() === 'Не интересует' || textElement.textContent.trim() === 'Not interested')) {
                    item.click();
                    console.log(`[Фильтр] Нажата кнопка "Не интересует" для: "${titleText}"`);
                    found = true;
                    break;
                }
            }
            if (!found) document.body.click();
        } catch (error) {
            console.error(`[Фильтр] Ошибка при нажатии "Не интересует" для "${titleText}":`, error);
            document.body.click();
        }
    }

    /**
     * Обрабатывает отдельный видеоэлемент, скрывая его, если заголовок не на русском языке.
     * @param {HTMLElement} videoElement - Элемент видео для обработки.
     */
    function processVideo(videoElement) {
        if (videoElement.getAttribute('data-processed-russian-filter') === 'true' || !isScriptEnabled) {
            return;
        }
        videoElement.setAttribute('data-processed-russian-filter', 'true');
        if (DEBUG) {
            console.log('[YT Filter DEBUG] Обработка видео:', videoElement);
            videoElement.style.outline = '2px solid yellow';
        }

        // *** ИСПРАВЛЕНИЕ: Новый, более надежный селектор для заголовка ***
        const titleSelector = 'a#video-title, .yt-lockup-metadata-view-model__title, #video-title-link, #meta h3.ytd-playlist-panel-video-renderer';
        const titleElement = videoElement.querySelector(titleSelector);

        if (!titleElement) {
            if (DEBUG) console.log(`%c[YT Filter DEBUG] Элемент заголовка НЕ НАЙДЕН по селектору: "${titleSelector}" в элементе:`, 'color: red;', videoElement);
            return;
        }

        const titleText = (titleElement.getAttribute('title') || titleElement.textContent || '').trim();
        if (DEBUG) console.log(`[YT Filter DEBUG] Найден заголовок: "${titleText}"`);

        if (!titleText) {
            if (DEBUG) console.log('[YT Filter DEBUG] Заголовок пустой. Пропуск.');
            return;
        }

        const hasRussianChars = russianRegex.test(titleText);
        if (DEBUG) console.log(`[YT Filter DEBUG] Русские символы найдены: ${hasRussianChars}`);

        if (hasRussianChars) {
            console.log(`[Фильтр] ОСТАВЛЕНО: "${titleText}"`);
            videoElement.style.outline = '2px solid limegreen';
        } else {
            console.log(`[Фильтр] СКРЫТО: "${titleText}"`);
            videoElement.style.display = 'none';
            clickNotInterested(videoElement, titleText);
        }
    }

    function hideShortsContent() {
        if (!isScriptEnabled) return;
        if (DEBUG) console.log('[YT Filter DEBUG] Запуск функции hideShortsContent...');

        document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer').forEach(shelf => {
            if (shelf.style.display !== 'none') {
                console.log('[Фильтр] Скрыта полка Shorts');
                shelf.style.display = 'none';
                shelf.setAttribute('data-processed-shorts-filter', 'true');
            }
        });

        document.querySelectorAll('ytd-mini-guide-entry-renderer[aria-label="Shorts"], ytd-guide-entry-renderer[title="Shorts"]').forEach(navItem => {
            if (navItem.style.display !== 'none') {
                console.log('[Фильтр] Скрыт пункт навигации "Shorts"');
                navItem.style.display = 'none';
                navItem.setAttribute('data-processed-shorts-filter', 'true');
            }
        });

        if (window.location.pathname.startsWith('/shorts/')) {
            const shortsPlayer = document.querySelector('#page-manager > ytd-shorts');
            if (shortsPlayer && shortsPlayer.style.display !== 'none') {
                console.log('[Фильтр] Скрыт плеер Shorts');
                shortsPlayer.style.display = 'none';
                shortsPlayer.setAttribute('data-processed-shorts-filter', 'true');
            }
        }
    }

    function runFilter() {
        if (!isScriptEnabled) return;
        runCount++;
        if (DEBUG) console.log(`%c[YT Filter DEBUG] Запуск фильтра #${runCount}`, 'color: cyan; font-weight: bold;');

        hideShortsContent();

        const videoSelectors = 'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-panel-video-renderer';
        const videos = document.querySelectorAll(videoSelectors);

        if (DEBUG) console.log(`[YT Filter DEBUG] Найдено ${videos.length} потенциальных видео-элементов по селектору: "${videoSelectors}".`);

        videos.forEach(processVideo);
    }

    const observer = new MutationObserver(runFilter);

    // --- UI ---

    function createToggleButton() {
        let button = document.getElementById('russian-filter-toggle');
        if (button) {
            updateButtonState(button);
            return;
        }

        button = document.createElement('button');
        button.id = 'russian-filter-toggle';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            isScriptEnabled = !isScriptEnabled;
            GM_setValue('isRussianFilterEnabled', isScriptEnabled);
            updateButtonState(button);

            if (isScriptEnabled) {
                console.log('[Фильтр] Фильтр ВКЛЮЧЕН.');
                runFilter();
            } else {
                console.log('[Фильтр] Фильтр ВЫКЛЮЧЕН. Восстановление всех элементов.');
                document.querySelectorAll('[data-processed-russian-filter], [data-processed-shorts-filter]').forEach(el => {
                    el.style.display = '';
                    el.style.outline = '';
                });
            }
        });
        updateButtonState(button);
    }

    function updateButtonState(button) {
        button.textContent = isScriptEnabled ? 'Фильтр: ВКЛ' : 'Фильтр: ВЫКЛ';
        button.className = isScriptEnabled ? 'enabled' : 'disabled';
    }

    GM_addStyle(`
        #russian-filter-toggle { position: fixed; bottom: 20px; left: 20px; z-index: 99999; padding: 10px 15px; border-radius: 8px; border: none; color: white; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: background-color 0.3s, transform 0.2s; }
        #russian-filter-toggle.enabled { background-color: #1a73e8; }
        #russian-filter-toggle.disabled { background-color: #d93025; }
        #russian-filter-toggle:hover { transform: scale(1.05); }
    `);

    // --- ЗАПУСК ---

    function startObserver() {
        if (DEBUG) console.log('[YT Filter DEBUG] Попытка запуска observer...');
        const targetNode = document.querySelector('ytd-app');
        if (targetNode) {
            console.log('[Фильтр] Скрипт запущен. Observer активирован.');
            observer.observe(targetNode, { childList: true, subtree: true });
            createToggleButton();
            if (isScriptEnabled) {
                if (DEBUG) console.log('[YT Filter DEBUG] Первоначальный запуск через 1.5 сек.');
                setTimeout(runFilter, 1500);
            }
        } else {
            if (DEBUG) console.log('[YT Filter DEBUG] ytd-app не найден. Повторная попытка через 500мс.');
            setTimeout(startObserver, 500);
        }
    }

    startObserver();

})();