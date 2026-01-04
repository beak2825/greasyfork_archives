// ==UserScript==
// @name         bilibili评论区图片快捷切换
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  滚动鼠标滚轮切换B站评论区图片，按住alt时停用滚轮切换。
// @author       coccvo
// @match        https://www.bilibili.com/video/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAG1BMVEUAoNb////5/f7q+PzI6/ek3vGA0Os7t+AXqtoAacFbAAAAi0lEQVR42o2R3QqDIQxDE/uX93/isVVB3GTfuYo9IDQFSZobF+sBkiNVzomXckxhBSzj72xT0NWm5wq28MgCUJk5QziJEYUvKgZC+IECBVQeFFAQ5DxwQQBkPDABU3iuPdJ3YdVbddiF+sMOT8TIbq7DJjjsM++wiYM/4rL5tatru9d79AUPwknwwgt7fAWIfqzpTgAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463662/bilibili%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/463662/bilibili%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 切换图片的函数
    function switchImage(direction) {
        const nextButton = document.querySelector('button.pswp__button.pswp__button--arrow--next');
        const prevButton = document.querySelector('button.pswp__button.pswp__button--arrow--prev');
        if (direction === 'next' && nextButton) {
            nextButton.click();
        } else if (direction === 'prev' && prevButton) {
            prevButton.click();
        }
    }

    // 滚轮事件监听
    document.addEventListener('wheel', function (event) {
        if (!event.altKey) {
            if (event.deltaY > 0) {
                switchImage('next');
            } else {
                switchImage('prev');
            }
        }
    });
})();