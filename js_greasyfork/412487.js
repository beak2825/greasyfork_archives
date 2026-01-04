// ==UserScript==
// @name              <iframe> click to load
// @name:zh-CN        手动加载 <iframe>
// @description       Reduce some unnecessary resource consumption by suspend the <iframe>s with larger area. NOT lazyload; click a button instead anywhere in the whole <iframe> element so one won't mis-click.
// @description:zh-CN 默认不载入面积较大的 <iframe> 元素，减免一部分不必要的资源消耗。不是 lazyload；点击按钮（而不是点击 <iframe> 的任意位置）才会加载，以免误触。
// @namespace         RainSlide
// @author            RainSlide
// @version           1.3
// @match             *://*/*
// @exclude-match     *://web.archive.org/web/*
// @exclude-match     *://codepen.io/*
// @exclude-match     *://music.163.com/*
// @exclude-match     *://*.chaoxing.com/*
// @grant             none
// @inject-into       content
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/412487/%3Ciframe%3E%20click%20to%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/412487/%3Ciframe%3E%20click%20to%20load.meta.js
// ==/UserScript==

"use strict";

document.querySelectorAll('iframe').forEach(

	iframe => {

		const src    = iframe.getAttribute("src");
		const srcdoc = iframe.getAttribute("srcdoc");
		const width  = iframe.clientWidth;
		const height = iframe.clientHeight;

		const srcURL =
			src !== null &&
			src !== "" && // less try ... catch
			(() => {
				try {
					return new URL(src);
				} catch (e) {
					return false;
				}
			})();

		// attribute
		// src should be an vaild HTTP/HTTPS URL with a non-null origin,
		// srcdoc attribute should not exist
		srcURL instanceof URL &&
		srcURL.origin !== "null" &&
		/^https?:$/.test(srcURL.protocol) &&
		srcdoc === null &&

		// content size
		// padding of <iframe> included
		width  >= 72 &&
		height >= 72 &&
		( width + height ) >= 256 &&

		iframe.setAttribute("srcdoc",

`<style>${
`html, body {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
html {
	min-width: 5em;
	min-height: 100%;
	border: 2px dashed currentColor;
	box-sizing: border-box;
}
a {
	margin-bottom: 1ex;
	word-break: break-all;
	font-family: monospace;
}`.replace(/\n\t/g, " ").replace(/;\n\}/g, "; }")
}</style>
<a href="${ iframe.src }" target="_blank" rel="noreferrer noopener">${ iframe.src }</a>
<button onclick="window.frameElement.removeAttribute('srcdoc')">${
	new Map([
		["en-US", "Load"],
		["zh-CN", "加载"],
		["zh-TW", "加載"],
		["zh-HK", "加載"]
	]).get( navigator.language ) || "Load"
}</button>`

		);

	}

);
