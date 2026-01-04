// ==UserScript==
// @name         屏蔽搜索部分结果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于屏蔽某站搜索的部分结果，直接进行移除
// @author       海石花
// @match        https://www.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481840/%E5%B1%8F%E8%94%BD%E6%90%9C%E7%B4%A2%E9%83%A8%E5%88%86%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/481840/%E5%B1%8F%E8%94%BD%E6%90%9C%E7%B4%A2%E9%83%A8%E5%88%86%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
const list = {
    "mu": [
        "https://blog.csdn.net/",
        "wenku.baidu.com",
        "www.oschina.net"
    ],
    "tpl": [
        "open_source_software"
    ]
}
/**
 * 获取 content-left 下的所有 div 元素
 * 遍历每一个 div 元素
 * 获取 mu 属性的值
 * 检查 mu 属性的值是否包含在 arr 数组中
 * 如果包含在 arr 数组中，则移除该 div 元素
 */
function removeCsdn() {
    var contentLeftDiv = document.getElementById('content_left');
    if (contentLeftDiv) {
        var divs = contentLeftDiv.querySelectorAll('div');
        divs.forEach(function (div) {
            var muValue = div.getAttribute('mu');
            var tplValue = div.getAttribute('tpl')
            if (muValue && list.mu.some(item => muValue.includes(item))) {
                div.remove();
            }
            else if (tplValue && list.tpl.some(item => tplValue.includes(item))) {
                div.remove();
            }
        });
    }
}
//为什么这么多监听,因为有的不会起效
var targetNode = document
var config = { attributes: true, childList: true, subtree: true };
var observer = new MutationObserver(removeCsdn);
observer.observe(targetNode, config);
addEventListener('DOMContentLoaded', removeCsdn)
addEventListener('load', removeCsdn)