// ==UserScript==
// @name       notion去除右键
// @namespace   Violentmonkey Scripts
// @match       http://www.notion.so/*
// @match       https://www.notion.so/*
// @grant       none
// @version     1.1
// @author      lexur
// @description 2021/2/17 下午5:24:23
// @downloadURL https://update.greasyfork.org/scripts/421890/notion%E5%8E%BB%E9%99%A4%E5%8F%B3%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/421890/notion%E5%8E%BB%E9%99%A4%E5%8F%B3%E9%94%AE.meta.js
// ==/UserScript==



(() => {
	console.log('hello...world...,I am from ',location.href);
})();

(() => {
				window.oncontextmenu = function(e) {
				//取消默认的浏览器自带右键 很重要！！
				e.preventDefault();

				//获取我们自定义的右键菜单
				var menu = document.querySelector("#menu");

				//根据事件对象中鼠标点击的位置，进行定位
				menu.style.left = e.clientX + 'px';
				menu.style.top = e.clientY + 'px';

				//改变自定义菜单的宽，让它显示出来
				menu.style.width = '125px';
				menu.style.height = '125px';
			}
			//关闭右键菜单，很简单
			window.onclick = function(e) {
				//用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
				document.querySelector('#menu').style.height = 0;
			}
})();
