// ==UserScript==
// @name 			百度网页搜索 推广过滤
// @author			极品ΦωΦ小猫
// @version			0.0.5
// @description		隐藏掉百度搜索结果中的推广信息
// @include			/www\.baidu\.com\/((s|baidu)\?|#wd|(index.*)?$)/
// @namespace		http://bbs.maxthon.cn/thread-4460-1-1.html
// @homepage		http://bbs.maxthon.cn/thread-4460-1-1.html
// @supportURL		http://bbs.maxthon.cn/thread-4460-1-1.html
// @icon			http://www.baidu.com/favicon.ico
// @run-at			document-idle
// @grant			unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/4668/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E6%90%9C%E7%B4%A2%20%E6%8E%A8%E5%B9%BF%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/4668/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E6%90%9C%E7%B4%A2%20%E6%8E%A8%E5%B9%BF%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

//var AD=$('a[href^="http://e.baidu.com/"]');
//for(var i in AD) AD[i].parentNode.style.display="none!imporant";
var AD=$('a[href^="http://www.baidu.com/tools?url"]');

for(i=0;i<AD.length;i++) {
	if(/推广/i.test(AD[i].textContent)) {
		console.log(AD[i]);
		console.log($('#content_left'));
		AD[i].parentNode.parentNode.removeChild(AD[i].parentNode);
	}
}

function $(obj) {//ID, Class选择器
	var objF=obj.replace(/^[#\.]/,'');
	return (/^#/.test(obj)) ? document.getElementById(objF):(/^\./.test(obj)) ? document.getElementsByClassName(objF) : document.querySelectorAll(obj);
}