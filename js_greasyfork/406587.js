// ==UserScript==
// @name         虎牙净化-免费看S11英雄联盟2021LPL职业选手第一视角
// @namespace    http://tampermonkey.net/
// @version         0.1.7
// @description  弹幕好像发不了，谁让我不用呢？
// @description  虎牙净化,隐藏页游入口
// @description  虎牙净化,隐藏小广告
// @description  虎牙净化,隐藏礼物栏
// @description  虎牙净化,隐藏首页播放器下面的广告、推荐
// @author       LeeShaoyu
// @match        *://www.huya.com/**
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406587/%E8%99%8E%E7%89%99%E5%87%80%E5%8C%96-%E5%85%8D%E8%B4%B9%E7%9C%8BS11%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F2021LPL%E8%81%8C%E4%B8%9A%E9%80%89%E6%89%8B%E7%AC%AC%E4%B8%80%E8%A7%86%E8%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/406587/%E8%99%8E%E7%89%99%E5%87%80%E5%8C%96-%E5%85%8D%E8%B4%B9%E7%9C%8BS11%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F2021LPL%E8%81%8C%E4%B8%9A%E9%80%89%E6%89%8B%E7%AC%AC%E4%B8%80%E8%A7%86%E8%A7%92.meta.js
// ==/UserScript==

// 异步
function async(){
    // 分类下拉广告
    var J_adCategory=$('.clickstat.J_g_resource.third-clickstat')
    if (J_adCategory.length) {
        $(J_adCategory).attr("style","display:none;")
    }
    // 工具栏
    var helperbar =$('div[class^="helperbar-root--"]')
    if (helperbar.length) {
        $(helperbar).hide()
    }

    // 侧边-底部-广告
    var sidebar_banner=$('.sidebar-banner')
    if (sidebar_banner.length) {
        $(sidebar_banner).hide()
    }

    //     比赛直播-下面的内容
    var match_cms_content=$('#match-cms-content')
    if(match_cms_content.length){
        $(match_cms_content).attr("style","display:none;")
    }

    var room_business_game=$('. room-business-game')
    if(room_business_game.length){
        $(room_business_game).hide()
    }
}

// 同步
function sync(){
    // banner
    var list_adx = $('.list-adx')
    if (list_adx.length) {
        $(list_adx).attr("style","display:none;")
    }

    // 导航-游戏
    var J_hyHdNavItemGame=$('#J_hyHdNavItemGame')
    if (J_hyHdNavItemGame.length) {
        $(J_hyHdNavItemGame).hide()
    }

    // 导航-下载
    var hy_nav_download =$('.hy-nav-download')
    if (hy_nav_download.length) {
        $(hy_nav_download).hide()
    }

    // 导航-开播
    var hy_nav_kaibo =$('.hy-nav-right.hy-nav-kaibo')
    if (hy_nav_kaibo.length) {
        $(hy_nav_kaibo).hide()
    }

    // 首页-游戏分类
    var mod_game_type=$('.mod-game-type')
    if (mod_game_type.length) {
        $(mod_game_type).hide()
    }

    // 首页-新闻
    var mod_news_section=$('.mod-news-section')
    if (mod_news_section.length) {
        $(mod_news_section).hide()
    }

    // 首页-推荐
    var mod_index_recommend=$('.mod-index-recommend')
    if (mod_index_recommend.length) {
        $(mod_index_recommend).hide()
    }

    // 首页-游戏列表
    var mod_index_list=$('.mod-index-list')
    if (mod_index_list.length) {
        $(mod_index_list).hide()
    }
    // 首页-活动列表
    var mod_actlist=$('.mod-actlist')
    if (mod_actlist.length) {
        $(mod_actlist).hide()
    }
    // 送礼物
    var player_face=$('.player-face')
    if (player_face.length) {
        $(player_face).hide()
    }

//     var room_footer=$('.room-footer')
//     if(room_footer.length){
//         $(room_footer).hide()
//     }

}

(function() {
    'use strict';
    sync();
    window.onload=function(){
        async();
    };
})();



