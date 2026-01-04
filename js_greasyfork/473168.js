// ==UserScript==
// @name         过滤哔哩哔哩推荐广告
// @namespace    wjfz
// @version      0.0.4
// @author       wjfz
// @description  过滤 B 站推荐数据中插入的广告
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/?spm_id_from*
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/473168/%E8%BF%87%E6%BB%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/473168/%E8%BF%87%E6%BB%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const x = (...data) => {
        return;
        console.log(...data)
    }

    const processAd = (node) => {
        const a = node.querySelector("a");
        if (!a) {
            console.log("Can not detect link");
            return;
        }

        // 判断链接是不是广告
        if (!a.href.includes("/video/")) {
            if (node.children.length == 1) {
                // 最新的广告结构没有骨架屏，只能直接展示白框
                node.children[0].className = 'bili-video-card__skeleton hide';
            } else {
                // 直接删除节点会留下一个白框，所以展示骨架屏
                node.children[0].className = 'bili-video-card__skeleton';
                node.children[1].style = 'display:none';
            }
        }
    };

    const isRecommendItem = (el) => el instanceof HTMLDivElement && el.className.includes("is-rcmd");
    const isFeedCardItem = (el) => el instanceof HTMLDivElement && el.className.includes("feed-card");
    const isSingleCardItem = (el) => el instanceof HTMLDivElement && el.className.includes("floor-single-card");

    const observeAndInjectComments = async () => {
        const targetNode = document.querySelector(".is-version8");

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type !== "childList") {
                    continue;
                }

                mutation.addedNodes.forEach((node) => {
                    if (isFeedCardItem(node)) {
                        // 右上角的刷新按钮刷出来节点包了一层div
                        node.querySelectorAll(".is-rcmd").forEach((node) => {
                            processAd(node);
                        });
                    } else if (isRecommendItem(node)) {
                        // 新版瀑布滚动加载
                        processAd(node);
                    } else if (isSingleCardItem(node)) {
                        //
                        //node.style = 'display:none';
                    }
                });
            }
        });

        observer.observe(targetNode, {childList: true, subtree: false});
    };

    document.querySelector(".is-version8").querySelectorAll(".is-rcmd").forEach((node) => {
        // 首次进入页面是直接渲染好的节点
        processAd(node);
    });

    // 异步加载数据的监听器
    observeAndInjectComments().then(r => x("observeAndInjectComments", r));
})();