// ==UserScript==
// @name         weibo-一些小优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使鼠标点击可穿透弹出的气泡（比如收藏提示）；始终显示评论回复区点赞
// @author       Y_jun
// @match        https://weibo.com/*
// @match        https://s.weibo.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496969/weibo-%E4%B8%80%E4%BA%9B%E5%B0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/496969/weibo-%E4%B8%80%E4%BA%9B%E5%B0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    setInterval(() => {
        const boxes = document.querySelectorAll('.woo-modal-wrap');
        for (const box of boxes) {
            const toast = box.querySelector('.woo-toast-main');
            if (toast && box.style.pointerEvents !== 'none') {
                box.style.pointerEvents = 'none';
            }
        }
    }, 10);

    setInterval(() => {
        const likeList = document.querySelectorAll('.woo-like-main');
        for (const like of likeList) {
            if (like && like.parentElement) {
                like.style.opacity = '1';
                like.parentElement.style.opacity = '1';
            }
        }
    }, 10);
})();