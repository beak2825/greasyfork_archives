// ==UserScript==
// @name         去除腾讯视频暂停时广告&未全屏时右上角画中画和客户端播放提示、爱奇艺及优酷视频右上角logo
// @namespace    http://tampermonkey.net/
// @description     2022/12/28更新
// @version         20221228
// @author          晚柒载
// @match          *://*.qq.com/*
// @match          *://*.iqiyi.com/*
// @match          *://*.youku.com/*
// @match          *://*.bilibili.com/*
// @icon           https://tse1-mm.cn.bing.net/th?id=OIP-C.N9DF-kpyFXoc7_IxSX_CXgHaHa&w=103&h=103&c=8&rs=1&qlt=90&o=6&dpr=1.25&pid=3.1&rm=2
// @grant          GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431633/%E5%8E%BB%E9%99%A4%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%97%B6%E5%B9%BF%E5%91%8A%E6%9C%AA%E5%85%A8%E5%B1%8F%E6%97%B6%E5%8F%B3%E4%B8%8A%E8%A7%92%E7%94%BB%E4%B8%AD%E7%94%BB%E5%92%8C%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%92%AD%E6%94%BE%E6%8F%90%E7%A4%BA%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E5%8F%8A%E4%BC%98%E9%85%B7%E8%A7%86%E9%A2%91%E5%8F%B3%E4%B8%8A%E8%A7%92logo.user.js
// @updateURL https://update.greasyfork.org/scripts/431633/%E5%8E%BB%E9%99%A4%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%97%B6%E5%B9%BF%E5%91%8A%E6%9C%AA%E5%85%A8%E5%B1%8F%E6%97%B6%E5%8F%B3%E4%B8%8A%E8%A7%92%E7%94%BB%E4%B8%AD%E7%94%BB%E5%92%8C%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%92%AD%E6%94%BE%E6%8F%90%E7%A4%BA%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E5%8F%8A%E4%BC%98%E9%85%B7%E8%A7%86%E9%A2%91%E5%8F%B3%E4%B8%8A%E8%A7%92logo.meta.js
// ==/UserScript==
 
//腾讯
GM_addStyle(`.focus-wrap,#iwan-game-switch-page,.quick_games,.first_tab_can_change ,.player-bottom,.player-bottom__intro,.txp-watermark,.txp-play-title ,.txp_info_icon,.txp-play-title__title,.txp_zt,.txp_zt_image_main_container,.txp_interact,.txp_speed_tips,.interact_entry_box,.txp_zt_video,.mod_ad_main,.site_footer,.mod_ad ,.txp_popup_download,.mod_hanger,.txp_alert_info,.txp_waterMark_pic,#block-V,.qr-wrap,.fixed_bar_2rZMG,.detail-sd,.txp_tips_popup,.txp_icon_text,
 .txp_top_btns,.txp_ad,.quick_upload,.quick_client,#shortcut,.icon_fly,.fixed_box,.player_side_hd{display: none!important;}`)
switch( window.location.host) {
    case 'v.qq.com':
        setInterval(function(){
            var head = document.getElementsByClassName('video-banner-module')
            if(head.length != 0){
                head[0].style.marginTop = '100px'
            }
        },500)
}
var ad = setInterval(function(){
    var ads = document.getElementsByClassName('video-card-module')
    if(ads.length != 0){
        ad = ads[0].getElementsByClassName('card-wrap')
        for(let i of ad){
            i.remove()
        }
    }
}, 500)
 
var channl = setInterval(function(){
    var channl = document.getElementsByClassName('frequent-channel')
    if(channl.length != 0){
        channl[0].style.marginTop = '100px'
    }
}, 500)
 
//爱奇艺
GM_addStyle(`.iqp-logo-box,.qy-float-anchor{display:none !important}`)
 
//优酷
GM_addStyle(`.youku_vip_pay_btn,.youkufixedbar_fixed_bar,.youku-layer-logo{display:none !important}`)
 
//快捷键：n(78)下一集、t(84)弹幕
switch( window.location.host) {
    case 'v.qq.com':
        window.onkeydown = function (event) {
            switch(event.keyCode) {
                case 78:
                    var next=document.querySelector('.txp_btn_next_u');
                    next.click();
                    break;
                case 84:
                    var barrage=document.querySelector('.barrage-switch ');
                    barrage.click();
                    break;
            }
        }
        break;
    case 'www.bilibili.com':
        window.onkeydown = function (event) {
            switch(event.keyCode) {
                case 78:
                    var next=document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-next')[0];
                    if(!next){
                        next=document.getElementsByClassName('squirtle-iconfont squirtle-video-next squirtle-video-item')[0];
                    }
                    next.click();
                    break;
                case 84:
                    var barrage=document.querySelector('.bui-danmaku-switch-input');
                    if(!barrage){
                        barrage=document.getElementsByClassName('bpx-player-dm-switch bui bui-switch')[0].getElementsByTagName('input')[0];
                    }
                    barrage.click();
                    break;
            }
        }
        break;
}