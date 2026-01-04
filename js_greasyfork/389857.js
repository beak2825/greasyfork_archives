// ==UserScript==
// @name AdGuard Test
// @namespace    adguard
// @version      1.0.8
// @description AdGuard 美化百度搜索结果
// @homepageURL  https://adguard.com/
// @author       Chauncey
// @grant        unsafeWindow
// @match *://*.zhihu.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389857/AdGuard%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/389857/AdGuard%20Test.meta.js
// ==/UserScript==
navigator.__defineGetter__('userAgent', function(){return 'Mozilla/5.0 (Windows Phone 10.0; Android 9.1; Microsoft; Lumia 950 XL Dual SIM; KaiOS; Java) Gecko/68 Firefox/68 SearchCraft/2.8.2 baiduboxapp/4.3.0.10'﻿; }); 
window.onload = function () { 
	var zhihuDownload = document.getElementsByClassName('MobileAppHeader-downloadLink'); 
	for(var i = 0; i < zhihuDownload.length; i ++) { 
		zhihuDownload[i].style.display = "none"; 
	} 
	var ad = document.getElementsByTagName('img'); 
	for(var i = 0; i < ad.length; i ++) { 
		if(ad[i].alt == "广告") { 
			ad[i].style.display = "none"; 
		} 
	} 
}
