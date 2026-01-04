// ==UserScript==
// @name         百度搜索增强 弹窗显示其他搜索引擎、ChatGPT、BingChat结果
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  本插件会将百度热搜的内容替换为一个弹窗，其中显示其他搜索引擎或网站的搜索内容。支持ChatGPT、Bing Chat免费代理。自定义方便。
// @author       HowardZhangdqs
// @match        *://www.baidu.com/s?*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459571/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%20%E5%BC%B9%E7%AA%97%E6%98%BE%E7%A4%BA%E5%85%B6%E4%BB%96%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E3%80%81ChatGPT%E3%80%81BingChat%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/459571/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%20%E5%BC%B9%E7%AA%97%E6%98%BE%E7%A4%BA%E5%85%B6%E4%BB%96%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E3%80%81ChatGPT%E3%80%81BingChat%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const SearchEngines = [
		{
			url: "https://www.bing.com/search?q={}",
			name: "必应",
		},
		{
			url: "https://bing-vercel.vcanbb.top/web/#/",
			name: "Bing Chat",
			height: true,
		},
		{
			url: "https://chat2.jinshutuan.com/",
			name: "ChatGPT代理",
			height: true,
		},
		{
			url: "https://www.google.com/search?q={}",
			name: "Google",
		},
		{
			url: "https://www.sogou.com/web?query={}",
			name: "搜狗搜索",
		},
		{
			url: "https://zh.wikipedia.org/w/index.php?search={}",
			name: "维基百科",
			limit: true,
		},
		{
			url: "https://www.so.com/s?q={}",
			name: "360搜索",
		},
		{
			url: "https://stackoverflow.com/search?q={}",
			name: "Stackoverflow",
			limit: true,
		},
		{
			url: "https://so.csdn.net/so/search?q={}",
			name: "CSDN",
		},
		{
			url: "https://fanyi.baidu.com/#zh/en/{}",
			name: "百度翻译",
			limit: true,
		},
		{
			url: "https://github.com/search?q={}",
			name: "Github",
			limit: true,
		},
		{
			url: "https://www.zhihu.com/search?type=content&q={}",
			name: "知乎",
			limit: true,
		},
		{
			url: "https://www.dedao.cn/search/result?q={}",
			name: "得到",
			limit: true,
		},
		{
			url: "https://so.gushiwen.cn/search.aspx?value={}&valuej={1}",
			name: "古诗文网",
			limit: true,
		},
		{
			url: "https://www.amap.com/search?query={}",
			name: "高德地图",
			height: true,
		},
		{
			url: "https://map.baidu.com/search/?querytype=s&wd={}",
			name: "百度地图",
			height: true,
		},
	];



	const rootname = "GM_baidubing_"
	const format = rootname + "format";
	const selectid = rootname + "selectid";
	const dragElementID = "content_right";
	const iframeid = rootname + "iframe";
	const urlid = rootname + "url";
	const openid = rootname + "open";

	const build_search_engines = () => {
		let i = 0;
		return `<select id="${selectid}" title="选择副屏内容">` + SearchEngines.reduce((pre, { limit, name }) => {
			return pre + `<option value="${i++}">${name}${limit ? "*" : ""}</option>`
		}, "") + "</select>";
	};

	const SearchEngines_html = build_search_engines();

	if (!String.prototype[format])
		String.prototype[format] = function () {
			var args = arguments;
			return this.replace(/{}/g, function (match) {
				return typeof args[0] != 'undefined' ? args[0] : match;
			}).replace("{1}", args[0][0]);
		};

	function dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById(elmnt.id + "header")) document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
		else elmnt.onmousedown = dragMouseDown;

		function dragMouseDown(e) {
			e = e || window.event;
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;

			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;

			//elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	var URL = "";

	const show_bing = () => {
		setTimeout(() => {
			const bing_url = `https://www.bing.com/search?q=${new URLSearchParams(location.search).get("wd")}`;
			const keyword = new URLSearchParams(location.search).get("wd");URL

			URL = bing_url;

			$("#" + dragElementID).html(`
            	<div id="${dragElementID}header" style="padding: 5px; cursor: e-resize; z-index: 10; background-color: #2196F3; color: #fff;">
					可左右拖拽 <span style="margin: 0 .5em"></span>
					<input id="${urlid}" value="${bing_url}" title="iframe链接" style="width: 50%"/> <span style="margin: 0 .5em"></span>
					副屏内容：${SearchEngines_html}
					<button id="${openid}" style="font-size: 10%">在新标签页中打开</button>
				</div>
                <iframe id="${iframeid}" src="${bing_url}"
					frameborder="0"
					style="width: 1000px; height: ${$("#container").height() -
				$("#container > .result-molecule.new-pmd[tpl]").eq(0).height() - 20}px">
				</iframe>
            `).css({
					"position": "absolute",
					"z-index": "9",
					"background-color": "#f1f1f1",
					"text-align": "center",
					"border": "1px solid #d3d3d3",
					"width": "1000px",
					"user-select": "none",
					"left": "700px",
					"margin": "0"
				});

			dragElement(document.getElementById(dragElementID));

			let $select = $("#" + selectid);
			let $iframe = $("#" + iframeid);
			let $url = $("#" + urlid);
			let preval = 0;

			$select.val(preval);

			$("#" + openid).click(() => {
				window.open(URL);
			});

			$url.change(() => {
				URL = $url.val();
				$iframe.attr("src", URL);
			});

			$select.change(() => {
				console.log($select.val());
				let current_search = SearchEngines[parseInt($select.val())];

				if (current_search.limit) {
					window.open(current_search.url[format](keyword));
					$select.val(preval);
					return;
				}

				preval = $select.val();

				URL = current_search.url[format](keyword);

				$iframe.attr("src", URL);
				$url.val(URL);

				if (current_search.height) $iframe.height(
					$(window).height() -
					$("#head").height() -
					$("#container > .result-molecule.new-pmd[tpl]").eq(0).height() -
					$(`#${dragElementID}header`).height() - 10
				);
				else $iframe.height(
					$("#container").height() -
					$("#container > .result-molecule.new-pmd[tpl]").eq(0).height()
					// - $("#container > .result-molecule.new-pmd[tpl]").eq(1).height()
				);
			});

		}, 1000);
		console.log("showing bing");
	};

	let pre = window.location.href

	setInterval(() => {
		if (window.location.href != pre) show_bing(), pre = window.location.href;
	}, 1000);


	show_bing();
})();