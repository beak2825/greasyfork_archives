// ==UserScript==
// @name         Jut-su Quick Add to Lists
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Adds a polished, interactive panel with SVG icons on hover over the anime poster. Icons only, no button background.
// @author       whynothacked & AI Assistant
// @match        https://jut-su.net/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542316/Jut-su%20Quick%20Add%20to%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/542316/Jut-su%20Quick%20Add%20to%20Lists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФИГУРАЦИЯ СПИСКОВ И SVG-ИКОНОК ---
    // В каждую иконку добавлен класс 'qap-icon-path' для точного управления цветом.
    const SVG_ICONS = {
        'icon-eye': `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="pointer-events: none;"><path class="qap-icon-path" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>`,
        'icon-list': `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="pointer-events: none;"><path class="qap-icon-path" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`,
        'icon-flag-checkered': `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="pointer-events: none;"><path class="qap-icon-path" d="m14.4 6 2 2-2 2-2-2-2 2-2-2-2 2-2-2H4v11h16V6h-5.6z"></path></svg>`,
        'icon-eye-slash': `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="pointer-events: none;"><path class="qap-icon-path" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 9.92 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>`
    };

    const LISTS_CONFIG = [
        { id: 1, title: 'Смотрю', iconName: 'icon-eye' },
        { id: 2, title: 'Буду смотреть', iconName: 'icon-list' },
        { id: 3, title: 'Просмотрено', iconName: 'icon-flag-checkered' },
        { id: 4, title: 'Брошено', iconName: 'icon-eye-slash' }
    ];

    // --- СТИЛИ ---
    // Полностью переписаны для максимальной надежности и чистого вида.
    GM_addStyle(`
        .jutsu-item__img { position: relative; overflow: hidden; }
        .quick-add-panel {
            position: absolute; bottom: 0; left: 0; width: 100%; height: 55px;
            display: flex; justify-content: space-around; align-items: center;
            padding: 0 5px 2px; box-sizing: border-box;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
            opacity: 0; pointer-events: none; transition: opacity 0.2s ease-in-out; z-index: 99;
        }
        .jutsu-item--short:hover .quick-add-panel { opacity: 1; pointer-events: auto; }
        .jutsu-item__label-series { transition: opacity 0.2s ease-in-out; z-index: 5; position: relative; }
        .jutsu-item--short:hover .jutsu-item__label-series { opacity: 0; }

        /* Стили для кнопки-обертки: ПОЛНОСТЬЮ ПРОЗРАЧНАЯ */
        div.quick-add-panel button.quick-add-btn {
            all: initial; /* Сбрасываем ВСЕ унаследованные стили сайта */
            cursor: pointer;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent !important; /* Фон всегда прозрачный */
            border: none !important;
            padding: 0 !important;
            font-family: inherit; /* Возвращаем нужные свойства */
        }

        /* ПРЯМОЕ УПРАВЛЕНИЕ ЦВЕТОМ ИКОНКИ с высокой специфичностью */
        div.quick-add-panel button.quick-add-btn .qap-icon-path {
            fill: #ccc;
            transition: fill 0.2s ease-in-out;
        }
        div.quick-add-panel button.quick-add-btn:hover .qap-icon-path {
            fill: #fff;
        }
        div.quick-add-panel button.quick-add-btn.active .qap-icon-path {
            fill: #e85b5b;
        }
        div.quick-add-panel button.quick-add-btn.active:hover .qap-icon-path {
            fill: #ff8c8c;
        }

        .jutsu-item--short .lists-mark { display: none !important; }
    `);

    // --- ОСНОВНАЯ ЛОГИКА (без изменений) ---
    async function toggleFavorite(postId, listId, isRemoving) {
        const formData = new FormData();
        formData.append('mod', 'fav');
        formData.append('action', 'toggle');
        formData.append('post_id', postId);
        formData.append('list_id', listId);
        formData.append('is_remove', isRemoving ? '1' : '0');
        try {
            const response = await fetch('/engine/ajax/controller.php', { method: 'POST', body: formData });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('[Jutsu Quick Add] Request failed:', error);
            return false;
        }
    }

    async function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const button = e.currentTarget;
        const panel = button.parentElement;
        const { postId, listId } = button.dataset;
        const isActive = button.classList.contains('active');
        const success = await toggleFavorite(postId, listId, isActive);
        if (success) {
            if (isActive) {
                button.classList.remove('active');
            } else {
                panel.querySelectorAll('.quick-add-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
        }
    }

    function initialize() {
        const animeCards = document.querySelectorAll('.jutsu-item--short:not(.quick-add-initialized)');
        animeCards.forEach(card => {
            const linkElement = card.querySelector('a.jutsu-item__title');
            const imageContainer = card.querySelector('.jutsu-item__img');
            if (!linkElement || !imageContainer) return;

            const href = linkElement.getAttribute('href');
            const match = /\/(\d+)-/.exec(href);
            if (!match || !match[1]) return;
            const postId = match[1];

            const panel = document.createElement('div');
            panel.className = 'quick-add-panel';
            const originalStatusMark = card.querySelector('.lists-mark');
            let initialStatusTitle = originalStatusMark ? originalStatusMark.title : '';

            LISTS_CONFIG.forEach(list => {
                const button = document.createElement('button');
                button.className = `quick-add-btn`;
                button.innerHTML = SVG_ICONS[list.iconName];
                button.title = list.title;
                button.dataset.postId = postId;
                button.dataset.listId = list.id;
                if (list.title === initialStatusTitle) {
                    button.classList.add('active');
                }
                button.addEventListener('click', handleButtonClick);
                panel.appendChild(button);
            });

            imageContainer.appendChild(panel);
            card.classList.add('quick-add-initialized');
        });
    }

    // --- ЗАПУСК ---
    initialize();
    const observer = new MutationObserver(() => {
        setTimeout(initialize, 500);
    });
    const contentArea = document.querySelector('#dle-content, .jutsu-main');
    if (contentArea) {
        observer.observe(contentArea, { childList: true, subtree: true });
    }
})();