// ==UserScript==
// @name         Artstation跳转8k图片
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动将Artstation图片链接从large替换为8k并在新标签页打开
// @author       You
// @match        *://*artstation*/*
// @icon         https://www.artstation.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533719/Artstation%E8%B7%B3%E8%BD%AC8k%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/533719/Artstation%E8%B7%B3%E8%BD%AC8k%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止多次执行
    if (window.artstationRedirectorLoaded) return;
    window.artstationRedirectorLoaded = true;

    // 检查URL是否是8k版本
    function is8kVersion(url) {
        return typeof url === 'string' &&
               url.includes('/8k/');
    }

    // 定义检查URL的函数
    function isArtstationLargeImage(url) {
        // 匹配形如 https://cdna.artstation.com/p/assets/images/024/737/682/large/cocy-c-2.jpg?1583363541
        // 确保前缀部分完全匹配
        const regex = /https:\/\/cdn[a-z]?\.artstation\.com\/p\/assets\/images\/.*\/large\/.+\.jpg/i;
        return regex.test(url) && !is8kVersion(url);
    }

    // 定义更简单的函数直接检查URL前缀和large关键词
    function isArtstationImage(url) {
        return typeof url === 'string' &&
               url.startsWith('https://cdn') &&
               url.includes('.artstation.com/p/assets/images/') &&
               url.includes('/large/') &&
               (url.endsWith('.jpg') || url.includes('.jpg?')) &&
               !is8kVersion(url);
    }

    // 定义重定向函数
    function redirectTo8k(url) {
        // 如果已经是8k版本，不做处理
        if (is8kVersion(url)) return false;

        // 替换large为8k
        const newUrl = url.replace('/large/', '/8k/');

        // 在新标签页打开修改后的URL
        window.open(newUrl, '_blank');

        console.log('Artstation 8K Redirector: 重定向到', newUrl);
        return true;
    }

    // 如果当前页面包含/8k/，则这是已经重定向的页面，不需要再处理
    if (is8kVersion(window.location.href)) {
        console.log('Artstation 8k Redirector: 已经是8K版本，不进行处理');
        return;
    }

    // 拦截链接点击
    document.addEventListener('click', function(event) {
        // 检查是否点击了链接
        let element = event.target;
        while (element && element.tagName !== 'A') {
            element = element.parentElement;
        }

        if (!element) return;

        const href = element.href || '';

        if (isArtstationImage(href)) {
            event.preventDefault();
            event.stopPropagation();
            redirectTo8k(href);
        }
    }, true);

    // 拦截图片直接打开
    if (isArtstationImage(window.location.href)) {
        // 如果当前页面是large图片，直接重定向到8k
        window.stop(); // 停止当前页面加载
        redirectTo8k(window.location.href);
    }

    // 监听页面加载完成
    window.addEventListener('load', function() {
        // 如果当前页面包含/8k/，则这是已经重定向的页面，不需要再处理
        if (is8kVersion(window.location.href)) return;

        // 为所有artstation图片链接添加特殊处理
        const links = document.querySelectorAll('a[href*="artstation.com/p/assets/images"][href*="/large/"]');

        links.forEach(function(link) {
            if (isArtstationImage(link.href) && !link.hasAttribute('data-artstation-8k')) {
                // 标记已处理
                link.setAttribute('data-artstation-8k', 'true');

                // 添加新的点击事件
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    redirectTo8k(link.href);
                }, true);
            }
        });


        // 如果当前页面是large图片，添加提示
        if (isArtstationImage(window.location.href)) {
            const infoDiv = document.createElement('div');
            infoDiv.style.position = 'fixed';
            infoDiv.style.top = '10px';
            infoDiv.style.right = '10px';
            infoDiv.style.padding = '10px';
            infoDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
            infoDiv.style.color = 'white';
            infoDiv.style.borderRadius = '5px';
            infoDiv.style.zIndex = '9999';
            document.body.appendChild(infoDiv);

            // 5秒后隐藏提示
            setTimeout(() => {
                infoDiv.style.opacity = '0';
                infoDiv.style.transition = 'opacity 1s';
            }, 5000);
        }
    });

    // 拦截所有图片链接（使用MutationObserver监听DOM变化）
    const observer = new MutationObserver(function(mutations) {
        // 如果当前页面包含/8k/，则这是已经重定向的页面，不需要再处理
        if (is8kVersion(window.location.href)) return;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // 元素节点
                        const links = node.querySelectorAll ? node.querySelectorAll('a[href*="artstation.com/p/assets/images"][href*="/large/"]') : [];

                        links.forEach(function(link) {
                            if (isArtstationImage(link.href) && !link.hasAttribute('data-artstation-8k')) {
                                link.setAttribute('data-artstation-8k', 'true');

                                link.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    redirectTo8k(link.href);
                                }, true);
                            }
                        });
                    }
                }
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始监听文档变化
    observer.observe(document, config);
})();