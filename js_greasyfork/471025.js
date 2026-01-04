// ==UserScript==
// @name           广告屏蔽
// @name:zh-TW     广告屏蔽
// @version        1.0.0
// @description    全广告屏蔽
// @description:zh-tw 全广告屏蔽
// @namespace      lm
// @author         lm
// @match        *://*.nxbrew.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471025/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/471025/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
(function () {
    var header = document.getElementsByTagName("header")[0];
    var arr = header.getElementsByTagName("script")
// outerHTML匹配,删除profitabledisplaycontent脚本
    for (var script of arr) {
        if (script.outerHTML.indexOf("profitabledisplaycontent") != -1) {
            header.removeChild(script);
        }
    }
// 删除id为custom_html-8元素
    document.getElementById("custom_html-8").remove();
})()
