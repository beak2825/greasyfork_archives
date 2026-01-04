// ==UserScript==
// @name         知乎完美深色模式
// @namespace    https://zhihu.com/
// @version      2.1
// @description  无闪烁、防重置、支持特殊页面
// @match        *://*.zhihu.com/*
// @run-at       document-start
// @grant        none
// @author       TeacherLi07
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540387/%E7%9F%A5%E4%B9%8E%E5%AE%8C%E7%BE%8E%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/540387/%E7%9F%A5%E4%B9%8E%E5%AE%8C%E7%BE%8E%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 跳过特殊页面
    const allowList = [
        'link.zhihu.com',
        'video.zhihu.com',
        'www.zhihu.com/pub/book',
        'www.zhihu.com/tardis'
    ];
    if(allowList.some(d => location.host.includes(d))) return;
    
    // 核心修复函数
    const forceDarkMode = () => {
        // 1. 清理所有可能干扰的URL参数
        const url = new URL(location.href);
        url.searchParams.delete('theme'); // 移除所有theme参数
        url.searchParams.set('theme', 'dark'); // 强制设置为dark
        history.replaceState(null, '', url.toString());
        
        // 2. 深度存储覆盖
        const darkKeys = [
            'ztheme', 'ztheme_auto', 
            'ZHUANLAN-ARTICLE-THEME', 'ZHIHU_THEME',
            'ZHUANLAN-THEME', 'zhihu-theme'
        ];
        darkKeys.forEach(k => localStorage.setItem(k, 'dark'));
        localStorage.setItem('ztheme_auto', 'false');
        
        // 3. 抢占式DOM修改
        if(document.documentElement) {
            document.documentElement.classList.add('Theme-dark');
            document.documentElement.classList.remove('Theme-light');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    };
    
    // 初始执行
    forceDarkMode();
    
    // 持续防护
    const createProtection = () => {
        // 定时修复存储
        setInterval(() => {
            localStorage.setItem('ztheme', 'dark');
            localStorage.setItem('ztheme_auto', 'false');
        }, 5000);
        
        // DOM变化监控
        new MutationObserver(mutations => {
            mutations.forEach(m => {
                if(m.target === document.documentElement) {
                    forceDarkMode();
                }
            });
        }).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });
    };
    
    // 执行时机控制
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createProtection);
    } else {
        createProtection();
    }
})();