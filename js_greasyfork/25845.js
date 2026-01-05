// ==UserScript==
// @name        提交截拦
// @author      billypon
// @description 阻止某些输入框按回车时自动提交表单，改为点击默认按钮
// @version     1.10.4
// @namespace   http://www.canaansky.com/
// @match       *://www.123wzwp.com/*
// @match       *://www.678pan.net/*
// @match       *://www.88pan.cc/*
// @match       *://hiyp.cc/*
// @match       *://www.sju.wang/*
// @match       *://www.wwp5.com/*
// @match       *://www.yousuwp.com/*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25845/%E6%8F%90%E4%BA%A4%E6%88%AA%E6%8B%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/25845/%E6%8F%90%E4%BA%A4%E6%88%AA%E6%8B%A6.meta.js
// ==/UserScript==

var domain = location.hostname.match(/\w+\.\w+$/)[0], path=location.pathname;
console.debug("domain", domain);

function prevent(input, button, element) {
	if (!element)
		element = document;
	input = element.querySelector(input);
	button = element.querySelector(button);
	console.debug("input", input);
	console.debug("button", button);
	if (!(input && button))
		return;
	input.addEventListener("keydown", function (event) {
		console.debug("keyCode", event.keyCode);
		if (event.keyCode != 13)
			return;
		button.click();
		event.preventDefault();
	});
}

function listen(dialog, input, button) {
	var handler = function (event) {
		var target = event.target, list = target.classList;
		if (!list || !list.contains(dialog))
			return;
		console.debug("dialog", target);
		removeEventListener("DOMNodeInserted", handler);
		setTimeout(function () {
			prevent(input, button, target);
		});
	}
	addEventListener("DOMNodeInserted", handler);
}

function startsWith(search, string) {
	search = search || "/down-";
	return (string || path).slice(0, search.length) == search;
}

switch (domain) {
	default:
		if (startsWith()) {
			prevent("#code", "#s1");
		}
}

