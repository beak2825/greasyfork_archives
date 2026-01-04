// ==UserScript==
// @name         搜索引擎一键切换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在百度、Google、Bing、知乎搜索结果页左侧显示竖列，点击切换搜索引擎
// @author       GitHub Copilot
// @match        https://www.baidu.com/s*
// @match        https://www.google.*/*
// @match        https://cn.bing.com/search*
// @match        https://www.zhihu.com/search*
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/543083/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/543083/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前搜索关键词
    function getQuery() {
        const url = location.href;
        if (url.includes('baidu.com')) {
            return decodeURIComponent((new URL(url)).searchParams.get('wd') || '');
        }
        if (url.includes('google.')) {
            return decodeURIComponent((new URL(url)).searchParams.get('q') || '');
        }
        if (url.includes('bing.com')) {
            return decodeURIComponent((new URL(url)).searchParams.get('q') || '');
        }
        if (url.includes('zhihu.com')) {
            return decodeURIComponent((new URL(url)).searchParams.get('q') || '');
        }
        return '';
    }

    function renderBar() {
        const query = getQuery();
        if (!query) return;

        // 构造各搜索引擎的搜索链接
        const links = [
            {
                name: 'Bing',
                url: 'https://cn.bing.com/search?q=' + encodeURIComponent(query)
            },
            {
                name: '百度',
                url: 'https://www.baidu.com/s?wd=' + encodeURIComponent(query)
            },
            {
                name: 'Google',
                url: 'https://www.google.com/search?q=' + encodeURIComponent(query)
            },
            {
                name: '知乎',
                url: 'https://www.zhihu.com/search?q=' + encodeURIComponent(query)
            }
        ];

        // 创建左侧竖列导航栏
        const bar = document.createElement('div');
        bar.style.position = 'fixed';
        bar.style.top = '140px';
        bar.style.left = '24px';
        bar.style.zIndex = '9999';
        bar.style.background = 'none';
        bar.style.border = 'none';
        bar.style.boxShadow = 'none';
        bar.style.padding = '0';
        bar.style.display = 'flex';
        bar.style.flexDirection = 'column';
        bar.style.gap = '12px';
        bar.style.fontSize = '13px';
        bar.style.color = '#aaa';

        links.forEach(link => {
            const btn = document.createElement('button');
            btn.textContent = link.name;
            btn.style.cursor = 'pointer';
            btn.style.padding = '0 4px';
            btn.style.border = 'none';
            btn.style.background = 'none';
            btn.style.margin = '0';
            btn.style.fontSize = 'inherit';
            btn.style.color = '#aaa';
            btn.onmouseover = () => {
                btn.style.textDecoration = 'underline';
                btn.style.color = '#888';
            };
            btn.onmouseout = () => {
                btn.style.textDecoration = 'none';
                btn.style.color = '#aaa';
            };
            btn.onclick = () => window.location.href = link.url;
            bar.appendChild(btn);
        });

        document.body.appendChild(bar);
    }

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(renderBar);
    } else {
        window.setTimeout(renderBar, 0);
    }
})();
