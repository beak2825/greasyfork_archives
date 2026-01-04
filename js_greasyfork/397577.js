// ==UserScript==
// @name         关闭武汉理工大学选课弹出层
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  关闭武汉理工大学选课页面20秒弹出层
// @author       ZhangChaojie
// @match        http://218.197.102.183/
// @include      http://202.114.90.180/Course/*
// @include      http://202.114.90.184/Course/*
// @include      http://59.69.102.13/Course/*
// @include      http://202.114.50.131/Course/*
// @include      http://202.114.50.130/Course/*
// @include      http://218.197.102.183/Course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397577/%E5%85%B3%E9%97%AD%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E5%BC%B9%E5%87%BA%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/397577/%E5%85%B3%E9%97%AD%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E5%BC%B9%E5%87%BA%E5%B1%82.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    //关闭弹出层
    $('head').append('<link href="//at.alicdn.com/t/font_1679242_yjh9ahynmpt.css" rel="stylesheet" type="text/css" />');
    let $close = $('<i style="font-size: 14px;color:red;margin:-left:10px;cursor:pointer;" id="closeFade" class="iconfont icon-buoumaotubiao20"></i>');
    $("#MyDiv>div").first().append($close);
    $("#MyDiv>div>i").first().on("click",function() {
        $("#MyDiv").hide();
        $("#fade").hide();
    });

})();