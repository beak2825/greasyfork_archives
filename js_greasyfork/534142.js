// ==UserScript==
// @name         GitHub DeepWiki Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在GitHub项目主页添加DeepWiki链接
// @author       zerah
// @match        https://github.com/*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534142/GitHub%20DeepWiki%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/534142/GitHub%20DeepWiki%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化变异观察器
    function initMutationObserver() {
        const targetNode = document.body;

        // 观察器配置
        const config = {
            childList: true,
            subtree: true
        };

        // 创建观察器实例
        const observer = new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const publicLabel = document.querySelector('.Label--secondary.v-align-middle.mr-1');
                    if (publicLabel && !document.querySelector('.deepwiki-link')) {
                        addDeepWikiLink(publicLabel);
                        // 一旦添加了链接，就不再需要继续监视
                        // observer.disconnect();
                        // 但我们保持观察，以防导航到其他页面
                    }
                }
            }
        });

        // 开始观察
        observer.observe(targetNode, config);
    }

    // 立即运行一次，以防元素已经存在
    setTimeout(() => {
        const publicLabel = document.querySelector('.Label--secondary.v-align-middle.mr-1');
        if (publicLabel) {
            addDeepWikiLink(publicLabel);
        }

        // 无论是否找到元素，都启动观察器
        initMutationObserver();
    }, 500);

    function addDeepWikiLink(publicLabel) {
        // 获取项目路径，例如 qzz0518/coss
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length < 3) return; // 不是项目页面

        const owner = pathParts[1];
        const repo = pathParts[2];

        // 确保我们在项目的主页上
        if (pathParts.length > 3 && pathParts[3] !== '') return;

        // 检查是否已经添加了DeepWiki链接
        if (publicLabel.parentNode.querySelector('.deepwiki-link')) return;

        // 创建DeepWiki链接
        const deepWikiLink = document.createElement('a');
        deepWikiLink.href = `https://deepwiki.com/${owner}/${repo}`;
        deepWikiLink.target = '_blank'; // 在新窗口打开
        deepWikiLink.className = 'Label Label--secondary v-align-middle mr-1 deepwiki-link';
        deepWikiLink.textContent = 'DeepWiki';
        deepWikiLink.style.textDecoration = 'none';
        deepWikiLink.style.cursor = 'pointer';

        // 在Public标签后面插入DeepWiki链接
        publicLabel.parentNode.insertBefore(deepWikiLink, publicLabel.nextSibling);
    }
})();