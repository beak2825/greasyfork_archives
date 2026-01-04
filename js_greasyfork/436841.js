// ==UserScript==
// @name         移动百度优化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  非百度系浏览器使用百度APP的ua时，添加一个悬浮搜索栏。
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @require      https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @match        https://m.baidu.com/s*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://sm.bdimg.com/static/wiseindex/img/favicon64.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436841/%E7%A7%BB%E5%8A%A8%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436841/%E7%A7%BB%E5%8A%A8%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	// jQuery extensions
	$.fn.TTjs = function(k, v) {
		return /string|boolean/i.test(typeof v) ? this.attr(`TTjs-${k}`, v) : this.attr(`TTjs-${k}`);
	}
	$.fn.removeTTjs = function(k) {
		return this.removeAttr(`TTjs-${k}`)
	}
	$.urlChange = function(fn) {
		var addEvent = function(type) {
			var origin = history[type];
			return function() {
				var rv = origin.apply(this, arguments);
				var e = new Event(type);
				e.arguments = arguments;
				window.dispatchEvent(e);
				return rv;
			}
		};
		history.pushState = addEvent('pushState');
		history.replaceState = addEvent('replaceState');
		$(window).bind('hashchange', fn);
		$(window).bind('popstate', fn);
		$(window).bind('pushState', fn);
		$(window).bind('replaceState', fn);
	}

	// 常量
	const device = location.hostname === "m.baidu.com" ? "mobile" : "pc";
	const css =
		`@media (min-width:800px){[TTjs-device=mobile][TTjs-page=synthesis] #results{display:grid;grid-template-columns:repeat(2,calc(50% - 5px));grid-gap:10px;margin:10px;}[TTjs-device=mobile][TTjs-page=synthesis] #results>.c-result{background-color:rgb(255,255,255);border-radius:15px;}[TTjs-device=mobile][TTjs-page=synthesis] #results>:not(.c-result){display:none;}[TTjs-device=mobile][TTjs-page=tieba] .sfa-results{display:grid;grid-template-columns:repeat(2,calc(50% - 5px));grid-gap:10px;}[TTjs-device=mobile][TTjs-page=tieba] .sfa-results>.c-result{background-color:rgb(255,255,255);}[TTjs-device=mobile][TTjs-page=tieba] .sfa-results>:not(.c-result){display:none;}[TTjs-device=mobile][TTjs-page=realtime] #realtime-container .c-infinite-scroll{display:grid;grid-template-columns:repeat(2,calc(50% - 5px));grid-gap:10px;margin:10px;}[TTjs-device=mobile][TTjs-page=realtime] #realtime-container .c-infinite-scroll>div{background-color:rgb(255,255,255);border-radius:15px;}[TTjs-device=mobile][TTjs-page=realtime] #realtime-container .c-infinite-scroll>:not(div),[TTjs-device=mobile][TTjs-page=realtime] #realtime-container .c-infinite-scroll>.c-infinite-scroll-topbar{display:none;}}.TTjs-float-search-bar{position:fixed;bottom:0;left:0;width:100vw;z-index:99999;--bg:#f2f3f5;--bg2:#fff;--border:#222;--kd:#f04142;}.TTjs-float-search-bar[TTjs-ele=bubble]{height:66px;width:42px;background-color:transparent;transition:all 0.2s;}.TTjs-float-search-bar[TTjs-ele=title]{height:66px;background-color:transparent;transition:all 0.2s;}.TTjs-float-search-bar[TTjs-ele=page]{height:100vh;background-color:var(--bg);transition:all 0.2s;}.TTjs-float-search-bar [TTjs-ele=container]{display:flex;flex-direction:column-reverse;width:90%;max-width:750px;height:calc(100% - 20px);position:absolute;left:50%;transform:translateX(-50%);background-color:transparent;}.TTjs-float-search-bar [TTjs-ele=bar]{position:relative;width:calc(100% - 14px);height:42px;border:2px solid var(--border);border-radius:8px;padding:0 5px;background-color:var(--bg2);}.TTjs-float-search-bar i{width:30px;height:100%;}.TTjs-float-search-bar [TTjs-ele=search]{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNC4wNjMgNi43OTdhNy4yNjYgNy4yNjYgMCAxMDQuNjE2IDEyLjg3NmwzLjI3NyAzLjI3N2EuNzAzLjcwMyAwIDEwLjk5NC0uOTk0bC0zLjI3Ny0zLjI3N2E3LjI2NiA3LjI2NiAwIDAwLTUuNjEtMTEuODgyem0wIDEuNDA2YTUuODYgNS44NiAwIDExMCAxMS43MTkgNS44NiA1Ljg2IDAgMDEwLTExLjcxOXoiIGZpbGw9IiMyMjIiLz48L3N2Zz4=") no-repeat center;float:left;}.TTjs-float-search-bar [TTjs-ele=empty]{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00IDEyYTggOCAwIDExMTYgMCA4IDggMCAwMS0xNiAwem0xMC4yMTYtMy41MzZhLjc3My43NzMgMCAxMTEuMDkyIDEuMDkzTDEyLjg2NiAxMmwyLjQ0MiAyLjQ0M2EuNzczLjc3MyAwIDAxLTEuMDkyIDEuMDkzbC0yLjQ0My0yLjQ0My0yLjQ0MyAyLjQ0M2EuNzczLjc3MyAwIDExLTEuMDkzLTEuMDkzTDEwLjY4IDEyIDguMjM3IDkuNTU3QS43NzMuNzczIDAgMDE5LjMzIDguNDY0bDIuNDQzIDIuNDQzIDIuNDQzLTIuNDQzeiIgZmlsbD0iI0NBQ0FDQSIvPjwvc3ZnPg==") no-repeat center;float:right;}.TTjs-float-search-bar [TTjs-ele=back]{background:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi45OTk4IDhMNiAxNEwxMi45OTk4IDIxIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTYgMTRIMjguOTkzOEMzNS44NzY4IDE0IDQxLjcyMjEgMTkuNjIwNCA0MS45OTA0IDI2LjVDNDIuMjczOSAzMy43Njk2IDM2LjI2NzEgNDAgMjguOTkzOCA0MEgxMS45OTg0IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+") no-repeat center;background-color:var(--bg2);background-size:65%;position:absolute;bottom:-2px;right:-38px;border:2px solid var(--border);border-radius:8px;}.TTjs-float-search-bar input{outline:0;border:0;background-color:transparent;width:calc(100% - 70px);height:100%;padding:0 5px;font-size:20px;}.TTjs-float-search-bar [TTjs-ele=sug]{display:flex;flex-direction:column-reverse;font-size:20px;height:auto;max-height:calc(100% - 46px);overflow-y:auto}.TTjs-float-search-bar [TTjs-ele=sug]::-webkit-scrollbar{display:none;}.TTjs-float-search-bar [TTjs-ele=item]{background-color:var(--bg2);margin-bottom:10px;padding:5px;padding-left:10px;border-radius:10px;height:40px;line-height:40px;}.TTjs-float-search-bar [TTjs-ele=keywords]{color:var(--kd);}.TTjs-float-search-bar [TTjs-ele=insert]{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguNSA4LjVMMjAuNTIwOCAyMC41MjA4IiBzdHJva2U9IiMyMjIyMjIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTguNSA4LjVIMTcuNSIgc3Ryb2tlPSIjMjIyMjIyIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik04LjUgOUw4LjUgMTgiIHN0cm9rZT0iIzIyMjIyMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K") no-repeat center;transform:rotate(-90deg);width:30px;height:100%;float:right;}.TTjs-float-search-bar:not([TTjs-ele=page]) [TTjs-ele=sug],.TTjs-float-search-bar:not([TTjs-ele=page]) [TTjs-ele=empty],.TTjs-float-search-bar:not([TTjs-ele=page]) [TTjs-ele=back],.TTjs-float-search-bar[TTjs-ele=bubble] [TTjs-ele=input]{display:none;}.TTjs-float-search-bar[TTjs-ele=title] [TTjs-ele=input]{text-align:center;position:absolute;left:50%;top:0;transform:translateX(-50%);}.TTjs-float-search-bar[TTjs-ele=page] [TTjs-ele=bar]{margin-right:38px;width:calc(100% - 52px);}.TTjs-float-search-bar[TTjs-ele=page] [TTjs-ele=search]{float:right;}.TTjs-float-search-bar[TTjs-ele=bubble] [TTjs-ele=container]{width:42px;transform:translateX(0);left:0;}.TTjs-float-search-bar[TTjs-ele=bubble] [TTjs-ele=bar]{border:0;width:32px;border-radius:50%;opacity:0.5;}`;

	var originURL = new URL(location.href);
	var pd = originURL.searchParams.get("pd") || "synthesis";
	var wd = originURL.searchParams.get("word") || originURL.searchParams.get("wd");

	function initPreParams() {
		originURL = new URL(location.href);
		pd = originURL.searchParams.get("pd") || "synthesis";
		wd = originURL.searchParams.get("word") || originURL.searchParams.get("wd");
	}

	function enableMap() {
		var map = {
				"mobile": ["synthesis", "tieba", "realtime"]
			},
			check = map.hasOwnProperty(device) && map[device].indexOf(pd) > -1;
		$("html").TTjs("device", check ? device : "");
		$("html").TTjs("page", check ? pd : "");
		return check
	}

	function searchTrigger(self) {
		var val = self.val().trim(),
			sugApi = "https://m.baidu.com/sugrec?json=1&prod=wise&callback=baidusug&wd=";
		if (val) {
			$(".TTjs-float-search-bar [TTjs-ele=empty]").removeAttr("style");
		} else {
			$(".TTjs-float-search-bar [TTjs-ele=empty]").hide();
			return false;
		}
		$.get(sugApi + val, (sug) => {
			if (!sug) {
				console.log("百度联想词获取失败");
				return null
			}
			try {
				sug = sug.replace(/^baidusug\(/, "").replace(/\)$/, "");
				sug = JSON.parse(sug);
				console.log(sug);
				$(".TTjs-float-search-bar [TTjs-ele=sug]").html("");
				sug.g.forEach((e) => {
					e.type === "sug" && $(".TTjs-float-search-bar [TTjs-ele=sug]").append(
						`<div TTjs-ele="item">${e.q.replace(val,`<span TTjs-ele="keywords">${val}</span>`)}<i TTjs-ele="insert"></i></div>`
					)
				})
				$(".TTjs-float-search-bar [TTjs-ele=item]").click((e) => {
					e = $(e.currentTarget);
					location.href = `https://m.baidu.com/s?word=${e.text()}`;
				})
			} catch (e) {
				console.log("百度联想词获取失败");
			}
		})
	}

	function addBar() {
		var $bar = $(
			`<div class="TTjs-float-search-bar" TTjs-ele="title"><div TTjs-ele="container"><div TTjs-ele="bar"><i TTjs-ele="search"></i><input TTjs-ele="input" value="${wd?wd:"请输入搜索内容"}" placeholder="请输入搜索内容" readonly/><i TTjs-ele="empty"></i><i TTjs-ele="back"></i></div><div TTjs-ele="sug"></div></div></div>`
		);
		var bar = {
			switch: function(eleName) {
				if (eleName && typeof eleName === "string") {
					this.self.TTjs("isSwitching", "isSwitching");
					this.self.TTjs("ele", eleName);
					setTimeout(() => {
						this.self.removeTTjs("isSwitching");
					},250)
				}
				return this.self.TTjs("isSwitching") === "isSwitching"
			},
			self: $bar,
			input: $bar.find("[TTjs-ele=input]"),
			search: $bar.find("[TTjs-ele=search]"),
			empty: $bar.find("[TTjs-ele=empty]"),
			back: $bar.find("[TTjs-ele=back]")
		};
		bar.empty.click(() => {
			if (bar.switch() || bar.self.TTjs("ele") !== "page") {
				return false
			}
			bar.empty.hide();
			bar.input.val("");
			setTimeout(()=>{
				bar.input.focus();
			},50)
		})
		bar.back.click(() => {
			if (bar.switch() || bar.self.TTjs("ele") !== "page") {
				return false
			}
			bar.input.val(wd);
			bar.empty.removeAttr("style");
			bar.input.attr("readonly", "");
			bar.switch("title");
			history.back();
		})
		bar.search.click(() => {
			if(bar.switch()){
				return false
			}
			switch (bar.self.TTjs("ele")) {
				case "page":
					location.href = `https://m.baidu.com/s?word=${bar.input.val()}`;
					break;
				case "title":
					bar.switch("bubble")
					break;
				case "bubble":
					bar.switch("title");
					break;
				default:
					break;
			}
		})
		bar.input.on({
			compositionstart: function() {
				$(this).TTjs("isIput", true);
			},
			compositionend: function() {
				$(this).removeTTjs("isIput");
				searchTrigger($(this))
			},
			input: function(e) {
				if (!$(this).TTjs("isIput")) {
					searchTrigger($(this))
				}
			},
			keydown: function(e) {
				e = e.originalEvent;
				if (!$(this).TTjs("isIput") && (e.keyCode === 13 || /enter/i.test(e.key))) {
					bar.search[0].click();
				}
			},
			click: function() {
				if (bar.switch() || bar.self.TTjs("ele") !== "title") {
					return false
				}
				searchTrigger($(this));
				bar.switch("page");
				$(this).removeAttr("readonly");
				bar.input[0].setSelectionRange(-1,-1);
				var url = new URL(location.href);
				url.searchParams.set("TTjs", "baiduSearch");
				history.pushState(null, "移动百度优化-搜索", url.toString());
			}
		});
		$("body").append(bar.self);
	}
	GM_addStyle(css);
	enableMap();
	addBar();
	$.urlChange(() => {
		$(".TTjs-float-search-bar[TTjs-ele=page]").is(":visible") && $(
			".TTjs-float-search-bar [TTjs-ele=back]")[0].click();
		initPreParams();
		enableMap();
	})
	setInterval(() => {
		if (!$(".TTjs-float-search-bar")[0]) {
			console.log("add bar")
			addBar();
		}
	}, 200)
})();