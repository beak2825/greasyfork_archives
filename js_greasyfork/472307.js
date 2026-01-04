// ==UserScript==
// @name         移除复制后缀
// @version      1.0.3
// @namespace    airbash/RemoveSuffix
// @homepage     https://github.com/AirBashX/UserScript
// @author       airbash
// @description  移除复制后缀,手机、电脑全平台通用,长期维护:CSDN、简书、掘金、知乎专栏、B站专栏、力扣
// @match        *://*.csdn.net/*
// @match        *://*.juejin.cn/*
// @match      	 *://*.jianshu.com/*
// @match        *://www.zhihu.com/*
// @match        *://www.bilibili.com/read/*
// @match        *://leetcode.cn/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/472307/%E7%A7%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/472307/%E7%A7%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function copy() {
		document.addEventListener(
			"copy",
			function (event) {
				event.stopPropagation();
			},
			true
		);
	}

	function userSelect() {
		let style = document.createElement("style");
		style.append("*{user-select:auto !important}");
		document.head.append(style);
	}

	copy();
	userSelect();
})();
