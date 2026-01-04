// ==UserScript==
// @name         WEPE下载页去除捐赠窗口
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除WEPE下载页捐赠窗口并自动点击获取下载地址
// @author       lvzhenbo
// @match        https://www.wepe.com.cn/download.html
// @icon         http://www.wepe.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440596/WEPE%E4%B8%8B%E8%BD%BD%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%8D%90%E8%B5%A0%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/440596/WEPE%E4%B8%8B%E8%BD%BD%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%8D%90%E8%B5%A0%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var node1=document.getElementById("u189");
    var node2=document.getElementById("u186");
    node1.parentNode.removeChild(node1);
    node2.parentNode.removeChild(node2);
    document.getElementById("u150").click();
})();