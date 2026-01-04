// ==UserScript==
// @name          百度网盘左右颤抖
// @description   解决百度WEB页面左右颤抖问题，问题反馈百度，人家只会让你换浏览器，Chrome都会有的问题，你让换IE6不成，真是脑子有坑。
// @version       1.0.3
// @namespace    http://tampermonkey.net/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//pan.baidu.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/434020/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%B7%A6%E5%8F%B3%E9%A2%A4%E6%8A%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434020/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%B7%A6%E5%8F%B3%E9%A2%A4%E6%8A%96.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(document).ready(function () {
		init();
	});
})();

function init() {
	var append_html = '<style type="text/css">'+
	'.frame-all {'+
	'	overflow-x: hidden;'+
	'}'+
	'</style>';
	$('body').append(append_html);
}