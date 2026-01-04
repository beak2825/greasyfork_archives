// ==UserScript==
// @name         🆕 CSDN 免登录复制 去除剪贴板劫持 全文阅读 去掉红包雨
// @description  CSDN 免登录复制 去除剪贴板劫持 全文阅读
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       SAI
// @grant        GM_addStyle
// @connect      www.csdn.net
// @include      *://*.csdn.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/434286/%F0%9F%86%95%20CSDN%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%20%E5%8E%BB%E9%99%A4%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%8A%AB%E6%8C%81%20%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%20%E5%8E%BB%E6%8E%89%E7%BA%A2%E5%8C%85%E9%9B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/434286/%F0%9F%86%95%20CSDN%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%20%E5%8E%BB%E9%99%A4%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%8A%AB%E6%8C%81%20%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%20%E5%8E%BB%E6%8E%89%E7%BA%A2%E5%8C%85%E9%9B%A8.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    'use strict';

    //去除登录框
    GM_addStyle(".login-mark,#passportbox{display:none!important;}");
    GM_addStyle(".passport-login-container{display:none!important;}");
    // 去除推广广告
    $("li[data-type='ad']").remove();
    // 红包雨
    $("#csdn-redpack").remove();
    $(".toolbar-advert").remove();
    // 免登录复制
    $(".hljs-button").removeClass("signin");
    $(".hljs-button").addClass("{2}");
    $(".hljs-button").attr("data-title", "免登录复制");
    $(".hljs-button").attr("onclick", "hljs.copyCode(event)");
    // 去除剪贴板劫持
    $("code").attr("onclick", "mdcp.copyCode(event)");
    try {
        // 复制时保留原文格式，参考 https://greasyfork.org/en/scripts/390502-csdnremovecopyright/code
        Object.defineProperty(window, "articleType", {
            value: 0,
            writable: false,
            configurable: false
        });
    } catch (err) {
    }


    //全文阅读
    var ef =document.getElementsByClassName('hide-article-box text-center')[0]
    if (ef) {
        ef.remove();
        document.getElementById('article_content').style.height = 'auto';
    }
})();