// ==UserScript==
// @name         Tumblr - No Login Wall
// @description  Tumblr - No Login Wall.
// @version      0.2
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
//
// @noframes
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// 
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512063/Tumblr%20-%20No%20Login%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/512063/Tumblr%20-%20No%20Login%20Wall.meta.js
// ==/UserScript==

GM_addStyle(`
	#glass-container,
	div[data-testid="scroll-container"] > div > div:last-child {
			display:none !important;
	}

	body {
			overflow: auto !important;
	}`);

unsafeWindow.addEventListener('scroll', e => {
	e.stopImmediatePropagation();
});