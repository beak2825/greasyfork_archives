// ==UserScript==
// @name         Dcard弹窗及暗化修复
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修复移除弹窗后页面仍然变暗的问题
// @author       YourName
// @match        *://www.dcard.tw/*
// @match        *://*.dcard.tw/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528853/Dcard%E5%BC%B9%E7%AA%97%E5%8F%8A%E6%9A%97%E5%8C%96%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/528853/Dcard%E5%BC%B9%E7%AA%97%E5%8F%8A%E6%9A%97%E5%8C%96%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预定义需要监控的样式属性
    const DARK_FILTERS = ['brightness', 'contrast', 'backdrop-filter'];
    const OBSERVER_CONFIG = { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    };

    // 强制恢复亮度的函数
    const restoreBrightness = () => {
        // 处理根元素样式
        [document.documentElement, document.body].forEach(element => {
            element.style.filter = 'none !important';
            element.style.backdropFilter = 'none !important';
            element.style.overflow = 'auto !important';
        });

        // 处理所有可能包含滤镜的容器
        document.querySelectorAll('div, section').forEach(element => {
            if(DARK_FILTERS.some(filter => element.style.filter.includes(filter))) {
                element.style.filter = 'none';
            }
        });
    };

    // 增强版弹窗移除
    const superRemove = () => {
        // 移除遮罩层相关元素
        document.querySelectorAll([
            '[class*="overlay"]',
            '[class*="Backdrop"]', 
            '[class*="Modal"]',
            '[class*="mask"]'
        ].join(',')).forEach(el => el.remove());

        // 强制恢复页面样式
        restoreBrightness();
    };

    // 动态样式注入
    GM_addStyle(`
        body, html {
            filter: none !important;
            backdrop-filter: none !important;
            overflow: auto !important;
        }
        
        [class*="Modal"], 
        [class*="Backdrop"] {
            display: none !important;
            opacity: 0 !important;
        }
    `);

    // 创建观察者
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
                restoreBrightness();
            }
            superRemove();
        });
    });

    // 启动观察
    observer.observe(document, OBSERVER_CONFIG);
    document.addEventListener('DOMContentLoaded', superRemove);
    document.addEventListener('scroll', restoreBrightness);
    
    // 主动防御机制
    const activeGuard = () => {
        restoreBrightness();
        superRemove();
        document.removeEventListener('click', restoreBrightness);
        document.addEventListener('click', restoreBrightness);
    };
    
    setInterval(activeGuard, 1500);
    window.addEventListener('load', activeGuard);
})();
