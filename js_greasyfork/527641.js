// ==UserScript==
// @license MIT
// @name        1080p Viewport Scale
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description Forces 1080p through viewport scaling
// @downloadURL https://update.greasyfork.org/scripts/527641/1080p%20Viewport%20Scale.user.js
// @updateURL https://update.greasyfork.org/scripts/527641/1080p%20Viewport%20Scale.meta.js
// ==/UserScript==

(function() {
    function setViewport() {
        const scale = window.innerWidth / 1080;
        const meta = document.querySelector('meta[name="viewport"]') || document.createElement('meta');
        meta.name = 'viewport';
        meta.content = `width=1080, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=${scale}`;
        if (!meta.parentNode) document.head.appendChild(meta);
    }

    // Встановлюємо фіксовану ширину
    document.documentElement.style.width = '1080px';
    document.body.style.width = '1080px';
    
    // Оновлюємо при зміні розміру вікна
    window.addEventListener('resize', setViewport);
    // Встановлюємо початкове значення
    setViewport();
})();