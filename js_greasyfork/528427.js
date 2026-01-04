// ==UserScript==
// @name         东软学习平台显示控制进度条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 neustudydl.neumooc.com 网站上显示进度控制元素
// @author       mxgxxx
// @match        http://neustudydl.neumooc.com/*
// @match        https://neustudydl.neumooc.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528427/%E4%B8%9C%E8%BD%AF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528427/%E4%B8%9C%E8%BD%AF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function showProgressControl() {
        const elements = document.querySelectorAll('.d-control-progress');
        
        if (elements && elements.length > 0) {
            elements.forEach(el => {
                el.style.display = 'block';
            });
        } else {
            setTimeout(showProgressControl, 1000);
        }
    }
    
    window.addEventListener('load', showProgressControl);
    
    showProgressControl();
    
})();