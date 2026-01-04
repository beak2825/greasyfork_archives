// ==UserScript==
// @name         删除b站元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于删除网页版烦人的分享按钮以及其他的按钮
// @author       Magpie_yb
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bilibili.com/bangumi/play/ep*
// @match        *://www.bilibili.com/bangumi/play/ss*
// @match        *://www.bilibili.com/cheese/play/ep*
// @match        *://www.bilibili.com/cheese/play/ss*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473899/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/473899/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要查找的元素选择器
    const targetSelectors = ['.video-toolbar-right','.video-share-wrap '];

    function checkTargets() {
        const foundTargets = []; // 找到的目标元素数组
        // 检查每个目标元素是否已添加到DOM中
        targetSelectors.forEach(selector => {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                foundTargets.push(targetElement);
                // 可根据需要执行特定的操作
                // ...
            }
        })

        if (foundTargets.length > 0) {
            // 在这里执行元素加载后的操作
            for(let i = 0;i<foundTargets.length;i++){
                foundTargets[i].style.display = 'none'
            }
            observer.disconnect(); // 停止观察
        }
    }

    function observerCallback(mutationsList, observer) {
        checkTargets();

        // 判断是否已经找到匹配的目标元素
        const foundAllTargets = targetSelectors.every(selector => document.querySelector(selector));
        if (foundAllTargets) {
            observer.disconnect(); // 停止观察
        }
    }

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(observerCallback);

    // 开始观察根元素或选择器匹配的元素
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 检查初始状态下目标元素是否已存在
    checkTargets();
})();
