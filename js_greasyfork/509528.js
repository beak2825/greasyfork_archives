// ==UserScript==
// @name         CSDN显示优化
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  去代码自动展开，去除关注博主查看全文
// @author       amaterasu
// @match        *://blog.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509528/CSDN%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/509528/CSDN%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".look-more-preCode").click();
    $("pre").css("overflow-y","auto");//显示代码
    $(".passport-login-tip-container").remove()//删除登录提示
    $(".passport-login-mark").remove()//删除突然弹出的登录框
    $("#article_content").removeAttr("style");
    $(".hide-article-box").remove();
})();