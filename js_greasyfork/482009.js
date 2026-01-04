// ==UserScript==
// @name         删除网页所有超链接
// @version      0.2
// @description  去除网页所有超链接，并保留超链接的文本与图片。
// @author       
// @match        
// @namespace https://greasyfork.org/users/215810
// @downloadURL https://update.greasyfork.org/scripts/482009/%E5%88%A0%E9%99%A4%E7%BD%91%E9%A1%B5%E6%89%80%E6%9C%89%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/482009/%E5%88%A0%E9%99%A4%E7%BD%91%E9%A1%B5%E6%89%80%E6%9C%89%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个观察器配置
    var observerConfig = {
        childList: true,  // 监视子节点的变化
        subtree: true     // 包括所有后代节点
    };

    // 定义一个回调函数，处理变化
    var mutationCallback = function(mutationsList, observer) {
        // 获取当前网页所有超链接元素
        var links = document.querySelectorAll('a');

        // 去除网页所有超链接并保留文字
        links.forEach(function(link) {
            var textNode = document.createTextNode(link.textContent);
            link.parentNode.replaceChild(textNode, link);
        });
    };

    // 创建一个观察器实例，并传入回调函数
    var observer = new MutationObserver(mutationCallback);

    // 选择需要观察变化的目标节点
    var targetNode = document.body;

    // 使用观察器配置和目标节点开始观察
    observer.observe(targetNode, observerConfig);
})();
