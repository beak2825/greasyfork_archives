// ==UserScript==
// @name        HUYA Dark
// @description 虎牙直播 - 黑暗主题 无礼物模式
// @namespace   http://www.huya.com/
// @author      游客
// @include     http*://www.huya.com/*
// @version     1.3.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28879/HUYA%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/28879/HUYA%20Dark.meta.js
// ==/UserScript==
// 修改抖动的BUG 删除输入框上边的一条白线
// 去掉聊天区的爵位等级标志
// 去掉屏幕下方的白色区域
// 修改聊天区隐藏
// 修改虎牙升级后聊天区格式变化的内容
// 隐藏周榜
// 固定控制条 隐藏活动公告 隐藏聊天区的公告
// 删除新增的广告层
// 隐藏 周榜

function hideOT()
{
    //$('.room-hd').hide();
    //$('.week-rank').hide();
    //$('.room-sidebar').hide();
    $(".noble-speak-wrap").css("cssText", "padding:0 17px 0 12px!important");
    $(".noble-enter-wrap").css("cssText", "padding:0 17px 0 12px!important");
    $(".box-noble-enter").css("cssText", "padding:0 17px 0 12px!important");
    $('body').css("background-color", "#000");
    $(".room-sidebar").css("background", "#000");
    $(".chat-room__ft").css("border-top", "0px");
    $(":input[name='hsk']").css("border-radius", "0px");
    $(":input[name='hsk']").css("border", "0px");
    $(":input[name='hsk']").css("background", "#222");
    $(".duya-header-wrap").css("border-bottom", "0px");
    $(".duya-header-wrap").css("background", "#000");
    $(".player-ctrl-wrap").css("background", "#000");
    $(".room-hd").css("background-color", "#000");
    $(".room-hd").css("border", "0px");
    $(".host-detail").css("background", "#000");
    $(".host-control-other").css("background", "#000");
    $(".illegal-report").css("background", "#000");
    $(".share-entrance").css("background", "#000");
    $("#activityCount").css("background", "#000");
    $(".room-player-wrap").css("background", "#000");
    $("#js-week-btn").css("background", "#000");
    $("#js-fans-btn").css("background", "#000");
    $(".week-rank__unit").css("background", "#000");
    $(".chat-room__tab").css("background-color", "#000");
    $(".chat-room__ft").css("background", "#000");
    $("#pub_msg_input").css("background", "#181818");
    $(".chat-room__wrap").css("background", "#000");
    $(".chat-room__bd").css("background", "#000");
    $(".current-peo-tit").css("background", "#000");
    $(".noble-enter-wrap").css("background", "#000");
    $(".box-noble").css("background", "#000");
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
    $('.box-noble-level-2').remove();
    $('.room-player-wrap .room-player-main .room-player-gift-placeholder').css('background', '#000');
    $("#chat-room__list > li > p").css("color", "rgb(43, 120, 198)");
    $("#chat-room__list > li > p").hide();
    $(".colon").hide();
    $(".msg-nobleEnter-cont").hide();
    $(".msg-nobleEnter").hide();
    $(".tit-h-send").hide();

    $(".week-rank__hd.clearfix").hide();
    $(".msg-nobleSpeak-decorationSuffix").hide();
    $(".msg-nobleSpeak-decorationPrefix").hide();
    $(".msg-normal-decorationPrefix").hide();
    $("#wrap-income").hide();
    $("#wrap-notice").hide();
    //$("").hide();
    $('#J_mainWrap').css('height', 'auto');
    $("#J_mainWrap").css("width", "auto");

    $("#J_weekRankList > li:nth-child(1) > span.item-num").hide();
    $("#J_weekRankList > li:nth-child(1) > span.noble-icon").hide();
    $("#J_weekRankList > li:nth-child(1) > span.week-rank-name.J_name").hide();
    $("#J_weekRankList > li:nth-child(1) > span.level-icon").hide();
    $("#J_weekRankList > li:nth-child(1) > span.gold-num").hide();

    $("#J_weekRankList > li:nth-child(2) > span.item-num").hide();
    $("#J_weekRankList > li:nth-child(2) > span.noble-icon").hide();
    $("#J_weekRankList > li:nth-child(2) > span.week-rank-name.J_name").hide();
    $("#J_weekRankList > li:nth-child(2) > span.level-icon").hide();
    $("#J_weekRankList > li:nth-child(2) > span.gold-num").hide();

    $("#J_weekRankList > li:nth-child(3) > span.item-num").hide();
    $("#J_weekRankList > li:nth-child(3) > span.noble-icon").hide();
    $("#J_weekRankList > li:nth-child(3) > span.week-rank-name.J_name").hide();
    $("#J_weekRankList > li:nth-child(3) > span.level-icon").hide();
    $("#J_weekRankList > li:nth-child(3) > span.gold-num").hide();
    $(".open-souhu.clickstat").hide();
    $(".host-channel").hide();
    $(".host-rid").hide();
    $("#J_roomHeader > div.room-hd-r > div > div.host-control-other.J_roomHdCtrlOther").hide();
    $("#J_roomNotice").hide();
    setTimeout(hideOT, 500);
}

hideOT();

$(".sidebar-hide").append("<div><script type='text/javascript'>function ActiveResize(){if(document.createEvent){var event=document.createEvent('HTMLEvents');event.initEvent('resize',true,true);window.dispatchEvent(event);}else if(document.createEventObject){window.fireEvent('onresize');}} function fun_hide(){$('.room-sidebar').css('width', '0px');$('.room-player-main').css('margin-right', '0px'); $('.room-core-l').css('margin-right','0px'); $('.room-core-r').hide(); ActiveResize();}function fun_show(){$('.room-sidebar').css('width', '338px');$('.room-player-main').css('margin-right', '350px');$('.room-core-l').css('margin-right','350px');$('.room-core-r').show();ActiveResize(); $('.room-sidebar').css('height', '');$('.chat-room__panel').css('height', '');$('#watchChat_pub').css('height', '');$('.scroll_bar').css('height', '92%');$('#chat-room__wrap').css('height', '92%');} fun_show();</script><p align=center><br><a href=javascript:voide(); onclick='fun_show()'>显示<br>聊天</a><br><br><a href=javascript:voide(); onclick='fun_hide()'>网页<br>全屏</a></p></div>");

(function() {var css = [
    ".player-ctrl-wrap { height:16px  !important; }",
    ".player-ctrl-wrap { bottom: 20px  !important; }",
    ".msg-nobleSpeak { background-color: #000; }",
    ".box-noble-level-1:after { background: #000;} ",
    ".box-noble-level-2:after { background: #000;} ",
    ".box-noble-level-3:after { background: #000;} ",
    ".box-noble-level-4:after { background: #000;} ",
    ".box-noble-level-5:after { background: #000;} ",
    "#player-full-input, .room-footer, #J_roomGgTop { visibility: hidden !important; } ",
    "#wrap-notice, #wrap-income  { visibility: hidden !important; } ",
    ".main-room {min-width: 960px !important; }",
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
