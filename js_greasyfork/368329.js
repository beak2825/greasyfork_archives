// ==UserScript==
// @resource icon1 http://tampermonkey.net/favicon.ico
// @name         camelcamelcamel移动到链接时显示图像
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       LiuLin
// @match

// @include http://*camelcamelcamel.com/*
// @include https://*camelcamelcamel.com/*

// @grant        none
//@require  http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368329/camelcamelcamel%E7%A7%BB%E5%8A%A8%E5%88%B0%E9%93%BE%E6%8E%A5%E6%97%B6%E6%98%BE%E7%A4%BA%E5%9B%BE%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/368329/camelcamelcamel%E7%A7%BB%E5%8A%A8%E5%88%B0%E9%93%BE%E6%8E%A5%E6%97%B6%E6%98%BE%E7%A4%BA%E5%9B%BE%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert(localtion.href)
    $('#products_list .product_image>a,#products_list .product_info .product_title>a').hover(function(e){
        var asin = $(this).attr('href').match(/\/product\/([0-9A-Z]{10})/)[1];
        var url = "https://charts.camelcamelcamel.com/us/" + asin +"/amazon.png?force=1&zero=0&w=725&h=440&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en";
        $('.tempImgBox').remove();
        var showImgBox = $('<div></div>');
        showImgBox.addClass("tempImgBox");
        showImgBox.css({
            width:363.5,
            height:220,
            position:'absolute',
            top:e.pageY,
            left:e.pageX+30
        });
        $("<img src='"+url+"' width='362.5px'>").appendTo(showImgBox);
        $('body').eq(0).append(showImgBox);
        return false;
    },function(){
        $('.tempImgBox').remove();
    });
    // Your code here...
})();
