// ==UserScript==
// @name         粉笔网解析视频删除
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动隐藏粉笔网（spa.fenbi.com）题目解析页面的“解析视频”模块。
// @author       yingming006
// @match        https://spa.fenbi.com/ti/exam/solution/*
// @icon         https://spa.fenbi.com/favicon.ico
// @grant        none
// @run-at       document-
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545631/%E7%B2%89%E7%AC%94%E7%BD%91%E8%A7%A3%E6%9E%90%E8%A7%86%E9%A2%91%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/545631/%E7%B2%89%E7%AC%94%E7%BD%91%E8%A7%A3%E6%9E%90%E8%A7%86%E9%A2%91%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logPrefix = '[粉笔视频删除器]';

    function hideVideoSections() {
        const videoElements = document.querySelectorAll('app-solution-video');

        if (videoElements.length === 0) {
            return;
        }

        videoElements.forEach(videoEl => {
            const sectionContainer = videoEl.closest('section.result-common-section');

            if (sectionContainer && sectionContainer.style.display !== 'none') {
                console.log(logPrefix, '发现并隐藏解析视频模块。');
                sectionContainer.style.display = 'none';
            }
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                hideVideoSections();
                break;
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();