// ==UserScript==
// @name        禁止知乎/CSDN网页标题未读消息提示
// @namespace   Violentmonkey Scripts
// @match       https://*.zhihu.com/*
// @match       https://*.csdn.net/*
// @grant       none
// @version     17.0
// @author      -
// @description 知乎你妈死了
// @icon       
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/471419/%E7%A6%81%E6%AD%A2%E7%9F%A5%E4%B9%8ECSDN%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%9C%AA%E8%AF%BB%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/471419/%E7%A6%81%E6%AD%A2%E7%9F%A5%E4%B9%8ECSDN%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%9C%AA%E8%AF%BB%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==   

(function() {
    'use strict';

    // 定义一个函数，用于修改标题
    function updateTitle() {
        let newTitle = document.title.match(/(\([0-9]+.*(?=私信|消息).*?\)\s*)?(.+)/)[2];
        Object.defineProperty(document, 'title', { value: newTitle, configurable: true });
    }

    // 使用 MutationObserver 监听标题元素的变化
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target === document.head) {
                // 当标题元素发生变化时重新修改标题
                updateTitle();
            }
        }
    });

    // 开始监听标题元素所在的 head 元素
    observer.observe(document.head, { childList: true });

    // 立即修改标题
    updateTitle();

    // 每隔 2 秒再次修改标题，确保标题不被篡改回去
    setInterval(updateTitle, 2000);
})();