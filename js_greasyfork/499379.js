// ==UserScript==
// @name         Youtube button to delete a video from a playlist (Fixed & Robust)
// @name:en      Youtube button to delete a video from a playlist (Fixed & Robust)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description:en Adds a button to directly remove videos from the playlist on YouTube. Works across different languages and UI updates.
// @description  Добавляет кнопку для удаления видео из плейлиста на ютубе. Работает с разными языками и устойчив к обновлениям интерфейса.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499379/Youtube%20button%20to%20delete%20a%20video%20from%20a%20playlist%20%28Fixed%20%20Robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499379/Youtube%20button%20to%20delete%20a%20video%20from%20a%20playlist%20%28Fixed%20%20Robust%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Robust script v2.1 started');

    // Уникальный SVG-путь для иконки удаления (корзины). Самый надежный идентификатор.
    const TRASH_ICON_SVG_PATH = "M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z";

    // Словарь с переводами для поиска по тексту (запасной вариант).
    const REMOVE_TEXT = {
        'en': 'Remove from',
        'ru': 'Удалить из плейлиста',
        'de': 'Aus Playlist entfernen',
        'fr': 'Retirer de',
        'es': 'Quitar de',
        'pt': 'Remover da playlist',
        'it': 'Rimuovi da',
    };

    /**
     * Функция для надежного ожидания появления элемента в DOM.
     * @param {string} selector - CSS селектор для поиска.
     * @param {number} timeout - Максимальное время ожидания в мс.
     * @returns {Promise<Element|null>}
     */
    function waitForElement(selector, timeout = 3000) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    clearTimeout(timer);
                    resolve(element);
                }
            }, 100);

            const timer = setTimeout(() => {
                clearInterval(interval);
                console.warn(`waitForElement: Element "${selector}" not found.`);
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
            color: #aaa; /* Сделал чуть ярче */
            cursor: pointer;
            margin-top: 5px;
            padding: 0;
            transition: color 0.2s, transform 0.2s;
            font-size: 20px;
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

        // === ГЛАВНОЕ ИСПРАВЛЕНИЕ ===
        // БЫЛО (вызывает ошибку TrustedHTML): button.innerHTML = '🗑️';
        // СТАЛО (безопасно):
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

            // Способ 1: Поиск по SVG-иконке (самый надежный)
            removeMenuItem = Array.from(menuItems).find(item =>
                item.querySelector(`path[d="${TRASH_ICON_SVG_PATH}"]`)
            );

            if (removeMenuItem) {
                console.log('Found remove button by ICON');
            }

            // Способ 2: Поиск по тексту (запасной, если иконка изменится)
            if (!removeMenuItem) {
                const lang = document.documentElement.lang.split('-')[0] || 'en';
                const removeText = REMOVE_TEXT[lang] || REMOVE_TEXT['en'];

                removeMenuItem = Array.from(menuItems).find(item =>
                    item.innerText.trim().startsWith(removeText)
                );
                if (removeMenuItem) console.log(`Found remove button by TEXT for lang "${lang}"`);
            }

            if (removeMenuItem) {
                removeMenuItem.click();
            } else {
                console.error('Could not find the remove button in the menu.', Array.from(menuItems).map(i => i.innerText));
                alert('Script could not find the remove button.');
                document.body.click(); // Закрываем меню
            }
        });

        const metaContainer = videoElement.querySelector('#meta');
        if (metaContainer) {
            metaContainer.appendChild(button);
        }
    }

    function processPage() {
        document.querySelectorAll('ytd-playlist-video-renderer').forEach(addRemoveButton);
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.matches('ytd-playlist-video-renderer')) {
                        addRemoveButton(node);
                    }
                    node.querySelectorAll('ytd-playlist-video-renderer').forEach(addRemoveButton);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-finish', processPage);
    // Для надежности запускаем и при первоначальной загрузке
    if (document.body) {
        processPage();
    } else {
        document.addEventListener('DOMContentLoaded', processPage);
    }
})();