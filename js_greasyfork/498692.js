// ==UserScript==
// @name         贴吧奇怪域名重定向
// @version      0.7
// @description  把一些奇怪的域名重定向到tieba.baidu.com
// @author       rteta
// @match        *://nba.baidu.com/*
// @match        *://nani.baidu.com/*
// @match        *://c.tieba.baidu.com/*
// @match        *://tiebac.baidu.com/*
// @match        *://www.tieba.com/*
// @match        *://jump2.bdimg.com/*
// @match        *://jump.bdimg.com/*
// @match        *://youhua.baidu.com/*
// @match        *://ala.baidu.com/*
// @match        *://static.tieba.baidu.com/*
// @match        *://fexclick.baidu.com/*
// @match        *://wefan.baidu.com/*
// @match        *://post.baidu.com.cn/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1217761
// @downloadURL https://update.greasyfork.org/scripts/498692/%E8%B4%B4%E5%90%A7%E5%A5%87%E6%80%AA%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/498692/%E8%B4%B4%E5%90%A7%E5%A5%87%E6%80%AA%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取当前页面的主机名
    var currentHostName = window.location.hostname;

    // 定义需要重定向的域名列表
    var domainsToRedirect = [
        'nba.baidu.com',
        'nani.baidu.com',
        'c.tieba.baidu.com',
        'tiebac.baidu.com',
        'www.tieba.com',
        'jump2.bdimg.com',
        'jump.bdimg.com',
        'youhua.baidu.com',
        'ala.baidu.com',
        'static.tieba.baidu.com',
        'fexclick.baidu.com',
        'wefan.baidu.com',
        'post.baidu.com.cn'
    ];

    // 目标主机名
    var targetHostName = "tieba.baidu.com";

    // 检查当前主机名是否在需要重定向的域名列表中
    if (domainsToRedirect.includes(currentHostName)) {
        // 构建新的URL，保留原始的路径和查询参数
        var newURL = new URL(window.location.href);
        newURL.hostname = targetHostName;
        // alert("即将重定向到: " + newURL.href);
        // 将页面重定向到新的URL
        window.location.href = newURL.href;
    }

})();