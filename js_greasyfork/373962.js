// ==UserScript==
// @name         CSDN博客百度广告移除
// @namespace    http://tampermonkey.net/
// @version      0.4
// @note         0.1 基础代码完成
// @note         0.2 修复iframe异常导致无法移除的报错原因，更改为定时器5秒检测一次
// @note         0.3 移除其他广告位和可恶的彩蛋图标
// @note         0.4 修复网络异常造成的网页bug，更改为延时启动清理。修改定时器循环规则。
// @description  try to take over the world!
// @author       ZhangLee
// @match        https://blog.csdn.net/
// @include         *://blog.csdn.net/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373962/CSDN%E5%8D%9A%E5%AE%A2%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/373962/CSDN%E5%8D%9A%E5%AE%A2%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timename = '';
    var count = 0;
    function removeIframe() {
        count = count+1;
        console.log('定时清理循环'+count+'次！');
        var  f1,f2,f3,f4,f5 = false;
        var iframe = $('iframe');
        for (var i = 0; i < iframe.length; i++) {
            var src = $(iframe[i]).attr('src');
            if (typeof(src) != "undefined" && src.indexOf('baidu') >-1) {
                $(iframe[i]).remove();
                f1 = true;
            };
        }

        var p1 = $('div[class="p4course_target"]');
        var p2 = $('div[class="pulllog-box"]');
        var p3 = $('div[class="csdn-tracking-statistics mb8 box-shadow"]');
        var p4 = $('li[class="bdsharebuttonbox _360_interactive bdshare-button-style0-16"]');


        if (typeof(p1) != "undefined"){
            p1.remove();
            f2 = true;
        }
        if (typeof(p2) != "undefined"){
            p2.remove();
            f3 = true;
        }
        if (typeof(p3) != "undefined"){
            p3.remove();
            f4 = true;
        }
        if (typeof(p4) != "undefined"){
            p4.remove();
            f5 = true;
        }
        if(f1 && f2 && f3 && f4 && f5){
            console.log('清理完成，退出循环，销毁定时器！');
            clearInterval(timename);
        }
    }
    //removeIframe();
    timename = setInterval(removeIframe,1000);
})();