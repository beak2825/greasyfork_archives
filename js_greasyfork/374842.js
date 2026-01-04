// ==UserScript==
// @name         阮一峰样式
// @version      1.1.0
// @description  个人向
// @author       Li
// @match        *://www.ruanyifeng.com/*
// @run-at       document-start
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/85311-%E5%BF%83%E6%BB%A1
// @downloadURL https://update.greasyfork.org/scripts/374842/%E9%98%AE%E4%B8%80%E5%B3%B0%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/374842/%E9%98%AE%E4%B8%80%E5%B3%B0%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    function start(){
        console.log('start')
        var els = [
            'article.hentry',
            'code[class*="language-"]',
            'pre[class*="language-"]'
        ];
        var style = document.createElement('style');
        style.id = 'lizhilin';
        style.type = 'text/css';
        var csstext = '';
        for (var i in els) {
            csstext += els[i] + '{font-family: Consolas, "微软雅黑";}';
        }
        style.innerHTML = csstext;
        document.documentElement.appendChild(style);
    }
    document.addEventListener("DOMContentLoaded", start);
    setTimeout(function() {
        var dom = document.querySelectorAll('.entry-sponsor, #cre')
        Array.from(dom).forEach(v => {
            v.remove()
        })
        console.log('广告已删除')
    }, 800)
})();