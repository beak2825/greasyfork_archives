// ==UserScript==
// @name        HUYA 
// @description 虎牙直播  无礼物模式
// @namespace   http://www.huya.com/
// @author      test2
// @include     http://www.huya.com/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34117/HUYA.user.js
// @updateURL https://update.greasyfork.org/scripts/34117/HUYA.meta.js
// ==/UserScript==
// 修改抖动的BUG 删除输入框上边的一条白线
function hideOT()
{
    //$('.room-hd').hide();
    //$('.week-rank').hide();
    //$('.room-sidebar').hide();
    $(".noble-speak-wrap").css("cssText", "padding:0 17px 0 12px!important");
    $(".noble-enter-wrap").css("cssText", "padding:0 17px 0 12px!important");
    $(".box-noble-enter").css("cssText", "padding:0 17px 0 12px!important");
    $('body').css("background-color", "#fff");
    $(".room-sidebar").css("background", "#fff");
    $(".chat-room__ft").css("border-top", "0px");
    $(":input[name='hsk']").css("border-radius", "0px");
    $(":input[name='hsk']").css("border", "0px");
    $(":input[name='hsk']").css("background", "#222");
    $(".duya-header-wrap").css("border-bottom", "0px");
    $(".duya-header-wrap").css("background", "#fff");
    $(".player-ctrl-wrap").css("background", "#fff");
    $(".room-hd").css("background-color", "#fff");
    $(".room-hd").css("border", "0px");
    $(".host-detail").css("background", "#fff");
    $(".host-control-other").css("background", "#fff");
    $(".illegal-report").css("background", "#fff");
    $(".share-entrance").css("background", "#fff");
    $("#activityCount").css("background", "#fff");
    $(".room-player-wrap").css("background", "#fff");
    $("#js-week-btn").css("background", "#fff");
    $("#js-fans-btn").css("background", "#fff");
    $(".week-rank__unit").css("background", "#fff");
    $(".chat-room__tab").css("background-color", "#fff");
    $(".chat-room__ft").css("background", "#fff");
    $("#pub_msg_input").css("background", "#181818");
    $(".chat-room__wrap").css("background", "#fff");
    $(".chat-room__bd").css("background", "#fff");
    $(".current-peo-tit").css("background", "#fff");
    $(".noble-enter-wrap").css("background", "#fff");
    $(".box-noble").css("background", "#fff");
    $(".noble-enter-wrap").css("border", "0px");
    $(".box-noble").css("border", "0px");
    $(".room-sidebar").css("border", "0px");
    $(".week-rank__hd").css("border-top", "0px");
    $(".week-rank__unit").css("border-bottom", "0px");
    $(".chat-room__hd").css("border-top", "0px");
    $(".chat-room__ft__chat").css("border", "0px");
    $(".chat-room__input").css("border-left", "0px");
    $(".chat-room__input").css("margin-left", "0px");
    $('.notice-tit').hide();
    $('#J-room-chat-font').hide();
    $('#J-room-chat-color').hide();
    $('#J_inputEmot').hide();
    $('#player-marquee-bg').hide();
    $('.youlike').hide();
    $('.huya-video').hide();
    $('.hd-wrap').hide();
    $('.reddot').hide();
    $('.chat-host-pic').hide();
    $('.chat-room__ft__pannel').hide();
    $('.player-gift-wrap').hide();
    $('.btn-link__hover_i').hide();
    $(".player-wrap").css("height", "calc(100% - 40px)");
    $(".main-room").css("padding", "0px 25px 0");
    //$(".room-player-main").css("margin-right", "300px");
    //$(".room-sidebar").css("width", "290px");
    //$(".chat-room__ft").css("width", "290px");
    $("#pub_msg_input").css("width", "320px");
    $("#pub_msg_input").css("border-radius", "10px");
    $("#pub_msg_input").css("color", "#999");
    $('#msg_send_bt').hide();
    $(".host-name").css("color", "#77C773");
    $(".match_body_wrap").css("background", "#000");
    $("#main_col").css("background", "#000");
    $(".room-wrap").css("background", "#000");
    $(".special-bg").css("height", "120px");
    $(".special-bg").css("background-image", "");
    $(".special-bg").remove();
    $(".game-live-item").css("background", "#000");
    $(".num").css("background", "#000");
    $(".week-rank-name").css("color", "#666");
    $(".sidebar-hide").css("background", "#000");
    $(".sidebar-show").css("background", "#000");
    $("#avatar-img").css("border-radius", "50%");
    $("#avatar-img").css("opacity", "0.3");
    $('.g-gift').hide();
    $('.banner').hide();
    $('.item-mask').hide();
    $(".pic").css("border-radius", "20px");
    $("img").removeAttr('title');
    $("img").removeAttr('alt');
    $(".header-search-tips").css("background-color", "#000");
    $(".header-search-tips").css("border", "1px solid #333");
    $(".tag").css("opacity", "0.5");
    $(".tag").css("border-radius", "50%");
    $(".btn-subscribe").css("opacity", "0.48");
    $("#duya-header-logo").css("opacity", "0.48");
    $("#login-userAvatar").css("opacity", "0.48");
    $(".danmu-show-btn").css("opacity", "0.48");
    $(".sound-progress").css("opacity", "0.4");
    $(".send-to").hide();
    $('.noble-enter-pic').hide();
    $('.player-banner-gift').hide();
    $('li').css("line-height", "16px");
    $('.box-noble-icon').hide();
    $(".box-noble").css("padding", "0 0px 0 0px");
    $(".noble-speak-wrapr").css("line-height", "16px");
    $(".noble-speak-wrapr").css("height", "16px");
    $(".box-noble-enter").css("line-height", "16px");
    $(".box-noble-enter").css("height", "16px");
    $(".noble-enter-wrap").css("line-height", "16px");
    $(".noble-enter-wrap").css("height", "16px");
    $('.fans-icon').hide();
    $('.admin-icon').hide();
    $('.gift-info-wrap').hide();
    $('#player-subscribe-wap').hide();
    $(".name").css("color", "rgb(119, 199, 115)");
    $(".name-wrap").css("color", "rgb(119, 199, 115)");
    $(".text-content").css("color", "#2B78C6");
    $(".msg").css("color", "#2B78C6");
    $("#live-count").css("color", "#56b9fe");

    $(".name-wrap").hide();
    $(".name").hide();
    $(".icon-labels").hide();
    $(".msg-hd").hide();

    $(".box-noble-enter").hide();
    //$('.room-player-wrap').css('height', '720px');
    $('.host-title').css('color', '#606060');
    $(".sidebar-hide .sidebar-icon-author").hide();
    $("a.gov-jb.sq-gov-jb").hide();
    $("#hy-watermark").hide();
    $('#watchChat_pub .scroll_move').css('background', '#222');
    $('.room-player-wrap .room-player').css('height', '100%');
    $('.week-rank__hd .week-rank__btn.active').css('background', '#000');
    $('.week-rank__hd .week-rank__btn').css('background', '#000');
    $('.box-noble-level-1:after').hide();
    $('.box-noble-level-1.box-noble-level-1:after').hide();
    $('.box-noble-level-2.box-noble-level-2:after').hide();
    $('.box-noble-level-3.box-noble-level-3:after').hide();
    $('.box-noble-level-4.box-noble-level-4:after').hide();

    $(".J_msg").css("line-height", "10px");
    $(".msg-normal").css("line-height", "10px");
    $(".msg-hd").css("line-height", "10px");
    $(".labels").css("line-height", "10px");
    $(".name-wrap").css("line-height", "10px");
    $("#tipsOrchat").css("border-top", "0px");
    setTimeout(hideOT, 500);
}

hideOT();

$(".sidebar-hide").append("<div><script type='text/javascript'>function ActiveResize(){if(document.createEvent){var event=document.createEvent('HTMLEvents');event.initEvent('resize',true,true);window.dispatchEvent(event);}else if(document.createEventObject){window.fireEvent('onresize');}} function fun_hide(){$('.room-sidebar').css('width', '0px');$('.room-player-main').css('margin-right', '0px');ActiveResize();}function fun_show(){$('.room-sidebar').css('width', '338px');$('.room-player-main').css('margin-right', '350px');ActiveResize(); $('.room-sidebar').css('height', '');$('.chat-room__panel').css('height', '');$('#watchChat_pub').css('height', '');$('.scroll_bar').css('height', '92%');$('#chat-room__wrap').css('height', '92%');} fun_hide();</script><p align=center><br><a href=javascript:voide(); onclick='fun_show()'>显示<br>聊天</a><br><br><a href=javascript:voide(); onclick='fun_hide()'>网页<br>全屏</a></p></div>");
