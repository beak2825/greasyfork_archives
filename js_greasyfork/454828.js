// ==UserScript==
// @name         头条搜索增强
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  单/双列自适应、去重定向、美化样式、PC端自动翻页、移动端悬浮底栏
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @require      https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @match        https://so.toutiao.com/search*
// @icon         http://toutiao.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT License
// @data         css v22.11.16.0
// @downloadURL https://update.greasyfork.org/scripts/454828/%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/454828/%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const css =
		`[data-css-device=pc] .main{width:100% !important}[data-css-device=pc] .s-result-list{display:grid;grid-template-columns:50% 50%;grid-gap:8px;margin:0 160px !important;max-width:100% !important;width:calc(100% - 320px) !important}[data-css-device=pc] .s-result-list .result-content:first-child,[data-css-device=pc] .s-result-list .whole-row-item{grid-column-start:1;grid-column-end:3}@media (max-width:1000px){[data-css-device=pc] .s-result-list{grid-template-columns:100%;width:calc(100% - 20px) !important;margin:0 10px !important}[data-css-device=pc] .s-result-list .result-content:first-child,[data-css-device=pc] .s-result-list .whole-row-item{grid-column-start:1;grid-column-end:2}}@media (max-width:900px){[data-css-device=pc] .logoWrap_D3HTJ a:not([class]){display:none;}[data-css-device=pc] .logoWrap_D3HTJ_ .logo_3DlEdN svg{display:none;}[data-css-device=pc] .logoWrap_D3HTJ_ .logo_3DlEdN{width:40px;height:40px;background:url(http://toutiao.com/favicon.ico) no-repeat;background-size:contain;padding:0;}}@media (max-width:800px){[data-css-device=pc] .logoWrap_D3HTJ_ .logo_3DlEdN{display:none;}}[data-css-device=pc] .s-result-list .result-content[data-i],[data-css-device=pc] .s-result-list .radius-solid-border{border:1px solid var(--black-6);border-radius:5px;padding:12px}[data-css-device=pc] .main .s-side-list{display:none !important}[data-css-device=pc] .result-content .logoWrap_D3HTJ,[data-css-device=pc] .result-content .wrap_2lSYxG{min-width:100% !important;}[data-css-device=pc] .result-content .nav_2v7eXx{padding:16px 10px 12px !important;justify-content:center !important}[data-css-device=pc] .result-content .searchWrap_14Gtni{position:absolute;left:50%;transform:translateX(-50%);max-width:588px;width:calc(100% - 20px);}[data-css-device=pc] .margin-top-24-important{margin-top:24px !important;}[data-css-device=pc] .auto-loading-notice[data-pos=bottom] span{background-image:-webkit-linear-gradient(right,#0000007f,#0000005f 25%,#0000007f 50%,#0000005f 75%,#0000007f 100%);-webkit-text-fill-color:transparent;-webkit-background-clip:text;-webkit-background-size:200% 100%;-webkit-animation:streamer-text-animation 1s linear infinite;}@keyframes streamer-text-animation{0%{background-position:0 0;}100%{background-position:-100% 0;}}[data-css-device=pc] .auto-loading-notice[data-pos=center]{width:200px;height:50px;position:fixed;left:50%;top:50%;transform:translateX(-50%);color:white;line-height:50px;backdrop-filter:blur(4px);background-color:rgba(34,34,34,.3);border-radius:15px}[data-css-device=mobile] #head-bar nav{text-align:center;}[data-css-device=mobile] #results{display:grid;grid-template-columns:repeat(2,calc(50% - 5px));grid-gap:10px;padding:10px 10px 20px;}[data-css-device=mobile][data-css-page=xiaoshipin] #results,[data-css-device=mobile][data-css-page=atlas] #results{display:block !important;}@media (max-width:800px){[data-css-device=mobile] #results{grid-template-columns:100%;}}[data-css-device=mobile] #results .result-content .l-card-bg{background-color:transparent !important;}[data-css-device=mobile] #results .result-content{background-color:var(--bg-card);border-radius:15px;height:100%;}[data-css-device=mobile] .ghost-search-bar{position:fixed;bottom:0;left:50%;width:100% !important;transform:translateX(-50%);z-index:99999;border-radius:15px;}[data-css-device=mobile] .ghost-search-bar input{text-align:center !important;margin-left:-30px;}[data-css-device=mobile] #page-bottom .logo_3Mdxl3{display:none;}[data-css-device=mobile] #page-bottom .from_1OKQFa{display:none;}[data-css-device=mobile] #page-bottom .formWrap{display:none;}`;

	const device = location.search.search("dvpf=pc") >= 0 ? "pc" : "mobile";
	const enableMap = {
		map: {
			pc: ["synthesis", "information", "user", "question", "weitoutiao", "baike", "music"],
			mobile: ["*"]
		},
		check: function(d, p) {
			var m = this.map,
			ck=m.hasOwnProperty(d) && (m[d].indexOf("*") > -1 || m[d].indexOf(p) > -1);
			$("html").attr("data-css-device", ck?d:"");
			$("html").attr("data-css-page", ck?p:"");
			return ck
		}
	}
	var page = new URL(location.href).searchParams.get("pd") || "synthesis";
	GM_addStyle(css);
	if (!enableMap.check(device, page)) {
		return
	}
	if (device === "pc") {
		function otherCss(dom, index = 1) {
			dom = dom instanceof jQuery ? dom : $(dom);
			dom.attr("data-res-id", index);
			$(`<div class="result-content whole-row-item radius-solid-border text-center current-page-notice"><a href="javascript:void(0)" style="float:left;padding:0 12px"><< 首页</a><span>当前页：第${index}页</span><a href="javascript:void(0)" style="float:right;padding:0 12px">导航 >></a></div>`)
				.insertBefore(dom.children(".result-content[data-i=0]:first"));
			dom.find(".result-content.current-page-notice a").click((e) => {
				e = $(e.target).text();
				if (/首页/.test(e)) {
					$("html,body").animate({
						scrollTop: 0
					}, 500);
				} else if (/导航/.test(e)) {
					$("html,body").animate({
						scrollTop: dom.offset().top + dom.height() - $(window).height()
					}, 500);
				}
			})
			dom.children(".result-content:not([data-i])").each((i, e) => {
				e = $(e);
				if (e.children("[shared]")[0]) {
					e.addClass("whole-row-item text-center margin-top-24-important");
					if (/下一页|上一页/.test(e.text())) {
						e.attr("data-nav-id", index);
						e.find("a[data-search]").each((i, a) => {
							a = $(a);
							if (a.text() === "下一页") {
								a.data("targetID", index + 1)
							} else if (a.text() === "上一页") {
								a.data("targetID", (index - 1) < 1 ? 1 : (index - 1))
							} else {
								a.data("targetID", a.text())
							}
							a.click((e) => {
								e.preventDefault()
								navJump(a.data("targetID"));
							})
						})
					} else {
						e.hide();
					}
				}
			})
			dom.children(".result-content[data-i]:last").addClass("whole-row-item").hide();
			console.group();
			dom.find(".result-content[data-i] a").each((i, e) => {
				if (e.href.indexOf("/search/jump?url=") !== -1) {
					var url = new URL(e.href).searchParams.get("url");
					console.log("重定向: " + e.href + " --> " + url)
					e.href = url;
				}
			})
			console.groupEnd();
		}

		function navJump(id) {
			id = typeof id === "number" ? id : parseInt(id);
			if (!$(".s-result-list").is(":visible") || !id) {
				return false
			}

			function load(id, waitTime = false) {
				if ($(".s-result-list").length >= id) {
					$(".auto-loading-notice[data-pos=center]").remove();
					var target = $(`.s-result-list[data-res-id=${id}]`).is(":visible") ? $(
						`.s-result-list[data-res-id=${id}]`) : $(`.s-result-list:last`);
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
						`正在加载(${$(".s-result-list").length}/${id})`)
				} else {
					$("body").append(
						`<div class="auto-loading-notice text-center" data-pos="center"><span>正在加载(${$(".s-result-list").length}/${id})</span></div>`
					);
				}
				autoNextPage(".s-result-list:last", () => {
					setTimeout(() => {
						load(id, true);
					}, 0)
				})
			}
			load(id);
		}

		function autoNextPage(dom, fn1, fn2) {
			dom = dom instanceof jQuery ? dom : $(dom);
			dom.find(".result-content:not([data-i]).whole-row-item a").each((i, e) => {
				if (e.innerText === "下一页" && /^https?:\/\//i.test(e.href)) {
					$(".auto-loading-notice[data-pos=bottom]").remove();
					dom.append(
						`<div class="auto-loading-notice result-content whole-row-item text-center" data-pos="bottom"><span>正在加载下一页</span></div>`
					);
					$.ajax({
						url: e.href,
						type: "GET",
						timeout: 10000,
						success: (r) => {
							r = $(r).find(".s-result-list");
							if (r.length === 1) {
								if (!$(`.s-result-list[data-res-id=${$(e).data("targetID")}]`)[
										0]) {
									otherCss(r, $(e).data("targetID"));
									r.css("padding-top", "0");
									r.find(".result-content:first-child").hide();
									$(".auto-loading-notice[data-pos=bottom]").remove();
									$(".main").append(r);
									dom.animate({
										paddingBottom: 0
									}, 200);
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
			})
		}
		$(".s-result-list").ready(() => {
			otherCss(".s-result-list");
			var loadFlag = true;
			$(document).scroll(function() {
				if (loadFlag && $(window).scrollTop() + $(window).height() > $(document).height() -
					50) {
					loadFlag = false;
					autoNextPage(".s-result-list:last", () => {
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
	} else {
		$("#head-bar form").ready(() => {
			var ghostBar = $("#head-bar form").clone();
			ghostBar.find("i").attr("class","search-icon_TKyEHg");
			ghostBar.find("a").hide();
			ghostBar.find("input").attr("readonly", "readonly");
			ghostBar.addClass("ghost-search-bar");
			ghostBar.click(() => {
				$("#head-bar input").click();
			})
			ghostBar.hide();
			ghostBar.extend({
				"display": function(type, animateSpan) {
					var that = this;
					if (!type || !animateSpan || type === that.data("animate")) {
						return false
					}
					if (type === "show" && !that.is(":visible")) {
						that.data("animate", type);
						that.css("opacity", "0");
						that.css("bottom", "-65px");
						that.show();
						that.animate({
							opacity: 1,
							bottom: "0"
						}, animateSpan, "swing", () => {
							that.css("opacity", "");
							that.data("animate", "");
						});
					} else if (type === "hide" && that.is(":visible")) {
						that.data("animate", type);
						that.css("opacity", "1");
						that.animate({
							opacity: 0
						}, animateSpan, "linear", () => {
							that.hide();
							that.css("opacity", "");
							that.data("animate", "");
						});
					}
				}
			})
			$("#page-main").append(ghostBar);

			function changeGhostDisplay() {
				var scroll = $(window).scrollTop(),
					scrollMin = $("#page-head").height(),
					scrollMax = $("#bottom-bar").offset().top - $(window).height();
				if (scroll >= scrollMin && scroll <= scrollMax) {
					ghostBar.display("show", 300);
				} else {
					ghostBar.display("hide", 200);
				}
			}
			changeGhostDisplay();
			$(document).scroll(function() {
				changeGhostDisplay()
			});
			$("#results .result-content a").each((i, e) => {
				var url = new URL(e.href);
				if (url.pathname === "/search/jump" && url.search.indexOf("url=") !== -1) {
					url = url.searchParams.get("url");
					console.log("重定向: " + e.href + " --> " + url)
					e.href = url;
				}
			})
		})
	}
})();
