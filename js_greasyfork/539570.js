// ==UserScript==
// @name         Auto Click Download For Annas-archive
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto Click Download For Annas-archive YA
// @author       You
// @match        https://*.annas-archive.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=annas-archive.org
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539570/Auto%20Click%20Download%20For%20Annas-archive.user.js
// @updateURL https://update.greasyfork.org/scripts/539570/Auto%20Click%20Download%20For%20Annas-archive.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 自動點擊下載按鈕
    const watcher = setInterval(() => {
        const downloadBtn = document.querySelector('.text-xl a[href]');
        if (downloadBtn) {
            clearInterval(watcher);
            downloadBtn.click();
            console.log("download book");
        }else{
        }
    }, 1000);
    // ...existing code...
})();