// ==UserScript==
// @name         查找新浪微博图床图片的发布者
// @namespace    http://tampermonkey.net/
// @version      0.6
// @icon         https://www.weibo.com/favicon.ico
// @description  尝试找到新浪微博图床图片的发布者
// @author       You
// @match        *://*.sinaimg.cn/*
// @match        *://*.sinaimg.com/*
// @match        *://*.sinaimg.in/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371695/%E6%9F%A5%E6%89%BE%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A%E5%9B%BE%E7%89%87%E7%9A%84%E5%8F%91%E5%B8%83%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/371695/%E6%9F%A5%E6%89%BE%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A%E5%9B%BE%E7%89%87%E7%9A%84%E5%8F%91%E5%B8%83%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
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
    var desturl = "https://weibo.com/u/" + decode(window.location.href);
    $('body').prepend("<button>查看<br>发布者<br>微博</button>");
    $("button").css({"background-color":"#4CAF50","border":"none","color":"white","border-radius":"12px","position":"fixed","right":"10px","bottom":"10px"});
    $("button").click(function(){
        window.location = desturl;
    });
})();