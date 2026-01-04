// ==UserScript==
// @name         手机百度搜索跳过中间页
// @version      1.0
// @description  自动跳过手机百度搜索结果底部大家都在搜的中间页，直接打开目标网页链接。
// @author       ChatGPT
// @match        https://www.baidu.com/*
// @match        https://m.baidu.com/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/473419/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BF%87%E4%B8%AD%E9%97%B4%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/473419/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BF%87%E4%B8%AD%E9%97%B4%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    if (url.indexOf("wd=") !== -1 || url.indexOf("word=") !== -1) {
        // 获取A标签元素
        var links = document.querySelectorAll("a.new-nextpage,a.new-nextpage-only,a.c-fwb.c-slink.c-blocka.c-slink-new-strong");

        // 遍历链接
        for (var i = 0; i < links.length; i++) {
            // 添加点击事件监听器
            links[i].addEventListener("click", function(e) {
                e.preventDefault();
                var link = this;
                // 延迟0.1秒后在当前标签中打开链接
                setTimeout(function() {
                    window.location.href = link.href;
                }, 100);
            });
        }
    }
})();
