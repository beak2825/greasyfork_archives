// ==UserScript==
// @name         自动跳过QQ网址拦截 (额外支持了更多页面)
// @version      1.0.2
// @description  自动跳过QQ网址拦截 (额外支持QQ「已停止访问此链接」与腾讯文档「网站含有危险信息」页面)，同时保护隐私、移除QQ号等信息（参数）, F_U_C_K
// @author       Jack.Chan (fulicat@qq.com), GalvinGao
// @namespace    http://github.com/GalvinGao
// @match        *://c.pc.qq.com/*
// @match        *://docs.qq.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465100/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA%20%28%E9%A2%9D%E5%A4%96%E6%94%AF%E6%8C%81%E4%BA%86%E6%9B%B4%E5%A4%9A%E9%A1%B5%E9%9D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465100/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA%20%28%E9%A2%9D%E5%A4%96%E6%94%AF%E6%8C%81%E4%BA%86%E6%9B%B4%E5%A4%9A%E9%A1%B5%E9%9D%A2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getParams(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return '';
    }
    var url = (window.location.pathname === "/ios.html" || window.location.pathname === "/scenario/link.html") ? getParams("url") : getParams('pfurl');
    if (url) {
        window.location.replace(url);
    }
})();