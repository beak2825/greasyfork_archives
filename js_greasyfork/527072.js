// ==UserScript==
// @name         樱花动漫去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除樱花动漫网站的广告
// @author       MJJ
// @match        *://*.iyinghua.com/*
// @match        *://*.yhdmtu.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527072/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/527072/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 需要移除的广告元素选择器
    const adSelectors = [
        '#fyZyrpleft',
        '#fyZyrpright', 
        '#HpaMNN',
        '.sido.r',
        'script[src*="sogowan.com"]',
        'script[src*="stgowan.com"]',
        'script[src*="baidu.com/hm.js"]',
        '#sYmApxleft',
        '#sYmApxright', 
        '#MsZriM',
        '#bdshare',
        'script[src*="bdimg.share.baidu.com"]',
        'script[src*="evewan.com"]',
        'iframe[frameborder="0"]',
        '.HMRichPlay',
        'divz',
        
        // 新增选择器
        '#wnhMXPleft',
        '#wnhMXPright',
        '.jjjjasdasd',
        'img[src*="sogowan.com"]',
        'a[href*="evewan.com"]'
    ];

    // 移除广告元素
    function removeAds() {
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeAds);

    // 创建一个观察器来处理动态加载的广告
    const observer = new MutationObserver(removeAds);
    
    // 开始观察 document.body 的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})(); 