// ==UserScript==
// @name         komica修改上傳檔案大小限制為10MB
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動將 MAX_FILE_SIZE 改為更大數值（例如 1GB）
// @author       chatgpt
// @match        https://*.komica1.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538787/komica%E4%BF%AE%E6%94%B9%E4%B8%8A%E5%82%B3%E6%AA%94%E6%A1%88%E5%A4%A7%E5%B0%8F%E9%99%90%E5%88%B6%E7%82%BA10MB.user.js
// @updateURL https://update.greasyfork.org/scripts/538787/komica%E4%BF%AE%E6%94%B9%E4%B8%8A%E5%82%B3%E6%AA%94%E6%A1%88%E5%A4%A7%E5%B0%8F%E9%99%90%E5%88%B6%E7%82%BA10MB.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const newLimit = 1024 * 1024 * 1024; // 1GB

    function updateMaxFileSize() {
        const el = document.querySelector('input[name="MAX_FILE_SIZE"]');
        if (el) {
            el.value = newLimit;
            console.log(`[Tampermonkey] 已將 MAX_FILE_SIZE 改為 ${newLimit} bytes`);
        }
    }

    // 初始執行一次
    updateMaxFileSize();

    // 偵測 DOM 是否動態載入，有新節點就重新修改
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                updateMaxFileSize();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();