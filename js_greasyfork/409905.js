// ==UserScript==
// @name Taobao Buyer Show
// @namespace WildernessRanger
// @version 1.0
// @author Wilderness Ranger
// @description Display buyer show on desktop browsers.
// @match *://*.taobao.com/item*
// @match *://*.tmall.com/item*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/409905/Taobao%20Buyer%20Show.user.js
// @updateURL https://update.greasyfork.org/scripts/409905/Taobao%20Buyer%20Show.meta.js
// ==/UserScript==
"use strict";

(function() {
	let li = document.createElement("li");
	let ele = document.createElement("a");
	ele.className = "tb-tab-anchor";
	ele.textContent = "买家秀";
	ele.href="";
	ele.onclick = pop;
	li.appendChild(ele);
	document.getElementById("J_TabBar").appendChild(li);
})();

function pop() {
	let str = location.search;
	let id;
	if(str.indexOf("id=") != -1) {
		let st = str.indexOf("id=") + 3, ed = str.indexOf("&", st);
		if(ed == -1) ed = str.length;
		id = str.substring(st, ed);
	} else
		id = prompt("请输入宝贝ID：");
	if(id)
		window.open("//market.m.taobao.com/app/mtb/item-buyer-show/pages/?itemId=" + id, "_blank", "left=40, top=40, width=400, height=640, resizable=no, menubar=no, toolbar=no, status=no");
}
