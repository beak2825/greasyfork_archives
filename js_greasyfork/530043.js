// ==UserScript==
// @name         手机看虎扑
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  不下载APP看虎扑
// @author       toypoy
// @match         *://m.hupu.com/*
// @icon          https://w4.hoopchina.com.cn/images/m/favicon_new.ico
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/530043/%E6%89%8B%E6%9C%BA%E7%9C%8B%E8%99%8E%E6%89%91.user.js
// @updateURL https://update.greasyfork.org/scripts/530043/%E6%89%8B%E6%9C%BA%E7%9C%8B%E8%99%8E%E6%89%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('注入开始~~~~~~')
    var window_url = window.location.href;
    var website_host = window.location.host;
    console.log(window_url)
    console.log(website_host)
    document.cookie='sc=2;';
    window.addEventListener("load", function(){
        setTimeout(function() {
            //移除底部打开APP
            document.getElementsByClassName('open-hupu')[0].remove();
        },200);

        setTimeout(function(){
            //点击展开全部回复
            document.getElementsByClassName('expand-all-replies')[0].click();
        },500)

    });
})();