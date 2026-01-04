// ==UserScript==
// @name         Hide Bilibili Download Client Button
// @namespace    http://tampermonkey.net/
// @version      2025-04-04
// @description  隐藏B站下载客户端按钮和其他指定元素
// @author       xiaoyi
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531801/Hide%20Bilibili%20Download%20Client%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531801/Hide%20Bilibili%20Download%20Client%20Button.meta.js
// ==/UserScript==



(function() {
    'use strict';
    // 使用 MutationObserver 确保能处理动态加载的元素
    function startObserver() {
        const observer = new MutationObserver((mutations, obs) => {
            // 执行清理操作
            cleanElements();
            // 检查是否所有目标元素都已处理
            const leftEntryUl = document.querySelector('ul.left-entry');
            const targetElement = document.querySelector('li.v-popover-wrap.left-loc-entry');
            // 如果已经完成所有清理，可以选择停止观察
            if (leftEntryUl && leftEntryUl.querySelectorAll('li').length === 1 && !targetElement) {
                console.log('所有清理任务已完成，停止观察');
                obs.disconnect();
            }
        });
    }

    // 在不同的页面加载阶段尝试执行清理
    // 如果 DOM 已加载完成，立即执行清理
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        cleanElements();
        startObserver();
    } else {
        // 否则等待 DOMContentLoaded 事件
        document.addEventListener('DOMContentLoaded', function() {
            cleanElements();
            startObserver();
        });
    }
    // 在 window.load 事件后再次尝试执行清理
    window.addEventListener('load', cleanElements);
    // 为了处理可能的延迟加载，设置一个延时执行
    setTimeout(cleanElements, 2000);

    /***
        css 样式修改
    ***/
    // 创建一个样式元素
    const styleElement = document.createElement('style');
    // 定义CSS样式
    styleElement.textContent = `
        /* 需求1: 设置搜索框宽度为634px,高度为50px */
        .bili-header .center-search-container .center-search__bar #nav-searchform {
            width: 634px !important;
            height: 50px !important;
        }
        /* 需求2: 设置搜索输入框字体大小为18px */
        .bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input {
            font-size: 18px !important;
        }
        /* 需求3: 将搜索按钮的margin属性替换为margin-top:8px */
        .bili-header .center-search-container .center-search__bar .nav-search-btn {
            margin: 0 !important;
            margin-top: 8px !important;
        }
    `;
    // 将样式元素添加到文档头部
    document.head.appendChild(styleElement);
    // 如果页面元素是动态加载的，可以添加一个观察器来确保样式应用
    const observer = new MutationObserver(function(mutations) {
        if (document.querySelector('.bili-header')) {
            // 再次应用样式以确保覆盖
            document.head.appendChild(styleElement);
            observer.disconnect(); // 找到元素后停止观察
        }
    });

})();