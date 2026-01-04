// ==UserScript==
// @name         VK Feed Filter - No Images/Video
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Removes posts containing images/videos from VK feed using periodic checks.
// @author       AL
// @match        *://vk.com/feed*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530947/VK%20Feed%20Filter%20-%20No%20ImagesVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/530947/VK%20Feed%20Filter%20-%20No%20ImagesVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = "VK Feed Filter v1.5 (Interval)";
    const CHECK_INTERVAL_MS = 1500; // Как часто проверять новые посты (в миллисекундах)
    const DEBUG = true; // Включить подробное логирование

    function log(...args) {
        if (DEBUG) {
            console.log(`${SCRIPT_NAME}:`, ...args);
        }
    }
    function error(...args) {
        console.error(`${SCRIPT_NAME}:`, ...args);
    }

    log("Script activated.");

    // --- Inject CSS for hiding ---
    const styleId = 'vk-feed-filter-style-v15';
    const hideCssClass = 'vk-feed-filter-hide-v15';
    const oldStyle = document.getElementById(styleId);
    if(oldStyle) oldStyle.remove();
    // Делаем скрытие максимально надежным
    GM_addStyle(`
        .${hideCssClass} {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            content-visibility: hidden !important; /* Экспериментальное свойство, может помочь */
        }
    `);
    log("Injected CSS for hiding.");

    // --- Selectors (можно оставить из v1.4, они вроде работали для поиска) ---
    const mediaSelectors = [
        // Images & Grids
        '.MediaGrid__thumb', '.MediaGrid__image', 'img.MediaGrid__image',
        '.page_post_sized_thumbs', '.page_post_thumb_wrap img', '.page_preview_photo_image',
        '.thumb_map img', '.thumb_photo', '.PhotoPrimaryAttachment__image',
        'a[aria-label*="фотография"]', 'a[aria-label*="photo"]',
        '.article_snippet--photo_preview',
        '.page_cover',

        // Videos
        '.thumb_video', '.Video', '.page_video_thumb_wrap', '.page_video_inline_wrap',
        '.VideoInlinePlayer', '.VideoThumbnail__thumb', '.page_video_wrap', 'video',
        'iframe[src*="youtube.com"]', 'iframe[src*="vk.com/video_ext.php"]',
        '.videoplayer_media', '.VideoCard__thumb',

        // Clips
        '.ShortVideoFeedItem__playerContainer', '.short_video_feed_item', '.VerticalVideoLayer',
        '.tiktok_video_inline', '.tiktok_video_player',

        // Carousels
        '.ui_gallery__item', '.wall_carousel_item--photo', '.wall_carousel_item--video',
        '.CarouselBasic__item', '.ui_gallery_inner',

        // Others
        '.media_preview', '.ArticleSnippet__imageContainer', '.LinkSnippet__image',
        '.StorySnippet', '.PodcastSnippet__cover', '.poll_graph',
        '.audio_stack_cover',

        // Nested
        '.wall_text img', '.copy_quote img',

        // Specific post types with inherent media
        '.post_type_report',
        '.post_type_map',
        '.post_type_graffiti'
    ].join(', ');

    const postContainerSelector = '.feed_row'; // Контейнер, который обычно виден
    const actualPostSelector = '._post, .article'; // Где искать контент
    const adContainerSelectors = '._ads_block_data_w, .ads_ad_box_legacy, div[data-ad-view]';
    const allContentSelectors = `${postContainerSelector}, ${adContainerSelectors}`; // Объединяем для сканирования

    let checkIntervalId = null;
    let isChecking = false; // Флаг, чтобы предотвратить одновременный запуск проверки

    // --- Function to hide an element ---
    function hideElement(element, reason = 'Media found') {
        if (!element || element.classList.contains(hideCssClass)) {
            return false;
        }
        log(`Hiding element (ID: ${element.id || 'N/A'}, Class: ${element.classList[0] || ''}): ${reason}`);
        element.classList.add(hideCssClass);
        return true;
    }

    // --- Function to scan and hide posts ---
    function scanAndHide() {
        if (isChecking) {
            // log("Scan already in progress, skipping.");
            return;
        }
        isChecking = true;
        // log("Scanning for media posts...");

        let hiddenNow = 0;
        const elementsToCheck = document.querySelectorAll(allContentSelectors);

        if (elementsToCheck.length === 0) {
             // log("No potential post/ad containers found in this scan.");
             isChecking = false;
             return;
        }

        elementsToCheck.forEach(element => {
            if (element.classList.contains(hideCssClass)) {
                return; // Already hidden by us
            }

            // Определяем, где искать медиа
            let contentElement = element;
            if (element.matches(postContainerSelector)) {
                contentElement = element.querySelector(actualPostSelector) || element.querySelector(adContainerSelectors);
                 if (!contentElement) {
                     contentElement = element; // Проверяем саму строку, если внутри ничего нет
                 }
            }

            if (!contentElement) return; // Не удалось найти элемент для проверки

            // Проверяем наличие медиа
            try {
                const containsMedia = contentElement.querySelector(mediaSelectors);
                if (containsMedia) {
                    if (hideElement(element, `Found media: ${containsMedia.tagName}.${containsMedia.classList[0] || ''}`)) {
                        hiddenNow++;
                    }
                }
            } catch (e) {
                error("Error during querySelector:", e, "on element:", contentElement);
            }
        });

        // if (hiddenNow > 0) {
        //    log(`Hid ${hiddenNow} new elements in this scan.`);
        // }
        isChecking = false;
    }

    // --- Start the periodic check ---
    function startIntervalCheck() {
        log(`Starting periodic check every ${CHECK_INTERVAL_MS}ms.`);
        // Perform an initial scan almost immediately
        setTimeout(scanAndHide, 100); // Небольшая задержка после старта
        // Then start the interval
        if (checkIntervalId) {
            clearInterval(checkIntervalId);
        }
        checkIntervalId = setInterval(scanAndHide, CHECK_INTERVAL_MS);

        // Optional: Clear interval on page unload
        window.addEventListener('unload', () => {
            if (checkIntervalId) {
                clearInterval(checkIntervalId);
                log("Stopped periodic check.");
            }
        });
         // Pause checking when tab is hidden
         document.addEventListener('visibilitychange', () => {
             if (document.visibilityState === 'hidden') {
                 if (checkIntervalId) {
                    // clearInterval(checkIntervalId);
                    // checkIntervalId = null;
                     log("Tab hidden, pausing checks (optional - currently checks continue).");
                     // Если раскомментировать clearInterval, то проверки остановятся при неактивной вкладке
                 }
             } else {
                 if (!checkIntervalId) {
                     log("Tab visible, restarting checks.");
                     checkIntervalId = setInterval(scanAndHide, CHECK_INTERVAL_MS);
                      // Run scan immediately on becoming visible
                      setTimeout(scanAndHide, 100);
                 }
             }
         });
    }

    // --- Initialization ---
    log("Waiting for DOM Content Loaded...");
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        log("DOM already ready.");
        startIntervalCheck();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            log("DOMContentLoaded event fired.");
            startIntervalCheck();
        }, { once: true });
    }
     // Fallback just in case
     window.addEventListener('load', () => {
         if (!checkIntervalId) {
             log("Window load event fired. Ensuring checks are running.");
             startIntervalCheck();
         }
     }, { once: true });

})();