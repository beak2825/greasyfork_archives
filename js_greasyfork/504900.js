// ==UserScript==
// @name         删除小黑盒互动地图app广告
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  自动删除小黑盒互动地图app广告
// @author       NoWorld
// @match        https://web.xiaoheihe.cn/tools/map?game_name=*&zoom=8
// @icon         https://web.xiaoheihe.cn/public/heybox_bbs_128_128.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504900/%E5%88%A0%E9%99%A4%E5%B0%8F%E9%BB%91%E7%9B%92%E4%BA%92%E5%8A%A8%E5%9C%B0%E5%9B%BEapp%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/504900/%E5%88%A0%E9%99%A4%E5%B0%8F%E9%BB%91%E7%9B%92%E4%BA%92%E5%8A%A8%E5%9C%B0%E5%9B%BEapp%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除元素
    function removeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            if (element) {
                element.remove();
            }
        });
    }

    // 创建观察者实例并传入回调函数
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 如果新增的节点中包含符合选择器的元素，则删除
            if (mutation.addedNodes.length) {
                removeElements('.com-download-guide');
            }
        });
    });

    // 观察文档的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始检查，以便在页面加载时也能处理
    removeElements('.com-download-guide');
})();
