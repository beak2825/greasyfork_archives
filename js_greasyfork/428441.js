// ==UserScript==
// @name         百度搜索广告屏蔽，屏蔽百度热搜
// @namespace    http://tampermonkey.net/
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @version      0.2.7
// @description  让你好好去学习
// @author       Yirs
// @match        *://*.baidu.com/*
// @run-at       document-start
// @copyright    借鉴部分作者代码 Tsing@greasyfork
// @note         0.2.4新添 自动收缩百度视频和百度图片 点击❀这个即可，延迟三秒删除重新出现的广告,2.1秒测试多台机器都可以正常去除广告，用户自行设置
// @note         0.2.5修复百度视频无法省略
// @note         0.2.6祛除全网热卖
// @note         0.2.7小更
// @downloadURL https://update.greasyfork.org/scripts/428441/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%EF%BC%8C%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428441/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%EF%BC%8C%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

var zkdurldomain =location.href;

(function() {
    'use strict';
        document.addEventListener ("DOMContentLoaded", frame);
         function frame() {
             unsafeWindow.$(document).ajaxSuccess(function(e, request, section) {
            //右边栏广告
            $("#content_right").remove();
            //主广告
            $("[data-placeid]").remove();
            //删除主广告以后会出现新的广告，延迟3秒后进行删除，用户可以自行设置 3000就是3秒
            setTimeout(function () {
            if ($("[id=1]").length >= 1){
            $("[id=1]").each(function(){
               var ad=$(this).children("div .se_st_footer").children("a").text()
                if(ad.indexOf("广告") >= 0){
                   $(this).remove();
                }
            });
            }
            }, 2200);
            //全网热卖
            $("[tpl='ads_b2c_universal_card']").remove();
            $("[tpl='sp_hot_sale']").remove();
            $("[tpl='b2b_factory2']").remove();
            $("[tpl='b2b_prod']").remove();
            //百度爱采购
            $("[tpl='b2b_straight']").remove();
            $("[tpl='b2b_shop']").remove();
            //其他人还搜索结果。出现在中间位置，看它不顺眼
            $("[tpl='recommend_list']").remove();
            //视频 省略
            $(".content_LHXYt").hide();
            $(".tags-area_te6tw").hide();
            //图片 省略
            $("[tpl='img_normal'] div:eq(1)").hide();

              //百度视频点击事件
             if($("#showvideo").length == 0 ){
             $("[tpl='short_video_pc']").children(".c-gap-bottom-small").append("<span id='showvideo' style='cursor:pointer;margin-left:4px;'>❀</span>");
             $(".c-gap-bottom-small").on("click","#showvideo",function(){
             $(".content_LHXYt").toggle();
             });

             $("[tpl='short_video']").children("div").children(".c-title").append("<span id='showvideo' style='cursor:pointer;margin-left:4px;'>❀</span>");
             $("#showvideo").on("click",function(){
             $(".content_LHXYt").toggle();
             });
             }
            //百度图片点击事件
            if($("#showBaiDuPic").length == 0 ){
            $("[tpl='img_normal']").children(".c-container").children(".c-title").append("<span id='showBaiDuPic' style='cursor:pointer;margin-left:4px;'>❀</span>");
              $(".c-title").on("click","#showBaiDuPic",function(){
              $("[tpl='img_normal'] div:eq(1)").toggle();
           });
             }

            });
        }


})();


