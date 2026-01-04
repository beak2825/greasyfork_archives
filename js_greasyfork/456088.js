// ==UserScript==
// @name         恢复彩色网页
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  将因特殊原因变灰的网页恢复到彩色。
// @author       Distors
// @match        https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/456088/%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/456088/%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
        window.addEventListener('load', e => document.querySelectorAll('html,body').forEach(el => { el.style.filter = 'none'; el.classList.remove('big-event-gray')}));
})();