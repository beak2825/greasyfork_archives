// ==UserScript==
// @name 			搜狐文章页弹窗屏蔽
// @description		搜狐文章页点击文章内容时会弹出窗口，该脚本提前标记你已被弹窗，从而防止弹窗事件发生
// @version         0.0.1
// @author			极品小猫
// @include			/http://[\w\.]+\.sohu.com/\d{8}/n\d/
// @grant			none
// @run-at			document-start
// @icon			http://mt.sohu.com/favicon.ico
// @namespace https://greasyfork.org/users/3128
// @downloadURL https://update.greasyfork.org/scripts/12260/%E6%90%9C%E7%8B%90%E6%96%87%E7%AB%A0%E9%A1%B5%E5%BC%B9%E7%AA%97%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/12260/%E6%90%9C%E7%8B%90%E6%96%87%E7%AB%A0%E9%A1%B5%E5%BC%B9%E7%AA%97%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

setCookie('indexpoped','1');
function setCookie(CookieName, Cookievalue,CookieDays) {//添加Cookies
	var str = CookieName + "=" + escape(Cookievalue);
	if(CookieDays> 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = CookieDays*24*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
}