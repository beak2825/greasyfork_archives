// ==UserScript==
// @name        HUYA Color
// @description 虎牙直播  - 解开弹幕颜色限制
// @namespace   http://www.huya.com/
// @author      游客
// @include     http*://www.huya.com/*
// @version     1.3.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33096/HUYA%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/33096/HUYA%20Color.meta.js
// ==/UserScript==
// 1.2 虎牙升级 J-color-list-level 代替位 J-color-list-fans
// 去掉改变高度的代码
// 虎牙域名 http 改为 https
// 1.2.6 隐藏金豆礼物
// 1.2.7 隐藏不必要的内容
// 1.2.8 修改部分背景颜色
// 1.2.9 增加可改变背景颜色
// 1.3.5 左边增加 白色/灰色背景 按钮
// 1.3.6 修改系统升级后视频窗口大小变小的问题

function hideOT()
{
    $(".room-footer").hide();
    $(".jump-to-phone").hide();
    $(".illegal-report.clickstat").hide();
    $("#J_hySide").hide();
    $("#hy-watermark").hide();
    $("#player-recharge-btn").hide();
    $(".room-footer-r").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(2)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(3)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(4)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(5)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(6)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(7)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(8)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(9)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(10)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(11)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(12)").hide();
    $("#player-face > div.player-face-list.player-face-list-ctrl > ul > li:nth-child(13)").hide();
    $("#J_roomGgTop").hide();
    $("#wrap-income").hide();
    $("#week-star-btn").hide();
    $("#player-face > div.player-face-arrow.player-face-next").hide();
    $("#player-face > div.player-face-arrow.player-face-pre").hide();
/*
    $("#J_weekRankList > li:nth-child(1) > span.noble-icon").hide();
    $("#J_weekRankList > li:nth-child(1) > span.week-rank-name.J_name").hide();
    $("#J_weekRankList > li:nth-child(1) > span.level-icon").hide();

    $("#J_weekRankList > li:nth-child(2) > span.noble-icon").hide();
    $("#J_weekRankList > li:nth-child(2) > span.week-rank-name.J_name").hide();
    $("#J_weekRankList > li:nth-child(2) > span.level-icon").hide();

    $("#J_weekRankList > li:nth-child(3) > span.noble-icon").hide();
    $("#J_weekRankList > li:nth-child(3) > span.week-rank-name.J_name").hide();
    $("#J_weekRankList > li:nth-child(3) > span.level-icon").hide();
 //*/
    $("#J_roomHeader > div.room-hd-l > div.host-info > div.host-detail.J_roomHdDetail > span.open-souhu.clickstat").hide();
    $("#J_roomHeader > div.room-hd-l > div.host-info > div.host-detail.J_roomHdDetail > span.host-channel").hide();
    $("#J_roomHeader > div.room-hd-l > div.host-info > div.host-detail.J_roomHdDetail > span.host-rid").hide();
    //$("#J_roomNotice").hide();
    $(".movie-rank-icon").hide();
    $("#player-gift-wrap > div.player-gift-left > div.ship-icon").hide();
    //$("#player-gift-wrap > div.player-gift-left > div.tv-icon").hide();
    $("#J_roomHeader > div.room-hd-r > div > div.host-control-other.J_roomHdCtrlOther > div.jump-to-phone").hide();
    $("#share-entrance").hide();
    $("#J_roomHeader > div.room-hd-r > div > div.host-control-other.J_roomHdCtrlOther > div.illegal-report.clickstat").hide();
    $("").hide();
/*
    $("body").css("background-color","#ccc");
    $("#player-video").css("background","#FFF");
    $(".player-gift-wrap").css("background","#FFF");
    $(".room-wrap").css("background","#FFF");
    $(".room-hd").css("background","#FFF");
 //*/
    $(".subscribe-live-item .video-info .item-mask.off").css("opacity","0");
    $(".item-mask").hide();
    $(".btn-link__hover_i").hide();
    $(".player-face li .plaer-face-icon-bg").css("border","0px solid #EEE");
    $("#J_mainRoom").css("padding","0");
    $("#J_mainRoom").css("min-width","0");
    setTimeout(hideOT, 10);
}



