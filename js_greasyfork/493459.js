// ==UserScript==
// @version      1.3
// @name         嗨皮漫畫 - 圖片載入最佳化
// @name:zh-TW   嗨皮漫畫 - 圖片載入最佳化
// @name:zh-CN   嗨皮漫画 - 图片加载优化
// @name:en Happy Comics Optimization of image loading
// @namespace    https://www.youtube.com/c/ScottDoha
// @description  一次性載入所有圖片，並在載入失敗時無限重新載入
// @description:zh-cn 一次性加载所有图片，并在加载失败时无限重新加载
// @description:en Load all images at once, and reload indefinitely if loading fails.
// @author       Scott
// @match        *://m.happymh.com/reads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493459/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E5%9C%96%E7%89%87%E8%BC%89%E5%85%A5%E6%9C%80%E4%BD%B3%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493459/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E5%9C%96%E7%89%87%E8%BC%89%E5%85%A5%E6%9C%80%E4%BD%B3%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 獲取頁面中的所有圖片元素
    var images = document.querySelectorAll('img');

    // 載入圖片
    function loadImages() {
        images.forEach(function(image) {
            // 新增圖片載入失敗的監聽器，當載入失敗時重新載入圖片
            image.addEventListener('error', function() {
                this.src = this.src; // 重新載入圖片
            });

            // 載入圖片
            image.src = image.src;
        });
    }

    // 頁面載入完成後立即載入圖片
    window.addEventListener('load', loadImages);

    // 如果頁面內容是動態載入的，則可以使用 MutationObserver 來監聽內容變化並重新載入圖片
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                loadImages(); // 重新載入圖片
            }
        });
    });

    // 開始監聽頁面內容變化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();