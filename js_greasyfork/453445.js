// ==UserScript==
// @name        动漫花园净化（首页+）
// @namespace   Violentmonkey Scripts
// @match       https://share.dmhy.org/
// @match       https://share.dmhy.org/topics/list/page/*
// @grant       none
// @version     1.0
// @author      RoachLin
// @description 2022/9/30 00:00:00
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/453445/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%87%80%E5%8C%96%EF%BC%88%E9%A6%96%E9%A1%B5%2B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/453445/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%87%80%E5%8C%96%EF%BC%88%E9%A6%96%E9%A1%B5%2B%EF%BC%89.meta.js
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

	//表格上方“张贴分享”+滚动文字
	var a = document.getElementsByClassName("clear");
	a[1].remove();

	//表格内部顶栏左边
	var a = document.getElementsByClassName("fl");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}

	//表格内部顶栏右边
	var a = document.getElementsByClassName("fr");
	a[0].firstElementChild.remove();
	a[0].firstElementChild.remove();

	//表头“磁鏈”
	var a = document.getElementsByClassName("{sorter: false}");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}

	//表头“種子”
	var a = document.getElementsByClassName("{sorter: 'digit', sortInitialOrder: 'desc'} header");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}

	//表头“下載”
	var a = document.getElementsByClassName("{sorter: 'digit', sortInitialOrder: 'desc'} header");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}

	//表头“完成”
	var a = document.getElementsByClassName("{sorter: 'digit', sortInitialOrder: 'desc'} header");
	for (var i = a.length - 1; i >= 0; --i) {
		a[i].remove();
	}

	//表项“磁鏈”
	var a = document.getElementsByClassName("download-arrow arrow-magnet");
	for (var i = a.length - 1; i >= 0; --i) {
		var self = a[i].parentElement;
		var parent = self.parentElement;
		parent.removeChild(self);
	}

	//表项“種子”
	var a = document.getElementsByClassName("btl_1");
	for (var i = a.length - 1; i >= 0; --i) {
		var self = a[i].parentElement;
		var parent = self.parentElement;
		parent.removeChild(self);
	}

	//表项“下載”
	var a = document.getElementsByClassName("bts_1");
	for (var i = a.length - 1; i >= 0; --i) {
		var self = a[i].parentElement;
		var parent = self.parentElement;
		parent.removeChild(self);
	}

	//表格背景色变蓝
	var a = document.querySelectorAll("tr.odd");
	for (var i = 0; i < a.length; ++i) {
		a[i].className = "even";
	}

	//表项“完成”
	var a = document.querySelectorAll("tr.even");
	for (var i = a.length - 1; i >= 0; --i) {
		var self = a[i].lastElementChild.previousElementSibling;
		var parent = self.parentElement;
		parent.removeChild(self);
	}

	//底部“善意提醒”和“重要聲明”
	var a = document.getElementsByClassName("table");
	a[1].remove();
	a[1].remove();

	//底部信息
	var a = document.getElementById("1280_ad");
	a.lastElementChild.remove();
	a.lastElementChild.remove();
	a.lastElementChild.remove();
})();