// ==UserScript==
// @name         煎蛋热榜跳转下一个Gif
// @namespace    http://jaxer.cc/
// @version      2024-03-28
// @description  add button to jump gif each.
// @author       jaxer
// @match        https://jandan.net/top
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491051/%E7%85%8E%E8%9B%8B%E7%83%AD%E6%A6%9C%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E4%B8%AAGif.user.js
// @updateURL https://update.greasyfork.org/scripts/491051/%E7%85%8E%E8%9B%8B%E7%83%AD%E6%A6%9C%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E4%B8%AAGif.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _gifIdx= 0;
     function jump(i){
         var gifList = $("img[src$=gif]")
         var length = gifList.size()
         _gifIdx+=i;
         if(_gifIdx > length -1){
             _gifIdx= 0;
         }
         if(_gifIdx < 0){
             _gifIdx= length -1;
         }
         //var gifTop = $(gifList.get(_gifIdx)).offset().top
         //$(document).scrollTop(gifTop );
         gifList.get(_gifIdx).scrollIntoView({behavior: "smooth"});
     }
    // Your code here...
     $("#wrapper").append($(`<div
     class="_jumpgif_prev"
     style="background-color:#e5e5e5;border-radius:50%;bottom:110px;color:#fff;height:40px;position:fixed;width:40px;z-index:3;margin-left:1000px;text-align:center;user-select:none;cursor:pointer;">
     GIF 上个</div>
     <div
     class="_jumpgif_next"
     style="background-color:#e5e5e5;border-radius:50%;bottom:60px;color:#fff;height:40px;position:fixed;width:40px;z-index:3;margin-left:1000px;text-align:center;user-select:none;cursor:pointer;">
     GIF 下个</div>`))


    $('._jumpgif_prev').on("click", function(){jump(-1)})
    $('._jumpgif_next').on("click", function(){jump(1)})

})();