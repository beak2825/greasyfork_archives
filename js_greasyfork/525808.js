// ==UserScript==
// @name         HTTPS图片强制加载器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动将网页中的HTTP图片资源替换为HTTPS协议
// @author       YourName
// @match        *://*/*
// @exclude      http://localhost:*/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525808/HTTPS%E5%9B%BE%E7%89%87%E5%BC%BA%E5%88%B6%E5%8A%A0%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525808/HTTPS%E5%9B%BE%E7%89%87%E5%BC%BA%E5%88%B6%E5%8A%A0%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 协议升级函数
    function upgradeToHttps(element) {
        try {
            // 处理src属性
            if (element.src && element.src.startsWith('http://')) {
                element.src = element.src.replace('http://', 'https://');
            }

            // 处理srcset属性（支持多密度图片）
            if (element.srcset) {
                element.srcset = element.srcset.replace(/http:\/\//g, 'https://');
            }
        } catch (e) {
            console.warn('HTTPS升级出错:', e);
        }
    }

    // 初始处理所有图片
    function processImages() {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            upgradeToHttps(img);
        }
    }

    // 使用MutationObserver监听动态加载的内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') {
                    upgradeToHttps(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(upgradeToHttps);
                }
            });
        });
    });

    // 配置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    window.addEventListener('DOMContentLoaded', processImages);
    processImages(); // 兼容已加载完成的情况
})();