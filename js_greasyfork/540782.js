// ==UserScript==
// @name         YouTube AdBlock Stealth Mode
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Скрывает факт использования AdBlock на YouTube без поломки интерфейса (ESC, полноэкранный режим, воспроизведение работают нормально). Убирает всплывающие уведомления и блокирует рекламные скрипты.
// @author       someonedev
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540782/YouTube%20AdBlock%20Stealth%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540782/YouTube%20AdBlock%20Stealth%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // [1] Подмена стандартных признаков наличия AdBlock
    Object.defineProperty(window, 'canRunAds', {
        get: () => true,
        configurable: false
    });
    if (!window.chrome) window.chrome = { runtime: {} };
    Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3],
        configurable: false
    });
    Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
        configurable: false
    });

    // [2] Блокировка загрузки рекламных скриптов (fetch / XHR)
    const blocked = ['googleads', 'doubleclick', 'adservice'];
    const origFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (blocked.some(d => url.includes(d))) {
            return Promise.resolve(new Response('', { status: 204 }));
        }
        return origFetch.apply(this, arguments);
    };
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._block = blocked.some(d => url.includes(d));
        return origOpen.apply(this, arguments);
    };
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (this._block) {
            this.onload = this.onerror = () => { };
            this.abort();
            return;
        }
        return origSend.apply(this, arguments);
    };

    // [3] Скрытие всплывающих окон без удаления элементов
    const style = document.createElement('style');
    style.textContent = `
        ytd-enforcement-message-view-model,
        tp-yt-paper-dialog[role="dialog"],
        .ytd-popup-container,
        tp-yt-iron-overlay-backdrop,
        .ytp-ad-module,
        .ytp-ad-overlay-container,
        .ytp-ad-player-overlay {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    // [4] Наблюдатель за появлением блокировок YouTube (MutationObserver)
    const hideAdPopup = () => {
        const popup = document.querySelector('ytd-enforcement-message-view-model');
        const overlay = document.querySelector('tp-yt-iron-overlay-backdrop');
        if (popup) popup.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    };
    const observer = new MutationObserver(hideAdPopup);
    const waitForBody = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            hideAdPopup();
        } else {
            requestAnimationFrame(waitForBody);
        }
    };
    waitForBody();

    // [5] Маскировка возможных будущих переменных-детекторов
    const mask = (obj, prop, val) => {
        try {
            Object.defineProperty(obj, prop, {
                get: () => val,
                configurable: false
            });
        } catch (_) { }
    };
    ['adblockDetected', '__adblock', '_AdBlockInit'].forEach(name =>
        mask(window, name, false)
    );

    // [6] Блокировка записи "adblock"-ключей в localStorage
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        if (key.toLowerCase().includes('adblock')) return;
        return origSetItem.apply(this, arguments);
    };

    // [7] Отладка
    console.log('%c[YouTube Stealth AdBlock] Активирован', 'color: limegreen; font-weight: bold;');
})();
