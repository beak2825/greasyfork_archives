// ==UserScript==
// @name         UpToDate URL Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify UpToDate URL to include zh-Hans before page load
// @match        https://www.uptodate.com/contents/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508349/UpToDate%20URL%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/508349/UpToDate%20URL%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改当前页面URL
    function modifyCurrentURL() {
        let currentURL = window.location.href;
        if (!currentURL.includes('/zh-Hans/')) {
            let newURL = currentURL.replace('/contents/', '/contents/zh-Hans/');
            window.location.replace(newURL);
        }
    }

    // 在页面加载之前执行
    modifyCurrentURL();
})();