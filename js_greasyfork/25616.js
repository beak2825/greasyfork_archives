// ==UserScript==
// @name           info
// @namespace      undefined
// @version        1
// @description   （不要安装，只是学习如何制作和发布脚本）提示用户当前的各种信息，包括：时间、网址、默认文本、浏览器信息、显示器信息
// @author         apperception
// @include        *
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/25616/info.user.js
// @updateURL https://update.greasyfork.org/scripts/25616/info.meta.js
// ==/UserScript==

window.setTimeout(function(){alert("Hello World!")},60);
var d=new Date();
alert('当前的时间：'+d+'、'+d.toTimeString()+';'+
	'当前访问网站的网址：'+location.hostname+';'+
	'当前页的默认文本：'+defaultStatus+';'+
	'浏览器的相关信息：'+navigator.appCodeName+';'+
	navigator.appName+';'+
	navigator.appVersion+';'+
	'当前浏览器是否启用cookie：'+navigator.cookieEnabled+';'+
	'当前运行浏览器的操作平台系统：'+navigator.platform+';'+
	'当前浏览器是否启用Java:'+navigator.javaEnabled()+';'+
	'显示器屏幕的宽度和高度：'+screen.width+'*'+screen.height);