// ==UserScript==
// @name         别tm灰了
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  别灰了
// @author       space.bilibili.com/154039120
// @match        https://www.bilibili.com/*
// @match        https://www.huya.com/*
// @match        https://www.douyu.com/*
// @match        https://www.acfun.cn/*
// @match        https://cf.qq.com/*
// @match        https://cfhd.cf.qq.com/*
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455817/%E5%88%ABtm%E7%81%B0%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/455817/%E5%88%ABtm%E7%81%B0%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href
    if(url.indexOf("douyu.com")){
        $(".grayCtrl").removeClass("grayCtrl")
    }
   if(url.indexOf("baidu.com")){
        $(".big-event-gray").removeClass("big-event-gray")
    }
    var tags= [".gray",".ssr-wrapper","html"]
    for(var index in tags){
        $(tags[index]).css("filter","progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)")
        $(tags[index]).css("-webkit-filter","grayscale(0%)")
        $(tags[index]).css("-moz-filter","grayscale(0%)")
        $(tags[index]).css("-ms-filter","grayscale(0%)")
        $(tags[index]).css("-o-filter","grayscale(0%)")
    }
})();