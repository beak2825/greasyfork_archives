// ==UserScript==
// @name         		抽屉评论本页打开
// @version      		1.0.6
// @icon            	https://dig.chouti.com/images/favicon-d38b877458.png
// @description  	    抽屉打开评论区直接本页显示
// @author       		mjc
// @create          	2019-07-01
// @match        		https://dig.chouti.com/*
// @exclude         	https://dig.chouti.com/zone/video
// @exclude         	https://dig.chouti.com/publish/links/cdu_*
// @exclude         	https://dig.chouti.com/voted/links/cdu_*
// @namespace			https://greasyfork.org/users/212546
// @grant 				GM_addStyle
// @run-at 				document-end
// @downloadURL https://update.greasyfork.org/scripts/387038/%E6%8A%BD%E5%B1%89%E8%AF%84%E8%AE%BA%E6%9C%AC%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387038/%E6%8A%BD%E5%B1%89%E8%AF%84%E8%AE%BA%E6%9C%AC%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function ($) {
	'use strict';
	if (!window.location.href.endsWith("#comment-area")) { //首页
		$(function () {
			//监听 评论点击事件
			$(".outer-container").on("click", "a.operate-item.comment", function (e) {
				var self = this;
				if ($(self).parents(".link-item").find("#comment-iframe").length > 0) {
					removeComment();
					return false;
				}
				if ($("#comment-iframe").length > 0) removeComment();

				var comment_loading='<div id="comment-loading" class="comment-list-loading-con" style="text-align: center;"><span class="link-loading-icon small comment-loading-icon"><span class="rect rect1"></span><span class="rect rect2"></span><span class="rect rect3"></span></span></div>';
				$(self).parents(".link-item").append(comment_loading);

				var comment_iframe = $('<iframe scrolling="no" id="comment-iframe" frameborder="0" border="0"></iframe>')
					.css({ width: "840px", padding: "8px", height: "300px", "margin-top": "-15px;"})
					.load(function () {
						$("#comment-loading").remove();
					}).attr("src", self.href + "#comment-area");
				$(self).parents(".link-item").append(comment_iframe);

				return false;
			});

			$('.msg-alert,.loading-more-btn').on('click', function (e) {
				removeComment();
			});

			$('body').on('click', function (e) {
				if ($('#comment-iframe').length <= 0) return;
				if ($(e.target).is("a,button,img,.mask")) return;
				if ($(e.target).css("cursor") === "pointer") return;
				if ($("#mask").length > 0 && $("#mask").is(":visible")) return;
				removeComment();
			});

			function removeComment(){
				if ($('#comment-iframe').length <= 0) return;
				var rect = $('#comment-iframe')[0].getBoundingClientRect();
				if(rect.top >= 0){
					$("#comment-iframe,#comment-loading").remove();
				} else if(rect.bottom - $(window).height() > 0){
					var view = $('#comment-iframe').parent();
					$("#comment-iframe,#comment-loading").remove();
					view[0].scrollIntoView();
				} else {//删除 元素 保持现有可见元素不动
					var h = $(document).scrollTop() + 15 - (rect.height + 8 + 8) - ($("#comment-loading").height()||0) - 1;
					$("#comment-iframe,#comment-loading").remove();
					$(document).scrollTop(h);
				}
			}

            $(".main").on("click", "span.author-avatar-name", function (event) {
                event.stopPropagation();
                window.open($(this).attr("data-jump"));
                return false;
            });
            $(".main").on("click", "span.author-info-detail", function (event) {
                event.stopPropagation();
                window.open($(this).children(".nick").attr("data-jump"));
                return false;
            });
		});
	} else { //iframe 中打开的评论页面
		//隐藏 不必要内容
		var comment_page_style = [
			".header-fix{display: none !important;}",
			".footer{display: none !important;}",
			".link-area{display: none !important;}",
			".extra{display: none !important;}",
			".original-link-top-area{display: none !important;}",
			".original-link-area{display: none !important;}",
			".original-link-operate-con{display: none !important;}",
			".main-container {margin-top: 0px!important;}"
		].join("\n");
		setStyle(comment_page_style);

		$(function () {
			//评论 加载完成 设置 iframe高度
			$(document).ajaxSuccess(function (evt, request, settings) {
				if (settings.url.includes("/comments/show?id=")) {
					setTimeout(() => $("#comment-iframe", window.parent.document).height($(".comment-area").innerHeight()+30), 10);
				}
			});

            $(".main").on("click", "div.comment-avatar-con", function (event) {
                event.stopPropagation();
                window.open($(this).attr("data-jump"));
                return false;
            });
            $(".main").on("click", "span.author-info-detail", function (event) {
                event.stopPropagation();
                window.open($(this).children(".nick").attr("data-jump"));
                return false;
            });
		});
	}

	function setStyle(css) {
		if (typeof GM_addStyle != "undefined") {
			GM_addStyle(css);
		} else if (typeof PRO_addStyle != "undefined") {
			PRO_addStyle(css);
		} else if (typeof addStyle != "undefined") {
			addStyle(css);
		} else {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			var heads = document.getElementsByTagName("head");
			if (heads.length > 0) {
				heads[0].appendChild(node);
			} else {
				document.documentElement.appendChild(node);
			}
		}
	}
})(jQuery);