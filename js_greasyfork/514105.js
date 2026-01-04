// ==UserScript==
// @name         力扣上一题下一题快捷键
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  绑定力扣刷题页面上一题下一题快捷键
// @author       tianyw0
// @match        https://leetcode.cn/problems/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514105/%E5%8A%9B%E6%89%A3%E4%B8%8A%E4%B8%80%E9%A2%98%E4%B8%8B%E4%B8%80%E9%A2%98%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/514105/%E5%8A%9B%E6%89%A3%E4%B8%8A%E4%B8%80%E9%A2%98%E4%B8%8B%E4%B8%80%E9%A2%98%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let filteredLinks = [];

    function triggerEmptyHrefLinks() {
        const emptyHrefLinks = Array.from(document.querySelectorAll('a'))
            .filter(a => a.hasAttribute('href') && a.getAttribute('href') === '');

        emptyHrefLinks.forEach(link => {
            link.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
        });
    }

    function findLinks() {
        const links = document.querySelectorAll('a[href^="/problems/"][href*="?"]');
        filteredLinks = Array.from(links).filter(link => {
            const url = new URL(link.href, window.location.origin);
            const path = url.pathname.split('/');
            const problemName = path[2];
            return problemName && url.searchParams.has('envType') && url.searchParams.has('envId') && url.searchParams.get('envType') !== 'daily-question';
        });

        if (filteredLinks.length >= 2) {
            console.log(`找到 ${filteredLinks.length} 个符合条件的链接:`);
            filteredLinks.forEach((link, index) => console.log(`链接 ${index + 1}: ${link.href}`));
            bindKeyEvents();
        } else {
            console.log('未找到足够符合条件的链接，重新查找...');
            triggerEmptyHrefLinks(); // 重试时触发hover事件
            setTimeout(findLinks, 1000); // 休息1秒后重新查找
        }
    }

    function bindKeyEvents() {
        document.addEventListener('keydown', (event) => {
            const key = event.key.toUpperCase();
            if ((key === ',' || key === 'P') && filteredLinks[0]) {
                console.log(`点击链接(Prev): ${filteredLinks[0].href}`);
                filteredLinks[0].click();
                simulateClickEffect(filteredLinks[0]);
            } else if ((key === '.' || key === 'N') && filteredLinks[1]) {
                console.log(`点击链接(Next): ${filteredLinks[1].href}`);
                filteredLinks[1].click();
                simulateClickEffect(filteredLinks[1]);
            }
        });
    }

    function simulateClickEffect(link) {
        link.style.backgroundColor = '#474747';
        setTimeout(() => {
            link.style.backgroundColor = '';
        }, 50);
    }

    // 初始触发空链接请求
    triggerEmptyHrefLinks();

    // 初始查找
    setTimeout(findLinks, 1000); // 初始休息1秒后开始查找
})();