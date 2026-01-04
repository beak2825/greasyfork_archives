// ==UserScript==
// @name          B站播放个性化
// @description   去除B站视频播放页面乱七八糟内容，只保留视频标题，视频播放窗口，点赞投币收藏转发按钮。
// @version       1.0.2
// @namespace     B站播放个性化
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//www.bilibili.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @license       MIT
// @rewritten_script_code javascript
// @downloadURL https://update.greasyfork.org/scripts/437957/B%E7%AB%99%E6%92%AD%E6%94%BE%E4%B8%AA%E6%80%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/437957/B%E7%AB%99%E6%92%AD%E6%94%BE%E4%B8%AA%E6%80%A7%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
	var append_html = '<style type="text/css">'+
	'html, body {'+
	'	overflow-x: hidden !important;'+
	'	background-color: #FFF !important;'+
	'}'+
	'.v-wrap .l-con {'+
	'	width: 100% !important;'+
	'	position: relative;'+
	'}'+
	'.v-wrap .l-con > * {'+
	'	display: none !important;'+
	'}'+
	'.v-wrap .l-con #viewbox_report {'+
	'	display: block !important;'+
	'}'+
	'.v-wrap .l-con #playerWrap {'+
	'	display: block !important;'+
	'}'+
	'.v-wrap .l-con #playerWrap .bilibili-player-video-sendbar .bilibili-player-video-danmaku-root .bilibili-player-video-danmaku-switch {'+
	'	display: none !important;'+
	'}'+
	'.v-wrap .l-con .bilibili-player-video-bottom-area {'+
	'	display: none;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report {'+
	'	right: -75px;'+
	'	top: 150px;'+
	'	border: none !important;'+
	'	display: block !important;'+
	'	position: absolute !important;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report .ops {'+
	'	width: 60px !important;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report .ops > span {'+
	'	margin: 0 0 10px 0 !important;'+
	'	width: auto !important;'+
	'	height: auto !important;'+
	'	text-align: center !important;'+
	'	float: none !important;'+
	'	display: block !important;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report .ops > span i {'+
	'	width: auto !important;'+
	'	display: block !important;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report .ops .share .share-pos {'+
	'	right: 0 !important;'+
	'	z-index: 9999 !important;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report .rigth-btn {'+
	'	display: none !important;'+
	'}'+
	'.v-wrap .l-con #arc_toolbar_report .more {'+
	'	display: none !important;'+
	'}'+
	'.v-wrap .l-con #bilibili-player {'+
	'	width: 100% !important;'+
	'}'+
	'.v-wrap .l-con .bilibili-player-video-danmaku {'+
	'	display: none;'+
	'}'+
	'.v-wrap .l-con #activity_vote {'+
	'	display: none !important;'+
	'}'+
	'.v-wrap .r-con {'+
	'	display: none !important;'+
	'}'+
	'.btn[data-id="zimu"] {'+
	'	right: -75px;'+
	'	top: -150px;'+
	'	width: 60px;'+
	'	line-height: 36px !important;'+
	'	text-align: center !important;'+
	'	display: block !important;'+
	'	display: block;'+
	'	box-sizing: border-box;'+
	'	line-height: 20px;'+
	'	font-size: 14px;'+
	'	letter-spacing: 0;'+
	'	text-align: center;'+
	'	transition: 0;'+
	'	color: #00A1D6;'+
	'	background: #F6F6F6;'+
	'	border-radius: 2px;'+
	'	cursor: pointer;'+
	'	position: absolute;'+
	'}'+
	'.btn[data-id="zimu"]:hover, .btn[data-id="zimu"].on {'+
	'	color: #FFF;'+
	'	background: #00A1D6;'+
	'}'+
	'</style>'+
	'<div class="v-wrap" style="position:relative;"><div class="l-con"><a href="#" class="btn" data-id="zimu">字幕</a></div></div>';
	$('body').append(append_html);

	var _btn = $('.btn[data-id="zimu"]').click(function() {
		var _obj = $(this);
		var _zimu = $('.v-wrap .l-con .bilibili-player-video-danmaku');
		var _zimu_bar = $('.v-wrap .l-con .bilibili-player-video-bottom-area');
		_zimu.find('.b-danmaku').addClass('b-danmaku-hide');

		if(_zimu.is(':hidden')) {
			alert('字幕恢复！');
			// _zimu.css({'display':'block !important'});
			_zimu.show();
			_zimu_bar.show();
			_obj.addClass('on');
		}else {
			alert('字幕隐藏！');
			// _zimu.css({'display':'none !important'});
			_zimu.hide()
			_zimu_bar.hide()
			_obj.removeClass('on');
		}
	});
}