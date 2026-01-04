// ==UserScript==
// @name         PC百度双列
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  pc端百度双列显示
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @require      https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @require      https://greasyfork.org/scripts/455643-getbaiducsslib/code/getBaiduCssLib.js
// @match        https://www.baidu.com/search*
// @match        https://www.baidu.com/s*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455644/PC%E7%99%BE%E5%BA%A6%E5%8F%8C%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/455644/PC%E7%99%BE%E5%BA%A6%E5%8F%8C%E5%88%97.meta.js
// ==/UserScript==

(function() {
	const css = getBaiduCssLib();
	GM_addStyle(css.common + css.dbpage + css.fit + css.other);

	function otherCss(dom, index = 1) {
		dom = dom instanceof jQuery ? dom : $(dom);
		dom.attr("data-res-id", index);
		if (index > 1) {
			dom.find(`.result-molecule:first`).hide();
		}
		var notice = $(
			`<div class="current-page-notice"><a data-name="leftBtn" href="javascript:void(0)" style="float:left;padding:0 12px"><< 首页</a><span data-name="currentPage">当前页：第${index}页</span><a data-name="rightBtn" href="javascript:void(0)" style="float:right;padding:0 12px">导航 >></a></div>`
		);
		notice.insertBefore(dom.find("#content_left> div:first"));
		notice.find("[data-name]").click((e) => {
			e = $(e.target);
			switch (e.data("name")) {
				case "leftBtn":
					$("html,body").animate({
						scrollTop: 0
					}, 500);
					break;
				case "rightBtn":
					$("html,body").animate({
						scrollTop: dom.offset().top + dom.height() - $(window).height() - 25
					}, 500);
					break;
				case "currentPage":
					alert(`css版本:${css.version}\n脚本版本:${GM_info.script.version}`);
					break;
				default:
					break;
			}
		})
		dom.find("#page a").each((i, e) => {
			e = $(e);
			if (/下一页/.test(e.text())) {
				e.data("targetID", index + 1)
			} else if (/上一页/.test(e.text())) {
				e.data("targetID", (index - 1) < 1 ? 1 : (index - 1))
			} else {
				e.data("targetID", e.text())
			}
			e.click((a) => {
				a.preventDefault();
				console.log(e.data("targetID"))
				navJump(e.data("targetID"));
			})
		})
		return dom;
	}

	function navJump(id) {
		id = typeof id === "number" ? id : parseInt(id);
		if (!$("#wrapper #wrapper_wrapper").is(":visible") || !id) {
			return false
		}

		function load(id, waitTime = false) {
			if ($("#wrapper #wrapper_wrapper").length >= id) {
				$(".auto-loading-notice[data-pos=center]").remove();
				var target = $(`#wrapper> [data-res-id=${id}]`).is(":visible") ? $(
					`#wrapper> [data-res-id=${id}]`) : $(`[data-res-id]:last`);
				if (waitTime) {
					setTimeout(() => {
						$("html,body").animate({
							scrollTop: target.offset().top - 85
						}, 500);
					}, 210)
				} else {
					$("html,body").animate({
						scrollTop: target.offset().top - 85
					}, 500);
				}
				return false
			}
			if ($(".auto-loading-notice[data-pos=center]").is(":visible")) {
				$(".auto-loading-notice[data-pos=center] span").text(
					`正在加载(${$("#wrapper #wrapper_wrapper").length}/${id})`)
			} else {
				$("body").append(
					`<div class="auto-loading-notice" data-pos="center"><span>正在加载(${$("#wrapper #wrapper_wrapper").length}/${id})</span></div>`
				);
			}
			autoNextPage("[data-res-id]:last", () => {
				setTimeout(() => {
					load(id, true);
				}, 0)
			})
		}
		load(id);
	}

	function autoNextPage(dom, fn1, fn2) {
		dom = dom instanceof jQuery ? dom : $(dom);
		var nextA = dom.find("#page a.n:last");
		if (/下一页/.test(nextA.text()) && /^https?:\/\//i.test(nextA[0].href)) {
			$(".auto-loading-notice[data-pos=bottom]").remove();
			dom.append(`<div class="auto-loading-notice" data-pos="bottom"><span>正在加载下一页</span></div>`);
			$.ajax({
				url: nextA[0].href,
				type: "GET",
				timeout: 10000,
				success: (r) => {
					r = $(r).find("#wrapper_wrapper");
					if (r.length === 1) {
						if (!$(`[data-res-id=${nextA.data("targetID")}]`)[0]) {
							r = otherCss(r, nextA.data("targetID"));
							$(".auto-loading-notice[data-pos=bottom]").remove();
							$("#wrapper").append(r);
						}
						typeof fn1 === "function" && fn1();
					}
				},
				error: (r) => {
					if (confirm("请求失败或超时，是否直接打开网页？")) {
						location.href = e.href;
					}
					$(".auto-loading-notice[data-pos=bottom]").remove();
					typeof fn2 === "function" && fn2();
					console.log("请求失败或超时", r)
				}
			})
		}
	}
	$("#wrapper_wrapper").ready(() => {
		var loadFlag = true;
		otherCss("#wrapper_wrapper:not([data-res-id])")
		$(document).scroll(function() {
			if (loadFlag && $(window).scrollTop() + $(window).height() > $(document).height() -
				20) {
				loadFlag = false;
				autoNextPage("[data-res-id]:last", () => {
					setTimeout(() => {
						loadFlag = true;
					}, 500)
				}, () => {
					$("html,body").animate({
						scrollTop: $(window).scrollTop() - 100
					}, 200, () => {
						loadFlag = true;
					});
				})
			}
		});
	});
})()
