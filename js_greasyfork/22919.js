// ==UserScript==
// @name 		 	HTTPS_Adblock
// @name:zh-CN 		HTTPS页面去广告
// @description 	HTTPS AD KILL KILL KILL KILL KILL ...
// @description:zh-cn	HTTPS页面去广告 ...
// @include 		http*://*.douyu.com/*
// @include 		http*://*.panda.*/*
// @include 		https://*.baidu.com/*
// @include 		https://*.google.*/*
// @include 		https://*.yahoo.*/*
// @include         https://avmo.pw/*
// @include         https://avio.pw/*
// @include         https://*.javbus.*/*
// @include         http*://hk*.*/*
// @include         http*://*.maya*.*/*
// @include         http*://thz*.*/*
// @version 		2018.10.31.01
// @run-at 			document-body
// @require 		https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @namespace 		https://greasyfork.org/users/685
// @downloadURL https://update.greasyfork.org/scripts/22919/HTTPS%E9%A1%B5%E9%9D%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/22919/HTTPS%E9%A1%B5%E9%9D%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

var Rules = /* 去广告规则:双引号"需要用\转移,除了结尾行用分号;结尾,其他行用加号+结尾 */
	/* 全局广告 */ "[class^=\"ads\"],div[class$=\"-ad\"],[id^=\"cpro_\"],[src^=\"https://pos.baidu.\"],"+
	/* 黄网广告 */ "[href*=\".com/?Intr=\"],[href*=\".com/?aff=\"],img[src^=\"http://205.209.138.102\"],"+
	/* 斗鱼广告 */ "div[id^=\"sign_p_\"],div[class^=\"ngad-\"],.SysSign-Ad,div[class^=\"ACT110913\"],"+
	/* 熊猫广告 */ "div[class^=\"room-banner-\"],"+
	/* 雅虎广告 */ "[class^=\"yom-ad\"],[id^=\"yom-ad\"],[id^=\"adbn_\"],[id$=\"-Ad\"],[id*=\"-ad-\"]:not([class=\"ad-map\"]),.adModule,[id*=\"AS6Wrapper\"],[id*=\"-Banner\"],"+
	/* 比思論壇 */ ".a_mu,.a_t,.a_pb,.a_pt,img[src*=\"/ad/ad\"],"+
	/*  AVMOO-JavBus  */ "[id*=\"_POPUNDER-\"],#advertisingModal,.bn728-93,.col-xs-12.col-md-4.text-center.ptb10,.row.ptb30,.ad-list,.ad-table,.a_fl,.a_cn,.a_fr,#diynavtop";

$('head').append('<!-- HTTPS_Adblock_Rules -->\n<style type="text/css">\n'+Rules+'{display:none!important;display:none}\n</style>'); /* head插入css隐藏规则 */
$(Rules).remove(); /* JQ移除广告块规则,本行为页面加载时执行 */

/* JQ移除广告块规则,以下的所有规则为页面加载完后再执行 */
options = {childList: true, subtree: true};
new MutationObserver(function(rs) {
	this.disconnect();

	$(Rules).remove(); //JQ移除广告块

	this.observe(document.body, options);
}).observe(document.body, options);