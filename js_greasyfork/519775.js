// ==UserScript==
// @name         CCTV4k网页显示优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽图片，压扁图框。让一页内显示的内容更多
// @author       barnett
// @match        *://tv.cctv.com/4K/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519775/CCTV4k%E7%BD%91%E9%A1%B5%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519775/CCTV4k%E7%BD%91%E9%A1%B5%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：调整.top容器高度并隐藏图片
    function adjustTopHeightAndHideImages() {
        // 获取页面中所有的.top容器并调整高度
        const containers = document.querySelectorAll('.top');
        containers.forEach(function(container) {
            container.style.height = '100px'; // 只设置高度为100px
        });

        // 获取页面中所有的img标签并隐藏
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.style.display = 'none'; // 隐藏图片
        });
    }

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 调整新添加的.top容器高度
                    if (node.classList && node.classList.contains('top')) {
                        node.style.height = '100px'; // 只设置高度为100px
                    }
                    // 隐藏新添加的图片
                    if (node.tagName === 'IMG') {
                        node.style.display = 'none'; // 隐藏图片
                    } else {
                        // 递归检查子节点
                        node.querySelectorAll('.top').forEach(function(container) {
                            container.style.height = '100px'; // 只设置高度为100px
                        });
                        node.querySelectorAll('img').forEach(function(img) {
                            img.style.display = 'none'; // 隐藏图片
                        });
                    }
                }
            });
        });
    });

    // 配置观察者选项：观察子节点的添加
    const config = { childList: true, subtree: true };

    // 监听页面加载完成
    window.addEventListener('load', adjustTopHeightAndHideImages);

    // 开始观察DOM变化
    observer.observe(document.body, config);
})();