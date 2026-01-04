// ==UserScript==
// @name         解除网页禁止拷贝
// @namespace    http://www.infosec-wiki.com/
// @version      0.1
// @description  去除百度分享、解除网页禁止拷贝
// @author       http://www.infosec-wiki.com/
// @match        http://*
// @match        https://*
// @match        https://elasticsearch.cn/*
// @run-at       document-start
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40864/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E7%A6%81%E6%AD%A2%E6%8B%B7%E8%B4%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/40864/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E7%A6%81%E6%AD%A2%E6%8B%B7%E8%B4%9D.meta.js
// ==/UserScript==


(function() {
	'use strict';

    // console.log("unblock");

	var arr_hook_event = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "onbeforecopy", "oncopy", "onmousemove", "onmouseup"];
	var arr_hook_event_bak = {};

	for(var i in arr_hook_event){
		var e = arr_hook_event[i];
		var _event = e.substr(2);
		// console.log("hook: " + e);

		var e_bak = window[e];
		arr_hook_event_bak[_event] = e_bak;
	}

	$(document).ready(function(){
		// console.log("ready...");

		for(var i in arr_hook_event){
			var onevent = arr_hook_event[i];
			var _event = onevent.substr(2);

			// console.log("unhook: " + onevent);

			document.addEventListener(_event, function(e) {
				// console.log("addEventListener trigger: " + _event);
				arr_hook_event_bak[_event];
				e.stopPropagation();
			}, true);

		}

	});


})();