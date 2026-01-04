// ==UserScript==
// @name         CSDN滚啊
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  屏蔽搜索结果中出现的一切有关CSDN的选项（支持Google、百度、Bing）
// @author       xiaoma
// @match        *://www.google.com/search*
// @match        *://www.google.*/search*
// @match        *://www.baidu.com/s*
// @match        *://www.bing.com/search*
// @include      *://*.bing.com/search*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512211/CSDN%E6%BB%9A%E5%95%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/512211/CSDN%E6%BB%9A%E5%95%8A.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 xiaoma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    // 百度搜索结果选择器
    const baiduSelectors = {
        results: '#content_left > div.result, #content_left > div.result-op',
        title: 'h3.t a, h3.c-title a',
        url: '.c-showurl'
    };

    // 屏蔽CSDN链接
    function blockCSDNLinks() {
        const csdnDomain = 'csdn.net';
        const csdnKeywords = ['csdn'];

        // 通用链接检查策略（适用于Google、Bing等）
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            let shouldBlock = false;

            // 检查链接href是否包含CSDN域名
            if (link.href && link.href.toLowerCase().includes(csdnDomain)) {
                shouldBlock = true;
            }

            // 检查链接文本是否包含CSDN关键词
            if (link.textContent && csdnKeywords.some(keyword =>
                link.textContent.toLowerCase().includes(keyword))) {
                shouldBlock = true;
            }

            if (shouldBlock) {
                // 查找不同搜索引擎的搜索结果容器
                const resultItem = link.closest('.b_ans, .b_widgetContainer, .b_algo') || // Bing
                                 link.closest('.MjjYud') || // Google (这个类名相对稳定)
                                 link.closest('[data-rpos]') || // Google备选方案
                                 link.closest('[jscontroller="SC7lYd"]') || // Google另一个备选
                                 link.closest('div[class*="result"]'); // 通用备选方案

                if (resultItem) {
                    resultItem.style.display = 'none';
                    console.log('已屏蔽CSDN搜索结果:', resultItem);
                }
            }
        });

        // 百度搜索特殊处理（保持原有逻辑）
        const baiduResults = document.querySelectorAll(baiduSelectors.results);
        baiduResults.forEach(result => {
            const titleEl = result.querySelector(baiduSelectors.title);
            const urlEl = result.querySelector(baiduSelectors.url);
            if (!titleEl && !urlEl) return;

            const titleText = titleEl?.textContent?.toLowerCase() || '';
            const urlText = urlEl?.textContent?.toLowerCase() || '';
            const href = titleEl?.href?.toLowerCase() || '';

            if (titleText.includes('csdn') || urlText.includes('csdn') || href.includes('csdn.net')) {
                result.style.display = 'none';
                console.log('已屏蔽百度CSDN搜索结果:', result);
            }
        });

        // 额外检查：通过文本内容查找CSDN相关结果
        const textElements = document.querySelectorAll('*');
        textElements.forEach(element => {
            // 只检查包含CSDN文本的特定元素
            if (element.textContent &&
                (element.textContent.includes('CSDN博客') ||
                 element.textContent.includes('blog.csdn.net'))) {

                // 查找父级搜索结果容器
                const resultContainer = element.closest('.MjjYud') ||
                                      element.closest('[data-rpos]') ||
                                      element.closest('.b_ans, .b_widgetContainer, .b_algo') ||
                                      element.closest('div[class*="result"]');

                if (resultContainer) {
                    resultContainer.style.display = 'none';
                    console.log('通过文本内容屏蔽CSDN结果:', resultContainer);
                }
            }
        });

        // 隐藏百度右侧栏
        const rightColumn = document.getElementById('content_right');
        if (rightColumn) {
            rightColumn.style.display = 'none';
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // 滚动事件监听
    window.addEventListener('scroll', debounce(function () {
        const scrollHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        );
        const scrollTop = window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop;
        const clientHeight = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 100) {
            requestAnimationFrame(() => {
                blockCSDNLinks();
            });
        }
    }, 200));

    // DOM变化监听
    const observer = new MutationObserver(debounce(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                blockCSDNLinks();
            }
        });
    }, 200));

    const config = {
        childList: true,
        subtree: true
    };

    const targetNode = document.body;
    observer.observe(targetNode, config);

    // 初始执行
    blockCSDNLinks();
})();