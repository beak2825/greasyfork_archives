// ==UserScript==
// @name         sj自动切服务器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sj自动切服务器,默认FST
// @author       H
// @match        *://*.supjav.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524614/sj%E8%87%AA%E5%8A%A8%E5%88%87%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/524614/sj%E8%87%AA%E5%8A%A8%E5%88%87%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 延迟3秒
        setTimeout(function() {
            // 查找文字为FST的按钮
            var buttons = document.querySelectorAll('.btn-server');
            buttons.forEach(function(button) {
                if (button.textContent.trim() === 'FST') {
                    button.click();
                }
            });
        }, 1000); // 3000毫秒 = 3秒
    }, false);
})();
