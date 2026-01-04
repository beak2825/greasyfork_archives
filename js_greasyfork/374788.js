// ==UserScript==
// @name        全网去除Google广告
// @namespace    http://www.vernonshao.com
// @version      0.1
// @description  去除全网讨厌的Google广告
// @author       Vernon
// @match        *://*/*
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374788/%E5%85%A8%E7%BD%91%E5%8E%BB%E9%99%A4Google%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/374788/%E5%85%A8%E7%BD%91%E5%8E%BB%E9%99%A4Google%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {

	//删除所有广告
	var x = document.getElementsByClassName("ad");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}

	//删除广告
	var y = document.getElementsByClassName("adsbygoogle");
	var j;
	for (j = 0; j < y.length; j++) {
		y[j].style.display = "none";
	}

	//删除页面广告
	$(".adsbygoogle").remove();


})();
