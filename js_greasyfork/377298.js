// ==UserScript==
// @name         百度春晚fuck
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除2019年春节期间百度春晚的广告
// @author       xiaoyang
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377298/%E7%99%BE%E5%BA%A6%E6%98%A5%E6%99%9Afuck.user.js
// @updateURL https://update.greasyfork.org/scripts/377298/%E7%99%BE%E5%BA%A6%E6%98%A5%E6%99%9Afuck.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {
        var local_url = location.href;
        if (local_url.indexOf("baidu") > -1) {
            $(".chunwan-wrapper").css("display", "none");
        }
    });

})();