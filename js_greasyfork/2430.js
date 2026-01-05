// ==UserScript==
// @name	  Discuz-download
// @version	 1.0
// @run-at	document-end
// @grant	        none
// @description  Discuz附件下载权限绕过
// @supportURL   http://tieba.baidu.com/f?kw=firefox
// @include     http*
// @namespace https://greasyfork.org/users/54
// @downloadURL https://update.greasyfork.org/scripts/2430/Discuz-download.user.js
// @updateURL https://update.greasyfork.org/scripts/2430/Discuz-download.meta.js
// ==/UserScript==
for (var e = document.querySelectorAll('dl.tattl'), a, i = e.length - 1; i > -1; i--) {
	(a = e[i]) && (a = a.querySelector('a')) && /&aid=([^&]*)/.test(a.href) && (a.href = a.href.replace(RegExp.$1, encodeURIComponent(btoa(atob(decodeURIComponent(RegExp.$1)).replace(/[^|]*\|([^|]*)$/, '1|$1')))))
}