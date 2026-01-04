// ==UserScript==
// @name         web.archive.org查询
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在web.archive.org的URLs中查询当前网址，因为部分网址有一些个性化后缀，比如b站的vd_source
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/469921/webarchiveorg%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469921/webarchiveorg%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

setTimeout(add_button, 2000);

function add_button() {
	'use strict';
	add_container();

	var button1 = document.createElement("button");
	button1.textContent = "web.archive.org_urls";
	button1.style.display = "block";
	button1.style.fontSize = "1rem";
	button1.title = ""

	button1.onclick = function () {
		window.open('https://web.archive.org/web/*/'+location.href+'*');
		return;
	};
	background_color(button1);

	///////////

	var contain_ = document.querySelector("#container")
	contain_.appendChild(button1);
}

function add_container() {
	let Container = document.createElement('div');
	Container.id = "container";
	Container.style.position = "fixed";
	Container.style.right = "150px";
	Container.style.top = "300px";
	document.body.appendChild(Container);
}

function background_color(button) {
	button.onmouseover = function () {
		this.style.backgroundColor = 'cyan';
	};
	button.onmouseout = function () {
		this.style.backgroundColor = 'transparent';
	};
}