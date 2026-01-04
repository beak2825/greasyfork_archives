// ==UserScript==
// @name         X (Twitter) Bookmark Scroll Position Keeper
// @name:zh-CN   X (推特) 书签滚动位置保持器
// @namespace    http://tampermonkey.net/
// @author       Roy WU
// @version      0.4
// @description  Fixes automatic scroll to top after clicking on a bookmarked post in X (formerly Twitter) Bookmarks page
// @description:zh-CN 修复X(前Twitter)书签页面点击书签后自动滚动到顶部的问题，保持滚动位置
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502313/X%20%28Twitter%29%20Bookmark%20Scroll%20Position%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/502313/X%20%28Twitter%29%20Bookmark%20Scroll%20Position%20Keeper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let posY = 0;
    let isBookmarksPage = false;
    
    // 检查当前是否在书签页面
    function checkIfBookmarksPage() {
        isBookmarksPage = window.location.pathname.includes('/i/bookmarks');
        console.log('Is bookmarks page:', isBookmarksPage);
    }
    
    // 监听滚动事件
    function handleScroll() {
        if (!isBookmarksPage) return;
        
        const scrollPosition = window.scrollY;
        
        if (window.scrollY === 0) {
            console.log("back to zero!");
            window.scrollTo(0, posY);
        } else {
            posY = scrollPosition;
        }
        
        console.log(scrollPosition);
    }
    
    // 初始化
    function init() {
        checkIfBookmarksPage();
        window.addEventListener('scroll', handleScroll);
    }
    
    // 监听 URL 变化
    function observeUrlChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (location.href !== mutation._oldURL) {
                    checkIfBookmarksPage();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 启动监听
    init();
    observeUrlChanges();
    
    // 使用 history API 的监听作为后备方案
    window.addEventListener('popstate', checkIfBookmarksPage);
    window.addEventListener('pushstate', checkIfBookmarksPage);
    window.addEventListener('replacestate', checkIfBookmarksPage);
})();
