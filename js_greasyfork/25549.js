// ==UserScript==
// @name        链接附加提取码
// @author      billypon
// @description 生成分享链接时自动附加提取码
// @version     1.0.3
// @namespace   http://www.canaansky.com/
// @match       *://pan.baidu.com/disk/*
// @run-at      document-idle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/25549/%E9%93%BE%E6%8E%A5%E9%99%84%E5%8A%A0%E6%8F%90%E5%8F%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/25549/%E9%93%BE%E6%8E%A5%E9%99%84%E5%8A%A0%E6%8F%90%E5%8F%96%E7%A0%81.meta.js
// ==/UserScript==

function listen(dialog, button, url, code) {
	var handler = function (event) {
		var target = event.target, list = target.classList;
		if (!list || !list.contains(dialog))
			return;
		console.debug("dialog", target);
		removeEventListener("DOMNodeInserted", handler);
		setTimeout(function () {
			button = target.querySelector(button);
			url = target.querySelector(url);
			code = target.querySelector(code);
			if (button && url && code) {
				console.debug("elements", button, url, code);
				button.addEventListener("click", function () {
					console.debug("url", url.value);
					if (!code.value)
						return;
					console.debug("code", code.value);
					setTimeout(function () {
						GM_setClipboard(url.value + "#" + code.value);
					});

				});
			}
		});
	}
	addEventListener("DOMNodeInserted", handler);
}

var domain = location.hostname.match(/\w+\.\w+$/)[0];
console.debug("domain", domain);
switch (domain) {
	case "baidu.com":
		listen("dialog-share", "#copyShare", ".share-url", ".share-password");
		break;
}

