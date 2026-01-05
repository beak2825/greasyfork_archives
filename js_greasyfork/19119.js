// ==UserScript==
// @name         CB时光鸡
// @namespace    http://www.fishlee.net/
// @version      1.2
// @description  一只带你看过去的鸡
// @author       木鱼(iFish)
// @match        http://www.cnbeta.com/articles/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/19119/CB%E6%97%B6%E5%85%89%E9%B8%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/19119/CB%E6%97%B6%E5%85%89%E9%B8%A1.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var injectFunction = function (fun) {
		if (typeof (fun) === 'string')
			fun = fun + '';
		var script = document.createElement("script");
		script.textContent = '(' + fun + ')();';
		document.head.appendChild(script);
		document.head.removeChild(script);
	};
	var injectStyle = function (style) {
		var ele = document.createElement("style");
		ele.textContent = style;
		document.head.appendChild(ele);
	};
	injectStyle("#cbtc{display:none;padding:10px;background:#fafbde;border:1px solid #cdd073;border-bottom:none;color:#707143}#cbtc a{color:#707143;font-weight:bold;text-decoration:none}#cbtc a:hover{text-decoration:underline}#cbtc a.extra{float:right}");

	//main
	injectFunction(function () {
		var injectFunction = function (fun) {
			if (typeof (fun) === 'string')
				fun = fun + '';
			var script = document.createElement("script");
			script.textContent = '(' + fun + ')();';
			document.head.appendChild(script);
			document.head.removeChild(script);
		};
		var entry = function () {
			setTimeout(checkLoop, 1000);
		};
		var checkLoop = function () {
			var ems = $("div.post_count em");
			if (!ems.length) {
				setTimeout(checkLoop, 1000);
			} else {
				var total = parseInt($.trim(ems[0].innerText));
				var showing = parseInt($.trim(ems[1].innerText));
				if (document.querySelector("div.cb-comment-close") || (total && !showing)) {
					doCommentShadow();
				}
			}
		}.bind(this);
		var patchMethod = function () {
			var code = $.cmtOnload + '';
			code = code.replace(/,\s*bindAction\s*=[\w\W]*initData\(/i, ";GV.COMMENTS.CLICKED=0;initData(");
			code = code.replace(/bindAction\(\);?/i, "$('#cbtc').fadeIn();");
			code = code.replace(/type\s*:\s*['"]POST['"],/i, "type:'GET',");
			code = code.replace(/url\s*:\s*GV\.DETAIL\.POST_VIEW_URL/i,
				"url: 'http://cb.apps.fishlee.net/comment/archive/'+GV.DETAIL.SID+'-'+GV.COMMENTS.MORENUM+'-'+page+'.json'");
			code = code.replace(/cache\s*:\s*!\s*0/i, "cache: 1");
			code = code.replace(/data\s*:\s*{\s*['"]op['"]\s*:\s*page\+.*?}\s*,/i, "data:{csrf_token:null},");
			return code;
		};
		var doCommentShadow = function () {
			if (typeof GV === 'undefined')
				window.GV = {};
			if (!GV || !GV.DETAIL || GV.DETAIL.SID < 493587)
				return;

			GV.COMMENTS.POSTED = 0;

			var scripts = [];
			//restore comments
			if (!GV.EMOTION) {
				var data = JSON.parse(localStorage.getItem("cbemotion") || "{}");
				if (!data || !data.time || (new Date().getTime() - data.time) / 1000 > 60 * 60 * 24) {
					data = {
						time: new Date().getTime(),
						data: GV && GV.EMOTION ||
						{
							PAGE_SIZE: 30,
							SHOW_SIZE: 2,
							EMO_DATA: [
								{
									"category": "\u5927\u7ae0\u9c7c",
									"emotion": [
									{ "sign": "[s:\u7231\u5fc3]", "url": "\/assets\/images\/emotion\/octopus\/01.gif", "name": "\u7231\u5fc3" },
									{ "sign": "[s:\u6c57]", "url": "\/assets\/images\/emotion\/octopus\/02.gif", "name": "\u6c57" },
									{ "sign": "[s:\u9ed1]", "url": "\/assets\/images\/emotion\/octopus\/03.gif", "name": "\u9ed1" },
									{ "sign": "[s:\u52a0\u73ed]", "url": "\/assets\/images\/emotion\/octopus\/04.gif", "name": "\u52a0\u73ed" },
									{ "sign": "[s:\u8d31\u7b11]", "url": "\/assets\/images\/emotion\/octopus\/05.gif", "name": "\u8d31\u7b11" },
									{ "sign": "[s:\u60ca\u8bb6]", "url": "\/assets\/images\/emotion\/octopus\/06.gif", "name": "\u60ca\u8bb6" },
									{ "sign": "[s:\u62a0\u9f3b]", "url": "\/assets\/images\/emotion\/octopus\/07.gif", "name": "\u62a0\u9f3b" },
									{ "sign": "[s:\u54ed]", "url": "\/assets\/images\/emotion\/octopus\/08.gif", "name": "\u54ed" },
									{ "sign": "[s:\u55b7]", "url": "\/assets\/images\/emotion\/octopus\/09.gif", "name": "\u55b7" },
									{ "sign": "[s:\u6c99\u53d1]", "url": "\/assets\/images\/emotion\/octopus\/10.gif", "name": "\u6c99\u53d1" },
									{ "sign": "[s:\u751f\u6c14]", "url": "\/assets\/images\/emotion\/octopus\/11.gif", "name": "\u751f\u6c14" },
									{
										"sign": "[s:\u53cc\u8d1f\u4e94]",
										"url": "\/assets\/images\/emotion\/octopus\/12.gif",
										"name": "\u53cc\u8d1f\u4e94"
									}, { "sign": "[s:\u7b11]", "url": "\/assets\/images\/emotion\/octopus\/13.gif", "name": "\u7b11" },
									{ "sign": "[s:\u6655]", "url": "\/assets\/images\/emotion\/octopus\/14.gif", "name": "\u6655" }
									]
								}
							]
						}
					};
					localStorage.setItem("cbemotion", JSON.stringify(data));
				}
				scripts.push("GV.EMOTION=" + JSON.stringify(data.data) + ";");
			}
			scripts.push("(" + patchMethod() + ")('.commt_list');");

			$(".commt_list").show();
			$("#J_commt_list").prepend("<div id='cbtc'>评论已被CB关闭显示。本页评论由 <a href='http://www.fishlee.net/soft/cbtc/' target='_blank' style=''>CB时光鸡</a> 为您提供快照！偶不是一只普通的鸡！<a href='http://www.fishlee.net/soft/cbtc/' target='_blank' class='extra'>了解更多...</a></div>");
			injectFunction("function(){" + scripts.join("") + ";}");
		};
		entry();
	});
})();
