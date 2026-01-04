// ==UserScript==
// @name         BILIBILI MoeUseHelper
// @version      0.0.11
// @description  BBMUH - 一键开关弹幕|播放暂停|调整倍速|开关全屏|能让你用bilibili更加愉快的助手
// @author       萌萌哒丶九灬书
// @namespace    https://space.bilibili.com/1501743
// @license      GNU General Public License v3.0
// @create       2020-03-25
// @lastmodified 2021-02-24
// @run-at       document-end
// @note         0.0.11 更新: 1.代码存档，烦请各位移步至其他脚本。
// @note         0.0.10 更新: 1.修复了后台打开会导致评论区无法加载的问题; 2.暂时无法实现直播间的快捷按键。
// @note         0.0.9 更新: 1.修复了主站无法使用播放暂停的问题。
// @note         0.0.8 更新: 1.新增了清空设置的设定，清空填充设置与清空倍速合并为了同一按键。
// @note         0.0.7 更新: 1.修复了特定状态下无法使用的bug;
// @note         0.0.6 更新: 1.修复了直播间无法使用的bug;
// @note         0.0.5 更新: 1.修复了开关弹幕、播放暂停时偶现的tips显示bug; 2.新增了缩放填充、拉伸填充。
// @note         0.0.4 更新: 1.修复了看番时无法使用倍速的问题。
// @note         0.0.3 更新: 1.新增了跳转播放的按键; 2.新增了直播间的快捷按键。
// @note         感谢R君发布的基础版本，在他的基础上修改、增加了部分实现内容。
// @mainpage     https://greasyfork.org/zh-CN/scripts/408526-bilibili-moeusehelper
// @supportURL   https://greasyfork.org/zh-CN/scripts/408526-bilibili-moeusehelper/feedback
// @home-url     https://greasyfork.org/zh-CN/scripts/408526-bilibili-moeusehelper
// @homepageURL  https://greasyfork.org/zh-CN/scripts/408526-bilibili-moeusehelper
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/408526/BILIBILI%20MoeUseHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/408526/BILIBILI%20MoeUseHelper.meta.js
// ==/UserScript==

// 小键盘8、2分别是增加音量、减少音量(B站自带)
// 小键盘4、6分别是后退、前进(B站自带)
//var 播放暂停 = 101; //小键盘数字键5
//var 开关弹幕 = 103; //小键盘数字键7
//var 全屏模式 = 105; //小键盘数字键9
//var 网页全屏 = 111; //小键盘“/”键
//var 宽屏模式 = 106; //小键盘“*”键
//var 增加倍速 = 107; //小键盘“+”键
//var 减少倍速 = 109; //小键盘“-”键
//var 清空设置 = 97; ///小键盘数字键1
//var 跳转播放 = 99; ///小键盘数字键3
//var 缩放填充 = 96; ///小键盘数字键0
// 当你的显示屏是21:9，up主却按16:9上传了21:9的视频时，用这个
//var 拉伸填充 = 110; //小键盘“.”键
// 当你的显示屏是16:9，up主却上传了18:9的视频时，用这个

// 不清楚填充效果可以去《星际迷航：暗黑无界》这部片子测试下
// 链接：https://www.bilibili.com/bangumi/play/ss34021/

// *****************************************************************************
// * 上方每一个按键都能自定义，可以按照自己的喜好自行对照键盘键位对应编码来修改
// * 笔记本电脑或者是没有小键盘的同学，请参考下面的键盘编码表更改键位
// * 对照修改的键盘编码表链接，复制下方的链接到地址栏打开
// * 链接：https://jingyan.baidu.com/article/fedf073780e16335ac8977a4.html
// *****************************************************************************

//这里设置倍速列表
//var video_speed = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 8, 16];

// *********************************************
// * 上方的倍速列表也可以自定义设置
// * 如果列表中没有“1.0”或“1”
// * 会导致按下重置按键后重置到第一个值“0.1”
// *********************************************

//jq重定义
//var jq = jQuery.noConflict();
//B站如果重定义，反而会导致edge加载时冲突，$.ajax无法hook，故下面直接使用jQuery。

//判定当前url是否为直播间
//var is_now_live_url = (window.location.host == "live.bilibili.com")? true : false;

