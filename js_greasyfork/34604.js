// ==UserScript==
// @name         淘宝天猫商品搜索比价
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        https://item.taobao.com/item.htm*
// @match        https://detail.tmall.com/item.htm*
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34604/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E6%90%9C%E7%B4%A2%E6%AF%94%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/34604/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E6%90%9C%E7%B4%A2%E6%AF%94%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.host=="item.taobao.com"){
    setTimeout(function(){
        var $j = jQuery.noConflict();
        $j(function(){
            var url99="https://s.taobao.com/search?q="+$j("div#J_Title h3").text().replace(/(^\s*)|(\s*$)|(\s)/g,"");
          //console.log(url99);
              $j("div#J_Title p.tb-subtitle").after("<a href="+url99+" target='_blank' style='font-size: xx-large;font-weight: bold;color: red;'>===搜索比价===</a><br/>");


        });


    },500);
}else if(window.location.host=="detail.tmall.com"){

    setTimeout(function(){
        var $j = jQuery.noConflict();
        $j(function(){
            var url99="https://s.taobao.com/search?q="+$j("div.ItemHeader--root--DXhqHxP h1").text().replace(/(^\s*)|(\s*$)|(\s)/g,"");
          //console.log(url99);
              $j("div.ItemHeader--root--DXhqHxP h1").after("<a href="+url99+" target='_blank' style='font-size: xx-large;font-weight: bold;color: red;'>===搜索比价===</a><br/>");


        });


    },500);




         }


    // Your code here...
})();