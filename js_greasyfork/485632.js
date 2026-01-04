// ==UserScript==
// @name         Github 部分链接新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Github 项目链接和文档中的链接新标签页打开
// @author       Brayden
// @license      AGPL-3.0-or-later
// @icon         data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAUtJREFUSEvdll9ugkAQxudbPEBLewB9kKSnkJ5EfKQeQj2E8IicRD2FCTyUA7SkByg7zYbQQFzQjRHS7iMM+5tv/gLq4aAHBg0LeQ5Tt2BagXhspJYR58vpuv5NqxI7SNno8satvMt9Z1E90kKetonHQNQO4ax8hxaVnOVvzuQmiMT3RJC1Ioand2RoiB0mkSDELHncFa6blNhB8g6mjQpBzxDOCHSox15SsbGk5bKgWSMnTG5ZDB050SkB86IQRQPy5b9kD+HprLLAowikQIYQXfX81Zyca/k/SlQxSGBeJll3rkg8BDLJtL/LgKxK+HPp7FT3t8+mbrwAvX7409+yb0zhxyDdg+lY7QO1U9SIMVGkekr1Ues+sbfpmsBzYsSgapx3I1Ro617rrBtKVBcLOfIYNLt6I4IO9QV1EWISFhPbYX8kTDy9ZPsD3MfqGtJfu9YAAAAASUVORK5CYII=
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485632/Github%20%E9%83%A8%E5%88%86%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/485632/Github%20%E9%83%A8%E5%88%86%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 选择器以匹配您想要修改的a标签
    const selector = 'div.d-inline-block.mb-1 a, div.d-flex.width-full.flex-items-center a, div.Box-sc-g0xbh4-0.bBwPjs.search-title a, .markdown-body a';

    // 打开新标签页的函数
    function setOpenInNewTab() {
        let externalLinks = document.querySelectorAll(selector);
        externalLinks = Array.from(externalLinks).filter(link => !link.getAttribute('href').startsWith('#'));
        externalLinks.forEach(function (link) {
            if (link.target !== '_blank') {
                link.target = '_blank';
                console.log(link.href);
            }
        });
    }

    // 监听DOM变化的函数
    function observePageChanges() {
        var observer = new MutationObserver(mutations => {
            setOpenInNewTab();
        });
        var config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    // 初始化
    setOpenInNewTab();
    observePageChanges();
})();
