// ==UserScript==
// @name         自动转换https链接为超链接并高亮显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将网页中的所有https链接自动转换为可点击的超链接并高亮显示
// @author       wuyi
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524735/%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2https%E9%93%BE%E6%8E%A5%E4%B8%BA%E8%B6%85%E9%93%BE%E6%8E%A5%E5%B9%B6%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524735/%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2https%E9%93%BE%E6%8E%A5%E4%B8%BA%E8%B6%85%E9%93%BE%E6%8E%A5%E5%B9%B6%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更新的正则表达式，匹配包含路径、查询参数、哈希的https链接
    var regex = /https:\/\/[^\s<>"']+(?:[#?][^\s]*)?/g;

    // 遍历页面中所有文本节点
    function convertLinks(node) {
        var child;
        if (node.nodeType === 3) { // 如果是文本节点
            var newText = node.nodeValue.replace(regex, function(match) {
                return `<a href="${match}" target="_blank" class="highlight-link">${match}</a>`;
            });

            if (newText !== node.nodeValue) {
                var span = document.createElement('span');
                span.innerHTML = newText;
                node.parentNode.replaceChild(span, node);
            }
        } else {
            for (child = node.firstChild; child; child = child.nextSibling) {
                convertLinks(child); // 遍历所有子节点
            }
        }
    }

    // 触发转换
    convertLinks(document.body);
})();
