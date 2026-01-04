// ==UserScript==
// @name         Discord 隐藏掉屏蔽别人后的提醒
// @description  移除 Discord 页面中屏蔽后别人信息的提醒 Remove the notification of blocked messages from others on the Discord page
// @version      1.0
// @author       Zola
// @match        https://discord.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/789414
// @downloadURL https://update.greasyfork.org/scripts/539251/Discord%20%E9%9A%90%E8%97%8F%E6%8E%89%E5%B1%8F%E8%94%BD%E5%88%AB%E4%BA%BA%E5%90%8E%E7%9A%84%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/539251/Discord%20%E9%9A%90%E8%97%8F%E6%8E%89%E5%B1%8F%E8%94%BD%E5%88%AB%E4%BA%BA%E5%90%8E%E7%9A%84%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断元素类名是否包含指定前缀
    function hasClassPrefix(el, prefix) {
        if (!el.classList) return false;
        for (const c of el.classList) {
            if (c.startsWith(prefix)) return true;
        }
        return false;
    }

    // 判断元素内部是否包含某个类名前缀的子元素
    function containsChildWithClassPrefix(el, prefix) {
        const children = el.querySelectorAll('*');
        for (const child of children) {
            if (hasClassPrefix(child, prefix)) return true;
        }
        return false;
    }

    // 主函数，查找并移除目标元素
    function removeTargetElements() {
        // 选择所有 class 属性包含 groupStart__ 的 div
        const candidates = document.querySelectorAll('div[class*="groupStart__"]');
        for (const el of candidates) {
            if (containsChildWithClassPrefix(el, 'blockedMessageText__')) {
                el.remove();
                // 如果需要调试可取消注释
                // console.log('Removed element:', el);
            }
        }
    }

    // 初始运行一次
    removeTargetElements();

    // 监听 DOM 变化，动态处理新增元素
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                removeTargetElements();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
