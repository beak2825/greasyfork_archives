// ==UserScript==
// @name         百度搜索屏蔽CSDN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在百度搜索页面屏蔽CSDN的内容
// @author       SunsetSail
// @match        https://www.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523091/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/523091/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDCSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideCSDNResults() {
        let searchResults = document.querySelectorAll('.c-container');
        searchResults.forEach(result => {
            if (result.innerHTML.toLowerCase().includes('csdn')) {
                result.style.display = 'none';
            }
        });
    }

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                hideCSDNResults();
            }
        });
    });

    // 配置观察器
    const config = {
        childList: true,
        subtree: true
    };

    // 选择要观察的节点
    const targetNode = document.body;

    // 开始观察
    observer.observe(targetNode, config);

    // 页面加载时也运行一次
    hideCSDNResults();
})();