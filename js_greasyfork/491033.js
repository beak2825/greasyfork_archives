// ==UserScript==
// @name         删除B站直播马赛克
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  检测马赛克生成并删除
// @author       果冻大神
// @match        https://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491033/%E5%88%A0%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491033/%E5%88%A0%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetClass = 'web-player-module-area-mask';
    let observer;

    function startObserver() {
        observer = new MutationObserver(mutationsList => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(targetClass)) {
                            node.remove();
                            console.log('检测到马赛克并已删除');
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function stopObserver() {
        if (observer) {
            observer.disconnect();
            console.log('已停止检测');
        }
    }

    window.addEventListener('load', function() {
        console.log('网页加载完成');
        startObserver();
        setTimeout(() => {
            stopObserver();
        }, 10000); // 10秒后停止观察
    });
})();
