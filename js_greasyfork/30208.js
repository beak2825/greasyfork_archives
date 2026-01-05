// ==UserScript==
// @author 			hunlongyu
// @version 			1.0.0
// @lilcense 			WTFPL
// @grant 				none
// @encoding 			utf-8
// @namespace 			https://github.com/Hunlongyu
// @icon		 	    http://7xo0rb.com1.z0.glb.clouddn.com/public/16-12-5/39527384.jpg
// @require 	 		http://cdn.bootcss.com/jquery/2.2.4/jquery.js

// @name 			    58无关内容过滤1
// @name:zh 			58无关内容过滤1
// @name:zh-CN 			58无关内容过滤1

// @description 		58无关内容过滤 广告过滤1
// @description:zh 		58无关内容过滤广告过滤1
// @description:zh-CN 	58无关内容过滤广告过滤1
// @homepageURL 		https://github.com/Hunlongyu
// @match 				http*://*.58.com/*
// @run-at 				document-end
// @date 				1/6/2017
// @downloadURL https://update.greasyfork.org/scripts/30208/58%E6%97%A0%E5%85%B3%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A41.user.js
// @updateURL https://update.greasyfork.org/scripts/30208/58%E6%97%A0%E5%85%B3%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A41.meta.js
// ==/UserScript==


$(function () {
	$('.a_f').hide();				// 页面底部的广告和免责声明
	$('#toptb').hide();				// 页面顶部的横条
	$('.a_pr').hide();				// 页面内右侧的广告
	$('.a_pt').hide();				// 帖子内的广告包括分享功能
	$('.plm').hide();				// 隐藏个性签名
	$('.ratl').hide();				// 隐藏评分
	$('.frt').hide();				// 隐藏每个版块的通知
									// 如果不想隐藏哪个部分，直接删除哪一行就行了。
});