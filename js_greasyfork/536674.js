// ==UserScript==
// @name         基本情报允许copy。
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 FE-siken 的 fekakomon.php 页面彻底解除复制/选中/右键屏蔽
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536674/%E5%9F%BA%E6%9C%AC%E6%83%85%E6%8A%A5%E5%85%81%E8%AE%B8copy%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/536674/%E5%9F%BA%E6%9C%AC%E6%83%85%E6%8A%A5%E5%85%81%E8%AE%B8copy%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // —— 1. 拦截后续对这些事件的 addEventListener ——
    const BLOCKED = ['copy','cut','paste','selectstart','contextmenu','dragstart'];
    const _origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (BLOCKED.includes(type)) {
            return;
        }
        return _origAdd.call(this, type, listener, options);
    };

    // —— 2. 拦截 inline style.setProperty 对 user-select / pointer-events / touch-callout 的修改 ——
    const _origSet = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(prop, value, priority) {
        if (/user-select|pointer-events|touch-callout/i.test(prop)) {
            value = prop === 'pointer-events' ? 'auto' : 'text';
            priority = 'important';
        }
        return _origSet.call(this, prop, value, priority);
    };

    // —— 3. 注入最高级别的全局 CSS ——
    function injectCSS(){
        const s = document.createElement('style');
        s.textContent = `
            html * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                -webkit-touch-callout: text !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(s);
    }

    // —— 4. 清理所有元素的 inline on* 属性 和 style 中的屏蔽规则 ——
    function cleanAll(){
        document.querySelectorAll('*').forEach(el => {
            // 清除 oncopy/onselectstart/... 属性
            BLOCKED.forEach(evt => {
                const attr = 'on' + evt;
                if (el.hasAttribute(attr)) el.removeAttribute(attr);
                el[attr] = null;
            });
            // 清理 style="" 里的屏蔽指令
            if (el.hasAttribute('style')) {
                const orig = el.getAttribute('style');
                const cleaned = orig
                    .replace(/(?:user-select|pointer-events|touch-callout)\s*:\s*[^;]+;?/gi, '');
                if (cleaned !== orig) el.setAttribute('style', cleaned);
            }
        });
    }

    // —— 5. 在 DOMContentLoaded 后启动：注入 CSS、首次清理，并用 Observer 持续清理 ——
    function onReady() {
        injectCSS();
        cleanAll();
        const obs = new MutationObserver(() => cleanAll());
        obs.observe(document.documentElement, {
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'oncopy','oncut','onpaste','onselectstart','oncontextmenu','draggable']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady, { once: true });
    } else {
        onReady();
    }
})();
