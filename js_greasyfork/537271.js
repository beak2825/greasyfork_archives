// ==UserScript==
// @name         Force _self for links
// @namespace    http://tampermonkey.net/
// @version      2025-05-26
// @description  Force all links to open in the same tab (_self), including static and dynamically created ones
// @author       https://github.com/Hojondo
// @match        *://*.douban.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.sspai.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537271/Force%20_self%20for%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/537271/Force%20_self%20for%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. 强制设置现有的 <a target="_blank"> 改为 "_self"
    function fixAllLinks() {
        const links = document.querySelectorAll('a[target="_blank"]');
        for (const link of links) {
            link.setAttribute('target', '_self');
        }
    }

    // --- 2. 使用 MutationObserver 动态监听新增 <a> 标签
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                if (node.tagName === 'A') {
                    if (node.getAttribute('target') === '_blank') {
                        node.setAttribute('target', '_self');
                    }
                }

                // 遍历其子节点
                const links = node.querySelectorAll?.('a[target="_blank"]') || [];
                for (const link of links) {
                    link.setAttribute('target', '_self');
                }
            }
        }
    });

    // 页面加载后开始观察 DOM 变化
    window.addEventListener('DOMContentLoaded', () => {
        fixAllLinks();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // --- 3. hook DOM API：拦截 setAttribute 操作
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (
            this.tagName === 'A' &&
            name === 'target' &&
            value === '_blank'
        ) {
            value = '_self';
        }
        return originalSetAttribute.call(this, name, value);
    };

    // --- 4. hook DOM property：拦截 .target = '_blank'
    Object.defineProperty(HTMLAnchorElement.prototype, 'target', {
        set(value) {
            if (value === '_blank') {
                value = '_self';
            }
            this.setAttribute('target', value);
        },
        get() {
            return this.getAttribute('target');
        },
        configurable: true
    });
    // --- 5. 拦截 window.open 强制使用 _self
    const originalOpen = window.open;
    window.open = function (url, target, features) {
        if (target === '_blank' || !target) {
            console.log('🔒 拦截 window.open，强制 _self:', url);
            return location.assign(url); // 强制当前页跳转
        }
        return originalOpen.call(window, url, target, features);
    };
})();
