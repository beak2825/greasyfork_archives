// ==UserScript==
// @name         自动链接精简冗余链接
// @namespace    none
// @version      1.0
// @description  淘宝、天猫、百度搜索 链接自动精简
// @author       KaidQiao
// @include      *.taobao.com/*
// @include      *.tmall.com/*
// @include      *www.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510200/%E8%87%AA%E5%8A%A8%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80%E5%86%97%E4%BD%99%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/510200/%E8%87%AA%E5%8A%A8%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80%E5%86%97%E4%BD%99%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    }

    function cleanUrl() {
        var site = window.location.href.match(/^http(s)?:\/\/[^?]*/);
        var wd = getQueryString("wd");
        var id = getQueryString("id");
        var q = getQueryString("q");
        var pureUrl = "";

        if (wd != null) {
            pureUrl = site[0] + "?wd=" + wd;
        } else if (id != null) {
            pureUrl = site[0] + "?id=" + id;
        } else if (q != null) {
            pureUrl = site[0] + "?q=" + q;
        } else if (site[0].substr(site[0].length - 13) == "view_shop.htm") {
            pureUrl = window.location.protocol + "//" + window.location.host;
        } else {
            pureUrl = site[0];
        }

        if (window.location.href !== pureUrl) {
            window.location.href = pureUrl;  // 自动跳转到精简后的链接
        }
    }

    cleanUrl();  // 页面加载时自动精简链接
})();
