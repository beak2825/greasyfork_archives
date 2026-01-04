// ==UserScript==
// @name         所有链接都使用新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让所有网页的链接都在新标签页中打开
// @author       Your name
// @match        *://*/*
// @grant        non
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527543/%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E9%83%BD%E4%BD%BF%E7%94%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/527543/%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E9%83%BD%E4%BD%BF%E7%94%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主函数：处理所有链接
    function handleLinks() {
        // 获取页面上所有的链接
        const links = document.getElementsByTagName('a');
        
        // 遍历所有链接
        for (let i = 0; i < links.length; i++) {
            // 跳过空链接和javascript:void(0)类型的链接
            if (links[i].href && !links[i].href.startsWith('javascript:')) {
                links[i].setAttribute('target', '_blank');
                // 添加rel属性以提高安全性
                links[i].setAttribute('rel', 'noopener noreferrer');
            }
        }
    }

    // 初始执行一次
    handleLinks();

    // 创建观察器监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        handleLinks();
    });

    // 配置观察器
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察document.body的变化
    observer.observe(document.body, config);
})();