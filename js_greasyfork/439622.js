// ==UserScript==
// @name         鲁班解析,全网vip解析
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  腾讯、爱奇艺、优酷解析vip视频!
// @author       鲁班七号
// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://*.qq.com/x/cover/*
// @include           *://*.qq.com/x/page/*
// @include           *://*.qq.com/tv/*
// @grant        none
// @license MIT
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/439622/%E9%B2%81%E7%8F%AD%E8%A7%A3%E6%9E%90%2C%E5%85%A8%E7%BD%91vip%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/439622/%E9%B2%81%E7%8F%AD%E8%A7%A3%E6%9E%90%2C%E5%85%A8%E7%BD%91vip%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

        const originalInterfaceList = [{
            "name": "OK解析",
            "category": "1",
            "url": "https://okjx.cc/?url="
        }];

        function launchProgram() {

            const originalUrl = originalInterfaceList[0].url;
            const locationUrl = location.href;

            console.log(location)
            var urlReg = /.*\/?[url|jx|v]=.*/i;
            var urlReg2 = /.*\/?jx=.*/i;

            if (urlReg.test(locationUrl) || urlReg2.test(locationUrl)) {
                document.title="鲁班解析";
            } else {
                $('body').append("<div id='lubanAnalysis' style='width:66px;height:66px;z-index:1000;background-color:red;text-align:center;line-height:66px;border-radius:33px;font-size:14px;position:fixed;right:50px;bottom:50px;color:white'>鲁班解析</div>");
                $("#lubanAnalysis").click(function() {
                    const analysisUrl = originalUrl+ locationUrl;
                    window.open(analysisUrl)
                })
            }
        }
        launchProgram();
})();