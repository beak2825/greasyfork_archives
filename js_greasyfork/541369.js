// ==UserScript==
// @name         Twitch Betterment
// @namespace    Twitch Betterment
// @version      1.0
// @description  Отключение автоматического понижения качества видео и автоматическое начисление очков Twitch.
// @author       Maesta_Nequitia
// @match        *://*.twitch.tv/*
// @grant        none
// @run-at       document-start
// @icon         https://www.twitch.tv/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541369/Twitch%20Betterment.user.js
// @updateURL https://update.greasyfork.org/scripts/541369/Twitch%20Betterment.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const setHiddenProperties = () => ['hidden', 'mozHidden', 'webkitHidden', 'visibilityState', 'webkitVisibilityState']
        .forEach(prop => Object.defineProperty(document, prop, { value: false, writable: false }));

    const disableAutomaticDownscale = () => {
        setHiddenProperties();
        document.dispatchEvent(new Event('visibilitychange'));
        document.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
        localStorage.setItem('s-qs-ts', Math.floor(Date.now()));
        localStorage.setItem('video-quality', '{"default":"chunked"}');
    };

    const clickBonus = () => {
        const bonusIcon = document.querySelector(".claimable-bonus__icon");
        bonusIcon && (console.log("[AutoClick] Bonus claimed!"), bonusIcon.click());
    };

    const startAutoClicker = () => setInterval(clickBonus, Math.random() * 1870 + 7600);

    disableAutomaticDownscale();
    startAutoClicker();
})();
