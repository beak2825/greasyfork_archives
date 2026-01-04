// ==UserScript==
// @resource icon1 http://tampermonkey.net/favicon.ico
// @name         camelcamelcamel移动到链接时显示图像
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       LiuLin
// @match

// @include http://*camelcamelcamel.com/*
// @include https://*camelcamelcamel.com/*
// @include https://www.amazon.*
// @include https://www.amazon.co.uk/*
// @grant        none
//@require  http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/379012/camelcamelcamel%E7%A7%BB%E5%8A%A8%E5%88%B0%E9%93%BE%E6%8E%A5%E6%97%B6%E6%98%BE%E7%A4%BA%E5%9B%BE%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/379012/camelcamelcamel%E7%A7%BB%E5%8A%A8%E5%88%B0%E9%93%BE%E6%8E%A5%E6%97%B6%E6%98%BE%E7%A4%BA%E5%9B%BE%E5%83%8F.meta.js
// ==/UserScript==
//映射关系
var map = new Map();
map.set("uk","uk");
map.set("de","de");
map.set("com","us");
map.set("fr","fr");
map.set("it","it");
map.set("jp","jp");
(function() {
    'use strict';
    //第一种结构
    //charts.camelcamelcamel.com/de/B07BSWN9ZT/amazon.png?force=1&zero=0&w=725&h=440&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=de_DE
     $('#s-results-list-atf li a').hover(function(e){
         return handle(e,$(this));
    },function(){
        removeImage();
    });

    //第二种结构
    //https://www.amazon.de/s?k=B07B14Q1V7&ref=nb_sb_noss
    $('.s-result-list .sg-col-inner a').hover(function(e){
      return handle(e,$(this));
    },function(){
        removeImage();
    });

    function removeImage(){
        console.log('开始移除图片');
        $('.tempImgBox').remove();
    }

    function handle(e,element){
        var href = element.attr('href');
        console.log("获取到href:" + href);
        var asin = href.match(/\/dp\/([0-9A-Z]{10})/)[1];
        console.log('获取到asin:' + asin);
        var amazonKey = window.location.href.match(/amazon\.(co\.)?([a-z]{2,3})\//)[2];
        console.log('获取到amazonKey:' + amazonKey);
        var url = "https://charts.camelcamelcamel.com/"+map.get(amazonKey)+"/" + asin +"/amazon.png?force=1&zero=0&w=725&h=440&desired=false&legend=1&ilt=1&tp=3m&fo=0&lang=en";
        console.log('创建url:' + url + ',开始展示图片');
        showImage(e,url);
        return false;
    }

    //获取图片
    function showImage(e,url){
        $('.tempImgBox').remove();
        var showImgBox = $('<div></div>');
        showImgBox.addClass("tempImgBox");
        showImgBox.css({
            width:625,
            height:380,
            position:'absolute',
            top:e.pageY,
            left:e.pageX+30
        });
        $("<img src='"+url+"' width='625px' height='380px'>").appendTo(showImgBox);
        $('body').eq(0).append(showImgBox);

    }

    //骆驼
    $('#products_list .product_image>a,#products_list .product_info .product_title>a').hover(function(e){
        var asin = $(this).attr('href').match(/\/product\/([0-9A-Z]{10})/)[1];
        var url = "https://charts.camelcamelcamel.com/us/" + asin +"/amazon.png?force=1&zero=0&w=725&h=440&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en";
        $('.tempImgBox').remove();
        showImage(e,url);
        return false;
    },function(){
        $('.tempImgBox').remove();
    });
    // Your code here...
})();
