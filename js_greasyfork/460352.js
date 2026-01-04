// ==UserScript==
// @name         yinfans 种子测速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅供学习交流使用
// @author       You
// @match        http://tools.bugscaner.com/magnetspeed/*
// @match        https://www.yinfans.me/movie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bugscaner.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460352/yinfans%20%E7%A7%8D%E5%AD%90%E6%B5%8B%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/460352/yinfans%20%E7%A7%8D%E5%AD%90%E6%B5%8B%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //种子
    if(location.host=="www.yinfans.me"){
        window.addEventListener("beforeunload", function(event) {
            //event.preventDefault();
            //event.returnValue = "真的要关闭此窗口吗?";
            window["wOpen"].close();
        });
        var style_1 = '<style>.active_a b{background-color:#03a9f4;}</style>';
        $("head").append(style_1);
        $.each($("#cili a"),(index,item)=>{
            var span = $($(item).find("span")[1]);
            var bStr = $($(item).find("b")[0]).text().toLocaleUpperCase();
            if(bStr.indexOf('HDR')>-1){
                span.text('【HDR】'+span.text());
            }
        });
        $("body").on("click","#cili a",function(){
            var url = $(this).attr("href");
            debugger
            $(this).addClass('active_a');
            window["wOpen"] = window.open("http://tools.bugscaner.com/magnetspeed/?magnet="+url,"open","left=0,top=101,width=280, height=500");
            return false;
        });
    }

    //查询
    if(location.host=='tools.bugscaner.com'){
        //解锁
        var style_1 = '<style>#div_qrcode_container{display:none !important;}</style>';
        $("head").append(style_1);
        //获取链接
        if(location.search.indexOf("magnet")>-1){
            var magnet = location.search.substring(location.search.indexOf("magnet")+7);
            $("#magnet").val(magnet);
            setTimeout(()=>{
                $("#sumbit").click();
            },1000);
        }
        //点击复制
        $("#magnet").click(()=>{
            const input = document.querySelector('#magnet');
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                console.log('复制成功');
            }
        });
    }

})();