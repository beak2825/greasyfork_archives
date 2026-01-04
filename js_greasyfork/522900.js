// ==UserScript==
// @name         NodeSeek灯笼特效
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在NodeSeek网站添加新年灯笼特效
// @author       Your name
// @match        https://www.nodeseek.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522900/NodeSeek%E7%81%AF%E7%AC%BC%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/522900/NodeSeek%E7%81%AF%E7%AC%BC%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建script元素
    const script = document.createElement('script');
    script.src = 'https://api.vvhan.com/api/script/denglong';
    
    // 添加加载成功的处理
    script.onload = function() {
        console.log('灯笼特效加载成功！');
    };
    
    // 添加加载失败的处理
    script.onerror = function() {
        console.error('灯笼特效加载失败！');
    };
    
    // 将script标签添加到页面
    document.body.appendChild(script);
    
    // 添加必要的CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .denglong-container {
            position: fixed !important;
            z-index: 9999 !important;
        }
    `;
    document.head.appendChild(style);
})(); 