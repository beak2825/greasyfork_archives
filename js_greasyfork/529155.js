// ==UserScript==
// @name         91微信编辑器
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  跨维度打击广告元素，实现零帧渲染级清除
// @author       凇月落https://space.bilibili.com/450579890/lists?sid=253523
// @match        http://bj.91join.com/
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529155/91%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529155/91%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetId = 'float_div_1';

    // ======== 第一阶段：预加载CSS核打击 ========
    GM_addStyle(`
        ${CSS.escape(targetId)} {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: static !important;
            left: auto !important;
            top: auto !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            pointer-events: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `);

    // ======== 第二阶段：元素创建拦截 ========
    const origCreateElement = unsafeWindow.Document.prototype.createElement;
    unsafeWindow.Document.prototype.createElement = function(tagName, options) {
        const element = origCreateElement.call(this, tagName, options);
        if (element.id === targetId) {
            console.log('[拦截] 元素创建请求已被阻止');
            element.setAttribute('data-destroyed', 'true');
            return document.createDocumentFragment(); // 返回无意义节点
        }
        return element;
    };

    // ======== 第三阶段：DOM注入监控 ========
    let observerCount = 0;
    const superObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 深度扫描所有新增节点
            const scanNodes = nodes => {
                nodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.id === targetId) {
                        console.log('[捕获] 发现潜伏广告节点');
                        node.parentNode.removeChild(node);
                        return;
                    }
                    if (node.querySelector) {
                        const targets = node.querySelectorAll(`#${targetId}`);
                        targets.forEach(target => target.remove());
                    }
                    scanNodes(node.childNodes);
                });
            };
            scanNodes(mutation.addedNodes);
        });
        // 自动清理机制
        if (observerCount++ > 1000) superObserver.disconnect();
    });

    superObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // ======== 第四阶段：定时清道夫 ========
    const nuke = () => {
        const el = document.getElementById(targetId);
        if (el) {
            console.log('[终焉] 执行最终清除');
            el.parentNode.removeChild(el);
            clearInterval(nukeTimer);
        }
    };
    const nukeTimer = setInterval(nuke, 50);

    // ======== 第五阶段：防御性代码 ========
    window.addEventListener('DOMContentLoaded', () => {
        // 锁定广告容器尺寸
        const container = document.getElementById(targetId);
        if (container) {
            container.style.cssText = 'display:none !important; height:0 !important;';
        }
        // 防止复活定时器
        const origSetInterval = unsafeWindow.setInterval;
        unsafeWindow.setInterval = function(fn, delay) {
            if (delay < 200) { // 拦截高频定时器
                const fnStr = fn.toString();
                if (fnStr.includes(targetId) || fnStr.includes('float_div')) {
                    console.log('[拦截] 可疑定时器已被终止');
                    return { ref: null };
                }
            }
            return origSetInterval.apply(this, arguments);
        };
    });

    // 清理残余样式
    window.addEventListener('load', () => {
        superObserver.disconnect();
        clearInterval(nukeTimer);
    });
    // 在原有脚本基础上增加以下代码：

// ===== 量子加密选择器防御 =====
const targetSelector = CSS.escape(targetId);
const cryptoSelector = btoa(targetId).replace(/=/g, '');

// 防御混淆选择器攻击
document.querySelectorAll(`[id="${targetId}"], [id*="${cryptoSelector}"]`).forEach(el => {
    el.remove();
});

// ===== 跨维度打击 (处理Shadow DOM) =====
function digShadowRoot(root) {
    root.querySelectorAll('*').forEach(node => {
        if (node.shadowRoot) {
            digShadowRoot(node.shadowRoot);
            if (node.shadowRoot.getElementById(targetId)) {
                node.shadowRoot.getElementById(targetId).remove();
            }
        }
    });
}
setInterval(() => digShadowRoot(document.documentElement), 300);

// ===== 时空裂缝防御 (阻止requestAnimationFrame动画) =====
const origRAF = unsafeWindow.requestAnimationFrame;
unsafeWindow.requestAnimationFrame = function(callback) {
    const wrapped = () => {
        try {
            const str = callback.toString();
            if (str.includes(targetId) || /float_div/.test(str)) {
                console.log('[时空拦截] 动画帧已被终止');
                return; // 粉碎动画
            }
        } catch(e) {}
        return callback.apply(this, arguments);
    };
    return origRAF(wrapped);
};

// ===== 反侦察系统 =====
Object.defineProperty(unsafeWindow, 'MutationObserver', {
    value: function(callback) {
        const wrapped = (mutations, observer) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.id === targetId) {
                        node.remove();
                    }
                });
            });
            return callback(mutations, observer);
        };
        return new MutationObserver(wrapped);
    },
    configurable: false,
    writable: false
});

})();