// ==UserScript==
// @name			js重定向地址栏
// @description	如5图片URL打开后去末尾参数以便Exif, 仅location.href地址栏URL重定向, 会FOUC闪烁, 而用Redirector更牛,不闪烁.
// @version			2020-7-23
// @author			Via内测群@2655995367
// @match	https://cdnfileimg.115.com/*

// @namespace https://greasyfork.org/users/35765
// @downloadURL https://update.greasyfork.org/scripts/423721/js%E9%87%8D%E5%AE%9A%E5%90%91%E5%9C%B0%E5%9D%80%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/423721/js%E9%87%8D%E5%AE%9A%E5%90%91%E5%9C%B0%E5%9D%80%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = location.href;
	if(/https:\/\/cdnfileimg\.115\.com\/.*/.test(location.href)&&location.href.match(/\?x-oss-process=style\/.*/)!=null) {
		location.href=location.href.replace(/\?x-oss-process=style\/.*/,"")}
	})();

var defm = false;
	window.onkeyup = function(event)	{
	switch(event.keyCode) {
		case 27: //escape
			window.close(); //Esc关闭页面
			break;
	}
};