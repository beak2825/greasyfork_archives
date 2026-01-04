// ==UserScript==
// @name         clog2bat
// @home-url     https://greasyfork.org/zh-CN/scripts/468786-clog2bat
// @version      1.1
// @description  访问 clog 单条日志时重定向至 bat 日志
// @author       zwang57
// @match        http://logging.fws.qa.nt.ctripcorp.com/#/one-log/*
// @match        http://logging.ctripcorp.com/#/one-log/*
// @downloadURL
// @grant    GM_setClipboard
// @grant GM_getResourceText
// @grant GM_addStyle
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/468786/clog2bat.user.js
// @updateURL https://update.greasyfork.org/scripts/468786/clog2bat.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //示例
    //http://logging.fws.qa.nt.ctripcorp.com/#/one-log/10.128.191.40-5-20230616134612-2589377871-4/1686895173697?app=100025553
    //http://bat.api.fws.qa.nt.ctripcorp.com/clog/100025553/one-log?rowKey=10.128.191.40-5-20230616134612-2589377871-4

    //http://logging.ctripcorp.com/#/one-log/1669607237981569146/1686900359994?app=100020533
    //http://bat-api-datasource.ctripcorp.com/clog/100020533/one-log?rowKey=1669607237981569146

    var baseUrl;
    if (document.domain == "logging.ctripcorp.com") {
        baseUrl = "http://bat-api-datasource.ctripcorp.com/clog/"
    } else if (document.domain == "logging.fws.qa.nt.ctripcorp.com") {
        baseUrl = "http://bat.api.fws.qa.nt.ctripcorp.com/clog/"
    }

    // 获取当前链接
    var currentUrl = window.location.href;
    var parts = currentUrl.split('/'); // 先按照 / 分割字符串
    var rowKey = parts[parts.length - 2]; // 倒数第二个部分即为需要的 rowKey
    var app = currentUrl.split('=')[1]; // 按照 = 分割字符串，取第二个部分即为需要的 app
    var newUrl = baseUrl + app + "/one-log?rowKey=" + rowKey;
    console.log(newUrl);
    window.location.href = newUrl;
})();
