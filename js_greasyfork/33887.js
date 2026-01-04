// ==UserScript==
// @name         GetSsLink
// @namespace    https://greasyfork.org/zh-CN/scripts/33887-getsslink
// @homepage     https://github.com/sumspec/UserScripts/tree/master/GetSsLink
// @version      1.1
// @date         2017-12-21
// @description  获取逗比根据地分享的SS免费账号链接码
// @author       sumspec
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @include      https://doub.io/sszhfx/*
// @include      https://doub.bid/sszhfx/*
// @icon         https://doub.bid/wp-content/themes/yusi1.0/img/logo.ico
// @run-at       document-end
// @copyright    2017+,sumspec
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/33887/GetSsLink.user.js
// @updateURL https://update.greasyfork.org/scripts/33887/GetSsLink.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	//标签部分
	$('.pull-right:first').before('<button class="get_code action" data-index="ss">SS</button><button class="get_code action" data-index="ssr">SSR</button>');
	$('body').append('<div class="msg_box" style="display:none"></div>');
	$('.msg_box').append('<div class="msg_box_main"></div>');
	$('.msg_box_main').append('<textarea class="msg_box_code"></textarea>');
	$('.msg_box_main').append('<button class="btn_copy action">复制</button>');
	$('.msg_box_main').append('<button class="btn_close action">关闭</button>');
	$('.msg_box').css({'width':'100%','height':'100%','backgroundColor':'rgba(0, 0, 0, 0.5)','position':"fixed",'left':'0','top':'0','z-index':'10000'});
	$('.msg_box_main').css({'width':'800px','height':'500px','backgroundColor':'#EEEEEE','margin':'0 auto','border':'5px solid #1ABC9C'});
	$('.msg_box_code').css({'width':'760px','height':'460px','overflow':'scroll','overflowX':'hidden','resize':'none','padding':'20px','margin':'0','border':'0'});
	$('.btn_copy,.btn_close').css({'position':'relative','left':'-5px','top':'10px'});
	
	//复制和关闭
	$('.btn_copy').click(function(){
		$('.msg_box_code').select();
		document.execCommand('copy',false,null);
		alert('已复制到剪贴板！');
		$('.msg_box').css({'display':'none'});
	});
	$('.btn_close').click(function(){$('.msg_box').css({'display':'none'});});
	
	//获取链接码
	var ss_code = '', ssr_code = '';
	$('.dl1').each(function(){
		var ss_match = $(this).attr('href').match(/ss\:\/\/\S+/g);
		var ssr_match = $(this).attr('href').match(/ssr\:\/\/\S+/g);
		if (ss_match!==null) ss_code += ss_match[0].replace('!','') + '\r\n';
		if (ssr_match!==null) ssr_code += ssr_match[0].replace('!','') + '\r\n';
	});
	
	//点击判断
	$(document).on('click', '.get_code', function (e) {
		if($(e.target).attr('data-index') == 'ss'){
			$('.msg_box').css({'display':'block'});
			$('.msg_box_code').text(ss_code);
		}
		if($(e.target).attr('data-index') == 'ssr'){
			$('.msg_box').css({'display':'block'});
			$('.msg_box_code').text(ssr_code);
		}
	});}
)();
