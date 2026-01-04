// ==UserScript==
// @name         YouTube Playlist: Remove Button
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  Adds a button on YouTube playlist pages to remove videos directly.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544822/YouTube%20Playlist%3A%20Remove%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544822/YouTube%20Playlist%3A%20Remove%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('YouTube Playlist: Remove Button started');

    const TRASH_ICON_SVG_PATH = "M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z";
    const REMOVE_TEXT = {
        'en': 'Remove from',
        'de': 'Aus Playlist entfernen',
        'ru': 'Удалить из плейлиста',
        'fr': 'Retirer de',
        'es': 'Quitar de',
        'pt': 'Remover da playlist',
        'it': 'Rimuovi da',
    };

    function waitForElement(selector, timeout = 5000) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    clearTimeout(timer);
                    resolve(el);
                }
            }, 100);
            const timer = setTimeout(() => {
                clearInterval(interval);
                resolve(null);
            }, timeout);
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        .remove-button-custom {
            display: flex;
            align-items: center;
            border: none;
            background: transparent;
            color: #aaa;
            cursor: pointer;
            margin-top: 5px;
            padding: 0;
            font-size: 20px;
            transition: color 0.2s, transform 0.2s;
        }
        .remove-button-custom:hover { color: #f1f1f1; }
        .remove-button-custom:active { transform: scale(0.85); }
    `;
    document.head.append(style);

    function addRemoveButton(videoElement) {
        if (videoElement.querySelector('.remove-button-custom')) return;

        const button = document.createElement('button');
        button.className = 'remove-button-custom';
        button.title = 'Remove from playlist';
        button.textContent = '🗑️';

        button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const menuButton = videoElement.querySelector('#button.ytd-menu-renderer');
            if (!menuButton) return;
            menuButton.click();

            const menuContainer = await waitForElement('ytd-menu-popup-renderer, iron-dropdown');
            if (!menuContainer) {
                alert('Menu not found. Please try again.');
                return;
            }

            const menuItems = menuContainer.querySelectorAll('ytd-menu-service-item-renderer');
            let removeMenuItem = null;

            // Try icon-based detection
            removeMenuItem = Array.from(menuItems).find(item =>
                item.querySelector(`path[d="${TRASH_ICON_SVG_PATH}"]`)
            );

            // Try text-based fallback
            if (!removeMenuItem) {
                const lang = document.documentElement.lang.split('-')[0] || 'en';
                const removeText = REMOVE_TEXT[lang] || REMOVE_TEXT['en'];

                removeMenuItem = Array.from(menuItems).find(item =>
                    item.innerText.trim().startsWith(removeText)
                );
            }

            if (removeMenuItem) {
                removeMenuItem.click();
            } else {
                alert('Could not find the remove button.');
                document.body.click(); // Close menu
            }
        });

        const meta = videoElement.querySelector('#meta');
        if (meta) {
            meta.appendChild(button);
        }
    }

    function processAllVideos() {
        const items = document.querySelectorAll('ytd-playlist-video-renderer');
        if (items.length === 0) {
            console.log('Keine Videos gefunden.');
        }
        items.forEach(addRemoveButton);
    }

    // Run once when loaded
    async function initialize() {
        const firstVideo = await waitForElement('ytd-playlist-video-renderer');
        if (firstVideo) processAllVideos();
    }

    // React to navigation in SPA
    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(processAllVideos, 500);
    });

    // Monitor DOM changes for lazy-loaded videos
    const observer = new MutationObserver(() => {
        processAllVideos();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial boot
    initialize();

    // Periodic fallback
    setInterval(processAllVideos, 5000);

})();