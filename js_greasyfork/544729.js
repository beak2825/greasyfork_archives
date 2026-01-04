// ==UserScript==
// @name         Rutube - Block Autoplay
// @name:ru      Rutube - Блокировка автовоспроизведения
// @namespace    rutube-block-autoplay
// @version      1.0
// @description  Blocks video autoplay on Rutube and in embed players by freezing the player's autoplay behavior.
// @description:ru     Блокирует автозапуск видео на сайте Rutube и во встроенных плеерах через заморозку автозапуска плеера.
// @author       Vikindor (https://vikindor.github.io/)
// @homepageURL  https://github.com/Vikindor/rutube-block-autoplay
// @supportURL   https://github.com/Vikindor/rutube-block-autoplay/issues
// @license      MIT
// @match        https://rutube.ru/video/*
// @match        https://rutube.ru/play/embed/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544729/Rutube%20-%20Block%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/544729/Rutube%20-%20Block%20Autoplay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const video = document.querySelector('video');
        if (video) {
            video.pause();
            video.autoplay = false;
            video.removeAttribute('autoplay');

            const originalPlay = video.play;
            let firstCall = true;

            video.play = function (...args) {
                if (firstCall) {
                    firstCall = false;
                    return Promise.reject('Autoplay prevented');
                }
                return originalPlay.apply(this, args);
            };

            obs.disconnect();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
