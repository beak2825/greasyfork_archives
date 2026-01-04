// ==UserScript==
// @name         Bangumi 域名快捷切换
// @version      1.3
// @description  Alt+1 切到 bgm.tv，Alt+2 切到 bangumi.tv，Alt+3 切到 chii.in
// @author       zintop
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/zh-CN/users/1386262-zintop
// @downloadURL https://update.greasyfork.org/scripts/538688/Bangumi%20%E5%9F%9F%E5%90%8D%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/538688/Bangumi%20%E5%9F%9F%E5%90%8D%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (!e.altKey) return;

        const currentPath = window.location.pathname + window.location.search + window.location.hash;

        if (e.code === 'Digit1') {
            window.location.href = 'https://bgm.tv' + currentPath;
        } else if (e.code === 'Digit2') {
            window.location.href = 'https://bangumi.tv' + currentPath;
        } else if (e.code === 'Digit3') {
            window.location.href = 'https://chii.in' + currentPath;
        }
    });
})();
