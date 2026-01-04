// ==UserScript==
// @name          B站字体修复
// @description   让B站视频详情页字体改成微软雅黑，解决字体模糊的问题。
// @version       1.0.0
// @namespace     让B站字体改成微软雅黑
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *bilibili.com/video/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @license MIT
// @rewritten_script_code javascript
// @downloadURL https://update.greasyfork.org/scripts/510230/B%E7%AB%99%E5%AD%97%E4%BD%93%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/510230/B%E7%AB%99%E5%AD%97%E4%BD%93%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
    var append_html = '<style type="text/css">'+
	'body {'+
	' font-family: Microsoft YaHei !important;'+
	'}'+
	'</style>';
	$('body').append(append_html);
}