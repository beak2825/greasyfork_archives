// ==UserScript==
// @name         控制台的神
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  移除网站对F12和Ctrl+Shift+C的屏蔽，方便抓取元素
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547683/%E6%8E%A7%E5%88%B6%E5%8F%B0%E7%9A%84%E7%A5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/547683/%E6%8E%A7%E5%88%B6%E5%8F%B0%E7%9A%84%E7%A5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Anti-DevTools Ultimate] Loaded');

    // -------------------- 1️⃣ 屏蔽常用按键、右键、复制粘贴 --------------------
    ['keydown','contextmenu','selectstart','copy','cut','paste'].forEach(evt => {
        window.addEventListener(evt, e => e.stopImmediatePropagation(), true);
        document.addEventListener(evt, e => e.stopImmediatePropagation(), true);
    });

    const block = () => {};
    Object.defineProperty(window, 'onkeydown', { set: block, get: () => null });
    Object.defineProperty(document, 'onkeydown', { set: block, get: () => null });

    // -------------------- 2️⃣ 阻止跳转和关闭 --------------------
    window.close = () => console.log('[Anti-DevTools] blocked window.close');
    window.history.back = () => console.log('[Anti-DevTools] blocked history.back');
    Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        get: () => window.location,
        set: val => console.log('[Anti-DevTools] blocked location.href:', val)
    });

    // -------------------- 3️⃣ 拦截外部 script 加载 --------------------
    const origCreateElement = document.createElement.bind(document);
    document.createElement = function(tagName, options) {
        const el = origCreateElement(tagName, options);
        if(tagName.toLowerCase() === 'script') {
            const origSetSrc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
            Object.defineProperty(el, 'src', {
                set: function(v) {
                    if(/devtool|disable/i.test(v)) {
                        console.log('[Anti-DevTools] blocked external script:', v);
                        return;
                    }
                    origSetSrc.call(this, v);
                },
                get: function() { return this.getAttribute('src'); },
                configurable: true
            });
        }
        return el;
    };

    // -------------------- 4️⃣ 拦截 inline script 执行 --------------------
    const origAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(child) {
        if(child.tagName === 'SCRIPT' && child.textContent) {
            if(/devtool|disable/i.test(child.textContent)) {
                console.log('[Anti-DevTools] blocked inline script');
                return child;
            }
        }
        return origAppendChild.call(this, child);
    };

    // -------------------- 5️⃣ 拦截定时器中的 DevTools 检测 --------------------
    const wrapTimer = (fn) => function(cb, ...args) {
        if(typeof cb === 'function' && /devtool|disable/i.test(cb.toString())) {
            console.log('[Anti-DevTools] blocked timer callback');
            return fn(() => {}, ...args);
        }
        return fn(cb, ...args);
    };
    window.setInterval = wrapTimer(window.setInterval);
    window.setTimeout = wrapTimer(window.setTimeout);
    window.requestAnimationFrame = wrapTimer(window.requestAnimationFrame);

    // -------------------- 6️⃣ 拦截 eval / Function 构造 --------------------
    const origEval = window.eval.bind(window);
    window.eval = function(code) {
        if(/devtool|disable/i.test(code)) {
            console.log('[Anti-DevTools] blocked eval code');
            return;
        }
        return origEval(code);
    };

    const origFunction = Function.bind(window.Function);
    window.Function = function(...args) {
        const code = args.join(' ');
        if(/devtool|disable/i.test(code)) {
            console.log('[Anti-DevTools] blocked Function constructor');
            return () => {};
        }
        return origFunction(...args);
    };

    // -------------------- 7️⃣ 自动解除 iframe 内部 DevTools 检测 --------------------
    const iframeObserver = new MutationObserver(mutations => {
        for(const m of mutations) {
            for(const node of m.addedNodes) {
                if(node.tagName === 'IFRAME') {
                    try {
                        const win = node.contentWindow;
                        if(win) {
                            ['close','onkeydown','eval','Function','setInterval','setTimeout'].forEach(fn => {
                                win[fn] = window[fn];
                            });
                        }
                    } catch(e) {}
                }
            }
        }
    });
    iframeObserver.observe(document.documentElement, { childList: true, subtree: true });

})();
