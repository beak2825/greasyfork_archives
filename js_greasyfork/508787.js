// ==UserScript==
// @name         CSDN去登录、去关注看全文、去登录粘贴代码、去代码折叠、去vip查看文章
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改CSDN博客页面的样式和移除一些元素
// @author       去除CSDN关注查看全文
// @match        https://blog.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508787/CSDN%E5%8E%BB%E7%99%BB%E5%BD%95%E3%80%81%E5%8E%BB%E5%85%B3%E6%B3%A8%E7%9C%8B%E5%85%A8%E6%96%87%E3%80%81%E5%8E%BB%E7%99%BB%E5%BD%95%E7%B2%98%E8%B4%B4%E4%BB%A3%E7%A0%81%E3%80%81%E5%8E%BB%E4%BB%A3%E7%A0%81%E6%8A%98%E5%8F%A0%E3%80%81%E5%8E%BBvip%E6%9F%A5%E7%9C%8B%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/508787/CSDN%E5%8E%BB%E7%99%BB%E5%BD%95%E3%80%81%E5%8E%BB%E5%85%B3%E6%B3%A8%E7%9C%8B%E5%85%A8%E6%96%87%E3%80%81%E5%8E%BB%E7%99%BB%E5%BD%95%E7%B2%98%E8%B4%B4%E4%BB%A3%E7%A0%81%E3%80%81%E5%8E%BB%E4%BB%A3%E7%A0%81%E6%8A%98%E5%8F%A0%E3%80%81%E5%8E%BBvip%E6%9F%A5%E7%9C%8B%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除article_content的style属性
    var article_content = document.getElementById("article_content");
    if (article_content) {
        article_content.removeAttribute("style");
    }

    // 移除follow-text元素
    var follow_text = document.getElementsByClassName('follow-text')[0];
    if (follow_text && follow_text.parentElement && follow_text.parentElement.parentElement) {
        follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);
    }

    // 移除hide-article-box元素
    var hide_article_box = document.getElementsByClassName('hide-article-box')[0];
    if (hide_article_box && hide_article_box.parentElement) {
        hide_article_box.parentElement.removeChild(hide_article_box);
    }

    // 移除登录弹窗
    var loginContainer = document.querySelector('.passport-login-container');
    if (loginContainer) {
        loginContainer.remove();
    }
    // 函数用于展开隐藏的代码块
    function expandCodeBlocks() {
        const hideCodeButtons = document.querySelectorAll('.hide-preCode-bt');
        hideCodeButtons.forEach(button => {
            button.click();
        });
    }

    // 检查页面是否加载完成，然后执行展开操作
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", expandCodeBlocks);
    } else {
        expandCodeBlocks();
    }
})();