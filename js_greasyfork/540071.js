// ==UserScript==
// @name          替换_top为_blank
// @namespace     https://example.com/
// @description   将全站所有的_top替换为_blank
// @match         *://*/*
// @version       1.0.4
// @run-at        document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/540071/%E6%9B%BF%E6%8D%A2_top%E4%B8%BA_blank.user.js
// @updateURL https://update.greasyfork.org/scripts/540071/%E6%9B%BF%E6%8D%A2_top%E4%B8%BA_blank.meta.js
// ==/UserScript==


(function inject() {
    console.log("替换_top为_blank脚本已注入");
    function replaceTopTargets() {
        console.log("[replaceTopTargets]")
        document.querySelectorAll('a[target="_top"]').forEach(el => {
            el.setAttribute('target', '_blank');
        });
    }

    function setupObserver() {
        console.log("[setupObserver]")
        const observer = new MutationObserver(replaceTopTargets);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function safeInit() {
        // 初始处理
        replaceTopTargets();
        setupObserver();
    }

    // 页面状态判断
    if (document.readyState === 'loading') {
        //多个脚本同时注册 document.addEventListener('DOMContentLoaded', ...) 是完全安全的，它们都会被调用，彼此互不干扰。
        document.addEventListener('DOMContentLoaded', safeInit);

        // ⏱ 超时保护机制：最多等 5 秒就执行
        setTimeout(() => {
            if (document.body) {
                safeInit();
            }
        }, 5000);
    } else {
        // DOM 已构建，无需等待
        safeInit();
    }
})();