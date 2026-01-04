// ==UserScript==
// @name         屏蔽果核剥壳广告提示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽www.ghxi.com网站底部广告被屏蔽提示
// @author       实用脚本
// @match        *://www.ghxi.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533671/%E5%B1%8F%E8%94%BD%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%B9%BF%E5%91%8A%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/533671/%E5%B1%8F%E8%94%BD%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%B9%BF%E5%91%8A%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 方法1：CSS隐藏法（立即生效）
    const style = document.createElement('style');
    style.textContent = `
        div[style*="position: fixed;bottom: 0"][style*="background-color: #cc4444"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 方法2：DOM拦截法（防止动态加载）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.style && 
                    node.style.cssText.includes('position: fixed') && 
                    node.style.cssText.includes('bottom: 0') &&
                    node.style.cssText.includes('background-color: #cc4444')) {
                    node.remove();
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 方法3：定时检查（兜底方案）
    setInterval(() => {
        document.querySelectorAll('div[style*="position: fixed;bottom: 0"]').forEach(div => {
            if (div.style.cssText.includes('background-color: #cc4444')) {
                div.remove();
            }
        });
    }, 2000);
})();