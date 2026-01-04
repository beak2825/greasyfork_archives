// ==UserScript==
// @name         通用阻止页面跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阻止 window.location, document.location, window.open 等跳转行为
// @author       wheyu
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547438/%E9%80%9A%E7%94%A8%E9%98%BB%E6%AD%A2%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/547438/%E9%80%9A%E7%94%A8%E9%98%BB%E6%AD%A2%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============== 1. 阻止 window.location 和 document.location 修改 ===============
    // 保存原始的 location 对象
    const originalLocation = window.location;

    // 定义一个不可变的 location 代理
    const frozenLocation = new Proxy(originalLocation, {
        set: function(target, property, value) {
            if (['href', 'assign', 'replace', 'reload'].includes(property)) {
                console.warn(`[Anti-Redirect] 阻止了 location.${property} 操作:`, value);
                return true; // 拦截赋值，不执行
            }
            return Reflect.set(...arguments);
        },
        get: function(target, property) {
            // 允许读取，但对 assign/replace/reload 返回一个空函数
            if (['assign', 'replace', 'reload'].includes(property)) {
                return function() {
                    console.warn(`[Anti-Redirect] 阻止了 location.${property}() 调用`);
                };
            }
            return Reflect.get(...arguments);
        }
    });

    // 使用 Object.defineProperty 永久替换 window.location
    // 注意：这需要在 document-start 时执行，否则可能失败
    try {
        Object.defineProperty(window, 'location', {
            value: frozenLocation,
            writable: false,
            configurable: false // 关键：防止被再次修改
        });
        console.log('[Anti-Redirect] window.location 已成功冻结');
    } catch (e) {
        console.warn('[Anti-Redirect] 无法冻结 window.location:', e);
        // 如果失败，尝试更激进的劫持
        ['href', 'assign', 'replace'].forEach(prop => {
            Object.defineProperty(window.location.__proto__, prop, {
                set: function() { console.warn(`[Anti-Redirect] 检测到 location.${prop} 设置`); },
                get: function() {
                    return function() { console.warn(`[Anti-Redirect] 阻止 location.${prop} 调用`); };
                }
            });
        });
    }

    // =============== 2. 阻止 window.open (弹窗/新窗口跳转) ===============
    const originalOpen = window.open;
    window.open = function(url, name, features) {
        console.warn('[Anti-Redirect] 阻止了 window.open:', url, name, features);
        // 可以选择返回一个假的 window 对象，或直接返回 null
        return null;
    };
    console.log('[Anti-Redirect] window.open 已被劫持');

    // =============== 3. 阻止 <meta http-equiv="refresh"> (需要 document-start) ===============
    // 监听 DOM 变化，移除或修改 meta refresh 标签
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.tagName === 'META' &&
                            node.hasAttribute('http-equiv') &&
                            node.getAttribute('http-equiv').toLowerCase() === 'refresh') {
                            console.warn('[Anti-Redirect] 检测到 meta refresh 标签:', node);
                            node.remove(); // 直接移除
                            // 或者修改 content: node.setAttribute('content', '0; url=#');
                        }
                    }
                });
            }
        });
    });

    // 开始观察 <head> 的变化
    observer.observe(document.head || document.documentElement, {
        childList: true,
        subtree: true
    });
    console.log('[Anti-Redirect] MutationObserver 已启动，监控 meta refresh');

    // =============== 4. 阻止 form 提交跳转 (可选) ===============
    // 如果 form 提交导致跳转，可以拦截
    document.addEventListener('submit', function(e) {
        console.warn('[Anti-Redirect] 阻止表单提交:', e.target);
        e.preventDefault();
    }, true); // 使用捕获阶段

    // =============== 5. 阻止 a 标签的默认跳转 (谨慎使用) ===============
    // 这会破坏正常的链接点击，仅在必要时启用
    /*
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.href) {
            console.warn('[Anti-Redirect] 阻止链接点击:', e.target.href);
            e.preventDefault();
        }
    }, true);
    */

    // =============== 6. 处理 history.pushState / replaceState (高级) ===============
    // 某些 SPA 应用通过 history API 模拟跳转
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        console.warn('[Anti-Redirect] 拦截 pushState:', url);
        return originalPushState.apply(this, arguments);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(state, title, url) {
        console.warn('[Anti-Redirect] 拦截 replaceState:', url);
        return originalReplaceState.apply(this, arguments);
    };

})();