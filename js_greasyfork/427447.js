// ==UserScript==
// @name         阿里巴巴国际站商品视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于下载阿里巴巴国际站商品的视频
// @author       小白
// @match        https://www.alibaba.com/product-detail/*
// @grant        unsafeWindow
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/427447/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E5%95%86%E5%93%81%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/427447/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E5%95%86%E5%93%81%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function(){
        $('#block-mainscreen-left').before('<button id="buttonStart" style="position:fixed;left:0px;background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;">下载视频</button>');

        $('#buttonStart').click(function(){
            var a = $('video:first').attr('src');
            var url = a;
            alert("复制到网址栏打开："+a)
        })
    })

})();