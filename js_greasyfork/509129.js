// ==UserScript==
// @name         BiliFold - 收起动态评论
// @namespace    https://github.com/F-park/BiliFold
// @version      0.1.1
// @description  点击两侧空白收起B站动态评论（包括 up 空间动态）
// @author       F-park
// @license      MIT
// @source       https://github.com/F-park/BiliFold
// @supportURL   https://github.com/F-park/BiliFold/issues
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/
// @match        https://t.bilibili.com/?*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509129/BiliFold%20-%20%E6%94%B6%E8%B5%B7%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/509129/BiliFold%20-%20%E6%94%B6%E8%B5%B7%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [];
    const {origin} = window.location;
    if (origin == "https://space.bilibili.com") {
        selectors.push("div:has(> #page-dynamic)");
        selectors.push("#page-dynamic");
    } else if (origin == "https://t.bilibili.com") {
        selectors.push("aside.left");
        selectors.push("aside.right");
    }

    const pageObserver = new MutationObserver((mutationList, observer) => {
        const targets = document.querySelectorAll(selectors.join(","));
        if (targets.length == 0) {
            return;
        }

        for (const target of targets) {
            target.addEventListener('click', (ev) => {
                if (ev.target == target) {
                    // 只找有评论区的
                    for (const el of document.querySelectorAll(".bili-dyn-item:has(.bili-dyn-item__panel)")) {
                        if (el.getBoundingClientRect().top < ev.y && ev.y < el.getBoundingClientRect().bottom) {
                            // 65为顶栏高度
                            const topBoundary = el.querySelector(".bili-dyn-item__panel").getBoundingClientRect().top - 65;
                            if (topBoundary < 0) {
                                window.scrollBy({top: topBoundary});
                            }

                            el.getElementsByClassName("bili-dyn-action comment active")[0].click();
                        }
                    }
                }
            })
        }

        pageObserver.disconnect();
    })

    if (selectors.length > 0) {
        pageObserver.observe(document.body, {
            childList: true,
            subtree: true,
        })
    }
})();
