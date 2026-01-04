// ==UserScript==
// @name         百度题库-显示答案
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  百度题库-点击页面右上方“显示答案”按钮，就能显示百度题库隐藏掉的答案了。
// @author       Terrance Monk
// @match        https://easylearn.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478522/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93-%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478522/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93-%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
        var str = $("<button id='absBtn' style='background: red; color: #fff; width: 150px; height: 40px; z-index: 9999;position: fixed; top: 20px; right: 20px;text-align: center;font-size: 20px;cursor:pointer;'>显示答案</button>");
        $('body').append(str);
        $('#absBtn').bind('click', function(){
            let mask = $('.mask');
            mask= $('.question-cont .shiti-answer .text .mask');
            mask.css('opacity', '0');
        });
    });

})();