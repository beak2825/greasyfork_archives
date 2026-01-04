// ==UserScript==
// @name         应对去广告检测
// @version      0.0.3
// @description  针对哔哩轻小说检测屏蔽广告的脚本
// @author       Y_C_Z
// @match        https://www.linovelib.com/*
// @match        https://www.bilinovel.com/*
// @grant    unsafeWindow
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1335970
// @downloadURL https://update.greasyfork.org/scripts/527737/%E5%BA%94%E5%AF%B9%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527737/%E5%BA%94%E5%AF%B9%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
(function() {
    // 拦截目标脚本的 URL
    const targetScriptURL = 'tip_chapter.js';

    // 重写 fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (typeof input === 'string' && input.includes(targetScriptURL)) {
            console.log('拦截 fetch 请求:', input);
            return Promise.reject(new Error('请求被拦截'));
        }
        return originalFetch.call(this, input, init);
    };

    // 重写 XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes(targetScriptURL)) {
            console.log('拦截 XMLHttpRequest 请求:', url);
            this.abort(); // 中止请求
            return;
        }
        originalXHROpen.apply(this, arguments);
    };

    // 监控动态加载的脚本
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT' && node.src.includes(targetScriptURL)) {
                    node.remove(); // 移除匹配的脚本
                    console.log('拦截动态加载的脚本:', node.src);
                }
            });
        });
    });

    // 开始监控 document 的子节点变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();