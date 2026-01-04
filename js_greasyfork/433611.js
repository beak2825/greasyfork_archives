// ==UserScript==
// @name         手机浏览不去安装app
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取消下载app按钮
// @author       ripple57
// @match        *://m.iqiyi.com/*
// @match        *://m.mgtv.com/*
// @match        *://m.v.qq.com/*
// @require      http://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433611/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E4%B8%8D%E5%8E%BB%E5%AE%89%E8%A3%85app.user.js
// @updateURL https://update.greasyfork.org/scripts/433611/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E4%B8%8D%E5%8E%BB%E5%AE%89%E8%A3%85app.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href = window.location.href;

    if(/m.iqiyi.com/i.test(href)){
         console.log("88888888iqiyi")
        $(".m-iqyGuide-layer").hide();
    }else if(/m.mgtv.com/i.test(href)){
         console.log("888888888888888.mgtv.c")
        $("div.mg-down-btn").hide()
    }else if(/m.v.qq.com/i.test(href)){
        console.log("888888888888888v.qq.com")
         $(".at-app-banner").hide();
    }

    // Your code here...
})();