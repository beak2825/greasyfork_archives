// ==UserScript==
// @name         天津市专业技术人员继续教育视频自动播放到下一节
// @namespace    http://tampermonkey.net/
// @author       有问题联系q:2430486030
// @license MIT
// @version      0.1
// @description  自动点击播放下一节视频
// @match        *://*.chinahrt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511946/%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%88%B0%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/511946/%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%88%B0%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置定时器一直检测，每10s检测一次
    setInterval(() => {
        const nextButton = document.querySelector('[data-title="点击播放"]');
        if (nextButton && nextButton.style.display !== "none") {
            // 获取 nextButton 的父元素
            const parentElement = nextButton.parentElement;
            
            // 在父元素中查找 canvas 标签
            const canvas = parentElement.querySelector('canvas');
            
            if (canvas) {
                canvas.click();
                console.log("自动点击了下一节按钮的 canvas");
            } else {
                console.log("未找到 canvas 元素");
            }
        }
    }, 10000);
})();