// ==UserScript==
// @name         NODESEEK链接直达
// @namespace    https://www.nodeseek.com/space/33015
// @version      2.0
// @description  将NODESEEK页面中的跳转链接直接替换为目标链接，跳过跳转提示
// @author       You
// @match        https://www.nodeseek.com/*
// @match        http://www.nodeseek.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544079/NODESEEK%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/544079/NODESEEK%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('NODESEEK链接直达脚本已加载');

    // 处理单个链接
    function processLink(link) {
        const href = link.href;

        // 检查是否是跳转链接
        if (href && href.includes('/jump?to=')) {
            try {
                // 创建URL对象来解析参数
                const url = new URL(href);
                const targetUrl = url.searchParams.get('to');

                if (targetUrl) {
                    // 解码目标URL
                    const decodedUrl = decodeURIComponent(targetUrl);

                    // 替换链接地址
                    link.href = decodedUrl;

                    // 添加视觉标识（可选）
                    if (!link.hasAttribute('data-direct-link')) {
                        link.setAttribute('data-direct-link', 'true');
                        link.style.borderLeft = '3px solid #4CAF50';
                        link.style.paddingLeft = '5px';
                        link.title = `直达链接: ${decodedUrl}`;
                    }

                    console.log('已处理链接:', href, '->', decodedUrl);
                    return true;
                }
            } catch (error) {
                console.error('处理链接出错:', error, href);
            }
        }
        return false;
    }

    // 处理页面中的所有链接
    function processAllLinks() {
        const links = document.querySelectorAll('a[href*="/jump?to="]');
        let processedCount = 0;

        links.forEach(link => {
            if (processLink(link)) {
                processedCount++;
            }
        });

        if (processedCount > 0) {
            console.log(`已处理 ${processedCount} 个跳转链接`);
        }

        return processedCount;
    }

    // 初始处理
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processAllLinks);
        } else {
            processAllLinks();
        }

        // 监听页面变化，处理动态加载的链接
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            mutations.forEach(function(mutation) {
                // 检查是否有新增的节点
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新增节点是否包含跳转链接
                            if (node.tagName === 'A' && node.href && node.href.includes('/jump?to=')) {
                                processLink(node);
                            } else if (node.querySelector) {
                                // 检查新增节点内部是否有跳转链接
                                const innerLinks = node.querySelectorAll('a[href*="/jump?to="]');
                                if (innerLinks.length > 0) {
                                    shouldProcess = true;
                                }
                            }
                        }
                    }
                }
            });

            if (shouldProcess) {
                setTimeout(processAllLinks, 100); // 延迟处理，避免频繁执行
            }
        });

        // 开始监听
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    init();

})();
