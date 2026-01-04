// ==UserScript==
// @name         网站无障碍浏览
// @namespace    https://greasyfork.org/zh-CN/scripts/452145
// @version      0.3
// @description  无障碍版网站是指视力残障人士和听力残障人士可以利用互联网方便地、无障碍地获取信息、浏览网页信息，如无法正常获取信息，要使用替代式的方式或者辅助工具来帮助人们完成信息的输入输出。网站需要提供辅助工具及语言功能的无障碍服务，方便残障人士从网络上获取信息。
// @author       Wilson
// @icon         https://img2.baidu.com/it/u=661049309,3687874714&fm=253&fmt=auto&app=138&f=JPEG?w=309&h=309
// @require      https://apps.bdimg.com/libs/jquery/1.10.2/jquery.min.js
// @require https://greasyfork.org/scripts/412875-waituntil/code/WaitUntil.js?version=856255
// @match        *://*/*
// @exclude      *://gmail.com/*
// @exclude      *://mail.*.com/*
// @exclude      *://mail.163.com/*
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/452145/%E7%BD%91%E7%AB%99%E6%97%A0%E9%9A%9C%E7%A2%8D%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/452145/%E7%BD%91%E7%AB%99%E6%97%A0%E9%9A%9C%E7%A2%8D%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").append(`<script id="rrbayJs" src="https://wza.rrbay.com/js/wza.min.js" type="text/javascript"></script>`);
    WaitUntil(function(){return typeof isMobile !=="undefined"}, function(){
        if(!isMobile()){
            $("body").append(`<a id="wzayd" style="position:fixed;z-index:999;right:20px;bottom:64px;padding:1px;border-radius:50%;border:1px solid #999;" title="无障碍浏览（Alt+G）" href="javascript:;" class="wzayd" accesskey="g"><img style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA7VBMVEUAAAD////////s8v////+txP+qwv+4zf/w9f/2+P+hu//Q3f+yyP+4zf/Q3f////+kvv+90P+80f+2yv/S4P/T4P/M2//z9/+cuP/V4P9Whv////9Uhf9Sg/9Pgf9NgP/8/f9di/9Xh/9lkf5aif9qlP7z9//k7P/c5v+2y/94nv51nP6lv/+LrP6Ep/6BpP5gjf7v9P+wxv/U4f/M2/+sxP+vxv73+f/P3v/J2v+5zf+ivP+fuv9xmf+Ytv6Usv6Hqf58of5vl/7m7v/g6f+zyf6QsP75+//q8P/B0v/W4//C1P6+0P6qwv6ct/76fHZiAAAAGnRSTlMAGAaVR/Py45aC9Mfy2b8t9OPZ2ce/v4L0x/e74/EAAAIZSURBVDjLZVPXYuIwEDSmQ4BLv5O0ku3Yhwu2IZTQe0hy7f8/57QSoYR5sVea1c424wgzl324LRRuH7I507hEJluYucCFEOBGhWzmy7X5+N0WwIjTbrcdBsKulM0z96onGCGE2X6n+cTkj/CqJ480igzkNXp26E9JkABSbBz8i4Bn3EkH840mKHoxs49fZQzt2Kd03FQEzSB3WsejB9Jqf1CJQBM0wCurABWBoub0gkDENwyStTHA62pwSWDtklRQ4FLfjnaiPqVW60hAYeLKNHIREOZuKTL80H6XBFCwn4BAmDOyLiOQUIlOSEjaoS+Ju57NZuul73Fml4w6yAivSLBW3MGfcfBmIegmArg3alICdJHgy1jQt8Z/6CcC4DdGXhLIoiWRACpbLYbDYW80GnXp2GH8ShP+PUvEoHsAIFq9Xm8+kXlIwkkI9pm+05Tm3yWqu9EiB0pkwjWBx2i+tND1XqeZqpPU4VhUbq/ekR8CwTRVoRxf3ifTbeIwcONNsJZ2lxFVKDMv1KNvS2zXdrnD+COvR1PQpTZKNlKD3cLCOJNnivgVxkw169BunlKFaV9/B+LQbqOsByY4IVgDB59dl/cjR9TIJV1Lh7CGqUqH/DDPhhZYOPkdLz6m0X7GrzPHsSe6zJwzxvm+5NeNi8U5ABfn7mz7zHJFrZ6+BY6rd7m8kQtcAtwwXzq4n69/vZbP1+pn6/8fsrRmHUhmpYYAAAAASUVORK5CYII=" /></a>`);
        }
    });
})();