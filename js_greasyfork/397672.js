// ==UserScript==
// @name        知乎 - 强行启用暗色主题
// @description 根据网页源代码，很久以前，知乎网页版就已经有了暗色主题。设置项都有了。但官方迟迟不开放使用。等不下去了，先这样了。现已支持切换主题。使用按钮切换主题后，如果页面显示有错误，刷新即可。
// @namespace   RainSlide
// @author      RainSlide
// @license     blessing
// @icon        https://static.zhihu.com/static/favicon.ico
// @version     1.2
// @match       https://*.zhihu.com/*
// @inject-into context
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/397672/%E7%9F%A5%E4%B9%8E%20-%20%E5%BC%BA%E8%A1%8C%E5%90%AF%E7%94%A8%E6%9A%97%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/397672/%E7%9F%A5%E4%B9%8E%20-%20%E5%BC%BA%E8%A1%8C%E5%90%AF%E7%94%A8%E6%9A%97%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

"use strict";

const name = "data-theme";
const d = document.documentElement;

Object.defineProperties(
	this, {
		localTheme: {
			configurable: true,
			enumerable: false,
			get:    () => GM_getValue(name),
			set: value => GM_setValue(name, value)
		},
		pageTheme: {
			configurable: true,
			enumerable: false,
			get:    () => d.getAttribute(name),
			set: value => d.setAttribute(name, value)
		}
	}
);

const  dark = "dark";
const light = "light";

// 将 localTheme 的值同步至 pageTheme
const sync = () => {
	if (pageTheme !== localTheme) {
		pageTheme = localTheme;
	}
};

sync();
setInterval(sync, 2000);

// 强行启用暗色主题
localTheme === dark &&
document.addEventListener(
	"DOMContentLoaded", () => {
		const data = document.getElementById("js-initialData");
		if (data !== null) {
			data.textContent = data.textContent.replace(
				'"theme":"light"', '"theme":"dark"'
			);
		}
	}
);

// 切换主题
const switchTheme = () => {
	switch (localTheme) {
		case dark: pageTheme = localTheme = light; break;
		case light: pageTheme = localTheme = dark; break;
		default:
			console.warn("localTheme is not dark or light!");
			pageTheme = localTheme = dark;
	}
};

const label = "切换主题";

// 脚本管理器菜单按钮
typeof GM_registerMenuCommand === "function" &&
GM_registerMenuCommand(label, switchTheme);

// 页面右下角按钮
// 图标来自 Google Material Icons
const icon = `<svg xmlns="http://www.w3.org/2000/svg" class="Zi" aria-label="${ label }" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/></svg>`;

window.addEventListener(
	"load", () => {
		const buttons = document.querySelector('.CornerButtons');
		if (buttons !== null) {

			const container = document.createElement("div");
			const button = document.createElement("button");

			container.className = "CornerAnimayedFlex";

			button.type = "button";
			button.className = "Button CornerButton Button--plain";
			button.innerHTML = icon;

			button.setAttribute("aria-label", label);
			button.setAttribute("data-tooltip", label);
			button.setAttribute("data-tooltip-position", "left");
			button.setAttribute("data-tooltip-will-hide-on-click", "true");

			button.addEventListener("mouseenter", sync);
			button.addEventListener("focus", sync);
			button.addEventListener("click", switchTheme);

			container.appendChild(button);
			buttons.insertBefore(container, buttons.firstElementChild);

		}
	}
);

/*
<div class="CornerAnimayedFlex">
	<button data-tooltip="暗色主题" data-tooltip-position="left" data-tooltip-will-hide-on-click="true" aria-label="暗色主题" type="button" class="Button CornerButton Button--plain">
		<svg xmlns="http://www.w3.org/2000/svg" class="Zi" aria-label="暗色主题" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/></svg>
	</button>
</div>
*/
