// ==UserScript==
// @name         52pojie自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动在52pojie论坛进行每日签到
// @match        https://www.52pojie.cn/*
// @grant        yagizaMJ
// @license      yagizaMJ
// @downloadURL https://update.greasyfork.org/scripts/511474/52pojie%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/511474/52pojie%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找签到链接
        const signLink = document.querySelector('a[href^="home.php?mod=task&do=apply&id=2"]');
 
        if (signLink) {
            // 如果找到签到链接，模拟点击
            signLink.click();
            console.log('自动签到成功!');
        } else {
            console.log('未找到签到链接，可能已经签到过了或页面结构发生变化。');
        }
    });
})();