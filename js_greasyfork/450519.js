// ==UserScript==
// @name         matsuri.icu 筛选单场直播中 指定用户的弹幕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  页面左侧会生成输入框，输入用户昵称，回车输入其他用户，点击“筛选”；使用时请先滑动页面至你想看到的所有信息的最底部
// @author       Ikaros
// @match        https://matsuri.icu/detail/*
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/zh-CN/scripts/450519
// @downloadURL https://update.greasyfork.org/scripts/450519/matsuriicu%20%E7%AD%9B%E9%80%89%E5%8D%95%E5%9C%BA%E7%9B%B4%E6%92%AD%E4%B8%AD%20%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E7%9A%84%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/450519/matsuriicu%20%E7%AD%9B%E9%80%89%E5%8D%95%E5%9C%BA%E7%9B%B4%E6%92%AD%E4%B8%AD%20%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E7%9A%84%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	// 使用时请先滑动页面至你想看到的所有信息的最底部
	console.log("matsuri.icu 筛选单场直播中 指定用户的弹幕 成功加载！");

	// 存储隐藏DOM的下标
	var hide_index = [];
	// 在页面左侧插入一个用户筛选框
	var body = document.getElementsByTagName("body")[0];
	var div = document.createElement("div");
	var show_hide_div = document.createElement("div");
	var screen_div = document.createElement("div");
	var textarea = document.createElement("textarea");
	var screen = document.createElement("button");
	var reset = document.createElement("button");
	div.style.position = "fixed";
	div.style.bottom = "5%";
	div.style.width = "300px";
	div.style.left = "10px";
	show_hide_div.style.width = "120px";
	show_hide_div.style.fontSize = "18px";
	show_hide_div.style.background = "#ef8400";
	show_hide_div.style.textAlign = "center";
	show_hide_div.style.padding = "5px";
	show_hide_div.style.cursor = "pointer";
	show_hide_div.innerText = "筛选用户☚";
	show_hide_div.onclick = function(){ show_hide(); };
	screen_div.setAttribute("id", "screen_div");
	screen_div.style.display = "none";
	textarea.setAttribute("id", "textarea1");
	textarea.setAttribute("rows", "10");
	textarea.setAttribute("cols", "30");
	textarea.setAttribute("placeholder", "输入用户昵称，回车输入其他用户，点击“筛选”；\n\
点击“重置”恢复数据；\
使用时请先滑动页面至你想看到的所有信息的最底部");
	screen.innerText = "筛选";
	screen.style.fontSize = "18px";
	screen.style.width = "100px";
	screen.style.margin = "0px 10px";
	screen.onclick = function(){ hide_other(); };
	reset.innerText = "重置";
	reset.style.fontSize = "18px";
	reset.style.width = "100px";
	reset.onclick = function(){ reset_dom(); };
	div.appendChild(show_hide_div);
	div.appendChild(screen_div);
	screen_div.appendChild(textarea);
	screen_div.appendChild(screen);
	screen_div.appendChild(reset);
	body.appendChild(div);

	// 显示隐藏筛选框
	function show_hide() {
		var screen_div = document.getElementById("screen_div");
		if(screen_div.style.display == "none") screen_div.style.display = "block";
		else screen_div.style.display = "none";
	}

	// 重置弹幕
	function reset_dom() {
		for(var i = 0; i < hide_index.length; i++) {
			document.getElementsByClassName("comment")[hide_index[i]].style.removeProperty("height");
			document.getElementsByClassName("comment")[hide_index[i]].style.removeProperty("visibility");
			document.getElementsByClassName("comment")[hide_index[i]].style.removeProperty("padding");
		}

		hide_index = [];
	}

	// 隐藏无关用户
	function hide_other() {
		// 隐藏前 先重置一下
		reset_dom();

		// icu弹幕筛选指定用户名数据
		var comment = document.getElementsByClassName("comment");
		var username = document.getElementsByClassName("username");
		var len = username.length;

		var need_username = document.getElementById("textarea1").value.split('\n');

		for(var i = 0; i < len; i++) {
			if(need_username.indexOf(username[i].innerText) == -1) {
				comment[i].style.height = "0px";
				comment[i].style.visibility = "hidden"; 
				comment[i].style.padding = 0;

				hide_index.push(i);
			}
		}
	}
	

})