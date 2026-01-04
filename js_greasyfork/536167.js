// ==UserScript==
// @name         网络请求捕捉脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  捕捉所有GET请求的URL并输出到控制台
// @author       你
// @include      *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536167/%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%8D%95%E6%8D%89%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/536167/%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%8D%95%E6%8D%89%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * MIT License
     * 
     * Copyright (c) 2025 你
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */

    // 捕捉 XMLHttpRequest 请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (method === 'GET') {
            console.log('检测到新的GET请求:', url);
        }
        return originalOpen.apply(this, arguments);
    };

    // 捕捉 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // 确定请求方法
        const method = options && options.method ? options.method.toUpperCase() : 'GET';

        if (method === 'GET') {
            console.log('检测到新的fetch GET请求:', url);
        }

        return originalFetch.apply(this, arguments).then(response => {
            // 在这里可以对响应进行处理，比如记录响应数据等
            return response;
        });
    };

    // 捕捉通过标签加载的资源（如 <img>, <script> 等）
    const originalImageConstructor = window.Image;
    window.Image = function() {
        const img = new originalImageConstructor();
        img.addEventListener('load', function() {
            console.log('检测到通过Image标签加载的GET请求:', img.src);
        });
        return img;
    };

    // 捕捉其他资源加载（如通过链接下载的文件等）
    const originalLinkConstructor = window.Link;
    if (originalLinkConstructor) {
        window.Link = function() {
            const link = new originalLinkConstructor();
            link.addEventListener('load', function() {
                console.log('检测到通过Link标签加载的GET请求:', link.href);
            });
            return link;
        };
    }

    // 监测页面加载完成后的网络请求
    window.addEventListener('load', function() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        if (mutation.addedNodes[i] instanceof HTMLElement) {
                            const element = mutation.addedNodes[i];
                            // 检查是否有新的资源加载请求
                            if (element.tagName === 'IMG') {
                                console.log('页面加载后检测到新的Image资源加载:', element.src);
                            } else if (element.tagName === 'SCRIPT') {
                                console.log('页面加载后检测到新的Script资源加载:', element.src);
                            } else if (element.tagName === 'LINK') {
                                console.log('页面加载后检测到新的Link资源加载:', element.href);
                            }
                        }
                    }
                }
            });
        });

        observer.observe(document, { childList: true, subtree: true });
    });

    // 捕捉页面导航相关的GET请求
    window.addEventListener('beforeunload', function() {
        const navUrl = window.performance.getEntriesByType('navigation')[0].name;
        console.log('页面导航URL:', navUrl);
    });

    // 捕捉页面加载过程中的所有资源请求
    window.addEventListener('load', function() {
        const resourceRequests = performance.getEntriesByType('resource');
        resourceRequests.forEach(request => {
            if (request.initiatorType === 'xmlhttprequest' || request.initiatorType === 'fetch') {
                console.log('页面加载过程中检测到的网络请求:', request.name);
            }
        });
    });
})();
