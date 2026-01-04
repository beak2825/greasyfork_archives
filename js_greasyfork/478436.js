// ==UserScript==
// @name          iconPark官方图标库
// @description   列表文字选择工具。
// @version       1.0.0
// @namespace     iconPark官方图标库
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//iconpark.oceanengine.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478436/iconPark%E5%AE%98%E6%96%B9%E5%9B%BE%E6%A0%87%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/478436/iconPark%E5%AE%98%E6%96%B9%E5%9B%BE%E6%A0%87%E5%BA%93.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
    var append_html = '<style type="text/css">'+
	'.icon-store-list {'+
    ' -webkit-user-select: unset;'+
    ' -ms-user-select: unset;'+
    ' user-select: unset;'+
	'}'+
	'</style>';
	$('body').append(append_html);
}