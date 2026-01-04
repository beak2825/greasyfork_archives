// ==UserScript==
// @name         Bangumi目录自动加载更多角色页
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动加载所有以index开头的目录中角色数量超过999的后续页面内容
// @author       YourName
// @match        https://bgm.tv/index/*
// @match        https://bangumi.tv/index/*
// @match        https://chii.in/index/*
// @connect      bgm.tv
// @connect      bangumi.tv
// @connect      chii.in
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/533819/Bangumi%E7%9B%AE%E5%BD%95%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E8%A7%92%E8%89%B2%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/533819/Bangumi%E7%9B%AE%E5%BD%95%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E8%A7%92%E8%89%B2%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const selectedLink = document.querySelector('#indexCatBox ul.cat li a.selected');
        if (!selectedLink || !selectedLink.href.includes('cat=character')) return;

        const countElement = selectedLink.querySelector('span small');
        if (!countElement) return;
        const roleCount = parseInt(countElement.textContent, 10);
        if (roleCount <= 999) return;

        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('page')) || 1;
        const totalPages = Math.ceil(roleCount / 999);

        const pagesToLoad = Array.from(
            {length: totalPages - currentPage},
            (_, i) => currentPage + i + 1
        );

        const container = document.querySelector('#columnSubjectBrowserA .browserCrtList.ui-sortable');
        if (!container) return;

        const loadPages = async (pages) => {
            for (const page of pages) {
                try {
                    const newParams = new URLSearchParams(urlParams);
                    newParams.set('page', page);
                    const requestUrl = `${window.location.pathname}?${newParams}`;

                    // 使用 fetch 获取数据
                    const response = await fetch(requestUrl, {
                        credentials: 'include',
                        referrerPolicy: 'no-referrer-when-downgrade'
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const html = await response.text();

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    const newContent = doc.querySelector('.browserCrtList.ui-sortable') ||
                                     doc.querySelector('#columnSubjectBrowserA .browserCrtList');

                    if (newContent) {
                        const existingIds = new Set(Array.from(container.children).map(el => el.id));
                        Array.from(newContent.children).forEach(element => {
                            if (!existingIds.has(element.id)) {
                                container.appendChild(document.importNode(element, true));
                            }
                        });
                    }

                    const pageDivider = document.createElement('div');
                    pageDivider.style.cssText = 'text-align:center; padding:10px; color:#666;';
                    pageDivider.textContent = `── 第 ${page} 页内容 ──`;
                    container.appendChild(pageDivider);

                } catch (error) {
                    console.error(`加载第 ${page} 页失败:`, error);
                }
            }
        };

        const MAX_CONCURRENT = 3;
        for (let i = 0; i < pagesToLoad.length; i += MAX_CONCURRENT) {
            loadPages(pagesToLoad.slice(i, i + MAX_CONCURRENT));
        }
    });
})();