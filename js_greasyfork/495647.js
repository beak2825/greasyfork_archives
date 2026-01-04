// ==UserScript==
// @name         页面翻译
// @namespace    http://tampermonkey.net/page/translate
// @version      0.3
// @description  使用translate.zvo.cn进行页面翻译
// @author       none
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_registerMenuCommand
// @match        *://*/*
//
// @downloadURL https://update.greasyfork.org/scripts/495647/%E9%A1%B5%E9%9D%A2%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/495647/%E9%A1%B5%E9%9D%A2%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
	'use strict';
	
	// Your code here...
	if (window._translator_) {
		window._translator_.execute();
	} else {
		window._translator_ = {
			execute: function() {
				document.body.style.top = "40px";
				window._translator_.translate.execute();
			}
		};
		
		//translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
		//translate.service.use('client.edge'); //设置机器翻译服务通道，直接客户端本身，不依赖服务端 。相关说明参考 http://translate.zvo.cn/43086.html
		//translate.execute();//进行翻译 
		var div = document.createElement('div');
		div.id = 'translate';
		document.body.insertBefore(div, document.body.firstChild);

		var a = document.createElement('script');
		a.src = 'https://cdn.staticfile.net/translate.js/3.2.1/translate.js';
		a.onload = function (e) {
			window._translator_.translate = translate;
			window._translator_.translate.service.use('client.edge');
			//window._translator_.translate.execute();
		};
		document.getElementsByTagName('head')[0].appendChild(a);
	}
	GM_registerMenuCommand("一键翻译", function () {
		window._translator_.execute();
	}, {
		domain : "tools",
		icon : ""
	});
})();