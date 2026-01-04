// ==UserScript==
// @namespace          Eternal
// @name                   Fuck CSDN
// @version                2.9
// @description          去除CSDN BBS&BLOG&DOWNLOAD&WWW ADP检测/广告/展开全文限制/复制小尾巴/离线网页限制/其它
// @author                 流星暴雨
// @grant                   none
// @match                  *://blog.csdn.net/*
// @match                  *://bbs.csdn.net/*
// @match                  *://download.csdn.net/*
// @match                  *://www.csdn.net/*
// @run-at                  document-body
// @homepageURL    https://greasyfork.org/scripts/374950
// @supportURL         https://greasyfork.org/scripts/374950
// @downloadURL https://update.greasyfork.org/scripts/374950/Fuck%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/374950/Fuck%20CSDN.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var extension = true; //如为真则开启拓展功能 去除 联系方式/赚零钱/传资源/文章推荐/热词推荐/博主推荐

	var addTimer = function (isTrue, code, time, multiple) {
		var i = time == -1 ? 0 : (time ? time : 10000) / 10;
		var mySetInterval = window.setInterval_ ? setInterval_ : setInterval;
		var timer = mySetInterval(function () {
				time!=-1 && i--;
				if (i < 0 || (typeof isTrue == "string" ? eval(isTrue) : isTrue())) {
					if (!multiple) {
						clearInterval(timer);
					}
					i >= 0 && (typeof code == "string" ? eval(code) : code());
				}
			}, 10);
	}

	var addRMTimer = function (ele, time, code, multiple) {
		addTimer(`$("${ele}").size() > 0`, function () {
			code && eval(code);
			$(ele).remove();
			/*setTimeout(function () {
			code && eval(code);
			$(ele).remove();
			}, 50)*/
		}, time, multiple)
	}

	var hook = function () {
		window.setInterval_ = setInterval;
		var mysetInterval = function (fun, time) {
			if ((fun + '').match("check-adblock-time")) {
				return null;
			} else {
				return setInterval_(fun, time);
			}
		}
		setInterval = mysetInterval;
		document.body.insertBefore_ = document.body.insertBefore;
		var myinsertBefore = function (ele, box) {
			if (ele.innerHTML.match("ADP") || ele.innerHTML.match("广告")) {
				return document.body;
			} else {
				return document.body.insertBefore_(ele, box);
			}
		};
		document.body.insertBefore = myinsertBefore;
	}

	if (location.host.match("blog")) {
		$(function () {
			$(".article_content").css("height", '');
			//$(".hide-article-box").remove();
			$(".hide-article-box").removeClass("hide-article-pos");
			$("#btn-readmore").remove();
			$(".fourth_column").remove();
			$(".pulllog-box").remove();
			$(".box-shadow").remove();
			$(".aside-box > div[data-track-click]").parent().remove();
			$(".BAIDU_DUP_fp_wrapper").remove();
			$(".adsbygoogle").parent().remove();
			$("#commentBox").prev().remove();
			$(".recommend-ad-box").remove();
			$("#adContent").remove();
			$("div[id*='kp_box']").remove();
			$(".blog_star_enter").remove();
			$("#totast-js:contains('APP')").parent().remove();
			$(".opt-box").remove();
			$(".btn-readmore").remove();
			addTimer("$('.comment-list-box').css('max-height')", function () {
				$(".comment-list-box").css("max-height", '');
			}, -1, true);

			csdn.copyright && (csdn.copyright.init = function () {});

			$("img[onerror]").remove();

			addTimer("true", function () {
				$("#content_views > pre").attr('style', 'user-select:auto !important;');
				$("code").attr('style', 'user-select:auto !important;');

				$(".hljs-button").remove();
			}, -1, true);

			if (extension) {
				$(".gitChat:contains('赚零钱')").remove();
				$(".footer_box").remove();
				$(".article-copyright").remove();
				$(".blog-expert-recommend-box").remove();
				$(".recommend-item-box[data-track-click*='click.hm.baidu.com']").remove();
				$(".type_hot_word").remove();
			}
		});
		addRMTimer(".right-item[class*='ads']");
		addRMTimer("#asideFooter > .aside-box:has('iframe')");
		addRMTimer("div[class*='box-box']:has('iframe'):contains('关闭')");
		addRMTimer("div[id*='kp_box']", undefined, undefined, true);
		addRMTimer("#BAIDU_DUP_fp_wrapper");
		addRMTimer("iframe[src*='pos.baidu.com']", undefined, undefined, true);
		addRMTimer("#passportbox");
		addRMTimer(".login-mark");

		hook();
	} else if (location.host.match("bbs")) {
		/*window.onerror = function (message, source, lineno, colno, error) {
		if (source.indexOf("mvf_news_feed") != -1){
		return true;
		}
		console.log(message,source,lineno,colno,error);
		return false;
		}*/
		$(function () {
			$(".post_body > div[scrolling=no]").remove();
			$(".bbs_feed_ad_box").remove();
			$(".post_body > div").remove();
			$(".pulllog-box").remove();
			$("div[id*='kp_box']").remove();

			if (extension) {
				$(".gitChat:contains('赚零钱')").remove();
				$("#thirdList").css("margin-bottom", "0px");
				$(".footer_box").remove();
				$(".control").css("cssText", "bottom:0!important;");
				$(".post_recommend").remove();
			}

			addRMTimer("#adContent");
			addRMTimer(".ad_item");
			addRMTimer(".hide_topic_box", undefined, "$('#bbs_detail_wrap').css('max-height', '')");
			addRMTimer("#totast-js:contains('APP')");
		});
	} else if (location.host.match("download")) {
		addTimer("$", function () {
			$(".check-adblock-bg").parent().remove();
			$(function () {
				$(".dl_mar").remove();
				$(".right_bottom").remove();
				$(".hot_arti_list > div").remove();
				$("#album_detail_wrap > div:not(.dl_more)").remove();
				$(".dl_edu").remove();
				$(".right_bottom_ads").remove();
				$("div[id*='kp_box']").remove();
				$(".carousel_box").remove();

				addRMTimer("#adContent");

				if (extension) {
					$(".gitChat:contains('赚零钱')").remove();
					$(".nav_upload").remove();
					//$(".fixed_dl").find(".footer_box").remove();
					$(".footer_box").remove();
				}
			});
		});

		hook();

		addTimer("document.body.insertBefore_ == undefined", function () {
			document.body.insertBefore_ = document.body.insertBefore;
			var myinsertBefore = function (ele, box) {
				if (ele.innerHTML.match("ADP") || ele.innerHTML.match("广告")) {
					return document.body;
				} else {
					return document.body.insertBefore_(ele, box);
				}
			};
			document.body.insertBefore = myinsertBefore;
		});
	} else if (location.host.match("www")) {
		$(function () {
			$(".banner-ad-box").remove();
			$(".slide-outer").remove();
			$(".indexSuperise").remove();
			$("div[id*='kp_box']").remove();

			addRMTimer("#adContent");

			if (extension) {
				$(".gitChat:contains('赚零钱')").remove();
				$(".footer_box").remove();
			}
		});
	}

	console.log("Fuck CSDN!")
})();