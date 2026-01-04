// ==UserScript==
// @name         screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.douban.com/*
// @require   http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @run-at       document-start


// @downloadURL https://update.greasyfork.org/scripts/40590/screen.user.js
// @updateURL https://update.greasyfork.org/scripts/40590/screen.meta.js
// ==/UserScript==
 var keyWordsList = [
             "沈阳",
         ];
var IDList = [
             "少女青龙小琪琪",
              "__冷雨''",
         ];
var resharedIDList = [
            "灯证",
];
   window.onload = function(){
       //$(".status-reshared-wrapper").empty()
       //$(".reshared_by + *").empty()
       //$(".reshared_by").empty()


       $("p").each(function(){
            for(var i=0;i<keyWordsList.length;i++){
             if($(this).text().indexOf(keyWordsList[i])>=0){

             //$(this).text(" ")
                 var o=$(this).parents('.status-wrapper')
                 o.empty()
             }

         }
  });
        $("a.lnk-people").each(function(){
            for(var i=0;i<IDList.length;i++){
             if($(this).text().indexOf(IDList[i])>=0){

             //$(this).text(" ")
                 var o=$(this).parents('.status-wrapper')
                 o.empty()
             }

         }
  });
        $("span.reshared_by > a").each(function(){
            for(var i=0;i<resharedIDList.length;i++){
             if($(this).text().indexOf(resharedIDList[i])>=0){

             //$(this).text(" ")
                 var o=$(this).parents('.status-wrapper')
                 o.empty()
             }

         }
  });



     };