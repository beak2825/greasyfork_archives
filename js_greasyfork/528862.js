// ==UserScript==
// @name         检测特定URL1428
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  当当前 URL 为指定 URL 时，在控制台打印消息
// @author       脚大江山稳
// @match        *://*/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/528862/%E6%A3%80%E6%B5%8B%E7%89%B9%E5%AE%9AURL1428.user.js
// @updateURL https://update.greasyfork.org/scripts/528862/%E6%A3%80%E6%B5%8B%E7%89%B9%E5%AE%9AURL1428.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetUrl = 'APP_Z82AEPBKQ1064V6QHJEO';
    console.log(window.location.href);
    function checkUrl() {
        if (window.location.href.includes (targetUrl)) {
             console.log(window.location.href);
            console.log('检测到了');
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.vc-text.fn-hide { display: inherit !important; }';
            document.head.appendChild(style);
        }
    }

    checkUrl();
})();