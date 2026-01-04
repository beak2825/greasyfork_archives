// ==UserScript==
// @name         豆包自动深色模式
// @namespace    http://tampermonkey.net/
// @version      2025-08-24
// @description  开启豆包网页版隐藏的深色模式，并跟随系统
// @author       alikia2x
// @match        https://*.doubao.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547094/%E8%B1%86%E5%8C%85%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/547094/%E8%B1%86%E5%8C%85%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detectColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function setDataTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    setInterval(() => setDataTheme(detectColorScheme()), 16);
})();