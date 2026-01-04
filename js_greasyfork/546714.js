// ==UserScript==
// @name         粉笔教师网页端-隐藏解析视频 (终极文字定位版)
// @name:en      Fenbi Teacher - Hide Analysis Video (Final Text-based)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  通过查找“解析视频”文字来定位并隐藏视频模块，不受网站代码更新影响，最稳定的版本。
// @author       TianChunGu
// @match        *://spa.fenbi.com/*
// @icon         https://www.fenbi.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546714/%E7%B2%89%E7%AC%94%E6%95%99%E5%B8%88%E7%BD%91%E9%A1%B5%E7%AB%AF-%E9%9A%90%E8%97%8F%E8%A7%A3%E6%9E%90%E8%A7%86%E9%A2%91%20%28%E7%BB%88%E6%9E%81%E6%96%87%E5%AD%97%E5%AE%9A%E4%BD%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546714/%E7%B2%89%E7%AC%94%E6%95%99%E5%B8%88%E7%BD%91%E9%A1%B5%E7%AB%AF-%E9%9A%90%E8%97%8F%E8%A7%A3%E6%9E%90%E8%A7%86%E9%A2%91%20%28%E7%BB%88%E6%9E%81%E6%96%87%E5%AD%97%E5%AE%9A%E4%BD%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('粉笔视频隐藏脚本 V1.5 (文字定位版): 已启动...');

    const hideVideoElementByText = () => {
        // 定义要查找的标题文字
        const targetText = "解析视频";

        // 查找所有可能的标题元素，比如 h3, h4, div, span 等
        const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, div, span, p');

        for (const element of allElements) {
            // 检查元素内的文本是否完全等于目标文本 (trim() 用于去除前后空格)
            if (element.textContent.trim() === targetText) {
                // 找到了包含“解析视频”的元素！
                // 现在，我们需要找到它的“外层大容器”并隐藏它。
                // 经过分析，这个容器通常是标题元素的父元素的父元素。
                // parentElement -> 父元素
                // parentElement.parentElement -> 祖父元素（通常是整个视频模块）
                let containerToHide = element.parentElement.parentElement;

                // 为了保险起见，再往上找一层也试一下，以防结构变化
                if (!containerToHide) continue; // 如果没有祖父元素，就跳过

                // 检查一下容器是不是太大了（比如整个页面），避免误伤
                if (containerToHide.clientHeight > 0 && containerToHide.clientHeight < 800) {
                     if (containerToHide.style.display !== 'none') {
                        console.log('粉笔视频隐藏脚本: 已通过文字定位找到并隐藏视频模块!', containerToHide);
                        containerToHide.style.display = 'none';
                        // 成功隐藏后就不用再继续查找了
                        return;
                    }
                }
            }
        }
    };

    // 使用 MutationObserver 持续监视页面内容变化
    const observer = new MutationObserver((mutations) => {
        // 每次页面变化都尝试执行隐藏函数
        hideVideoElementByText();
    });

    // 启动观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始加载时也执行一次
    hideVideoElementByText();
})();