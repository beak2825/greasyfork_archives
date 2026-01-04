// ==UserScript==
// @name         小红书自动关闭登录窗
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动检测并关闭小红书的登录弹窗
// @author       icescat
// @match        *://*.xiaohongshu.com/*
// @grant        none
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488493/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/488493/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // 使用MutationObserver监听DOM变化
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (!mutation.addedNodes) return;

        // 对于每个添加的节点，检查是否存在关闭按钮
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            // 尝试匹配关闭按钮
            var closeButton = node.querySelector ? node.querySelector('div.icon-btn-wrapper.button.close, .icon-btn-wrapper.close-button') : null;
            if (closeButton) {
                closeButton.click();
                // 关闭按钮点击后，断开observer观察，避免不必要的性能消耗
                observer.disconnect();
                return;
            }
        }
    });
});

// 配置observer监视的内容
var config = {
    childList: true,
    subtree: true
};

// 开始对body元素及其子元素进行监视
observer.observe(document.body, config);

})();
