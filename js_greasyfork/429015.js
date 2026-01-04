// ==UserScript==
// @name         神巴水本
// @namespace    https://github.com/mccleaner/robscript/
// @version      0.1
// @description  自动点击水本按钮。
// @author       MC清理大师
// @match        http://sp.pf.mbga.jp/12007160/*
// @icon         http://sp.pf.mbga.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429015/%E7%A5%9E%E5%B7%B4%E6%B0%B4%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429015/%E7%A5%9E%E5%B7%B4%E6%B0%B4%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';
	console.log('神巴水本脚本：加载');
	var start = document.createElement("button");
	start.id = "114514";
	start.textContent = "►";
	start.style.width = "60px";
	start.style.height = "20px";
	start.style.align = "center";
	start.onclick = function (){
		console.log('神巴水本脚本：开始');
		var event = document.createEvent('Events');
		event.initEvent('touchend', true, true);
		window.b = setInterval(function(){
			//document.querySelectorAll('#play')[0].dispatchEvent(event);
			//document.querySelectorAll('#user_battle_load_main')[0].dispatchEvent(event);
			document.getElementsByClassName("touch-area-1")[0].dispatchEvent(event);
		},3000);
		return;
	}
    var stop = document.createElement("button");
	stop.id = "1919810";
	stop.textContent = "■";
	stop.style.width = "60px";
	stop.style.height = "20px";
	stop.style.align = "center";
	stop.onclick = function (){
	console.log('神巴水本脚本：停止');
	clearInterval(b);
	return;
	}
	document.getElementsByClassName("game-header")[0].appendChild(start);
	document.getElementsByClassName("game-header")[0].appendChild(stop);
})();