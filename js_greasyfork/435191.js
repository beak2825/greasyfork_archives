// ==UserScript==
// @name         微信自动跳转链接
// @namespace    https://gitee.com/huelse/wx-tool-jump
// @version      0.1
// @description  自动跳转到微信屏蔽的链接！
// @author       THENDINGs
// @include      *://weixin110.qq.com/*
// @match        *://weixin110.qq.com/*
// @icon         https://mp.weixin.qq.com/favicon.ico
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/435191/%E5%BE%AE%E4%BF%A1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/435191/%E5%BE%AE%E4%BF%A1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = document.querySelector('.weui-msg__desc').innerText;
    document.querySelector('.weui-msg__title').innerText = '跳转中...';
    setTimeout(() => {
        window.location.href = url
    }, 1000);
})();
