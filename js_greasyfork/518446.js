// ==UserScript==
// @name         超星半自动化刷pdf阅读时长
// @namespace    http://tampermonkey.net/
// @version      0.0.1-beta3
// @description  自动点击页面上的链接，并实现小范围上下滚动和点击进度保存逻辑
// @author       W01fh4cker
// @match        *://mooc1-1.chaoxing.com/*
// @run-at       document-end
// @grant        none
// @license Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/518446/%E8%B6%85%E6%98%9F%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8C%96%E5%88%B7pdf%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/518446/%E8%B6%85%E6%98%9F%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8C%96%E5%88%B7pdf%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.location.href.includes('mooc1-1.chaoxing.com')) {
        let index = parseInt(localStorage.getItem('currentIndex') || '0', 10);
        const scrollDistance = 50;
        const maxScrollRange = 200;
        const scrollDuration = 500;
        const clickInterval = 20000;
        const getScrollableContainer = () => {
            let elements = Array.from(document.querySelectorAll('*'));
            for (let el of elements) {
                if (el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY !== 'hidden') {
                    return el;
                }
            }
            return document.documentElement;
        };
        const container = getScrollableContainer();
        if (!container) return;
        const startScroll = () => {
            let scrollAmount = 0;
            let direction = 1;
            setInterval(() => {
                container.scrollBy(0, direction * scrollDistance);
                scrollAmount += scrollDistance;

                if (Math.abs(scrollAmount) >= maxScrollRange) {
                    direction *= -1;
                    scrollAmount = 0;
                }
            }, scrollDuration);
        };
        const executeClick = () => {
            let links = Array.from(document.querySelectorAll('ul li a'));
            if (links.length > 0) {
                if (index >= links.length) {
                    index = 0;
                }
                let link = links[index];
                let event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                link.dispatchEvent(event);
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.5';
                index++;
                localStorage.setItem('currentIndex', index);
            }
        };

        const scheduleClick = () => {
            executeClick();
            setTimeout(scheduleClick, clickInterval);
        };

        startScroll();
        setTimeout(scheduleClick, clickInterval);
    }
})();