// ==UserScript==
// @name        Tieba Private
// @namespace   http://tieba.baidu.com
// @include     http://tieba.baidu.com/home/*
// @description  自动清除贴吧个人主页【最近来访】记录
// @version     1
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481/Tieba%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/481/Tieba%20Private.meta.js
// ==/UserScript==
;(function($){
	var un = $(".userinfo_username").text();
	$.ajax({
		type: "post",
		url: "/home/post/delvisite",
		data: {
			ie: "utf-8",
			un: un,
			tbs: unsafeWindow.PageData.tbs
		},
		dataType: "json"
	}).success(function(t) {
		0 === t.no && $(".visitor_card:first").animate({
			width: 0
		}, 200, function() {
			$(".visitor_card:first").remove(),(function(){
				var t = $("#visitor_card_wrap").find(".visitor_card").length;
				0 === t && $("#visitor_card_wrap").closest(".ihome_visitor").slideUp(200)  
			})();
		})
	})
})(unsafeWindow.$);