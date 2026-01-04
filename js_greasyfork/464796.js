// ==UserScript==
// @name         CSDN阅读优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       libaofeng
// @description  去除CSDN网站的阅读限制和广告
// @match        https://blog.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464796/CSDN%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/464796/CSDN%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取文章内容元素，并删除内联样式属性
    var article_content = document.getElementById("article_content");
    if (article_content) {
        article_content.removeAttribute("style");
    }
    // 删除提示登录/注册的元素
    var follow_text = document.getElementsByClassName('follow-text')[0];
    if (follow_text) {
        follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);
    }
    // 删除弹出框
    var hide_article_box = document.getElementsByClassName(' hide-article-box')[0];
    if (hide_article_box) {
        hide_article_box.parentElement.removeChild(hide_article_box);
    }

})();
