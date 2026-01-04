// ==UserScript==
// @name          去除‘App内打开’蓝色悬浮按钮
// @namespace     https://juejin.cn/
// @description   自动去除页面中“App内打开”的蓝色悬浮按钮
// @include       *://*juejin.cn*
// @version       1.0.1
// @run-at        document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/544671/%E5%8E%BB%E9%99%A4%E2%80%98App%E5%86%85%E6%89%93%E5%BC%80%E2%80%99%E8%93%9D%E8%89%B2%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/544671/%E5%8E%BB%E9%99%A4%E2%80%98App%E5%86%85%E6%89%93%E5%BC%80%E2%80%99%E8%93%9D%E8%89%B2%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    console.log("去除`App内打开`蓝色悬浮按钮");
    // 监听页面加载完成后操作
    const observer = new MutationObserver(() => {
        const btn = document.querySelector('[class*="open-button app-open-button"]');
        if (btn) {
            btn.remove();
            console.log("已移除蓝色悬浮按钮");
            observer.disconnect(); // 停止观察
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
