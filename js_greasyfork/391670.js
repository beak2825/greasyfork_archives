// ==UserScript==
// @name         Tracking WeiBo pictures uploader - 追踪微博图床上传者
// @namespace    http://tampermonkey.net/
// @icon         https://www.weibo.com/favicon.ico
// @version      0.4
// @description  在页面右下角显示图片上传者的微博链接。
// @author       Sxul07
// @match        *://*.sinaimg.cn/*
// @match        *://*.sinaimg.com/*
// @match        *://*.sinaimg.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391670/Tracking%20WeiBo%20pictures%20uploader%20-%20%E8%BF%BD%E8%B8%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/391670/Tracking%20WeiBo%20pictures%20uploader%20-%20%E8%BF%BD%E8%B8%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function string62to10(number_code) {
        number_code = String(number_code);
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            radix = chars.length,
            len = number_code.length,
            i = 0,
            origin_number = 0;
        while (i < len) {
            origin_number += Math.pow(radix, i++) * chars.indexOf(number_code.charAt(len - i) || 0);
        }
        return origin_number;
    }

    function decode(url) {
        var lastIndexOfSlash = url.lastIndexOf('/');
        var number = url.substr(lastIndexOfSlash + 1, 8);
        if (number.startsWith('00')) {
            return string62to10(number);
        } else {
            return parseInt(number, 16);
        }
    }

    var div=document.createElement("div");

    div.id = "tracking-box";
    var weiboUrl = "https://weibo.com/u/" + decode(window.location.href);
    div.innerHTML = '<style>.tracking-box-inside{border:none;border-radius:5px;padding: 5px; color: darkblue;background-color: lightgray;position:fixed;bottom:10px;right:20px;z-index:9999999999;}</style><div class="tracking-box-inside">From: <a style="color: #333;" href=' + weiboUrl + '>' + weiboUrl + '</a></div>';
    document.body.appendChild(div);
    document.getElementById('tracking-box').addEventListener("click", function () {
        document.getElementById('tracking-box').innerHTML = "";
    });
})();