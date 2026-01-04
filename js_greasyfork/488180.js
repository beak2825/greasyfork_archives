// ==UserScript==
// @name         LunarCrush
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  帮助你更好的使用lunarcrush，笑傲江湖DAO万岁！！
// @author       JAGU
// @match        https://lunarcrush.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lunarcrush.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488180/LunarCrush.user.js
// @updateURL https://update.greasyfork.org/scripts/488180/LunarCrush.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const observer = new MutationObserver(mutationsList => {
        const navWrapDesktop = document.getElementById('lunar-nav-wrap-desktop');
        if (navWrapDesktop) {
            navWrapDesktop.style.position = 'initial';
        }
        const navWrapDesktop2 = document.getElementById('lunar-nav-wrap');
        if (navWrapDesktop2) {
            navWrapDesktop2.style.position = 'initial';
        }
        const targetElement = document.querySelector('div[data-testid="hideMetrics"]');
        if (targetElement) {
            targetElement.style.display = 'none';
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();