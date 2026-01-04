// ==UserScript==
// @name         免登陆看高清斗鱼和虎牙直播
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  免登陆看高清斗鱼和虎牙直播。
// @author       xxboy
// @include      *www.douyu.com/*
// @include      *www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424111/%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E9%AB%98%E6%B8%85%E6%96%97%E9%B1%BC%E5%92%8C%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/424111/%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E9%AB%98%E6%B8%85%E6%96%97%E9%B1%BC%E5%92%8C%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // Your code here...
    if(top.window.location.href.indexOf("douyu.com") > -1){
            var a = JSON.parse(localStorage.getItem('rateRecordTime_h5p_room'));
            a.v = "v";
            localStorage.setItem('rateRecordTime_h5p_room',JSON.stringify(a));
    }
    if(top.window.location.href.indexOf("huya.com") > -1){
            localStorage.setItem("loginTipsCount","v");
    }
 
})();