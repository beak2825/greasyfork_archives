// ==UserScript==
// @name         DuckDuckGo标签页标题修改
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  强制将 DuckDuckGo 主页的标签页标题更改为“New Tab”
// @author       Richard Tyson
// @license      MIT
// @match        https://start.duckduckgo.com/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509825/DuckDuckGo%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/509825/DuckDuckGo%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 尽早设置标题
    document.title = "New Tab";

    // 使用 requestAnimationFrame 持续检查和设置标题
    const ensureTitle = () => {
        if (document.title !== "New Tab") {
            document.title = "New Tab";
        }
        // 使用 requestAnimationFrame 持续进行下一次检查
        requestAnimationFrame(ensureTitle);
    };

    // 在页面加载时立即开始持续检查
    ensureTitle();

    // 使用 MutationObserver 监控并强制设置标题
    const observer = new MutationObserver(() => {
        if (document.title !== "New Tab") {
            document.title = "New Tab";
        }
    });

    // 观察 head 节点的子节点变化
    observer.observe(document.head, { childList: true, subtree: true });

})();
