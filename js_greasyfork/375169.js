
// ==UserScript==

// @name         screen

// @namespace    http://tampermonkey.net/

// @version      0.1

// @description  screen for douban

// @author       rei

// @match        https://www.douban.com/*

// @require   http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @grant        none

// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/375169/screen.user.js
// @updateURL https://update.greasyfork.org/scripts/375169/screen.meta.js
// ==/UserScript==

//注意引号输入的内容不要多写了空格

 var keyWordsList = [

             "沈阳",

             "关键词2",

             "关键词3",

         ];

var IDList = [

             "需要屏蔽的发布者名号",

         ];

//如果需要屏蔽特定转播者可以用以下代码

var resharedIDList = [

            "需要屏蔽的转播者名号",

];

   window.onload = function(){

      //如果想要同时屏蔽所有转播加入以下代码，去掉前面的//

      //$(".status-reshared-wrapper").empty();

       //$(".reshared_by +*").empty();

       //$(".reshared_by").empty();

//以下屏蔽特定转播者代码

 $("span.reshared_by > a").each(function(){

            for(var i=0;i<resharedIDList.length;i++){

             if($(this).text().indexOf(resharedIDList[i])>=0){

                 var o=$(this).parents('.status-wrapper');

                 o.empty();

             }

         }

  });

     // 屏蔽纯图片广播，需要把注释去掉(去掉/**/)

      /* $("[data-action='2']").each(function(){

            if($(this).find("blockquote").length <= 0)

            {

               var o=$(this).parent();

               o.empty();

            }

  });              */



         // 屏蔽视频广播

       $(".block-video").each(function(){



               var o=$(this).parents('.status-wrapper');
               o.empty();


  });

       $("p").each(function(){

            for(var i=0;i<keyWordsList.length;i++){

             if($(this).text().indexOf(keyWordsList[i])>=0){

                 var o=$(this).parent();

                     o=$(this).parents('.status-wrapper');

                 o.empty();

             }

         }

  });

        $("a").each(function(){

            for(var i=0;i<IDList.length;i++){

             if($(this).text().indexOf(IDList[i])>=0){

                 var o=$(this).parent();

                 o=$(this).parents('.status-wrapper');

                 o.empty();

             }

         }

  });

     };

//请新建油猴脚本复制

//keyWordsList 可以放入想屏蔽的关键字