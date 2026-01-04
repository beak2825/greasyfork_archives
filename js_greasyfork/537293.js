// ==UserScript==
// @name         将Bangumi 番剧名跳转至末日资源库搜索
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Bangumi 番剧中文名旁添加跳转按钮
// @match        https://chii.in/*
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        http://bangumi.tv/*
// @match        http://bgm.tv/*
// @match        http://chii.in/*
// @match        http://li350-137.members.linode.com/*
// @match        http://178.79.181.137/*
// @grant        none
// @author       wjwsu
// @downloadURL https://update.greasyfork.org/scripts/537293/%E5%B0%86Bangumi%20%E7%95%AA%E5%89%A7%E5%90%8D%E8%B7%B3%E8%BD%AC%E8%87%B3%E6%9C%AB%E6%97%A5%E8%B5%84%E6%BA%90%E5%BA%93%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/537293/%E5%B0%86Bangumi%20%E7%95%AA%E5%89%A7%E5%90%8D%E8%B7%B3%E8%BD%AC%E8%87%B3%E6%9C%AB%E6%97%A5%E8%B5%84%E6%BA%90%E5%BA%93%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createSearchButton(keyword) {
        const searchUrl = `https://share.acgnx.se/search.php?sort_id=0&keyword=${encodeURIComponent(keyword)}`;

        const btn = document.createElement('span');
        btn.textContent = '🔍';
        btn.title = '使用标题搜索 ACGNX';
        btn.style.cssText = `
            display: inline-block;
            margin-left: 6px;
            cursor: pointer;
            background-color: #3498db;
            color: white;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 12px;
            line-height: 1;
            user-select: none;
            transition: background-color 0.3s;
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#2980b9';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = '#3498db';
        });
        btn.addEventListener('click', () => {
            window.open(searchUrl, '_blank');
        });

        return btn;
    }

    window.addEventListener('load', function () {
        // 中文名检测
        const tipSpans = document.querySelectorAll('span.tip');
        tipSpans.forEach(span => {
            if (span.textContent.trim() === '中文名:') {
                const nextNode = span.nextSibling;
                if (!nextNode || !nextNode.nodeValue) return;

                const zhNameRaw = nextNode.nodeValue.trim();
                if (!zhNameRaw) return;

                const btn = createSearchButton(zhNameRaw);
                span.parentElement.appendChild(btn);
            }
        });

        // 精确匹配 <a class="l" href="/subject/123456">标题</a>
        const titleLinks = document.querySelectorAll('a.l[href]');
        titleLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!/^\/subject\/\d+$/.test(href)) return;

            const text = link.textContent.trim();
            if (text && !link.nextElementSibling?.textContent.includes('🔍')) {
                const btn = createSearchButton(text);
                link.parentElement.insertBefore(btn, link.nextSibling);
            }
        });
    });
})();
