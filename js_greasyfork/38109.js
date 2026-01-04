// ==UserScript==
// @name         yy4480浏览器清除浮动
// @namespace    http://aaxxy.com/
// @version      1.9.13
// @description  新视觉影院清除浮动插件
// @author       Timi
// @include      http://aaxxy.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38109/yy4480%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%85%E9%99%A4%E6%B5%AE%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/38109/yy4480%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%85%E9%99%A4%E6%B5%AE%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $(document).ready(function() {
      setTimeout(function(){
          var length=$("a").length;
        var option;
        for(var i=0;i<length;i++){   
          var style=$($("a")[i]).attr("style");
          if(style!=undefined){
             style=style.replace(/ /g,'');

			 
             if(style.indexOf("position:absolute")>-1&&style.indexOf("opacity:0")>-1){

               $($("a")[i]).hide();

               }else if(style.indexOf("position:absolute")>-1&&style.indexOf("opacity:0.01")>-1){
	
               $($("a")[i]).hide();

               }
        
            }
        }
      
      },2000)
  });
})();