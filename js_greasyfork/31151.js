// ==UserScript==
// @name         VK Quick Ban
// @namespace    https://yal.cc
// @version      1.0
// @description  Добавляет пункт "забанить" в контекстные меню на записях и комментариях.
// @author       YellowAfterlife
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31151/VK%20Quick%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/31151/VK%20Quick%20Ban.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var css = `
	.reply .ui_actions_menu_wrap {
		position: relative;
	}
	.reply .ui_actions_menu {
		right: -24px;
		top: 26px;
	}
	.reply .ui_actions_menu_wrap.shown .ui_actions_menu {
		top: 16px;
	}
	`;
	(function() {
		var q = document.createElement("style");
		q.type = "text/css";
		q.innerHTML = css;
		document.head.appendChild(q);
	})();
	function add(menu, text, func) {
		var item = document.createElement("a");
		item.className = "ui_actions_menu_item";
		item.appendChild(document.createTextNode(text));
		item.onclick = func;
		menu.appendChild(item);
	}
	function addBan(menu, post, text) {
		add(menu, text, function(_) {
			var gid = post.getAttribute("data-post-id");
			gid = parseInt(gid.substring(0, gid.indexOf("_")));
			if (gid < 0) gid *= -1;
			var uid = parseInt(post.querySelector(".author").getAttribute("data-from-id"));
			Wall.blockEx(gid, uid);
		});
	}
	function patch(menu, post) {
		menu.classList.add("cc_yal_quick_actions");
		addBan(menu, post, "Забанить");
	}
	function patchReply(button, reply){
		button.classList.add("cc_yal_quick_actions");
		// добавление 
		button.setAttribute("onmouseover", "uiActionsMenu.show(this);");
		button.setAttribute("onmouseout", "uiActionsMenu.hide(this);");
		button.classList.add("ui_actions_menu_wrap");
		var menu = document.createElement("div");
		menu.className = "ui_actions_menu _ui_menu cc_yal_quick_actions";
		//
		button.appendChild(menu);
		addBan(menu, reply, "Забанить");
	}
	function check() {
		var i;
		//
		var menus = document.querySelectorAll(".post .ui_actions_menu:not(.cc_yal_quick_actions)");
		for (i = 0; i < menus.length; i++) {
			var menu = menus[i];
			var post = menu;
			while (post) {
				if (post.classList.contains("post")) break;
				post = post.parentElement;
			}
			if (post) patch(menu, post);
		}
		//
		var reply_buttons = document.querySelectorAll(".reply .post_actions:not(.cc_yal_quick_actions)");
		for (i = 0; i < reply_buttons.length; i++) {
			var button = reply_buttons[i];
			var reply = button;
			while (reply) {
				if (reply.classList.contains("reply")) break;
				reply = reply.parentElement;
			}
			if (reply) patchReply(button, reply);
		}
	}
	check();
	setInterval(check, 7000);
})();