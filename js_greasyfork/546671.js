// ==UserScript==
// @name         YouTube Premium 弹窗移除 (SPA优化)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在每次页面加载或导航后，延迟移除YouTube Premium弹窗。
// @author       JHC000abc@gmail.com
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546671/YouTube%20Premium%20%E5%BC%B9%E7%AA%97%E7%A7%BB%E9%99%A4%20%28SPA%E4%BC%98%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546671/YouTube%20Premium%20%E5%BC%B9%E7%AA%97%E7%A7%BB%E9%99%A4%20%28SPA%E4%BC%98%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义页面加载完成多久后执行
    const wait_times = 0.1;

    // 清除弹窗的函数
    function removePopup() {
        const popup = document.querySelector('tp-yt-paper-dialog.style-scope.ytd-popup-container');
        const backdrop = document.querySelector('ytd-popup-container');

        if (popup) {
            popup.remove();
            console.log('YouTube Premium弹窗已成功移除。');
        }
        if (backdrop) {
            backdrop.remove();
            console.log('弹窗背景遮罩已移除。');
        }
    }

    // 启动移除逻辑的函数，带延迟
    let removalTimeout;
    function startRemovalLogic() {
        // 先清除之前的定时器，防止重复执行
        clearTimeout(removalTimeout);

        console.log(`页面已加载完成，等待 ${wait_times} 秒后执行脚本...`);
        removalTimeout = setTimeout(() => {
            removePopup();
            // 使用MutationObserver作为备用方案，捕获在延迟后出现的弹窗。
            const observer = new MutationObserver(() => {
                removePopup();
            });
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
        }, wait_times * 1000);
    }

    // 监听 URL 变化，重新执行逻辑
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        startRemovalLogic();
      }
    }).observe(document, {subtree: true, childList: true});

    // 页面首次加载时执行
    window.addEventListener('load', startRemovalLogic);

})();