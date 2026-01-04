// ==UserScript==
// @name         百度谷歌自动翻页
// @description  手机版，移动版，简单搜索，谷歌搜索结果页面自动加载更多内容，自动点击"加载更多"按钮
// @author       psychosisspy
// @version      1.7
// @match        https://m.baidu.com/*
// @match        https://www.baidu.com/*
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @exclude      https://*.baidu.com/video/
// @run-at        document-end
// @grant         none
// @namespace https://greasyfork.org/users/842064
// @downloadURL https://update.greasyfork.org/scripts/543658/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/543658/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const url = window.location.href;
    let lastY = 0;
    
    // 百度逻辑
    if (url.includes('baidu.com')) {
        if (!url.includes('word=') && !url.includes('wd=')) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY <= lastY) return; // 只向下滚动
            
            if (window.scrollY + window.innerHeight > document.body.offsetHeight - 600) {
                document.querySelector('div.se-infiniteload-text')?.click();
            }
            lastY = window.scrollY;
        }, { passive: true });
    }
    
    // 谷歌逻辑
    else if (url.includes('google.com')) {
        if (!url.includes('search') || !url.includes('q=')) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY <= lastY) return;
            
            if (window.scrollY + window.innerHeight > document.body.offsetHeight - 800) {
                document.querySelector('[aria-label="更多搜索结果"]')?.click();
            }
            lastY = window.scrollY;
        }, { passive: true });
    }
    
})();