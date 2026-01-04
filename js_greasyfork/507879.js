
// ==UserScript==
// @name         publink-arxiv-light
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  light arxiv
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507879/publink-arxiv-light.user.js
// @updateURL https://update.greasyfork.org/scripts/507879/publink-arxiv-light.meta.js
// ==/UserScript==

(function() {
    'use strict';

       function changeTheme() {
            const htmlElement = document.documentElement; // 获取 <html> 元素
            htmlElement.setAttribute('data-theme', 'light');
            console.log(`Theme changed to: ${htmlElement.getAttribute('data-theme')}`);
        }

         // 检查当前 URL 是否为 labs.arxiv.org
        if (window.location.href.includes('labs.arxiv.org')) {
            // 立即执行一次
            changeTheme();

            // 1秒后执行一次
            setTimeout(changeTheme, 1000);

            // 3秒后执行一次
            setTimeout(changeTheme, 3000);

            // 5秒后执行一次
            setTimeout(changeTheme, 5000);
        } else {
            console.log('This script only runs on labs.arxiv.org');
        }



})();