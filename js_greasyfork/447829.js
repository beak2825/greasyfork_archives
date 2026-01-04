// ==UserScript==
// @name         九江学院电子资源平台链接直接跳转和账号自动填写助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  用于九江学院电子资源平台链接直接跳转助手
// @license      九江学院电子资源平台链接直接跳转助手
// @author       文人病
// @match        *://jxjjxy.cwkeji.cn/ermsClient/*
// @match        *://jxjjxy.cwkeji.cn/ermsLogin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447829/%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E7%94%B5%E5%AD%90%E8%B5%84%E6%BA%90%E5%B9%B3%E5%8F%B0%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%92%8C%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447829/%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E7%94%B5%E5%AD%90%E8%B5%84%E6%BA%90%E5%B9%B3%E5%8F%B0%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%92%8C%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var user_name = ""; //学号
var user_password = "" ; //密码
(function() {
    'use strict';
    // Your code here...
    var urls = $(".green").attr("href");
    $( "input[name='userName']").val(user_name)
    $( "input[name='password']").val(user_password)
    $(window).attr('location',urls);
})();