// ==UserScript==
// @name    网页强制复制(增强版)
// @namespace    https://forceToCopy.jasonshaw/
// @author	无法诉说的吟荡3.4，mod by jasonshaw
// @icon	  https://gitcafe.net/favicon.ico
// @version	1.0
// @description	右键强力解锁，可以复制一些特殊网站的文字，增强解锁复制，选中，右键菜单 兼容fireofox、safari和手机版
// @homepage	https://greasyfork.org/zh-CN/scripts/218
// @include        *
// @run-at        document-end
// @grant          unsafeWindow
// @require        https://cdn.jsdelivr.net/npm/jquery@2.1.0/dist/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/424254/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424254/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

function restore() {
	with(document.wrappedJSObject || document) {
		onmouseup = null;
		onmousedown = null;
		oncontextmenu = null;
    ondragstart = null;
    onselectstart = null
	}
	var arAllElements = document.getElementsByTagName('*');
	for (var i = arAllElements.length - 1; i >= 0; i--) {
		var elmOne = arAllElements[i];
		with(elmOne.wrappedJSObject || elmOne) {
			onmouseup = null;
			onmousedown = null;
      ondragstart = null;
      onselectstart = null
		}
	}
}
window.addEventListener('load', restore, true);

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style)
}
addGlobalStyle("html, * {-moz-user-select:text!important;}");
addGlobalStyle("body, * {-webkit-touch-callout: default!important;}");
addGlobalStyle("body, * {-webkit-user-select: auto!important;}");
addGlobalStyle("body, * {-khtml-user-select: auto!important;}");
addGlobalStyle("body, * {-moz-user-select: auto!important;}");
addGlobalStyle("body, * {-ms-user-select: auto!important;}");
addGlobalStyle("body, * {user-select: auto!important;}");
// <style type="text/css">  
// body {  
//     -webkit-touch-callout: none;  //default
//     -webkit-user-select: none;  //auto
//     -khtml-user-select: none;  //auto
//     -moz-user-select: none;  //auto
//     -ms-user-select: none;  //auto
//     user-select: none;  //auto
// }  
// </style> 


// document.ondragstart 拖动时触发
// document.onkeydown 按下键盘触发
// document.oncontextmenu 右键触发
// document.onmouseup 鼠标抬起

// 拖动
// 意外的发现把文本设置成可拖拽也可以禁止拖动。
// draggable=“ture”