hideOT();
//$(".main-room").css("height","98%");

$("#J-room-chat-color").mouseover();
$(".room-chat-tools").append("<script type='text/javascript'>function hideOT(){ $('.youlike').hide(); $('.huya-video').hide();   $('.box-crumb').hide();  $('#J_spbg').hide();$('#J-color-list-fans > li:nth-child(2)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(3)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(4)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(5)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(6)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(7)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(8)').attr('class','color-item');} hideOT();</script><a href=javascript:voide(); onclick='hideOT()'>解开颜色</a></p>");
$("#J-room-chat-color").mouseout();

$(".sidebar-hide").append("<script type='text/javascript'>function hcc(){$(\".room-hd-r\").css(\"opacity\",\".95\");$(\".room-hd-r\").css(\"filter\",\"grayscale(1)\");$(\".host-level\").css(\"opacity\",\".95\");$(\".host-level\").css(\"filter\",\"grayscale(mode)\");$(\"#duya-header\").css(\"opacity\",\".95\");$(\"#duya-header\").css(\"filter\",\"grayscale(1)\");$(\"#player-gift-wrap\").css(\"opacity\",\"1\");$(\"#player-gift-wrap\").css(\"filter\",\"grayscale(1)\");}function ctc(c){$('.match_body_wrap').css('background',c);$('.room-hd .host-info .host-title h1').css('color',c);$('.room-hd .host-name').css('color',c);$('#live-count').css('color',c);$('#player-package-btn').css('color',c);$('.box-icon-word').css('color',c); }function cbc(c){ $('body').css('background-color',c);$('#player-video').css('background',c);$('.player-gift-wrap').css('background',c);$('.room-wrap').css('background',c);$('.room-hd').css('background',c);}</script><div><p align=center><br><a href=javascript:void(0); onclick='cbc(\"#FFF\");ctc(\"#3a3a3a\");$(\"body\").css(\"background-color\",\"#f7f7f7\");$(\"#main_col\").css(\"background-color\",\"#f7f7f7\");$(\"#matchLive1791\").css(\"background\",\"#f7f7f7\");$(\".room-core .room-core-r\").css(\"opacity\",\".95\");$(\".room-core .room-core-r\").css(\"filter\",\"grayscale(0)\");$(\".match_body_wrap\").css(\"background\",\"#FFF\");hcc();'>背景<br>白色</a></p><br><p align=center><a href=javascript:void(0); onclick='cbc(\"#222\");ctc(\"#888\");$(\".room-core .room-core-r\").css(\"opacity\",\".9\");$(\".room-core .room-core-r\").css(\"filter\",\"grayscale(1)\");$(\"body\").css(\"background-color\",\"#1e1e1e\");$(\"#main_col\").css(\"background-color\",\"#1e1e1e\");$(\"#matchLive1791\").css(\"background\",\"#1e1e1e\");$(\".match_body_wrap\").css(\"background\",\"#1e1e1e\");hcc();'>背景<br>灰色</a></p></div>");

//$('.room-core .room-core-r').css('opacity','.95');
//$('.room-core .room-core-r').css('filter','grayscale(1)');

$('.room-hd-r').css('opacity','.95');
$('.room-hd-r').css('filter','grayscale(1)');

$('.host-level').css('opacity','.95');
$('.host-level').css('filter','grayscale(1)');

$('#duya-header').css('opacity','.95');
$('#duya-header').css('filter','grayscale(1)');

$('#player-gift-wrap').css('opacity','1');
$('#player-gift-wrap').css('filter','grayscale(1)');


(function() {var css = [
    //" .room-player-wrap { height:100%;  !important; }",
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