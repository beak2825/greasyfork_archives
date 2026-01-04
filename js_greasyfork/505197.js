// ==UserScript==
// @name         删除洛谷个人主页图片
// @namespace    http://tampermonkey.net/
// @version      remove.intro
// @description  删除洛谷个人主页图片。
// @match        https://www.luogu.com.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505197/%E5%88%A0%E9%99%A4%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/505197/%E5%88%A0%E9%99%A4%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const currentUser = window.location.pathname.split('/').pop();
        if (currentUser == '682739') { // 请自定义
            const introductionElement = document.querySelector('div.introduction.marked[data-v-e5ad98f0][data-v-fe28b16c][data-v-f9624136]');
            if (introductionElement) {
                const images = introductionElement.querySelectorAll('img');
                images.forEach(img => img.remove());
            }
        }
    }, 100);
})();
