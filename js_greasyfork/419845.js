// ==UserScript==
// @name         微博无内鬼图片处理+拉黑内鬼
// @namespace    http://pronax.tech/
// @version      2021-8-17 18:53:55
// @description  仅限孙狗无内鬼环节
// @author       You
// @match        https://weibo.com/3176010690/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419845/%E5%BE%AE%E5%8D%9A%E6%97%A0%E5%86%85%E9%AC%BC%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%2B%E6%8B%89%E9%BB%91%E5%86%85%E9%AC%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/419845/%E5%BE%AE%E5%8D%9A%E6%97%A0%E5%86%85%E9%AC%BC%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%2B%E6%8B%89%E9%BB%91%E5%86%85%E9%AC%BC.meta.js
// ==/UserScript==

// 原图地址
// https://photo.weibo.com/h5/comment/compic_id/1022:23059769b0a8a31be1a68c699e900b62aacb01
// 原图实际图片
// https://wx4.sinaimg.cn/bmiddle/005wFKbUgy1gtgfx1va9zg607k0dcqvd02.gif
// 小图
// https://wx4.sinaimg.cn/mw1024/005wFKbUgy1gtgfx1va9zg607k0dcqvd02

(function () {
	'use strict';

	GM_addStyle(".WB_frame{width:1200px !important}.WB_frame_c{width:1200px}");
	GM_addStyle(".iconoGraph{max-width:150px;max-height:300px}.wng_img{max-width:300px;max-height:500px}");
	GM_addStyle(".W_loading{margin:5px}");

	var real_ng_list = ["2671562317", "5464819009", "6857211922", "5334141065", "1945987267", "7563836395", "2680672033", "5304894067", "7415309425", "6345843055", "7226822845", "5831076343", "5928929014", "7570487236", "5234287588", "5763947689", "6259812513", "6367090201", "7330956181", "3606572233", "7315063626", "7307948916", "6545355034", "2619054701", "2179108717", "5837773588", "5936018672", "5840135182", "5028156161", "6480626845", "2487754642", "6017668207", "5750663305", "5241389666", "5686627491", "7482359873", "5764580212", "5190907726", "7510503735", "6008273099", "2839650043", "5615937987", "5934070814", "6592810151", "5634370977", "6041633157"];
	var debug = false;

	$("a.S_txt1.home").attr("href", "#").click(function () {
		debug = !debug;
		$(this).css("background", debug ? "#18ef3799" : "");
	});

	function getPhoto(targ, photoId) {
		if (photoId) {
			$(targ).before(`<a href="https://wx4.sinaimg.cn/mw1024/${photoId}" target="_blank"><img class="wng_img" src="https://wx4.sinaimg.cn/mw1024/${photoId}"></img>`);
		}
		var url = $(targ).attr("alt") || $(targ).attr("href");
		if (!/[http|https]:\/\/t.cn/.exec(url)) {
			linkToNormalText();
			return;
		}
		GM_xmlhttpRequest({
			url: url,
			method: "get",
			onload: function (res) {
				if (res && res.status == 200) {
					var src = "";
					try {
						src = res.response.match(/src="(.*)">/)[1];
					} catch (error) {
						console.log(res);
						linkToNormalText();
						return;
					}
					$(targ).before(`<a href="${src}" target="_blank"><img class="iconoGraph" src="${src}"></img>`);
				} else {
					console.log("状态错误", res);
				}
				let a = $("<a style='cursor: pointer;'>建议击毙</a>").click(function () {
					let ng_target = this.parentNode;
					let target_id = $(ng_target.children[0]).attr("usercard").slice(3);
					real_ng_list.push(target_id);
					copyText("," + '"' + target_id + '"');
					$(this).parents(".list_li.S_line1:first").remove();
				});
				$(targ).after(a);
				$(targ).remove();
			},
			onerror: function (err) {
				linkToNormalText();
				console.log("错误", err);
			}
		});

		function linkToNormalText() {
			targ.href = "#";
			targ.innerText = url;
		}
	}

	function noNeigui() {
		let ng_list = $(".WB_text:has(a[usercard])");
		for (let i = 1; i < ng_list.length; i++) {
			let ng = $(ng_list[i].children[0]).attr("usercard");
			if (ng != undefined) {
				let ng_id = ng.slice(3);
				if (real_ng_list.indexOf(ng_id) < 0) {
					// $(ng_list[i]).append("<a style='cursor: pointer;' onclick='catchNeigui(this)'>建议击毙</a>");
				} else {
					$(ng_list[i].parentNode.parentNode).remove();
				}
			}
		}
		let wng = $(".ficon_cd_img");
		for (let i = 0; i < wng.length; i++) {
			let targ = $(wng[i]).parent()[0];
			let photoId = $(targ).attr("action-data").match(/pid=(.*?)&/)[1];
			getPhoto(targ, photoId);
		}
		wng = $("a[title='网页链接']");
		for (let i = 0; i < wng.length; i++) {
			getPhoto(wng[i]);
		}
	}

	function copyText(text, callback) { // text: 要复制的内容， callback: 回调
		let tag = document.createElement('input');
		tag.setAttribute('id', 'cp_hgz_input');
		tag.value = text;
		document.getElementsByTagName('body')[0].appendChild(tag);
		document.getElementById('cp_hgz_input').select();
		document.execCommand('copy');
		document.getElementById('cp_hgz_input').remove();
		if (callback) { callback(text) }
	}

	var json;
	function init() {
		let timeout;
		if ($("#plc_main").length == 0) {
			timeout = setTimeout(init, 300);
			return;
		}
		clearTimeout(timeout);

		$("#plc_main").bind('mousedown', function (event) {
			if (event.button == 3 || event.button == 4) {
				let comment_parent = $(event.target).parents(".list_li.S_line1.clearfix:last");
				$(comment_parent).find(".list_li_v2>div").append('<i class="W_loading"></i>');
				try {
					if (debug) {
						console.log($(comment_parent).find(".list_li_v2 a[action-data]").attr("action-data").match(/child_comment_page=(\d+)/));
					}
					GM_xmlhttpRequest({
						url: `https://weibo.com/aj/v6/comment/big?ajwvr=6&from=singleWeiBo&${$(comment_parent).find(".list_li_v2 a[action-data]").attr("action-data")}`,
						method: "get",
						onload: function (res) {
							if (res && res.status == 200) {
								json = JSON.parse(res.response);
								if (json.code == "100000") {
									$(comment_parent).find(".list_li_v2").before(json.data.html).remove();
									$(comment_parent).find(".between_line").remove();
									return;
								}
							}
							console.log("加载下一页失败：", res);
							alert("加载下一页失败");
						},
						onerror: function (err) {
							console.log("加载下一页错误", err);
							alert("加载下一页错误");
						}
					});
				} catch (error) {
					console.log(error);
					return;
				}
				noNeigui();
			}
		});
	}

	init();

})();