// ==UserScript==
// @name         干爽搜索
// @author       公子有语
// @description 在Bing搜索引擎中去除CSDN的内容
// @version      1
// @grant        none
// @include      https://www.bing.com/search*
// @license      Mozilla
// @namespace https://greasyfork.org/users/1183543
// @downloadURL https://update.greasyfork.org/scripts/476320/%E5%B9%B2%E7%88%BD%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/476320/%E5%B9%B2%E7%88%BD%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

window.onload = function() {
    var results = document.getElementsByClassName("b_algo");
    var urlList = ["www.csdn.net", "blog.csdn.net"]; // 添加需要过滤的url
    for (var i = 0; i < results.length; i++) {
        var element = results[i];
        var host = element.querySelector("h2 > a").hostname;
        if (urlList.includes(host)) { // 检查链接地址是否在过滤列表中
            element.parentNode.removeChild(element);
            i--; // 跳过当前元素，确保不会多删除了一个元素
        }
    }
}