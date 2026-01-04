// ==UserScript==
// @name         去除百度网盘分享链接推广提示
// @namespace    https://axutongxue.com/
// @version      0.2
// @description  再也不要看到这句话了："复制这段内容后打开百度网盘手机App，操作更方便哦"
// @author       阿虚同学
// @license      MIT
// @match        *://pan.baidu.com/disk/*
// @match        *://yun.baidu.com/disk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521922/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%8E%A8%E5%B9%BF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521922/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%8E%A8%E5%B9%BF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("body").addEventListener("copy", function(event) {
        try {
            let content = event.target.value;
            // 提取百度网盘链接（包含密码参数）
            let linkMatch = content.match(/(https:\/\/pan\.baidu\.com\/s\/[^\s]+\?pwd=[^\s]+)/);
            if (linkMatch) {
                content = linkMatch[1];
                event.clipboardData.setData("text", content);
                event.preventDefault();
            }
        } catch (error) {
            console.log("去除小尾巴失败o(╥﹏╥)o");
        }
    });
})();
