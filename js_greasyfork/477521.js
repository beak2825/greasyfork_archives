// ==UserScript==
// @name         习题生成器去除水印
// @namespace    http://www.52love1.cn/
// @version      1.1
// @description  习题生成器去除打印水印
// @author       G魂帅X
// @match        https://www.dayin.page/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477521/%E4%B9%A0%E9%A2%98%E7%94%9F%E6%88%90%E5%99%A8%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477521/%E4%B9%A0%E9%A2%98%E7%94%9F%E6%88%90%E5%99%A8%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
/* globals jQuery, $, layer, waitForKeyElements */

(function() {
    'use strict';

    // Your code here...
    var timer = setInterval(function(){
        var timer2 = setTimeout(() => {
            clearTimeout(timer2)
            timer2 = null
            if ($('.singlePaper .text-base').length > 0) {
                $('.singlePaper .text-base').remove()
            }
        }, 0)
    }, 200);
})();