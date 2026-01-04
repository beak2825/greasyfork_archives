// ==UserScript==
// @name				Automatically hide ddrk.me web ads
// @name:zh-CN			自动隐藏低端影视网页广告
// @namespace			http://tampermonkey.net
// @version				0.3.1
// @author				传奇Legend
// @description			Make 低端影视 ads invisible by hiding or removing them.
// @description:zh-CN	通过隐藏或移除的方式使低端影视的广告不可见
// @include				/^(?:https?:\/\/)?(?:www\.)?dd(?:rk\.me|(?:ys|rk)\.tv)(?:\/[^\/\s]+)*\/?$/
// @grant				none
// @downloadURL https://update.greasyfork.org/scripts/423053/Automatically%20hide%20ddrkme%20web%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/423053/Automatically%20hide%20ddrkme%20web%20ads.meta.js
// ==/UserScript==

// 低端影视 要用 jQuery 必须的格式
(function ($) {	// 开始行
	"use strict";

	//*代码写在这...*/

	if($(".post-content > .post-title")[0]) {
		//alert("这是播放页");
		var ad = $(".entry > div:first").filter("[id]")?.css({"width" : "0", "height" : "0"}); // 隐藏顶部的广告
	}

	else {
		//alert("这是非播放页");
		ad = $("main > div:first").filter("[id]")?.remove();	// 移除顶部的广告
	}

	// 通用
	ad.next("br")?.remove();	// 移除下面那个多余的 <br>
	$("a.afc_close_content:last")?.click();

})(jQuery);  //结束行