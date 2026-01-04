// ==UserScript==
// @name          百度网盘“版权”一栏非全屏时乱跑问题
// @description   解决百度WEB页面最下面脚部“（©2021 Baidu 服务协议|权利声明|版本更新|帮助中心|问题反馈|版权投诉|企业认证）”乱跑问题
// @version       1.0.3
// @namespace     http://tampermonkey.net/
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        白白小草
// @include       *//pan.baidu.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/436774/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E2%80%9C%E7%89%88%E6%9D%83%E2%80%9D%E4%B8%80%E6%A0%8F%E9%9D%9E%E5%85%A8%E5%B1%8F%E6%97%B6%E4%B9%B1%E8%B7%91%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/436774/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E2%80%9C%E7%89%88%E6%9D%83%E2%80%9D%E4%B8%80%E6%A0%8F%E9%9D%9E%E5%85%A8%E5%B1%8F%E6%97%B6%E4%B9%B1%E8%B7%91%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(document).ready(function () {
		init();
	});
})();

function init() {
	var append_html = '<style type="text/css">'+
	'#ft {'+
	'	position: static;'+
	'}'+
	'</style>';
	$('body').append(append_html);
}