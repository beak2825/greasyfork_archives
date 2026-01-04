// ==UserScript==
// @name         Rutube Enhancer
// @description  Скрипт, добавляющий некоторые фишки для рутуба
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @author       4ndefined
// @run-at       document-end
// @match        *://rutube.ru/*
// @match        *://rutube.sport/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutube.ru
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516408/Rutube%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/516408/Rutube%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Время перемотки в секундах
    const SEEK_SECONDS = 5;

    // Исправление размера видео (вкл = 1, выкл = 0)
    const ENABLE_STYLES_FIX = 1;

    // Включает макет страницы на всю ширину
    const USE_FULL_WIDTH_LAYOUT = 1;

    // Улучшение стилей на странице плейлистов
    const ENHANCE_PLAYLIST_STYLES_FIX = 1;

    if (ENABLE_STYLES_FIX) {
        injectStyles();
    }

    window.addEventListener('keydown', handleKeyDown, true);

    function stopEvent(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    function handleKeyDown(e) {
        const vid = document.querySelector('video');
        const key = e.code;

        if (key === 'ArrowLeft') {
            stopEvent(e);

            vid.currentTime -= SEEK_SECONDS;

            if (vid.currentTime < 0) {
                vid.pause();
                vid.currentTime = 0;
            }
        } else if (key === 'ArrowRight') {
            stopEvent(e);

            vid.currentTime += SEEK_SECONDS;

            if (vid.currentTime > vid.duration) {
                vid.pause();
                vid.currentTime = 0;
            }
        } else if (key === 'Space') {
            stopEvent(e);

            if (vid.paused || vid.ended) {
                vid.play();
            } else {
                vid.pause();
            }
        }
    }

    function injectStyles() {
        const styles = `
          .wdp-video-adfox-module__container,
          .wdp-auth-offer-popup-module__wrapper {
            display: none !important;
          }

          .wdp-video-wrapper-module__videoWrapper {
	        padding: 0 !important;
            height: calc(100vh - 104px) !important;
          }

          ${USE_FULL_WIDTH_LAYOUT ? `.video-page-container-module__container { max-width: none !important; }` : ''}
        `;

        const rutubeSportStyles = `
            /* main header */
            header[class*="_headerWrapper_"] {
                padding: var(--rt-spacing-8x) !important;
            }

            /* some ads container */
            [id*="adfox_newspage_top"] {
                display: none;
            }

            /* video container */
            [class*="_video"] {
                max-height: calc(100vh - 80px);
            }

            /* preview poster */
            [class*="loader-template-module_wrapper__"] {
                background-size: contain !important;
            }

            /* player containers */
            #app > div > div {
                padding-top: 0 !important;
            }
            #app > div > div > div {
                max-width: none !important;
            }

            /* video title and description */
            main header {
                order: 2;
            }
            main header + div > section {
                margin: 0 !important;
            }
        `;

        const playlistsStyles = `
            /*
            .wdp-playlist-info-module__playlistInfo {
             	display: none;
            }
            */

            .wdp-playlist-module__list {
                max-width: none !important;
            }

            [class*='freyja_pen-infinite-scroll__pen-infinite-scroll__content_column'] {
                flex-direction: row !important;
                flex-wrap: wrap !important;
            }

            .wdp-playlist-video-card-module__card {
                width: clamp(100px, 20%, 320px);
            }

            .wdp-playlist-video-card-module__card:hover,
            .wdp-playlist-video-card-module__card:hover + .wdp-playlist-video-card-module__card {
                border-color: var(--pen-secondary601);
                border-radius: 0;
            }

            .wdp-playlist-video-card-module__card:first-child {
                border-top: 1px solid var(--pen-secondary601);
            }

            .wdp-playlist-video-card-module__media {
                width: 100%;
            }

            .wdp-playlist-video-card-module__title {
                padding-top: calc(56% + 16px);
                margin-top: calc(-56% - 16px);
            }

            .wdp-playlist-video-card-module__content {
                flex-direction: column;
                align-items: center;
            }

            .wdp-playlist-video-card-module__info {
                position: relative;
            }

            /* стили шапки плейлиста */
            .wdp-playlist-info-module__header {
                display: block !important;
            }
            .wdp-playlist-info-module__leftBlock {
                float: left;
                width: 280px;
                margin-bottom: 16px;
            }
            .wdp-playlist-info-module__rightBlock {
                flex-wrap: wrap;
                flex-direction: row;
                align-items: center;
            }
            .wdp-playlist-info-module__info {
                width: 100%;
                padding: 0;
                margin-bottom: 8px;
            }
            .wdp-playlist-info-module__description {
                padding-left: 304px;
            }
            .wdp-playlist-info-author-options-module__author-options__actions-container {
                clear: right;
            }

            /* стили карточки видео */
            .wdp-card-playlist-views-module__playlist-views {
                flex-wrap: wrap;
            }

            /* имитация просмотренных роликов */
            a:visited, a:visited * {
                color: #999;
            }
        `;

        GM.addStyle(styles);
        GM.addStyle(rutubeSportStyles);

        if (ENHANCE_PLAYLIST_STYLES_FIX) {
            GM.addStyle(playlistsStyles);
        }
    }

})();