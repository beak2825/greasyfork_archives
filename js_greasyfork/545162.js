// ==UserScript==
// @name         战雷涂装中文网禁用B站播放器自动播放（自用）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁止战雷涂装中文网（wtliker.com）页面上的哔哩哔哩播放器自动播放
// @author       Jinyou
// @license      MIT
// @match        *://wtliker.com/*
// @icon         https://wtliker.com/data/assets/logo/%E5%B0%8F%E5%9B%BE.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545162/%E6%88%98%E9%9B%B7%E6%B6%82%E8%A3%85%E4%B8%AD%E6%96%87%E7%BD%91%E7%A6%81%E7%94%A8B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545162/%E6%88%98%E9%9B%B7%E6%B6%82%E8%A3%85%E4%B8%AD%E6%96%87%E7%BD%91%E7%A6%81%E7%94%A8B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改B站播放器URL的函数
    function modifyBilibiliPlayer() {
        // 选择所有iframe元素
        const iframes = document.querySelectorAll('iframe');

        iframes.forEach(iframe => {
            // 检查是否是B站播放器
            if (iframe.src.includes('player.bilibili.com/player.html')) {
                // 解析URL参数
                const url = new URL(iframe.src);
                const params = new URLSearchParams(url.search);

                // 设置autoplay=false
                params.set('autoplay', 'false');

                // 更新URL参数
                url.search = params.toString();

                // 只有当URL实际改变时才更新src，避免不必要的重载
                if (iframe.src !== url.href) {
                    iframe.src = url.href;
                    console.log('已修改B站播放器参数:', url.href);
                }
            }
        });
    }

    // 初始执行
    modifyBilibiliPlayer();

    // 监听动态内容变化（针对SPA或异步加载的内容）
    const observer = new MutationObserver(modifyBilibiliPlayer);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();