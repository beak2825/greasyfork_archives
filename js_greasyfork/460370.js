// ==UserScript==
// @name         中投生态圈收藏点赞刷积分
// @namespace    http://tampermonkey.net/
// @match        https://ecosys-web.china-inv.cn/*
// @version      1.0.4
// @description  中投生态圈收藏点赞刷积分,直接打开页面https://ecosys-web.china-inv.cn/#/newsList/information
// @author       沸水煮青蛙
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://code.jquery.com/jquery-2.1.3.min.js#sha256=ivk71nXhz9nsyFDoYoGf2sbjrR9ddh+XDkCcfZxjvcM=
// @require https://code.jquery.com/jquery-2.1.2.min.js#md5=H8w0zBT5Q1I6dncD3IiGnA==,sha256=YE7BKn1ea9jirCHPr/EaW5NxmkZZGb52+ZaD2UKodXY=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460370/%E4%B8%AD%E6%8A%95%E7%94%9F%E6%80%81%E5%9C%88%E6%94%B6%E8%97%8F%E7%82%B9%E8%B5%9E%E5%88%B7%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/460370/%E4%B8%AD%E6%8A%95%E7%94%9F%E6%80%81%E5%9C%88%E6%94%B6%E8%97%8F%E7%82%B9%E8%B5%9E%E5%88%B7%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==
var totalJf = 600;//需要刷多少分,最终分值可能多出几分
var startJf = 0;//起始积分，可配置从多少积分开始刷到指定分值，默认则以打开页面首次获取到的积分值作为起始值
var currJf = 0;//当前积分（请勿修改）
var current_index = 0;//总计打开的页面数（含已读和未读的）
var isStop = false;//是否停止脚本
(function() {
    'use strict';
    setTimeout(()=>{
        console.log(`中投生态圈收藏点赞刷积分脚本开始运行`)
        if(window.location.href.search("newsList")>-1){
            var interval =setInterval(function(){
                getJf();
                if(isStop){
                    clearInterval(interval)
                }
                $("html,body").animate({scrollTop:200*current_index}, 100);
                getOneNew().click();
            }, 500);
        }else if(window.location.href.search("detail")>-1){
            detailAuto()
        }
    },3000)
})();
function detailAuto(){
    var num =0 ;
    $(".company-icon").find(".pointer").each(function(){
        if($(this).find("i").hasClass("icon-shoucanghuise") || $(this).find("i").hasClass("icon-dianzanhuise")){
            $(this).click();
            num++;
            if(num>2){
                return false;
            }
        }
    })
    $("html,body").animate({scrollTop:800}, 100);
    setTimeout(()=>{
        window.close()
    },500)
}
function getOneNew(){
    console.log("current_index is " + current_index)
    return $("div[aria-hidden='false']").find(".dynamic-right")[current_index++];
}
//获取最新的积分数
function getJf(){
    $(".home-User>span").each(function(){
        $(this).click();
        setTimeout(function(){
            currJf = parseInt($(".icon-jifen1").parent().html().replace('<i class="iconfont icon-jifen1"></i>',''));
            if(startJf == 0 ){
                startJf = currJf;
            }else{
                if((currJf-startJf)>totalJf){
                    isStop = true
                }
            }
            console.log('起始积分：'+startJf+'，当前积分：'+currJf+'，是否停止：'+isStop)
            $(".home-User>span").click();
        },2000)
    });
}