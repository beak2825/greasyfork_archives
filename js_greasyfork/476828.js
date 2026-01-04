// ==UserScript==
// @name         圖片縮放腳本
// @namespace    http://your-namespace.com
// @version      1.1
// @description  點擊圖片進行縮放和還原
// @author       Your Name
// @match        https://www.wnacg.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476828/%E5%9C%96%E7%89%87%E7%B8%AE%E6%94%BE%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/476828/%E5%9C%96%E7%89%87%E7%B8%AE%E6%94%BE%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isZoomed = false; // 記錄是否已經縮小

    // 監聽滑鼠左鍵點擊事件
    document.addEventListener('click', function(event) {
        // 檢查是否點擊的是圖片
        if (event.target.tagName === 'IMG') {
            if (!isZoomed) {
                // 縮小整個頁面的所有圖片到50%
                var images = document.querySelectorAll('img');
                images.forEach(function(img) {
                    img.style.width = '50%';
                    img.style.height = 'auto';
                });
                isZoomed = true; // 設置為已縮小
            } else {
                // 還原所有圖片到原始大小
                var images = document.querySelectorAll('img');
                images.forEach(function(img) {
                    img.style.width = '';
                    img.style.height = '';
                });
                isZoomed = false; // 設置為未縮小
            }
        }
    });
})();