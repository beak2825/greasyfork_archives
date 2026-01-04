// ==UserScript==
// @name         手机调试工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  手机调试工具（eruda或vConsole），自己在脚本代码里选择
// @author       tutu辣么可爱
// @include      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437573/%E6%89%8B%E6%9C%BA%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/437573/%E6%89%8B%E6%9C%BA%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
	var mobileConsole = {
		eruda: function() { //eruda
			let url = "//cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.min.js";
			this.load(url, function() {
				eruda.init();
			})
		},
		vConsole: function() { //vConsole
			let url = "//unpkg.com/vconsole@latest/dist/vconsole.min.js";
			this.load(url, function() {
				var vConsole = new window.VConsole();
			})
		},
		load: function(url, callback) { //用于加载js
			var script = document.createElement("script");
			script.type = 'text/javascript';
			script.async = 'async';
			script.src = url;
			document.body.appendChild(script);
			if (script.readyState) { //IE
				script.onreadystatechange = function() {
					if (script.readyState == 'complete' || script.readyState == 'loaded') {
						script.onreadystatechange = null;
						callback();
					}
				}
			} else { //非IE
				script.onload = function() {
					callback();
				}
			}
		}
	}
	mobileConsole.eruda()
})();
