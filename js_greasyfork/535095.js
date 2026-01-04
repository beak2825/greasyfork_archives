// ==UserScript==
// @name         蝉镜侧边栏优化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  缩小 .fixed-bar 并在滚动后淡入 .to-top，不破坏原布局
// @match        https://www.chanjing.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535095/%E8%9D%89%E9%95%9C%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535095/%E8%9D%89%E9%95%9C%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
    .fixed-bar {
        transform: scale(0.6) !important;
        transform-origin: bottom right !important;
    }

    .to-top {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .to-top.show {
        opacity: 1;
        pointer-events: auto;
    }`;
    document.head.appendChild(style);

    function onReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    onReady(function () {
        const observer = new MutationObserver(() => {
            const toTop = document.querySelector('.to-top');
            if (!toTop) return;

            toggleToTopVisibility(toTop);

            window.addEventListener('scroll', () => toggleToTopVisibility(toTop));
            window.addEventListener('resize', () => toggleToTopVisibility(toTop));

            observer.disconnect(); // 找到后停止监听
        });

        observer.observe(document.body, { childList: true, subtree: true });

        function toggleToTopVisibility(toTop) {
            if (window.scrollY === 0) {
                toTop.classList.remove('show');
            } else {
                toTop.classList.add('show');
            }
        }
    });
})();