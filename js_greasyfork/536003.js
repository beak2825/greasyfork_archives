// ==UserScript==
// @name         Discord Auto Join Button Clicker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击Discord加入按钮
// @author       You
// @match        https://discord.com/channels/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536003/Discord%20Auto%20Join%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/536003/Discord%20Auto%20Join%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 尝试查找并点击加入按钮
        function clickJoinButton() {
            const joinButton = document.querySelector('button.joinButton__5aa3a');
            if (joinButton) {
                console.log('找到加入按钮，正在点击...');
                joinButton.click();
            } else {
                console.log('未找到加入按钮，将在1秒后重试...');
                setTimeout(clickJoinButton, 1000);
            }
        }

        // 初始尝试
        clickJoinButton();
    });
})();