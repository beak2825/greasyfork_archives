// ==UserScript==
// @name         爱壹帆播放器优化
// @namespace    https://github.com/justfunc/
// @version      1.0.0.3
// @description  爱壹帆播放器显示优化，去除侧边广告及全宽显示
// @author       justfunc
// @match        *://*.iyf.tv/*
// @match        *://*.yfsp.tv/*
// @match        *://*.wyav.tv/*
// @license      GPL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyf.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532047/%E7%88%B1%E5%A3%B9%E5%B8%86%E6%92%AD%E6%94%BE%E5%99%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532047/%E7%88%B1%E5%A3%B9%E5%B8%86%E6%92%AD%E6%94%BE%E5%99%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', () => {
        // 初始隐藏
        const hideDualClassDivs = () => {
            document.querySelectorAll('div.ps.pggf').forEach(div => {
                div.style.display = 'none';
            });
            document.querySelectorAll('div.page-container.video-player').forEach(div => {
                div.style.width = '100%';
                div.style.height= 'auto';
            });
            document.querySelectorAll('div.aa-videoplayer-wrap').forEach(div => {
                div.style.setProperty('height', 'auto','important');
            });
            document.querySelectorAll('div.video-box.ng-star-inserted').forEach(div => {
                div.style.height = 'auto';
            });
        };
        settimeout(()=>{
            hideDualClassDivs();
            // 监听后续动态变化
            // const observer = new MutationObserver(hideDualClassDivs);
            // observer.observe(document.body, {
            //     childList: true,
            //     subtree: true
            // });
        },100);
    });
})();