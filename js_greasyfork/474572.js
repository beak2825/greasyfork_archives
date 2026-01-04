// ==UserScript==
// @name         过滤 Bilibili 广告
// @namespace    wjfz
// @version      0.0.1
// @author       wjfz
// @description  过滤哔哩哔哩广告
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/474572/%E8%BF%87%E6%BB%A4%20Bilibili%20%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/474572/%E8%BF%87%E6%BB%A4%20Bilibili%20%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const x = (...data) => {
        console.log(...data)
    }

    const processAd = (node) => {
        // 判断链接是不是广告
        if (node.classList.contains("ad-report") || node.href.includes('cm.bilibili.com')) {
            x('移除广告', node)
            node.style = 'display:none';
        }
    };

    const observeAndInject = async () => {
        const rightContainerInner = document.querySelector(".right-container-inner");
        const leftContainerUnderPlayer = document.querySelector(".left-container-under-player");

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type !== "childList") {
                    continue;
                }

                mutation.addedNodes.forEach((node) => {
                    if (node.href) {
                        x('---', node)
                        processAd(node)
                    }
                });
            }
        });

        observer.observe(rightContainerInner, {childList: true, subtree: false});
        observer.observe(leftContainerUnderPlayer, {childList: true, subtree: false});
    };

    // 异步加载数据的监听器
    observeAndInject();

    document.querySelector("#slide_ad").style = 'display:none';
})();
