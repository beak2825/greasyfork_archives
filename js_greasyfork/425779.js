// ==UserScript==
// @name        阿尔斯神 · 屏蔽百度广告（已搜索界面）
// @namespace   https://www.baidu.com/s?*
// @match       https://www.baidu.com/s?*
// @match       https://www.baidu.com/sf/*
// @grant       none
// @version     2.0
// @author      阿尔斯神
// @match       www.baidu.com
// @description 2021-5-1 14:38:40
// @downloadURL https://update.greasyfork.org/scripts/425779/%E9%98%BF%E5%B0%94%E6%96%AF%E7%A5%9E%20%C2%B7%20%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%EF%BC%88%E5%B7%B2%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/425779/%E9%98%BF%E5%B0%94%E6%96%AF%E7%A5%9E%20%C2%B7%20%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%EF%BC%88%E5%B7%B2%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==
//以下是代码
(function () {
    'use strict';
    //阅读全文
    $("div").remove("#content_right");
    //已搜索界面右边的推荐
    $("div").remove("#rs");
    //下面最后的搜索推荐词条
    $("div").remove("#Zuniqueid__1");
})();