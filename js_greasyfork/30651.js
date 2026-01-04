// ==UserScript==
// @name         看豆人（kindleren）显示豆瓣评分
// @version      0.2
// @description  在kindleren.com的精品资源区，在图片视图模式下，显示每本书的豆瓣评。加载评分需要时间。
// @author       lemodd@qq.com
// @namespace    lemodd@qq.com
// @match        https://kindleren.com/forum.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      douban.com
// @grant        jQuery
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/30651/%E7%9C%8B%E8%B1%86%E4%BA%BA%EF%BC%88kindleren%EF%BC%89%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/30651/%E7%9C%8B%E8%B1%86%E4%BA%BA%EF%BC%88kindleren%EF%BC%89%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==


(function() {
    'use strict';


    var books = $('.bn50book_ds_row');
    var book = books.eq(7);
    GM_log(book);
    books.each(function(){

        var book_url = 'https://kindleren.com/'+$(this).find('dt a').attr('href');

         //获取book页面
        var bk=$(this);
        GM_xmlhttpRequest({ //获取列表
               method : "GET",
               headers: {"Accept": "application/json"},
               url:book_url,
               onload:function (response) {

                   //console.log(response.responseText);
                   var doc = (new DOMParser()).parseFromString(response.responseText, "text/html");
                   var title = doc.title;
                   GM_log(title);
                   var db_url=doc.getElementsByClassName("bn50book_ds_item")[0].getElementsByTagName("dd")[0].getElementsByTagName("a")[0].href;
                   GM_log(db_url);
                   if(db_url){
                       //GM_log("ttt:"+db_url);
                       //获取豆瓣评分
                       GM_xmlhttpRequest({ //获取列表
                           method : "GET",
                           headers: {"Accept": "application/json"},

                           url:db_url,
                           onload:function (response) {
                               //console.log(response.responseText);
                               var doc = (new DOMParser()).parseFromString(response.responseText, "text/html");
                               title = doc.title;

                               try{
                                   var point=doc.getElementById("interest_sectl").getElementsByTagName("strong")[0].innerHTML;
                               }
                               catch(err){
                                   GM_log(err);
                               }
                               if(point && point.length>2){
                                   bk.find('dd').eq(0).append('<br/><em style="color:red;font-size:2em">[豆瓣评分：'+point+']</em>');
                               }

                           }
                       });

                   }
               }
        });
    });


})();

