// ==UserScript==
// @name         删除礼物框-抖音
// @namespace    https://github.com/rickhqh
// @author       Rick
// @version      1.2
// @description  删除具有指定 XPath 表达式的元素 - 抖音网站
// @match        *://live.douyin.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482725/%E5%88%A0%E9%99%A4%E7%A4%BC%E7%89%A9%E6%A1%86-%E6%8A%96%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/482725/%E5%88%A0%E9%99%A4%E7%A4%BC%E7%89%A9%E6%A1%86-%E6%8A%96%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xpathExpressions = [
        '//*[@id="_douyin_live_scroll_container_"]/div/div/div[1]/div[1]/div[3]', // 第一个要删除的元素的 XPath 表达式
        '//*[@id="_douyin_live_scroll_container_"]/div/div/div/div/div[3]'
    ];
    var contextNode = document; // 上下文节点，通常为 document
    var namespaceResolver = null; // 命名空间解析器，可选

    setTimeout(function() {
        xpathExpressions.forEach(function(xpathExpression) {
            var result = document.evaluate(xpathExpression, contextNode, namespaceResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            if (result.singleNodeValue) {
                var element = result.singleNodeValue;
                element.parentNode.removeChild(element);
            }
        });
    }, 3000); // 4秒延时
})();