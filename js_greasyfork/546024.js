// ==UserScript==
// @name         显示x岛图片链接指向的图片
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  当匹配到页面中div class名为h-threads-content的对象时，如果对象里面有图片网址，将图片显示出来
// @author       Anthropic Claude Sonnet 4
// @match        https://www.nmbxd1.com/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/546024/%E6%98%BE%E7%A4%BAx%E5%B2%9B%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8C%87%E5%90%91%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/546024/%E6%98%BE%E7%A4%BAx%E5%B2%9B%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8C%87%E5%90%91%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 图片URL的正则表达式
    const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|webp|svg)(?:\?[^\s]*)?)/gi;

    // 用于标记已处理的元素的属性名
    const PROCESSED_ATTRIBUTE = 'data-images-processed';

    // 处理单个div元素
    function processDiv(div) {
        // 检查是否已经处理过
        if (div.hasAttribute(PROCESSED_ATTRIBUTE)) {
            return;
        }

        // 标记为已处理
        div.setAttribute(PROCESSED_ATTRIBUTE, 'true');

        const textContent = div.textContent || div.innerText;

        // 查找图片URL
        const imageUrls = textContent.match(imageUrlRegex);

        if (imageUrls && imageUrls.length > 0) {
            // 去重处理
            const uniqueImageUrls = [...new Set(imageUrls.map(url => url.trim()))];

            // 创建图片容器
            const imageContainer = document.createElement('div');
            imageContainer.className = 'injected-image-container'; // 添加类名标识
            imageContainer.style.cssText = `
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            `;

            // 为每个图片URL创建img元素
            uniqueImageUrls.forEach((url, index) => {
                const img = document.createElement('img');
                img.src = url;
                img.style.cssText = `
                    max-width: 100%;
                    height: auto;
                    margin: 5px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    cursor: pointer;
                `;

                // 添加点击放大功能
                img.addEventListener('click', function() {
                    window.open(url, '_blank');
                });

                // 添加加载错误处理
                img.addEventListener('error', function() {
                    img.style.display = 'none';
                    console.log('图片加载失败:', url);
                });

                // 添加加载成功提示
                img.addEventListener('load', function() {
                    console.log('图片加载成功:', url);
                });

                imageContainer.appendChild(img);

                // 添加图片URL链接
                const linkDiv = document.createElement('div');
                linkDiv.style.cssText = `
                    font-size: 12px;
                    color: #666;
                    margin: 2px 5px;
                    word-break: break-all;
                `;
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = url;
                link.style.color = '#007bff';
                linkDiv.appendChild(link);
                imageContainer.appendChild(linkDiv);
            });

            // 将图片容器插入到div后面
            div.parentNode.insertBefore(imageContainer, div.nextSibling);
        }
    }

    // 查找并处理所有匹配的div
    function findAndProcessDivs() {
        const divs = document.querySelectorAll('div.h-threads-content:not([' + PROCESSED_ATTRIBUTE + '])');
        divs.forEach(processDiv);
    }

    // 监听DOM变化，处理动态加载的内容
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // 元素节点
                            // 跳过我们自己创建的图片容器
                            if (node.classList && node.classList.contains('injected-image-container')) {
                                return;
                            }

                            // 检查新添加的节点是否是目标div
                            if (node.classList && node.classList.contains('h-threads-content') &&
                                !node.hasAttribute(PROCESSED_ATTRIBUTE)) {
                                processDiv(node);
                            }

                            // 检查新添加节点的子元素
                            const childDivs = node.querySelectorAll &&
                                node.querySelectorAll('div.h-threads-content:not([' + PROCESSED_ATTRIBUTE + '])');
                            if (childDivs && childDivs.length > 0) {
                                childDivs.forEach(processDiv);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 清理函数：移除已处理的标记（可选，用于调试）
    function resetProcessedElements() {
        const processedElements = document.querySelectorAll('[' + PROCESSED_ATTRIBUTE + ']');
        processedElements.forEach(el => el.removeAttribute(PROCESSED_ATTRIBUTE));

        // 移除已注入的图片容器
        const injectedContainers = document.querySelectorAll('.injected-image-container');
        injectedContainers.forEach(container => container.remove());
    }

    // 暴露清理函数到全局（用于调试）
    window.resetImageScript = resetProcessedElements;

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(findAndProcessDivs, 100); // 稍微延迟确保DOM完全准备好
            observeChanges();
        });
    } else {
        setTimeout(findAndProcessDivs, 100);
        observeChanges();
    }

    // 页面加载完成后再次检查（减少延迟时间）
    window.addEventListener('load', function() {
        setTimeout(findAndProcessDivs, 500);
    });

})();