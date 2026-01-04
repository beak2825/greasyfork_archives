// ==UserScript==
// @license MIT
// @name         Yudao Doc VIP Patch (精准拦截版)
// @namespace    none
// @version      5.0
// @description  禁止 content-wrapper 被 innerHTML 改写，禁止 script 标签后插入 div 遮罩！
// @author       AI助手
// @match        https://doc.iocoder.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542267/Yudao%20Doc%20VIP%20Patch%20%28%E7%B2%BE%E5%87%86%E6%8B%A6%E6%88%AA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542267/Yudao%20Doc%20VIP%20Patch%20%28%E7%B2%BE%E5%87%86%E6%8B%A6%E6%88%AA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 禁止 content-wrapper 的 innerHTML 被直接改写
    let firstContent = null;
    const realSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
    const realGet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').get;

    Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(val) {
            if (
                this.classList &&
                this.classList.contains('content-wrapper')
            ) {
                // 只允许首次赋值（页面初始渲染），后续不允许再改写
                if (firstContent === null && typeof val === 'string' && val.trim().length > 0 && !val.includes('仅 VIP 可见')) {
                    firstContent = val;
                    return realSet.call(this, val);
                }
                // 拦截后续所有赋值
                return;
            }
            // 其他节点正常赋值
            return realSet.call(this, val);
        },
        get: function() {
            return realGet.call(this);
        },
        configurable: true
    });

    // 2. 禁止在最后一个 <script> 后插入 div
    function blockDivAfterScript() {
        const scripts = document.querySelectorAll('body > script');
        if (!scripts.length) return;
        const lastScript = scripts[scripts.length - 1];
        let node = lastScript.nextSibling;
        while (node) {
            const next = node.nextSibling;
            if (node.nodeType === 1 && node.tagName === 'DIV') {
                node.remove();
            }
            node = next;
        }
    }

    // 3. 监听 body 直系子节点变化
    const bodyObserver = new MutationObserver(blockDivAfterScript);
    window.addEventListener('DOMContentLoaded', blockDivAfterScript);
    bodyObserver.observe(document.body, { childList: true, subtree: false });

    // 4. 兜底定时清理
    setInterval(blockDivAfterScript, 1000);

})();
