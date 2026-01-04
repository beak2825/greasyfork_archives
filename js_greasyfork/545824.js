// ==UserScript==
// @name         bilibili移除B站直播播放器遮罩
// @namespace    https://bilibili.com/
// @version      1.0
// @description  删除B站直播页面中的遮罩元素
// @author       YourName
// @match        *://live.bilibili.com/*
// @grant        none
// @run-at       document-end
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545824/bilibili%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%92%AD%E6%94%BE%E5%99%A8%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/545824/bilibili%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%92%AD%E6%94%BE%E5%99%A8%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetId = 'web-player-module-area-mask-panel';

    // 主删除函数
    function removeMask() {
        const mask = document.getElementById(targetId);
        if (mask) {
            mask.remove();
            console.log(`[B站遮罩移除] 成功删除元素: ${targetId}`);
            return true;
        }
        return false;
    }

    // 创建观察器监听DOM变化
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && removeMask()) {
                observer.disconnect();
                return;
            }
        }
    });

    // 配置并启动观察器
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始尝试移除
    if (removeMask()) {
        observer.disconnect();
    }

    // 5秒后自动停止监听（防止长期占用资源）
    setTimeout(() => {
        observer.disconnect();
        console.log('[B站遮罩移除] 5秒后停止监听');
    }, 5000);
})();