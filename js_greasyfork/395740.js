// ==UserScript==
// @name         所有网页超链接在新标签页打开 By - 全栈CEO
// @namespace    https://roceys.cn
// @version      20200128
// @description  点击网页中A标签超链接自动在新标签页窗口打开脚本
// @author       ROCEYS
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395740/%E6%89%80%E6%9C%89%E7%BD%91%E9%A1%B5%E8%B6%85%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%20By%20-%20%E5%85%A8%E6%A0%88CEO.user.js
// @updateURL https://update.greasyfork.org/scripts/395740/%E6%89%80%E6%9C%89%E7%BD%91%E9%A1%B5%E8%B6%85%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%20By%20-%20%E5%85%A8%E6%A0%88CEO.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var base = document.createElement("base");
	base.target="_blank";
	document.getElementsByTagName("HEAD").item(0).appendChild(base);  

})();