// ==UserScript==
// @name          DLsite文字选择
// @description   让DLsite文字标题可选择工具。
// @version       1.0.0
// @namespace     DLsite文字选择
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//www.dlsite.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488037/DLsite%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/488037/DLsite%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
	var append_html = '<style type="text/css">'+
	'* {'+
	' user-select: unset !important;'+
	'}'+
	'</style>';
	$('body').append(append_html);
}