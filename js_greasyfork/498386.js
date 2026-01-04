// ==UserScript==
// @name         移除Gelbooru-Pools里的缩略图模糊效果
// @name:zh-TW   移除Gelbooru-Pools裡的縮圖模糊效果
// @name:en      Remove Blurred Thumbnail Effect in Gelbooru Pools
// @name:ja      Gelbooru Pools のぼかしサムネイル効果を削除する
// @name:ko      Gelbooru Pools의 흐림 효과 썸네일 제거
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除Gelbooru pools 中缩略图的模糊效果。
// @description:zh-TW 移除Gelbooru pools 中縮圖的模糊效果。
// @description:en  Remove the blurry effect from thumbnail images in Gelbooru pools.
// @description:ja  Gelbooru pools のサムネイル画像からぼかし効果を取り除く。
// @description:ko  Gelbooru pools의 썸네일 이미지에서 흐린 효과를 제거합니다.
// @author       Rxinns&ChatGPT
// @match        https://gelbooru.com/index.php?page=pool*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498386/%E7%A7%BB%E9%99%A4Gelbooru-Pools%E9%87%8C%E7%9A%84%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/498386/%E7%A7%BB%E9%99%A4Gelbooru-Pools%E9%87%8C%E7%9A%84%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取所有带有 style="filter: blur(30px)" 的图片元素
    const blurImages = document.querySelectorAll('img[style*="filter: blur(30px)"]');
    
    // 移除这些图片元素
    blurImages.forEach(image => {
        image.remove();
    });
})();