// ==UserScript==
// @author 			hunlongyu
// @version 			1.0.0
// @lilcense 			WTFPL
// @grant 			none
// @encoding 			utf-8
// @namespace 			https://github.com/Hunlongyu
// @icon		 	http://7xo0rb.com1.z0.glb.clouddn.com/public/16-12-5/39527384.jpg
// @require 	 		http://cdn.bootcss.com/jquery/2.2.4/jquery.js

// @name 			吾爱破解广告过滤test
// @name:zh 			吾爱破解广告过滤test
// @name:zh-CN 			吾爱破解广告过滤test

// @description 		吾爱破解网站广告过滤
// @description:zh 		吾爱破解网站广告过滤
// @description:zh-CN 	        吾爱破解网站广告过滤

// @homepageURL 		https://github.com/Hunlongyu
// @match 				http*://*.52pojie.cn/*
// @run-at 				document-end
// @date 				1/6/2017
// @downloadURL https://update.greasyfork.org/scripts/30203/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4test.user.js
// @updateURL https://update.greasyfork.org/scripts/30203/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4test.meta.js
// ==/UserScript==


$(function () {
	$('.a_f').hide();				// 页面底部的广告和免责声明
	$('#toptb').hide();				// 页面顶部的横条
	$('.a_pr').hide();				// 页面内右侧的广告
	$('.a_pt').hide();				// 帖子内的广告包括分享功能
	$('.plm').hide();				// 隐藏个性签名
	$('.ratl').hide();				// 隐藏评分
	$('.bml').hide();				// 隐藏每个版块的通知
							// 如果不想隐藏哪个部分，直接删除哪一行就行了。
});