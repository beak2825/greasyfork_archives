// ==UserScript==
// @name         青年大学习直达完成界面
// @namespace    https://ez118.github.io/
// @version      0.7
// @description  跳过青年大学习的视频部分，直达完成界面
// @author       ZZY_WISU
// @match        *://h5.cyol.com/*
// @license      GNU GPLv3
// @icon         https://h5.cyol.com/special/daxuexi/ge5la0h6qb/images/collect_yellow.png
// @grant        none
// @run-at document-end
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/447721/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E7%9B%B4%E8%BE%BE%E5%AE%8C%E6%88%90%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/447721/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E7%9B%B4%E8%BE%BE%E5%AE%8C%E6%88%90%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

var loadDuration = 1000; /* 加载后破解脚本的等待时间，单位：ms */

(function() {
    //https://h5.cyol.com/special/daxuexi/ck6hfr2g0y/m.html?t=1&z=201
    'use strict';
    var SUrl = window.location.href.split("/");
    if(SUrl[SUrl.length - 1] == "index.html") {

        setTimeout(function(){
            $("iframe").contents().find('.section3').addClass('topindex2');
        }, loadDuration);
    } else if(SUrl[SUrl.length - 1].split("?")[0] == "m.html" && top.location.href == window.location.href && SUrl.slice(-2)[0].slice(0,10) != "daxuexiall") {
        setTimeout(function(){
            $('.section3').addClass('topindex2');
        }, loadDuration);
    }
})();