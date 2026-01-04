// ==UserScript==
// @name         放大Nodeseek论坛字体
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  为任意网站（默认支持 Nodeseek, DeepFlood）提供独立的字体放大、开关和重置功能，优化阅读体验。
// @author       你的名字
// @match        https://www.nodeseek.com/*
// @match        https://www.deepflood.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/500789/%E6%94%BE%E5%A4%A7Nodeseek%E8%AE%BA%E5%9D%9B%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/500789/%E6%94%BE%E5%A4%A7Nodeseek%E8%AE%BA%E5%9D%9B%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const defaultScale = 1.5;

    // 根据域名生成独立的存储键
    const scaleKey = `fontScale_${hostname}`;
    const enabledKey = `fontEnabled_${hostname}`;

    let scale = GM_getValue(scaleKey, defaultScale);
    let isEnabled = GM_getValue(enabledKey, true);

    const styleElementId = 'custom-font-styler';

    // ----------------------------------------------------
    // 1. 字体放大目标
    // ----------------------------------------------------
    const elementsToEnlarge = [
        // Nodeseek
        '.post-title', '.post-content', '.reply-content', '.forum-title', '.post-author', '.forum-description',
        '.post-info',
        // DeepFlood & Common
        '.article-title', '.article-content', '.comment-content', 'h1', 'h2', 'p', 'article', '.prose'
    ];
    
    // ----------------------------------------------------
    // 2. 布局修复规则 (新增部分)
    // ----------------------------------------------------
    const layoutFixes = `
        .topic-carousel-wrapper,
        .topic-carousel-panel,
        .topic-carousel-item,
        .post-list-item {
            height: auto !important;
            min-height: fit-content !important;
        }
    `;

    // 动态更新或创建样式
    function applyStyles() {
        const existingStyleElement = document.getElementById(styleElementId);
        if (!isEnabled) {
            if (existingStyleElement) {
                existingStyleElement.remove();
            }
            return;
        }

        let styleContent = '';
        
        // 生成字体放大规则
        elementsToEnlarge.forEach(selector => {
            styleContent += `
                ${selector} {
                    font-size: ${scale}em !important;
                    line-height: 1.6em !important;
                }
            `;
        });
        
        // 添加布局修复规则
        styleContent += layoutFixes;
        
        if (existingStyleElement) {
            existingStyleElement.innerHTML = styleContent;
        } else {
            const styleEl = document.createElement('style');
            styleEl.id = styleElementId;
            styleEl.innerHTML = styleContent;
            document.head.appendChild(styleEl);
        }
    }

    // 更新菜单状态
    function registerCommands() {
        GM_registerMenuCommand(`${isEnabled ? '✅' : '❌'} 字体放大 (点击切换)`, () => {
            isEnabled = !isEnabled;
            GM_setValue(enabledKey, isEnabled);
            location.reload();
        });

        GM_registerMenuCommand(`设置字体放大倍率 (当前: ${scale}x)`, () => {
            let newScale = prompt(`为 ${hostname} 设置放大倍率 (例如 1.5):`, scale);
            if (newScale !== null) {
                newScale = parseFloat(newScale);
                if (!isNaN(newScale) && newScale > 0) {
                    GM_setValue(scaleKey, newScale);
                    location.reload();
                } else {
                    alert('请输入一个有效的正数倍率。');
                }
            }
        });

        GM_registerMenuCommand('恢复默认设置', () => {
            GM_setValue(scaleKey, defaultScale);
            GM_setValue(enabledKey, true);
            location.reload();
        });
    }

    // --- Main Execution ---
    registerCommands();
    if (isEnabled) {
        applyStyles();
    }
})();