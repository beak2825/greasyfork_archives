// ==UserScript==
// @name Просмотр аниме онлайн на shikimori
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Добавляет кнопку "Смотреть онлайн" на странице с аниме и при нажатии выводит видеоплеер kodik для просмотра прямо на Shikimori
// @author Your Name
// @match https://shikimori.one/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/489574/%D0%9F%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D0%B0%D0%BD%D0%B8%D0%BC%D0%B5%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD%20%D0%BD%D0%B0%20shikimori.user.js
// @updateURL https://update.greasyfork.org/scripts/489574/%D0%9F%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D0%B0%D0%BD%D0%B8%D0%BC%D0%B5%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD%20%D0%BD%D0%B0%20shikimori.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentPath = location.pathname;
    let observer = null;

    function getShikimoriID() {
    const match = location.pathname.match(/\/animes\/(?:[a-z])?(\d+)/);
    const id = match ? match[1] : null;
    console.log('[WatchButton] Shikimori ID (из URL):', id);
    return id;
}

    function removeOldElements() {
        const oldButton = document.querySelector('#watch-online-button');
        const oldIframe = document.querySelector('iframe[src*="kodik.cc"]');
        if (oldButton) {
            console.log('[WatchButton] Удаляю старую кнопку');
            oldButton.remove();
        }
        if (oldIframe) {
            console.log('[WatchButton] Удаляю старый iframe');
            oldIframe.remove();
        }
    }

    function insertWatchButton() {
        console.log('[WatchButton] Попытка вставить кнопку на', location.pathname);

        if (!/^\/animes\/[^/]+/.test(location.pathname)) {
            console.log('[WatchButton] Не страница аниме — пропуск');
            return;
        }

        removeOldElements();

        const target = document.querySelector('.b-add_to_list');
        if (!target) {
            console.log('[WatchButton] Элемент .b-add_to_list не найден');
            return;
        }

        console.log('[WatchButton] Вставляю кнопку...');

        const button = document.createElement('button');
        button.textContent = 'Смотреть онлайн';
        button.id = 'watch-online-button';
        button.classList.add('b-link_button');

        let iframe;

        button.addEventListener('click', () => {
            if (iframe) {
                console.log('[WatchButton] Закрываю iframe');
                iframe.remove();
                iframe = null;
                button.textContent = 'Смотреть онлайн';
                return;
            }

            const id = getShikimoriID();
            if (!id) {
                console.log('[WatchButton] ID не найден, прерывание');
                return;
            }

            console.log('[WatchButton] Создаю iframe для ID:', id);
            iframe = document.createElement('iframe');
            iframe.src = `https://kodik.cc/find-player?shikimoriID=${id}`;
            iframe.width = '610';
            iframe.height = '370';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            iframe.setAttribute('allow', 'autoplay *; fullscreen *');

            const container = document.querySelector('.c-about');
            if (container) {
                container.appendChild(iframe);
                console.log('[WatchButton] iframe вставлен в .c-about');
            } else {
                console.log('[WatchButton] .c-about не найден, отложенная вставка');
                setTimeout(() => {
                    const retryContainer = document.querySelector('.c-about');
                    if (retryContainer) {
                        retryContainer.appendChild(iframe);
                        console.log('[WatchButton] iframe вставлен после задержки');
                    } else {
                        console.warn('[WatchButton] .c-about не найден даже после задержки');
                    }
                }, 300);
            }

            button.textContent = 'Закрыть';
        });

        target.parentNode.insertBefore(button, target.nextSibling);
        console.log('[WatchButton] Кнопка вставлена рядом с .b-add_to_list');
    }

    function setupDOMObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if ([...mutation.addedNodes].some(node => node.nodeType === 1 && node.querySelector?.('.b-add_to_list'))) {
                    console.log('[WatchButton] MutationObserver сработал — найдены изменения с .b-add_to_list');
                    setTimeout(insertWatchButton, 100);
                    break;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        console.log('[WatchButton] MutationObserver активирован');
    }

    function watchURLChanges() {
        setInterval(() => {
            if (location.pathname !== currentPath) {
                console.log('[WatchButton] Обнаружено изменение URL:', location.pathname);
                currentPath = location.pathname;
                setTimeout(insertWatchButton, 500);
            }
        }, 300);
    }

    // Инициализация
    console.log('[WatchButton] Скрипт запущен');
    setupDOMObserver();
    watchURLChanges();
    insertWatchButton();
})();
