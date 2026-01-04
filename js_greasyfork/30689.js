// ==UserScript==
// @name         直接显示课件站下载链接
// @namespace    https://github.com/Rongronggg9/kjzhanFakeUA
// @version      1.1
// @description  无需微信或 2345 浏览器以及验证码，直接显示下载链接
// @author       Rongronggg9
// @match        *://www.kjzhan.com/plus/download.php*
// @run-at       document-start
// @grant        none
// @supportURL   https://github.com/Rongronggg9/kjzhanFakeUA/issues
// @icon         http://www.kjzhan.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/30689/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E8%AF%BE%E4%BB%B6%E7%AB%99%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/30689/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E8%AF%BE%E4%BB%B6%E7%AB%99%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
	'use strict';
	navigator.__defineGetter__('userAgent', function() {
		return 'WangPai MicroMessenger';
	});

	window.addEventListener('load', function() {
		document.getElementById("ys").style.display = "none";
		document.getElementById("dow").style.display = "block";
	}, false);

})();
