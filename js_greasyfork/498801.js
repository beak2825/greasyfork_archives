// ==UserScript==
// @name         kemono點擊圖片放大功能
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在特定網站上點擊所有帖子中的縮略圖以打開其原始圖片。
// @author       hitenlxy
// @license      MIT
// @match        https://kemono.party/*
// @match        https://kemono.su/*
// @match        https://coomer.party/*
// @match        https://coomer.su/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498801/kemono%E9%BB%9E%E6%93%8A%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498801/kemono%E9%BB%9E%E6%93%8A%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var thumbnails = document.querySelectorAll('.post__files .post__thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
        var imageLink = thumbnails[i].querySelector('a.fileThumb.image-link');
        var thumbnailImage = imageLink.querySelector('img');
        thumbnailImage.click();
    }
})();
