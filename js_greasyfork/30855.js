// ==UserScript==
// @name         看豆人（kindleren）助手
// @version      0.1
// @description  在kindleren.com的精品资源区，在图片视图模式下，显示每本书的豆瓣评。加载评分需要时间。
// @author       lemodd@qq.com
// @namespace    lemodd@qq.com
// @match        https://kindleren.com/forum.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      douban.com
// @grant        jQuery
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/30855/%E7%9C%8B%E8%B1%86%E4%BA%BA%EF%BC%88kindleren%EF%BC%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/30855/%E7%9C%8B%E8%B1%86%E4%BA%BA%EF%BC%88kindleren%EF%BC%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//新功能：根据评分来改变字体颜色，如大于8.0用红色，小于用绿色
//v0.4
//增加对于感兴趣的标签，加颜色提醒
//隐藏评分低于7的图书
//豆瓣评分改为链接，点击可以打开豆瓣页面
//v0.5
//在图书标题后增加一个“豆瓣”搜索按键【豆】，可以在豆瓣搜索图书标题
//将标题字号变大方便阅读


//var s = $(".viewpay").click();
//GM_log(s);

(function() {
    'use strict';

    //感兴趣的标签
    var fav_list = ["自然科学","网络","侦探推理","外国","英文","儿童"];

    var books = $('.bn50book_ds_row');


    books.each(function(){
        var this_book = $(this);
        //书的标题的标签，用于改变颜色
        var bk_title_tag = $(this).find("dt a");

        //在图书标题后增加一个“豆瓣”搜索按键【豆】，可以在豆瓣搜索图书标题
        var bk_title = bk_title_tag.text();
        GM_log(bk_title);
        var db = "https://www.douban.com/search?q="+bk_title;
        var db_search_tag = $("<a>【豆】</a>");
        db_search_tag.attr("href",db);
        db_search_tag.attr("target","_blank");
        db_search_tag.attr("style","color:rgb(34,138,49);font-size:1.5em");
        bk_title_tag.after(db_search_tag);

        //将标题字号变大方便阅读
        bk_title_tag.attr("style","font-size:1.5em");

        //增加对于感兴趣的标签，加颜色提醒
        var bkinfo = $(this).find("dd.booklistinfo");
        bkinfo.each(function(){
            var ems = $(this).find("em");
            ems.each(function(){
                var em = $(this);
                $.each(fav_list,function(i,f){
                    if(em.text().indexOf(f) != -1){
                        em.attr("style","color:blue;font-size:2em;");

                    }
                });
            });
        });


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
                //GM_log("title:"+title);
                var db_url=doc.getElementsByClassName("bn50book_ds_item")[0].getElementsByTagName("dd")[0].getElementsByTagName("a")[0].href;
                //GM_log(db_url);
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
                                //GM_log("Err:"+err);
                            }
                            if(point && point.length>2){
                                //根据评分来改变颜色
                                var clr = 'green';
                                if(point<7){
                                    this_book.hide();
                                }
                                if(point>=8.0){
                                    clr = 'red';}
                                var ele = $('<br/><a></a>').text('[豆瓣评分:'+point+']');
                                ele.attr('style','color:'+ clr +';font-size:2em;');
                                ele.attr("href",db_url);
                                ele.attr("target","_black");
                                bk.find('dd').eq(0).append(ele);
                                //bk.find('dd').eq(0).append('<br/><em style="color:'+ clr +';font-size:2em">[豆瓣评分：'+point+']</em>');
                                //如果大于9分改变颜色和字号
                                if(point>=9.0){
                                    bk_title_tag.attr("style","color:rgb(200,20,200);font-size:1.5em");
                                }
                            }

                        }
                    });

                }
            }
        });
    });


})();

