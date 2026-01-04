// ==UserScript==
// @name         Baidu深色模式(简易版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个简易版的Baidu自动深色模式
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @run-at       document-start
// @match        *://*.baidu.com/*
// @icon         https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446390/Baidu%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%28%E7%AE%80%E6%98%93%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446390/Baidu%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%28%E7%AE%80%E6%98%93%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var htmlAttr = function(k, v) {
			document.querySelector("html").setAttribute(k, v);
		},
		site = location.host.split(".")[0].trim(),
		mode = {
			on: function() {
				htmlAttr("theme", "dark");
			},
			off: function() {
				htmlAttr("theme", "normal");
			},
			auto: function() {
				var that = this,
					mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'),
					themeChange = function() {
						mediaQuery.matches ? that.on() : that.off()
					}
				themeChange(); // 判断当前模式
				mediaQuery.onchange = themeChange; // 监听模式变化
			}
		},
		css = `
			html[theme=dark]:not([site=unknown]),
			html[theme=dark]:not([site=unknown]) img,
			html[theme=dark]:not([site=unknown]) picture,
			html[theme=dark]:not([site=unknown]) video,
			html[theme=dark][site=www] .c-title::before,
			html[theme=dark][site=www] .c-title a,
			html[theme=dark][site=www] .c-icon,
			html[theme=dark][site=www] input[type=submit],
			html[theme=dark][site=image] input[type=submit],
			html[theme=dark][site=baike] .cmn-baike-logo,
			html[theme=dark][site=baike] button#search,
			html[theme=dark][site=baike] .navbar-content-box,
			html[theme=dark][site=baike] .add-video,
			html[theme=dark][site=zhidao] .logo,
			html[theme=dark][site=zhidao] button#search-btn,
			html[theme=dark][site=zhidao] .item-text,
			html[theme=dark][site=zhidao] .wgt-replyer-all-avatar{
				filter: invert(1) hue-rotate(180deg);
			}
			html[theme=dark][site=zhidao] body{
				background-color: white;
			}
		`;
	// 预处理
	htmlAttr("site", /^www|image|baike|zhidao$/i.test(site) ? site : "unknown");
	// 加载CSS
	GM_addStyle(css);
	mode.auto();
})();
