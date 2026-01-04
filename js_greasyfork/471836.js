// ==UserScript==
// @name         X-notion-topbar
// @namespace    http://tampermonkey.net/
// @description  消除 Notion 顶部提示
// @match        *://www.notion.so/*
// @match        *://*.notion.site/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/471836/X-notion-topbar.user.js
// @updateURL https://update.greasyfork.org/scripts/471836/X-notion-topbar.meta.js
// ==/UserScript==
(function() {
	function addStyle(styleString) {
		const style = document.createElement('style');
		style.textContent = styleString;
		document.head.append(style);
	}

	window.addEventListener('DOMContentLoaded', () => {
		addStyle(`
            .notion-topbar + div {
                display: none;
            }
        `)
	})
})();