// ==UserScript==
// @author 				hunlongyu 
// @version 			0.1.1
// @lilcense 			WTFPL
// @grant 				none
// @encoding 			utf-8
// @namespace 			https://github.com/Hunlongyu
// @icon		 		http://7xo0rb.com1.z0.glb.clouddn.com/public/16-12-5/39527384.jpg
// @require 	 		http://cdn.bootcss.com/jquery/2.2.4/jquery.js

// @name 			吾爱破解广告过滤zz
// @name:zh 			吾爱破解广告过滤
// @name:zh-CN 			吾爱破解广告过滤

// @description 		吾爱破解网站广告过滤
// @description:zh 		吾爱破解网站广告过滤
// @description:zh-CN 	吾爱破解网站广告过滤

// @homepageURL 		https://github.com/Hunlongyu
// @match 				http*://*.52pojie.cn/*
// @run-at 				document-end
// @date 				7/12/2016
// @downloadURL https://update.greasyfork.org/scripts/39179/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39179/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4zz.meta.js
// ==/UserScript==


$(function () {
	$('#toptb').hide();								// 隐藏顶部工具
	$('.bml').hide();								// 隐藏每个版块的通知
    $('.dnch_eo_pt').hide();						// 帖内的水平广告
    $('.dnch_eo_pr').hide();						// 帖内的垂直广告
    $('.bdsharebuttonbox').hide();					// 楼主的分享按钮
    $('.sign').hide();								// 签名隐藏
    $('.dnch_eo_pb').hide();						// 签名下面的提示
    $('.dnch_eo_f').hide();							// 页面底部的广告和免责声明
    $('#fastpostmessage').focus(function(){			// 修复回帖背景不隐藏的 bug
    	$(this).removeAttr('style');
    });
									                // 如果不想隐藏哪个部分，直接删除哪一行就行了。
});