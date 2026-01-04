// ==UserScript==
// @name         禁止网页更改标题栏颜色
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  强制PWA标题栏颜色，强制保持指定颜色
// @author       hiisme
// @match        https://www.icloud.com/photos/
// @match        https://www.xiaohongshu.com/*
// @match        https://chatglm.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/504923/%E7%A6%81%E6%AD%A2%E7%BD%91%E9%A1%B5%E6%9B%B4%E6%94%B9%E6%A0%87%E9%A2%98%E6%A0%8F%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/504923/%E7%A6%81%E6%AD%A2%E7%BD%91%E9%A1%B5%E6%9B%B4%E6%94%B9%E6%A0%87%E9%A2%98%E6%A0%8F%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置不同网站的颜色
    const colorConfig = {
        'icloud.com': '#121212',
        'xiaohongshu.com': '#0A0A0A',
        'chatglm.cn': '#2B2E30',
    };

    // 获取当前网站的颜色配置
    function getColorForCurrentSite() {
        const hostname = window.location.hostname;
        for (const [site, color] of Object.entries(colorConfig)) {
            if (hostname.includes(site)) {
                return color;
            }
        }
        return '#121212'; // 默认颜色
    }

    // 设置或恢复标题栏颜色
    function enforceTitleBarColor() {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        const color = getColorForCurrentSite();
        if (meta.content !== color) {
            meta.content = color;
        }
    }

    // 禁止对 theme-color 的不必要更改
    function blockThemeColorChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'content') {
                    let target = mutation.target;
                    if (target.getAttribute('name') === 'theme-color') {
                        const color = getColorForCurrentSite();
                        if (target.content !== color) {
                            target.content = color; // 强制恢复颜色
                        }
                    }
                }
            });
        });

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            observer.observe(meta, { attributes: true });
        }
        enforceTitleBarColor(); // 初次设置颜色
    }

    // 防止网页动态创建或修改 theme-color 元素
    function interceptHeadModifications() {
        const originalAppendChild = HTMLElement.prototype.appendChild;
        HTMLElement.prototype.appendChild = function(element) {
            if (element.tagName === 'META' && element.name === 'theme-color') {
                element.content = getColorForCurrentSite(); // 根据网站设置颜色
            }
            return originalAppendChild.call(this, element);
        };
    }

    // 在页面加载前就开始拦截和观察
    interceptHeadModifications();
    document.addEventListener('DOMContentLoaded', blockThemeColorChanges);
})();
