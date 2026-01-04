// ==UserScript==
// @name        动漫花园净化（资源详情页）
// @namespace   Violentmonkey Scripts
// @match       https://share.dmhy.org/topics/view/*.html
// @grant       none
// @version     1.0
// @author      RoachLin
// @description 2022/9/30 00:00:00
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/453446/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%87%80%E5%8C%96%EF%BC%88%E8%B5%84%E6%BA%90%E8%AF%A6%E6%83%85%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/453446/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%87%80%E5%8C%96%EF%BC%88%E8%B5%84%E6%BA%90%E8%AF%A6%E6%83%85%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
	//浏览器使用uBlock Origin插件实现去广告功能

	//右上角链接
	var a = document.getElementsByClassName("links");
	var b = a[0].firstElementChild;
	for (var i = 1; i <= 7; ++i) {
		b.nextElementSibling.remove();
	}

	//右上角“联盟+”
	document.getElementById("expand-button").remove();

	//顶部“新番资源索引”栏
	document.getElementById("mini_jmd").remove();

	//主体上方“张贴分享”+滚动文字
	var a = document.getElementsByClassName("clear");
	a[1].remove();

	//左侧“熱門資源”
	var a = document.getElementsByClassName("topics_cult box ui-corner-all nocontent");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}
	var a = document.getElementsByClassName("user-sidebar");
	a[0].lastElementChild.remove();

	//主体右上角“種子下載”、“在线播放”、“訪客互動”和“另類分享”
	var a = document.getElementsByClassName("info resource-info right");
	var b = a[0].firstElementChild;
	b.lastElementChild.remove();
	b.lastElementChild.remove();
	b.lastElementChild.previousElementSibling.remove();
	b.lastElementChild.previousElementSibling.remove();

	//主体右上角信息列移动位置
	document.styleSheets[0].rules[190].style.cssText = "margin-top: 0px;";
	document.styleSheets[0].rules[192].style.cssText = "float: center;";

	//“簡介: ”
	var a = document.getElementsByClassName("topic-nfo box ui-corner-all");
	a[0].firstElementChild.remove();
	a[0].firstElementChild.remove();
	a[0].lastElementChild.remove();

	//“BT列表”
	var a = document.getElementsByClassName("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}

	//“會員專用連接”上方空白
	document.styleSheets[0].rules[619].style.cssText = "padding: 0em 0em; border-width: 0px; background: none;";

	//“彈幕播放連接”和“外部搜索連接”
	var a = document.getElementById("tabs-1");
	a.lastElementChild.previousElementSibling.previousElementSibling.remove();
	a.lastElementChild.previousElementSibling.previousElementSibling.remove();

	//“***以下發佈所有評論，僅代表網友觀點與本站無關!***”
	document.styleSheets[0].rules[234].style.cssText = "display: none";

	//“快速發帖”
	document.styleSheets[0].rules[227].style.cssText = "display: none";

	//评论框右边“注意:”
	document.styleSheets[0].rules[228].style.cssText = "display: none";

	//底部信息
	var a = document.getElementById("1280_ad");
	a.lastElementChild.remove();
	a.lastElementChild.remove();
	a.lastElementChild.remove();
})();