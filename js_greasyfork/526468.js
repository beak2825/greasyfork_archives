// ==UserScript==
// @name         FC2PPVDB页面添加AV链接快捷搜素
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  在FC2PPVDB页面添加AV链接快捷搜素
// @author       kaers
// @match        https://fc2ppvdb.com/articles/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/526468/FC2PPVDB%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0AV%E9%93%BE%E6%8E%A5%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/526468/FC2PPVDB%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0AV%E9%93%BE%E6%8E%A5%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const articleInfo = document.getElementById('article-info');
    if (!articleInfo) return;

    const observer = new MutationObserver((mutations, obs) => {
        const spanElement = document.querySelector('#article-info div span.text-white.ml-2');
        if (spanElement) {
            const id = spanElement.textContent.trim();

            // 链接配置数组
            const links = [
                { text: '🔍SupJav', href: `https://supjav.com/?s=${id}` },
                { text: '🔍JavGG', href: `https://javgg.net/?s=${id}` },
                { text: '🔍123av', href: `https://123av.com/zh/search?keyword=${id}` },
                { text: '🔍Google', href: `https://www.google.com/search?q=FC2PPV ${id}` },
                { text: '🔍M-Team', href: `https://kp.m-team.cc/browse/adult?keyword=${id}` },
                { text: '🔍Sukebei', href: `https://sukebei.nyaa.si/?f=0&c=0_0&q=${id}` },
                { text: '🔍FC2', href: `https://adult.contents.fc2.com/article/${id}/` },
                { text: '🔍FC2Hub', href: `https://javten.com/search?kw=${id}` }
            ];

            // 遍历创建并插入链接
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.text;
                a.style.marginLeft = '10px';
                a.target = '_blank';
                a.style.cursor = 'pointer';
                a.addEventListener('mouseenter', () => a.style.textDecoration = 'underline');
                a.addEventListener('mouseleave', () => a.style.textDecoration = 'none');
                spanElement.insertAdjacentElement('afterend', a);
            });

            obs.disconnect(); // 找到元素后停止监听
        }
    });

    observer.observe(articleInfo, { childList: true, subtree: true });
})();
