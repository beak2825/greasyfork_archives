// ==UserScript==
// @name         B站提示屏蔽
// @namespace    ikaikail@ikaikail.com
// @version      1.0
// @description  是否被b站烦人的顶部提示惹恼？这款插件可以自动帮您屏蔽b站顶部提示！
// @author       iKaiKail
// @match        *://www.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @include	   	 *://www.bilibili.com/**
// @include      *://search.bilibili.com/**
// @include      *://space.bilibili.com/**
// @include      *://www.bilibili.com/read/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535525/B%E7%AB%99%E6%8F%90%E7%A4%BA%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/535525/B%E7%AB%99%E6%8F%90%E7%A4%BA%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

// == 强化版（带循环检测和容错机制）==
(function() {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 300;

    const clicker = setInterval(() => {
        const closeBtn = document.querySelector('img[alt="close"]');
        
        if (closeBtn) {
            closeBtn.click();
            clearInterval(clicker);
            console.log('成功关闭提示');
        }

        if (++attempts >= maxAttempts) {
            clearInterval(clicker);
            console.log('未找到关闭按钮');
        }
    }, interval);
})();