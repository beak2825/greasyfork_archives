// ==UserScript==
// @name         Universal Video Split + VK API
// @namespace    http://tampermonkey.net/
// @version      2.0
// @match        *://vk.com/video_ext.php*
// @match        *://vkvideo.ru/video_ext.php*
// @match        *://vkvideo.ru/*
// @match        *://rutube.ru/*
// @match        *://www.youtube.com/*
// @match        *://oauth.vk.com/blank.html*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @description  Универсальный сплит + VK Video API с автоматическим получением токена
// @downloadURL https://update.greasyfork.org/scripts/526390/Universal%20Video%20Split%20%2B%20VK%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/526390/Universal%20Video%20Split%20%2B%20VK%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // VK API TOKEN MANAGEMENT
    // ============================================
    const VK_TOKEN_KEY = 'vk_video_api_token';
    const VK_API_VERSION = '5.199';
    const VK_CLIENT_ID = '2685278';
    const VK_AUTH_URL = `https://oauth.vk.com/authorize?client_id=2685278&scope=1073737727&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1`;
    // Универсальное хранение токена (общий storage Tampermonkey + localStorage домена)
    function getStoredToken() {
        let token = null;
        try {
            if (typeof GM_getValue === 'function') {
                token = GM_getValue(VK_TOKEN_KEY);
            }
        } catch (e) {
            GM_log('[VK API] GM_getValue error: ' + e.message);
        }
        if (!token || token === 'null' || token === '') {
            token = localStorage.getItem(VK_TOKEN_KEY);
        }
        return token;
    }
    function setStoredToken(token) {
        try {
            if (typeof GM_setValue === 'function') {
                GM_setValue(VK_TOKEN_KEY, token);
            }
        } catch (e) {
            GM_log('[VK API] GM_setValue error: ' + e.message);
        }
        try {
            localStorage.setItem(VK_TOKEN_KEY, token);
        } catch (e) {
            GM_log('[VK API] localStorage set error: ' + e.message);
        }
    }
    // Флаг для предотвращения множественных попыток открыть окно авторизации
    let vkAuthWindowOpened = false;

    // Проверяем, находимся ли мы на странице получения токена
    if (window.location.href.includes('oauth.vk.com/blank.html')) {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
            const tokenMatch = hash.match(/access_token=([^&]+)/);
            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];
                setStoredToken(token);
                GM_log('[VK API] Токен успешно сохранен: ' + token.substring(0, 20) + '...');
                alert('Токен VK API успешно получен и сохранен!');
                // Сбрасываем флаг, так как токен получен
                vkAuthWindowOpened = false;
                if (window.opener) {
                    window.close();
                } else {
                    window.location.href = 'https://vkvideo.ru/';
                }
            }
        }
        return;
    }

    // Функция получения токена VK
    function getVKToken(silent = false) {
        let token = getStoredToken();
        if (!token || token === 'null' || token === '') {
            // Открываем окно авторизации только один раз, чтобы избежать спама окон
            // silent=true используется когда мы не хотим открывать окно (например, при проверке)
            if (!silent && !vkAuthWindowOpened) {
                GM_log('[VK API] Токен не найден, перенаправляем на страницу авторизации...');
                const authWindow = window.open(VK_AUTH_URL, '_blank');
                if (authWindow) {
                    vkAuthWindowOpened = true;
                    // Сбрасываем флаг через 5 минут, чтобы пользователь мог попробовать снова
                    setTimeout(() => { vkAuthWindowOpened = false; }, 5 * 60 * 1000);
                } else {
                    GM_log('[VK API] Не удалось открыть окно авторизации (возможно заблокировано браузером)');
                }
            }
            return null;
        }
        // Если токен есть, сбрасываем флаг (токен был получен)
        if (vkAuthWindowOpened) {
            vkAuthWindowOpened = false;
        }
        return token;
    }

    // Функция извлечения owner_id и video_id из URL
    function extractVideoIdsFromUrl(url) {
        // Игнорируем iframe страницы
        if (url.includes('q_frame.html') || url.includes('video_ext.php')) {
            return null;
        }

        const match = url.match(/video-?(-?\d+)_(\d+)/);
        if (match) {
            return { owner_id: match[1], video_id: match[2] };
        }
        return null;
    }


    // Функция получения player ссылки через VK API
    function fetchVideoPlayerLink(owner_id, video_id) {
        return new Promise((resolve, reject) => {
            const token = getVKToken(true); // Используем silent=true чтобы не открывать окно при каждом запросе
            if (!token) {
                reject('Токен VK API не найден');
                return;
            }

            const videosParam = `${owner_id}_${video_id}`;
            const apiUrl = `https://api.vk.com/method/video.get?videos=-${videosParam}&v=${VK_API_VERSION}&access_token=${token}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.response && data.response.items && data.response.items.length > 0) {
                        const player = data.response.items[0].player;
                        if (player) {
                            resolve(player);
                        } else {
                            reject('Поле player отсутствует');
                        }
                    } else if (data.error) {
                        GM_log('[VK API] Ошибка API: ' + JSON.stringify(data.error));
                        if (data.error.error_code === 5) {
                            setStoredToken(null);
                            reject('Токен недействителен. Получите новый токен.');
                            setTimeout(() => window.open(VK_AUTH_URL, '_blank'), 1000);
                        } else {
                            reject('Ошибка VK API: ' + data.error.error_msg);
                        }
                    } else {
                        reject('Видео не найдено или ошибка API');
                    }
                })
                .catch(err => reject(err));
        });
    }

    // Переменная для хранения интервала обновления кнопки
    let vkVideoButtonUpdateIntervalId = null;
    // Кэш для хранения ссылок по video_id
    let vkVideoLinkCache = new Map();
    // Текущий video_id для отслеживания изменений
    let currentVkVideoId = null;

    // Функция обновления/создания кнопки "Открыть на полный экран" для vkvideo.ru
    function updateExternalLinkButton() {
        if (currentPlatform !== 'vkvideo') return;

        const videoIds = extractVideoIdsFromUrl(window.location.href);
        if (!videoIds) {
            // Не логируем каждый раз, если это iframe или другой URL без video ID
            return;
        }

        // Проверяем наличие элемента заголовка ПЕРЕД запросом к API
        const titleElement = document.querySelector('div[data-testid="video_modal_title"]') ||
                             document.querySelector('h1');
        if (!titleElement) {
            // Элемент заголовка еще не загружен, не делаем запрос к API
            return;
        }

        const videoKey = `${videoIds.owner_id}_${videoIds.video_id}`;

        // Если видео не изменилось и кнопка уже создана, не делаем ничего
        if (currentVkVideoId === videoKey) {
            const existingButton = document.querySelector('#external-link-button');
            if (existingButton && existingButton.parentNode) {
                return; // Кнопка уже существует для этого видео, пропускаем
            }
        }

        // Видео изменилось, обновляем текущий ID
        currentVkVideoId = videoKey;

        // Проверяем кэш
        if (vkVideoLinkCache.has(videoKey)) {
            const cachedLink = vkVideoLinkCache.get(videoKey);
            createExternalLinkButton(cachedLink, videoIds);
            return;
        }

        // Проверяем наличие токена (без открытия окна, чтобы не спамить)
        const hasToken = getVKToken(true) !== null;

        // Запрашиваем актуальную ссылку через API только если есть токен и ссылка не в кэше
        if (hasToken) {
            fetchVideoPlayerLink(videoIds.owner_id, videoIds.video_id)
                .then(playerLink => {
                    GM_log('[vkvideo] Получена ссылка через API для ' + videoKey);
                    // Сохраняем в кэш
                    vkVideoLinkCache.set(videoKey, playerLink);
                    // Очищаем кэш если в нем больше 10 записей
                    if (vkVideoLinkCache.size > 10) {
                        const firstKey = vkVideoLinkCache.keys().next().value;
                        vkVideoLinkCache.delete(firstKey);
                    }
                    createExternalLinkButton(playerLink, videoIds);
                })
                .catch(err => {
                    GM_log('[vkvideo] Ошибка получения ссылки через API: ' + err);
                    // В случае ошибки формируем прямую ссылку на vk.com
                    const directLink = `https://vk.com/video${videoIds.owner_id}_${videoIds.video_id}`;
                    // Сохраняем прямую ссылку в кэш
                    vkVideoLinkCache.set(videoKey, directLink);
                    createExternalLinkButton(directLink, videoIds);
                });
        } else {
            getVKToken(false);
            return; // НЕ создаем кнопку

        }
    }

    // Вспомогательная функция для создания кнопки
    function createExternalLinkButton(link, videoIds) {
        const titleElement = document.querySelector('div[data-testid="video_modal_title"]') ||
                             document.querySelector('h1');
        if (!titleElement || !titleElement.parentNode) {
            // Элемент заголовка не найден, не создаем кнопку
            return;
        }

        // Удаляем старую кнопку, если она уже существует
        const oldButton = document.querySelector('#external-link-button');
        if (oldButton) {
            oldButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'external-link-button';
        button.textContent = 'Открыть на полный экран';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#cc0000';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '4px';
        button.style.fontSize = '13px';
        button.style.fontWeight = '500';

        // Используем прямую ссылку на vk.com если переданная ссылка недействительна
        const finalLink = link && link.startsWith('http') ? link : `https://vk.com/video${videoIds.owner_id}_${videoIds.video_id}`;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            GM_log('[vkvideo] Открываем ссылку: ' + finalLink);
            window.open(finalLink, '_blank');
        });

        // Добавляем кнопку в родительский элемент заголовка (как в рабочем скрипте)
        if (titleElement.parentNode) {
            titleElement.parentNode.appendChild(button);
            GM_log('[vkvideo] Кнопка добавлена со ссылкой: ' + finalLink);
        }
    }

    // Запуск обновления кнопки для vkvideo
    function startVKVideoButtonUpdate() {
        if (currentPlatform === 'vkvideo' && !vkVideoButtonUpdateIntervalId) {
            GM_log('[vkvideo] Запуск обновления кнопки внешней ссылки...');
            vkVideoButtonUpdateIntervalId = setInterval(updateExternalLinkButton, 500);
            updateExternalLinkButton();
        }
    }

    function stopVKVideoButtonUpdate() {
        if (vkVideoButtonUpdateIntervalId) {
            clearInterval(vkVideoButtonUpdateIntervalId);
            vkVideoButtonUpdateIntervalId = null;
            const oldButton = document.querySelector('#external-link-button');
            if (oldButton) oldButton.remove();
        }
        // Сбрасываем текущий video_id при остановке
        currentVkVideoId = null;
    }

    // ============================================
    // ОСНОВНОЙ КОД UNIVERSAL VIDEO SPLIT
    // ============================================

    // --- КОНФИГУРАЦИЯ (Общая) ---
        let splitMinutes = null;
        let totalVideoMinutes = null;
        const extendCost = 300;
        // The sound URL seems to be causing a 'Format error' or 'ERR_BLOCKED_BY_CLIENT' specifically on VK.
        // This indicates an issue with VK's environment blocking loading from raw.githubusercontent.com
        // or a format incompatibility there.
        // If sound doesn't work on VK, try hosting a different, simple MP3 file elsewhere (e.g., a file hosting service or your own server) and replace this URL.
        const splitSoundUrl = 'https://github.com/lardan099/donat/raw/refs/heads/main/4af57a6b955cb63d.mp3';
        const overlayGifUrl = 'https://i.imgur.com/I3Gc6qO.gif';
        const localStorageVolumeKey = 'universalSplitAlertVolume';
        const localStorageTimerKey = 'universalSplitOverlayTimer';
        const defaultOverlayTimerDuration = 180;
        const defaultAlertVolume = '0.5';
        const setupIntervalDelay = 500; // How often to try setting up the script if elements aren't found

        // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
        let currentPlatform = 'unknown';
        let platformConfig = null;
        let video = null;
        let overlay = null;
        let splitTriggered = false; // Flag to ensure split actions only happen once per trigger event
        let audioPlayer = null;
        let audioPrimed = false; // Flag to track if we've attempted to prime the audio context for the *current* audioPlayer instance
        let splitCheckIntervalId = null;
        let setupIntervalId = null; // Interval to poll for video/insertion elements on complex pages
        let panelAdded = false;
        let panelElement = null;
        let controlsElement = null; // Specific for VK visibility check
        let visibilityCheckIntervalId = null; // Specific for VK visibility check
        let navigationObserver = null; // Observer to detect URL changes for SPAs
        let lastUrl = location.href; // Track last URL for navigation observer
        let videoPlayListenerAdded = false; // Flag to ensure we only add the video 'play' listener once per video element instance

        let overlayTimerDuration = parseInt(localStorage.getItem(localStorageTimerKey), 10);
        if (isNaN(overlayTimerDuration) || overlayTimerDuration < 0) {
            overlayTimerDuration = defaultOverlayTimerDuration;
        }
        let overlayTimerIntervalId = null;
        let overlayCountdownRemaining = overlayTimerDuration;

        // Очистка кнопки VK Video API
        stopVKVideoButtonUpdate();

        // --- КОНФИГУРАЦИЯ ПЛАТФОРМ ---
        const platformConfigs = {
            vk: {
                idPrefix: 'vk',
                controlPanelSelector: '#split-control-panel-vk',
                videoSelector: 'video',
                insertionSelector: '.videoplayer_title', // Insert panel after this
                insertionMethod: 'afterend',
                controlsElementSelector: '.videoplayer_controls', // Element to watch for visibility (VK only)
                needsVisibilityCheck: true,
                videoTitleSelector: '.videoplayer_title a.videoplayer_title_link', // Selects the <a> tag containing the title text
                styles: `
                    #split-control-panel-vk { background: #f0f2f5; border: 1px solid #dce1e6; color: #333; display: none; opacity: 0; transition: opacity 0.2s ease-in-out; position: relative; z-index: 10; }
                    #split-control-panel-vk.visible { display: flex; opacity: 1; }
                    #split-control-panel-vk label { color: #656565; } #split-control-panel-vk label i { color: #828282; }
                    #split-control-panel-vk input[type="number"] { background: #fff; color: #000; border: 1px solid #c5d0db; }
                    #split-control-panel-vk input[type="number"]:focus { border-color: #aebdcb; }
                    #split-control-panel-vk button { background: #e5ebf1; color: #333; border: 1px solid #dce1e6; }
                    #split-control-panel-vk button:hover { background: #dae2ea; } #split-control-panel-vk button:active { background: #ccd5e0; border-color: #c5d0db; }
                    #split-control-panel-vk .split-input-group button { background: #f0f2f5; border: 1px solid #dce1e6; } #split-control-panel-vk .split-input-group button:hover { background: #e5ebf1; }
                    #split-control-panel-vk .set-split-button { background: #5181b8; color: #fff; border: none; } #split-control-panel-vk .set-split-button:hover { background: #4a76a8; }
                    #split-control-panel-vk .set-split-button.active { background: #6a9e42; } #split-control-panel-vk .set-split-button.active:hover { background: #5c8c38; }
                    #split-control-panel-vk .split-volume-control label { color: #656565; }
                    #split-control-panel-vk .split-volume-control input[type="range"] { background: #dae2ea; }
                    #split-control-panel-vk .split-volume-control input[type="range"]::-webkit-slider-thumb { background: #5181b8; } #split-control-panel-vk .split-volume-control input[type="range"]::-moz-range-thumb { background: #5181b8; }
                    #split-control-panel-vk .split-stats { color: #333; }
                    /* Для video_ext.php (fullscreen player) - скрыта по умолчанию */
                    body > #split-control-panel-vk {
                        position: fixed !important;
                        top: -200px !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        max-width: 800px !important;
                        width: calc(100% - 20px) !important;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
                        z-index: 999999 !important;
                        transition: top 0.3s ease-in-out !important;
                        margin: 0 !important;
                    }
                    body > #split-control-panel-vk.panel-visible {
                        top: 10px !important;
                    }
                `
            },
            rutube: {
                idPrefix: 'rutube',
                controlPanelSelector: '#split-control-panel-rutube',
                videoSelector: 'video',
                insertionSelector: '.video-pageinfo-container-module__pageInfoContainer', // Insert panel into this
                insertionMethod: 'prepend',
                needsVisibilityCheck: false,
                videoTitleSelector: 'h1.video-pageinfo-container-module__videoTitleSectionHeader', // Selector for video title
                styles: `
                    #split-control-panel-rutube { background: #222; border: 1px solid #444; color: #eee; }
                    #split-control-panel-rutube label { color: #aaa; } #split-control-panel-rutube label i { color: #888; }
                    #split-control-panel-rutube input[type="number"] { background: #333; color: #eee; border: 1px solid #555; }
                    #split-control-panel-rutube button { background: #444; color: #eee; border: none; } #split-control-panel-rutube button:hover { background: #555; }
                    #split-control-panel-rutube .split-input-group button { background: #333; border: 1px solid #555; } #split-control-panel-rutube .split-input-group button:hover { background: #444; }
                    #split-control-panel-rutube .set-split-button { background: #007bff; color: white; } #split-control-panel-rutube .set-split-button:hover { background: #0056b3; }
                    #split-control-panel-rutube .set-split-button.active { background: #28a745; } #split-control-panel-rutube .set-split-button.active:hover { background: #1e7e34; }
                    #split-control-panel-rutube .split-volume-control label { color: #aaa; }
                    #split-control-panel-rutube .split-volume-control input[type="range"] { background: #444; }
                    #split-control-panel-rutube .split-volume-control input[type="range"]::-webkit-slider-thumb { background: #007bff; } #split-control-panel-rutube .split-volume-control input[type="range"]::-moz-range-thumb { background: #007bff; }
                    #split-control-panel-rutube .split-stats { color: #eee; }
                `
            },
            youtube: {
                idPrefix: 'youtube',
                controlPanelSelector: '#split-control-panel-youtube',
                videoSelector: 'video',
                insertionSelector: 'ytd-watch-flexy #primary', // Insert panel into this
                insertionMethod: 'prepend',
                needsVisibilityCheck: false,
                videoTitleSelector: '#title h1', // Selector for video title
                styles: `
                    #split-control-panel-youtube { background: var(--yt-spec-badge-chip-background); border: 1px solid var(--yt-spec-border-div); color: var(--yt-spec-text-primary); max-width: var(--ytd-watch-flexy-width); }
                    ytd-watch-flexy:not([theater]) #primary #split-control-panel-youtube { margin-left: auto; margin-right: auto; }
                    ytd-watch-flexy[theater] #primary #split-control-panel-youtube { max-width: 100%; }
                    #split-control-panel-youtube label { color: var(--yt-spec-text-secondary); } #split-control-panel-youtube label i { color: var(--yt-spec-text-disabled); }
                    #split-control-panel-youtube input[type="number"] { background: var(--yt-spec-filled-button-background); color: var(--yt-spec-text-primary); border: 1px solid var(--yt-spec-action-simulate-border); }
                    #split-control-panel-youtube button { background: var(--yt-spec-grey-1); color: var(--yt-spec-text-primary); border: none; } #split-control-panel-youtube button:hover { background: var(--yt-spec-grey-2); }
                    #split-control-panel-youtube .split-input-group button { background: var(--yt-spec-filled-button-background); border: 1px solid var(--yt-spec-action-simulate-border); } #split-control-panel-youtube .split-input-group button:hover { background: var(--yt-spec-grey-2); }
                    #split-control-panel-youtube .set-split-button { background: var(--yt-spec-brand-suggested-action); color: var(--yt-spec-text-reverse); } #split-control-panel-youtube .set-split-button:hover { background: var(--yt-spec-brand-suggested-action-hover); }
                    #split-control-panel-youtube .set-split-button.active { background: var(--yt-spec-call-to-action); } #split-control-panel-youtube .set-split-button.active:hover { background: var(--yt-spec-call-to-action-hover); }
                    #split-control-panel-youtube .split-volume-control label { color: var(--yt-spec-text-secondary); }
                    #split-control-panel-youtube .split-volume-control input[type="range"] { background: var(--yt-spec-grey-1); }
                    #split-control-panel-youtube .split-volume-control input[type="range"]::-webkit-slider-thumb { background: var(--yt-spec-brand-button-background); } #split-control-panel-youtube .split-volume-control input[type="range"]::-moz-range-thumb { background: var(--yt-spec-brand-button-background); }
                    #split-control-panel-youtube .split-stats { color: var(--yt-spec-text-primary); }
                    /* Force-clear any host dimming on our panel */
                    #split-control-panel-youtube,
                    #split-control-panel-youtube * { opacity: 1 !important; filter: none !important; -webkit-filter: none !important; mix-blend-mode: normal !important; }
                `
            },
            vkvideo: {
                idPrefix: 'vkvideo',
                controlPanelSelector: '#split-control-panel-vkvideo',
                // Для vkvideo работаем с реальным <video>, который лежит внутри vk-video-player (shadow DOM)
                // videoSelector здесь не используется напрямую в setupPlatformSplit/checkSplitCondition,
                // но оставляем для совместимости.
                videoSelector: 'video',
                // Пробуем оба варианта: сначала обычная страница, потом плеер
                insertionSelector: 'div[data-testid="video-page-info"], .VideoPage__playerContainer',
                insertionMethod: 'afterend', // Вставляем ПОСЛЕ элемента
                needsVisibilityCheck: false,
                videoTitleSelector: null, // Заголовка в DOM нет
                hasExternalLinkButton: true,
                styles: `
                    #split-control-panel-vkvideo {
                        background: #19191a;
                        border: 1px solid #333;
                        color: #eee;
                        margin-top: 12px;
                        margin-bottom: 12px;
                        width: 100%;
                    }
                    #split-control-panel-vkvideo label { color: #999; }
                    #split-control-panel-vkvideo input[type="number"] { background: #333; color: #fff; border: 1px solid #444; }
                    #split-control-panel-vkvideo button { background: #2d2d2e; color: #fff; border: 1px solid #444; }
                    #split-control-panel-vkvideo button:hover { background: #3e3e3f; }
                    #split-control-panel-vkvideo .set-split-button { background: #0077FF; color: #fff; border: none; }
                    #split-control-panel-vkvideo .set-split-button:hover { background: #0066DD; }
                    #split-control-panel-vkvideo .set-split-button.active { background: #4BB34B; }
                    /* Для video_ext.php (fullscreen player) - скрыта по умолчанию */
                    body > #split-control-panel-vkvideo {
                        position: fixed !important;
                        top: -200px !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        max-width: 800px !important;
                        width: calc(100% - 20px) !important;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
                        z-index: 999999 !important;
                        transition: top 0.3s ease-in-out !important;
                        margin: 0 !important;
                    }
                    body > #split-control-panel-vkvideo.panel-visible {
                        top: 10px !important;
                    }
                `
            }

        };

        // --- ОБЩИЕ СТИЛИ (Панель + Оверлей) ---
        function injectGlobalStyles() {
            let platformStyles = platformConfig ? platformConfig.styles : '';

            GM_addStyle(`
                /* --- Общие стили панели управления --- */
                .split-control-panel-universal {
                    margin-top: 10px;
                    margin-bottom: 15px;
                    padding: 10px 15px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Geneva, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif,arial,Tahoma,verdana;
                    font-size: 13px;
                    width: 100%;
                    box-sizing: border-box;
                    line-height: 1.4;
                    position: relative !important;
                    z-index: 9999 !important;
                }
                /* Reduced margin-bottom on the title */
                .split-control-panel-universal .panel-video-title { font-size: 14px; font-weight: bold; margin-bottom: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 8px; } /* Style for panel title */
                .split-control-panel-universal .copy-title-button { padding: 4px 8px; font-size: 11px; cursor: pointer; border-radius: 3px; background: #007bff; color: white; border: none; transition: background 0.15s ease-in-out; font-weight: 500; flex-shrink: 0; }
                .split-control-panel-universal .copy-title-button:hover { background: #0056b3; }
                .split-control-panel-universal .panel-controls-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 15px; width: 100%; }
                .split-control-panel-universal label { font-weight: 500; flex-shrink: 0; }
                .split-control-panel-universal label i { font-style: normal; font-size: 11px; display: block; }
                .split-input-group { display: flex; align-items: center; gap: 4px; }
                .split-control-panel-universal input[type="number"] { width: 55px; padding: 6px 8px; border-radius: 4px; text-align: center; font-size: 14px; -moz-appearance: textfield; }
                .split-control-panel-universal input[type="number"]::-webkit-outer-spin-button, .split-control-panel-universal input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .split-control-panel-universal button { padding: 6px 12px; font-size: 13px; cursor: pointer; border-radius: 4px; transition: background 0.15s ease-in-out; font-weight: 500; flex-shrink: 0; line-height: normal; }
                .split-input-group button { padding: 6px 8px; }
                .set-split-button { order: -1; margin-right: auto; } /* Keep set button to the left */
                .split-volume-control { display: flex; align-items: center; gap: 5px; margin-left: auto; }
                .split-volume-control label { flex-shrink: 0; }
                .split-volume-control input[type="range"] { flex-grow: 1; min-width: 70px; -webkit-appearance: none; appearance: none; height: 6px; outline: none; opacity: 0.8; transition: opacity .2s; border-radius: 3px; cursor: pointer; }
                .split-volume-control input[type="range"]:hover { opacity: 1; }
                .split-control-panel-universal input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; cursor: pointer; border-radius: 50%; }
                .split-control-panel-universal input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; cursor: pointer; border-radius: 50%; border: none; }
                .split-stats { font-size: 14px; font-weight: 500; white-space: nowrap; }

                 /* --- Общие стили оверлея --- */
                .split-overlay-universal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 999999 !important; font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Geneva, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif,arial,Tahoma,verdana; text-align: center; padding: 20px; box-sizing: border-box; }
                .split-overlay-universal .overlay-video-title { font-size: clamp(18px, 3vw, 28px); margin-bottom: 15px; color: #ccc; font-weight: normal; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .split-overlay-universal .warning-message { font-size: clamp(24px, 4vw, 36px); margin-bottom: 15px; color: yellow; font-weight: bold; text-shadow: 0 0 8px rgba(255, 255, 0, 0.5); }
                .split-overlay-universal .main-message { font-size: clamp(40px, 8vw, 72px); font-weight: bold; margin-bottom: 20px; color: red; text-shadow: 0 0 15px rgba(255, 0, 0, 0.7); }
                .split-overlay-universal .overlay-timer, .split-overlay-universal .overlay-remaining-minutes { font-size: clamp(28px, 5vw, 48px); font-weight: bold; margin-bottom: 20px; }
                .split-overlay-universal .overlay-timer { color: orange; } .split-overlay-universal .overlay-remaining-minutes { color: cyan; }
                .split-overlay-universal .overlay-timer-control { margin-bottom: 20px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; color: white; font-size: 18px; }
                .split-overlay-universal .overlay-timer-control label { font-weight: 500; }
                .split-overlay-universal .overlay-timer-control input[type="number"] { width: 70px; padding: 8px 10px; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px; text-align: center; font-size: 18px; -moz-appearance: textfield; }
                .split-overlay-universal .overlay-timer-control input[type="number"]::-webkit-outer-spin-button, .split-overlay-universal input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .split-overlay-universal .overlay-timer-control button { padding: 8px 12px; font-size: 16px; cursor: pointer; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px; transition: background 0.2s ease-in-out; font-weight: 500; }
                .split-overlay-universal .overlay-timer-control button:hover { background: rgba(255, 255, 255, 0.2); }

                .split-overlay-universal .extend-buttons { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-bottom: 40px; }
                .split-overlay-universal .extend-buttons button { padding: 12px 25px; font-size: clamp(18px, 3vw, 24px); cursor: pointer; background: #dc3545; border: none; color: white; border-radius: 4px; font-weight: bold; transition: background 0.2s ease-in-out; }
                .split-overlay-universal .extend-buttons button:hover { background: #c82333; }
                .split-overlay-universal img { max-width: 90%; max-height: 45vh; height: auto; border-radius: 8px; margin-top: 20px; }

                /* --- Стили конкретных платформ --- */
                ${platformStyles}
            `);
        }

        // --- ФУНКЦИИ ЯДРА ---

        // Функция для расчета суммы выкупа
        function calculateBuyoutAmount(minutes) {
            const step = 2500;
            const interval = 15;
            return Math.ceil(minutes / interval) * step;
        }

        // Функция для копирования названия с суммой выкупа
        function copyTitleWithBuyout() {
            const videoTitle = getVideoTitle();

            // Пытаемся получить длительность видео разными способами
            let totalMinutes = totalVideoMinutes !== null ? totalVideoMinutes : 0;

            // Если totalVideoMinutes не определена, пытаемся получить из элемента video
            if (totalMinutes === 0 && video && isFinite(video.duration) && video.duration > 0) {
                totalMinutes = Math.ceil(video.duration / 60);
                GM_log(`[${currentPlatform}] Получена длительность видео из элемента: ${totalMinutes} минут`);
            }

            const buyoutAmount = calculateBuyoutAmount(totalMinutes);
            const textToCopy = `${videoTitle} (${buyoutAmount})`;

            // Создаем временное поле для копирования
            const tempInput = document.createElement('input');
            tempInput.value = textToCopy;
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            tempInput.select();
            tempInput.setSelectionRange(0, 99999); // Для мобильных устройств

            try {
                document.execCommand('copy');
                GM_log(`[${currentPlatform}] Скопировано: ${textToCopy}`);
            } catch (err) {
                GM_log(`[${currentPlatform}] Ошибка копирования: ${err.message}`);
            }

            document.body.removeChild(tempInput);
        }

        function getElementId(baseId) {
            return platformConfig ? `${baseId}-${platformConfig.idPrefix}` : baseId;
        }

        // Helper function to get the video title from the DOM
        function getVideoTitle() {
            // Пробуем найти в DOM
            if (platformConfig?.videoTitleSelector) {
                const titleElement = document.querySelector(platformConfig.videoTitleSelector);
                if (titleElement) {
                    let title = titleElement.textContent?.trim();
                    if (title) return title;
                }
            }

            // Берем из <title> страницы
            let pageTitle = document.title;

            // Для vkvideo убираем " - VK Видео"
            if (currentPlatform === 'vkvideo') {
                pageTitle = pageTitle.replace(/\s*[-–—]\s*VK\s*(Видео|Video).*$/i, '').trim();
            }

            return pageTitle || "Неизвестное видео";
        }


        // Ensures the input field and stats display reflect the *active* splitMinutes value
        function updateSplitDisplay() {
             const inputField = document.getElementById(getElementId("split-input"));
             if (inputField) {
                 // Always set input field value to the current active splitMinutes
                 // This synchronizes the input field with the internal state
                 const displayMinutes = splitMinutes === null ? 0 : splitMinutes;
                 if (inputField.valueAsNumber !== displayMinutes) { // Only update if different
                     inputField.valueAsNumber = displayMinutes;
                     GM_log(`[${currentPlatform}] Synchronized input field to splitMinutes: ${displayMinutes}`);
                 }
             }
             updateSplitStatsDisplay(); // Update stats display based on splitMinutes
        }

        // Ensures the stats display reflects the *active* splitMinutes value
        function updateSplitStatsDisplay() {
            const statsElement = document.getElementById(getElementId("split-stats"));
            if (statsElement) {
                // Use splitMinutes directly. Stats only change when splitMinutes changes.
                const boughtMinutes = splitMinutes === null ? 0 : splitMinutes;
                const newStatsText = `Выкуплено: ${boughtMinutes} / Всего: ${totalVideoMinutes !== null ? totalVideoMinutes : '?'} минут`;
                if (statsElement.textContent !== newStatsText) { // Only update if text changes
                     statsElement.textContent = newStatsText;
                     GM_log(`[${currentPlatform}] Updated stats display: ${newStatsText}`);
                }
            }
            // If overlay is visible, update its remaining minutes display
            if (overlay) updateOverlayRemainingMinutes();
        }

        function modifySplitInput(minutesToModify) {
            const inputField = document.getElementById(getElementId("split-input"));
            if (!inputField) return;
            let currentVal = inputField.valueAsNumber;
            if (isNaN(currentVal)) currentVal = splitMinutes !== null ? splitMinutes : 0; // Start from active split if input is invalid
            let newVal = currentVal + minutesToModify;
            if (newVal < 0) newVal = 0;
            inputField.valueAsNumber = newVal;

             // Programmatically trigger the 'input' event.
             // This will invoke the splitInputField.addEventListener('input', ...) function
             // in addControlPanel, which handles updating splitMinutes and stats if split is active.
            inputField.dispatchEvent(new Event('input'));
        }

        function modifyTimerInputOverlay(secondsToModify) {
            const inputField = document.getElementById(getElementId("overlay-timer-input"));
            if (!inputField) return;
            let currentVal = inputField.valueAsNumber;
            if (isNaN(currentVal)) currentVal = 0;
            let newVal = currentVal + secondsToModify;
            if (newVal < 0) newVal = 0;
            inputField.valueAsNumber = newVal;

            overlayTimerDuration = newVal;
            localStorage.setItem(localStorageTimerKey, overlayTimerDuration.toString());
            overlayCountdownRemaining = overlayTimerDuration;

        // Очистка кнопки VK Video API
        stopVKVideoButtonUpdate();
            if (overlayCountdownRemaining < 0) overlayCountdownRemaining = 0;

            if (overlayTimerIntervalId) { clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null; }
            updateOverlayTimer();
            if (overlayTimerDuration > 0) {
                overlayTimerIntervalId = setInterval(updateOverlayTimer, 1000);
            }
        }

        function startSplitCheckInterval() {
            if (!splitCheckIntervalId) {
                splitCheckIntervalId = setInterval(checkSplitCondition, 500);
                GM_log(`[${currentPlatform || 'unknown'}] Split check interval started.`);
            }
        }

        function stopSplitCheckInterval() {
            if (splitCheckIntervalId) {
                clearInterval(splitCheckIntervalId);
                splitCheckIntervalId = null;
                GM_log(`[${currentPlatform || 'unknown'}] Split check interval stopped.`);
            }
        }

        function addMinutesToActiveSplit(minutesToAdd) {
            if (splitMinutes === null) {
                GM_log(`[${currentPlatform}] Attempted to add minutes but splitMinutes is null.`);
                return;
            }

            splitMinutes += minutesToAdd;
             GM_log(`[${currentPlatform}] Added ${minutesToAdd} minutes via overlay. New split: ${splitMinutes} minutes.`);

            updateSplitDisplay(); // Update panel input and stats

            const thresholdSeconds = splitMinutes * 60;

            // If video is now before the new threshold AND overlay was active, remove overlay
            if (video && isFinite(video.currentTime) && video.currentTime < thresholdSeconds && splitTriggered) {
                GM_log(`[${currentPlatform}] Added minutes, new split threshold ${thresholdSeconds}s. Current time ${video.currentTime.toFixed(1)}s is before threshold. Removing overlay.`);
                removeOverlay();
                splitTriggered = false;

                if (video.paused) {
                     GM_log(`[${currentPlatform}] Attempting to play video after adding minutes.`);
                     video.play().catch(e => GM_log(`[${currentPlatform}] Error playing video after adding minutes: ${e.message}`));
                }
            }
        }

        function updateOverlayTimer() {
            const timerElement = document.getElementById(getElementId('overlay-timer'));
            if (!timerElement) {
                 if (overlayTimerIntervalId) { clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null; }
                 return;
            }
            if (overlayCountdownRemaining > 0) {
                const minutes = Math.floor(overlayCountdownRemaining / 60);
                const seconds = overlayCountdownRemaining % 60;
                timerElement.textContent = `ЖДЕМ ${minutes}:${seconds < 10 ? '0' : ''}${seconds}, ИНАЧЕ СКИП`;
                overlayCountdownRemaining--;
            } else {
                timerElement.textContent = `ЖДЕМ 0:00, ИНАЧЕ СКИП`;
                if (overlayTimerIntervalId) { clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null; }
            }
        }

        function updateOverlayRemainingMinutes() {
            const remainingElement = document.getElementById(getElementId('overlay-remaining-minutes'));
            if (remainingElement) {
                const boughtMinutes = splitMinutes === null ? 0 : splitMinutes; // Use active splitMinutes
                const remainingMinutes = totalVideoMinutes !== null ? Math.max(0, totalVideoMinutes - boughtMinutes) : '?';
                remainingElement.textContent = `ОСТАЛОСЬ ${remainingMinutes} минут выкупить`;
            }
        }

        // Function to try and prime the audio context (help bypass autoplay)
        function primeAudio() {
            if (audioPlayer && video && !videoPlayListenerAdded) {
                 GM_log(`[${currentPlatform}] Adding 'play' listener to video for audio priming.`);
                const listener = function _listener() {
                    GM_log(`[${currentPlatform}] Video started playing. Attempting to prime audio...`);
                     if (!audioPlayer) {
                          GM_log(`[${currentPlatform}] Audio player became null before priming attempt. (Likely due to load error)`);
                          return;
                     }

                    const originalVolume = audioPlayer.volume;
                    audioPlayer.volume = 0;
                    audioPlayer.play().then(() => {
                        GM_log(`[${currentPlatform}] Audio priming successful (muted playback started).`);
                        audioPrimed = true;
                        if (!audioPlayer.paused) { audioPlayer.pause(); }
                        audioPlayer.currentTime = 0;
                        audioPlayer.volume = originalVolume;
                    }).catch(e => {
                        GM_log(`[${currentPlatform}] Audio priming play() Promise rejected: ${e.message}.`);
                        audioPrimed = false;
                        audioPlayer.volume = originalVolume;
                    });
                     videoPlayListenerAdded = true;
                };

                video.addEventListener('play', listener, { once: true });
                videoPlayListenerAdded = true; // Mark as added immediately
            }
        }

        function checkSplitCondition() {
            if (!platformConfig) return;

            if (!video) {
                // Для vkvideo ищем в Shadow DOM
                if (currentPlatform === 'vkvideo') {
                    const playerComponent = document.querySelector('vk-video-player');
                    if (playerComponent && playerComponent._shadowRoot) {
                        video = playerComponent._shadowRoot.querySelector('video');
                        if (video) {
                            GM_log('[vkvideo] Video найден через _shadowRoot');
                        }
                    }
                }

                // Обычный поиск для других платформ
                if (!video) {
                    video = document.querySelector('video');
                }

                if (!video) return;

                GM_log(`[${currentPlatform}] Video element found during split check.`);
                initAudioPlayer();
                primeAudio();
                const volumeSlider = document.getElementById(getElementId('split-volume-slider'));
                if (audioPlayer && volumeSlider) {
                    try { audioPlayer.volume = parseFloat(volumeSlider.value); } catch(e){}
                }
            }

            // ПРОВЕРЯЕМ ДЛИТЕЛЬНОСТЬ КАЖДЫЙ РАЗ (пока не получим)
            if (video && totalVideoMinutes === null) {
                if (isFinite(video.duration) && video.duration > 0) {
                    totalVideoMinutes = Math.ceil(video.duration / 60);
                    GM_log(`[${currentPlatform}] Total video duration found: ${totalVideoMinutes} minutes (${video.duration.toFixed(1)}s).`);
                    if (panelAdded) updateSplitStatsDisplay();
                }
            }

            // Остальной код проверки сплита
            if (video && splitMinutes !== null && splitMinutes > 0) {
                const thresholdSeconds = splitMinutes * 60;
                if (isFinite(video.currentTime) && video.currentTime >= thresholdSeconds && !splitTriggered) {
                    GM_log(`[${currentPlatform}] Split condition met at ${video.currentTime.toFixed(1)}s (threshold: ${thresholdSeconds}s). Triggering split...`);
                    video.pause();
                    splitTriggered = true;
                    showOverlay();
                    if (audioPlayer) {
                        try {
                            audioPlayer.pause();
                            audioPlayer.currentTime = 0;
                            GM_log(`[${currentPlatform}] Attempting to play split sound.`);
                            audioPlayer.play().then(() => {
                                GM_log(`[${currentPlatform}] Split sound play() Promise resolved successfully.`);
                            }).catch(e => {
                                GM_log(`[${currentPlatform}] Split sound play() Promise rejected: ${e.message}.`);
                                console.error("Universal Split: Ошибка воспроизведения звука:", e);
                            });
                        } catch(e) {
                            GM_log(`[${currentPlatform}] Error during audio playback attempt: ${e.message}`);
                        }
                    } else {
                        GM_log(`[${currentPlatform}] audioPlayer is null, cannot play split sound.`);
                    }
                }

                if (splitTriggered && isFinite(video.currentTime) && video.currentTime < thresholdSeconds) {
                    GM_log(`[${currentPlatform}] Video time (${video.currentTime.toFixed(1)}s) is now before split threshold (${thresholdSeconds}s) after seeking back. Removing overlay.`);
                    removeOverlay();
                    splitTriggered = false;
                    if (video.paused) {
                        GM_log(`[${currentPlatform}] Attempting to play video after seeking back past split point.`);
                        video.play().catch(e => GM_log(`[${currentPlatform}] Play failed: ${e.message}`));
                    }
                }
            } else if (splitTriggered) {
                GM_log(`[${currentPlatform}] Split cancelled (splitMinutes is ${splitMinutes}). Removing overlay.`);
                removeOverlay();
                splitTriggered = false;
            }
        }


        function showOverlay() {
            if (overlay) return;
            if (!platformConfig) return;

            GM_log(`[${currentPlatform}] Showing split overlay.`);

            const videoTitle = getVideoTitle();

            overlay = document.createElement("div");
            overlay.id = getElementId("split-overlay");
            overlay.className = 'split-overlay-universal';

            const titleElement = document.createElement("div");
            titleElement.className = "overlay-video-title";
            titleElement.textContent = videoTitle;
            overlay.appendChild(titleElement);

            const warningMessage = document.createElement("div");
            warningMessage.className = "warning-message";
            warningMessage.textContent = "⚠️ НУЖНО ДОНАТНОЕ ТОПЛИВО ⚠️";
            overlay.appendChild(warningMessage);

            const mainMessage = document.createElement("div");
            mainMessage.className = "main-message";
            mainMessage.textContent = "СПЛИТ НЕ ОПЛАЧЕН";
            overlay.appendChild(mainMessage);

            const timerElement = document.createElement("div");
            timerElement.id = getElementId('overlay-timer');
            timerElement.className = "overlay-timer";
            overlay.appendChild(timerElement);

            const remainingMinutesElement = document.createElement("div");
            remainingMinutesElement.id = getElementId('overlay-remaining-minutes');
            remainingMinutesElement.className = "overlay-remaining-minutes";
            overlay.appendChild(remainingMinutesElement);

            const overlayTimerControlGroup = document.createElement("div");
            overlayTimerControlGroup.id = getElementId('overlay-timer-control');
            overlayTimerControlGroup.className = "overlay-timer-control";

            const timerLabel = document.createElement("label");
            timerLabel.setAttribute("for", getElementId('overlay-timer-input'));
            timerLabel.textContent = "Таймер (сек):";
            overlayTimerControlGroup.appendChild(timerLabel);

            const timerInputField = document.createElement("input");
            timerInputField.type = "number";
            timerInputField.id = getElementId('overlay-timer-input');
            timerInputField.min = "0";
            timerInputField.value = overlayTimerDuration;
            overlayTimerControlGroup.appendChild(timerInputField);

            const timerButtons = [
                { text: '-60', seconds: -60 }, { text: '-10', seconds: -10 }, { text: '-5', seconds: -5 },
                { text: '+5', seconds: 5 }, { text: '+10', seconds: 10 }, { text: '+60', seconds: 60 }
            ];
            timerButtons.forEach(btnInfo => {
                const button = document.createElement("button");
                button.textContent = btnInfo.text;
                button.dataset.seconds = btnInfo.seconds;
                overlayTimerControlGroup.appendChild(button);
            });
            overlay.appendChild(overlayTimerControlGroup);

            // --- End Removed ---

            const extendButtonsContainer = document.createElement("div");
            extendButtonsContainer.id = getElementId('split-extend-buttons');
            extendButtonsContainer.className = "extend-buttons";
            const extendButtonConfigs = [
                { minutes: 1, cost: extendCost }, { minutes: 5, cost: extendCost * 5 },
                { minutes: 10, cost: extendCost * 10 }, { minutes: 20, cost: extendCost * 20 }
            ];
            extendButtonConfigs.forEach(config => {
                const button = document.createElement("button");
                button.textContent = `+ ${config.minutes} минут${getMinuteEnding(config.minutes)} - ${config.cost} рублей`;
                button.addEventListener("click", () => addMinutesToActiveSplit(config.minutes));
                extendButtonsContainer.appendChild(button);
            });
            overlay.appendChild(extendButtonsContainer);

            const gifElement = document.createElement("img");
            gifElement.src = overlayGifUrl;
            gifElement.alt = "Split GIF";
            overlay.appendChild(gifElement);

            document.body.appendChild(overlay);

            // Add event listeners for timer controls *after* adding to DOM
            overlay.querySelector(`#${getElementId('overlay-timer-input')}`).addEventListener('input', function() {
                const val = this.valueAsNumber;
                if (!isNaN(val) && val >= 0) {
                     overlayTimerDuration = val;
                     localStorage.setItem(localStorageTimerKey, overlayTimerDuration.toString());
                     overlayCountdownRemaining = overlayTimerDuration;

        // Очистка кнопки VK Video API
        stopVKVideoButtonUpdate();
                     if (overlayTimerIntervalId) { clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null; }
                     if (overlayTimerDuration > 0) overlayTimerIntervalId = setInterval(updateOverlayTimer, 1000);
                     updateOverlayTimer();
                }
            });
            overlay.querySelectorAll(`#${getElementId('overlay-timer-control')} button`).forEach(button => {
                button.addEventListener("click", () => modifyTimerInputOverlay(parseInt(button.dataset.seconds, 10)));
            });

            // --- Removed Spotify Button Listener ---
            // --- End Removed ---

            overlayCountdownRemaining = overlayTimerDuration;

        // Очистка кнопки VK Video API
        stopVKVideoButtonUpdate();
            if (overlayCountdownRemaining < 0) overlayCountdownRemaining = 0;
            updateOverlayTimer();
            updateOverlayRemainingMinutes();

            if (overlayTimerDuration > 0 && !overlayTimerIntervalId) {
                overlayTimerIntervalId = setInterval(updateOverlayTimer, 1000);
            } else if (overlayTimerDuration <= 0 && overlayTimerIntervalId) {
                 clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null;
            }
        }

        function getMinuteEnding(count) {
            count = Math.abs(count); const d1 = count % 10; const d2 = count % 100;
            if (d2 >= 11 && d2 <= 19) return ''; if (d1 === 1) return 'а'; if (d1 >= 2 && d1 <= 4) return 'ы'; return '';
        }

        function removeOverlay() {
            if (overlay) {
                 GM_log(`[${currentPlatform || 'unknown'}] Removing split overlay.`);
                overlay.remove();
                overlay = null;

                if (overlayTimerIntervalId) { clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null; }

                if (audioPlayer) {
                    try { audioPlayer.pause(); } catch(e){}
                }
            }
        }

        function initAudioPlayer() {
            if (audioPlayer === null && splitSoundUrl && !splitSoundUrl.includes('YOUR_DIRECT_URL_HERE')) {
                GM_log(`[${currentPlatform || 'unknown'}] Initializing audio player with URL: ${splitSoundUrl}`);
                try {
                    audioPlayer = new Audio(splitSoundUrl);
                    audioPlayer.preload = 'auto';
                    // Changed loop to false, important for alerts
                    audioPlayer.loop = false; // Ensure alert sound does not loop

                    audioPlayer.onerror = (e) => {
                         const errorMsg = e.message || e.target.error?.message || 'Unknown error';
                         GM_log(`[${currentPlatform || 'unknown'}] ERROR loading audio: ${errorMsg}. Audio player will be null.`);
                         console.error("Universal Split: Ошибка загрузки звука:", e);
                         audioPlayer = null;
                         audioPrimed = false;
                         videoPlayListenerAdded = false;
                     };

                    let savedVolume = localStorage.getItem(localStorageVolumeKey) ?? defaultAlertVolume;
                    audioPlayer.volume = parseFloat(savedVolume);

                    audioPlayer.onended = () => {
                         GM_log(`[${currentPlatform}] Split sound finished playing.`);
                         // If the sound finishes, ensure it stops cleanly
                         if (audioPlayer && !audioPlayer.paused) {
                             try { audioPlayer.pause(); audioPlayer.currentTime = 0; } catch(e){}
                         }
                    };

                     audioPrimed = false;
                     videoPlayListenerAdded = false;

                     GM_log(`[${currentPlatform || 'unknown'}] Audio player object created.`);

                } catch (error) {
                     GM_log(`[${currentPlatform || 'unknown'}] ERROR creating Audio object: ${error.message}`);
                     console.error("Universal Split: Ошибка создания Audio:", error);
                     audioPlayer = null;
                     audioPrimed = false;
                     videoPlayListenerAdded = false;
                }
            } else if (audioPlayer !== null) {
                 let savedVolume = localStorage.getItem(localStorageVolumeKey) ?? defaultAlertVolume;
                 try { audioPlayer.volume = parseFloat(savedVolume); } catch(e){}
                 audioPlayer.loop = false; // Ensure loop is false on existing player
                 if (!audioPlayer.onended) {
                     audioPlayer.onended = () => { GM_log(`[${currentPlatform}] Split sound finished playing.`); if (audioPlayer && !audioPlayer.paused) { try { audioPlayer.pause(); audioPlayer.currentTime = 0; } catch(e){} } };
                 }
            }
        }

        // --- ФУНКЦИИ УПРАВЛЕНИЯ ПАНЕЛЬЮ ---

        function addControlPanel() {
            if (panelAdded || !platformConfig) return;
            const insertionElement = document.querySelector(platformConfig.insertionSelector);
            if (!insertionElement) { GM_log(`[${currentPlatform}] Insertion element (${platformConfig.insertionSelector}) not found.`); return; }

            GM_log(`[${currentPlatform}] Adding control panel...`);
            panelElement = document.createElement("div");
            panelElement.id = getElementId("split-control-panel");
            panelElement.className = 'split-control-panel-universal';

            const videoTitle = getVideoTitle();
            const panelTitleElement = document.createElement("div");
            panelTitleElement.className = "panel-video-title";

            const titleTextElement = document.createElement("span");
            titleTextElement.textContent = videoTitle;
            titleTextElement.style.flex = "1";
            titleTextElement.style.overflow = "hidden";
            titleTextElement.style.textOverflow = "ellipsis";
            titleTextElement.style.whiteSpace = "nowrap";
            panelTitleElement.appendChild(titleTextElement);

            const copyButton = document.createElement("button");
            copyButton.className = "copy-title-button";
            copyButton.textContent = "Копировать";
            copyButton.title = "Копировать название с суммой выкупа";
            copyButton.addEventListener("click", copyTitleWithBuyout);
            panelTitleElement.appendChild(copyButton);

            panelElement.appendChild(panelTitleElement);

            const controlsRow = document.createElement("div");
            controlsRow.className = "panel-controls-row";

            const setButton = document.createElement("button");
            setButton.id = getElementId('set-split-button');
            setButton.className = 'set-split-button';
            setButton.textContent = "НАЧАТЬ СПЛИТ";
            if (splitMinutes !== null && splitMinutes > 0) {
                 setButton.textContent = "СПЛИТ НАЧАТ";
                 setButton.classList.add("active");
            }
            controlsRow.appendChild(setButton);

            const splitLabel = document.createElement("label");
            splitLabel.setAttribute("for", getElementId('split-input'));
            splitLabel.appendChild(document.createTextNode("Сплит (мин):"));
            const splitLabelInstruction = document.createElement("i");
            splitLabelInstruction.textContent = "(уст. перед \"Начать\")";
            splitLabel.appendChild(splitLabelInstruction);
            controlsRow.appendChild(splitLabel);

            const splitInputGroup = document.createElement("div");
            splitInputGroup.id = getElementId('split-input-group');
            splitInputGroup.className = 'split-input-group';

            const splitInputField = document.createElement("input");
            splitInputField.type = "number";
            splitInputField.id = getElementId('split-input');
            splitInputField.min = "0";
            splitInputField.value = splitMinutes === null ? 0 : splitMinutes;
            splitInputGroup.appendChild(splitInputField);

            const splitModifyButtons = [ { text: '+1', minutes: 1 }, { text: '+5', minutes: 5 }, { text: '+10', minutes: 10 }, { text: '+20', minutes: 20 } ];
            splitModifyButtons.forEach(btnInfo => {
                const button = document.createElement("button");
                button.textContent = btnInfo.text; button.dataset.minutes = btnInfo.minutes;
                splitInputGroup.appendChild(button);
            });
            controlsRow.appendChild(splitInputGroup);

            const volumeControlGroup = document.createElement("div");
            volumeControlGroup.id = getElementId('split-volume-control');
            volumeControlGroup.className = 'split-volume-control';
            const volumeLabel = document.createElement("label");
            volumeLabel.setAttribute("for", getElementId('split-volume-slider'));
            volumeLabel.textContent = "Громк. алерта:";
            const volumeSlider = document.createElement("input");
            volumeSlider.type = "range"; volumeSlider.id = getElementId('split-volume-slider');
            volumeSlider.min = "0"; volumeSlider.max = "1"; volumeSlider.step = "0.05";
            volumeSlider.value = localStorage.getItem(localStorageVolumeKey) ?? defaultAlertVolume;
            volumeControlGroup.appendChild(volumeLabel); volumeControlGroup.appendChild(volumeSlider);
            controlsRow.appendChild(volumeControlGroup);

            const statsElement = document.createElement("span");
            statsElement.id = getElementId('split-stats'); statsElement.className = 'split-stats';
            statsElement.textContent = "Выкуплено: 0 / Всего: ? минут";

            panelElement.appendChild(controlsRow);
            panelElement.appendChild(statsElement);

            switch (platformConfig.insertionMethod) {
                case 'prepend': insertionElement.insertBefore(panelElement, insertionElement.firstChild); break;
                case 'appendChild': insertionElement.appendChild(panelElement); break;
                case 'before': insertionElement.parentNode.insertBefore(panelElement, insertionElement); break;
                case 'afterend': insertionElement.parentNode.insertBefore(panelElement, insertionElement.nextSibling); break;
                default: insertionElement.insertBefore(panelElement, insertionElement.firstChild);
            }
            panelAdded = true;

            // --- Hover Handler for video_ext.php ---
            GM_log(`[${currentPlatform}] Checking if panel inserted into body... insertionElement.tagName: ${insertionElement.tagName}`);
            const isVideoExtPage = window.location.pathname.includes('/video_ext.php');
            GM_log(`[${currentPlatform}] isVideoExtPage: ${isVideoExtPage}, insertionElement === body: ${insertionElement === document.body}`);
            if (insertionElement === document.body || isVideoExtPage) {
                let hideTimer = null;
                const showPanel = () => {
                    if (panelElement) panelElement.classList.add('panel-visible');
                    if (hideTimer) clearTimeout(hideTimer);
                };
                const hidePanelDelayed = () => {
                    if (hideTimer) clearTimeout(hideTimer);
                    hideTimer = setTimeout(() => {
                        if (panelElement) panelElement.classList.remove('panel-visible');
                    }, 500);
                };

                document.addEventListener('mousemove', (e) => {
                    if (!panelElement) return;
                    // Показываем панель если курсор в верхних 50px экрана
                    if (e.clientY <= 50) {
                        showPanel();
                    } else if (e.clientY > 150) { // Скрываем только если курсор далеко от панели
                        hidePanelDelayed();
                    }
                });

                // При наведении на саму панель - не скрываем
                panelElement.addEventListener('mouseenter', showPanel);
                panelElement.addEventListener('mouseleave', hidePanelDelayed);

                GM_log(`[${currentPlatform}] ✓ Hover handler for video_ext.php panel added. Move mouse to top to show panel.`);
            }

            // --- Event Listeners ---

            setButton.addEventListener("click", () => {
                const currentInputValue = parseInt(splitInputField.value, 10);
                if (setButton.classList.contains("active")) {
                    // Button is currently "СПЛИТ НАЧАТ" (active) -> Deactivate split
                    GM_log(`[${currentPlatform}] Deactivating split.`);
                    splitMinutes = 0;
                    stopSplitCheckInterval();
                    splitTriggered = false;
                    removeOverlay();
                    setButton.textContent = "НАЧАТЬ СПЛИТ";
                    setButton.classList.remove("active");
                    updateSplitDisplay();
                } else {
                    // Button is currently "НАЧАТЬ СПЛИТ" (inactive) -> Activate split
                    const inputVal = parseInt(splitInputField.value, 10);
                    if (!isNaN(inputVal) && inputVal >= 0) {
                        splitMinutes = inputVal;
                        GM_log(`[${currentPlatform}] Activating split with ${splitMinutes} minutes (read from input).`);
                        if (splitMinutes > 0) {
                            startSplitCheckInterval();
                            setButton.textContent = "СПЛИТ НАЧАТ";
                            setButton.classList.add("active");
                            if (video && video.paused) {
                                 GM_log(`[${currentPlatform}] Attempting to play video on split start...`);
                                 video.play().catch(e => GM_log(`[${currentPlatform}] Autoplay on split start failed (likely autoplay policy): ${e.message}`));
                            }
                             checkSplitCondition(); // Run check immediately after activating
                        } else {
                             splitMinutes = 0;
                             setButton.textContent = "НАЧАТЬ СПЛИТ";
                             setButton.classList.remove("active");
                             stopSplitCheckInterval();
                        }
                        updateSplitDisplay();
                    } else {
                        alert("Введите корректное число минут.");
                        splitInputField.valueAsNumber = splitMinutes !== null ? splitMinutes : 0;
                    }
                }
            });

            splitInputField.addEventListener("input", function() {
                const inputVal = parseInt(this.value, 10);
                if (isNaN(inputVal) || inputVal < 0) {
                     GM_log(`[${currentPlatform}] Invalid input "${this.value}". Reverting to ${splitMinutes !== null ? splitMinutes : 0}.`);
                     // alert("Введите корректное число минут (неотрицательное)."); // Avoid alert spam on every bad character
                     // Don't revert input field display immediately on *any* invalid input, let user correct.
                     // Only update internal state/stats if the input is valid.
                     // However, for consistency with button increments, the button handlers use valueAsNumber
                     // which implicitly handles non-numeric input by returning NaN.
                     // Let's keep the simple check and return for manual input for now.
                     if (isNaN(inputVal)) { // Revert input field only if explicitly NaN (like removing all digits)
                         this.valueAsNumber = splitMinutes !== null ? splitMinutes : 0;
                     }
                     return;
                }

                // If the split is currently active, updating the input field should update the active splitMinutes
                // splitMinutes !== null means it's either 0 or > 0 from previous activation
                if (splitMinutes !== null) { // Update active split IF it was ever activated
                     // Only update if the new value is different from the current active splitMinutes
                     if (inputVal !== splitMinutes) {
                          GM_log(`[${currentPlatform}] Split input changed to ${inputVal} while split active. Updating active splitMinutes.`);
                          splitMinutes = inputVal; // Update the active split value
                          updateSplitStatsDisplay(); // Update stats display based on new splitMinutes
                          checkSplitCondition(); // Re-evaluate state immediately based on the new splitMinutes
                     } else {
                          GM_log(`[${currentPlatform}] Split input changed to ${inputVal}, which is same as active splitMinutes.`);
                     }
                } else {
                     // Split has never been activated (splitMinutes is null). Changing input only changes the input field.
                     GM_log(`[${currentPlatform}] Split input changed to ${inputVal}. Split is inactive (null). Input value updated.`);
                     // No update to splitMinutes or stats needed here.
                }
            });

            splitInputGroup.querySelectorAll("button").forEach(button => {
                button.addEventListener("click", () => modifySplitInput(parseInt(button.dataset.minutes, 10)));
            });

            volumeSlider.addEventListener("input", function() {
                const newVolume = parseFloat(this.value);
                if (audioPlayer) audioPlayer.volume = newVolume;
                localStorage.setItem(localStorageVolumeKey, newVolume.toString());
            });

            updateSplitDisplay();

            if (platformConfig.needsVisibilityCheck) {
                controlsElement = document.querySelector(platformConfig.controlsElementSelector);
                if (controlsElement) startVisibilityCheckInterval();
                else GM_log(`[${currentPlatform}] Native controls element (${platformConfig.controlsElementSelector}) not found for visibility check.`);
            }

            if (splitMinutes !== null && splitMinutes > 0) {
                 startSplitCheckInterval();
                 checkSplitCondition();
            } else {
                 stopSplitCheckInterval();
            }

            // Кнопка для vkvideo теперь запускается независимо от панели в setupPlatformSplit()
            // Не нужно вызывать startVKVideoButtonUpdate() здесь, чтобы избежать дублирования

            GM_log(`[${currentPlatform}] Control panel added successfully.`);
        }

        function ensurePanelPosition() {
            if (!panelAdded || !panelElement || !platformConfig) return;
            const insertionElement = document.querySelector(platformConfig.insertionSelector);
            if (!insertionElement) { GM_log(`[${currentPlatform}] Insertion element (${platformConfig.insertionSelector}) disappeared. Removing panel.`); removeControlPanel(); return; }

            let currentPositionCorrect = false;
            switch(platformConfig.insertionMethod) {
                case 'prepend': currentPositionCorrect = (insertionElement.firstChild === panelElement); break;
                case 'appendChild': currentPositionCorrect = (insertionElement.lastChild === panelElement); break;
                case 'before': currentPositionCorrect = (insertionElement.previousSibling === panelElement); break;
                case 'afterend': currentPositionCorrect = (insertionElement.nextSibling === panelElement); break;
                default: currentPositionCorrect = (insertionElement.firstChild === panelElement);
            }

            if (!panelElement.parentNode) {
                currentPositionCorrect = false;
                GM_log(`[${currentPlatform}] Panel element detached from DOM. Attempting re-insertion.`);
            }

            if (!currentPositionCorrect) {
                GM_log(`[${currentPlatform}] Panel position incorrect or detached. Attempting re-insertion...`);
                 try {
                     if (panelElement.parentNode) {
                         panelElement.parentNode.removeChild(panelElement);
                     }
                     switch(platformConfig.insertionMethod) {
                         case 'prepend': insertionElement.insertBefore(panelElement, insertionElement.firstChild); break;
                         case 'appendChild': insertionElement.appendChild(panelElement); break;
                         case 'before': insertionElement.parentNode.insertBefore(panelElement, insertionElement); break;
                         case 'afterend': insertionElement.parentNode.insertBefore(panelElement, insertionElement.nextSibling); break;
                         default: insertionElement.insertBefore(panelElement, insertionElement.firstChild);
                     }
                     GM_log(`[${currentPlatform}] Panel re-inserted successfully.`);
                     const panelTitleElement = panelElement?.querySelector('.panel-video-title');
                     if (panelTitleElement) {
                          const titleTextElement = panelTitleElement.querySelector('span');
                          if (titleTextElement) {
                               titleTextElement.textContent = getVideoTitle();
                          }
                     }
                 } catch (e) {
                     GM_log(`[${currentPlatform}] Failed to re-insert panel: ${e.message}`);
                     removeControlPanel();
                 }
            } else {
                const panelTitleElement = panelElement?.querySelector('.panel-video-title');
                 if (panelTitleElement) {
                      const titleTextElement = panelTitleElement.querySelector('span');
                      if (titleTextElement) {
                           const currentTitle = titleTextElement.textContent.trim();
                           const latestTitle = getVideoTitle();
                           if (currentTitle !== latestTitle) {
                                GM_log(`[${currentPlatform}] Panel title out of sync. Updating title.`);
                                titleTextElement.textContent = latestTitle;
                           }
                      }
                 }
            }
        }

        function removeControlPanel() {
            if (panelElement) {
                 try {
                     panelElement.remove();
                     GM_log(`[${currentPlatform || 'unknown'}] Control panel element removed.`);
                 } catch (e) {
                     GM_log(`[${currentPlatform || 'unknown'}] Error removing panel element: ${e.message}`);
                 }
                panelElement = null;
            }
            panelAdded = false;
            stopVisibilityCheckInterval();
            controlsElement = null;
        }

        // --- СПЕЦИФИЧНЫЕ ФУНКЦИИ ДЛЯ VK (Видимость панели) ---
        function checkControlsVisibility() {
            if (!panelElement || !controlsElement || currentPlatform !== 'vk') {
                 if (currentPlatform === 'vk' && (!controlsElement || !panelElement)) {
                      GM_log(`[${currentPlatform}] Controls or panel element missing during visibility check. Stopping check and potentially removing panel.`);
                      stopVisibilityCheckInterval();
                      if (!panelElement) removeControlPanel();
                 }
                return;
            }
            const isHiddenByStyle = controlsElement.style.display === 'none';
            const isHiddenByClass = controlsElement.classList.contains('hidden') || controlsElement.classList.contains('videoplayer_controls_hide');
            const controlsAreVisible = !isHiddenByStyle && !isHiddenByClass;

            if (controlsAreVisible && !panelElement.classList.contains('visible')) {
                panelElement.classList.add('visible');
            } else if (!controlsAreVisible && panelElement.classList.contains('visible')) {
                panelElement.classList.remove('visible');
            }
        }

        function startVisibilityCheckInterval() {
            if (!visibilityCheckIntervalId && platformConfig?.needsVisibilityCheck && currentPlatform === 'vk' && controlsElement) {
                GM_log(`[${currentPlatform}] Starting controls visibility check interval.`);
                visibilityCheckIntervalId = setInterval(checkControlsVisibility, 300);
                checkControlsVisibility();
            }
        }

        function stopVisibilityCheckInterval() {
            if (visibilityCheckIntervalId) {
                GM_log(`[${currentPlatform}] Stopping controls visibility check interval.`);
                clearInterval(visibilityCheckIntervalId);
                visibilityCheckIntervalId = null;
            }
        }

        // --- ОПРЕДЕЛЕНИЕ ТЕКУЩЕЙ ПЛАТФОРМЫ ---
        function getCurrentPlatform() {
            const hostname = location.hostname;
            const pathname = location.pathname;

            // ВКонтакте (встройка или сайт)
            if (hostname.includes('vk.com') && pathname.includes('/video_ext.php')) return 'vk';

            // VK Video (новая платформа)
            if (hostname.includes('vkvideo.ru')) {
                // Возвращаем 'vkvideo' для любой страницы на этом домене
                return 'vkvideo';
            }

            if (hostname.includes('rutube.ru') && pathname.startsWith('/video/')) return 'rutube';
            if (hostname.includes('youtube.com') && pathname.startsWith('/watch')) return 'youtube';

            return 'unknown';
        }

        // --- СБРОС СОСТОЯНИЯ ПРИ СМЕНЕ ВИДЕО ИЛИ ПЛАТФОРМЫ ---
        function resetState() {
            const platformToLog = currentPlatform !== 'unknown' ? currentPlatform : 'Previous';
            GM_log(`[${platformToLog}] Resetting state...`);

            stopSplitCheckInterval();
            stopVisibilityCheckInterval();
            if (overlayTimerIntervalId) { clearInterval(overlayTimerIntervalId); overlayTimerIntervalId = null; }

            removeOverlay();
            removeControlPanel();

            // Reset state variables specific to the current video/split
            splitMinutes = null;
            totalVideoMinutes = null;
            video = null;
            splitTriggered = false;
            audioPrimed = false;
            videoPlayListenerAdded = false;

            if (audioPlayer) {
                try { audioPlayer.pause(); audioPlayer.currentTime = 0; } catch(e){ GM_log(`[${platformToLog}] Error resetting audio player: ${e.message}`); }
                // Keep audioPlayer instance unless it failed loading
            }

            overlayCountdownRemaining = overlayTimerDuration;

        // Очистка кнопки VK Video API
        stopVKVideoButtonUpdate();
        }

        // --- ГЛАВНАЯ ФУНКЦИЯ НАСТРОЙКИ СКРИПТА НА СТРАНИЦЕ ---
        function setupPlatformSplit() {
            const detectedPlatform = getCurrentPlatform();

            if (detectedPlatform !== currentPlatform) {
                 if (currentPlatform !== 'unknown') { GM_log(`Platform or video likely changed from ${currentPlatform} to ${detectedPlatform}. Resetting state for previous page...`); resetState(); }
                 currentPlatform = detectedPlatform;

                 if (currentPlatform !== 'unknown') {
                     platformConfig = platformConfigs[currentPlatform];
                     GM_log(`[${currentPlatform}] Initializing for new platform...`);
                     injectGlobalStyles();
                 } else {
                     platformConfig = null;
                     GM_log(`[Universal] Unknown platform detected (${location.href}), stopping setup interval.`);
                     if (setupIntervalId) { clearInterval(setupIntervalId); setupIntervalId = null; }
                     return;
                 }
            }

            if (currentPlatform !== 'unknown' && platformConfig) {
                 if (!video) {
                      if (currentPlatform === 'vkvideo') {
                          // Для vkvideo видео лежит внутри кастомного элемента vk-video-player в Shadow DOM
                          const playerComponent = document.querySelector('vk-video-player');
                          if (playerComponent) {
                              // Пытаемся взять приватное поле _shadowRoot (как в checkSplitCondition),
                              // а если его нет, то стандартный shadowRoot
                              const root = playerComponent._shadowRoot || playerComponent.shadowRoot;
                              if (root) {
                                  const innerVideo = root.querySelector('video');
                                  if (innerVideo) {
                                      video = innerVideo;
                                      GM_log('[vkvideo] Video element found inside vk-video-player during setup.');
                                  }
                              }
                          }
                      } else {
                          video = document.querySelector(platformConfig.videoSelector);
                      }

                      if (video) {
                           GM_log(`[${currentPlatform}] Video element found during setup.`);
                           if (audioPlayer === null) {
                               initAudioPlayer();
                           }
                      }
                 }

                 if (video && audioPlayer !== null) {
                     primeAudio();
                 } else if (video && audioPlayer === null) {
                      // Video found, but audio player is null (likely due to previous load error)
                      // Log message already happens in initAudioPlayer's onerror
                 }

                // Запускаем кнопку для vkvideo независимо от панели (как в рабочем скрипте)
                if (currentPlatform === 'vkvideo' && !vkVideoButtonUpdateIntervalId) {
                    startVKVideoButtonUpdate();
                }

                if (panelAdded) {
                     ensurePanelPosition();
                    if (platformConfig.needsVisibilityCheck && currentPlatform === 'vk' && !visibilityCheckIntervalId) {
                         controlsElement = document.querySelector(platformConfig.controlsElementSelector);
                         if (controlsElement) startVisibilityCheckInterval();
                    }
                    if (splitMinutes !== null && splitMinutes > 0 && !splitCheckIntervalId) {
                         startSplitCheckInterval();
                         checkSplitCondition();
                    } else if (splitCheckIntervalId && (splitMinutes === null || splitMinutes <= 0)) {
                         stopSplitCheckInterval();
                    }
                } else {
                    const insertionElement = document.querySelector(platformConfig.insertionSelector);
                    controlsElement = platformConfig.needsVisibilityCheck && currentPlatform === 'vk' ? document.querySelector(platformConfig.controlsElementSelector) : null;

                    if (video && insertionElement && (!platformConfig.needsVisibilityCheck || controlsElement)) {
                        addControlPanel();
                    }
                }
            }
        }

        // --- ИНИЦИАЛИЗАЦИЯ СКРИПТА И ОТСЛЕЖИВАНИЕ НАВИГАЦИИ ---
        function initialize() {
            GM_log(`Universal Video Split: Initializing (v${GM_info.script.version})...`);
            lastUrl = location.href;

            if (!setupIntervalId) {
                 setupIntervalId = setInterval(setupPlatformSplit, setupIntervalDelay);
                 GM_log(`Setup interval started with ${setupIntervalDelay}ms delay.`);
            }

            if (!navigationObserver) {
                navigationObserver = new MutationObserver((mutations) => {
                     if (location.href !== lastUrl) {
                         GM_log(`URL change detected by observer from ${lastUrl} to ${location.href}`);
                         lastUrl = location.href;
                         resetState();
                         // setupPlatformSplit() будет вызван через интервал и запустит кнопку заново для vkvideo
                     }
                });
                navigationObserver.observe(document.body, { childList: true, subtree: true });
                GM_log("MutationObserver for navigation started.");
            }

            setupPlatformSplit(); // Run setup once immediately on script load
        }

        // --- Очистка при выходе со страницы ---
        window.addEventListener('beforeunload', () => {
            GM_log("Universal Video Split: Unloading, cleaning up...");
            resetState();

            if (setupIntervalId) { clearInterval(setupIntervalId); setupIntervalId = null; GM_log("Setup interval cleared on unload."); }
            if (navigationObserver) { navigationObserver.disconnect(); navigationObserver = null; GM_log("MutationObserver disconnected on unload."); }
            if (audioPlayer) { try { audioPlayer.pause(); } catch(e){} audioPlayer = null; GM_log("Audio player cleared on unload."); }
        });

        // --- Запуск скрипта ---
        initialize();

    })();