// ==UserScript==
// @name        共创世界(CCW)屏蔽指定作品的更新通知和消息&自动加载更多消息
// @namespace    https://greasyfork.org/zh-CN/scripts/523121
// @version      0.8
// @description  屏蔽指定作品的更新通知和消息&自动加载更多消息
// @author       kukemc
// @match        https://www.ccw.site/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523121/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E4%BD%9C%E5%93%81%E7%9A%84%E6%9B%B4%E6%96%B0%E9%80%9A%E7%9F%A5%E5%92%8C%E6%B6%88%E6%81%AF%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/523121/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E4%BD%9C%E5%93%81%E7%9A%84%E6%9B%B4%E6%96%B0%E9%80%9A%E7%9F%A5%E5%92%8C%E6%B6%88%E6%81%AF%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要查找的作品名列表
    const keywords = ["MMO联机枪战", "屏蔽关键词1", "屏蔽关键词2"];

    const clickCooldown = 3000;

    let lastClickTime = 0;

    function removeElementsByKeywords() {
        const selector1 = '.container-3ooG_ .content-3Klgd .message-JtL9n .text-2nsmT span.projectName-33utb';
        document.querySelectorAll(selector1).forEach(element => {
            if (keywords.some(keyword => element.textContent.includes(keyword))) {
                element.closest('.container-3ooG_')?.remove();
            }
        });

        const selector2 = '.container-4-z20 .creationTitle-3SxBi span';
        document.querySelectorAll(selector2).forEach(element => {
            if (keywords.some(keyword => element.textContent.includes(keyword))) {
                element.closest('.container-4-z20')?.remove();
            }
        });
    }

    function observeMoreButton() {
        const moreButton = document.querySelector('.more-2QMtj');
        if (!moreButton) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentTime = Date.now();
                    if (currentTime - lastClickTime > clickCooldown) {
                        entry.target.click();
                        lastClickTime = currentTime;
                        console.log('Clicked "查看更多" button.');
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.1 });

        observer.observe(moreButton);
    }

    removeElementsByKeywords();
    observeMoreButton();

    const mutationObserver = new MutationObserver(mutations => {
        removeElementsByKeywords();
        observeMoreButton();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
})();