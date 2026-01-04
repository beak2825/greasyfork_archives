// ==UserScript==
// @license MIT
// @name         YouTube transparent
// @name:ru      Прозрачность на ютубе
// @namespace    http://tampermonkey.net/
// @version      0.2_alpha
// @description  More transparent in youtube
// @description:ru  Прозрачность комментариев и другой информации
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531363/YouTube%20transparent.user.js
// @updateURL https://update.greasyfork.org/scripts/531363/YouTube%20transparent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSS = `
        /* Основные стили */
        ytd-watch-flexy {
            max-width: 100% !important;
            padding: 0 !important;
        }

        #secondary {
            display: inline !important;
            z-index: 4;
            margin-top: calc(25vh - 145px) !important;
        }

        /* Видео-контейнер */
        #movie_player.ultrawide-active {
            position: fixed !important;
            left: 0 !important;
            width: 100% !important;
            height: calc(100vh - 60px) !important;
            z-index: 1 !important;
        }

        /* Затемнение и контент */
        .ultrawide-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0);

            backdrop-filter: blur(0px); /* Добавлено размытие */

            z-index: 2;
            pointer-events: none;
            transition: background 0.3s ease;
        }

        .ultrawide-content-container {
            position: relative !important;
            z-index: 3 !important;
            padding: 5px 5% 5px 5% !important;
            margin-top: calc(25vh - 160px) !important;
            background: transparent !important;
            max-height: 60vh !important;
            overflow-y: none !important;
            box-sizing: border-box !important;
        }

        /* Оптимизация заголовка */
        #title.ytd-watch-metadata {
            margin: 15px 0 !important;
        }

        /* Адаптация для мобильных */
        @media (max-width: 600px) {
            .ultrawide-content-container {
                padding: 10px !important;
                margin-top: 70vh !important;
            }
        }
    `;

    let overlay = null;
    let scrollHandler = null;

    const isVideoPage = () => {
        return window.location.pathname.includes('/watch');
    };

    const init = () => {
        if (!isVideoPage()) {
            cleanup();
            return;
        }

        const player = document.getElementById('movie_player');
        if (!player) return;

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'ultrawide-overlay';
            document.body.prepend(overlay);
        }

        player.classList.add('ultrawide-active');
        const contentContainer = document.querySelector('#primary-inner');
        if (contentContainer) {
            contentContainer.classList.add('ultrawide-content-container');
        }

        const updateLayout = () => {
            const playerHeight = player.offsetHeight;
            if (contentContainer) {
                contentContainer.style.marginTop = `${playerHeight * 0.85}px`;
            }
        };

        scrollHandler = () => {
            const scrollY = window.scrollY;
            const playerHeight = player.offsetHeight;
            const opacity = Math.min(scrollY / (playerHeight * 0.5), 0.7);
            const bluramount = (Math.min(scrollY / (playerHeight * 0.5), 0.7)*3);
            overlay.style.background = `rgba(0,0,0,${opacity})`;
            overlay.style.backdropFilter = `blur(${bluramount}px)`;
            updateLayout();
        };

        window.addEventListener('scroll', scrollHandler);
        updateLayout();
    };

    const cleanup = () => {
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
            scrollHandler = null;
        }
        document.querySelector('#movie_player')?.classList.remove('ultrawide-active');
        document.querySelector('#primary-inner')?.classList.remove('ultrawide-content-container');
    };

    GM_addStyle(CSS);

    new MutationObserver((mutations) => {
        if (!isVideoPage()) {
            cleanup();
            return;
        }
        const player = document.getElementById('movie_player');
        if (player && !player.classList.contains('ultrawide-active')) {
            cleanup();
            setTimeout(init, 300);

        }
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('yt-navigate-finish', () => {
        if (isVideoPage()) {
            setTimeout(init, 500);
        } else {
            cleanup();
        }
    });

    window.addEventListener('beforeunload', cleanup);
})();