//function MUH_tips(str){
//    var get_tips_div = jQuery("#tips_div");
//    if(get_tips_div.val() == undefined){
//        var tips_div = '<div id="tips_div" style="border-radius: 20px;'+
//            'background:#000;'+
//            'width: 140px;'+
//            'height: 40px;'+
//            'position:fixed;'+
//            'left:50%; top:50%;'+
//            'margin-left:-60px;'+
//            'margin-top:-20px;'+
//            'text-align:center;'+
//            'line-height:40px;'+
//            'font-size:20px;'+
//            'color:#FFF;'+
//            'opacity:0.8;'+
//            'z-index:2147483647;">' + str + '</div>';
//        if(is_now_live_url){
//            jQuery(".bilibili-live-player.relative").append(tips_div);
//        }else{
//            jQuery(".bilibili-player-video").append(tips_div);
//        }
//        jQuery("#tips_div").animate({opacity:"0.8"},500).animate({opacity:"0"},250);
//    }else{
//        if(!get_tips_div.is(":animated")){
//            get_tips_div.text(str);
//            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},500).animate({opacity:"0"},250);
//        }else{
//            get_tips_div.stop(true, true);
//            get_tips_div.text(str);
//            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},500).animate({opacity:"0"},250);
//        }
//    }
//
//}
//var video_speed_num = 0;
//for(var i = 0; i< video_speed.length; i++){
//    if(video_speed[i] == 1.0){
//        video_speed_num = i;
//        break;
//    }
//}
//function add_video_speed(){
//    if(!is_now_live_url){
//        if(++video_speed_num >= video_speed.length){
//            video_speed_num = video_speed.length - 1;
//        }
//        jQuery(".bilibili-player-video video")[0].playbackRate = video_speed[video_speed_num];
//        MUH_tips("倍速：" + video_speed[video_speed_num].toString());
//    }
//}
//function sub_video_speed(){
//    if(!is_now_live_url){
//        if(--video_speed_num < 0){
//            video_speed_num = 0;
//        }
//        jQuery(".bilibili-player-video video")[0].playbackRate = video_speed[video_speed_num];
//        MUH_tips("倍速：" + video_speed[video_speed_num].toString());
//    }
//}
//function reset_all(){
//    if(!is_now_live_url){
//        video_speed_num = 0;
//        for(var i = 0; i< video_speed.length; i++){
//            if(video_speed[i] == 1.0){
//                video_speed_num = i;
//                break;
//            }
//        }
//        jQuery(".bilibili-player-video video")[0].playbackRate = video_speed[video_speed_num];
//        jQuery(".bilibili-player-video").addClass("video-size-default");
//        jQuery(".bilibili-player-video").removeClass("video-size-width-fill");
//        jQuery(".bilibili-player-video").removeClass("video-size-height-fill");
//        MUH_tips("倍速：" + video_speed[video_speed_num].toString());
//    }
//}
//var wide_screen_flag = false;
//var web_Full_screen_flag = false;
//var Full_screen_flag = false;
//function click_wide_screen(){
//    if(!is_now_live_url){
//        if(Full_screen_flag == true && wide_screen_flag == true){
//            jQuery("button[data-text='进入全屏']").click(); //主站
//            MUH_tips("宽屏模式");
//            Full_screen_flag = false;
//        }else if(web_Full_screen_flag == true && wide_screen_flag == true){
//            jQuery("button[data-text='宽屏模式']").click(); //主站
//            MUH_tips("宽屏模式");
//            web_Full_screen_flag = false;
//        }else if(wide_screen_flag){
//            jQuery("button[data-text='宽屏模式']").click(); //主站
//            MUH_tips("退出宽屏模式");
//            wide_screen_flag = false;
//        }else if(Full_screen_flag){
//            jQuery("button[data-text='进入全屏']").click(); //主站
//            setTimeout(function (){jQuery("button[data-text='宽屏模式']").click();}, 200); //主站
//            MUH_tips("宽屏模式");
//            wide_screen_flag = true;
//            Full_screen_flag = false;
//        }else{
//            jQuery("button[data-text='宽屏模式']").click(); //主站
//            MUH_tips("宽屏模式");
//            wide_screen_flag = true;
//            web_Full_screen_flag = false;
//        }
//    }
//}
//function click_web_Full_screen(){
//    if(is_now_live_url){
//        if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-web-fullscreen-btn").children("button").attr("data-title") == '退出网页全屏'){
//            jQuery("button[data-title='退出网页全屏']").click(); //直播间
//            MUH_tips("退出网页全屏");
//        }else if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-web-fullscreen-btn").children("button").attr("data-title") == '网页全屏'){
//            jQuery("button[data-title='网页全屏']").click(); //直播间
//            MUH_tips("网页全屏");
//        }
//    }else{
//        if(Full_screen_flag){
//            jQuery("button[data-text='进入全屏']").click(); //主站
//            setTimeout(function (){jQuery("button[data-text='网页全屏']").click();}, 200);//主站
//            MUH_tips("网页全屏");
//            Full_screen_flag = false;
//            web_Full_screen_flag = true;
//        }else if(web_Full_screen_flag){
//            jQuery("button[data-text='网页全屏']").click(); //主站
//            MUH_tips("退出网页全屏");
//            web_Full_screen_flag = false;
//        }else{
//            jQuery("button[data-text='网页全屏']").click();//主站
//            MUH_tips("网页全屏");
//            web_Full_screen_flag = true;
//        }
//    }
//}
//function click_Full_screen(){
//    if(is_now_live_url){
//        if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-fullscreen-btn").children("button").attr("data-title") == '退出全屏'){
//            jQuery("button[data-title='退出全屏']").click(); //直播间
//            MUH_tips("退出全屏");
//        }else if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-fullscreen-btn").children("button").attr("data-title") == '全屏模式'){
//            jQuery("button[data-title='全屏模式']").click(); //直播间
//            MUH_tips("全屏模式");
//        }
//    }else{
//        if(Full_screen_flag){
//            jQuery("button[data-text='进入全屏']").click(); //主站
//            MUH_tips("退出全屏");
//            Full_screen_flag = false;
//        }else{
//            jQuery("button[data-text='进入全屏']").click(); //主站
//            MUH_tips("全屏模式");
//            Full_screen_flag = true;
//        }
//    }
//
//}
//function click_Barrage(){
//    if(is_now_live_url){
//        if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-hide-danmaku-btn").children("button").attr("data-title") == '显示弹幕'){
//            jQuery("button[data-title='显示弹幕']").click(); //直播间
//            MUH_tips("显示弹幕");
//        }else if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-hide-danmaku-btn").children("button").attr("data-title") == '隐藏弹幕'){
//            jQuery("button[data-title='隐藏弹幕']").click(); //直播间
//            MUH_tips("隐藏弹幕");
//        }
//    }else{
//        if(jQuery("input.bui-switch-input").prop('checked')){
//            MUH_tips("关闭弹幕");
//        }else{
//            MUH_tips("显示弹幕");
//        }
//        jQuery(".bilibili-player-video-danmaku-switch.bui.bui-switch").children(".bui-switch-input").click(); //主站
//    }
//}
//function stop_video(){
//    if(is_now_live_url){
//        if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-start-btn").children("button").attr("data-title") == '暂停'){
//            jQuery("button[data-title='暂停']").click(); //直播间
//            MUH_tips("暂停");
//        }else if(jQuery(".bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-start-btn").children("button").attr("data-title") == '播放'){
//            jQuery("button[data-title='播放']").click(); //直播间
//            MUH_tips("播放");
//        }
//    }else{
//        if(jQuery(".bilibili-player-video-btn.bilibili-player-video-btn-start.video-state-pause").css("display") == undefined){
//            jQuery("button[aria-label='暂停']").click(); //主站
//            MUH_tips("暂停");
//        }else{
//            jQuery("button[aria-label='播放']").click(); //主站
//            MUH_tips("播放");
//        }
//    }
//}
//function jump_historical_view(){
//    if(!is_now_live_url){
//        jQuery(".bilibili-player-video-toast-item-jump").click(); //主站
//        MUH_tips("已跳转播放");
//    }
//}
//function fill_screen_width(){
//强制横向填充屏幕（等比缩放填充）
//    var screen_Width = document.documentElement.clientWidth;
//    var fill_screen_width_style = "<style>" +
//        ".bilibili-player .bilibili-player-area .bilibili-player-video-wrap .bilibili-player-video.video-size-width-fill video{" +
//        "object-fit: cover;" +
//        "width: " + screen_Width + ";" +
//        "padding: 0px;" +
//        "}</style>";
//    jQuery(".bilibili-player-video").append(fill_screen_width_style);
//    jQuery(".bilibili-player-video").removeClass("video-size-default");
//    jQuery(".bilibili-player-video").removeClass("video-size-height-fill");
//    jQuery(".bilibili-player-video").addClass("video-size-width-fill");
//}
//function fill_screen_height(){
//强制纵向填充屏幕（拉伸缩放填充）
//    var screen_height = document.documentElement.clientHeight;
//    var fill_screen_height_style = "<style>" +
//        ".bilibili-player .bilibili-player-area .bilibili-player-video-wrap .bilibili-player-video.video-size-height-fill video{" +
//        "object-fit: fill;" +
//        "height: " + screen_height + ";" +
//        "padding: 0px;" +
//        "}</style>";
//    jQuery(".bilibili-player-video").append(fill_screen_height_style);
//    jQuery(".bilibili-player-video").removeClass("video-size-default");
//    jQuery(".bilibili-player-video").removeClass("video-size-width-fill");
//    jQuery(".bilibili-player-video").addClass("video-size-height-fill");
//}
//jQuery(document).ready(function() {
//    jQuery(document).keydown(function(event){
//    //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
//        var ZZ_video_panel_row_reset = /播放器初始化...\[完成\]/
//        var ZZ_video_panel_row_user = /加载用户配置...\[完成\]/
//        if((ZZ_video_panel_row_reset.test(jQuery(".bilibili-player-video-panel-row").text()) && ZZ_video_panel_row_user.test(jQuery(".bilibili-player-video-panel-row").text())) || is_now_live_url){
//        switch(event.keyCode){
//            case 播放暂停:
//                stop_video();
//                break;
//            case 开关弹幕:
//                click_Barrage();
//                break;
//            case 全屏模式:
//                click_Full_screen();
//                break;
//            case 网页全屏:
//                click_web_Full_screen();
//                break;
//            case 宽屏模式:
//                click_wide_screen();
//                break;
//            case 增加倍速:
//                add_video_speed();
//                break;
//            case 减少倍速:
//                sub_video_speed();
//                break;
//            case 清空设置:
//                reset_all();
//                break;
//            case 跳转播放:
//                jump_historical_view();
//                break;
//            case 缩放填充:
//                fill_screen_width();
//                break;
//            case 拉伸填充:
//                fill_screen_height();
//                break;
//        };
//        };
//    });
//});