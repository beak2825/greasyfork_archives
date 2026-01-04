// ==UserScript==
// @name         芯参数移除VIP限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hidden password login dialog and blur mask,just for personal use
// @author       githuboy
// @match        *://*.xincanshu.com/*
// @grant        GM_log
// @run-at       document-body
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/435634/%E8%8A%AF%E5%8F%82%E6%95%B0%E7%A7%BB%E9%99%A4VIP%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435634/%E8%8A%AF%E5%8F%82%E6%95%B0%E7%A7%BB%E9%99%A4VIP%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("script init success");
    setTimeout(function(){
        var $ = jq;
        $(".zheceng").remove();
        $("#chart-wrapper").css("filter","blur(0px)");
        $(".paofenjietu").css("filter","blur(0px)");
        //remove mask
        $("div[class^='zheceng']").remove();
        $(".zheceng2021").css("display","none");
        $("#chart-wrapper").css("color","red");
        var t = $(".tishitubiao");
        if(t){
          $(t).parent().css("display","none");
        }
    },0);
})();