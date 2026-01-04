// ==UserScript==
// @name         关闭网站黑白显示
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license      WTFPL
// @description  部分网站变灰看得很累，所以随便写了个脚本
// @author       scientificworld
// @match        *://*/*
// @run-at       document-body
// @require      https://greasyfork.org/scripts/455875-akilib/code/AkiLib.js?version=1123973
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/455798/%E5%85%B3%E9%97%AD%E7%BD%91%E7%AB%99%E9%BB%91%E7%99%BD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/455798/%E5%85%B3%E9%97%AD%E7%BD%91%E7%AB%99%E9%BB%91%E7%99%BD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var regex = /grayscale\\(.*?\\)/gi;
    var config = [aki.createCheckboxMenu("修改所有标签的样式"), aki.createCheckboxMenu("对特定网站进行优化", true)];
    if (aki.getMenuValue(config[1])) {
        var url = location.href;
        if (/^https:\/\/www.baidu.com\/$/.test(url)) {
            document.getElementById("su").style.backgroundColor = "#4e6ef2";
        }
    }
    if (aki.getMenuValue(config[0])) {
        for (var node of document.getElementsByTagName("*")) {
            node.style.filter = node.style.filter.replace(regex, "") + "grayscale(0)";
        }
    } else {
        document.documentElement.style.filter = document.documentElement.style.filter.replace(regex, "") + "grayscale(0)";
        document.body.style.filter = document.body.style.filter.replace(regex, "") + "grayscale(0)";
    }
})();