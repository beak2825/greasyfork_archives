// ==UserScript==
// @name         优化百度首页
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  改百度下面的白色为透明,优化顶部栏
// @author       You
// @match        https://www.baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432124/%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/432124/%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //$("#s-top-left").remove();//去除顶部栏
    //$("#s_top_wrap").remove();//去除顶部栏
    // $("#head_wrapper #kw").css("background-color","rgba(0,0,0,0)");

    //$(".s-skin-hasbg #head_wrapper .s_btn").css("background","none");
   // $("#head_wrapper .s_btn").css("background-color","none");

    var wangzhi = window.location.href;
    if(wangzhi==="https://www.baidu.com/"){
        $("#bottom_layer").css("background","none");
        $("html").css("overflow-y","hidden");


        $("#su").click(function(){
                        $("html").css("overflow-y","auto");
        });
        $(".bdsug-overflow").click(
              $("html").css("overflow-y","auto")

       );
    };




})();