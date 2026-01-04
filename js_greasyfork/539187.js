// ==UserScript==
// @name         过滤Sotwe转贴/Remove Retweeted Containers fo Sotwe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏所有包含"retweeted"文本的推文容器
// @author       YourName
// @match        *://www.sotwe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sotwe.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539187/%E8%BF%87%E6%BB%A4Sotwe%E8%BD%AC%E8%B4%B4Remove%20Retweeted%20Containers%20fo%20Sotwe.user.js
// @updateURL https://update.greasyfork.org/scripts/539187/%E8%BF%87%E6%BB%A4Sotwe%E8%BD%AC%E8%B4%B4Remove%20Retweeted%20Containers%20fo%20Sotwe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主删除函数
    function removeRetweetedContainers() {
        // 获取所有目标容器
        const containers = document.querySelectorAll('div.d-flex.flex-column.mt-2');
        containers.forEach(container => {
            // 在容器内查找特定的 span 元素
            const captionDiv = container.querySelector('div.d-flex.caption.text--secondary');
            if (!captionDiv) return;

            const targetSpan = Array.from(captionDiv.querySelectorAll('span'))
                .find(span => span.textContent.trim() === 'retweeted');

            // 如果找到目标 span，则删除整个容器
            if (targetSpan) {
                container.remove();
                console.log('Removed retweeted container:', container);
            }
        });
    }

    // 初始执行
    removeRetweetedContainers();

    // 使用 MutationObserver 监听动态内容
    const observer = new MutationObserver(mutations => {
        let needCheck = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                needCheck = true;
            }
        });
        if (needCheck) {
            removeRetweetedContainers();
        }
    });

    // 开始监听整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();