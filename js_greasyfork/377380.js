// ==UserScript==
// @name         dc preview
// @namespace    http://gall.dcinside.com
// @version      0.5
// @description  갤미리보기
// @author       시청자수계산기
// @match        https://gall.dcinside.com/board/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377380/dc%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/377380/dc%20preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$(function() {
		var loadInterval = null;
		var popupInterval = null;
		if($(".gall_list").length > 0) {
			var now = new Date();
			var date = now.getFullYear().toString() + (now.getMonth() + 1).toString() + now.getDate().toString();
			var broadId = location.href.split("id=")[1].split("&")[0];
			$("head").append('<style>#popup_preview{position:absolute;z-index:10000}#popup_preview .content{position:absolute;left:0;bottom:0;padding:15px;width:400px;max-height:300px;min-height:100px;line-height:20px;font-size:12px;color:#333;border:1px solid #ddd;border-radius:5px;box-shadow:1px 1px 5px rgba(0,0,0,0.3);background:#fff;overflow:auto}#popup_preview img{max-width:100%}#popup_preview iframe,#popup_preview embed{width:100%;height:auto;min-height:240px}</style>');

			$.each(localStorage, function(key, value) {
				if(key.indexOf(broadId) == -1 || key.indexOf(date) == -1) {
					localStorage.removeItem(key);
				}
			});
			$("body").append('<div id="popup_preview"><div class="content"></div></div>');
			$("#popup_preview").hover(
				function() {
					clearTimeout(popupInterval);
				},
				function() {
					clearTimeout(popupInterval);
					popupInterval = setTimeout(function() {
						$("#popup_preview").stop(true,true).fadeOut(200, function() {
							$("#popup_preview .content").empty();
						});
					}, 200);
				}
			).on("click", function(eve) {
				//if($(eve.target).hasClass("content")) {
				$("#popup_preview").stop(true,true).fadeOut(200, function() {
					$("#popup_preview .content").empty();
				});
			});

			$(".gall_list .gall_tit > a:not(.reply_numbox)").hover(
				function(eve) {
					var target = $(this);
					var event = eve;
					var link = $(this).attr("href");
					var id = link.split("id=")[1].split("&")[0];
					var no = link.split("no=")[1].split("&")[0];
					var contentId = id + "_" + no + "_" + date;
					clearTimeout(loadInterval);
					loadInterval = setTimeout(function() {
						var loadContent = localStorage.getItem(contentId);
						if(loadContent != undefined && loadContent != null && loadContent !== "") {
							popupShow(target, event, loadContent);
						}
						else {
							GM_xmlhttpRequest({
								method: "GET",
								url: link,
								overrideMimeType:"text/html; charset=utf-8",
								headers:{
									"Content-Type": "text/html; charset=utf-8",
									"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
									"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
								},
								onload: function(response) {
									if(response && response.responseText != undefined) {
										if(response.responseText.indexOf("derror/deleted") > -1) {
											var content = "※삭제된 글입니다.";
											localStorage.setItem(contentId, content);
											popupShow(target, event, content);
										}
										else {
											var viewContent = $(response.responseText).find(".view_content_wrap .writing_view_box");
											if(viewContent.length > 0) {
												viewContent.find("script,style").remove();
												var content = viewContent.html();
												localStorage.setItem(contentId, content);
												popupShow(target, event, content);
											}
										}
									}
								}
							});
						}
					}, 200);

				},
				function() {
					clearTimeout(loadInterval);
				}
			);

			$(".gall_list tr.ub-content").hover(
				function() {
					//clearTimeout(popupInterval);
				},
				function() {
					clearTimeout(loadInterval);
					clearTimeout(popupInterval);
					popupInterval = setTimeout(function() {
						$("#popup_preview").stop(true,true).fadeOut(200, function() {
							$("#popup_preview .content").empty();
						});
					}, 200);
				}
			);
		}

		function popupShow(target, eve, content) {			
			var scrollX = $(window).scrollLeft();
			var scrollY = $(window).scrollTop();
			$("#popup_preview").stop(true,true).hide().css({ left:eve.pageX + 30, top:(eve.clientY - 20) + scrollY}).find(".content").html(content).outerHeight();
			$("#popup_preview").fadeIn(200, function() {
				var popupHeight = $(this).find(".content").scrollTop(0).outerHeight();
				var popupTop = (eve.clientY - 20) - popupHeight;
				if(popupTop < -10) {
					$(this).css("top","+=" + (Math.abs(popupTop) + 10));
				}
			});
		}
	});
})();