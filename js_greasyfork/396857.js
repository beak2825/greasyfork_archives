// ==UserScript==
// @name         知乎/简书去除安全中心，直接跳转链接地址。
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  屏蔽知乎/简书安全中心，直接跳转链接地址。
// @author       CeeYang
// @match        https://*.zhihu.com/*
// @match        https://*.jianshu.com/*
// @match        https://*.ld246.com/*
// @match        https://*.qq.com/*
// @match        https://*.yuque.com/*
// @match        https://*.juejin.cn/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/396857/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E5%8E%BB%E9%99%A4%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/396857/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E5%8E%BB%E9%99%A4%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E3%80%82.meta.js
// ==/UserScript==

// changelog:    2020-04-09 10:26:08： 更新简书规则；
// changelog:    2020-04-21 10:56:30： 简书规则更新，跟下判断模式，理论上简书规则更新后脚本依旧能用
// changelog:    2021-07-26 11:33:19： 此规则适用于大部分网页,如发现未适配该网站,请修改本地脚本手动添加 @match 即可

(function () {
    'use strict';


    /// 地址类型
    /// https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Falibaba%2Ffish-redux
    /// https://link.jianshu.com/?t=https%3A%2F%2Fgithub.com%2Falibaba%2Ffish-redux
    /// https://link.zhihu.com/?target=https%3A//www.royalapplications.com/ts/mac/features

    /// 获取所以 a 标签
    /// 循环判断 a 标签是否包含两个 http 字样
    /// 截取最后一个 http 内容, 并格式化
    /// 理论上支持所有网页
    /// 如需支持其他网页,请在头部新增你需要的网址
    /// 例如: @match        https://*.zhihu.com/*

    getRightHref();

    window.onscroll = function () { setTimeout(function () { getRightHref();}, 800); }

    /// 获取正确的地址用于跳转
    function getRightHref() {
        var documents = document.getElementsByTagName("a");
        for (var i = 0; i < documents.length; i++) {
            if (documents[i].href.split("http").length > 2) {
                documents[i].setAttribute("href", decodeURIComponent("http" + documents[i].href.split("http")[2]))
            }
        }
    }

})();