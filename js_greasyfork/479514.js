// ==UserScript==
// @name         视频VIP破解
// @namespace    http://86821241.qzone.qq.com/
// @version      2025-05-28
// @description  在页面上显示“vip解析”按钮，解析视频。支持哔哩哔哩、爱奇艺、腾讯视频、优酷、芒果TV、搜狐视频、PP视频、乐视视频。
// @author       q86821241
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.iqiyi.com/v_*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/channel/*
// @match        *://v.youku.com/v_show/*
// @match        *://v.youku.com/video?*
// @match        *://tv.sohu.com/v/*
// @match        *://film.sohu.com/album/*
// @match        *://v.pptv.com/show/*
// @match        *://www.le.com/ptv/vplay/*
// @match        *://www.mgtv.com/b/*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/479514/%E8%A7%86%E9%A2%91VIP%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/479514/%E8%A7%86%E9%A2%91VIP%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).resize(function(){
        ReSize();
    });
    var selectInfo = '<option value="">自动线路</option>', selectArray = [
        'https://im1907.top/?jx=',
        'https://jx.playerjy.com/?url=',
        'https://www.8090g.cn/?url=',
        'https://jx.xmflv.com/?url=',
        'https://jx.m3u8.tv/jiexi/?url=',
        'https://www.playm3u8.cn/jiexi.php?url=',
        'https://www.ckplayer.vip/jiexi/?url=',

    ];
    selectArray.forEach(function(item, index){
        selectInfo+= '<option value="' + item + '">线路' + (index + 1) + '</option>';
    })
    var RemoveMask = null, AppendSelect = null, PlayPause = null, style_info = '', randomIndex, ReSize = function() {
        var width = Math.ceil($(window).width() * 0.75), height = Math.ceil(width / 16 * 9), left = width / 2, top = height / 2;
        //console.log(randomIndex)
        if (randomIndex == 0) {
            height+= 46;
        }
        $(".LwgPlayer").css("width", width);
        $(".LwgPlayer").css("height", height);
        $(".LwgPlayer").css("marginLeft", '-' + left + 'px');
        $(".LwgPlayer").css("marginTop", '-' + top + 'px');
    }
    style_info+= '.LwgVip{display:flex;font-size:15px;overflow:hidden;}';
    style_info+= '.bpx-player-sending-area .LwgVip{float:left;background-color:#fff;line-height:32px;padding-right:8px}';//哔哩哔哩
    style_info+= '#tvg .LwgVip{margin:8px}';//爱奇艺
    style_info+= '.playlist-side__main .LwgVip{margin-bottom:8px}';//腾讯
    style_info+= '.right-wrap .LwgVip{margin:12px 24px;}';//优酷
    style_info+= '.player-content-info .LwgVip{float:left;margin:17px 0 0 20px;}';//搜狐
    style_info+= '.vBox-tb .LwgVip{float:left;margin-right:20px;}';//搜狐
    style_info+= '.modeselect .LwgVip{float:left;margin:12px 0 0 20px;}';//PPTV
    style_info+= '._Outer_1ocse_1 .LwgVip{float:left;margin:23px 0 0 20px;}';//芒果
    style_info+= '.left_func .LwgVip{float:left;margin:12px 0 0 20px;}#j-barrage{position: relative;}';//乐视
    style_info+= '.LwgVip select{color:#333333;border:1px solid #d2d2d2;border-radius:2px;padding:0 5px;height:26px;-webkit-appearance:button;}';
    style_info+= '.LwgVip button{color:#ff5722;border:1px solid #ff5722;border-radius:2px;padding:0 5px;height:26px;line-height:26px;display:inline-block;margin-left:8px;background:none;font-size:14px;}';
    style_info+= '.LwgMask{position:fixed;_position:absolute;top:0;left:0;z-index:16777270;width:100%;height:100%;background:#000;filter:alpha(opacity=75);opacity:0.75}';
    style_info+= '.LwgPlayer{top:50%;left:50%;position:fixed;z-index:16777271;display:block}';
    style_info+= '.LwgClose{font-size:16px;position:absolute;right:-24px;top:-24px;border-radius:16px;display:block;width:28px;height:28px;line-height:28px;text-align:center;background-color:#ebebeb;color:#999;font-family:none;cursor:pointer}';
    style_info+= '@media screen and (min-width:1321px){.barrage .postBarrage{width:310px}.barrage .postBarrage input{width:208px}}';
    $("<style></style>").text(style_info).appendTo($("head"));
    $(document).ready(function(){
        //哔哩哔哩
        if(window.location.href.indexOf("www.bilibili.com") != -1){
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('.bpx-player-sending-bar').prepend('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".twp-mask.twp-float").length){
                    $('.twp-mask.twp-float').remove();
                    PlayerShow();
                }
            },1000);
        }
        //爱奇艺
        if(window.location.href.indexOf("www.iqiyi.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('#tvg').prepend('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function() {
                if($("#playerPopup .vippay-popup").length) {
                    $('#playerPopup .vippay-popup').remove();
                    $('#playerPopup').hide();
                    PlayerShow();
                }
                if($(".pcw").length) $('.pcw').parent().remove();
            },1000);
        }
        //腾讯
        if(window.location.href.indexOf("v.qq.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('.playlist-intro').before('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".panel-overlay").length){
                    $('.panel-overlay').remove();
                    PlayerShow();
                }
            },1000);
            setInterval(function(){
                $('.card-wrap,.panel-tip-pay.panel-tip-pay-video').remove();
                $('txpdiv[data-role="creative-player-video-layer"]').hide();
            },2000);
        }
        //优酷
        if(window.location.href.indexOf("v.youku.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    console.log($('.tabs-wrap'));
                    $('.tabs-wrap').next().before('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".vip_player_payment_pop").length && !$(".vip_player_payment_pop").hasClass('none')){
                    $('.vip_player_payment_pop').addClass('none');
                    PlayerShow();
                }
            },1000);
        }
        //搜狐
        if(window.location.href.indexOf("film.sohu.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('.share-item').before('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".play-end-pop").length && $(".play-end-pop").css('display') != 'none'){
                    $('.play-end-pop,#play-end-overlay').hide();
                    PlayerShow();
                }
            },1000);
        }
        if(window.location.href.indexOf("tv.sohu.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('.vBox-tb').prepend('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".player_vipTips").length){
                    $('.player_vipTips').remove();
                    PlayerShow();
                }
            },1000);
        }
        //芒果
        if(window.location.href.indexOf("www.mgtv.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('._video_info_1ocse_11').before('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".m-player-paytips").length){
                    $('.m-player-paytips').parent().removeAttr('style');
                    $('.m-player-paytips').remove();
                    PlayerShow();
                }
            },1000);
        }
        //乐视
        if(window.location.href.indexOf("www.le.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('.left_func').prepend('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn">vip解析</button></div>');
                    clearInterval(AppendSelect);
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".playbox_vip_tip").length){
                    $('.playbox_vip_tip').parent().remove();
                    $('.playbox_vip_tip').remove();
                    PlayerShow();
                }
            },1000);
        }
        //点击解析
        $(document).on('click','#LwgVipBtn',function(){
            if(window.location.href.indexOf("curid=") != -1){//爱奇艺播放列表解析
                var curid = window.location.href.split("curid=");
                var cur_id = curid[1].split("_");
                $.getScript("https://cache.video.iqiyi.com/jp/vi/"+cur_id[0]+"/"+cur_id[1]+"/", function(){
                    PlayerShow(tvInfoJs['vu'])
                });
            }else{
                PlayerShow();
            }
        });
    });
    setTimeout(function(){
        //PPTV
        if(window.location.href.indexOf("v.pptv.com") != -1) {
            AppendSelect = setInterval(function(){
                if ($('.LwgVip').length == 0) {
                    $('.modeselect').prepend('<div class="LwgVip"><select id="LwgVipSelect">' + selectInfo + '</select><button id="LwgVipBtn_pptv">vip解析</button></div>');
                    clearInterval(AppendSelect);
                    $("#LwgVipBtn_pptv").click(function(){
                        PlayerShow();
                    });
                }
            },1000);
            RemoveMask = setInterval(function(){
                if($(".mediaplayer-error").length){
                    $('.mediaplayer-error').remove();
                    PlayerShow();
                }
            },1000);
        }
    }, 2000);
    var PlayerShow = function(url = window.location.href){
        var VipSelect = $('#LwgVipSelect').val();//获取选择的线路
        if (VipSelect == '') {
            randomIndex = Math.floor(Math.random() * 6);
            VipSelect = selectArray[randomIndex];
        } else {
            randomIndex = $('#LwgVipSelect').prop('selectedIndex') - 1;
        }
        if(url.substr(0,5) != 'https' || (VipSelect.substr(0,5) == 'https' && url.substr(0,5) == 'https')){
            $('body').css("overflow-y","hidden");//取消页面滚动
            $('body').append('<div class="LwgMask"></div>');//创建遮罩层
            $('body').append('<div class="LwgPlayer"><iframe allowfullscreen="true" allowtransparency="true" frameborder="0" scrolling="no" src="'+VipSelect+url+'" width="100%" height="100%"></iframe><div class="LwgClose">X</div></div>');//创建播放器
            ReSize();
            PlayPause = setInterval(function(){
                //哔哩哔哩
                if(window.location.href.indexOf("www.bilibili.com") != -1) {
                    console.log($('.bpx-player-ctrl-play svg'));
                    if($('.bpx-player-container').hasClass('bpx-state-paused') === false) $('.bpx-player-ctrl-play').trigger("click");
                }
                //爱奇艺
                if(window.location.href.indexOf("www.iqiyi.com") != -1) {
                    if($('.iqp-player-innerlayer .iqp-icon-pause .iqp-svg-play').css('display') != 'none') $('.iqp-player-innerlayer .iqp-btn-pause').trigger("click");
                }
                //腾讯
                if(window.location.href.indexOf("v.qq.com") != -1) {
                    if($('.txp_btn_play').attr('data-status') == 'pause') $('.txp_btn_play').trigger("click");
                }
                //优酷
                if(window.location.href.indexOf("v.youku.com") != -1) {
                    if(window.getComputedStyle(document.querySelector('.kui-play-icon-0'), ':before').getPropertyValue('content') != '""' && $('#click-close').length === 0) $('.kui-play-icon-0').trigger("click");
                }
                //搜狐
                if(window.location.href.indexOf("film.sohu.com") != -1 || window.location.href.indexOf("tv.sohu.com") != -1) {
                    if($('.x-play-btn').attr('data-title') == '暂停') $('.x-play-btn').trigger("click");
                }
                //PPTV
                if(window.location.href.indexOf("v.pptv.com") != -1) {
                    if($('.w-playPause-button').hasClass('w-pause')) $('.w-playPause-button').trigger("click");
                }
                //芒果
                if(window.location.href.indexOf("www.mgtv.com") != -1) {
                    if($('.mango-control-bar .icon-paused').length !== 0) $('.icon-paused').trigger("click");
                }
                //乐视
                if(window.location.href.indexOf("www.le.com") != -1) {
                    if($('.hv_start span').hasClass('hv_ico_star')) $('.hv_start span').trigger("click");
                }
            },1000);
            $('.LwgClose').on('click',function(){
                $('body').css("overflow-y","auto");
                $('.LwgMask').remove();
                $('.LwgPlayer').remove();
                clearInterval(PlayPause);
            });
        }else{
            PlayPause = setInterval(function(){
                //哔哩哔哩
                if(window.location.href.indexOf("www.bilibili.com") != -1) {
                    console.log($('.bpx-player-ctrl-play svg'));
                    if($('.bpx-player-container').hasClass('bpx-state-paused') === false) $('.bpx-player-ctrl-play').trigger("click");
                }
                //爱奇艺
                if(window.location.href.indexOf("www.iqiyi.com") != -1) {
                    if($('.iqp-player-innerlayer .iqp-icon-pause .iqp-svg-play').css('display') != 'none') $('.iqp-player-innerlayer .iqp-btn-pause').trigger("click");
                }
                //腾讯
                if(window.location.href.indexOf("v.qq.com") != -1) {
                    if($('.txp_btn_play').attr('data-status') == 'pause') $('.txp_btn_play').trigger("click");
                }
                //优酷
                if(window.location.href.indexOf("v.youku.com") != -1) {
                    if(window.getComputedStyle(document.querySelector('.kui-play-icon-0'), ':before').getPropertyValue('content') != '""' && $('#click-close').length === 0) $('.kui-play-icon-0').trigger("click");
                }
                //搜狐
                if(window.location.href.indexOf("film.sohu.com") != -1 || window.location.href.indexOf("tv.sohu.com") != -1) {
                    if($('.x-play-btn').attr('data-title') == '暂停') $('.x-play-btn').trigger("click");
                }
                //PPTV
                if(window.location.href.indexOf("v.pptv.com") != -1) {
                    if($('.w-playPause-button').hasClass('w-pause')) $('.w-playPause-button').trigger("click");
                }
                //芒果
                if(window.location.href.indexOf("www.mgtv.com") != -1) {
                    if($('.mango-control-bar .icon-paused').length !== 0) $('.icon-paused').trigger("click");
                }
                //乐视
                if(window.location.href.indexOf("www.le.com") != -1) {
                    if($('.hv_start span').hasClass('hv_ico_star')) $('.hv_start span').trigger("click");
                }
            },1000);
            window.open(VipSelect+url,'VipPlayer','height=720,width=1280,top='+(window.screen.availHeight/2-360)+',left='+(window.screen.availWidth/2-640)+',help=no,resizable=no,status=no,scroll=no');
        }
    }
    })();