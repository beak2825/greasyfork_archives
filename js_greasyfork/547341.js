// ==UserScript==
// @name         Flickr 反广告拦截窗口杀手
// @name:zh-CN   Flickr 反广告拦截窗口杀手
// @name:zh-TW   Flickr 反廣告攔截彈窗殺手
// @description  去除 Flickr 的反广告拦截弹窗，使用 ChatGPT4 编写
// @description:zh-CN 去除 Flickr 的反广告拦截弹窗，使用 ChatGPT4 编写
// @description:zh-TW 刪除 Flickr 的反廣告攔截彈窗，使用 ChatGPT4 編寫
// @author       caoyise
// @version      1.0.0
// @license      GPL-3.0
// @icon         https://www.flickr.com/images/opensearch-flickr-logo.png
// @match        https://www.flickr.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/505958
// @downloadURL https://update.greasyfork.org/scripts/547341/Flickr%20%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E7%AA%97%E5%8F%A3%E6%9D%80%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547341/Flickr%20%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E7%AA%97%E5%8F%A3%E6%9D%80%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const elements = ['div.dgEhJe6g','div.aI8fZlpv','style[id="yui_3_16_0_1_1756201285967_1858"]'];// 元素查找
        elements.forEach(element => {
            const nodes = document.querySelectorAll(element);
            nodes.forEach(node => node.remove()); // 删除元素
        });
    }, 500);// 操作延时，单位毫秒
})();