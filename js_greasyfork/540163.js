// ==UserScript==
// @name         禁漫天堂方向键快捷键翻页 ←上一页 →下一页 
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  zh-CN 禁漫天堂使用翻页模式下可以用左右方向键快捷键翻页
// @match        https://18comic.vip/photo/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540163/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E6%96%B9%E5%90%91%E9%94%AE%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%BF%BB%E9%A1%B5%20%E2%86%90%E4%B8%8A%E4%B8%80%E9%A1%B5%20%E2%86%92%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/540163/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E6%96%B9%E5%90%91%E9%94%AE%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%BF%BB%E9%A1%B5%20%E2%86%90%E4%B8%8A%E4%B8%80%E9%A1%B5%20%E2%86%92%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.querySelectorAll('.photo_center_div').forEach(el => el.remove());
    document.addEventListener('keydown', function (e) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;

        if (e.key === 'ArrowRight') {
            document.querySelector('.read-next')?.click();
        } else if (e.key === 'ArrowLeft') {
            document.querySelector('.read-prev')?.click();
        }
    });
})();
