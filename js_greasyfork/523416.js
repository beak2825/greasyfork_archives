// ==UserScript==
// @name         纽约时报查看更多
// @namespace    https://github.com/gui-ying233/MoreFreeNYT
// @version      1.0.4
// @description  去除纽约时报的订阅提示并显示更多内容（不一定能完全显示）
// @author       鬼影233
// @license      MIT
// @match        https://*.nytimes.com/*
// @exclude      https://*.nytimes.com/
// @exclude      https://*.nytimes.com/international/
// @exclude      https://*.nytimes.com/ca/
// @exclude      https://*.nytimes.com/es/
// @exclude      https://*.nytimes.com/section/*
// @icon         https://www.nytimes.com/favicon.ico
// @supportURL   https://github.com/gui-ying233/MoreFreeNYT/issues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523416/%E7%BA%BD%E7%BA%A6%E6%97%B6%E6%8A%A5%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/523416/%E7%BA%BD%E7%BA%A6%E6%97%B6%E6%8A%A5%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(() => {
	"use strict";
	if (
		["/", "/international/", "/ca/", "/es/", "/section/us"].includes(
			document.location.pathname
		)
	)
		return;
	const originalRemoveChild = Element.prototype.removeChild;
	Element.prototype.removeChild = function (...args) {
		if (
			args[0]?.classList?.contains("StoryBodyCompanionColumn") ||
			(args[0]?.tagName === "P" &&
				args[0].parentElement?.parentElement?.classList.contains(
					"StoryBodyCompanionColumn"
				))
		)
			return args[0];
		return originalRemoveChild.apply(this, args);
	};
	document.head.appendChild(
		Object.assign(document.createElement("style"), {
			textContent:
				'#gateway-content,div[id^=lire-ui],#body-container>div[data-testid="onsite-messaging-unit-athleticGateway"]{display:none}body,.vi-gateway-container{position:initial!important}div.vi-gateway-container>div[class^="css"]{background:initial}',
		})
	);
})();
