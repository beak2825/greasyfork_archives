// ==UserScript==
// @name         直播间个人中心重定向
// @namespace    mscststs
// @version      0.1
// @description  直播间个人中心重定向，重定向到老版
// @author       mscststs
// @match        *://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36773/%E7%9B%B4%E6%92%AD%E9%97%B4%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/36773/%E7%9B%B4%E6%92%AD%E9%97%B4%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
	$("body").on("click",".user-panel-ctnr.p-relative.dp-i-block > a",function(){
		$(this).attr("href","//api.live.bilibili.com/i");
	});
    // Your code here...
})();