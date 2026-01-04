// ==UserScript==
// @name         百度贴吧我的贴吧跳转到我的帖子
// @namespace    https://osu.ppy.sh/u/376831
// @version      1.3
// @description  替换百度贴吧的“我的贴吧”链接，使其跳转到“我的贴子”页面
// @author       wcx19911123
// @match       *tieba.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/391627/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%88%91%E7%9A%84%E8%B4%B4%E5%90%A7%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%88%91%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/391627/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%88%91%E7%9A%84%E8%B4%B4%E5%90%A7%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%88%91%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count = 0;
    var setting = {
        "我的贴吧":{
            "href":"http://tieba.baidu.com/i/i/my_tie",
            "target":"_blank"
        },
        "我的商城":{
            "href":"https://ufo.baidu.com/listen/myhistory?product_line=90649&appid=222251&type=myhistory",
            "target":"_blank",
            "html":"我的反馈"
        }
    };
    var eventId = setInterval(()=>{
        //console.log($("div.u_ddl_con_top a").length);
        $("div.u_ddl_con_top a").each((i,o)=>{
            //console.log("each", $(o).html());
            for(var key in setting){
                if($(o).html().includes(key)){
                    //console.log("includes", $(o).html());
                    $(o).attr("href",setting[key].href);
                    $(o).attr("target",setting[key].target);
                    if(setting[key].html){
                        $(o)[0].innerHTML = setting[key].html;
                    }
                    count++;
                    break;
                }
            }
        });
        if(count>=2){
            clearInterval(eventId);
        }
    },500);
    /*var delSetting = ['div.dialog_block.j_itb_block', 'div.dialogJ.dialogJfix.dialogJshadow'];
    var delEventId = setInterval(()=>{
        delSetting.forEach((o)=>{
            if($(o).length){
                $(o).remove();
            }
        });
    },500);*/
})();